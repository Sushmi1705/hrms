import React, { useState, useEffect } from 'react';
import { 
  DollarSign, FileText, Download, Printer, Eye, 
  CheckCircle2, ArrowDownRight, ArrowUpRight, Building, 
  Calendar, ShieldCheck, CreditCard, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { essApi } from '../api/essApi';
import { EssPayslipSummary, EssPayslipDetail } from '../types/ess';

export const EmployeePayrollPage: React.FC = () => {
  const [payslips, setPayslips] = useState<EssPayslipSummary[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<EssPayslipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const fetchPayslips = (year: number) => {
    setLoading(true);
    essApi.getPayslips(year)
      .then(res => setPayslips(res || []))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load payslips');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayslips(selectedYear);
  }, [selectedYear]);

  const handleViewPayslip = async (id: string) => {
    setDetailLoading(true);
    try {
      const detail = await essApi.getPayslipDetail(id);
      setSelectedPayslip(detail);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load payslip details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-32 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  const latest = payslips[0];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* 1. TOP HEADER & SUMMARY CARD */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            My Payslips & Compensation History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access, view, and print official salary stubs and payroll statements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Year:</span>
          <select 
            value={selectedYear} 
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="p-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      {/* 2. LATEST PAYSLIP HIGHLIGHT */}
      {latest && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400/30">
                  Latest Disbursed
                </Badge>
                <span className="text-xs text-emerald-200">{latest.month}</span>
              </div>
              <p className="text-xs text-emerald-200 font-medium">Net Disbursed Take-Home Salary</p>
              <p className="text-3xl md:text-4xl font-extrabold tracking-tight">
                ${latest.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-4 text-xs text-emerald-100 pt-1">
                <span>Gross: <strong>${latest.grossSalary.toLocaleString()}</strong></span>
                <span>•</span>
                <span>Allowances: <strong>${latest.totalAllowances.toLocaleString()}</strong></span>
                <span>•</span>
                <span>Deductions & Taxes: <strong>${latest.totalDeductions.toLocaleString()}</strong></span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => handleViewPayslip(latest.id)}
              disabled={detailLoading}
              className="rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold shadow-md"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Full Statement
            </Button>
          </div>
        </div>
      )}

      {/* 3. HISTORICAL PAYSLIPS TABLE */}
      <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Payroll Statement Archives ({selectedYear})
          </CardTitle>
          <CardDescription className="text-xs">
            Complete records of all processed pay periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payslips.length === 0 ? (
            <p className="text-sm text-slate-500 py-12 text-center">No payslips found for {selectedYear}.</p>
          ) : (
            <div className="space-y-3">
              {payslips.map(ps => (
                <div 
                  key={ps.id} 
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900 dark:text-white">{ps.month}</span>
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 text-[10px]">
                          {ps.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Payment Date: {new Date(ps.paymentDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Net Take-Home</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        ${ps.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewPayslip(ps.id)}
                      className="rounded-xl text-xs font-semibold hover:border-indigo-500"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View Slip
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. DIGITAL PAYSLIP MODAL / PRINTABLE DIALOG */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            {/* Modal Header Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                  PAYSLIP
                </Badge>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {selectedPayslip.month}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handlePrint} className="rounded-xl text-xs">
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print / Download PDF
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedPayslip(null)} className="rounded-xl text-xs">
                  Close
                </Button>
              </div>
            </div>

            {/* Printable Payslip Body */}
            <div className="p-6 md:p-8 space-y-6 text-slate-900 dark:text-white" id="printable-payslip">
              {/* Company & Statement Banner */}
              <div className="flex items-start justify-between border-b pb-6 border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400">
                    Acme Enterprise Corp
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">124 Innovation Boulevard, Suite 400 • Austin, TX</p>
                  <p className="text-xs text-slate-500">Corporate HR & Payroll Administration</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs px-3 py-1">
                    PAID / DISBURSED
                  </Badge>
                  <p className="text-xs text-slate-500 mt-1">Period: <strong className="text-slate-900 dark:text-white">{selectedPayslip.month}</strong></p>
                  <p className="text-xs text-slate-500">Pay Date: {new Date(selectedPayslip.paymentDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Employee Summary Card */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500">Employee Name:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedPayslip.employeeName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Employee ID:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedPayslip.employeeNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500">Designation:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedPayslip.designation}</p>
                </div>
                <div>
                  <span className="text-slate-500">Department:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedPayslip.department}</p>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings Table */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 font-bold text-xs flex justify-between">
                    <span>EARNINGS & ALLOWANCES</span>
                    <span>AMOUNT (USD)</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {selectedPayslip.earnings?.map((e, idx) => (
                      <div key={idx} className="px-4 py-2.5 flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">{e.name}</span>
                        <span className="font-mono font-semibold">${e.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                    <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>Total Gross Pay</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">
                        ${selectedPayslip.grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions Table */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 font-bold text-xs flex justify-between">
                    <span>DEDUCTIONS & TAXES</span>
                    <span>AMOUNT (USD)</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {selectedPayslip.deductions?.map((d, idx) => (
                      <div key={idx} className="px-4 py-2.5 flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                        <span className="font-mono font-semibold text-rose-600">-${d.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                    <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>Total Deductions</span>
                      <span className="font-mono text-rose-600">
                        -${selectedPayslip.totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employer Contributions & Net Take-Home */}
              <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">NET SALARY DISBURSED TO BANK</p>
                  <p className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-1">
                    ${selectedPayslip.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-emerald-700/80 dark:text-emerald-400 mt-0.5">
                    Deposited to {selectedPayslip.bankName} ({selectedPayslip.bankAccountNumber})
                  </p>
                </div>

                <div className="text-right text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Employer Company Contributions:</p>
                  {selectedPayslip.employerContributions?.map((ec, idx) => (
                    <p key={idx}>{ec.name}: <strong className="font-mono">${ec.amount.toLocaleString()}</strong></p>
                  ))}
                </div>
              </div>

              {/* Footer Notice */}
              <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                This is an electronically generated and digitally signed statement issued under Acme Enterprise Corp HRMS.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
