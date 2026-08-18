import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { 
  Building2, 
  Users, 
  Clock, 
  Euro, 
  MapPin, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Search,
  Filter,
  Layers,
  Briefcase,
  AlertCircle,
  Sunrise,
  Sunset
} from 'lucide-react';
import { PORTUGAL_GEO } from '../lib/geo';

interface TerritorialHubsManagerProps {
  currentRegion?: string;
  isSuperAdmin?: boolean;
}

export const TerritorialHubsManager: React.FC<TerritorialHubsManagerProps> = ({
  currentRegion,
  isSuperAdmin = false,
}) => {
  const [storeState, setStoreState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe((newState) => {
      setStoreState(newState);
    });
  }, []);

  const hubs = storeState.hubs || [];
  const jobs = storeState.jobs || [];
  const specialists = storeState.specialists || [];
  const users = storeState.users || [];

  // Determine effective region name
  const effectiveRegion = currentRegion && currentRegion !== 'All' ? currentRegion : 'Algarve';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>(
    isSuperAdmin ? 'All' : effectiveRegion
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for New Hub
  const [newHubName, setNewHubName] = useState('');
  const [newHubCity, setNewHubCity] = useState('');
  const [newHubRegion, setNewHubRegion] = useState(effectiveRegion);
  const [newHubDistricts, setNewHubDistricts] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep newHubRegion in sync when modal opens
  useEffect(() => {
    if (showCreateModal && !isSuperAdmin && currentRegion) {
      setNewHubRegion(currentRegion);
    }
  }, [showCreateModal, isSuperAdmin, currentRegion]);

  const getRdCodeForRegion = (regionName: string) => {
    const regLower = regionName.toLowerCase();
    if (regLower.includes('lisboa city')) return 'Pt-RD-002';
    if (regLower.includes('porto')) return 'Pt-RD-003';
    if (regLower.includes('algarve')) return 'Pt-RD-004';
    if (regLower.includes('lisboa')) return 'Pt-RD-001';
    
    const matched = PORTUGAL_GEO.find(g => g.name.toLowerCase() === regLower);
    return matched ? matched.code : 'Pt-RD-004';
  };
  // Filter hubs by region & search term
  const filteredHubs = hubs.filter((hub) => {
    const matchesRegion =
      selectedRegionFilter === 'All' ||
      hub.region.toLowerCase() === selectedRegionFilter.toLowerCase() ||
      hub.rdCode.toLowerCase() === selectedRegionFilter.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.hubCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.seats.some((s) => s.seatId.toLowerCase().includes(searchTerm.toLowerCase()) || (s.operatorName && s.operatorName.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesRegion && matchesSearch;
  });
  // Calculate high-level hub statistics
  const totalHubsCount = filteredHubs.length;
  const totalSeatsCount = totalHubsCount * 4;
  
  let occupiedSeatsCount = 0;
  let totalHubsRevenue = 0;
  filteredHubs.forEach((hub) => {
    hub.seats.forEach((seat) => {
      if (seat.operatorId && seat.status === 'active') {
        occupiedSeatsCount++;
      }
      totalHubsRevenue += seat.personalRevenue || 0;
    });
  });
  const handleCreateHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHubName.trim() || !newHubCity.trim()) return;
    setIsSubmitting(true);
    try {
      const districtsArray = newHubDistricts
        ? newHubDistricts.split(',').map((d) => d.trim()).filter(Boolean)
        : [newHubCity.trim()];
      
      const regionToUse = !isSuperAdmin ? effectiveRegion : newHubRegion;
      const rdCode = getRdCodeForRegion(regionToUse);

      store.createTerritorialHub(
        newHubName.trim(),
        regionToUse,
        newHubCity.trim(),
        rdCode,
        districtsArray
      );
      setNewHubName('');
      setNewHubCity('');
      setNewHubDistricts('');
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating territorial hub:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleTakeoverSeat = (dashboardNumber: string) => {
    store.impersonateByDashboardNumber(dashboardNumber);
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ARCHITECTURE CONCEPT EXPLANATION BANNER */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/80 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                Territorial Hub Architecture
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                1 Hub = 4 TP Seats (2 Shifts + 2 Covers)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Territorial Hub Network
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Each physical hub serves a specific district/city with 16h/day coverage (2 shifts of 8h) + 2 relief cover operators. 
              All 4 operators work in a <strong className="text-white">unified information environment</strong> (shared orders and local specialist database), but each operator has their <strong className="text-cyan-400">own personal dashboard and individual revenue tracking</strong>.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="shrink-0 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-2xl shadow-lg shadow-cyan-500/25 flex items-center gap-3 transition-all cursor-pointer border border-cyan-300/30 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>+ Create Hub (4 TP Seats)</span>
          </button>
        </div>
      </div>
      {/* REGIONAL STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase font-bold tracking-wider">Active Hubs</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-display font-black text-white">{totalHubsCount}</div>
          <p className="text-xs text-slate-400 mt-1">Territorial network hubs</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase font-bold tracking-wider">Total TP Seats</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-display font-black text-emerald-400">
            {occupiedSeatsCount} <span className="text-lg font-normal text-slate-500">/ {totalSeatsCount}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{totalSeatsCount - occupiedSeatsCount} seats available for partners</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase font-bold tracking-wider">Shift Coverage</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-display font-black text-blue-400">16 Hours</div>
          <p className="text-xs text-slate-400 mt-1">2 shifts (06-14 / 14-22) + 2 relief</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase font-bold tracking-wider">Hub Network Revenue</span>
            <Euro className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-display font-black text-amber-400">€{totalHubsRevenue.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1">Combined earnings across all 4 seats</p>
        </div>
      </div>
      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by hub name, code, city, or TP operator..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white text-sm placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>
        {isSuperAdmin && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-4 py-3 focus:border-cyan-400 focus:outline-none"
            >
              <option value="All">All Regions (Portugal)</option>
              <option value="Big Lisboa">Big Lisboa (Pt-RD-001)</option>
              <option value="Lisboa City">Lisboa City (Pt-RD-002)</option>
              <option value="Porto">Porto Network (Pt-RD-003)</option>
              <option value="Algarve">Algarve (Pt-RD-004)</option>
            </select>
          </div>
        )}
      </div>
      {/* HUBS LIST GRID */}
      {filteredHubs.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Territorial Hubs Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            No hubs found matching current filters. Click "+ Create Hub" to provision a new territorial hub with 4 operator seats.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredHubs.map((hub) => {
            // Find shared jobs for this hub's territory
            const hubJobs = jobs.filter((j) => {
              const c = (j.city || '').toLowerCase();
              return c.includes(hub.city.toLowerCase()) || hub.assignedDistricts.some((d) => c.includes(d.toLowerCase()));
            });
            // Find shared specialists for this hub's territory
            const hubSpecs = specialists.filter((s) => {
              const c = (s.city || '').toLowerCase();
              return c.includes(hub.city.toLowerCase()) || hub.assignedDistricts.some((d) => c.includes(d.toLowerCase()));
            });
            const totalHubRev = hub.seats.reduce((acc, s) => acc + (s.personalRevenue || 0), 0);
            return (
              <div
                key={hub.id}
                className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl hover:border-slate-700 transition-all space-y-6"
              >
                {/* HUB HEADER BAR */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/5 pb-6">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800/40 rounded-lg text-xs font-mono font-bold uppercase">
                        {hub.hubCode}
                      </span>
                      <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium">
                        {hub.rdCode} • {hub.region}
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-black text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                      {hub.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex flex-wrap items-center gap-1">
                      <span>Assigned Districts:</span>
                      <strong className="text-slate-200">{hub.assignedDistricts.join(', ')}</strong>
                    </p>
                  </div>
                  {/* SHARED HUB ENVIRONMENT BADGES */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
                      <div className="text-xs text-slate-400 font-mono">Shared Orders</div>
                      <div className="text-lg font-black text-white flex items-center justify-center gap-1">
                        <Briefcase className="w-4 h-4 text-cyan-400" />
                        {hubJobs.length}
                      </div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
                      <div className="text-xs text-slate-400 font-mono">Hub Pros</div>
                      <div className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1">
                        <Users className="w-4 h-4 text-emerald-400" />
                        {hubSpecs.length}
                      </div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
                      <div className="text-xs text-slate-400 font-mono">Hub Revenue</div>
                      <div className="text-lg font-black text-amber-400">€{totalHubRev.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                {/* 4 OPERATOR SEATS GRID */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-mono uppercase font-extrabold text-slate-300 tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      Hub Operator Seats (4 TP Dashboards):
                    </h4>
                    <span className="text-xs text-slate-400">Shared Database • Isolated Earnings</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {hub.seats.map((seat) => {
                      const isVacant = !seat.operatorId || seat.status === 'vacant';
                      return (
                        <div
                          key={seat.seatId}
                          className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 transition-all ${
                            isVacant
                              ? 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                              : 'bg-slate-950 border-blue-900/40 hover:border-cyan-500/50 text-white shadow-lg'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-1 bg-blue-950 text-cyan-300 border border-cyan-500/20 rounded font-mono text-xs font-bold">
                                {seat.seatId}
                              </span>
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  isVacant ? 'bg-slate-600' : 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                                }`}
                                title={isVacant ? 'Vacant' : 'Online'}
                              ></span>
                            </div>
                            <div className="text-xs font-medium flex items-center gap-1.5 pt-1">
                              {seat.shiftName.toLowerCase().includes('sunrise') || seat.shiftName.includes('06:00') ? (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-md font-bold">
                                  <Sunrise className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span>{seat.shiftName}</span>
                                </span>
                              ) : seat.shiftName.toLowerCase().includes('sunset') || seat.shiftName.includes('14:00') ? (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-md font-bold">
                                  <Sunset className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                  <span>{seat.shiftName}</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                  <span>{seat.shiftName}</span>
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="text-base font-bold text-white truncate">
                                {seat.operatorName || 'Vacant TP Seat'}
                              </div>
                              {seat.operatorEmail && (
                                <div className="text-xs text-slate-400 truncate">{seat.operatorEmail}</div>
                              )}
                            </div>
                          </div>
                          <div className="pt-3 border-t border-slate-800/80 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Seat Revenue:</span>
                              <span className="font-mono font-black text-amber-400 text-sm">
                                €{seat.personalRevenue || 0}
                              </span>
                            </div>
                            <button
                              onClick={() => handleTakeoverSeat(seat.seatId)}
                              className="w-full py-2.5 bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 border border-blue-400/30"
                              title={`Takeover operator dashboard ${seat.seatId}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Manage Dashboard ({seat.seatCode})</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* CREATE TERRITORIAL HUB MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                New Territorial Hub
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When creating a new hub, the system will <strong className="text-cyan-400">automatically provision 4 operator TP seats</strong> (2 active shifts + 2 relief covers) with a unified regional order pool & specialist database.
            </p>
            <form onSubmit={handleCreateHub} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-slate-400 mb-1.5">
                  Hub Name
                </label>
                <input
                  type="text"
                  required
                  value={newHubName}
                  onChange={(e) => setNewHubName(e.target.value)}
                  placeholder="e.g. Cascais & Sintra Central Hub"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-slate-400 mb-1.5">
                  Hub City / Location
                </label>
                <input
                  type="text"
                  required
                  value={newHubCity}
                  onChange={(e) => setNewHubCity(e.target.value)}
                  placeholder="e.g. Cascais"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-slate-400 mb-1.5">
                  Region (RD Jurisdiction)
                </label>
                {isSuperAdmin ? (
                  <select
                    value={newHubRegion}
                    onChange={(e) => setNewHubRegion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Big Lisboa">Big Lisboa (Pt-RD-001)</option>
                    <option value="Lisboa City">Lisboa City (Pt-RD-002)</option>
                    <option value="Porto">Porto Network (Pt-RD-003)</option>
                    <option value="Algarve">Algarve (Pt-RD-004)</option>
                  </select>
                ) : (
                  <div className="w-full bg-slate-950/90 border border-cyan-500/30 rounded-xl px-4 py-3 text-cyan-300 text-sm font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{effectiveRegion} ({getRdCodeForRegion(effectiveRegion)})</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-bold">
                      Your Region (Fixed)
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-slate-400 mb-1.5">
                  Assigned Districts (comma separated)
                </label>
                <input
                  type="text"
                  value={newHubDistricts}
                  onChange={(e) => setNewHubDistricts(e.target.value)}
                  placeholder="Cascais, Sintra, Oeiras, Amadora"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                  {isSubmitting ? 'Creating...' : 'Create Hub (4 TP Seats)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default TerritorialHubsManager;