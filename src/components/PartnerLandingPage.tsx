import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getOrganizationSchema, getBreadcrumbSchema } from '../lib/seoSchemas';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Building2,
  Globe2,
  TrendingUp,
  Users,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  X,
  Sparkles,
  MapPin,
  Briefcase,
  Layers,
  Award,
  Lock,
  PhoneCall,
  Send,
  User
} from 'lucide-react';
import NordBaseLogo from './NordBaseLogo';
import TerritorialPartnerApplication from './TerritorialPartnerApplication';
import RegionalPartnerApplication from './RegionalPartnerApplication';
import { PORTUGAL_GEO } from '../lib/geo';
import { store } from '../store';
import { UserRole } from '../types';
interface PartnerLandingPageProps {
  onNavigateHome?: () => void;
  onOpenAuth?: (role?: UserRole) => void;
  onSelectRole?: (role: 'specialist' | 'customer' | 'operator') => void;
}
export default function PartnerLandingPage({
  onNavigateHome,
  onOpenAuth,
  onSelectRole,
}: PartnerLandingPageProps) {
  const { t, i18n } = useTranslation();
  // Modal State for TP & RP forms
  const [activeFormModal, setActiveFormModal] = useState<'tp' | 'rp' | 'specialist' | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: 'Faro',
    experience: '',
    currentActivity: '',
    teamSizeOrCapital: '',
    notes: '',
  });
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.location) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    const type = activeFormModal === 'rp' ? 'regional' : 'territorial';
    await store.submitPartnerApplication({
      type,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      location: formData.location,
      experience: formData.experience,
      currentActivity: formData.currentActivity,
      teamSizeOrCapital: formData.teamSizeOrCapital,
      notes: formData.notes,
    });
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };
  const closeModal = () => {
    setActiveFormModal(null);
    setSubmitSuccess(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      location: 'Faro',
      experience: '',
      currentActivity: '',
      teamSizeOrCapital: '',
      notes: '',
    });
  };
  const faqItems = [
    {
      q: 'What is a NordBase Territorial Partner (TP)?',
      a: 'A Territorial Partner (TP) manages NordBase operations in a specific municipality or city (e.g. Faro, Albufeira, Lagos). TPs coordinate local service specialists, manage incoming leads, and earn revenue from every completed job in their territory.',
    },
    {
      q: 'What is a NordBase Regional Partner (RP)?',
      a: 'A Regional Partner (RP) oversees entire administrative regions (e.g. Algarve, Lisboa, Porto). RPs expand the NordBase network by onboarding Territorial Partners, coordinating regional growth, and sharing top-tier partner commissions.',
    },
    {
      q: 'Do I get territory exclusivity as a TP or RP?',
      a: 'Yes. NordBase assigns exclusive territorial rights per city for Territorial Partners and per region for Regional Partners to prevent internal competition and guarantee focused business growth.',
    },
    {
      q: 'What investment or experience is required to apply?',
      a: 'We welcome local entrepreneurs, existing dispatch operators, real estate managers, and business builders. While prior business management or local market knowledge is an asset, NordBase provides complete software, training, and operational playbooks.',
    },
    {
      q: 'How does revenue sharing work for partners?',
      a: 'Partners receive direct margins on every verified lead unlocked by specialists within their territory, alongside automated performance bonuses and platform subscriptions.',
    },
    {
      q: 'What support does NordBase provide to partners?',
      a: 'We provide full access to our dispatch platform (CRM & Operator Workspaces), centralized marketing, client lead acquisition, specialist verification systems, and continuous regional admin support.',
    },
  ];
  // Schema.org FAQ Json-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
  if (activeFormModal === 'tp') {
    return (
      <TerritorialPartnerApplication
        onNavigateHome={() => setActiveFormModal(null)}
        onOpenAuth={onOpenAuth}
      />
    );
  }
  if (activeFormModal === 'rp') {
    return (
      <RegionalPartnerApplication
        onNavigateHome={() => setActiveFormModal(null)}
        onOpenAuth={onOpenAuth}
      />
    );
  }
  return (
    <div id="partner-landing-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <Helmet htmlAttributes={{ lang: i18n.language }}>
        <title>{t('partner.seoTitle', 'Partner Franchise Program Portugal | NordBase.pt')}</title>
        <meta name="description" content={t('partner.seoDescription', 'Become a Territorial or Regional Partner with NordBase.pt. Join Portugal\'s leading local service coordination network starting in Algarve.')} />
        <link rel="canonical" href="https://nordbase.pt/partner" />
        <link rel="alternate" hrefLang="pt" href="https://nordbase.pt/partner" />
        <link rel="alternate" hrefLang="en" href="https://nordbase.pt/partner" />
        <link rel="alternate" hrefLang="x-default" href="https://nordbase.pt/partner" />
      </Helmet>
      {/* Inject Microdata JSON-LD Schemas for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbSchema([
          { name: 'Home', url: 'https://nordbase.pt/' },
          { name: 'Partner Franchise', url: 'https://nordbase.pt/partner' }
        ])) }}
      />
      {/* Top Header Bar */}
      <header id="partner-header" className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={onNavigateHome}>
            <NordBaseLogo size="md" showDotPt={true} compactMobile={true} />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {/* Language Selector PT / EN */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs shrink-0">
              <button
                type="button"
                onClick={() => i18n.changeLanguage('pt')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  i18n.language === 'pt' || i18n.language.startsWith('pt')
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Português"
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => i18n.changeLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  i18n.language === 'en' || i18n.language.startsWith('en')
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="English"
              >
                EN
              </button>
            </div>
            <button
              id="partner-nav-home-btn"
              onClick={onNavigateHome}
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Marketplace
            </button>
            <button
              id="partner-nav-signin-btn"
              onClick={onOpenAuth}
              className="w-8 h-8 sm:w-9 sm:h-9 text-slate-900 bg-white hover:bg-slate-100 rounded-full transition-all shadow-md hover:shadow-slate-200/20 cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
              title="Sign In"
            >
              <User className="w-4 h-4 text-slate-900 shrink-0" />
            </button>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <main>
      <section id="partner-hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/50">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('partner.heroBadge')}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400">NordBase Partner</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Join Portugal’s trusted network of local professionals, territory managers, and regional business partners.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#partner-cards"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
            >
              <span>{t('partner.becomePartner', 'Become a Partner')}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#why-nordbase"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center"
            >
              {t('partner.learnMore', 'Learn More')}
            </a>
          </motion.div>
          {/* Photo Showcase Grid - Realistic & Inspiring */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-12 gap-4 max-w-6xl mx-auto text-left"
          >
            {/* Card 1: Verified Specialist */}
            <div className="md:col-span-4 relative group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                alt="Verified Specialist at work"
                className="w-full h-64 sm:h-72 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-600/90 text-white text-[11px] font-semibold mb-1.5 backdrop-blur-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('partner.verifiedSpecialist', 'Verified Specialist')}</span>
                </div>
                <p className="text-xs font-medium text-slate-200">
                  {t('partner.offerServices', 'Offer your professional services.')}
                </p>
              </div>
            </div>
            {/* Card 2: Territorial Partner */}
            <div className="md:col-span-5 relative group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Territorial Partner coordinating city network"
                className="w-full h-64 sm:h-72 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-500/90 text-white text-[11px] font-semibold mb-1.5 backdrop-blur-sm">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{t('partner.territorialPartner', 'Territorial Partner')}</span>
                </div>
                <p className="text-xs font-medium text-slate-200">
                  {t('partner.coordinateRequests', 'Coordinate customer requests.')}
                </p>
              </div>
            </div>
            {/* Card 3: Regional Partner */}
            <div className="md:col-span-3 relative group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
                alt="Regional Partner strategic leadership"
                className="w-full h-64 sm:h-72 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-indigo-600/90 text-white text-[11px] font-semibold mb-1.5 backdrop-blur-sm">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>{t('partner.regionalPartner', 'Regional Partner')}</span>
                </div>
                <p className="text-xs font-medium text-slate-200">
                  {t('partner.developNetwork', 'Develop the NordBase network across an entire region.')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Main 3 Cards Section */}
      <section id="partner-cards" className="py-16 md:py-24 bg-slate-950 text-slate-100 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              {t('partner.heroTitle', 'Become a NordBase Partner')}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              {t('partner.heroSubtitle', 'Join the leading service network in Algarve. Proven model, full training and continuous customer flow. Choose your partnership level.')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Verified Specialist */}
            <div id="card-verified-specialist" className="flex flex-col bg-slate-900 text-white rounded-2xl border border-slate-800 p-8 shadow-xl hover:border-blue-500/50 transition-all duration-300 relative group justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-6 font-bold text-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold rounded-md w-fit mb-3">
                  {t('partner.verifiedSpecialist', 'Verified Specialist')}
                </div>
                <h3 className="text-2xl font-bold text-white">{t('partner.verifiedSpecialist', 'Verified Specialist')}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {t('partner.receiveRequests', 'Receive qualified customer requests.')}
                </p>
              </div>
              <button
                id="btn-apply-specialist"
                onClick={() => {
                  if (onOpenAuth) {
                    onOpenAuth('specialist');
                  } else if (onSelectRole) {
                    onSelectRole('specialist');
                  }
                }}
                className="mt-8 w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{t('partner.becomeSpecialist', 'Become a Specialist')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {/* Card 2: Territorial Partner (TP) */}
            <div id="card-territorial-partner" className="flex flex-col bg-slate-900 text-white rounded-2xl border border-slate-800 p-8 shadow-xl hover:border-blue-500/50 transition-all duration-300 relative group justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-6 font-bold text-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold rounded-md w-fit mb-3">
                  {t('partner.tpSubtitle', 'Independent Business Operator')}
                </div>
                <h3 className="text-2xl font-bold text-white">{t('partner.territorialPartner', 'Territorial Partner')}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {t('partner.tpFeature1', 'Guaranteed territory and customer leads')}
                </p>
              </div>
              <button
                id="btn-apply-tp"
                onClick={() => setActiveFormModal('tp')}
                className="mt-8 w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{t('partner.heroApplyTP', 'Become a Territorial Partner')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {/* Card 3: Regional Partner (RP) */}
            <div id="card-regional-partner" className="flex flex-col bg-slate-900 text-white rounded-2xl border border-slate-800 p-8 shadow-xl hover:border-indigo-500/50 transition-all duration-300 relative group justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-6 font-bold text-xl">
                  <Globe2 className="w-6 h-6" />
                </div>
                <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-md w-fit mb-3">
                  {t('partner.rpSubtitle', 'Regional Franchise Owner')}
                </div>
                <h3 className="text-2xl font-bold text-white">{t('partner.regionalPartner', 'Regional Partner')}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {t('partner.rpFeature1', 'Exclusive rights over region or city')}
                </p>
              </div>
              <button
                id="btn-apply-rp"
                onClick={() => setActiveFormModal('rp')}
                className="mt-8 w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{t('partner.becomeRegionalPartner', 'Become a Regional Partner')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* How Do I Build a Business Section */}
      <section id="how-to-build-business" className="py-16 md:py-24 bg-slate-50 text-slate-900 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              How Do I Build a Business with NordBase?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              NordBase is more than a platform. It is a business ecosystem where every partner grows in a different way. Whether you are a skilled professional, a local coordinator or a regional leader, your success depends on the value you create for your community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Verified Specialist */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  <span>1. Verified Specialist</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Build Your Professional Business
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 mb-6">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Offer your professional services.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Receive qualified customer requests.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Choose which leads to accept.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Set your own service prices.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800">Keep 100% of the income you earn from completed jobs.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Your success depends on your skills, reputation and customer satisfaction.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500 italic">
                You build your own professional reputation.
              </div>
            </div>
            {/* 2. Territorial Partner */}
            <div className="bg-white rounded-2xl border-2 border-blue-500/40 p-7 sm:p-8 shadow-md flex flex-col justify-between hover:border-blue-600 transition-all relative">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-md mb-4">
                  <Building2 className="w-4 h-4" />
                  <span>2. Territorial Partner</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Build Your City Network
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 mb-6">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Coordinate customer requests.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Support verified specialists.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Maintain service quality.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Develop the NordBase community in your city.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-blue-900">Earn 40% of every qualified lead you successfully process.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-blue-900">Founding Territorial Partners receive 45%.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-blue-700 italic">
                Your income grows as your local community grows.
              </div>
            </div>
            {/* 3. Regional Partner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md mb-4">
                  <Globe2 className="w-4 h-4" />
                  <span>3. Regional Partner</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Build Your Regional Business
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 mb-6">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>Develop the NordBase network across an entire region.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>Support Territorial Partners.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>Expand the verified specialist network.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>Maintain regional quality standards.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-indigo-900">Earn 5% of every qualified lead generated in your region.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-indigo-900">Founding Regional Partners receive 7%.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-indigo-700 italic">
                Your success grows with the success of your entire region.
              </div>
            </div>
          </div>
          {/* Bottom Highlight Box */}
          <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              One Platform. Three Business Paths.
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3">
              Whether you choose to work as a Verified Specialist, lead your city as a Territorial Partner or develop an entire region as a Regional Partner, NordBase rewards long-term commitment, responsibility and community growth.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Income depends on your activity, your contribution to the network and the development of your local market.
            </p>
          </div>
        </div>
      </section>
      {/* Why NordBase Section */}
      <section id="why-nordbase" className="py-16 md:py-24 bg-slate-950 text-slate-100 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">Trust & Infrastructure</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">Why Partner with NordBase?</h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              We provide the tech, lead generation infrastructure, and brand authority so you can focus on building local relationships and managing trade services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Turnkey Software</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Access custom Territory Partner dispatch dashboards, specialist chat feeds, automated job distribution, and real-time financial logs.
              </p>
            </div>
            <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">High Client Demand</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                NordBase captures homeowner, expat, and hospitality service requests across Portugal through active SEO and local partnerships.
              </p>
            </div>
            <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Quality Standards</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Rigorous document verification, customer review systems, and structured dispute settlement ensure a premium brand experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="partner-faq" className="py-16 md:py-24 bg-white text-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">Everything you need to know about joining the NordBase Partner Program.</p>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-4 px-6 text-left font-semibold text-slate-900 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-sm sm:text-base pr-4">{item.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-6 bg-white border-t border-slate-200 text-slate-600 text-xs sm:text-sm leading-relaxed"
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Final CTA Banner */}
      <section id="final-cta" className="py-16 md:py-20 bg-gradient-to-r from-blue-900 via-slate-950 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Build NordBase in Your Territory?</h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Take advantage of growing demand for verified home and commercial services across Portugal. Submit your application today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveFormModal('tp')}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
            >
              <span>Apply for Territory (TP)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveFormModal('rp')}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-all"
            >
              Apply for Region (RP)
            </button>
          </div>
        </div>
      </section>
      {/* Footer */}
      </main>
      <footer id="partner-footer" className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateHome}>
            <NordBaseLogo size="sm" showDotPt={true} />
            <span className="text-xs text-slate-500">© 2026 NordBase. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-4 text-xs sm:text-sm text-slate-400">
            {/* Language Selector PT / EN */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs shrink-0">
              <button
                type="button"
                onClick={() => i18n.changeLanguage('pt')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  i18n.language === 'pt' || i18n.language.startsWith('pt')
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Português"
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => i18n.changeLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  i18n.language === 'en' || i18n.language.startsWith('en')
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="English"
              >
                EN
              </button>
            </div>
            <button onClick={onNavigateHome} className="hover:text-white transition-colors">
              Marketplace
            </button>
            <a href="#partner-cards" className="hover:text-white transition-colors">
              Partner Programs
            </a>
            <a href="#partner-faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <button onClick={onOpenAuth} className="hover:text-white transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </footer>
      {/* Application Form Modal (TP / RP) */}
      <AnimatePresence>
        {activeFormModal && (
          <div id="partner-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
              {submitSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Application Received!</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Thank you for applying to become a <strong className="text-blue-400">{activeFormModal === 'rp' ? 'Regional Partner' : 'Territorial Partner'}</strong> at NordBase. Your application has been stored securely and forwarded to our Super Admin Team.
                  </p>
                  <p className="text-xs text-slate-400">
                    Our National Director will review your profile and contact you within 24-48 hours.
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
                  >
                    Back to Partner Page
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                      {activeFormModal === 'rp' ? 'Regional Partner Application' : 'Territorial Partner Application'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      {activeFormModal === 'rp' ? 'Apply for Region (RP)' : 'Apply for City Territory (TP)'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Fill out the questionnaire below to reserve your target location in Portugal.
                    </p>
                  </div>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Full Name <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="e.g. Manuel Silva"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Phone / WhatsApp <span className="text-blue-400">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+351 912 345 678"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Email Address <span className="text-blue-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="partner@example.com"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {activeFormModal === 'rp' ? 'Target Region in Portugal' : 'Target City / Municipality'}{' '}
                        <span className="text-blue-400">*</span>
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        {activeFormModal === 'rp' ? (
                          <>
                            <option value="Algarve">Algarve Region</option>
                            <option value="Lisboa">Lisboa & Vale do Tejo</option>
                            <option value="Porto">Porto & Norte</option>
                            <option value="Centro">Centro Region</option>
                            <option value="Alentejo">Alentejo Region</option>
                          </>
                        ) : (
                          (PORTUGAL_GEO.find(r => r.name === 'Algarve')?.cities || []).map((city) => (
                            <option key={city.name} value={city.name}>
                              {city.name} (Algarve)
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Current Business / Activity
                      </label>
                      <input
                        type="text"
                        value={formData.currentActivity}
                        onChange={(e) => handleInputChange('currentActivity', e.target.value)}
                        placeholder="e.g. Real Estate Manager, Dispatcher, Trade Business"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {activeFormModal === 'rp' ? 'Investment / Capital Available' : 'Team Size / Resources'}
                      </label>
                      <input
                        type="text"
                        value={formData.teamSizeOrCapital}
                        onChange={(e) => handleInputChange('teamSizeOrCapital', e.target.value)}
                        placeholder={activeFormModal === 'rp' ? 'e.g. €10k - €25k planned' : 'e.g. 2 dispatchers, local network'}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Additional Notes / Goals
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Tell us about your local contacts or why you want to build NordBase here..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}