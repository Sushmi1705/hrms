export interface WorkflowDashboardAnalytics {
  totalWorkflows: number;
  activeWorkflows: number;
  draftWorkflows: number;
  pendingApprovals: number;
  approvedToday: number;
  rejectedToday: number;
  escalatedApprovals: number;
  overdueApprovals: number;
  failedWorkflows: number;
  averageApprovalTimeHours: number;
  slaSuccessRatePercentage: number;
  approvalTrend: TrendPoint[];
  statusDistribution: StatusCount[];
  volumeByModule: ModuleVolume[];
  slaTrends: SlaTrend[];
  departmentDistribution: DepartmentDistribution[];
  approverWorkload: ApproverWorkload[];
  escalationTrends: EscalationTrend[];
  recentActivities: WorkflowActivity[];
}

export interface TrendPoint {
  period: string;
  approved: number;
  rejected: number;
  pending: number;
  escalated: number;
}

export interface StatusCount {
  status: string;
  count: number;
  percentage: number;
}

export interface ModuleVolume {
  module: string;
  count: number;
  activeWorkflows: number;
}

export interface SlaTrend {
  month: string;
  avgSlaHours: number;
  maxSlaHours: number;
  breachedCount: number;
}

export interface DepartmentDistribution {
  department: string;
  requestCount: number;
  pendingCount: number;
}

export interface ApproverWorkload {
  approverName: string;
  role: string;
  pendingTasks: number;
  completedTasks: number;
  avgResolutionHours: number;
}

export interface EscalationTrend {
  period: string;
  escalatedCount: number;
  resolvedCount: number;
}

export interface WorkflowActivity {
  id: string;
  eventType: string;
  title: string;
  description: string;
  actorName: string;
  module: string;
  status: string;
  timestamp: string;
}

export interface WorkflowDefinition {
  id: string;
  code: string;
  name: string;
  module: string;
  category: string;
  description: string;
  version: number;
  status: 'Draft' | 'Active' | 'Inactive' | 'Archived';
  triggerEvent: string;
  stepsCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  lastUsedAt?: string;
  usageCount: number;
  isActive: boolean;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id?: string;
  workflowDefinitionId?: string;
  stepKey: string;
  stepName: string;
  description?: string;
  orderIndex: number;
  approverType: string;
  approverSelection?: string;
  specificUserId?: string;
  specificRoleName?: string;
  specificDepartmentId?: string;
  approvalMode: string;
  isParallel: boolean;
  parallelGroupId?: string;
  minimumApproversRequired: number;
  timeoutHours: number;
  escalationEnabled: boolean;
  escalateAfterHours: number;
  escalateToType: string;
  escalateToValue?: string;
  allowedActionsJson?: string;
  conditions: WorkflowCondition[];
}

export interface WorkflowCondition {
  id?: string;
  workflowStepId?: string;
  field: string;
  operator: string;
  value: string;
  logic: string;
  orderIndex: number;
}

export interface ApprovalTask {
  id: string;
  approvalRequestId: string;
  requestNumber: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  department: string;
  module: string;
  entityType: string;
  referenceId: string;
  workflowName: string;
  stepName: string;
  orderIndex: number;
  priority: string;
  status: string;
  amount?: number;
  summary: string;
  payloadJson: string;
  submittedAt: string;
  dueDate?: string;
  slaStatus: string;
  assignedUserId: string;
  assignedUserName: string;
  assignedRoleName: string;
  isDelegated: boolean;
  originalApproverName?: string;
  escalationCount: number;
}

export interface ApprovalDetails {
  requestId: string;
  requestNumber: string;
  workflowName: string;
  module: string;
  entityType: string;
  referenceId: string;
  status: string;
  priority: string;
  summary: string;
  amount?: number;
  payloadJson: string;
  submittedAt: string;
  dueDate?: string;
  completedAt?: string;
  slaStatus: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  department: string;
  timelineSteps: ApprovalTimelineStep[];
  activeTask?: ApprovalTask;
  history: ApprovalHistory[];
  comments: ApprovalComment[];
}

export interface ApprovalTimelineStep {
  stepId: string;
  stepName: string;
  orderIndex: number;
  approverType: string;
  assignedToName: string;
  status: string;
  actionDate?: string;
  comments?: string;
}

export interface ApprovalHistory {
  id: string;
  stepName: string;
  actorName: string;
  actorRole: string;
  action: string;
  previousStatus: string;
  newStatus: string;
  comments: string;
  actionDate: string;
}

export interface ApprovalComment {
  id: string;
  userName: string;
  userRole: string;
  commentText: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface Delegation {
  id: string;
  delegatorId: string;
  delegatorName: string;
  delegateeId: string;
  delegateeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  modules: string;
  isActive: boolean;
  isCurrentlyActive: boolean;
}

export interface WorkflowTemplate {
  id: string;
  code: string;
  name: string;
  module: string;
  category: string;
  description: string;
  icon: string;
  structureJson: string;
  usageCount: number;
  isActive: boolean;
}

export interface WorkflowEscalation {
  id: string;
  approvalRequestId: string;
  requestNumber: string;
  module: string;
  originalApproverName: string;
  escalatedToUserName: string;
  escalatedToRole: string;
  escalationLevel: number;
  reason: string;
  escalatedAt: string;
  slaBreachHours: number;
  isResolved: boolean;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
