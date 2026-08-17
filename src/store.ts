/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { AppState, Job, ServiceCategory, Specialist, UserRole, Message, JobStatus, AuthUser, SpecialistStatus, JobTimelineEvent, SupportTicket, WorkspacePost, AppNotification, AuditLog, SuggestionComplaint, SpecialtyWithLevel } from './types';
import { INITIAL_JOBS, INITIAL_SPECIALISTS } from './data';
const STORAGE_KEY = 'nordbase_work_state_v2';
export const INITIAL_WORKSPACE_POSTS: WorkspacePost[] = [];
export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [];
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
export const INITIAL_HUBS: import('./types').TerritorialHub[] = [];
export const INITIAL_USERS: AuthUser[] = [
  {
    id: 'user-super-01',
    email: 'ironstorm174@gmail.com',
    phone: '+351 901 000 000',
    name: 'Oleg (Territorial Partner)',
    role: 'super_admin',
    specialistStatus: 'not_requested',
    dashboardNumber: '01',
    photoUrl: '/portimao_tp.jpg',
    city: 'Portimão',
    region: 'Algarve'
  },
  {
    id: 'user-rp-dana',
    email: 'astrologforme@gmail.com',
    phone: '+351 912 000 001',
    name: 'Dana (Regional Director)',
    role: 'regional_admin',
    specialistStatus: 'not_requested',
    dashboardNumber: 'RD-01',
    city: 'Faro',
    region: 'Portugal'
  }
];
export function isMockAccount(u: any): boolean {
  if (!u) return true;
  if (
    u.id === 'user-super-01' || u.id === 'user-super_admin' ||
    u.id === 'user-rp-dana' ||
    u.role === 'regional_admin' || u.role === 'super_admin'
  ) return false;
  const email = String(u.email || '').toLowerCase();
  const name = String(u.name || '');
  if (
    email.endsWith('@example.com') || email.endsWith('@example.fr') ||
    email.includes('simulation') || email.startsWith('chat.client')
  ) return true;
  if (
    name.includes('(Cascais S1)') || name.includes('(Cascais S2)') ||
    name.includes('(Cascais Cover)') || name.includes('(Cascais Relief)') ||
    name.includes('[Simulation]') || name.includes('[Test]')
  ) return true;
  return false;
}

export function sanitizeState(state: AppState): AppState {
  if (!state) return { ...DEFAULT_STATE };

  // Filter users
  let cleanUsers = (state.users || []).filter(u => !isMockAccount(u));
  if (cleanUsers.length === 0) {
    cleanUsers = [...INITIAL_USERS];
  }

  // Filter specialists
  const cleanSpecialists = (state.specialists || []).filter(s => !isMockAccount(s));

  // Filter jobs
  const cleanJobs = (state.jobs || []).filter(j => {
    if (!j) return false;
    const title = String(j.title || '');
    if (title.includes('[Simulation]') || title.includes('[Test]')) return false;
    if (j.customerId && isMockAccount({ id: j.customerId })) return false;
    if (j.assignedSpecialistId && isMockAccount({ id: j.assignedSpecialistId })) return false;
    return true;
  }).map(j => ({
    ...j,
    messages: (j.messages || []).filter(m => !isMockAccount({ id: m.senderId }))
  }));

  // Clean hubs
  const cleanHubs = (state.hubs || []).filter(h => 
    !['HUB-LIS-001', 'HUB-LIS-002', 'HUB-LISC-001', 'HUB-OPO-001', 'HUB-FAO-001', 'HUB-FAO-002', 'HUB-FAO-003'].includes(h.id)
  );

  // Ensure current user is valid
  let cleanCurrentUser = state.currentUser;
  if (cleanCurrentUser && isMockAccount(cleanCurrentUser)) {
    cleanCurrentUser = null;
  }

  return {
    ...state,
    users: cleanUsers,
    specialists: cleanSpecialists,
    jobs: cleanJobs,
    hubs: cleanHubs,
    currentUser: cleanCurrentUser,
    currentRole: cleanCurrentUser ? cleanCurrentUser.role : 'customer',
    supportTickets: (state.supportTickets || []).filter(t => !isMockAccount({ id: t.userId })),
    workspacePosts: (state.workspacePosts || []).filter(p => !isMockAccount({ name: p.authorName })),
    notifications: (state.notifications || []).filter(n => !isMockAccount({ id: n.userId })),
    auditLogs: (state.auditLogs || []).filter(a => !isMockAccount({ name: a.actorName }))
  };
}

const DEFAULT_STATE: AppState = {
  jobs: INITIAL_JOBS,
  specialists: INITIAL_SPECIALISTS,
  currentRole: 'customer',
  selectedCity: null,
  selectedCategory: null,
  activeSpecialistId: '',
  activeOperatorId: '',
  currentUser: null,
  users: INITIAL_USERS,
  inviteList: [],
  currentPath: '/app',
  supportTickets: INITIAL_SUPPORT_TICKETS,
  workspacePosts: INITIAL_WORKSPACE_POSTS,
  notifications: INITIAL_NOTIFICATIONS,
  auditLogs: INITIAL_AUDIT_LOGS,
  suggestions: [],
  hubs: INITIAL_HUBS,
};
type StoreListener = (state: AppState) => void;
class AppStore {
  private state: AppState;
  private listeners: Set<StoreListener> = new Set();
  constructor() {
    this.state = this.loadState();
    // Ensure session token exists if logged in from saved state
    if (this.state.currentUser && !this.state.currentUser.token) {
      this.authenticate(
        this.state.currentUser.email || '',
        this.state.currentUser.phone || '',
        this.state.currentUser.name || '',
        this.state.currentUser.role,
        this.state.currentUser.password,
        this.state.currentUser.dashboardNumber
      ).catch(e => console.warn('Auto token refresh on init:', e));
    }
    // Background sync from Express + Neon database server
    this.syncFromServer();
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.state.currentUser?.token;
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  }

  private loadState(): AppState {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const rawState = {
            ...DEFAULT_STATE,
            ...parsed,
          };
          if (rawState.users) {
            rawState.users = rawState.users.map((u: AuthUser) => {
              let name = u.name;
              if (name && name.includes('National Partner')) {
                name = name.replace('National Partner', 'Territorial Partner');
              }
              const photoUrl = u.photoUrl || u.avatar || (u.id === 'user-super-01' || u.name?.includes('Oleg') ? '/portimao_tp.jpg' : '');
              return { ...u, name, photoUrl, avatar: photoUrl };
            });
          }
          if (rawState.currentUser) {
            let name = rawState.currentUser.name;
            if (name && name.includes('National Partner')) {
              name = name.replace('National Partner', 'Territorial Partner');
            }
            const photoUrl = rawState.currentUser.photoUrl || rawState.currentUser.avatar || (rawState.currentUser.id === 'user-super-01' || rawState.currentUser.name?.includes('Oleg') ? '/portimao_tp.jpg' : '');
            rawState.currentUser = { ...rawState.currentUser, name, photoUrl, avatar: photoUrl };
            if (rawState.currentUser.role) {
              rawState.currentRole = rawState.currentUser.role;
            }
          }
          if (!rawState.hubs || rawState.hubs.length === 0) { rawState.hubs = INITIAL_HUBS; }
          return sanitizeState(rawState);
        }
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
    return sanitizeState({ ...DEFAULT_STATE });
  }
  public async clearMockAccountsAndData() {
    this.state = sanitizeState(this.state);
    this.saveState();
    this.notify();
    try {
      await fetch('/api/admin/clean-mock-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() }
      });
      await this.syncFromServer();
    } catch (e) {
      console.error('Error clearing mock data:', e);
    }
  }
  public saveState() {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
    this.notify();
  }
  // Neon PostgreSQL Realtime Synchronization Helper
  public async syncFromServer() {
    try {
      const res = await fetch('/api/data', {
        headers: { ...this.getAuthHeaders() }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.jobs)) {
          this.state.jobs = data.jobs.filter((j: any) => {
            if (!j) return false;
            const title = String(j.title || '');
            if (title.includes('[Simulation]') || title.includes('[Test]')) return false;
            if (j.customerId && isMockAccount({ id: j.customerId })) return false;
            if (j.assignedSpecialistId && isMockAccount({ id: j.assignedSpecialistId })) return false;
            return true;
          });
        }
        if (data && Array.isArray(data.specialists)) {
          const cleanServerSpecs = data.specialists.filter((s: any) => !isMockAccount(s));
          const serverSpecIds = new Set(cleanServerSpecs.map((s: any) => s.id));
          const localOnlySpecs = (this.state.specialists || []).filter(s => !serverSpecIds.has(s.id) && !isMockAccount(s));
          this.state.specialists = [...cleanServerSpecs, ...localOnlySpecs];

          // Set activeSpecialistId if currentUser matches a specialist
          if (this.state.currentUser && this.state.currentUser.role === 'specialist') {
            const spec = this.state.specialists.find((s: any) => s.phone === this.state.currentUser?.phone || s.id === this.state.currentUser?.id);
            if (spec) {
              this.state.activeSpecialistId = spec.id;
            }
          }
        }
        if (data && Array.isArray(data.users)) {
          // Merge server users without overwriting locally uploaded photos if server photo_url is missing
          const cleanServerUsers = data.users.filter((serverU: any) => !isMockAccount(serverU));
          const serverUserIds = new Set(cleanServerUsers.map((u: any) => u.id));
          const localOnlyUsers = (this.state.users || []).filter(u => !serverUserIds.has(u.id) && !isMockAccount(u));

          const updatedServerUsers = cleanServerUsers.map((serverU: any) => {
            const localU = this.state.users.find(u => u.id === serverU.id);
            const photoUrl = serverU.photoUrl || serverU.avatar || localU?.photoUrl || localU?.avatar || (serverU.id === 'user-super-01' || serverU.name?.includes('Oleg') ? '/portimao_tp.jpg' : '');
            return {
              ...localU,
              ...serverU,
              photoUrl,
              avatar: photoUrl
            };
          });

          const updatedUsers = [...updatedServerUsers, ...localOnlyUsers];
          this.state.users = updatedUsers.length > 0 ? updatedUsers : [...INITIAL_USERS];
          // Sync current logged-in user state if active
          if (this.state.currentUser) {
            const freshUser = updatedUsers.find((u: any) => u.id === this.state.currentUser?.id);
            if (freshUser) {
              const currentPhoto = freshUser.photoUrl || freshUser.avatar || this.state.currentUser.photoUrl || this.state.currentUser.avatar || (freshUser.id === 'user-super-01' || freshUser.name?.includes('Oleg') ? '/portimao_tp.jpg' : '');
              this.state.currentUser = {
                ...this.state.currentUser,
                ...freshUser,
                photoUrl: currentPhoto,
                avatar: currentPhoto
              };
              this.state.currentRole = freshUser.role;
            }
          }
        }
        if (data && Array.isArray(data.partnerApplications)) {
          this.state.partnerApplications = data.partnerApplications;
        }
        this.state = sanitizeState(this.state);
        this.saveState();
      }
    } catch (e) {
      console.error('Failed to sync state from Neon backend API:', e);
    }
  }
  public getState(): AppState {
    return this.state;
  }
  // --- ENTERPRISE COMMUNICATIONS ACTIONS ---
  // 1. Workspace Post Actions
  public addWorkspacePost(module: WorkspacePost['module'], title: string, content: string, authorName: string, authorRole: string) {
    if (!this.state.workspacePosts) this.state.workspacePosts = [];
    const newPost: WorkspacePost = {
      id: `post-${Date.now()}`,
      module,
      title,
      content,
      authorName,
      authorRole,
      createdAt: new Date().toISOString(),
      likes: 0,
      commentsCount: 0
    };
    this.state.workspacePosts = [newPost, ...this.state.workspacePosts];
    this.addAuditLog('Workspace Post Created', authorName, authorRole, 'Portugal / Algarve', `Created post "${title}" in ${module}`);
    this.saveState();
  }
  public likeWorkspacePost(postId: string) {
    if (!this.state.workspacePosts) return;
    this.state.workspacePosts = this.state.workspacePosts.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });
    this.saveState();
  }
  // 2. Support Ticket Actions
  public addSupportTicket(category: SupportTicket['category'], title: string, description: string, userRole: 'specialist' | 'operator', userId: string, userName: string) {
    if (!this.state.supportTickets) this.state.supportTickets = [];
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      category,
      title,
      description,
      status: 'open',
      priority: 'medium',
      userRole,
      userId,
      userName,
      assignedAdminId: null,
      assignedAdminName: null,
      createdAt: new Date().toISOString(),
      history: [
        {
          id: `h-${Date.now()}`,
          status: 'open',
          changedBy: userName,
          timestamp: new Date().toISOString(),
          notes: 'Ticket opened.'
        }
      ],
      attachments: [],
      internalNotes: '',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: userRole,
          senderName: userName,
          content: description,
          timestamp: new Date().toISOString()
        }
      ]
    };
    this.state.supportTickets = [newTicket, ...this.state.supportTickets];
    
    // Log action
    this.addAuditLog('Support Ticket Opened', userName, userRole, 'Portugal / Algarve', `Opened Ticket #${newTicket.id} in category ${category}`);
    
    // Notify regional_admin
    this.addNotification('support_reply', `New Support Ticket: ${title}`, `A new ticket has been submitted by ${userName} under ${category}`, 'user-regional_admin');
    this.saveState();
    return newTicket;
  }
  public replySupportTicket(ticketId: string, content: string, sender: 'customer' | 'operator' | 'specialist' | 'regional_admin', senderName: string) {
    if (!this.state.supportTickets) return;
    this.state.supportTickets = this.state.supportTickets.map(t => {
      if (t.id === ticketId) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender,
          senderName,
          content,
          timestamp: new Date().toISOString()
        };
        
        // Notify the ticket creator if it's regional_admin replying, or vice-versa
        if (sender === 'regional_admin') {
          this.addNotification('support_reply', 'Support Ticket Reply', `Support regional_admin replied to ticket #${ticketId}: "${content.substring(0, 30)}..."`, t.userId);
        } else {
          this.addNotification('support_reply', 'User Reply on Ticket', `${senderName} replied to ticket #${ticketId}: "${content.substring(0, 30)}..."`, t.assignedAdminId || 'user-regional_admin');
        }
        return {
          ...t,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });
    this.saveState();
  }
  public updateTicketStatus(ticketId: string, status: SupportTicket['status'], priority: SupportTicket['priority'], internalNotes: string, regional_adminId: string, regional_adminName: string) {
    if (!this.state.supportTickets) return;
    this.state.supportTickets = this.state.supportTickets.map(t => {
      if (t.id === ticketId) {
        const oldStatus = t.status;
        const historyEvent = {
          id: `h-${Date.now()}`,
          status,
          changedBy: regional_adminName,
          timestamp: new Date().toISOString(),
          notes: `Status changed from ${oldStatus} to ${status}. Internal notes updated.`
        };
        
        // Add system message inside ticket thread
        const systemMsg = {
          id: `msg-${Date.now()}-sys`,
          sender: 'regional_admin' as const,
          senderName: 'System',
          content: `Ticket status changed to ${status.toUpperCase()} by Admin ${regional_adminName}.`,
          timestamp: new Date().toISOString()
        };
        // Trigger in-app notification
        this.addNotification('support_reply', `Ticket #${ticketId} status updated`, `Status is now: ${status.toUpperCase()}`, t.userId);
        
        return {
          ...t,
          status,
          priority,
          internalNotes,
          assignedAdminId: regional_adminId,
          assignedAdminName: regional_adminName,
          history: [...t.history, historyEvent],
          messages: [...t.messages, systemMsg]
        };
      }
      return t;
    });
    this.addAuditLog('Ticket Status Updated', regional_adminName, 'regional_admin', 'Portugal / Algarve', `Updated ticket #${ticketId} status to ${status}`);
    this.saveState();
  }
  // 3. System Notifications Actions
  public addNotification(type: AppNotification['type'], title: string, content: string, userId: string) {
    if (!this.state.notifications) this.state.notifications = [];
    const newNtf: AppNotification = {
      id: `ntf-${Date.now()}`,
      type,
      title,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      userId
    };
    this.state.notifications = [newNtf, ...this.state.notifications];
    this.saveState();
  }
  public markNotificationsRead(userId: string) {
    if (!this.state.notifications) return;
    this.state.notifications = this.state.notifications.map(n => {
      if (n.userId === userId) {
        return { ...n, read: true };
      }
      return n;
    });
    this.saveState();
  }
  // 4. Audit Log Actions
  public addAuditLog(action: string, actorName: string, actorRole: string, territory: string, details: string) {
    if (!this.state.auditLogs) this.state.auditLogs = [];
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      actorName,
      actorRole,
      territory,
      timestamp: new Date().toISOString(),
      details
    };
    this.state.auditLogs = [newLog, ...this.state.auditLogs];
    this.saveState();
  }
  // Suggestions & Complaints Box Actions
  public addSuggestion(type: 'suggestion' | 'complaint', title: string, content: string, senderName: string, senderRole: string, region: string) {
    if (!this.state.suggestions) this.state.suggestions = [];
    const newSuggestion: SuggestionComplaint = {
      id: `sug-${Date.now()}`,
      type,
      title,
      content,
      senderName,
      senderRole,
      region,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    this.state.suggestions = [newSuggestion, ...this.state.suggestions];
    this.addAuditLog('Suggestion/Complaint Submitted', senderName, senderRole, region, `Submitted a ${type} titled "${title}"`);
    this.saveState();
  }
  public updateSuggestionStatus(suggestionId: string, status: 'pending' | 'reviewed') {
    if (!this.state.suggestions) return;
    this.state.suggestions = this.state.suggestions.map(s => {
      if (s.id === suggestionId) {
        return { ...s, status };
      }
      return s;
    });
    this.saveState();
  }
  // 5. Job Timeline Actions
  public addJobTimelineEvent(jobId: string, action: string, actor: string, details?: string) {
    this.state.jobs = this.state.jobs.map(job => {
      if (job.id === jobId) {
        const events = job.timeline || [];
        const newEvent: JobTimelineEvent = {
          id: `ev-${Date.now()}`,
          action,
          timestamp: new Date().toISOString(),
          actor,
          details
        };
        return {
          ...job,
          timeline: [...events, newEvent]
        };
      }
      return job;
    });
    this.saveState();
  }
  public async updateUsers(users: AuthUser[]) {
    this.state.users = users;
    this.saveState();
    try {
      await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ users })
      });
    } catch (e) {
      console.error('Failed to sync users update:', e);
    }
  }
  public updateSpecialists(specialists: Specialist[]) {
    this.state.specialists = specialists;
    this.saveState();
  }
  public updateJobs(jobs: Job[]) {
    this.state.jobs = jobs;
    this.saveState();
  }
  public addJob(job: Job) {
    this.state.jobs = [job, ...this.state.jobs];
    this.saveState();
  }
  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }
  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }
  // Action: Set Role
  public setRole(role: UserRole) {
    this.state.currentRole = role;
    this.saveState();
  }
  // Action: Select City
  public setSelectedCity(city: string | null) {
    this.state.selectedCity = city;
    this.saveState();
  }
  // Action: Select Category
  public setSelectedCategory(category: ServiceCategory | null) {
    this.state.selectedCategory = category;
    this.saveState();
  }
  // Action: Reset Category and City Wizard
  public resetWizard() {
    this.state.selectedCity = null;
    this.state.selectedCategory = null;
    this.saveState();
  }
  // Action: Authenticate (Google OAuth + Phone OTP sequential completion)
  public async authenticate(
    email: string,
    phone: string,
    name: string,
    chosenRole: UserRole = 'customer',
    password?: string,
    dashboardNumber?: string,
    isRegistration?: boolean
  ): Promise<AuthUser> {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, phone: normalizedPhone, name, role: chosenRole, password, dashboardNumber, isRegistration })
      });
      const rawText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.warn('Server returned non-JSON response, using client fallback:', rawText);
      }
      if (data) {
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Authentication failed');
        }
        this.state.currentUser = data;
        this.state.currentRole = data.role;
        if (data.role === 'customer') {
          this.state.currentPath = '/app';
        } else if (data.role === 'specialist') {
          this.state.currentPath = '/pro';
        } else if (data.role === 'operator') {
          this.state.currentPath = '/ops';
        } else if (data.role === 'regional_admin') {
          this.state.currentPath = '/regional_admin';
        } else if (data.role === 'super_admin') {
          this.state.currentPath = '/superadmin';
        }
        this.saveState();
        this.syncFromServer();
        return data;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Failed to fetch') && err.message !== 'Authentication failed') {
        throw err;
      }
      console.error('Error during backend auth, using client fallback:', err);
    }
    // Client fallback if backend is offline
    const targetRole = chosenRole || 'customer';
    const allowedSuperAdmins = ['timeplace.internal@gmail.com', 'ironstorm174@gmail.com', 'oleg'];
    const isSuperAdminEmail = Boolean(
      normalizedEmail && allowedSuperAdmins.some(a => normalizedEmail.includes(a) || a.includes(normalizedEmail))
    );

    if (targetRole === 'super_admin' && !isSuperAdminEmail) {
      throw new Error('Access denied. You are not authorized as Super Admin.');
    }

    if (targetRole === 'super_admin') {
      let superUser = this.state.users.find(u => u.role === 'super_admin' && (u.id === 'user-super-01' || (u.email && u.email.toLowerCase() === normalizedEmail.toLowerCase())));
      if (!superUser) {
        superUser = {
          id: 'user-super-01',
          email: normalizedEmail,
          phone: normalizedPhone || '+351 901 000 000',
          name: name || 'Oleg (Territorial Partner)',
          role: 'super_admin',
          dashboardNumber: '01',
          photoUrl: '/portimao_tp.jpg',
          city: 'Portimão',
          region: 'Algarve',
          specialistStatus: 'approved'
        };
        this.state.users.push(superUser);
      }
      this.state.currentUser = superUser;
      this.state.currentRole = 'super_admin';
      this.state.currentPath = '/super-admin';
      this.saveState();
      return superUser;
    }

    const existingRoleUser = this.state.users.find(
      (u) => u.role === targetRole && (
        (normalizedPhone && u.phone === normalizedPhone) ||
        (normalizedEmail && u.email && u.email.toLowerCase() === normalizedEmail.toLowerCase())
      )
    );

    let user: AuthUser;
    if (existingRoleUser) {
      if (existingRoleUser.isBlocked) {
        throw new Error('Access denied. Your account is blocked. Please contact support.');
      }
      user = existingRoleUser;
      if (name && (!user.name || user.name === 'User')) {
        user.name = name;
      }
      user.isNewUser = false;
    } else {
      if (['operator', 'regional_admin'].includes(targetRole)) {
        throw new Error(`Access denied. No partner account found for ${userEmail}. Please contact Super Admin.`);
      }

      user = {
        id: `user-${targetRole}-${Date.now()}`,
        email: userEmail,
        phone: normalizedPhone || undefined,
        name: name || (normalizedEmail && normalizedEmail.includes('@') ? normalizedEmail.split('@')[0] : 'User'),
        role: targetRole as any,
        specialistStatus: targetRole === 'specialist' ? 'approved' : 'not_requested',
        password: password || undefined,
        verificationDocuments: [],
        categories: [],
        languages: [],
        isNewUser: true,
      };
      this.state.users.push(user);

      if (targetRole === 'specialist') {
        const specExists = this.state.specialists.some(s => s.id === user.id);
        if (!specExists) {
          this.state.specialists.push({
            id: user.id,
            name: user.name,
            phone: user.phone || '',
            category: 'Home Services',
            city: 'Portimão',
            balance: 100,
            unlockedJobs: [],
            status: 'approved'
          });
        }
      }
    }
    this.state.currentUser = user;
    this.state.currentRole = user.role;
    this.saveState();
    return user;
  }
  // Action: Complete Onboarding (sets name, city, and category)
  public async onboardUser(
    userId: string,
    role: 'customer' | 'specialist',
    name: string,
    phone: string,
    city?: string,
    category?: ServiceCategory,
    categories?: ServiceCategory[],
    languages?: { language: string; level: 'basic' | 'conversational' | 'native' }[],
    tradeSkillLevel?: 'amateur' | 'pro' | 'expert',
    skillsDescription?: string,
    photoUrl?: string,
    verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[],
    specialtiesWithLevels?: SpecialtyWithLevel[]
  ) {
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ userId, role, name, phone, city, category, categories, languages, tradeSkillLevel, skillsDescription, photoUrl, verificationDocuments, specialtiesWithLevels })
      });
      if (res.ok) {
        await this.syncFromServer();
        return;
      }
    } catch (e) {
      console.error('Failed to submit onboarding to backend:', e);
    }
    // Local state fallback
    this.state.users = this.state.users.map((u) => {
      if (u.id === userId) {
        const updated: AuthUser = {
          ...u,
          name,
          phone,
          role,
          city,
          category,
          categories,
          languages,
          tradeSkillLevel,
          skillsDescription,
          photoUrl,
          verificationDocuments,
          specialtiesWithLevels,
          isNewUser: false,
          specialistStatus: role === 'specialist' ? (u.specialistStatus === 'approved' ? 'approved' : 'pending_review') : 'not_requested',
        };
        return updated;
      }
      return u;
    });
    const updatedUser = this.state.users.find((u) => u.id === userId);
    if (updatedUser) {
      this.state.currentUser = updatedUser;
      this.state.currentRole = updatedUser.role;
      this.state.currentPath = updatedUser.role === 'specialist' ? '/pro' : '/app';
    }
    // Update or add the specialist in the list
    if (role === 'specialist') {
      const existingSpec = this.state.specialists.find((s) => s.id === userId);
      const specStatus = existingSpec && (existingSpec.status === 'approved' || existingSpec.status === 'rejected')
        ? existingSpec.status
        : 'pending_review';
      const specIndex = this.state.specialists.findIndex((s) => s.id === userId);
      const newSpec: Specialist = {
        id: userId,
        name,
        phone,
        category: category || (categories && categories[0]) || 'Home Services',
        categories: categories || [category || 'Home Services'],
        city: city || 'Portimão',
        balance: 100,
        unlockedJobs: [],
        status: specStatus as any,
        languages: languages || [],
        tradeSkillLevel: tradeSkillLevel || 'amateur',
        skillsDescription: skillsDescription || '',
        photoUrl: photoUrl || '',
        verificationDocuments: verificationDocuments || [],
        specialtiesWithLevels: specialtiesWithLevels || []
      };
      if (specIndex !== -1) {
        this.state.specialists[specIndex] = {
          ...this.state.specialists[specIndex],
          ...newSpec,
          status: specStatus as any,
        };
      } else {
        this.state.specialists.push(newSpec);
      }
      this.state.activeSpecialistId = userId;
    }
    this.saveState();
  }
  public async updateUserPhoto(userId: string, photoUrl: string) {
    // 1. Immediately apply to local state to avoid race conditions or image loss
    if (this.state.currentUser && (this.state.currentUser.id === userId || this.state.currentUser.role === 'super_admin')) {
      this.state.currentUser.photoUrl = photoUrl;
      this.state.currentUser.avatar = photoUrl;
    }
    if (this.state.superAdminBackupUser) {
      this.state.superAdminBackupUser.photoUrl = photoUrl;
      this.state.superAdminBackupUser.avatar = photoUrl;
    }
    if (this.state.impersonatedUser && this.state.impersonatedUser.id === userId) {
      this.state.impersonatedUser.photoUrl = photoUrl;
      this.state.impersonatedUser.avatar = photoUrl;
    }
    this.state.users = this.state.users.map((u) => {
      if (u.id === userId || (u.role === 'super_admin' && (userId === 'user-super-01' || u.id === 'user-super-01'))) {
        return { ...u, photoUrl, avatar: photoUrl };
      }
      return u;
    });
    this.state.specialists = this.state.specialists.map((s) => {
      if (s.id === userId) {
        return { ...s, photoUrl };
      }
      return s;
    });
    this.saveState();
    // 2. Persist to backend
    try {
      await fetch('/api/user/update-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ userId, photoUrl })
      });
    } catch (e) {
      console.error('Failed to submit user photo update to backend:', e);
    }
  }
  public navigate(path: string) {
    this.state.currentPath = path;
    this.saveState();
  }
  public goToHome() {
    if (this.state.currentUser) {
      this.state.currentRole = this.state.currentUser.role;
    } else {
      this.state.currentRole = 'customer';
    }
    this.state.selectedCity = null;
    this.state.selectedCategory = null;
    this.state.currentPath = '/app';
    this.state.homeResetCounter = (this.state.homeResetCounter || 0) + 1;
    this.saveState();
  }
  // Action: Delete Account
  public deleteAccount() {
    if (this.state.currentUser) {
      // Remove all jobs belonging to this user
      this.state.jobs = this.state.jobs.filter(job => job.customerPhone !== this.state.currentUser!.phone);
      // We don't have a users array to remove from in this mocked state since we just mock a logged in user.
      // But if we did, we'd remove them there too.
    }
    
    // Then logout
    this.logout();
  }
  // Action: Logout
  
  public impersonateUser(user: AuthUser) {
    if (!this.state.superAdminBackupUser) {
      this.state.superAdminBackupUser = this.state.currentUser;
    }
    this.state.impersonatedUser = user;
    this.state.currentUser = user;
    this.state.currentRole = user.role;
    if (user.role === 'operator') {
      this.state.activeOperatorId = user.id;
    }
    this.saveState();
    this.notifyListeners();
    this.addAuditLog('Dashboard Takeover', 'SuperAdmin / 01', 'super_admin', 'All', `SuperAdmin switched control to dashboard ${user.dashboardNumber || user.id} (${user.name})`);
  }
  public impersonateByDashboardNumber(dashboardNumber: string): boolean {
    const cleanNum = dashboardNumber.trim().toLowerCase();
    if (!cleanNum) return false;
    const target = this.state.users.find(u => 
      (u.dashboardNumber && u.dashboardNumber.trim().toLowerCase() === cleanNum) ||
      (u.id && u.id.toLowerCase() === cleanNum) ||
      (u.role === 'regional_admin' && cleanNum.includes('rd') && u.dashboardNumber?.toLowerCase().includes(cleanNum)) ||
      (u.role === 'operator' && cleanNum.includes('op') && u.dashboardNumber?.toLowerCase().includes(cleanNum))
    );
    if (target) {
      this.impersonateUser(target);
      return true;
    }
    const isRegional = cleanNum.includes('rd') || cleanNum.startsWith('0');
    const role: import('./types').UserRole = isRegional ? 'regional_admin' : 'operator';
    
    const constructedUser: import('./types').AuthUser = {
      id: `u_dash_${cleanNum.replace(/[^a-z0-9]/g, '')}`,
      email: `partner_${cleanNum.replace(/[^a-z0-9]/g, '')}@nordbase.pt`,
      name: `Dashboard Partner (${dashboardNumber.toUpperCase()})`,
      phone: '+351 912 000 000',
      role: role,
      region: isRegional ? 'Big Lisboa' : 'Portimão',
      dashboardNumber: dashboardNumber.toUpperCase(),
      isNewUser: false,
    };
    this.impersonateUser(constructedUser);
    return true;
  }
  
  public getHubs(): import('./types').TerritorialHub[] {
    return this.state.hubs || INITIAL_HUBS;
  }
  public createTerritorialHub(
    name: string,
    region: string,
    city: string,
    rdCode: string,
    assignedDistricts: string[] = []
  ): import('./types').TerritorialHub {
    const currentHubs = this.state.hubs || INITIAL_HUBS;
    const hubIndex = (currentHubs.length + 1).toString().padStart(3, '0');
    const hubId = `HUB-${city.toUpperCase().slice(0, 3)}-${hubIndex}`;
    const hubCode = `HUB-${hubIndex}`;
    const seatBaseNum = (currentHubs.length + 1).toString().padStart(3, '0');
    const shifts: ('Shift 1: Sunrise (06:00 - 14:00)' | 'Shift 2: Sunset (14:00 - 22:00)' | 'Relief Cover A' | 'Relief Cover B')[] = [
      'Shift 1: Sunrise (06:00 - 14:00)',
      'Shift 2: Sunset (14:00 - 22:00)',
      'Relief Cover A',
      'Relief Cover B'
    ];
    const seatSuffixes = ['A', 'B', 'C', 'D'];
    const newSeats: import('./types').HubSeat[] = seatSuffixes.map((s, idx) => {
      const seatId = `PT-OP-${seatBaseNum}-${s}`;
      const operatorName = `TP Operator (${name} - ${s})`;
      
      // Auto-create matching TP user in users list
      const newUser: import('./types').AuthUser = {
        id: `u_tp_${seatId.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        email: `tp_${seatId.toLowerCase().replace(/[^a-z0-9]/g, '')}@nordbase.pt`,
        name: operatorName,
        phone: '+351 912 ' + Math.floor(100000 + Math.random() * 900000),
        role: 'operator',
        specialistStatus: 'not_requested',
        region: region,
        city: city,
        dashboardNumber: seatId,
        hubId: hubId,
        hubName: name,
        seatId: seatId,
        shiftName: shifts[idx],
        isNewUser: false
      };
      this.state.users.push(newUser);
      return {
        seatId,
        seatCode: `${seatBaseNum}-${s}`,
        shiftName: shifts[idx],
        operatorId: newUser.id,
        operatorName: newUser.name,
        operatorPhone: newUser.phone,
        operatorEmail: newUser.email,
        status: 'active',
        personalRevenue: 0,
        personalJobsProcessed: 0
      };
    });
    const newHub: import('./types').TerritorialHub = {
      id: hubId,
      hubCode,
      name,
      rdCode,
      region,
      city,
      assignedDistricts: assignedDistricts.length > 0 ? assignedDistricts : [city],
      seats: newSeats,
      createdAt: new Date().toISOString(),
      totalHubRevenue: 0,
      activeJobsCount: 0
    };
    this.state.hubs = [...currentHubs, newHub];
    this.saveState();
    this.notifyListeners();
    this.addAuditLog(
      'Territorial Hub Created',
      'SuperAdmin / 01',
      'super_admin',
      region,
      `Provisioned Hub "${name}" with 4 TP Seat Dashboards (${newSeats.map(s => s.seatId).join(', ')})`
    );
    return newHub;
  }
  public stopImpersonation() {
    if (this.state.superAdminBackupUser) {
      this.state.currentUser = this.state.superAdminBackupUser;
      this.state.superAdminBackupUser = null;
    } else {
      const superAdminUser = this.state.users.find(u => u.role === 'super_admin') || {
        id: 'u_super_admin_01',
        email: 'ironstorm174@gmail.com',
        name: 'Director NordBase /01',
        phone: '+351 900 000 001',
        role: 'super_admin',
        region: 'All',
        dashboardNumber: '01',
        isNewUser: false,
      };
      this.state.currentUser = superAdminUser;
    }
    this.state.impersonatedUser = null;
    this.state.currentRole = 'super_admin';
    this.saveState();
    this.notifyListeners();
    this.addAuditLog('Control Returned', 'SuperAdmin / 01', 'super_admin', 'All', 'SuperAdmin returned to National Command Center (/01)');
  }
  public logout() {
    this.state.currentUser = null;
    this.state.impersonatedUser = null;
    this.state.superAdminBackupUser = null;
    this.state.currentRole = 'customer';
    this.state.currentPath = '/app';
    this.state.selectedCity = null;
    this.state.selectedCategory = null;
    this.state.homeResetCounter = (this.state.homeResetCounter || 0) + 1;
    this.saveState();
  }
  // Action: Approve Specialist
  public async approveSpecialist(userId: string) {
    try {
      const res = await fetch(`/api/specialists/${userId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ action: 'approve' })
      });
      if (res.ok) {
        await this.syncFromServer();
        return;
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback
    this.state.users = this.state.users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role: 'specialist' as UserRole,
          specialistStatus: 'approved' as SpecialistStatus,
        };
      }
      return u;
    });
    this.state.specialists = this.state.specialists.map((s) => {
      if (s.id === userId) {
        return {
          ...s,
          status: 'approved' as const,
        };
      }
      return s;
    });
    if (this.state.currentUser && this.state.currentUser.id === userId) {
      this.state.currentUser.specialistStatus = 'approved';
    }
    this.saveState();
  }
  // Action: Request Specialist Verification
  public async requestVerification(userId: string) {
    try {
      const res = await fetch(`/api/specialists/${userId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ action: 'request_verification' })
      });
      if (res.ok) {
        await this.syncFromServer();
        return;
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback
    this.state.users = this.state.users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          specialistStatus: 'pending_review' as SpecialistStatus,
        };
      }
      return u;
    });
    this.state.specialists = this.state.specialists.map((s) => {
      if (s.id === userId) {
        return {
          ...s,
          status: 'pending_review' as const,
        };
      }
      return s;
    });
    if (this.state.currentUser && this.state.currentUser.id === userId) {
      this.state.currentUser.specialistStatus = 'pending_review';
    }
    this.saveState();
  }
  // Action: Reject Specialist Application
  public async rejectSpecialist(userId: string) {
    try {
      const res = await fetch(`/api/specialists/${userId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ action: 'reject' })
      });
      if (res.ok) {
        await this.syncFromServer();
        return;
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback
    this.state.users = this.state.users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          specialistStatus: 'rejected' as SpecialistStatus,
        };
      }
      return u;
    });
    this.state.specialists = this.state.specialists.map((s) => {
      if (s.id === userId) {
        return {
          ...s,
          status: 'rejected' as const,
        };
      }
      return s;
    });
    if (this.state.currentUser && this.state.currentUser.id === userId) {
      this.state.currentUser.specialistStatus = 'rejected';
    }
    this.saveState();
  }
  // Action: Permanently Delete User Profile (Any Role)
  public async deleteUser(userId: string) {
    if (!userId) return;
    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE', headers: { ...this.getAuthHeaders() } });
    } catch (e) {
      console.error('Error deleting user from server:', e);
    }
    this.state.users = this.state.users.filter((u) => u.id !== userId);
    this.state.specialists = this.state.specialists.filter((s) => s.id !== userId);
    this.state.jobs = (this.state.jobs || []).filter((j) => j.customerId !== userId && j.assignedSpecialistId !== userId);
    if (this.state.currentUser && this.state.currentUser.id === userId) {
      this.state.currentUser = null;
      this.state.currentRole = 'customer';
    }
    this.saveState();
    this.notify();
  }

  // Action: Toggle Freeze/Block User Profile (Any Role)
  public async toggleFreezeUser(userId: string) {
    let newBlockedState = false;
    this.state.users = this.state.users.map((u) => {
      if (u.id === userId) {
        newBlockedState = !u.isBlocked;
        return {
          ...u,
          isBlocked: newBlockedState,
        };
      }
      return u;
    });
    this.saveState();
    this.notify();

    // Persist to server backend
    try {
      await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ users: this.state.users }),
      });
    } catch (e) {
      console.error('Error syncing freeze state to server:', e);
    }
    return newBlockedState;
  }

  // Action: Invite Operator
  public inviteOperator(email: string) {
    const normalEmail = email.toLowerCase().trim();
    if (!this.state.inviteList) {
      this.state.inviteList = [];
    }
    if (!this.state.inviteList.includes(normalEmail)) {
      this.state.inviteList.push(normalEmail);
      this.saveState();
    }
  }
  // Action: Remove Territory Partner Invite
  public removeOperatorInvite(email: string) {
    const normalEmail = email.toLowerCase().trim();
    if (this.state.inviteList) {
      this.state.inviteList = this.state.inviteList.filter(
        (e) => e.toLowerCase() !== normalEmail
      );
      this.saveState();
    }
  }
  // Action: Create Job Request (Customer flow)
  public async createJobRequest(
    customerName: string,
    customerPhone: string,
    specificLocation: string,
    description: string,
    attachments: string[] = [],
    operatorId: string | null = null,
    hubId?: string
  ): Promise<Job> {
    const knownCities = ['Portimão', 'Lagos', 'Faro', 'Lisboa', 'Albufeira', 'Sines', 'Cascais', 'Porto', 'Coimbra', 'Braga', 'Funchal', 'Tavira', 'Loulé', 'Olhão', 'Vilamoura'];
    let targetCity = this.state.selectedCity;
    if (specificLocation) {
      const matchedKnown = knownCities.find(c => specificLocation.toLowerCase().includes(c.toLowerCase()));
      if (matchedKnown) {
        targetCity = matchedKnown;
      }
    }
    targetCity = targetCity || 'Portimão';
    const autoOperator = operatorId || this.findMatchingOperatorForCity(targetCity)?.id || null;
    const newJob: Job = {
      id: `job-${Date.now()}`,
      category: this.state.selectedCategory || 'Home Services',
      city: targetCity,
      specificLocation,
      description,
      estimatedHours: 2,
      estimatedValue: 100,
      leadPrice: 10,
      status: 'pending_operator',
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone,
      unlockedBySpecialistId: null,
      operatorId: autoOperator,
      hubId: hubId || undefined,
      attachments,
      messages: [
        {
          id: `msg-${Date.now()}-sys`,
          sender: 'system',
          senderName: 'System',
          content: `Service request submitted for ${this.state.selectedCategory} in ${this.state.selectedCity}. A Territory Partner will call you shortly to verify details.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newJob.category,
          city: newJob.city,
          specificLocation,
          description,
          customerName,
          customerPhone,
          attachments,
          operatorId,
          hubId
        })
      });
      if (res.ok) {
        const created = await res.json();
        await this.syncFromServer();
        return created;
      }
    } catch (e) {
      console.error('Failed to create job request on Neon backend:', e);
    }
    // Local state fallback
    this.state.jobs = [newJob, ...this.state.jobs];
    this.addAuditLog('Job Created', customerName, 'customer', `Portugal / ${newJob.city}`, `Customer request submitted for ${newJob.category}.`);
    this.addJobTimelineEvent(newJob.id, 'Job Submitted', 'Customer', `Service request submitted successfully for category ${newJob.category}.`);
    this.addNotification('new_job', `New request in ${newJob.city}`, `New request for ${newJob.category} by ${customerName}.`, 'operator');
    this.saveState();
    return newJob;
  }
  public findMatchingOperatorForCity(city: string): AuthUser | undefined {
    return this.state.users.find(u =>
      u.role === 'operator' && (
        (u.city && u.city.toLowerCase() === city.toLowerCase()) ||
        u.name.toLowerCase().includes(city.toLowerCase()) ||
        (u.dashboardNumber && u.dashboardNumber.toLowerCase().includes(city.toLowerCase()))
      )
    );
  }
  public async triggerSLAFailover(jobId: string, slaMinutesThreshold: number = 15): Promise<{ success: boolean; failoverTarget?: AuthUser }> {
    const job = this.state.jobs.find(j => j.id === jobId);
    if (!job || job.status !== 'pending_operator') {
      return { success: false };
    }
    const rpUser = this.state.users.find(u => u.role === 'regional_admin') ||
                   this.state.users.find(u => u.role === 'super_admin') ||
                   { id: 'user-super-01', name: 'Oleg (Territorial Partner)', role: 'super_admin' as UserRole, specialistStatus: 'approved' as SpecialistStatus, photoUrl: '/portimao_tp.jpg' };
    job.operatorId = rpUser.id;
    job.messages.push({
      id: `msg-${Date.now()}-failover`,
      sender: 'system',
      senderName: 'SLA Guard Engine',
      content: `🚨 SLA FAILOVER PODSTRAHOVKA: Local TP did not claim request within ${slaMinutesThreshold} min SLA. Lead escalated to Regional Partner / SuperAdmin (${rpUser.name}).`,
      timestamp: new Date().toISOString()
    });
    this.addJobTimelineEvent(jobId, 'SLA Failover Triggered', 'SLA Guard Engine', `Unclaimed lead automatically transferred to ${rpUser.name} (${rpUser.role}) after ${slaMinutesThreshold} min SLA timeout.`);
    this.addAuditLog('SLA Failover Executed', rpUser.name, rpUser.role, `Portugal / ${job.city}`, `Job #${jobId} in ${job.city} transferred to ${rpUser.name} due to local TP SLA timeout.`);
    this.addNotification('new_job', `🚨 SLA Failover: Unclaimed Lead in ${job.city}`, `Job #${jobId} escalated to you due to local operator delay.`, rpUser.role as any);
    this.saveState();
    return { success: true, failoverTarget: rpUser as AuthUser };
  }
  // Action: Territory Partner claims a job
  public async claimJob(jobId: string, operatorId: string) {
    try {
      const res = await fetch(`/api/jobs/${jobId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ operatorId })
      });
      if (res.ok) {
        // Post claim message
        await fetch(`/api/jobs/${jobId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
          body: JSON.stringify({
            sender: 'system',
            senderName: 'System',
            content: `Operator has assigned themselves to this request and is preparing the dispatch card.`
          })
        });
        await this.syncFromServer();
        return;
      }
    } catch (e) {
      console.error(e);
    }
    // Local fallback
    this.state.jobs = this.state.jobs.map((job) => {
      if (job.id === jobId) {
        return {
          ...job,
          operatorId,
          messages: [
            ...job.messages,
            {
              id: `msg-${Date.now()}-sys`,
              sender: 'system',
              senderName: 'System',
              content: `Operator has assigned themselves to this request and is preparing the dispatch card.`,
              timestamp: new Date().toISOString(),
            } as Message,
          ]
        };
      }
      return job;
    });
    const operatorUser = this.state.users.find(u => u.id === operatorId) || this.state.currentUser;
    const operatorName = operatorUser ? operatorUser.name : 'Territory Partner';
    this.addAuditLog('Job Claimed', operatorName, 'operator', 'Portugal / Algarve', `Operator ${operatorName} assigned themselves to Job #${jobId}`);
    this.addJobTimelineEvent(jobId, 'Operator Claimed', 'Territory Partner', `Operator ${operatorName} has claimed the request and is preparing the dispatch card.`);
    this.saveState();
  }
  // Action: Territory Partner offers job to specific specialists
  public async offerJobToSpecialists(
    jobId: string,
    estimatedHours: number,
    estimatedValue: number,
    leadPrice: number,
    operatorNotes: string,
    offeredSpecialistIds: string[]
  ) {
    try {
      const res = await fetch(`/api/jobs/${jobId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({
          status: 'offered',
          estimatedHours,
          estimatedValue,
          leadPrice,
          operatorNotes,
          offeredSpecialistIds
        })
      });
      if (res.ok) {
        await fetch(`/api/jobs/${jobId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
          body: JSON.stringify({
            sender: 'system',
            senderName: 'System',
            content: `Operator offered lead to ${offeredSpecialistIds.length} specialists. Waiting for their interest. Lead unlock fee: ${leadPrice}€.`
          })
        });
        await this.syncFromServer();
        return;
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback
    this.state.jobs = this.state.jobs.map((job) => {
      if (job.id === jobId) {
        return {
          ...job,
          estimatedHours,
          estimatedValue,
          leadPrice,
          operatorNotes,
          offeredSpecialistIds,
          status: 'offered' as JobStatus,
          messages: [
            ...job.messages,
            {
              id: `msg-${Date.now()}-sys`,
              sender: 'system',
              senderName: 'System',
              content: `Operator offered lead to ${offeredSpecialistIds.length} specialists. Waiting for their interest. Lead unlock fee: ${leadPrice}€.`,
              timestamp: new Date().toISOString(),
            } as Message,
          ]
        };
      }
      return job;
    });
    const jb = this.state.jobs.find(j => j.id === jobId);
    const opUser = this.state.users.find(u => u.id === jb?.operatorId) || this.state.currentUser;
    const opName = opUser ? opUser.name : 'Territory Partner';
    this.addAuditLog('Job Offered', opName, 'operator', 'Portugal / Algarve', `Job #${jobId} offered to ${offeredSpecialistIds.length} specialists.`);
    this.addJobTimelineEvent(jobId, 'Offered to Specialists', 'Territory Partner', `Job offered with lead fee ${leadPrice}€.`);
    this.saveState();
  }
  // Action: Specialist expresses interest
  public async expressInterest(jobId: string, specialistId: string): Promise<boolean> {
    const job = this.state.jobs.find((j) => j.id === jobId);
    if (!job || job.status !== 'offered') return false;
    this.state.jobs = this.state.jobs.map((j) => {
      if (j.id === jobId) {
        const interested = j.interestedSpecialistIds || [];
        if (!interested.includes(specialistId)) {
          return { ...j, interestedSpecialistIds: [...interested, specialistId] };
        }
      }
      return j;
    });
    this.addJobTimelineEvent(jobId, 'Specialist Interested', 'Specialist', `Specialist ${specialistId} is ready for this job.`);
    this.saveState();
    return true;
  }
  // Action: Territory Partner selects the final specialist
  public async selectSpecialistForJob(jobId: string, specialistId: string) {
    const specialist = this.state.specialists.find(s => s.id === specialistId);
    if (!specialist) return;
    this.state.jobs = this.state.jobs.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'specialist_selected' as JobStatus,
          unlockedBySpecialistId: specialistId,
          unlockedBySpecialistName: specialist.name,
          unlockedBySpecialistPhone: specialist.phone,
          messages: [
            ...j.messages,
            {
              id: `msg-${Date.now()}-sys`,
              sender: 'system',
              senderName: 'System',
              content: `Operator has selected ${specialist.name} for this job. Waiting for them to pay the lead fee.`,
              timestamp: new Date().toISOString(),
            }
          ]
        };
      }
      return j;
    });
    this.addJobTimelineEvent(jobId, 'Specialist Selected', 'Territory Partner', `${specialist.name} was chosen by the operator.`);
    this.saveState();
  }
  // Action: Specialist unlocks a job (pays for lead)
  public async unlockJob(jobId: string, specialistId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/jobs/${jobId}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ specialistId })
      });
      if (res.ok) {
        await this.syncFromServer();
        const specialist = this.state.specialists.find((s) => s.id === specialistId);
        const specName = specialist ? specialist.name : 'Specialist';
        const job = this.state.jobs.find((j) => j.id === jobId);
        const price = job ? job.leadPrice : 0;
        this.addAuditLog('Lead Purchased', specName, 'specialist', `Portugal / Algarve`, `Specialist ${specName} bought/unlocked job #${jobId} for ${price}€.`);
        this.addJobTimelineEvent(jobId, 'Lead Unlocked', 'Specialist', `Specialist ${specName} unlocked contact info for ${price}€.`);
        this.addNotification('lead_purchased', 'Lead Unlocked', `Specialist ${specName} has unlocked your service request!`, 'user-regional_admin');
        this.saveState();
        return true;
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn('Unlock failed on server:', res.status, errData);
        return false;
      }
    } catch (e) {
      console.error('Unlock network exception:', e);
      return false;
    }
  }
  public addHubMessage(hubId: string, message: Message) {
    if (!this.state.hubs) return;
    const hub = this.state.hubs.find(h => h.id === hubId);
    if (hub) {
      if (!hub.chatMessages) {
        hub.chatMessages = [];
      }
      hub.chatMessages.push(message);
      this.saveState();
    }
  }

  // Action: Add message to chat
  public async addMessage(
    jobId: string,
    sender: 'customer' | 'operator' | 'specialist' | 'system' | 'super_admin' | 'regional_admin',
    senderName: string,
    content: string,
    channel?: 'customer_operator' | 'operator_specialist' | 'operator_operator' | 'customer_specialist',
    attachmentUrl?: string,
    attachmentName?: string,
    providedAvatar?: string
  ) {
    let senderAvatar = providedAvatar;
    if (!senderAvatar && this.state.currentUser && (this.state.currentUser.name === senderName || this.state.currentUser.role === sender)) {
      senderAvatar = this.state.currentUser.photoUrl || this.state.currentUser.avatar;
    }
    if (!senderAvatar) {
      const u = this.state.users.find(usr => usr.name === senderName || usr.role === sender);
      if (u) senderAvatar = u.photoUrl || u.avatar;
    }
    if (!senderAvatar && sender === 'specialist') {
      const s = this.state.specialists.find(sp => sp.name === senderName);
      if (s) senderAvatar = s.photoUrl;
    }
    try {
      const res = await fetch(`/api/jobs/${jobId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ sender, senderName, senderAvatar, content, channel, attachmentUrl, attachmentName })
      });
      if (res.ok) {
        await this.syncFromServer();
        return;
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback
    this.state.jobs = this.state.jobs.map((job) => {
      if (job.id === jobId) {
        const newMessage: Message = {
          id: `msg-${Date.now()}-${sender}`,
          sender,
          senderName,
          senderAvatar,
          content,
          timestamp: new Date().toISOString(),
          channel,
          attachmentUrl,
          attachmentName
        };
        return {
          ...job,
          messages: [...job.messages, newMessage],
        };
      }
      return job;
    });
    this.saveState();
  }

  // Action: Complete Job (TP Finalization)
  public async completeJob(jobId: string) {
    try {
      const res = await fetch(`/api/jobs/${jobId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({})
      });
      if (res.ok) {
        await this.syncFromServer();
        const jb = this.state.jobs.find(j => j.id === jobId);
        const opUser = this.state.users.find(u => u.id === jb?.operatorId) || this.state.currentUser;
        const opName = opUser ? opUser.name : 'Territory Partner';
        this.addAuditLog('Job Completed', opName, 'operator', 'Portugal / Algarve', `Job #${jobId} marked completed.`);
        this.addJobTimelineEvent(jobId, 'Job Completed', 'Territory Partner', `${opName} verified and marked the job as completed.`);
        this.saveState();
        return true;
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to complete job');
      }
    } catch (e) {
      console.error('Error completing job:', e);
      throw e;
    }
  }
  // Action: Customer confirms completion with rating & review
  public async confirmCustomerCompletion(
    jobId: string,
    rating?: number,
    positiveTags?: string[],
    customerComment?: string
  ) {
    const nowIso = new Date().toISOString();
    try {
      const res = await fetch(`/api/jobs/${jobId}/customer-completion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({
          orderCompleted: true,
          noClaims: true,
          paymentMade: true,
          rating,
          positiveTags,
          customerComment
        })
      });
      if (res.ok) {
        await this.syncFromServer();
      }
    } catch (e) {
      console.error('Error sending customer completion to server:', e);
    }

    // Update local state if needed (status stays as is - active)
    this.state.jobs = this.state.jobs.map((job) => {
      if (job.id === jobId) {
        const ratingText = rating ? ` Rated: ${rating}⭐` : '';
        const tagText = positiveTags && positiveTags.length > 0 ? ` (${positiveTags.join(', ')})` : '';
        const commentMsg = customerComment ? ` Comment: "${customerComment}"` : '';
        
        const newSysMsg: Message = {
          id: `msg-${Date.now()}-cust-done`,
          sender: 'system',
          senderName: 'System',
          content: `Customer confirmed job completion: "Work completed, no disputes".${ratingText}${tagText}${commentMsg}`,
          timestamp: nowIso,
        };
        return {
          ...job,
          customerCompleted: true,
          customerCompletedAt: nowIso,
          rating: rating ?? job.rating,
          positiveTags: positiveTags ?? job.positiveTags,
          customerComment: customerComment ?? job.customerComment,
          feedbackSubmittedAt: nowIso,
          messages: [...(job.messages || []), newSysMsg],
        };
      }
      return job;
    });
    const targetJob = this.state.jobs.find((j) => j.id === jobId);
    if (targetJob) {
      this.addJobTimelineEvent(
        jobId,
        'Customer Confirmed Completion',
        targetJob.customerName || 'Customer',
        `Confirmed: "Work completed, no disputes". Rating: ${rating || 5}⭐`
      );
      this.addAuditLog(
        'Customer Completion Sign-off',
        targetJob.customerName || 'Customer',
        'customer',
        targetJob.city || 'Portugal',
        `Job #${jobId} signed off by customer.`
      );
    }
    this.saveState();
  }
  // Action: Specialist confirms completion & payment received
  public async confirmSpecialistCompletion(jobId: string) {
    const nowIso = new Date().toISOString();
    try {
      const res = await fetch(`/api/jobs/${jobId}/specialist-completion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({
          workCompleted: true,
          paymentReceived: true,
          noClaims: true
        })
      });
      if (res.ok) {
        await this.syncFromServer();
      }
    } catch (e) {
      console.error('Error sending specialist completion to server:', e);
    }

    // Update local state if needed (status stays as is - active)
    this.state.jobs = this.state.jobs.map((job) => {
      if (job.id === jobId) {
        const newSysMsg: Message = {
          id: `msg-${Date.now()}-spec-done`,
          sender: 'system',
          senderName: 'System',
          content: `Specialist confirmed completion: "Work completed, payment received, no disputes".`,
          timestamp: nowIso,
        };
        return {
          ...job,
          specialistCompleted: true,
          specialistCompletedAt: nowIso,
          messages: [...(job.messages || []), newSysMsg],
        };
      }
      return job;
    });
    const targetJob = this.state.jobs.find((j) => j.id === jobId);
    if (targetJob) {
      this.addJobTimelineEvent(
        jobId,
        'Specialist Confirmed Completion',
        targetJob.unlockedBySpecialistName || 'Specialist',
        `Confirmed: "Work completed, payment received, no disputes".`
      );
      this.addAuditLog(
        'Specialist Completion Sign-off',
        targetJob.unlockedBySpecialistName || 'Specialist',
        'specialist',
        targetJob.city || 'Portugal',
        `Job #${jobId} signed off by specialist.`
      );
    }
    this.saveState();
  }
  // Action: Create manual job from operator console
  public async createManualOperatorJob(
    category: ServiceCategory,
    city: string,
    specificLocation: string,
    description: string,
    customerName: string,
    customerPhone: string,
    estimatedHours: number,
    estimatedValue: number,
    leadPrice: number,
    operatorId: string,
    subcategory?: string,
    customerConfirmedValue?: boolean,
    attachments: string[] = [],
    offeredSpecialistIds: string[] = []
  ): Promise<Job> {
    const initialStatus: JobStatus = offeredSpecialistIds.length > 0 ? 'offered' : 'pending_operator';
    const newJob: Job = {
      id: `job-${Date.now()}`,
      category,
      subcategory,
      city,
      specificLocation,
      description,
      estimatedHours,
      estimatedValue,
      leadPrice,
      customerConfirmedValue: customerConfirmedValue ?? true,
      status: initialStatus,
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone,
      unlockedBySpecialistId: null,
      operatorId,
      offeredSpecialistIds: offeredSpecialistIds.length > 0 ? offeredSpecialistIds : undefined,
      attachments,
      messages: [
        {
          id: `msg-${Date.now()}-sys`,
          sender: 'system',
          senderName: 'System',
          content: `Order registered by Territory Partner from customer call. Job value: €${estimatedValue}. Lead price: €${leadPrice}. ${customerConfirmedValue ? 'Estimated price confirmed by customer.' : ''}`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({
          category,
          subcategory,
          city,
          specificLocation,
          description,
          customerName,
          customerPhone,
          attachments
        })
      });
      if (res.ok) {
        const created = await res.json();
        // Update to assign operator and initial calculated values
        await fetch(`/api/jobs/${created.id}/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
          body: JSON.stringify({
            operatorId,
            coordinatorId: operatorId,
            estimatedHours,
            estimatedValue,
            leadPrice,
            status: initialStatus,
            offeredSpecialistIds
          })
        });
        await this.syncFromServer();
        return created;
      }
    } catch (e) {
      console.error('Failed to create manual lead on server:', e);
    }
    // Local fallback
    this.state.jobs = [newJob, ...this.state.jobs];
    this.addAuditLog('Manual Job Created', customerName, 'operator', `Portugal / ${city}`, `Manual lead created by Territory Partner for ${category} (${subcategory || 'General Works'}).`);
    this.addJobTimelineEvent(newJob.id, 'Job Registered', 'Territory Partner', `Order created by dispatcher from customer phone call.`);
    this.saveState();
    return newJob;
  }
  // Action: Refund contractor and cancel the lead
  public async refundLeadFeeAndCancelJob(jobId: string, refundAmount: number, specialistId: string | null, reason: string) {
    try {
      // 1. Cancel the job status
      const res = await fetch(`/api/jobs/${jobId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ status: 'cancelled' })
      });
      // 2. Add system refund notification message in chat
      await fetch(`/api/jobs/${jobId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({
          sender: 'system',
          senderName: 'Arbitration',
          content: `🚨 DISPUTE SETTLED: Job has been CANCELLED by operator. Reason: ${reason}.` + (specialistId && refundAmount > 0 ? ` Lead fee of €${refundAmount} has been REFUNDED to the contractor's balance.` : '')
        })
      });
      // 3. Perform refund if specialist is specified
      if (specialistId && refundAmount > 0) {
        await this.topupSpecialist(specialistId, refundAmount);
      } else {
        await this.syncFromServer();
      }
      const jb = this.state.jobs.find(j => j.id === jobId);
      const opUser = this.state.users.find(u => u.id === jb?.operatorId) || this.state.currentUser;
      const opName = opUser ? opUser.name : 'Territory Partner';
      this.addAuditLog('Lead Refund Issued', opName, 'operator', 'Portugal / Algarve', `Refunded €${refundAmount} for Job #${jobId} to Specialist #${specialistId}. Reason: ${reason}`);
      this.addJobTimelineEvent(jobId, 'Dispute Settled', 'Territory Partner', `Job cancelled and €${refundAmount} lead fee refunded to contractor. Reason: ${reason}`);
      this.saveState();
      return;
    } catch (e) {
      console.error('Failed to refund and cancel job:', e);
    }
    // Local fallback
    this.state.jobs = this.state.jobs.map((job) => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'cancelled' as JobStatus,
          messages: [
            ...job.messages,
            {
              id: `msg-${Date.now()}-refund-dispute`,
              sender: 'system',
              senderName: 'Arbitration',
              content: `🚨 DISPUTE SETTLED: Job has been CANCELLED by operator. Reason: ${reason}.` + (specialistId && refundAmount > 0 ? ` Lead fee of €${refundAmount} has been REFUNDED to the contractor's balance.` : ''),
              timestamp: new Date().toISOString(),
            } as Message,
          ]
        };
      }
      return job;
    });
    if (specialistId && refundAmount > 0) {
      this.state.specialists = this.state.specialists.map((s) => {
        if (s.id === specialistId) {
          return { ...s, balance: s.balance + refundAmount };
        }
        return s;
      });
    }
    const jb = this.state.jobs.find(j => j.id === jobId);
    const opUser = this.state.users.find(u => u.id === jb?.operatorId) || this.state.currentUser;
    const opName = opUser ? opUser.name : 'Territory Partner';
    this.addAuditLog('Lead Refund Issued', opName, 'operator', 'Portugal / Algarve', `Refunded €${refundAmount} for Job #${jobId} to Specialist #${specialistId}. Reason: ${reason}`);
    this.addJobTimelineEvent(jobId, 'Dispute Settled', 'Territory Partner', `Job cancelled and €${refundAmount} lead fee refunded to contractor. Reason: ${reason}`);
    this.saveState();
  }
  // Action: Step in as arbitrator
  public async arbitrateJobDispute(jobId: string, message: string) {
    try {
      await fetch(`/api/jobs/${jobId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'operator',
          senderName: 'Territory Partner Mediator',
          content: `⚖️ REGIONAL DISPUTE RESOLUTION: ${message}`,
          channel: 'customer_specialist' // let both see this arbitration message
        })
      });
      await this.syncFromServer();
      return;
    } catch (e) {
      console.error(e);
    }
    // Fallback
    this.state.jobs = this.state.jobs.map((job) => {
      if (job.id === jobId) {
        return {
          ...job,
          messages: [
            ...job.messages,
            {
              id: `msg-${Date.now()}-arbitration`,
              sender: 'operator',
              senderName: 'Territory Partner Mediator',
              content: `⚖️ REGIONAL DISPUTE RESOLUTION: ${message}`,
              timestamp: new Date().toISOString(),
              channel: 'customer_specialist'
            } as Message,
          ]
        };
      }
      return job;
    });
    const jb = this.state.jobs.find(j => j.id === jobId);
    const opUser = this.state.users.find(u => u.id === jb?.operatorId) || this.state.currentUser;
    const opName = opUser ? opUser.name : 'Territory Partner';
    this.addAuditLog('Dispute Arbitrated', opName, 'operator', 'Portugal / Algarve', `Intervened in Job #${jobId} chat: ${message}`);
    this.addJobTimelineEvent(jobId, 'Arbitration Joined', 'Territory Partner', `Operator stepped in as mediator.`);
    this.saveState();
  }
  // Action: Propose revised job price after assessment (Specialist)
  public async proposeJobPrice(jobId: string, proposedPrice: number) {
    try {
      const res = await fetch(`/api/jobs/${jobId}/propose-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ proposedPrice })
      });
      if (res.ok) {
        await this.syncFromServer();
        return { success: true };
      }
      const data = await res.json();
      return { success: false, error: data.error };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'Network error' };
    }
  }

  // Action: Accept revised job price (Customer)
  public async acceptJobPrice(jobId: string) {
    try {
      const res = await fetch(`/api/jobs/${jobId}/accept-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({})
      });
      if (res.ok) {
        await this.syncFromServer();
        return { success: true };
      }
      const data = await res.json();
      return { success: false, error: data.error };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'Network error' };
    }
  }

  // Action: Decline revised job price / Call-out fee pending
  public async declineJobPrice(jobId: string) {
    try {
      const res = await fetch(`/api/jobs/${jobId}/decline-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({})
      });
      if (res.ok) {
        await this.syncFromServer();
        return { success: true };
      }
      const data = await res.json();
      return { success: false, error: data.error };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'Network error' };
    }
  }

  // Action: Add simulated balance to specialist
  public async topupSpecialist(specialistId: string, amount: number) {
    try {
      const res = await fetch(`/api/specialists/${specialistId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ action: 'add_balance', amount })
      });
      if (res.ok) {
        await this.syncFromServer();
        return;
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback
    this.state.specialists = this.state.specialists.map((s) => {
      if (s.id === specialistId) {
        return {
          ...s,
          balance: s.balance + amount,
        };
      }
      return s;
    });
    this.saveState();
  }
  // Action: Create Specialist Profile for demo
  public async createSpecialistProfile(
    name: string,
    phone: string,
    category: ServiceCategory,
    city: string,
    categories?: ServiceCategory[],
    languages?: { language: string; level: 'basic' | 'conversational' | 'native' }[],
    tradeSkillLevel?: 'amateur' | 'pro' | 'expert',
    skillsDescription?: string,
    photoUrl?: string,
    verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[],
    specialtiesWithLevels?: SpecialtyWithLevel[]
  ) {
    if (this.state.currentUser) {
      await this.onboardUser(
        this.state.currentUser.id,
        'specialist',
        name,
        phone,
        city,
        category,
        categories,
        languages,
        tradeSkillLevel,
        skillsDescription,
        photoUrl,
        verificationDocuments,
        specialtiesWithLevels
      );
      await this.syncFromServer();
      return;
    }
    const newSpec: Specialist = {
      id: `spec-${Date.now()}`,
      name,
      phone,
      category,
      categories: categories || [category],
      city,
      balance: 100,
      unlockedJobs: [],
      status: 'pending_review',
      languages: languages || [],
      tradeSkillLevel: tradeSkillLevel || 'amateur',
      skillsDescription: skillsDescription || '',
      photoUrl: photoUrl || '',
      verificationDocuments: verificationDocuments || [],
      specialtiesWithLevels: specialtiesWithLevels || []
    };
    this.state.specialists = [...this.state.specialists, newSpec];
    this.state.activeSpecialistId = newSpec.id;
    this.saveState();
  }
  public activateSubscription(specialistId: string, plan: import('./types').SubscriptionPlan) {
    let durationMonths = 0;
    if (plan === '1_month_free' || plan === '1_month') durationMonths = 1;
    if (plan === '3_months') durationMonths = 3;
    if (plan === '6_months') durationMonths = 6;
    if (plan === '12_months') durationMonths = 12;
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);
    this.state = {
      ...this.state,
      specialists: this.state.specialists.map(s => 
        s.id === specialistId 
          ? { ...s, subscriptionPlan: plan, subscriptionStatus: 'active', subscriptionEndDate: endDate.toISOString() } 
          : s
      )
    };
    
    if (this.state.currentUser && this.state.currentUser.id === specialistId) {
      this.state.currentUser = { 
        ...this.state.currentUser, 
        subscriptionPlan: plan, 
        subscriptionStatus: 'active', 
        subscriptionEndDate: endDate.toISOString() 
      };
    }
    
    this.saveState();
  }
  public updateMarketplaceProfile(specialistId: string, aboutMe: string, services: any[], availability: any[]) {
    this.state = {
      ...this.state,
      specialists: this.state.specialists.map(s => 
        s.id === specialistId 
          ? { ...s, aboutMe, marketplaceServices: services, marketplaceAvailability: availability } 
          : s
      )
    };
    
    if (this.state.currentUser && this.state.currentUser.id === specialistId) {
      this.state.currentUser = { 
        ...this.state.currentUser, 
        aboutMe, 
        marketplaceServices: services, 
        marketplaceAvailability: availability 
      };
    }
    
    this.saveState();
  }
  // Partner Applications
  public async submitPartnerApplication(appData: Partial<import('./types').PartnerApplication> & {
    type: 'territorial' | 'regional';
    phone: string;
    email: string;
  }) {
    try {
      const res = await fetch('/api/partner-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData)
      });
      if (res.ok) {
        await this.syncFromServer();
        return true;
      }
    } catch (e) {
      console.error('Failed to submit partner application to backend:', e);
    }
    // Local fallback
    if (!this.state.partnerApplications) this.state.partnerApplications = [];
    const constructedName = appData.fullName || `${appData.firstName || ''} ${appData.lastName || ''}`.trim();
    const newApp: import('./types').PartnerApplication = {
      ...appData,
      id: `partner-app-${Date.now()}`,
      type: appData.type,
      fullName: constructedName,
      firstName: appData.firstName || '',
      lastName: appData.lastName || '',
      dob: appData.dob || '',
      phone: appData.phone,
      email: appData.email,
      location: appData.location || 'Faro',
      country: appData.country || 'Portugal',
      languages: appData.languages || [],
      photoUrl: appData.photoUrl || '',
      currentActivity: appData.currentActivity || '',
      yearsExperience: appData.yearsExperience || '',
      experience: appData.experience || '',
      hoursPerWeek: appData.hoursPerWeek || '',
      whyPartner: appData.whyPartner || '',
      whyChooseYou: appData.whyChooseYou || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.state.partnerApplications = [newApp, ...this.state.partnerApplications];
    this.saveState();
    return true;
  }
  public async updatePartnerApplicationStatus(id: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected') {
    try {
      const res = await fetch(`/api/partner-applications/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await this.syncFromServer();
        return true;
      }
    } catch (e) {
      console.error('Failed to update partner application status:', e);
    }
    if (this.state.partnerApplications) {
      this.state.partnerApplications = this.state.partnerApplications.map(a => 
        a.id === id ? { ...a, status } : a
      );
      this.saveState();
    }
    return true;
  }
  // Wipe all databases and reset to clean state
  public async resetStore() {
    try {
      const res = await fetch('/api/reset-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() }
      });
      if (res.ok) {
        await this.syncFromServer();
      }
    } catch (e) {
      console.error('Reset DB error:', e);
    }
    this.state = {
      ...DEFAULT_STATE,
      jobs: [],
      specialists: [],
      partnerApplications: [],
      supportTickets: [],
      workspacePosts: [],
      notifications: [],
      auditLogs: [],
      suggestions: [],
      users: [...INITIAL_USERS]
    };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore storage removal error */
    }
    this.saveState();
  }
}
export const store = new AppStore();