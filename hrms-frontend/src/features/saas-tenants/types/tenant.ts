export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PlatformDashboardData {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  pendingTenants: number;
  expiredTenants: number;
  totalPlatformUsers: number;
  activePlatformUsers: number;
  totalStorageUsedGb: number;
  monthlyRecurringRevenue: number;
  annualRunRate: number;
  failedPaymentsCount: number;
  trialConversionRate: number;
  churnRate: number;
  tenantGrowth: { period: string; totalTenants: number; activeTenants: number; newTenants: number }[];
  revenueTrend: { month: string; mrr: number; subscriptions: number }[];
  tenantsByPlan: { planName: string; count: number; percentage: number; monthlyRevenue: number }[];
  tenantsByIndustry: { industry: string; count: number; percentage: number }[];
  storageByTenant: { tenantName: string; usedMb: number; quotaMb: number; percentage: number }[];
  recentActivity: SaaSActivityItem[];
}

export interface SaaSActivityItem {
  id: string;
  action: string;
  tenantName: string;
  details: string;
  performedBy: string;
  timestamp: string;
  severity: 'Info' | 'Warning' | 'Success' | 'Danger';
}

export interface TenantSummary {
  id: string;
  code: string;
  name: string;
  legalName: string;
  industry: string;
  country: string;
  currency: string;
  status: 'Trial' | 'Active' | 'Suspended' | 'Pending' | 'Expired' | 'Cancelled';
  suspensionReason?: string;
  contactName: string;
  contactEmail: string;
  customDomain?: string;
  domainVerified: boolean;
  planName: string;
  planCode: string;
  billingCycle: string;
  planPrice: number;
  currentUsersCount: number;
  maxUsers: number;
  currentEmployeesCount: number;
  maxEmployees: number;
  storageUsedMb: number;
  storageQuotaGb: number;
  createdAt: string;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
}

export interface TenantDetails {
  id: string;
  code: string;
  name: string;
  legalName: string;
  industry: string;
  country: string;
  currency: string;
  timeZone: string;
  language: string;
  status: 'Trial' | 'Active' | 'Suspended' | 'Pending' | 'Expired' | 'Cancelled';
  suspensionReason?: string;
  suspendedAt?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  primaryColor: string;
  customDomain?: string;
  domainVerified: boolean;
  sslStatus: string;
  maxUsers: number;
  maxEmployees: number;
  storageQuotaGb: number;
  storageUsedMb: number;
  createdAt: string;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  deletionGracePeriodEndsAt?: string;
  currentSubscription?: TenantSubscriptionData;
  usage: TenantUsageMetrics;
  featureOverrides: TenantFeatureOverrideItem[];
  settings: TenantSettingItem[];
  domains: TenantDomainItem[];
  users: TenantUserItem[];
  securityPolicy?: TenantSecurityPolicyData;
}

export interface TenantSubscriptionData {
  id: string;
  planId: string;
  planName: string;
  planCode: string;
  status: string;
  billingCycle: string;
  amount: number;
  currency: string;
  startedAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart?: string;
  trialEnd?: string;
  autoRenew: boolean;
  paymentMethodStatus: string;
  nextBillingAt?: string;
}

export interface TenantUsageMetrics {
  usersCount: number;
  maxUsers: number;
  usersPercentage: number;
  employeesCount: number;
  maxEmployees: number;
  employeesPercentage: number;
  storageUsedMb: number;
  storageQuotaGb: number;
  storagePercentage: number;
  attendanceRecordsCount: number;
  leaveRequestsCount: number;
  payrollRunsCount: number;
  workflowsCount: number;
  notificationsSent: number;
  apiRequestsCount: number;
  healthStatus: 'Healthy' | 'Warning' | 'NearLimit' | 'LimitExceeded';
}

export interface TenantFeatureOverrideItem {
  id: string;
  featureKey: string;
  featureName: string;
  isEnabled: boolean;
  reason: string;
  changedByAdmin?: string;
  updatedAt?: string;
}

export interface TenantSettingItem {
  id: string;
  category: string;
  key: string;
  value: string;
  dataType: string;
  isEncrypted: boolean;
  description: string;
}

export interface TenantDomainItem {
  id: string;
  domain: string;
  isPrimary: boolean;
  verificationStatus: 'Verified' | 'Pending' | 'Failed';
  verificationToken: string;
  sslStatus: 'Active' | 'Pending' | 'Failed';
  verifiedAt?: string;
}

export interface TenantUserItem {
  id: string;
  username: string;
  fullName: string;
  email: string;
  roleName: string;
  departmentName: string;
  isActive: boolean;
  isLocked: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface TenantSecurityPolicyData {
  passwordMinLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  mfaRequirement: string;
  sessionTimeoutMinutes: number;
  maxFailedAttempts: number;
  lockoutMinutes: number;
  ipWhitelist?: string;
}

export interface SubscriptionPlanItem {
  id: string;
  code: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  maxUsers: number;
  maxEmployees: number;
  storageGb: number;
  billingCycle: string;
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  supportTier: string;
  activeSubscribersCount: number;
}

export interface CreateTenantPayload {
  organizationName: string;
  tenantCode: string;
  legalName: string;
  industry: string;
  country: string;
  currency: string;
  timeZone: string;
  language: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  subscriptionPlanCode: string;
  billingCycle: string;
  trialDays: number;
  adminFullName: string;
  adminUsername: string;
  adminEmail: string;
  adminPassword?: string;
}

export interface UpdateTenantPayload {
  name: string;
  legalName: string;
  industry: string;
  country: string;
  currency: string;
  timeZone: string;
  language: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  customDomain?: string;
  primaryColor: string;
  maxUsers: number;
  maxEmployees: number;
  storageQuotaGb: number;
}

export interface ImpersonationSessionResult {
  logId: string;
  tenantId: string;
  tenantCode: string;
  tenantName: string;
  impersonatedToken: string;
  startedAt: string;
  message: string;
}
