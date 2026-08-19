import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Calculator,
  Clock,
  Wrench,
  Sparkles,
  Check,
  Copy,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  ChevronRight,
  X,
} from "lucide-react";
import { ServiceCategory } from "../types";
import { CATEGORY_SPECIALTIES } from "../data";
import { calculateLeadPrice, SpecialistLevelKey } from "../utils/pricing";

export type SpecialistLevel = "L1" | "L2" | "L3";

export interface SpecialistTierInfo {
  id: SpecialistLevel;
  code: string;
  name: string;
  nameEn: string;
  hourlyRate: number;
  description: string;
  badgeColor: string;
}

export const SPECIALIST_LEVELS: Record<SpecialistLevel, SpecialistTierInfo> = {
  L1: {
    id: "L1",
    code: "L1",
    name: "L1 Amateur",
    nameEn: "L1 Amateur",
    hourlyRate: 20,
    description: "Basic and standard work, minor household repairs",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  L2: {
    id: "L2",
    code: "L2",
    name: "L2 Professional",
    nameEn: "L2 Professional",
    hourlyRate: 25,
    description: "Experienced specialist, complex assembly and service tasks",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
  L3: {
    id: "L3",
    code: "L3",
    name: "L3 Expert",
    nameEn: "L3 Expert",
    hourlyRate: 30,
    description: "Highest qualification, critical engineering systems",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
};

/**
 * Exact 9 categories for which the NordBase hourly calculator is enabled.
 */
export const CALCULATOR_CATEGORIES: ServiceCategory[] = [
  "Home Services",
  "Cleaning",
  "Gardening",
  "Moving",
  "Transport",
  "Repairs",
  "Construction",
  "Pools",
  "Hospitality",
];

export const CALCULATOR_CATEGORY_DETAILS: Record<
  ServiceCategory,
  { labelRu: string; icon: string }
> = {
  "Home Services": { labelRu: "Home Services (Бытовой ремонт & монтаж)", icon: "🏠" },
  "Cleaning": { labelRu: "Cleaning (Уборка & Клининг)", icon: "🧹" },
  "Gardening": { labelRu: "Gardening (Сад & Ландшафт)", icon: "🪴" },
  "Moving": { labelRu: "Moving (Переезды & Погрузка)", icon: "📦" },
  "Transport": { labelRu: "Transport (Логистика & Доставка)", icon: "🚚" },
  "Repairs": { labelRu: "Repairs (Ремонт техники & HVAC)", icon: "🔧" },
  "Construction": { labelRu: "Construction (Строительство & Отделка)", icon: "🏗️" },
  "Pools": { labelRu: "Pools (Бассейны & Водоподготовка)", icon: "🏊" },
  "Hospitality": { labelRu: "Hospitality (Сервис & HoReCa)", icon: "🍽️" },
  "Care": { labelRu: "Care (Уход)", icon: "❤️" },
  "Lessons": { labelRu: "Lessons (Обучение)", icon: "📚" },
  "Business": { labelRu: "Business (Услуги)", icon: "💼" },
};

export interface PricingCalculationResult {
  category: ServiceCategory;
  subcategory: string;
  specialty: string;
  level: SpecialistLevel;
  hourlyRate: number;
  hours: number;
  materialsCost: number;
  rawLaborCost: number;
  laborCost: number; // Math.max(rawLaborCost, 50)
  isMinLaborApplied: boolean;
  totalOrderCost: number; // laborCost
  leadFee: number;
  leadFeePercentage: number;
  leadTierText: string;
  specialistNetPayout: number; // laborCost - leadFee
  effectiveSpecialistRate: number;
}

/**
 * Pure calculation logic adhering to NordBase business rules:
 * - Minimum 2 hours
 * - Minimum labor cost: €50
 * - Progressive lead fee formula from pricing utils
 */
export function calculateNordBasePricing(
  hours: number,
  level: SpecialistLevel,
  _materialsCost: number = 0,
  subcategory: string = "Plumber",
  category: ServiceCategory = "Home Services"
): PricingCalculationResult {
  const safeHours = Math.max(2, Number(hours) || 2);
  const tierInfo = SPECIALIST_LEVELS[level] || SPECIALIST_LEVELS.L2;
  const hourlyRate = tierInfo.hourlyRate;

  const rawLaborCost = safeHours * hourlyRate;
  const laborCost = Math.max(50, rawLaborCost);
  const isMinLaborApplied = laborCost > rawLaborCost;

  const totalOrderCost = laborCost;

  // Use the new centralized pricing utility
  const leadPricing = calculateLeadPrice(totalOrderCost);
  const leadFee = leadPricing.leadFee;

  const leadFeePercentage = Math.round((leadFee / totalOrderCost) * 1000) / 10;
  const specialistNetPayout = Math.max(0, Math.round((laborCost - leadFee) * 100) / 100);
  const effectiveSpecialistRate = Math.round((specialistNetPayout / safeHours) * 100) / 100;

  return {
    category,
    subcategory,
    specialty: `${category} • ${subcategory}`,
    level,
    hourlyRate,
    hours: safeHours,
    materialsCost: 0,
    rawLaborCost,
    laborCost,
    isMinLaborApplied,
    totalOrderCost,
    leadFee,
    leadFeePercentage,
    leadTierText: leadPricing.formulaText,
    specialistNetPayout,
    effectiveSpecialistRate,
  };
}

interface NordBasePricingCalculatorProps {
  initialCategory?: ServiceCategory | string;
  initialSpecialty?: string;
  initialLevel?: SpecialistLevel;
  initialHours?: number;
  initialMaterials?: number;
  onApply?: (result: PricingCalculationResult) => void;
  onClose?: () => void;
  isModal?: boolean;
  className?: string;
  showTitle?: boolean;
}

export default function NordBasePricingCalculator({
  initialCategory,
  initialSpecialty,
  initialLevel = "L2",
  initialHours = 2,
  onApply,
  onClose,
  isModal = false,
  className = "",
  showTitle = true,
}: NordBasePricingCalculatorProps) {
  const { t } = useTranslation();

  // Resolve initial category
  const resolvedCategory: ServiceCategory = useMemo(() => {
    if (initialCategory && CALCULATOR_CATEGORIES.includes(initialCategory as ServiceCategory)) {
      return initialCategory as ServiceCategory;
    }
    // Try to find category from initialSpecialty
    if (initialSpecialty) {
      for (const cat of CALCULATOR_CATEGORIES) {
        if (CATEGORY_SPECIALTIES[cat]?.includes(initialSpecialty)) {
          return cat;
        }
      }
    }
    return "Home Services";
  }, [initialCategory, initialSpecialty]);

  // Resolve initial subcategory
  const resolvedSubcategory = useMemo(() => {
    const available = CATEGORY_SPECIALTIES[resolvedCategory] || [];
    if (initialSpecialty && available.includes(initialSpecialty)) {
      return initialSpecialty;
    }
    return available[0] || "Plumber";
  }, [resolvedCategory, initialSpecialty]);

  const [category, setCategory] = useState<ServiceCategory>(resolvedCategory);
  const [subcategory, setSubcategory] = useState<string>(resolvedSubcategory);
  const [level, setLevel] = useState<SpecialistLevel>(initialLevel);
  const [hours, setHours] = useState<number>(initialHours);
  const [copied, setCopied] = useState<boolean>(false);

  // Available subcategories for current category
  const availableSubcategories = CATEGORY_SPECIALTIES[category] || [];

  const handleCategoryChange = (newCat: ServiceCategory) => {
    setCategory(newCat);
    const subList = CATEGORY_SPECIALTIES[newCat] || [];
    setSubcategory(subList[0] || "");
  };

  const result = useMemo(() => {
    return calculateNordBasePricing(hours, level, 0, subcategory, category);
  }, [hours, level, subcategory, category]);

  const handleCopySummary = () => {
    const text = `📋 ${t('calc.orderLeadCalc', 'Order & Lead Calculator')}
━━━━━━━━━━━━━━━━━━━━
📁 ${t('calc.serviceCategory', 'Category')}: ${t(`categories.${result.category}`, result.category)}
🛠 ${t('calc.subcatSpecialty', 'Subcategory')}: ${t(`specialties.${result.subcategory}`, result.subcategory)}
⭐ ${t('calc.specialistQual', 'Level')}: ${t(`calc.level${result.level}Name`, SPECIALIST_LEVELS[result.level].nameEn)} (€${result.hourlyRate}/${t('calc.hours', 'h')})
⏱ ${t('calc.hoursExec', 'Execution Time')}: ${result.hours} ${t('calc.hours', 'h')}
💰 ${t('calc.calcWorkCost', 'Labor')}: €${result.laborCost.toFixed(2)}${result.isMinLaborApplied ? ` (${t('calc.minOrderTriggered', 'min. order €50')})` : ''}
━━━━━━━━━━━━━━━━━━━━
🎯 ${t('calc.totalToCust', 'Total to Customer')}: €${result.totalOrderCost.toFixed(2)}
🏷 ${t('calc.leadCost', 'Lead Fee')}: €${result.leadFee.toFixed(2)} (${result.leadFeePercentage}%)
💵 ${t('calc.netIncome', 'Net Income')}: €${result.specialistNetPayout.toFixed(2)} (€${result.effectiveSpecialistRate}/${t('calc.hours', 'h')})`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const containerContent = (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-white space-y-6 ${className}`}
    >
      {/* Header */}
      {showTitle && (
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-display font-black text-white tracking-tight">
                  {t('calc.orderLeadCalc', 'Order & Lead Calculator')}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  NordBase Formula
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('calc.calcSync', 'Categories and subcategories are synchronized with the NordBase database')}
              </p>
            </div>
          </div>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Controls */}
        <div className="space-y-5">
          {/* 1. Category & Subcategory Selection */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('calc.serviceCategory', 'Category')} ({CALCULATOR_CATEGORIES.length})</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">NordBase DB</span>
              </label>

              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ServiceCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                {CALCULATOR_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {CALCULATOR_CATEGORY_DETAILS[cat]?.icon} {t(`categories.${cat}`, cat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('calc.subcatSpecialty', 'Subcategory / Specialty')}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {availableSubcategories.length} {t('calc.specialists', 'specialties')}
                </span>
              </label>

              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                {availableSubcategories.map((sub) => (
                  <option key={sub} value={sub} className="bg-slate-900 text-white">
                    {t(`specialties.${sub}`, sub)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Specialist Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('calc.specialistQual', 'Specialist Qualification')}</span>
              </label>
              <span className="text-xs font-mono font-bold text-cyan-400">
                €{SPECIALIST_LEVELS[level].hourlyRate}/{t('calc.hours', 'h')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(SPECIALIST_LEVELS) as SpecialistLevel[]).map((lvlKey) => {
                const tier = SPECIALIST_LEVELS[lvlKey];
                const isSelected = level === lvlKey;
                return (
                  <button
                    key={lvlKey}
                    type="button"
                    onClick={() => setLevel(lvlKey)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-cyan-600/20 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/50"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-black text-sm">{tier.code}</span>
                      <span
                        className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        €{tier.hourlyRate}/h
                      </span>
                    </div>
                    <div className="text-[11px] font-bold truncate">
                      {t(`calc.level${lvlKey}Name`, tier.nameEn)}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400">
              {t(`calc.level${level}Desc`, SPECIALIST_LEVELS[level].description)}
            </p>
          </div>

          {/* 3. Hours (Time-only calculation) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{t('calc.hoursExec', 'Execution Time (hours, min 2h)')}</span>
              </label>
              <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">
                {hours} {t('calc.hours', 'h')} = €{result.laborCost.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHours((h) => Math.max(2, h - 1))}
                disabled={hours <= 2}
                className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold disabled:opacity-40 hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                min={2}
                max={48}
                step={0.5}
                value={hours}
                onChange={(e) => setHours(Math.max(2, parseFloat(e.target.value) || 2))}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl text-center py-2.5 text-base font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => setHours((h) => h + 1)}
                className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Quick Hours Presets */}
            <div className="flex gap-1.5">
              {[2, 3, 4, 5, 6, 8, 10, 12].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                    hours === h
                      ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {h}{t('calc.hours', 'h')}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              💡 {t('calc.hourlyNote', 'The calculation is based strictly on elapsed time. Material purchases are agreed separately.')}
            </p>
          </div>
        </div>

        {/* Right Column: Transparent Summary & Breakdown */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-inner">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t('calc.transparentHourly', 'Transparent Hourly Calculation')}</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold truncate max-w-[200px]">
                {t(`categories.${result.category}`, result.category)}
              </span>
            </div>

            {/* Line items */}
            <div className="space-y-2.5 mt-3 text-xs">
              {/* Category & Subcategory info */}
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">{t('calc.categorySubcat', 'Category / Subcategory')}</span>
                <span className="font-semibold text-cyan-300 text-right">
                  {t(`categories.${result.category}`, result.category)} • {t(`specialties.${result.subcategory}`, result.subcategory)}
                </span>
              </div>

              {/* Labor Row */}
              <div className="flex justify-between items-center py-1">
                <div className="flex flex-col">
                  <span className="text-slate-300 font-medium">
                    {t('calc.timePayment', 'Labor Payment ({{hours}}h × €{{rate}})', { hours: result.hours, rate: result.hourlyRate })}
                  </span>
                  {result.isMinLaborApplied && (
                    <span className="text-[10px] text-amber-400 font-medium">
                      ⚠️ {t('calc.minOrderTriggered', 'Minimum order applied (€50)')}
                    </span>
                  )}
                </div>
                <span className="font-mono font-bold text-white text-sm">
                  €{result.laborCost.toFixed(2)}
                </span>
              </div>

              {/* Total Order Cost (Highlight) */}
              <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-900 border border-cyan-500/30">
                <span className="font-bold text-white text-sm">{t('calc.totalToCust', 'Total to Customer')}</span>
                <span className="font-mono font-black text-cyan-400 text-lg">
                  €{result.totalOrderCost.toFixed(2)}
                </span>
              </div>

              {/* Progressive Lead Fee Calculation Details */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 mt-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-300">{t('calc.leadCost', 'Lead Cost (NordBase)')}</span>
                    <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/20">
                      {result.leadFeePercentage}%
                    </span>
                  </div>
                  <span className="font-mono font-bold text-rose-400">
                    -€{result.leadFee.toFixed(2)}
                  </span>
                </div>

                {/* Tier Explanation Badge */}
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/5">
                  <span>{t('calc.rateScale', 'Rate Scale:')}</span>
                  <span className="font-mono text-slate-300 font-medium">
                    {result.leadTierText}
                  </span>
                </div>
              </div>

              {/* Specialist Net Income */}
              <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex flex-col">
                  <span className="font-bold text-emerald-300 text-xs">{t('calc.netIncome', 'Specialist Net Income')}</span>
                  <span className="text-[10px] text-emerald-400/80 font-mono">
                    ({t('calc.effectiveRate', 'effective rate: €{{rate}}/h', { rate: result.effectiveSpecialistRate.toFixed(2) })})
                  </span>
                </div>
                <span className="font-mono font-black text-emerald-400 text-base">
                  €{result.specialistNetPayout.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">{t('calc.copied', 'Copied!')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>{t('calc.copyBtn', 'Copy for Customer/Specialist')}</span>
                </>
              )}
            </button>

            {onApply && (
              <button
                type="button"
                onClick={() => onApply(result)}
                className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-98"
              >
                <span>{t('calc.applyBtn', 'Apply to order')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
        <div className="w-full max-w-3xl">
          {containerContent}
        </div>
      </div>
    );
  }

  return containerContent;
}

