import React from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Heart, 
  GitMerge, 
  Users, 
  Headphones, 
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  Info
} from 'lucide-react';

export function Module03RoleOfTP() {
  const mainResponsibilities = [
    'Receiving Requests',
    'Verifying Requests',
    'Creating quality Leads',
    'Selecting suitable Specialists',
    'Sending Leads to Specialists',
    'Maintaining communication',
    'Monitoring the meeting',
    'Monitoring the progress of the Job',
    'Ensuring the Job is properly completed and closed'
  ];

  const notResponsibleFor = [
    'Does not perform the Specialist\'s technical work',
    'Is not the Specialist\'s employer',
    'Is not a party to the contract between Customer and Specialist',
    'Does not set the Specialist\'s technical standards',
    'Does not make business decisions on behalf of the Specialist'
  ];

  const tpQualities = [
    'Attentiveness',
    'Responsibility',
    'Calm communication',
    'Ability to communicate clearly',
    'Ability to make decisions quickly',
    'Ability to handle difficult situations',
    'Respect for other participants'
  ];

  return (
    <div className="space-y-8">
      {/* 1. Who is a TP? */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Operational Identity</span>
            <h3 className="text-xl font-bold text-white font-display">Who is a TP?</h3>
          </div>
        </div>

        <p className="text-slate-200 text-sm leading-relaxed mb-4">
          TP means <strong>Territory Partner</strong>. A TP is an independent entrepreneur responsible for the operation and development of NordBase within their designated territory.
        </p>

        {/* Connection Flow Box */}
        <div className="bg-[#0A1128] border border-cyan-500/30 rounded-xl p-4 my-4">
          <p className="text-xs font-mono text-cyan-400 font-bold uppercase mb-2">The TP Operational Bridge:</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-center text-sm font-bold text-white">
            <span className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700">Customer</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/40">NordBase TP</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700">Specialist</span>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          The TP manages the operational process from the initial <strong>Request</strong> through to the successful completion and closure of the <strong>Job</strong>.
        </p>
      </div>

      {/* 2. Main Responsibility vs What TP is NOT responsible for */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Responsibilities */}
        <div className="bg-[#050A1A] border border-emerald-900/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h4 className="text-base font-bold text-white font-display">Main Responsibilities</h4>
          </div>

          <p className="text-xs text-slate-400 mb-4">The TP is actively responsible for:</p>

          <ul className="space-y-2 text-sm text-slate-200">
            {mainResponsibilities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What TP is NOT responsible for */}
        <div className="bg-[#050A1A] border border-rose-900/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-rose-400">
            <XCircle className="w-5 h-5" />
            <h4 className="text-base font-bold text-rose-300 font-display">What the TP is NOT Responsible For</h4>
          </div>

          <p className="text-xs text-slate-400 mb-4">The TP explicitly does NOT take on these roles:</p>

          <ul className="space-y-2.5 text-sm text-slate-300">
            {notResponsibleFor.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 border-t border-rose-900/30 text-xs text-rose-200 font-medium">
            <strong>Key Rule:</strong> The Specialist is an independent entrepreneur or company, not an employee.
          </div>
        </div>
      </div>

      {/* 3. TP works with people */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Heart className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold text-white font-display">TP Works With People</h4>
        </div>

        <p className="text-slate-300 text-sm mb-4">Essential human and communication qualities required for a TP:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tpQualities.map((qual, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-cyan-200 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              {qual}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Relationships: TP & RP, TP & Specialist, TP & Customer */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-white uppercase font-mono tracking-wider text-slate-400">
          Operational Relationships
        </h4>

        {/* TP and RP */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <h5 className="text-sm font-bold text-cyan-300 mb-2 flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-cyan-400" />
            TP and RP (Regional Partner)
          </h5>
          <p className="text-slate-300 text-xs leading-relaxed">
            The RP is responsible for the development of the region. The TP is responsible for the operation of their territory. The TP contacts the RP when an issue goes beyond the TP's authority or requires regional support.
          </p>
        </div>

        {/* TP and Specialist */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <h5 className="text-sm font-bold text-emerald-300 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            TP and Specialist
          </h5>
          <p className="text-slate-300 text-xs leading-relaxed">
            The Specialist is an independent entrepreneur or company. The TP selects suitable Specialists for Leads and coordinates the operational process.
          </p>
        </div>

        {/* TP and Customer */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <h5 className="text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
            <Headphones className="w-4 h-4 text-purple-400" />
            TP and Customer
          </h5>
          <p className="text-slate-300 text-xs leading-relaxed">
            The TP is the main operational contact for the Customer. The TP's task is to understand the Customer's problem, correctly process the Request and ensure the next steps are completed.
          </p>
        </div>
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
            Requests arrive from Customers and need structured operational coordination to reach qualified Specialists efficiently.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">02</span>
            <h5 className="font-bold text-white text-sm">02. What TP Does</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            Coordinates the operational bridge: processes Requests, verifies details, creates quality Leads, selects Specialists, and monitors Job execution.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">03</span>
            <h5 className="font-bold text-rose-300 text-sm">03. What NOT To Do</h5>
          </div>
          <p className="text-rose-200/80 text-xs leading-relaxed pl-9">
            Do NOT attempt to perform technical service work yourself under a Customer Request. Do NOT direct or manage the Specialist's internal technical methods.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">04</span>
            <h5 className="font-bold text-amber-300 text-sm">04. When Help Is Needed</h5>
          </div>
          <p className="text-amber-200/80 text-xs leading-relaxed pl-9">
            Contact your RP if a territory operational issue exceeds your authority or requires regional/legal escalation.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-xs font-bold">05</span>
            <h5 className="font-bold text-white text-sm">05. Practical Example</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            A customer asks the TP during a verification call to guarantee a technical price for electrical work. The TP explains that the Lead details will allow an independent Specialist to inspect and provide an exact quote.
          </p>
        </div>
      </div>
    </div>
  );
}
