const fs = require('fs');

function cleanRu(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Simplest way for some patterns:
  // lang === 'pt' ? '...' : lang === 'ru' ? '...' : '...'
  // we can just replace " : lang === 'ru' ? '...' : " with " : "
  
  // Also: i18n.language === 'en' ? 'en' : i18n.language === 'ru' ? 'ru' : 'pt';
  content = content.replace(/i18n\.language === 'en' \? 'en' : i18n\.language === 'ru' \? 'ru' : 'pt'/g, "i18n.language === 'en' ? 'en' : 'pt'");
  
  // Many inline translations were already extracted to `t()`.
  // Let's check if there are still any `lang === 'ru'`
  fs.writeFileSync(filePath, content);
}

['src/components/CustomerFlow.tsx', 'src/components/SpecialistDashboard.tsx', 'src/components/OperatorLeadsTerminal.tsx', 'src/components/SuperAdminDashboard.tsx'].forEach(cleanRu);
