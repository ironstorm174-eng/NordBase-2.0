const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("react-helmet-async")) {
  code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { Helmet } from 'react-helmet-async';");
}

const helmetStr = `
      <Helmet htmlAttributes={{ lang: i18n.language }}>
        <title>{t('seo.homeTitle', 'NordBase.pt - Urgent Local Services in Portugal')}</title>
        <meta name="description" content={t('seo.homeDescription', 'Quick dispatch and coordination of urgent local services in Portugal. Connect with electricians, plumbers, and technicians.')} />
      </Helmet>
`;

if (!code.includes("<Helmet")) {
  code = code.replace('return (\n    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-[#050B1A] to-[#01040D] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white" id="main-app-container">', 'return (\n    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-[#050B1A] to-[#01040D] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white" id="main-app-container">\n' + helmetStr);
}

fs.writeFileSync('src/App.tsx', code);
