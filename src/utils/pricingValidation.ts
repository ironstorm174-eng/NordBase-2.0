import { calculateGroupWorkPrice, calculateLeadPrice, calculateWorkPrice, GroupSpecialistItem } from './pricing.js';

console.log('=== STARTING NORDBASE GROUP WORK PRICING VALIDATION ===\n');

let passedTests = 0;
let totalTests = 0;

function assertEqual(testName: string, actual: any, expected: any) {
  totalTests++;
  const match = JSON.stringify(actual) === JSON.stringify(expected);
  if (match) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    console.error(`   Expected: ${JSON.stringify(expected)}`);
    console.error(`   Actual:   ${JSON.stringify(actual)}`);
  }
}

// 1. Individual Job Minimums
assertEqual(
  'Individual job minimum work order is €50',
  calculateWorkPrice(2, 1, 'L1').workCost,
  50
);

// 2. Lead Fee minimums & continuous thresholds
assertEqual(
  '€50 work value lead fee (min €10)',
  calculateLeadPrice(50).leadFee,
  10
);

assertEqual(
  '€100 work value lead fee (20% = €20)',
  calculateLeadPrice(100).leadFee,
  20
);

assertEqual(
  '€101 work value lead fee (15% = €15.15 => min €20 enforced)',
  calculateLeadPrice(101).leadFee,
  20
);

assertEqual(
  '€130 work value lead fee (15% = €19.50 => min €20 enforced)',
  calculateLeadPrice(130).leadFee,
  20
);

assertEqual(
  '€200 work value lead fee (15% = €30)',
  calculateLeadPrice(200).leadFee,
  30
);

assertEqual(
  '€201 work value lead fee (10% = €20.10 => min €30 enforced)',
  calculateLeadPrice(201).leadFee,
  30
);

assertEqual(
  '€400 work value lead fee (10% = €40)',
  calculateLeadPrice(400).leadFee,
  40
);

assertEqual(
  '€480 work value lead fee (10% = €48)',
  calculateLeadPrice(480).leadFee,
  48
);

// 3. Group Work Specific Economic Validation
// €100 Work Value (2 Professional x 2 hours)
const group100: GroupSpecialistItem[] = [
  { id: '1', level: 'L2', hours: 2, isGroupLead: true },
  { id: '2', level: 'L2', hours: 2, isGroupLead: false }
];
const res100 = calculateGroupWorkPrice(group100);
assertEqual('€100 Group Job Validity', res100.isValid, true);
assertEqual('€100 Total Work Value', res100.totalWorkValue, 100);
assertEqual('€100 Standard Lead Fee (20%)', res100.standardLeadFee, 20);
assertEqual('€100 Group Lead Discount (20% of €20)', res100.groupLeadDiscount, 4);
assertEqual('€100 Final Group Lead Fee (€20 - €4)', res100.finalGroupLeadFee, 16);
assertEqual('€100 Customer Price', res100.customerPrice, 100);
assertEqual('€100 Economic Distribution TP (40%)', res100.economicDistribution.tpShare, 8);
assertEqual('€100 Economic Distribution RP (10%)', res100.economicDistribution.rpShare, 2);
assertEqual('€100 Economic Distribution Group Lead Bonus (20%)', res100.economicDistribution.groupLeadBonus, 4);
assertEqual('€100 Economic Distribution NordBase Net (30%)', res100.economicDistribution.nordbaseNetShare, 6);

// €120 Work Value (2 Expert x 2 hours)
const group120: GroupSpecialistItem[] = [
  { id: '1', level: 'L3', hours: 2, isGroupLead: true },
  { id: '2', level: 'L3', hours: 2, isGroupLead: false }
];
const res120 = calculateGroupWorkPrice(group120);
assertEqual('€120 Total Work Value', res120.totalWorkValue, 120);
assertEqual('€120 Standard Lead Fee (15% = 18 => min €20)', res120.standardLeadFee, 20);
assertEqual('€120 Group Lead Discount', res120.groupLeadDiscount, 4);
assertEqual('€120 Final Group Lead Fee', res120.finalGroupLeadFee, 16);
assertEqual('€120 Economic Distribution NordBase Net (30%)', res120.economicDistribution.nordbaseNetShare, 6);

// €130 Work Value (1 Expert 2.5h (€75) + 1 Professional 2.2h (€55) = €130)
const group130: GroupSpecialistItem[] = [
  { id: '1', level: 'L3', hours: 2.5, isGroupLead: true },
  { id: '2', level: 'L2', hours: 2.2, isGroupLead: false }
];
const res130 = calculateGroupWorkPrice(group130);
assertEqual('€130 Total Work Value', res130.totalWorkValue, 130);
assertEqual('€130 Standard Lead Fee (15% = 19.5 => min €20)', res130.standardLeadFee, 20);
assertEqual('€130 Group Lead Discount', res130.groupLeadDiscount, 4);
assertEqual('€130 Final Group Lead Fee', res130.finalGroupLeadFee, 16);

// €200 Work Value (4 Professional x 2 hours = 4x2x25 = 200)
const group200: GroupSpecialistItem[] = [
  { id: '1', level: 'L2', hours: 2, isGroupLead: true },
  { id: '2', level: 'L2', hours: 2, isGroupLead: false },
  { id: '3', level: 'L2', hours: 2, isGroupLead: false },
  { id: '4', level: 'L2', hours: 2, isGroupLead: false }
];
const res200 = calculateGroupWorkPrice(group200);
assertEqual('€200 Total Work Value', res200.totalWorkValue, 200);
assertEqual('€200 Standard Lead Fee (15%)', res200.standardLeadFee, 30);
assertEqual('€200 Group Lead Discount (20% of €30)', res200.groupLeadDiscount, 6);
assertEqual('€200 Final Group Lead Fee', res200.finalGroupLeadFee, 24);
assertEqual('€200 Economic Distribution TP (40%)', res200.economicDistribution.tpShare, 12);
assertEqual('€200 Economic Distribution RP (10%)', res200.economicDistribution.rpShare, 3);
assertEqual('€200 Economic Distribution Group Lead Bonus (20%)', res200.economicDistribution.groupLeadBonus, 6);
assertEqual('€200 Economic Distribution NordBase Net (30%)', res200.economicDistribution.nordbaseNetShare, 9);

// €400 Work Value (4 Professional x 4 hours)
const group400: GroupSpecialistItem[] = [
  { id: '1', level: 'L2', hours: 4, isGroupLead: true },
  { id: '2', level: 'L2', hours: 4, isGroupLead: false },
  { id: '3', level: 'L2', hours: 4, isGroupLead: false },
  { id: '4', level: 'L2', hours: 4, isGroupLead: false }
];
const res400 = calculateGroupWorkPrice(group400);
assertEqual('€400 Total Work Value', res400.totalWorkValue, 400);
assertEqual('€400 Standard Lead Fee (10%)', res400.standardLeadFee, 40);
assertEqual('€400 Group Lead Discount (20% of €40)', res400.groupLeadDiscount, 8);
assertEqual('€400 Final Group Lead Fee', res400.finalGroupLeadFee, 32);
assertEqual('€400 Economic Distribution TP (40%)', res400.economicDistribution.tpShare, 16);
assertEqual('€400 Economic Distribution RP (10%)', res400.economicDistribution.rpShare, 4);
assertEqual('€400 Economic Distribution Group Lead Bonus (20%)', res400.economicDistribution.groupLeadBonus, 8);
assertEqual('€400 Economic Distribution NordBase Net (30%)', res400.economicDistribution.nordbaseNetShare, 12);

// €480 Work Value (4 Expert x 4 hours = 4x4x30 = 480)
const group480: GroupSpecialistItem[] = [
  { id: '1', level: 'L3', hours: 4, isGroupLead: true },
  { id: '2', level: 'L3', hours: 4, isGroupLead: false },
  { id: '3', level: 'L3', hours: 4, isGroupLead: false },
  { id: '4', level: 'L3', hours: 4, isGroupLead: false }
];
const res480 = calculateGroupWorkPrice(group480);
assertEqual('€480 Total Work Value', res480.totalWorkValue, 480);
assertEqual('€480 Standard Lead Fee (10%)', res480.standardLeadFee, 48);
assertEqual('€480 Group Lead Discount (20% of €48)', res480.groupLeadDiscount, 9.60);
assertEqual('€480 Final Group Lead Fee', res480.finalGroupLeadFee, 38.40);
assertEqual('€480 Economic Distribution TP (40%)', res480.economicDistribution.tpShare, 19.20);
assertEqual('€480 Economic Distribution RP (10%)', res480.economicDistribution.rpShare, 4.80);
assertEqual('€480 Economic Distribution Group Lead Bonus (20%)', res480.economicDistribution.groupLeadBonus, 9.60);
assertEqual('€480 Economic Distribution NordBase Net (30%)', res480.economicDistribution.nordbaseNetShare, 14.40);

// 4. Invalid Team / Order Rejection Validation
assertEqual(
  '1 Specialist team is invalid for Group Job',
  calculateGroupWorkPrice([{ id: '1', level: 'L2', hours: 4, isGroupLead: true }]).isTeamSizeValid,
  false
);

assertEqual(
  'Group Job below €100 work value is invalid',
  calculateGroupWorkPrice([
    { id: '1', level: 'L1', hours: 2, isGroupLead: true },
    { id: '2', level: 'L1', hours: 2, isGroupLead: false }
  ]).isWorkValueValid, // 2x2x20 = €80 < €100
  false
);

assertEqual(
  '0 Group Leads is invalid',
  calculateGroupWorkPrice([
    { id: '1', level: 'L2', hours: 4, isGroupLead: false },
    { id: '2', level: 'L2', hours: 4, isGroupLead: false }
  ]).isGroupLeadValid,
  false
);

assertEqual(
  'Hours < 2 is invalid',
  calculateGroupWorkPrice([
    { id: '1', level: 'L2', hours: 1, isGroupLead: true },
    { id: '2', level: 'L2', hours: 4, isGroupLead: false }
  ]).areHoursValid,
  false
);

console.log(`\n=== TEST SUMMARY: ${passedTests}/${totalTests} PASSED ===`);
