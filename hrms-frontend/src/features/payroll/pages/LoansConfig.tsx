import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Plus, CheckCircle, Search, DollarSign, Calendar, FileText, 
  Check, X, AlertCircle, Clock, CheckCircle2, XCircle, ArrowRight,
  ShieldCheck, Eye, CreditCard
} from 'lucide-react';

export interface EmployeeLoan {
  id: number;
  empCode: string;
  employee: string;
  department: string;
  loanType: 'Personal Loan' | 'Vehicle / Car Loan' | 'Home / Housing Loan' | 'Salary Advance' | 'Emergency Medical';
  principal: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  remainingBalance: number;
  disbursedDate?: string;
  status: 'Pending Approval' | 'Active' | 'Closed' | 'Rejected';
  purpose?: string;
  approverRemarks?: string;
}

const INITIAL_LOANS: EmployeeLoan[] = [
  { 
    id: 1, 
    empCode: 'EMP-1001',
    employee: 'Jane Smith', 
    department: 'Engineering',
    loanType: 'Personal Loan', 
    principal: 50000, 
    interestRate: 3.2,
    tenureMonths: 12,
    monthlyEmi: 4300, 
    remainingBalance: 30000, 
    disbursedDate: '2026-03-01',
    status: 'Active',
    purpose: 'Home renovation and relocation expenses.',
    approverRemarks: 'Approved based on tenure and performance record.'
  },
  { 
    id: 2, 
    empCode: 'EMP-1002',
    employee: 'Michael Brown', 
    department: 'Engineering',
    loanType: 'Vehicle / Car Loan', 
    principal: 150000, 
    interestRate: 0,
    tenureMonths: 12,
    monthlyEmi: 12500, 
    remainingBalance: 150000, 
    status: 'Pending Approval',
    purpose: 'Electric vehicle purchase under corporate green commuter scheme.',
    approverRemarks: ''
  },
  {
    id: 3,
    empCode: 'EMP-1004',
    employee: 'John Doe',
    department: 'Engineering',
    loanType: 'Salary Advance',
    principal: 3500,
    interestRate: 0,
    tenureMonths: 2,
    monthlyEmi: 1750,
    remainingBalance: 1750,
    disbursedDate: '2026-08-01',
    status: 'Active',
    purpose: 'Urgent family relocation expense.',
    approverRemarks: 'Recoverable over 2 consecutive payroll cycles.'
  },
  {
    id: 4,
    empCode: 'EMP-1003',
    employee: 'Sarah Connor',
    department: 'Sales',
    loanType: 'Home / Housing Loan',
    principal: 200000,
    interestRate: 5.0,
    tenureMonths: 36,
    monthlyEmi: 6039,
    remainingBalance: 165000,
    disbursedDate: '2025-11-01',
    status: 'Active',
    purpose: 'Residential apartment purchase security margin.',
    approverRemarks: 'Executive loan package verified by Finance VP.'
  },
  {
    id: 5,
    empCode: 'EMP-1006',
    employee: 'David Kim',
    department: 'Engineering',
    loanType: 'Emergency Medical',
    principal: 10000,
    interestRate: 0,
    tenureMonths: 6,
    monthlyEmi: 1667,
    remainingBalance: 0,
    disbursedDate: '2026-01-15',
    status: 'Closed',
    purpose: 'Emergency medical hospitalization advance.',
    approverRemarks: 'Fully paid off in June 2026 payroll.'
  }
];

export function LoansConfig() {
  const [loans, setLoans] = useState<EmployeeLoan[]>(INITIAL_LOANS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<EmployeeLoan | null>(null);

  // Toast
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showNotification = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Create Form State
  const [createForm, setCreateForm] = useState({
    employee: '',
    empCode: '',
    department: 'Engineering',
    loanType: 'Personal Loan' as EmployeeLoan['loanType'],
    principal: 25000,
    interestRate: 4.0,
    tenureMonths: 12,
    purpose: '',
    status: 'Pending Approval' as EmployeeLoan['status']
  });

  // Calculated EMI for create form
  const calculatedCreateEmi = useMemo(() => {
    const p = Number(createForm.principal) || 0;
    const r = Number(createForm.interestRate) || 0;
    const t = Number(createForm.tenureMonths) || 1;
    const totalInterest = (p * r * (t / 12)) / 100;
    return Math.round((p + totalInterest) / t);
  }, [createForm.principal, createForm.interestRate, createForm.tenureMonths]);

  // Approval Form State
  const [approveRemarks, setApproveRemarks] = useState('');

  // Open Approval / Detail Modal
  const handleOpenAction = (loan: EmployeeLoan) => {
    setSelectedLoan(loan);
    setApproveRemarks(loan.approverRemarks || '');
    setIsApproveModalOpen(true);
  };

  // Submit Create Loan
  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.employee.trim()) {
      showNotification('Missing Information', 'Please provide the Employee Name.');
      return;
    }

    const principal = Number(createForm.principal) || 10000;
    const emi = calculatedCreateEmi;

    const newLoan: EmployeeLoan = {
      id: Date.now(),
      empCode: createForm.empCode.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      employee: createForm.employee.trim(),
      department: createForm.department,
      loanType: createForm.loanType,
      principal: principal,
      interestRate: Number(createForm.interestRate) || 0,
      tenureMonths: Number(createForm.tenureMonths) || 12,
      monthlyEmi: emi,
      remainingBalance: principal,
      status: createForm.status,
      disbursedDate: createForm.status === 'Active' ? new Date().toISOString().split('T')[0] : undefined,
      purpose: createForm.purpose.trim()
    };

    setLoans(prev => [newLoan, ...prev]);
    setIsCreateModalOpen(false);
    setCreateForm({
      employee: '',
      empCode: '',
      department: 'Engineering',
      loanType: 'Personal Loan',
      principal: 25000,
      interestRate: 4.0,
      tenureMonths: 12,
      purpose: '',
      status: 'Pending Approval'
    });
    showNotification('Loan Request Logged', `New loan request for ${newLoan.employee} registered (${newLoan.status}).`);
  };

  // Handle Approve Action
  const handleConfirmApproval = () => {
    if (!selectedLoan) return;

    setLoans(prev => prev.map(l => {
      if (l.id === selectedLoan.id) {
        return {
          ...l,
          status: 'Active',
          disbursedDate: new Date().toISOString().split('T')[0],
          approverRemarks: approveRemarks.trim() || 'Approved by HR Administrator.'
        };
      }
      return l;
    }));

    setIsApproveModalOpen(false);
    showNotification('Loan Approved & Disbursed', `Loan of $${selectedLoan.principal.toLocaleString()} for ${selectedLoan.employee} is now Active.`);
  };

  // Handle Reject Action
  const handleRejectLoan = () => {
    if (!selectedLoan) return;

    setLoans(prev => prev.map(l => {
      if (l.id === selectedLoan.id) {
        return {
          ...l,
          status: 'Rejected',
          approverRemarks: approveRemarks.trim() || 'Declined per company policy threshold.'
        };
      }
      return l;
    }));

    setIsApproveModalOpen(false);
    showNotification('Loan Request Rejected', `Loan application for ${selectedLoan.employee} has been rejected.`);
  };

  // Filtered Loans
  const filteredLoans = useMemo(() => {
    return loans.filter(l => {
      const matchesSearch = l.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            l.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            l.loanType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [loans, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalCount = loans.length;
    const activeLoans = loans.filter(l => l.status === 'Active');
    const pendingCount = loans.filter(l => l.status === 'Pending Approval').length;
    const monthlyRecovery = activeLoans.reduce((acc, l) => acc + l.monthlyEmi, 0);
    const totalRemaining = activeLoans.reduce((acc, l) => acc + l.remainingBalance, 0);
    return { totalCount, activeCount: activeLoans.length, pendingCount, monthlyRecovery, totalRemaining };
  }, [loans]);

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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Loans</span>
            <CreditCard className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.activeCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">${stats.totalRemaining.toLocaleString()} outstanding</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{stats.pendingCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Awaiting HR authorization</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Monthly EMI Recovery</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">${stats.monthlyRecovery.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Auto-deducted in payroll</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Total Portfolio</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">{stats.totalCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Loans, advances, & closed</p>
        </div>
      </div>

      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Loans & Advances</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage company loan disbursements, review employee requests, and configure payroll EMI recoveries</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Loan
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-3 items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee, ID, or loan type..."
            className="pl-9 h-9 text-xs border-slate-200"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Active">Active Loans</option>
            <option value="Closed">Closed / Paid</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Loans Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Loan Type</th>
                  <th className="px-6 py-4">Principal</th>
                  <th className="px-6 py-4">Monthly EMI</th>
                  <th className="px-6 py-4">Remaining Balance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-xs">
                      No loan or advance records found.
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {l.employee}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {l.empCode} • {l.department}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                          {l.loanType}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {l.tenureMonths} mos @ {l.interestRate}% int.
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ${l.principal.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-semibold text-indigo-700">
                        ${l.monthlyEmi.toLocaleString()}/mo
                      </td>
                      <td className="px-6 py-4 font-bold text-rose-600">
                        ${l.remainingBalance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          l.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          l.status === 'Pending Approval' ? 'bg-amber-100 text-amber-800' :
                          l.status === 'Closed' ? 'bg-blue-100 text-blue-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {l.status === 'Active' && <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />}
                          {l.status === 'Pending Approval' && <Clock className="w-3 h-3 mr-1 text-amber-600" />}
                          {l.status === 'Closed' && <CheckCircle2 className="w-3 h-3 mr-1 text-blue-600" />}
                          {l.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1 text-rose-600" />}
                          {l.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {l.status === 'Pending Approval' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleOpenAction(l)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 font-semibold text-xs px-3"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-600" />
                            Review / Approve
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenAction(l)}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold text-xs px-3"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Details
                          </Button>
                        )}
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
      {/* CREATE NEW LOAN MODAL                                     */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-200" />
                  Issue New Loan or Advance
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Configure principal, repayment tenure, and automated payroll EMI deductions.
                </p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Employee Name <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    required
                    placeholder="e.g. Robert Taylor"
                    value={createForm.employee}
                    onChange={(e) => setCreateForm({ ...createForm, employee: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Employee ID
                  </label>
                  <Input 
                    placeholder="e.g. EMP-1007"
                    value={createForm.empCode}
                    onChange={(e) => setCreateForm({ ...createForm, empCode: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Loan Category
                  </label>
                  <select 
                    value={createForm.loanType}
                    onChange={(e: any) => setCreateForm({ ...createForm, loanType: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Vehicle / Car Loan">Vehicle / Car Loan</option>
                    <option value="Home / Housing Loan">Home / Housing Loan</option>
                    <option value="Salary Advance">Salary Advance</option>
                    <option value="Emergency Medical">Emergency Medical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <select 
                    value={createForm.department}
                    onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Principal ($) <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    min="500"
                    step="500"
                    required
                    value={createForm.principal}
                    onChange={(e) => setCreateForm({ ...createForm, principal: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Interest (% p.a.)
                  </label>
                  <Input 
                    type="number"
                    min="0"
                    step="0.1"
                    value={createForm.interestRate}
                    onChange={(e) => setCreateForm({ ...createForm, interestRate: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tenure (Months)
                  </label>
                  <Input 
                    type="number"
                    min="1"
                    max="60"
                    value={createForm.tenureMonths}
                    onChange={(e) => setCreateForm({ ...createForm, tenureMonths: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Calculated Monthly EMI Box */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-xs text-indigo-900 font-semibold uppercase tracking-wider">Calculated Monthly EMI</span>
                  <p className="text-2xl font-black text-indigo-700 mt-0.5">
                    ${calculatedCreateEmi.toLocaleString()}
                    <span className="text-xs font-normal text-indigo-500"> / month</span>
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>Deduction starts next cycle</span>
                  <p className="font-semibold text-slate-700">{createForm.tenureMonths} equal installments</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Loan Justification / Purpose
                </label>
                <textarea 
                  rows={2}
                  placeholder="Reason for advance or loan request..."
                  value={createForm.purpose}
                  onChange={(e) => setCreateForm({ ...createForm, purpose: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Submit Loan Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* APPROVE / VIEW LOAN MODAL                                 */}
      {/* ========================================================= */}
      {isApproveModalOpen && selectedLoan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-300" />
                  {selectedLoan.status === 'Pending Approval' ? 'Review & Authorize Loan' : 'Loan & Repayment Schedule Details'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedLoan.employee} ({selectedLoan.empCode}) • {selectedLoan.loanType}
                </p>
              </div>
              <button 
                onClick={() => setIsApproveModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400">Principal Amount:</span>
                  <p className="font-bold text-slate-800 text-sm">${selectedLoan.principal.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-400">Monthly Payroll EMI:</span>
                  <p className="font-bold text-indigo-700 text-sm">${selectedLoan.monthlyEmi.toLocaleString()}/mo</p>
                </div>
                <div>
                  <span className="text-slate-400">Repayment Tenure:</span>
                  <p className="font-semibold text-slate-800">{selectedLoan.tenureMonths} Months ({selectedLoan.interestRate}% Interest)</p>
                </div>
                <div>
                  <span className="text-slate-400">Outstanding Balance:</span>
                  <p className="font-bold text-rose-600 text-sm">${selectedLoan.remainingBalance.toLocaleString()}</p>
                </div>
              </div>

              {selectedLoan.purpose && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee Justification</span>
                  <p className="text-xs text-slate-700 mt-1 bg-white p-3 rounded-lg border border-slate-200">
                    "{selectedLoan.purpose}"
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  HR Approver Notes / Audit Remarks
                </label>
                <textarea 
                  rows={2}
                  placeholder="Record verification notes, repayment terms, or disbursement memo..."
                  value={approveRemarks}
                  onChange={(e) => setApproveRemarks(e.target.value)}
                  className="w-full text-sm rounded-md border border-slate-300 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsApproveModalOpen(false)}
                >
                  Close
                </Button>

                {selectedLoan.status === 'Pending Approval' ? (
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleRejectLoan}
                      className="border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      <XCircle className="w-4 h-4 mr-1.5 text-rose-600" />
                      Reject
                    </Button>
                    <Button 
                      type="button"
                      onClick={handleConfirmApproval}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Approve & Disburse
                    </Button>
                  </div>
                ) : (
                  <Button 
                    type="button"
                    onClick={() => {
                      setIsApproveModalOpen(false);
                      showNotification('Remarks Saved', `Updated notes for ${selectedLoan.employee}.`);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    Save Notes
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
