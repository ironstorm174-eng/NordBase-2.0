/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AITranslatedMessage } from './AITranslatedMessage';
import { Job } from '../types';
import { store } from '../store';
import { canViewChat } from '../lib/permissions';
import { uploadImage, uploadAvatar } from '../utils/upload';
import { getWhatsAppUrl } from '../utils/whatsapp';
import OperatorLeadsTerminal from './OperatorLeadsTerminal';
import Academy from './Academy';
import HubChat from './HubChat';
import CreateOrderModal from './CreateOrderModal';
import NordBasePricingCalculator from './NordBasePricingCalculator';
import CalculatorsPage from './calculators/CalculatorsPage';
import {
  Headphones,
  MessageSquare,
  Send,
  Clock,
  Euro,
  MapPin,
  User,
  GraduationCap,
  Phone,
  CheckCircle,
  FileText,
  AlertCircle,
  Search,
  Filter,
  Check,
  Briefcase, Inbox,
  ExternalLink,
  Lock,
  Unlock,
  Bell,
  Ticket,
  Plus,
  PhoneCall,
  PlusCircle,
  BookOpen,
  Heart,
  LifeBuoy,
  Paperclip,
  ArrowRight,
  LogOut,
  Camera,
  Upload,
  Trash2,
  Building2,
  Layers,
  Calculator,
} from 'lucide-react';
interface OperatorDashboardProps {
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
}
// 80 Operators mapping across the 8 cities of Algarve
const OPERATOR_CITIES = [
  { city: 'Portimão', count: 12 },
  { city: 'Faro', count: 12 },
  { city: 'Loulé', count: 12 },
  { city: 'Albufeira', count: 12 },
  { city: 'Lagos', count: 8 },
  { city: 'Tavira', count: 8 },
  { city: 'Lagoa', count: 8 },
  { city: 'Silves', count: 8 }
];
const ALL_80_OPERATORS = OPERATOR_CITIES.flatMap(({ city, count }) => {
  return Array.from({ length: count }, (_, i) => {
    const num = i + 1;
    const name = `${city} ${num}`;
    const id = `op-${city.toLowerCase()}-${num}`;
    const email = `${city.toLowerCase()}${num}@nordbase.pt`;
    
    const seed = (city.charCodeAt(0) + num) % 7;
    const statusVal = seed === 0 ? 'offline' : seed === 1 ? 'busy' : seed === 2 ? 'idle' : seed === 3 ? 'overloaded' : 'online';
    const activeLeads = statusVal === 'offline' ? 0 : statusVal === 'idle' ? 0 : (seed % 4) + 1;
    const workloadLevel = statusVal === 'overloaded' ? 'critical' : statusVal === 'offline' ? 'low' : statusVal === 'busy' ? 'high' : activeLeads > 2 ? 'high' : 'medium';
    const perf = 82 + (seed * 3) % 18;
    const avgResponse = statusVal === 'offline' ? 0 : 35 + (seed * 12) % 80;
    return {
      id,
      name,
      email,
      status: statusVal,
      activeLeads,
      avgResponseSeconds: avgResponse,
      workloadLevel,
      performanceScore: perf,
      zone: city
    };
  });
});
export default function OperatorDashboard({
  jobs,
  onClaimJob,
  onOfferJob,
  onSelectSpecialist,
  onCompleteJob,
  onAddMessage,
  activeOperatorId,
}: OperatorDashboardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  // Dashboard view selection (Lead Ops vs Workspace Noticeboard vs Support Desk)
  const [activePortalTab, setActivePortalTab] = useState<'customers' | 'specialists' | 'regional_admin' | 'academy' | 'inbox' | 'hub_chat' | 'calculator'>('customers');
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [localChats, setLocalChats] = useState<Record<string, { sender: string; text: string; time: string }[]>>({});
  const { users = [] } = store.getState();
  const chatContacts = users.filter(u => u.role === 'super_admin' || u.role === 'regional_admin' || (u.role === 'operator' && u.id !== currentUser?.id));
  const selectedChatUser = chatContacts.find(u => u.id === activeChatUserId);
  const selectedChatMessages = activeChatUserId ? localChats[activeChatUserId] || [] : [];
  const handleSendChatMessage = () => {
    if (!activeChatUserId || !chatMessage.trim()) return;
    const newMsg = { sender: 'me', text: chatMessage, time: new Date().toLocaleTimeString() };
    setLocalChats(prev => ({ ...prev, [activeChatUserId]: [...(prev[activeChatUserId] || []), newMsg] }));
    setChatMessage('');
  };

  // Support ticket actions
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  // Workspace actions
  const [wsPostTitle, setWsPostTitle] = useState('');
  const [wsPostContent, setWsPostContent] = useState('');
  const [wsPostCategory, setWsPostCategory] = useState<'Notice' | 'Announcement' | 'Training' | 'Guideline'>('Notice');
  const [showWsForm, setShowWsForm] = useState(false);
  
  // Local alert banner
  const [localAlert, setLocalAlert] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const storeState = store.getState();
  const currentUser = storeState.currentUser;
  
  const allWorkspacePosts = storeState.workspacePosts || [];
  const allSupportTickets = storeState.supportTickets || [];
  const openTicketsCount = allSupportTickets.filter(t => t.status === 'open' || t.status === 'pending').length;
  const [currentOpStatus, setCurrentOpStatus] = useState<string>('online');
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  // Avatar upload & edit states
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [pastedPhotoUrl, setPastedPhotoUrl] = useState(currentUser?.photoUrl || '');
  const [dragActive, setDragActive] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const handleUpdateAvatar = (newUrl: string) => {
    if (!currentUser) return;
    store.updateUserPhoto(currentUser.id, newUrl);
    setLocalAlert({ type: 'success', text: 'Profile photo updated successfully!' });
    setTimeout(() => setLocalAlert(null), 3000);
    setShowPhotoModal(false);
  };
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setLocalAlert({ type: 'error', text: 'Please select an image file (PNG/JPG/SVG/WEBP).' });
      setTimeout(() => setLocalAlert(null), 4000);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setLocalAlert({ type: 'error', text: 'File exceeds the 10MB limit. Please select a smaller file.' });
      setTimeout(() => setLocalAlert(null), 4000);
      return;
    }
    setIsUploadingPhoto(true);
    try {
      const uploadedUrl = await uploadAvatar(file);
      handleUpdateAvatar(uploadedUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setLocalAlert({ type: 'error', text: `Upload failed: ${err.message || 'Unknown error'}` });
      setTimeout(() => setLocalAlert(null), 4000);
    } finally {
      setIsUploadingPhoto(false);
    }
  };
  const handleUpdateOpStatus = (status: string) => {
    setCurrentOpStatus(status);
    setLocalAlert({ type: 'success', text: `Status changed to: ${status.toUpperCase()}` });
    setTimeout(() => setLocalAlert(null), 3500);
  };
  // Merge specialists list with registered users having role === 'specialist'
  const rawSpecialists = storeState.specialists || [];
  const rawUsers = storeState.users || [];
  const mergedSpecialists: any[] = [...rawSpecialists];
  rawUsers.forEach((u) => {
    if (u.role === 'specialist') {
      const idx = mergedSpecialists.findIndex((s) => s.id === u.id);
      if (idx !== -1) {
        mergedSpecialists[idx] = {
          ...mergedSpecialists[idx],
          name: u.name || mergedSpecialists[idx].name,
          phone: u.phone || mergedSpecialists[idx].phone,
          whatsapp: u.whatsapp || u.phone || mergedSpecialists[idx].phone,
          city: u.city || mergedSpecialists[idx].city,
          category: u.category || mergedSpecialists[idx].category,
          categories: u.categories || mergedSpecialists[idx].categories,
          languages: u.languages || mergedSpecialists[idx].languages,
          tradeSkillLevel: u.tradeSkillLevel || mergedSpecialists[idx].tradeSkillLevel,
          skillsDescription: u.skillsDescription || mergedSpecialists[idx].skillsDescription,
          photoUrl: u.photoUrl || mergedSpecialists[idx].photoUrl,
          verificationDocuments: u.verificationDocuments?.length ? u.verificationDocuments : mergedSpecialists[idx].verificationDocuments,
          specialtiesWithLevels: u.specialtiesWithLevels?.length ? u.specialtiesWithLevels : mergedSpecialists[idx].specialtiesWithLevels,
          status: u.specialistStatus === 'approved' ? 'approved' : (mergedSpecialists[idx].status || u.specialistStatus || 'pending_review'),
        };
      } else {
        mergedSpecialists.push({
          id: u.id,
          name: u.name || 'Specialist Candidate',
          phone: u.phone || '',
          whatsapp: u.whatsapp || u.phone || '',
          category: u.category || 'Home Services',
          categories: u.categories || [u.category || 'Home Services'],
          city: u.city || 'Portimão',
          balance: 100,
          unlockedJobs: [],
          status: (u.specialistStatus === 'approved' ? 'approved' : 'pending_review'),
          languages: u.languages || [],
          tradeSkillLevel: u.tradeSkillLevel || 'amateur',
          skillsDescription: u.skillsDescription || '',
          photoUrl: u.photoUrl || '',
          verificationDocuments: u.verificationDocuments || [],
          specialtiesWithLevels: u.specialtiesWithLevels || []
        });
      }
    }
  });
  const pendingVerificationSpecialists = mergedSpecialists.filter(
    (s) => s.status === 'pending_review' || s.status === 'pending_approval' || s.status === 'new'
  );
  const approvedSpecialists = mergedSpecialists.filter((s) => s.status === 'approved');
  const handleApproveSpecialist = async (userId: string, name: string) => {
    await store.approveSpecialist(userId);
    setLocalAlert({
      type: 'success',
      text: `Specialist "${name}" verified and approved successfully! Account is now active for dispatch.`
    });
    setTimeout(() => setLocalAlert(null), 5000);
  };
  const handleRejectSpecialist = async (userId: string, name: string) => {
    await store.rejectSpecialist(userId);
    setLocalAlert({
      type: 'error',
      text: `Specialist application for "${name}" was rejected.`
    });
    setTimeout(() => setLocalAlert(null), 5000);
  };
  // Show jobs inside their active city/zone
  const personalJobs = jobs.filter(j => {
    if (!currentUser) return false;
    if (j.operatorId === currentUser.id) return true;
    if (j.city && currentUser.city && j.city.toLowerCase().includes(currentUser.city.toLowerCase()) && !j.operatorId) return true;
    return false;
  });
  // Always show personal jobs only (Operator handles their own region).
  const displayedOperatorLeads = personalJobs;
  // Auto-select first job on territory partner profile switch
  React.useEffect(() => {
    if (displayedOperatorLeads.length > 0) {
      setSelectedJobId(displayedOperatorLeads[0].id);
    } else {
      setSelectedJobId(null);
    }
  }, [currentUser?.id, displayedOperatorLeads]);
  if (!currentUser || currentUser.role !== 'operator') {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <p className="text-slate-400">Loading territory partner dashboard...</p>
      </div>
    );
  }
  return (
    <div className="w-full h-full p-4 sm:p-6 md:p-8 bg-[#181a20]/90 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-sm" id="operator-dashboard">
      
      {/* 🏛️ TERRITORIAL HUB CONTEXT BANNER */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 mb-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              {currentUser.hubName || 'Cascais & Sintra Central Hub'}
            </span>
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Seat: {currentUser.seatId || currentUser.dashboardNumber || 'PT-OP-001-A'}
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded text-[11px] font-mono font-bold uppercase tracking-wider">
              {currentUser.shiftName || 'Shift 1 (08:00 - 16:00)'}
            </span>
          </div>
          <p className="text-xs text-slate-300 pt-1">
            Unified Hub Environment • Shared District Orders & Local Specialist Database
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-center">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Shared District Pool</span>
            <span className="text-sm font-black text-cyan-400">{displayedOperatorLeads.length} Active</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-center">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">District Pros</span>
            <span className="text-sm font-black text-emerald-400">{approvedSpecialists.length} Online</span>
          </div>
        </div>
      </div>
      {/* 👤 SEARCHABLE / GROUPED CUSTOM TERRITORY PARTNER TERMINAL STATUS */}
      <div className="bg-[#161922] border border-slate-800 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar Component */}
          <div className="relative group shrink-0" id="operator-avatar-wrapper">
            {currentUser.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:border-cyan-400 transition-all cursor-pointer"
                onClick={() => setShowPhotoModal(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div 
                className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-black text-2xl text-white border-2 border-cyan-500/30 shadow-md group-hover:border-cyan-400 transition-all cursor-pointer"
                onClick={() => setShowPhotoModal(true)}
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Camera Overlay button */}
            <button
              onClick={() => setShowPhotoModal(true)}
              className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 border border-slate-750 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer shadow-md hover:scale-110"
              title="Upload / Change Avatar"
              id="upload-avatar-trigger"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentOpStatus === 'online' ? 'bg-emerald-400 animate-pulse' : currentOpStatus === 'busy' ? 'bg-blue-400' : 'bg-cyan-400'}`}></span>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Terminal: {currentUser.dashboardNumber || 'OP-001'}
              </span>
            </div>
            <h2 className="text-2xl font-display font-black text-white leading-none">
              {currentUser.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 font-medium">
              <span className="px-3 py-1 bg-slate-950 text-slate-300 rounded border border-slate-800">Dashboard operating region: {currentUser.city && currentUser.city !== 'Portugal' && currentUser.city !== 'Algarve Hub' ? currentUser.city : 'Portimão'}</span>
              <a
                href={getWhatsAppUrl(currentUser.whatsapp || currentUser.phone || '+351 912 888 777', "Hello Territory Partner!")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 rounded border border-emerald-500/30 flex items-center gap-1.5 font-mono text-xs font-bold transition-all cursor-pointer"
                title="Your active WhatsApp dispatch number"
              >
                <span>💬 WhatsApp TP: {currentUser.whatsapp || currentUser.phone || '+351 912 888 777'}</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded uppercase font-sans">Active</span>
              </a>
            </div>
          </div>
        </div>
        {/* Status toggler & Create Order Action */}
        <div className="flex flex-wrap items-center gap-3 relative">
          <button
            onClick={() => setShowCalculatorModal(true)}
            className="px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            title="Калькулятор Заказа и Лида NordBase"
          >
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>Калькулятор</span>
          </button>
          <button
            onClick={() => setShowCreateOrderModal(true)}
            id="create-lead-tp-btn-top"
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer border border-cyan-400/40 active:scale-95 animate-pulse"
            title="Create new Lead from customer phone inquiry"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>+ Create Lead</span>
          </button>
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-sm items-center gap-1">
            <span className="text-xs text-slate-500 font-mono px-3 uppercase font-black"> {lang === 'pt' ? 'Status:' : 'Status:'} </span>
            {['online', 'busy', 'idle'].map((st) => (
              <button
                key={st}
                onClick={() => handleUpdateOpStatus(st)}
                className={`px-4 py-1.5 text-xs font-mono uppercase font-bold rounded-lg transition-all cursor-pointer ${
                  currentOpStatus === st
                    ? st === 'online' ? 'bg-emerald-500 text-slate-950 shadow-md' :
                      st === 'busy' ? 'bg-blue-500 text-slate-950 shadow-md' :
                      'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Territory Pending Verification Alert Banner */}
      {pendingVerificationSpecialists.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/90 via-amber-900/60 to-slate-950 p-4 rounded-2xl border border-amber-500/40 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xl animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg animate-pulse">
              ⚡
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <span>Verification Queue Required</span>
                <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full">
                  {pendingVerificationSpecialists.length} Pending
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                New specialist application(s) submitted in {currentUser.city || 'your region'}. Contact via WhatsApp, review uploaded documents, and approve for market dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePortalTab('specialists')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>Review Applications ({pendingVerificationSpecialists.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Local coordination alert banner */}
      {localAlert && (
        <div className={`p-4 rounded-xl mb-4 text-sm font-bold border flex items-center gap-2 ${
          localAlert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <AlertCircle className="w-5 h-5" />
          <span>{localAlert.text}</span>
        </div>
      )}
      {/* Main Coordination Modules Selector */}
      <div className="flex bg-[#161922] border border-slate-800 p-1.5 rounded-2xl mb-6 gap-2">
        <button
          onClick={() => setActivePortalTab('customers')}
          className={`flex-1 py-3 text-xs font-display font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activePortalTab === 'customers'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Customers</span>
        </button>
        <button
          onClick={() => setActivePortalTab('specialists')}
          id="operator-specialists-verification-tab"
          className={`flex-1 py-3 text-xs font-display font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activePortalTab === 'specialists'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
          title="Specialists verification queue and contractor database"
        >
          <User className="w-4 h-4" />
          <span> {lang === 'pt' ? 'Especialistas (Verificação)' : 'Specialists (Verification)'} </span>
          {pendingVerificationSpecialists.length > 0 && (
            <span className="ml-1 px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black rounded-full text-[10px] animate-pulse shadow">
              {pendingVerificationSpecialists.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActivePortalTab('regional_admin')}
          className={`flex-1 py-3 text-xs font-display font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activePortalTab === 'regional_admin'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          <span> {lang === 'pt' ? 'Parceiro Regional' : 'Regional Partner'} </span>
        </button>
        <button
          onClick={() => setActivePortalTab('inbox')}
          className={`flex-1 py-3 text-xs font-display font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activePortalTab === 'inbox'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Inbox & Chat</span>
        </button>
        <button
          onClick={() => setActivePortalTab('hub_chat')}
          className={`flex-1 py-3 text-xs font-display font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activePortalTab === 'hub_chat'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Hub Chat</span>
        </button>
        <button
          onClick={() => setActivePortalTab('academy')}
          className={`flex-1 py-3 text-xs font-display font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activePortalTab === 'academy'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span> {lang === 'pt' ? 'Academia' : 'Academy'} </span>
        </button>
        <button
          onClick={() => setActivePortalTab('calculator')}
          className={`flex-1 py-3 text-xs font-display font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activePortalTab === 'calculator'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Калькулятор</span>
        </button>
      </div>
      
      {activePortalTab === 'customers' && (
        <OperatorLeadsTerminal
          jobs={displayedOperatorLeads}
          onClaimJob={onClaimJob}
          onOfferJob={onOfferJob}
          onSelectSpecialist={onSelectSpecialist}
          onCompleteJob={onCompleteJob}
          onAddMessage={onAddMessage}
          activeOperatorId={currentUser.id}
          selectedJobId={selectedJobId}
          setSelectedJobId={setSelectedJobId}
          currentUser={currentUser}
        />
      )}
      {/* --- WORKSPACE NOTICEBOARD & SPECIALIST DIRECTORY PORTAL --- */}
      {activePortalTab === 'specialists' && (
        <div className="space-y-8" id="coordination-noticeboard-portal">
          
          {/* 📋 SPECIALIST VERIFICATION QUEUE FOR TERRITORY PARTNERS */}
          <div className="bg-[#0A1128]/90 p-6 rounded-3xl border border-amber-500/30 space-y-6 shadow-xl">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-amber-500/20 pb-4">
              <div>
                <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>Specialist Verification Queue</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Contractors in {currentUser.city || 'your region'} awaiting territory partner review. Verify WhatsApp contact & uploaded documents before activating market access.
                </p>
              </div>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
                pendingVerificationSpecialists.length > 0
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                  : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400'
              }`}>
                {pendingVerificationSpecialists.length > 0 ? `⏳ ${pendingVerificationSpecialists.length} Applications Pending Review` : '✅ All Applications Processed'}
              </span>
            </div>
            {pendingVerificationSpecialists.length === 0 ? (
              <div className="bg-slate-950/60 p-6 rounded-2xl border border-blue-950 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Pending Verification Requests</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  All regional specialist applications in your territory have been reviewed. New specialist registrations will automatically appear here for verification.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingVerificationSpecialists.map((spec) => (
                  <div
                    key={spec.id}
                    className="bg-slate-950/90 p-5 rounded-2xl border border-amber-500/30 space-y-4 shadow-lg hover:border-amber-400/50 transition-all"
                  >
                    {/* Header profile info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {spec.photoUrl ? (
                          <img
                            src={spec.photoUrl}
                            alt={spec.name}
                            className="w-12 h-12 rounded-xl object-cover border border-amber-500/40"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
                            {spec.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{spec.name}</h4>
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold rounded-full uppercase">
                              Pending Review
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            {spec.category || 'Home Services'} • {spec.city || 'Portimão'}
                          </p>
                        </div>
                      </div>
                      {/* 1-Click WhatsApp Button */}
                      <a
                        href={getWhatsAppUrl(
                          spec.whatsapp || spec.phone,
                          `Hello ${spec.name}! I am your NordBase Territory Partner for ${spec.city || 'Algarve'}. I received your specialist verification application and wanted to connect...`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer border border-emerald-400/30"
                        title="Open WhatsApp chat with specialist candidate"
                      >
                        <span>💬 WhatsApp TP Contact</span>
                      </a>
                    </div>
                    {/* Qualifications & Trade Level */}
                    <div className="bg-[#050B1B] p-3 rounded-xl border border-blue-900/30 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-slate-400 font-mono">Skill Mastery:</span>
                        <span className="font-bold text-cyan-300 uppercase font-mono px-2 py-0.5 bg-cyan-950 border border-cyan-500/30 rounded">
                          {spec.tradeSkillLevel || 'Amateur'}
                        </span>
                      </div>
                      {spec.specialtiesWithLevels && spec.specialtiesWithLevels.length > 0 && (
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Declared Trades:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {spec.specialtiesWithLevels.map((sp: any, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded text-[10px] font-mono border border-slate-800">
                                {sp.name} ({sp.level})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {spec.languages && spec.languages.length > 0 && (
                        <div className="text-[11px] text-slate-300">
                          <span className="text-slate-500 font-mono">Languages: </span>
                          {spec.languages.map((l: any) => typeof l === 'string' ? l : `${l.language || ''}${l.level ? ` (${l.level})` : ''}`).join(', ')}
                        </div>
                      )}
                      {spec.skillsDescription && (
                        <p className="text-slate-300 text-[11px] italic border-t border-slate-900 pt-1.5 mt-1">
                          "{spec.skillsDescription}"
                        </p>
                      )}
                    </div>
                    {/* Verification Documents Uploaded */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">
                        Attached Verification Documents:
                      </span>
                      {spec.verificationDocuments && spec.verificationDocuments.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {spec.verificationDocuments.map((doc: any, idx: number) => (
                            <a
                              key={idx}
                              href={doc.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-cyan-300 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-cyan-500/30 transition-all"
                              title={`View ${doc.name}`}
                            >
                              <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="capitalize">{doc.type?.replace('_', ' ') || 'Document'}</span>
                              <ExternalLink className="w-3 h-3 opacity-70" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                          <span>No document files attached yet. Request passport/ID copy via WhatsApp.</span>
                        </div>
                      )}
                    </div>
                    {/* TP Verification Decision Controls */}
                    <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
                      <button
                        onClick={() => handleApproveSpecialist(spec.id, spec.name)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve & Activate Specialist</span>
                      </button>
                      <button
                        onClick={() => handleRejectSpecialist(spec.id, spec.name)}
                        className="px-4 py-2.5 bg-red-950/60 hover:bg-red-900/60 text-red-300 font-bold text-xs rounded-xl border border-red-500/30 transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Regional Specialists WhatsApp Roster */}
          <div className="bg-[#0A1128]/80 p-6 rounded-3xl border border-blue-900/30 space-y-4 shadow-md">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  <span>Verified Regional Specialist Directory ({approvedSpecialists.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Active verified contractors in your operating territory ready for job dispatches and order coordination.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 bg-emerald-950/80 border border-emerald-500/30 rounded-xl">
                💬 Direct WhatsApp Enabled
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {approvedSpecialists.length === 0 ? (
                <div className="col-span-full p-4 bg-slate-950/40 rounded-xl text-center text-xs text-slate-400">
                  No verified specialists currently active in this region. Approve candidates above to expand the network.
                </div>
              ) : (
                approvedSpecialists.map((spec) => (
                  <div
                    key={spec.id}
                    className="bg-slate-950/60 p-4 rounded-2xl border border-blue-950/80 flex items-center justify-between gap-3 hover:border-emerald-500/40 transition-all group"
                  >
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <h4 className="text-xs font-bold text-white truncate">{spec.name}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {spec.categories?.join(', ') || spec.category || 'General'} • {spec.city}
                      </p>
                      <p className="text-[10px] text-emerald-400/90 font-mono font-bold">
                        WhatsApp: {spec.whatsapp || spec.phone || '+351 912 000 000'}
                      </p>
                    </div>
                    <a
                      href={getWhatsAppUrl(
                        spec.whatsapp || spec.phone,
                        `Hello ${spec.name}! Territory Partner here. We have new job requests available in ${spec.city}...`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer border border-emerald-400/30"
                      title="Open WhatsApp chat with specialist"
                    >
                      <span>💬 WhatsApp</span>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-white">Internal Algarve Noticeboard</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Broadcast corporate notices, region guidelines, active training checklists, or local coordination ideas.
              </p>
            </div>
            {!showWsForm && (
              <button
                onClick={() => setShowWsForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Board Entry</span>
              </button>
            )}
          </div>
          {showWsForm && (
            <div className="bg-[#0A1128]/95 p-6 rounded-2xl border border-blue-900/35 shadow-lg max-w-lg mx-auto animate-in fade-in duration-200">
              <h4 className="text-sm font-display font-bold text-white mb-4">Publish Workspace Board Entry</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!wsPostTitle || !wsPostContent) return;
                  store.addWorkspacePost(
                    wsPostCategory === 'Announcement' ? 'Announcements' :
                    wsPostCategory === 'Training' ? 'Training' :
                    wsPostCategory === 'Guideline' ? 'Knowledge Base' : 'Lounge',
                    wsPostTitle,
                    wsPostContent,
                    currentUser?.name || 'Territory Partner',
                    'operator'
                  );
                  setWsPostTitle('');
                  setWsPostContent('');
                  setShowWsForm(false);
                  setLocalAlert({ type: 'success', text: 'Notice published to all regional specialists successfully.' });
                  setTimeout(() => setLocalAlert(null), 5000);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Entry Category
                  </label>
                  <select
                    value={wsPostCategory}
                    onChange={(e) => setWsPostCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-blue-900/30 text-white focus:outline-none focus:border-cyan-500 transition-all text-xs cursor-pointer"
                  >
                    <option value="Notice" className="bg-[#0A1128]">Notice / Lounge</option>
                    <option value="Announcement" className="bg-[#0A1128]">Critical Announcement</option>
                    <option value="Training" className="bg-[#0A1128]">Educational Tutorial</option>
                    <option value="Guideline" className="bg-[#0A1128]">Regional Directive / Guideline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Title Heading
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Faro & Portimão summer plumber guidelines"
                    value={wsPostTitle}
                    onChange={(e) => setWsPostTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-blue-900/30 text-white focus:outline-none focus:border-cyan-500 transition-all text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Message Body Content
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Type the message details here..."
                    value={wsPostContent}
                    onChange={(e) => setWsPostContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-blue-900/30 text-white focus:outline-none focus:border-cyan-500 transition-all text-xs resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowWsForm(false)}
                    className="px-4 py-2 bg-slate-950 border border-blue-950 hover:bg-slate-900 text-slate-400 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-bold"
                  >
                    Post to Feed
                  </button>
                </div>
              </form>
            </div>
          )}
          {allWorkspacePosts.length === 0 ? (
            <div className="bg-[#0A1128]/80 border border-blue-900/20 text-center py-16 rounded-2xl shadow-md">
              <BookOpen className="w-10 h-10 text-cyan-500/30 mx-auto mb-3" />
              <p className="text-xs text-slate-400">Noticeboard queue is empty. Post an entry to sync workspace.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allWorkspacePosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#0A1128]/75 rounded-2xl border border-blue-950/80 p-5 flex flex-col justify-between hover:border-blue-900/40 transition-all shadow-md group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[9px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded uppercase tracking-wider font-bold">
                        {post.module}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-4 whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-blue-950 flex justify-between items-center text-xxs font-mono">
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-bold">{post.authorName}</span>
                      <span className="text-slate-600 capitalize text-[9px]">{post.authorRole}</span>
                    </div>
                    <button
                      onClick={() => store.likeWorkspacePost(post.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950 hover:bg-blue-900/60 text-pink-400 border border-pink-500/10 cursor-pointer group-active:scale-95 transition-transform"
                    >
                      <Heart className="w-3.5 h-3.5 fill-pink-500/10 hover:fill-pink-500" />
                      <span className="font-bold">{post.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* --- CONTRACTOR SUPPORT DESK --- */}
      {activePortalTab === 'regional_admin' && (
        <div className="space-y-6" id="coordination-support-portal">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-white"> {lang === 'pt' ? 'Fila de Casos do Suporte Local' : 'Local Helpdesk Case Queue'} </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review and resolve contractor refund claims, technical bugs, and balance issues.
              </p>
            </div>
            <div className="px-3 py-1.5 bg-[#0A1128] rounded-xl border border-blue-900/30 text-xxs font-mono text-cyan-400">
              Total Support Tickets: <strong>{allSupportTickets.length}</strong>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Queue */}
            <div className="bg-[#0A1128]/70 rounded-2xl border border-blue-950 p-4 space-y-3">
              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-wider block">
                Open Support Cases Queue ({openTicketsCount})
              </span>
              {allSupportTickets.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-mono">
                  No active support cases submitted yet.
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-[500px]">
                  {allSupportTickets.map((tkt) => {
                    const isSelected = selectedTicketId === tkt.id;
                    return (
                      <div
                        key={tkt.id}
                        onClick={() => setSelectedTicketId(tkt.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-950/45 border-cyan-500/40 text-white'
                            : 'bg-slate-950/40 border-slate-900/60 text-slate-300 hover:border-blue-900/30'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1 mb-1">
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                            tkt.status === 'open' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            tkt.status === 'pending' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                            tkt.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            'bg-slate-900 text-slate-500'
                          }`}>
                            {tkt.status}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">{tkt.id}</span>
                        </div>
                        <p className="text-xs font-bold truncate">{tkt.title}</p>
                        <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2">
                          <span>User: {tkt.userName} ({tkt.userRole})</span>
                          <span>{tkt.category}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Right Thread Details */}
            <div className="lg:col-span-2 bg-[#0A1128]/70 rounded-2xl border border-blue-950 p-5 flex flex-col min-h-[450px]">
              {selectedTicketId ? (() => {
                const tkt = allSupportTickets.find(t => t.id === selectedTicketId);
                if (!tkt) return <p className="text-slate-500 text-xs text-center m-auto">Case not found.</p>;
                return (
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Ticket Title */}
                      <div className="pb-3 border-b border-blue-950">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-0.5">{tkt.category} Support Ticket</span>
                            <h4 className="text-sm font-bold text-white">{tkt.title}</h4>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                            tkt.priority === 'high' || tkt.priority === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/25' : 'bg-slate-900 text-slate-400'
                          }`}>
                            {tkt.priority} priority
                          </span>
                        </div>
                        <p className="text-xxs font-mono text-slate-400 mt-2">
                          Opened on {new Date(tkt.createdAt).toLocaleString()} by {tkt.userName} ({tkt.userRole})
                        </p>
                      </div>
                      {/* Control Panel to update status/priority */}
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-blue-950 space-y-3">
                        <span className="text-[9px] font-mono text-cyan-400 uppercase font-black tracking-wider block">
                          Territory Partner Administration Board Panel
                        </span>
                        
                        <div className="grid grid-cols-2 gap-3 text-xxs">
                          <div>
                            <label className="block text-[9px] text-slate-500 uppercase font-bold mb-1">Status</label>
                            <select
                              value={tkt.status}
                              onChange={(e) => {
                                store.updateTicketStatus(
                                  tkt.id,
                                  e.target.value as any,
                                  tkt.priority,
                                  tkt.internalNotes || '',
                                  'operator',
                                  'Territory Partner'
                                );
                                setLocalAlert({ type: 'success', text: `Status updated to ${e.target.value.toUpperCase()}` });
                                setTimeout(() => setLocalAlert(null), 3000);
                              }}
                              className="w-full px-2 py-1.5 rounded bg-slate-950 border border-blue-900/30 text-white cursor-pointer"
                            >
                              <option value="open">Open / Queueing</option>
                              <option value="pending">Pending Info</option>
                              <option value="resolved"> {lang === 'pt' ? 'Resolvido' : 'Resolved'} </option>
                              <option value="closed">Closed / Finished</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] text-slate-500 uppercase font-bold mb-1"> {lang === 'pt' ? 'Prioridade' : 'Priority'} </label>
                            <select
                              value={tkt.priority}
                              onChange={(e) => {
                                store.updateTicketStatus(
                                  tkt.id,
                                  tkt.status,
                                  e.target.value as any,
                                  tkt.internalNotes || '',
                                  'operator',
                                  'Territory Partner'
                                );
                                setLocalAlert({ type: 'success', text: `Priority escalated to ${e.target.value.toUpperCase()}` });
                                setTimeout(() => setLocalAlert(null), 3000);
                              }}
                              className="w-full px-2 py-1.5 rounded bg-slate-950 border border-blue-900/30 text-white cursor-pointer"
                            >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Escalate</option>
                              <option value="urgent"> {lang === 'pt' ? 'Suporte Urgente' : 'Urgent Support'} </option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] text-slate-500 uppercase font-bold mb-1">Internal Log Notes</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Type operator-only reference notes here..."
                              defaultValue={tkt.internalNotes || ''}
                              onBlur={(e) => {
                                store.updateTicketStatus(
                                  tkt.id,
                                  tkt.status,
                                  tkt.priority,
                                  e.target.value,
                                  'operator',
                                  'Territory Partner'
                                );
                                setLocalAlert({ type: 'success', text: 'Internal case audit notes updated' });
                                setTimeout(() => setLocalAlert(null), 3000);
                              }}
                              className="flex-1 px-3 py-1 bg-slate-950 border border-blue-900/30 text-white rounded text-[11px]"
                            />
                            <span className="text-[8px] text-slate-500 font-mono flex items-center">* Auto-saves on blur</span>
                          </div>
                        </div>
                      </div>
                      {/* Chat Messages */}
                      <div className="space-y-3 overflow-y-auto max-h-[220px] pr-2">
                        {/* Initial Description */}
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-blue-950 text-slate-300 text-xs italic leading-relaxed">
                          "{tkt.description}"
                        </div>
                        {/* History Events */}
                        {tkt.history && tkt.history.length > 0 && (
                          <div className="space-y-1 bg-slate-950/10 p-2.5 rounded-xl border border-blue-950/50">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-black block mb-1">
                              History Timeline Audit Log:
                            </span>
                            {tkt.history.map((ev) => (
                              <div key={ev.id} className="text-[9.5px] font-mono text-slate-400 flex justify-between gap-2 border-b border-blue-900/10 pb-1">
                                <span>• [{ev.status.toUpperCase()}] {ev.notes || 'Status updated'}</span>
                                <span className="text-slate-600">{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Thread message logs */}
                        {tkt.messages.map((m) => {
                          const isOperator = m.sender === 'operator' || (currentUser && (m.senderName || '').includes(currentUser.name)) || (m.senderName || '').includes('Admin');
                          const isSystem = m.senderName === 'System';
                          return (
                            <div
                              key={m.id}
                              className={`flex flex-col max-w-[85%] ${
                                isOperator ? 'align-self-end ml-auto items-end' : 'align-self-start mr-auto items-start'
                              }`}
                            >
                              <span className="text-[9px] font-mono text-slate-500 mb-0.5">
                                {m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                                isSystem ? 'bg-slate-950 text-amber-400 text-center mx-auto border border-blue-950' :
                                isOperator ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-950 text-cyan-300 border border-cyan-900/30'
                              }`}>
                                <AITranslatedMessage content={m.content} context="Territorial Support Ticket Chat" />
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
                        if (!ticketReplyText.trim()) return;
                        store.replySupportTicket(tkt.id, ticketReplyText, 'operator', currentUser?.name || 'Territory Partner');
                        setTicketReplyText('');
                        setLocalAlert({ type: 'success', text: 'Response dispatched on support case thread.' });
                        setTimeout(() => setLocalAlert(null), 3000);
                      }}
                      className="mt-4 pt-3 border-t border-blue-950 flex gap-2"
                    >
                      <input
                        type="text"
                        required
                        placeholder="Reply to the contractor support thread..."
                        value={ticketReplyText}
                        onChange={(e) => setTicketReplyText(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-blue-900/30 bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold font-mono cursor-pointer"
                      >
                        Send Reply
                      </button>
                    </form>
                  </div>
                );
              })() : (
                <div className="m-auto text-center text-slate-500 text-xs">
                  <Ticket className="w-8 h-8 text-cyan-400 mb-2.5 mx-auto animate-pulse" />
                  <span>Select an active support case docket from the queue to view full chat history log and trigger actions.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* --- HUB CHAT TAB --- */}
      {activePortalTab === 'hub_chat' && (
        <div className="border border-slate-800 rounded-3xl bg-[#161922] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          {currentUser && <HubChat currentUser={currentUser} />}
        </div>
      )}
      {/* --- ACADEMY TAB --- */}
      {activePortalTab === 'academy' && (
        <div className="h-[800px] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <Academy userRole="operator" />
        </div>
      )}
      {/* --- CALCULATOR TAB --- */}
      {activePortalTab === 'calculator' && (
        <div className="border border-slate-800 rounded-3xl bg-[#161922] p-4 sm:p-6 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <CalculatorsPage />
        </div>
      )}
      {/* 📸 AVATAR PHOTO UPLOAD MODAL */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm" id="avatar-photo-modal">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-left">
            <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" />
              <span>Update Profile Photo</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Upload a custom profile image to display in your active Territory Partner terminal, live customer chat logs, and team directories.
            </p>
            {/* Current Avatar preview & preset options */}
            <div className="flex items-center gap-4 mb-6 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <div className="shrink-0">
                {currentUser.photoUrl ? (
                  <img
                    src={currentUser.photoUrl}
                    alt={currentUser.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500/30 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-lg text-white border border-cyan-500/20">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider">Current Terminal Avatar</span>
                <span className="text-xs text-slate-300 font-semibold">{currentUser.name} ({currentUser.city || 'Portimão'})</span>
                {currentUser.photoUrl && (
                  <button
                    onClick={() => handleUpdateAvatar('')}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-bold block mt-1 underline cursor-pointer flex items-center gap-1 bg-transparent border-0"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Reset to generic initials</span>
                  </button>
                )}
              </div>
            </div>
            {/* DRAG AND DROP ZONE */}
            <div
              className={`border-2 border-dashed rounded-xl p-5 mb-5 text-center transition-all ${
                dragActive 
                  ? 'border-cyan-400 bg-cyan-950/10' 
                  : 'border-blue-900/40 bg-slate-950/40 hover:border-blue-800'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="avatar-file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
              />
              <label 
                htmlFor="avatar-file-upload" 
                className="cursor-pointer flex flex-col items-center justify-center gap-2 text-xs text-slate-400"
              >
                <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                <span>
                  <strong className="text-cyan-300">Drag and drop</strong> your image here, or{' '}
                  <strong className="text-cyan-300">click to browse</strong>
                </span>
                <span className="text-[10px] text-slate-600">Supports PNG, JPG, SVG, WEBP (Max 5MB)</span>
              </label>
            </div>
            <div className="mb-5 p-3 bg-blue-950/20 border border-blue-900/30 rounded-xl">
              <span className="text-xs font-semibold text-cyan-300 block mb-1">
                ⚡ Automatic Avatar Optimization
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                When you upload your photo, it is automatically center-cropped and optimized into a clean 1:1 round avatar format for display across customer order cards and territory dispatches.
              </p>
            </div>
            {/* LINK URL INPUT */}
            <div className="mb-6">
              <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1.5">Or paste any image web URL:</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={pastedPhotoUrl}
                  onChange={(e) => setPastedPhotoUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-blue-900/30 bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => {
                    if (pastedPhotoUrl.trim() && pastedPhotoUrl.startsWith('http')) {
                      handleUpdateAvatar(pastedPhotoUrl);
                    } else {
                      setLocalAlert({ type: 'error', text: 'Please enter a valid HTTP/HTTPS image URL.' });
                      setTimeout(() => setLocalAlert(null), 3000);
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer transition-all border-0"
                >
                  Apply
                </button>
              </div>
            </div>
            {/* MODAL ACTIONS */}
            <div className="flex justify-end gap-3 border-t border-blue-900/10 pt-4">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-blue-900/20 text-slate-400 hover:text-white rounded-lg text-xs font-bold font-mono transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CREATE ORDER MODAL FOR TP */}
      <CreateOrderModal
        isOpen={showCreateOrderModal}
        onClose={() => setShowCreateOrderModal(false)}
        operatorCity={currentUser?.city || 'Portimão'}
        operatorId={currentUser?.id || 'op-default'}
        specialists={storeState.specialists || []}
        onOrderCreated={(newJobId) => {
          setSelectedJobId(newJobId);
          setActivePortalTab('customers');
          setLocalAlert({ type: 'success', text: `Order #${newJobId.slice(-4)} successfully created from customer call!` });
          setTimeout(() => setLocalAlert(null), 4000);
        }}
      />
      {/* 🧮 NORDBASE PRICING CALCULATOR MODAL */}
      {showCalculatorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-4 sm:p-6 relative max-h-[92vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-base sm:text-lg">
                <Euro className="w-5 h-5 text-cyan-400" />
                <span>Калькулятор NordBase (Work & Lead + Group Work)</span>
              </div>
              <button
                onClick={() => setShowCalculatorModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <CalculatorsPage />
          </div>
        </div>
      )}
    </div>
  );
}