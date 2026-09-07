import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, TrendingUp, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { compensationApi } from '../api/compensationApi';
import { CompensationReviewCycle, CompensationReviewItem } from '../types/compensation';

export const CompensationReviewsPage: React.FC = () => {
  const [cycles, setCycles] = useState<CompensationReviewCycle[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');
  const [items, setItems] = useState<CompensationReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CompensationReviewItem | null>(null);

  // Form for item edit
  const [propSalary, setPropSalary] = useState<number>(0);
  const [managerRec, setManagerRec] = useState<string>('');
  const [managerComments, setManagerComments] = useState<string>('');

  const fetchCycles = async () => {
    try {
      setLoading(true);
      const data = await compensationApi.getReviewCycles();
      setCycles(data);
      if (data.length > 0 && !selectedCycleId) {
        setSelectedCycleId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch review cycles', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (cycleId: string) => {
    if (!cycleId) return;
    try {
      const data = await compensationApi.getReviewItems(cycleId);
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch review items', err);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  useEffect(() => {
    if (selectedCycleId) {
      fetchItems(selectedCycleId);
    }
  }, [selectedCycleId]);

  const activeCycle = cycles.find((c) => c.id === selectedCycleId);
  const budgetUtilizationPct =
    activeCycle && activeCycle.totalBudget > 0
      ? Math.round((activeCycle.usedBudget / activeCycle.totalBudget) * 100)
      : 0;

  const handleEditClick = (item: CompensationReviewItem) => {
    setEditingItem(item);
    setPropSalary(item.proposedSalary);
    setManagerRec(item.managerRecommendation || '');
    setManagerComments(item.managerComments || '');
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await compensationApi.updateReviewItem(editingItem.id, {
        proposedSalary: propSalary,
        managerRecommendation: managerRec,
        managerComments: managerComments
      });
      setEditingItem(null);
      await fetchItems(selectedCycleId);
      await fetchCycles();
    } catch (err) {
      alert('Failed to update recommendation');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Merit Review Cycles & Compensation Planning</h1>
          <p className="text-xs text-slate-400 mt-1">
            Annual salary review process, departmental merit pools, and manager increase worksheets
          </p>
        </div>

        {cycles.length > 0 && (
          <select
            value={selectedCycleId}
            onChange={(e) => setSelectedCycleId(e.target.value)}
            className="px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {cycles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.cycleName} (FY{c.fiscalYear})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Active Cycle Overview */}
      {activeCycle && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Status: {activeCycle.status}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{activeCycle.cycleName}</h2>
              <p className="text-xs text-slate-400">
                Effective from: {new Date(activeCycle.effectiveDate).toLocaleDateString()} &bull;{' '}
                {activeCycle.guidelines}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Total Merit Budget</span>
                <span className="text-2xl font-bold font-mono text-white">
                  ${activeCycle.totalBudget.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Allocated Spend</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  ${activeCycle.usedBudget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Budget Utilization Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Merit Pool Utilization:</span>
              <span className="font-mono font-bold text-indigo-400">{budgetUtilizationPct}% used</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, budgetUtilizationPct)}%` }}
                className={`h-full transition-all duration-500 rounded-full ${
                  budgetUtilizationPct > 90 ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Review Items Worksheet */}
      <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Employee Merit Review Recommendations</h3>
          <span className="text-xs font-mono text-slate-400">{items.length} Employees in Cycle</span>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No employees populated in this review cycle.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-800/40 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Current Base</th>
                  <th className="py-3 px-4">Current Compa</th>
                  <th className="py-3 px-4">Recommended %</th>
                  <th className="py-3 px-4">Proposed Base</th>
                  <th className="py-3 px-4">New Compa</th>
                  <th className="py-3 px-4">Manager Recommendation</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{item.employeeName}</div>
                      <div className="text-[11px] text-slate-400">{item.departmentName}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">${item.currentSalary.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{item.currentCompaRatio}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      +{item.proposedIncreasePercentage}%
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ${item.proposedSalary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-indigo-300">{item.newCompaRatio}</td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-400">
                      {item.managerRecommendation}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 transition-colors"
                        title="Edit Merit Increase"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Review Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Edit Merit Recommendation</h3>
            <p className="text-xs text-slate-400">Employee: {editingItem.employeeName}</p>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Salary:</span>
                  <span className="text-white">${editingItem.currentSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Compa-Ratio:</span>
                  <span className="text-indigo-300">{editingItem.currentCompaRatio}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Proposed Base Salary ($)
                </label>
                <input
                  type="number"
                  required
                  min={editingItem.currentSalary}
                  value={propSalary}
                  onChange={(e) => setPropSalary(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-indigo-500/50 rounded-xl text-white font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Manager Justification
                </label>
                <textarea
                  rows={2}
                  value={managerRec}
                  onChange={(e) => setManagerRec(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg"
                >
                  Save Recommendation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
