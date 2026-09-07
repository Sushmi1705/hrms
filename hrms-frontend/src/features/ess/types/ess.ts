export interface EmployeeDashboardData {
  employeeId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  designationTitle: string;
  departmentName: string;
  workLocation: string;
  avatarUrl: string;
  status?: string;
  joiningDate: string;
  todayFormatted: string;

  todayAttendance: WebClockStatus;
  remainingLeaveDays: number;
  attendanceDaysThisMonth: number;
  pendingRequestsCount: number;
  unreadNotificationsCount: number;
  assignedAssetsCount: number;
  nextHolidayName?: string;
  nextHolidayDate?: string;

  upcomingHolidays: HolidayItem[];
  leaveBalances: EssLeaveBalance[];
  recentPayslip?: EssPayslipSummary;
  activeBenefits: ActiveBenefitSummary[];
  assignedAssets: AssignedAssetSummary[];
  pendingRequests: PendingRequestItem[];
  announcements: AnnouncementItem[];
  requiredDocuments: EssDocumentItem[];
  recentActivities: EssActivityItem[];
}

export interface WebClockStatus {
  isClockedIn: boolean;
  clockInTime?: string;
  clockOutTime?: string;
  workedDuration: string;
  workedHours: number;
  isLate: boolean;
  shiftName: string;
  shiftTimings: string;
  status: string;
}

export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  holidayType: string;
  description?: string;
  daysRemaining: number;
}

export interface EssLeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  colorCode: string;
  totalAllocated: number;
  used: number;
  pending: number;
  remaining: number;
  isPaid: boolean;
}

export interface EssLeaveRequest {
  id: string;
  leaveTypeId: string;
  leaveTypeName: string;
  colorCode: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  isHalfDay: boolean;
  halfDayType?: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  createdAt: string;
  approverName?: string;
  approvalComments?: string;
  actionDate?: string;
}

export interface ApplyEssLeavePayload {
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  isHalfDay: boolean;
  halfDayType?: string;
  reason: string;
  emergencyContact?: string;
}

export interface EssPayslipSummary {
  id: string;
  month: string;
  paymentDate: string;
  grossSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  status: string;
  year: number;
}

export interface PayslipComponentItem {
  name: string;
  type: string;
  amount: number;
}

export interface EssPayslipDetail {
  id: string;
  month: string;
  paymentDate: string;
  employeeName: string;
  employeeNumber: string;
  designation: string;
  department: string;
  workLocation: string;
  bankAccountNumber: string;
  bankName: string;
  grossSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  status: string;
  earnings: PayslipComponentItem[];
  deductions: PayslipComponentItem[];
  employerContributions: PayslipComponentItem[];
}

export interface ActiveBenefitSummary {
  id: string;
  planName: string;
  type: string;
  provider: string;
  coverageTier: string;
  employeeMonthlyCost: number;
  employerMonthlyCost: number;
}

export interface AssignedAssetSummary {
  id: string;
  assetTag: string;
  assetName: string;
  categoryName: string;
  serialNumber: string;
  assignedDate: string;
  condition: string;
  isAcknowledged: boolean;
}

export interface PendingRequestItem {
  id: string;
  requestType: string;
  title: string;
  submittedDate: string;
  status: string;
  currentApprover: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  publishedDate: string;
  isPinned: boolean;
  priority: string;
}

export interface EssDocumentItem {
  id: string;
  name: string;
  category: string;
  originalFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  uploadedDate: string;
  isRequired: boolean;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  status: string;
  downloadUrl: string;
}

export interface EssActivityItem {
  type: string;
  description: string;
  timestamp: string;
  status: string;
}

export interface EmployeeProfileData {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  workEmail: string;
  personalEmail: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  avatarUrl: string;

  joiningDate: string;
  status: string;
  employmentType: string;

  departmentId: string;
  departmentName: string;
  designationId: string;
  designationTitle: string;
  branchId: string;
  branchName: string;
  workLocation: string;

  managerId?: string;
  managerName: string;
  managerEmail: string;
  managerDesignation: string;

  emergencyContacts: EmergencyContact[];
  pendingChangeRequests: ProfileChangeRequestItem[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
}

export interface ProfileChangeRequestItem {
  id: string;
  fieldName: string;
  currentValue: string;
  proposedValue: string;
  reason: string;
  status: string;
  createdAt: string;
  approverComments?: string;
}

export interface AttendanceCalendarDay {
  date: string;
  dayOfWeek: string;
  status: string;
  clockInTime?: string;
  clockOutTime?: string;
  clockInFormatted?: string;
  clockOutFormatted?: string;
  workedHours: number;
  isLate: boolean;
  remarks?: string;
}

export interface AttendanceCorrectionItem {
  id: string;
  date: string;
  requestType: string;
  status: string;
  requestedCheckIn?: string;
  requestedCheckOut?: string;
  reason: string;
  createdAt: string;
  approverComments?: string;
}

export interface EssHRRequestItem {
  id: string;
  requestNumber: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  comments: HRRequestCommentItem[];
}

export interface HRRequestCommentItem {
  id: string;
  authorName: string;
  authorRole: string;
  message: string;
  createdAt: string;
}

export interface ColleagueDirectoryItem {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  workEmail: string;
  designation: string;
  department: string;
  location: string;
  avatarUrl: string;
}

export interface WorkScheduleData {
  shiftName: string;
  shiftCode: string;
  startTime: string;
  endTime: string;
  startTimeFormatted: string;
  endTimeFormatted: string;
  graceTimeMinutes: number;
  workingDays: string;
  timeZone: string;
  workLocation: string;
}
