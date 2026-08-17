import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Check, X, Loader2 } from 'lucide-react';

interface AIMessagePolisherProps {
  currentText: string;
  onApply: (improvedText: string) => void;
  context?: string;
}

export const AIMessagePolisher: React.FC<AIMessagePolisherProps> = ({
  currentText,
  onApply,
  context
}) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleImprove = async () => {
    if (!currentText || !currentText.trim() || loading) return;

    setLoading(true);
    setIsOpen(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          targetLanguage: i18n.language || 'pt',
          context: `Improve grammar, polite professional tone, and terminology for this NordBase chat message. Original: "${currentText}". Context: ${context || 'Local service communication'}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translatedText && data.translatedText !== currentText) {
          setSuggestion(data.translatedText);
        } else {
          setSuggestion(currentText);
        }
      } else {
        setSuggestion(currentText);
      }
    } catch (err) {
      console.warn('AI Message Polish failed:', err);
      setSuggestion(currentText);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (suggestion) {
      onApply(suggestion);
    }
    setIsOpen(false);
    setSuggestion(null);
  };

  const handleReject = () => {
    setIsOpen(false);
    setSuggestion(null);
  };

  if (!currentText || !currentText.trim()) return null;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleImprove}
        disabled={loading}
        className="p-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/50 border border-cyan-500/20 transition-all text-xs flex items-center gap-1 shrink-0"
        title={t('chat.aiImprove', 'Melhorar Mensagem com IA')}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        )}
        <span className="hidden sm:inline font-medium text-[11px]">{t('chat.aiPolishBtn', 'IA Polish')}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-72 sm:w-80 p-3 bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl z-50 text-xs">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800 text-cyan-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {t('chat.aiSuggestionTitle', 'Sugestão da IA NordBase')}
            </span>
            <button onClick={handleReject} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-4 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>{t('chat.aiAnalyzing', 'A otimizar gramática e tom...')}</span>
            </div>
          ) : (
            <>
              <div className="p-2.5 bg-slate-950/80 rounded-lg text-slate-200 border border-slate-800 mb-3 whitespace-pre-wrap max-h-36 overflow-y-auto">
                {suggestion}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-2.5 py-1 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  {t('common.cancel', 'Manter Atual')}
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center gap-1 transition-colors shadow-lg shadow-cyan-900/40"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('chat.applySuggestion', 'Aplicar Sugestão')}</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
