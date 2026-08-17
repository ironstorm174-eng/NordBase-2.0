import React, { useState } from 'react';
import { 
  FileText, 
  CheckSquare, 
  HelpCircle, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';

export function Module10LeadCreation() {
  const [checklist, setChecklist] = useState({
    customerVerified: true,
    workUnderstood: true,
    locationConfirmed: true,
    requiredInfoRecorded: true,
    categorySelected: true,
    conditionsRecorded: true,
    accuratelyRepresents: true
  });

  const leadInfoFields = [
    { title: 'Service Category', desc: 'Accurate trade selection (e.g. Plumbing, Electrical, Locksmith).' },
    { title: 'Description of Work', desc: 'Clear, factual summary provided by verified Customer.' },
    { title: 'Customer Location & Address', desc: 'Confirmed address and geographic zone.' },
    { title: 'Requested Date & Time', desc: 'Target execution window or urgency level.' },
    { title: 'Access & On-Site Conditions', desc: 'Parking, gate codes, high ladder needs, pets.' },
    { title: 'Customer Notes & Attachments', desc: 'Photos, videos, or specific instructions.' }
  ];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-[#050A1A] border border-blue-900/40 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Module 10</span>
            <h3 className="text-xl font-bold text-white font-display">Lead Creation — Creating a Qualified Lead</h3>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          This module explains how the TP turns a verified Request into a Lead that a Specialist can evaluate and purchase with confidence.
        </p>
      </div>

      {/* Learning Objective */}
      <div className="bg-cyan-950/30 border-l-4 border-cyan-400 p-4 rounded-r-xl text-xs md:text-sm text-cyan-200">
        <strong className="text-cyan-400 font-mono uppercase tracking-wide block mb-1">Learning Objective:</strong>
        Master formatting verified requests into complete, accurate Leads that pass the Specialist Lead Quality Test before dispatch.
      </div>

      {/* 10.1 What Is a Lead? */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-3">
        <h4 className="text-base font-bold text-white font-display">
          10.1. What Is a Lead?
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          A Lead is a <strong>qualified and verified Customer Request prepared for a Specialist.</strong> The Specialist purchases the Lead. Therefore, it must contain enough information for the Specialist to make an informed decision about accepting the work.
        </p>
      </div>

      {/* 10.2 Required Lead Information */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display">
          10.2. Required Lead Fields
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {leadInfoFields.map((field, idx) => (
            <div key={idx} className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
              <span className="font-bold text-cyan-300 text-xs block mb-1">{field.title}</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">{field.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 10.3 Lead Quality Test Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-[#0A1128] to-cyan-950 border-2 border-cyan-400/50 rounded-2xl p-6 text-center shadow-[0_0_25px_rgba(6,182,212,0.15)] space-y-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          10.3. Lead Quality Test:
        </h4>
        <p className="text-base md:text-lg font-black text-white font-display italic">
          "If I were the Specialist, would I have enough information to decide whether I want to accept this work?"
        </p>
        <p className="text-xs text-slate-300">
          If the answer is no, improve the Lead before sending it.
        </p>
      </div>

      {/* 10.4 Accurate Information & 10.5 Progression */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display">
          10.5. Complete Lead vs Job Lifecycle
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-bold text-slate-300">
            1. Request
            <span className="block text-[10px] text-slate-500 font-normal">Customer contacts</span>
          </div>
          <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl font-bold text-cyan-300">
            2. Verification
            <span className="block text-[10px] text-cyan-400/70 font-normal">TP verifies</span>
          </div>
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl font-bold text-emerald-300">
            3. Lead
            <span className="block text-[10px] text-emerald-400/70 font-normal">Qualified & offered</span>
          </div>
          <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl font-bold text-purple-300">
            4. Accepted
            <span className="block text-[10px] text-purple-400/70 font-normal">Specialist accepts</span>
          </div>
          <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl font-bold text-blue-300">
            5. Active Job
            <span className="block text-[10px] text-blue-400/70 font-normal">Work in progress</span>
          </div>
        </div>
      </div>

      {/* 10.6 Lead Readiness Checklist */}
      <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-cyan-400" />
          10.6. Interactive Lead Readiness Checklist
        </h4>
        <div className="space-y-2 text-xs">
          {Object.entries({
            customerVerified: 'Customer verified and identity confirmed',
            workUnderstood: 'Work description clearly understood without technical guessing',
            locationConfirmed: 'Specific location and address confirmed',
            requiredInfoRecorded: 'All required info recorded in NordBase',
            categorySelected: 'Suitable trade category selected',
            conditionsRecorded: 'Important conditions and access codes recorded',
            accuratelyRepresents: 'Lead accurately represents the raw Request without exaggeration'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Scenario / Check */}
      <div className="bg-[#050A1A] border border-purple-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          Practical Scenario 10
        </div>
        <h5 className="font-bold text-white text-base mb-2">
          "The Customer says: 'The washing machine is leaking.' What additional information should the TP collect before creating the Lead?"
        </h5>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
          <p>
            <strong>Correct Action:</strong> The TP asks:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li>Where is the leak coming from? (e.g. back hose, bottom door seal, tap connection)</li>
            <li>Is it leaking continuously or only during active drain cycles?</li>
            <li>What is the brand/model of the appliance if known?</li>
            <li>Is water turned off right now to prevent property damage?</li>
          </ul>
          <p className="pt-1">Once answered, the Lead is created with high clarity for Appliance Repair / Plumbing specialists.</p>
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
            Verified Requests are formatted into structured Leads and dispatched to matching Verified Specialists.
          </p>
        </div>

        {/* 02. What TP Does */}
        <div className="bg-[#050A1A] border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">02</span>
            <h5 className="font-bold text-white text-sm">02. What TP Does</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            Applies the Lead Quality Test, populates all required fields accurately, and ensures the Lead is ready for Specialist purchase.
          </p>
        </div>

        {/* 03. What NOT To Do */}
        <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">03</span>
            <h5 className="font-bold text-rose-300 text-sm">03. What NOT To Do</h5>
          </div>
          <p className="text-rose-200/80 text-xs leading-relaxed pl-9">
            Never exaggerate job scope, hide access difficulties, or promise unconfirmed terms to make a Lead look attractive.
          </p>
        </div>

        {/* 04. When Help Is Needed */}
        <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">04</span>
            <h5 className="font-bold text-amber-300 text-sm">04. When Help Is Needed</h5>
          </div>
          <p className="text-amber-200/80 text-xs leading-relaxed pl-9">
            If unsure which category a multi-trade request belongs to, consult your Regional Partner.
          </p>
        </div>

        {/* 05. Practical Example */}
        <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-xs font-bold">05</span>
            <h5 className="font-bold text-white text-sm">05. Practical Example</h5>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pl-9">
            A customer requests "Drywall repair after pipe leak". The TP confirms the pipe was already fixed by a plumber yesterday, creates a clean Lead under Painter/Drywaller category, and attaches photos of the wall.
          </p>
        </div>
      </div>
    </div>
  );
}
