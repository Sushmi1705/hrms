import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, FileText, Award, Download, Check, 
  Send, ShieldCheck, Mail, X, Printer
} from 'lucide-react';

export interface ExitDocRecord {
  id: number;
  empCode: string;
  name: string;
  dept: string;
  role: string;
  joiningDate: string;
  lwd: string;
  rel: 'Issued' | 'Draft' | 'Pending';
  exp: 'Issued' | 'Draft' | 'Pending';
  fnf: 'Issued' | 'Draft' | 'Pending';
  status: 'Completed' | 'In Progress' | 'Pending';
  personalEmail: string;
  issuedDate?: string;
  notes?: string;
}

const INITIAL_DOCS: ExitDocRecord[] = [
  {
    id: 1,
    empCode: 'EMP-1042',
    name: 'Alex Turner',
    dept: 'Sales',
    role: 'Senior Enterprise Account Executive',
    joiningDate: '2023-03-15',
    lwd: '2026-09-15',
    rel: 'Draft',
    exp: 'Draft',
    fnf: 'Pending',
    status: 'Pending',
    personalEmail: 'alex.turner@gmail.com',
    notes: 'Draft letters generated; pending final departmental clearance on September 15.'
  },
  {
    id: 2,
    empCode: 'EMP-1011',
    name: 'Robert Downey',
    dept: 'Executive Leadership',
    role: 'Vice President of Global Strategy',
    joiningDate: '2020-01-10',
    lwd: '2026-08-15',
    rel: 'Issued',
    exp: 'Issued',
    fnf: 'Issued',
    status: 'Completed',
    personalEmail: 'robert.downey@gmail.com',
    issuedDate: '2026-08-16',
    notes: 'Complete exit packet signed by Chief People Officer and dispatched.'
  },
  {
    id: 3,
    empCode: 'EMP-1055',
    name: 'Noah Centineo',
    dept: 'Engineering',
    role: 'Senior Backend Engineer',
    joiningDate: '2022-06-01',
    lwd: '2026-09-05',
    rel: 'Issued',
    exp: 'Issued',
    fnf: 'Issued',
    status: 'Completed',
    personalEmail: 'noah.centineo@outlook.com',
    issuedDate: '2026-09-06',
    notes: 'Relieving and Service letters delivered to personal email.'
  },
  {
    id: 4,
    empCode: 'EMP-1088',
    name: 'Lily Collins',
    dept: 'Marketing',
    role: 'Lead Brand Strategist',
    joiningDate: '2024-02-01',
    lwd: '2026-09-25',
    rel: 'Draft',
    exp: 'Draft',
    fnf: 'Pending',
    status: 'Pending',
    personalEmail: 'lily.collins@outlook.com',
    notes: 'Letters will be finalized upon Last Working Day completion.'
  }
];

export function Documentation() {
  const [docs, setDocs] = useState<ExitDocRecord[]>(INITIAL_DOCS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ExitDocRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredDocs = useMemo(() => {
    return docs.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [docs, searchTerm, statusFilter]);

  const handleIssueAll = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setDocs(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return {
        ...rec,
        rel: 'Issued',
        exp: 'Issued',
        fnf: 'Issued',
        status: 'Completed',
        issuedDate: today,
        notes: (rec.notes ? rec.notes + ' | ' : '') + `All exit certificates and letters issued on ${today}.`
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        rel: 'Issued',
        exp: 'Issued',
        fnf: 'Issued',
        status: 'Completed',
        issuedDate: today
      } : null);
    }
    showToast('All exit documents generated, signed, and issued!');
  };

  const handleToggleDoc = (docType: 'rel' | 'exp' | 'fnf') => {
    if (!selectedRecord) return;
    const current = selectedRecord[docType];
    const nextVal: 'Issued' | 'Draft' | 'Pending' = current === 'Issued' ? 'Draft' : 'Issued';
    const updated = {
      ...selectedRecord,
      [docType]: nextVal
    };
    const allIssued = updated.rel === 'Issued' && updated.exp === 'Issued' && updated.fnf === 'Issued';
    updated.status = allIssued ? 'Completed' : 'Pending';

    setSelectedRecord(updated);
    setDocs(prev => prev.map(d => d.id === updated.id ? updated : d));
    showToast(`${docType.toUpperCase()} status updated to ${nextVal}`);
  };

  const handleEmailPacket = (rec: ExitDocRecord) => {
    setActiveDropdown(null);
    showToast(`Complete signed exit packet emailed to ${rec.personalEmail}`);
  };

  const handleDownloadRelieving = (rec: ExitDocRecord) => {
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const content = `===============================================================
                   OFFICIAL RELIEVING LETTER
===============================================================
Date: ${todayStr}

To:
${rec.name}
Employee Code: ${rec.empCode}
Designation  : ${rec.role}
Department   : ${rec.dept}

Subject: RELIEVING LETTER UPON RESIGNATION

Dear ${rec.name},

With reference to your resignation letter, we would like to confirm that you 
have been relieved from your duties and responsibilities as ${rec.role} with 
our organization effective close of business hours on:

                     >>> ${rec.lwd} <<<

We confirm that you joined our organization on ${rec.joiningDate}. During your 
tenure, you have successfully completed your project handovers and returned all 
company assets in accordance with organizational offboarding policies.

You have no outstanding obligations or departmental dues with the company.

We thank you for your sincere contributions and services, and we wish you 
all success in your future personal and professional endeavors.

Sincerely,

Human Resources Directorate
Global Talent Management Office
HRMS Reference: HR-REL-${rec.empCode}
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relieving_Letter_${rec.empCode}_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Relieving Letter downloaded for ${rec.name}`);
    setActiveDropdown(null);
  };

  const handleDownloadExperience = (rec: ExitDocRecord) => {
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const content = `===============================================================
              EXPERIENCE & SERVICE CERTIFICATE
===============================================================
Date: ${todayStr}

TO WHOMSOEVER IT MAY CONCERN

This is to certify that ${rec.name} (Employee Code: ${rec.empCode}) was 
employed with our organization in the Department of ${rec.dept}.

Tenure Details:
• Date of Joining  : ${rec.joiningDate}
• Date of Relieving: ${rec.lwd}
• Last Designation : ${rec.role}

During their period of employment, ${rec.name} was found to be hardworking, 
diligent, and highly dedicated to their responsibilities. Their conduct and 
performance throughout the tenure were exemplary.

We extend our best wishes for their future career and pursuits.

For and on behalf of the Company,

Vice President - Human Capital Operations
Corporate Office
HRMS Reference: HR-EXP-${rec.empCode}
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Experience_Certificate_${rec.empCode}_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Experience Certificate downloaded for ${rec.name}`);
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
            <span>Exit Doc Packages</span>
            <FileText className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{docs.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Departing employees</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Packets Issued</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {docs.filter(i => i.status === 'Completed').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Signed & dispatched</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Drafts In Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {docs.filter(i => i.status === 'Pending').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Awaiting LWD completion</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Relieving Letters</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {docs.filter(i => i.rel === 'Issued').length} / {docs.length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Formal separation letters</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Exit Documentation</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Generate, sign, and issue Relieving Letters, Experience Certificates, and FnF statements</p>
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
                <th className="px-6 py-3.5">Relieving Letter</th>
                <th className="px-6 py-3.5">Experience Cert</th>
                <th className="px-6 py-3.5">FnF Statement</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No exit documentation records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.empCode} • {item.dept}</div>
                      <div className="text-[11px] text-rose-600">LWD: {item.lwd}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.rel === 'Issued' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Issued
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.exp === 'Issued' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Issued
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.fnf === 'Issued' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Issued
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          <Clock className="w-3 h-3 mr-1 text-slate-400"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Documents Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 border-rose-200 font-medium flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Documents
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
                                Documentation Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <FileText className="w-3.5 h-3.5 text-rose-600" />
                                Inspect Exit Documentation
                              </button>

                              <button
                                onClick={() => handleIssueAll(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Issue All Documents (One-click)
                              </button>

                              <button
                                onClick={() => handleEmailPacket(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Mail className="w-3.5 h-3.5 text-blue-600" />
                                Email Packet to Personal Email
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadRelieving(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Relieving Letter (.txt)
                              </button>

                              <button
                                onClick={() => handleDownloadExperience(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Award className="w-3.5 h-3.5 text-purple-600" />
                                Download Experience Cert (.txt)
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
          <div>Showing {filteredDocs.length} of {docs.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredDocs.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Exit Document Packet Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-semibold">Exit Documentation & Certificate Generation</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.name} ({selectedRecord.empCode}) • {selectedRecord.role} • LWD: {selectedRecord.lwd}
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
              {/* Document Overview Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Joining Date:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.joiningDate}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Last Working Day:</span>
                  <div className="font-semibold text-rose-600 mt-0.5">{selectedRecord.lwd}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Personal Email:</span>
                  <div className="font-mono text-slate-700 truncate mt-0.5">{selectedRecord.personalEmail}</div>
                </div>
              </div>

              {/* Individual Document Cards */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Exit Certificate Suite
                </div>

                {/* Relieving Letter */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      1. Official Relieving Letter
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Formal discharge of employment duties and confirmation of last working date.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadRelieving(selectedRecord)}
                      className="h-7 text-xs text-slate-600"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <button
                      onClick={() => handleToggleDoc('rel')}
                      className={`px-2 py-1 text-xs rounded font-medium border transition-colors ${
                        selectedRecord.rel === 'Issued' 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {selectedRecord.rel}
                    </button>
                  </div>
                </div>

                {/* Experience Certificate */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-purple-600" />
                      2. Experience & Service Certificate
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Verification of job tenure, conduct, and designation for future employers.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadExperience(selectedRecord)}
                      className="h-7 text-xs text-slate-600"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <button
                      onClick={() => handleToggleDoc('exp')}
                      className={`px-2 py-1 text-xs rounded font-medium border transition-colors ${
                        selectedRecord.exp === 'Issued' 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {selectedRecord.exp}
                    </button>
                  </div>
                </div>

                {/* FnF Statement */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      3. Full & Final Settlement Statement
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Certified statement confirming zero pending financial or legal dues.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleDoc('fnf')}
                      className={`px-2 py-1 text-xs rounded font-medium border transition-colors ${
                        selectedRecord.fnf === 'Issued' 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {selectedRecord.fnf}
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedRecord.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Documentation Log:</span> {selectedRecord.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEmailPacket(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                Email Packet
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
                  onClick={() => handleIssueAll(selectedRecord.id)}
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Issue All Documents
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
