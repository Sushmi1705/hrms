import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';
import { BenefitPlan } from '../types/compensation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<BenefitPlan>) => Promise<void>;
  initialData?: BenefitPlan | null;
}

export const BenefitPlanModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<BenefitPlan>>(
    initialData || {
      planCode: '',
      planName: '',
      type: 'MedicalInsurance',
      provider: '',
      policyNumber: '',
      coverageAmount: 1000000,
      employeeMonthlyCost: 150,
      employerMonthlyCost: 550,
      contributionType: 'FixedAmount',
      allowsDependents: true,
      isActive: true
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalMonthlyCost = (formData.employeeMonthlyCost || 0) + (formData.employerMonthlyCost || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.planCode || !formData.planName || !formData.provider) {
      setError('Plan Code, Plan Name, and Provider are required.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save benefit plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl shadow-slate-950/80 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData ? 'Edit Benefit Plan' : 'Add Corporate Benefit Plan'}
              </h3>
              <p className="text-xs text-slate-400">Health, life, dental, vision, and retirement offerings</p>
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
                Plan Code *
              </label>
              <input
                type="text"
                required
                disabled={!!initialData}
                placeholder="e.g. MED-PPO-PREM"
                value={formData.planCode || ''}
                onChange={(e) => setFormData({ ...formData, planCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Plan Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BlueCross Premier Health PPO"
                value={formData.planName || ''}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Plan Category
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="MedicalInsurance">Medical Health Insurance</option>
                <option value="Dental">Dental Care Network</option>
                <option value="Vision">Vision Care & Eyewear</option>
                <option value="Retirement">401(k) / Pension Retirement</option>
                <option value="LifeInsurance">Group Term Life Insurance</option>
                <option value="Disability">Short/Long-Term Disability</option>
                <option value="Wellness">Health & Fitness Wellness</option>
                <option value="Transport">Pre-Tax Commuter Transit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Provider Carrier *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BlueCross, Delta Dental, Fidelity"
                value={formData.provider || ''}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Master Policy Number
              </label>
              <input
                type="text"
                placeholder="e.g. POL-2026-BCBS-01"
                value={formData.policyNumber || ''}
                onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Coverage Cap / Limit ($)
              </label>
              <input
                type="number"
                min="0"
                step="50000"
                value={formData.coverageAmount || 0}
                onChange={(e) => setFormData({ ...formData, coverageAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>

          {/* Premium Contribution Shares */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Monthly Contribution Rates (Base Tier)</span>
              <span className="text-xs font-mono text-teal-400">
                Total Premium: ${totalMonthlyCost}/mo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Employee Monthly Share ($)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={formData.employeeMonthlyCost || 0}
                    onChange={(e) => setFormData({ ...formData, employeeMonthlyCost: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Employer Subsidy Share ($)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={formData.employerMonthlyCost || 0}
                    onChange={(e) => setFormData({ ...formData, employerMonthlyCost: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-teal-500/40 rounded-lg text-teal-300 font-mono text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.allowsDependents}
              onChange={(e) => setFormData({ ...formData, allowsDependents: e.target.checked })}
              className="rounded border-slate-700 text-teal-500 focus:ring-teal-500 bg-slate-800"
            />
            <span className="text-xs text-slate-300">
              Permit Family & Spouse Dependent Enrollment
            </span>
          </label>

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
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-xl shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : initialData ? 'Update Plan' : 'Create Benefit Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
