import React, { useState } from 'react';
import { X, Check, DollarSign, Percent, Layers, AlertCircle } from 'lucide-react';
import { CompensationComponent } from '../types/compensation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CompensationComponent>) => Promise<void>;
  initialData?: CompensationComponent | null;
}

export const SalaryComponentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<CompensationComponent>>(
    initialData || {
      code: '',
      name: '',
      description: '',
      type: 'Earnings',
      calculationType: 'FixedAmount',
      defaultValue: 0,
      percentage: 0,
      isTaxable: true,
      isPensionable: false,
      isRecurring: true,
      isActive: true
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      setError('Component Code and Name are required.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save component');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl shadow-slate-950/80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData ? 'Edit Salary Component' : 'Define Salary Component'}
              </h3>
              <p className="text-xs text-slate-400">
                Configure earnings, allowances, deductions, and contribution rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Component Code *
              </label>
              <input
                type="text"
                required
                disabled={!!initialData}
                placeholder="e.g. HRA, TRANS, MEAL"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Component Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Housing Allowance"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Operational and statutory notes..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Classification Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="Earnings">Earnings / Allowance</option>
                <option value="Deduction">Deduction</option>
                <option value="EmployerContribution">Employer Contribution</option>
                <option value="EmployeeContribution">Employee Contribution</option>
                <option value="Benefit">Fringe Benefit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Calculation Model
              </label>
              <select
                value={formData.calculationType}
                onChange={(e) => setFormData({ ...formData, calculationType: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="FixedAmount">Fixed Amount ($)</option>
                <option value="Percentage">Percentage (%) of Base</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {formData.calculationType === 'FixedAmount' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Default Value ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.defaultValue || 0}
                    onChange={(e) => setFormData({ ...formData, defaultValue: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Percentage (%)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400">%</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.percentage || 0}
                    onChange={(e) => setFormData({ ...formData, percentage: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isTaxable}
                  onChange={(e) => setFormData({ ...formData, isTaxable: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 bg-slate-800"
                />
                <span className="text-xs text-slate-300">Subject to Income Tax</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPensionable}
                  onChange={(e) => setFormData({ ...formData, isPensionable: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 bg-slate-800"
                />
                <span className="text-xs text-slate-300">Pensionable / 401(k) Eligible</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : initialData ? 'Update Component' : 'Create Component'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
