import React, { useEffect, useState } from 'react';
import { reportsApi } from '../api/reportApi';
import type {
  ExecutiveDashboardDto,
  AssetAnalyticsDto,
  BenefitsAnalyticsDto,
  ExpenseAnalyticsDto,
  FilterOptionsDto
} from '../api/reportApi';
import { KpiCard } from '../components/KpiCard';
import { DashboardFilters } from '../components/DashboardFilters';
import type { FilterState } from '../components/DashboardFilters';
import { HeadcountTrendChart } from '../components/HeadcountTrendChart';
import { DepartmentHeadcountChart } from '../components/DepartmentHeadcountChart';
import { AttendanceSection } from '../components/AttendanceSection';
import { LeaveSection } from '../components/LeaveSection';
import { PayrollSection } from '../components/PayrollSection';
import { RecruitmentFunnelChart } from '../components/RecruitmentFunnelChart';
import { HrInsightsPanel } from '../components/HrInsightsPanel';
import { ActionRequiredPanel } from '../components/ActionRequiredPanel';
import { AssetSection } from '../components/AssetSection';
import { BenefitsSection } from '../components/BenefitsSection';
import { ExpenseSection } from '../components/ExpenseSection';
import { ModuleDeepDives } from '../components/ModuleDeepDives';
import { SavedReportsModal } from '../components/SavedReportsModal';
import { CustomReportBuilderModal } from '../components/CustomReportBuilderModal';
import { formatCurrencyValue } from '../utils/currencyFormatter';
import { generateExecutivePdfReport } from '../utils/pdfExportGenerator';
import {
  Users,
  UserCheck,
  TrendingDown,
  Activity,
  Briefcase,
  Banknote,
  Plane,
  RefreshCw,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

export const ExecutiveDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<ExecutiveDashboardDto | null>(null);
  const [assetData, setAssetData] = useState<AssetAnalyticsDto | null>(null);
  const [benefitsData, setBenefitsData] = useState<BenefitsAnalyticsDto | null>(null);
  const [expenseData, setExpenseData] = useState<ExpenseAnalyticsDto | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsDto | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSavedReportsOpen, setIsSavedReportsOpen] = useState(false);
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    period: 'last-6-months',
    departmentName: 'ALL',
    currency: 'RM'
  });

  // Fetch dynamic filter options once on mount
  useEffect(() => {
    reportsApi.getFilterOptions().then((opts) => setFilterOptions(opts)).catch(console.error);
  }, []);

  const loadData = async (isManualRefresh = false, activeFilters: FilterState = filters) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const queryParams = {
        period: activeFilters.period,
        departmentId: activeFilters.departmentId,
        branchId: activeFilters.branchId,
        locationId: activeFilters.locationId,
        employmentType: activeFilters.employmentType,
        startDate: activeFilters.startDate,
        endDate: activeFilters.endDate
      };

      const [dashRes, assetRes, benefitsRes, expRes] = await Promise.all([
        reportsApi.getExecutiveDashboard(queryParams),
        reportsApi.getAssetAnalytics({ departmentId: activeFilters.departmentId }),
        reportsApi.getBenefitsAnalytics(),
        reportsApi.getExpenseAnalytics()
      ]);

      setData(dashRes);
      setAssetData(assetRes);
      setBenefitsData(benefitsRes);
      setExpenseData(expRes);
    } catch (err: any) {
      console.error('Failed to load executive dashboard:', err);
      setError(err?.message ?? 'Failed to load enterprise dashboard analytics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false, filters);
  }, [filters.period]);

  const handleApplyFilters = () => {
    loadData(true, filters);
  };

  const handleResetFilters = () => {
    const defaultFilters: FilterState = {
      period: 'last-6-months',
      departmentName: 'ALL',
      currency: filters.currency
    };
    setFilters(defaultFilters);
    loadData(true, defaultFilters);
  };

  const handleDepartmentDrilldown = (deptName: string) => {
    const found = filterOptions?.departments?.find((d) => d.name === deptName);
    const updated: FilterState = {
      ...filters,
      departmentId: found?.id,
      departmentName: deptName
    };
    setFilters(updated);
    loadData(true, updated);
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (!data) return;

    if (format === 'pdf') {
      generateExecutivePdfReport(data, {
        companyName: 'Enterprise HRMS SaaS',
        title: 'Executive BI & HR Analytics Report',
        dateRange: filters.period.toUpperCase().replace(/-/g, ' '),
        currency: filters.currency
      });
      return;
    }

    // Comprehensive CSV/Excel export
    const rows = [
      ['HRMS Enterprise Executive BI Analytics Export'],
      ['Generated At', new Date().toISOString()],
      ['Currency', filters.currency],
      ['Period', filters.period],
      [],
      ['Workforce Metric', 'Value'],
      ['Total Employees', data.totalEmployees],
      ['Active Employees', data.activeEmployees],
      ['New Hires', data.newHires],
      ['Exits', data.exits],
      ['Turnover Rate', `${data.turnoverRate}%`],
      ['Attendance Rate', `${data.attendanceRate}%`],
      ['Absence Rate', `${data.absenceRate}%`],
      ['Late Check-ins', data.lateCheckIns],
      ['Pending Leaves', data.pendingLeaves],
      ['Gross Payroll Cost', formatCurrencyValue(data.grossPayroll || data.payrollCost, filters.currency).exact],
      ['Net Payroll Disbursed', formatCurrencyValue(data.netPayroll, filters.currency).exact],
      ['Benefits Investment', formatCurrencyValue(data.benefitsCost, filters.currency).exact],
      ['Open Positions', data.openPositions],
      ['Total Applicants', data.applicants],
      ['Interviews Scheduled', data.interviews],
      ['Offers Extended', data.offers],
      ['Hires Completed', data.hired],
      ['Travel & Expense Spend', formatCurrencyValue(data.travelSpend, filters.currency).exact],
      [],
      ['Department', 'Headcount', 'Percentage'],
      ...(data.departmentDistribution || []).map((d) => [
        d.category,
        d.value,
        `${data.totalEmployees > 0 ? ((d.value / data.totalEmployees) * 100).toFixed(1) : 0}%`
      ]),
      [],
      ['Headcount Month', 'Headcount'],
      ...(data.headcountTrend || []).map((t) => [t.period, t.value]),
      [],
      ['Payroll Month', `Gross Payroll (${filters.currency})`],
      ...(data.payrollTrend || []).map((p) => [p.period, p.value])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `HRMS_Executive_BI_${filters.period}_${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'csv' : 'csv'}`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2" />
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mb-4">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Unable to Load Executive BI Dashboard
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 max-w-sm">
          {error || 'An unexpected error occurred while communicating with the analytics engine.'}
        </p>
        <Button onClick={() => loadData()} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
          <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
        </Button>
      </div>
    );
  }

  // Department distribution filtered view
  const filteredDeptData =
    !filters.departmentName || filters.departmentName === 'ALL'
      ? data.departmentDistribution || []
      : (data.departmentDistribution || []).filter((d) => d.category === filters.departmentName);

  // Formatted Currency values (Requirement 5)
  const grossPayrollFormatted = formatCurrencyValue(data.grossPayroll || data.payrollCost, filters.currency);
  const netPayrollFormatted = formatCurrencyValue(data.netPayroll, filters.currency);
  const travelSpendFormatted = formatCurrencyValue(data.travelSpend, filters.currency);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Executive BI &amp; Reports
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
              Live SaaS Enterprise
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time executive intelligence, workforce distribution, payroll metrics &amp; ATS funnel
          </p>
        </div>
      </div>

      {/* Global Filter Bar (Requirement 3 & 5) */}
      <DashboardFilters
        filters={filters}
        onFilterChange={setFilters}
        options={filterOptions}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        onRefresh={() => loadData(true)}
        onExport={handleExport}
        onOpenSavedReports={() => setIsSavedReportsOpen(true)}
        onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
        isRefreshing={refreshing}
      />

      {/* Primary KPI Row: Workforce (Requirement 4 & 19 Drill-downs) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Workforce Executive Overview
          </h2>
          <span className="text-[11px] text-slate-400">Total Headcount: {data.totalEmployees}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            title="Total Workforce"
            value={data.totalEmployees}
            icon={<Users className="h-5 w-5" />}
            subtitle={`${data.activeEmployees} active staff`}
            trend={3.2}
            trendLabel="vs last quarter"
            color="indigo"
            badge="Corporate"
            onClick={() => navigate('/admin/employees')}
            tooltip="Click to view full employee directory"
          />
          <KpiCard
            title="New Hires"
            value={data.newHires}
            icon={<UserCheck className="h-5 w-5" />}
            subtitle="Joined this month"
            trend={8.5}
            trendLabel="mom growth"
            color="emerald"
            badge="Onboarding"
            onClick={() => navigate('/admin/employees')}
            tooltip="Click to view new team members"
          />
          <KpiCard
            title="Attrition / Exits"
            value={data.exits}
            icon={<TrendingDown className="h-5 w-5" />}
            subtitle="Recorded exits"
            color="rose"
            badge="Offboarding"
            onClick={() => navigate('/admin/employees')}
            tooltip="Click to view exit records"
          />
          <KpiCard
            title="Turnover Rate"
            value={`${data.turnoverRate}%`}
            icon={<TrendingDown className="h-5 w-5" />}
            subtitle="Annualized benchmark"
            trend={-0.4}
            trendLabel="improved"
            color="amber"
            badge="Retention"
            onClick={() => navigate('/admin/employees')}
            tooltip="Turnover rate benchmark across organization"
          />
        </div>
      </div>

      {/* Secondary KPI Row: Operations, Payroll & Spend (Requirement 4 & 5) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Financial &amp; Operational Health
          </h2>
          <span className="text-[11px] text-slate-400">Current Cycle • Configured Currency: {filters.currency}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            title="Attendance Rate"
            value={`${data.attendanceRate}%`}
            icon={<Activity className="h-5 w-5" />}
            subtitle={`${data.lateCheckIns} late arrivals recorded`}
            trend={1.2}
            trendLabel="vs last month"
            color="emerald"
            badge="Punctuality"
            onClick={() => navigate('/employee/attendance')}
            tooltip="Click to drill-down to Attendance Analytics"
          />
          <KpiCard
            title="Open Positions"
            value={data.openPositions}
            icon={<Briefcase className="h-5 w-5" />}
            subtitle={`${data.applicants} active candidates`}
            color="purple"
            badge="ATS Pipeline"
            onClick={() => navigate('/admin/recruitment')}
            tooltip="Click to drill-down to ATS Recruitment Funnel"
          />
          <KpiCard
            title="Gross Payroll Cost"
            value={grossPayrollFormatted.formatted}
            icon={<Banknote className="h-5 w-5" />}
            subtitle="Monthly gross spend"
            trend={2.1}
            trendLabel="annual merit"
            color="indigo"
            badge="Payroll"
            onClick={() => navigate('/admin/compensation')}
            tooltip={`Exact Value: ${grossPayrollFormatted.exact}`}
          />
          <KpiCard
            title="Corporate Travel Spend"
            value={travelSpendFormatted.formatted}
            icon={<Plane className="h-5 w-5" />}
            subtitle="Expenses &amp; itineraries"
            color="amber"
            badge="Travel & Expense"
            onClick={() => navigate('/admin/travel')}
            tooltip={`Exact Value: ${travelSpendFormatted.exact}`}
          />
        </div>
      </div>

      {/* AI Insights & Operational Attention Panels (Requirements 17 & 18) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HrInsightsPanel insights={data.insights || []} />
        <ActionRequiredPanel actionItems={data.actionItems || []} />
      </div>

      {/* Primary Analytics Charts: Headcount Trend & Department Donut (Requirements 6 & 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeadcountTrendChart data={data.headcountTrend || []} totalEmployees={data.totalEmployees} />
        <DepartmentHeadcountChart
          data={filteredDeptData}
          onSelectDepartment={handleDepartmentDrilldown}
        />
      </div>

      {/* Attendance & Leave Analytics Sections (Requirements 8 & 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceSection
          attendanceRate={data.attendanceRate}
          absenceRate={data.absenceRate}
          lateCheckIns={data.lateCheckIns}
          earlyCheckOuts={data.earlyCheckOuts}
          trend={data.attendanceTrend || []}
        />
        <LeaveSection
          totalLeaveRequests={data.totalLeaveRequests}
          approvedLeaves={data.approvedLeaves}
          pendingLeaves={data.pendingLeaves}
          utilizationRate={data.leaveUtilizationRate}
          leaveTypeDistribution={data.leaveTypeDistribution || []}
        />
      </div>

      {/* Payroll Trend & Recruitment ATS Funnel (Requirements 10 & 11) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PayrollSection
          grossPayroll={Number(data.grossPayroll || data.payrollCost)}
          netPayroll={Number(data.netPayroll)}
          benefitsCost={Number(data.benefitsCost)}
          trend={data.payrollTrend || []}
        />
        <RecruitmentFunnelChart
          funnelData={data.recruitmentFunnel || []}
          openPositions={data.openPositions}
          applicants={data.applicants}
          offers={data.offers}
          hired={data.hired}
        />
      </div>

      {/* Assets & Benefits Analytics (Requirements 14 & 15) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetSection data={assetData} currency={filters.currency} />
        <BenefitsSection data={benefitsData} currency={filters.currency} />
      </div>

      {/* Travel & Expense Analytics (Requirement 16) */}
      <div className="grid grid-cols-1 gap-6">
        <ExpenseSection data={expenseData} currency={filters.currency} />
      </div>

      {/* Specialized Module Deep Dives (Requirements 12, 13) */}
      <ModuleDeepDives />

      {/* Saved Reports Modal (Requirement 21) */}
      <SavedReportsModal
        isOpen={isSavedReportsOpen}
        onClose={() => setIsSavedReportsOpen(false)}
        onApplyReport={(savedConfig) => {
          setFilters(savedConfig);
          loadData(true, savedConfig);
        }}
        currentFilters={filters}
      />

      {/* Custom Report Builder Modal (Requirement 22) */}
      <CustomReportBuilderModal
        isOpen={isCustomBuilderOpen}
        onClose={() => setIsCustomBuilderOpen(false)}
      />
    </div>
  );
};
