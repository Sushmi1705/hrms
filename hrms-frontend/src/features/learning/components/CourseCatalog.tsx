import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, BookOpen, Users, Download, Check, 
  Send, Plus, Eye, PlayCircle, X, Award, FileText
} from 'lucide-react';

export interface CourseRecord {
  id: number;
  code: string;
  title: string;
  cat: 'Technical' | 'Soft Skills' | 'Compliance' | 'Leadership';
  dur: string;
  enr: number;
  status: 'Published' | 'Draft' | 'Archived';
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  modules: string[];
}

const INITIAL_COURSES: CourseRecord[] = [
  {
    id: 1,
    code: 'CRS-TECH-301',
    title: 'Advanced React Patterns & Performance',
    cat: 'Technical',
    dur: '4h 30m',
    enr: 145,
    status: 'Published',
    instructor: 'Sophie Laurent (Principal FE)',
    level: 'Advanced',
    description: 'Deep dive into concurrent rendering, state machines, custom hooks design, and memory profiling.',
    modules: [
      'Module 1: React 19 Compiler & Server Components',
      'Module 2: Custom Hooks Architecture & Composable Logic',
      'Module 3: Virtualization & High-Frequency State Updates',
      'Module 4: Performance Profiling with Chrome DevTools'
    ]
  },
  {
    id: 2,
    code: 'CRS-LEAD-101',
    title: 'Leadership 101: First-Time Engineering Managers',
    cat: 'Leadership',
    dur: '2h 15m',
    enr: 89,
    status: 'Draft',
    instructor: 'Michael Chen (VP Eng)',
    level: 'Intermediate',
    description: 'Foundational management competencies: running effective 1-on-1s, delegation, feedback delivery, and hiring.',
    modules: [
      'Module 1: Transitioning from Maker to Multiplier',
      'Module 2: The Art of Continuous 1-on-1 Feedback',
      'Module 3: Conflict Resolution & Team Psychological Safety',
      'Module 4: Career Laddering & Performance Reviews'
    ]
  },
  {
    id: 3,
    code: 'CRS-COMP-2026',
    title: 'Information Security & Privacy Compliance 2026',
    cat: 'Compliance',
    dur: '1h 00m',
    enr: 1024,
    status: 'Published',
    instructor: 'Security Ops Team',
    level: 'Beginner',
    description: 'Mandatory annual enterprise training covering SOC2 Type II, GDPR, phishing vectors, and device encryption.',
    modules: [
      'Module 1: Social Engineering & Modern Phishing Attacks',
      'Module 2: Device Security, Disk Encryption & Password Hygiene',
      'Module 3: Customer Data Protection under GDPR & CCPA',
      'Module 4: Incident Reporting Protocols & SLA Escalation'
    ]
  },
  {
    id: 4,
    code: 'CRS-SOFT-204',
    title: 'Executive Communication & High-Stakes Storytelling',
    cat: 'Soft Skills',
    dur: '3h 00m',
    enr: 210,
    status: 'Published',
    instructor: 'Chloe Bennett (Head of Design)',
    level: 'Intermediate',
    description: 'Master the pyramid principle, executive presentations, pitch design, and async communication frameworks.',
    modules: [
      'Module 1: The Minto Pyramid Principle of Communication',
      'Module 2: Designing High-Impact Executive Slide Decks',
      'Module 3: Navigating Executive Q&A with Conviction',
      'Module 4: Effective Asynchronous Alignment'
    ]
  }
];

export function CourseCatalog() {
  const [courses, setCourses] = useState<CourseRecord[]>(INITIAL_COURSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<CourseRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'All' || item.cat === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, categoryFilter]);

  const handleTogglePublish = (id: number) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== id) return c;
      const nextStatus: 'Published' | 'Draft' = c.status === 'Published' ? 'Draft' : 'Published';
      return { ...c, status: nextStatus };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        status: prev.status === 'Published' ? 'Draft' : 'Published'
      } : null);
    }
    showToast('Course publication status updated!');
  };

  const handleEnrollCohort = (rec: CourseRecord) => {
    setCourses(prev => prev.map(c => c.id === rec.id ? { ...c, enr: c.enr + 25 } : c));
    setActiveDropdown(null);
    showToast(`25 department members enrolled into ${rec.title}!`);
  };

  const handleDownloadSyllabus = (rec: CourseRecord) => {
    const content = `===============================================================
               ENTERPRISE LMS COURSE SYLLABUS
===============================================================
Course Code   : ${rec.code}
Course Title  : ${rec.title}
Category      : ${rec.cat}
Level         : ${rec.level}
Duration      : ${rec.dur}
Instructor    : ${rec.instructor}
Total Enrolled: ${rec.enr} Employees
Status        : ${rec.status.toUpperCase()}
Date Exported : ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
---------------------------------------------------------------
1. COURSE OVERVIEW & OBJECTIVES
---------------------------------------------------------------
${rec.description}

---------------------------------------------------------------
2. CURRICULUM MODULES
---------------------------------------------------------------
${rec.modules.map((m, i) => `${i + 1}. ${m}`).join('\n')}

===============================================================
L&D Accreditation:
"This course satisfies continuing education credits for organizational 
advancement and professional growth."
Ref: LMS-SYLLABUS-${rec.code}
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Syllabus_${rec.code}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Syllabus downloaded for ${rec.title}`);
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
            <span>Total Catalog</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{courses.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Available offerings</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {courses.filter(i => i.status === 'Published').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Live for enrollment</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Drafts In Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {courses.filter(i => i.status === 'Draft').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Curriculum staging</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Learners</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">
            {courses.reduce((acc, curr) => acc + curr.enr, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Active enrollments</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Course Catalog</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Manage enterprise e-learning, technical pathways, and compliance certifications</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search courses, instructor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Technical', 'Leadership', 'Compliance', 'Soft Skills'] as const).map(f => (
              <button
                key={f}
                onClick={() => setCategoryFilter(f)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  categoryFilter === f 
                    ? 'bg-white text-blue-700 shadow-xs font-semibold' 
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
                <th className="px-6 py-3.5">Course Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5">Enrollments</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No courses match your criteria.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.code} • {item.instructor}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                        {item.cat}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {item.dur}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        {item.enr.toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Published' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct View Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-blue-700 bg-blue-50/60 hover:bg-blue-100/80 border-blue-200 font-medium flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
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
                                Course Management
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <FileText className="w-3.5 h-3.5 text-blue-600" />
                                View Syllabus & Details
                              </button>

                              <button
                                onClick={() => handleTogglePublish(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {item.status === 'Published' ? 'Unpublish to Draft' : 'Publish Course'}
                              </button>

                              <button
                                onClick={() => handleEnrollCohort(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Users className="w-3.5 h-3.5 text-indigo-600" />
                                Enroll Cohort (+25)
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadSyllabus(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Syllabus (.txt)
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
          <div>Showing {filteredCourses.length} of {courses.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredCourses.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Course Detail & Syllabus Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-semibold">{selectedRecord.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.code} • {selectedRecord.cat} • Level: {selectedRecord.level}
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
              {/* Course Overview Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Instructor:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.instructor}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Duration:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.dur}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Enrolled Learners:</span>
                  <div className="font-semibold text-blue-600 mt-0.5">{selectedRecord.enr} Employees</div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <div className="text-xs font-semibold text-slate-700 mb-1">
                  Course Synopsis & Objectives
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded border border-slate-200">
                  {selectedRecord.description}
                </p>
              </div>

              {/* Curriculum Modules */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Curriculum Structure
                </div>
                <div className="space-y-1.5">
                  {selectedRecord.modules.map((mod, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-800 flex items-center gap-2">
                      <PlayCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{mod}</span>
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
                onClick={() => handleDownloadSyllabus(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export Syllabus (.txt)
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
                  onClick={() => handleTogglePublish(selectedRecord.id)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedRecord.status === 'Published' ? 'Unpublish' : 'Publish Course'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
