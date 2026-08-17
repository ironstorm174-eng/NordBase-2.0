const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');

const targetStr = `  verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[];
}`;

const replaceStr = `  verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[];
  isMarketplaceSpecialist?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionEndDate?: string | null;
  subscriptionStatus?: 'active' | 'expired' | 'none';
  marketplaceServices?: SpecialistService[];
  aboutMe?: string;
  marketplaceAvailability?: SpecialistAvailabilitySlot[];
}`;

content = content.replace(/  verificationDocuments\?: \{ type: 'passport' \| 'id_card' \| 'drivers_license'; name: string; url: string \}...;\n\}/g, replaceStr);
fs.writeFileSync('src/types.ts', content);

// Now fix SpecialistOnboarding `categories` issue:
let onb = fs.readFileSync('src/components/SpecialistOnboarding.tsx', 'utf-8');
onb = onb.replace(/  const isMarketplace = categories\.some\(c => \['Care', 'Lessons', 'Other'\]\.includes\(c\.name\)\);\n  const \[categories, setCategories\] = useState/g, "  const [categories, setCategories] = useState<any[]>([]);\n  const isMarketplace = categories.some((c: any) => ['Care', 'Lessons', 'Other'].includes(c.name || c));\n");
// And remove the duplicate if there is one
if (onb.split('const [categories, setCategories] = useState').length > 2) {
  onb = onb.replace(/  const \[categories, setCategories\] = useState<any\[\]>\(\[\]\);\n  const \[categories, setCategories\] = useState/, '  const [categories, setCategories] = useState');
}
fs.writeFileSync('src/components/SpecialistOnboarding.tsx', onb);

// Now fix store.ts submitSpecialistForReview
let store = fs.readFileSync('src/store.ts', 'utf-8');
if (store.includes('public submitSpecialistForReview(id: string) {')) {
  // It exists
} else {
  // It was removed accidentally? Wait, why does it say "Property 'submitSpecialistForReview' does not exist on type 'AppStore'."?
  // Let me check if it's there.
  console.log("Checking store for submitSpecialistForReview:", store.includes('submitSpecialistForReview'));
}

