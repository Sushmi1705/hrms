import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Plus, CheckCircle, Edit3, X, DollarSign, Layers, ShieldCheck, 
  Trash2, Search, Filter, Percent, Sliders, Check, Users, Building
} from 'lucide-react';

export interface SalaryComponentItem {
  id: string;
  name: string;
  type: 'Earning' | 'Deduction';
  calcMethod: 'Percentage of Basic' | 'Percentage of CTC' | 'Fixed Annual';
  value: number;
}

export interface SalaryStructure {
  id: number;
  band: string;
  level: string;
  baseSalary: number;
  componentsCount: number;
  active: boolean;
  assignedEmployees: number;
  basicPercent: number;
  hraPercent: number;
  specialAllowancePercent: number;
  pfPercent: number;
  description?: string;
  lastUpdated?: string;
}

const INITIAL_STRUCTURES: SalaryStructure[] = [
  { 
    id: 1, 
    band: 'Executive Band (Level 1)', 
    level: 'Executive',
    baseSalary: 150000, 
    componentsCount: 8, 
    active: true,
    assignedEmployees: 14,
    basicPercent: 50,
    hraPercent: 40,
    specialAllowancePercent: 25,
    pfPercent: 12,
    description: 'Targeted for C-Suite, VP, and General Counsel executives with executive variable bonuses.',
    lastUpdated: '2026-08-15'
  },
  { 
    id: 2, 
    band: 'Management Band (Level 2)', 
    level: 'Management',
    baseSalary: 90000, 
    componentsCount: 6, 
    active: true,
    assignedEmployees: 48,
    basicPercent: 50,
    hraPercent: 40,
    specialAllowancePercent: 20,
    pfPercent: 12,
    description: 'Designed for Directors, Team Leads, and Senior Departmental Managers.',
    lastUpdated: '2026-08-20'
  },
  { 
    id: 3, 
    band: 'Professional Band (Level 3)', 
    level: 'Professional',
    baseSalary: 50000, 
    componentsCount: 5, 
    active: true,
    assignedEmployees: 165,
    basicPercent: 45,
    hraPercent: 40,
    specialAllowancePercent: 15,
    pfPercent: 12,
    description: 'Standard compensation template for Mid-level Engineers, Analysts, and Specialists.',
    lastUpdated: '2026-08-25'
  },
  { 
    id: 4, 
    band: 'Associate / Entry Band (Level 4)', 
    level: 'Entry Level',
    baseSalary: 35000, 
    componentsCount: 5, 
    active: true,
    assignedEmployees: 85,
    basicPercent: 40,
    hraPercent: 35,
    specialAllowancePercent: 10,
    pfPercent: 12,
    description: 'Compensation structure for associate engineers, graduate trainees, and junior staff.',
    lastUpdated: '2026-08-10'
  }
];

export function SalaryStructureConfig() {
  const [structures, setStructures] = useState<SalaryStructure[]>(INITIAL_STRUCTURES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<SalaryStructure | null>(null);

  // Toast
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showNotification = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Create Form State
  const [createForm, setCreateForm] = useState({
    band: '',
    level: 'Professional',
    baseSalary: 60000,
    basicPercent: 50,
    hraPercent: 40,
    specialAllowancePercent: 20,
    pfPercent: 12,
    description: '',
    active: true
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    id: 0,
    band: '',
    level: 'Professional',
    baseSalary: 60000,
    basicPercent: 50,
    hraPercent: 40,
    specialAllowancePercent: 20,
    pfPercent: 12,
    description: '',
    active: true
  });

  // Open Edit Modal
  const handleOpenEdit = (structure: SalaryStructure) => {
    setSelectedStructure(structure);
    setEditForm({
      id: structure.id,
      band: structure.band,
      level: structure.level,
      baseSalary: structure.baseSalary,
      basicPercent: structure.basicPercent,
      hraPercent: structure.hraPercent,
      specialAllowancePercent: structure.specialAllowancePercent,
      pfPercent: structure.pfPercent,
      description: structure.description || '',
      active: structure.active
    });
    setIsEditModalOpen(true);
  };

  // Save Created Structure
  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.band.trim()) {
      showNotification('Required Field Missing', 'Please enter a Band / Template Name.');
      return;
    }

    const newStruct: SalaryStructure = {
      id: Date.now(),
      band: createForm.band.trim(),
      level: createForm.level,
      baseSalary: Number(createForm.baseSalary) || 50000,
      componentsCount: 6,
      active: createForm.active,
      assignedEmployees: 0,
      basicPercent: Number(createForm.basicPercent) || 50,
      hraPercent: Number(createForm.hraPercent) || 40,
      specialAllowancePercent: Number(createForm.specialAllowancePercent) || 20,
      pfPercent: Number(createForm.pfPercent) || 12,
      description: createForm.description.trim(),
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setStructures(prev => [newStruct, ...prev]);
    setIsCreateModalOpen(false);
    setCreateForm({
      band: '',
      level: 'Professional',
      baseSalary: 60000,
      basicPercent: 50,
      hraPercent: 40,
      specialAllowancePercent: 20,
      pfPercent: 12,
      description: '',
      active: true
    });
    showNotification('Template Created', `Salary Structure "${newStruct.band}" added successfully.`);
  };

  // Save Edited Structure
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.band.trim()) {
      showNotification('Validation Error', 'Band Name is required.');
      return;
    }

    setStructures(prev => prev.map(s => {
      if (s.id === editForm.id) {
        return {
          ...s,
          band: editForm.band.trim(),
          level: editForm.level,
          baseSalary: Number(editForm.baseSalary) || s.baseSalary,
          basicPercent: Number(editForm.basicPercent) || s.basicPercent,
          hraPercent: Number(editForm.hraPercent) || s.hraPercent,
          specialAllowancePercent: Number(editForm.specialAllowancePercent) || s.specialAllowancePercent,
          pfPercent: Number(editForm.pfPercent) || s.pfPercent,
          description: editForm.description.trim(),
          active: editForm.active,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    }));

    setIsEditModalOpen(false);
    showNotification('Template Updated', `"${editForm.band}" parameters saved successfully.`);
  };

  // Toggle Active Status
  const handleToggleStatus = (id: number) => {
    setStructures(prev => prev.map(s => {
      if (s.id === id) {
        const nextActive = !s.active;
        showNotification('Status Updated', `Structure "${s.band}" set to ${nextActive ? 'Active' : 'Inactive'}.`);
        return { ...s, active: nextActive };
      }
      return s;
    }));
  };

  // Filtered Structures
  const filteredStructures = useMemo(() => {
    return structures.filter(s => {
      const matchesSearch = s.band.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || (statusFilter === 'Active' ? s.active : !s.active);
      return matchesSearch && matchesStatus;
    });
  }, [structures, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = structures.length;
    const activeCount = structures.filter(s => s.active).length;
    const totalEmployees = structures.reduce((acc, s) => acc + (s.assignedEmployees || 0), 0);
    const avgBenchmark = total > 0 ? Math.round(structures.reduce((acc, s) => acc + s.baseSalary, 0) / total) : 0;
    return { total, activeCount, totalEmployees, avgBenchmark };
  }, [structures]);

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
          <button onClick={() => setToast(null)} className="ml-3 text-emerald-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Salary Bands</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-0.5">{stats.activeCount} active templates</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Covered Employees</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{stats.totalEmployees}</p>
          <p className="text-xs text-slate-400 mt-0.5">Assigned to structures</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Average Benchmark</span>
            <DollarSign className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-2">${stats.avgBenchmark.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Per annum base median</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Statutory Rules</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">PF & TDS</p>
          <p className="text-xs text-slate-400 mt-0.5">Auto-calculated compliance</p>
        </div>
      </div>

      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Salary Structures</h2>
          <p className="text-xs text-slate-500 mt-0.5">Define corporate compensation templates, basic salary formulas, and allowance ratios</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Structure
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-3 items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search structure by band name or level..."
            className="pl-9 h-9 text-xs border-slate-200"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="h-9 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700"
          >
            <option value="All">All Templates</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Structures Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Band / Name</th>
                  <th className="px-6 py-4">Career Level</th>
                  <th className="px-6 py-4">Annual Benchmark</th>
                  <th className="px-6 py-4">Pay Component Ratios</th>
                  <th className="px-6 py-4">Headcount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStructures.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-xs">
                      No salary structures match your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStructures.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {s.band}
                        </div>
                        {s.description && (
                          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-sm">
                            {s.description}
                          </div>
                        )}
                        <div className="text-[11px] text-slate-400 mt-1">
                          Last updated: {s.lastUpdated || '2026-08-20'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          s.level === 'Executive' ? 'bg-purple-100 text-purple-800' :
                          s.level === 'Management' ? 'bg-blue-100 text-blue-800' :
                          s.level === 'Professional' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {s.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-800 font-bold text-sm">
                          ${s.baseSalary.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-400">Annual CTC Median</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-600 space-y-0.5">
                          <div><span className="font-semibold text-slate-700">Basic:</span> {s.basicPercent}% CTC</div>
                          <div><span className="font-semibold text-slate-700">HRA:</span> {s.hraPercent}% Basic</div>
                          <div><span className="font-semibold text-slate-700">PF:</span> {s.pfPercent}% Basic</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {s.assignedEmployees} staff
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(s.id)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                            s.active 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${s.active ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                          {s.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenEdit(s)}
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold text-xs px-3"
                        >
                          <Edit3 className="w-3.5 h-3.5 mr-1" />
                          Edit
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
      {/* CREATE NEW STRUCTURE MODAL                                */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-200" />
                  Define New Salary Structure
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Configure corporate salary band brackets, statutory ratios, and allowance splits.
                </p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Band / Template Name <span className="text-rose-500">*</span>
                </label>
                <Input 
                  required
                  placeholder="e.g. Lead Engineering Specialist Band (Level 3)"
                  value={createForm.band}
                  onChange={(e) => setCreateForm({ ...createForm, band: e.target.value })}
                  className="border-slate-300 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Career Level
                  </label>
                  <select 
                    value={createForm.level}
                    onChange={(e) => setCreateForm({ ...createForm, level: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Executive">Executive</option>
                    <option value="Management">Management</option>
                    <option value="Senior Professional">Senior Professional</option>
                    <option value="Professional">Professional</option>
                    <option value="Entry Level">Entry Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Annual Benchmark CTC ($)
                  </label>
                  <Input 
                    type="number"
                    min="10000"
                    step="1000"
                    value={createForm.baseSalary}
                    onChange={(e) => setCreateForm({ ...createForm, baseSalary: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Component Ratio Breakdown Box */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-3">
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  Statutory & Allowance Formulas
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Basic (% CTC)
                    </label>
                    <Input 
                      type="number"
                      min="30"
                      max="70"
                      value={createForm.basicPercent}
                      onChange={(e) => setCreateForm({ ...createForm, basicPercent: Number(e.target.value) })}
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      HRA (% Basic)
                    </label>
                    <Input 
                      type="number"
                      min="20"
                      max="50"
                      value={createForm.hraPercent}
                      onChange={(e) => setCreateForm({ ...createForm, hraPercent: Number(e.target.value) })}
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Special Allow. (%)
                    </label>
                    <Input 
                      type="number"
                      min="5"
                      max="40"
                      value={createForm.specialAllowancePercent}
                      onChange={(e) => setCreateForm({ ...createForm, specialAllowancePercent: Number(e.target.value) })}
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      PF (% Basic)
                    </label>
                    <Input 
                      type="number"
                      min="10"
                      max="15"
                      value={createForm.pfPercent}
                      onChange={(e) => setCreateForm({ ...createForm, pfPercent: Number(e.target.value) })}
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Template Description
                </label>
                <textarea 
                  rows={2}
                  placeholder="Notes on employee grades, applicable departments, and bonus qualifications..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="createActive"
                  checked={createForm.active}
                  onChange={(e) => setCreateForm({ ...createForm, active: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="createActive" className="text-xs font-medium text-slate-700">
                  Activate this salary structure immediately for employee assignments
                </label>
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
                  Create Structure
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT SALARY STRUCTURE MODAL                               */}
      {/* ========================================================= */}
      {isEditModalOpen && selectedStructure && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-300" />
                  Edit Salary Structure Template
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Update component formulas, base rates, and career level rules.
                </p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Band / Template Name <span className="text-rose-500">*</span>
                </label>
                <Input 
                  required
                  value={editForm.band}
                  onChange={(e) => setEditForm({ ...editForm, band: e.target.value })}
                  className="border-slate-300 focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Career Level
                  </label>
                  <select 
                    value={editForm.level}
                    onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Executive">Executive</option>
                    <option value="Management">Management</option>
                    <option value="Senior Professional">Senior Professional</option>
                    <option value="Professional">Professional</option>
                    <option value="Entry Level">Entry Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Annual Benchmark CTC ($)
                  </label>
                  <Input 
                    type="number"
                    min="10000"
                    step="1000"
                    value={editForm.baseSalary}
                    onChange={(e) => setEditForm({ ...editForm, baseSalary: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500 font-semibold"
                  />
                </div>
              </div>

              {/* Component Ratio Breakdown Box */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-3">
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  Statutory & Allowance Formulas
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Basic (% CTC)
                    </label>
                    <Input 
                      type="number"
                      min="30"
                      max="70"
                      value={editForm.basicPercent}
                      onChange={(e) => setEditForm({ ...editForm, basicPercent: Number(e.target.value) })}
                      className="h-8 text-xs bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      HRA (% Basic)
                    </label>
                    <Input 
                      type="number"
                      min="20"
                      max="50"
                      value={editForm.hraPercent}
                      onChange={(e) => setEditForm({ ...editForm, hraPercent: Number(e.target.value) })}
                      className="h-8 text-xs bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Special Allow. (%)
                    </label>
                    <Input 
                      type="number"
                      min="5"
                      max="40"
                      value={editForm.specialAllowancePercent}
                      onChange={(e) => setEditForm({ ...editForm, specialAllowancePercent: Number(e.target.value) })}
                      className="h-8 text-xs bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      PF (% Basic)
                    </label>
                    <Input 
                      type="number"
                      min="10"
                      max="15"
                      value={editForm.pfPercent}
                      onChange={(e) => setEditForm({ ...editForm, pfPercent: Number(e.target.value) })}
                      className="h-8 text-xs bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea 
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="editActive"
                  checked={editForm.active}
                  onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="editActive" className="text-xs font-medium text-slate-700">
                  Active Structure (available for employee compensation mapping)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
