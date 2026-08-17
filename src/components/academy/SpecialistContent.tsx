import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Search,
  Check,
  X,
  Sparkles,
  Award,
  CircleDollarSign,
  Briefcase,
  MapPin,
  AlertCircle,
  Users,
  RefreshCw,
  Zap,
  DollarSign,
  UserCheck,
  Layers,
  Building2,
  Compass,
  ShieldCheck,
  FileCheck,
  Scale,
  Calculator,
  Clock,
  SearchCheck,
  CheckSquare,
  PhoneCall,
  MessageSquare,
  TrendingUp,
  HeartHandshake,
  HelpCircle,
  RotateCcw,
  FileText,
  GraduationCap,
  Star
} from 'lucide-react';
import { Module, Section } from './curriculumData';

interface SpecialistContentProps {
  expandedSection: string | null;
  lang: 'en' | 'pt' | 'ru';
  currentModuleObj?: Module;
  currentSectionObj?: Section;
  completedModules?: string[];
  onCompleteModule?: (moduleId: string) => void;
  onNavigateToModule?: (moduleId: string, sectionId?: string) => void;
}

export function SpecialistContent({
  expandedSection,
  lang: _lang,
  currentModuleObj,
  currentSectionObj,
  completedModules = [],
  onCompleteModule,
  onNavigateToModule
}: SpecialistContentProps) {
  // State for Module 0 Glossary Filter
  const [glossarySearch, setGlossarySearch] = useState('');

  // State for Module 17 Final Test
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);

  // Determine active module ID
  const sectionId = expandedSection || 'sec_spec_00_1';

  const activeModId = currentModuleObj?.id || (
    sectionId.includes('_spec_00_') || sectionId === 'spec_mod_00' ? 'spec_mod_00' :
    sectionId.includes('_spec_01_') || sectionId === 'spec_mod_01' ? 'spec_mod_01' :
    sectionId.includes('_spec_02_') || sectionId === 'spec_mod_02' ? 'spec_mod_02' :
    sectionId.includes('_spec_03_') || sectionId === 'spec_mod_03' ? 'spec_mod_03' :
    sectionId.includes('_spec_04_') || sectionId === 'spec_mod_04' ? 'spec_mod_04' :
    sectionId.includes('_spec_05_') || sectionId === 'spec_mod_05' ? 'spec_mod_05' :
    sectionId.includes('_spec_06_') || sectionId === 'spec_mod_06' ? 'spec_mod_06' :
    sectionId.includes('_spec_07_') || sectionId === 'spec_mod_07' ? 'spec_mod_07' :
    sectionId.includes('_spec_08_') || sectionId === 'spec_mod_08' ? 'spec_mod_08' :
    sectionId.includes('_spec_09_') || sectionId === 'spec_mod_09' ? 'spec_mod_09' :
    sectionId.includes('_spec_10_') || sectionId === 'spec_mod_10' ? 'spec_mod_10' :
    sectionId.includes('_spec_11_') || sectionId === 'spec_mod_11' ? 'spec_mod_11' :
    sectionId.includes('_spec_12_') || sectionId === 'spec_mod_12' ? 'spec_mod_12' :
    sectionId.includes('_spec_13_') || sectionId === 'spec_mod_13' ? 'spec_mod_13' :
    sectionId.includes('_spec_14_') || sectionId === 'spec_mod_14' ? 'spec_mod_14' :
    sectionId.includes('_spec_15_') || sectionId === 'spec_mod_15' ? 'spec_mod_15' :
    sectionId.includes('_spec_16_') || sectionId === 'spec_mod_16' ? 'spec_mod_16' :
    sectionId.includes('_spec_17_') || sectionId === 'spec_mod_17' ? 'spec_mod_17' :
    'spec_mod_00'
  );

  // Specialist module completed count (out of 18)
  const specCompletedCount = completedModules.filter(id => id.startsWith('spec_mod_')).length;

  // Glossary Terms with Definition & Practical Example
  const GLOSSARY_TERMS = [
    {
      term: 'NordBase',
      def: 'The platform connecting Customers with verified local Specialists through local human coordination.',
      example: 'Example: A homeowner needs a plumber; NordBase matches them with a verified local Specialist through a local Territory Partner.'
    },
    {
      term: 'Customer',
      def: 'A person or business looking for a Specialist for a job or service.',
      example: 'Example: An office manager requiring air conditioning maintenance or a homeowner needing lock replacement.'
    },
    {
      term: 'Specialist',
      def: 'An independent professional or entrepreneur who provides services to Customers through NordBase.',
      example: 'Example: An independent certified electrician or HVAC technician operating their own business.'
    },
    {
      term: 'TP — Territory Partner',
      def: 'The local NordBase partner responsible for developing the territory, working with Customers and Specialists, processing Requests and coordinating Leads.',
      example: 'Example: The local TP handles marketing and qualifies customer requests in Porto before offering verified leads to Specialists.'
    },
    {
      term: 'RP — Regional Partner',
      def: 'The partner responsible for developing and supporting NordBase within a larger region and coordinating the regional network.',
      example: 'Example: Oversees regional platform availability and supports TPs across Northern Portugal.'
    },
    {
      term: 'Hub',
      def: 'A local operating territory within a NordBase region.',
      example: 'Example: Porto Central Hub or Cascais Operating Zone.'
    },
    {
      term: 'Request',
      def: 'A Customer\'s description of a problem, job or service they need.',
      example: 'Example: "My electric water heater is leaking from the bottom and needs urgent inspection."'
    },
    {
      term: 'Lead',
      def: 'A qualified commercial opportunity prepared through the NordBase process and offered to a Specialist.',
      example: 'Example: A verified lead containing exact job description, confirmed address, equipment photos, and customer readiness.'
    },
    {
      term: 'Job',
      def: 'A Lead that has been accepted and is being carried out by a Specialist.',
      example: 'Example: An accepted water heater replacement in active progress on-site.'
    },
    {
      term: 'Lead Fee',
      def: 'The fee paid by the Specialist for access to a qualified Lead according to NordBase pricing rules.',
      example: 'Example: Paying a €15 Lead Fee to access a qualified €250 plumbing installation opportunity.'
    },
    {
      term: 'Call-out Fee',
      def: 'A €20 compensation paid to the Specialist for a completed visit when the Customer decides not to proceed with the work after the on-site assessment.',
      example: 'Example: You arrive on site, inspect the equipment, provide an updated quote, but the customer declines — you receive €20 for travel and diagnostic time.'
    },
    {
      term: 'Verification',
      def: 'The NordBase process of checking relevant Specialist information before the Specialist becomes verified.',
      example: 'Example: Submitting your business registration (ENI/LDA) and ID for platform verification.'
    },
    {
      term: 'Dashboard',
      def: 'The Specialist\'s personal working area inside NordBase.',
      example: 'Example: Where you view new incoming leads, manage active jobs, track your earnings, and set your working territory.'
    },
    {
      term: 'Stripe',
      def: 'The payment infrastructure used by NordBase for applicable payments.',
      example: 'Example: Securely purchasing lead credits or processing digital platform transactions.'
    }
  ];

  const filteredGlossary = GLOSSARY_TERMS.filter(
    (item) =>
      item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.def.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.example.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-200">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold">
              <Award className="w-3.5 h-3.5" />
              INDEPENDENT SPECIALIST ACADEMY
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              NordBase Specialist Academy
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Practical onboarding and operating guide for independent professionals and entrepreneurs.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-3.5 py-2 rounded-xl">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Academy Progress: <strong className="text-white">{specCompletedCount} / 18</strong> modules completed</span>
            </div>

            <div className="hidden sm:flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <Shield className="w-7 h-7 text-cyan-400 shrink-0" />
              <div className="text-xs">
                <div className="font-bold text-white">Independent Entrepreneur</div>
                <div className="text-slate-400">Non-Employee Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODULE 0: GLOSSARY */}
      {activeModId === 'spec_mod_00' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  MODULE 0 — GLOSSARY
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Practical glossary of key NordBase terminology for Specialists.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Search term or keyword..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {filteredGlossary.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 space-y-2 transition-all"
                >
                  <div className="font-mono font-bold text-sm text-cyan-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {item.term}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.def}</p>
                  {item.example && (
                    <div className="bg-slate-900/90 border border-slate-800/60 p-2.5 rounded-lg text-[11px] text-slate-400 font-sans italic">
                      {item.example}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <ModuleFooter
              moduleId="spec_mod_00"
              nextModuleId="spec_mod_01"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 1: HOW NORDBASE WORKS */}
      {activeModId === 'spec_mod_01' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                MODULE 1 — HOW NORDBASE WORKS
              </h3>
              <p className="text-sm font-medium text-cyan-300 mt-2 italic bg-cyan-950/30 border border-cyan-500/20 p-3.5 rounded-xl">
                "NordBase helps Customers find verified local Specialists without requiring Specialists to spend their working day searching for Customers."
              </p>
            </div>

            {/* VISUAL WORKFLOW */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" />
                End-to-End Workflow
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center text-xs">
                {[
                  { step: '1', title: 'CUSTOMER', color: 'border-slate-800 text-white' },
                  { step: '2', title: 'REQUEST', color: 'border-slate-800 text-slate-300' },
                  { step: '3', title: 'TP', color: 'border-cyan-500/40 text-cyan-400' },
                  { step: '4', title: 'QUALIFIED LEAD', color: 'border-cyan-500/40 text-cyan-300' },
                  { step: '5', title: 'SPECIALIST', color: 'border-amber-500/40 text-amber-400' },
                  { step: '6', title: 'JOB', color: 'border-amber-500/40 text-amber-300' },
                  { step: '7', title: 'PAYMENT', color: 'border-emerald-500/40 text-emerald-400' },
                  { step: '8', title: 'COMPLETION', color: 'border-emerald-500/40 text-emerald-300' }
                ].map((item, i) => (
                  <div key={i} className={`bg-slate-950 border ${item.color} p-2.5 rounded-xl flex flex-col justify-center items-center shadow-sm`}>
                    <span className="text-[10px] font-mono text-slate-500">#{item.step}</span>
                    <span className="font-bold text-[11px] mt-0.5">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP BY STEP BREAKDOWN */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Detailed Workflow Steps
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono text-[11px] flex items-center justify-center">1</span>
                    1. Customer
                  </div>
                  <p className="text-slate-400 pl-7">The Customer describes a real need or problem.</p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono text-[11px] flex items-center justify-center">2</span>
                    2. Request
                  </div>
                  <p className="text-slate-400 pl-7">The Request contains the available information about the work.</p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono text-[11px] flex items-center justify-center">3</span>
                    3. TP (Territory Partner)
                  </div>
                  <p className="text-slate-400 pl-7">The Territory Partner works with the Customer, clarifies the Request and helps create a qualified Lead.</p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 font-mono text-[11px] flex items-center justify-center">4</span>
                    4. Qualified Lead
                  </div>
                  <p className="text-slate-400 pl-7">The Specialist receives a commercial opportunity with relevant information about the Customer and requested work.</p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-400 font-mono text-[11px] flex items-center justify-center">5</span>
                    5. Specialist
                  </div>
                  <p className="text-slate-400 pl-7">The Specialist decides whether to accept the Lead.</p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-300 font-mono text-[11px] flex items-center justify-center">6</span>
                    6. Job
                  </div>
                  <p className="text-slate-400 pl-7">After accepting the Lead, the Specialist contacts the Customer, assesses the work when necessary, agrees the final conditions and performs the work.</p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-mono text-[11px] flex items-center justify-center">7</span>
                    7. Payment
                  </div>
                  <p className="text-slate-400 pl-7">The Customer pays the Specialist for the agreed work.</p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[11px] flex items-center justify-center">8</span>
                    8. Completion
                  </div>
                  <p className="text-slate-400 pl-7">The work is completed and the Job is closed according to NordBase procedure.</p>
                </div>
              </div>
            </div>

            {/* KEY RESPONSIBILITY NOTE */}
            <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 text-xs space-y-1">
              <span className="font-bold text-cyan-300 uppercase block">Local Division of Responsibilities</span>
              <p className="text-slate-300 leading-relaxed">
                TP is responsible for much of the local Customer acquisition, communication and qualification work. The Specialist's main job is to provide professional services.
              </p>
            </div>

            {/* CORE MESSAGE BANNER */}
            <div className="bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border border-cyan-500/30 p-5 rounded-2xl text-center space-y-1 shadow-md">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">Core Message</span>
              <p className="text-base md:text-lg font-bold text-white">
                "You don't spend your working day looking for Customers. You spend it doing the work you are good at."
              </p>
            </div>

            {/* SIMPLE COMPARISON CARD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-950/10 border border-red-500/20 p-4 rounded-xl space-y-2">
                <div className="font-bold text-xs uppercase font-mono text-red-400 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  TRADITIONAL SEARCH
                </div>
                <div className="text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                  Search → advertise → wait → call → negotiate → lose time
                </div>
              </div>

              <div className="bg-emerald-950/10 border border-emerald-500/20 p-4 rounded-xl space-y-2">
                <div className="font-bold text-xs uppercase font-mono text-emerald-400 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  NORDBASE WORKFLOW
                </div>
                <div className="text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                  Customer need → TP → qualified Lead → Specialist → Job
                </div>
              </div>
            </div>

            {/* DISCLAIMER */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 uppercase block mb-1">IMPORTANT DISCLAIMER</span>
                <p className="text-slate-300">
                  "A Lead is a qualified commercial opportunity, not a guaranteed Job or guaranteed income."
                </p>
              </div>
            </div>

            <ModuleFooter
              moduleId="spec_mod_01"
              nextModuleId="spec_mod_02"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 2: WHY WORK WITH NORDBASE */}
      {activeModId === 'spec_mod_02' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CircleDollarSign className="w-5 h-5 text-emerald-400" />
                MODULE 2 — WHY SPECIALISTS WORK WITH NORDBASE
              </h3>
              <p className="text-base font-bold text-cyan-300 mt-2">
                "Your time has value."
              </p>
            </div>

            {/* MAIN PROBLEM FOR INDEPENDENT SPECIALISTS */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="font-bold text-sm text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                The Main Problem for Independent Specialists
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                A large part of a Specialist's working time can be spent looking for Customers rather than doing paid professional work.
              </p>
              <div className="text-xs space-y-1 text-slate-400">
                <div className="font-semibold text-slate-300">Typical time-consuming activities:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                  {[
                    'Advertising & promotion',
                    'Managing social media',
                    'Answering general enquiries',
                    'Calling potential Customers',
                    'Waiting for client replies',
                    'Price negotiations',
                    'Travelling to enquiries that never become Jobs'
                  ].map((act, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800/80 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      {act}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* HOW NORDBASE CHANGES THIS MODEL */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                How NordBase Changes This Model
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Territory Partners (TPs) work locally to:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                {['Attract Customers', 'Develop Local Market', 'Process Requests', 'Qualify Opportunities', 'Connect with Specialists'].map((item, i) => (
                  <div key={i} className="bg-slate-900 border border-cyan-500/20 p-2.5 rounded-lg text-cyan-300 font-medium text-[11px]">
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-300 pt-1">
                The Specialist pays a Lead Fee for access to this qualified opportunity.
              </p>
            </div>

            {/* ECONOMIC LOGIC */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-sm text-amber-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                The Economic Logic
              </div>
              <p className="text-slate-300 leading-relaxed">
                The Specialist is not paying NordBase to "find a random phone number".
              </p>
              <p className="text-slate-300 leading-relaxed">
                The Specialist is paying for access to a qualified commercial opportunity and for the work already performed in bringing and processing the Customer.
              </p>
            </div>

            {/* SLOGAN & COMPARISON CARD */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl text-center">
              <span className="text-base md:text-lg font-bold text-emerald-300 uppercase tracking-wide">
                "More time working. Less time searching."
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="font-bold text-xs uppercase font-mono text-slate-400">WITHOUT NORDBASE</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg">
                    <span className="text-slate-400">Time spent finding work:</span>
                    <span className="font-bold text-red-400 font-mono">HIGH</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg">
                    <span className="text-slate-400">Time spent doing work:</span>
                    <span className="font-bold text-amber-400 font-mono">LOWER</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded-xl space-y-3">
                <div className="font-bold text-xs uppercase font-mono text-cyan-400">WITH NORDBASE</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg">
                    <span className="text-slate-400">Time spent finding Customers:</span>
                    <span className="font-bold text-emerald-400 font-mono">REDUCED</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg">
                    <span className="text-slate-400">Time spent doing professional work:</span>
                    <span className="font-bold text-emerald-400 font-mono">INCREASED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CORE PRINCIPLE */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center text-xs">
              <span className="text-slate-400 font-mono uppercase block mb-1">Core Principle</span>
              <p className="text-sm font-bold text-white">
                "The value of NordBase is not only the Lead. It is the time you no longer need to spend searching for Customers."
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_02"
              nextModuleId="spec_mod_03"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 3: STARTING IN A NEW REGION */}
      {activeModId === 'spec_mod_03' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                MODULE 3 — STARTING WITH NORDBASE
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Managing expectations during initial regional rollout.
              </p>
            </div>

            {/* EXPECTATION MANAGEMENT */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                Setting Realistic Expectations
              </div>
              <p className="text-slate-300 leading-relaxed font-medium">
                "A new NordBase region does not start with hundreds of Customers and Leads."
              </p>
              <p className="text-slate-400 leading-relaxed">
                A new territory develops gradually as the local infrastructure and community awareness are built step by step.
              </p>
            </div>

            {/* PROCESS FLOW */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Territory Development Lifecycle
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
                {[
                  'TP NETWORK',
                  'SPECIALIST BASE',
                  'CUSTOMER AWARENESS',
                  'FIRST REQUESTS',
                  'FIRST LEADS',
                  'REPEAT CUSTOMERS',
                  'STABLE FLOW'
                ].map((step, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl font-mono text-[11px] text-cyan-300 font-semibold shadow-sm flex items-center justify-center">
                    {i + 1}. {step}
                  </div>
                ))}
              </div>
            </div>

            {/* FIRST STAGE BREAKDOWN */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-sm text-white">The Early Stage Process</div>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                <li>TP builds the local Specialist base</li>
                <li>Specialists complete verification</li>
                <li>TP introduces NordBase to local Customers</li>
                <li>Customers begin using the platform</li>
                <li>First Requests appear</li>
                <li>Leads begin to arrive</li>
                <li>The local flow grows over time</li>
              </ul>
            </div>

            {/* IMPORTANT MESSAGE & AUTHENTICITY */}
            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-amber-300 uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Important Operational Message
              </div>
              <p className="text-slate-300 leading-relaxed">
                "At the beginning, the number of Leads may be small or irregular."
              </p>
              <p className="text-slate-400 leading-relaxed">
                This does <strong>NOT</strong> mean the model is failing. The territory is being actively built.
              </p>
              <p className="text-slate-300 pt-1">
                NordBase aims to create a sustainable local flow rather than artificially generate activity. We do not create fake Leads, fake Customers or simulated activity to make the platform look busy.
              </p>
              <div className="font-mono text-amber-400 font-bold text-center pt-2">
                "Empty is better than fake."
              </div>
            </div>

            {/* CORE MESSAGE */}
            <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded-xl text-center">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">Development Formula</span>
              <p className="text-base font-bold text-white">
                "Build first. Grow second. Stabilize third."
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_03"
              nextModuleId="spec_mod_04"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 4: REGISTRATION & BUSINESS STATUS */}
      {activeModId === 'spec_mod_04' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                MODULE 4 — BECOMING A NORDBASE SPECIALIST
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Registration process, legal independence, and business status options.
              </p>
            </div>

            {/* REGISTRATION STEPS */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Registration Process Steps
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {[
                  '1. Create an account',
                  '2. Select Specialist',
                  '3. Complete Specialist profile',
                  '4. Add services',
                  '5. Add service territory',
                  '6. Provide required information',
                  '7. Complete verification',
                  '8. Become eligible to receive Leads'
                ].map((step, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 p-3 rounded-xl font-medium text-slate-200">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* SPECIALIST STATUS */}
            <div className="bg-cyan-950/20 border border-cyan-500/30 p-5 rounded-2xl space-y-3 text-xs">
              <div className="font-bold text-sm text-cyan-300 uppercase tracking-wide">
                Clear Specialist Status
              </div>
              <p className="text-sm font-bold text-white">
                "You are an independent professional and entrepreneur. You are not an employee of NordBase."
              </p>
              <div className="space-y-1 text-slate-300 pt-1">
                <div className="font-semibold text-slate-200">The Specialist is responsible for their own:</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 list-disc list-inside text-slate-300">
                  <li>Professional activity</li>
                  <li>Pricing & quotations</li>
                  <li>Taxes & fiscal reporting</li>
                  <li>Legal obligations</li>
                  <li>Customer relationship</li>
                  <li>Work quality & guarantees</li>
                  <li>Required business documentation</li>
                </ul>
              </div>
            </div>

            {/* BUSINESS STATUS */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                Business Status Options
              </div>
              <p className="text-slate-300 leading-relaxed">
                Professional operation should be supported by an appropriate legal business status. Depending on the Specialist's situation, this may include:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-cyan-400">Self-Employed / Individual Entrepreneur</div>
                  <div className="text-[11px] text-slate-400">ENI / Recibos Verdes or sole proprietorship for independent tradespeople.</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-cyan-400">LDA / Corporate Company</div>
                  <div className="text-[11px] text-slate-400">Unipessoal LDA or commercial company, particularly appropriate for larger jobs and Customers requiring formal corporate business documentation.</div>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-lg text-[11px] text-slate-400 italic">
                "Always comply with the legal and tax requirements applicable to your business and location."
              </div>
            </div>

            {/* SPECIALIST PROFILE REQUIREMENTS */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Specialist Profile Requirements
              </div>
              <p className="text-slate-300 leading-relaxed">
                Your profile should accurately represent: real services, experience, service area, availability where applicable, professional information, relevant qualifications, business information, and verification information.
              </p>
              <div className="bg-amber-950/20 border border-amber-500/20 p-3 rounded-lg text-amber-300 text-[11px] font-medium">
                Do not exaggerate qualifications, experience or services. The profile is part of the Specialist's professional reputation.
              </div>
            </div>

            {/* END MODULE MESSAGE */}
            <div className="bg-gradient-to-r from-slate-950 via-cyan-950/50 to-slate-950 border border-cyan-500/40 p-5 rounded-2xl text-center shadow-lg">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                End of Module Principle
              </span>
              <p className="text-sm md:text-base font-bold text-white max-w-xl mx-auto leading-relaxed">
                "You are joining NordBase as an independent professional. NordBase provides access to Customers and commercial opportunities. You provide the professional service."
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_04"
              nextModuleId="spec_mod_05"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 5: VERIFICATION */}
      {activeModId === 'spec_mod_05' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                MODULE 5 — VERIFICATION
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Why NordBase verifies Specialists and what verification means for trust and quality.
              </p>
            </div>

            {/* TRUST QUADRANT */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Multi-Party Ecosystem Trust
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Verification is designed to increase trust across all four ecosystem participants. A verified Specialist provides Customers with greater confidence when choosing a professional.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { role: 'Customer', desc: 'Confidence in verified credentials', color: 'border-cyan-500/30 text-cyan-300' },
                  { role: 'Specialist', desc: 'Protection from unfair competition', color: 'border-emerald-500/30 text-emerald-300' },
                  { role: 'TP', desc: 'Reliable network matching', color: 'border-amber-500/30 text-amber-300' },
                  { role: 'NordBase', desc: 'High platform quality standards', color: 'border-slate-700 text-slate-200' }
                ].map((item, i) => (
                  <div key={i} className={`bg-slate-950 border ${item.color} p-3.5 rounded-xl space-y-1`}>
                    <div className="font-bold text-sm font-mono">{item.role}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* VERIFICATION SCOPE */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                Verification Checkpoints
              </div>
              <p className="text-slate-300 leading-relaxed">
                Verification may include checking relevant information prior to unlocking qualified Leads:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                {[
                  'Identity information (ID / Passport)',
                  'Business information (ENI / LDA registration)',
                  'Professional information & work history',
                  'Declared services offered & service area',
                  'Qualifications or certifications where relevant',
                  'Other information required by NordBase rules'
                ].map((check, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-slate-200 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* VERIFIED ≠ GUARANTEED JOB */}
            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-amber-300 uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Crucial Clarification: Verified Status Scope
              </div>
              <p className="text-slate-200 font-bold text-sm">
                "Verified does not mean a guaranteed Job or guaranteed income."
              </p>
              <p className="text-slate-300 leading-relaxed">
                Verification means the Specialist meets all NordBase requirements to receive and review qualified Leads. The final decision to work remains between the Customer and Specialist.
              </p>
            </div>

            {/* KEY MESSAGE BANNER */}
            <div className="bg-gradient-to-r from-slate-950 via-cyan-950/50 to-slate-950 border border-cyan-500/40 p-5 rounded-2xl text-center shadow-lg">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Core Verification Principle
              </span>
              <p className="text-base font-bold text-white max-w-xl mx-auto leading-relaxed">
                "Verification protects honest Specialists from unfair competition and creates trust."
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_05"
              nextModuleId="spec_mod_06"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 6: YOUR FIRST LEAD */}
      {activeModId === 'spec_mod_06' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                MODULE 6 — YOUR FIRST LEAD
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                How a Lead becomes a Job and evaluating incoming commercial opportunities.
              </p>
            </div>

            {/* LEAD TO JOB WORKFLOW */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Lead to Job Progression Sequence
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
                {[
                  { step: '1', name: 'Customer Request', bg: 'bg-slate-950 border-slate-800 text-slate-300' },
                  { step: '2', name: 'TP Qualification', bg: 'bg-slate-950 border-cyan-500/30 text-cyan-300' },
                  { step: '3', name: 'Lead Created', bg: 'bg-slate-950 border-cyan-500/40 text-cyan-400' },
                  { step: '4', name: 'Sent to Specialist', bg: 'bg-slate-950 border-amber-500/30 text-amber-300' },
                  { step: '5', name: 'Accept / Decline', bg: 'bg-slate-950 border-amber-500/40 text-amber-400' },
                  { step: '6', name: 'Job Created', bg: 'bg-slate-950 border-emerald-500/40 text-emerald-300' }
                ].map((item, i) => (
                  <div key={i} className={`${item.bg} border p-3 rounded-xl shadow-sm flex flex-col justify-center items-center`}>
                    <span className="text-[10px] font-mono opacity-60">Step {item.step}</span>
                    <span className="font-bold text-[11px] mt-0.5">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WHAT TO EVALUATE IN A LEAD */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <SearchCheck className="w-4 h-4 text-cyan-400" />
                Specialist Evaluation Criteria Before Accepting
              </div>
              <p className="text-slate-300 leading-relaxed">
                Before clicking Accept, carefully review all details included in the Lead card:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  { label: 'Location & Service Territory', detail: 'Is the job located within your active working zone?' },
                  { label: 'Scope of Work', detail: 'Do you have the specific technical skill set for this problem?' },
                  { label: 'Timing & Schedule', detail: 'Can you arrive on site within the Customer\'s requested timeframe?' },
                  { label: 'Equipment & Materials', detail: 'Do you have or can you acquire necessary tools and components?' },
                  { label: 'Practical Feasibility', detail: 'Can you realistically complete this work to high quality standards?' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                    <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                      {item.label}
                    </div>
                    <p className="text-[11px] text-slate-400 pl-5">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RESPONSIBILITY MANDATE */}
            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-amber-300 uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Key Operating Principle
              </div>
              <p className="text-sm font-bold text-white">
                "Accept Leads you can realistically serve. Do not accept Leads if you cannot fulfill them."
              </p>
              <p className="text-slate-300 leading-relaxed">
                Accepting a Lead and failing to arrive or complete the job damages your platform rating and harms Customer trust.
              </p>
            </div>

            {/* KEY MESSAGE BANNER */}
            <div className="bg-gradient-to-r from-slate-950 via-cyan-950/50 to-slate-950 border border-cyan-500/40 p-5 rounded-2xl text-center shadow-lg">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Core Distinction
              </span>
              <p className="text-lg font-bold text-white max-w-xl mx-auto leading-relaxed">
                "A Lead is an opportunity. A Job is a commitment."
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_06"
              nextModuleId="spec_mod_07"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 7: HOW THE MONEY WORKS */}
      {activeModId === 'spec_mod_07' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CircleDollarSign className="w-5 h-5 text-emerald-400" />
                MODULE 7 — HOW THE MONEY WORKS
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                The three financial building blocks of the NordBase Specialist economy.
              </p>
            </div>

            {/* 3 FINANCIAL COMPONENTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded-xl space-y-2">
                <div className="font-mono font-bold text-cyan-400 uppercase text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  1. Lead Fee
                </div>
                <div className="text-sm font-bold text-white">Access Opportunity</div>
                <p className="text-slate-300 leading-relaxed">
                  A small fee paid by the Specialist to access a qualified Lead prepared and verified by the local TP.
                </p>
              </div>

              <div className="bg-slate-950 border border-emerald-500/40 p-4 rounded-xl space-y-2">
                <div className="font-mono font-bold text-emerald-400 uppercase text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  2. Job Payment
                </div>
                <div className="text-sm font-bold text-white">100% Specialist Revenue</div>
                <p className="text-slate-300 leading-relaxed">
                  Direct payment from Customer to Specialist for completed work. <strong>Specialist keeps 100%</strong> of the Job payment. NordBase takes 0% commission.
                </p>
              </div>

              <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-xl space-y-2">
                <div className="font-mono font-bold text-amber-400 uppercase text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  3. Call-out Fee (€20)
                </div>
                <div className="text-sm font-bold text-white">On-site Travel Protection</div>
                <p className="text-slate-300 leading-relaxed">
                  Paid to the Specialist if they visit the site, inspect the job, but the Customer decides not to proceed with the work.
                </p>
              </div>
            </div>

            {/* MODEL COMPARISON */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white">
                Why Fixed Lead Fee Beats Percentage Commissions
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900 border border-red-500/20 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-red-400">TRADITIONAL COMMISSION MODEL</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Takes 15% to 30% from every single euro earned on large jobs. A €1,000 installation costs you €200–€300 in commissions.
                  </p>
                </div>
                <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-400">NORDBASE TRANSPARENT MODEL</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    You pay a transparent, fixed Lead Fee. On a €1,000 installation, you keep the full €1,000 from the Customer.
                  </p>
                </div>
              </div>
            </div>

            {/* KEY MESSAGE BANNER */}
            <div className="bg-gradient-to-r from-slate-950 via-emerald-950/50 to-slate-950 border border-emerald-500/40 p-5 rounded-2xl text-center shadow-lg">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                Financial Philosophy
              </span>
              <p className="text-lg font-bold text-white max-w-xl mx-auto leading-relaxed">
                "Clear economics create clear relationships."
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_07"
              nextModuleId="spec_mod_08"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 8: MINIMUM JOB VALUE */}
      {activeModId === 'spec_mod_08' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-400" />
                MODULE 8 — MINIMUM JOB VALUE
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Protecting small job economics and establishing billable time standards.
              </p>
            </div>

            {/* 2 CORE METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-cyan-500/40 p-5 rounded-2xl text-center space-y-2 shadow-md">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">Minimum Order Rule</span>
                <div className="text-3xl font-black font-mono text-white">€50</div>
                <p className="text-xs text-slate-300">
                  Minimum Job Value for any dispatch on NordBase.
                </p>
              </div>

              <div className="bg-slate-950 border border-emerald-500/40 p-5 rounded-2xl text-center space-y-2 shadow-md">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">Billable Time Floor</span>
                <div className="text-3xl font-black font-mono text-white">2 Hours</div>
                <p className="text-xs text-slate-300">
                  Minimum billable time standard for on-site presence.
                </p>
              </div>
            </div>

            {/* WHY THIS RULE EXISTS */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Economic Rationale
              </div>
              <p className="text-slate-300 leading-relaxed">
                Small jobs must remain economically viable for independent Specialists once travel, fuel, equipment setup, and opportunity costs are considered.
              </p>
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5 text-slate-300">
                <div className="font-bold text-cyan-300">Short 15-Minute Visits:</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Even if a repair takes only 15 minutes (e.g. replacing a washer or flipping a breaker), it is billed under the 2-hour minimum (€50 minimum threshold). This compensates the Specialist for time spent traveling and preparing.
                </p>
              </div>
            </div>

            {/* CUSTOMER COMMUNICATION PROTOCOL */}
            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-amber-300 uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Mandatory Customer Communication Rule
              </div>
              <p className="text-slate-200 font-bold">
                Specialists MUST clearly explain the €50 / 2-hour minimum rule to the Customer BEFORE travelling or starting work.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Never surprise a Customer with a minimum charge after completing a 10-minute task. Transparency before arrival builds trust.
              </p>
            </div>

            {/* KEY MESSAGE BANNER */}
            <div className="bg-gradient-to-r from-slate-950 via-cyan-950/50 to-slate-950 border border-cyan-500/40 p-5 rounded-2xl text-center shadow-lg">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Economic Protection Rule
              </span>
              <p className="text-lg font-bold text-white max-w-xl mx-auto leading-relaxed">
                "Minimum charge protects the economics of small Jobs."
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_08"
              nextModuleId="spec_mod_09"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 9: ASSESSING THE REAL COST */}
      {activeModId === 'spec_mod_09' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                MODULE 9 — ASSESSING THE REAL COST
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                How initial estimates evolve after technical on-site inspection and handling price adjustments.
              </p>
            </div>

            {/* ESTIMATE VS ON-SITE REALITY */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                Initial Estimate vs On-Site Technical Diagnostics
              </div>
              <p className="text-slate-300 leading-relaxed">
                An initial Request provides a preliminary baseline. However, the exact final cost depends on actual on-site technical inspection:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                {[
                  'Actual site conditions',
                  'Hidden technical issues',
                  'Required materials',
                  'Scope adjustments'
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-amber-300 font-medium text-[11px]">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* 3-STEP REVISED PRICE PROTOCOL */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Price Adjustment Protocol
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
                  <div className="font-mono font-bold text-cyan-400 text-xs">STEP 1</div>
                  <div className="font-bold text-white">Inspect On-Site</div>
                  <p className="text-slate-400 text-[11px]">Perform thorough diagnostic inspection of the equipment and conditions.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
                  <div className="font-mono font-bold text-cyan-400 text-xs">STEP 2</div>
                  <div className="font-bold text-white">Explain Clearly</div>
                  <p className="text-slate-400 text-[11px]">Show the Customer what extra work/parts are required and why price must change.</p>
                </div>

                <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-xl space-y-1.5">
                  <div className="font-mono font-bold text-amber-400 text-xs">STEP 3</div>
                  <div className="font-bold text-white">Agree BEFORE Starting</div>
                  <p className="text-slate-400 text-[11px]">Obtain explicit Customer agreement on revised price BEFORE performing work.</p>
                </div>
              </div>
            </div>

            {/* DECISION BRANCHES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-950/10 border border-emerald-500/20 p-4 rounded-xl space-y-2">
                <div className="font-bold text-emerald-400 uppercase font-mono flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  IF CUSTOMER AGREES
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Proceed with the Job under the newly agreed price and expanded scope. Complete work and receive full payment from Customer.
                </p>
              </div>

              <div className="bg-amber-950/10 border border-amber-500/20 p-4 rounded-xl space-y-2">
                <div className="font-bold text-amber-400 uppercase font-mono flex items-center gap-2">
                  <X className="w-4 h-4" />
                  IF CUSTOMER DECLINES
                </div>
                <p className="text-slate-300 leading-relaxed">
                  The Specialist does not proceed with the work. The Customer pays the standard <strong>€20 Call-out Fee</strong> for travel and diagnostic time.
                </p>
              </div>
            </div>

            {/* LONG TERM FORMULA */}
            <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded-xl space-y-2 text-center text-xs">
              <span className="font-mono text-cyan-400 uppercase font-bold block">Long-Term Business Success Formula</span>
              <div className="text-sm md:text-base font-bold text-white font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">
                Fair assessment + Fair price + Good service = Long-term business
              </div>
            </div>

            {/* KEY MESSAGE BANNER */}
            <div className="bg-gradient-to-r from-slate-950 via-cyan-950/50 to-slate-950 border border-cyan-500/40 p-5 rounded-2xl text-center shadow-lg">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Transparency Standard
              </span>
              <p className="text-lg font-bold text-white max-w-xl mx-auto leading-relaxed">
                "No price surprises for the Customer."
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_09"
              nextModuleId="spec_mod_10"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 10: ON-SITE ASSESSMENT & CALL-OUT FEE */}
      {activeModId === 'spec_mod_10' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                MODULE 10 — ON-SITE ASSESSMENT & CALL-OUT FEE
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Understanding price estimates vs final prices, and how the €20 Call-out Fee operates.
              </p>
            </div>

            {/* THREE PRICE CONCEPTS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
                <div className="font-mono font-bold text-cyan-400 uppercase text-[10px]">Baseline</div>
                <div className="font-bold text-white text-sm">Initial Estimate</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Based on information available in the Customer's initial Request. A preliminary starting point.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
                <div className="font-mono font-bold text-amber-400 uppercase text-[10px]">On-Site Assessment</div>
                <div className="font-bold text-white text-sm">Final Price</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Determined after Specialist visits and inspects actual site scope. May be higher or lower than initial estimate.
                </p>
              </div>

              <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-xl space-y-1.5">
                <div className="font-mono font-bold text-emerald-400 uppercase text-[10px]">Travel Protection</div>
                <div className="font-bold text-white text-sm">Call-out Fee (€20)</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Paid to Specialist if they inspect the site but Customer decides not to proceed with the work.
                </p>
              </div>
            </div>

            {/* CALL-OUT FEE PURPOSE & COVERS */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-emerald-400" />
                The €20 Call-out Fee Rationale
              </div>
              <p className="text-slate-300 leading-relaxed">
                The Call-out Fee compensates the Specialist for the completed visit when the Customer decides not to proceed with the work after assessment. It covers the basic economic cost of:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-1">
                {[
                  'Travel & fuel',
                  'Transportation',
                  'Time spent travelling',
                  'Time spent on site',
                  'Initial assessment'
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-300 font-medium text-[11px]">
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-emerald-400 font-bold text-[11px] pt-1">
                ✓ The €20 Call-out Fee is paid 100% to the Specialist. It is NOT a NordBase commission.
              </p>
            </div>

            {/* WHEN APPLIES VS WHEN IT DOES NOT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-xl space-y-2">
                <div className="font-bold text-amber-400 uppercase font-mono text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  WHEN THE €20 FEE APPLIES
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1 font-mono text-[11px] text-slate-300">
                  <div>Visit Customer location</div>
                  <div className="text-slate-500">↓</div>
                  <div>Assess work & determine final price</div>
                  <div className="text-slate-500">↓</div>
                  <div className="text-amber-300 font-bold">Customer decides NOT to proceed</div>
                  <div className="text-slate-500">↓</div>
                  <div className="text-emerald-400 font-bold">Result: €20 Call-out Fee applies</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-emerald-500/30 p-4 rounded-xl space-y-2">
                <div className="font-bold text-emerald-400 uppercase font-mono text-[11px] flex items-center gap-2">
                  <X className="w-4 h-4 text-emerald-400" />
                  WHEN IT DOES NOT APPLY
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1 font-mono text-[11px] text-slate-300">
                  <div>Visit & assessment</div>
                  <div className="text-slate-500">↓</div>
                  <div className="text-emerald-300 font-bold">Price agreed & work performed</div>
                  <div className="text-slate-500">↓</div>
                  <div>Customer pays for Job</div>
                  <div className="text-slate-500">↓</div>
                  <div className="text-slate-400 font-bold">No separate €20 Call-out Fee</div>
                </div>
              </div>
            </div>

            {/* MANDATORY CUSTOMER COMMUNICATION */}
            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl space-y-2.5 text-xs">
              <div className="font-bold text-amber-300 uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Mandatory Customer Notice BEFORE Visit
              </div>
              <p className="text-slate-200 leading-relaxed">
                The Customer must know about the Call-out Fee <strong>BEFORE</strong> the visit. It must not appear as an unexpected charge after the Specialist has already arrived.
              </p>
              <div className="bg-slate-950 border border-amber-500/40 p-3.5 rounded-lg text-slate-200 italic space-y-1">
                <span className="text-[10px] text-amber-400 uppercase font-mono font-bold block not-italic">Suggested Customer Wording:</span>
                <p className="text-[11px] leading-relaxed">
                  "The initial price is an estimate based on the information provided. The Specialist will confirm the actual scope and price on site. If you decide not to proceed after the Specialist's visit, a €20 call-out fee applies to cover the Specialist's travel and time. If you proceed with the work, the €20 fee is not charged separately."
                </p>
              </div>
            </div>

            {/* IF CUSTOMER REFUSES TO PAY */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Protocol if Customer Refuses to Pay
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-300">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="font-bold text-cyan-300">1. Stay Professional</div>
                  <p className="text-[11px] text-slate-400">Do not threaten or pressure Customers. Avoid confrontations on site.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="font-bold text-cyan-300">2. Record in System</div>
                  <p className="text-[11px] text-slate-400">Record the outstanding Call-out Fee in the Job status on NordBase.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="font-bold text-cyan-300">3. TP Intervention</div>
                  <p className="text-[11px] text-slate-400">The local Territory Partner may contact the Customer to clarify conditions.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="font-bold text-cyan-300">4. Dispute Procedure</div>
                  <p className="text-[11px] text-slate-400">Follow NordBase account rules. NordBase never encourages aggressive collection.</p>
                </div>
              </div>
            </div>

            <ModuleFooter
              moduleId="spec_mod_10"
              nextModuleId="spec_mod_11"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 11: CUSTOMER COMMUNICATION */}
      {activeModId === 'spec_mod_11' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                MODULE 11 — CUSTOMER COMMUNICATION
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Working with the Customer: professional standards, communication sequence, and price changes.
              </p>
            </div>

            {/* INDEPENDENCE NOTICE */}
            <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded-xl text-xs space-y-1.5">
              <span className="font-mono text-cyan-400 font-bold uppercase text-[10px]">Independent Commercial Relationship</span>
              <p className="text-slate-300 leading-relaxed">
                The Customer and Specialist are independent parties. The Specialist is fully responsible for professional communication, client agreements, and actual service delivery.
              </p>
            </div>

            {/* 10-STEP SEQUENCE */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                10-Step Customer Interaction Sequence
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center">
                {[
                  { step: '1', title: 'Receive Lead' },
                  { step: '2', title: 'Contact Customer' },
                  { step: '3', title: 'Confirm Request' },
                  { step: '4', title: 'Confirm Visit' },
                  { step: '5', title: 'Assess Work' },
                  { step: '6', title: 'Explain Price' },
                  { step: '7', title: 'Obtain Agreement' },
                  { step: '8', title: 'Perform Work' },
                  { step: '9', title: 'Receive Payment' },
                  { step: '10', title: 'Complete Job' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl space-y-0.5">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">Step {item.step}</span>
                    <div className="font-bold text-white text-[11px]">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROFESSIONAL COMMUNICATION DO'S & DON'TS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 border border-emerald-500/30 p-4 rounded-xl space-y-2">
                <div className="font-bold text-emerald-400 uppercase font-mono text-[11px] flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  PROFESSIONAL STANDARDS
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Respond promptly to new incoming Leads</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Be polite, respectful, and clear at all times</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Arrive on time for agreed appointments</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Explain relevant changes before taking action</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Confirm important agreements in writing</li>
                </ul>
              </div>

              <div className="bg-slate-950 border border-red-500/30 p-4 rounded-xl space-y-2">
                <div className="font-bold text-red-400 uppercase font-mono text-[11px] flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400" />
                  STRICTLY FORBIDDEN
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-400 shrink-0" /> Never intentionally hide important information</li>
                  <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-400 shrink-0" /> Never misrepresent final price or hidden fees</li>
                  <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-400 shrink-0" /> Never misrepresent required time or materials</li>
                  <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-400 shrink-0" /> Never misrepresent qualifications or skills</li>
                  <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-400 shrink-0" /> Never misrepresent actual scope of work</li>
                </ul>
              </div>
            </div>

            {/* PRICE CHANGES PROTOCOL */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-400" />
                Price Changes Protocol: Explain 4 Pillars
              </div>
              <p className="text-slate-300 leading-relaxed">
                If the final price changes during assessment or work, the Specialist must explicitly explain to the Customer:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
                {[
                  { label: 'WHAT', desc: 'what specific scope changed' },
                  { label: 'WHY', desc: 'why the technical change occurred' },
                  { label: 'HOW MUCH', desc: 'exact price difference in €' },
                  { label: 'WHAT WORK', desc: 'what work will be performed' }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                    <span className="text-cyan-400 font-bold block text-sm">{item.label}</span>
                    <span className="text-slate-400 text-[10px]">{item.desc}</span>
                  </div>
                ))}
              </div>
              <p className="text-amber-300 font-bold text-[11px] pt-1">
                ⚠ Customer MUST agree BEFORE additional or materially changed work begins.
              </p>
            </div>

            {/* KEY MESSAGE BANNER */}
            <div className="bg-gradient-to-r from-slate-950 via-cyan-950/50 to-slate-950 border border-cyan-500/40 p-5 rounded-2xl text-center shadow-lg">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Platform Principles
              </span>
              <p className="text-base font-bold text-white max-w-xl mx-auto leading-relaxed">
                "NordBase and TP facilitate the Lead. They do not become the employer of the Specialist."
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_11"
              nextModuleId="spec_mod_12"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 12: FROM LEAD TO COMPLETED JOB */}
      {activeModId === 'spec_mod_12' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                MODULE 12 — FROM LEAD TO COMPLETED JOB
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                The complete visual workflow and stage-by-stage operational walkthrough.
              </p>
            </div>

            {/* VISUAL WORKFLOW MAP */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                End-to-End Execution Diagram
              </h4>
              <div className="flex flex-wrap items-center justify-between gap-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-center">
                {[
                  'LEAD', 'ACCEPT', 'CONTACT CUSTOMER', 'VISIT / ASSESS', 'AGREE PRICE', 'PERFORM WORK', 'CUSTOMER PAYS', 'COMPLETE JOB', 'CLOSE JOB'
                ].map((stage, idx) => (
                  <React.Fragment key={idx}>
                    <div className="px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 font-bold text-[11px]">
                      {stage}
                    </div>
                    {idx < 8 && <span className="text-slate-600 font-bold">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* STAGE BREAKDOWN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { num: '1', title: 'Lead Accepted', desc: 'Specialist accepts a qualified Lead card on NordBase.' },
                { num: '2', title: 'Customer Contact', desc: 'Specialist contacts Customer and confirms Request details.' },
                { num: '3', title: 'Assessment', desc: 'If necessary, Specialist visits location to inspect actual scope.' },
                { num: '4', title: 'Price Agreement', desc: 'Final price is agreed before any relevant work begins.' },
                { num: '5', title: 'Work Execution', desc: 'Specialist performs agreed work to high quality standards.' },
                { num: '6', title: 'Payment', desc: 'Customer pays Specialist directly under agreed payment terms.' },
                { num: '7', title: 'Completion Check', desc: 'Confirm work is finished, service received, and payment recorded.' },
                { num: '8', title: 'Job Closed', desc: 'The Job is closed according to standard NordBase procedure.' }
              ].map((stage, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold text-xs">Stage {stage.num}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <div className="font-bold text-white text-sm">{stage.title}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{stage.desc}</p>
                </div>
              ))}
            </div>

            {/* CRUCIAL RULE */}
            <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-red-400 uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Critical Operating Rule
              </div>
              <p className="text-slate-200 font-bold">
                "Do not mark a Job as completed if the work has not actually been completed."
              </p>
              <p className="text-slate-400 leading-relaxed">
                Prematurely closing Jobs or falsifying completion damages platform records and triggers dispute reviews.
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_12"
              nextModuleId="spec_mod_13"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 13: ADDITIONAL WORK & CHANGES */}
      {activeModId === 'spec_mod_13' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-400" />
                MODULE 13 — ADDITIONAL WORK & CHANGES
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Managing scope changes when actual jobsite conditions differ from the original Request.
              </p>
            </div>

            {/* COMMON SCOPE CHANGE TRIGGERS */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white">Common Reasons Scope Changes On Site</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-slate-300">
                {[
                  'Additional hidden damage discovered',
                  'Additional specialized materials required',
                  'More technical labor hours required',
                  'Customer explicitly requests extra tasks',
                  'Original description was incomplete'
                ].map((reason, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg flex items-center gap-2 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6-STEP ACTION PROTOCOL */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                6-Step Scope Modification Protocol
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs text-center">
                {[
                  { step: '1', name: 'Stop Work', desc: 'Pause before doing extra work' },
                  { step: '2', name: 'Explain', desc: 'Explain situation to Customer' },
                  { step: '3', name: 'Detail Work', desc: 'Detail additional labor' },
                  { step: '4', name: 'Detail Cost', desc: 'State exact extra cost in €' },
                  { step: '5', name: 'Get Consent', desc: 'Obtain explicit agreement' },
                  { step: '6', name: 'Continue', desc: 'Proceed only after consent' }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-950 border border-cyan-500/30 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">Step {item.step}</span>
                    <div className="font-bold text-white text-[11px]">{item.name}</div>
                    <p className="text-[10px] text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CONCRETE EXAMPLE */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-cyan-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Practical Example: Additional Repair
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="font-bold text-slate-300">Scenario Setup:</div>
                  <p className="text-slate-400">Original agreed Job: <strong>€80</strong></p>
                  <p className="text-slate-400">During work: Additional repair required (<strong>€30</strong>)</p>
                </div>

                <div className="bg-slate-900 border border-cyan-500/30 p-3 rounded-lg space-y-1">
                  <div className="font-bold text-cyan-300">Specialist Communication:</div>
                  <p className="text-slate-200 italic">"An additional repair is required. The additional cost is €30. Would you like me to proceed?"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-lg text-emerald-300 font-bold text-[11px]">
                  ✓ Customer Accepts → Continue work under revised total (€110).
                </div>
                <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-lg text-amber-300 font-bold text-[11px]">
                  ✗ Customer Declines → Do NOT perform additional work. Finish original scope.
                </div>
              </div>
            </div>

            {/* IMPORTANT WARNING */}
            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-amber-300 uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Anti-Markup Mandate
              </div>
              <p className="text-slate-200 font-bold">
                "Do not use additional work as a way to artificially increase the price of the original Job."
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_13"
              nextModuleId="spec_mod_14"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 14: PROBLEMS & DISPUTES */}
      {activeModId === 'spec_mod_14' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                MODULE 14 — PROBLEMS & DISPUTES
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                When something goes wrong: handling cancellations, price disputes, and non-payment professionally.
              </p>
            </div>

            {/* TYPICAL SCENARIOS GRID */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white">Typical Problem Situations on Field</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-slate-300">
                {[
                  'Customer cancels appointment',
                  'Customer is unavailable on site',
                  'Specialist cannot attend due to emergency',
                  'Customer refuses revised on-site price',
                  'Customer refuses €20 Call-out Fee',
                  'Customer disputes final invoice price',
                  'Customer claims work is incomplete',
                  'Customer complains about quality',
                  'Customer refuses to pay for job',
                  'Request was severely misrepresented',
                  'Property damage claim raised',
                  'Disagreement on additional scope'
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GENERAL RULE */}
            <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-cyan-400 uppercase font-mono text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                GENERAL RULE: PROFESSIONAL DE-ESCALATION
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="font-bold text-white">1. Stay Professional</div>
                  <p className="text-[11px] text-slate-400">Do not threaten. Do not insult. Do not escalate unnecessarily.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="font-bold text-white">2. Document Facts</div>
                  <p className="text-[11px] text-slate-400">Take clear photos, record timestamps, and log communication in chat.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="font-bold text-white">3. Use Platform Dispute</div>
                  <p className="text-[11px] text-slate-400">Submit facts through NordBase dispute procedure for mediation.</p>
                </div>
              </div>
            </div>

            {/* CONCRETE CONFLIT EXAMPLE */}
            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl space-y-2.5 text-xs">
              <div className="font-bold text-amber-300 uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Example: Price Dispute Handling
              </div>
              <p className="text-slate-200">
                Customer expected <strong>€50</strong>. Specialist assesses site and determines actual required work is <strong>€80</strong>. Customer refuses €80.
              </p>
              <div className="bg-slate-950 border border-amber-500/40 p-3.5 rounded-lg space-y-1.5 text-slate-300 text-[11px]">
                <div className="font-bold text-cyan-300">Correct Professional Response:</div>
                <p>• Explain the exact technical reasons for the revised price.</p>
                <p>• If Customer does not agree: <strong>Do NOT perform the work</strong> and do not force them to accept €80.</p>
                <p>• If the Specialist completed the agreed visit: The applicable <strong>€20 Call-out Fee</strong> applies.</p>
              </div>
            </div>

            {/* KEY MESSAGE BANNER */}
            <div className="bg-gradient-to-r from-slate-950 via-cyan-950/50 to-slate-950 border border-cyan-500/40 p-5 rounded-2xl text-center shadow-lg">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Legal Context
              </span>
              <p className="text-base font-bold text-white max-w-xl mx-auto leading-relaxed">
                "NordBase is not automatically a party to the commercial relationship. The Specialist remains an independent entrepreneur."
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_14"
              nextModuleId="spec_mod_15"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 15: PROFESSIONAL STANDARDS */}
      {activeModId === 'spec_mod_15' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                MODULE 15 — PROFESSIONAL STANDARDS
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Be a professional: 8 core principles and long-term business thinking.
              </p>
            </div>

            {/* 8 CORE PRINCIPLES GRID */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                8 Core Principles of the NordBase Specialist
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {[
                  { title: 'HONESTY', desc: 'Provide accurate information at all times.' },
                  { title: 'FAIR ASSESSMENT', desc: 'Estimate work objectively and realistically.' },
                  { title: 'FAIR PRICING', desc: 'Charge fairly for actual service and minimums.' },
                  { title: 'PUNCTUALITY', desc: 'Respect agreed times and inform if delayed.' },
                  { title: 'QUALITY', desc: 'Perform work professionally to high standards.' },
                  { title: 'COMMUNICATION', desc: 'Keep the Customer informed throughout.' },
                  { title: 'RESPECT', desc: 'Treat Customers and other Specialists politely.' },
                  { title: 'RESPONSIBILITY', desc: 'Take responsibility for your business choices.' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
                    <span className="font-mono text-cyan-400 font-bold text-[10px] block">{item.title}</span>
                    <p className="text-[11px] text-slate-300">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* LONG-TERM THINKING */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Long-Term Thinking vs One-Time Markup
              </div>
              <p className="text-slate-300 leading-relaxed">
                NordBase is designed to create a sustainable flow of Customers. An unfair price may generate slightly more money on one Job, but it destroys:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-red-300 font-medium">
                {[
                  'Customer trust',
                  'Local reputation',
                  'Future Customers',
                  'Future Leads',
                  'Recommendations'
                ].map((loss, i) => (
                  <div key={i} className="bg-slate-900 border border-red-500/20 p-2.5 rounded-lg text-[11px]">
                    ✗ {loss}
                  </div>
                ))}
              </div>
            </div>

            {/* KEY MESSAGE BANNER */}
            <div className="bg-gradient-to-r from-slate-950 via-emerald-950/50 to-slate-950 border border-emerald-500/40 p-5 rounded-2xl text-center shadow-lg space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                Core Mindset
              </span>
              <p className="text-xl font-black text-white max-w-xl mx-auto leading-relaxed">
                "We do not maximize one Job. We build long-term business."
              </p>
              <p className="text-xs text-slate-300 max-w-md mx-auto pt-1">
                A satisfied Customer brings future Jobs. An unfair experience loses them all.
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_15"
              nextModuleId="spec_mod_16"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 16: GROWING WITH NORDBASE */}
      {activeModId === 'spec_mod_16' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                MODULE 16 — GROWING WITH NORDBASE
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Building a sustainable local business, repeat customers, and long-term career growth.
              </p>
            </div>

            {/* WHAT YOU BUILD OVER TIME */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-sm text-white">What a Specialist Builds Over Time</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-slate-300">
                {[
                  'Professional local reputation',
                  'Direct Customer relationships',
                  'Repeat business flow',
                  'Deep technical experience',
                  'Stronger local market presence',
                  'Expanded commercial opportunities'
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2 text-[11px] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CAREER DEVELOPMENT CHAIN */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Specialist Development Ladder
              </h4>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-center">
                {[
                  'SPECIALIST',
                  'EXPERIENCED SPECIALIST',
                  'STRONG LOCAL REPUTATION',
                  'MORE OPPORTUNITIES',
                  'POSSIBLE TEAM / BUSINESS GROWTH'
                ].map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 font-bold text-[11px]">
                      {step}
                    </div>
                    {idx < 4 && <span className="text-slate-600 font-bold rotate-90 sm:rotate-0">↓</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* INDEPENDENCE & AUTONOMY */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-white text-sm">Specialist Independence & Control</div>
              <p className="text-slate-300 leading-relaxed">
                The Specialist remains an independent entrepreneur. NordBase does not control your career, schedule, or business decisions. NordBase provides ongoing access to qualified Customers and commercial opportunities — you decide how to develop and scale your own business.
              </p>
            </div>

            <ModuleFooter
              moduleId="spec_mod_16"
              nextModuleId="spec_mod_17"
              completedModules={completedModules}
              onCompleteModule={onCompleteModule}
              onNavigateToModule={onNavigateToModule}
            />
          </div>
        </div>
      )}

      {/* MODULE 17: SPECIALIST FINAL TEST */}
      {activeModId === 'spec_mod_17' && (
        <SpecialistFinalTest
          completedModules={completedModules}
          onCompleteModule={onCompleteModule}
          onNavigateToModule={onNavigateToModule}
          testAnswers={testAnswers}
          setTestAnswers={setTestAnswers}
          testSubmitted={testSubmitted}
          setTestSubmitted={setTestSubmitted}
        />
      )}

    </div>
  );
}

function SpecialistFinalTest({
  completedModules = [],
  onCompleteModule,
  onNavigateToModule,
  testAnswers,
  setTestAnswers,
  testSubmitted,
  setTestSubmitted
}: {
  completedModules: string[];
  onCompleteModule?: (id: string) => void;
  onNavigateToModule?: (id: string) => void;
  testAnswers: Record<number, number>;
  setTestAnswers: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  testSubmitted: boolean;
  setTestSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isModuleCompleted = completedModules.includes('spec_mod_17');

  const TEST_SCENARIOS = [
    {
      id: 1,
      title: 'SCENARIO 1 — PRICE INCREASE AGREEMENT',
      question: 'Initial estimate: €50. After on-site assessment: €80. Customer accepts. What should happen?',
      options: [
        'Refuse the job and leave.',
        'Explain the reason for the change and proceed with the agreed €80 price.',
        'Perform work for €50 and complain to support later.'
      ],
      correct: 1
    },
    {
      id: 2,
      title: 'SCENARIO 2 — PRICE INCREASE REFUSAL',
      question: 'Initial estimate: €50. After on-site assessment: €80. Customer refuses. What should the Specialist do?',
      options: [
        'Force the Customer to accept the €80 price or threaten them.',
        'Do not force the Job. Explain the situation. If the visit was completed and applicable conditions were accepted, the €20 Call-out Fee applies.',
        'Perform the €80 work anyway for free.'
      ],
      correct: 1
    },
    {
      id: 3,
      title: 'SCENARIO 3 — MINIMUM BILLABLE TIME',
      question: 'Actual repair takes 15 minutes. Applicable minimum charge: 2 hours (€50 floor). What should the Specialist record?',
      options: [
        'Falsely report 2 hours of actual working time on site.',
        'Record actual work = 15 minutes, charge minimum 2 hours (€50). Never falsely report 2 hours of actual work.',
        'Charge €0 and log no time.'
      ],
      correct: 1
    },
    {
      id: 4,
      title: 'SCENARIO 4 — LOWER FINAL PRICE',
      question: 'Initial estimate: €100. Actual work: €70. Can the final price be lower?',
      options: [
        'No, you must always charge the maximum initial estimate.',
        'YES. The final price should reflect the actual professional assessment and agreed scope.',
        'No, NordBase rules forbid lowering initial estimates.'
      ],
      correct: 1
    },
    {
      id: 5,
      title: 'SCENARIO 5 — ADDITIONAL WORK REQUEST',
      question: 'Customer asks for additional work during the Job. What should happen?',
      options: [
        'Perform it silently and add an unexpected extra fee at the end.',
        'Explain the additional work and price, and obtain Customer agreement before performing significant additional work.',
        'Refuse all extra customer requests unconditionally.'
      ],
      correct: 1
    },
    {
      id: 6,
      title: 'SCENARIO 6 — LIMITED CUSTOMER BUDGET',
      question: 'Specialist believes Customer\'s budget is limited and difference between initial estimate and fair price is small. Can Specialist choose a reasonable commercial solution?',
      options: [
        'Yes. The Specialist is an independent entrepreneur and may use professional judgment, provided the arrangement is honest and complies with applicable rules.',
        'No, NordBase strictly fixes every final price.',
        'Specialist must immediately close their account.'
      ],
      correct: 0
    },
    {
      id: 7,
      title: 'SCENARIO 7 — UNREALISTIC LEAD',
      question: 'Specialist receives a Lead but cannot realistically perform the work. What should the Specialist do?',
      options: [
        'Accept it anyway and attempt the job without proper equipment.',
        'Decline the Lead rather than accept work they cannot properly perform.',
        'Accept it and send an unverified neighbor.'
      ],
      correct: 1
    },
    {
      id: 8,
      title: 'SCENARIO 8 — CALL-OUT FEE REFUSAL',
      question: 'Customer refuses to pay the €20 Call-out Fee. What should the Specialist do?',
      options: [
        'Engage in an aggressive personal confrontation on site.',
        'Remain professional, record the unpaid fee, and use the NordBase payment / dispute procedure without threatening or escalating personally.',
        'Block the customer\'s driveway.'
      ],
      correct: 1
    },
    {
      id: 9,
      title: 'SCENARIO 9 — REPORTING HOURS STRATEGY',
      question: 'Specialist thinks: "I can make more money if I report more working hours." Why is this a bad strategy?',
      options: [
        'Because NordBase will reduce your Lead fee percentage.',
        'It damages trust, reputation and the long-term value of NordBase and your business.',
        'It is only bad if the Customer catches you.'
      ],
      correct: 1
    },
    {
      id: 10,
      title: 'SCENARIO 10 — PAYMENT SOURCE',
      question: 'Who pays the Specialist for the completed work?',
      options: [
        'NordBase pays the Specialist via bank transfer.',
        'The Customer pays the Specialist according to the agreed price. The Lead Fee is a separate business expense.',
        'The Territory Partner pays the Specialist salary.'
      ],
      correct: 1
    }
  ];

  // Calculate score
  let correctCount = 0;
  TEST_SCENARIOS.forEach(s => {
    if (testAnswers[s.id] === s.correct) {
      correctCount++;
    }
  });

  const isPassed = correctCount >= 8;

  const handleSubmit = () => {
    setTestSubmitted(true);
    if (isPassed || correctCount >= 8) {
      onCompleteModule?.('spec_mod_17');
    }
  };

  const handleRetake = () => {
    setTestAnswers({});
    setTestSubmitted(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              MODULE 17 — SPECIALIST FINAL TEST
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Practical scenario-based qualification exam (10 real-world scenarios).
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300">
            Passing Score: <span className="text-cyan-400 font-bold">8 / 10 (80%)</span>
          </div>
        </div>

        {/* TEST SUBMITTED & PASSED RESULTS BANNER */}
        {(testSubmitted || isModuleCompleted) && isPassed && (
          <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border border-emerald-500/50 p-6 rounded-2xl space-y-4 shadow-xl text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Award className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                SPECIALIST ACADEMY COMPLETED
              </span>
              <h2 className="text-2xl font-black text-white tracking-wide">
                READY TO RECEIVE LEADS
              </h2>
              <p className="text-xs text-emerald-300 font-mono font-bold">
                Final Score: {correctCount} / 10 Correct ({Math.round((correctCount / 10) * 100)}%)
              </p>
            </div>

            {/* FINAL ACADEMY MESSAGE */}
            <div className="bg-slate-950/90 border border-emerald-500/30 p-5 rounded-xl text-left text-xs space-y-3 max-w-2xl mx-auto shadow-inner">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Final Academy Declaration
              </div>
              <p className="text-slate-300 leading-relaxed font-medium">
                "You are now ready to work with NordBase.
                <br /><br />
                You are an independent professional.
                <br />
                NordBase helps connect you with qualified Customers.
                <br />
                Your reputation, your work and your business remain your responsibility.
                <br /><br />
                <strong>Be professional. Be fair. Think long-term.</strong>"
              </p>
            </div>
          </div>
        )}

        {/* TEST SUBMITTED & FAILED RESULTS BANNER */}
        {testSubmitted && !isPassed && (
          <div className="bg-red-950/30 border border-red-500/40 p-5 rounded-2xl space-y-3 text-center">
            <div className="font-bold text-red-400 text-sm uppercase font-mono">
              Test Score: {correctCount} / 10 Correct
            </div>
            <p className="text-slate-200 text-xs font-semibold">
              Review the relevant modules and try again.
            </p>
            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Final Test
            </button>
          </div>
        )}

        {/* QUESTION LIST */}
        <div className="space-y-4">
          {TEST_SCENARIOS.map((scenario, index) => {
            const selectedOpt = testAnswers[scenario.id];
            const isCorrect = selectedOpt === scenario.correct;

            return (
              <div
                key={scenario.id}
                className={`bg-slate-950 border p-4.5 rounded-xl space-y-3 text-xs transition-colors ${
                  testSubmitted
                    ? isCorrect
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-red-500/40 bg-red-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase text-cyan-400 tracking-wider">
                    {scenario.title}
                  </span>
                  {testSubmitted && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  )}
                </div>

                <p className="text-slate-200 font-semibold leading-relaxed">
                  {index + 1}. {scenario.question}
                </p>

                <div className="space-y-2 pt-1">
                  {scenario.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    return (
                      <button
                        key={optIdx}
                        disabled={testSubmitted}
                        onClick={() => {
                          setTestAnswers(prev => ({ ...prev, [scenario.id]: optIdx }));
                        }}
                        className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? testSubmitted
                              ? optIdx === scenario.correct
                                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                                : 'bg-red-950/50 border-red-500 text-red-200'
                              : 'bg-cyan-950/50 border-cyan-500 text-cyan-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && !testSubmitted && (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* SUBMIT BUTTON */}
        {!testSubmitted && (
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(testAnswers).length < 10}
              className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                Object.keys(testAnswers).length === 10
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer shadow-lg hover:shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Submit Final Test ({Object.keys(testAnswers).length} / 10 Answered)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <ModuleFooter
          moduleId="spec_mod_17"
          completedModules={completedModules}
          onCompleteModule={onCompleteModule}
          onNavigateToModule={onNavigateToModule}
        />
      </div>
    </div>
  );
}

function ModuleFooter({
  moduleId,
  nextModuleId,
  completedModules = [],
  onCompleteModule,
  onNavigateToModule
}: {
  moduleId: string;
  nextModuleId?: string;
  completedModules?: string[];
  onCompleteModule?: (id: string) => void;
  onNavigateToModule?: (id: string) => void;
}) {
  const isCompleted = completedModules.includes(moduleId);

  return (
    <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 shadow-sm">
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ✓ Module completed
          </span>
        ) : (
          <button
            onClick={() => onCompleteModule?.(moduleId)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
            Mark as Completed
          </button>
        )}
      </div>

      {nextModuleId && (
        <button
          onClick={() => {
            if (!isCompleted) {
              onCompleteModule?.(moduleId);
            }
            onNavigateToModule?.(nextModuleId);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-cyan-500/20 cursor-pointer"
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
