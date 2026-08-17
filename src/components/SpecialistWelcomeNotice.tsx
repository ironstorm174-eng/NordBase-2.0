import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  UserCheck,
  Layers,
  ShieldCheck
} from 'lucide-react';
interface SpecialistWelcomeNoticeProps {
  defaultExpanded?: boolean;
  onOpenAcademy?: () => void;
  showAcademyButton?: boolean;
  isConfirmed?: boolean;
  onToggleConfirm?: (confirmed: boolean) => void;
  className?: string;
}
export default function SpecialistWelcomeNotice({
  defaultExpanded = true,
  onOpenAcademy,
  showAcademyButton = true,
  isConfirmed,
  onToggleConfirm,
  className = ''
}: SpecialistWelcomeNoticeProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : i18n.language === 'ru' ? 'ru' : 'pt';
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const content = {
    ru: {
      badge: '🚀 First wave of specialists',
      title: 'Welcome to NordBase!',
      subtitle: 'Important information for activating your specialist profile',
      summaryIntro: 'Thank you for registering. You have joined the first wave of NordBase specialists in your region.',
      p1: 'NordBase is building not just a directory of workers, but a local community of verified specialists, where work quality and customer trust are the top priorities.',
      p2: 'Your city is currently in the launch phase. In the first few weeks, the number of orders may be limited — this is a natural process of forming a new local network.',
      
      step1Title: '📍 First of all — fill out your Specialist Profile:',
      step1P1: 'First, you need to completely fill out your Specialist Profile (add a profile photo, contact details, and upload verification documents).',
      step1P2: '💡 You can specify and combine multiple specialties at once in one profile (e.g.: Electrician + Plumber + AC Installer).',
      
      prepTitle: 'To prepare for the first orders:',
      prepItems: [
        'Fill out your profile and add examples of completed work',
        'Specify all your areas and specialties to receive more orders',
        'Familiarize yourself with the operating rules in NordBase Academy',
        'Prepare to interact with customers through the platform'
      ],
      academyTitle: 'In NordBase Academy you will learn:',
      academyItems: [
        'How the NordBase platform works;',
        'How to receive and complete orders;',
        'Rules and ethics of customer communication;',
        'Quality standards and guarantees;',
        'Principles of working with reviews and ratings;',
        'How to build a long-term reputation in the community.'
      ],
      activationNote: 'After reviewing the core materials and profile verification, your account will be ready for full activation.',
      footerQuote: 'You are not just registering on the platform. You are becoming one of the first specialists building NordBase in your city.',
      btnOpenAcademy: 'Open NordBase Academy',
      toggleOpen: 'Show welcome and Academy rules',
      toggleClose: 'Collapse welcome text',
      checkboxLabel: 'I have read the welcome guide and NordBase Academy rules'
    },
    en: {
      badge: '🚀 First Specialist Wave',
      title: 'Welcome to NordBase!',
      subtitle: 'Essential guidelines before verifying and activating your specialist profile',
      summaryIntro: 'Thank you for registering. You have joined the first wave of NordBase specialists in your region.',
      p1: 'NordBase is building more than just a provider directory — it is a local community of verified specialists where work quality and customer trust are top priorities.',
      p2: 'Your city is currently in its launch phase. During the first few weeks, order volume may be limited — this is a natural process when establishing a new local network.',
      
      step1Title: '📍 First of all — complete your Specialist Profile:',
      step1P1: 'First and foremost, you must complete your Specialist Profile (upload a clear profile picture, fill in details, and submit verification documents).',
      step1P2: '💡 You can select and operate multiple specialties simultaneously within a single profile (e.g., Electrician + Plumber + Air Conditioning Specialist).',
      
      prepTitle: 'To prepare for your first orders:',
      prepItems: [
        'Complete your profile and add photos of your past work',
        'Add all your skills and specialties to maximize job dispatch opportunities',
        'Review the operating rules in NordBase Academy',
        'Prepare for interacting with clients via the platform'
      ],
      academyTitle: 'In NordBase Academy, you will learn:',
      academyItems: [
        'How the NordBase platform works;',
        'How to receive and fulfill orders;',
        'Customer communication rules and ethics;',
        'Quality standards and guarantee terms;',
        'Principles of managing reviews and rating;',
        'How to build a long-term reputation in your local community.'
      ],
      activationNote: 'After reviewing core materials and profile verification, your account will be activated for job dispatches.',
      footerQuote: 'You are not just registering on a platform. You are becoming one of the first specialists shaping NordBase in your city.',
      btnOpenAcademy: 'Open NordBase Academy',
      toggleOpen: 'Show Welcome Greeting & Academy Rules',
      toggleClose: 'Hide Greeting Text',
      checkboxLabel: 'I have read the welcome guide and NordBase Academy principles'
    },
    pt: {
      badge: '🚀 Primeira Vaga de Especialistas',
      title: 'Bem-vindo à NordBase!',
      subtitle: 'Informações essenciais para a verificação e ativação do seu perfil',
      summaryIntro: 'Obrigado pelo seu registo. Juntou-se à primeira vaga de especialistas NordBase na sua região.',
      p1: 'A NordBase não é apenas um diretório de anúncios — é uma comunidade local de especialistas verificados onde a qualidade do trabalho e a confiança dos clientes são a prioridade absoluta.',
      p2: 'A sua cidade encontra-se em fase de lançamento inicial. Nas primeiras semanas, o volume de pedidos pode ser limitado — este é um processo natural na formação de uma nova rede local.',
      
      step1Title: '📍 Em primeiro lugar — Preencha o seu Perfil de Especialista:',
      step1P1: 'Em primeiro lugar, deve preencher o seu Perfil de Especialista completo (adicionar foto de perfil, dados de contacto e documentos de verificação).',
      step1P2: '💡 Pode selecionar e exercer VÁRIAS ESPECIALIDADES EM SIMULTÂNEO no seu perfil (por exemplo: Eletricista + Canalizador + Técnico de Ar Condicionado).',
      
      prepTitle: 'Para se preparar para os primeiros pedidos:',
      prepItems: [
        'Preencha o perfil e adicione fotos dos seus trabalhos anteriores',
        'Selecione todas as especialidades em que é qualificado para receber mais ofertas de trabalho',
        'Consulte as regras e boas práticas na NordBase Academy',
        'Prepare-se para comunicar com os clientes através da plataforma'
      ],
      academyTitle: 'Na NordBase Academy irá aprender:',
      academyItems: [
        'Como funciona a plataforma NordBase;',
        'Como receber e executar pedidos;',
        'Regras e ética de comunicação com os clientes;',
        'Padrões de qualidade e garantias;',
        'Princípios de trabalho com avaliações e reputação;',
        'Como construir uma reputação duradoura na comunidade local.'
      ],
      activationNote: 'Após a verificação do perfil e a leitura dos guias, a sua conta estará pronta para ativação total.',
      footerQuote: 'Não está apenas a registar-se numa plataforma. Está a tornar-se um dos primeiros especialistas a construir a NordBase na sua cidade.',
      btnOpenAcademy: 'Abrir NordBase Academy',
      toggleOpen: 'Mostrar Boas-Vindas e Regras da Academia',
      toggleClose: 'Ocultar Texto de Boas-Vindas',
      checkboxLabel: 'Li o guia de boas-vindas e os princípios da NordBase Academy'
    }
  }[lang];
  return (
    <div className={`rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-left ${className}`}>
      
      {/* Header Bar & Toggle Accordion */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 sm:p-6 bg-slate-900 hover:bg-slate-850 transition-colors cursor-pointer flex items-center justify-between gap-4 border-b border-slate-800"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
                {content.badge}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              {content.title}
            </h3>
          </div>
        </div>
        <button 
          type="button"
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
          aria-label="Toggle greeting"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      {/* Expanded Collapsible Body */}
      {isExpanded && (
        <div className="p-5 sm:p-8 space-y-8 text-sm text-slate-300 leading-relaxed bg-[#0B1120]">
          
          {/* Welcome Intro Box */}
          <div className="space-y-4 max-w-3xl">
            <p className="font-bold text-white text-base sm:text-lg tracking-tight leading-snug">{content.summaryIntro}</p>
            <p className="text-sm sm:text-base leading-relaxed">{content.p1}</p>
            <p className="text-sm sm:text-base leading-relaxed">{content.p2}</p>
          </div>
          {/* CRITICAL STEP 1: Complete Profile & Multiple Specialties Callout */}
          <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-4">
            <div className="flex items-center gap-3 text-cyan-400 font-black text-base sm:text-lg">
              <UserCheck className="w-6 h-6 shrink-0" />
              <span>{content.step1Title}</span>
            </div>
            
            <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">
              {content.step1P1}
            </p>
            <div className="pt-2 flex items-start gap-3">
              <Layers className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-emerald-400 leading-relaxed">
                {content.step1P2}
              </p>
            </div>
          </div>
          {/* Preparation Checklist */}
          <div className="space-y-4 max-w-3xl">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{content.prepTitle}</span>
            </h4>
            <ul className="space-y-3 pl-1">
              {content.prepItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm sm:text-base">
                  <span className="text-emerald-400 mt-0.5 shrink-0 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* NordBase Academy Section */}
          <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-indigo-400 shrink-0" />
                <span>{content.academyTitle}</span>
              </h4>
              {showAcademyButton && onOpenAcademy && (
                <button
                  type="button"
                  onClick={onOpenAcademy}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap w-fit"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{content.btnOpenAcademy}</span>
                </button>
              )}
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
              {content.academyItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-400 pt-1 italic font-mono">
              {content.activationNote}
            </p>
          </div>
          {/* Footer Quote */}
          <div className="text-center pt-2">
            <p className="font-medium text-slate-400 text-sm sm:text-base italic px-4">
              "{content.footerQuote}"
            </p>
          </div>
          {/* Confirmation Checkbox */}
          {onToggleConfirm && (
            <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!isConfirmed}
                  onChange={(e) => onToggleConfirm(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer transition-colors"
                />
                <span className={`text-sm font-bold transition-colors select-none ${
                  isConfirmed ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  {content.checkboxLabel}
                </span>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}