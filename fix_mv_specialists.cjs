const fs = require('fs');
let content = fs.readFileSync('src/components/MarketplaceView.tsx', 'utf-8');

content = content.replace(
  "const allSpecialists = store.getState().users.filter(u => u.isMarketplaceSpecialist && u.subscriptionStatus === 'active');",
  "const allSpecialists = store.getState().users.filter(u => u.role === 'specialist' && u.categories?.some((c: any) => ['Care', 'Lessons', 'Other'].includes(c.name || c)));"
);

fs.writeFileSync('src/components/MarketplaceView.tsx', content);
