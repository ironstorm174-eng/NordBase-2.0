const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

// I will just use regex to replace both occurrences properly
// The occurrences are:
// <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
// ... left side ...
// ... right side map ...
// </div>
// Followed by {/* Highlights Banner */}

const regex = /<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">[\s\S]*?{ \/\* ========================================================= \*\/ }/g;

// Actually let's just find the extra </div> in TP and fix it.
// And then apply the same replacement to RP slide 0.

code = code.replace(/                  <\/div>\n                  <\/div>\n\n                  {\/\* Highlights Banner \*\/}/g, 
                    '                  </div>\n\n                  {/* Highlights Banner */}');

// Now let's remove the map from RP slide.
const rpIntroIdx = code.indexOf('INTRO 01 • CONNECTING PEOPLE', code.indexOf('rpSlide === 0'));
if (rpIntroIdx !== -1) {
    const gridStart = code.indexOf('<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">', rpIntroIdx);
    if (gridStart !== -1) {
        const gridEnd = code.indexOf('                  {/* Highlights Banner */}', gridStart);
        if (gridEnd !== -1) {
            const oldGrid = code.substring(gridStart, gridEnd);
            const newGrid = `                  <div className="flex flex-col gap-8">
                    {/* Left side text */}
                    <div className="space-y-6 max-w-4xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" /> Portimão & Lisbon • Portugal
                      </div>

                      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white tracking-tight leading-tight">
                        {lang === 'ru' ? (
                          <>
                            NordBase — Доверенная Платформа Локальных Услуг и <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">Сообщество Предпринимателей</span>
                          </>
                        ) : (
                          <>
                            NordBase — Trusted Service Ecosystem & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">Entrepreneur Network</span>
                          </>
                        )}
                      </h1>

                      <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-3xl">
                        {lang === 'ru'
                          ? 'NordBase объединяет жителей, экспатов, проверенных специалистов и муниципалитеты в единую экосистему. Мы помогаем людям быстро находить надежную помощь, а предпринимателям — строить устойчивый локальный бизнес.'
                          : 'NordBase connects residents, newcomers, verified professionals, and local municipalities into one trusted ecosystem through human support and smart tools.'}
                      </p>

                      {/* 4 Connected Audience Pill Badges */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-3xl">
                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-blue-500/30 flex items-center gap-3 text-sm text-slate-200 shadow-lg">
                          <Users className="w-5 h-5 text-blue-400 shrink-0" />
                          <span className="font-bold">{lang === 'ru' ? 'Жители' : 'Residents'}</span>
                        </div>
                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-cyan-500/30 flex items-center gap-3 text-sm text-slate-200 shadow-lg">
                          <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
                          <span className="font-bold">{lang === 'ru' ? 'Экспаты' : 'Expats'}</span>
                        </div>
                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-teal-500/30 flex items-center gap-3 text-sm text-slate-200 shadow-lg">
                          <Briefcase className="w-5 h-5 text-teal-400 shrink-0" />
                          <span className="font-bold">{lang === 'ru' ? 'Специалисты' : 'Specialists'}</span>
                        </div>
                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-purple-500/30 flex items-center gap-3 text-sm text-slate-200 shadow-lg">
                          <Building2 className="w-5 h-5 text-purple-400 shrink-0" />
                          <span className="font-bold">{lang === 'ru' ? 'Муниципалитеты' : 'Municipalities'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
\n`;
            code = code.replace(oldGrid, newGrid);
        }
    }
}

fs.writeFileSync('src/components/PitchDeck.tsx', code);
console.log("Fixed extra div and removed RP map.");
