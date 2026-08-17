import React from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  Star, 
  Scale, 
  CheckSquare, 
  Sparkles,
  MapPin,
  Wrench,
  Clock
} from 'lucide-react';

export function Module11SpecialistSelection() {
  const criteriaList = [
    { title: 'Professional Category', desc: 'Exact trade alignment (e.g., Electrician, Plumber, Locksmith).' },
    { title: 'Verified Qualifications', desc: 'Verified certifications, licences, and technical eligibility.' },
    { title: 'Practical Experience', desc: 'Proven track record in the specific type of task requested.' },
    { title: 'Operational Territory', desc: 'Active coverage within the Customer’s geographic location.' },
    { title: 'Real Availability', desc: 'Capacity to fulfill the job within the Customer’s required timeframe.' },
    { title: 'Access & Logistics', desc: 'Ability to physically reach the Customer site with proper equipment.' },
    { title: 'Job Suitability', desc: 'Specific capability for unique job demands (e.g. high ladder work, pool pumps).' },
    { title: 'Performance History', desc: 'NordBase system feedback, past reliability, and overall rating.' }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 11</span>
            <h3 className="text-xl font-bold text-white font-display">Specialist Selection — Selecting the Right Specialist</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module explains how a TP evaluates and selects a suitable Specialist for a Lead, focusing on operational suitability rather than simplistic location or price rules.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Master matching verified Specialists to Leads by evaluating qualifications, experience, territory, and availability without personal bias or arbitrary ranking.
      </div>

      {/* 11.1 The Goal */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <span className="text-cyan-400 font-mono font-bold text-sm">11.1.</span>
          The Goal
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          The objective is <strong>not</strong> to find simply the nearest or cheapest Specialist.
        </p>
        <div className="p-4 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/30 rounded-xl text-center">
          <p className="text-sm md:text-base font-bold text-cyan-300 font-display">
            "Find the right Specialist for this specific Lead."
          </p>
        </div>
      </div>

      {/* 11.2 Selection Criteria */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <span className="text-cyan-400 font-mono font-bold text-sm">11.2.</span>
          Selection Criteria
        </h4>
        <p className="text-xs text-slate-300">
          When matching a Specialist, the TP evaluates the following factual criteria available in NordBase:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {criteriaList.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
              <span className="font-bold text-cyan-300 text-xs block mb-1">{item.title}</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-200/90 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span><strong>Rule:</strong> Do not invent additional arbitrary ranking rules or unverified scoring metrics.</span>
        </div>
      </div>

      {/* 11.3 Matching the Specialist to the Lead */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <span className="text-cyan-400 font-mono font-bold text-sm">11.3.</span>
          Matching the Specialist to the Lead
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Compare the actual requirements of the Lead with the Specialist’s verified capabilities. The category alone is not always enough — the Specialist must be suitable for the actual request:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" /> Electrical Lead
            </span>
            <p className="text-slate-300">→ Verified electrical Specialist with active certification.</p>
          </div>
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Pool Maintenance
            </span>
            <p className="text-slate-300">→ Specialist experienced specifically in pool filtration & chemical balancing.</p>
          </div>
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Heavy Moving Job
            </span>
            <p className="text-slate-300">→ Specialist equipped with transport vehicle and lifting capacity.</p>
          </div>
        </div>
      </div>

      {/* 11.4 Availability, 11.5 Multiple Specialists & 11.6 Fairness */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono uppercase">
            <Clock className="w-4 h-4" /> 11.4 Availability
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Check whether the Specialist can perform the work within the required timeframe. <strong>Never promise the Customer a time that has not been confirmed.</strong>
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono uppercase">
            <Scale className="w-4 h-4" /> 11.5 Multiple Candidates
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            If several Specialists are suitable, use available NordBase selection tools and established distribution rules. Never create personal preferences.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono uppercase">
            <CheckSquare className="w-4 h-4" /> 11.6 Operational Fairness
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            TP must not systematically favor a Specialist for personal reasons. Selection is based purely on Lead requirements and established NordBase rules.
          </p>
        </div>
      </div>

      {/* 11.7 Final Check Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-[#0A1128] to-cyan-950 border-2 border-cyan-400/50 rounded-2xl p-6 text-center space-y-2 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
          11.7. Final Selection Audit Question
        </h4>
        <p className="text-base md:text-lg font-black text-white font-display italic">
          "Is this Specialist genuinely suitable for this Lead?"
        </p>
        <p className="text-xs text-slate-300">
          If not, choose another Specialist who fits the job scope.
        </p>
      </div>

      {/* Key Principle Banner */}
      <div className="bg-[#0A1128] border border-cyan-500/30 rounded-2xl p-5 text-center space-y-1">
        <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Key Operating Principle</p>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
          <strong>TP coordinates the process.</strong> The Specialist performs the work. The Customer decides whether to contract with the Specialist. <strong>NordBase is not a party to the commercial relationship between Customer and Specialist.</strong>
        </p>
      </div>

      {/* Practical Scenario 11 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 11
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          "Two Specialists are available. One is closer, but the other has the required experience for the specific job. Which one should TP choose and why?"
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Correct Decision:</strong> The TP chooses the Specialist with the required experience for the specific job.
          </p>
          <p className="text-slate-400">
            <strong>Reasoning:</strong> Geographic proximity alone does not guarantee that a Specialist can safely and competently execute the required technical scope. Suitability for the specific work takes priority over raw proximity or price.
          </p>
        </div>
      </div>

      {/* Standard 5-Point Lesson Framework */}
      <div className="space-y-4 pt-6 border-t border-blue-900/30">
        <h4 className="text-base font-bold text-white uppercase font-mono tracking-wider text-slate-400 mb-2">
          Lesson Framework Summary
        </h4>

        {/* 01. What Happens */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs font-mono">01</div>
            <h5 className="text-sm font-bold text-white">What Happens</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            The TP reviews candidate Specialists in the system against the verified Lead requirements.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Evaluates professional category, qualifications, experience, territory, and availability, selecting the candidate best fitted for the job.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Do not select based solely on who is nearest or cheapest. Do not show personal favoritism or promise unconfirmed arrival times to the Customer.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Involve RP if no qualified Specialist exists in the territory for a specialized trade or if complex candidate trade matching is required.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Selecting a Specialist with documented experience in pool filtration repair rather than a general handyman who lives 2 km closer.
          </p>
        </div>
      </div>
    </div>
  );
}
