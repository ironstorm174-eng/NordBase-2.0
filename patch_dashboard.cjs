const fs = require('fs');
let content = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf-8');

// Ensure we import MarketplaceSubscription
if (!content.includes('import MarketplaceSubscription')) {
  content = content.replace(
    "import SpecialistOnboarding from './SpecialistOnboarding';",
    "import SpecialistOnboarding from './SpecialistOnboarding';\nimport MarketplaceSubscription from './MarketplaceSubscription';"
  );
}

// Ensure store is imported
if (!content.includes("import { store } from '../store';")) {
  content = content.replace(
    "import { canViewChat } from '../lib/permissions';",
    "import { canViewChat } from '../lib/permissions';\nimport { store } from '../store';"
  );
}

// Modify handleOnboardingComplete
const newHandleOnboarding = `  const handleOnboardingComplete = (data: any) => {
    const isMarketplace = data.categories.some((c: any) => {
      const name = typeof c === 'string' ? c : c.name;
      return ['Care', 'Lessons', 'Other'].includes(name);
    });

    if (currentUser && onUpdateUser) {
      const updatedUser = {
        ...currentUser,
        phone: data.phone,
        category: data.categories[0] as ServiceCategory,
        categories: data.categories,
        city: data.city,
        specialistStatus: isMarketplace ? 'approved' : 'new' as SpecialistStatus, // Marketplace specs skip manual approval for now, or we manage it after subscription
        isNewUser: false,
        languages: data.languages,
        tradeSkillLevel: data.tradeSkillLevel,
        skillsDescription: data.skillsDescription,
        photoUrl: data.photoUrl,
        verificationDocuments: data.verificationDocuments,
        isMarketplaceSpecialist: isMarketplace
      };

      onUpdateUser(updatedUser);

      // We don't submit to review if marketplace, they go to subscription
      if (!isMarketplace) {
        store.submitSpecialistForReview(currentUser.id);
      }
    }
  };`;

content = content.replace(/  const handleOnboardingComplete = \(data: any\) => \{[\s\S]*?    \}\n  \};/, newHandleOnboarding);


// Add the subscription screen logic before "If pending approval"
const subScreenLogic = `
  // If it's a marketplace specialist and they need to subscribe
  if (currentUser && currentUser.isMarketplaceSpecialist && (!currentUser.subscriptionPlan || currentUser.subscriptionStatus !== 'active')) {
    return (
      <div className="absolute inset-0 z-50 bg-[#030712] text-slate-100 flex flex-col font-sans" id="specialist-subscription-layout">
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-white">NordBase<span className="text-cyan-500">Marketplace</span></span>
          </div>
          <button 
            onClick={() => onLogout?.()}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          <MarketplaceSubscription 
            currentUser={currentUser}
            onActivate={(plan) => {
              store.activateSubscription(currentUser.id, plan);
              // Optimistically update the UI user
              if (onUpdateUser) {
                onUpdateUser({
                  ...currentUser,
                  subscriptionPlan: plan,
                  subscriptionStatus: 'active'
                });
              }
            }}
          />
        </div>
      </div>
    );
  }

  // If pending approval, show pending screen
`;

content = content.replace(/  \/\/ If pending approval, show pending screen/g, subScreenLogic);

fs.writeFileSync('src/components/SpecialistDashboard.tsx', content);
console.log('Updated SpecialistDashboard');
