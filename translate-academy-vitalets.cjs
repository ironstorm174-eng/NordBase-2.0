const fs = require('fs');

async function run() {
    const { translate } = await import('@vitalets/google-translate-api');
    
    async function safeTranslate(text, lang, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const { text: resText } = await translate(text, { to: lang });
                return resText;
            } catch (e) {
                console.error(`Error on "${text.substring(0,20)}", attempt ${i+1}/${retries}`, e.message);
                await new Promise(r => setTimeout(r, 2000 * (i+1))); // backoff
            }
        }
        return text; // return original if failed
    }

    async function processFile(filePath, targetLang) {
      console.log(`Processing ${filePath} for ${targetLang}`);
      let content = fs.readFileSync(filePath, 'utf8');

      // 1. Translate curriculum titles: title: 'English text'
      const titleRegex = /title:\s*'([^']+)'/g;
      const titles = [...content.matchAll(titleRegex)];
      
      for (const match of titles) {
        const original = match[1];
        if (original.match(/[a-zA-Z]/)) {
            const text = await safeTranslate(original, targetLang);
            const translated = text.replace(/'/g, "\\'");
            content = content.replace(match[0], `title: '${translated}'`);
        }
      }

      // 2. Translate text between tags: >Text<
      const textRegex = />([^<{}]+)</g;
      const texts = [...content.matchAll(textRegex)];
      
      const uniqueTexts = [...new Set(texts.map(m => m[1]))].filter(t => t.trim().match(/[a-zA-Z]/));
      console.log(`Found ${uniqueTexts.length} unique texts for ${targetLang}`);
      
      const translations = {};
      for (let i=0; i<uniqueTexts.length; i+=1) {
         const original = uniqueTexts[i];
         translations[original] = await safeTranslate(original, targetLang);
         if (i > 0 && i % 20 === 0) console.log(`Translated ${i}/${uniqueTexts.length}`);
      }

      content = content.replace(textRegex, (match, p1) => {
         if (translations[p1]) {
             return `>${translations[p1]}<`;
         }
         return match;
      });

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Finished ${filePath}`);
    }

    console.log("Starting safe translation...");
    // Overwrite with fresh copy in case it was partially modified
    fs.copyFileSync('src/components/AcademyEN.tsx', 'src/components/AcademyPT.tsx');
    fs.copyFileSync('src/components/AcademyEN.tsx', 'src/components/AcademyRU.tsx');
    
    let pt = fs.readFileSync('src/components/AcademyPT.tsx', 'utf8').replace(/function AcademyEN\(/g, 'function AcademyPT(').replace(/export function AcademyEN/g, 'export function AcademyPT');
    fs.writeFileSync('src/components/AcademyPT.tsx', pt);
    
    let ru = fs.readFileSync('src/components/AcademyRU.tsx', 'utf8').replace(/function AcademyEN\(/g, 'function AcademyRU(').replace(/export function AcademyEN/g, 'export function AcademyRU');
    fs.writeFileSync('src/components/AcademyRU.tsx', ru);

    await processFile('src/components/AcademyPT.tsx', 'pt');
    await processFile('src/components/AcademyRU.tsx', 'ru');
}

run();
