const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');

// The fields we know we added repeatedly
const fieldsToRemove = `  isMarketplaceSpecialist?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionEndDate?: string | null;
  subscriptionStatus?: 'active' | 'expired' | 'none';
  marketplaceServices?: SpecialistService[];
  aboutMe?: string;
  marketplaceAvailability?: SpecialistAvailabilitySlot[];`;

// Let's just remove ALL occurrences, then add it exactly ONCE where it belongs.
let newContent = content.split('\n').filter(line => {
  if (line.includes('isMarketplaceSpecialist?: boolean;')) return false;
  if (line.includes('subscriptionPlan?: SubscriptionPlan;')) return false;
  if (line.includes('subscriptionEndDate?: string | null;')) return false;
  if (line.includes("subscriptionStatus?: 'active' | 'expired' | 'none';")) return false;
  if (line.includes('marketplaceServices?: SpecialistService[];')) return false;
  if (line.includes('aboutMe?: string;')) return false;
  if (line.includes('marketplaceAvailability?: SpecialistAvailabilitySlot[];')) return false;
  return true;
}).join('\n');

newContent = newContent.replace("  verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[];\n}", "  verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[];\n" + fieldsToRemove + "\n}");

fs.writeFileSync('src/types.ts', newContent);
