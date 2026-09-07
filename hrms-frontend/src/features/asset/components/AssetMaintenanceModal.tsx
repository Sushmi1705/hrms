import React, { useState } from 'react';
import { X, Wrench, AlertCircle } from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetDto } from '../types/asset';

interface AssetMaintenanceModalProps {
  asset: AssetDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssetMaintenanceModal: React.FC<AssetMaintenanceModalProps> = ({ asset, onClose, onSuccess }) => {
  const [maintenanceType, setMaintenanceType] = useState('Corrective');
  const [serviceProvider, setServiceProvider] = useState('OEM Authorized Technical Service');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [issue, setIssue] = useState('Screen flickering and port connection issue.');
  const [cost, setCost] = useState(0);
  const [warrantyCovered, setWarrantyCovered] = useState(true);
  const [technicianName, setTechnicianName] = useState('Lead Service Engineer');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!asset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await assetApi.scheduleMaintenance(asset.id, {
        maintenanceType,
        serviceProvider,
        startDate,
        issue,
        cost,
        warrantyCovered,
        technicianName
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to schedule maintenance.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Schedule Asset Maintenance
              </h3>
              <p className="text-xs text-slate-500">{asset.assetTag} - {asset.assetName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Maintenance Type
              </label>
              <select
                value={maintenanceType}
                onChange={e => setMaintenanceType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Corrective">Corrective (Repair)</option>
                <option value="Preventive">Preventive (Routine Tune-up)</option>
                <option value="Upgrade">Hardware Upgrade (RAM/SSD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Issue / Diagnostic Reason *
            </label>
            <textarea
              rows={2}
              required
              value={issue}
              onChange={e => setIssue(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Service Provider
              </label>
              <input
                type="text"
                value={serviceProvider}
                onChange={e => setServiceProvider(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Technician Name
              </label>
              <input
                type="text"
                value={technicianName}
                onChange={e => setTechnicianName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Cost ($)
              </label>
              <input
                type="number"
                value={cost}
                onChange={e => setCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={warrantyCovered}
                  onChange={e => setWarrantyCovered(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                Covered by OEM Warranty
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs disabled:opacity-50"
            >
              {saving ? 'Scheduling...' : 'Place in Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
