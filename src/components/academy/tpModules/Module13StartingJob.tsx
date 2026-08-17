import React from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  MessageSquare,
  Globe,
  Sparkles,
  Users,
  CheckSquare
} from 'lucide-react';

export function Module13StartingJob() {
  const nextSteps = [
    { title: 'Acceptance Verified', desc: 'Confirm Specialist has explicitly accepted Job status in NordBase.' },
    { title: 'Customer Informed', desc: 'Ensure Customer knows what happens next and who is arriving.' },
    { title: 'Meeting Time Clear', desc: 'Verify both parties understand the exact scheduled arrival window.' },
    { title: 'Information Transferred', desc: 'Check that Specialist possesses all necessary site and access details.' }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 13</span>
            <h3 className="text-xl font-bold text-white font-display">Lead → Job — Starting the Job</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module explains the transition from Lead to Active Job, reviewing job data, establishing next steps, and managing pre-meeting operational continuity.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Master the operational initialization of a Job upon Specialist acceptance, managing communication tools like AI Translator and handling pre-meeting obstacles.
      </div>

      {/* 13.1 What Creates a Job? */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <span className="text-cyan-400 font-mono font-bold text-sm">13.1.</span>
          What Creates a Job?
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          A Job begins when the Specialist accepts the Lead according to the NordBase workflow.
        </p>

        {/* Visual Lifecycle Pipeline */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-3 text-center">Lifecycle Progression</span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2.5 bg-slate-800/80 rounded-lg text-slate-400 border border-slate-700/50">1. Request</div>
            <div className="p-2.5 bg-slate-800/80 rounded-lg text-slate-400 border border-slate-700/50">2. Verification</div>
            <div className="p-2.5 bg-slate-800/80 rounded-lg text-slate-400 border border-slate-700/50">3. Lead</div>
            <div className="p-2.5 bg-purple-950/60 text-purple-300 border border-purple-500/40 font-bold rounded-lg flex items-center justify-center gap-1">
              4. Acceptance <ArrowRight className="w-3 h-3 text-purple-400 hidden sm:inline" />
            </div>
            <div className="p-2.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-bold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              5. Active Job
            </div>
          </div>
        </div>
      </div>

      {/* 13.2 Job Information & 13.3 Confirming Next Steps */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-cyan-400" />
          13.2 & 13.3. Job Review & Operational Next Steps
        </h4>
        <p className="text-xs text-slate-300">
          Immediately after acceptance, the TP reviews the Job entry and verifies four essential operational facts:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {nextSteps.map((step, idx) => (
            <div key={idx} className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
              <span className="font-bold text-cyan-300 text-xs block mb-1">{step.title}</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 13.4 TP's Role After Job Creation */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          13.4. TP's Role After Job Creation
        </h4>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
          <p>
            <strong>The TP does not perform the work.</strong>
          </p>
          <p className="text-slate-400">
            The TP’s role is strictly operational coordination — ensuring that communication remains clear, meeting times are respected, and system statuses are accurately maintained. The Specialist remains solely responsible for performing the physical technical work.
          </p>
        </div>
      </div>

      {/* 13.5 Communication & 13.6 Problems Before Meeting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 13.5 NordBase Chat & AI Translator */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            13.5. NordBase Chat & AI Translator
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Communication channels remain open for all relevant participants. Use <strong>NordBase Chat</strong> where applicable. The integrated <strong>AI Translator</strong> enables smooth dialogue when Customer and Specialist speak different languages.
          </p>
        </div>

        {/* 13.6 Pre-Meeting Problems */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-amber-300 font-display flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            13.6. Handling Pre-Meeting Problems
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            If an issue arises before the meeting: identify the problem, communicate with participants, record facts in NordBase, keep the Job moving, and involve RP if the situation exceeds TP authority.
          </p>
        </div>
      </div>

      {/* Key Principle Banner */}
      <div className="bg-[#0A1128] border border-cyan-500/30 rounded-2xl p-5 text-center space-y-1">
        <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Key Operating Principle</p>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
          <strong>TP coordinates the process.</strong> The Specialist performs the work. The Customer decides whether to contract with the Specialist. <strong>NordBase is not a party to the commercial relationship between Customer and Specialist.</strong>
        </p>
      </div>

      {/* Practical Scenario 13 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 13
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          "A Specialist accepts the Lead. What happens next?"
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Operational Progression:</strong>
          </p>
          <ol className="list-decimal pl-4 space-y-1 text-slate-400">
            <li>The system converts status from <strong>Lead → Job</strong>.</li>
            <li>TP reviews the Job record to verify completeness.</li>
            <li>TP confirms that the Customer knows who is coming and the meeting timeframe is understood.</li>
            <li>TP ensures NordBase Chat (and AI Translator if needed) is available for direct coordination.</li>
            <li>TP monitors operational progression without intervening in technical work execution.</li>
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
            Specialist acceptance creates an active Job, opening direct communication and setting execution timelines.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Reviews Job details, verifies meeting understanding, keeps participants informed, and monitors NordBase Chat.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Do not perform technical work, do not promise unconfirmed arrival times, and do not make technical promises to the Customer.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Involve RP if pre-meeting disputes occur or if either party requests immediate contract cancellation before arrival.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            A Portuguese-speaking Specialist accepts a Job for an English-speaking Customer; TP ensures NordBase Chat with AI Translation is ready for seamless coordination.
          </p>
        </div>
      </div>
    </div>
  );
}
