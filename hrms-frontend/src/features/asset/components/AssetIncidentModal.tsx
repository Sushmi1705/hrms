import React, { useState } from 'react';
import { X, AlertOctagon, AlertCircle } from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetDto } from '../types/asset';

interface AssetIncidentModalProps {
  asset: AssetDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssetIncidentModal: React.FC<AssetIncidentModalProps> = ({ asset, onClose, onSuccess }) => {
  const [incidentType, setIncidentType] = useState('Damage');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [severity, setSeverity] = useState('High');
  const [description, setDescription] = useState('');
  const [estimatedLoss, setEstimatedLoss] = useState(asset?.purchasePrice ? Math.round(asset.purchasePrice * 0.3) : 300);
  const [resolution, setResolution] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!asset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide an incident description.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await assetApi.reportIncident(asset.id, {
        incidentType,
        incidentDate,
        severity,
        description,
        estimatedLoss,
        resolution
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to report incident.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Report Asset Incident
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
                Incident Classification
              </label>
              <select
                value={incidentType}
                onChange={e => setIncidentType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Damage">Physical Damage</option>
                <option value="Lost">Lost / Unaccounted For</option>
                <option value="Stolen">Stolen / Theft</option>
                <option value="Malfunction">Catastrophic Malfunction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Low">Low (Minor scratch/dent)</option>
                <option value="Medium">Medium (Affects single accessory)</option>
                <option value="High">High (Hardware inoperable)</option>
                <option value="Critical">Critical (Complete loss/theft)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Incident Date
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={e => setIncidentDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Loss / Claim ($)
              </label>
              <input
                type="number"
                value={estimatedLoss}
                onChange={e => setEstimatedLoss(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Incident Circumstances & Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed description of what occurred, police report # if applicable, witness info..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Initial Mitigation / Resolution (Optional)
            </label>
            <input
              type="text"
              value={resolution}
              onChange={e => setResolution(e.target.value)}
              placeholder="e.g. Remote lock & wipe triggered via MDM..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
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
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs disabled:opacity-50"
            >
              {saving ? 'Reporting...' : 'Submit Incident Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
