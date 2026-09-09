import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Wallet, DollarSign, Download, Check, 
  Send, CreditCard, Building, X, Calculator
} from 'lucide-react';

export interface FinalSettlementRecord {
  id: number;
  empCode: string;
  name: string;
  dept: string;
  role: string;
  lwd: string;
  leaveDays: number;
  leaveEncashment: number;
  unpaidSalary: number;
  gratuityBonus: number;
  duesDeductions: number;
  totalPayout: number;
  status: 'Completed' | 'Pending' | 'Processing';
  bankAccount: string;
  disbursedDate?: string;
  disbursedBy?: string;
  notes?: string;
}

const INITIAL_SETTLEMENTS: FinalSettlementRecord[] = [
  {
    id: 1,
    empCode: 'EMP-1042',
    name: 'Alex Turner',
    dept: 'Sales',
    role: 'Senior Enterprise AE',
    lwd: '2026-09-15',
    leaveDays: 8,
    leaveEncashment: 1200,
    unpaidSalary: 3400,
    gratuityBonus: 0,
    duesDeductions: 200,
    totalPayout: 4400,
    status: 'Pending',
    bankAccount: 'Chase Bank (Checking ****8841)',
    notes: 'Dues include $200 unreturned client entertainment receipt.'
  },
  {
    id: 2,
    empCode: 'EMP-1021',
    name: 'Chris Hemsworth',
    dept: 'Production',
    role: 'Executive Media Lead',
    lwd: '2026-08-31',
    leaveDays: 14,
    leaveEncashment: 2100,
    unpaidSalary: 5500,
    gratuityBonus: 0,
    duesDeductions: 0,
    totalPayout: 7600,
    status: 'Completed',
    bankAccount: 'Wells Fargo (Premier ****9012)',
    disbursedDate: '2026-09-02',
    disbursedBy: 'Finance Controller (Sarah M)',
    notes: 'Electronic ACH wire transfer completed and cleared.'
  },
  {
    id: 3,
    empCode: 'EMP-1055',
    name: 'Noah Centineo',
    dept: 'Engineering',
    role: 'Senior Backend Engineer',
    lwd: '2026-09-05',
    leaveDays: 12,
    leaveEncashment: 1800,
    unpaidSalary: 4200,
    gratuityBonus: 0,
    duesDeductions: 150,
    totalPayout: 5850,
    status: 'Completed',
    bankAccount: 'Bank of America (Advantage ****3310)',
    disbursedDate: '2026-09-06',
    disbursedBy: 'Finance Controller (Sarah M)',
    notes: 'FnF disbursement executed post IT clearance sign-off.'
  },
  {
    id: 4,
    empCode: 'EMP-1088',
    name: 'Lily Collins',
    dept: 'Marketing',
    role: 'Lead Brand Strategist',
    lwd: '2026-09-25',
    leaveDays: 7,
    leaveEncashment: 950,
    unpaidSalary: 2800,
    gratuityBonus: 0,
    duesDeductions: 0,
    totalPayout: 3750,
    status: 'Pending',
    bankAccount: 'Citibank (Personal ****1198)',
    notes: 'Awaiting completion of notice period on September 25.'
  }
];

export function FinalSettlement() {
  const [settlements, setSettlements] = useState<FinalSettlementRecord[]>(INITIAL_SETTLEMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending' | 'Processing'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<FinalSettlementRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredSettlements = useMemo(() => {
    return settlements.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [settlements, searchTerm, statusFilter]);

  const handleDisburse = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setSettlements(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return {
        ...rec,
        status: 'Completed',
        disbursedDate: today,
        disbursedBy: 'Finance Ops Lead',
        notes: (rec.notes ? rec.notes + ' | ' : '') + `Full & final settlement disbursed via wire on ${today}.`
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        status: 'Completed',
        disbursedDate: today,
        disbursedBy: 'Finance Ops Lead'
      } : null);
    }
    showToast('Full & Final payout successfully authorized and disbursed!');
  };

  const handleDownloadFnFVoucher = (rec: FinalSettlementRecord) => {
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const content = `===============================================================
            FULL & FINAL (FnF) SETTLEMENT VOUCHER
===============================================================
Voucher Date    : ${todayStr}
Employee Name   : ${rec.name}
Employee Code   : ${rec.empCode}
Department      : ${rec.dept}
Role / Title    : ${rec.role}
Last Working Day: ${rec.lwd}
Disbursement To : ${rec.bankAccount}
Settlement State: ${rec.status.toUpperCase()}
Disbursed Date  : ${rec.disbursedDate || 'Pending Final Approval'}
Disbursed By    : ${rec.disbursedBy || 'Finance Accounts Payable'}
---------------------------------------------------------------
1. EARNINGS & ENTITLEMENTS BREAKDOWN
---------------------------------------------------------------
• Prorated Final Month Base Salary       : $${rec.unpaidSalary.toLocaleString()}
• Unused Earned Leave Encashment         : $${rec.leaveEncashment.toLocaleString()} (${rec.leaveDays} days balance)
• Gratuity / Service Severance           : $${rec.gratuityBonus.toLocaleString()}
---------------------------------------------------------------
Gross Final Payable Entitlements         : $${(rec.unpaidSalary + rec.leaveEncashment + rec.gratuityBonus).toLocaleString()}

---------------------------------------------------------------
2. DEDUCTIONS & RECOVERIES
---------------------------------------------------------------
• Outstanding Advances / Unsettled Dues  : -$${rec.duesDeductions.toLocaleString()}
• Statutory Tax Withholding (Settlement) : $0.00 (Pre-deducted)
---------------------------------------------------------------
Total Deductions                         : -$${rec.duesDeductions.toLocaleString()}

===============================================================
NET SETTLEMENT DISBURSEMENT AMOUNT       : $${rec.totalPayout.toLocaleString()}
===============================================================

Audit Remarks:
"${rec.notes || 'Full and final reconciliation balanced without discrepancy.'}"

Signatures & Approvals:
Finance Controller    : ___________________   Date: ___________
HR Directorate Lead   : ___________________   Date: ___________
Employee Acceptance   : ___________________   Date: ___________
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FnF_Settlement_${rec.empCode}_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`FnF Settlement Voucher downloaded for ${rec.name}`);
    setActiveDropdown(null);
  };

  return (
    <Card className="shadow-sm border-slate-200">
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-sm flex items-center justify-between shadow-md transition-all">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4" />
            {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 bg-slate-50/70 border-b border-slate-200">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Settlement Cases</span>
            <Wallet className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{settlements.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Offboarding payroll accounts</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Disbursed & Closed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {settlements.filter(i => i.status === 'Completed').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Accounts settled 100%</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Pending Payout</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {settlements.filter(i => i.status === 'Pending').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Awaiting LWD clearance</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Payable Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">
            ${settlements.reduce((acc, curr) => acc + curr.totalPayout, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Aggregate exit payroll</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Full & Final Settlement</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Process exit payroll, leave encashments, bonus gratuity, and final disbursements</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search employee, dept..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Completed', 'Pending'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === f 
                    ? 'bg-white text-rose-700 shadow-xs font-semibold' 
                    : 'hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Leave Encashment</th>
                <th className="px-6 py-3.5">Pending Dues</th>
                <th className="px-6 py-3.5">Total Payout</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSettlements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No settlement records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredSettlements.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.empCode} • {item.dept}</div>
                      <div className="text-[11px] text-rose-600">LWD: {item.lwd}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">${item.leaveEncashment.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">{item.leaveDays} days balance</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.duesDeductions > 0 ? (
                        <span className="font-medium text-rose-600">-${item.duesDeductions.toLocaleString()}</span>
                      ) : (
                        <span className="text-slate-400">$0.00</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-base text-emerald-600">
                        ${item.totalPayout.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-400">Net after adjustments</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Disbursed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Settle Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 border-rose-200 font-medium flex items-center gap-1.5"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          Settle
                        </Button>

                        {/* Dropdown Menu Toggle */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        >
                          <MoreHorizontal className="w-4 h-4"/>
                        </Button>

                        {/* Dropdown Menu */}
                        {activeDropdown === item.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setActiveDropdown(null)} 
                            />
                            <div className="absolute right-0 top-9 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                Payroll Settlement
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Calculator className="w-3.5 h-3.5 text-rose-600" />
                                Inspect FnF Breakdown
                              </button>

                              <button
                                onClick={() => handleDisburse(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Authorize & Disburse Settlement
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadFnFVoucher(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download FnF Voucher (.txt)
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing {filteredSettlements.length} of {settlements.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredSettlements.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* FnF Settlement Voucher Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-semibold">Full & Final (FnF) Settlement Statement</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status === 'Completed' ? 'Disbursed' : 'Pending'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.name} ({selectedRecord.empCode}) • {selectedRecord.dept} • LWD: {selectedRecord.lwd}
                </p>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
              {/* Grand Total Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Net Disbursement Payable
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-0.5">
                    ${selectedRecord.totalPayout.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {selectedRecord.bankAccount}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-500">
                    {selectedRecord.disbursedDate ? `Disbursed on ${selectedRecord.disbursedDate}` : 'Scheduled for Wire'}
                  </div>
                  {selectedRecord.status !== 'Completed' && (
                    <Button
                      size="sm"
                      onClick={() => handleDisburse(selectedRecord.id)}
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white mt-1"
                    >
                      Authorize Wire
                    </Button>
                  )}
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-200/80">
                  1. Earnings & Entitlements
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Prorated Final Month Base Salary</span>
                  <span className="font-semibold text-slate-900">${selectedRecord.unpaidSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Vacation Leave Encashment ({selectedRecord.leaveDays} days)</span>
                  <span className="font-semibold text-slate-900">${selectedRecord.leaveEncashment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Gratuity & Exit Bonus Entitlement</span>
                  <span className="font-semibold text-slate-900">${selectedRecord.gratuityBonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-200 font-bold text-slate-800">
                  <span>Gross Payable</span>
                  <span>${(selectedRecord.unpaidSalary + selectedRecord.leaveEncashment + selectedRecord.gratuityBonus).toLocaleString()}</span>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-200/80">
                  2. Recoveries & Deductions
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Corporate Expense Advances / Unsettled Receipts</span>
                  <span className="font-semibold text-rose-600">-${selectedRecord.duesDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Notice Period Shortfall Recovery</span>
                  <span className="font-semibold text-slate-700">$0.00 (Waived)</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-200 font-bold text-rose-700">
                  <span>Total Recoveries</span>
                  <span>-${selectedRecord.duesDeductions.toLocaleString()}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedRecord.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Settlement Audit Log:</span> {selectedRecord.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadFnFVoucher(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                FnF Voucher (.txt)
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDisburse(selectedRecord.id)}
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Authorize & Disburse
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
