import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CompanyList } from './features/organization/pages/CompanyList';
import { BusinessUnitList } from './features/organization/pages/BusinessUnitList';
import { BranchList } from './features/organization/pages/BranchList';
import { LocationList } from './features/organization/pages/LocationList';
import { DepartmentList } from './features/organization/pages/DepartmentList';
import { DesignationList } from './features/organization/pages/DesignationList';
import { JobGradeList } from './features/organization/pages/JobGradeList';
import { CostCenterList } from './features/organization/pages/CostCenterList';
import DesignSystem from './pages/DesignSystem';
import { EmployeeList } from './features/employee/pages/EmployeeList';
import { EmployeeProfile } from './features/employee/pages/EmployeeProfile';
import { EmployeeAttendanceDashboard } from './features/attendance/pages/EmployeeAttendanceDashboard';
import { HRAttendanceDashboard } from './features/attendance/pages/HRAttendanceDashboard';
import { ManagerAttendanceDashboard } from './features/attendance/pages/ManagerAttendanceDashboard';
import { EmployeeAttendanceProfile } from './features/attendance/pages/EmployeeAttendanceProfile';
import { HRLeaveDashboard } from './features/leave/pages/HRLeaveDashboard';
import { HRPerformanceDashboard } from './features/performance/pages/HRPerformanceDashboard';
import { HRPayrollDashboard } from './features/payroll/pages/HRPayrollDashboard';
import { HRRecruitmentDashboard } from './features/recruitment/pages/HRRecruitmentDashboard';
import { HROnboardingDashboard } from './features/onboarding/pages/HROnboardingDashboard';
import { HROffboardingDashboard } from './features/offboarding/pages/HROffboardingDashboard';
import { HRShiftDashboard } from './features/shift/pages/HRShiftDashboard';
import { HRLearningDashboard } from './features/learning/pages/HRLearningDashboard';
import { HRWorkflowDashboard } from './features/workflow/pages/HRWorkflowDashboard';
import { HRNotificationDashboard } from './features/notification/pages/HRNotificationDashboard';
import { HRAuditDashboard } from './features/audit/pages/HRAuditDashboard';
import { SystemAdminDashboard } from './features/system-admin/pages/SystemAdminDashboard';
import { AssetDashboardPage } from './features/asset/pages/AssetDashboardPage';
import { AssetListPage } from './features/asset/pages/AssetListPage';
import { AssetLifecyclePage } from './features/asset/pages/AssetLifecyclePage';
import { AssetAuditsPage } from './features/asset/pages/AssetAuditsPage';
import { AssetReportsPage } from './features/asset/pages/AssetReportsPage';
import { AssetRequestsPage } from './features/asset/pages/AssetRequestsPage';
import { MyAssetsPage } from './features/asset/pages/MyAssetsPage';
import {
  TravelDashboardPage,
  TravelRequestsPage,
  TravelRequestFormPage,
  ExpensesPage,
  ExpenseReportsPage,
  TravelAdvancesPage,
  TripsPage,
} from './features/travel';
import { TeamAssetsPage } from './features/asset/pages/TeamAssetsPage';
import { ExecutiveDashboardPage } from './features/reports/pages/ExecutiveDashboardPage';
import { HRAdminDashboardPage } from './features/dashboard/pages/HRAdminDashboardPage';

import { CompensationDashboardPage } from './features/compensation/pages/CompensationDashboardPage';
import { SalaryStructuresPage } from './features/compensation/pages/SalaryStructuresPage';
import { EmployeeCompensationPage } from './features/compensation/pages/EmployeeCompensationPage';
import { SalaryRevisionsPage } from './features/compensation/pages/SalaryRevisionsPage';
import { BonusesPage } from './features/compensation/pages/BonusesPage';
import { CompensationReviewsPage } from './features/compensation/pages/CompensationReviewsPage';
import { BenefitPlansPage } from './features/compensation/pages/BenefitPlansPage';
import { BenefitEnrollmentsPage } from './features/compensation/pages/BenefitEnrollmentsPage';
import { CompensationReportsPage } from './features/compensation/pages/CompensationReportsPage';
import { MyCompensationPage } from './features/compensation/pages/MyCompensationPage';
import { MyBenefitsPage } from './features/compensation/pages/MyBenefitsPage';
import { TeamCompensationPage } from './features/compensation/pages/TeamCompensationPage';

// Employee Self-Service (ESS) Pages
import { EmployeeDashboardPage } from './features/ess/pages/EmployeeDashboardPage';
import { EmployeeProfilePage } from './features/ess/pages/EmployeeProfilePage';
import { EmployeeAttendancePage } from './features/ess/pages/EmployeeAttendancePage';
import { EmployeeLeavePage } from './features/ess/pages/EmployeeLeavePage';
import { EmployeePayrollPage } from './features/ess/pages/EmployeePayrollPage';
import { EmployeeDocumentsPage } from './features/ess/pages/EmployeeDocumentsPage';
import { EmployeeRequestsPage } from './features/ess/pages/EmployeeRequestsPage';
import { EmployeeCalendarPage } from './features/ess/pages/EmployeeCalendarPage';
import { EmployeeDirectoryPage } from './features/ess/pages/EmployeeDirectoryPage';
import { EmployeeNotificationsPage } from './features/ess/pages/EmployeeNotificationsPage';

// Manager Self-Service (MSS) Pages
import ManagerDashboardPage from './features/mss/pages/ManagerDashboardPage';
import ManagerTeamPage from './features/mss/pages/ManagerTeamPage';
import ManagerAttendancePage from './features/mss/pages/ManagerAttendancePage';
import ManagerAttendanceRequestsPage from './features/mss/pages/ManagerAttendanceRequestsPage';
import ManagerLeavePage from './features/mss/pages/ManagerLeavePage';
import ManagerPerformancePage from './features/mss/pages/ManagerPerformancePage';
import ManagerTrainingPage from './features/mss/pages/ManagerTrainingPage';
import ManagerAssetsPage from './features/mss/pages/ManagerAssetsPage';
import ManagerApprovalsPage from './features/mss/pages/ManagerApprovalsPage';
import ManagerAnalyticsPage from './features/mss/pages/ManagerAnalyticsPage';
import ManagerDirectoryPage from './features/mss/pages/ManagerDirectoryPage';
import ManagerCalendarPage from './features/mss/pages/ManagerCalendarPage';
import ManagerCompensationPage from './features/mss/pages/ManagerCompensationPage';
import ManagerRequestsPage from './features/mss/pages/ManagerRequestsPage';

import { Login } from './pages/Login';
import { AdminLayout } from './layouts/AdminLayout';
import { EmployeeLayout } from './layouts/EmployeeLayout';
import ManagerLayout from './layouts/ManagerLayout';
import { SuperAdminLayout } from './layouts/SuperAdminLayout';

import { PlatformAdminDashboard } from './features/saas-tenants/pages/PlatformAdminDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          {/* HR Admin Portal */}
          <Route path="/admin" element={<AdminLayout><HRAdminDashboardPage /></AdminLayout>} />
          <Route path="/admin/system" element={<AdminLayout><SystemAdminDashboard /></AdminLayout>} />
          <Route path="/admin/employees" element={<AdminLayout><EmployeeList /></AdminLayout>} />
          <Route path="/admin/employees/:id" element={<AdminLayout><EmployeeProfile /></AdminLayout>} />
          <Route path="/employees" element={<Navigate to="/admin/employees" replace />} />
          <Route path="/employees/:id" element={<AdminLayout><EmployeeProfile /></AdminLayout>} />
          <Route path="/admin/attendance" element={<AdminLayout><HRAttendanceDashboard /></AdminLayout>} />
          <Route path="/admin/attendance/employee/:id" element={<AdminLayout><EmployeeAttendanceProfile /></AdminLayout>} />
          <Route path="/admin/leave" element={<AdminLayout><HRLeaveDashboard /></AdminLayout>} />
          <Route path="/admin/shift" element={<AdminLayout><HRShiftDashboard /></AdminLayout>} />
          <Route path="/admin/performance" element={<AdminLayout><HRPerformanceDashboard /></AdminLayout>} />
          <Route path="/admin/payroll" element={<AdminLayout><HRPayrollDashboard /></AdminLayout>} />
          <Route path="/admin/recruitment" element={<AdminLayout><HRRecruitmentDashboard /></AdminLayout>} />
          <Route path="/admin/onboarding" element={<AdminLayout><HROnboardingDashboard /></AdminLayout>} />
          <Route path="/admin/offboarding" element={<AdminLayout><HROffboardingDashboard /></AdminLayout>} />
          <Route path="/admin/learning" element={<AdminLayout><HRLearningDashboard /></AdminLayout>} />
          <Route path="/admin/workflow" element={<AdminLayout><HRWorkflowDashboard /></AdminLayout>} />
          <Route path="/admin/notifications" element={<AdminLayout><HRNotificationDashboard /></AdminLayout>} />
          <Route path="/admin/audit" element={<AdminLayout><HRAuditDashboard /></AdminLayout>} />
          
          <Route path="/admin/companies" element={<AdminLayout><CompanyList /></AdminLayout>} />
          <Route path="/admin/business-units" element={<AdminLayout><BusinessUnitList /></AdminLayout>} />
          <Route path="/admin/branches" element={<AdminLayout><BranchList /></AdminLayout>} />
          <Route path="/admin/locations" element={<AdminLayout><LocationList /></AdminLayout>} />
          <Route path="/admin/departments" element={<AdminLayout><DepartmentList /></AdminLayout>} />
          <Route path="/admin/designations" element={<AdminLayout><DesignationList /></AdminLayout>} />
          <Route path="/admin/job-grades" element={<AdminLayout><JobGradeList /></AdminLayout>} />
          <Route path="/admin/cost-centers" element={<AdminLayout><CostCenterList /></AdminLayout>} />
          
          {/* Asset Management Routes */}
          <Route path="/admin/assets" element={<AdminLayout><AssetListPage /></AdminLayout>} />
          <Route path="/admin/assets/dashboard" element={<AdminLayout><AssetDashboardPage /></AdminLayout>} />
          <Route path="/admin/assets/lifecycle" element={<AdminLayout><AssetLifecyclePage /></AdminLayout>} />
          <Route path="/admin/assets/audits" element={<AdminLayout><AssetAuditsPage /></AdminLayout>} />
          <Route path="/admin/assets/reports" element={<AdminLayout><AssetReportsPage /></AdminLayout>} />
          <Route path="/admin/assets/requests" element={<AdminLayout><AssetRequestsPage /></AdminLayout>} />

          {/* Benefits & Compensation Module */}
          <Route path="/admin/compensation/dashboard" element={<AdminLayout><CompensationDashboardPage /></AdminLayout>} />
          <Route path="/admin/compensation" element={<Navigate to="/admin/compensation/dashboard" replace />} />
          <Route path="/admin/compensation/employees" element={<AdminLayout><EmployeeCompensationPage /></AdminLayout>} />
          <Route path="/admin/compensation/structures" element={<AdminLayout><SalaryStructuresPage /></AdminLayout>} />
          <Route path="/admin/compensation/revisions" element={<AdminLayout><SalaryRevisionsPage /></AdminLayout>} />
          <Route path="/admin/compensation/bonuses" element={<AdminLayout><BonusesPage /></AdminLayout>} />
          <Route path="/admin/compensation/reviews" element={<AdminLayout><CompensationReviewsPage /></AdminLayout>} />
          <Route path="/admin/compensation/benefit-plans" element={<AdminLayout><BenefitPlansPage /></AdminLayout>} />
          <Route path="/admin/compensation/benefit-enrollments" element={<AdminLayout><BenefitEnrollmentsPage /></AdminLayout>} />
          <Route path="/admin/compensation/reports" element={<AdminLayout><CompensationReportsPage /></AdminLayout>} />

          {/* Reports & BI (Admin Routes) */}
          <Route path="/admin/reports" element={<AdminLayout><ExecutiveDashboardPage /></AdminLayout>} />
          <Route path="/admin/reports/dashboard" element={<AdminLayout><ExecutiveDashboardPage /></AdminLayout>} />

          {/* Travel & Expense (Admin Routes) */}
          <Route path="/admin/travel" element={<AdminLayout><TravelDashboardPage /></AdminLayout>} />
          <Route path="/admin/travel/requests" element={<AdminLayout><TravelRequestsPage /></AdminLayout>} />
          <Route path="/admin/travel/requests/new" element={<AdminLayout><TravelRequestFormPage /></AdminLayout>} />
          <Route path="/admin/travel/requests/:id" element={<AdminLayout><TravelRequestFormPage /></AdminLayout>} />
          <Route path="/admin/travel/trips" element={<AdminLayout><TripsPage /></AdminLayout>} />
          <Route path="/admin/travel/expenses" element={<AdminLayout><ExpensesPage /></AdminLayout>} />
          <Route path="/admin/travel/expenses/new" element={<AdminLayout><ExpensesPage /></AdminLayout>} />
          <Route path="/admin/travel/reports" element={<AdminLayout><ExpenseReportsPage /></AdminLayout>} />
          <Route path="/admin/travel/reports/new" element={<AdminLayout><ExpenseReportsPage /></AdminLayout>} />
          <Route path="/admin/travel/advances" element={<AdminLayout><TravelAdvancesPage /></AdminLayout>} />

          {/* Employee Self-Service (ESS) Portal */}
          <Route path="/employee" element={<EmployeeLayout><EmployeeDashboardPage /></EmployeeLayout>} />
          <Route path="/employee/dashboard" element={<EmployeeLayout><EmployeeDashboardPage /></EmployeeLayout>} />
          <Route path="/employee/profile" element={<EmployeeLayout><EmployeeProfilePage /></EmployeeLayout>} />
          <Route path="/employee/attendance" element={<EmployeeLayout><EmployeeAttendancePage /></EmployeeLayout>} />
          <Route path="/employee/leave" element={<EmployeeLayout><EmployeeLeavePage /></EmployeeLayout>} />
          <Route path="/employee/payroll" element={<EmployeeLayout><EmployeePayrollPage /></EmployeeLayout>} />
          <Route path="/employee/payslips" element={<EmployeeLayout><EmployeePayrollPage /></EmployeeLayout>} />
          <Route path="/employee/assets" element={<EmployeeLayout><MyAssetsPage /></EmployeeLayout>} />
          <Route path="/employee/compensation" element={<EmployeeLayout><MyCompensationPage /></EmployeeLayout>} />
          <Route path="/employee/benefits" element={<EmployeeLayout><MyBenefitsPage /></EmployeeLayout>} />
          <Route path="/employee/documents" element={<EmployeeLayout><EmployeeDocumentsPage /></EmployeeLayout>} />
          <Route path="/employee/requests" element={<EmployeeLayout><EmployeeRequestsPage /></EmployeeLayout>} />
          <Route path="/employee/helpdesk" element={<EmployeeLayout><EmployeeRequestsPage /></EmployeeLayout>} />
          <Route path="/employee/calendar" element={<EmployeeLayout><EmployeeCalendarPage /></EmployeeLayout>} />
          <Route path="/employee/directory" element={<EmployeeLayout><EmployeeDirectoryPage /></EmployeeLayout>} />
          <Route path="/employee/notifications" element={<EmployeeLayout><EmployeeNotificationsPage /></EmployeeLayout>} />
          {/* Travel (ESS) */}
          <Route path="/travel" element={<EmployeeLayout><TravelDashboardPage /></EmployeeLayout>} />
          <Route path="/travel/requests" element={<EmployeeLayout><TravelRequestsPage /></EmployeeLayout>} />
          <Route path="/travel/requests/new" element={<EmployeeLayout><TravelRequestFormPage /></EmployeeLayout>} />
          <Route path="/travel/requests/:id" element={<EmployeeLayout><TravelRequestFormPage /></EmployeeLayout>} />
          <Route path="/travel/trips" element={<EmployeeLayout><TripsPage /></EmployeeLayout>} />
          <Route path="/travel/expenses" element={<EmployeeLayout><ExpensesPage /></EmployeeLayout>} />
          <Route path="/travel/expenses/new" element={<EmployeeLayout><ExpensesPage /></EmployeeLayout>} />
          <Route path="/travel/reports" element={<EmployeeLayout><ExpenseReportsPage /></EmployeeLayout>} />
          <Route path="/travel/reports/new" element={<EmployeeLayout><ExpenseReportsPage /></EmployeeLayout>} />
          <Route path="/travel/advances" element={<EmployeeLayout><TravelAdvancesPage /></EmployeeLayout>} />
          <Route path="/travel/policy" element={<EmployeeLayout><ExpenseReportsPage /></EmployeeLayout>} />

          {/* Manager Self-Service (MSS) Portal */}
          <Route path="/manager" element={<ManagerLayout><ManagerDashboardPage /></ManagerLayout>} />
          <Route path="/manager/team" element={<ManagerLayout><ManagerTeamPage /></ManagerLayout>} />
          <Route path="/manager/team/directory" element={<ManagerLayout><ManagerDirectoryPage /></ManagerLayout>} />
          <Route path="/manager/calendar" element={<ManagerLayout><ManagerCalendarPage /></ManagerLayout>} />
          <Route path="/manager/attendance" element={<ManagerLayout><ManagerAttendancePage /></ManagerLayout>} />
          <Route path="/manager/attendance-requests" element={<ManagerLayout><ManagerAttendanceRequestsPage /></ManagerLayout>} />
          <Route path="/manager/leave" element={<ManagerLayout><ManagerLeavePage /></ManagerLayout>} />
          <Route path="/manager/performance" element={<ManagerLayout><ManagerPerformancePage /></ManagerLayout>} />
          <Route path="/manager/training" element={<ManagerLayout><ManagerTrainingPage /></ManagerLayout>} />
          <Route path="/manager/assets" element={<ManagerLayout><ManagerAssetsPage /></ManagerLayout>} />
          <Route path="/manager/compensation" element={<ManagerLayout><ManagerCompensationPage /></ManagerLayout>} />
          <Route path="/manager/approvals" element={<ManagerLayout><ManagerApprovalsPage /></ManagerLayout>} />
          <Route path="/manager/requests" element={<ManagerLayout><ManagerRequestsPage /></ManagerLayout>} />
          <Route path="/manager/analytics" element={<ManagerLayout><ManagerAnalyticsPage /></ManagerLayout>} />
          {/* Travel (MSS) */}
          <Route path="/manager/travel" element={<ManagerLayout><TravelDashboardPage /></ManagerLayout>} />
          <Route path="/manager/travel/requests" element={<ManagerLayout><TravelRequestsPage /></ManagerLayout>} />
          <Route path="/manager/travel/trips" element={<ManagerLayout><TripsPage /></ManagerLayout>} />
          <Route path="/manager/travel/expenses" element={<ManagerLayout><ExpensesPage /></ManagerLayout>} />
          <Route path="/manager/travel/reports" element={<ManagerLayout><ExpenseReportsPage /></ManagerLayout>} />
          <Route path="/manager/travel/advances" element={<ManagerLayout><TravelAdvancesPage /></ManagerLayout>} />

          {/* Super Admin / SaaS Platform Portal */}
          <Route path="/super-admin" element={<SuperAdminLayout><PlatformAdminDashboard /></SuperAdminLayout>} />
          <Route path="/super-admin/tenants" element={<SuperAdminLayout><PlatformAdminDashboard /></SuperAdminLayout>} />
          
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
export default App;






