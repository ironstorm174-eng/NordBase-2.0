const fs = require('fs');

function patchFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // replace {job.category} with {t('categories.' + job.category, job.category)}
  code = code.replace(/\{job\.category\}/g, "{job.category ? t('categories.' + job.category, job.category) : ''}");
  
  // replace {job.specialty} or {job.specialty || ''} etc.
  // there are some occurrences where it might just be text
  
  fs.writeFileSync(file, code);
}

patchFile('src/components/OperatorLeadsTerminal.tsx');
patchFile('src/components/SpecialistDashboard.tsx');
