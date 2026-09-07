import { apiClient } from '../../../lib/api';

export interface TrendDataPoint {
  period: string;
  value: number;
  secondaryValue?: number;
}

export interface CategoryDataPoint {
  category: string;
  value: number;
}

export interface InsightItemDto {
  id: string;
  type: 'positive' | 'warning' | 'negative' | 'info';
  title: string;
  description: string;
  category: string;
  impact: 'High' | 'Medium' | 'Low';
  actionText: string;
  actionUrl?: string;
}

export interface ActionItemDto {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  count: number;
  actionUrl: string;
  dueDate?: string;
}

export interface ExecutiveDashboardDto {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  exits: number;
  turnoverRate: number;
  
  attendanceRate: number;
  absenceRate: number;
  lateCheckIns: number;
  earlyCheckOuts: number;

  totalLeaveRequests: number;
  approvedLeaves: number;
  pendingLeaves: number;
  leaveUtilizationRate: number;

  payrollCost: number;
  grossPayroll: number;
  netPayroll: number;
  benefitsCost: number;

  openPositions: number;
  applicants: number;
  interviews: number;
  offers: number;
  hired: number;

  travelSpend: number;

  headcountTrend: TrendDataPoint[];
  departmentDistribution: CategoryDataPoint[];
  payrollTrend: TrendDataPoint[];
  attendanceTrend: TrendDataPoint[];
  recruitmentFunnel: CategoryDataPoint[];
  leaveTypeDistribution: CategoryDataPoint[];

  insights: InsightItemDto[];
  actionItems: ActionItemDto[];
}

export interface RecruitmentAnalyticsDto {
  totalRequisitions: number;
  openPositions: number;
  totalCandidates: number;
  totalApplications: number;
  offersExtended: number;
  hiresCompleted: number;
  offerAcceptanceRate: number;
  timeToHireDays: number;
  funnelByStage: CategoryDataPoint[];
  openingsByDepartment: CategoryDataPoint[];
  applicationsTrend: TrendDataPoint[];
}

export interface PerformanceAnalyticsDto {
  totalReviews: number;
  completedReviews: number;
  pendingReviews: number;
  averageCompanyRating: number;
  ratingDistribution: CategoryDataPoint[];
  performanceByDepartment: CategoryDataPoint[];
  goalCompletionRates: CategoryDataPoint[];
}

export interface TrainingAnalyticsDto {
  totalCourses: number;
  totalEnrollments: number;
  completedCourses: number;
  completionRate: number;
  averageHoursPerEmployee: number;
  popularCourses: CategoryDataPoint[];
  enrollmentsByDepartment: CategoryDataPoint[];
}

export interface AssetAnalyticsDto {
  totalAssets: number;
  assignedAssets: number;
  availableAssets: number;
  underMaintenance: number;
  lostOrDamaged: number;
  totalAssetValue: number;
  pendingReturns: number;
  assetsByCategory: CategoryDataPoint[];
  assetsByDepartment: CategoryDataPoint[];
  assetsByStatus: CategoryDataPoint[];
}

export interface BenefitsAnalyticsDto {
  totalBenefitsCost: number;
  enrollmentRate: number;
  employeesEnrolled: number;
  totalPlans: number;
  averageBenefitPerEmployee: number;
  costByBenefitType: CategoryDataPoint[];
  enrollmentsByPlan: CategoryDataPoint[];
  benefitsCostTrend: TrendDataPoint[];
}

export interface ExpenseAnalyticsDto {
  totalSpend: number;
  travelSpend: number;
  expenseSpend: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  spendByDepartment: CategoryDataPoint[];
  spendByCategory: CategoryDataPoint[];
  monthlySpendTrend: TrendDataPoint[];
}

export interface FilterOptionItem {
  id: string;
  name: string;
  code?: string;
}

export interface FilterOptionsDto {
  companies: FilterOptionItem[];
  businessUnits: FilterOptionItem[];
  departments: FilterOptionItem[];
  branches: FilterOptionItem[];
  locations: FilterOptionItem[];
  employmentTypes: string[];
}

export interface SavedReportDto {
  id: string;
  name: string;
  description?: string;
  dataSource: string;
  configuration: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedReportDto {
  name: string;
  description?: string;
  dataSource: string;
  configuration: string;
  visibility: string;
}

export interface CustomReportRequestDto {
  dataSource: string;
  fields: string[];
  filters?: { field: string; operator: string; value: string }[];
  groupBy?: string[];
  aggregationType?: string;
  aggregationField?: string;
  visualizationType?: string;
  page?: number;
  pageSize?: number;
}

export interface CustomReportResultDto {
  columns: string[];
  rows: Record<string, any>[];
  totalCount: number;
  page: number;
  pageSize: number;
  aggregationResult?: number;
}

export interface ReportFilterParams {
  period?: string;
  departmentId?: string;
  branchId?: string;
  locationId?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
}

export const reportsApi = {
  getExecutiveDashboard: async (filters?: ReportFilterParams): Promise<ExecutiveDashboardDto> => {
    const response = await apiClient.get('/Reports/dashboard', { params: filters });
    return response.data;
  },

  getWorkforceAnalytics: async (filters?: ReportFilterParams): Promise<any> => {
    const response = await apiClient.get('/Reports/workforce', { params: filters });
    return response.data;
  },

  getAttendanceAnalytics: async (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    const response = await apiClient.get('/Reports/attendance', { params });
    return response.data;
  },

  getLeaveAnalytics: async (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    const response = await apiClient.get('/Reports/leave', { params });
    return response.data;
  },

  getPayrollAnalytics: async (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    const response = await apiClient.get('/Reports/payroll', { params });
    return response.data;
  },

  getRecruitmentAnalytics: async (): Promise<RecruitmentAnalyticsDto> => {
    const response = await apiClient.get('/Reports/recruitment');
    return response.data;
  },

  getPerformanceAnalytics: async (): Promise<PerformanceAnalyticsDto> => {
    const response = await apiClient.get('/Reports/performance');
    return response.data;
  },

  getTrainingAnalytics: async (): Promise<TrainingAnalyticsDto> => {
    const response = await apiClient.get('/Reports/training');
    return response.data;
  },

  getAssetAnalytics: async (params?: { departmentId?: string }): Promise<AssetAnalyticsDto> => {
    const response = await apiClient.get('/Reports/assets', { params });
    return response.data;
  },

  getBenefitsAnalytics: async (): Promise<BenefitsAnalyticsDto> => {
    const response = await apiClient.get('/Reports/benefits');
    return response.data;
  },

  getExpenseAnalytics: async (): Promise<ExpenseAnalyticsDto> => {
    const response = await apiClient.get('/Reports/expenses');
    return response.data;
  },

  getFilterOptions: async (): Promise<FilterOptionsDto> => {
    const response = await apiClient.get('/Reports/filter-options');
    return response.data;
  },

  getSavedReports: async (): Promise<SavedReportDto[]> => {
    const response = await apiClient.get('/Reports/saved');
    return response.data;
  },

  createSavedReport: async (dto: CreateSavedReportDto): Promise<SavedReportDto> => {
    const response = await apiClient.post('/Reports/saved', dto);
    return response.data;
  },

  deleteSavedReport: async (id: string): Promise<void> => {
    await apiClient.delete(`/Reports/saved/${id}`);
  },

  executeCustomReport: async (req: CustomReportRequestDto): Promise<CustomReportResultDto> => {
    const response = await apiClient.post('/Reports/custom', req);
    return response.data;
  }
};

