import React from 'react';
import { 
  Building, 
  Monitor, 
  Headphones, 
  Wifi, 
  Lock, 
  CheckSquare, 
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

export function Module05Workspace() {
  const requirements = [
    {
      num: '01',
      title: '1. Isolated room',
      icon: Building,
      desc: 'The workspace must be located in a separate room or another environment isolated from outside conversations and noise.',
      detail: 'The TP must be able to speak with Customers and Specialists without background noise or interruptions.'
    },
    {
      num: '02',
      title: '2. Computer',
      icon: Monitor,
      desc: 'The work is performed through the NordBase Dashboard.',
      bullets: [
        'NordBase Dashboard',
        'Chat',
        'Browser',
        'Communication tools',
        'Other required work tools'
      ]
    },
    {
      num: '03',
      title: '3. Headset',
      icon: Headphones,
      desc: 'The TP must have a dedicated headset with:',
      bullets: [
        'Microphone',
        'Headphones'
      ],
      detail: 'Headphones are required for professional communication and privacy.'
    },
    {
      num: '04',
      title: '4. Stable Internet',
      icon: Wifi,
      desc: 'The TP must have a stable internet connection suitable for Dashboard, chat and communication.'
    },
    {
      num: '05',
      title: '5. Privacy',
      icon: Lock,
      desc: 'The workspace must prevent unauthorized people from accessing:',
      bullets: [
        'The screen',
        'Conversations',
        'Phone numbers',
        'Addresses',
        'Participant information',
        'Other confidential information'
      ]
    }
  ];

  const checklistItems = [
    'Workspace ready',
    'Equipment working',
    'Internet stable',
    'Headset working',
    'Dashboard accessible'
  ];

  return (
    <div className="space-y-8">
      {/* Intro Box */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 font-display">
          <Info className="w-5 h-5 text-cyan-400" />
          Why a Proper Workspace is Mandatory
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          A TP works with real Customers and Specialists, handles phone conversations and accesses participant information. The work must therefore be performed from an appropriate professional workspace.
        </p>
      </div>

      {/* 5 Mandatory Requirements */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-white uppercase font-mono tracking-wider text-slate-400">
          Mandatory Requirements
        </h4>

        {requirements.map((req) => {
          const IconComp = req.icon;
          return (
            <div key={req.num} className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white font-display">{req.title}</h4>
              </div>

              <p className="text-slate-200 text-sm mb-2 pl-12">{req.desc}</p>

              {req.bullets && (
                <ul className="space-y-1 text-xs text-slate-300 pl-12 mb-2">
                  {req.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {req.detail && (
                <p className="text-xs text-slate-400 italic pl-12 border-l-2 border-slate-700 mt-2">
                  {req.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Before Starting Work Confirmation Checklist */}
      <div className="bg-gradient-to-r from-blue-950 via-[#0A1128] to-cyan-950 border-2 border-cyan-500/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare className="w-5 h-5 text-cyan-400" />
          <h4 className="text-base font-bold text-white font-display">Before Starting Work Checklist</h4>
        </div>

        <p className="text-xs text-slate-300 mb-4">
          Every shift, the TP should confirm readiness across all 5 verification points:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs">
          {checklistItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="px-3 py-2 bg-slate-900 border border-cyan-500/30 text-cyan-300 rounded-xl font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{item}</span>
              </div>
              {idx < checklistItems.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Standard 5-Point Lesson Framework (Rule 7) */}
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
            Calls and messages with Customers and Specialists involve private personal and operational data that require a secure, quiet environment.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">02</span>
            <h5 className="font-bold text-white text-sm">02. What TP Does</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            Sets up an isolated room, computer with Dashboard, headset, stable internet, and enforces screen/data privacy before taking calls.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">03</span>
            <h5 className="font-bold text-rose-300 text-sm">03. What NOT To Do</h5>
          </div>
          <p className="text-rose-200/80 text-xs leading-relaxed pl-9">
            Do NOT take Customer calls in noisy public places, cafes, or around unauthorized persons who could view sensitive data.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">04</span>
            <h5 className="font-bold text-amber-300 text-sm">04. When Help Is Needed</h5>
          </div>
          <p className="text-amber-200/80 text-xs leading-relaxed pl-9">
            If experiencing technical or internet infrastructure outages in your location, notify the RP immediately to adjust shift coverage.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-xs font-bold">05</span>
            <h5 className="font-bold text-white text-sm">05. Practical Example</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            Before launching his shift, a TP puts on his noise-canceling headset, verifies the Dashboard loads on a stable 100Mbps fiber connection, closes external room doors for privacy, and runs through his 5-point checklist.
          </p>
        </div>
      </div>
    </div>
  );
}
