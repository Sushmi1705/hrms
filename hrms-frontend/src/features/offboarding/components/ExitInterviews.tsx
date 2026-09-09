import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, HelpCircle, Calendar, Download, Check, 
  Send, Star, ThumbsUp, X, MessageSquare, UserCheck
} from 'lucide-react';

export interface ExitInterviewRecord {
  id: number;
  empCode: string;
  name: string;
  dept: string;
  role: string;
  interviewer: string;
  date: string;
  score: string; // e.g. '8.5/10' or 'N/A'
  status: 'Completed' | 'Scheduled' | 'Pending';
  primaryReason: string;
  managerRating: number; // out of 5
  cultureRating: number; // out of 5
  compensationRating: number; // out of 5
  wouldRecommend: boolean;
  positiveFeedback: string;
  improvementFeedback: string;
}

const INITIAL_INTERVIEWS: ExitInterviewRecord[] = [
  {
    id: 1,
    empCode: 'EMP-1042',
    name: 'Alex Turner',
    dept: 'Sales',
    role: 'Senior Enterprise AE',
    interviewer: 'Alice Cooper (Lead HRBP)',
    date: '2026-09-10',
    score: 'Pending',
    status: 'Scheduled',
    primaryReason: 'Higher Education / Graduate School',
    managerRating: 5,
    cultureRating: 4,
    compensationRating: 4,
    wouldRecommend: true,
    positiveFeedback: 'Exceptional sales leadership and team culture. Strong commission structure and transparent executive communications.',
    improvementFeedback: 'Sales enablement tooling could be upgraded to streamline quote-to-cash approvals.'
  },
  {
    id: 2,
    empCode: 'EMP-1033',
    name: 'Scarlett Johansson',
    dept: 'Product Operations',
    role: 'Staff Operations Manager',
    interviewer: 'Robert Sterling (HR Director)',
    date: '2026-08-20',
    score: '8.5 / 10',
    status: 'Completed',
    primaryReason: 'Career Pivot / Entrepreneurship',
    managerRating: 5,
    cultureRating: 5,
    compensationRating: 4,
    wouldRecommend: true,
    positiveFeedback: 'Great autonomy, brilliant colleagues, and top-tier healthcare benefits. Felt respected throughout tenure.',
    improvementFeedback: 'Cross-functional alignment between Product and Customer Success could have fewer synchronous meetings.'
  },
  {
    id: 3,
    empCode: 'EMP-1102',
    name: 'Julian Casablancas',
    dept: 'Engineering',
    role: 'Staff DevOps Engineer',
    interviewer: 'Alice Cooper (Lead HRBP)',
    date: '2026-10-15',
    score: 'Pending',
    status: 'Pending',
    primaryReason: 'Compensation & Growth Opportunity',
    managerRating: 4,
    cultureRating: 4,
    compensationRating: 3,
    wouldRecommend: true,
    positiveFeedback: 'Technically gifted colleagues and modern cloud stack.',
    improvementFeedback: 'Engineering salary bands in tier-1 tech markets need annual recalibration to avoid attrition.'
  },
  {
    id: 4,
    empCode: 'EMP-1145',
    name: 'Maya Lin',
    dept: 'Product Design',
    role: 'UX Researcher',
    interviewer: 'Robert Sterling (HR Director)',
    date: '2026-09-08',
    score: '9.0 / 10',
    status: 'Completed',
    primaryReason: 'Personal / Interstate Relocation',
    managerRating: 5,
    cultureRating: 5,
    compensationRating: 4,
    wouldRecommend: true,
    positiveFeedback: 'Empathetic leadership, generous equipment allowance, and strong emphasis on design research rigor.',
    improvementFeedback: 'More cross-office travel summits for remote and hybrid teams.'
  }
];

export function ExitInterviews() {
  const [interviews, setInterviews] = useState<ExitInterviewRecord[]>(INITIAL_INTERVIEWS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Scheduled' | 'Pending'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ExitInterviewRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredInterviews = useMemo(() => {
    return interviews.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.interviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [interviews, searchTerm, statusFilter]);

  const handleCompleteInterview = (id: number) => {
    setInterviews(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return {
        ...rec,
        score: '8.8 / 10',
        status: 'Completed'
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        score: '8.8 / 10',
        status: 'Completed'
      } : null);
    }
    showToast('Exit interview marked completed and feedback logged!');
  };

  const handleDownloadTranscript = (rec: ExitInterviewRecord) => {
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const content = `===============================================================
              CONFIDENTIAL EXIT INTERVIEW TRANSCRIPT
===============================================================
Session Date    : ${rec.date}
Transcribed Date: ${todayStr}
Employee Name   : ${rec.name}
Employee Code   : ${rec.empCode}
Department      : ${rec.dept}
Role / Title    : ${rec.role}
HR Interviewer  : ${rec.interviewer}
Session Status  : ${rec.status.toUpperCase()}
Overall Score   : ${rec.score}
---------------------------------------------------------------
1. PRIMARY DEPARTURE REASON
---------------------------------------------------------------
${rec.primaryReason}

---------------------------------------------------------------
2. QUANTITATIVE BENCHMARK SCORES (1 - 5)
---------------------------------------------------------------
• Direct Manager Support & Leadership : ${rec.managerRating} / 5
• Team Culture & Peer Dynamics        : ${rec.cultureRating} / 5
• Compensation, Equity & Benefits     : ${rec.compensationRating} / 5
• Would Recommend Company as Employer : ${rec.wouldRecommend ? 'YES' : 'NO'}

---------------------------------------------------------------
3. QUALITATIVE EMPLOYEE PERSPECTIVE
---------------------------------------------------------------
Positive Reflections:
"${rec.positiveFeedback}"

Areas for Organizational Improvement:
"${rec.improvementFeedback}"

===============================================================
HRBP Governance Note:
"Exit interview feedback is cataloged anonymously into the Quarterly 
HR Attrition & Retention Intelligence Dashboard for executive review."

HR Interviewer Signature: __________________   Date: ___________
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Exit_Interview_${rec.empCode}_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exit Interview Transcript downloaded for ${rec.name}`);
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
            <span>Interviews Slated</span>
            <HelpCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{interviews.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Departing employee sessions</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {interviews.filter(i => i.status === 'Completed').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Feedback archived</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Scheduled</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {interviews.filter(i => i.status === 'Scheduled').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">In HR calendar</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Satisfaction</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">8.8 / 10</div>
          <div className="text-xs text-slate-500 mt-0.5">Positive sentiment</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Exit Interviews</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Schedule, conduct, and analyze confidential exit interview feedback</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search employee, interviewer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Completed', 'Scheduled', 'Pending'] as const).map(f => (
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
                <th className="px-6 py-3.5">Interviewer</th>
                <th className="px-6 py-3.5">Scheduled Date</th>
                <th className="px-6 py-3.5">Feedback Score</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInterviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No exit interview records match your filter.
                  </td>
                </tr>
              ) : (
                filteredInterviews.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.empCode} • {item.dept}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                        {item.interviewer}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        {item.date}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.score !== 'Pending' ? (
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="font-semibold text-slate-800">{item.score}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Awaiting Session</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Completed
                        </span>
                      ) : item.status === 'Scheduled' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <Calendar className="w-3 h-3 mr-1 text-blue-600"/> Scheduled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Interview Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 border-rose-200 font-medium flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Interview
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
                                Interview Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                                Review / Record Interview
                              </button>

                              <button
                                onClick={() => handleCompleteInterview(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Mark Interview Completed
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadTranscript(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Transcript (.txt)
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
          <div>Showing {filteredInterviews.length} of {interviews.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredInterviews.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Exit Interview Record & Review Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-semibold">Exit Interview Evaluation & Feedback</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.name} ({selectedRecord.empCode}) • {selectedRecord.role} • Interviewer: {selectedRecord.interviewer}
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
              {/* Ratings Summary Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Session Date:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.date}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Manager Rating:</span>
                  <div className="font-semibold text-amber-600 flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {selectedRecord.managerRating} / 5
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Culture Rating:</span>
                  <div className="font-semibold text-amber-600 flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {selectedRecord.cultureRating} / 5
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Would Recommend:</span>
                  <div className="font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedRecord.wouldRecommend ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              {/* Primary Reason for Leaving */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <div className="text-xs font-semibold text-slate-700 mb-1">
                  Primary Motivating Factor for Separation
                </div>
                <div className="text-xs font-semibold text-rose-700 bg-white p-2.5 rounded border border-slate-200">
                  {selectedRecord.primaryReason}
                </div>
              </div>

              {/* Qualitative Observations */}
              <div className="space-y-3">
                <div className="bg-emerald-50/40 border border-emerald-200/60 rounded-lg p-3.5">
                  <div className="text-xs font-semibold text-emerald-900 mb-1">
                    Positive Reflections & Organization Strengths
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded border border-emerald-100">
                    "{selectedRecord.positiveFeedback}"
                  </p>
                </div>

                <div className="bg-amber-50/40 border border-amber-200/60 rounded-lg p-3.5">
                  <div className="text-xs font-semibold text-amber-900 mb-1">
                    Suggestions for Retention & Organizational Growth
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded border border-amber-100">
                    "{selectedRecord.improvementFeedback}"
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadTranscript(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Transcript (.txt)
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
                  onClick={() => handleCompleteInterview(selectedRecord.id)}
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Completed
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
