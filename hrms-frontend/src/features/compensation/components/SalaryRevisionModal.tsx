import React, { useState } from 'react';
import { X, TrendingUp, AlertCircle, Calculator } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    employeeId: string;
    proposedSalary: number;
    effectiveDate: string;
    reason: string;
    comments?: string;
  }) => Promise<void>;
  employees: Array<{ id: string; name: string; employeeNumber: string; currentSalary?: number }>;
  defaultEmployeeId?: string;
  defaultCurrentSalary?: number;
}

export const SalaryRevisionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  employees,
  defaultEmployeeId,
  defaultCurrentSalary
}) => {
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId || '');
  const [currentSalary, setCurrentSalary] = useState<number>(defaultCurrentSalary || 85000);
  const [percentageIncrease, setPercentageIncrease] = useState<number>(5.0);
  const [proposedSalary, setProposedSalary] = useState<number>(
    Math.round((defaultCurrentSalary || 85000) * 1.05)
  );
  const [effectiveDate, setEffectiveDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [reason, setReason] = useState('MeritIncrease');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmployeeChange = (empId: string) => {
    setEmployeeId(empId);
    const emp = employees.find((e) => e.id === empId);
    if (emp && emp.currentSalary) {
      setCurrentSalary(emp.currentSalary);
      const newProp = Math.round(emp.currentSalary * (1 + percentageIncrease / 100));
      setProposedSalary(newProp);
    }
  };

  const handlePercentChange = (pct: number) => {
    setPercentageIncrease(pct);
    const newProp = Math.round(currentSalary * (1 + pct / 100));
    setProposedSalary(newProp);
  };

  const handleProposedSalaryChange = (prop: number) => {
    setProposedSalary(prop);
    if (currentSalary > 0) {
      const pct = Math.round(((prop - currentSalary) / currentSalary) * 1000) / 10;
      setPercentageIncrease(pct);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) {
      setError('Please select an employee.');
      return;
    }
    if (proposedSalary <= 0) {
      setError('Proposed salary must be greater than zero.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        employeeId,
        proposedSalary,
        effectiveDate,
        reason,
        comments
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit revision request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl shadow-slate-950/80 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Request Salary Revision</h3>
              <p className="text-xs text-slate-400">
                Submit compensation adjustment to approval workflow engine
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
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Select Employee *
            </label>
            <select
              value={employeeId}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Current Salary
              </span>
              <p className="text-lg font-bold font-mono text-slate-300 mt-1">
                ${currentSalary.toLocaleString()}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Increase Amount
              </span>
              <p className="text-lg font-bold font-mono text-emerald-400 mt-1">
                +${Math.max(0, proposedSalary - currentSalary).toLocaleString()} ({percentageIncrease}%)
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Proposed Increase %
              </label>
              <span className="text-xs font-mono font-bold text-blue-400">+{percentageIncrease}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="0.5"
              value={percentageIncrease}
              onChange={(e) => handlePercentChange(parseFloat(e.target.value) || 0)}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Proposed Base Salary ($) *
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                required
                value={proposedSalary}
                onChange={(e) => handleProposedSalaryChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-blue-500/50 rounded-xl text-white font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Effective Date *
              </label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Revision Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="MeritIncrease">Annual Merit Review</option>
              <option value="Promotion">Promotion & Role Elevation</option>
              <option value="MarketAdjustment">Market Competitiveness Adjustment</option>
              <option value="Retention">Key Talent Counter-Offer / Retention</option>
              <option value="EquityCorrection">Internal Pay Equity Correction</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Business Justification / Comments
            </label>
            <textarea
              rows={2}
              placeholder="Provide milestone deliverables, performance ratings, or benchmark rationale..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
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
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
