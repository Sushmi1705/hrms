import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Target, Search, Filter, CheckCircle, Plus, X, Calendar, 
  User, Building2, TrendingUp, AlertTriangle, Clock, Edit3, Trash2,
  Check, Sliders, ChevronDown, Layers
} from 'lucide-react';

export interface PerformanceGoal {
  id: number;
  title: string;
  description?: string;
  owner: string;
  type: 'Department' | 'Individual' | 'Company';
  department: string;
  cycle: string;
  weight: number;
  status: 'In Progress' | 'Completed' | 'Overdue' | 'Not Started';
  progress: number;
  dueDate: string;
  targetMetric?: string;
  lastUpdated?: string;
  progressNotes?: string;
}

const INITIAL_GOALS: PerformanceGoal[] = [
  { 
    id: 1, 
    title: 'Increase Q3 Revenue by 15%', 
    owner: 'Sales Department', 
    type: 'Department', 
    department: 'Sales',
    cycle: 'Annual Performance Review 2026',
    weight: 40, 
    status: 'In Progress', 
    progress: 65,
    dueDate: '2026-09-30',
    targetMetric: '$4.5M Qualified Pipeline Closed',
    lastUpdated: '2026-09-01',
    progressNotes: 'On track with 6 enterprise deals entering final signature stage.'
  },
  { 
    id: 2, 
    title: 'Launch Enterprise Shift Module', 
    owner: 'Engineering Team', 
    type: 'Department', 
    department: 'Engineering',
    cycle: 'Annual Performance Review 2026',
    weight: 30, 
    status: 'Completed', 
    progress: 100,
    dueDate: '2026-08-31',
    targetMetric: 'Zero P0 regressions across 5 customer cohorts',
    lastUpdated: '2026-08-30',
    progressNotes: 'Successfully shipped to production and verified with client QA.'
  },
  { 
    id: 3, 
    title: 'Reduce Server Latency to < 100ms', 
    owner: 'John Doe', 
    type: 'Individual', 
    department: 'Engineering',
    cycle: 'Annual Performance Review 2026',
    weight: 20, 
    status: 'Overdue', 
    progress: 45,
    dueDate: '2026-08-15',
    targetMetric: 'p99 global latency below 100ms',
    lastUpdated: '2026-08-20',
    progressNotes: 'Encountered database replication bottleneck. Profiling query execution plans.'
  },
  {
    id: 4,
    title: 'Achieve 92% Employee Retention Rate',
    owner: 'HR Operations',
    type: 'Department',
    department: 'Human Resources',
    cycle: 'Annual Performance Review 2026',
    weight: 25,
    status: 'In Progress',
    progress: 80,
    dueDate: '2026-12-31',
    targetMetric: '< 8% voluntary turnover rate company-wide',
    lastUpdated: '2026-09-05',
    progressNotes: 'Quarterly engagement pulse score improved by 14%.'
  },
  {
    id: 5,
    title: 'Complete SOC2 Type II Certification',
    owner: 'Security & DevOps',
    type: 'Company',
    department: 'Engineering',
    cycle: 'Annual Performance Review 2026',
    weight: 35,
    status: 'Not Started',
    progress: 0,
    dueDate: '2026-11-30',
    targetMetric: 'Formal auditor attestations signed',
    lastUpdated: '2026-08-10',
    progressNotes: 'Evidence collection period kicks off next sprint.'
  }
];

export function PerformanceGoals() {
  const [goals, setGoals] = useState<PerformanceGoal[]>(INITIAL_GOALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Department' | 'Individual' | 'Company'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Progress' | 'Completed' | 'Overdue' | 'Not Started'>('All');
  const [showFilterBar, setShowFilterBar] = useState(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<PerformanceGoal | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showNotification = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Create Goal Form State
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    owner: '',
    type: 'Department' as 'Department' | 'Individual' | 'Company',
    department: 'Engineering',
    cycle: 'Annual Performance Review 2026',
    weight: 25,
    status: 'In Progress' as 'In Progress' | 'Completed' | 'Overdue' | 'Not Started',
    progress: 0,
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    targetMetric: '',
    progressNotes: ''
  });

  // Update Goal Form State
  const [updateForm, setUpdateForm] = useState({
    id: 0,
    title: '',
    owner: '',
    type: 'Department' as 'Department' | 'Individual' | 'Company',
    department: '',
    weight: 25,
    status: 'In Progress' as 'In Progress' | 'Completed' | 'Overdue' | 'Not Started',
    progress: 0,
    dueDate: '',
    targetMetric: '',
    progressNotes: ''
  });

  // Open Update Modal
  const handleOpenUpdate = (goal: PerformanceGoal) => {
    setSelectedGoal(goal);
    setUpdateForm({
      id: goal.id,
      title: goal.title,
      owner: goal.owner,
      type: goal.type,
      department: goal.department,
      weight: goal.weight,
      status: goal.status,
      progress: goal.progress,
      dueDate: goal.dueDate,
      targetMetric: goal.targetMetric || '',
      progressNotes: goal.progressNotes || ''
    });
    setIsUpdateModalOpen(true);
  };

  // Save Created Goal
  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.owner.trim()) {
      showNotification('Required Fields Missing', 'Please provide a Goal Title and Owner.');
      return;
    }

    const newGoal: PerformanceGoal = {
      id: Date.now(),
      title: createForm.title.trim(),
      description: createForm.description.trim(),
      owner: createForm.owner.trim(),
      type: createForm.type,
      department: createForm.department,
      cycle: createForm.cycle,
      weight: Number(createForm.weight) || 20,
      status: createForm.status,
      progress: Number(createForm.progress) || 0,
      dueDate: createForm.dueDate,
      targetMetric: createForm.targetMetric.trim(),
      lastUpdated: new Date().toISOString().split('T')[0],
      progressNotes: createForm.progressNotes.trim()
    };

    setGoals(prev => [newGoal, ...prev]);
    setIsCreateModalOpen(false);
    // Reset form
    setCreateForm({
      title: '',
      description: '',
      owner: '',
      type: 'Department',
      department: 'Engineering',
      cycle: 'Annual Performance Review 2026',
      weight: 25,
      status: 'In Progress',
      progress: 0,
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      targetMetric: '',
      progressNotes: ''
    });
    showNotification('Goal Created', `"${newGoal.title}" has been added and assigned to ${newGoal.owner}.`);
  };

  // Save Updated Goal
  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateForm.title.trim() || !updateForm.owner.trim()) {
      showNotification('Validation Error', 'Title and Owner are required.');
      return;
    }

    const updatedProgress = Math.min(100, Math.max(0, Number(updateForm.progress)));
    let calculatedStatus = updateForm.status;
    if (updatedProgress === 100 && calculatedStatus !== 'Completed') {
      calculatedStatus = 'Completed';
    } else if (updatedProgress > 0 && calculatedStatus === 'Not Started') {
      calculatedStatus = 'In Progress';
    }

    setGoals(prev => prev.map(g => {
      if (g.id === updateForm.id) {
        return {
          ...g,
          title: updateForm.title.trim(),
          owner: updateForm.owner.trim(),
          type: updateForm.type,
          department: updateForm.department,
          weight: Number(updateForm.weight) || g.weight,
          progress: updatedProgress,
          status: calculatedStatus,
          dueDate: updateForm.dueDate,
          targetMetric: updateForm.targetMetric.trim(),
          progressNotes: updateForm.progressNotes.trim(),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return g;
    }));

    setIsUpdateModalOpen(false);
    showNotification('Goal Updated', `"${updateForm.title}" progress updated to ${updatedProgress}% (${calculatedStatus}).`);
  };

  // Delete Goal
  const handleDeleteGoal = (goalId: number, goalTitle: string) => {
    if (window.confirm(`Are you sure you want to remove goal "${goalTitle}"?`)) {
      setGoals(prev => prev.filter(g => g.id !== goalId));
      showNotification('Goal Removed', `"${goalTitle}" has been removed from the active list.`);
    }
  };

  // Filtered Goals
  const filteredGoals = useMemo(() => {
    return goals.filter(g => {
      const matchesSearch = 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.targetMetric && g.targetMetric.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === 'All' || g.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || g.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [goals, searchQuery, typeFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = goals.length;
    const inProgress = goals.filter(g => g.status === 'In Progress').length;
    const completed = goals.filter(g => g.status === 'Completed').length;
    const overdue = goals.filter(g => g.status === 'Overdue').length;
    const avgProgress = total > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / total) : 0;
    return { total, inProgress, completed, overdue, avgProgress };
  }, [goals]);

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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Goals</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-1">Across all levels</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">{stats.inProgress}</p>
          <p className="text-xs text-slate-400 mt-1">Actively tracked</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{stats.completed}</p>
          <p className="text-xs text-slate-400 mt-1">100% finished</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2">{stats.overdue}</p>
          <p className="text-xs text-slate-400 mt-1">Passed target deadline</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Avg Completion</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-2">{stats.avgProgress}%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${stats.avgProgress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Goals & OKRs</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track company, department, and individual performance benchmarks</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            onClick={() => setShowFilterBar(!showFilterBar)}
            className={`bg-white border-slate-200 ${showFilterBar ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <Filter className="w-4 h-4 mr-2" /> 
            {showFilterBar ? 'Hide Filters' : 'Filter'}
            {(typeFilter !== 'All' || statusFilter !== 'All') && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-indigo-600"></span>
            )}
          </Button>
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Goal
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search goals by title, owner, department, or target metric..."
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
          
          {showFilterBar && (
            <div className="flex flex-wrap items-center gap-2.5 pt-1 md:pt-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-500">Level:</span>
                <select 
                  value={typeFilter}
                  onChange={(e: any) => setTypeFilter(e.target.value)}
                  className="h-10 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="All">All Levels</option>
                  <option value="Company">Company</option>
                  <option value="Department">Department</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-500">Status:</span>
                <select 
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="h-10 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>

              {(typeFilter !== 'All' || statusFilter !== 'All') && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setTypeFilter('All'); setStatusFilter('All'); }}
                  className="text-xs text-rose-600 hover:text-rose-700 h-10 px-2.5"
                >
                  Reset
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Goals Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Goal Title & Target Metric</th>
                  <th className="px-6 py-4">Owner & Dept</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4">Weight</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGoals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      <Target className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-medium text-slate-600">No goals found matching your criteria</p>
                      <p className="text-xs mt-1">Try clearing filters or search queries, or create a new goal.</p>
                      <Button 
                        onClick={() => { setSearchQuery(''); setTypeFilter('All'); setStatusFilter('All'); }}
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                      >
                        Reset Filters
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filteredGoals.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {g.title}
                        </div>
                        {g.targetMetric && (
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            <span className="font-medium text-slate-600">Target:</span> {g.targetMetric}
                          </div>
                        )}
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Due: {g.dueDate}
                          </span>
                          {g.lastUpdated && <span>• Updated {g.lastUpdated}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 flex items-center gap-1.5">
                          {g.type === 'Individual' ? (
                            <User className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          {g.owner}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{g.department}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          g.type === 'Company' ? 'bg-purple-100 text-purple-800' :
                          g.type === 'Department' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {g.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-700">{g.weight}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          g.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 
                          g.status === 'Overdue' ? 'bg-rose-100 text-rose-800' : 
                          g.status === 'Not Started' ? 'bg-slate-100 text-slate-700' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {g.status === 'Completed' && <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />}
                          {g.status === 'Overdue' && <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" />}
                          {g.status === 'In Progress' && <Clock className="w-3 h-3 mr-1 text-indigo-600" />}
                          {g.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 min-w-[150px]">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className={`h-2.5 rounded-full transition-all duration-300 ${
                                g.status === 'Completed' ? 'bg-emerald-500' : 
                                g.status === 'Overdue' ? 'bg-rose-500' : 
                                g.status === 'Not Started' ? 'bg-slate-300' :
                                'bg-indigo-600'
                              }`} 
                              style={{ width: `${g.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-slate-700 w-9 text-right">{g.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenUpdate(g)}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold text-xs px-2.5"
                          >
                            <Edit3 className="w-3.5 h-3.5 mr-1" />
                            Update
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGoal(g.id, g.title)}
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2"
                            title="Delete goal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
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
      {/* CREATE GOAL MODAL                                         */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-200" />
                  Create New Strategic Goal / OKR
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Define business objectives, assign owners, and specify performance weightings.
                </p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-indigo-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Goal Title <span className="text-rose-500">*</span>
                </label>
                <Input 
                  required
                  placeholder="e.g. Expand Enterprise Pipeline in EMEA Region"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="border-slate-300 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Goal Level <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    value={createForm.type}
                    onChange={(e: any) => setCreateForm({ ...createForm, type: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Department">Department Goal</option>
                    <option value="Individual">Individual Goal</option>
                    <option value="Company">Company / Corporate Goal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    value={createForm.department}
                    onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Product Operations">Product Operations</option>
                    <option value="Customer Success">Customer Success</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Goal Owner / Assignee <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    required
                    placeholder="e.g. Sales Team or Sarah Jenkins"
                    value={createForm.owner}
                    onChange={(e) => setCreateForm({ ...createForm, owner: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Evaluation Weight (%) <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    min="5"
                    max="100"
                    value={createForm.weight}
                    onChange={(e) => setCreateForm({ ...createForm, weight: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Metric / Success Key Result
                </label>
                <Input 
                  placeholder="e.g. $2.5M in closed ARR with > 70% win rate"
                  value={createForm.targetMetric}
                  onChange={(e) => setCreateForm({ ...createForm, targetMetric: e.target.value })}
                  className="border-slate-300 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Due Date
                  </label>
                  <Input 
                    type="date"
                    value={createForm.dueDate}
                    onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Initial Status
                  </label>
                  <select 
                    value={createForm.status}
                    onChange={(e: any) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Not Started">Not Started</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Strategic Context / Description
                </label>
                <textarea 
                  rows={2}
                  placeholder="Provide background context and alignment with company goals..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create Goal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* UPDATE GOAL MODAL                                         */}
      {/* ========================================================= */}
      {isUpdateModalOpen && selectedGoal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-300" />
                  Update Goal Progress & Metrics
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Adjust completion milestones, status flags, and record operational updates.
                </p>
              </div>
              <button 
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-slate-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Goal Title
                </label>
                <Input 
                  required
                  value={updateForm.title}
                  onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                  className="border-slate-300 focus:border-indigo-500 font-medium"
                />
              </div>

              {/* Progress Slider & Number Input */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    Current Progress Completion
                  </label>
                  <span className="text-lg font-extrabold text-indigo-700">
                    {updateForm.progress}%
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={updateForm.progress}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setUpdateForm(prev => ({
                        ...prev,
                        progress: val,
                        status: val === 100 ? 'Completed' : (val > 0 && prev.status === 'Not Started' ? 'In Progress' : prev.status)
                      }));
                    }}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={updateForm.progress}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setUpdateForm(prev => ({
                        ...prev,
                        progress: val,
                        status: val === 100 ? 'Completed' : (val > 0 && prev.status === 'Not Started' ? 'In Progress' : prev.status)
                      }));
                    }}
                    className="w-20 text-center font-bold text-slate-800 bg-white"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>0% (Not Started)</span>
                  <span>50% (Mid-term)</span>
                  <span>100% (Completed)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Goal Status
                  </label>
                  <select 
                    value={updateForm.status}
                    onChange={(e: any) => setUpdateForm({ ...updateForm, status: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Evaluation Weight (%)
                  </label>
                  <Input 
                    type="number"
                    min="5"
                    max="100"
                    value={updateForm.weight}
                    onChange={(e) => setUpdateForm({ ...updateForm, weight: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Owner / Assignee
                  </label>
                  <Input 
                    required
                    value={updateForm.owner}
                    onChange={(e) => setUpdateForm({ ...updateForm, owner: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Due Date
                  </label>
                  <Input 
                    type="date"
                    value={updateForm.dueDate}
                    onChange={(e) => setUpdateForm({ ...updateForm, dueDate: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Metric
                </label>
                <Input 
                  value={updateForm.targetMetric}
                  onChange={(e) => setUpdateForm({ ...updateForm, targetMetric: e.target.value })}
                  className="border-slate-300 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Latest Milestone / Progress Notes
                </label>
                <textarea 
                  rows={2}
                  placeholder="Record recent achievements, blocker resolutions, or next sprint milestones..."
                  value={updateForm.progressNotes}
                  onChange={(e) => setUpdateForm({ ...updateForm, progressNotes: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Save Updates
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
