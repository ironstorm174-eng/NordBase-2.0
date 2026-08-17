const fs = require('fs');
let content = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf-8');

const servicesTabBtn = `
        {currentUser?.isMarketplaceSpecialist && (
          <button
            id="spec-tab-services"
            onClick={() => { setActiveTab('services'); setSelectedJobId(null); }}
            className={\`px-5 py-3 font-display font-bold text-sm border-b-2 transition-all -mb-px cursor-pointer flex items-center gap-2 shrink-0 \${
              activeTab === 'services'
                ? 'border-cyan-400 text-cyan-400 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }\`}
          >
            <LayoutList className="w-4 h-4 shrink-0" />
            <span>Services & Schedule</span>
          </button>
        )}
`;

content = content.replace(
  "        <button\n          id=\"spec-tab-notifications\"",
  servicesTabBtn + "        <button\n          id=\"spec-tab-notifications\""
);

fs.writeFileSync('src/components/SpecialistDashboard.tsx', content);
