import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, Loader2, X, Check } from 'lucide-react';

interface AddressAutocompleteProps {
  userLocation?: { lat: number, lon: number } | null;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

export function AddressAutocomplete({ 
  value, 
  onChange, 
  placeholder = "", 
  className = "", 
  required = false, 
  userLocation = null,
  multiline = false,
  rows = 2
}: AddressAutocompleteProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(!!value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const skipNextFetch = useRef(false);

  useEffect(() => {
    if (value !== query) {
      setQuery(value);
      setIsConfirmed(!!value);
    }
  }, [value, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    setLoading(true);
    setIsOpen(true);
    
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5${userLocation ? `&lat=${userLocation.lat}&lon=${userLocation.lon}` : '&lat=39.3999&lon=-8.2245'}`);
        const data = await res.json();
        
        if (data.features) {
          const formattedSuggestions = data.features.map((feature: any) => {
            const props = feature.properties;
            const parts = [
              props.name,
              props.housenumber,
              props.street,
              props.district,
              props.city,
              props.postcode
            ].filter(Boolean);
            
            // Deduplicate parts
            return Array.from(new Set(parts)).join(', ');
          });
          setSuggestions(formattedSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Failed to fetch addresses", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, userLocation]);

  const handleSelect = (suggestion: string) => {
    skipNextFetch.current = true;
    setQuery(suggestion);
    onChange(suggestion);
    setIsConfirmed(true);
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (query.trim()) {
      setIsConfirmed(true);
      onChange(query);
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      {multiline ? (
        <>
          <div className="relative w-full">
            <div className="absolute left-3.5 top-3.5 pointer-events-none z-10">
              <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-cyan-500" />
            </div>

            <textarea
              rows={rows}
              required={required}
              placeholder={placeholder || t('address.placeholder')}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onChange(e.target.value);
                setIsConfirmed(false);
              }}
              onFocus={() => {
                if (query.length >= 3) setIsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleConfirm();
                }
              }}
              className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-blue-900/40 rounded-xl text-xs sm:text-sm font-normal text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans shadow-inner resize-none leading-relaxed min-h-[75px]"
            />

            {/* Top-right quick action buttons */}
            <div className="absolute right-3 top-3 flex items-center gap-1 z-10">
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    onChange('');
                    setIsConfirmed(false);
                    setIsOpen(false);
                  }}
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded bg-slate-900/60 border border-slate-800 cursor-pointer"
                  type="button"
                  title={t('address.clearAddress', 'Clear address')}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
            <MapPin className="h-5 w-5 text-cyan-500" />
          </div>

          <input
            type="text"
            required={required}
            placeholder={placeholder || t('address.placeholder')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange(e.target.value);
              setIsConfirmed(false);
            }}
            onFocus={() => {
              if (query.length >= 3) setIsOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleConfirm();
              }
            }}
            className="w-full pl-11 pr-20 py-3.5 bg-slate-950/80 border border-blue-900/40 rounded-2xl text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans shadow-lg shadow-black/20"
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1.5 z-10">
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  onChange('');
                  setIsConfirmed(false);
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                type="button"
                title={t('address.clearAddress', 'Clear address')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Prominent Action / Confirmation Status Box below field */}
      {query.trim() && !isConfirmed && (
        <div className="mt-2 flex items-center justify-between gap-3 p-2.5 bg-gradient-to-r from-blue-950/90 via-slate-900 to-slate-950 border border-cyan-500/50 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 min-w-0 pl-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
            <span className="text-xs text-slate-200 font-medium truncate">
              {t('address.confirmHint', "Address entered. Click 'Confirm' to pin.")}
            </span>
          </div>
          <button
            onClick={handleConfirm}
            type="button"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black px-4 py-2 rounded-lg text-xs transition-all shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0 border-0"
          >
            <Check className="h-4 w-4 stroke-[3]" />
            <span>{t('address.confirm', 'Confirm Address')}</span>
          </button>
        </div>
      )}

      {query.trim() && isConfirmed && (
        <div className="mt-2 flex items-center justify-between gap-2 px-3 py-2 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <Check className="h-4 w-4 text-emerald-400 shrink-0 stroke-[3]" />
            <span className="truncate">{t('address.savedHint', 'Address confirmed!')}</span>
          </div>
          <button
            onClick={() => setIsConfirmed(false)}
            type="button"
            className="text-slate-400 hover:text-white text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 cursor-pointer shrink-0 ml-2"
          >
            {t('address.edit', 'Edit')}
          </button>
        </div>
      )}

      {/* Autocomplete Dropdown Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-blue-900/60 rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
          {loading ? (
            <div className="flex items-center gap-3 px-5 py-4 text-slate-400 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />
              {t('address.searching', 'Searching addresses...')}
            </div>
          ) : (
            <div>
              {suggestions.length > 0 && (
                <ul className="py-2 divide-y divide-slate-800/40">
                  {suggestions.map((suggestion, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleSelect(suggestion)}
                        className="w-full text-left px-5 py-3 hover:bg-slate-800/60 flex items-center gap-3 text-sm text-slate-200 transition-colors cursor-pointer"
                        type="button"
                      >
                        <Search className="h-4 w-4 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{suggestion}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Explicit option to use exactly what the user typed */}
              {query.trim().length >= 2 && (
                <div className="p-2 border-t border-blue-900/40 bg-slate-950/80">
                  <button
                    onClick={() => handleSelect(query)}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-cyan-950/60 bg-slate-900 border border-cyan-500/40 flex items-center justify-between gap-3 text-xs sm:text-sm text-cyan-300 font-bold transition-all cursor-pointer shadow-md active:scale-98"
                    type="button"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Check className="h-4 w-4 text-cyan-400 shrink-0 stroke-[3]" />
                      <span className="truncate">{t('address.useEntered', 'Use entered address:')} "{query}"</span>
                    </div>
                    <span className="text-[10px] bg-cyan-500 text-slate-950 px-2 py-1 rounded-lg font-black uppercase tracking-wider shrink-0">
                      {t('address.confirm', 'Confirm')}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
