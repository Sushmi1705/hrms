using Microsoft.EntityFrameworkCore;
using HRMS.Domain.Entities.Auth;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Learning;
using HRMS.Domain.Entities.Tenant;
using HRMS.Domain.Entities.Asset;
using HRMS.Domain.Entities.Compensation;
using HRMS.Domain.Entities.Reports;
using System.Reflection;

namespace HRMS.Persistence;

public class HrmsDbContext : DbContext
{
    public HrmsDbContext(DbContextOptions<HrmsDbContext> options) : base(options)
    {
    }

    // SaaS Multi-Tenant Core
    public DbSet<Tenant> Tenants { get; set; } = null!;
    public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; } = null!;
    public DbSet<TenantSubscription> TenantSubscriptions { get; set; } = null!;
    public DbSet<PlanFeature> PlanFeatures { get; set; } = null!;
    public DbSet<TenantFeatureOverride> TenantFeatureOverrides { get; set; } = null!;
    public DbSet<TenantSetting> TenantSettings { get; set; } = null!;
    public DbSet<TenantDomain> TenantDomains { get; set; } = null!;
    public DbSet<TenantUsageSnapshot> TenantUsageSnapshots { get; set; } = null!;
    public DbSet<TenantImpersonationLog> TenantImpersonationLogs { get; set; } = null!;
    public DbSet<TenantDeletionRequest> TenantDeletionRequests { get; set; } = null!;
    public DbSet<TenantSecurityPolicy> TenantSecurityPolicies { get; set; } = null!;
    public DbSet<TenantBranding> TenantBrandings { get; set; } = null!;

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<UserRole> UserRoles { get; set; } = null!;
    public DbSet<Session> Sessions { get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
    public DbSet<PasswordHistory> PasswordHistories { get; set; } = null!;
    public DbSet<AppPermission> AppPermissions { get; set; } = null!;
    public DbSet<RolePermission> RolePermissions { get; set; } = null!;
    public DbSet<UserPermission> UserPermissions { get; set; } = null!;
    public DbSet<SystemSetting> SystemSettings { get; set; } = null!;
    public DbSet<SecurityPolicy> SecurityPolicies { get; set; } = null!;
    public DbSet<EmailConfiguration> EmailConfigurations { get; set; } = null!;
    public DbSet<FeatureFlag> FeatureFlags { get; set; } = null!;
    public DbSet<HolidayCalendar> HolidayCalendars { get; set; } = null!;
    public DbSet<HolidayCalendarDay> HolidayCalendarDays { get; set; } = null!;
    public DbSet<BackgroundJobInfo> BackgroundJobInfos { get; set; } = null!;

    public DbSet<Company> Companies { get; set; } = null!;
    public DbSet<BusinessUnit> BusinessUnits { get; set; } = null!;
    public DbSet<Branch> Branches { get; set; } = null!;
    public DbSet<Location> Locations { get; set; } = null!;
    public DbSet<Department> Departments { get; set; } = null!;
    public DbSet<Designation> Designations { get; set; } = null!;
    public DbSet<JobGrade> JobGrades { get; set; } = null!;
    public DbSet<CostCenter> CostCenters { get; set; }
    public DbSet<HRMS.Domain.Entities.Employee.EmployeeEntity> Employees { get; set; } = null!;
    
    // Attendance Module
    public DbSet<HRMS.Domain.Entities.Attendance.AttendanceLog> AttendanceLogs { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Attendance.Shift> Shifts { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Attendance.Holiday> Holidays { get; set; } = null!;

    // Document Management System
    public DbSet<HRMS.Domain.Entities.Document.DocumentRecord> Documents { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Document.DocumentVersion> DocumentVersions { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Document.DocumentCategory> DocumentCategories { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Document.DocumentFolder> DocumentFolders { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Document.DocumentTag> DocumentTags { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Document.DocumentShare> DocumentShares { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Document.DocumentPermission> DocumentPermissions { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Document.DocumentRequest> DocumentRequests { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Document.DocumentRequestItem> DocumentRequestItems { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Document.DocumentAcknowledgement> DocumentAcknowledgements { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Document.DocumentComment> DocumentComments { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Document.DocumentActivity> DocumentActivities { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Document.DocumentRetentionPolicy> DocumentRetentionPolicies { get; set; } = null!;

    public DbSet<HRMS.Domain.Entities.Attendance.Overtime> Overtimes { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Attendance.Permission> Permissions { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Attendance.AttendanceBreak> AttendanceBreaks { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Attendance.AttendanceApproval> AttendanceApprovals { get; set; } = null!;

    // Leave Module
    public DbSet<HRMS.Domain.Entities.Leave.LeaveType> LeaveTypes { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Leave.LeavePolicy> LeavePolicies { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Leave.LeaveBalance> LeaveBalances { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Leave.LeaveRequest> LeaveRequests { get; set; } = null!;

    // Shift & Roster Management Module
    public DbSet<HRMS.Domain.Entities.Shift.ShiftMaster> ShiftMasters { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Shift.EmployeeShiftAssignment> EmployeeShiftAssignments { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Shift.ShiftChangeRequest> ShiftChangeRequests { get; set; } = null!;

    // Performance Management Module
    public DbSet<HRMS.Domain.Entities.Performance.ReviewCycle> ReviewCycles { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Performance.Goal> Goals { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Performance.PerformanceReview> PerformanceReviews { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Performance.Feedback360> Feedbacks360 { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Performance.CompetencyAssessment> CompetencyAssessments { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Performance.PerformanceImprovementPlan> PerformanceImprovementPlans { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Performance.PromotionRecommendation> PromotionRecommendations { get; set; } = null!;

    // Payroll Management Module
    public DbSet<HRMS.Domain.Entities.Payroll.SalaryStructure> SalaryStructures { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Payroll.SalaryComponent> SalaryComponents { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Payroll.EmployeeSalary> EmployeeSalaries { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Payroll.PayrollRun> PayrollRuns { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Payroll.Payslip> Payslips { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Payroll.PayslipComponent> PayslipComponents { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Payroll.Loan> Loans { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Payroll.Reimbursement> Reimbursements { get; set; } = null!;

    // Recruitment & ATS Module
    public DbSet<HRMS.Domain.Entities.Recruitment.JobRequisition> JobRequisitions { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Recruitment.JobOpening> JobOpenings { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Recruitment.Candidate> Candidates { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Recruitment.JobApplication> JobApplications { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Recruitment.Interview> Interviews { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Recruitment.JobOffer> JobOffers { get; set; } = null!;

    // Onboarding Module
    public DbSet<HRMS.Domain.Entities.Onboarding.OnboardingTask> OnboardingTasks { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Onboarding.EmployeeDocument> EmployeeDocuments { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Onboarding.BackgroundVerification> BackgroundVerifications { get; set; } = null!;

    // Offboarding Module
    public DbSet<HRMS.Domain.Entities.Offboarding.Resignation> Resignations { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Offboarding.ExitClearance> ExitClearances { get; set; } = null!;
    public DbSet<HRMS.Domain.Entities.Offboarding.ExitInterview> ExitInterviews { get; set; } = null!;

    // Learning Management System (LMS) Module
    public DbSet<Course> Courses { get; set; } = null!;
    public DbSet<CourseResource> CourseResources { get; set; } = null!;
    public DbSet<CourseAssignment> CourseAssignments { get; set; } = null!;
    public DbSet<LearningPath> LearningPaths { get; set; } = null!;
    public DbSet<LearningPathCourse> LearningPathCourses { get; set; } = null!;
    public DbSet<Trainer> Trainers { get; set; } = null!;
    public DbSet<ClassroomSession> ClassroomSessions { get; set; } = null!;
    public DbSet<ClassroomAttendance> ClassroomAttendances { get; set; } = null!;
    public DbSet<Assessment> Assessments => Set<Assessment>();
    public DbSet<AssessmentQuestion> AssessmentQuestions => Set<AssessmentQuestion>();
    public DbSet<Certification> Certifications => Set<Certification>();
    public DbSet<SkillMatrix> SkillMatrices => Set<SkillMatrix>();
    
    // Workflow Engine
    public DbSet<HRMS.Domain.Entities.Workflow.WorkflowDefinition> WorkflowDefinitions => Set<HRMS.Domain.Entities.Workflow.WorkflowDefinition>();
    public DbSet<HRMS.Domain.Entities.Workflow.WorkflowVersion> WorkflowVersions => Set<HRMS.Domain.Entities.Workflow.WorkflowVersion>();
    public DbSet<HRMS.Domain.Entities.Workflow.WorkflowStep> WorkflowSteps => Set<HRMS.Domain.Entities.Workflow.WorkflowStep>();
    public DbSet<HRMS.Domain.Entities.Workflow.WorkflowCondition> WorkflowConditions => Set<HRMS.Domain.Entities.Workflow.WorkflowCondition>();
    public DbSet<HRMS.Domain.Entities.Workflow.WorkflowAction> WorkflowActions => Set<HRMS.Domain.Entities.Workflow.WorkflowAction>();
    public DbSet<HRMS.Domain.Entities.Workflow.ApprovalRequest> ApprovalRequests => Set<HRMS.Domain.Entities.Workflow.ApprovalRequest>();
    public DbSet<HRMS.Domain.Entities.Workflow.ApprovalTask> ApprovalTasks => Set<HRMS.Domain.Entities.Workflow.ApprovalTask>();
    public DbSet<HRMS.Domain.Entities.Workflow.ApprovalHistory> ApprovalHistories => Set<HRMS.Domain.Entities.Workflow.ApprovalHistory>();
    public DbSet<HRMS.Domain.Entities.Workflow.WorkflowTemplate> WorkflowTemplates => Set<HRMS.Domain.Entities.Workflow.WorkflowTemplate>();
    public DbSet<HRMS.Domain.Entities.Workflow.Delegation> Delegations => Set<HRMS.Domain.Entities.Workflow.Delegation>();
    public DbSet<HRMS.Domain.Entities.Workflow.EscalationRule> EscalationRules => Set<HRMS.Domain.Entities.Workflow.EscalationRule>();
    public DbSet<HRMS.Domain.Entities.Workflow.WorkflowEscalation> WorkflowEscalations => Set<HRMS.Domain.Entities.Workflow.WorkflowEscalation>();
    public DbSet<HRMS.Domain.Entities.Workflow.ApprovalComment> ApprovalComments => Set<HRMS.Domain.Entities.Workflow.ApprovalComment>();
    public DbSet<HRMS.Domain.Entities.Workflow.WorkflowLog> WorkflowLogs => Set<HRMS.Domain.Entities.Workflow.WorkflowLog>();

    // Notification Engine
    public DbSet<HRMS.Domain.Entities.Notification.Notification> Notifications => Set<HRMS.Domain.Entities.Notification.Notification>();
    public DbSet<HRMS.Domain.Entities.Notification.NotificationTemplate> NotificationTemplates => Set<HRMS.Domain.Entities.Notification.NotificationTemplate>();
    public DbSet<HRMS.Domain.Entities.Notification.EmailTemplate> EmailTemplates => Set<HRMS.Domain.Entities.Notification.EmailTemplate>();
    public DbSet<HRMS.Domain.Entities.Notification.SmsTemplate> SmsTemplates => Set<HRMS.Domain.Entities.Notification.SmsTemplate>();
    public DbSet<HRMS.Domain.Entities.Notification.PushTemplate> PushTemplates => Set<HRMS.Domain.Entities.Notification.PushTemplate>();
    public DbSet<HRMS.Domain.Entities.Notification.NotificationQueue> NotificationQueues => Set<HRMS.Domain.Entities.Notification.NotificationQueue>();
    public DbSet<HRMS.Domain.Entities.Notification.DeliveryLog> DeliveryLogs => Set<HRMS.Domain.Entities.Notification.DeliveryLog>();
    public DbSet<HRMS.Domain.Entities.Notification.Announcement> Announcements => Set<HRMS.Domain.Entities.Notification.Announcement>();
    public DbSet<HRMS.Domain.Entities.Notification.UserNotificationPreference> UserNotificationPreferences => Set<HRMS.Domain.Entities.Notification.UserNotificationPreference>();
    public DbSet<HRMS.Domain.Entities.Notification.ScheduledNotification> ScheduledNotifications => Set<HRMS.Domain.Entities.Notification.ScheduledNotification>();
    public DbSet<HRMS.Domain.Entities.Notification.NotificationChannel> NotificationChannels => Set<HRMS.Domain.Entities.Notification.NotificationChannel>();
    public DbSet<HRMS.Domain.Entities.Notification.NotificationSetting> NotificationSettings => Set<HRMS.Domain.Entities.Notification.NotificationSetting>();
    public DbSet<HRMS.Domain.Entities.Notification.NotificationRecipient> NotificationRecipients => Set<HRMS.Domain.Entities.Notification.NotificationRecipient>();
    public DbSet<HRMS.Domain.Entities.Notification.NotificationVariable> NotificationVariables => Set<HRMS.Domain.Entities.Notification.NotificationVariable>();
    public DbSet<HRMS.Domain.Entities.Notification.NotificationBroadcast> NotificationBroadcasts => Set<HRMS.Domain.Entities.Notification.NotificationBroadcast>();
    public DbSet<HRMS.Domain.Entities.Notification.NotificationAuditLog> NotificationAuditLogs => Set<HRMS.Domain.Entities.Notification.NotificationAuditLog>();
    public DbSet<HRMS.Domain.Entities.Notification.NotificationRule> NotificationRules => Set<HRMS.Domain.Entities.Notification.NotificationRule>();
    public DbSet<HRMS.Domain.Entities.Notification.ReminderJob> ReminderJobs => Set<HRMS.Domain.Entities.Notification.ReminderJob>();

    // Audit Entities
    public DbSet<HRMS.Domain.Entities.Audit.AuditLog> AuditLogs => Set<HRMS.Domain.Entities.Audit.AuditLog>();
    public DbSet<HRMS.Domain.Entities.Audit.AuditChange> AuditChanges => Set<HRMS.Domain.Entities.Audit.AuditChange>();
    public DbSet<HRMS.Domain.Entities.Audit.AuditLogin> AuditLogins => Set<HRMS.Domain.Entities.Audit.AuditLogin>();
    public DbSet<HRMS.Domain.Entities.Audit.AuditSecurityEvent> AuditSecurityEvents => Set<HRMS.Domain.Entities.Audit.AuditSecurityEvent>();
    public DbSet<HRMS.Domain.Entities.Audit.AuditExport> AuditExports => Set<HRMS.Domain.Entities.Audit.AuditExport>();
    public DbSet<HRMS.Domain.Entities.Audit.AuditSetting> AuditSettings => Set<HRMS.Domain.Entities.Audit.AuditSetting>();

    // Enterprise Asset Management Module
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<AssetCategory> AssetCategories => Set<AssetCategory>();
    public DbSet<AssetModel> AssetModels => Set<AssetModel>();
    public DbSet<AssetLocation> AssetLocations => Set<AssetLocation>();
    public DbSet<AssetVendor> AssetVendors => Set<AssetVendor>();
    public DbSet<AssetAssignment> AssetAssignments => Set<AssetAssignment>();
    public DbSet<AssetTransfer> AssetTransfers => Set<AssetTransfer>();
    public DbSet<AssetRequest> AssetRequests => Set<AssetRequest>();
    public DbSet<AssetReturn> AssetReturns => Set<AssetReturn>();
    public DbSet<AssetMaintenance> AssetMaintenances => Set<AssetMaintenance>();
    public DbSet<AssetWarranty> AssetWarranties => Set<AssetWarranty>();
    public DbSet<AssetAudit> AssetAudits => Set<AssetAudit>();
    public DbSet<AssetAuditItem> AssetAuditItems => Set<AssetAuditItem>();
    public DbSet<AssetIncident> AssetIncidents => Set<AssetIncident>();
    public DbSet<AssetDisposal> AssetDisposals => Set<AssetDisposal>();
    public DbSet<AssetDepreciation> AssetDepreciations => Set<AssetDepreciation>();
    public DbSet<AssetDocument> AssetDocuments => Set<AssetDocument>();

    // Benefits & Compensation Core
    public DbSet<CompensationComponent> CompensationComponents => Set<CompensationComponent>();
    public DbSet<PayGrade> PayGrades => Set<PayGrade>();
    public DbSet<SalaryBand> SalaryBands => Set<SalaryBand>();
    public DbSet<CompensationPackage> CompensationPackages => Set<CompensationPackage>();
    public DbSet<EmployeeCompensation> EmployeeCompensations => Set<EmployeeCompensation>();
    public DbSet<CompensationComponentAssignment> CompensationComponentAssignments => Set<CompensationComponentAssignment>();
    public DbSet<CompensationHistory> CompensationHistories => Set<CompensationHistory>();
    public DbSet<SalaryRevision> SalaryRevisions => Set<SalaryRevision>();
    public DbSet<CompensationReviewCycle> CompensationReviewCycles => Set<CompensationReviewCycle>();
    public DbSet<CompensationReviewItem> CompensationReviewItems => Set<CompensationReviewItem>();
    public DbSet<CompensationBudget> CompensationBudgets => Set<CompensationBudget>();
    public DbSet<EmployeeBonus> EmployeeBonuses => Set<EmployeeBonus>();
    public DbSet<BenefitPlan> BenefitPlans => Set<BenefitPlan>();
    public DbSet<BenefitEligibilityRule> BenefitEligibilityRules => Set<BenefitEligibilityRule>();
    public DbSet<BenefitEnrollment> BenefitEnrollments => Set<BenefitEnrollment>();
    public DbSet<EmployeeDependent> EmployeeDependents => Set<EmployeeDependent>();
    public DbSet<QualifyingLifeEvent> QualifyingLifeEvents => Set<QualifyingLifeEvent>();
    public DbSet<CompensationDocument> CompensationDocuments => Set<CompensationDocument>();
    
    // Employee Self-Service (ESS)
    public DbSet<HRMS.Domain.Entities.Employee.EmployeeEmergencyContact> EmployeeEmergencyContacts => Set<HRMS.Domain.Entities.Employee.EmployeeEmergencyContact>();
    public DbSet<HRMS.Domain.Entities.Employee.EmployeeProfileChangeRequest> EmployeeProfileChangeRequests => Set<HRMS.Domain.Entities.Employee.EmployeeProfileChangeRequest>();
    public DbSet<HRMS.Domain.Entities.Employee.EmployeeHRRequest> EmployeeHRRequests => Set<HRMS.Domain.Entities.Employee.EmployeeHRRequest>();
    public DbSet<HRMS.Domain.Entities.Employee.EmployeeHRRequestComment> EmployeeHRRequestComments => Set<HRMS.Domain.Entities.Employee.EmployeeHRRequestComment>();

    // Travel & Expense Management
    public DbSet<HRMS.Domain.Entities.Travel.TravelRequest> TravelRequests => Set<HRMS.Domain.Entities.Travel.TravelRequest>();
    public DbSet<HRMS.Domain.Entities.Travel.Trip> Trips => Set<HRMS.Domain.Entities.Travel.Trip>();
    public DbSet<HRMS.Domain.Entities.Travel.TravelItineraryItem> TravelItineraryItems => Set<HRMS.Domain.Entities.Travel.TravelItineraryItem>();
    public DbSet<HRMS.Domain.Entities.Travel.TravelAdvance> TravelAdvances => Set<HRMS.Domain.Entities.Travel.TravelAdvance>();
    public DbSet<HRMS.Domain.Entities.Travel.ExpenseCategory> ExpenseCategories => Set<HRMS.Domain.Entities.Travel.ExpenseCategory>();
    public DbSet<HRMS.Domain.Entities.Travel.Expense> Expenses => Set<HRMS.Domain.Entities.Travel.Expense>();
    public DbSet<HRMS.Domain.Entities.Travel.ExpenseReport> ExpenseReports => Set<HRMS.Domain.Entities.Travel.ExpenseReport>();
    public DbSet<HRMS.Domain.Entities.Travel.ExpensePolicyRule> ExpensePolicyRules => Set<HRMS.Domain.Entities.Travel.ExpensePolicyRule>();

    // Reports & BI
    public DbSet<SavedReport> SavedReports => Set<SavedReport>();
    public DbSet<ReportSchedule> ReportSchedules => Set<ReportSchedule>();
    public DbSet<DashboardWidget> DashboardWidgets => Set<DashboardWidget>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.AddInterceptors(new HRMS.Persistence.Interceptors.AuditSaveChangesInterceptor());
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}

