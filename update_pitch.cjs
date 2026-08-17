const fs = require('fs');

let content = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

const replacementBlock = `
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-black text-cyan-300 font-mono">
                        02
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        INTRO 02 • {lang === 'ru' ? 'ПРОБЛЕМА' : 'THE PROBLEM'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 max-w-5xl mt-4">
                    <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
                      {lang === 'ru' ? 'Проблема, которую мы решаем' : 'The Problem We Solve'}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 flex-1">
                    <div className="p-5 sm:p-6 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col justify-center space-y-4">
                       <ul className="space-y-5 text-sm sm:text-base text-slate-300 font-medium">
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Жителям сложно быстро найти надежного специалиста.' : 'It is hard for residents to quickly find a reliable specialist.'}</span>
                         </li>
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Специалисты постоянно ищут новых клиентов.' : 'Specialists are constantly looking for new clients.'}</span>
                         </li>
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Рынок городских услуг остается разрозненным и неэффективным.' : 'The urban services market remains fragmented and inefficient.'}</span>
                         </li>
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Малый бизнес вынужден самостоятельно заниматься продвижением.' : 'Small businesses are forced to handle promotion entirely on their own.'}</span>
                         </li>
                         <li className="flex items-start gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{lang === 'ru' ? 'Большинство цифровых сервисов помогают искать услуги, но не развивают местные предпринимательские сообщества.' : 'Most digital services help find services, but do not develop local business communities.'}</span>
                         </li>
                       </ul>
                    </div>
                    <div className="p-6 bg-cyan-950/20 rounded-2xl border border-cyan-500/30 flex flex-col justify-center space-y-6">
                       <div>
                         <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
                            <AlertTriangle className="w-6 h-6" />
                         </div>
                         <p className="text-xl sm:text-2xl text-white font-bold leading-snug">
                           {lang === 'ru' 
                             ? 'В результате теряют все участники рынка.' 
                             : 'As a result, all market participants lose.'}
                         </p>
                       </div>
                       
                       <div className="pt-4 border-t border-cyan-500/30">
                         <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                            <CheckCircle className="w-6 h-6" />
                         </div>
                         <p className="text-xl sm:text-2xl text-cyan-300 leading-snug font-bold">
                           {lang === 'ru' 
                             ? 'Нужна новая модель — цифровая платформа, которая объединяет, поддерживает и развивает предпринимателей каждого города.' 
                             : 'We need a new model — a digital platform that unites, supports, and develops entrepreneurs in every city.'}
                         </p>
                       </div>
                    </div>
                  </div>
                </div>`;

const tpRegex = /\{tpSlide === 1 && \([\s\S]*?\}\) \/\* end of tpSlide 1 \*\//;
// Let's do it with specific index finding.

function replaceBlock(str, startMarker, endMarker, replacement) {
  const start = str.indexOf(startMarker);
  if (start === -1) {
    console.log("Start marker not found:", startMarker);
    return str;
  }
  const end = str.indexOf(endMarker, start);
  if (end === -1) {
    console.log("End marker not found:", endMarker);
    return str;
  }
  return str.substring(0, start) + replacement + str.substring(end + endMarker.length);
}

const tpStart = "{tpSlide === 1 && (";
const tpEndMarker = "              {/* ========================================================= */}\n              {/* SLIDE 03:";
const tpReplacement = `{tpSlide === 1 && (\n${replacementBlock}\n              )}\n              {/* ========================================================= */}\n              {/* SLIDE 03:`;

content = replaceBlock(content, tpStart, tpEndMarker, tpReplacement);

const rpStart = "{rpSlide === 1 && (";
const rpEndMarker = "              {/* ========================================================= */}\n              {/* SLIDE 03:";

const rpReplacementBlock = replacementBlock.replace(/bg-cyan-/g, "bg-blue-").replace(/text-cyan-/g, "text-blue-").replace(/border-cyan-/g, "border-blue-");

const rpReplacement = `{rpSlide === 1 && (\n${rpReplacementBlock}\n              )}\n              {/* ========================================================= */}\n              {/* SLIDE 03:`;

content = replaceBlock(content, rpStart, rpEndMarker, rpReplacement);

fs.writeFileSync('src/components/PitchDeck.tsx', content);
