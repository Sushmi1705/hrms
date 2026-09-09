import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Award, Calendar, Download, Check, 
  Send, UserCheck, Star, ShieldAlert, X, ChevronRight
} from 'lucide-react';

export interface ProbationRecord {
  id: number;
  empCode: string;
  name: string;
  role: string;
  dept: string;
  joiningDate: string;
  probationDurationMonths: number;
  reviewDueDate: string;
  t30: 'Completed' | 'Scheduled' | 'Pending';
  t60: 'Completed' | 'Scheduled' | 'Pending';
  t90: 'Completed' | 'Scheduled' | 'Pending';
  rating: number; // Out of 5
  manager: string;
  managerRecommendation: 'Confirm' | 'Extend' | 'Pending Review';
  status: 'Approved' | 'In Progress' | 'Under Review' | 'Extended';
  confirmedDate?: string;
  performanceSummary: string;
  feedbackNotes?: string;
}

const INITIAL_PROBATION: ProbationRecord[] = [
  {
    id: 1,
    empCode: 'EMP-2026-901',
    name: 'Chris Evans',
    role: 'Staff Platform Engineer',
    dept: 'Engineering',
    joiningDate: '01 Jun 2026',
    probationDurationMonths: 3,
    reviewDueDate: '01 Sep 2026',
    t30: 'Completed',
    t60: 'Completed',
    t90: 'Pending',
    rating: 4.6,
    manager: 'Michael Chen (VP Eng)',
    managerRecommendation: 'Pending Review',
    status: 'In Progress',
    performanceSummary: 'Exceptional ownership on the multi-region Kubernetes migration. Delivered first critical RFC in week 6.',
    feedbackNotes: '90-day final review panel scheduled with engineering leadership next Tuesday.'
  },
  {
    id: 2,
    empCode: 'EMP-2026-902',
    name: 'Mark Ruffalo',
    role: 'Senior QA Automation Lead',
    dept: 'Quality Assurance',
    joiningDate: '01 Apr 2026',
    probationDurationMonths: 3,
    reviewDueDate: '01 Jul 2026',
    t30: 'Completed',
    t60: 'Completed',
    t90: 'Completed',
    rating: 4.9,
    manager: 'Chloe Bennett (Director of QA)',
    managerRecommendation: 'Confirm',
    status: 'Approved',
    confirmedDate: '05 Jul 2026',
    performanceSummary: 'Automated end-to-end regression test suite, slashing release cycle from 4 days to 3 hours.',
    feedbackNotes: 'Unanimous positive endorsement from both engineering squads. Employment fully confirmed.'
  },
  {
    id: 3,
    empCode: 'EMP-2026-903',
    name: 'Sarah Jenkins',
    role: 'Senior Developer',
    dept: 'Engineering',
    joiningDate: '01 Aug 2026',
    probationDurationMonths: 3,
    reviewDueDate: '01 Nov 2026',
    t30: 'Scheduled',
    t60: 'Pending',
    t90: 'Pending',
    rating: 4.2,
    manager: 'Michael Chen (VP Eng)',
    managerRecommendation: 'Pending Review',
    status: 'In Progress',
    performanceSummary: 'Completed initial repository onboarding and resolved first 4 sprint tickets successfully.',
    feedbackNotes: '30-day sync scheduled for upcoming Friday.'
  },
  {
    id: 4,
    empCode: 'EMP-2026-904',
    name: 'David Lee',
    role: 'Enterprise Account Executive',
    dept: 'Sales & BD',
    joiningDate: '15 May 2026',
    probationDurationMonths: 3,
    reviewDueDate: '15 Sep 2026',
    t30: 'Completed',
    t60: 'Completed',
    t90: 'Pending',
    rating: 3.8,
    manager: 'Marcus Vance (VP Sales)',
    managerRecommendation: 'Extend',
    status: 'Extended',
    performanceSummary: 'Strong pipeline generation, but enterprise contract closing cycle is 90 days. Extended by 30 days to evaluate quota conversion.',
    feedbackNotes: 'Probation extended by 30 days with mutual agreement to allow pipeline deals to mature.'
  }
];

export function Probation() {
  const [probations, setProbations] = useState<ProbationRecord[]>(INITIAL_PROBATION);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'In Progress' | 'Under Review' | 'Extended'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ProbationRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredProbations = useMemo(() => {
    return probations.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.manager.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [probations, searchTerm, statusFilter]);

  const handleConfirmEmployment = (id: number) => {
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    setProbations(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return {
        ...rec,
        t30: 'Completed',
        t60: 'Completed',
        t90: 'Completed',
        status: 'Approved',
        managerRecommendation: 'Confirm',
        confirmedDate: todayStr,
        feedbackNotes: (rec.feedbackNotes ? rec.feedbackNotes + ' | ' : '') + `Employment confirmed on ${todayStr}.`
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        t30: 'Completed',
        t60: 'Completed',
        t90: 'Completed',
        status: 'Approved',
        managerRecommendation: 'Confirm',
        confirmedDate: todayStr
      } : null);
    }
    showToast('Employment confirmed! Confirmation letter is ready for export.');
  };

  const handleExtendProbation = (id: number) => {
    setProbations(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return {
        ...rec,
        status: 'Extended',
        managerRecommendation: 'Extend',
        reviewDueDate: 'Extended (+30 Days)',
        feedbackNotes: (rec.feedbackNotes ? rec.feedbackNotes + ' | ' : '') + 'Probation extended by 30 days.'
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        status: 'Extended',
        managerRecommendation: 'Extend',
        reviewDueDate: 'Extended (+30 Days)'
      } : null);
    }
    showToast('Probation period extended by 30 days. Manager notified.');
  };

  const handleUpdateMilestone = (milestone: 't30' | 't60' | 't90', newStatus: 'Completed' | 'Scheduled' | 'Pending') => {
    if (!selectedRecord) return;
    const updated = {
      ...selectedRecord,
      [milestone]: newStatus
    };
    setSelectedRecord(updated);
    setProbations(prev => prev.map(r => r.id === updated.id ? updated : r));
    showToast(`Milestone ${milestone.toUpperCase()} check-in updated to ${newStatus}`);
  };

  const handleDownloadConfirmationLetter = (rec: ProbationRecord) => {
    const issueDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const content = `===============================================================
               OFFICIAL EMPLOYMENT CONFIRMATION LETTER
===============================================================
Date: ${issueDate}

TO:
${rec.name}
Employee ID : ${rec.empCode}
Designation : ${rec.role}
Department  : ${rec.dept}

SUBJECT: CONFIRMATION OF SERVICES / SUCCESSFUL PROBATION COMPLETION

Dear ${rec.name},

Following the review of your work performance, conduct, and contribution 
during your probationary period since your joining date (${rec.joiningDate}), 
we are delighted to inform you that your services with the Company are hereby 
CONFIRMED as of ${rec.confirmedDate || issueDate}.

KEY PERFORMANCE HIGHLIGHTS:
- Final Appraisal Rating : ${rec.rating} / 5.0
- Manager Recommendation : ${rec.managerRecommendation} (${rec.manager})
- 30-Day Check-in        : ${rec.t30}
- 60-Day Midpoint Review : ${rec.t60}
- 90-Day Final Review    : ${rec.t90}

SUMMARY EVALUATION:
"${rec.performanceSummary}"

All other terms and conditions of your employment contract, including benefits, 
statutory entitlements, and confidentiality agreements, remain in full force.

We take this opportunity to congratulate you and look forward to your continued 
dedication, growth, and achievements with our organization.

Yours sincerely,

Human Resources Directorate
Global Talent Management Office
HRMS Portal Ref: HRMS-CONF-${rec.empCode}
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Confirmation_Letter_${rec.empCode}_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Employment Confirmation Letter downloaded for ${rec.name}`);
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
            <span>Active Probation</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{probations.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Under evaluation</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Confirmed / Passed</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {probations.filter(i => i.status === 'Approved').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Permanent staff confirmed</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {probations.filter(i => i.status === 'In Progress').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Ongoing reviews</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Extended Review</span>
            <ShieldAlert className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {probations.filter(i => i.status === 'Extended').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Extended +30 days</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Probation Tracking & Confirmation</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Monitor 30-60-90 day check-ins, performance scorecards, and confirmations</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search employee, manager..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Approved', 'In Progress', 'Extended'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === f 
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold' 
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
                <th className="px-6 py-3.5">Joining Date</th>
                <th className="px-6 py-3.5">30-Day Check-in</th>
                <th className="px-6 py-3.5">90-Day Review</th>
                <th className="px-6 py-3.5">Probation Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProbations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No probation records match your filters.
                  </td>
                </tr>
              ) : (
                filteredProbations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.empCode} • {item.dept}</div>
                      <div className="text-[11px] text-slate-400">Mgr: {item.manager}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{item.joiningDate}</div>
                      <div className="text-xs text-slate-500">Due: {item.reviewDueDate}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.t30 === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Completed
                        </span>
                      ) : item.t30 === 'Scheduled' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Calendar className="w-3 h-3 mr-1 text-blue-600"/> Scheduled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.t90 === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Completed
                        </span>
                      ) : item.t90 === 'Scheduled' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Calendar className="w-3 h-3 mr-1 text-blue-600"/> Scheduled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Approved' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Award className="w-3 h-3 mr-1 text-emerald-600"/> Confirmed
                        </span>
                      ) : item.status === 'Extended' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                          <Clock className="w-3 h-3 mr-1 text-purple-600"/> Extended
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> {item.status}
                        </span>
                      )}
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{item.rating} / 5.0</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Review Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/80 border-indigo-200 font-medium flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
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
                                Probation Management
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Award className="w-3.5 h-3.5 text-indigo-600" />
                                Inspect Scorecard & Check-ins
                              </button>

                              <button
                                onClick={() => handleConfirmEmployment(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Confirm Permanent Employment
                              </button>

                              <button
                                onClick={() => handleExtendProbation(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2.5 font-medium"
                              >
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                Extend Probation (+30 Days)
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadConfirmationLetter(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Export Confirmation Letter (.txt)
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
          <div>Showing {filteredProbations.length} of {probations.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredProbations.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Probation Milestone & Performance Scorecard Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-semibold">Probation Appraisal & Confirmation Dossier</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    selectedRecord.status === 'Extended' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status === 'Approved' ? 'Confirmed' : selectedRecord.status}
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
              {/* Appraisal Overview Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Joining Date:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.joiningDate}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Evaluation Milestone Due:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.reviewDueDate}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Hiring Manager:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.manager}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Appraisal Rating:</span>
                  <div className="font-semibold text-amber-600 flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {selectedRecord.rating} / 5.0 (Exceeds Expectations)
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Manager Recommendation:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.managerRecommendation}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Confirmation Date:</span>
                  <div className="font-semibold text-emerald-600 mt-0.5">{selectedRecord.confirmedDate || 'Pending Final Approval'}</div>
                </div>
              </div>

              {/* 30-60-90 Day Milestones */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Check-in Milestones
                </div>

                {/* 30-Day Check-in */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">30-Day Check-in (First Month Integration)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Focus: Role clarity, tool setup, initial deliverables</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['Pending', 'Scheduled', 'Completed'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateMilestone('t30', st)}
                        className={`px-2 py-1 text-xs rounded font-medium border transition-colors ${
                          selectedRecord.t30 === st 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 60-Day Check-in */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">60-Day Midpoint Review</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Focus: Sprint velocity, peer collaboration, blockers</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['Pending', 'Scheduled', 'Completed'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateMilestone('t60', st)}
                        className={`px-2 py-1 text-xs rounded font-medium border transition-colors ${
                          selectedRecord.t60 === st 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 90-Day Final Review */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">90-Day Formal Confirmation Review</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Focus: Full competency assessment & permanent employment decision</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['Pending', 'Scheduled', 'Completed'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateMilestone('t90', st)}
                        className={`px-2 py-1 text-xs rounded font-medium border transition-colors ${
                          selectedRecord.t90 === st 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <div className="text-xs font-semibold text-slate-700 mb-1">
                  Manager Performance Appraisal & Justification
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded border border-slate-200">
                  {selectedRecord.performanceSummary}
                </p>
              </div>

              {/* Notes */}
              {selectedRecord.feedbackNotes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">HR Committee Record:</span> {selectedRecord.feedbackNotes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadConfirmationLetter(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Confirmation Letter (.txt)
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExtendProbation(selectedRecord.id)}
                  className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
                >
                  Extend +30 Days
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleConfirmEmployment(selectedRecord.id)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirm Employment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
