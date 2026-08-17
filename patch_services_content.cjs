const fs = require('fs');
let content = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf-8');

const servicesTabContent = `
      {/* --- SERVICES TAB --- */}
      {activeTab === 'services' && (
        <MarketplaceServicesManager
          currentUser={currentUser!}
          onUpdateUser={onUpdateUser!}
        />
      )}
`;

content = content.replace(
  "      {/* --- ACADEMY TAB --- */}",
  servicesTabContent + "\n      {/* --- ACADEMY TAB --- */}"
);

fs.writeFileSync('src/components/SpecialistDashboard.tsx', content);
