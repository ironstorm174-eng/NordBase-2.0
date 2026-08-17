const fs = require('fs');
let content = fs.readFileSync('src/components/MarketplaceView.tsx', 'utf-8');
content = content.replace(
  "// const cities = useMemo(() => {\n    const list = allSpecialists\n      .filter(s => s.categories?.some(c => (typeof c === 'string' ? c : (c as any).name) === category))\n      .map(s => s.city)\n      .filter(Boolean) as string[];\n    return Array.from(new Set(list)).sort();\n  }, [allSpecialists, category]);",
  ""
);
fs.writeFileSync('src/components/MarketplaceView.tsx', content);
