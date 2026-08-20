export type SpecialistLevelKey = 'L1' | 'L2' | 'L3';

import {
  DEFAULT_PORTUGAL_PRICING_CONFIG,
  calculateDriverTransportPrice,
  calculateNordBaseLeadFeeEuro
} from './pricingEngine';
import { TerritoryPricingConfig } from '../types';

export { DEFAULT_PORTUGAL_PRICING_CONFIG, calculateDriverTransportPrice, calculateNordBaseLeadFeeEuro };

export const SPECIALIST_LEVELS: Record<SpecialistLevelKey, { label: string; hourlyRate: number }> = {
  L1: { label: 'Amateur', hourlyRate: 20 },
  L2: { label: 'Professional', hourlyRate: 25 },
  L3: { label: 'Expert', hourlyRate: 30 }
};

export function calculateLeadPrice(workValue: number) {
  return calculateNordBaseLeadFeeEuro(workValue);
}

export function calculateWorkPrice(
  hoursPerSpecialist: number,
  numSpecialists: number,
  level: SpecialistLevelKey,
  config: TerritoryPricingConfig = DEFAULT_PORTUGAL_PRICING_CONFIG
) {
  const minBillableHours = config?.minimumBooking?.minimumBillableHours || 2;
  const safeHours = Math.max(minBillableHours, hoursPerSpecialist);
  const safeSpecs = Math.max(1, numSpecialists);
  const totalHours = safeHours * safeSpecs;
  
  let rate = SPECIALIST_LEVELS[level].hourlyRate;
  if (config?.categoryRates && config.categoryRates.length > 0) {
    const defaultCat = config.categoryRates[0];
    if (level === 'L1') rate = defaultCat.standardRateCents / 100;
    if (level === 'L2') rate = defaultCat.proRateCents / 100;
    if (level === 'L3') rate = defaultCat.expertRateCents / 100;
  }
  
  const rawWorkCost = totalHours * rate;
  const minCost = (config?.minimumBooking?.minimumLaborCostCents || 5000) / 100;
  const workCost = Math.max(minCost, rawWorkCost);
  const isMinLaborApplied = workCost > rawWorkCost;

  return { totalHours, rate, rawWorkCost, workCost, isMinLaborApplied };
}

export interface GroupSpecialistItem {
  id: string;
  name?: string;
  level: SpecialistLevelKey;
  hours: number;
  isGroupLead: boolean;
}

export function calculateGroupWorkPrice(specialists: GroupSpecialistItem[]) {
  const isTeamSizeValid = specialists.length >= 2;
  const groupLeadCount = specialists.filter(s => s.isGroupLead).length;
  const isGroupLeadValid = groupLeadCount === 1;
  const areHoursValid = specialists.every(s => s.hours >= 2);

  let totalHours = 0;
  let rawWorkCost = 0;

  const specialistBreakdown = specialists.map(s => {
    const safeHours = Math.max(2, Number(s.hours) || 2);
    const rate = SPECIALIST_LEVELS[s.level]?.hourlyRate || 25;
    const workCost = safeHours * rate;
    totalHours += safeHours;
    rawWorkCost += workCost;
    return {
      ...s,
      safeHours,
      rate,
      workCost
    };
  });

  const isWorkValueValid = rawWorkCost >= 100;
  const totalWorkValue = Math.max(100, rawWorkCost);
  const isMinLaborApplied = totalWorkValue > rawWorkCost;

  const isValid = isTeamSizeValid && isGroupLeadValid && areHoursValid && isWorkValueValid;

  const standardLead = calculateLeadPrice(totalWorkValue);
  const standardLeadFee = standardLead.leadFee;
  
  // Platform economic distribution of Standard Lead Fee:
  // TP = 40%, RP = 10%, Group Lead Bonus = 20%, NordBase Net = 30%
  const tpShare = Math.round(standardLeadFee * 0.40 * 100) / 100;
  const rpShare = Math.round(standardLeadFee * 0.10 * 100) / 100;
  const groupLeadDiscount = Math.round(standardLeadFee * 0.20 * 100) / 100;
  const nordbaseNetShare = Math.round((standardLeadFee - tpShare - rpShare - groupLeadDiscount) * 100) / 100;
  
  const finalGroupLeadFee = Math.round((standardLeadFee - groupLeadDiscount) * 100) / 100;
  const customerPrice = totalWorkValue;

  return {
    isValid,
    isTeamSizeValid,
    isGroupLeadValid,
    areHoursValid,
    isWorkValueValid,
    totalTeamSize: specialists.length,
    groupLead: specialistBreakdown.find(s => s.isGroupLead) || null,
    specialistBreakdown,
    totalHours,
    rawWorkCost,
    totalWorkValue,
    isMinLaborApplied,
    standardLeadFee,
    groupLeadDiscount,
    finalGroupLeadFee,
    customerPrice,
    economicDistribution: {
      tpShare,             // 40%
      rpShare,             // 10%
      groupLeadBonus: groupLeadDiscount, // 20%
      nordbaseNetShare     // 30%
    },
    leadFormulaText: standardLead.formulaText
  };
}
