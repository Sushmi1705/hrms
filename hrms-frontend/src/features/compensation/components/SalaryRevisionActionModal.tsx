import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { SalaryRevision } from '../types/compensation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: 'Approve' | 'Reject', comments: string) => Promise<void>;
  revision: SalaryRevision | null;
}

export const SalaryRevisionActionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  revision
}) => {
  const [action, setAction] = useState<'Approve' | 'Reject'>('Approve');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !revision) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await onConfirm(action, comments);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl shadow-slate-950/80 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div>
            <h3 className="text-lg font-bold text-white">Review Salary Adjustment</h3>
            <p className="text-xs text-slate-400">Decision approval for {revision.revisionNumber}</p>
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
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Employee:</span>
              <span className="font-semibold text-white">{revision.employeeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Department:</span>
              <span className="text-slate-300">{revision.departmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Salary:</span>
              <span className="font-mono text-slate-300">${revision.currentSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Proposed Salary:</span>
              <span className="font-mono font-bold text-emerald-400">
                ${revision.proposedSalary.toLocaleString()} (+{revision.percentageIncrease}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Reason:</span>
              <span className="text-indigo-400">{revision.reason}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAction('Approve')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                action === 'Approve'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>

            <button
              type="button"
              onClick={() => setAction('Reject')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                action === 'Reject'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Approver Remarks / Budget Code
            </label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Approved within FY2026 merit guidelines..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
              className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-lg transition-all ${
                action === 'Approve'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
              }`}
            >
              {loading ? 'Processing...' : `Confirm ${action}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
