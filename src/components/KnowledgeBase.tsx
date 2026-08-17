import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { KNOWLEDGE_BASE_ARTICLES, KBArticle } from '../data/knowledgeBaseArticles';
import {
  BookOpen,
  Search,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Clock,
  Sparkles,
  PhoneCall,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  ExternalLink,
  MapPin,
  Wrench
} from 'lucide-react';

interface KnowledgeBaseProps {
  initialArticleSlug?: string | null;
  initialCategory?: string | null;
  onNavigateHome: () => void;
  onOpenOrderForm: () => void;
  onNavigateGeo?: (path: string) => void;
}

export default function KnowledgeBase({
  initialArticleSlug,
  initialCategory,
  onNavigateHome,
  onOpenOrderForm,
  onNavigateGeo
}: KnowledgeBaseProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'pt';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(initialArticleSlug || null);
  const [helpfulFeedback, setHelpfulFeedback] = useState<'yes' | 'no' | null>(null);

  const selectedArticle = KNOWLEDGE_BASE_ARTICLES.find(
    a => a.slug === selectedArticleSlug || a.id === selectedArticleSlug
  );

  const filteredArticles = KNOWLEDGE_BASE_ARTICLES.filter(art => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const titleText = art.title[lang].toLowerCase();
    const summaryText = art.summary[lang].toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      titleText.includes(query) ||
      summaryText.includes(query) ||
      art.keywords.some(k => k.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  const generateArticleSchema = (art: KBArticle) => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: art.title[lang],
          description: art.summary[lang],
          datePublished: art.dateUpdated,
          dateModified: art.dateUpdated,
          author: {
            '@type': 'Organization',
            name: 'NordBase Portugal'
          },
          publisher: {
            '@type': 'Organization',
            name: 'NordBase Portugal',
            logo: {
              '@type': 'ImageObject',
              url: 'https://nordbase.pt/logo.png'
            }
          },
          keywords: art.keywords.join(', ')
        },
        {
          '@type': 'FAQPage',
          mainEntity: art.faqList.map(faq => ({
            '@type': 'Question',
            name: faq.question[lang],
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer[lang]
            }
          }))
        }
      ]
    };
  };

  const handleGeoClick = (path: string) => {
    if (onNavigateGeo) {
      onNavigateGeo(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6" id="knowledge-base-root">
      {/* Helmet Meta Tags for SEO */}
      {selectedArticle ? (
        <Helmet>
          <title>{selectedArticle.title[lang]} | NordBase Knowledge Base</title>
          <meta name="description" content={selectedArticle.summary[lang]} />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={`https://nordbase.pt/knowledge-base/${selectedArticle.slug}`} />
          <script type="application/ld+json">
            {JSON.stringify(generateArticleSchema(selectedArticle))}
          </script>
        </Helmet>
      ) : (
        <Helmet>
          <title>
            {lang === 'en'
              ? 'Customer Knowledge Base & Clear Answers | NordBase Portugal'
              : 'Base de Conhecimento e Respostas ao Cliente | NordBase Portugal'}
          </title>
          <meta
            name="description"
            content={
              lang === 'en'
                ? 'Factual answers to customer questions on local service pricing, specialist on-site evaluation, and call-out fees in Portimão & Algarve.'
                : 'Respostas claras a dúvidas sobre preços, avaliação no local por especialistas e taxa de deslocação em Portimão e Algarve.'
            }
          />
          <meta name="robots" content="index, follow" />
          <link
            rel="canonical"
            href={`https://nordbase.pt/knowledge-base${
              selectedCategory !== 'all' ? `/${selectedCategory}` : ''
            }`}
          />
        </Helmet>
      )}

      {/* Header Banner */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>
                {lang === 'en'
                  ? 'NordBase Public Knowledge Base & Answers'
                  : 'Base de Conhecimento e Respostas NordBase'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {selectedArticle
                ? selectedArticle.title[lang]
                : lang === 'en'
                ? 'Clear Customer Answers & Service Policies'
                : 'Respostas Claras ao Cliente e Políticas de Serviço'}
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Clear, factual explanations of how NordBase operates in Portugal: on-site price evaluation, the €20 call-out fee, and local specialist coordination.'
                : 'Explicações claras e reais sobre o funcionamento do NordBase em Portugal: avaliação do preço no local, taxa de deslocação de 20€ e coordenação local.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenOrderForm}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{lang === 'en' ? 'Describe Your Problem' : 'Descreva o Seu Problema'}</span>
            </button>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-medium text-slate-400 flex-wrap">
          <button
            onClick={onNavigateHome}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Home</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <button
            onClick={() => {
              setSelectedArticleSlug(null);
              setSelectedCategory('all');
            }}
            className={`hover:text-cyan-400 transition-colors cursor-pointer ${
              !selectedArticle && selectedCategory === 'all' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            <span>Knowledge Base</span>
          </button>
          {selectedCategory !== 'all' && !selectedArticle && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-cyan-400 font-bold capitalize">{selectedCategory.replace('-', ' ')}</span>
            </>
          )}
          {selectedArticle && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-200 font-bold truncate max-w-xs">
                {selectedArticle.title[lang]}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ARTICLE READER VIEW */}
      {selectedArticle ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedArticleSlug(null)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'en' ? 'Back to All Questions' : 'Voltar a Todas as Perguntas'}</span>
          </button>

          {/* Quick Action Box */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                  {lang === 'en' ? 'Need Local Service in Portimão?' : 'Precisa de Serviço Local em Portimão?'}
                </p>
                <p className="text-sm font-bold text-white">
                  {lang === 'en'
                    ? 'Connect with verified local specialists in Western Algarve'
                    : 'Ligação com especialistas locais verificados no Barlavento'}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenOrderForm}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md shrink-0"
            >
              {lang === 'en' ? 'Describe Your Problem' : 'Descreva o Seu Problema'}
            </button>
          </div>

          {/* Main Article Content */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                {selectedArticle.categoryLabel[lang]}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedArticle.readingTime}
              </span>
            </div>

            {/* Sections */}
            <div className="space-y-6 text-slate-200">
              {selectedArticle.contentSections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h2 className="text-lg font-bold text-white border-l-2 border-cyan-400 pl-3">
                    {sec.title[lang]}
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-300 pl-3">{sec.body[lang]}</p>
                </div>
              ))}
            </div>

            {/* Internal Natural Links to Portimão Hub & Services */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              <p className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                {lang === 'en' ? 'Related Local Hub & Services:' : 'Hub Local e Serviços Relacionados:'}
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <button
                  onClick={() => handleGeoClick('/algarve/portimao')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Portimão Hub</span>
                </button>
                {selectedArticle.relatedServiceSlugs?.map(sSlug => (
                  <button
                    key={sSlug}
                    onClick={() => handleGeoClick(`/algarve/portimao/${sSlug}`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer capitalize"
                  >
                    <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Portimão {sSlug}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Was this helpful feedback */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-medium">
                {lang === 'en' ? 'Was this answer clear?' : 'Esta resposta foi clara?'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHelpfulFeedback('yes')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    helpfulFeedback === 'yes'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Yes, clear' : 'Sim, clara'}</span>
                </button>
                <button
                  onClick={() => setHelpfulFeedback('no')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    helpfulFeedback === 'no'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Needs detail' : 'Precisa de mais detalhe'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ARTICLES CATALOG LISTING VIEW */
        <div className="space-y-6">
          {/* Search Bar & Category Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'en'
                    ? 'Search questions (e.g., price, call-out fee, estimate, Portimão)...'
                    : 'Pesquisar perguntas (ex: preço, taxa de deslocação, estimativa)...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar shrink-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {lang === 'en' ? 'All Questions' : 'Todas as Perguntas'}
              </button>
              <button
                onClick={() => setSelectedCategory('pricing')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedCategory === 'pricing'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {lang === 'en' ? '💰 Pricing & Fees' : '💰 Preços e Taxas'}
              </button>
              <button
                onClick={() => setSelectedCategory('how-it-works')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedCategory === 'how-it-works'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {lang === 'en' ? '⚙️ How It Works' : '⚙️ Como Funciona'}
              </button>
              <button
                onClick={() => setSelectedCategory('customer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedCategory === 'customer'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {lang === 'en' ? '👤 Customer Choice' : '👤 Escolha do Cliente'}
              </button>
              <button
                onClick={() => setSelectedCategory('services')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedCategory === 'services'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {lang === 'en' ? '🛠️ Services & Scope' : '🛠️ Serviços e Âmbito'}
              </button>
            </div>
          </div>

          {/* Article Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map(art => (
              <div
                key={art.id}
                onClick={() => setSelectedArticleSlug(art.slug)}
                className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-bold text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      {art.categoryLabel[lang]}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {art.readingTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {art.title[lang]}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {art.summary[lang]}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>{lang === 'en' ? 'Read Full Answer' : 'Ler Resposta Completa'}</span>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
