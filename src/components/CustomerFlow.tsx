/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { AITranslatedMessage } from './AITranslatedMessage';
import { AIMessagePolisher } from './AIMessagePolisher';
import MarketplaceView from './MarketplaceView';
import JobCostEstimator from './JobCostEstimator';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { getCategoryServiceSchema, getBreadcrumbSchema } from '../lib/seoSchemas';
import { CATEGORIES, CATEGORY_SPECIALTIES } from '../data';
import { ServiceCategory, Job } from '../types';
import {
  Droplet,
  Zap,
  Hammer,
  Sparkles,
  Flower,
  Truck,
  Heart,
  Layers,
  Utensils,
  BookOpen,
  HelpCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Phone,
  ArrowLeft,
  MessageSquare,
  Wrench,
  Sparkle,
  Search,
  Compass,
  Anchor,
  Navigation,
  Sunset,
  Palmtree,
  Gem,
  Plane,
  Castle,
  Store,
  Activity,
  Home,
  Wind,
  Waves,
  Building,
  Paperclip,
  Upload,
  X,
  FileText,
  User,
  ChevronRight,
  Star,
  Landmark,
  Church,
  Sailboat,
  GraduationCap,
  Sun,
  Trees,
  Globe,
  Mountain,
  Coins,
  Lock,
  Ruler,
  Paintbrush,
  Grid,
  AlignJustify,
  DoorOpen,
  Sofa,
  Key,
  Sprout,
  Scissors,
  Package,
  Boxes,
  Users,
  Music,
  Car,
  Tv,
  Smartphone,
  Laptop,
  Cpu,
  Thermometer,
  Wrench as WrenchIcon,
  Coffee,
  Beer,
  ChefHat,
  BedDouble,
  ConciergeBell,
  Wine,
  Baby,
  HeartHandshake,
  Dog,
  Bone,
  HeartPulse,
  Languages,
  Calculator,
  Code,
  Dumbbell,
  Camera,
  Video,
  Palette,
  Megaphone,
  Calendar,
  FileSpreadsheet,
  Scale,
  FileCheck,
  UserCheck,
  Shield
} from 'lucide-react';
const CATEGORY_SOLID_COLORS: Record<string, string> = {
  'Home Services': 'bg-[#EB5757] text-white hover:bg-[#eb5757]/95',
  'Cleaning': 'bg-[#2F80ED] text-white hover:bg-[#2f80ed]/95',
  'Gardening': 'bg-[#27AE60] text-white hover:bg-[#27ae60]/95',
  'Moving': 'bg-[#8B5CF6] text-white hover:bg-[#8b5cf6]/95',
  'Transport': 'bg-[#F2994A] text-white hover:bg-[#f2994a]/95',
  'Repairs': 'bg-[#EC4899] text-white hover:bg-[#ec4899]/95',
  'Construction': 'bg-[#2B73B6] text-white hover:bg-[#2B73B6]/95',
  'Pools': 'bg-[#D946EF] text-white hover:bg-[#d946ef]/95',
  'Hospitality': 'bg-[#14B8A6] text-white hover:bg-[#14b8a6]/95',
  'Care': 'bg-[#F43F5E] text-white hover:bg-[#f43f5e]/95',
  'Lessons': 'bg-[#475569] text-white hover:bg-[#475569]/95',
  'Business': 'bg-[#6366F1] text-white hover:bg-[#6366f1]/95',
};
const CATEGORY_DETAILS: Record<string, { title: string; desc: string; examples: string }> = Object.keys(CATEGORY_SPECIALTIES).reduce((acc, cat) => {
  acc[cat] = {
    title: cat,
    desc: '',
    examples: (CATEGORY_SPECIALTIES[cat as ServiceCategory] || []).join(', ')
  };
  return acc;
}, {} as Record<string, { title: string; desc: string; examples: string }>);
interface CustomerFlowProps {
  key?: React.Key;
  selectedCategory: ServiceCategory | null;
  onSelectCategory: (category: ServiceCategory | null) => void;
  onSubmitRequest: (
    name: string,
    phone: string,
    location: string,
    description: string,
    attachments?: string[],
    operatorId?: string | null,
    hubId?: string
  ) => Job | Promise<Job>;
  jobs: Job[];
  onAddMessage: (
    jobId: string,
    sender: 'customer',
    senderName: string,
    content: string,
    channel?: 'customer_operator' | 'customer_specialist',
    attachmentUrl?: string,
    attachmentName?: string
  ) => void;
  currentUser?: any;
  onOpenDashboard?: () => void;
  onRequestLogin?: () => void;
}
import { findBestGeoMatch, getDispatcherForGeo } from '../lib/geo';
import { canViewChat } from '../lib/permissions';
import { AddressAutocomplete } from './AddressAutocomplete';
import { uploadImage } from '../utils/upload';
import { validatePhone } from '../lib/validation';
import { store, isMockAccount } from '../store';
export default function CustomerFlow({
  selectedCategory,
  onSelectCategory,
  onSubmitRequest,
  jobs,
  onAddMessage,
  currentUser,
  onOpenDashboard,
  onRequestLogin,
}: CustomerFlowProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'pt';
  // Local form state
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [countryCode, setCountryCode] = useState('+351');
  const [localPhone, setLocalPhone] = useState(currentUser?.phone ? currentUser.phone.replace(/^\+351\s*/, '') : '');
  const [specificLocation, setSpecificLocation] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'urgent' | 'today' | 'tomorrow' | 'flexible'>('urgent');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('anytime');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'phone' | 'telegram'>('whatsapp');
  const [submittedJobId, setSubmittedJobId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    customerName?: string;
    localPhone?: string;
    specificLocation?: string;
    description?: string;
  }>({});
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !customerName) setCustomerName(currentUser.name);
      if (currentUser.phone && !localPhone) {
        setLocalPhone(currentUser.phone.replace(/^\+351\s*/, ''));
      }
    }
  }, [currentUser]);
  
  // Local search query state
  const [searchQuery, setSearchQuery] = useState('');
  // Local chat message state
  const [typedMessage, setTypedMessage] = useState('');
  const [activeChatChannel, setActiveChatChannel] = useState<'customer_operator' | 'customer_specialist'>('customer_operator');
  const [chatUploading, setChatUploading] = useState(false);
  // Category and Specialty Selection State
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  // Reset specialty when parent resets selectedCategory
  useEffect(() => {
    if (!selectedCategory) {
      setSelectedSpecialty(null);
    }
  }, [selectedCategory]);
  // Find currently submitted job details if any
  const currentJob = jobs.find((j) => j.id === submittedJobId);
  // Find best geo match and dispatcher dynamically based on the specific location input
  const geoMatch = specificLocation ? findBestGeoMatch(specificLocation) : null;
  const matchedDispatcher = geoMatch ? getDispatcherForGeo(geoMatch.city, geoMatch.region) : null;
  // Find matching registered Hubs from the DB/Store matching this city or Algarve region
  const activeCity = geoMatch?.city || store.getState().selectedCity || 'Portimão';
  const allHubs = store.getState().hubs || [];
  const allUsers = store.getState().users || [];
  
  let combinedHubs = allHubs.filter(h => 
    h.city && (h.city.toLowerCase().includes(activeCity.toLowerCase()) || activeCity.toLowerCase().includes(h.city.toLowerCase()))
  );
  if (combinedHubs.length === 0) {
    combinedHubs = allHubs;
  }
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);

  useEffect(() => {
    if (combinedHubs.length > 0 && (!selectedHubId || !combinedHubs.some(h => h.id === selectedHubId))) {
      setSelectedHubId(combinedHubs[0].id);
    }
  }, [combinedHubs, selectedHubId]);
  
  const selectedHub = combinedHubs.find(h => h.id === selectedHubId) || combinedHubs[0];
  const activeHubSeat = selectedHub?.seats?.find(s => s.status === 'active' && s.operatorId) || selectedHub?.seats?.[0];
  const activeOperatorId = activeHubSeat?.operatorId;
  const activeOperator = store.getState().users?.find(u => u.id === activeOperatorId);
  // Helper to get matching category icon
  const getCategoryIcon = (name: string, className = "w-6 h-6 text-slate-700") => {
    switch (name) {
      case 'Droplet': return <Droplet className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Hammer': return <Hammer className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Flower': return <Flower className={className} />;
      case 'Truck': return <Truck className={className} />;
      case 'Package': return <Package className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Utensils': return <Utensils className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Home': return <Home className={className} />;
      case 'Wind': return <Wind className={className} />;
      case 'Waves': return <Waves className={className} />;
      case 'Building': return <Building className={className} />;
      case 'Wrench': return (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={className}
        >
          {/* Screwdriver (Diagonal from bottom-left to top-right) */}
          {/* Thick Handle */}
          <path d="M4 20l5.5-5.5" strokeWidth="3.5" />
          {/* Collar / Guard */}
          <path d="M9 15l1.5-1.5" strokeWidth="2.5" />
          {/* Shaft */}
          <path d="M10.5 13.5l7.5-7.5" strokeWidth="1.5" />
          {/* Flathead Tip */}
          <path d="M18 6l2-2" strokeWidth="3" />
          {/* Pliers (Diagonal from bottom-right to top-left) */}
          {/* Left handle */}
          <path d="M19.5 19.5c-1.5-2.5-3-4-5.5-5" strokeWidth="2" />
          {/* Right handle */}
          <path d="M17.5 21.5c-2.5-1.5-4-3-5-5.5" strokeWidth="2" />
          {/* Joint / Pivot */}
          <circle cx="12.5" cy="11.5" r="1.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
          {/* Left Jaw */}
          <path d="M11.5 12.5L7.5 8.5C6.5 7.5 6 6.5 5.5 5" strokeWidth="2" />
          {/* Right Jaw */}
          <path d="M12.5 11.5L8.5 7.5C7.5 6.5 7 6 5.5 5.5" strokeWidth="2" />
        </svg>
      );
      case 'Coins': return <Coins className={className} />;
      default: return <HelpCircle className={className} />;
    }
  };
  // Helper to get matching specialty icon for subcategories
  const getSpecialtyIcon = (specialty: string, className = "w-6 h-6 sm:w-11 sm:h-11 text-cyan-400 stroke-[1.5]") => {
    switch (specialty) {
      // Home Services
      case 'Plumber':
        return <Droplet className={className} />;
      case 'Electrician':
        return <Zap className={className} />;
      case 'Handyman':
        return <Hammer className={className} />;
      case 'Locksmith':
        return <Lock className={className} />;
      case 'Carpenter':
        return <Ruler className={className} />;
      case 'Painter':
        return <Paintbrush className={className} />;
      case 'Glazier':
        return <Grid className={className} />;
      case 'Blinds':
      case 'Blind Installer':
        return <AlignJustify className={className} />;
      case 'Doors':
      case 'Door Installer':
        return <DoorOpen className={className} />;
      // Cleaning
      case 'House Clean':
      case 'House Cleaner':
        return <Home className={className} />;
      case 'Office Clean':
      case 'Office Cleaner':
        return <Building className={className} />;
      case 'Deep Clean':
      case 'Deep Cleaning':
        return <Sparkles className={className} />;
      case 'Window Clean':
      case 'Window Cleaner':
        return <Grid className={className} />;
      case 'Carpet Clean':
      case 'Carpet Cleaner':
        return <Waves className={className} />;
      case 'Upholstery':
      case 'Upholstery Cleaner':
        return <Sofa className={className} />;
      case 'Airbnb Clean':
      case 'Airbnb Cleaner':
        return <Key className={className} />;
      // Gardening
      case 'Gardener':
        return <Sprout className={className} />;
      case 'Landscaper':
        return <Mountain className={className} />;
      case 'Tree Surgeon':
        return <Trees className={className} />;
      case 'Irrigation':
      case 'Irrigation Technician':
        return <Droplet className={className} />;
      case 'Lawn Care':
        return <Flower className={className} />;
      case 'Hedges':
      case 'Hedge Trimming':
        return <Scissors className={className} />;
      // Moving
      case 'Mover':
        return <Package className={className} />;
      case 'Furniture':
      case 'Furniture Mover':
        return <Sofa className={className} />;
      case 'Packing':
      case 'Packing Service':
        return <Boxes className={className} />;
      case 'Loading':
      case 'Loading Crew':
        return <Users className={className} />;
      case 'Assembly':
      case 'Furniture Assembly':
        return <Hammer className={className} />;
      case 'Piano Mover':
        return <Music className={className} />;
      // Transport
      case 'Driver':
      case 'Personal Driver':
        return <User className={className} />;
      case 'Airport':
      case 'Airport Transfer':
        return <Plane className={className} />;
      case 'Courier':
        return <Send className={className} />;
      case 'Delivery':
      case 'Delivery Driver':
        return <Truck className={className} />;
      case 'Van Driver':
        return <Car className={className} />;
      case 'Chauffeur':
        return <User className={className} />;
      // Repairs
      case 'Appliances':
      case 'Appliance Repair Technician':
        return <WrenchIcon className={className} />;
      case 'HVAC':
      case 'HVAC Technician':
        return <Wind className={className} />;
      case 'Refrigerator':
      case 'Refrigerator Repair':
        return <Thermometer className={className} />;
      case 'Washer':
      case 'Washing Machine Repair':
        return <Waves className={className} />;
      case 'Dishwasher Repair':
        return <Waves className={className} />;
      case 'Oven':
      case 'Oven Repair':
        return <Sun className={className} />;
      case 'TV':
      case 'TV Repair':
        return <Tv className={className} />;
      case 'Computers':
      case 'Computer Technician':
        return <Laptop className={className} />;
      case 'Phones':
      case 'Mobile Phone Repair':
        return <Smartphone className={className} />;
      // Construction
      case 'Builder':
        return <Hammer className={className} />;
      case 'Mason':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M3 15h18M9 3v6M15 3v6M6 9v6M12 9v6M18 9v6M9 15v6M15 15v6" />
          </svg>
        );
      case 'Roofer':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M2 20h20M12 4l10 10H2Z" />
            <path d="M6 14v4M10 14v4M14 14v4M18 14v4" />
          </svg>
        );
      case 'Tiler':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M12 3v18M3 12h18M3 7.5h18M3 16.5h18M7.5 3v18M16.5 3v18" />
          </svg>
        );
      case 'Drywall':
      case 'Drywall Installer':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="4" y="3" width="16" height="18" rx="1" />
            <path d="M8 3v18M16 3v18M4 9h16M4 15h16" />
            <circle cx="6" cy="6" r="0.5" fill="currentColor" />
            <circle cx="12" cy="12" r="0.5" fill="currentColor" />
            <circle cx="18" cy="18" r="0.5" fill="currentColor" />
          </svg>
        );
      case 'Concrete':
      case 'Concrete Worker':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 3L4 11l8 8 8-8z" />
            <path d="M12 11V19c0 1.5-1 2-2 2" />
          </svg>
        );
      case 'Renovation':
      case 'Renovation Specialist':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22V12" />
            <path d="M17 12H7" />
            <path d="M12 2L2 12h3v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8h3L12 2z" />
          </svg>
        );
      case 'Scaffolding':
      case 'Scaffolder':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 3v18M19 3v18M2 7h20M2 14h20" />
            <path d="M5 7l14 7M19 7L5 14M5 14l14 7M19 14L5 21" />
          </svg>
        );
      // Pools
      case 'Pool Cleaner':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M17 3v10" />
            <path d="M7 3v10" />
            <path d="M7 6h10" />
            <path d="M7 9h10" />
            <path d="M2 17c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
            <path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
          </svg>
        );
      case 'Maintenance':
      case 'Pool Maintenance Technician':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M6 18L16 8" />
            <rect x="15" y="4" width="5" height="5" rx="1" transform="rotate(45 17.5 6.5)" />
            <circle cx="12" cy="7" r="1" fill="currentColor" />
            <path d="M2 17c1.5-1 3.5-1 5 0s3.5 1 5 0s3.5-1 5 0s3.5 1 5 0" />
            <path d="M2 20c1.5-1 3.5-1 5 0s3.5 1 5 0s3.5-1 5 0s3.5 1 5 0" />
          </svg>
        );
      case 'Pool Repair':
      case 'Pool Repair Specialist':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M15 3v6" />
            <path d="M7 3v10" />
            <path d="M7 6h8" />
            <path d="M14.7 11.3l5.8 5.8a1 1 0 0 1 0 1.4l-1.4 1.4a1 1 0 0 1-1.4 0l-5.8-5.8" />
            <path d="M14.7 11.3a3 3 0 1 0-4-4" />
            <path d="M2 18c1.5-1 3.5-1 5 0s3.5 1 5 0s3.5-1 5 0" />
          </svg>
        );
      case 'Water Care':
      case 'Water Treatment':
      case 'Water Treatment Technician':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M11 2h2v4h-2z" />
            <path d="M10 6h4v10a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V6z" />
            <path d="M12 19a1.5 1.5 0 0 0 1.5-1.5c0-.8-1.5-2.5-1.5-2.5s-1.5 1.7-1.5 2.5a1.5 1.5 0 0 0 1.5 1.5z" fill="currentColor" />
            <path d="M2 17c1.5-1 3.5-1 5 0s3.5 1 5 0s3.5-1 5 0s3.5 1 5 0" />
            <path d="M2 20c1.5-1 3.5-1 5 0s3.5 1 5 0s3.5-1 5 0s3.5 1 5 0" />
          </svg>
        );
      case 'Equipment':
      case 'Pool Equipment Installer':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="4" y="6" width="10" height="12" rx="2" />
            <rect x="14" y="8" width="6" height="8" rx="1" />
            <circle cx="9" cy="12" r="2" />
            <path d="M9 12l1.5-1.5" />
            <path d="M11 6V3" strokeWidth="2" />
            <path d="M17 16v3" strokeWidth="2" />
            <path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
          </svg>
        );
      // Hospitality
      case 'Waiter':
      case 'Waitress':
        return <Utensils className={className} />;
      case 'Bartender':
        return <Wine className={className} />;
      case 'Barista':
        return <Coffee className={className} />;
      case 'Chef':
      case 'Cook':
        return <ChefHat className={className} />;
      case 'Kitchen Help':
      case 'Kitchen Assistant':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M3 11a9 9 0 0 0 18 0" />
            <path d="M2 11h20" />
            <path d="M12 2v3" />
            <path d="M8 3l1.5 2" />
            <path d="M16 3l-1.5 2" />
          </svg>
        );
      case 'Dishwasher':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8a4 4 0 0 0-4 4" />
            <path d="M17.5 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM20.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
            <path d="M16 16c.5.5 1.5.5 2 0s.5-1.5 0-2" />
          </svg>
        );
      case 'Housekeeper':
      case 'Hotel Housekeeper':
        return <BedDouble className={className} />;
      case 'Receptionist':
        return <ConciergeBell className={className} />;
      // Care
      case 'Babysitter':
      case 'Nanny':
        return <Baby className={className} />;
      case 'Elderly Care':
      case 'Elderly Caregiver':
        return <HeartHandshake className={className} />;
      case 'Home Care':
      case 'Home Care Assistant':
        return <HeartHandshake className={className} />;
      case 'Disability':
      case 'Disability Support Worker':
        return <HeartPulse className={className} />;
      case 'Pet Care':
      case 'Pet Sitter':
        return <Dog className={className} />;
      case 'Dog Walker':
        return <Bone className={className} />;
      // Lessons
      case 'English':
        return (
          <div className={`${className} flex items-center justify-center font-display font-extrabold tracking-tight text-[10px] sm:text-base border-[1.5px] sm:border-2 border-current rounded-lg sm:rounded-xl select-none aspect-square h-auto`}>
            EN
          </div>
        );
      case 'Portuguese':
        return (
          <div className={`${className} flex items-center justify-center font-display font-extrabold tracking-tight text-[10px] sm:text-base border-[1.5px] sm:border-2 border-current rounded-lg sm:rounded-xl select-none aspect-square h-auto`}>
            PT
          </div>
        );
      case 'Spanish':
        return (
          <div className={`${className} flex items-center justify-center font-display font-extrabold tracking-tight text-[10px] sm:text-base border-[1.5px] sm:border-2 border-current rounded-lg sm:rounded-xl select-none aspect-square h-auto`}>
            ES
          </div>
        );
      case 'Music':
      case 'Piano':
      case 'Guitar':
        return <Music className={className} />;
      case 'Math':
        return <Calculator className={className} />;
      case 'IT':
        return <Laptop className={className} />;
      case 'Programming':
        return <Code className={className} />;
      case 'Fitness':
        return <Dumbbell className={className} />;
      case 'Yoga':
        return <Heart className={className} />;
      // Other
      case 'Office Help':
        return <FileText className={className} />;
      case 'Accountant':
        return <Calculator className={className} />;
      case 'Realtor':
        return <Key className={className} />;
      case 'Photo':
        return <Camera className={className} />;
      case 'Video':
        return <Video className={className} />;
      case 'Designer':
        return <Palette className={className} />;
      case 'Marketing':
        return <Megaphone className={className} />;
      case 'Events':
        return <Calendar className={className} />;
      case 'Translator':
        return <Languages className={className} />;
      case 'Lawyer':
        return <Scale className={className} />;
      case 'Legalization':
        return <FileCheck className={className} />;
      case 'Other':
        return <HelpCircle className={className} />;
      default:
        return <ChevronRight className={className} />;
    }
  };
  const processFileList = async (files: File[]) => {
    if (!files || !files.length) return;
    setUploadError(null);
    if (attachments.length + files.length > 10) {
      setUploadError(t('flow.errorMaxFiles', 'You can only upload up to 10 photos or documents per request.'));
      return;
    }
    const oversizedFiles: string[] = [];
    const validFiles = files.filter(file => {
      if (file.size > 15 * 1024 * 1024) {
        oversizedFiles.push(file.name);
        return false;
      }
      return true;
    });

    if (oversizedFiles.length > 0) {
      setUploadError(t('flow.errorOversizedFiles', 'Some files exceed 15MB limit and were skipped: {{names}}', { names: oversizedFiles.join(', ') }));
    }

    if (validFiles.length === 0) return;
    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of validFiles) {
        try {
          const uploadedUrl = await uploadImage(file);
          if (uploadedUrl) {
            uploadedUrls.push(uploadedUrl);
          }
        } catch (uploadErr) {
          console.warn(`File ${file.name} upload warning:`, uploadErr);
        }
      }
      if (uploadedUrls.length > 0) {
        setAttachments((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(t('flow.errorUploadFailed', 'File upload failed. Please try again.'));
    } finally {
      setIsUploading(false);
    }
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    await processFileList(files);
    e.target.value = '';
  };
  const removeAttachment = (indexToRemove: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof formErrors = {};
    if (!customerName.trim()) {
      errors.customerName = t('flow.errorName', 'Please enter your full name.');
    }
    const fullPhoneCheck = `${countryCode} ${localPhone}`;
    const phoneVal = validatePhone(fullPhoneCheck);
    if (!phoneVal.isValid) {
      errors.localPhone = phoneVal.message || t('flow.errorPhone', 'Please enter a valid phone number.');
    }
    if (!specificLocation.trim()) {
      errors.specificLocation = t('flow.errorAddress', 'Please enter and confirm your exact address.');
    }
    if (!description.trim()) {
      errors.description = t('flow.errorDescription', 'Please describe what needs repair, assembly, or cleaning.');
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    const fullPhone = `${countryCode} ${localPhone}`;
    const fullLocation = specificLocation;
    const timingLabel = urgency === 'urgent'
      ? `⚡ ${t('flow.timingUrgent', 'Emergency (ASAP / Within 2 hours)')}`
      : urgency === 'today'
      ? `📅 ${t('flow.urgencyToday', 'Today')} (${preferredTimeSlot})`
      : urgency === 'tomorrow'
      ? `🗓️ ${t('flow.urgencyTomorrow', 'Tomorrow')} (${preferredTimeSlot})`
      : `📆 ${t('flow.urgencyFlexible', 'Flexible')} (${preferredTimeSlot})`;
    const contactLabel = preferredContact === 'whatsapp'
      ? '📱 WhatsApp'
      : preferredContact === 'telegram'
      ? '✈️ Telegram'
      : `📞 ${t('flow.contactPhoneCall', 'Phone Call')}`;
    const finalDescription = `${t('flow.specialtyLabel', 'Specialty')}: ${t('specialties.' + selectedSpecialty, selectedSpecialty)}\n${t('flow.urgencyLabel', 'Urgency & Schedule')}: ${timingLabel}\n${t('flow.contactLabel', 'Preferred Contact')}: ${contactLabel}\n\n${description}`;
    const jobPromise = onSubmitRequest(
      customerName, 
      fullPhone, 
      fullLocation, 
      finalDescription, 
      attachments,
      activeOperatorId || null,
      selectedHub?.id || undefined
    );
    const job = jobPromise instanceof Promise ? await jobPromise : jobPromise;
    setSubmittedJobId(job.id);
  };
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !submittedJobId) return;
    onAddMessage(submittedJobId, 'customer', customerName || 'Customer', typedMessage, activeChatChannel);
    setTypedMessage('');
  };
  const handleChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !submittedJobId) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File exceeds the 10MB limit. Please select a smaller file.');
      return;
    }
    setChatUploading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      onAddMessage(
        submittedJobId,
        'customer',
        customerName || 'Customer',
        `Shared a file: ${file.name}`,
        activeChatChannel,
        uploadedUrl,
        file.name
      );
    } catch (err: any) {
      console.error('Chat upload failed:', err);
      alert(`File upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setChatUploading(false);
    }
  };
  const handleCreateAnother = () => {
    setCustomerName('');
    setLocalPhone('');
    setSpecificLocation('');
    setDescription('');
    setSubmittedJobId(null);
    setSelectedSpecialty(null);
    onSelectCategory(null);
    setFormErrors({});
  };
const SOLID_PALETTE = [
  'bg-[#2B73B6] text-white hover:bg-[#2B73B6]/95 border-0 outline-none',
  'bg-[#5CC3E4] text-white hover:bg-[#5CC3E4]/95 border-0 outline-none',
  'bg-[#E85038] text-white hover:bg-[#E85038]/95 border-0 outline-none',
  'bg-[#F29E1A] text-white hover:bg-[#F29E1A]/95 border-0 outline-none'
];
const getCityIconComponent = (cityName: string, colorClass: string = "text-cyan-400") => {
  const iconClass = `w-6 h-6 sm:w-11 sm:h-11 ${colorClass} stroke-[1.5] group-hover:scale-110 transition-transform duration-300`;
  switch (cityName) {
    // Algarve Cities
    case 'Albufeira': return <Compass className={iconClass} />;
    case 'Lagos': return <Anchor className={iconClass} />;
    case 'Portimão': return <Navigation className={iconClass} />;
    case 'Alvor': return <Sunset className={iconClass} />;
    case 'Tavira': return <Palmtree className={iconClass} />;
    case 'Vilamoura': return <Gem className={iconClass} />;
    case 'Faro': return <Plane className={iconClass} />;
    case 'Silves': return <Castle className={iconClass} />;
    case 'Quarteira': return <Store className={iconClass} />;
    // Lisboa Region Cities & Districts
    case 'Lisboa City': return <Landmark className={iconClass} />;
    case 'Cascais': return <Anchor className={iconClass} />;
    case 'Sintra': return <Castle className={iconClass} />;
    case 'Amadora': return <Home className={iconClass} />;
    case 'Oeiras': return <Globe className={iconClass} />;
    case 'Loures': return <Trees className={iconClass} />;
    case 'Odivelas': return <Sparkles className={iconClass} />;
    case 'Almada': return <Compass className={iconClass} />;
    case 'Barreiro': return <Sailboat className={iconClass} />;
    case 'Seixal': return <Waves className={iconClass} />;
    case 'Moita': return <Activity className={iconClass} />;
    case 'Montijo': return <Navigation className={iconClass} />;
    // 12 Lisboa City Districts
    case 'Baixa-Chiado': return <Heart className={iconClass} />;
    case 'Avenidas Novas': return <Building className={iconClass} />;
    case 'Parque das Nações': return <Globe className={iconClass} />;
    case 'Belém & Restelo': return <Castle className={iconClass} />;
    case 'Benfica & Carnide': return <Activity className={iconClass} />;
    case 'Lumiar & Campo Grande': return <Trees className={iconClass} />;
    case 'Alvalade': return <Sparkles className={iconClass} />;
    case 'Estrela': return <Gem className={iconClass} />;
    case 'Campo de Ourique': return <Store className={iconClass} />;
    case 'Alcântara': return <Anchor className={iconClass} />;
    case 'Arroios': return <Compass className={iconClass} />;
    case 'Santo António': return <Sun className={iconClass} />;
    default: return <MapPin className={iconClass} />;
  }
};
const getRegionMetadata = (regionId: string, name: string) => {
  switch (regionId) {
    case '1': // Big Lisboa
      return {
        icon: Globe,
        color: 'from-amber-500/10 to-amber-500/0 hover:from-amber-500/20',
        border: 'border-amber-500/20 hover:border-amber-400/80 group-hover:border-amber-400/80',
        text: 'text-amber-400',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
        bgGlow: 'bg-amber-500/10 group-hover:bg-amber-500/20',
        desc: 'Surrounding Metropolitan Municipalities'
      };
    case '13': // Lisboa City
      return {
        icon: Landmark,
        color: 'from-rose-500/10 to-rose-500/0 hover:from-rose-500/20',
        border: 'border-rose-500/20 hover:border-rose-400/80 group-hover:border-rose-400/80',
        text: 'text-rose-400',
        glow: 'shadow-[0_0_15px_rgba(244,63,94,0.05)] hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]',
        bgGlow: 'bg-rose-500/10 group-hover:bg-rose-500/20',
        desc: 'Capital Center & 12 Key Districts'
      };
    case '2': // Algarve
      return {
        icon: Palmtree,
        color: 'from-cyan-500/10 to-cyan-500/0 hover:from-cyan-500/20',
        border: 'border-cyan-500/20 hover:border-cyan-400/80 group-hover:border-cyan-400/80',
        text: 'text-cyan-400',
        glow: 'shadow-[0_0_15px_rgba(34,211,238,0.05)] hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]',
        bgGlow: 'bg-cyan-500/10 group-hover:bg-cyan-500/20',
        desc: 'Sunny Coast & Beaches'
      };
    case '3': // Porto
      return {
        icon: Anchor,
        color: 'from-blue-500/10 to-blue-500/0 hover:from-blue-500/20',
        border: 'border-blue-500/20 hover:border-blue-400/80 group-hover:border-blue-400/80',
        text: 'text-blue-400',
        glow: 'shadow-[0_0_15px_rgba(59,130,246,0.05)] hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]',
        bgGlow: 'bg-blue-500/10 group-hover:bg-blue-500/20',
        desc: 'Riverside & Historic Port'
      };
    case '4': // Braga
      return {
        icon: Church,
        color: 'from-emerald-500/10 to-emerald-500/0 hover:from-emerald-500/20',
        border: 'border-emerald-500/20 hover:border-emerald-400/80 group-hover:border-emerald-400/80',
        text: 'text-emerald-400',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
        bgGlow: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
        desc: 'Ancient Heritage & Spirit'
      };
    case '5': // Setúbal
      return {
        icon: Compass,
        color: 'from-teal-500/10 to-teal-500/0 hover:from-teal-500/20',
        border: 'border-teal-500/20 hover:border-teal-400/80 group-hover:border-teal-400/80',
        text: 'text-teal-400',
        glow: 'shadow-[0_0_15px_rgba(20,184,166,0.05)] hover:shadow-[0_0_25px_rgba(20,184,166,0.25)]',
        bgGlow: 'bg-teal-500/10 group-hover:bg-teal-500/20',
        desc: 'Scenic Bay & Nature Reserves'
      };
    case '6': // Aveiro
      return {
        icon: Sailboat,
        color: 'from-sky-500/10 to-sky-500/0 hover:from-sky-500/20',
        border: 'border-sky-500/20 hover:border-sky-400/80 group-hover:border-sky-400/80',
        text: 'text-sky-400',
        glow: 'shadow-[0_0_15px_rgba(14,165,233,0.05)] hover:shadow-[0_0_25px_rgba(14,165,233,0.25)]',
        bgGlow: 'bg-sky-500/10 group-hover:bg-sky-500/20',
        desc: 'Beautiful Canals & Boats'
      };
    case '7': // Coimbra
      return {
        icon: GraduationCap,
        color: 'from-indigo-500/10 to-indigo-500/0 hover:from-indigo-500/20',
        border: 'border-indigo-500/20 hover:border-indigo-400/80 group-hover:border-indigo-400/80',
        text: 'text-indigo-400',
        glow: 'shadow-[0_0_15px_rgba(99,102,241,0.05)] hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]',
        bgGlow: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
        desc: 'Historic University Hub'
      };
    case '8': // Leiria
      return {
        icon: Castle,
        color: 'from-violet-500/10 to-violet-500/0 hover:from-violet-500/20',
        border: 'border-violet-500/20 hover:border-violet-400/80 group-hover:border-violet-400/80',
        text: 'text-violet-400',
        glow: 'shadow-[0_0_15px_rgba(139,92,246,0.05)] hover:shadow-[0_0_25px_rgba(139,92,246,0.25)]',
        bgGlow: 'bg-violet-500/10 group-hover:bg-violet-500/20',
        desc: 'Castles & Historic Forests'
      };
    case '9': // Alentejo
      return {
        icon: Sun,
        color: 'from-orange-500/10 to-orange-500/0 hover:from-orange-500/20',
        border: 'border-orange-500/20 hover:border-orange-400/80 group-hover:border-orange-400/80',
        text: 'text-orange-400',
        glow: 'shadow-[0_0_15px_rgba(249,115,22,0.05)] hover:shadow-[0_0_25px_rgba(249,115,22,0.25)]',
        bgGlow: 'bg-orange-500/10 group-hover:bg-orange-500/20',
        desc: 'Cork Trees & Sunlit Plains'
      };
    case '10': // Viseu
      return {
        icon: Trees,
        color: 'from-lime-500/10 to-lime-500/0 hover:from-lime-500/20',
        border: 'border-lime-500/20 hover:border-lime-400/80 group-hover:border-lime-400/80',
        text: 'text-lime-400',
        glow: 'shadow-[0_0_15px_rgba(132,204,22,0.05)] hover:shadow-[0_0_25px_rgba(132,204,22,0.25)]',
        bgGlow: 'bg-lime-500/10 group-hover:bg-lime-500/20',
        desc: 'Green Gardens & Vineyards'
      };
    case '11': // Madeira
      return {
        icon: Flower,
        color: 'from-pink-500/10 to-pink-500/0 hover:from-pink-500/20',
        border: 'border-pink-500/20 hover:border-pink-400/80 group-hover:border-pink-400/80',
        text: 'text-pink-400',
        glow: 'shadow-[0_0_15px_rgba(236,72,153,0.05)] hover:shadow-[0_0_25px_rgba(236,72,153,0.25)]',
        bgGlow: 'bg-pink-500/10 group-hover:bg-pink-500/20',
        desc: 'Island of Eternal Spring'
      };
    case '12': // Açores
      return {
        icon: Mountain,
        color: 'from-purple-500/10 to-purple-500/0 hover:from-purple-500/20',
        border: 'border-purple-500/20 hover:border-purple-400/80 group-hover:border-purple-400/80',
        text: 'text-purple-400',
        glow: 'shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]',
        bgGlow: 'bg-purple-500/10 group-hover:bg-purple-500/20',
        desc: 'Atlantic Volcanic Jewels'
      };
    default:
      return {
        icon: MapPin,
        color: 'from-blue-500/10 to-blue-500/0 hover:from-blue-500/20',
        border: 'border-blue-500/20 hover:border-blue-400/80 group-hover:border-blue-400/80',
        text: 'text-blue-400',
        glow: 'shadow-[0_0_15px_rgba(59,130,246,0.05)] hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]',
        bgGlow: 'bg-blue-500/10 group-hover:bg-blue-500/20',
        desc: 'Trusted Region Services'
      };
  }
};
  // Shared outer layout helper
  const renderBrowserFrame = (content: React.ReactNode) => {
    return (
      <section className="w-full" id="customer-seo-container">
        <Helmet>
          {selectedCategory ? (
            <>
              <title>{selectedCategory} Services in Algarve & Portimão | NordBase.pt</title>
              <meta name="description" content={`Local ${selectedCategory} coordination and services in Algarve, Portugal. Connect with verified specialists in Portimão.`} />
              <script type="application/ld+json">{JSON.stringify(getCategoryServiceSchema(selectedCategory))}</script>
              <script type="application/ld+json">{JSON.stringify(getBreadcrumbSchema([
                { name: 'Home', url: 'https://nordbase.pt/' },
                { name: selectedCategory, url: `https://nordbase.pt/services/${selectedCategory}` }
              ]))}</script>
            </>
          ) : (
            <>
              <title>NordBase.pt — Serviços Locais e Coordenação no Algarve, Portugal</title>
              <meta name="description" content="Descreva o seu problema e a NordBase coordena o resto. Conexão direta com especialistas verificados em Portimão e no Algarve." />
            </>
          )}
        </Helmet>
        {content}
      </section>
    );
  };
  // --- MARKETPLACE INTERCEPT ---
  const isMarketplaceCategory = selectedCategory && selectedSpecialty && ['Care', 'Lessons', 'Business'].includes(selectedCategory);
  if (isMarketplaceCategory) {
    return (
      <div className="w-full min-h-screen bg-[#030712] font-sans">
        <MarketplaceView 
          category={selectedCategory} 
          specialty={selectedSpecialty} 
          onGoBack={() => setSelectedSpecialty(null)} 
          currentUser={currentUser || null}
          onRequestLogin={onRequestLogin}
          onSubmitDirectRequest={(specialistId, text) => {
            // For now just submit a job request with a special description or we can just call onSubmitRequest
            // We can prefix the description
            onSubmitRequest(
              customerName || currentUser?.name || 'Customer', 
              localPhone || currentUser?.phone || '000000000', 
              selectedDistrict || 'Any', 
              `[DIRECT BOOKING to ${specialistId}]: ${text}`
            );
          }}
        />
      </div>
    );
  }
  // --- STEP 1 & 2: HOMEPAGE (CATEGORY / SPECIALTY GRID) ---
  if (!selectedCategory || !selectedSpecialty) {
    return renderBrowserFrame(
      <div className="w-full min-h-screen animate-in fade-in duration-500 pb-12 pt-1 sm:pt-12" id="homepage-view">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="flex flex-col items-center space-y-1.5 sm:space-y-3 mb-6 sm:mb-10 text-center" id="hero-section">
            {currentUser && onOpenDashboard && (
              <div className="mb-2 bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/30 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
                <span className="text-xs text-cyan-200">
                  {t('customerFlow.signedInAs')} <strong className="text-white font-bold">{currentUser.name}</strong>
                </span>
                <button
                  onClick={onOpenDashboard}
                  className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  {t('customerFlow.myDashboard')}
                </button>
              </div>
            )}
            {/* Main Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-display max-w-3xl mt-0.5 sm:mt-1">
              {t('customerFlow.heroTitle')}
            </h1>
            {/* Subtitle */}
            <p className="hidden sm:block text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed mt-1 sm:mt-2 px-2 sm:px-4 min-h-[32px] sm:min-h-[56px]">
              {!selectedCategory ? t('customerFlow.heroSubtitle1') : t('customerFlow.heroSubtitle2', { category: selectedCategory })}
            </p>
            {/* Grid Selection Step Indicator */}
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-cyan-500/10 text-cyan-400 text-[10px] sm:text-xs font-black tracking-wider rounded-full uppercase border border-cyan-500/20 mt-2 sm:mt-4">
              {!selectedCategory ? t('customerFlow.step1') : t('customerFlow.step2')}
            </span>
            <button 
              onClick={() => {
                onSelectCategory(null);
                setSelectedSpecialty(null);
              }} 
              disabled={!selectedCategory}
              className={`mt-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-cyan-400 hover:text-cyan-300 flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 hover:border-cyan-400/50 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-95 cursor-pointer ${
                !selectedCategory ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4"/> {t('customerFlow.backBtn')}
            </button>
          </div>
          <div className="grid gap-x-3 gap-y-5 grid-cols-3 sm:grid-cols-3 md:grid-cols-4 mt-6">
            {!selectedCategory && CATEGORIES.map(cat => {
              const activeRegionMeta = {
                border: 'border-blue-900/30 hover:border-cyan-400/50',
                glow: 'shadow-[0_0_15px_rgba(6,182,212,0.02)] hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]',
                color: 'from-blue-950/10 to-blue-950/0 hover:from-blue-950/20',
                bgGlow: 'bg-blue-950/60 group-hover:bg-cyan-500/10',
                text: 'text-cyan-400'
              };
              return (
                <button 
                  key={cat.id} 
                  onClick={() => { onSelectCategory(cat.id as ServiceCategory); }} 
                  className="group flex flex-col items-center w-full focus:outline-none cursor-pointer text-center"
                >
                  <div className={`relative aspect-square w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 sm:w-24 sm:h-24 bg-slate-900/60 border ${activeRegionMeta.border} ${activeRegionMeta.glow} rounded-2xl sm:rounded-[2rem] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center overflow-hidden bg-gradient-to-b ${activeRegionMeta.color}`}>
                    <div className="absolute inset-0 bg-slate-950/20 opacity-30 group-hover:opacity-10 transition-opacity" />
                    <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-current opacity-[0.03] rounded-full blur-lg group-hover:opacity-[0.07] transition-opacity pointer-events-none" />
                    
                    <div className={`p-2.5 sm:p-5 rounded-full ${activeRegionMeta.bgGlow} border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all duration-300`}>
                      {getCategoryIcon(cat.iconName, `w-6 h-6 sm:w-11 sm:h-11 ${activeRegionMeta.text} stroke-[1.5]`)}
                    </div>
                  </div>
                  <span className="mt-2 block w-full h-8 sm:h-10 text-[10px] min-[375px]:text-xs sm:text-sm font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors tracking-tight leading-tight uppercase font-display max-w-full break-words px-1 line-clamp-2 overflow-hidden">
                    {t(`categories.${cat.id}`, cat.id)}
                  </span>
                </button>
              );
            })}
            {selectedCategory && (() => {
              const activeRegionMeta = {
                border: 'border-blue-900/30 hover:border-cyan-400/50',
                glow: 'shadow-[0_0_15px_rgba(6,182,212,0.02)] hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]',
                color: 'from-blue-950/10 to-blue-950/0 hover:from-blue-950/20',
                bgGlow: 'bg-blue-950/60 group-hover:bg-cyan-500/10',
                text: 'text-cyan-400'
              };
              
              const specialties = CATEGORY_DETAILS[selectedCategory]?.examples.split(', ') || [];
              
              return specialties.map(specialty => (
                <button 
                  key={specialty} 
                  onClick={() => { 
                    setSelectedSpecialty(specialty); 
                  }} 
                  className="group flex flex-col items-center w-full focus:outline-none cursor-pointer text-center"
                >
                  <div className={`relative aspect-square w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 sm:w-24 sm:h-24 bg-slate-900/60 border ${activeRegionMeta.border} ${activeRegionMeta.glow} rounded-2xl sm:rounded-[2rem] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center overflow-hidden bg-gradient-to-b ${activeRegionMeta.color}`}>
                    <div className="absolute inset-0 bg-slate-950/20 opacity-30 group-hover:opacity-10 transition-opacity" />
                    <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-current opacity-[0.03] rounded-full blur-lg group-hover:opacity-[0.07] transition-opacity pointer-events-none" />
                    
                    <div className={`p-2.5 sm:p-5 rounded-full ${activeRegionMeta.bgGlow} border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all duration-300`}>
                      {getSpecialtyIcon(specialty, `w-6 h-6 sm:w-11 sm:h-11 ${activeRegionMeta.text} stroke-[1.5]`)}
                    </div>
                  </div>
                  <span className="mt-2 block w-full h-8 sm:h-10 text-[10px] min-[375px]:text-xs sm:text-sm font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors tracking-tight leading-tight uppercase font-display max-w-full break-words px-1 line-clamp-2 overflow-hidden">
                    {t(`specialties.${specialty}`, specialty)}
                  </span>
                </button>
              ));
            })()}
          </div>

          {/* Job Cost Estimator for Homepage */}
          <JobCostEstimator
            onDescribeProblem={() => {
              if (!selectedCategory) {
                onSelectCategory('Home Services');
              }
              const el = document.getElementById('categories-section') || document.getElementById('hero-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onRequestTeam={() => {
              if (!selectedCategory) {
                onSelectCategory('Home Services');
              }
              const el = document.getElementById('categories-section') || document.getElementById('hero-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />

          {/* How It Works Section */}
          <div className="mt-12 sm:mt-20 border-t border-blue-950/40 pt-10 sm:pt-16 max-w-4xl mx-auto" id="how-it-works-section">
            <h2 className="text-xl sm:text-2xl font-black text-center text-white tracking-tight font-display">
              {t('flow.inline_HowNordBaseWork_1', 'How NordBase Works')}
            </h2>
            <p className="text-sm text-slate-400 text-center mt-2 max-w-xl mx-auto">
              {t('flow.howItWorksSub', 'Fast connection with certified service specialists in Portugal. Choose your preferred way to request:')}
            </p>
            {/* 4 Steps Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 sm:mt-12">
              <div className="bg-blue-950/20 border border-blue-900/20 p-5 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4 border border-cyan-500/20">
                  1
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {t('flow.inline_1ChooseCityServ_2', '1. Choose City & Service')}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {t('flow.step1Desc', 'Select your required service category and location in Portugal.')}
                </p>
              </div>
              <div className="bg-blue-950/20 border border-cyan-500/30 p-5 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group hover:border-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-lg mb-4 border border-cyan-400/40">
                  2
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {t('flow.inline_2OnSiteorWithou_3', '2. On Site or Without Reg')}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {t('flow.step2Desc', 'Create request on site with quick registration, OR without registration contact Operator via Phone / WhatsApp.')}
                </p>
              </div>
              <div className="bg-blue-950/20 border border-blue-900/20 p-5 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4 border border-cyan-500/20">
                  3
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {t('flow.inline_3DispatchExecut_4', '3. Dispatch & Execution')}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {t('flow.step3Desc2', 'Verified territory partner dispatches specialist. Payment only after job completion.')}
                </p>
              </div>
              <div className="bg-emerald-950/20 border border-emerald-500/40 p-5 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group hover:border-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg mb-4 border border-emerald-400/40">
                  4
                </div>
                <h3 className="text-sm font-bold text-emerald-300 tracking-tight">
                  {t('flow.inline_4OrderCompletio_5', '4. Order Completion')}
                </h3>
                <p className="text-xs text-emerald-200/90 mt-2 leading-relaxed font-medium">
                  {t('flow.step4Quote', '«Work completed & accepted, payment made in full, no claims.»')}
                </p>
              </div>
            </div>
            {/* Detailed Registration Options Callout Box */}
            <div className="mt-8 p-6 bg-gradient-to-r from-slate-950 via-blue-950/60 to-slate-950 border border-cyan-500/30 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-900/40 pb-2">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  {t('flow.creationOptions', '2 Convenient Ways to Create an Order')}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Option 1: On site with registration */}
                <div className="p-4 bg-slate-900/90 border border-blue-900/40 rounded-xl space-y-2 hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                    <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      {t('flow.option1Title', '1. On website (with quick registration)')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t('flow.option1Desc', 'When creating a request via the website form, quick registration is required to access your customer dashboard, live order tracking, chat with the specialist, and order history.')}
                  </p>
                  <div className="pt-1 text-[11px] text-cyan-400 font-medium">
                    ✓ {t('flow.inline_Livetrackinginp_6', 'Live tracking in personal dashboard')}
                  </div>
                </div>
                {/* Option 2: Direct via Phone/WhatsApp without registration */}
                <div className="p-4 bg-slate-900/90 border border-emerald-500/30 rounded-xl space-y-2 hover:border-emerald-400 transition-all">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {t('flow.option2Title', '2. Without registration (direct to Operator)')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t('flow.option2Desc', 'If you prefer not to register, you can contact the Operator (Territorial Partner) directly by Phone or WhatsApp without registration. The Operator will process your request for you.')}
                  </p>
                  <div className="pt-1 text-[11px] text-emerald-400 font-medium flex items-center gap-3">
                    <span>📞 {t('flow.contactPhoneCall', 'Phone Call')}</span>
                    <span>•</span>
                    <span>💬 WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Testimonials / Reviews Section */}
          <div className="mt-12 sm:mt-20 border-t border-blue-950/40 pt-10 sm:pt-16 max-w-3xl mx-auto" id="testimonials-section">
            <h2 className="text-xl sm:text-2xl font-black text-center text-white tracking-tight font-display">
              Verified Reviews from Local Residents
            </h2>
            <p className="text-sm text-slate-400 text-center mt-2 max-w-lg mx-auto">
              Real feedback from customers and professionals across the Algarve region.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 sm:mt-12">
              {/* Woman - Plumber */}
              <div className="bg-blue-950/10 border border-blue-900/10 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 mb-3.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                    "A pipe burst in my kitchen on a Saturday morning. The plumber arrived in 30 minutes, clean, quick, and very professional. Outstanding service!"
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-blue-950/40 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold text-xs">
                    MS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Maria Silva</h4>
                    <span className="text-[10px] text-slate-500 block">Lagos • Plumber Call</span>
                  </div>
                </div>
              </div>
              {/* Man - Cleaning */}
              <div className="bg-blue-950/10 border border-blue-900/10 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 mb-3.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                    "Booked a deep clean for my apartment. Outstanding attention to detail, very quick turnaround, and no prepayments needed!"
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-blue-950/40 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                    JS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">João Santos</h4>
                    <span className="text-[10px] text-slate-500 block">Albufeira • Cleaning Call</span>
                  </div>
                </div>
              </div>
              {/* Hotelier - Barista */}
              <div className="bg-blue-950/10 border border-blue-900/10 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 mb-3.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                    "We needed a last-minute barista for our boutique hotel event. The coordinator found us an amazing certified professional within an hour. Saved our weekend event!"
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-blue-950/40 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    MC
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Miguel Costa</h4>
                    <span className="text-[10px] text-slate-500 block">Faro • Boutique Hotelier</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <footer className="mt-16 sm:mt-24 border-t border-blue-950/40 pt-8 pb-4 text-center max-w-3xl mx-auto" id="customer-flow-footer">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>© 2026 NordBase.pt. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <span className="hover:text-slate-400 transition-colors cursor-pointer">{t('flow.footerSMM', 'SMM & Contacts coming soon')}</span>
                <span>•</span>
                <span className="hover:text-slate-400 transition-colors cursor-pointer">{t('flow.footerSupport', 'Support')}</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
  // --- STEP 3: THE DISPATCH REQUEST FORM / REQUEST DETAILS ---
  if (!submittedJobId || !currentJob) {
    return renderBrowserFrame(
      <div className="w-full max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-6" id="request-form-step">
        <div className="mb-4 sm:mb-6">
          <button
            id="back-to-categories-btn"
            onClick={() => {
              setSelectedSpecialty(null);
            }}
            className="text-xs font-semibold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 hover:border-cyan-400/50 rounded-full transition-all duration-200 active:scale-95 cursor-pointer inline-flex w-max"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('flow.back')}</span>
          </button>
        </div>
        <div className="bg-[#0A1128]/95 backdrop-blur-md p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-blue-900/30 shadow-2xl">
          <div className="mb-8 pb-6 border-b border-blue-900/30">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium rounded-full mb-3 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              {selectedCategory ? t('categories.' + selectedCategory, selectedCategory) : ''} • {selectedSpecialty ? t('specialties.' + selectedSpecialty, selectedSpecialty) : ''}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug mb-2 font-display">
              {t('flow.requestTitle', { specialty: selectedSpecialty ? t('specialties.' + selectedSpecialty, selectedSpecialty) : '' })}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {selectedCategory && CATEGORY_DETAILS[selectedCategory] && CATEGORY_DETAILS[selectedCategory].desc ? CATEGORY_DETAILS[selectedCategory].desc : t('flow.categoryDescFallback', 'Fast, secure dispatch. No pre-payments required.')}
            </p>
          </div>
          <form onSubmit={handleFormSubmit} noValidate className="space-y-6" id="customer-dispatch-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Column 1: Contact & Address */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[10px]">1</span>
                  <span>{t('flow.contactLocationSection', 'Contact & Location')}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {t('flow.fullName', 'Full Name')}
                  </label>
                  <input
                    id="customer-name-input"
                    type="text"
                    placeholder={t('flow.fullNamePlaceholder', 'e.g. Robert Vance')}
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (formErrors.customerName) {
                        setFormErrors(prev => ({ ...prev, customerName: undefined }));
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-950/80 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none text-xs sm:text-sm font-normal transition-all placeholder-slate-500 ${
                      formErrors.customerName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : 'border-blue-900/40'
                    }`}
                  />
                  {formErrors.customerName && (
                    <p className="mt-1 text-xs font-medium text-rose-400 animate-in fade-in duration-200 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{formErrors.customerName}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {t('flow.phoneNumber', 'Phone Number (For verification call)')}
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="customer-country-code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-[110px] px-2.5 py-2.5 rounded-xl border border-blue-900/40 bg-slate-950/80 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none text-xs sm:text-sm font-normal transition-all cursor-pointer"
                    >
                      <option value="+351">🇵🇹 (+351)</option>
                      <option value="+44">🇬🇧 (+44)</option>
                      <option value="+49">🇩🇪 (+49)</option>
                      <option value="+33">🇫🇷 (+33)</option>
                      <option value="+34">🇪🇸 (+34)</option>
                      <option value="+1">🇺🇸 (+1)</option>
                    </select>
                    <input
                      id="customer-phone-input"
                      type="tel"
                      placeholder={t('flow.phonePlaceholder', 'e.g. 912 345 678')}
                      value={localPhone}
                      onChange={(e) => {
                        setLocalPhone(e.target.value);
                        if (formErrors.localPhone) {
                          setFormErrors(prev => ({ ...prev, localPhone: undefined }));
                        }
                      }}
                      className={`flex-1 px-3.5 py-2.5 rounded-xl border bg-slate-950/80 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none text-xs sm:text-sm font-normal transition-all placeholder-slate-500 ${
                        formErrors.localPhone ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : 'border-blue-900/40'
                      }`}
                    />
                  </div>
                  {formErrors.localPhone && (
                    <p className="mt-1 text-xs font-medium text-rose-400 animate-in fade-in duration-200 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{formErrors.localPhone}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {t('flow.preferredContact', 'Preferred Contact Method')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreferredContact('whatsapp')}
                      className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        preferredContact === 'whatsapp'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-950/80 border-blue-900/40 text-slate-400 hover:text-white hover:border-blue-800'
                      }`}
                    >
                      <span>📱</span>
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredContact('phone')}
                      className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        preferredContact === 'phone'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-950/80 border-blue-900/40 text-slate-400 hover:text-white hover:border-blue-800'
                      }`}
                    >
                      <span>📞</span>
                      <span>{t('flow.contactCall', 'Call')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredContact('telegram')}
                      className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        preferredContact === 'telegram'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                          : 'bg-slate-950/80 border-blue-900/40 text-slate-400 hover:text-white hover:border-blue-800'
                      }`}
                    >
                      <span>✈️</span>
                      <span>Telegram</span>
                    </button>
                  </div>
                </div>
                <div className="relative z-40">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {t('flow.exactAddress', 'Exact Address')}
                  </label>
                  <AddressAutocomplete
                    value={specificLocation}
                    userLocation={userLocation}
                    onChange={(val) => {
                      setSpecificLocation(val);
                      if (formErrors.specificLocation) {
                        setFormErrors(prev => ({ ...prev, specificLocation: undefined }));
                      }
                    }}
                    placeholder={t('flow.addressPlaceholder', 'e.g. Alvor Marina, Block B Apt 412')}
                    multiline={true}
                    rows={2}
                  />
                  {formErrors.specificLocation && (
                    <p className="mt-1 text-xs font-medium text-rose-400 animate-in fade-in duration-200 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{formErrors.specificLocation}</span>
                    </p>
                  )}
                </div>
              </div>
              {/* Column 2: Details & Attachments */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[10px]">2</span>
                  <span>{t('flow.detailsMediaSection', 'Details & Media')}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {t('flow.urgencyHeading', 'Urgency & Preferred Schedule')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setUrgency('urgent')}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        urgency === 'urgent'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-950/80 border-blue-900/40 text-slate-400 hover:text-white hover:border-blue-800'
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center gap-1">⚡ {t("flow.urgencyUrgent", "Urgent")}</span>
                      <span className="text-[10px] opacity-75 mt-0.5">{t("flow.urgencyUrgentSub", "Within 2h")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('today')}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        urgency === 'today'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-950/80 border-blue-900/40 text-slate-400 hover:text-white hover:border-blue-800'
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center gap-1">📅 {t("flow.urgencyToday", "Today")}</span>
                      <span className="text-[10px] opacity-75 mt-0.5">{t("flow.urgencyTodaySub", "Later today")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('tomorrow')}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        urgency === 'tomorrow'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                          : 'bg-slate-950/80 border-blue-900/40 text-slate-400 hover:text-white hover:border-blue-800'
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center gap-1">🗓️ {t("flow.urgencyTomorrow", "Tomorrow")}</span>
                      <span className="text-[10px] opacity-75 mt-0.5">{t("flow.urgencyTomorrowSub", "Next day")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('flexible')}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        urgency === 'flexible'
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                          : 'bg-slate-950/80 border-blue-900/40 text-slate-400 hover:text-white hover:border-blue-800'
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center gap-1">📆 {t("flow.urgencyFlexible", "Flexible")}</span>
                      <span className="text-[10px] opacity-75 mt-0.5">{t("flow.urgencyFlexibleSub", "Any day")}</span>
                    </button>
                  </div>
                  {urgency !== 'urgent' && (
                    <div className="flex items-center gap-2 mt-2 animate-in fade-in duration-200">
                      <span className="text-xs text-slate-400 shrink-0">{t('flow.preferredTimeSlot', 'Time slot:')}</span>
                      <select
                        value={preferredTimeSlot}
                        onChange={(e) => setPreferredTimeSlot(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-blue-900/40 bg-slate-950/80 text-white text-xs focus:border-cyan-400 focus:outline-none cursor-pointer"
                      >
                        <option value="anytime">{t("flow.slotAnytime", "Anytime during the day")}</option>
                        <option value="morning">{t("flow.slotMorning", "Morning (09:00 - 12:00)")}</option>
                        <option value="afternoon">{t("flow.slotAfternoon", "Afternoon (12:00 - 17:00)")}</option>
                        <option value="evening">{t("flow.slotEvening", "Evening (17:00 - 20:00)")}</option>
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {t('flow.requestDetails', 'Request Details')}
                  </label>
                  <textarea
                    id="customer-description-input"
                    rows={4}
                    placeholder={t('flow.detailsPlaceholder', 'Describe what needs repair, assembly, or cleaning.')}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (formErrors.description) {
                        setFormErrors(prev => ({ ...prev, description: undefined }));
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-950/80 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none text-xs sm:text-sm font-normal transition-all placeholder-slate-500 resize-none min-h-[105px] leading-relaxed ${
                      formErrors.description ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : 'border-blue-900/40'
                    }`}
                  ></textarea>
                  {formErrors.description && (
                    <p className="mt-1 text-xs font-medium text-rose-400 animate-in fade-in duration-200 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{formErrors.description}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {t('flow.attachments', 'Attachments / Photos & Documents (Optional)')}
                  </label>
                  <div className="flex flex-col gap-2">
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          processFileList(Array.from(e.dataTransfer.files));
                        }
                      }}
                      className={`relative flex flex-col items-center justify-center p-4 border border-dashed ${isDragOver ? 'border-cyan-400 bg-cyan-950/30' : 'border-blue-900/40 hover:border-cyan-400/50 bg-slate-950/60 hover:bg-slate-950/80'} rounded-xl cursor-pointer transition-all`}
                    >
                      <input
                        type="file"
                        id="order-file-input"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            processFileList(Array.from(e.target.files));
                            e.target.value = '';
                          }
                        }}
                        disabled={isUploading}
                        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
                      />
                      <Upload className={`w-5 h-5 mb-1 text-cyan-400 ${isUploading ? 'animate-bounce' : ''}`} />
                      <span className="text-xs font-semibold text-slate-200 text-center">
                        {isUploading ? t('flow.uploading', 'Processing files...') : t('flow.dragDrop', 'Drag & drop photos or click to browse')}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        {t('flow.uploadSubtext', 'Photos, damage reports, receipts (up to 10 files, max 15MB each)')}
                      </span>
                    </div>
                    {uploadError && (
                      <div className="p-2.5 bg-rose-950/80 border border-rose-500/50 rounded-xl flex items-center justify-between gap-2 text-xs font-medium text-rose-300 animate-in fade-in duration-200">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="shrink-0">⚠️</span>
                          <span className="truncate">{uploadError}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadError(null)}
                          className="p-1 hover:bg-rose-500/20 text-rose-400 rounded shrink-0 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {attachments.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                        {attachments.map((url, idx) => (
                          <div key={idx} className="relative group flex items-center gap-2 p-2 bg-slate-950 border border-blue-900/40 rounded-lg shadow-sm">
                            {url.startsWith('data:image') || url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('blob') || url.includes('unsplash') ? (
                              <img src={url} alt="preview" className="w-7 h-7 rounded object-cover bg-slate-900 shrink-0" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-7 h-7 bg-cyan-950/60 rounded flex items-center justify-center shrink-0 border border-cyan-500/20">
                                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                              </div>
                            )}
                            <span className="text-[11px] text-slate-200 truncate flex-1 font-medium">
                              {t('flow.fileNum', 'File #{{num}}', { num: idx + 1 })}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeAttachment(idx)}
                              className="p-1 hover:bg-rose-500/20 hover:text-rose-400 text-slate-500 rounded transition-colors cursor-pointer"
                              title={t('flow.removeFile', 'Remove file')}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom Submit Actions */}
            <div className="pt-4 border-t border-blue-900/30 flex flex-col items-center gap-3">
              <button
                id="submit-dispatch-request-btn"
                type="submit"
                className="w-full sm:w-auto min-w-[280px] sm:min-w-[340px] py-3.5 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl font-bold text-sm sm:text-base transition-all shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_24px_rgba(37,99,235,0.5)] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t('flow.submitRequest')}</span>
              </button>
              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">✓ {t('flow.noPrepayments', 'No pre-payments required')}</span>
                <span>•</span>
                <span className="flex items-center gap-1">✓ {t('flow.directDispatch', 'Direct specialist dispatch')}</span>
              </div>
              {/* Quick Contact & TP Section */}
              <div className="mt-4 pt-4 border-t border-blue-900/30 w-full max-w-xl mx-auto space-y-3">
                {selectedHub && (
                  (() => {
                    const opPhoto = activeOperator?.photoUrl || activeOperator?.avatar || '/portimao_tp.jpg';
                    let opName = activeOperator?.name || `Local Operator (${activeCity})`;
                    if (opName.includes('National Partner') || opName.includes('Territorial Partner') || opName.includes('TP Operator')) {
                      opName = opName.replace('National Partner', 'Local Operator').replace('Territorial Partner', 'Local Operator').replace('TP Operator', 'Local Operator');
                    }
                    return (
                      <div className="p-3 bg-gradient-to-r from-blue-950/50 to-cyan-950/30 border border-blue-900/40 rounded-xl flex items-center gap-3 shadow-md">
                        <img 
                          src={opPhoto} 
                          alt={opName || "Local Operator Portugal"} 
                          className="w-10 h-10 rounded-full border border-cyan-500/40 bg-slate-900 shrink-0 shadow object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            if (!e.currentTarget.src.includes('portimao_tp.jpg')) { e.currentTarget.src = '/portimao_tp.jpg'; }
                          }}
                        />
                        <div className="text-left min-w-0 flex-1">
                          <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Nearest Active Hub</p>
                          <p className="text-xs sm:text-sm font-bold text-white leading-tight truncate">{selectedHub.name}</p>
                          <p className="text-[11px] text-slate-300 truncate">Operator: {opName}</p>
                        </div>
                      </div>
                    );
                  })()
                )}
                {/* 2-line clean divider header */}
                <div className="relative flex py-1.5 items-center justify-center my-1.5 w-full">
                  <div className="flex-grow border-t border-blue-900/40"></div>
                  <span className="flex-shrink-0 px-3 text-cyan-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center leading-tight whitespace-pre-line">
                    {t('flow.quickTpContacts')}
                  </span>
                  <div className="flex-grow border-t border-blue-900/40"></div>
                </div>
                {/* WhatsApp & Call Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={`https://wa.me/${(activeOperator ? activeOperator.phone : '+351 912 345 678').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello! I need a specialist for ${selectedSpecialty || 'service'}${specificLocation ? ` at address: ${specificLocation}` : ''}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] border border-[#25D366]/30 text-white rounded-xl transition-all cursor-pointer shadow-md font-bold text-xs sm:text-sm active:scale-95"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span>{t('flow.whatsappPartner')}</span>
                  </a>
                  <a
                    href={`tel:${(activeOperator ? activeOperator.phone : '+351 912 345 678').replace(/[^0-9]/g, '')}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl transition-all cursor-pointer shadow-md font-bold text-xs sm:text-sm active:scale-95"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{t('flow.callPartner')}</span>
                  </a>
                </div>
                {/* Google Sign In Button */}
                {!currentUser && (
                  <div className="flex justify-center pt-1 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        store.setRole('customer');
                        onOpenDashboard?.();
                      }}
                      className="w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl transition-all cursor-pointer shadow-md font-bold text-xs sm:text-sm active:scale-95 border border-slate-200"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      <span>{t('flow.googleSignIn')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
  // --- STEP 4: ACTIVE TRACKING & CHAT ---
  return renderBrowserFrame(
    <div className="max-w-6xl mx-auto py-12 px-4" id="active-dispatch-tracker">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Status Progress */}
        <div className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-left-3 duration-300">
          <div className="bg-[#0F0F0F] p-8 rounded-3xl border border-white/5">
            <div className="text-center pb-6 border-b border-white/5">
              <span className="inline-block px-3 py-1 bg-white/5 text-[10px] font-mono text-slate-400 uppercase tracking-widest rounded-full border border-white/10">
                REF # {currentJob.id.toUpperCase().slice(0, 8)}
              </span>
              <h3 className="text-2xl font-black text-white mt-4 tracking-tight font-display">
                {currentJob.category}
              </h3>
              <p className="text-sm text-slate-400 mt-2">{currentJob.city} • {currentJob.specificLocation}</p>
            </div>
            {/* Assigned Territory Partner Card */}
            {(() => {
              const assignedHub = currentJob?.hubId ? allHubs.find(h => h.id === currentJob.hubId) : null;
              const op = currentJob?.operatorId ? allUsers.find(u => u.id === currentJob.operatorId && !isMockAccount(u)) : null;
              
              // Only find real non-mock operator from hub seat
              const seatOpId = assignedHub?.seats?.find(s => s.status === 'active' && s.operatorId)?.operatorId;
              const seatOp = seatOpId ? allUsers.find(u => u.id === seatOpId && !isMockAccount(u)) : null;

              const displayOp = op || seatOp;

              if (!displayOp) {
                return (
                  <div className="mt-6 p-4 bg-slate-950/80 border border-amber-500/30 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-12 h-12 rounded-full border border-amber-500/40 bg-slate-900/90 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">Ожидание принятия заказа</p>
                      <p className="text-xs font-medium text-slate-200 leading-snug">Заказ ожидает обработки зарегистрированным Местным Оператором (TP)</p>
                      <p className="text-xxs text-slate-400 mt-0.5 truncate">Регион: {assignedHub?.city || currentJob?.city || 'Portimão'}</p>
                    </div>
                  </div>
                );
              }

              const opPhoto = displayOp.photoUrl || displayOp.avatar || '/portimao_tp.jpg';
              let opName = displayOp.name;
              if (opName.includes('National Partner') || opName.includes('Territorial Partner') || opName.includes('TP Operator')) {
                opName = opName.replace('National Partner', 'Local Operator').replace('Territorial Partner', 'Local Operator').replace('TP Operator', 'Local Operator');
              }
              return (
                <div className="mt-6 p-4 bg-[#0A1128]/80 border border-blue-900/30 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="relative shrink-0">
                    <img
                      src={opPhoto}
                      alt={opName || "Local Operator NordBase"}
                      className="w-12 h-12 rounded-full border-2 border-cyan-500/30 bg-slate-900 object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (!e.currentTarget.src.includes('portimao_tp.jpg')) { e.currentTarget.src = '/portimao_tp.jpg'; }
                      }}
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-950 bg-emerald-500" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">{assignedHub ? assignedHub.name : 'Местный Оператор назначен'}</p>
                    <p className="text-sm font-black text-white leading-snug truncate">Оператор: {opName}</p>
                    <p className="text-xxs text-slate-400 truncate">{t('flow.regionLabel', 'Region')}: {assignedHub?.city || currentJob?.city || 'Portimão'}</p>
                  </div>
                </div>
              );
            })()}
            {/* Steps Visual Progress */}
            <div className="py-8 space-y-8" id="customer-tracker-steps">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <div className="w-[1px] h-10 bg-white/20 mt-2"></div>
                </div>
                <div>
                  <span className="text-sm font-medium text-white block">{t('flow.statusSubmitted')}</span>
                  <span className="text-xs text-slate-500 font-mono mt-1 block">
                    {new Date(currentJob.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    currentJob.operatorId 
                      ? 'bg-white text-black' 
                      : 'bg-transparent text-white border border-white/20 animate-pulse'
                  }`}>
                    {currentJob.operatorId ? '✓' : '2'}
                  </div>
                  <div className={`w-[1px] h-10 mt-2 ${currentJob.status === 'active' || currentJob.status === 'completed' ? 'bg-white/20' : 'bg-white/5'}`}></div>
                </div>
                <div>
                  <span className="text-sm font-medium text-white block">{t('flow.statusReview')}</span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {currentJob.operatorId ? 'Territory Partner assigned' : 'Waiting for territory partner'}
                  </span>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    currentJob.status === 'active' || currentJob.status === 'completed' 
                      ? 'bg-white text-black' 
                      : currentJob.status === 'offered'
                      ? 'bg-transparent text-white border border-white/20 animate-pulse'
                      : 'bg-[#141414] text-slate-600 border border-white/5'
                  }`}>
                    {currentJob.status === 'active' || currentJob.status === 'completed' ? '✓' : '3'}
                  </div>
                  <div className={`w-[1px] h-10 mt-2 ${currentJob.status === 'completed' ? 'bg-white/20' : 'bg-white/5'}`}></div>
                </div>
                <div>
                  <span className="text-sm font-medium text-white block">{t('flow.statusMatch')}</span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {currentJob.unlockedBySpecialistName ? (
                      <span className="text-white">{currentJob.unlockedBySpecialistName} {t('flow.accepted', 'accepted')}</span>
                    ) : currentJob.status === 'offered' ? (
                      <span className="text-slate-400 animate-pulse">{t('flow.statusBroadcasting')}</span>
                    ) : (
                      'Pending territory partner dispatch'
                    )}
                  </span>
                </div>
              </div>
              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    currentJob.status === 'completed' 
                      ? 'bg-white text-black' 
                      : 'bg-[#141414] text-slate-600 border border-white/5'
                  }`}>
                    {currentJob.status === 'completed' ? '✓' : '4'}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-white block">{t('flow.statusResolution')}</span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {currentJob.status === 'completed' ? 'Successfully closed' : 'In progress'}
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase tracking-widest font-mono text-[10px]">{t('flow.jobStatus')}</span>
                <span className={`px-3 py-1 font-mono text-[10px] font-medium rounded-full uppercase tracking-widest ${
                  currentJob.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  currentJob.status === 'active' ? 'bg-white/10 text-white border border-white/20' :
                  currentJob.status === 'offered' ? 'bg-white/10 text-white border border-white/20 animate-pulse' :
                  'bg-white/5 text-slate-400 border border-white/10'
                }`}>
                  {currentJob.status.replace('_', ' ')}
                </span>
              </div>
              {currentJob.status !== 'pending_operator' && (
                <div className="bg-[#0A0A0A] p-4 rounded-xl text-xs text-slate-400 font-mono space-y-2 border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('flow.estDuration')}</span>
                    <span className="text-white">{currentJob.estimatedHours} {t('flow.hours', 'Hours')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('flow.fixedPrice')}</span>
                    <span className="font-bold text-white">~{currentJob.estimatedValue}€</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {currentJob.unlockedBySpecialistName && (
            <div className="bg-[#0F0F0F] p-6 rounded-2xl border border-white/5 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-widest">
                ASSIGNED SPECIALIST
              </span>
              <div className="text-base font-medium text-white flex flex-wrap items-center justify-between gap-2">
                <span>{currentJob.unlockedBySpecialistName}</span>
                {currentJob.isGroupJob && (
                  <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono rounded-full font-bold">
                    👥 Team Job ({currentJob.teamSize || 2} specialists)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs bg-[#0A0A0A] p-3 rounded-xl border border-white/5">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-mono">{currentJob.unlockedBySpecialistPhone}</span>
              </div>
            </div>
          )}
          {currentJob.attachments && currentJob.attachments.length > 0 && (
            <div className="bg-[#0A1128]/80 p-6 rounded-2xl border border-blue-900/20 space-y-3">
              <span className="text-[10px] font-mono text-cyan-400 block uppercase tracking-widest font-bold">
                ATTACHMENTS
              </span>
              <div className="grid grid-cols-2 gap-2">
                {currentJob.attachments.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-xl border border-blue-950 hover:border-cyan-400/30 transition-colors text-center group cursor-pointer"
                  >
                    {url.startsWith('data:image') || url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('blob') ? (
                      <img src={url} alt="attachment" className="w-12 h-12 object-cover rounded-md mb-2 group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                    ) : (
                      <FileText className="w-6 h-6 text-slate-400 mb-2" />
                    )}
                    <span className="text-[10px] text-slate-400 font-mono truncate w-full">
                      File {idx + 1}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Right Side: Chat & Job Info */}
        <div className="lg:col-span-2 flex flex-col bg-[#0A1128]/95 rounded-3xl border border-blue-900/20 overflow-hidden min-h-[550px] animate-in fade-in slide-in-from-right-3 duration-300 shadow-2xl">
          {/* Chat Header */}
          <div className="p-6 bg-[#0B132B]/60 border-b border-blue-900/20 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <div>
                <span className="text-sm font-bold text-white block">
                  {activeChatChannel === 'customer_specialist' ? 'Direct Specialist Chat' : 'Regional Service Desk'}
                </span>
                <span className="text-xs text-slate-400">
                  {activeChatChannel === 'customer_specialist' ? 'Private Specialist Conversation' : 'Territory Partner Intermediary'}
                </span>
              </div>
            </div>
            <button
              id="request-another-service-btn"
              onClick={handleCreateAnother}
              className="text-xs font-semibold bg-blue-600/10 hover:bg-blue-600 text-cyan-400 hover:text-white px-4 py-2 rounded-full border border-blue-900/30 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              New Request
            </button>
          </div>
          {/* Unified Role-based Chat Matrix Selector */}
          {(currentJob.status === 'active' || currentJob.status === 'completed') && (
            <div className="flex bg-[#0B132B]/80 p-1 border-b border-blue-900/20">
              <button
                type="button"
                onClick={() => setActiveChatChannel('customer_operator')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeChatChannel === 'customer_operator'
                    ? 'bg-blue-600 text-white shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Support Service Desk
              </button>
              <button
                type="button"
                onClick={() => setActiveChatChannel('customer_specialist')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeChatChannel === 'customer_specialist'
                    ? 'bg-emerald-600 text-white shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Direct Specialist Chat (Unlocked ✔)
              </button>
            </div>
          )}
          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 flex flex-col min-h-[350px]" id="customer-chat-history">
            {(() => {
              const dummyUser = {
                id: 'customer-owner',
                email: 'customer@nordbase.pt',
                name: currentJob.customerName,
                phone: currentJob.customerPhone,
                role: 'customer' as const,
                specialistStatus: 'not_requested' as const
              };
              const visibleMessages = currentJob.messages.filter((msg) => {
                const channel = msg.channel || 'customer_operator';
                return canViewChat(dummyUser, {
                  type: 'job',
                  job: currentJob,
                  channel: channel
                }) && channel === activeChatChannel;
              });
              if (visibleMessages.length === 0) {
                return (
                  <div className="text-center py-12 text-slate-500 text-xs font-mono">
                    No messages in this lane yet.
                  </div>
                );
              }
              return visibleMessages.map((msg) => {
                const isCustomer = msg.sender === 'customer';
                const isSystem = msg.sender === 'system';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      isCustomer ? 'align-self-end ml-auto items-end animate-in fade-in slide-in-from-right-1 duration-200' : isSystem ? 'mx-auto items-center text-center max-w-full' : 'align-self-start mr-auto items-start animate-in fade-in slide-in-from-left-1 duration-200'
                    }`}
                  >
                    {isSystem ? (
                      <div className="bg-[#0B132B] text-cyan-400 text-xs px-4 py-2 rounded-full font-semibold border border-blue-900/30 font-mono">
                        {msg.content}
                      </div>
                    ) : (
                      <>
                        <span className="text-[9px] text-slate-500 font-bold mb-1.5 px-1 font-mono uppercase tracking-wider">
                          {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div
                          className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                            isCustomer
                              ? 'bg-blue-600 text-white font-medium rounded-tr-sm shadow-[0_2px_8px_rgba(37,99,235,0.3)]'
                              : 'bg-slate-950/80 text-slate-200 rounded-tl-sm border border-blue-950/80'
                          }`}
                        >
                          <AITranslatedMessage content={msg.content} context="Customer and Service Partner Communication" />
                          {/* Dynamic Message Attachment Rendering */}
                          {msg.attachmentUrl && (
                            <div className="mt-3 p-2 bg-slate-950/90 rounded-xl border border-blue-900/40 flex items-center gap-3">
                              {msg.attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                <img
                                  src={msg.attachmentUrl}
                                  alt={msg.attachmentName || 'Attachment'}
                                  referrerPolicy="no-referrer"
                                  className="w-16 h-16 object-cover rounded-lg border border-slate-850 hover:scale-105 transition-transform cursor-pointer"
                                  onClick={() => window.open(msg.attachmentUrl, '_blank')}
                                />
                              ) : (
                                <FileText className="w-8 h-8 text-cyan-400 shrink-0" />
                              )}
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-xs text-white font-semibold truncate font-mono">
                                  {msg.attachmentName || 'Shared Document'}
                                </span>
                                <a
                                  href={msg.attachmentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-cyan-400 font-bold hover:underline mt-0.5 inline-block"
                                >
                                  Download File
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              });
            })()}
          </div>
          {/* Chat Input with inline attachments support */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-blue-900/20 bg-[#0B132B]/40 flex gap-2 items-center" id="customer-chat-form">
            <label className="p-3 bg-slate-950 hover:bg-slate-900 border border-blue-900/30 text-slate-400 hover:text-white rounded-xl cursor-pointer transition-all active:scale-95 shrink-0 flex items-center justify-center">
              <Paperclip className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                onChange={handleChatFileUpload}
                disabled={chatUploading}
              />
            </label>
            <input
              id="customer-chat-input"
              maxLength={2000} type="text"
              required
              placeholder={chatUploading ? "Uploading file..." : "Type your message..."}
              value={typedMessage}
              disabled={chatUploading}
              onChange={(e) => setTypedMessage(e.target.value)}
              className="flex-1 px-4 py-3.5 text-sm rounded-xl border border-blue-900/30 bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
            <AIMessagePolisher
              currentText={typedMessage}
              onApply={(improved) => setTypedMessage(improved)}
              context="Customer local service enquiry"
            />
            <button
              id="customer-send-msg-btn"
              type="submit"
              disabled={chatUploading}
              className="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center shadow-md active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}