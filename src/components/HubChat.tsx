import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { store } from '../store';
import { Send, Users, Activity } from 'lucide-react';
import { TerritorialHub, AuthUser } from '../types';

export default function HubChat({ currentUser }: { currentUser: AuthUser }) {
  const { t } = useTranslation();
  const [typedMessage, setTypedMessage] = useState('');
  const hubId = currentUser.hubId;
  const hubs = store.getState().hubs || [];
  const hub = hubs.find((h: TerritorialHub) => h.id === hubId);
  const messages = hub?.chatMessages || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !hub) return;
    
    store.addHubMessage(hub.id, {
      id: `msg-${Date.now()}`,
      sender: 'operator',
      senderName: currentUser.name,
      senderAvatar: currentUser.photoUrl || currentUser.avatar,
      content: typedMessage,
      timestamp: new Date().toISOString(),
      channel: 'hub_internal' as any,
    });
    
    setTypedMessage('');
  };

  if (!hub) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <Users className="w-12 h-12 mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-white mb-2">No Hub Assigned</h3>
        <p className="text-sm">You are not currently assigned to any active Territorial Hub.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="p-4 border-b border-blue-900/30 bg-[#0A1128] flex items-center gap-4">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Activity className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white leading-tight">{hub.name}</h3>
          <p className="text-xs text-emerald-400 font-mono tracking-widest uppercase">Internal Comm Link</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#050B1B]">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono">
            No messages in this hub yet. Say hello to your team!
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderName === currentUser.name;
            return (
              <div key={msg.id} className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                <span className="text-[10px] text-slate-500 font-bold mb-1 px-1 font-mono uppercase tracking-wider">
                  {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className={`px-4 py-2 rounded-xl text-sm ${isMe ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'}`}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-blue-900/30 bg-[#0A1128] flex gap-2">
        <input
          type="text"
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          placeholder="Message your hub team..."
          className="flex-1 bg-slate-950 border border-blue-900/50 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!typedMessage.trim()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
