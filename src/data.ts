/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CityInfo, ServiceCategory, Job, Specialist } from './types';

export const CITIES: CityInfo[] = [
  { name: 'Albufeira', region: 'Central Algarve', description: 'Busy tourist hub, famous sandy beaches and vibrant marina area.' },
  { name: 'Lagos', region: 'Western Algarve', description: 'Stunning rocky cliffs, historic center, high expat and visitor demand.' },
  { name: 'Portimão', region: 'Western Algarve', description: 'Scenic harbor city, commercial center, Praia da Rocha beach.' },
  { name: 'Alvor', region: 'Western Algarve', description: 'Picturesque fishing village, luxury golf resorts, tranquil lagoon.' },
  { name: 'Tavira', region: 'Eastern Algarve', description: 'Charming authentic town, ancient Roman bridge, salt pans.' },
  { name: 'Vilamoura', region: 'Central Algarve', description: 'Exclusive residential golf estates, award-winning yacht marina.' },
  { name: 'Faro', region: 'Central Algarve', description: 'Algarve regional capital, ancient old town, international hub.' },
  { name: 'Silves', region: 'Inland Algarve', description: 'Historic orange groves, red sandstone Moorish castle.' },
  { name: 'Quarteira', region: 'Central Algarve', description: 'Lively seaside promenade, traditional markets, beachside living.' },
];
export interface CategoryItem {
  id: ServiceCategory;
  iconName: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'Home Services', iconName: 'Home' },
  { id: 'Cleaning', iconName: 'Sparkles' },
  { id: 'Gardening', iconName: 'Flower' },
  { id: 'Moving', iconName: 'Package' },
  { id: 'Transport', iconName: 'Truck' },
  { id: 'Repairs', iconName: 'Wrench' },
  { id: 'Construction', iconName: 'Building' },
  { id: 'Pools', iconName: 'Waves' },
  { id: 'Hospitality', iconName: 'Utensils' },
  { id: 'Care', iconName: 'Heart' },
  { id: 'Lessons', iconName: 'BookOpen' },
  { id: 'Business', iconName: 'Coins' },
];

export const CATEGORY_SPECIALTIES: Record<ServiceCategory, string[]> = {
  'Home Services': ['Plumber', 'Electrician', 'Handyman', 'Locksmith', 'Carpenter', 'Painter', 'Glazier', 'Blinds', 'Doors'],
  'Cleaning': ['House Clean', 'Office Clean', 'Deep Clean', 'Window Clean', 'Carpet Clean', 'Upholstery', 'Airbnb Clean'],
  'Gardening': ['Gardener', 'Landscaper', 'Tree Surgeon', 'Irrigation', 'Lawn Care', 'Hedges'],
  'Moving': ['Mover', 'Furniture', 'Packing', 'Loading', 'Assembly', 'Piano Mover'],
  'Transport': ['Driver', 'Airport', 'Courier', 'Delivery', 'Van Driver', 'Chauffeur'],
  'Repairs': ['Appliances', 'HVAC', 'Refrigerator', 'Washer', 'Dishwasher', 'Oven', 'TV', 'Computers', 'Phones'],
  'Construction': ['Builder', 'Mason', 'Roofer', 'Tiler', 'Drywall', 'Concrete', 'Renovation', 'Scaffolding'],
  'Pools': ['Pool Cleaner', 'Maintenance', 'Pool Repair', 'Water Care', 'Equipment'],
  'Hospitality': ['Waiter', 'Bartender', 'Barista', 'Chef', 'Kitchen Help', 'Dishwasher', 'Housekeeper', 'Receptionist'],
  'Care': ['Babysitter', 'Elderly Care', 'Home Care', 'Disability', 'Pet Care', 'Dog Walker'],
  'Lessons': ['English', 'Portuguese', 'Spanish', 'Music', 'Piano', 'Guitar', 'Math', 'IT', 'Programming', 'Fitness', 'Yoga'],
  'Business': ['Office Help', 'Accountant', 'Realtor', 'Photo', 'Video', 'Designer', 'Marketing', 'Events', 'Translator', 'Lawyer', 'Legalization', 'Other']
};

export const INITIAL_SPECIALISTS: Specialist[] = [];

export const INITIAL_JOBS: Job[] = [];

export function normalizeServiceCategory(input: string | null | undefined): ServiceCategory | null {
  if (!input) return null;
  try {
    const decoded = decodeURIComponent(input).trim().toLowerCase();
    const matched = CATEGORIES.find(cat => 
      cat.id.toLowerCase() === decoded ||
      cat.id.toLowerCase().replace(/\s+/g, '-') === decoded ||
      cat.id.toLowerCase().replace(/\s+/g, '') === decoded ||
      cat.id.toLowerCase().replace(/\s+/g, '%20') === decoded
    );
    if (matched) return matched.id;
  } catch {
    // ignore decode error
  }

  const rawClean = input.trim().toLowerCase();
  const matchedRaw = CATEGORIES.find(cat => 
    cat.id.toLowerCase() === rawClean ||
    cat.id.toLowerCase().replace(/\s+/g, '-') === rawClean
  );
  return matchedRaw ? matchedRaw.id : null;
}
