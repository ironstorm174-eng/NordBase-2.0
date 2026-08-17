const fs = require('fs');
let code = fs.readFileSync('src/components/PartnerLandingPage.tsx', 'utf8');

code = code.replace(
  `      {/* Top Header Bar */}`,
  `      {/* Top Header Bar */}`
);

// We need to wrap the sections in <main>
code = code.replace(
  `      <section id="partner-hero"`,
  `      <main>\n      <section id="partner-hero"`
);

code = code.replace(
  `      <footer id="partner-footer"`,
  `      </main>\n      <footer id="partner-footer"`
);

fs.writeFileSync('src/components/PartnerLandingPage.tsx', code);
