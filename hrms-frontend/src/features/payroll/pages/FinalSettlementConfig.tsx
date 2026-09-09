import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  CheckCircle2, Search, Eye, Download, Printer, Plus, 
  Building2, User, Calendar, CreditCard, X, ArrowUpRight, 
  ArrowDownRight, ShieldCheck, DollarSign, Clock, AlertTriangle, 
  FileText, Briefcase, Check, Send, Sparkles, Filter, ChevronRight
} from 'lucide-react';

export interface FinalSettlementRecord {
  id: number;
  empCode: string;
  employee: string;
  role: string;
  department: string;
  resignationDate: string;
  lastWorkingDay: string;
  tenureYears: number;
  reason: string;
  
  // Clearances
  hrClearance: 'Approved' | 'Pending';
  itAssetClearance: 'Approved' | 'Pending';
  financeClearance: 'Approved' | 'Pending';

  // Earnings & Dues
  unpaidDaysSalary: number;
  unpaidDaysCount: number;
  leaveEncashmentDays: number;
  leaveEncashmentAmount: number;
  gratuityAmount: number;
  bonusOrIncentives: number;
  grossDues: number;

  // Deductions & Recoveries
  noticeShortfallDays: number;
  noticeRecoveryAmount: number;
  loanBalanceDeduction: number;
  assetDamageRecovery: number;
  taxDeductionTds: number;
  totalDeductions: number;

  netPayable: number;
  settlementStatus: 'Settled' | 'Pending Approval' | 'Under Review';
  paymentDate?: string;
  bankRef?: string;
}

const INITIAL_SETTLEMENTS: FinalSettlementRecord[] = [
  {
    id: 1,
    empCode: 'EMP-1042',
    employee: 'Marcus Vance',
    role: 'Lead Cloud Architect',
    department: 'Engineering',
    resignationDate: '15 Jul 2026',
    lastWorkingDay: '15 Aug 2026',
    tenureYears: 4.5,
    reason: 'Career Opportunity Abroad',
    hrClearance: 'Approved',
    itAssetClearance: 'Approved',
    financeClearance: 'Approved',
    unpaidDaysSalary: 3850,
    unpaidDaysCount: 15,
    leaveEncashmentDays: 14,
    leaveEncashmentAmount: 2450,
    gratuityAmount: 7200,
    bonusOrIncentives: 1500,
    grossDues: 15000,
    noticeShortfallDays: 0,
    noticeRecoveryAmount: 0,
    loanBalanceDeduction: 0,
    assetDamageRecovery: 0,
    taxDeductionTds: 1850,
    totalDeductions: 1850,
    netPayable: 13150,
    settlementStatus: 'Settled',
    paymentDate: '28 Aug 2026',
    bankRef: 'ACH-7729104'
  },
  {
    id: 2,
    empCode: 'EMP-1088',
    employee: 'Eleanor Davis',
    role: 'Product Marketing Manager',
    department: 'Marketing',
    resignationDate: '01 Aug 2026',
    lastWorkingDay: '31 Aug 2026',
    tenureYears: 3.2,
    reason: 'Personal Relocation',
    hrClearance: 'Approved',
    itAssetClearance: 'Approved',
    financeClearance: 'Pending',
    unpaidDaysSalary: 5200,
    unpaidDaysCount: 22,
    leaveEncashmentDays: 18,
    leaveEncashmentAmount: 2700,
    gratuityAmount: 4800,
    bonusOrIncentives: 800,
    grossDues: 13500,
    noticeShortfallDays: 0,
    noticeRecoveryAmount: 0,
    loanBalanceDeduction: 1200,
    assetDamageRecovery: 0,
    taxDeductionTds: 1450,
    totalDeductions: 2650,
    netPayable: 10850,
    settlementStatus: 'Pending Approval',
  },
  {
    id: 3,
    empCode: 'EMP-1115',
    employee: 'Robert Zhang',
    role: 'Full Stack Engineer',
    department: 'Engineering',
    resignationDate: '20 Jul 2026',
    lastWorkingDay: '20 Aug 2026',
    tenureYears: 2.1,
    reason: 'Further Higher Studies',
    hrClearance: 'Approved',
    itAssetClearance: 'Pending',
    financeClearance: 'Pending',
    unpaidDaysSalary: 3100,
    unpaidDaysCount: 14,
    leaveEncashmentDays: 8,
    leaveEncashmentAmount: 1120,
    gratuityAmount: 0, // < 5 years statutory threshold
    bonusOrIncentives: 450,
    grossDues: 4670,
    noticeShortfallDays: 10,
    noticeRecoveryAmount: 1250,
    loanBalanceDeduction: 0,
    assetDamageRecovery: 150,
    taxDeductionTds: 420,
    totalDeductions: 1820,
    netPayable: 2850,
    settlementStatus: 'Under Review',
  },
  {
    id: 4,
    empCode: 'EMP-1065',
    employee: 'Sophia Patel',
    role: 'Senior UI/UX Designer',
    department: 'Design',
    resignationDate: '10 Aug 2026',
    lastWorkingDay: '05 Sep 2026',
    tenureYears: 3.8,
    reason: 'Entrepreneurial Venture',
    hrClearance: 'Approved',
    itAssetClearance: 'Approved',
    financeClearance: 'Pending',
    unpaidDaysSalary: 4400,
    unpaidDaysCount: 20,
    leaveEncashmentDays: 12,
    leaveEncashmentAmount: 1920,
    gratuityAmount: 5100,
    bonusOrIncentives: 1000,
    grossDues: 12420,
    noticeShortfallDays: 0,
    noticeRecoveryAmount: 0,
    loanBalanceDeduction: 0,
    assetDamageRecovery: 0,
    taxDeductionTds: 1350,
    totalDeductions: 1350,
    netPayable: 11070,
    settlementStatus: 'Pending Approval',
  }
];

export function FinalSettlementConfig() {
  const [settlements, setSettlements] = useState<FinalSettlementRecord[]>(INITIAL_SETTLEMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  
  // Modals
  const [selectedSettlement, setSelectedSettlement] = useState<FinalSettlementRecord | null>(null);
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  
  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'success' | 'info' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // New settlement form state
  const [newForm, setNewForm] = useState({
    empCode: '',
    employee: '',
    role: '',
    department: 'Engineering',
    resignationDate: '2026-08-15',
    lastWorkingDay: '2026-09-15',
    tenureYears: 3,
    reason: 'Personal Reasons',
    unpaidDaysSalary: 4500,
    unpaidDaysCount: 20,
    leaveEncashmentDays: 10,
    leaveEncashmentAmount: 1500,
    gratuityAmount: 4000,
    bonusOrIncentives: 500,
    noticeShortfallDays: 0,
    noticeRecoveryAmount: 0,
    loanBalanceDeduction: 0,
    assetDamageRecovery: 0,
    taxDeductionTds: 1200
  });

  // Filtered settlements
  const filteredSettlements = useMemo(() => {
    return settlements.filter(s => {
      const matchSearch = 
        s.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.reason.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'All' || s.settlementStatus === statusFilter;
      const matchDept = deptFilter === 'All' || s.department === deptFilter;

      return matchSearch && matchStatus && matchDept;
    });
  }, [settlements, searchTerm, statusFilter, deptFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = settlements.length;
    const pending = settlements.filter(s => s.settlementStatus !== 'Settled').length;
    const settled = settlements.filter(s => s.settlementStatus === 'Settled').length;
    const totalPayout = settlements.reduce((sum, s) => sum + s.netPayable, 0);
    return { total, pending, settled, totalPayout };
  }, [settlements]);

  // Download statement as formatted text/slip
  const handleDownloadStatement = (s: FinalSettlementRecord) => {
    const content = `
================================================================================
                    ANRAONE ENTERPRISES INC.
                 FULL & FINAL (F&F) SETTLEMENT STATEMENT
================================================================================
Employee Code     : ${s.empCode}
Employee Name     : ${s.employee}
Designation       : ${s.role}
Department        : ${s.department}
Resignation Date  : ${s.resignationDate}
Last Working Day  : ${s.lastWorkingDay}
Tenure of Service : ${s.tenureYears} Years
Reason for Exit   : ${s.reason}
Settlement Status : ${s.settlementStatus.toUpperCase()}
${s.bankRef ? `Payment Ref       : ${s.bankRef} (${s.paymentDate})` : ''}

--------------------------------------------------------------------------------
CLEARANCE AUDIT SUMMARY
--------------------------------------------------------------------------------
HR & Policy Clearance     : [${s.hrClearance.toUpperCase()}]
IT & Asset Recoveries     : [${s.itAssetClearance.toUpperCase()}]
Finance & Accounts Check  : [${s.financeClearance.toUpperCase()}]

--------------------------------------------------------------------------------
1. EARNINGS & ACCRUED DUES
--------------------------------------------------------------------------------
  Unpaid Salary (${s.unpaidDaysCount} days)             : $${s.unpaidDaysSalary.toLocaleString()}
  Earned Leave Encashment (${s.leaveEncashmentDays} days)     : $${s.leaveEncashmentAmount.toLocaleString()}
  Statutory Gratuity Benefit          : $${s.gratuityAmount.toLocaleString()}
  Pending Incentives / Performance    : $${s.bonusOrIncentives.toLocaleString()}
  -------------------------------------------------------------
  GROSS PAYABLE DUES                  : $${s.grossDues.toLocaleString()}

--------------------------------------------------------------------------------
2. RECOVERIES & STATUTORY DEDUCTIONS
--------------------------------------------------------------------------------
  Notice Period Shortfall (${s.noticeShortfallDays} days)    : $${s.noticeRecoveryAmount.toLocaleString()}
  Outstanding Loan / Advance Balance  : $${s.loanBalanceDeduction.toLocaleString()}
  Asset Damage / Loss Recovery        : $${s.assetDamageRecovery.toLocaleString()}
  Final Income Tax Withholding (TDS)  : $${s.taxDeductionTds.toLocaleString()}
  -------------------------------------------------------------
  TOTAL RECOVERIES & DEDUCTIONS       : $${s.totalDeductions.toLocaleString()}

================================================================================
NET FULL & FINAL SETTLEMENT PAYOUT    : $${s.netPayable.toLocaleString()}
================================================================================
Generated on: ${new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
Authorized by: Payroll & Finance Department
ANRAONE ENTERPRISES INC. - HRMS Division
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FF_Settlement_${s.empCode}_${s.employee.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Statement Downloaded', `F&F voucher downloaded for ${s.employee}`);
  };

  // Approve & Disburse
  const handleApproveSettlement = (id: number) => {
    setSettlements(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          hrClearance: 'Approved',
          itAssetClearance: 'Approved',
          financeClearance: 'Approved',
          settlementStatus: 'Settled',
          paymentDate: 'Today',
          bankRef: `ACH-${Math.floor(1000000 + Math.random() * 9000000)}`
        };
      }
      return s;
    }));
    
    if (selectedSettlement && selectedSettlement.id === id) {
      setSelectedSettlement(prev => prev ? {
        ...prev,
        hrClearance: 'Approved',
        itAssetClearance: 'Approved',
        financeClearance: 'Approved',
        settlementStatus: 'Settled',
        paymentDate: 'Today',
        bankRef: `ACH-${Math.floor(1000000 + Math.random() * 9000000)}`
      } : null);
    }

    showToast('Settlement Approved & Disbursed', 'Full & Final payment marked as complete with Bank Transfer Reference generated.');
  };

  // Initiate new settlement
  const handleInitiateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.employee || !newForm.empCode) {
      showToast('Validation Error', 'Please specify Employee Code and Name', 'info');
      return;
    }

    const grossDues = Number(newForm.unpaidDaysSalary) + Number(newForm.leaveEncashmentAmount) + Number(newForm.gratuityAmount) + Number(newForm.bonusOrIncentives);
    const totalDeductions = Number(newForm.noticeRecoveryAmount) + Number(newForm.loanBalanceDeduction) + Number(newForm.assetDamageRecovery) + Number(newForm.taxDeductionTds);
    const netPayable = Math.max(0, grossDues - totalDeductions);

    const newRecord: FinalSettlementRecord = {
      id: Date.now(),
      empCode: newForm.empCode,
      employee: newForm.employee,
      role: newForm.role || 'Exiting Employee',
      department: newForm.department,
      resignationDate: newForm.resignationDate,
      lastWorkingDay: newForm.lastWorkingDay,
      tenureYears: Number(newForm.tenureYears),
      reason: newForm.reason,
      hrClearance: 'Approved',
      itAssetClearance: 'Pending',
      financeClearance: 'Pending',
      unpaidDaysSalary: Number(newForm.unpaidDaysSalary),
      unpaidDaysCount: Number(newForm.unpaidDaysCount),
      leaveEncashmentDays: Number(newForm.leaveEncashmentDays),
      leaveEncashmentAmount: Number(newForm.leaveEncashmentAmount),
      gratuityAmount: Number(newForm.gratuityAmount),
      bonusOrIncentives: Number(newForm.bonusOrIncentives),
      grossDues,
      noticeShortfallDays: Number(newForm.noticeShortfallDays),
      noticeRecoveryAmount: Number(newForm.noticeRecoveryAmount),
      loanBalanceDeduction: Number(newForm.loanBalanceDeduction),
      assetDamageRecovery: Number(newForm.assetDamageRecovery),
      taxDeductionTds: Number(newForm.taxDeductionTds),
      totalDeductions,
      netPayable,
      settlementStatus: 'Under Review'
    };

    setSettlements([newRecord, ...settlements]);
    setIsInitiateModalOpen(false);
    showToast('F&F Initiated', `Full & Final settlement workflow initialized for ${newRecord.employee}`);
  };

  return (
    <div className="space-y-6 mt-6 relative pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 ${toastMessage.type === 'info' ? 'bg-blue-600' : 'bg-emerald-600'} text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{toastMessage.title}</p>
            <p className="text-xs text-white/90">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Final Settlement (Full & Final Exit)
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              F&F Module
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Calculate exit clearance, leave encashment, statutory gratuity, recoveries, and disburse official severance packages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsInitiateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Initiate F&F Settlement
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Settlements</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
              <span className="text-xs text-slate-500">Exited personnel</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Clearance</p>
              <h3 className="text-2xl font-bold text-amber-600">{stats.pending}</h3>
              <span className="text-xs text-amber-600/80 font-medium">Awaiting signoffs</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Settled & Disbursed</p>
              <h3 className="text-2xl font-bold text-emerald-600">{stats.settled}</h3>
              <span className="text-xs text-emerald-600/80 font-medium">Payment completed</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Net Disbursed</p>
              <h3 className="text-2xl font-bold text-slate-900">${stats.totalPayout.toLocaleString()}</h3>
              <span className="text-xs text-slate-500">Full & Final payouts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by employee, code, role..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 text-sm focus-visible:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Settled">Settled</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Department:</span>
                <select
                  value={deptFilter}
                  onChange={e => setDeptFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settlement Records Table */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Exit Dates</th>
                <th className="py-3.5 px-4">Clearance Audit</th>
                <th className="py-3.5 px-4 text-right">Gross Dues</th>
                <th className="py-3.5 px-4 text-right">Deductions</th>
                <th className="py-3.5 px-4 text-right">Net Payable</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSettlements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No settlement records found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search criteria or initiate a new F&F settlement.</p>
                  </td>
                </tr>
              ) : (
                filteredSettlements.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                          {item.employee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-snug">{item.employee}</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span>{item.empCode}</span>
                            <span>•</span>
                            <span>{item.role}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs">
                        <span className="text-slate-500">LWD: </span>
                        <span className="font-medium text-slate-800">{item.lastWorkingDay}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Resigned: {item.resignationDate} ({item.tenureYears} yrs service)
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${item.hrClearance === 'Approved' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                          <span className="text-slate-600">HR Clearance:</span>
                          <span className={item.hrClearance === 'Approved' ? 'text-emerald-700 font-medium' : 'text-amber-600 font-medium'}>
                            {item.hrClearance}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${item.itAssetClearance === 'Approved' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                          <span className="text-slate-600">IT / Assets:</span>
                          <span className={item.itAssetClearance === 'Approved' ? 'text-emerald-700 font-medium' : 'text-amber-600 font-medium'}>
                            {item.itAssetClearance}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                      ${item.grossDues.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-rose-600">
                      -${item.totalDeductions.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                      ${item.netPayable.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.settlementStatus === 'Settled'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.settlementStatus === 'Pending Approval'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.settlementStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => setSelectedSettlement(item)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 text-xs text-indigo-600 hover:bg-indigo-50 border-indigo-200 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Statement
                        </Button>

                        <Button
                          onClick={() => handleDownloadStatement(item)}
                          variant="ghost"
                          size="sm"
                          title="Download F&F slip"
                          className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                          <Download className="w-4 h-4" />
                        </Button>

                        {item.settlementStatus !== 'Settled' && (
                          <Button
                            onClick={() => handleApproveSettlement(item.id)}
                            size="sm"
                            className="h-8 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Disburse
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: Full & Final Settlement Detailed Statement (Voucher) */}
      {selectedSettlement && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Full & Final (F&F) Settlement Voucher</h3>
                  <p className="text-xs text-slate-400">Official exit severance calculation & audit clearance</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSettlement(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Printable Voucher */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Corporate Letterhead Banner */}
              <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-base tracking-wide">ANRAONE ENTERPRISES INC.</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Enterprise HR & People Operations • Payroll Division</p>
                  <p className="text-xs text-slate-400">100 Tech Boulevard, Suite 500, San Francisco, CA</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                    selectedSettlement.settlementStatus === 'Settled'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedSettlement.settlementStatus.toUpperCase()}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Voucher ID: FF-{selectedSettlement.id.toString().slice(-6)}
                  </p>
                  {selectedSettlement.bankRef && (
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">
                      Bank Ref: {selectedSettlement.bankRef}
                    </p>
                  )}
                </div>
              </div>

              {/* Employee & Exit Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Employee Name</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedSettlement.employee}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Employee Code</span>
                  <span className="font-semibold text-slate-800">{selectedSettlement.empCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Designation</span>
                  <span className="font-semibold text-slate-800">{selectedSettlement.role}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Department</span>
                  <span className="font-semibold text-slate-800">{selectedSettlement.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Resignation Date</span>
                  <span className="font-semibold text-slate-800">{selectedSettlement.resignationDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Last Working Day</span>
                  <span className="font-semibold text-slate-800">{selectedSettlement.lastWorkingDay}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Service Tenure</span>
                  <span className="font-semibold text-slate-800">{selectedSettlement.tenureYears} Years</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Reason for Leaving</span>
                  <span className="font-semibold text-slate-800 truncate block">{selectedSettlement.reason}</span>
                </div>
              </div>

              {/* Clearance Audits */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Departmental Clearance Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-700">HR & Policy</p>
                      <p className="text-[11px] text-slate-400">Exit interview & NOC</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${selectedSettlement.hrClearance === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {selectedSettlement.hrClearance}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-700">IT / Assets</p>
                      <p className="text-[11px] text-slate-400">Laptop, badges, tokens</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${selectedSettlement.itAssetClearance === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {selectedSettlement.itAssetClearance}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-700">Finance & Accounts</p>
                      <p className="text-[11px] text-slate-400">Loan & travel advances</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${selectedSettlement.financeClearance === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {selectedSettlement.financeClearance}
                    </span>
                  </div>
                </div>
              </div>

              {/* Itemized Calculation Ledger */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Earnings & Accruals */}
                <div className="border border-emerald-200/80 rounded-xl overflow-hidden">
                  <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 font-bold text-emerald-800 flex justify-between">
                    <span>Payable Earnings & Dues</span>
                    <span>Amount ($)</span>
                  </div>
                  <div className="p-4 space-y-2.5 text-slate-700">
                    <div className="flex justify-between">
                      <div>
                        <span>Unpaid Salary</span>
                        <span className="text-slate-400 text-[11px] block">{selectedSettlement.unpaidDaysCount} active days worked</span>
                      </div>
                      <span className="font-semibold">${selectedSettlement.unpaidDaysSalary.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <span>Earned Leave Encashment</span>
                        <span className="text-slate-400 text-[11px] block">{selectedSettlement.leaveEncashmentDays} accumulated leaves</span>
                      </div>
                      <span className="font-semibold">${selectedSettlement.leaveEncashmentAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <span>Statutory Gratuity</span>
                        <span className="text-slate-400 text-[11px] block">{selectedSettlement.tenureYears >= 5 ? 'Eligible (>5 yrs)' : 'Discretionary / Tenure prorated'}</span>
                      </div>
                      <span className="font-semibold">${selectedSettlement.gratuityAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <span>Pending Incentives / Bonus</span>
                        <span className="text-slate-400 text-[11px] block">Approved performance claim</span>
                      </div>
                      <span className="font-semibold">${selectedSettlement.bonusOrIncentives.toLocaleString()}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-emerald-700 text-sm">
                      <span>Total Gross Dues (A)</span>
                      <span>${selectedSettlement.grossDues.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions & Recoveries */}
                <div className="border border-rose-200/80 rounded-xl overflow-hidden">
                  <div className="bg-rose-50 px-4 py-2.5 border-b border-rose-100 font-bold text-rose-800 flex justify-between">
                    <span>Recoveries & Deductions</span>
                    <span>Amount ($)</span>
                  </div>
                  <div className="p-4 space-y-2.5 text-slate-700">
                    <div className="flex justify-between">
                      <div>
                        <span>Notice Shortfall Recovery</span>
                        <span className="text-slate-400 text-[11px] block">{selectedSettlement.noticeShortfallDays} days shortfall</span>
                      </div>
                      <span className="font-semibold">${selectedSettlement.noticeRecoveryAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <span>Loan / Advance Outstanding</span>
                        <span className="text-slate-400 text-[11px] block">Company loan closure</span>
                      </div>
                      <span className="font-semibold">${selectedSettlement.loanBalanceDeduction.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <span>Asset Damage / Loss</span>
                        <span className="text-slate-400 text-[11px] block">Hardware replacement charge</span>
                      </div>
                      <span className="font-semibold">${selectedSettlement.assetDamageRecovery.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <span>Final Tax Withholding (TDS)</span>
                        <span className="text-slate-400 text-[11px] block">Statutory exit tax bracket</span>
                      </div>
                      <span className="font-semibold">${selectedSettlement.taxDeductionTds.toLocaleString()}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-rose-600 text-sm">
                      <span>Total Deductions (B)</span>
                      <span>${selectedSettlement.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Payable Highlight Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-emerald-600/20">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-emerald-100">
                    Net Full & Final Payable (A - B)
                  </p>
                  <p className="text-3xl font-extrabold tracking-tight mt-0.5">
                    ${selectedSettlement.netPayable.toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-100/90 mt-1">
                    Direct credit to verified bank account on record
                  </p>
                </div>
                {selectedSettlement.settlementStatus !== 'Settled' ? (
                  <Button
                    onClick={() => handleApproveSettlement(selectedSettlement.id)}
                    className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold shadow-md flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Approve & Disburse Payout
                  </Button>
                ) : (
                  <div className="bg-emerald-500/30 border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Disbursed on {selectedSettlement.paymentDate}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Statement
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleDownloadStatement(selectedSettlement)}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Download F&F Slip
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSettlement(null)}
                  className="border-slate-200 text-slate-600"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Initiate New F&F Settlement */}
      {isInitiateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5" />
                <h3 className="text-lg font-bold">Initiate Full & Final Settlement</h3>
              </div>
              <button
                onClick={() => setIsInitiateModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInitiateSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee Name *</label>
                  <Input
                    required
                    placeholder="e.g. Jordan Lee"
                    value={newForm.employee}
                    onChange={e => setNewForm({ ...newForm, employee: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee Code *</label>
                  <Input
                    required
                    placeholder="e.g. EMP-1099"
                    value={newForm.empCode}
                    onChange={e => setNewForm({ ...newForm, empCode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation / Role</label>
                  <Input
                    placeholder="e.g. Staff Software Engineer"
                    value={newForm.role}
                    onChange={e => setNewForm({ ...newForm, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newForm.department}
                    onChange={e => setNewForm({ ...newForm, department: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Resignation Date</label>
                  <Input
                    type="date"
                    value={newForm.resignationDate}
                    onChange={e => setNewForm({ ...newForm, resignationDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Working Day (LWD)</label>
                  <Input
                    type="date"
                    value={newForm.lastWorkingDay}
                    onChange={e => setNewForm({ ...newForm, lastWorkingDay: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Tenure (Years)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newForm.tenureYears}
                    onChange={e => setNewForm({ ...newForm, tenureYears: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Exit</label>
                  <Input
                    placeholder="e.g. Higher studies / Relocation"
                    value={newForm.reason}
                    onChange={e => setNewForm({ ...newForm, reason: e.target.value })}
                  />
                </div>
              </div>

              {/* Financial components */}
              <div className="pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
                  Earnings & Severance Additions ($)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Unpaid Days Salary ($)</label>
                    <Input
                      type="number"
                      value={newForm.unpaidDaysSalary}
                      onChange={e => setNewForm({ ...newForm, unpaidDaysSalary: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Leave Encashment ($)</label>
                    <Input
                      type="number"
                      value={newForm.leaveEncashmentAmount}
                      onChange={e => setNewForm({ ...newForm, leaveEncashmentAmount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Gratuity Benefit ($)</label>
                    <Input
                      type="number"
                      value={newForm.gratuityAmount}
                      onChange={e => setNewForm({ ...newForm, gratuityAmount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2">
                  Recoveries & Deductions ($)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Notice Shortfall ($)</label>
                    <Input
                      type="number"
                      value={newForm.noticeRecoveryAmount}
                      onChange={e => setNewForm({ ...newForm, noticeRecoveryAmount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Loan / Advance Balance ($)</label>
                    <Input
                      type="number"
                      value={newForm.loanBalanceDeduction}
                      onChange={e => setNewForm({ ...newForm, loanBalanceDeduction: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">TDS Final Tax ($)</label>
                    <Input
                      type="number"
                      value={newForm.taxDeductionTds}
                      onChange={e => setNewForm({ ...newForm, taxDeductionTds: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <span className="font-medium text-slate-600">Calculated Net F&F Payout:</span>
                <span className="font-bold text-base text-emerald-600">
                  ${Math.max(0, 
                    (Number(newForm.unpaidDaysSalary) + Number(newForm.leaveEncashmentAmount) + Number(newForm.gratuityAmount) + Number(newForm.bonusOrIncentives)) - 
                    (Number(newForm.noticeRecoveryAmount) + Number(newForm.loanBalanceDeduction) + Number(newForm.assetDamageRecovery) + Number(newForm.taxDeductionTds))
                  ).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsInitiateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Create F&F Case
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
