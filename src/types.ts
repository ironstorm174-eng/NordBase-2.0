/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'customer' | 'specialist' | 'operator' | 'regional_admin' | 'super_admin';

export type ServiceCategory =
  | 'Home Services'
  | 'Cleaning'
  | 'Gardening'
  | 'Moving'
  | 'Transport'
  | 'Repairs'
  | 'Construction'
  | 'Pools'
  | 'Hospitality'
  | 'Care'
  | 'Lessons'
  | 'Business';

export interface LocationHierarchy {
  country: string; // 'Portugal'
  region: string;
  city: string;
  district: string;
}

export interface CityInfo {
  name: string;
  region: string;
  description: string;
}

export interface Message {
  id: string;
  sender: 'customer' | 'operator' | 'specialist' | 'system' | 'super_admin' | 'regional_admin';
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  channel?: 'customer_operator' | 'operator_specialist' | 'operator_operator' | 'customer_specialist';
  attachmentUrl?: string;
  attachmentName?: string;
  originalLanguage?: string;
  translations?: Record<string, string>;
}

export type JobStatus =
  | 'pending_operator'    // Customer submitted, operator reviewing/calling
  | 'offered'             // Territory Partner offered lead to 1-3 specialists
  | 'specialist_selected' // Territory Partner selected the best specialist among interested ones, waiting for payment
  | 'active'              // Specialist paid for the lead, work in progress
  | 'completed'           // Work completed
  | 'cancelled';          // Closed/invalid

export type QualificationLevel = 'amateur' | 'professional' | 'expert';

export interface TeamMember {
  id: string;
  role: 'lead' | 'worker';
  qualificationLevel: QualificationLevel;
  hourlyRate: number;
  hours: number;
  name?: string;
}

export interface Job {
  id: string;
  category: ServiceCategory;
  city: string;
  district?: string;
  region?: string;
  subcategory?: string;
  customerConfirmedValue?: boolean;
  specificLocation: string;
  description: string;
  estimatedHours: number;
  estimatedValue: number;
  specialistAssessedValue?: number;
  customerPriceAccepted?: boolean;
  finalPrice?: number;
  calloutFeePending?: boolean;
  calloutFeeAmount?: number;
  leadPrice: number;
  status: JobStatus;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  
  hubId?: string;
  operatorId: string | null;
  operatorNotes?: string;

  offeredSpecialistIds?: string[];
  interestedSpecialistIds?: string[];
  
  unlockedBySpecialistId: string | null;
  unlockedBySpecialistName?: string;
  unlockedBySpecialistPhone?: string;

  messages: Message[];
  attachments?: string[];
  timeline?: JobTimelineEvent[];

  // Completion & Review fields
  customerCompleted?: boolean;
  customerCompletedAt?: string;
  customerCompletion?: CustomerCompletionData;
  specialistCompleted?: boolean;
  specialistCompletedAt?: string;
  specialistCompletion?: SpecialistCompletionData;
  rating?: number; // 1-5 stars
  positiveTags?: string[];
  customerComment?: string;
  feedbackSubmittedAt?: string;

  // Group Job / Team Configuration fields (Phase 2 & Phase 3)
  executionType?: 'individual' | 'group';
  isGroupJob?: boolean;
  groupLeadId?: string | null;
  groupSize?: number | null;
  groupMemberCount?: number | null;
  leadSpecialistId?: string;
  teamSize?: number;
  teamMembers?: TeamMember[];
  groupHours?: number;
}

export interface CustomerCompletionData {
  confirmed: boolean;
  orderCompleted: boolean;
  noClaims: boolean;
  paymentMade: boolean;
  confirmedAt: string;
}

export interface SpecialistCompletionData {
  confirmed: boolean;
  workCompleted: boolean;
  paymentReceived: boolean;
  noClaims: boolean;
  confirmedAt: string;
}

export type SkillLevel = 'junior' | 'middle' | 'senior';

export interface SpecialtyWithLevel {
  category: ServiceCategory;
  specialty: string;
  level: 'amateur' | 'pro' | 'expert';
}

export interface SpecialistAvailability {
  workingDays: string[];
  workingHours: string;
  emergencyAvailability: boolean;
}

export interface Specialist {
  id: string;
  name: string;
  email?: string;
  photoUrl?: string;
  phone: string;
  categories: ServiceCategory[];
  category?: ServiceCategory;
  city: string;
  district?: string;
  region?: string;
  balance: number; // Simulated account credit
  unlockedJobs: string[]; // List of Job IDs
  skillLevel?: SkillLevel;
  skillsDescription?: string;
  availability?: SpecialistAvailability;
  documentUrl?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'new';
  operatorId?: string; // Their assigned operator

  // New onboarding fields
  languages?: { language: string; level: 'basic' | 'conversational' | 'native' }[];
  tradeSkillLevel?: 'amateur' | 'pro' | 'expert';
  specialtiesWithLevels?: SpecialtyWithLevel[];
  verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[];

  // Marketplace & Subscription fields
  isGroupLead?: boolean;
}


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

export interface HubSeat {
  seatId: string;           // e.g. "PT-OP-001-A"
  seatCode: string;         // e.g. "001-A"
  shiftName: 'Shift 1 (08:00 - 16:00)' | 'Shift 2 (16:00 - 24:00)' | 'Relief Cover A' | 'Relief Cover B';
  operatorId: string | null;
  operatorName: string | null;
  operatorPhone?: string;
  operatorEmail?: string;
  status: 'active' | 'vacant' | 'on_break';
  personalRevenue?: number;
  personalJobsProcessed?: number;
}

export interface TerritorialHub {
  id: string;              // e.g. "HUB-LIS-001"
  hubCode: string;         // e.g. "HUB-001"
  name: string;            // e.g. "Cascais & Sintra Central Hub"
  rdCode: string;          // e.g. "Pt-RD-001"
  region: string;          // e.g. "Big Lisboa"
  city: string;            // e.g. "Cascais"
  assignedDistricts: string[];
  seats: HubSeat[];        // Exactly 4 seats per Hub (2 shifts + 2 covers)
  createdAt: string;
  totalHubRevenue?: number;
  activeJobsCount?: number;
  chatMessages?: Message[];
}

export interface Operator {
  id: string;
  name: string;
  assignedRegions: string[];
  assignedCities: string[];
  assignedDistricts: string[];
}

export type SpecialistStatus = 'not_requested' | 'pending_details' | 'pending_approval' | 'approved' | 'new' | 'pending_review' | 'rejected';

export interface AuthUser {
  id: string;
  token?: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  specialistStatus: SpecialistStatus;
  city?: string;
  district?: string;
  region?: string;
  categories?: ServiceCategory[];
  category?: ServiceCategory;
  isNewUser?: boolean;
  assignedOperatorId?: string;
  whatsapp?: string;
  telegram?: string;
  dashboardNumber?: string;
  isBlocked?: boolean;
  password?: string;

  // Territorial Hub & Seat fields
  hubId?: string;
  hubName?: string;
  seatId?: string;
  shiftName?: string;

  // New onboarding fields
  languages?: { language: string; level: 'basic' | 'conversational' | 'native' }[];
  tradeSkillLevel?: 'amateur' | 'pro' | 'expert';
  specialtiesWithLevels?: SpecialtyWithLevel[];
  skillsDescription?: string;
  photoUrl?: string;
  avatar?: string;
  verificationDocuments?: { type: 'passport' | 'id_card' | 'drivers_license'; name: string; url: string }[];
  isMarketplaceSpecialist?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionEndDate?: string | null;
  subscriptionStatus?: 'active' | 'expired' | 'none';
  marketplaceServices?: SpecialistService[];
  aboutMe?: string;
  marketplaceAvailability?: SpecialistAvailabilitySlot[];
  isGroupLead?: boolean;
}

export interface JobTimelineEvent {
  id: string;
  action: string;
  timestamp: string;
  actor: string;
  details?: string;
}

export interface SupportTicketMessage {
  id: string;
  sender: 'customer' | 'operator' | 'specialist' | 'regional_admin' | 'super_admin' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  originalLanguage?: string;
  translations?: Record<string, string>;
}

export interface SupportTicketHistoryEvent {
  id: string;
  status: string;
  changedBy: string;
  timestamp: string;
  notes?: string;
}

export interface SupportTicket {
  id: string;
  category: 'Payments' | 'Lead Refund' | 'Technical Issue' | 'Documents' | 'Verification' | 'Complaint' | 'Appeal' | 'Other';
  title: string;
  description: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userRole: 'specialist' | 'operator' | 'customer';
  userId: string;
  userName: string;
  assignedAdminId: string | null;
  assignedAdminName: string | null;
  createdAt: string;
  history: SupportTicketHistoryEvent[];
  attachments: string[];
  internalNotes: string;
  messages: SupportTicketMessage[];
}

export interface WorkspacePost {
  id: string;
  module: 'Announcements' | 'Lounge' | 'Ideas' | 'Knowledge Base' | 'Training' | 'Support';
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  attachments?: string[];
  likes: number;
  commentsCount: number;
}

export interface AppNotification {
  id: string;
  type: 'new_job' | 'lead_assigned' | 'lead_purchased' | 'customer_cancelled' | 'operator_message' | 'support_reply' | 'document_approved' | 'payment_received' | 'lead_offered';
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  userId: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  territory: string;
  timestamp: string;
  details: string;
}

export interface SuggestionComplaint {
  id: string;
  type: 'suggestion' | 'complaint';
  title: string;
  content: string;
  senderName: string;
  senderRole: string;
  region: string;
  timestamp: string;
  status: 'pending' | 'reviewed';
}

export interface PartnerApplication {
  id: string;
  type: 'territorial' | 'regional';
  fullName: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  phone: string;
  email: string;
  location: string; // Primary City / Region
  country?: string;
  languages?: string[];
  photoUrl?: string;

  // Step 2: Experience
  currentActivity?: string;
  yearsExperience?: string;
  hasCustomerServiceExp?: boolean;
  hasManagementExp?: boolean;
  hasSalesExp?: boolean;
  hasEntrepreneurExp?: boolean;
  experience?: string;

  // Step 3: Availability & Resources
  hoursPerWeek?: string;
  preferredSchedule?: string;
  availableDays?: string[];
  hasVehicle?: boolean;
  hasComputer?: boolean;
  hasInternet?: boolean;
  hasHomeOffice?: boolean;
  teamSizeOrCapital?: string;

  // Step 4: Motivation
  whyPartner?: string;
  whyChooseYou?: string;
  strengths?: string;
  longTermGoals?: string;
  notes?: string;

  // Step 5: Local Knowledge
  citiesToManage?: string[];
  businessKnowledgeLevel?: string;
  existingNetwork?: string;
  categoryProficiencies?: string[];

  // RP specific optional fields
  linkedinProfile?: string;
  currentCompany?: string;
  managedTeams?: boolean;
  maxTeamSizeManaged?: string;
  ownedOrManagedBusiness?: boolean;
  businessOwnershipExp?: string;
  significantAchievement?: string;

  targetRegion?: string;
  localCommunityKnowledge?: string;
  businessContactsCount?: string;
  familiarIndustries?: string[];
  regionKnowledgeDesc?: string;

  howBuildTPNetwork?: string;
  howAttractSpecialists?: string;
  importantLeadershipValues?: string;

  willingToTravel?: boolean;
  readinessLevel?: string;
  isSelfEmployedOrCompany?: boolean;
  willingToEstablishEntity?: boolean;

  threeYearVision?: string;
  successDefinition?: string;

  agreedAccurate?: boolean;
  agreedNoGuarantee?: boolean;
  agreedCompetitiveProcess?: boolean;
  agreedStandards?: boolean;

  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AppState {
  jobs: Job[];
  specialists: Specialist[];
  currentRole: UserRole;
  selectedCity: string | null;
  selectedCategory: ServiceCategory | null;
  activeSpecialistId: string;
  activeOperatorId: string;
  homeResetCounter?: number;
  
  // Robust Role-Based Auth state
  currentUser: AuthUser | null;
  impersonatedUser?: AuthUser | null;
  superAdminBackupUser?: AuthUser | null;
  users: AuthUser[];
  inviteList: string[]; // Pre-invited emails
  currentPath: string; // Routed path (/app, /pro, /ops, /admin, /partner)

  // Enterprise Communications extension
  supportTickets?: SupportTicket[];
  workspacePosts?: WorkspacePost[];
  notifications?: AppNotification[];
  auditLogs?: AuditLog[];
  suggestions?: SuggestionComplaint[];
  partnerApplications?: PartnerApplication[];
  hubs?: TerritorialHub[];

  // NordBase Centralized Pricing Engine Extension
  pricingConfig?: TerritoryPricingConfig;
  regionalPricingConfigs?: TerritoryPricingConfig[];
  pricingProposals?: PricingProposal[];
  pricingAuditLogs?: PricingAuditLog[];
}

// --- Pricing Engine Core Types ---

export type PricingCalculationType = 'STANDARD' | 'GROUP' | 'TRANSPORT' | 'COMBINED' | 'TRANSPORT_GROUP';

export type VehicleTypeId =
  | 'car'
  | 'passenger_car'
  | 'taxi_transfer'
  | 'motorcycle'
  | 'van'
  | 'large_van'
  | 'small_truck'
  | 'medium_truck'
  | 'large_truck'
  | 'lorry'
  | 'articulated_truck'
  | 'minibus'
  | 'bus'
  | 'other';

export interface VehicleTypeInfo {
  id: VehicleTypeId;
  name: string;
  category: 'passenger' | 'cargo' | 'special';
  coefficient: number; // e.g. 1.0, 1.25, 1.5, 1.8, 2.2, 2.8, 3.5, etc.
  baseKmRateCents: number; // in cents (e.g. 100 cents = €1.00)
  baseHourRateCents: number; // in cents (e.g. 1500 cents = €15.00)
  operatingCostPerKmCents: number; // e.g. 45 cents/km
}

export interface CategorySpecialistRate {
  category: ServiceCategory;
  standardRateCents: number; // €/hr for STANDARD (Amateur)
  proRateCents: number;      // €/hr for PRO (Professional)
  expertRateCents: number;   // €/hr for EXPERT (Expert)
}

export interface LongJobTier {
  minHours: number; // e.g. 4
  discountPercentage: number; // e.g. 10%
  hourlyRateMultiplier: number; // e.g. 0.90
}

export interface MinimumBookingConfig {
  minimumBillableHours: number; // e.g. 2
  minimumLaborCostCents: number; // e.g. 5000 = €50.00
}

export interface PricingExtraItem {
  id: string;
  name: string;
  description?: string;
  calculationType: 'fixed' | 'per_km' | 'per_hour' | 'per_floor' | 'percentage';
  valueCents: number; // in cents or basis points for percentage
  active: boolean;
  territoryScope: 'global' | 'region' | 'hub';
  categoryScope?: ServiceCategory | 'ALL';
}

export interface TerritoryPricingConfig {
  id: string;
  scope: 'global' | 'region' | 'hub';
  territoryName: string; // e.g. 'Portugal', 'Algarve', 'Portimão Hub'
  regionName?: string;
  hubId?: string;
  
  minimumBooking: MinimumBookingConfig;
  longJobTier: LongJobTier;
  
  categoryRates: CategorySpecialistRate[];
  vehicleTypes: VehicleTypeInfo[];
  extras: PricingExtraItem[];
  
  updatedAt: string;
  updatedBy: string;
}

export type ProposalStatus = 'DRAFT' | 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'ARCHIVED';

export interface PricingProposal {
  id: string;
  proposedByUserId: string;
  proposedByName: string;
  proposedByRole: UserRole;
  territoryScope: 'region' | 'hub';
  territoryName: string;
  regionName: string;
  hubId?: string;
  
  changesSummary: string;
  proposedConfig: Partial<TerritoryPricingConfig>;
  
  status: ProposalStatus;
  reviewedByUserId?: string;
  reviewedByName?: string;
  reviewNotes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface PricingAuditLog {
  id: string;
  who: string;
  role: UserRole;
  timestamp: string;
  scope: string; // e.g. "Global / Portugal" or "Algarve Region"
  previousValue: string;
  newValue: string;
  reason: string;
}

export interface DriverCalculationInput {
  vehicleTypeId: VehicleTypeId;
  pickupDistanceKm: number;
  loadedDistanceKm: number;
  returnDistanceKm: number;
  returnPolicy: 'full_return' | 'half_return' | 'no_return';
  
  drivingTimeHours: number;
  loadingTimeHours: number;
  unloadingTimeHours: number;
  waitingTimeHours: number;
  
  passengersCount?: number;
  isRoundTrip?: boolean;
  
  helpersCount: number;
  helperLevel: QualificationLevel;
  
  stairsFlights?: number;
  heavyItemsCount?: number;
  tollsCostEuro?: number;
  selectedExtraIds?: string[];
  
  region?: string;
  hubId?: string;
}

export interface DriverCalculationResult {
  calculationType: PricingCalculationType;
  vehicleType: VehicleTypeInfo;
  
  billableDistanceKm: number;
  pickupDistanceKm: number;
  loadedDistanceKm: number;
  returnDistanceKm: number;
  distanceCostEuro: number;
  
  totalHours: number;
  drivingTimeHours: number;
  loadingTimeHours: number;
  unloadingTimeHours: number;
  waitingTimeHours: number;
  timeCostEuro: number;
  
  helpersCount: number;
  helpersCostEuro: number;
  
  extrasCostEuro: number;
  tollsCostEuro: number;
  
  totalCustomerPriceEuro: number;
  estimatedOperatingCostEuro: number;
  nordbaseLeadFeeEuro: number;
  expectedGrossEarningsEuro: number;
  estimatedNetEarningsEuro: number;
  
  breakdownTexts: string[];
}
