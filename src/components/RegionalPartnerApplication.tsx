import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe2,
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  Camera,
  AlertCircle,
  Building,
  Users,
  Award,
  Compass,
  Clock,
  Car,
  ShieldCheck,
  Target,
  Sparkles,
  CheckSquare
} from 'lucide-react';
import NordBaseLogo from './NordBaseLogo';
import { PORTUGAL_GEO } from '../lib/geo';
import { validatePhone, validateEmail } from '../lib/validation';
import { store } from '../store';
interface RegionalPartnerApplicationProps {
  onNavigateHome?: () => void;
  onOpenAuth?: () => void;
}
export default function RegionalPartnerApplication({
  onNavigateHome,
}: RegionalPartnerApplicationProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  // Validation Errors Map
  const [errors, setErrors] = useState<Record<string, string | boolean>>({});
  // Date of Birth parts
  const [dobDay, setDobDay] = useState<string>('');
  const [dobMonth, setDobMonth] = useState<string>('');
  const [dobYear, setDobYear] = useState<string>('');
  const handleDobChange = (d: string, m: string, y: string) => {
    setDobDay(d);
    setDobMonth(m);
    setDobYear(y);
    if (d && m && y) {
      setFormData((prev) => ({ ...prev, dob: `${y}-${m}-${d}` }));
    } else {
      setFormData((prev) => ({ ...prev, dob: '' }));
    }
  };
  // Region selection
  const [selectedRegionName, setSelectedRegionName] = useState<string>('Algarve');
  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    dob: '',
    country: 'Portugal',
    region: 'Algarve',
    city: 'Faro',
    phone: '',
    email: '',
    linkedinProfile: '',
    photoUrl: '',
    // Step 2: Professional Experience
    currentActivity: '',
    currentCompany: '',
    yearsExperience: '5–10', // 0–5, 5–10, 10–20, 20+
    managedTeams: false,
    maxTeamSizeManaged: '',
    ownedOrManagedBusiness: false,
    businessOwnershipExp: '',
    significantAchievement: '',
    // Step 3: Regional Knowledge
    targetRegion: 'Algarve',
    localCommunityKnowledge: 'Good', // Excellent, Good, Basic
    businessContactsCount: '20–50', // Less than 20, 20–50, 50–100, More than 100
    familiarIndustries: ['Real Estate & Hospitality', 'Construction & Services'],
    regionKnowledgeDesc: '',
    // Step 4: Leadership & Motivation
    whyPartner: '',
    whyChooseYou: '',
    howBuildTPNetwork: '',
    howAttractSpecialists: '',
    importantLeadershipValues: '',
    // Step 5: Availability
    hoursPerWeek: '20–30 hours/week',
    willingToTravel: true,
    hasVehicle: true,
    languages: ['Portuguese', 'English'],
    // Step 6: Business Readiness
    readinessLevel: 'I can dedicate my time to building the network.',
    isSelfEmployedOrCompany: true,
    willingToEstablishEntity: true,
    // Step 7: Vision
    threeYearVision: '',
    successDefinition: '',
    // Step 8: Declaration Checkboxes
    agreedAccurate: false,
    agreedNoGuarantee: false,
    agreedCompetitiveProcess: false,
    agreedStandards: false,
  });
  const handleTextChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };
  const handleLanguageToggle = (lang: string) => {
    setFormData((prev) => {
      const exists = prev.languages.includes(lang);
      const updated = exists
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages: updated };
    });
  };
  const handleIndustryToggle = (ind: string) => {
    setFormData((prev) => {
      const exists = prev.familiarIndustries.includes(ind);
      const updated = exists
        ? prev.familiarIndustries.filter((i) => i !== ind)
        : [...prev.familiarIndustries, ind];
      return { ...prev, familiarIndustries: updated };
    });
  };
  // Image Upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleTextChange('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  // Step Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string | boolean> = {};
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = true;
      if (!formData.lastName.trim()) newErrors.lastName = true;
      const phoneVal = validatePhone(formData.phone);
      if (!phoneVal.isValid) {
        newErrors.phone = phoneVal.message || true;
      }
      const emailVal = validateEmail(formData.email);
      if (!emailVal.isValid) {
        newErrors.email = emailVal.message || true;
      }
    } else if (step === 8) {
      if (!formData.agreedAccurate) newErrors.agreedAccurate = true;
      if (!formData.agreedNoGuarantee) newErrors.agreedNoGuarantee = true;
      if (!formData.agreedCompetitiveProcess) newErrors.agreedCompetitiveProcess = true;
      if (!formData.agreedStandards) newErrors.agreedStandards = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 8) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleSubmitApplication();
      }
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const success = await store.submitPartnerApplication({
        type: 'regional',
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        dob: formData.dob,
        phone: formData.phone,
        email: formData.email,
        location: `${formData.city}, ${formData.region}`,
        country: formData.country,
        languages: formData.languages,
        photoUrl: formData.photoUrl,
        linkedinProfile: formData.linkedinProfile,
        currentActivity: formData.currentActivity,
        currentCompany: formData.currentCompany,
        yearsExperience: formData.yearsExperience,
        managedTeams: formData.managedTeams,
        maxTeamSizeManaged: formData.maxTeamSizeManaged,
        ownedOrManagedBusiness: formData.ownedOrManagedBusiness,
        businessOwnershipExp: formData.businessOwnershipExp,
        significantAchievement: formData.significantAchievement,
        targetRegion: formData.targetRegion,
        localCommunityKnowledge: formData.localCommunityKnowledge,
        businessContactsCount: formData.businessContactsCount,
        familiarIndustries: formData.familiarIndustries,
        regionKnowledgeDesc: formData.regionKnowledgeDesc,
        whyPartner: formData.whyPartner,
        whyChooseYou: formData.whyChooseYou,
        howBuildTPNetwork: formData.howBuildTPNetwork,
        howAttractSpecialists: formData.howAttractSpecialists,
        importantLeadershipValues: formData.importantLeadershipValues,
        hoursPerWeek: formData.hoursPerWeek,
        willingToTravel: formData.willingToTravel,
        hasVehicle: formData.hasVehicle,
        readinessLevel: formData.readinessLevel,
        isSelfEmployedOrCompany: formData.isSelfEmployedOrCompany,
        willingToEstablishEntity: formData.willingToEstablishEntity,
        threeYearVision: formData.threeYearVision,
        successDefinition: formData.successDefinition,
        agreedAccurate: formData.agreedAccurate,
        agreedNoGuarantee: formData.agreedNoGuarantee,
        agreedCompetitiveProcess: formData.agreedCompetitiveProcess,
        agreedStandards: formData.agreedStandards,
      });
      if (success) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Failed to submit RP application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const stepsList = [
    { num: 1, name: 'Personal' },
    { num: 2, name: 'Experience' },
    { num: 3, name: 'Regional' },
    { num: 4, name: 'Leadership' },
    { num: 5, name: 'Availability' },
    { num: 6, name: 'Readiness' },
    { num: 7, name: 'Vision' },
    { num: 8, name: 'Declaration' },
  ];
  const industryOptions = [
    'Real Estate & Hospitality',
    'Construction & Renovation',
    'Facility Management & Cleaning',
    'Logistics & Dispatch',
    'Corporate Services & Legal',
    'Financial Services & Banking',
    'Technology & Telecom',
    'Tourism & Short-Term Rentals'
  ];
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateHome}>
            <NordBaseLogo size="md" />
            <div className="hidden sm:flex items-center space-x-2 border-l border-slate-800 pl-3">
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold rounded uppercase tracking-wider">
                Regional Partner
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!isSubmitted && (
              <div className="text-xs text-slate-400 font-medium">
                Step <span className="text-indigo-400 font-bold">{currentStep}</span> of 8
              </div>
            )}
            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        </div>
      </header>
      {/* Main Form Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {isSubmitted ? (
          /* FINAL CONFIRMATION SCREEN */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl my-8"
          >
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Thank you for your application.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Your application has been received and will be carefully reviewed by the NordBase team.
              <br />
              <br />
              Candidates who match the Regional Partner profile will be invited to the next stage of the selection process.
            </p>
            <button
              onClick={onNavigateHome}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>Return to Home</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Form Title & Subtitle Banner */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Executive Regional Application</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                NordBase Regional Partner Application
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                A strategic opportunity to represent and expand NordBase across an entire district or region of Portugal.
              </p>
            </div>
            {/* Stepper Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {stepsList.map((step) => {
                  const isActive = currentStep === step.num;
                  const isCompleted = currentStep > step.num;
                  return (
                    <div
                      key={step.num}
                      onClick={() => {
                        if (isCompleted) setCurrentStep(step.num);
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-400'
                          : isCompleted
                          ? 'bg-slate-800/80 text-emerald-400 cursor-pointer hover:bg-slate-800'
                          : 'bg-slate-950/50 text-slate-500 border border-slate-800/50'
                      }`}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-wider mb-0.5 text-slate-400">
                        Step {step.num}
                      </span>
                      <span className="text-xs font-bold truncate max-w-full">
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Step Form Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* STEP 1: PERSONAL INFORMATION */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                          <User className="w-5 h-5 text-indigo-400" />
                          <span>Step 1 – Personal Information</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Please provide your basic contact details and upload a professional portrait.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            First Name <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleTextChange('firstName', e.target.value)}
                            placeholder="e.g. Maria"
                            className={`w-full px-4 py-3 bg-slate-950 border ${
                              errors.firstName ? 'border-rose-500' : 'border-slate-800'
                            } rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Last Name <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleTextChange('lastName', e.target.value)}
                            placeholder="e.g. Santos"
                            className={`w-full px-4 py-3 bg-slate-950 border ${
                              errors.lastName ? 'border-rose-500' : 'border-slate-800'
                            } rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500`}
                          />
                        </div>
                      </div>
                      {/* Date of Birth Dropdowns */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Date of Birth <span className="text-slate-500 text-[11px] font-normal">(Day / Month / Year)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <select
                            value={dobDay}
                            onChange={(e) => handleDobChange(e.target.value, dobMonth, dobYear)}
                            className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="">Day</option>
                            {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                          <select
                            value={dobMonth}
                            onChange={(e) => handleDobChange(dobDay, e.target.value, dobYear)}
                            className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="">Month</option>
                            {[
                              { val: '01', name: 'Jan' },
                              { val: '02', name: 'Feb' },
                              { val: '03', name: 'Mar' },
                              { val: '04', name: 'Apr' },
                              { val: '05', name: 'May' },
                              { val: '06', name: 'Jun' },
                              { val: '07', name: 'Jul' },
                              { val: '08', name: 'Aug' },
                              { val: '09', name: 'Sep' },
                              { val: '10', name: 'Oct' },
                              { val: '11', name: 'Nov' },
                              { val: '12', name: 'Dec' },
                            ].map((m) => (
                              <option key={m.val} value={m.val}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                          <select
                            value={dobYear}
                            onChange={(e) => handleDobChange(dobDay, dobMonth, e.target.value)}
                            className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="">Year</option>
                            {Array.from({ length: 65 }, (_, i) => String(2008 - i)).map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {/* Geographic details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => handleTextChange('country', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">Region</label>
                          <select
                            value={formData.region}
                            onChange={(e) => {
                              const rName = e.target.value;
                              setSelectedRegionName(rName);
                              handleTextChange('region', rName);
                              const matchedRegion = PORTUGAL_GEO.find((r) => r.name === rName);
                              if (matchedRegion && matchedRegion.cities.length > 0) {
                                handleTextChange('city', matchedRegion.cities[0].name);
                              }
                            }}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            {PORTUGAL_GEO.map((reg) => (
                              <option key={reg.id} value={reg.name}>
                                {reg.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                          <select
                            value={formData.city}
                            onChange={(e) => handleTextChange('city', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            {(
                              PORTUGAL_GEO.find((r) => r.name === selectedRegionName) ||
                              PORTUGAL_GEO[0]
                            ).cities.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {/* Phone & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Mobile Phone <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleTextChange('phone', e.target.value)}
                            placeholder="+351 912 345 678"
                            className={`w-full px-4 py-3 bg-slate-950 border ${
                              errors.phone ? 'border-rose-500' : 'border-slate-800'
                            } rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500`}
                          />
                          {errors.phone && (
                            <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3.5 h-3.5" /> {typeof errors.phone === 'string' ? errors.phone : 'Please enter a valid phone number'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Email <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleTextChange('email', e.target.value)}
                            placeholder="maria.santos@example.com"
                            className={`w-full px-4 py-3 bg-slate-950 border ${
                              errors.email ? 'border-rose-500' : 'border-slate-800'
                            } rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500`}
                          />
                          {errors.email && (
                            <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3.5 h-3.5" /> {typeof errors.email === 'string' ? errors.email : 'Please enter a valid email address with "@"'}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* LinkedIn Profile */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          LinkedIn Profile <span className="text-slate-500 font-normal">(optional)</span>
                        </label>
                        <input
                          type="url"
                          value={formData.linkedinProfile}
                          onChange={(e) => handleTextChange('linkedinProfile', e.target.value)}
                          placeholder="https://www.linkedin.com/in/username"
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      {/* Upload Photo */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Upload Professional Photo
                        </label>
                        <div className="flex items-center space-x-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                          {formData.photoUrl ? (
                            <img
                              src={formData.photoUrl}
                              alt="Uploaded portrait"
                              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                              <Camera className="w-7 h-7" />
                            </div>
                          )}
                          <div className="flex-1">
                            <label className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                              <Upload className="w-3.5 h-3.5 mr-2" />
                              <span>Choose Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                              />
                            </label>
                            <p className="text-[11px] text-slate-500 mt-1">
                              JPG, PNG or WEBP up to 5MB. Clear headshot recommended.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* STEP 2: PROFESSIONAL EXPERIENCE */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                          <Briefcase className="w-5 h-5 text-indigo-400" />
                          <span>Step 2 – Professional Experience</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Tell us about your management background, business ownership, and executive record.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Current Occupation
                          </label>
                          <input
                            type="text"
                            value={formData.currentActivity}
                            onChange={(e) => handleTextChange('currentActivity', e.target.value)}
                            placeholder="e.g. Managing Director / Regional Manager"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Current Company <span className="text-slate-500 font-normal">(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={formData.currentCompany}
                            onChange={(e) => handleTextChange('currentCompany', e.target.value)}
                            placeholder="e.g. Horizon Management LDA"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      {/* Years of Professional Experience */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                          Years of Professional Experience
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {['0–5', '5–10', '10–20', '20+'].map((yr) => (
                            <button
                              key={yr}
                              type="button"
                              onClick={() => handleTextChange('yearsExperience', yr)}
                              className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer ${
                                formData.yearsExperience === yr
                                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {yr} years
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Have you managed teams? */}
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                        <label className="block text-xs font-semibold text-white">
                          Have you managed teams?
                        </label>
                        <div className="flex items-center space-x-6">
                          <label className="inline-flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name="managedTeams"
                              checked={formData.managedTeams === true}
                              onChange={() => handleTextChange('managedTeams', true)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="inline-flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name="managedTeams"
                              checked={formData.managedTeams === false}
                              onChange={() => handleTextChange('managedTeams', false)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>No</span>
                          </label>
                        </div>
                        {formData.managedTeams && (
                          <div className="pt-2">
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Maximum number of people managed
                            </label>
                            <input
                              type="text"
                              value={formData.maxTeamSizeManaged}
                              onChange={(e) => handleTextChange('maxTeamSizeManaged', e.target.value)}
                              placeholder="e.g. 15 team members, 3 managers"
                              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        )}
                      </div>
                      {/* Have you owned or managed a business? */}
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                        <label className="block text-xs font-semibold text-white">
                          Have you owned or managed a business?
                        </label>
                        <div className="flex items-center space-x-6">
                          <label className="inline-flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name="ownedOrManagedBusiness"
                              checked={formData.ownedOrManagedBusiness === true}
                              onChange={() => handleTextChange('ownedOrManagedBusiness', true)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="inline-flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name="ownedOrManagedBusiness"
                              checked={formData.ownedOrManagedBusiness === false}
                              onChange={() => handleTextChange('ownedOrManagedBusiness', false)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>No</span>
                          </label>
                        </div>
                        {formData.ownedOrManagedBusiness && (
                          <div className="pt-2">
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Describe your business experience
                            </label>
                            <textarea
                              rows={3}
                              value={formData.businessOwnershipExp}
                              onChange={(e) => handleTextChange('businessOwnershipExp', e.target.value)}
                              placeholder="Describe the company, sector, years of operation, and your primary duties..."
                              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        )}
                      </div>
                      {/* Significant achievement */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Describe your most significant professional achievement.
                        </label>
                        <textarea
                          rows={3}
                          value={formData.significantAchievement}
                          onChange={(e) => handleTextChange('significantAchievement', e.target.value)}
                          placeholder="e.g. Scaling regional sales by 150%, launching 5 new service hubs, or building a high-performing operations team..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                  {/* STEP 3: REGIONAL KNOWLEDGE */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                          <MapPin className="w-5 h-5 text-indigo-400" />
                          <span>Step 3 – Regional Knowledge</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Demonstrate your connection to local business infrastructure and market dynamics.
                        </p>
                      </div>
                      {/* Target Region */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Which region would you like to represent?
                        </label>
                        <select
                          value={formData.targetRegion}
                          onChange={(e) => handleTextChange('targetRegion', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          {PORTUGAL_GEO.map((reg) => (
                            <option key={reg.id} value={reg.name}>
                              {reg.name} District / Region
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Knowledge of local business community */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                          How well do you know the local business community?
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['Excellent', 'Good', 'Basic'].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handleTextChange('localCommunityKnowledge', lvl)}
                              className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer ${
                                formData.localCommunityKnowledge === lvl
                                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Approximate number of business contacts */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                          Approximate number of business contacts
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {['Less than 20', '20–50', '50–100', 'More than 100'].map((cnt) => (
                            <button
                              key={cnt}
                              type="button"
                              onClick={() => handleTextChange('businessContactsCount', cnt)}
                              className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer ${
                                formData.businessContactsCount === cnt
                                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {cnt}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Familiar Industries */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                          Which industries are you most familiar with? <span className="text-slate-500 font-normal">(select all that apply)</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {industryOptions.map((ind) => {
                            const selected = formData.familiarIndustries.includes(ind);
                            return (
                              <button
                                key={ind}
                                type="button"
                                onClick={() => handleIndustryToggle(ind)}
                                className={`flex items-center space-x-2.5 p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                                  selected
                                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                                    selected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'
                                  }`}
                                >
                                  {selected && <CheckCircle2 className="w-3 h-3" />}
                                </div>
                                <span>{ind}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {/* Describe knowledge of region */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Describe your knowledge of the region.
                        </label>
                        <textarea
                          rows={3}
                          value={formData.regionKnowledgeDesc}
                          onChange={(e) => handleTextChange('regionKnowledgeDesc', e.target.value)}
                          placeholder="Highlight key municipal centers, economic hubs, regional growth drivers, or existing relationships in the area..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                  {/* STEP 4: LEADERSHIP & MOTIVATION */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                          <Users className="w-5 h-5 text-indigo-400" />
                          <span>Step 4 – Leadership & Motivation</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Explain your vision for recruiting Territorial Partners and organizing regional operations.
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Why do you want to become a NordBase Regional Partner?
                        </label>
                        <textarea
                          rows={3}
                          value={formData.whyPartner}
                          onChange={(e) => handleTextChange('whyPartner', e.target.value)}
                          placeholder="Share your personal or commercial motivation for leading NordBase in this region..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Why should NordBase choose you?
                        </label>
                        <textarea
                          rows={3}
                          value={formData.whyChooseYou}
                          onChange={(e) => handleTextChange('whyChooseYou', e.target.value)}
                          placeholder="Detail your competitive advantages, network strength, or executive background..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          What values are most important when leading a regional team?
                        </label>
                        <textarea
                          rows={2}
                          value={formData.importantLeadershipValues}
                          onChange={(e) => handleTextChange('importantLeadershipValues', e.target.value)}
                          placeholder="e.g. Integrity, responsiveness, quality control, operational discipline, mutual growth..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                  {/* STEP 5: AVAILABILITY */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-indigo-400" />
                          <span>Step 5 – Availability</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Specify your time allocation, mobility, and language proficiencies.
                        </p>
                      </div>
                      {/* Hours per week */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                          Hours available per week
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            '10–20 hours/week',
                            '20–30 hours/week',
                            '30–40 hours/week',
                            'Full-time (40+)'
                          ].map((hr) => (
                            <button
                              key={hr}
                              type="button"
                              onClick={() => handleTextChange('hoursPerWeek', hr)}
                              className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer ${
                                formData.hoursPerWeek === hr
                                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {hr}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Willing to travel */}
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-white">
                            Are you willing to travel within your region?
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Visiting municipal hubs, meeting local partners, and attending trade events.
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="inline-flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name="willingToTravel"
                              checked={formData.willingToTravel === true}
                              onChange={() => handleTextChange('willingToTravel', true)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="inline-flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name="willingToTravel"
                              checked={formData.willingToTravel === false}
                              onChange={() => handleTextChange('willingToTravel', false)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>
                      {/* Transportation */}
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-white">
                            Do you have your own transportation?
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Personal or company vehicle available for regional travel.
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="inline-flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name="hasVehicle"
                              checked={formData.hasVehicle === true}
                              onChange={() => handleTextChange('hasVehicle', true)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="inline-flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name="hasVehicle"
                              checked={formData.hasVehicle === false}
                              onChange={() => handleTextChange('hasVehicle', false)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>
                      {/* Languages Spoken */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                          Languages Spoken
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {['Portuguese', 'English', 'Spanish', 'French', 'German', 'Dutch', 'Russian', 'Other'].map((lang) => {
                            const selected = formData.languages.includes(lang);
                            return (
                              <button
                                key={lang}
                                type="button"
                                onClick={() => handleLanguageToggle(lang)}
                                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                  selected
                                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <span>{lang}</span>
                                {selected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* STEP 6: BUSINESS READINESS */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                          <Building className="w-5 h-5 text-indigo-400" />
                          <span>Step 6 – Business Readiness</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Regional Partners are expected to actively develop the NordBase network in their region.
                        </p>
                      </div>
                      {/* Readiness option pills */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                          How would you describe your current readiness?
                        </label>
                        <div className="space-y-3">
                          {[
                            'I can dedicate my time to building the network.',
                            'I can dedicate my time and support local promotion activities.',
                            'I am ready to discuss long-term regional development opportunities.'
                          ].map((opt) => {
                            const isSelected = formData.readinessLevel === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleTextChange('readinessLevel', opt)}
                                className={`w-full p-4 rounded-xl border text-left text-xs font-medium transition-all flex items-start space-x-3 cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center ${
                                    isSelected ? 'bg-indigo-600 border-indigo-500' : 'border-slate-700'
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                                <span className="leading-relaxed">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {/* Self employed or company */}
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-white">
                            Are you currently self-employed or operating a registered company?
                          </div>
                          <div className="text-[11px] text-slate-400">
                            e.g. Empresário em Nome Individual (ENI) or Sociedade por Quotas (LDA).
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="inline-flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name="isSelfEmployedOrCompany"
                              checked={formData.isSelfEmployedOrCompany === true}
                              onChange={() => handleTextChange('isSelfEmployedOrCompany', true)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="inline-flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name="isSelfEmployedOrCompany"
                              checked={formData.isSelfEmployedOrCompany === false}
                              onChange={() => handleTextChange('isSelfEmployedOrCompany', false)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* STEP 7: VISION */}
                  {currentStep === 7 && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                          <Target className="w-5 h-5 text-indigo-400" />
                          <span>Step 7 – Vision</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Share your long-term perspective on market expansion and business impact.
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Where do you see NordBase in your region in three years?
                        </label>
                        <textarea
                          rows={4}
                          value={formData.threeYearVision}
                          onChange={(e) => handleTextChange('threeYearVision', e.target.value)}
                          placeholder="Describe target market penetration, municipal coverage, specialist volume, and regional reputation..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          What would success look like for you as a Regional Partner?
                        </label>
                        <textarea
                          rows={4}
                          value={formData.successDefinition}
                          onChange={(e) => handleTextChange('successDefinition', e.target.value)}
                          placeholder="e.g. Financial sustainability, leadership satisfaction, quality service delivery across all municipalities..."
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                  {/* STEP 8: DECLARATION */}
                  {currentStep === 8 && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                          <ShieldCheck className="w-5 h-5 text-indigo-400" />
                          <span>Step 8 – Declaration</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Please review and confirm the statements below to complete your submission.
                        </p>
                      </div>
                      <div className="space-y-3 bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                        {[
                          {
                            key: 'agreedAccurate',
                            label: 'I confirm that all information provided is accurate.'
                          },
                          {
                            key: 'agreedNoGuarantee',
                            label: 'I understand that submission of this application does not guarantee acceptance.'
                          },
                          {
                            key: 'agreedCompetitiveProcess',
                            label: 'I understand that Regional Partners are selected through a competitive evaluation process.'
                          },
                          {
                            key: 'agreedStandards',
                            label: 'I agree to comply with NordBase standards and operating principles.'
                          }
                        ].map((chk) => {
                          const isChecked = (formData as any)[chk.key];
                          const hasError = errors[chk.key];
                          return (
                            <label
                              key={chk.key}
                              className={`flex items-start space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                                hasError
                                  ? 'border-rose-500 bg-rose-500/10'
                                  : isChecked
                                  ? 'border-indigo-500/50 bg-indigo-500/10'
                                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleTextChange(chk.key, e.target.checked)}
                                className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                              <span className="text-xs text-slate-200 leading-relaxed font-medium">
                                {chk.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      {Object.keys(errors).length > 0 && (
                        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-2 text-rose-400 text-xs">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Please accept all declaration conditions before submitting your application.</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              {/* Step Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : currentStep === 8 ? (
                    <>
                      <span>Submit Regional Application</span>
                      <Send className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Continue to Step {currentStep + 1}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} NordBase Portugal. Executive Partner Selection Portal.</p>
      </footer>
    </div>
  );
}