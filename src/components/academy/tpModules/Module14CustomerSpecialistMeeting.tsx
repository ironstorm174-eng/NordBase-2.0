import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  Clock, 
  MapPin, 
  UserX, 
  FileWarning, 
  MessageSquareHorizontal
} from 'lucide-react';

export function Module14CustomerSpecialistMeeting() {
  const meetingScenarios = [
    {
      title: '14.3. Specialist Is Late',
      icon: Clock,
      color: 'amber',
      text: 'Contact Specialist to obtain an updated situation. Communicate delay to Customer and record information in NordBase.',
      tbd: 'No compensation or penalty rules exist — [TBD — requires definition].'
    },
    {
      title: '14.4. Specialist Does Not Arrive',
      icon: UserX,
      color: 'rose',
      text: 'Establish what happened immediately. Follow the NordBase procedure. If a replacement Specialist is required, activate the replacement workflow.'
    },
    {
      title: '14.5. Customer Is Not Available',
      icon: UserX,
      color: 'purple',
      text: 'Contact Customer. Alert Specialist if needed. Record the situation in NordBase and follow applicable no-show procedures.'
    },
    {
      title: '14.6. Address or Access Problem',
      icon: MapPin,
      color: 'cyan',
      text: 'Contact Customer to clarify directions or gate codes. Record updated access details in NordBase and restore communication.'
    }
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
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 14</span>
            <h3 className="text-xl font-bold text-white font-display">Customer–Specialist Meeting — The Meeting</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module explains the TP’s role during the on-site meeting between Customer and Specialist. The TP does not attend or control technical work; the TP provides operational coordination.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Master handling arrival delays, address navigation, no-shows, and scope divergences while respecting the technical boundaries of the Specialist.
      </div>

      {/* 14.1 Before the Meeting & 14.2 Specialist Arrives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
            <span className="text-cyan-400 font-mono font-bold text-sm">14.1.</span>
            Before the Meeting
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Confirm where applicable: Customer and Specialist know expected arrival time, address is clear, access info (gate/parking) is available, and communication channels are operational.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
            <span className="text-cyan-400 font-mono font-bold text-sm">14.2.</span>
            Specialist Arrives
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Specialist meets the Customer and performs the technical assessment. <strong>The Specialist is solely responsible for technical diagnosis.</strong> The TP does not make technical decisions on behalf of the Specialist.
          </p>
        </div>
      </div>

      {/* Meeting Operational Scenarios (14.3 to 14.6) */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display">
          14.3 – 14.6. Meeting Operational Response Protocols
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {meetingScenarios.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div key={idx} className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {sc.title}
                </span>
                <p className="text-slate-300 leading-relaxed">{sc.text}</p>
                {sc.tbd && (
                  <p className="text-[11px] text-slate-400 font-mono pt-1">
                    <span className="text-slate-300 font-semibold">[TBD — requires definition] </span>
                    {sc.tbd}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 14.7 The Actual Work Is Different */}
      <div className="bg-[#050A1A] border border-amber-900/40 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-mono">
          <FileWarning className="w-5 h-5" />
          14.7. The Actual Work Is Different (Scope Divergence)
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Sometimes the actual situation on site is different from the original Lead description (e.g. Lead describes a simple pipe repair, but the Specialist discovers main line corrosion).
        </p>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
          <p className="text-amber-300 font-bold">
            Critical Rule: The TP must NOT make a technical decision.
          </p>
          <p className="text-slate-400 leading-relaxed">
            The Specialist and Customer must discuss the actual work and commercial consequences directly. NordBase is not a party to their contract. The TP helps maintain communication and records facts in NordBase, but does not decide prices or technical solutions.
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

      {/* Practical Scenario 14 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 14
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          "The Specialist arrives and discovers that the actual problem is significantly larger than described in the Lead. What should TP do?"
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Correct TP Action:</strong>
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li>Refrain from making any technical or pricing decision.</li>
            <li>Advise both parties that technical scope changes and quotes are agreed directly between Customer and Specialist.</li>
            <li>Record the updated scope summary in NordBase notes for accurate record-keeping.</li>
            <li>Assist with communication channels if language support or message logging is needed.</li>
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
            Specialist arrives on site to inspect the problem, meet the Customer, and perform the technical assessment.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Monitors arrival timing, helps resolve access or address issues, records situation logs in NordBase, and keeps lines open.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Do not make technical diagnoses on behalf of Specialist. Do not promise price modifications, penalty refunds, or commercial terms.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Escalate to RP if the Specialist fails to arrive without explanation, or if hostile on-site dispute occurs.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Specialist arrives for a minor fixture fix but finds extensive wiring damage; TP lets Specialist discuss new quote with Customer and logs the update in NordBase.
          </p>
        </div>
      </div>
    </div>
  );
}
