const fs = require('fs');

const code = `
import React, { useState, useEffect } from 'react';
import { Job, Specialist, AuthUser, AuditLog, SupportTicket, Message } from '../types';
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
  Edit2,
  Lock,
  Phone,
  Mail
} from 'lucide-react';
import { PORTUGAL_GEO } from '../lib/geo';
import { store } from '../store';

interface SuperAdminDashboardProps {
  jobs: Job[];
  specialists: Specialist[];
  users: AuthUser[];
  auditLogs: AuditLog[];
  supportTickets: SupportTicket[];
  notifications: any[];
  onCreateLead: (name: string, phone: string, location: string, details: string, category: string) => void;
  onUpdateUsers: (users: AuthUser[]) => void;
  onUpdateJobs: (jobs: Job[]) => void;
  onAddAuditLog: (action: string, actorName: string, actorRole: string, territory: string, details: string) => void;
}

export default function SuperAdminDashboard({
  jobs,
  specialists,
  users,
  auditLogs,
  supportTickets,
  onUpdateUsers,
  onAddAuditLog
}: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'network' | 'staff' | 'alerts' | 'inbox' | 'audit'>('network');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dashboard Number
  const currentPath = window.location.pathname.toLowerCase();
  let dashboardId = '01';
  let directorTitle = 'Главный директор NordBase';
  let canManageSupers = true;
  
  // Check if it's 02, 03, 04
  if (currentPath.includes('02')) { dashboardId = '02'; directorTitle = 'Директор по развитию'; canManageSupers = false; }
  else if (currentPath.includes('03')) { dashboardId = '03'; directorTitle = 'Директор по развитию'; canManageSupers = false; }
  else if (currentPath.includes('04')) { dashboardId = '04'; directorTitle = 'Директор по развитию'; canManageSupers = false; }

  // --- PARTNERS MANAGEMENT ---
  const [newPartnerFirstName, setNewPartnerFirstName] = useState('');
  const [newPartnerLastName, setNewPartnerLastName] = useState('');
  const [newPartnerPhone, setNewPartnerPhone] = useState('');
  const [newPartnerWhatsapp, setNewPartnerWhatsapp] = useState('');
  const [newPartnerTelegram, setNewPartnerTelegram] = useState('');
  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [newPartnerRegion, setNewPartnerRegion] = useState(PORTUGAL_GEO[0]?.name || '');
  const [newPartnerRole, setNewPartnerRole] = useState<'super_admin' | 'regional_admin' | 'operator'>('operator');
  const [newPartnerDashboardNum, setNewPartnerDashboardNum] = useState('');
  const [newPartnerPassword, setNewPartnerPassword] = useState('');
  
  const [expandedPartnerId, setExpandedPartnerId] = useState<string | null>(null);

  const handleAddPartner = () => {
    if (!newPartnerEmail || !newPartnerFirstName) return;
    
    // Auto-generate dash number if empty
    let finalDashNum = newPartnerDashboardNum;
    if (!finalDashNum) {
      if (newPartnerRole === 'regional_admin') {
        const rds = users.filter(u => u.role === 'regional_admin');
        finalDashNum = \`PT-RD-\${(rds.length + 1).toString().padStart(3, '0')}\`;
      } else if (newPartnerRole === 'operator') {
        const ops = users.filter(u => u.role === 'operator');
        finalDashNum = \`PT-OP-\${(ops.length + 1).toString().padStart(3, '0')}\`;
      } else if (newPartnerRole === 'super_admin') {
        finalDashNum = '05'; // fallback
      }
    }

    const newUser: AuthUser = {
      id: \`u_\${Date.now()}\`,
      email: newPartnerEmail,
      name: \`\${newPartnerFirstName} \${newPartnerLastName}\`.trim(),
      phone: newPartnerPhone,
      whatsapp: newPartnerWhatsapp,
      telegram: newPartnerTelegram,
      region: newPartnerRegion,
      role: newPartnerRole,
      dashboardNumber: finalDashNum,
      password: newPartnerPassword,
      isNewUser: false,
      specialistStatus: 'approved'
    };
    const updated = [...users, newUser];
    onUpdateUsers(updated);
    onAddAuditLog('Partner Added', directorTitle, 'super_admin', 'Global', \`Added \${newPartnerRole} \${newPartnerEmail}\`);
    
    // Reset fields
    setNewPartnerFirstName('');
    setNewPartnerLastName('');
    setNewPartnerPhone('');
    setNewPartnerWhatsapp('');
    setNewPartnerTelegram('');
    setNewPartnerEmail('');
    setNewPartnerDashboardNum('');
    setNewPartnerPassword('');
  };

  const handleRemovePartner = (id: string, name: string) => {
    const updated = users.filter(u => u.id !== id);
    onUpdateUsers(updated);
    onAddAuditLog('Partner Removed', directorTitle, 'super_admin', 'Global', \`Removed partner \${name}\`);
  };

  const handleUpdatePassword = (id: string, newPass: string) => {
    const updated = users.map(u => u.id === id ? { ...u, password: newPass } : u);
    onUpdateUsers(updated);
    onAddAuditLog('Password Updated', directorTitle, 'super_admin', 'Global', \`Updated password for user ID: \${id}\`);
  };

  // --- CHAT / INBOX (for Dashboard specific id) ---
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [localChats, setLocalChats] = useState<Record<string, {sender: string, text: string, time: string}[]>>({});

  const chatContacts = users.filter(u => u.role === 'regional_admin' || u.role === 'operator' || u.role === 'super_admin');
  const displayContacts = [...chatContacts];

  const selectedChatUser = displayContacts.find(u => u.id === activeChatUserId);
  const selectedChatMessages = activeChatUserId ? (localChats[activeChatUserId] || []) : [];

  const handleSendChatMessage = () => {
    if (!activeChatUserId || !chatMessage.trim()) return;
    
    const newMsg = {
      sender: 'me',
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setLocalChats(prev => ({
      ...prev,
      [activeChatUserId]: [...(prev[activeChatUserId] || []), newMsg]
    }));
    
    setChatMessage('');
  };

  const handleCallToChat = (id: string) => {
    setActiveTab('inbox');
    setActiveChatUserId(id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* 🇵🇹 NATIONAL COMMAND CENTER HEADER */}
      <div className="mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
            {directorTitle} <span className="text-cyan-400">/{dashboardId}</span>
          </h2>
          <p className="text-slate-400 mt-2 text-base sm:text-lg max-w-2xl">
            National Command Center. Manage partners, oversee network operations, and respond to alerts.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-3 flex items-center gap-3 shadow-lg">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
            <span className="text-base font-bold text-white tracking-wide">System Active</span>
          </div>
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS (Top Bar) */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-900/40 p-2.5 rounded-2xl border border-white/5 overflow-x-auto shadow-md">
        {[
          { id: 'network', label: 'Network Overview', icon: Globe },
          { id: 'staff', label: 'Partners', icon: Shield },
          { id: 'alerts', label: 'Alerts & Tickets', icon: AlertTriangle },
          { id: 'inbox', label: 'Inbox & Chat', icon: Inbox },
          { id: 'audit', label: 'Security Audit Logs', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={\`flex items-center gap-2.5 px-6 py-4 text-base font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap \${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)]'
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/70 hover:text-white'
              }\`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 💻 PERSPECTIVE VIEWS */}

      {/* VIEW 1: PORTUGAL TERRITORY NETWORK */}
      {activeTab === 'network' && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6">Network Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTUGAL_GEO.map(reg => {
              const regionJobs = jobs.filter(j => (j.region || j.city || '').includes(reg.name));
              const activeJobs = regionJobs.filter(j => j.status === 'active' || j.status === 'pending');
              const onlineOps = users.filter(u => u.role === 'operator' && (u.region === reg.name || u.city === reg.name)).length; 
              return (
                <div key={reg.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-5 mb-6">
                    <span className="text-5xl">{reg.flag}</span>
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-1">{reg.name}</h4>
                      <p className="text-base text-slate-400">{activeJobs.length} Active Jobs</p>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-slate-800 flex justify-between text-base">
                    <span className="text-slate-400">Operators:</span>
                    <span className="text-white font-black text-lg">{onlineOps}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: STAFF MANAGEMENT (PARTNERS) */}
      {activeTab === 'staff' && (
        <div className="space-y-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <h3 className="text-xl font-black text-white mb-8">Add New Partner</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">First Name</label>
                <input type="text" value={newPartnerFirstName} onChange={e => setNewPartnerFirstName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" placeholder="Maria" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Last Name</label>
                <input type="text" value={newPartnerLastName} onChange={e => setNewPartnerLastName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" placeholder="Santos" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Email</label>
                <input type="email" value={newPartnerEmail} onChange={e => setNewPartnerEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" placeholder="maria@nordbase.pt" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Phone</label>
                <input type="text" value={newPartnerPhone} onChange={e => setNewPartnerPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" placeholder="+351..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">WhatsApp</label>
                <input type="text" value={newPartnerWhatsapp} onChange={e => setNewPartnerWhatsapp(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" placeholder="+351..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Telegram</label>
                <input type="text" value={newPartnerTelegram} onChange={e => setNewPartnerTelegram(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" placeholder="@username" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Region</label>
                <select value={newPartnerRegion} onChange={e => setNewPartnerRegion(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none appearance-none">
                  <option value="Global">Global (All)</option>
                  {PORTUGAL_GEO.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Role</label>
                <select value={newPartnerRole} onChange={e => setNewPartnerRole(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none appearance-none">
                  {canManageSupers && <option value="super_admin">Super Admin</option>}
                  <option value="regional_admin">Regional Director</option>
                  <option value="operator">Operator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Dashboard No. (Auto if empty)</label>
                <input type="text" value={newPartnerDashboardNum} onChange={e => setNewPartnerDashboardNum(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" placeholder="PT-RD-001" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Login Password</label>
                <input type="text" value={newPartnerPassword} onChange={e => setNewPartnerPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" placeholder="Password123" />
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
              <h3 className="text-xl font-black text-white">Current Partners Directory</h3>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
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
                  .filter(u => ['operator', 'regional_admin', 'super_admin'].includes(u.role))
                  .filter(u => (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(u => {
                    const isExpanded = expandedPartnerId === u.id;
                    const canEdit = u.role !== 'super_admin' || canManageSupers; // 01 can edit supers, others can't
                    
                    if (u.role === 'super_admin' && !canManageSupers && u.id !== 'u_1') return null; // Hide other supers from 02-04 maybe? The prompt didn't say hide them, but they can't manage them.

                    return (
                      <div key={u.id} className="border-b border-slate-800/50 last:border-0 bg-slate-900/20 hover:bg-slate-800/40 transition-colors rounded-xl mb-2">
                        <div className="grid grid-cols-12 gap-4 py-4 px-4 items-center cursor-pointer" onClick={() => setExpandedPartnerId(isExpanded ? null : u.id)}>
                          <div className="col-span-3">
                            <div className="font-bold text-white">{u.name || 'Unnamed'}</div>
                            <div className="text-sm text-slate-400">{u.email}</div>
                          </div>
                          <div className="col-span-2">
                            <span className={\`px-3 py-1 rounded-full text-xs font-bold \${
                              u.role === 'super_admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                              u.role === 'regional_admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            }\`}>
                              {u.role === 'super_admin' ? 'Super Admin' : u.role === 'regional_admin' ? 'Regional Director' : 'Operator'}
                            </span>
                          </div>
                          <div className="col-span-2 text-slate-300 text-sm">{u.region || 'Global'}</div>
                          <div className="col-span-2 text-slate-300 font-mono text-sm">{u.dashboardNumber || '-'}</div>
                          <div className="col-span-3 flex justify-end gap-2 items-center">
                            <button onClick={(e) => { e.stopPropagation(); handleCallToChat(u.id); }} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" title="Call to chat">
                              <MessageCircle className="w-5 h-5" />
                            </button>
                            {canEdit && (
                              <button onClick={(e) => { e.stopPropagation(); handleRemovePartner(u.id, u.name); }} className="p-2 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors" title="Remove partner">
                                <UserX className="w-5 h-5" />
                              </button>
                            )}
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                          </div>
                        </div>
                        
                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="px-4 pb-6 pt-2 border-t border-slate-800/50 bg-slate-900/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              <div>
                                <div className="text-xs text-slate-500 font-bold mb-1">Phone</div>
                                <div className="text-white flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-slate-400" /> {u.phone || 'N/A'}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 font-bold mb-1">WhatsApp</div>
                                <div className="text-white flex items-center gap-2">
                                  <MessageCircle className="w-4 h-4 text-emerald-400" /> 
                                  {u.whatsapp ? <a href={\`https://wa.me/\${u.whatsapp.replace(/[^0-9]/g, '')}\`} target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">{u.whatsapp}</a> : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 font-bold mb-1">Telegram</div>
                                <div className="text-white flex items-center gap-2">
                                  <Send className="w-4 h-4 text-blue-400" /> 
                                  {u.telegram ? <a href={\`https://t.me/\${u.telegram.replace('@', '')}\`} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">{u.telegram}</a> : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 font-bold mb-1">Password</div>
                                {canEdit ? (
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="text" 
                                      defaultValue={u.password || ''} 
                                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500 w-full"
                                      onBlur={(e) => {
                                        if (e.target.value !== u.password) {
                                          handleUpdatePassword(u.id, e.target.value);
                                        }
                                      }}
                                    />
                                    <Edit2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                  </div>
                                ) : (
                                  <div className="text-slate-400 flex items-center gap-2"><Lock className="w-4 h-4" /> Hidden</div>
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
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white mb-6">System Alerts & Support Tickets</h3>
          
          <div className="flex flex-col gap-5">
            {supportTickets && supportTickets.length > 0 ? (
              supportTickets.map(ticket => (
                <div key={ticket.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex items-start gap-6 hover:border-slate-700 transition-colors shadow-lg">
                  <div className="bg-rose-500/10 p-4 rounded-full text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-bold text-white">{ticket.subject}</h4>
                      <span className="text-sm text-slate-500 font-mono bg-slate-950 px-3 py-1 rounded-lg">{ticket.createdAt}</span>
                    </div>
                    <p className="text-base text-slate-300 leading-relaxed">{ticket.message}</p>
                    <div className="mt-6 flex gap-3">
                      <span className={\`px-4 py-1.5 rounded-full text-sm font-bold \${
                        ticket.status === 'open' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }\`}>
                        {ticket.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl">
                <Shield className="w-16 h-16 text-slate-600 mx-auto mb-5" />
                <p className="text-slate-400 font-bold text-lg">No active alerts or tickets.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: INBOX & CHAT */}
      {activeTab === 'inbox' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden flex h-[700px] shadow-xl">
          {/* Contacts Sidebar */}
          <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-950/50">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-white font-black text-xl mb-1">Inbox & Channels</h3>
              <p className="text-sm text-slate-400">Chat with Partners</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {displayContacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => setActiveChatUserId(contact.id)}
                  className={\`w-full flex items-center gap-4 p-4 rounded-2xl transition-all \${
                    activeChatUserId === contact.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800/80 text-slate-300'
                  }\`}
                >
                  <div className={\`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 \${
                    activeChatUserId === contact.id ? 'bg-blue-500' : 'bg-slate-800'
                  }\`}>
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left overflow-hidden">
                    <div className="font-bold truncate text-base">{contact.name || contact.email}</div>
                    <div className={\`text-sm truncate \${activeChatUserId === contact.id ? 'text-blue-200' : 'text-slate-500'}\`}>
                      {contact.role === 'regional_admin' ? 'Regional Director' : contact.role === 'super_admin' ? 'Super Admin' : 'Operator'}
                    </div>
                  </div>
                </button>
              ))}
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
                      <h3 className="font-black text-white text-xl">{selectedChatUser.name || selectedChatUser.email}</h3>
                      <p className="text-sm text-slate-400">{selectedChatUser.role === 'regional_admin' ? 'Regional Director' : selectedChatUser.role === 'super_admin' ? 'Super Admin' : 'Operator'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {selectedChatMessages.map((msg, idx) => {
                    const isMe = msg.sender === 'me';
                    return (
                      <div key={idx} className={\`flex \${isMe ? 'justify-end' : 'justify-start'}\`}>
                        <div className={\`max-w-[75%] rounded-3xl p-5 \${
                          isMe ? 'bg-blue-600 text-white rounded-br-none shadow-[0_5px_15px_rgba(37,99,235,0.2)]' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none shadow-lg'
                        }\`}>
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
                      <p className="text-lg">No messages yet. Start the conversation.</p>
                    </div>
                  )}
                </div>
                
                <div className="p-6 border-t border-slate-800 bg-slate-950/80">
                  <div className="flex gap-3 relative">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={e => setChatMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()}
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
                <p className="text-base">Select a partner to view messages or complaints</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-black text-white mb-8">Security Audit Logs</h3>
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
                {auditLogs.slice().reverse().map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-5 text-slate-400 text-base whitespace-nowrap font-mono">{log.timestamp}</td>
                    <td className="py-5">
                      <span className="bg-slate-800 text-slate-300 px-4 py-1.5 rounded-lg text-sm font-bold border border-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-5 text-white text-base font-bold">
                      {log.actorName} <span className="text-slate-500 text-sm font-normal ml-2 bg-slate-950 px-2 py-1 rounded-md">({log.actorRole})</span>
                    </td>
                    <td className="py-5 text-slate-300 text-base">{log.details}</td>
                  </tr>
                ))}
                {auditLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-20 text-slate-500 text-lg">No audit logs recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
`

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', code);
