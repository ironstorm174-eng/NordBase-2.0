export type SpecialistLevelKey = 'L1' | 'L2' | 'L3';

export const SPECIALIST_LEVELS: Record<SpecialistLevelKey, { label: string; hourlyRate: number }> = {
  L1: { label: 'Amateur', hourlyRate: 20 },
  L2: { label: 'Professional', hourlyRate: 25 },
  L3: { label: 'Expert', hourlyRate: 30 }
};

export function calculateLeadPrice(workValue: number) {
  const value = Math.max(50, Math.round(workValue));
  let fee = 0;
  let formulaText = '';

  if (value <= 100) {
    fee = Math.max(10, value * 0.20);
    formulaText = '20% (min €10)';
  } else if (value <= 200) {
    fee = Math.max(20, value * 0.15);
    formulaText = '15% (min €20)';
  } else {
    fee = Math.max(30, value * 0.10);
    formulaText = '10% (min €30)';
  }

  fee = Math.round(fee * 100) / 100;
  const tpShare = Number((fee * 0.40).toFixed(2));

  return { leadFee: fee, tpShare, formulaText, value };
}

export function calculateWorkPrice(hoursPerSpecialist: number, numSpecialists: number, level: SpecialistLevelKey) {
  const safeHours = Math.max(2, hoursPerSpecialist);
  const safeSpecs = Math.max(1, numSpecialists);
  const totalHours = safeHours * safeSpecs;
  const rate = SPECIALIST_LEVELS[level].hourlyRate;
  const rawWorkCost = totalHours * rate;
  const workCost = Math.max(50, rawWorkCost);
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
