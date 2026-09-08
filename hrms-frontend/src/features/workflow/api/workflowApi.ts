import { API_BASE_URL } from '@/lib/api';
import {
  WorkflowDashboardAnalytics,
  WorkflowDefinition,
  ApprovalTask,
  ApprovalDetails,
  Delegation,
  WorkflowTemplate,
  WorkflowEscalation,
  PagedResult
} from '../types/workflow';

const BASE_URL = `${API_BASE_URL}/api/v1/workflow`;

export const workflowApi = {
  // 1. Dashboard
  getDashboardAnalytics: async (department?: string, module?: string): Promise<WorkflowDashboardAnalytics> => {
    const params = new URLSearchParams();
    if (department && department !== 'All') params.append('department', department);
    if (module && module !== 'All') params.append('module', module);
    const res = await fetch(`${BASE_URL}/dashboard?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },

  // 2. Definitions
  getDefinitions: async (params: {
    search?: string;
    module?: string;
    status?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<WorkflowDefinition>> => {
    const qs = new URLSearchParams();
    if (params.search) qs.append('Search', params.search);
    if (params.module && params.module !== 'All') qs.append('Module', params.module);
    if (params.status && params.status !== 'All') qs.append('Status', params.status);
    if (params.category && params.category !== 'All') qs.append('Category', params.category);
    if (params.page) qs.append('Page', params.page.toString());
    if (params.pageSize) qs.append('PageSize', params.pageSize.toString());

    const res = await fetch(`${BASE_URL}/definitions?${qs.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch workflow definitions');
    return res.json();
  },

  getDefinitionById: async (id: string): Promise<WorkflowDefinition> => {
    const res = await fetch(`${BASE_URL}/definitions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch workflow definition');
    return res.json();
  },

  saveDefinition: async (definition: Partial<WorkflowDefinition>): Promise<WorkflowDefinition> => {
    const method = definition.id ? 'PUT' : 'POST';
    const url = definition.id ? `${BASE_URL}/definitions/${definition.id}` : `${BASE_URL}/definitions`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(definition)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to save workflow definition');
    }
    return res.json();
  },

  publishDefinition: async (id: string): Promise<WorkflowDefinition> => {
    const res = await fetch(`${BASE_URL}/definitions/${id}/publish`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to publish workflow');
    }
    return res.json();
  },

  duplicateDefinition: async (id: string): Promise<WorkflowDefinition> => {
    const res = await fetch(`${BASE_URL}/definitions/${id}/duplicate`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to duplicate workflow');
    return res.json();
  },

  deleteDefinition: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/definitions/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete workflow');
  },

  // 3. Approval Inbox & Tasks
  getInbox: async (params: {
    search?: string;
    module?: string;
    priority?: string;
    slaStatus?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<ApprovalTask>> => {
    const qs = new URLSearchParams();
    if (params.search) qs.append('Search', params.search);
    if (params.module && params.module !== 'All') qs.append('Module', params.module);
    if (params.priority && params.priority !== 'All') qs.append('Priority', params.priority);
    if (params.slaStatus && params.slaStatus !== 'All') qs.append('SlaStatus', params.slaStatus);
    if (params.status && params.status !== 'All') qs.append('Status', params.status);
    if (params.page) qs.append('Page', params.page.toString());
    if (params.pageSize) qs.append('PageSize', params.pageSize.toString());

    const res = await fetch(`${BASE_URL}/tasks/inbox?${qs.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch approval inbox');
    return res.json();
  },

  getMyApprovals: async (params: {
    tab: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<ApprovalTask>> => {
    const qs = new URLSearchParams();
    qs.append('tab', params.tab);
    if (params.search) qs.append('Search', params.search);
    if (params.page) qs.append('Page', params.page.toString());
    if (params.pageSize) qs.append('PageSize', params.pageSize.toString());

    const res = await fetch(`${BASE_URL}/tasks/my?${qs.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch approvals');
    return res.json();
  },

  getApprovalDetails: async (requestId: string): Promise<ApprovalDetails> => {
    const res = await fetch(`${BASE_URL}/instances/${requestId}`);
    if (!res.ok) throw new Error('Failed to fetch approval details');
    return res.json();
  },

  processAction: async (params: {
    taskId: string;
    action: 'Approved' | 'Rejected' | 'ChangesRequested' | 'Delegate' | 'Reassign';
    comments: string;
    delegateToUserId?: string;
    delegateToUserName?: string;
    reassignToUserId?: string;
    reassignToUserName?: string;
  }): Promise<ApprovalTask> => {
    const res = await fetch(`${BASE_URL}/tasks/${params.taskId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to process approval action');
    }
    return res.json();
  },

  bulkProcessAction: async (params: {
    taskIds: string[];
    action: 'Approved' | 'Rejected';
    comments: string;
  }): Promise<ApprovalTask[]> => {
    const res = await fetch(`${BASE_URL}/tasks/bulk-action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to process bulk action');
    return res.json();
  },

  // 4. Delegations
  getDelegations: async (): Promise<Delegation[]> => {
    const res = await fetch(`${BASE_URL}/delegations`);
    if (!res.ok) throw new Error('Failed to fetch delegations');
    return res.json();
  },

  createDelegation: async (data: {
    delegatorId: string;
    delegatorName: string;
    delegateeId: string;
    delegateeName: string;
    startDate: string;
    endDate: string;
    reason: string;
    modules: string;
  }): Promise<Delegation> => {
    const res = await fetch(`${BASE_URL}/delegations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create delegation');
    return res.json();
  },

  revokeDelegation: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/delegations/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to revoke delegation');
  },

  // 5. Templates
  getTemplates: async (): Promise<WorkflowTemplate[]> => {
    const res = await fetch(`${BASE_URL}/templates`);
    if (!res.ok) throw new Error('Failed to fetch templates');
    return res.json();
  },

  instantiateTemplate: async (id: string): Promise<WorkflowDefinition> => {
    const res = await fetch(`${BASE_URL}/templates/${id}/instantiate`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to instantiate template');
    return res.json();
  },

  // 6. Reports
  getEscalationsReport: async (module?: string): Promise<WorkflowEscalation[]> => {
    const qs = module && module !== 'All' ? `?module=${module}` : '';
    const res = await fetch(`${BASE_URL}/reports/escalations${qs}`);
    if (!res.ok) throw new Error('Failed to fetch escalations report');
    return res.json();
  },

  getSlaReport: async (module?: string): Promise<any> => {
    const qs = module && module !== 'All' ? `?module=${module}` : '';
    const res = await fetch(`${BASE_URL}/reports/sla${qs}`);
    if (!res.ok) throw new Error('Failed to fetch SLA report');
    return res.json();
  },

  getWorkloadReport: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/reports/workload`);
    if (!res.ok) throw new Error('Failed to fetch workload report');
    return res.json();
  }
};
