import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Briefcase, 
  Clock, 
  Sparkles, 
  Calculator,
  User
} from 'lucide-react';
import { ServiceCategory } from '../../types';
import { CALCULATOR_CATEGORIES, CALCULATOR_CATEGORY_DETAILS } from '../NordBasePricingCalculator';
import { calculateWorkPrice, calculateLeadPrice, SpecialistLevelKey, SPECIALIST_LEVELS } from '../../utils/pricing';

export default function WorkAndLeadCalculator() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<ServiceCategory>('Home Services');
  const [level, setLevel] = useState<SpecialistLevelKey>('L2');
  const [hours, setHours] = useState<number>(2);
  const [numSpecialists, setNumSpecialists] = useState<number>(1);

  const workResult = calculateWorkPrice(hours, numSpecialists, level);
  const leadResult = calculateLeadPrice(workResult.workCost);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col h-full">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t('calc.workLeadTitle', 'Work & Lead Calculator')}</h3>
            <p className="text-[11px] text-slate-400">{t('calc.workLeadSubtitle', 'Standard individual job pricing')}</p>
          </div>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/20 uppercase">
          {t('calc.active', 'Active')}
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Category */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            {t('calc.serviceCategory', 'Service Category')}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ServiceCategory)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-cyan-500 transition-colors"
          >
            {CALCULATOR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CALCULATOR_CATEGORY_DETAILS[cat]?.icon} {t(`categories.${cat}`, cat)}
              </option>
            ))}
          </select>
        </div>

        {/* Qualification */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            {t('calc.specialistQual', 'Specialist Qualification')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(SPECIALIST_LEVELS) as SpecialistLevelKey[]).map((lvlKey) => {
              const tier = SPECIALIST_LEVELS[lvlKey];
              const isSelected = level === lvlKey;
              return (
                <button
                  key={lvlKey}
                  type="button"
                  onClick={() => setLevel(lvlKey)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-cyan-600/20 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-sm">{tier.label}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-cyan-400">
                    €{tier.hourlyRate}/h
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time and Scale */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {t('calc.specialists', 'Specialists')}
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNumSpecialists(Math.max(1, numSpecialists - 1))}
                className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold hover:bg-slate-800"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={numSpecialists}
                onChange={(e) => setNumSpecialists(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl text-center py-2 text-base font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => setNumSpecialists(numSpecialists + 1)}
                className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold hover:bg-slate-800"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              {t('calc.hoursSpec', 'Hours / Spec (Min 2)')}
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHours(Math.max(2, hours - 0.5))}
                className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold hover:bg-slate-800"
              >
                -
              </button>
              <input
                type="number"
                min={2}
                step={0.5}
                value={hours}
                onChange={(e) => setHours(Math.max(2, parseFloat(e.target.value) || 2))}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl text-center py-2 text-base font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => setHours(hours + 0.5)}
                className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold hover:bg-slate-800"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-2">
          <Sparkles className="w-3.5 h-3.5" />
          {t('calc.materialsExcl', 'Materials are entirely excluded from calculations and handled directly with the client.')}
        </p>
      </div>

      {/* Results */}
      <div className="bg-slate-950/80 p-6 rounded-b-3xl border-t border-slate-800">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">{t('calc.totalWorkHours', 'Total Work Hours')}</span>
            <span className="font-mono text-white">{workResult.totalHours} {t('calc.hours', 'hrs')}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">{t('calc.calcWorkCost', 'Calculated Work Cost')}</span>
            <div className="flex flex-col items-end">
              <span className="font-mono text-white font-bold">€{workResult.workCost.toFixed(2)}</span>
              {workResult.isMinLaborApplied && (
                <span className="text-[10px] text-amber-400 uppercase tracking-wider">{t('calc.minApplied', 'Min €50 Applied', { value: '€50' })}</span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 mt-2">
            <div>
              <span className="font-bold text-slate-300 block">{t('calc.leadPrice', 'Lead Price')}</span>
              <span className="text-[10px] font-mono text-cyan-400">{t('calc.formulaText', 'Formula:')} {leadResult.formulaText}</span>
            </div>
            <span className="font-mono font-bold text-rose-400">€{leadResult.leadFee.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center pt-4 mt-2 border-t border-white/10">
            <span className="font-black text-white uppercase tracking-widest text-sm">{t('calc.totalCustPrice', 'Total Customer Price')}</span>
            <span className="font-mono font-black text-cyan-400 text-2xl">
              €{(workResult.workCost + leadResult.leadFee).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
