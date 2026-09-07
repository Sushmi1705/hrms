import { apiClient } from '../../../lib/api';
import type {
  TravelDashboardDto,
  TravelRequestDto,
  CreateTravelRequestDto,
  TravelFilterDto,
  TripDto,
  CreateItineraryItemDto,
  ItineraryItemDto,
  TravelAdvanceDto,
  CreateTravelAdvanceDto,
  ExpenseCategoryDto,
  CreateExpenseCategoryDto,
  ExpenseDto,
  CreateExpenseDto,
  ExpenseReportDto,
  CreateExpenseReportDto,
  PolicyRuleDto,
  CreatePolicyRuleDto,
  PolicyCheckResult,
} from '../types/travel';

// Use shared apiClient instead of standalone axios

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getTravelDashboard = async (): Promise<TravelDashboardDto> =>
  (await apiClient.get('/travel/dashboard')).data;

// ─── Travel Requests ──────────────────────────────────────────────────────────
export const getTravelRequests = async (filter?: TravelFilterDto): Promise<TravelRequestDto[]> =>
  (await apiClient.get('/travel/requests', { params: filter })).data;

export const getTravelRequest = async (id: string): Promise<TravelRequestDto> =>
  (await apiClient.get(`/travel/requests/${id}`)).data;

export const createTravelRequest = async (dto: CreateTravelRequestDto): Promise<TravelRequestDto> =>
  (await apiClient.post('/travel/requests', dto)).data;

export const updateTravelRequest = async (id: string, dto: CreateTravelRequestDto): Promise<TravelRequestDto> =>
  (await apiClient.put(`/travel/requests/${id}`, dto)).data;

export const submitTravelRequest = async (id: string): Promise<void> =>
  (await apiClient.post(`/travel/requests/${id}/submit`)).data;

export const approveTravelRequest = async (id: string, approved: boolean, comments?: string): Promise<void> =>
  (await apiClient.post(`/travel/requests/${id}/approve`, { approved, comments })).data;

export const cancelTravelRequest = async (id: string): Promise<void> =>
  (await apiClient.post(`/travel/requests/${id}/cancel`)).data;

// ─── Trips ────────────────────────────────────────────────────────────────────
export const getTrips = async (): Promise<TripDto[]> =>
  (await apiClient.get('/travel/trips')).data;

export const getTrip = async (id: string): Promise<TripDto> =>
  (await apiClient.get(`/travel/trips/${id}`)).data;

export const addItineraryItem = async (tripId: string, dto: CreateItineraryItemDto): Promise<ItineraryItemDto> =>
  (await apiClient.post(`/travel/trips/${tripId}/itinerary`, dto)).data;

// ─── Advances ─────────────────────────────────────────────────────────────────
export const getTravelAdvances = async (): Promise<TravelAdvanceDto[]> =>
  (await apiClient.get('/travel/advances')).data;

export const createTravelAdvance = async (dto: CreateTravelAdvanceDto): Promise<TravelAdvanceDto> =>
  (await apiClient.post('/travel/advances', dto)).data;

export const approveTravelAdvance = async (id: string, approved: boolean, comments?: string): Promise<void> =>
  (await apiClient.post(`/travel/advances/${id}/approve`, { approved, comments })).data;

// ─── Expense Categories ───────────────────────────────────────────────────────
export const getExpenseCategories = async (): Promise<ExpenseCategoryDto[]> =>
  (await apiClient.get('/expenses/categories')).data;

export const createExpenseCategory = async (dto: Omit<ExpenseCategoryDto, 'id' | 'isActive'>): Promise<ExpenseCategoryDto> =>
  (await apiClient.post('/expenses/categories', dto)).data;

// ─── Expenses ─────────────────────────────────────────────────────────────────
export const getExpenses = async (tripId?: string): Promise<ExpenseDto[]> =>
  (await apiClient.get('/expenses', { params: tripId ? { tripId } : {} })).data;

export const getExpense = async (id: string): Promise<ExpenseDto> =>
  (await apiClient.get(`/expenses/${id}`)).data;

export const createExpense = async (dto: CreateExpenseDto): Promise<ExpenseDto> =>
  (await apiClient.post('/expenses', dto)).data;

export const updateExpense = async (id: string, dto: CreateExpenseDto): Promise<ExpenseDto> =>
  (await apiClient.put(`/expenses/${id}`, dto)).data;

export const deleteExpense = async (id: string): Promise<void> =>
  (await apiClient.delete(`/expenses/${id}`)).data;

export const checkExpensePolicy = async (categoryId: string, amount: number, currency = 'USD'): Promise<PolicyCheckResult> =>
  (await apiClient.get('/expenses/policy/check', { params: { categoryId, amount, currency } })).data;

// ─── Expense Reports ──────────────────────────────────────────────────────────
export const getExpenseReports = async (status?: string): Promise<ExpenseReportDto[]> =>
  (await apiClient.get('/expenses/reports', { params: status ? { status } : {} })).data;

export const getExpenseReport = async (id: string): Promise<ExpenseReportDto> =>
  (await apiClient.get(`/expenses/reports/${id}`)).data;

export const createExpenseReport = async (dto: CreateExpenseReportDto): Promise<ExpenseReportDto> =>
  (await apiClient.post('/expenses/reports', dto)).data;

export const submitExpenseReport = async (id: string): Promise<void> =>
  (await apiClient.post(`/expenses/reports/${id}/submit`)).data;

export const approveExpenseReport = async (id: string, approved: boolean, comments?: string): Promise<void> =>
  (await apiClient.post(`/expenses/reports/${id}/approve`, { approved, comments })).data;

// ─── Policy ───────────────────────────────────────────────────────────────────
export const getPolicyRules = async (): Promise<PolicyRuleDto[]> =>
  (await apiClient.get('/expenses/policy/rules')).data;

export const createPolicyRule = async (dto: CreatePolicyRuleDto): Promise<PolicyRuleDto> =>
  (await apiClient.post('/expenses/policy/rules', dto)).data;
