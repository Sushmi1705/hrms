import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Compass, Users, Download, Check, 
  Send, Eye, Milestone, X, BookOpen, Layers
} from 'lucide-react';

export interface PathStep {
  stepNumber: number;
  courseTitle: string;
  duration: string;
  required: boolean;
}

export interface LearningPathRecord {
  id: number;
  code: string;
  name: string;
  tgt: string; // Department / Role
  crs: number;
  prog: number; // e.g. 65%
  status: 'Active' | 'Draft' | 'Archived';
  enrolledLearners: number;
  description: string;
  curriculum: PathStep[];
}

const INITIAL_PATHS: LearningPathRecord[] = [
  {
    id: 1,
    code: 'PATH-ENG-01',
    name: 'Full Stack Engineering Onboarding Track',
    tgt: 'Engineering',
    crs: 5,
    prog: 65,
    status: 'Active',
    enrolledLearners: 42,
    description: 'Comprehensive 6-week onboarding sequence covering microservices architecture, React patterns, CI/CD pipelines, and internal RFC workflows.',
    curriculum: [
      { stepNumber: 1, courseTitle: 'Monorepo Architecture & Local Dev Environment Setup', duration: '3h', required: true },
      { stepNumber: 2, courseTitle: 'Advanced React Patterns & Performance Tuning', duration: '4h 30m', required: true },
      { stepNumber: 3, courseTitle: 'PostgreSQL Distributed Transactions & Sharding', duration: '5h', required: true },
      { stepNumber: 4, courseTitle: 'Kubernetes Pod Deployment & Helm Charts', duration: '3h', required: true },
      { stepNumber: 5, courseTitle: 'SOC2 Security & Secret Management Best Practices', duration: '1h 30m', required: true },
    ]
  },
  {
    id: 2,
    code: 'PATH-SALES-02',
    name: 'Enterprise AE Sales Mastery Bootcamp',
    tgt: 'Sales',
    crs: 3,
    prog: 82,
    status: 'Active',
    enrolledLearners: 28,
    description: 'High-velocity sales enablement track focusing on MEDDPICC qualification, enterprise contract negotiation, and security questionnaire navigation.',
    curriculum: [
      { stepNumber: 1, courseTitle: 'MEDDPICC Enterprise Deal Qualification Framework', duration: '4h', required: true },
      { stepNumber: 2, courseTitle: 'Executive Pitching & Financial ROI Modeling', duration: '3h 30m', required: true },
      { stepNumber: 3, courseTitle: 'Contract Redlining & Procurement Best Practices', duration: '2h', required: true },
    ]
  },
  {
    id: 3,
    code: 'PATH-LEAD-03',
    name: 'New People Manager Accelerator',
    tgt: 'Management',
    crs: 4,
    prog: 45,
    status: 'Active',
    enrolledLearners: 16,
    description: 'Leadership transition program for engineering leads, squad managers, and newly promoted people leaders.',
    curriculum: [
      { stepNumber: 1, courseTitle: 'Radical Candor & High-Performance Coaching', duration: '2h 30m', required: true },
      { stepNumber: 2, courseTitle: 'Objective & Key Results (OKR) Strategy Formulation', duration: '3h', required: true },
      { stepNumber: 3, courseTitle: 'Inclusive Hiring & Unconscious Bias Training', duration: '2h', required: true },
      { stepNumber: 4, courseTitle: 'Compensation Benchmarking & Equity Grants', duration: '1h 30m', required: false },
    ]
  }
];

export function LearningPaths() {
  const [paths, setPaths] = useState<LearningPathRecord[]>(INITIAL_PATHS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Draft' | 'Archived'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<LearningPathRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredPaths = useMemo(() => {
    return paths.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tgt.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [paths, searchTerm, statusFilter]);

  const handleToggleStatus = (id: number) => {
    setPaths(prev => prev.map(p => {
      if (p.id !== id) return p;
      const nextStatus: 'Active' | 'Draft' = p.status === 'Active' ? 'Draft' : 'Active';
      return { ...p, status: nextStatus };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        status: prev.status === 'Active' ? 'Draft' : 'Active'
      } : null);
    }
    showToast('Learning path status updated!');
  };

  const handleAssignCohort = (rec: LearningPathRecord) => {
    setPaths(prev => prev.map(p => p.id === rec.id ? { ...p, enrolledLearners: p.enrolledLearners + 15 } : p));
    setActiveDropdown(null);
    showToast(`15 new employees assigned to ${rec.name}!`);
  };

  const handleDownloadPathSyllabus = (rec: LearningPathRecord) => {
    const content = `===============================================================
               ENTERPRISE ROLE LEARNING PATH
===============================================================
Path Code     : ${rec.code}
Path Name     : ${rec.name}
Target Dept   : ${rec.tgt}
Total Courses : ${rec.crs} Modules
Learners      : ${rec.enrolledLearners} Enrolled
Avg Progress  : ${rec.prog}% Completion Rate
Status        : ${rec.status.toUpperCase()}
Date Exported : ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
---------------------------------------------------------------
1. PATH OBJECTIVE & OVERVIEW
---------------------------------------------------------------
${rec.description}

---------------------------------------------------------------
2. SEQUENTIAL CURRICULUM ROADMAP
---------------------------------------------------------------
${rec.curriculum.map(c => `Step ${c.stepNumber}: ${c.courseTitle}
   - Duration : ${c.duration}
   - Required : ${c.required ? 'MANDATORY' : 'OPTIONAL'}`).join('\n\n')}

===============================================================
Global L&D Accreditation Office
Ref: PATH-SPEC-${rec.code}
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Learning_Path_${rec.code}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Learning Path roadmap exported for ${rec.name}`);
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
            <span>Total Paths</span>
            <Compass className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{paths.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Role curricula</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Active Tracks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {paths.filter(i => i.status === 'Active').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Open for progression</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Enrolled</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {paths.reduce((acc, curr) => acc + curr.enrolledLearners, 0)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Assigned cohort staff</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Completion</span>
            <Milestone className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {Math.round(paths.reduce((acc, curr) => acc + curr.prog, 0) / paths.length)}%
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Across all tracks</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Learning Paths</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Curated sequences of courses for role-based onboarding and career growth</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search paths, department..." 
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
                <th className="px-6 py-3.5">Path Name</th>
                <th className="px-6 py-3.5">Assigned To</th>
                <th className="px-6 py-3.5">Courses Included</th>
                <th className="px-6 py-3.5">Average Progress</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPaths.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No learning paths match your search.
                  </td>
                </tr>
              ) : (
                filteredPaths.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.code}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                        {item.tgt}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.enrolledLearners} learners</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        {item.crs} Modules
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${item.prog}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{item.prog}%</span>
                      </div>
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
                          className="h-8 px-2.5 text-xs text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/80 border-indigo-200 font-medium flex items-center gap-1.5"
                        >
                          <Compass className="w-3.5 h-3.5" />
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
                                Learning Path Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                                Inspect Path Roadmap
                              </button>

                              <button
                                onClick={() => handleAssignCohort(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Users className="w-3.5 h-3.5 text-blue-600" />
                                Assign Cohort (+15)
                              </button>

                              <button
                                onClick={() => handleToggleStatus(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {item.status === 'Active' ? 'Archive Path' : 'Activate Path'}
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadPathSyllabus(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Path Spec (.txt)
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
          <div>Showing {filteredPaths.length} of {paths.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredPaths.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Learning Path Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-semibold">{selectedRecord.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.code} • Target: {selectedRecord.tgt} • {selectedRecord.crs} Courses
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
                    Cohort Progression
                  </div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">
                    {selectedRecord.prog}% Average Completion
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {selectedRecord.enrolledLearners} Employees enrolled
                  </div>
                </div>
                <div className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAssignCohort(selectedRecord)}
                    className="h-7 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
                  >
                    Assign Cohort
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <div className="text-xs font-semibold text-slate-700 mb-1">
                  Track Scope & Outcomes
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded border border-slate-200">
                  {selectedRecord.description}
                </p>
              </div>

              {/* Curriculum Milestones */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Sequenced Curriculum Roadmap
                </div>
                <div className="space-y-2">
                  {selectedRecord.curriculum.map((step) => (
                    <div key={step.stepNumber} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                          {step.stepNumber}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{step.courseTitle}</div>
                          <div className="text-[11px] text-slate-500">Duration: {step.duration}</div>
                        </div>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        step.required ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {step.required ? 'Mandatory' : 'Elective'}
                      </span>
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
                onClick={() => handleDownloadPathSyllabus(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export Roadmap (.txt)
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
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedRecord.status === 'Active' ? 'Deactivate Track' : 'Activate Track'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
