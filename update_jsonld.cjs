const fs = require('fs');

// 1. Update App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

if (!appCode.includes("seoSchemas")) {
  appCode = appCode.replace(
    "import { Helmet } from 'react-helmet-async';",
    "import { Helmet } from 'react-helmet-async';\nimport { getOrganizationSchema, getWebSiteSchema, getLocalBusinessSchema, getBreadcrumbSchema, getCustomerFaqSchema, getCategoryServiceSchema } from './lib/seoSchemas';"
  );
}

const helmetOriginal = `<Helmet htmlAttributes={{ lang: i18n.language }}>
        <title>{t('seo.homeTitle', 'NordBase.pt - Urgent Local Services in Portugal')}</title>
        <meta name="description" content={t('seo.homeDescription', 'Quick dispatch and coordination of urgent local services in Portugal. Connect with electricians, plumbers, and technicians.')} />
      </Helmet>`;

const helmetNew = `<Helmet htmlAttributes={{ lang: i18n.language }}>
        <title>{t('seo.homeTitle', 'NordBase.pt - Urgent Local Services in Portugal')}</title>
        <meta name="description" content={t('seo.homeDescription', 'Quick dispatch and coordination of urgent local services in Portugal. Connect with electricians, plumbers, and technicians.')} />
        
        {/* JSON-LD Microdata for Search Engines */}
        <script type="application/ld+json">{JSON.stringify(getOrganizationSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(getWebSiteSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(getLocalBusinessSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(getCustomerFaqSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(getBreadcrumbSchema([
          { name: 'Home', url: 'https://nordbase.pt/' },
          ...(isPartnerPage ? [{ name: 'Partner Franchise', url: 'https://nordbase.pt/partner' }] : []),
          ...(state.selectedCategory ? [{ name: state.selectedCategory, url: \`https://nordbase.pt/services/\${state.selectedCategory}\` }] : [])
        ]))}</script>
        {state.selectedCategory && (
          <script type="application/ld+json">{JSON.stringify(getCategoryServiceSchema(state.selectedCategory))}</script>
        )}
      </Helmet>`;

if (appCode.includes(helmetOriginal)) {
  appCode = appCode.replace(helmetOriginal, helmetNew);
} else {
  // If exact string doesn't match, search for <Helmet
  const hMatch = appCode.match(/<Helmet htmlAttributes[\s\S]*?<\/Helmet>/);
  if (hMatch) {
    appCode = appCode.replace(hMatch[0], helmetNew);
  }
}

fs.writeFileSync('src/App.tsx', appCode);

// 2. Update PartnerLandingPage.tsx JSON-LD schema to add Organization & Franchise Microdata
let partnerCode = fs.readFileSync('src/components/PartnerLandingPage.tsx', 'utf8');

if (!partnerCode.includes("getOrganizationSchema")) {
  partnerCode = partnerCode.replace(
    "import { useTranslation } from 'react-i18next';",
    "import { useTranslation } from 'react-i18next';\nimport { getOrganizationSchema, getBreadcrumbSchema } from '../lib/seoSchemas';"
  );
}

const partnerFaqInsert = `{/* Inject FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />`;

const partnerFaqReplacement = `{/* Inject Microdata JSON-LD Schemas for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbSchema([
          { name: 'Home', url: 'https://nordbase.pt/' },
          { name: 'Partner Franchise', url: 'https://nordbase.pt/partner' }
        ])) }}
      />`;

if (partnerCode.includes(partnerFaqInsert)) {
  partnerCode = partnerCode.replace(partnerFaqInsert, partnerFaqReplacement);
}

fs.writeFileSync('src/components/PartnerLandingPage.tsx', partnerCode);

console.log('JSON-LD microdata successfully updated in App.tsx and PartnerLandingPage.tsx!');
