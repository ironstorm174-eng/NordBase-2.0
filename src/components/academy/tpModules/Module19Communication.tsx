import React from 'react';
import { 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  Globe, 
  Sparkles, 
  Phone, 
  Lock, 
  Volume2, 
  UserCheck
} from 'lucide-react';

export function Module19Communication() {
  const conflictSteps = [
    { step: '1. Listen', desc: 'Allow the caller or sender to explain their situation fully without interruption.' },
    { step: '2. Clarify Facts', desc: 'Ask concise, neutral questions to verify specific dates, scope, and status.' },
    { step: '3. Remain Neutral', desc: 'Avoid agreeing with accusations or making emotional comments about either party.' },
    { step: '4. Record Info', desc: 'Log essential details, timestamps, and quotes directly into NordBase.' },
    { step: '5. Explain TP Scope', desc: 'Politely state the operational role of TP and platform boundaries.' },
    { step: '6. Escalate', desc: 'Involve RP/Admin if there are safety threats, rule breaches, or unresolvable deadlocks.' }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 19</span>
            <h3 className="text-xl font-bold text-white font-display">Communication — Channels, AI & Etiquette</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module outlines professional communication standards across NordBase Chat, AI Translator, phone, WhatsApp, conflict resolution protocols, and data privacy.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Communicate politely, neutrally, and effectively using NordBase official tools, leveraging AI translation for cross-lingual coordination while upholding confidentiality.
      </div>

      {/* 19.1 Communication Channels & NordBase as System of Record */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <span className="text-cyan-400 font-mono font-bold text-sm">19.1.</span>
          Official Communication Channels
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          TPs interact with Customers and Specialists through three primary channels:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <MessageSquare className="w-4 h-4" />
              <span>NordBase Chat</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Official system chat for operational messaging, job details, scheduling, and AI translation.
            </p>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Phone className="w-4 h-4" />
              <span>Phone Calls</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Used for immediate live customer verification, site arrival check-ins, or urgent operational updates.
            </p>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Secondary messaging channel for quick coordination, photo exchanges, and direction clarification.
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>System of Record Rule:</strong> Phone and WhatsApp are useful for immediate contact, but important operational details must <strong>never remain only in private conversations</strong>. All critical facts must be logged into NordBase.
          </span>
        </div>
      </div>

      {/* 19.2 AI Translator */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          19.2. AI-Powered Translator Function
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          NordBase Chat features built-in AI translation, enabling Customers and Specialists who speak different languages (e.g. Portuguese, English, Russian) to communicate seamlessly.
        </p>

        <div className="p-4 bg-cyan-950/20 border border-cyan-900/40 rounded-xl space-y-2 text-xs text-cyan-200">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
            <Sparkles className="w-4 h-4" />
            <span>Human Judgment Rule</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            AI Translation makes cross-lingual communication drastically easier, but <strong>it does not replace human judgment</strong>. If a translated message appears confusing, technical, or ambiguous, ask for clarification directly rather than guessing the intent.
          </p>
        </div>
      </div>

      {/* 19.3 & 19.4 Communication Style & Conflict Resolution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Style */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            19.3. Professional Tone & Style
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            TPs maintain a high level of operational professionalism across all channels.
          </p>
          <div className="space-y-1.5 text-xs">
            <div className="p-2 bg-slate-900/80 rounded-lg text-emerald-300">
              ✓ <strong>Always Be:</strong> Polite, calm, clear, concise, neutral, and respectful.
            </div>
            <div className="p-2 bg-slate-900/80 rounded-lg text-rose-300">
              ✕ <strong>Always Avoid:</strong> Arguments, accusations, personal opinions, unbacked promises, or taking sides.
            </div>
          </div>
        </div>

        {/* Confidentiality */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            19.4. Data Confidentiality Standards
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Protect participant privacy rigorously. Do not unnecessarily share phone numbers, addresses, personal information, or private chat screenshots. Use participant data strictly for legitimate operational purposes.
          </p>
        </div>
      </div>

      {/* 19.5 Conflict De-escalation Protocol */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-cyan-400" />
          19.5. 6-Step De-escalation Protocol During Conflicts
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {conflictSteps.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-cyan-400 font-mono block">{item.step}</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Scenario 19 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 19
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          The Customer and Specialist speak different languages (e.g., English and Portuguese) and cannot understand each other on site. How can NordBase Chat and AI translation be used to help them communicate?
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Recommended TP Action Protocol:</strong>
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li>Direct both parties to open <strong>NordBase Chat</strong> on their mobile devices for official messaging.</li>
            <li>Enable the <strong>AI Translator</strong> function in the chat room so typed messages automatically convert to each user's native language.</li>
            <li>Verify that key operational details (meeting time, exact site entry point, scope points) are translated cleanly and understood by both sides.</li>
            <li>If a translated phrase appears technical or unclear, step in verbally or via chat to clarify the exact practical meaning.</li>
            <li>Record all confirmed instructions in NordBase system notes for future reference.</li>
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
            TP interacts with Customers and Specialists through messaging, calls, or translated chat rooms across various operational stages.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Maintains polite, clear, and neutral communication, uses AI translation for multi-lingual coordination, and records all important operational facts in NordBase.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Do not engage in arguments, do not share private participant data unnecessarily, and do not rely solely on off-platform unrecorded chats.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Escalate to RP/Admin if communications involve abusive language, threats, harassment, or persistent translation misunderstandings.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            An English-speaking Specialist needs site directions from a Portuguese Customer; TP opens NordBase Chat, AI Translator converts messages live, and TP logs the arrival address.
          </p>
        </div>
      </div>
    </div>
  );
}
