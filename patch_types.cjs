const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');

const newTypes = `
export type SubscriptionPlan = '1_month_free' | '1_month' | '3_months' | '6_months' | '12_months' | 'none';

export interface SpecialistService {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface SpecialistAvailabilitySlot {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
}

export interface Operator {`;

content = content.replace('export interface Operator {', newTypes);

const authUserFields = `  // New onboarding fields
  languages?: { language: string; level: 'basic' | 'conversational' | 'native' }[];
  tradeSkillLevel?: 'amateur' | 'pro' | 'expert';
  specialtiesWithLevels?: SpecialtyWithLevel[];
  skillsDescription?: string;
  photoUrl?: string;
  avatar?: string;
  verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[];
  
  // Marketplace & Subscription fields
  isMarketplaceSpecialist?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionEndDate?: string | null;
  subscriptionStatus?: 'active' | 'expired' | 'none';
  marketplaceServices?: SpecialistService[];
  aboutMe?: string;
  marketplaceAvailability?: SpecialistAvailabilitySlot[];
}`;

content = content.replace(/  \/\/ New onboarding fields[\s\S]*?verificationDocuments\?: \{ type: 'passport' \| 'id_card' \| 'drivers_license'; name: string; url: string \}...;\n\}/g, authUserFields);

const specialistFields = `  // New onboarding fields
  languages?: { language: string; level: 'basic' | 'conversational' | 'native' }[];
  tradeSkillLevel?: 'amateur' | 'pro' | 'expert';
  specialtiesWithLevels?: SpecialtyWithLevel[];
  verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[];
  
  // Marketplace & Subscription fields
  isMarketplaceSpecialist?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionEndDate?: string | null;
  subscriptionStatus?: 'active' | 'expired' | 'none';
  marketplaceServices?: SpecialistService[];
  aboutMe?: string;
  marketplaceAvailability?: SpecialistAvailabilitySlot[];
}

export type SubscriptionPlan =`;

content = content.replace(/  \/\/ New onboarding fields[\s\S]*?verificationDocuments\?: \{ type: 'passport' \| 'id_card' \| 'drivers_license'; name: string; url: string \}...;\n\}\n\nexport type SubscriptionPlan =/g, specialistFields);


fs.writeFileSync('src/types.ts', content);
console.log('Done');
