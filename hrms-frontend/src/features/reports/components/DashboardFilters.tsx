import React from 'react';
import { Button } from '../../../components/ui/button';
import { Calendar, Filter, Download, RefreshCw, Layers, Building2, MapPin, Briefcase, Bookmark, FileSpreadsheet } from 'lucide-react';
import type { FilterOptionsDto } from '../api/reportApi';

export interface FilterState {
  period: string;
  startDate?: string;
  endDate?: string;
  companyId?: string;
  businessUnitId?: string;
  departmentId?: string;
  departmentName?: string;
  branchId?: string;
  locationId?: string;
  employmentType?: string;
  currency: string;
}

interface DashboardFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  options?: FilterOptionsDto | null;
  onApply: () => void;
  onReset: () => void;
  onRefresh: () => void;
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
  onOpenSavedReports: () => void;
  onOpenCustomBuilder: () => void;
  isRefreshing?: boolean;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  filters,
  onFilterChange,
  options,
  onApply,
  onReset,
  onRefresh,
  onExport,
  onOpenSavedReports,
  onOpenCustomBuilder,
  isRefreshing = false
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm space-y-3">
      {/* Top row: Global filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Period Selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60 text-xs">
          <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="text-[11px] font-semibold text-slate-400">Period:</span>
          <select
            value={filters.period}
            onChange={(e) => onFilterChange({ ...filters, period: e.target.value })}
            className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="last-6-months">Last 6 Months</option>
            <option value="this-year">This Year</option>
            <option value="last-year">Last Year</option>
            <option value="ytd">YTD (Year to Date)</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Custom Date Range pickers if selected */}
        {filters.period === 'custom' && (
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
            />
          </div>
        )}

        {/* Company Dropdown */}
        {options?.companies && options.companies.length > 0 && (
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60 text-xs">
            <Building2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <select
              value={filters.companyId || 'ALL'}
              onChange={(e) => onFilterChange({ ...filters, companyId: e.target.value === 'ALL' ? undefined : e.target.value })}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              <option value="ALL">All Companies</option>
              {options.companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Department Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60 text-xs">
          <Layers className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="text-[11px] font-semibold text-slate-400">Dept:</span>
          <select
            value={filters.departmentId || 'ALL'}
            onChange={(e) => {
              const val = e.target.value;
              const found = options?.departments?.find((d) => d.id === val);
              onFilterChange({
                ...filters,
                departmentId: val === 'ALL' ? undefined : val,
                departmentName: val === 'ALL' ? 'ALL' : found?.name || val
              });
            }}
            className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[150px] truncate"
          >
            <option value="ALL">All Departments</option>
            {options?.departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Filter */}
        {options?.branches && options.branches.length > 0 && (
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60 text-xs">
            <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-400">Branch:</span>
            <select
              value={filters.branchId || 'ALL'}
              onChange={(e) => onFilterChange({ ...filters, branchId: e.target.value === 'ALL' ? undefined : e.target.value })}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[130px] truncate"
            >
              <option value="ALL">All Branches</option>
              {options.branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Employment Type */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60 text-xs">
          <Briefcase className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <select
            value={filters.employmentType || 'ALL'}
            onChange={(e) => onFilterChange({ ...filters, employmentType: e.target.value === 'ALL' ? undefined : e.target.value })}
            className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Types</option>
            {(options?.employmentTypes || ['Full-Time', 'Part-Time', 'Contract', 'Intern']).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Selector (Requirement 5) */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60 text-xs">
          <span className="text-[11px] font-bold text-slate-500">Currency:</span>
          <select
            value={filters.currency}
            onChange={(e) => onFilterChange({ ...filters, currency: e.target.value })}
            className="bg-transparent font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none cursor-pointer"
          >
            <option value="RM">RM (MYR)</option>
            <option value="USD">USD ($)</option>
            <option value="SGD">SGD (S$)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        {/* Apply & Reset Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onApply}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
          >
            Apply Filters
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Bottom row: Tooling actions (Saved reports, custom builder, exports, refresh) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSavedReports}
            className="text-xs gap-1.5 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Bookmark className="h-3.5 w-3.5 text-indigo-500" />
            <span>Saved Reports</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenCustomBuilder}
            className="text-xs gap-1.5 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
            <span>Custom Report Builder</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-xs gap-1.5 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
          </Button>

          {/* Export Buttons */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => onExport('csv')}
              title="Export CSV"
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              CSV
            </button>
            <button
              onClick={() => onExport('excel')}
              title="Export Excel"
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              Excel
            </button>
            <button
              onClick={() => onExport('pdf')}
              title="Export PDF"
              className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
