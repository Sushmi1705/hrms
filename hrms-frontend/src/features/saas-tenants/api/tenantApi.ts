import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';
import {
  PlatformDashboardData,
  PagedResult,
  TenantSummary,
  TenantDetails,
  SubscriptionPlanItem,
  CreateTenantPayload,
  UpdateTenantPayload,
  ImpersonationSessionResult
} from '../types/tenant';

const API_BASE = `${API_BASE_URL}/api/v1/platform`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tenantApi = {
  getDashboard: async (): Promise<PlatformDashboardData> => {
    const res = await api.get('/dashboard');
    return res.data;
  },

  getTenants: async (params?: {
    search?: string;
    status?: string;
    plan?: string;
    country?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<TenantSummary>> => {
    const res = await api.get('/tenants', { params });
    return res.data;
  },

  getTenantById: async (id: string): Promise<TenantDetails> => {
    const res = await api.get(`/tenants/${id}`);
    return res.data;
  },

  createTenant: async (data: CreateTenantPayload): Promise<TenantDetails> => {
    const res = await api.post('/tenants', data);
    return res.data;
  },

  updateTenant: async (id: string, data: UpdateTenantPayload): Promise<TenantDetails> => {
    const res = await api.put(`/tenants/${id}`, data);
    return res.data;
  },

  activateTenant: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.post(`/tenants/${id}/activate`);
    return res.data;
  },

  suspendTenant: async (id: string, reason: string): Promise<{ success: boolean }> => {
    const res = await api.post(`/tenants/${id}/suspend`, { reason });
    return res.data;
  },

  reactivateTenant: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.post(`/tenants/${id}/reactivate`);
    return res.data;
  },

  changePlan: async (id: string, newPlanCode: string, billingCycle: string, changeReason: string): Promise<{ success: boolean }> => {
    const res = await api.post(`/tenants/${id}/change-plan`, { newPlanCode, billingCycle, changeReason });
    return res.data;
  },

  updateFeatureOverride: async (id: string, featureKey: string, isEnabled: boolean, reason: string): Promise<{ success: boolean }> => {
    const res = await api.put(`/tenants/${id}/feature-overrides`, { featureKey, isEnabled, reason });
    return res.data;
  },

  getPlans: async (): Promise<SubscriptionPlanItem[]> => {
    const res = await api.get('/plans');
    return res.data;
  },

  savePlan: async (plan: SubscriptionPlanItem): Promise<SubscriptionPlanItem> => {
    const res = await api.post('/plans', plan);
    return res.data;
  },

  startImpersonation: async (tenantId: string, reason: string): Promise<ImpersonationSessionResult> => {
    const res = await api.post('/impersonation/start', { tenantId, reason });
    return res.data;
  },

  endImpersonation: async (logId: string, actions?: string): Promise<{ success: boolean }> => {
    const res = await api.post('/impersonation/end', null, { params: { logId, actions } });
    return res.data;
  },

  requestDeletion: async (id: string, reason: string): Promise<{ success: boolean }> => {
    const res = await api.post(`/tenants/${id}/delete-request`, { reason });
    return res.data;
  },

  cancelDeletion: async (id: string, reason: string): Promise<{ success: boolean }> => {
    const res = await api.post(`/tenants/${id}/cancel-deletion`, { reason });
    return res.data;
  },

  getExportUrl: (): string => {
    return `${API_BASE}/export`;
  }
};
