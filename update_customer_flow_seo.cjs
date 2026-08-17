const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

if (!code.includes("react-helmet-async")) {
  code = code.replace("import { useTranslation } from 'react-i18next';", "import { useTranslation } from 'react-i18next';\nimport { Helmet } from 'react-helmet-async';");
}

const helmetStr = `
      {selectedCategory && (
        <Helmet>
          <title>{t('seo.categoryTitle', { category: t('categories.' + selectedCategory, selectedCategory) })}</title>
          <meta name="description" content={t('seo.categoryDescription', { category: t('categories.' + selectedCategory, selectedCategory) })} />
        </Helmet>
      )}
`;

if (!code.includes("<Helmet>")) {
  code = code.replace('return (\n    <div className="flex flex-col min-h-screen bg-transparent">', 'return (\n    <div className="flex flex-col min-h-screen bg-transparent">\n' + helmetStr);
}

fs.writeFileSync('src/components/CustomerFlow.tsx', code);
