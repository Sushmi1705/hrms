import React, { useState, useMemo } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Search, Users, CalendarRange, Filter, X, CheckCircle2, AlertCircle, Clock, ArrowRight, UserCheck, ShieldCheck, Check } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Checkbox } from '../../../components/ui/checkbox';

export interface AssignmentItem {
  id: string | number;
  employee: string;
  dept: string;
  shift: string;
  shiftCode?: string;
  colorCode?: string;
  pattern: string;
  nextChange: string;
  effectiveDate?: string;
}

const AVAILABLE_SHIFTS = [
  { name: 'Morning Shift', code: 'MORN01', timing: '06:00 - 14:00', color: '#f59e0b', type: 'Morning' },
  { name: 'General Shift', code: 'GEN01', timing: '09:00 - 18:00', color: '#3b82f6', type: 'General' },
  { name: 'Evening Shift', code: 'EVE01', timing: '14:00 - 22:00', color: '#10b981', type: 'Evening' },
  { name: 'Night Shift', code: 'NGT01', timing: '22:00 - 06:00', color: '#6366f1', type: 'Night' },
];

const ROTATION_PATTERNS = ['Fixed', 'Weekly', 'Bi-Weekly', 'Monthly', 'Rotational'];

const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  { id: '1', employee: 'John Doe', dept: 'Engineering', shift: 'Morning Shift', shiftCode: 'MORN01', colorCode: '#f59e0b', pattern: 'Weekly', nextChange: '2026-09-01' },
  { id: '2', employee: 'Jane Smith', dept: 'Sales', shift: 'General Shift', shiftCode: 'GEN01', colorCode: '#3b82f6', pattern: 'Fixed', nextChange: '-' },
  { id: '3', employee: 'Michael Brown', dept: 'Support', shift: 'Night Shift', shiftCode: 'NGT01', colorCode: '#6366f1', pattern: 'Bi-Weekly', nextChange: '2026-09-15' },
  { id: '4', employee: 'Sarah Connor', dept: 'Engineering', shift: 'Morning Shift', shiftCode: 'MORN01', colorCode: '#f59e0b', pattern: 'Weekly', nextChange: '2026-09-01' },
  { id: '5', employee: 'Wilmer Mayert', dept: 'Engineering', shift: 'General Shift', shiftCode: 'GEN01', colorCode: '#3b82f6', pattern: 'Weekly', nextChange: '2026-09-20' },
  { id: '6', employee: 'Elena Rostova', dept: 'Marketing', shift: 'Evening Shift', shiftCode: 'EVE01', colorCode: '#10b981', pattern: 'Bi-Weekly', nextChange: '2026-09-25' },
  { id: '7', employee: 'David Miller', dept: 'Finance', shift: 'General Shift', shiftCode: 'GEN01', colorCode: '#3b82f6', pattern: 'Fixed', nextChange: '-' },
];

export function ShiftAssignments() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [changeShiftTarget, setChangeShiftTarget] = useState<AssignmentItem | null>(null);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filters state
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState('All');
  const [selectedPatternFilter, setSelectedPatternFilter] = useState('All');

  // Change Shift Form state
  const [changeForm, setChangeForm] = useState({
    newShift: 'General Shift',
    pattern: 'Weekly',
    effectiveDate: '2026-09-15',
    reason: ''
  });

  // Bulk Assign Form state
  const [bulkForm, setBulkForm] = useState({
    targetShift: 'General Shift',
    pattern: 'Weekly',
    effectiveDate: '2026-09-15',
    deptFilter: 'All',
    selectedEmployeeIds: [] as string[]
  });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open "Change Shift" for a single employee
  const handleOpenChangeShift = (item: AssignmentItem) => {
    setChangeShiftTarget(item);
    setChangeForm({
      newShift: item.shift,
      pattern: item.pattern || 'Weekly',
      effectiveDate: item.nextChange !== '-' ? item.nextChange : '2026-09-15',
      reason: ''
    });
  };

  // Submit "Change Shift"
  const handleSaveChangeShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeShiftTarget) return;

    const chosenShift = AVAILABLE_SHIFTS.find(s => s.name === changeForm.newShift);

    setAssignments(prev => prev.map(a => {
      if (a.id === changeShiftTarget.id) {
        return {
          ...a,
          shift: changeForm.newShift,
          shiftCode: chosenShift?.code || a.shiftCode,
          colorCode: chosenShift?.color || a.colorCode,
          pattern: changeForm.pattern,
          nextChange: changeForm.pattern === 'Fixed' ? '-' : changeForm.effectiveDate
        };
      }
      return a;
    }));

    showToast(`Shift updated to ${changeForm.newShift} for ${changeShiftTarget.employee}.`);
    setChangeShiftTarget(null);
  };

  // Open "Assign Shifts" (Bulk)
  const handleOpenBulkAssign = () => {
    const defaultSelected = selectedIds.length > 0 ? selectedIds : assignments.map(a => String(a.id));
    setBulkForm({
      targetShift: 'General Shift',
      pattern: 'Weekly',
      effectiveDate: '2026-09-15',
      deptFilter: 'All',
      selectedEmployeeIds: defaultSelected
    });
    setIsAssignModalOpen(true);
  };

  // Submit Bulk Assignment
  const handleSaveBulkAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkForm.selectedEmployeeIds.length === 0) {
      showToast('Please select at least one employee', 'error');
      return;
    }

    const chosenShift = AVAILABLE_SHIFTS.find(s => s.name === bulkForm.targetShift);

    setAssignments(prev => prev.map(a => {
      if (bulkForm.selectedEmployeeIds.includes(String(a.id))) {
        return {
          ...a,
          shift: bulkForm.targetShift,
          shiftCode: chosenShift?.code || a.shiftCode,
          colorCode: chosenShift?.color || a.colorCode,
          pattern: bulkForm.pattern,
          nextChange: bulkForm.pattern === 'Fixed' ? '-' : bulkForm.effectiveDate
        };
      }
      return a;
    }));

    showToast(`Assigned ${bulkForm.targetShift} to ${bulkForm.selectedEmployeeIds.length} employee(s).`);
    setIsAssignModalOpen(false);
    setSelectedIds([]);
  };

  // Select all or none
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredAssignments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAssignments.map(a => String(a.id)));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filtered roster
  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchSearch = !searchQuery.trim() || 
        a.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.shift.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchDept = selectedDeptFilter === 'All' || a.dept === selectedDeptFilter;
      const matchShift = selectedShiftFilter === 'All' || a.shift === selectedShiftFilter;
      const matchPattern = selectedPatternFilter === 'All' || a.pattern === selectedPatternFilter;

      return matchSearch && matchDept && matchShift && matchPattern;
    });
  }, [assignments, searchQuery, selectedDeptFilter, selectedShiftFilter, selectedPatternFilter]);

  const uniqueDepts = useMemo(() => {
    return Array.from(new Set(assignments.map(a => a.dept)));
  }, [assignments]);

  return (
    <div className="space-y-6 mt-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-sm font-medium ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            {toastMessage.text}
          </div>
        </div>
      )}

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bulk Shift Assignments</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Assign, schedule, and rotate shifts across teams and departments
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            onClick={() => setShowFilterBar(prev => !prev)}
            className={`transition-all text-xs font-semibold ${
              showFilterBar || selectedDeptFilter !== 'All' || selectedShiftFilter !== 'All'
                ? 'bg-slate-100 dark:bg-slate-800 border-indigo-400 text-indigo-700 dark:text-indigo-300'
                : 'bg-white dark:bg-slate-900'
            }`}
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" /> 
            {showFilterBar ? 'Hide Filters' : 'Filter Roster'}
          </Button>
          <Button 
            onClick={handleOpenBulkAssign}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold text-xs transition-all"
          >
            <Users className="w-3.5 h-3.5 mr-1.5" /> 
            Assign Shifts {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
          </Button>
        </div>
      </div>

      {/* Expandable Filter Toolbar */}
      {showFilterBar && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-150">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Department</label>
            <select
              value={selectedDeptFilter}
              onChange={e => setSelectedDeptFilter(e.target.value)}
              className="w-full h-8 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Departments</option>
              {uniqueDepts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Shift Type</label>
            <select
              value={selectedShiftFilter}
              onChange={e => setSelectedShiftFilter(e.target.value)}
              className="w-full h-8 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Shifts</option>
              {AVAILABLE_SHIFTS.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Rotation Pattern</label>
            <select
              value={selectedPatternFilter}
              onChange={e => setSelectedPatternFilter(e.target.value)}
              className="w-full h-8 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Patterns</option>
              {ROTATION_PATTERNS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="shadow-xs border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search employee assignments..." 
                className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs" 
              />
            </div>
            {selectedIds.length > 0 && (
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <span>{selectedIds.length} employee(s) selected</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSelectedIds([])}
                  className="h-7 text-xs"
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 text-xs uppercase">
                <tr>
                  <th className="w-10 px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={filteredAssignments.length > 0 && selectedIds.length === filteredAssignments.length}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Current Shift</th>
                  <th className="px-6 py-4">Rotation Pattern</th>
                  <th className="px-6 py-4">Next Change</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-sm">No employee assignments match criteria</p>
                      <p className="text-xs text-slate-400 mt-0.5">Try resetting search or filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((a) => {
                    const isSelected = selectedIds.includes(String(a.id));
                    return (
                      <tr 
                        key={a.id} 
                        className={`transition-colors ${
                          isSelected 
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/30' 
                            : 'hover:bg-slate-50/70 dark:hover:bg-slate-900/40'
                        }`}
                      >
                        <td className="w-10 px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(String(a.id))}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs">
                            {a.employee.charAt(0)}
                          </div>
                          {a.employee}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{a.dept}</td>
                        <td className="px-6 py-4">
                          <span 
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: a.shift.includes('Morning') ? '#fef3c7' :
                                               a.shift.includes('Night') ? '#e0e7ff' :
                                               a.shift.includes('Evening') ? '#d1fae5' : '#dbeafe',
                              color: a.shift.includes('Morning') ? '#92400e' :
                                     a.shift.includes('Night') ? '#3730a3' :
                                     a.shift.includes('Evening') ? '#065f46' : '#1e40af'
                            }}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full" 
                              style={{ 
                                backgroundColor: a.shift.includes('Morning') ? '#f59e0b' :
                                                 a.shift.includes('Night') ? '#6366f1' :
                                                 a.shift.includes('Evening') ? '#10b981' : '#3b82f6'
                              }} 
                            />
                            {a.shift}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                          {a.pattern}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">
                          {a.nextChange}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenChangeShift(a)}
                            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                          >
                            Change
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Change Shift for Single Employee */}
      {changeShiftTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Change Shift Assignment
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Reassign shift for {changeShiftTarget.employee} ({changeShiftTarget.dept})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setChangeShiftTarget(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChangeShift} className="py-4 space-y-4">
              {/* Current Shift Indicator */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Current Shift</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{changeShiftTarget.shift}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Target Shift</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{changeForm.newShift}</span>
                </div>
              </div>

              {/* Select New Shift */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Shift *</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_SHIFTS.map(s => {
                    const isCurrentSelected = changeForm.newShift === s.name;
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setChangeForm(prev => ({ ...prev, newShift: s.name }))}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isCurrentSelected
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-xs ring-1 ring-indigo-500'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                          {isCurrentSelected && <Check className="w-3 h-3 text-indigo-600" />}
                        </div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{s.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{s.timing}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rotation Pattern & Effective Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Rotation Pattern</label>
                  <select
                    value={changeForm.pattern}
                    onChange={e => setChangeForm(prev => ({ ...prev, pattern: e.target.value }))}
                    className="w-full h-9 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {ROTATION_PATTERNS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Effective Date</label>
                  <Input 
                    type="date"
                    value={changeForm.effectiveDate}
                    onChange={e => setChangeForm(prev => ({ ...prev, effectiveDate: e.target.value }))}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-slate-100 dark:border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setChangeShiftTarget(null)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                >
                  Update Shift Assignment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bulk Assign Shifts */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Bulk Shift Assignment
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Assign shifts simultaneously to selected employees or whole department
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBulkAssign} className="py-4 space-y-4">
              {/* Target Shift Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Assign Shift *</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_SHIFTS.map(s => {
                    const isSelected = bulkForm.targetShift === s.name;
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setBulkForm(prev => ({ ...prev, targetShift: s.name }))}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-xs ring-1 ring-indigo-500'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                          {isSelected && <Check className="w-3 h-3 text-indigo-600" />}
                        </div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{s.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{s.timing}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rotation & Effective Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Rotation Schedule</label>
                  <select
                    value={bulkForm.pattern}
                    onChange={e => setBulkForm(prev => ({ ...prev, pattern: e.target.value }))}
                    className="w-full h-9 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {ROTATION_PATTERNS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Effective Date</label>
                  <Input 
                    type="date"
                    value={bulkForm.effectiveDate}
                    onChange={e => setBulkForm(prev => ({ ...prev, effectiveDate: e.target.value }))}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Employee Selection List */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Employees ({bulkForm.selectedEmployeeIds.length} selected)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (bulkForm.selectedEmployeeIds.length === assignments.length) {
                        setBulkForm(prev => ({ ...prev, selectedEmployeeIds: [] }));
                      } else {
                        setBulkForm(prev => ({ ...prev, selectedEmployeeIds: assignments.map(a => String(a.id)) }));
                      }
                    }}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    {bulkForm.selectedEmployeeIds.length === assignments.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                <div className="max-h-36 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 bg-slate-50/50 dark:bg-slate-950/50">
                  {assignments.map(a => {
                    const isChecked = bulkForm.selectedEmployeeIds.includes(String(a.id));
                    return (
                      <label 
                        key={a.id} 
                        className="flex items-center justify-between p-1.5 hover:bg-slate-100/70 dark:hover:bg-slate-900 rounded-lg cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setBulkForm(prev => ({
                                ...prev,
                                selectedEmployeeIds: isChecked
                                  ? prev.selectedEmployeeIds.filter(id => id !== String(a.id))
                                  : [...prev.selectedEmployeeIds, String(a.id)]
                              }));
                            }}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className="font-semibold text-slate-900 dark:text-white">{a.employee}</span>
                          <span className="text-slate-400">({a.dept})</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] text-slate-500">{a.shift}</Badge>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-slate-100 dark:border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAssignModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                >
                  Apply Bulk Assignment ({bulkForm.selectedEmployeeIds.length})
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
