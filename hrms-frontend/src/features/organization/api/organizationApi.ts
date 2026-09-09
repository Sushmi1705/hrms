import { apiClient } from '@/lib/api';
import {
  Company,
  BusinessUnit,
  Branch,
  Location,
  Department,
  Designation,
  JobGrade,
  CostCenter,
  OrganizationHierarchyData,
  OrgEntityType
} from '../types/organization';

export const organizationApi = {
  // 1. Hierarchy & Mindmap Tree
  getHierarchy: async (): Promise<OrganizationHierarchyData> => {
    const { data } = await apiClient.get<OrganizationHierarchyData>('/organization/hierarchy');
    return data;
  },

  // 2. Companies
  getCompanies: async (): Promise<Company[]> => {
    const { data } = await apiClient.get<Company[]>('/Company');
    return data;
  },
  createCompany: async (payload: { code: string; name: string; description?: string }): Promise<{ id: string }> => {
    const { data } = await apiClient.post('/Company', payload);
    return data;
  },
  updateCompany: async (id: string, payload: { code: string; name: string; description?: string }): Promise<void> => {
    await apiClient.put(`/Company/${id}`, { id, ...payload });
  },
  deleteCompany: async (id: string): Promise<void> => {
    await apiClient.delete(`/Company/${id}`);
  },

  // 3. Business Units
  getBusinessUnits: async (): Promise<BusinessUnit[]> => {
    const { data } = await apiClient.get<BusinessUnit[]>('/BusinessUnit');
    return data;
  },
  createBusinessUnit: async (payload: { code: string; name: string; companyId?: string }): Promise<{ id: string }> => {
    const { data } = await apiClient.post('/BusinessUnit', payload);
    return data;
  },
  updateBusinessUnit: async (id: string, payload: { code: string; name: string; companyId?: string }): Promise<void> => {
    await apiClient.put(`/BusinessUnit/${id}`, { id, ...payload });
  },
  deleteBusinessUnit: async (id: string): Promise<void> => {
    await apiClient.delete(`/BusinessUnit/${id}`);
  },

  // 4. Branches
  getBranches: async (): Promise<Branch[]> => {
    const { data } = await apiClient.get<Branch[]>('/Branch');
    return data;
  },
  createBranch: async (payload: { code: string; name: string; businessUnitId?: string }): Promise<{ id: string }> => {
    const { data } = await apiClient.post('/Branch', payload);
    return data;
  },
  updateBranch: async (id: string, payload: { code: string; name: string; businessUnitId?: string }): Promise<void> => {
    await apiClient.put(`/Branch/${id}`, { id, ...payload });
  },
  deleteBranch: async (id: string): Promise<void> => {
    await apiClient.delete(`/Branch/${id}`);
  },

  // 5. Locations
  getLocations: async (): Promise<Location[]> => {
    const { data } = await apiClient.get<Location[]>('/Location');
    return data;
  },
  createLocation: async (payload: { code: string; name: string; branchId?: string; address?: string }): Promise<{ id: string }> => {
    const { data } = await apiClient.post('/Location', payload);
    return data;
  },
  updateLocation: async (id: string, payload: { code: string; name: string; branchId?: string; address?: string }): Promise<void> => {
    await apiClient.put(`/Location/${id}`, { id, ...payload });
  },
  deleteLocation: async (id: string): Promise<void> => {
    await apiClient.delete(`/Location/${id}`);
  },

  // 6. Departments
  getDepartments: async (): Promise<Department[]> => {
    const { data } = await apiClient.get<Department[]>('/Department');
    return data;
  },
  createDepartment: async (payload: { code: string; name: string; branchId?: string }): Promise<{ id: string }> => {
    const { data } = await apiClient.post('/Department', payload);
    return data;
  },
  updateDepartment: async (id: string, payload: { code: string; name: string; branchId?: string }): Promise<void> => {
    await apiClient.put(`/Department/${id}`, { id, ...payload });
  },
  deleteDepartment: async (id: string): Promise<void> => {
    await apiClient.delete(`/Department/${id}`);
  },

  // 7. Designations
  getDesignations: async (): Promise<Designation[]> => {
    const { data } = await apiClient.get<Designation[]>('/Designation');
    return data;
  },
  createDesignation: async (payload: { code: string; name: string; departmentId?: string }): Promise<{ id: string }> => {
    const { data } = await apiClient.post('/Designation', payload);
    return data;
  },
  updateDesignation: async (id: string, payload: { code: string; name: string; departmentId?: string }): Promise<void> => {
    await apiClient.put(`/Designation/${id}`, { id, ...payload });
  },
  deleteDesignation: async (id: string): Promise<void> => {
    await apiClient.delete(`/Designation/${id}`);
  },

  // 8. Job Grades
  getJobGrades: async (): Promise<JobGrade[]> => {
    const { data } = await apiClient.get<JobGrade[]>('/JobGrade');
    return data;
  },
  createJobGrade: async (payload: { code: string; name: string; level: number }): Promise<{ id: string }> => {
    const { data } = await apiClient.post('/JobGrade', payload);
    return data;
  },
  updateJobGrade: async (id: string, payload: { code: string; name: string; level: number }): Promise<void> => {
    await apiClient.put(`/JobGrade/${id}`, { id, ...payload });
  },
  deleteJobGrade: async (id: string): Promise<void> => {
    await apiClient.delete(`/JobGrade/${id}`);
  },

  // 9. Cost Centers
  getCostCenters: async (): Promise<CostCenter[]> => {
    const { data } = await apiClient.get<CostCenter[]>('/CostCenter');
    return data;
  },
  createCostCenter: async (payload: { code: string; name: string; businessUnitId?: string }): Promise<{ id: string }> => {
    const { data } = await apiClient.post('/CostCenter', payload);
    return data;
  },
  updateCostCenter: async (id: string, payload: { code: string; name: string; businessUnitId?: string }): Promise<void> => {
    await apiClient.put(`/CostCenter/${id}`, { id, ...payload });
  },
  deleteCostCenter: async (id: string): Promise<void> => {
    await apiClient.delete(`/CostCenter/${id}`);
  }
};
