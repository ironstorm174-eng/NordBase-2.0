import React, { useState } from 'react';
import { 
  Compass, 
  Users, 
  Zap, 
  CheckCircle2, 
  MapPin, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  Layers,
  PhoneCall,
  Share2,
  FileCheck2,
  ListTodo,
  ExternalLink,
  Target,
  Globe,
  HelpCircle,
  Clock,
  Briefcase,
  ChevronRight,
  Lock,
  Building2,
  Workflow,
  UserCheck,
  UserX,
  MessageSquare,
  GraduationCap,
  CheckSquare,
  PlayCircle,
  Video,
  HeartHandshake,
  Shield,
  UserPlus,
  ListChecks,
  Calendar,
  Rocket,
  Megaphone,
  Lightbulb,
  FileText,
  LayoutGrid,
  Flag,
  Utensils,
  Store,
  Send,
  BarChart2,
  Activity,
  Eye,
  RefreshCw,
  Sliders,
  ShieldAlert,
  Scale,
  Search
} from 'lucide-react';
import { Module, Section } from './curriculumData';

interface RpContentProps {
  expandedSection: string | null;
  lang?: string;
  currentModuleObj?: Module;
  currentSectionObj?: Section;
  completedModules: string[];
  onCompleteModule: (moduleId: string) => void;
  onNavigateToModule: (moduleId: string, sectionId?: string) => void;
}

export function RpContent({
  expandedSection,
  currentModuleObj,
  currentSectionObj,
  completedModules,
  onCompleteModule,
  onNavigateToModule
}: RpContentProps) {
  const [selectedScenarioOption, setSelectedScenarioOption] = useState<number | null>(null);

  if (!currentModuleObj) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Select a Regional Partner module from the curriculum sidebar to start learning.</p>
      </div>
    );
  }

  const modId = currentModuleObj.id;
  const isCompleted = completedModules.includes(modId);

  // Calculate completed count out of 24 total RP modules
  const rpCompletedCount = completedModules.filter(id => id.startsWith('rp_mod_')).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Academy Header & Progress Bar */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              RP
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <span>RP Academy — Modules 0–24</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono">NordBase</span>
              </h1>
              <p className="text-xs text-slate-400">Internal Education & Preparation System for Regional Partners</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">RP ACADEMY PROGRESS</span>
              <span className="text-cyan-400 font-bold">{rpCompletedCount} / 24 Modules Completed</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, Math.max(4, (rpCompletedCount / 24) * 100))}%` }}
          />
        </div>
      </div>

      {/* Module Title Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A1128] via-[#0D1B3E] to-[#0A1128] border border-blue-900/50 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              {currentModuleObj.categoryName || 'RP Foundation'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 font-mono text-xs font-bold">
              Module {currentModuleObj.number}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className={isCompleted ? 'text-emerald-400 font-bold flex items-center gap-1' : 'text-amber-400 font-bold flex items-center gap-1'}>
              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {isCompleted ? 'Completed' : 'In Progress'}
            </span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight mb-3">
          {currentModuleObj.title}
        </h2>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
          {currentModuleObj.description}
        </p>

        {/* RP Core Identity Pill */}
        <div className="mt-6 pt-5 border-t border-blue-900/40 flex items-start gap-3 bg-cyan-950/30 p-4 rounded-xl border-l-4 border-l-cyan-400">
          <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block font-bold mb-0.5">RP Role Definition:</strong>
            "RP (Regional Partner) is the Senior Partner responsible for building, launching and developing a NordBase region."
          </div>
        </div>
      </div>

      {/* Module Sections Navigation */}
      {currentModuleObj.sections && currentModuleObj.sections.length > 0 && (
        <div className="bg-[#050A1A] border border-blue-900/30 p-2 rounded-xl flex overflow-x-auto gap-2 no-scrollbar">
          {currentModuleObj.sections.map((sec) => {
            const isActive = expandedSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onNavigateToModule(currentModuleObj.id, sec.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {sec.title}
              </button>
            );
          })}
        </div>
      )}

      {/* RENDER SPECIFIC MODULE CONTENT */}
      {modId === 'rp_mod_00' && (
        <Module0Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_01' && (
        <Module1Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_02' && (
        <Module2Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_03' && (
        <Module3Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
          onNavigateToModule={onNavigateToModule}
        />
      )}

      {modId === 'rp_mod_04' && (
        <Module4Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_05' && (
        <Module5Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_06' && (
        <Module6Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_07' && (
        <Module7Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_08' && (
        <Module8Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_09' && (
        <Module9Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_10' && (
        <Module10Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_11' && (
        <Module11Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_12' && (
        <Module12Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_13' && (
        <Module13Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_14' && (
        <Module14Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_15' && (
        <Module15Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_16' && (
        <Module16Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_17' && (
        <Module17Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_18' && (
        <Module18Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_19' && (
        <Module19Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_20' && (
        <Module20Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_21' && (
        <Module21Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_22' && (
        <Module22Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_23' && (
        <Module23Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
        />
      )}

      {modId === 'rp_mod_24' && (
        <Module24Content 
          selectedScenarioOption={selectedScenarioOption}
          setSelectedScenarioOption={setSelectedScenarioOption}
          rpCompletedCount={rpCompletedCount}
        />
      )}

      {/* Completion Button & Progress Footer */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">Module Progression</span>
          <p className="text-sm font-medium text-slate-200">
            {isCompleted ? '✓ You have mastered this RP module.' : 'Complete the material and scenarios above, then mark completed.'}
          </p>
        </div>

        <button
          onClick={() => {
            onCompleteModule(modId);
            setSelectedScenarioOption(null);
          }}
          className={`px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
            isCompleted
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
              : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{isCompleted ? 'Module Completed (Re-verify)' : 'Mark Module as Completed'}</span>
        </button>
      </div>

      {/* Completion Banner after Modules 0–24 */}
      {rpCompletedCount >= 24 ? (
        <div className="bg-gradient-to-r from-emerald-950/60 via-cyan-950/80 to-emerald-950/60 border-2 border-emerald-400/60 rounded-2xl p-8 text-center space-y-4 shadow-xl shadow-emerald-950/30">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>RP ACADEMY FULLY COMPLETED — ALL 24 MODULES MASTERED</span>
          </div>
          <h3 className="text-2xl font-bold text-white font-display">RP Academy — Modules 0–24</h3>
          <p className="text-base font-mono text-emerald-400 font-bold">24 / 24 Modules Completed</p>
          <p className="text-xs text-slate-200 max-w-xl mx-auto leading-relaxed">
            Congratulations! You have completed the complete RP Academy curriculum — from foundations, territory structure, and TP leadership, to regional launch, stable operations, quality control, and crisis management.
          </p>
          <div className="p-4 bg-slate-900/90 border border-emerald-500/30 rounded-xl max-w-md mx-auto text-emerald-300 font-mono font-bold text-xs flex items-center justify-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Status: Ready for Final Review & Regional Launch Authorization</span>
          </div>
        </div>
      ) : rpCompletedCount >= 18 ? (
        <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/60 to-cyan-950/40 border-2 border-cyan-500/40 rounded-2xl p-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4" />
            <span>PROGRESSING THROUGH REGIONAL OPERATIONS & STABILIZATION</span>
          </div>
          <h3 className="text-xl font-bold text-white font-display">{rpCompletedCount} / 24 Modules Completed</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Continue completing Modules 18–24 to finish the Regional Operations, Quality Control & Final Authorization curriculum.
          </p>
        </div>
      ) : rpCompletedCount >= 11 ? (
        <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/60 to-cyan-950/40 border-2 border-cyan-500/40 rounded-2xl p-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4" />
            <span>PROGRESSING THROUGH SEEDING MONTH & REGIONAL LAUNCH</span>
          </div>
          <h3 className="text-xl font-bold text-white font-display">{rpCompletedCount} / 24 Modules Completed</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Continue completing Modules 11–17 to finish the Regional Launch Preparation and Seeding Month curriculum.
          </p>
        </div>
      ) : rpCompletedCount >= 6 ? (
        <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/60 to-cyan-950/40 border-2 border-cyan-500/40 rounded-2xl p-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4" />
            <span>PROGRESSING THROUGH REGIONAL LAUNCH & TP LEADERSHIP</span>
          </div>
          <h3 className="text-xl font-bold text-white font-display">{rpCompletedCount} / 24 Modules Completed</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Continue completing Modules 6–10 to finish the Regional Structure and TP Training Foundation.
          </p>
        </div>
      ) : null}

    </div>
  );
}

/* =========================================================================
   MODULE 0 CONTENT — RP FOUNDATION
   ========================================================================= */
function Module0Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Objective */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Short Introduction
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            RP (Regional Partner) is the Senior Partner responsible for building, launching and developing a NordBase region. The RP is not a traditional manager or boss, but the starting generator of regional growth.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Learning Objective
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Understand who an RP is, the Senior Partner mindset (not a boss), key personal qualities required, the "Starting Generator" energy concept, and the Regional Mission.
          </p>
        </div>
      </div>

      {/* 0.1 Who Is an RP? */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">0.1</span>
          <span>Who Is an RP?</span>
        </h3>

        <div className="bg-cyan-950/30 border-l-4 border-l-cyan-400 border border-cyan-900/30 p-4 rounded-xl text-slate-200 text-sm font-semibold leading-relaxed">
          "RP (Regional Partner) is the Senior Partner responsible for building, launching and developing a NordBase region."
        </div>

        <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside marker:text-cyan-400">
          <li><strong>Creates the conditions</strong> in which Hubs and TPs can work successfully.</li>
          <li><strong>Does not simply manage existing operations</strong>; builds the regional structure from scratch.</li>
          <li><strong>Connects local Hubs</strong> into a cohesive, self-sustaining regional community.</li>
        </ul>
      </div>

      {/* 0.2 RP Is a Senior Partner, Not a Boss */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">0.2</span>
          <span>RP Is a Senior Partner, Not a Boss</span>
        </h3>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
          <p className="text-xs text-slate-200 leading-relaxed font-semibold">
            RP is NOT the boss of TP. TPs are independent partners in charge of their local Hubs.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            RP works as a senior partner who: supports, trains, coordinates, helps, develops, sets regional direction, monitors quality, solves problems, and protects the interests of the regional community.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-xl">
            <span className="text-rose-400 font-bold block mb-1">❌ Boss / Manager Mindset</span>
            <p className="text-slate-400 text-[11px]">Gives orders, micromanages daily details, demands reports, relies on surveillance and penalties.</p>
          </div>
          <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
            <span className="text-emerald-400 font-bold block mb-1">✓ Senior Partner Mindset</span>
            <p className="text-slate-300 text-[11px]">Supports independence, trains TPs, builds field trust, transfers responsibility, solves obstacles.</p>
          </div>
        </div>
      </div>

      {/* 0.3 Personal Characteristics */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">0.3</span>
          <span>What Kind of Person Can Become an RP?</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Initiative', desc: 'Acts proactively without waiting for external orders.' },
            { title: 'Strong Starting Energy', desc: 'Drives initial regional momentum and inspires team members.' },
            { title: 'Responsibility', desc: 'Takes full personal ownership of regional decisions and mistakes.' },
            { title: 'Honesty & Reliability', desc: 'Builds long-term field trust through transparent actions.' },
            { title: 'Communication Skills', desc: 'Listens actively, communicates clearly, and resolves friction.' },
            { title: 'Ability to Unite People', desc: 'Fosters cooperation over destructive internal competition.' },
            { title: 'Independence & Resilience', desc: 'Navigates uncertainty and solves field problems calmly.' },
            { title: 'Entrepreneurial Thinking', desc: 'Sees growth opportunities and practical value creation.' },
            { title: 'Ability to Learn & Admit Errors', desc: 'Maintains humility, adapts continuously, and learns fast.' }
          ].map((qual, idx) => (
            <div key={idx} className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
              <span className="text-cyan-400 font-bold text-xs block">{qual.title}</span>
              <p className="text-[11px] text-slate-400 leading-normal">{qual.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 0.4 The Regional Starting Generator */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">0.4</span>
          <span>The RP as the Regional Starting Generator</span>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          In the beginning, a new region has no momentum. The RP acts as the <strong>starting generator</strong> that provides the initial energy required to start the engine.
        </p>

        {/* Pipeline Diagram */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">Regional Progression Pipeline</span>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-center">
            <span className="px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">RP Starts Region</span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded bg-slate-800 text-slate-300">TP Team Active</span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded bg-slate-800 text-slate-300">Hubs Operational</span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded bg-slate-800 text-slate-300">System Stabilizes</span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Self-Sustaining Region</span>
          </div>
        </div>

        <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200">
          <strong>Key Rule:</strong> "If the region can only function because the RP personally does everything, the system has not been built correctly."
        </div>
      </div>

      {/* 0.5 The RP Mission */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">0.5</span>
          <span>The RP Mission</span>
        </h3>

        <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-slate-200 text-xs font-bold leading-relaxed text-center">
          Build the structure. Build the team. Build the Specialist base. Launch the first work. Reach stable operations. Keep improving the region.
        </div>
      </div>

      {/* Practical Scenario — Module 0 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 0
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> You have received a new region. There are no active Hubs, no trained TPs, and almost no Specialists. What is the RP's first priority?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Wait for Customers to submit requests first before doing anything.' },
            { id: 2, text: 'B) Begin building the regional foundation: identify potential Hubs, scout candidate TPs, and start seeding the Specialist base.' },
            { id: 3, text: 'C) Demand that central management supply leads immediately.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> RP is the Starting Generator. You must actively initiate the foundation by identifying Hubs, recruiting candidate TPs, and seeding the initial Specialist base.</span>
            ) : (
              <span><strong>Incorrect.</strong> Remember: RP is the Starting Generator. You cannot wait passively for incoming leads in an undeveloped region.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 1 CONTENT — NORDBASE PHILOSOPHY
   ========================================================================= */
function Module1Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Objective */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Short Introduction
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            The core philosophy every RP must understand and convey to the regional team. NordBase builds local communities where people remain independent while supporting each other.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Learning Objective
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Master the core idea in a changing world, mutual help philosophy, freedom & individuality, Win-Win value creation, Trust + Responsibility + Verification + Transparency, and RP stewardship.
          </p>
        </div>
      </div>

      {/* 1.1 Core Idea & Changing World */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">1.1</span>
          <span>Core Idea & The Changing World</span>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          The modern world faces economic uncertainty, rapid technological shifts, AI replacing traditional jobs, migration, and bureaucracy. NordBase cannot stop global change, but people can build local communities where they do not face uncertainty alone.
        </p>
      </div>

      {/* 1.2 NordBase Philosophy */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">1.2</span>
          <span>NordBase Philosophy: People Are Stronger Together</span>
        </h3>

        <div className="bg-cyan-950/30 border-l-4 border-l-cyan-400 border border-cyan-900/30 p-4 rounded-xl text-slate-200 text-sm font-semibold leading-relaxed">
          "People are stronger when they help each other."
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          We create communities where people work, build businesses, support each other, develop skills, find legal earning opportunities, remain independent, and build long-term stability.
        </p>
      </div>

      {/* 1.3 Freedom and Individuality */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">1.3</span>
          <span>Freedom and Individuality</span>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Community does not mean giving up freedom or individuality.</strong> NordBase helps people become stronger while remaining independent entrepreneurs and self-governing partners.
        </p>
      </div>

      {/* 1.4 The Win-Win Principle */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">1.4</span>
          <span>The Win-Win Principle</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-cyan-400 font-bold block mb-1">CUSTOMER</span>
            <span className="text-[11px] text-slate-300">Finds verified, suitable Specialist</span>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-emerald-400 font-bold block mb-1">SPECIALIST</span>
            <span className="text-[11px] text-slate-300">Finds legitimate work and earns</span>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-amber-400 font-bold block mb-1">TP</span>
            <span className="text-[11px] text-slate-300">Builds business & earns from Leads</span>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-purple-400 font-bold block mb-1">RP</span>
            <span className="text-[11px] text-slate-300">Builds & develops region</span>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl sm:col-span-2 lg:col-span-1">
            <span className="text-blue-400 font-bold block mb-1">NORDBASE</span>
            <span className="text-[11px] text-slate-300">Grows by creating real value</span>
          </div>
        </div>
      </div>

      {/* 1.5 Trust Equation */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">1.5</span>
          <span>The NordBase Trust Equation</span>
        </h3>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-center">
          <span className="text-sm md:text-base font-bold font-mono text-cyan-400">
            Trust = Trust + Responsibility + Verification + Transparency
          </span>
        </div>
      </div>

      {/* Practical Scenario — Module 1 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 1
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> A TP wants to maximize their personal immediate results even if another TP in the same Hub loses opportunities unnecessarily. How should RP approach this?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Allow it, because individual profit is the only metric that matters.' },
            { id: 2, text: 'B) Explain that while individual success is important, it must not destroy cooperation and the health of the regional community, and guide both TPs toward a fair Win-Win solution.' },
            { id: 3, text: 'C) Ban the TP immediately without discussion.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> NordBase is built on cooperation and Win-Win outcomes. Selfish behavior destroys community trust and regional stability.</span>
            ) : (
              <span><strong>Incorrect.</strong> Remember: NordBase is built on community trust and mutual support, not cutthroat internal competition.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 2 CONTENT — NORDBASE GLOSSARY & SYSTEM
   ========================================================================= */
function Module2Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Objective */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Short Introduction
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Complete NordBase vocabulary and operational system lifecycle. RP must know every system term and data flow from Customer Request to Job closure.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Learning Objective
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Master every core term, understand the transition from Request to Lead to Job, and know how each role interacts across the system lifecycle.
          </p>
        </div>
      </div>

      {/* Glossary Cards */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">2.1</span>
          <span>NordBase Glossary</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            { term: 'Customer', def: 'A person or business requesting work or a service.' },
            { term: 'Specialist', def: 'An independent entrepreneur or company providing requested work.' },
            { term: 'TP (Territory Partner)', def: 'Local partner responsible for operational coordination in a Hub.' },
            { term: 'RP (Regional Partner)', def: 'Senior Partner responsible for building and developing a region.' },
            { term: 'Hub', def: 'Local operational territory within a region (managed by TPs).' },
            { term: 'Region', def: 'A larger administrative territory containing 3–25 Hubs.' },
            { term: 'Request', def: 'Initial Customer request describing a problem, need or service.' },
            { term: 'Verification', def: 'Confirming request validity and details before processing.' },
            { term: 'Lead', def: 'Qualified and prepared opportunity offered to a Specialist before acceptance.' },
            { term: 'Job', def: 'A Lead accepted by a Specialist that has moved into active work.' },
            { term: 'Lead Fee', def: 'Fee allocated according to the NordBase business model.' },
            { term: 'NordBase Chat', def: 'Communication environment connected to operational workflows.' },
            { term: 'AI Translator', def: 'AI translation in NordBase Chat for cross-language communication.' },
            { term: 'Stripe', def: 'Payment infrastructure used for financial transactions.' },
            { term: 'Academy', def: 'Education and certification system for all roles.' },
            { term: 'Seeding Month', def: 'Initial 30-day launch period establishing regional foundation.' },
            { term: 'Specialist Base', def: 'Local pool of verified Specialists in a Hub.' },
            { term: 'Hidden / Mystery Customer', def: 'Controlled audit testing quality, honesty and compliance.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
              <span className="text-cyan-400 font-bold font-mono block">{item.term}</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">{item.def}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Flow Diagram */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">2.2</span>
          <span>System Flow Diagram</span>
        </h3>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-center">
            <span className="p-2 rounded bg-slate-800 text-slate-200">Customer Request</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 rounded bg-slate-800 text-slate-200">Verification</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded font-bold">Lead</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 rounded bg-slate-800 text-slate-200">Specialist Selection</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-bold">Job</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 rounded bg-slate-800 text-slate-200">Completion</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 rounded bg-slate-800 text-slate-200">Job Closed</span>
          </div>

          <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-xs text-cyan-200">
            <strong>Critical Terminology Rule:</strong> Use "Lead" when referring to a verified opportunity before Specialist acceptance. Use "Job" only after a Specialist accepts the opportunity into active work.
          </div>
        </div>
      </div>

      {/* Practical Scenario — Module 2 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 2
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> A Customer request has been verified, prepared and is ready to be offered to a Specialist. What is the correct NordBase term for this opportunity at this stage?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Job' },
            { id: 2, text: 'B) Lead' },
            { id: 3, text: 'C) Direct Contract' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> Before Specialist acceptance, it is a <strong>Lead</strong>. Once accepted, it becomes a <strong>Job</strong>.</span>
            ) : (
              <span><strong>Incorrect.</strong> Remember: It only becomes a Job AFTER a Specialist accepts it. Before acceptance, it is a Lead.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 3 CONTENT — COMPLETE TP ACADEMY MASTERY
   ========================================================================= */
function Module3Content({ selectedScenarioOption, setSelectedScenarioOption, onNavigateToModule }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Objective */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Short Introduction
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mandatory requirement: An RP must know the TP Academy completely. You cannot evaluate, train, or lead TPs if you do not know their operational workflow inside out.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Learning Objective
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Master the complete TP operational sequence, responsibilities, boundaries, and status tracking across all 27 TP Academy modules.
          </p>
        </div>
      </div>

      {/* 3.1 Mandatory TP Knowledge Requirement */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">3.1</span>
          <span>Why RP Must Know TP Academy Completely</span>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          The RP must understand the TP role deeply enough to:
        </p>

        <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside marker:text-cyan-400">
          <li><strong>Perform TP work directly</strong> when launching a region or filling in.</li>
          <li><strong>Train and mentor</strong> new candidate TPs effectively.</li>
          <li><strong>Evaluate TP performance</strong> and catch operational errors early.</li>
          <li><strong>Help TPs solve complex field problems</strong> and Customer disputes.</li>
          <li><strong>Temporarily replace a TP</strong> during emergencies or absences.</li>
          <li><strong>Verify if TP is following correct process</strong> and platform standards.</li>
        </ul>
      </div>

      {/* 3.2 TP Operational Workflow & Boundaries */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">3.2</span>
          <span>TP Operational Workflow & Boundaries</span>
        </h3>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
          <span className="text-cyan-400 font-bold block">TP Standard Sequence:</span>
          <p className="text-slate-300 font-mono">
            Request → Verification → Lead → Specialist Selection → Job → Completion → Closure
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-emerald-400 font-bold block">✓ TP Is Responsible For:</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Customer communication, request verification, Lead creation, Specialist matching, job quality oversight, escalation, platform rules.
            </p>
          </div>
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-rose-400 font-bold block">❌ TP Boundaries (What TP Is NOT):</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              TP does NOT become the technical contractor. TP does NOT become a party to the Customer–Specialist commercial relationship. NordBase is NOT a party to that commercial relationship.
            </p>
          </div>
        </div>
      </div>

      {/* Cross Reference Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">TP Academy Status Tracker for RP</h4>
          <p className="text-xs text-slate-400 mt-1">
            Status options: <span className="text-slate-300 font-mono">Not Started | In Progress | Completed | Assessment Required | Mastered</span>
          </p>
        </div>

        <button
          onClick={() => onNavigateToModule('tp_mod_01')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Explore TP Modules</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Practical Scenario — Module 3 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 3
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> A Customer submits a request. The request appears genuine, but the information is incomplete. What should the TP do next?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Immediately offer it to a Specialist anyway.' },
            { id: 2, text: 'B) Contact the Customer to complete verification and obtain missing details before creating a Lead.' },
            { id: 3, text: 'C) Delete the request without contacting the Customer.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> Complete verification requires full information before converting a Request into a Lead for Specialists.</span>
            ) : (
              <span><strong>Incorrect.</strong> Offering incomplete requests leads to Specialist confusion and canceled jobs. TP must clarify missing details first.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 4 CONTENT — NORDBASE ROLES & RESPONSIBILITIES
   ========================================================================= */
function Module4Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Objective */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Short Introduction
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            The complete operational structure of NordBase roles and accountabilities. NordBase is an operational ecosystem, not a traditional employer-employee hierarchy.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Learning Objective
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Understand the operational value chain (Customer → Specialist → TP → RP → Admin / Super Admin), RP authority, system limits (TBD), and legal boundaries.
          </p>
        </div>
      </div>

      {/* 4.1 Value Chain & Structure */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">4.1</span>
          <span>Operational Value Chain & Structure</span>
        </h3>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-center">
            <span className="p-2 rounded bg-slate-800 text-cyan-400 font-bold">Customer</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 rounded bg-slate-800 text-emerald-400 font-bold">Specialist</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 rounded bg-slate-800 text-amber-400 font-bold">TP</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded font-bold">RP</span>
            <span className="text-slate-600">→</span>
            <span className="p-2 rounded bg-slate-800 text-purple-400 font-bold">Admin / Super Admin</span>
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Operational collaboration chain, NOT a traditional employer-employee hierarchy.
          </p>
        </div>
      </div>

      {/* 4.2 Detailed Role Breakdown */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">4.2</span>
          <span>Detailed Role Breakdown</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-cyan-400 font-bold block">Customer</span>
            <p className="text-slate-300 text-[11px]">Creates demand and requests work or service.</p>
          </div>
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-emerald-400 font-bold block">Specialist</span>
            <p className="text-slate-300 text-[11px]">Independent entrepreneur or company providing service.</p>
          </div>
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-amber-400 font-bold block">TP (Territory Partner)</span>
            <p className="text-slate-300 text-[11px]">Coordinates local operational processes within a Hub.</p>
          </div>
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-purple-400 font-bold block">RP (Regional Partner)</span>
            <p className="text-slate-300 text-[11px]">Builds and develops regional structure and supports TPs.</p>
          </div>
        </div>
      </div>

      {/* 4.3 RP Authority & Boundaries */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">4.3</span>
          <span>RP Authority Scope & System Limits</span>
        </h3>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
          <span className="text-cyan-400 font-bold block">RP Normal Scope:</span>
          <p className="text-slate-300 leading-relaxed">
            Coordinate regional team, recruit & train TPs, support Hubs, monitor operational metrics, escalate issues, organize marketing, build regional community.
          </p>
          <div className="p-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] text-amber-300">
            Exact system permissions: TBD — requires definition
          </div>
        </div>

        <div className="p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-1.5 text-xs">
          <span className="text-rose-400 font-bold block">RP Boundaries (What RP Does NOT Do):</span>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
            <li>RP does NOT become the Specialist or perform technical manual work.</li>
            <li>RP does NOT directly guarantee Specialist workmanship.</li>
            <li>RP does NOT act as a legal judge in private Customer–Specialist disputes.</li>
            <li>RP does NOT micromanage TPs or treat partners as traditional employees.</li>
          </ul>
        </div>
      </div>

      {/* Practical Scenario — Module 4 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 4
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> A Customer is unhappy with a Specialist and asks RP to decide who is legally right and issue a binding verdict. What is RP's role?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Act as a judge and issue a binding legal verdict on the private commercial contract.' },
            { id: 2, text: 'B) Help maintain communication, document the facts objectively, handle any NordBase platform-related issues, but refrain from acting as a legal judge of the private commercial contract.' },
            { id: 3, text: 'C) Immediately pay the Customer out of RP personal funds.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> Neither RP nor NordBase is a party to the private commercial contract between Customer and Specialist. RP facilitates communication and platform integrity without acting as a legal judge over private contracts.</span>
            ) : (
              <span><strong>Incorrect.</strong> Remember: NordBase and RP are not parties to the private commercial relationship between Customer and Specialist.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 5 CONTENT — REGIONAL STRUCTURE
   ========================================================================= */
function Module5Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Objective */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Short Introduction
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            The architecture of a NordBase region and its Hub topology. Understanding how regions are divided into 3–25 Hubs and how RP connects them into a thriving community.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Learning Objective
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Understand Region & Hub composition (3–25 Hubs per Region), factors for creating Hubs, building a collaborative regional community, and identifying expansion triggers.
          </p>
        </div>
      </div>

      {/* 5.1 Region & Hub Architecture */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">5.1</span>
          <span>Region & Hub Architecture (3–25 Hubs)</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <span className="text-cyan-400 font-bold font-mono uppercase tracking-wider block">Region Structure</span>
            <p className="text-slate-300 leading-relaxed">
              A defined geographic administrative area managed by an RP, containing <strong>3 to 25 operational Hubs</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <span className="text-emerald-400 font-bold font-mono uppercase tracking-wider block">Hub Structure</span>
            <p className="text-slate-300 leading-relaxed">
              A local operational territory managed by local TPs, containing a local Specialist base, local Customers, Leads and Jobs.
            </p>
          </div>
        </div>
      </div>

      {/* 5.2 Factors for Creating Hubs */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">5.2</span>
          <span>Factors for Creating Hubs</span>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          When dividing a region into Hubs, RP evaluates key practical factors:
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { title: 'Population Density', desc: 'Sufficient local population to generate recurring service demand.' },
            { title: 'Travel Distance', desc: 'Practical travel radii for Specialists responding to leads.' },
            { title: 'Specialist Base Density', desc: 'Number of active trade Specialists available in the area.' },
            { title: 'TP Workload Capacity', desc: 'Ensuring daily Request volume matches TP management capacity.' }
          ].map((f, idx) => (
            <div key={idx} className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
              <span className="text-cyan-400 font-bold block">{f.title}</span>
              <p className="text-[11px] text-slate-400 leading-normal">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-amber-300">
          Specific population thresholds per Hub: TBD — requires definition
        </div>
      </div>

      {/* 5.3 Regional Community & Expansion */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">5.3</span>
          <span>Regional Community & Expansion Triggers</span>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          RP connects individual Hubs into a supportive regional community where TPs communicate, share experience, and assist each other across Hub borders.
        </p>

        <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-2 text-xs">
          <span className="text-cyan-400 font-bold block">Expansion Triggers:</span>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
            <li>An existing Hub exceeds TP handling capacity → split or add a new TP.</li>
            <li>A high-demand sub-territory emerges → establish a new Hub.</li>
            <li>Specialist base grows dense → launch secondary service categories.</li>
          </ul>
        </div>
      </div>

      {/* Practical Scenario — Module 5 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 5
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> You receive a hypothetical territory containing several cities and rural towns. You need to decide how to divide it into Hubs. What factors should RP consider?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Simply draw straight lines on an administrative map without checking population or travel distance.' },
            { id: 2, text: 'B) Evaluate population density, travel distances, local service demand, Specialist numbers, and TP availability to form balanced 3–25 Hubs.' },
            { id: 3, text: 'C) Put every town into its own separate region immediately.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> Hub topology requires evaluating population, travel distances, service demand, and TP capacity to ensure balanced 3–25 Hubs.</span>
            ) : (
              <span><strong>Incorrect.</strong> Arbitrary lines on a map lead to unviable Hubs with insufficient demand or unmanageable travel distances.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 6 CONTENT — CREATING HUBS
   ========================================================================= */
function Module6Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    item1: true,
    item2: true,
    item3: true,
    item4: false,
    item5: false,
    item6: false,
    item7: false,
    item8: false,
    item9: false
  });

  const toggleCheck = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Purpose of Module 6
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach the RP how to turn a geographic territory into a practical network of working Hubs. A Hub is not simply a point on a map.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Operational Community Definition
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            A Hub is a local operational community consisting of: <strong>TP</strong>, <strong>Specialists</strong>, <strong>Customers</strong>, <strong>Leads</strong>, and <strong>Jobs</strong>.
          </p>
        </div>
      </div>

      {/* 6.1 What RP Must Understand Before Creating a Hub */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">6.1</span>
          <span>10 Factors RP Must Understand Before Creating a Hub</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { title: '1. Population', desc: 'Local density and demographics (TBD — requires definition).' },
            { title: '2. Geography', desc: 'Natural terrain, barriers, and physical land layout.' },
            { title: '3. Distance', desc: 'Realistic travel time between towns and districts.' },
            { title: '4. Local Demand', desc: 'Active demand volume for field & home services.' },
            { title: '5. Categories', desc: 'Service types required in the local area.' },
            { title: '6. Specialist Base', desc: 'Potential tradespeople and specialists locally.' },
            { title: '7. Customer Base', desc: 'Potential homeowners and businesses needing work.' },
            { title: '8. Transport', desc: 'Accessibility and transit times for specialists.' },
            { title: '9. Workload', desc: 'Expected request volume per operational day.' },
            { title: '10. TP Availability', desc: 'Presence of qualified local Territory Partner.' }
          ].map((f, idx) => (
            <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs font-bold text-cyan-400 block">{f.title}</span>
              <p className="text-[11px] text-slate-400 leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-center gap-2 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span><strong>Threshold Rule:</strong> Do not use fixed population thresholds unless already defined by NordBase. Population target thresholds: <strong>TBD — requires definition</strong>.</span>
        </div>
      </div>

      {/* 6.2 Hub Boundaries */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">6.2</span>
          <span>Practical Hub Boundaries</span>
        </h3>

        <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-slate-200 leading-relaxed space-y-2">
          <p>
            Hub boundaries must be <strong>practical</strong>. Administrative or municipality borders are not automatically the correct operational borders for field operations.
          </p>
          <p className="text-slate-400">
            <strong>Objective:</strong> Create an operational area that can be served efficiently, keeping response times fast and travel reasonable for local specialists.
          </p>
        </div>
      </div>

      {/* 6.3 Hub Structure */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">6.3</span>
          <span>Core Hub Structure</span>
        </h3>

        <div className="grid md:grid-cols-3 gap-3 text-xs">
          {[
            { title: '1. Responsible TP', desc: 'Independent Territory Partner overseeing day-to-day operations.' },
            { title: '2. Initial Specialist Base', desc: 'Verified local tradespeople onboarded for active leads.' },
            { title: '3. Customer Acquisition Plan', desc: 'Local marketing & community outreach to drive incoming Requests.' },
            { title: '4. Communication Channels', desc: 'WhatsApp, NordBase Chat, AI Translator, and direct contact.' },
            { title: '5. Operational Coverage', desc: 'Clear physical territory boundaries for fast specialist response.' },
            { title: '6. Connection to RP', desc: 'Direct support line and coordination with Regional Partner.' }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-cyan-300 block">{item.title}</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6.4 Hub Readiness Checklist */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">6.4</span>
            <span>Hub Readiness Checklist</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400">Interactive Verification Protocol</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          {[
            { id: 'item1', label: 'Territory defined' },
            { id: 'item2', label: 'TP selected' },
            { id: 'item3', label: 'TP trained' },
            { id: 'item4', label: 'Workspace confirmed' },
            { id: 'item5', label: 'Specialist recruitment started' },
            { id: 'item6', label: 'Initial Specialist base created' },
            { id: 'item7', label: 'Customer acquisition plan prepared' },
            { id: 'item8', label: 'Communication established' },
            { id: 'item9', label: 'Hub ready for first Leads' }
          ].map((chk) => (
            <button
              key={chk.id}
              onClick={() => toggleCheck(chk.id)}
              className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                checklist[chk.id]
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300 font-medium'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${checklist[chk.id] ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>{chk.label}</span>
            </button>
          ))}
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-400 flex items-center justify-between">
          <span>Numerical targets and quota requirements:</span>
          <span className="text-amber-400 font-bold">TBD — requires definition</span>
        </div>
      </div>

      {/* Practical Scenario — Module 6 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 6
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> You receive a regional territory containing one large central city, several smaller surrounding towns, significant geographic distances between them, and an uneven distribution of specialists. How should RP decide whether this should be one Hub or several Hubs?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Force the entire region into a single Hub to simplify administrative management.' },
            { id: 2, text: 'B) Evaluate geography, travel accessibility, specialist density, and TP capacity to divide into practical multiple Hubs (e.g. 1 urban Hub + 1–2 regional town Hubs) to ensure fast response times and local community management.' },
            { id: 3, text: 'C) Draw arbitrary straight administrative lines regardless of transport routes or specialist availability.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> RP tests operational reasoning by balancing geography, travel time, specialist density, and TP capacity rather than relying on rigid administrative maps or trying to force an entire vast area into one Hub.</span>
            ) : (
              <span><strong>Incorrect.</strong> Forcing large territories into a single Hub or using arbitrary lines creates unmanageable travel times and poor response quality for Customers and Specialists.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 7 CONTENT — SELECTING & ONBOARDING TP
   ========================================================================= */
function Module7Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Purpose of Module 7
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach RP how to identify people capable of becoming strong TPs. The RP is building a team, not filling vacancies.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4" /> Core Mindset
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Technical skills are useful, but <strong>attitude, reliability, initiative, and human communication</strong> are critical.
          </p>
        </div>
      </div>

      {/* 7.1 What RP Should Look For */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">7.1</span>
          <span>11 Essential TP Qualities</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
          {[
            '1. Reliability',
            '2. Communication',
            '3. Initiative',
            '4. Responsibility',
            '5. Independence',
            '6. Honesty',
            '7. Ability to learn',
            '8. Ability to work with people',
            '9. Ability to handle pressure',
            '10. Entrepreneurial thinking',
            '11. Willingness to help team'
          ].map((q, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7.2 The TP Interview */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">7.2</span>
          <span>Interview Focus Areas</span>
        </h3>

        <p className="text-xs text-slate-300">The interview should help RP evaluate key mindset factors:</p>

        <div className="grid md:grid-cols-2 gap-3 text-xs">
          {[
            'Why the person wants to become a TP',
            'What they expect from NordBase',
            'How they handle difficult or upset people',
            'How they make independent decisions under pressure',
            'How they react to mistakes and feedback',
            'Whether they can work independently without constant supervision',
            'Whether they understand that TP is an independent partner (not an employee)',
            'Whether they are comfortable communicating daily with Customers & Specialists'
          ].map((topic, i) => (
            <div key={i} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-300 flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{topic}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7.3 Red Flags */}
      <div className="bg-[#050A1A] border border-rose-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2 text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <span>7.3 Red Flags to Watch For</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          {[
            'Unrealistic income expectations',
            'Unwillingness to take personal responsibility',
            'Dishonesty or evasiveness during interview',
            'Disrespect or harsh attitude toward Customers/Specialists',
            'Inability or unwillingness to communicate clearly',
            'Excessive dependence on step-by-step instructions',
            'Unwillingness to learn or adapt to platform rules',
            'Focus only on immediate personal financial benefit'
          ].map((rf, i) => (
            <div key={i} className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl text-rose-200 flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{rf}</span>
            </div>
          ))}
        </div>

        <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-slate-300">
          <strong>Holistic Evaluation Principle:</strong> Do not automatically reject someone based on one imperfect answer. The RP should evaluate the whole person.
        </div>
      </div>

      {/* 7.4 Onboarding Steps */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">7.4</span>
          <span>8 Onboarding Steps & RP Readiness Confirmation</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            { step: '1', title: 'Agreement', note: 'Agreement with NordBase' },
            { step: '2', title: 'Business Reg.', note: 'TBD — requires definition' },
            { step: '3', title: 'Payment Setup', note: 'TBD — requires definition' },
            { step: '4', title: 'Workspace', note: 'Workspace preparation' },
            { step: '5', title: 'Academy', note: 'TP Academy completion' },
            { step: '6', title: 'Practical Training', note: 'Field/scenario practice' },
            { step: '7', title: 'RP Interview', note: 'RP confirmation check' },
            { step: '8', title: 'Start Work', note: 'Active Hub launch' }
          ].map((st) => (
            <div key={st.step} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">Step {st.step}</span>
              <span className="font-bold text-white block">{st.title}</span>
              <span className="text-[11px] text-slate-400 block">{st.note}</span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-cyan-950/30 border-l-4 border-l-cyan-400 border border-cyan-900/30 rounded-xl text-xs text-slate-200">
          <strong>RP Personal Responsibility:</strong> RP should personally know whether a TP is ready. Do not rely only on a completed Academy status.
        </div>
      </div>

      {/* Practical Scenario — Module 7 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 7
          </span>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
          <p><strong>Candidate A:</strong> Technically experienced, excellent CV, poor communication skills, prefers to work completely alone without interacting with other partners.</p>
          <p><strong>Candidate B:</strong> Less formal experience, excellent communication, responsible, learns quickly, strongly motivated to build a local community.</p>
          <p className="text-cyan-300 font-bold">Which candidate may be more suitable for TP, and why?</p>
        </div>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Candidate A — because technical experience and an impressive CV are always the most critical factors.' },
            { id: 2, text: 'B) Candidate B — because communication, responsibility, fast learning, and community mindset are essential for a TP, while technical procedures can easily be learned in the Academy.' },
            { id: 3, text: 'C) Reject both candidates immediately.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> Candidate B is more suitable. Technical rules can be taught, but attitude, communication, responsibility, and community motivation cannot be forced. Candidate A's poor communication and desire to isolate are red flags.</span>
            ) : (
              <span><strong>Incorrect.</strong> Technical CV details do not outweigh poor communication and unwillingness to collaborate in a community-driven platform like NordBase.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 8 CONTENT — KNOW YOUR TEAM
   ========================================================================= */
function Module8Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Core NordBase Principle
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>RP should personally know every TP in the region.</strong> This is relationship-building, not surveillance.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Video className="w-4 h-4" /> Personal Introduction Formats
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Before independent work begins, RP communicates directly via <strong>Video call</strong>, <strong>Phone call</strong>, or <strong>Face-to-face meeting</strong>.
          </p>
        </div>
      </div>

      {/* 8.1 What RP Should Understand */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">8.1</span>
          <span>What RP Should Understand About Each TP</span>
        </h3>

        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          {[
            { title: 'Who the TP is', desc: 'Background, values, and personal story.' },
            { title: 'Why they joined', desc: 'Core motivation and career goals with NordBase.' },
            { title: 'Strengths & Experience', desc: 'Previous background and natural abilities.' },
            { title: 'Communication Preference', desc: 'How they prefer to stay in touch.' },
            { title: 'Expectations & Support', desc: 'What help they anticipate needing from RP.' },
            { title: 'Problem-Solving Approach', desc: 'How they handle stress and conflicts.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-cyan-400 block">{item.title}</span>
              <p className="text-[11px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 8.2 The First Conversation */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">8.2</span>
          <span>First Conversation Agenda (8 Topics)</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            '1. Welcome to NordBase',
            '2. Explain RP–TP Relationship',
            '3. Explain How Hub Works',
            '4. Discuss Expectations',
            '5. Discuss Communication',
            '6. Discuss Teamwork',
            '7. Answer Questions',
            '8. Agree on First Steps'
          ].map((topic, i) => (
            <div key={i} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-300 font-medium">
              {topic}
            </div>
          ))}
        </div>
      </div>

      {/* 8.3 Trust Architecture */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">8.3</span>
          <span>Trust Architecture & Ongoing Relationship</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-2">
            <span className="text-emerald-400 font-bold block">✓ Correct Relationship Model:</span>
            <div className="p-2 bg-slate-950 rounded font-mono text-emerald-300 text-[11px] text-center font-bold">
              Know → Trust → Support → Monitor Results → Improve
            </div>
            <p className="text-slate-300 text-[11px]">
              RP remains accessible to help, but availability does not mean constant supervision or micromanagement.
            </p>
          </div>

          <div className="p-4 bg-rose-950/20 border border-rose-500/40 rounded-xl space-y-2">
            <span className="text-rose-400 font-bold block">✗ Anti-Pattern (Mistrust & Interference):</span>
            <div className="p-2 bg-slate-950 rounded font-mono text-rose-300 text-[11px] text-center font-bold">
              Control → Check → Interfere → Control again
            </div>
            <p className="text-slate-300 text-[11px]">
              Surveillance destroys partner trust, initiative, and independent decision-making.
            </p>
          </div>
        </div>
      </div>

      {/* Practical Scenario — Module 8 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 8
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> A TP is achieving strong personal operational metrics (good completed jobs), but completely ignores all other regional TPs, refuses to communicate in regional chats, and refuses to assist when a neighboring Hub faces an emergency workload spike. Should RP ignore this because the TP has good personal results?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Yes — personal metrics are the only thing that matters, so teamwork can be ignored.' },
            { id: 2, text: 'B) No — individual performance is important, but regional teamwork, mutual support, and information sharing are also core parts of the RP responsibility.' },
            { id: 3, text: 'C) Terminate the TP contract instantly without conversation.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> Individual numbers matter, but regional health depends on teamwork, information sharing, and mutual assistance. RP must guide the TP on the value of regional collaboration.</span>
            ) : (
              <span><strong>Incorrect.</strong> Ignoring non-cooperative behavior damages team morale and regional stability across Hubs.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 9 CONTENT — TP TRAINING
   ========================================================================= */
function Module9Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" /> Purpose of Module 9
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach RP how to turn an Academy graduate into a confident working TP. Completing TP Academy is necessary, but practical readiness must also be confirmed.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Workflow className="w-4 h-4" /> Training Method
          </span>
          <p className="text-xs font-mono text-emerald-300 font-bold">
            Explain → Demonstrate → Practice → Correct → Repeat → Test
          </p>
        </div>
      </div>

      {/* 9.1 The 7 Training Stages */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">9.1</span>
          <span>The 7 Practical Training Stages</span>
        </h3>

        <div className="space-y-2 text-xs">
          {[
            { stage: 'Stage 1 — Knowledge', text: 'Confirm TP understands NordBase, roles, terminology, workflow, responsibilities, and boundaries.' },
            { stage: 'Stage 2 — Dashboard', text: 'TP demonstrates required Dashboard functions in real-time.' },
            { stage: 'Stage 3 — Communication', text: 'Practice Customer phone calls, WhatsApp, NordBase Chat, and AI Translator.' },
            { stage: 'Stage 4 — Request Handling', text: 'Practice receiving Request, verification, clarification, and deciding whether it can become a Lead.' },
            { stage: 'Stage 5 — Specialist Selection', text: 'Practice identifying suitable Specialists, checking info, communicating, and offering Lead.' },
            { stage: 'Stage 6 — Job Monitoring', text: 'Practice accepted Lead, Customer–Specialist meeting, work progress, completion, and closure.' },
            { stage: 'Stage 7 — Difficult Situations', text: 'Practice changed requirements, Specialist refusal, no-shows, payment issues, conflicts, and suspicious Requests (Escalation limits: TBD — requires definition).' }
          ].map((stg, i) => (
            <div key={i} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3">
              <span className="px-2 py-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-[10px] shrink-0">
                {stg.stage}
              </span>
              <p className="text-slate-300 text-xs">{stg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 9.2 RP Observation & Final Practical Check */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">9.2</span>
          <span>RP Observation Factors & Final Practical Check</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {['Accuracy', 'Speed', 'Communication', 'Judgment', 'Calmness', 'Following procedure', 'Independent problem solving'].map((f, idx) => (
            <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-300 text-center font-medium">
              {f}
            </div>
          ))}
        </div>

        <div className="p-4 bg-cyan-950/30 border-l-4 border-l-cyan-400 border border-cyan-900/30 rounded-xl text-xs text-slate-200">
          <strong className="block text-cyan-300 mb-1">The Final Readiness Question RP Must Answer:</strong>
          "Would I trust this TP to handle a real Customer without me standing beside them?"
          <span className="block text-slate-400 text-[11px] mt-1">If NO: More practical training is required.</span>
        </div>
      </div>

      {/* Practical Scenario — Module 9 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 9
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> A candidate TP completed the TP Academy exam with 100% test scores, but becomes visibly confused and stumbles when trying to handle a live simulated Customer call during RP coaching. Should RP authorize independent work immediately because the Academy test is passed?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Yes — 100% test score automatically guarantees operational readiness.' },
            { id: 2, text: 'B) No — knowledge and practical operational readiness are different things. The TP requires further practical role-play coaching before taking real Customer calls.' },
            { id: 3, text: 'C) Disqualify the TP permanently.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> Theoretical knowledge and real-time operational execution are distinct. RP must ensure practical confidence before launching independent live work.</span>
            ) : (
              <span><strong>Incorrect.</strong> Passing written exams alone does not guarantee calm, effective customer communication during live field operations.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 10 CONTENT — PRACTICAL TP TRAINING & ROLE PLAY
   ========================================================================= */
function Module10Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  const [rpConfirmed, setRpConfirmed] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    c1: true,
    c2: true,
    c3: true,
    c4: true,
    c5: true,
    c6: true,
    c7: true,
    c8: true,
    c9: true,
    c10: true
  });

  const toggleCheck = (k: string) => {
    setChecklist(prev => ({ ...prev, [k]: !prev[k] }));
  };

  return (
    <div className="space-y-8">
      {/* Purpose & Environment */}
      <div className="bg-[#050A1A] border border-blue-900/30 p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white font-display">Purpose: Operational Confidence & Realistic Role-Plays</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Turn theoretical knowledge into real operational confidence through realistic training sessions based on actual NordBase operations. Mistakes should happen during training, not during real Customer interactions.
        </p>
      </div>

      {/* 10.1 The 10 Role-Plays */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">10.1</span>
          <span>10 Operational Role-Play Exercises</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-3 text-xs">
          {[
            { num: '1', title: 'Normal Customer', desc: 'RP acts as Customer. TP receives Request, processes verification, gathers info, prepares Lead.' },
            { num: '2', title: 'Difficult Customer', desc: 'Incomplete info, changing requirements, impatient questions. TP remains calm & professional.' },
            { num: '3', title: 'Specialist Selection', desc: 'Hypothetical Specialists with different skills, locations, availability. Choose best match (not automatically closest).' },
            { num: '4', title: 'Specialist Refusal', desc: 'Selected Specialist refuses Lead. TP follows established NordBase procedures.' },
            { num: '5', title: 'No-Show Specialist', desc: 'Specialist does not arrive. TP manages communication & follows procedure.' },
            { num: '6', title: 'Language Barrier', desc: 'Customer & Specialist speak different languages. TP demonstrates NordBase Chat + AI Translator.' },
            { num: '7', title: 'Customer Complaint', desc: 'Customer demands refund. TP applies platform vs commercial contract boundary rules.' },
            { num: '8', title: 'Suspicious Request', desc: 'Customer joking or providing fake info. TP applies verification protocol.' },
            { num: '9', title: 'Multiple Requests', desc: 'Simulated peak volume. TP demonstrates prioritization & organization (Priority rules: TBD — requires definition).' },
            { num: '10', title: 'TP-to-TP Support', desc: 'One TP faces a surge; another TP helps. Practice mutual support over competition.' }
          ].map((rp) => (
            <div key={rp.num} className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">Role-Play {rp.num}</span>
              <span className="font-bold text-white block">{rp.title}</span>
              <p className="text-[11px] text-slate-400 leading-snug">{rp.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 10.2 RP Evaluation & Group Exercise */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">10.2</span>
          <span>RP Feedback Protocol & "One Hub — One Team" Group Exercise</span>
        </h3>

        <div className="grid md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <span className="font-bold text-emerald-400 block">1. What was done well</span>
            <p className="text-slate-400 text-[11px]">Reinforce correct procedures and calm communication.</p>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <span className="font-bold text-amber-400 block">2. What needs improvement</span>
            <p className="text-slate-400 text-[11px]">Constructive coaching on errors without humiliation.</p>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <span className="font-bold text-cyan-400 block">3. What to practice again</span>
            <p className="text-slate-400 text-[11px]">Targeted repetition until execution is flawless.</p>
          </div>
        </div>

        <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-2 text-xs">
          <span className="text-cyan-300 font-bold block">PRACTICAL TEAM EXERCISE: "One Hub — One Team"</span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Several TPs simulate a busy operational period. They must coordinate tasks, share information, delegate where appropriate, support each other, and maintain high Customer quality without toxic competition.
          </p>
        </div>
      </div>

      {/* 10.3 Completion Requirements */}
      <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border-2 border-emerald-500/40 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">FINAL VERIFICATION</span>
            <h3 className="text-lg font-bold text-white font-display">TP Training Foundation Completed</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
            RP Readiness Audit
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          {[
            { id: 'c1', label: 'TP selected' },
            { id: 'c2', label: 'Personal RP introduction completed' },
            { id: 'c3', label: 'TP Academy completed' },
            { id: 'c4', label: 'Dashboard training completed' },
            { id: 'c5', label: 'Communication training completed' },
            { id: 'c6', label: 'Request / Lead training completed' },
            { id: 'c7', label: 'Specialist selection training completed' },
            { id: 'c8', label: 'Job workflow training completed' },
            { id: 'c9', label: 'Difficult situations practiced' },
            { id: 'c10', label: 'Role-play completed' }
          ].map((chk) => (
            <button
              key={chk.id}
              onClick={() => toggleCheck(chk.id)}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                checklist[chk.id]
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${checklist[chk.id] ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>{chk.label}</span>
            </button>
          ))}
        </div>

        {/* RP Confirmation Control */}
        <div className="p-4 bg-slate-950 border border-cyan-500/30 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">RP Confirmation of TP Practical Readiness</span>
              <span className="text-[11px] text-slate-400 block">Practical readiness cannot be automated — it requires explicit RP partner confirmation.</span>
            </div>

            <button
              onClick={() => setRpConfirmed(!rpConfirmed)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                rpConfirmed
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-cyan-400 border border-cyan-500/40 hover:bg-slate-700'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{rpConfirmed ? '✓ TP Readiness Confirmed by RP' : 'Confirm TP Practical Readiness'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 11 CONTENT — TEAMWORK & MUTUAL SUPPORT
   ========================================================================= */
function Module11Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Purpose of Module 11
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach the RP how to build a regional team where Territory Partners cooperate rather than compete destructively. TPs are independent partners in a regional community.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4" /> Core Principle
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Healthy competition is acceptable. Destructive competition is not.</strong> A TP should succeed without preventing another TP from succeeding.
          </p>
        </div>
      </div>

      {/* 11.1 Why Mutual Support Matters */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">11.1</span>
          <span>Why Mutual Support Matters in Daily Operations</span>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          Independent work does not mean working in complete isolation. Regional TPs frequently encounter operational challenges that require mutual aid:
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            { title: 'High Workload', desc: 'Temporary spikes in Request volume in a single Hub.' },
            { title: 'Unavailable Specialists', desc: 'Local Specialist shortage for a specific trade or time slot.' },
            { title: 'Unfamiliar Situations', desc: 'Rare or complex Customer Requests needing advice.' },
            { title: 'Language Problems', desc: 'Customer/Specialist language barriers requiring translation help.' },
            { title: 'Technical Issues', desc: 'Temporary connection or mobile equipment constraints.' },
            { title: 'Temporary Absence', desc: 'TP illness or personal emergency coverage.' },
            { title: 'Difficult Customers', desc: 'Complex negotiations requiring peer coaching.' },
            { title: 'Unusual Requests', desc: 'Cross-territory field logistics coordination.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-cyan-400 block">{item.title}</span>
              <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 11.2 What RP Should Build vs Avoid */}
      <div className="grid md:grid-cols-2 gap-4 text-xs">
        <div className="bg-[#050A1A] border border-emerald-900/30 rounded-2xl p-6 space-y-3">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> What RP Should Encourage
          </span>
          <div className="space-y-2">
            {[
              'Open communication across neighboring Hubs',
              'Sharing useful local information & Specialist leads',
              'Practical help during operational overloads',
              'Regular exchange of experience and lessons learned',
              'Mutual respect and transparent problem-solving',
              'Shared responsibility for regional reputation'
            ].map((text, i) => (
              <div key={i} className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#050A1A] border border-rose-900/30 rounded-2xl p-6 space-y-3">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
            <UserX className="w-4 h-4" /> What RP Should Avoid
          </span>
          <div className="space-y-2">
            {[
              'Unnecessary corporate hierarchy or top-down commands',
              'Favoritism or subjective preferential treatment',
              'Hidden competition or backchannel deal-making',
              'Information hoarding among individual TPs',
              'Over-dependence on RP for routine daily choices',
              'Destructive conflicts over individual Lead distribution'
            ].map((text, i) => (
              <div key={i} className="p-2.5 bg-rose-950/20 border border-rose-500/20 rounded-xl text-rose-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 11.3 Fairness & Objective Rules */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">11.3</span>
          <span>Fairness & Objective Lead Rules</span>
        </h3>

        <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-slate-200 leading-relaxed space-y-2">
          <p>
            RP must be perceived as completely fair by all TPs in the region. Perceived unfairness destroys partner motivation faster than operational difficulties.
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-slate-300 pt-2 font-mono text-[11px]">
            <div className="p-2 bg-slate-950 rounded border border-slate-800">✓ No advantages to personal friends</div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">✓ No hiding information from team</div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">✓ No manipulating Lead distribution</div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">✓ Follow objective NordBase rules</div>
          </div>
        </div>
      </div>

      {/* Practical Scenario — Module 11 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 11
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> Two TPs work in neighboring Hubs. Hub A experiences an unexpected surge in plumbing Requests during a severe cold spell and cannot process them quickly. Hub B has available capacity and verified plumbers willing to assist. How should they cooperate without destroying independence?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) TP A should reject all excess Customer Requests to protect his Hub boundary.' },
            { id: 2, text: 'B) TP A and TP B coordinate transparently under RP guidance: TP A transfers overflow Requests to TP B using platform rules, ensuring fast Customer service while keeping clear logging and respecting each partner’s independent territory account.' },
            { id: 3, text: 'C) RP personally takes over all Customer calls and bypasses both TPs.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> Transparent workload coordination maintains speed for Customers, utilizes available capacity, and preserves both TPs' independent partner relationship under standard platform rules.</span>
            ) : (
              <span><strong>Incorrect.</strong> Rejecting Customers harms the brand, while RP taking over eliminates TP responsibility.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 12 CONTENT — TEAM BUILDING THROUGH LOCAL MISSIONS
   ========================================================================= */
function Module12Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  const [actionList, setActionList] = useState([
    { id: 1, action: 'Map high-density commercial centers in Hub 1', responsible: 'TP Alex', result: 'List of 15 potential local partners', deadline: 'Day 3 of Seeding' },
    { id: 2, action: 'Distribute NordBase brochures to hardware stores', responsible: 'TP Sarah', result: '10 store display points established', deadline: 'Day 5 of Seeding' }
  ]);
  const [newAction, setNewAction] = useState('');
  const [newResp, setNewResp] = useState('');
  const [newResult, setNewResult] = useState('');

  const addAction = () => {
    if (!newAction || !newResp) return;
    setActionList(prev => [
      ...prev,
      {
        id: Date.now(),
        action: newAction,
        responsible: newResp,
        result: newResult || 'Identified local opportunity',
        deadline: 'TBD — local launch schedule'
      }
    ]);
    setNewAction('');
    setNewResp('');
    setNewResult('');
  };

  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Purpose of Module 12
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Create a practical team-building format that produces real business value. Team building should not be an artificial corporate activity — it must help the team understand its territory.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Two Goals of a Local Mission
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>1. Team:</strong> TPs communicate and build trust. <strong>2. Business:</strong> The team gathers real field data to develop the local market.
          </p>
        </div>
      </div>

      {/* 12.1 The 4-Part Local Mission Format */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">12.1</span>
          <span>The 4-Part Local Mission Format</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            {
              part: 'Part 1',
              title: 'Preparation',
              desc: 'RP explains objectives, designated territory boundaries, specific field tasks, printed brochures, and team communication rules.'
            },
            {
              part: 'Part 2',
              title: 'Field Mission',
              desc: 'TPs work together in pairs across the local area: visit trade stores, talk to local tradespeople, identify acquisition points.'
            },
            {
              part: 'Part 3',
              title: 'Review & Debrief',
              desc: 'Return to workspace and log findings: prospective Specialists discovered, Customer traffic points, local bottlenecks.'
            },
            {
              part: 'Part 4',
              title: 'Shared Meal',
              desc: 'Informal lunch or dinner for team bonding and personal relationship building — not a rigid corporate ceremony.'
            }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">{item.part}</span>
              <span className="font-bold text-white block">{item.title}</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 12.2 Practical Brainstorming Session */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">12.2</span>
          <span>Post-Mission Brainstorming Session (6 Core Questions)</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { q: '1. Specialist Base', text: 'How do we find and recruit the most reliable local Specialists?' },
            { q: '2. First Customers', text: 'Where and how do we find our very first Customer Requests?' },
            { q: '3. Priority Categories', text: 'Which local service categories have the highest immediate demand?' },
            { q: '4. Local Channels', text: 'Where are local Customers already communicating (groups, forums)?' },
            { q: '5. Business Partners', text: 'Which local businesses (hardware, suppliers) could become partners?' },
            { q: '6. Competitive Advantage', text: 'What value can we offer that traditional competitors do not?' }
          ].map((b, idx) => (
            <div key={idx} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs font-bold text-cyan-400 block">{b.q}</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300">
          <strong>Evaluation Rule:</strong> Record all useful ideas during brainstorming, but evaluate feasibility before implementation. Do not implement unverified ideas automatically.
        </div>
      </div>

      {/* 12.3 Practical Task — Local Launch Action List */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">12.3</span>
            <span>Practical Task: Local Launch Action List</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400">Action Plan Generator</span>
        </div>

        <p className="text-xs text-slate-300">
          Convert mission insights into concrete action items with clear ownership and realistic deadlines.
        </p>

        {/* Action List Table */}
        <div className="space-y-2 text-xs">
          {actionList.map(item => (
            <div key={item.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Action</span>
                <span className="font-medium text-white">{item.action}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Responsible</span>
                <span className="text-cyan-400 font-medium">{item.responsible}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Expected Result</span>
                <span className="text-slate-300">{item.result}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Deadline</span>
                <span className="text-emerald-400 font-mono text-[11px]">{item.deadline}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Action Controls */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
          <span className="font-bold text-white block">Add Action Item to Local Launch List</span>
          <div className="grid sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Action description..."
              value={newAction}
              onChange={e => setNewAction(e.target.value)}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              placeholder="Responsible TP / RP..."
              value={newResp}
              onChange={e => setNewResp(e.target.value)}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              placeholder="Expected result..."
              value={newResult}
              onChange={e => setNewResult(e.target.value)}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={addAction}
            className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-lg hover:bg-cyan-400 transition-all cursor-pointer text-xs"
          >
            + Add Action Item
          </button>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 font-mono">
          Note: Mandatory numerical quota targets: <strong>TBD — requires definition</strong>. Focus on qualitative task execution.
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 13 CONTENT — REGIONAL LAUNCH STRATEGY
   ========================================================================= */
function Module13Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Rocket className="w-4 h-4" /> Purpose of Module 13
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach RP how to transform a geographic territory into an operating NordBase region through a structured, phased launch approach.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Workflow className="w-4 h-4" /> Core Launch Sequence
          </span>
          <p className="text-xs font-mono text-emerald-300 font-bold leading-relaxed">
            Structure → People → Specialists → Customers → Leads → Jobs → Stability
          </p>
        </div>
      </div>

      {/* 13.1 The 6 Launch Phases */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">13.1</span>
          <span>The 6 Phased Launch Steps</span>
        </h3>

        <div className="space-y-2 text-xs">
          {[
            { phase: 'Phase 1', title: 'Territory Confirmation', desc: 'RP confirms regional scope, Hub divisions, operational boundaries, and initial TP capacity requirements.' },
            { phase: 'Phase 2', title: 'Team Building & Training', desc: 'RP selects TPs, conducts personal introductory meetings, guides through Academy & role-plays, establishes communication channels.' },
            { phase: 'Phase 3', title: 'Specialist Base Creation', desc: 'RP & TP team build initial pool of verified local Specialists across priority service categories.' },
            { phase: 'Phase 4', title: 'Customer Acquisition Launch', desc: 'Initiate targeted local Customer outreach, community posts, partner flyers, and local social media campaigns.' },
            { phase: 'Phase 5', title: 'First Work Execution', desc: 'Receive initial Requests, verify Customer needs, issue first Leads, and monitor initial active Jobs to completion.' },
            { phase: 'Phase 6', title: 'Stabilization & Optimization', desc: 'Identify operational bottlenecks, strengthen weak categories/Hubs, refine local acquisition, and stabilize workflows.' }
          ].map((p, i) => (
            <div key={i} className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-[10px] shrink-0">
                {p.phase}
              </span>
              <div>
                <span className="font-bold text-white block">{p.title}</span>
                <p className="text-slate-400 text-xs mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 13.2 RP Launch Plan Checklist */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">13.2</span>
          <span>Components of an Operational RP Launch Plan</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            '1. Hub Boundaries',
            '2. TP Onboarding & Roles',
            '3. Specialist Acquisition',
            '4. Customer Outreach Plan',
            '5. Local SMM Cooperation',
            '6. Field Mission Schedule',
            '7. Practical Role-Plays',
            '8. Operational Readiness Check'
          ].map((c, idx) => (
            <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{c}</span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-cyan-950/30 border-l-4 border-l-cyan-400 border border-cyan-900/30 rounded-xl text-xs text-slate-200">
          <strong>Important Launch Principle:</strong> Do not wait for conditions to be 100% perfect before launching. Preparation is essential, but real-world execution reveals practical issues that theory alone can never uncover.
        </div>
      </div>

      {/* Practical Scenario — Module 13 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 13
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> An RP wants to wait 3 extra months before processing any Customer Requests until every single trade category in all Hubs has at least 50 verified Specialists. Is this the recommended launch approach?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Yes — launching without complete perfection in all categories is unacceptable.' },
            { id: 2, text: 'B) No — RP should build the core foundation first, launch active categories in ready Hubs, process real early Jobs, and expand Specialist coverage iteratively based on real field demand.' },
            { id: 3, text: 'C) Abandon the launch entirely.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> Launching ready categories generates real momentum, tests workflows, and provides valuable feedback to strengthen weaker categories progressively.</span>
            ) : (
              <span><strong>Incorrect.</strong> Endless delays for theoretical perfection stall regional growth and demotivate partners.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 14 CONTENT — THE SEEDING MONTH
   ========================================================================= */
function Module14Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Purpose of Module 14
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            The <strong>Seeding Month</strong> is the initial 4-week launch period of a new region. The goal is to establish stable operational foundations across all Hubs.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Daily RP Question
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-emerald-300">"What is stopping this region from moving to the next stage?"</strong> RP must identify and eliminate the single biggest constraint daily.
          </p>
        </div>
      </div>

      {/* 14.1 Week-by-Week Operational Sequence */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">14.1</span>
          <span>Seeding Month: 4-Week Execution Breakdown</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            {
              week: 'Week 1',
              title: 'PREPARE',
              color: 'text-cyan-400 border-cyan-500/30',
              tasks: ['Confirm Hub boundaries & TPs', 'Personal RP meetings & coaching', 'Setup workspace & channels', 'Initial local market research']
            },
            {
              week: 'Week 2',
              title: 'BUILD',
              color: 'text-blue-400 border-blue-500/30',
              tasks: ['Specialist recruitment drive', 'Local mission & field visits', 'Initial Customer outreach points', 'SMM coordination & flyers']
            },
            {
              week: 'Week 3',
              title: 'ACTIVATE',
              color: 'text-amber-400 border-amber-500/30',
              tasks: ['Receive first Customer Requests', 'Verify needs & generate Leads', 'Specialist matching & acceptance', 'First active Jobs & rapid fixes']
            },
            {
              week: 'Week 4',
              title: 'STABILIZE',
              color: 'text-emerald-400 border-emerald-500/30',
              tasks: ['Review operational results', 'Identify weak Hubs/processes', 'Strengthen Specialist supply', 'Prepare next month launch plan']
            }
          ].map((w, idx) => (
            <div key={idx} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono font-bold text-[11px] text-slate-400">{w.week}</span>
                <span className={`px-2 py-0.5 rounded bg-slate-950 font-mono font-bold text-[10px] border ${w.color}`}>
                  {w.title}
                </span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-300">
                {w.tasks.map((t, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 14.2 Seeding Month Visual Board */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">14.2</span>
            <span>Seeding Month Progress Board</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400">Regional Tracking Board</span>
        </div>

        <p className="text-xs text-slate-300">
          Track core launch pillars visually across Hubs during the Seeding Month:
        </p>

        <div className="grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-9 gap-2 text-xs font-mono">
          {[
            { col: 'Hubs', status: 'Active (3)', color: 'text-cyan-400' },
            { col: 'TPs', status: 'Onboarded (4)', color: 'text-cyan-400' },
            { col: 'Specialists', status: 'Building Base', color: 'text-blue-400' },
            { col: 'Customers', status: 'Outreach Active', color: 'text-blue-400' },
            { col: 'Leads', status: 'Initial Stage', color: 'text-amber-400' },
            { col: 'Jobs', status: 'First Works', color: 'text-amber-400' },
            { col: 'Marketing', status: 'SMM Sync', color: 'text-emerald-400' },
            { col: 'Problems', status: 'Tracked (0)', color: 'text-rose-400' },
            { col: 'Actions', status: 'In Progress', color: 'text-emerald-400' }
          ].map((item, idx) => (
            <div key={idx} className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-center space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">{item.col}</span>
              <span className={`font-bold text-[11px] block ${item.color}`}>{item.status}</span>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 font-mono">
          Note: Exact numerical target numbers: <strong>TBD — requires definition</strong>. Evaluate performance through functional milestone completion.
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 15 CONTENT — BUILDING THE SPECIALIST BASE
   ========================================================================= */
function Module15Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Purpose of Module 15
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach RP how to create the initial supply of Specialists in every Hub. Without Specialists, Customer Requests cannot be served.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Recruitment Principle
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Do not collect phone numbers blindly. Build a pool of: <strong className="text-emerald-300">real → relevant → available → verified Specialists</strong>. Quality over quantity.
          </p>
        </div>
      </div>

      {/* 15.1 Recruitment Channels */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">15.1</span>
          <span>Where to Find Local Specialists</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            'Local trade businesses & supply stores',
            'Independent licensed professionals',
            'Local community groups & forums',
            'Professional trade associations',
            'Peer referrals from verified tradespeople',
            'Offline visits during Local Missions',
            'Targeted local trade advertising',
            'Existing local professional networks'
          ].map((channel, i) => (
            <div key={i} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{channel}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 15.2 Category Balance & Verification Reference */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">15.2</span>
          <span>Category Coverage & Verification Reference</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <span className="text-cyan-400 font-bold block">Building by Actual NordBase Categories:</span>
            <p className="text-slate-300 leading-relaxed">
              RP must map actual categories defined by NordBase. Identify which categories are strong, which are missing, and which Hubs have weak coverage.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <span className="text-cyan-400 font-bold block">Verification Procedure Reference:</span>
            <p className="text-slate-300 leading-relaxed">
              Verification rules are defined by standard NordBase operational rules. RP & TP follow official verification guidelines before assigning Leads.
            </p>
          </div>
        </div>
      </div>

      {/* 15.3 Practical Task — Hub Specialist Acquisition Plan */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">15.3</span>
          <span>Practical Task: Hub Specialist Plan</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { title: '1. Priority Categories', desc: 'Identify top 3 local trade categories needed immediately.' },
            { title: '2. Recruitment Channels', desc: 'Select 2-3 offline & online channels for the specific Hub.' },
            { title: '3. Responsible TP', desc: 'Assign lead TP responsible for specialist interviews.' },
            { title: '4. First Actions', desc: 'Schedule field visits and trade store contacts.' },
            { title: '5. Follow-Up Schedule', desc: 'Set review timeline for verification completion.' },
            { title: '6. Verification Audit', desc: 'Confirm verified status in system before Lead dispatch.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-cyan-400 block">{item.title}</span>
              <p className="text-slate-300 text-[11px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 16 CONTENT — CUSTOMER ACQUISITION
   ========================================================================= */
function Module16Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Megaphone className="w-4 h-4" /> Purpose of Module 16
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach RP how to create initial local Customer demand. Specialists create supply; Customers create demand. The region needs both.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" /> Core Value Proposition
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            "The Customer describes the problem. NordBase helps find a suitable verified Specialist with the support of a local Partner."
          </p>
        </div>
      </div>

      {/* 16.1 Active Acquisition & Channels */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">16.1</span>
          <span>Active Acquisition Channels & Local TP Knowledge</span>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          Do not wait for Customers to discover NordBase automatically. Local TPs live in the territory and know where local demand originates:
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            'Local community groups & forums',
            'Targeted local social media posts',
            'Local business associations',
            'Word-of-mouth & referral networks',
            'Offline flyers & brochures',
            'Local business partnerships',
            'Community event sponsorships',
            'Coordinated local SMM campaigns'
          ].map((ch, i) => (
            <div key={i} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{ch}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 16.2 Learning from First Customers */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">16.2</span>
          <span>Learning from Early Customer Requests</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            { title: 'Requested Services', desc: 'Which specific trade categories have real immediate demand.' },
            { title: 'Information Quality', desc: 'What details Customers provide and what needs clarification.' },
            { title: 'Source Attribution', desc: 'Where Customers learned about NordBase.' },
            { title: 'Process Friction', desc: 'Where Customer communication experiences delays.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-cyan-400 block">{item.title}</span>
              <p className="text-[11px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 16.3 Practical Task — Hub Customer Acquisition Plan */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">16.3</span>
          <span>Practical Task: Hub Customer Acquisition Plan</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { title: 'Target Audience', desc: 'Homeowners, property managers, local small businesses.' },
            { title: 'Service Categories', desc: 'Priority local categories with verified Specialist coverage.' },
            { title: 'Acquisition Channels', desc: 'Specific local groups, partner stores, offline material.' },
            { title: 'Core Message', desc: 'Simple NordBase value proposition.' },
            { title: 'Responsible Person', desc: 'Assigned TP overseeing local outreach.' },
            { title: 'Measurement Method', desc: 'Track incoming Request source during verification call.' }
          ].map((p, idx) => (
            <div key={idx} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-cyan-400 block">{p.title}</span>
              <p className="text-slate-300 text-[11px]">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 17 CONTENT — SMM & LOCAL MARKETING
   ========================================================================= */
function Module17Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    chk1: true,
    chk2: true,
    chk3: true,
    chk4: true,
    chk5: true,
    chk6: false,
    chk7: false,
    chk8: false,
    chk9: false,
    chk10: false
  });

  const toggleCheck = (k: string) => {
    setChecklist(prev => ({ ...prev, [k]: !prev[k] }));
  };

  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Share2 className="w-4 h-4" /> Purpose of Module 17
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach RP how to collaborate effectively with SMM / marketing functions without trying to become an SMM specialist.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Division of Responsibility
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>RP:</strong> Knows territory. <strong>TP:</strong> Knows local community. <strong>SMM:</strong> Handles marketing, content & production.
          </p>
        </div>
      </div>

      {/* 17.1 RP vs SMM Responsibilities */}
      <div className="grid md:grid-cols-2 gap-4 text-xs">
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <span className="font-bold text-cyan-400 block uppercase font-mono text-[11px]">RP & TP Responsibilities</span>
          <div className="space-y-2">
            {[
              'Provide real local stories & customer questions',
              'Share observations on service demand spikes',
              'Highlight successful local Jobs & Specialist profiles',
              'Distribute physical materials (brochures, business cards)',
              'Report what marketing messages work best in the field'
            ].map((r, i) => (
              <div key={i} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <span className="font-bold text-emerald-400 block uppercase font-mono text-[11px]">SMM Function Responsibilities</span>
          <div className="space-y-2">
            {[
              'Content production & graphic material design',
              'Targeted digital campaign management',
              'Official social media page management',
              'Creative promotional material preparation',
              'Digital marketing analytics & performance tracking'
            ].map((s, i) => (
              <div key={i} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 17.2 Feedback Loop & Local Experiments */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">17.2</span>
          <span>Marketing Feedback Loop & Controlled Experiments</span>
        </h3>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
          <span className="text-cyan-300 font-bold block font-mono text-[11px]">THE REGIONAL MARKETING FEEDBACK LOOP:</span>
          <div className="p-3 bg-slate-950 rounded-xl font-mono text-cyan-400 text-[11px] text-center font-bold">
            Local Activity → Customer Results → RP Field Feedback → SMM Content Adjustment → New Activity
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed pt-1">
            Conduct controlled local experiments (e.g. testing two localized messages in neighboring towns). Keep what generates real Customer Requests and stop ineffective promotions.
          </p>
        </div>
      </div>

      {/* 17.3 Final Practical Assignment — Modules 11–17 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">FINAL PRACTICAL ASSIGNMENT</span>
            <h3 className="text-lg font-bold text-white font-display">Hub Preliminary Launch Plan</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
            Modules 11–17 Capstone
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The RP must prepare a comprehensive preliminary launch plan for 1 designated Hub covering 5 core operational areas:
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
          {[
            { title: '1. Team Structure', desc: 'Assigned TP, communication setup, mutual support rules.' },
            { title: '2. Specialist Base', desc: 'Priority categories, recruitment channels, verification protocol.' },
            { title: '3. Customer Acquisition', desc: 'Target audience, local channels, simple value message.' },
            { title: '4. Local Marketing', desc: 'SMM cooperation, offline materials, Local Mission schedule.' },
            { title: '5. Seeding Month', desc: 'First month activities, weekly priorities, operational milestones.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-cyan-400 block">{item.title}</span>
              <p className="text-slate-400 text-[11px]">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span><strong>Assessment Workflow Notice:</strong> The preliminary launch plan must be reviewed by RP / Admin according to the Academy assessment workflow.</span>
        </div>
      </div>

      {/* 17.4 Completion Requirements Checklist */}
      <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border-2 border-emerald-500/40 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">ACADEMY STATUS</span>
            <h3 className="text-lg font-bold text-white font-display">Regional Launch Preparation Completed</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
            Modules 11–17 Checklist
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          {[
            { id: 'chk1', label: 'Teamwork principles understood' },
            { id: 'chk2', label: 'Mutual support model understood' },
            { id: 'chk3', label: 'Local Mission completed' },
            { id: 'chk4', label: 'Brainstorming session completed' },
            { id: 'chk5', label: 'Hub launch plan created' },
            { id: 'chk6', label: 'Seeding Month understood' },
            { id: 'chk7', label: 'Specialist acquisition plan created' },
            { id: 'chk8', label: 'Customer acquisition plan created' },
            { id: 'chk9', label: 'SMM cooperation understood' },
            { id: 'chk10', label: 'Preliminary local launch plan completed' }
          ].map((chk) => (
            <button
              key={chk.id}
              onClick={() => toggleCheck(chk.id)}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                checklist[chk.id]
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${checklist[chk.id] ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>{chk.label}</span>
            </button>
          ))}
        </div>

        {/* Assessment Status Notice */}
        <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-white block">Final Practical Task Assessment</span>
            <span className="text-amber-400 font-mono text-[11px] block">Requires RP / Admin confirmation</span>
          </div>
          <span className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg font-mono text-xs font-bold">
            Pending RP / Admin Confirmation
          </span>
        </div>

        {/* End Status Display */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">RP ACADEMY STATUS</span>
            <span className="text-emerald-400 font-bold text-sm">RP Academy — Modules 0–24</span>
          </div>
          <div className="text-right">
            <span className="text-cyan-400 font-bold text-sm block">17 / 24 Modules Completed</span>
            <span className="text-slate-400 text-[10px] block">Next module: Module 18 — First Leads & First Jobs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 18 CONTENT — FIRST LEADS & FIRST JOBS
   ========================================================================= */
function Module18Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Rocket className="w-4 h-4" /> Purpose of Module 18
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach RP how to manage the most critical transition: <strong>From preparation to real NordBase work.</strong> The first Leads and Jobs reveal how the regional system operates in reality.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> RP's Observation Role
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Monitor the first operational period closely <strong>without taking over the work of TP</strong>. Observe workflows, identify friction, and coach TPs on real operational execution.
          </p>
        </div>
      </div>

      {/* 18.1 What RP Monitors During First Operational Phase */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">18.1</span>
          <span>10 Operational Elements RP Must Observe</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          {[
            { title: '1. Request Quality', desc: 'Are incoming Customer Requests complete and clear?' },
            { title: '2. Verification Speed', desc: 'Do TPs verify Requests promptly and accurately?' },
            { title: '3. Lead Quality', desc: 'Do generated Leads contain necessary technical details?' },
            { title: '4. Specialist Selection', desc: 'Are Leads matched to qualified verified Specialists?' },
            { title: '5. Communication', desc: 'Is communication respectful, clear, and professional?' },
            { title: '6. Customer Experience', desc: 'Does the Customer feel supported throughout?' },
            { title: '7. Specialist Experience', desc: 'Does the Specialist receive accurate Job parameters?' },
            { title: '8. Job Progress', desc: 'Are active Jobs tracked smoothly through completion?' },
            { title: '9. Work Completion', desc: 'Are completed Jobs closed cleanly in the system?' },
            { title: '10. Problem Resolution', desc: 'Are early bottlenecks identified and corrected?' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-cyan-400 block text-[11px]">{item.title}</span>
              <p className="text-[10px] text-slate-400 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 18.2 First Lead & First Job Complete Lifecycle */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">18.2</span>
          <span>First Lead & First Job Complete Lifecycle</span>
        </h3>

        {/* Lead Evaluation Questions */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
          <span className="font-bold text-white block font-mono text-[11px] uppercase tracking-wider text-cyan-400">
            First Lead Diagnostic Questions (5 Keys):
          </span>
          <div className="grid sm:grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
            <div className="p-2 bg-slate-950 rounded border border-slate-800">1. Is the Request genuine?</div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">2. Is enough information available?</div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">3. Is the Lead suitable for a Specialist?</div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">4. Is the correct Specialist selected?</div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800 sm:col-span-2">5. Does the Lead contain all parameters the Specialist needs?</div>
          </div>
        </div>

        {/* First Job Lifecycle Diagram */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
          <span className="font-bold text-white block">Complete Job Lifecycle Sequence (Uses Existing TP Procedures):</span>
          <div className="flex flex-wrap items-center justify-between gap-2 text-center text-[11px] font-mono">
            {['Lead Generated', 'Specialist Accepts', 'Customer & Specialist Contact', 'On-Site Meeting', 'Work Executed', 'Completion & Closure'].map((step, i) => (
              <React.Fragment key={i}>
                <div className="p-2.5 bg-slate-900 border border-cyan-500/30 text-cyan-300 rounded-lg flex-1 min-w-[110px]">
                  {i + 1}. {step}
                </div>
                {i < 5 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden md:block" />}
              </React.Fragment>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Note: RP relies on existing TP Academy procedures for operational execution. Do not create duplicated or conflicting workflow rules.
          </p>
        </div>
      </div>

      {/* 18.3 Early Problems as Learning Opportunities */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">18.3</span>
          <span>Root Cause Analysis Framework</span>
        </h3>

        <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200 leading-relaxed space-y-1">
          <strong>Learning Mindset:</strong> The objective is not to pretend that everything is perfect. The objective is to:
          <span className="font-mono text-cyan-300 font-bold block pt-1">Observe → Identify → Correct → Learn → Improve</span>
        </div>

        <p className="text-xs text-slate-300">
          When an early operational problem occurs, RP must ask the 8 diagnostic questions before taking action:
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
          {[
            '1. What happened?',
            '2. Why did it happen?',
            '3. Was it a people problem?',
            '4. Was it a process problem?',
            '5. Communication problem?',
            '6. Training problem?',
            '7. System problem?',
            '8. Customer / Specialist issue?'
          ].map((q, i) => (
            <div key={i} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-300">
              {q}
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-300">
          <strong>Key Rule:</strong> Do not immediately blame people. Find the underlying root cause and fix the workflow or training gap.
        </div>
      </div>

      {/* Practical Scenario — Module 18 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 18
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> The first Lead in a new Hub is accepted by a Specialist, but the Specialist later complains that the Lead information was insufficient to perform the work. What should RP investigate before deciding who is responsible?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Immediately blame and fine the TP who verified the Lead.' },
            { id: 2, text: 'B) Investigate the full chain: What information did the Customer provide? Did TP ask proper verification questions? Did the Specialist read the full description before accepting? Was there a technical truncation? Identify root cause to improve verification training rather than assign personal blame.' },
            { id: 3, text: 'C) Immediately deactivate the Specialist account without investigation.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> Investigating the entire information flow pinpoints whether the issue was a Customer input gap, TP verification training gap, or Specialist oversight, allowing RP to fix the root cause.</span>
            ) : (
              <span><strong>Incorrect.</strong> Immediately blaming individuals destroys trust and fails to solve the systemic operational problem.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 19 CONTENT — MOVING TO STABLE OPERATIONS
   ========================================================================= */
function Module19Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    chk1: true,
    chk2: true,
    chk3: true,
    chk4: true,
    chk5: false,
    chk6: false,
    chk7: false,
    chk8: false,
    chk9: false
  });

  const toggleItem = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Activity className="w-4 h-4" /> Purpose of Module 19
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach RP how to move from launch mode to a stable regional operation. The desired progression is: <strong className="text-cyan-300">Launch → Growth → Stable Plateau</strong>.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" /> RP Mindset Shift
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            During launch: <strong>RP provides energy (doing)</strong>. During stabilization: <strong>RP builds systems and team independence (coordinating → improving → developing)</strong>.
          </p>
        </div>
      </div>

      {/* 19.1 What Is a Stable Plateau? */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">19.1</span>
          <span>Characteristics of a Stable Regional Plateau</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            { title: 'Consistent Hubs', desc: 'All regional Hubs operate with predictable daily workflows.' },
            { title: 'Autonomous TPs', desc: 'TPs fully understand their roles and handle routine decisions.' },
            { title: 'Available Specialists', desc: 'Specialist Base is verified, active, and available across key trades.' },
            { title: 'Steady Customers', desc: 'Customer Requests arrive consistently through established channels.' },
            { title: 'Reliable Leads', desc: 'Leads are verified, processed, and matched promptly.' },
            { title: 'Completed Jobs', desc: 'Jobs are executed and closed with high Customer satisfaction.' },
            { title: 'Manageable Problems', desc: 'Operational issues are resolved through standard procedures.' },
            { title: 'System Autonomy', desc: 'Region no longer depends on constant emergency RP intervention.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-cyan-400 block">{item.title}</span>
              <p className="text-[11px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 font-mono">
          Note: Specific numerical KPI target numbers: <strong>TBD — requires definition</strong>. Focus on qualitative operational stability.
        </div>
      </div>

      {/* 19.2 Warning Signs of Over-Intervention */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs font-mono font-bold">19.2</span>
          <span>Warning Signs: RP Over-Intervention Risk</span>
        </h3>

        <p className="text-xs text-slate-300">
          If RP is personally processing most routine operational work long after launch, the system is failing. Identify the true cause:
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
          {[
            { cause: '1. TP Training Problem', text: 'TP lacks operational confidence due to incomplete Academy coaching.' },
            { cause: '2. Weak TP Selection', text: 'TP candidate lacks necessary communication or organizational skills.' },
            { cause: '3. Poor Local Processes', text: 'Clear verification or dispatch rules have not been agreed upon.' },
            { cause: '4. Insufficient Staffing', text: 'Hub workload exceeds current TP capacity.' },
            { cause: '5. Unclear Responsibilities', text: 'TP expects RP to make all decisions.' },
            { cause: '6. Excessive RP Intervention', text: 'RP micromanages and steals TP operational tasks.' }
          ].map((item, i) => (
            <div key={i} className="p-3 bg-slate-900/80 border border-rose-900/30 rounded-xl space-y-1">
              <span className="font-bold text-rose-400 block text-[11px]">{item.cause}</span>
              <p className="text-[11px] text-slate-300 leading-snug">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 19.3 Regional Stability Checklist */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">19.3</span>
            <span>Interactive Regional Stability Checklist</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400 font-bold">{completedCount} / 9 Criteria Satisfied</span>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { id: 'chk1', label: 'Hubs operate consistently across assigned territories' },
            { id: 'chk2', label: 'TPs work independently without constant RP supervision' },
            { id: 'chk3', label: 'Specialist Base is active, verified, and covering core categories' },
            { id: 'chk4', label: 'Customers continue arriving through stable local channels' },
            { id: 'chk5', label: 'Leads are verified and processed reliably' },
            { id: 'chk6', label: 'Jobs are completed and closed with high satisfaction' },
            { id: 'chk7', label: 'Problems are resolved through standard escalation procedures' },
            { id: 'chk8', label: 'Team communication works smoothly across Hubs' },
            { id: 'chk9', label: 'RP is no longer required for every routine decision' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                checklist[item.id]
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <span className="font-medium text-xs">☐ {item.label}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${checklist[item.id] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                {checklist[item.id] ? 'VERIFIED' : 'PENDING'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 20 CONTENT — REGIONAL KPI & PERFORMANCE
   ========================================================================= */
function Module20Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  const [selectedCase, setSelectedCase] = useState<'A' | 'B' | 'C'>('A');

  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4" /> Purpose of Module 20
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach RP how to understand the health of a region through data. <strong>Numbers are tools for understanding reality — they are not the purpose of the business.</strong>
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Quality Over Manipulation
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Never encourage TPs to manipulate numbers. Quality and genuine customer satisfaction always come before artificial metric targets.
          </p>
        </div>
      </div>

      {/* 20.1 Core Operational Indicators */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">20.1</span>
          <span>Core NordBase Regional Metrics</span>
        </h3>

        <div className="grid sm:grid-cols-3 md:grid-cols-7 gap-2 text-xs font-mono">
          {[
            'Requests',
            'Leads',
            'Jobs',
            'Lead Acceptance Rate',
            'Completion Rate',
            'Cancellations',
            'No-Shows',
            'Active Specialists',
            'Specialist Coverage',
            'TP Activity',
            'Customer Activity',
            'Hub Performance',
            'Complaints',
            'Unresolved Cases'
          ].map((m, i) => (
            <div key={i} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-center space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">{m}</span>
              <span className="text-cyan-400 font-bold text-[11px] block">Active</span>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 font-mono">
          Note: Exact numerical KPI targets: <strong>TBD — requires definition</strong>. Use metrics implemented in NordBase to observe reality.
        </div>
      </div>

      {/* 20.2 Reading Systemic Patterns (Situations A, B, C) */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">20.2</span>
          <span>Reading Systemic Patterns (Interactive Analyzer)</span>
        </h3>

        <div className="flex gap-2">
          {(['A', 'B', 'C'] as const).map((caseId) => (
            <button
              key={caseId}
              onClick={() => setSelectedCase(caseId)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                selectedCase === caseId
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Situation {caseId}
            </button>
          ))}
        </div>

        {selectedCase === 'A' && (
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-amber-400 block font-mono">Situation A: Leads increase, but Specialist acceptance decreases.</span>
            <p className="text-slate-300 leading-relaxed">
              <strong>RP Diagnostic Question:</strong> Is Lead quality declining? (e.g. unverified details, inaccurate pricing expectations, missing contact details).
            </p>
            <div className="p-2.5 bg-slate-950 rounded-lg text-slate-400 text-[11px]">
              Action: RP reviews TP verification standards and ensures Leads contain accurate technical parameters before dispatch.
            </div>
          </div>
        )}

        {selectedCase === 'B' && (
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-amber-400 block font-mono">Situation B: Requests increase, but completed Jobs do not increase.</span>
            <p className="text-slate-300 leading-relaxed">
              <strong>RP Diagnostic Questions:</strong> Verification bottleneck? Insufficient active Specialists in requested categories? Wrong Specialist matching? Customer drop-off?
            </p>
            <div className="p-2.5 bg-slate-950 rounded-lg text-slate-400 text-[11px]">
              Action: RP identifies the exact step where drop-off occurs in the pipeline and expands Specialist coverage or speeds up TP verification calls.
            </div>
          </div>
        )}

        {selectedCase === 'C' && (
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-emerald-400 block font-mono">Situation C: One Hub performs significantly better than another.</span>
            <p className="text-slate-300 leading-relaxed">
              <strong>RP Diagnostic Question:</strong> What is this high-performing Hub doing differently? (e.g. better local partner relationships, faster response time, stronger Specialist coaching).
            </p>
            <div className="p-2.5 bg-slate-950 rounded-lg text-slate-400 text-[11px]">
              Action: RP documents successful local practices and shares them with neighboring Hub TPs during regional meetings.
            </div>
          </div>
        )}
      </div>

      {/* 20.3 Regular KPI Review Framework */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">20.3</span>
          <span>Regional KPI Review Framework</span>
        </h3>

        <div className="grid sm:grid-cols-5 gap-2 text-xs text-center font-mono">
          {[
            { step: '1. What happened?', desc: 'Review actual operational data' },
            { step: '2. Why did it happen?', desc: 'Analyze systemic causes' },
            { step: '3. What to change?', desc: 'Formulate action items' },
            { step: '4. Who will do it?', desc: 'Assign clear ownership' },
            { step: '5. When to review?', desc: 'Set review deadline' }
          ].map((item, i) => (
            <div key={i} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-cyan-400 block text-[11px]">{item.step}</span>
              <span className="text-[10px] text-slate-400 block">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 21 CONTENT — QUALITY CONTROL & HIDDEN CUSTOMER
   ========================================================================= */
function Module21Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> Purpose of Module 21
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach RP how to protect NordBase quality and trust. Quality control exists because a community based on trust still requires verification.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Core Philosophy
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            The objective of quality checks is: <strong className="text-emerald-300">Find weaknesses before real Customers suffer from them</strong> — NOT catch and punish people.
          </p>
        </div>
      </div>

      {/* 21.1 Quality Monitoring Areas */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">21.1</span>
          <span>9 Core Quality Monitoring Areas</span>
        </h3>

        <div className="grid sm:grid-cols-3 gap-2.5 text-xs">
          {[
            'Customer communication quality',
            'Specialist communication quality',
            'Lead accuracy and completeness',
            'Process & platform compliance',
            'Honesty in data reporting',
            'Information accuracy',
            'Professional behavior & tone',
            'Mutual respect across roles',
            'Prevention of platform misuse'
          ].map((area, i) => (
            <div key={i} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 21.2 Hidden Customer / Mystery Customer Methodology */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">21.2</span>
          <span>Hidden Customer / Mystery Customer Testing</span>
        </h3>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            <strong>Concept:</strong> A controlled test in which a designated evaluator interacts with the NordBase system as a normal Customer to evaluate the real end-to-end experience.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-slate-200 font-mono text-[11px] pt-1">
            <div className="p-2 bg-slate-950 rounded border border-slate-800">✓ Response speed</div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">✓ Tone & communication</div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">✓ Verification thoroughness</div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">✓ Professionalism</div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">✓ Procedure adherence</div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">✓ Data honesty</div>
          </div>
        </div>

        <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-cyan-300">
          <strong>NordBase Equal Quality Principle:</strong> TPs can be tested by Hidden Customer runs. RPs can ALSO be tested. The system must remain trustworthy regardless of who is being evaluated.
        </div>
      </div>

      {/* 21.3 RP Integrity Rules */}
      <div className="bg-[#050A1A] border border-rose-900/30 rounded-2xl p-6 space-y-3 text-xs">
        <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" /> RP Integrity Code
        </span>
        <div className="grid sm:grid-cols-2 gap-2 text-slate-300">
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">✕ Never manipulate test or metric results</div>
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">✕ Never hide operational problems from Admin</div>
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">✕ Never falsify Lead or Job information</div>
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">✕ Never protect friends from legitimate review</div>
        </div>
      </div>

      {/* Practical Scenario — Module 21 */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Practical Scenario — Module 21
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <strong>Situation:</strong> A Hidden Customer test discovers that a TP is consistently skipping the required Customer verification step to issue Leads faster. What should RP do?
        </p>

        <div className="space-y-2">
          {[
            { id: 1, text: 'A) Hide the test report from system admins to protect the region’s public ranking.' },
            { id: 2, text: 'B) Document the facts, discuss the issue constructively with the TP, correct the behavior through refresher coaching, and escalate according to applicable NordBase procedures if non-compliance persists.' },
            { id: 3, text: 'C) Publicly shame the TP in the general regional chat group.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedScenarioOption(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedScenarioOption === opt.id
                  ? opt.id === 2
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {selectedScenarioOption !== null && (
          <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
            selectedScenarioOption === 2
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            {selectedScenarioOption === 2 ? (
              <span><strong>Correct!</strong> Documenting facts, coaching the partner privately, and following formal escalation protocols upholds quality without hiding flaws or resorting to destructive public shaming.</span>
            ) : (
              <span><strong>Incorrect.</strong> Hiding flaws compromises system trust, while public shaming destroys partner morale.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 22 CONTENT — PROBLEMS, CONFLICTS & CRISIS MANAGEMENT
   ========================================================================= */
function Module22Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> Purpose of Module 22
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teach RP how to remain calm, composed, and effective when something goes wrong in the region.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Zap className="w-4 h-4" /> First Principle
          </span>
          <p className="text-xs font-bold text-emerald-300 font-mono leading-relaxed">
            DO NOT PANIC. Separate: Facts → Risk → Responsibility → Action
          </p>
        </div>
      </div>

      {/* 22.1 Common Crisis Situations & First Questions */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">22.1</span>
          <span>Common Regional Crisis Scenarios & RP First Questions</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            'TP conflict or disagreement',
            'Sudden TP absence or illness',
            'Specialist conflict / dispute',
            'Severe Customer complaint',
            'Specialist no-show on job',
            'Sudden workload volume spike',
            'Hub operational failure',
            'Technical connection problem',
            'Suspected fraud or abuse',
            'Security or safety issue',
            'Communication breakdown'
          ].map((item, i) => (
            <div key={i} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* The 7 Diagnostic Questions */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
          <span className="font-bold text-cyan-400 block uppercase">The RP First 7 Questions:</span>
          <div className="grid sm:grid-cols-2 gap-2 text-slate-300 text-[11px]">
            <div>1. What actually happened?</div>
            <div>2. Who is affected?</div>
            <div>3. Is there an immediate risk?</div>
            <div>4. What is actually known?</div>
            <div>5. What is still unknown?</div>
            <div>6. What can RP solve locally?</div>
            <div className="sm:col-span-2 text-amber-300">7. What MUST be escalated to Admin?</div>
          </div>
        </div>
      </div>

      {/* 22.2 Escalation & Commercial Disputes */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">22.2</span>
          <span>Escalation Pathways & Commercial Dispute Boundaries</span>
        </h3>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed space-y-2">
          <span className="font-bold text-white block font-mono">Escalation Structure: TP → RP → Admin / Super Admin</span>
          <p>
            RP should resolve routine operational issues independently and escalate only situations beyond RP authority or requiring system-level intervention.
          </p>
        </div>

        <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200 leading-relaxed space-y-2">
          <span className="font-bold text-amber-400 block font-mono">Commercial Disputes Reinforcement:</span>
          <p>
            Customer and Specialist are independent parties to their commercial relationship. NordBase is not automatically a party to that private commercial contract.
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-[11px] pt-1 text-slate-300">
            <div>✓ Remain neutral</div>
            <div>✓ Maintain professional communication</div>
            <div>✓ Record relevant platform facts</div>
            <div>✓ Do NOT act as judge of private disputes</div>
          </div>
        </div>
      </div>

      {/* 22.3 Crisis Cycle */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">22.3</span>
          <span>The Crisis Management Cycle</span>
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-2 text-center text-xs font-mono">
          {['Stabilize', 'Communicate', 'Resolve', 'Record', 'Learn'].map((step, i) => (
            <React.Fragment key={i}>
              <div className="p-3 bg-slate-900 border border-cyan-500/30 text-cyan-300 rounded-xl flex-1 min-w-[100px] font-bold">
                {i + 1}. {step}
              </div>
              {i < 4 && <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden md:block" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 23 CONTENT — CONTINUOUS IMPROVEMENT & REGIONAL GROWTH
   ========================================================================= */
function Module23Content({ selectedScenarioOption, setSelectedScenarioOption }: any) {
  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Purpose of Module 23
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            RP should not simply maintain a region. RP should continuously improve it. Growth follows operational stability.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Globe className="w-4 h-4" /> Local Eyes & Ears
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            RP serves as NordBase's local feedback bridge, sharing market trends, partner feedback, and successful practices with central product teams.
          </p>
        </div>
      </div>

      {/* 23.1 Continuous Improvement Cycle */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">23.1</span>
          <span>The Continuous Improvement Cycle</span>
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-2 text-center text-xs font-mono">
          {['Observe', 'Identify', 'Propose', 'Test', 'Measure', 'Improve'].map((step, i) => (
            <React.Fragment key={i}>
              <div className="p-2.5 bg-slate-900 border border-cyan-500/30 text-cyan-300 rounded-xl flex-1 min-w-[90px] font-bold">
                {step}
              </div>
              {i < 5 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden md:block" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs text-slate-300 pt-2">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">• What is slowing us down?</div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">• Where do Customers feel friction?</div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">• Where do Specialists feel friction?</div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">• What do TPs struggle with?</div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">• Which Hub needs support?</div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">• Which process can be simplified?</div>
        </div>
      </div>

      {/* 23.2 Responsible Expansion & Future Leadership */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">23.2</span>
          <span>New Hub Readiness & Leadership Pipeline</span>
        </h3>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed space-y-2">
          <span className="font-bold text-white block">New Hub Expansion Checklist (6 Criteria):</span>
          <div className="grid sm:grid-cols-2 gap-2 text-[11px] font-mono text-cyan-300">
            <div>1. Existing Hub stability verified</div>
            <div>2. TP capacity available</div>
            <div>3. Specialist availability confirmed</div>
            <div>4. Customer demand mapped</div>
            <div>5. Operational workload manageable</div>
            <div>6. RP bandwidth sufficient</div>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Rule: Do not expand simply because expansion looks impressive. Expansion must follow operational readiness.
          </p>
        </div>

        <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-mono">
          <strong>Developing Future RP Leadership:</strong> The long-term regional model is: <span className="font-bold text-white">RP → Strong TP → Future RP</span>.
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MODULE 24 CONTENT — FINAL RP ASSESSMENT & AUTHORIZATION
   ========================================================================= */
function Module24Content({ selectedScenarioOption, setSelectedScenarioOption, rpCompletedCount }: any) {
  const [candidatePlan, setCandidatePlan] = useState(`Days 1–10: Confirm territory boundaries, recruit & onboard initial TPs, conduct personal RP coaching, setup workspace channels.
Days 11–20: Lead Specialist recruitment across priority categories, run Local Missions in key hubs, initiate local partner flyers and community posts.
Days 21–30: Receive first Customer Requests, verify Leads, oversee first active Jobs with TPs, establish weekly review cycle.`);

  const [authStatus, setAuthStatus] = useState<string>('Ready for Final Review');

  return (
    <div className="space-y-8">
      {/* Intro & Purpose */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Purpose of Module 24
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Determine whether the candidate is genuinely ready to act as an RP. Readiness requires: <strong>Knowledge + Judgment + Practical Skills + Integrity + Leadership</strong>.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4" /> Comprehensive Assessment
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            This is NOT a simple multiple-choice exam. It evaluates complete operational readiness across 6 assessment pillars.
          </p>
        </div>
      </div>

      {/* 24.1 The 6 Assessment Pillars */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">24.1</span>
          <span>The 6 Final RP Assessment Pillars</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            { part: 'PART 1', title: 'NordBase Knowledge', desc: 'Philosophy, Glossary, roles, system, workflow, TP/RP responsibilities, boundaries.' },
            { part: 'PART 2', title: 'TP Academy Mastery', desc: 'Confirmed: TP Academy Mastered — RP can explain and execute complete TP workflow.' },
            { part: 'PART 3', title: 'Practical Scenarios', desc: 'Real-world situations: Customer, Specialist, TP, Lead, Job, conflict, no-show, escalation.' },
            { part: 'PART 4', title: 'Team Leadership', desc: 'Selecting TPs, coaching, training, trust-building, resolving team issues, avoiding micromanagement.' },
            { part: 'PART 5', title: 'Regional Launch Plan', desc: 'Territory structure, Hubs, team onboarding, Specialist Base, Customer channels, Seeding Month schedule.' },
            { part: 'PART 6', title: 'Integrity & Ethics', desc: 'Honesty, transparency, conflict of interest, confidentiality, fair lead distribution, Hidden Customer.' }
          ].map((pillar, i) => (
            <div key={i} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">{pillar.part}</span>
              <span className="font-bold text-white block">{pillar.title}</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 24.2 Practical 30-Day Launch Readiness Test */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">24.2</span>
          <span>FINAL PRACTICAL QUESTION — 30-Day Launch Strategy</span>
        </h3>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3 text-xs">
          <p className="text-slate-200 leading-relaxed font-medium">
            <strong>Question:</strong> "You receive a new region tomorrow. There are no active Hubs and almost no Specialists. What will you do during your first 30 days?"
          </p>

          <textarea
            value={candidatePlan}
            onChange={(e) => setCandidatePlan(e.target.value)}
            rows={4}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-500"
          />
          <p className="text-[10px] text-slate-500 font-mono">
            Demonstrates complete understanding of the RP mission across team, structure, specialists, and early operations.
          </p>
        </div>
      </div>

      {/* 24.3 Authorization Workflow & Readiness Card */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">24.3</span>
          <span>RP Readiness & Regional Launch Authorization</span>
        </h3>

        {/* Readiness Grid */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
          <span className="font-bold text-white block text-sm font-display">RP Readiness Profile</span>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5 font-mono text-[11px]">
            <div className="p-2.5 bg-slate-900 border border-emerald-500/30 text-emerald-300 rounded-lg flex items-center justify-between">
              <span>NordBase Knowledge</span>
              <span className="font-bold">✓ Mastered</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-emerald-500/30 text-emerald-300 rounded-lg flex items-center justify-between">
              <span>TP Academy Workflow</span>
              <span className="font-bold">✓ Mastered</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-emerald-500/30 text-emerald-300 rounded-lg flex items-center justify-between">
              <span>Practical Scenarios</span>
              <span className="font-bold">✓ Verified</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-emerald-500/30 text-emerald-300 rounded-lg flex items-center justify-between">
              <span>Regional Launch Plan</span>
              <span className="font-bold">✓ Created</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-emerald-500/30 text-emerald-300 rounded-lg flex items-center justify-between">
              <span>Final Assessment</span>
              <span className="font-bold">✓ Completed</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-cyan-500/30 text-cyan-300 rounded-lg flex items-center justify-between">
              <span>Authorization Status</span>
              <span className="font-bold">{authStatus}</span>
            </div>
          </div>
        </div>

        {/* Status Selector */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
          <span className="font-bold text-slate-300 block">NordBase Official Authorization Status (Controlled by Authority):</span>
          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            {[
              'Academy In Progress',
              'Academy Completed — Practical Assessment Pending',
              'Ready for Final Review',
              'RP Ready for Regional Launch',
              'Regional Launch Authorized',
              'Additional Training Required'
            ].map((st) => (
              <button
                key={st}
                onClick={() => setAuthStatus(st)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  authStatus === st
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 font-mono pt-1">
            Note: Authorization rules if not yet formally finalized: <strong>TBD — requires definition</strong>.
          </p>
        </div>
      </div>

      {/* 24.4 FINAL RP MESSAGE */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/80 border-2 border-cyan-500/40 rounded-2xl p-8 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
          <Sparkles className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white font-display">FINAL RP MESSAGE</h3>

        <div className="max-w-2xl mx-auto space-y-3 text-xs text-slate-200 leading-relaxed font-sans">
          <p className="text-sm font-bold text-cyan-300">
            "You are not here simply to manage a region. You are here to build one."
          </p>
          <p>
            Start with people. Build the team. Build the Hubs. Build the Specialist Base. Bring in the first Customers. Create the first Leads and Jobs. Learn from what happens. Help the team become stronger.
          </p>
          <p>
            Then build the system so that the region can work without depending on your every action.
          </p>
        </div>

        <div className="pt-2">
          <span className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 inline-block">
            Start the engine. Build the team. Reach stability. Keep improving. Welcome to your region.
          </span>
        </div>
      </div>
    </div>
  );
}
