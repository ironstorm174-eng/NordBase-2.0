const fs = require('fs');
let code = fs.readFileSync('src/components/AddressAutocomplete.tsx', 'utf8');

const targetStr = `    const timer = setTimeout(() => {
      // Mock suggestions
      setSuggestions([
        \`\${query}, Lisboa\`,
        \`\${query}, Porto\`,
        \`\${query}, Cascais\`
      ]);
      setLoading(false);
    }, 500);`;

const newStr = `    const timer = setTimeout(async () => {
      try {
        // Adding a user agent or identifying information is good practice for Nominatim
        const res = await fetch(\`https://nominatim.openstreetmap.org/search?q=\${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=pt\`, {
          headers: {
            'Accept-Language': 'pt,en'
          }
        });
        const data = await res.json();
        const formattedSuggestions = data.map((item: any) => item.display_name);
        setSuggestions(formattedSuggestions);
      } catch (err) {
        console.error("Failed to fetch addresses", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500);`;

code = code.replace(targetStr, newStr);

// Also add type="button" to the clear button to prevent form submission
code = code.replace(
  `className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
        >`,
  `className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
          type="button"
        >`
);

code = code.replace(
  `className="w-full text-left px-5 py-3 hover:bg-slate-800/50 flex items-center gap-3 text-sm text-slate-200 transition-colors"
                  >`,
  `className="w-full text-left px-5 py-3 hover:bg-slate-800/50 flex items-center gap-3 text-sm text-slate-200 transition-colors"
                    type="button"
                  >`
);

fs.writeFileSync('src/components/AddressAutocomplete.tsx', code);
