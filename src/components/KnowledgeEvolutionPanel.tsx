import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Search,
  Tag,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
interface GlossaryTerm {
  id: string;
  term: string;
  translations: {
    pt: string;
    en: string;
    ru: string;
  };
  category: string;
}
interface GlossaryRecommendation {
  id: string;
  originalTerm: string;
  detectedLanguage: string;
  suggestedTranslations: {
    pt: string;
    en: string;
    ru: string;
  };
  context: string;
  confidence: number;
  occurrences: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
export const KnowledgeEvolutionPanel: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'recommendations' | 'glossary'>('recommendations');
  const [recommendations, setRecommendations] = useState<GlossaryRecommendation[]>([]);
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/translate/glossary-recommendations');
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
      }
    } catch (err) {
      console.error('Failed to fetch glossary recommendations:', err);
    } finally {
      setLoading(false);
    }
  };
  const fetchGlossary = async () => {
    try {
      const res = await fetch('/api/translate/glossary');
      if (res.ok) {
        const data = await res.json();
        setGlossary(data);
      }
    } catch (err) {
      console.error('Failed to fetch approved glossary:', err);
    }
  };
  useEffect(() => {
    fetchRecommendations();
    fetchGlossary();
  }, []);
  const handleApprove = async (rec: GlossaryRecommendation) => {
    let token = '';
    try {
      const stored = localStorage.getItem('nordbase_work_state_v2');
      if (stored) {
        token = JSON.parse(stored)?.currentUser?.token || '';
      }
    } catch (e) {
      console.warn('Failed to parse token for glossary recommendation approval:', e);
    }
    try {
      const res = await fetch('/api/translate/glossary-recommendations/approve', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: rec.id,
          term: rec.originalTerm,
          translations: rec.suggestedTranslations,
          category: 'trade'
        })
      });
      if (res.ok) {
        setRecommendations(prev => prev.filter(r => r.id !== rec.id));
        fetchGlossary();
      }
    } catch (err) {
      console.error('Failed to approve recommendation:', err);
    }
  };
  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/translate/glossary-recommendations/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setRecommendations(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Failed to reject recommendation:', err);
    }
  };
  const filteredGlossary = glossary.filter(
    item =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translations.pt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translations.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translations.ru.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{t('knowledge.badge', 'Knowledge Evolution System')}</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>{t('knowledge.title', 'NordBase Multilingual Glossary')}</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {t('knowledge.subtitle', 'A IA deteta nova terminologia de mercado em tempo real. Os administradores validam os termos antes da publicação no Glossário Global.')}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'recommendations'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('knowledge.tabRecommendations', 'Recomendações da IA')}</span>
            {recommendations.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold">
                {recommendations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'glossary'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('knowledge.tabGlossary', 'Glossário Aprovado')}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
              {glossary.length}
            </span>
          </button>
        </div>
      </div>
      {/* Tab 1: Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">
              {t('knowledge.pendingTitle', 'Termos Pendentes de Aprovação')}
            </h3>
            <button
              onClick={fetchRecommendations}
              disabled={loading}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{t('common.refresh', 'Atualizar')}</span>
            </button>
          </div>
          {recommendations.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800/80 text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-500/60 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">
                {t('knowledge.noPending', 'Todos os termos detetados foram revistos!')}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                A IA continuará a monitorizar os chats para detetar novos termos técnicos.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map(rec => (
                <div
                  key={rec.id}
                  className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/30 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-cyan-300">{rec.originalTerm}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] uppercase">
                        {rec.detectedLanguage}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] border border-cyan-500/20 flex items-center gap-1">
                        <ThumbsUp className="w-2.5 h-2.5" />
                        Confiança: {rec.confidence}%
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] border border-purple-500/20">
                        Ocorrências: {rec.occurrences}
                      </span>
                    </div>
                    {rec.context && (
                      <p className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded border border-slate-800/50">
                        <span className="font-semibold text-slate-300">Contexto:</span> {rec.context}
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">PT (Português)</span>
                        <span className="text-slate-200 font-medium">{rec.suggestedTranslations.pt}</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">EN (English)</span>
                        <span className="text-slate-200 font-medium">{rec.suggestedTranslations.en}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <button
                      onClick={() => handleReject(rec.id)}
                      className="px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/20 text-red-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{t('common.reject', 'Rejeitar')}</span>
                    </button>
                    <button
                      onClick={() => handleApprove(rec)}
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-900/40"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('common.approve', 'Aprovar Termo')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Tab 2: Approved Glossary */}
      {activeTab === 'glossary' && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder={t('knowledge.searchPlaceholder', 'Pesquisar termo no Glossário NordBase...')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredGlossary.map(item => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 text-sm">{item.term}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-semibold uppercase flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />
                    {item.category}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-900">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">PT</span>
                    <span className="text-slate-300">{item.translations.pt}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">EN</span>
                    <span className="text-slate-300">{item.translations.en}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">RU</span>
                    <span className="text-slate-300">{item.translations.ru}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};