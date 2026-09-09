import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Download, CheckCircle, Search, Eye, Printer, FileText, 
  Building2, User, Calendar, CreditCard, X, ArrowDownRight, 
  ShieldCheck, DollarSign, Mail, Sparkles
} from 'lucide-react';

export interface EmployeePayslip {
  id: number;
  empCode: string;
  employee: string;
  role: string;
  department: string;
  month: string;
  payPeriod: string;
  paymentDate: string;
  bankAccount: string;
  panNumber: string;
  pfNumber: string;
  workingDays: number;
  paidDays: number;
  lopDays: number;
  
  // Earnings
  basicPay: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  overtimePay: number;
  grossSalary: number;

  // Deductions
  tdsTax: number;
  pfDeduction: number;
  esiDeduction: number;
  loanEmi: number;
  totalDeductions: number;

  netSalary: number;
  status: 'Generated' | 'Published' | 'Pending';
}

const INITIAL_PAYSLIPS: EmployeePayslip[] = [
  {
    id: 1,
    empCode: 'EMP-1001',
    employee: 'Jane Smith',
    role: 'Engineering Director',
    department: 'Engineering',
    month: 'August 2026',
    payPeriod: '01 Aug 2026 - 31 Aug 2026',
    paymentDate: '31 Aug 2026',
    bankAccount: '•••• 4892 (Chase Bank)',
    panNumber: 'ABCDE1234F',
    pfNumber: 'PF/IL/00124/1001',
    workingDays: 22,
    paidDays: 22,
    lopDays: 0,
    basicPay: 7100,
    hra: 2840,
    specialAllowance: 3260,
    conveyance: 500,
    overtimePay: 500,
    grossSalary: 14200,
    tdsTax: 2130,
    pfDeduction: 852,
    esiDeduction: 0,
    loanEmi: 0,
    totalDeductions: 2982,
    netSalary: 11218,
    status: 'Generated'
  },
  {
    id: 2,
    empCode: 'EMP-1002',
    employee: 'Michael Brown',
    role: 'Senior Developer',
    department: 'Engineering',
    month: 'August 2026',
    payPeriod: '01 Aug 2026 - 31 Aug 2026',
    paymentDate: '31 Aug 2026',
    bankAccount: '•••• 3109 (Wells Fargo)',
    panNumber: 'BCDEF2345G',
    pfNumber: 'PF/IL/00124/1002',
    workingDays: 22,
    paidDays: 22,
    lopDays: 0,
    basicPay: 4250,
    hra: 1700,
    specialAllowance: 1750,
    conveyance: 400,
    overtimePay: 400,
    grossSalary: 8500,
    tdsTax: 850,
    pfDeduction: 510,
    esiDeduction: 64,
    loanEmi: 250,
    totalDeductions: 1674,
    netSalary: 6826,
    status: 'Generated'
  },
  {
    id: 3,
    empCode: 'EMP-1003',
    employee: 'Sarah Connor',
    role: 'VP of Global Sales',
    department: 'Sales',
    month: 'August 2026',
    payPeriod: '01 Aug 2026 - 31 Aug 2026',
    paymentDate: '31 Aug 2026',
    bankAccount: '•••• 9021 (Bank of America)',
    panNumber: 'CDEFG3456H',
    pfNumber: 'PF/IL/00124/1003',
    workingDays: 22,
    paidDays: 22,
    lopDays: 0,
    basicPay: 6750,
    hra: 2700,
    specialAllowance: 3050,
    conveyance: 500,
    overtimePay: 500,
    grossSalary: 13500,
    tdsTax: 2025,
    pfDeduction: 810,
    esiDeduction: 0,
    loanEmi: 0,
    totalDeductions: 2835,
    netSalary: 10665,
    status: 'Generated'
  },
  {
    id: 4,
    empCode: 'EMP-1004',
    employee: 'John Doe',
    role: 'Full Stack Engineer',
    department: 'Engineering',
    month: 'August 2026',
    payPeriod: '01 Aug 2026 - 31 Aug 2026',
    paymentDate: '31 Aug 2026',
    bankAccount: '•••• 7714 (Citibank)',
    panNumber: 'DEFGH4567J',
    pfNumber: 'PF/IL/00124/1004',
    workingDays: 22,
    paidDays: 21,
    lopDays: 1,
    basicPay: 3750,
    hra: 1500,
    specialAllowance: 1500,
    conveyance: 350,
    overtimePay: 400,
    grossSalary: 7500,
    tdsTax: 750,
    pfDeduction: 450,
    esiDeduction: 56,
    loanEmi: 0,
    totalDeductions: 1256,
    netSalary: 6244,
    status: 'Generated'
  },
  {
    id: 5,
    empCode: 'EMP-1005',
    employee: 'Alex Rivera',
    role: 'Marketing Lead',
    department: 'Marketing',
    month: 'August 2026',
    payPeriod: '01 Aug 2026 - 31 Aug 2026',
    paymentDate: '31 Aug 2026',
    bankAccount: '•••• 6632 (PNC Bank)',
    panNumber: 'EFGHI5678K',
    pfNumber: 'PF/IL/00124/1005',
    workingDays: 22,
    paidDays: 22,
    lopDays: 0,
    basicPay: 4350,
    hra: 1740,
    specialAllowance: 1810,
    conveyance: 400,
    overtimePay: 400,
    grossSalary: 8700,
    tdsTax: 870,
    pfDeduction: 522,
    esiDeduction: 65,
    loanEmi: 0,
    totalDeductions: 1457,
    netSalary: 7243,
    status: 'Generated'
  },
  {
    id: 6,
    empCode: 'EMP-1006',
    employee: 'David Kim',
    role: 'DevOps Architect',
    department: 'Engineering',
    month: 'August 2026',
    payPeriod: '01 Aug 2026 - 31 Aug 2026',
    paymentDate: '31 Aug 2026',
    bankAccount: '•••• 5521 (Capital One)',
    panNumber: 'FGHIJ6789L',
    pfNumber: 'PF/IL/00124/1006',
    workingDays: 22,
    paidDays: 22,
    lopDays: 0,
    basicPay: 5600,
    hra: 2240,
    specialAllowance: 2560,
    conveyance: 400,
    overtimePay: 400,
    grossSalary: 11200,
    tdsTax: 1456,
    pfDeduction: 672,
    esiDeduction: 0,
    loanEmi: 300,
    totalDeductions: 2428,
    netSalary: 8772,
    status: 'Generated'
  },
  {
    id: 7,
    empCode: 'EMP-1001',
    employee: 'Jane Smith',
    role: 'Engineering Director',
    department: 'Engineering',
    month: 'July 2026',
    payPeriod: '01 Jul 2026 - 31 Jul 2026',
    paymentDate: '31 Jul 2026',
    bankAccount: '•••• 4892 (Chase Bank)',
    panNumber: 'ABCDE1234F',
    pfNumber: 'PF/IL/00124/1001',
    workingDays: 23,
    paidDays: 23,
    lopDays: 0,
    basicPay: 7100,
    hra: 2840,
    specialAllowance: 3260,
    conveyance: 500,
    overtimePay: 500,
    grossSalary: 14200,
    tdsTax: 2130,
    pfDeduction: 852,
    esiDeduction: 0,
    loanEmi: 0,
    totalDeductions: 2982,
    netSalary: 11218,
    status: 'Published'
  }
];

export function PayslipsList() {
  const [payslips, setPayslips] = useState<EmployeePayslip[]>(INITIAL_PAYSLIPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Preview / Printable Modal
  const [selectedPayslip, setSelectedPayslip] = useState<EmployeePayslip | null>(null);

  // Toast
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showNotification = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Filtered Payslips
  const filteredPayslips = useMemo(() => {
    return payslips.filter(p => {
      const matchesSearch = p.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMonth = monthFilter === 'All' || p.month === monthFilter;
      const matchesDept = deptFilter === 'All' || p.department === deptFilter;
      return matchesSearch && matchesMonth && matchesDept;
    });
  }, [payslips, searchQuery, monthFilter, deptFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalCount = filteredPayslips.length;
    const totalNet = filteredPayslips.reduce((acc, p) => acc + p.netSalary, 0);
    const avgNet = totalCount > 0 ? Math.round(totalNet / totalCount) : 0;
    return { totalCount, totalNet, avgNet };
  }, [filteredPayslips]);

  // Handle PDF Download
  const handleDownloadPdf = (p: EmployeePayslip) => {
    // Generate real payslip text blob
    const content = `
============================================================
              ANRAONE ENTERPRISES INC.
           OFFICIAL EMPLOYEE SALARY PAYSLIP
============================================================
Pay Period:      ${p.payPeriod}
Disbursement:    ${p.paymentDate}
Employee Name:   ${p.employee} (${p.empCode})
Designation:     ${p.role}
Department:      ${p.department}
Bank Account:    ${p.bankAccount}
Working Days:    ${p.workingDays} | Paid Days: ${p.paidDays} | LOP Days: ${p.lopDays}
------------------------------------------------------------
EARNINGS:
  Basic Salary:           $${p.basicPay.toLocaleString()}
  House Rent Allowance:   $${p.hra.toLocaleString()}
  Special Allowance:      $${p.specialAllowance.toLocaleString()}
  Conveyance Allowance:   $${p.conveyance.toLocaleString()}
  Overtime Pay:           $${p.overtimePay.toLocaleString()}
  ---------------------------------
  TOTAL GROSS EARNINGS:   $${p.grossSalary.toLocaleString()}

DEDUCTIONS:
  Income Tax (TDS):       -$${p.tdsTax.toLocaleString()}
  Provident Fund (PF):    -$${p.pfDeduction.toLocaleString()}
  ESIC Contribution:      -$${p.esiDeduction.toLocaleString()}
  Loan Recovery EMI:      -$${p.loanEmi.toLocaleString()}
  ---------------------------------
  TOTAL DEDUCTIONS:       -$${p.totalDeductions.toLocaleString()}
------------------------------------------------------------
NET PAYABLE SALARY:       $${p.netSalary.toLocaleString()}
STATUS:                   ${p.status} (Direct Deposit Processed)
============================================================
    This is a computer-generated official payroll receipt.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${p.employee.replace(/\s+/g, '_')}_${p.month.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Payslip Downloaded', `Official payslip for ${p.employee} (${p.month}) has been saved.`);
  };

  // Batch publish
  const handlePublishAll = () => {
    setPayslips(prev => prev.map(p => ({ ...p, status: 'Published' })));
    showNotification('Payslips Released', 'All August 2026 payslips published to Employee Self-Service portals.');
  };

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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Payslips</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.totalCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Current filtered view</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Net Disbursed</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">${stats.totalNet.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Direct deposit sum</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Average Take-Home</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-2">${stats.avgNet.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Per employee net median</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Delivery Status</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">100% Ready</p>
          <p className="text-xs text-slate-400 mt-0.5">Available for download & ESS</p>
        </div>
      </div>

      {/* Header and Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Employee Payslips</h2>
          <p className="text-xs text-slate-500 mt-0.5">Browse monthly salary vouchers, preview itemized earnings & deductions, and print official slips</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline"
            onClick={handlePublishAll}
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Mail className="w-4 h-4 mr-1.5 text-indigo-600" />
            Release to Portal
          </Button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-3 items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee, ID, or role..."
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
            <span className="text-xs text-slate-500 font-medium">Month:</span>
            <select 
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="h-9 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700"
            >
              <option value="All">All Pay Cycles</option>
              <option value="August 2026">August 2026 (Active)</option>
              <option value="July 2026">July 2026</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Department:</span>
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="h-9 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payslips Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Pay Period</th>
                  <th className="px-6 py-4">Gross Earnings</th>
                  <th className="px-6 py-4">Deductions</th>
                  <th className="px-6 py-4">Take-Home Pay</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayslips.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-xs">
                      No employee payslips found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredPayslips.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {p.employee}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {p.empCode} • {p.role}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                          {p.month}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Paid on {p.paymentDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ${p.grossSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-semibold text-rose-600 text-xs">
                        -${p.totalDeductions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-black text-emerald-700 text-base">
                        ${p.netSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedPayslip(p)}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold text-xs px-2.5"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDownloadPdf(p)}
                            className="text-slate-600 hover:text-slate-900 text-xs px-2.5 border-slate-200"
                            title="Download official payslip"
                          >
                            <Download className="w-3.5 h-3.5 mr-1" />
                            PDF
                          </Button>
                        </div>
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
      {/* OFFICIAL CORPORATE PAYSLIP VIEW & PRINT MODAL             */}
      {/* ========================================================= */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Actions Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm">Official Salary Payslip Preview</h3>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-indigo-300">
                  {selectedPayslip.month}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm"
                  onClick={() => window.print()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Print
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadPdf(selectedPayslip)}
                  className="bg-transparent border-white/20 hover:bg-white/10 text-white text-xs h-8"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Save
                </Button>
                <button 
                  onClick={() => setSelectedPayslip(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Payslip Body */}
            <div className="p-8 space-y-6 text-sm bg-white" id="printable-payslip">
              
              {/* Corporate Letterhead */}
              <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
                <div>
                  <div className="flex items-center gap-2 text-indigo-700 font-black text-xl tracking-wider">
                    <Building2 className="w-6 h-6" />
                    ANRAONE ENTERPRISES INC.
                  </div>
                  <p className="text-xs text-slate-500 mt-1">100 Enterprise Boulevard, Suite 500 • New York, NY 10001</p>
                  <p className="text-[11px] text-slate-400">Corporate Tax EIN: 12-3456789 • support@anraone.com</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Salary Voucher</span>
                  <p className="text-lg font-extrabold text-slate-900 mt-0.5">{selectedPayslip.month}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 inline-block mt-1">
                    PAID & SETTLED
                  </span>
                </div>
              </div>

              {/* Employee Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block">Employee Name:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedPayslip.employee}</p>
                  <span className="text-[11px] text-slate-500">{selectedPayslip.empCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Designation:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedPayslip.role}</p>
                  <span className="text-[11px] text-slate-500">{selectedPayslip.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Bank Account:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedPayslip.bankAccount}</p>
                  <span className="text-[11px] text-emerald-600 font-medium">Direct Deposit</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Attendance:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">22 / 22 Paid Days</p>
                  <span className="text-[11px] text-slate-400">LOP Days: {selectedPayslip.lopDays}</span>
                </div>
              </div>

              {/* Two Column Earnings & Deductions Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Earnings */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-300 font-bold text-emerald-950 text-xs uppercase tracking-wider">
                    <span>Earnings (Components)</span>
                    <span>Amount ($)</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between"><span>Basic Salary</span><span className="font-medium">${selectedPayslip.basicPay.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>House Rent Allowance (HRA)</span><span className="font-medium">${selectedPayslip.hra.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Special Allowances</span><span className="font-medium">${selectedPayslip.specialAllowance.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Conveyance Allowance</span><span className="font-medium">${selectedPayslip.conveyance.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Approved Overtime Pay</span><span className="font-medium">${selectedPayslip.overtimePay.toLocaleString()}</span></div>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
                    <span>Total Gross Earnings:</span>
                    <span className="text-emerald-700">${selectedPayslip.grossSalary.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-rose-300 font-bold text-rose-950 text-xs uppercase tracking-wider">
                    <span>Statutory Deductions</span>
                    <span>Amount ($)</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between"><span>Income Tax (TDS)</span><span className="font-medium">${selectedPayslip.tdsTax.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Provident Fund (PF)</span><span className="font-medium">${selectedPayslip.pfDeduction.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>ESIC Medical Contribution</span><span className="font-medium">${selectedPayslip.esiDeduction.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Company Loan Recovery EMI</span><span className="font-medium">${selectedPayslip.loanEmi.toLocaleString()}</span></div>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
                    <span>Total Deductions:</span>
                    <span className="text-rose-600">-${selectedPayslip.totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Payable Highlight Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-5 flex justify-between items-center shadow-md">
                <div>
                  <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider block">Net Take-Home Salary</span>
                  <h4 className="text-3xl font-black text-white mt-0.5">${selectedPayslip.netSalary.toLocaleString()}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Disbursed via automated corporate clearing on {selectedPayslip.paymentDate}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-400/30">
                    Verified by Payroll Dept
                  </span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-4 border-t border-slate-200 text-center text-[11px] text-slate-400">
                This is a digitally generated document authorized by the HR & Finance Department of Anraone Enterprises. No physical signature is required.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
