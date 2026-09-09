import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, CheckSquare, Download, Check, 
  Send, Shield, Building2, CreditCard, UserCheck, X
} from 'lucide-react';

export interface ClearanceItem {
  id: string;
  dept: 'IT' | 'Admin' | 'Finance' | 'HR';
  task: string;
  cleared: boolean;
  clearedBy?: string;
  clearedDate?: string;
}

export interface ExitChecklistRecord {
  id: number;
  empCode: string;
  name: string;
  dept: string;
  role: string;
  lwd: string;
  it: 'Cleared' | 'In Progress' | 'Pending';
  admin: 'Cleared' | 'In Progress' | 'Pending';
  finance: 'Cleared' | 'In Progress' | 'Pending';
  status: 'Completed' | 'In Progress' | 'Pending';
  items: ClearanceItem[];
  notes?: string;
}

const INITIAL_CHECKLISTS: ExitChecklistRecord[] = [
  {
    id: 1,
    empCode: 'EMP-1042',
    name: 'Alex Turner',
    dept: 'Sales',
    role: 'Senior Enterprise AE',
    lwd: '2026-09-15',
    it: 'Cleared',
    admin: 'In Progress',
    finance: 'Pending',
    status: 'In Progress',
    items: [
      { id: '1', dept: 'IT', task: 'Revoke Single Sign-On (Okta / Google Workspace)', cleared: true, clearedBy: 'IT Ops (Alex R)', clearedDate: '2026-09-02' },
      { id: '2', dept: 'IT', task: 'Revoke Salesforce CRM & Zoom Phone Licenses', cleared: true, clearedBy: 'IT Ops (Alex R)', clearedDate: '2026-09-02' },
      { id: '3', dept: 'Admin', task: 'Return Building RFID Smart Access Badge', cleared: false },
      { id: '4', dept: 'Admin', task: 'Return Parking Transponder & Locker Keys', cleared: true, clearedBy: 'Facilities Lead', clearedDate: '2026-09-03' },
      { id: '5', dept: 'Finance', task: 'Verify Final Expense Claims in Concur', cleared: false },
      { id: '6', dept: 'Finance', task: 'Settle Corporate Travel Advance ($350)', cleared: false },
      { id: '7', dept: 'HR', task: 'Conduct Formal Exit Interview & Knowledge Review', cleared: true, clearedBy: 'Alice Cooper', clearedDate: '2026-09-01' },
    ],
    notes: 'Awaiting submission of August sales travel expense report before finance clearance.'
  },
  {
    id: 2,
    empCode: 'EMP-1055',
    name: 'Noah Centineo',
    dept: 'Engineering',
    role: 'Senior Backend Engineer',
    lwd: '2026-09-05',
    it: 'Cleared',
    admin: 'Cleared',
    finance: 'Cleared',
    status: 'Completed',
    items: [
      { id: '1', dept: 'IT', task: 'Revoke AWS Console & GitHub Enterprise Access', cleared: true, clearedBy: 'Marcus V (IT Sec)', clearedDate: '2026-09-04' },
      { id: '2', dept: 'IT', task: 'Wipe & Inspect MacBook Pro Workstation', cleared: true, clearedBy: 'Marcus V (IT Sec)', clearedDate: '2026-09-05' },
      { id: '3', dept: 'Admin', task: 'Collect Access Card & Parking Permit', cleared: true, clearedBy: 'Admin Ops', clearedDate: '2026-09-05' },
      { id: '4', dept: 'Finance', task: 'Verify Zero Outstanding Advances or Dues', cleared: true, clearedBy: 'Payroll Lead', clearedDate: '2026-09-05' },
      { id: '5', dept: 'HR', task: 'Benefits Rollover & NDA Reaffirmation Signed', cleared: true, clearedBy: 'HR Operations', clearedDate: '2026-09-05' },
    ],
    notes: 'All departmental sign-offs completed. Employee cleared for final FnF disbursement.'
  },
  {
    id: 3,
    empCode: 'EMP-1066',
    name: 'Zendaya Coleman',
    dept: 'Product',
    role: 'Principal Product Manager',
    lwd: '2026-09-20',
    it: 'In Progress',
    admin: 'Pending',
    finance: 'Pending',
    status: 'In Progress',
    items: [
      { id: '1', dept: 'IT', task: 'Transfer Jira & Linear Admin Privileges', cleared: true, clearedBy: 'IT Ops', clearedDate: '2026-09-03' },
      { id: '2', dept: 'IT', task: 'Return 16" MacBook Pro & 4K Monitor', cleared: false },
      { id: '3', dept: 'Admin', task: 'Return Building Pass & Desk Pedestal Keys', cleared: false },
      { id: '4', dept: 'Finance', task: 'Audit Corporate Credit Card (Amex)', cleared: false },
      { id: '5', dept: 'HR', task: 'Complete Confidential Exit Feedback Form', cleared: false },
    ],
    notes: 'Hardware return scheduled for last working day.'
  },
  {
    id: 4,
    empCode: 'EMP-1088',
    name: 'Lily Collins',
    role: 'Lead Brand Strategist',
    dept: 'Marketing',
    lwd: '2026-09-25',
    it: 'Pending',
    admin: 'Pending',
    finance: 'Pending',
    status: 'Pending',
    items: [
      { id: '1', dept: 'IT', task: 'Transfer Social Media & Marketing Ad Account Ownership', cleared: false },
      { id: '2', dept: 'IT', task: 'Return Workstation & Accessories', cleared: false },
      { id: '3', dept: 'Admin', task: 'Return Access ID Card', cleared: false },
      { id: '4', dept: 'Finance', task: 'Vendor Retainer & Agency Expense Reconciliation', cleared: false },
      { id: '5', dept: 'HR', task: 'Exit Interview & Knowledge Transfer Sign-off', cleared: false },
    ],
    notes: 'Clearance tracking initialized post resignation approval.'
  }
];

export function ExitChecklist() {
  const [checklists, setChecklists] = useState<ExitChecklistRecord[]>(INITIAL_CHECKLISTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'In Progress' | 'Pending'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ExitChecklistRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredChecklists = useMemo(() => {
    return checklists.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [checklists, searchTerm, statusFilter]);

  const handleToggleItem = (itemId: string) => {
    if (!selectedRecord) return;
    const today = new Date().toISOString().split('T')[0];
    const updatedItems = selectedRecord.items.map(item => {
      if (item.id !== itemId) return item;
      const willClear = !item.cleared;
      return {
        ...item,
        cleared: willClear,
        clearedBy: willClear ? 'HR Ops Admin' : undefined,
        clearedDate: willClear ? today : undefined
      };
    });

    // Recalculate dept statuses
    const itItems = updatedItems.filter(i => i.dept === 'IT');
    const adminItems = updatedItems.filter(i => i.dept === 'Admin');
    const financeItems = updatedItems.filter(i => i.dept === 'Finance');

    const itStatus: 'Cleared' | 'In Progress' | 'Pending' = 
      itItems.every(i => i.cleared) ? 'Cleared' : itItems.some(i => i.cleared) ? 'In Progress' : 'Pending';
    const adminStatus: 'Cleared' | 'In Progress' | 'Pending' = 
      adminItems.every(i => i.cleared) ? 'Cleared' : adminItems.some(i => i.cleared) ? 'In Progress' : 'Pending';
    const financeStatus: 'Cleared' | 'In Progress' | 'Pending' = 
      financeItems.every(i => i.cleared) ? 'Cleared' : financeItems.some(i => i.cleared) ? 'In Progress' : 'Pending';

    const allDone = updatedItems.every(i => i.cleared);
    const someDone = updatedItems.some(i => i.cleared);
    const overallStatus: 'Completed' | 'In Progress' | 'Pending' = 
      allDone ? 'Completed' : someDone ? 'In Progress' : 'Pending';

    const updatedRecord: ExitChecklistRecord = {
      ...selectedRecord,
      items: updatedItems,
      it: itStatus,
      admin: adminStatus,
      finance: financeStatus,
      status: overallStatus
    };

    setSelectedRecord(updatedRecord);
    setChecklists(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    showToast('Departmental clearance task updated');
  };

  const handleApproveAll = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setChecklists(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return {
        ...rec,
        it: 'Cleared',
        admin: 'Cleared',
        finance: 'Cleared',
        status: 'Completed',
        items: rec.items.map(it => ({
          ...it,
          cleared: true,
          clearedBy: it.clearedBy || 'HR Clearance Board',
          clearedDate: it.clearedDate || today
        })),
        notes: (rec.notes ? rec.notes + ' | ' : '') + 'All departmental clearances fully approved.'
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        it: 'Cleared',
        admin: 'Cleared',
        finance: 'Cleared',
        status: 'Completed',
        items: prev.items.map(it => ({ ...it, cleared: true, clearedBy: it.clearedBy || 'HR Clearance Board', clearedDate: it.clearedDate || today }))
      } : null);
    }
    showToast('All departmental clearances marked cleared!');
  };

  const handleSendReminder = (rec: ExitChecklistRecord) => {
    setActiveDropdown(null);
    showToast(`Clearance reminders sent to IT, Facilities, and Finance coordinators for ${rec.name}`);
  };

  const handleDownloadClearanceCert = (rec: ExitChecklistRecord) => {
    const total = rec.items.length;
    const cleared = rec.items.filter(i => i.cleared).length;
    const certDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    const content = `===============================================================
              OFFICIAL EXIT CLEARANCE CERTIFICATE
===============================================================
Certificate Date: ${certDate}

Employee Name   : ${rec.name}
Employee ID     : ${rec.empCode}
Department      : ${rec.dept}
Job Title       : ${rec.role}
Last Working Day: ${rec.lwd}
Clearance Status: ${rec.status.toUpperCase()} (${cleared}/${total} Tasks Signed Off)
---------------------------------------------------------------
1. DEPARTMENTAL CLEARANCES
---------------------------------------------------------------
• Information Technology (IT) : ${rec.it.toUpperCase()}
• Facilities & Administration : ${rec.admin.toUpperCase()}
• Corporate Finance & Dues    : ${rec.finance.toUpperCase()}

---------------------------------------------------------------
2. DETAILED ACTION AUDIT
---------------------------------------------------------------
${rec.items.map((it, idx) => `[${it.cleared ? 'CLEARED' : 'PENDING'}] ${idx + 1}. [${it.dept}] ${it.task}
    - Cleared By : ${it.clearedBy || 'Awaiting Sign-off'}
    - Date       : ${it.clearedDate || 'Pending'}`).join('\n\n')}

---------------------------------------------------------------
Remarks / Handover Notes:
${rec.notes || 'None'}
===============================================================
Authorized Departmental Sign-offs:
IT Custodian        : ___________________   Date: _____________
Facilities Admin    : ___________________   Date: _____________
Finance Controller  : ___________________   Date: _____________
HR Operations Lead  : ___________________   Date: _____________
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Exit_Clearance_${rec.empCode}_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exit Clearance Certificate downloaded for ${rec.name}`);
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
            <span>Total In Clearance</span>
            <CheckSquare className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{checklists.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Departing employees</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Fully Cleared</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {checklists.filter(i => i.status === 'Completed').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Ready for final FnF</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {checklists.filter(i => i.status === 'In Progress').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Pending multi-dept items</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Pending Start</span>
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {checklists.filter(i => i.status === 'Pending').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Notice period serving</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Exit Clearance Checklist</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Track departmental clearance sign-offs across IT, Admin, and Finance</p>
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
            {(['All', 'Completed', 'In Progress', 'Pending'] as const).map(f => (
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
                <th className="px-6 py-3.5">IT Clearance</th>
                <th className="px-6 py-3.5">Admin Clearance</th>
                <th className="px-6 py-3.5">Finance Clearance</th>
                <th className="px-6 py-3.5">Overall Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChecklists.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No exit clearance records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredChecklists.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.empCode} • {item.dept}</div>
                      <div className="text-[11px] text-rose-600 font-medium">LWD: {item.lwd}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.it === 'Cleared' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Cleared
                        </span>
                      ) : item.it === 'In Progress' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          <AlertCircle className="w-3 h-3 mr-1 text-slate-400"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.admin === 'Cleared' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Cleared
                        </span>
                      ) : item.admin === 'In Progress' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          <AlertCircle className="w-3 h-3 mr-1 text-slate-400"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.finance === 'Cleared' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Cleared
                        </span>
                      ) : item.finance === 'In Progress' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          <AlertCircle className="w-3 h-3 mr-1 text-slate-400"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Completed
                        </span>
                      ) : item.status === 'In Progress' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          <Clock className="w-3 h-3 mr-1 text-slate-400"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Clearance Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 border-rose-200 font-medium flex items-center gap-1.5"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          Clearance
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
                                Clearance Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckSquare className="w-3.5 h-3.5 text-rose-600" />
                                Audit Clearance Tasks
                              </button>

                              <button
                                onClick={() => handleApproveAll(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Mark All Clearances Approved
                              </button>

                              <button
                                onClick={() => handleSendReminder(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Send className="w-3.5 h-3.5 text-blue-600" />
                                Send Reminder to Dept Heads
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadClearanceCert(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Clearance Certificate (.txt)
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
          <div>Showing {filteredChecklists.length} of {checklists.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredChecklists.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Exit Clearance Audit & Toggle Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-semibold">Departmental Exit Clearance Audit</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
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
              {/* Progress Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Clearance Completion
                  </div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">
                    {selectedRecord.items.filter(i => i.cleared).length} of {selectedRecord.items.length} Items Cleared
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    IT: {selectedRecord.it} • Admin: {selectedRecord.admin} • Finance: {selectedRecord.finance}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-rose-600">
                    {Math.round((selectedRecord.items.filter(i => i.cleared).length / selectedRecord.items.length) * 100)}%
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApproveAll(selectedRecord.id)}
                    className="h-7 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 mt-1"
                  >
                    Clear All Items
                  </Button>
                </div>
              </div>

              {/* Categorized Clearance Tasks */}
              {(['IT', 'Admin', 'Finance', 'HR'] as const).map(deptKey => {
                const itemsInDept = selectedRecord.items.filter(i => i.dept === deptKey);
                if (itemsInDept.length === 0) return null;

                return (
                  <div key={deptKey} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
                      <span className="flex items-center gap-1.5">
                        {deptKey === 'IT' && <Shield className="w-3.5 h-3.5 text-indigo-600" />}
                        {deptKey === 'Admin' && <Building2 className="w-3.5 h-3.5 text-amber-600" />}
                        {deptKey === 'Finance' && <CreditCard className="w-3.5 h-3.5 text-emerald-600" />}
                        {deptKey === 'HR' && <UserCheck className="w-3.5 h-3.5 text-rose-600" />}
                        {deptKey} Clearance Sign-off
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {itemsInDept.filter(i => i.cleared).length}/{itemsInDept.length} Cleared
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {itemsInDept.map(item => (
                        <div
                          key={item.id}
                          onClick={() => handleToggleItem(item.id)}
                          className={`p-3 rounded-lg border flex items-center justify-between transition-colors cursor-pointer ${
                            item.cleared 
                              ? 'bg-emerald-50/50 border-emerald-200/80 text-slate-900' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input 
                              type="checkbox" 
                              checked={item.cleared} 
                              onChange={() => {}} // Handled by outer div
                              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-0.5"
                            />
                            <div>
                              <div className={`text-xs font-medium ${item.cleared ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                                {item.task}
                              </div>
                              {item.cleared && item.clearedBy && (
                                <div className="text-[11px] text-emerald-700 mt-0.5">
                                  Signed off by {item.clearedBy} on {item.clearedDate}
                                </div>
                              )}
                            </div>
                          </div>

                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${
                            item.cleared ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.cleared ? 'Cleared' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Notes */}
              {selectedRecord.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Departmental Clearance Remarks:</span> {selectedRecord.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadClearanceCert(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Clearance Certificate (.txt)
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
                  onClick={() => handleApproveAll(selectedRecord.id)}
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark All Cleared
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
