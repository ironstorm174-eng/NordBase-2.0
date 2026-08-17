import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  FileText, 
  Briefcase, 
  Users, 
  UserCheck, 
  MessageSquare, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  GitMerge, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export function Module06Dashboard() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const dashboardSections = [
    { id: 'requests', label: 'New Requests', icon: Inbox, desc: 'Queue of incoming unverified Customer requests from Portal, Phone, or WhatsApp.' },
    { id: 'leads', label: 'Leads', icon: FileText, desc: 'Verified and formatted job opportunities ready for Specialist dispatch.' },
    { id: 'jobs', label: 'Active Jobs', icon: Briefcase, desc: 'Accepted Leads in active execution by Verified Specialists.' },
    { id: 'specialists', label: 'Specialists', icon: UserCheck, desc: 'Directory of local Specialists, verification status, and availability.' },
    { id: 'customers', label: 'Customers', icon: Users, desc: 'Customer contact records, verification history, and address details.' },
    { id: 'chat', label: 'Chat & AI Translator', icon: MessageSquare, desc: 'In-platform messaging with real-time translation for all operational logs.' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Real-time system alerts for urgent events requiring TP action.' },
    { id: 'finances', label: 'Financials', icon: CreditCard, desc: 'Monitor Lead fee collections and territory revenue tracking.' },
    { id: 'rp', label: 'RP Support', icon: GitMerge, desc: 'Direct escalation and support channel with Regional Partner.' }
  ];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 06</span>
            <h3 className="text-xl font-bold text-white font-display">Dashboard — TP Workspace</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          The NordBase Dashboard is your primary operational environment. It brings together requests, leads, jobs, specialists, and communications into a single system of record.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Understand how to navigate the NordBase Dashboard, manage queues efficiently, and maintain NordBase as the absolute single source of truth for all territory operations.
      </div>

      {/* 6.1 Dashboard Overview */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-cyan-400" />
          6.1. Dashboard Area Map
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {dashboardSections.map((sec) => {
            const IconComp = sec.icon;
            return (
              <div key={sec.id} className="bg-[#050A1A] border border-blue-900/30 rounded-xl p-4 hover:border-cyan-500/40 transition-all">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-white text-sm">{sec.label}</h5>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{sec.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6.2 Request Queue & 6.3 Lead Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6">
          <h4 className="text-base font-bold text-white font-display mb-3 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-cyan-400" />
            6.2. Request Queue
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>New Requests appear immediately in the unverified queue with channel source tags (Portal, Phone, WhatsApp).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>Click any Request card to view raw customer information and current verification status.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>Initiate Customer Verification directly from the Request detail screen.</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6">
          <h4 className="text-base font-bold text-white font-display mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            6.3. Lead Management
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>Displays all qualified & formatted Leads prepared for Specialists.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>Shows assigned or targeted Specialists, dispatch status, and offer timers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>Tracks Lead Fee payment status when accepted or declined by a Specialist.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 6.4 Job Management & 6.5 Specialist Directory */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-400" />
          6.4. Job Management vs Lead
        </h4>
        <div className="p-4 bg-slate-900/90 border border-purple-500/30 rounded-xl flex items-center justify-center gap-3 text-xs md:text-sm font-bold text-white text-center">
          <span className="px-3 py-1 bg-slate-800 rounded border border-slate-700">Lead</span>
          <ArrowRight className="w-4 h-4 text-purple-400" />
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/40">Accepted by Specialist</span>
          <ArrowRight className="w-4 h-4 text-purple-400" />
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">Active Job</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          A Job is an accepted Lead that has transitioned into active execution. TPs monitor Job progress, customer-specialist meeting status, and final closure.
        </p>
      </div>

      {/* 6.5 Specialist Directory & 6.6 Chat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6">
          <h4 className="text-base font-bold text-white font-display mb-2 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            6.5. Specialist Directory
          </h4>
          <p className="text-xs text-slate-300 mb-3">
            Find and review local Specialists in your territory:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>• Check verification status (<strong>Verified / Not Verified</strong>)</li>
            <li>• View approved work categories and geographic sub-territory</li>
            <li>• Review active availability and performance history</li>
            <li className="text-slate-500 font-mono text-[11px] pt-1 border-t border-slate-800">[TBD — detailed filtering options require definition]</li>
          </ul>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6">
          <h4 className="text-base font-bold text-white font-display mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            6.6. Chat & AI Translator
          </h4>
          <p className="text-xs text-slate-300 mb-3">
            Integrated messaging for Customer–TP and TP–Specialist operational dialogs with real-time AI translation.
          </p>
          <div className="p-3 bg-cyan-950/40 border-l-2 border-cyan-400 text-xs text-cyan-200 font-bold">
            Important: NordBase is the system of record. External calls/messages must be logged in NordBase.
          </div>
        </div>
      </div>

      {/* 6.7, 6.8, 6.9 Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-xl p-4">
          <h5 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-amber-400" />
            6.7. Notifications
          </h5>
          <p className="text-xs text-slate-400">System alerts for urgent action items like delayed responses or escalations.</p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-xl p-4">
          <h5 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            6.8. Financial Area
          </h5>
          <p className="text-xs text-slate-400">Track Lead Fees and territory transactions. <span className="text-slate-500 font-mono text-[10px]">[TBD — calculations require definition]</span></p>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-xl p-4">
          <h5 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
            <GitMerge className="w-4 h-4 text-cyan-400" />
            6.9. RP Communication
          </h5>
          <p className="text-xs text-slate-400">Direct channel to contact your Regional Partner for operational support or escalations.</p>
        </div>
      </div>

      {/* 6.10 Dashboard Golden Rule Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-[#0A1128] to-cyan-950 border-2 border-cyan-400/50 rounded-2xl p-6 text-center shadow-[0_0_25px_rgba(6,182,212,0.15)]">
        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-2">
          Dashboard Golden Rule:
        </h4>
        <p className="text-lg font-black text-white font-display">
          If it affects a Request, Lead or Job — record it in NordBase.
        </p>
        <p className="text-xs text-slate-300 mt-2">
          Do not rely on memory, personal notes or external spreadsheets for operational information.
        </p>
      </div>

      {/* Practical Scenario / Check */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 06
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          "Three new Requests appear at the same time. What should the TP do first?"
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Correct Action:</strong> The TP inspects the Request queue timestamps and urgency flags. Urgent service requests (e.g., active water leak or gas issue) take immediate priority over standard scheduling. The TP opens the most urgent Request first to initiate live Customer Verification.
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
            Operational data flows continuously into the Dashboard across Requests, Leads, Jobs, Chat, and Financials.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">02</span>
            <h5 className="font-bold text-white text-sm">02. What TP Does</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            Uses the Dashboard as the primary workspace to manage queues, track job progress, verify data, and record every operational detail into NordBase.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">03</span>
            <h5 className="font-bold text-rose-300 text-sm">03. What NOT To Do</h5>
          </div>
          <p className="text-rose-200/80 text-xs leading-relaxed pl-9">
            Do NOT store customer details or job updates in personal paper notes, personal WhatsApp chats, or external spreadsheets outside NordBase.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">04</span>
            <h5 className="font-bold text-amber-300 text-sm">04. When Help Is Needed</h5>
          </div>
          <p className="text-amber-200/80 text-xs leading-relaxed pl-9">
            If experiencing Dashboard technical bugs or display errors, use the RP Communication channel to report the system issue immediately.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-xs font-bold">05</span>
            <h5 className="font-bold text-white text-sm">05. Practical Example</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            A customer calls on the phone to update their gate access code. The TP immediately opens the active Request in the Dashboard and saves the code in the notes tab, ensuring the assigned Specialist receives it automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
