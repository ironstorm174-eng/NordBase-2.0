import React from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  FileCheck, 
  Building2, 
  MapPin, 
  XCircle, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Info,
  ShieldAlert
} from 'lucide-react';

export function Module07SpecialistVerification() {
  const verificationPoints = [
    { title: 'Identity', desc: 'Confirm specialist legal identity and contact details.' },
    { title: 'Business Status', desc: 'Must operate as an independent entrepreneur or registered company.' },
    { title: 'Professional Category', desc: 'Verify suitability for specific trade categories offered.' },
    { title: 'Territory', desc: 'Check whether the Specialist actively covers the required geographic zone.' },
    { title: 'Experience & Qualifications', desc: 'Review relevant technical background and certificates.' },
    { title: 'Required Documents', desc: 'Validate required official documentation. [TBD — requires definition]' },
    { title: 'Availability', desc: 'Confirm operational schedule and emergency coverage readiness.' }
  ];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 07</span>
            <h3 className="text-xl font-bold text-white font-display">Specialist Verification — Verifying a Specialist</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          NordBase connects Customers with independent Specialists. The TP performs reasonable verification checks before a Specialist is allowed to receive Leads in their territory.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Understand how to audit and verify Specialist credentials while keeping the distinction clear that verification does not constitute an employment contract or a work guarantee.
      </div>

      {/* 7.1 Why Verification Matters */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6">
        <h4 className="text-base font-bold text-white font-display mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          7.1. Why Verification Matters
        </h4>
        <p className="text-xs text-slate-300 mb-4">
          Verification protects all ecosystem participants and maintains community trust:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="block font-bold text-cyan-300 text-xs">Customers</span>
            <span className="text-[11px] text-slate-400">Safety & authenticity</span>
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="block font-bold text-emerald-300 text-xs">Specialists</span>
            <span className="text-[11px] text-slate-400">Fair competition</span>
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="block font-bold text-purple-300 text-xs">TP & NordBase</span>
            <span className="text-[11px] text-slate-400">Ecosystem integrity</span>
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="block font-bold text-amber-300 text-xs">Local Community</span>
            <span className="text-[11px] text-slate-400">Reputation</span>
          </div>
        </div>
      </div>

      {/* 7.2 Specialist Information & 7.3 Business Status */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-cyan-400" />
          7.2. Verification Criteria
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {verificationPoints.map((pt, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="font-bold text-cyan-300 text-xs block mb-1">{pt.title}</span>
              <p className="text-[11px] text-slate-400">{pt.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7.4 Categories, 7.5 Territory, 7.6 Verification Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-xl p-5">
          <h5 className="font-bold text-white text-sm mb-2">7.4. Categories</h5>
          <p className="text-xs text-slate-300">
            Make sure the Specialist is suitable for the categories offered. Do not assign a Specialist to work they are not qualified or approved to perform.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-xl p-5">
          <h5 className="font-bold text-white text-sm mb-2">7.5. Territory Coverage</h5>
          <p className="text-xs text-slate-300">
            Check whether the Specialist operates within the required geographical area before dispatching a Lead.
          </p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-xl p-5">
          <h5 className="font-bold text-white text-sm mb-2">7.6. Verification Status</h5>
          <div className="flex gap-2 my-2">
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold rounded">Verified</span>
            <span className="px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold rounded">Not Verified</span>
          </div>
          <p className="text-xs text-slate-300">Only Verified Specialists receive Leads.</p>
        </div>
      </div>

      {/* 7.7 Verification Is Not a Guarantee Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-[#0A1128] to-cyan-950 border-2 border-cyan-400/50 rounded-2xl p-6 text-center shadow-[0_0_25px_rgba(6,182,212,0.15)] space-y-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
          Crucial Distinction:
        </h4>
        <p className="text-base md:text-lg font-black text-white font-display">
          Verification does not mean that NordBase guarantees the quality of the Specialist's work.
        </p>
        <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The Specialist remains an independent entrepreneur or company responsible for their own work and contractual relationship with the Customer.
        </p>
      </div>

      {/* 7.8 Recheck Procedure Note */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400">
        <strong className="text-slate-300 block mb-1">7.8. When Verification Must Be Rechecked:</strong>
        If verification information changes or expires, follow the applicable NordBase procedure. <span className="text-cyan-400 font-mono">[TBD — requires definition]</span>
      </div>

      {/* Practical Scenario / Check */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 07
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          "A Specialist wants to receive Leads but their required verification information is incomplete. What should the TP do?"
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Correct Action:</strong> The TP keeps the Specialist status as <strong>Not Verified</strong> and does not send them Leads. The TP clearly informs the Specialist which specific documents or information are missing and guides them on how to submit them for approval.
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
            Specialists apply to receive Leads on NordBase and must undergo verification before receiving order offers.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">02</span>
            <h5 className="font-bold text-white text-sm">02. What TP Does</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            Audits identity, business registration, category skills, and territory coverage. Sets status to Verified only when all requirements are met.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">03</span>
            <h5 className="font-bold text-rose-300 text-sm">03. What NOT To Do</h5>
          </div>
          <p className="text-rose-200/80 text-xs leading-relaxed pl-9">
            Do NOT send Leads to unverified Specialists. Do NOT promise Customers that NordBase guarantees technical craftsmanship.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">04</span>
            <h5 className="font-bold text-amber-300 text-sm">04. When Help Is Needed</h5>
          </div>
          <p className="text-amber-200/80 text-xs leading-relaxed pl-9">
            If in doubt regarding business entity documents or foreign trade licenses, consult the RP for verification guidance.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-xs font-bold">05</span>
            <h5 className="font-bold text-white text-sm">05. Practical Example</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            A painter asks to receive plumbing Leads. The TP checks his category profile, sees he is verified only for Painting, and refuses to dispatch plumbing Leads until the required qualifications are verified.
          </p>
        </div>
      </div>
    </div>
  );
}
