import React, { useState } from 'react';
import { X, Award, AlertCircle } from 'lucide-react';
import { PayGrade } from '../types/compensation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PayGrade>) => Promise<void>;
  initialData?: PayGrade | null;
}

export const PayGradeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<PayGrade>>(
    initialData || {
      code: '',
      name: '',
      level: 1,
      minimumSalary: 50000,
      midpointSalary: 65000,
      maximumSalary: 80000,
      currency: 'USD',
      description: ''
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const min = formData.minimumSalary || 0;
  const max = formData.maximumSalary || 0;
  const spread = min > 0 ? (((max - min) / min) * 100).toFixed(1) : '0';

  const handleMinChange = (val: number) => {
    const newMid = Math.round((val + (formData.maximumSalary || 0)) / 2);
    setFormData({ ...formData, minimumSalary: val, midpointSalary: newMid });
  };

  const handleMaxChange = (val: number) => {
    const newMid = Math.round(((formData.minimumSalary || 0) + val) / 2);
    setFormData({ ...formData, maximumSalary: val, midpointSalary: newMid });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      setError('Grade Code and Name are required.');
      return;
    }
    if ((formData.minimumSalary || 0) >= (formData.maximumSalary || 0)) {
      setError('Minimum salary must be less than Maximum salary.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save pay grade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl shadow-slate-950/80 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData ? 'Edit Pay Grade' : 'Define New Pay Grade'}
              </h3>
              <p className="text-xs text-slate-400">
                Establish salary band boundaries and market reference midpoints
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
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Grade Code *
              </label>
              <input
                type="text"
                required
                disabled={!!initialData}
                placeholder="e.g. G4, MGR"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Grade Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Staff Engineer"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Hierarchical Level (1 - 10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.level || 1}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Currency
              </label>
              <input
                type="text"
                value={formData.currency || 'USD'}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Grade Salary Band (Annual)</span>
              <span className="text-xs text-purple-400 font-mono">Spread: {spread}%</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Minimum</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.minimumSalary || 0}
                    onChange={(e) => handleMinChange(parseFloat(e.target.value) || 0)}
                    className="w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Midpoint (P50)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={formData.midpointSalary || 0}
                    onChange={(e) => setFormData({ ...formData, midpointSalary: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-indigo-500/50 rounded-lg text-indigo-300 font-mono text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Maximum</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.maximumSalary || 0}
                    onChange={(e) => handleMaxChange(parseFloat(e.target.value) || 0)}
                    className="w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                  />
                </div>
              </div>
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
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : initialData ? 'Update Grade' : 'Create Pay Grade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
