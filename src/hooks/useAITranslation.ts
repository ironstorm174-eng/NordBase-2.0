import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  targetLanguage: string;
  detectedLanguage: string;
  cached: boolean;
  recommendation?: any;
}

// In-memory client side cache for instantaneous re-renders
const clientTranslationCache = new Map<string, TranslationResult>();

export function useAITranslation() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';

  const translate = useCallback(async (
    text: string,
    targetLanguage?: string,
    sourceLanguage?: string,
    context?: string
  ): Promise<TranslationResult> => {
    const targetLang = targetLanguage || currentLang;
    if (!text || !text.trim()) {
      return {
        originalText: text,
        translatedText: text,
        targetLanguage: targetLang,
        detectedLanguage: sourceLanguage || 'auto',
        cached: false
      };
    }

    const cacheKey = `${text.trim().toLowerCase()}_to_${targetLang.toLowerCase()}`;
    if (clientTranslationCache.has(cacheKey)) {
      return clientTranslationCache.get(cacheKey)!;
    }

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLanguage: targetLang,
          sourceLanguage,
          context
        })
      });

      if (!res.ok) {
        throw new Error(`Translation endpoint error: ${res.status}`);
      }

      const data: TranslationResult = await res.json();
      clientTranslationCache.set(cacheKey, data);
      return data;
    } catch (err) {
      console.warn('[useAITranslation] Fallback to original text due to network/AI error:', err);
      const fallback: TranslationResult = {
        originalText: text,
        translatedText: text,
        targetLanguage: targetLang,
        detectedLanguage: sourceLanguage || 'auto',
        cached: false
      };
      return fallback;
    }
  }, [currentLang]);

  return {
    translate,
    currentLanguage: currentLang
  };
}

/**
 * Hook to manage automatic dynamic translation and toggle original text for a specific message
 */
export function useAutoTranslatedText(
  text: string,
  userTargetLanguage?: string,
  context?: string
) {
  const { i18n } = useTranslation();
  const targetLang = userTargetLanguage || i18n.language || 'pt';
  const { translate } = useAITranslation();

  const [translatedText, setTranslatedText] = useState<string>(text);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('auto');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (!text || !text.trim()) {
      setTranslatedText(text);
      return;
    }

    setIsLoading(true);
    translate(text, targetLang, undefined, context)
      .then((res) => {
        if (isMounted) {
          setTranslatedText(res.translatedText || text);
          setDetectedLanguage(res.detectedLanguage || 'auto');
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTranslatedText(text);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [text, targetLang, context, translate]);

  const toggleShowOriginal = useCallback(() => {
    setShowOriginal((prev) => !prev);
  }, []);

  return {
    displayedText: showOriginal ? text : translatedText,
    originalText: text,
    translatedText,
    detectedLanguage,
    isLoading,
    showOriginal,
    toggleShowOriginal,
    isTranslated: !showOriginal && translatedText !== text
  };
}
