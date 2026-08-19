import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Truck } from 'lucide-react';
import WorkAndLeadCalculator from './WorkAndLeadCalculator';
import GroupWorkCalculator from './GroupWorkCalculator';

export default function CalculatorsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
          <Calculator className="w-7 h-7 text-cyan-400" />
          {t('calc.title', 'NordBase Calculators')}
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {t('calc.subtitle', 'Centralized tools for pricing calculation, lead fees, and team estimations.')}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Work & Lead Calculator (Individual Jobs) */}
        <WorkAndLeadCalculator />

        {/* Group Work Calculator (Team Jobs) */}
        <GroupWorkCalculator />
      </div>

      {/* Driver / Transport Calculator Placeholder */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden max-w-2xl">
        <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {t('calc.comingNext', 'Coming next')}
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-300">{t('calc.comingSubtitle', 'Driver / Transport Calculator')}</h3>
        </div>
        <p className="text-slate-500 text-sm">
          {t('calc.comingDesc', 'Calculate delivery, heavy cargo moving, and distance-based rates with specialized vehicle configurations.')}
        </p>
      </div>
    </div>
  );
}
