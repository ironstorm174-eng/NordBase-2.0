import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAutoTranslatedText } from '../hooks/useAITranslation';
import { Globe, RefreshCw, Sparkles, } from 'lucide-react';
interface AITranslatedMessageProps {
  content: string;
  targetLanguage?: string;
  context?: string;
  className?: string;
  showBadge?: boolean;
  inline?: boolean;
}
export const AITranslatedMessage: React.FC<AITranslatedMessageProps> = ({
  content,
  targetLanguage,
  context,
  className = '',
  showBadge = true,
  inline = false
}) => {
  const { t } = useTranslation();
  const {
    displayedText,
    originalText,
    translatedText,
    detectedLanguage,
    isLoading,
    showOriginal,
    toggleShowOriginal,
    isTranslated
  } = useAutoTranslatedText(content, targetLanguage, context);
  if (!content) return null;
  return (
    <div className={`group relative ${inline ? 'inline-block' : 'block'} ${className}`}>
      <span className="whitespace-pre-wrap break-words">{displayedText}</span>
      {/* Loading state indicator */}
      {isLoading && (
        <span className="inline-flex items-center ml-2 text-cyan-400 text-xs animate-pulse" title="AI Translating...">
          <RefreshCw className="w-3 h-3 animate-spin mr-1" />
          <span className="opacity-75">AI</span>
        </span>
      )}
      {/* Translation badge & toggle controls */}
      {!isLoading && showBadge && isTranslated && (
        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400 select-none">
          <button
            type="button"
            onClick={toggleShowOriginal}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/20 text-cyan-300 transition-colors"
            title={showOriginal ? 'Switch to AI Translation' : 'View Original Message'}
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>{showOriginal ? t('chat.showTranslated', 'Ver Traduzido') : t('chat.showOriginal', 'Ver Original')}</span>
          </button>
          {!showOriginal && (
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
              <span>
                {detectedLanguage.toUpperCase()} → {(targetLanguage || 'pt').toUpperCase()}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};