/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { AuthUser, Job, SupportTicket, UserRole } from '../types';
export interface ChatAttachment {
  id: string;
  url: string;
  type: 'image' | 'document';
  filename: string;
  size: number;
  uploadedByRole: UserRole;
  createdAt: string;
  channel?: 'customer_operator' | 'operator_specialist' | 'operator_operator' | 'customer_specialist';
}
/**
 * 1. Checks if a message can be sent from a sender to a receiver in a given context (Job or System scope).
 */
export function canSendMessage(
  senderRole: UserRole,
  receiverRole: UserRole,
  context: {
    scope: 'job' | 'system';
    jobStatus?: Job['status'];
    channel?: 'customer_operator' | 'operator_specialist' | 'operator_operator' | 'customer_specialist';
  }
): boolean {
  // Territorial Partner (SuperAdmin) and Regional Partner can always send any message
  if (senderRole === 'super_admin' || senderRole === 'regional_admin') {
    return true;
  }
  if (context.scope === 'job') {
    const channel = context.channel || 'customer_operator';
    // Territory Partner in Job scope
    if (senderRole === 'operator') {
      // Territory Partner can message anyone inside job scope
      return true;
    }
    // Customer in Job scope
    if (senderRole === 'customer') {
      if (channel === 'customer_operator') {
        return receiverRole === 'operator';
      }
      if (channel === 'customer_specialist') {
        // Customer can only contact specialist directly if the job is active or completed (unlocked)
        return receiverRole === 'specialist' && (context.jobStatus === 'active' || context.jobStatus === 'completed');
      }
      return false;
    }
    // Specialist in Job scope
    if (senderRole === 'specialist') {
      if (channel === 'operator_specialist') {
        return receiverRole === 'operator';
      }
      if (channel === 'customer_specialist') {
        // Specialist can only contact customer directly if the job is active or completed (unlocked)
        return receiverRole === 'customer' && (context.jobStatus === 'active' || context.jobStatus === 'completed');
      }
      return false;
    }
    return false;
  }
  // System scope (helpdesk tickets, escalation etc.)
  if (context.scope === 'system') {
    // Customers and Specialists can talk to Admin/Operator
    if (senderRole === 'specialist' || senderRole === 'customer') {
      return receiverRole === 'regional_admin' || receiverRole === 'super_admin' || receiverRole === 'operator';
    }
    // Operators can talk to Admin, Territorial Partner, Specialists, and Customers
    if (senderRole === 'operator') {
      return true;
    }
  }
  return false;
}
/**
 * 2. Checks if a user has access to view a specific chat or specific channel/ticket within.
 */
export function canViewChat(
  user: AuthUser,
  chat: {
    type: 'job' | 'ticket';
    job?: Job;
    ticket?: SupportTicket;
    channel?: 'customer_operator' | 'operator_specialist' | 'operator_operator' | 'customer_specialist';
  }
): boolean {
  const role = user.role;
  // Territorial Partner (SuperAdmin) and Regional Partner can view all chats and channels
  if (role === 'super_admin' || role === 'regional_admin') {
    return true;
  }
  // Operators can view all chats and channels (intermediary and dispatcher role)
  if (role === 'operator') {
    return true;
  }
  if (chat.type === 'job' && chat.job) {
    const job = chat.job;
    const channel = chat.channel || 'customer_operator';
    // Customer specific permissions
    if (role === 'customer') {
      const isOwner = job.customerPhone === user.phone || job.customerName === user.name;
      if (!isOwner) return false;
      // Customers can only see Customer <-> Territory Partner and Customer <-> Specialist (when unlocked)
      if (channel === 'customer_operator') {
        return true;
      }
      if (channel === 'customer_specialist') {
        return job.status === 'active' || job.status === 'completed';
      }
      return false; // Customer cannot see operator internal chats or specialist-operator chats
    }
    // Specialist specific permissions
    if (role === 'specialist') {
      const isMatchedSpecialist = job.unlockedBySpecialistId === user.id;
      const isOffered = job.offeredSpecialistIds?.includes(user.id) || job.interestedSpecialistIds?.includes(user.id);
      if (!isMatchedSpecialist && !isOffered) {
        return false;
      }
      // If they are just offered but NOT matched/unlocked, they can't see the chat messages yet
      if (!isMatchedSpecialist) {
        return false;
      }
      // Vetted specialist who unlocked the job can see Territory Partner <-> Specialist and Customer <-> Specialist channels
      if (channel === 'operator_specialist') {
        return true;
      }
      if (channel === 'customer_specialist') {
        return job.status === 'active' || job.status === 'completed';
      }
      return false; // Specialist cannot see Territory Partner <-> Customer or Territory Partner internal chats
    }
  }
  if (chat.type === 'ticket' && chat.ticket) {
    const ticket = chat.ticket;
    // Tickets are viewable by admins/operators and the owner of the ticket
    return ticket.userId === user.id;
  }
  return false;
}
/**
 * 3. Checks if a user has access to view a specific attachment.
 * Attachments inherit permissions from: chat scope, job status, sender role, receiver role rules.
 */
export function canViewAttachment(
  user: AuthUser,
  attachment: ChatAttachment | { url: string; channel?: any },
  job: Job
): boolean {
  // Inherit from chat view permissions!
  const channel = attachment.channel || 'customer_operator';
  return canViewChat(user, {
    type: 'job',
    job,
    channel,
  });
}