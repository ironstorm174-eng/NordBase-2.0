const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

const level2Start = code.indexOf('LEVEL 2: PITCH DECK FOR REGIONAL PARTNERS');
const slide5Start = code.indexOf('{/* SLIDE 06: BUSINESS MODEL & UNIT ECONOMICS */}', level2Start);
const level3Start = code.indexOf('{/* LEVEL 3: INVESTOR PITCH DECK');

if (slide5Start !== -1 && level3Start !== -1) {
    const newSlides = `
              {/* ========================================================= */}
              {/* SLIDE 06: FINANCIAL CALCULATOR */}
              {/* ========================================================= */}
              {rpSlide === 5 && (
                <div className="flex-1 flex flex-col p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 font-black flex items-center justify-center font-mono">
                        06
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                        FINANCIAL CALCULATOR • КАЛЬКУЛЯТОР ДОХОДА RP
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Live Projections</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
                    {/* Left: Input */}
                    <div className="lg:col-span-5 space-y-8">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-300">
                          {lang === 'ru' ? 'Хабов в вашем регионе (TP)' : 'Active Hubs (TPs) in your Region'}
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="2"
                            max="20"
                            step="1"
                            value={rpActiveHubs}
                            onChange={(e) => setRpActiveHubs(parseInt(e.target.value))}
                            className="w-full accent-blue-500"
                          />
                          <span className="font-mono text-xl text-blue-400 font-bold w-12 text-right">{rpActiveHubs}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-300">
                          {lang === 'ru' ? 'Среднее число лидов на хаб в день' : 'Average daily leads per hub'}
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="10"
                            max="150"
                            step="5"
                            value={rpLeadsPerHub}
                            onChange={(e) => setRpLeadsPerHub(parseInt(e.target.value))}
                            className="w-full accent-blue-500"
                          />
                          <span className="font-mono text-xl text-blue-400 font-bold w-12 text-right">{rpLeadsPerHub}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Output */}
                    <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-8 flex flex-col justify-center gap-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <span className="text-sm text-slate-400 font-mono">{lang === 'ru' ? 'Всего лидов / мес' : 'Total Leads / Mo'}</span>
                          <div className="text-4xl font-black text-white font-mono">
                            {(rpActiveHubs * rpLeadsPerHub * 30).toLocaleString()}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm text-slate-400 font-mono">{lang === 'ru' ? 'Доход RP (20%) / мес' : 'RP Revenue (20%) / Mo'}</span>
                          <div className="text-5xl font-black text-emerald-400 font-mono">
                            €{(((rpActiveHubs * rpLeadsPerHub * 30 * rpAvgLeadPrice) * 0.20)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">
                        {lang === 'ru' ? '* Расчет основан на среднем чеке лида €' + rpAvgLeadPrice + '. RP получает 20% комиссии.' : '* Calculation based on average lead fee of €' + rpAvgLeadPrice + '. RP receives 20% commission.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SLIDE 07: OPERATIONAL MANDATES */}
              {/* ========================================================= */}
              {rpSlide === 6 && (
                <div className="flex-1 flex flex-col p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-8 shadow-2xl relative overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 font-black flex items-center justify-center font-mono">
                        07
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                        KEY RESPONSIBILITIES • КЛЮЧЕВЫЕ ОБЯЗАННОСТИ RP
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Regional Management</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-950/80 rounded-2xl border border-blue-500/20 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">1</span>
                        <h3 className="font-bold text-white text-lg">
                          {lang === 'ru' ? 'Развитие Сети TP' : 'TP Network Expansion'}
                        </h3>
                      </div>
                      <p className="text-slate-400 text-sm">
                        {lang === 'ru'
                          ? 'Поиск, переговоры и подключение операторов новых территорий (хабов) в своем регионе.'
                          : 'Identifying, negotiating, and onboarding new territory partners (hubs) within the region.'}
                      </p>
                    </div>

                    <div className="p-6 bg-slate-950/80 rounded-2xl border border-blue-500/20 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">2</span>
                        <h3 className="font-bold text-white text-lg">
                          {lang === 'ru' ? 'Проведение месяца посева' : 'Seeding Month Execution'}
                        </h3>
                      </div>
                      <p className="text-slate-400 text-sm">
                        {lang === 'ru'
                          ? 'Создание стартовой базы специалистов и масштабное извещение (реклама) платформы среди заказчиков региона.'
                          : 'Building the initial specialist database and launching regional advertising campaigns to attract early customers.'}
                      </p>
                    </div>

                    <div className="p-6 bg-slate-950/80 rounded-2xl border border-blue-500/20 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">3</span>
                        <h3 className="font-bold text-white text-lg">
                          {lang === 'ru' ? 'Отбор и Верификация TP' : 'TP Recruitment & Vetting'}
                        </h3>
                      </div>
                      <p className="text-slate-400 text-sm">
                        {lang === 'ru'
                          ? 'Поиск и собеседование операторов территорий, регулярный контроль соблюдения стандартов сервиса.'
                          : 'Selecting and interviewing territory partners, auditing service quality standards continuously.'}
                      </p>
                    </div>

                    <div className="p-6 bg-slate-950/80 rounded-2xl border border-blue-500/20 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">4</span>
                        <h3 className="font-bold text-white text-lg">
                          {lang === 'ru' ? '100% Аптайм Доступа' : '100% Operational Uptime'}
                        </h3>
                      </div>
                      <p className="text-slate-400 text-sm">
                        {lang === 'ru'
                          ? 'Контроль графиков смен TP, обеспечение непрерывного 100% покрытия рабочих часов территории.'
                          : 'Managing TP shift schedules to ensure uninterrupted 100% operational coverage 365 days a year.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SLIDE 08: AI CONTROL TERMINAL */}
              {/* ========================================================= */}
              {rpSlide === 7 && (
                <div className="flex-1 flex flex-col p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 font-black flex items-center justify-center font-mono">
                        08
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                        AI CONTROL TERMINAL • ИИ-ТЕРМИНАЛ КОНТРОЛЯ
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Super-Admin Access</span>
                  </div>

                  <div className="space-y-6 pt-4">
                    <h2 className="text-3xl font-display font-black text-white">
                      {lang === 'ru' ? 'Региональный T-Terminal (Super Admin)' : 'Regional T-Terminal (Super Admin)'}
                    </h2>
                    <p className="text-slate-300 text-lg">
                      {lang === 'ru'
                        ? 'RP получает доступ к T-Terminal уровня Super Admin. Вы видите все активные лиды, статистику отработки по каждому хабу, отзывы клиентов и финансовые потоки в реальном времени.'
                        : 'RP gets Super Admin access to the T-Terminal. You monitor all active leads, hub performance stats, client reviews, and live revenue streams.'}
                    </p>

                    <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
                        <Activity className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{lang === 'ru' ? 'Live Мониторинг' : 'Live Monitoring'}</h4>
                        <p className="text-slate-400 text-sm">
                          {lang === 'ru' ? 'Автоматические алерты при падении скорости ответа TP или снижении качества.' : 'Automated alerts on TP response delays or quality drops.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SLIDE 09: PARTNERSHIP & JOIN */}
              {/* ========================================================= */}
              {rpSlide === 8 && (
                <div className="flex-1 flex flex-col p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#060e22] via-[#091738] to-[#040812] border-2 border-blue-500/40 shadow-2xl relative overflow-y-auto custom-scrollbar">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="flex items-center justify-between border-b border-blue-500/20 pb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center font-black text-blue-300">
                        09
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                        BECOME A REGIONAL DIRECTOR • ВСТУПИТЬ В СЕТЬ RP
                      </span>
                    </div>
                  </div>

                  <div className="space-y-8 relative z-10 pt-8 flex-1 flex flex-col justify-center">
                    <div className="space-y-4 max-w-4xl">
                      <h2 className="text-4xl sm:text-6xl font-display font-black text-white leading-tight">
                        {lang === 'ru' ? (
                          <>
                            Возглавьте <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Региональную Сеть</span>
                          </>
                        ) : (
                          <>
                            Lead the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Regional Network</span>
                          </>
                        )}
                      </h2>
                      <p className="text-blue-100/80 text-xl max-w-2xl leading-relaxed">
                        {lang === 'ru'
                          ? 'Количество региональных лицензий строго ограничено. Подайте заявку на эксклюзивное управление регионом.'
                          : 'Regional licenses are strictly limited. Apply now for exclusive regional management.'}
                      </p>
                    </div>

                    <div className="pt-8">
                      <a
                        href="/partner"
                        className="inline-flex px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 font-black text-lg rounded-2xl hover:opacity-90 transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] items-center gap-3 cursor-pointer"
                      >
                        <span>{lang === 'ru' ? 'Подать Заявку на Регион' : 'Apply for Regional Director'}</span>
                        <ChevronRight className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
`;
    
    code = code.substring(0, slide5Start) + newSlides + code.substring(level3Start);
    fs.writeFileSync('src/components/PitchDeck.tsx', code);
    console.log("RP Deck Slides replaced successfully!");
} else {
    console.log("Could not find boundaries");
}
