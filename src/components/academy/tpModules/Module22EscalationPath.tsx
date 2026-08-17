import React from 'react';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  HelpCircle, 
  FileText, 
  Clock, 
  Send,
  MessageSquare
} from 'lucide-react';

export function Module22EscalationPath() {
  const factCollectionItems = [
    'What happened (brief factual description)',
    'Who is involved (Customer ID, Specialist ID, TP ID)',
    'Relevant identifiers (Request ID, Lead ID, or Job ID)',
    'Important timestamps (when request was created, when issue occurred)',
    'Relevant communication excerpts (NordBase chat logs)',
    'Actions already taken by the TP to resolve the issue',
    'Specific assistance or decision required from RP/Admin'
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 22</span>
            <h3 className="text-xl font-bold text-white font-display">Escalation — When and How to Escalate</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module defines the strict hierarchical escalation framework, data preparation guidelines, and communication structure when operational issues exceed territory level.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Master the strict escalation chain (TP → RP → Admin / Super Admin), collect concise factual evidence before submitting requests, and handle complex scenarios without emotional noise.
      </div>

      {/* 22.1 Basic Escalation Hierarchy */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5 text-cyan-400" />
          22.1. Basic Escalation Hierarchy
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Escalation MUST strictly follow the designated hierarchy. Issues are escalated to a higher level ONLY when they exceed the authority or technical capabilities of the current tier:
        </p>

        {/* Chain Visual */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-xl font-mono text-xs font-bold">
          <div className="w-full sm:w-auto p-3 bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 rounded-lg text-center">
            Level 1: TP (Territory Partner)
          </div>
          <span className="text-cyan-400 hidden sm:inline">→</span>
          <span className="text-cyan-400 sm:hidden">↓</span>
          <div className="w-full sm:w-auto p-3 bg-purple-950/40 border border-purple-500/30 text-purple-300 rounded-lg text-center">
            Level 2: RP (Regional Partner)
          </div>
          <span className="text-cyan-400 hidden sm:inline">→</span>
          <span className="text-cyan-400 sm:hidden">↓</span>
          <div className="w-full sm:w-auto p-3 bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 rounded-lg text-center">
            Level 3: Admin / Super Admin
          </div>
        </div>
      </div>

      {/* 22.2 Fact Collection Checklist */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          22.2. Pre-Escalation Checklist (Fact Gathering)
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Before submitting an escalation ticket or message, the TP must collect all necessary objective data:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {factCollectionItems.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 22.3 Good vs Bad Escalation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Good Escalation */}
        <div className="bg-[#050A1A] border border-emerald-900/40 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>22.3. Good Escalation Structure</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Factual, structured, and concise:
          </p>
          <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs space-y-2 text-emerald-200 font-mono">
            <p><strong>Problem:</strong> [Short summary statement]</p>
            <p><strong>Facts:</strong> [Job ID, Timestamps, Logs]</p>
            <p><strong>Actions Taken:</strong> [Steps tried by TP]</p>
            <p><strong>Current Status:</strong> [Waiting for RP instruction]</p>
            <p><strong>Help Required:</strong> [Specific decision requested]</p>
          </div>
        </div>

        {/* Bad Escalation */}
        <div className="bg-[#050A1A] border border-rose-900/40 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-sm">
            <XCircle className="w-5 h-5" />
            <span>22.3. Bad Escalation Habits</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Patterns to avoid strictly:
          </p>
          <ul className="space-y-1.5 text-xs text-rose-200/80">
            <li className="flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Emotional descriptions or personal opinions</span>
            </li>
            <li className="flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Accusations or unverified assumptions</span>
            </li>
            <li className="flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Incomplete IDs or missing chat logs</span>
            </li>
            <li className="flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Unnecessarily long, unstructured text blocks</span>
            </li>
            <li className="flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Escalating routine issues without attempting resolution</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 22.4 Urgent Safety Situations */}
      <div className="bg-[#050A1A] border border-amber-900/40 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-amber-300 font-display flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          22.4. Urgent Safety or Security Situations
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          If an issue presents an immediate safety threat or serious security breach, follow the applicable NordBase emergency response protocol.
        </p>
        <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl text-xs text-amber-200 font-mono">
          Specific emergency safety protocol details: <strong className="text-amber-400">TBD — requires definition</strong>
        </div>
      </div>

      {/* 22.5 Escalation Does Not Mean Failure */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Send className="w-4 h-4 text-cyan-400" />
          22.5. Professional Perspective
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Asking for help when a situation genuinely exceeds your authority is a sign of professional competence, not failure. The goal of NordBase operations is to resolve problems cleanly and protect system integrity, not to prove that a TP can handle everything alone.
        </p>
      </div>

      {/* Practical Scenario 22 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 22
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          A Customer and Specialist are involved in a serious commercial dispute, but there is no platform rule violation. What should the TP do, and when should the RP be involved?
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p className="font-bold text-cyan-400 text-sm">Action Protocol:</p>
          <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
            <li><strong>TP Action:</strong> Remind both parties that NordBase is an independent software platform and not a party to their private commercial contract. Document factual chat logs without taking sides or offering financial promises.</li>
            <li><strong>When to involve RP:</strong> Only involve RP if the dispute turns into platform rule violations (e.g. harassment, off-platform fraud, threats) or requires regional administrative moderation beyond TP authority.</li>
          </ul>
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
            An operational problem arises that exceeds standard TP authority or involves complex edge cases.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Gathers facts, logs, and IDs, then submits a structured report following the exact hierarchy: TP → RP → Admin.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Do not send emotional, unstructured messages, bypass the RP level unnecessarily, or make promises to users.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Escalate immediately when authority thresholds are reached, platform security is threatened, or severe system errors occur.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            A specialist engages in off-platform circumvention. TP documents timestamps, chat evidence, and submits a structured report to RP for platform moderation.
          </p>
        </div>
      </div>
    </div>
  );
}
