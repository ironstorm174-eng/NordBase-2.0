import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Wrench, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Home, 
  Building2, 
  ChevronDown,
  Globe,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { ServiceCategory } from '../types';
import { 
  HUBS_DATA, 
  getHubBySlug, 
  getHubServiceBySlug, 
  isRouteIndexable,
  HubConfig,
  HubServiceConfig
} from '../data/hubSeoData';
import { 
  getOrganizationSchema, 
  getBreadcrumbSchema, 
  getLocalServiceSchema, 
  getCategoryServiceSchema, 
  getCustomerFaqSchema 
} from '../lib/seoSchemas';

interface GeoServiceLandingProps {
  regionSlug?: string;   // e.g. 'algarve', 'portugal'
  citySlug?: string;     // e.g. 'portimao', 'albufeira', 'faro'
  categorySlug?: string; // e.g. 'plumbing', 'electrical', 'cleaning'
  onSelectCategoryAndCity: (category?: ServiceCategory, cityName?: string) => void;
  onNavigateHome: () => void;
  onNavigateHowItWorks: () => void;
  onNavigateKB: (slug?: string) => void;
  onNavigateHubUrl: (url: string) => void;
}

export default function GeoServiceLanding({
  regionSlug = 'algarve',
  citySlug,
  categorySlug,
  onSelectCategoryAndCity,
  onNavigateHome,
  onNavigateHowItWorks,
  onNavigateKB,
  onNavigateHubUrl
}: GeoServiceLandingProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'pt';
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Indexation Check
  const indexable = isRouteIndexable(regionSlug, citySlug, categorySlug);
  const robotsMeta = indexable ? 'index, follow' : 'noindex, nofollow';

  // Lookup Hub and HubService from data
  const currentHub: HubConfig | undefined = citySlug ? getHubBySlug(regionSlug, citySlug) : undefined;
  const currentHubService: { hub: HubConfig; service: HubServiceConfig } | undefined = 
    (citySlug && categorySlug) ? getHubServiceBySlug(regionSlug, citySlug, categorySlug) : undefined;

  // Active Hub Reference (Portimão First)
  const activeHub = HUBS_DATA.find(h => h.operationalStatus === 'active') || HUBS_DATA[0];

  // Title and Meta Construction
  let pageTitle = lang === 'en' ? 'NordBase — Local Services Platform in Portugal' : 'NordBase — Plataforma de Serviços Locais em Portugal';
  let metaDescription = lang === 'en'
    ? 'Human-coordinated local services platform in Portugal. Connect with verified independent specialists for plumbing, electrical, cleaning, and repairs.'
    : 'Plataforma de serviços locais coordenada por equipas locais em Portugal. Canalizadores, eletricistas, limpezas e reparações.';
  let pageH1 = lang === 'en' ? 'NordBase Portugal — Local Service Coordination' : 'NordBase Portugal — Coordenação de Serviços Locais';
  let pageDesc = lang === 'en'
    ? 'NordBase operates local coordination hubs across Portugal, matching customer repair, maintenance, and cleaning requests with qualified independent local specialists.'
    : 'A NordBase opera hubs de coordenação local em Portugal, avaliando pedidos de reparação, manutenção e limpeza e ligando-os a especialistas independentes qualificados.';
  let canonicalPath = '/portugal';

  // Construct Breadcrumbs
  const breadcrumbs: { name: string; url: string }[] = [{ name: 'Home', url: 'https://nordbase.pt/' }];

  if (regionSlug === 'portugal') {
    canonicalPath = '/portugal';
    breadcrumbs.push({ name: 'Portugal', url: 'https://nordbase.pt/portugal' });
    pageTitle = lang === 'en' ? 'Local Services Coordination in Portugal | NordBase' : 'Coordenação de Serviços Locais em Portugal | NordBase';
    metaDescription = lang === 'en' 
      ? 'NordBase coordinates local services across Portugal. Submit your service request to connect with verified independent specialists.'
      : 'A NordBase coordena serviços locais em Portugal. Submeta o seu pedido para ligar a especialistas independentes qualificados.';
    pageH1 = lang === 'en' ? 'Local Services Coordination across Portugal' : 'Coordenação de Serviços Locais em Portugal';
    pageDesc = lang === 'en'
      ? 'Human-coordinated platform for home maintenance and repairs in Portugal. Initial launch focused in Algarve (Portimão Hub).'
      : 'Plataforma coordenada por equipas locais para manutenção e reparações em Portugal. Lançamento inicial focado no Algarve (Hub de Portimão).';
  } else if (regionSlug === 'algarve' && !citySlug) {
    canonicalPath = '/algarve';
    breadcrumbs.push({ name: 'Algarve', url: 'https://nordbase.pt/algarve' });
    pageTitle = lang === 'en' ? 'Local Services in Algarve | NordBase Portugal' : 'Serviços Locais no Algarve | NordBase Portugal';
    metaDescription = lang === 'en'
      ? 'NordBase local service coordination across the Algarve region. Active Hub operational in Portimão.'
      : 'Coordenação de serviços locais da NordBase em todo o Algarve. Hub ativo operacional em Portimão.';
    pageH1 = lang === 'en' ? 'Algarve Region — Local Service Coordination' : 'Região do Algarve — Coordenação de Serviços Locais';
    pageDesc = lang === 'en'
      ? 'Connecting customers with verified specialists across the Algarve. Primary operational coordination hub active in Portimão.'
      : 'Ligação direta entre clientes e especialistas qualificados no Algarve. Hub de coordenação operacional ativo em Portimão.';
  } else if (currentHubService) {
    const { hub, service } = currentHubService;
    canonicalPath = `/${hub.regionSlug}/${hub.slug}/${service.serviceSlug}`;
    breadcrumbs.push({ name: hub.regionName, url: `https://nordbase.pt/${hub.regionSlug}` });
    breadcrumbs.push({ name: hub.hubName, url: `https://nordbase.pt/${hub.regionSlug}/${hub.slug}` });
    breadcrumbs.push({ name: service.serviceName, url: `https://nordbase.pt/${hub.regionSlug}/${hub.slug}/${service.serviceSlug}` });

    pageTitle = service.title ? service.title[lang] : `${service.serviceName} in ${hub.cityName} Hub | NordBase`;
    metaDescription = service.metaDescription ? service.metaDescription[lang] : `${service.description[lang]} Describe your problem to receive specialist evaluation in ${hub.cityName}.`;
    pageH1 = service.h1 ? service.h1[lang] : `${service.serviceName} in ${hub.cityName}`;
    pageDesc = service.description ? service.description[lang] : (typeof service.description === 'string' ? service.description : '');
  } else if (currentHub) {
    const hub = currentHub;
    canonicalPath = `/${hub.regionSlug}/${hub.slug}`;
    breadcrumbs.push({ name: hub.regionName, url: `https://nordbase.pt/${hub.regionSlug}` });
    breadcrumbs.push({ name: hub.hubName, url: `https://nordbase.pt/${hub.regionSlug}/${hub.slug}` });

    pageTitle = hub.title ? hub.title[lang] : `${hub.hubName} — Local Services in ${hub.cityName} | NordBase`;
    metaDescription = hub.metaDescription ? hub.metaDescription[lang] : `${hub.description[lang]} Connect with local independent specialists in ${hub.cityName}.`;
    pageH1 = hub.h1 ? hub.h1[lang] : `${hub.hubName} — Local Services`;
    pageDesc = hub.description ? hub.description[lang] : (typeof hub.description === 'string' ? hub.description : '');
  }

  const fullCanonicalUrl = `https://nordbase.pt${canonicalPath}`;

  // FAQ Items tailored to Hub and Service
  const defaultFaqs = [
    {
      q: lang === 'en' ? `What is the NordBase ${currentHub ? currentHub.cityName : 'Local'} Hub?` : `O que é o Hub NordBase ${currentHub ? currentHub.cityName : 'Local'}?`,
      a: lang === 'en' 
        ? `NordBase is a human-coordinated local services platform. The ${currentHub ? currentHub.hubName : 'Portimão Hub'} operates locally in Portugal, evaluating customer requests and matching them with qualified independent specialists.`
        : `O NordBase é uma plataforma de serviços locais coordenada por equipas locais. O ${currentHub ? currentHub.hubName : 'Hub de Portimão'} opera localmente em Portugal, avaliando os pedidos dos clientes e ligando-os a especialistas independentes qualificados.`
    },
    {
      q: lang === 'en' ? 'How does the Specialist assessment and pricing work?' : 'Como funciona a avaliação do especialista e o preço?',
      a: lang === 'en'
        ? 'When you describe your problem, a preliminary estimate is generated. If an on-site inspection is required, the Specialist evaluates the job and presents a final price. Work only starts after you approve the final price.'
        : 'Ao descrever o problema, é gerada uma estimativa inicial. Se for necessária inspeção no local, o especialista avalia o trabalho e apresenta o preço final. O trabalho só começa após a sua aprovação expressa do preço final.'
    },
    {
      q: lang === 'en' ? 'Can the preliminary price change after on-site evaluation?' : 'O preço preliminar pode mudar após a avaliação no local?',
      a: lang === 'en'
        ? 'Yes. Preliminary estimates are based on the initial description. If on-site inspection reveals additional work requirements, the Specialist proposes a revised final price which you must approve before work begins.'
        : 'Sim. As estimativas preliminares baseiam-se na descrição inicial. Se a inspeção no local revelar necessidades adicionais, o especialista propõe um preço final revisto que o cliente aprova antes do início do serviço.'
    },
    {
      q: lang === 'en' ? 'How do I submit a service request?' : 'Como submeto um pedido de serviço?',
      a: lang === 'en'
        ? 'Click "Describe your problem" on the page, select your issue category, enter your location in the territory, and our local coordination handles the rest.'
        : 'Clique em "Descreva o seu problema", selecione a categoria, introduza a sua localização no território e a coordenação local trata de tudo.'
    }
  ];

  const serviceFaqs = (currentHubService?.service.faqs || []).map(f => ({
    q: f.q[lang],
    a: f.a[lang]
  }));

  const faqs = [...serviceFaqs, ...defaultFaqs];

  return (
    <div className="space-y-12 py-4 max-w-5xl mx-auto">
      {/* SEO Metadata injection */}
      <Helmet htmlAttributes={{ lang }}>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content={robotsMeta} />
        
        <link rel="canonical" href={fullCanonicalUrl} />
        <link rel="alternate" hrefLang="pt" href={fullCanonicalUrl} />
        <link rel="alternate" hrefLang="en" href={fullCanonicalUrl} />
        <link rel="alternate" hrefLang="x-default" href={fullCanonicalUrl} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={fullCanonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NordBase.pt" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />

        <script type="application/ld+json">{JSON.stringify(getOrganizationSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(getBreadcrumbSchema(breadcrumbs))}</script>
        <script type="application/ld+json">{JSON.stringify(getCustomerFaqSchema())}</script>
        {currentHubService ? (
          <script type="application/ld+json">{JSON.stringify(getLocalServiceSchema(currentHubService.hub.cityName, currentHubService.service.category, metaDescription))}</script>
        ) : currentHub ? (
          <script type="application/ld+json">{JSON.stringify(getLocalServiceSchema(currentHub.cityName, 'Home Services', metaDescription))}</script>
        ) : null}
      </Helmet>

      {/* Breadcrumb Navigation Bar */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/5 overflow-x-auto">
        <button onClick={onNavigateHome} className="hover:text-cyan-400 flex items-center gap-1 cursor-pointer shrink-0">
          <Home className="w-3.5 h-3.5 text-cyan-400" />
          <span>Home</span>
        </button>
        {breadcrumbs.slice(1).map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            {idx === breadcrumbs.length - 2 ? (
              <span className="text-cyan-300 font-bold shrink-0">{crumb.name}</span>
            ) : (
              <button 
                onClick={() => {
                  const urlObj = new URL(crumb.url);
                  onNavigateHubUrl(urlObj.pathname);
                }}
                className="hover:text-cyan-400 cursor-pointer shrink-0"
              >
                {crumb.name}
              </button>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Operational Status Warning for Inactive Hubs */}
      {currentHub && currentHub.operationalStatus !== 'active' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-4 text-amber-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-amber-300 text-sm">
              {currentHub.cityName} Hub — Operational Expansion Notice
            </h3>
            <p className="text-amber-200/90 leading-relaxed">
              NordBase is currently activating local dispatchers in {currentHub.cityName}. Service requests submitted here will be coordinated via our primary regional Hub in Portimão.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateHubUrl('/algarve/portimao')}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 font-bold text-amber-200 text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Visit Active Portimão Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Hub / Service Hero Header */}
      <section className="bg-gradient-to-b from-[#0B1528] to-[#060D1E] border border-blue-900/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {currentHub ? currentHub.hubName : 'Portugal Territory'} • {currentHubService ? currentHubService.service.serviceName : 'Human Local Coordination'}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {pageH1}
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {pageDesc}
          </p>

          {/* Primary CTA button: "Describe your problem" */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const catName = currentHubService ? currentHubService.service.category : undefined;
                const cityName = currentHub ? currentHub.cityName : 'Portimão';
                onSelectCategoryAndCity(catName, cityName);
              }}
              className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center gap-2.5 group"
            >
              <span>{lang === 'en' ? 'Describe Your Problem' : 'Descreva o Seu Problema'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onNavigateHowItWorks}
              className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'en' ? 'How NordBase Works' : 'Como Funciona o NordBase'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Typical Customer Problems Section (For Hub + Service Pages) */}
      {currentHubService && (
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-4 h-4" />
            <span>
              {lang === 'en' 
                ? `Typical Issues Handled in ${currentHubService.hub.cityName}`
                : `Problemas Frequentes em ${currentHubService.hub.cityName}`}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">
            {lang === 'en'
              ? `Common ${currentHubService.service.serviceName} Requests`
              : `Avarias e Pedidos Comuns de ${currentHubService.service.serviceName}`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            {currentHubService.service.typicalProblems.map((prob, idx) => {
              const text = typeof prob === 'string' ? prob : prob[lang];
              return (
                <div 
                  key={idx} 
                  onClick={() => {
                    const catName = currentHubService.service.category;
                    const cityName = currentHubService.hub.cityName;
                    onSelectCategoryAndCity(catName, cityName);
                  }}
                  className="bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 p-3.5 rounded-xl flex items-start gap-3 cursor-pointer transition-all hover:bg-slate-900/80 group"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-200 font-medium group-hover:text-white">{text}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Factual Entity & GEO Overview */}
      <section className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>Hub Coordination & Pricing Transparency</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-300">
          <div className="bg-slate-950/60 p-4.5 rounded-xl border border-slate-800/60 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Human Local Coordination</span>
            </h3>
            <p>
              NordBase operates with local dispatchers in Portugal. Customer requests are evaluated manually to match specific job parameters with qualified independent local Specialists.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4.5 rounded-xl border border-slate-800/60 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Specialist Assessment & Final Price</span>
            </h3>
            <p>
              Preliminary estimates provide initial scope guidance. If on-site inspection is needed, the Specialist evaluates the job and presents a final price. Work proceeds only after Customer approval.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4.5 rounded-xl border border-slate-800/60 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Sign-Off & Support</span>
            </h3>
            <p>
              Both Customer and Specialist confirm job completion digitally. NordBase local coordination remains available throughout the request lifecycle.
            </p>
          </div>
        </div>
      </section>

      {/* 5-Step Process Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {lang === 'en' ? '5-Step Service Coordination Workflow' : 'Fluxo de Coordenação em 5 Passos'}
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            {lang === 'en' ? 'Clear, transparent process ensuring price agreement before work starts.' : 'Processo transparente para total previsibilidade de preços.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {[
            { step: '01', title: 'Describe Problem', desc: 'Submit your issue online or by phone with details.' },
            { step: '02', title: 'Local Connection', desc: 'Local coordination connects your request with a Specialist.' },
            { step: '03', title: 'On-Site Assessment', desc: 'Specialist inspects the work on-site if required.' },
            { step: '04', title: 'Final Price Approval', desc: 'Review and confirm the final price before work begins.' },
            { step: '05', title: 'Completion Sign-Off', desc: 'Work is finished and both sides confirm completion.' }
          ].map((s, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2 relative">
              <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {s.step}
              </span>
              <h3 className="font-bold text-white">{s.title}</h3>
              <p className="text-slate-400 text-[11px] leading-normal">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Available Services in Active Hub */}
      {activeHub && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" />
              <span>Available Services in {activeHub.hubName}</span>
            </h2>
            {currentHub && currentHub.slug !== activeHub.slug && (
              <span className="text-xs text-cyan-400 font-medium">Active Reference Hub: {activeHub.cityName}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {activeHub.services.map((srv) => {
              const isCurrentSrv = currentHubService?.service.serviceSlug === srv.serviceSlug;
              return (
                <button
                  key={srv.serviceId}
                  onClick={() => onNavigateHubUrl(`/${activeHub.regionSlug}/${activeHub.slug}/${srv.serviceSlug}`)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                    isCurrentSrv
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{srv.serviceName}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400 opacity-80" />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {srv.subTitle || srv.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Surrounding Territory Areas & Related Links */}
      <section className="bg-slate-950/60 border border-white/5 p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>{activeHub.cityName} Hub Coverage & Surrounding Areas</span>
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed">
          The {activeHub.hubName} coordinates local service requests across {activeHub.cityName} and adjacent coastal and inland areas:
        </p>

        <div className="flex flex-wrap gap-2 text-xs">
          {activeHub.surroundingAreas.map((area) => (
            <span key={area} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">
              • {area}
            </span>
          ))}
        </div>

        {/* Back links for Service Pages */}
        {currentHubService && (
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>Navigation:</span>
            <button 
              onClick={() => onNavigateHubUrl(`/${currentHubService.hub.regionSlug}/${currentHubService.hub.slug}`)}
              className="text-cyan-400 hover:underline font-bold"
            >
              ← Back to {currentHubService.hub.hubName}
            </button>
            <button 
              onClick={() => onNavigateHubUrl(`/${currentHubService.hub.regionSlug}`)}
              className="text-slate-300 hover:text-cyan-400"
            >
              Algarve Region Overview
            </button>
          </div>
        )}
      </section>

      {/* FAQ Accordion Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>{lang === 'en' ? 'Frequently Asked Questions' : 'Perguntas Frequentes'}</span>
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left font-semibold text-sm text-white flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
