import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import NordBaseLogo from './NordBaseLogo';
import {
  Building2,
  Users,
  ShieldCheck,
  TrendingUp,
  Zap,
  Globe,
  Calculator,
  MessageSquareCode,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  PieChart,
  Lock,
  PhoneCall,
  DollarSign,
  Briefcase,
  Activity,
  HelpCircle,
  FileText,
  AlertTriangle,
  Award,
  RefreshCw,
  Cpu,
  BarChart3, Headphones,
  MapPin,
  HeartHandshake,
  UserCheck,
  Check,
  X
} from 'lucide-react';
export type DeckLevel = 'tp' | 'rp' | 'investor';
export type DeckLang = 'ru' | 'en';
interface PitchDeckProps {
  initialLevel?: DeckLevel;
  onNavigateHome?: () => void;
  onSelectLevel?: (level: DeckLevel) => void;
}
export default function PitchDeck({ initialLevel = 'investor', onNavigateHome, onSelectLevel }: PitchDeckProps) {
  const [level, setLevel] = useState<DeckLevel>(initialLevel);

  React.useEffect(() => {
    setLevel(initialLevel);
  }, [initialLevel]);

  const handleLevelChange = (newLevel: DeckLevel) => {
    setLevel(newLevel);
    if (onSelectLevel) {
      onSelectLevel(newLevel);
    }
  };

  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    const prevRobots = metaRobots ? metaRobots.getAttribute('content') : null;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow, noarchive');
    return () => {
      if (metaRobots) {
        if (prevRobots) {
          metaRobots.setAttribute('content', prevRobots);
        } else {
          metaRobots.setAttribute('content', 'index, follow');
        }
      }
    };
  }, []);

  const [lang, setLang] = useState<DeckLang>('en');
  // Slide state for Investor deck
  const [currentSlide, setCurrentSlide] = useState(0);
  // TP Slide State
  const [tpSlide, setTpSlide] = useState(0);
  const tpSlidesCount = 10;
  // RP Slide State
  const [rpSlide, setRpSlide] = useState(0);
  const rpSlidesCount = 9;
  // TP Calculator State
  const [tpOrdersPerDay, setTpOrdersPerDay] = useState<number>(35);
  const [tpAvgLeadPrice, setTpAvgLeadPrice] = useState<number>(10.0);
  const [tpSharePercent, setTpSharePercent] = useState<number>(40);
  // RP Calculator State
  const [rpActiveHubs, setRpActiveHubs] = useState<number>(8);
  const [rpLeadsPerHub, setRpLeadsPerHub] = useState<number>(50);
  const [rpAvgLeadPrice, setRpAvgLeadPrice] = useState<number>(10.0);
  // Calculations for TP
  const tpShiftsPerMonth = 15; // Average working shifts per month per operator (taking into account weekends, vacations, holidays, and sick leave)
  const tpFeePerLead = tpAvgLeadPrice * (tpSharePercent / 100);
  const tpDailyIncome = tpOrdersPerDay * tpFeePerLead; // Income per shift
  const tpMonthlyIncome = tpDailyIncome * tpShiftsPerMonth; // Based on 15 shifts/month average
  const tpAnnualIncome = tpMonthlyIncome * 12;
  // Realistic limit cap check for 100 orders/day (2 shifts) @ avg €10 = €12,000/mo
  // Calculations for RP
  // RP Fee Year 1 = 10% of total lead volume in region
  // RP Fee Year 2+ = 5% (without sub) or 10% (with sub)
  const totalRegionalLeadsDaily = rpActiveHubs * rpLeadsPerHub;
  const totalRegionalVolumeDaily = totalRegionalLeadsDaily * rpAvgLeadPrice;
  const totalRegionalVolumeMonthly = totalRegionalVolumeDaily * 30;
  // Investor Deck Slides List
  const investorSlidesCount = 11;
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % investorSlidesCount);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + investorSlidesCount) % investorSlidesCount);

  // Keyboard navigation support for presentation slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        if (e.key === ' ') e.preventDefault();
        if (level === 'tp') setTpSlide((prev) => (prev + 1) % tpSlidesCount);
        else if (level === 'rp') setRpSlide((prev) => (prev + 1) % rpSlidesCount);
        else setCurrentSlide((prev) => (prev + 1) % investorSlidesCount);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (level === 'tp') setTpSlide((prev) => (prev - 1 + tpSlidesCount) % tpSlidesCount);
        else if (level === 'rp') setRpSlide((prev) => (prev - 1 + rpSlidesCount) % rpSlidesCount);
        else setCurrentSlide((prev) => (prev - 1 + investorSlidesCount) % investorSlidesCount);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [level, tpSlidesCount, rpSlidesCount, investorSlidesCount]);
  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#040812] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* 🛡️ ROBOTS NOINDEX PROTECTION FOR HIDDEN PITCH DECKS */}
      <Helmet>
        <title>
          {level === 'tp'
            ? 'NordBase — Pitch Deck TP (Territory Partner)'
            : level === 'rp'
            ? 'NordBase — Pitch Deck RP (Regional Partner)'
            : 'NordBase — Investor Pitch Deck & Financial Strategy'}
        </title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>
      {/* TOP DECK NAVIGATION & LANGUAGE HEADER */}
      <header className="shrink-0 z-50 bg-[#060d1e]/90 backdrop-blur-md border-b border-cyan-500/20 px-3 sm:px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{lang === 'ru' ? 'На главную' : 'Back to App'}</span>
            </button>
            <div className="flex items-center gap-3">
              <NordBaseLogo size="md" showDotPt={true} compactMobile={false} />
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold tracking-wider uppercase">
                PITCH DECK
              </span>
            </div>
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => setLang('ru')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  lang === 'ru'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  lang === 'en'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
          {/* LEVEL SELECTOR TABS */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleLevelChange('tp')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                level === 'tp'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>TP</span>
            </button>
            {(level === 'rp' || level === 'investor') && (
              <button
                type="button"
                onClick={() => handleLevelChange('rp')}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  level === 'rp'
                    ? 'bg-blue-500 text-slate-950 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>RP</span>
              </button>
            )}
            {level === 'investor' && (
              <button
                type="button"
                onClick={() => handleLevelChange('investor')}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  level === 'investor'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Investor</span>
              </button>
            )}
          </div>
        </div>
      </header>
      {/* MAIN CONTENT CONTAINERS BASED ON LEVEL */}
      <main className="max-w-7xl w-full mx-auto px-3 sm:px-4 py-2 sm:py-3 flex-1 min-h-0 flex flex-col">
        {/* ========================================================================= */}
        {/* LEVEL 1: PITCH DECK FOR TERRITORY PARTNERS (TP) */}
        {/* ========================================================================= */}
        {level === 'tp' && (
          <div className="flex-1 min-h-0 flex flex-col space-y-2 sm:space-y-3">
            {/* TP DECK CONTROL BAR: SLIDE TABS & SLIDER NAVIGATION */}
            <div className="shrink-0 bg-slate-900/90 border border-cyan-500/30 p-2 sm:p-2.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-2 shadow-xl">
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {[
                  { id: 0, title: lang === 'ru' ? '01. О NordBase' : '01. About NordBase' },
                  { id: 1, title: lang === 'ru' ? '02. Проблема' : '02. Problem' },
                  { id: 2, title: lang === 'ru' ? '03. Экосистема' : '03. Ecosystem' },
                  { id: 3, title: lang === 'ru' ? '04. Обзор TP' : '04. TP Overview' },
                  { id: 4, title: lang === 'ru' ? '05. Проблема TP' : '05. TP Problem' },
                  { id: 5, title: lang === 'ru' ? '06. Решение TP' : '06. TP Solution' },
                  { id: 6, title: lang === 'ru' ? '07. Экономика' : '07. Economics' },
                  { id: 7, title: lang === 'ru' ? '08. Калькулятор' : '08. Calculator' },
                  { id: 8, title: lang === 'ru' ? '09. ИИ CRM' : '09. AI CRM' },
                  { id: 9, title: lang === 'ru' ? '10. Старт' : '10. Apply / Start' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setTpSlide(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
                      tpSlide === s.id
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setTpSlide((prev) => (prev - 1 + tpSlidesCount) % tpSlidesCount)}
                  className="p-2 rounded-xl bg-slate-950 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-cyan-400 px-3">
                  {tpSlide + 1} / {tpSlidesCount}
                </span>
                <button
                  onClick={() => setTpSlide((prev) => (prev + 1) % tpSlidesCount)}
                  className="p-2 rounded-xl bg-slate-950 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors"
                  title="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* SLIDE RENDERER CONTAINER */}
            <div className="flex-1 min-h-0 relative w-full flex flex-col">
              {/* ========================================================= */}
              {/* SLIDE 01: INTRO — CONNECTING PEOPLE. STRENGTHENING LOCAL ECONOMIES */}
              {/* ========================================================= */}
              {tpSlide === 0 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-black text-cyan-300 font-mono">
                        01
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        INTRO 01 • CONNECTING PEOPLE. STRENGTHENING LOCAL ECONOMIES.
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">NordBase.pt • Portugal</span>
                  </div>
                                    <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Left side text */}
                    <div className="space-y-2 sm:space-y-3 max-w-4xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" /> Portimão & Lisbon • Portugal
                      </div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight leading-tight">
                        {lang === 'ru'
                          ? 'NordBase — платформа, где заказчик с помощью местного оператора находит проверенных специалистов для своих работ и услуг.'
                          : 'NordBase is a platform where customers find trusted local professionals with the help of a local coordinator.'}
                      </h1>
                      <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-3xl">
                        {lang === 'ru'
                          ? 'NordBase объединяет жителей, экспатов и проверенных специалистов в единую экосистему. Мы помогаем людям быстро находить надежную помощь, а предпринимателям — строить устойчивый локальный бизнес.'
                          : 'NordBase connects residents, newcomers, and verified professionals into one trusted ecosystem through human support and smart tools.'}
                      </p>
                      {/* 4 Connected Audience Pill Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-3xl">
                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-blue-500/30 flex items-center gap-3 text-sm text-slate-200 shadow-lg">
                          <Users className="w-5 h-5 text-blue-400 shrink-0" />
                          <span className="font-bold">{lang === 'ru' ? 'Жители' : 'Residents'}</span>
                        </div>
                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-cyan-500/30 flex items-center gap-3 text-sm text-slate-200 shadow-lg">
                          <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
                          <span className="font-bold">{lang === 'ru' ? 'Экспаты' : 'Expats'}</span>
                        </div>
                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-teal-500/30 flex items-center gap-3 text-sm text-slate-200 shadow-lg">
                          <Briefcase className="w-5 h-5 text-teal-400 shrink-0" />
                          <span className="font-bold">{lang === 'ru' ? 'Специалисты' : 'Specialists'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Highlights Banner */}
                  <div className="p-5 bg-gradient-to-r from-cyan-950/50 via-slate-900 to-blue-950/50 border border-cyan-500/30 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div>
                      <span className="text-xxs text-slate-400 font-mono block uppercase">{lang === 'ru' ? 'Доверие жителей' : 'Resident Trust'}</span>
                      <span className="text-xl font-black text-cyan-300 font-mono">100% Verified</span>
                    </div>
                    <div>
                      <span className="text-xxs text-slate-400 font-mono block uppercase">{lang === 'ru' ? 'Скорость подбора' : 'Matching SLA'}</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">&lt; 3 min</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xxs text-slate-400 font-mono block uppercase leading-tight">{lang === 'ru' ? 'Мультиязычный чат' : 'Multilingual Chat'}</span>
                      <span className="text-xs sm:text-sm font-black text-blue-300 font-mono mt-1 block leading-tight">{lang === 'ru' ? 'ИИ обеспечивает бесшовную работу' : 'Seamless AI Operation'}</span>
                    </div>
                    <div>
                      <span className="text-xxs text-slate-400 font-mono block uppercase">{lang === 'ru' ? 'Инвестиции в оборудование' : 'Physical Capex'}</span>
                      <span className="text-xl font-black text-teal-300 font-mono">€0 Capex</span>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 02: THE PROBLEM — LOCAL ECONOMIES ARE DISCONNECTED */}
              {/* ========================================================= */}
              {tpSlide === 1 && (

                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-black text-cyan-300 font-mono">
                        02
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        INTRO 02 • {lang === 'ru' ? 'ПРОБЛЕМА' : 'THE PROBLEM'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 max-w-5xl mt-4">
                    <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
                      {lang === 'ru' ? 'Проблема, которую мы решаем' : 'The Problem We Solve'}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 flex-1">
                    <div className="p-5 sm:p-6 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col justify-center space-y-4">
                       <ul className="space-y-5 text-sm sm:text-base text-slate-300 font-medium">
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Жителям сложно быстро найти надежного специалиста.' : 'It is hard for residents to quickly find a reliable specialist.'}</span>
                         </li>
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Специалисты постоянно ищут новых клиентов.' : 'Specialists are constantly looking for new clients.'}</span>
                         </li>
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Рынок городских услуг остается разрозненным и неэффективным.' : 'The urban services market remains fragmented and inefficient.'}</span>
                         </li>
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Малый бизнес вынужден самостоятельно заниматься продвижением.' : 'Small businesses are forced to handle promotion entirely on their own.'}</span>
                         </li>
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Большинство цифровых сервисов помогают искать услуги, но не развивают местные предпринимательские сообщества.' : 'Most digital services help find services, but do not develop local business communities.'}</span>
                         </li>
                       </ul>
                    </div>
                    <div className="p-6 bg-cyan-950/20 rounded-2xl border border-cyan-500/30 flex flex-col justify-center space-y-6">
                       <div>
                         <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
                            <AlertTriangle className="w-6 h-6" />
                         </div>
                         <p className="text-xl sm:text-2xl text-white font-bold leading-snug">
                           {lang === 'ru' 
                             ? 'В результате теряют все участники рынка.' 
                             : 'As a result, all market participants lose.'}
                         </p>
                       </div>
                       
                       <div className="pt-4 border-t border-cyan-500/30">
                         <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                            <CheckCircle2 className="w-6 h-6" />
                         </div>
                         <p className="text-xl sm:text-2xl text-cyan-300 leading-snug font-bold">
                           {lang === 'ru' 
                             ? 'Нужна новая модель — цифровая платформа, которая объединяет, поддерживает и развивает предпринимателей каждого города.' 
                             : 'We need a new model — a digital platform that unites, supports, and develops entrepreneurs in every city.'}
                         </p>
                       </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 03: OUR SOLUTION — NORDBASE CONNECTS & ECOSYSTEM */}
              {/* ========================================================= */}
              {tpSlide === 2 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-black text-cyan-300 font-mono">
                        03
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        INTRO 03 • OUR SOLUTION: NORDBASE CONNECTS
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">Human Support + Technology</span>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
                      {lang === 'ru' ? (
                        <>
                          NordBase объединяет через <span className="text-cyan-400">людей</span> и <span className="text-blue-400">технологии</span>
                        </>
                      ) : (
                        <>
                          NordBase connects through <span className="text-cyan-400">human support</span> and <span className="text-blue-400">smart tools</span>
                        </>
                      )}
                    </h2>
                    <p className="text-slate-300 text-base">
                      {lang === 'ru'
                        ? 'Мы соединяем людей, которым нужна помощь, с проверенными специалистами благодаря участию операторов хаба и умным инструментам.'
                        : 'We connect people who need help with trusted local professionals through human guidance and technology.'}
                    </p>
                  </div>
                  {/* Operational Flow Chain */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative">
                    {/* Node 1 */}
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-center flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold mb-1">
                        <Users className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-sm">{lang === 'ru' ? '1. Жители / Экспаты' : '1. Residents'}</h4>
                      <p className="text-xxs text-slate-400">{lang === 'ru' ? 'Ищут надежную помощь' : 'Looking for reliable help'}</p>
                    </div>
                    {/* Node 2 - Human Support (Highlight) */}
                    <div className="p-5 bg-cyan-950/40 rounded-2xl border-2 border-cyan-400/60 space-y-2 text-center flex flex-col items-center justify-center relative">
                      <span className="absolute -top-3 px-3 py-0.5 bg-cyan-500 text-slate-950 text-xxs font-black font-mono rounded-full uppercase">
                        {lang === 'ru' ? 'Оператор Хаба (TP)' : 'Territory Partner'}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-cyan-400/30 text-cyan-200 flex items-center justify-center font-bold mb-1">
                        <Headphones className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-sm">{lang === 'ru' ? '2. Забота Человека' : '2. Human Support'}</h4>
                      <p className="text-xxs text-cyan-200">{lang === 'ru' ? 'Уточняет задачу и выбирает мастера' : 'Understands needs & finds match'}</p>
                    </div>
                    {/* Node 3 */}
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-center flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mb-1">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-sm">{lang === 'ru' ? '3. Проверенный Мастер' : '3. Verified Specialists'}</h4>
                      <p className="text-xxs text-slate-400">{lang === 'ru' ? 'Качественно выполняет работу' : 'Delivers quality service'}</p>
                    </div>
                    {/* Node 4 */}
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-center flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold mb-1">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-sm">{lang === 'ru' ? '4. Локальный Бизнес' : '4. Local Businesses'}</h4>
                      <p className="text-xxs text-slate-400">{lang === 'ru' ? 'Получает заказы и растет' : 'Gets customers & grows'}</p>
                    </div>
                    {/* Node 5 */}
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-center flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-1">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-sm">{lang === 'ru' ? '5. Сообщество' : '5. Strong Community'}</h4>
                      <p className="text-xxs text-slate-400">{lang === 'ru' ? 'Развитие экономики региона' : 'Stronger local economy'}</p>
                    </div>
                  </div>
                  {/* Two Key Principles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl border border-cyan-500/30 space-y-3">
                      <div className="flex items-center gap-3">
                        <UserCheck className="w-6 h-6 text-cyan-400" />
                        <h3 className="font-bold text-white text-base">
                          {lang === 'ru' ? 'Человеческое участие создает доверие' : 'Human support creates trust'}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lang === 'ru'
                          ? 'Операторы хаба уточняют детали на родном языке клиента, проверяют квалификацию специалистов и garantируют высокий уровень сервиса.'
                          : 'Territory operators provide personal assistance, verify local specialists, and ensure positive customer experiences.'}
                      </p>
                    </div>
                    <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl border border-blue-500/30 space-y-3">
                      <div className="flex items-center gap-3">
                        <Cpu className="w-6 h-6 text-blue-400" />
                        <h3 className="font-bold text-white text-base">
                          {lang === 'ru' ? 'Технологии обеспечивают масштабируемость' : 'Technology makes it scalable'}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lang === 'ru'
                          ? 'Умный CRM-терминал, нейро-переводчики и гео-маркетинг позволяют легко обслуживать тысячи клиентов, сохраняя высочайшее качество.'
                          : 'Smart CRM tools and automation help operators serve more people efficiently while maintaining strict quality.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 04: COVER & MISSION (FORMER SLIDE 01) */}
              {/* ========================================================= */}
              {tpSlide === 3 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-black text-cyan-300">
                        04
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        LEVEL 1 • TERRITORY PARTNER (TP) OVERVIEW
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">NordBase.pt • Portugal</span>
                  </div>
                  <div className="space-y-4 max-w-4xl">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight leading-tight">
                      {lang === 'ru' ? (
                        <>
                          Свой бизнес и <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">эксклюзивные права</span> на территорию в Португалии
                        </>
                      ) : (
                        <>
                          Your Own Business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Exclusive Territory Rights</span> in Portugal
                        </>
                      )}
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                      {lang === 'ru'
                        ? 'Territory Partner (TP) — эксклюзивный оператор локального сервиса (города или района). Вы координируете поток заказов от жителей, связываете их с проверенными мастерами и зарабатываете стабильный доход с каждого лида.'
                        : 'Territory Partner (TP) is the exclusive local service operator for a city or hub. You coordinate customer requests, connect them with verified local professionals, and earn steady revenue per lead.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                    <div className="p-5 bg-slate-950/80 rounded-2xl border border-cyan-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                        <Award className="w-5 h-5" />
                        <span>{lang === 'ru' ? '1 TP на Город / Район' : '1 TP per Hub Area'}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {lang === 'ru'
                          ? 'Полная монопольная эксклюзивность на выбранную территорию (Фару, Кашкайш, Силвеш и т.д.).'
                          : 'Exclusive territory ownership for your assigned hub area (Faro, Cascais, Silves, etc.).'}
                      </p>
                    </div>
                    <div className="p-5 bg-slate-950/80 rounded-2xl border border-cyan-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                        <MessageSquareCode className="w-5 h-5" />
                        <span>{lang === 'ru' ? 'Живой оператор + ИИ CRM' : 'Human Operator + AI CRM'}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {lang === 'ru'
                          ? 'Синхронный автоперевод 4+ языков в реальном времени. 0% языкового барьера с клиентами.'
                          : 'Real-time multi-language AI auto-translation. Zero language barrier with clients.'}
                      </p>
                    </div>
                    <div className="p-5 bg-slate-950/80 rounded-2xl border border-cyan-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                        <TrendingUp className="w-5 h-5" />
                        <span>{lang === 'ru' ? 'Доход 25-33% с Лида' : '25-33% Share per Lead'}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {lang === 'ru'
                          ? 'Прямое начисление средств от каждого подтвержденного лида. Месячный доход до €5,625.'
                          : 'Direct payout on every verified lead. Monthly income potential up to €5,625.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* ========================================================= */}
              {/* SLIDE 05: THE PROBLEM */}
              {/* ========================================================= */}
              {tpSlide === 4 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 font-black flex items-center justify-center font-mono">
                        05
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                        THE PROBLEM • ПРОБЛЕМА РЫНКА
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">NordBase Market Analysis</span>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-display font-black text-white">
                      {lang === 'ru'
                        ? 'Поиск специалиста сегодня — это долго, сложно и рискованно'
                        : 'Finding a Reliable Local Specialist Today is Slow, Complex and Risky'}
                    </h2>
                    <p className="text-slate-400 text-sm max-w-3xl">
                      {lang === 'ru'
                        ? 'Рынок локальных услуг в Португалии разрознен. Все участники сталкиваются с серьезными барьерами, создающими хаос.'
                        : 'The local services market in Portugal is fragmented. Every participant faces huge friction.'}
                    </p>
                  </div>
                  {/* 4 Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                        <Users className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-white text-base">{lang === 'ru' ? 'Жители' : 'Residents'}</h3>
                      <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                        <li>{lang === 'ru' ? 'Сложно найти надежного мастера' : 'Hard to find reliable pros'}</li>
                        <li>{lang === 'ru' ? 'Нельзя объективно сравнить цены' : 'Difficult to compare prices'}</li>
                        <li>{lang === 'ru' ? 'Нет гарантии качества работы' : 'No work quality guarantee'}</li>
                      </ul>
                      <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xxs font-mono font-bold">
                        {lang === 'ru' ? '⚠️ Потеря времени и нервов' : '⚠️ Time-consuming & uncertain'}
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                        <Globe className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-white text-base">{lang === 'ru' ? 'Экспаты' : 'Expats'}</h3>
                      <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                        <li>{lang === 'ru' ? 'Языковой и культурный барьер' : 'Language and cultural barrier'}</li>
                        <li>{lang === 'ru' ? 'Не знают где искать мастеров' : 'Don’t know where to look'}</li>
                        <li>{lang === 'ru' ? 'Риск переплаты и обмана' : 'Risk of overpaying & fraud'}</li>
                      </ul>
                      <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xxs font-mono font-bold">
                        {lang === 'ru' ? '⚠️ Изоляция и стресс' : '⚠️ Isolation & trust gap'}
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-white text-base">{lang === 'ru' ? 'Специалисты' : 'Local Businesses'}</h3>
                      <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                        <li>{lang === 'ru' ? 'Зависимость от сарафанного радио' : 'Relying purely on word-of-mouth'}</li>
                        <li>{lang === 'ru' ? 'Дорогая и неэффективная реклама' : 'Expensive & low ROI ads'}</li>
                        <li>{lang === 'ru' ? 'Не умеют вести продажи и CRM' : 'No sales skills or CRM tools'}</li>
                      </ul>
                      <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xxs font-mono font-bold">
                        {lang === 'ru' ? '⚠️ Высокая стоимость клиента' : '⚠️ High acquisition cost'}
                      </div>
                    </div>
                    
                  </div>
                  <div className="p-5 bg-gradient-to-r from-blue-950/40 via-cyan-950/40 to-blue-950/40 border border-cyan-500/30 rounded-2xl text-center">
                    <p className="text-slate-200 font-bold text-sm sm:text-base">
                      {lang === 'ru'
                        ? 'Проблема не в отсутствии мастеров. Проблема — в отсутствии доверенного локального связующего звена.'
                        : 'The challenge is not a lack of local specialists. The challenge is building trusted local connections.'}
                    </p>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 06: SOLUTION & OPERATIONAL FLOW */}
              {/* ========================================================= */}
              {tpSlide === 5 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 font-black flex items-center justify-center font-mono">
                        06
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        OUR SOLUTION • РЕШЕНИЕ И РОЛЬ TP
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">NordBase Ecosystem</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <h2 className="text-3xl font-display font-black text-white leading-tight">
                        {lang === 'ru' ? (
                          <>
                            NordBase <span className="text-cyan-400">объединяет</span> клиентов, мастеров и технологии
                          </>
                        ) : (
                          <>
                            NordBase <span className="text-cyan-400">Connects</span> Residents, Professionals & Tech
                          </>
                        )}
                      </h2>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {lang === 'ru'
                          ? 'Territory Partner — ключевая фигура доверия. Вы принимаете заявку, убираете неопределенность, квалифицируете детали и пересылаете целевой лид мастеру.'
                          : 'Territory Partner is the central pillar of trust. You take the incoming request, clarify details, form a validated lead card, and match the best pro.'}
                      </p>
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                          <Headphones className="w-5 h-5 text-cyan-400 shrink-0" />
                          <div>
                            <span className="font-bold text-white block">{lang === 'ru' ? 'Живое сопровождение' : 'Human Support'}</span>
                            <span className="text-slate-400">{lang === 'ru' ? 'Клиенты доверяют человеку, а не глухим ботам' : 'Clients trust real humans, not cold bots'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                          <Zap className="w-5 h-5 text-blue-400 shrink-0" />
                          <div>
                            <span className="font-bold text-white block">{lang === 'ru' ? 'ИИ делает систему масштабируемой' : 'Tech Makes It Scalable'}</span>
                            <span className="text-slate-400">{lang === 'ru' ? 'CRM подсказывает вопросы и переводит диалог' : 'CRM prompts scripts and translates messages'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 5-Step Operational Flow Diagram */}
                    <div className="lg:col-span-7 bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-4">
                      <span className="text-xxs font-mono font-bold uppercase text-cyan-400 tracking-wider block">
                        {lang === 'ru' ? '5 Шагов взаимодействия заказа в TP-Хабе:' : '5-Step Hub Order Flow:'}
                      </span>
                      <div className="space-y-3">
                        {[
                          { step: '1', title: lang === 'ru' ? 'Клиент создает заявку' : 'Client submits request', desc: lang === 'ru' ? 'Телефон, сайт, WhatsApp или чат' : 'Phone call, website, WhatsApp or live chat' },
                          { step: '2', title: lang === 'ru' ? 'TP квалифицирует лид' : 'TP qualifies the lead', desc: lang === 'ru' ? 'Проверяет адрес, услугу, срочность, автоперевод' : 'Verifies address, urgency, category & auto-translate' },
                          { step: '3', title: lang === 'ru' ? 'Специалист выкупает лид' : 'Specialist buys verified lead', desc: lang === 'ru' ? 'Мастер получает контакты в 1 клик' : 'Gets customer contact details instantly' },
                          { step: '4', title: lang === 'ru' ? 'Работа выполняется' : 'Job is executed', desc: lang === 'ru' ? 'Мастер сдает работу, клиент подтверждает' : 'Technician completes task & customer rates service' },
                          { step: '5', title: lang === 'ru' ? 'TP получает комиссию' : 'TP receives direct revenue', desc: lang === 'ru' ? 'Мгновенное начисление 40% на баланс TP' : 'Instant 40% payout into TP account balance' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0">
                              {item.step}
                            </div>
                            <div className="flex-1">
                              <span className="font-bold text-white text-xs block">{item.title}</span>
                              <span className="text-xxs text-slate-400">{item.desc}</span>
                            </div>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 06: BUSINESS MODEL & UNIT ECONOMICS */}
              {/* ========================================================= */}
              {tpSlide === 6 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 font-black flex items-center justify-center font-mono">
                        07
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        BUSINESS MODEL & UNIT ECONOMICS • ЮНИТ-ЭКОНОМИКА TP
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">NordBase Financial Rules</span>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-display font-black text-white">
                      {lang === 'ru' ? 'Прозрачная модель начисления дохода (40% TP)' : 'Transparent Revenue & Commission Model (40% TP)'}
                    </h2>
                    <p className="text-slate-300 text-sm max-w-3xl">
                      {lang === 'ru'
                        ? 'TP зарабатывает 40% от всех реализованных им Лидов. Учет ведется автоматически и фиксируется в дашборде.'
                        : 'TP earns 40% of all leads fulfilled by them. Tracking is automated and recorded directly in the dashboard.'}
                    </p>
                  </div>
                  {/* Revenue Streams + Financial Rules */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
                    {/* Left: Lead Calculation Rules & Win-Win */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl border border-cyan-500/30 space-y-2.5">
                        <div className="inline-block px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xxs font-mono font-bold">
                          1. Lead Pricing Rules
                        </div>
                        <h3 className="font-bold text-white text-sm sm:text-base">{lang === 'ru' ? 'Расчет стоимости Лида' : 'Lead Pricing Calculation'}</h3>
                        <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                          <p>
                            • {lang === 'ru' ? 'Заказчик создает заказ с предварительной оценкой стоимости (рассчитывается TP).' : 'Client submits an order with an estimated price calculated by TP.'}
                          </p>
                          <p>
                            • {lang === 'ru' ? 'До €100: стоимость лида составляет ' : 'Up to €100: lead price is '}
                            <span className="font-bold text-cyan-400">20%</span>
                            {lang === 'ru' ? ' (€50 → €10, €100 → €20).' : ' (€50 job → €10 lead, €100 job → €20 lead).'}
                          </p>
                          <p>
                            • {lang === 'ru' ? 'Свыше €100: стоимость лида составляет ' : 'Over €100: lead price is '}
                            <span className="font-bold text-cyan-400">15%</span>
                            {lang === 'ru' ? ' (но не менее €20).' : ' (min. €20).'}
                          </p>
                          <p className="pt-1 text-xxs text-slate-400 border-t border-slate-800">
                            💡 {lang === 'ru' ? 'Специалист возвращает стоимость лида при оплате заказа и получает 100% за свою работу.' : 'Specialist retrieves lead cost in order payout and retains 100% for completed work.'}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                        <div className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xxs font-mono font-bold">
                          2. Win-Win Concept
                        </div>
                        <h3 className="font-bold text-white text-sm sm:text-base">{lang === 'ru' ? 'Модель Win-Win (Выгода всех)' : 'Win-Win Model for Everyone'}</h3>
                        <ul className="text-xs text-slate-400 space-y-1">
                          <li>• <strong className="text-white">{lang === 'ru' ? 'Заказчики:' : 'Clients:'}</strong> {lang === 'ru' ? 'проверенные спецы, фиксированные цены' : 'verified specialists, stable prices'}</li>
                          <li>• <strong className="text-white">{lang === 'ru' ? 'Спецы:' : 'Pros:'}</strong> {lang === 'ru' ? 'поток заказов, 0% трат на рекламу' : 'steady orders, 0 marketing expense'}</li>
                          <li>• <strong className="text-white">{lang === 'ru' ? 'Партнеры:' : 'Partners:'}</strong> {lang === 'ru' ? 'гарантированные 40% (TP) / 10% (RP)' : 'guaranteed 40% (TP) / 10% (RP) share'}</li>
                        </ul>
                      </div>
                    </div>

                    {/* Right: Lead Split Breakdown (100% of Lead Value) */}
                    <div className="lg:col-span-7 bg-slate-950/90 p-5 rounded-2xl border-2 border-cyan-500/40 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                        <span className="font-mono font-bold text-cyan-400 text-xs sm:text-sm">
                          {lang === 'ru' ? '📊 Распределение стоимости Лида (100%)' : '📊 Lead Price Revenue Split (100%)'}
                        </span>
                        <span className="text-xxs font-mono bg-cyan-500/10 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">
                          Automated Balance Split
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
                        <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl space-y-1">
                          <span className="text-2xl font-black text-cyan-400 font-mono block">40%</span>
                          <span className="text-xs font-bold text-white block">TP Share</span>
                          <span className="text-xxs text-slate-400 block leading-tight">
                            {lang === 'ru' ? 'Обработавшему хабу' : 'To processing hub'}
                          </span>
                        </div>

                        <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl space-y-1">
                          <span className="text-2xl font-black text-blue-400 font-mono block">10%</span>
                          <span className="text-xs font-bold text-white block">RP Share</span>
                          <span className="text-xxs text-slate-400 block leading-tight">
                            {lang === 'ru' ? 'Региону' : 'Regional partner'}
                          </span>
                        </div>

                        <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-1">
                          <span className="text-2xl font-black text-purple-400 font-mono block">50%</span>
                          <span className="text-xs font-bold text-white block">Platform</span>
                          <span className="text-xxs text-slate-400 block leading-tight">
                            {lang === 'ru' ? 'ИИ, Маркетинг, Серверы' : 'AI, Ads & Platform'}
                          </span>
                        </div>
                      </div>

                      {/* Example calculation box */}
                      <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                          <span className="font-bold text-white">{lang === 'ru' ? 'Пример: Заказ на €100' : 'Example: €100 Order'}</span>
                          <span className="text-cyan-400 font-mono font-bold">{lang === 'ru' ? 'Лид = €20 (20%)' : 'Lead = €20 (20%)'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xxs sm:text-xs font-mono pt-1">
                          <div className="text-cyan-300">
                            <span className="block text-slate-400 text-xxs font-sans">{lang === 'ru' ? 'TP Выручка (40%):' : 'TP Cut (40%):'}</span>
                            <span className="text-sm font-bold">€8.00</span>
                          </div>
                          <div className="text-blue-300">
                            <span className="block text-slate-400 text-xxs font-sans">{lang === 'ru' ? 'RP Доход (10%):' : 'RP Cut (10%):'}</span>
                            <span className="text-sm font-bold">€2.00</span>
                          </div>
                          <div className="text-purple-300">
                            <span className="block text-slate-400 text-xxs font-sans">{lang === 'ru' ? 'Платформа (50%):' : 'Platform (50%):'}</span>
                            <span className="text-sm font-bold">€10.00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 07: FINANCIAL CALCULATOR */}
              {/* ========================================================= */}
              {tpSlide === 7 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 font-black flex items-center justify-center font-mono">
                        08
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        FINANCIAL CALCULATOR • КАЛЬКУЛЯТОР ДОХОДА TP
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Live Projections</span>
                  </div>
                  {/* Sliders & Results Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
                    {/* Sliders (Col 7) */}
                    <div className="lg:col-span-7 space-y-2 sm:space-y-3 bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="font-mono font-bold text-cyan-400 text-sm">{lang === 'ru' ? 'Параметры TP-Хаба:' : 'TP Hub Parameters:'}</span>
                        <span className="text-xxs text-slate-400 font-mono">{lang === 'ru' ? 'Интерактивные ползунки' : 'Interactive Sliders'}</span>
                      </div>
                      {/* Slider 1: Orders per Day / Shift */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-300">
                            {lang === 'ru' ? 'Обработанные заказы за смену (8 ч):' : 'Processed orders per shift (8h):'}
                          </span>
                          <span className="text-cyan-400 font-mono text-lg">{tpOrdersPerDay} {lang === 'ru' ? 'зак/смена' : 'orders/shift'}</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="100"
                          step="5"
                          value={tpOrdersPerDay}
                          onChange={(e) => setTpOrdersPerDay(Number(e.target.value))}
                          className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                        />
                        <div className="flex justify-between text-xxs text-slate-500 font-mono">
                          <span>5 (Старт)</span>
                          <span>35 (Средний)</span>
                          <span>50 (1 смена)</span>
                          <span>100 (2 смены)</span>
                        </div>
                      </div>
                      {/* Slider 2: Average Lead Price */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-300">
                            {lang === 'ru' ? 'Средняя стоимость лида (€):' : 'Average lead price (€):'}
                          </span>
                          <span className="text-cyan-400 font-mono text-lg">€{tpAvgLeadPrice.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="10.0"
                          max="30.0"
                          step="0.5"
                          value={tpAvgLeadPrice}
                          onChange={(e) => setTpAvgLeadPrice(Number(e.target.value))}
                          className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                        />
                        <div className="flex justify-between text-xxs text-slate-500 font-mono">
                          <span>€10.00 (Минимум)</span>
                          <span>€15.00 (Стандарт)</span>
                          <span>€30.00 (Премиум)</span>
                        </div>
                      </div>
                      {/* Fixed TP Revenue Share Display */}
                      <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-300">
                            {lang === 'ru' ? 'Доля комиссии TP (Фиксированная):' : 'TP Revenue Share (Fixed):'}
                          </span>
                          <span className="text-cyan-400 font-mono text-lg font-black bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30">
                            40.0%
                          </span>
                        </div>
                        <span className="text-xxs text-slate-500 block font-mono">
                          {lang === 'ru' ? '✓ Фиксированная комиссия TP согласно регламенту NordBase' : '✓ Fixed TP commission according to NordBase platform rules'}
                        </span>
                      </div>
                      <div className="p-4 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-cyan-300 block">💡 {lang === 'ru' ? 'Оценка сменности и нагрузки (15 смен/мес):' : 'Shift Capacity & Workload (15 shifts/mo):'}</span>
                        <p className="text-slate-400 text-xxs leading-relaxed">
                          {lang === 'ru'
                            ? 'В расчётах заложено среднегодовое значение 15 рабочих смен в месяц на оператора (учитываются отпуска, выходные, праздники и больничные). 1 оператор за 8-часовую смену обрабатывает до 50 заказов. Для 100 заказов подключается 2-я смена или сменный оператор.'
                            : 'Calculations use an annual average of 15 working shifts/month per operator (factoring in weekends, vacations, holidays & sick leave). 1 operator processes up to 50 orders/shift. For 100 orders, a 2nd shift or relief operator is activated.'}
                        </p>
                      </div>
                    </div>
                    {/* Results Card (Col 5) */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-slate-950 via-cyan-950/40 to-slate-950 p-6 rounded-2xl border-2 border-cyan-500/50 space-y-2 sm:space-y-3 flex flex-col justify-between shadow-2xl">
                      <div className="space-y-4">
                        <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider block">
                          {lang === 'ru' ? 'Прогноз чистого дохода TP' : 'TP Net Income Forecast'}
                        </span>
                        <div className="space-y-1 border-b border-slate-800 pb-3">
                          <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Ваш доход за 1 лид:' : 'Your earn per lead:'}</span>
                          <span className="text-2xl font-black text-white font-mono">€{tpFeePerLead.toFixed(2)}</span>
                        </div>
                        <div className="space-y-1 border-b border-slate-800 pb-3">
                          <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Доход за 1 смену TP:' : 'TP Income per Shift:'}</span>
                          <span className="text-2xl font-black text-white font-mono">€{tpDailyIncome.toFixed(2)}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Месячный доход (15 смен):' : 'Monthly Income (15 shifts):'}</span>
                          <div className="text-4xl font-black text-cyan-300 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            €{tpMonthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            <span className="text-xs text-slate-400 font-sans font-normal ml-2">/ {lang === 'ru' ? 'месяц' : 'month'}</span>
                          </div>
                        </div>
                        <div className="space-y-1 pt-2 border-t border-slate-800">
                          <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Годовой потенциал TP:' : 'Annual Potential TP:'}</span>
                          <span className="text-xl font-black text-emerald-400 font-mono">
                            €{tpAnnualIncome.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / {lang === 'ru' ? 'год' : 'year'}
                          </span>
                        </div>
                      </div>
                      {/* Growth Stages */}
                      <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2 font-mono">
                        <div className="flex justify-between">
                          <span>{lang === 'ru' ? 'Месяц 1 (10 зак/смена):' : 'Month 1 (10 jobs/shift):'}</span>
                          <span className="text-emerald-400 font-bold">~ €600 / мес</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'ru' ? 'Месяц 2-6 (35 зак/смена):' : 'Month 2-6 (35 jobs/shift):'}</span>
                          <span className="text-cyan-300 font-bold">~ €2,100 / мес</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'ru' ? 'Пик (1 смена 50 зак):' : 'Peak (1 shift 50 jobs):'}</span>
                          <span className="text-amber-300 font-bold">€3,000 / мес</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 09: AI CRM & MULTILINGUAL TERMINAL */}
              {/* ========================================================= */}
              {tpSlide === 8 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 font-black flex items-center justify-center font-mono">
                        09
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                        AI TECHNOLOGY ENGINE • ТЕРМИНАЛ И ИИ-АВТОПЕРЕВОД
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">NordBase CRM Tech</span>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-display font-black text-white">
                      {lang === 'ru' ? 'Мультиязычный CRM-Терминал TP с ИИ-Переводом' : 'Multilingual Live AI Auto-Translation CRM Terminal'}
                    </h2>
                    <p className="text-slate-300 text-sm max-w-3xl">
                      {lang === 'ru'
                        ? 'Главный барьер в Португалии — языковой. В стране живут и заказывают услуги люди, говорящие на десятках разных языков (португальский, английский, французский, немецкий, испанский и др.). CRM-терминал NordBase с ИИ автоматически переводит тексты и голосовые сообщения в реальном времени!'
                        : 'The primary barrier in Portugal is language. Clients in Portugal speak dozens of different languages (Portuguese, English, French, German, Spanish, etc.). NordBase CRM auto-translates voice and text live in real time!'}
                    </p>
                  </div>
                  {/* Chat Simulation Card */}
                  <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 max-w-3xl mx-auto font-sans shadow-inner">
                    <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="font-mono font-bold text-cyan-400">NordBase Live Translation Engine (PT ⇄ EN ⇄ FR ⇄ DE ⇄ ES)</span>
                      </div>
                      <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-xxs font-mono">
                        AI Active
                      </span>
                    </div>
                    <div className="space-y-3 text-xs">
                      {/* Customer Message */}
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 shrink-0">
                          C
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1 max-w-md">
                          <span className="text-xxs text-cyan-400 font-bold block">Customer (Cascais) • Portuguese</span>
                          <p className="text-slate-200">«Preciso de um canalizador urgente em Cascais para reparar um tubo com fuga na cozinha.»</p>
                        </div>
                      </div>
                      {/* Auto-Translated to Operator */}
                      <div className="flex gap-3 items-end justify-end">
                        <div className="bg-blue-600/30 border border-blue-500/50 p-3.5 rounded-2xl space-y-1 max-w-md text-right">
                          <span className="text-xxs text-blue-300 font-bold block">
                            {lang === 'ru' ? 'TP Terminal • ИИ-Автоперевод на рабочий язык' : 'TP Terminal • Live AI Auto-Translated'}
                          </span>
                          <p className="text-white font-medium">
                            {lang === 'ru'
                              ? '«Срочно нужен сантехник в Кашкайше для устранения протечки трубы на кухне.»'
                              : '«Urgent plumber needed in Cascais to fix a kitchen pipe leak.»'}
                          </p>
                          <span className="text-[10px] text-cyan-300 italic block">✓ AI Auto-translated in 0.2s</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-600 border border-blue-400 flex items-center justify-center font-bold text-white shrink-0">
                          TP
                        </div>
                      </div>
                      {/* Quick Formatter Result */}
                      <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xxs text-slate-300 flex items-center justify-between">
                        <span className="font-bold text-emerald-400">
                          {lang === 'ru'
                            ? '✓ ИИ автоматически сформировал карточку лида: «Сантехник • Кашкайш • Срочно (€12.50)»'
                            : '✓ AI generated verified lead card: «Plumber • Cascais • Urgent (€12.50)»'}
                        </span>
                        <span className="font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Ready to Publish</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 10: SYSTEM SUSTAINABILITY & ONBOARDING ROADMAP */}
              {/* ========================================================= */}
              {tpSlide === 9 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 font-black flex items-center justify-center font-mono">
                        10
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        SUSTAINABILITY & START • НАДЕЖНОСТЬ И СТАРТ ТЕРРИТОРИИ
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">NordBase Onboarding</span>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
                      {lang === 'ru' ? (
                        <>
                          Защита бизнеса и <span className="text-cyan-400">пошаговый старт</span> TP
                        </>
                      ) : (
                        <>
                          Business Protection & <span className="text-cyan-400">Step-by-Step Launch</span>
                        </>
                      )}
                    </h2>
                    <p className="text-slate-300 text-sm max-w-3xl">
                      {lang === 'ru'
                        ? 'Модель NordBase спроектирована так, чтобы оператор территории работал с нулевыми рисками и полной поддержкой экосистемы.'
                        : 'NordBase architecture ensures territory operators run with zero risk and complete ecosystem backing.'}
                    </p>
                  </div>
                  {/* 3 Protection Pillars */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <h3 className="font-bold text-white text-sm">{lang === 'ru' ? '3-Уровневая Взаимовыручка' : '3-Tier Redundancy'}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lang === 'ru'
                          ? 'Если TP оффлайн, ИИ мгновенно перенаправляет заявку соседнему TP или в Региональный Хаб. 0% упущенных лидов.'
                          : 'If TP is offline, AI re-routes order to neighboring hub or RP instantly. Zero lost leads.'}
                      </p>
                    </div>
                    <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <h3 className="font-bold text-white text-sm">{lang === 'ru' ? 'Asset-Light Модель' : 'Asset-Light Model'}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lang === 'ru'
                          ? 'Никаких расходов на недвижимость или технику. Вы работаете удаленно из любого удобного места.'
                          : 'Zero physical real estate or machinery required. Operate remotely from anywhere.'}
                      </p>
                    </div>
                    <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <h3 className="font-bold text-white text-sm">{lang === 'ru' ? 'Академия NordBase' : 'NordBase Academy'}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lang === 'ru'
                          ? 'Бесплатное обучение, готовые скрипты, юридические шаблоны и личное сопровождение наставника.'
                          : 'Free onboarding training, ready scripts, legal templates and 1-on-1 mentor support.'}
                      </p>
                    </div>
                  </div>
                  {/* 4 Steps Roadmap */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-xxs font-mono font-bold text-cyan-400">ШАГ 1</span>
                      <h4 className="font-bold text-white text-xs">{lang === 'ru' ? 'Подача заявки' : 'Submit Application'}</h4>
                      <p className="text-xxs text-slate-400">{lang === 'ru' ? 'Выбор города в Португалии.' : 'Select city in Portugal.'}</p>
                    </div>
                    <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-xxs font-mono font-bold text-cyan-400">ШАГ 2</span>
                      <h4 className="font-bold text-white text-xs">{lang === 'ru' ? 'Собеседование' : 'RP Interview'}</h4>
                      <p className="text-xxs text-slate-400">{lang === 'ru' ? 'Встреча с Региональным Директором.' : 'Interview with Regional Director.'}</p>
                    </div>
                    <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-xxs font-mono font-bold text-cyan-400">ШАГ 3</span>
                      <h4 className="font-bold text-white text-xs">{lang === 'ru' ? 'Обучение' : 'Academy Training'}</h4>
                      <p className="text-xxs text-slate-400">{lang === 'ru' ? 'Интенсив в Академии (2 дня).' : 'Quick 2-day training.'}</p>
                    </div>
                    <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/40 space-y-1 bg-cyan-950/20">
                      <span className="text-xxs font-mono font-bold text-emerald-400">ШАГ 4</span>
                      <h4 className="font-bold text-white text-xs">{lang === 'ru' ? 'Старт и Доход' : 'Launch & Earnings'}</h4>
                      <p className="text-xxs text-slate-400">{lang === 'ru' ? 'Активация CRM и доход.' : 'CRM activation & payouts.'}</p>
                    </div>
                  </div>
                  {/* Bottom Action Card */}
                  <div className="p-3.5 sm:p-4 bg-slate-950 border border-cyan-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="font-bold text-white text-lg block">
                        {lang === 'ru' ? 'Забронируйте эксклюзивный город/район' : 'Claim Your Exclusive City/Hub Area Today'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {lang === 'ru' ? 'Количество эксклюзивных мест ограничено 1 оператором на территорию.' : 'Limited slots: Only 1 Territory Partner assigned per hub area.'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => {
                          window.location.href = '/partner';
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-slate-950" />
                        <span>
                          {lang === 'ru'
                            ? 'Territorial Partnership Network • Portugal — Become a NordBase Partner'
                            : 'Territorial Partnership Network • Portugal — Become a NordBase Partner'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* ========================================================================= */}
        {/* LEVEL 2: PITCH DECK FOR REGIONAL PARTNERS / DIRECTORS (RP) */}
        {/* ========================================================================= */}
        {level === 'rp' && (
          <div className="flex-1 min-h-0 flex flex-col space-y-2 sm:space-y-3">
            {/* RP DECK CONTROL BAR: SLIDE TABS & SLIDER NAVIGATION */}
            <div className="shrink-0 bg-slate-900/90 border border-blue-500/30 p-2 sm:p-2.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-2 shadow-xl">
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {[
                  { id: 0, title: lang === 'ru' ? '01. О NordBase' : '01. About NordBase' },
                  { id: 1, title: lang === 'ru' ? '02. Проблема' : '02. Market Problem' },
                  { id: 2, title: lang === 'ru' ? '03. Решение' : '03. Our Solution' },
                  { id: 3, title: lang === 'ru' ? '04. Обзор RP' : '04. RP Overview' },
                  { id: 4, title: lang === 'ru' ? '05. Сеть Хабов' : '05. Hub Network' },
                  { id: 5, title: lang === 'ru' ? '06. Калькулятор' : '06. Calculator' },
                  { id: 6, title: lang === 'ru' ? '07. Дорожная Карта' : '07. Launch Roadmap' },
                  { id: 7, title: lang === 'ru' ? '08. Соглашение' : '08. Legal Protection' },
                  { id: 8, title: lang === 'ru' ? '09. Финал' : '09. Vision & Join' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setRpSlide(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
                      rpSlide === s.id
                        ? 'bg-blue-500 text-slate-950 shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setRpSlide((prev) => (prev - 1 + rpSlidesCount) % rpSlidesCount)}
                  className="p-2 rounded-xl bg-slate-950 text-slate-300 hover:text-blue-400 border border-slate-800 transition-colors"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-blue-400 px-3">
                  {rpSlide + 1} / {rpSlidesCount}
                </span>
                <button
                  onClick={() => setRpSlide((prev) => (prev + 1) % rpSlidesCount)}
                  className="p-2 rounded-xl bg-slate-950 text-slate-300 hover:text-blue-400 border border-slate-800 transition-colors"
                  title="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* SLIDE RENDERER CONTAINER */}
            <div className="flex-1 min-h-0 relative w-full flex flex-col">
              {/* ========================================================= */}
              {/* SLIDE 01: INTRO — CONNECTING PEOPLE. STRENGTHENING LOCAL ECONOMIES */}
              {/* ========================================================= */}
              {rpSlide === 0 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center font-black text-blue-300 font-mono">
                        01
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                        INTRO 01 • CONNECTING PEOPLE. STRENGTHENING LOCAL ECONOMIES.
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">NordBase.pt • Portugal</span>
                  </div>
                                    <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Left side text */}
                    <div className="space-y-2 sm:space-y-3 max-w-4xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" /> Portimão & Lisbon • Portugal
                      </div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight leading-tight">
                        {lang === 'ru'
                          ? 'NordBase — платформа, где заказчик с помощью местного оператора находит проверенных специалистов для своих работ и услуг.'
                          : 'NordBase is a platform where customers find trusted local professionals with the help of a local coordinator.'}
                      </h1>
                      <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-3xl">
                        {lang === 'ru'
                          ? 'NordBase объединяет жителей, экспатов и проверенных специалистов в единую экосистему. Мы помогаем людям быстро находить надежную помощь, а предпринимателям — строить устойчивый локальный бизнес.'
                          : 'NordBase connects residents, newcomers, and verified professionals into one trusted ecosystem through human support and smart tools.'}
                      </p>
                      {/* 4 Connected Audience Pill Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-3xl">
                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-blue-500/30 flex items-center gap-3 text-sm text-slate-200 shadow-lg">
                          <Users className="w-5 h-5 text-blue-400 shrink-0" />
                          <span className="font-bold">{lang === 'ru' ? 'Жители' : 'Residents'}</span>
                        </div>
                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-cyan-500/30 flex items-center gap-3 text-sm text-slate-200 shadow-lg">
                          <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
                          <span className="font-bold">{lang === 'ru' ? 'Экспаты' : 'Expats'}</span>
                        </div>
                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-teal-500/30 flex items-center gap-3 text-sm text-slate-200 shadow-lg">
                          <Briefcase className="w-5 h-5 text-teal-400 shrink-0" />
                          <span className="font-bold">{lang === 'ru' ? 'Специалисты' : 'Specialists'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Highlights Banner */}
                  <div className="p-5 bg-gradient-to-r from-blue-950/50 via-slate-900 to-cyan-950/50 border border-blue-500/30 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div>
                      <span className="text-xxs text-slate-400 font-mono block uppercase">{lang === 'ru' ? 'Доверие жителей' : 'Resident Trust'}</span>
                      <span className="text-xl font-black text-blue-300 font-mono">100% Verified</span>
                    </div>
                    <div>
                      <span className="text-xxs text-slate-400 font-mono block uppercase">{lang === 'ru' ? 'Скорость подбора' : 'Matching SLA'}</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">&lt; 3 min</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xxs text-slate-400 font-mono block uppercase leading-tight">{lang === 'ru' ? 'Мультиязычный чат' : 'Multilingual Chat'}</span>
                      <span className="text-xs sm:text-sm font-black text-cyan-300 font-mono mt-1 block leading-tight">{lang === 'ru' ? 'ИИ обеспечивает бесшовную работу' : 'Seamless AI Operation'}</span>
                    </div>
                    <div>
                      <span className="text-xxs text-slate-400 font-mono block uppercase">{lang === 'ru' ? 'Инвестиции в оборудование' : 'Physical Capex'}</span>
                      <span className="text-xl font-black text-teal-300 font-mono">€0 Capex</span>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 02: THE PROBLEM — LOCAL ECONOMIES ARE DISCONNECTED */}
              {/* ========================================================= */}
              {rpSlide === 1 && (

                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center font-black text-blue-300 font-mono">
                        02
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                        INTRO 02 • {lang === 'ru' ? 'ПРОБЛЕМА' : 'THE PROBLEM'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 max-w-5xl mt-4">
                    <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
                      {lang === 'ru' ? 'Проблема, которую мы решаем' : 'The Problem We Solve'}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 flex-1">
                    <div className="p-5 sm:p-6 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col justify-center space-y-4">
                       <ul className="space-y-5 text-sm sm:text-base text-slate-300 font-medium">
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Жителям сложно быстро найти надежного специалиста.' : 'It is hard for residents to quickly find a reliable specialist.'}</span>
                         </li>
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Специалисты постоянно ищут новых клиентов.' : 'Specialists are constantly looking for new clients.'}</span>
                         </li>
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Рынок городских услуг остается разрозненным и неэффективным.' : 'The urban services market remains fragmented and inefficient.'}</span>
                         </li>
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Малый бизнес вынужден самостоятельно заниматься продвижением.' : 'Small businesses are forced to handle promotion entirely on their own.'}</span>
                         </li>
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Большинство цифровых сервисов помогают искать услуги, но не развивают местные предпринимательские сообщества.' : 'Most digital services help find services, but do not develop local business communities.'}</span>
                         </li>
                       </ul>
                    </div>
                    <div className="p-6 bg-blue-950/20 rounded-2xl border border-blue-500/30 flex flex-col justify-center space-y-6">
                       <div>
                         <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
                            <AlertTriangle className="w-6 h-6" />
                         </div>
                         <p className="text-xl sm:text-2xl text-white font-bold leading-snug">
                           {lang === 'ru' 
                             ? 'В результате теряют все участники рынка.' 
                             : 'As a result, all market participants lose.'}
                         </p>
                       </div>
                       
                       <div className="pt-4 border-t border-blue-500/30">
                         <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                            <CheckCircle2 className="w-6 h-6" />
                         </div>
                         <p className="text-xl sm:text-2xl text-blue-300 leading-snug font-bold">
                           {lang === 'ru' 
                             ? 'Нужна новая модель — цифровая платформа, которая объединяет, поддерживает и развивает предпринимателей каждого города.' 
                             : 'We need a new model — a digital platform that unites, supports, and develops entrepreneurs in every city.'}
                         </p>
                       </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 03: THE SOLUTION — HUMAN SUPPORT & SMART ECOSYSTEM */}
              {/* ========================================================= */}
              {rpSlide === 2 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center font-black text-blue-300 font-mono">
                        03
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                        INTRO 03 • OUR SOLUTION: HUMAN SUPPORT + SMART TOOLS
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">NordBase Solution</span>
                  </div>
                  <div className="space-y-3 max-w-4xl">
                    <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
                      {lang === 'ru' ? (
                        <>
                          Человеческая поддержка + <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Умная Сеть Хабов</span>
                        </>
                      ) : (
                        <>
                          Human Support + <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Smart Hub Ecosystem</span>
                        </>
                      )}
                    </h2>
                    <p className="text-slate-300 text-base sm:text-lg">
                      {lang === 'ru'
                        ? 'NordBase объединяет живого оператора территории (TP), ИИ-ассистентов и верифицированных локальных мастеров.'
                        : 'NordBase combines human local territory operators (TP), AI auto-translators, and verified local professionals.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl border border-blue-500/30 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <h3 className="text-white font-bold text-lg">{lang === 'ru' ? 'Забота о клиенте' : 'Personal Client Care'}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {lang === 'ru'
                          ? 'Оператор хаба выясняет детали заказа на понятном языке клиента и подбирает лучшего проверенного мастера.'
                          : 'Local territory partner understands client needs in their language and matches the ideal verified professional.'}
                      </p>
                    </div>
                    <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl border border-cyan-500/30 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <h3 className="text-white font-bold text-lg">{lang === 'ru' ? 'Верификация Мастеров' : 'Vetted Specialists'}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {lang === 'ru'
                          ? 'Каждый мастер проходит проверку документов, отзывов и квалификации до допуска к заказам.'
                          : 'Every professional undergoes ID verification, reference checks, and quality audits before joining.'}
                      </p>
                    </div>
                    <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl border border-teal-500/30 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="text-white font-bold text-lg">{lang === 'ru' ? 'Развитие Муниципалитетов' : 'Community Growth'}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {lang === 'ru'
                          ? 'Доход остается в регионе, создавая рабочие места и укрепляя экономику каждого округа.'
                          : 'Economic value stays local, fostering entrepreneurship and municipal employment across districts.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 04: COVER & MISSION (RP EXCLUSIVITY) */}
              {/* ========================================================= */}
              {rpSlide === 3 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center font-black text-blue-300 font-mono">
                        04
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                        NATIVELY REGIONAL • СТРАТЕГИЯ
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">NordBase.pt</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-2 sm:space-y-3">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight">
                        {lang === 'ru' ? (
                          <>
                            Эксклюзивные права на <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">регион.</span>
                          </>
                        ) : (
                          <>
                            Exclusive rights for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">region.</span>
                          </>
                        )}
                      </h1>
                      <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                        {lang === 'ru'
                          ? 'Regional Partner (RP) — это мастер-франчайзи и совладелец сети в своем регионе (например, Алгарве или Лиссабон). Вы строите инфраструктуру хабов и получаете пассивный доход со всех транзакций.'
                          : 'A Regional Partner (RP) is the master franchisee and network co-owner in their region (e.g., Algarve or Lisbon). You build the hub infrastructure and earn passive income from all transactions.'}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-900/80 border border-blue-500/30 rounded-2xl flex flex-col items-center text-center space-y-3">
                        <ShieldCheck className="w-8 h-8 text-blue-400" />
                        <h3 className="font-bold text-white">
                          {lang === 'ru' ? 'Эксклюзив на округ' : 'District Exclusivity'}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {lang === 'ru' ? 'Никто другой не сможет открыть хаб NordBase без вашего согласия' : 'No one else can open a NordBase hub without your consent'}
                        </p>
                      </div>
                      <div className="p-6 bg-slate-900/80 border border-cyan-500/30 rounded-2xl flex flex-col items-center text-center space-y-3">
                        <TrendingUp className="w-8 h-8 text-cyan-400" />
                        <h3 className="font-bold text-white">
                          {lang === 'ru' ? 'Пассивный доход' : 'Passive Income'}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {lang === 'ru' ? '10% от маржи ВСЕХ заказов в регионе навсегда' : '10% of margin from ALL regional orders forever'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 05: REGIONAL NETWORK ARCHITECTURE */}
              {/* ========================================================= */}
              {rpSlide === 4 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 font-black flex items-center justify-center font-mono">
                        05
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                        REGIONAL NETWORK ARCHITECTURE • СЕТЕВАЯ АРХИТЕКТУРА RP
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">NordBase Regional Strategy</span>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-display font-black text-white">
                      {lang === 'ru'
                        ? '1 Региональный Директор (RP) объединяет от 4 до 20 Территориальных Хабов (TP)'
                        : '1 Regional Director (RP) Coordinates 4 to 20 Territory Hubs (TP)'}
                    </h2>
                    <p className="text-slate-400 text-sm max-w-3xl">
                      {lang === 'ru'
                        ? 'Вместо того чтобы нанимать наемных сотрудников, RP управляет сетью мотивированных предпринимателей (TP), имеющих эксклюзивные права на свои города или районы.'
                        : 'Instead of managing hired employees, RP oversees a network of motivated local entrepreneurs (TP) with exclusive city rights.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <h3 className="font-bold text-white text-sm">
                        {lang === 'ru' ? 'Карта и Топология' : 'Regional Hub Mapping'}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lang === 'ru'
                          ? 'Проектирование зон ответственности хабов с учетом плотности населения, чтобы гарантировать скорость ответа < 3 минут.'
                          : 'Designing hub borders based on population density to guarantee response times < 3 minutes.'}
                      </p>
                    </div>
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <h3 className="font-bold text-white text-sm">
                        {lang === 'ru' ? 'Отбор и Обучение TP' : 'TP Selection & Onboarding'}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lang === 'ru'
                          ? 'Поиск и собеседование локальных операторов территорий, контроль усвоения стандартов скриптов и ИИ CRM.'
                          : 'Recruiting and vetting local territory operators, auditing script compliance and AI CRM usage.'}
                      </p>
                    </div>
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <h3 className="font-bold text-white text-sm">
                        {lang === 'ru' ? '100% Аптайм и Смены' : '100% Uptime & Shift Rota'}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lang === 'ru'
                          ? 'Контроль графиков смен операторов (2 смены по 8 ч = 16 часов/сут), организация бесперебойного резерва.'
                          : 'Managing operator shift rosters (2 shifts x 8h = 16h/day), ensuring fail-safe coverage during surges.'}
                      </p>
                    </div>
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                        4
                      </div>
                      <h3 className="font-bold text-white text-sm">
                        {lang === 'ru' ? 'B2B Рост и Партнеры' : 'B2B Regional Expansion'}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lang === 'ru'
                          ? 'Привлечение региональных гильдий мастеров, управляющих компаний (Condomíníos) и крупных подрядчиков.'
                          : 'Partnering with regional master associations, property managers, and large contractors.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              
              {/* ========================================================= */}
              {/* SLIDE 06: FINANCIAL CALCULATOR */}
              {/* ========================================================= */}
              {rpSlide === 5 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 font-black flex items-center justify-center font-mono">
                        06
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                        FINANCIAL CALCULATOR • КАЛЬКУЛЯТОР ДОХОДА RP
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Live Projections</span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
                    {/* Sliders (Col 7) */}
                    <div className="lg:col-span-7 space-y-2 sm:space-y-3 bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="font-mono font-bold text-blue-400 text-sm">{lang === 'ru' ? 'Параметры RP-Региона:' : 'RP Region Parameters:'}</span>
                        <span className="text-xxs text-slate-400 font-mono">{lang === 'ru' ? 'Интерактивные ползунки' : 'Interactive Sliders'}</span>
                      </div>
                      {/* Slider 1: Active Hubs */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-300">
                            {lang === 'ru' ? 'Активных хабов (TP) в регионе:' : 'Active Hubs (TPs) in Region:'}
                          </span>
                          <span className="text-blue-400 font-mono text-lg">{rpActiveHubs}</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="20"
                          step="1"
                          value={rpActiveHubs}
                          onChange={(e) => setRpActiveHubs(parseInt(e.target.value))}
                          className="w-full accent-blue-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                        />
                        <div className="flex justify-between text-xxs text-slate-500 font-mono">
                          <span>2 (Старт)</span>
                          <span>8 (Средний)</span>
                          <span>20 (Максимум)</span>
                        </div>
                      </div>
                      {/* Slider 2: Average daily leads per hub */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-300">
                            {lang === 'ru' ? 'Среднее число лидов на хаб в день:' : 'Average daily leads per hub:'}
                          </span>
                          <span className="text-blue-400 font-mono text-lg">{rpLeadsPerHub} {lang === 'ru' ? 'лидов/день' : 'leads/day'}</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="150"
                          step="5"
                          value={rpLeadsPerHub}
                          onChange={(e) => setRpLeadsPerHub(parseInt(e.target.value))}
                          className="w-full accent-blue-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                        />
                        <div className="flex justify-between text-xxs text-slate-500 font-mono">
                          <span>10 (Мин)</span>
                          <span>50 (Средний)</span>
                          <span>150 (Топ)</span>
                        </div>
                      </div>
                      {/* Slider 3: Average Lead Price */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-300">
                            {lang === 'ru' ? 'Средняя стоимость лида (€):' : 'Average lead price (€):'}
                          </span>
                          <span className="text-blue-400 font-mono text-lg">€{rpAvgLeadPrice.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="10.0"
                          max="30.0"
                          step="0.5"
                          value={rpAvgLeadPrice}
                          onChange={(e) => setRpAvgLeadPrice(Number(e.target.value))}
                          className="w-full accent-blue-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                        />
                        <div className="flex justify-between text-xxs text-slate-500 font-mono">
                          <span>€10.00 (Минимум)</span>
                          <span>€15.00 (Стандарт)</span>
                          <span>€30.00 (Премиум)</span>
                        </div>
                      </div>
                      <div className="p-4 bg-blue-950/30 border border-blue-500/20 rounded-xl text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-blue-300 block">💡 {lang === 'ru' ? 'Комиссия Regional Partner:' : 'Regional Partner Commission:'}</span>
                        <p className="text-slate-400 text-xxs leading-relaxed">
                          {lang === 'ru'
                            ? 'RP получает пассивный доход в размере 10% от стоимости всех лидов, обработанных хабами (TP) в его регионе. Расчет предполагает непрерывную работу хабов (30 дней в месяц).'
                            : 'RP receives a passive income of 10% from the value of all leads processed by hubs (TPs) in their region. The calculation assumes continuous hub operations (30 days/month).'}
                        </p>
                      </div>
                    </div>
                    {/* Results Card (Col 5) */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-slate-950 via-blue-950/40 to-slate-950 p-6 rounded-2xl border-2 border-blue-500/50 space-y-2 sm:space-y-3 flex flex-col justify-between shadow-2xl">
                      <div className="space-y-4">
                        <span className="text-xs font-mono font-bold uppercase text-blue-400 tracking-wider block">
                          {lang === 'ru' ? 'Прогноз пассивного дохода RP' : 'RP Passive Income Forecast'}
                        </span>
                        
                        <div className="space-y-1 border-b border-slate-800 pb-3">
                          <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Ваш доход с 1 лида (10%):' : 'Your earn per lead (10%):'}</span>
                          <span className="text-2xl font-black text-white font-mono">€{(rpAvgLeadPrice * 0.10).toFixed(2)}</span>
                        </div>
                        
                        <div className="space-y-1 border-b border-slate-800 pb-3">
                          <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Ежедневный доход со всех хабов:' : 'Daily income from all hubs:'}</span>
                          <span className="text-2xl font-black text-white font-mono">€{((rpAvgLeadPrice * 0.10) * rpActiveHubs * rpLeadsPerHub).toFixed(2)}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Ежемесячный доход (30 дней):' : 'Monthly Income (30 days):'}</span>
                          <div className="text-4xl font-black text-blue-300 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            €{(((rpAvgLeadPrice * 0.10) * rpActiveHubs * rpLeadsPerHub) * 30).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            <span className="text-xs text-slate-400 font-sans font-normal ml-2">/ {lang === 'ru' ? 'месяц' : 'month'}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1 pt-2 border-t border-slate-800">
                          <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Годовой потенциал RP:' : 'Annual Potential RP:'}</span>
                          <span className="text-xl font-black text-emerald-400 font-mono">
                            €{((((rpAvgLeadPrice * 0.10) * rpActiveHubs * rpLeadsPerHub) * 30) * 12).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / {lang === 'ru' ? 'год' : 'year'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Growth Stages */}
                      <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2 font-mono">
                        <div className="flex justify-between">
                          <span>{lang === 'ru' ? 'Старт (2 хаба по 15 лидов):' : 'Start (2 hubs x 15 leads):'}</span>
                          <span className="text-emerald-400 font-bold">~ €{(2 * 15 * 10.0 * 0.1 * 30).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} / мес</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'ru' ? 'Средний (5 хабов по 30 лидов):' : 'Medium (5 hubs x 30 leads):'}</span>
                          <span className="text-emerald-400 font-bold">~ €{(5 * 30 * 10.0 * 0.1 * 30).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} / мес</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'ru' ? 'Топ (20 хабов по 100 лидов):' : 'Top (20 hubs x 100 leads):'}</span>
                          <span className="text-emerald-400 font-bold">~ €{(20 * 100 * 10.0 * 0.1 * 30).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} / мес</span>
                        </div>
                      </div>
                    </div>
                  </div>
</div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 07: REGIONAL LAUNCH ROADMAP */}
              {/* ========================================================= */}
              {rpSlide === 6 && (
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 sm:space-y-4 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 font-black flex items-center justify-center font-mono">
                        07
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                        REGIONAL LAUNCH ROADMAP • ДОРОЖНАЯ КАРТА ЗАПУСКА РЕГИОНА
                      </span>
                    </div>
                    <span className="text-xs text-blue-400 font-mono font-semibold bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                      4 Step Strategy
                    </span>
                  </div>

                  {/* Roadmap Title & Subtitle */}
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                      {lang === 'ru' ? 'Этапы Запуска и Выхода на Мощность' : 'Launch Phases & Scaling Milestones'}
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      {lang === 'ru'
                        ? 'Пошаговый план действия Регионального Партнера от получения лицензии до полного покрытия региона.'
                        : 'Step-by-step roadmap for Regional Partners from initial onboarding to total regional coverage.'}
                    </p>
                  </div>

                  {/* 4 Phases Timeline Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Phase 1 */}
                    <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-blue-500/30 flex flex-col justify-between space-y-2 relative group hover:border-blue-400/60 transition-all">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-mono text-xxs font-bold uppercase">
                            {lang === 'ru' ? 'Этап 1' : 'Phase 1'}
                          </span>
                          <span className="text-xxs font-mono text-slate-400">
                            {lang === 'ru' ? 'Месяц 1' : 'Month 1'}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-sm">
                          {lang === 'ru' ? 'Старт и Инфраструктура' : 'Setup & Onboarding'}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {lang === 'ru'
                            ? 'Закрепление прав на регион, настройка личного кабинета RP T-Terminal, доступ к базе знаний и стандартам NordBase.'
                            : 'Securing regional rights, setting up RP T-Terminal dashboard, accessing knowledge base and operational standards.'}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 text-xxs text-cyan-400 font-mono">
                        ✓ {lang === 'ru' ? 'Лицензия & Терминал' : 'License & Terminal setup'}
                      </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-blue-500/30 flex flex-col justify-between space-y-2 relative group hover:border-blue-400/60 transition-all">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-mono text-xxs font-bold uppercase">
                            {lang === 'ru' ? 'Этап 2' : 'Phase 2'}
                          </span>
                          <span className="text-xxs font-mono text-slate-400">
                            {lang === 'ru' ? 'Месяц 1–2' : 'Months 1–2'}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-sm">
                          {lang === 'ru' ? 'Месяц Посева & Мастера' : 'Seeding & Specialists'}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {lang === 'ru'
                            ? 'Формирование первичной базы проверенных мастеров и запуск локального маркетинг-посева для генерации первички.'
                            : 'Building initial specialist roster and launching targeted local marketing campaigns to build early demand.'}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 text-xxs text-cyan-400 font-mono">
                        ✓ {lang === 'ru' ? 'База мастеров & Первый трафик' : 'Specialists & Initial traffic'}
                      </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-blue-500/30 flex flex-col justify-between space-y-2 relative group hover:border-blue-400/60 transition-all">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-mono text-xxs font-bold uppercase">
                            {lang === 'ru' ? 'Этап 3' : 'Phase 3'}
                          </span>
                          <span className="text-xxs font-mono text-slate-400">
                            {lang === 'ru' ? 'Месяц 1–2' : 'Months 1–2'}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-sm">
                          {lang === 'ru' ? 'Набор и Обучение TP' : 'TP Hiring & Network'}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {lang === 'ru'
                            ? 'Отбор и стажировка Territory Partners (операторов хабов), настройка графиков смен и передача управления локациями.'
                            : 'Recruiting and training Territory Partners (hub operators), establishing shift rosters and delegating territory ops.'}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 text-xxs text-cyan-400 font-mono">
                        ✓ {lang === 'ru' ? 'Первые хабы & 100% аптайм' : 'First hubs & 100% uptime'}
                      </div>
                    </div>

                    {/* Phase 4 */}
                    <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-blue-500/30 flex flex-col justify-between space-y-2 relative group hover:border-blue-400/60 transition-all">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-xxs font-bold uppercase">
                            {lang === 'ru' ? 'Этап 4' : 'Phase 4'}
                          </span>
                          <span className="text-xxs font-mono text-emerald-400 font-bold">
                            {lang === 'ru' ? 'Месяц 3+' : 'Months 3+'}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-sm">
                          {lang === 'ru' ? 'Масштаб & Пассивный Доход' : 'Scaling & Royalty'}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {lang === 'ru'
                            ? 'Выход региона на полную мощность, запуск всей сети хабов и получение стабильных 10% роялти от общего оборота лидов.'
                            : 'Reaching maximum regional volume, full hub coverage, and securing 10% passive royalty from total lead volume.'}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 text-xxs text-emerald-400 font-mono font-bold">
                        ✓ {lang === 'ru' ? 'Пассивный доход 10% от региона' : '10% Passive regional royalty'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 08: PARTNERSHIP AGREEMENT & LEGAL PROTECTION */}
              {/* ========================================================= */}
              {rpSlide === 7 && (
                <div className="flex-1 min-h-0 flex flex-col p-5 sm:p-7 lg:p-8 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between space-y-4 sm:space-y-5">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center font-black text-blue-300 font-mono">
                        08
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                        {lang === 'ru' ? 'ЗАЩИЩЕННОЕ ПАРТНЕРСТВО • LEGAL PROTECTION' : 'PROTECTED PARTNERSHIP'}
                      </span>
                    </div>
                    <span className="text-xs text-blue-400 font-mono font-semibold bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      Official Contract
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1.5 relative z-10">
                    <h2 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
                      {lang === 'ru' ? 'Партнёрство, защищённое соглашением' : 'Protected Partnership Agreement'}
                    </h2>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                      {lang === 'ru'
                        ? 'NordBase строит долгосрочные отношения с партнёрами на основе прозрачных правил и письменных обязательств.'
                        : 'NordBase builds long-term relationships with partners based on transparent rules and clear written commitments.'}
                    </p>
                  </div>

                  {/* 5 Key Guarantees Grid */}
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Item 1 */}
                    <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-blue-500/20 space-y-1.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="text-2xl">🛡️</div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">
                          {lang === 'ru' ? 'Закреплённая территория' : 'Protected Territory'}
                        </h4>
                        <p className="text-xxs text-slate-400 leading-relaxed">
                          {lang === 'ru' ? 'Эксклюзивное право развивать свой регион.' : 'Exclusive rights to develop your assigned region.'}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800 text-xxs text-cyan-400 font-mono">
                        ✓ {lang === 'ru' ? '100% Эксклюзив' : '100% Exclusive'}
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-blue-500/20 space-y-1.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="text-2xl">📄</div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">
                          {lang === 'ru' ? 'Партнёрское соглашение' : 'Formal Agreement'}
                        </h4>
                        <p className="text-xxs text-slate-400 leading-relaxed">
                          {lang === 'ru' ? 'Права, обязанности и правила сотрудничества закреплены письменно.' : 'Rights, duties, and operational terms legally bound in writing.'}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800 text-xxs text-cyan-400 font-mono">
                        ✓ {lang === 'ru' ? 'Письменный договор' : 'Written Contract'}
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-blue-500/20 space-y-1.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="text-2xl">⚖️</div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">
                          {lang === 'ru' ? 'Прозрачные условия' : 'Transparent Terms'}
                        </h4>
                        <p className="text-xxs text-slate-400 leading-relaxed">
                          {lang === 'ru' ? 'Чёткие основания для продолжения или прекращения партнёрства.' : 'Clear criteria for partnership continuity and growth.'}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800 text-xxs text-cyan-400 font-mono">
                        ✓ {lang === 'ru' ? 'Понятный регламент' : 'Clear Regulation'}
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-blue-500/20 space-y-1.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="text-2xl">🤝</div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">
                          {lang === 'ru' ? 'Защита вложенных усилий' : 'Asset Protection'}
                        </h4>
                        <p className="text-xxs text-slate-400 leading-relaxed">
                          {lang === 'ru' ? 'Сеть, созданная Regional Partner, развивается вместе с ним.' : 'The regional network built grows and generates value with you.'}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800 text-xxs text-cyan-400 font-mono">
                        ✓ {lang === 'ru' ? 'Защита вашего бизнеса' : 'Asset Equity'}
                      </div>
                    </div>

                    {/* Item 5 */}
                    <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-blue-500/20 space-y-1.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="text-2xl">📈</div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">
                          {lang === 'ru' ? 'Долгосрочная модель' : 'Long-Term Model'}
                        </h4>
                        <p className="text-xxs text-slate-400 leading-relaxed">
                          {lang === 'ru' ? 'NordBase заинтересован в успехе каждого партнёра.' : 'NordBase is directly aligned with each partner’s long-term success.'}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800 text-xxs text-cyan-400 font-mono">
                        ✓ {lang === 'ru' ? 'Совместный рост' : 'Win-Win Growth'}
                      </div>
                    </div>
                  </div>

                  {/* Highlight Central Final Quote */}
                  <div className="relative z-10 p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-950 to-indigo-950/80 border border-blue-500/40 shadow-inner text-center">
                    <p className="text-xs sm:text-sm font-semibold text-cyan-200 italic leading-relaxed">
                      «{lang === 'ru'
                        ? 'Мы строим партнёрство, основанное не на обещаниях, а на прозрачных правилах, взаимной ответственности и письменном соглашении.'
                        : 'We build a partnership founded not on empty promises, but on transparent rules, mutual accountability, and a formal written agreement.'}»
                    </p>
                  </div>
                </div>
              )}
              {/* ========================================================= */}
              {/* SLIDE 09: THE FUTURE WE CREATE TOGETHER */}
              {/* ========================================================= */}
              {rpSlide === 8 && (
                <div className="flex-1 min-h-0 flex flex-col p-5 sm:p-7 lg:p-8 rounded-3xl bg-gradient-to-br from-[#060e22] via-[#091738] to-[#040812] border-2 border-blue-500/40 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between space-y-4 sm:space-y-5">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-blue-500/20 pb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center font-black text-blue-300 font-mono">
                        09
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                        {lang === 'ru' ? 'БУДУЩЕЕ, КОТОРОЕ МЫ СОЗДАЁМ ВМЕСТЕ' : 'THE FUTURE WE CREATE TOGETHER'}
                      </span>
                    </div>
                    <span className="text-xs text-blue-300 font-mono font-bold bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                      NordBase Vision
                    </span>
                  </div>

                  {/* Main Hero Vision Title */}
                  <div className="space-y-2 relative z-10">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white leading-tight">
                      {lang === 'ru' ? (
                        <>
                          NordBase — это <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">больше, чем технологическая платформа</span>
                        </>
                      ) : (
                        <>
                          NordBase — <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">More Than Just a Tech Platform</span>
                        </>
                      )}
                    </h2>
                    <p className="text-blue-100/90 text-xs sm:text-sm max-w-4xl leading-relaxed">
                      {lang === 'ru'
                        ? 'Мы создаём среду, в которой независимые предприниматели объединяются, помогают друг другу развиваться, обмениваются опытом, обучаются, строят доверие и вместе формируют сильную локальную экономику.'
                        : 'We build an environment where independent entrepreneurs unite, help each other develop, share expertise, learn, establish trust, and shape a thriving local economy together.'}
                    </p>
                  </div>

                  {/* Highlight Central Quote Box */}
                  <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-blue-950/60 border border-cyan-500/40 shadow-inner">
                    <p className="text-xs sm:text-sm font-semibold text-cyan-200 italic leading-relaxed text-center">
                      «{lang === 'ru'
                        ? 'Мы создаём возможности, в которых предприниматели помогают друг другу расти, развивать свои территории и строить устойчивое будущее для себя и своих сообществ.'
                        : 'We create opportunities where entrepreneurs help each other grow, develop their territories, and build a sustainable future for themselves and their communities.'}»
                    </p>
                  </div>

                  {/* 5 What NordBase Provides Grid */}
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                    <div className="p-3 bg-slate-950/80 rounded-2xl border border-blue-500/20 space-y-1">
                      <div className="text-lg">🤝</div>
                      <h4 className="font-bold text-white text-xs">{lang === 'ru' ? 'Новые возможности' : 'New Opportunities'}</h4>
                      <p className="text-xxs text-slate-400 leading-normal">
                        {lang === 'ru' ? 'Для развития бизнеса и роста доходов.' : 'For growth and expansion of local business.'}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded-2xl border border-blue-500/20 space-y-1">
                      <div className="text-lg">📚</div>
                      <h4 className="font-bold text-white text-xs">{lang === 'ru' ? 'Обучение & Стандарты' : 'Training & Standards'}</h4>
                      <p className="text-xxs text-slate-400 leading-normal">
                        {lang === 'ru' ? 'Единые стандарты и передача опыта.' : 'Unified service standards and expert training.'}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded-2xl border border-blue-500/20 space-y-1">
                      <div className="text-lg">🌍</div>
                      <h4 className="font-bold text-white text-xs">{lang === 'ru' ? 'Сообщество' : 'Community'}</h4>
                      <p className="text-xxs text-slate-400 leading-normal">
                        {lang === 'ru' ? 'Предприниматели с общей целью.' : 'Strong network united by a shared vision.'}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded-2xl border border-blue-500/20 space-y-1">
                      <div className="text-lg">💼</div>
                      <h4 className="font-bold text-white text-xs">{lang === 'ru' ? 'Устойчивый Бизнес' : 'Sustainable Business'}</h4>
                      <p className="text-xxs text-slate-400 leading-normal">
                        {lang === 'ru' ? 'Надёжное дело в своём регионе.' : 'Predictable long-term regional revenue.'}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded-2xl border border-blue-500/20 space-y-1">
                      <div className="text-lg">🏡</div>
                      <h4 className="font-bold text-white text-xs">{lang === 'ru' ? 'Вклад в Общество' : 'Community Impact'}</h4>
                      <p className="text-xxs text-slate-400 leading-normal">
                        {lang === 'ru' ? 'Развитие локальной экономики.' : 'Contribution to local community economy.'}
                      </p>
                    </div>
                  </div>

                  {/* Final Call To Action & Invitation */}
                  <div className="relative z-10 p-4 bg-gradient-to-r from-blue-950/90 via-slate-950 to-indigo-950/90 border border-blue-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <p className="text-xxs text-blue-300 font-mono font-bold uppercase tracking-wider">
                        {lang === 'ru' ? 'ПРИСОЕДИНЯЙТЕСЬ К NORDBASE' : 'JOIN THE MOVEMENT'}
                      </p>
                      <h3 className="font-bold text-white text-xs sm:text-sm">
                        {lang === 'ru'
                          ? 'Будущее создают люди, которые готовы строить его вместе. NordBase приглашает стать одним из них.'
                          : 'The future is built by people who are ready to create it together. NordBase invites you to join us.'}
                      </h3>
                    </div>
                    <a
                      href="/partner"
                      className="inline-flex px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 font-black text-xs rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] items-center gap-2 shrink-0 cursor-pointer"
                    >
                      <span>{lang === 'ru' ? 'Стать Партнёром NordBase' : 'Become a NordBase Partner'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
{/* LEVEL 3: INVESTOR PITCH DECK (11 SLIDES ACCORDING TO PDF SPEC) */}
        {/* ========================================================================= */}
        {level === 'investor' && (
          <div className="flex-1 min-h-0 flex flex-col space-y-2 sm:space-y-3">
            {/* Slide Navigation Header */}
            <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-900/90 border border-amber-500/30 p-2 sm:p-2.5 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-mono font-bold">
                  SLIDE {currentSlide + 1} / {investorSlidesCount}
                </div>
                <h3 className="font-bold text-white text-sm">
                  {currentSlide === 0 && (lang === 'ru' ? '01. Инфраструктура Локальных Услуг' : '01. Local Services Infrastructure')}
                  {currentSlide === 1 && (lang === 'ru' ? '02. Проблема Рынка' : '02. Market Problem')}
                  {currentSlide === 2 && (lang === 'ru' ? '03. Решение NordBase' : '03. NordBase Solution')}
                  {currentSlide === 3 && (lang === 'ru' ? '04. Почему NordBase отличается' : '04. Why NordBase Differs')}
                  {currentSlide === 4 && (lang === 'ru' ? '05. Сеть, а не маркетплейс' : '05. Network, Not a Marketplace')}
                  {currentSlide === 5 && (lang === 'ru' ? '06. Рынок и Возможности' : '06. Market & Opportunities')}
                  {currentSlide === 6 && (lang === 'ru' ? '07. Бизнес-модель и Монетизация' : '07. Business Model & Monetization')}
                  {currentSlide === 7 && (lang === 'ru' ? '08. Экосистема NordBase' : '08. NordBase Ecosystem')}
                  {currentSlide === 8 && (lang === 'ru' ? '09. Масштабирование' : '09. Scaling Strategy')}
                  {currentSlide === 9 && (lang === 'ru' ? '10. Финансовые показатели' : '10. Financial Potential')}
                  {currentSlide === 10 && (lang === 'ru' ? '11. Финал & Инвестиции' : '11. Investment Opportunity')}
                </h3>
              </div>
              {/* Prev / Next Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer"
                >
                  <span>{lang === 'ru' ? 'Далее' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* SLIDE CANVAS CONTAINER */}
            <div className="flex-1 min-h-0 bg-gradient-to-br from-[#050b18] via-[#09152b] to-[#040813] border-2 border-amber-500/30 rounded-3xl p-4 sm:p-5 lg:p-6 relative overflow-y-auto custom-scrollbar flex flex-col justify-between shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
              {/* SLIDE 1: COVER */}
              {currentSlide === 0 && (
                <div className="flex-1 min-h-0 flex flex-col space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center font-black text-cyan-400 text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                      NB
                    </div>
                    <span className="font-display font-black text-3xl text-white tracking-tight">
                      NordBase<span className="text-cyan-400">.pt</span>
                    </span>
                  </div>
                  <div className="space-y-4 max-w-4xl">
                    <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                      {lang === 'ru' ? 'ИНФРАСТРУКТУРА ЛОКАЛЬНЫХ УСЛУГ ПОРТУГАЛИИ' : 'LOCAL SERVICES INFRASTRUCTURE OF PORTUGAL'}
                    </h2>
                    <h1 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
                      {lang === 'ru'
                        ? 'NordBase — платформа, где заказчик с помощью местного оператора находит проверенных специалистов для своих работ и услуг.'
                        : 'NordBase is a platform where customers find trusted local professionals with the help of a local coordinator.'}
                    </h1>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-6 border-t border-slate-800 text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-white block">{lang === 'ru' ? 'Для клиентов' : 'For Customers'}</span>
                      <span className="text-slate-400">{lang === 'ru' ? 'быстро, удобно и с гарантией' : 'fast, easy & guaranteed'}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-white block">{lang === 'ru' ? 'Для специалистов' : 'For Pros'}</span>
                      <span className="text-slate-400">{lang === 'ru' ? 'проверенные лиды и честные условия' : 'verified leads & fair fees'}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-white block">{lang === 'ru' ? 'Для партнёров' : 'For Partners'}</span>
                      <span className="text-slate-400">{lang === 'ru' ? 'реальный бизнес и развитие территории' : 'real business & growth'}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-white block">{lang === 'ru' ? 'Для страны' : 'For Nation'}</span>
                      <span className="text-slate-400">{lang === 'ru' ? 'развитие малого бизнеса' : 'SMB economic growth'}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-white block">{lang === 'ru' ? 'Для людей' : 'For People'}</span>
                      <span className="text-slate-400">{lang === 'ru' ? 'доверие и человеческий подход' : 'trust & human touch'}</span>
                    </div>
                  </div>
                </div>
              )}
              {/* SLIDE 2: PROBLEM */}
              {currentSlide === 1 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono font-bold text-rose-400 uppercase">02. PROBLEM / ПРОБЛЕМА</span>
                    <span className="text-xs text-slate-400">NordBase Investor Deck</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-display font-black text-white">
                    {lang === 'ru'
                      ? 'Поиск специалиста сегодня — это долго, сложно и рискованно.'
                      : 'Finding a reliable local specialist today is slow, complex, and risky.'}
                  </h2>
                  {/* Flow of chaos */}
                  <div className="flex flex-wrap items-center justify-center gap-3 py-4 text-xs font-bold text-slate-300">
                    <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">Client</span>
                    <span>→</span>
                    <span className="px-3 py-1.5 bg-blue-900/40 border border-blue-800 rounded-xl">Facebook</span>
                    <span>→</span>
                    <span className="px-3 py-1.5 bg-emerald-900/40 border border-emerald-800 rounded-xl">WhatsApp</span>
                    <span>→</span>
                    <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">Google</span>
                    <span>→</span>
                    <span className="px-3 py-1.5 bg-amber-900/40 border border-amber-800 rounded-xl">OLX</span>
                    <span>→</span>
                    <span className="px-3 py-1.5 bg-rose-900/40 border border-rose-800 rounded-xl">Random Master</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 text-xs">
                    <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-center space-y-1">
                      <X className="w-5 h-5 mx-auto text-rose-400" />
                      <span className="font-bold text-white block">{lang === 'ru' ? 'Нет гарантий' : 'No Guarantees'}</span>
                    </div>
                    <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-center space-y-1">
                      <HelpCircle className="w-5 h-5 mx-auto text-rose-400" />
                      <span className="font-bold text-white block">{lang === 'ru' ? 'Потеря времени' : 'Lost Time'}</span>
                    </div>
                    <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-center space-y-1">
                      <AlertTriangle className="w-5 h-5 mx-auto text-rose-400" />
                      <span className="font-bold text-white block">{lang === 'ru' ? 'Нет доверия' : 'Zero Trust'}</span>
                    </div>
                    <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-center space-y-1">
                      <FileText className="w-5 h-5 mx-auto text-rose-400" />
                      <span className="font-bold text-white block">{lang === 'ru' ? 'Сложно выбрать' : 'Hard to Choose'}</span>
                    </div>
                    <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-center space-y-1">
                      <DollarSign className="w-5 h-5 mx-auto text-rose-400" />
                      <span className="font-bold text-white block">{lang === 'ru' ? 'Непрозрачные цены' : 'Opaque Prices'}</span>
                    </div>
                  </div>
                </div>
              )}
              {/* SLIDE 3: SOLUTION */}
              {currentSlide === 2 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">03. SOLUTION / РЕШЕНИЕ</span>
                    <span className="text-xs text-slate-400">NordBase Investor Deck</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-display font-black text-white">
                    {lang === 'ru'
                      ? 'NordBase объединяет людей, технологии и локальных предпринимателей в единую систему.'
                      : 'NordBase unites people, technologies, and local entrepreneurs into one ecosystem.'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-4 text-xs">
                    <div className="p-4 bg-slate-900 border border-cyan-500/30 rounded-2xl space-y-2">
                      <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                      <h3 className="font-bold text-white">{lang === 'ru' ? 'Проверенные специалисты' : 'Verified Specialists'}</h3>
                      <p className="text-slate-400">{lang === 'ru' ? 'Отбор, верификация документов и рейтинги.' : 'Strict vetting and identity verification.'}</p>
                    </div>
                    <div className="p-4 bg-slate-900 border border-cyan-500/30 rounded-2xl space-y-2">
                      <Headphones className="w-6 h-6 text-cyan-400" />
                      <h3 className="font-bold text-white">{lang === 'ru' ? 'Живое сопровождение' : 'Live Human Touch'}</h3>
                      <p className="text-slate-400">{lang === 'ru' ? 'Territory Partner сопровождает заказ от заявки до приемки.' : 'TP coordinates job from request to completion.'}</p>
                    </div>
                    <div className="p-4 bg-slate-900 border border-cyan-500/30 rounded-2xl space-y-2">
                      <Zap className="w-6 h-6 text-cyan-400" />
                      <h3 className="font-bold text-white">{lang === 'ru' ? 'Квалифицированные лиды' : 'Qualified Leads'}</h3>
                      <p className="text-slate-400">{lang === 'ru' ? 'Специалисты получают только целевые оплаченные лиды.' : 'Pros receive pre-qualified, target requests.'}</p>
                    </div>
                    <div className="p-4 bg-slate-900 border border-cyan-500/30 rounded-2xl space-y-2">
                      <ShieldCheck className="w-6 h-6 text-cyan-400" />
                      <h3 className="font-bold text-white">{lang === 'ru' ? 'Единые стандарты' : 'Unified Standards'}</h3>
                      <p className="text-slate-400">{lang === 'ru' ? 'Академия NordBase и контроль качества.' : 'NordBase Academy & quality protocols.'}</p>
                    </div>
                  </div>
                </div>
              )}
              {/* SLIDE 4: WHY NORDBASE DIFFERS */}
              {currentSlide === 3 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">04. DIFFERENTIATION / ОТЛИЧИЯ</span>
                    <span className="text-xs text-slate-400">NordBase Investor Deck</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
                    {lang === 'ru' ? 'Почему NordBase отличается от классических сервисов' : 'Why NordBase Distinguishes Itself from Classic Platforms'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-cyan-950/30 border border-cyan-500/40 rounded-2xl space-y-2">
                      <span className="font-bold text-cyan-300 text-sm block">NordBase Model</span>
                      <ul className="space-y-1.5 text-slate-200">
                        <li>✓ Живой человек рядом (Territory Partner + ИИ-чат)</li>
                        <li>✓ Строгая верификация мастеров и контроль</li>
                        <li>✓ Квалифицированные лиды без спама</li>
                        <li>✓ Академия NordBase и стандарты</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-slate-400">
                      <span className="font-bold text-slate-500 text-sm block">Other Solutions</span>
                      <ul className="space-y-1.5">
                        <li>✗ Безличные боты без ответственности</li>
                        <li>✗ Любой может разместить объявление без проверки</li>
                        <li>✗ Хаотичный поиск среди сотен объявлений</li>
                        <li>✗ Хаотичный рынок без стандартов</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {/* SLIDE 5: NOT A MARKETPLACE */}
              {currentSlide === 4 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">05. POSITIONING / ПОЗИЦИОНИРОВАНИЕ</span>
                    <span className="text-xs text-slate-400">NordBase Investor Deck</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
                    {lang === 'ru'
                      ? 'Мы не маркетплейс. Мы создаём национальную сеть.'
                      : 'We are not a marketplace. We build a national network.'}
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {lang === 'ru'
                      ? 'NordBase — это не витрина объявлений, а инфраструктура развития независимых предпринимателей и повышение качества локальных услуг в каждой фрегезии Португалии.'
                      : 'NordBase is not a classifieds board, but infrastructure for independent entrepreneurship and local service quality elevation across Portugal.'}
                  </p>
                </div>
              )}
              {/* SLIDE 6: MARKET & OPPORTUNITY */}
              {currentSlide === 5 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">06. MARKET / РЫНОК И ПОТЕНЦИАЛ</span>
                    <span className="text-xs text-slate-400">NordBase Investor Deck</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                      <span className="text-3xl font-black text-cyan-300 font-mono block">10M+</span>
                      <span className="text-xxs text-slate-400 uppercase">{lang === 'ru' ? 'Население Португалии' : 'Portugal Population'}</span>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                      <span className="text-3xl font-black text-cyan-300 font-mono block">1.2M+</span>
                      <span className="text-xxs text-slate-400 uppercase">{lang === 'ru' ? 'Микро-предприятий' : 'Micro Enterprises'}</span>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                      <span className="text-3xl font-black text-cyan-300 font-mono block">€20B+</span>
                      <span className="text-xxs text-slate-400 uppercase">{lang === 'ru' ? 'Рынок локальных услуг' : 'Local Services Market'}</span>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                      <span className="text-3xl font-black text-emerald-400 font-mono block">10%+</span>
                      <span className="text-xxs text-slate-400 uppercase">{lang === 'ru' ? 'Ежегодный рост' : 'Annual Market Growth'}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-2">
                    <span className="font-bold text-white block">{lang === 'ru' ? 'Высокоспросовые сегменты:' : 'High demand segments:'}</span>
                    <p className="text-slate-400">
                      Сантехника • Электрика • Мастер на час • Уборка • Сад и участок • Переезды • Климат и кондиционеры • Бассейны и SPA • Ремонт.
                    </p>
                  </div>
                </div>
              )}
              {/* SLIDE 7: BUSINESS MODEL */}
              {currentSlide === 6 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">07. BUSINESS MODEL / БИЗНЕС-МОДЕЛЬ</span>
                    <span className="text-xs text-slate-400">NordBase Investor Deck</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
                    {lang === 'ru' ? 'Прозрачное распределение стоимости лида (€7.50 avg)' : 'Fair Unit Lead Monetization (€7.50 avg lead price)'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-2xl">
                      <span className="text-xxs text-cyan-400 uppercase block">TP Share (40%)</span>
                      <span className="text-2xl font-black text-cyan-300">€3.00</span>
                      <span className="text-xxs text-slate-400 block mt-1">Territory Operator</span>
                    </div>
                    <div className="p-4 bg-blue-950/40 border border-blue-500/40 rounded-2xl">
                      <span className="text-xxs text-blue-400 uppercase block">RP Share (10%)</span>
                      <span className="text-2xl font-black text-blue-300">€0.75</span>
                      <span className="text-xxs text-slate-400 block mt-1">Regional Director</span>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                      <span className="text-xxs text-amber-400 uppercase block">Platform (5%)</span>
                      <span className="text-2xl font-black text-amber-300">€0.38</span>
                      <span className="text-xxs text-slate-400 block mt-1">Core Tech & R&D</span>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                      <span className="text-xxs text-emerald-400 uppercase block">Admin/System (5%)</span>
                      <span className="text-2xl font-black text-emerald-300">€0.38</span>
                      <span className="text-xxs text-slate-400 block mt-1">Infrastructure & Support</span>
                    </div>
                  </div>
                </div>
              )}
              {/* SLIDE 8: ECOSYSTEM */}
              {currentSlide === 7 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">08. ECOSYSTEM / ЭКОСИСТЕМА</span>
                    <span className="text-xs text-slate-400">NordBase Investor Deck</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-bold text-white">National Partner</div>
                    <div className="p-3 bg-blue-950 border border-blue-800 rounded-xl font-bold text-blue-300">Regional Partner</div>
                    <div className="p-3 bg-cyan-950 border border-cyan-800 rounded-xl font-bold text-cyan-300">Territory Partner</div>
                    <div className="p-3 bg-amber-950 border border-amber-800 rounded-xl font-bold text-amber-300">Verified Specialist</div>
                    <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl font-bold text-emerald-300">Customer</div>
                  </div>
                </div>
              )}
              {/* SLIDE 9: SCALING TIMELINE */}
              {currentSlide === 8 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">09. SCALING / МАСШТАБИРОВАНИЕ</span>
                    <span className="text-xs text-slate-400">NordBase Investor Deck</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="p-5 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl space-y-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 block">Phase 1 • Algarve Pilot</span>
                      <h3 className="font-bold text-white text-sm">8 to 20 Hubs</h3>
                      <p className="text-slate-400">{lang === 'ru' ? 'Пилотный регион Алгарве. Отладка ИИ-чата и операционных стандартов.' : 'Pilot region Algarve. AI-chat and operational standards refinement.'}</p>
                    </div>
                    <div className="p-5 bg-blue-950/30 border border-blue-500/30 rounded-2xl space-y-2">
                      <span className="text-xs font-mono font-bold text-blue-400 block">Phase 2 • Greater Lisbon</span>
                      <h3 className="font-bold text-white text-sm">2.8M+ Population</h3>
                      <p className="text-slate-400">{lang === 'ru' ? 'Экспансия в Большой Лиссабон и центральные регионы.' : 'Expansion into Greater Lisbon and central regions.'}</p>
                    </div>
                    <div className="p-5 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl space-y-2">
                      <span className="text-xs font-mono font-bold text-indigo-400 block">Phase 3 • Spain</span>
                      <h3 className="font-bold text-white text-sm">Next Market</h3>
                      <p className="text-slate-400">{lang === 'ru' ? 'Выход на рынок Испании. Адаптация под новые реалии и языки.' : 'Entry into the Spanish market. Adaptation to new realities and languages.'}</p>
                    </div>
                    <div className="p-5 bg-slate-900 border border-amber-500/30 rounded-2xl space-y-2">
                      <span className="text-xs font-mono font-bold text-amber-400 block">Phase 4 • Borderless</span>
                      <h3 className="font-bold text-white text-sm">USA, Brazil, Global</h3>
                      <p className="text-slate-400">{lang === 'ru' ? 'Модель не зависит от региона. Хабы могут открываться в США, Бразилии и любой точке мира.' : 'The model is region-independent. Hubs can be launched in the USA, Brazil, and worldwide.'}</p>
                    </div>
                  </div>
                </div>
              )}
              {/* SLIDE 10: FINANCIAL POTENTIAL */}
              {currentSlide === 9 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                     <span className="text-xs font-mono font-bold text-amber-400 uppercase">10. FINANCIAL FORECAST / ФИНАНСЫ</span>
                     <span className="text-xs text-slate-400">NordBase Investor Deck</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-2xl font-black text-cyan-300 font-mono block">€15K / день</span>
                      <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Объём рынка лидов в день (Алгарве)' : 'Daily Lead Volume (Algarve, 20 hubs)'}</span>
                    </div>
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-2xl font-black text-blue-300 font-mono block">€450K</span>
                      <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Ежемесячный объём региона (Алгарве)' : 'Monthly Regional Volume (Algarve)'}</span>
                    </div>
                    <div className="p-6 bg-slate-900 border border-amber-500/30 rounded-2xl space-y-2">
                      <span className="text-2xl font-black text-amber-300 font-mono block">€100M+</span>
                      <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Годовой объём рынка Португалии' : 'Annual Portugal Target Volume'}</span>
                    </div>
                  </div>
                </div>
              )}
              {/* SLIDE 11: FINAL */}
              {currentSlide === 10 && (
                <div className="space-y-4 text-center py-6 max-w-4xl mx-auto">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center font-black text-amber-300 text-2xl mx-auto shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                    NB
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-display font-black text-white">
                    {lang === 'ru'
                      ? 'NordBase — это больше, чем технологическая платформа.'
                      : 'NordBase — More Than Just a Tech Platform.'}
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
                    {lang === 'ru'
                      ? 'Мы создаём возможности, в которых предприниматели помогают друг другу расти, развивать свои территории и строить устойчивое будущее для себя и своих сообществ.'
                      : 'We create opportunities where entrepreneurs help each other grow, develop their territories, and build a sustainable future for themselves and their communities.'}
                  </p>
                  <p className="text-amber-300 font-semibold text-base sm:text-lg max-w-2xl mx-auto pt-2">
                    {lang === 'ru'
                      ? 'Будущее создают люди, которые готовы строить его вместе. NordBase приглашает стать одним из них.'
                      : 'The future is built by people who are ready to create it together. NordBase invites you to join us.'}
                  </p>
                </div>
              )}
              {/* Slide Counter Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-500 font-mono">
                <span>NordBase © 2026 • Confidential Investor Deck</span>
                <span>Slide {currentSlide + 1} of {investorSlidesCount}</span>
              </div>
            </div>
            {/* NORDBASE SUSTAINABILITY SLIDE INSIDE INVESTOR DECK */}
            <div className="p-8 bg-slate-900/90 border border-amber-500/30 rounded-3xl space-y-2 sm:space-y-3 shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-400">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xxs font-mono font-bold uppercase tracking-wider text-amber-400 block">
                    {lang === 'ru' ? 'Защищённость Инвестиций' : 'Investment Defensibility'}
                  </span>
                  <h2 className="text-2xl font-display font-black text-white">
                    {lang === 'ru' ? 'Устойчивость и Моэт NordBase (Sustainability)' : 'NordBase Sustainability & Competitive Moat'}
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-300 block">✓ Технологический Моэт</span>
                  <p className="text-slate-400">Собственная CRM-система и мультиязычный ИИ-переводчик голосовых сообщений.</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-300 block">✓ 3-Уровневое Резервирование</span>
                  <p className="text-slate-400">Перенаправление невыкупленных заказов между хабами гарантирует 100% выполнение.</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-300 block">✓ Высокий LTV Клиента</span>
                  <p className="text-slate-400">65%+ повторных заказов благодаря стандартизации качества через Академию NordBase.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}