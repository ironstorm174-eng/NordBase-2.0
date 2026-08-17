const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

const rpFeePerLead = '(rpAvgLeadPrice * 0.20)';
const rpDailyIncome = `(${rpFeePerLead} * rpActiveHubs * rpLeadsPerHub)`;
const rpMonthlyIncome = `(${rpDailyIncome} * 30)`;
const rpAnnualIncome = `(${rpMonthlyIncome} * 12)`;

const detailedCalculator = `
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sliders (Col 7) */}
                    <div className="lg:col-span-7 space-y-6 bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="font-mono font-bold text-blue-400 text-sm">{lang === 'ru' ? 'Параметры RP-Региона:' : 'RP Region Parameters:'}</span>
                        <span className="text-xxs text-slate-400 font-mono">{lang === 'ru' ? 'Интерактивные ползунки' : 'Interactive Sliders'}</span>
                      </div>

                      {/* Slider 1: Active Hubs */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-300">
                            {lang === 'ru' ? 'Активных хабов (TP) в регионе:' : 'Active Hubs (TPs) in Region:'}
                          </span>
                          <span className="text-blue-400 font-mono text-lg">{rpActiveHubs}</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="20"
                          step="1"
                          value={rpActiveHubs}
                          onChange={(e) => setRpActiveHubs(parseInt(e.target.value))}
                          className="w-full accent-blue-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                        />
                        <div className="flex justify-between text-xxs text-slate-500 font-mono">
                          <span>2 (Старт)</span>
                          <span>8 (Средний)</span>
                          <span>20 (Максимум)</span>
                        </div>
                      </div>

                      {/* Slider 2: Average daily leads per hub */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-300">
                            {lang === 'ru' ? 'Среднее число лидов на хаб в день:' : 'Average daily leads per hub:'}
                          </span>
                          <span className="text-blue-400 font-mono text-lg">{rpLeadsPerHub} {lang === 'ru' ? 'лидов/день' : 'leads/day'}</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="150"
                          step="5"
                          value={rpLeadsPerHub}
                          onChange={(e) => setRpLeadsPerHub(parseInt(e.target.value))}
                          className="w-full accent-blue-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                        />
                        <div className="flex justify-between text-xxs text-slate-500 font-mono">
                          <span>10 (Мин)</span>
                          <span>50 (Средний)</span>
                          <span>150 (Топ)</span>
                        </div>
                      </div>

                      {/* Slider 3: Average Lead Price */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-300">
                            {lang === 'ru' ? 'Средняя стоимость лида (€):' : 'Average lead price (€):'}
                          </span>
                          <span className="text-blue-400 font-mono text-lg">€{rpAvgLeadPrice.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="10.0"
                          max="30.0"
                          step="0.5"
                          value={rpAvgLeadPrice}
                          onChange={(e) => setRpAvgLeadPrice(Number(e.target.value))}
                          className="w-full accent-blue-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                        />
                        <div className="flex justify-between text-xxs text-slate-500 font-mono">
                          <span>€10.00 (Минимум)</span>
                          <span>€15.00 (Стандарт)</span>
                          <span>€30.00 (Премиум)</span>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-950/30 border border-blue-500/20 rounded-xl text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-blue-300 block">💡 {lang === 'ru' ? 'Комиссия Regional Partner:' : 'Regional Partner Commission:'}</span>
                        <p className="text-slate-400 text-xxs leading-relaxed">
                          {lang === 'ru'
                            ? 'RP получает пассивный доход в размере 20% от стоимости всех лидов, обработанных хабами (TP) в его регионе. Расчет предполагает непрерывную работу хабов (30 дней в месяц).'
                            : 'RP receives a passive income of 20% from the value of all leads processed by hubs (TPs) in their region. The calculation assumes continuous hub operations (30 days/month).'}
                        </p>
                      </div>
                    </div>

                    {/* Results Card (Col 5) */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-slate-950 via-blue-950/40 to-slate-950 p-6 rounded-2xl border-2 border-blue-500/50 space-y-6 flex flex-col justify-between shadow-2xl">
                      <div className="space-y-4">
                        <span className="text-xs font-mono font-bold uppercase text-blue-400 tracking-wider block">
                          {lang === 'ru' ? 'Прогноз пассивного дохода RP' : 'RP Passive Income Forecast'}
                        </span>
                        
                        <div className="space-y-1 border-b border-slate-800 pb-3">
                          <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Ваш доход с 1 лида (20%):' : 'Your earn per lead (20%):'}</span>
                          <span className="text-2xl font-black text-white font-mono">€{${rpFeePerLead}.toFixed(2)}</span>
                        </div>
                        
                        <div className="space-y-1 border-b border-slate-800 pb-3">
                          <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Ежедневный доход со всех хабов:' : 'Daily income from all hubs:'}</span>
                          <span className="text-2xl font-black text-white font-mono">€{${rpDailyIncome}.toFixed(2)}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Ежемесячный доход (30 дней):' : 'Monthly Income (30 days):'}</span>
                          <div className="text-4xl font-black text-blue-300 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            €{${rpMonthlyIncome}.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            <span className="text-xs text-slate-400 font-sans font-normal ml-2">/ {lang === 'ru' ? 'месяц' : 'month'}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1 pt-2 border-t border-slate-800">
                          <span className="text-xs text-slate-400 block">{lang === 'ru' ? 'Годовой потенциал RP:' : 'Annual Potential RP:'}</span>
                          <span className="text-xl font-black text-emerald-400 font-mono">
                            €{${rpAnnualIncome}.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / {lang === 'ru' ? 'год' : 'year'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Growth Stages */}
                      <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2 font-mono">
                        <div className="flex justify-between">
                          <span>{lang === 'ru' ? 'Старт (2 хаба по 15 лидов):' : 'Start (2 hubs x 15 leads):'}</span>
                          <span className="text-emerald-400 font-bold">~ €{(2 * 15 * 10.0 * 0.2 * 30).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} / мес</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'ru' ? 'Средний (5 хабов по 30 лидов):' : 'Medium (5 hubs x 30 leads):'}</span>
                          <span className="text-emerald-400 font-bold">~ €{(5 * 30 * 10.0 * 0.2 * 30).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} / мес</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'ru' ? 'Топ (20 хабов по 100 лидов):' : 'Top (20 hubs x 100 leads):'}</span>
                          <span className="text-emerald-400 font-bold">~ €{(20 * 100 * 10.0 * 0.2 * 30).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} / мес</span>
                        </div>
                      </div>
                    </div>
                  </div>
`;

// Now find the original calculator grid and replace it
const startTag = '<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">';
const endTag = '</div>\n                  </div>\n                </div>\n              )}';

const startIdx = code.indexOf(startTag);
if (startIdx !== -1) {
    let nextEndSlideIdx = code.indexOf('{/* SLIDE 07: OPERATIONAL MANDATES */}', startIdx);
    if (nextEndSlideIdx === -1) {
       console.log("Could not find end of slide 6");
    } else {
       // Search backwards from nextEndSlideIdx to find the closing tag of the slide 6
       let replacementEnd = code.lastIndexOf('</div>\n              )}', nextEndSlideIdx);
       if (replacementEnd !== -1) {
           code = code.substring(0, startIdx) + detailedCalculator + code.substring(replacementEnd);
           fs.writeFileSync('src/components/PitchDeck.tsx', code);
           console.log("Detailed RP calculator injected.");
       } else {
           console.log("Could not find replacement end");
       }
    }
} else {
    console.log("Start tag not found.");
}
