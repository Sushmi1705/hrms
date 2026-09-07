export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface AssetFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  status?: string;
  condition?: string;
  locationId?: string;
  departmentId?: string;
  employeeId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface AssetDto {
  id: string;
  assetTag: string;
  assetName: string;
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  modelId?: string;
  modelName: string;
  manufacturer: string;
  serialNumber: string;
  barcode: string;
  qrCode?: string;
  description: string;
  purchaseDate: string;
  purchasePrice: number;
  currency: string;
  vendorId?: string;
  vendorName: string;
  invoiceNumber: string;
  poNumber: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  status: 'Available' | 'Assigned' | 'UnderMaintenance' | 'Damaged' | 'Lost' | 'Retired' | 'Disposed';
  condition: 'New' | 'Good' | 'Fair' | 'Poor' | 'Damaged';
  locationId?: string;
  locationName: string;
  departmentId?: string;
  departmentName: string;
  currentCustodianEmployeeId?: string;
  currentCustodianName: string;
  currentCustodianEmail: string;
  currentCustodianAvatar?: string;
  usefulLifeMonths: number;
  depreciationMethod: string;
  salvageValue: number;
  currentBookValue: number;
  accumulatedDepreciation: number;
  lastAuditDate?: string;
  nextAuditDate?: string;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface AssetDetailDto extends AssetDto {
  assignments: AssetAssignmentDto[];
  transfers: AssetTransferDto[];
  maintenances: AssetMaintenanceDto[];
  returns: AssetReturnDto[];
  incidents: AssetIncidentDto[];
  warranties: AssetWarrantyDto[];
  disposal?: AssetDisposalDto;
  depreciationSchedule: DepreciationSchedulePointDto[];
}

export interface AssetCategoryDto {
  id: string;
  name: string;
  code: string;
  description: string;
  assetType: string;
  depreciationMethod: string;
  usefulLifeMonths: number;
  requiresSerialNumber: boolean;
  requiresAssignment: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  assetCount: number;
}

export interface AssetModelDto {
  id: string;
  categoryId: string;
  categoryName: string;
  manufacturer: string;
  modelName: string;
  modelNumber: string;
  specifications: string;
  warrantyPeriodMonths: number;
  defaultUsefulLifeMonths: number;
}

export interface AssetLocationDto {
  id: string;
  branchId?: string;
  branchName: string;
  name: string;
  code: string;
  building: string;
  floor: string;
  room: string;
  storageArea: string;
  description: string;
  isActive: boolean;
  assetCount: number;
}

export interface AssetVendorDto {
  id: string;
  vendorName: string;
  vendorCode: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

export interface AssetAssignmentDto {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  departmentName: string;
  locationName: string;
  assignedDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  conditionAtHandover: string;
  accessories: string[];
  handoverNotes: string;
  acknowledgementStatus: 'Pending' | 'Acknowledged' | 'Disputed';
  acknowledgementDate?: string;
  digitalSignature: string;
  assignedBy: string;
  status: 'Active' | 'Returned' | 'Transferred';
}

export interface AssetTransferDto {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  fromEmployeeId?: string;
  fromEmployeeName: string;
  toEmployeeId?: string;
  toEmployeeName: string;
  fromLocationId?: string;
  fromLocationName: string;
  toLocationId?: string;
  toLocationName: string;
  transferDate: string;
  receivedDate?: string;
  initiatedBy: string;
  approvedBy: string;
  reason: string;
  condition: string;
  status: string;
  comments: string;
}

export interface AssetReturnDto {
  id: string;
  returnNumber: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  employeeId: string;
  employeeName: string;
  returnDate: string;
  condition: string;
  accessoriesReturned: string[];
  missingAccessories: string[];
  status: string;
  inspectionNotes: string;
  inspectedBy: string;
  processedBy: string;
  resultingAssetStatus: string;
}

export interface AssetMaintenanceDto {
  id: string;
  maintenanceNumber: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  maintenanceType: 'Preventive' | 'Corrective' | 'Upgrade';
  serviceProvider: string;
  startDate: string;
  completionDate?: string;
  issue: string;
  diagnosis: string;
  workPerformed: string;
  cost: number;
  warrantyCovered: boolean;
  technicianName: string;
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';
}

export interface AssetIncidentDto {
  id: string;
  incidentNumber: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  employeeId?: string;
  employeeName: string;
  incidentType: 'Damage' | 'Lost' | 'Stolen' | 'Malfunction';
  incidentDate: string;
  reportedDate: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  resolution: string;
  estimatedLoss: number;
  status: 'Reported' | 'Investigating' | 'Resolved' | 'Closed';
  resolvedBy: string;
}

export interface AssetDisposalDto {
  id: string;
  disposalNumber: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  disposalDate: string;
  disposalReason: string;
  disposalMethod: string;
  saleValue: number;
  buyerVendorName: string;
  approvedBy: string;
  approvalDate?: string;
  status: string;
  notes: string;
}

export interface AssetWarrantyDto {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  warrantyProvider: string;
  startDate: string;
  endDate: string;
  warrantyType: string;
  coverageDetails: string;
  contractNumber: string;
  supportPhone: string;
  supportEmail: string;
  status: 'Active' | 'ExpiringSoon' | 'Expired';
  daysRemaining: number;
}

export interface DepreciationSchedulePointDto {
  periodMonth: number;
  periodDate: string;
  beginningBookValue: number;
  depreciationAmount: number;
  endingBookValue: number;
  accumulatedDepreciation: number;
}

export interface AssetDepreciationCalculationDto {
  assetId: string;
  assetTag: string;
  assetName: string;
  purchasePrice: number;
  salvageValue: number;
  usefulLifeMonths: number;
  depreciationMethod: string;
  monthlyDepreciation: number;
  annualDepreciation: number;
  currentBookValue: number;
  accumulatedDepreciation: number;
  schedule: DepreciationSchedulePointDto[];
}

export interface AssetAuditDto {
  id: string;
  auditCode: string;
  name: string;
  locationId?: string;
  locationName: string;
  departmentId?: string;
  departmentName: string;
  startDate: string;
  endDate?: string;
  assignedAuditorEmployeeId?: string;
  assignedAuditorName: string;
  status: 'Planned' | 'InProgress' | 'Completed';
  totalAssetsCount: number;
  verifiedCount: number;
  missingCount: number;
  discrepancyCount: number;
  summaryNotes: string;
  items: AssetAuditItemDto[];
}

export interface AssetAuditItemDto {
  id: string;
  auditId: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  expectedLocationName: string;
  actualLocationName: string;
  expectedCustodianName: string;
  actualCustodianName: string;
  expectedCondition: string;
  actualCondition: string;
  status: 'Pending' | 'Verified' | 'Missing' | 'Discrepancy' | 'Damaged';
  discrepancyNotes?: string;
  verificationDate?: string;
  verifiedBy?: string;
  scannedViaQr: boolean;
}

export interface AssetRequestDto {
  id: string;
  requestNumber: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  departmentName: string;
  categoryId: string;
  categoryName: string;
  modelId?: string;
  modelName: string;
  quantity: number;
  reason: string;
  requiredDate: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  status: 'Draft' | 'PendingApproval' | 'Approved' | 'Rejected' | 'Fulfilled' | 'Cancelled';
  approvalRequestId?: string;
  approverComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  allocatedAssetId?: string;
  allocatedAssetTag?: string;
  notes?: string;
  createdAt: string;
}

export interface AssetDashboardMetricsDto {
  totalAssetsCount: number;
  assignedAssetsCount: number;
  availableAssetsCount: number;
  maintenanceAssetsCount: number;
  lostOrDamagedCount: number;
  disposedCount: number;
  totalPurchaseCost: number;
  totalCurrentBookValue: number;
  totalAccumulatedDepreciation: number;
  expiringWarrantiesCount30Days: number;
  pendingRequestsCount: number;
  statusDistribution: { status: string; count: number; percentage: number }[];
  categoryBreakdown: { categoryName: string; count: number; totalValue: number }[];
  locationDistribution: { locationName: string; count: number }[];
  recentActivities: {
    id: string;
    activityType: string;
    assetTag: string;
    assetName: string;
    actor: string;
    description: string;
    timestamp: string;
  }[];
  expiringWarranties: AssetWarrantyDto[];
}

export interface AssetReportDto {
  reportType: string;
  generatedAt: string;
  totalRecords: number;
  columns: string[];
  rows: Record<string, any>[];
  summaryTotals: Record<string, any>;
}
