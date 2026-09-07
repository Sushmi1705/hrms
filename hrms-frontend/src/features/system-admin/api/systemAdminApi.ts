import axios from 'axios';
import {
  AdminDashboardData,
  UserSummary,
  UserDetails,
  CreateUserData,
  UpdateUserData,
  RoleData,
  CreateRoleData,
  UpdateRoleData,
  PermissionData,
  FullPermissionMatrixResponse,
  SystemSettingItem,
  UpdateSettingData,
  SecurityPolicyData,
  EmailConfigurationData,
  FeatureFlagItem,
  HolidayCalendarItem,
  SaveHolidayCalendarData,
  SessionSummary,
  BackgroundJobItem,
  SystemHealthReport,
  PagedResult,
  EffectivePermission
} from '../types/systemAdmin';

const API_BASE = 'http://localhost:5002/api/v1/admin';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const systemAdminApi = {
  // 1. Dashboard
  getDashboard: async (): Promise<AdminDashboardData> => {
    const res = await api.get('/dashboard');
    return res.data;
  },

  // 2. User Management
  getUsers: async (params?: {
    search?: string;
    role?: string;
    company?: string;
    department?: string;
    status?: string;
    mfa?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<UserSummary>> => {
    const res = await api.get('/users', { params });
    return res.data;
  },

  getUserDetails: async (id: string): Promise<UserDetails> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  createUser: async (data: CreateUserData): Promise<UserSummary> => {
    const res = await api.post('/users', data);
    return res.data;
  },

  updateUser: async (id: string, data: UpdateUserData): Promise<UserSummary> => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  activateUser: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/activate`);
  },

  deactivateUser: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/deactivate`);
  },

  lockUser: async (id: string, reason?: string): Promise<void> => {
    await api.post(`/users/${id}/lock`, { reason });
  },

  unlockUser: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/unlock`);
  },

  resetPassword: async (id: string, password?: string): Promise<{ temporaryPassword: string }> => {
    const res = await api.post(`/users/${id}/reset-password`, { password });
    return res.data;
  },

  forceLogout: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/force-logout`);
  },

  getUserRoles: async (id: string) => {
    const res = await api.get(`/users/${id}/roles`);
    return res.data;
  },

  updateUserRoles: async (id: string, roleIds: string[]): Promise<void> => {
    await api.put(`/users/${id}/roles`, roleIds);
  },

  getUserPermissions: async (id: string): Promise<EffectivePermission[]> => {
    const res = await api.get(`/users/${id}/permissions`);
    return res.data;
  },

  updateUserDirectPermission: async (id: string, permissionId: string, isGranted: boolean, reason?: string): Promise<void> => {
    await api.put(`/users/${id}/permissions`, { permissionId, isGranted, reason: reason || 'Direct administrator assignment' });
  },

  // 3. Roles & Permissions
  getRoles: async (): Promise<RoleData[]> => {
    const res = await api.get('/roles');
    return res.data;
  },

  getRoleById: async (id: string): Promise<RoleData> => {
    const res = await api.get(`/roles/${id}`);
    return res.data;
  },

  createRole: async (data: CreateRoleData): Promise<RoleData> => {
    const res = await api.post('/roles', data);
    return res.data;
  },

  updateRole: async (id: string, data: UpdateRoleData): Promise<RoleData> => {
    const res = await api.put(`/roles/${id}`, data);
    return res.data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await api.delete(`/roles/${id}`);
  },

  duplicateRole: async (id: string): Promise<RoleData> => {
    const res = await api.post(`/roles/${id}/duplicate`);
    return res.data;
  },

  getPermissionsCatalog: async (): Promise<PermissionData[]> => {
    const res = await api.get('/permissions');
    return res.data;
  },

  getRolePermissions: async (roleId: string): Promise<string[]> => {
    const res = await api.get(`/roles/${roleId}/permissions`);
    return res.data;
  },

  updateRolePermissions: async (roleId: string, permissionIds: string[]): Promise<void> => {
    await api.put(`/roles/${roleId}/permissions`, permissionIds);
  },

  getPermissionMatrix: async (): Promise<FullPermissionMatrixResponse> => {
    const res = await api.get('/permissions/matrix');
    return res.data;
  },

  // 4. Settings
  getSettings: async (params?: { category?: string; companyId?: string; branchId?: string }): Promise<SystemSettingItem[]> => {
    const res = await api.get('/settings', { params });
    return res.data;
  },

  updateSetting: async (data: UpdateSettingData): Promise<void> => {
    await api.put('/settings', data);
  },

  getSecurityPolicy: async (): Promise<SecurityPolicyData> => {
    const res = await api.get('/settings/security');
    return res.data;
  },

  updateSecurityPolicy: async (data: SecurityPolicyData): Promise<SecurityPolicyData> => {
    const res = await api.put('/settings/security', data);
    return res.data;
  },

  getEmailConfiguration: async (): Promise<EmailConfigurationData> => {
    const res = await api.get('/settings/email');
    return res.data;
  },

  updateEmailConfiguration: async (data: EmailConfigurationData): Promise<EmailConfigurationData> => {
    const res = await api.put('/settings/email', data);
    return res.data;
  },

  testEmailConnection: async (): Promise<{ success: boolean; message: string }> => {
    const res = await api.post('/settings/email/test-connection');
    return res.data;
  },

  sendTestEmail: async (recipientEmail: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post('/settings/email/send-test', { recipientEmail });
    return res.data;
  },

  // 5. Feature Flags
  getFeatureFlags: async (): Promise<FeatureFlagItem[]> => {
    const res = await api.get('/settings/feature-flags');
    return res.data;
  },

  updateFeatureFlag: async (key: string, isEnabledGlobally: boolean, companyOverridesJson?: string): Promise<void> => {
    await api.put(`/settings/feature-flags/${key}`, { isEnabledGlobally, companyOverridesJson });
  },

  // 6. Holiday Calendars
  getHolidayCalendars: async (params?: { year?: number; companyId?: string }): Promise<HolidayCalendarItem[]> => {
    const res = await api.get('/settings/holiday-calendars', { params });
    return res.data;
  },

  getHolidayCalendarById: async (id: string): Promise<HolidayCalendarItem> => {
    const res = await api.get(`/settings/holiday-calendars/${id}`);
    return res.data;
  },

  saveHolidayCalendar: async (data: SaveHolidayCalendarData): Promise<HolidayCalendarItem> => {
    const res = await api.post('/settings/holiday-calendars', data);
    return res.data;
  },

  deleteHolidayCalendar: async (id: string): Promise<void> => {
    await api.delete(`/settings/holiday-calendars/${id}`);
  },

  // 7. Sessions
  getActiveSessions: async (params?: { search?: string; page?: number; pageSize?: number }): Promise<PagedResult<SessionSummary>> => {
    const res = await api.get('/sessions', { params });
    return res.data;
  },

  revokeSession: async (id: string, reason?: string): Promise<void> => {
    await api.post(`/sessions/${id}/revoke`, { reason });
  },

  revokeAllSessions: async (reason?: string): Promise<{ success: boolean; revokedCount: number; message: string }> => {
    const res = await api.post('/sessions/revoke-all', { reason });
    return res.data;
  },

  // 8. Background Jobs
  getBackgroundJobs: async (): Promise<BackgroundJobItem[]> => {
    const res = await api.get('/background-jobs');
    return res.data;
  },

  triggerJobNow: async (key: string): Promise<void> => {
    await api.post(`/background-jobs/${key}/run-now`);
  },

  toggleJobPause: async (key: string): Promise<void> => {
    await api.post(`/background-jobs/${key}/toggle-pause`);
  },

  // 9. System Health
  getSystemHealth: async (): Promise<SystemHealthReport> => {
    const res = await api.get('/system-health');
    return res.data;
  },

  // 10. Export
  getExportUrl: (type: string, format: string = 'csv') => {
    return `${API_BASE}/export?type=${type}&format=${format}`;
  }
};
