import React from 'react';
import { 
  UserCheck, 
  FileCheck, 
  Building2, 
  CreditCard, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

export function Module04JoiningNordBase() {
  const steps = [
    {
      num: '01',
      title: 'Step 1 — Interview',
      icon: UserCheck,
      badge: 'Evaluation',
      desc: 'The candidate completes an interview evaluating:',
      bullets: [
        'Ability to work independently',
        'Communication skills',
        'Responsibility',
        'Technical readiness',
        'Understanding of the TP role',
        'Readiness to work with people'
      ]
    },
    {
      num: '02',
      title: 'Step 2 — Agreement',
      icon: FileCheck,
      badge: 'Formalization',
      desc: 'After successfully completing the interview, the candidate signs an agreement with NordBase.',
      bullets: [
        'Formal partnership contract execution',
        'Territory assignment parameters',
        'Only after this does formal preparation for work begin'
      ]
    },
    {
      num: '03',
      title: 'Step 3 — Business Registration',
      icon: Building2,
      badge: 'Legal Entity',
      desc: 'To receive compensation, the TP must have an appropriate registered business.',
      legalNote: 'Current NordBase model: Sole Proprietor / Individual Entrepreneur or LDA',
      bullets: [
        'Sole Proprietor / Individual Entrepreneur (IE / Empresário em Nome Individual)',
        'LDA (Sociedade por Quotas / Limited Liability Company)'
      ]
    },
    {
      num: '04',
      title: 'Step 4 — Payment System',
      icon: CreditCard,
      badge: 'Financial Connect',
      desc: 'The TP provides the required information to connect to Stripe and receive payments.',
      bullets: [
        'KYC compliance verification on Stripe',
        'Bank payout account connection',
        'Automated compensation routing setup'
      ]
    },
    {
      num: '05',
      title: 'Step 5 — Academy',
      icon: GraduationCap,
      badge: 'Certification',
      desc: 'Before starting independent work, the TP completes the required TP Academy training.',
      bullets: [
        'Completion of all 27 TP Academy Modules',
        'Practical scenarios examination',
        'Final Assessment pass'
      ]
    },
    {
      num: '06',
      title: 'Step 6 — Authorization to Work',
      icon: ShieldCheck,
      badge: 'Live Status',
      desc: 'After all required conditions have been completed, the TP receives authorization to begin independent work.',
      bullets: [
        'Full Dashboard access activation',
        'Territory Hub live status enable',
        'Ready to process real Customer Requests'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          The TP Onboarding Journey
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Becoming a Territory Partner follows a strict 6-step progression. Every stage must be verified before moving to active independent operations in your territory.
        </p>
      </div>

      {/* Visual Process Flow Diagram */}
      <div className="bg-gradient-to-r from-blue-950/80 via-[#0A1128] to-cyan-950/80 border border-cyan-500/40 rounded-2xl p-6">
        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-4">
          Visual Progression Path:
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
          {steps.map((s, idx) => (
            <div key={s.num} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-[10px] mb-2">
                {idx + 1}
              </span>
              <span className="font-bold text-white mb-1">{s.title.split('—')[1]}</span>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-cyan-500/50 hidden lg:block mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Step Cards */}
      <div className="space-y-4">
        {steps.map((step) => {
          const IconComp = step.icon;
          return (
            <div key={step.num} className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-display">{step.title}</h4>
                </div>
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-cyan-400 font-mono font-bold text-xs rounded-full">
                  {step.badge}
                </span>
              </div>

              <p className="text-slate-200 text-sm mb-3 pl-12">{step.desc}</p>

              {step.legalNote && (
                <div className="mb-3 ml-12 p-3 bg-cyan-950/40 border-l-2 border-cyan-400 text-cyan-200 text-xs font-mono font-bold rounded-r-lg">
                  {step.legalNote}
                </div>
              )}

              <ul className="space-y-1.5 text-xs text-slate-300 pl-12">
                {step.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Standard 5-Point Lesson Framework (Rule 7) */}
      <div className="mt-10 space-y-4 pt-6 border-t border-blue-900/30">
        <h4 className="text-base font-bold text-white uppercase font-mono tracking-wider text-slate-400 mb-2">
          Lesson Framework Summary
        </h4>

        {/* 01. What Happens */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">01</span>
            <h5 className="font-bold text-white text-sm">01. What Happens</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            A candidate passes selection, formal contracts, business/payment setup, and Academy education before receiving operational authorization.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">02</span>
            <h5 className="font-bold text-white text-sm">02. What TP Does</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            Completes interview, signs agreement, registers a Sole Proprietor or LDA entity, connects Stripe account, completes TP Academy, and receives authorization.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">03</span>
            <h5 className="font-bold text-rose-300 text-sm">03. What NOT To Do</h5>
          </div>
          <p className="text-rose-200/80 text-xs leading-relaxed pl-9">
            Do NOT attempt to process real Customer Requests prior to receiving official Authorization to Work.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">04</span>
            <h5 className="font-bold text-amber-300 text-sm">04. When Help Is Needed</h5>
          </div>
          <p className="text-amber-200/80 text-xs leading-relaxed pl-9">
            If experiencing delays with Stripe business verification or entity registration, reach out to the RP for administrative support.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-xs font-bold">05</span>
            <h5 className="font-bold text-white text-sm">05. Practical Example</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            A TP candidate signs the contract (Step 2), registers as a Sole Proprietor (Empresário em Nome Individual) (Step 3), links their bank account to Stripe (Step 4), finishes the 27 modules (Step 5), and receives their green status indicator (Step 6).
          </p>
        </div>
      </div>
    </div>
  );
}
