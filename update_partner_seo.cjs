const fs = require('fs');
let code = fs.readFileSync('src/components/PartnerLandingPage.tsx', 'utf8');

if (!code.includes("react-helmet-async")) {
  code = code.replace("import { useTranslation } from 'react-i18next';", "import { useTranslation } from 'react-i18next';\nimport { Helmet } from 'react-helmet-async';");
}

const helmetStr = `
      <Helmet>
        <title>{t('seo.partnerTitle', 'NordBase Franchise & Partnerships in Portugal')}</title>
        <meta name="description" content={t('seo.partnerDescription', 'Join NordBase as a Regional or Territorial Partner. Exclusive business opportunities and steady customer flow in Portugal.')} />
      </Helmet>
`;

if (!code.includes("<Helmet>")) {
  code = code.replace('return (\n    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-20">', 'return (\n    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-20">\n' + helmetStr);
}

fs.writeFileSync('src/components/PartnerLandingPage.tsx', code);
