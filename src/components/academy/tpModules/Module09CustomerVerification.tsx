import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  Wrench,
  UserCheck
} from 'lucide-react';

export function Module09CustomerVerification() {
  const checkItems = [
    { title: 'Customer Identity', desc: 'Confirm name and legitimate phone number contact.' },
    { title: 'Location & Address', desc: 'Ensure address is accurate so Specialist can locate the property.' },
    { title: 'Type of Work', desc: 'Confirm specific service required and description of problem.' },
    { title: 'Urgency & Schedule', desc: 'Establish requested date, time, and time sensitivity.' },
    { title: 'Access Information', desc: 'Note gate codes, parking restrictions, or property instructions.' },
    { title: 'Special Conditions', desc: 'Record pets, high ceilings, or specific safety requirements.' }
  ];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 09</span>
            <h3 className="text-xl font-bold text-white font-display">Customer Verification — Verifying the Customer and Request</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          The objective of this critical operational module is to confirm that a real Customer has a real service need before a Lead is offered to a Specialist.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Master request verification, confirm key project details without making technical diagnoses, and protect Specialist time and trust.
      </div>

      {/* 9.1 What Must Be Confirmed */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          9.1. Verification Audit Checklist
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {checkItems.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
              <span className="font-bold text-cyan-300 text-xs block mb-1">{item.title}</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 9.2 Confirm Address & 9.3 Confirm Work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6">
          <h4 className="text-base font-bold text-white font-display mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            9.2. Confirm the Address
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ensure the Specialist will have sufficient address details to physically navigate to the property. Ask for municipality, street, building number, and apartment/unit number.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6">
          <h4 className="text-base font-bold text-white font-display mb-2 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-purple-400" />
            9.3. Confirm the Work
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Understand exactly what the Customer wants done. If the description is vague or ambiguous: <strong>Ask questions before creating the Lead.</strong>
          </p>
        </div>
      </div>

      {/* 9.4 Real Customer, Real Request & 9.5 No Technical Diagnoses */}
      <div className="bg-gradient-to-r from-blue-950 via-[#0A1128] to-cyan-950 border-2 border-cyan-400/50 rounded-2xl p-6 text-center space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
          9.5. Golden Operational Rule:
        </h4>
        <p className="text-base md:text-lg font-black text-white font-display">
          The TP Does Not Diagnose Technical Problems.
        </p>
        <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The TP is not required to be a plumber, electrician, or builder. Your task is to accurately record the Customer's description of the symptoms. Technical diagnosis is handled on-site by the Specialist.
        </p>
      </div>

      {/* 9.6 Process Chain Banner */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-center space-y-2">
        <span className="text-xs font-mono uppercase text-slate-400 font-bold block">Verification Workflow Chain</span>
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-white flex-wrap">
          <span className="px-3 py-1 bg-slate-800 rounded border border-slate-700">Request</span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/40">Customer Verification</span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">Qualified Information</span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/40">Lead</span>
        </div>
      </div>

      {/* Practical Scenario / Check */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 09
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          "The Customer refuses to confirm the address and asks the TP to send a Specialist anyway. What should the TP do?"
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Correct Action:</strong> The TP politely explains that Specialists purchase Leads based on territory and cannot travel without a confirmed address. The TP keeps the Request in <strong>Unverified</strong> status and does NOT convert it into a Lead until the location is confirmed.
          </p>
        </div>
      </div>

      {/* Standard 5-Point Lesson Framework */}
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
            An incoming Request undergoes verification before being converted into a paid Lead for Specialists.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">02</span>
            <h5 className="font-bold text-white text-sm">02. What TP Does</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            Verifies Customer identity, confirms address, clarifies work description, and ensures genuine intent.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">03</span>
            <h5 className="font-bold text-rose-300 text-sm">03. What NOT To Do</h5>
          </div>
          <p className="text-rose-200/80 text-xs leading-relaxed pl-9">
            Do NOT guess technical diagnoses or push unverified address requests to the Specialist marketplace.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">04</span>
            <h5 className="font-bold text-amber-300 text-sm">04. When Help Is Needed</h5>
          </div>
          <p className="text-amber-200/80 text-xs leading-relaxed pl-9">
            If a customer's address is ambiguous or falls outside mapped territory boundaries, check with your RP.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-xs font-bold">05</span>
            <h5 className="font-bold text-white text-sm">05. Practical Example</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            A customer requests "AC repair". The TP asks if the AC is leaking water, making noise, or not blowing cold air. The customer specifies "blowing warm air", which the TP records accurately.
          </p>
        </div>
      </div>
    </div>
  );
}
