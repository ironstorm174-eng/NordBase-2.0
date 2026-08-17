import React, { useState } from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  Briefcase, 
  Laptop, 
  BookOpen, 
  ShieldCheck, 
  Award,
  Calendar,
  ArrowRight
} from 'lucide-react';

export function Module27ReadyForWork() {
  // State for readiness checkboxes
  const [businessItems, setBusinessItems] = useState({
    interview: true,
    agreement: true,
    registration: true,
    stripe: true
  });

  const [workspaceItems, setWorkspaceItems] = useState({
    workspace: true,
    computer: true,
    internet: true,
    headset: true,
    microphone: true,
    privateEnv: true
  });

  const [knowledgeItems, setKnowledgeItems] = useState({
    glossary: true,
    philosophy: true,
    tpRole: true,
    dashboard: true,
    specialistVerification: true,
    requestProcessing: true,
    leadCreation: true,
    specialistSelection: true,
    jobWorkflow: true,
    completionClosure: true,
    cancellationsNoShow: true,
    disputeBoundaries: true,
    moderation: true,
    communicationRules: true,
    paymentFlow: true,
    escalation: true,
    securityRequirements: true
  });

  const allBusinessDone = Object.values(businessItems).every(Boolean);
  const allWorkspaceDone = Object.values(workspaceItems).every(Boolean);
  const allKnowledgeDone = Object.values(knowledgeItems).every(Boolean);
  const isFullyReady = allBusinessDone && allWorkspaceDone && allKnowledgeDone;

  const currentDate = new Date().toISOString().split('T')[0];

  const toggleBusiness = (key: keyof typeof businessItems) => {
    setBusinessItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleWorkspace = (key: keyof typeof workspaceItems) => {
    setWorkspaceItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleKnowledge = (key: keyof typeof knowledgeItems) => {
    setKnowledgeItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 27</span>
            <h3 className="text-xl font-bold text-white font-display">Ready for Work — Final Authorization</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This final module provides the operational readiness checklist and authorization verification required before launching independent operations as a NordBase Territory Partner.
        </p>
      </div>

      {/* 27.1 Interactive Readiness Checklist */}
      <div className="space-y-6">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-cyan-400" />
          TP Readiness Verification Checklist
        </h4>

        {/* 1. Business Readiness */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-xs uppercase">
            <Briefcase className="w-4 h-4" />
            1. Business Requirements
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-cyan-500/30">
              <input type="checkbox" checked={businessItems.interview} onChange={() => toggleBusiness('interview')} className="accent-cyan-400 w-4 h-4" />
              <span className="text-slate-200">Interview completed</span>
            </label>
            <label className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-cyan-500/30">
              <input type="checkbox" checked={businessItems.agreement} onChange={() => toggleBusiness('agreement')} className="accent-cyan-400 w-4 h-4" />
              <span className="text-slate-200">NordBase agreement completed</span>
            </label>
            <label className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-cyan-500/30">
              <input type="checkbox" checked={businessItems.registration} onChange={() => toggleBusiness('registration')} className="accent-cyan-400 w-4 h-4" />
              <span className="text-slate-200">Required business registration completed</span>
            </label>
            <label className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-cyan-500/30">
              <input type="checkbox" checked={businessItems.stripe} onChange={() => toggleBusiness('stripe')} className="accent-cyan-400 w-4 h-4" />
              <span className="text-slate-200">Stripe payout setup completed</span>
            </label>
          </div>
        </div>

        {/* 2. Workspace Readiness */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold font-mono text-xs uppercase">
            <Laptop className="w-4 h-4" />
            2. Workspace Requirements
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            <label className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-purple-500/30">
              <input type="checkbox" checked={workspaceItems.workspace} onChange={() => toggleWorkspace('workspace')} className="accent-purple-400 w-4 h-4" />
              <span className="text-slate-200">Suitable workspace</span>
            </label>
            <label className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-purple-500/30">
              <input type="checkbox" checked={workspaceItems.computer} onChange={() => toggleWorkspace('computer')} className="accent-purple-400 w-4 h-4" />
              <span className="text-slate-200">Computer</span>
            </label>
            <label className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-purple-500/30">
              <input type="checkbox" checked={workspaceItems.internet} onChange={() => toggleWorkspace('internet')} className="accent-purple-400 w-4 h-4" />
              <span className="text-slate-200">Stable internet connection</span>
            </label>
            <label className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-purple-500/30">
              <input type="checkbox" checked={workspaceItems.headset} onChange={() => toggleWorkspace('headset')} className="accent-purple-400 w-4 h-4" />
              <span className="text-slate-200">Headset</span>
            </label>
            <label className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-purple-500/30">
              <input type="checkbox" checked={workspaceItems.microphone} onChange={() => toggleWorkspace('microphone')} className="accent-purple-400 w-4 h-4" />
              <span className="text-slate-200">Microphone</span>
            </label>
            <label className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-purple-500/30">
              <input type="checkbox" checked={workspaceItems.privateEnv} onChange={() => toggleWorkspace('privateEnv')} className="accent-purple-400 w-4 h-4" />
              <span className="text-slate-200">Private working environment</span>
            </label>
          </div>
        </div>

        {/* 3. Knowledge Readiness */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs uppercase">
            <BookOpen className="w-4 h-4" />
            3. Knowledge & Operational Mastery
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.glossary} onChange={() => toggleKnowledge('glossary')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Glossary completed</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.philosophy} onChange={() => toggleKnowledge('philosophy')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Philosophy completed</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.tpRole} onChange={() => toggleKnowledge('tpRole')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">TP Role completed</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.dashboard} onChange={() => toggleKnowledge('dashboard')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Dashboard training</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.specialistVerification} onChange={() => toggleKnowledge('specialistVerification')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Specialist verification</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.requestProcessing} onChange={() => toggleKnowledge('requestProcessing')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Request processing</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.leadCreation} onChange={() => toggleKnowledge('leadCreation')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Lead creation</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.specialistSelection} onChange={() => toggleKnowledge('specialistSelection')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Specialist selection</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.jobWorkflow} onChange={() => toggleKnowledge('jobWorkflow')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Job workflow</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.completionClosure} onChange={() => toggleKnowledge('completionClosure')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Completion & closure</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.cancellationsNoShow} onChange={() => toggleKnowledge('cancellationsNoShow')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Cancellations & no-show</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.disputeBoundaries} onChange={() => toggleKnowledge('disputeBoundaries')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Dispute boundaries</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.moderation} onChange={() => toggleKnowledge('moderation')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Moderation</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.communicationRules} onChange={() => toggleKnowledge('communicationRules')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Communication rules</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.paymentFlow} onChange={() => toggleKnowledge('paymentFlow')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Payment flow</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.escalation} onChange={() => toggleKnowledge('escalation')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Escalation</span>
            </label>
            <label className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={knowledgeItems.securityRequirements} onChange={() => toggleKnowledge('securityRequirements')} className="accent-emerald-400 w-4 h-4" />
              <span className="text-slate-200">Security requirements</span>
            </label>
          </div>
        </div>
      </div>

      {/* Final Authorization Banner */}
      <div className={`p-6 rounded-2xl border ${isFullyReady ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-amber-950/40 border-amber-500/50'} space-y-4`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isFullyReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {isFullyReady ? <ShieldCheck className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider block">
              Authorization Status
            </span>
            <h4 className="text-xl font-bold text-white font-display">
              {isFullyReady ? 'TP Ready for Work' : 'TP Not Yet Ready'}
            </h4>
          </div>
        </div>

        {!isFullyReady && (
          <p className="text-xs text-amber-200/90 leading-relaxed">
            Incomplete requirements remain. Please ensure all Business, Workspace, and Knowledge checkboxes above are satisfied prior to active dispatch authorization.
          </p>
        )}

        {/* Final Human Encouraging Message */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 space-y-3">
          <p className="font-bold text-white text-sm">
            You are ready to begin working as a Territory Partner when all required conditions have been completed.
          </p>
          <div className="space-y-1.5 text-slate-300">
            <p className="font-semibold text-cyan-400">Your role is simple:</p>
            <ul className="space-y-1 pl-4 list-disc text-slate-300">
              <li>Help Customers find the right Specialists.</li>
              <li>Help Specialists find the right work.</li>
              <li>Keep the process organized.</li>
              <li>Protect the quality of the NordBase community.</li>
            </ul>
          </div>
          <p className="text-slate-400 italic text-[11px] pt-1">
            You are not expected to know everything. When a situation is outside your authority, ask for help. Welcome to NordBase.
          </p>
        </div>
      </div>

      {/* FINAL ACADEMY STATUS BANNER */}
      <div className="bg-[#050A1A] border border-cyan-500/40 rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-blue-900/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">TP Academy — Completed</h3>
              <span className="text-xs font-mono text-cyan-400">Territory Partner Training Program</span>
            </div>
          </div>
          <div className="text-right font-mono text-xs">
            <div className="text-slate-400">Completion Date</div>
            <div className="text-cyan-300 font-bold">{currentDate}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-400 text-[10px]">Academy Status</div>
            <div className="text-emerald-400 font-bold">100% Modules Completed</div>
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-400 text-[10px]">Certification Status</div>
            <div className="text-cyan-300 font-bold">{isFullyReady ? 'TP Ready for Work' : 'Pending Verification'}</div>
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-400 text-[10px]">Next Step</div>
            <div className="text-purple-300 font-bold">Territory Operations Launch</div>
          </div>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono">
          Formal physical certificate mechanics: <strong className="text-amber-400 not-italic font-mono">TBD — requires definition</strong>
        </div>
      </div>
    </div>
  );
}
