import React, { useState } from 'react';
import { 
  Filter, Search, Calendar as CalendarIcon, ChevronDown, 
  X, Check, RotateCcw, SlidersHorizontal, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdvancedFilterToolbarProps {
  onFilterChange: (filters: any) => void;
  onExport?: () => void;
}

export function AdvancedFilterToolbar({ onFilterChange, onExport }: AdvancedFilterToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<any>({
    searchQuery: '',
    dateRange: 'This Month',
    department: '',
    branch: '',
    shift: '',
    status: '',
    isLateArrival: false,
    isMissingPunch: false,
    isOvertime: false,
    sortBy: 'Newest'
  });

  const handleApply = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      searchQuery: '',
      dateRange: 'This Month',
      department: '',
      branch: '',
      shift: '',
      status: '',
      isLateArrival: false,
      isMissingPunch: false,
      isOvertime: false,
      sortBy: 'Newest'
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center flex-1 gap-2 w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search employee, ID..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters({ ...filters, searchQuery: e.target.value });
                // We could debounce here, but let's just update state and let user hit apply or enter
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            />
          </div>
          
          <select 
            className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
            <option value="Last Week">Last Week</option>
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="Current Year">Current Year</option>
          </select>
          
          <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className={isOpen ? 'bg-slate-100' : ''}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Advanced Filters
            {Object.keys(filters).some(k => k !== 'searchQuery' && k !== 'dateRange' && k !== 'sortBy' && filters[k]) && (
              <span className="ml-2 flex h-2 w-2 rounded-full bg-blue-600"></span>
            )}
          </Button>
          
          <Button onClick={handleApply}>Apply</Button>
        </div>
        
        <div className="flex items-center gap-2">
          {onExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900">Organization</h4>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-medium">Department</label>
              <select 
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-medium">Branch</label>
              <select 
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.branch}
                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
              >
                <option value="">All Branches</option>
                <option value="HQ - New York">HQ - New York</option>
                <option value="London Office">London Office</option>
                <option value="Dubai Regional">Dubai Regional</option>
                <option value="Singapore Hub">Singapore Hub</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900">Attendance Details</h4>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-medium">Shift</label>
              <select 
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.shift}
                onChange={(e) => setFilters({ ...filters, shift: e.target.value })}
              >
                <option value="">All Shifts</option>
                <option value="Morning Shift (9AM-5PM)">Morning Shift</option>
                <option value="Evening Shift (2PM-10PM)">Evening Shift</option>
                <option value="Night Shift (10PM-6AM)">Night Shift</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-medium">Status</label>
              <select 
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
                <option value="Leave">Leave</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900">Violation Flags</h4>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  checked={filters.isLateArrival}
                  onChange={(e) => setFilters({ ...filters, isLateArrival: e.target.checked })}
                />
                Late Arrivals Only
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  checked={filters.isMissingPunch}
                  onChange={(e) => setFilters({ ...filters, isMissingPunch: e.target.checked })}
                />
                Missing Punches Only
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  checked={filters.isOvertime}
                  onChange={(e) => setFilters({ ...filters, isOvertime: e.target.checked })}
                />
                Overtime Logged
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900">View Settings</h4>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-medium">Sort By</label>
              <select 
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="EmployeeName">Employee Name (A-Z)</option>
                <option value="Department">Department</option>
                <option value="WorkHours">Working Hours (High-Low)</option>
                <option value="LateMinutes">Late Minutes (High-Low)</option>
              </select>
            </div>
            
            <div className="pt-4 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500">
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
              <Button size="sm" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
