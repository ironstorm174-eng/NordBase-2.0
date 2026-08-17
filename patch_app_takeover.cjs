const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const bannerCode = `      {/* Sticky SuperAdmin Live Control Mode Banner */}
      {state.impersonatedUser && (
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 text-white px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-between z-[100] sticky top-0 font-bold text-xs sm:text-sm border-b border-amber-400/40">
          <div className="flex items-center gap-3">
            <span className="bg-black/40 px-2.5 py-1 rounded-lg font-mono uppercase tracking-widest text-amber-300 border border-amber-400/30 flex items-center gap-1.5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              ⚡ SuperAdmin Live Control Mode
            </span>
            <span className="text-white">
              Managing Dashboard: <strong className="font-mono text-amber-200 text-sm sm:text-base">{state.impersonatedUser.dashboardNumber || state.impersonatedUser.id}</strong>
              <span className="opacity-90 ml-2 font-normal hidden md:inline">
                ({state.impersonatedUser.name} • {state.impersonatedUser.role === 'regional_admin' ? 'Regional Director' : 'Territory Partner'} • {state.impersonatedUser.region || state.impersonatedUser.city || 'Portugal'})
              </span>
            </span>
          </div>
          <button
            onClick={() => {
              store.stopImpersonation();
              setState({ ...store.getState() });
            }}
            className="bg-white hover:bg-amber-100 text-slate-950 font-black px-4 py-1.5 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>← Вернуться в Главную Панель (/01 SuperAdmin)</span>
          </button>
        </div>
      )}
`;

content = content.replace(
  '      <header className="sticky top-0 z-40',
  bannerCode + '\n      <header className="sticky top-0 z-40'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched App.tsx with live takeover banner');
