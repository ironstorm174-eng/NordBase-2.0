import React from 'react';
import { 
  DollarSign, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CreditCard, 
  PieChart, 
  ArrowRight, 
  TrendingUp, 
  Receipt,
  Building2
} from 'lucide-react';

export function Module20PaymentsMoneyFlow() {
  const paymentProblemSteps = [
    'Check information available in NordBase system logs',
    'Avoid making unauthorized financial promises or guarantees',
    'Record the exact payment issue details and timestamps',
    'Follow the approved NordBase financial recovery procedure',
    'Escalate to Regional Partner (RP) or Admin when necessary'
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 20</span>
            <h3 className="text-xl font-bold text-white font-display">Payments & Money Flow — Financial Model</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module explains the NordBase financial model, clarifying Customer payment distribution, Lead Fee mechanics, and the exact 40% TP compensation calculation.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Understand the financial flow of NordBase, correctly calculate the 40% TP share of the Lead Fee, and follow approved protocols for payment inquiries.
      </div>

      {/* 20.1 Customer Payment & Specialist Revenue */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-cyan-400" />
          20.1. Customer Payment & 100% Specialist Revenue
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Customer pays for the technical work performed directly by the Specialist.
        </p>

        <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs text-emerald-200/90 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Specialist Payout Standard</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            The Specialist receives <strong>100% of the payment from the Customer</strong> for the completed work. The Lead Fee is incorporated into the price structure according to approved NordBase financial mechanisms.
          </p>
        </div>
      </div>

      {/* 20.2 Lead Fee & 20.3 TP Compensation (40%) */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <PieChart className="w-5 h-5 text-cyan-400" />
          20.2 & 20.3. Lead Fee & 40% TP Compensation
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Lead Fee is part of the NordBase business model. The TP receives a <strong>40% share of the Lead Fee</strong> for their operational coordination role connected with the Lead and Job.
        </p>

        {/* Calculation Example Card */}
        <div className="p-5 bg-slate-900/90 border border-cyan-500/30 rounded-xl space-y-3">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">Financial Calculation Example</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-xs">
            <div className="p-3 bg-slate-800/80 rounded-lg text-center border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Lead Fee</span>
              <span className="text-xl font-bold text-white font-mono">€20</span>
            </div>

            <div className="flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              <span>× 40% Share =</span>
            </div>

            <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-lg text-center">
              <span className="text-[10px] text-cyan-300 uppercase font-mono block">TP Compensation</span>
              <span className="text-xl font-bold text-cyan-400 font-mono">€8</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-1">
            The TP’s share is credited directly to the TP’s connected Stripe account when the Customer’s payment is received according to the NordBase financial model.
          </p>
        </div>
      </div>

      {/* 20.4 Operational Role Compensation */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400" />
          20.4. Important Role Distinction
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          The TP is <strong>not paid for performing the Specialist’s technical work</strong>. The TP receives compensation exclusively for the operational supervision, customer verification, lead creation, and job coordination roles connected with the Lead and Job.
        </p>
      </div>

      {/* 20.5 Payment Problems Protocol */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Receipt className="w-5 h-5 text-cyan-400" />
          20.5. Payment Problems Protocol
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          If a participant reports a payment issue (e.g. unpaid customer, missing payout, Stripe connection error, unclear status):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {paymentProblemSteps.map((step, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-slate-300">
              <div className="w-5 h-5 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 20.6 Financial Transparency Flow */}
      <div className="bg-[#0A1128] border border-cyan-500/30 rounded-2xl p-5 text-center space-y-3">
        <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">NordBase Financial Flow</p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold font-mono">
          <span className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white">Lead Creation</span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white">Customer Payment</span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 bg-emerald-950 border border-emerald-800 rounded-lg text-emerald-300">Specialist 100% Payout</span>
          <span className="text-cyan-400">→</span>
          <span className="px-3 py-1.5 bg-cyan-950 border border-cyan-800 rounded-lg text-cyan-300">TP 40% Lead Share</span>
        </div>
      </div>

      {/* Practical Scenario / Check 20 */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario / Calculation Check
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          A Lead Fee for a qualified job is €20. According to the NordBase financial model, what is the exact TP's share?
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p className="font-bold text-cyan-400 text-sm">
            Correct Answer: €8
          </p>
          <p className="text-slate-400 leading-relaxed">
            Calculation: <strong>€20 × 40% = €8</strong>. The TP receives 40% of the Lead Fee, which is credited to their connected Stripe account upon receipt of Customer payment.
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
            A Job reaches payment stage where Customer pays for technical work, triggering revenue settlement and TP compensation credit.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">02</div>
            <h5 className="text-sm font-bold text-white">What TP Does</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            Monitors financial logs in NordBase Dashboard, verifies payment statuses, and receives 40% of the Lead Fee automatically via Stripe.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">03</div>
            <h5 className="text-sm font-bold text-rose-300">What NOT To Do</h5>
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed pl-10">
            Do not invent unapproved distribution percentages, do not make financial guarantees, and do not promise custom refunds without official policy.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">04</div>
            <h5 className="text-sm font-bold text-amber-300">When Help Is Needed</h5>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed pl-10">
            Escalate to RP or Admin if Stripe payout fails, payment status remains stuck, or financial data appears corrupted.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-purple-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">05</div>
            <h5 className="text-sm font-bold text-white">Practical Example</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            A Lead with a €20 Lead Fee completes successfully; Specialist receives 100% of customer pay, and TP receives €8 (40% of €20) credited to Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
