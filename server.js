// server.ts
import express from "express";
import path from "path";
import crypto from "crypto";
import { Pool } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";

// server/translationService.ts
import { GoogleGenAI } from "@google/genai";
var translationCache = /* @__PURE__ */ new Map();
var inMemoryApprovedGlossary = [
  { id: "g-1", term: "Territorial Partner", translations: { pt: "Parceiro Territorial", en: "Territorial Partner", ru: "\u0422\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u041F\u0430\u0440\u0442\u043D\u0435\u0440" }, category: "business" },
  { id: "g-2", term: "Regional Partner", translations: { pt: "Parceiro Regional", en: "Regional Partner", ru: "\u0420\u0435\u0433\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u041F\u0430\u0440\u0442\u043D\u0435\u0440" }, category: "business" },
  { id: "g-3", term: "National Partner", translations: { pt: "Parceiro Nacional", en: "National Partner", ru: "\u041D\u0430\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u041F\u0430\u0440\u0442\u043D\u0435\u0440" }, category: "business" },
  { id: "g-4", term: "Lead", translations: { pt: "Lead", en: "Lead", ru: "\u041B\u0438\u0434" }, category: "marketplace" },
  { id: "g-5", term: "Lead Purchase", translations: { pt: "Compra de Lead", en: "Lead Purchase", ru: "\u041F\u043E\u043A\u0443\u043F\u043A\u0430 \u043B\u0438\u0434\u0430" }, category: "marketplace" },
  { id: "g-6", term: "Specialist", translations: { pt: "Especialista", en: "Specialist", ru: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442" }, category: "marketplace" },
  { id: "g-7", term: "Customer", translations: { pt: "Cliente", en: "Customer", ru: "\u041A\u043B\u0438\u0435\u043D\u0442" }, category: "marketplace" },
  { id: "g-8", term: "Academy", translations: { pt: "Academia", en: "Academy", ru: "\u0410\u043A\u0430\u0434\u0435\u043C\u0438\u044F" }, category: "education" },
  { id: "g-9", term: "Community", translations: { pt: "Comunidade", en: "Community", ru: "\u0421\u043E\u043E\u0431\u0449\u0435\u0441\u0442\u0432\u043E" }, category: "social" },
  { id: "g-10", term: "Dashboard", translations: { pt: "Painel", en: "Dashboard", ru: "\u041F\u0430\u043D\u0435\u043B\u044C \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F" }, category: "ui" },
  { id: "g-11", term: "Completed Lead", translations: { pt: "Lead Conclu\xEDdo", en: "Completed Lead", ru: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044B\u0439 \u043B\u0438\u0434" }, category: "marketplace" },
  { id: "g-12", term: "Pending Lead", translations: { pt: "Lead Pendente", en: "Pending Lead", ru: "\u041B\u0438\u0434 \u0432 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0438" }, category: "marketplace" },
  { id: "g-13", term: "Cancelled Lead", translations: { pt: "Lead Cancelado", en: "Cancelled Lead", ru: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D\u043D\u044B\u0439 \u043B\u0438\u0434" }, category: "marketplace" },
  { id: "g-14", term: "Referral", translations: { pt: "Recomenda\xE7\xE3o", en: "Referral", ru: "\u0420\u0435\u0444\u0435\u0440\u0430\u043B" }, category: "business" },
  { id: "g-15", term: "Rating", translations: { pt: "Avalia\xE7\xE3o", en: "Rating", ru: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433" }, category: "marketplace" },
  { id: "g-16", term: "Commission", translations: { pt: "Comiss\xE3o", en: "Commission", ru: "\u041A\u043E\u043C\u0438\u0441\u0441\u0438\u044F" }, category: "business" },
  { id: "g-17", term: "Territory", translations: { pt: "Territ\xF3rio", en: "Territory", ru: "\u0422\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F" }, category: "business" },
  { id: "g-18", term: "Shift", translations: { pt: "Turno", en: "Shift", ru: "\u0421\u043C\u0435\u043D\u0430" }, category: "operations" },
  { id: "g-19", term: "Recibo Verde", translations: { pt: "Recibo Verde", en: "Recibo Verde (Tax Receipt)", ru: "Recibo Verde (\u041A\u0432\u0438\u0442\u0430\u043D\u0446\u0438\u044F)" }, category: "finance" },
  { id: "g-20", term: "Quadro El\xE9trico", translations: { pt: "Quadro El\xE9trico", en: "Electrical Panel", ru: "\u042D\u043B\u0435\u043A\u0442\u0440\u043E\u0449\u0438\u0442" }, category: "trade" }
];
var inMemoryGlossaryRecommendations = [];
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
    return null;
  }
}
async function translateMessage(text, targetLanguage, sourceLanguage, context) {
  if (!text || !text.trim()) {
    return {
      originalText: text,
      translatedText: text,
      targetLanguage,
      detectedLanguage: sourceLanguage || "auto",
      cached: false,
      recommendation: null
    };
  }
  const cleanTargetLang = (targetLanguage || "pt").toLowerCase().trim();
  const cacheKey = `${text.trim().toLowerCase()}_to_${cleanTargetLang}`;
  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey);
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
    return {
      originalText: text,
      translatedText: text,
      targetLanguage: cleanTargetLang,
      detectedLanguage: sourceLanguage || "auto",
      cached: false,
      recommendation: null
    };
  }
  const glossaryPrompt = inMemoryApprovedGlossary.map(
    (g) => `\u2022 "${g.term}": PT="${g.translations.pt}", EN="${g.translations.en}", RU="${g.translations.ru}"`
  ).join("\n");
  const systemInstruction = `You are NordBase's Universal AI Multilingual Communication Engine for Portugal & Europe.
Your mission is to translate messages naturally and contextually so human communication remains seamless.

CRITICAL TRANSLATION RULES:
1. Target Language: Translate into "${cleanTargetLang}" (pt = Portuguese, en = English, ru = Russian, es = Spanish, fr = French, de = German, uk = Ukrainian).
2. DO NOT MODIFY OR TRANSLATE:
   - People's names, company names
   - Physical street addresses, GPS coordinates
   - Phone numbers, email addresses, URLs
   - Monetary amounts (e.g. "15\u20AC", "150 EUR", "$50")
   - Invoice numbers, tax IDs (NIF), dates
3. ENFORCE NORDBASE OFFICIAL GLOSSARY:
${glossaryPrompt}
4. DOMAIN & TRADE CONTEXT:
   - Understand trade terminology (Electrician, Plumber, HVAC, Drywall, Painter, Water Heater / Esquentador, Circuit Breaker / Disjuntor, Electrical Panel / Quadro El\xE9trico, Emergency Call / Piquete de Urg\xEAncia, Recibo Verde).
   - Translate by true professional meaning, never word-for-word.
5. KNOWLEDGE EVOLUTION SYSTEM:
   - Identify if the input contains any specialized Portuguese/European trade term, local jargon, or business concept not in standard baseline dictionaries (e.g., "Recibo Verde", "Abertura de portas", "Quadro el\xE9trico", "Termoacumulador", "Esquentador ventilado").
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
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Translate this user message contextually into language code "${cleanTargetLang}".
${context ? `Context: ${context}
` : ""}Message: "${text}"`
            }
          ]
        }
      ],
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });
    const responseText = response.text?.trim() || "";
    let parsed = null;
    try {
      const cleanJsonStr = responseText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      parsed = JSON.parse(cleanJsonStr);
    } catch (jsonErr) {
      console.warn("Gemini translation JSON parse warning, using raw text:", responseText);
      parsed = {
        translatedText: responseText || text,
        detectedLanguage: sourceLanguage || "auto",
        recommendation: null
      };
    }
    const translatedText = parsed.translatedText || text;
    const detectedLanguage = parsed.detectedLanguage || sourceLanguage || "auto";
    let recObj = null;
    if (parsed.recommendation && parsed.recommendation.originalTerm) {
      const rec = parsed.recommendation;
      const termLower = rec.originalTerm.trim().toLowerCase();
      const existing = inMemoryGlossaryRecommendations.find(
        (r) => r.originalTerm.toLowerCase() === termLower && r.status === "pending"
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
          context: rec.context || context || "Detected from platform chat",
          confidence: rec.confidence || 90,
          occurrences: 1,
          status: "pending",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        inMemoryGlossaryRecommendations.push(recObj);
      }
    }
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
  } catch (err) {
    console.error("Gemini translation error, falling back to original message:", err.message || err);
    return {
      originalText: text,
      translatedText: text,
      targetLanguage: cleanTargetLang,
      detectedLanguage: sourceLanguage || "auto",
      cached: false,
      recommendation: null
    };
  }
}

// src/data/knowledgeBaseArticles.ts
var KNOWLEDGE_BASE_ARTICLES = [
  {
    id: "kb_price_change_after_visit",
    slug: "can-final-price-change-after-specialist-visits",
    category: "pricing",
    categoryLabel: {
      en: "Pricing & Estimates",
      pt: "Pre\xE7os e Estimativas"
    },
    title: {
      en: "Can the final price change after the specialist visits?",
      pt: "O pre\xE7o final pode mudar ap\xF3s a visita do especialista?"
    },
    summary: {
      en: "Yes. Initial online or phone estimates are preliminary guidance. The Specialist assesses exact on-site conditions and provides a final price before work begins.",
      pt: "Sim. As estimativas iniciais por telefone ou online s\xE3o preliminares. O especialista avalia o local e apresenta o pre\xE7o final antes de iniciar o trabalho."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Preliminary Estimate vs On-Site Assessment",
          pt: "Estimativa Preliminar vs Avalia\xE7\xE3o no Local"
        },
        body: {
          en: "When you describe your problem online or over the phone, NordBase provides an initial preliminary estimate based on typical jobs. However, actual on-site conditions\u2014such as hidden pipe corrosion, electrical wiring access, or specific replacement parts\u2014can only be verified upon physical inspection.",
          pt: "Ao descrever o problema online ou por telefone, a NordBase fornece uma estimativa preliminar com base em trabalhos t\xEDpicos. No entanto, as condi\xE7\xF5es reais no local\u2014como corros\xE3o oculta, acesso ao quadro el\xE9trico ou pe\xE7as espec\xEDficas\u2014s\xF3 podem ser verificadas ap\xF3s inspe\xE7\xE3o f\xEDsica."
        }
      },
      {
        title: {
          en: "Your Approval Is Required Before Work Begins",
          pt: "A Sua Aprova\xE7\xE3o \xC9 Obrigat\xF3ria Antes do In\xEDcio"
        },
        body: {
          en: "If the Specialist determines after inspection that the work requires additional scope or different materials, they will present a revised final price. No work will ever begin until you explicitly review and approve this final price.",
          pt: "Se o Especialista determinar ap\xF3s a inspe\xE7\xE3o que o trabalho exige verifica\xE7\xF5es adicionais ou pe\xE7as diferentes, apresentar\xE1 um pre\xE7o final revisto. Nenhum trabalho \xE9 iniciado sem a sua aprova\xE7\xE3o pr\xE9via e expl\xEDcita."
        }
      }
    ],
    faqList: [
      {
        question: {
          en: "Must I accept the revised price on site?",
          pt: "Sou obrigado a aceitar o pre\xE7o revisto no local?"
        },
        answer: {
          en: "No. You have complete freedom to decline the revised quote. If you choose not to proceed, you pay only the standard \u20AC20 call-out fee for the Specialist\u2019s travel and on-site evaluation time.",
          pt: "N\xE3o. Tem total liberdade para recusar o or\xE7amento revisto. Se optar por n\xE3o prosseguir, paga apenas a taxa padr\xE3o de desloca\xE7\xE3o de 20\u20AC referente ao tempo de viagem e diagn\xF3stico."
        }
      }
    ],
    keywords: ["final price change", "specialist visit estimate", "nordbase pricing rule"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman", "repairs"]
  },
  {
    id: "kb_why_price_different_estimate",
    slug: "why-price-different-from-initial-estimate",
    category: "pricing",
    categoryLabel: {
      en: "Pricing & Estimates",
      pt: "Pre\xE7os e Estimativas"
    },
    title: {
      en: "Why can the price be different from the initial estimate?",
      pt: "Por que raz\xE3o o pre\xE7o pode ser diferente da estimativa inicial?"
    },
    summary: {
      en: "Initial estimates are based on the description provided. Hidden damage, required materials, or extra access work revealed during physical inspection can modify the scope.",
      pt: "As estimativas iniciais baseiam-se na descri\xE7\xE3o dada. Danos ocultos, materiais necess\xE1rios ou dificuldades de acesso revelados no local alteram o \xE2mbito."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Factors Influencing On-Site Scope",
          pt: "Fatores que Influenciam o \xC2mbito no Local"
        },
        body: {
          en: 'A preliminary description (e.g. "leaking tap") might hide underlying issues like rusted pipe joints, damaged wall tile backing, or non-standard fittings requiring specialized local supplier parts. The Specialist carefully checks these factors on-site.',
          pt: 'Uma descri\xE7\xE3o preliminar (ex: "torneira a pingar") pode esconder problemas subjacentes como tubos corro\xEDdos, azulejos danificados ou conex\xF5es n\xE3o padr\xE3o que exigem pe\xE7as espec\xEDficas de fornecedores locais.'
        }
      }
    ],
    faqList: [],
    keywords: ["estimate vs quote", "why price changes", "nordbase inspection"],
    relatedServiceSlugs: ["plumbing", "electrical", "repairs"]
  },
  {
    id: "kb_decline_final_price",
    slug: "what-happens-if-i-do-not-accept-final-price",
    category: "pricing",
    categoryLabel: {
      en: "Pricing & Estimates",
      pt: "Pre\xE7os e Estimativas"
    },
    title: {
      en: "What happens if I do not accept the final price?",
      pt: "O que acontece se eu n\xE3o aceitar o pre\xE7o final?"
    },
    summary: {
      en: "If you do not approve the Specialist\u2019s final price proposal, no repair work is performed and you only cover the standard \u20AC20 call-out fee.",
      pt: "Se n\xE3o aprovar a proposta de pre\xE7o final do especialista, nenhum trabalho \xE9 realizado e apenas paga a taxa de desloca\xE7\xE3o de 20\u20AC."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Zero Obligation to Proceed",
          pt: "Zero Obriga\xE7\xE3o de Continuar"
        },
        body: {
          en: "NordBase gives Customers full control over their decision. If the final price exceeds your budget or expectations, simply inform the Specialist. You are under no obligation to proceed with the work.",
          pt: "A NordBase garante aos clientes total controlo na decis\xE3o. Se o pre\xE7o final exceder o seu or\xE7amento ou expectativas, basta informar o Especialista. N\xE3o tem qualquer obriga\xE7\xE3o de aceitar a realiza\xE7\xE3o da obra."
        }
      }
    ],
    faqList: [],
    keywords: ["decline final price", "cancel repair", "20 euro callout"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman", "cleaning", "gardening", "moving", "pools", "repairs"]
  },
  {
    id: "kb_who_pays_visit",
    slug: "who-pays-for-the-specialist-visit",
    category: "pricing",
    categoryLabel: {
      en: "Pricing & Estimates",
      pt: "Pre\xE7os e Estimativas"
    },
    title: {
      en: "Who pays for the specialist\u2019s visit?",
      pt: "Quem paga a desloca\xE7\xE3o e visita do especialista?"
    },
    summary: {
      en: "The Customer covers the standard \u20AC20 call-out fee for the Specialist\u2019s travel and diagnostic visit. If the job proceeds, this call-out fee is included within the agreed final price.",
      pt: "O cliente cobre a taxa padr\xE3o de desloca\xE7\xE3o de 20\u20AC referente \xE0 viagem e diagn\xF3stico do especialista. Se a obra avan\xE7ar, este valor fica inclu\xEDdo no pre\xE7o final acordado."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Understanding the Call-Out Standard",
          pt: "Compreender a Taxa de Desloca\xE7\xE3o"
        },
        body: {
          en: "Specialists invest time and vehicle fuel to inspect your property in Portim\xE3o or surrounding areas. The \u20AC20 call-out fee compensates their physical travel and professional evaluation time.",
          pt: "Os especialistas investem tempo e combust\xEDvel para inspecionar a sua propriedade em Portim\xE3o e \xE1reas circundantes. A taxa de 20\u20AC compensa a viagem e o diagn\xF3stico profissional."
        }
      }
    ],
    faqList: [],
    keywords: ["who pays visit", "callout fee", "specialist travel cost"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman"]
  },
  {
    id: "kb_what_is_callout_fee",
    slug: "what-is-the-20-euro-call-out-fee",
    category: "pricing",
    categoryLabel: {
      en: "Pricing & Estimates",
      pt: "Pre\xE7os e Estimativas"
    },
    title: {
      en: "What is the \u20AC20 call-out fee?",
      pt: "O que \xE9 a taxa de desloca\xE7\xE3o de 20\u20AC?"
    },
    summary: {
      en: "The \u20AC20 call-out fee is the fixed charge covering the Specialist\u2019s physical travel to your property and on-site job evaluation.",
      pt: "A taxa de desloca\xE7\xE3o de 20\u20AC \xE9 o valor fixo que cobre a desloca\xE7\xE3o f\xEDsica do especialista \xE0 sua propriedade e a avalia\xE7\xE3o do trabalho no local."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Fair Compensation for On-Site Inspection",
          pt: "Compensa\xE7\xE3o Justa pela Inspe\xE7\xE3o"
        },
        body: {
          en: "The \u20AC20 call-out fee ensures that independent local technicians are fairly compensated for arriving at your address, assessing the problem, and detailing the exact scope required for the fix.",
          pt: "A taxa de 20\u20AC garante que os t\xE9cnicos locais independentes s\xE3o remunerados de forma justa por se deslocarem \xE0 sua morada, avaliarem o problema e explicarem o trabalho necess\xE1rio."
        }
      }
    ],
    faqList: [],
    keywords: ["20 euro call-out fee", "taxa de deslocacao", "nordbase callout rule"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman", "cleaning", "gardening", "moving", "pools", "repairs"]
  },
  {
    id: "kb_when_callout_charged",
    slug: "when-is-the-20-euro-call-out-fee-charged",
    category: "pricing",
    categoryLabel: {
      en: "Pricing & Estimates",
      pt: "Pre\xE7os e Estimativas"
    },
    title: {
      en: "When is the \u20AC20 call-out fee charged?",
      pt: "Quando \xE9 cobrada a taxa de desloca\xE7\xE3o de 20\u20AC?"
    },
    summary: {
      en: "The \u20AC20 call-out fee applies upon the Specialist\u2019s arrival at your property to perform the on-site evaluation.",
      pt: "A taxa de desloca\xE7\xE3o de 20\u20AC \xE9 devida ap\xF3s a chegada do especialista \xE0 propriedade para efetuar o diagn\xF3stico no local."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "No Charge for Online Request Submission",
          pt: "Sem Custo na Submiss\xE3o Online do Pedido"
        },
        body: {
          en: "Submitting a service request on NordBase is completely free. The \u20AC20 call-out fee is only payable on-site when the Specialist arrives at your location to inspect the job.",
          pt: "Submeter um pedido de servi\xE7o na NordBase \xE9 100% gratuito. A taxa de 20\u20AC s\xF3 se aplica no local quando o especialista chega \xE0 sua morada para inspecionar o trabalho."
        }
      }
    ],
    faqList: [],
    keywords: ["when callout charged", "payment timing", "free online request"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman"]
  },
  {
    id: "kb_callout_included_if_job_proceeds",
    slug: "is-call-out-fee-charged-if-job-goes-ahead",
    category: "pricing",
    categoryLabel: {
      en: "Pricing & Estimates",
      pt: "Pre\xE7os e Estimativas"
    },
    title: {
      en: "Is the \u20AC20 call-out fee charged if the job goes ahead?",
      pt: "A taxa de 20\u20AC \xE9 cobrada se o trabalho for realizado?"
    },
    summary: {
      en: "When you approve the final price and the job proceeds, the \u20AC20 call-out fee is included as part of the total agreed price rather than an extra fee.",
      pt: "Quando aprova o pre\xE7o final e o trabalho avan\xE7a, os 20\u20AC de desloca\xE7\xE3o ficam integrados no valor total acordado, n\xE3o constituindo um custo extra."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Integrated Pricing Structure",
          pt: "Estrutura de Pre\xE7o Integrada"
        },
        body: {
          en: "For approved jobs, the \u20AC20 call-out fee forms part of the agreed contract total. For instance, if the total agreed price for a repair is \u20AC80, you pay \u20AC80 in total, which includes the inspection.",
          pt: "Em trabalhos aprovados, a taxa de 20\u20AC faz parte do total acordado. Por exemplo, se o pre\xE7o total combinado para a repara\xE7\xE3o for 80\u20AC, paga 80\u20AC no total, valor que j\xE1 inclui a visita."
        }
      }
    ],
    faqList: [],
    keywords: ["callout fee included", "total job price", "no double charge"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman", "repairs"]
  },
  {
    id: "kb_insufficient_funds_for_estimated_work",
    slug: "what-happens-if-i-do-not-have-enough-money-for-estimated-work",
    category: "pricing",
    categoryLabel: {
      en: "Pricing & Estimates",
      pt: "Pre\xE7os e Estimativas"
    },
    title: {
      en: "What happens if I do not have enough money for the estimated work?",
      pt: "O que acontece se eu n\xE3o tiver or\xE7amento suficiente para o trabalho estimado?"
    },
    summary: {
      en: "You can discuss reducing the scope of work with the Specialist or decline the full repair, paying only the \u20AC20 call-out fee.",
      pt: "Pode combinar com o especialista a redu\xE7\xE3o do \xE2mbito dos trabalhos ou recusar a obra completa, pagando apenas a taxa de desloca\xE7\xE3o de 20\u20AC."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Options for Adjusting Scope or Budget",
          pt: "Op\xE7\xF5es para Ajustar o \xC2mbito ou Or\xE7amento"
        },
        body: {
          en: "If the total repair cost exceeds your available budget, you have two options: ask the Specialist if essential emergency containment can be performed as a smaller first step, or decline the full job and pay only the \u20AC20 call-out fee.",
          pt: "Se o custo total exceder o seu or\xE7amento, tem duas op\xE7\xF5es: perguntar ao especialista se pode realizar apenas uma interven\xE7\xE3o priorit\xE1ria de conten\xE7\xE3o, ou recusar o servi\xE7o completo e pagar apenas a taxa de 20\u20AC."
        }
      }
    ],
    faqList: [],
    keywords: ["budget limit repair", "adjust job scope", "decline quote"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman", "repairs"]
  },
  {
    id: "kb_smaller_job_scope",
    slug: "can-specialist-complete-smaller-job-than-estimated",
    category: "services",
    categoryLabel: {
      en: "Services & Scope",
      pt: "Servi\xE7os e \xC2mbito"
    },
    title: {
      en: "Can the specialist complete a smaller job than originally estimated?",
      pt: "O especialista pode fazer um trabalho menor do que o estimado originalmente?"
    },
    summary: {
      en: "Yes. Upon mutual agreement on-site, the Specialist can adjust the job scope to focus only on critical immediate needs.",
      pt: "Sim. Por acordo m\xFAtuo no local, o especialista pode ajustar o \xE2mbito do trabalho para se focar apenas nas necessidades imediatas."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Flexible On-Site Adjustments",
          pt: "Ajustes Flex\xEDveis no Local"
        },
        body: {
          en: "If you originally requested full bathroom fixture replacement but choose on-site to fix only the leaking main valve, the Specialist can recalculate a revised final price for just the smaller scope.",
          pt: "Se inicialmente pediu a substitui\xE7\xE3o de v\xE1rias pe\xE7as de casa de banho mas no local preferir reparar apenas a v\xE1lvula com fuga, o especialista recalcula o pre\xE7o para essa interven\xE7\xE3o mais reduzida."
        }
      }
    ],
    faqList: [],
    keywords: ["smaller job scope", "partial repair", "custom scope"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman"]
  },
  {
    id: "kb_approve_before_start",
    slug: "do-i-have-to-approve-final-price-before-work-starts",
    category: "pricing",
    categoryLabel: {
      en: "Pricing & Estimates",
      pt: "Pre\xE7os e Estimativas"
    },
    title: {
      en: "Do I have to approve the final price before work starts?",
      pt: "Tenho de aprovar o pre\xE7o final antes do in\xEDcio do trabalho?"
    },
    summary: {
      en: "Yes, absolutely. NordBase policy strictly requires Customer approval of the final price before any physical repair or maintenance begins.",
      pt: "Sim, absolutamente. A pol\xEDtica da NordBase exige obrigatoriamente a aprova\xE7\xE3o do cliente sobre o pre\xE7o final antes de qualquer trabalho."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Strict Pre-Approval Rule",
          pt: "Regra Estrita de Pr\xE9-Aprova\xE7\xE3o"
        },
        body: {
          en: "Specialists are strictly instructed never to start work or dismantle property fittings without your prior explicit agreement on the final price. This ensures 100% price transparency and zero surprises.",
          pt: "Os especialistas est\xE3o instru\xEDdos a nunca iniciar trabalhos sem o seu acordo pr\xE9vio sobre o pre\xE7o final. Isto garante 100% de transpar\xEAncia e evita surpresas."
        }
      }
    ],
    faqList: [],
    keywords: ["approve before work", "price approval rule", "no surprise fees"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman", "cleaning", "gardening", "moving", "pools", "repairs"]
  },
  {
    id: "kb_after_describe_problem",
    slug: "what-happens-after-i-describe-my-problem",
    category: "how-it-works",
    categoryLabel: {
      en: "How NordBase Works",
      pt: "Como Funciona"
    },
    title: {
      en: "What happens after I describe my problem?",
      pt: "O que acontece depois de descrever o meu problema?"
    },
    summary: {
      en: "Your request is routed to local coordination in Portim\xE3o, matching you with an available qualified independent Specialist.",
      pt: "O seu pedido \xE9 encaminhado para a coordena\xE7\xE3o local em Portim\xE3o, que o liga a um especialista local qualificado e dispon\xEDvel."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Local Service Coordination Flow",
          pt: "Fluxo de Coordena\xE7\xE3o Local de Servi\xE7o"
        },
        body: {
          en: "Once submitted, our local coordination reviews your job requirements and contacts a verified local Specialist in Portim\xE3o. You receive prompt confirmation and the Specialist contacts you to confirm the visit time.",
          pt: "Ap\xF3s o envio, a nossa coordena\xE7\xE3o local analisa o pedido e liga-o a um especialista verificado em Portim\xE3o. Recebe confirma\xE7\xE3o r\xE1pida e o especialista entra em contacto para combinar a visita."
        }
      }
    ],
    faqList: [],
    keywords: ["after request submitted", "nordbase dispatch flow", "local specialist contact"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman", "cleaning", "gardening", "moving", "pools", "repairs"]
  },
  {
    id: "kb_how_find_specialist",
    slug: "how-does-nordbase-find-a-local-specialist",
    category: "how-it-works",
    categoryLabel: {
      en: "How NordBase Works",
      pt: "Como Funciona"
    },
    title: {
      en: "How does NordBase find a local specialist?",
      pt: "Como \xE9 que o NordBase encontra um especialista local?"
    },
    summary: {
      en: "NordBase uses local territory coordination in Portugal to match your job category and location with verified independent contractors.",
      pt: "A NordBase utiliza coordena\xE7\xE3o territorial local em Portugal para cruzar a categoria do pedido e a localiza\xE7\xE3o com profissionais independentes verificados."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Verified Local Contractor Network",
          pt: "Rede de Profissionais Locais Verificados"
        },
        body: {
          en: "Our local dispatch team maintains contacts with qualified independent plumbers, electricians, handymen, and technicians operating in Portim\xE3o and Western Algarve. We connect you directly with a specialist suited to your specific problem.",
          pt: "A nossa equipa de coordena\xE7\xE3o local mant\xE9m contacto com canalizadores, eletricistas e t\xE9cnicos qualificados em Portim\xE3o e Barlavento. Ligamo-lo diretamente a um profissional adequado ao seu problema."
        }
      }
    ],
    faqList: [],
    keywords: ["find local specialist", "verified contractor portugal", "portimao plumber network"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman", "repairs"]
  },
  {
    id: "kb_can_refuse_specialist",
    slug: "can-i-refuse-a-specialist",
    category: "customer",
    categoryLabel: {
      en: "Customer Expectations",
      pt: "Apoio ao Cliente"
    },
    title: {
      en: "Can I refuse a specialist?",
      pt: "Posso recusar um especialista?"
    },
    summary: {
      en: "Yes. You have full right to decline a Specialist or request a different contractor if you feel uncomfortable or disagree with their approach.",
      pt: "Sim. Tem o direito de recusar um especialista ou solicitar outro profissional caso n\xE3o se sinta confort\xE1vel ou discorde da abordagem."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Customer Comfort and Choice",
          pt: "Conforto e Escolha do Cliente"
        },
        body: {
          en: "Customer safety and peace of mind are paramount. If for any reason you choose not to work with a assigned Specialist prior to on-site work starting, notify our local coordination to request an alternative arrangement.",
          pt: "A seguran\xE7a e tranquilidade do cliente s\xE3o priorit\xE1rias. Se por qualquer motivo n\xE3o desejar trabalhar com o especialista atribu\xEDdo antes do in\xEDcio da obra, informe a nossa coordena\xE7\xE3o local."
        }
      }
    ],
    faqList: [],
    keywords: ["refuse specialist", "change contractor", "customer rights"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman", "cleaning"]
  },
  {
    id: "kb_specialist_cannot_solve",
    slug: "what-happens-if-the-specialist-cannot-solve-the-problem",
    category: "customer",
    categoryLabel: {
      en: "Customer Expectations",
      pt: "Apoio ao Cliente"
    },
    title: {
      en: "What happens if the specialist cannot solve the problem?",
      pt: "O que acontece se o especialista n\xE3o conseguir resolver o problema?"
    },
    summary: {
      en: "If a Specialist cannot diagnose or resolve the issue, you are not charged for repair work. Local coordination can reassign a senior master specialist.",
      pt: "Se o especialista n\xE3o conseguir diagnosticar ou resolver o problema, n\xE3o lhe \xE9 cobrada a repara\xE7\xE3o. A coordena\xE7\xE3o local pode reatribuir um t\xE9cnico s\xE9nior."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Fair Outcome Policy",
          pt: "Pol\xEDtica de Resolu\xE7\xE3o Justa"
        },
        body: {
          en: "If a complex technical issue cannot be resolved due to specialist limitations, NordBase local coordination steps in to reassign a specialized master contractor without additional penalty.",
          pt: "Se um problema t\xE9cnico complexo n\xE3o puder ser resolvido por limita\xE7\xF5es do t\xE9cnico, a coordena\xE7\xE3o local interv\xE9m para reatribuir um especialista s\xE9nior."
        }
      }
    ],
    faqList: [],
    keywords: ["unresolved problem", "specialist cannot fix", "master contractor reassign"],
    relatedServiceSlugs: ["plumbing", "electrical", "repairs"]
  },
  {
    id: "kb_how_payment_works",
    slug: "how-does-payment-work",
    category: "pricing",
    categoryLabel: {
      en: "Pricing & Estimates",
      pt: "Pre\xE7os e Estimativas"
    },
    title: {
      en: "How does payment work?",
      pt: "Como funciona o pagamento?"
    },
    summary: {
      en: "Payment is settled directly with the Specialist upon agreed completion of the job using MB WAY, Multibanco card, cash, or bank transfer.",
      pt: "O pagamento \xE9 efetuado diretamente com o especialista ap\xF3s a conclus\xE3o do trabalho via MB WAY, cart\xE3o Multibanco, numer\xE1rio ou transfer\xEAncia."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Direct & Convenient Payment Options",
          pt: "Op\xE7\xF5es de Pagamento Diretas e Convenientes"
        },
        body: {
          en: "You pay the Specialist directly after work is completed to your satisfaction. All Specialists are required to provide official Portuguese fiscal invoices (Fatura-Recibo).",
          pt: "Paga diretamente ao especialista ap\xF3s o trabalho ser conclu\xEDdo a seu gosto. Todos os especialistas emitem fatura-recibo oficial comunicada \xE0 Autoridade Tribut\xE1ria."
        }
      }
    ],
    faqList: [],
    keywords: ["how payment works", "MBWAY payment plumber", "fatura recibo NIF"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman", "cleaning", "gardening", "moving", "pools", "repairs"]
  },
  {
    id: "kb_when_job_completed",
    slug: "when-is-a-job-considered-completed",
    category: "how-it-works",
    categoryLabel: {
      en: "How NordBase Works",
      pt: "Como Funciona"
    },
    title: {
      en: "When is a job considered completed?",
      pt: "Quando \xE9 que um trabalho \xE9 considerado conclu\xEDdo?"
    },
    summary: {
      en: "A job is officially completed only when the work has been tested, demonstrated on-site, and mutually confirmed by both Customer and Specialist.",
      pt: "Um trabalho s\xF3 \xE9 oficialmente conclu\xEDdo quando a interven\xE7\xE3o \xE9 testada no local e confirmada mutuamente pelo cliente e pelo especialista."
    },
    readingTime: "2 min read",
    dateUpdated: "2026-08-14",
    contentSections: [
      {
        title: {
          en: "Mutual Sign-Off Requirement",
          pt: "Requisito de Confirma\xE7\xE3o M\xFAtua"
        },
        body: {
          en: "The Specialist tests the repair in your presence (e.g. testing water flow, turning circuit breakers on). Once both sides agree the issue is resolved, the job is marked complete.",
          pt: "O especialista testa a repara\xE7\xE3o na sua presen\xE7a (ex: testar o fluxo de \xE1gua, ligar o quadro el\xE9trico). Quando ambos concordarem que o problema est\xE1 resolvido, o servi\xE7o \xE9 dado como conclu\xEDdo."
        }
      }
    ],
    faqList: [],
    keywords: ["job completed rule", "mutual sign off", "work quality check"],
    relatedServiceSlugs: ["plumbing", "electrical", "handyman", "cleaning", "gardening", "moving", "pools", "repairs"]
  }
];

// src/data/hubSeoData.ts
var HUBS_DATA = [
  {
    id: "portimao",
    slug: "portimao",
    regionSlug: "algarve",
    regionName: "Algarve",
    cityName: "Portim\xE3o",
    hubName: "Portim\xE3o Hub",
    operationalStatus: "active",
    title: {
      en: "Portim\xE3o Hub \u2014 Local Services Coordination in Algarve | NordBase",
      pt: "Hub de Portim\xE3o \u2014 Coordena\xE7\xE3o de Servi\xE7os Locais no Algarve | NordBase"
    },
    metaDescription: {
      en: "Describe your problem and NordBase coordinates verified local specialists in Portim\xE3o, Alvor, and Praia da Rocha. Transparent pricing and direct connection.",
      pt: "Descreva o seu problema e a NordBase coordena especialistas locais em Portim\xE3o, Alvor e Praia da Rocha. Pre\xE7o transparente e liga\xE7\xE3o direta."
    },
    h1: {
      en: "Portim\xE3o Local Services Coordination",
      pt: "Coordena\xE7\xE3o de Servi\xE7os Locais em Portim\xE3o"
    },
    description: {
      en: "Primary operational coordination hub for Portim\xE3o, Alvor, Praia da Rocha, and surrounding Western Algarve areas. Connect with verified independent specialists without having to search or compare.",
      pt: "Hub operacional de coordena\xE7\xE3o em Portim\xE3o, Alvor, Praia da Rocha e concelhos vizinhos do Barlavento Algarvio. Liga\xE7\xE3o direta a especialistas qualificados sem ter de procurar ou comparar."
    },
    surroundingAreas: ["Praia da Rocha", "Alvor", "Mexilhoeira Grande", "Ferragudo", "Parchal"],
    services: [
      {
        serviceId: "plumbing",
        serviceSlug: "plumbing",
        serviceName: "Plumbing Services",
        subTitle: "Canalizadores & Desentupimentos",
        category: "Home Services",
        enabled: true,
        indexable: true,
        title: {
          en: "Plumber in Portim\xE3o & Water Leak Repairs | NordBase Algarve",
          pt: "Canalizador em Portim\xE3o e Desentupimentos | NordBase Algarve"
        },
        metaDescription: {
          en: "Water leaks, burst pipes, blocked drains, or water heater issues in Portim\xE3o? Describe your problem. NordBase coordinates a verified local plumber.",
          pt: "Fuga de \xE1gua, canos rotos, desentupimentos ou esquentador avariado em Portim\xE3o? Descreva o seu problema. A NordBase coordena o canalizador local."
        },
        h1: {
          en: "Plumbing & Emergency Water Repairs in Portim\xE3o",
          pt: "Canalizador e Repara\xE7\xF5es de Canaliza\xE7\xE3o em Portim\xE3o"
        },
        description: {
          en: "Coordination for emergency water leak fixes, pipe repairs, boiler installations, drain unblocking, and sanitary fitting installations across Portim\xE3o and Alvor.",
          pt: "Coordena\xE7\xE3o de repara\xE7\xF5es de fugas de \xE1gua, desentupimentos urgentes, esquentadores, torneiras e canaliza\xE7\xE3o geral em Portim\xE3o e Alvor."
        },
        typicalProblems: [
          { en: "Water leaking from kitchen sink, ceiling, or bathroom pipes", pt: "Fuga de \xE1gua no lava-loi\xE7a, teto ou tubagens da casa de banho" },
          { en: "Blocked toilet, shower drain, or slow sewer line", pt: "Sanita ou ralo entupido e escoamento lento de \xE1guas" },
          { en: "Water heater (esquentador/termoacumulador) not igniting or low water pressure", pt: "Esquentador/termoacumulador n\xE3o liga ou press\xE3o de \xE1gua muito baixa" },
          { en: "Tap replacement, leaking cistern, or toilet flush repair", pt: "Substitui\xE7\xE3o de torneiras, autoclismo a correr ou repara\xE7\xE3o de lou\xE7as" }
        ],
        faqs: [
          {
            q: { en: "How quickly can a plumber visit in Portim\xE3o?", pt: "Com que rapidez pode um canalizador deslocar-se em Portim\xE3o?" },
            a: { en: "For urgent issues like active leaks or overflows, local coordination dispatches available specialists as quickly as possible. For standard repairs, flexible same-day or next-day appointments are scheduled.", pt: "Para situa\xE7\xF5es urgentes de fuga de \xE1gua ativa, a coordena\xE7\xE3o local ativa o especialista dispon\xEDvel com rapidez. Para trabalhos normais, pode agendar no mesmo dia ou no dia seguinte." }
          },
          {
            q: { en: "Do I have to approve the repair price before the plumber begins?", pt: "Tenho de aprovar o or\xE7amento antes de o canalizador come\xE7ar o trabalho?" },
            a: { en: "Yes. The specialist assesses the exact pipework on site and presents the final price. Physical work only starts once you approve.", pt: "Sim. O especialista avalia a canaliza\xE7\xE3o no local e apresenta o valor final exato. O trabalho s\xF3 come\xE7a ap\xF3s a sua aprova\xE7\xE3o expl\xEDcita." }
          }
        ]
      },
      {
        serviceId: "electrical",
        serviceSlug: "electrical",
        serviceName: "Electrical Services",
        subTitle: "Eletricistas Certificados",
        category: "Home Services",
        enabled: true,
        indexable: true,
        title: {
          en: "Electrician in Portim\xE3o & Power Fault Repairs | NordBase Algarve",
          pt: "Eletricista em Portim\xE3o e Repara\xE7\xE3o de Avarias | NordBase Algarve"
        },
        metaDescription: {
          en: "Circuit breaker tripping, power outage, or lighting installation in Portim\xE3o? Describe your issue and NordBase coordinates a qualified local electrician.",
          pt: "Quadro el\xE9trico a disparar, falha de luz ou instala\xE7\xE3o de candeeiros em Portim\xE3o? Descreva o problema e a NordBase coordena o eletricista."
        },
        h1: {
          en: "Electrician & Electrical Repairs in Portim\xE3o",
          pt: "Eletricista e Repara\xE7\xF5es El\xE9tricas em Portim\xE3o"
        },
        description: {
          en: "Electrical fault diagnosis, circuit breaker trips, wiring upgrades, lighting installations, and power socket repairs across Portim\xE3o.",
          pt: "Diagn\xF3stico de avarias el\xE9tricas, disjuntores a disparar, substitui\xE7\xE3o de tomadas, instala\xE7\xE3o de ilumina\xE7\xE3o e repara\xE7\xE3o de quadros em Portim\xE3o."
        },
        typicalProblems: [
          { en: "Main circuit breaker or residual current device (RCD) keeps tripping", pt: "Quadro el\xE9trico ou disjuntor diferencial dispara constantemente" },
          { en: "Power outage isolated to specific room or kitchen appliances", pt: "Falta de corrente numa divis\xE3o espec\xEDfica ou tomada queimada" },
          { en: "Installation of ceiling fans, lamps, spotlights, or exterior lighting", pt: "Instala\xE7\xE3o de candeeiros, ventiladores de teto ou focos LED" },
          { en: "Wiring safety inspection, short circuit diagnosis, and grounding check", pt: "Inspe\xE7\xE3o de seguran\xE7a da instala\xE7\xE3o el\xE9trica e repara\xE7\xE3o de curto-circuitos" }
        ],
        faqs: [
          {
            q: { en: "Can the electrician handle sudden power cuts in Portim\xE3o apartments?", pt: "O eletricista resolve cortes de eletricidade s\xFAbitos em apartamentos?" },
            a: { en: "Yes. Specialists isolate short-circuited lines, replace faulty breakers, and restore safe power supply according to Portuguese electrical standards.", pt: "Sim. O especialista isola a linha em curto-circuito, substitui disjuntores avariados e rep\xF5e a seguran\xE7a da instala\xE7\xE3o." }
          }
        ]
      },
      {
        serviceId: "handyman",
        serviceSlug: "handyman",
        serviceName: "Handyman Services",
        subTitle: "Pequenas Obras & Marido das Obras",
        category: "Home Services",
        enabled: true,
        indexable: true,
        title: {
          en: "Handyman in Portim\xE3o \u2014 Home Repairs & Assembly | NordBase Algarve",
          pt: "Marido das Obras em Portim\xE3o \u2014 Pequenas Repara\xE7\xF5es | NordBase Algarve"
        },
        metaDescription: {
          en: "Need furniture assembly, TV wall mounting, door lock repair, or small home repairs in Portim\xE3o? Describe your task and NordBase coordinates a local handyman.",
          pt: "Precisa de montar m\xF3veis, pendurar TV, trocar fechaduras ou pequenas repara\xE7\xF5es em Portim\xE3o? Descreva o trabalho e a NordBase coordena o t\xE9cnico."
        },
        h1: {
          en: "Handyman & Property Maintenance in Portim\xE3o",
          pt: "Pequenas Repara\xE7\xF5es e Manuten\xE7\xE3o em Portim\xE3o"
        },
        description: {
          en: "General property maintenance, flat-pack furniture assembly (IKEA/Leroy Merlin), door lock replacements, TV mounting, silicone sealing, and minor interior touch-ups in Portim\xE3o.",
          pt: "Montagem de m\xF3veis (IKEA/Leroy Merlin), substitui\xE7\xE3o de fechaduras, fixa\xE7\xE3o de suportes de TV, calafetagem de silicone e pequenas repara\xE7\xF5es gerais em Portim\xE3o."
        },
        typicalProblems: [
          { en: "Flat-pack furniture assembly (wardrobes, beds, desks, shelves)", pt: "Montagem de m\xF3veis em kit (roupeiros, camas, mesas, c\xF3modas)" },
          { en: "TV wall bracket mounting, curtain rods, and mirror hanging", pt: "Fixa\xE7\xE3o de suportes de TV na parede, var\xF5es de cortinados e espelhos" },
          { en: "Door lock jammed, sticking handle, or lock cylinder replacement", pt: "Fechadura encravada, puxador solto ou substitui\xE7\xE3o de canh\xE3o" },
          { en: "Silicone renewal around shower/bath, minor plaster repair and touch-ups", pt: "Renova\xE7\xE3o de silicone em banheiras e pequenas repara\xE7\xF5es de gesso/pintura" }
        ],
        faqs: [
          {
            q: { en: "Can I combine multiple small tasks in one handyman visit?", pt: "Posso juntar v\xE1rias pequenas tarefas numa \xFAnica visita?" },
            a: { en: "Yes. Describe all your pending home tasks (e.g. hanging a TV, assembling a table, replacing a door handle) in your request for efficient single-visit coordination.", pt: "Sim. Pode listar v\xE1rias tarefas na descri\xE7\xE3o para que o t\xE9cnico leve as ferramentas certas e resolva tudo numa s\xF3 desloca\xE7\xE3o." }
          }
        ]
      },
      {
        serviceId: "cleaning",
        serviceSlug: "cleaning",
        serviceName: "Cleaning Services",
        subTitle: "Limpeza Residencial & Alojamento Local",
        category: "Cleaning",
        enabled: true,
        indexable: true,
        title: {
          en: "Cleaning Services in Portim\xE3o & Airbnb Turnover | NordBase Algarve",
          pt: "Servi\xE7os de Limpeza em Portim\xE3o e Alojamento Local | NordBase Algarve"
        },
        metaDescription: {
          en: "Residential cleaning, Airbnb turnover cleans, post-renovation deep cleaning, and window cleaning in Portim\xE3o and Praia da Rocha. Describe your cleaning needs.",
          pt: "Limpeza dom\xE9stica, rotatividade de Alojamento Local (AL), limpeza p\xF3s-obra e vidros em Portim\xE3o e Praia da Rocha. Descreva o que precisa."
        },
        h1: {
          en: "Residential & Holiday Rental Cleaning in Portim\xE3o",
          pt: "Limpeza Dom\xE9stica e Alojamento Local em Portim\xE3o"
        },
        description: {
          en: "Professional residential cleaning, holiday home turnover cleans with laundry coordination, deep post-renovation cleaning, and balcony window cleaning across Portim\xE3o.",
          pt: "Limpeza profissional de apartamentos e moradias, rotatividade de Alojamento Local (check-in/check-out), limpeza profunda p\xF3s-obra e janelas em Portim\xE3o."
        },
        typicalProblems: [
          { en: "Fast turnover cleaning between holiday guests for Airbnb/AL properties", pt: "Limpeza r\xE1pida de rotatividade entre h\xF3spedes em Alojamento Local" },
          { en: "Deep cleaning after renovation, building work, or move-out", pt: "Limpeza profunda p\xF3s-obra, fim de arrendamento ou mudan\xE7as" },
          { en: "Regular weekly or fortnightly domestic home cleaning", pt: "Limpeza dom\xE9stica regular semanal ou quinzenal" },
          { en: "Balcony glass, window pane, and outdoor terrace cleaning", pt: "Limpeza de vidros, varandas e terra\xE7os com acumula\xE7\xE3o de poeiras" }
        ],
        faqs: [
          {
            q: { en: "Do cleaners bring their own cleaning products and equipment?", pt: "Os profissionais trazem os pr\xF3prios produtos de limpeza?" },
            a: { en: "Yes, specialists arrive equipped with professional cleaning supplies, or can use your preferred domestic products if specified.", pt: "Sim, os especialistas levam materiais e produtos adequados, ou podem utilizar os seus se preferir." }
          }
        ]
      },
      {
        serviceId: "gardening",
        serviceSlug: "gardening",
        serviceName: "Gardening & Landscaping",
        subTitle: "Jardinagem & Manuten\xE7\xE3o de Espa\xE7os Verdes",
        category: "Gardening",
        enabled: true,
        indexable: true,
        title: {
          en: "Gardener in Portim\xE3o \u2014 Garden Care & Irrigation | NordBase Algarve",
          pt: "Jardineiro em Portim\xE3o \u2014 Manuten\xE7\xE3o e Rega | NordBase Algarve"
        },
        metaDescription: {
          en: "Lawn mowing, hedge trimming, palm tree pruning, or irrigation repairs in Portim\xE3o villas? Describe your garden needs for local specialist coordination.",
          pt: "Corte de relva, poda de sebes e palmeiras ou repara\xE7\xE3o de rega autom\xE1tica em Portim\xE3o? Descreva o seu jardim e a NordBase coordena o jardineiro."
        },
        h1: {
          en: "Gardening & Outdoor Maintenance in Portim\xE3o",
          pt: "Jardinagem e Manuten\xE7\xE3o de Jardins em Portim\xE3o"
        },
        description: {
          en: "Lawn care, hedge trimming, palm tree surgeon work, automatic irrigation system troubleshooting, weed clearing, and seasonal garden cleanup across Portim\xE3o.",
          pt: "Corte e tratamento de relvados, poda de sebes e \xE1rvores, repara\xE7\xE3o de sistemas de rega autom\xE1tica e limpeza de terrenos em Portim\xE3o e Alvor."
        },
        typicalProblems: [
          { en: "Overgrown lawn needing mowing, edging, and weeding", pt: "Relvado alto a precisar de corte, arejamento e monda de ervas" },
          { en: "Automatic irrigation timer failure, broken pipe, or clogged sprinkler nozzles", pt: "Programador de rega avariado, tubo furado ou aspersores entupidos" },
          { en: "Hedge shaping, shrub trimming, and palm frond pruning", pt: "Poda e corte de sebes, arbustos e limpeza de palmeiras" },
          { en: "Seasonal green waste disposal and general garden refresh", pt: "Limpeza sazonal de folhas secas e recolha de res\xEDduos verdes" }
        ],
        faqs: [
          {
            q: { en: "Is green waste removal included in the gardening service?", pt: "A remo\xE7\xE3o e transporte de res\xEDduos verdes est\xE1 inclu\xEDda?" },
            a: { en: "Yes. Green waste bagging and removal is agreed with the specialist as part of the on-site scope.", pt: "Sim. O ensacamento e transporte de sobrantes de poda fica acordado na avalia\xE7\xE3o com o jardineiro." }
          }
        ]
      },
      {
        serviceId: "moving",
        serviceSlug: "moving",
        serviceName: "Moving & Transport",
        subTitle: "Mudan\xE7as & Transporte de Carga",
        category: "Moving",
        enabled: true,
        indexable: true,
        title: {
          en: "Moving Services in Portim\xE3o & Furniture Transport | NordBase Algarve",
          pt: "Mudan\xE7as em Portim\xE3o e Transporte de M\xF3veis | NordBase Algarve"
        },
        metaDescription: {
          en: "Apartment moving, heavy furniture transport, or appliance pickup in Portim\xE3o and Western Algarve. Describe your move for coordinated local transport.",
          pt: "Mudan\xE7as de casa, transporte de eletrodom\xE9sticos ou m\xF3veis pesados em Portim\xE3o e Barlavento Algarvio. Descreva a carga e n\xF3s coordenamos o transporte."
        },
        h1: {
          en: "Moving & Cargo Transport Services in Portim\xE3o",
          pt: "Servi\xE7o de Mudan\xE7as e Transporte em Portim\xE3o"
        },
        description: {
          en: "Local apartment and villa relocations, furniture pickup from retail stores (IKEA/Conforama), heavy item handling, van loading assistance, and packing support.",
          pt: "Mudan\xE7as residenciais e comerciais em Portim\xE3o, recolha de compras volumosas em lojas, transporte de eletrodom\xE9sticos e apoio de carga/descarga."
        },
        typicalProblems: [
          { en: "Full or partial apartment moving across Portim\xE3o, Alvor, or Algarve", pt: "Mudan\xE7a completa ou parcial de apartamento no concelho de Portim\xE3o" },
          { en: "Single heavy furniture or appliance pickup and delivery (sofa, fridge, wardrobe)", pt: "Transporte de sof\xE1, frigor\xEDfico, m\xE1quina de lavar ou m\xF3vel volumoso" },
          { en: "Van loading/unloading assistance and staircase handling", pt: "Ajudantes para carga e descarga em pr\xE9dios sem elevador" },
          { en: "Protective furniture wrapping and dismantling before transit", pt: "Desmontagem e embalamento de prote\xE7\xE3o de mobili\xE1rio delicado" }
        ],
        faqs: [
          {
            q: { en: "Can the moving specialist handle moves in buildings without an elevator?", pt: "O servi\xE7o de mudan\xE7as inclui pr\xE9dios sem elevador?" },
            a: { en: "Yes. Specify the floor number and stair access in your description so the right team and equipment are assigned.", pt: "Sim. Indique o piso e as condi\xE7\xF5es de escadas na descri\xE7\xE3o para que a equipa venha com o pessoal adequado." }
          }
        ]
      },
      {
        serviceId: "pools",
        serviceSlug: "pools",
        serviceName: "Pool Maintenance",
        subTitle: "Manuten\xE7\xE3o de Piscinas & Tratamento de \xC1gua",
        category: "Pools",
        enabled: true,
        indexable: true,
        title: {
          en: "Pool Maintenance in Portim\xE3o & Green Water Fix | NordBase Algarve",
          pt: "Manuten\xE7\xE3o de Piscinas em Portim\xE3o e Tratamento | NordBase Algarve"
        },
        metaDescription: {
          en: "Green pool water, pump breakdown, filter replacement, or regular chemical balancing in Portim\xE3o villas. Describe your pool issue for local specialist care.",
          pt: "\xC1gua verde na piscina, bomba avariada, troca de areia do filtro ou tratamento qu\xEDmico em Portim\xE3o. Descreva o problema da piscina."
        },
        h1: {
          en: "Swimming Pool Maintenance & Repairs in Portim\xE3o",
          pt: "Manuten\xE7\xE3o e Repara\xE7\xE3o de Piscinas em Portim\xE3o"
        },
        description: {
          en: "Regular swimming pool chemical balancing, green water recovery shock treatments, pump noise repair, sand filter replacement, and salt chlorinator servicing in Portim\xE3o villas.",
          pt: "Tratamento de choque para \xE1gua verde, equil\xEDbrio de pH/cloro, repara\xE7\xE3o de bombas de piscina, troca de carga filtrante e eletr\xF3lise de sal em Portim\xE3o."
        },
        typicalProblems: [
          { en: "Pool water turned green, cloudy, or has algae buildup on walls", pt: "\xC1gua da piscina verde, turva ou com algas nas paredes e fundo" },
          { en: "Pool circulation pump not pulling water, humming, or making grinding noise", pt: "Bomba de circula\xE7\xE3o n\xE3o puxa \xE1gua, faz ru\xEDdo estranho ou desarmou" },
          { en: "Sand filter leaking or pressure gauge abnormally high", pt: "Filtro de areia a perder \xE1gua ou press\xE3o demasiado alta no man\xF3metro" },
          { en: "Weekly or fortnightly routine water testing, skimming, and vacuuming", pt: "Manuten\xE7\xE3o peri\xF3dica de aspira\xE7\xE3o, limpeza de cesto e controlo qu\xEDmico" }
        ],
        faqs: [
          {
            q: { en: "How fast can a green pool be restored to clear water?", pt: "Quanto tempo demora a recuperar uma piscina com \xE1gua verde?" },
            a: { en: "With proper chemical shock treatment and filtration cycling, most green pools clear within 24 to 48 hours.", pt: "Com tratamento de choque e filtra\xE7\xE3o cont\xEDnua, a \xE1gua recupera habitualmente a transpar\xEAncia em 24 a 48 horas." }
          }
        ]
      },
      {
        serviceId: "repairs",
        serviceSlug: "repairs",
        serviceName: "Appliance & HVAC Repairs",
        subTitle: "Ar Condicionado & Eletrodom\xE9sticos",
        category: "Repairs",
        enabled: true,
        indexable: true,
        title: {
          en: "AC Repair & Appliance Fix in Portim\xE3o | NordBase Algarve",
          pt: "Repara\xE7\xE3o de Ar Condicionado e Eletrodom\xE9sticos em Portim\xE3o | NordBase Algarve"
        },
        metaDescription: {
          en: "Air conditioning not cooling, washing machine not draining, or oven breakdown in Portim\xE3o? Describe your issue for local diagnostic and repair.",
          pt: "Ar condicionado n\xE3o arrefece, m\xE1quina de lavar n\xE3o despeja \xE1gua ou forno avariado em Portim\xE3o? Descreva o problema para diagn\xF3stico e repara\xE7\xE3o."
        },
        h1: {
          en: "Air Conditioning & Domestic Appliance Repairs in Portim\xE3o",
          pt: "Repara\xE7\xE3o de Ar Condicionado e Eletrodom\xE9sticos em Portim\xE3o"
        },
        description: {
          en: "Air conditioning servicing, gas top-ups, filter sanitization, washing machine repairs, refrigerator cooling diagnostics, and electric oven troubleshooting in Portim\xE3o.",
          pt: "Repara\xE7\xE3o e recarga de g\xE1s em ar condicionado, m\xE1quinas de lavar roupa e loi\xE7a, frigor\xEDficos que n\xE3o arrefecem e fornos el\xE9tricos em Portim\xE3o."
        },
        typicalProblems: [
          { en: "Air conditioning unit blowing warm air, leaking water indoors, or smelling musty", pt: "Ar condicionado s\xF3 deita ar morno, pinga \xE1gua para dentro ou cheira mal" },
          { en: "Washing machine error code, not draining water, or failing to spin", pt: "M\xE1quina de lavar roupa n\xE3o escoa \xE1gua, n\xE3o centrifuga ou d\xE1 c\xF3digo de erro" },
          { en: "Refrigerator or freezer not cooling properly or compressor running hot", pt: "Frigor\xEDfico n\xE3o gela, alimentos a estragar-se ou motor sempre a trabalhar" },
          { en: "Electric oven not heating up or induction hob tripping the breaker", pt: "Forno el\xE9trico n\xE3o aquece ou placa vitrocer\xE2mica/indu\xE7\xE3o desliga-se" }
        ],
        faqs: [
          {
            q: { en: "Do technicians carry replacement parts for common appliance brands in Portim\xE3o?", pt: "Os t\xE9cnicos t\xEAm pe\xE7as para as marcas de eletrodom\xE9sticos mais comuns?" },
            a: { en: "Yes, specialists carry diagnostic tools and standard replacement parts (pumps, capacitors, sensors, thermostats) for major brands.", pt: "Sim, os t\xE9cnicos levam pe\xE7as de desgaste r\xE1pido (bombas de esgoto, condensadores, sensores) para marcas comuns no mercado." }
          }
        ]
      }
    ]
  },
  // Future / Inactive Expansion Hubs for Data Integrity
  {
    id: "faro",
    slug: "faro",
    regionSlug: "algarve",
    regionName: "Algarve",
    cityName: "Faro",
    hubName: "Faro Hub",
    operationalStatus: "coming_soon",
    title: {
      en: "Faro Hub \u2014 Planned Operational Expansion | NordBase Algarve",
      pt: "Hub de Faro \u2014 Expans\xE3o Operacional Planeada | NordBase Algarve"
    },
    metaDescription: {
      en: "NordBase territorial expansion in Faro capital area. Regional services coordinated via Portim\xE3o Hub.",
      pt: "Expans\xE3o territorial da NordBase em Faro. Coordena\xE7\xE3o regional dispon\xEDvel atrav\xE9s do Hub de Portim\xE3o."
    },
    h1: {
      en: "Faro Territory \u2014 Operational Expansion",
      pt: "Territ\xF3rio de Faro \u2014 Expans\xE3o Operacional"
    },
    description: {
      en: "Planned coordination hub for Faro capital area and airport territory.",
      pt: "Hub de coordena\xE7\xE3o planeado para a capital do Algarve e zona do aeroporto."
    },
    surroundingAreas: ["Montenegro", "Gambelas", "Olh\xE3o border"],
    services: []
  },
  {
    id: "albufeira",
    slug: "albufeira",
    regionSlug: "algarve",
    regionName: "Algarve",
    cityName: "Albufeira",
    hubName: "Albufeira Hub",
    operationalStatus: "coming_soon",
    title: {
      en: "Albufeira Hub \u2014 Planned Operational Expansion | NordBase Algarve",
      pt: "Hub de Albufeira \u2014 Expans\xE3o Operacional Planeada | NordBase Algarve"
    },
    metaDescription: {
      en: "NordBase territorial expansion in Albufeira coastal area. Regional services coordinated via Portim\xE3o Hub.",
      pt: "Expans\xE3o territorial da NordBase em Albufeira. Coordena\xE7\xE3o regional dispon\xEDvel atrav\xE9s do Hub de Portim\xE3o."
    },
    h1: {
      en: "Albufeira Territory \u2014 Operational Expansion",
      pt: "Territ\xF3rio de Albufeira \u2014 Expans\xE3o Operacional"
    },
    description: {
      en: "Planned coordination hub for Central Algarve coastal area.",
      pt: "Hub de coordena\xE7\xE3o planeado para a zona costeira central do Algarve."
    },
    surroundingAreas: ["Montechoro", "Oura", "Olhos de \xC1gua", "Gale"],
    services: []
  },
  {
    id: "lagos",
    slug: "lagos",
    regionSlug: "algarve",
    regionName: "Algarve",
    cityName: "Lagos",
    hubName: "Lagos Hub",
    operationalStatus: "coming_soon",
    title: {
      en: "Lagos Hub \u2014 Planned Operational Expansion | NordBase Algarve",
      pt: "Hub de Lagos \u2014 Expans\xE3o Operacional Planeada | NordBase Algarve"
    },
    metaDescription: {
      en: "NordBase territorial expansion in Lagos and Western Algarve. Services coordinated via Portim\xE3o Hub.",
      pt: "Expans\xE3o territorial da NordBase em Lagos. Coordena\xE7\xE3o dispon\xEDvel atrav\xE9s do Hub de Portim\xE3o."
    },
    h1: {
      en: "Lagos Territory \u2014 Operational Expansion",
      pt: "Territ\xF3rio de Lagos \u2014 Expans\xE3o Operacional"
    },
    description: {
      en: "Planned coordination hub for Western Algarve coastal area.",
      pt: "Hub de coordena\xE7\xE3o planeado para a zona costeira ocidental do Algarve."
    },
    surroundingAreas: ["Meia Praia", "Luz", "Burgau"],
    services: []
  }
];
function getIndexableSitemapUrls() {
  const urls = [
    { url: "https://nordbase.pt/", priority: 1, changefreq: "daily" },
    { url: "https://nordbase.pt/how-it-works", priority: 0.9, changefreq: "weekly" },
    { url: "https://nordbase.pt/partner", priority: 0.8, changefreq: "weekly" },
    { url: "https://nordbase.pt/knowledge-base", priority: 0.8, changefreq: "weekly" },
    { url: "https://nordbase.pt/portugal", priority: 0.9, changefreq: "weekly" },
    { url: "https://nordbase.pt/algarve", priority: 0.9, changefreq: "weekly" }
  ];
  for (const hub of HUBS_DATA) {
    if (hub.operationalStatus === "active") {
      const hubUrl = `https://nordbase.pt/${hub.regionSlug}/${hub.slug}`;
      urls.push({ url: hubUrl, priority: 0.9, changefreq: "weekly" });
      for (const service of hub.services) {
        if (service.enabled && service.indexable) {
          const serviceUrl = `https://nordbase.pt/${hub.regionSlug}/${hub.slug}/${service.serviceSlug}`;
          urls.push({ url: serviceUrl, priority: 0.8, changefreq: "weekly" });
        }
      }
    }
  }
  urls.push(
    { url: "https://nordbase.pt/knowledge-base/customer", priority: 0.8, changefreq: "weekly" },
    { url: "https://nordbase.pt/knowledge-base/pricing", priority: 0.8, changefreq: "weekly" },
    { url: "https://nordbase.pt/knowledge-base/how-it-works", priority: 0.8, changefreq: "weekly" },
    { url: "https://nordbase.pt/knowledge-base/services", priority: 0.8, changefreq: "weekly" }
  );
  for (const art of KNOWLEDGE_BASE_ARTICLES) {
    urls.push({
      url: `https://nordbase.pt/knowledge-base/${art.slug}`,
      priority: 0.7,
      changefreq: "monthly"
    });
  }
  return urls;
}

// server.ts
dotenv.config();
var app = express();
var PORT = 3e3;
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get(["/uploads/:filename", "/upload/:filename"], (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found");
  }
});
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.setHeader("Cache-Control", "public, max-age=86400");
  const robotsPath = path.join(process.cwd(), "public", "robots.txt");
  if (fs.existsSync(robotsPath)) {
    res.sendFile(robotsPath);
  } else {
    res.send(`User-agent: *
Allow: /
Allow: /portugal
Allow: /algarve
Allow: /how-it-works
Allow: /partner
Allow: /knowledge-base

Disallow: /pitch/
Disallow: /pitch/*
Disallow: /dashboard
Disallow: /pro
Disallow: /tpartner
Disallow: /operator
Disallow: /admin
Disallow: /super-admin
Disallow: /api/

Sitemap: https://nordbase.pt/sitemap.xml`);
  }
});
app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  res.setHeader("Cache-Control", "public, max-age=86400");
  const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
  if (fs.existsSync(sitemapPath)) {
    res.sendFile(sitemapPath);
  } else {
    const urls = getIndexableSitemapUrls();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
    for (const item of urls) {
      xml += `  <url>
    <loc>${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority.toFixed(1)}</priority>
  </url>
`;
    }
    xml += `</urlset>`;
    res.send(xml);
  }
});
var inMemoryUsers = [
  {
    id: "user-super-01",
    email: "ironstorm174@gmail.com",
    phone: "+351 901 000 000",
    name: "Oleg (Territorial Partner)",
    role: "super_admin",
    specialistStatus: "not_requested",
    dashboardNumber: "01",
    photoUrl: "/portimao_tp.jpg",
    city: "Portim\xE3o",
    region: "Algarve"
  },
  {
    id: "user-rp-dana",
    email: "astrologforme@gmail.com",
    phone: "+351 912 000 001",
    name: "Dana (Regional Director)",
    role: "regional_admin",
    specialistStatus: "not_requested",
    dashboardNumber: "RD-01",
    city: "Faro",
    region: "Portugal"
  }
];
var inMemorySpecialists = [];
var inMemoryJobs = [];
var inMemoryPartnerApplications = [];
var pool = null;
var dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (dbUrl) {
  try {
    pool = new Pool({ connectionString: dbUrl });
    console.log("Neon Pool initialized.");
  } catch (err) {
    console.error("Failed to initialize Neon Pool:", err);
  }
} else {
  console.log("Database URL is not set (DATABASE_URL / POSTGRES_URL). Falling back to in-memory database store.");
}
var inMemoryIdempotencyRecords = /* @__PURE__ */ new Map();
async function getIdempotencyRecord(userId, idempotencyKey) {
  const mapKey = `${userId}:${idempotencyKey}`;
  if (pool) {
    try {
      const client = await pool.connect();
      const res = await client.query(
        "SELECT * FROM idempotency_records WHERE user_id = $1 AND idempotency_key = $2",
        [userId, idempotencyKey]
      );
      client.release();
      if (res.rows.length > 0) {
        const row = res.rows[0];
        const record = {
          id: row.id,
          userId: row.user_id,
          idempotencyKey: row.idempotency_key,
          operation: row.operation,
          resourceId: row.resource_id || void 0,
          status: row.status,
          response: typeof row.response === "string" ? JSON.parse(row.response) : row.response,
          createdAt: new Date(row.created_at).toISOString()
        };
        inMemoryIdempotencyRecords.set(mapKey, record);
        return record;
      }
    } catch (e) {
      console.error("Error fetching idempotency record from DB:", e);
    }
  }
  return inMemoryIdempotencyRecords.get(mapKey) || null;
}
async function saveIdempotencyRecord(userId, idempotencyKey, operation, resourceId, status, response) {
  const record = {
    id: `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    idempotencyKey,
    operation,
    resourceId,
    status,
    response,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const mapKey = `${userId}:${idempotencyKey}`;
  inMemoryIdempotencyRecords.set(mapKey, record);
  if (pool) {
    try {
      const client = await pool.connect();
      await client.query(
        `INSERT INTO idempotency_records (id, user_id, idempotency_key, operation, resource_id, status, response)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id, operation, idempotency_key) DO UPDATE
         SET status = EXCLUDED.status, response = EXCLUDED.response`,
        [record.id, userId, idempotencyKey, operation, resourceId || null, status, JSON.stringify(response)]
      );
      client.release();
    } catch (e) {
      console.error("Error saving idempotency record to DB:", e);
    }
  }
}
function extractIdempotencyKey(req) {
  const headerKey = req.headers["idempotency-key"] || req.headers["x-idempotency-key"];
  if (typeof headerKey === "string" && headerKey.trim()) {
    return headerKey.trim();
  }
  if (Array.isArray(headerKey) && headerKey[0] && headerKey[0].trim()) {
    return headerKey[0].trim();
  }
  if (req.body && typeof req.body.idempotencyKey === "string" && req.body.idempotencyKey.trim()) {
    return req.body.idempotencyKey.trim();
  }
  return null;
}
var devFallbackSecret = null;
function getCryptoSecret() {
  const secret = process.env.CRYPTO_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("CRYPTO_SECRET environment variable is missing in production environment");
  }
  if (!devFallbackSecret) {
    devFallbackSecret = crypto.randomBytes(32).toString("hex");
  }
  return devFallbackSecret;
}
function generateAuthToken(userId) {
  const iat = Date.now();
  const exp = iat + 7 * 24 * 60 * 60 * 1e3;
  const payload = { userId, iat, exp };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const hmac = crypto.createHmac("sha256", getCryptoSecret());
  hmac.update(payloadBase64);
  const signature = hmac.digest("base64url");
  return `${payloadBase64}.${signature}`;
}
var issueAuthToken = generateAuthToken;
function verifyAndDecodeToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadBase64, signature] = parts;
  if (!payloadBase64 || !signature) return null;
  try {
    const hmac = crypto.createHmac("sha256", getCryptoSecret());
    hmac.update(payloadBase64);
    const expectedSignature = hmac.digest("base64url");
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }
    const jsonStr = Buffer.from(payloadBase64, "base64url").toString("utf8");
    const payload = JSON.parse(jsonStr);
    if (!payload.userId || !payload.iat || !payload.exp) {
      return null;
    }
    if (Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch (err) {
    return null;
  }
}
async function findUserById(userId) {
  if (pool) {
    let client = null;
    try {
      client = await pool.connect();
      const res = await client.query("SELECT * FROM app_users WHERE id = $1", [userId]);
      if (res.rows.length > 0) {
        const u = res.rows[0];
        return {
          id: u.id,
          email: u.email,
          phone: u.phone,
          name: u.name,
          role: u.role,
          specialistStatus: u.specialist_status || u.specialistStatus || "not_requested",
          isBlocked: u.is_blocked || u.isBlocked || false,
          dashboardNumber: u.dashboard_number || u.dashboardNumber,
          region: u.region,
          city: u.city
        };
      }
    } catch (err) {
      console.error("Error finding user by id in Postgres:", err);
    } finally {
      if (client) {
        try {
          client.release();
        } catch (e) {
        }
      }
    }
  }
  const mem = inMemoryUsers.find((u) => u.id === userId);
  if (mem) {
    return {
      id: mem.id,
      email: mem.email,
      phone: mem.phone,
      name: mem.name,
      role: mem.role,
      specialistStatus: mem.specialistStatus || "not_requested",
      isBlocked: mem.isBlocked || false,
      dashboardNumber: mem.dashboardNumber,
      region: mem.region,
      city: mem.city
    };
  }
  return null;
}
async function findJobById(jobId) {
  if (pool) {
    let client = null;
    try {
      client = await pool.connect();
      const res = await client.query("SELECT * FROM jobs WHERE id = $1", [jobId]);
      if (res.rows.length > 0) {
        const j = res.rows[0];
        let messages = [];
        try {
          messages = typeof j.messages === "string" ? JSON.parse(j.messages) : j.messages || [];
        } catch (e) {
          messages = [];
        }
        return {
          id: j.id,
          category: j.category,
          city: j.city,
          specificLocation: j.specific_location,
          description: j.description,
          estimatedHours: j.estimated_hours,
          estimatedValue: j.estimated_value,
          leadPrice: j.lead_price,
          status: j.status,
          createdAt: j.created_at,
          customerName: j.customer_name,
          customerPhone: j.customer_phone,
          customerId: j.customer_id,
          unlockedBySpecialistId: j.unlocked_by_specialist_id,
          coordinatorId: j.coordinator_id,
          coordinatorNotes: j.coordinator_notes,
          hubId: j.hub_id,
          region: j.region,
          attachments: j.attachments || [],
          messages,
          customerCompleted: j.customer_completed || false,
          customerCompletedAt: j.customer_completed_at ? new Date(j.customer_completed_at).toISOString() : void 0,
          customerCompletion: typeof j.customer_completion === "string" ? JSON.parse(j.customer_completion) : j.customer_completion || void 0,
          specialistCompleted: j.specialist_completed || false,
          specialistCompletedAt: j.specialist_completed_at ? new Date(j.specialist_completed_at).toISOString() : void 0,
          specialistCompletion: typeof j.specialist_completion === "string" ? JSON.parse(j.specialist_completion) : j.specialist_completion || void 0,
          rating: j.rating ? parseFloat(j.rating) : void 0,
          positiveTags: j.positive_tags || [],
          customerComment: j.customer_comment || void 0,
          specialistAssessedValue: j.specialist_assessed_value ? parseFloat(j.specialist_assessed_value) : void 0,
          customerPriceAccepted: j.customer_price_accepted !== null && j.customer_price_accepted !== void 0 ? j.customer_price_accepted : true,
          finalPrice: j.final_price ? parseFloat(j.final_price) : void 0,
          calloutFeePending: j.callout_fee_pending || false,
          calloutFeeAmount: j.callout_fee_amount ? parseFloat(j.callout_fee_amount) : 0
        };
      }
    } catch (err) {
      console.error("Error finding job by id in Postgres:", err);
    } finally {
      if (client) {
        try {
          client.release();
        } catch (e) {
        }
      }
    }
  }
  const mem = inMemoryJobs.find((j) => j.id === jobId);
  if (mem) {
    return mem;
  }
  return null;
}
async function verifyAuthToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.substring(7).trim();
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const payload = verifyAndDecodeToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await findUserById(payload.userId);
  if (!user || user.isBlocked) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.authenticatedUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    phone: user.phone,
    dashboardNumber: user.dashboardNumber,
    region: user.region,
    city: user.city,
    specialistStatus: user.specialistStatus
  };
  next();
}
function requireSuperAdmin(req, res, next) {
  const user = req.authenticatedUser;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (user.role !== "super_admin") {
    return res.status(403).json({ error: "Forbidden: Super Admin access required" });
  }
  next();
}
function requireRole(allowedRoles) {
  return (req, res, next) => {
    const user = req.authenticatedUser;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: `Forbidden: Access requires one of roles: [${allowedRoles.join(", ")}]` });
    }
    next();
  };
}
async function initDb() {
  if (!pool) return;
  try {
    const client = await pool.connect();
    console.log("Connected to Neon successfully. Synchronizing schema...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        specialist_status VARCHAR(50) NOT NULL,
        city VARCHAR(255),
        category VARCHAR(255),
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    const safeQueries = [
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS password VARCHAR(255);`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS photo_url TEXT;`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS dashboard_number VARCHAR(255);`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS region VARCHAR(255);`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS verification_documents JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS trade_skill_level VARCHAR(255);`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS skills_description TEXT;`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS specialties_with_levels JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hub_id VARCHAR(255);`,
      `ALTER TABLE app_users DROP CONSTRAINT IF EXISTS app_users_email_key;`,
      `ALTER TABLE app_users DROP CONSTRAINT IF EXISTS app_users_phone_key;`,
      `DROP INDEX IF EXISTS app_users_email_key;`,
      `DROP INDEX IF EXISTS app_users_email_idx;`,
      `DROP INDEX IF EXISTS app_users_phone_idx;`,
      `DROP INDEX IF EXISTS app_users_phone_key;`,
      `CREATE TABLE IF NOT EXISTS specialists (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        balance NUMERIC DEFAULT 100,
        unlocked_jobs TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(255) PRIMARY KEY,
        category VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        specific_location TEXT NOT NULL,
        description TEXT NOT NULL,
        estimated_hours NUMERIC DEFAULT 1,
        estimated_value NUMERIC DEFAULT 0,
        lead_price NUMERIC DEFAULT 0,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(255) NOT NULL,
        unlocked_by_specialist_id VARCHAR(255),
        coordinator_id VARCHAR(255),
        hub_id VARCHAR(255),
        coordinator_notes TEXT,
        attachments TEXT[] DEFAULT '{}',
        messages JSONB DEFAULT '[]'::jsonb
      );`,
      `CREATE TABLE IF NOT EXISTS partner_applications (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        experience TEXT,
        current_activity TEXT,
        team_size_or_capital TEXT,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS photo_url TEXT;`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS verification_documents JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS trade_skill_level VARCHAR(255);`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS skills_description TEXT;`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending_review';`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS specialties_with_levels JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255);`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_completed BOOLEAN DEFAULT false;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_completed_at TIMESTAMP;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS specialist_completed BOOLEAN DEFAULT false;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS specialist_completed_at TIMESTAMP;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_completion JSONB;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS specialist_completion JSONB;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS rating NUMERIC;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS positive_tags TEXT[] DEFAULT '{}';`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_comment TEXT;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS specialist_assessed_value NUMERIC;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_price_accepted BOOLEAN DEFAULT true;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS final_price NUMERIC;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS callout_fee_pending BOOLEAN DEFAULT false;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS callout_fee_amount NUMERIC DEFAULT 0;`,
      `CREATE TABLE IF NOT EXISTS lead_unlock_transactions (
        id VARCHAR(255) PRIMARY KEY,
        job_id VARCHAR(255) NOT NULL,
        specialist_id VARCHAR(255) NOT NULL,
        amount NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS idempotency_records (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        idempotency_key VARCHAR(255) NOT NULL,
        operation VARCHAR(100) NOT NULL,
        resource_id VARCHAR(255),
        status INT NOT NULL,
        response JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_op_key UNIQUE (user_id, operation, idempotency_key)
      );`,
      `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'check_specialist_balance_positive'
        ) THEN
          ALTER TABLE specialists ADD CONSTRAINT check_specialist_balance_positive CHECK (balance >= 0);
        END IF;
      END $$;`
    ];
    for (const q of safeQueries) {
      try {
        await client.query(q);
      } catch (e) {
        console.warn("Individual schema migration statement note:", e.message);
      }
    }
    try {
      const uRes = await client.query(`
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'app_users' AND constraint_type = 'UNIQUE'
      `);
      for (const row of uRes.rows) {
        try {
          await client.query(`ALTER TABLE app_users DROP CONSTRAINT IF EXISTS "${row.constraint_name}"`);
        } catch (e) {
          console.warn(`Could not drop unique constraint ${row.constraint_name}:`, e.message);
        }
      }
    } catch (e) {
      console.warn("Dynamic constraint lookup skipped:", e.message);
    }
    try {
      await client.query(`
        DELETE FROM app_users 
        WHERE (email LIKE '%@example.com' OR email LIKE '%@example.fr' OR email LIKE '%simulation%' OR name LIKE '%[Simulation]%' OR name LIKE '%[Test]%')
          AND id NOT IN ('user-super-01', 'user-super_admin');
      `);
      await client.query(`
        DELETE FROM specialists 
        WHERE phone LIKE '+351 920%' OR name LIKE '%[Simulation]%' OR name LIKE '%[Test]%';
      `);
      await client.query(`
        DELETE FROM jobs 
        WHERE title LIKE '[Simulation]%' OR title LIKE '[Test]%';
      `);
      const superAdmins = [
        {
          id: "user-super-01",
          email: "ironstorm174@gmail.com",
          phone: "+351 901 000 000",
          name: "Oleg (Territorial Partner)",
          role: "super_admin",
          dashboardNumber: "01",
          photoUrl: "/portimao_tp.jpg",
          city: "Portim\xE3o",
          region: "Algarve"
        },
        {
          id: "user-super-tp",
          email: "timeplace.internal@gmail.com",
          phone: "+351 902 000 000",
          name: "Timeplace Admin",
          role: "super_admin",
          dashboardNumber: "01",
          city: "Portim\xE3o",
          region: "Algarve"
        }
      ];
      for (const sa of superAdmins) {
        const checkRes = await client.query("SELECT * FROM app_users WHERE id = $1", [sa.id]);
        if (checkRes.rows.length === 0) {
          await client.query(
            `INSERT INTO app_users (id, email, phone, name, role, specialist_status, city, dashboard_number, photo_url) 
             VALUES ($1, $2, $3, $4, $5, 'approved', $6, $7, $8)`,
            [sa.id, sa.email, sa.phone, sa.name, sa.role, sa.city, sa.dashboardNumber, sa.photoUrl || null]
          );
        } else {
          await client.query(
            `UPDATE app_users 
             SET email = $1, role = 'super_admin', dashboard_number = '01', is_blocked = false 
             WHERE id = $2`,
            [sa.email, sa.id]
          );
        }
      }
      const usersCount = await client.query("SELECT COUNT(*) FROM app_users");
      if (parseInt(usersCount.rows[0].count) === 0) {
        console.log("Pre-populating users table with seed data...");
        for (const u of inMemoryUsers) {
          await client.query(
            `INSERT INTO app_users (id, email, phone, name, role, specialist_status, city, category) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO NOTHING`,
            [u.id, u.email, u.phone, u.name, u.role, u.specialistStatus, u.city || null, u.category || null]
          );
        }
      }
    } catch (e) {
      console.warn("User seed check note:", e.message);
    }
    try {
      const specialistsCount = await client.query("SELECT COUNT(*) FROM specialists");
      if (parseInt(specialistsCount.rows[0].count) === 0) {
        console.log("Pre-populating specialists table with seed data...");
        for (const s of inMemorySpecialists) {
          await client.query(
            `INSERT INTO specialists (id, name, phone, category, city, balance, unlocked_jobs) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [s.id, s.name, s.phone, s.category, s.city, s.balance, s.unlockedJobs]
          );
        }
      }
    } catch (e) {
      console.warn("Specialist seed check note:", e.message);
    }
    client.release();
    console.log("Database schema and seed synchronization complete.");
  } catch (err) {
    console.error("Error synchronizing database schemas:", err);
  }
}
initDb().catch((err) => console.error("Initial DB sync background error:", err));
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
  // 10 MB limit
});
app.post("/api/admin/clean-mock-data", verifyAuthToken, requireSuperAdmin, async (req, res) => {
  try {
    inMemoryUsers = inMemoryUsers.filter(
      (u) => u.id === "user-super_admin" || u.id === "user-super-01" || ["super_admin", "regional_admin", "operator"].includes(u.role) || !u.email?.endsWith("@example.com") && !u.email?.endsWith("@example.fr") && !u.email?.includes("simulation")
    );
    inMemorySpecialists = [];
    inMemoryJobs = [];
    inMemoryPartnerApplications = [];
    if (pool) {
      const client = await pool.connect();
      try {
        await client.query(`
          DELETE FROM app_users 
          WHERE (email LIKE '%@example.com' OR email LIKE '%@example.fr' OR email LIKE '%simulation%' OR name LIKE '%[Simulation]%' OR name LIKE '%[Test]%')
            AND id NOT IN ('user-super-01', 'user-super_admin');
        `);
        await client.query(`
          DELETE FROM specialists 
          WHERE phone LIKE '+351 920%' OR name LIKE '%[Simulation]%' OR name LIKE '%[Test]%';
        `);
        await client.query(`
          DELETE FROM jobs 
          WHERE title LIKE '[Simulation]%' OR title LIKE '[Test]%';
        `);
      } finally {
        client.release();
      }
    }
    return res.json({ success: true, message: "All simulation accounts and activity traces purged." });
  } catch (err) {
    console.error("Error purging simulation data:", err);
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/translate", verifyAuthToken, async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage, context } = req.body;
    if (!text || typeof text !== "string" || text.length > 2e3) {
      return res.status(400).json({ error: "Text parameter is required" });
    }
    const result = await translateMessage(
      text,
      targetLanguage || "pt",
      sourceLanguage,
      context
    );
    return res.json(result);
  } catch (err) {
    console.error("Translation endpoint error:", err);
    return res.status(500).json({
      error: "Translation processing failed",
      originalText: req.body?.text || "",
      translatedText: req.body?.text || "",
      targetLanguage: req.body?.targetLanguage || "pt",
      detectedLanguage: "auto",
      cached: false,
      recommendation: null
    });
  }
});
app.get("/api/translate/glossary-recommendations", verifyAuthToken, requireRole(["operator", "regional_admin", "super_admin"]), async (req, res) => {
  try {
    const pending = inMemoryGlossaryRecommendations.filter((r) => r.status === "pending");
    return res.json(pending);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});
app.post("/api/translate/glossary-recommendations/approve", verifyAuthToken, requireRole(["operator", "regional_admin", "super_admin"]), async (req, res) => {
  try {
    const { id, term, translations, category } = req.body;
    const recIndex = inMemoryGlossaryRecommendations.findIndex((r) => r.id === id);
    if (recIndex !== -1) {
      inMemoryGlossaryRecommendations[recIndex].status = "approved";
    }
    const newTermName = term || (recIndex !== -1 ? inMemoryGlossaryRecommendations[recIndex].originalTerm : "New Term");
    const newTranslations = translations || (recIndex !== -1 ? inMemoryGlossaryRecommendations[recIndex].suggestedTranslations : { pt: newTermName, en: newTermName, ru: newTermName });
    const approvedObj = {
      id: `g-${Date.now()}`,
      term: newTermName,
      translations: newTranslations,
      category: category || "trade"
    };
    inMemoryApprovedGlossary.push(approvedObj);
    return res.json({ success: true, term: approvedObj });
  } catch (err) {
    return res.status(500).json({ error: "Failed to approve recommendation" });
  }
});
app.delete("/api/translate/glossary-recommendations/:id", verifyAuthToken, requireRole(["operator", "regional_admin", "super_admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const rec = inMemoryGlossaryRecommendations.find((r) => r.id === id);
    if (rec) {
      rec.status = "rejected";
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to reject recommendation" });
  }
});
app.get("/api/translate/glossary", async (req, res) => {
  try {
    return res.json(inMemoryApprovedGlossary);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch glossary" });
  }
});
app.get("/api/db-status", async (req, res) => {
  let isNeonConnected = false;
  let dbMessage = "Not connected";
  let latencyMs = -1;
  const counts = { users: 0, specialists: 0, jobs: 0 };
  const schemaCheck = {
    users_photo_url_exists: false,
    users_docs_exists: false,
    specialists_photo_url_exists: false,
    specialists_docs_exists: false
  };
  const start = Date.now();
  if (pool) {
    try {
      const client = await pool.connect();
      await client.query("SELECT 1");
      latencyMs = Date.now() - start;
      isNeonConnected = true;
      dbMessage = "Neon PostgreSQL Connected successfully!";
      const usersRes = await client.query("SELECT COUNT(*) FROM app_users");
      const specsRes = await client.query("SELECT COUNT(*) FROM specialists");
      const jobsRes = await client.query("SELECT COUNT(*) FROM jobs");
      counts.users = parseInt(usersRes.rows[0].count, 10);
      counts.specialists = parseInt(specsRes.rows[0].count, 10);
      counts.jobs = parseInt(jobsRes.rows[0].count, 10);
      const columnCheck = await client.query(`
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE table_name IN ('app_users', 'specialists') 
          AND column_name IN ('photo_url', 'verification_documents')
      `);
      columnCheck.rows.forEach((row) => {
        if (row.table_name === "app_users" && row.column_name === "photo_url") {
          schemaCheck.users_photo_url_exists = true;
        }
        if (row.table_name === "app_users" && row.column_name === "verification_documents") {
          schemaCheck.users_docs_exists = true;
        }
        if (row.table_name === "specialists" && row.column_name === "photo_url") {
          schemaCheck.specialists_photo_url_exists = true;
        }
        if (row.table_name === "specialists" && row.column_name === "verification_documents") {
          schemaCheck.specialists_docs_exists = true;
        }
      });
      client.release();
    } catch (err) {
      dbMessage = `Connection error: ${err.message || err}`;
    }
  } else {
    dbMessage = "DATABASE_URL / POSTGRES_URL is not configured. Falling back to in-memory state.";
    counts.users = inMemoryUsers.length;
    counts.specialists = inMemorySpecialists.length;
    counts.jobs = inMemoryJobs.length;
  }
  const isBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN || !!process.env.STORAGE_READ_WRITE_TOKEN;
  res.json({
    neon: {
      configured: !!dbUrl,
      connected: isNeonConnected,
      message: dbMessage,
      latencyMs,
      counts,
      schemaCheck
    },
    blob: {
      configured: isBlobConfigured,
      message: isBlobConfigured ? "Vercel Blob storage is configured and ready!" : "BLOB_READ_WRITE_TOKEN is not configured. Falling back to local/base64 uploads."
    }
  });
});
var handleDataSync = async (req, res) => {
  const caller = req.authenticatedUser;
  if (!caller || !caller.role) {
    return res.status(401).json({ error: "Unauthorized: Valid authentication token required" });
  }
  let rawUsers = [];
  let rawSpecialists = [];
  let rawJobs = [];
  let rawPartnerApplications = [];
  if (pool) {
    try {
      const client = await pool.connect();
      const usersRes = await client.query("SELECT * FROM app_users");
      const specsRes = await client.query("SELECT * FROM specialists");
      const jobsRes = await client.query("SELECT * FROM jobs ORDER BY created_at DESC");
      const partnerAppsRes = await client.query("SELECT * FROM partner_applications ORDER BY created_at DESC");
      client.release();
      rawUsers = usersRes.rows.map((r) => ({
        id: r.id,
        email: r.email,
        phone: r.phone || void 0,
        name: r.name,
        role: r.role,
        specialistStatus: r.specialist_status,
        city: r.city || void 0,
        category: r.category || void 0,
        photoUrl: r.photo_url || void 0,
        dashboardNumber: r.dashboard_number || void 0,
        region: r.region || void 0,
        isBlocked: r.is_blocked || false,
        verificationDocuments: typeof r.verification_documents === "string" ? JSON.parse(r.verification_documents) : r.verification_documents || [],
        categories: r.categories || [],
        languages: typeof r.languages === "string" ? JSON.parse(r.languages) : r.languages || [],
        tradeSkillLevel: r.trade_skill_level || void 0,
        skillsDescription: r.skills_description || void 0,
        specialtiesWithLevels: typeof r.specialties_with_levels === "string" ? JSON.parse(r.specialties_with_levels) : r.specialties_with_levels || []
      }));
      rawSpecialists = specsRes.rows.map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        category: r.category,
        city: r.city,
        region: r.region || void 0,
        dashboardNumber: r.dashboard_number || void 0,
        balance: parseFloat(r.balance || "0"),
        unlockedJobs: r.unlocked_jobs || [],
        photoUrl: r.photo_url || void 0,
        verificationDocuments: typeof r.verification_documents === "string" ? JSON.parse(r.verification_documents) : r.verification_documents || [],
        categories: r.categories || [],
        languages: typeof r.languages === "string" ? JSON.parse(r.languages) : r.languages || [],
        tradeSkillLevel: r.trade_skill_level || void 0,
        skillsDescription: r.skills_description || void 0,
        status: r.status || "pending_review",
        specialtiesWithLevels: typeof r.specialties_with_levels === "string" ? JSON.parse(r.specialties_with_levels) : r.specialties_with_levels || []
      }));
      rawJobs = jobsRes.rows.map((r) => ({
        id: r.id,
        category: r.category,
        city: r.city,
        region: r.region || void 0,
        hubId: r.hub_id || void 0,
        specificLocation: r.specific_location,
        description: r.description,
        estimatedHours: parseFloat(r.estimated_hours || "1"),
        estimatedValue: parseFloat(r.estimated_value || "0"),
        leadPrice: parseFloat(r.lead_price || "0"),
        status: r.status,
        createdAt: r.created_at,
        customerName: r.customer_name,
        customerPhone: r.customer_phone,
        customerId: r.customer_id,
        unlockedBySpecialistId: r.unlocked_by_specialist_id,
        coordinatorId: r.coordinator_id,
        coordinatorNotes: r.coordinator_notes,
        operatorId: r.coordinator_id,
        operatorNotes: r.coordinator_notes,
        attachments: r.attachments || [],
        messages: typeof r.messages === "string" ? JSON.parse(r.messages) : r.messages || [],
        customerCompleted: r.customer_completed || false,
        customerCompletedAt: r.customer_completed_at ? new Date(r.customer_completed_at).toISOString() : void 0,
        customerCompletion: typeof r.customer_completion === "string" ? JSON.parse(r.customer_completion) : r.customer_completion || void 0,
        specialistCompleted: r.specialist_completed || false,
        specialistCompletedAt: r.specialist_completed_at ? new Date(r.specialist_completed_at).toISOString() : void 0,
        specialistCompletion: typeof r.specialist_completion === "string" ? JSON.parse(r.specialist_completion) : r.specialist_completion || void 0,
        rating: r.rating ? parseFloat(r.rating) : void 0,
        positiveTags: r.positive_tags || [],
        customerComment: r.customer_comment || void 0
      }));
      rawPartnerApplications = partnerAppsRes.rows.map((r) => ({
        id: r.id,
        type: r.type,
        fullName: r.full_name,
        phone: r.phone,
        email: r.email,
        location: r.location,
        experience: r.experience || "",
        currentActivity: r.current_activity || "",
        teamSizeOrCapital: r.team_size_or_capital || "",
        notes: r.notes || "",
        status: r.status || "pending",
        createdAt: r.created_at
      }));
    } catch (err) {
      console.error("Error loading raw data from Neon DB, falling back to in-memory:", err);
      rawUsers = [...inMemoryUsers];
      rawSpecialists = [...inMemorySpecialists];
      rawJobs = [...inMemoryJobs];
      rawPartnerApplications = [...inMemoryPartnerApplications];
    }
  } else {
    rawUsers = [...inMemoryUsers];
    rawSpecialists = [...inMemorySpecialists];
    rawJobs = [...inMemoryJobs];
    rawPartnerApplications = [...inMemoryPartnerApplications];
  }
  const unlockedSpecialistIdsForCustomer = /* @__PURE__ */ new Set();
  if (caller.role === "customer") {
    rawJobs.forEach((j) => {
      const isCustomerJob = j.customerId && j.customerId === caller.id || caller.phone && j.customerPhone === caller.phone || caller.name && j.customerName === caller.name;
      if (isCustomerJob && j.unlockedBySpecialistId) {
        unlockedSpecialistIdsForCustomer.add(j.unlockedBySpecialistId);
      }
    });
  }
  const users = rawUsers.map((u) => {
    const { password, token, ...cleanU } = u;
    if (caller.role === "super_admin") {
      return cleanU;
    }
    if (caller.role === "regional_admin") {
      if (u.id === caller.id) return cleanU;
      if (caller.region && u.region && u.region !== caller.region) return null;
      return cleanU;
    }
    if (caller.role === "operator") {
      if (u.id === caller.id) return cleanU;
      if (caller.dashboardNumber && u.dashboardNumber && u.dashboardNumber !== caller.dashboardNumber) return null;
      return cleanU;
    }
    if (caller.role === "specialist") {
      if (u.id === caller.id) return cleanU;
      return null;
    }
    if (caller.role === "customer") {
      if (u.id === caller.id) return cleanU;
      if (u.role === "specialist") {
        return {
          id: u.id,
          name: u.name,
          role: u.role,
          specialistStatus: u.specialistStatus,
          city: u.city,
          category: u.category,
          photoUrl: u.photoUrl,
          categories: u.categories || [],
          languages: u.languages || [],
          tradeSkillLevel: u.tradeSkillLevel,
          skillsDescription: u.skillsDescription,
          specialtiesWithLevels: u.specialtiesWithLevels || [],
          aboutMe: u.aboutMe,
          marketplaceServices: u.marketplaceServices,
          isMarketplaceSpecialist: u.isMarketplaceSpecialist
        };
      }
      return null;
    }
    return null;
  }).filter(Boolean);
  const specialists = rawSpecialists.map((s) => {
    if (caller.role === "super_admin") {
      return s;
    }
    if (caller.role === "regional_admin") {
      if (caller.region && s.region && s.region !== caller.region) return null;
      return s;
    }
    if (caller.role === "operator") {
      if (caller.dashboardNumber && s.dashboardNumber && s.dashboardNumber !== caller.dashboardNumber) return null;
      return s;
    }
    if (caller.role === "specialist") {
      if (s.id === caller.id) return s;
      return null;
    }
    if (caller.role === "customer") {
      const isUnlocked = unlockedSpecialistIdsForCustomer.has(s.id);
      return {
        id: s.id,
        name: s.name,
        phone: isUnlocked ? s.phone : void 0,
        category: s.category,
        city: s.city,
        district: s.district,
        region: s.region,
        balance: 0,
        unlockedJobs: [],
        photoUrl: s.photoUrl,
        verificationDocuments: [],
        categories: s.categories || [],
        languages: s.languages || [],
        tradeSkillLevel: s.tradeSkillLevel,
        skillsDescription: s.skillsDescription,
        status: s.status,
        specialtiesWithLevels: s.specialtiesWithLevels || []
      };
    }
    return null;
  }).filter(Boolean);
  const jobs = rawJobs.map((j) => {
    if (caller.role === "super_admin") {
      return j;
    }
    if (caller.role === "regional_admin") {
      if (caller.region && j.region && j.region !== caller.region) return null;
      return j;
    }
    if (caller.role === "operator") {
      const isHubMatch = caller.dashboardNumber && j.hubId && j.hubId === caller.dashboardNumber;
      const isCoordinatorMatch = j.coordinatorId === caller.id || j.operatorId === caller.id;
      if (isHubMatch || isCoordinatorMatch || !caller.dashboardNumber) {
        return j;
      }
      return null;
    }
    if (caller.role === "customer") {
      const isOwner = j.customerId && j.customerId === caller.id || caller.phone && j.customerPhone === caller.phone || caller.name && j.customerName === caller.name;
      if (isOwner) {
        return j;
      }
      return null;
    }
    if (caller.role === "specialist") {
      const isUnlockedByMe = j.unlockedBySpecialistId === caller.id;
      const isOfferedToMe = j.offeredSpecialistIds && Array.isArray(j.offeredSpecialistIds) && j.offeredSpecialistIds.includes(caller.id);
      if (isUnlockedByMe || isOfferedToMe) {
        return j;
      }
      const isAvailableLead = ["pending_coordinator", "pending_operator", "offered", "active"].includes(j.status);
      if (!isAvailableLead) {
        return null;
      }
      return {
        ...j,
        customerName: j.customerName ? `${j.customerName.charAt(0)}. [Locked Lead]` : "Customer",
        customerPhone: "[Unlock Lead to View Phone]",
        specificLocation: `${j.city || "Portugal"} (General Area)`,
        messages: [],
        coordinatorNotes: void 0,
        operatorNotes: void 0
      };
    }
    return null;
  }).filter(Boolean);
  const partnerApplications = rawPartnerApplications.filter((a) => {
    if (caller.role === "super_admin") return true;
    if (caller.role === "regional_admin") {
      return !caller.region || !a.location || a.location.includes(caller.region);
    }
    if (caller.role === "operator") {
      return !caller.dashboardNumber || !a.location || a.location.includes(caller.dashboardNumber);
    }
    return false;
  });
  return res.json({ users, specialists, jobs, partnerApplications });
};
app.get("/api/data", verifyAuthToken, handleDataSync);
app.get("/api/sync", verifyAuthToken, handleDataSync);
app.post("/api/partner-applications", async (req, res) => {
  const {
    type,
    fullName,
    firstName,
    lastName,
    dob,
    phone,
    email,
    location,
    country,
    languages,
    photoUrl,
    currentActivity,
    yearsExperience,
    hasCustomerServiceExp,
    hasManagementExp,
    hasSalesExp,
    hasEntrepreneurExp,
    experience,
    hoursPerWeek,
    preferredSchedule,
    availableDays,
    hasVehicle,
    hasComputer,
    hasInternet,
    hasHomeOffice,
    teamSizeOrCapital,
    whyPartner,
    whyChooseYou,
    strengths,
    longTermGoals,
    notes,
    citiesToManage,
    businessKnowledgeLevel,
    existingNetwork,
    categoryProficiencies
  } = req.body;
  const constructedName = fullName || `${firstName || ""} ${lastName || ""}`.trim();
  if (!type || !constructedName && !email || !phone || !email) {
    return res.status(400).json({ error: "Missing required partner application fields" });
  }
  const newApp = {
    id: `partner-app-${Date.now()}`,
    type: type || "territorial",
    fullName: constructedName,
    firstName: firstName || "",
    lastName: lastName || "",
    dob: dob || "",
    phone,
    email,
    location: location || "Faro",
    country: country || "Portugal",
    languages: languages || [],
    photoUrl: photoUrl || "",
    currentActivity: currentActivity || "",
    yearsExperience: yearsExperience || "",
    hasCustomerServiceExp: !!hasCustomerServiceExp,
    hasManagementExp: !!hasManagementExp,
    hasSalesExp: !!hasSalesExp,
    hasEntrepreneurExp: !!hasEntrepreneurExp,
    experience: experience || "",
    hoursPerWeek: hoursPerWeek || "",
    preferredSchedule: preferredSchedule || "",
    availableDays: availableDays || [],
    hasVehicle: !!hasVehicle,
    hasComputer: !!hasComputer,
    hasInternet: !!hasInternet,
    hasHomeOffice: !!hasHomeOffice,
    teamSizeOrCapital: teamSizeOrCapital || "",
    whyPartner: whyPartner || "",
    whyChooseYou: whyChooseYou || "",
    strengths: strengths || "",
    longTermGoals: longTermGoals || "",
    notes: notes || "",
    citiesToManage: citiesToManage || [],
    businessKnowledgeLevel: businessKnowledgeLevel || "",
    existingNetwork: existingNetwork || "",
    categoryProficiencies: categoryProficiencies || [],
    status: "pending",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (pool) {
    try {
      const client = await pool.connect();
      await client.query(
        `INSERT INTO partner_applications (id, type, full_name, phone, email, location, experience, current_activity, team_size_or_capital, notes, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          newApp.id,
          newApp.type,
          newApp.fullName,
          newApp.phone,
          newApp.email,
          newApp.location,
          JSON.stringify(newApp),
          // Save full JSON payload in experience text column to preserve all wizard details in Postgres
          newApp.currentActivity,
          newApp.teamSizeOrCapital,
          newApp.notes,
          newApp.status,
          newApp.createdAt
        ]
      );
      client.release();
      return res.json({ success: true, application: newApp });
    } catch (err) {
      console.error("Error saving partner application to Neon:", err);
    }
  }
  inMemoryPartnerApplications.unshift(newApp);
  res.json({ success: true, application: newApp });
});
app.post("/api/partner-applications/:id/status", verifyAuthToken, requireRole(["operator", "regional_admin", "super_admin"]), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (pool) {
    try {
      const client = await pool.connect();
      await client.query(`UPDATE partner_applications SET status = $1 WHERE id = $2`, [status, id]);
      client.release();
      return res.json({ success: true });
    } catch (err) {
      console.error("Error updating partner application status:", err);
    }
  }
  const appItem = inMemoryPartnerApplications.find((a) => a.id === id);
  if (appItem) {
    appItem.status = status;
  }
  res.json({ success: true });
});
function getGoogleRedirectUri(req) {
  if (process.env.APP_URL) {
    const cleanUrl = process.env.APP_URL.replace(/\/$/, "");
    return `${cleanUrl}/api/auth/google/callback`;
  }
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.headers["x-forwarded-host"] || req.get("host");
  return `${protocol}://${host}/api/auth/google/callback`;
}
async function authenticateOrRegisterUser(email, phone, name, chosenRole, password, dashboardNumber, isRegistration) {
  const normalizedEmail = email ? email.toLowerCase().trim() : "";
  const normalizedPhone = phone ? phone.trim() : "";
  const targetRole = chosenRole || "customer";
  const allowedSuperAdmins = ["timeplace.internal@gmail.com", "ironstorm174@gmail.com", "oleg"];
  const isSuperAdminEmail = Boolean(
    normalizedEmail && allowedSuperAdmins.some((a) => normalizedEmail.includes(a) || a.includes(normalizedEmail))
  );
  if (isRegistration && ["super_admin", "regional_admin", "operator"].includes(targetRole)) {
    if (targetRole === "super_admin") {
      if (!isSuperAdminEmail) {
        return { error: "Privileged role registration is strictly forbidden." };
      }
    } else {
      return { error: "Privileged role registration is strictly forbidden." };
    }
  }
  if (targetRole === "super_admin" && !isSuperAdminEmail) {
    return { error: "Access denied. You are not authorized as Super Admin." };
  }
  const cleanPhone = normalizedPhone.replace(/[^0-9]/g, "");
  const userEmail = normalizedEmail && !normalizedEmail.includes("@nordbase.pt") ? normalizedEmail : `${cleanPhone || Date.now()}_${targetRole}@nordbase.pt`;
  if (pool) {
    let client = null;
    try {
      client = await pool.connect();
      if (targetRole === "super_admin") {
        const superFind = await client.query(
          `SELECT * FROM app_users 
           WHERE id = 'user-super-01' OR (role = 'super_admin' AND LOWER(TRIM(email)) = LOWER(TRIM($1)))
           LIMIT 1`,
          [normalizedEmail]
        );
        let superUserRow = superFind.rows[0];
        if (!superUserRow) {
          const newSuperId = "user-super-01";
          const insRes = await client.query(
            `INSERT INTO app_users (id, email, phone, name, role, specialist_status, city, region, dashboard_number, photo_url)
             VALUES ($1, $2, $3, $4, 'super_admin', 'approved', 'Portim\xE3o', 'Algarve', '01', '/portimao_tp.jpg')
             ON CONFLICT (id) DO UPDATE SET email = $2, role = 'super_admin', dashboard_number = '01'
             RETURNING *`,
            [newSuperId, normalizedEmail, normalizedPhone || "+351 901 000 000", name || "Oleg (Territorial Partner)"]
          );
          superUserRow = insRes.rows[0];
        }
        return {
          id: superUserRow.id,
          email: superUserRow.email || normalizedEmail,
          phone: superUserRow.phone || normalizedPhone || "+351 901 000 000",
          name: superUserRow.name || name || "Oleg (Territorial Partner)",
          role: "super_admin",
          specialistStatus: "approved",
          isNewUser: false,
          photoUrl: superUserRow.photo_url || "/portimao_tp.jpg",
          city: superUserRow.city || "Portim\xE3o",
          region: superUserRow.region || "Algarve",
          dashboardNumber: "01",
          isBlocked: false
        };
      }
      const findRes = await client.query(
        `SELECT * FROM app_users 
         WHERE ((phone = $1 AND phone <> '') 
            OR (LOWER(TRIM(email)) = LOWER(TRIM($2)) AND email <> '') 
            OR (LOWER(TRIM(email)) = LOWER(TRIM($3)) AND email <> ''))
           AND role = $4`,
        [normalizedPhone, normalizedEmail, userEmail, targetRole]
      );
      const existingRoleUser2 = findRes.rows[0];
      if (existingRoleUser2) {
        if (existingRoleUser2.is_blocked || existingRoleUser2.isBlocked) {
          return { error: "Access denied. Your account is blocked. Please contact support." };
        }
        if ((targetRole === "operator" || targetRole === "regional_admin") && existingRoleUser2.dashboard_number && dashboardNumber && existingRoleUser2.dashboard_number !== dashboardNumber) {
          return { error: "Invalid Dashboard Number." };
        }
        if ((!existingRoleUser2.name || existingRoleUser2.name === "User") && name) {
          existingRoleUser2.name = name;
          await client.query("UPDATE app_users SET name = $1 WHERE id = $2", [name, existingRoleUser2.id]);
        }
        return {
          id: existingRoleUser2.id,
          email: existingRoleUser2.email,
          phone: existingRoleUser2.phone || void 0,
          name: existingRoleUser2.name,
          role: existingRoleUser2.role,
          specialistStatus: existingRoleUser2.specialist_status || existingRoleUser2.specialistStatus || "not_requested",
          isNewUser: false,
          photoUrl: existingRoleUser2.photo_url || existingRoleUser2.photoUrl || void 0,
          verificationDocuments: typeof existingRoleUser2.verification_documents === "string" ? JSON.parse(existingRoleUser2.verification_documents) : existingRoleUser2.verification_documents || [],
          categories: existingRoleUser2.categories || [],
          languages: typeof existingRoleUser2.languages === "string" ? JSON.parse(existingRoleUser2.languages) : existingRoleUser2.languages || [],
          tradeSkillLevel: existingRoleUser2.trade_skill_level || existingRoleUser2.tradeSkillLevel || void 0,
          skillsDescription: existingRoleUser2.skills_description || existingRoleUser2.skillsDescription || void 0,
          specialtiesWithLevels: typeof existingRoleUser2.specialties_with_levels === "string" ? JSON.parse(existingRoleUser2.specialties_with_levels) : existingRoleUser2.specialtiesWithLevels || [],
          city: existingRoleUser2.city || void 0,
          region: existingRoleUser2.region || void 0,
          dashboardNumber: existingRoleUser2.dashboard_number || existingRoleUser2.dashboardNumber || void 0,
          isBlocked: existingRoleUser2.is_blocked || existingRoleUser2.isBlocked || false
        };
      } else {
        if (["operator", "regional_admin"].includes(targetRole)) {
          return { error: `Access denied. No partner account found for ${userEmail}. Please contact Super Admin.` };
        }
        const specialistStatus = targetRole === "specialist" ? "approved" : "not_requested";
        const userId = `user-${targetRole}-${Date.now()}`;
        const newUser2 = {
          id: userId,
          email: userEmail,
          phone: normalizedPhone || "",
          name: name || (normalizedEmail && normalizedEmail.includes("@") ? normalizedEmail.split("@")[0] : "User"),
          role: targetRole,
          specialistStatus,
          password: password || null
        };
        await client.query(
          `INSERT INTO app_users (id, email, phone, name, role, specialist_status, password) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET email = $2, phone = $3, name = $4, role = $5, specialist_status = $6`,
          [newUser2.id, newUser2.email, newUser2.phone, newUser2.name, newUser2.role, newUser2.specialistStatus, newUser2.password]
        );
        if (targetRole === "specialist") {
          await client.query(
            `INSERT INTO specialists (id, name, phone, category, city, balance, status) 
             VALUES ($1, $2, $3, $4, $5, 100, $6) 
             ON CONFLICT (id) DO UPDATE SET name = $2, phone = $3, status = $6`,
            [newUser2.id, newUser2.name, newUser2.phone || "", "Home Services", "Portim\xE3o", "approved"]
          );
        }
        return {
          id: newUser2.id,
          email: newUser2.email,
          phone: newUser2.phone || void 0,
          name: newUser2.name,
          role: newUser2.role,
          specialistStatus: newUser2.specialistStatus,
          isNewUser: true,
          photoUrl: void 0,
          verificationDocuments: [],
          categories: [],
          languages: []
        };
      }
    } catch (err) {
      console.error("Error during Neon DB auth (falling back to in-memory):", err);
    } finally {
      if (client) {
        try {
          client.release();
        } catch (e) {
        }
      }
    }
  }
  if (targetRole === "super_admin") {
    let superUser = inMemoryUsers.find((u) => u.role === "super_admin" || u.email && u.email.toLowerCase() === normalizedEmail.toLowerCase());
    if (!superUser) {
      superUser = {
        id: "user-super-01",
        email: normalizedEmail,
        phone: normalizedPhone || "+351 901 000 000",
        name: name || "Oleg (Territorial Partner)",
        role: "super_admin",
        dashboardNumber: "01",
        photoUrl: "/portimao_tp.jpg",
        city: "Portim\xE3o",
        region: "Algarve"
      };
      inMemoryUsers.push(superUser);
    }
    return {
      ...superUser,
      isNewUser: false
    };
  }
  const existingRoleUser = inMemoryUsers.find(
    (u) => u.role === targetRole && (normalizedPhone && u.phone === normalizedPhone || normalizedEmail && u.email && u.email.trim().toLowerCase() === normalizedEmail.toLowerCase())
  );
  if (existingRoleUser) {
    if (existingRoleUser.isBlocked) {
      return { error: "Access denied. Your account is blocked. Please contact support." };
    }
    if ((targetRole === "operator" || targetRole === "regional_admin") && existingRoleUser.dashboardNumber && dashboardNumber && existingRoleUser.dashboardNumber !== dashboardNumber) {
      return { error: "Invalid Dashboard Number." };
    }
    return {
      ...existingRoleUser,
      isNewUser: false
    };
  }
  if (["operator", "regional_admin"].includes(targetRole)) {
    return { error: `Access denied. No partner account found for ${userEmail}. Please contact Super Admin.` };
  }
  const newUser = {
    id: `user-${targetRole}-${Date.now()}`,
    email: userEmail,
    phone: normalizedPhone || "",
    name: name || (normalizedEmail && normalizedEmail.includes("@") ? normalizedEmail.split("@")[0] : "User"),
    role: targetRole,
    password: password || void 0,
    specialistStatus: targetRole === "specialist" ? "approved" : "not_requested"
  };
  inMemoryUsers.push(newUser);
  if (targetRole === "specialist") {
    const specObj = {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone || "",
      category: "Home Services",
      city: "Portim\xE3o",
      balance: 100,
      unlockedJobs: [],
      status: "approved"
    };
    if (!inMemorySpecialists.some((s) => s.id === newUser.id)) {
      inMemorySpecialists.push(specObj);
    }
  }
  return {
    ...newUser,
    isNewUser: true
  };
}
app.get("/api/config", (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || "107108300547-c42s30trn4g93c7qqmajb9amssd36dgh.apps.googleusercontent.com"
  });
});
var failedAttempts = /* @__PURE__ */ new Map();
app.post("/api/auth", async (req, res) => {
  try {
    const { email, phone, name, role, password, dashboardNumber, isRegistration } = req.body;
    const identifier = (email || phone || "").toLowerCase().trim();
    const attemptInfo = failedAttempts.get(identifier);
    if (attemptInfo) {
      const timeSinceLast = Date.now() - attemptInfo.lastAttempt;
      const requiredDelay = Math.min(attemptInfo.count * 1e3, 1e4);
      if (timeSinceLast < requiredDelay) {
        await new Promise((resolve) => setTimeout(resolve, requiredDelay - timeSinceLast));
      }
    }
    const userData = await authenticateOrRegisterUser(email, phone, name, role, password, dashboardNumber, isRegistration);
    if (userData.error) {
      const newCount = (attemptInfo ? attemptInfo.count : 0) + 1;
      failedAttempts.set(identifier, { count: newCount, lastAttempt: Date.now() });
      return res.status(400).json(userData);
    }
    failedAttempts.delete(identifier);
    if (userData && userData.id) {
      userData.token = generateAuthToken(userData.id);
      delete userData.password;
    }
    res.json(userData);
  } catch (err) {
    console.error("Error in /api/auth handler:", err);
    res.status(400).json({ error: err.message || "Authentication failed on server" });
  }
});
app.get("/api/auth/google/url", (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(400).json({
      error: "Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are not configured yet. Please add them in Secrets or environment variables."
    });
  }
  const redirectUri = getGoogleRedirectUri(req);
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
    access_type: "offline",
    prompt: "consent"
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  res.json({ url: authUrl });
});
app.get("/api/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;
  if (error || !code) {
    const errorMsg = error || "Authorization code missing";
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Google Authentication Failed</title></head>
      <body style="font-family: sans-serif; padding: 20px; text-align: center;">
        <h3 style="color: #dc2626;">Google Authentication Failed</h3>
        <p>${errorMsg}</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(errorMsg)} }, '*');
            setTimeout(() => window.close(), 3000);
          }
        </script>
      </body>
      </html>
    `);
  }
  try {
    const redirectUri = getGoogleRedirectUri(req);
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error || "Failed to exchange token");
    }
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const googleUser = await userResponse.json();
    if (!userResponse.ok || !googleUser.email) {
      throw new Error("Failed to retrieve user profile from Google");
    }
    const appUser = await authenticateOrRegisterUser(googleUser.email, "", googleUser.name || googleUser.email.split("@")[0]);
    if (appUser && appUser.id) {
      appUser.token = generateAuthToken(appUser.id);
      delete appUser.password;
    }
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Authentication Success</title></head>
      <body style="font-family: sans-serif; padding: 20px; text-align: center; background: #0f172a; color: #f8fafc;">
        <h3>Signed in successfully!</h3>
        <p>Returning to app...</p>
        <script>
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: ${JSON.stringify(appUser)} }, '*');
            window.close();
          } else {
            try {
              const storedKey = 'nordbase_work_state_v2';
              const stored = localStorage.getItem(storedKey);
              let state = stored ? JSON.parse(stored) : {};
              state.currentUser = ${JSON.stringify(appUser)};
              if (!state.users) state.users = [];
              if (!state.users.some(u => u.id === state.currentUser.id || u.email === state.currentUser.email)) {
                state.users.push(state.currentUser);
              }
              localStorage.setItem(storedKey, JSON.stringify(state));
            } catch(e) { console.error(e); }
            window.location.href = '/?auth=success';
          }
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    const errorMsg = err.message || "Error processing Google callback";
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Google Authentication Error</title></head>
      <body style="font-family: sans-serif; padding: 20px; text-align: center; background: #0f172a; color: #f8fafc;">
        <h3 style="color: #ef4444;">Authentication Error</h3>
        <p>${errorMsg}</p>
        <script>
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(errorMsg)} }, '*');
            setTimeout(() => window.close(), 3000);
          } else {
            setTimeout(() => window.location.href = '/?auth=error', 3000);
          }
        </script>
      </body>
      </html>
    `);
  }
});
app.post("/api/users/update", verifyAuthToken, async (req, res) => {
  try {
    const caller = req.authenticatedUser;
    const { users } = req.body;
    if (!Array.isArray(users)) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    for (const u of users) {
      if (!u || !u.id) continue;
      if (caller.role === "customer" || caller.role === "specialist" || caller.role === "operator") {
        if (u.id !== caller.id) {
          return res.status(403).json({ error: "Forbidden: You can only update your own user record." });
        }
        u.role = caller.role;
        u.isBlocked = false;
        u.dashboardNumber = caller.dashboardNumber || null;
        u.region = caller.region || null;
      } else if (caller.role === "regional_admin") {
        if (u.role === "super_admin") {
          return res.status(403).json({ error: "Forbidden: Cannot assign Super Admin role." });
        }
        if (u.id !== caller.id) {
          const target = await findUserById(u.id);
          if (target && target.role === "super_admin") {
            return res.status(403).json({ error: "Forbidden: Cannot modify Super Admin accounts." });
          }
          if (caller.region && target && target.region && target.region !== caller.region) {
            return res.status(403).json({ error: "Forbidden: User outside assigned region." });
          }
        }
      }
    }
    const cleanUsers = users.map((u) => {
      const copy = { ...u };
      delete copy.balance;
      delete copy.amount;
      delete copy.leadPrice;
      delete copy.finalPrice;
      return {
        ...copy,
        email: (copy.email || "").trim().toLowerCase(),
        phone: (copy.phone || "").trim()
      };
    });
    cleanUsers.forEach((u) => {
      const foundIndex = inMemoryUsers.findIndex((x) => x.id === u.id);
      if (foundIndex !== -1) {
        inMemoryUsers[foundIndex] = { ...inMemoryUsers[foundIndex], ...u };
      } else {
        inMemoryUsers.push(u);
      }
    });
    if (pool) {
      const client = await pool.connect();
      try {
        for (const u of cleanUsers) {
          try {
            const res2 = await client.query("SELECT id FROM app_users WHERE id = $1", [u.id]);
            if (res2.rows.length > 0) {
              await client.query(
                `UPDATE app_users 
                   SET is_blocked = $1, dashboard_number = $2, name = $3, phone = $4, email = $5, role = $6, password = $7, region = $8
                   WHERE id = $9`,
                [u.isBlocked || false, u.dashboardNumber || null, u.name || "", u.phone || "", u.email || "", u.role || "customer", u.password || null, u.region || null, u.id]
              );
            } else {
              await client.query(
                `INSERT INTO app_users (id, email, phone, name, role, specialist_status, dashboard_number, password, is_blocked, region)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [u.id, u.email || "", u.phone || "", u.name || "", u.role || "customer", u.specialistStatus || "not_requested", u.dashboardNumber || null, u.password || null, u.isBlocked || false, u.region || null]
              );
            }
          } catch (rowErr) {
            console.error(`Error saving user ${u.email} (${u.id}):`, rowErr);
          }
        }
      } finally {
        client.release();
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating users:", err);
    res.status(500).json({ error: "Failed to update users" });
  }
});
app.delete("/api/users/:id", verifyAuthToken, async (req, res) => {
  try {
    const caller = req.authenticatedUser;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (caller.role === "customer" || caller.role === "specialist" || caller.role === "operator") {
      return res.status(403).json({ error: "Forbidden: Standard users cannot delete user accounts." });
    }
    if (caller.role === "regional_admin") {
      const targetUser = await findUserById(id);
      if (!targetUser) return res.status(404).json({ error: "User not found" });
      if (targetUser.role === "super_admin") {
        return res.status(403).json({ error: "Forbidden: Cannot delete Super Admin" });
      }
      if (caller.region && targetUser.region && targetUser.region !== caller.region) {
        return res.status(403).json({ error: "Forbidden: Cannot delete user outside your region" });
      }
    }
    inMemoryUsers = inMemoryUsers.filter((u) => u.id !== id);
    inMemorySpecialists = inMemorySpecialists.filter((s) => s.id !== id);
    inMemoryJobs = inMemoryJobs.filter((j) => j.customerId !== id && j.assignedSpecialistId !== id);
    if (pool) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query("DELETE FROM app_users WHERE id = $1", [id]);
        await client.query("DELETE FROM specialists WHERE id = $1", [id]);
        await client.query("DELETE FROM jobs WHERE customer_id = $1 OR specialist_id = $1", [id]);
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error deleting user from DB:", err);
      } finally {
        client.release();
      }
    }
    res.json({ success: true, message: `User ${id} deleted successfully.` });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
app.post("/api/onboard", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const {
    userId,
    role,
    name,
    phone,
    city,
    category,
    categories,
    languages,
    tradeSkillLevel,
    skillsDescription,
    photoUrl,
    verificationDocuments,
    specialtiesWithLevels
  } = req.body;
  if (caller.role === "customer" || caller.role === "specialist" || caller.role === "operator") {
    if (userId && userId !== caller.id) {
      return res.status(403).json({ error: "Forbidden: Cannot onboard another user ID." });
    }
  }
  if (["super_admin", "regional_admin", "operator"].includes(role)) {
    if (caller.role !== "super_admin" && caller.role !== "regional_admin") {
      return res.status(403).json({ error: "Forbidden: Self-assigning privileged roles is forbidden." });
    }
  }
  const effectiveUserId = (caller.role === "super_admin" || caller.role === "regional_admin") && userId ? userId : caller.id;
  const effectiveRole = role || caller.role;
  if (pool) {
    let client;
    try {
      client = await pool.connect();
      const userRes = await client.query("SELECT specialist_status FROM app_users WHERE id = $1", [effectiveUserId]);
      const currentStatus = userRes.rows[0]?.specialist_status;
      let specialistStatus = "not_requested";
      if (effectiveRole === "specialist") {
        specialistStatus = "approved";
      }
      const safeCategory = category || categories && categories[0] || "Home Services";
      const safeCity = city || "Faro";
      const safeName = name || "Specialist";
      const safePhone = phone || "";
      await client.query(
        `INSERT INTO app_users (id, email, phone, name, role, specialist_status, city, category, photo_url, verification_documents, categories, languages, trade_skill_level, skills_description, specialties_with_levels)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (id) DO UPDATE 
         SET role = $5, name = $4, phone = $3, specialist_status = $6, city = $7, category = $8,
             photo_url = $9, verification_documents = $10, categories = $11, languages = $12,
             trade_skill_level = $13, skills_description = $14, specialties_with_levels = $15`,
        [
          effectiveUserId,
          `${effectiveUserId}@nordbase.pt`,
          safePhone,
          safeName,
          effectiveRole,
          specialistStatus,
          safeCity,
          safeCategory,
          photoUrl || null,
          JSON.stringify(verificationDocuments || []),
          categories || [],
          JSON.stringify(languages || []),
          tradeSkillLevel || null,
          skillsDescription || null,
          JSON.stringify(specialtiesWithLevels || [])
        ]
      );
      if (effectiveRole === "specialist") {
        await client.query(
          `INSERT INTO specialists (id, name, phone, category, city, balance, unlocked_jobs, 
                                    photo_url, verification_documents, categories, languages, 
                                    trade_skill_level, skills_description, status, specialties_with_levels) 
           VALUES ($1, $2, $3, $4, $5, 100, '{}', $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (id) DO UPDATE 
           SET name = $2, phone = $3, category = $4, city = $5, 
               photo_url = $6, verification_documents = $7, categories = $8, languages = $9, 
               trade_skill_level = $10, skills_description = $11, status = $12, specialties_with_levels = $13`,
          [
            effectiveUserId,
            safeName,
            safePhone,
            safeCategory,
            safeCity,
            photoUrl || null,
            JSON.stringify(verificationDocuments || []),
            categories || [],
            JSON.stringify(languages || []),
            tradeSkillLevel || null,
            skillsDescription || null,
            specialistStatus,
            JSON.stringify(specialtiesWithLevels || [])
          ]
        );
      }
    } catch (err) {
      console.error("Error during Neon onboarding DB query:", err);
    } finally {
      if (client) client.release();
    }
  }
  let u = inMemoryUsers.find((usr) => usr.id === effectiveUserId);
  if (!u) {
    u = {
      id: effectiveUserId,
      email: `${effectiveUserId}@nordbase.pt`,
      role: effectiveRole,
      name,
      phone,
      specialistStatus: effectiveRole === "specialist" ? "approved" : "not_requested"
    };
    inMemoryUsers.push(u);
  }
  u.role = effectiveRole;
  u.name = name;
  u.phone = phone;
  if (effectiveRole === "specialist") {
    u.specialistStatus = "approved";
  } else {
    u.specialistStatus = "not_requested";
  }
  u.city = city;
  u.category = category;
  u.categories = categories;
  u.languages = languages;
  u.tradeSkillLevel = tradeSkillLevel;
  u.skillsDescription = skillsDescription;
  u.photoUrl = photoUrl;
  u.verificationDocuments = verificationDocuments;
  u.specialtiesWithLevels = specialtiesWithLevels;
  if (effectiveRole === "specialist") {
    const exists = inMemorySpecialists.some((s) => s.id === effectiveUserId);
    if (!exists) {
      inMemorySpecialists.push({
        id: effectiveUserId,
        name,
        phone,
        category,
        city,
        balance: 100,
        unlockedJobs: [],
        status: u.specialistStatus,
        categories,
        languages,
        tradeSkillLevel,
        skillsDescription,
        photoUrl,
        verificationDocuments,
        specialtiesWithLevels
      });
    } else {
      const idx = inMemorySpecialists.findIndex((s) => s.id === effectiveUserId);
      if (idx !== -1) {
        inMemorySpecialists[idx] = {
          ...inMemorySpecialists[idx],
          name,
          phone,
          category,
          city,
          categories,
          languages,
          tradeSkillLevel,
          skillsDescription,
          photoUrl,
          verificationDocuments,
          status: u.specialistStatus,
          specialtiesWithLevels
        };
      }
    }
  }
  res.json({ success: true });
});
app.post("/api/user/update-photo", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const { userId, photoUrl } = req.body;
  const targetUserId = (caller.role === "super_admin" || caller.role === "regional_admin") && userId ? userId : caller.id;
  if (pool) {
    try {
      const client = await pool.connect();
      await client.query(
        `UPDATE app_users SET photo_url = $1 WHERE id = $2`,
        [photoUrl || null, targetUserId]
      );
      await client.query(
        `UPDATE specialists SET photo_url = $1 WHERE id = $2`,
        [photoUrl || null, targetUserId]
      );
      client.release();
    } catch (err) {
      console.error("Error updating user photo in Neon DB:", err);
    }
  }
  const u = inMemoryUsers.find((usr) => usr.id === targetUserId);
  if (u) {
    u.photoUrl = photoUrl;
  }
  const s = inMemorySpecialists.find((spec) => spec.id === targetUserId);
  if (s) {
    s.photoUrl = photoUrl;
  }
  res.json({ success: true });
});
app.post("/api/jobs", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const idempotencyKey = extractIdempotencyKey(req);
  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== "create_job") {
        return res.status(400).json({
          error: "Idempotency key reuse mismatch: key was previously used for a different operation.",
          code: "IDEMPOTENCY_KEY_REUSE_MISMATCH"
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }
  const { category, city, specificLocation, description, customerName, customerPhone, attachments, operatorId, hubId } = req.body;
  let finalCustomerName = customerName;
  let finalCustomerPhone = customerPhone;
  let finalCustomerId = caller.id;
  if (caller.role === "customer") {
    finalCustomerName = caller.name || customerName || caller.email.split("@")[0];
    finalCustomerPhone = caller.phone || customerPhone || "";
    finalCustomerId = caller.id;
  }
  if (pool) {
    try {
      const client = await pool.connect();
      const duplicateRes = await client.query(
        `SELECT * FROM jobs 
         WHERE customer_id = $1 
           AND category = $2 
           AND city = $3 
           AND description = $4 
           AND created_at >= NOW() - INTERVAL '60 seconds'
         ORDER BY created_at DESC LIMIT 1`,
        [finalCustomerId, category, city, description]
      );
      client.release();
      if (duplicateRes.rows.length > 0) {
        const dupJob = duplicateRes.rows[0];
        const formattedDup = {
          id: dupJob.id,
          category: dupJob.category,
          city: dupJob.city,
          specificLocation: dupJob.specific_location,
          description: dupJob.description,
          estimatedHours: parseFloat(dupJob.estimated_hours || "1"),
          estimatedValue: parseFloat(dupJob.estimated_value || "0"),
          leadPrice: parseFloat(dupJob.lead_price || "0"),
          status: dupJob.status,
          createdAt: new Date(dupJob.created_at).toISOString(),
          customerName: dupJob.customer_name,
          customerPhone: dupJob.customer_phone,
          customerId: dupJob.customer_id,
          unlockedBySpecialistId: dupJob.unlocked_by_specialist_id || null,
          coordinatorId: dupJob.coordinator_id || null,
          hubId: dupJob.hub_id || null,
          coordinatorNotes: dupJob.coordinator_notes || "",
          attachments: dupJob.attachments || [],
          messages: typeof dupJob.messages === "string" ? JSON.parse(dupJob.messages) : dupJob.messages || []
        };
        if (idempotencyKey) {
          await saveIdempotencyRecord(caller.id, idempotencyKey, "create_job", formattedDup.id, 200, formattedDup);
        }
        return res.json(formattedDup);
      }
    } catch (err) {
      console.error("Error checking duplicate job in DB:", err);
    }
  } else {
    const sixtySecsAgo = Date.now() - 6e4;
    const existingDup = inMemoryJobs.find(
      (j) => j.customerId === finalCustomerId && j.category === category && j.city === city && j.description === description && new Date(j.createdAt).getTime() >= sixtySecsAgo
    );
    if (existingDup) {
      if (idempotencyKey) {
        await saveIdempotencyRecord(caller.id, idempotencyKey, "create_job", existingDup.id, 200, existingDup);
      }
      return res.json(existingDup);
    }
  }
  const newJob = {
    id: `job-${Date.now()}`,
    category,
    city,
    specificLocation,
    description,
    estimatedHours: 1,
    estimatedValue: 0,
    leadPrice: 0,
    status: "pending_coordinator",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    customerName: finalCustomerName,
    customerPhone: finalCustomerPhone,
    customerId: finalCustomerId,
    unlockedBySpecialistId: null,
    coordinatorId: operatorId || null,
    hubId: hubId || null,
    coordinatorNotes: "",
    attachments: attachments || [],
    messages: []
  };
  if (pool) {
    try {
      const client = await pool.connect();
      await client.query(
        `INSERT INTO jobs (id, category, city, specific_location, description, estimated_hours, estimated_value, lead_price, status, created_at, customer_name, customer_phone, unlocked_by_specialist_id, coordinator_id, coordinator_notes, hub_id, attachments, messages, customer_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          newJob.id,
          newJob.category,
          newJob.city,
          newJob.specificLocation,
          newJob.description,
          newJob.estimatedHours,
          newJob.estimatedValue,
          newJob.leadPrice,
          newJob.status,
          newJob.createdAt,
          newJob.customerName,
          newJob.customerPhone,
          newJob.unlockedBySpecialistId,
          newJob.coordinatorId,
          newJob.coordinatorNotes,
          newJob.hubId || null,
          newJob.attachments,
          JSON.stringify(newJob.messages),
          newJob.customerId
        ]
      );
      client.release();
    } catch (err) {
      console.error("Error saving job to Neon:", err);
    }
  }
  inMemoryJobs.unshift(newJob);
  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, "create_job", newJob.id, 200, newJob);
  }
  return res.json(newJob);
});
async function performAtomicLeadUnlock(jobId, requestedSpecialistId, caller, res, req) {
  const idempotencyKey = req ? extractIdempotencyKey(req) : null;
  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== "unlock_lead" || existingRecord.resourceId !== jobId) {
        return res.status(400).json({
          error: "Idempotency key reuse mismatch: key was previously used for a different operation or resource.",
          code: "IDEMPOTENCY_KEY_REUSE_MISMATCH"
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }
  let targetSpecialistId = "";
  if (caller.role === "specialist") {
    targetSpecialistId = caller.id;
  } else if (caller.role === "super_admin" || caller.role === "regional_admin" || caller.role === "operator") {
    if (!requestedSpecialistId) {
      return res.status(400).json({ error: "Specialist ID required when unlocking lead", code: "SPECIALIST_ID_REQUIRED" });
    }
    targetSpecialistId = requestedSpecialistId;
  } else {
    return res.status(403).json({ error: "Forbidden: Only specialists or authorized operators can unlock leads", code: "FORBIDDEN_ROLE" });
  }
  if (caller.isBlocked) {
    return res.status(403).json({ error: "Forbidden: Account is blocked", code: "ACCOUNT_BLOCKED" });
  }
  if (!pool) {
    return res.status(503).json({
      error: "Database unavailable. Financial operations require persistent database connectivity.",
      code: "DATABASE_UNAVAILABLE"
    });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const jobRes = await client.query(
      "SELECT * FROM jobs WHERE id = $1 FOR UPDATE",
      [jobId]
    );
    if (jobRes.rows.length === 0) {
      await client.query("ROLLBACK");
      client.release();
      return res.status(404).json({ error: "Job not found", code: "JOB_NOT_FOUND" });
    }
    const job = jobRes.rows[0];
    const existingTxRes = await client.query(
      "SELECT * FROM lead_unlock_transactions WHERE job_id = $1",
      [jobId]
    );
    if (existingTxRes.rows.length > 0) {
      await client.query("ROLLBACK");
      client.release();
      return res.status(409).json({
        error: "Lead already unlocked by a specialist",
        code: "LEAD_ALREADY_UNLOCKED"
      });
    }
    if (job.status === "active" || job.status === "completed") {
      await client.query("ROLLBACK");
      client.release();
      return res.status(409).json({
        error: "Lead already unlocked or completed",
        code: "LEAD_ALREADY_UNLOCKED"
      });
    }
    if (job.unlocked_by_specialist_id && job.unlocked_by_specialist_id !== targetSpecialistId) {
      await client.query("ROLLBACK");
      client.release();
      return res.status(409).json({
        error: "Lead already assigned to another specialist",
        code: "LEAD_ALREADY_UNLOCKED"
      });
    }
    if (job.status === "cancelled") {
      await client.query("ROLLBACK");
      client.release();
      return res.status(400).json({ error: "Job is cancelled", code: "JOB_CLOSED" });
    }
    if (job.status === "pending_operator") {
      await client.query("ROLLBACK");
      client.release();
      return res.status(400).json({ error: "Lead cannot be unlocked before operator review and price calculation", code: "INVALID_JOB_STATE" });
    }
    const specRes = await client.query(
      "SELECT * FROM specialists WHERE id = $1 FOR UPDATE",
      [targetSpecialistId]
    );
    if (specRes.rows.length === 0) {
      await client.query("ROLLBACK");
      client.release();
      return res.status(404).json({ error: "Specialist profile not found", code: "SPECIALIST_NOT_FOUND" });
    }
    const specialist = specRes.rows[0];
    if (specialist.status === "blocked" || specialist.is_blocked) {
      await client.query("ROLLBACK");
      client.release();
      return res.status(403).json({ error: "Specialist account is blocked", code: "ACCOUNT_BLOCKED" });
    }
    const leadPrice = parseFloat(job.lead_price || "0");
    const specBalance = parseFloat(specialist.balance || "0");
    if (specBalance < leadPrice) {
      await client.query("ROLLBACK");
      client.release();
      return res.status(402).json({
        error: "Insufficient specialist balance to unlock lead",
        code: "INSUFFICIENT_BALANCE",
        currentBalance: specBalance,
        requiredPrice: leadPrice
      });
    }
    const newBalance = specBalance - leadPrice;
    await client.query(
      `UPDATE specialists 
       SET balance = $1, unlocked_jobs = array_append(unlocked_jobs, $2) 
       WHERE id = $3`,
      [newBalance, jobId, targetSpecialistId]
    );
    await client.query(
      `UPDATE jobs 
       SET status = 'active', unlocked_by_specialist_id = $1 
       WHERE id = $2`,
      [targetSpecialistId, jobId]
    );
    const txId = `tx_unlock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await client.query(
      `INSERT INTO lead_unlock_transactions (id, job_id, specialist_id, amount, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
      [txId, jobId, targetSpecialistId, leadPrice]
    );
    const existingMsgs = typeof job.messages === "string" ? JSON.parse(job.messages) : job.messages || [];
    const newMsgs = [
      ...existingMsgs,
      {
        id: `msg-${Date.now()}-sys-unlock`,
        sender: "system",
        senderName: "System",
        content: `Job unlocked by Specialist ${specialist.name}. Connection active.`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: `msg-${Date.now()}-spec-intro`,
        sender: "specialist",
        senderName: specialist.name,
        content: `Hello! I have unlocked your job through NordBase.pt. Let me coordinate the timing with you.`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    await client.query(
      `UPDATE jobs SET messages = $1 WHERE id = $2`,
      [JSON.stringify(newMsgs), jobId]
    );
    await client.query("COMMIT");
    client.release();
    const inMemJob = inMemoryJobs.find((j) => j.id === jobId);
    if (inMemJob) {
      inMemJob.status = "active";
      inMemJob.unlockedBySpecialistId = targetSpecialistId;
      inMemJob.messages = newMsgs;
    }
    const inMemSpec = inMemorySpecialists.find((s) => s.id === targetSpecialistId);
    if (inMemSpec) {
      inMemSpec.balance = newBalance;
      if (!inMemSpec.unlockedJobs) inMemSpec.unlockedJobs = [];
      if (!inMemSpec.unlockedJobs.includes(jobId)) {
        inMemSpec.unlockedJobs.push(jobId);
      }
    }
    const successResponse = {
      success: true,
      jobId,
      specialistId: targetSpecialistId,
      leadPriceDeducted: leadPrice,
      remainingBalance: newBalance,
      transactionId: txId
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, "unlock_lead", jobId, 200, successResponse);
    }
    return res.json(successResponse);
  } catch (err) {
    await client.query("ROLLBACK");
    client.release();
    console.error("Error during atomic lead unlock:", err);
    return res.status(500).json({ error: "Database transaction error during lead unlock", code: "TRANSACTION_ERROR" });
  }
}
app.post("/api/jobs/:id/unlock", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const { id } = req.params;
  const requestedSpecialistId = req.body.specialistId || req.body.unlockedBySpecialistId;
  return performAtomicLeadUnlock(id, requestedSpecialistId, caller, res, req);
});
app.post("/api/jobs/:id/customer-completion", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const { id } = req.params;
  const idempotencyKey = extractIdempotencyKey(req);
  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== "customer_completion" || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: "Idempotency key reuse mismatch: key was previously used for a different operation or resource.",
          code: "IDEMPOTENCY_KEY_REUSE_MISMATCH"
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }
  if (caller.role !== "customer") {
    return res.status(403).json({ error: "Forbidden: Only customers can submit customer completion sign-off", code: "FORBIDDEN_ROLE" });
  }
  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: "Job not found", code: "JOB_NOT_FOUND" });
  }
  const isOwner = existingJob.customerId && existingJob.customerId === caller.id || existingJob.customerPhone && caller.phone && existingJob.customerPhone === caller.phone || existingJob.customerName && caller.name && existingJob.customerName === caller.name;
  if (!isOwner) {
    return res.status(403).json({ error: "Forbidden: You are not the customer associated with this job request.", code: "NOT_JOB_OWNER" });
  }
  if (existingJob.status !== "active") {
    return res.status(409).json({ error: `Customer completion can only be submitted for active jobs. Current status: ${existingJob.status}`, code: "INVALID_JOB_STATE" });
  }
  const { orderCompleted, noClaims, paymentMade, rating, positiveTags, customerComment } = req.body;
  if (orderCompleted !== true || noClaims !== true || paymentMade !== true) {
    return res.status(400).json({
      error: "All three customer completion conditions must be explicitly true: orderCompleted, noClaims, paymentMade",
      code: "MISSING_CONFIRMATION_FLAGS"
    });
  }
  if (existingJob.customerCompleted) {
    const alreadyResp = {
      success: true,
      alreadyConfirmed: true,
      customerCompleted: true,
      confirmedAt: existingJob.customerCompletedAt
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, "customer_completion", id, 200, alreadyResp);
    }
    return res.json(alreadyResp);
  }
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const completionData = {
    confirmed: true,
    orderCompleted: true,
    noClaims: true,
    paymentMade: true,
    confirmedAt: nowIso
  };
  const ratingNum = rating !== void 0 ? parseFloat(rating) : void 0;
  const tagsArr = Array.isArray(positiveTags) ? positiveTags : [];
  const commentStr = typeof customerComment === "string" ? customerComment : void 0;
  const ratingText = ratingNum ? ` Rated: ${ratingNum}\u2B50` : "";
  const tagText = tagsArr.length > 0 ? ` (${tagsArr.join(", ")})` : "";
  const commentMsg = commentStr ? ` Comment: "${commentStr}"` : "";
  const newMsg = {
    id: `msg-${Date.now()}-cust-done`,
    sender: "system",
    senderName: "System",
    content: `Customer confirmed job completion: "Work completed, no disputes".${ratingText}${tagText}${commentMsg}`,
    timestamp: nowIso
  };
  if (pool) {
    const client = await pool.connect();
    try {
      const msgsRes = await client.query("SELECT messages FROM jobs WHERE id = $1", [id]);
      const currentMsgs = typeof msgsRes.rows[0]?.messages === "string" ? JSON.parse(msgsRes.rows[0].messages) : msgsRes.rows[0]?.messages || [];
      const updatedMsgs = [...currentMsgs, newMsg];
      const isBothCompleted = existingJob.specialistCompleted === true;
      const newStatus = isBothCompleted ? "completed" : "active";
      await client.query(
        `UPDATE jobs 
         SET customer_completed = true, 
             customer_completed_at = $1, 
             customer_completion = $2,
             rating = $3,
             positive_tags = $4,
             customer_comment = $5,
             messages = $6,
             status = $7
         WHERE id = $8 AND (status = 'active' OR status = 'completed')`,
        [nowIso, JSON.stringify(completionData), ratingNum || null, tagsArr, commentStr || null, JSON.stringify(updatedMsgs), newStatus, id]
      );
      client.release();
    } catch (err) {
      client.release();
      console.error("Error updating customer completion in DB:", err);
      return res.status(500).json({ error: "Database error updating customer completion" });
    }
  }
  existingJob.customerCompleted = true;
  existingJob.customerCompletedAt = nowIso;
  existingJob.customerCompletion = completionData;
  if (ratingNum) existingJob.rating = ratingNum;
  existingJob.positiveTags = tagsArr;
  if (commentStr) existingJob.customerComment = commentStr;
  if (existingJob.specialistCompleted) {
    existingJob.status = "completed";
  }
  if (commentStr) existingJob.customerComment = commentStr;
  if (!existingJob.messages) existingJob.messages = [];
  existingJob.messages.push(newMsg);
  const successResp = {
    success: true,
    customerCompleted: true,
    confirmedAt: nowIso
  };
  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, "customer_completion", id, 200, successResp);
  }
  return res.json(successResp);
});
app.post("/api/jobs/:id/specialist-completion", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const { id } = req.params;
  const idempotencyKey = extractIdempotencyKey(req);
  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== "specialist_completion" || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: "Idempotency key reuse mismatch: key was previously used for a different operation or resource.",
          code: "IDEMPOTENCY_KEY_REUSE_MISMATCH"
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }
  if (caller.role !== "specialist") {
    return res.status(403).json({ error: "Forbidden: Only specialists can submit specialist completion sign-off", code: "FORBIDDEN_ROLE" });
  }
  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: "Job not found", code: "JOB_NOT_FOUND" });
  }
  if (existingJob.unlockedBySpecialistId !== caller.id) {
    return res.status(403).json({ error: "Forbidden: You are not the specialist assigned to this job.", code: "NOT_ASSIGNED_SPECIALIST" });
  }
  if (existingJob.status !== "active") {
    return res.status(409).json({ error: `Specialist completion can only be submitted for active jobs. Current status: ${existingJob.status}`, code: "INVALID_JOB_STATE" });
  }
  const { workCompleted, paymentReceived, noClaims } = req.body;
  if (workCompleted !== true || paymentReceived !== true || noClaims !== true) {
    return res.status(400).json({
      error: "All three specialist completion conditions must be explicitly true: workCompleted, paymentReceived, noClaims",
      code: "MISSING_CONFIRMATION_FLAGS"
    });
  }
  if (existingJob.specialistCompleted) {
    const alreadyResp = {
      success: true,
      alreadyConfirmed: true,
      specialistCompleted: true,
      confirmedAt: existingJob.specialistCompletedAt
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, "specialist_completion", id, 200, alreadyResp);
    }
    return res.json(alreadyResp);
  }
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const completionData = {
    confirmed: true,
    workCompleted: true,
    paymentReceived: true,
    noClaims: true,
    confirmedAt: nowIso
  };
  const newMsg = {
    id: `msg-${Date.now()}-spec-done`,
    sender: "system",
    senderName: "System",
    content: `Specialist confirmed completion: "Work completed, payment received, no disputes".`,
    timestamp: nowIso
  };
  if (pool) {
    const client = await pool.connect();
    try {
      const msgsRes = await client.query("SELECT messages FROM jobs WHERE id = $1", [id]);
      const currentMsgs = typeof msgsRes.rows[0]?.messages === "string" ? JSON.parse(msgsRes.rows[0].messages) : msgsRes.rows[0]?.messages || [];
      const updatedMsgs = [...currentMsgs, newMsg];
      const isBothCompleted = existingJob.customerCompleted === true;
      const newStatus = isBothCompleted ? "completed" : "active";
      await client.query(
        `UPDATE jobs 
         SET specialist_completed = true, 
             specialist_completed_at = $1, 
             specialist_completion = $2,
             messages = $3,
             status = $4
         WHERE id = $5 AND (status = 'active' OR status = 'completed')`,
        [nowIso, JSON.stringify(completionData), JSON.stringify(updatedMsgs), newStatus, id]
      );
      client.release();
    } catch (err) {
      client.release();
      console.error("Error updating specialist completion in DB:", err);
      return res.status(500).json({ error: "Database error updating specialist completion" });
    }
  }
  existingJob.specialistCompleted = true;
  existingJob.specialistCompletedAt = nowIso;
  existingJob.specialistCompletion = completionData;
  if (existingJob.customerCompleted) {
    existingJob.status = "completed";
  }
  if (!existingJob.messages) existingJob.messages = [];
  existingJob.messages.push(newMsg);
  const successResp = {
    success: true,
    specialistCompleted: true,
    confirmedAt: nowIso
  };
  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, "specialist_completion", id, 200, successResp);
  }
  return res.json(successResp);
});
app.post("/api/jobs/:id/propose-price", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const { id } = req.params;
  const idempotencyKey = extractIdempotencyKey(req);
  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== "propose_price" || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: "Idempotency key reuse mismatch: key was previously used for a different operation or resource.",
          code: "IDEMPOTENCY_KEY_REUSE_MISMATCH"
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }
  if (caller.role !== "specialist") {
    return res.status(403).json({ error: "Forbidden: Only specialists can propose revised job prices.", code: "FORBIDDEN_ROLE" });
  }
  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: "Job not found", code: "JOB_NOT_FOUND" });
  }
  if (existingJob.unlockedBySpecialistId !== caller.id) {
    return res.status(403).json({ error: "Forbidden: You are not the assigned specialist for this job.", code: "NOT_ASSIGNED_SPECIALIST" });
  }
  if (existingJob.status !== "active") {
    return res.status(409).json({ error: `Price proposals can only be submitted for active jobs. Current status: ${existingJob.status}`, code: "INVALID_JOB_STATE" });
  }
  if (existingJob.customerPriceAccepted && existingJob.finalPrice) {
    return res.status(409).json({ error: "Cannot propose a new price: Customer has already accepted the price for this job.", code: "PRICE_ALREADY_ACCEPTED" });
  }
  const { proposedPrice } = req.body;
  const numericPrice = parseFloat(proposedPrice);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({ error: "Invalid proposed price: Must be a positive number.", code: "INVALID_PROPOSED_PRICE" });
  }
  if (existingJob.specialistAssessedValue === numericPrice) {
    const alreadyProposedResp = {
      success: true,
      jobId: id,
      proposedPrice: numericPrice,
      customerPriceAccepted: false,
      alreadyProposed: true
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, "propose_price", id, 200, alreadyProposedResp);
    }
    return res.json(alreadyProposedResp);
  }
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const newMsg = {
    id: `msg-${Date.now()}-price-prop`,
    sender: "system",
    senderName: "System",
    content: `Specialist assessed job scope on-site and proposed revised price: \u20AC${numericPrice.toFixed(2)} (Initial estimate: \u20AC${existingJob.estimatedValue}). Awaiting customer confirmation.`,
    timestamp: nowIso
  };
  if (pool) {
    const client = await pool.connect();
    try {
      const msgsRes = await client.query("SELECT messages FROM jobs WHERE id = $1", [id]);
      const currentMsgs = typeof msgsRes.rows[0]?.messages === "string" ? JSON.parse(msgsRes.rows[0].messages) : msgsRes.rows[0]?.messages || [];
      const updatedMsgs = [...currentMsgs, newMsg];
      await client.query(
        `UPDATE jobs 
         SET specialist_assessed_value = $1, 
             customer_price_accepted = false, 
             messages = $2 
         WHERE id = $3 AND status = 'active'`,
        [numericPrice, JSON.stringify(updatedMsgs), id]
      );
      client.release();
    } catch (err) {
      client.release();
      console.error("Error recording proposed price in DB:", err);
      return res.status(500).json({ error: "Database error recording proposed price" });
    }
  }
  existingJob.specialistAssessedValue = numericPrice;
  existingJob.customerPriceAccepted = false;
  if (!existingJob.messages) existingJob.messages = [];
  existingJob.messages.push(newMsg);
  const proposeResp = {
    success: true,
    jobId: id,
    proposedPrice: numericPrice,
    customerPriceAccepted: false
  };
  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, "propose_price", id, 200, proposeResp);
  }
  return res.json(proposeResp);
});
app.post("/api/jobs/:id/accept-price", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const { id } = req.params;
  const idempotencyKey = extractIdempotencyKey(req);
  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== "accept_price" || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: "Idempotency key reuse mismatch: key was previously used for a different operation or resource.",
          code: "IDEMPOTENCY_KEY_REUSE_MISMATCH"
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }
  if (caller.role !== "customer") {
    return res.status(403).json({ error: "Forbidden: Only customers can accept revised job prices.", code: "FORBIDDEN_ROLE" });
  }
  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: "Job not found", code: "JOB_NOT_FOUND" });
  }
  const isOwner = existingJob.customerId && existingJob.customerId === caller.id || existingJob.customerPhone && caller.phone && existingJob.customerPhone === caller.phone || existingJob.customerName && caller.name && existingJob.customerName === caller.name;
  if (!isOwner) {
    return res.status(403).json({ error: "Forbidden: You do not own this job request.", code: "NOT_JOB_OWNER" });
  }
  if (existingJob.status !== "active") {
    return res.status(409).json({ error: `Price acceptance can only occur for active jobs. Current status: ${existingJob.status}`, code: "INVALID_JOB_STATE" });
  }
  if (existingJob.customerPriceAccepted && existingJob.finalPrice) {
    const alreadyAcceptedResp = {
      success: true,
      jobId: id,
      finalPrice: existingJob.finalPrice,
      customerPriceAccepted: true,
      alreadyAccepted: true
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, "accept_price", id, 200, alreadyAcceptedResp);
    }
    return res.json(alreadyAcceptedResp);
  }
  const acceptedPrice = existingJob.specialistAssessedValue;
  if (!acceptedPrice || acceptedPrice <= 0) {
    return res.status(400).json({ error: "No revised price proposal exists for this job.", code: "NO_PRICE_PROPOSAL" });
  }
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const newMsg = {
    id: `msg-${Date.now()}-price-acc`,
    sender: "system",
    senderName: "System",
    content: `Customer accepted the revised price of \u20AC${acceptedPrice.toFixed(2)}. Work may proceed according to updated scope.`,
    timestamp: nowIso
  };
  if (pool) {
    const client = await pool.connect();
    try {
      const msgsRes = await client.query("SELECT messages FROM jobs WHERE id = $1", [id]);
      const currentMsgs = typeof msgsRes.rows[0]?.messages === "string" ? JSON.parse(msgsRes.rows[0].messages) : msgsRes.rows[0]?.messages || [];
      const updatedMsgs = [...currentMsgs, newMsg];
      await client.query(
        `UPDATE jobs 
         SET customer_price_accepted = true, 
             final_price = $1, 
             messages = $2 
         WHERE id = $3 AND status = 'active'`,
        [acceptedPrice, JSON.stringify(updatedMsgs), id]
      );
      client.release();
    } catch (err) {
      client.release();
      console.error("Error accepting price in DB:", err);
      return res.status(500).json({ error: "Database error accepting proposed price" });
    }
  }
  existingJob.customerPriceAccepted = true;
  existingJob.finalPrice = acceptedPrice;
  if (!existingJob.messages) existingJob.messages = [];
  existingJob.messages.push(newMsg);
  const acceptResp = {
    success: true,
    jobId: id,
    finalPrice: acceptedPrice,
    customerPriceAccepted: true
  };
  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, "accept_price", id, 200, acceptResp);
  }
  return res.json(acceptResp);
});
app.post("/api/jobs/:id/decline-price", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const { id } = req.params;
  const idempotencyKey = extractIdempotencyKey(req);
  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== "decline_price" || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: "Idempotency key reuse mismatch: key was previously used for a different operation or resource.",
          code: "IDEMPOTENCY_KEY_REUSE_MISMATCH"
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }
  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: "Job not found", code: "JOB_NOT_FOUND" });
  }
  if (existingJob.status === "cancelled") {
    const alreadyDeclinedResp = {
      success: true,
      jobId: id,
      status: "cancelled",
      calloutFeePending: existingJob.calloutFeePending || false,
      calloutFeeAmount: existingJob.calloutFeeAmount || 0,
      alreadyDeclined: true
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, "decline_price", id, 200, alreadyDeclinedResp);
    }
    return res.json(alreadyDeclinedResp);
  }
  const isCustomerOwner = caller.role === "customer" && (existingJob.customerId && existingJob.customerId === caller.id || existingJob.customerPhone && caller.phone && existingJob.customerPhone === caller.phone || existingJob.customerName && caller.name && existingJob.customerName === caller.name);
  const isAssignedSpecialist = caller.role === "specialist" && existingJob.unlockedBySpecialistId === caller.id;
  if (!isCustomerOwner && !isAssignedSpecialist) {
    return res.status(403).json({ error: "Forbidden: You are not authorized to decline price for this job.", code: "UNAUTHORIZED_DECLINE" });
  }
  if (existingJob.status !== "active") {
    return res.status(409).json({ error: `Price refusal can only be processed for active jobs. Current status: ${existingJob.status}`, code: "INVALID_JOB_STATE" });
  }
  const hasOnSiteAssessment = existingJob.specialistAssessedValue !== void 0 && existingJob.specialistAssessedValue > 0;
  const calloutFeePending = hasOnSiteAssessment;
  const calloutFeeAmount = hasOnSiteAssessment ? 20 : 0;
  const msgContent = hasOnSiteAssessment ? "Customer declined revised price after on-site assessment. Job cancelled with standard \u20AC20 Call-out Fee pending for specialist travel/time." : "Customer cancelled order prior to on-site assessment. Order cancelled.";
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const newMsg = {
    id: `msg-${Date.now()}-price-dec`,
    sender: "system",
    senderName: "System",
    content: msgContent,
    timestamp: nowIso
  };
  if (pool) {
    const client = await pool.connect();
    try {
      const msgsRes = await client.query("SELECT messages FROM jobs WHERE id = $1", [id]);
      const currentMsgs = typeof msgsRes.rows[0]?.messages === "string" ? JSON.parse(msgsRes.rows[0].messages) : msgsRes.rows[0]?.messages || [];
      const updatedMsgs = [...currentMsgs, newMsg];
      await client.query(
        `UPDATE jobs 
         SET status = 'cancelled', 
             callout_fee_pending = $1, 
             callout_fee_amount = $2, 
             messages = $3 
         WHERE id = $4 AND status = 'active'`,
        [calloutFeePending, calloutFeeAmount, JSON.stringify(updatedMsgs), id]
      );
      client.release();
    } catch (err) {
      client.release();
      console.error("Error declining price in DB:", err);
      return res.status(500).json({ error: "Database error declining proposed price" });
    }
  }
  existingJob.status = "cancelled";
  existingJob.calloutFeePending = calloutFeePending;
  existingJob.calloutFeeAmount = calloutFeeAmount;
  if (!existingJob.messages) existingJob.messages = [];
  existingJob.messages.push(newMsg);
  const declineResp = {
    success: true,
    jobId: id,
    status: "cancelled",
    calloutFeePending,
    calloutFeeAmount
  };
  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, "decline_price", id, 200, declineResp);
  }
  return res.json(declineResp);
});
app.post("/api/jobs/:id/complete", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const { id } = req.params;
  const idempotencyKey = extractIdempotencyKey(req);
  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== "tp_complete" || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: "Idempotency key reuse mismatch: key was previously used for a different operation or resource.",
          code: "IDEMPOTENCY_KEY_REUSE_MISMATCH"
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }
  if (caller.role !== "operator" && caller.role !== "regional_admin" && caller.role !== "super_admin") {
    return res.status(403).json({
      error: "Forbidden: Only Territory Partners and Administrators can finalize job completion.",
      code: "FORBIDDEN_ROLE"
    });
  }
  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: "Job not found", code: "JOB_NOT_FOUND" });
  }
  if (existingJob.status === "completed") {
    const alreadyCompletedResp = {
      success: true,
      jobId: id,
      status: "completed",
      alreadyCompleted: true
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, "tp_complete", id, 200, alreadyCompletedResp);
    }
    return res.json(alreadyCompletedResp);
  }
  if (caller.role === "operator") {
    if (caller.dashboardNumber && existingJob.hubId && caller.dashboardNumber !== existingJob.hubId) {
      if (existingJob.coordinatorId && existingJob.coordinatorId !== caller.id) {
        return res.status(403).json({ error: "Forbidden: You do not manage this territory/job.", code: "UNAUTHORIZED_TERRITORY" });
      }
    }
  } else if (caller.role === "regional_admin") {
    if (caller.region && existingJob.region && caller.region !== existingJob.region) {
      return res.status(403).json({ error: "Forbidden: Job outside assigned region.", code: "UNAUTHORIZED_REGION" });
    }
  }
  if (existingJob.status !== "active") {
    return res.status(409).json({
      error: `Job can only be finalized if current status is active. Current status: ${existingJob.status}`,
      code: "INVALID_JOB_STATE"
    });
  }
  if (!existingJob.customerCompleted) {
    return res.status(409).json({
      error: "Cannot finalize job: Customer completion confirmation is missing.",
      code: "MISSING_CUSTOMER_CONFIRMATION"
    });
  }
  if (!existingJob.specialistCompleted) {
    return res.status(409).json({
      error: "Cannot finalize job: Specialist completion confirmation is missing.",
      code: "MISSING_SPECIALIST_CONFIRMATION"
    });
  }
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const newMsg = {
    id: `msg-${Date.now()}-sys-done`,
    sender: "system",
    senderName: "System",
    content: `Territory Partner has marked the job as COMPLETED. Thank you for using NordBase.pt!`,
    timestamp: nowIso
  };
  if (pool) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const msgsRes = await client.query("SELECT messages FROM jobs WHERE id = $1 FOR UPDATE", [id]);
      const currentMsgs = typeof msgsRes.rows[0]?.messages === "string" ? JSON.parse(msgsRes.rows[0].messages) : msgsRes.rows[0]?.messages || [];
      const updatedMsgs = [...currentMsgs, newMsg];
      const updateRes = await client.query(
        `UPDATE jobs
         SET status = 'completed',
             messages = $1
         WHERE id = $2
           AND status = 'active'
           AND customer_completed = true
           AND specialist_completed = true`,
        [JSON.stringify(updatedMsgs), id]
      );
      if (updateRes.rowCount === 0) {
        await client.query("ROLLBACK");
        client.release();
        return res.status(409).json({
          error: "Atomic completion failed: Job status was modified or confirmations were invalidated concurrently.",
          code: "COMPLETION_PRECONDITION_FAILED"
        });
      }
      await client.query("COMMIT");
      client.release();
    } catch (err) {
      await client.query("ROLLBACK");
      client.release();
      console.error("Error during atomic job completion:", err);
      return res.status(500).json({ error: "Database transaction error during job completion", code: "TRANSACTION_ERROR" });
    }
  }
  existingJob.status = "completed";
  if (!existingJob.messages) existingJob.messages = [];
  existingJob.messages.push(newMsg);
  const tpCompleteResp = {
    success: true,
    jobId: id,
    status: "completed"
  };
  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, "tp_complete", id, 200, tpCompleteResp);
  }
  return res.json(tpCompleteResp);
});
app.post("/api/jobs/:id/update", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const { id } = req.params;
  if (req.body.status === "active" && (caller.role === "specialist" || req.body.unlockedBySpecialistId)) {
    return performAtomicLeadUnlock(id, req.body.unlockedBySpecialistId, caller, res);
  }
  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: "Job not found" });
  }
  if (req.body.status === "completed") {
    if (caller.role === "customer" || caller.role === "specialist") {
      return res.status(403).json({
        error: "Forbidden: Customers and Specialists cannot directly set job status to completed. Submit completion confirmation instead.",
        code: "FORBIDDEN_DIRECT_COMPLETION"
      });
    }
    if (!existingJob.customerCompleted || !existingJob.specialistCompleted) {
      return res.status(409).json({
        error: "Cannot mark job as completed without both Customer and Specialist confirmations.",
        code: "MISSING_PARTY_CONFIRMATIONS"
      });
    }
    if (existingJob.status !== "active") {
      return res.status(409).json({
        error: `Only active jobs can be marked as completed. Current status: ${existingJob.status}`,
        code: "INVALID_JOB_STATE"
      });
    }
  }
  if (existingJob.status === "completed" && req.body.status && req.body.status !== "completed") {
    return res.status(409).json({
      error: "Completed jobs cannot be reopened or changed to prior states.",
      code: "COMPLETED_JOB_IMMUTABLE"
    });
  }
  if (existingJob.status === "cancelled" && req.body.status === "completed") {
    return res.status(409).json({
      error: "Cancelled jobs cannot be marked as completed.",
      code: "INVALID_JOB_STATE"
    });
  }
  if (caller.role === "customer" || caller.role === "specialist") {
    delete req.body.leadPrice;
    delete req.body.estimatedValue;
    delete req.body.estimatedHours;
    delete req.body.specialistAssessedValue;
    delete req.body.finalPrice;
    delete req.body.calloutFeeAmount;
    delete req.body.calloutFeePending;
    delete req.body.balance;
    delete req.body.amount;
    delete req.body.unlockedBySpecialistId;
  }
  const isClosedJob = existingJob.status === "completed" || existingJob.status === "cancelled";
  const hasFinancialAttempt = req.body.leadPrice !== void 0 || req.body.estimatedValue !== void 0 || req.body.estimatedHours !== void 0 || req.body.specialistAssessedValue !== void 0 || req.body.finalPrice !== void 0 || req.body.calloutFeeAmount !== void 0;
  if (isClosedJob && hasFinancialAttempt) {
    return res.status(409).json({
      error: `Forbidden: Financial data for ${existingJob.status} jobs is immutable through normal APIs.`,
      code: "CLOSED_JOB_FINANCIAL_IMMUTABLE"
    });
  }
  if (caller.role === "customer") {
    const isOwner = existingJob.customerId && existingJob.customerId === caller.id || existingJob.customerPhone && caller.phone && existingJob.customerPhone === caller.phone || existingJob.customerName && caller.name && existingJob.customerName === caller.name;
    if (!isOwner) {
      return res.status(403).json({ error: "Forbidden: You do not own this job request." });
    }
    delete req.body.coordinatorNotes;
    delete req.body.operatorNotes;
    delete req.body.leadPrice;
    delete req.body.coordinatorId;
    delete req.body.operatorId;
  } else if (caller.role === "specialist") {
    const isUnlockedByMe = existingJob.unlockedBySpecialistId === caller.id;
    const isOfferedToMe = existingJob.offeredSpecialistIds && existingJob.offeredSpecialistIds.includes(caller.id);
    if (!isUnlockedByMe && !isOfferedToMe) {
      return res.status(403).json({ error: "Forbidden: You are not authorized to modify this job." });
    }
    delete req.body.coordinatorNotes;
    delete req.body.operatorNotes;
    delete req.body.leadPrice;
    delete req.body.coordinatorId;
    delete req.body.operatorId;
  } else if (caller.role === "operator") {
    if (caller.dashboardNumber && existingJob.hubId && caller.dashboardNumber !== existingJob.hubId) {
      if (existingJob.coordinatorId && existingJob.coordinatorId !== caller.id) {
        return res.status(403).json({ error: "Forbidden: Job belongs to another territory/operator." });
      }
    }
  } else if (caller.role === "regional_admin") {
    if (caller.region && existingJob.region && caller.region !== existingJob.region) {
      return res.status(403).json({ error: "Forbidden: Job outside assigned region." });
    }
  }
  const { status, coordinatorId, operatorId, coordinatorNotes, operatorNotes, estimatedHours, estimatedValue, leadPrice, unlockedBySpecialistId, offeredSpecialistIds, subcategory } = req.body;
  if (pool) {
    try {
      const client = await pool.connect();
      const currentRes = await client.query("SELECT * FROM jobs WHERE id = $1", [id]);
      if (currentRes.rows.length > 0) {
        const current = currentRes.rows[0];
        const finalStatus = status !== void 0 ? status : current.status;
        const finalCoordId = coordinatorId !== void 0 ? coordinatorId : operatorId !== void 0 ? operatorId : current.coordinator_id;
        const finalNotes = coordinatorNotes !== void 0 ? coordinatorNotes : operatorNotes !== void 0 ? operatorNotes : current.coordinator_notes;
        const finalHours = estimatedHours !== void 0 ? estimatedHours : current.estimated_hours;
        const finalVal = estimatedValue !== void 0 ? estimatedValue : current.estimated_value;
        const finalLeadPrice = leadPrice !== void 0 ? leadPrice : current.lead_price;
        const finalSpecId = unlockedBySpecialistId !== void 0 ? unlockedBySpecialistId : current.unlocked_by_specialist_id;
        await client.query(
          `UPDATE jobs 
           SET status = $1, coordinator_id = $2, coordinator_notes = $3, estimated_hours = $4, estimated_value = $5, lead_price = $6, unlocked_by_specialist_id = $7
           WHERE id = $8`,
          [finalStatus, finalCoordId, finalNotes, finalHours, finalVal, finalLeadPrice, finalSpecId, id]
        );
      }
      client.release();
    } catch (err) {
      console.error("Error updating job on Neon:", err);
    }
  }
  const job = inMemoryJobs.find((j) => j.id === id);
  if (job) {
    if (status !== void 0) job.status = status;
    if (coordinatorId !== void 0) {
      job.coordinatorId = coordinatorId;
      job.operatorId = coordinatorId;
    }
    if (operatorId !== void 0) {
      job.coordinatorId = operatorId;
      job.operatorId = operatorId;
    }
    if (coordinatorNotes !== void 0) {
      job.coordinatorNotes = coordinatorNotes;
      job.operatorNotes = coordinatorNotes;
    }
    if (operatorNotes !== void 0) {
      job.coordinatorNotes = operatorNotes;
      job.operatorNotes = operatorNotes;
    }
    if (estimatedHours !== void 0) job.estimatedHours = estimatedHours;
    if (estimatedValue !== void 0) job.estimatedValue = estimatedValue;
    if (leadPrice !== void 0) job.leadPrice = leadPrice;
    if (offeredSpecialistIds !== void 0) job.offeredSpecialistIds = offeredSpecialistIds;
    if (subcategory !== void 0) job.subcategory = subcategory;
    if (unlockedBySpecialistId !== void 0) job.unlockedBySpecialistId = unlockedBySpecialistId;
  }
  res.json({ success: true, job });
});
app.post("/api/jobs/:id/messages", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const { id } = req.params;
  const { content, text, channel, attachmentUrl, attachmentName } = req.body;
  const messageBody = (content || text || "").trim();
  const idempotencyKey = extractIdempotencyKey(req);
  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== "post_message" || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: "Idempotency key reuse mismatch: key was previously used for a different operation or resource.",
          code: "IDEMPOTENCY_KEY_REUSE_MISMATCH"
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }
  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: "Job not found" });
  }
  let isAuthorized = false;
  if (caller.role === "super_admin") {
    isAuthorized = true;
  } else if (caller.role === "customer") {
    if (existingJob.customerId && existingJob.customerId === caller.id || existingJob.customerPhone && caller.phone && existingJob.customerPhone === caller.phone || existingJob.customerName && caller.name && existingJob.customerName === caller.name) {
      isAuthorized = true;
    }
  } else if (caller.role === "specialist") {
    if (existingJob.unlockedBySpecialistId === caller.id || existingJob.offeredSpecialistIds && existingJob.offeredSpecialistIds.includes(caller.id)) {
      isAuthorized = true;
    }
  } else if (caller.role === "operator") {
    if (!caller.dashboardNumber || !existingJob.hubId || caller.dashboardNumber === existingJob.hubId || existingJob.coordinatorId === caller.id) {
      isAuthorized = true;
    }
  } else if (caller.role === "regional_admin") {
    if (!caller.region || !existingJob.region || caller.region === existingJob.region) {
      isAuthorized = true;
    }
  }
  if (!isAuthorized) {
    return res.status(403).json({ error: "Forbidden: You are not a participant in this job chat." });
  }
  const currentMsgs = existingJob.messages || [];
  const lastMsg = currentMsgs[currentMsgs.length - 1];
  if (lastMsg && lastMsg.sender === caller.role && (lastMsg.content === messageBody || lastMsg.text === messageBody) && Date.now() - new Date(lastMsg.timestamp).getTime() < 5e3) {
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, "post_message", id, 200, lastMsg);
    }
    return res.json(lastMsg);
  }
  const newMessage = {
    id: `msg-${Date.now()}`,
    sender: caller.role,
    senderRole: caller.role,
    senderName: caller.name || caller.email.split("@")[0],
    senderAvatar: void 0,
    content: messageBody,
    text: messageBody,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    channel: channel || "customer_operator",
    attachmentUrl: attachmentUrl || void 0,
    attachmentName: attachmentName || void 0
  };
  if (pool) {
    try {
      const client = await pool.connect();
      const currentRes = await client.query("SELECT messages FROM jobs WHERE id = $1", [id]);
      if (currentRes.rows.length > 0) {
        const messages = typeof currentRes.rows[0].messages === "string" ? JSON.parse(currentRes.rows[0].messages) : currentRes.rows[0].messages || [];
        messages.push(newMessage);
        await client.query(
          "UPDATE jobs SET messages = $1 WHERE id = $2",
          [JSON.stringify(messages), id]
        );
      }
      client.release();
      if (idempotencyKey) {
        await saveIdempotencyRecord(caller.id, idempotencyKey, "post_message", id, 200, newMessage);
      }
      return res.json(newMessage);
    } catch (err) {
      console.error("Error adding message on Neon:", err);
    }
  }
  const job = inMemoryJobs.find((j) => j.id === id);
  if (job) {
    job.messages.push(newMessage);
  }
  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, "post_message", id, 200, newMessage);
  }
  res.json(newMessage);
});
app.post("/api/specialists/:id/action", verifyAuthToken, async (req, res) => {
  const caller = req.authenticatedUser;
  const { id } = req.params;
  const { action, amount } = req.body;
  if (action === "request_verification") {
    if (caller.role === "customer") {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (caller.role === "specialist" && id !== caller.id) {
      return res.status(403).json({ error: "Forbidden: Cannot perform verification request on another specialist." });
    }
  } else if (action === "add_balance") {
    if (caller.role !== "super_admin") {
      return res.status(403).json({ error: "Forbidden: Balance adjustments require Super Admin authorization.", code: "FORBIDDEN_BALANCE_ADJUSTMENT" });
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Invalid balance amount: Must be a positive number.", code: "INVALID_AMOUNT" });
    }
  } else if (["approve", "reject"].includes(action)) {
    if (caller.role === "customer" || caller.role === "specialist") {
      return res.status(403).json({ error: "Forbidden: Administrative action requires operator or admin role." });
    }
    if (caller.role === "operator" || caller.role === "regional_admin") {
      const targetSpec = await findUserById(id);
      if (caller.region && targetSpec && targetSpec.region && caller.region !== targetSpec.region) {
        return res.status(403).json({ error: "Forbidden: Specialist outside your assigned region." });
      }
    }
  } else {
    return res.status(400).json({ error: "Invalid action" });
  }
  if (pool) {
    try {
      const client = await pool.connect();
      if (action === "approve") {
        await client.query(
          `UPDATE app_users SET specialist_status = 'approved' WHERE id = $1`,
          [id]
        );
        await client.query(
          `UPDATE specialists SET status = 'approved' WHERE id = $1`,
          [id]
        );
      } else if (action === "reject") {
        await client.query(
          `UPDATE app_users SET specialist_status = 'rejected' WHERE id = $1`,
          [id]
        );
        await client.query(
          `UPDATE specialists SET status = 'rejected' WHERE id = $1`,
          [id]
        );
      } else if (action === "request_verification") {
        await client.query(
          `UPDATE app_users SET specialist_status = 'pending_review' WHERE id = $1`,
          [id]
        );
        await client.query(
          `UPDATE specialists SET status = 'pending_review' WHERE id = $1`,
          [id]
        );
      } else if (action === "add_balance") {
        await client.query(
          `UPDATE specialists SET balance = balance + $1 WHERE id = $2`,
          [parseFloat(amount), id]
        );
      }
      client.release();
      return res.json({ success: true });
    } catch (err) {
      console.error("Error performing specialist action on Neon:", err);
    }
  }
  const u = inMemoryUsers.find((user) => user.id === id);
  const spec = inMemorySpecialists.find((s) => s.id === id);
  if (action === "approve") {
    if (u) u.specialistStatus = "approved";
    if (spec) spec.status = "approved";
  } else if (action === "reject") {
    if (u) u.specialistStatus = "rejected";
    if (spec) spec.status = "rejected";
  } else if (action === "request_verification") {
    if (u) u.specialistStatus = "pending_review";
    if (spec) spec.status = "pending_review";
  } else if (action === "add_balance") {
    if (spec) {
      spec.balance += parseFloat(amount);
    }
  }
  res.json({ success: true });
});
app.post("/api/reset-db", verifyAuthToken, requireSuperAdmin, async (req, res) => {
  if (pool) {
    try {
      const client = await pool.connect();
      await client.query("DROP TABLE IF EXISTS jobs");
      await client.query("DROP TABLE IF EXISTS specialists");
      await client.query("DROP TABLE IF EXISTS partner_applications");
      await client.query("DROP TABLE IF EXISTS app_users");
      client.release();
      console.log("All database tables dropped for complete data wipe.");
    } catch (err) {
      console.error("Error dropping tables:", err);
    }
  }
  inMemoryJobs = [];
  inMemorySpecialists = [];
  inMemoryPartnerApplications = [];
  inMemoryUsers = [
    {
      id: "user-super_admin",
      email: "super_admin@nordbase.pt",
      phone: "+351 900 000 000",
      name: "Super Admin",
      role: "super_admin",
      specialistStatus: "not_requested"
    }
  ];
  await initDb();
  res.json({ success: true, message: "All database tables and test data have been wiped clean." });
});
app.post("/api/upload", verifyAuthToken, async (req, res) => {
  try {
    const { filename, contentType, base64 } = req.body || {};
    if (!base64) {
      return res.status(400).json({ error: "No file base64 data provided in request body." });
    }
    const buffer = Buffer.from(base64, "base64");
    const finalFilename = filename || "uploaded_document";
    const finalMime = contentType || "application/octet-stream";
    const fallbackDataUrl = `data:${finalMime};base64,${base64}`;
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.STORAGE_READ_WRITE_TOKEN;
    if (blobToken) {
      const safeFilename = `${Date.now()}-${finalFilename.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      try {
        const blob = await put(safeFilename, buffer, {
          access: "private",
          token: blobToken,
          addRandomSuffix: true
        });
        console.log("Successfully uploaded file to Vercel Blob (PRIVATE):", blob.url);
        return res.json({ url: `/api/image?url=${encodeURIComponent(blob.url)}` });
      } catch (privateErr) {
        console.error("Vercel Blob private upload error:", privateErr.message || privateErr);
        try {
          const blob = await put(safeFilename, buffer, {
            access: "public",
            token: blobToken,
            addRandomSuffix: true
          });
          console.log("Successfully uploaded file to Vercel Blob (PUBLIC fallback):", blob.url);
          return res.json({ url: blob.url });
        } catch (pubErr) {
          console.error("Vercel Blob public fallback failed as well:", pubErr.message || pubErr);
        }
      }
    }
    try {
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const safeFilename = `${Date.now()}-${finalFilename.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const filePath = path.join(uploadsDir, safeFilename);
      fs.writeFileSync(filePath, buffer);
      const localUrl = `/uploads/${safeFilename}`;
      console.log("Uploaded file: Generated local static file URL:", localUrl);
      return res.json({ url: localUrl });
    } catch (localWriteErr) {
      console.warn("Local disk write failed (read-only environment). Returning base64 Data URL.");
      return res.json({ url: fallbackDataUrl });
    }
  } catch (err) {
    console.error("Error handling upload:", err);
    if (req.body && req.body.base64) {
      const mime = req.body.contentType || "application/octet-stream";
      return res.json({ url: `data:${mime};base64,${req.body.base64}` });
    }
    res.status(500).json({ error: err.message || "Failed to process file upload." });
  }
});
app.get("/api/image", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).send("Missing url parameter");
    }
    if (url.includes(".blob.vercel-storage.com")) {
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.STORAGE_READ_WRITE_TOKEN;
      const response = await fetch(url, {
        headers: {
          ...blobToken ? { Authorization: `Bearer ${blobToken}` } : {}
        }
      });
      if (!response.ok) {
        return res.status(response.status).send(`Failed to fetch image: ${response.statusText}`);
      }
      res.set("Content-Type", response.headers.get("Content-Type") || "application/octet-stream");
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      const arrayBuffer = await response.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    }
    return res.redirect(url);
  } catch (err) {
    console.error("Image proxy error:", err);
    res.status(500).send("Failed to proxy image");
  }
});
app.use((err, req, res, next) => {
  console.error("Express Error Handler caught an error:", err);
  res.status(err.status || err.statusCode || 500).json({
    error: err.message || "An unexpected server error occurred."
  });
});
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
}
if (!process.env.VERCEL) {
  startServer();
}
var server_default = app;
export {
  server_default as default,
  findJobById,
  findUserById,
  generateAuthToken,
  issueAuthToken,
  requireRole,
  requireSuperAdmin,
  verifyAndDecodeToken,
  verifyAuthToken
};
