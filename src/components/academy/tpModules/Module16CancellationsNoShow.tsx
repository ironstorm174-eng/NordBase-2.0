import React from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  PhoneOff, 
  CalendarX, 
  RefreshCw, 
  UserX, 
  Clock, 
  MessageSquare
} from 'lucide-react';

export function Module16CancellationsNoShow() {
  const customerCancelSteps = [
    'Confirm the cancellation with the Customer',
    'Record relevant information and cancellation reason in NordBase',
    'Inform the Specialist immediately if one was already assigned',
    'Update the relevant Job status in NordBase system',
    'Follow the established NordBase cancellation procedure'
  ];

  const specialistCancelSteps = [
    'Establish what happened and document the Specialist’s reason',
    'Inform the Customer promptly with professionalism',
    'Determine whether another suitable Specialist can be dispatched',
    'Update the relevant status in NordBase',
    'Escalate to Regional Partner (RP) when necessary'
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 16</span>
            <h3 className="text-xl font-bold text-white font-display">Cancellations & No-Show — Handling Interruptions</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module details operational protocols for handling Customer cancellations, Specialist cancellations, site no-shows, and schedule adjustments cleanly.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Master operational recovery procedures when a planned Job does not proceed normally, restoring communication and updating statuses without assigning blame or inventing financial guarantees.
      </div>

      {/* 16.1 Customer Cancellation */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <CalendarX className="w-5 h-5 text-cyan-400" />
          16.1. Customer Cancellation Protocol
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          When a Customer requests to cancel a scheduled Job, the TP must execute standard operational steps cleanly and record all facts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {customerCancelSteps.map((step, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-slate-300">
              <div className="w-5 h-5 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className="p-3 bg-amber-950/30 border border-amber-900/40 rounded-xl text-xs text-amber-200/90 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span><strong>Strict Prohibition:</strong> Do not invent refund or Lead Fee rules. Follow established NordBase policies exclusively.</span>
        </div>
      </div>

      {/* 16.2 Specialist Cancellation */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <UserX className="w-5 h-5 text-cyan-400" />
          16.2. Specialist Cancellation Protocol
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          If an assigned Specialist is unable to perform the Job due to an emergency or conflict, TP acts quickly to maintain Customer trust.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {specialistCancelSteps.map((step, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 16.3 & 16.4 No-Show Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer No-Show */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
            <PhoneOff className="w-4 h-4 text-amber-400" />
            16.3. Customer No-Show
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            If the Specialist arrives on site but the Customer is unavailable or unresponsive:
          </p>
          <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
            <li>Attempt to contact the Customer on recorded phone numbers;</li>
            <li>Establish what happened or check for site access notes;</li>
            <li>Keep the Specialist informed on status while waiting;</li>
            <li>Record the situation and timestamps in NordBase;</li>
            <li>Follow the applicable platform no-show procedure.</li>
          </ul>
        </div>

        {/* Specialist No-Show */}
        <div className="bg-[#050A1A] border border-rose-900/40 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-rose-300 font-display flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            16.4. Specialist No-Show
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            If the Specialist fails to arrive at the scheduled meeting time:
          </p>
          <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
            <li>Contact the Specialist immediately to establish cause;</li>
            <li>Inform the Customer politely with progress updates;</li>
            <li>Determine whether an immediate replacement is possible;</li>
            <li>Log the incident details in NordBase;</li>
            <li>Escalate severe or uncommunicated no-shows to RP.</li>
          </ul>
        </div>
      </div>

      {/* 16.5 Rescheduling */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          16.5. Rescheduling Protocol
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          If both Customer and Specialist agree to reschedule the meeting or work timeframe:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-300">
            <strong className="text-cyan-400 block mb-1">1. Record New Info</strong>
            Log updated dates and times in NordBase Job notes.
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-300">
            <strong className="text-cyan-400 block mb-1">2. Mutual Confirmation</strong>
            Confirm both sides clearly acknowledge the new timing.
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-300">
            <strong className="text-cyan-400 block mb-1">3. Update Status</strong>
            Adjust the system schedule status accordingly.
          </div>
        </div>
        <p className="text-[11px] text-amber-300/90 pt-1">
          <strong>Rule:</strong> Do not promise monetary compensation unless an approved NordBase policy explicitly exists.
        </p>
      </div>

      {/* Key Principle Banner */}
      <div className="bg-[#0A1128] border border-cyan-500/30 rounded-2xl p-5 text-center space-y-1">
        <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Key Operating Principle</p>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
          <strong>The TP's job is to restore communication and keep the operational process moving.</strong> The TP does not automatically assign blame.
        </p>
      </div>

      {/* Practical Scenario 16 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 16
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          "The Specialist arrives at the Customer's address at the agreed time, but nobody answers the door or phone. What is the correct sequence of actions for the TP?"
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Correct TP Action Sequence:</strong>
          </p>
          <ol className="list-decimal pl-4 space-y-1 text-slate-300">
            <li>Acknowledge the Specialist's message and check the Job file for secondary contact details or gate codes.</li>
            <li>Attempt direct phone contact with the Customer to verify if they are nearby or delayed.</li>
            <li>Keep the Specialist informed while maintaining a reasonable grace period.</li>
            <li>If the Customer remains unresponsive, log the Customer No-Show event with timestamps in NordBase.</li>
            <li>Update the Job status and advise the Specialist on next steps without arguing or promising unauthorized monetary payouts.</li>
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
            A scheduled Job encounters an obstacle such as a Customer cancellation, Specialist unavailability, site no-show, or time shift.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Establishes facts neutrally, contacts both participants, logs exact timestamps and details in NordBase, updates system status, and arranges replacements or reschedules when possible.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Do not assign blame automatically, do not make unauthorized refund promises, do not invent custom lead fee rules, and do not argue with either party.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Escalate to RP if repeat cancellations occur, severe disputes emerge over site access, or emergency replacement dispatch fails.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            A Customer calls 15 minutes before the meeting to cancel due to a family emergency; TP logs the reason in NordBase, notifies the Specialist right away to save travel, and updates the Job status.
          </p>
        </div>
      </div>
    </div>
  );
}
