import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Edit3, Plus, CheckCircle, X, DollarSign, Users, 
  Building2, Layers, Calendar, Check, CreditCard, ArrowUpDown
} from 'lucide-react';

export interface EmployeeSalaryMapping {
  id: number;
  empCode: string;
  name: string;
  role: string;
  department: string;
  band: string;
  monthlyGross: number;
  annualCtc: number;
  currency: string;
  paymentMode: string;
  bankAccount: string;
  active: boolean;
  effectiveDate: string;
}

const INITIAL_EMPLOYEES: EmployeeSalaryMapping[] = [
  { 
    id: 1, 
    empCode: 'EMP-1001',
    name: 'Jane Smith', 
    role: 'Engineering Director', 
    department: 'Engineering',
    band: 'Management Band (Level 2)', 
    monthlyGross: 14200, 
    annualCtc: 170400,
    currency: 'USD',
    paymentMode: 'Direct Deposit / Bank Transfer',
    bankAccount: '•••• 4892',
    active: true,
    effectiveDate: '2026-01-01'
  },
  { 
    id: 2, 
    empCode: 'EMP-1002',
    name: 'Michael Brown', 
    role: 'Senior Developer', 
    department: 'Engineering',
    band: 'Professional Band (Level 3)', 
    monthlyGross: 8500, 
    annualCtc: 102000,
    currency: 'USD',
    paymentMode: 'Direct Deposit / Bank Transfer',
    bankAccount: '•••• 3109',
    active: true,
    effectiveDate: '2026-01-01'
  },
  { 
    id: 3, 
    empCode: 'EMP-1003',
    name: 'Sarah Connor', 
    role: 'VP of Global Sales', 
    department: 'Sales',
    band: 'Executive Band (Level 1)', 
    monthlyGross: 13500, 
    annualCtc: 162000,
    currency: 'USD',
    paymentMode: 'Direct Deposit / Bank Transfer',
    bankAccount: '•••• 9021',
    active: true,
    effectiveDate: '2026-03-01'
  },
  { 
    id: 4, 
    empCode: 'EMP-1004',
    name: 'John Doe', 
    role: 'Full Stack Engineer', 
    department: 'Engineering',
    band: 'Professional Band (Level 3)', 
    monthlyGross: 7500, 
    annualCtc: 90000,
    currency: 'USD',
    paymentMode: 'Direct Deposit / Bank Transfer',
    bankAccount: '•••• 7714',
    active: true,
    effectiveDate: '2026-02-15'
  },
  { 
    id: 5, 
    empCode: 'EMP-1005',
    name: 'Alex Rivera', 
    role: 'Marketing Lead', 
    department: 'Marketing',
    band: 'Management Band (Level 2)', 
    monthlyGross: 8700, 
    annualCtc: 104400,
    currency: 'USD',
    paymentMode: 'Direct Deposit / Bank Transfer',
    bankAccount: '•••• 6632',
    active: true,
    effectiveDate: '2026-01-15'
  },
  { 
    id: 6, 
    empCode: 'EMP-1006',
    name: 'David Kim', 
    role: 'DevOps Architect', 
    department: 'Engineering',
    band: 'Management Band (Level 2)', 
    monthlyGross: 11200, 
    annualCtc: 134400,
    currency: 'USD',
    paymentMode: 'Direct Deposit / Bank Transfer',
    bankAccount: '•••• 5521',
    active: true,
    effectiveDate: '2026-04-01'
  }
];

export function EmployeeSalaryList() {
  const [employees, setEmployees] = useState<EmployeeSalaryMapping[]>(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [bandFilter, setBandFilter] = useState('All');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSalaryMapping | null>(null);

  // Toast
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showNotification = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Edit Form State
  const [editForm, setEditForm] = useState({
    id: 0,
    name: '',
    empCode: '',
    role: '',
    department: '',
    band: '',
    monthlyGross: 0,
    annualCtc: 0,
    paymentMode: 'Direct Deposit / Bank Transfer',
    bankAccount: '',
    effectiveDate: '',
    active: true
  });

  // Add Form State
  const [addForm, setAddForm] = useState({
    name: '',
    empCode: '',
    role: '',
    department: 'Engineering',
    band: 'Professional Band (Level 3)',
    monthlyGross: 7000,
    annualCtc: 84000,
    paymentMode: 'Direct Deposit / Bank Transfer',
    bankAccount: '•••• 1234',
    effectiveDate: new Date().toISOString().split('T')[0],
    active: true
  });

  // Open Edit Modal
  const handleOpenEdit = (emp: EmployeeSalaryMapping) => {
    setSelectedEmployee(emp);
    setEditForm({
      id: emp.id,
      name: emp.name,
      empCode: emp.empCode,
      role: emp.role,
      department: emp.department,
      band: emp.band,
      monthlyGross: emp.monthlyGross,
      annualCtc: emp.annualCtc,
      paymentMode: emp.paymentMode,
      bankAccount: emp.bankAccount,
      effectiveDate: emp.effectiveDate,
      active: emp.active
    });
    setIsEditModalOpen(true);
  };

  // Save Edit Changes
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      showNotification('Validation Error', 'Employee Name is required.');
      return;
    }

    const updatedMonthly = Number(editForm.monthlyGross) || 0;
    const updatedCtc = updatedMonthly * 12;

    setEmployees(prev => prev.map(emp => {
      if (emp.id === editForm.id) {
        return {
          ...emp,
          name: editForm.name.trim(),
          role: editForm.role.trim(),
          department: editForm.department,
          band: editForm.band,
          monthlyGross: updatedMonthly,
          annualCtc: updatedCtc,
          paymentMode: editForm.paymentMode,
          bankAccount: editForm.bankAccount.trim(),
          effectiveDate: editForm.effectiveDate,
          active: editForm.active
        };
      }
      return emp;
    }));

    setIsEditModalOpen(false);
    showNotification('Salary Mapping Updated', `Compensation mapping for ${editForm.name} updated to $${updatedMonthly.toLocaleString()}/mo.`);
  };

  // Save Add Form
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      showNotification('Missing Information', 'Please enter employee name.');
      return;
    }

    const monthly = Number(addForm.monthlyGross) || 6000;
    const newEmp: EmployeeSalaryMapping = {
      id: Date.now(),
      empCode: addForm.empCode.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: addForm.name.trim(),
      role: addForm.role.trim() || 'Software Engineer',
      department: addForm.department,
      band: addForm.band,
      monthlyGross: monthly,
      annualCtc: monthly * 12,
      currency: 'USD',
      paymentMode: addForm.paymentMode,
      bankAccount: addForm.bankAccount.trim() || '•••• 0000',
      active: addForm.active,
      effectiveDate: addForm.effectiveDate
    };

    setEmployees(prev => [newEmp, ...prev]);
    setIsAddModalOpen(false);
    setAddForm({
      name: '',
      empCode: '',
      role: '',
      department: 'Engineering',
      band: 'Professional Band (Level 3)',
      monthlyGross: 7000,
      annualCtc: 84000,
      paymentMode: 'Direct Deposit / Bank Transfer',
      bankAccount: '•••• 1234',
      effectiveDate: new Date().toISOString().split('T')[0],
      active: true
    });
    showNotification('Employee Mapped', `${newEmp.name} assigned to ${newEmp.band}.`);
  };

  // Filtered List
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            emp.band.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
      const matchesBand = bandFilter === 'All' || emp.band === bandFilter;
      return matchesSearch && matchesDept && matchesBand;
    });
  }, [employees, searchQuery, departmentFilter, bandFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalCount = employees.length;
    const totalMonthly = employees.reduce((acc, e) => acc + e.monthlyGross, 0);
    const totalAnnual = totalMonthly * 12;
    const avgMonthly = totalCount > 0 ? Math.round(totalMonthly / totalCount) : 0;
    return { totalCount, totalMonthly, totalAnnual, avgMonthly };
  }, [employees]);

  return (
    <div className="space-y-6 mt-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-emerald-700 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50 border border-emerald-500/40">
          <CheckCircle className="w-5 h-5 text-emerald-200 shrink-0" />
          <div>
            <p className="font-semibold text-sm">{toast.title}</p>
            <p className="text-emerald-100 text-xs mt-0.5">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-3 text-emerald-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mapped Headcount</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.totalCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Active compensation profiles</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Monthly Commitment</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">${stats.totalMonthly.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total monthly gross payout</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Annualized Payroll</span>
            <ArrowUpDown className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-2">${stats.totalAnnual.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total enterprise CTC/year</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Average Monthly</span>
            <CreditCard className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">${stats.avgMonthly.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Per employee mean base</p>
        </div>
      </div>

      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Employee Salary Mapping</h2>
          <p className="text-xs text-slate-500 mt-0.5">Assign employees to salary structure bands, monthly gross brackets, and disbursement accounts</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Map Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-3 items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee, role, or ID..."
            className="pl-9 h-9 text-xs border-slate-200"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Department:</span>
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-9 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Salary Band:</span>
            <select 
              value={bandFilter}
              onChange={(e) => setBandFilter(e.target.value)}
              className="h-9 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700"
            >
              <option value="All">All Bands</option>
              <option value="Executive Band (Level 1)">Executive Band (Level 1)</option>
              <option value="Management Band (Level 2)">Management Band (Level 2)</option>
              <option value="Professional Band (Level 3)">Professional Band (Level 3)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Designation & Dept</th>
                  <th className="px-6 py-4">Salary Structure</th>
                  <th className="px-6 py-4">Monthly Gross</th>
                  <th className="px-6 py-4">Annual CTC</th>
                  <th className="px-6 py-4">Disbursement Mode</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-xs">
                      No employee salary mappings found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {e.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {e.empCode} • Eff: {e.effectiveDate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-800 font-medium text-xs">{e.role}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{e.department}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {e.band}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900 font-bold text-sm">
                          ${e.monthlyGross.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-400">Monthly Gross</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700 text-xs">
                        ${e.annualCtc.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-700 flex items-center gap-1 font-medium">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          {e.bankAccount}
                        </div>
                        <div className="text-[11px] text-slate-400">Direct Deposit</div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenEdit(e)}
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold text-xs px-2.5"
                          title="Edit salary mapping"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* EDIT EMPLOYEE SALARY MAPPING MODAL                        */}
      {/* ========================================================= */}
      {isEditModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-300" />
                  Edit Employee Compensation Mapping
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Update salary structure band, gross salary, and disbursement accounts for {selectedEmployee.name}.
                </p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400">Employee:</span>
                  <p className="font-bold text-slate-800 text-sm">{editForm.name}</p>
                </div>
                <div>
                  <span className="text-slate-400">Employee Code:</span>
                  <p className="font-semibold text-slate-800">{editForm.empCode}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Salary Structure Band <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={editForm.band}
                  onChange={(e) => setEditForm({ ...editForm, band: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none font-medium"
                >
                  <option value="Executive Band (Level 1)">Executive Band (Level 1) - $150,000 Median</option>
                  <option value="Management Band (Level 2)">Management Band (Level 2) - $90,000 Median</option>
                  <option value="Professional Band (Level 3)">Professional Band (Level 3) - $50,000 Median</option>
                  <option value="Associate / Entry Band (Level 4)">Associate / Entry Band (Level 4) - $35,000 Median</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Monthly Gross Salary ($) <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    min="1000"
                    step="100"
                    required
                    value={editForm.monthlyGross}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEditForm({ ...editForm, monthlyGross: val, annualCtc: val * 12 });
                    }}
                    className="border-slate-300 focus:border-indigo-500 font-bold text-indigo-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Calculated Annual CTC
                  </label>
                  <Input 
                    disabled
                    value={`$${(editForm.monthlyGross * 12).toLocaleString()}`}
                    className="bg-slate-50 font-bold text-slate-800 border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Disbursement Account
                  </label>
                  <Input 
                    placeholder="e.g. •••• 4892"
                    value={editForm.bankAccount}
                    onChange={(e) => setEditForm({ ...editForm, bankAccount: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Effective Revision Date
                  </label>
                  <Input 
                    type="date"
                    value={editForm.effectiveDate}
                    onChange={(e) => setEditForm({ ...editForm, effectiveDate: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <select 
                  value={editForm.paymentMode}
                  onChange={(e) => setEditForm({ ...editForm, paymentMode: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Direct Deposit / Bank Transfer">Direct Deposit / Bank Transfer</option>
                  <option value="Corporate Wire Transfer">Corporate Wire Transfer</option>
                  <option value="Manual Payroll Check">Manual Payroll Check</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAP NEW EMPLOYEE MODAL                                    */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-200" />
                  Map Employee to Salary Structure
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Assign compensation package and salary band to an employee.
                </p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Employee Name <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    required
                    placeholder="e.g. Robert Taylor"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Employee Code
                  </label>
                  <Input 
                    placeholder="e.g. EMP-1007"
                    value={addForm.empCode}
                    onChange={(e) => setAddForm({ ...addForm, empCode: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Role / Title
                  </label>
                  <Input 
                    placeholder="e.g. Senior Backend Engineer"
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <select 
                    value={addForm.department}
                    onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Salary Structure Band <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={addForm.band}
                  onChange={(e) => setAddForm({ ...addForm, band: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none font-medium"
                >
                  <option value="Executive Band (Level 1)">Executive Band (Level 1) - $150,000 Median</option>
                  <option value="Management Band (Level 2)">Management Band (Level 2) - $90,000 Median</option>
                  <option value="Professional Band (Level 3)">Professional Band (Level 3) - $50,000 Median</option>
                  <option value="Associate / Entry Band (Level 4)">Associate / Entry Band (Level 4) - $35,000 Median</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Monthly Gross Salary ($) <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    min="1000"
                    step="100"
                    required
                    value={addForm.monthlyGross}
                    onChange={(e) => setAddForm({ ...addForm, monthlyGross: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500 font-bold text-indigo-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bank Account
                  </label>
                  <Input 
                    placeholder="e.g. •••• 1234"
                    value={addForm.bankAccount}
                    onChange={(e) => setAddForm({ ...addForm, bankAccount: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Map Salary
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
