const fs = require('fs');
let content = fs.readFileSync('src/components/MarketplaceView.tsx', 'utf-8');
content = content.replace(
  "const cities = useMemo(() => {",
  "// const cities = useMemo(() => {"
);
fs.writeFileSync('src/components/MarketplaceView.tsx', content);
