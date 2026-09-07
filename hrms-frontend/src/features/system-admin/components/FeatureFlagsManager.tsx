import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, CheckCircle2, Shield, Sparkles, Sliders } from 'lucide-react';
import { FeatureFlagItem } from '../types/systemAdmin';
import { systemAdminApi } from '../api/systemAdminApi';

export const FeatureFlagsManager: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingKey, setTogglingKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const data = await systemAdminApi.getFeatureFlags();
      setFlags(data);
    } catch (err) {
      console.error('Failed to fetch feature flags', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleToggle = async (flag: FeatureFlagItem) => {
    setTogglingKey(flag.key);
    const newState = !flag.isEnabledGlobally;
    try {
      await systemAdminApi.updateFeatureFlag(flag.key, newState, flag.companyOverridesJson);
      setStatusMessage(`Feature '${flag.name}' set to ${newState ? 'Globally Enabled' : 'Disabled'}.`);
      setTimeout(() => setStatusMessage(null), 3500);
      fetchFlags();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle feature flag');
    } finally {
      setTogglingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Module Feature Flags & Toggles</h3>
            <p className="text-xs text-slate-500">Enable or disable HRMS functional capabilities across tenant boundaries</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          {flags.filter(f => f.isEnabledGlobally).length} of {flags.length} Active Modules
        </span>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {statusMessage}
        </div>
      )}

      {/* Grid of Feature Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 p-12 text-center text-xs text-slate-400">Loading feature toggles...</div>
        ) : (
          flags.map(flag => (
            <div
              key={flag.key}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between bg-white dark:bg-slate-900 ${
                flag.isEnabledGlobally
                  ? 'border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50 dark:bg-slate-900/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{flag.name}</h4>
                    <span className="font-mono text-[10px] text-slate-400">Key: {flag.key}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                    flag.isEnabledGlobally
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {flag.isEnabledGlobally ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2">
                  {flag.description || 'Module activation switch.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Global Scope</span>
                <button
                  onClick={() => handleToggle(flag)}
                  disabled={togglingKey === flag.key}
                  className="flex items-center gap-1.5 focus:outline-none"
                >
                  {flag.isEnabledGlobally ? (
                    <ToggleRight className="w-7 h-7 text-primary transition-all" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-300 dark:text-slate-600 transition-all" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
