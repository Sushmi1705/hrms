// ================================================================
// MSS TypeScript Interfaces
// ================================================================

export interface MssDashboardDto {
  managerName: string;
  designation: string;
  department: string;
  teamSize: number;
  today: string;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  lateToday: number;
  pendingLeaveApprovals: number;
  pendingAttendanceApprovals: number;
  pendingPerformanceReviews: number;
  openHRRequests: number;
  teamAssetsCount: number;
  trainingOverdue: number;
  upcomingBirthdays: number;
  attendanceTrend: AttendanceTrendPoint[];
  leaveTrend: LeaveTrendPoint[];
  teamStatusSnapshot: TeamMemberStatusDto[];
  upcomingEvents: MssCalendarEventDto[];
}

export interface AttendanceTrendPoint { date: string; present: number; absent: number; late: number; onLeave: number; }
export interface LeaveTrendPoint { month: string; approved: number; pending: number; rejected: number; }
export interface TeamMemberStatusDto { employeeId: string; name: string; designation: string; attendanceStatus: string; leaveStatus?: string; }

export interface MssTeamFilterDto { search?: string; department?: string; status?: string; page?: number; pageSize?: number; }

export interface MssTeamPagedDto {
  items: MssTeamMemberDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface MssTeamMemberDto {
  employeeId: string;
  employeeNumber: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  branch: string;
  joiningDate: string;
  status: string;
  attendanceStatus: string;
  leaveStatus: string;
  performanceStatus: string;
  assetCount: number;
  shiftName?: string;
}

export interface MssTeamMemberDetailDto extends MssTeamMemberDto {
  recentAttendance: TeamAttendanceDayDto[];
  recentLeave: MssLeaveRequestDto[];
  performance?: MssPerformanceSummaryDto;
  goals: MssGoalDto[];
  assets: MssTeamAssetDto[];
  training: MssTrainingDto[];
}

export interface TeamDirectoryItemDto {
  employeeId: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  branch: string;
  status: string;
  joiningDate: string;
}

export interface TeamAttendanceDayDto {
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  workingHours: number;
  isLate: boolean;
  isEarlyOut: boolean;
  isMissingPunch: boolean;
  status: string;
  remarks?: string;
}

export interface MssAttendanceRequestDto {
  requestId: string;
  employeeId: string;
  employeeName: string;
  attendanceDate: string;
  requestType: string;
  requestedClockIn?: string;
  requestedClockOut?: string;
  reason: string;
  status: string;
  submittedAt: string;
  managerComments?: string;
}

export interface MssLeaveRequestDto {
  leaveRequestId: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  status: string;
  submittedAt: string;
  approvalComments?: string;
  isHalfDay: boolean;
}

export interface MssPerformanceOverviewDto {
  reviewsPending: number;
  reviewsCompleted: number;
  goalsOnTrack: number;
  goalsAtRisk: number;
  goalsCompleted: number;
  goalsTotal: number;
  pendingReviews: MssReviewItemDto[];
  recentGoals: MssGoalDto[];
  ratingDistribution: RatingDistributionDto[];
}

export interface MssPerformanceSummaryDto {
  goalsTotal: number;
  goalsCompleted: number;
  lastRating?: number;
  reviewStatus: string;
}

export interface MssReviewItemDto {
  reviewId: string;
  employeeId: string;
  employeeName: string;
  reviewCycle: string;
  status: string;
  selfRating?: number;
  managerRating?: number;
  finalRating?: string;
  submittedAt?: string;
  managerReviewedAt?: string;
  managerComments?: string;
}

export interface RatingDistributionDto { rating: string; count: number; }

export interface MssGoalDto {
  goalId: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  goalType: string;
  priority: string;
  weightage: number;
  progressPercentage: number;
  deadline: string;
  status: string;
  comments?: string;
}

export interface CreateMssGoalDto {
  employeeId: string;
  title: string;
  description: string;
  goalType?: string;
  priority?: string;
  weightage?: number;
  deadline: string;
}

export interface MssTrainingDto {
  assignmentId: string;
  employeeId: string;
  employeeName: string;
  courseName: string;
  courseType: string;
  status: string;
  completionPercentage?: number;
  dueDate?: string;
  completedAt?: string;
  isOverdue: boolean;
}

export interface MssTeamAssetDto {
  assetId: string;
  employeeId: string;
  employeeName: string;
  assetTag: string;
  assetName: string;
  category: string;
  status: string;
  condition?: string;
  assignedDate: string;
  expectedReturnDate?: string;
}

export interface MssCompensationDto {
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  payGrade?: string;
  currentCtc: number;
  currency: string;
  status: string;
  lastRevisionDate?: string;
  recommendationStatus?: string;
}

export interface CreateCompRecommendationDto {
  employeeId: string;
  proposedCtc: number;
  increasePercentage: number;
  reason: string;
  comments: string;
}

export interface MssApprovalItemDto {
  approvalId: string;
  category: string;
  employeeId: string;
  employeeName: string;
  description: string;
  status: string;
  priority: string;
  submittedAt: string;
  comments?: string;
}

export interface MssHRRequestDto {
  requestId: string;
  requestNumber: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  submittedAt: string;
  resolvedAt?: string;
  targetEmployeeId?: string;
  targetEmployeeName?: string;
}

export interface CreateMssHRRequestDto {
  category: string;
  subject: string;
  description: string;
  priority: string;
  targetEmployeeId?: string;
}

export interface MssCalendarEventDto {
  type: string;
  title: string;
  date: string;
  endDate?: string;
  employeeId?: string;
  employeeName?: string;
  color?: string;
  navigateTo?: string;
}

export interface MssAnalyticsDto {
  attendanceRate: number;
  absenceRate: number;
  lateRate: number;
  leaveUtilization: number;
  goalCompletionRate: number;
  trainingCompletionRate: number;
  reviewCompletionRate: number;
  attendanceTrend: AttendanceTrendPoint[];
  leaveTrend?: LeaveTrendPoint[];
  byDepartment: HeadcountBreakdownDto[];
  byEmploymentType?: HeadcountBreakdownDto[];
}

export interface HeadcountBreakdownDto { label: string; count: number; }

export interface MssNotificationDto {
  notificationId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  category?: string;
}

export interface MssCompRecommendationDto {
  recommendationId: string;
  employeeId: string;
  employeeName: string;
  proposedCtc: number;
  increasePercentage: number;
  reason: string;
  status: string;
  submittedAt: string;
}
export interface ApproveLeaveDto { approved: boolean; comments?: string; }
export interface ApproveAttendanceDto { approved: boolean; comments?: string; }
export interface SubmitReviewDto { managerComments: string; managerRating: number; finalRating?: string; }
export interface CreateFeedbackDto { employeeId: string; feedbackType: string; comments: string; isPrivate?: boolean; }
export interface UpdateGoalProgressDto { progress: number; comments?: string; }
