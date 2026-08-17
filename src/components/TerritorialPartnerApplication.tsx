import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Upload,
  Briefcase,
  Clock,
  Car,
  Laptop,
  Wifi,
  Home,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  CheckSquare,
  Send,
  Camera,
  Layers,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import NordBaseLogo from './NordBaseLogo';
import tpHeroDeskImage from '../assets/images/tp_home_office_desk_1785156567503.jpg';
import { PORTUGAL_GEO, } from '../lib/geo';
import { CATEGORIES, CATEGORY_SPECIALTIES } from '../data';
import { validatePhone, validateEmail } from '../lib/validation';
import { store } from '../store';
interface TerritorialPartnerApplicationProps {
  onNavigateHome?: () => void;
  onOpenAuth?: () => void;
}
export default function TerritorialPartnerApplication({
  onNavigateHome,
  onOpenAuth,
}: TerritorialPartnerApplicationProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  // Form Field Validation Errors Map
  const [errors, setErrors] = useState<Record<string, string | boolean>>({});
  // Date of birth parts state for explicit English dropdowns
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
  // Cascading Region & City Selection state
  const [selectedRegionName, setSelectedRegionName] = useState<string>('Algarve');
  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    email: '',
    region: 'Algarve',
    city: 'Faro',
    country: 'Portugal',
    languages: ['Portuguese', 'English'],
    photoUrl: '',
    // Step 2: Experience
    currentActivity: '',
    yearsExperience: '2-5 years',
    hasCustomerServiceExp: true,
    hasManagementExp: false,
    hasSalesExp: false,
    hasEntrepreneurExp: false,
    experience: '',
    // Step 3: Availability & Resources
    hoursPerWeek: '20-30 hours/week',
    preferredSchedule: 'Flexible',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    hasVehicle: true,
    hasComputer: true,
    hasInternet: true,
    hasHomeOffice: true,
    // Step 4: Motivation
    whyPartner: '',
    whyChooseYou: '',
    strengths: '',
    longTermGoals: '',
    // Step 5: Local Knowledge
    selectedManageRegion: 'Algarve',
    citiesToManage: ['Faro', 'Albufeira'],
    businessKnowledgeLevel: 'High',
    existingNetwork: '',
    categoryProficiencies: ['Home Services', 'Cleaning', 'Repairs', 'Construction'],
    // Step 6: Agreements
    agreedAccurate: false,
    agreedTerms: false,
    agreedPrivacy: false,
    agreedNoGuarantee: false,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  // Available option arrays
  const languageOptions = ['Portuguese', 'English', 'Spanish', 'French', 'German', 'Russian', 'Ukrainian', 'Dutch'];
  const weekDaysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  // Current active region cities for Step 1
  const currentRegionObj = PORTUGAL_GEO.find((r) => r.name === selectedRegionName) || PORTUGAL_GEO[2]; // Default Algarve
  const currentRegionCities = currentRegionObj.cities.map((c) => c.name);
  // Current manage region cities for Step 5
  const currentManageRegionObj = PORTUGAL_GEO.find((r) => r.name === formData.selectedManageRegion) || PORTUGAL_GEO[2];
  const manageRegionCities = currentManageRegionObj.cities.map((c) => c.name);
  // Handlers
  const handleTextChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };
  const handleRegionChange = (newRegionName: string) => {
    setSelectedRegionName(newRegionName);
    const regObj = PORTUGAL_GEO.find((r) => r.name === newRegionName);
    const defaultCity = regObj?.cities[0]?.name || '';
    setFormData((prev) => ({
      ...prev,
      region: newRegionName,
      city: defaultCity,
    }));
    if (errors['region'] || errors['city']) {
      setErrors((prev) => ({ ...prev, region: false, city: false }));
    }
  };
  const toggleArrayItem = (field: string, item: string) => {
    setFormData((prev: any) => {
      const currentArr: string[] = prev[field] || [];
      if (currentArr.includes(item)) {
        return { ...prev, [field]: currentArr.filter((i) => i !== item) };
      } else {
        return { ...prev, [field]: [...currentArr, item] };
      }
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData((prev) => ({ ...prev, photoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string | boolean> = {};
    if (stepNumber === 1) {
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
      if (!formData.city.trim()) newErrors.city = true;
    } else if (stepNumber === 2) {
      if (!formData.currentActivity.trim()) newErrors.currentActivity = true;
    } else if (stepNumber === 4) {
      if (!formData.whyPartner.trim()) newErrors.whyPartner = true;
    } else if (stepNumber === 5) {
      if (!formData.citiesToManage || formData.citiesToManage.length === 0) newErrors.citiesToManage = true;
      if (!formData.categoryProficiencies || formData.categoryProficiencies.length === 0) newErrors.categoryProficiencies = true;
    } else if (stepNumber === 6) {
      if (!formData.agreedAccurate) newErrors.agreedAccurate = true;
      if (!formData.agreedTerms) newErrors.agreedTerms = true;
      if (!formData.agreedPrivacy) newErrors.agreedPrivacy = true;
      if (!formData.agreedNoGuarantee) newErrors.agreedNoGuarantee = true;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 380, behavior: 'smooth' });
      } else {
        submitApplication();
      }
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };
  const submitApplication = async () => {
    setIsSubmitting(true);
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    await store.submitPartnerApplication({
      type: 'territorial',
      fullName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob,
      phone: formData.phone,
      email: formData.email,
      location: `${formData.city} (${formData.region})`,
      country: formData.country,
      languages: formData.languages,
      photoUrl: formData.photoUrl,
      currentActivity: formData.currentActivity,
      yearsExperience: formData.yearsExperience,
      hasCustomerServiceExp: formData.hasCustomerServiceExp,
      hasManagementExp: formData.hasManagementExp,
      hasSalesExp: formData.hasSalesExp,
      hasEntrepreneurExp: formData.hasEntrepreneurExp,
      experience: formData.experience,
      hoursPerWeek: formData.hoursPerWeek,
      preferredSchedule: formData.preferredSchedule,
      availableDays: formData.availableDays,
      hasVehicle: formData.hasVehicle,
      hasComputer: formData.hasComputer,
      hasInternet: formData.hasInternet,
      hasHomeOffice: formData.hasHomeOffice,
      whyPartner: formData.whyPartner,
      whyChooseYou: formData.whyChooseYou,
      strengths: formData.strengths,
      longTermGoals: formData.longTermGoals,
      citiesToManage: formData.citiesToManage,
      businessKnowledgeLevel: formData.businessKnowledgeLevel,
      existingNetwork: formData.existingNetwork,
      categoryProficiencies: formData.categoryProficiencies,
      notes: formData.whyPartner,
    });
    setIsSubmitting(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Schema.org Job / Partner Role Structured Data
  const jobSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Territorial Partner (TP) - City Business Manager',
    description: 'Lead NordBase in your city in Portugal. Coordinate service specialists, manage client leads, and build local trade operations.',
    identifier: {
      '@type': 'PropertyValue',
      name: 'NordBase Portugal',
      value: 'TP-2026'
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: 'NordBase.pt',
      sameAs: 'https://nordbase.pt'
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'Algarve',
        addressCountry: 'PT'
      }
    },
    employmentType: 'CONTRACTOR'
  };
  return (
    <div id="tp-application-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-24">
      {/* Schema.org for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateHome}>
            <NordBaseLogo size="md" showDotPt={true} />
          </div>
          <div className="flex items-center space-x-3 sm:space-x-5">
            <button
              onClick={onNavigateHome}
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Grow with NordBase
            </button>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative pt-10 pb-12 md:pt-16 md:pb-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column Text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
                <Building2 className="w-4 h-4" />
                <span>Executive Role • Territorial Partner (TP)</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400">Territorial Partner</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Lead NordBase in your city. Build a trusted community of local professionals, coordinate customer requests and grow a sustainable local business.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Exclusive City Rights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Turnkey Operator Software</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Direct Revenue Share</span>
                </div>
              </div>
            </div>
            {/* Right Column: Home Office Setup Desk Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                <img
                  src={tpHeroDeskImage}
                  alt="Territorial Partner home office setup with large monitor displaying dispatch management software"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-950/85 backdrop-blur-md rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Territorial Management Center</h4>
                      <p className="text-[11px] sm:text-xs text-slate-400">NordBase Dispatch & Operations Console</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Main Form Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {isSubmitted ? (
          /* Final Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl my-8 space-y-6"
          >
            <div className="w-20 h-20 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Application Submitted</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Thank you for your application!
              </h2>
            </div>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Our team carefully reviews every application. If your profile matches the requirements, a NordBase representative will contact you to schedule the next stage of the selection process.
            </p>
            <div className="pt-6 border-t border-slate-800/80 flex justify-center">
              <button
                onClick={onNavigateHome}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center space-x-2 cursor-pointer"
              >
                <span>Return to Home</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Application Wizard */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            {/* Wizard Header & Progress Bar */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                    Step {currentStep} of 6
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {currentStep === 1 && 'Step 1 – Personal Information'}
                    {currentStep === 2 && 'Step 2 – Professional Experience'}
                    {currentStep === 3 && 'Step 3 – Availability & Resources'}
                    {currentStep === 4 && 'Step 4 – Motivation & Long-Term Goals'}
                    {currentStep === 5 && 'Step 5 – Local Knowledge'}
                    {currentStep === 6 && 'Step 6 – Partner Agreements'}
                  </h2>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {Math.round((currentStep / 6) * 100)}% Complete
                </div>
              </div>
              {/* Progress Line */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                  initial={{ width: '16%' }}
                  animate={{ width: `${(currentStep / 6) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              {/* Step Pills Bar */}
              <div className="grid grid-cols-6 gap-1 sm:gap-2 pt-2">
                {['Personal', 'Experience', 'Availability', 'Motivation', 'Knowledge', 'Agreement'].map(
                  (label, idx) => {
                    const stepNum = idx + 1;
                    const isActive = stepNum === currentStep;
                    const isPassed = stepNum < currentStep;
                    return (
                      <button
                        key={label}
                        onClick={() => {
                          if (stepNum < currentStep) setCurrentStep(stepNum);
                        }}
                        disabled={stepNum > currentStep}
                        className={`py-2 px-1 text-center rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : isPassed
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-slate-950/60 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <span className="hidden sm:inline">{stepNum}. </span>
                        {label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
            {/* Step Form Content */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* STEP 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          First Name <span className="text-blue-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => handleTextChange('firstName', e.target.value)}
                          placeholder="e.g. Manuel"
                          className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition-colors ${
                            errors.firstName
                              ? 'border-red-500 bg-red-950/20 text-red-100 ring-1 ring-red-500/50'
                              : 'border-slate-800 focus:border-blue-500'
                          }`}
                        />
                        {errors.firstName && (
                          <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Please enter your First Name
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Last Name <span className="text-blue-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => handleTextChange('lastName', e.target.value)}
                          placeholder="e.g. Silva"
                          className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition-colors ${
                            errors.lastName
                              ? 'border-red-500 bg-red-950/20 text-red-100 ring-1 ring-red-500/50'
                              : 'border-slate-800 focus:border-blue-500'
                          }`}
                        />
                        {errors.lastName && (
                          <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Please enter your Last Name
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Date of Birth <span className="text-slate-500 text-[11px] font-normal">(Day / Month / Year)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <select
                            value={dobDay}
                            onChange={(e) => handleDobChange(e.target.value, dobMonth, dobYear)}
                            className="w-full px-2.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
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
                            className="w-full px-2 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
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
                            className="w-full px-2.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
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
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Phone Number / WhatsApp <span className="text-blue-400">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleTextChange('phone', e.target.value)}
                          placeholder="+351 912 345 678"
                          className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition-colors ${
                            errors.phone
                              ? 'border-red-500 bg-red-950/20 text-red-100 ring-1 ring-red-500/50'
                              : 'border-slate-800 focus:border-blue-500'
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {typeof errors.phone === 'string' ? errors.phone : 'Please enter a valid phone number'}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Email Address <span className="text-blue-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleTextChange('email', e.target.value)}
                          placeholder="partner@example.com"
                          className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition-colors ${
                            errors.email
                              ? 'border-red-500 bg-red-950/20 text-red-100 ring-1 ring-red-500/50'
                              : 'border-slate-800 focus:border-blue-500'
                          }`}
                        />
                        {errors.email && (
                          <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {typeof errors.email === 'string' ? errors.email : 'Please enter your email address'}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Unified Cascaded Geographic Location Selector */}
                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-4">
                      <div className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>Primary Residence & Operating Base</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => handleTextChange('country', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">Region</label>
                          <select
                            value={selectedRegionName}
                            onChange={(e) => handleRegionChange(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                          >
                            {PORTUGAL_GEO.map((reg) => (
                              <option key={reg.id} value={reg.name}>
                                {reg.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            City / Municipality <span className="text-blue-400">*</span>
                          </label>
                          <select
                            value={formData.city}
                            onChange={(e) => handleTextChange('city', e.target.value)}
                            className={`w-full px-4 py-3 bg-slate-900 border rounded-xl text-white text-sm focus:outline-none transition-colors ${
                              errors.city
                                ? 'border-red-500 bg-red-950/20 text-red-100 ring-1 ring-red-500/50'
                                : 'border-slate-800 focus:border-blue-500'
                            }`}
                          >
                            {currentRegionCities.map((cityName) => (
                              <option key={cityName} value={cityName}>
                                {cityName} ({selectedRegionName})
                              </option>
                            ))}
                          </select>
                          {errors.city && (
                            <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3.5 h-3.5" /> Please select a city
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">Languages Spoken</label>
                      <div className="flex flex-wrap gap-2">
                        {languageOptions.map((lang) => {
                          const selected = formData.languages.includes(lang);
                          return (
                            <button
                              type="button"
                              key={lang}
                              onClick={() => toggleArrayItem('languages', lang)}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                selected
                                  ? 'bg-blue-600 text-white border-blue-500'
                                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {lang} {selected && '✓'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* Profile Photo Upload */}
                    <div className="pt-2">
                      <label className="block text-xs font-medium text-slate-300 mb-2">Upload Profile Photo</label>
                      <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Profile Preview"
                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                            <Camera className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1">
                          <label className="cursor-pointer px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold inline-flex items-center space-x-2 transition-colors">
                            <Upload className="w-4 h-4 text-blue-400" />
                            <span>Select Image File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                          <p className="text-[11px] text-slate-500 mt-1">Recommended: JPG/PNG, clear portrait photo</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* STEP 2: Experience */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Current Occupation / Business <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.currentActivity}
                        onChange={(e) => handleTextChange('currentActivity', e.target.value)}
                        placeholder="e.g. Property Manager, Dispatch Operator, Sales Manager, Entrepreneur"
                        className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition-colors ${
                          errors.currentActivity
                            ? 'border-red-500 bg-red-950/20 text-red-100 ring-1 ring-red-500/50'
                            : 'border-slate-800 focus:border-blue-500'
                        }`}
                      />
                      {errors.currentActivity && (
                        <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Please enter your current occupation
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">Years of Professional Experience</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['< 2 years', '2-5 years', '5-10 years', '10+ years'].map((expOption) => (
                          <button
                            type="button"
                            key={expOption}
                            onClick={() => handleTextChange('yearsExperience', expOption)}
                            className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                              formData.yearsExperience === expOption
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {expOption}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <label className="block text-xs font-medium text-slate-300">Key Domain Competencies</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                          <span className="text-xs text-slate-200">Customer Service Experience</span>
                          <input
                            type="checkbox"
                            checked={formData.hasCustomerServiceExp}
                            onChange={(e) => handleTextChange('hasCustomerServiceExp', e.target.checked)}
                            className="w-4 h-4 accent-blue-600 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                          <span className="text-xs text-slate-200">Management & Leadership</span>
                          <input
                            type="checkbox"
                            checked={formData.hasManagementExp}
                            onChange={(e) => handleTextChange('hasManagementExp', e.target.checked)}
                            className="w-4 h-4 accent-blue-600 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                          <span className="text-xs text-slate-200">Sales & Lead Acquisition</span>
                          <input
                            type="checkbox"
                            checked={formData.hasSalesExp}
                            onChange={(e) => handleTextChange('hasSalesExp', e.target.checked)}
                            className="w-4 h-4 accent-blue-600 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                          <span className="text-xs text-slate-200">Entrepreneurship & Business Ownership</span>
                          <input
                            type="checkbox"
                            checked={formData.hasEntrepreneurExp}
                            onChange={(e) => handleTextChange('hasEntrepreneurExp', e.target.checked)}
                            className="w-4 h-4 accent-blue-600 rounded"
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Describe your professional background
                      </label>
                      <textarea
                        rows={4}
                        value={formData.experience}
                        onChange={(e) => handleTextChange('experience', e.target.value)}
                        placeholder="Provide details regarding your previous management roles, companies you've built, or service coordination experience..."
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </motion.div>
                )}
                {/* STEP 3: Availability & Resources */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Hours Available per Week</label>
                        <select
                          value={formData.hoursPerWeek}
                          onChange={(e) => handleTextChange('hoursPerWeek', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value="10-20 hours/week">10 - 20 hours / week</option>
                          <option value="20-30 hours/week">20 - 30 hours / week</option>
                          <option value="30-40 hours/week">30 - 40 hours / week</option>
                          <option value="40+ hours (Full Time)">40+ hours (Full Time Dedication)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Working Schedule</label>
                        <select
                          value={formData.preferredSchedule}
                          onChange={(e) => handleTextChange('preferredSchedule', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value="Flexible">Flexible Schedule</option>
                          <option value="Mornings">Mornings & Daytime</option>
                          <option value="Afternoons">Afternoons & Evenings</option>
                          <option value="Full-time Standard">Standard Business Hours</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">Available Weekdays</label>
                      <div className="flex flex-wrap gap-2">
                        {weekDaysList.map((day) => {
                          const selected = formData.availableDays.includes(day);
                          return (
                            <button
                              type="button"
                              key={day}
                              onClick={() => toggleArrayItem('availableDays', day)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                selected
                                  ? 'bg-blue-600 text-white border-blue-500'
                                  : 'bg-slate-950 text-slate-400 border-slate-800'
                              }`}
                            >
                              {day} {selected && '✓'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <label className="block text-xs font-medium text-slate-300">Technical & Operational Equipment</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                          <div className="flex items-center space-x-2.5 text-xs text-slate-200">
                            <Car className="w-4 h-4 text-blue-400" />
                            <span>Own Vehicle</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.hasVehicle}
                            onChange={(e) => handleTextChange('hasVehicle', e.target.checked)}
                            className="w-4 h-4 accent-blue-600 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                          <div className="flex items-center space-x-2.5 text-xs text-slate-200">
                            <Laptop className="w-4 h-4 text-blue-400" />
                            <span>Computer / Laptop</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.hasComputer}
                            onChange={(e) => handleTextChange('hasComputer', e.target.checked)}
                            className="w-4 h-4 accent-blue-600 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                          <div className="flex items-center space-x-2.5 text-xs text-slate-200">
                            <Wifi className="w-4 h-4 text-blue-400" />
                            <span>Stable High-Speed Internet</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.hasInternet}
                            onChange={(e) => handleTextChange('hasInternet', e.target.checked)}
                            className="w-4 h-4 accent-blue-600 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                          <div className="flex items-center space-x-2.5 text-xs text-slate-200">
                            <Home className="w-4 h-4 text-blue-400" />
                            <span>Dedicated Home Office / Workspace</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.hasHomeOffice}
                            onChange={(e) => handleTextChange('hasHomeOffice', e.target.checked)}
                            className="w-4 h-4 accent-blue-600 rounded"
                          />
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* STEP 4: Motivation & Long-Term Goals */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Why do you want to become a Territorial Partner? <span className="text-blue-400">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formData.whyPartner}
                        onChange={(e) => handleTextChange('whyPartner', e.target.value)}
                        placeholder="Explain your motivation for building NordBase in your city..."
                        className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition-colors ${
                          errors.whyPartner
                            ? 'border-red-500 bg-red-950/20 text-red-100 ring-1 ring-red-500/50'
                            : 'border-slate-800 focus:border-blue-500'
                        }`}
                      />
                      {errors.whyPartner && (
                        <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Please enter your motivation
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Why should NordBase choose you?
                      </label>
                      <textarea
                        rows={3}
                        value={formData.whyChooseYou}
                        onChange={(e) => handleTextChange('whyChooseYou', e.target.value)}
                        placeholder="Detail your leadership qualities, track record, or local reputation..."
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        What strengths will you bring to your city?
                      </label>
                      <textarea
                        rows={3}
                        value={formData.strengths}
                        onChange={(e) => handleTextChange('strengths', e.target.value)}
                        placeholder="e.g. Connections with local trade master pros, fluency in multiple languages, strong dispatch discipline..."
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    {/* Simple text input field for Long-Term Goals */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        What are your long-term goals with NordBase?
                      </label>
                      <input
                        type="text"
                        value={formData.longTermGoals}
                        onChange={(e) => handleTextChange('longTermGoals', e.target.value)}
                        placeholder="e.g. Scale to 50+ active local trade pros and achieve €10k+ monthly dispatch volume"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </motion.div>
                )}
                {/* STEP 5: Local Knowledge */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Cities Selection by Region */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <label className="block text-xs font-medium text-slate-300">
                          Cities / Municipalities You Can Manage <span className="text-blue-400">*</span>
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] text-slate-400">Filter Region:</span>
                          <select
                            value={formData.selectedManageRegion}
                            onChange={(e) => handleTextChange('selectedManageRegion', e.target.value)}
                            className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-blue-400 focus:outline-none"
                          >
                            {PORTUGAL_GEO.map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className={`p-3 bg-slate-950 border rounded-2xl max-h-48 overflow-y-auto ${
                        errors.citiesToManage ? 'border-red-500 bg-red-950/20' : 'border-slate-800'
                      }`}>
                        <div className="flex flex-wrap gap-2">
                          {manageRegionCities.map((cityName) => {
                            const selected = formData.citiesToManage.includes(cityName);
                            return (
                              <button
                                type="button"
                                key={cityName}
                                onClick={() => toggleArrayItem('citiesToManage', cityName)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                  selected
                                    ? 'bg-blue-600 text-white border-blue-500'
                                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                {cityName} {selected && '✓'}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {errors.citiesToManage && (
                        <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Please select at least one city you can manage
                        </p>
                      )}
                      {formData.citiesToManage.length > 0 && (
                        <div className="text-[11px] text-slate-400 mt-1.5">
                          Selected ({formData.citiesToManage.length}): {formData.citiesToManage.join(', ')}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Knowledge of Local Businesses
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['Low', 'Medium', 'High', 'Expert'].map((level) => (
                          <button
                            type="button"
                            key={level}
                            onClick={() => handleTextChange('businessKnowledgeLevel', level)}
                            className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                              formData.businessKnowledgeLevel === level
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Existing Professional Network
                      </label>
                      <textarea
                        rows={3}
                        value={formData.existingNetwork}
                        onChange={(e) => handleTextChange('existingNetwork', e.target.value)}
                        placeholder="Do you already know local plumbers, electricians, property managers or expat communities?"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    {/* Unified Site Categories Grid */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Local Service Categories You Understand Best <span className="text-blue-400">*</span>
                      </label>
                      <p className="text-[11px] text-slate-400 mb-3">
                        Matches NordBase's 12 core operational service divisions in Portugal:
                      </p>
                      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-1 ${
                        errors.categoryProficiencies ? 'p-3 bg-red-950/20 border border-red-500 rounded-2xl' : ''
                      }`}>
                        {CATEGORIES.map((cat) => {
                          const categoryName = cat.id;
                          const selected = formData.categoryProficiencies.includes(categoryName);
                          const subList = CATEGORY_SPECIALTIES[categoryName] || [];
                          return (
                            <button
                              type="button"
                              key={categoryName}
                              onClick={() => toggleArrayItem('categoryProficiencies', categoryName)}
                              className={`p-3.5 rounded-2xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                                selected
                                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-bold text-slate-100">{categoryName}</span>
                                {selected ? (
                                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-slate-700" />
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 line-clamp-1">
                                {subList.slice(0, 4).join(', ')}...
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.categoryProficiencies && (
                        <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-2">
                          <AlertCircle className="w-3.5 h-3.5" /> Please select at least one service category
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
                {/* STEP 6: Agreement */}
                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-xs text-blue-300 leading-relaxed">
                      <p className="font-semibold text-white mb-1">Final Step – Application Confirmation</p>
                      By submitting this form, you apply for a Territorial Partner (TP) leadership role within NordBase in Portugal. Your information will be reviewed by our National Expansion Team.
                    </div>
                    <div className="space-y-3 pt-2">
                      <label className={`flex items-start space-x-3 p-4 bg-slate-950 border rounded-2xl cursor-pointer hover:border-slate-700 transition-colors ${
                        errors.agreedAccurate ? 'border-red-500 bg-red-950/20' : 'border-slate-800'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.agreedAccurate}
                          onChange={(e) => handleTextChange('agreedAccurate', e.target.checked)}
                          className="w-4 h-4 mt-0.5 accent-blue-600 rounded"
                        />
                        <span className="text-xs text-slate-300 leading-normal">
                          I confirm that the information provided in this application is accurate and complete.
                        </span>
                      </label>
                      <label className={`flex items-start space-x-3 p-4 bg-slate-950 border rounded-2xl cursor-pointer hover:border-slate-700 transition-colors ${
                        errors.agreedTerms ? 'border-red-500 bg-red-950/20' : 'border-slate-800'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.agreedTerms}
                          onChange={(e) => handleTextChange('agreedTerms', e.target.checked)}
                          className="w-4 h-4 mt-0.5 accent-blue-600 rounded"
                        />
                        <span className="text-xs text-slate-300 leading-normal">
                          I agree to the NordBase Partner Agreement and territory operating framework.
                        </span>
                      </label>
                      <label className={`flex items-start space-x-3 p-4 bg-slate-950 border rounded-2xl cursor-pointer hover:border-slate-700 transition-colors ${
                        errors.agreedPrivacy ? 'border-red-500 bg-red-950/20' : 'border-slate-800'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.agreedPrivacy}
                          onChange={(e) => handleTextChange('agreedPrivacy', e.target.checked)}
                          className="w-4 h-4 mt-0.5 accent-blue-600 rounded"
                        />
                        <span className="text-xs text-slate-300 leading-normal">
                          I agree to the Privacy Policy regarding the processing of candidate data.
                        </span>
                      </label>
                      <label className={`flex items-start space-x-3 p-4 bg-slate-950 border rounded-2xl cursor-pointer hover:border-slate-700 transition-colors ${
                        errors.agreedNoGuarantee ? 'border-red-500 bg-red-950/20' : 'border-slate-800'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.agreedNoGuarantee}
                          onChange={(e) => handleTextChange('agreedNoGuarantee', e.target.checked)}
                          className="w-4 h-4 mt-0.5 accent-blue-600 rounded"
                        />
                        <span className="text-xs text-slate-300 leading-normal">
                          I understand that submission of this application does not guarantee acceptance or exclusive assignment.
                        </span>
                      </label>
                      {Object.keys(errors).length > 0 && (
                        <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 pt-1">
                          <AlertCircle className="w-4 h-4" /> Please confirm all required checkboxes above to proceed.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Form Navigation Controls */}
              <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </button>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : currentStep === 6 ? (
                    <>
                      <span>Submit Application</span>
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
            </form>
          </div>
        )}
      </main>
    </div>
  );
}