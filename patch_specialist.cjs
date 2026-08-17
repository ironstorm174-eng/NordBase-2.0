const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');

const target = `  verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[];
}`;

const replace = `  verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[];
  
  // Marketplace & Subscription fields
  isMarketplaceSpecialist?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionEndDate?: string | null;
  subscriptionStatus?: 'active' | 'expired' | 'none';
  marketplaceServices?: SpecialistService[];
  aboutMe?: string;
  marketplaceAvailability?: SpecialistAvailabilitySlot[];
}`;

// Note that there are two places for this replacement (Specialist and AuthUser).
// But AuthUser was already replaced if it worked... wait, let's just do a generic replace.

// I will just use `isMarketplaceSpecialist?: boolean;` to check if it's there.
if (!content.includes('isMarketplaceSpecialist')) {
  // Try to find the Specialist interface and AuthUser interface.
}
content = content.replace(/  verificationDocuments\?: \{ type: 'passport' \| 'id_card' \| 'drivers_license'; name: string; url: string \}...;\n\}/g, replace);

fs.writeFileSync('src/types.ts', content);
console.log('Done');
