import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, ArrowRight, Users, Sparkles, ShieldCheck, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

interface JobCostEstimatorProps {
  onDescribeProblem?: () => void;
  onRequestTeam?: () => void;
  initialOpen?: boolean;
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
  onRequestTeam,
  initialOpen = false
}: JobCostEstimatorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [hours, setHours] = useState<number>(2);
  const [level, setLevel] = useState<SpecialistLevel>('professional');

  const hourlyRate = LEVEL_RATES[level];
  const rawCost = hours * hourlyRate;
  const estimatedCost = Math.max(MINIMUM_JOB_PRICE, rawCost);

  const levelLabels: Record<SpecialistLevel, { name: string; rateText: string }> = {
    amateur: {
      name: t('estimator.amateur', 'Amateur'),
      rateText: '€20 / h'
    },
    professional: {
      name: t('estimator.professional', 'Professional'),
      rateText: '€25 / h'
    },
    expert: {
      name: t('estimator.expert', 'Expert'),
      rateText: '€30 / h'
    }
  };

  const incrementHours = () => {
    if (hours < 12) setHours(prev => prev + 1);
  };

  const decrementHours = () => {
    if (hours > 1) setHours(prev => prev - 1);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 sm:my-10 px-4 sm:px-0">
      <div className="relative bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-950/50 backdrop-blur-md transition-all duration-300 overflow-hidden">
        
        {/* COLLAPSED HEADER / TRIGGER BAR */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight font-display truncate">
                  {t('estimator.title', 'How much will your job cost?')}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold rounded-full whitespace-nowrap">
                  <Sparkles className="w-3 h-3" />
                  {t('estimator.badge', 'Instant Estimate')}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {t('estimator.subtitle', 'Get a quick estimate of the labour cost.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {!isOpen && (
              <span className="hidden md:inline-block text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1.5 rounded-xl">
                {t('estimator.calculateEstimate', 'Calculate Cost')}
              </span>
            )}
            <button
              type="button"
              aria-label={isOpen ? t('estimator.hideEstimate', 'Hide Calculator') : t('estimator.calculateEstimate', 'Calculate Cost')}
              className="p-2 sm:p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isOpen ? (
                <>
                  <span className="hidden sm:inline text-xs font-bold text-slate-400">{t('estimator.hideEstimate', 'Hide')}</span>
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </>
              ) : (
                <>
                  <span className="sm:hidden text-xs font-bold text-cyan-400">{t('estimator.calculateEstimate', 'Calculate')}</span>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* EXPANDABLE BODY */}
        {isOpen && (
          <div className="px-4 pb-5 sm:px-8 sm:pb-8 pt-2 border-t border-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-200">
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
                  {hours} {hours === 1 ? t('estimator.hourSingular', 'hour') : t('estimator.hourPlural', 'hours')} × {levelLabels[level].name} (€{hourlyRate}/h)
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
                <span>{t('estimator.describeProblemCTA', 'Describe your problem →')}</span>
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
        )}
      </div>
    </div>
  );
}

