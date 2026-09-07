import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Shield, Globe, Clock, Layers, FileText, Database } from 'lucide-react';
import { SystemSettingItem, UpdateSettingData } from '../types/systemAdmin';
import { systemAdminApi } from '../api/systemAdminApi';

export const SystemSettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('General');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const categories = [
    { id: 'General', label: 'General & Brand', icon: Globe },
    { id: 'Security', label: 'Security & Access', icon: Shield },
    { id: 'Attendance', label: 'Attendance Rules', icon: Clock },
    { id: 'Leave', label: 'Leave Rules', icon: FileText },
    { id: 'Payroll', label: 'Payroll & Tax', icon: Layers },
    { id: 'DataPolicy', label: 'Data & Retention', icon: Database },
  ];

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await systemAdminApi.getSettings();
      setSettings(data);
      const valMap: { [key: string]: string } = {};
      data.forEach(s => { valMap[s.key] = s.value; });
      setEditValues(valMap);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSetting = async (setting: SystemSettingItem) => {
    setSavingKey(setting.key);
    setStatusMessage(null);
    try {
      await systemAdminApi.updateSetting({
        key: setting.key,
        value: editValues[setting.key] ?? setting.value,
        scopeLevel: setting.scopeLevel,
        changeReason: 'Updated via System Admin Portal'
      });
      setStatusMessage(`Setting '${setting.key}' saved successfully.`);
      setTimeout(() => setStatusMessage(null), 3500);
      fetchSettings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save setting');
    } finally {
      setSavingKey(null);
    }
  };

  const filteredSettings = settings.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-6">
      
      {/* Category Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 rounded-2xl gap-2 overflow-x-auto">
        {categories.map(cat => {
          const Icon = cat.icon;
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                active
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {statusMessage}
        </div>
      )}

      {/* Settings List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {categories.find(c => c.id === activeCategory)?.label} Configuration
            </h3>
            <p className="text-xs text-slate-500">Hierarchy resolution applies: Branch $\to$ Company $\to$ Global</p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 font-semibold">
            {filteredSettings.length} Parameters
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading configuration parameters...</div>
          ) : filteredSettings.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No settings found in this category.</div>
          ) : (
            filteredSettings.map(s => (
              <div key={s.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">{s.key}</span>
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                      {s.scopeLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.description}</p>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  {s.dataType === 'boolean' ? (
                    <select
                      value={editValues[s.key] ?? s.value}
                      onChange={e => setEditValues({ ...editValues, [s.key]: e.target.value })}
                      className="px-3.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="true">Enabled (true)</option>
                      <option value="false">Disabled (false)</option>
                    </select>
                  ) : (
                    <input
                      type={s.isEncrypted ? 'password' : 'text'}
                      value={editValues[s.key] ?? s.value}
                      onChange={e => setEditValues({ ...editValues, [s.key]: e.target.value })}
                      className="w-full md:w-64 px-3.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                    />
                  )}

                  <button
                    onClick={() => handleSaveSetting(s)}
                    disabled={savingKey === s.key}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-1 shrink-0 transition-colors"
                  >
                    {savingKey === s.key ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Save
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
