import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, GraduationCap, Award, Download, Check, 
  Send, UserCheck, BookOpen, X, FileText
} from 'lucide-react';

export interface EmployeeCourseEnrollment {
  id: string;
  courseTitle: string;
  category: string;
  progress: number;
  completedDate?: string;
  score?: string;
}

export interface EmployeeLearningRecord {
  id: number;
  empCode: string;
  name: string;
  dept: string;
  role: string;
  completedCount: number;
  hours: number;
  status: 'Active' | 'Completed' | 'Behind Schedule';
  enrollments: EmployeeCourseEnrollment[];
}

const INITIAL_EMPLOYEES: EmployeeLearningRecord[] = [
  {
    id: 1,
    empCode: 'EMP-1001',
    name: 'Sarah Jenkins',
    dept: 'Engineering',
    role: 'Senior Developer',
    completedCount: 6,
    hours: 28,
    status: 'Active',
    enrollments: [
      { id: '1', courseTitle: 'Advanced React Patterns & Performance', category: 'Technical', progress: 100, completedDate: '2026-08-20', score: '98%' },
      { id: '2', courseTitle: 'Kubernetes Multi-Cluster Orchestration', category: 'Technical', progress: 100, completedDate: '2026-07-15', score: '94%' },
      { id: '3', courseTitle: 'Information Security 2026', category: 'Compliance', progress: 100, completedDate: '2026-08-01', score: '100%' },
      { id: '4', courseTitle: 'Microservices Distributed Tracing', category: 'Technical', progress: 60 },
    ]
  },
  {
    id: 2,
    empCode: 'EMP-1002',
    name: 'John Doe',
    dept: 'Product Management',
    role: 'Technical Product Lead',
    completedCount: 4,
    hours: 19,
    status: 'Active',
    enrollments: [
      { id: '1', courseTitle: 'Leadership 101: Engineering Managers', category: 'Leadership', progress: 100, completedDate: '2026-08-10', score: '92%' },
      { id: '2', courseTitle: 'Executive Communication & Storytelling', category: 'Soft Skills', progress: 100, completedDate: '2026-06-25', score: '95%' },
      { id: '3', courseTitle: 'Information Security 2026', category: 'Compliance', progress: 100, completedDate: '2026-08-01', score: '100%' },
      { id: '4', courseTitle: 'Data Analysis with SQL & BigQuery', category: 'Technical', progress: 40 },
    ]
  },
  {
    id: 3,
    empCode: 'EMP-1003',
    name: 'David Lee',
    dept: 'Sales & BD',
    role: 'Enterprise AE',
    completedCount: 5,
    hours: 22,
    status: 'Completed',
    enrollments: [
      { id: '1', courseTitle: 'Enterprise AE Sales Mastery Bootcamp', category: 'Sales', progress: 100, completedDate: '2026-07-28', score: '96%' },
      { id: '2', courseTitle: 'Executive Pitching & Financial ROI Modeling', category: 'Sales', progress: 100, completedDate: '2026-08-15', score: '98%' },
      { id: '3', courseTitle: 'Information Security 2026', category: 'Compliance', progress: 100, completedDate: '2026-08-01', score: '100%' },
    ]
  },
  {
    id: 4,
    empCode: 'EMP-1004',
    name: 'Elena Rostova',
    dept: 'Data Engineering',
    role: 'Lead Data Architect',
    completedCount: 2,
    hours: 9,
    status: 'Behind Schedule',
    enrollments: [
      { id: '1', courseTitle: 'Information Security 2026', category: 'Compliance', progress: 50 },
      { id: '2', courseTitle: 'Snowflake Enterprise Architecture', category: 'Technical', progress: 20 },
    ]
  }
];

export function EmployeeLearning() {
  const [employees, setEmployees] = useState<EmployeeLearningRecord[]>(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed' | 'Behind Schedule'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<EmployeeLearningRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, statusFilter]);

  const handleAssignBooster = (rec: EmployeeLearningRecord) => {
    setEmployees(prev => prev.map(e => {
      if (e.id !== rec.id) return e;
      return {
        ...e,
        enrollments: [
          ...e.enrollments,
          { id: String(Date.now()), courseTitle: 'AI-Assisted Engineering Workflows', category: 'Technical', progress: 0 }
        ]
      };
    }));
    setActiveDropdown(null);
    showToast(`New elective course assigned to ${rec.name}!`);
  };

  const handleDownloadTranscript = (rec: EmployeeLearningRecord) => {
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const content = `===============================================================
              OFFICIAL EMPLOYEE LEARNING TRANSCRIPT
===============================================================
Employee Name     : ${rec.name}
Employee Code     : ${rec.empCode}
Department        : ${rec.dept}
Role / Title      : ${rec.role}
Courses Completed : ${rec.completedCount} Courses
Total Hours Logged: ${rec.hours} Professional Training Hours
Transcript Date   : ${todayStr}
---------------------------------------------------------------
1. ENROLLED COURSES & COMPLETION CREDENTIALS
---------------------------------------------------------------
${rec.enrollments.map((enr, i) => `${i + 1}. [${enr.progress === 100 ? 'COMPLETED' : 'IN PROGRESS'}] ${enr.courseTitle}
   - Category   : ${enr.category}
   - Progress   : ${enr.progress}%
   - Completion : ${enr.completedDate || 'In Progress'}
   - Grade / Pct: ${enr.score || 'Awaiting Final Exam'}`).join('\n\n')}

===============================================================
Enterprise LMS Registrar Signature: __________________   Date: ________
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Transcript_${rec.empCode}_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Learning Transcript exported for ${rec.name}`);
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
            <span>Tracked Learners</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{employees.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Active employee records</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Completions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {employees.reduce((acc, curr) => acc + curr.completedCount, 0)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Total courses passed</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Training Hours</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {employees.reduce((acc, curr) => acc + curr.hours, 0)} hrs
          </div>
          <div className="text-xs text-slate-500 mt-0.5">L&D logged time</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Behind Schedule</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {employees.filter(i => i.status === 'Behind Schedule').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Need engagement nudge</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Employee Learning Records</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Track employee progress, completed courses, and logged professional training hours</p>
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
            {(['All', 'Active', 'Completed', 'Behind Schedule'] as const).map(f => (
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
                <th className="px-6 py-3.5">Employee Name</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Courses Completed</th>
                <th className="px-6 py-3.5">Training Hours</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No employee learning records match your filter.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.empCode} • {item.role}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-slate-700">{item.dept}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                        {item.completedCount} Courses
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {item.hours} hrs
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Completed
                        </span>
                      ) : item.status === 'Behind Schedule' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertCircle className="w-3 h-3 mr-1 text-rose-600"/> Behind
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <Clock className="w-3 h-3 mr-1 text-blue-600"/> Active
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Transcript Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/80 border-indigo-200 font-medium flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Transcript
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
                                Learner Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                                View Full Learning Transcript
                              </button>

                              <button
                                onClick={() => handleAssignBooster(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                                Assign Booster Course
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadTranscript(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Export Transcript (.txt)
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
          <div>Showing {filteredEmployees.length} of {employees.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredEmployees.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Employee Transcript Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-semibold">{selectedRecord.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.empCode} • {selectedRecord.dept} • {selectedRecord.role}
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
              {/* Stats Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Courses Completed:</span>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedRecord.completedCount} Courses</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Total Training Time:</span>
                  <div className="font-bold text-indigo-600 text-sm mt-0.5">{selectedRecord.hours} Hours Logged</div>
                </div>
              </div>

              {/* Course Enrollments */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Course Enrollments & Certifications
                </div>
                <div className="space-y-2">
                  {selectedRecord.enrollments.map((enr) => (
                    <div key={enr.id} className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-800">{enr.courseTitle}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Category: {enr.category} {enr.completedDate && `• Completed: ${enr.completedDate}`}
                        </div>
                      </div>

                      <div className="text-right">
                        {enr.progress === 100 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                            Passed ({enr.score})
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-blue-600 h-full" style={{ width: `${enr.progress}%` }} />
                            </div>
                            <span className="font-semibold text-slate-600">{enr.progress}%</span>
                          </div>
                        )}
                      </div>
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
                onClick={() => handleDownloadTranscript(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export Transcript (.txt)
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
                  onClick={() => handleAssignBooster(selectedRecord)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  Assign Elective Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
