const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

const startStr = `<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">`;
const introSlideStart = code.indexOf('INTRO 01 • CONNECTING PEOPLE');
const divStart = code.indexOf(startStr, introSlideStart);
  
const endMapText = 'Local Territory Operators in every municipality';
const endMapDiv = code.indexOf('</div>', code.indexOf(endMapText)) + '</div>'.length; // closes right column
const nextDivEnd = code.indexOf('</div>', endMapDiv) + '</div>'.length; // closes grid

const oldGrid = code.substring(divStart, nextDivEnd);

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
                  </div>`;
  
code = code.replace(oldGrid, newGrid);

// Now let's update the Responsibilities slide. We need to update item 2, 3, 4
// Let's find "Отбор и Верификация TP"
code = code.replace(
  `{lang === 'ru' ? 'Отбор и Верификация TP' : 'TP Recruitment & Vetting'}`,
  `{lang === 'ru' ? 'Проведение месяца посева' : 'Seeding Month Execution'}`
);

code = code.replace(
  `? 'Поиск и собеседование операторов территорий, регулярный контроль соблюдения стандартов сервиса.'\n                          : 'Selecting and interviewing territory partners, auditing service quality standards continuously.'}`,
  `? 'Создание стартовой базы специалистов и масштабное извещение (реклама) платформы среди заказчиков региона.'\n                          : 'Building the initial specialist database and launching regional advertising campaigns to attract early customers.'}`
);

// We need to move the old Item 2 (Отбор и Верификация TP) to item 3
code = code.replace(
  `{lang === 'ru' ? '100% Аптайм Доступа' : '100% Operational Uptime'}`,
  `{lang === 'ru' ? 'Отбор и Верификация TP' : 'TP Recruitment & Vetting'}`
);

code = code.replace(
  `? 'Контроль графиков смен TP, обеспечение непрерывного 100% покрытия рабочих часов территории.'\n                          : 'Managing TP shift schedules to ensure uninterrupted 100% operational coverage 365 days a year.'}`,
  `? 'Поиск и собеседование операторов территорий, регулярный контроль соблюдения стандартов сервиса.'\n                          : 'Selecting and interviewing territory partners, auditing service quality standards continuously.'}`
);

// We need to move the old Item 3 (100% Аптайм Доступа) to item 4
code = code.replace(
  `{lang === 'ru' ? 'Команда и Взаимовыручка' : 'Team Synergy & Support'}`,
  `{lang === 'ru' ? '100% Аптайм Доступа' : '100% Operational Uptime'}`
);

code = code.replace(
  `? 'Налаживание работы команды операторов, взаимопомощь между хабами при всплесках нагрузки.'\n                          : 'Building a strong team atmosphere and cross-hub load balancing during peak request surges.'}`,
  `? 'Контроль графиков смен TP, обеспечение непрерывного 100% покрытия рабочих часов территории.'\n                          : 'Managing TP shift schedules to ensure uninterrupted 100% operational coverage 365 days a year.'}`
);

fs.writeFileSync('src/components/PitchDeck.tsx', code);
console.log("Done.");
