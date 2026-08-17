import React, { useState, useMemo } from "react";
import {
  Globe,
  Shield,
  Search,
  MessageCircle,
  UserCheck,
  UserX,
  Lock,
  Phone,
  Mail,
  MapPin,
  Users,
  Building2,
  ChevronDown,
  ChevronRight,
  Edit2,
  Zap,
  RotateCcw,
  Trash2,
  AlertTriangle,
  Coins,
  Send,
  Sparkles,
  Check,
  X,
  ExternalLink,
  Briefcase,
  History,
  Languages,
  ArrowRight,
  User,
  BadgeCheck,
  ShieldAlert,
  PlusCircle,
  LayoutDashboard
} from "lucide-react";
import { AuthUser, Job, Specialist, AuditLog, ServiceCategory, Message } from "../types";
import { PORTUGAL_GEO, NETWORK_23_REGIONS, NetworkRPDef, NetworkHubDef } from "../lib/geo";
import { store } from "../store";
import { useAITranslation } from "../hooks/useAITranslation";

interface NetworkPortugalControlCenterProps {
  users: AuthUser[];
  jobs: Job[];
  specialists: Specialist[];
  auditLogs: AuditLog[];
  onUpdateUsers: (users: AuthUser[]) => void;
  onUpdateJobs: (jobs: Job[]) => void;
  onAddAuditLog: (
    action: string,
    actorName: string,
    actorRole: string,
    territory: string,
    details: string
  ) => void;
}

export default function NetworkPortugalControlCenter({
  users,
  jobs,
  specialists,
  auditLogs,
  onUpdateUsers,
  onUpdateJobs,
  onAddAuditLog,
}: NetworkPortugalControlCenterProps) {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<
    "hierarchy" | "search" | "rps" | "hubs" | "jobs" | "chat" | "audit"
  >("hierarchy");

  // Global Omnibox Search
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selection for Inspector Panel
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [inspectorTab, setInspectorTab] = useState<"profile" | "jobs" | "chat" | "audit">("profile");

  // Expanded Tree Nodes State
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "portugal": true,
    "rp_big_lisboa": true,
    "rp_algarve": true,
    "rp_porto": true,
  });

  // Editing User Modal/Mode State
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<AuthUser>>({});

  // Freeze Modal State
  const [freezeModalUser, setFreezeModalUser] = useState<AuthUser | null>(null);
  const [freezeReason, setFreezeReason] = useState("");

  // Delete Confirmation State
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AuthUser | null>(null);

  // Multi-Lingual Administrative Chat State
  const [chatMessageText, setChatMessageText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("pt");
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const { translate } = useAITranslation();

  // Local Chat History per User ID (storage for admin direct messages)
  const [adminChats, setAdminChats] = useState<Record<string, Message[]>>({});

  // Currently Selected User Object
  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    return users.find((u) => u.id === selectedUserId) || null;
  }, [users, selectedUserId]);

  // Handle Expand / Collapse Nodes
  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Perform Global Search Across Users & Jobs
  const globalSearchResults = useMemo(() => {
    if (!globalSearchQuery.trim()) return [];

    const q = globalSearchQuery.toLowerCase().trim();
    return users.filter((u) => {
      // Role Filter
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      // Status Filter
      if (statusFilter === "frozen" && !u.isBlocked) return false;
      if (statusFilter === "active" && u.isBlocked) return false;

      const nameMatch = (u.name || "").toLowerCase().includes(q);
      const emailMatch = (u.email || "").toLowerCase().includes(q);
      const phoneMatch = (u.phone || "").toLowerCase().includes(q);
      const idMatch = (u.id || "").toLowerCase().includes(q);
      const roleMatch = (u.role || "").toLowerCase().includes(q);
      const dashMatch = (u.dashboardNumber || "").toLowerCase().includes(q);
      const regionMatch = (u.region || "").toLowerCase().includes(q);
      const cityMatch = (u.city || "").toLowerCase().includes(q);

      // Also search related Job IDs
      const userJobMatch = jobs.some(
        (j) =>
          (j.id.toLowerCase().includes(q) || j.category.toLowerCase().includes(q)) &&
          (j.operatorId === u.id || j.unlockedBySpecialistId === u.id || j.customerPhone === u.phone)
      );

      return (
        nameMatch ||
        emailMatch ||
        phoneMatch ||
        idMatch ||
        roleMatch ||
        dashMatch ||
        regionMatch ||
        cityMatch ||
        userJobMatch
      );
    });
  }, [globalSearchQuery, users, jobs, roleFilter, statusFilter]);

  // Network 23 Regions State (with dynamic Hub creation)
  const [networkRegions, setNetworkRegions] = useState<NetworkRPDef[]>(NETWORK_23_REGIONS);

  // Hub Creation Modal State
  const [isAddHubModalOpen, setIsAddHubModalOpen] = useState(false);
  const [selectedRegionForHub, setSelectedRegionForHub] = useState<string>("rp_algarve");
  const [newHubName, setNewHubName] = useState("");
  const [newHubCity, setNewHubCity] = useState("");
  const [newHubTerritories, setNewHubTerritories] = useState("");
  const [newHubTpsCount, setNewHubTpsCount] = useState(4);

  // Email Assignment Modal State (Google Auth Direct Assignment for RD & TP Seats)
  const [assignModalData, setAssignModalData] = useState<{
    isOpen: boolean;
    type: 'RD' | 'TP';
    rpId: string;
    hubId?: string;
    seatNumber?: number;
    targetEmail: string;
  }>({
    isOpen: false,
    type: 'TP',
    rpId: '',
    targetEmail: ''
  });

  // Active Hub Dashboard Inspection View
  const [activeHubDashboard, setActiveHubDashboard] = useState<{
    rp: NetworkRPDef;
    hub: NetworkHubDef;
  } | null>(null);

  // Aggregate Regional Partners list
  const regionalPartners = useMemo(() => {
    return networkRegions;
  }, [networkRegions]);

  // Handler: Add Hub to Region
  const handleAddHubSubmit = () => {
    if (!newHubName.trim() || !newHubCity.trim()) return;

    const rpTarget = networkRegions.find(r => r.id === selectedRegionForHub);
    if (!rpTarget) return;

    const newHub: NetworkHubDef = {
      id: `hub_${Date.now().toString().slice(-6)}`,
      code: `HUB-${rpTarget.code.replace('Pt-RD-', '')}-${(rpTarget.hubs.length + 1).toString().padStart(3, '0')}`,
      name: newHubName.trim(),
      city: newHubCity.trim(),
      territories: newHubTerritories ? newHubTerritories.split(',').map(t => t.trim()).filter(Boolean) : [newHubCity.trim()],
      tpsCount: Number(newHubTpsCount) || 4
    };

    setNetworkRegions(prev => prev.map(rp => {
      if (rp.id === selectedRegionForHub) {
        return {
          ...rp,
          hubs: [...rp.hubs, newHub]
        };
      }
      return rp;
    }));

    onAddAuditLog(
      "Create Hub in Territory",
      "Director NordBase /01",
      "super_admin",
      rpTarget.region,
      `Added new Hub "${newHub.name}" (${newHub.code}) in ${newHub.city} with ${newHub.tpsCount} TP Seats.`
    );

    // Reset Form
    setNewHubName("");
    setNewHubCity("");
    setNewHubTerritories("");
    setIsAddHubModalOpen(false);
  };

  // Handler: Assign User by Email (Google Auth Alignment)
  const handleConfirmEmailAssignment = () => {
    const { type, rpId, hubId, seatNumber, targetEmail } = assignModalData;
    if (!targetEmail.trim()) return;

    const cleanEmail = targetEmail.trim().toLowerCase();
    const rpTarget = networkRegions.find(r => r.id === rpId);
    const regionName = rpTarget?.region || "Portugal";

    // Check if user exists in current users list
    const targetUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (targetUser) {
      // Update existing user role and assignment
      const updatedUsers = users.map(u => {
        if (u.id === targetUser!.id) {
          return {
            ...u,
            role: type === 'RD' ? ('regional_admin' as const) : ('operator' as const),
            region: regionName,
            city: hubId ? (rpTarget?.hubs.find(h => h.id === hubId)?.city || u.city) : u.city,
            hubId: hubId || u.hubId,
            seatNumber: seatNumber || u.seatNumber
          };
        }
        return u;
      });
      onUpdateUsers(updatedUsers);
    } else {
      // Create invited user entry with Google Auth ready status
      const newUser: AuthUser = {
        id: `usr-assigned-${Date.now().toString().slice(-6)}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
        role: type === 'RD' ? 'regional_admin' : 'operator',
        region: regionName,
        city: hubId ? (rpTarget?.hubs.find(h => h.id === hubId)?.city || "Portugal") : "Portugal",
        hubId: hubId,
        seatNumber: seatNumber,
        dashboardNumber: rpTarget?.code
      };
      onUpdateUsers([...users, newUser]);
    }

    onAddAuditLog(
      `Assign ${type} by Email`,
      "Director NordBase /01",
      "super_admin",
      regionName,
      `Assigned ${type} position to email "${cleanEmail}" in ${rpTarget?.name || 'Region'}${hubId ? ` (Hub Seat ${seatNumber})` : ''}. Google login enabled.`
    );

    setAssignModalData(prev => ({ ...prev, isOpen: false, targetEmail: '' }));
  };

  // Impersonation ("Manage as User") Action
  const handleManageAsUser = (user: AuthUser) => {
    onAddAuditLog(
      "Manage As User (Impersonation)",
      "Director NordBase /01",
      "super_admin",
      user.region || "Portugal",
      `SuperAdmin initiated admin control mode as user ${user.name} (${user.id}, role: ${user.role})`
    );
    store.impersonateUser(user);
  };

  // Open Edit User Modal
  const handleStartEditUser = (user: AuthUser) => {
    setEditFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      region: user.region || "Big Lisboa",
      city: user.city || "Cascais",
      district: user.district || "",
      specialistStatus: user.specialistStatus || "approved",
      isBlocked: user.isBlocked || false,
    });
    setIsEditingUser(true);
  };

  // Save Edit User Changes
  const handleSaveUserEdit = () => {
    if (!editFormData.id) return;

    const updatedUsers = users.map((u) => {
      if (u.id === editFormData.id) {
        return {
          ...u,
          name: editFormData.name || u.name,
          email: editFormData.email || u.email,
          phone: editFormData.phone || u.phone,
          role: editFormData.role || u.role,
          region: editFormData.region || u.region,
          city: editFormData.city || u.city,
          district: editFormData.district || u.district,
          specialistStatus: editFormData.specialistStatus || u.specialistStatus,
          isBlocked: editFormData.isBlocked ?? u.isBlocked,
        };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);
    onAddAuditLog(
      "Edit User Profile",
      "Director NordBase /01",
      "super_admin",
      editFormData.region || "Portugal",
      `Updated user profile data for ${editFormData.name} (${editFormData.id})`
    );
    setIsEditingUser(false);
  };

  // Execute Freeze Account
  const handleConfirmFreeze = () => {
    if (!freezeModalUser) return;

    const updatedUsers = users.map((u) => {
      if (u.id === freezeModalUser.id) {
        return { ...u, isBlocked: true };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);
    onAddAuditLog(
      "Freeze Account",
      "Director NordBase /01",
      "super_admin",
      freezeModalUser.region || "Portugal",
      `Account ${freezeModalUser.name} (${freezeModalUser.id}) was TEMPORARILY FROZEN. Reason: ${freezeReason || "Administrative security compliance audit"}`
    );

    setFreezeModalUser(null);
    setFreezeReason("");
  };

  // Execute Unfreeze Account
  const handleUnfreezeUser = (user: AuthUser) => {
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return { ...u, isBlocked: false };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);
    onAddAuditLog(
      "Unfreeze Account",
      "Director NordBase /01",
      "super_admin",
      user.region || "Portugal",
      `Account ${user.name} (${user.id}) was RESTORED / UNFROZEN to active status.`
    );
  };

  // Execute Delete / Deactivate User
  const handleConfirmDelete = () => {
    if (!deleteConfirmUser) return;

    const updatedUsers = users.filter((u) => u.id !== deleteConfirmUser.id);
    onUpdateUsers(updatedUsers);
    onAddAuditLog(
      "Delete Account (Deactivation)",
      "Director NordBase /01",
      "super_admin",
      deleteConfirmUser.region || "Portugal",
      `DELETED / DEACTIVATED account ${deleteConfirmUser.name} (${deleteConfirmUser.id}, ${deleteConfirmUser.email})`
    );

    if (selectedUserId === deleteConfirmUser.id) {
      setSelectedUserId(null);
    }
    setDeleteConfirmUser(null);
  };

  // Multi-Lingual AI Chat Message Sending
  const handleSendAdminMessage = async () => {
    if (!chatMessageText.trim() || !selectedUserId) return;

    const textToSend = chatMessageText.trim();
    let translatedText = textToSend;

    if (autoTranslateEnabled && targetLanguage !== "en") {
      setIsTranslating(true);
      try {
        const res = await translate(textToSend, targetLanguage, "en", "SuperAdmin direct communication");
        translatedText = res.translatedText;
      } catch (err) {
        console.warn("[AdminChat] AI Translation fallback:", err);
      } finally {
        setIsTranslating(false);
      }
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "super_admin",
      senderName: "Director NordBase /01",
      content: translatedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      originalLanguage: "en",
      translations: {
        [targetLanguage]: translatedText,
        en: textToSend
      }
    };

    setAdminChats((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), newMessage]
    }));

    setChatMessageText("");

    onAddAuditLog(
      "Send Admin Message",
      "Director NordBase /01",
      "super_admin",
      selectedUser?.region || "Portugal",
      `Sent administrative message to ${selectedUser?.name} (Language: ${targetLanguage.toUpperCase()})`
    );
  };

  // Render Role Badge Helper
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase">SuperAdmin (HQ)</span>;
      case "regional_admin":
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase">Regional Director (RD)</span>;
      case "operator":
        return <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase">Territory Partner (TP)</span>;
      case "specialist":
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase">Specialist</span>;
      default:
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase">Customer</span>;
    }
  };

  // Render Status Badge Helper
  const renderStatusBadge = (user: AuthUser) => {
    if (user.isBlocked) {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase">
          <Lock className="w-3 h-3" /> Frozen
        </span>
      );
    }
    if (user.specialistStatus === "pending_review") {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase">
          <AlertTriangle className="w-3 h-3" /> Pending Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase">
        <Check className="w-3 h-3" /> Active
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 🧭 TOP HEADER: CONTROL CENTER TITLE & GLOBAL OMNIBOX SEARCH */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Network Portugal Control Center
                </h2>
                <p className="text-slate-400 text-sm mt-0.5">
                  National Administrative Hierarchy • Reach any participant in 2–3 clicks
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl px-4 py-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Hierarchy Members</span>
              <span className="text-lg font-black text-white font-mono">{users.length}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl px-4 py-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Regional Networks</span>
              <span className="text-lg font-black text-purple-400 font-mono">{networkRegions.length} RDs</span>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl px-4 py-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Territorial Hubs</span>
              <span className="text-lg font-black text-cyan-400 font-mono">
                {networkRegions.reduce((sum, r) => sum + r.hubs.length, 0)} Hubs
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl px-4 py-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Jobs</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{jobs.filter(j => j.status === 'active').length}</span>
            </div>
          </div>
        </div>

        {/* OMNIBOX SEARCH & FILTERS */}
        <div className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Global Search Bar */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value);
                  if (activeTab !== "search") setActiveTab("search");
                }}
                placeholder="Global Search: Name, Email, Phone, ID, Role, City, Job ID..."
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner font-medium"
              />
              {globalSearchQuery && (
                <button
                  onClick={() => setGlobalSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Role Filter Selector */}
            <div className="md:col-span-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-2xl px-4 py-3.5 text-sm text-slate-300 font-semibold focus:outline-none cursor-pointer appearance-none"
              >
                <option value="all">🌐 All Roles</option>
                <option value="regional_admin">🌍 Regional Directors (RD)</option>
                <option value="operator">🏢 Territory Partners (TP)</option>
                <option value="specialist">🔧 Specialists</option>
                <option value="customer">👤 Customers</option>
                <option value="super_admin">⚡ SuperAdmins</option>
              </select>
            </div>

            {/* Status Filter Selector */}
            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-2xl px-4 py-3.5 text-sm text-slate-300 font-semibold focus:outline-none cursor-pointer appearance-none"
              >
                <option value="all">⚡ All Statuses</option>
                <option value="active">🟢 Active Accounts</option>
                <option value="frozen">🧊 Frozen / Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 MAIN 3-COLUMN COMMAND CENTER LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ⬅️ LEFT COLUMN: NAVIGATION & CONTROLS */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider px-3 mb-2">
              Command Modules
            </h4>

            <button
              onClick={() => setActiveTab("hierarchy")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "hierarchy"
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-md"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4" />
                <span>Portugal Network Tree</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                Main
              </span>
            </button>

            <button
              onClick={() => setActiveTab("rps")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "rps"
                  ? "bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-md"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4" />
                <span>Regional Partners ({networkRegions.length})</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full text-purple-300">
                {networkRegions.length} RDs
              </span>
            </button>

            <button
              onClick={() => setActiveTab("hubs")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "hubs"
                  ? "bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-md"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4" />
                <span>Territorial Hubs</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full text-blue-300">
                {networkRegions.reduce((sum, r) => sum + r.hubs.length, 0)} Hubs
              </span>
            </button>

            {/* Quick Action: Add Hub */}
            <button
              onClick={() => setIsAddHubModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Hub to Region</span>
            </button>

            <button
              onClick={() => setActiveTab("jobs")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "jobs"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-md"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                <span>Jobs & Allocations</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full text-emerald-300">
                {jobs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "chat"
                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-md"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4" />
                <span>AI Multi-Lingual Chat</span>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                AI Ready
              </span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-md"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4" />
                <span>Audit Logs & Events</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                {auditLogs.length}
              </span>
            </button>
          </div>

          {/* Quick Active System Banner */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 text-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Multi-Lingual AI Translator</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Direct administrative communications automatically translated across Portuguese, English, Spanish, Russian, Ukrainian, and German.
            </p>
          </div>
        </div>

        {/* ↔️ CENTER COLUMN: MAIN INTERACTIVE TREE / CONTENT LIST */}
        <div className={`space-y-4 ${selectedUser ? "lg:col-span-5" : "lg:col-span-9"}`}>
          
          {/* TAB 1: EXPANDABLE HIERARCHY TREE */}
          {activeTab === "hierarchy" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <span>Portugal National Territory Tree</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Expand RPs and Hubs to inspect allocated Territory Partners, Specialists, and Customers.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setExpandedNodes({
                      portugal: true,
                      rp_big_lisboa: true,
                      rp_lisboa_city: true,
                      rp_porto: true,
                      rp_algarve: true,
                    })
                  }
                  className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  Expand All
                </button>
              </div>

              {/* ROOT NODE: PORTUGAL */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                <div
                  onClick={() => toggleNode("portugal")}
                  className="p-4 flex items-center justify-between bg-slate-900/90 hover:bg-slate-800/80 cursor-pointer transition-colors border-b border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    {expandedNodes["portugal"] ? (
                      <ChevronDown className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    )}
                    <span className="text-xl">🇵🇹</span>
                    <div>
                      <h4 className="text-base font-black text-white tracking-tight">Portugal (National HQ)</h4>
                      <span className="text-xs text-slate-400 font-mono">4 Regional Networks • 6 Hubs • {users.length} Total Members</span>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-bold">
                    Active National
                  </span>
                </div>

                {/* LEVEL 1: REGIONAL PARTNERS (RP) */}
                {expandedNodes["portugal"] && (
                  <div className="p-4 space-y-4 pl-6 sm:pl-8 border-l-2 border-cyan-500/20 my-2">
                    {regionalPartners.map((rp) => {
                      const isExpandedRP = !!expandedNodes[rp.id];
                      const rpDirectorUser = users.find((u) => u.role === "regional_admin" && (u.region === rp.region || u.dashboardNumber === rp.code));

                      return (
                        <div key={rp.id} className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-900/40">
                          {/* RP Header */}
                          <div
                            onClick={() => toggleNode(rp.id)}
                            className="p-4 flex items-center justify-between hover:bg-slate-800/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {isExpandedRP ? (
                                <ChevronDown className="w-4 h-4 text-purple-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-500" />
                              )}
                              <Shield className="w-5 h-5 text-purple-400" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-sm font-bold text-white">{rp.name}</h5>
                                  <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                    {rp.code}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {rp.director} • <span className="font-mono text-slate-500">{rp.hubs.length} Hubs Allocated</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {rpDirectorUser ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUserId(rpDirectorUser.id);
                                  }}
                                  className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1 rounded-xl border border-purple-500/30 cursor-pointer font-bold transition-all"
                                >
                                  Manage RD
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAssignModalData({
                                      isOpen: true,
                                      type: 'RD',
                                      rpId: rp.id,
                                      targetEmail: ''
                                    });
                                  }}
                                  className="text-[11px] bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 px-2.5 py-1 rounded-xl border border-purple-500/30 cursor-pointer font-bold transition-all flex items-center gap-1"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Assign RD Email</span>
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRegionForHub(rp.id);
                                  setIsAddHubModalOpen(true);
                                }}
                                className="text-[11px] bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-xl border border-cyan-500/30 cursor-pointer font-bold transition-all flex items-center gap-1"
                                title="Add Hub to Region"
                              >
                                <PlusCircle className="w-3 h-3" />
                                <span>+ Hub</span>
                              </button>
                            </div>
                          </div>

                          {/* LEVEL 2: HUBS UNDER RP */}
                          {isExpandedRP && (
                            <div className="p-3 bg-slate-950/80 space-y-3 pl-6 border-t border-slate-800/80">
                              {rp.hubs.map((hub) => {
                                const isExpandedHub = !!expandedNodes[hub.id];
                                const hubOperators = users.filter(
                                  (u) => u.role === "operator" && (u.hubId === hub.id || u.city === hub.city || u.region === rp.region)
                                );

                                return (
                                  <div key={hub.id} className="border border-slate-800/60 rounded-xl overflow-hidden bg-slate-900/60">
                                    {/* Hub Header */}
                                    <div
                                      onClick={() => toggleNode(hub.id)}
                                      className="p-3 flex flex-wrap items-center justify-between gap-2 hover:bg-slate-800/50 cursor-pointer transition-colors"
                                    >
                                      <div className="flex items-center gap-2.5">
                                        {isExpandedHub ? (
                                          <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                                        ) : (
                                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                        )}
                                        <Building2 className="w-4 h-4 text-cyan-400" />
                                        <div>
                                          <h6 className="text-xs font-bold text-slate-200">{hub.name}</h6>
                                          <span className="text-[10px] text-slate-500 font-mono">
                                            {hub.code} • {hub.city} ({hub.territories ? hub.territories.join(", ") : hub.districts?.join(", ")})
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveHubDashboard({ rp, hub });
                                          }}
                                          className="text-[10px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-500/30 font-bold flex items-center gap-1 cursor-pointer"
                                        >
                                          <LayoutDashboard className="w-3 h-3" />
                                          <span>Hub Dashboard</span>
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setAssignModalData({
                                              isOpen: true,
                                              type: 'TP',
                                              rpId: rp.id,
                                              hubId: hub.id,
                                              seatNumber: hubOperators.length + 1,
                                              targetEmail: ''
                                            });
                                          }}
                                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 font-bold flex items-center gap-1 cursor-pointer"
                                        >
                                          <Mail className="w-3 h-3 text-cyan-400" />
                                          <span>Assign TP Email</span>
                                        </button>
                                        <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 text-cyan-300 px-2 py-0.5 rounded-full">
                                          {hub.tpsCount || 4} TP Seats
                                        </span>
                                      </div>
                                    </div>

                                    {/* LEVEL 3: OPERATORS / SPECIALISTS / CUSTOMERS IN HUB */}
                                    {isExpandedHub && (
                                      <div className="p-3 bg-slate-950 space-y-2 text-xs border-t border-slate-800/60">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                          Territory Partners & Participants in Hub
                                        </div>

                                        {/* List Operators / Specialists */}
                                        {users
                                          .filter((u) => u.region === rp.region || u.city === hub.city)
                                          .slice(0, 8)
                                          .map((member) => (
                                            <div
                                              key={member.id}
                                              onClick={() => setSelectedUserId(member.id)}
                                              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                                                selectedUserId === member.id
                                                  ? "bg-cyan-500/10 border-cyan-500/50 text-white"
                                                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300"
                                              }`}
                                            >
                                              <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-[10px] text-slate-300">
                                                  {member.name ? member.name.charAt(0) : "U"}
                                                </div>
                                                <div>
                                                  <div className="font-bold flex items-center gap-1.5">
                                                    <span>{member.name}</span>
                                                    {renderRoleBadge(member.role)}
                                                  </div>
                                                  <div className="text-[10px] text-slate-500 font-mono">
                                                    {member.email} • {member.city || hub.city}
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="flex items-center gap-2">
                                                {renderStatusBadge(member)}
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleManageAsUser(member);
                                                  }}
                                                  className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 cursor-pointer"
                                                  title="Manage as User"
                                                >
                                                  <Zap className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SEARCH RESULTS LIST */}
          {activeTab === "search" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-cyan-400" />
                  <span>Global Search Results ({globalSearchResults.length})</span>
                </h3>
                {globalSearchQuery && (
                  <span className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    Query: "{globalSearchQuery}"
                  </span>
                )}
              </div>

              {globalSearchResults.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Search className="w-10 h-10 mx-auto text-slate-600 opacity-50" />
                  <p className="text-sm">No matching participants found.</p>
                  <p className="text-xs text-slate-600">Try searching by Name, Email, Phone, Role, City, or ID.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {globalSearchResults.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUserId(u.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        selectedUserId === u.id
                          ? "bg-cyan-500/10 border-cyan-500/50 shadow-md"
                          : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-slate-200">
                          {u.name ? u.name.charAt(0) : "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-base">{u.name}</span>
                            {renderRoleBadge(u.role)}
                            {renderStatusBadge(u)}
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-1 space-x-2">
                            <span>📧 {u.email}</span>
                            <span>📞 {u.phone || "No phone"}</span>
                            <span>📍 {u.city || u.region || "Portugal"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUserId(u.id);
                            setInspectorTab("profile");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleManageAsUser(u);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-xs font-bold text-cyan-300 border border-cyan-500/30 cursor-pointer flex items-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Manage as user</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REGIONAL PARTNERS (RP) MODULE */}
          {activeTab === "rps" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span>Regional Partners Network ({networkRegions.length} RDs)</span>
                </h3>
                <button
                  onClick={() => setIsAddHubModalOpen(true)}
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Hub</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {networkRegions.map((rp) => {
                  const directorUser = users.find((u) => u.role === "regional_admin" && (u.region === rp.region || u.dashboardNumber === rp.code));

                  return (
                    <div key={rp.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-2xl">
                            <Shield className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white">{rp.name}</h4>
                            <p className="text-xs text-slate-400">{rp.director} • Code: {rp.code}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {directorUser ? (
                            <button
                              onClick={() => setSelectedUserId(directorUser.id)}
                              className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Manage RD ({directorUser.email})
                            </button>
                          ) : (
                            <button
                              onClick={() => setAssignModalData({
                                isOpen: true,
                                type: 'RD',
                                rpId: rp.id,
                                targetEmail: ''
                              })}
                              className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Assign RD Email</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedRegionForHub(rp.id);
                              setIsAddHubModalOpen(true);
                            }}
                            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ Hub</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 border-t border-slate-800/60 pt-3 flex flex-wrap items-center justify-between font-mono gap-2">
                        <span>Territories: {rp.hubs.flatMap(h => h.territories || []).slice(0, 5).join(", ")}...</span>
                        <span className="text-cyan-400 font-bold">{rp.hubs.length} Territorial Hubs</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: TERRITORIAL HUBS & TPS */}
          {activeTab === "hubs" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  <span>Territorial Hubs Directory ({networkRegions.reduce((sum, r) => sum + r.hubs.length, 0)} Hubs)</span>
                </h3>
                <button
                  onClick={() => setIsAddHubModalOpen(true)}
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Create Hub</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {networkRegions.flatMap((rp) => rp.hubs.map(hub => ({ rp, hub }))).map(({ rp, hub }) => (
                  <div key={hub.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white">{hub.name}</h5>
                        <p className="text-xs text-slate-400 font-mono">
                          {hub.code} • Region: {rp.region} • Base: {hub.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveHubDashboard({ rp, hub })}
                        className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Open Hub Dashboard</span>
                      </button>

                      <button
                        onClick={() => setAssignModalData({
                          isOpen: true,
                          type: 'TP',
                          rpId: rp.id,
                          hubId: hub.id,
                          seatNumber: 1,
                          targetEmail: ''
                        })}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Assign TP Seat</span>
                      </button>

                      <span className="text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-cyan-400">
                        {hub.tpsCount || 4} TP Seats
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: JOBS & ALLOCATIONS */}
          {activeTab === "jobs" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <span>Platform Jobs & Allocations ({jobs.length})</span>
              </h3>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{job.id}</span>
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">{job.category}</span>
                        <span className="text-emerald-400 font-mono font-bold">€{job.estimatedValue}</span>
                      </div>
                      <p className="text-slate-400 mt-1">
                        Customer: <strong className="text-slate-200">{job.customerName}</strong> ({job.city})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 font-mono">
                        Status: {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DIRECT ADMINISTRATIVE CHAT */}
          {activeTab === "chat" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <MessageCircle className="w-5 h-5 text-amber-400" />
                <span>Direct Administrative Communications</span>
              </h3>

              <p className="text-xs text-slate-400">
                Select any participant from the hierarchy or search results to open a direct, multi-lingual AI translated message thread.
              </p>

              {selectedUser ? (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300">
                  Active Thread with <strong className="text-white">{selectedUser.name}</strong> ({selectedUser.role})
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Click on any user in the hierarchy tree or search list to start communicating.
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SECURITY AUDIT LOGS */}
          {activeTab === "audit" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>Security Audit Trail & Events ({auditLogs.length})</span>
              </h3>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1 font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-cyan-400 font-bold">{log.action}</span>
                      <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300">{log.details}</p>
                    <div className="text-[10px] text-slate-500">Actor: {log.actorName} ({log.actorRole}) • Territory: {log.territory}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ➡️ RIGHT COLUMN: SELECTED PARTICIPANT MANAGEMENT INSPECTOR */}
        {selectedUser ? (
          <div className="lg:col-span-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6 sticky top-6">
              
              {/* INSPECTOR HEADER */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-cyan-500/50 flex items-center justify-center font-black text-white text-lg shadow-md">
                    {selectedUser.name ? selectedUser.name.charAt(0) : "U"}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white leading-tight">{selectedUser.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {renderRoleBadge(selectedUser.role)}
                      {renderStatusBadge(selectedUser)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUserId(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                  title="Close Inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* PRIMARY ACTION: MANAGE AS USER (IMPERSONATION) */}
              <button
                onClick={() => handleManageAsUser(selectedUser)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black py-3.5 px-4 rounded-2xl text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Manage as user ({selectedUser.name})</span>
              </button>

              {/* INSPECTOR TAB SELECTOR */}
              <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setInspectorTab("profile")}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    inspectorTab === "profile" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setInspectorTab("jobs")}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    inspectorTab === "jobs" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Jobs
                </button>
                <button
                  onClick={() => setInspectorTab("chat")}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    inspectorTab === "chat" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-slate-400 hover:text-white"
                  }`}
                >
                  AI Chat
                </button>
                <button
                  onClick={() => setInspectorTab("audit")}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    inspectorTab === "audit" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Audit
                </button>
              </div>

              {/* TAB 1: PROFILE DETAILS */}
              {inspectorTab === "profile" && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>User ID:</span>
                      <strong className="text-white font-mono">{selectedUser.id}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Email:</span>
                      <strong className="text-white font-mono">{selectedUser.email}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Phone:</span>
                      <strong className="text-white font-mono">{selectedUser.phone || "Not set"}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Territory Region:</span>
                      <strong className="text-cyan-400">{selectedUser.region || "Big Lisboa"}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>City / Hub:</span>
                      <strong className="text-slate-200">{selectedUser.city || "Cascais"}</strong>
                    </div>
                  </div>

                  {/* EDIT DATA ACTION BUTTON */}
                  <button
                    onClick={() => handleStartEditUser(selectedUser)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Profile Data</span>
                  </button>
                </div>
              )}

              {/* TAB 2: RELATED JOBS */}
              {inspectorTab === "jobs" && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-slate-300">Jobs associated with user</h4>
                  {jobs
                    .filter((j) => j.operatorId === selectedUser.id || j.unlockedBySpecialistId === selectedUser.id || j.customerPhone === selectedUser.phone)
                    .map((job) => (
                      <div key={job.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between font-mono font-bold">
                          <span className="text-cyan-400">{job.id}</span>
                          <span className="text-emerald-400">€{job.estimatedValue}</span>
                        </div>
                        <p className="text-slate-300">{job.category} - {job.city}</p>
                        <span className="text-[10px] text-slate-500 font-mono">Status: {job.status}</span>
                      </div>
                    ))}
                </div>
              )}

              {/* TAB 3: MULTI-LINGUAL AI CHAT THREAD */}
              {inspectorTab === "chat" && (
                <div className="space-y-3 text-xs">
                  {/* LANGUAGE TRANSLATOR SELECTOR BAR */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Languages className="w-4 h-4" />
                        <span>AI Translator</span>
                      </div>
                      <button
                        onClick={() => setAutoTranslateEnabled(!autoTranslateEnabled)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                          autoTranslateEnabled ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {autoTranslateEnabled ? "AI Translate ON" : "AI Translate OFF"}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Target Language:</span>
                      <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-white font-semibold rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                      >
                        <option value="pt">🇵🇹 Português</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="ru">🇷🇺 Русский</option>
                        <option value="uk">🇺🇦 Українська</option>
                        <option value="es">🇪🇸 Español</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="de">🇩🇪 Deutsch</option>
                      </select>
                    </div>
                  </div>

                  {/* MESSAGES THREAD LIST */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 h-48 overflow-y-auto space-y-2">
                    {(adminChats[selectedUser.id] || [
                      {
                        id: "default-1",
                        sender: "super_admin",
                        senderName: "Director NordBase /01",
                        content: `Direct administrative channel established with ${selectedUser.name}. Messages will be AI auto-translated to ${targetLanguage.toUpperCase()}.`,
                        timestamp: "Just now",
                        originalLanguage: "en"
                      }
                    ]).map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2.5 rounded-xl border space-y-1 ${
                          msg.sender === "super_admin"
                            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-200 ml-4"
                            : "bg-slate-900 border-slate-800 text-slate-200 mr-4"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                          <span>{msg.senderName}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="text-xs leading-relaxed">{msg.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* CHAT INPUT AREA */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessageText}
                      onChange={(e) => setChatMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendAdminMessage()}
                      placeholder={`Send admin message (${targetLanguage.toUpperCase()})...`}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                    <button
                      onClick={handleSendAdminMessage}
                      disabled={isTranslating}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: AUDIT HISTORY */}
              {inspectorTab === "audit" && (
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-slate-300">Audit Events for User</h4>
                  {auditLogs
                    .filter((a) => a.details.includes(selectedUser.id) || a.details.includes(selectedUser.name))
                    .map((log) => (
                      <div key={log.id} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono space-y-1">
                        <span className="text-cyan-400 font-bold block">{log.action}</span>
                        <p className="text-slate-300 text-[11px]">{log.details}</p>
                        <span className="text-[9px] text-slate-500 block">{log.timestamp}</span>
                      </div>
                    ))}
                </div>
              )}

              {/* FOOTER ACTIONS: FREEZE & DELETE */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
                {selectedUser.isBlocked ? (
                  <button
                    onClick={() => handleUnfreezeUser(selectedUser)}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Unfreeze</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setFreezeModalUser(selectedUser)}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Freeze</span>
                  </button>
                )}

                <button
                  onClick={() => setDeleteConfirmUser(selectedUser)}
                  className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="hidden lg:block lg:col-span-4 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 text-center text-slate-500 space-y-3 my-auto">
            <User className="w-12 h-12 mx-auto text-slate-600 opacity-40" />
            <h4 className="text-base font-bold text-slate-300">Participant Inspector Panel</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Select any Regional Partner, Territory Partner, Specialist, or Customer to inspect profile data, communicate via AI translator, or manage as user.
            </p>
          </div>
        )}

      </div>

      {/* 🧊 FREEZE CONFIRMATION MODAL */}
      {freezeModalUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-400">
              <Lock className="w-6 h-6" />
              <h3 className="text-lg font-black text-white">Freeze Account Confirmation</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to temporarily freeze <strong>{freezeModalUser.name}</strong> ({freezeModalUser.email})? They will be temporarily restricted from taking new jobs or editing dashboard settings.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Optional Reason for Freeze:</label>
              <input
                type="text"
                value={freezeReason}
                onChange={(e) => setFreezeReason(e.target.value)}
                placeholder="e.g. Identity audit required, suspicious lead activity..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setFreezeModalUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFreeze}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
              >
                Confirm Freeze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ DELETE CONFIRMATION MODAL */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-black text-white">Delete Account Confirmation</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>CRITICAL WARNING:</strong> You are about to deactivate/delete <strong>{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email}). This action is destructive and will generate a security audit log.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
              >
                Permanently Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ EDIT PROFILE DATA MODAL */}
      {isEditingUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-cyan-400" />
                <span>Edit Participant Data</span>
              </h3>
              <button onClick={() => setIsEditingUser(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editFormData.name || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={editFormData.email || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editFormData.phone || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Role</label>
                <select
                  value={editFormData.role || "specialist"}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="customer">Customer</option>
                  <option value="specialist">Specialist</option>
                  <option value="operator">Territory Partner (TP)</option>
                  <option value="regional_admin">Regional Director (RD)</option>
                  <option value="super_admin">SuperAdmin</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Territory Region</label>
                <input
                  type="text"
                  value={editFormData.region || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, region: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">City / Hub</label>
                <input
                  type="text"
                  value={editFormData.city || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsEditingUser(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUserEdit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ➕ ADD HUB TO REGION MODAL */}
      {isAddHubModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-cyan-400" />
                <span>Create New Territorial Hub</span>
              </h3>
              <button onClick={() => setIsAddHubModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Target Region (23 Regions)</label>
                <select
                  value={selectedRegionForHub}
                  onChange={(e) => setSelectedRegionForHub(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {networkRegions.map((rp) => (
                    <option key={rp.id} value={rp.id}>
                      {rp.name} ({rp.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Hub Name</label>
                <input
                  type="text"
                  value={newHubName}
                  onChange={(e) => setNewHubName(e.target.value)}
                  placeholder="e.g. Lagos & Sagres Barlavento Hub"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Base City / Center</label>
                  <input
                    type="text"
                    value={newHubCity}
                    onChange={(e) => setNewHubCity(e.target.value)}
                    placeholder="e.g. Lagos"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">TP Seats Allocation</label>
                  <input
                    type="number"
                    value={newHubTpsCount}
                    onChange={(e) => setNewHubTpsCount(Number(e.target.value))}
                    min={1}
                    max={12}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Territories Covered (comma separated)
                </label>
                <input
                  type="text"
                  value={newHubTerritories}
                  onChange={(e) => setNewHubTerritories(e.target.value)}
                  placeholder="e.g. Lagos, Vila do Bispo, Sagres, Aljezur"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsAddHubModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHubSubmit}
                disabled={!newHubName.trim() || !newHubCity.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white cursor-pointer"
              >
                Create Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📧 ASSIGN BY EMAIL MODAL (GOOGLE AUTH ALIGNMENT) */}
      {assignModalData.isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-400" />
                <span>Assign {assignModalData.type} Position by Email</span>
              </h3>
              <button
                onClick={() => setAssignModalData(prev => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Google Auth registrations match user logins directly by email address. Enter the Google account email for this {assignModalData.type === 'RD' ? 'Regional Director' : 'Territory Partner'} position.
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">User Email Address</label>
              <input
                type="email"
                value={assignModalData.targetEmail}
                onChange={(e) => setAssignModalData(prev => ({ ...prev, targetEmail: e.target.value }))}
                placeholder="e.g. director.algarve@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setAssignModalData(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEmailAssignment}
                disabled={!assignModalData.targetEmail.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white cursor-pointer"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📊 HUB DASHBOARD & METRICS MODAL */}
      {activeHubDashboard && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-2xl">
                  <LayoutDashboard className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{activeHubDashboard.hub.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Code: {activeHubDashboard.hub.code} • Region: {activeHubDashboard.rp.region} • Base: {activeHubDashboard.hub.city}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveHubDashboard(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* HUB METRICS DASHBOARD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Hub TP Seats</span>
                <span className="text-lg font-black text-cyan-400 font-mono">{activeHubDashboard.hub.tpsCount || 4} Allocated</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Jobs</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {jobs.filter(j => j.city === activeHubDashboard.hub.city).length} Jobs
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Specialists</span>
                <span className="text-lg font-black text-purple-400 font-mono">
                  {specialists.filter(s => s.city === activeHubDashboard.hub.city || s.region === activeHubDashboard.rp.region).length} Registered
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Territories</span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  {activeHubDashboard.hub.territories?.length || activeHubDashboard.hub.districts?.length || 1} Covered
                </span>
              </div>
            </div>

            {/* TERRITORIES LIST */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Covered Territories & Districts</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {(activeHubDashboard.hub.territories || activeHubDashboard.hub.districts || [activeHubDashboard.hub.city]).map((t, idx) => (
                  <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-200 px-3 py-1 rounded-xl font-medium">
                    📍 {t}
                  </span>
                ))}
              </div>
            </div>

            {/* HUB JOBS PREVIEW */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Jobs in Hub</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {jobs.filter(j => j.city === activeHubDashboard.hub.city || j.region === activeHubDashboard.rp.region).length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No active jobs currently in this hub.</p>
                ) : (
                  jobs.filter(j => j.city === activeHubDashboard.hub.city || j.region === activeHubDashboard.rp.region).map(job => (
                    <div key={job.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-cyan-400 font-bold">{job.id}</span> • {job.category} ({job.customerName})
                      </div>
                      <span className="text-emerald-400 font-bold">€{job.estimatedValue}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveHubDashboard(null)}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
              >
                Close Hub Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
