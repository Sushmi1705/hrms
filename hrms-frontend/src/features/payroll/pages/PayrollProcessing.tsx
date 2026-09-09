import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  PlayCircle, CheckCircle, AlertTriangle, RefreshCw, Download, 
  Eye, CheckCircle2, Lock, Unlock, FileText, Users, DollarSign,
  TrendingUp, ArrowRight, X, Printer, ShieldCheck, Search, Filter, Check
} from 'lucide-react';

interface EmployeeCalculation {
  id: number;
  empCode: string;
  name: string;
  role: string;
  department: string;
  bankAccount: string;
  basicPay: number;
  hra: number;
  allowances: number;
  overtime: number;
  grossPay: number;
  tds: number;
  pf: number;
  esi: number;
  loanDeduction: number;
  totalDeductions: number;
  netPay: number;
  status: 'Verified' | 'Hold';
}

const CALCULATED_EMPLOYEES: EmployeeCalculation[] = [
  {
    id: 1,
    empCode: 'EMP-1001',
    name: 'Jane Smith',
    role: 'Engineering Director',
    department: 'Engineering',
    bankAccount: '•••• 4892',
    basicPay: 7100,
    hra: 2840,
    allowances: 3760,
    overtime: 500,
    grossPay: 14200,
    tds: 2130,
    pf: 852,
    esi: 0,
    loanDeduction: 0,
    totalDeductions: 2982,
    netPay: 11218,
    status: 'Verified'
  },
  {
    id: 2,
    empCode: 'EMP-1002',
    name: 'Michael Brown',
    role: 'Senior Developer',
    department: 'Engineering',
    bankAccount: '•••• 3109',
    basicPay: 4250,
    hra: 1700,
    allowances: 2150,
    overtime: 400,
    grossPay: 8500,
    tds: 850,
    pf: 510,
    esi: 64,
    loanDeduction: 250,
    totalDeductions: 1674,
    netPay: 6826,
    status: 'Verified'
  },
  {
    id: 3,
    empCode: 'EMP-1003',
    name: 'Sarah Connor',
    role: 'VP of Global Sales',
    department: 'Sales',
    bankAccount: '•••• 9021',
    basicPay: 6750,
    hra: 2700,
    allowances: 3550,
    overtime: 500,
    grossPay: 13500,
    tds: 2025,
    pf: 810,
    esi: 0,
    loanDeduction: 0,
    totalDeductions: 2835,
    netPay: 10665,
    status: 'Verified'
  },
  {
    id: 4,
    empCode: 'EMP-1004',
    name: 'John Doe',
    role: 'Full Stack Engineer',
    department: 'Engineering',
    bankAccount: '•••• 7714',
    basicPay: 3750,
    hra: 1500,
    allowances: 1850,
    overtime: 400,
    grossPay: 7500,
    tds: 750,
    pf: 450,
    esi: 56,
    loanDeduction: 0,
    totalDeductions: 1256,
    netPay: 6244,
    status: 'Verified'
  },
  {
    id: 5,
    empCode: 'EMP-1005',
    name: 'Alex Rivera',
    role: 'Marketing Lead',
    department: 'Marketing',
    bankAccount: '•••• 6632',
    basicPay: 4350,
    hra: 1740,
    allowances: 2210,
    overtime: 400,
    grossPay: 8700,
    tds: 870,
    pf: 522,
    esi: 65,
    loanDeduction: 0,
    totalDeductions: 1457,
    netPay: 7243,
    status: 'Verified'
  },
  {
    id: 6,
    empCode: 'EMP-1006',
    name: 'David Kim',
    role: 'DevOps Architect',
    department: 'Engineering',
    bankAccount: '•••• 5521',
    basicPay: 5600,
    hra: 2240,
    allowances: 2960,
    overtime: 400,
    grossPay: 11200,
    tds: 1456,
    pf: 672,
    esi: 0,
    loanDeduction: 300,
    totalDeductions: 2428,
    netPay: 8772,
    status: 'Verified'
  }
];

export function PayrollProcessing() {
  const [calculationState, setCalculationState] = useState<'idle' | 'calculating' | 'completed'>('idle');
  const [calcProgress, setCalcProgress] = useState(0);
  const [calcStepText, setCalcStepText] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeCalculation | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showNotification = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleProcess = () => {
    setCalculationState('calculating');
    setCalcProgress(15);
    setCalcStepText('Syncing biometric clock-ins and reconciling 28 unpaid LOP leaves...');

    setTimeout(() => {
      setCalcProgress(45);
      setCalcStepText('Applying income tax slabs (TDS) and progressive statutory withholdings...');
    }, 600);

    setTimeout(() => {
      setCalcProgress(75);
      setCalcStepText('Deducting active company loan EMIs and adding approved expense reimbursements...');
    }, 1200);

    setTimeout(() => {
      setCalcProgress(100);
      setCalcStepText('Final reconciliation verified. 0 salary anomalies detected.');
      setTimeout(() => {
        setCalculationState('completed');
        showNotification('Payroll Calculated', 'Salary calculation completed for 312 employees. Ready for final approval.');
      }, 500);
    }, 1800);
  };

  const handleApprovePayroll = () => {
    setIsApproved(true);
    showNotification('Payroll Approved & Locked', 'August 2026 cycle has been finalized. 312 payslips released to employee portals.');
  };

  const handleDownloadBankFile = () => {
    const headers = 'Employee ID,Employee Name,Department,Bank Account,Gross Pay,Total Deductions,Net Payable\n';
    const rows = CALCULATED_EMPLOYEES.map(e => 
      `"${e.empCode}","${e.name}","${e.department}","${e.bankAccount}","${e.grossPay}","${e.totalDeductions}","${e.netPay}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `August_2026_Payroll_Bank_Disbursement.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Bank File Generated', 'Disbursement CSV file downloaded successfully.');
  };

  const filteredEmployees = CALCULATED_EMPLOYEES.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

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

      {/* Header & Main Run Action */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Run Payroll - August 2026</h2>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
              isApproved 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : calculationState === 'completed'
                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {isApproved ? 'Approved & Locked' : calculationState === 'completed' ? 'Calculated (Pending Sign-off)' : 'Draft Processing'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cutoff Period: August 01 to August 31, 2026 • 312 Active Headcount
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {calculationState === 'completed' && (
            <Button 
              variant="outline"
              onClick={handleDownloadBankFile}
              className="bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download Bank CSV
            </Button>
          )}

          <Button 
            onClick={handleProcess} 
            disabled={calculationState === 'calculating' || isApproved} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
          >
            {calculationState === 'calculating' ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Calculating Salary ({calcProgress}%)
              </>
            ) : calculationState === 'completed' ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Recalculate Salary
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                Calculate Salary
              </>
            )}
          </Button>

          {calculationState === 'completed' && !isApproved && (
            <Button 
              onClick={handleApprovePayroll}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Approve & Lock
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar (Visible during calculation) */}
      {calculationState === 'calculating' && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-2 animate-in fade-in duration-200">
          <div className="flex justify-between text-xs font-semibold text-indigo-900">
            <span>Executing Automated Payroll Engine...</span>
            <span>{calcProgress}%</span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${calcProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-indigo-700 font-medium italic">
            {calcStepText}
          </p>
        </div>
      )}

      {/* 3 Step Validation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1: Attendance Sync */}
        <Card className="shadow-sm border-t-4 border-t-emerald-500 bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> 
                1. Attendance Sync
              </h3>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Synchronized
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Biometric logs & leave balances reconciled.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Active Headcount:</span>
                <span className="font-semibold text-slate-800">312 Employees</span>
              </div>
              <div className="flex justify-between">
                <span>Loss of Pay (LOP) Days:</span>
                <span className="font-semibold text-rose-600">28 Days Deducted</span>
              </div>
              <div className="flex justify-between">
                <span>Approved Overtime:</span>
                <span className="font-semibold text-emerald-600">+1,420 Hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Tax Deductions */}
        <Card className={`shadow-sm border-t-4 transition-all bg-white ${
          calculationState === 'completed' 
            ? 'border-t-emerald-500' 
            : calculationState === 'calculating'
            ? 'border-t-indigo-500 animate-pulse'
            : 'border-t-amber-500'
        }`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                {calculationState === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                2. Tax & Deductions
              </h3>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                calculationState === 'completed' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : calculationState === 'calculating'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {calculationState === 'completed' ? 'Calculated' : calculationState === 'calculating' ? 'Processing...' : 'Pending Trigger'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {calculationState === 'completed' 
                ? 'Statutory TDS, PF, ESI, and loan EMIs computed.'
                : 'Pending calculation trigger to apply tax slabs.'}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Total TDS Withheld:</span>
                <span className="font-semibold text-slate-800">
                  {calculationState === 'completed' ? '$420,500' : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Provident Fund (PF):</span>
                <span className="font-semibold text-slate-800">
                  {calculationState === 'completed' ? '$184,200' : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Loan EMI Recoveries:</span>
                <span className="font-semibold text-slate-800">
                  {calculationState === 'completed' ? '$45,000' : '—'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Final Verification */}
        <Card className={`shadow-sm border-t-4 transition-all bg-white ${
          isApproved
            ? 'border-t-emerald-600'
            : calculationState === 'completed' 
            ? 'border-t-indigo-600' 
            : 'border-t-slate-300'
        }`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h3 className={`font-bold flex items-center gap-2 text-sm ${
                calculationState === 'completed' ? 'text-slate-800' : 'text-slate-400'
              }`}>
                {isApproved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : calculationState === 'completed' ? (
                  <Unlock className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
                3. Final Verification
              </h3>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                isApproved
                  ? 'bg-emerald-100 text-emerald-800'
                  : calculationState === 'completed' 
                  ? 'bg-indigo-100 text-indigo-800' 
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {isApproved ? 'Approved' : calculationState === 'completed' ? 'Ready for Sign-off' : 'Locked'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {isApproved 
                ? 'Cycle approved. Bank file ready for disbursement.'
                : calculationState === 'completed'
                ? 'Audit balance verified. Ready for sign-off.'
                : 'Locked until salary computation completes.'}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Total Net Payable:</span>
                <span className="font-bold text-emerald-600">
                  {calculationState === 'completed' ? '$2,183,000' : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Variance:</span>
                <span className="font-semibold text-slate-800">
                  {calculationState === 'completed' ? '+1.8% vs July' : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Anomaly Exceptions:</span>
                <span className="font-semibold text-emerald-600">
                  {calculationState === 'completed' ? '0 Detected' : '—'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculated Breakdown Section (Revealed when calculation completes) */}
      {calculationState === 'completed' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          {/* Summary KPI Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Gross Pay</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">$2,854,000</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Base + HRA + Allowances</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Total Deductions</span>
              <p className="text-2xl font-bold text-rose-600 mt-1">-$671,000</p>
              <p className="text-[11px] text-slate-400 mt-0.5">TDS, PF, ESI & Loans</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Net Disbursement</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">$2,183,000</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Bank transfer total</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Calculated Batches</span>
              <p className="text-2xl font-bold text-indigo-700 mt-1">312 / 312</p>
              <p className="text-[11px] text-slate-400 mt-0.5">100% verified & reconciled</p>
            </div>
          </div>

          {/* Table Header & Search */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-3 items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calculated employee..."
                className="pl-9 h-9 text-xs border-slate-200"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-500 font-medium">Department:</span>
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="h-9 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          {/* Calculated Salary Table */}
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Employee</th>
                      <th className="px-5 py-3.5">Department</th>
                      <th className="px-5 py-3.5">Gross Earnings</th>
                      <th className="px-5 py-3.5">Deductions</th>
                      <th className="px-5 py-3.5">Net Payable</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-900">{emp.name}</div>
                          <div className="text-xs text-slate-400">{emp.empCode} • {emp.role}</div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 text-xs">
                          {emp.department}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-slate-800">
                          ${emp.grossPay.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-rose-600">
                          -${emp.totalDeductions.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-emerald-700 text-base">
                          ${emp.netPay.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            <Check className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedEmployee(emp)}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs font-semibold"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View Breakdown
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* INDIVIDUAL EMPLOYEE PAYSLIP BREAKDOWN MODAL               */}
      {/* ========================================================= */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-300" />
                  Salary Calculation Breakdown
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  August 2026 • {selectedEmployee.name} ({selectedEmployee.empCode})
                </p>
              </div>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400">Designation:</span>
                  <p className="font-semibold text-slate-800">{selectedEmployee.role}</p>
                </div>
                <div>
                  <span className="text-slate-400">Disbursement Account:</span>
                  <p className="font-semibold text-slate-800">{selectedEmployee.bankAccount}</p>
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 space-y-2">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Gross Earnings Breakdown</span>
                <div className="text-xs space-y-1 text-slate-700">
                  <div className="flex justify-between"><span>Basic Salary:</span><span className="font-medium">${selectedEmployee.basicPay.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>House Rent Allowance (HRA):</span><span className="font-medium">${selectedEmployee.hra.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Special Allowances:</span><span className="font-medium">${selectedEmployee.allowances.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Approved Overtime:</span><span className="font-medium">${selectedEmployee.overtime.toLocaleString()}</span></div>
                  <div className="flex justify-between pt-1 border-t border-emerald-200 font-bold text-emerald-900">
                    <span>Total Gross Pay:</span>
                    <span>${selectedEmployee.grossPay.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3.5 space-y-2">
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider">Statutory Deductions & Withholdings</span>
                <div className="text-xs space-y-1 text-slate-700">
                  <div className="flex justify-between"><span>Income Tax (TDS):</span><span className="font-medium">${selectedEmployee.tds.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Employee Provident Fund (PF):</span><span className="font-medium">${selectedEmployee.pf.toLocaleString()}</span></div>
                  {selectedEmployee.esi > 0 && <div className="flex justify-between"><span>ESIC Contribution:</span><span className="font-medium">${selectedEmployee.esi.toLocaleString()}</span></div>}
                  {selectedEmployee.loanDeduction > 0 && <div className="flex justify-between"><span>Company Loan EMI:</span><span className="font-medium">${selectedEmployee.loanDeduction.toLocaleString()}</span></div>}
                  <div className="flex justify-between pt-1 border-t border-rose-200 font-bold text-rose-900">
                    <span>Total Deductions:</span>
                    <span>-${selectedEmployee.totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Payout Banner */}
              <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white rounded-xl p-4 flex justify-between items-center shadow-md">
                <div>
                  <span className="text-xs text-indigo-200 font-medium">Take-Home Net Salary</span>
                  <h4 className="text-2xl font-black">${selectedEmployee.netPay.toLocaleString()}</h4>
                </div>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">
                  Direct Deposit Ready
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
                Close
              </Button>
              <Button 
                onClick={() => {
                  setSelectedEmployee(null);
                  showNotification('Payslip Ready', `Slip printed/downloaded for ${selectedEmployee.name}`);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Printer className="w-4 h-4 mr-1.5" />
                Print Breakdown
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
