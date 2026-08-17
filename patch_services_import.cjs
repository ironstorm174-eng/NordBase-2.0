const fs = require('fs');
let content = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf-8');

if (!content.includes('import MarketplaceServicesManager')) {
  content = content.replace(
    "import MarketplaceSubscription from './MarketplaceSubscription';",
    "import MarketplaceSubscription from './MarketplaceSubscription';\nimport MarketplaceServicesManager from './MarketplaceServicesManager';"
  );
  fs.writeFileSync('src/components/SpecialistDashboard.tsx', content);
}
