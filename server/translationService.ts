import { GoogleGenAI } from '@google/genai';

export interface GlossaryTerm {
  id: string;
  term: string;
  translations: {
    pt: string;
    en: string;
    ru: string;
  };
  category: string;
}

export interface GlossaryRecommendation {
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

// In-Memory Translation Cache (text_to_targetLang -> translation object)
const translationCache = new Map<string, { translatedText: string; detectedLanguage: string; recommendation?: any }>();

// Baseline NordBase Approved Glossary
export const inMemoryApprovedGlossary: GlossaryTerm[] = [
  { id: 'g-1', term: 'Territorial Partner', translations: { pt: 'Parceiro Territorial', en: 'Territorial Partner', ru: 'Территориальный Партнер' }, category: 'business' },
  { id: 'g-2', term: 'Regional Partner', translations: { pt: 'Parceiro Regional', en: 'Regional Partner', ru: 'Региональный Партнер' }, category: 'business' },
  { id: 'g-3', term: 'National Partner', translations: { pt: 'Parceiro Nacional', en: 'National Partner', ru: 'Национальный Партнер' }, category: 'business' },
  { id: 'g-4', term: 'Lead', translations: { pt: 'Lead', en: 'Lead', ru: 'Лид' }, category: 'marketplace' },
  { id: 'g-5', term: 'Lead Purchase', translations: { pt: 'Compra de Lead', en: 'Lead Purchase', ru: 'Покупка лида' }, category: 'marketplace' },
  { id: 'g-6', term: 'Specialist', translations: { pt: 'Especialista', en: 'Specialist', ru: 'Специалист' }, category: 'marketplace' },
  { id: 'g-7', term: 'Customer', translations: { pt: 'Cliente', en: 'Customer', ru: 'Клиент' }, category: 'marketplace' },
  { id: 'g-8', term: 'Academy', translations: { pt: 'Academia', en: 'Academy', ru: 'Академия' }, category: 'education' },
  { id: 'g-9', term: 'Community', translations: { pt: 'Comunidade', en: 'Community', ru: 'Сообщество' }, category: 'social' },
  { id: 'g-10', term: 'Dashboard', translations: { pt: 'Painel', en: 'Dashboard', ru: 'Панель управления' }, category: 'ui' },
  { id: 'g-11', term: 'Completed Lead', translations: { pt: 'Lead Concluído', en: 'Completed Lead', ru: 'Завершенный лид' }, category: 'marketplace' },
  { id: 'g-12', term: 'Pending Lead', translations: { pt: 'Lead Pendente', en: 'Pending Lead', ru: 'Лид в ожидании' }, category: 'marketplace' },
  { id: 'g-13', term: 'Cancelled Lead', translations: { pt: 'Lead Cancelado', en: 'Cancelled Lead', ru: 'Отмененный лид' }, category: 'marketplace' },
  { id: 'g-14', term: 'Referral', translations: { pt: 'Recomendação', en: 'Referral', ru: 'Реферал' }, category: 'business' },
  { id: 'g-15', term: 'Rating', translations: { pt: 'Avaliação', en: 'Rating', ru: 'Рейтинг' }, category: 'marketplace' },
  { id: 'g-16', term: 'Commission', translations: { pt: 'Comissão', en: 'Commission', ru: 'Комиссия' }, category: 'business' },
  { id: 'g-17', term: 'Territory', translations: { pt: 'Território', en: 'Territory', ru: 'Территория' }, category: 'business' },
  { id: 'g-18', term: 'Shift', translations: { pt: 'Turno', en: 'Shift', ru: 'Смена' }, category: 'operations' },
  { id: 'g-19', term: 'Recibo Verde', translations: { pt: 'Recibo Verde', en: 'Recibo Verde (Tax Receipt)', ru: 'Recibo Verde (Квитанция)' }, category: 'finance' },
  { id: 'g-20', term: 'Quadro Elétrico', translations: { pt: 'Quadro Elétrico', en: 'Electrical Panel', ru: 'Электрощит' }, category: 'trade' }
];

// In-Memory Storage for Knowledge Evolution Recommendations
export const inMemoryGlossaryRecommendations: GlossaryRecommendation[] = [];

// Initialize Gemini Client
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

/**
 * Universal Core AI Translation Function
 */
export async function translateMessage(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string,
  context?: string
): Promise<{
  originalText: string;
  translatedText: string;
  targetLanguage: string;
  detectedLanguage: string;
  cached: boolean;
  recommendation: GlossaryRecommendation | null;
}> {
  if (!text || !text.trim()) {
    return {
      originalText: text,
      translatedText: text,
      targetLanguage,
      detectedLanguage: sourceLanguage || 'auto',
      cached: false,
      recommendation: null
    };
  }

  const cleanTargetLang = (targetLanguage || 'pt').toLowerCase().trim();
  const cacheKey = `${text.trim().toLowerCase()}_to_${cleanTargetLang}`;

  // 1. Check Translation Cache
  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey)!;
    return {
      originalText: text,
      translatedText: cached.translatedText,
      targetLanguage: cleanTargetLang,
      detectedLanguage: cached.detectedLanguage,
      cached: true,
      recommendation: cached.recommendation || null
    };
  }

  const ai = getGenAI();
  if (!ai) {
    // Graceful fallback if AI key is missing - return original text safely
    return {
      originalText: text,
      translatedText: text,
      targetLanguage: cleanTargetLang,
      detectedLanguage: sourceLanguage || 'auto',
      cached: false,
      recommendation: null
    };
  }

  // Build active glossary list as a string for prompt enforcement
  const glossaryPrompt = inMemoryApprovedGlossary.map(
    g => `• "${g.term}": PT="${g.translations.pt}", EN="${g.translations.en}", RU="${g.translations.ru}"`
  ).join('\n');

  const systemInstruction = `You are NordBase's Universal AI Multilingual Communication Engine for Portugal & Europe.
Your mission is to translate messages naturally and contextually so human communication remains seamless.

CRITICAL TRANSLATION RULES:
1. Target Language: Translate into "${cleanTargetLang}" (pt = Portuguese, en = English, ru = Russian, es = Spanish, fr = French, de = German, uk = Ukrainian).
2. DO NOT MODIFY OR TRANSLATE:
   - People's names, company names
   - Physical street addresses, GPS coordinates
   - Phone numbers, email addresses, URLs
   - Monetary amounts (e.g. "15€", "150 EUR", "$50")
   - Invoice numbers, tax IDs (NIF), dates
3. ENFORCE NORDBASE OFFICIAL GLOSSARY:
${glossaryPrompt}
4. DOMAIN & TRADE CONTEXT:
   - Understand trade terminology (Electrician, Plumber, HVAC, Drywall, Painter, Water Heater / Esquentador, Circuit Breaker / Disjuntor, Electrical Panel / Quadro Elétrico, Emergency Call / Piquete de Urgência, Recibo Verde).
   - Translate by true professional meaning, never word-for-word.
5. KNOWLEDGE EVOLUTION SYSTEM:
   - Identify if the input contains any specialized Portuguese/European trade term, local jargon, or business concept not in standard baseline dictionaries (e.g., "Recibo Verde", "Abertura de portas", "Quadro elétrico", "Termoacumulador", "Esquentador ventilado").
   - If found, provide a recommendation object. Otherwise set recommendation to null.

OUTPUT FORMAT:
Return ONLY a strictly valid JSON object without markdown formatting:
{
  "translatedText": "Translated message string",
  "detectedLanguage": "2-letter ISO code or auto detection (e.g. pt, en, ru, es)",
  "recommendation": {
    "originalTerm": "Term string",
    "detectedLanguage": "pt",
    "suggestedTranslations": {
      "pt": "...",
      "en": "...",
      "ru": "..."
    },
    "context": "Brief context explanation",
    "confidence": 95
  }
}`;

  try {
    // Call Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Translate this user message contextually into language code "${cleanTargetLang}".\n${context ? `Context: ${context}\n` : ''}Message: "${text}"`
            }
          ]
        }
      ],
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text?.trim() || '';
    let parsed: any = null;

    try {
      // Remove any accidental markdown json fences
      const cleanJsonStr = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      parsed = JSON.parse(cleanJsonStr);
    } catch (jsonErr) {
      console.warn('Gemini translation JSON parse warning, using raw text:', responseText);
      parsed = {
        translatedText: responseText || text,
        detectedLanguage: sourceLanguage || 'auto',
        recommendation: null
      };
    }

    const translatedText = parsed.translatedText || text;
    const detectedLanguage = parsed.detectedLanguage || sourceLanguage || 'auto';
    let recObj: GlossaryRecommendation | null = null;

    if (parsed.recommendation && parsed.recommendation.originalTerm) {
      const rec = parsed.recommendation;
      const termLower = rec.originalTerm.trim().toLowerCase();

      // Check if recommendation already recorded in memory
      const existing = inMemoryGlossaryRecommendations.find(
        r => r.originalTerm.toLowerCase() === termLower && r.status === 'pending'
      );

      if (existing) {
        existing.occurrences += 1;
        recObj = existing;
      } else {
        recObj = {
          id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          originalTerm: rec.originalTerm.trim(),
          detectedLanguage: rec.detectedLanguage || detectedLanguage,
          suggestedTranslations: {
            pt: rec.suggestedTranslations?.pt || rec.originalTerm,
            en: rec.suggestedTranslations?.en || rec.originalTerm,
            ru: rec.suggestedTranslations?.ru || rec.originalTerm
          },
          context: rec.context || context || 'Detected from platform chat',
          confidence: rec.confidence || 90,
          occurrences: 1,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        inMemoryGlossaryRecommendations.push(recObj);
      }
    }

    // Cache translation
    translationCache.set(cacheKey, {
      translatedText,
      detectedLanguage,
      recommendation: recObj
    });

    return {
      originalText: text,
      translatedText,
      targetLanguage: cleanTargetLang,
      detectedLanguage,
      cached: false,
      recommendation: recObj
    };

  } catch (err: any) {
    console.error('Gemini translation error, falling back to original message:', err.message || err);
    // Safe non-blocking fallback
    return {
      originalText: text,
      translatedText: text,
      targetLanguage: cleanTargetLang,
      detectedLanguage: sourceLanguage || 'auto',
      cached: false,
      recommendation: null
    };
  }
}
