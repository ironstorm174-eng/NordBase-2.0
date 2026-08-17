const fs = require('fs');

let content = fs.readFileSync('src/components/OperatorDashboard.tsx', 'utf8');

// Add inbox state
content = content.replace(
  "const [activePortalTab, setActivePortalTab] = useState<'customers' | 'specialists' | 'regional_admin' | 'academy'>('customers');",
  "const [activePortalTab, setActivePortalTab] = useState<'customers' | 'specialists' | 'regional_admin' | 'academy' | 'inbox'>('customers');\n" +
  "  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);\n" +
  "  const [chatMessage, setChatMessage] = useState('');\n" +
  "  const [localChats, setLocalChats] = useState<Record<string, { sender: string; text: string; time: string }[]>>({});\n" +
  "  const { users = [] } = store.getState();\n" +
  "  const chatContacts = users.filter(u => u.role === 'super_admin' || u.role === 'regional_admin' || (u.role === 'operator' && u.id !== currentUser?.id));\n" +
  "  const selectedChatUser = chatContacts.find(u => u.id === activeChatUserId);\n" +
  "  const selectedChatMessages = activeChatUserId ? localChats[activeChatUserId] || [] : [];\n" +
  "  const handleSendChatMessage = () => {\n" +
  "    if (!activeChatUserId || !chatMessage.trim()) return;\n" +
  "    const newMsg = { sender: 'me', text: chatMessage, time: new Date().toLocaleTimeString() };\n" +
  "    setLocalChats(prev => ({ ...prev, [activeChatUserId]: [...(prev[activeChatUserId] || []), newMsg] }));\n" +
  "    setChatMessage('');\n" +
  "  };\n"
);

// Add import for Inbox and Send icon
content = content.replace(
  "Briefcase,",
  "Briefcase, Inbox, Send,"
);

// Add tab button
content = content.replace(
  "<button\n          onClick={() => setActivePortalTab('academy')}",
  "<button\n          onClick={() => setActivePortalTab('inbox')}\n          className={`flex-1 py-3 text-xs font-display font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${\n            activePortalTab === 'inbox'\n              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'\n              : 'text-slate-400 hover:text-white hover:bg-slate-900/40'\n          }`}\n        >\n          <Inbox className=\"w-4 h-4\" />\n          <span>Inbox & Chat</span>\n        </button>\n        <button\n          onClick={() => setActivePortalTab('academy')}"
);

// Add the inbox UI at the end before </main>
const inboxUI = `
      {activePortalTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
          {/* Chat List */}
          <div className="bg-[#0A1128]/70 border border-blue-900/30 rounded-3xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-blue-900/30 bg-[#0A1128]">
              <h3 className="font-bold text-white font-display">Directory</h3>
              <p className="text-xs text-slate-400">Chat with Admins & Partners</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {chatContacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => setActiveChatUserId(contact.id)}
                  className={\`w-full flex items-center gap-3 p-3 rounded-2xl transition-all \${activeChatUserId === contact.id ? 'bg-blue-600/20 border border-blue-500/50 text-blue-200' : 'hover:bg-blue-900/20 text-slate-300 border border-transparent'}\`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left overflow-hidden">
                    <div className="font-bold truncate text-sm">{contact.name || contact.email}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">
                      {contact.role === 'super_admin' ? 'Super Admin' : contact.role === 'regional_admin' ? 'Regional Partner' : 'Territory Partner'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Chat Area */}
          <div className="lg:col-span-3 bg-[#0A1128]/95 border border-blue-900/30 rounded-3xl overflow-hidden flex flex-col">
            {selectedChatUser ? (
              <>
                <div className="p-4 border-b border-blue-900/30 bg-[#0A1128] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-950 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{selectedChatUser.name}</h3>
                    <div className="text-xs text-slate-400">{selectedChatUser.email}</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col" id="op-chat-history">
                  {selectedChatMessages.length === 0 ? (
                    <div className="m-auto text-slate-500 text-sm">No messages yet.</div>
                  ) : (
                    selectedChatMessages.map((msg, i) => (
                      <div key={i} className={\`flex flex-col max-w-[70%] \${msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'}\`}>
                        <div className={\`px-4 py-3 rounded-2xl text-sm shadow-md \${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}\`}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 bg-[#0A1128] border-t border-blue-900/30">
                  <div className="flex gap-2">
                    <input
                      maxLength={2000}
                      type="text"
                      value={chatMessage}
                      onChange={e => setChatMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()}
                      placeholder="Type your message..."
                      className="flex-1 bg-slate-900 border border-blue-900/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={handleSendChatMessage}
                      disabled={!chatMessage.trim()}
                      className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl px-6 font-bold flex items-center justify-center transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="m-auto text-slate-500 text-sm flex flex-col items-center">
                <Inbox className="w-16 h-16 text-slate-800 mb-4" />
                Select a contact from the directory to start chatting
              </div>
            )}
          </div>
        </div>
      )}
`;

content = content.replace("    </main>", inboxUI + "\n    </main>");

fs.writeFileSync('src/components/OperatorDashboard.tsx', content);
