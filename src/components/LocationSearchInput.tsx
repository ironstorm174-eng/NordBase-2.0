import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, X } from 'lucide-react';

interface LocationSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function LocationSearchInput({
  value,
  onChange,
  placeholder = "Start typing city or area...",
  className = "",
  id
}: LocationSearchInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const skipNextFetch = useRef(false);

  // Sync with prop value
  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value, query]);

  // Click outside to close suggestion box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce when query changes
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
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lat=37.1&lon=-8.3`);
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
          // Unique list
          setSuggestions(Array.from(new Set(formattedSuggestions)));
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Failed to fetch locations", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (selectedName: string) => {
    skipNextFetch.current = true;
    setQuery(selectedName);
    onChange(selectedName);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <MapPin className="h-4 w-4 text-cyan-500" />
      </div>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        onFocus={() => {
          if (query.length >= 3) {
            setIsOpen(true);
          }
        }}
        className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-xl border border-blue-900/30 bg-slate-950 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
        autoComplete="off"
      />
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1.5">
        {loading && <Loader2 className="h-3.5 w-3.5 text-cyan-500 animate-spin" />}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onChange('');
              setIsOpen(false);
            }}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && query.length >= 3 && (
        <div className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto z-[200] bg-slate-950 border border-blue-900/40 rounded-xl shadow-2xl shadow-black/80 backdrop-blur-md divide-y divide-blue-950/40 no-scrollbar">
          {suggestions.length > 0 ? (
            suggestions.map((item, idx) => (
              <button
                key={`${idx}-${item}`}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full px-4 py-2.5 hover:bg-blue-950/40 text-left flex items-center justify-between group transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                  <span className="text-slate-200 group-hover:text-white transition-colors leading-snug">
                    {item}
                  </span>
                </div>
              </button>
            ))
          ) : !loading ? (
            <div className="p-2 divide-y divide-blue-950/40">
              <div className="px-3 py-2 text-slate-500 text-xs flex items-center gap-2">
                <Search className="w-3.5 h-3.5 opacity-35" />
                <span>No exact matches found for "{query}"</span>
              </div>
              <button
                type="button"
                onClick={() => handleSelect(query)}
                className="w-full mt-1 px-3 py-2 text-left text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Use "{query}" as location</span>
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
