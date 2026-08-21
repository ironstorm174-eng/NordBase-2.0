import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, ArrowRight, Users, Sparkles, ShieldCheck } from 'lucide-react';

interface JobCostEstimatorProps {
  onDescribeProblem?: () => void;
  onRequestTeam?: () => void;
}

type SpecialistLevel = 'amateur' | 'professional' | 'expert';

const LEVEL_RATES: Record<SpecialistLevel, number> = {
  amateur: 20,
  professional: 25,
  expert: 30,
};

const MINIMUM_JOB_PRICE = 50;

export default function JobCostEstimator({
  onDescribeProblem,
  onRequestTeam
}: JobCostEstimatorProps) {
  const { t } = useTranslation();
  const [hours, setHours] = useState<number>(2);
  const [level, setLevel] = useState<SpecialistLevel>('professional');

  const hourlyRate = LEVEL_RATES[level];
  const rawCost = hours * hourlyRate;
  const estimatedCost = Math.max(MINIMUM_JOB_PRICE, rawCost);

  const levelLabels: Record<SpecialistLevel, { name: string; rateText: string }> = {
    amateur: {
      name: t('estimator.amateur', 'Amateur'),
      rateText: '€20 / hour'
    },
    professional: {
      name: t('estimator.professional', 'Professional'),
      rateText: '€25 / hour'
    },
    expert: {
      name: t('estimator.expert', 'Expert'),
      rateText: '€30 / hour'
    }
  };

  const incrementHours = () => {
    if (hours < 12) setHours(prev => prev + 1);
  };

  const decrementHours = () => {
    if (hours > 1) setHours(prev => prev - 1);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 sm:my-12 px-4 sm:px-0">
      <div className="relative bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-950/50 backdrop-blur-md transition-all duration-300">
        {/* Subtle accent corner badge */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('estimator.badge', 'Instant Estimate')}</span>
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8 pr-28 sm:pr-32">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
            {t('estimator.title', 'How much will your job cost?')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('estimator.subtitle', 'Get a quick estimate of the labour cost.')}
          </p>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pb-6 border-b border-slate-800">
          {/* STEP 1 - HOURS */}
          <div className="flex flex-col justify-between">
            <label className="text-xs sm:text-sm font-bold text-slate-200 mb-3 block uppercase tracking-wider">
              {t('estimator.step1Label', '1. How many hours do you expect?')}
            </label>
            <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:p-2.5">
              <button
                type="button"
                onClick={decrementHours}
                disabled={hours <= 1}
                aria-label="Decrease hours"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95"
              >
                <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </button>

              <div className="text-center px-4">
                <span className="text-lg sm:text-xl font-black text-white font-mono">
                  {hours} {hours === 1 ? t('estimator.hourSingular', 'hour') : t('estimator.hourPlural', 'hours')}
                </span>
              </div>

              <button
                type="button"
                onClick={incrementHours}
                disabled={hours >= 12}
                aria-label="Increase hours"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {t('estimator.hoursRangeHint', 'Flexible selection from 1 to 12 hours.')}
            </p>
          </div>

          {/* STEP 2 - SPECIALIST LEVEL */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-slate-200 mb-3 block uppercase tracking-wider">
              {t('estimator.step2Label', '2. Choose specialist level')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['amateur', 'professional', 'expert'] as SpecialistLevel[]).map((lvl) => {
                const isSelected = level === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold font-display leading-tight">
                      {levelLabels[lvl].name}
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono text-cyan-400/90 mt-1 font-semibold">
                      {levelLabels[lvl].rateText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RESULT DISPLAY */}
        <div className="mt-6 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {hours} {hours === 1 ? 'hour' : 'hours'} × {levelLabels[level].name} (€{hourlyRate}/hour)
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-300">
                {t('estimator.estimatedLabourCost', 'Estimated labour cost:')}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono tracking-tight">
                €{estimatedCost}
              </span>
            </div>
          </div>

          {/* PRIMARY CTA */}
          <button
            type="button"
            onClick={onDescribeProblem}
            className="w-full sm:w-auto px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('estimator.describeProblemCTA', 'Describe your problem')}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* DISCLAIMER */}
        <p className="text-[11px] text-slate-500 mt-4 leading-normal flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>
            {t(
              'estimator.disclaimer',
              'Preliminary estimate. Materials and special expenses are not included.'
            )}
          </span>
        </p>

        {/* TEAM OPTION (Subtle secondary) */}
        <div className="mt-6 pt-5 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/40">
          <div className="flex items-start gap-2.5">
            <Users className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-300">
                {t('estimator.teamTitle', 'Need more than one specialist?')}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {t(
                  'estimator.teamSubtitle',
                  'Some jobs require a team. You can request 2 or more specialists for your job.'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRequestTeam}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap self-end sm:self-center"
          >
            <span>{t('estimator.requestTeamLink', 'Request a team →')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
