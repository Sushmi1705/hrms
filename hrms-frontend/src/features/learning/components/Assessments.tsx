import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, HelpCircle, Award, Download, Check, 
  Send, Eye, FileQuestion, X, ListChecks
} from 'lucide-react';

export interface AssessmentRecord {
  id: number;
  code: string;
  title: string;
  course: string;
  passScore: string; // e.g. '80%'
  avgScore: string; // e.g. '86%'
  status: 'Active' | 'Draft' | 'Archived';
  questionsCount: number;
  timeLimit: string;
  sampleQuestions: string[];
}

const INITIAL_ASSESSMENTS: AssessmentRecord[] = [
  {
    id: 1,
    code: 'TEST-REACT-01',
    title: 'Advanced React 19 Patterns Certification Exam',
    course: 'Advanced React Patterns & Performance',
    passScore: '80%',
    avgScore: '87%',
    status: 'Active',
    questionsCount: 25,
    timeLimit: '45 mins',
    sampleQuestions: [
      '1. How does the React 19 compiler handle automatic memoization of component props?',
      '2. What are the key performance trade-offs between useDeferredValue and startTransition?',
      '3. Describe the lifecycle and re-render behavior of Server Actions in Next.js.',
      '4. How do you profile and eliminate memory leaks caused by lingering event listeners in custom hooks?'
    ]
  },
  {
    id: 2,
    code: 'TEST-SEC-01',
    title: 'SOC2 & HIPAA Annual Information Security Exam',
    course: 'Information Security & Privacy Compliance 2026',
    passScore: '100%',
    avgScore: '100%',
    status: 'Active',
    questionsCount: 15,
    timeLimit: '30 mins',
    sampleQuestions: [
      '1. What constitutes a phishing attempt, and what is the immediate protocol upon clicking an unknown link?',
      '2. Under GDPR, what is the statutory deadline for reporting a substantiated personal data breach?',
      '3. Which password complexity and hardware MFA standards are enforced for bastion host access?'
    ]
  },
  {
    id: 3,
    code: 'TEST-LEAD-01',
    title: 'Manager 1-on-1 & Feedback Delivery Simulation',
    course: 'Leadership 101: Engineering Managers',
    passScore: '75%',
    avgScore: '81%',
    status: 'Active',
    questionsCount: 12,
    timeLimit: '40 mins',
    sampleQuestions: [
      '1. Contrast Radical Candor with Ruinous Empathy through a practical performance coaching scenario.',
      '2. What frameworks should be applied when addressing persistent underperformance during probation?'
    ]
  },
  {
    id: 4,
    code: 'TEST-DEV-02',
    title: 'Kubernetes Cluster Resiliency & Pod Tuning Test',
    course: 'Kubernetes Multi-Cluster Orchestration',
    passScore: '85%',
    avgScore: '78%',
    status: 'Draft',
    questionsCount: 20,
    timeLimit: '60 mins',
    sampleQuestions: [
      '1. Explain the mechanism of PodDisruptionBudgets during node drain operations.',
      '2. How do you configure Horizontal Pod Autoscaling based on custom Prometheus metrics?'
    ]
  }
];

export function Assessments() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(INITIAL_ASSESSMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Draft'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredAssessments = useMemo(() => {
    return assessments.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assessments, searchTerm, statusFilter]);

  const handleToggleStatus = (id: number) => {
    setAssessments(prev => prev.map(a => {
      if (a.id !== id) return a;
      const nextStatus: 'Active' | 'Draft' = a.status === 'Active' ? 'Draft' : 'Active';
      return { ...a, status: nextStatus };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        status: prev.status === 'Active' ? 'Draft' : 'Active'
      } : null);
    }
    showToast('Assessment status updated!');
  };

  const handleDownloadRubric = (rec: AssessmentRecord) => {
    const content = `===============================================================
               ASSESSMENT & QUESTION BANK RUBRIC
===============================================================
Exam Code     : ${rec.code}
Title         : ${rec.title}
Course        : ${rec.course}
Pass Score    : ${rec.passScore} Minimum Passing
Average Score : ${rec.avgScore} Class Performance
Questions     : ${rec.questionsCount} Multiple Choice & Scenarios
Time Limit    : ${rec.timeLimit}
Status        : ${rec.status.toUpperCase()}
Date Exported : ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
---------------------------------------------------------------
SAMPLE QUESTION POOL & EVALUATION CRITERIA
---------------------------------------------------------------
${rec.sampleQuestions.join('\n\n')}

===============================================================
L&D Examination Board
Ref: EXAM-RUBRIC-${rec.code}
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Exam_Rubric_${rec.code}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exam rubric exported for ${rec.title}`);
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
            <span>Assessments</span>
            <FileQuestion className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{assessments.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Evaluation question banks</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Active Exams</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {assessments.filter(i => i.status === 'Active').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Enabled for learners</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Passing Benchmark</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">85%</div>
          <div className="text-xs text-slate-500 mt-0.5">Pass standard</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Class Performance</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">86.5%</div>
          <div className="text-xs text-slate-500 mt-0.5">Historical average</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Assessments & Exams</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Manage course knowledge checks, certification exams, and grading rubrics</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search assessments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Active', 'Draft'] as const).map(f => (
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
                <th className="px-6 py-3.5">Assessment Title</th>
                <th className="px-6 py-3.5">Course</th>
                <th className="px-6 py-3.5">Passing Score</th>
                <th className="px-6 py-3.5">Avg Score</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No assessments match your search.
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.code} • {item.questionsCount} Questions ({item.timeLimit})</div>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-xs font-medium text-slate-800 truncate" title={item.course}>
                        {item.course}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-rose-600">{item.passScore}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-emerald-600">{item.avgScore}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Active' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Inspect Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 border-rose-200 font-medium flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect
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
                                Assessment Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Eye className="w-3.5 h-3.5 text-rose-600" />
                                Inspect Question Bank
                              </button>

                              <button
                                onClick={() => handleToggleStatus(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {item.status === 'Active' ? 'Move to Draft' : 'Activate Exam'}
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadRubric(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Rubric (.txt)
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
          <div>Showing {filteredAssessments.length} of {assessments.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredAssessments.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Assessment Question Bank Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FileQuestion className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-semibold">{selectedRecord.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.code} • Course: {selectedRecord.course}
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
              {/* Grading Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Passing Criteria:</span>
                  <div className="font-bold text-rose-600 text-sm mt-0.5">{selectedRecord.passScore} Minimum</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Historical Average:</span>
                  <div className="font-bold text-emerald-600 text-sm mt-0.5">{selectedRecord.avgScore} Passed</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Time Allowance:</span>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedRecord.timeLimit}</div>
                </div>
              </div>

              {/* Question Pool */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Sample Examination Questions</span>
                  <span className="text-slate-400 font-normal">{selectedRecord.questionsCount} Total in Bank</span>
                </div>
                <div className="space-y-2">
                  {selectedRecord.sampleQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed">
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadRubric(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export Rubric (.txt)
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
                  onClick={() => handleToggleStatus(selectedRecord.id)}
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium"
                >
                  {selectedRecord.status === 'Active' ? 'Move to Draft' : 'Activate Exam'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
