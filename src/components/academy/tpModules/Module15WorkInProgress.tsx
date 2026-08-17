import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  MessageSquare, 
  DollarSign, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

export function Module15WorkInProgress() {
  const monitoringPoints = [
    'Communication remains accessible between participants',
    'The on-site meeting occurred as scheduled',
    'Work has actively started on location',
    'Unexpected delays or obstacles are communicated promptly',
    'The Job is not unnecessarily stalled or abandoned',
    'Relevant system statuses are updated in NordBase'
  ];

  const escalationTriggers = [
    'The situation exceeds the TP’s authorized scope',
    'There is a serious platform-related or technical system failure',
    'There is suspected fraud, misconduct, or abuse',
    'A participant may have violated official NordBase rules',
    'Operational continuity cannot be restored through standard dialogue',
    'Regional support (RP) is needed to arbitrate severe deadlocks'
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 15</span>
            <h3 className="text-xl font-bold text-white font-display">Work in Progress — Monitoring the Job</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module explains what the TP monitors while the Specialist is performing active work, defining operational coordination boundaries and RP escalation triggers.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Maintain operational process supervision during active jobs without making technical or commercial commitments, handling communications neutrally and escalating severe issues to RP.
      </div>

      {/* 15.1 Coordinator vs Technician */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <span className="text-cyan-400 font-mono font-bold text-sm">15.1.</span>
          TP Is a Coordinator, Not the Technician
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Specialist is responsible for performing the actual work. The TP is responsible for operational coordination.
        </p>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
          <span className="font-bold text-rose-400 block mb-1 uppercase tracking-wide font-mono">Strict Prohibitions — The TP does NOT:</span>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li>Instruct the Specialist how to perform technical work;</li>
            <li>Guarantee technical results or work durability;</li>
            <li>Approve technical methods or engineering decisions;</li>
            <li>Negotiate technical solutions on behalf of the Specialist.</li>
          </ul>
        </div>
      </div>

      {/* 15.2 What TP Monitors */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-cyan-400" />
          15.2. Operational Monitoring Indicators
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {monitoringPoints.map((pt, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 15.3 & 15.4 Customer & Specialist Communication */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            15.3. Customer Communication
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            If the Customer contacts TP during the Job: listen carefully, understand the issue, record facts in NordBase, communicate with Specialist when appropriate, and keep the process moving. <strong>Do not automatically take the Customer’s side.</strong>
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            15.4. Specialist Communication
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            If the Specialist reports a problem: listen, understand the situation, record relevant information, communicate with the Customer when appropriate, and involve RP if the situation exceeds TP authority.
          </p>
        </div>
      </div>

      {/* 15.5 Technical & 15.6 Commercial Decisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display">
            15.5. Technical Decisions
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Technical decisions belong exclusively to the Specialist and Customer. The TP should never pretend to be a technical expert or give engineering opinions.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-amber-900/40 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-amber-300 font-display flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            15.6. Commercial Boundaries
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The commercial relationship is strictly between Customer and Specialist. NordBase is not a party to that contract.
          </p>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            <strong>TP does NOT:</strong> set prices, guarantee prices, negotiate commercial agreements, promise refunds, or accept liability for work quality.
          </p>
        </div>
      </div>

      {/* 15.7 Escalation Triggers to RP */}
      <div className="bg-[#050A1A] border border-rose-900/40 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-rose-300 font-display flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          15.7. When TP Must Escalate to RP
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {escalationTriggers.map((trig, idx) => (
            <div key={idx} className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl flex items-start gap-2 text-rose-200/90">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{trig}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Principle Banner */}
      <div className="bg-[#0A1128] border border-cyan-500/30 rounded-2xl p-5 text-center space-y-1">
        <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Key Operating Principle</p>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
          <strong>TP coordinates the process.</strong> The Specialist performs the work. The Customer decides whether to contract with the Specialist. <strong>NordBase is not a party to the commercial relationship between Customer and Specialist.</strong>
        </p>
      </div>

      {/* Practical Scenario 15 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 15
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          "The Customer contacts TP during the work and says they disagree with the Specialist about the work being performed. What is TP's role?"
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Correct Action:</strong>
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li>Listen attentively and remain neutral without taking sides or offering technical opinions.</li>
            <li>Record the facts reported by the Customer in NordBase system notes.</li>
            <li>Communicate with the Specialist to understand their perspective on the situation.</li>
            <li>Remind both parties that technical scope and agreements belong directly to them.</li>
            <li>Keep the operational process moving through constructive direct dialogue, escalating to RP if there is rule violation or unresolvable deadlock.</li>
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
            The Specialist executes active technical work on site while the TP maintains operational process monitoring.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Monitors communication, logs operational status updates, listens neutrally to participant reports, and keeps the job moving smoothly.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Do not instruct technical execution, do not set/guarantee prices, do not offer refunds or promise technical outcomes, and do not take sides automatically.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Escalate immediately to RP if there is suspected fraud, platform breakdown, rule violations, or unresolvable operational deadlocks.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            A Customer contacts TP complaining about noise levels; TP listens neutrally, notes the call in NordBase, contacts the Specialist to check progress, and helps maintain polite communication.
          </p>
        </div>
      </div>
    </div>
  );
}
