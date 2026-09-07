import { apiClient } from '../../../lib/api';
import {
  AssetDto,
  AssetDetailDto,
  AssetCategoryDto,
  AssetModelDto,
  AssetLocationDto,
  AssetVendorDto,
  AssetWarrantyDto,
  AssetAuditDto,
  AssetReportDto,
  AssetDepreciationCalculationDto,
  AssetDashboardMetricsDto,
  AssetRequestDto,
  AssetFilterParams,
  PagedResult
} from '../types/asset';

export const assetApi = {
  // 1. Dashboard & Inventory
  getDashboard: async (filters?: { companyId?: string; branchId?: string; departmentId?: string }) => {
    const res = await apiClient.get<AssetDashboardMetricsDto>('/assets/dashboard', { params: filters });
    return res.data;
  },

  getInventory: async () => {
    const res = await apiClient.get<any[]>('/assets/inventory');
    return res.data;
  },

  // 2. Asset Core CRUD
  getAssets: async (params?: AssetFilterParams) => {
    const res = await apiClient.get<PagedResult<AssetDto>>('/assets', { params });
    return res.data;
  },

  getAssetById: async (id: string) => {
    const res = await apiClient.get<AssetDetailDto>(`/assets/${id}`);
    return res.data;
  },

  createAsset: async (payload: any) => {
    const res = await apiClient.post<AssetDto>('/assets', payload);
    return res.data;
  },

  updateAsset: async (id: string, payload: any) => {
    const res = await apiClient.put<AssetDto>(`/assets/${id}`, payload);
    return res.data;
  },

  deleteAsset: async (id: string) => {
    const res = await apiClient.delete(`/assets/${id}`);
    return res.data;
  },

  // 3. Taxonomies
  getCategories: async () => {
    const res = await apiClient.get<AssetCategoryDto[]>('/assets/categories');
    return res.data;
  },

  createCategory: async (payload: any) => {
    const res = await apiClient.post<AssetCategoryDto>('/assets/categories', payload);
    return res.data;
  },

  getModels: async (categoryId?: string) => {
    const res = await apiClient.get<AssetModelDto[]>('/assets/models', { params: { categoryId } });
    return res.data;
  },

  createModel: async (payload: any) => {
    const res = await apiClient.post<AssetModelDto>('/assets/models', payload);
    return res.data;
  },

  getLocations: async () => {
    const res = await apiClient.get<AssetLocationDto[]>('/assets/locations');
    return res.data;
  },

  createLocation: async (payload: any) => {
    const res = await apiClient.post<AssetLocationDto>('/assets/locations', payload);
    return res.data;
  },

  getVendors: async () => {
    const res = await apiClient.get<AssetVendorDto[]>('/assets/vendors');
    return res.data;
  },

  createVendor: async (payload: any) => {
    const res = await apiClient.post<AssetVendorDto>('/assets/vendors', payload);
    return res.data;
  },

  getWarranties: async (days: number = 30) => {
    const res = await apiClient.get<AssetWarrantyDto[]>('/assets/warranties', { params: { days } });
    return res.data;
  },

  // 4. Lifecycle Actions
  assignAsset: async (id: string, payload: {
    employeeId: string;
    departmentId?: string;
    locationId?: string;
    expectedReturnDate?: string;
    conditionAtHandover: string;
    accessories: string[];
    handoverNotes?: string;
  }) => {
    const res = await apiClient.post(`/assets/${id}/assign`, payload);
    return res.data;
  },

  transferAsset: async (id: string, payload: {
    toEmployeeId?: string;
    toDepartmentId?: string;
    toLocationId?: string;
    reason: string;
    condition: string;
    comments?: string;
  }) => {
    const res = await apiClient.post(`/assets/${id}/transfer`, payload);
    return res.data;
  },

  returnAsset: async (id: string, payload: {
    condition: string;
    resultingAssetStatus: string;
    inspectionNotes: string;
    accessoriesReturned: string[];
    missingAccessories: string[];
  }) => {
    const res = await apiClient.post(`/assets/${id}/return`, payload);
    return res.data;
  },

  scheduleMaintenance: async (id: string, payload: {
    maintenanceType: string;
    serviceProvider: string;
    startDate: string;
    issue: string;
    cost: number;
    warrantyCovered: boolean;
    technicianName?: string;
  }) => {
    const res = await apiClient.post(`/assets/${id}/maintenance`, payload);
    return res.data;
  },

  completeMaintenance: async (maintenanceId: string, payload: { cost: number; workPerformed: string }) => {
    const res = await apiClient.post(`/assets/maintenance/${maintenanceId}/complete`, payload);
    return res.data;
  },

  reportIncident: async (id: string, payload: {
    incidentType: string;
    incidentDate: string;
    severity: string;
    description: string;
    estimatedLoss: number;
    resolution?: string;
  }) => {
    const res = await apiClient.post(`/assets/${id}/incident`, payload);
    return res.data;
  },

  disposeAsset: async (id: string, payload: {
    disposalReason: string;
    disposalMethod: string;
    saleValue: number;
    buyerVendorName?: string;
    notes?: string;
  }) => {
    const res = await apiClient.post(`/assets/${id}/dispose`, payload);
    return res.data;
  },

  getQrCode: async (id: string) => {
    const res = await apiClient.get(`/assets/${id}/qr`);
    return res.data;
  },

  acknowledgeAssignment: async (assignmentId: string, payload: { digitalSignature: string; comments?: string }) => {
    const res = await apiClient.post(`/assets/assignments/${assignmentId}/acknowledge`, payload);
    return res.data;
  },

  // 5. Bulk Operations
  bulkUpdateStatus: async (assetIds: string[], status: string, notes?: string) => {
    const res = await apiClient.post('/assets/bulk-status', { assetIds, status, notes });
    return res.data;
  },

  bulkTransfer: async (assetIds: string[], toLocationId?: string, toDepartmentId?: string, reason?: string) => {
    const res = await apiClient.post('/assets/bulk-transfer', { assetIds, toLocationId, toDepartmentId, reason });
    return res.data;
  },

  // 6. Audits
  getAudits: async () => {
    const res = await apiClient.get<AssetAuditDto[]>('/assets/audits');
    return res.data;
  },

  getAuditById: async (id: string) => {
    const res = await apiClient.get<AssetAuditDto>(`/assets/audits/${id}`);
    return res.data;
  },

  createAudit: async (payload: any) => {
    const res = await apiClient.post<AssetAuditDto>('/assets/audits', payload);
    return res.data;
  },

  verifyAuditItem: async (itemId: string, payload: {
    status: string;
    actualLocationId?: string;
    actualCustodianEmployeeId?: string;
    actualCondition?: string;
    discrepancyNotes?: string;
    scannedViaQr: boolean;
  }) => {
    const res = await apiClient.post(`/assets/audits/items/${itemId}/verify`, payload);
    return res.data;
  },

  // 7. Reports & Financials
  getReport: async (filter: {
    reportType: string;
    categoryId?: string;
    departmentId?: string;
    locationId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const res = await apiClient.get<AssetReportDto>('/assets/reports', { params: filter });
    return res.data;
  },

  exportReportCsv: (filter: any) => {
    const query = new URLSearchParams(filter).toString();
    window.open(`http://localhost:5002/api/v1/assets/reports/export?${query}`, '_blank');
  },

  calculateDepreciation: async (id: string) => {
    const res = await apiClient.get<AssetDepreciationCalculationDto>(`/assets/depreciation/calculate/${id}`);
    return res.data;
  },

  // 8. Self Service & Manager Portals
  getMyAssets: async (employeeId?: string) => {
    const res = await apiClient.get<AssetDto[]>('/assets/my', { params: { employeeId } });
    return res.data;
  },

  getTeamAssets: async (managerId?: string) => {
    const res = await apiClient.get<AssetDto[]>('/assets/team', { params: { managerId } });
    return res.data;
  },

  // 9. Requisitions & Workflow
  getAssetRequests: async (params?: { page?: number; pageSize?: number; status?: string; employeeId?: string }) => {
    const res = await apiClient.get<PagedResult<AssetRequestDto>>('/asset-requests', { params });
    return res.data;
  },

  getMyRequests: async (employeeId?: string, page: number = 1, pageSize: number = 10) => {
    const res = await apiClient.get<PagedResult<AssetRequestDto>>('/asset-requests/my', {
      params: { employeeId, page, pageSize }
    });
    return res.data;
  },

  getAssetRequestById: async (id: string) => {
    const res = await apiClient.get<AssetRequestDto>(`/asset-requests/${id}`);
    return res.data;
  },

  createAssetRequest: async (payload: {
    categoryId: string;
    modelId?: string;
    quantity: number;
    reason: string;
    requiredDate: string;
    priority: string;
    notes?: string;
  }, employeeId?: string) => {
    const res = await apiClient.post<AssetRequestDto>('/asset-requests', payload, {
      params: { employeeId }
    });
    return res.data;
  },

  processAssetRequestAction: async (id: string, payload: {
    action: 'Approve' | 'Reject';
    approverComments?: string;
    allocatedAssetId?: string;
  }) => {
    const res = await apiClient.post(`/asset-requests/${id}/action`, payload);
    return res.data;
  }
};
