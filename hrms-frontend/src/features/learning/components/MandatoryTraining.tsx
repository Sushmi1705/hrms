import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, ShieldCheck, AlertTriangle, Download, Check, 
  Send, Users, Calendar, X, FileText
} from 'lucide-react';

export interface NonCompliantUser {
  id: string;
  name: string;
  dept: string;
  email: string;
}

export interface MandatoryTrainingRecord {
  id: number;
  code: string;
  name: string;
  deadline: string;
  rate: number; // percentage e.g. 92%
  nonCompliantCount: number;
  status: 'Completed' | 'In Progress' | 'Overdue';
  audience: string;
  frequency: string;
  nonCompliantList: NonCompliantUser[];
  notes?: string;
}

const INITIAL_MANDATORY: MandatoryTrainingRecord[] = [
  {
    id: 1,
    code: 'MAND-SEC-2026',
    name: 'Annual Security & Phishing Awareness Training',
    deadline: '2026-09-30',
    rate: 94,
    nonCompliantCount: 18,
    status: 'In Progress',
    audience: 'All Employees (Global)',
    frequency: 'Annual Requirement',
    nonCompliantList: [
      { id: '1', name: 'Alex Turner', dept: 'Sales', email: 'alex.turner@company.com' },
      { id: '2', name: 'Julian Casablancas', dept: 'Engineering', email: 'julian.cas@company.com' },
      { id: '3', name: 'Maya Lin', dept: 'Design', email: 'maya.lin@company.com' }
    ],
    notes: 'Escalation reminder scheduled 7 days prior to deadline.'
  },
  {
    id: 2,
    code: 'MAND-ETHICS-2026',
    name: 'Workplace Conduct & Anti-Harassment Certification',
    deadline: '2026-08-31',
    rate: 100,
    nonCompliantCount: 0,
    status: 'Completed',
    audience: 'All Staff & Contractors',
    frequency: 'Annual Requirement',
    nonCompliantList: [],
    notes: '100% compliance certified for fiscal year audit.'
  },
  {
    id: 3,
    code: 'MAND-GDPR-2026',
    name: 'GDPR & CCPA Data Handling Governance',
    deadline: '2026-10-15',
    rate: 78,
    nonCompliantCount: 45,
    status: 'In Progress',
    audience: 'Product, Eng & Support Teams',
    frequency: 'Bi-Annual Requirement',
    nonCompliantList: [
      { id: '1', name: 'Chris Evans', dept: 'Engineering', email: 'chris.evans@company.com' },
      { id: '2', name: 'Lily Collins', dept: 'Marketing', email: 'lily.collins@company.com' }
    ],
    notes: 'Critical compliance module for European market operations.'
  },
  {
    id: 4,
    code: 'MAND-FIN-2026',
    name: 'Insider Trading & Anti-Bribery Regulations',
    deadline: '2026-07-31',
    rate: 88,
    nonCompliantCount: 12,
    status: 'Overdue',
    audience: 'Finance, Executive & Sales Staff',
    frequency: 'Annual Requirement',
    nonCompliantList: [
      { id: '1', name: 'Jordan Belfort', dept: 'Sales', email: 'jordan.b@company.com' }
    ],
    notes: '12 accounts flagged as overdue. Legal department escalation initiated.'
  }
];

export function MandatoryTraining() {
  const [trainings, setTrainings] = useState<MandatoryTrainingRecord[]>(INITIAL_MANDATORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'In Progress' | 'Overdue'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MandatoryTrainingRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredTrainings = useMemo(() => {
    return trainings.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.audience.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [trainings, searchTerm, statusFilter]);

  const handleSendNudge = (rec: MandatoryTrainingRecord) => {
    setActiveDropdown(null);
    showToast(`Compliance warning email dispatched to ${rec.nonCompliantCount} non-compliant employees!`);
  };

  const handleMarkCompliant = (id: number) => {
    setTrainings(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        rate: 100,
        nonCompliantCount: 0,
        status: 'Completed',
        nonCompliantList: [],
        notes: (t.notes ? t.notes + ' | ' : '') + '100% compliance certified.'
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        rate: 100,
        nonCompliantCount: 0,
        status: 'Completed',
        nonCompliantList: []
      } : null);
    }
    showToast('Mandatory training marked 100% compliant!');
  };

  const handleDownloadReport = (rec: MandatoryTrainingRecord) => {
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const content = `===============================================================
            MANDATORY COMPLIANCE TRAINING AUDIT REPORT
===============================================================
Training Code   : ${rec.code}
Training Title  : ${rec.name}
Frequency       : ${rec.frequency}
Target Audience : ${rec.audience}
Compliance Rate : ${rec.rate}%
Non-Compliant   : ${rec.nonCompliantCount} Employees
Deadline Date   : ${rec.deadline}
Overall Status  : ${rec.status.toUpperCase()}
Audit Date      : ${todayStr}
---------------------------------------------------------------
1. OUTSTANDING NON-COMPLIANT EMPLOYEES
---------------------------------------------------------------
${rec.nonCompliantList.length === 0 ? 'No non-compliant employees. 100% completion achieved.' : 
rec.nonCompliantList.map((u, i) => `${i + 1}. ${u.name} (${u.dept}) - ${u.email}`).join('\n')}

---------------------------------------------------------------
Compliance Officer Remarks:
"${rec.notes || 'None recorded.'}"

===============================================================
Legal & Compliance Directorate
Enterprise Risk Oversight Bureau
Ref: COMP-AUDIT-${rec.code}
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Compliance_Audit_${rec.code}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Compliance report downloaded for ${rec.name}`);
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
            <span>Mandatory Tracks</span>
            <ShieldCheck className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{trainings.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Statutory requirements</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Compliance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {Math.round(trainings.reduce((acc, curr) => acc + curr.rate, 0) / trainings.length)}%
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Target: 95%+ required</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Non-Compliant</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {trainings.reduce((acc, curr) => acc + curr.nonCompliantCount, 0)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Staff with pending tasks</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Overdue Courses</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {trainings.filter(i => i.status === 'Overdue').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Past statutory deadline</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Mandatory Training</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Monitor enterprise compliance requirements, deadlines, and completion audits</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search compliance training..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Completed', 'In Progress', 'Overdue'] as const).map(f => (
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
                <th className="px-6 py-3.5">Training Name</th>
                <th className="px-6 py-3.5">Deadline</th>
                <th className="px-6 py-3.5">Completion Rate</th>
                <th className="px-6 py-3.5">Non-Compliant</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrainings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No mandatory training records match your search.
                  </td>
                </tr>
              ) : (
                filteredTrainings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.code} • {item.frequency}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.deadline}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              item.rate === 100 ? 'bg-emerald-500' : item.rate >= 90 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.rate}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{item.rate}%</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.nonCompliantCount > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                          {item.nonCompliantCount} Staff
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          0 (All Clear)
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Certified
                        </span>
                      ) : item.status === 'Overdue' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertCircle className="w-3 h-3 mr-1 text-rose-600"/> Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> In Progress
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Audit Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 border-rose-200 font-medium flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Audit
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
                                Compliance Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                                Audit Compliance Status
                              </button>

                              <button
                                onClick={() => handleSendNudge(item)}
                                className="w-full px-3.5 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2.5 font-medium"
                              >
                                <Send className="w-3.5 h-3.5 text-amber-600" />
                                Send Escalation Reminder
                              </button>

                              <button
                                onClick={() => handleMarkCompliant(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Mark 100% Certified
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadReport(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Audit Report (.txt)
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
          <div>Showing {filteredTrainings.length} of {trainings.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredTrainings.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Mandatory Training Compliance Audit Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-semibold">{selectedRecord.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    selectedRecord.status === 'Overdue' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.code} • Frequency: {selectedRecord.frequency} • Deadline: {selectedRecord.deadline}
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
              {/* Compliance Rate Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Enterprise Compliance Level
                  </div>
                  <div className="text-2xl font-extrabold text-slate-800 mt-0.5">
                    {selectedRecord.rate}% Organization Complete
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Target Audience: {selectedRecord.audience}
                  </div>
                </div>
                <div className="text-right">
                  {selectedRecord.nonCompliantCount > 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleSendNudge(selectedRecord)}
                      className="h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Nudge Non-Compliant
                    </Button>
                  )}
                </div>
              </div>

              {/* Non-Compliant Staff Roster */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Non-Compliant Employee Watchlist</span>
                  <span className="text-slate-400 font-normal">{selectedRecord.nonCompliantCount} Total</span>
                </div>

                {selectedRecord.nonCompliantList.length === 0 ? (
                  <div className="p-6 text-center bg-emerald-50/50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800">
                    All employees have successfully completed this mandatory compliance module.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {selectedRecord.nonCompliantList.map(u => (
                      <div key={u.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-slate-800">{u.name}</div>
                          <div className="text-slate-500 text-[11px]">{u.dept} • {u.email}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showToast(`Escalation notice sent to ${u.name}`)}
                          className="h-7 text-[11px] text-amber-700 border-amber-200 bg-amber-50/50"
                        >
                          Ping Employee
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Audit Notes */}
              {selectedRecord.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Compliance Officer Log:</span> {selectedRecord.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Audit Report (.txt)
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
                  onClick={() => handleMarkCompliant(selectedRecord.id)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark 100% Certified
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
