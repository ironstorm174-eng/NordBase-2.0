import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Crown, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { ServiceCategory } from '../../types';
import { CALCULATOR_CATEGORIES, CALCULATOR_CATEGORY_DETAILS } from '../NordBasePricingCalculator';
import { 
  calculateGroupWorkPrice, 
  GroupSpecialistItem, 
  SpecialistLevelKey, 
  SPECIALIST_LEVELS 
} from '../../utils/pricing';

export default function GroupWorkCalculator() {
  const [category, setCategory] = useState<ServiceCategory>('Home Services');
  const [specialists, setSpecialists] = useState<GroupSpecialistItem[]>([
    { id: 'spec-1', name: 'Specialist 1 (Lead)', level: 'L3', hours: 4, isGroupLead: true },
    { id: 'spec-2', name: 'Specialist 2', level: 'L2', hours: 4, isGroupLead: false },
    { id: 'spec-3', name: 'Specialist 3', level: 'L2', hours: 4, isGroupLead: false },
    { id: 'spec-4', name: 'Specialist 4', level: 'L1', hours: 4, isGroupLead: false },
  ]);

  const result = calculateGroupWorkPrice(specialists);

  const handleSetGroupLead = (leadId: string) => {
    setSpecialists(prev =>
      prev.map(s => ({
        ...s,
        isGroupLead: s.id === leadId,
      }))
    );
  };

  const handleUpdateSpecialist = (id: string, updates: Partial<GroupSpecialistItem>) => {
    setSpecialists(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleAddSpecialist = () => {
    const nextNum = specialists.length + 1;
    const newSpec: GroupSpecialistItem = {
      id: `spec-${Date.now()}`,
      name: `Specialist ${nextNum}`,
      level: 'L2',
      hours: specialists[0]?.hours || 4,
      isGroupLead: false,
    };
    setSpecialists(prev => [...prev, newSpec]);
  };

  const handleRemoveSpecialist = (id: string) => {
    if (specialists.length <= 2) return;
    setSpecialists(prev => {
      const filtered = prev.filter(s => s.id !== id);
      // If removed lead, make the first one lead
      if (!filtered.some(s => s.isGroupLead) && filtered.length > 0) {
        filtered[0].isGroupLead = true;
      }
      return filtered;
    });
  };

  const handleApplyHoursToAll = (hours: number) => {
    const safeHours = Math.max(2, hours);
    setSpecialists(prev => prev.map(s => ({ ...s, hours: safeHours })));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Group Work Calculator</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider font-mono">
                Team Jobs
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Multi-specialist teams with 20% Group Lead fee discount</p>
          </div>
        </div>
        <div className="bg-purple-500/10 text-purple-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-purple-500/20 uppercase tracking-wider">
          Active
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Category Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Service Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ServiceCategory)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-purple-500 transition-colors"
          >
            {CALCULATOR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CALCULATOR_CATEGORY_DETAILS[cat]?.icon} {CALCULATOR_CATEGORY_DETAILS[cat]?.labelRu || cat}
              </option>
            ))}
          </select>
        </div>

        {/* Global Quick Hours Bar */}
        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-slate-300">Preset Hours For All:</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {[2, 3, 4, 6, 8, 10, 12].map(h => (
              <button
                key={h}
                type="button"
                onClick={() => handleApplyHoursToAll(h)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900 hover:bg-purple-950/50 border border-slate-800 text-slate-300 hover:text-purple-300 hover:border-purple-800 transition-all"
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Team Members List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>Team Members ({specialists.length})</span>
              <span className="text-[10px] text-purple-400 font-mono font-normal">Min 2 Required</span>
            </label>

            <button
              type="button"
              onClick={handleAddSpecialist}
              className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Specialist</span>
            </button>
          </div>

          <div className="space-y-3">
            {specialists.map((spec, index) => (
              <div
                key={spec.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  spec.isGroupLead
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/20'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  {/* Lead designation radio */}
                  <div className="md:col-span-4 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSetGroupLead(spec.id)}
                      title={spec.isGroupLead ? 'Assigned Group Lead' : 'Click to make Group Lead'}
                      className={`p-1.5 rounded-lg border transition-all ${
                        spec.isGroupLead
                          ? 'bg-purple-500 text-white border-purple-400'
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-purple-300'
                      }`}
                    >
                      <Crown className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      value={spec.name || `Specialist ${index + 1}`}
                      onChange={(e) => handleUpdateSpecialist(spec.id, { name: e.target.value })}
                      className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-purple-500 text-xs font-bold text-white focus:outline-none py-0.5 px-1 truncate"
                    />

                    {spec.isGroupLead && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                        LEAD
                      </span>
                    )}
                  </div>

                  {/* Qualification */}
                  <div className="md:col-span-4">
                    <select
                      value={spec.level}
                      onChange={(e) => handleUpdateSpecialist(spec.id, { level: e.target.value as SpecialistLevelKey })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-500"
                    >
                      {(Object.keys(SPECIALIST_LEVELS) as SpecialistLevelKey[]).map(lvlKey => (
                        <option key={lvlKey} value={lvlKey}>
                          {SPECIALIST_LEVELS[lvlKey].label} (€{SPECIALIST_LEVELS[lvlKey].hourlyRate}/h)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hours input */}
                  <div className="md:col-span-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateSpecialist(spec.id, { hours: Math.max(2, spec.hours - 1) })}
                      className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold text-xs hover:bg-slate-800 flex items-center justify-center shrink-0"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={2}
                      step={0.5}
                      value={spec.hours}
                      onChange={(e) => handleUpdateSpecialist(spec.id, { hours: Math.max(2, parseFloat(e.target.value) || 2) })}
                      className="w-14 bg-slate-900 border border-slate-800 rounded-lg text-center py-1 text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[11px] text-slate-400 font-mono">hrs</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateSpecialist(spec.id, { hours: spec.hours + 1 })}
                      className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold text-xs hover:bg-slate-800 flex items-center justify-center shrink-0"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete button */}
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialist(spec.id)}
                      disabled={specialists.length <= 2}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 disabled:hover:text-slate-500 disabled:hover:bg-transparent transition-all"
                      title="Remove Specialist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-row calculation hint */}
                <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">
                    €{SPECIALIST_LEVELS[spec.level].hourlyRate}/h × {spec.hours}h
                  </span>
                  <span className="font-mono font-bold text-purple-300">
                    = €{(SPECIALIST_LEVELS[spec.level].hourlyRate * Math.max(2, spec.hours)).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Errors / Alerts */}
        {!result.isValid && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              {!result.isTeamSizeValid && <div>• Minimum 2 specialists required for a Group Job.</div>}
              {!result.isWorkValueValid && <div>• Minimum total customer work price for Group Job is €100.</div>}
              {!result.isGroupLeadValid && <div>• Exactly 1 Group Lead must be selected.</div>}
              {!result.areHoursValid && <div>• Each specialist must have at least 2 hours assigned.</div>}
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Materials are excluded from calculation. Group Lead receives a 20% discount on the NordBase lead fee.
        </p>
      </div>

      {/* Output / Results Summary */}
      <div className="bg-slate-950/90 p-6 rounded-b-3xl border-t border-slate-800">
        <div className="space-y-3 text-sm">
          {/* Group summary stats */}
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block">Total Team</span>
              <span className="font-mono font-bold text-white text-sm">{result.totalTeamSize} specialists</span>
            </div>
            <div>
              <span className="text-slate-400 block">Group Lead</span>
              <span className="font-bold text-purple-300 text-sm truncate block">
                👑 {result.groupLead?.name || 'Unassigned'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">Total Hours</span>
            <span className="font-mono text-white">{result.totalHours} hrs</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">Total Work Value</span>
            <span className="font-mono font-bold text-white">€{result.totalWorkValue.toFixed(2)}</span>
          </div>

          {/* Lead breakdown */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-2 mt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Standard Lead Fee ({result.leadFormulaText})</span>
              <span className="font-mono font-bold text-rose-400">€{result.standardLeadFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-purple-300">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Group Lead Discount (20%)
              </span>
              <span className="font-mono font-bold text-emerald-400">-€{result.groupLeadDiscount.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center font-bold">
              <span className="text-white text-xs">Final Group Lead Fee</span>
              <span className="font-mono text-rose-400 text-sm">€{result.finalGroupLeadFee.toFixed(2)}</span>
            </div>

            {/* Platform Lead Economics Distribution */}
            <div className="mt-3 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Standard Lead Fee Economic Distribution (€{result.standardLeadFee.toFixed(2)})
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
                <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">TP (40%)</span>
                  <span className="font-bold text-cyan-300">€{result.economicDistribution.tpShare.toFixed(2)}</span>
                </div>
                <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">RP (10%)</span>
                  <span className="font-bold text-blue-300">€{result.economicDistribution.rpShare.toFixed(2)}</span>
                </div>
                <div className="p-1.5 bg-purple-950/40 rounded-lg border border-purple-500/30">
                  <span className="text-purple-300 block text-[9px]">Lead (20%)</span>
                  <span className="font-bold text-emerald-400">€{result.economicDistribution.groupLeadBonus.toFixed(2)}</span>
                </div>
                <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">NordBase (30%)</span>
                  <span className="font-bold text-slate-300">€{result.economicDistribution.nordbaseNetShare.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Price */}
          <div className="flex justify-between items-center pt-3 border-t border-white/10">
            <div>
              <span className="font-black text-white uppercase tracking-widest text-sm block">Customer Price</span>
              <span className="text-[10px] text-slate-400">Undiscounted labor value</span>
            </div>
            <span className="font-mono font-black text-cyan-400 text-2xl">
              €{result.customerPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
