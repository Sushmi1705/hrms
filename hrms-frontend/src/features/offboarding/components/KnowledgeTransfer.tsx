import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, BookOpen, UserCheck, Download, Check, 
  Send, Users, FileCode, X, CheckSquare
} from 'lucide-react';

export interface KTModule {
  id: string;
  topic: string;
  successor: string;
  completed: boolean;
  notes?: string;
  signoffDate?: string;
}

export interface KTRecord {
  id: number;
  empCode: string;
  name: string;
  dept: string;
  role: string;
  lwd: string;
  successor: string;
  rep: 'Yes' | 'Pending';
  kt: 'Done' | 'In Progress' | 'Pending';
  mgr: 'Approved' | 'Pending' | 'In Review';
  status: 'Completed' | 'In Progress' | 'Pending';
  manager: string;
  modules: KTModule[];
  handoverSummary?: string;
}

const INITIAL_KT: KTRecord[] = [
  {
    id: 1,
    empCode: 'EMP-1042',
    name: 'Alex Turner',
    dept: 'Sales',
    role: 'Senior Enterprise AE',
    lwd: '2026-09-15',
    successor: 'Jordan Belfort (Enterprise AE)',
    rep: 'Yes',
    kt: 'In Progress',
    mgr: 'Pending',
    status: 'In Progress',
    manager: 'Sarah Jenkins (VP Sales)',
    modules: [
      { id: '1', topic: 'Strategic Tier-1 Client Introductions (Fortune 500)', successor: 'Jordan Belfort', completed: true, signoffDate: '2026-09-01' },
      { id: '2', topic: 'Pipeline Deal Walkthrough & Salesforce CRM Stage Handover', successor: 'Jordan Belfort', completed: true, signoffDate: '2026-09-02' },
      { id: '3', topic: 'Q4 Contract Renewals & Discount Governance Walkthrough', successor: 'Jordan Belfort', completed: false },
      { id: '4', topic: 'Channel Partner & Reseller Alliance Contacts Documented', successor: 'Jordan Belfort', completed: false },
    ],
    handoverSummary: 'Client transition calls underway. Top 5 accounts transitioned successfully.'
  },
  {
    id: 2,
    empCode: 'EMP-1077',
    name: 'Tom Holland',
    dept: 'Engineering',
    role: 'Staff Frontend Engineer',
    lwd: '2026-09-01',
    successor: 'Sophie Laurent (Senior FE)',
    rep: 'Yes',
    kt: 'Done',
    mgr: 'Approved',
    status: 'Completed',
    manager: 'Michael Chen (VP Eng)',
    modules: [
      { id: '1', topic: 'Design System Component Architecture & RFC 44', successor: 'Sophie Laurent', completed: true, signoffDate: '2026-08-28' },
      { id: '2', topic: 'Micro-Frontend Federation CI/CD Deployment Scripts', successor: 'Sophie Laurent', completed: true, signoffDate: '2026-08-29' },
      { id: '3', topic: 'Design Tokens & Tailwind Plugin Repository Admin Handover', successor: 'Sophie Laurent', completed: true, signoffDate: '2026-08-30' },
      { id: '4', topic: 'Sentry Monitoring & Web Vitals Alerting Runbooks', successor: 'Sophie Laurent', completed: true, signoffDate: '2026-08-31' },
    ],
    handoverSummary: 'Exemplary handover. All architectural diagrams committed to Confluence.'
  },
  {
    id: 3,
    empCode: 'EMP-1088',
    name: 'Lily Collins',
    dept: 'Marketing',
    role: 'Lead Brand Strategist',
    lwd: '2026-09-25',
    successor: 'Pending Assignment',
    rep: 'Pending',
    kt: 'Pending',
    mgr: 'Pending',
    status: 'Pending',
    manager: 'Marcus Vance (CMO)',
    modules: [
      { id: '1', topic: 'Brand Asset Guidelines & Figma Vector Library Handover', successor: 'TBD', completed: false },
      { id: '2', topic: 'Q4 Global Advertising Campaign Creative Briefs', successor: 'TBD', completed: false },
      { id: '3', topic: 'External PR & Media Agency Contacts Roster', successor: 'TBD', completed: false },
    ],
    handoverSummary: 'Awaiting formal successor assignment from Marketing leadership.'
  },
  {
    id: 4,
    empCode: 'EMP-1102',
    name: 'Julian Casablancas',
    dept: 'Engineering',
    role: 'Staff DevOps Engineer',
    lwd: '2026-10-28',
    successor: 'Vikram Patel (Principal SRE)',
    rep: 'Yes',
    kt: 'In Progress',
    mgr: 'Pending',
    status: 'In Progress',
    manager: 'Elena Rostova (Director of Infra)',
    modules: [
      { id: '1', topic: 'Kubernetes Multi-Region Cluster Secrets & Vault Policies', successor: 'Vikram Patel', completed: true, signoffDate: '2026-09-03' },
      { id: '2', topic: 'Terraform Infrastructure-as-Code State Lock Handover', successor: 'Vikram Patel', completed: false },
      { id: '3', topic: 'On-Call PagerDuty Escalation Paths & Incident Playbooks', successor: 'Vikram Patel', completed: false },
    ],
    handoverSummary: 'Knowledge transfer sessions scheduled over the 60-day notice window.'
  }
];

export function KnowledgeTransfer() {
  const [ktRecords, setKtRecords] = useState<KTRecord[]>(INITIAL_KT);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'In Progress' | 'Pending'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<KTRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredKt = useMemo(() => {
    return ktRecords.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.successor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [ktRecords, searchTerm, statusFilter]);

  const handleToggleModule = (modId: string) => {
    if (!selectedRecord) return;
    const today = new Date().toISOString().split('T')[0];
    const updatedModules = selectedRecord.modules.map(m => {
      if (m.id !== modId) return m;
      const willComplete = !m.completed;
      return {
        ...m,
        completed: willComplete,
        signoffDate: willComplete ? today : undefined
      };
    });

    const allCompleted = updatedModules.every(m => m.completed);
    const someCompleted = updatedModules.some(m => m.completed);

    const updatedRecord: KTRecord = {
      ...selectedRecord,
      modules: updatedModules,
      kt: allCompleted ? 'Done' : someCompleted ? 'In Progress' : 'Pending',
      status: allCompleted ? 'Completed' : someCompleted ? 'In Progress' : 'Pending',
      mgr: allCompleted ? 'Approved' : 'Pending'
    };

    setSelectedRecord(updatedRecord);
    setKtRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    showToast('Knowledge transfer milestone updated');
  };

  const handleSignoffManager = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setKtRecords(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return {
        ...rec,
        kt: 'Done',
        mgr: 'Approved',
        status: 'Completed',
        modules: rec.modules.map(m => ({ ...m, completed: true, signoffDate: m.signoffDate || today })),
        handoverSummary: (rec.handoverSummary ? rec.handoverSummary + ' | ' : '') + 'Manager completed formal handover review and approved all documentation.'
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        kt: 'Done',
        mgr: 'Approved',
        status: 'Completed',
        modules: prev.modules.map(m => ({ ...m, completed: true, signoffDate: m.signoffDate || today }))
      } : null);
    }
    showToast('Manager handover sign-off recorded successfully!');
  };

  const handleDownloadKtDossier = (rec: KTRecord) => {
    const total = rec.modules.length;
    const done = rec.modules.filter(m => m.completed).length;
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    const content = `===============================================================
            KNOWLEDGE TRANSFER & HANDOVER DOSSIER
===============================================================
Dossier Date    : ${todayStr}
Departing Staff : ${rec.name}
Employee ID     : ${rec.empCode}
Department      : ${rec.dept}
Designation     : ${rec.role}
Last Working Day: ${rec.lwd}
Hiring Manager  : ${rec.manager}
Designated Peer : ${rec.successor}
KT Status       : ${rec.kt.toUpperCase()} (${done}/${total} Modules Handed Over)
Manager Sign-off: ${rec.mgr.toUpperCase()}
---------------------------------------------------------------
1. DETAILED HANDOVER SYLLABUS & CONFIRMATION
---------------------------------------------------------------
${rec.modules.map((m, i) => `[${m.completed ? 'COMPLETED' : ' PENDING '}] Module ${i + 1}: ${m.topic}
   - Handover To : ${m.successor}
   - Completion  : ${m.signoffDate || 'Pending Final Demonstration'}`).join('\n\n')}

---------------------------------------------------------------
2. HANDOVER SUMMARY & DOCUMENTATION REPOSITORY
---------------------------------------------------------------
${rec.handoverSummary || 'None recorded.'}

===============================================================
Sign-off & Acceptance:
"We confirm that all relevant domain knowledge, critical credentials, 
documentation, and unresolved tickets have been fully transferred 
without blockers."

Departing Employee Signature: __________________   Date: ________
Successor Peer Signature    : __________________   Date: ________
Hiring Manager Signature    : __________________   Date: ________
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KT_Handover_${rec.empCode}_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Knowledge Transfer Dossier downloaded for ${rec.name}`);
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
            <span>Active Handovers</span>
            <BookOpen className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{ktRecords.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Departing employee plans</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>KT 100% Signed Off</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {ktRecords.filter(i => i.status === 'Completed').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Manager approved</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Handovers In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {ktRecords.filter(i => i.status === 'In Progress').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Shadowing & walkthroughs</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Successors Assigned</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {ktRecords.filter(i => i.rep === 'Yes').length} / {ktRecords.length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Peers receiving handovers</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Knowledge Transfer</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Ensure comprehensive handover of responsibilities, accounts, and runbooks</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search employee, successor..." 
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
                <th className="px-6 py-3.5">Designated Successor</th>
                <th className="px-6 py-3.5">KT Progress</th>
                <th className="px-6 py-3.5">Manager Sign-off</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKt.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No knowledge transfer records match your search.
                  </td>
                </tr>
              ) : (
                filteredKt.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.empCode} • {item.dept}</div>
                      <div className="text-[11px] text-rose-600">LWD: {item.lwd}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                        {item.successor}
                      </div>
                      <span className={`inline-flex items-center px-1.5 py-0.2 mt-0.5 rounded text-[10px] font-medium ${
                        item.rep === 'Yes' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.rep === 'Yes' ? 'Successor Assigned' : 'Awaiting Peer'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.kt === 'Done' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Done
                        </span>
                      ) : item.kt === 'In Progress' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          <Clock className="w-3 h-3 mr-1 text-slate-400"/> Pending
                        </span>
                      )}
                      <div className="text-[11px] text-slate-500 mt-1">
                        {item.modules.filter(m => m.completed).length}/{item.modules.length} topics documented
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.mgr === 'Approved' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                        </span>
                      )}
                      <div className="text-[11px] text-slate-400 mt-0.5">Mgr: {item.manager.split(' ')[0]}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> {item.status}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Handover Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 border-rose-200 font-medium flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Handover
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
                                Handover Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-rose-600" />
                                Inspect Handover Plan
                              </button>

                              <button
                                onClick={() => handleSignoffManager(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Manager Sign-off Handover
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadKtDossier(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Handover Dossier (.txt)
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
          <div>Showing {filteredKt.length} of {ktRecords.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredKt.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* KT Inspection & Topic Check-off Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-semibold">Knowledge Transfer & Handover Syllabus</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.name} ({selectedRecord.empCode}) • {selectedRecord.dept} • Successor: {selectedRecord.successor}
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
                    Handover Execution
                  </div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">
                    {selectedRecord.modules.filter(m => m.completed).length} of {selectedRecord.modules.length} Topics Completed
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Hiring Manager: {selectedRecord.manager}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-rose-600">
                    {Math.round((selectedRecord.modules.filter(m => m.completed).length / selectedRecord.modules.length) * 100)}%
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSignoffManager(selectedRecord.id)}
                    className="h-7 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 mt-1"
                  >
                    Manager Sign-off
                  </Button>
                </div>
              </div>

              {/* Handover Modules List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 px-1 uppercase tracking-wider">
                  Handover Syllabus Checklist
                </div>

                <div className="space-y-2">
                  {selectedRecord.modules.map((mod, idx) => (
                    <div
                      key={mod.id}
                      onClick={() => handleToggleModule(mod.id)}
                      className={`p-3.5 rounded-lg border flex items-center justify-between transition-colors cursor-pointer ${
                        mod.completed 
                          ? 'bg-emerald-50/50 border-emerald-200/80' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          checked={mod.completed} 
                          onChange={() => {}} // Handled by div
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-0.5"
                        />
                        <div>
                          <div className={`text-xs font-semibold ${mod.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                            {idx + 1}. {mod.topic}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>Successor: {mod.successor}</span>
                            {mod.signoffDate && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-700">Handed over on {mod.signoffDate}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${
                        mod.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {mod.completed ? 'Handed Over' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Handover Notes */}
              {selectedRecord.handoverSummary && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Handover Log & Repository:</span> {selectedRecord.handoverSummary}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadKtDossier(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Handover Dossier (.txt)
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
                  onClick={() => handleSignoffManager(selectedRecord.id)}
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve All & Sign-off
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
