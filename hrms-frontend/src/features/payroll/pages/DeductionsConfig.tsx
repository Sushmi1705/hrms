import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Plus, CheckCircle, Edit3, X, ShieldAlert, ShieldCheck, 
  Search, Filter, Percent, DollarSign, Scale, HelpCircle, Check
} from 'lucide-react';

export interface DeductionComponent {
  id: number;
  name: string;
  code: string;
  type: 'Statutory' | 'Policy' | 'Voluntary';
  taxTreatment: 'Pre-Tax' | 'Post-Tax';
  calculationType: 'Percentage of Basic' | 'Percentage of Gross' | 'Fixed Monthly Amount' | 'Slab / Progressive' | 'Attendance-Based';
  rateValue: number;
  calculationRule: string;
  monthlyCap: number;
  applicableTo: 'All Employees' | 'Eligible Wage Band' | 'Opt-In Only';
  active: boolean;
  description?: string;
  lastUpdated?: string;
}

const INITIAL_DEDUCTIONS: DeductionComponent[] = [
  { 
    id: 1, 
    name: 'Income Tax (TDS)', 
    code: 'TDS',
    type: 'Statutory', 
    taxTreatment: 'Pre-Tax',
    calculationType: 'Slab / Progressive',
    rateValue: 0,
    calculationRule: 'Percentage based on progressive annual tax slabs', 
    monthlyCap: 0,
    applicableTo: 'All Employees',
    active: true,
    description: 'Statutory withholding computed in accordance with prevailing corporate tax brackets.',
    lastUpdated: '2026-08-15'
  },
  { 
    id: 2, 
    name: 'Provident Fund (PF)', 
    code: 'PF_EMP',
    type: 'Statutory', 
    taxTreatment: 'Pre-Tax',
    calculationType: 'Percentage of Basic',
    rateValue: 12,
    calculationRule: '12% of Basic Salary (Statutory employee contribution)', 
    monthlyCap: 1800,
    applicableTo: 'Eligible Wage Band',
    active: true,
    description: 'Mandatory social security pension contribution capped per statutory limits.',
    lastUpdated: '2026-08-18'
  },
  { 
    id: 3, 
    name: 'Employee State Insurance (ESI)', 
    code: 'ESI',
    type: 'Statutory', 
    taxTreatment: 'Post-Tax',
    calculationType: 'Percentage of Gross',
    rateValue: 0.75,
    calculationRule: '0.75% of Gross Wages for gross <= $3,000/mo', 
    monthlyCap: 0,
    applicableTo: 'Eligible Wage Band',
    active: true,
    description: 'Medical security scheme contribution for qualifying employee income thresholds.',
    lastUpdated: '2026-08-20'
  },
  { 
    id: 4, 
    name: 'Professional Tax (PT)', 
    code: 'PROF_TAX',
    type: 'Statutory', 
    taxTreatment: 'Post-Tax',
    calculationType: 'Fixed Monthly Amount',
    rateValue: 20,
    calculationRule: 'Fixed $20/month local statutory mandate', 
    monthlyCap: 20,
    applicableTo: 'All Employees',
    active: true,
    description: 'State government professional employment tax deducted monthly.',
    lastUpdated: '2026-08-10'
  },
  { 
    id: 5, 
    name: 'Late Penalty & Unpaid LOP', 
    code: 'LATE_LOP',
    type: 'Policy', 
    taxTreatment: 'Pre-Tax',
    calculationType: 'Attendance-Based',
    rateValue: 100,
    calculationRule: 'Daily pro-rata salary based on biometric unpaid leaves', 
    monthlyCap: 0,
    applicableTo: 'All Employees',
    active: true,
    description: 'Pro-rata salary deductions applied automatically from biometric attendance sync.',
    lastUpdated: '2026-08-22'
  },
  { 
    id: 6, 
    name: 'Voluntary Retirement 401(k)', 
    code: 'V_401K',
    type: 'Voluntary', 
    taxTreatment: 'Pre-Tax',
    calculationType: 'Percentage of Basic',
    rateValue: 5,
    calculationRule: '5% voluntary employee retirement savings election', 
    monthlyCap: 2500,
    applicableTo: 'Opt-In Only',
    active: true,
    description: 'Elective pre-tax employee deferred savings plan.',
    lastUpdated: '2026-08-25'
  }
];

export function DeductionsConfig() {
  const [deductions, setDeductions] = useState<DeductionComponent[]>(INITIAL_DEDUCTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Statutory' | 'Policy' | 'Voluntary'>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState<DeductionComponent | null>(null);

  // Toast
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showNotification = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Add Form State
  const [addForm, setAddForm] = useState({
    name: '',
    code: '',
    type: 'Statutory' as DeductionComponent['type'],
    taxTreatment: 'Pre-Tax' as DeductionComponent['taxTreatment'],
    calculationType: 'Percentage of Basic' as DeductionComponent['calculationType'],
    rateValue: 10,
    calculationRule: '10% of Basic Salary',
    monthlyCap: 0,
    applicableTo: 'All Employees' as DeductionComponent['applicableTo'],
    description: '',
    active: true
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    id: 0,
    name: '',
    code: '',
    type: 'Statutory' as DeductionComponent['type'],
    taxTreatment: 'Pre-Tax' as DeductionComponent['taxTreatment'],
    calculationType: 'Percentage of Basic' as DeductionComponent['calculationType'],
    rateValue: 10,
    calculationRule: '',
    monthlyCap: 0,
    applicableTo: 'All Employees' as DeductionComponent['applicableTo'],
    description: '',
    active: true
  });

  // Open Edit Modal
  const handleOpenEdit = (deduction: DeductionComponent) => {
    setSelectedDeduction(deduction);
    setEditForm({
      id: deduction.id,
      name: deduction.name,
      code: deduction.code,
      type: deduction.type,
      taxTreatment: deduction.taxTreatment,
      calculationType: deduction.calculationType,
      rateValue: deduction.rateValue,
      calculationRule: deduction.calculationRule,
      monthlyCap: deduction.monthlyCap,
      applicableTo: deduction.applicableTo,
      description: deduction.description || '',
      active: deduction.active
    });
    setIsEditModalOpen(true);
  };

  // Save Add Form
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      showNotification('Missing Information', 'Please enter a Component Name.');
      return;
    }

    const newComponent: DeductionComponent = {
      id: Date.now(),
      name: addForm.name.trim(),
      code: addForm.code.trim().toUpperCase() || `DED_${Math.floor(100 + Math.random() * 900)}`,
      type: addForm.type,
      taxTreatment: addForm.taxTreatment,
      calculationType: addForm.calculationType,
      rateValue: Number(addForm.rateValue) || 0,
      calculationRule: addForm.calculationRule.trim() || `${addForm.rateValue}% of Basic Salary`,
      monthlyCap: Number(addForm.monthlyCap) || 0,
      applicableTo: addForm.applicableTo,
      description: addForm.description.trim(),
      active: addForm.active,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setDeductions(prev => [newComponent, ...prev]);
    setIsAddModalOpen(false);
    setAddForm({
      name: '',
      code: '',
      type: 'Statutory',
      taxTreatment: 'Pre-Tax',
      calculationType: 'Percentage of Basic',
      rateValue: 10,
      calculationRule: '10% of Basic Salary',
      monthlyCap: 0,
      applicableTo: 'All Employees',
      description: '',
      active: true
    });
    showNotification('Deduction Added', `"${newComponent.name}" configured successfully.`);
  };

  // Save Edit Form
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      showNotification('Validation Error', 'Component Name is required.');
      return;
    }

    setDeductions(prev => prev.map(d => {
      if (d.id === editForm.id) {
        return {
          ...d,
          name: editForm.name.trim(),
          code: editForm.code.trim().toUpperCase(),
          type: editForm.type,
          taxTreatment: editForm.taxTreatment,
          calculationType: editForm.calculationType,
          rateValue: Number(editForm.rateValue) || 0,
          calculationRule: editForm.calculationRule.trim(),
          monthlyCap: Number(editForm.monthlyCap) || 0,
          applicableTo: editForm.applicableTo,
          description: editForm.description.trim(),
          active: editForm.active,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return d;
    }));

    setIsEditModalOpen(false);
    showNotification('Deduction Updated', `"${editForm.name}" rules saved successfully.`);
  };

  // Toggle Active Status
  const handleToggleActive = (id: number) => {
    setDeductions(prev => prev.map(d => {
      if (d.id === id) {
        const next = !d.active;
        showNotification('Status Changed', `"${d.name}" set to ${next ? 'Active' : 'Inactive'}.`);
        return { ...d, active: next };
      }
      return d;
    }));
  };

  // Filtered Deductions
  const filteredDeductions = useMemo(() => {
    return deductions.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.calculationRule.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' || d.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [deductions, searchQuery, typeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = deductions.length;
    const statutoryCount = deductions.filter(d => d.type === 'Statutory').length;
    const preTaxCount = deductions.filter(d => d.taxTreatment === 'Pre-Tax').length;
    const postTaxCount = deductions.filter(d => d.taxTreatment === 'Post-Tax').length;
    return { total, statutoryCount, preTaxCount, postTaxCount };
  }, [deductions]);

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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Deductions</span>
            <Scale className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-0.5">Configured withholding rules</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Statutory Mandates</span>
            <ShieldCheck className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2">{stats.statutoryCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">TDS, PF, ESI, and Prof Tax</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Pre-Tax Deductions</span>
            <Percent className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{stats.preTaxCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Reduces taxable gross</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Post-Tax Withholdings</span>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">{stats.postTaxCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Net pay deductions</p>
        </div>
      </div>

      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Deductions Configuration</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage statutory income tax slabs, social security contributions, and company policy withholdings</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Deduction
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-3 items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deduction rule, name, or code..."
            className="pl-9 h-9 text-xs border-slate-200"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 font-medium">Type:</span>
          <select 
            value={typeFilter}
            onChange={(e: any) => setTypeFilter(e.target.value)}
            className="h-9 text-xs rounded-lg border border-slate-200 px-3 bg-white text-slate-700"
          >
            <option value="All">All Types</option>
            <option value="Statutory">Statutory Compliance</option>
            <option value="Policy">Company Policy</option>
            <option value="Voluntary">Voluntary Opt-In</option>
          </select>
        </div>
      </div>

      {/* Deductions Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Component Name & Code</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Tax Treatment</th>
                  <th className="px-6 py-4">Calculation Rule</th>
                  <th className="px-6 py-4">Cap Limit</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDeductions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-xs">
                      No deduction components found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDeductions.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {d.name}
                        </div>
                        <div className="text-xs text-indigo-600 font-mono mt-0.5">
                          {d.code}
                        </div>
                        {d.description && (
                          <div className="text-[11px] text-slate-400 mt-1 max-w-sm line-clamp-1">
                            {d.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${
                          d.type === 'Statutory' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          d.type === 'Policy' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>
                          {d.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          d.taxTreatment === 'Pre-Tax' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {d.taxTreatment}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-semibold text-slate-800">
                          {d.calculationRule}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {d.applicableTo}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-700">
                        {d.monthlyCap > 0 ? `$${d.monthlyCap.toLocaleString()}/mo` : 'No Cap'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(d.id)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                            d.active 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${d.active ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                          {d.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenEdit(d)}
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
      {/* ADD DEDUCTION COMPONENT MODAL                             */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-200" />
                  Add Deduction Component
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Define statutory withholdings, policy penalties, and tax classifications.
                </p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Component Name <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    required
                    placeholder="e.g. Health Insurance Surcharge"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Component Code
                  </label>
                  <Input 
                    placeholder="e.g. HEALTH_SUR"
                    value={addForm.code}
                    onChange={(e) => setAddForm({ ...addForm, code: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deduction Type
                  </label>
                  <select 
                    value={addForm.type}
                    onChange={(e: any) => setAddForm({ ...addForm, type: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Statutory">Statutory Compliance</option>
                    <option value="Policy">Company Policy</option>
                    <option value="Voluntary">Voluntary Opt-In</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tax Treatment
                  </label>
                  <select 
                    value={addForm.taxTreatment}
                    onChange={(e: any) => setAddForm({ ...addForm, taxTreatment: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Pre-Tax">Pre-Tax (Reduces Taxable Income)</option>
                    <option value="Post-Tax">Post-Tax (Deducted from Net Pay)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Calculation Type
                  </label>
                  <select 
                    value={addForm.calculationType}
                    onChange={(e: any) => setAddForm({ ...addForm, calculationType: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Percentage of Basic">Percentage of Basic (%)</option>
                    <option value="Percentage of Gross">Percentage of Gross (%)</option>
                    <option value="Fixed Monthly Amount">Fixed Monthly Amount ($)</option>
                    <option value="Slab / Progressive">Slab / Progressive Slabs</option>
                    <option value="Attendance-Based">Attendance / LOP Pro-rata</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Rate / Percentage (%)
                  </label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={addForm.rateValue}
                    onChange={(e) => setAddForm({ ...addForm, rateValue: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500 font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Calculation Rule Formula Description
                </label>
                <Input 
                  placeholder="e.g. 10% of Basic Salary capped at $1,500/mo"
                  value={addForm.calculationRule}
                  onChange={(e) => setAddForm({ ...addForm, calculationRule: e.target.value })}
                  className="border-slate-300 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Monthly Maximum Cap ($)
                  </label>
                  <Input 
                    type="number"
                    placeholder="0 for unlimited"
                    value={addForm.monthlyCap}
                    onChange={(e) => setAddForm({ ...addForm, monthlyCap: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Eligibility Group
                  </label>
                  <select 
                    value={addForm.applicableTo}
                    onChange={(e: any) => setAddForm({ ...addForm, applicableTo: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="All Employees">All Employees</option>
                    <option value="Eligible Wage Band">Eligible Wage Band</option>
                    <option value="Opt-In Only">Opt-In Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Policy Description / Compliance Reference
                </label>
                <textarea 
                  rows={2}
                  placeholder="Government statute, legal section, or corporate HR policy details..."
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Save Deduction
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT DEDUCTION COMPONENT MODAL                            */}
      {/* ========================================================= */}
      {isEditModalOpen && selectedDeduction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-300" />
                  Edit Deduction Component
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Update calculation rule, tax treatment, and monthly cap limits.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Component Name <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Component Code
                  </label>
                  <Input 
                    value={editForm.code}
                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deduction Type
                  </label>
                  <select 
                    value={editForm.type}
                    onChange={(e: any) => setEditForm({ ...editForm, type: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Statutory">Statutory Compliance</option>
                    <option value="Policy">Company Policy</option>
                    <option value="Voluntary">Voluntary Opt-In</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tax Treatment
                  </label>
                  <select 
                    value={editForm.taxTreatment}
                    onChange={(e: any) => setEditForm({ ...editForm, taxTreatment: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Pre-Tax">Pre-Tax (Reduces Taxable Income)</option>
                    <option value="Post-Tax">Post-Tax (Deducted from Net Pay)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Calculation Type
                  </label>
                  <select 
                    value={editForm.calculationType}
                    onChange={(e: any) => setEditForm({ ...editForm, calculationType: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Percentage of Basic">Percentage of Basic (%)</option>
                    <option value="Percentage of Gross">Percentage of Gross (%)</option>
                    <option value="Fixed Monthly Amount">Fixed Monthly Amount ($)</option>
                    <option value="Slab / Progressive">Slab / Progressive Slabs</option>
                    <option value="Attendance-Based">Attendance / LOP Pro-rata</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Rate / Percentage
                  </label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={editForm.rateValue}
                    onChange={(e) => setEditForm({ ...editForm, rateValue: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500 font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Calculation Rule Description
                </label>
                <Input 
                  value={editForm.calculationRule}
                  onChange={(e) => setEditForm({ ...editForm, calculationRule: e.target.value })}
                  className="border-slate-300 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Monthly Maximum Cap ($)
                  </label>
                  <Input 
                    type="number"
                    value={editForm.monthlyCap}
                    onChange={(e) => setEditForm({ ...editForm, monthlyCap: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Eligibility Group
                  </label>
                  <select 
                    value={editForm.applicableTo}
                    onChange={(e: any) => setEditForm({ ...editForm, applicableTo: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="All Employees">All Employees</option>
                    <option value="Eligible Wage Band">Eligible Wage Band</option>
                    <option value="Opt-In Only">Opt-In Only</option>
                  </select>
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
