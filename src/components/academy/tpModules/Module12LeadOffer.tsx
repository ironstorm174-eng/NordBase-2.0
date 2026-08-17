import React from 'react';
import { 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  MessageSquare,
  FileCheck,
  RotateCcw
} from 'lucide-react';

export function Module12LeadOffer() {
  const preSendChecks = [
    'Lead is verified and information is complete',
    'Specialist is verified and actively qualified',
    'Specialist is suitable for the specific trade task',
    'Specialist is available or likely to be available',
    'Important conditions (access, tools, timeline) are clearly visible'
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 12</span>
            <h3 className="text-xl font-bold text-white font-display">Lead Offer — Offering a Lead to a Specialist</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module explains what happens when a qualified Lead is offered to a Specialist, including dispatch, decision handling, and operational protocols when a Lead is declined or unanswered.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Understand dispatch pre-checks, managing Specialist Accept or Decline decisions professionally, handling non-responses, and maintaining system records in NordBase.
      </div>

      {/* 12.1 Before Sending */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-cyan-400" />
          12.1. Checklist Before Sending a Lead
        </h4>
        <p className="text-xs text-slate-300">
          Before initiating dispatch, the TP confirms all five readiness factors:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {preSendChecks.map((check, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{check}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 12.2 Sending the Lead & 12.3 Specialist Decision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
            <span className="text-cyan-400 font-mono font-bold text-sm">12.2.</span>
            Sending the Lead
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Lead is dispatched through the NordBase system according to the established workflow. The Specialist receives all the information required to evaluate whether to accept the work.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
            <span className="text-cyan-400 font-mono font-bold text-sm">12.3.</span>
            Specialist Decision
          </h4>
          <div className="flex items-center gap-3 pt-1">
            <span className="px-3 py-1.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ACCEPT
            </span>
            <span className="text-xs text-slate-400 font-mono">OR</span>
            <span className="px-3 py-1.5 bg-rose-950 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-lg flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-400" /> DECLINE
            </span>
          </div>
          <p className="text-xs text-amber-300/90 font-medium pt-1">
            <strong>Rule:</strong> Do not pressure a Specialist to accept a Lead. Acceptance must remain voluntary.
          </p>
        </div>
      </div>

      {/* 12.4 If Accepts vs 12.5 If Declines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 12.4 Accept */}
        <div className="bg-[#050A1A] border border-emerald-900/40 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-emerald-300 font-display">
              12.4. If the Specialist Accepts
            </h4>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-500/30">
              Lead → Job
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            When the Specialist accepts, the Lead instantly converts into an active <strong>Job</strong>. The TP continues monitoring the operational process through NordBase.
          </p>
        </div>

        {/* 12.5 Decline */}
        <div className="bg-[#050A1A] border border-rose-900/40 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-rose-300 font-display">
              12.5. If the Specialist Declines
            </h4>
            <RotateCcw className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Do not argue with the Specialist. Determine whether another suitable Specialist should be selected and re-dispatch the Lead following the standard NordBase workflow.
          </p>
        </div>
      </div>

      {/* 12.6 Non-response & 12.7 Communication */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 12.6 Response Timeout */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-amber-300 font-display flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            12.6. Specialist Does Not Respond
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            If a Specialist fails to respond within reasonable time limits, follow established NordBase procedure.
          </p>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-400">
            <span className="font-semibold text-slate-300 font-mono text-xs">[TBD — requires definition] </span>
            <span>Specific offer expiration window and auto-reassignment timers.</span>
          </div>
        </div>

        {/* 12.7 Operational Communication */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            12.7. Communication & System Record
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The TP may communicate with the Specialist when operational clarification is required.
          </p>
          <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-xs text-cyan-200">
            <strong>System of Record Rule:</strong> All important operational details, reasons for decline, or schedule updates must be recorded inside NordBase.
          </div>
        </div>
      </div>

      {/* Key Principle Banner */}
      <div className="bg-[#0A1128] border border-cyan-500/30 rounded-2xl p-5 text-center space-y-1">
        <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Key Operating Principle</p>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
          <strong>TP coordinates the process.</strong> The Specialist performs the work. The Customer decides whether to contract with the Specialist. <strong>NordBase is not a party to the commercial relationship between Customer and Specialist.</strong>
        </p>
      </div>

      {/* Practical Scenario 12 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 12
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          "A Specialist declines a Lead after receiving it. What should TP do?"
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Correct Procedure:</strong>
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li>Do not argue, debate, or pressure the Specialist.</li>
            <li>Note any decline feedback recorded in the system.</li>
            <li>Evaluate whether another verified Specialist in the territory is suitable for the Lead.</li>
            <li>Re-dispatch the Lead to the next suitable Specialist following the NordBase workflow.</li>
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
            A verified Lead is dispatched to a selected Specialist via NordBase, giving the Specialist all details needed to decide.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Performs pre-dispatch checks, sends the Lead, logs all status transitions, and re-dispatches to another candidate if declined.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Do not pressure a Specialist to accept. Do not argue over declines. Do not dispatch unverified or incomplete Leads.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Escalate to RP if candidate non-responses stall urgent Leads or if no alternative Specialist is available to take the job.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            A Specialist declines an evening plumbing Lead due to family commitments; TP immediately selects the next suitable candidate in NordBase and dispatches without friction.
          </p>
        </div>
      </div>
    </div>
  );
}
