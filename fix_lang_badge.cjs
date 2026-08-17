const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

const targetRu = "ИИ обеспечивает бесшовную работу";
const targetEn = "Seamless AI Operation";
const titleRu = "Мультиязычный чат";
const titleEn = "Multilingual Chat";

const replacement = `                    <div className="flex flex-col justify-center">
                      <span className="text-xxs text-slate-400 font-mono block uppercase leading-tight">{lang === 'ru' ? '${titleRu}' : '${titleEn}'}</span>
                      <span className="text-xs sm:text-sm font-black text-blue-300 font-mono mt-1 block leading-tight">{lang === 'ru' ? '${targetRu}' : '${targetEn}'}</span>
                    </div>`;

// Replace first occurrence
code = code.replace(
/                    <div>\s*<span className="text-xxs text-slate-400 font-mono block uppercase">\{lang === 'ru' \? 'Языковая поддержка' : 'Language Support'\}<\/span>\s*<span className="text-xl font-black text-blue-300 font-mono">EN, RU, PT, DE<\/span>\s*<\/div>/, 
replacement
);

// Replace second occurrence (it has text-cyan-300)
const replacement2 = `                    <div className="flex flex-col justify-center">
                      <span className="text-xxs text-slate-400 font-mono block uppercase leading-tight">{lang === 'ru' ? '${titleRu}' : '${titleEn}'}</span>
                      <span className="text-xs sm:text-sm font-black text-cyan-300 font-mono mt-1 block leading-tight">{lang === 'ru' ? '${targetRu}' : '${targetEn}'}</span>
                    </div>`;

code = code.replace(
/                    <div>\s*<span className="text-xxs text-slate-400 font-mono block uppercase">\{lang === 'ru' \? 'Языковая поддержка' : 'Language Support'\}<\/span>\s*<span className="text-xl font-black text-cyan-300 font-mono">EN, RU, PT, DE<\/span>\s*<\/div>/, 
replacement2
);

fs.writeFileSync('src/components/PitchDeck.tsx', code);
console.log("Badges updated.");
