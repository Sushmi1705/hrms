import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Plus, CheckCircle, Search, DollarSign, Calendar, FileText, 
  Check, X, AlertCircle, Clock, CheckCircle2, XCircle, 
  Receipt, ShieldCheck, Eye, ArrowRight, Tag
} from 'lucide-react';

export interface ReimbursementClaim {
  id: number;
  empCode: string;
  employee: string;
  department: string;
  type: 'Travel & Lodging' | 'Medical & Wellness' | 'Client Entertainment' | 'Fuel & Mileage' | 'Internet & Office Supplies';
  amount: number;
  claimDate: string;
  status: 'Pending' | 'Approved' | 'Disbursed in Payroll' | 'Rejected';
  receiptNumber?: string;
  description?: string;
  approverRemarks?: string;
  approvedDate?: string;
}

const INITIAL_CLAIMS: ReimbursementClaim[] = [
  { 
    id: 1, 
    empCode: 'EMP-1004',
    employee: 'John Doe', 
    department: 'Engineering',
    type: 'Travel & Lodging', 
    amount: 500, 
    claimDate: '2026-08-15', 
    status: 'Pending',
    receiptNumber: 'REC-8921',
    description: 'Flight tickets and taxi transit for on-site client platform integration in Chicago.',
    approverRemarks: ''
  },
  { 
    id: 2, 
    empCode: 'EMP-1001',
    employee: 'Jane Smith', 
    department: 'Engineering',
    type: 'Medical & Wellness', 
    amount: 150, 
    claimDate: '2026-08-10', 
    status: 'Approved',
    receiptNumber: 'REC-7734',
    description: 'Annual wellness checkup and prescription medical bills under company health policy.',
    approverRemarks: 'Approved under Section 17(2) medical allowance.',
    approvedDate: '2026-08-12'
  },
  {
    id: 3,
    empCode: 'EMP-1002',
    employee: 'Michael Brown',
    department: 'Engineering',
    type: 'Client Entertainment',
    amount: 320,
    claimDate: '2026-08-18',
    status: 'Pending',
    receiptNumber: 'REC-9912',
    description: 'Working dinner with enterprise prospective buyers and technical leads.',
    approverRemarks: ''
  },
  {
    id: 4,
    empCode: 'EMP-1003',
    employee: 'Sarah Connor',
    department: 'Sales',
    type: 'Fuel & Mileage',
    amount: 180,
    claimDate: '2026-08-05',
    status: 'Disbursed in Payroll',
    receiptNumber: 'REC-6641',
    description: 'Regional sales travel mileage across 4 partner distribution branches.',
    approverRemarks: 'Reimbursed in July 2026 payroll disbursement.',
    approvedDate: '2026-08-06'
  },
  {
    id: 5,
    empCode: 'EMP-1005',
    employee: 'Alex Rivera',
    department: 'Marketing',
    type: 'Internet & Office Supplies',
    amount: 85,
    claimDate: '2026-08-02',
    status: 'Approved',
    receiptNumber: 'REC-5519',
    description: 'Monthly home fiber broadband stipend for remote production work.',
    approverRemarks: 'Verified against telecom utility bill.',
    approvedDate: '2026-08-04'
  }
];

export function ReimbursementsConfig() {
  const [claims, setClaims] = useState<ReimbursementClaim[]>(INITIAL_CLAIMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ReimbursementClaim | null>(null);

  // Approval remarks
  const [approverNotes, setApproverNotes] = useState('');

  // Toast
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showNotification = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Add Form State
  const [addForm, setAddForm] = useState({
    employee: '',
    empCode: '',
    department: 'Engineering',
    type: 'Travel & Lodging' as ReimbursementClaim['type'],
    amount: 250,
    claimDate: new Date().toISOString().split('T')[0],
    receiptNumber: '',
    description: ''
  });

  // Open Review / Detail Modal
  const handleOpenReview = (claim: ReimbursementClaim) => {
    setSelectedClaim(claim);
    setApproverNotes(claim.approverRemarks || '');
    setIsReviewModalOpen(true);
  };

  // Confirm Approval Action
  const handleConfirmApproval = () => {
    if (!selectedClaim) return;

    setClaims(prev => prev.map(c => {
      if (c.id === selectedClaim.id) {
        return {
          ...c,
          status: 'Approved',
          approvedDate: new Date().toISOString().split('T')[0],
          approverRemarks: approverNotes.trim() || 'Approved by Payroll Administrator for salary disbursement.'
        };
      }
      return c;
    }));

    setIsReviewModalOpen(false);
    showNotification('Claim Approved', `$${selectedClaim.amount.toLocaleString()} for ${selectedClaim.employee} approved for August payroll.`);
  };

  // Reject Claim Action
  const handleRejectClaim = () => {
    if (!selectedClaim) return;

    setClaims(prev => prev.map(c => {
      if (c.id === selectedClaim.id) {
        return {
          ...c,
          status: 'Rejected',
          approverRemarks: approverNotes.trim() || 'Claim rejected per expense policy documentation criteria.'
        };
      }
      return c;
    }));

    setIsReviewModalOpen(false);
    showNotification('Claim Rejected', `Expense claim for ${selectedClaim.employee} has been rejected.`);
  };

  // Submit New Claim
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.employee.trim() || !addForm.amount) {
      showNotification('Missing Information', 'Employee Name and Amount are required.');
      return;
    }

    const newClaim: ReimbursementClaim = {
      id: Date.now(),
      empCode: addForm.empCode.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      employee: addForm.employee.trim(),
      department: addForm.department,
      type: addForm.type,
      amount: Number(addForm.amount) || 0,
      claimDate: addForm.claimDate,
      status: 'Pending',
      receiptNumber: addForm.receiptNumber.trim() || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      description: addForm.description.trim()
    };

    setClaims(prev => [newClaim, ...prev]);
    setIsAddModalOpen(false);
    setAddForm({
      employee: '',
      empCode: '',
      department: 'Engineering',
      type: 'Travel & Lodging',
      amount: 250,
      claimDate: new Date().toISOString().split('T')[0],
      receiptNumber: '',
      description: ''
    });
    showNotification('Claim Submitted', `Reimbursement request of $${newClaim.amount} submitted for approval.`);
  };

  // Filtered Claims
  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      const matchesSearch = c.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (c.receiptNumber && c.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            c.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || c.type === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [claims, searchQuery, statusFilter, categoryFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalCount = claims.length;
    const pendingClaims = claims.filter(c => c.status === 'Pending');
    const pendingSum = pendingClaims.reduce((acc, c) => acc + c.amount, 0);
    const approvedClaims = claims.filter(c => c.status === 'Approved');
    const approvedSum = approvedClaims.reduce((acc, c) => acc + c.amount, 0);
    const disbursedSum = claims.filter(c => c.status === 'Disbursed in Payroll').reduce((acc, c) => acc + c.amount, 0);
    return { totalCount, pendingCount: pendingClaims.length, pendingSum, approvedSum, disbursedSum };
  }, [claims]);

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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Claims</span>
            <Receipt className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.totalCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Recorded expense filings</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">${stats.pendingSum.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">{stats.pendingCount} claims awaiting sign-off</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Ready for August Pay</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">${stats.approvedSum.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Approved tax-exempt claims</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Disbursed to Date</span>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">${stats.disbursedSum.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Settled in prior cycles</p>
        </div>
      </div>

      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Employee Expense Reimbursements</h2>
          <p className="text-xs text-slate-500 mt-0.5">Authorize employee business expenses, verify receipt vouchers, and queue claims for monthly payroll payouts</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Claim
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-3 items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee, receipt number..."
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
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Disbursed in Payroll">Disbursed in Payroll</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Category:</span>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700"
            >
              <option value="All">All Categories</option>
              <option value="Travel & Lodging">Travel & Lodging</option>
              <option value="Medical & Wellness">Medical & Wellness</option>
              <option value="Client Entertainment">Client Entertainment</option>
              <option value="Fuel & Mileage">Fuel & Mileage</option>
              <option value="Internet & Office Supplies">Internet & Office Supplies</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Claim Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Filing Date</th>
                  <th className="px-6 py-4">Receipt Ref</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-xs">
                      No reimbursement claims found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {c.employee}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {c.empCode} • {c.department}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {c.type}
                        </span>
                        {c.description && (
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-xs">
                            {c.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                        ${c.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                        {c.claimDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {c.receiptNumber || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          c.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          c.status === 'Disbursed in Payroll' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {c.status === 'Approved' && <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />}
                          {c.status === 'Pending' && <Clock className="w-3 h-3 mr-1 text-amber-600" />}
                          {c.status === 'Disbursed in Payroll' && <CheckCircle2 className="w-3 h-3 mr-1 text-indigo-600" />}
                          {c.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1 text-rose-600" />}
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {c.status === 'Pending' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleOpenReview(c)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold text-xs px-3"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            Review & Approve
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenReview(c)}
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
      {/* SUBMIT NEW CLAIM MODAL                                    */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-indigo-200" />
                  Submit Reimbursement Claim
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  File an employee business expense claim for verification and payroll payout.
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
                    value={addForm.employee}
                    onChange={(e) => setAddForm({ ...addForm, employee: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Employee ID
                  </label>
                  <Input 
                    placeholder="e.g. EMP-1007"
                    value={addForm.empCode}
                    onChange={(e) => setAddForm({ ...addForm, empCode: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Expense Category <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    value={addForm.type}
                    onChange={(e: any) => setAddForm({ ...addForm, type: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Travel & Lodging">Travel & Lodging</option>
                    <option value="Medical & Wellness">Medical & Wellness</option>
                    <option value="Client Entertainment">Client Entertainment</option>
                    <option value="Fuel & Mileage">Fuel & Mileage</option>
                    <option value="Internet & Office Supplies">Internet & Office Supplies</option>
                  </select>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Claim Amount ($) <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={addForm.amount}
                    onChange={(e) => setAddForm({ ...addForm, amount: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500 font-bold text-slate-800 text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Receipt / Invoice Ref
                  </label>
                  <Input 
                    placeholder="e.g. REC-9921"
                    value={addForm.receiptNumber}
                    onChange={(e) => setAddForm({ ...addForm, receiptNumber: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500 uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Expense Description & Business Justification
                </label>
                <textarea 
                  rows={2}
                  placeholder="Detail the purpose of the business expenditure and attached invoice details..."
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
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
                  Submit Claim
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* REVIEW & APPROVE CLAIM MODAL                              */}
      {/* ========================================================= */}
      {isReviewModalOpen && selectedClaim && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-indigo-300" />
                  {selectedClaim.status === 'Pending' ? 'Review & Authorize Reimbursement' : 'Reimbursement Claim Details'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedClaim.employee} ({selectedClaim.empCode}) • Receipt: {selectedClaim.receiptNumber || 'None'}
                </p>
              </div>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400">Claim Category:</span>
                  <p className="font-bold text-slate-800 text-sm">{selectedClaim.type}</p>
                </div>
                <div>
                  <span className="text-slate-400">Payable Amount:</span>
                  <p className="font-black text-emerald-700 text-base">${selectedClaim.amount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-400">Filing Date:</span>
                  <p className="font-semibold text-slate-800">{selectedClaim.claimDate}</p>
                </div>
                <div>
                  <span className="text-slate-400">Payroll Cycle:</span>
                  <p className="font-semibold text-indigo-600">August 2026 Disbursement</p>
                </div>
              </div>

              {selectedClaim.description && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Purpose</span>
                  <p className="text-xs text-slate-700 mt-1 bg-white p-3 rounded-lg border border-slate-200">
                    "{selectedClaim.description}"
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  HR Approver Notes / Audit Remarks
                </label>
                <textarea 
                  rows={2}
                  placeholder="Record verification notes, tax exemption status, or voucher clearance notes..."
                  value={approverNotes}
                  onChange={(e) => setApproverNotes(e.target.value)}
                  className="w-full text-sm rounded-md border border-slate-300 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  Close
                </Button>

                {selectedClaim.status === 'Pending' ? (
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleRejectClaim}
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
                      Approve for Payroll
                    </Button>
                  </div>
                ) : (
                  <Button 
                    type="button"
                    onClick={() => {
                      setIsReviewModalOpen(false);
                      showNotification('Remarks Saved', `Updated notes for ${selectedClaim.employee}.`);
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
