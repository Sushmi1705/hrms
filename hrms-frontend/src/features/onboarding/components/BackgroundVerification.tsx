import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Eye, Download, ShieldCheck, Check, X, 
  ExternalLink, Building2, User
} from 'lucide-react';

export interface BGVRecord {
  id: number;
  empCode: string;
  name: string;
  role: string;
  agency: string;
  caseNumber: string;
  criminalCheck: 'Clear' | 'Pending' | 'Flagged';
  employmentCheck: 'Clear' | 'Pending' | 'Flagged';
  educationCheck: 'Clear' | 'Pending' | 'Flagged';
  drugTest: 'Clear' | 'Pending' | 'Flagged';
  status: 'Completed' | 'In Progress' | 'Action Needed';
  initiatedDate: string;
  completedDate?: string;
  agencyNotes?: string;
}

const INITIAL_BGV: BGVRecord[] = [
  {
    id: 1,
    empCode: 'EMP-2026-901',
    name: 'Sarah Jenkins',
    role: 'Senior Developer',
    agency: 'FirstAdvantage',
    caseNumber: 'FA-881290',
    criminalCheck: 'Clear',
    employmentCheck: 'Pending',
    educationCheck: 'Clear',
    drugTest: 'Clear',
    status: 'In Progress',
    initiatedDate: '24 Aug 2026',
    agencyNotes: 'Previous employer (Stripe) HR verification contact pending response. Re-pinged today.'
  },
  {
    id: 2,
    empCode: 'EMP-2026-902',
    name: 'Tom Hanks',
    role: 'Product Operations',
    agency: 'Checkr',
    caseNumber: 'CHK-449102',
    criminalCheck: 'Clear',
    employmentCheck: 'Clear',
    educationCheck: 'Clear',
    drugTest: 'Clear',
    status: 'Completed',
    initiatedDate: '15 Aug 2026',
    completedDate: '22 Aug 2026',
    agencyNotes: 'All criminal, employment tenure, and academic degree checks passed without discrepancies.'
  },
  {
    id: 3,
    empCode: 'EMP-2026-903',
    name: 'Elena Rodriguez',
    role: 'Staff Data Scientist',
    agency: 'Checkr',
    caseNumber: 'CHK-449103',
    criminalCheck: 'Clear',
    employmentCheck: 'Pending',
    educationCheck: 'Clear',
    drugTest: 'Clear',
    status: 'In Progress',
    initiatedDate: '01 Sep 2026'
  }
];

export function BackgroundVerification() {
  const [records, setRecords] = useState<BGVRecord[]>(INITIAL_BGV);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Menu
  const [selectedRecord, setSelectedRecord] = useState<BGVRecord | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Filtered records
  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchSearch = 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [records, searchTerm, statusFilter]);

  // Mark all clear
  const handleMarkAllClear = (id: number) => {
    setRecords(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          criminalCheck: 'Clear',
          employmentCheck: 'Clear',
          educationCheck: 'Clear',
          drugTest: 'Clear',
          status: 'Completed',
          completedDate: 'Today',
          agencyNotes: 'Manually verified and cleared by HR Admin.'
        };
      }
      return r;
    }));

    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        criminalCheck: 'Clear',
        employmentCheck: 'Clear',
        educationCheck: 'Clear',
        drugTest: 'Clear',
        status: 'Completed',
        completedDate: 'Today',
        agencyNotes: 'Manually verified and cleared by HR Admin.'
      } : null);
    }

    setActiveMenuId(null);
    showToast('Background Check Cleared', 'All background checks marked as Clear and Completed.');
  };

  const handleDownloadReport = (r: BGVRecord) => {
    const reportText = `
================================================================================
               THIRD-PARTY BACKGROUND SCREENING VERIFICATION REPORT
================================================================================
Case Reference      : ${r.caseNumber}
Screening Agency    : ${r.agency}
Candidate Name      : ${r.name}
Target Position     : ${r.role}
Initiated Date      : ${r.initiatedDate}
Completed Date      : ${r.completedDate || 'In Progress'}
Final Disposition   : ${r.status.toUpperCase()}

--------------------------------------------------------------------------------
VERIFICATION RESULTS
--------------------------------------------------------------------------------
• County, State & Federal Criminal Search : [${r.criminalCheck.toUpperCase()}]
• 7-Year Employment History & Title Verification : [${r.employmentCheck.toUpperCase()}]
• University Degree Authenticity Check   : [${r.educationCheck.toUpperCase()}]
• 10-Panel Substance Screening           : [${r.drugTest.toUpperCase()}]

Screening Notes:
${r.agencyNotes || 'Standard verification protocols executed.'}
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BGV_Report_${r.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setActiveMenuId(null);
    showToast('Report Downloaded', `BGV report downloaded for ${r.name}`);
  };

  return (
    <div className="space-y-6 mt-6 relative pb-10">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{toastMessage.title}</p>
            <p className="text-xs text-emerald-100">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Background Checks (BGV)
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Third-Party Screening
              </span>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">Monitor Checkr, FirstAdvantage, and Sterling criminal and employment checks.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search by candidate or case #..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 h-9 border-slate-200 text-xs bg-slate-50 focus-visible:ring-indigo-500" 
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2.5 h-9 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Candidate</th>
                  <th className="px-6 py-3.5">Agency & Case #</th>
                  <th className="px-6 py-3.5">Criminal Check</th>
                  <th className="px-6 py-3.5">Employment Check</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                          {r.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-xs">{r.name}</p>
                          <p className="text-[11px] text-slate-400">{r.role}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className="font-semibold text-slate-800 block">{r.agency}</span>
                      <span className="text-[11px] font-mono text-slate-400">{r.caseNumber}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        r.criminalCheck === 'Clear' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {r.criminalCheck}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        r.employmentCheck === 'Clear' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {r.employmentCheck}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        r.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => setSelectedRecord(r)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Report</span>
                        </Button>

                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setActiveMenuId(activeMenuId === r.id ? null : r.id)}
                            className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 rounded-md"
                          >
                            <MoreHorizontal className="w-4 h-4 text-slate-600"/>
                          </Button>

                          {activeMenuId === r.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1.5 animate-in fade-in zoom-in-95 text-xs text-left">
                              <button
                                onClick={() => {
                                  setSelectedRecord(r);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                              >
                                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Inspect Full Report</span>
                              </button>

                              <button
                                onClick={() => handleDownloadReport(r)}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                <span>Download Report</span>
                              </button>

                              {r.status !== 'Completed' && (
                                <button
                                  onClick={() => handleMarkAllClear(r.id)}
                                  className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-medium border-t border-slate-100"
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Mark All Cleared</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL: BGV Case Dossier */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{selectedRecord.name} - BGV Report</h3>
                  <p className="text-xs text-slate-400">{selectedRecord.agency} • Case {selectedRecord.caseNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Screening Agency</span>
                  <span className="font-bold text-slate-800">{selectedRecord.agency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Initiated Date</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.initiatedDate}</span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'County & Federal Criminal History', val: selectedRecord.criminalCheck },
                  { label: 'Employment History & Past Title', val: selectedRecord.employmentCheck },
                  { label: 'Academic Degree Authenticity', val: selectedRecord.educationCheck },
                  { label: 'Standard 10-Panel Substance Test', val: selectedRecord.drugTest }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{item.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Verified against authoritative registry</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      item.val === 'Clear' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>

              {selectedRecord.agencyNotes && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-700 block mb-0.5">Agency Log:</span>
                  <p className="text-slate-600 leading-relaxed">{selectedRecord.agencyNotes}</p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport(selectedRecord)}
                className="text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Download Report
              </Button>

              <div className="flex gap-2">
                {selectedRecord.status !== 'Completed' && (
                  <Button
                    onClick={() => handleMarkAllClear(selectedRecord.id)}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    Mark All Cleared
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                  className="text-xs"
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
