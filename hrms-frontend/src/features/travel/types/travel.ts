// Travel & Expense Module Types

export interface TravelDashboardDto {
  totalTravelRequests: number;
  pendingApprovals: number;
  activeTrips: number;
  completedTrips: number;
  totalTravelSpend: number;
  pendingExpenseReports: number;
  pendingFinanceReview: number;
  pendingReimbursements: number;
  outstandingAdvances: number;
  policyViolations: number;
  spendByMonth: { month: string; amount: number }[];
  spendByCategory: { category: string; amount: number }[];
  recentRequests: TravelRequestDto[];
}

export interface TravelRequestDto {
  id: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  purpose: string;
  businessJustification: string;
  travelType: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  estimatedCost: number;
  currency: string;
  costCenter: string;
  status: string;
  advanceRequired: boolean;
  advanceAmount?: number;
  notes: string;
  createdAt: string;
}

export interface CreateTravelRequestDto {
  purpose: string;
  businessJustification: string;
  travelType: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  estimatedCost: number;
  currency: string;
  costCenterId?: string;
  advanceRequired: boolean;
  advanceAmount?: number;
  notes: string;
}

export interface TravelFilterDto {
  status?: string;
  travelType?: string;
  employeeId?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface TripDto {
  id: string;
  travelRequestId: string;
  employeeName: string;
  department: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  travelType: string;
  status: string;
  estimatedCost: number;
  actualCost: number;
  currency: string;
  itineraryItems: ItineraryItemDto[];
}

export interface ItineraryItemDto {
  id: string;
  type: string;
  provider: string;
  bookingReference: string;
  origin: string;
  destination: string;
  startDateTime: string;
  endDateTime: string;
  cost: number;
  currency: string;
  notes: string;
}

export interface CreateItineraryItemDto {
  type: string;
  provider: string;
  bookingReference: string;
  origin: string;
  destination: string;
  startDateTime: string;
  endDateTime: string;
  cost: number;
  currency: string;
  notes: string;
}

export interface TravelAdvanceDto {
  id: string;
  employeeName: string;
  employeeCode: string;
  travelRequestId?: string;
  travelDestination: string;
  requestedAmount: number;
  currency: string;
  purpose: string;
  requiredDate: string;
  status: string;
  settledAmount: number;
  balance: number;
  notes: string;
  createdAt: string;
}

export interface CreateTravelAdvanceDto {
  travelRequestId?: string;
  requestedAmount: number;
  currency: string;
  purpose: string;
  requiredDate: string;
  paymentMethod: string;
  notes: string;
}

export interface ExpenseCategoryDto {
  id: string;
  code: string;
  name: string;
  description: string;
  receiptRequired: boolean;
  taxApplicable: boolean;
  policyControlled: boolean;
  isActive: boolean;
}

export interface ExpenseDto {
  id: string;
  employeeName: string;
  categoryName: string;
  categoryId: string;
  tripId?: string;
  expenseReportId?: string;
  expenseDate: string;
  merchant: string;
  description: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  convertedAmount: number;
  paymentMethod: string;
  receiptDocumentId?: string;
  status: string;
  policyStatus: string;
  notes: string;
  createdAt: string;
}

export interface CreateExpenseDto {
  categoryId: string;
  tripId?: string;
  expenseDate: string;
  merchant: string;
  description: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  paymentMethod: string;
  receiptDocumentId?: string;
  notes: string;
}

export interface ExpenseReportDto {
  id: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  tripId?: string;
  tripDestination: string;
  reportNumber: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  currency: string;
  advanceApplied: number;
  reimbursableAmount: number;
  status: string;
  notes: string;
  expenses: ExpenseDto[];
  violationCount: number;
  createdAt: string;
}

export interface CreateExpenseReportDto {
  tripId?: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  currency: string;
  advanceApplied: number;
  expenseIds: string[];
  notes: string;
}

export interface CreateExpenseCategoryDto {
  code: string;
  name: string;
  description: string;
  receiptRequired: boolean;
  taxApplicable: boolean;
  policyControlled: boolean;
}

export interface PolicyRuleDto {
  id: string;
  categoryName: string;
  categoryId?: string;
  ruleType: string;
  maxAmount?: number;
  currency: string;
  conditionValue: string;
  violationSeverity: string;
  isActive: boolean;
}

export interface CreatePolicyRuleDto {
  categoryId?: string;
  ruleType: string;
  maxAmount?: number;
  currency: string;
  conditionValue: string;
  violationSeverity: string;
}

export interface PolicyCheckResult {
  status: string;
  policyLimit?: number;
  submittedAmount?: number;
  variance?: number;
  severity: string;
  message: string;
}

export const TRAVEL_TYPES = ['Domestic', 'International', 'Local', 'Conference', 'Client Visit', 'Training', 'Business Meeting', 'Project', 'Other'];
export const TRAVEL_STATUSES = ['Draft', 'Submitted', 'Approved', 'Rejected', 'Cancelled', 'InProgress', 'Completed'];
export const EXPENSE_STATUSES = ['Draft', 'Submitted', 'Approved', 'Rejected'];
export const REPORT_STATUSES = ['Draft', 'Submitted', 'ManagerReview', 'FinanceReview', 'Approved', 'ReimbursementPending', 'Reimbursed', 'Closed'];
export const ITINERARY_TYPES = ['Flight', 'Hotel', 'Train', 'Car Rental', 'Taxi', 'Bus', 'Ferry', 'Other'];
export const PAYMENT_METHODS = ['Personal', 'CorporateCard', 'Cash', 'Bank', 'Other'];
