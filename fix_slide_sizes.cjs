const fs = require('fs');
let code = fs.readFileSync('src/components/PitchDeck.tsx', 'utf8');

// 1. Replace all <div className="space-y-12"> that immediately follow {/* SLIDE RENDERER CONTAINER */}
// with our unified container wrapper
code = code.replace(/\{\/\* SLIDE RENDERER CONTAINER \*\/\}\s*<div className="space-y-12">/g, 
`{/* SLIDE RENDERER CONTAINER */}
            <div className="relative w-full h-[80vh] min-h-[600px] flex flex-col">`);

// 2. We need to make all slides have uniform style. 
// A slide currently starts with something like:
// {tpSlide === 0 && (
//   <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#060e22] via-[#091b3f] to-[#040812] border-2 border-blue-500/40 shadow-2xl space-y-8 relative overflow-hidden">
//
// We want to replace all such outer divs of slides to have flex-1, overflow-y-auto, etc.
// Since there are many variations (bg-slate-900/90, border-slate-800, etc.), we can use a regex to match the opening tag of a slide.
// Pattern: `{xxxSlide === N && (\n <div className="...`

const slideOpenRegex = /(\{(?:tpSlide|rpSlide|invSlide)\s*===\s*\d+\s*&&\s*\(\s*)<div className="[^"]*rounded-3xl[^"]*">/g;

code = code.replace(slideOpenRegex, (match, prefix) => {
    return prefix + `<div className="flex-1 flex flex-col p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar">`;
});

// Also replace the case for `=== 5999` and `=== 9999`
const slideOpenRegexLarge = /(\{(?:tpSlide|rpSlide|invSlide)\s*===\s*\d{4,}\s*&&\s*\(\s*)<div className="[^"]*rounded-3xl[^"]*">/g;
code = code.replace(slideOpenRegexLarge, (match, prefix) => {
    return prefix + `<div className="flex-1 flex flex-col p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-y-auto custom-scrollbar">`;
});

// 3. Add global custom-scrollbar CSS if not present. It should be in index.css, but we can just use standard Tailwind scrollbar classes or plain overflow-y-auto. 
// Standard scrollbar is fine.

fs.writeFileSync('src/components/PitchDeck.tsx', code);
console.log("Unified slide sizes applied.");
