import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, LogOut, Calendar, Download, Check, 
  Send, UserX, X, FileText, CheckCircle, ShieldAlert
} from 'lucide-react';

export interface ResignationRecord {
  id: number;
  empCode: string;
  name: string;
  role: string;
  dept: string;
  date: string; // Resignation submitted
  noticePeriodDays: number;
  lwd: string; // Last Working Day
  reason: string;
  status: 'Approved' | 'Pending' | 'Under Review' | 'Retained';
  manager: string;
  hrPartner: string;
  personalEmail: string;
  letterExcerpt: string;
  discussionNotes?: string;
  approvedDate?: string;
}

const INITIAL_RESIGNATIONS: ResignationRecord[] = [
  {
    id: 1,
    empCode: 'EMP-1042',
    name: 'Alex Turner',
    role: 'Senior Enterprise Account Executive',
    dept: 'Sales',
    date: '2026-08-15',
    noticePeriodDays: 30,
    lwd: '2026-09-15',
    reason: 'Pursuing Higher Education / MBA Program',
    status: 'Approved',
    manager: 'Sarah Jenkins (VP Sales)',
    hrPartner: 'Alice Cooper (HRBP)',
    personalEmail: 'alex.turner@gmail.com',
    letterExcerpt: 'Please accept this letter as formal notification that I am leaving my position as Senior Enterprise AE on September 15, 2026 to begin full-time graduate business school.',
    discussionNotes: 'Manager conducted exit sync. Candidate was open and grateful; confirmed no retention possibility due to scheduled university admission.',
    approvedDate: '2026-08-17'
  },
  {
    id: 2,
    empCode: 'EMP-1088',
    name: 'Lily Collins',
    role: 'Lead Brand Strategist',
    dept: 'Marketing',
    date: '2026-08-25',
    noticePeriodDays: 30,
    lwd: '2026-09-25',
    reason: 'Better Opportunity / Relocation to London',
    status: 'Pending',
    manager: 'Marcus Vance (CMO)',
    hrPartner: 'Robert Sterling (Lead HRBP)',
    personalEmail: 'lily.collins@outlook.com',
    letterExcerpt: 'I am tendering my resignation to accept an opportunity based in Europe. I will do everything possible to ensure all marketing campaigns and brand assets are transferred seamlessly.',
    discussionNotes: 'Retention discussion scheduled with CMO tomorrow to explore remote UK compensation package.',
  },
  {
    id: 3,
    empCode: 'EMP-1102',
    name: 'Julian Casablancas',
    role: 'Staff DevOps Engineer',
    dept: 'Engineering',
    date: '2026-08-28',
    noticePeriodDays: 60,
    lwd: '2026-10-28',
    reason: 'Compensation & Career Growth',
    status: 'Under Review',
    manager: 'Elena Rostova (Director of Infra)',
    hrPartner: 'Alice Cooper (HRBP)',
    personalEmail: 'julian.cas@gmail.com',
    letterExcerpt: 'After careful consideration, I have decided to step down from my role to take on an engineering leadership challenge at a series-B infrastructure startup.',
    discussionNotes: 'Counter-offer being prepared by HR Compensation Committee for Principal Architect title.',
  },
  {
    id: 4,
    empCode: 'EMP-1145',
    name: 'Maya Lin',
    role: 'UX Researcher',
    dept: 'Product Design',
    date: '2026-08-10',
    noticePeriodDays: 30,
    lwd: '2026-09-10',
    reason: 'Personal / Family Relocation',
    status: 'Approved',
    manager: 'Chloe Bennett (Head of Design)',
    hrPartner: 'Robert Sterling (Lead HRBP)',
    personalEmail: 'maya.lin.design@gmail.com',
    letterExcerpt: 'Due to family relocation across the country, I will be stepping down effective September 10. It has been a pleasure working alongside the design squad.',
    discussionNotes: 'Formal resignation accepted. Exit clearances initiated.',
    approvedDate: '2026-08-12'
  }
];

export function Resignations() {
  const [resignations, setResignations] = useState<ResignationRecord[]>(INITIAL_RESIGNATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Under Review'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ResignationRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredResignations = useMemo(() => {
    return resignations.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [resignations, searchTerm, statusFilter]);

  const handleApprove = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setResignations(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return {
        ...rec,
        status: 'Approved',
        approvedDate: today,
        discussionNotes: (rec.discussionNotes ? rec.discussionNotes + ' | ' : '') + `Resignation approved on ${today}. Clearance workflows triggered.`
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        status: 'Approved',
        approvedDate: today
      } : null);
    }
    showToast('Resignation approved and exit clearances initialized!');
  };

  const handleRetain = (id: number) => {
    setResignations(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return {
        ...rec,
        status: 'Retained',
        discussionNotes: (rec.discussionNotes ? rec.discussionNotes + ' | ' : '') + 'Employee accepted counter-offer and withdrew resignation.'
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        status: 'Retained'
      } : null);
    }
    showToast('Employee successfully retained! Resignation withdrawn.');
  };

  const handleDownloadAcceptanceLetter = (rec: ResignationRecord) => {
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const content = `===============================================================
            FORMAL RESIGNATION ACCEPTANCE LETTER
===============================================================
Date: ${todayStr}

To:
${rec.name}
Employee ID : ${rec.empCode}
Designation : ${rec.role}
Department  : ${rec.dept}

Subject: ACCEPTANCE OF RESIGNATION & RELIEVING INSTRUCTIONS

Dear ${rec.name},

We acknowledge receipt of your resignation notice dated ${rec.date}, submitting 
your resignation from the services of the Company.

Following managerial discussions, we hereby formally ACCEPT your resignation. 
Your Last Working Day (LWD) with the organization has been confirmed as:

                    >>> ${rec.lwd} <<<

Kindly adhere to the standard offboarding clearances detailed below:
1. Departmental & Project Handover (Knowledge Transfer) to your designated successor.
2. Custody return of all company assets (laptops, access tags, and credit cards).
3. Completion of the HR Exit Interview Survey.
4. Clearance of all corporate expenses and financial dues.

Your Full and Final Settlement (FnF) statement and relieving documentation will 
be disbursed within the statutory cycle following your final clearance.

We take this opportunity to thank you for your services and contributions to 
our organization and wish you every success in your future endeavors.

Sincerely,

Human Resources Directorate
Global Talent Operations
Ref: HR-EXIT-ACCEPT-${rec.empCode}
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resignation_Acceptance_${rec.empCode}_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Resignation Acceptance Letter downloaded for ${rec.name}`);
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
            <span>Active Requests</span>
            <LogOut className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{resignations.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Total separation notices</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Approved & Serving</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {resignations.filter(i => i.status === 'Approved').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">LWD dates established</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {resignations.filter(i => i.status === 'Pending').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Awaiting manager sync</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Retention Discussions</span>
            <ShieldAlert className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {resignations.filter(i => i.status === 'Under Review').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Counter-offer in progress</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Active Resignations</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Manage resignation notices, last working days, and separation approvals</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search employee, dept, reason..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Pending', 'Approved', 'Under Review'] as const).map(f => (
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
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Resignation Date</th>
                <th className="px-6 py-3.5">Last Working Day</th>
                <th className="px-6 py-3.5">Notice & Reason</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResignations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No resignation records match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredResignations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.empCode} • {item.role}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-slate-700">{item.dept}</span>
                      <div className="text-xs text-slate-400 mt-0.5">Mgr: {item.manager.split(' ')[0]}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{item.date}</div>
                      <div className="text-xs text-slate-400">Notice: {item.noticePeriodDays} days</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-rose-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        {item.lwd}
                      </div>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-xs font-medium text-slate-800 truncate" title={item.reason}>
                        {item.reason}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Approved' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Approved
                        </span>
                      ) : item.status === 'Under Review' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                          <Clock className="w-3 h-3 mr-1 text-purple-600"/> Under Review
                        </span>
                      ) : item.status === 'Retained' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <CheckCircle className="w-3 h-3 mr-1 text-blue-600"/> Retained
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Review Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 border-rose-200 font-medium flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Review
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
                                Separation Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <FileText className="w-3.5 h-3.5 text-rose-600" />
                                Inspect Resignation Details
                              </button>

                              <button
                                onClick={() => handleApprove(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Approve & Trigger Clearances
                              </button>

                              <button
                                onClick={() => handleRetain(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                                Mark Employee Retained
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadAcceptanceLetter(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Acceptance Letter (.txt)
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
          <div>Showing {filteredResignations.length} of {resignations.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredResignations.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Resignation Detail & Review Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <LogOut className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-semibold">Resignation Review & Separation Order</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    selectedRecord.status === 'Under Review' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.name} ({selectedRecord.empCode}) • {selectedRecord.role} • {selectedRecord.dept}
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
              {/* Timeline Overview */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Submission Date:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.date}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Notice Period:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.noticePeriodDays} Days</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Last Working Day:</span>
                  <div className="font-bold text-rose-600 mt-0.5">{selectedRecord.lwd}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Approval Status:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.status}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium">Hiring Manager:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.manager}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium">HR Business Partner:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.hrPartner}</div>
                </div>
              </div>

              {/* Resignation Letter Excerpt */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Formal Resignation Statement</span>
                  <span className="text-[11px] text-slate-400 font-normal">Reason: {selectedRecord.reason}</span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
                  "{selectedRecord.letterExcerpt}"
                </div>
              </div>

              {/* Manager / HRBP Sync Notes */}
              {selectedRecord.discussionNotes && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Manager & HR Sync Log:</span> {selectedRecord.discussionNotes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadAcceptanceLetter(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Acceptance Letter (.txt)
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
                  onClick={() => handleRetain(selectedRecord.id)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Retain Employee
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(selectedRecord.id)}
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve Resignation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
