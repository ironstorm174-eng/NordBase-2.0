import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  UserX, 
  Share2, 
  AlertTriangle, 
  HelpCircle, 
  Key, 
  FileLock, 
  CheckCircle2, 
  XCircle,
  ShieldAlert
} from 'lucide-react';

export function Module24SecurityPrivacy() {
  const protectedDataCategories = [
    'Customer contact details (phone numbers, emails)',
    'Specialist contact details & personal identity data',
    'Exact property addresses & access instructions',
    'Private chat transcripts & translation history',
    'Payment details, transaction IDs & invoice records',
    'TP Dashboard credentials & authentication tokens',
    'Internal NordBase system logs & operational metadata'
  ];

  const securityMandates = [
    'Protect login credentials with strong unique passwords',
    'Never share your password or Dashboard session with anyone',
    'Use strictly your own personal authorized TP account',
    'Lock or log out of your computer when stepping away from workspace',
    'Report any suspicious or unrecognized account login activity immediately'
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 24</span>
            <h3 className="text-xl font-bold text-white font-display">Security & Privacy — Protecting Participants and Information</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module details strict data protection standards, GDPR/privacy compliance, account security rules, and unauthorized access safeguards required of every Territory Partner.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Safeguard sensitive participant data, maintain strict account security, prevent unauthorized access to the Dashboard, and handle privacy incidents responsibly.
      </div>

      {/* Golden Rule Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/40 rounded-2xl p-6 text-center space-y-2">
        <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">The Golden Rule of Privacy</div>
        <blockquote className="text-base sm:text-lg font-bold text-white font-display">
          “If you would not give the information to a stranger, do not expose it unnecessarily.”
        </blockquote>
      </div>

      {/* 24.1 Protected Information */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <FileLock className="w-5 h-5 text-cyan-400" />
          24.1. Information That Must Be Protected
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          TPs have operational access to sensitive data. The following data points must be kept strictly confidential:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {protectedDataCategories.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center gap-2.5 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 24.2 Account Security */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Key className="w-5 h-5 text-cyan-400" />
          24.2. Account Credentials & Workstation Security
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Every TP must enforce personal security protocols to protect account access:
        </p>

        <div className="space-y-2 text-xs">
          {securityMandates.map((mandate, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center gap-2.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{mandate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 24.3 & 24.4 Unauthorized Access & Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Unauthorized Access */}
        <div className="bg-[#050A1A] border border-rose-900/40 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-sm">
            <UserX className="w-5 h-5" />
            <span>24.3. Unauthorized Access</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Never allow family members, friends, or third parties to use your TP account. Do not leave Dashboard screens visible to unauthorized onlookers.
          </p>
          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-xs text-rose-200">
            Account sharing or leaving client data exposed is a severe security violation.
          </div>
        </div>

        {/* Information Sharing */}
        <div className="bg-[#050A1A] border border-amber-900/40 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-sm">
            <Share2 className="w-5 h-5" />
            <span>24.4. Information Sharing & Privacy</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Only share information when explicitly required for legitimate operational work. Never copy participant details into personal notes or external messaging groups without operational cause.
          </p>
          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-200">
            Do not forward private chat logs or personal phone numbers to third parties.
          </div>
        </div>
      </div>

      {/* 24.5 Suspicious Activity */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          24.5. Reporting Security Breaches or Suspicious Activity
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          If you suspect account compromise, unauthorized access, data misuse, or a platform security vulnerability, immediately escalate the incident to your Regional Partner and NordBase Security.
        </p>
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono">
          Specific automated breach containment workflows: <strong className="text-amber-400 not-italic font-mono">TBD — requires definition</strong>
        </div>
      </div>

      {/* Practical Scenario 24 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 24
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          A personal friend asks a TP for the phone number and property address of a Customer involved in an active Job. Can the TP provide this information? Why or why not?
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p className="font-bold text-rose-400 text-sm">Decision & Reason:</p>
          <p className="leading-relaxed">
            <strong>NO, absolutely NOT.</strong> Participant contact details and addresses are strictly confidential operational data protected under privacy laws (GDPR) and NordBase terms. Sharing client data with unauthorized third parties or personal acquaintances is a severe security breach that will lead to account suspension.
          </p>
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
            TP handles sensitive customer addresses, phone numbers, specialist credentials, and job logs during daily work.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Protects login credentials, locks workstations, restricts data sharing strictly to operational needs, and reports suspicious activity.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Never share passwords, allow unauthorized persons to view the Dashboard, or copy client details into personal chats.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Report immediately to RP and Security if you notice unauthorized login attempts, password leaks, or suspected fraud.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            A TP steps away for a coffee break; the TP locks their screen (`Win + L` / `Cmd + Ctrl + Q`) so client addresses on the screen remain confidential.
          </p>
        </div>
      </div>
    </div>
  );
}
