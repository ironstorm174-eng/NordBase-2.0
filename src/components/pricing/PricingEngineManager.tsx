import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sliders,
  CheckCircle,
  XCircle,
  Clock,
  Euro,
  Truck,
  Layers,
  FileText,
  AlertCircle,
  Send,
  History,
  ShieldCheck,
  Building,
  Plus
} from 'lucide-react';
import { store } from '../../store';
import {
  TerritoryPricingConfig,
  PricingProposal,
  PricingAuditLog,
  UserRole,
  AuthUser,
  VehicleTypeInfo
} from '../../types';
import { DEFAULT_PORTUGAL_PRICING_CONFIG } from '../../utils/pricingEngine';

interface Props {
  currentUser: AuthUser | null;
}

export default function PricingEngineManager({ currentUser }: Props) {
  const { t } = useTranslation();
  const state = store.getState();

  const userRole = currentUser?.role || 'operator';
  const isSuperAdmin = userRole === 'super_admin';
  const isRegionalAdmin = userRole === 'regional_admin';
  const isTerritorialPartner = userRole === 'operator';

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'proposals' | 'audit'>('overview');
  
  // Modal / Propose change form
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false);
  const [proposalScope, setProposalScope] = useState<'region' | 'hub'>('region');
  const [territoryName, setTerritoryName] = useState<string>(currentUser?.region || 'Algarve');
  const [changesSummary, setChangesSummary] = useState<string>('');
  const [proposedKmRate, setProposedKmRate] = useState<number>(1.20);
  const [proposedHourRate, setProposedHourRate] = useState<number>(18.00);
  const [proposedMinHours, setProposedMinHours] = useState<number>(2);

  // Re-fetch proposals & config
  const activeConfig: TerritoryPricingConfig = state.pricingConfig || DEFAULT_PORTUGAL_PRICING_CONFIG;
  const proposals: PricingProposal[] = state.pricingProposals || [];
  const auditLogs: PricingAuditLog[] = state.pricingAuditLogs || [];

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changesSummary.trim()) return;

    const newProposal: PricingProposal = {
      id: `prop-${Date.now()}`,
      proposedByUserId: currentUser?.id || 'user-unknown',
      proposedByName: currentUser?.name || 'Partner',
      proposedByRole: userRole,
      territoryScope: proposalScope,
      territoryName: territoryName,
      regionName: currentUser?.region || 'Algarve',
      changesSummary: changesSummary,
      proposedConfig: {
        minimumBooking: {
          minimumBillableHours: proposedMinHours,
          minimumLaborCostCents: Math.round(proposedMinHours * proposedHourRate * 100)
        }
      },
      status: 'PROPOSED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.addPricingProposal(newProposal);
    setShowProposalModal(false);
    setChangesSummary('');
    setActiveTab('proposals');
  };

  const handleReviewProposal = (proposalId: string, status: 'APPROVED' | 'REJECTED') => {
    store.reviewPricingProposal(
      proposalId,
      status,
      currentUser?.name || 'Admin',
      userRole,
      status === 'APPROVED' ? 'Approved by Regional Admin' : 'Rejected by Regional Admin'
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-display font-black text-white flex items-center gap-3">
            <Sliders className="w-6 h-6 text-cyan-400" />
            <span>{t('pricing.managerTitle', 'NordBase Pricing Engine & Governance')}</span>
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            {t('pricing.managerDesc', 'Centralized rule engine for transport coefficients, hourly rates, minimum bookings & regional overrides.')}
          </p>
        </div>

        {/* Action Button: Propose Change */}
        <button
          type="button"
          onClick={() => setShowProposalModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('pricing.proposeChangeBtn', 'Propose Price Adjustment')}</span>
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('pricing.overviewTab', 'Active Baseline Rules')}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
            activeTab === 'proposals'
              ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>{t('pricing.proposalsTab', 'Proposals & Approvals')}</span>
          {proposals.filter(p => p.status === 'PROPOSED').length > 0 && (
            <span className="ml-1.5 bg-purple-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {proposals.filter(p => p.status === 'PROPOSED').length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('pricing.auditTab', 'Audit Trail')}
        </button>
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Baseline summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Territory Scope</span>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>{activeConfig.territoryName}</span>
              </div>
              <p className="text-[11px] text-slate-400">Global Reference Configuration</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Minimum Booking</span>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{activeConfig.minimumBooking.minimumBillableHours} Hours (€{(activeConfig.minimumBooking.minimumLaborCostCents / 100).toFixed(2)} min)</span>
              </div>
              <p className="text-[11px] text-slate-400">Enforced across Standard & Group orders</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Long-Job Discount</span>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <Euro className="w-4 h-4 text-emerald-400" />
                <span>{activeConfig.longJobTier.discountPercentage}% off after {activeConfig.longJobTier.minHours}h</span>
              </div>
              <p className="text-[11px] text-slate-400">Applies to long duration assignments</p>
            </div>
          </div>

          {/* Vehicle Coefficients Table */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Configured Vehicle Coefficients (13 Types)</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Vehicle Type</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Coefficient</th>
                    <th className="p-2.5">Base €/km</th>
                    <th className="p-2.5">Base €/hour</th>
                    <th className="p-2.5">Operating Cost/km</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono">
                  {(activeConfig.vehicleTypes || []).map((v: VehicleTypeInfo) => (
                    <tr key={v.id} className="hover:bg-slate-900/40">
                      <td className="p-2.5 font-sans font-bold text-white">{v.name}</td>
                      <td className="p-2.5 text-slate-400 uppercase text-[10px]">{v.category}</td>
                      <td className="p-2.5 text-cyan-400 font-bold">{v.coefficient.toFixed(2)}×</td>
                      <td className="p-2.5">€{(v.baseKmRateCents / 100).toFixed(2)}</td>
                      <td className="p-2.5">€{(v.baseHourRateCents / 100).toFixed(2)}</td>
                      <td className="p-2.5 text-slate-400">€{(v.operatingCostPerKmCents / 100).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- PROPOSALS TAB --- */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Pricing Proposals Queue
          </h4>

          {proposals.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
              No pending or active pricing proposals. Click "Propose Price Adjustment" to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {proposals.map(p => (
                <div key={p.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{p.changesSummary}</span>
                      <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                        p.status === 'PROPOSED' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        p.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Proposed by <span className="text-slate-200">{p.proposedByName}</span> ({p.proposedByRole}) for <span className="text-cyan-400">{p.territoryName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Actions for RP or SuperAdmin */}
                  {p.status === 'PROPOSED' && (isSuperAdmin || isRegionalAdmin) && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleReviewProposal(p.id, 'APPROVED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReviewProposal(p.id, 'REJECTED')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- AUDIT TAB --- */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Pricing Governance Audit Trail</span>
          </h4>

          {auditLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
              No audit logs recorded yet. Changes approved by admins will automatically create audit trail entries.
            </div>
          ) : (
            <div className="space-y-2">
              {auditLogs.map(log => (
                <div key={log.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs flex justify-between items-center font-mono">
                  <div>
                    <span className="text-white font-bold">{log.who}</span> ({log.role}) updated <span className="text-cyan-400">{log.scope}</span>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">{log.reason}</p>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROPOSAL MODAL */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-cyan-400" />
              <span>Propose Price Adjustment</span>
            </h3>

            <form onSubmit={handleCreateProposal} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target Territory / Hub</label>
                <input
                  type="text"
                  value={territoryName}
                  onChange={e => setTerritoryName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  placeholder="e.g. Portimão Hub, Algarve"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reason / Change Summary</label>
                <textarea
                  rows={3}
                  value={changesSummary}
                  onChange={e => setChangesSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  placeholder="e.g. Increase base transport rate to €1.20/km due to local fuel cost adjustments."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
