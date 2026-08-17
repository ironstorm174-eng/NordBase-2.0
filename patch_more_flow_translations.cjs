const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

code = code.replace(
  /<span>📞 \{lang === 'pt' \? 'Chamada Telefónica' : 'Direct Phone Call'\}<\/span>/,
  `<span>📞 {t('flow.contactPhoneCall', 'Phone Call')}</span>`
);
code = code.replace(
  /<span className="hover:text-slate-400 transition-colors cursor-pointer">SMM & Contacts coming soon<\/span>/,
  `<span className="hover:text-slate-400 transition-colors cursor-pointer">{t('flow.footerSMM', 'SMM & Contacts coming soon')}</span>`
);
code = code.replace(
  /<span className="hover:text-slate-400 transition-colors cursor-pointer">Support<\/span>/,
  `<span className="hover:text-slate-400 transition-colors cursor-pointer">{t('flow.footerSupport', 'Support')}</span>`
);
code = code.replace(
  /<p className="text-\[10px\] font-mono text-cyan-400 uppercase tracking-widest font-bold">Territorial Partner TP<\/p>/,
  `<p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">{t('flow.tpIdentified', 'Territorial Partner (TP) Identified')}</p>`
);
code = code.replace(
  /<p className="text-xxs text-slate-400 truncate">Region: \{op\?\.city \|\| currentJob\?\.city \|\| 'Portimão'\}<\/p>/,
  `<p className="text-xxs text-slate-400 truncate">{t('flow.regionLabel', 'Region')}: {op?.city || currentJob?.city || 'Portimão'}</p>`
);
code = code.replace(
  /<span className="text-white">\{currentJob\.unlockedBySpecialistName\} accepted<\/span>/,
  `<span className="text-white">{currentJob.unlockedBySpecialistName} {t('flow.accepted', 'accepted')}</span>`
);
code = code.replace(
  /<span className="text-white">\{currentJob\.estimatedHours\} Hours<\/span>/,
  `<span className="text-white">{currentJob.estimatedHours} {t('flow.hours', 'Hours')}</span>`
);

fs.writeFileSync('src/components/CustomerFlow.tsx', code);
