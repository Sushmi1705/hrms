import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  Plus, Search, Calendar as CalendarIcon, CheckCircle, 
  SlidersHorizontal, Settings, X, AlertCircle, Archive, 
  Check, Clock, ShieldCheck, Target, Award, Users
} from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';

export interface ReviewCycleItem {
  id: string | number;
  name: string;
  type: 'Yearly' | 'Quarterly' | 'Half-Yearly' | 'Project-Based';
  start: string;
  end: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Upcoming';
  progress: number;
  scope?: string;
  goalWeight?: number;
  competencyWeight?: number;
  peerWeight?: number;
  requireCalibration?: boolean;
  autoLock?: boolean;
}

const INITIAL_CYCLES: ReviewCycleItem[] = [
  { 
    id: 1, 
    name: 'Annual Performance Review 2026', 
    type: 'Yearly', 
    start: '2026-01-01', 
    end: '2026-12-31', 
    status: 'Active', 
    progress: 65,
    scope: 'All Organization',
    goalWeight: 40,
    competencyWeight: 40,
    peerWeight: 20,
    requireCalibration: true,
    autoLock: true
  },
  { 
    id: 2, 
    name: 'Q3 Pulse Check 2026', 
    type: 'Quarterly', 
    start: '2026-07-01', 
    end: '2026-09-30', 
    status: 'Draft', 
    progress: 0,
    scope: 'Engineering & Product',
    goalWeight: 50,
    competencyWeight: 30,
    peerWeight: 20,
    requireCalibration: false,
    autoLock: false
  },
  { 
    id: 3, 
    name: 'Annual Performance Review 2025', 
    type: 'Yearly', 
    start: '2025-01-01', 
    end: '2025-12-31', 
    status: 'Archived', 
    progress: 100,
    scope: 'All Organization',
    goalWeight: 40,
    competencyWeight: 40,
    peerWeight: 20,
    requireCalibration: true,
    autoLock: true
  }
];

interface PerformanceReviewCyclesProps {
  triggerCreateModal?: boolean;
  onModalOpened?: () => void;
}

export function PerformanceReviewCycles({ triggerCreateModal, onModalOpened }: PerformanceReviewCyclesProps) {
  const [cycles, setCycles] = useState<ReviewCycleItem[]>(INITIAL_CYCLES);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<ReviewCycleItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Create Cycle Form State
  const [createForm, setCreateForm] = useState({
    name: '',
    type: 'Yearly' as ReviewCycleItem['type'],
    start: '2026-10-01',
    end: '2026-12-31',
    status: 'Active' as ReviewCycleItem['status'],
    scope: 'All Organization',
    includeSelf: true,
    includeManager: true,
    includePeer: true
  });

  // Configure Cycle Form State
  const [configForm, setConfigForm] = useState({
    name: '',
    type: 'Yearly' as ReviewCycleItem['type'],
    start: '',
    end: '',
    status: 'Active' as ReviewCycleItem['status'],
    goalWeight: 40,
    competencyWeight: 40,
    peerWeight: 20,
    requireCalibration: true,
    autoLock: true
  });

  // Listen to external trigger from parent (e.g. "Launch New Cycle" button)
  useEffect(() => {
    if (triggerCreateModal) {
      handleOpenCreateModal();
      if (onModalOpened) onModalOpened();
    }
  }, [triggerCreateModal]);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setCreateForm({
      name: '',
      type: 'Quarterly',
      start: '2026-10-01',
      end: '2026-12-31',
      status: 'Active',
      scope: 'All Organization',
      includeSelf: true,
      includeManager: true,
      includePeer: true
    });
    setIsCreateModalOpen(true);
  };

  // Save New Cycle
  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      showToast('Please specify a cycle name.', 'info');
      return;
    }

    const newCycle: ReviewCycleItem = {
      id: Date.now(),
      name: createForm.name,
      type: createForm.type,
      start: createForm.start,
      end: createForm.end,
      status: createForm.status,
      progress: createForm.status === 'Active' ? 10 : 0,
      scope: createForm.scope,
      goalWeight: 40,
      competencyWeight: 40,
      peerWeight: 20,
      requireCalibration: true,
      autoLock: false
    };

    setCycles(prev => [newCycle, ...prev]);
    setIsCreateModalOpen(false);
    showToast(`Review Cycle "${newCycle.name}" created and launched successfully.`);
  };

  // Open Configure Modal
  const handleOpenConfigure = (cycle: ReviewCycleItem) => {
    setSelectedCycle(cycle);
    setConfigForm({
      name: cycle.name,
      type: cycle.type,
      start: cycle.start,
      end: cycle.end,
      status: cycle.status,
      goalWeight: cycle.goalWeight ?? 40,
      competencyWeight: cycle.competencyWeight ?? 40,
      peerWeight: cycle.peerWeight ?? 20,
      requireCalibration: cycle.requireCalibration ?? true,
      autoLock: cycle.autoLock ?? true
    });
    setIsConfigModalOpen(true);
  };

  // Save Configuration
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCycle) return;

    setCycles(prev => prev.map(c => {
      if (c.id === selectedCycle.id) {
        return {
          ...c,
          name: configForm.name,
          type: configForm.type,
          start: configForm.start,
          end: configForm.end,
          status: configForm.status,
          goalWeight: configForm.goalWeight,
          competencyWeight: configForm.competencyWeight,
          peerWeight: configForm.peerWeight,
          requireCalibration: configForm.requireCalibration,
          autoLock: configForm.autoLock
        };
      }
      return c;
    }));

    setIsConfigModalOpen(false);
    showToast(`Configuration for "${configForm.name}" updated successfully.`);
  };

  // Filter cycles
  const filteredCycles = useMemo(() => {
    if (!searchQuery.trim()) return cycles;
    const q = searchQuery.toLowerCase();
    return cycles.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  }, [cycles, searchQuery]);

  return (
    <div className="space-y-6 mt-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-sm font-medium bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            {toastMessage.text}
          </div>
        </div>
      )}

      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Review Cycles</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage organization appraisal periods, evaluation schedules, and calibration workflows
          </p>
        </div>
        <Button 
          onClick={handleOpenCreateModal} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold text-xs transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Create Cycle
        </Button>
      </div>

      <Card className="shadow-xs border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search cycles by name, type, or status..." 
                className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs" 
              />
            </div>
            {searchQuery && (
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="text-xs text-slate-400">
                Clear
              </Button>
            )}
          </div>

          {/* Review Cycles Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Cycle Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Timeline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Completion</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCycles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-sm">No review cycles found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Click "+ Create Cycle" to launch a new performance period.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCycles.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            c.status === 'Active' ? 'bg-emerald-500' :
                            c.status === 'Draft' ? 'bg-amber-500' :
                            c.status === 'Upcoming' ? 'bg-blue-500' : 'bg-slate-400'
                          }`} />
                          {c.name}
                        </div>
                        {c.scope && <div className="text-xs text-slate-400 mt-0.5">{c.scope}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {c.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                        <div className="flex items-center gap-1.5 font-mono">
                          <CalendarIcon className="w-3.5 h-3.5 text-slate-400"/> 
                          <span>{c.start} to {c.end}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`border-0 text-xs font-semibold ${
                          c.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 
                          c.status === 'Draft' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 
                          c.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 max-w-[120px] overflow-hidden">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                c.status === 'Archived' ? 'bg-slate-400' : 
                                c.progress > 50 ? 'bg-indigo-600' : 'bg-amber-500'
                              }`} 
                              style={{ width: `${c.progress}%` }} 
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-8">
                            {c.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenConfigure(c)}
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-1 ml-auto"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          Configure
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

      {/* Modal: Create Review Cycle */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Create Review Cycle
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Define new appraisal cycle parameters, schedules, and scope
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Cycle Name *
                </label>
                <Input 
                  value={createForm.name}
                  onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. Q4 Performance Review 2026"
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Review Type
                  </label>
                  <select
                    value={createForm.type}
                    onChange={e => setCreateForm({ ...createForm, type: e.target.value as any })}
                    className="w-full h-9 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Yearly">Yearly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Project-Based">Project-Based</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Initial Status
                  </label>
                  <select
                    value={createForm.status}
                    onChange={e => setCreateForm({ ...createForm, status: e.target.value as any })}
                    className="w-full h-9 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Start Date
                  </label>
                  <Input 
                    type="date"
                    value={createForm.start}
                    onChange={e => setCreateForm({ ...createForm, start: e.target.value })}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    End Date
                  </label>
                  <Input 
                    type="date"
                    value={createForm.end}
                    onChange={e => setCreateForm({ ...createForm, end: e.target.value })}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Scope / Department
                </label>
                <select
                  value={createForm.scope}
                  onChange={e => setCreateForm({ ...createForm, scope: e.target.value })}
                  className="w-full h-9 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All Organization">All Organization (Company-wide)</option>
                  <option value="Engineering & Product">Engineering & Product</option>
                  <option value="Sales & Customer Success">Sales & Customer Success</option>
                  <option value="Corporate, HR & Finance">Corporate, HR & Finance</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Evaluation Stages Included:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:bg-slate-50">
                    <input 
                      type="checkbox" 
                      checked={createForm.includeSelf}
                      onChange={e => setCreateForm({ ...createForm, includeSelf: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span>Self-Review</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:bg-slate-50">
                    <input 
                      type="checkbox" 
                      checked={createForm.includeManager}
                      onChange={e => setCreateForm({ ...createForm, includeManager: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span>Manager Sign-off</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:bg-slate-50">
                    <input 
                      type="checkbox" 
                      checked={createForm.includePeer}
                      onChange={e => setCreateForm({ ...createForm, includePeer: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span>360 Peers</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-slate-100 dark:border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                >
                  Launch Review Cycle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Configure Review Cycle */}
      {isConfigModalOpen && selectedCycle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Configure Review Cycle
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Adjust evaluation weights, calibration rules, and status
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Cycle Name
                </label>
                <Input 
                  value={configForm.name}
                  onChange={e => setConfigForm({ ...configForm, name: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <select
                    value={configForm.status}
                    onChange={e => setConfigForm({ ...configForm, status: e.target.value as any })}
                    className="w-full h-9 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Review Type
                  </label>
                  <select
                    value={configForm.type}
                    onChange={e => setConfigForm({ ...configForm, type: e.target.value as any })}
                    className="w-full h-9 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Yearly">Yearly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Project-Based">Project-Based</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
                  <Input 
                    type="date"
                    value={configForm.start}
                    onChange={e => setConfigForm({ ...configForm, start: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">End Date</label>
                  <Input 
                    type="date"
                    value={configForm.end}
                    onChange={e => setConfigForm({ ...configForm, end: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Score Weightings Section */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Evaluation Score Weights
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Total: {configForm.goalWeight + configForm.competencyWeight + configForm.peerWeight}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Goals & OKRs:</span>
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={configForm.goalWeight}
                        onChange={e => setConfigForm({ ...configForm, goalWeight: Number(e.target.value) || 0 })}
                        className="w-14 h-7 text-xs text-center font-bold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Core Competencies:</span>
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={configForm.competencyWeight}
                        onChange={e => setConfigForm({ ...configForm, competencyWeight: Number(e.target.value) || 0 })}
                        className="w-14 h-7 text-xs text-center font-bold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">360 Peer Feedback:</span>
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={configForm.peerWeight}
                        onChange={e => setConfigForm({ ...configForm, peerWeight: Number(e.target.value) || 0 })}
                        className="w-14 h-7 text-xs text-center font-bold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Administrative Toggles */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:bg-slate-50/50">
                  <input 
                    type="checkbox"
                    checked={configForm.requireCalibration}
                    onChange={e => setConfigForm({ ...configForm, requireCalibration: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Enforce Manager Calibration Committee
                    </span>
                    <span className="text-slate-400 text-[11px]">Ratings require committee sign-off before final employee release.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:bg-slate-50/50">
                  <input 
                    type="checkbox"
                    checked={configForm.autoLock}
                    onChange={e => setConfigForm({ ...configForm, autoLock: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Auto-Lock on End Date Deadline
                    </span>
                    <span className="text-slate-400 text-[11px]">Automatically freeze submission updates after deadline pass.</span>
                  </div>
                </label>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-slate-100 dark:border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsConfigModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                >
                  Save Configuration
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
