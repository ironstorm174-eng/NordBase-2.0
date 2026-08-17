const fs = require('fs');
let code = fs.readFileSync('src/components/PartnerLandingPage.tsx', 'utf8');

// Add import
if (!code.includes("useTranslation")) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useTranslation } from 'react-i18next';");
}

// Add hook
if (!code.includes("const { t } = useTranslation();")) {
  code = code.replace("export default function PartnerLandingPage({\n  onBack\n}: PartnerLandingPageProps) {", "export default function PartnerLandingPage({\n  onBack\n}: PartnerLandingPageProps) {\n  const { t } = useTranslation();\n");
}

// Replace text
code = code.replace("<span>Territorial Partnership Network • Portugal</span>", "<span>{t('partner.heroBadge')}</span>");
code = code.replace("Become a NordBase Partner", "{t('partner.heroTitle')}");
code = code.replace("Join the Algarve's leading service network. Proven model, comprehensive training, and steady customer flow. Choose your partnership tier.", "{t('partner.heroSubtitle')}");
code = code.replace("Apply for Regional Partner", "{t('partner.heroApplyRP')}");
code = code.replace("Become a Territorial Partner", "{t('partner.heroApplyTP')}");

code = code.replace(">Regional Partner (RP)<", ">{t('partner.rpTitle')}<");
code = code.replace(">Regional Franchise Owner<", ">{t('partner.rpSubtitle')}<");
code = code.replace(">From €50,000<", ">{t('partner.rpInvestment')}<");
code = code.replace(">Exclusive rights to region or city<", ">{t('partner.rpFeature1')}<");
code = code.replace(">Recruit & manage Territorial Partners<", ">{t('partner.rpFeature2')}<");
code = code.replace(">Up to 15% revenue share on region sales<", ">{t('partner.rpFeature3')}<");
code = code.replace(">Full business management & marketing toolkit<", ">{t('partner.rpFeature4')}<");
code = code.replace(">License to run a complete NordBase Agency<", ">{t('partner.rpFeature5')}<");

code = code.replace(">Territorial Partner (TP)<", ">{t('partner.tpTitle')}<");
code = code.replace(">Independent Business Operator<", ">{t('partner.tpSubtitle')}<");
code = code.replace(">From €2,500<", ">{t('partner.tpInvestment')}<");
code = code.replace(">Guaranteed territory & customer leads<", ">{t('partner.tpFeature1')}<");
code = code.replace(">Proven business model in your area<", ">{t('partner.tpFeature2')}<");
code = code.replace(">High, independent earnings on services<", ">{t('partner.tpFeature3')}<");
code = code.replace(">Full training and certification in our Academy<", ">{t('partner.tpFeature4')}<");
code = code.replace(">HQ dispatching and management support<", ">{t('partner.tpFeature5')}<");

code = code.replace("<span>Training Academy</span>", "<span>{t('partner.academyBadge')}</span>");
code = code.replace("Expert Training & Certification", "{t('partner.academyTitle')}");
code = code.replace("Our dedicated Training Academy ensures you master our service standards, digital tools, and customer excellence.", "{t('partner.academySubtitle')}");

code = code.replace(">Digital Onboarding<", ">{t('partner.module1')}<");
code = code.replace(">Learn to use the NordBase system to manage leads, jobs, and customers.<", ">{t('partner.module1Desc')}<");
code = code.replace(">Service Standards<", ">{t('partner.module2')}<");
code = code.replace(">Master NordBase excellence protocols, from arrival to billing.<", ">{t('partner.module2Desc')}<");
code = code.replace(">Practical Training<", ">{t('partner.module3')}<");
code = code.replace(">Hands-on, in-the-field training with experienced Regional Partners.<", ">{t('partner.module3Desc')}<");

fs.writeFileSync('src/components/PartnerLandingPage.tsx', code);
