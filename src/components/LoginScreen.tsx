import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthUser, ServiceCategory, UserRole } from '../types';
import NordBaseLogo from './NordBaseLogo';
import {
  User,
  AlertCircle,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RotateCw,
  Lock,
  ExternalLink
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (
    email: string,
    phone: string,
    name: string,
    role: UserRole,
    password?: string,
    isRegistration?: boolean,
    dashboardNumber?: string,
    photoUrl?: string
  ) => AuthUser | Promise<AuthUser>;
  onOnboardUser: (userId: string, role: UserRole, name: string, phone: string, city?: string, category?: ServiceCategory) => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  expectedRole?: UserRole;
}

export default function LoginScreen({
  onLoginSuccess,
  onOnboardUser,
  currentUser,
  expectedRole = 'customer'
}: LoginScreenProps) {
  const { t } = useTranslation();

  const [activeRole, setActiveRole] = useState<UserRole>(expectedRole);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync expectedRole changes when props update
  useEffect(() => {
    setActiveRole(expectedRole);
  }, [expectedRole]);

  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding JWT', e);
      return null;
    }
  };

  const handleSuccessfulGoogleUser = useCallback(async (googleData: { email: string; name?: string; picture?: string }) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (!googleData.email) {
        throw new Error('Could not retrieve email from Google profile.');
      }
      const userName = googleData.name || googleData.email.split('@')[0];
      const user = await onLoginSuccess(
        googleData.email,
        '',
        userName,
        activeRole,
        undefined,
        false,
        undefined,
        googleData.picture
      );
      if (user.isNewUser) {
        onOnboardUser(user.id, activeRole, user.name, user.phone || '');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [activeRole, onLoginSuccess, onOnboardUser]);

  // Handle postMessage from OAuth popup fallback
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'OAUTH_AUTH_SUCCESS' && event.data.user) {
        const user = event.data.user;
        handleSuccessfulGoogleUser({
          email: user.email,
          name: user.name,
          picture: user.photoUrl
        });
      } else if (event.data && event.data.type === 'OAUTH_AUTH_ERROR') {
        setErrorMsg(event.data.error || 'Google login was cancelled or failed.');
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [handleSuccessfulGoogleUser]);

  // Initialize Google Identity Services
  useEffect(() => {
    let isMounted = true;

    const handleCredentialResponse = async (response: any) => {
      try {
        const idToken = response.credential;
        const decoded = decodeJwt(idToken);
        if (!decoded || !decoded.email) {
          throw new Error('Google credential invalid or missing email.');
        }
        await handleSuccessfulGoogleUser({
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture
        });
      } catch (err: any) {
        setErrorMsg(err.message || 'Google authorization error. Please try again.');
        setIsLoading(false);
      }
    };

    const defaultClientId = '107108300547-c42s30trn4g93c7qqmajb9amssd36dgh.apps.googleusercontent.com';

    const renderGsiButton = (clientId: string) => {
      if (!isMounted) return;
      const google = (window as any).google;
      if (google && google.accounts && google.accounts.id) {
        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const container = document.getElementById('google-signin-gsi-slot');
          if (container) {
            container.innerHTML = '';
            google.accounts.id.renderButton(container, {
              theme: 'filled_blue',
              size: 'large',
              width: 290,
              text: 'continue_with',
              shape: 'pill',
              logo_alignment: 'left',
            });
            setIsGsiLoaded(true);
          }
        } catch (e) {
          console.warn('GSI render error:', e);
        }
      }
    };

    const setupGoogleSignIn = (clientId: string) => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          renderGsiButton(clientId);
        };
        document.body.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          const google = (window as any).google;
          if (google && google.accounts && google.accounts.id) {
            clearInterval(checkInterval);
            renderGsiButton(clientId);
          }
        }, 100);
        setTimeout(() => clearInterval(checkInterval), 4000);
      }
    };

    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : { googleClientId: defaultClientId }))
      .then((config) => {
        setupGoogleSignIn(config.googleClientId || defaultClientId);
      })
      .catch(() => {
        setupGoogleSignIn(defaultClientId);
      });

    return () => {
      isMounted = false;
    };
  }, [activeRole, handleSuccessfulGoogleUser]);

  // Direct OAuth Popup Trigger Fallback
  const triggerGoogleOAuth = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const google = (window as any).google;
    if (google && google.accounts && google.accounts.id) {
      try {
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            openOAuthPopup();
          }
        });
        return;
      } catch (err) {
        console.warn('GSI prompt fallback to popup:', err);
      }
    }

    openOAuthPopup();
  };

  const openOAuthPopup = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to initialize Google OAuth connection.');
      }
      const data = await res.json();
      if (data.url) {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open(
          data.url,
          'GoogleSignIn',
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
        );
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          setErrorMsg('Popup was blocked by browser. Please allow popups or use the Google button.');
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error opening Google authentication window.');
      setIsLoading(false);
    }
  };

  const isPrivilegedRole = ['super_admin', 'regional_admin', 'operator'].includes(activeRole);

  const getRoleHeaderDetails = () => {
    switch (activeRole) {
      case 'regional_admin':
        return {
          title: 'Regional Partner / RP',
          subtitle: 'Authentication via authorized Google Account',
          badge: 'REGIONAL DIRECTOR (RP)',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        };
      case 'super_admin':
        return {
          title: 'Super Admin Access',
          subtitle: 'Strict security authentication via Google',
          badge: 'SUPER ADMIN',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        };
      case 'operator':
        return {
          title: 'Territory Partner / TP',
          subtitle: 'Shift operator terminal authentication',
          badge: 'TERRITORY PARTNER (TP)',
          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
        };
      case 'specialist':
        return {
          title: 'Specialist Registration & Login',
          subtitle: 'Contractor dashboard, leads & orders access',
          badge: 'SPECIALIST / PRO',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
      default:
        return {
          title: 'Customer Registration & Login',
          subtitle: 'Fast service booking & order tracking',
          badge: 'CUSTOMER',
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
        };
    }
  };

  const headerDetails = getRoleHeaderDetails();

  return (
    <div className="w-full max-w-sm mx-auto text-slate-100 animate-in fade-in zoom-in duration-300" id="standard-login-card">
      <div className="p-1 flex flex-col items-center">
        <NordBaseLogo size="md" className="mb-2 shrink-0" />

        {/* Role switcher tabs for public users (Customer vs Specialist) */}
        {!isPrivilegedRole && (
          <div className="w-full grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-4 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveRole('customer');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'customer'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('auth.roleCustomer', 'Customer')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveRole('specialist');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'specialist'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t('auth.roleSpecialist', 'Specialist')}</span>
            </button>
          </div>
        )}

        {/* Header Information */}
        <div className="text-center space-y-1 mb-4 w-full">
          <span className={`inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${headerDetails.badgeColor}`}>
            {headerDetails.badge}
          </span>
          <h3 className="text-base font-display font-black text-white tracking-tight">
            {headerDetails.title}
          </h3>
          <p className="text-xs text-slate-400 leading-snug">
            {headerDetails.subtitle}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 w-full p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-200 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Google-Exclusive Sign In & Registration Card */}
        <div className="w-full bg-slate-950/90 border border-slate-800/90 rounded-2xl p-5 text-center space-y-4 shadow-xl">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-200">
              {activeRole === 'specialist'
                ? 'Register contractor profile via Google'
                : activeRole === 'customer'
                ? 'Sign in or register with one click'
                : 'Authorized Google Account Required'}
            </div>
            <p className="text-[11px] text-slate-400">
              Strictly secure authentication. No passwords to remember.
            </p>
          </div>

          {/* Primary Rendered Google Identity Services Button Slot */}
          <div className="w-full flex justify-center items-center min-h-[44px]" ref={containerRef}>
            <div id="google-signin-gsi-slot" className="w-full flex justify-center items-center overflow-hidden">
              {/* Fallback Custom Google Button if GSI button is loading */}
              <button
                type="button"
                onClick={triggerGoogleOAuth}
                disabled={isLoading}
                className="w-full max-w-[290px] py-2.5 px-4 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xs rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center gap-3 border border-slate-200 hover:shadow-cyan-500/10 disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-xs text-cyan-400 font-mono py-1 animate-pulse">
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Authenticating Google session...</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-900 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Google OAuth 2.0 • 256-bit SSL Protection</span>
          </div>
        </div>

        {/* Reassurance footer */}
        <div className="mt-4 text-center space-y-1">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {activeRole === 'specialist'
              ? 'New specialists will be able to complete their city & trade profile right after Google sign in.'
              : activeRole === 'customer'
              ? 'Instant registration. Track your requests and communicate directly with specialists.'
              : 'Authorized partner accounts are linked by verified email address.'}
          </p>
        </div>
      </div>
    </div>
  );
}
