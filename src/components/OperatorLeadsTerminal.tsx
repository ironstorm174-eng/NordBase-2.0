/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { AITranslatedMessage } from './AITranslatedMessage';
import { AIMessagePolisher } from './AIMessagePolisher';
import { useTranslation } from "react-i18next";
import { Job, } from '../types';
import { store } from '../store';
import { canViewChat } from '../lib/permissions';
import { uploadImage } from '../utils/upload';
import { getWhatsAppUrl } from '../utils/whatsapp';
import CreateOrderModal from './CreateOrderModal';
import {
  Briefcase,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  FileText,
  Search,
  Send,
  Paperclip,
  User,
  Zap,
  Navigation,
  DollarSign,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  MessageSquare,
  Sliders,
  Bell,
  Plus,
  PhoneCall,
  PlusCircle,
  Star,
  ThumbsUp
} from 'lucide-react';
interface OperatorLeadsTerminalProps {
  jobs: Job[];
  onClaimJob: (jobId: string, operatorId: string) => void;
  onOfferJob: (
    jobId: string,
    hours: number,
    value: number,
    leadPrice: number,
    notes: string,
    specialistIds: string[]
  ) => void;
  onSelectSpecialist: (jobId: string, specialistId: string) => void;
  onCompleteJob: (jobId: string) => void;
  onAddMessage: (
    jobId: string,
    sender: 'operator',
    senderName: string,
    content: string,
    channel?: 'customer_operator' | 'operator_specialist' | 'operator_operator' | 'customer_specialist',
    attachmentUrl?: string,
    attachmentName?: string
  ) => void;
  activeOperatorId: string;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  currentUser?: any;
}
// Category & Subcategory matching helper function to prevent cross-domain assignment errors (e.g. Electricians for Pool Cleaning)
// eslint-disable-next-line react-refresh/only-export-components
export function isSpecialistMatchingCategory(specialist: any, jobCategory?: string, jobSubcategory?: string): boolean {
  if (!jobCategory || jobCategory === 'all' || jobCategory === 'All') return true;
  const normJobCat = jobCategory.toLowerCase().trim();
  const normJobSubcat = jobSubcategory ? jobSubcategory.toLowerCase().trim() : '';
  // Extract all categories, subcategories & specialties declared by specialist
  const specTokens: string[] = [];
  if (specialist.category) specTokens.push(String(specialist.category).toLowerCase().trim());
  if (Array.isArray(specialist.categories)) {
    specialist.categories.forEach((c: any) => {
      if (typeof c === 'string') specTokens.push(c.toLowerCase().trim());
    });
  }
  if (Array.isArray(specialist.specialtiesWithLevels)) {
    specialist.specialtiesWithLevels.forEach((s: any) => {
      if (s && s.name) specTokens.push(String(s.name).toLowerCase().trim());
      if (s && s.specialty) specTokens.push(String(s.specialty).toLowerCase().trim());
      if (s && s.category) specTokens.push(String(s.category).toLowerCase().trim());
    });
  }
  if (specialist.skillsDescription) {
    specTokens.push(String(specialist.skillsDescription).toLowerCase().trim());
  }
  // 1. Check Category Match
  const directCategoryMatch = specTokens.some(tok => 
    tok === normJobCat || tok.includes(normJobCat) || normJobCat.includes(tok)
  );
  // Domain classification map for categories & subcategories
  const poolKeywords = ['pool', 'swimming', 'water care'];
  const electricalKeywords = ['electr', 'wiring', 'light', 'circuit'];
  const plumbingKeywords = ['plumb', 'pipe', 'leak', 'faucet', 'drain'];
  const hvacKeywords = ['hvac', 'climate', 'ac ', 'ac', 'air conditioning'];
  const cleaningKeywords = ['clean', 'maid', 'housekeep'];
  const gardeningKeywords = ['garden', 'landscape', 'lawn'];
  const renovationKeywords = ['renovat', 'repair', 'construct', 'paint', 'tile'];
  const applianceKeywords = ['appliance', 'fridge', 'washer'];
  const getDomain = (text: string): string => {
    if (poolKeywords.some(kw => text.includes(kw))) return 'pool';
    if (electricalKeywords.some(kw => text.includes(kw))) return 'electrical';
    if (plumbingKeywords.some(kw => text.includes(kw))) return 'plumbing';
    if (hvacKeywords.some(kw => text.includes(kw))) return 'hvac';
    if (cleaningKeywords.some(kw => text.includes(kw))) return 'cleaning';
    if (gardeningKeywords.some(kw => text.includes(kw))) return 'gardening';
    if (renovationKeywords.some(kw => text.includes(kw))) return 'renovation';
    if (applianceKeywords.some(kw => text.includes(kw))) return 'appliance';
    return 'general';
  };
  const jobCatDomain = getDomain(normJobCat);
  const specDomains = specTokens.map(getDomain);
  const categoryMatched = directCategoryMatch || (jobCatDomain !== 'general' && specDomains.includes(jobCatDomain));
  if (!categoryMatched) return false;
  // 2. If job has subcategory, check Subcategory Match
  if (normJobSubcat) {
    const directSubcatMatch = specTokens.some(tok => 
      tok === normJobSubcat || tok.includes(normJobSubcat) || normJobSubcat.includes(tok)
    );
    if (directSubcatMatch) return true;
    const jobSubcatDomain = getDomain(normJobSubcat);
    if (jobSubcatDomain !== 'general' && specDomains.includes(jobSubcatDomain)) {
      return true;
    }
    // If subcategory was specified but no direct/domain match found among specialist's specific skills
    return false;
  }
  return true;
}
export default function OperatorLeadsTerminal({
  jobs,
  onClaimJob,
  onOfferJob,
  onSelectSpecialist,
  onCompleteJob,
  onAddMessage,
  activeOperatorId,
  selectedJobId,
  setSelectedJobId,
  currentUser
}: OperatorLeadsTerminalProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'pt';
  
  // --- STATE FOR FILTERS & SORTING ---
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'offered' | 'active' | 'completed'>('new');
  const [sortBy, setSortBy] = useState<'time' | 'urgency' | 'value'>('time');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  // --- STATE FOR CURRENT REQUEST ---
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [complexity, setComplexity] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('Medium');
  const [estHours, setEstHours] = useState('3');
  const [estValue, setEstValue] = useState('150');
  const [estLeadFee, setEstLeadFee] = useState('15');
  const [internalNotes, setInternalNotes] = useState('');
  const [selectedSpecialistIds, setSelectedSpecialistIds] = useState<string[]>([]);
  const [blockedSpecialistIds, setBlockedSpecialistIds] = useState<string[]>([]);
  const [showAllSpecialists, setShowAllSpecialists] = useState(false);
  const [zoomedPhotoUrl, setZoomedPhotoUrl] = useState<string | null>(null);
  // --- STATE FOR COMMUNICATION TABS ---
  const [contextTab, setContextTab] = useState<'chat' | 'files' | 'history'>('chat');
  const [operatorChatChannel, setOperatorChatChannel] = useState<'customer_operator' | 'operator_specialist' | 'operator_operator' | 'customer_specialist'>('customer_operator');
  const [typedMessage, setTypedMessage] = useState('');
  const [chatUploading, setChatUploading] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  // Live clock updating every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);
  // Find currently selected request
  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0] || null;
  // Auto-update form values & auto-switch chat channel when selected job changes
  useEffect(() => {
    if (selectedJob) {
      setEstHours(selectedJob.estimatedHours?.toString() || '3');
      setEstValue(selectedJob.estimatedValue?.toString() || '150');
      setEstLeadFee(selectedJob.leadPrice?.toString() || '15');
      setInternalNotes(selectedJob.operatorNotes || '');
      setPhoneRevealed(false);
      if (selectedJob.interestedSpecialistIds && selectedJob.interestedSpecialistIds.length > 0) {
        setSelectedSpecialistIds(selectedJob.interestedSpecialistIds);
      } else if (selectedJob.offeredSpecialistIds && selectedJob.offeredSpecialistIds.length > 0) {
        setSelectedSpecialistIds(selectedJob.offeredSpecialistIds);
      } else {
        setSelectedSpecialistIds([]);
      }
      if (selectedJob.status === 'pending_operator') {
        setOperatorChatChannel('customer_operator');
      } else if (selectedJob.status === 'offered' || selectedJob.status === 'active' || selectedJob.status === 'specialist_selected') {
        setOperatorChatChannel('operator_specialist');
      }
    }
  }, [selectedJobId, selectedJob]);
  const uniqueCities = Array.from(new Set(jobs.map((j) => j.city))).filter(Boolean);
  const uniqueCategories = Array.from(new Set(jobs.map((j) => j.category))).filter(Boolean);
  // --- QUEUE FILTERING & SORTING ---
  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        (job.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.specificLocation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'new' && job.status === 'pending_operator') ||
        (statusFilter === 'active' && (job.status === 'active' || job.status === 'specialist_selected' || job.status === 'offered')) ||
        (statusFilter === 'completed' && job.status === 'completed');
      const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'time') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'value') {
        return (b.estimatedValue || 0) - (a.estimatedValue || 0);
      } else if (sortBy === 'urgency') {
        const score = (status: string) => {
          if (status === 'pending_operator') return 100;
          if (status === 'offered') return 50;
          if (status === 'specialist_selected' || status === 'active') return 20;
          return 0;
        };
        return score(b.status) - score(a.status);
      }
      return 0;
    });
  const storeState = store.getState();
  const rawSpecialists = storeState.specialists || [];
  const rawUsers = storeState.users || [];
  // Merge registered specialist users with store specialists list
  const mergedSpecialists: any[] = [...rawSpecialists];
  rawUsers.forEach((u) => {
    if (u.role === 'specialist') {
      const existingIdx = mergedSpecialists.findIndex(s => s.id === u.id);
      if (existingIdx !== -1) {
        mergedSpecialists[existingIdx] = {
          ...mergedSpecialists[existingIdx],
          name: u.name || mergedSpecialists[existingIdx].name,
          category: u.category || mergedSpecialists[existingIdx].category,
          categories: u.categories || mergedSpecialists[existingIdx].categories,
          city: u.city || mergedSpecialists[existingIdx].city,
          specialtiesWithLevels: u.specialtiesWithLevels || mergedSpecialists[existingIdx].specialtiesWithLevels,
          status: u.specialistStatus === 'approved' ? 'approved' : (mergedSpecialists[existingIdx].status || 'pending_review')
        };
      } else {
        mergedSpecialists.push({
          id: u.id,
          name: u.name || 'Specialist',
          phone: u.phone || '',
          whatsapp: u.whatsapp || u.phone || '',
          category: u.category || 'Home Services',
          categories: u.categories || [u.category || 'Home Services'],
          city: u.city || 'Portimão',
          balance: 100,
          unlockedJobs: [],
          status: u.specialistStatus === 'approved' ? 'approved' : 'pending_review',
          specialtiesWithLevels: u.specialtiesWithLevels || []
        });
      }
    }
  });
  const approvedSpecialists = mergedSpecialists.filter(
    (s) => (s.status === 'approved' || !s.status) && !blockedSpecialistIds.includes(s.id)
  );
  const matchingSpecialists = approvedSpecialists.filter((s) =>
    isSpecialistMatchingCategory(s, selectedJob?.category, selectedJob?.subcategory)
  );
  const availableSpecialists = showAllSpecialists ? approvedSpecialists : matchingSpecialists;
  // --- CALCULATION HELPERS FOR HEADER ---
  const pendingJobsCount = jobs.filter((j) => j.status === 'pending_operator').length;
  const completedOrPaidJobs = jobs.filter((j) => j.status === 'completed');
  const calculatedEarnings = completedOrPaidJobs.reduce((sum, j) => sum + (j.leadPrice || 0) * 0.40, 0);
  const todaysEarnings = calculatedEarnings;
  const completedPaidCount = completedOrPaidJobs.length;
  const avgPerLead = completedPaidCount > 0 ? (todaysEarnings / completedPaidCount).toFixed(2) : '0.00';
  const showFeedback = (text: string) => {
    setLocalFeedback(text);
    setTimeout(() => setLocalFeedback(null), 3500);
  };
  const handleClaimJob = (jobId: string) => {
    onClaimJob(jobId, activeOperatorId);
    showFeedback(`Taken request #${jobId.slice(-4)} under your review`);
  };
  const handleComplexityChange = (lvl: 'Low' | 'Medium' | 'High' | 'Emergency') => {
    setComplexity(lvl);
    if (lvl === 'Low') { setEstHours('1'); setEstValue('80'); setEstLeadFee('10'); }
    else if (lvl === 'Medium') { setEstHours('3'); setEstValue('150'); setEstLeadFee('15'); }
    else if (lvl === 'High') { setEstHours('6'); setEstValue('350'); setEstLeadFee('35'); }
    else if (lvl === 'Emergency') { setEstHours('2'); setEstValue('280'); setEstLeadFee('35'); }
    showFeedback(`Complexity set to ${lvl}`);
  };
  const handleSendOffer = () => {
    if (!selectedJob) return;
    if (selectedSpecialistIds.length === 0) {
      alert('Please check at least 1 specialist checkbox to send offer.');
      return;
    }
    const h = parseInt(estHours) || 2;
    const v = parseInt(estValue) || 150;
    const f = parseInt(estLeadFee) || 15;
    onOfferJob(selectedJob.id, h, v, f, internalNotes, selectedSpecialistIds);
    showFeedback(`Sent offer to ${selectedSpecialistIds.length} specialists!`);
  };
  const handleDirectAssign = (specialistId: string) => {
    if (!selectedJob) return;
    onSelectSpecialist(selectedJob.id, specialistId);
    showFeedback(`Assigned specialist to request #${selectedJob.id.slice(-4)}`);
  };
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!typedMessage.trim() || !selectedJob) return;
    onAddMessage(selectedJob.id, 'operator', currentUser?.name || 'Territory Partner', typedMessage, operatorChatChannel);
    setTypedMessage('');
  };
  const handleQuickReply = (text: string) => {
    if (!selectedJob) return;
    onAddMessage(selectedJob.id, 'operator', currentUser?.name || 'Territory Partner', text, operatorChatChannel);
    showFeedback(`Sent template reply`);
  };
  const handleChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedJob) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File exceeds the 10MB limit. Please select a smaller file.');
      return;
    }
    setChatUploading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      
      onAddMessage(selectedJob.id, 'operator', currentUser?.name || 'Territory Partner', `Attached document: ${file.name}`, operatorChatChannel, uploadedUrl, file.name);
      showFeedback(`Attached file ${file.name}`);
    } catch (err: any) { alert(`Upload failed: ${err.message || 'Unknown error'}`); }
    finally { setChatUploading(false); }
  };
  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) return;
      if (e.key === ' ' || e.key === '1') {
        e.preventDefault();
        const pending = jobs.filter((j) => j.status === 'pending_operator');
        if (pending.length > 0) { setSelectedJobId(pending[0].id); showFeedback(`Focused waiting request #${pending[0].id.slice(-4)}`); }
        else if (jobs.length > 0) { setSelectedJobId(jobs[0].id); showFeedback(`Focused request #${jobs[0].id.slice(-4)}`); }
      }
      if ((e.key === 'c' || e.key === 'C' || e.key === '2') && selectedJob && !selectedJob.operatorId) {
        e.preventDefault(); handleClaimJob(selectedJob.id);
      }
      if ((e.key === 'p' || e.key === 'P' || e.key === '3') && selectedJob) {
        e.preventDefault(); setEstValue('150'); setEstLeadFee('15'); setEstHours('3'); showFeedback(`Applied standard pricing`);
      }
      if ((e.key === 'o' || e.key === 'O' || e.key === '4') && selectedJob) {
        e.preventDefault();
        if (selectedSpecialistIds.length > 0) handleSendOffer();
        else showFeedback(`Check at least 1 specialist first!`);
      }
      if ((e.key === 's' || e.key === 'S' || e.key === '5') && selectedJob && availableSpecialists.length > 0) {
        e.preventDefault(); handleDirectAssign(availableSpecialists[0].id);
      }
      if ((e.key === 'x' || e.key === 'X' || e.key === '7') && selectedJob && selectedJob.status !== 'completed') {
        e.preventDefault(); onCompleteJob(selectedJob.id); showFeedback(`Marked request #${selectedJob.id.slice(-4)} as completed`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jobs, selectedJob, selectedSpecialistIds, availableSpecialists]);
  // Aggregate files
  const allEvidenceFiles: { url: string; name: string; uploaderRole: string; date: string }[] = [];
  if (selectedJob) {
    if (selectedJob.attachments) {
      selectedJob.attachments.forEach((url, i) => {
        allEvidenceFiles.push({ url, name: `Customer photo ${i + 1}`, uploaderRole: 'customer', date: selectedJob.createdAt });
      });
    }
    selectedJob.messages.forEach((msg) => {
      if (msg.attachmentUrl) {
        allEvidenceFiles.push({ url: msg.attachmentUrl, name: msg.attachmentName || `File from ${msg.senderName}`, uploaderRole: msg.sender, date: msg.timestamp });
      }
    });
  }
  const getStatusBadge = (status: string, createdAt: string) => {
    const diffMins = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60));
    if (status === 'pending_operator') {
      if (diffMins > 30) return { label: `Urgent (${diffMins}m)`, bg: 'bg-red-500/20 text-red-300 border-red-500/40' };
      if (diffMins > 15) return { label: `Waiting (${diffMins}m)`, bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      return { label: `New (${diffMins}m)`, bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
    if (status === 'offered') return { label: 'Awaiting Specialist', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    if (status === 'active' || status === 'specialist_selected') return { label: 'In Progress', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    return { label: 'Completed', bg: 'bg-slate-800 text-slate-400 border-slate-700' };
  };
  return (
    <div className="space-y-4 font-sans text-slate-200 bg-[#0B0F19] min-h-screen pb-6">
      
      {/* LOCAL FEEDBACK BANNER */}
      {localFeedback && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white font-medium text-sm px-4 py-3 rounded-lg shadow-xl flex items-center gap-2.5 border border-emerald-400">
          <CheckCircle className="w-5 h-5 text-white shrink-0" />
          <span>{localFeedback}</span>
        </div>
      )}
      {/* MODAL PHOTO ZOOM */}
      {zoomedPhotoUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setZoomedPhotoUrl(null)}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={zoomedPhotoUrl} alt="Zoomed view" className="max-w-full max-h-[85vh] object-contain rounded-lg border border-slate-700 shadow-2xl" />
            <button className="absolute top-4 right-4 bg-slate-900/90 text-white px-3 py-1.5 rounded-lg border border-slate-700 font-medium text-xs hover:bg-slate-800">
              ✕ Close
            </button>
          </div>
        </div>
      )}
      {/* --- HEADER: TERRITORY PARTNER WORKPLACE BANNER --- */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Side: Territory Partner Info & Current Region */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-base uppercase">
              {(currentUser?.name || 'OP').split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">{currentUser?.name || 'Territory Partner'}</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>📍 Dashboard operating region: <strong>{currentUser?.city && currentUser.city !== 'Algarve Hub' && currentUser.city !== 'Portugal' ? currentUser.city : 'Portimão'}</strong></span>
              </p>
            </div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-slate-800"></div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <button
              onClick={() => setShowCreateOrderModal(true)}
              id="create-lead-tp-btn-terminal-header"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer border border-cyan-400/30 active:scale-95"
              title="Create new Lead from customer inquiry"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>{t("op.createLead", "+ Create Lead")}</span>
            </button>
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span><strong>{pendingJobsCount}</strong> {t("op.reqWaiting", "new requests waiting")}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Time: <strong className="text-slate-200">{currentTime || '12:00'}</strong></span>
            </div>
          </div>
        </div>
        {/* Right Side: TODAY'S EARNINGS (PROMINENT MOTIVATIONAL PANEL) */}
        <div className="w-full md:w-auto bg-gradient-to-r from-emerald-950/40 to-slate-900 p-3.5 px-5 rounded-xl border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between sm:justify-end gap-4 shadow-md">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">{t('op.todayEarnings', "Today's earnings (40% share)")}</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
              €{todaysEarnings.toFixed(2)}
            </div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-emerald-500/20"></div>
          <div className="flex sm:flex-col gap-4 sm:gap-1 text-xs text-slate-300 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-slate-400">{t("op.completedLeads", "Completed leads:")}</span>
              <span className="font-bold text-white bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">{completedPaidCount}</span>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-slate-400">{t("op.avgShare", "Avg. Territory Partner share:")}</span>
              <span className="font-bold text-emerald-400">€{avgPerLead}</span>
            </div>
          </div>
        </div>
      </div>
      {/* --- 3-COLUMN WORKING AREA (ALL ON ONE SCREEN) --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch min-h-[720px]">
        
        {/* --- LEFT COLUMN: REQUESTS QUEUE --- */}
        <div className="xl:col-span-4 2xl:col-span-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col overflow-hidden max-h-[820px] shadow-sm">
          
          {/* Sticky Header & Search */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-900 space-y-3 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span>{t("op.serviceRequests", "Service Requests")} ({filteredJobs.length})</span>
              </h2>
              <button
                onClick={() => setShowCreateOrderModal(true)}
                id="create-lead-tp-btn-requests-panel"
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer border border-cyan-400/30"
                title="Create Lead"
              >
                <Plus className="w-4 h-4" />
                <span>{t("op.createLead", "+ Create Lead")}</span>
              </button>
            </div>
            {/* Simple Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customer, address, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-750 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
            {/* Simple Filter Selectors */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-750 text-xs text-slate-300 rounded-lg p-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="time">{t("op.newestFirst", "Newest first")}</option>
                <option value="urgency">{t("op.byUrgency", "By urgency")}</option>
                <option value="value">{t("op.byCost", "By cost")}</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-750 text-xs text-slate-300 rounded-lg p-1.5 focus:outline-none focus:border-blue-500 cursor-pointer truncate"
              >
                <option value="all">{t("op.allCategories", "All categories")}</option>
                {uniqueCategories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
            {/* Clear Status Tabs */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {(['new', 'active', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 py-1.5 px-1 text-xs font-medium rounded-lg transition-all cursor-pointer text-center truncate ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow font-semibold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {st === 'new' ? `Incoming orders (${pendingJobsCount})` : st === 'active' ? 'In Progress' : 'Completed'}
                </button>
              ))}
            </div>
          </div>
          {/* Compact Request List */}
          <div className="flex-1 overflow-y-auto space-y-2 p-2">
            {filteredJobs.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">{t("op.noOrdersFound", "No orders found.")}</div>
            ) : (
              filteredJobs.map((job) => {
                const isSelected = selectedJobId === job.id;
                const statusBadge = getStatusBadge(job.status, job.createdAt);
                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`flex flex-col p-3 rounded-xl gap-2 transition-all cursor-pointer text-xs border ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 shadow-inner'
                        : 'bg-slate-950 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className={`self-start px-2 py-0.5 rounded text-xxs font-semibold truncate border ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                        <span className="text-white font-bold truncate text-sm mt-1" title={job.specificLocation}>
                          {job.category ? t('categories.' + job.category, job.category) : ''}
                        </span>
                        <span className="text-slate-300 truncate mt-0.5">
                          {job.specificLocation || 'Algarve address not specified'}
                        </span>
                        <span className="text-xxs text-slate-400 mt-1">
                          👤 {job.customerName}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-emerald-400 font-bold text-sm">
                          {job.estimatedValue ? `€${job.estimatedValue}` : '—'}
                        </span>
                        <span className="text-xxs text-slate-400">
                          {job.leadPrice ? `Fee: €${job.leadPrice}` : 'No fee set'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-slate-800/50 flex justify-end" onClick={(e) => e.stopPropagation()}>
                      {job.status === 'pending_operator' ? (
                        <button
                          onClick={() => { setSelectedJobId(job.id); if (!job.operatorId) handleClaimJob(job.id); }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer shadow"
                        >
                          {!job.operatorId ? 'Take request' : 'Set price'}
                        </button>
                      ) : job.status === 'offered' ? (
                        <button
                          onClick={() => setSelectedJobId(job.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-all cursor-pointer shadow"
                        >
                          Select specialist
                        </button>
                      ) : job.status === 'active' || job.status === 'specialist_selected' ? (
                        <button
                          onClick={() => setSelectedJobId(job.id)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs transition-all cursor-pointer"
                        >
                          Open request
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedJobId(job.id)}
                          className="px-3 py-1.5 bg-slate-900 text-slate-400 rounded-lg text-xs border border-slate-800"
                        >
                          View details
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* --- CENTER COLUMN: CURRENT REQUEST --- */}
        <div className="xl:col-span-5 2xl:col-span-6 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col overflow-y-auto max-h-[820px] shadow-sm p-4 space-y-4">
          {!selectedJob ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 text-sm space-y-3">
              <Briefcase className="w-12 h-12 text-slate-600" />
              <p className="font-semibold text-slate-300">{t("op.noRequestSelected", "No request selected")}</p>
              <p className="text-xs text-slate-500">Press <kbd className="bg-slate-800 px-2 py-1 rounded text-blue-300 border border-slate-700">[Space]</kbd> {t("op.pressSpace", "on your keyboard or select any request from the left queue to begin work.")}</p>
            </div>
          ) : (
            <>
              {/* Request Title & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                    Request #{selectedJob.id.slice(-4)}
                  </span>
                  <span className="text-xs text-slate-400">
                    Created {new Date(selectedJob.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                    selectedJob.status === 'pending_operator' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    selectedJob.status === 'offered' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                    selectedJob.status === 'active' || selectedJob.status === 'specialist_selected' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {selectedJob.status === 'pending_operator' ? 'Incoming Order' : selectedJob.status === 'offered' ? 'Awaiting Specialist' : selectedJob.status === 'active' || selectedJob.status === 'specialist_selected' ? 'In Progress' : 'Completed'}
                  </span>
                </div>
              </div>
              {/* SECTION 1: CUSTOMER & SERVICE ADDRESS (PRIMARY FIELD) */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>{t("op.serviceAddress", "Service address (Primary location)")}</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 shadow-inner">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white leading-snug truncate" title={selectedJob.specificLocation}>
                      📍 {selectedJob.specificLocation || 'Algarve street address required'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      City: <strong className="text-slate-200">{selectedJob.city}</strong> {selectedJob.district && `• District: ${selectedJob.district}`}
                    </p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${selectedJob.specificLocation}, ${selectedJob.city}`);
                        showFeedback('Address copied to clipboard');
                      }}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-750 transition-all text-xs font-medium flex items-center gap-1 cursor-pointer"
                      title="Copy address"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedJob.specificLocation}, ${selectedJob.city}, Portugal`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-xs font-medium flex items-center gap-1 cursor-pointer"
                      title="Open in Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Maps</span>
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xxs font-medium text-slate-400 block uppercase tracking-wider">{t("op.customerName", "Customer name")}</span>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span>{selectedJob.customerName}</span>
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xxs font-medium text-slate-400 block uppercase tracking-wider">{t("op.contactPhone", "Contact phone")}</span>
                      <span className="text-xs font-bold text-white mt-0.5 block font-mono">
                        {phoneRevealed ? selectedJob.customerPhone : '+351 912 *** ***'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={getWhatsAppUrl(
                          selectedJob.customerPhone,
                          `Hello ${selectedJob.customerName}! I am your NordBase Territory Partner. Regarding your order #${selectedJob.id.slice(-4)} for ${selectedJob.category} in ${selectedJob.city}...`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded border border-emerald-400/30 transition-all text-xxs font-bold cursor-pointer flex items-center gap-1 shadow-sm"
                        title="Open WhatsApp Chat in 1 Click"
                      >
                        <span>💬 WhatsApp</span>
                      </a>
                      <button
                        onClick={() => {
                          setPhoneRevealed(!phoneRevealed);
                          if (!phoneRevealed) showFeedback(`Revealed phone: ${selectedJob.customerPhone}`);
                        }}
                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-blue-300 rounded border border-slate-750 transition-all text-xxs font-medium cursor-pointer"
                      >
                        {phoneRevealed ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-xxs font-semibold text-slate-400 uppercase tracking-wider block">
                    Problem description ({selectedJob.category})
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    "{selectedJob.description}"
                  </p>
                </div>
                {selectedJob.attachments && selectedJob.attachments.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xxs font-semibold text-slate-400 uppercase tracking-wider block">
                      Customer photos ({selectedJob.attachments.length})
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedJob.attachments.map((url, i) => (
                        <div
                          key={i}
                          onClick={() => setZoomedPhotoUrl(url)}
                          className="w-16 h-16 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 cursor-pointer hover:border-blue-500 transition-all group relative"
                        >
                          <img src={url} alt="Customer photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xxs font-bold text-white">
                            View
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* JOB SIGN-OFF & REVIEW STATUS (VISIBLE TO TP) */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-blue-900/40 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-blue-900/30 pb-2">
                    <span className="text-xxs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{t("op.confirmedTP", "Confirmation & Rating (Visible to TP)")}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {selectedJob.status === 'completed' ? 'Pedido Concluído' : 'Em Curso'}
                    </span>
                  </div>
                  {/* Sign-off statuses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className={`p-2 rounded-lg border text-[11px] font-medium flex items-center gap-2 ${
                      selectedJob.customerCompleted
                        ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <span className="text-base">{selectedJob.customerCompleted ? '✔' : '⏳'}</span>
                      <div>
                        <span className="font-bold block text-[10px] uppercase tracking-wider text-slate-400">{t("op.customer", "Customer")}:</span>
                        <span>{selectedJob.customerCompleted ? t('op.workDone', 'Services performed, no claims') : t('op.waitConfirm', 'Waiting for confirmation')}</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg border text-[11px] font-medium flex items-center gap-2 ${
                      selectedJob.specialistCompleted
                        ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <span className="text-base">{selectedJob.specialistCompleted ? '✔' : '⏳'}</span>
                      <div>
                        <span className="font-bold block text-[10px] uppercase tracking-wider text-slate-400">{t("op.specialist", "Specialist")}:</span>
                        <span>{selectedJob.specialistCompleted ? t('op.workDoneSpec', 'Work performed, payment received, no claims') : t('op.waitConfirm', 'Waiting for confirmation')}</span>
                      </div>
                    </div>
                  </div>
                  {/* Customer rating & positive tags */}
                  {selectedJob.rating && (
                    <div className="pt-2 border-t border-slate-900 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-300 font-medium">Avaliação do {t("op.specialist", "Specialist")}:</span>
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${star <= selectedJob.rating! ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-amber-300 font-mono">({selectedJob.rating}/5 ⭐)</span>
                      </div>
                      {selectedJob.positiveTags && selectedJob.positiveTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {selectedJob.positiveTags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-[10px] font-semibold rounded-md">
                              👍 {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {selectedJob.customerComment && (
                        <p className="text-xs text-slate-300 italic bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                          "{selectedJob.customerComment}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* SECTION 2: REQUEST QUALIFICATION */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>{t("op.reqQual", "Request qualification & complexity")}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(['Low', 'Medium', 'High', 'Emergency'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleComplexityChange(lvl)}
                      className={`py-2 px-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-center truncate ${
                        complexity === lvl
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {lvl === 'Low' ? '🟢 Simple (~1h)' : lvl === 'Medium' ? '🟡 Standard (~3h)' : lvl === 'High' ? '🟠 Major (~6h)' : '🔴 Urgent'}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-5">
                    <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Estimated work hours
                    </label>
                    <input
                      type="number"
                      value={estHours}
                      onChange={(e) => setEstHours(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-7 flex gap-1.5 items-end pt-4">
                    {['1', '2', '3', '4', '6'].map((hr) => (
                      <button
                        key={hr}
                        onClick={() => { setEstHours(hr); showFeedback(`Estimated hours set to ${hr} hours`); }}
                        className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all cursor-pointer"
                      >
                        {hr}h
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex justify-between">
                    <span>{t("op.internalNotes", "Internal notes for dispatch team (Private)")}</span>
                    <span className="text-emerald-400 font-normal">Saved automatically</span>
                  </label>
                  <textarea
                    rows={2}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add details about customer availability, gate codes, tools required, or material constraints..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
              {/* SECTION 3: PRICE & FEE ESTIMATION */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>{t("op.priceEst", "Price & fee estimation")}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider">
                      Estimated work value (€)
                    </label>
                    <input
                      type="number"
                      value={estValue}
                      onChange={(e) => setEstValue(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-emerald-400 font-bold text-base focus:outline-none focus:border-emerald-500"
                    />
                    <div className="flex gap-1.5 pt-0.5">
                      {['80', '150', '300', '500'].map((val) => (
                        <button
                          key={val}
                          onClick={() => { setEstValue(val); setEstLeadFee(Math.round(parseInt(val) * 0.1).toString()); }}
                          className="flex-1 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-xxs font-semibold border border-slate-800 cursor-pointer"
                        >
                          €{val}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                      <span>{t("op.leadFee", "Lead fee (€)")}</span>
                      <span className="text-blue-400 font-normal">{t("op.commAmount", "Commission Amount")}</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={estLeadFee}
                        onChange={(e) => setEstLeadFee(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-blue-300 font-bold text-sm focus:outline-none focus:border-blue-500 w-full"
                      />
                      <select
                        value={estLeadFee}
                        onChange={(e) => setEstLeadFee(e.target.value)}
                        className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-slate-300 font-semibold text-xs focus:outline-none focus:border-blue-500 w-full cursor-pointer"
                      >
                        <option value="">-- Presets --</option>
                        {['10', '15', '20', '25', '30', '35', '40', '45', '50', '60', '70', '80', '90', '100', '120', '150', '200'].map(fee => (
                          <option key={fee} value={fee}>€{fee} Lead Fee</option>
                        ))}
                      </select>
                    </div>
                    {/* Stripe Payment Link */}
                    {estLeadFee && (
                      <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-2 mt-2 space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400">
                          <span className="font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                            LIVE LINK GENERATED
                          </span>
                          <span className="text-slate-500 text-[9px]">Stripe Gateway</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded border border-blue-950/80 justify-between">
                          <span className="text-[9px] font-mono text-slate-400 truncate max-w-[190px]">
                            https://stripe.com/pay/nordbase_lead_{selectedJob?.id?.slice(-5)}_{estLeadFee}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`https://stripe.com/pay/nordbase_lead_${selectedJob?.id?.slice(-5)}_${estLeadFee}`);
                              alert("Copied Stripe payment link to clipboard!");
                            }}
                            title="Copy payment link"
                            className="text-cyan-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* SECTION 4: AVAILABLE SPECIALISTS WITH CATEGORY & SUBCATEGORY MATCHING */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 flex-wrap">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>{t("op.assignSpec", "Assign Specialist")}</span>
                    {selectedJob?.category && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-cyan-300 border border-blue-500/30 text-[10px] font-mono font-bold rounded">
                        {selectedJob.category}
                      </span>
                    )}
                    {selectedJob?.subcategory && (
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold rounded">
                        {selectedJob.subcategory}
                      </span>
                    )}
                  </label>
                  {/* Category & Subcategory filter toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowAllSpecialists(!showAllSpecialists)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                      !showAllSpecialists
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                    title={!showAllSpecialists ? 'Filter active: category & subcategory match only' : 'Show all specialists'}
                  >
                    <span>{!showAllSpecialists ? `🎯 Profile & Subcategory Match (${matchingSpecialists.length})` : `🌐 All Specialists (${approvedSpecialists.length})`}</span>
                  </button>
                </div>
                {/* Warning banner if no specialists match this specific category / subcategory */}
                {!showAllSpecialists && matchingSpecialists.length === 0 && selectedJob && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold">No verified contractors matching "{selectedJob.category}"{selectedJob.subcategory ? ` / "${selectedJob.subcategory}"` : ''}</p>
                      <p className="text-[11px] text-slate-300">
                        There are no verified specialists for "{selectedJob.category}"{selectedJob.subcategory ? ` (${selectedJob.subcategory})` : ''} in {selectedJob.city || 'Algarve'} yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAllSpecialists(true)}
                        className="mt-1 text-xs font-bold text-cyan-400 underline hover:text-cyan-300 cursor-pointer"
                      >
                        Show all regional specialists →
                      </button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <select 
                    value={selectedSpecialistIds[0] || ''}
                    onChange={(e) => setSelectedSpecialistIds(e.target.value ? [e.target.value] : [])}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
                  >
                    <option value="">-- Select a specialist ({availableSpecialists.length}) --</option>
                    {availableSpecialists.map((spec, idx) => {
                      const calculatedDist = ((idx + 1) * 1.4).toFixed(1);
                      const isMatch = isSpecialistMatchingCategory(spec, selectedJob?.category, selectedJob?.subcategory);
                      const mainCat = spec.category || (Array.isArray(spec.categories) ? spec.categories[0] : 'General Services');
                      return (
                        <option key={spec.id} value={spec.id}>
                          {isMatch ? '✅' : '⚠️'} {spec.name} • [{mainCat}] (⭐ 4.9, ~{calculatedDist} km) {!isMatch ? '(Adjacent Profile)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {/* Selected Specialist Preview Card */}
                {selectedSpecialistIds.length > 0 && (() => {
                  const activeSpec = availableSpecialists.find(s => s.id === selectedSpecialistIds[0]);
                  if (!activeSpec) return null;
                  const isMatch = isSpecialistMatchingCategory(activeSpec, selectedJob?.category, selectedJob?.subcategory);
                  const specCat = activeSpec.category || (Array.isArray(activeSpec.categories) ? activeSpec.categories.join(', ') : 'General Services');
                  return (
                    <div className={`p-3 rounded-xl border space-y-1.5 transition-all ${
                      isMatch 
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
                        : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                    }`}>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{activeSpec.name}</span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                              isMatch ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                            }`}>
                              {isMatch ? '✅ Category & Subcategory Match' : '⚠️ Warning: Adjacent Profile'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1">
                            Profile: <strong className="text-white">{specCat}</strong> • City: <strong>{activeSpec.city || selectedJob?.city}</strong>
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
                          Balance: €{activeSpec.balance ?? 100}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
              {/* COCKPIT ACTION FOOTER */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2 justify-end">
                {selectedJob.status === 'pending_operator' || selectedJob.status === 'offered' ? (
                  <>
                    <div className="flex w-full gap-2">
                      <button
                        onClick={() => {
                          if(selectedSpecialistIds.length === 0) return alert('Please select a specialist');
                          window.open(`https://wa.me/?text=New order: ${selectedJob.category} - ${selectedJob.city}. Confirm: https://app.nordbase.pt/job/${selectedJob.id}`, '_blank');
                          handleDirectAssign(selectedSpecialistIds[0]);
                        }}
                        disabled={selectedSpecialistIds.length === 0}
                        className="flex-1 py-3 bg-[#25D366] hover:bg-[#1ebd5a] disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{t("op.sendWA", "Send via WhatsApp")}</span>
                      </button>
                      <button
                        onClick={() => {
                          if(selectedSpecialistIds.length === 0) return alert('Please select a specialist');
                          onAddMessage(selectedJob.id, 'operator', currentUser?.name || 'Territory Partner', `New order (Lead): ${selectedJob.category} in ${selectedJob.city}. Client is waiting for a call!`, 'operator_specialist');
                          handleDirectAssign(selectedSpecialistIds[0]);
                        }}
                        disabled={selectedSpecialistIds.length === 0}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>{t("op.sendWebChat", "Send to Web Chat")}</span>
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        alert('Order transferred to the neighboring region.');
                        setSelectedJobId(null);
                      }}
                      className="w-full py-2.5 mt-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer border border-slate-700 flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>{t("op.transferRegion", "Transfer to other region")}</span>
                    </button>
                  </>
                ) : selectedJob.status === 'active' || selectedJob.status === 'specialist_selected' ? (
                  <div className="w-full space-y-3 bg-slate-950/80 border border-emerald-500/30 p-4 rounded-xl">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{t("op.completionChecklist", "Tripartite Order Completion Checklist")} #{selectedJob.id.slice(-5)}</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">
                        Pro: {selectedJob.unlockedBySpecialistName || 'Assigned'}
                      </span>
                    </div>
                    {/* 3-STAGE TRIPARTITE CONFIRMATION CHECKLIST */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Stage 1: Specialist Confirmation */}
                      <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                        selectedJob.specialistCompleted
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        <CheckCircle className={`w-4 h-4 shrink-0 ${selectedJob.specialistCompleted ? 'text-emerald-400' : 'text-slate-600'}`} />
                        <div>
                          <div className="font-bold">1. {t("op.specialist", "Specialist")}</div>
                          <div className="text-[10px]">
                            {selectedJob.specialistCompleted
                              ? '✔ Work finished, payment received'
                              : '⏳ Job in progress...'}
                          </div>
                        </div>
                      </div>
                      {/* Stage 2: Customer Confirmation */}
                      <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                        selectedJob.customerCompleted
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        <Star className={`w-4 h-4 shrink-0 ${selectedJob.customerCompleted ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                        <div>
                          <div className="font-bold flex items-center gap-1">
                            <span>2. {t("op.customer", "Customer")}</span>
                            {selectedJob.rating && <span className="text-amber-400">({selectedJob.rating}⭐)</span>}
                          </div>
                          <div className="text-[10px]">
                            {selectedJob.customerCompleted
                              ? '✔ Approved work, no disputes'
                              : '⏳ Awaiting review & approval'}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                      <a
                        href={getWhatsAppUrl(
                          selectedJob.unlockedBySpecialistPhone || '+351 912 888 777',
                          `Hello ${selectedJob.unlockedBySpecialistName || 'Specialist'}! Territory Partner regarding order #${selectedJob.id.slice(-4)} (${selectedJob.category})...`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        title="Chat with Specialist on WhatsApp"
                      >
                        <span>💬 {t("op.waSpecialist", "WhatsApp Specialist")}</span>
                      </a>
                      {selectedJob.specialistCompleted && selectedJob.customerCompleted ? (
                        <button
                          onClick={() => onCompleteJob(selectedJob.id)}
                          className="px-5 py-2.5 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg flex items-center gap-2 border bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 border-cyan-300/40 animate-pulse"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{t("op.finalizeOrder", "Finalize & Close Order")}</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-5 py-2.5 font-bold rounded-xl text-xs bg-slate-800/80 text-slate-500 border border-slate-700/50 flex items-center gap-2 cursor-not-allowed opacity-70"
                          title="Both Customer and Specialist must confirm completion before TP can finalize order"
                        >
                          <CheckCircle className="w-4 h-4 text-slate-500" />
                          <span>Awaiting Customer & Specialist Sign-offs</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 text-center py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
                    ✔ Order Completed
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {/* --- RIGHT COLUMN: COMMUNICATION --- */}
        <div className="xl:col-span-3 2xl:col-span-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col overflow-hidden max-h-[820px] shadow-sm">
          
          <div className="flex border-b border-slate-800 bg-slate-900 p-1 flex-wrap gap-1">
            <button
              onClick={() => setContextTab('chat')}
              className={`flex-1 min-w-[50px] py-1.5 text-xxs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 ${
                contextTab === 'chat' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>{t("op.chat", "Chat")}</span>
            </button>
            <button
              onClick={() => setContextTab('files')}
              className={`flex-1 min-w-[50px] py-1.5 text-xxs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 ${
                contextTab === 'files' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>{t("op.files", "Files")} ({allEvidenceFiles.length})</span>
            </button>
            <button
              onClick={() => setContextTab('history')}
              className={`flex-1 min-w-[50px] py-1.5 text-xxs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 ${
                contextTab === 'history' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{t("op.history", "History")}</span>
            </button>
          </div>
          {/* TAB 1: LIVE CHAT */}
          {contextTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex bg-slate-950 p-1 border-b border-slate-800 text-xxs overflow-x-auto gap-1">
                {selectedJob ? (() => {
                  const custCount = selectedJob.messages.filter(m => (m.channel || 'customer_operator') === 'customer_operator').length;
                  const specCount = selectedJob.messages.filter(m => m.channel === 'operator_specialist').length;
                  const teamCount = selectedJob.messages.filter(m => m.channel === 'operator_operator').length;
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => setOperatorChatChannel('customer_operator')}
                        className={`flex-1 py-1.5 px-2 font-medium rounded-lg transition-all cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5 ${
                          operatorChatChannel === 'customer_operator' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{t("op.chatCustomer", "Customer chat")}</span>
                        {custCount > 0 && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-blue-500/20 text-blue-300 font-bold rounded-full border border-blue-500/30">
                            {custCount}
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOperatorChatChannel('operator_specialist')}
                        className={`flex-1 py-1.5 px-2 font-medium rounded-lg transition-all cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5 ${
                          operatorChatChannel === 'operator_specialist' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{t("op.chatSpecialist", "Specialist chat")}</span>
                        {specCount > 0 && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/20 text-amber-300 font-bold rounded-full border border-amber-500/30">
                            {specCount}
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOperatorChatChannel('operator_operator')}
                        className={`flex-1 py-1.5 px-2 font-medium rounded-lg transition-all cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5 ${
                          operatorChatChannel === 'operator_operator' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{t("op.teamNote", "Team note")}</span>
                        {teamCount > 0 && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-purple-500/20 text-purple-300 font-bold rounded-full border border-purple-500/30">
                            {teamCount}
                          </span>
                        )}
                      </button>
                    </>
                  );
                })() : (
                  <>
                    <button
                      type="button"
                      onClick={() => setOperatorChatChannel('customer_operator')}
                      className={`flex-1 py-1.5 px-2 font-medium rounded-lg transition-all cursor-pointer text-center whitespace-nowrap ${
                        operatorChatChannel === 'customer_operator' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Customer chat
                    </button>
                    <button
                      type="button"
                      onClick={() => setOperatorChatChannel('operator_specialist')}
                      className={`flex-1 py-1.5 px-2 font-medium rounded-lg transition-all cursor-pointer text-center whitespace-nowrap ${
                        operatorChatChannel === 'operator_specialist' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Specialist chat
                    </button>
                    <button
                      type="button"
                      onClick={() => setOperatorChatChannel('operator_operator')}
                      className={`flex-1 py-1.5 px-2 font-medium rounded-lg transition-all cursor-pointer text-center whitespace-nowrap ${
                        operatorChatChannel === 'operator_operator' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Team note
                    </button>
                  </>
                )}
              </div>
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 flex flex-col bg-slate-950/40" id="op-chat-history">
                {!selectedJob ? (
                  <div className="text-center py-12 text-slate-500 text-xs">{t("op.selectReqChat", "Select a request to view chat messages.")}</div>
                ) : (
                  (() => {
                    const dummyUser = { id: activeOperatorId || 'operator-user', email: currentUser?.email || 'operator@nordbase.pt', name: currentUser?.name || 'Territory Partner', role: 'operator' as const, specialistStatus: 'not_requested' as const };
                    const visibleMessages = selectedJob.messages.filter((msg) => {
                      const channel = msg.channel || 'customer_operator';
                      return canViewChat(dummyUser, { type: 'job', job: selectedJob, channel: channel }) && channel === operatorChatChannel;
                    });
                    if (visibleMessages.length === 0) {
                      return <div className="text-center py-12 text-slate-500 text-xs">{t("op.noMsgChat", "No messages in this chat yet.")}</div>;
                    }
                    return visibleMessages.map((msg) => {
                      const isCoord = msg.sender === 'operator' || msg.sender === 'super_admin' || msg.sender === 'regional_admin';
                      const isSystem = msg.sender === 'system';
                      const isSpecialist = msg.sender === 'specialist';
                      const storeState = store.getState();
                      const msgAvatar = msg.senderAvatar || (
                        isCoord
                          ? (currentUser?.photoUrl || currentUser?.avatar || '/portimao_tp.jpg')
                          : isSpecialist
                            ? (specialists.find(s => s.name === msg.senderName || s.id === selectedJob.unlockedBySpecialistId)?.photoUrl)
                            : (storeState.users.find(u => u.name === msg.senderName || u.email === selectedJob.customerEmail)?.photoUrl)
                      );
                      return (
                        <div key={msg.id} className={`flex max-w-[85%] gap-2 ${isCoord ? 'self-end items-end flex-row-reverse' : isSystem ? 'mx-auto items-center text-center max-w-full' : 'self-start items-start flex-row'}`}>
                          {isSystem ? (
                            <div className="bg-slate-950 text-slate-400 text-xxs px-3 py-1.5 rounded-full border border-slate-800 my-1">{msg.content}</div>
                          ) : (
                            <>
                              {!isSystem && (
                                <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-700 bg-slate-800 shrink-0 mt-4 shadow-sm">
                                  {msgAvatar ? (
                                    <img src={msgAvatar} alt={msg.senderName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-[10px]">
                                      {msg.senderName?.charAt(0) || 'U'}
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className={`flex flex-col ${isCoord ? 'items-end' : 'items-start'}`}>
                                <span className="text-xxs text-slate-400 mb-1 px-1">{msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <div className={`p-3 rounded-xl text-xs leading-relaxed ${isCoord ? 'bg-blue-600 text-white rounded-tr-none' : isSpecialist ? 'bg-amber-600 text-white rounded-tl-none font-medium' : 'bg-slate-950 text-slate-200 rounded-tl-none border border-slate-800'}`}>
                                  <AITranslatedMessage content={msg.content} context="Territorial Operator Terminal Chat" />
                                  {msg.attachmentUrl && (
                                    <div className="mt-2 p-2 bg-black/30 rounded-lg border border-white/10 flex items-center gap-2.5">
                                      {msg.attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                        <img src={msg.attachmentUrl} alt="Attachment" referrerPolicy="no-referrer" className="w-12 h-12 object-cover rounded border border-white/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open(msg.attachmentUrl, '_blank')} />
                                      ) : (<FileText className="w-6 h-6 text-blue-300 shrink-0" />)}
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-xxs text-white font-medium truncate">{msg.attachmentName || 'Uploaded document'}</span>
                                        <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-xxs text-blue-300 font-semibold hover:underline mt-0.5 inline-block">{t("op.download", "Download")}</a>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    });
                  })()
                )}
              </div>
              {selectedJob && (
                <div className="p-2 bg-slate-950 border-t border-slate-800 flex gap-1.5 overflow-x-auto text-xxs">
                  <span className="text-slate-400 self-center shrink-0 font-medium px-1">{t("op.quickReply", "Quick reply:")}</span>
                  <button type="button" onClick={() => handleQuickReply("Hello! I am calling you now to clarify your request details.")} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 whitespace-nowrap cursor-pointer hover:text-white">{t("op.callingNow", "\"Calling now...\"")}</button>
                  <button type="button" onClick={() => handleQuickReply("We have notified available specialists in your area. A contractor will accept shortly.")} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 whitespace-nowrap cursor-pointer hover:text-white">{t("op.specNotified", "\"Specialists notified...\"")}</button>
                  <button type="button" onClick={() => handleQuickReply("Checking in to see if the specialist arrived on time and everything is going well.")} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 whitespace-nowrap cursor-pointer hover:text-white">"Checking progress..."</button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 items-center">
                <label className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-all shrink-0 flex items-center justify-center" title="Attach photo or document">
                  <Paperclip className="w-4 h-4" />
                  <input type="file" className="hidden" onChange={handleChatFileUpload} disabled={chatUploading || !selectedJob} />
                </label>
                <input maxLength={2000} type="text" placeholder={chatUploading ? "Uploading file..." : `Type message...`} value={typedMessage} disabled={chatUploading || !selectedJob} onChange={(e) => setTypedMessage(e.target.value)} className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-750 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                <AIMessagePolisher currentText={typedMessage} onApply={(improved) => setTypedMessage(improved)} context="Territorial Operator customer dispatch" />
                <button type="submit" disabled={chatUploading || !selectedJob || !typedMessage.trim()} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
          {/* TAB 2: FILES */}
          {contextTab === 'files' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Attached photos & documents</span>
              </div>
              {allEvidenceFiles.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">No files have been uploaded to this request yet.</div>
              ) : (
                <div className="space-y-2">
                  {allEvidenceFiles.map((file, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {file.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                          <img src={file.url} alt="Thumbnail" referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded border border-slate-800 cursor-pointer hover:scale-105 transition-transform shrink-0" onClick={() => setZoomedPhotoUrl(file.url)} />
                        ) : (<div className="w-10 h-10 rounded bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0"><FileText className="w-5 h-5" /></div>)}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{file.name}</p>
                          <p className="text-xxs text-slate-400">Uploaded by <strong className="text-slate-300 capitalize">{file.uploaderRole}</strong> • {new Date(file.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-blue-400 rounded border border-slate-750 text-xxs font-medium whitespace-nowrap">Open</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* TAB 3: HISTORY */}
          {contextTab === 'history' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Request history log</span>
              </div>
              {!selectedJob ? (
                <div className="text-center py-12 text-slate-500 text-xs">Select a request to view its chronological history.</div>
              ) : (
                <div className="space-y-3 pl-3 border-l-2 border-slate-800 my-2">
                  <div className="relative pl-4">
                    <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-950"></div>
                    <p className="text-xs font-bold text-white">Request created by customer</p>
                    <p className="text-xxs text-slate-400">{new Date(selectedJob.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedJob.operatorId && (
                    <div className="relative pl-4">
                      <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-slate-950"></div>
                      <p className="text-xs font-bold text-white">Taken by {currentUser?.name || 'Territory Partner'}</p>
                      <p className="text-xxs text-slate-400">Under dispatcher review & pricing</p>
                    </div>
                  )}
                  {selectedJob.estimatedValue && (
                    <div className="relative pl-4">
                      <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-950"></div>
                      <p className="text-xs font-bold text-white">Price estimated at €{selectedJob.estimatedValue}</p>
                      <p className="text-xxs text-slate-400">Lead fee set at €{selectedJob.leadPrice || 15}</p>
                    </div>
                  )}
                  {selectedJob.status === 'offered' && (
                    <div className="relative pl-4">
                      <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-950"></div>
                      <p className="text-xs font-bold text-white">Offer sent to available specialists</p>
                      <p className="text-xxs text-slate-400">Waiting for contractor to accept job</p>
                    </div>
                  )}
                  {(selectedJob.status === 'specialist_selected' || selectedJob.status === 'active' || selectedJob.status === 'completed') && (
                    <div className="relative pl-4">
                      <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"></div>
                      <p className="text-xs font-bold text-white">Specialist assigned: {selectedJob.unlockedBySpecialistName || 'Contractor'}</p>
                      <p className="text-xxs text-slate-400">Direct contact opened</p>
                    </div>
                  )}
                  {selectedJob.status === 'completed' && (
                    <div className="relative pl-4">
                      <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-slate-500 border-2 border-slate-950"></div>
                      <p className="text-xs font-bold text-slate-300">Request completed & closed</p>
                      <p className="text-xxs text-slate-400">Lead fee earned</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* --- BOTTOM ACTION BAR: SHORTCUTS --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white flex items-center gap-1.5"><span>⌨️ Keyboard shortcuts:</span></span>
          <span className="text-slate-400 hidden lg:inline">Use your keyboard to process service requests instantly without touching the mouse.</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => { const pending = jobs.filter((j) => j.status === 'pending_operator'); if (pending.length > 0) setSelectedJobId(pending[0].id); }} className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 font-medium rounded border border-slate-800 flex items-center gap-1.5 cursor-pointer transition-all">
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-400 font-mono text-xxs">[Space]</kbd>
            <span>Next waiting request</span>
          </button>
          <button onClick={() => selectedJob && !selectedJob.operatorId && handleClaimJob(selectedJob.id)} disabled={!selectedJob || !!selectedJob.operatorId} className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-medium rounded border border-slate-800 flex items-center gap-1.5 cursor-pointer transition-all">
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-mono text-xxs">[C]</kbd>
            <span>Take request</span>
          </button>
          <button onClick={() => { if (selectedJob) { setEstValue('150'); setEstLeadFee('15'); setEstHours('3'); showFeedback(`Applied standard pricing`); } }} disabled={!selectedJob} className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-medium rounded border border-slate-800 flex items-center gap-1.5 cursor-pointer transition-all">
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400 font-mono text-xxs">[P]</kbd>
            <span>Set standard price (€150)</span>
          </button>
          <button onClick={() => selectedJob && selectedSpecialistIds.length > 0 && handleSendOffer()} disabled={!selectedJob || selectedSpecialistIds.length === 0} className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-medium rounded flex items-center gap-1.5 cursor-pointer transition-all">
            <kbd className="bg-black/20 px-1.5 py-0.5 rounded text-white font-mono text-xxs">[O]</kbd>
            <span>Send offer</span>
          </button>
          <button onClick={() => selectedJob && availableSpecialists.length > 0 && handleDirectAssign(availableSpecialists[0].id)} disabled={!selectedJob || availableSpecialists.length === 0} className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-medium rounded border border-slate-800 flex items-center gap-1.5 cursor-pointer transition-all">
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-xxs">[S]</kbd>
            <span>Assign specialist</span>
          </button>
          <button onClick={() => selectedJob && onCompleteJob(selectedJob.id)} disabled={!selectedJob || selectedJob.status === 'completed'} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 font-medium rounded flex items-center gap-1.5 cursor-pointer transition-all">
            <kbd className="bg-slate-950 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800 font-mono text-xxs">[X]</kbd>
            <span>Complete request</span>
          </button>
        </div>
      </div>
      {/* CREATE ORDER MODAL */}
      <CreateOrderModal
        isOpen={showCreateOrderModal}
        onClose={() => setShowCreateOrderModal(false)}
        operatorCity={currentUser?.city || 'Portimão'}
        operatorId={activeOperatorId}
        specialists={approvedSpecialists}
        onOrderCreated={(newJobId) => {
          setSelectedJobId(newJobId);
          showFeedback(`Order #${newJobId.slice(-4)} successfully created and published!`);
        }}
      />
    </div>
  );
}