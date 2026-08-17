const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

// 1. Add icons Zap, Key, Eye to lucide-react import
content = content.replace(
  '  Sparkles,\n} from "lucide-react";',
  '  Sparkles,\n  Zap,\n  Key,\n  Eye,\n} from "lucide-react";'
);

// 2. Add takeover input state inside SuperAdminDashboard component
const takeoverStateCode = `  const [takeoverInput, setTakeoverInput] = useState("");

  const handleTakeoverByNumber = (dashNum: string) => {
    if (!dashNum.trim()) return;
    store.impersonateByDashboardNumber(dashNum.trim());
  };
`;

content = content.replace(
  '  const [selectedRDCode, setSelectedRDCode] = useState<string | null>("Pt-RD-001");',
  '  const [selectedRDCode, setSelectedRDCode] = useState<string | null>("Pt-RD-001");\n' + takeoverStateCode
);

// 3. Add Quick Dashboard Takeover Panel above tabs
const takeoverPanel = `
      {/* QUICK DASHBOARD CONTROL & TAKEOVER PANEL */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
              <Key className="w-4 h-4 text-cyan-400" /> Direct Dashboard Override & Command
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Управление дашбордами TP и RP (Dashboard Takeover)
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Введите номер дашборда (например: <code className="text-cyan-300 font-mono">PT-RD-001</code>, <code className="text-cyan-300 font-mono">PT-RD-002</code>, <code className="text-cyan-300 font-mono">PT-OP-001</code>) или выберите любой дашборд для прямого переключения в режиме Суперадмина.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                value={takeoverInput}
                onChange={(e) => setTakeoverInput(e.target.value)}
                placeholder="Например: PT-RD-001 или PT-OP-001"
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && takeoverInput.trim()) {
                    handleTakeoverByNumber(takeoverInput.trim());
                  }
                }}
              />
            </div>
            <button
              onClick={() => {
                if (takeoverInput.trim()) {
                  handleTakeoverByNumber(takeoverInput.trim());
                }
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-95 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Переключить на себя</span>
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Быстрый вход в сети RP / TP:</span>
          {[
            { code: 'Pt-RD-001', name: 'Big Lisboa' },
            { code: 'Pt-RD-002', name: 'Lisboa City' },
            { code: 'Pt-RD-003', name: 'Porto Network' },
            { code: 'Pt-RD-004', name: 'Algarve Network' }
          ].map(rd => (
            <button
              key={rd.code}
              onClick={() => handleTakeoverByNumber(rd.code)}
              className="bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400 font-mono">{rd.code}</span>
              <span>• {rd.name}</span>
            </button>
          ))}
        </div>
      </div>
`;

content = content.replace(
  '      {/* VIEW 1: NETWORK OVERVIEW */}',
  takeoverPanel + '\n      {/* VIEW 1: NETWORK OVERVIEW */}'
);

// 4. Add Takeover Button inside each RD Card
const rdTakeoverButton = `
                        {/* Takeover Dashboard Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTakeoverByNumber(rd.id);
                          }}
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                          title="Полное управление дашбордом RP"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Управлять ({rd.id})</span>
                        </button>
`;

content = content.replace(
  '                        {/* Revenue Indicator */}',
  rdTakeoverButton + '\n                        {/* Revenue Indicator */}'
);

// 5. Add Takeover button in Partners Table
const partnerTakeoverBtn = `                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                store.impersonateUser(u);
                              }}
                              className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/40 rounded-lg px-3 py-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
                              title="Управлять дашбордом (Переключить на себя)"
                            >
                              <Zap className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="hidden xl:inline">Управлять</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCallToChat(u.id);
                              }}`;

content = content.replace(
  `                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCallToChat(u.id);
                              }}`,
  partnerTakeoverBtn
);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content);
console.log('Patched SuperAdminDashboard.tsx with Takeover UI');
