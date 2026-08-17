const fs = require('fs');
let content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const target1 = `<p className="text-lg text-slate-300 leading-relaxed">All communication with specialists should happen strictly within the platform's chat system. This creates a permanent record that protects both you and the specialist in case of a dispute. Never use personal WhatsApp or Telegram for official platform business.</p>`;
const replacement1 = `<p className="text-lg text-slate-300 leading-relaxed">While the platform's chat system should be used to keep a permanent record for disputes, operators can and should use WhatsApp, Telegram, or direct phone calls to contact specialists and customers. This significantly increases the speed and richness of communication.</p>`;

content = content.replace(target1, replacement1);

const target2 = `<p className="text-sm text-cyan-400 font-medium">Level 1 — Specialist Academy</p>`;
const replacement2 = ``;

content = content.replace(target2, replacement2);

fs.writeFileSync('src/components/Academy.tsx', content);
console.log('Done');
