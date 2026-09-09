import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  CheckCircle, Plus, Edit3, Trash2, X, Calculator, ShieldCheck, 
  DollarSign, Percent, ArrowRight, HelpCircle, Save, Sliders, 
  RotateCcw, Info, Calendar, FileText
} from 'lucide-react';

export interface TaxSlab {
  id: number;
  label: string;
  minIncome: number;
  maxIncome: number | null; // null represents "Above"
  ratePercent: number;
  description?: string;
}

const DEFAULT_SLABS_NEW_REGIME: TaxSlab[] = [
  { id: 1, label: 'Slab 1 (Nil Bracket)', minIncome: 0, maxIncome: 300000, ratePercent: 0, description: 'Tax-exempt foundational income threshold' },
  { id: 2, label: 'Slab 2 (Entry Bracket)', minIncome: 300001, maxIncome: 600000, ratePercent: 5, description: 'Concessional starter tax rate' },
  { id: 3, label: 'Slab 3 (Middle Bracket)', minIncome: 600001, maxIncome: 900000, ratePercent: 10, description: 'Moderate income bracket' },
  { id: 4, label: 'Slab 4 (Senior Bracket)', minIncome: 900001, maxIncome: 1200000, ratePercent: 15, description: 'Upper-middle progressive bracket' },
  { id: 5, label: 'Slab 5 (Executive Bracket)', minIncome: 1200001, maxIncome: 1500000, ratePercent: 20, description: 'Executive level compensation rate' },
  { id: 6, label: 'Slab 6 (Top Marginal Rate)', minIncome: 1500001, maxIncome: null, ratePercent: 30, description: 'Applies to all annual income exceeding $1.5M' },
];

const DEFAULT_SLABS_OLD_REGIME: TaxSlab[] = [
  { id: 1, label: 'Slab 1 (Exempt)', minIncome: 0, maxIncome: 250000, ratePercent: 0, description: 'Base exempt income' },
  { id: 2, label: 'Slab 2 (Standard)', minIncome: 250001, maxIncome: 500000, ratePercent: 5, description: 'Subject to 87A tax rebate' },
  { id: 3, label: 'Slab 3 (Middle Tier)', minIncome: 500001, maxIncome: 1000000, ratePercent: 20, description: 'Eligible for Section 80C and HRA deductions' },
  { id: 4, label: 'Slab 4 (Top Tier)', minIncome: 1000001, maxIncome: null, ratePercent: 30, description: 'Top marginal tax bracket' },
];

export function TaxManagementConfig() {
  const [activeRegime, setActiveRegime] = useState<'new' | 'old'>('new');
  const [slabs, setSlabs] = useState<TaxSlab[]>(DEFAULT_SLABS_NEW_REGIME);
  const [assessmentYear, setAssessmentYear] = useState('FY 2026-2027');
  const [standardDeduction, setStandardDeduction] = useState(50000);
  const [healthEducationCess, setHealthEducationCess] = useState(4.0);
  const [taxRebateLimit, setTaxRebateLimit] = useState(700000);

  // Test simulation calculator
  const [testGrossIncome, setTestGrossIncome] = useState(950000);

  // Modals & Editing
  const [isAddSlabModalOpen, setIsAddSlabModalOpen] = useState(false);
  const [editingSlab, setEditingSlab] = useState<TaxSlab | null>(null);

  // New Slab Form
  const [slabForm, setSlabForm] = useState({
    label: '',
    minIncome: 0,
    maxIncome: '' as string,
    ratePercent: 10,
    description: ''
  });

  // Toast
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showNotification = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Switch Regime
  const handleRegimeChange = (regime: 'new' | 'old') => {
    setActiveRegime(regime);
    if (regime === 'new') {
      setSlabs(DEFAULT_SLABS_NEW_REGIME);
      setStandardDeduction(50000);
      setTaxRebateLimit(700000);
    } else {
      setSlabs(DEFAULT_SLABS_OLD_REGIME);
      setStandardDeduction(50000);
      setTaxRebateLimit(500000);
    }
    showNotification('Tax Regime Switched', `Active slabs updated to ${regime === 'new' ? 'Default New Tax Regime' : 'Old Tax Regime (Exemptions Enabled)'}.`);
  };

  // Real-time tax simulator calculation
  const simulation = useMemo(() => {
    const gross = Math.max(0, Number(testGrossIncome) || 0);
    const taxable = Math.max(0, gross - standardDeduction);

    let tax = 0;
    const slabBreakdown: { slab: string; taxableAmount: number; rate: number; taxDue: number }[] = [];

    // Progressive calculation
    for (const s of slabs) {
      if (taxable > s.minIncome) {
        const slabTop = s.maxIncome != null ? s.maxIncome : taxable;
        const taxableInSlab = Math.min(taxable, slabTop) - s.minIncome;
        if (taxableInSlab > 0) {
          const due = (taxableInSlab * s.ratePercent) / 100;
          tax += due;
          slabBreakdown.push({
            slab: s.label,
            taxableAmount: taxableInSlab,
            rate: s.ratePercent,
            taxDue: due
          });
        }
      }
    }

    // Apply rebate if eligible
    const rebateApplied = taxable <= taxRebateLimit;
    const effectiveTaxBeforeCess = rebateApplied ? 0 : tax;
    const cessAmount = (effectiveTaxBeforeCess * healthEducationCess) / 100;
    const totalTaxAnnual = Math.round(effectiveTaxBeforeCess + cessAmount);
    const monthlyTds = Math.round(totalTaxAnnual / 12);

    return {
      gross,
      taxable,
      baseTax: tax,
      rebateApplied,
      cessAmount,
      totalTaxAnnual,
      monthlyTds,
      effectiveRate: gross > 0 ? ((totalTaxAnnual / gross) * 100).toFixed(1) : '0.0',
      slabBreakdown
    };
  }, [testGrossIncome, standardDeduction, slabs, healthEducationCess, taxRebateLimit]);

  // Save Slab Changes to State
  const handleSaveSlabForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slabForm.label.trim()) {
      showNotification('Missing Field', 'Please provide a bracket label.');
      return;
    }

    const min = Number(slabForm.minIncome) || 0;
    const max = slabForm.maxIncome.trim() === '' ? null : Number(slabForm.maxIncome);
    const rate = Number(slabForm.ratePercent) || 0;

    if (editingSlab) {
      setSlabs(prev => prev.map(s => {
        if (s.id === editingSlab.id) {
          return {
            ...s,
            label: slabForm.label.trim(),
            minIncome: min,
            maxIncome: max,
            ratePercent: rate,
            description: slabForm.description.trim()
          };
        }
        return s;
      }));
      setEditingSlab(null);
      showNotification('Slab Updated', `"${slabForm.label}" updated successfully.`);
    } else {
      const newSlab: TaxSlab = {
        id: Date.now(),
        label: slabForm.label.trim(),
        minIncome: min,
        maxIncome: max,
        ratePercent: rate,
        description: slabForm.description.trim()
      };
      setSlabs(prev => [...prev, newSlab].sort((a, b) => a.minIncome - b.minIncome));
      showNotification('New Slab Added', `"${newSlab.label}" added to progressive tax table.`);
    }

    setIsAddSlabModalOpen(false);
  };

  // Open Edit Slab
  const handleOpenEditSlab = (slab: TaxSlab) => {
    setEditingSlab(slab);
    setSlabForm({
      label: slab.label,
      minIncome: slab.minIncome,
      maxIncome: slab.maxIncome != null ? String(slab.maxIncome) : '',
      ratePercent: slab.ratePercent,
      description: slab.description || ''
    });
    setIsAddSlabModalOpen(true);
  };

  // Delete Slab
  const handleDeleteSlab = (id: number, label: string) => {
    if (slabs.length <= 2) {
      showNotification('Cannot Delete', 'At least 2 tax brackets are required.');
      return;
    }
    setSlabs(prev => prev.filter(s => s.id !== id));
    showNotification('Slab Removed', `"${label}" has been removed.`);
  };

  // Global Save Changes Handler
  const handleGlobalSave = () => {
    showNotification('Settings Saved', `Tax slabs and parameters saved for ${assessmentYear}. Configured for 312 active employees.`);
  };

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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessment Year</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">{assessmentYear}</p>
          <p className="text-xs text-slate-400 mt-0.5">Active statutory tax cycle</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Standard Deduction</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-700 mt-2">${standardDeduction.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Applied to all salary earners</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Tax Brackets</span>
            <Sliders className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold text-purple-700 mt-2">{slabs.length} Slabs Active</p>
          <p className="text-xs text-slate-400 mt-0.5">Top Marginal Rate: 30%</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Covered Headcount</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-indigo-700 mt-2">312 Employees</p>
          <p className="text-xs text-slate-400 mt-0.5">Auto-computed TDS deduction</p>
        </div>
      </div>

      {/* Header and Regime Selector */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tax Management & Slabs</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              {activeRegime === 'new' ? 'New Tax Regime (Default)' : 'Old Tax Regime'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure progressive income tax brackets, statutory cess rates, and standard deductions for monthly TDS withholdings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => handleRegimeChange('new')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeRegime === 'new' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Regime
            </button>
            <button
              onClick={() => handleRegimeChange('old')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeRegime === 'old' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Old Regime
            </button>
          </div>

          <Button 
            onClick={handleGlobalSave} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* General Statutory Configuration Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Assessment Year
          </label>
          <Input 
            value={assessmentYear}
            onChange={(e) => setAssessmentYear(e.target.value)}
            className="h-9 text-xs border-slate-300 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Standard Deduction ($)
          </label>
          <Input 
            type="number"
            value={standardDeduction}
            onChange={(e) => setStandardDeduction(Number(e.target.value))}
            className="h-9 text-xs border-slate-300 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Health & Education Cess (%)
          </label>
          <Input 
            type="number"
            step="0.1"
            value={healthEducationCess}
            onChange={(e) => setHealthEducationCess(Number(e.target.value))}
            className="h-9 text-xs border-slate-300 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Rebate Threshold 87A ($)
          </label>
          <Input 
            type="number"
            value={taxRebateLimit}
            onChange={(e) => setTaxRebateLimit(Number(e.target.value))}
            className="h-9 text-xs border-slate-300 font-semibold"
          />
        </div>
      </div>

      {/* Progressive Tax Slabs Table & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Slabs Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Progressive Income Tax Slabs</h3>
              <p className="text-xs text-slate-500">Income segments taxed incrementally at progressive marginal rates</p>
            </div>
            <Button 
              size="sm"
              onClick={() => {
                setEditingSlab(null);
                setSlabForm({ label: '', minIncome: 0, maxIncome: '', ratePercent: 10, description: '' });
                setIsAddSlabModalOpen(true);
              }}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Bracket
            </Button>
          </div>

          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Bracket / Slab</th>
                      <th className="px-5 py-3.5">Income Range ($)</th>
                      <th className="px-5 py-3.5">Tax Rate (%)</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {slabs.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-900">{s.label}</div>
                          {s.description && (
                            <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{s.description}</div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-800 text-xs">
                          {s.maxIncome != null ? (
                            <span>${s.minIncome.toLocaleString()} — ${s.maxIncome.toLocaleString()}</span>
                          ) : (
                            <span className="font-semibold text-indigo-700">Above ${s.minIncome.toLocaleString()}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            s.ratePercent === 0 
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.ratePercent >= 20
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {s.ratePercent}%
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleOpenEditSlab(s)}
                              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs font-semibold px-2.5"
                            >
                              <Edit3 className="w-3.5 h-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSlab(s.id, s.label)}
                              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2"
                              title="Delete slab"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Interactive Tax Simulator */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-indigo-600" />
            Live TDS Tax Simulator
          </h3>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg space-y-4 border border-indigo-900">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Sample Employee Gross Annual CTC ($)
              </label>
              <Input 
                type="number"
                step="10000"
                value={testGrossIncome}
                onChange={(e) => setTestGrossIncome(Number(e.target.value))}
                className="bg-white/10 border-white/20 text-white placeholder-white/40 text-lg font-bold"
              />
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-white/10">
              <div className="flex justify-between text-slate-300">
                <span>Gross Annual Salary:</span>
                <span className="font-semibold text-white">${simulation.gross.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Standard Deduction:</span>
                <span className="font-semibold text-emerald-400">-${standardDeduction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300 font-bold">
                <span>Net Taxable Income:</span>
                <span className="text-white">${simulation.taxable.toLocaleString()}</span>
              </div>
            </div>

            {/* Slabs breakdown details */}
            <div className="bg-white/5 rounded-xl p-3 text-[11px] space-y-1 border border-white/10">
              <span className="font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                Incremental Slabs Applied:
              </span>
              {simulation.slabBreakdown.map((b, idx) => (
                <div key={idx} className="flex justify-between text-slate-300">
                  <span>{b.slab} ({b.rate}% on ${b.taxableAmount.toLocaleString()}):</span>
                  <span className="font-medium text-white">${Math.round(b.taxDue).toLocaleString()}</span>
                </div>
              ))}
              {simulation.rebateApplied && (
                <div className="text-emerald-300 font-semibold pt-1">
                  ✓ 100% Tax Rebate Applied (Income &lt;= ${taxRebateLimit.toLocaleString()})
                </div>
              )}
            </div>

            {/* Final Outcome */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-200 font-medium">Monthly TDS Payroll Withholding</span>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">
                  ${simulation.monthlyTds.toLocaleString()}
                  <span className="text-xs text-slate-400 font-normal"> / month</span>
                </p>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400">Total Tax / Year:</span>
                <p className="font-bold text-white">${simulation.totalTaxAnnual.toLocaleString()}</p>
                <span className="text-[11px] text-slate-400">Effective: {simulation.effectiveRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ADD / EDIT TAX SLAB MODAL                                 */}
      {/* ========================================================= */}
      {isAddSlabModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-200" />
                  {editingSlab ? 'Edit Tax Slab Bracket' : 'Add Progressive Tax Bracket'}
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Define annual threshold boundaries and marginal tax percentage.
                </p>
              </div>
              <button 
                onClick={() => setIsAddSlabModalOpen(false)}
                className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlabForm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bracket Label <span className="text-rose-500">*</span>
                </label>
                <Input 
                  required
                  placeholder="e.g. Slab 7 (High Net Worth Bracket)"
                  value={slabForm.label}
                  onChange={(e) => setSlabForm({ ...slabForm, label: e.target.value })}
                  className="border-slate-300 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Minimum Income ($) <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={slabForm.minIncome}
                    onChange={(e) => setSlabForm({ ...slabForm, minIncome: Number(e.target.value) })}
                    className="border-slate-300 focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Maximum Income ($)
                  </label>
                  <Input 
                    type="number"
                    placeholder="Leave blank for Above"
                    value={slabForm.maxIncome}
                    onChange={(e) => setSlabForm({ ...slabForm, maxIncome: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500 font-semibold"
                  />
                  <span className="text-[11px] text-slate-400">Empty means no upper ceiling</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tax Rate (%) <span className="text-rose-500">*</span>
                </label>
                <Input 
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  required
                  value={slabForm.ratePercent}
                  onChange={(e) => setSlabForm({ ...slabForm, ratePercent: Number(e.target.value) })}
                  className="border-slate-300 focus:border-indigo-500 font-bold text-slate-800 text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bracket Description / Guidance
                </label>
                <textarea 
                  rows={2}
                  placeholder="Notes on exemptions, applicable surcharge, or tax laws..."
                  value={slabForm.description}
                  onChange={(e) => setSlabForm({ ...slabForm, description: e.target.value })}
                  className="w-full text-sm rounded-md border border-slate-300 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddSlabModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  {editingSlab ? 'Save Bracket' : 'Add Bracket'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
