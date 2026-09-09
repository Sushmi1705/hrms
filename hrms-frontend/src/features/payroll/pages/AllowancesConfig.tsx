import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Plus, CheckCircle, Edit3, X, DollarSign, Gift, 
  ShieldCheck, Search, Filter, Percent, Check, HelpCircle
} from 'lucide-react';

export interface AllowanceComponent {
  id: number;
  name: string;
  code: string;
  type: 'Fixed' | 'Variable' | 'One-Time';
  calculationMethod: 'Percentage of Basic' | 'Fixed Monthly Amount' | 'Performance-Based' | 'Attendance-Based';
  defaultAmount: number;
  taxExempt: 'Full' | 'Partial' | 'None';
  exemptionSection: string;
  applicableTo: 'All Employees' | 'Executive & Management' | 'Sales Cohort' | 'Shift Workers';
  active: boolean;
  description?: string;
  lastUpdated?: string;
}

const INITIAL_ALLOWANCES: AllowanceComponent[] = [
  { 
    id: 1, 
    name: 'House Rent Allowance (HRA)', 
    code: 'HRA',
    type: 'Fixed', 
    calculationMethod: 'Percentage of Basic',
    defaultAmount: 40,
    taxExempt: 'Partial',
    exemptionSection: 'Section 10(13A) - Rent paid minus 10% basic',
    applicableTo: 'All Employees',
    active: true,
    description: 'Provides tax-advantaged housing assistance based on metro / non-metro residence.',
    lastUpdated: '2026-08-15'
  },
  { 
    id: 2, 
    name: 'Transport Allowance', 
    code: 'TRANS',
    type: 'Fixed', 
    calculationMethod: 'Fixed Monthly Amount',
    defaultAmount: 250,
    taxExempt: 'Full',
    exemptionSection: 'Standard Conveyance Exemption',
    applicableTo: 'All Employees',
    active: true,
    description: 'Fixed monthly commuter stipend for corporate office and field travel.',
    lastUpdated: '2026-08-18'
  },
  { 
    id: 3, 
    name: 'Performance Bonus', 
    code: 'PERF_BONUS',
    type: 'Variable', 
    calculationMethod: 'Performance-Based',
    defaultAmount: 15,
    taxExempt: 'None',
    exemptionSection: 'Fully Taxable Supplemental Wage',
    applicableTo: 'Executive & Management',
    active: true,
    description: 'Quarterly and annual merit incentives tied to corporate OKR achievements.',
    lastUpdated: '2026-08-20'
  },
  { 
    id: 4, 
    name: 'Medical / Health Allowance', 
    code: 'MED_ALLOW',
    type: 'Fixed', 
    calculationMethod: 'Fixed Monthly Amount',
    defaultAmount: 150,
    taxExempt: 'Partial',
    exemptionSection: 'Medical Reimbursement Exemption',
    applicableTo: 'All Employees',
    active: true,
    description: 'Monthly medical subsidy covering routine outpatient prescriptions and wellness.',
    lastUpdated: '2026-08-12'
  },
  { 
    id: 5, 
    name: 'Shift Night Differential', 
    code: 'SHIFT_DIFF',
    type: 'Variable', 
    calculationMethod: 'Attendance-Based',
    defaultAmount: 35,
    taxExempt: 'None',
    exemptionSection: 'Fully Taxable Premium Rate',
    applicableTo: 'Shift Workers',
    active: true,
    description: 'Night shift premium disbursed per eligible roster rotation completed.',
    lastUpdated: '2026-08-22'
  }
];

export function AllowancesConfig() {
  const [allowances, setAllowances] = useState<AllowanceComponent[]>(INITIAL_ALLOWANCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Fixed' | 'Variable' | 'One-Time'>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAllowance, setSelectedAllowance] = useState<AllowanceComponent | null>(null);

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
    type: 'Fixed' as AllowanceComponent['type'],
    calculationMethod: 'Fixed Monthly Amount' as AllowanceComponent['calculationMethod'],
    defaultAmount: 100,
    taxExempt: 'Partial' as AllowanceComponent['taxExempt'],
    exemptionSection: 'Standard Exemption',
    applicableTo: 'All Employees' as AllowanceComponent['applicableTo'],
    description: '',
    active: true
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    id: 0,
    name: '',
    code: '',
    type: 'Fixed' as AllowanceComponent['type'],
    calculationMethod: 'Fixed Monthly Amount' as AllowanceComponent['calculationMethod'],
    defaultAmount: 100,
    taxExempt: 'Partial' as AllowanceComponent['taxExempt'],
    exemptionSection: '',
    applicableTo: 'All Employees' as AllowanceComponent['applicableTo'],
    description: '',
    active: true
  });

  // Open Edit Modal
  const handleOpenEdit = (allowance: AllowanceComponent) => {
    setSelectedAllowance(allowance);
    setEditForm({
      id: allowance.id,
      name: allowance.name,
      code: allowance.code,
      type: allowance.type,
      calculationMethod: allowance.calculationMethod,
      defaultAmount: allowance.defaultAmount,
      taxExempt: allowance.taxExempt,
      exemptionSection: allowance.exemptionSection,
      applicableTo: allowance.applicableTo,
      description: allowance.description || '',
      active: allowance.active
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

    const newComponent: AllowanceComponent = {
      id: Date.now(),
      name: addForm.name.trim(),
      code: addForm.code.trim().toUpperCase() || `ALW_${Math.floor(100 + Math.random() * 900)}`,
      type: addForm.type,
      calculationMethod: addForm.calculationMethod,
      defaultAmount: Number(addForm.defaultAmount) || 0,
      taxExempt: addForm.taxExempt,
      exemptionSection: addForm.exemptionSection.trim() || 'General Exemption',
      applicableTo: addForm.applicableTo,
      description: addForm.description.trim(),
      active: addForm.active,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setAllowances(prev => [newComponent, ...prev]);
    setIsAddModalOpen(false);
    setAddForm({
      name: '',
      code: '',
      type: 'Fixed',
      calculationMethod: 'Fixed Monthly Amount',
      defaultAmount: 100,
      taxExempt: 'Partial',
      exemptionSection: 'Standard Exemption',
      applicableTo: 'All Employees',
      description: '',
      active: true
    });
    showNotification('Allowance Added', `"${newComponent.name}" added to compensation components.`);
  };

  // Save Edit Form
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      showNotification('Validation Error', 'Component Name is required.');
      return;
    }

    setAllowances(prev => prev.map(a => {
      if (a.id === editForm.id) {
        return {
          ...a,
          name: editForm.name.trim(),
          code: editForm.code.trim().toUpperCase(),
          type: editForm.type,
          calculationMethod: editForm.calculationMethod,
          defaultAmount: Number(editForm.defaultAmount) || 0,
          taxExempt: editForm.taxExempt,
          exemptionSection: editForm.exemptionSection.trim(),
          applicableTo: editForm.applicableTo,
          description: editForm.description.trim(),
          active: editForm.active,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    }));

    setIsEditModalOpen(false);
    showNotification('Allowance Updated', `"${editForm.name}" configuration saved successfully.`);
  };

  // Toggle Active Status
  const handleToggleActive = (id: number) => {
    setAllowances(prev => prev.map(a => {
      if (a.id === id) {
        const next = !a.active;
        showNotification('Status Changed', `"${a.name}" set to ${next ? 'Active' : 'Inactive'}.`);
        return { ...a, active: next };
      }
      return a;
    }));
  };

  // Filtered Allowances
  const filteredAllowances = useMemo(() => {
    return allowances.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.exemptionSection.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' || a.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [allowances, searchQuery, typeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = allowances.length;
    const fixedCount = allowances.filter(a => a.type === 'Fixed').length;
    const variableCount = allowances.filter(a => a.type === 'Variable').length;
    const exemptCount = allowances.filter(a => a.taxExempt !== 'None').length;
    return { total, fixedCount, variableCount, exemptCount };
  }, [allowances]);

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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Components</span>
            <Gift className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-0.5">Allowances & bonuses</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Fixed Monthly</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{stats.fixedCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Recurring pay components</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Variable & Merit</span>
            <Percent className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-2">{stats.variableCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Performance & overtime</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Tax Exempted</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">{stats.exemptCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Full or partial exemption</p>
        </div>
      </div>

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Allowances & Bonuses</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage recurring employee allowances, performance bonuses, and tax exemption clauses</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Allowance
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-3 items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search allowance name, code, or section..."
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
            <option value="Fixed">Fixed Allowances</option>
            <option value="Variable">Variable Bonuses</option>
            <option value="One-Time">One-Time Disbursements</option>
          </select>
        </div>
      </div>

      {/* Allowances Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Component Name & Code</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Calculation Formula</th>
                  <th className="px-6 py-4">Tax Exemption</th>
                  <th className="px-6 py-4">Eligibility</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAllowances.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-xs">
                      No allowance components found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredAllowances.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {a.name}
                        </div>
                        <div className="text-xs text-indigo-600 font-mono mt-0.5">
                          {a.code}
                        </div>
                        {a.description && (
                          <div className="text-[11px] text-slate-400 mt-1 max-w-sm line-clamp-1">
                            {a.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${
                          a.type === 'Fixed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          a.type === 'Variable' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                          'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {a.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-800 font-semibold">
                          {a.calculationMethod === 'Percentage of Basic' 
                            ? `${a.defaultAmount}% of Basic Pay`
                            : a.calculationMethod === 'Fixed Monthly Amount'
                            ? `$${a.defaultAmount.toLocaleString()}/month`
                            : a.calculationMethod === 'Performance-Based'
                            ? `${a.defaultAmount}% Target Matrix`
                            : `$${a.defaultAmount}/shift`}
                        </div>
                        <div className="text-[11px] text-slate-400">{a.calculationMethod}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                            a.taxExempt === 'Full' ? 'bg-emerald-100 text-emerald-800' :
                            a.taxExempt === 'Partial' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {a.taxExempt} Exemption
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs" title={a.exemptionSection}>
                          {a.exemptionSection}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                        {a.applicableTo}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(a.id)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                            a.active 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${a.active ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                          {a.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenEdit(a)}
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
      {/* ADD ALLOWANCE COMPONENT MODAL                             */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-200" />
                  Add Compensation Allowance
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Define new pay components, computation formulas, and tax exemption status.
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
                    placeholder="e.g. Remote Work Stipend"
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
                    placeholder="e.g. REMOTE_STIPEND"
                    value={addForm.code}
                    onChange={(e) => setAddForm({ ...addForm, code: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Allowance Type
                  </label>
                  <select 
                    value={addForm.type}
                    onChange={(e: any) => setAddForm({ ...addForm, type: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Fixed">Fixed Recurring</option>
                    <option value="Variable">Variable (Merit / Bonus)</option>
                    <option value="One-Time">One-Time Disbursement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Calculation Method
                  </label>
                  <select 
                    value={addForm.calculationMethod}
                    onChange={(e: any) => setAddForm({ ...addForm, calculationMethod: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Fixed Monthly Amount">Fixed Monthly Amount ($)</option>
                    <option value="Percentage of Basic">Percentage of Basic (%)</option>
                    <option value="Performance-Based">Performance Matrix Target (%)</option>
                    <option value="Attendance-Based">Per Shift / Attendance ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Default Rate / Value <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    min="1"
                    required
                    value={addForm.defaultAmount}
                    onChange={(e) => setAddForm({ ...addForm, defaultAmount: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500 font-bold text-slate-800"
                  />
                  <span className="text-[11px] text-slate-400">
                    {addForm.calculationMethod === 'Percentage of Basic' || addForm.calculationMethod === 'Performance-Based' ? 'Percentage %' : 'Amount in USD ($)'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tax Exemption
                  </label>
                  <select 
                    value={addForm.taxExempt}
                    onChange={(e: any) => setAddForm({ ...addForm, taxExempt: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Partial">Partial Exemption</option>
                    <option value="Full">Fully Tax Exempt</option>
                    <option value="None">None (Fully Taxable)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Exemption Statutory Section
                  </label>
                  <Input 
                    placeholder="e.g. Section 10(14) or Standard Rule"
                    value={addForm.exemptionSection}
                    onChange={(e) => setAddForm({ ...addForm, exemptionSection: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Eligibility
                  </label>
                  <select 
                    value={addForm.applicableTo}
                    onChange={(e: any) => setAddForm({ ...addForm, applicableTo: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="All Employees">All Employees</option>
                    <option value="Executive & Management">Executive & Management</option>
                    <option value="Sales Cohort">Sales Cohort</option>
                    <option value="Shift Workers">Shift Workers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Policy Description / Notes
                </label>
                <textarea 
                  rows={2}
                  placeholder="Eligibility conditions, payout cycle rules, or required proof receipts..."
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
                  Save Component
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT ALLOWANCE COMPONENT MODAL                            */}
      {/* ========================================================= */}
      {isEditModalOpen && selectedAllowance && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-300" />
                  Edit Allowance Component
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Update calculation rule, tax exemption category, and eligibility parameters.
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
                    Allowance Type
                  </label>
                  <select 
                    value={editForm.type}
                    onChange={(e: any) => setEditForm({ ...editForm, type: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Fixed">Fixed Recurring</option>
                    <option value="Variable">Variable (Merit / Bonus)</option>
                    <option value="One-Time">One-Time Disbursement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Calculation Method
                  </label>
                  <select 
                    value={editForm.calculationMethod}
                    onChange={(e: any) => setEditForm({ ...editForm, calculationMethod: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Fixed Monthly Amount">Fixed Monthly Amount ($)</option>
                    <option value="Percentage of Basic">Percentage of Basic (%)</option>
                    <option value="Performance-Based">Performance Matrix Target (%)</option>
                    <option value="Attendance-Based">Per Shift / Attendance ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Default Rate / Value <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    min="1"
                    required
                    value={editForm.defaultAmount}
                    onChange={(e) => setEditForm({ ...editForm, defaultAmount: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500 font-bold text-slate-800"
                  />
                  <span className="text-[11px] text-slate-400">
                    {editForm.calculationMethod === 'Percentage of Basic' || editForm.calculationMethod === 'Performance-Based' ? 'Percentage %' : 'Amount in USD ($)'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tax Exemption
                  </label>
                  <select 
                    value={editForm.taxExempt}
                    onChange={(e: any) => setEditForm({ ...editForm, taxExempt: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Partial">Partial Exemption</option>
                    <option value="Full">Fully Tax Exempt</option>
                    <option value="None">None (Fully Taxable)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Exemption Statutory Section
                  </label>
                  <Input 
                    value={editForm.exemptionSection}
                    onChange={(e) => setEditForm({ ...editForm, exemptionSection: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Eligibility
                  </label>
                  <select 
                    value={editForm.applicableTo}
                    onChange={(e: any) => setEditForm({ ...editForm, applicableTo: e.target.value })}
                    className="w-full text-sm rounded-md border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="All Employees">All Employees</option>
                    <option value="Executive & Management">Executive & Management</option>
                    <option value="Sales Cohort">Sales Cohort</option>
                    <option value="Shift Workers">Shift Workers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Policy Description / Notes
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
