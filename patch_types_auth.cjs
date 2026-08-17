const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');

const additionalFields = `
  // Marketplace & Subscription fields
  isMarketplaceSpecialist?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionEndDate?: string | null;
  subscriptionStatus?: 'active' | 'expired' | 'none';
  marketplaceServices?: SpecialistService[];
  aboutMe?: string;
  marketplaceAvailability?: SpecialistAvailabilitySlot[];
`;

if (!content.includes('isMarketplaceSpecialist?: boolean;')) {
  // Try to find the closing brace of AuthUser
  content = content.replace(/  verificationDocuments\?: \{ type: 'passport' \| 'id_card' \| 'drivers_license'; name: string; url: string \}...;\n\}/g, "  verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[];\n" + additionalFields + "}");
  fs.writeFileSync('src/types.ts', content);
  console.log('Added fields');
}
