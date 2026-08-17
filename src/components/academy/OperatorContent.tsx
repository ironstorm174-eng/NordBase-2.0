import React from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  ArrowRight, 
  ShieldAlert, 
  Clock, 
  FileText, 
  Lock, 
  Info,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Module, Section } from './curriculumData';
import { Module01Glossary } from './tpModules/Module01Glossary';
import { Module02Philosophy } from './tpModules/Module02Philosophy';
import { Module03RoleOfTP } from './tpModules/Module03RoleOfTP';
import { Module04JoiningNordBase } from './tpModules/Module04JoiningNordBase';
import { Module05Workspace } from './tpModules/Module05Workspace';
import { Module06Dashboard } from './tpModules/Module06Dashboard';
import { Module07SpecialistVerification } from './tpModules/Module07SpecialistVerification';
import { Module08ReceivingRequest } from './tpModules/Module08ReceivingRequest';
import { Module09CustomerVerification } from './tpModules/Module09CustomerVerification';
import { Module10LeadCreation } from './tpModules/Module10LeadCreation';
import { Module11SpecialistSelection } from './tpModules/Module11SpecialistSelection';
import { Module12LeadOffer } from './tpModules/Module12LeadOffer';
import { Module13StartingJob } from './tpModules/Module13StartingJob';
import { Module14CustomerSpecialistMeeting } from './tpModules/Module14CustomerSpecialistMeeting';
import { Module15WorkInProgress } from './tpModules/Module15WorkInProgress';
import { Module16CancellationsNoShow } from './tpModules/Module16CancellationsNoShow';
import { Module17Disputes } from './tpModules/Module17Disputes';
import { Module18ComplaintsModeration } from './tpModules/Module18ComplaintsModeration';
import { Module19Communication } from './tpModules/Module19Communication';
import { Module20PaymentsMoneyFlow } from './tpModules/Module20PaymentsMoneyFlow';
import { Module21WorkWithRP } from './tpModules/Module21WorkWithRP';
import { Module22EscalationPath } from './tpModules/Module22EscalationPath';
import { Module23QualityKPI } from './tpModules/Module23QualityKPI';
import { Module24SecurityPrivacy } from './tpModules/Module24SecurityPrivacy';
import { Module25PracticalScenarios } from './tpModules/Module25PracticalScenarios';
import { Module26FinalAssessment } from './tpModules/Module26FinalAssessment';
import { Module27ReadyForWork } from './tpModules/Module27ReadyForWork';

interface OperatorContentProps {
  expandedSection: string | null;
  lang: 'en' | 'pt' | 'ru';
  currentModuleObj?: Module;
  currentSectionObj?: Section;
  completedModules: string[];
  onCompleteModule: (moduleId: string) => void;
  onNavigateToModule?: (moduleId: string, sectionId?: string) => void;
}

export function OperatorContent({ 
  expandedSection, 
  lang, 
  currentModuleObj, 
  currentSectionObj,
  completedModules,
  onCompleteModule,
  onNavigateToModule
}: OperatorContentProps) {
  const isPt = lang === 'pt';
  const isRu = lang === 'ru';

  const isCompleted = currentModuleObj ? completedModules.includes(currentModuleObj.id) : false;

  const labels = {
    whatHappens: isPt ? '01. O Que Acontece' : isRu ? '01. Что происходит' : '01. What Happens',
    whatTPDoes: isPt ? '02. O Que o TP Faz' : isRu ? '02. Что делает TP' : '02. What TP Does',
    whatNotToDo: isPt ? '03. O Que NÃO Fazer' : isRu ? '03. Что нельзя делать' : '03. What NOT To Do',
    whenHelpNeeded: isPt ? '04. Quando Precisa de Ajuda' : isRu ? '04. Когда нужна помощь' : '04. When Help Is Needed',
    practicalExample: isPt ? '05. Exemplo Prático' : isRu ? '05. Практический пример' : '05. Practical Example',
    tbdNotice: isPt 
      ? 'Estrutura do módulo criada. O conteúdo detalhado e as regras operacionais serão adicionados e verificados nesta secção.' 
      : isRu 
      ? 'Структура модуля создана. Подробное содержание и правила будут заполняться и проверяться поэтапно.' 
      : 'Module structure created. Detailed content and operational rules will be populated step by step.',
    completeAndContinue: isPt ? 'Concluir e Continuar' : isRu ? 'Завершить и продолжить' : 'Complete & Continue',
    completedStatus: isPt ? 'Concluído' : isRu ? 'Завершено' : 'Completed',
    inProgressStatus: isPt ? 'Em Progresso' : isRu ? 'В процессе' : 'In Progress',
    subsections: isPt ? 'Subseções do Módulo' : isRu ? 'Подразделы модуля' : 'Module Subsections',
    nextModule: isPt ? 'Próximo Módulo' : isRu ? 'Следующий модуль' : 'Next Module',
  };

  if (!currentModuleObj) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>{isPt ? 'Selecione um módulo para começar.' : isRu ? 'Выберите модуль для начала обучения.' : 'Select a module to begin.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Module Banner / Header */}
      <div className="bg-[#0A1128]/80 border border-blue-900/40 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
              {currentModuleObj.categoryName || 'TP ACADEMY'}
            </span>
            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md text-xs font-mono font-bold">
              MOD {currentModuleObj.number || '00'}
            </span>
          </div>

          <div>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {labels.completedStatus}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                {labels.inProgressStatus}
              </span>
            )}
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight mb-3">
          {currentModuleObj.title}
        </h2>
        
        {currentModuleObj.description && (
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
            {currentModuleObj.description}
          </p>
        )}

        {/* Subsections List Pills */}
        {currentModuleObj.sections && currentModuleObj.sections.length > 0 && (
          <div className="mt-6 pt-6 border-t border-blue-900/30">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              {labels.subsections}:
            </p>
            <div className="flex flex-wrap gap-2">
              {currentModuleObj.sections.map((sec, idx) => {
                const isCurrentSec = expandedSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => onNavigateToModule && onNavigateToModule(currentModuleObj.id, sec.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left flex items-center gap-2 cursor-pointer ${
                      isCurrentSec 
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                        : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="opacity-60 font-mono text-[10px]">{idx + 1}.</span>
                    <span>{sec.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected Subsection Banner if any */}
      {currentSectionObj && (
        <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-cyan-400 font-mono uppercase">{isPt ? 'Tópico Ativo' : isRu ? 'Активный топик' : 'Active Topic'}</p>
              <h3 className="text-sm font-bold text-white">{currentSectionObj.title}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Module Content Body Routing */}
      {(() => {
        switch (currentModuleObj.id) {
          case 'tp_mod_01':
            return <Module01Glossary />;
          case 'tp_mod_02':
            return <Module02Philosophy />;
          case 'tp_mod_03':
            return <Module03RoleOfTP />;
          case 'tp_mod_04':
            return <Module04JoiningNordBase />;
          case 'tp_mod_05':
            return <Module05Workspace />;
          case 'tp_mod_06':
            return <Module06Dashboard />;
          case 'tp_mod_07':
            return <Module07SpecialistVerification />;
          case 'tp_mod_08':
            return <Module08ReceivingRequest />;
          case 'tp_mod_09':
            return <Module09CustomerVerification />;
          case 'tp_mod_10':
            return <Module10LeadCreation />;
          case 'tp_mod_11':
            return <Module11SpecialistSelection />;
          case 'tp_mod_12':
            return <Module12LeadOffer />;
          case 'tp_mod_13':
            return <Module13StartingJob />;
          case 'tp_mod_14':
            return <Module14CustomerSpecialistMeeting />;
          case 'tp_mod_15':
            return <Module15WorkInProgress />;
          case 'tp_mod_16':
            return <Module16CancellationsNoShow />;
          case 'tp_mod_17':
            return <Module17Disputes />;
          case 'tp_mod_18':
            return <Module18ComplaintsModeration />;
          case 'tp_mod_19':
            return <Module19Communication />;
          case 'tp_mod_20':
            return <Module20PaymentsMoneyFlow />;
          case 'tp_mod_21':
            return <Module21WorkWithRP />;
          case 'tp_mod_22':
            return <Module22EscalationPath />;
          case 'tp_mod_23':
            return <Module23QualityKPI />;
          case 'tp_mod_24':
            return <Module24SecurityPrivacy />;
          case 'tp_mod_25':
            return <Module25PracticalScenarios />;
          case 'tp_mod_26':
            return <Module26FinalAssessment />;
          case 'tp_mod_27':
            return <Module27ReadyForWork />;
          default:
            return (
              <div className="space-y-5">
                {/* Block 1: What Happens */}
                <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs font-mono">
                      01
                    </div>
                    <h4 className="text-base font-bold text-white font-display tracking-wide">{labels.whatHappens}</h4>
                  </div>
                  <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 text-slate-400 text-sm leading-relaxed flex items-start gap-3">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <p>
                      <span className="font-semibold text-slate-300 font-mono text-xs">[TBD — requires definition] </span>
                      {labels.tbdNotice}
                    </p>
                  </div>
                </div>

                {/* Block 2: What TP Does */}
                <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">
                      02
                    </div>
                    <h4 className="text-base font-bold text-white font-display tracking-wide">{labels.whatTPDoes}</h4>
                  </div>
                  <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 text-slate-400 text-sm leading-relaxed flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>
                      <span className="font-semibold text-slate-300 font-mono text-xs">[TBD — requires definition] </span>
                      {labels.tbdNotice}
                    </p>
                  </div>
                </div>

                {/* Block 3: What NOT To Do */}
                <div className="bg-[#050A1A] border border-red-900/30 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">
                      03
                    </div>
                    <h4 className="text-base font-bold text-rose-300 font-display tracking-wide">{labels.whatNotToDo}</h4>
                  </div>
                  <div className="p-4 bg-rose-950/20 rounded-xl border border-rose-900/30 text-rose-200/80 text-sm leading-relaxed flex items-start gap-3">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <p>
                      <span className="font-semibold text-rose-200 font-mono text-xs">[TBD — requires definition] </span>
                      {labels.tbdNotice}
                    </p>
                  </div>
                </div>

                {/* Block 4: When Help Is Needed */}
                <div className="bg-[#050A1A] border border-amber-900/30 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">
                      04
                    </div>
                    <h4 className="text-base font-bold text-amber-300 font-display tracking-wide">{labels.whenHelpNeeded}</h4>
                  </div>
                  <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-900/30 text-amber-200/80 text-sm leading-relaxed flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p>
                      <span className="font-semibold text-amber-200 font-mono text-xs">[TBD — requires definition] </span>
                      {labels.tbdNotice}
                    </p>
                  </div>
                </div>

                {/* Block 5: Practical Example */}
                <div className="bg-[#050A1A] border border-blue-900/30 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">
                      05
                    </div>
                    <h4 className="text-base font-bold text-white font-display tracking-wide">{labels.practicalExample}</h4>
                  </div>
                  <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 text-slate-400 text-sm leading-relaxed flex items-start gap-3">
                    <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <p>
                      <span className="font-semibold text-slate-300 font-mono text-xs">[TBD — requires definition] </span>
                      {labels.tbdNotice}
                    </p>
                  </div>
                </div>
              </div>
            );
        }
      })()}

      {/* Complete & Continue Action Banner */}
      <div className="pt-6 border-t border-blue-900/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0A1128]/60 p-6 rounded-2xl border border-blue-900/30">
        <div>
          <h4 className="text-base font-bold text-white mb-1">
            {isCompleted 
              ? (isPt ? 'Módulo já concluído!' : isRu ? 'Модуль уже пройден!' : 'Module already completed!')
              : (isPt ? 'Pronto para prosseguir?' : isRu ? 'Готовы продолжить?' : 'Ready to proceed?')}
          </h4>
          <p className="text-xs text-slate-400">
            {isPt 
              ? 'Marque como concluído para atualizar o seu progresso na TP Academy.' 
              : isRu 
              ? 'Нажмите для сохранения прогресса и перехода к следующему модулю TP Academy.' 
              : 'Mark as completed to track your progress in TP Academy.'}
          </p>
        </div>

        <button
          onClick={() => onCompleteModule(currentModuleObj.id)}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
            isCompleted 
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{labels.completeAndContinue}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
