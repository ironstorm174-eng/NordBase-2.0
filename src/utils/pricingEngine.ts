/**
 * NordBase Centralized Pricing Engine
 * Unified calculation logic for Customer, TP, RP, SuperAdmin, and Specialist/Driver workflows.
 */

import {
  TerritoryPricingConfig,
  VehicleTypeInfo,
  CategorySpecialistRate,
  PricingExtraItem,
  DriverCalculationInput,
  DriverCalculationResult,
  ServiceCategory,
  QualificationLevel,
  PricingCalculationType
} from '../types';

export const DEFAULT_VEHICLE_TYPES: VehicleTypeInfo[] = [
  { id: 'car', name: 'Standard Car (Легковая)', category: 'passenger', coefficient: 1.00, baseKmRateCents: 100, baseHourRateCents: 1200, operatingCostPerKmCents: 35 },
  { id: 'passenger_car', name: 'Passenger Sedan (Комфорт Седан)', category: 'passenger', coefficient: 1.10, baseKmRateCents: 110, baseHourRateCents: 1400, operatingCostPerKmCents: 40 },
  { id: 'taxi_transfer', name: 'Taxi / Transfer (Трансфер)', category: 'passenger', coefficient: 1.20, baseKmRateCents: 120, baseHourRateCents: 1500, operatingCostPerKmCents: 45 },
  { id: 'motorcycle', name: 'Motorcycle / Scooter (Мотоцикл)', category: 'special', coefficient: 0.80, baseKmRateCents: 80, baseHourRateCents: 1000, operatingCostPerKmCents: 20 },
  { id: 'van', name: 'Standard Cargo Van (Фургон Вэн)', category: 'cargo', coefficient: 1.25, baseKmRateCents: 125, baseHourRateCents: 1800, operatingCostPerKmCents: 50 },
  { id: 'large_van', name: 'Large Van (Большой Вэн)', category: 'cargo', coefficient: 1.50, baseKmRateCents: 150, baseHourRateCents: 2200, operatingCostPerKmCents: 60 },
  { id: 'small_truck', name: 'Small Truck 3.5t (Малый грузовик)', category: 'cargo', coefficient: 1.80, baseKmRateCents: 180, baseHourRateCents: 2500, operatingCostPerKmCents: 75 },
  { id: 'medium_truck', name: 'Medium Truck 7.5t (Средний грузовик)', category: 'cargo', coefficient: 2.20, baseKmRateCents: 220, baseHourRateCents: 3000, operatingCostPerKmCents: 95 },
  { id: 'large_truck', name: 'Large Truck 12t (Большой грузовик)', category: 'cargo', coefficient: 2.80, baseKmRateCents: 280, baseHourRateCents: 3800, operatingCostPerKmCents: 130 },
  { id: 'lorry', name: 'Lorry / Heavy Freight (Тягач)', category: 'cargo', coefficient: 3.50, baseKmRateCents: 350, baseHourRateCents: 4800, operatingCostPerKmCents: 180 },
  { id: 'articulated_truck', name: 'Articulated Truck (Еврофура)', category: 'cargo', coefficient: 4.00, baseKmRateCents: 400, baseHourRateCents: 5500, operatingCostPerKmCents: 220 },
  { id: 'minibus', name: 'Minibus 8-16 seats (Микроавтобус)', category: 'passenger', coefficient: 1.50, baseKmRateCents: 150, baseHourRateCents: 2200, operatingCostPerKmCents: 55 },
  { id: 'bus', name: 'Full Bus 50 seats (Автобус)', category: 'passenger', coefficient: 2.50, baseKmRateCents: 250, baseHourRateCents: 3500, operatingCostPerKmCents: 110 },
  { id: 'other', name: 'Special Vehicle (Спецтранспорт)', category: 'special', coefficient: 1.00, baseKmRateCents: 100, baseHourRateCents: 1500, operatingCostPerKmCents: 50 },
];

export const DEFAULT_CATEGORY_RATES: CategorySpecialistRate[] = [
  { category: 'Home Services', standardRateCents: 2000, proRateCents: 2500, expertRateCents: 3000 },
  { category: 'Cleaning', standardRateCents: 1500, proRateCents: 2000, expertRateCents: 2500 },
  { category: 'Gardening', standardRateCents: 1800, proRateCents: 2200, expertRateCents: 2800 },
  { category: 'Moving', standardRateCents: 2000, proRateCents: 2500, expertRateCents: 3200 },
  { category: 'Transport', standardRateCents: 2000, proRateCents: 2500, expertRateCents: 3000 },
  { category: 'Repairs', standardRateCents: 2200, proRateCents: 2800, expertRateCents: 3500 },
  { category: 'Construction', standardRateCents: 2200, proRateCents: 2800, expertRateCents: 3800 },
  { category: 'Pools', standardRateCents: 2500, proRateCents: 3000, expertRateCents: 4000 },
  { category: 'Hospitality', standardRateCents: 1800, proRateCents: 2200, expertRateCents: 2800 },
  { category: 'Care', standardRateCents: 1600, proRateCents: 2000, expertRateCents: 2500 },
  { category: 'Lessons', standardRateCents: 2000, proRateCents: 2500, expertRateCents: 3500 },
  { category: 'Business', standardRateCents: 2500, proRateCents: 3500, expertRateCents: 5000 },
];

export const DEFAULT_EXTRAS: PricingExtraItem[] = [
  { id: 'extra-stairs', name: 'Stairs Carrying (Подъем по лестнице)', description: 'Per floor without elevator', calculationType: 'per_floor', valueCents: 500, active: true, territoryScope: 'global', categoryScope: 'ALL' },
  { id: 'extra-heavy', name: 'Heavy Item Handling (Тяжелый груз >50kg)', description: 'Safes, pianos, oversized equipment', calculationType: 'fixed', valueCents: 2500, active: true, territoryScope: 'global', categoryScope: 'ALL' },
  { id: 'extra-special', name: 'Fragile / Special Packaging (Хрупкое)', description: 'Protective wrap and secure straps', calculationType: 'fixed', valueCents: 1500, active: true, territoryScope: 'global', categoryScope: 'ALL' },
  { id: 'extra-waiting', name: 'Extra Waiting Time (Простой)', description: 'Per hour beyond 15 mins free waiting', calculationType: 'per_hour', valueCents: 1500, active: true, territoryScope: 'global', categoryScope: 'ALL' },
];

export const DEFAULT_PORTUGAL_PRICING_CONFIG: TerritoryPricingConfig = {
  id: 'cfg-pt-global',
  scope: 'global',
  territoryName: 'Portugal (Baseline)',
  minimumBooking: {
    minimumBillableHours: 2,
    minimumLaborCostCents: 5000 // €50.00
  },
  longJobTier: {
    minHours: 4,
    discountPercentage: 10,
    hourlyRateMultiplier: 0.90
  },
  categoryRates: DEFAULT_CATEGORY_RATES,
  vehicleTypes: DEFAULT_VEHICLE_TYPES,
  extras: DEFAULT_EXTRAS,
  updatedAt: new Date().toISOString(),
  updatedBy: 'System Baseline'
};

/**
 * Calculates lead fee based on total order value in Euro
 */
export function calculateNordBaseLeadFeeEuro(orderValueEuro: number): { leadFeeEuro: number; formulaText: string } {
  if (!orderValueEuro || orderValueEuro <= 0) {
    return { leadFeeEuro: 0, formulaText: '0%' };
  }
  const value = Math.max(50, Math.round(orderValueEuro));
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
  return { leadFeeEuro: fee, formulaText };
}

/**
 * Core Driver / Transport Calculation Engine
 */
export function calculateDriverTransportPrice(
  input: DriverCalculationInput,
  config: TerritoryPricingConfig = DEFAULT_PORTUGAL_PRICING_CONFIG
): DriverCalculationResult {
  const vehicleList = config.vehicleTypes && config.vehicleTypes.length > 0 ? config.vehicleTypes : DEFAULT_VEHICLE_TYPES;
  const vehicle = vehicleList.find(v => v.id === input.vehicleTypeId) || vehicleList[0];
  
  // 1. Billable Distance Calculation
  const pickupKm = Math.max(0, Number(input.pickupDistanceKm) || 0);
  const loadedKm = Math.max(0, Number(input.loadedDistanceKm) || 0);
  const rawReturnKm = Math.max(0, Number(input.returnDistanceKm) || 0);
  
  let applicableReturnKm = rawReturnKm;
  if (input.returnPolicy === 'half_return') {
    applicableReturnKm = rawReturnKm * 0.5;
  } else if (input.returnPolicy === 'no_return') {
    applicableReturnKm = 0;
  }
  
  const billableDistanceKm = pickupKm + loadedKm + applicableReturnKm;
  
  // Base rates × vehicle coefficient
  const kmRateEuro = (vehicle.baseKmRateCents / 100) * vehicle.coefficient;
  const distanceCostEuro = Math.round(billableDistanceKm * kmRateEuro * 100) / 100;
  
  // 2. Time Calculation
  const drivingHours = Math.max(0, Number(input.drivingTimeHours) || 0);
  const loadingHours = Math.max(0, Number(input.loadingTimeHours) || 0);
  const unloadingHours = Math.max(0, Number(input.unloadingTimeHours) || 0);
  const waitingHours = Math.max(0, Number(input.waitingTimeHours) || 0);
  
  const totalHours = drivingHours + loadingHours + unloadingHours + waitingHours;
  const hourRateEuro = (vehicle.baseHourRateCents / 100) * vehicle.coefficient;
  const timeCostEuro = Math.round(totalHours * hourRateEuro * 100) / 100;
  
  // 3. Helpers / Workers Calculation
  const helpersCount = Math.max(0, Number(input.helpersCount) || 0);
  let helperRateEuro = 20; // Default Amateur
  if (input.helperLevel === 'professional' || input.helperLevel === 'pro' as any) helperRateEuro = 25;
  if (input.helperLevel === 'expert') helperRateEuro = 30;
  
  // Minimum billable hours for helpers is 2 hours if any helper is hired
  const helperHours = helpersCount > 0 ? Math.max(config.minimumBooking?.minimumBillableHours || 2, totalHours) : 0;
  const helpersCostEuro = Math.round(helpersCount * helperHours * helperRateEuro * 100) / 100;
  
  // 4. Extras & Tolls
  const stairsFlights = Math.max(0, Number(input.stairsFlights) || 0);
  const heavyItemsCount = Math.max(0, Number(input.heavyItemsCount) || 0);
  const tollsCostEuro = Math.max(0, Number(input.tollsCostEuro) || 0);
  
  let extrasCostEuro = 0;
  if (stairsFlights > 0) extrasCostEuro += stairsFlights * 5; // €5 / floor
  if (heavyItemsCount > 0) extrasCostEuro += heavyItemsCount * 25; // €25 / heavy item
  
  // Custom active extras
  if (input.selectedExtraIds && input.selectedExtraIds.length > 0 && config.extras) {
    input.selectedExtraIds.forEach(id => {
      const extra = config.extras.find(e => e.id === id);
      if (extra && extra.active) {
        extrasCostEuro += extra.valueCents / 100;
      }
    });
  }
  extrasCostEuro = Math.round(extrasCostEuro * 100) / 100;
  
  // 5. Total Customer Recommended Price
  const rawTotalPrice = distanceCostEuro + timeCostEuro + helpersCostEuro + extrasCostEuro + tollsCostEuro;
  
  let totalCustomerPriceEuro = 0;
  if (rawTotalPrice > 0) {
    // Apply minimum order pricing if transport or labor is actually requested
    const minOrderEuro = (config.minimumBooking?.minimumLaborCostCents || 5000) / 100;
    totalCustomerPriceEuro = Math.max(minOrderEuro, Math.round(rawTotalPrice * 100) / 100);
  }
  
  // 6. Economics for Driver
  const operatingCostEuro = Math.round(billableDistanceKm * (vehicle.operatingCostPerKmCents / 100) * 100) / 100;
  const leadFeeInfo = calculateNordBaseLeadFeeEuro(totalCustomerPriceEuro);
  const nordbaseLeadFeeEuro = leadFeeInfo.leadFeeEuro;
  
  const expectedGrossEarningsEuro = totalCustomerPriceEuro;
  const estimatedNetEarningsEuro = totalCustomerPriceEuro > 0
    ? Math.max(0, Math.round((expectedGrossEarningsEuro - operatingCostEuro - nordbaseLeadFeeEuro - helpersCostEuro) * 100) / 100)
    : 0;
  
  const calcType: PricingCalculationType = helpersCount > 0 ? 'TRANSPORT_GROUP' : 'TRANSPORT';
  
  const breakdownTexts: string[] = [
    `Vehicle: ${vehicle.name} (Coeff ${vehicle.coefficient.toFixed(2)})`,
    billableDistanceKm > 0 ? `Distance (${billableDistanceKm.toFixed(1)} km billable @ €${kmRateEuro.toFixed(2)}/km) = €${distanceCostEuro.toFixed(2)}` : 'Distance: 0.0 km = €0.00',
    totalHours > 0 ? `Time (${totalHours.toFixed(1)} hrs @ €${hourRateEuro.toFixed(2)}/hr) = €${timeCostEuro.toFixed(2)}` : 'Time: 0.0 hrs = €0.00',
    helpersCount > 0 ? `Helpers (${helpersCount} × ${helperHours}h @ €${helperRateEuro}/h) = €${helpersCostEuro.toFixed(2)}` : 'Driver only',
    extrasCostEuro > 0 ? `Extras & Special Handling = €${extrasCostEuro.toFixed(2)}` : '',
    tollsCostEuro > 0 ? `Tolls & Road Fees = €${tollsCostEuro.toFixed(2)}` : '',
    totalCustomerPriceEuro > 0 ? `NordBase Lead Fee: €${nordbaseLeadFeeEuro.toFixed(2)} (${leadFeeInfo.formulaText})` : '',
    operatingCostEuro > 0 ? `Operating Expenses (Fuel/Maint): €${operatingCostEuro.toFixed(2)}` : ''
  ].filter(Boolean);

  return {
    calculationType: calcType,
    vehicleType: vehicle,
    billableDistanceKm,
    pickupDistanceKm: pickupKm,
    loadedDistanceKm: loadedKm,
    returnDistanceKm: rawReturnKm,
    distanceCostEuro,
    totalHours,
    drivingTimeHours: drivingHours,
    loadingTimeHours: loadingHours,
    unloadingTimeHours: unloadingHours,
    waitingTimeHours: waitingHours,
    timeCostEuro,
    helpersCount,
    helpersCostEuro,
    extrasCostEuro,
    tollsCostEuro,
    totalCustomerPriceEuro,
    estimatedOperatingCostEuro: operatingCostEuro,
    nordbaseLeadFeeEuro,
    expectedGrossEarningsEuro,
    estimatedNetEarningsEuro,
    breakdownTexts
  };
}
