import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Truck, Briefcase, Users } from 'lucide-react';
import WorkAndLeadCalculator from './WorkAndLeadCalculator';
import GroupWorkCalculator from './GroupWorkCalculator';

export default function CalculatorsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'individual' | 'group'>('individual');

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 text-center sm:text-left">
        <h2 className="text-2xl font-display font-black text-white flex items-center justify-center sm:justify-start gap-3">
          <Calculator className="w-7 h-7 text-cyan-400" />
          {t('calc.title', 'NordBase Calculators')}
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {t('calc.subtitle', 'Centralized tools for pricing calculation, lead fees, and team estimations.')}
        </p>
      </div>

      {/* Sleek Sub-Tab Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800/60 max-w-3xl mx-auto shadow-inner w-full">
        <button
          onClick={() => setActiveTab('individual')}
          className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
            activeTab === 'individual'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-950/30'
              : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{t('calc.workLeadTitle', 'Work & Lead Calculator')}</span>
        </button>

        <button
          onClick={() => setActiveTab('group')}
          className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
            activeTab === 'group'
              ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-lg shadow-purple-950/30'
              : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('calc.groupTitle', 'Group Work Calculator')}</span>
        </button>

        <div
          className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-bold text-sm border border-transparent text-slate-600 bg-transparent select-none relative"
        >
          <Truck className="w-4 h-4 text-slate-600" />
          <span>{t('calc.comingSubtitle', 'Driver Rate')}</span>
          <span className="absolute top-1 right-2 bg-amber-500/20 text-amber-300 text-[8px] uppercase font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
            {t('calc.comingNext', 'Soon')}
          </span>
        </div>
      </div>

      {/* Active Tab Container */}
      <div className="max-w-3xl mx-auto w-full mt-2 animate-in fade-in duration-300">
        {activeTab === 'individual' ? (
          <WorkAndLeadCalculator />
        ) : (
          <GroupWorkCalculator />
        )}
      </div>
    </div>
  );
}
