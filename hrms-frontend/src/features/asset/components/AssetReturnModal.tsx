import React, { useState } from 'react';
import { X, CornerDownLeft, AlertCircle } from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetDto } from '../types/asset';

interface AssetReturnModalProps {
  asset: AssetDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssetReturnModal: React.FC<AssetReturnModalProps> = ({ asset, onClose, onSuccess }) => {
  const [condition, setCondition] = useState('Good');
  const [resultingAssetStatus, setResultingAssetStatus] = useState('Available');
  const [inspectionNotes, setInspectionNotes] = useState('Device cosmetic condition inspected. Factory wiped.');
  const [accessoriesReturned, setAccessoriesReturned] = useState<string[]>(['Power Adapter', 'USB-C Cable']);
  const [missingAccessories, setMissingAccessories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!asset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await assetApi.returnAsset(asset.id, {
        condition,
        resultingAssetStatus,
        inspectionNotes,
        accessoriesReturned,
        missingAccessories
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Return intake failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CornerDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Asset Return Intake
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

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500">Returning Employee: </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {asset.currentCustodianName || 'Current Custodian'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Returned Condition
              </label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="New">Like New</option>
                <option value="Good">Good (Normal Wear)</option>
                <option value="Fair">Fair (Scratches/Dents)</option>
                <option value="Damaged">Damaged / Malfunctioning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Post-Intake Asset Status
              </label>
              <select
                value={resultingAssetStatus}
                onChange={e => setResultingAssetStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Available">Available for Reassignment</option>
                <option value="UnderMaintenance">Send to IT Maintenance</option>
                <option value="Retired">Retire / Obsolete</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Technical Inspection Notes
            </label>
            <textarea
              rows={3}
              value={inspectionNotes}
              onChange={e => setInspectionNotes(e.target.value)}
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
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50"
            >
              {saving ? 'Processing...' : 'Confirm Return & Reset Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
