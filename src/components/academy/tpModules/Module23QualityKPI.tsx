import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ShieldCheck, 
  Layers, 
  Users, 
  Clock, 
  Search,
  Sparkles
} from 'lucide-react';

export function Module23QualityKPI() {
  const implementedMetrics = [
    { name: 'Response Time (Verification)', status: 'Active in Dashboard' },
    { name: 'Request Processing Quality', status: 'Active in Dashboard' },
    { name: 'Lead Quality & Accuracy', status: 'Active in Dashboard' },
    { name: 'Speed of Specialist Selection', status: 'Active in Dashboard' },
    { name: 'Lead Acceptance Rate', status: 'Active in Dashboard' },
    { name: 'Successful Jobs Completed', status: 'Active in Dashboard' },
    { name: 'Cancellation & No-Show Ratio', status: 'Active in Dashboard' },
    { name: 'Unresolved Cases & Complaints', status: 'Active in Dashboard' },
    { name: 'Job Completion Rate', status: 'Active in Dashboard' },
    { name: 'Communication Standards', status: 'Active in Dashboard' },
  ];

  const selfAuditQuestions = [
    'Are my created Leads accurate and detailed?',
    'Are Specialists receiving enough useful information before accepting?',
    'Are Customers being contacted promptly and professionally?',
    'Are Jobs in my territory progressing normally toward closure?',
    'Are there repeated operational friction points or complaints?',
    'What specific workflow step can I refine today?'
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 23</span>
            <h3 className="text-xl font-bold text-white font-display">Quality & KPI — Measuring TP Performance</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module outlines performance metrics in NordBase, emphasizing that true TP success is measured by lead quality, territory health, and trust rather than raw lead volume.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Understand how TP performance is evaluated, prioritize Lead quality over sheer volume, and conduct regular self-audits to foster a healthy local marketplace ecosystem.
      </div>

      {/* 23.1 Purpose of KPIs */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          23.1. The True Purpose of KPI in NordBase
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          The purpose of KPI in NordBase is NOT to create a reckless race for quantity. Instead, performance metrics exist to protect operational quality and sustainable growth:
        </p>

        {/* Value Chain Visual */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 flex flex-wrap items-center justify-center gap-2 text-center font-bold">
          <span className="text-cyan-400">Quality</span>
          <span>→</span>
          <span className="text-emerald-400">Reliability</span>
          <span>→</span>
          <span className="text-blue-400">Customer Trust</span>
          <span>→</span>
          <span className="text-purple-400">Specialist Trust</span>
          <span>→</span>
          <span className="text-amber-400">Territory Growth</span>
        </div>
      </div>

      {/* 23.2 Operational Indicators */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          23.2. Operational Performance Indicators
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          The following indicators reflect TP operational performance across NordBase:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {implementedMetrics.map((m, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-200 font-medium">{m.name}</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-md">
                {m.status}
              </span>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400 italic">
          Note: If additional future metrics or specific score calculation formulas are introduced: <strong className="text-amber-400 not-italic font-mono">TBD — requires definition</strong>
        </div>
      </div>

      {/* 23.3 Quality Over Quantity */}
      <div className="bg-[#050A1A] border border-amber-900/40 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-amber-300 font-display flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          23.3. Quality Over Quantity
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          A TP should never generate low-quality or unverified Leads simply to inflate Lead count metrics. Bad Leads inflict immediate harm on the territory:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-300 text-center">Wasted Specialist Time</div>
          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-300 text-center">Unnecessary Conflicts</div>
          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-300 text-center">Lower Specialist Trust</div>
          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-300 text-center">Lower Acceptance Rates</div>
          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-300 text-center">Damaged Local Market</div>
          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-300 text-center">Increased Cancelations</div>
        </div>
      </div>

      {/* 23.4 Personal Performance & Territory Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Self-Audit */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-sm">
            <Search className="w-5 h-5" />
            <span>23.4. Personal Self-Audit</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            TPs should regularly review their daily operations by asking:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {selfAuditQuestions.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Territory Ecosystem */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-sm">
            <Users className="w-5 h-5" />
            <span>23.5. Territory Ecosystem Health</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            A successful TP does not merely process incoming Requests as isolated tickets. They actively nurture a balanced ecosystem where qualified Customers get fast help and Specialists receive profitable, accurate work.
          </p>
          <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs text-emerald-200">
            Healthy territory growth occurs naturally when Lead quality remains consistently high.
          </div>
        </div>
      </div>

      {/* Practical Scenario 23 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 23
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          A TP increases the total number of created Leads significantly, but Lead acceptance rate and Job completion rate both decrease. Is this necessarily an improvement in TP performance? Why or why not?
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p className="font-bold text-rose-400 text-sm">Analysis & Conclusion:</p>
          <p className="leading-relaxed">
            <strong>NO, this is NOT an improvement.</strong> Pushing higher Lead numbers while acceptance and completion drop indicates that the TP is creating low-quality or poorly verified Leads. This wastes Specialists’ time, reduces their willingness to accept future Leads, and harms overall trust in the local NordBase ecosystem. Quality and completion rate always supersede raw Lead creation volume.
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
            NordBase evaluates TP performance to ensure service quality, customer satisfaction, and network stability.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Focuses on creating accurate, high-quality Leads, maintaining fast response times, and performing self-audits.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Never sacrifice verification accuracy or generate fake/rushed Leads just to inflate Lead count metrics.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Consult your RP if Lead acceptance drops regionally due to lack of specialists in a specific trade or category.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            A TP spends an extra 2 minutes clarifying a plumbing issue with a Customer before creating the Lead; the Specialist accepts instantly and completes the Job smoothly.
          </p>
        </div>
      </div>
    </div>
  );
}
