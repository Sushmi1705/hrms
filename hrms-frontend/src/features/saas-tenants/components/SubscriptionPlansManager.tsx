import React, { useState } from 'react';
import { CreditCard, Check, Edit2, Shield, Plus, CheckCircle2, Sparkles } from 'lucide-react';
import { SubscriptionPlanItem } from '../types/tenant';
import { tenantApi } from '../api/tenantApi';

interface Props {
  plans: SubscriptionPlanItem[];
  onRefresh: () => void;
}

export const SubscriptionPlansManager: React.FC<Props> = ({ plans, onRefresh }) => {
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setSaving(true);
    setStatusMessage(null);
    try {
      await tenantApi.savePlan(editingPlan);
      setStatusMessage(`Plan '${editingPlan.name}' saved successfully.`);
      setTimeout(() => setStatusMessage(null), 3500);
      setEditingPlan(null);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update plan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">SaaS Subscription Plans & Tier Limits</h3>
            <p className="text-xs text-slate-500">Configure packaging, pricing, capacity quotas, and module entitlements</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-500">{plans.length} Standard Plans</span>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {statusMessage}
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {plans.map(p => (
          <div
            key={p.code}
            className={`p-5 rounded-3xl border flex flex-col justify-between transition-all bg-white dark:bg-slate-900 ${
              p.isPopular
                ? 'border-primary ring-2 ring-primary/20 shadow-md'
                : 'border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</span>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">{p.code}</div>
                </div>
                {p.isPopular && (
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-primary text-white">
                    POPULAR
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  ${p.monthlyPrice}
                  <span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  or ${p.annualPrice}/yr (billed annually)
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">
                {p.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Max Users:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{p.maxUsers}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Max Employees:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{p.maxEmployees}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Storage:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{p.storageGb} GB</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Support:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{p.supportTier}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">Included Modules:</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.features.map(f => (
                    <span key={f} className="px-1.5 py-0.5 text-[9px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-emerald-600">
                {p.activeSubscribersCount} Active Tenants
              </span>

              <button
                onClick={() => setEditingPlan(p)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Edit Plan"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Edit Subscription Plan: {editingPlan.name}</h3>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={editingPlan.name}
                  onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Price ($)</label>
                  <input
                    type="number"
                    value={editingPlan.monthlyPrice}
                    onChange={e => setEditingPlan({ ...editingPlan, monthlyPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Annual Price ($)</label>
                  <input
                    type="number"
                    value={editingPlan.annualPrice}
                    onChange={e => setEditingPlan({ ...editingPlan, annualPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Max Users</label>
                  <input
                    type="number"
                    value={editingPlan.maxUsers}
                    onChange={e => setEditingPlan({ ...editingPlan, maxUsers: parseInt(e.target.value) || 10 })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Max Employees</label>
                  <input
                    type="number"
                    value={editingPlan.maxEmployees}
                    onChange={e => setEditingPlan({ ...editingPlan, maxEmployees: parseInt(e.target.value) || 50 })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Storage (GB)</label>
                  <input
                    type="number"
                    value={editingPlan.storageGb}
                    onChange={e => setEditingPlan({ ...editingPlan, storageGb: parseInt(e.target.value) || 5 })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-xl shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
