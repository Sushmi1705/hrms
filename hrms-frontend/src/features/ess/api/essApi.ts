import { apiClient } from '../../../lib/api';
import {
  EmployeeDashboardData,
  EmployeeProfileData,
  EmergencyContact,
  ProfileChangeRequestItem,
  AttendanceCalendarDay,
  AttendanceCorrectionItem,
  EssLeaveBalance,
  EssLeaveRequest,
  ApplyEssLeavePayload,
  EssPayslipSummary,
  EssPayslipDetail,
  EssDocumentItem,
  EssHRRequestItem,
  HRRequestCommentItem,
  ColleagueDirectoryItem,
  HolidayItem,
  WorkScheduleData,
  AnnouncementItem,
  PendingRequestItem,
  WebClockStatus
} from '../types/ess';

export const essApi = {
  // ==========================================
  // 1. Dashboard
  // ==========================================
  getDashboard: async (): Promise<EmployeeDashboardData> => {
    const res = await apiClient.get<EmployeeDashboardData>('/me/dashboard');
    return res.data;
  },

  // ==========================================
  // 2. Profile & Contacts
  // ==========================================
  getProfile: async (): Promise<EmployeeProfileData> => {
    const res = await apiClient.get<EmployeeProfileData>('/me/profile');
    return res.data;
  },

  updateContact: async (payload: { phoneNumber: string; personalEmail: string; address: string }) => {
    const res = await apiClient.put('/me/profile', payload);
    return res.data;
  },

  submitProfileChangeRequest: async (payload: { fieldName: string; proposedValue: string; reason: string }): Promise<ProfileChangeRequestItem> => {
    const res = await apiClient.post<ProfileChangeRequestItem>('/me/profile/change-request', payload);
    return res.data;
  },

  getEmergencyContacts: async (): Promise<EmergencyContact[]> => {
    const res = await apiClient.get<EmergencyContact[]>('/me/emergency-contacts');
    return res.data;
  },

  createEmergencyContact: async (payload: { name: string; relationship: string; phoneNumber: string; email?: string; address?: string; isPrimary: boolean }): Promise<EmergencyContact> => {
    const res = await apiClient.post<EmergencyContact>('/me/emergency-contacts', payload);
    return res.data;
  },

  deleteEmergencyContact: async (id: string) => {
    const res = await apiClient.delete(`/me/emergency-contacts/${id}`);
    return res.data;
  },

  // ==========================================
  // 3. Attendance & Web Clock
  // ==========================================
  getAttendance: async (month?: number, year?: number): Promise<{ employeeId: string; month: number; year: number; todayStatus: WebClockStatus; calendar: AttendanceCalendarDay[] }> => {
    const res = await apiClient.get('/me/attendance', { params: { month, year } });
    return res.data;
  },

  clockIn: async (payload?: { location?: string; device?: string; notes?: string }) => {
    const res = await apiClient.post<{ success: boolean; message: string; status: WebClockStatus }>('/me/attendance/clock-in', payload || {});
    return res.data;
  },

  clockOut: async (payload?: { location?: string; device?: string; notes?: string }) => {
    const res = await apiClient.post<{ success: boolean; message: string; status: WebClockStatus }>('/me/attendance/clock-out', payload || {});
    return res.data;
  },

  getAttendanceRequests: async (): Promise<AttendanceCorrectionItem[]> => {
    const res = await apiClient.get<AttendanceCorrectionItem[]>('/me/attendance/requests');
    return res.data;
  },

  submitAttendanceCorrection: async (payload: { date: string; requestType: string; requestedCheckIn?: string; requestedCheckOut?: string; reason: string }): Promise<AttendanceCorrectionItem> => {
    const res = await apiClient.post<AttendanceCorrectionItem>('/me/attendance/requests', payload);
    return res.data;
  },

  // ==========================================
  // 4. Leave Management
  // ==========================================
  getLeaveBalances: async (year?: number): Promise<EssLeaveBalance[]> => {
    const res = await apiClient.get<EssLeaveBalance[]>('/me/leave-balances', { params: { year } });
    return res.data;
  },

  getLeaveRequests: async (): Promise<EssLeaveRequest[]> => {
    const res = await apiClient.get<EssLeaveRequest[]>('/me/leaves');
    return res.data;
  },

  applyLeave: async (payload: ApplyEssLeavePayload): Promise<EssLeaveRequest> => {
    const res = await apiClient.post<EssLeaveRequest>('/me/leaves', payload);
    return res.data;
  },

  cancelLeave: async (id: string) => {
    const res = await apiClient.post(`/me/leaves/${id}/cancel`);
    return res.data;
  },

  // ==========================================
  // 5. Payroll & Payslips
  // ==========================================
  getPayslips: async (year?: number): Promise<EssPayslipSummary[]> => {
    const res = await apiClient.get<EssPayslipSummary[]>('/me/payslips', { params: { year } });
    return res.data;
  },

  getPayslipDetail: async (id: string): Promise<EssPayslipDetail> => {
    const res = await apiClient.get<EssPayslipDetail>(`/me/payslips/${id}`);
    return res.data;
  },

  // ==========================================
  // 6. Documents & Policies
  // ==========================================
  getDocuments: async (): Promise<EssDocumentItem[]> => {
    const res = await apiClient.get<EssDocumentItem[]>('/me/documents');
    return res.data;
  },

  acknowledgeDocument: async (documentId: string) => {
    const res = await apiClient.post('/me/documents/acknowledge', { documentId });
    return res.data;
  },

  requestDocument: async (payload: { documentType: string; purpose: string; requiredDate: string; comments?: string }) => {
    const res = await apiClient.post('/me/documents/request', payload);
    return res.data;
  },

  // ==========================================
  // 7. Centralized HR Service Desk Requests
  // ==========================================
  getHRRequests: async (status?: string, category?: string): Promise<EssHRRequestItem[]> => {
    const res = await apiClient.get<EssHRRequestItem[]>('/me/requests', { params: { status, category } });
    return res.data;
  },

  getHRRequestById: async (id: string): Promise<EssHRRequestItem> => {
    const res = await apiClient.get<EssHRRequestItem>(`/me/requests/${id}`);
    return res.data;
  },

  createHRRequest: async (payload: { category: string; subject: string; description: string; priority: string }): Promise<EssHRRequestItem> => {
    const res = await apiClient.post<EssHRRequestItem>('/me/requests', payload);
    return res.data;
  },

  addHRRequestComment: async (id: string, message: string): Promise<HRRequestCommentItem> => {
    const res = await apiClient.post<HRRequestCommentItem>(`/me/requests/${id}/comments`, { message });
    return res.data;
  },

  // ==========================================
  // 8. Holidays, Schedule, Directory, Announcements
  // ==========================================
  getHolidays: async (year?: number): Promise<HolidayItem[]> => {
    const res = await apiClient.get<HolidayItem[]>('/me/holidays', { params: { year } });
    return res.data;
  },

  getSchedule: async (): Promise<WorkScheduleData> => {
    const res = await apiClient.get<WorkScheduleData>('/me/schedule');
    return res.data;
  },

  getDirectory: async (search?: string, departmentId?: string): Promise<ColleagueDirectoryItem[]> => {
    const res = await apiClient.get<ColleagueDirectoryItem[]>('/me/directory', { params: { search, departmentId } });
    return res.data;
  },

  getAnnouncements: async (): Promise<AnnouncementItem[]> => {
    const res = await apiClient.get<AnnouncementItem[]>('/me/announcements');
    return res.data;
  },

  getNotifications: async (): Promise<PendingRequestItem[]> => {
    const res = await apiClient.get<PendingRequestItem[]>('/me/notifications');
    return res.data;
  },

  markNotificationRead: async (id: string) => {
    const res = await apiClient.post(`/me/notifications/${id}/read`);
    return res.data;
  }
};
