import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, PlayCircle, CheckCircle, Eye, Star, User, 
  Calendar, Award, X, Plus, Check, Clock, AlertCircle, 
  Building2, ChevronRight, FileText, BarChart2
} from 'lucide-react';

export interface PerformanceReview {
  id: number;
  employee: string;
  role: string;
  department: string;
  manager: string;
  cycle: string;
  selfRating: number | null;
  managerRating: number | null;
  status: 'Draft' | 'Self-Review Pending' | 'Submitted' | 'Manager Reviewed' | 'Final Approved';
  dueDate: string;
  selfComments?: string;
  managerFeedback?: string;
  goalsScore?: number | null;
  competencyScore?: number | null;
  lastUpdated?: string;
}

const INITIAL_REVIEWS: PerformanceReview[] = [
  { 
    id: 1, 
    employee: 'Jane Smith', 
    role: 'Senior Product Manager',
    department: 'Product Operations',
    manager: 'Michael Brown', 
    cycle: 'Annual 2026', 
    selfRating: 4.5, 
    managerRating: 4.2, 
    status: 'Manager Reviewed',
    dueDate: '2026-10-15',
    selfComments: 'Successfully delivered the core multi-tenant authentication engine and improved enterprise customer onboarding by 30%.',
    managerFeedback: 'Consistently shows high technical ownership and effective cross-functional leadership. Recommended for senior promotion track.',
    goalsScore: 4.6,
    competencyScore: 4.2,
    lastUpdated: '2026-09-02'
  },
  { 
    id: 2, 
    employee: 'John Doe', 
    role: 'Full Stack Engineer',
    department: 'Engineering',
    manager: 'Sarah Connor', 
    cycle: 'Annual 2026', 
    selfRating: 3.8, 
    managerRating: null, 
    status: 'Submitted',
    dueDate: '2026-10-15',
    selfComments: 'Maintained 99.9% uptime on payment microservices and resolved high-priority technical debt in shift roster calculations.',
    managerFeedback: '',
    goalsScore: 3.9,
    competencyScore: 3.7,
    lastUpdated: '2026-09-04'
  },
  { 
    id: 3, 
    employee: 'Alice Johnson', 
    role: 'Talent Acquisition Lead',
    department: 'Human Resources',
    manager: 'Michael Brown', 
    cycle: 'Annual 2026', 
    selfRating: null, 
    managerRating: null, 
    status: 'Draft',
    dueDate: '2026-10-30',
    selfComments: '',
    managerFeedback: '',
    goalsScore: null,
    competencyScore: null,
    lastUpdated: '2026-08-28'
  },
  {
    id: 4,
    employee: 'David Kim',
    role: 'DevOps Architect',
    department: 'Engineering',
    manager: 'Sarah Connor',
    cycle: 'Annual 2026',
    selfRating: 4.8,
    managerRating: 4.7,
    status: 'Final Approved',
    dueDate: '2026-09-30',
    selfComments: 'Automated CI/CD deployment pipelines cutting cycle release times from 45 minutes to under 8 minutes.',
    managerFeedback: 'Exceptional architectural delivery. Outstanding benchmark for the entire engineering organization.',
    goalsScore: 4.9,
    competencyScore: 4.6,
    lastUpdated: '2026-09-05'
  },
  {
    id: 5,
    employee: 'Emma Watson',
    role: 'Enterprise Account Executive',
    department: 'Sales',
    manager: 'Alex Rivera',
    cycle: 'Annual 2026',
    selfRating: 4.0,
    managerRating: null,
    status: 'Self-Review Pending',
    dueDate: '2026-10-20',
    selfComments: '',
    managerFeedback: '',
    goalsScore: null,
    competencyScore: null,
    lastUpdated: '2026-09-06'
  }
];

export function PerformanceReviewsList() {
  const [reviews, setReviews] = useState<PerformanceReview[]>(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [cycleFilter, setCycleFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Modals state
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showNotification = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Start Review Form State
  const [startForm, setStartForm] = useState({
    employee: '',
    role: 'Software Engineer',
    department: 'Engineering',
    manager: 'Michael Brown',
    cycle: 'Annual 2026',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reviewType: 'Self & Manager Review',
    status: 'Draft' as PerformanceReview['status']
  });

  // View / Edit Review Form State
  const [viewForm, setViewForm] = useState<{
    managerRating: number;
    managerFeedback: string;
    status: PerformanceReview['status'];
  }>({
    managerRating: 4.0,
    managerFeedback: '',
    status: 'Manager Reviewed'
  });

  // Open View Modal
  const handleOpenView = (review: PerformanceReview) => {
    setSelectedReview(review);
    setViewForm({
      managerRating: review.managerRating ?? (review.selfRating ? review.selfRating : 4.0),
      managerFeedback: review.managerFeedback || '',
      status: review.status
    });
    setIsViewModalOpen(true);
  };

  // Save Initiated Review
  const handleSaveStartReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startForm.employee.trim() || !startForm.manager.trim()) {
      showNotification('Missing Information', 'Please provide Employee and Manager names.');
      return;
    }

    const newReview: PerformanceReview = {
      id: Date.now(),
      employee: startForm.employee.trim(),
      role: startForm.role.trim() || 'Team Member',
      department: startForm.department,
      manager: startForm.manager.trim(),
      cycle: startForm.cycle,
      selfRating: null,
      managerRating: null,
      status: startForm.status,
      dueDate: startForm.dueDate,
      selfComments: '',
      managerFeedback: '',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => [newReview, ...prev]);
    setIsStartModalOpen(false);
    setStartForm({
      employee: '',
      role: 'Software Engineer',
      department: 'Engineering',
      manager: 'Michael Brown',
      cycle: 'Annual 2026',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reviewType: 'Self & Manager Review',
      status: 'Draft'
    });
    showNotification('Review Initiated', `Performance appraisal opened for ${newReview.employee}.`);
  };

  // Save View / Evaluation Changes
  const handleSaveReviewDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    setReviews(prev => prev.map(r => {
      if (r.id === selectedReview.id) {
        return {
          ...r,
          managerRating: Number(viewForm.managerRating),
          managerFeedback: viewForm.managerFeedback.trim(),
          status: viewForm.status,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return r;
    }));

    setIsViewModalOpen(false);
    showNotification('Appraisal Updated', `Review for ${selectedReview.employee} updated to ${viewForm.status}.`);
  };

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesSearch = 
        r.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchesCycle = cycleFilter === 'All' || r.cycle === cycleFilter;

      return matchesSearch && matchesStatus && matchesCycle;
    });
  }, [reviews, searchQuery, statusFilter, cycleFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter(r => r.status === 'Draft' || r.status === 'Self-Review Pending').length;
    const submitted = reviews.filter(r => r.status === 'Submitted').length;
    const completed = reviews.filter(r => r.status === 'Manager Reviewed' || r.status === 'Final Approved').length;
    
    const ratedReviews = reviews.filter(r => r.managerRating != null);
    const avgRating = ratedReviews.length > 0 
      ? (ratedReviews.reduce((acc, r) => acc + (r.managerRating || 0), 0) / ratedReviews.length).toFixed(1)
      : '4.2';

    return { total, pending, submitted, completed, avgRating };
  }, [reviews]);

  return (
    <div className="space-y-6 mt-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-emerald-700 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50 border border-emerald-500/40">
          <CheckCircle className="w-5 h-5 text-emerald-200 shrink-0" />
          <div>
            <p className="font-semibold text-sm">{toast.title}</p>
            <p className="text-emerald-100 text-xs mt-0.5">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)} 
            className="ml-3 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reviews</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-1">In active cycle</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Self Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{stats.pending}</p>
          <p className="text-xs text-slate-400 mt-1">Awaiting employee</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Submitted</span>
            <AlertCircle className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">{stats.submitted}</p>
          <p className="text-xs text-slate-400 mt-1">Awaiting manager</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{stats.completed}</p>
          <p className="text-xs text-slate-400 mt-1">Evaluated & signed</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Average Rating</span>
            <Star className="w-4 h-4 text-purple-500 fill-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-2">{stats.avgRating} <span className="text-sm font-normal text-slate-400">/ 5.0</span></p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${(Number(stats.avgRating) / 5) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Performance Reviews</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage and calibrate individual self-assessments and manager appraisals</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className={`bg-white border-slate-200 ${showFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <Filter className="w-4 h-4 mr-2"/> 
            {showFilters ? 'Hide Filters' : 'Filter Status'}
            {(statusFilter !== 'All' || cycleFilter !== 'All') && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-indigo-600"></span>
            )}
          </Button>
          <Button 
            onClick={() => setIsStartModalOpen(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
          >
            <PlayCircle className="w-4 h-4 mr-1.5" /> Start Review
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by employee name, manager, role, or department..."
              className="pl-9 h-10 border-slate-200 focus:border-indigo-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-2.5 pt-1 md:pt-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-500">Status:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Self-Review Pending">Self-Review Pending</option>
                  <option value="Submitted">Submitted (Awaiting Manager)</option>
                  <option value="Manager Reviewed">Manager Reviewed</option>
                  <option value="Final Approved">Final Approved</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-500">Cycle:</span>
                <select 
                  value={cycleFilter}
                  onChange={(e) => setCycleFilter(e.target.value)}
                  className="h-10 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="All">All Cycles</option>
                  <option value="Annual 2026">Annual 2026</option>
                  <option value="Q3 Pulse Check 2026">Q3 Pulse Check 2026</option>
                </select>
              </div>

              {(statusFilter !== 'All' || cycleFilter !== 'All') && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setStatusFilter('All'); setCycleFilter('All'); }}
                  className="text-xs text-rose-600 hover:text-rose-700 h-10 px-2.5"
                >
                  Reset
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Reviewer / Manager</th>
                  <th className="px-6 py-4">Review Cycle</th>
                  <th className="px-6 py-4">Self Rating</th>
                  <th className="px-6 py-4">Manager Rating</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-medium text-slate-600">No performance reviews found</p>
                      <p className="text-xs mt-1">Try clearing filters or initiate a new review appraisal.</p>
                      <Button 
                        onClick={() => { setSearchQuery(''); setStatusFilter('All'); setCycleFilter('All'); }}
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                      >
                        Reset Filters
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {r.employee.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {r.employee}
                            </div>
                            <div className="text-xs text-slate-500">{r.role} • {r.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-800 font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {r.manager}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Due: {r.dueDate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {r.cycle}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {r.selfRating != null ? (
                          <div className="flex items-center gap-1 font-semibold text-slate-800">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            {r.selfRating.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {r.managerRating != null ? (
                          <div className="flex items-center gap-1 font-bold text-indigo-700">
                            <Star className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                            {r.managerRating.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Awaiting</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          r.status === 'Manager Reviewed' ? 'bg-emerald-100 text-emerald-800' : 
                          r.status === 'Final Approved' ? 'bg-purple-100 text-purple-800' :
                          r.status === 'Submitted' ? 'bg-indigo-100 text-indigo-800' : 
                          r.status === 'Self-Review Pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {r.status === 'Manager Reviewed' && <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />}
                          {r.status === 'Final Approved' && <Award className="w-3 h-3 mr-1 text-purple-600" />}
                          {r.status === 'Submitted' && <Clock className="w-3 h-3 mr-1 text-indigo-600" />}
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenView(r)}
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold text-xs px-3"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* START REVIEW MODAL                                        */}
      {/* ========================================================= */}
      {isStartModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-indigo-200" />
                  Initiate Performance Review
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Launch a structured employee performance appraisal cycle.
                </p>
              </div>
              <button 
                onClick={() => setIsStartModalOpen(false)}
                className="text-indigo-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStartReview} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Employee Full Name <span className="text-rose-500">*</span>
                </label>
                <Input 
                  required
                  placeholder="e.g. Robert Taylor"
                  value={startForm.employee}
                  onChange={(e) => setStartForm({ ...startForm, employee: e.target.value })}
                  className="border-slate-300 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Job Role / Title
                  </label>
                  <Input 
                    placeholder="e.g. Senior Backend Engineer"
                    value={startForm.role}
                    onChange={(e) => setStartForm({ ...startForm, role: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <select 
                    value={startForm.department}
                    onChange={(e) => setStartForm({ ...startForm, department: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Operations">Product Operations</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Reviewer / Manager <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    required
                    placeholder="e.g. Michael Brown"
                    value={startForm.manager}
                    onChange={(e) => setStartForm({ ...startForm, manager: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Review Cycle
                  </label>
                  <select 
                    value={startForm.cycle}
                    onChange={(e) => setStartForm({ ...startForm, cycle: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Annual 2026">Annual 2026</option>
                    <option value="Q3 Pulse Check 2026">Q3 Pulse Check 2026</option>
                    <option value="Q4 Year-End Appraisal 2026">Q4 Year-End Appraisal 2026</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Review Due Date
                  </label>
                  <Input 
                    type="date"
                    value={startForm.dueDate}
                    onChange={(e) => setStartForm({ ...startForm, dueDate: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Workflow Start Stage
                  </label>
                  <select 
                    value={startForm.status}
                    onChange={(e: any) => setStartForm({ ...startForm, status: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Draft">Draft (Admin Only)</option>
                    <option value="Self-Review Pending">Self-Review Pending (Notify Employee)</option>
                    <option value="Submitted">Submitted (Direct to Manager)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsStartModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <PlayCircle className="w-4 h-4 mr-1.5" />
                  Initiate Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW & EVALUATE REVIEW MODAL                              */}
      {/* ========================================================= */}
      {isViewModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-200 flex items-center justify-center font-extrabold text-base">
                  {selectedReview.employee.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {selectedReview.employee}
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal border border-indigo-400/30">
                      {selectedReview.cycle}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedReview.role} • {selectedReview.department} • Manager: {selectedReview.manager}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSaveReviewDetails} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* Stepper / Stage Flow */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">1</span>
                    Self-Assessment ({selectedReview.selfRating ? `${selectedReview.selfRating}/5.0` : 'Pending'})
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <div className={`flex items-center gap-2 font-semibold ${selectedReview.managerRating ? 'text-emerald-700' : 'text-indigo-700'}`}>
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">2</span>
                    Manager Review
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <div className={`flex items-center gap-2 font-semibold ${selectedReview.status === 'Final Approved' ? 'text-emerald-700' : 'text-slate-400'}`}>
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">3</span>
                    Final Calibration
                  </div>
                </div>
              </div>

              {/* Rating Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee Self-Rating</span>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-bold text-slate-800">
                      {selectedReview.selfRating ? `${selectedReview.selfRating.toFixed(1)}` : 'N/A'}
                    </span>
                    <span className="text-xs text-slate-400">/ 5.0</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 italic bg-white p-2.5 rounded border border-slate-100">
                    "{selectedReview.selfComments || 'Employee self-appraisal comments not yet submitted.'}"
                  </p>
                </div>

                {/* Manager Rating Input */}
                <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/40 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                      Manager Evaluation Score
                    </span>
                    <span className="text-2xl font-extrabold text-indigo-700">
                      {Number(viewForm.managerRating).toFixed(1)} <span className="text-xs font-normal text-indigo-400">/ 5.0</span>
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={viewForm.managerRating}
                    onChange={(e) => setViewForm({ ...viewForm, managerRating: parseFloat(e.target.value) })}
                    className="w-full h-2.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-indigo-600/70 font-medium">
                    <span>1.0 (Needs Imp.)</span>
                    <span>3.0 (Meets)</span>
                    <span>5.0 (Role Model)</span>
                  </div>
                </div>
              </div>

              {/* Manager Feedback */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Manager Appraisal Comments & Calibration Notes <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Record strengths, project achievements, leadership capabilities, and development areas..."
                  value={viewForm.managerFeedback}
                  onChange={(e) => setViewForm({ ...viewForm, managerFeedback: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 p-3 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Status Update Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Review Workflow Status
                  </label>
                  <select 
                    value={viewForm.status}
                    onChange={(e: any) => setViewForm({ ...viewForm, status: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none font-medium"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Self-Review Pending">Self-Review Pending</option>
                    <option value="Submitted">Submitted (Awaiting Manager)</option>
                    <option value="Manager Reviewed">Manager Reviewed</option>
                    <option value="Final Approved">Final Approved & Signed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Appraisal Due Date
                  </label>
                  <Input 
                    disabled
                    value={selectedReview.dueDate}
                    className="bg-slate-50 text-slate-600 border-slate-200"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Last recorded update: {selectedReview.lastUpdated || 'Today'}
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    Save & Submit Appraisal
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
