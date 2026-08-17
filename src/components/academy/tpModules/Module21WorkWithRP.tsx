import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  Briefcase, 
  UserCheck, 
  Search, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  XCircle
} from 'lucide-react';

export function Module21WorkWithRP() {
  const rpSupportAreas = [
    'Regional issues & market coordination',
    'Operational problems beyond TP authority',
    'Territory development & capacity expansion',
    'Difficult cases requiring higher judgment',
    'Coordination between neighboring TPs',
    'Regional operational standards & policy',
    'Escalation to NordBase Admin level'
  ];

  const contactRPTriggers = [
    'Serious operational problem threatening service delivery',
    'Repeated workflow or behavioral problems with a Specialist',
    'Suspected fraud, deception, or deliberate platform abuse',
    'Serious Customer complaint that cannot be resolved locally',
    'Technical or system issue that completely prevents work',
    'Situation clearly outside established TP authority',
    'Need for a formal regional operational decision',
    'Urgent situation requiring additional regional support'
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 21</span>
            <h3 className="text-xl font-bold text-white font-display">TP & RP — Working With the Regional Partner</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module defines the collaborative working relationship between the Territory Partner (TP) and Regional Partner (RP), outlining autonomous boundaries, support triggers, and escalation discipline.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Operate independently within your territory authority using established tools and logs, while knowing exactly when and how to engage your Regional Partner for complex or escalated issues.
      </div>

      {/* 21.1 & 21.2 Division of Responsibilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TP Responsibility */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-sm">
            <UserCheck className="w-5 h-5" />
            <span>21.1. TP Responsibility</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Territory Partner is directly responsible for the <strong>daily operation of their designated territory</strong>.
          </p>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
            <p className="text-emerald-400 font-semibold">Autonomous Scope:</p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              The TP must solve normal operational situations independently whenever they fall within the TP’s standard authority (e.g. verifying customers, creating leads, dispatching specialists, updating job logs).
            </p>
          </div>
        </div>

        {/* RP Responsibility */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold font-mono text-sm">
            <Briefcase className="w-5 h-5" />
            <span>21.2. RP Responsibility</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Regional Partner is responsible for the <strong>development and overall operation of the broader region</strong>.
          </p>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
            <p className="text-purple-300 font-semibold mb-1">RP Support Scope:</p>
            <ul className="space-y-1 text-[11px] text-slate-400">
              {rpSupportAreas.map((area, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 21.3 When TP Should Contact RP */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-cyan-400" />
          21.3. Valid Reasons to Contact Your RP
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Contact your Regional Partner when encountering situations that exceed territory authority or require regional intervention:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {contactRPTriggers.map((trigger, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
              <span>{trigger}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 21.4 When TP Should NOT Escalate */}
      <div className="bg-[#050A1A] border border-amber-900/40 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-amber-300 font-display flex items-center gap-2">
          <XCircle className="w-5 h-5 text-amber-400" />
          21.4. What NOT to Escalate Immediately
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Do not escalate every routine question or minor operational step. Before contacting your RP, a TP should first consult available system resources:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center font-mono font-semibold">
          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-amber-200">1. TP Academy</div>
          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-amber-200">2. Dashboard Logs</div>
          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-amber-200">3. Operating Rules</div>
          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-amber-200">4. Job Notes</div>
        </div>
        <p className="text-xs text-slate-400 italic text-center pt-1">
          Goal: Build independent decision-making capabilities and maintain efficient operational speed.
        </p>
      </div>

      {/* 21.5 Regional Teamwork */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          21.5. Regional Community & Teamwork
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          TPs within the same region are part of a single unified NordBase community. Assisting a neighboring TP during workload spikes or sharing local insights strengthens the reliability of the entire regional network.
        </p>
      </div>

      {/* Practical Scenario 21 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 21
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          A TP encounters an operational problem they have never seen before. What should the TP do before immediately escalating the issue to the RP?
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p className="font-bold text-cyan-400 text-sm">Recommended Step-by-Step Protocol:</p>
          <ol className="list-decimal pl-4 space-y-1.5 text-slate-300">
            <li>Search relevant modules in <strong>TP Academy</strong> for established guidance.</li>
            <li>Review the <strong>Dashboard logs and system notes</strong> for the specific Request, Lead, or Job.</li>
            <li>Verify whether the issue can be solved using standard operating procedures within TP authority.</li>
            <li>If the problem remains unresolved or exceeds TP authority, gather all relevant facts (IDs, dates, details, actions taken) before sending a structured escalation to the RP.</li>
          </ol>
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
            A TP manages daily territory operations and encounters situations ranging from standard tasks to complex regional issues.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Solves standard operational tasks independently using Academy rules and Dashboard tools, escalating to RP only when authority is exceeded.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Do not escalate routine questions without checking the Academy first, and do not make unauthorized regional decisions alone.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Contact RP when facing serious operational failures, fraud, persistent specialist breaches, or technical blocks preventing work.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            A TP encounters a system error during lead creation; TP verifies Academy guidelines, collects logs and timestamps, and submits a concise report to RP.
          </p>
        </div>
      </div>
    </div>
  );
}
