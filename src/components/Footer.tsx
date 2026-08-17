import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Building2, MapPin, ShieldCheck, ChevronRight, MessageSquare, Zap, Globe, } from 'lucide-react';

interface FooterProps {
  onOpenKnowledgeBase: (articleSlug?: string) => void;
  onOpenPartnerLanding: () => void;
  onGoHome: () => void;
  onOpenHowItWorks?: () => void;
  onNavigateGeo?: (region?: string, city?: string, category?: string) => void;
}

export default function Footer({
  onOpenKnowledgeBase,
  onOpenPartnerLanding,
  onGoHome,
  onOpenHowItWorks,
  onNavigateGeo
}: FooterProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'pt';

  const handleCityClick = (citySlug: string) => {
    if (onNavigateGeo) {
      onNavigateGeo('algarve', citySlug);
    } else {
      onGoHome();
    }
  };

  return (
    <footer className="border-t border-white/5 bg-[#02050D] text-slate-400 py-12 text-sm mt-20" id="global-footer">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand, Partner Link & Language Switcher */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={onGoHome}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(37,99,235,0.3)] group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xs">N</span>
            </div>
            <span className="font-display font-black text-white text-lg tracking-tight">
              NordBase<span className="text-slate-400">.pt</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'en'
              ? 'Connecting residents with verified electricians, plumbers, and local service specialists in Portugal.'
              : 'Plataforma de ligação rápida a eletricistas, canalizadores e técnicos qualificados em Portugal.'}
          </p>
          {/* Become a Partner Button in Footer */}
          <div className="pt-1 space-y-3">
            <button
              onClick={onOpenPartnerLanding}
              className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 hover:from-blue-600/30 hover:to-cyan-500/30 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
            >
              <Building2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>{lang === 'en' ? 'Become a NordBase Partner' : 'Seja um Parceiro NordBase'}</span>
            </button>
            {/* Footer Language Switcher */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'en' ? 'Language' : 'Idioma'}:</span>
              </span>
              <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => i18n.changeLanguage('pt')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    i18n.language === 'pt' || i18n.language.startsWith('pt')
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Português"
                >
                  PT
                </button>
                <button
                  type="button"
                  onClick={() => i18n.changeLanguage('en')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    i18n.language === 'en' || i18n.language.startsWith('en')
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="English"
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: About NordBase & How It Works */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'en' ? 'Information' : 'Informações'}</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li>
              <button
                onClick={() => {
                  if (onOpenHowItWorks) {
                    onOpenHowItWorks();
                  } else {
                    onGoHome();
                  }
                }}
                className="text-left text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer flex items-start gap-1.5 leading-snug group"
              >
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                <div>
                  <span className="font-semibold text-white block">
                    {lang === 'en' ? 'How It Works' : 'Como Funciona'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'en' ? 'Simple 5-step process to request local service' : 'Processo simples em 5 passos para pedir o serviço'}
                  </span>
                </div>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Manuals & Ordering FAQ */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'en' ? 'Customer Guides & FAQ' : 'Guias e Ajuda ao Cliente'}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button
                onClick={() => onOpenKnowledgeBase('what-happens-after-i-describe-my-problem')}
                className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1"
              >
                • {lang === 'en' ? 'What happens after I request' : 'O que acontece após o pedido'}
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenKnowledgeBase('can-final-price-change-after-specialist-visits')}
                className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1"
              >
                • {lang === 'en' ? 'Can final price change on site' : 'O preço pode mudar no local'}
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenKnowledgeBase('what-is-the-20-euro-call-out-fee')}
                className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1"
              >
                • {lang === 'en' ? 'What is the €20 call-out fee' : 'O que é a taxa de deslocação de 20€'}
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenKnowledgeBase('how-does-nordbase-find-a-local-specialist')}
                className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1"
              >
                • {lang === 'en' ? 'How specialists are coordinated' : 'Como os técnicos são coordenados'}
              </button>
            </li>
            <li className="pt-1">
              <button
                onClick={() => onOpenKnowledgeBase()}
                className="hover:text-cyan-400 text-cyan-400/90 font-medium transition-colors text-left cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{lang === 'en' ? 'All Guides & FAQ →' : 'Todos os Guias e FAQ →'}</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Regional Territories Covered */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>{lang === 'en' ? 'Territory Coverage' : 'Cobertura Territorial'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
            <button onClick={() => handleCityClick('portimao')} className="text-left hover:text-cyan-400 transition-colors cursor-pointer font-medium text-slate-300">• Portimão (Ativo)</button>
            <button onClick={() => onNavigateGeo && onNavigateGeo('algarve')} className="text-left hover:text-cyan-400 transition-colors cursor-pointer">• Algarve (Regional)</button>
            <button onClick={() => handleCityClick('lagos')} className="text-left hover:text-cyan-400 transition-colors cursor-pointer">• Lagos</button>
            <button onClick={() => handleCityClick('faro')} className="text-left hover:text-cyan-400 transition-colors cursor-pointer">• Faro</button>
            <button onClick={() => handleCityClick('albufeira')} className="text-left hover:text-cyan-400 transition-colors cursor-pointer">• Albufeira</button>
            <button onClick={() => handleCityClick('vilamoura')} className="text-left hover:text-cyan-400 transition-colors cursor-pointer">• Vilamoura</button>
            <button onClick={() => onNavigateGeo && onNavigateGeo('portugal')} className="text-left hover:text-cyan-400 transition-colors cursor-pointer col-span-2 text-cyan-400/80">• Portugal (Expansão Nacional)</button>
          </div>
        </div>
      </div>

      {/* Copyright Bar & Links */}
      <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 NordBase.pt. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-5 sm:gap-6">
          <button
            onClick={() => onOpenKnowledgeBase()}
            className="hover:text-cyan-400 text-slate-400 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'en' ? 'Guides & FAQ' : 'Guias e FAQ'}</span>
          </button>
          <button
            onClick={onOpenPartnerLanding}
            className="hover:text-cyan-400 text-slate-400 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang === 'en' ? 'Become a NordBase Partner' : 'Seja um Parceiro NordBase'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
