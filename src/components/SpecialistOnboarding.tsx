import React, { useState, useEffect } from 'react';
import { AuthUser, ServiceCategory, SpecialistAvailability, SpecialtyWithLevel } from '../types';
import { validatePhone } from '../lib/validation';
import { CATEGORIES, CITIES, CATEGORY_SPECIALTIES } from '../data';
import { LocationSearchInput } from './LocationSearchInput';
import { uploadImage } from '../utils/upload';
import { store } from '../store';
import NordBaseLogo from './NordBaseLogo';
import SpecialistWelcomeNotice from './SpecialistWelcomeNotice';
import Academy from './Academy';
import { 
  CheckCircle, 
  ArrowRight, 
  UploadCloud, 
  User, 
  Wrench, 
  Clock, 
  FileText,
  AlertCircle,
  Languages,
  Award,
  Globe,
  Camera,
  ShieldCheck,
  Check,
  Smartphone,
  Trash2,
  Plus
} from 'lucide-react';
interface SpecialistOnboardingProps {
  currentUser: AuthUser;
  onComplete: (data: any) => void;
  onLogout: () => void;
}
interface LanguageSpeaker {
  language: string;
  level: 'basic' | 'conversational' | 'native';
}
const AVAILABLE_LANGUAGES = [
  'English',
  'Portuguese',
  'Russian',
  'Ukrainian',
  'Spanish',
  'French',
  'German'
];
const CATEGORY_EXAMPLES: Record<string, string> = {
  'Home Services': 'Plumber, electrician, handyman, carpentry, blind installer',
  'Cleaning': 'House cleaner, office cleaner, deep carpet & window washing',
  'Gardening': 'Gardening, landscaping, hedge trimming, tree surgery',
  'Moving': 'Residential moving, furniture movers, assembly, piano mover',
  'Transport': 'Airport transfer, courier, delivery driver, chauffeur',
  'Repairs': 'Appliance repair, AC & HVAC, washing machine, TV, computer tech',
  'Construction': 'Builder, mason, roofer, tiler, drywall, concrete worker',
  'Pools': 'Pool cleaner, chemistry balance, water treatment, filters',
  'Hospitality': 'Waitering, barista, cooking assistant, dishwasher, reception',
  'Care': 'Babysitting, elderly caregiver, nanny, pet sitter, dog walker',
  'Lessons': 'Language tutor, music teacher, math tutoring, fitness coach',
  'Business': 'Office help, accountant, realtor, photographer, designer, lawyer, legalization helper',
};
export default function SpecialistOnboarding({ currentUser, onComplete, onLogout }: SpecialistOnboardingProps) {
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAcademyModal, setShowAcademyModal] = useState(false);
  const [isNoticeConfirmed, setIsNoticeConfirmed] = useState(true);
  // Form State
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [photoUrl, setPhotoUrl] = useState<string>(currentUser.photoUrl || '');
  
  // Multiple categories selection
  const [categories, setCategories] = useState<ServiceCategory[]>(currentUser.categories || []);
  const isMarketplace = categories.some((c: any) => ['Care', 'Lessons', 'Business'].includes(c.name || c));
  const [specialtiesWithLevels, setSpecialtiesWithLevels] = useState<SpecialtyWithLevel[]>(
    currentUser.specialtiesWithLevels || []
  );
  // Add Specialty form state
  const [addSelectedCategory, setAddSelectedCategory] = useState<ServiceCategory>('Home Services');
  const [addSelectedSpecialty, setAddSelectedSpecialty] = useState<string>('Plumber');
  const [addSelectedLevel, setAddSelectedLevel] = useState<'amateur' | 'pro' | 'expert'>('pro');
  useEffect(() => {
    const list = CATEGORY_SPECIALTIES[addSelectedCategory] || [];
    if (list.length > 0) {
      setAddSelectedSpecialty(list[0]);
    } else {
      setAddSelectedSpecialty('');
    }
  }, [addSelectedCategory]);
  useEffect(() => {
    const uniqueCats = Array.from(new Set(specialtiesWithLevels.map(s => s.category)));
    setCategories(uniqueCats);
  }, [specialtiesWithLevels]);
  
  // Languages with proficiency levels
  const [spokenLanguages, setSpokenLanguages] = useState<LanguageSpeaker[]>(
    currentUser.languages || [
      { language: 'English', level: 'conversational' }
    ]
  );
  
  // Trade assessment
  const [tradeSkillLevel, setTradeSkillLevel] = useState<'amateur' | 'pro' | 'expert'>(
    (currentUser.tradeSkillLevel as any) || 'pro'
  );
  const [skillsDescription, setSkillsDescription] = useState(currentUser.skillsDescription || '');
  
  // Regional settings
  const [city, setCity] = useState(currentUser.city || CITIES[0].name);
  const [radius, setRadius] = useState<number>(30);
  const [availability, setAvailability] = useState<SpecialistAvailability>('full_time');
  
  // Document Upload state
  const [passportDoc, setPassportDoc] = useState<{ name: string; url: string } | null>(null);
  const [idDoc, setIdDoc] = useState<{ name: string; url: string } | null>(null);
  const [licenseDoc, setLicenseDoc] = useState<{ name: string; url: string } | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null); // tracks which field is uploading
  // Helper to process and upload document or photo file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'passport' | 'id_card' | 'drivers_license') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert('File exceeds the limit. Please select a file smaller than 15MB.');
      return;
    }
    setIsUploading(type);
    
    try {
      const uploadedUrl = await uploadImage(file);
      const baseName = file.name.replace(/\.[^/.]+$/, '') || 'document';
      const normalizedDocName = `${baseName}.jpg`;
      
      if (type === 'photo') {
        setPhotoUrl(uploadedUrl);
      } else if (type === 'passport') {
        setPassportDoc({ name: normalizedDocName, url: uploadedUrl });
      } else if (type === 'id_card') {
        setIdDoc({ name: normalizedDocName, url: uploadedUrl });
      } else if (type === 'drivers_license') {
        setLicenseDoc({ name: normalizedDocName, url: uploadedUrl });
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(`File upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploading(null);
    }
  };
  const toggleCategory = (cat: ServiceCategory) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };
  const handleLanguageToggle = (lang: string) => {
    const exists = spokenLanguages.some(l => l.language === lang);
    if (exists) {
      setSpokenLanguages(spokenLanguages.filter(l => l.language !== lang));
    } else {
      setSpokenLanguages([...spokenLanguages, { language: lang, level: 'conversational' }]);
    }
  };
  const handleLanguageLevelChange = (lang: string, level: 'basic' | 'conversational' | 'native') => {
    setSpokenLanguages(spokenLanguages.map(l => {
      if (l.language === lang) {
        return { ...l, level };
      }
      return l;
    }));
  };
  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1) {
      const phoneVal = validatePhone(phone);
      if (!phoneVal.isValid) {
        setErrorMsg(phoneVal.message || 'Please enter a valid WhatsApp / Phone number.');
        return;
      }
      if (!photoUrl) {
        setErrorMsg('Please upload a profile photo so clients can see you.');
        return;
      }
    }
    if (step === 2 && specialtiesWithLevels.length === 0) {
      setErrorMsg('Please add at least one specialty and choose its mastery level.');
      return;
    }
    if (step === 3 && spokenLanguages.length === 0) {
      setErrorMsg('Please select at least one language.');
      return;
    }
    if (step === 4) {
      if (!skillsDescription.trim()) {
        setErrorMsg('Please tell us about your skills and tools.');
        return;
      }
    }
    if (step === 5) {
      if (!passportDoc && !idDoc && !licenseDoc) {
        setErrorMsg('Please upload at least one verification document (Passport, ID, or Driver’s License) for territory partner audit.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build list of verification documents
    const verificationDocuments: any[] = [];
    if (passportDoc) {
      verificationDocuments.push({ type: 'passport', name: passportDoc.name, url: passportDoc.url });
    }
    if (idDoc) {
      verificationDocuments.push({ type: 'id_card', name: idDoc.name, url: idDoc.url });
    }
    if (licenseDoc) {
      verificationDocuments.push({ type: 'drivers_license', name: licenseDoc.name, url: licenseDoc.url });
    }
    onComplete({
      phone,
      categories,
      city,
      radius,
      availability,
      languages: spokenLanguages,
      tradeSkillLevel,
      skillsDescription,
      photoUrl,
      verificationDocuments,
      specialtiesWithLevels
    });
  };
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans" id="specialist-onboarding-layout">
      {/* Top Header */}
      <header className="px-6 py-4 bg-[#0A1128]/80 backdrop-blur-md border-b border-blue-900/20 sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <NordBaseLogo onClick={() => store.goToHome()} size="sm" />
          <span className="text-[10px] bg-blue-500/10 text-cyan-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-blue-900/30">
            Professional Profile Setup
          </span>
        </div>
        <button onClick={onLogout} className="text-xs text-slate-400 hover:text-rose-400 font-bold transition-colors cursor-pointer">
          Log Out
        </button>
      </header>
      {/* Modern Top Progress Indicator */}
      <div className="w-full h-1.5 bg-slate-950">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300"
          style={{ width: `${(step / 7) * 100}%` }}
        />
      </div>
      <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:py-10">
        <div className="bg-[#0A1128]/95 rounded-[28px] shadow-[0_30px_70px_-10px_rgba(0,0,0,0.6)] border border-blue-900/25 p-6 md:p-10">
          
          {/* Header section */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase font-mono">
                Step {step} of 7
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight font-display mt-1">
                {step === 1 && 'Let’s start with you!'}
                {step === 2 && 'What is your specialty?'}
                {step === 3 && 'Which languages do you speak?'}
                {step === 4 && (isMarketplace ? 'Set up your Marketplace Profile' : 'Tell us about your trade level')}
                {step === 5 && 'Verify your account'}
                {step === 6 && 'Where do you work?'}
                {step === 7 && 'Review and finish!'}
              </h1>
              <p className="text-xs text-slate-400 mt-2">
                {step === 1 && 'Upload your profile photo and double check your WhatsApp number.'}
                {step === 2 && 'Select all services that you can perform beautifully.'}
                {step === 3 && 'Clients feel safer when they can communicate in their own language!'}
                {step === 4 && (isMarketplace ? 'Write an attractive description of your services. Your profile will be public in the NordBase Marketplace.' : 'Choose your experience level and describe your specialized tools.')}
                {step === 5 && 'Upload ID documents for fast verification by our regional partners.'}
                {step === 6 && 'Tell us your operating region and base city.'}
                {step === 7 && (isMarketplace ? 'Check everything. Click Submit to activate your free trial subscription!' : 'Check everything. Click Submit and start getting client leads!')}
              </p>
            </div>
          </div>
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-500/10 border-2 border-rose-500/20 rounded-2xl text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span className="font-medium leading-relaxed">{errorMsg}</span>
            </div>
          )}
          {/* STEP 1: Basic Profile Details & Photo */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col items-center p-6 bg-slate-950/40 rounded-2xl border border-blue-950/50">
                <div className="relative group cursor-pointer mb-4">
                  <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-blue-900/40 overflow-hidden flex items-center justify-center relative">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Specialist Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-10 h-10 text-slate-500" />
                    )}
                    {isUploading === 'photo' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 p-2 rounded-full text-white cursor-pointer transition-transform group-hover:scale-110 shadow-md">
                    <Camera className="w-4 h-4" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, 'photo')} 
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-400 font-medium">Click the camera icon to upload your professional photo</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">My Full Name</label>
                <div className="flex items-center gap-3 p-4 bg-slate-950/40 rounded-xl border border-blue-950/60 text-sm text-slate-300 font-semibold">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{currentUser.name}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">WhatsApp / Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Smartphone className="w-4 h-4" />
                  </span>
                  <input 
                    type="tel" 
                    value={phone} 
                    required
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+351 912 345 678"
                    className="w-full bg-slate-950 border border-blue-900/30 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono"
                  />
                </div>
                <p className="text-[10px] text-emerald-400 font-mono mt-2 font-bold flex items-center gap-1">
                  💬 Mandatory for receiving instant WhatsApp lead alerts & 1-click customer chats.
                </p>
              </div>
            </div>
          )}
          {/* STEP 2: Specialties Selector (Replacing Primary Trade) */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* List of current specialties */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  My Selected Specialties & Mastery Levels
                </label>
                {specialtiesWithLevels.length === 0 ? (
                  <div className="p-6 bg-slate-950/40 rounded-xl border border-dashed border-blue-900/30 text-center text-xs text-slate-500">
                    No specialties added yet. Please use the form below to declare your skills.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {specialtiesWithLevels.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-950/40 rounded-xl border border-blue-900/10 hover:border-blue-900/30 transition-colors"
                      >
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-950/85 text-cyan-400 mb-1 font-mono">
                            {item.category}
                          </span>
                          <p className="text-sm font-bold text-white">{item.specialty}</p>
                        </div>
                        <div className="flex items-center gap-3 justify-between sm:justify-end">
                          {/* Interactive Skill Selector inside item */}
                          <div className="flex bg-slate-950 p-1 rounded-lg border border-blue-950">
                            {(['amateur', 'pro', 'expert'] as const).map(lvl => (
                              <button
                                type="button"
                                key={lvl}
                                onClick={() => {
                                  const updated = [...specialtiesWithLevels];
                                  updated[index].level = lvl;
                                  setSpecialtiesWithLevels(updated);
                                }}
                                className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                  item.level === lvl
                                    ? 'bg-blue-600 text-white font-black'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                {lvl === 'amateur' && 'Amateur'}
                                {lvl === 'pro' && 'Pro'}
                                {lvl === 'expert' && 'Expert'}
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSpecialtiesWithLevels(specialtiesWithLevels.filter((_, i) => i !== index));
                            }}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Remove specialty"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Add Specialty Form Block */}
              <div className="p-5 bg-slate-950/40 rounded-2xl border border-blue-950/60 space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 font-mono">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Add a Specialty & Mastery Level</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Service Category
                    </label>
                    <select
                      value={addSelectedCategory}
                      onChange={e => setAddSelectedCategory(e.target.value as ServiceCategory)}
                      className="w-full bg-slate-950 border border-blue-900/30 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all cursor-pointer font-sans"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#0A1128] text-white">
                          {cat.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Specialty (Sub-Category) Dropdown */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Specialty (Sub-Category)
                    </label>
                    <select
                      value={addSelectedSpecialty}
                      onChange={e => setAddSelectedSpecialty(e.target.value)}
                      className="w-full bg-slate-950 border border-blue-900/30 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all cursor-pointer font-sans"
                    >
                      {(CATEGORY_SPECIALTIES[addSelectedCategory] || []).map(spec => (
                        <option key={spec} value={spec} className="bg-[#0A1128] text-white">
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Level choices */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    My Mastery Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'amateur', label: 'Amateur', desc: 'Passionate learner' },
                      { id: 'pro', label: 'Professional', desc: 'Licensed / Full-time' },
                      { id: 'expert', label: 'Expert', desc: 'Master / Certified' }
                    ].map(lvl => (
                      <button
                        type="button"
                        key={lvl.id}
                        onClick={() => setAddSelectedLevel(lvl.id as any)}
                        className={`flex flex-col items-center p-2.5 rounded-xl border transition-all cursor-pointer text-center ${
                          addSelectedLevel === lvl.id 
                            ? 'border-blue-500 bg-blue-950/30 text-cyan-300' 
                            : 'border-blue-950 bg-slate-950/20 hover:border-blue-900/20 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="font-bold text-xs">{lvl.label}</span>
                        <span className="text-[8px] text-slate-500 mt-0.5 font-sans">{lvl.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // Check duplicate
                    const exists = specialtiesWithLevels.some(
                      s => s.category === addSelectedCategory && s.specialty === addSelectedSpecialty
                    );
                    if (exists) {
                      setErrorMsg(`"${addSelectedSpecialty}" is already added to your profile.`);
                      return;
                    }
                    setErrorMsg(null);
                    setSpecialtiesWithLevels([
                      ...specialtiesWithLevels,
                      {
                        category: addSelectedCategory,
                        specialty: addSelectedSpecialty,
                        level: addSelectedLevel
                      }
                    ]);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md font-mono"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Specialty to My Profile</span>
                </button>
              </div>
            </div>
          )}
          {/* STEP 3: Languages Spoken & Levels */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <p className="text-xs text-slate-400">Select the languages you speak and choose your level of fluency.</p>
              
              <div className="space-y-3">
                {AVAILABLE_LANGUAGES.map(lang => {
                  const speaker = spokenLanguages.find(l => l.language === lang);
                  const isSelected = !!speaker;
                  return (
                    <div 
                      key={lang}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-950/30' : 'border-blue-950 bg-slate-950/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleLanguageToggle(lang)}
                            className="w-4.5 h-4.5 text-blue-600 bg-slate-900 border-slate-700 rounded focus:ring-blue-500 accent-blue-500"
                          />
                          <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                            {lang}
                          </span>
                        </label>
                        {isSelected && (
                          <div className="flex gap-1.5">
                            {(['basic', 'conversational', 'native'] as const).map(lvl => (
                              <button
                                type="button"
                                key={lvl}
                                onClick={() => handleLanguageLevelChange(lang, lvl)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                                  speaker.level === lvl 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-slate-900 text-slate-400 hover:text-white'
                                }`}
                              >
                                {lvl === 'basic' && 'Basic'}
                                {lvl === 'conversational' && 'Fluent'}
                                {lvl === 'native' && 'Native'}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* STEP 4: Experience Level & Tools Field */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">How do you rate your expertise?</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'amateur', label: 'Amateur', desc: 'Passionate and learning' },
                    { id: 'pro', label: 'Professional', desc: 'Licensed/experienced pro' },
                    { id: 'expert', label: 'Expert', desc: 'Certified Master specialist' }
                  ].map(lvl => (
                    <button
                      type="button"
                      key={lvl.id}
                      onClick={() => setTradeSkillLevel(lvl.id as any)}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
                        tradeSkillLevel === lvl.id 
                          ? 'border-blue-500 bg-blue-950/40' 
                          : 'border-blue-950 bg-slate-950/40 hover:border-blue-900/40 hover:bg-slate-950'
                      }`}
                    >
                      <Award className={`w-6 h-6 mb-2 ${tradeSkillLevel === lvl.id ? 'text-blue-400' : 'text-slate-500'}`} />
                      <p className={`font-bold text-xs ${tradeSkillLevel === lvl.id ? 'text-blue-400' : 'text-slate-300'}`}>{lvl.label}</p>
                      <p className="text-[9px] text-slate-500 mt-1 leading-tight">{lvl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  My Skills & Tools
                </label>
                <p className="text-[11px] text-slate-500 mb-2">List specific services, machinery, or certifications you hold (e.g., HVAC service, high-pressure washers, tile-cutter machine, emergency wiring).</p>
                <textarea
                  value={skillsDescription}
                  onChange={(e) => setSkillsDescription(e.target.value)}
                  placeholder="e.g. Expert in plumbing leakage repairs, copper pipe welding, drainage cleaning, and high pressure pump installation. I own a complete set of professional Bosch tools."
                  rows={4}
                  className="w-full bg-slate-950 border border-blue-900/30 rounded-xl p-4 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none leading-relaxed"
                />
              </div>
            </div>
          )}
          {/* STEP 5: Verification Documents */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <p className="text-xs text-slate-400">Upload your ID documents to ensure immediate territory partner approval and begin receiving verified leads.</p>
              
              <div className="space-y-4">
                {/* Document Type: Passport */}
                <div className="p-4 bg-slate-950/40 border border-blue-950 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Passport</p>
                      <p className="text-xxs text-slate-400 font-mono mt-0.5">
                        {passportDoc ? `✓ ${passportDoc.name}` : 'Not uploaded yet'}
                      </p>
                    </div>
                  </div>
                  <label className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer border border-blue-950 shrink-0 text-center">
                    {isUploading === 'passport' ? 'Reading...' : passportDoc ? 'Change Passport' : 'Upload File'}
                    <input 
                      type="file" 
                      accept="image/*,application/pdf"
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, 'passport')} 
                    />
                  </label>
                </div>
                {/* Document Type: National ID */}
                <div className="p-4 bg-slate-950/40 border border-blue-950 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">National ID Card</p>
                      <p className="text-xxs text-slate-400 font-mono mt-0.5">
                        {idDoc ? `✓ ${idDoc.name}` : 'Not uploaded yet'}
                      </p>
                    </div>
                  </div>
                  <label className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer border border-blue-950 shrink-0 text-center">
                    {isUploading === 'id_card' ? 'Reading...' : idDoc ? 'Change ID Card' : 'Upload File'}
                    <input 
                      type="file" 
                      accept="image/*,application/pdf"
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, 'id_card')} 
                    />
                  </label>
                </div>
                {/* Document Type: Driver's license */}
                <div className="p-4 bg-slate-950/40 border border-blue-950 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Driver’s License</p>
                      <p className="text-xxs text-slate-400 font-mono mt-0.5">
                        {licenseDoc ? `✓ ${licenseDoc.name}` : 'Not uploaded yet'}
                      </p>
                    </div>
                  </div>
                  <label className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer border border-blue-950 shrink-0 text-center">
                    {isUploading === 'drivers_license' ? 'Reading...' : licenseDoc ? 'Change License' : 'Upload File'}
                    <input 
                      type="file" 
                      accept="image/*,application/pdf"
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, 'drivers_license')} 
                    />
                  </label>
                </div>
              </div>
              <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-950 flex items-start gap-3 mt-4">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  <strong>Encrypted Transmission:</strong> Your ID uploads are processed client-side and saved into secure local storage. Regional partners inspect these to approve your account. No public access.
                </p>
              </div>
            </div>
          )}
          {/* STEP 6: Region and Radius selection */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Operating Hub (Base City)</label>
                <LocationSearchInput
                  value={city}
                  onChange={val => setCity(val)}
                  placeholder="Type operating hub..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex justify-between">
                  <span>How far can you travel to clients?</span>
                  <span className="text-blue-400 font-mono font-bold">{radius} km radius</span>
                </label>
                <input 
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={radius}
                  onChange={e => setRadius(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
                  <span>Just my city (5km)</span>
                  <span>Full Territory (100km)</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Work Availability</span>
                </label>
                <select
                  value={availability}
                  onChange={e => setAvailability(e.target.value as any)}
                  className="w-full bg-slate-950 border border-blue-900/30 rounded-xl px-4 py-3.5 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all cursor-pointer"
                >
                  <option value="full_time" className="bg-[#0A1128]">Full Time (Ready for any jobs)</option>
                  <option value="part_time" className="bg-[#0A1128]">Part Time (Flexible days)</option>
                  <option value="weekends_only" className="bg-[#0A1128]">Weekends Only</option>
                  <option value="evenings_only" className="bg-[#0A1128]">Evenings Only</option>
                  <option value="on_demand" className="bg-[#0A1128]">On Demand / Emergency</option>
                </select>
              </div>
            </div>
          )}
          {/* STEP 7: Review & Profile Summary */}
          {step === 7 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Specialist Welcome & Rules Collapsible Notice */}
              <SpecialistWelcomeNotice 
                defaultExpanded={true}
                onOpenAcademy={() => setShowAcademyModal(true)}
                showAcademyButton={true}
                isConfirmed={isNoticeConfirmed}
                onToggleConfirm={(val) => setIsNoticeConfirmed(val)}
              />
              <div className="bg-slate-950/40 p-5 rounded-2xl border border-blue-950 text-xs leading-relaxed space-y-4">
                <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>Onboarding Summary</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 font-sans border-t border-blue-950/50 pt-3">
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-bold font-mono">Specialist Name</span>
                    <span className="font-bold text-white text-xs">{currentUser.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-bold font-mono">WhatsApp Phone</span>
                    <span className="font-bold text-white text-xs font-mono">{phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-bold font-mono">Specialties & Levels</span>
                    <span className="font-bold text-slate-300 text-xs block">
                      {specialtiesWithLevels.map(s => `${s.specialty} (${s.level})`).join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-bold font-mono">Languages</span>
                    <span className="font-bold text-slate-300 text-xs">
                      {spokenLanguages.map(l => `${l.language} (${l.level})`).join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-bold font-mono">Base Hub</span>
                    <span className="font-bold text-slate-300 text-xs">{city} (+{radius}km)</span>
                  </div>
                </div>
                <div className="border-t border-blue-950/50 pt-3">
                  <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-bold font-mono mb-1">Skills Description</span>
                  <p className="text-slate-300 italic text-xxs font-sans line-clamp-3 leading-relaxed">{skillsDescription}</p>
                </div>
                <div className="border-t border-blue-950/50 pt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold">Verification Docs uploaded:</span>
                  <div className="flex gap-1.5">
                    {passportDoc && <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono text-[9px] font-bold">Passport</span>}
                    {idDoc && <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono text-[9px] font-bold">National ID</span>}
                    {licenseDoc && <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono text-[9px] font-bold">License</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Stepper Navigation Controls */}
          <div className="mt-10 pt-6 border-t border-blue-900/10 flex items-center justify-between">
            {step > 1 ? (
              <button 
                type="button"
                onClick={() => { setErrorMsg(null); setStep(prev => prev - 1); }}
                className="px-6 py-3 bg-blue-950 hover:bg-blue-900 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer font-mono"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            {step < 7 ? (
              <button 
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-md font-mono"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md font-mono flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Submit Profile</span>
              </button>
            )}
          </div>
        </div>
      </main>
      {/* NordBase Academy Modal for Specialist Onboarding */}
      {showAcademyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0B1124] border border-blue-900/40 rounded-3xl max-w-4xl w-full h-[85vh] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#141C36] border-b border-blue-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <h3 className="text-sm font-bold text-white font-display">NordBase Academy — Specialist Guide</h3>
              </div>
              <button
                onClick={() => setShowAcademyModal(false)}
                className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs cursor-pointer"
              >
                Close ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Academy userRole="specialist" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}