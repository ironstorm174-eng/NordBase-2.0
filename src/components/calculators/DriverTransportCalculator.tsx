import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Navigation, Clock, Users, ShieldAlert, Euro, Info, Check, HelpCircle, ArrowRight } from 'lucide-react';
import { calculateDriverTransportPrice, DEFAULT_PORTUGAL_PRICING_CONFIG } from '../../utils/pricingEngine';
import { VehicleTypeId, QualificationLevel, TerritoryPricingConfig } from '../../types';

interface Props {
  pricingConfig?: TerritoryPricingConfig;
  onApplyEstimate?: (amount: number) => void;
  isCompact?: boolean;
}

export default function DriverTransportCalculator({ pricingConfig = DEFAULT_PORTUGAL_PRICING_CONFIG, onApplyEstimate, isCompact = false }: Props) {
  const { t } = useTranslation();

  // Input states - Defaults to 0 and Standard Car ('car') on start
  const [vehicleTypeId, setVehicleTypeId] = useState<VehicleTypeId>('car');
  
  const [pickupDistanceKm, setPickupDistanceKm] = useState<number>(0);
  const [loadedDistanceKm, setLoadedDistanceKm] = useState<number>(0);
  const [returnDistanceKm, setReturnDistanceKm] = useState<number>(0);
  const [returnPolicy, setReturnPolicy] = useState<'full_return' | 'half_return' | 'no_return'>('full_return');

  const [drivingTimeHours, setDrivingTimeHours] = useState<number>(0);
  const [loadingTimeHours, setLoadingTimeHours] = useState<number>(0);
  const [unloadingTimeHours, setUnloadingTimeHours] = useState<number>(0);
  const [waitingTimeHours, setWaitingTimeHours] = useState<number>(0);

  const [helpersCount, setHelpersCount] = useState<number>(0);
  const [helperLevel, setHelperLevel] = useState<QualificationLevel>('amateur');

  const [stairsFlights, setStairsFlights] = useState<number>(0);
  const [heavyItemsCount, setHeavyItemsCount] = useState<number>(0);
  const [tollsCostEuro, setTollsCostEuro] = useState<number>(0);

  // Calculation memo
  const result = useMemo(() => {
    return calculateDriverTransportPrice(
      {
        vehicleTypeId,
        pickupDistanceKm,
        loadedDistanceKm,
        returnDistanceKm,
        returnPolicy,
        drivingTimeHours,
        loadingTimeHours,
        unloadingTimeHours,
        waitingTimeHours,
        helpersCount,
        helperLevel,
        stairsFlights,
        heavyItemsCount,
        tollsCostEuro
      },
      pricingConfig
    );
  }, [
    vehicleTypeId,
    pickupDistanceKm,
    loadedDistanceKm,
    returnDistanceKm,
    returnPolicy,
    drivingTimeHours,
    loadingTimeHours,
    unloadingTimeHours,
    waitingTimeHours,
    helpersCount,
    helperLevel,
    stairsFlights,
    heavyItemsCount,
    tollsCostEuro,
    pricingConfig
  ]);

  const vehicleList = pricingConfig?.vehicleTypes || DEFAULT_PORTUGAL_PRICING_CONFIG.vehicleTypes;

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl ${isCompact ? '' : 'w-full'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {t('calc.driverTransportTitle', 'Driver & Transport Calculator')}
                <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                  Engine v2.0
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('calc.driverTransportDesc', 'Calculate exact transport, logistics, distance & helper rates for NordBase orders.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Input Parameters (Left / 7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Vehicle Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>1. {t('calc.vehicleType', 'Vehicle Type')}</span>
              <span className="text-[11px] text-cyan-400 font-normal">
                {t('calc.coeff', 'Coefficient')}: {result.vehicleType.coefficient.toFixed(2)}×
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {vehicleList.map(v => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVehicleTypeId(v.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all duration-150 cursor-pointer ${
                    vehicleTypeId === v.id
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs truncate">{v.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 flex justify-between">
                    <span>€{(v.baseKmRateCents / 100).toFixed(2)}/km</span>
                    <span className="text-cyan-400/80 font-mono">{(v.coefficient).toFixed(2)}x</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Distance Parameters */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. {t('calc.distanceParams', 'Distance Parameters (KM)')}</span>
              </label>
              <span className="text-xs font-bold text-cyan-300 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                {result.billableDistanceKm.toFixed(1)} km billable
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">{t('calc.pickupDist', 'To Pickup (km)')}</span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  placeholder="0"
                  value={pickupDistanceKm === 0 ? '' : pickupDistanceKm}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setPickupDistanceKm(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">{t('calc.loadedDist', 'Loaded Cargo (km)')}</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="0"
                  value={loadedDistanceKm === 0 ? '' : loadedDistanceKm}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setLoadedDistanceKm(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">{t('calc.returnDist', 'Return Trip (km)')}</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="0"
                  value={returnDistanceKm === 0 ? '' : returnDistanceKm}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setReturnDistanceKm(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1.5">{t('calc.returnPolicy', 'Return Policy')}</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'full_return', label: '100% Return' },
                  { id: 'half_return', label: '50% Return' },
                  { id: 'no_return', label: '0% (Backhaul)' }
                ].map(pol => (
                  <button
                    key={pol.id}
                    type="button"
                    onClick={() => setReturnPolicy(pol.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      returnPolicy === pol.id
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {pol.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Time Parameters */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>3. {t('calc.timeParams', 'Time Allocation (Hours)')}</span>
              </label>
              <span className="text-xs font-bold text-cyan-300 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                {result.totalHours.toFixed(1)} hrs total
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Driving (h)</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="0"
                  value={drivingTimeHours === 0 ? '' : drivingTimeHours}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setDrivingTimeHours(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Loading (h)</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="0"
                  value={loadingTimeHours === 0 ? '' : loadingTimeHours}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setLoadingTimeHours(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Unloading (h)</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="0"
                  value={unloadingTimeHours === 0 ? '' : unloadingTimeHours}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setUnloadingTimeHours(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Waiting (h)</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="0"
                  value={waitingTimeHours === 0 ? '' : waitingTimeHours}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setWaitingTimeHours(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Helpers & Extra Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Helpers */}
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>4. {t('calc.helpersTitle', 'Helpers / Workers')}</span>
              </label>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Count</span>
                  <select
                    value={helpersCount}
                    onChange={e => setHelpersCount(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value={0}>0 (Driver only)</option>
                    <option value={1}>1 Helper (+1)</option>
                    <option value={2}>2 Helpers (+2)</option>
                    <option value={3}>3 Helpers (+3)</option>
                    <option value={4}>4 Helpers (+4)</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Skill Level</span>
                  <select
                    value={helperLevel}
                    onChange={e => setHelperLevel(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="amateur">Standard (€20/h)</option>
                    <option value="professional">Pro (€25/h)</option>
                    <option value="expert">Expert (€30/h)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Extras */}
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>5. {t('calc.extrasTitle', 'Stairs, Tolls & Extras')}</span>
              </label>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Stairs (floors)</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={stairsFlights === 0 ? '' : stairsFlights}
                    onChange={e => {
                      const val = parseInt(e.target.value, 10);
                      setStairsFlights(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Heavy Items</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={heavyItemsCount === 0 ? '' : heavyItemsCount}
                    onChange={e => {
                      const val = parseInt(e.target.value, 10);
                      setHeavyItemsCount(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Tolls (€)</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={tollsCostEuro === 0 ? '' : tollsCostEuro}
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      setTollsCostEuro(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Summary Panel (Right / 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>{t('calc.financialEstimate', 'Financial Estimate')}</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                {result.calculationType}
              </span>
            </h4>

            {/* Main Net Earnings Highlight */}
            <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 p-4 rounded-2xl border border-emerald-500/30 text-center space-y-1 mb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                {t('calc.estimatedNetEarnings', 'Driver Estimated Net Profit')}
              </span>
              <div className="text-3xl font-black text-white font-display">
                €{result.estimatedNetEarningsEuro.toFixed(2)}
              </div>
              <p className="text-[11px] text-emerald-300/80">
                {t('calc.afterExpenses', 'Clean profit after fuel/maintenance & lead fee')}
              </p>
            </div>

            {/* Financial Breakdown Table */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">{t('calc.customerRecommendedPrice', 'Customer Price (Gross)')}</span>
                <span className="font-bold text-white font-mono text-sm">€{result.totalCustomerPriceEuro.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">{t('calc.operatingExpenses', 'Operating Cost (Fuel/Maint)')}</span>
                <span className="font-mono text-amber-400">-€{result.estimatedOperatingCostEuro.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">{t('calc.leadFee', 'NordBase Lead Fee')}</span>
                <span className="font-mono text-purple-400">-€{result.nordbaseLeadFeeEuro.toFixed(2)}</span>
              </div>

              {result.helpersCostEuro > 0 && (
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">{t('calc.helpersPayout', 'Helpers Payout')}</span>
                  <span className="font-mono text-blue-400">€{result.helpersCostEuro.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Line items text breakdown */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t('calc.stepByStepBreakdown', 'Step-by-step breakdown')}
              </span>
              {result.breakdownTexts.map((text, idx) => (
                <div key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5 font-mono">
                  <span className="text-cyan-500">•</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {onApplyEstimate && (
            <button
              type="button"
              onClick={() => onApplyEstimate(result.totalCustomerPriceEuro)}
              className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black py-3 px-4 rounded-xl text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/50"
            >
              <span>{t('calc.applyToOrder', 'Apply Estimate (€' + result.totalCustomerPriceEuro.toFixed(2) + ')')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
