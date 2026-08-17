import React, { useState } from 'react';
import { AuthUser, SubscriptionPlan } from '../types';
import { Check, Star, Shield, Zap } from 'lucide-react';

interface MarketplaceSubscriptionProps {
  currentUser: AuthUser;
  onActivate: (plan: SubscriptionPlan) => void;
}

export default function MarketplaceSubscription({ currentUser, onActivate }: MarketplaceSubscriptionProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>('1_month_free');
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    { id: '1_month_free', name: '1 Month Trial', price: '€0', duration: 'First month', highlight: true },
    { id: '1_month', name: '1 Month', price: '€10', duration: 'per month' },
    { id: '3_months', name: '3 Months', price: '€25', duration: 'quarterly', savings: 'Save €5' },
    { id: '6_months', name: '6 Months', price: '€45', duration: 'biannually', savings: 'Save €15' },
    { id: '12_months', name: '12 Months', price: '€80', duration: 'annually', savings: 'Save €40' }
  ];

  const handleActivate = () => {
    if (selectedPlan === '1_month_free') {
      setIsProcessing(true);
      setTimeout(() => {
        onActivate('1_month_free');
      }, 1500);
    } else {
      setShowPayment(true);
    }
  };

  const handleMBWayPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onActivate(selectedPlan as SubscriptionPlan);
    }, 2000);
  };

  if (showPayment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-100 p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Complete Payment</h2>
          <p className="text-slate-400 text-lg">
            You selected the {plans.find(p => p.id === selectedPlan)?.name} plan for {plans.find(p => p.id === selectedPlan)?.price}.
          </p>
          
          <div className="pt-6">
            <button
              onClick={handleMBWayPayment}
              disabled={isProcessing}
              className="w-full bg-[#00A859] hover:bg-[#00924E] text-white font-bold py-4 rounded-xl text-lg transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isProcessing ? 'Processing Payment...' : 'Pay with MB Way'}
            </button>
          </div>
          <button onClick={() => setShowPayment(false)} className="text-slate-500 hover:text-slate-300 mt-4 underline text-sm transition-colors">
            Go back to plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-3xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-semibold border border-cyan-500/20 mb-4">
            <Star className="w-4 h-4" /> Welcome to NordBase Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Activate Your Profile</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Congratulations on completing your profile! As a special welcome gift, enjoy your first month completely <strong className="text-cyan-400">free</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map(plan => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as SubscriptionPlan)}
              className={`relative cursor-pointer transition-all duration-300 rounded-3xl p-6 border-2 ${
                selectedPlan === plan.id 
                  ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]' 
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50'
              } ${plan.highlight ? 'md:col-span-2 bg-gradient-to-br from-cyan-950/40 to-slate-900' : ''}`}
            >
              {plan.highlight && selectedPlan !== plan.id && (
                <div className="absolute -top-3 -right-3 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Recommended
                </div>
              )}
              {selectedPlan === plan.id && (
                <div className="absolute top-4 right-4 text-cyan-400">
                  <Check className="w-6 h-6" />
                </div>
              )}
              
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className={`text-2xl font-bold ${plan.highlight ? 'text-cyan-300' : 'text-slate-200'}`}>{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-slate-500 font-medium">{plan.duration}</span>
                  </div>
                  {plan.savings && (
                    <div className="mt-2 text-sm font-semibold text-emerald-400 bg-emerald-400/10 inline-block px-2 py-1 rounded">
                      {plan.savings}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm text-slate-400 flex gap-4 items-start">
          <Shield className="w-6 h-6 text-slate-500 shrink-0 mt-0.5" />
          <p>
            By subscribing, your profile will be publicly visible to clients in the marketplace. You will receive direct booking requests for your personalized services. Your subscription automatically renews, and you can cancel anytime.
          </p>
        </div>

        <div className="text-center pb-12">
          <button
            onClick={handleActivate}
            disabled={!selectedPlan || isProcessing}
            className="w-full sm:w-auto min-w-[280px] bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg px-8 py-5 rounded-2xl transition-all shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.6)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isProcessing ? 'Processing...' : (selectedPlan === '1_month_free' ? 'Start Free Trial' : 'Continue to Payment')}
          </button>
        </div>
      </div>
    </div>
  );
}
