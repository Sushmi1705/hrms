export interface AdminDashboardData {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  lockedUsers: number;
  adminUsers: number;
  hrUsers: number;
  managerUsers: number;
  employeeUsers: number;
  activeRoles: number;
  activePermissions: number;
  pendingInvitations: number;
  securityAlertsCount: number;
  userGrowth: { period: string; usersCount: number; activeCount: number }[];
  loginActivity: { day: string; successLogins: number; failedLogins: number }[];
  usersByRole: { name: string; count: number; percentage: number }[];
  usersByDepartment: { name: string; count: number; percentage: number }[];
  usersByCompany: { name: string; count: number; percentage: number }[];
  failedLoginTrends: { period: string; failedCount: number; lockedCount: number }[];
  permissionUsage: { module: string; totalPermissions: number; grantedCount: number }[];
  recentAdminActivity: AdminActivityLog[];
}

export interface AdminActivityLog {
  id: string;
  action: string;
  targetName: string;
  targetType: string;
  performedBy: string;
  details: string;
  timestamp: string;
}

export interface UserSummary {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  employeeId: string;
  employeeEntityId?: string;
  companyName: string;
  branchName: string;
  departmentName: string;
  roles: string[];
  isActive: boolean;
  isLocked: boolean;
  lockReason: string;
  requireMfa: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  lastLoginIp: string;
  createdAt: string;
}

export interface RoleAssignment {
  roleId: string;
  roleName: string;
  roleCode: string;
  isSystem: boolean;
  assignedAt: string;
  assignedBy: string;
}

export interface EffectivePermission {
  permissionId: string;
  code: string;
  module: string;
  action: string;
  name: string;
  isGranted: boolean;
  source: 'Role' | 'Direct';
  roleSource: string;
}

export interface SessionSummary {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  deviceType: string;
  browser: string;
  operatingSystem: string;
  ipAddress: string;
  location: string;
  loginAt: string;
  lastActivityAt: string;
  expiresAt: string;
  isRevoked: boolean;
  revocationReason: string;
}

export interface UserLoginHistory {
  id: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  status: 'Success' | 'Failed';
  failureReason: string;
}

export interface UserSecurityEvent {
  id: string;
  timestamp: string;
  eventType: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  ipAddress: string;
}

export interface UserDetails extends UserSummary {
  avatarUrl: string;
  companyId?: string;
  branchId?: string;
  departmentId?: string;
  passwordPolicy: string;
  mustChangePasswordOnNextLogin: boolean;
  allowLogin: boolean;
  roleAssignments: RoleAssignment[];
  effectivePermissions: EffectivePermission[];
  activeSessions: SessionSummary[];
  loginHistory: UserLoginHistory[];
  securityEvents: UserSecurityEvent[];
  auditActivity: AdminActivityLog[];
}

export interface CreateUserData {
  username: string;
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  employeeId?: string;
  employeeEntityId?: string;
  companyId?: string;
  companyName?: string;
  branchId?: string;
  branchName?: string;
  departmentId?: string;
  departmentName?: string;
  roleIds: string[];
  requireMfa: boolean;
  mustChangePasswordOnNextLogin: boolean;
  passwordPolicy: string;
  sendInvitationEmail: boolean;
}

export interface UpdateUserData {
  fullName: string;
  phoneNumber?: string;
  companyId?: string;
  companyName?: string;
  branchId?: string;
  branchName?: string;
  departmentId?: string;
  departmentName?: string;
  requireMfa: boolean;
  allowLogin: boolean;
  passwordPolicy: string;
}

export interface RoleData {
  id: string;
  code: string;
  name: string;
  description: string;
  isSystem: boolean;
  isActive: boolean;
  userCount: number;
  permissionCount: number;
  createdAt: string;
  permissions: PermissionData[];
}

export interface CreateRoleData {
  code?: string;
  name: string;
  description: string;
  permissionIds: string[];
}

export interface UpdateRoleData {
  name: string;
  description: string;
  isActive: boolean;
  permissionIds: string[];
}

export interface PermissionData {
  id: string;
  code: string;
  module: string;
  feature: string;
  action: string;
  name: string;
  description: string;
  isSystem: boolean;
}

export interface PermissionMatrixModule {
  module: string;
  permissions: PermissionData[];
}

export interface RolePermissionMatrix {
  roleId: string;
  roleName: string;
  grantedPermissionIds: string[];
}

export interface FullPermissionMatrixResponse {
  modules: PermissionMatrixModule[];
  roles: RolePermissionMatrix[];
}

export interface SystemSettingItem {
  id: string;
  category: string;
  key: string;
  value: string;
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'encrypted';
  description: string;
  scopeLevel: 'Global' | 'Company' | 'BusinessUnit' | 'Branch';
  companyId?: string;
  companyName?: string;
  branchId?: string;
  branchName?: string;
  isEncrypted: boolean;
  isSystem: boolean;
  updatedAt?: string;
  updatedByName?: string;
}

export interface UpdateSettingData {
  key: string;
  value: string;
  scopeLevel?: string;
  companyId?: string;
  branchId?: string;
  changeReason?: string;
}

export interface SecurityPolicyData {
  id?: string;
  policyName: string;
  passwordMinLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpirationDays: number;
  passwordHistoryCount: number;
  maxFailedLoginAttempts: number;
  accountLockDurationMinutes: number;
  sessionTimeoutMinutes: number;
  idleTimeoutMinutes: number;
  mfaRequirement: 'None' | 'Optional' | 'AdminsOnly' | 'AllUsers';
  concurrentSessionLimit: 'Single' | 'MultiLimit' | 'Unlimited';
  maxConcurrentSessions: number;
  ipWhitelist: string;
  forceLogoutOnPasswordChange: boolean;
  rememberDeviceAllowed: boolean;
}

export interface EmailConfigurationData {
  id?: string;
  smtpHost: string;
  smtpPort: number;
  username: string;
  passwordEncrypted?: string;
  securityMode: 'None' | 'SSL' | 'TLS';
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  isDefault: boolean;
  status: string;
  lastTestedAt?: string;
}

export interface FeatureFlagItem {
  id: string;
  key: string;
  name: string;
  module: string;
  description: string;
  isEnabledGlobally: boolean;
  companyOverridesJson: string;
}

export interface HolidayCalendarItem {
  id: string;
  code: string;
  name: string;
  description: string;
  year: number;
  companyId?: string;
  companyName?: string;
  branchId?: string;
  branchName?: string;
  isDefault: boolean;
  daysCount: number;
  days: HolidayCalendarDayItem[];
}

export interface HolidayCalendarDayItem {
  id?: string;
  holidayCalendarId?: string;
  name: string;
  date: string;
  type: 'Public' | 'Company' | 'Regional' | 'Optional';
  isRecurring: boolean;
  description?: string;
}

export interface SaveHolidayCalendarData {
  id?: string;
  code?: string;
  name: string;
  description?: string;
  year: number;
  companyId?: string;
  companyName?: string;
  branchId?: string;
  branchName?: string;
  isDefault: boolean;
  days: HolidayCalendarDayItem[];
}

export interface BackgroundJobItem {
  id: string;
  jobKey: string;
  name: string;
  category: string;
  description: string;
  cronSchedule: string;
  status: 'Idle' | 'Running' | 'Paused' | 'Completed' | 'Failed';
  lastRunAt?: string;
  nextRunAt?: string;
  lastDurationMs: number;
  successCount: number;
  failureCount: number;
  lastErrorMessage: string;
}

export interface SystemHealthReport {
  overallStatus: 'Healthy' | 'Warning' | 'Critical';
  checkedAt: string;
  components: ComponentHealth[];
}

export interface ComponentHealth {
  name: string;
  componentType: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  responseTimeMs: number;
  errorCount: number;
  message: string;
  lastCheckedAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
