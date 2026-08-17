const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// The block we want to replace is from {/* --- TAB CONTENT: OPERATORS --- */} to {/* --- TAB CONTENT: INCIDENTS --- */}
const startIdx = code.indexOf("{/* --- TAB CONTENT: OPERATORS --- */}");
const endIdx = code.indexOf("{/* --- TAB CONTENT: INCIDENTS --- */}");

if (startIdx !== -1 && endIdx !== -1) {
  const realRegion = "currentUser?.region || currentAdmin.coverage[0] || 'Global'";
  
  const replacement = `      {/* --- TAB CONTENT: OPERATORS --- */}
      {activeTab === 'operators' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#060E21] border border-blue-900/30 rounded-2xl p-5 text-left shadow-xl">
            <div className="flex items-center justify-between border-b border-blue-900/15 pb-4 mb-4">
              <div>
                <h3 className="text-base font-black text-white font-display">Regional Operators Directory</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage operators in your region (\${currentUser?.region || 'All'}). You can edit their passwords here.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-blue-900/25 text-slate-400 font-mono">
                    <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Name / Contact</th>
                    <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Region</th>
                    <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Dash No.</th>
                    <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Password</th>
                    <th className="pb-3 text-right font-bold uppercase tracking-wider text-[10px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/10">
                  {users
                    .filter(u => u.role === 'operator')
                    .filter(u => {
                       const myRegion = currentUser?.region || 'Global';
                       if (myRegion === 'Global' || myRegion === 'All') return true;
                       return u.region === myRegion;
                    })
                    .map(op => (
                    <tr key={op.id} className="hover:bg-slate-950/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="text-left">
                            <p className="font-bold text-white text-xs">{op.name || 'Unnamed'}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{op.email}</p>
                            {(op.phone || op.whatsapp || op.telegram) && (
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                {op.phone && \`\uD83D\uDCDE \${op.phone} \`}
                                {op.whatsapp && \`💬 WA: \${op.whatsapp} \`}
                                {op.telegram && \`✈️ TG: \${op.telegram}\`}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-slate-300 font-mono text-[11px]">{op.region || '-'}</td>
                      <td className="py-4 text-slate-300 font-mono text-[11px]">{op.dashboardNumber || '-'}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            defaultValue={op.password || ''} 
                            className="bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 w-24"
                            onBlur={(e) => {
                              if (e.target.value !== op.password && onUpdateUsers) {
                                const updated = users.map(u => u.id === op.id ? { ...u, password: e.target.value } : u);
                                onUpdateUsers(updated);
                              }
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => {
                            setActiveTab('inbox');
                            setActiveChat({
                              targetId: op.id,
                              targetName: op.name || op.email,
                              targetRole: 'Operator',
                              targetEmail: op.email,
                              messages: []
                            });
                          }} 
                          className="bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-900 p-2 rounded transition-colors"
                          title="Call to chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.filter(u => u.role === 'operator' && (currentUser?.region === 'Global' || currentUser?.region === 'All' || u.region === currentUser?.region)).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">No operators found in your region.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

`;
  
  code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
  fs.writeFileSync('src/components/AdminDashboard.tsx', code);
  console.log('Operators tab replaced.');
}

