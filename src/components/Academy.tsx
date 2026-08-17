import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  GraduationCap, 
  ChevronRight, 
  PlayCircle, 
  FileText, 
  ChevronDown, 
  CheckCircle2, 
  Search, 
  BookOpen, 
  Clock, 
  Filter
} from 'lucide-react';
import { UserRole } from '../types';
import { getSpecialistCurriculum, getOperatorCurriculum, getRpCurriculum, Module } from './academy/curriculumData';
import { SpecialistContent } from './academy/SpecialistContent';
import { OperatorContent } from './academy/OperatorContent';
import { RpContent } from './academy/RpContent';

interface AcademyProps {
  userRole: UserRole;
}

export default function Academy({ userRole }: AcademyProps) {
  const { i18n } = useTranslation();
  const rawLang = i18n.language || 'en';
  const lang: 'en' | 'pt' | 'ru' = rawLang.startsWith('pt') ? 'pt' : rawLang.startsWith('ru') ? 'ru' : 'en';

  const isOperatorLevel = userRole === 'operator' || userRole === 'regional_admin' || userRole === 'super_admin';
  const [academyLevel, setAcademyLevel] = useState<'specialist' | 'operator' | 'rp'>(
    userRole === 'specialist' ? 'specialist' : userRole === 'regional_admin' || userRole === 'super_admin' ? 'rp' : 'operator'
  );

  const [activeModule, setActiveModule] = useState<string>(
    userRole === 'specialist' ? 'spec_mod_00' : userRole === 'regional_admin' || userRole === 'super_admin' ? 'rp_mod_01' : 'tp_mod_01'
  );
  const [expandedSection, setExpandedSection] = useState<string | null>(
    userRole === 'specialist' ? 'sec_spec_00_1' : userRole === 'regional_admin' || userRole === 'super_admin' ? 'sec_rp_01_1' : 'sec_tp_01_1'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Track completed modules in localStorage
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nordbase_tp_academy_completed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nordbase_tp_academy_completed', JSON.stringify(completedModules));
    } catch (e) {
      console.error(e);
    }
  }, [completedModules]);

  const specialistCurriculum = getSpecialistCurriculum(lang);
  const operatorCurriculum = getOperatorCurriculum(lang);
  const rpCurriculum = getRpCurriculum(lang);

  const currentCurriculum = academyLevel === 'specialist'
    ? specialistCurriculum
    : academyLevel === 'rp' 
    ? rpCurriculum 
    : operatorCurriculum;

  // Filter curriculum by category and search
  const filteredCurriculum = currentCurriculum.filter(m => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sections.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const currentModuleObj = currentCurriculum.find(m => m.id === activeModule) || currentCurriculum[0];
  const currentSectionObj = currentModuleObj?.sections.find(s => s.id === expandedSection);

  // Calculate Progress
  const totalModules = currentCurriculum.length;
  const completedCount = currentCurriculum.filter(m => completedModules.includes(m.id)).length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const handleLevelChange = (level: 'specialist' | 'operator' | 'rp') => {
    setAcademyLevel(level);
    setSelectedCategory('all');
    setSearchQuery('');
    if (level === 'specialist') {
      setActiveModule('spec_mod_00');
      setExpandedSection('sec_spec_00_1');
    } else if (level === 'rp') {
      setActiveModule('rp_mod_01');
      setExpandedSection('sec_rp_01_1');
    } else {
      setActiveModule('tp_mod_01');
      setExpandedSection('sec_tp_01_1');
    }
  };

  const handleCompleteModule = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
    }
    
    // Find next module in sequence
    const currentIndex = currentCurriculum.findIndex(m => m.id === moduleId);
    if (currentIndex >= 0 && currentIndex < currentCurriculum.length - 1) {
      const nextMod = currentCurriculum[currentIndex + 1];
      setActiveModule(nextMod.id);
      if (nextMod.sections && nextMod.sections.length > 0) {
        setExpandedSection(nextMod.sections[0].id);
      } else {
        setExpandedSection(null);
      }
    }
  };

  const handleNavigateToModule = (moduleId: string, sectionId?: string) => {
    setActiveModule(moduleId);
    const mod = currentCurriculum.find(m => m.id === moduleId);
    if (sectionId) {
      setExpandedSection(sectionId);
    } else if (mod && mod.sections.length > 0) {
      setExpandedSection(mod.sections[0].id);
    } else {
      setExpandedSection(null);
    }
  };

  const categories = academyLevel === 'specialist' ? [
    { key: 'all', label: lang === 'pt' ? 'Todos' : lang === 'ru' ? 'Все' : 'All' },
    { key: 'onboarding', label: lang === 'pt' ? 'Fundamentos' : lang === 'ru' ? 'Основы' : 'Foundations' },
    { key: 'operations', label: lang === 'pt' ? 'Atividade' : lang === 'ru' ? 'Деятельность' : 'Operations' },
    { key: 'leads_pricing', label: lang === 'pt' ? 'Leads e Preços' : lang === 'ru' ? 'Лиды и Цены' : 'Leads & Pricing' },
    { key: 'standards', label: lang === 'pt' ? 'Padrões' : lang === 'ru' ? 'Стандарты' : 'Standards' },
    { key: 'workflow', label: lang === 'pt' ? 'Fluxo Prático' : lang === 'ru' ? 'Процесс' : 'Workflow' },
    { key: 'growth', label: lang === 'pt' ? 'Crescimento' : lang === 'ru' ? 'Рост' : 'Growth' },
    { key: 'certification', label: lang === 'pt' ? 'Certificação' : lang === 'ru' ? 'Тестирование' : 'Certification' },
  ] : academyLevel === 'rp' ? [
    { key: 'all', label: 'All Sections' },
    { key: 'rp_foundation', label: 'Sec 0 — RP Foundation' },
    { key: 'nordbase_mastery', label: 'Sec 1 — NordBase Mastery' },
    { key: 'building_region', label: 'Sec 2 — Building Region' },
    { key: 'building_team', label: 'Sec 3 — Building Team' },
    { key: 'regional_launch', label: 'Sec 4 — Regional Launch' },
    { key: 'launch_to_stability', label: 'Sec 5 — Launch to Stability' },
    { key: 'control_leadership', label: 'Sec 6 — Control & Leadership' },
    { key: 'final_qualification', label: 'Sec 7 — Qualification' },
  ] : [
    { key: 'all', label: lang === 'pt' ? 'Todos' : lang === 'ru' ? 'Все' : 'All' },
    { key: 'foundations', label: lang === 'pt' ? 'Obrigações e Princípios' : lang === 'ru' ? 'Основы' : 'Foundations' },
    { key: 'admission', label: lang === 'pt' ? 'Admissão e Preparação' : lang === 'ru' ? 'Допуск' : 'Admission' },
    { key: 'workflow', label: lang === 'pt' ? 'Fluxo do TP' : lang === 'ru' ? 'Рабочий процесс' : 'TP Workflow' },
    { key: 'job_ops', label: lang === 'pt' ? 'Gestão de Jobs' : lang === 'ru' ? 'Работа с Job' : 'Job Operations' },
    { key: 'finances', label: lang === 'pt' ? 'Finanças' : lang === 'ru' ? 'Финансы' : 'Finances' },
    { key: 'edge_cases', label: lang === 'pt' ? 'Casos Especiais' : lang === 'ru' ? 'Нестандартные' : 'Edge Cases' },
    { key: 'governance', label: lang === 'pt' ? 'Gestão e Escalamento' : lang === 'ru' ? 'Управление' : 'Governance' },
    { key: 'final', label: lang === 'pt' ? 'Final e Avaliação' : lang === 'ru' ? 'Финал' : 'Final' },
  ];

  const labels = {
    title: lang === 'pt' ? 'NordBase Academy' : lang === 'ru' ? 'Академия NordBase' : 'NordBase Academy',
    progress: academyLevel === 'specialist' ? 'Specialist Progress' : academyLevel === 'rp' ? 'RP Academy Progress' : lang === 'pt' ? 'Progresso do Curso' : lang === 'ru' ? 'Прогресс TP Academy' : 'TP Academy Progress',
    specialistTab: lang === 'pt' ? 'Especialista' : lang === 'ru' ? 'Специалист' : 'Specialist',
    operatorTab: lang === 'pt' ? 'Parceiro Territorial' : lang === 'ru' ? 'Territory Partner' : 'Territory Partner',
    rpTab: 'Regional Partner (RP)',
    operatorTitle: lang === 'pt' ? 'TP Academy — Curso de Operador' : lang === 'ru' ? 'TP Academy — Обучение TP' : 'TP Academy — Territory Partner Course',
    rpTitle: 'RP Academy — Regional Leadership & Launch Course',
    selectTopic: lang === 'pt' ? 'Selecione um tópico...' : lang === 'ru' ? 'Выберите тему...' : 'Select a topic...',
    breadcrumbRoot: lang === 'pt' ? 'NordBase Academy' : lang === 'ru' ? 'Академия' : 'Academy',
    prevLesson: lang === 'pt' ? 'Módulo Anterior' : lang === 'ru' ? 'Предыдущий модуль' : 'Previous Module',
    nextLesson: lang === 'pt' ? 'Próximo Módulo' : lang === 'ru' ? 'Следующий модуль' : 'Next Module',
    searchPlaceholder: lang === 'pt' ? 'Pesquisar módulo ou tópico...' : lang === 'ru' ? 'Поиск модуля или темы...' : 'Search module or topic...',
  };

  return (
    <div className="h-full flex flex-col bg-[#030712] text-slate-200">
      {/* Academy Top Navigation & Progress Header */}
      <div className="bg-[#0A1128] border-b border-blue-900/30 p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <div className="w-full h-full bg-[#0A1128] rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-black text-white tracking-tight flex items-center gap-2">
              <span>{labels.title}</span>
              {academyLevel === 'specialist' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                  18 SPEC MODS
                </span>
              ) : academyLevel === 'rp' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                  24 RP MODS
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                  27 TP MODS
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400">
              {academyLevel === 'specialist'
                ? 'Specialist Academy — Onboarding & Operating Guide for Independent Specialists'
                : academyLevel === 'rp'
                ? 'RP Academy — Building, Launching & Managing a Self-Sustaining NordBase Region'
                : (lang === 'pt' ? 'Curso de Preparação de Parceiro Territorial' : lang === 'ru' ? 'Полный курс обучения Территориального Партнёра' : 'Territory Partner Certification Course')}
            </p>
          </div>
        </div>
        
        {/* Progress Tracker */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{labels.progress}</p>
            <p className="text-sm font-bold text-white font-mono">{completedCount} / {totalModules} ({progressPercent}%)</p>
          </div>
          <div className="w-24 md:w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-80 md:w-96 border-r border-blue-900/30 bg-[#050A1A] overflow-y-auto hidden md:flex flex-col shrink-0">
          <div className="p-4 border-b border-blue-900/30 sticky top-0 bg-[#050A1A] z-20 space-y-3">
            {/* Level Selector Tabs */}
            <div className="flex p-1 bg-slate-900/80 border border-slate-800 rounded-xl gap-1">
              <button
                onClick={() => handleLevelChange('specialist')}
                className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                  academyLevel === 'specialist' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {labels.specialistTab}
              </button>
              <button
                onClick={() => handleLevelChange('operator')}
                className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                  academyLevel === 'operator' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {labels.operatorTab}
              </button>
              <button
                onClick={() => handleLevelChange('rp')}
                className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                  academyLevel === 'rp' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                RP Academy
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder={labels.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Category Filter Pills (For Operator TP Course) */}
            {academyLevel === 'operator' && (
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors cursor-pointer ${
                      selectedCategory === cat.key
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Module List */}
          <div className="p-3 flex-1 space-y-1.5">
            {filteredCurriculum.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                {lang === 'pt' ? 'Nenhum módulo encontrado.' : lang === 'ru' ? 'Модули не найдены.' : 'No modules found.'}
              </div>
            ) : (
              filteredCurriculum.map((module) => {
                const isSelected = activeModule === module.id;
                const isModuleDone = completedModules.includes(module.id);

                return (
                  <div key={module.id} className="rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleNavigateToModule(module.id)}
                      className={`w-full flex items-center justify-between p-3 transition-all text-left border cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-900/30 border-blue-500/40 text-white shadow-[0_0_12px_rgba(37,99,235,0.15)]' 
                          : 'border-slate-800/60 bg-slate-900/30 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {isModuleDone ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                        ) : isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                            <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-[10px] font-mono text-slate-500">
                            {module.number || '•'}
                          </div>
                        )}
                        
                        <span className="font-display font-medium text-xs truncate">
                          {module.title}
                        </span>
                      </div>

                      <ChevronDown className={`w-4 h-4 shrink-0 transition-transform text-slate-500 ${isSelected ? 'rotate-180 text-cyan-400' : ''}`} />
                    </button>

                    {/* Subsections under expanded module */}
                    {isSelected && module.sections && module.sections.length > 0 && (
                      <div className="bg-[#030712] p-2 pl-4 border-l-2 border-cyan-500/40 space-y-1 animate-in slide-in-from-top-1 duration-150">
                        {module.sections.map((sec) => (
                          <button
                            key={sec.id}
                            onClick={() => setExpandedSection(sec.id)}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                              expandedSection === sec.id
                                ? 'bg-cyan-500/10 text-cyan-400 font-medium border border-cyan-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <FileText className={`w-3.5 h-3.5 shrink-0 ${expandedSection === sec.id ? 'text-cyan-400' : 'text-slate-600'}`} />
                            <span className="truncate text-[11px]">{sec.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Content Viewer */}
        <div className="flex-1 bg-[#030712] overflow-y-auto relative">
          {/* Mobile Module Selector Bar */}
          <div className="md:hidden p-4 border-b border-white/10 bg-[#0A1128] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{labels.operatorTitle}</span>
              <span className="text-cyan-400 font-bold">{completedCount}/{totalModules} {labels.completedStatus}</span>
            </div>
            <select 
              className="w-full bg-[#050A1A] border border-blue-900/40 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500"
              value={activeModule}
              onChange={(e) => {
                const modId = e.target.value;
                handleNavigateToModule(modId);
              }}
            >
              {currentCurriculum.map(m => (
                <option key={m.id} value={m.id}>
                  {completedModules.includes(m.id) ? '✓ ' : ''}{m.title}
                </option>
              ))}
            </select>
          </div>

          <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-10">
            {/* Breadcrumb Navigation */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono mb-6">
              <span>{labels.breadcrumbRoot}</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span>{academyLevel === 'specialist' ? 'Specialist Academy' : academyLevel === 'rp' ? 'RP Academy' : 'TP Academy'}</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-cyan-400 font-bold">{currentModuleObj?.title || 'Module'}</span>
            </div>

            {/* Content View Routing */}
            {academyLevel === 'specialist' ? (
              <SpecialistContent
                expandedSection={expandedSection}
                lang={lang}
                currentModuleObj={currentModuleObj}
                currentSectionObj={currentSectionObj}
                completedModules={completedModules}
                onCompleteModule={handleCompleteModule}
                onNavigateToModule={handleNavigateToModule}
              />
            ) : academyLevel === 'rp' ? (
              <RpContent
                expandedSection={expandedSection}
                lang={lang}
                currentModuleObj={currentModuleObj}
                currentSectionObj={currentSectionObj}
                completedModules={completedModules}
                onCompleteModule={handleCompleteModule}
                onNavigateToModule={handleNavigateToModule}
              />
            ) : (
              <OperatorContent 
                expandedSection={expandedSection} 
                lang={lang} 
                currentModuleObj={currentModuleObj}
                currentSectionObj={currentSectionObj}
                completedModules={completedModules}
                onCompleteModule={handleCompleteModule}
                onNavigateToModule={handleNavigateToModule}
              />
            )}

            {/* Bottom Module Pagination */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-blue-900/30">
              <button 
                onClick={() => {
                  const currentIndex = currentCurriculum.findIndex(m => m.id === activeModule);
                  if (currentIndex > 0) {
                    const prevMod = currentCurriculum[currentIndex - 1];
                    handleNavigateToModule(prevMod.id);
                  }
                }}
                disabled={currentCurriculum.findIndex(m => m.id === activeModule) === 0}
                className="px-5 py-2.5 rounded-xl border border-blue-900/50 text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                {labels.prevLesson}
              </button>

              <button 
                onClick={() => {
                  const currentIndex = currentCurriculum.findIndex(m => m.id === activeModule);
                  if (currentIndex >= 0 && currentIndex < currentCurriculum.length - 1) {
                    const nextMod = currentCurriculum[currentIndex + 1];
                    handleNavigateToModule(nextMod.id);
                  }
                }}
                disabled={currentCurriculum.findIndex(m => m.id === activeModule) === currentCurriculum.length - 1}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                {labels.nextLesson}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
