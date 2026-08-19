/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getOrganizationSchema, getWebSiteSchema, getLocalBusinessSchema, getBreadcrumbSchema, getCustomerFaqSchema, getCategoryServiceSchema } from './lib/seoSchemas';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { store } from './store';
import { AppState, ServiceCategory, UserRole } from './types';
import { normalizeServiceCategory } from './data';
import CustomerFlow from './components/CustomerFlow';
import CustomerDashboard from './components/CustomerDashboard';
import SpecialistDashboard from './components/SpecialistDashboard';
import OperatorDashboard from './components/OperatorDashboard';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import NordBaseLogo from './components/NordBaseLogo';
import LoginScreen from './components/LoginScreen';
import PartnerLandingPage from './components/PartnerLandingPage';
import LiveLeadsMarquee from './components/LiveLeadsMarquee';
import KnowledgeBase from './components/KnowledgeBase';
import HowNordBaseWorks from './components/HowNordBaseWorks';
import GeoServiceLanding from './components/GeoServiceLanding';
import Footer from './components/Footer';
import PitchDeck from './components/PitchDeck';
import CalculatorsPage from './components/calculators/CalculatorsPage';
import {
  Settings,
  RefreshCw,
  PlusCircle,
  Wrench,
  Headphones,
  Shield,
  User,
  LogOut,
  Clock,
  CheckCircle,
  Loader2,
  Sparkles,
  ShieldAlert,
  Building2,
  BookOpen,
  WifiOff,
  HelpCircle,
  ArrowLeft,
  Calculator
} from 'lucide-react';
export default function App() {
  const { t, i18n } = useTranslation();
  const [state, setState] = useState<AppState>(store.getState());
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Chat Auto-Scroll Observer
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const target = mutation.target;
          if (
            target && target.id && (
              target.id === 'customer-chat-history' || 
              target.id === 'specialist-chat-history' || 
              target.id === 'op-chat-history' ||
              target.id === 'superadmin-chat-history'
            )
          ) {
            target.scrollTop = target.scrollHeight;
          }
        }
      });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    return () => observer.disconnect();
  }, []);

  // Listen to the store state changes
  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);
  // Handler Actions
  const handleRoleChange = (role: any) => {
    store.setRole(role);
  };
  const handleSelectCity = (city: string | null) => {
    store.setSelectedCity(city);
  };
  const handleSelectCategory = (category: ServiceCategory | null) => {
    store.setSelectedCategory(category);
  };
  const handleSubmitRequest = (
    name: string,
    phone: string,
    location: string,
    description: string
  ) => {
    return store.createJobRequest(name, phone, location, description);
  };
  const handleSubmitRequestCustomer = (
    name: string,
    phone: string,
    location: string,
    description: string,
    attachments: string[] = [],
    operatorId: string | null = null,
    hubId?: string
  ) => {
    return store.createJobRequest(name, phone, location, description, attachments, operatorId, hubId);
  };
  const handleClaimJob = (jobId: string, operatorId: string) => {
    store.claimJob(jobId, operatorId);
  };
  const handleOfferJob = (
    jobId: string,
    hours: number,
    value: number,
    leadPrice: number,
    notes: string,
    specialistIds: string[]
  ) => {
    store.offerJobToSpecialists(jobId, hours, value, leadPrice, notes, specialistIds);
  };
  const handleSelectSpecialistForJob = (jobId: string, specialistId: string) => {
    store.selectSpecialistForJob(jobId, specialistId);
  };
  const handleExpressInterest = (jobId: string, specialistId: string) => {
    return store.expressInterest(jobId, specialistId);
  };
  const handleUnlockJob = (jobId: string, specialistId: string) => {
    return store.unlockJob(jobId, specialistId);
  };
  const handleCompleteJob = (jobId: string) => {
    store.completeJob(jobId);
  };
  const handleAddMessageCustomer = (
    jobId: string,
    sender: 'customer',
    senderName: string,
    content: string,
    channel?: 'customer_operator' | 'customer_specialist',
    attachmentUrl?: string,
    attachmentName?: string
  ) => {
    store.addMessage(jobId, sender, senderName, content, channel, attachmentUrl, attachmentName);
  };
  const handleAddMessageSpecialist = (
    jobId: string,
    sender: 'specialist',
    senderName: string,
    content: string,
    channel?: 'operator_specialist' | 'customer_specialist',
    attachmentUrl?: string,
    attachmentName?: string
  ) => {
    store.addMessage(jobId, sender, senderName, content, channel, attachmentUrl, attachmentName);
  };
  const handleAddMessageOperator = (
    jobId: string,
    sender: 'operator',
    senderName: string,
    content: string,
    channel?: 'customer_operator' | 'operator_specialist' | 'operator_operator' | 'customer_specialist',
    attachmentUrl?: string,
    attachmentName?: string
  ) => {
    store.addMessage(jobId, sender, senderName, content, channel, attachmentUrl, attachmentName);
  };
  const handleTopupSpecialist = (specialistId: string, amount: number) => {
    store.topupSpecialist(specialistId, amount);
  };
  const handleCreateSpecialistProfile = (
    name: string,
    phone: string,
    category: ServiceCategory,
    city: string,
    categories?: ServiceCategory[],
    languages?: { language: string; level: 'basic' | 'conversational' | 'native' }[],
    tradeSkillLevel?: 'amateur' | 'pro' | 'expert',
    skillsDescription?: string,
    photoUrl?: string,
    verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[]
  ) => {
    store.createSpecialistProfile(name, phone, category, city, categories, languages, tradeSkillLevel, skillsDescription, photoUrl, verificationDocuments);
  };
  const handleSelectSpecialistProfile = (id: string) => {
    store.getState().activeSpecialistId = id;
    setState({ ...store.getState() });
  };
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [customerView, setCustomerView] = useState<'menu' | 'dashboard'>('menu');
  const [expectedLoginRole, setExpectedLoginRole] = useState<UserRole>('customer');
  const [isPartnerPage, setIsPartnerPage] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path === '/partner' ||
      path.startsWith('/partner/') ||
      path === '/become-a-partner' ||
      hash === '#/partner' ||
      hash === '#partner' ||
      search.includes('page=partner')
    );
  });
  const [isCalculatorsPage, setIsCalculatorsPage] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path === '/calculators' ||
      path === '/calculator' ||
      path === '/pricing-calculator' ||
      path.startsWith('/dashboard/calculators') ||
      hash === '#/calculators' ||
      hash === '#calculators' ||
      search.includes('page=calculators') ||
      search.includes('page=calculator')
    );
  });
  const [isHowItWorks, setIsHowItWorks] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path === '/how-it-works' ||
      path.startsWith('/how-it-works/') ||
      hash === '#/how-it-works' ||
      hash === '#how-it-works' ||
      search.includes('page=how-it-works')
    );
  });
  const [isKnowledgeBase, setIsKnowledgeBase] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.startsWith('/knowledge-base') || hash.startsWith('#/knowledge-base');
  });
  const [isPitchDeck, setIsPitchDeck] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path.startsWith('/pitch/') ||
      hash.startsWith('#/pitch/') ||
      search.includes('pitch=')
    );
  });
  const [pitchDeckLevel, setPitchDeckLevel] = useState<'tp' | 'rp' | 'investor'>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    const combined = `${path} ${hash} ${search}`;
    if (combined.includes('tp')) return 'tp';
    if (combined.includes('rp')) return 'rp';
    return 'investor';
  });
  const [kbArticleSlug, setKbArticleSlug] = useState<string | null>(null);
  const [geoRoute, setGeoRoute] = useState<{ regionSlug?: string; citySlug?: string; categorySlug?: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  // Unified URL to State sync (mount & navigation changes)
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const hash = location.hash.toLowerCase();
    const search = location.search.toLowerCase();
    const isCalculatorsRoute =
      path === '/calculators' ||
      path === '/calculator' ||
      path === '/pricing-calculator' ||
      path.startsWith('/dashboard/calculators') ||
      hash === '#/calculators' ||
      hash === '#calculators' ||
      search.includes('page=calculators') ||
      search.includes('page=calculator');
    const isHowItWorksRoute =
      path === '/how-it-works' ||
      path.startsWith('/how-it-works/') ||
      hash === '#/how-it-works' ||
      hash === '#how-it-works' ||
      search.includes('page=how-it-works');
    const isPartnerRoute =
      path === '/partner' ||
      path.startsWith('/partner/') ||
      path === '/become-a-partner' ||
      hash === '#/partner' ||
      hash === '#partner' ||
      search.includes('page=partner');
    const isKbRoute = path.startsWith('/knowledge-base') || hash.startsWith('#/knowledge-base');
    const isPitchDeckRoute =
      path.startsWith('/pitch/') ||
      hash.startsWith('#/pitch/') ||
      search.includes('pitch=');

    if (isCalculatorsRoute) {
      if (!isCalculatorsPage) setIsCalculatorsPage(true);
      if (isHowItWorks) setIsHowItWorks(false);
      if (isPartnerPage) setIsPartnerPage(false);
      if (isKnowledgeBase) setIsKnowledgeBase(false);
      if (isPitchDeck) setIsPitchDeck(false);
      if (geoRoute) setGeoRoute(null);
      return;
    }
    if (isHowItWorksRoute) {
      if (isCalculatorsPage) setIsCalculatorsPage(false);
      if (!isHowItWorks) setIsHowItWorks(true);
      if (isPartnerPage) setIsPartnerPage(false);
      if (isKnowledgeBase) setIsKnowledgeBase(false);
      if (isPitchDeck) setIsPitchDeck(false);
      if (geoRoute) setGeoRoute(null);
      return;
    }
    if (isPitchDeckRoute) {
      if (isCalculatorsPage) setIsCalculatorsPage(false);
      if (!isPitchDeck) setIsPitchDeck(true);
      if (isHowItWorks) setIsHowItWorks(false);
      if (isPartnerPage) setIsPartnerPage(false);
      if (isKnowledgeBase) setIsKnowledgeBase(false);
      if (geoRoute) setGeoRoute(null);
      const combined = `${path} ${hash} ${search}`;
      if (combined.includes('tp')) {
        if (pitchDeckLevel !== 'tp') setPitchDeckLevel('tp');
      } else if (combined.includes('rp')) {
        if (pitchDeckLevel !== 'rp') setPitchDeckLevel('rp');
      } else {
        if (pitchDeckLevel !== 'investor') setPitchDeckLevel('investor');
      }
      return;
    }
    if (isPartnerRoute) {
      if (isCalculatorsPage) setIsCalculatorsPage(false);
      if (!isPartnerPage) setIsPartnerPage(true);
      if (isHowItWorks) setIsHowItWorks(false);
      if (isKnowledgeBase) setIsKnowledgeBase(false);
      if (isPitchDeck) setIsPitchDeck(false);
      if (geoRoute) setGeoRoute(null);
      return;
    }
    if (isKbRoute) {
      if (isCalculatorsPage) setIsCalculatorsPage(false);
      if (!isKnowledgeBase) setIsKnowledgeBase(true);
      if (isHowItWorks) setIsHowItWorks(false);
      if (isPartnerPage) setIsPartnerPage(false);
      if (isPitchDeck) setIsPitchDeck(false);
      if (geoRoute) setGeoRoute(null);
      const parts = location.pathname.split('/knowledge-base');
      const rawSlug = parts[1] ? parts[1].replace(/^\//, '') : null;
      const slug = rawSlug || null;
      if (kbArticleSlug !== slug) setKbArticleSlug(slug);
      return;
    }
    // Check Geographic & Service Landing Routes
    const isGeoRoute =
      path === '/portugal' ||
      path === '/algarve' ||
      path.startsWith('/algarve/');

    if (isGeoRoute) {
      const parts = path.split('/').filter(Boolean);
      if (parts[0] === 'portugal') {
        setGeoRoute({ regionSlug: 'portugal' });
      } else if (parts[0] === 'algarve') {
        setGeoRoute({
          regionSlug: 'algarve',
          citySlug: parts[1],
          categorySlug: parts[2]
        });
      }
      if (isCalculatorsPage) setIsCalculatorsPage(false);
      setIsHowItWorks(false);
      setIsPartnerPage(false);
      setIsKnowledgeBase(false);
      setIsPitchDeck(false);
      return;
    } else {
      if (geoRoute) setGeoRoute(null);
    }
    // Normal app routes (when not partner landing or knowledge base or pitch deck or how it works)
    if (isCalculatorsPage) setIsCalculatorsPage(false);
    if (isHowItWorks) setIsHowItWorks(false);
    if (isPartnerPage) setIsPartnerPage(false);
    if (isKnowledgeBase) setIsKnowledgeBase(false);
    if (isPitchDeck) setIsPitchDeck(false);
    const isOperatorRoute =
      path === '/tp-portal' ||
      path.startsWith('/tp-portal');
    const isAdminRoute =
      path === '/rp-portal' ||
      path.startsWith('/rp-portal');
    const isSuperAdminRoute =
      path === '/superadmin/oleg' ||
      path.startsWith('/superadmin/oleg');
    const isProRoute = path.startsWith('/pro');
    const isDashboardRoute = path.startsWith('/dashboard');
    const isServiceRoute = path.startsWith('/services/');
    let routeNeedsLogin = false;
    let expectedRoleForLogin = state.currentRole;
    const currentUser = store.getState().currentUser;
    const allUsers = store.getState().users;

    const allowedSuperAdmins = ['timeplace.internal@gmail.com', 'ironstorm174@gmail.com', 'oleg'];
    const isSuperUserEmail = Boolean(
      currentUser && currentUser.email && allowedSuperAdmins.some(a => currentUser.email!.toLowerCase().includes(a) || a.includes(currentUser.email!.toLowerCase()))
    );

    if (isOperatorRoute) {
      const isOperator = currentUser && (currentUser.role === 'operator' || currentUser.role === 'super_admin' || isSuperUserEmail);
      const matchingPartnerUser = currentUser && allUsers.find(u => 
        (u.email && currentUser.email && u.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) && 
        (u.role === 'operator' || u.role === 'super_admin')
      );

      if (isOperator) {
        if (state.currentRole !== 'operator') handleRoleChange('operator');
      } else if (matchingPartnerUser) {
        store.setCurrentUser(matchingPartnerUser);
        handleRoleChange('operator');
      } else {
        if (state.currentRole !== 'operator') handleRoleChange('operator');
        setExpectedLoginRole('operator');
        expectedRoleForLogin = 'operator';
        routeNeedsLogin = true;
      }
    } else if (isAdminRoute) {
      const isRegional = currentUser && (currentUser.role === 'regional_admin' || currentUser.role === 'super_admin' || isSuperUserEmail);
      const matchingPartnerUser = currentUser && allUsers.find(u => 
        (u.email && currentUser.email && u.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) && 
        (u.role === 'regional_admin' || u.role === 'super_admin')
      );

      if (isRegional) {
        if (state.currentRole !== 'regional_admin') handleRoleChange('regional_admin');
      } else if (matchingPartnerUser) {
        store.setCurrentUser(matchingPartnerUser);
        handleRoleChange('regional_admin');
      } else {
        if (state.currentRole !== 'regional_admin') handleRoleChange('regional_admin');
        setExpectedLoginRole('regional_admin');
        expectedRoleForLogin = 'regional_admin';
        routeNeedsLogin = true;
      }
    } else if (isSuperAdminRoute) {
      const isSuper = currentUser && currentUser.role === 'super_admin';
      const matchingSuperUser = currentUser && allUsers.find(u => 
        (u.email && currentUser.email && u.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) && 
        u.role === 'super_admin'
      );

      if (isSuper) {
        if (state.currentRole !== 'super_admin') handleRoleChange('super_admin');
      } else if (matchingSuperUser) {
        store.setCurrentUser(matchingSuperUser);
        handleRoleChange('super_admin');
      } else if (isSuperUserEmail && currentUser) {
        // Authenticate authorized super admin specifically on this route
        const elevatedUser: AuthUser = {
          ...currentUser,
          role: 'super_admin',
          dashboardNumber: '01',
          specialistStatus: 'approved'
        };
        store.setCurrentUser(elevatedUser);
        handleRoleChange('super_admin');
      } else {
        if (state.currentRole !== 'super_admin') handleRoleChange('super_admin');
        setExpectedLoginRole('super_admin');
        expectedRoleForLogin = 'super_admin';
        routeNeedsLogin = true;
      }
    } else if (isProRoute) {
      if (currentUser && currentUser.role === 'specialist') {
        if (state.currentRole !== 'specialist') handleRoleChange('specialist');
      } else {
        if (state.currentRole !== 'specialist') handleRoleChange('specialist');
        setExpectedLoginRole('specialist');
        expectedRoleForLogin = 'specialist';
        routeNeedsLogin = true;
      }
    } else if (isDashboardRoute) {
      if (currentUser) {
        if (state.currentRole !== 'customer') handleRoleChange('customer');
        if (customerView !== 'dashboard') setCustomerView('dashboard');
      } else {
        setExpectedLoginRole('customer');
        expectedRoleForLogin = 'customer';
        routeNeedsLogin = true;
      }
    } else if (isServiceRoute) {
      const rawCat = location.pathname.split('/')[2];
      const cat = normalizeServiceCategory(rawCat);
      if (state.currentRole !== 'customer') handleRoleChange('customer');
      if (customerView !== 'menu') setCustomerView('menu');
      if (cat && state.selectedCategory !== cat) handleSelectCategory(cat);
    } else if (path === '/' || path === '') {
      if (state.currentRole === 'customer') {
        if (customerView !== 'menu') setCustomerView('menu');
      }
      if (currentUser && currentUser.role && state.currentRole !== currentUser.role) {
        handleRoleChange(currentUser.role);
      }
    }
    if (routeNeedsLogin && (!currentUser || (expectedRoleForLogin && currentUser.role !== expectedRoleForLogin))) {
      setShowLoginModal(true);
    }
  }, [location.pathname, location.hash, location.search]);
  if (isPitchDeck) {
    return (
      <div id="pitch-deck-wrapper">
        <PitchDeck
          initialLevel={pitchDeckLevel}
          onSelectLevel={(lvl) => {
            setPitchDeckLevel(lvl);
            const targetPath =
              lvl === 'tp'
                ? '/pitch/tp-secret'
                : lvl === 'rp'
                ? '/pitch/rp-secret'
                : '/pitch/investor-secret';
            if (location.pathname !== targetPath) {
              navigate(targetPath, { replace: true });
            }
          }}
          onNavigateHome={() => {
            setIsPitchDeck(false);
            navigate('/', { replace: true });
          }}
        />
      </div>
    );
  }
  if (isPartnerPage) {
    return (
      <div id="partner-app-wrapper" className="min-h-screen bg-slate-950">
        <PartnerLandingPage
          onNavigateHome={() => setIsPartnerPage(false)}
          onOpenAuth={(role) => {
            setExpectedLoginRole(role || 'specialist');
            setShowLoginModal(true);
          }}
          onSelectRole={(role) => {
            setExpectedLoginRole(role);
            setShowLoginModal(true);
          }}
        />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#11141c] via-[#0e1117] to-[#0a0c10] text-slate-100 flex flex-col font-sans selection:bg-cyan-600 selection:text-white" id="main-app-container">
      {isOffline && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-200 px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2 backdrop-blur-md sticky top-0 z-50">
          <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{t('offline.notice', 'Modo Offline Ativo — PWA a funcionar sem ligação à Internet. Os dados serão sincronizados ao reconectar.')}</span>
        </div>
      )}
      <Helmet htmlAttributes={{ lang: i18n.language }}>
        <title>{t('seo.homeTitle', 'NordBase.pt - Urgent Local Services in Portugal')}</title>
        <meta name="description" content={t('seo.homeDescription', 'Quick dispatch and coordination of urgent local services in Portugal. Connect with electricians, plumbers, and technicians.')} />
        
        {/* Private Dashboard Protection: Noindex on internal roles/dashboards */}
        {(state.currentRole !== 'customer' || customerView === 'dashboard' || isPitchDeck) ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : (
          <meta name="robots" content="index, follow" />
        )}

        {/* Canonical & Hreflang SEO Tags */}
        <link rel="canonical" href={isPartnerPage ? "https://nordbase.pt/partner" : state.selectedCategory ? `https://nordbase.pt/services/${state.selectedCategory}` : "https://nordbase.pt/"} />
        <link rel="alternate" hrefLang="pt" href={isPartnerPage ? "https://nordbase.pt/partner" : state.selectedCategory ? `https://nordbase.pt/services/${state.selectedCategory}` : "https://nordbase.pt/"} />
        <link rel="alternate" hrefLang="en" href={isPartnerPage ? "https://nordbase.pt/partner" : state.selectedCategory ? `https://nordbase.pt/services/${state.selectedCategory}` : "https://nordbase.pt/"} />
        <link rel="alternate" hrefLang="x-default" href={isPartnerPage ? "https://nordbase.pt/partner" : state.selectedCategory ? `https://nordbase.pt/services/${state.selectedCategory}` : "https://nordbase.pt/"} />
        {/* JSON-LD Microdata for Search Engines */}
        <script type="application/ld+json">{JSON.stringify(getOrganizationSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(getWebSiteSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(getCustomerFaqSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(getBreadcrumbSchema([
          { name: 'Home', url: 'https://nordbase.pt/' },
          ...(isPartnerPage ? [{ name: 'Partner Franchise', url: 'https://nordbase.pt/partner' }] : []),
          ...(state.selectedCategory ? [{ name: state.selectedCategory, url: `https://nordbase.pt/services/${state.selectedCategory}` }] : [])
        ]))}</script>
        {state.selectedCategory && (
          <script type="application/ld+json">{JSON.stringify(getCategoryServiceSchema(state.selectedCategory))}</script>
        )}
      </Helmet>
      
      {/* Sticky SuperAdmin Live Control Mode Banner */}
      {state.impersonatedUser && (
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 text-white px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-between z-[100] sticky top-0 font-bold text-xs sm:text-sm border-b border-amber-400/40">
          <div className="flex items-center gap-3">
            <span className="bg-black/40 px-2.5 py-1 rounded-lg font-mono uppercase tracking-widest text-amber-300 border border-amber-400/30 flex items-center gap-1.5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              ⚡ SuperAdmin Live Control Mode
            </span>
            <span className="text-white">
              Managing Dashboard: <strong className="font-mono text-amber-200 text-sm sm:text-base">{state.impersonatedUser.dashboardNumber || state.impersonatedUser.id}</strong>
              <span className="opacity-90 ml-2 font-normal hidden md:inline">
                ({state.impersonatedUser.name} • {state.impersonatedUser.role === 'regional_admin' ? 'Regional Director' : 'Territory Partner'} • {state.impersonatedUser.region || state.impersonatedUser.city || 'Portugal'})
              </span>
            </span>
          </div>
          <button
            onClick={() => {
              store.stopImpersonation();
              setState({ ...store.getState() });
            }}
            className="bg-white hover:bg-amber-100 text-slate-950 font-black px-4 py-1.5 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>← Return to SuperAdmin Main Panel (/01 SuperAdmin)</span>
          </button>
        </div>
      )}
      <header className="sticky top-0 z-40 py-2 sm:py-3.5 px-2.5 sm:px-6 w-full text-white border-b border-slate-800/80 bg-[#12151e]/90 backdrop-blur-md" id="app-compact-header">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div id="brand-logo-container" className="shrink-0">
              <NordBaseLogo onClick={() => { setIsHowItWorks(false); setIsPartnerPage(false); setIsKnowledgeBase(false); setIsPitchDeck(false); store.goToHome(); }} size="md" compactMobile={true} />
            </div>
          </div>
          {/* Compact User profile info & Log Out & Partner Button & How It Works link */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0" id="compact-user-profile">
            {/* Primary Navigation Item: How It Works */}
            <button
              onClick={() => {
                setIsHowItWorks(true);
                setIsPartnerPage(false);
                setIsKnowledgeBase(false);
                setIsPitchDeck(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-1.5 sm:px-2 py-1 text-[11px] sm:text-xs transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                isHowItWorks
                  ? 'text-white font-bold underline underline-offset-4 decoration-cyan-400'
                  : 'text-slate-300 hover:text-white font-medium'
              }`}
              title={i18n.language === 'en' ? 'How NordBase Works' : 'Como Funciona o NordBase'}
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{i18n.language === 'en' ? 'How it works' : 'Como funciona'}</span>
            </button>
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-white/10 shrink-0 text-[10px] sm:text-xs font-bold shadow-inner">
              <button
                onClick={() => i18n.changeLanguage('pt')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  i18n.language === 'pt' ? 'bg-cyan-500 text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Português"
              >
                PT
              </button>
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  i18n.language === 'en' ? 'bg-cyan-500 text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => i18n.changeLanguage('ru')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  i18n.language === 'ru' ? 'bg-cyan-500 text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Русский"
              >
                RU
              </button>
            </div>
            {state.currentUser ? (
              <>
                <div className="flex items-center gap-1.5 sm:gap-3">
                  {state.currentUser.photoUrl ? (
                    <img 
                      src={state.currentUser.photoUrl} 
                      alt="Avatar" 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-cyan-500/30 shrink-0 shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-900/40 flex items-center justify-center border-2 border-cyan-500/30 shrink-0">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                    </div>
                  )}
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] text-cyan-400 font-mono font-bold uppercase tracking-wider">{state.currentUser.role}</p>
                    <p className="text-sm font-medium text-white leading-none mt-1">{state.currentUser.name}</p>
                  </div>
                </div>
                {state.currentUser.role === 'customer' && (
                  <button
                    onClick={() => setCustomerView(customerView === 'menu' ? 'dashboard' : 'menu')}
                    className={`px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer border shrink-0 whitespace-nowrap ${
                      customerView === 'dashboard'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-blue-950/60 text-cyan-300 border-blue-900/50 hover:bg-blue-900/60 hover:text-white'
                    }`}
                    title={t('app.customerDashboard')}
                  >
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">{customerView === 'menu' ? t('app.customerDashboard') : t('app.mainMenu')}</span>
                    <span className="sm:hidden">{customerView === 'menu' ? 'Dash' : 'Menu'}</span>
                  </button>
                )}
                {state.currentUser.role === 'specialist' && (
                  <button
                    onClick={() => handleRoleChange('specialist')}
                    className="px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold bg-cyan-500 text-slate-950 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-400 transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
                    title={t('app.proCabinet')}
                  >
                    <Wrench className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('app.proCabinet')}</span>
                  </button>
                )}
                {state.currentUser.role === 'operator' && (
                  <button
                    onClick={() => handleRoleChange('operator')}
                    className="px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold bg-emerald-500 text-slate-950 border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
                    title={t('app.opsPortal')}
                  >
                    <Headphones className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('app.opsPortal')}</span>
                  </button>
                )}
                {state.currentUser.role === 'regional_admin' && (
                  <button
                    onClick={() => handleRoleChange('regional_admin')}
                    className="px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold bg-indigo-500 text-white border border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:bg-indigo-400 transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
                    title="RP Portal"
                  >
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span>RP Portal</span>
                  </button>
                )}
                {state.currentUser.role === 'super_admin' && (
                  <button
                    onClick={() => handleRoleChange('super_admin')}
                    className="px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold bg-amber-500 text-slate-950 border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:bg-amber-400 transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
                    title="Super Admin"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>HQ SuperAdmin</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    store.logout();
                    setCustomerView('menu');
                  }}
                  className="p-1 sm:p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs shrink-0"
                  title={t('app.exit')}
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
                  <span className="hidden md:inline">{t('app.exit')}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-full transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center cursor-pointer shrink-0 active:scale-95 border border-cyan-400/30"
                title={t('app.signIn')}
              >
                <User className="w-4 h-4 text-white shrink-0" />
              </button>
            )}
          </div>
        </div>
      </header>
      {/* Live Leads Running Ticker */}
      <LiveLeadsMarquee />
      {/* Main Perspective Portals */}
      <main className={`flex-1 w-full mx-auto px-3 sm:px-5 pt-4 pb-12 relative z-20 ${
        isCalculatorsPage
          ? 'max-w-[1850px] md:py-6'
          : isKnowledgeBase
            ? 'max-w-6xl md:py-6'
            : state.currentRole === 'operator' || state.currentRole === 'specialist' || state.currentRole === 'regional_admin' || (state.currentRole === 'customer' && customerView === 'dashboard')
              ? 'max-w-[1850px] md:py-6'
              : 'max-w-6xl md:py-16'
      }`}>
        {isCalculatorsPage ? (
          <div className="w-full space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <button
                onClick={() => {
                  setIsCalculatorsPage(false);
                  if (state.currentRole === 'super_admin') navigate('/superadmin/oleg');
                  else if (state.currentRole === 'regional_admin') navigate('/rp-portal');
                  else if (state.currentRole === 'operator') navigate('/tp-portal');
                  else if (state.currentRole === 'specialist') navigate('/pro');
                  else navigate('/');
                }}
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('app.backToDashboard', '← Вернуться назад')}</span>
              </button>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>NordBase Dynamic Work & Lead Pricing</span>
              </div>
            </div>
            <div className="bg-[#181a20]/90 border border-slate-800/80 rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-sm">
              <CalculatorsPage />
            </div>
          </div>
        ) : isHowItWorks ? (
          <HowNordBaseWorks
            onNavigateHome={() => {
              setIsHowItWorks(false);
              store.goToHome();
            }}
            onOpenCustomerOrder={() => {
              setIsHowItWorks(false);
              if (state.currentRole !== 'customer') handleRoleChange('customer');
              setCustomerView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : isKnowledgeBase ? (
          <KnowledgeBase
            initialArticleSlug={['customer', 'pricing', 'how-it-works', 'services'].includes(kbArticleSlug || '') ? null : kbArticleSlug}
            initialCategory={['customer', 'pricing', 'how-it-works', 'services'].includes(kbArticleSlug || '') ? kbArticleSlug : null}
            onNavigateHome={() => {
              setIsKnowledgeBase(false);
              setKbArticleSlug(null);
              navigate('/');
            }}
            onOpenOrderForm={() => {
              setIsKnowledgeBase(false);
              setKbArticleSlug(null);
              if (state.currentRole !== 'customer') handleRoleChange('customer');
              setCustomerView('menu');
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateGeo={(path) => {
              setIsKnowledgeBase(false);
              setKbArticleSlug(null);
              const parts = path.split('/').filter(Boolean);
              if (parts[0] === 'algarve' && parts[1]) {
                setGeoRoute({ regionSlug: 'algarve', citySlug: parts[1], categorySlug: parts[2] });
              } else if (parts[0] === 'portugal') {
                setGeoRoute({ regionSlug: 'portugal' });
              }
              navigate(path);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : geoRoute ? (
          <GeoServiceLanding
            regionSlug={geoRoute.regionSlug}
            citySlug={geoRoute.citySlug}
            categorySlug={geoRoute.categorySlug}
            onSelectCategoryAndCity={(cat, city) => {
              setGeoRoute(null);
              if (cat) handleSelectCategory(cat);
              if (city) {
                store.getState().selectedCity = city;
              }
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => {
              setGeoRoute(null);
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHowItWorks={() => {
              setGeoRoute(null);
              setIsHowItWorks(true);
              navigate('/how-it-works');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateKB={(slug) => {
              setGeoRoute(null);
              setIsKnowledgeBase(true);
              setKbArticleSlug(slug || null);
              navigate(slug ? `/knowledge-base/${slug}` : '/knowledge-base');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHubUrl={(url) => {
              const parts = url.split('/').filter(Boolean);
              if (parts[0] === 'portugal') {
                setGeoRoute({ regionSlug: 'portugal' });
              } else if (parts[0] === 'algarve') {
                setGeoRoute({
                  regionSlug: 'algarve',
                  citySlug: parts[1],
                  categorySlug: parts[2]
                });
              } else if (parts[0] === 'services') {
                setGeoRoute({ categorySlug: parts[1] });
              } else {
                setGeoRoute(null);
              }
              navigate(url);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
            {state.currentRole === 'customer' && (
              customerView === 'dashboard' && state.currentUser ? (
                <CustomerDashboard
                  currentUser={state.currentUser}
                  jobs={state.jobs}
                  onBackToMenu={() => setCustomerView('menu')}
                  onUpdateProfile={(name, phone) => {
                    store.onboardUser(state.currentUser!.id, 'customer', name, phone);
                    setState({ ...store.getState() });
                  }}
                  onAddMessage={handleAddMessageCustomer}
                  onLogout={() => {
                    store.logout();
                    setCustomerView('menu');
                  }}
                  onDeleteAccount={() => {
                    store.deleteAccount();
                    setCustomerView('menu');
                  }}
                />
              ) : (
                <CustomerFlow
                  key={state.homeResetCounter || 0}
                  selectedCategory={state.selectedCategory}
                  onSelectCategory={handleSelectCategory}
                  onSubmitRequest={handleSubmitRequestCustomer}
                  jobs={state.jobs}
                  onAddMessage={handleAddMessageCustomer}
                  currentUser={state.currentUser}
                  onOpenDashboard={() => setCustomerView('dashboard')}
                  onRequestLogin={() => { setExpectedLoginRole('customer'); setShowLoginModal(true); }}
                />
              )
            )}
            {state.currentRole === 'specialist' && (
              state.currentUser && (state.currentUser.role === 'specialist' || state.currentUser.role === 'super_admin') ? (
                <SpecialistDashboard
                  specialists={state.specialists}
                  jobs={state.jobs}
                  activeSpecialistId={state.activeSpecialistId}
                  onExpressInterest={handleExpressInterest}
                  onUnlockJob={handleUnlockJob}
                  onTopupSpecialist={handleTopupSpecialist}
                  onAddMessage={handleAddMessageSpecialist}
                  onCreateSpecialist={handleCreateSpecialistProfile}
                  onSelectSpecialist={handleSelectSpecialistProfile}
                  currentUser={state.currentUser}
                  onUpdateUser={(updated) => {
                    store.getState().currentUser = updated;
                    const idx = store.getState().users.findIndex(u => u.id === updated.id);
                    if (idx !== -1) store.getState().users[idx] = updated;
                    store.saveState();
                    setState({ ...store.getState() });
                  }}
                  onLogout={() => store.logout()}
                />
              ) : (
                <div className="bg-[#161922] border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-4 my-12 shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t('auth.specialistRequired', 'Specialist Cabinet Access Required')}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t('auth.specialistDesc', 'Please sign in or register your contractor profile to access market leads and specialist cabinet.')}
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => { setExpectedLoginRole('specialist'); setShowLoginModal(true); }}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      {t('app.signIn', 'Sign In / Register')}
                    </button>
                    <button
                      onClick={() => { store.setRole('customer'); navigate('/'); }}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                    >
                      {t('app.mainMenu', 'Return to Home')}
                    </button>
                  </div>
                </div>
              )
            )}
            {state.currentRole === 'operator' && (
              state.currentUser && (state.currentUser.role === 'operator' || state.currentUser.role === 'super_admin') ? (
                <OperatorDashboard
                  jobs={state.jobs}
                  onClaimJob={handleClaimJob}
                  onOfferJob={handleOfferJob}
                  onSelectSpecialist={handleSelectSpecialistForJob}
                  onCompleteJob={handleCompleteJob}
                  onAddMessage={handleAddMessageOperator}
                  activeOperatorId={state.activeOperatorId}
                />
              ) : (
                <div className="bg-[#161922] border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-4 my-12 shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t('auth.territoryPartnerRequired', 'Territory Partner Access Required')}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t('auth.territoryPartnerDesc', 'This terminal is restricted to active Territory Partners (Shift Operators). Please log in with your assigned partner credentials.')}
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => { setExpectedLoginRole('operator'); setShowLoginModal(true); }}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      {t('app.signIn', 'Sign In / Register')}
                    </button>
                    <button
                      onClick={() => { store.setRole('customer'); navigate('/'); }}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                    >
                      {t('app.mainMenu', 'Return to Home')}
                    </button>
                  </div>
                </div>
              )
            )}
            {state.currentRole === 'regional_admin' && (
              state.currentUser && (state.currentUser.role === 'regional_admin' || state.currentUser.role === 'super_admin') ? (
                <AdminDashboard 
                  jobs={state.jobs} 
                  specialists={state.specialists}
                  users={state.users}
                  inviteList={state.inviteList}
                  currentUser={state.currentUser}
                  onCreateLead={handleSubmitRequest}
                  onUpdateUsers={(updatedUsers) => {
                    store.updateUsers(updatedUsers);
                    setState({ ...store.getState() });
                  }}
                  onApproveSpecialist={store.approveSpecialist.bind(store)}
                  onRejectSpecialist={store.rejectSpecialist.bind(store)}
                  onInviteOperator={store.inviteOperator.bind(store)}
                  onRemoveOperatorInvite={store.removeOperatorInvite.bind(store)}
                />
              ) : (
                <div className="bg-[#161922] border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-4 my-12 shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t('auth.regionalPartnerRequired', 'Regional Partner Access Required')}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t('auth.regionalPartnerDesc', 'This terminal is restricted to authorized Regional Directors and Regional Partners. Please log in with your verified partner credentials.')}
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => { setExpectedLoginRole('regional_admin'); setShowLoginModal(true); }}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      {t('app.signIn', 'Sign In / Register')}
                    </button>
                    <button
                      onClick={() => { store.setRole('customer'); navigate('/'); }}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                    >
                      {t('app.mainMenu', 'Return to Home')}
                    </button>
                  </div>
                </div>
              )
            )}
            {state.currentRole === 'super_admin' && (
              state.currentUser && state.currentUser.role === 'super_admin' ? (
                <SuperAdminDashboard
                  jobs={state.jobs}
                  specialists={state.specialists}
                  users={state.users}
                  auditLogs={state.auditLogs || []}
                  supportTickets={state.supportTickets || []}
                  suggestions={state.suggestions || []}
                  notifications={state.notifications || []}
                  onCreateLead={handleSubmitRequest}
                  onUpdateUsers={(updatedUsers) => {
                    store.updateUsers(updatedUsers);
                    setState({ ...store.getState() });
                  }}
                  onUpdateJobs={(updatedJobs) => {
                    store.getState().jobs = updatedJobs;
                    store.saveState();
                    setState({ ...store.getState() });
                  }}
                  onAddAuditLog={(action, actorName, actorRole, territory, details) => {
                    store.addAuditLog(action, actorName, actorRole, territory, details);
                    setState({ ...store.getState() });
                  }}
                />
              ) : (
                <div className="bg-[#161922] border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-4 my-12 shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t('auth.superAdminRequired', 'Super Admin Access Restricted')}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t('auth.superAdminDesc', 'This terminal requires administrator privileges. Please log in with master credentials.')}
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => { setExpectedLoginRole('super_admin'); setShowLoginModal(true); }}
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      {t('app.signIn', 'Sign In')}
                    </button>
                    <button
                      onClick={() => { store.setRole('customer'); navigate('/'); }}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                    >
                      {t('app.mainMenu', 'Return to Home')}
                    </button>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </main>
      {/* Footer component with Knowledge Base & Territory links */}
      <Footer
        onOpenKnowledgeBase={(slug) => {
          setGeoRoute(null);
          setIsHowItWorks(false);
          setIsKnowledgeBase(true);
          setKbArticleSlug(slug || null);
          navigate(slug ? `/knowledge-base/${slug}` : '/knowledge-base');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHowItWorks={() => {
          setGeoRoute(null);
          setIsKnowledgeBase(false);
          setIsPartnerPage(false);
          setIsHowItWorks(true);
          navigate('/how-it-works');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPartnerLanding={() => {
          setGeoRoute(null);
          setIsHowItWorks(false);
          setIsPartnerPage(true);
          setIsKnowledgeBase(false);
          navigate('/partner');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoHome={() => {
          setGeoRoute(null);
          setIsHowItWorks(false);
          setIsKnowledgeBase(false);
          setIsPartnerPage(false);
          store.goToHome();
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateGeo={(region, city, category) => {
          setIsHowItWorks(false);
          setIsKnowledgeBase(false);
          setIsPartnerPage(false);
          let target = '/';
          if (region === 'portugal') target = '/portugal';
          else if (region === 'algarve') {
            target = '/algarve';
            if (city) target += `/${city.toLowerCase()}`;
            if (category) target += `/${category.toLowerCase()}`;
          } else if (category) {
            target = `/services/${category.toLowerCase()}`;
          }
          setGeoRoute({
            regionSlug: region,
            citySlug: city ? city.toLowerCase() : undefined,
            categorySlug: category ? category.toLowerCase() : undefined
          });
          navigate(target);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      {/* Login & Onboarding Modal overlay */}
      {(showLoginModal || (state.currentUser && state.currentUser.isNewUser)) && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-2 sm:p-6 flex items-start sm:items-center justify-center min-h-screen animate-in fade-in duration-200" 
          id="login-modal-overlay"
        >
          <div className="bg-[#0A1128]/95 backdrop-blur-lg border border-blue-900/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
            {/* Show close button - always accessible */}
            <button
              onClick={() => {
                if (state.currentUser && state.currentUser.isNewUser) {
                  store.logout();
                } else {
                  setShowLoginModal(false);
                  if (!state.currentUser && state.currentRole !== 'customer') {
                    store.setRole('customer');
                    navigate('/', { replace: true });
                  }
                }
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/50 rounded-full w-8 h-8 flex items-center justify-center font-mono text-sm cursor-pointer transition-colors z-50 shadow-md"
              title={state.currentUser && state.currentUser.isNewUser ? "Exit Onboarding (Logout)" : "Close"}
            >
              ✕
            </button>
            <div className="overflow-y-auto max-h-full pr-0.5 custom-scrollbar">
              <LoginScreen
                expectedRole={expectedLoginRole}
                onLoginSuccess={async (email, phone, name, role, password, isRegistration, dashboardNumber, photoUrl) => {
                  const user = await store.authenticate(email, phone, name, role, password, dashboardNumber, isRegistration, photoUrl);
                  setShowLoginModal(false);
                  handleRoleChange(user.role || role);
                  setIsPartnerPage(false);
                  return user;
                }}
                onOnboardUser={(userId, role, name, phone, city, category) => {
                  store.onboardUser(userId, role as any, name, phone, city, category);
                  setShowLoginModal(false);
                  handleRoleChange(role);
                  setIsPartnerPage(false);
                }}
                currentUser={state.currentUser}
                onLogout={() => store.logout()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}