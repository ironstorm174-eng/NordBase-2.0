/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AITranslatedMessage } from './AITranslatedMessage';
import { AIMessagePolisher } from './AIMessagePolisher';
import { Job, Specialist, ServiceCategory, AuthUser, SpecialistStatus, SpecialtyWithLevel } from '../types';
import { CATEGORIES, CATEGORY_SPECIALTIES } from '../data';
import { store } from '../store';
import SpecialistOnboarding from './SpecialistOnboarding';
import MarketplaceSubscription from './MarketplaceSubscription';
import MarketplaceServicesManager from './MarketplaceServicesManager';
import Academy from './Academy';
import SpecialistWelcomeNotice from './SpecialistWelcomeNotice';

import { LocationSearchInput } from './LocationSearchInput';
import { uploadImage } from '../utils/upload';
import { canViewChat } from '../lib/permissions';
import { getWhatsAppUrl, cleanPhoneForWhatsApp } from '../utils/whatsapp';
import {
  Droplet,
  Zap,
  Hammer,
  Sparkles,
  Flower,
  Truck,
  Heart,
  Layers,
  Utensils,
  BookOpen,
  HelpCircle,
  MapPin,
  Clock,
  Lock,
  Unlock,
  Coins,
  Phone,
  MessageSquare,
  Send,
  PlusCircle,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Home,
  Wind,
  Waves,
  Building,
  FileText,
  LogOut,
  Bell,
  Ticket,
  Paperclip,
  Wrench,
  Navigation,
  Briefcase,
  CheckCircle,
  CreditCard,
  User,
  Check,
  Plus,
  Trash,
  Upload,
  UploadCloud,
  Camera,
  X,
  GraduationCap,
  Calendar, LayoutList, ShieldCheck } from 'lucide-react';
interface SpecialistDashboardProps {
  specialists: Specialist[];
  jobs: Job[];
  activeSpecialistId: string;
  onExpressInterest: (jobId: string, specialistId: string) => boolean | Promise<boolean>;
  onUnlockJob: (jobId: string, specialistId: string) => boolean | Promise<boolean>;
  onTopupSpecialist: (specialistId: string, amount: number) => void;
  onAddMessage: (
    jobId: string,
    sender: 'specialist',
    senderName: string,
    content: string,
    channel?: 'operator_specialist' | 'customer_specialist',
    attachmentUrl?: string,
    attachmentName?: string
  ) => void;
  onCreateSpecialist: (
    name: string,
    phone: string,
    category: ServiceCategory,
    city: string,
    categories?: ServiceCategory[],
    languages?: { language: string; level: 'basic' | 'conversational' | 'native' }[],
    tradeSkillLevel?: 'amateur' | 'pro' | 'expert',
    skillsDescription?: string,
    photoUrl?: string,
    verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[]
  ) => void;
  onSelectSpecialist: (id: string) => void;
  currentUser?: AuthUser | null;
  onUpdateUser?: (updated: AuthUser) => void;
  onLogout?: () => void;
}
export default function SpecialistDashboard({
  specialists,
  jobs,
  activeSpecialistId,
  onExpressInterest,
  onUnlockJob,
  onTopupSpecialist,
  onAddMessage,
  onCreateSpecialist,
  onSelectSpecialist,
  currentUser,
  onUpdateUser,
  onLogout,
}: SpecialistDashboardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  // Navigation tabs for Specialist view
  const [activeTab, setActiveTab] = useState<'board' | 'unlocked' | 'profile' | 'services' | 'support' | 'notifications' | 'academy'>('board');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [specialistChatChannel, setSpecialistChatChannel] = useState<'operator_specialist' | 'customer_specialist'>('operator_specialist');
  const [specialistChatUploading, setSpecialistChatUploading] = useState(false);
  // Stripe Checkout Simulation states
  const [checkoutJobId, setCheckoutJobId] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [checkoutProgressText, setCheckoutProgressText] = useState('');
  const [checkoutCardNumber, setCheckoutCardNumber] = useState('4242 4242 4242 4242');
  const [checkoutExpiry, setCheckoutExpiry] = useState('12/28');
  const [checkoutCvc, setCheckoutCvc] = useState('123');
  const [checkoutName, setCheckoutName] = useState('');
  // Support desk state variables
  const [supportCategory, setSupportCategory] = useState<'Lead Refund' | 'Payments' | 'Technical Issue' | 'Account Issue'>('Lead Refund');
  const [supportTitle, setSupportTitle] = useState('');
  const [supportDesc, setSupportDesc] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  // "My Profile" Edit states
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileWhatsApp, setProfileWhatsApp] = useState(currentUser?.whatsapp || currentUser?.phone || '');
  const [profileCity, setProfileCity] = useState(currentUser?.city || 'Portimão');
  const [profileCategories, setProfileCategories] = useState<ServiceCategory[]>(currentUser?.categories || []);
  const [profileTradeSkillLevel, setProfileTradeSkillLevel] = useState<'amateur' | 'pro' | 'expert'>(currentUser?.tradeSkillLevel || 'pro');
  const [profileSkillsDescription, setProfileSkillsDescription] = useState(currentUser?.skillsDescription || '');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(currentUser?.photoUrl || '');
  const [profileLanguages, setProfileLanguages] = useState<{ language: string; level: 'basic' | 'conversational' | 'native' }[]>(currentUser?.languages || [{ language: 'English', level: 'conversational' }]);
  const [profileDocuments, setProfileDocuments] = useState<{ type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[]>(currentUser?.verificationDocuments || []);
  const [profileIsUploading, setProfileIsUploading] = useState<string | null>(null);
  const [profileSpecialtiesWithLevels, setProfileSpecialtiesWithLevels] = useState<SpecialtyWithLevel[]>(currentUser?.specialtiesWithLevels || []);
  const [customLanguageInput, setCustomLanguageInput] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveStatus, setProfileSaveStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  // Form to create a specialist profile
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecCountryCode, setNewSpecCountryCode] = useState('+351');
  const [newSpecLocalPhone, setNewSpecLocalPhone] = useState('');
  const [newSpecCategory, setNewSpecCategory] = useState<ServiceCategory>('Home Services');
  const [newSpecCity, setNewSpecCity] = useState('Portimão');
  // Error/Success state alerts
  const [alertMsg, setAlertMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const handleProfileFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'passport' | 'id_card' | 'drivers_license') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert('File exceeds the limit. Please select a file smaller than 15MB.');
      return;
    }
    setProfileIsUploading(type);
    
    try {
      const uploadedUrl = await uploadImage(file);
      
      if (type === 'photo') {
        setProfilePhotoUrl(uploadedUrl);
        if (currentUser?.id && onUpdateUser) {
          onUpdateUser({ ...currentUser, photoUrl: uploadedUrl });
          fetch('/api/user/update-photo', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentUser?.token || ''}`
            },
            body: JSON.stringify({ userId: currentUser.id, photoUrl: uploadedUrl })
          }).catch(err => console.error('Error updating photo in DB:', err));
        }
      } else {
        const baseName = file.name.replace(/\.[^/.]+$/, '') || 'document';
        const normalizedDocName = `${baseName}.jpg`;
        setProfileDocuments(prev => {
          const filtered = prev.filter(d => d.type !== type);
          return [...filtered, { type, name: normalizedDocName, url: uploadedUrl }];
        });
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(`File upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setProfileIsUploading(null);
    }
  };
  React.useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
      setProfileCity(currentUser.city || 'Portimão');
      setProfileCategories(currentUser.categories || []);
      setProfileTradeSkillLevel(currentUser.tradeSkillLevel || 'pro');
      setProfileSkillsDescription(currentUser.skillsDescription || '');
      setProfilePhotoUrl(currentUser.photoUrl || '');
      setProfileLanguages(currentUser.languages || [{ language: 'English', level: 'conversational' }]);
      setProfileDocuments(currentUser.verificationDocuments || []);
      setProfileSpecialtiesWithLevels(currentUser.specialtiesWithLevels || []);
    }
  }, [currentUser?.id]);
  // Synchronize profileCategories whenever profileSpecialtiesWithLevels changes
  React.useEffect(() => {
    const cats = new Set<ServiceCategory>();
    profileSpecialtiesWithLevels.forEach(s => {
      for (const [mainCat, subs] of Object.entries(CATEGORY_SPECIALTIES)) {
        if (subs.includes(s.specialty)) {
          cats.add(mainCat as ServiceCategory);
          break;
        }
      }
    });
    setProfileCategories(Array.from(cats));
  }, [profileSpecialtiesWithLevels]);
  // Safety guard to prevent white screen crashes
  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#030712] text-slate-400">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
        <p>Carregando perfil...</p>
      </div>
    );
  }
  const handleProfileLanguageToggle = (lang: string) => {
    const exists = profileLanguages.some(l => l.language === lang);
    if (exists) {
      setProfileLanguages(profileLanguages.filter(l => l.language !== lang));
    } else {
      setProfileLanguages([...profileLanguages, { language: lang, level: 'conversational' }]);
    }
  };
  const handleProfileLanguageLevelChange = (lang: string, level: 'basic' | 'conversational' | 'native') => {
    setProfileLanguages(profileLanguages.map(l => {
      if (l.language === lang) {
        return { ...l, level };
      }
      return l;
    }));
  };
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !onUpdateUser) return;
    if (profileSpecialtiesWithLevels.length === 0) {
      setProfileSaveStatus({ type: 'error', text: 'Please add at least one specialty and mastery level.' });
      return;
    }
    setIsSavingProfile(true);
    setProfileSaveStatus(null);
    const derivedCategories = profileCategories.length > 0 
      ? profileCategories 
      : (profileSpecialtiesWithLevels.length > 0 
          ? Array.from(new Set(profileSpecialtiesWithLevels.map(s => s.category))) 
          : ['Home Services']);
    const derivedCategory = profileCategories[0] || derivedCategories[0] || 'Home Services';
    const newSpecialistStatus: SpecialistStatus = currentUser?.specialistStatus === 'approved' ? 'approved' : 'pending_review';
    const updatedUser: AuthUser = {
      ...currentUser,
      name: profileName || currentUser.name || 'Specialist',
      phone: profilePhone || currentUser.phone || '',
      whatsapp: profileWhatsApp || profilePhone || currentUser.whatsapp || '',
      city: profileCity || currentUser.city || 'Faro',
      category: derivedCategory,
      categories: derivedCategories,
      tradeSkillLevel: profileTradeSkillLevel,
      skillsDescription: profileSkillsDescription,
      photoUrl: profilePhotoUrl,
      languages: profileLanguages,
      verificationDocuments: profileDocuments,
      specialtiesWithLevels: profileSpecialtiesWithLevels,
      specialistStatus: newSpecialistStatus
    };
    // Always update local state first so user changes are never lost
    onUpdateUser(updatedUser);
    store.onboardUser(
      currentUser.id,
      'specialist',
      updatedUser.name,
      updatedUser.phone,
      updatedUser.city,
      updatedUser.category,
      updatedUser.categories,
      updatedUser.languages,
      updatedUser.tradeSkillLevel,
      updatedUser.skillsDescription,
      updatedUser.photoUrl,
      updatedUser.verificationDocuments,
      updatedUser.specialtiesWithLevels
    );
    if ((newSpecialistStatus as string) === 'pending_review') {
      store.requestVerification(currentUser.id);
    }
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token || ''}`
        },
        body: JSON.stringify({
          userId: currentUser.id,
          role: 'specialist',
          name: profileName || currentUser.name || 'Specialist',
          phone: profilePhone || currentUser.phone || '',
          city: profileCity || currentUser.city || 'Faro',
          category: derivedCategory,
          categories: derivedCategories,
          languages: profileLanguages,
          tradeSkillLevel: profileTradeSkillLevel,
          skillsDescription: profileSkillsDescription,
          photoUrl: profilePhotoUrl,
          verificationDocuments: profileDocuments,
          specialtiesWithLevels: profileSpecialtiesWithLevels
        })
      });
      const tpMessageText = `Your profile and documents have been saved successfully! Welcome to NordBase — your local Territorial Partner (TP) for ${profileCity || 'Algarve'} will reach out to you shortly via phone or WhatsApp to verify your account and help you activate order dispatch. We are happy to have you on board!`;
      if (res.ok) {
        setAlertMsg({ type: 'success', text: tpMessageText });
        setProfileSaveStatus({ 
          type: 'success', 
          text: tpMessageText 
        });
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn('Backend onboard save status:', res.status, errData);
        setAlertMsg({ type: 'success', text: tpMessageText });
        setProfileSaveStatus({ 
          type: 'success', 
          text: tpMessageText 
        });
      }
    } catch (err) {
      console.error('Error saving profile to server:', err);
      const tpMessageText = `Your profile and documents have been saved successfully! Welcome to NordBase — your local Territorial Partner (TP) for ${profileCity || 'Algarve'} will reach out to you shortly via phone or WhatsApp to verify your account and help you activate order dispatch. We are happy to have you on board!`;
      setAlertMsg({ type: 'success', text: tpMessageText });
      setProfileSaveStatus({ 
        type: 'success', 
        text: tpMessageText 
      });
    } finally {
      setIsSavingProfile(false);
      // Keep profileSaveStatus visible so the user can read, think, and manually dismiss it.
      setTimeout(() => setAlertMsg(null), 5000);
    }
  };
  // Handle Onboarding Completion
  const handleOnboardingComplete = (data: any) => {
    const isMarketplace = data.categories.some((c: any) => {
      const name = typeof c === 'string' ? c : c.name;
      return ['Care', 'Lessons', 'Business'].includes(name);
    });
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        phone: data.phone || currentUser.phone,
        category: (data.categories?.[0] || currentUser.category) as ServiceCategory,
        categories: data.categories || [currentUser.category],
        city: data.city || currentUser.city,
        specialistStatus: (currentUser.specialistStatus === 'approved' ? 'approved' : 'pending_review') as SpecialistStatus,
        isNewUser: false,
        languages: data.languages || currentUser.languages,
        tradeSkillLevel: data.tradeSkillLevel || currentUser.tradeSkillLevel,
        skillsDescription: data.skillsDescription || currentUser.skillsDescription,
        photoUrl: data.photoUrl || currentUser.photoUrl,
        verificationDocuments: data.verificationDocuments || currentUser.verificationDocuments,
        isMarketplaceSpecialist: isMarketplace
      };
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      // Ensure store also updates and persists state immediately
      store.onboardUser(
        currentUser.id,
        'specialist',
        data.name || currentUser.name,
        data.phone || currentUser.phone,
        data.city || currentUser.city,
        (data.categories?.[0] || currentUser.category) as ServiceCategory,
        data.categories || [currentUser.category],
        data.languages || currentUser.languages,
        data.tradeSkillLevel || currentUser.tradeSkillLevel,
        data.skillsDescription || currentUser.skillsDescription,
        data.photoUrl || currentUser.photoUrl,
        data.verificationDocuments || currentUser.verificationDocuments,
        data.specialtiesWithLevels || currentUser.specialtiesWithLevels
      );
    }
  };
  // If new user, show Onboarding
  if (currentUser && (currentUser.isNewUser || currentUser.specialistStatus === 'pending_details')) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030712] text-slate-100 overflow-y-auto">
        <SpecialistOnboarding 
          currentUser={currentUser} 
          onComplete={handleOnboardingComplete}
          onLogout={() => onLogout?.()}
        />
      </div>
    );
  }
  // If it's a marketplace specialist and they need to subscribe
  if (currentUser && currentUser.isMarketplaceSpecialist && (!currentUser.subscriptionPlan || currentUser.subscriptionStatus !== 'active')) {
    return (
      <div className="absolute inset-0 z-50 bg-[#030712] text-slate-100 flex flex-col font-sans" id="specialist-subscription-layout">
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-white">NordBase<span className="text-cyan-500">Marketplace</span></span>
          </div>
          <button 
            onClick={() => onLogout?.()}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          <MarketplaceSubscription 
            currentUser={currentUser}
            onActivate={(plan) => {
              store.activateSubscription(currentUser.id, plan);
              // Optimistically update the UI user
              if (onUpdateUser) {
                onUpdateUser({
                  ...currentUser,
                  subscriptionPlan: plan,
                  subscriptionStatus: 'active'
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
  // Active Specialist profile
  const activeSpecialist: Specialist = specialists.find((s) => s.id === activeSpecialistId) ||
    specialists.find((s) => s.id === currentUser?.id || (s.phone && currentUser?.phone && s.phone === currentUser.phone)) ||
    specialists[0] ||
    {
      id: currentUser?.id || 'spec-temp',
      name: currentUser?.name || 'Specialist',
      phone: currentUser?.phone || '',
      category: currentUser?.category || 'Home Services',
      categories: currentUser?.categories || ['Home Services'],
      city: currentUser?.city || 'Portimão',
      balance: 100,
      unlockedJobs: [],
      status: (currentUser?.specialistStatus as any) || 'new',
      languages: currentUser?.languages || [],
      tradeSkillLevel: currentUser?.tradeSkillLevel || 'pro',
      skillsDescription: currentUser?.skillsDescription || '',
      photoUrl: currentUser?.photoUrl || '',
      verificationDocuments: currentUser?.verificationDocuments || [],
      specialtiesWithLevels: currentUser?.specialtiesWithLevels || []
    };
  const isVerifiedSpecialist = currentUser?.specialistStatus === 'approved' || activeSpecialist?.status === 'approved';

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecName || !newSpecLocalPhone) return;
    const fullPhone = `${newSpecCountryCode} ${newSpecLocalPhone}`;
    onCreateSpecialist(newSpecName, fullPhone, newSpecCategory, newSpecCity);
    setNewSpecName('');
    setNewSpecLocalPhone('');
    setAlertMsg({ type: 'success', text: `Profile for ${newSpecName} has been successfully created!` });
    setActiveTab('board');
  };
  const handleExpressInterestClick = async (jobId: string) => {
    if (!activeSpecialist) return;
    const successPromise = onExpressInterest(jobId, activeSpecialist.id);
    const success = successPromise instanceof Promise ? await successPromise : successPromise;
    if (success) {
      setAlertMsg({ type: 'success', text: 'You have expressed interest! Waiting for the Territory Partner to select you.' });
    } else {
      setAlertMsg({ type: 'error', text: 'Failed to express interest.' });
    }
    setTimeout(() => setAlertMsg(null), 5000);
  };
  const handleUnlockClick = (jobId: string) => {
    if (!activeSpecialist) return;
    setCheckoutJobId(jobId);
    setCheckoutStep('idle');
    setCheckoutName(activeSpecialist.name);
  };
  const handleCompleteLeadClick = async (jobId: string) => {
    try {
      await store.confirmSpecialistCompletion(jobId);
      setAlertMsg({
        type: 'success',
        text: t('spec.inline_Confirmationrec_1', 'Confirmation recorded: Work performed, payment received, no claims.')
      });
    } catch (err) {
      console.error(err);
      setAlertMsg({ type: 'error', text: 'Failed to confirm job completion.' });
    }
    setTimeout(() => setAlertMsg(null), 5000);
  };
  const handleSendMessage = (e: React.FormEvent, jobId: string) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeSpecialist) return;
    onAddMessage(jobId, 'specialist', activeSpecialist.name || 'Specialist', typedMessage, specialistChatChannel);
    setTypedMessage('');
  };
  const handleSpecialistChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, jobId: string) => {
    const file = e.target.files?.[0];
    if (!file || !activeSpecialist) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File exceeds the 10MB limit. Please select a smaller file.');
      return;
    }
    setSpecialistChatUploading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      onAddMessage(
        jobId,
        'specialist',
        activeSpecialist.name || 'Specialist',
        `Shared a file: ${file.name}`,
        specialistChatChannel,
        uploadedUrl,
        file.name
      );
    } catch (err: any) {
      console.error('Chat upload failed:', err);
      alert(`File upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setSpecialistChatUploading(false);
    }
  };
  // Helper to match trade icons
  const getCategoryIcon = (category: ServiceCategory, className = "w-5 h-5 text-slate-300") => {
    const found = CATEGORIES.find((c) => c.id === category);
    const iconName = found ? found.iconName : 'HelpCircle';
    switch (iconName) {
      case 'Droplet': return <Droplet className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Hammer': return <Hammer className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Flower': return <Flower className={className} />;
      case 'Truck': return <Truck className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Utensils': return <Utensils className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Home': return <Home className={className} />;
      case 'Wind': return <Wind className={className} />;
      case 'Waves': return <Waves className={className} />;
      case 'Building': return <Building className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      case 'Navigation': return <Navigation className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      default: return <HelpCircle className={className} />;
    }
  };
  // Filter jobs
  const availableDispatchingJobs = jobs.filter(
    (job) => 
      (job.status === 'offered' && job.offeredSpecialistIds?.includes(activeSpecialist?.id || '')) ||
      (job.status === 'specialist_selected' && job.unlockedBySpecialistId === activeSpecialist?.id)
  );
  const unlockedJobs = jobs.filter(
    (job) => job.unlockedBySpecialistId === activeSpecialist?.id
  );
  const storeState = store.getState();
  const allNotifications = storeState.notifications || [];
  const specNotifications = allNotifications.filter(n => n.userId === activeSpecialist?.id || n.userId === currentUser?.id);
  const unreadCount = specNotifications.filter(n => !n.read).length;
  const allTickets = storeState.supportTickets || [];
  const specTickets = allTickets.filter(t => t.userId === activeSpecialist?.id || t.userId === currentUser?.id);
  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="specialist-dashboard-container">
      
      {/* Premium Text-Only Brand Header */}
      <div className="text-center py-6 md:py-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-3 duration-350" id="specialist-portal-header">
        <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight leading-tight">
          {t('spec.inline_SpecialistDashb_2', 'Specialist Dashboard')}
        </h1>
      </div>
      {/* Alert Banner */}
      {alertMsg && (
        <div
          id="specialist-alert-message"
          className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
            alertMsg.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20 animate-shake'
          }`}
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{alertMsg.text}</span>
        </div>
      )}
      {/* Pending Verification Notice Banner */}
      {(currentUser?.specialistStatus === 'pending_review' || currentUser?.specialistStatus === 'pending' || (activeSpecialist && (activeSpecialist.status === 'pending_review' || activeSpecialist.status === 'new'))) && (
        <div className="p-5 bg-gradient-to-r from-amber-950/80 via-amber-900/40 to-slate-950 border-2 border-amber-500/40 rounded-2xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg animate-pulse shrink-0">
              ⏳
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300 font-display flex items-center gap-2">
                <span>{t('spec.verification_pending_title', 'Verification Under Review')}</span>
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold rounded-full uppercase">
                  {t('spec.pending_review', 'Pending TP Audit')}
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {t('spec.verification_pending_desc', 'Your profile and ID documents have been submitted to your Regional Territory Partner. Contact your TP via WhatsApp if you need immediate activation.')}
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppUrl(
              currentUser?.whatsapp || currentUser?.phone || '+351 912 888 777',
              `Hello Territory Partner! I registered as a specialist (${currentUser?.name}) in ${currentUser?.city || 'Algarve'} and submitted my profile for verification. Could you please review my profile?`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all shrink-0 flex items-center gap-2 border border-emerald-400/30 cursor-pointer hover:scale-105"
            title="Open WhatsApp with Territory Partner"
          >
            <span>💬 {t('spec.contact_tp_whatsapp', 'Contact TP via WhatsApp')}</span>
          </a>
        </div>
      )}

      {/* Specialist Onboarding Welcome & NordBase Academy Rules Banner */}
      <div className="mb-6">
        <SpecialistWelcomeNotice 
          defaultExpanded={false}
          onOpenAcademy={() => setActiveTab('academy')}
          showAcademyButton={isVerifiedSpecialist}
        />
      </div>
      {/* Tabs Menu */}
      <div className="flex border-b border-blue-900/20 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none" id="specialist-tabs-nav">
        <button
          id="spec-tab-board"
          onClick={() => { setActiveTab('board'); setSelectedJobId(null); }}
          className={`px-5 py-3 font-display font-bold text-sm border-b-2 transition-all -mb-px cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'board'
              ? 'border-cyan-400 text-cyan-400 font-black'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>{t('spec.inline_UrgentDispatchB_3', 'Urgent Dispatch Board')}</span>
          <span className={`text-xxs px-2 py-0.5 rounded-full font-mono font-bold ${
            activeTab === 'board' ? 'bg-blue-500/10 text-cyan-400 border border-blue-900/30' : 'bg-slate-950 text-slate-500'
          }`}>
            {availableDispatchingJobs.length}
          </span>
        </button>
        <button
          id="spec-tab-unlocked"
          onClick={() => setActiveTab('unlocked')}
          className={`px-5 py-3 font-display font-bold text-sm border-b-2 transition-all -mb-px cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'unlocked'
              ? 'border-cyan-400 text-cyan-400 font-black'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>{t('spec.inline_MyUnlockedLeads_4', 'My Unlocked Leads')}</span>
          <span className={`text-xxs px-2 py-0.5 rounded-full font-mono font-bold ${
            activeTab === 'unlocked' ? 'bg-blue-500/10 text-cyan-400 border border-blue-900/30' : 'bg-slate-950 text-slate-500'
          }`}>
            {unlockedJobs.length}
          </span>
        </button>
        <button
          id="spec-tab-my-profile"
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-3 font-display font-bold text-sm border-b-2 transition-all -mb-px cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'profile'
              ? 'border-cyan-400 text-cyan-400 font-black'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          {profilePhotoUrl ? (
            <img src={profilePhotoUrl} alt="" className="w-4 h-4 rounded-full object-cover border border-cyan-500/30 shrink-0" referrerPolicy="no-referrer" />
          ) : (
            <User className="w-4 h-4 shrink-0" />
          )}
          <span>{t('spec.inline_MyProfile_5', 'My Profile')}</span>
        </button>
        {(currentUser?.categories?.some((c: any) => ['Care', 'Lessons', 'Business'].includes(c.name || c))) && (
          <button
            id="spec-tab-services"
            onClick={() => { setActiveTab('services'); setSelectedJobId(null); }}
            className={`px-5 py-3 font-display font-bold text-sm border-b-2 transition-all -mb-px cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'services'
                ? 'border-cyan-400 text-cyan-400 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <LayoutList className="w-4 h-4 shrink-0" />
            <span>{t('spec.inline_ServicesSchedul_6', 'Services & Schedule')}</span>
          </button>
        )}
        <button
          id="spec-tab-notifications"
          onClick={() => { setActiveTab('notifications'); store.markNotificationsRead(activeSpecialist?.id || currentUser?.id || 'user-joao'); }}
          className={`px-5 py-3 font-display font-bold text-sm border-b-2 transition-all -mb-px cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'notifications'
              ? 'border-cyan-400 text-cyan-400 font-black'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{t('spec.inline_Notifications_7', 'Notifications')}</span>
          {unreadCount > 0 && (
            <span className="text-xxs px-1.5 py-0.5 bg-cyan-400 text-slate-950 font-mono font-black rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          id="spec-tab-support"
          onClick={() => setActiveTab('support')}
          className={`px-5 py-3 font-display font-bold text-sm border-b-2 transition-all -mb-px cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'support'
              ? 'border-cyan-400 text-cyan-400 font-black'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>{t('spec.inline_SupportHelpdesk_8', 'Support Helpdesk')}</span>
          <span className={`text-xxs px-2 py-0.5 rounded-full font-mono font-bold ${
            activeTab === 'support' ? 'bg-blue-500/10 text-cyan-400 border border-blue-900/30' : 'bg-slate-950 text-slate-500'
          }`}>
            {specTickets.length}
          </span>
        </button>
        <button
          id="spec-tab-academy"
          onClick={() => setActiveTab('academy')}
          className={`px-5 py-3 font-display font-bold text-sm border-b-2 transition-all -mb-px cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'academy'
              ? 'border-cyan-400 text-cyan-400 font-black'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>NordBase Academy</span>
          {!isVerifiedSpecialist && (
            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Locked</span>
            </span>
          )}
        </button>
      </div>
      {/* --- BOARD TAB: ACTIVE LEAD BROADCASTS --- */}
      {activeTab === 'board' && (
        <div id="urgent-board-panel">
          <div className="mb-6">
            <h3 className="text-lg font-display font-bold text-white">{t('spec.inline_UrgentDispatchF_9', 'Urgent Dispatch Feed')}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('spec.inline_Operatorshaveca_10', 'Operators have called and pre-calculated estimates for these jobs. Pay lead fee to instantly unlock the verified customer contact. No competition, first unlocked gets the client.')}
            </p>
          </div>
          {availableDispatchingJobs.length === 0 ? (
            <div className="bg-[#0A1128]/80 border border-blue-900/20 text-center py-16 rounded-3xl shadow-lg">
              <span className="text-slate-400 text-5.5xl block mb-3 animate-pulse">📡</span>
              <p className="text-sm font-display font-bold text-white">{t('spec.inline_TheDispatchBoar_11', 'The Dispatch Board is currently clear')}</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                {t('spec.inline_Wearewaitingfor_12', 'We are waiting for new incoming urgent requests. As soon as a client submits a ticket and our territory partners verify it, it will appear here instantly.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="dispatch-cards-grid">
              {availableDispatchingJobs.map((job) => (
                <div
                  id={`dispatch-card-${job.id}`}
                  key={job.id}
                  className="bg-[#0A1128]/70 rounded-2xl shadow-md border border-blue-950/80 hover:border-blue-500/40 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-blue-950 bg-blue-950/20">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-950 rounded-lg shadow-inner border border-blue-900/35 group-hover:border-cyan-500/20 transition-colors">
                          {getCategoryIcon(job.category, "w-4 h-4 text-cyan-400")}
                        </div>
                        <span className="font-display font-bold text-white text-sm">
                          {job.category ? t('categories.' + job.category, job.category) : ''}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold rounded-md tracking-wider border border-cyan-500/20 uppercase">
                        {job.city}
                      </span>
                    </div>
                    <p className="mt-4 text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed italic">
                      "{job.description}"
                    </p>
                  </div>
                  {/* Operational Details */}
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/50 p-3 rounded-xl border border-blue-950">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">{t('spec.inline_EstHours_13', 'Est. Hours')}</span>
                        <div className="flex items-center gap-1 text-slate-200 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-bold font-mono">~{job.estimatedHours} {t('spec.inline_Hours_14', 'Hours')}</span>
                        </div>
                      </div>
                      <div className="bg-slate-950/50 p-3 rounded-xl border border-blue-950">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">{t('spec.inline_EstContractValu_15', 'Est. Contract Value')}</span>
                        <div className="flex items-center gap-1 text-slate-200 mt-0.5">
                          <span className="text-xs font-bold font-mono text-emerald-400">~{job.estimatedValue}€</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500 font-bold">{t('spec.inline_Published_16', 'Published:')}</span>
                      <span className="text-slate-400 font-semibold">
                        {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  {/* Action Button */}
                  <div className="p-5 pt-0 mt-auto">
                    {job.status === 'offered' && !job.interestedSpecialistIds?.includes(activeSpecialist?.id || '') && (
                      <button
                        onClick={() => handleExpressInterestClick(job.id)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Lock className="w-3.5 h-3.5 text-white" />
                        <span>{t('spec.inline_IamAvailableExp_17', 'I am Available (Express Interest)')}</span>
                      </button>
                    )}
                    {job.status === 'offered' && job.interestedSpecialistIds?.includes(activeSpecialist?.id || '') && (
                      <div className="w-full py-3 px-4 bg-blue-900/20 border border-blue-900/50 text-cyan-400 rounded-xl text-xs font-sans font-bold text-center">
                        {t('spec.inline_InterestRegiste_18', 'Interest Registered. Waiting for Territory Partner...')}
                      </div>
                    )}
                    {job.status === 'specialist_selected' && (
                      <button
                        id={`unlock-lead-btn-${job.id}`}
                        onClick={() => handleUnlockClick(job.id)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm animate-pulse"
                      >
                        <Lock className="w-3.5 h-3.5 text-white" />
                        <span>{t('spec.inline_PayLeadFeejoble_19', `Pay Lead Fee (${job.leadPrice}€) & Unlock`)}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* --- UNLOCKED LEADS TAB --- */}
      {activeTab === 'unlocked' && (
        <div id="unlocked-leads-panel" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {unlockedJobs.length === 0 ? (
            <div className="bg-[#0A1128]/80 border border-blue-900/20 text-center py-16 rounded-3xl shadow-lg">
              <span className="text-slate-400 text-5xl block mb-3">🔓</span>
              <p className="text-sm font-display font-bold text-white">{t('spec.inline_Youhavenotunloc_20', 'You have not unlocked any job contacts yet')}</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                {lang === 'pt' ? 'Vá ao \'Quadro de Pedidos\' e desbloqueie um trabalho para ver os detalhes do cliente e o chat.' : 'Go to the \'Urgent Dispatch Board\' and unlock a job to view active client details and chat logs.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: list of unlocked jobs */}
              <div className="lg:col-span-1 space-y-3.5">
                <span className="text-[10px] text-cyan-400 font-mono font-black block uppercase tracking-widest">
                  {t('spec.inline_MYUNLOCKEDDOSSI_21', `MY UNLOCKED DOSSIERS (${unlockedJobs.length})`)}
                </span>
                {unlockedJobs.map((job) => (
                  <button
                    id={`unlocked-sidebar-card-${job.id}`}
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      selectedJobId === job.id
                        ? 'bg-[#0B1530] border-cyan-500 shadow-xl ring-1 ring-cyan-500/20'
                        : 'bg-[#0A1128]/60 border-blue-950/80 hover:bg-[#0B1530]/40'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-display font-bold text-white text-sm">
                        {job.category ? t('categories.' + job.category, job.category) : ''}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-950/60 border border-blue-900/30 text-cyan-400 text-[9px] font-mono rounded font-bold uppercase">
                        {job.city}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans line-clamp-1">
                      {job.customerName} • {job.specificLocation}
                    </p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-blue-900/10">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                        REF: #{job.id.slice(0, 6).toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        ● {t('spec.inline_ActiveLead_22', 'Active Lead')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {/* Right Column: details & chatbox for selected job */}
              <div className="lg:col-span-2 bg-[#0A1128]/95 rounded-3xl border border-blue-900/20 shadow-lg overflow-hidden flex flex-col justify-between min-h-[550px]">
                {selectedJobId && jobs.find((j) => j.id === selectedJobId) ? (() => {
                  const job = jobs.find((j) => j.id === selectedJobId)!;
                  return (
                    <>
                      {/* Details Box */}
                      <div className="p-6 border-b border-blue-900/20 bg-slate-950/40 space-y-4">
                        <div className="flex flex-wrap justify-between items-start gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase tracking-widest">
                              {t('spec.inline_SECUREDOSSIERAC_23', 'SECURE DOSSIER ACCESSED')}
                            </span>
                            <h4 className="text-lg font-display font-bold text-white mt-1">
                              {job.customerName}
                            </h4>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={getWhatsAppUrl(
                                job.customerPhone,
                                `Hello ${job.customerName}! I am your specialist assigned for ${job.category ? t('categories.' + job.category, job.category) : ''} in ${job.city}. Ref #${job.id.slice(-4)}. When is a good time to arrive?`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border border-emerald-400/30"
                            >
                              <MessageSquare className="w-4 h-4 text-emerald-100" />
                              <span>{t('spec.inline_WhatsAppClient_24', 'WhatsApp Client')} ({job.customerPhone})</span>
                            </a>
                            <a
                              href={getWhatsAppUrl(
                                '+351 912 888 777',
                                `Hello Territory Partner! I unlocked order #${job.id.slice(-4)} for ${job.category ? t('categories.' + job.category, job.category) : ''} in ${job.city}. Let's coordinate.`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{t('spec.inline_WhatsAppTP_25', 'WhatsApp TP')}</span>
                            </a>
                            
                            {job.specialistCompleted ? (
                              <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 font-mono">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>{t('spec.inline_Workperformedpa_26', 'Work performed, payment received, no claims ✔')}</span>
                              </div>
                            ) : (
                              <button
                                id={`complete-lead-btn-${job.id}`}
                                onClick={() => handleCompleteLeadClick(job.id)}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                              >
                                <CheckCircle className="w-4 h-4 text-slate-950 shrink-0" />
                                <span>{t('spec.inline_Workperformedpa_27', 'Work performed, payment received, no claims')}</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                          <div className="space-y-0.5 bg-slate-950/40 p-3 rounded-xl border border-blue-950">
                            <span className="text-[9px] text-slate-500 block uppercase font-bold">{t('spec.inline_JOBADDRESS_28', 'JOB ADDRESS:')}</span>
                            <span className="text-white font-bold font-sans">{job.specificLocation}</span>
                          </div>
                          <div className="space-y-0.5 bg-slate-950/40 p-3 rounded-xl border border-blue-950">
                            <span className="text-[9px] text-slate-500 block uppercase font-bold">{t('spec.inline_ESTIMATEDVALUE_29', 'ESTIMATED VALUE:')}</span>
                            <span className="text-emerald-400 font-bold font-sans">{job.estimatedValue}€</span>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-950/40 rounded-xl border border-blue-950">
                          <span className="text-[9px] font-mono text-cyan-400 block uppercase font-bold mb-1.5 tracking-wider">
                            {t('spec.inline_VerifiedIssueDe_30', 'Verified Issue Description:')}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed italic">
                            "{job.description}"
                          </p>
                        </div>
                        {job.attachments && job.attachments.length > 0 && (
                          <div className="p-4 bg-slate-950/40 rounded-xl border border-blue-950">
                            <span className="text-[9px] font-mono text-cyan-400 block uppercase font-bold mb-2 tracking-wider">
                              Customer Attachments (Blob Storage):
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {job.attachments.map((url, idx) => (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 bg-slate-900 border border-blue-900/30 rounded-lg hover:border-cyan-500 transition-colors cursor-pointer group"
                                >
                                  {url.startsWith('data:image') || url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('blob') ? (
                                    <img src={url} alt="attachment" className="w-8 h-8 object-cover rounded shrink-0" referrerPolicy="no-referrer" />
                                  ) : (
                                    <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                                  )}
                                  <span className="text-[10px] text-slate-300 font-mono">
                                    {t('spec.inline_File_31', 'File')} {idx + 1}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                          <div className="p-4 bg-slate-950/40 rounded-xl border border-blue-950 mt-2">
                          <span className="text-[9px] font-mono text-cyan-400 block uppercase font-bold mb-3 tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-cyan-400 animate-pulse" /> {t('spec.inline_ChronologicalCo_32', 'Chronological Coordination Timeline')}
                          </span>
                          
                          <div className="space-y-4">
                            {(!job.timeline || job.timeline.length === 0) ? (
                              <div className="text-[11px] text-slate-500 font-mono italic pl-2 border-l border-blue-900/30 py-1">
                                {t('spec.inline_Notimelinemiles_33', 'No timeline milestones registered for this lead yet.')}
                              </div>
                            ) : (
                              job.timeline.map((event, idx) => (
                                <div key={event.id || idx} className="flex gap-3 relative group">
                                  {idx !== job.timeline!.length - 1 && (
                                    <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-blue-900/10" />
                                  )}
                                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5 z-10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                  </div>
                                  <div className="font-sans text-xs flex-1 pb-1">
                                    <div className="flex justify-between items-center gap-2">
                                      <span className="font-bold text-slate-200">{event.action}</span>
                                      <span className="text-[9px] text-slate-500 font-mono">
                                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <span className="px-1.5 py-0.2 bg-blue-950 text-cyan-400 text-[8px] font-mono rounded border border-blue-900/30 uppercase tracking-wide">
                                        {event.actor}
                                      </span>
                                      {event.details && (
                                        <span className="text-slate-400 text-[11px] leading-tight">
                                          {event.details}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex bg-[#0A1128]/80 p-1 border-y border-blue-900/20">
                        <button
                          type="button"
                          onClick={() => setSpecialistChatChannel('operator_specialist')}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            specialistChatChannel === 'operator_specialist'
                              ? 'bg-blue-600 text-white shadow font-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {t('spec.inline_TerritoryPartne_34', 'Territory Partner Lane')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSpecialistChatChannel('customer_specialist')}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            specialistChatChannel === 'customer_specialist'
                              ? 'bg-emerald-600 text-white shadow font-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {t('spec.inline_DirectCustomerC_35', 'Direct Customer Chat ✔')}
                        </button>
                      </div>
                      {/* Live Chat Box */}
                      <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col min-h-[300px]" id="specialist-chat-history">
                        {(() => {
                          const dummyUser = {
                            id: activeSpecialist?.id || 'specialist-user',
                            email: activeSpecialist?.email || 'specialist@nordbase.pt',
                            name: activeSpecialist?.name || 'Specialist',
                            phone: activeSpecialist?.phone || '',
                            role: 'specialist' as const,
                            specialistStatus: 'approved' as const
                          };
                          const visibleMessages = job.messages.filter((msg) => {
                            const channel = msg.channel || 'operator_specialist';
                            return canViewChat(dummyUser, {
                              type: 'job',
                              job: job,
                              channel: channel
                            }) && channel === specialistChatChannel;
                          });
                          if (visibleMessages.length === 0) {
                            return (
                              <div className="text-center py-12 text-slate-500 text-xs font-mono">
                                {t('spec.inline_Nomessagesinthi_36', 'No messages in this lane yet.')}
                              </div>
                            );
                          }
                          return visibleMessages.map((msg) => {
                            const isSpecialist = msg.sender === 'specialist';
                            const isSystem = msg.sender === 'system';
                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col max-w-[80%] ${
                                  isSpecialist ? 'align-self-end ml-auto items-end animate-in fade-in duration-200' : isSystem ? 'mx-auto items-center text-center max-w-full' : 'align-self-start mr-auto items-start animate-in fade-in duration-200'
                                }`}
                              >
                                {isSystem ? (
                                  <div className="bg-blue-950 border border-blue-900/20 text-cyan-400 text-[10px] px-3.5 py-1.5 rounded-full font-mono">
                                    ⚡ {msg.content}
                                  </div>
                                ) : (
                                  <>
                                    <span className="text-[9px] text-slate-400 font-mono mb-1">
                                      {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <div
                                      className={`p-3 rounded-xl text-xs leading-relaxed shadow-sm ${
                                        isSpecialist
                                          ? 'bg-blue-600 text-white font-semibold rounded-tr-none'
                                          : 'bg-slate-950 text-slate-200 rounded-tl-none border border-blue-950'
                                      }`}
                                    >
                                      <AITranslatedMessage content={msg.content} context="Specialist Job Communication" />
                                      {/* Dynamic Message Attachment Rendering */}
                                      {msg.attachmentUrl && (
                                        <div className="mt-2.5 p-2 bg-slate-900 rounded-xl border border-blue-900/30 flex items-center gap-3">
                                          {msg.attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                            <img
                                              src={msg.attachmentUrl}
                                              alt={msg.attachmentName || 'Attachment'}
                                              referrerPolicy="no-referrer"
                                              className="w-14 h-14 object-cover rounded-lg border border-slate-800 hover:scale-105 transition-transform cursor-pointer"
                                              onClick={() => window.open(msg.attachmentUrl, '_blank')}
                                            />
                                          ) : (
                                            <FileText className="w-6 h-6 text-cyan-400 shrink-0" />
                                          )}
                                          <div className="flex flex-col min-w-0 flex-1">
                                            <span className="text-[11px] text-white font-semibold truncate font-mono">
                                              {msg.attachmentName || (t('spec.inline_SharedDocument_37', 'Shared Document'))}
                                            </span>
                                            <a
                                              href={msg.attachmentUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-[9px] text-cyan-400 font-bold hover:underline mt-0.5 inline-block"
                                            >
                                              {t('spec.inline_DownloadFile_38', 'Download File')}
                                            </a>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                      {/* Chat Input */}
                      <form onSubmit={(e) => handleSendMessage(e, job.id)} className="p-4 bg-slate-950/40 border-t border-blue-900/20 flex gap-2 items-center" id="specialist-chat-form">
                        <label className="p-2.5 bg-slate-950 hover:bg-slate-900 border border-blue-900/30 text-slate-400 hover:text-white rounded-xl cursor-pointer transition-all active:scale-95 shrink-0 flex items-center justify-center">
                          <Paperclip className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleSpecialistChatFileUpload(e, job.id)}
                            disabled={specialistChatUploading}
                          />
                        </label>
                        <input
                          id="specialist-chat-input"
                          maxLength={2000} type="text"
                          required
                          placeholder={specialistChatUploading ? (lang === 'pt' ? "A enviar ficheiro..." : "Uploading file...") : `${t('spec.inline_Typemessageto_39', 'Type message to ')}${specialistChatChannel === 'customer_specialist' ? (t('spec.inline_Customer_40', 'Customer')) : (t('spec.inline_TerritoryPartne_41', 'Territory Partner'))}...`}
                          value={typedMessage}
                          disabled={specialistChatUploading}
                          onChange={(e) => setTypedMessage(e.target.value)}
                          className="flex-1 px-4 py-3 text-xs rounded-xl border border-blue-900/30 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                        <button
                          id="specialist-send-msg-btn"
                          type="submit"
                          disabled={specialistChatUploading}
                          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center shadow-sm shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </>
                  );
                })() : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs">
                    <MessageSquare className="w-8 h-8 text-cyan-400 mb-2.5 animate-pulse" />
                    <span className="max-w-xs leading-relaxed text-slate-400">{t('spec.inline_Selectanactives_42', 'Select an active secure dossier on the left to review territory partner communications.')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* --- NOTIFICATIONS TAB --- */}
      {activeTab === 'notifications' && (
        <div className="space-y-6" id="spec-notifications-panel">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-white">{t('spec.inline_YourInAppNotifi_43', 'Your In-App Notifications')}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('spec.inline_Realtimeautomat_44', 'Real-time automatic dispatch alerts and support resolution updates.')}
              </p>
            </div>
            <button
              onClick={() => {
                store.markNotificationsRead(activeSpecialist?.id || currentUser?.id || 'user-joao');
                setAlertMsg({ type: 'success', text: t('spec.inline_Allnotification_45', 'All notifications marked as read') });
                setTimeout(() => setAlertMsg(null), 3000);
              }}
              className="px-3 py-1.5 rounded bg-blue-950 hover:bg-blue-900 border border-blue-900/40 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer"
            >
              {t('spec.inline_Markallread_46', 'Mark all read')}
            </button>
          </div>
          {specNotifications.length === 0 ? (
            <div className="bg-[#0A1128]/80 border border-blue-900/20 text-center py-12 rounded-2xl shadow-md">
              <span className="text-3xl block mb-2">🔔</span>
              <p className="text-xs text-slate-400">{t('spec.inline_Nonotifications_47', 'No notifications received yet.')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {specNotifications.map((ntf) => (
                <div
                  key={ntf.id}
                  className={`p-4 rounded-xl border flex gap-3 transition-all ${
                    ntf.read
                      ? 'bg-slate-950/40 border-slate-900/40 text-slate-400'
                      : 'bg-blue-950/20 border-blue-900/40 text-slate-200 shadow-md relative'
                  }`}
                >
                  {!ntf.read && (
                    <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                  <span className="text-lg shrink-0">
                    {ntf.type === 'new_job' ? '📡' : ntf.type === 'support_reply' ? '💬' : '⚡'}
                  </span>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <p className={`text-xs font-bold ${!ntf.read ? 'text-white' : 'text-slate-400'}`}>
                        {ntf.title}
                      </p>
                      <span className="text-[9px] font-mono text-slate-500 shrink-0">
                        {new Date(ntf.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xxs leading-relaxed font-sans">{ntf.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* --- SUPPORT TAB --- */}
      {activeTab === 'support' && (
        <div className="space-y-6" id="spec-support-panel">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-white">{t('spec.inline_SupportHelpdesk_48', 'Support Helpdesk Center')}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('spec.inline_Getassistancere_49', 'Get assistance regarding leads, bank topups, refunds, or territorial credentials.')}
              </p>
            </div>
            {!showCreateTicket && (
              <button
                onClick={() => setShowCreateTicket(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('spec.inline_OpenSupportCase_50', 'Open Support Case')}</span>
              </button>
            )}
          </div>
          {showCreateTicket && (
            <div className="bg-[#0A1128]/95 p-6 rounded-2xl border border-blue-900/35 shadow-lg max-w-lg mx-auto animate-in fade-in duration-200">
              <h4 className="text-sm font-display font-bold text-white mb-4">{t('spec.inline_NewSupportTicke_51', 'New Support Ticket Details')}</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!supportTitle || !supportDesc) return;
                  store.addSupportTicket(
                    supportCategory,
                    supportTitle,
                    supportDesc,
                    'specialist',
                    activeSpecialist?.id || currentUser?.id || 'user-joao',
                    activeSpecialist?.name || currentUser?.name || 'Joao'
                  );
                  setSupportTitle('');
                  setSupportDesc('');
                  setShowCreateTicket(false);
                  setAlertMsg({ type: 'success', text: t('spec.inline_SupportTicketop_52', 'Support Ticket opened successfully. An regional_administrator will reply shortly.') });
                  setTimeout(() => setAlertMsg(null), 5000);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    {t('spec.inline_ProblemCategory_53', 'Problem Category')}
                  </label>
                  <select
                    value={supportCategory}
                    onChange={(e) => setSupportCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-blue-900/30 text-white focus:outline-none focus:border-cyan-500 transition-all text-xs cursor-pointer"
                  >
                    <option value="Lead Refund" className="bg-[#0A1128]">{t('spec.inline_LeadPurchaseRef_54', 'Lead Purchase Refund Request')}</option>
                    <option value="Payments" className="bg-[#0A1128]">{t('spec.inline_ManualBankTopup_55', 'Manual Bank Topup / Billing')}</option>
                    <option value="Technical Issue" className="bg-[#0A1128]">{t('spec.inline_TechnicalBugUIE_56', 'Technical Bug / UI Error')}</option>
                    <option value="Account Issue" className="bg-[#0A1128]">{t('spec.inline_CredentialAreaA_57', 'Credential / Area Assignment')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    {t('spec.inline_ShortTicketTitl_58', 'Short Ticket Title')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'pt' ? "ex. Reembolso de lead Faro ref #12A" : "e.g. Lead Refund for Faro job ref #12A"}
                    value={supportTitle}
                    onChange={(e) => setSupportTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-blue-900/30 text-white focus:outline-none focus:border-cyan-500 transition-all text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    {t('spec.inline_DetailedExplana_59', 'Detailed Explanation')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={lang === 'pt' ? "Forneça os detalhes exatos do seu pedido..." : "Provide exact details of your request so our support team can verify..."}
                    value={supportDesc}
                    onChange={(e) => setSupportDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-blue-900/30 text-white focus:outline-none focus:border-cyan-500 transition-all text-xs resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateTicket(false)}
                    className="px-4 py-2 bg-slate-950 border border-blue-950 hover:bg-slate-900 text-slate-400 rounded-lg font-bold"
                  >
                    {t('spec.inline_Cancel_60', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-bold"
                  >
                    {t('spec.inline_SubmitCase_61', 'Submit Case')}
                  </button>
                </div>
              </form>
            </div>
          )}
          {/* Ticket Dashboard Split Screen */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Hand: Ticket Feed */}
            <div className="bg-[#0A1128]/70 rounded-2xl border border-blue-950/80 p-4 space-y-3">
              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-wider block mb-2">
                {t('spec.inline_YourSupportTick_62', 'Your Support Tickets')} ({specTickets.length})
              </span>
              {specTickets.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  {t('spec.inline_Noactivesupport_63', 'No active support cases registered.')}
                </div>
              ) : (
                <div className="space-y-2">
                  {specTickets.map((tkt) => {
                    const isSelected = selectedTicketId === tkt.id;
                    return (
                      <div
                        key={tkt.id}
                        onClick={() => setSelectedTicketId(tkt.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-950/45 border-cyan-500/40 text-white'
                            : 'bg-slate-950/40 border-slate-900/60 text-slate-300 hover:border-blue-900/30'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                            tkt.status === 'open' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            tkt.status === 'pending' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {tkt.status}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">{tkt.id}</span>
                        </div>
                        <p className="text-xs font-bold truncate">{tkt.title}</p>
                        <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2">
                          <span>{tkt.category}</span>
                          <span>{new Date(tkt.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Right Hand: Ticket Thread View */}
            <div className="lg:col-span-2 bg-[#0A1128]/70 rounded-2xl border border-blue-950/80 p-5 flex flex-col min-h-[400px]">
              {selectedTicketId ? (() => {
                const tkt = specTickets.find(t => t.id === selectedTicketId);
                if (!tkt) return <p className="text-slate-500 text-xs text-center m-auto">{t('spec.inline_Ticketnotfound_64', 'Ticket not found.')}</p>;
                return (
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Ticket Header Card */}
                      <div className="pb-3 border-b border-blue-950">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-0.5">{t('spec.inline_tktcategoryTick_65', `${tkt.category} Ticket`)}</span>
                            <h4 className="text-sm font-bold text-white">{tkt.title}</h4>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                            tkt.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/25' : 'bg-slate-900 text-slate-400'
                          }`}>
                            {tkt.priority} {t('spec.inline_priority_66', 'priority')}
                          </span>
                        </div>
                        <p className="text-xxs font-mono text-slate-400 mt-2">
                          {t('spec.inline_OpenedonnewDate_67', `Opened on ${new Date(tkt.createdAt).toLocaleString()} by ${tkt.userName}`)}
                        </p>
                        {tkt.assignedAdminName ? (
                          <div className="mt-3 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center gap-2 max-w-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-xxs text-cyan-300 font-sans">
                              {t('spec.inline_AssignedAnalyst_68', 'Assigned Analyst:')} <strong>{tkt.assignedAdminName}</strong>
                            </span>
                          </div>
                        ) : (
                          <p className="text-xxs font-mono text-amber-400 mt-2 italic">⚠️ {t('spec.inline_QueueingforTerr_69', 'Queueing for Territory Partner Allocation...')}</p>
                        )}
                      </div>
                      {/* Ticket Thread History & Events */}
                      <div className="space-y-3 overflow-y-auto max-h-[220px] pr-2">
                        {/* Initial Description Card */}
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-blue-950 text-slate-300 text-xs italic leading-relaxed">
                          "{tkt.description}"
                        </div>
                        {/* Chronological History Log Timeline */}
                        {tkt.history && tkt.history.length > 0 && (
                          <div className="space-y-1 bg-slate-950/10 p-2.5 rounded-xl border border-blue-950/50">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-black block mb-1">
                              {t('spec.inline_SystemCaseEvent_70', 'System Case Event Log:')}
                            </span>
                            {tkt.history.map((ev) => (
                              <div key={ev.id} className="text-[9.5px] font-mono text-slate-400 flex justify-between gap-2 border-b border-blue-900/10 pb-1">
                                <span>• [{ev.status.toUpperCase()}] {ev.notes || (t('spec.inline_Statussynchroni_71', 'Status synchronized'))}</span>
                                <span className="text-slate-600">{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Messages List */}
                        {tkt.messages.map((m) => {
                          const isAdmin = m.sender === 'regional_admin';
                          const isSystem = m.senderName === 'System';
                          return (
                            <div
                              key={m.id}
                              className={`flex flex-col max-w-[85%] ${
                                isAdmin ? 'align-self-start mr-auto items-start' : 'align-self-end ml-auto items-end'
                              }`}
                            >
                              <span className="text-[9px] font-mono text-slate-500 mb-0.5">
                                {m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                                isSystem ? 'bg-slate-950 text-amber-400 text-center mx-auto border border-blue-950' :
                                isAdmin ? 'bg-slate-950 text-cyan-300 border border-cyan-900/30' : 'bg-blue-600 text-white font-semibold'
                              }`}>
                                <AITranslatedMessage content={m.content} context="Specialist Support Desk Communication" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Support Desk Message Reply Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!replyText.trim()) return;
                        store.replySupportTicket(tkt.id, replyText, 'specialist', activeSpecialist?.name || currentUser?.name || 'Joao');
                        setReplyText('');
                        setAlertMsg({ type: 'success', text: 'Reply sent' });
                        setTimeout(() => setAlertMsg(null), 3000);
                      }}
                      className="mt-4 pt-3 border-t border-blue-950 flex gap-2"
                    >
                      <input
                        type="text"
                        required
                        placeholder={lang === 'pt' ? "Responder ao gestor no chat de suporte..." : "Reply to the regional_administrator support thread..."}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-blue-900/30 bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold font-mono cursor-pointer"
                      >
                        {t('spec.inline_SendReply_72', 'Send Reply')}
                      </button>
                    </form>
                  </div>
                );
              })() : (
                <div className="m-auto text-center text-slate-500 text-xs">
                  <Ticket className="w-8 h-8 text-cyan-400 mb-2.5 mx-auto animate-pulse" />
                  <span>{t('spec.inline_Selectanactives_73', 'Select an active support docket from the left to view response thread and history log.')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* --- CREATE PROFILE TAB --- */}
      {activeTab === 'create_test_profile' && (
        <div className="bg-[#0A1128]/95 p-8 rounded-3xl border border-blue-900/30 shadow-lg max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300" id="create-specialist-panel">
          <div className="text-center mb-8">
            <span className="text-3xl block mb-2">💼</span>
            <h3 className="text-xl font-display font-black text-white">{t('spec.inline_CreateContracto_74', 'Create Contractor Profile')}</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {t('spec.inline_Addanewregional_75', 'Add a new regional professional to test automatic dispatches, board notifications and territorial routing.')}
            </p>
          </div>
          <form onSubmit={handleCreateProfile} className="space-y-5" id="create-specialist-form">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {t('spec.inline_FullLegalName_76', 'Full Legal Name')}
              </label>
              <input
                id="new-spec-name"
                type="text"
                required
                placeholder="e.g. Carlos Mateus"
                value={newSpecName}
                onChange={(e) => setNewSpecName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-blue-900/30 bg-slate-950/80 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {t('spec.inline_MobilePhone_77', 'Mobile Phone')}
              </label>
              <div className="flex gap-2">
                <select
                  id="new-spec-country-code"
                  value={newSpecCountryCode}
                  onChange={(e) => setNewSpecCountryCode(e.target.value)}
                  className="w-[120px] px-3 py-3.5 rounded-xl border border-blue-900/30 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none text-xs bg-slate-950 text-white focus:bg-slate-900 transition-all cursor-pointer"
                >
                  <option value="+351" className="bg-[#0A1128] text-white">🇵🇹 PT (+351)</option>
                  <option value="+44" className="bg-[#0A1128] text-white">🇬🇧 UK (+44)</option>
                  <option value="+49" className="bg-[#0A1128] text-white">🇩🇪 DE (+49)</option>
                  <option value="+33" className="bg-[#0A1128] text-white">🇫🇷 FR (+33)</option>
                  <option value="+34" className="bg-[#0A1128] text-white">🇪🇸 ES (+34)</option>
                  <option value="+353" className="bg-[#0A1128] text-white">🇮🇪 IE (+353)</option>
                  <option value="+31" className="bg-[#0A1128] text-white">🇳🇱 NL (+31)</option>
                  <option value="+1" className="bg-[#0A1128] text-white">🇺🇸 US (+1)</option>
                  <option value="+380" className="bg-[#0A1128] text-white">🇺🇦 UA (+380)</option>
                  <option value="+46" className="bg-[#0A1128] text-white">🇸🇪 SE (+46)</option>
                  <option value="+48" className="bg-[#0A1128] text-white">🇵🇱 PL (+48)</option>
                  <option value="+41" className="bg-[#0A1128] text-white">🇨🇭 CH (+41)</option>
                  <option value="+39" className="bg-[#0A1128] text-white">🇮🇹 IT (+39)</option>
                  <option value="+32" className="bg-[#0A1128] text-white">🇧🇪 BE (+32)</option>
                </select>
                <input
                  id="new-spec-phone"
                  type="tel"
                  required
                  placeholder="e.g. 964 888 222"
                  value={newSpecLocalPhone}
                  onChange={(e) => setNewSpecLocalPhone(e.target.value)}
                  className="flex-1 px-4 py-3.5 text-xs rounded-xl border border-blue-900/30 bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Primary Trade
                </label>
                <select
                  id="new-spec-category"
                  value={newSpecCategory}
                  onChange={(e) => setNewSpecCategory(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-blue-900/30 bg-slate-950 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#0A1128] text-white">
                      {cat.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Base City
                </label>
                <LocationSearchInput
                  id="new-spec-city"
                  value={newSpecCity}
                  onChange={(val) => setNewSpecCity(val)}
                  placeholder="Type base city..."
                />
              </div>
            </div>
            <button
              id="submit-new-specialist-btn"
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-display font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md mt-2"
            >
              Register Specialist Profile
            </button>
          </form>
        </div>
      )}
      {/* --- MY PROFILE TAB --- */}
      {activeTab === 'profile' && (
        <div className="bg-[#0A1128]/95 p-8 rounded-3xl border border-blue-900/30 shadow-lg max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300 text-left" id="my-profile-panel">
          <div className="text-center mb-8">
            <span className="text-3xl block mb-2">👤</span>
            <h3 className="text-xl font-display font-black text-white">{t('spec.inline_EditSpecialistP_78', 'Edit Specialist Profile')}</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {t('spec.inline_Specifyyourcont_79', 'Specify your contact details, specialties, working region, skill level, and upload documents.')}
            </p>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-6" id="my-profile-form">
            
            {/* Photo Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-950/45 rounded-2xl border border-blue-950">
              <div className={`relative w-20 h-20 rounded-full overflow-hidden bg-blue-950/80 flex items-center justify-center shrink-0 transition-all ${
                profilePhotoUrl ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-950 shadow-md shadow-emerald-500/20' : 'border border-blue-900/40'
              }`}>
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-8 h-8 text-slate-500" />
                )}
                {profileIsUploading === 'photo' && (
                  <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                  </div>
                )}
              </div>
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    {t('spec.inline_ProfilePhoto_80', 'Profile Photo')}
                  </label>
                  {profilePhotoUrl ? (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold font-mono uppercase tracking-wide flex items-center gap-0.5">
                      ✓ {t('spec.inline_Uploaded_81', 'Uploaded')}
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-500 font-mono">{t('spec.inline_Nophoto_82', 'No photo')}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center">
                  <label className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-cyan-400 border border-blue-900/30 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{profilePhotoUrl ? (t('spec.inline_ChangePhoto_83', 'Change Photo')) : (t('spec.inline_UploadPhoto_84', 'Upload Photo'))}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleProfileFileChange(e, 'photo')} />
                  </label>
                  {profilePhotoUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() => setProfilePhotoUrl('')}
                        className="px-3 py-2 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-semibold border border-slate-800 transition-colors cursor-pointer"
                      >
                        {t('spec.inline_Remove_85', 'Remove')}
                      </button>
                      <a 
                        href={profilePhotoUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
                      >
                        {t('spec.inline_ViewFullPhoto_86', 'View Full Photo')}
                      </a>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-slate-500">{t('spec.inline_JPGPNGupto10MBa_87', 'JPG, PNG up to 10 MB are allowed.')}</p>
              </div>
            </div>
            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {t('spec.inline_FullName_88', 'Full Name')}
                </label>
                <input
                  id="profile-name-input"
                  type="text"
                  required
                  placeholder="Carlos Mateus"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-blue-900/30 bg-slate-950 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {t('spec.inline_PhoneNumber_89', 'Phone Number')}
                </label>
                <input
                  id="profile-phone-input"
                  type="tel"
                  required
                  placeholder="+351 964 888 222"
                  value={profilePhone}
                  onChange={(e) => {
                    setProfilePhone(e.target.value);
                    if (!profileWhatsApp) setProfileWhatsApp(e.target.value);
                  }}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-blue-900/30 bg-slate-950 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{t('spec.inline_WhatsAppNumber_90', 'WhatsApp Number')}</span>
                  </label>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                    {t('spec.inline_MandatoryforOrd_91', 'Mandatory for Orders')}
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="profile-whatsapp-input"
                    type="tel"
                    required
                    placeholder="+351 964 888 222"
                    value={profileWhatsApp}
                    onChange={(e) => setProfileWhatsApp(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 text-xs rounded-xl border border-emerald-500/40 bg-slate-950 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-mono font-bold"
                  />
                  <div className="absolute left-3 top-3.5 text-emerald-400 text-xs font-bold">
                    💬
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  {t('spec.inline_UsedbyTerritory_92', 'Used by Territory Partners & Customers for instant 1-click WhatsApp order dispatch.')}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {t('spec.inline_PrimaryLocation_93', 'Primary Location / Area')}
              </label>
              <LocationSearchInput
                id="profile-city-select"
                value={profileCity}
                onChange={(val) => setProfileCity(val)}
                placeholder={lang === 'pt' ? "Digite a sua cidade..." : "Type primary location..."}
              />
            </div>
            {/* Specialties & Mastery Levels section */}
            <div className="space-y-4">
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                {t('spec.inline_MySpecialtiesMa_94', 'My Specialties & Mastery Levels')}
              </label>
              
              <div className="p-4 bg-slate-950/45 rounded-2xl border border-blue-950 space-y-4">
                <p className="text-xxs text-slate-400">
                  {t('spec.inline_Selectacategory_95', 'Select a category and specialty to declare, then set your personal level of expertise for it. You can declare multiple specialties with different levels (e.g. Master Electrician and Amateur Carpenter).')}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Select Main Category */}
                  <div>
                    <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">{t('spec.inline_Category_96', 'Category')}</label>
                    <select
                      id="dashboard-spec-cat-select"
                      className="w-full bg-slate-900 border border-blue-900/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                      defaultValue=""
                      onChange={(e) => {
                        const selCat = e.target.value as ServiceCategory;
                        const specSelect = document.getElementById('dashboard-spec-sub-select') as HTMLSelectElement;
                        if (specSelect) {
                          specSelect.innerHTML = t('spec.inline_optionvalueChoo_97', '<option value="">-- Choose Specialty --</option>');
                          if (selCat && CATEGORY_SPECIALTIES[selCat]) {
                            CATEGORY_SPECIALTIES[selCat].forEach(sub => {
                              const opt = document.createElement('option');
                              opt.value = sub;
                              opt.textContent = sub;
                              opt.className = 'bg-[#0A1128]';
                              specSelect.appendChild(opt);
                            });
                          }
                        }
                      }}
                    >
                      <option value="">{t('spec.inline_ChooseCategory_98', '-- Choose Category --')}</option>
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id} className="bg-[#0A1128]">{c.id}</option>
                      ))}
                    </select>
                  </div>
                  {/* Select Specialty */}
                  <div>
                    <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">{t('spec.inline_Specialty_99', 'Specialty')}</label>
                    <select
                      id="dashboard-spec-sub-select"
                      className="w-full bg-slate-900 border border-blue-900/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="">{t('spec.inline_ChooseSpecialty_100', '-- Choose Specialty --')}</option>
                    </select>
                  </div>
                  {/* Select Level */}
                  <div>
                    <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">{t('spec.inline_Level_101', 'Level')}</label>
                    <div className="flex gap-2">
                      <select
                        id="dashboard-spec-level-select"
                        className="flex-1 bg-slate-900 border border-blue-900/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                      >
                        <option value="amateur" className="bg-[#0A1128]">{t('spec.inline_AmateurHobbyist_102', 'Amateur / Hobbyist')}</option>
                        <option value="pro" className="bg-[#0A1128]">{t('spec.inline_Professional_103', 'Professional')}</option>
                        <option value="expert" className="bg-[#0A1128]">{t('spec.inline_ExpertMaster_104', 'Expert / Master')}</option>
                      </select>
                      
                      <button
                        type="button"
                        onClick={() => {
                          const catSelect = document.getElementById('dashboard-spec-cat-select') as HTMLSelectElement;
                          const subSelect = document.getElementById('dashboard-spec-sub-select') as HTMLSelectElement;
                          const lvlSelect = document.getElementById('dashboard-spec-level-select') as HTMLSelectElement;
                          
                          if (!catSelect.value || !subSelect.value) {
                            alert('Please select both a Category and a Specialty first.');
                            return;
                          }
                          
                          const alreadyAdded = profileSpecialtiesWithLevels.some(s => s.specialty === subSelect.value);
                          if (alreadyAdded) {
                            alert('This specialty is already added. You can change its level by removing and re-adding it.');
                            return;
                          }
                          
                          const newSpecialty: SpecialtyWithLevel = {
                            category: catSelect.value as ServiceCategory,
                            specialty: subSelect.value,
                            level: lvlSelect.value as 'amateur' | 'pro' | 'expert'
                          };
                          
                          setProfileSpecialtiesWithLevels([...profileSpecialtiesWithLevels, newSpecialty]);
                          
                          // Clear selection
                          subSelect.value = '';
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors shrink-0 flex items-center justify-center font-bold text-xs"
                        title="Add Specialty"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* List of Added Specialties */}
                <div className="pt-2">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">{t('spec.inline_MyDeclaredSpeci_105', 'My Declared Specialties:')}</span>
                  {profileSpecialtiesWithLevels.length === 0 ? (
                    <div className="text-center py-4 bg-slate-950/30 border border-dashed border-blue-950/50 rounded-xl text-slate-500 text-xs">
                      {t('spec.inline_Nospecialtiesad_106', 'No specialties added yet. Please add at least one specialty above.')}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileSpecialtiesWithLevels.map((spec) => (
                        <div
                          key={spec.specialty}
                          className="flex items-center gap-2 bg-blue-950/40 border border-blue-900/30 rounded-xl px-3 py-1.5 text-xs text-white shadow-sm"
                        >
                          <div>
                            <span className="font-semibold text-white">{spec.specialty}</span>
                            <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                              spec.level === 'expert' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                              spec.level === 'pro' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {spec.level}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setProfileSpecialtiesWithLevels(profileSpecialtiesWithLevels.filter(s => s.specialty !== spec.specialty));
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors bg-transparent border-0 cursor-pointer ml-1.5 animate-pulse"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Experience / Description */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {t('spec.inline_SkillsEquipment_107', 'Skills & Equipment Description')}
              </label>
              <textarea
                id="profile-desc-textarea"
                rows={4}
                placeholder={lang === 'pt' ? "Fale-nos sobre a sua experiência, ferramentas, veículo..." : "Tell us about your experience, tools used, vehicle availability, etc."}
                value={profileSkillsDescription}
                onChange={(e) => setProfileSkillsDescription(e.target.value)}
                className="w-full px-4 py-3 text-xs rounded-xl border border-blue-900/30 bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              />
            </div>
            {/* Spoken Languages */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                {t('spec.inline_LanguagesSpoken_108', 'Languages Spoken')}
              </label>
              <div className="space-y-3 bg-slate-950/30 p-4 rounded-2xl border border-blue-950">
                <div className="flex flex-wrap gap-2">
                  {['English', 'Portuguese', 'Russian', 'German', 'Spanish', 'French'].map((l) => {
                    const isSelected = profileLanguages.some(lx => lx.language === l);
                    const langLabel = lang === 'pt' ? (l === 'English' ? 'Inglês' : l === 'Portuguese' ? 'Português' : l === 'Russian' ? 'Russo' : l === 'German' ? 'Alemão' : l === 'Spanish' ? 'Espanhol' : l === 'French' ? 'Francês' : l) :  l;
                    return (
                      <button
                        type="button"
                        key={l}
                        onClick={() => handleProfileLanguageToggle(l)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                            : 'bg-slate-950 border-blue-900/20 text-slate-500 hover:text-white'
                        }`}
                      >
                        {langLabel}
                      </button>
                    );
                  })}
                </div>
                {/* Free text custom language input field */}
                <div className="flex gap-2 items-center mt-3 pt-3 border-t border-blue-950/40">
                  <input
                    type="text"
                    placeholder={lang === 'pt' ? "Digite outro idioma (ex: Italiano)..." : "Type other language (e.g., Italian, Polish)..."}
                    value={customLanguageInput}
                    onChange={(e) => setCustomLanguageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const trimmed = customLanguageInput.trim();
                        if (trimmed) {
                          const exists = profileLanguages.some(l => l.language.toLowerCase() === trimmed.toLowerCase());
                          if (!exists) {
                            setProfileLanguages([...profileLanguages, { language: trimmed, level: 'conversational' }]);
                          }
                          setCustomLanguageInput('');
                        }
                      }
                    }}
                    className="flex-1 max-w-xs px-3 py-2 text-xs rounded-xl border border-blue-900/30 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = customLanguageInput.trim();
                      if (trimmed) {
                        const exists = profileLanguages.some(l => l.language.toLowerCase() === trimmed.toLowerCase());
                        if (!exists) {
                          setProfileLanguages([...profileLanguages, { language: trimmed, level: 'conversational' }]);
                        }
                        setCustomLanguageInput('');
                      }
                    }}
                    className="px-3.5 py-2 bg-blue-950 hover:bg-blue-900 text-cyan-400 border border-blue-900/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {profileLanguages.length > 0 && (
                  <div className="space-y-2 mt-2 pt-2 border-t border-blue-950">
                    <p className="text-[10px] font-mono text-slate-500 uppercase font-semibold">{t('spec.inline_LanguageLevels_109', 'Language Levels:')}</p>
                    {profileLanguages.map((l) => (
                      <div key={l.language} className="flex items-center justify-between gap-4 py-1 text-xs text-white">
                        <span className="font-semibold">{l.language}</span>
                        <div className="flex items-center gap-2">
                          {(['basic', 'conversational', 'native'] as const).map((lvl) => (
                            <button
                              type="button"
                              key={lvl}
                              onClick={() => handleProfileLanguageLevelChange(l.language, lvl)}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                                l.level === lvl
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {lvl === 'basic' ? (t('spec.inline_Basic_110', 'Basic')) : lvl === 'conversational' ? (t('spec.inline_Fluent_111', 'Fluent')) : (t('spec.inline_Native_112', 'Native'))}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Verification Documents */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                {t('spec.inline_IdentityVerific_113', 'Identity Verification Documents')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['passport', 'id_card', 'drivers_license'] as const).map((type) => {
                  const doc = profileDocuments.find(d => d.type === type);
                  const isUploading = profileIsUploading === type;
                  return (
                    <div 
                      key={type} 
                      className={`p-4 rounded-xl flex flex-col justify-between gap-3 text-center transition-all ${
                        doc 
                          ? 'bg-emerald-500/5 border border-emerald-500/35 shadow-sm shadow-emerald-500/5' 
                          : 'bg-slate-950/45 border border-blue-950'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400">
                          {type === 'passport' ? (t('spec.inline_Passport_114', 'Passport')) : type === 'id_card' ? (t('spec.inline_IDCard_115', 'ID Card')) : (lang === 'pt' ? 'Carta de Condução' : "Driver's License")}
                        </p>
                        {doc ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                            <Check className="w-3 h-3" /> {t('spec.inline_LoadedActive_116', 'Loaded & Active')}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">{t('spec.inline_Notuploaded_117', 'Not uploaded')}</span>
                        )}
                      </div>
                      {doc && (
                        <div className="space-y-1">
                          <div className="p-1.5 bg-slate-900 rounded-lg text-xxs truncate text-slate-400">
                            {doc.name}
                          </div>
                          {doc.url && (
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-medium inline-block cursor-pointer"
                            >
                              {t('spec.inline_ViewUploadedFil_118', 'View Uploaded File')}
                            </a>
                          )}
                        </div>
                      )}
                      <div className="flex gap-1.5 mt-1 justify-center">
                        <label className="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 text-cyan-400 border border-blue-900/30 rounded-lg text-xxs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 flex-1">
                          {isUploading ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <UploadCloud className="w-3 h-3" />
                          )}
                          <span>{doc ? (t('spec.inline_Update_119', 'Update')) : (t('spec.inline_Select_120', 'Select'))}</span>
                          <input type="file" className="hidden" disabled={isUploading} onChange={(e) => handleProfileFileChange(e, type)} />
                        </label>
                        {doc && (
                          <button
                            type="button"
                            onClick={() => setProfileDocuments(profileDocuments.filter(d => d.type !== type))}
                            className="p-1.5 bg-slate-900 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Profile Save Feedback and Button */}
            <div className="pt-4 space-y-3">
              {profileSaveStatus && (
                <div 
                  className={`p-4 rounded-2xl border text-xs font-medium flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-xl ${
                    profileSaveStatus.type === 'success'
                      ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40 shadow-emerald-950/40'
                      : 'bg-rose-950/80 text-rose-200 border-rose-500/40 shadow-rose-950/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30 shrink-0 mt-0.5">
                      <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-emerald-300 font-display text-sm flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{t('spec.inline_ProfileSavedSub_121', 'Profile Saved & Submitted')}</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {profileSaveStatus.text}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileSaveStatus(null)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-emerald-900/50 rounded-lg transition-colors shrink-0 cursor-pointer"
                    title="Dismiss message"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button
                id="save-profile-btn"
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2"
              >
                {isSavingProfile ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t('spec.inline_SavingProfileCh_122', 'Saving Profile Changes...')}</span>
                  </>
                ) : profileSaveStatus?.type === 'success' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t('spec.inline_SavedSuccessful_123', 'Saved Successfully! ✓')}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t('spec.inline_SaveProfileChan_124', 'Save Profile Changes')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* --- SERVICES TAB --- */}
      {activeTab === 'services' && (
        <MarketplaceServicesManager
          currentUser={currentUser!}
          onUpdateUser={onUpdateUser!}
        />
      )}
      {/* --- ACADEMY TAB --- */}
      {activeTab === 'academy' && (
        isVerifiedSpecialist ? (
          <div className="h-[800px] border border-blue-900/30 rounded-3xl overflow-hidden shadow-2xl mt-4 animate-in fade-in zoom-in-95 duration-200">
            <Academy userRole="specialist" />
          </div>
        ) : (
          <div className="bg-[#0A1128]/95 border-2 border-amber-500/40 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-12 shadow-2xl animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <div className="w-20 h-20 bg-amber-500/20 border-2 border-amber-500/40 rounded-3xl flex items-center justify-center mx-auto text-amber-400 text-3xl animate-pulse">
              🔒
            </div>
            <div className="space-y-2">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs rounded-full uppercase tracking-wider">
                {t('spec.verification_required_badge', 'Verification Required')}
              </span>
              <h3 className="text-2xl font-black text-white font-display pt-2">
                {t('spec.academy_locked_title', 'NordBase Academy Access Locked')}
              </h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed pt-1">
                {t('spec.academy_locked_desc', 'Access to NordBase Academy courses and certification materials opens automatically once your profile and verification documents are reviewed and approved by your Regional Territory Partner.')}
              </p>
            </div>

            <div className="p-5 bg-slate-900/80 border border-blue-900/40 rounded-2xl text-left space-y-2 text-xs text-slate-300">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <span>📋 Next Steps to Unlock Access:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                <li>Complete your profile details and upload ID documents in the Profile tab.</li>
                <li>Wait for your Territory Partner to audit your application.</li>
                <li>Contact your Territory Partner on WhatsApp for immediate activation.</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>{t('spec.complete_profile_btn', 'Complete Profile')}</span>
              </button>
              <a
                href={getWhatsAppUrl(
                  currentUser?.whatsapp || currentUser?.phone || '+351 912 888 777',
                  `Hello Territory Partner! I registered as a specialist (${currentUser?.name}) in ${currentUser?.city || 'Algarve'} and submitted my profile for verification. Could you please review my profile?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 border border-emerald-400/30"
              >
                <span>💬 {t('spec.contact_tp_whatsapp', 'Contact TP via WhatsApp')}</span>
              </a>
            </div>
          </div>
        )
      )}
      {/* --- STRIPE CHECKOUT SIMULATION MODAL --- */}
      {checkoutJobId && (() => {
        const job = jobs.find(j => j.id === checkoutJobId);
        if (!job) return null;
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200" id="stripe-checkout-modal">
            <div className="bg-[#0B1124] border border-blue-900/40 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="p-6 bg-gradient-to-b from-[#141C36] to-[#0B1124] border-b border-blue-900/20 relative">
                <button
                  type="button"
                  onClick={() => {
                    if (checkoutStep === 'processing') return;
                    setCheckoutJobId(null);
                    setCheckoutStep('idle');
                  }}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold cursor-pointer text-sm"
                  disabled={checkoutStep === 'processing'}
                >
                  ✕
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-500/20 text-cyan-400">
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-display font-black text-white">{t('spec.inline_StripeSandbox_125', 'Stripe Sandbox')}</h3>
                    <p className="text-xxs text-slate-400 uppercase tracking-wider font-mono">NordBase.pt Secure Gateway</p>
                  </div>
                </div>
              </div>
              {/* Body */}
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                {checkoutStep === 'idle' && (
                  <div className="space-y-4">
                    {/* Lead Info Summary */}
                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-blue-950/60 space-y-2.5 text-left">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">{t('spec.inline_TerritoryLeadCa_126', 'Territory Lead Category')}</span>
                        <span className="text-white font-bold">{job.category ? t('categories.' + job.category, job.category) : ''}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">{t('spec.inline_OperatingRegion_127', 'Operating Region')}</span>
                        <span className="text-white font-bold">{job.city}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">{t('spec.inline_EstCustomerCont_128', 'Est. Customer Contract Value')}</span>
                        <span className="text-emerald-400 font-bold font-mono">~{job.estimatedValue}€</span>
                      </div>
                      <div className="border-t border-blue-900/15 pt-2.5 flex justify-between items-center">
                        <span className="text-sm font-bold text-white">{t('spec.inline_LeadUnlockFee_129', 'Lead Unlock Fee')}</span>
                        <span className="text-lg font-black font-mono text-cyan-400">{job.leadPrice}€</span>
                      </div>
                    </div>
                    {/* Stripe Card Entry Form */}
                    <div className="space-y-3 text-left">
                      <div>
                        <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          placeholder="Carlos Mateus"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-blue-900/20 bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Credit Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={checkoutCardNumber}
                            onChange={(e) => setCheckoutCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-blue-900/20 bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                          />
                          <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Expiration (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={checkoutExpiry}
                            onChange={(e) => setCheckoutExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-blue-900/20 bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
                            CVV / CVC
                          </label>
                          <input
                            type="text"
                            value={checkoutCvc}
                            onChange={(e) => setCheckoutCvc(e.target.value)}
                            placeholder="123"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-blue-900/20 bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Sandbox Notice & Autofill */}
                    <div className="p-3 bg-blue-950/30 border border-blue-900/20 rounded-xl flex items-start gap-2.5 text-xxs leading-relaxed text-slate-400 text-left">
                      <span className="text-xs">💡</span>
                      <div>
                        <span className="font-bold text-cyan-400 block mb-0.5">{t('spec.inline_StripePaymentSi_130', 'Stripe Payment Simulator Mode')}</span>
                        We are running in a secure sandbox test environment. All credit card details are mock-verified and no real funds will be processed.
                        <button
                          type="button"
                          onClick={() => {
                            setCheckoutCardNumber('4242 4242 4242 4242');
                            setCheckoutExpiry('12/28');
                            setCheckoutCvc('123');
                            setCheckoutName(activeSpecialist?.name || 'Carlos Mateus');
                          }}
                          className="text-cyan-400 hover:underline font-bold block mt-1 uppercase tracking-wide text-[9px] cursor-pointer"
                        >
                          ⚡ Autofill Sandbox Credentials
                        </button>
                      </div>
                    </div>
                    {/* Pay Button */}
                    <button
                      type="button"
                      onClick={async () => {
                        setCheckoutStep('processing');
                        setCheckoutProgressText(`Initiating ${t('spec.inline_StripeSandbox_131', 'Stripe Sandbox')} transaction channel...`);
                        
                        setTimeout(() => {
                          setCheckoutProgressText(`Authorizing regional lead fee allocation (€${job.leadPrice})...`);
                        }, 800);
                        setTimeout(() => {
                          setCheckoutProgressText('Locking dispatch dossier details and generating secure token...');
                        }, 1600);
                        setTimeout(async () => {
                          setCheckoutProgressText('Finalizing payment settlement via Stripe API...');
                          const successPromise = onUnlockJob(job.id, activeSpecialist?.id || '');
                          const success = successPromise instanceof Promise ? await successPromise : successPromise;
                          if (success) {
                            setCheckoutStep('success');
                          } else {
                            setCheckoutStep('idle');
                            alert('Transaction declined by simulator. Please verify you have enough balance or try again.');
                          }
                        }, 2400);
                      }}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-sans font-black text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{t('spec.inline_PayjobleadPrice_132', `Pay ${job.leadPrice}€ & Unlock Dossier`)}</span>
                    </button>
                  </div>
                )}
                {checkoutStep === 'processing' && (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-500/10 border-t-cyan-400 animate-spin" />
                    <div className="space-y-1.5 max-w-xs mx-auto">
                      <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">{t('spec.inline_ProcessingTrans_133', 'Processing Transfer')}</p>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{checkoutProgressText}</p>
                    </div>
                  </div>
                )}
                {checkoutStep === 'success' && (
                  <div className="space-y-5 py-2">
                    {/* Success icon */}
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle className="w-7 h-7 animate-in zoom-in-50 duration-300" />
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="text-base font-display font-black text-white">{t('spec.inline_PaymentSuccessf_134', 'Payment Successful!')}</h4>
                      <p className="text-xxs font-mono text-slate-500 uppercase tracking-widest">TRANSACTION REF: TX_STRIPE_{Date.now().toString().slice(-6)}</p>
                    </div>
                    {/* Receipt Details */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-blue-950/70 space-y-2 font-mono text-xxs text-slate-400 text-left">
                      <div className="flex justify-between">
                        <span>CARD NUM</span>
                        <span>•••• •••• •••• 4242</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CARDHOLDER</span>
                        <span className="uppercase">{checkoutName || activeSpecialist?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SETTLEMENT</span>
                        <span className="text-white font-bold">€{job.leadPrice}.00 (STABLE)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('spec.inline_GATEWAY_135', 'GATEWAY')}</span>
                        <span className="text-cyan-400 font-bold">STRIPE-SANDBOX-LIVE</span>
                      </div>
                    </div>
                    {/* CTA Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutJobId(null);
                        setCheckoutStep('idle');
                        setSelectedJobId(job.id);
                        setActiveTab('unlocked');
                        setAlertMsg({ type: 'success', text: 'Lead dossier unlocked! Start communicating with the client and territory partner.' });
                        setTimeout(() => setAlertMsg(null), 5000);
                      }}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>{t('spec.inline_OpenCustomerDos_136', 'Open Customer Dossier & Start Chat')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}