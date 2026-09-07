import { apiClient } from '../../../lib/api';
import {
  CompensationComponent,
  PayGrade,
  SalaryBand,
  EmployeeCompensation,
  EmployeeCompensationDetail,
  SalaryRevision,
  EmployeeBonus,
  CompensationReviewCycle,
  CompensationReviewItem,
  BenefitPlan,
  BenefitEnrollment,
  EmployeeDependent,
  TotalRewardsStatement,
  CompensationDashboardMetrics,
  CompensationFilterParams,
  PagedResult
} from '../types/compensation';

export const compensationApi = {
  // ==========================================
  // 1. Dashboard & Analytics
  // ==========================================
  getDashboard: async (): Promise<CompensationDashboardMetrics> => {
    const res = await apiClient.get<CompensationDashboardMetrics>('/compensation/dashboard');
    return res.data;
  },

  // ==========================================
  // 2. Salary Components
  // ==========================================
  getComponents: async (): Promise<CompensationComponent[]> => {
    const res = await apiClient.get<CompensationComponent[]>('/compensation/components');
    return res.data;
  },

  createComponent: async (data: Partial<CompensationComponent>): Promise<CompensationComponent> => {
    const res = await apiClient.post<CompensationComponent>('/compensation/components', data);
    return res.data;
  },

  updateComponent: async (id: string, data: Partial<CompensationComponent>): Promise<CompensationComponent> => {
    const res = await apiClient.put<CompensationComponent>(`/compensation/components/${id}`, data);
    return res.data;
  },

  deleteComponent: async (id: string): Promise<void> => {
    await apiClient.delete(`/compensation/components/${id}`);
  },

  // ==========================================
  // 3. Pay Grades & Salary Bands
  // ==========================================
  getPayGrades: async (): Promise<PayGrade[]> => {
    const res = await apiClient.get<PayGrade[]>('/compensation/grades');
    return res.data;
  },

  createPayGrade: async (data: Partial<PayGrade>): Promise<PayGrade> => {
    const res = await apiClient.post<PayGrade>('/compensation/grades', data);
    return res.data;
  },

  getSalaryBands: async (payGradeId?: string): Promise<SalaryBand[]> => {
    const res = await apiClient.get<SalaryBand[]>('/compensation/bands', {
      params: { payGradeId }
    });
    return res.data;
  },

  createSalaryBand: async (data: Partial<SalaryBand>): Promise<SalaryBand> => {
    const res = await apiClient.post<SalaryBand>('/compensation/bands', data);
    return res.data;
  },

  // ==========================================
  // 4. Employee Compensation
  // ==========================================
  getEmployeeCompensations: async (params?: CompensationFilterParams): Promise<PagedResult<EmployeeCompensation>> => {
    const res = await apiClient.get<PagedResult<EmployeeCompensation>>('/compensation/employees', { params });
    return res.data;
  },

  getEmployeeCompensationDetail: async (id: string): Promise<EmployeeCompensationDetail> => {
    const res = await apiClient.get<EmployeeCompensationDetail>(`/compensation/employees/${id}`);
    return res.data;
  },

  upsertEmployeeCompensation: async (data: {
    employeeId: string;
    payGradeId?: string;
    salaryBandId?: string;
    baseSalary: number;
    effectiveDate: string;
    reason?: string;
    components?: Array<{ componentId: string; amount?: number; percentage?: number }>;
  }): Promise<EmployeeCompensation> => {
    const res = await apiClient.post<EmployeeCompensation>('/compensation/employees', data);
    return res.data;
  },

  // ==========================================
  // 5. Salary Revisions
  // ==========================================
  getSalaryRevisions: async (status?: string, page: number = 1, pageSize: number = 20): Promise<PagedResult<SalaryRevision>> => {
    const res = await apiClient.get<PagedResult<SalaryRevision>>('/compensation/revisions', {
      params: { status, page, pageSize }
    });
    return res.data;
  },

  createSalaryRevision: async (data: {
    employeeId: string;
    proposedSalary: number;
    effectiveDate: string;
    reason: string;
    comments?: string;
  }): Promise<SalaryRevision> => {
    const res = await apiClient.post<SalaryRevision>('/compensation/revisions', data);
    return res.data;
  },

  processSalaryRevisionAction: async (id: string, action: 'Approve' | 'Reject', approverComments?: string): Promise<SalaryRevision> => {
    const res = await apiClient.post<SalaryRevision>(`/compensation/revisions/${id}/action`, {
      action,
      approverComments
    });
    return res.data;
  },

  // ==========================================
  // 6. Bonuses
  // ==========================================
  getBonuses: async (employeeId?: string): Promise<EmployeeBonus[]> => {
    const res = await apiClient.get<EmployeeBonus[]>('/compensation/bonuses', {
      params: { employeeId }
    });
    return res.data;
  },

  createBonus: async (data: {
    employeeId: string;
    bonusType: string;
    amount: number;
    targetAmount?: number;
    achievementPercentage?: number;
    effectiveDate: string;
    paymentDate?: string;
    reason: string;
  }): Promise<EmployeeBonus> => {
    const res = await apiClient.post<EmployeeBonus>('/compensation/bonuses', data);
    return res.data;
  },

  // ==========================================
  // 7. Merit Review Cycles
  // ==========================================
  getReviewCycles: async (): Promise<CompensationReviewCycle[]> => {
    const res = await apiClient.get<CompensationReviewCycle[]>('/compensation/reviews');
    return res.data;
  },

  createReviewCycle: async (data: {
    cycleName: string;
    fiscalYear: number;
    totalBudget: number;
    startDate: string;
    endDate: string;
    effectiveDate: string;
  }): Promise<CompensationReviewCycle> => {
    const res = await apiClient.post<CompensationReviewCycle>('/compensation/reviews', data);
    return res.data;
  },

  getReviewItems: async (cycleId: string): Promise<CompensationReviewItem[]> => {
    const res = await apiClient.get<CompensationReviewItem[]>(`/compensation/reviews/${cycleId}/items`);
    return res.data;
  },

  updateReviewItem: async (itemId: string, data: {
    proposedSalary: number;
    managerRecommendation: string;
    managerComments: string;
  }): Promise<CompensationReviewItem> => {
    const res = await apiClient.put<CompensationReviewItem>(`/compensation/reviews/items/${itemId}`, data);
    return res.data;
  },

  // ==========================================
  // 8. Self-Service & Manager
  // ==========================================
  getMyCompensation: async (employeeId?: string): Promise<TotalRewardsStatement> => {
    const res = await apiClient.get<TotalRewardsStatement>('/compensation/my-compensation', {
      params: { employeeId }
    });
    return res.data;
  },

  getTeamCompensation: async (managerEmployeeId?: string): Promise<EmployeeCompensation[]> => {
    const res = await apiClient.get<EmployeeCompensation[]>('/compensation/team', {
      params: { managerEmployeeId }
    });
    return res.data;
  },

  // ==========================================
  // 9. Benefits
  // ==========================================
  getBenefitPlans: async (): Promise<BenefitPlan[]> => {
    const res = await apiClient.get<BenefitPlan[]>('/benefits/plans');
    return res.data;
  },

  createBenefitPlan: async (data: Partial<BenefitPlan>): Promise<BenefitPlan> => {
    const res = await apiClient.post<BenefitPlan>('/benefits/plans', data);
    return res.data;
  },

  getBenefitEnrollments: async (employeeId?: string): Promise<BenefitEnrollment[]> => {
    const res = await apiClient.get<BenefitEnrollment[]>('/benefits/enrollments', {
      params: { employeeId }
    });
    return res.data;
  },

  createBenefitEnrollment: async (data: {
    employeeId: string;
    benefitPlanId: string;
    coverageTier: string;
    effectiveDate: string;
    coveredDependentIds?: string[];
  }): Promise<BenefitEnrollment> => {
    const res = await apiClient.post<BenefitEnrollment>('/benefits/enrollments', data);
    return res.data;
  },

  getDependents: async (employeeId: string): Promise<EmployeeDependent[]> => {
    const res = await apiClient.get<EmployeeDependent[]>('/benefits/dependents', {
      params: { employeeId }
    });
    return res.data;
  },

  createDependent: async (data: Partial<EmployeeDependent>): Promise<EmployeeDependent> => {
    const res = await apiClient.post<EmployeeDependent>('/benefits/dependents', data);
    return res.data;
  },

  getMyBenefits: async (employeeId?: string): Promise<{
    employeeId: string;
    enrolledBenefits: BenefitEnrollment[];
    eligiblePlans: BenefitPlan[];
    dependents: EmployeeDependent[];
  }> => {
    const res = await apiClient.get('/benefits/my-benefits', {
      params: { employeeId }
    });
    return res.data;
  },

  // ==========================================
  // 10. Reports CSV Export
  // ==========================================
  downloadReportCsv: async (reportType: string): Promise<void> => {
    const response = await apiClient.get('/compensation/reports', {
      params: { reportType },
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
