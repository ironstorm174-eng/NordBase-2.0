import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Info, 
  Scale, 
  FileText, 
  XCircle, 
  MessageSquare, 
  DollarSign, 
  Building2,
  ShieldCheck
} from 'lucide-react';

export function Module17Disputes() {
  const typicalDisputes = [
    'Customer is unhappy with work quality',
    'Specialist claims work is complete, Customer disagrees',
    'Disagreement about final price or additional tasks',
    'Allegations of accidental property damage on site',
    'Customer has not paid the agreed amount to Specialist',
    'Specialist claims payment was not received',
    'Customer requests a full or partial refund',
    'Disagreement over original job scope vs performed work',
    'Interpersonal friction or argument between participants'
  ];

  const tpProhibitions = [
    'Automatically take the Customer’s side',
    'Automatically take the Specialist’s side',
    'Decide who is legally or technically right',
    'Determine technical liability or workmanship quality',
    'Promise a refund on behalf of NordBase or Specialist',
    'Promise financial compensation to either party',
    'Negotiate a commercial settlement on behalf of NordBase'
  ];

  const tpAllowedActions = [
    'Listen attentively to both sides with calm professionalism',
    'Maintain a completely neutral stance at all times',
    'Keep communication respectful and focused on facts',
    'Record relevant factual information accurately in NordBase',
    'Provide existing information already available in system logs',
    'Help maintain open communication channels between parties',
    'Escalate platform-related rule violations to RP/Admin'
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 17</span>
            <h3 className="text-xl font-bold text-white font-display">Disputes — Customer & Specialist Disputes</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module clearly defines the boundary between NordBase as an operational software platform and the private commercial contract between Customer and Specialist.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Maintain absolute neutrality during participant disagreements, recording objective facts in NordBase without taking sides, deciding liability, or making monetary commitments.
      </div>

      {/* 17.1 NordBase Is Not a Party */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Building2 className="w-5 h-5 text-cyan-400" />
          17.1. Independent Commercial Relationship
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Customer and Specialist are independent contracting parties. The Specialist is an independent entrepreneur or company, not an employee or subcontractor of NordBase.
        </p>
        
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
          <p className="font-bold text-white mb-1">The commercial relationship concerning:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 font-mono text-[11px]">
            <span className="p-2 bg-slate-800/80 rounded border border-slate-700/60 text-center">Price & Scope</span>
            <span className="p-2 bg-slate-800/80 rounded border border-slate-700/60 text-center">Quality & Warranty</span>
            <span className="p-2 bg-slate-800/80 rounded border border-slate-700/60 text-center">Payment & Refunds</span>
            <span className="p-2 bg-slate-800/80 rounded border border-slate-700/60 text-center">Damages & Liability</span>
          </div>
          <p className="pt-2 text-cyan-300 font-semibold text-center">
            is strictly between Customer and Specialist. <strong>NordBase is not a party to this relationship.</strong>
          </p>
        </div>
      </div>

      {/* 17.2 Typical Disputes */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          17.2. Typical Commercial Disputes
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {typicalDisputes.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2 text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 17.3 & 17.4 What TP Must NOT Do vs What TP CAN Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prohibitions */}
        <div className="bg-[#050A1A] border border-rose-900/40 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-rose-300 font-display flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-400" />
            17.3. What TP Must NOT Do
          </h4>
          <ul className="space-y-2 text-xs">
            {tpProhibitions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-rose-200/90">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Allowed Actions */}
        <div className="bg-[#050A1A] border border-emerald-900/40 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-emerald-300 font-display flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            17.4. What TP CAN Do
          </h4>
          <ul className="space-y-2 text-xs">
            {tpAllowedActions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-emerald-200/90">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 17.5 When NordBase Can Intervene */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-purple-300 font-display flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple-400" />
          17.5. When NordBase Can Intervene
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          NordBase does not arbitrate private commercial quality disputes, but platform administration MAY intervene when the issue involves platform safety or rules:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-purple-200/90">
          <div className="p-2.5 bg-purple-950/30 border border-purple-900/40 rounded-xl text-center">Misuse of Platform</div>
          <div className="p-2.5 bg-purple-950/30 border border-purple-900/40 rounded-xl text-center">Suspected Fraud</div>
          <div className="p-2.5 bg-purple-950/30 border border-purple-900/40 rounded-xl text-center">Harassment & Threats</div>
          <div className="p-2.5 bg-purple-950/30 border border-purple-900/40 rounded-xl text-center">Rule Violations</div>
        </div>
      </div>

      {/* Golden Rule Banner */}
      <div className="bg-[#0A1128] border border-cyan-500/30 rounded-2xl p-5 text-center space-y-2">
        <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Golden Rule</p>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-2xl mx-auto">
          <strong>NordBase coordinates the platform.
          The Specialist performs the work.
          The Customer contracts with the Specialist.
          Commercial disputes belong to the Customer and Specialist.</strong>
        </p>
      </div>

      {/* Practical Scenario 17 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 17
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          A Customer contacts TP and states: "The Specialist did a bad job. I want NordBase to refund my money." What can and cannot the TP do?
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl space-y-2 text-emerald-200/90">
            <strong className="text-emerald-400 block font-mono uppercase tracking-wide">What TP CAN Do:</strong>
            <ul className="list-disc pl-4 space-y-1">
              <li>Listen calmly and record the Customer's reported points in NordBase notes.</li>
              <li>Politely explain that the commercial contract for work and payment is directly between Customer and Specialist.</li>
              <li>Contact the Specialist to hear their perspective on the job completion.</li>
              <li>Help maintain polite dialogue so both sides can negotiate directly.</li>
              <li>Escalate to RP if there are indications of fraud or platform rule breaches.</li>
            </ul>
          </div>

          <div className="p-4 bg-rose-950/20 border border-rose-900/30 rounded-xl space-y-2 text-rose-200/90">
            <strong className="text-rose-400 block font-mono uppercase tracking-wide">What TP CANNOT Do:</strong>
            <ul className="list-disc pl-4 space-y-1">
              <li>Promise a monetary refund from NordBase.</li>
              <li>Conclude that the Specialist is legally at fault.</li>
              <li>Guarantee monetary compensation or penalty.</li>
              <li>Take sides or accuse either party during calls.</li>
              <li>Commit NordBase to financial or legal liability.</li>
            </ul>
          </div>
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
            A disagreement arises between Customer and Specialist regarding price, work quality, delay, or completion status.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Listens neutrally to both sides, logs factual information in NordBase system records, and keeps communication professional without taking sides.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Do not decide legal fault, do not judge workmanship quality, do not promise refunds or compensation, and do not commit NordBase to commercial settlements.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Escalate to RP/Admin if there is platform abuse, fraud, threats, severe rule violations, or safety concerns requiring account moderation.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            A Customer demands a refund for a painted door; TP records the facts, reminds both parties that quality standards are agreed directly between them, and encourages direct negotiation.
          </p>
        </div>
      </div>
    </div>
  );
}
