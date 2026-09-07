import React, { useState } from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetDto } from '../types/asset';

interface AssetDisposalModalProps {
  asset: AssetDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssetDisposalModal: React.FC<AssetDisposalModalProps> = ({ asset, onClose, onSuccess }) => {
  const [disposalReason, setDisposalReason] = useState('EndOfUsefulLife');
  const [disposalMethod, setDisposalMethod] = useState('Recycling');
  const [saleValue, setSaleValue] = useState(asset?.salvageValue || 50);
  const [buyerVendorName, setBuyerVendorName] = useState('Certified Green Electronics Recycler');
  const [notes, setNotes] = useState('DOD 7-pass storage wipe executed. Certificate attached.');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!asset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await assetApi.disposeAsset(asset.id, {
        disposalReason,
        disposalMethod,
        saleValue,
        buyerVendorName,
        notes
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Disposal processing failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Decommission & Dispose Asset
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

          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
            <strong>Warning:</strong> Decommissioning marks this asset as permanently inactive. It will be removed from circulation and cannot be reassigned.
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Disposal Reason
              </label>
              <select
                value={disposalReason}
                onChange={e => setDisposalReason(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="EndOfUsefulLife">End of Useful Life / Obsolete</option>
                <option value="BeyondEconomicRepair">Beyond Economic Repair</option>
                <option value="Damaged">Damaged Beyond Use</option>
                <option value="LostTheft">Lost / Stolen Off-Book</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Disposal Method
              </label>
              <select
                value={disposalMethod}
                onChange={e => setDisposalMethod(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Recycling">Certified E-Waste Recycling</option>
                <option value="Sale">Sold for Scrap / Salvage</option>
                <option value="Donation">Charitable Donation</option>
                <option value="Scrap">Destroyed & Scrapped</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Salvage / Sale Value ($)
              </label>
              <input
                type="number"
                value={saleValue}
                onChange={e => setSaleValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Buyer / Vendor Name
              </label>
              <input
                type="text"
                value={buyerVendorName}
                onChange={e => setBuyerVendorName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Compliance & Sanitization Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
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
              {saving ? 'Processing...' : 'Confirm Decommission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
