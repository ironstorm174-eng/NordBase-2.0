import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  X, 
  ChevronRight, 
  CornerDownLeft, 
  Delete, 
  Clock,
  Landmark,
  Palmtree,
  Anchor,
  Church,
  Compass,
  Sailboat,
  GraduationCap,
  Castle,
  Sun,
  Trees,
  Flower,
  Mountain
} from 'lucide-react';
import { PORTUGAL_GEO, FLATTENED_GEO, } from '../lib/geo';
const REGION_METADATA: Record<string, { icon: any; color: string; bgGlow: string; desc: string; text: string }> = {
  '1': { icon: Landmark, color: 'border-amber-500/30 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.08)]', bgGlow: 'bg-amber-500/10 text-amber-400', desc: 'Capital & Business', text: 'text-amber-400' },
  '2': { icon: Palmtree, color: 'border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.08)]', bgGlow: 'bg-cyan-500/10 text-cyan-400', desc: 'Sunny Coast & Beaches', text: 'text-cyan-400' },
  '3': { icon: Anchor, color: 'border-blue-500/30 hover:border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.08)]', bgGlow: 'bg-blue-500/10 text-blue-400', desc: 'Riverside & Port', text: 'text-blue-400' },
  '4': { icon: Church, color: 'border-emerald-500/30 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.08)]', bgGlow: 'bg-emerald-500/10 text-emerald-400', desc: 'Ancient Heritage', text: 'text-emerald-400' },
  '5': { icon: Compass, color: 'border-teal-500/30 hover:border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.08)]', bgGlow: 'bg-teal-500/10 text-teal-400', desc: 'Scenic Bay & Nature', text: 'text-teal-400' },
  '6': { icon: Sailboat, color: 'border-sky-500/30 hover:border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.08)]', bgGlow: 'bg-sky-500/10 text-sky-400', desc: 'Portuguese Venice', text: 'text-sky-400' },
  '7': { icon: GraduationCap, color: 'border-indigo-500/30 hover:border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.08)]', bgGlow: 'bg-indigo-500/10 text-indigo-400', desc: 'University Hub', text: 'text-indigo-400' },
  '8': { icon: Castle, color: 'border-violet-500/30 hover:border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.08)]', bgGlow: 'bg-violet-500/10 text-violet-400', desc: 'Castles & Forests', text: 'text-violet-400' },
  '9': { icon: Sun, color: 'border-orange-500/30 hover:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.08)]', bgGlow: 'bg-orange-500/10 text-orange-400', desc: 'Golden Plains', text: 'text-orange-400' },
  '10': { icon: Trees, color: 'border-lime-500/30 hover:border-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.08)]', bgGlow: 'bg-lime-500/10 text-lime-400', desc: 'Vibrant Vineyards', text: 'text-lime-400' },
  '11': { icon: Flower, color: 'border-pink-500/30 hover:border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.08)]', bgGlow: 'bg-pink-500/10 text-pink-400', desc: 'Eternal Spring Garden', text: 'text-pink-400' },
  '12': { icon: Mountain, color: 'border-purple-500/30 hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.08)]', bgGlow: 'bg-purple-500/10 text-purple-400', desc: 'Atlantic Volcanic Jewels', text: 'text-purple-400' }
};
interface LocationSelectorProps {
  onSelect: (location: string) => void;
  onClose: () => void;
}
export function LocationSelector({ onSelect, onClose }: LocationSelectorProps) {
  const [mode, setMode] = useState<'keypad' | 'search'>('keypad');
  const [keypadInput, setKeypadInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentLocations, setRecentLocations] = useState<string[]>([]);
  
  // Ref for search input auto-focus
  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Load recent locations
    const stored = localStorage.getItem('nordbase_recent_locations');
    if (stored) {
      try {
        setRecentLocations(JSON.parse(stored));
      } catch (e) {
        /* ignore invalid json */
      }
    }
  }, []);
  useEffect(() => {
    if (mode === 'search' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mode]);
  const handleSelect = (location: string) => {
    // Save to recents
    const newRecents = [location, ...recentLocations.filter(l => l !== location)].slice(0, 3);
    localStorage.setItem('nordbase_recent_locations', JSON.stringify(newRecents));
    setRecentLocations(newRecents);
    onSelect(location);
  };
  // Handle Keypad logic
  const currentRegion = useMemo(() => {
    if (!keypadInput) return null;
    return PORTUGAL_GEO.find(r => keypadInput.startsWith(r.id)) || null;
  }, [keypadInput]);
  const currentCity = useMemo(() => {
    if (!currentRegion || keypadInput.length < 2) return null;
    return currentRegion.cities.find(c => keypadInput.startsWith(c.id)) || null;
  }, [keypadInput, currentRegion]);
  const currentDistrict = useMemo(() => {
    if (!currentCity || !currentCity.districts || keypadInput.length < 3) return null;
    return currentCity.districts.find(d => keypadInput === d.id) || null;
  }, [keypadInput, currentCity]);
  // Determine what list to show in keypad mode
  const keypadList = useMemo(() => {
    if (!keypadInput) return PORTUGAL_GEO.map(r => ({ ...r, type: 'region' as const }));
    if (currentRegion && keypadInput === currentRegion.id) {
      return currentRegion.cities.map(c => ({ ...c, type: 'city' as const }));
    }
    if (currentCity && keypadInput === currentCity.id) {
      if (currentCity.districts && currentCity.districts.length > 0) {
        return currentCity.districts.map(d => ({ ...d, type: 'district' as const }));
      }
    }
    return [];
  }, [keypadInput, currentRegion, currentCity]);
  const handleKeypadPress = (key: string) => {
    if (key === 'clear') {
      setKeypadInput(prev => prev.slice(0, -1));
      return;
    }
    
    const nextInput = keypadInput + key;
    setKeypadInput(nextInput);
    // Auto-select if it's a complete leaf node match
    const r = PORTUGAL_GEO.find(r => nextInput.startsWith(r.id));
    if (r) {
      const c = r.cities.find(c => nextInput.startsWith(c.id));
      if (c && nextInput === c.id) {
        if (!c.districts || c.districts.length === 0) {
          handleSelect(`${c.name} (${r.name})`);
          return;
        }
      }
      if (c && c.districts) {
        const d = c.districts.find(d => nextInput === d.id);
        if (d) {
          handleSelect(`${c.name}, ${d.name} (${r.name})`);
          return;
        }
      }
    }
  };
  const handleListItemClick = (item: any) => {
    if (item.type === 'region') {
      setKeypadInput(item.id);
    } else if (item.type === 'city') {
      setKeypadInput(item.id);
      if (!item.districts || item.districts.length === 0) {
        handleSelect(`${item.name} (${currentRegion?.name})`);
      }
    } else if (item.type === 'district') {
      setKeypadInput(item.id);
      handleSelect(`${currentCity?.name}, ${item.name} (${currentRegion?.name})`);
    }
  };
  // Search logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return FLATTENED_GEO.filter(item => 
      item.fullName.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [searchQuery]);
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col font-sans animate-in slide-in-from-bottom-4 duration-300 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#030712]">
        <h2 className="text-lg font-bold tracking-tight">Select Location</h2>
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* Mode Switcher */}
      <div className="flex px-4 py-3 bg-[#030712] border-b border-white/5">
        <div className="flex w-full bg-white/5 rounded-xl p-1">
          <button 
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'keypad' ? 'bg-[#030712] text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setMode('keypad')}
          >
            Fast Keypad
          </button>
          <button 
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'search' ? 'bg-[#030712] text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setMode('search')}
          >
            Text Search
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-[#030712] overflow-hidden">
        
        {mode === 'keypad' ? (
          <div className="flex-1 flex flex-col h-full">
            
            {/* Recent Locations (Show only if no input) */}
            {!keypadInput && recentLocations.length > 0 && (
              <div className="px-4 py-3 border-b border-white/5 bg-slate-900/30">
                <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Recent</div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {recentLocations.map(loc => (
                    <button 
                      key={loc}
                      onClick={() => handleSelect(loc)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm whitespace-nowrap flex items-center gap-1.5 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Breadcrumb / Input Display */}
            <div className="px-4 py-3 bg-[#030712] border-b border-white/5 min-h-[64px] flex items-center">
              {keypadInput ? (
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  {currentRegion && (
                    <span className="bg-slate-800 text-white px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer hover:bg-slate-700" onClick={() => setKeypadInput('')}>
                      {currentRegion.name} <X className="w-3 h-3 text-slate-400" />
                    </span>
                  )}
                  {currentCity && (
                    <>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                      <span className="bg-slate-800 text-white px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer hover:bg-slate-700" onClick={() => setKeypadInput(currentRegion!.id)}>
                        {currentCity.name} <X className="w-3 h-3 text-slate-400" />
                      </span>
                    </>
                  )}
                  {currentDistrict && (
                    <>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                      <span className="bg-cyan-950/50 text-cyan-400 border border-cyan-900/50 px-2.5 py-1.5 rounded-lg font-medium">
                        {currentDistrict.name}
                      </span>
                    </>
                  )}
                  {/* Blinking cursor */}
                  <span className="w-1.5 h-5 bg-cyan-400 animate-pulse ml-1 rounded-full"></span>
                </div>
              ) : (
                <div className="text-slate-500 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Select Region (Type 1-7)</span>
                  <span className="w-1.5 h-5 bg-slate-600 animate-pulse ml-1 rounded-full"></span>
                </div>
              )}
            </div>
            {/* List View */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className={keypadList[0]?.type === 'region' ? "grid grid-cols-3 gap-2.5 sm:gap-4" : "grid grid-cols-1 gap-2"}>
                {keypadList.map(item => {
                  if (item.type === 'region') {
                    const meta = REGION_METADATA[item.id] || { icon: MapPin, color: 'border-blue-900/30', bgGlow: 'bg-slate-900/50 text-slate-400', desc: 'Portugal Region', text: 'text-blue-400' };
                    const Icon = meta.icon;
                    return (
                      <button 
                        key={item.id} 
                        className={`group relative aspect-[0.85] sm:aspect-square p-2.5 sm:p-5 bg-slate-900/60 border ${meta.color} rounded-[1.25rem] sm:rounded-[2rem] transition-all hover:scale-[1.03] active:scale-90 text-center flex flex-col items-center justify-between w-full cursor-pointer overflow-hidden`}
                        onClick={() => handleListItemClick(item)}
                      >
                        {/* Background glow decoration */}
                        <div className="absolute inset-0 bg-slate-950/20 opacity-30 group-hover:opacity-10 transition-opacity" />
                        <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-current opacity-[0.02] rounded-full blur-md group-hover:opacity-[0.05] transition-opacity pointer-events-none" />
                        
                        {/* Top Accent Spacer */}
                        <div className="w-full flex justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="text-[8px] sm:text-[9px] text-cyan-400/80 font-mono tracking-widest uppercase font-black">Select</span>
                        </div>
                        
                        {/* Elegant Centered Large Icon */}
                        <div className="my-auto flex flex-col items-center justify-center z-10">
                          <div className={`p-3.5 sm:p-5 rounded-full ${meta.bgGlow} border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all duration-300 group-hover:scale-110 group-hover:brightness-110`}>
                            <Icon className="w-6 h-6 sm:w-10 sm:h-10 stroke-[1.5]" />
                          </div>
                        </div>
                        
                        <div className="w-full text-center z-10 mt-auto">
                          <span className="block font-black text-white text-[10px] sm:text-sm tracking-tight group-hover:text-cyan-300 transition-colors uppercase leading-none truncate">
                            {item.name}
                          </span>
                        </div>
                      </button>
                    );
                  }
                  // City or District layout
                  return (
                    <button 
                      key={item.id} 
                      className="group flex items-center justify-between p-3.5 bg-slate-900/40 hover:bg-[#111c3d]/70 border border-blue-950/50 hover:border-cyan-500/50 rounded-xl transition-all text-left cursor-pointer shadow-sm active:scale-[0.98]"
                      onClick={() => handleListItemClick(item)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-950/40 text-cyan-400 flex items-center justify-center border border-blue-900/20 group-hover:bg-cyan-500/10 transition-colors shrink-0">
                          <MapPin className="w-4 h-4 text-cyan-400 stroke-[2]" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{item.name}</span>
                        </div>
                      </div>
                      {item.type !== 'district' && (!item.districts || item.districts.length > 0) && (
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Numeric Keypad (Bottom Fixed) */}
            <div className="bg-[#030712] p-4 pb-8 border-t border-white/5 shrink-0">
              <div className="grid grid-cols-3 gap-3 max-w-[320px] mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button 
                    key={num} 
                    className="h-14 sm:h-16 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 rounded-2xl flex items-center justify-center text-2xl font-medium transition-all"
                    onClick={() => handleKeypadPress(num.toString())}
                  >
                    {num}
                  </button>
                ))}
                <button className="h-14 sm:h-16 bg-transparent flex items-center justify-center text-2xl font-medium opacity-20 cursor-not-allowed">
                  *
                </button>
                <button 
                  className="h-14 sm:h-16 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 rounded-2xl flex items-center justify-center text-2xl font-medium transition-all"
                  onClick={() => handleKeypadPress('0')}
                >
                  0
                </button>
                <button 
                  className="h-14 sm:h-16 bg-transparent hover:bg-red-950/30 active:bg-red-900/50 rounded-2xl flex items-center justify-center transition-all text-slate-500 hover:text-red-400"
                  onClick={() => handleKeypadPress('clear')}
                  disabled={!keypadInput}
                >
                  <Delete className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full">
            {/* Search Input */}
            <div className="p-4 border-b border-white/5 bg-[#030712]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="E.g. Faro, Albufeira..."
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-lg"
                />
                {searchQuery && (
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-slate-800 rounded-full text-slate-400 hover:text-white"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-2">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map(result => (
                    <button 
                      key={result.id}
                      className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors text-left group"
                      onClick={() => handleSelect(result.fullName)}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-cyan-400 group-hover:bg-cyan-950/30 transition-colors shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-200 text-lg">{result.shortName}</div>
                        <div className="text-sm text-slate-500">{result.region}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center p-8 text-slate-500 mt-10">
                  <MapPin className="w-10 h-10 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No locations found matching "{searchQuery}"</p>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-500 mt-10">
                  <Search className="w-10 h-10 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Type a city or district name</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}