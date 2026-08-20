import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Job,
  Specialist,
  AuthUser,
  SupportTicket,
} from "../types";
import {
  ShieldAlert,
  Globe,
  Shield,
  AlertTriangle,
  UserCheck,
  UserX,
  Users,
  CheckCircle,
  Clock,
  Trash2,
  Plus,
  Search,
  MessageCircle,
  Inbox,
  Send,
  ChevronDown,
  ChevronUp,
  Edit2,
  Lock,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Sparkles,
  Building2,
  Calculator,
} from "lucide-react";
import { PORTUGAL_GEO, NETWORK_23_REGIONS } from "../lib/geo";
import { LocationSearchInput } from "./LocationSearchInput";
import Academy from "./Academy";
import { KnowledgeEvolutionPanel } from "./KnowledgeEvolutionPanel";
import TerritorialHubsManager from "./TerritorialHubsManager";
import CalculatorsPage from './calculators/CalculatorsPage';
import PricingEngineManager from './pricing/PricingEngineManager';
import NordBasePricingCalculator from "./NordBasePricingCalculator";
import { store } from "../store";
interface AdminDashboardProps {
  jobs: Job[];
  specialists: Specialist[];
  users: AuthUser[];
  inviteList: string[];
  onCreateLead?: (
    name: string,
    phone: string,
    location: string,
    description: string,
  ) => void;
  onApproveSpecialist: (userId: string) => void;
  onRejectSpecialist: (userId: string) => void;
  onInviteOperator: (email: string) => void;
  onRemoveOperatorInvite: (email: string) => void;
  currentUser?: AuthUser | null;
  onUpdateUsers?: (users: AuthUser[]) => void;
}
export default function AdminDashboard({
  jobs,
  specialists,
  users,
  currentUser,
  onUpdateUsers,
  onApproveSpecialist,
}: AdminDashboardProps) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<
    "hubs" | "profiles" | "network" | "operators" | "alerts" | "inbox" | "audit" | "academy" | "glossary" | "calculator"
  >("hubs");
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State for Regional Profiles & Freeze Control
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [userStatusFilter, setUserStatusFilter] = useState<string>("all");
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    city: string;
    role: string;
  }>({ name: "", email: "", phone: "", city: "", role: "customer" });

  // Determine active region dynamically based on the current user
  const myRegion = currentUser?.region || currentUser?.city || "Big Lisboa";
  const directorTitle = `Director / ${myRegion}`;
  
  // Dashboard Number
  const dashboardId = currentUser?.dashboardNumber || "Pt-RD-001";
  // Filter geography to match active region
  const activeRegionGeo = PORTUGAL_GEO.find((r) =>
    r.name.toLowerCase() === myRegion.toLowerCase() || r.name.toLowerCase().includes(myRegion.toLowerCase())
  ) || PORTUGAL_GEO[0];

  // Helper: Filter users or jobs by Active Region (Supports Portugal-wide, Big Lisboa, Lisboa City, or Regional Nodes)
  const isMyRegion = (userRegion?: string, userCity?: string) => {
    const myReg = myRegion.toLowerCase();
    const reg = (userRegion || "").toLowerCase();
    const city = (userCity || "").toLowerCase();
    if (myReg === "portugal" || myReg === "all" || !myReg) return true;

    // Check if the city/region belongs to myRegion in NETWORK_23_REGIONS
    const regionDef = NETWORK_23_REGIONS.find(
      r => r.region.toLowerCase() === myReg || r.name.toLowerCase() === myReg
    );
    if (regionDef) {
      const regionCities = regionDef.hubs.map(h => h.city.toLowerCase());
      const regionTerritories = regionDef.hubs.flatMap(h => h.territories.map(t => t.toLowerCase()));
      if (
        regionCities.includes(city) || 
        regionTerritories.includes(city) ||
        regionCities.includes(reg) ||
        regionTerritories.includes(reg)
      ) {
        return true;
      }
    }

    if (myReg === "big lisboa") {
      const bigLisboaCities = ["cascais", "sintra", "amadora", "oeiras", "loures", "odivelas", "almada", "barreiro", "seixal", "moita", "montijo", "lisboa"];
      return bigLisboaCities.some(c => city.includes(c) || reg.includes(c)) || reg === "big lisboa";
    }
    if (myReg === "lisboa city") {
      const lisboaCitySubnames = [
        "baixa-chiado", "avenidas novas", "parque das nações", "belém", "restelo", 
        "benfica", "carnide", "lumiar", "campo grande", "alvalade", "estrela", 
        "campo de ourique", "alcântara", "arroios", "santo antónio", "lisboa city"
      ];
      return lisboaCitySubnames.some(c => city.includes(c) || reg.includes(c)) || reg === "lisboa city";
    }
    return reg === myReg || city === myReg || (reg && myReg.includes(reg)) || (city && myReg.includes(city));
  };

  // Actions for Regional Profile Management
  const handleToggleFreezeUser = async (id: string, currentlyBlocked: boolean, name: string) => {
    if (onUpdateUsers) {
      const updated = users.map((u) =>
        u.id === id ? { ...u, isBlocked: !currentlyBlocked } : u
      );
      onUpdateUsers(updated);
      store.addAuditLog(
        currentlyBlocked ? "User Unblocked (Regional)" : "User Blocked / Frozen (Regional)",
        directorTitle,
        "regional_admin",
        myRegion,
        `${currentlyBlocked ? "Unblocked" : "Frozen / Blocked"} regional profile ${name} (${id})`
      );
    }
  };

  const handleApproveSpecialistInRegion = (userId: string, name: string) => {
    onApproveSpecialist(userId);
    store.addAuditLog(
      "Specialist Approved (Regional)",
      directorTitle,
      "regional_admin",
      myRegion,
      `Approved regional specialist account ${name} (${userId})`
    );
  };

  const handleDeleteUserInRegion = (id: string, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить профиль "${name}" из базы региона?`)) {
      if (onUpdateUsers) {
        const updated = users.filter((u) => u.id !== id);
        onUpdateUsers(updated);
        store.addAuditLog(
          "User Profile Deleted (Regional)",
          directorTitle,
          "regional_admin",
          myRegion,
          `Deleted regional profile ${name} (${id})`
        );
      }
    }
  };
  // --- NEW OPERATOR STATE ---
  const [newOpFirstName, setNewOpFirstName] = useState("");
  const [newOpLastName, setNewOpLastName] = useState("");
  const [newOpPhone, setNewOpPhone] = useState("");
  const [newOpWhatsapp, setNewOpWhatsapp] = useState("");
  const [newOpTelegram, setNewOpTelegram] = useState("");
  const [newOpEmail, setNewOpEmail] = useState("");
  const [newOpCity, setNewOpCity] = useState(
    activeRegionGeo.cities[0]?.name || ""
  );
    const [expandedOperatorId, setExpandedOperatorId] = useState<string | null>(
    null
  );
  const [operatorToDelete, setOperatorToDelete] = useState<{ id: string; name: string } | null>(null);
  const handleAddOperator = () => {
    if (!newOpEmail || !newOpFirstName) return;
    // Generate Pt-OP-... dashboard number
    const ops = users.filter((u) => u.role === "operator");
    const finalDashNum = `Pt-OP-${(ops.length + 1).toString().padStart(3, "0")}`;
    const newUser: AuthUser = {
      id: `u_${Date.now()}`,
      email: newOpEmail,
      name: `${newOpFirstName} ${newOpLastName}`.trim(),
      phone: newOpPhone,
      whatsapp: newOpWhatsapp,
      telegram: newOpTelegram,
      region: myRegion,
      city: newOpCity,
      role: "operator",
      dashboardNumber: finalDashNum,
            isNewUser: false,
      specialistStatus: "approved",
    };
    if (onUpdateUsers) {
      const updated = [...users, newUser];
      onUpdateUsers(updated);
      store.addAuditLog(
        "Territory Partner Added",
        directorTitle,
        "regional_admin",
        myRegion,
        `Added territory partner ${newUser.name} with ID ${finalDashNum}`
      );
    }
    // Reset Form fields
    setNewOpFirstName("");
    setNewOpLastName("");
    setNewOpPhone("");
    setNewOpWhatsapp("");
    setNewOpTelegram("");
    setNewOpEmail("");
      };
  const handleRemoveOperator = (id: string, name: string) => {
    if (onUpdateUsers) {
      const updated = users.filter((u) => u.id !== id);
      onUpdateUsers(updated);
      store.addAuditLog(
        "Territory Partner Removed",
        directorTitle,
        "regional_admin",
        myRegion,
        `Removed territory partner ${name}`
      );
    }
  };
  // --- LIVE CHAT STATE ---
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [localChats, setLocalChats] = useState<
    Record<string, { sender: string; text: string; time: string }[]>
  >({});
  // Seed default chats from other Directors and Supers on mount
  useEffect(() => {
    setLocalChats(prev => {
      if (Object.keys(prev).length > 0) return prev;
      return {
        'user-super-01': [
          { sender: 'other', text: "Hello! This is Oleg (Super 01). Hope all is going well in your district. Let me know if you need any operational support.", time: "10:24" }
        ],
        'user-super-02': [
          { sender: 'other', text: "Greetings! Territorial Partner 02 here. Let's make sure the pending territory partner response times remain under 5 minutes.", time: "09:15" }
        ],
        'user-rd-lisboa': [
          { sender: 'other', text: "Hey colleague! Lisboa region has had heavy Plumbing & Handyman demand today. How is the load on your end?", time: "08:45" }
        ],
        'user-rd-porto': [
          { sender: 'other', text: "Olá! Just checking in. Do you have some experienced specialists for Electrical or Pools to recommend?", time: "08:12" }
        ]
      };
    });
  }, []);
  // --- SUGGESTIONS STATE ---
  const [sugType, setSugType] = useState<"suggestion" | "complaint">("suggestion");
  const [sugTitle, setSugTitle] = useState("");
  const [sugContent, setSugContent] = useState("");
  const [sugSuccess, setSugSuccess] = useState(false);
  // Filter contacts to territory partners, other Regional Directors, and National Partners (Supers 01-04)
  const chatContacts = users.filter((u) => {
    if (u.id === currentUser?.id) return false;
    
    // Include all national partners
    if (u.role === "super_admin") return true;
    
    // Include other regional directors
    if (u.role === "regional_admin") return true;
    
    // Include operators of our active region
    if (u.role === "operator" && isMyRegion(u.region, u.city)) return true;
    
    return false;
  });
  const selectedChatUser = chatContacts.find((u) => u.id === activeChatUserId);
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
    setLocalChats((prev) => {
      const updatedChat = [...(prev[activeChatUserId] || []), newMsg];
      // Simulate live reply from Supers / Directors / Operators
      setTimeout(() => {
        const contact = users.find(u => u.id === activeChatUserId);
        const autoText = contact?.role === "super_admin"
          ? `Roger that. This is Territorial Partner ${contact.dashboardNumber || "01"} (${contact.name}). I've noted down your inquiry and will review it in the Executive dashboard.`
          : contact?.role === "regional_admin"
            ? `Thanks for reaching out! Regional Director ${contact.name} (${contact.region}) here. Let's sync up on this soon.`
            : `Hello Director! Received. Let me double-check this active dispatch immediately.`;
        const autoReply = {
          sender: "other",
          text: autoText,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setLocalChats(latest => ({
          ...latest,
          [activeChatUserId]: [...(latest[activeChatUserId] || []), autoReply]
        }));
      }, 1000);
      return {
        ...prev,
        [activeChatUserId]: updatedChat,
      };
    });
    setChatMessage("");
  };
  const handleCallToChat = (id: string) => {
    setActiveTab("inbox");
    setActiveChatUserId(id);
  };
  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sugTitle.trim() || !sugContent.trim()) return;
    store.addSuggestion(
      sugType,
      sugTitle,
      sugContent,
      currentUser?.name || "Regional Director",
      "regional_admin",
      myRegion
    );
    setSugTitle("");
    setSugContent("");
    setSugSuccess(true);
    setTimeout(() => setSugSuccess(false), 4000);
  };
  // Filter elements to our region
  const regionJobs = jobs.filter((j) => isMyRegion(j.region, j.city));
  const activeJobsCount = regionJobs.filter(
    (j) => j.status !== "completed" && j.status !== "cancelled"
  ).length;
  const regionOperators = users.filter(
    (u) => u.role === "operator" && isMyRegion(u.region, u.city)
  );
  const regionTickets = (store.getState().supportTickets || []).filter((t) => {
    const creator = users.find((u) => u.id === t.userId);
    return creator ? isMyRegion(creator.region, creator.city) : false;
  });
  const regionLogs = (store.getState().auditLogs || []).filter((l) =>
    l.territory.toLowerCase().includes(myRegion.toLowerCase())
  );
  // Overdue jobs (>= 5 minutes delayed response)
  const overdueJobs = regionJobs.filter((job) => {
    const isPendingOrActive = job.status !== "completed" && job.status !== "cancelled";
    const diffMs = Date.now() - new Date(job.createdAt).getTime();
    return isPendingOrActive && diffMs >= 5 * 60 * 1000;
  });
  return (
    <div className="w-full max-w-[1850px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20 p-6 sm:p-8 bg-[#181a20]/90 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-sm">
      
      {/* 🇵🇹 REGIONAL COMMAND CENTER HEADER */}
      <div className="mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
            {t('rp.directorTitle', 'Director / {{region}}', { region: myRegion })} <span className="text-cyan-400">/{dashboardId}</span>
          </h2>
          <p className="text-slate-400 mt-2 text-base sm:text-lg max-w-2xl">
            {t('rp.dashboardSubtitle', 'Regional Operations Command Center. Manage territory partners, track district coverage, and coordinate service requests.')}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCalculatorModal(true)}
            className="bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-bold transition-all cursor-pointer shadow-md active:scale-98"
            title={t('rp.calculatorTitle', 'NordBase Job & Lead Calculator')}
          >
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>{t('rp.calculator', 'Калькулятор NordBase')}</span>
          </button>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-3 flex items-center gap-3 shadow-lg">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
            <span className="text-base font-bold text-white tracking-wide">{t('rp.regionActive', 'Region Active')}</span>
          </div>
        </div>
      </div>
      {/* 🧭 NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-900/40 p-2.5 rounded-2xl border border-white/5 overflow-x-auto shadow-md">
        {[
          { id: "hubs", label: t('rp.hubs', 'Territorial Hubs (4 TP Seats)'), icon: Building2 },
          { id: "calculator", label: t('rp.calculator', '🧮 Calculator NordBase'), icon: Calculator },
          { id: "profiles", label: t('rp.profiles', 'Regional Profiles'), icon: UserCheck },
          { id: "network", label: t('rp.network', 'Network Overview'), icon: Globe },
          { id: "operators", label: t('rp.territoryPartners', 'Operators'), icon: Shield },
          { id: "alerts", label: t('rp.alerts', 'Tickets & Incidents'), icon: AlertTriangle },
          { id: "inbox", label: t('rp.inbox', 'Inbox & Chat'), icon: Inbox },
          { id: "audit", label: t('rp.audit', 'Security Audit Logs'), icon: ShieldAlert },
          { id: "glossary", label: t('rp.glossary', 'AI Glossary & Evolution'), icon: Sparkles },
          { id: "academy", label: t('rp.academy', 'Academy'), icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-6 py-4 text-base font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)]"
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
      {/* VIEW 0: TERRITORIAL HUBS MANAGER */}
      {activeTab === "hubs" && (
        <TerritorialHubsManager currentRegion={myRegion} />
      )}

      {/* VIEW: NORDBASE PRICING CALCULATOR */}
      {activeTab === "calculator" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <CalculatorsPage />
          <PricingEngineManager currentUser={currentUser} />
        </div>
      )}

      {/* VIEW: REGIONAL PROFILES & FREEZE MANAGEMENT */}
      {activeTab === "profiles" && (() => {
        // Build unified profiles list for this region
        const allRegionalProfiles: AuthUser[] = [];
        const seenIds = new Set<string>();

        users.forEach((u) => {
          if (isMyRegion(u.region, u.city)) {
            allRegionalProfiles.push(u);
            seenIds.add(u.id);
            if (u.phone) seenIds.add(u.phone);
          }
        });

        specialists.forEach((spec) => {
          if (isMyRegion(spec.region || myRegion, spec.city)) {
            if (!seenIds.has(spec.id) && (!spec.phone || !seenIds.has(spec.phone))) {
              allRegionalProfiles.push({
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
          }
        });

        // Filter regional profiles
        const filteredProfiles = allRegionalProfiles.filter((u) => {
          if (userRoleFilter !== "all" && u.role !== userRoleFilter) return false;
          if (userStatusFilter === "frozen" && !u.isBlocked) return false;
          if (userStatusFilter === "active" && u.isBlocked) return false;
          if (userStatusFilter === "pending" && u.specialistStatus !== 'pending_review') return false;
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

        const totalCount = allRegionalProfiles.length;
        const specCount = allRegionalProfiles.filter(u => u.role === 'specialist').length;
        const custCount = allRegionalProfiles.filter(u => u.role === 'customer').length;
        const opCount = allRegionalProfiles.filter(u => u.role === 'operator').length;
        const frozenCount = allRegionalProfiles.filter(u => u.isBlocked).length;

        return (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Регион: Профилей</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">{totalCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">{myRegion}</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Специалисты</span>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400 font-mono">{specCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">В районе {myRegion}</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Заказчики</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-blue-400 font-mono">{custCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Клиенты региона</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Операторы (TP)</span>
                  <Shield className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-purple-400 font-mono">{opCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Смена {myRegion}</div>
              </div>

              <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Заморожено</span>
                  <Lock className="w-4 h-4 text-rose-400 animate-pulse" />
                </div>
                <div className="text-3xl font-black text-rose-400 font-mono">{frozenCount}</div>
                <div className="text-[11px] text-slate-400 mt-1">Заблокировано в регионе</div>
              </div>
            </div>

            {/* Main Profile Control Box */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-3">
                    <UserX className="w-7 h-7 text-cyan-400" />
                    <span>Управление и Заморозка Профилей Региона</span>
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Региональный контроль RP: заморозка, одобрение специалистов и управление аккаунтами в {myRegion}.
                  </p>
                </div>
                <div className="text-xs text-slate-400 font-mono bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 self-start lg:self-auto">
                  Региональные профили: <span className="text-cyan-400 font-bold">{filteredProfiles.length}</span> из {totalCount}
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
                    <option value="all">🌐 Все роли в регионе</option>
                    <option value="specialist">🔧 Специалисты (Specialists)</option>
                    <option value="customer">👤 Заказчики (Customers)</option>
                    <option value="operator">🏢 Операторы (Operators / TP)</option>
                    <option value="regional_admin">🌍 Региональные Директора (RD / RP)</option>
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
                    <option value="pending">⏳ Ожидающие одобрения</option>
                  </select>
                </div>
              </div>

              {/* Profiles Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/40">
                <div className="min-w-[900px] divide-y divide-slate-800/60">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 py-3.5 px-5 bg-slate-950 text-slate-400 font-bold text-xs uppercase tracking-wider">
                    <div className="col-span-4">Пользователь & Email</div>
                    <div className="col-span-2">Роль</div>
                    <div className="col-span-2">Статус / Город</div>
                    <div className="col-span-2">Контакты</div>
                    <div className="col-span-2 text-right">Действия RP</div>
                  </div>

                  {/* Rows */}
                  {filteredProfiles.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 space-y-2">
                      <Search className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-sm font-bold text-slate-400">В вашем регионе не найдено профилей</p>
                      <p className="text-xs">Попробуйте сбросить фильтры поиска.</p>
                    </div>
                  ) : (
                    filteredProfiles.map((u) => {
                      const isFrozen = !!u.isBlocked;
                      const isPendingSpec = u.role === 'specialist' && u.specialistStatus === 'pending_review';

                      return (
                        <div
                          key={u.id}
                          className={`grid grid-cols-12 gap-4 py-4 px-5 items-center transition-colors ${
                            isFrozen ? 'bg-rose-950/20 hover:bg-rose-950/30' : 'hover:bg-slate-900/50'
                          }`}
                        >
                          {/* User Info */}
                          <div className="col-span-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                              isFrozen
                                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                                : u.role === 'specialist'
                                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                  : u.role === 'operator'
                                    ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                                    : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                            }`}>
                              {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-white text-sm flex items-center gap-2 truncate">
                                <span>{u.name || "Без имени"}</span>
                                {isFrozen && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                    ЗАМОРОЖЕН
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400 font-mono truncate">{u.email || u.id}</div>
                            </div>
                          </div>

                          {/* Role Badge */}
                          <div className="col-span-2">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                              u.role === 'specialist'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : u.role === 'operator'
                                  ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                                  : u.role === 'regional_admin'
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}>
                              {u.role}
                            </span>
                          </div>

                          {/* Status / Location */}
                          <div className="col-span-2">
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{u.city || u.region || myRegion}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {isPendingSpec ? (
                                <span className="text-amber-400 font-bold flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Ожидает верификации
                                </span>
                              ) : isFrozen ? (
                                <span className="text-rose-400">Заблокирован</span>
                              ) : (
                                <span className="text-emerald-400">Активен</span>
                              )}
                            </div>
                          </div>

                          {/* Contacts */}
                          <div className="col-span-2 text-xs text-slate-300 space-y-0.5">
                            <div className="font-mono text-slate-200">{u.phone || 'Нет телефона'}</div>
                            {u.dashboardNumber && (
                              <div className="text-[10px] text-cyan-400 font-mono">
                                ID: {u.dashboardNumber}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="col-span-2 flex items-center justify-end gap-2">
                            {isPendingSpec && (
                              <button
                                type="button"
                                onClick={() => handleApproveSpecialistInRegion(u.id, u.name || u.id)}
                                className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                title="Одобрить специалиста"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Одобрить</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleToggleFreezeUser(u.id, isFrozen, u.name || u.id)}
                              className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                isFrozen
                                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                                  : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40'
                              }`}
                              title={isFrozen ? "Разблокировать профиль" : "Заморозить профиль"}
                            >
                              {isFrozen ? (
                                <>
                                  <UserCheck className="w-4 h-4" />
                                  <span className="hidden xl:inline">Разморозить</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-4 h-4" />
                                  <span className="hidden xl:inline">Заморозить</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteUserInRegion(u.id, u.name || u.id)}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer"
                              title="Удалить профиль"
                            >
                              <Trash2 className="w-4 h-4" />
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
      {/* VIEW 1: REGIONAL DISTRICT NETWORK */}
      {activeTab === "network" && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6">
            District Coverage Nodes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRegionGeo.cities.map((city) => {
              const cityJobs = regionJobs.filter((j) =>
                (j.city || "").toLowerCase().includes(city.name.toLowerCase())
              );
              const cityActiveJobs = cityJobs.filter(
                (j) => j.status !== "completed" && j.status !== "cancelled"
              );
              const cityOps = regionOperators.filter((o) =>
                (o.city || "").toLowerCase().includes(city.name.toLowerCase())
              ).length;
              return (
                <div
                  key={city.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-5 mb-6">
                    <span className="text-5xl">🇵🇹</span>
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-1">
                        {city.name}
                      </h4>
                      <p className="text-base text-slate-400">
                        {cityActiveJobs.length} Active Jobs
                      </p>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-slate-800 flex justify-between text-base">
                    <span className="text-slate-400">Territory Partners:</span>
                    <span className="text-white font-black text-lg">
                      {cityOps}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* VIEW 2: OPERATORS MANAGEMENT */}
      {activeTab === "operators" && (
        <div className="space-y-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <h3 className="text-xl font-black text-white mb-8">
              Add New Operator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={newOpFirstName}
                  onChange={(e) => setNewOpFirstName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="Carlos"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={newOpLastName}
                  onChange={(e) => setNewOpLastName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newOpEmail}
                  onChange={(e) => setNewOpEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="carlos@nordbase.pt"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={newOpPhone}
                  onChange={(e) => setNewOpPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="+351..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={newOpWhatsapp}
                  onChange={(e) => setNewOpWhatsapp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="+351..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  Telegram
                </label>
                <input
                  type="text"
                  value={newOpTelegram}
                  onChange={(e) => setNewOpTelegram(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  City Node
                </label>
                <LocationSearchInput
                  value={newOpCity}
                  onChange={(val) => setNewOpCity(val)}
                  placeholder="Type city node..."
                />
              </div>
              <div>
                <button
                  onClick={handleAddOperator}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-colors h-[50px] w-full shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  Add Operator
                </button>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <h3 className="text-xl font-black text-white">
                Region Operators Directory
              </h3>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search operators..."
                  className="w-full sm:w-80 bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-5 py-3 text-base text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[800px] divide-y divide-slate-800/50">
                <div className="grid grid-cols-12 gap-4 pb-4 text-slate-400 font-bold px-4">
                  <div className="col-span-3">Name / Contact</div>
                  <div className="col-span-3">City Node</div>
                  <div className="col-span-3">Dash No.</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>
                {regionOperators
                  .filter(
                    (u) =>
                      (u.name || "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      (u.email || "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((op) => {
                    const isExpanded = expandedOperatorId === op.id;
                    return (
                      <div
                        key={op.id}
                        className="border-b border-slate-800/50 last:border-0 bg-slate-900/20 hover:bg-slate-800/40 transition-colors rounded-xl mb-2"
                      >
                        {/* Summary Row */}
                        <div
                          className="grid grid-cols-12 gap-4 py-4 px-4 items-center cursor-pointer"
                          onClick={() =>
                            setExpandedOperatorId(isExpanded ? null : op.id)
                          }
                        >
                          <div className="col-span-3">
                            <div className="font-bold text-white">
                              {op.name || "Unnamed"}
                            </div>
                            <div className="text-sm text-slate-400">
                              {op.email}
                            </div>
                          </div>
                          <div className="col-span-3">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold">
                              {op.city || "Global"}
                            </span>
                          </div>
                          <div className="col-span-3 text-slate-300 font-mono text-sm">
                            {op.dashboardNumber || "-"}
                          </div>
                          <div className="col-span-3 flex justify-end gap-2 items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCallToChat(op.id);
                              }}
                              className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                              title="Call to chat"
                            >
                              <MessageCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOperatorToDelete({ id: op.id, name: op.name });
                              }}
                              className="p-2 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                              title="Remove operator"
                            >
                              <UserX className="w-5 h-5" />
                            </button>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-slate-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                        </div>
                        {/* Collapsible Details Panel */}
                        {isExpanded && (
                          <div className="px-4 pb-6 pt-2 border-t border-slate-800/50 bg-slate-900/50">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                              <div>
                                <div className="text-xs text-slate-500 font-bold mb-1">
                                  Phone
                                </div>
                                <div className="text-white flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-slate-400" />{" "}
                                  {op.phone || "N/A"}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 font-bold mb-1">
                                  WhatsApp
                                </div>
                                <div className="text-white flex items-center gap-2">
                                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                                  {op.whatsapp ? (
                                    <a
                                      href={`https://wa.me/${op.whatsapp.replace(/[^0-9]/g, "")}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="hover:text-emerald-400 transition-colors"
                                    >
                                      {op.whatsapp}
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
                                  {op.telegram ? (
                                    <a
                                      href={`https://t.me/${op.telegram.replace("@", "")}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="hover:text-blue-400 transition-colors"
                                    >
                                      {op.telegram}
                                    </a>
                                  ) : (
                                    "N/A"
                                  )}
                                </div>
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
      {/* VIEW 3: TICKETS & INCIDENTS */}
      {activeTab === "alerts" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: OVERDUE ORDERS & LOCAL TICKETS */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* OVERDUE ORDERS SECTION */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-rose-400" />
                    Overdue District Orders (5m+)
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Orders assigned to operators that have been delayed over 5 minutes.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {overdueJobs.length > 0 ? (
                  overdueJobs.map((job) => {
                    const assignedOp = users.find(
                      (u) => u.id === job.operatorId && u.role === "operator"
                    );
                    const diffMins = Math.floor(
                      (Date.now() - new Date(job.createdAt).getTime()) / 60000
                    );
                    return (
                      <div
                        key={job.id}
                        className="bg-slate-950/50 border border-rose-500/20 hover:border-rose-500/40 rounded-2xl p-6 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 text-xs font-mono font-bold rounded border border-rose-500/20">
                                DELAYED {diffMins} MINS
                              </span>
                              <span className="text-slate-400 font-bold text-sm">
                                {job.category}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-white mt-2">
                              {job.description}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-slate-400 block font-mono">
                              ID: {job.id}
                            </span>
                            <span className="text-sm font-semibold text-cyan-400 block mt-1">
                              📍 {job.city} / {myRegion}
                            </span>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                              Assigned Operator
                            </div>
                            <div className="text-white font-bold text-sm mt-1 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                              {assignedOp ? assignedOp.name : "Unassigned Operator"}
                              {assignedOp && (
                                <span className="text-xs text-slate-500 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                  {assignedOp.dashboardNumber || "No Dash #"}
                                </span>
                              )}
                            </div>
                          </div>
                          {assignedOp && (
                            <button
                              onClick={() => handleCallToChat(assignedOp.id)}
                              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-[0_4px_10px_rgba(37,99,235,0.2)] hover:scale-102 flex items-center gap-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Chat with {assignedOp.name.split(" ")[0]}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 bg-slate-950/20 border border-slate-800 border-dashed rounded-2xl">
                    <Shield className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 font-bold text-sm">
                      No overdue orders. All territory partners are responding on time.
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* LOCAL TICKETS SECTION */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-purple-400" />
                Local District Tickets & Alerts
              </h3>
              <div className="flex flex-col gap-5">
                {regionTickets && regionTickets.length > 0 ? (
                  regionTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-slate-950/40 border border-slate-850 rounded-2xl p-6 flex items-start gap-4 hover:border-slate-700 transition-colors"
                    >
                      <div className="bg-purple-500/10 p-3 rounded-full text-purple-400">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-white">
                            {ticket.title}
                          </h4>
                          <span className="text-xs text-slate-500 font-mono bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                            {ticket.id}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {ticket.description}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              ticket.status === "open"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {ticket.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-slate-950/20 border border-slate-800 border-dashed rounded-2xl">
                    <Shield className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 font-bold text-sm">
                      No local active support tickets.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* RIGHT SIDE: SUGGESTIONS & COMPLAINTS BOX */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-cyan-500/10 p-3 rounded-full text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <Inbox className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    Suggestions & Complaints Box
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your feedback is routed directly to the Territorial Partners dashboard.
                  </p>
                </div>
              </div>
              {sugSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center text-emerald-400 animate-in zoom-in duration-300 my-6">
                  <span className="text-4xl">📬</span>
                  <h4 className="text-lg font-bold mt-3">Feedback Submitted Successfully!</h4>
                  <p className="text-sm text-slate-300 mt-1">
                    Territorial Partners (Supers 01-04) have been notified and will review your proposal shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitSuggestion} className="space-y-5 mt-6">
                  <div>
                    <label className="block text-sm text-slate-400 font-bold mb-2">
                      Feedback Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSugType("suggestion")}
                        className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                          sugType === "suggestion"
                            ? "bg-cyan-600/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-950/50"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        💡 Suggestion
                      </button>
                      <button
                        type="button"
                        onClick={() => setSugType("complaint")}
                        className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                          sugType === "complaint"
                            ? "bg-rose-600/20 border-rose-500 text-rose-300 shadow-lg shadow-rose-950/50"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        ⚠️ Complaint
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 font-bold mb-2">
                      Title / Topic
                    </label>
                    <input
                      type="text"
                      value={sugTitle}
                      onChange={(e) => setSugTitle(e.target.value)}
                      placeholder="e.g., Regional partner bonus structure or platform bug..."
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 font-bold mb-2">
                      Message Content
                    </label>
                    <textarea
                      value={sugContent}
                      onChange={(e) => setSugContent(e.target.value)}
                      placeholder="Describe your suggestion or incident in detail..."
                      required
                      rows={5}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none leading-relaxed"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:scale-102 active:scale-98"
                  >
                    Send to Territorial Partners
                  </button>
                </form>
              )}
            </div>
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
                District Channels
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                Active Region Operators
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setActiveChatUserId(contact.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    activeChatUserId === contact.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                      : "hover:bg-slate-800/80 text-slate-300"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activeChatUserId === contact.id ? "bg-blue-500" : "bg-slate-800"
                    }`}
                  >
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left overflow-hidden">
                    <div className="font-bold truncate text-base">
                      {contact.name || contact.email}
                    </div>
                    <div
                      className={`text-xs font-semibold uppercase tracking-wider mt-0.5 ${
                        activeChatUserId === contact.id
                          ? "text-blue-100"
                          : contact.role === "super_admin"
                            ? "text-rose-400 font-bold"
                            : contact.role === "regional_admin"
                              ? "text-purple-400 font-bold"
                              : "text-slate-400"
                      }`}
                    >
                      {contact.role === "super_admin"
                        ? `Super ${contact.dashboardNumber || "01"}`
                        : contact.role === "regional_admin"
                          ? `Director • ${contact.region}`
                          : `Territory Partner • ${contact.city || "Local"}`}
                    </div>
                  </div>
                </button>
              ))}
              {chatContacts.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No operators or contacts registered.
                </div>
              )}
            </div>
          </div>
          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-slate-900/30">
            {selectedChatUser ? (
              <>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-xl">
                        {selectedChatUser.name || selectedChatUser.email}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {selectedChatUser.role === "super_admin"
                          ? `Territorial Partner • Dashboard ${selectedChatUser.dashboardNumber || "01"}`
                          : selectedChatUser.role === "regional_admin"
                            ? `Regional Director • ${selectedChatUser.region || "Portugal"}`
                            : `Territory Partner • ${selectedChatUser.city || "Algarve"}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {selectedChatMessages.map((msg, idx) => {
                    const isMe = msg.sender === "me";
                    return (
                      <div
                        key={idx}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-3xl p-5 ${
                            isMe
                              ? "bg-blue-600 text-white rounded-br-none shadow-[0_5px_15px_rgba(37,99,235,0.2)]"
                              : "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none shadow-lg"
                          }`}
                        >
                          <p className="text-base leading-relaxed">{msg.text}</p>
                          <span className="text-xs text-slate-400 mt-3 block opacity-80 font-mono">
                            {msg.time}
                          </span>
                        </div>
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
                      type="text"
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
                <h3 className="text-2xl font-bold text-slate-400">Your Inbox</h3>
                <p className="text-base">
                  Select a territory partner to begin direct communication
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* VIEW 5: SECURITY AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-black text-white mb-8">
            Security Audit Logs / {myRegion}
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
                {regionLogs
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
                {regionLogs.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-20 text-slate-500 text-lg"
                    >
                      No audit logs recorded for this district.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* VIEW 6: GLOSSARY & AI KNOWLEDGE EVOLUTION */}
      {activeTab === "glossary" && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <KnowledgeEvolutionPanel />
        </div>
      )}
      {/* VIEW 7: ACADEMY */}
      {activeTab === "academy" && (
        <div className="h-[800px] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <Academy userRole="regional_admin" />
        </div>
      )}
      {/* TERRITORY PARTNER DELETION CONFIRMATION MODAL */}
      {operatorToDelete && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <UserX className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-black text-white">
                Confirm Territory Partner Removal
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Are you sure you want to permanently remove territory partner <strong className="text-white">{operatorToDelete.name}</strong> from the <strong className="text-cyan-400">{myRegion}</strong> network? This territory partner will lose access instantly.
              </p>
            </div>
            <div className="flex items-center gap-3 justify-center pt-2">
              <button
                onClick={() => setOperatorToDelete(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-950 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel, Keep Active
              </button>
              <button
                onClick={() => {
                  handleRemoveOperator(operatorToDelete.id, operatorToDelete.name);
                  setOperatorToDelete(null);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/10 hover:shadow-rose-600/25 transition-all cursor-pointer"
              >
                Yes, Remove Operator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧮 NORDBASE PRICING CALCULATOR MODAL */}
      {showCalculatorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-4 sm:p-6 relative max-h-[92vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-base sm:text-lg">
                <Calculator className="w-5 h-5 text-cyan-400" />
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