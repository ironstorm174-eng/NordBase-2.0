import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Info, 
  FileCheck, 
  Gavel, 
  UserCheck, 
  Eye, 
  AlertCircle,
  FolderGit2
} from 'lucide-react';

export function Module18ComplaintsModeration() {
  const escalationReasons = [
    'Suspected fraud or financial deception',
    'Repeated abuse of platform tools or participants',
    'Threats, intimidation, or aggressive behavior',
    'Harassment of Customers, Specialists, or TPs',
    'Deliberate misuse or circumventing of platform workflow',
    'False identity, fake licenses, or misleading credentials',
    'Serious or intentional violation of NordBase rules',
    'Security concerns threatening user safety',
    'Behavior that risks damaging community trust',
    'Repeated operational failures that TP cannot resolve'
  ];

  const documentationRules = [
    { rule: 'Record Concrete Facts', desc: 'Log exact dates, times, quotes, and observable events clearly.' },
    { rule: 'Separate Facts from Opinions', desc: 'Avoid subjective assumptions like "he was lying"; write "he stated X on date Y".' },
    { rule: 'Preserve Communication', desc: 'Keep relevant chat transcripts, call logs, and system notes intact.' },
    { rule: 'Identify All Participants', desc: 'Include full User IDs, Job IDs, and contact handles.' },
    { rule: 'Describe Chronologically', desc: 'Explain events in sequential order so RP/Admin can review easily.' },
    { rule: 'Avoid Emotional Conclusions', desc: 'Maintain objective tone; do not manipulate, hide, or delete data.' }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 18</span>
            <h3 className="text-xl font-bold text-white font-display">Complaints & Moderation — Platform Standards</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module explains how to distinguish private commercial disputes from platform rule violations, detailing moderation boundaries and RP escalation requirements.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Accurately classify issues as private commercial disputes vs platform moderation cases, documenting facts objectively and escalating rule breaches to RP/Admin.
      </div>

      {/* 18.1 Commercial Dispute vs Platform Violation */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <span className="text-cyan-400 font-mono font-bold text-sm">18.1.</span>
          Commercial Dispute vs Platform Violation
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Commercial Dispute */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
              <AlertTriangle className="w-4 h-4" />
              <span>Commercial Dispute</span>
            </div>
            <p className="text-slate-300 italic">
              "I am unhappy with the work performed by the Specialist."
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              This is primarily a private contractual matter between Customer and Specialist. NordBase does not judge work quality or arbitrate price terms.
            </p>
          </div>

          {/* Platform Violation */}
          <div className="p-4 bg-rose-950/30 border border-rose-900/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold font-mono">
              <ShieldAlert className="w-4 h-4" />
              <span>Platform Violation</span>
            </div>
            <p className="text-rose-200/90 italic">
              "This participant is deliberately using NordBase to deceive other users."
            </p>
            <p className="text-rose-200/80 text-[11px] leading-relaxed">
              This threatens platform safety and community integrity, requiring direct NordBase moderation intervention and possible account restrictions.
            </p>
          </div>
        </div>
      </div>

      {/* 18.2 Situations That Should Be Escalated */}
      <div className="bg-[#050A1A] border border-rose-900/40 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-rose-300 font-display flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          18.2. RP / Admin Escalation Triggers
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {escalationReasons.map((item, idx) => (
            <div key={idx} className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl flex items-start gap-2 text-rose-200/90">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 18.3 Moderation Is Not Arbitration */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Gavel className="w-4 h-4 text-cyan-400" />
          18.3. Moderation Is Not Arbitration
        </h4>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3 text-xs text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/80 rounded-lg">
              <strong className="text-cyan-400 block mb-1">Platform Moderation</strong>
              NordBase enforces community rules, restricts fraudulent accounts, and manages platform access rights.
            </div>
            <div className="p-3 bg-slate-800/80 rounded-lg">
              <strong className="text-rose-400 block mb-1">Private Arbitration</strong>
              NordBase does NOT become a judge, court, or arbitrator in private commercial disputes over money or quality.
            </div>
          </div>
        </div>
      </div>

      {/* 18.4 Documentation Rules */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-cyan-400" />
          18.4. Standard Documentation Rules
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {documentationRules.map((doc, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-cyan-400 font-mono block">{doc.rule}</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">{doc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 18.5 TP's Objective Chain */}
      <div className="bg-[#0A1128] border border-cyan-500/30 rounded-2xl p-5 text-center space-y-3">
        <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">TP Objective Chain</p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold font-mono">
          <span className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white">Protect Platform</span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white">Protect Community</span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white">Maintain Accurate Info</span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 bg-rose-950 border border-rose-800 rounded-lg text-rose-300">Escalate When Needed</span>
        </div>
      </div>

      {/* Practical Scenario 18 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 18
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          A Specialist repeatedly receives complaints from multiple Customers and appears to be deliberately abusing the platform by providing false information. Is this a commercial dispute or a NordBase moderation issue? Why?
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Answer:</strong> This is a <strong>NordBase Moderation Issue</strong>.
          </p>
          <p className="text-slate-400 leading-relaxed">
            While an isolated complaint about a single job's work result is a private commercial dispute between Customer and Specialist, a <strong>repeated pattern of deliberate abuse, false information, or platform exploitation</strong> violates NordBase terms, risks community safety, and requires account moderation by RP/Admin.
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
            A participant submits a complaint regarding work quality, interpersonal conflict, or alleged platform misconduct.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Evaluates whether the issue is a private commercial dispute vs a platform rule violation, logs facts chronologically, and escalates platform abuse to RP/Admin.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Do not attempt to act as a judge/arbitrator for commercial claims, do not write emotional conclusions, and never manipulate, hide, or delete documentation.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Escalate immediately to RP/Admin when encountering fraud, threats, fake credentials, harassment, or deliberate rule violations.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            A Specialist uses false licenses to accept electrical jobs; TP logs chat proofs and escalates to RP for immediate platform access suspension.
          </p>
        </div>
      </div>
    </div>
  );
}
