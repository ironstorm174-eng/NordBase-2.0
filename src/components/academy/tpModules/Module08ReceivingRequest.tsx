import React from 'react';
import { 
  Inbox, 
  Globe, 
  PhoneCall, 
  MessageSquare, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  ArrowRight
} from 'lucide-react';

export function Module08ReceivingRequest() {
  const channels = [
    { 
      name: '1. NordBase Portal', 
      icon: Globe, 
      desc: 'Customer submits a Request form directly through the website or mobile app.',
      color: 'text-cyan-400' 
    },
    { 
      name: '2. Phone', 
      icon: PhoneCall, 
      desc: 'Customer calls NordBase by phone. TP speaks with Customer and records information.',
      color: 'text-emerald-400' 
    },
    { 
      name: '3. WhatsApp', 
      icon: MessageSquare, 
      desc: 'Customer sends a WhatsApp message. TP interacts and logs details into NordBase.',
      color: 'text-purple-400' 
    }
  ];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 08</span>
            <h3 className="text-xl font-bold text-white font-display">Receiving a Request — Getting a New Customer Request</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module marks the start of the operational workflow. Requests enter NordBase through three primary channels, and the TP converts raw contact into structured operational records.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Master initial customer engagement across channels, filter out invalid/accidental requests, and ensure all communication is captured in NordBase as the single system of record.
      </div>

      {/* Incoming Channels */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-white font-display">Incoming Request Channels</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {channels.map((chan, idx) => {
            const IconComp = chan.icon;
            return (
              <div key={idx} className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center ${chan.color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-white text-sm">{chan.name}</h5>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{chan.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8.1 Important Principle Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-[#0A1128] to-cyan-950 border-2 border-cyan-400/50 rounded-2xl p-6 text-center shadow-[0_0_25px_rgba(6,182,212,0.15)] space-y-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
          Core Operational Principle:
        </h4>
        <p className="text-base md:text-lg font-black text-white font-display">
          Phone and WhatsApp are communication channels.<br/>
          NordBase is the operational system of record.
        </p>
        <p className="text-xs text-slate-300">
          Do not leave important information only in WhatsApp messages or personal notes.
        </p>
      </div>

      {/* 8.2 First Contact Checklist & 8.3 Understand the Problem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6">
          <h4 className="text-base font-bold text-white font-display mb-3">
            8.2. First Contact Objectives
          </h4>
          <p className="text-xs text-slate-400 mb-3">Establish the 6 essential facts immediately:</p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span><strong>Who</strong> is the Customer (name & contact)?</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span><strong>What</strong> do they actually need done?</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span><strong>Where</strong> is the work required (location)?</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span><strong>How urgent</strong> is the situation?</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span><strong>When</strong> is the work requested?</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span><strong>Which</strong> trade category applies?</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display">
            8.3 & 8.4. Problem Understanding & Quality
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Do not immediately jump to searching for a Specialist. First ask clear, practical questions to understand what the Customer actually needs.
          </p>
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400">
            A Request is <strong>not ready</strong> to become a Lead simply because a Customer contacted NordBase. Information quality must be verified first.
          </div>
        </div>
      </div>

      {/* 8.5 Live Communication & 8.6 Initial Request Status */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display">
          8.5. Live Communication & Filtering Fake Requests
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Where required, establish live verbal or messaging communication to distinguish real service needs from accidental requests, incomplete entries, joke submissions, or potential fraud.
        </p>

        <div className="p-4 bg-slate-900/90 border border-cyan-500/30 rounded-xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="px-2.5 py-1 bg-slate-800 rounded">Incomplete Request</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/40">Customer Verification</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">Qualified Lead</span>
          </div>
        </div>
      </div>

      {/* Practical Scenario / Check */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 08
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          "A Customer sends a WhatsApp message saying: 'Need electrician urgently.' What information should the TP obtain before creating a Lead?"
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Correct Action:</strong> The TP asks:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li>What electrical problem occurred? (e.g., short circuit, outlet sparks, power out)</li>
            <li>Where is the property located (exact street address & municipality)?</li>
            <li>Is it safe right now or does it pose an immediate fire hazard?</li>
            <li>What time can the Specialist access the property?</li>
          </ul>
          <p className="pt-1">All answers are recorded in NordBase before proceeding to Customer Verification.</p>
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
            Customers reach out via Portal, Phone call, or WhatsApp message seeking trade services.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">02</span>
            <h5 className="font-bold text-white text-sm">02. What TP Does</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            Initiates first contact, asks clarifying questions, filters out invalid inquiries, and logs all details into NordBase.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">03</span>
            <h5 className="font-bold text-rose-300 text-sm">03. What NOT To Do</h5>
          </div>
          <p className="text-rose-200/80 text-xs leading-relaxed pl-9">
            Do NOT instantly convert raw unverified contact into a Lead without establishing real customer intent and basic details.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">04</span>
            <h5 className="font-bold text-amber-300 text-sm">04. When Help Is Needed</h5>
          </div>
          <p className="text-amber-200/80 text-xs leading-relaxed pl-9">
            If a request contains suspicious safety risks or potential harassment, flag it for RP security review.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-xs font-bold">05</span>
            <h5 className="font-bold text-white text-sm">05. Practical Example</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            A customer submits a portal form saying "Fix door". The TP calls the customer, learns the lock is jammed on the front door, writes this down in the NordBase Request file, and moves it to Customer Verification.
          </p>
        </div>
      </div>
    </div>
  );
}
