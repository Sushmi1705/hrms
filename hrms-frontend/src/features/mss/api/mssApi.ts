import axios from "axios";
import type {
  MssDashboardDto, MssTeamPagedDto, MssTeamFilterDto, MssTeamMemberDetailDto,
  TeamDirectoryItemDto, TeamAttendanceDayDto, MssAttendanceRequestDto,
  MssLeaveRequestDto, MssPerformanceOverviewDto, MssGoalDto, CreateMssGoalDto,
  UpdateGoalProgressDto, SubmitReviewDto, CreateFeedbackDto, MssTrainingDto,
  MssTeamAssetDto, MssCompensationDto, CreateCompRecommendationDto, MssCompRecommendationDto,
  MssApprovalItemDto, MssHRRequestDto, CreateMssHRRequestDto, MssCalendarEventDto,
  MssAnalyticsDto, MssNotificationDto
} from "../types/mss";

import { apiClient as api } from "../../../lib/api";

// Dashboard
export const getDashboard = (): Promise<MssDashboardDto> =>
  api.get("/mss/dashboard").then(r => r.data);

// Team
export const getTeam = (filter?: MssTeamFilterDto): Promise<MssTeamPagedDto> =>
  api.get("/mss/team", { params: filter }).then(r => r.data);

export const getTeamDirectory = (search?: string): Promise<TeamDirectoryItemDto[]> =>
  api.get("/mss/team/directory", { params: { search } }).then(r => r.data);

export const getTeamMember = (employeeId: string): Promise<MssTeamMemberDetailDto> =>
  api.get(`/team/${employeeId}`).then(r => r.data);

// Attendance
export const getTeamAttendance = (month?: number, year?: number, employeeId?: string): Promise<TeamAttendanceDayDto[]> =>
  api.get("/mss/team/attendance", { params: { month, year, employeeId } }).then(r => r.data);

export const getAttendanceRequests = (status?: string): Promise<MssAttendanceRequestDto[]> =>
  api.get("/mss/attendance-requests", { params: { status } }).then(r => r.data);

export const approveAttendanceRequest = (requestId: string, comments?: string) =>
  api.post(`/attendance-requests/${requestId}/approve`, { approved: true, comments });

export const rejectAttendanceRequest = (requestId: string, comments?: string) =>
  api.post(`/attendance-requests/${requestId}/reject`, { approved: false, comments });

// Leave
export const getTeamLeave = (status?: string, employeeId?: string): Promise<MssLeaveRequestDto[]> =>
  api.get("/mss/team/leave", { params: { status, employeeId } }).then(r => r.data);

export const approveLeave = (leaveId: string, comments?: string) =>
  api.post(`/leave-requests/${leaveId}/approve`, { approved: true, comments });

export const rejectLeave = (leaveId: string, comments?: string) =>
  api.post(`/leave-requests/${leaveId}/reject`, { approved: false, comments });

// Performance
export const getTeamPerformance = (): Promise<MssPerformanceOverviewDto> =>
  api.get("/mss/performance").then(r => r.data);

export const getTeamGoals = (employeeId?: string): Promise<MssGoalDto[]> =>
  api.get("/mss/goals", { params: { employeeId } }).then(r => r.data);

export const createGoal = (dto: CreateMssGoalDto): Promise<MssGoalDto> =>
  api.post("/mss/goals", dto).then(r => r.data);

export const updateGoalProgress = (goalId: string, dto: UpdateGoalProgressDto) =>
  api.put(`/goals/${goalId}/progress`, dto);

export const submitReview = (reviewId: string, dto: SubmitReviewDto) =>
  api.post(`/reviews/${reviewId}/submit`, dto);

export const submitFeedback = (dto: CreateFeedbackDto) =>
  api.post("/mss/feedback", dto);

// Training
export const getTeamTraining = (): Promise<MssTrainingDto[]> =>
  api.get("/mss/training").then(r => r.data);

// Assets
export const getTeamAssets = (): Promise<MssTeamAssetDto[]> =>
  api.get("/mss/assets").then(r => r.data);

// Compensation
export const getTeamCompensation = (): Promise<MssCompensationDto[]> =>
  api.get("/mss/compensation").then(r => r.data);

export const submitCompRecommendation = (dto: CreateCompRecommendationDto): Promise<MssCompRecommendationDto> =>
  api.post("/mss/compensation/recommendations", dto).then(r => r.data);

// Approvals
export const getManagerApprovals = (category?: string): Promise<MssApprovalItemDto[]> =>
  api.get("/mss/approvals", { params: { category } }).then(r => r.data);

// HR Requests
export const getManagerRequests = (status?: string): Promise<MssHRRequestDto[]> =>
  api.get("/mss/requests", { params: { status } }).then(r => r.data);

export const createManagerRequest = (dto: CreateMssHRRequestDto): Promise<MssHRRequestDto> =>
  api.post("/mss/requests", dto).then(r => r.data);

// Calendar, Analytics, Notifications
export const getTeamCalendar = (month?: number, year?: number): Promise<MssCalendarEventDto[]> =>
  api.get("/mss/team/calendar", { params: { month, year } }).then(r => r.data);

export const getTeamAnalytics = (): Promise<MssAnalyticsDto> =>
  api.get("/mss/analytics").then(r => r.data);

export const getManagerNotifications = (): Promise<MssNotificationDto[]> =>
  api.get("/mss/notifications").then(r => r.data);
