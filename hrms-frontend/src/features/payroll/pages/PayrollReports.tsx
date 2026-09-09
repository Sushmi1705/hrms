import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  Download, CheckCircle2, FileText, Table, Eye, Filter, 
  Calendar, Building2, CreditCard, ShieldCheck, X, FileSpreadsheet
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  format: 'CSV' | 'Excel' | 'Text';
  frequency: 'Monthly' | 'Statutory' | 'On-Demand';
  category: 'Financial' | 'Statutory' | 'Banking' | 'Auditing';
  iconColor: string;
  columns: string[];
  sampleData: Array<Record<string, string | number>>;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'salary_register',
    name: 'Monthly Salary Register',
    description: 'Detailed employee-level breakdown of basic, allowances, gross earnings, itemized deductions, and net pay.',
    format: 'CSV',
    frequency: 'Monthly',
    category: 'Financial',
    iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    columns: ['Emp Code', 'Employee Name', 'Department', 'Designation', 'Gross Salary', 'Total Deductions', 'Net Payout'],
    sampleData: [
      { 'Emp Code': 'EMP-1001', 'Employee Name': 'Jane Smith', 'Department': 'Engineering', 'Designation': 'Engineering Director', 'Gross Salary': '$14,200', 'Total Deductions': '$2,982', 'Net Payout': '$11,218' },
      { 'Emp Code': 'EMP-1002', 'Employee Name': 'Michael Brown', 'Department': 'Engineering', 'Designation': 'Senior Developer', 'Gross Salary': '$8,500', 'Total Deductions': '$1,684', 'Net Payout': '$6,816' },
      { 'Emp Code': 'EMP-1003', 'Employee Name': 'John Doe', 'Department': 'Sales', 'Designation': 'Account Executive', 'Gross Salary': '$7,200', 'Total Deductions': '$1,190', 'Net Payout': '$6,010' },
      { 'Emp Code': 'EMP-1004', 'Employee Name': 'Sarah Jenkins', 'Department': 'Marketing', 'Designation': 'Growth Lead', 'Gross Salary': '$9,400', 'Total Deductions': '$1,850', 'Net Payout': '$7,550' }
    ]
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer File (ACH / NACHA)',
    description: 'Standard direct deposit payment schedule formatted for corporate banking batch processing.',
    format: 'CSV',
    frequency: 'Monthly',
    category: 'Banking',
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    columns: ['Transaction ID', 'Employee Code', 'Beneficiary Name', 'Bank Name', 'Account Number', 'Routing Number', 'Disbursement Amount'],
    sampleData: [
      { 'Transaction ID': 'TXN-88102', 'Employee Code': 'EMP-1001', 'Beneficiary Name': 'Jane Smith', 'Bank Name': 'Chase Bank', 'Account Number': '•••• 4892', 'Routing Number': '021000021', 'Disbursement Amount': '$11,218.00' },
      { 'Transaction ID': 'TXN-88103', 'Employee Code': 'EMP-1002', 'Beneficiary Name': 'Michael Brown', 'Bank Name': 'Wells Fargo', 'Account Number': '•••• 3109', 'Routing Number': '121000248', 'Disbursement Amount': '$6,816.00' },
      { 'Transaction ID': 'TXN-88104', 'Employee Code': 'EMP-1003', 'Beneficiary Name': 'John Doe', 'Bank Name': 'Bank of America', 'Account Number': '•••• 9012', 'Routing Number': '026009593', 'Disbursement Amount': '$6,010.00' }
    ]
  },
  {
    id: 'tax_deductions',
    name: 'Income Tax & TDS Summary',
    description: 'Statutory income tax withholding breakdown with 4% Health & Education Cess and bracket analysis.',
    format: 'CSV',
    frequency: 'Statutory',
    category: 'Statutory',
    iconColor: 'text-purple-600 bg-purple-50 border-purple-200',
    columns: ['Emp Code', 'Employee Name', 'PAN / Tax ID', 'Regime', 'Taxable Gross', 'Monthly TDS', 'Cess (4%)', 'Total Tax Deducted'],
    sampleData: [
      { 'Emp Code': 'EMP-1001', 'Employee Name': 'Jane Smith', 'PAN / Tax ID': 'ABCDE1234F', 'Regime': 'New Regime', 'Taxable Gross': '$14,200', 'Monthly TDS': '$2,048', 'Cess (4%)': '$82', 'Total Tax Deducted': '$2,130' },
      { 'Emp Code': 'EMP-1002', 'Employee Name': 'Michael Brown', 'PAN / Tax ID': 'BCDEF2345G', 'Regime': 'New Regime', 'Taxable Gross': '$8,500', 'Monthly TDS': '$816', 'Cess (4%)': '$34', 'Total Tax Deducted': '$850' },
      { 'Emp Code': 'EMP-1003', 'Employee Name': 'John Doe', 'PAN / Tax ID': 'CDEFG3456H', 'Regime': 'Old Regime', 'Taxable Gross': '$7,200', 'Monthly TDS': '$576', 'Cess (4%)': '$24', 'Total Tax Deducted': '$600' }
    ]
  },
  {
    id: 'pf_statutory',
    name: 'PF & Social Security Compliance',
    description: 'Provident Fund (Employee 12% + Employer 12%), ESI contribution schedules and pension fund deposits.',
    format: 'CSV',
    frequency: 'Statutory',
    category: 'Statutory',
    iconColor: 'text-blue-600 bg-blue-50 border-blue-200',
    columns: ['Emp Code', 'Employee Name', 'UAN / PF Number', 'Basic Pay', 'Employee PF (12%)', 'Employer PF (12%)', 'Pension Fund (8.33%)', 'Total Statutory Remittance'],
    sampleData: [
      { 'Emp Code': 'EMP-1001', 'Employee Name': 'Jane Smith', 'UAN / PF Number': 'PF/IL/00124/1001', 'Basic Pay': '$7,100', 'Employee PF (12%)': '$852', 'Employer PF (12%)': '$852', 'Pension Fund (8.33%)': '$591', 'Total Statutory Remittance': '$1,704' },
      { 'Emp Code': 'EMP-1002', 'Employee Name': 'Michael Brown', 'UAN / PF Number': 'PF/IL/00124/1002', 'Basic Pay': '$4,250', 'Employee PF (12%)': '$510', 'Employer PF (12%)': '$510', 'Pension Fund (8.33%)': '$354', 'Total Statutory Remittance': '$1,020' }
    ]
  },
  {
    id: 'loans_ledger',
    name: 'Loans & Advances Ledger',
    description: 'Company loans amortization ledger showing principal sanctioned, monthly EMI recoveries, and outstanding balances.',
    format: 'CSV',
    frequency: 'Monthly',
    category: 'Financial',
    iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
    columns: ['Loan ID', 'Employee Name', 'Loan Type', 'Principal Amount', 'Monthly EMI', 'Total Repaid', 'Remaining Balance'],
    sampleData: [
      { 'Loan ID': 'LN-2026-001', 'Employee Name': 'Michael Brown', 'Loan Type': 'Home Renovation', 'Principal Amount': '$6,000', 'Monthly EMI': '$250', 'Total Repaid': '$2,000', 'Remaining Balance': '$4,000' },
      { 'Loan ID': 'LN-2026-002', 'Employee Name': 'Sarah Jenkins', 'Loan Type': 'Education Loan', 'Principal Amount': '$5,000', 'Monthly EMI': '$300', 'Total Repaid': '$1,800', 'Remaining Balance': '$3,200' }
    ]
  },
  {
    id: 'reimbursement_audit',
    name: 'Reimbursements Audit Schedule',
    description: 'Employee expense claims, travel vouchers, remote work allowances, and receipt verification history.',
    format: 'CSV',
    frequency: 'Monthly',
    category: 'Auditing',
    iconColor: 'text-rose-600 bg-rose-50 border-rose-200',
    columns: ['Claim ID', 'Employee Name', 'Expense Category', 'Claim Amount', 'Receipt Attached', 'Approval Status', 'Disbursed With Payroll'],
    sampleData: [
      { 'Claim ID': 'CLM-9011', 'Employee Name': 'Jane Smith', 'Expense Category': 'Client Dinner & Travel', 'Claim Amount': '$340.00', 'Receipt Attached': 'Yes (Verified)', 'Approval Status': 'Approved', 'Disbursed With Payroll': 'Yes' },
      { 'Claim ID': 'CLM-9012', 'Employee Name': 'Robert Zhang', 'Expense Category': 'Hardware Ergonomics', 'Claim Amount': '$210.00', 'Receipt Attached': 'Yes (Verified)', 'Approval Status': 'Approved', 'Disbursed With Payroll': 'Yes' }
    ]
  }
];

export function PayrollReports() {
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [selectedDept, setSelectedDept] = useState('All');
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Generate real CSV download
  const handleDownloadCsv = (report: ReportTemplate) => {
    const headers = report.columns.join(',');
    const rows = report.sampleData.map(row => 
      report.columns.map(col => {
        const val = String(row[col] ?? '');
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedName = report.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const sanitizedMonth = selectedMonth.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.download = `${sanitizedName}_${sanitizedMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Download Complete', `${report.name} exported as CSV for ${selectedMonth}`);
  };

  return (
    <div className="space-y-6 mt-6 relative pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{toastMessage.title}</p>
            <p className="text-xs text-emerald-100">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Payroll Reports & Compliance Exports
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Audit Ready
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Export official payroll ledgers, bank disbursement batch files, statutory tax withholdings, and audit schedules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Period:</span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
              <option value="June 2026">June 2026</option>
              <option value="Q2 FY2026">Q2 FY2026</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Department:</span>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPORT_TEMPLATES.map(report => (
          <Card key={report.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
            <CardContent className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${report.iconColor}`}>
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {report.category}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {report.format}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-base mb-1">{report.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {report.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <Button
                  onClick={() => setPreviewReport(report)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </Button>

                <Button
                  onClick={() => handleDownloadCsv(report)}
                  size="sm"
                  className="flex-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export {report.format}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL: Report Table Preview */}
      {previewReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <Table className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">{previewReport.name}</h3>
                  <p className="text-xs text-slate-400">Previewing data for {selectedMonth} • Department: {selectedDept}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Table Preview */}
            <div className="p-6 overflow-x-auto max-h-[60vh]">
              <table className="w-full text-left text-xs border-collapse border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200">
                    {previewReport.columns.map((col, idx) => (
                      <th key={idx} className="py-3 px-3.5 border-r border-slate-200 last:border-r-0 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {previewReport.sampleData.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-slate-50 transition-colors">
                      {previewReport.columns.map((col, colIdx) => (
                        <td key={colIdx} className="py-2.5 px-3.5 border-r border-slate-200 last:border-r-0 text-slate-700 whitespace-nowrap">
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Displaying sample records • Total records available in export: 312
              </span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    handleDownloadCsv(previewReport);
                    setPreviewReport(null);
                  }}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 text-xs"
                >
                  <Download className="w-4 h-4" />
                  Export Full CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewReport(null)}
                  className="border-slate-200 text-slate-600 text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
