import React from 'react';
import { 
  Compass, 
  Globe2, 
  Anchor, 
  HeartHandshake, 
  Flame, 
  Users, 
  Trophy, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Info
} from 'lucide-react';

export function Module02Philosophy() {
  const sections = [
    {
      num: '01',
      title: '1. The world is changing',
      icon: Globe2,
      body: [
        'The world is changing quickly.',
        'Wars, migration, economic uncertainty, climate change and the rapid development of AI are changing people\'s lives and the way we work.',
        'We do not know exactly what the next few years will look like.',
        'But we can prepare for change.'
      ]
    },
    {
      num: '02',
      title: '2. Islands of stability',
      icon: Anchor,
      highlight: 'We create islands of stability where people live and work.',
      body: [
        'NordBase creates local communities where people can work, develop and help each other.',
        'When someone moves to another city, they should not have to start completely from zero.',
        'When a Specialist needs work, there is a community.',
        'When a TP needs help, there is a team.',
        'When an RP launches a new region, they are not alone.'
      ]
    },
    {
      num: '03',
      title: '3. We believe in people',
      icon: HeartHandshake,
      highlight: 'People are the foundation of NordBase.',
      body: [
        'NordBase is based on a simple belief: People can help each other.',
        'Technology can make work faster.',
        'AI can translate, search information and automate routine tasks.',
        'But trust, responsibility and the willingness to help another person remain human.'
      ]
    },
    {
      num: '04',
      title: '4. Freedom',
      icon: Flame,
      highlight: 'We bring people together without making them the same.',
      body: [
        'NordBase does not aim to turn people into employees of a platform.',
        'Participants remain independent entrepreneurs.',
        'Everyone has: their own skills, their own decisions, their own responsibility, their own reputation, their own freedom.'
      ]
    },
    {
      num: '05',
      title: '5. Mutual support',
      icon: Users,
      highlight: 'The stronger the mutual support, the stronger the community.',
      body: [
        'Helping each other is not a formality in NordBase.',
        'Today you may help another participant.',
        'Tomorrow you may need help yourself.',
        'A strong community allows people to solve problems that are much harder to solve alone.'
      ]
    },
    {
      num: '06',
      title: '6. Win2Win',
      icon: Trophy,
      highlight: 'We win when the participants win.',
      body: [
        'NordBase is built so that the success of one participant creates opportunities for others.',
        'The Customer gets the right Specialist.',
        'The Specialist gets work.',
        'The TP develops their territory.',
        'The RP develops their region.',
        'NordBase grows together with its participants.'
      ]
    },
    {
      num: '07',
      title: '7. An opportunity to change your life',
      icon: Sparkles,
      highlight: 'You do not have to start everything from zero. You can start with a community.',
      body: [
        'NordBase is not only about work.',
        'A person may want to move to another city, start working independently or build a new career.',
        'Where NordBase operates, people can have an opportunity to work, develop and build their own business.'
      ]
    },
    {
      num: '08',
      title: '8. What we are building',
      icon: Compass,
      highlight: 'work → earn → develop → help others → receive help',
      body: [
        'We do not know exactly what the world will look like tomorrow.',
        'But we can decide how we treat the people around us.',
        'We want to build a community where people can work, earn, develop, help others, and receive help while remaining free and independent.'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Intro Header: Why This Matters */}
      <div className="bg-gradient-to-br from-[#0A1128] to-[#050A1A] border border-cyan-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-black text-white font-display">Why this matters</h3>
        </div>

        <div className="space-y-3 text-slate-200 text-sm md:text-base leading-relaxed">
          <p>
            Before you start working with NordBase, it is important to understand what we are building and why we do it this way.
          </p>
          <p>
            NordBase is not simply a platform for finding jobs or specialists. It is a community of people who work with each other and depend on each other.
          </p>
          <p className="font-medium text-cyan-200">
            Understanding <strong>what you do</strong> is important. Understanding <strong>why we build NordBase this way</strong> is equally important.
          </p>
          <p className="text-xs text-slate-400 italic pt-2 border-t border-blue-900/40">
            This is not a formal test. It is our common understanding of what we are building together.
          </p>
        </div>
      </div>

      {/* 8 Core Principles Grid / List */}
      <div className="space-y-4">
        {sections.map((sec) => {
          const IconComp = sec.icon;
          return (
            <div key={sec.num} className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white font-display">{sec.title}</h4>
              </div>

              <div className="space-y-2 text-slate-300 text-sm leading-relaxed pl-2 md:pl-12">
                {sec.body.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}

                {sec.highlight && (
                  <div className="mt-3 p-3 bg-cyan-950/30 border-l-2 border-cyan-400 text-cyan-200 font-bold text-sm rounded-r-lg">
                    {sec.highlight}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Statement Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-[#0A1128] to-cyan-950 border-2 border-cyan-400/40 rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <h4 className="text-xl md:text-2xl font-black text-white font-display tracking-tight leading-snug mb-2">
          We cannot make the world stable.<br />
          <span className="text-cyan-400">But we can create islands of stability together.</span>
        </h4>
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
            NordBase unites independent entrepreneurs under a shared mission of creating local economic stability and mutual human support.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">02</span>
            <h5 className="font-bold text-white text-sm">02. What TP Does</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            Acts as the local community anchor: fosters trust, respects independence of Specialists, and creates Win2Win outcomes in their territory.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">03</span>
            <h5 className="font-bold text-rose-300 text-sm">03. What NOT To Do</h5>
          </div>
          <p className="text-rose-200/80 text-xs leading-relaxed pl-9">
            Do NOT treat Specialists or Customers merely as transactional numbers. Do NOT impose command-and-control employee structures on independent entrepreneurs.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">04</span>
            <h5 className="font-bold text-amber-300 text-sm">04. When Help Is Needed</h5>
          </div>
          <p className="text-amber-200/80 text-xs leading-relaxed pl-9">
            When facing ethical dilemmas, community conflicts, or severe market changes, consult the RP for guidance aligned with NordBase principles.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-xs font-bold">05</span>
            <h5 className="font-bold text-white text-sm">05. Practical Example</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            A newly arrived Specialist relocates to your territory. The TP helps onboard and verify them through the Academy, providing immediate access to local work leads so they don't have to start from zero.
          </p>
        </div>
      </div>
    </div>
  );
}
