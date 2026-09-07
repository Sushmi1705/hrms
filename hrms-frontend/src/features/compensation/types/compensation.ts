export interface CompensationComponent {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'Earnings' | 'Deduction' | 'EmployerContribution' | 'EmployeeContribution' | 'Benefit';
  calculationType: 'FixedAmount' | 'Percentage';
  defaultValue?: number;
  percentage?: number;
  basedOnComponentId?: string;
  isTaxable: boolean;
  isPensionable: boolean;
  isRecurring: boolean;
  isActive: boolean;
}

export interface PayGrade {
  id: string;
  code: string;
  name: string;
  level: number;
  minimumSalary: number;
  midpointSalary: number;
  maximumSalary: number;
  currency: string;
  description?: string;
  employeeCount?: number;
}

export interface SalaryBand {
  id: string;
  payGradeId: string;
  gradeCode?: string;
  bandName: string;
  minimum: number;
  midpoint: number;
  maximum: number;
  country: string;
  locationId?: string;
  locationName?: string;
  isActive: boolean;
}

export interface ComponentAssignment {
  componentId: string;
  componentCode: string;
  componentName: string;
  componentType: string;
  calculationType: string;
  percentage?: number;
  amount: number;
  calculatedMonthlyAmount: number;
  calculatedAnnualAmount: number;
}

export interface EmployeeCompensation {
  id: string;
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  departmentName: string;
  designationTitle: string;
  payGradeId?: string;
  gradeCode: string;
  gradeName: string;
  salaryBandId?: string;
  bandName: string;
  bandMin: number;
  bandMidpoint: number;
  bandMax: number;
  baseSalary: number;
  currency: string;
  annualTotalCompensation: number;
  monthlyTotalCompensation: number;
  compaRatio: number;
  compaRatioStatus: 'BelowRange' | 'WithinRange' | 'AboveRange';
  effectiveDate: string;
  endDate?: string;
  isCurrent: boolean;
  status: string;
}

export interface CompensationHistory {
  id: string;
  employeeId: string;
  previousSalary: number;
  newSalary: number;
  increaseAmount: number;
  percentageIncrease: number;
  previousGradeCode: string;
  newGradeCode: string;
  effectiveDate: string;
  changeType: string;
  reason: string;
  initiatedBy: string;
  approvedBy: string;
  approvalDate?: string;
  comments?: string;
}

export interface EmployeeCompensationDetail extends EmployeeCompensation {
  assignments: ComponentAssignment[];
  history: CompensationHistory[];
}

export interface SalaryRevision {
  id: string;
  revisionNumber: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  currentSalary: number;
  proposedSalary: number;
  increaseAmount: number;
  percentageIncrease: number;
  effectiveDate: string;
  reason: string;
  comments: string;
  status: 'Submitted' | 'Approved' | 'Rejected';
  workflowRequestId?: string;
  approverComments?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface EmployeeBonus {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  bonusType: string;
  amount: number;
  targetAmount?: number;
  achievementPercentage?: number;
  currency: string;
  effectiveDate: string;
  paymentDate?: string;
  reason: string;
  status: string;
  approvedBy?: string;
  isPayrollProcessed: boolean;
}

export interface CompensationReviewCycle {
  id: string;
  cycleName: string;
  fiscalYear: number;
  startDate: string;
  endDate: string;
  effectiveDate: string;
  totalBudget: number;
  allocatedBudget: number;
  usedBudget: number;
  status: string;
  guidelines?: string;
  itemCount: number;
}

export interface CompensationReviewItem {
  id: string;
  reviewCycleId: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  designationTitle: string;
  currentSalary: number;
  currentCompaRatio: number;
  proposedSalary: number;
  proposedIncreasePercentage: number;
  proposedIncreaseAmount: number;
  newCompaRatio: number;
  managerRecommendation: string;
  managerComments: string;
  status: string;
}

export interface BenefitPlan {
  id: string;
  planCode: string;
  planName: string;
  type: string;
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  employeeMonthlyCost: number;
  employerMonthlyCost: number;
  contributionType: string;
  employerMatchPercentage?: number;
  employerMatchLimit?: number;
  allowsDependents: boolean;
  isActive: boolean;
  enrolledEmployeesCount?: number;
}

export interface BenefitEnrollment {
  id: string;
  enrollmentNumber: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  benefitPlanId: string;
  planName: string;
  planType: string;
  provider: string;
  coverageTier: 'EmployeeOnly' | 'EmployeeSpouse' | 'EmployeeChildren' | 'Family';
  employeeMonthlyContribution: number;
  employerMonthlyContribution: number;
  totalMonthlyPremium: number;
  enrollmentDate: string;
  effectiveDate: string;
  renewalDate?: string;
  status: string;
}

export interface EmployeeDependent {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  nationalId: string;
  contactPhone?: string;
  verificationStatus: string;
}

export interface TotalRewardsStatement {
  employeeId: string;
  employeeNumber?: string;
  employeeName: string;
  departmentName: string;
  designationTitle: string;
  gradeName?: string;
  joiningDate?: string;
  currency?: string;
  baseSalaryAnnual?: number;
  baseSalaryMonthly?: number;
  baseSalary?: number;
  annualBaseSalary?: number;
  annualAllowances?: number;
  totalAllowancesAnnual?: number;
  totalAllowancesMonthly?: number;
  annualBonuses?: number;
  totalBonusesAnnual?: number;
  employerMedicalBenefitAnnual?: number;
  employerDentalVisionAnnual?: number;
  employerRetirementMatchAnnual?: number;
  employerOtherBenefitsAnnual?: number;
  totalEmployerBenefitsAnnual?: number;
  employerHealthBenefitsCost?: number;
  employerRetirementContribution?: number;
  totalRewardsValue?: number;
  totalRewardsValueAnnual?: number;
  totalRewardsValueMonthly?: number;
  breakdown?: Array<{ category: string; amount: number; percentage: number }>;
}

export interface CompensationDashboardMetrics {
  totalEmployees?: number;
  totalActiveEmployees?: number;
  totalCompensationCost?: number;
  totalAnnualCompensationSpend?: number;
  monthlyPayrollProjection?: number;
  averageBaseSalary: number;
  totalAllowances?: number;
  totalBonuses?: number;
  employerBenefitCost?: number;
  employeeBenefitCost?: number;
  activeBenefitPlans?: number;
  employeesEnrolledInBenefits?: number;
  activeBenefitEnrollmentsCount?: number;
  pendingCompensationApprovals?: number;
  pendingSalaryRevisionsCount?: number;
  pendingBenefitEnrollments?: number;
  upcomingCompensationReviews?: number;
  openReviewCyclesCount?: number;
  overallCompaRatio?: number;
  activeBonusDisbursementsYtd?: number;
  departmentCostBreakdown?: Array<{ departmentName: string; totalCost: number; averageSalary: number; employeeCount: number }>;
  departmentCompensation?: Array<{ departmentName: string; totalSpend: number; employeeCount: number; averageCompaRatio: number }>;
  salaryDistribution?: Array<{ rangeLabel: string; count: number }>;
  payGradeBreakdown?: Array<{ gradeCode: string; gradeName: string; minimumSalary: number; midpointSalary: number; maximumSalary: number; averageActualSalary: number; employeeCount: number }>;
  gradeDistribution?: Array<{ gradeCode: string; gradeName: string; employeeCount: number; averageBaseSalary: number; compaRatio: number }>;
  compaRatioBands?: Array<{ band: string; count: number }>;
  contributionTrends?: Array<{ month: string; employerCost: number; employeeCost: number }>;
  spendByCategory?: Array<{ category: string; amount: number }>;
}

export interface CompensationFilterParams {
  search?: string;
  departmentId?: string;
  payGradeId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
