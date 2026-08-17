import React, { useState, useMemo } from 'react';
import { AuthUser, ServiceCategory } from '../types';
import { Search, MapPin, Shield, ChevronLeft, Languages, Calendar } from 'lucide-react';
import { store } from '../store';
import { AddressAutocomplete } from './AddressAutocomplete';
interface MarketplaceViewProps {
  category: ServiceCategory;
  specialty?: string;
  onGoBack: () => void;
  currentUser: AuthUser | null;
  onSubmitDirectRequest: (specialistId: string, description: string) => void;
  onRequestLogin?: () => void;
}
export default function MarketplaceView({ category, specialty, onGoBack, currentUser, onSubmitDirectRequest, onRequestLogin }: MarketplaceViewProps) {
  const [searchQuery, setSearchQuery] = useState(specialty || '');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<AuthUser | null>(null);
  const [requestText, setRequestText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // We fetch directly from store for simplicity in this component,
  // or we could get it passed down. 
  const allSpecialists = (store.getState().users || []).filter(u => u.role === 'specialist' && u.categories?.some((c: any) => ['Care', 'Lessons', 'Business'].includes(c.name || c)));
  
  const specialists = useMemo(() => {
    return allSpecialists.filter(s => {
      // Must match the main category (Care, Lessons, Other)
      const hasCategory = s.categories?.some(c => {
        const cName = typeof c === 'string' ? c : (c as any).name;
        return cName === category;
      });
      if (!hasCategory) return false;
      // Filter by search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesAbout = s.aboutMe?.toLowerCase().includes(q) || s.skillsDescription?.toLowerCase().includes(q) || s.specialtiesWithLevels?.some(sp => sp.specialty.toLowerCase().includes(q));
        const matchesServices = s.marketplaceServices?.some(srv => srv.name.toLowerCase().includes(q));
        if (!matchesName && !matchesAbout && !matchesServices) return false;
      }
      // Filter by city (locationSearch)
      if (selectedCity) {
        const loc = selectedCity.toLowerCase();
        const sCity = (s.city || '').toLowerCase();
        if (!loc.includes(sCity) && !sCity.includes(loc)) {
          return false;
        }
      }
      return true;
    });
  }, [allSpecialists, category, searchQuery, selectedCity]);
  // Extract unique cities for the filter
  
  const handleDirectRequest = () => {
    if (!currentUser) {
      if (onRequestLogin) onRequestLogin();
      return;
    }
    if (!requestText.trim() || !selectedSpecialist) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitDirectRequest(selectedSpecialist.id, requestText);
      setIsSubmitting(false);
      setSelectedSpecialist(null);
      setRequestText('');
    }, 1000);
  };
  if (selectedSpecialist) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
          onClick={() => setSelectedSpecialist(null)}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Back to specialists
        </button>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-32 bg-gradient-to-r from-cyan-950 to-blue-900 relative"></div>
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 z-10 shadow-xl">
                {selectedSpecialist.photoUrl ? (
                  <img src={selectedSpecialist.photoUrl} alt={selectedSpecialist.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-slate-500">{selectedSpecialist.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
                  {selectedSpecialist.name}
                  {selectedSpecialist.verificationDocuments && selectedSpecialist.verificationDocuments.length > 0 && (
                    <Shield className="w-6 h-6 text-emerald-400" />
                  )}
                </h1>
                <p className="text-slate-400 text-lg flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4" /> {selectedSpecialist.city || 'Remote'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {/* About Section */}
                <section>
                  <h3 className="text-xl font-bold text-slate-200 mb-3 border-b border-slate-800 pb-2">About Me</h3>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedSpecialist.aboutMe || selectedSpecialist.skillsDescription || "No description provided."}
                  </p>
                </section>
                {/* Services Section */}
                {selectedSpecialist.marketplaceServices && selectedSpecialist.marketplaceServices.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold text-slate-200 mb-3 border-b border-slate-800 pb-2">Services & Pricing</h3>
                    <div className="grid gap-3">
                      {selectedSpecialist.marketplaceServices.map(srv => (
                        <div key={srv.id} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-center border border-slate-700/50">
                          <div>
                            <h4 className="font-semibold text-white text-lg">{srv.name}</h4>
                            <p className="text-slate-400 text-sm">Duration: {srv.durationMinutes} mins</p>
                          </div>
                          <div className="text-xl font-bold text-cyan-400">
                            €{srv.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {/* Availability Section */}
                {selectedSpecialist.marketplaceAvailability && selectedSpecialist.marketplaceAvailability.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold text-slate-200 mb-3 border-b border-slate-800 pb-2">Availability</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpecialist.marketplaceAvailability.map((avail, idx) => (
                        <div key={idx} className="bg-blue-900/20 border border-blue-500/20 text-blue-300 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{avail.dayOfWeek}</span>
                          <span>{avail.startTime} - {avail.endTime}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
              {/* Sidebar Contact / Request */}
              <div className="space-y-6">
                <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-white mb-4">Request Service</h3>
                  <textarea
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    placeholder="Describe what you need help with..."
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 min-h-[120px] mb-4"
                  ></textarea>
                  <button
                    onClick={handleDirectRequest}
                    disabled={isSubmitting || !requestText.trim()}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:shadow-none"
                  >
                    {isSubmitting ? 'Sending Request...' : 'Send Request'}
                  </button>
                  {!currentUser && (
                    <p className="text-xs text-slate-500 mt-3 text-center">
                      You will be asked to log in or create an account to track this request.
                    </p>
                  )}
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-5 space-y-4">
                  <h3 className="text-lg font-bold text-white">Details</h3>
                  {selectedSpecialist.languages && selectedSpecialist.languages.length > 0 && (
                    <div>
                      <div className="text-slate-400 text-sm mb-1 flex items-center gap-1"><Languages className="w-4 h-4"/> Languages</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedSpecialist.languages.map(lang => (
                          <span key={lang.language} className="px-2 py-1 bg-slate-700 rounded-md text-xs text-slate-200">
                            {lang.language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedSpecialist.tradeSkillLevel && (
                    <div>
                      <div className="text-slate-400 text-sm mb-1">Experience Level</div>
                      <div className="text-white capitalize">{selectedSpecialist.tradeSkillLevel}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onGoBack}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white">{category} Specialists</h1>
          <p className="text-slate-400">Find and book trusted independent professionals.</p>
        </div>
      </div>
      {/* Filters and Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 mb-8">
        <div className="sm:w-1/3 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text"
            placeholder="Search by name, skill, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>
        <div className="sm:w-2/3 relative z-50">
          <AddressAutocomplete
            value={selectedCity}
            onChange={(val) => setSelectedCity(val)}
            placeholder="Any Location"
            className="[&>input]:bg-slate-800 [&>input]:border-none [&>input]:py-3 [&>input]:pl-12"
          />
        </div>
      </div>
      {/* Specialist Grid */}
      {specialists.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No specialists found</h3>
          <p className="text-slate-400">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialists.map(specialist => (
            <div 
              key={specialist.id} 
              onClick={() => setSelectedSpecialist(specialist)}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 cursor-pointer transition-all hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-1 group flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-slate-700 group-hover:border-cyan-500 transition-colors">
                  {specialist.photoUrl ? (
                    <img src={specialist.photoUrl} alt={specialist.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-slate-500">{specialist.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate flex items-center gap-1">
                    {specialist.name}
                    {specialist.verificationDocuments && specialist.verificationDocuments.length > 0 && (
                      <Shield className="w-4 h-4 text-emerald-400" title="Verified ID" />
                    )}
                  </h3>
                  <p className="text-slate-400 text-sm truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {specialist.city || 'Remote'}
                  </p>
                </div>
              </div>
              
              <div className="mb-4 flex-1">
                <p className="text-slate-300 text-sm line-clamp-3">
                  {specialist.aboutMe || specialist.skillsDescription || "Independent specialist ready to help you."}
                </p>
              </div>
              {specialist.marketplaceServices && specialist.marketplaceServices.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Top Service</div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-sm flex justify-between items-center border border-slate-700/50">
                    <span className="text-slate-300 truncate mr-2">{specialist.marketplaceServices[0].name}</span>
                    <span className="text-cyan-400 font-bold whitespace-nowrap">€{specialist.marketplaceServices[0].price}</span>
                  </div>
                </div>
              )}
              <button className="w-full py-2.5 bg-slate-800 group-hover:bg-cyan-600 text-slate-300 group-hover:text-white rounded-xl text-sm font-bold transition-colors">
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}