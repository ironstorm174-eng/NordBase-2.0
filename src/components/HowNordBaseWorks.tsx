import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Search,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Euro,
  Wrench,
  ShieldCheck
} from 'lucide-react';

interface HowNordBaseWorksProps {
  onNavigateHome?: () => void;
  onOpenCustomerOrder?: () => void;
}

export default function HowNordBaseWorks({
  onNavigateHome,
  onOpenCustomerOrder
}: HowNordBaseWorksProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'pt';

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 sm:py-8 px-3 sm:px-4 text-slate-100" id="how-nordbase-works-page">
      <Helmet>
        <title>{lang === 'en' ? 'How NordBase Works — 5-Step Customer Guide | NordBase' : 'Como Funciona o NordBase — Guia em 5 Passos | NordBase'}</title>
        <meta
          name="description"
          content={
            lang === 'en'
              ? 'How NordBase works in Portugal: 1. Describe problem, 2. Local specialist connection, 3. On-site assessment, 4. Price agreement, 5. Completion.'
              : 'Como funciona o NordBase em Portugal: 1. Descreva o problema, 2. Ligação a especialista local, 3. Avaliação no local, 4. Acordo de preço, 5. Conclusão.'
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nordbase.pt/how-it-works" />
      </Helmet>
      
      {/* PAGE HEADER */}
      <div className="text-center space-y-3 pt-2 pb-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-wider">
          {lang === 'en' ? 'How NordBase Works' : 'Como Funciona o NordBase'}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-medium max-w-xl mx-auto">
          {lang === 'en'
            ? 'A simple 5-step process to get your service needed done by a local specialist.'
            : 'Um processo simples em 5 passos para resolver o seu problema com um especialista local.'}
        </p>

        {/* 5-STEP SUMMARY BADGES / FLOW */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-bold text-slate-300">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400">
            {lang === 'en' ? '1. YOUR PROBLEM' : '1. O SEU PROBLEMA'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-blue-400">
            {lang === 'en' ? '2. THE RIGHT SPECIALIST' : '2. O ESPECIALISTA CERTO'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-purple-400">
            {lang === 'en' ? '3. ASSESSMENT' : '3. AVALIAÇÃO'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-400">
            {lang === 'en' ? '4. CLEAR PRICE' : '4. PREÇO TRANSPARENTE'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400">
            {lang === 'en' ? '5. DONE' : '5. CONCLUÍDO'}
          </span>
        </div>
      </div>

      {/* 5 STEPS CONTAINER */}
      <div className="space-y-4">

        {/* STEP 1 */}
        <div className="bg-[#0B132B] border border-cyan-500/30 rounded-2xl p-5 sm:p-6 space-y-3 relative shadow-xl hover:border-cyan-400/50 transition-all">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-extrabold flex items-center justify-center text-sm font-mono shrink-0">
                1
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {lang === 'en' ? 'DESCRIBE YOUR PROBLEM' : 'DESCREVA O SEU PROBLEMA'}
              </h2>
            </div>
            <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-11">
            {lang === 'en'
              ? 'Tell us what you need help with. The more details you provide, the easier it is to find the right Specialist.'
              : 'Diga-nos em que precisa de ajuda. Quanto mais detalhes fornecer, mais fácil será encontrar o Especialista certo.'}
          </p>
        </div>

        <div className="flex justify-center -my-2">
          <ArrowDown className="w-4 h-4 text-slate-600" />
        </div>

        {/* STEP 2 */}
        <div className="bg-[#0B132B] border border-blue-500/30 rounded-2xl p-5 sm:p-6 space-y-3 relative shadow-xl hover:border-blue-400/50 transition-all">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-300 font-extrabold flex items-center justify-center text-sm font-mono shrink-0">
                2
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {lang === 'en' ? 'WE FIND THE RIGHT SPECIALIST' : 'ENCONTRAMOS O ESPECIALISTA CERTO'}
              </h2>
            </div>
            <Search className="w-5 h-5 text-blue-400 shrink-0" />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-11">
            {lang === 'en'
              ? 'We match your request with a suitable local Specialist.'
              : 'Associamos o seu pedido a um Especialista local adequado.'}
          </p>
        </div>

        <div className="flex justify-center -my-2">
          <ArrowDown className="w-4 h-4 text-slate-600" />
        </div>

        {/* STEP 3 */}
        <div className="bg-[#0B132B] border border-purple-500/30 rounded-2xl p-5 sm:p-6 space-y-3 relative shadow-xl hover:border-purple-400/50 transition-all">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 font-extrabold flex items-center justify-center text-sm font-mono shrink-0">
                3
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {lang === 'en' ? 'THE SPECIALIST ASSESSES THE WORK' : 'O ESPECIALISTA AVALIA O TRABALHO'}
              </h2>
            </div>
            <UserCheck className="w-5 h-5 text-purple-400 shrink-0" />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-11">
            {lang === 'en'
              ? 'The Specialist contacts you and, when necessary, visits to understand the actual scope of the work.'
              : 'O Especialista entra em contacto consigo e, quando necessário, desloca-se ao local para compreender a extensão real do trabalho.'}
          </p>
        </div>

        <div className="flex justify-center -my-2">
          <ArrowDown className="w-4 h-4 text-slate-600" />
        </div>

        {/* STEP 4 */}
        <div className="bg-[#0B132B] border border-amber-500/30 rounded-2xl p-5 sm:p-6 space-y-3 relative shadow-xl hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold flex items-center justify-center text-sm font-mono shrink-0">
                4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {lang === 'en' ? 'YOU AGREE ON THE PRICE' : 'ACORDAM O PREÇO'}
              </h2>
            </div>
            <Euro className="w-5 h-5 text-amber-400 shrink-0" />
          </div>
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-11 space-y-2">
            <p>
              {lang === 'en'
                ? 'The initial price is an estimate. After assessment, the final price may be higher OR lower.'
                : 'O preço inicial é uma estimativa. Após a avaliação, o preço final pode ser superior OU inferior.'}
            </p>
            <p className="font-medium text-white">
              {lang === 'en'
                ? 'You decide whether to proceed before the agreed work begins.'
                : 'Você decide se deseja avançar antes de o trabalho acordado começar.'}
            </p>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
              {lang === 'en'
                ? 'If you decide not to proceed after a completed visit, a previously communicated €20 call-out fee applies.'
                : 'Se decidir não avançar após uma visita concluída, aplica-se a taxa de deslocação de 20€ previamente comunicada.'}
            </div>
          </div>
        </div>

        <div className="flex justify-center -my-2">
          <ArrowDown className="w-4 h-4 text-slate-600" />
        </div>

        {/* STEP 5 */}
        <div className="bg-[#0B132B] border border-emerald-500/30 rounded-2xl p-5 sm:p-6 space-y-3 relative shadow-xl hover:border-emerald-400/50 transition-all">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold flex items-center justify-center text-sm font-mono shrink-0">
                5
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {lang === 'en' ? 'THE WORK IS DONE' : 'O TRABALHO É REALIZADO'}
              </h2>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-11">
            {lang === 'en'
              ? 'The Specialist completes the agreed work. You pay the Specialist the agreed final price.'
              : 'O Especialista conclui o trabalho acordado. Paga ao Especialista o preço final combinado.'}
          </p>
        </div>

      </div>

      {/* CALL TO ACTION BUTTON */}
      {onOpenCustomerOrder && (
        <div className="pt-4 text-center">
          <button
            onClick={onOpenCustomerOrder}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {lang === 'en' ? 'Describe Your Problem' : 'Descreva o Seu Problema'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
