import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthUser, ServiceCategory, UserRole } from '../types';
import NordBaseLogo from './NordBaseLogo';
import {
  User,
  AlertCircle,
  Briefcase,
  ArrowLeft
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (
    email: string,
    phone: string,
    name: string,
    role: UserRole,
    password?: string,
    isRegistration?: boolean,
    dashboardNumber?: string
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

  // 2-step onboarding state: 'role_selection' -> 'auth'
  const [step, setStep] = useState<'role_selection' | 'auth'>(
    ['super_admin', 'regional_admin', 'operator'].includes(expectedRole) ? 'auth' : 'role_selection'
  );

  const [activeRole, setActiveRole] = useState<UserRole>(expectedRole);
  const [customEmail, setCustomEmail] = useState('');
  const [customDashboardNumber, setCustomDashboardNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync expectedRole changes when props update
  useEffect(() => {
    setActiveRole(expectedRole);
    if (['super_admin', 'regional_admin', 'operator'].includes(expectedRole)) {
      setStep('auth');
    }
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

  const handleManualEmailLogin = async (targetEmail?: string) => {
    const emailToUse = (targetEmail || customEmail).trim();
    if (!emailToUse) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const userName = emailToUse.split('@')[0];
      const user = await onLoginSuccess(
        emailToUse,
        '',
        userName,
        activeRole,
        undefined,
        false,
        customDashboardNumber.trim() || undefined
      );
      if (user.isNewUser) {
        onOnboardUser(user.id, activeRole, user.name, user.phone || '');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authorization failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step !== 'auth') return;
    let isMounted = true;

    const handleCredentialResponse = async (response: any) => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const idToken = response.credential;
        const decoded = decodeJwt(idToken);
        if (!decoded || !decoded.email) {
          throw new Error('Failed to retrieve Google account details.');
        }
        const userName = decoded.name || decoded.email.split('@')[0];
        const user = await onLoginSuccess(
          decoded.email,
          '',
          userName,
          activeRole,
          undefined,
          false,
          undefined
        );
        if (user.isNewUser) {
          onOnboardUser(user.id, activeRole, user.name, user.phone || '');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Google authorization error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const defaultClientId = '107108300547-c42s30trn4g93c7qqmajb9amssd36dgh.apps.googleusercontent.com';
    const setupGoogleSignIn = (clientId: string) => {
      if (!isMounted) return;
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      const initializeGSI = () => {
        const google = (window as any).google;
        if (google && isMounted) {
          try {
            google.accounts.id.initialize({
              client_id: clientId,
              callback: handleCredentialResponse,
              auto_select: false,
            });
            const container = document.getElementById('google-signin-container');
            if (container) {
              container.innerHTML = '';
              google.accounts.id.renderButton(container, {
                theme: 'filled_blue',
                size: 'large',
                width: 300,
                text: 'continue_with',
                shape: 'rectangular',
              });
            }
          } catch (e) {
            console.warn('Google Sign In init warning:', e);
          }
        }
      };

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGSI;
        document.body.appendChild(script);
      } else {
        const interval = setInterval(() => {
          const google = (window as any).google;
          if (google) {
            clearInterval(interval);
            initializeGSI();
          }
        }, 150);
      }
    };

    fetch('/api/config')
      .then((res) => {
        if (!res.ok) throw new Error('API config non-OK');
        return res.json();
      })
      .then((config) => {
        setupGoogleSignIn(config.googleClientId || defaultClientId);
      })
      .catch(() => {
        setupGoogleSignIn(defaultClientId);
      });

    return () => {
      isMounted = false;
    };
  }, [step, activeRole, onLoginSuccess, onOnboardUser]);

  const triggerGooglePrompt = () => {
    const google = (window as any).google;
    if (google && google.accounts && google.accounts.id) {
      google.accounts.id.prompt();
    } else {
      setErrorMsg('Google Sign In service is initializing. Please wait a moment or click the Google button.');
    }
  };

  const getRoleHeaderDetails = () => {
    switch (activeRole) {
      case 'regional_admin':
        return {
          title: 'Regional Director / RP Sign In',
          subtitle: 'Authentication via Google Account',
          badge: 'REGIONAL PARTNER (RP)',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
        };
      case 'super_admin':
        return {
          title: 'Super Admin Access',
          subtitle: 'Authentication via Google Account',
          badge: 'SUPER ADMIN',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
        };
      case 'operator':
        return {
          title: 'Territory Partner Access',
          subtitle: 'Authentication via Google Account',
          badge: 'TERRITORY PARTNER (TP)',
          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
        };
      case 'specialist':
        return {
          title: 'Specialist Cabinet Sign In',
          subtitle: 'Contractor dashboard & order lead access',
          badge: 'SPECIALIST',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
        };
      default:
        return {
          title: 'Customer Sign In',
          subtitle: 'Access customer orders and posted jobs',
          badge: 'CUSTOMER',
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
        };
    }
  };

  const headerDetails = getRoleHeaderDetails();

  return (
    <div className="w-full max-w-sm mx-auto bg-transparent text-slate-100 animate-in fade-in zoom-in duration-300" id="standard-login-card">
      <div className="p-1 flex flex-col items-center">
        <NordBaseLogo size="md" className="mb-3 shrink-0" />

        {errorMsg && (
          <div className="mb-3 w-full p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-200 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: ROLE SELECTION */}
        {step === 'role_selection' && (
          <div className="w-full space-y-4 animate-in fade-in duration-300">
            <div className="text-center mb-1">
              <h3 className="text-base font-display font-black text-white tracking-tight">
                {t('auth.chooseAccountType', 'Choose Account Type')}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Select how you would like to sign in to NordBase
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveRole('customer');
                  setStep('auth');
                }}
                className="group p-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 hover:border-cyan-400 hover:from-cyan-500/20 hover:to-blue-600/20 text-left transition-all cursor-pointer flex items-center gap-3 shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-display font-black text-white group-hover:text-cyan-300 transition-colors">
                    I am a Customer
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                    Post service requests, hire specialists, track job status.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveRole('specialist');
                  setStep('auth');
                }}
                className="group p-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-blue-900/40 to-slate-900 hover:border-cyan-400 hover:from-blue-900/60 hover:to-slate-800 text-left transition-all cursor-pointer flex items-center gap-3 shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-display font-black text-white group-hover:text-cyan-300 transition-colors">
                    I am a Specialist
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    Execute orders, receive verified leads, build contractor rating.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: AUTHENTICATION */}
        {step === 'auth' && (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between mb-1">
              <button
                type="button"
                onClick={() => setStep('role_selection')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Mudar de Papel / Change Role</span>
              </button>
            </div>

            <div className="text-center space-y-1 mb-2">
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${headerDetails.badgeColor}`}>
                {headerDetails.badge}
              </span>
              <h3 className="text-base font-display font-bold text-white">
                {headerDetails.title}
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                {headerDetails.subtitle}
              </p>
            </div>

            {/* Quick 1-Click Action for Super Admin */}
            {activeRole === 'super_admin' && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center space-y-2">
                <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5">
                  <span>⚡ Master Fast Access</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleManualEmailLogin('ironstorm174@gmail.com')}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  <span>Sign In as Oleg (ironstorm174@gmail.com)</span>
                </button>
              </div>
            )}

            {/* Google OAuth Section */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-center">
              <div className="text-xs text-slate-300 font-medium">
                {activeRole === 'super_admin' ? 'Or authenticate via authorized Google Account' : 'Sign in or register using your official Google Account'}
              </div>

              {/* Rendered Google GSI Container */}
              <div className="w-full flex justify-center py-1" id="google-signin-wrapper">
                <div id="google-signin-container" className="w-full max-w-[280px] min-h-[44px] flex justify-center items-center overflow-hidden">
                  <button
                    type="button"
                    onClick={triggerGooglePrompt}
                    className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>
              </div>

              {/* Direct email authentication fallback */}
              <div className="pt-2 border-t border-slate-800/80">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleManualEmailLogin();
                  }}
                  className="space-y-2 text-left"
                >
                  <div className="text-[10px] text-slate-400 font-medium">
                    {activeRole === 'super_admin' ? 'Authorized Email Address:' : 'Direct Email Sign In:'}
                  </div>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder={activeRole === 'super_admin' ? 'ironstorm174@gmail.com' : 'user@example.com'}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  {['operator', 'regional_admin'].includes(activeRole) && (
                    <input
                      type="text"
                      value={customDashboardNumber}
                      onChange={(e) => setCustomDashboardNumber(e.target.value)}
                      placeholder="Dashboard Number (e.g. 01, 02)"
                      className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-600 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Authenticating...' : 'Sign In with Email'}
                  </button>
                </form>
              </div>

              {isLoading && (
                <div className="text-xs text-cyan-400 font-mono animate-pulse">
                  Authenticating account...
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              Protected authentication system. Encrypted session credentials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
