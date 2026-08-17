import React, { useState, useEffect } from "react";
import {
  Job,
  Specialist,
  AuthUser,
  AuditLog,
  SupportTicket,
  Message,
  SuggestionComplaint,
} from "../types";
import {
  ShieldAlert,
  Globe,
  Shield,
  AlertTriangle,
  UserCheck,
  UserX,
  Search,
  MessageCircle,
  Inbox,
  Send,
  MoreVertical,
  Activity,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Edit2,
  Lock,
  Phone,
  Mail,
  TrendingUp,
  Coins,
  MapPin,
  Users,
  GraduationCap,
  Cpu,
  RotateCcw,
  Sparkles,
  Zap,
  Key,
  Eye,
  Building2,
  Camera,
  Upload,
  X,
  Check,
} from "lucide-react";
import { PORTUGAL_GEO } from "../lib/geo";
import { store } from "../store";
import Academy from "./Academy";
import { KnowledgeEvolutionPanel } from "./KnowledgeEvolutionPanel";
import TerritorialHubsManager from "./TerritorialHubsManager";
import NetworkPortugalControlCenter from "./NetworkPortugalControlCenter";
interface SuperAdminDashboardProps {
  jobs: Job[];
  specialists: Specialist[];
  users: AuthUser[];
  auditLogs: AuditLog[];
  supportTickets: SupportTicket[];
  suggestions: SuggestionComplaint[];
  notifications: any[];
  onCreateLead: (
    name: string,
    phone: string,
    location: string,
    details: string,
    category: string,
  ) => void;
  onUpdateUsers: (users: AuthUser[]) => void;
  onUpdateJobs: (jobs: Job[]) => void;
  onAddAuditLog: (
    action: string,
    actorName: string,
    actorRole: string,
    territory: string,
    details: string,
  ) => void;
}
export default function SuperAdminDashboard({
  jobs,
  specialists,
  users,
  auditLogs,
  supportTickets,
  suggestions = [],
  onUpdateUsers,
  onUpdateJobs,
  onAddAuditLog,
}: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "control_center" | "all_users" | "staff" | "applications" | "alerts" | "inbox" | "audit" | "suggestions" | "academy" | "glossary"
  >("control_center");
  const [searchTerm, setSearchTerm] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [userStatusFilter, setUserStatusFilter] = useState<string>("all");
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");
  const [selectedRDCode, setSelectedRDCode] = useState<string | null>("Pt-RD-001");
  const [takeoverInput, setTakeoverInput] = useState("");
  // SuperAdmin Profile & Avatar State
  const storeState = store.getState();
  const currentUser = storeState.currentUser;
  const superAdminPhoto = currentUser?.photoUrl || currentUser?.avatar || '/portimao_tp.jpg';
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [pastedPhotoUrl, setPastedPhotoUrl] = useState(superAdminPhoto);
  const [dragActive, setDragActive] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [localAlert, setLocalAlert] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    store.syncFromServer();
  }, [activeTab]);
  const handleUpdateAvatar = (newUrl: string) => {
    if (!newUrl) return;
    const targetUserId = currentUser?.id || 'user-super-01';
    store.updateUserPhoto(targetUserId, newUrl);
    setLocalAlert({ type: 'success', text: 'SuperAdmin avatar updated and synchronized!' });
    setTimeout(() => setLocalAlert(null), 3500);
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
      alert('Please upload an image file (PNG, JPG, WEBP)');
      return;
    }
    setIsUploadingPhoto(true);
    try {
      const { uploadImage } = await import("../utils/upload");
      const url = await uploadImage(file);
      setPastedPhotoUrl(url);
    } catch (e) {
      console.error(e);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPastedPhotoUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingPhoto(false);
    }
  };
  const handleTakeoverByNumber = (dashNum: string) => {
    if (!dashNum.trim()) return;
    store.impersonateByDashboardNumber(dashNum.trim());
  };
  // Dashboard Number
  const currentPath = window.location.pathname.toLowerCase();
  let dashboardId = "01";
  let directorTitle = "Director NordBase";
  let canManageSupers = true;
  // Check if it's 02, 03, 04
  if (currentPath.includes("02")) {
    dashboardId = "02";
    directorTitle = "Director of Development";
    canManageSupers = false;
  } else if (currentPath.includes("03")) {
    dashboardId = "03";
    directorTitle = "Director of Development";
    canManageSupers = false;
  } else if (currentPath.includes("04")) {
    dashboardId = "04";
    directorTitle = "Director of Development";
    canManageSupers = false;
  }
  // --- PARTNERS MANAGEMENT ---
  const [newPartnerFirstName, setNewPartnerFirstName] = useState("");
  const [newPartnerLastName, setNewPartnerLastName] = useState("");
  const [newPartnerPhone, setNewPartnerPhone] = useState("");
  const [newPartnerWhatsapp, setNewPartnerWhatsapp] = useState("");
  const [newPartnerTelegram, setNewPartnerTelegram] = useState("");
  const [newPartnerEmail, setNewPartnerEmail] = useState("");
  const [newPartnerRegion, setNewPartnerRegion] = useState(
    PORTUGAL_GEO[0]?.name || "",
  );
  const [newPartnerRole, setNewPartnerRole] = useState<
    "super_admin" | "regional_admin" | "operator"
  >("operator");
  const [newPartnerDashboardNum, setNewPartnerDashboardNum] = useState("");
    const [expandedPartnerId, setExpandedPartnerId] = useState<string | null>(
    null,
  );
  const [partnerToDelete, setPartnerToDelete] = useState<{ id: string; name: string } | null>(null);
  const handleAddPartner = () => {
    if (!newPartnerEmail || !newPartnerFirstName) return;
    // Auto-generate dash number if empty
    let finalDashNum = newPartnerDashboardNum;
    if (!finalDashNum) {
      if (newPartnerRole === "regional_admin") {
        const rds = users.filter((u) => u.role === "regional_admin");
        finalDashNum = `PT-RD-${(rds.length + 1).toString().padStart(3, "0")}`;
      } else if (newPartnerRole === "operator") {
        const ops = users.filter((u) => u.role === "operator");
        finalDashNum = `PT-OP-${(ops.length + 1).toString().padStart(3, "0")}`;
      } else if (newPartnerRole === "super_admin") {
        finalDashNum = "05"; // fallback
      }
    }
    const newUser: AuthUser = {
      id: `u_${Date.now()}`,
      email: newPartnerEmail.trim().toLowerCase(),
      name: `${newPartnerFirstName} ${newPartnerLastName}`.trim(),
      phone: newPartnerPhone,
      whatsapp: newPartnerWhatsapp,
      telegram: newPartnerTelegram,
      region: newPartnerRole === 'super_admin' ? 'All' : (newPartnerRegion === 'All' ? PORTUGAL_GEO[0]?.name || '' : newPartnerRegion),
      role: newPartnerRole,
      dashboardNumber: finalDashNum,
            isNewUser: false,
      specialistStatus: "approved",
    };
    const updated = [...users, newUser];
    onUpdateUsers(updated);
    onAddAuditLog(
      "Partner Added",
      directorTitle,
      "super_admin",
      "All",
      `Added ${newPartnerRole} ${newPartnerEmail}`,
    );
    // Reset fields
    setNewPartnerFirstName("");
    setNewPartnerLastName("");
    setNewPartnerPhone("");
    setNewPartnerWhatsapp("");
    setNewPartnerTelegram("");
    setNewPartnerEmail("");
    setNewPartnerDashboardNum("");
      };
  const handleRemovePartner = (id: string, name: string) => {
    store.deleteUser(id);
    const updated = users.filter((u) => u.id !== id);
    onUpdateUsers(updated);
    onAddAuditLog(
      "Profile Permanently Deleted",
      directorTitle,
      "super_admin",
      "All",
      `Permanently deleted user profile ${name} (${id})`,
    );
  };
  
  const handleToggleBlock = (id: string, currentlyBlocked: boolean, name: string) => {
    store.toggleFreezeUser(id);
    const updated = users.map((u) =>
      u.id === id ? { ...u, isBlocked: !currentlyBlocked } : u
    );
    onUpdateUsers(updated);
    onAddAuditLog(
      currentlyBlocked ? "Profile Unfrozen" : "Profile Frozen",
      directorTitle,
      "super_admin",
      "All",
      `${currentlyBlocked ? 'Unfrozen' : 'Frozen'} user profile ${name} (${id})`,
    );
  };
  const handleUpdateDashboardNumber = (id: string, newDash: string, name: string) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, dashboardNumber: newDash } : u
    );
    onUpdateUsers(updated);
    onAddAuditLog(
      "Dashboard Assigned",
      directorTitle,
      "super_admin",
      "All",
      `Assigned dashboard ${newDash} to ${name}`
    );
  };
  // --- CHAT / INBOX (for Dashboard specific id) ---
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [localChats, setLocalChats] = useState<
    Record<string, { sender: string; text: string; time: string }[]>
  >({});
  const chatContacts = users.filter(
    (u) =>
      u.role === "regional_admin" ||
      u.role === "operator" ||
      u.role === "super_admin",
  );
  const displayContacts = [...chatContacts];
  const selectedChatUser = displayContacts.find(
    (u) => u.id === activeChatUserId,
  );
  const selectedChatMessages = activeChatUserId
    ? localChats[activeChatUserId] || []
    : [];
  const handleSendChatMessage = () => {
    if (!activeChatUserId || !chatMessage.trim()) return;
    const newMsg = {
      sender: "me",
      text: chatMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setLocalChats((prev) => ({
      ...prev,
      [activeChatUserId]: [...(prev[activeChatUserId] || []), newMsg],
    }));
    setChatMessage("");
  };
  const handleCallToChat = (id: string) => {
    setActiveTab("inbox");
    setActiveChatUserId(id);
  };
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {localAlert && (
        <div className={`p-4 rounded-2xl border text-sm font-bold shadow-lg transition-all animate-in fade-in ${
          localAlert.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          {localAlert.text}
        </div>
      )}
      {/* 🇵🇹 NATIONAL COMMAND CENTER HEADER */}
      <div className="mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex items-center gap-5">
          {/* SuperAdmin Profile Avatar Trigger */}
          <div className="relative group cursor-pointer shrink-0" onClick={() => { setPastedPhotoUrl(superAdminPhoto); setShowPhotoModal(true); }}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] bg-slate-800 relative">
              <img
                src={superAdminPhoto}
                alt="SuperAdmin Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                <Camera className="w-5 h-5 text-cyan-400" />
                <span>Edit Photo</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPastedPhotoUrl(superAdminPhoto);
                setShowPhotoModal(true);
              }}
              className="absolute -bottom-1 -right-1 bg-cyan-600 hover:bg-cyan-500 text-white p-1.5 rounded-xl border border-slate-900 shadow-md transition-all cursor-pointer"
              title="Upload / Change Avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                {directorTitle}{" "}
                <span className="text-cyan-400">/{dashboardId}</span>
              </h2>
              <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold">
                SuperAdmin
              </span>
            </div>
            <p className="text-slate-400 mt-1 text-sm sm:text-base max-w-2xl">
              National Command Center • Logged as <span className="text-white font-semibold">{currentUser?.name || "Oleg (Territorial Partner)"}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setPastedPhotoUrl(superAdminPhoto);
              setShowPhotoModal(true);
            }}
            className="bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-bold transition-all cursor-pointer shadow-sm"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>Upload Avatar</span>
          </button>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-3 flex items-center gap-3 shadow-lg">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
            <span className="text-base font-bold text-white tracking-wide">
              System Active
            </span>
          </div>
        </div>
      </div>
      {/* 🧭 NAVIGATION TABS (Top Bar) */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-900/40 p-2.5 rounded-2xl border border-white/5 overflow-x-auto shadow-md">
        {[
          { id: "control_center", label: "Network Portugal Control Center", icon: Globe },
          { id: "all_users", label: "Profile & Freeze Control (Управление Профилями)", icon: UserCheck },
          { id: "staff", label: "Partners", icon: Shield },
          { id: "applications", label: "TP / RP Applications", icon: Users },
          { id: "alerts", label: "Alerts & Tickets", icon: AlertTriangle },
          { id: "inbox", label: "Inbox & Chat", icon: Inbox },
          { id: "audit", label: "Security Audit Logs", icon: ShieldAlert },
          { id: "suggestions", label: "Suggestions Box", icon: Mail },
          { id: "glossary", label: "AI Glossary & Evolution", icon: Sparkles },
          { id: "academy", label: "Academy", icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-6 py-4 text-base font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-cyan-600 border-cyan-500 text-white shadow-[0_4px_15px_rgba(6,182,212,0.3)]"
                  : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* 💻 PERSPECTIVE VIEWS */}

      {/* VIEW: CONTROL CENTER (STAGE 1 NETWORK PORTUGAL) */}
      {activeTab === "control_center" && (
        <NetworkPortugalControlCenter
          users={users}
          jobs={jobs}
          specialists={specialists}
          auditLogs={auditLogs}
          onUpdateUsers={onUpdateUsers}
          onUpdateJobs={onUpdateJobs}
          onAddAuditLog={onAddAuditLog}
        />
      )}



      {/* VIEW: ALL PROFILES & FREEZE MANAGEMENT TOOL */}
      {activeTab === "all_users" && (() => {
        // Build unified profiles list combining registered users and specialists
        const allProfiles: AuthUser[] = [...users];
        specialists.forEach(spec => {
          const exists = allProfiles.some(u => u.id === spec.id || (u.phone && spec.phone && u.phone === spec.phone));
          if (!exists) {
            allProfiles.push({
              id: spec.id,
              name: spec.name,
              phone: spec.phone,
              email: `${spec.id}@specialist.nordbase.pt`,
              role: 'specialist',
              specialistStatus: spec.specialistStatus || 'approved',
              city: spec.city,
              category: spec.category,
              categories: spec.categories,
              tradeSkillLevel: spec.tradeSkillLevel,
              skillsDescription: spec.skillsDescription,
              verificationDocuments: spec.verificationDocuments || []
            });
          }
        });

        // Filter profiles by role, status, and search query
        const filteredProfiles = allProfiles.filter((u) => {
          // Role filter
          if (userRoleFilter !== "all" && u.role !== userRoleFilter) {
            return false;
          }
          // Status filter
          if (userStatusFilter === "frozen" && !u.isBlocked) {
            return false;
          }
          if (userStatusFilter === "active" && u.isBlocked) {
            return false;
          }
          if (userStatusFilter === "pending" && u.specialistStatus !== 'pending_review') {
            return false;
          }
          // Search query
          if (userSearchQuery.trim()) {
            const q = userSearchQuery.toLowerCase();
            const nameMatch = (u.name || "").toLowerCase().includes(q);
            const emailMatch = (u.email || "").toLowerCase().includes(q);
            const phoneMatch = (u.phone || "").toLowerCase().includes(q);
            const cityMatch = (u.city || "").toLowerCase().includes(q);
            const idMatch = (u.id || "").toLowerCase().includes(q);
            return nameMatch || emailMatch || phoneMatch || cityMatch || idMatch;
          }
          return true;
        });

        const totalProfilesCount = allProfiles.length;
        const specialistsCount = allProfiles.filter(u => u.role === 'specialist' || specialists.some(s => s.id === u.id || (s.phone && u.phone && s.phone === u.phone))).length;
        const customersCount = allProfiles.filter(u => u.role === 'customer').length;
        const partnersCount = allProfiles.filter(u => ['operator', 'regional_admin', 'super_admin'].includes(u.role)).length;
        const frozenCount = allProfiles.filter(u => u.isBlocked).length;

        return (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Всего профилей</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">{totalProfilesCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Все типы аккаунтов</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Специалисты</span>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400 font-mono">{specialistsCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Исполнители услуг</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Заказчики</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-blue-400 font-mono">{customersCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Клиенты платформы</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Партнеры & Админы</span>
                  <Shield className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-purple-400 font-mono">{partnersCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">TP, RD, Operators</div>
              </div>

              <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Заморожено</span>
                  <Lock className="w-4 h-4 text-rose-400 animate-pulse" />
                </div>
                <div className="text-3xl font-black text-rose-400 font-mono">{frozenCount}</div>
                <div className="text-[11px] text-slate-400 mt-1">Заблокировано суперадмином</div>
              </div>
            </div>

            {/* Profile Management Header & Filters */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-3">
                    <UserX className="w-7 h-7 text-cyan-400" />
                    <span>Управление и Заморозка Профилей</span>
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Инструмент полного контроля: блокировка/заморозка и окончательное удаление аккаунтов любого типа.
                  </p>
                </div>
                <div className="flex items-center gap-3 self-start lg:self-auto">
                  <button
                    onClick={async () => {
                      await store.syncFromServer();
                      setLocalAlert({ type: 'success', text: 'База данных синхронизирована с сервером!' });
                      setTimeout(() => setLocalAlert(null), 3000);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-mono rounded-xl transition-colors cursor-pointer"
                    title="Синхронизировать с сервером"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Обновить базу</span>
                  </button>
                  <div className="text-xs text-slate-400 font-mono bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                    Найдено профилей: <span className="text-cyan-400 font-bold">{filteredProfiles.length}</span> из {totalProfilesCount}
                  </div>
                </div>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Search */}
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Поиск по имени, email, телефону, городу..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                  {userSearchQuery && (
                    <button
                      onClick={() => setUserSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Role Filter */}
                <div className="md:col-span-4">
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 appearance-none font-medium cursor-pointer"
                  >
                    <option value="all">🌐 Все роли (Specialist, Customer, TP, RD)</option>
                    <option value="specialist">🔧 Специалисты (Specialists)</option>
                    <option value="customer">👤 Заказчики (Customers)</option>
                    <option value="operator">🏢 Операторы / ТП (Operators)</option>
                    <option value="regional_admin">🌍 Региональные Директора (RD)</option>
                    <option value="super_admin">⚡ Территориальные Партнеры (TP SuperAdmin)</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="md:col-span-3">
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 appearance-none font-medium cursor-pointer"
                  >
                    <option value="all">⚡ Все статусы</option>
                    <option value="active">🟢 Только активные</option>
                    <option value="frozen">🧊 Только замороженные</option>
                    <option value="pending">⏳ Ожидающие верификации</option>
                  </select>
                </div>
              </div>

              {/* Profiles Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/40">
                <div className="min-w-[950px] divide-y divide-slate-800/60">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 py-3.5 px-5 bg-slate-950 text-slate-400 font-bold text-xs uppercase tracking-wider">
                    <div className="col-span-4">Пользователь & Email</div>
                    <div className="col-span-2">Роль</div>
                    <div className="col-span-2">Статус / Регион</div>
                    <div className="col-span-2">Контакты</div>
                    <div className="col-span-2 text-right">Действия</div>
                  </div>

                  {/* Table Rows */}
                  {filteredProfiles.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 space-y-2">
                      <Search className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-sm font-bold text-slate-400">Пользователи не найдены</p>
                      <p className="text-xs">Попробуйте изменить параметры поиска или фильтрации.</p>
                    </div>
                  ) : (
                    filteredProfiles.map((u) => {
                      const isFrozen = !!u.isBlocked;
                      const roleLabel = 
                        u.role === 'super_admin' ? 'Territorial Partner (TP)' :
                        u.role === 'regional_admin' ? 'Regional Director (RD)' :
                        u.role === 'operator' ? 'Territory Partner' :
                        u.role === 'specialist' ? 'Specialist' : 'Customer';
                      
                      const roleBadgeClass = 
                        u.role === 'super_admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                        u.role === 'regional_admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                        u.role === 'operator' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        u.role === 'specialist' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        'bg-slate-800 text-slate-300 border-slate-700';

                      return (
                        <div
                          key={u.id}
                          className={`grid grid-cols-12 gap-4 py-4 px-5 items-center hover:bg-slate-900/60 transition-all ${
                            isFrozen ? 'bg-rose-950/20 border-l-4 border-l-rose-500' : ''
                          }`}
                        >
                          {/* User Info */}
                          <div className="col-span-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                              isFrozen 
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            }`}>
                              {u.photoUrl ? (
                                <img src={u.photoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                u.name ? u.name.charAt(0).toUpperCase() : 'U'
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-white text-sm truncate flex items-center gap-2">
                                <span>{u.name || 'Unnamed User'}</span>
                                {isFrozen && (
                                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono rounded font-bold uppercase">
                                    🧊 Заморожен
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400 truncate font-mono">{u.email}</div>
                              {u.id && <div className="text-[10px] text-slate-500 font-mono">ID: {u.id}</div>}
                            </div>
                          </div>

                          {/* Role Badge */}
                          <div className="col-span-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-block ${roleBadgeClass}`}>
                              {roleLabel}
                            </span>
                          </div>

                          {/* Status & City */}
                          <div className="col-span-2 text-xs text-slate-300 space-y-1">
                            <div className="flex items-center gap-1.5">
                              {isFrozen ? (
                                <span className="text-rose-400 font-bold flex items-center gap-1">
                                  <Lock className="w-3.5 h-3.5" /> Заблокирован
                                </span>
                              ) : (
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Активен
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              📍 {u.city || u.region || 'Algarve'}
                            </div>
                          </div>

                          {/* Contacts */}
                          <div className="col-span-2 text-xs text-slate-300 space-y-1">
                            {u.phone && <div>📞 {u.phone}</div>}
                            {u.whatsapp && (
                              <a
                                href={`https://wa.me/${u.whatsapp.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                              >
                                💬 WhatsApp
                              </a>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="col-span-2 flex items-center justify-end gap-2">
                            {/* Freeze / Unfreeze Toggle Button */}
                            <button
                              onClick={() => handleToggleBlock(u.id, isFrozen, u.name)}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border shadow-sm ${
                                isFrozen
                                  ? 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border-emerald-500/40'
                                  : 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border-amber-500/40'
                              }`}
                              title={isFrozen ? "Разморозить профиль (Unfreeze)" : "Заморозить профиль (Freeze)"}
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{isFrozen ? 'Разморозить' : 'Заморозить'}</span>
                            </button>

                            {/* Delete Profile Button */}
                            <button
                              onClick={() => setPartnerToDelete({ id: u.id, name: u.name })}
                              className="p-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 rounded-xl transition-all cursor-pointer shadow-sm"
                              title="Удалить профиль навсегда (Delete Profile)"
                            >
                              <UserX className="w-4 h-4" />
                            </button>

                            {/* Impersonate Switch */}
                            <button
                              onClick={() => store.impersonateUser(u)}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition-all cursor-pointer border border-slate-700"
                              title="Войти под пользователем (Impersonate)"
                            >
                              <Zap className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {/* VIEW 2: STAFF MANAGEMENT (PARTNERS) */}
      {activeTab === "staff" && (
        <div className="space-y-8">
          {/* REMINDER CARD: RP LOGIN & ACCESS GUIDE */}
          <div className="bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-purple-950/80 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in duration-200">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-cyan-500/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg">
                  <Key className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold rounded-full uppercase tracking-wider">
                      📌 Памятка: Вход и Доступ для RP (Regional Partner / Regional Director)
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white font-display">
                    Как войти на сайт под аккаунтом Регионального Партнера (RP)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    Полная инструкция и способы авторизации для управляющих партнеров регионов (RP / Regional Director).
                  </p>
                </div>
              </div>

              {/* Quick Takeover Input Box */}
              <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 shrink-0 space-y-2 min-w-[280px]">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Мгновенный вход по Коду (Pt-RD-...)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={takeoverInput}
                    onChange={(e) => setTakeoverInput(e.target.value)}
                    placeholder="например: Pt-RD-001"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (takeoverInput.trim()) {
                        handleTakeoverByNumber(takeoverInput.trim());
                      }
                    }}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-md hover:scale-105"
                  >
                    Войти ⚡
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Main Login Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Method 1: Dedicated RP Portal */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-cyan-500/30 transition-colors">
                <div className="font-bold text-cyan-300 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px] shrink-0">1</span>
                  <span>Вход для RP: nordbase.pt/rp/portugal</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Единый вход для Региональных Партнеров (RP). Вход выполняется через <strong>Google OAuth</strong> или e-mail <strong>без ввода номера дашборда</strong>.
                </p>
              </div>

              {/* Method 2: Dedicated TP Portal */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-cyan-500/30 transition-colors">
                <div className="font-bold text-cyan-300 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px] shrink-0">2</span>
                  <span>Вход для TP: nordbase.pt/tp/portugal</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Единый портал для Территориальных Партнеров (TP/Операторов). Позволяет входить через Google OAuth без кода. Если партнер переходит на <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 font-mono">nordbase.pt</code>, он работает как Заказчик.
                </p>
              </div>

              {/* Method 3: Impersonate / Direct Access */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-cyan-500/30 transition-colors">
                <div className="font-bold text-cyan-300 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px] shrink-0">3</span>
                  <span>Быстрый Перехват из Админки</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Суперадмин может войти в любой дашборд RP/TP в 1 клик, нажав кнопку <span className="text-amber-400 font-bold">⚡ Manage</span> в списке партнеров или введя код в поле выше.
                </p>
              </div>
            </div>

            {/* Quick Access Badges for Active RPs */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold">Быстрый запуск действующих RP аккаунтов:</span>
              <button
                type="button"
                onClick={() => handleTakeoverByNumber("Pt-RD-001")}
                className="px-3 py-1 bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 rounded-lg font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Pt-RD-001 (Algarve Director)</span>
              </button>
              <button
                type="button"
                onClick={() => handleTakeoverByNumber("Pt-RD-004")}
                className="px-3 py-1 bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 rounded-lg font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Pt-RD-004 (Faro / Central)</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <h3 className="text-xl font-black text-white mb-8">
              Add New Partner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  First Name
                </label>
                <input
                  maxLength={2000} type="text"
                  value={newPartnerFirstName}
                  onChange={(e) => setNewPartnerFirstName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="Maria"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  Last Name
                </label>
                <input
                  maxLength={2000} type="text"
                  value={newPartnerLastName}
                  onChange={(e) => setNewPartnerLastName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="Santos"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newPartnerEmail}
                  onChange={(e) => setNewPartnerEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="maria@nordbase.pt"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  Phone
                </label>
                <input
                  maxLength={2000} type="text"
                  value={newPartnerPhone}
                  onChange={(e) => setNewPartnerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="+351..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  WhatsApp
                </label>
                <input
                  maxLength={2000} type="text"
                  value={newPartnerWhatsapp}
                  onChange={(e) => setNewPartnerWhatsapp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="+351..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  Telegram
                </label>
                <input
                  maxLength={2000} type="text"
                  value={newPartnerTelegram}
                  onChange={(e) => setNewPartnerTelegram(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  Region
                </label>
                <select
                  value={newPartnerRegion}
                  onChange={(e) => setNewPartnerRegion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none appearance-none"
                >
                  <option value="All">All</option>
                  {PORTUGAL_GEO.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  Role
                </label>
                <select
                  value={newPartnerRole}
                  onChange={(e) => setNewPartnerRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none appearance-none"
                >
                  {canManageSupers && (
                    <option value="super_admin">Territorial Partner (TP)</option>
                  )}
                  <option value="regional_admin">Regional Director</option>
                  <option value="operator">Territory Partner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  Dashboard No. (Auto if empty)
                </label>
                <input
                  maxLength={2000} type="text"
                  value={newPartnerDashboardNum}
                  onChange={(e) => setNewPartnerDashboardNum(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="PT-RD-001"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={handleAddPartner}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-colors h-[50px] w-full sm:w-auto shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  Add Partner
                </button>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <h3 className="text-xl font-black text-white">
                Current Partners Directory
              </h3>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  maxLength={2000} type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search partners..."
                  className="w-full sm:w-80 bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-5 py-3 text-base text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[800px] divide-y divide-slate-800/50">
                <div className="grid grid-cols-12 gap-4 pb-4 text-slate-400 font-bold px-4">
                  <div className="col-span-3">Name & Email</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Region</div>
                  <div className="col-span-2">Dash No.</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>
                {users
                  .filter((u) =>
                    ["operator", "regional_admin", "super_admin"].includes(
                      u.role,
                    ),
                  )
                  .filter(
                    (u) =>
                      (u.name || "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      (u.email || "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                  )
                  .map((u) => {
                    const isExpanded = expandedPartnerId === u.id;
                    const canEdit = u.role !== "super_admin" || canManageSupers; // 01 can edit supers, others can't
                    // Hide other supers from 02-04 maybe? The prompt didn't say hide them, but they can't manage them.
                    return (
                      <div
                        key={u.id}
                        className="border-b border-slate-800/50 last:border-0 bg-slate-900/20 hover:bg-slate-800/40 transition-colors rounded-xl mb-2"
                      >
                        <div
                          className="grid grid-cols-12 gap-4 py-4 px-4 items-center cursor-pointer"
                          onClick={() =>
                            setExpandedPartnerId(isExpanded ? null : u.id)
                          }
                        >
                          <div className="col-span-3">
                            <div className="font-bold text-white">
                              {u.name || "Unnamed"}
                            </div>
                            <div className="text-sm text-slate-400">
                              {u.email}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                u.role === "super_admin"
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                                  : u.role === "regional_admin"
                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                                    : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {u.role === "super_admin"
                                ? "Territorial Partner (TP)"
                                : u.role === "regional_admin"
                                  ? "Regional Director"
                                  : "Territory Partner"}
                            </span>
                          </div>
                          <div className="col-span-2 text-slate-300 text-sm">
                            {u.role === "super_admin" ? "All" : (u.region || "Region")}
                          </div>
                          <div className="col-span-2 text-slate-300 font-mono text-sm">
                            {u.dashboardNumber || "-"}
                          </div>
                          <div className="col-span-3 flex justify-end gap-2 items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                store.impersonateUser(u);
                              }}
                              className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/40 rounded-lg px-3 py-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
                              title="Manage dashboard (Switch to self)"
                            >
                              <Zap className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="hidden xl:inline">Manage</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCallToChat(u.id);
                              }}
                              className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                              title="Call to chat"
                            >
                              <MessageCircle className="w-5 h-5" />
                            </button>
                            {canEdit && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleBlock(u.id, !!u.isBlocked, u.name);
                                }}
                                className={`p-2 rounded-lg transition-colors ${u.isBlocked ? 'bg-red-500/20 text-red-400' : 'hover:bg-orange-500/20 text-slate-500 hover:text-orange-400'}`}
                                title={u.isBlocked ? "Unblock partner" : "Block partner"}
                              >
                                <Lock className="w-5 h-5" />
                              </button>
                            )}
                            {canEdit && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPartnerToDelete({ id: u.id, name: u.name });
                                }}
                                className="p-2 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                                title="Remove partner"
                              >
                                <UserX className="w-5 h-5" />
                              </button>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-slate-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                        </div>
                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="px-4 pb-6 pt-2 border-t border-slate-800/50 bg-slate-900/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                              <div>
                                <div className="text-xs text-slate-500 font-bold mb-1">
                                  Phone
                                </div>
                                <div className="text-white flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-slate-400" />{" "}
                                  {u.phone || "N/A"}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 font-bold mb-1">
                                  WhatsApp
                                </div>
                                <div className="text-white flex items-center gap-2">
                                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                                  {u.whatsapp || u.phone ? (
                                    <a
                                      href={`https://wa.me/${(u.whatsapp || u.phone!).replace(/[^0-9]/g, "")}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="hover:text-emerald-400 transition-colors text-emerald-400 font-bold"
                                    >
                                      {u.whatsapp || u.phone}
                                    </a>
                                  ) : (
                                    "N/A"
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 font-bold mb-1">
                                  Telegram
                                </div>
                                <div className="text-white flex items-center gap-2">
                                  <Send className="w-4 h-4 text-blue-400" />
                                  {u.telegram ? (
                                    <a
                                      href={`https://t.me/${u.telegram.replace("@", "")}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="hover:text-blue-400 transition-colors"
                                    >
                                      {u.telegram}
                                    </a>
                                  ) : (
                                    "N/A"
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 font-bold mb-1">
                                  Dashboard Number
                                </div>
                                {canEdit ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      maxLength={2000} type="text"
                                      defaultValue={u.dashboardNumber || ""}
                                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500 w-full"
                                      onBlur={(e) => {
                                        if (e.target.value !== u.dashboardNumber) {
                                          handleUpdateDashboardNumber(
                                            u.id,
                                            e.target.value,
                                            u.name
                                          );
                                        }
                                      }}
                                    />
                                    <Edit2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                  </div>
                                ) : (
                                  <div className="text-slate-400">{u.dashboardNumber || "None"}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* VIEW 3: ALERTS & TICKETS */}
      {activeTab === "alerts" && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white mb-6">
            System Alerts & Support Tickets
          </h3>
          <div className="flex flex-col gap-5">
            {supportTickets && supportTickets.length > 0 ? (
              supportTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex items-start gap-6 hover:border-slate-700 transition-colors shadow-lg"
                >
                  <div className="bg-rose-500/10 p-4 rounded-full text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-bold text-white">
                        {ticket.title}
                      </h4>
                      <span className="text-sm text-slate-500 font-mono bg-slate-950 px-3 py-1 rounded-lg">
                        {ticket.createdAt}
                      </span>
                    </div>
                    <p className="text-base text-slate-300 leading-relaxed">
                      {ticket.description}
                    </p>
                    <div className="mt-6 flex gap-3">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                          ticket.status === "open"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {ticket.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl">
                <Shield className="w-16 h-16 text-slate-600 mx-auto mb-5" />
                <p className="text-slate-400 font-bold text-lg">
                  No active alerts or tickets.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* VIEW 4: INBOX & CHAT */}
      {activeTab === "inbox" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden flex h-[700px] shadow-xl">
          {/* Contacts Sidebar */}
          <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-950/50">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-white font-black text-xl mb-1">
                Inbox & Channels
              </h3>
              <p className="text-sm text-slate-400">Chat with Partners</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {displayContacts.map((contact) => {
                const contactAvatar = contact.photoUrl || contact.avatar || (contact.role === 'super_admin' ? '/portimao_tp.jpg' : '');
                return (
                  <button
                    key={contact.id}
                    onClick={() => setActiveChatUserId(contact.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      activeChatUserId === contact.id
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                        : "hover:bg-slate-800/80 text-slate-300"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700 relative">
                      {contactAvatar ? (
                        <img src={contactAvatar} alt={contact.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">
                          {contact.name?.charAt(0) || 'P'}
                        </div>
                      )}
                    </div>
                    <div className="text-left overflow-hidden">
                      <div className="font-bold truncate text-base">
                        {contact.name || contact.email}
                      </div>
                      <div
                        className={`text-sm truncate ${activeChatUserId === contact.id ? "text-blue-200" : "text-slate-500"}`}
                      >
                        {contact.role === "regional_admin"
                          ? "Regional Director"
                          : contact.role === "super_admin"
                            ? "Territorial Partner (TP)"
                            : "Territory Partner"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-slate-900/30">
            {selectedChatUser ? (
              <>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-cyan-500/40">
                      {selectedChatUser.photoUrl || selectedChatUser.avatar ? (
                        <img src={selectedChatUser.photoUrl || selectedChatUser.avatar} alt={selectedChatUser.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold">
                          {selectedChatUser.name?.charAt(0) || 'P'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-white text-xl">
                        {selectedChatUser.name || selectedChatUser.email}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {selectedChatUser.role === "regional_admin"
                          ? "Regional Director"
                          : selectedChatUser.role === "super_admin"
                            ? "Territorial Partner (TP)"
                            : "Territory Partner"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {selectedChatMessages.map((msg, idx) => {
                    const isMe = msg.sender === "me";
                    const avatarUrl = isMe 
                      ? superAdminPhoto 
                      : (selectedChatUser.photoUrl || selectedChatUser.avatar || '/portimao_tp.jpg');
                    return (
                      <div
                        key={idx}
                        className={`flex gap-3 items-end ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        {!isMe && (
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                            <img src={avatarUrl} alt={selectedChatUser.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] rounded-3xl p-5 ${
                            isMe
                              ? "bg-blue-600 text-white rounded-br-none shadow-[0_5px_15px_rgba(37,99,235,0.2)]"
                              : "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none shadow-lg"
                          }`}
                        >
                          <p className="text-base leading-relaxed">
                            {msg.text}
                          </p>
                          <span className="text-xs text-slate-400 mt-3 block opacity-80 font-mono">
                            {msg.time}
                          </span>
                        </div>
                        {isMe && (
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500/50 bg-slate-800 shrink-0 shadow-sm">
                            <img src={avatarUrl} alt="SuperAdmin" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {selectedChatMessages.length === 0 && (
                    <div className="text-center text-slate-500 py-20 flex flex-col items-center">
                      <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-lg">
                        No messages yet. Start the conversation.
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-slate-800 bg-slate-950/80">
                  <div className="flex gap-3 relative">
                    <input
                      maxLength={2000} type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendChatMessage()
                      }
                      placeholder="Type your message..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-400 text-base shadow-inner"
                    />
                    <button
                      onClick={handleSendChatMessage}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center w-16"
                    >
                      <Send className="w-6 h-6 ml-1" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-6">
                <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-2">
                  <MessageCircle className="w-12 h-12 opacity-50" />
                </div>
                <h3 className="text-2xl font-bold text-slate-400">
                  Your Inbox
                </h3>
                <p className="text-base">
                  Select a partner to view messages or complaints
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* VIEW 5: AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-black text-white mb-8">
            Security Audit Logs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-base">
                  <th className="pb-5 font-bold">Time</th>
                  <th className="pb-5 font-bold">Action</th>
                  <th className="pb-5 font-bold">Actor</th>
                  <th className="pb-5 font-bold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {auditLogs
                  .slice()
                  .reverse()
                  .map((log, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-5 text-slate-400 text-base whitespace-nowrap font-mono">
                        {log.timestamp}
                      </td>
                      <td className="py-5">
                        <span className="bg-slate-800 text-slate-300 px-4 py-1.5 rounded-lg text-sm font-bold border border-slate-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-5 text-white text-base font-bold">
                        {log.actorName}{" "}
                        <span className="text-slate-500 text-sm font-normal ml-2 bg-slate-950 px-2 py-1 rounded-md">
                          ({log.actorRole})
                        </span>
                      </td>
                      <td className="py-5 text-slate-300 text-base">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                {auditLogs.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-20 text-slate-500 text-lg"
                    >
                      No audit logs recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* VIEW 6: SUGGESTIONS & COMPLAINTS BOX */}
      {activeTab === "suggestions" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              <Mail className="w-7 h-7 text-cyan-400" />
              Suggestions & Complaints Box
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Read feedback, ideas, and incident escalations submitted by Regional Directors across Portugal.
            </p>
          </div>
          <div className="space-y-4">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-2xl p-6 transition-all bg-slate-950/30 ${
                    item.status === 'pending'
                      ? 'border-slate-800 hover:border-cyan-500/30 shadow-md'
                      : 'border-slate-900/40 opacity-70'
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                            item.type === "suggestion"
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {item.type === "suggestion" ? "💡 SUGGESTION" : "⚠️ COMPLAINT"}
                        </span>
                        
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                            item.status === "pending"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          ID: {item.id}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-white mt-2">
                        {item.title}
                      </h4>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-sm font-bold text-white">
                        {item.senderName}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {item.senderRole === "regional_admin" ? "Regional Director" : item.senderRole} • <span className="text-cyan-400 font-bold">{item.region}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <p className="text-base text-slate-300 leading-relaxed bg-slate-950/20 p-4 rounded-xl border border-white/5">
                    {item.content}
                  </p>
                  {item.status === "pending" && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          store.updateSuggestionStatus(item.id, "reviewed");
                          store.addAuditLog(
                            "Feedback Reviewed",
                            directorTitle,
                            "super_admin",
                            "Portugal",
                            `Marked suggestion ${item.id} from ${item.senderName} as reviewed`
                          );
                        }}
                        className="bg-emerald-600/10 hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-500/20 hover:border-emerald-600 px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-103 active:scale-97 cursor-pointer"
                      >
                        ✔ Mark as Reviewed
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-950/20 border border-slate-800 border-dashed rounded-2xl">
                <Mail className="w-16 h-16 text-slate-700 mx-auto mb-4 animate-bounce" />
                <p className="text-slate-400 font-bold text-lg">
                  The suggestions box is currently empty.
                </p>
                <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto leading-relaxed">
                  When Regional Directors submit suggestions or complaints via their Tickets & Alerts panels, they will populate here in real-time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* VIEW: TP / RP PARTNER APPLICATIONS */}
      {activeTab === "applications" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-white/10 shadow-lg">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-400" />
                <span>Partner Applications Database (TP / RP)</span>
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Territorial Partner (TP) and Regional Partner (RP) submissions received through the website. Exclusive access for Super Admins.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-bold">
              <span className="text-slate-400 px-3 py-1">Total: {store.getState().partnerApplications?.length || 0}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {store.getState().partnerApplications && (store.getState().partnerApplications || []).length > 0 ? (
              (store.getState().partnerApplications || []).map((app) => (
                <div
                  key={app.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all space-y-4 shadow-md"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                          app.type === "regional"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {app.type === "regional" ? "Regional Partner (RP)" : "Territorial Partner (TP)"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                          app.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : app.status === "rejected"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : app.status === "reviewed"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                        }`}
                      >
                        {app.status}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">ID: {app.id}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      Submitted: {new Date(app.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      {app.photoUrl ? (
                        <img src={app.photoUrl} alt={app.fullName} className="w-12 h-12 rounded-full object-cover border border-blue-500" />
                      ) : null}
                      <div>
                        <div className="text-xs font-medium text-slate-400">Applicant Name</div>
                        <div className="text-base font-bold text-white mt-0.5">{app.fullName}</div>
                        {app.dob && <div className="text-[11px] text-slate-500">DOB: {app.dob}</div>}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-400">Target Location / Cities</div>
                      <div className="text-base font-bold text-blue-400 mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{app.citiesToManage && app.citiesToManage.length > 0 ? app.citiesToManage.join(', ') : app.location}</span>
                      </div>
                      {app.country && <div className="text-[11px] text-slate-500">{app.country}</div>}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-400">Contact Details</div>
                      <div className="text-xs text-slate-200 mt-0.5 space-y-0.5">
                        <div>📞 {app.phone}</div>
                        <div>✉️ {app.email}</div>
                        {app.languages && app.languages.length > 0 && (
                          <div className="text-[11px] text-slate-400">🗣️ {app.languages.map((l: any) => typeof l === 'string' ? l : `${l.language || ''}${l.level ? ` (${l.level})` : ''}`).join(', ')}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                    <div className="bg-slate-950/20 p-3.5 rounded-xl border border-slate-800/60">
                      <strong className="text-slate-400 block mb-1">Occupation & Experience:</strong>
                      <span>{app.currentActivity || app.experience || "Not specified"} ({app.yearsExperience || 'N/A'})</span>
                    </div>
                    <div className="bg-slate-950/20 p-3.5 rounded-xl border border-slate-800/60">
                      <strong className="text-slate-400 block mb-1">Availability & Schedule:</strong>
                      <span>{app.hoursPerWeek || app.preferredSchedule || "Flexible"}</span>
                      {app.availableDays && app.availableDays.length > 0 && (
                        <div className="text-[11px] text-slate-400 mt-1">Days: {app.availableDays.join(', ')}</div>
                      )}
                    </div>
                    <div className="bg-slate-950/20 p-3.5 rounded-xl border border-slate-800/60">
                      <strong className="text-slate-400 block mb-1">Equipment & Assets:</strong>
                      <div className="flex flex-wrap gap-1 mt-1 text-[11px]">
                        {app.hasVehicle && <span className="px-2 py-0.5 bg-blue-900/40 text-blue-300 rounded">Car ✓</span>}
                        {app.hasComputer && <span className="px-2 py-0.5 bg-blue-900/40 text-blue-300 rounded">Laptop ✓</span>}
                        {app.hasInternet && <span className="px-2 py-0.5 bg-blue-900/40 text-blue-300 rounded">Internet ✓</span>}
                        {app.hasHomeOffice && <span className="px-2 py-0.5 bg-blue-900/40 text-blue-300 rounded">Home Office ✓</span>}
                      </div>
                    </div>
                  </div>
                  {app.whyPartner && (
                    <div className="text-xs text-slate-300 bg-slate-950/30 p-3.5 rounded-xl border border-slate-800/60 space-y-2">
                      <strong className="text-slate-400 block">Motivation & Leadership Vision:</strong>
                      <p className="leading-relaxed">{app.whyPartner}</p>
                      {app.whyChooseYou && <p className="text-slate-400 italic">Why Choose: {app.whyChooseYou}</p>}
                      {app.howBuildTPNetwork && (
                        <p className="text-indigo-300 text-[11px]"><strong>TP Network Strategy:</strong> {app.howBuildTPNetwork}</p>
                      )}
                      {app.howAttractSpecialists && (
                        <p className="text-indigo-300 text-[11px]"><strong>Attract Specialists:</strong> {app.howAttractSpecialists}</p>
                      )}
                      {app.threeYearVision && (
                        <p className="text-emerald-300 text-[11px]"><strong>3-Year Vision:</strong> {app.threeYearVision}</p>
                      )}
                    </div>
                  )}
                  {app.type === 'regional' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-500/20 text-slate-300">
                      <div>
                        <span className="text-indigo-400 font-bold block mb-1">Regional Knowledge & Network</span>
                        <div><strong>Community Knowledge:</strong> {app.localCommunityKnowledge || 'N/A'}</div>
                        <div><strong>Business Contacts:</strong> {app.businessContactsCount || 'N/A'}</div>
                        {app.familiarIndustries && app.familiarIndustries.length > 0 && (
                          <div className="mt-1 text-[11px] text-slate-400">
                            <strong>Industries:</strong> {app.familiarIndustries.join(', ')}
                          </div>
                        )}
                        {app.linkedinProfile && (
                          <div className="mt-1 text-[11px]">
                            <a href={app.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                              LinkedIn Profile 🔗
                            </a>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-indigo-400 font-bold block mb-1">Business Readiness & Entity</span>
                        <div><strong>Readiness:</strong> {app.readinessLevel || 'N/A'}</div>
                        <div><strong>Entity/Company:</strong> {app.isSelfEmployedOrCompany ? 'Operating Company/Self-Employed ✓' : 'Individual'}</div>
                        <div><strong>Willing to establish entity:</strong> {app.willingToEstablishEntity ? 'Yes ✓' : 'No'}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${app.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`mailto:${app.email}`}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <span>Send Email</span>
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => store.updatePartnerApplicationStatus(app.id, "reviewed")}
                        className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-400 border border-amber-500/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Mark Reviewed
                      </button>
                      <button
                        onClick={() => store.updatePartnerApplicationStatus(app.id, "approved")}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => store.updatePartnerApplicationStatus(app.id, "rejected")}
                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-slate-300">No partner applications submitted yet</h4>
                <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                  Applications submitted on the "Become a NordBase Partner" landing page will appear here instantly for Super Admin review.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* VIEW 7: ACADEMY */}
      {activeTab === "academy" && (
        <div className="h-[800px] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <Academy userRole="super_admin" />
        </div>
      )}
      {/* VIEW 8: GLOSSARY & KNOWLEDGE EVOLUTION */}
      {activeTab === "glossary" && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <KnowledgeEvolutionPanel />
        </div>
      )}
      {/* 📸 AVATAR UPLOAD MODAL FOR SUPERADMIN */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">SuperAdmin Profile Avatar</h3>
                  <p className="text-xs text-slate-400">Upload photo or enter URL to update SuperAdmin avatar</p>
                </div>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Current & Live Preview */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.3)] bg-slate-950 relative">
                {pastedPhotoUrl ? (
                  <img src={pastedPhotoUrl} alt="Avatar Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Camera className="w-10 h-10" />
                  </div>
                )}
              </div>
              <span className="text-xs font-mono text-slate-400">Live Preview</span>
            </div>
            {/* File Drag-and-Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                dragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-950/50'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="superadmin-avatar-file-input"
              />
              <label htmlFor="superadmin-avatar-file-input" className="cursor-pointer block space-y-2">
                <Upload className="w-8 h-8 mx-auto text-cyan-400 animate-bounce" />
                <p className="text-sm font-semibold text-white">
                  {isUploadingPhoto ? 'Uploading photo...' : 'Click to select or drag & drop photo here'}
                </p>
                <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 10MB</p>
              </label>
            </div>
            {/* Direct URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Or paste photo URL directly:</label>
              <input
                maxLength={2000} type="text"
                value={pastedPhotoUrl}
                onChange={(e) => setPastedPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-bold hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateAvatar(pastedPhotoUrl)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Avatar</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PROFILE DELETION CONFIRMATION MODAL */}
      {partnerToDelete && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <UserX className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-black text-white">
                Подтверждение Удаления Профиля
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Вы уверены, что хотите навсегда удалить профиль <strong className="text-white">{partnerToDelete.name}</strong>? Аккаунт будет окончательно удален из базы данных, а доступ к системе заблокирован.
              </p>
            </div>
            <div className="flex items-center gap-3 justify-center pt-2">
              <button
                onClick={() => setPartnerToDelete(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-950 text-xs font-bold transition-all cursor-pointer"
              >
                Отмена, Оставить
              </button>
              <button
                onClick={() => {
                  handleRemovePartner(partnerToDelete.id, partnerToDelete.name);
                  setPartnerToDelete(null);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/10 hover:shadow-rose-600/25 transition-all cursor-pointer"
              >
                Да, Удалить Профиль
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}