import React, { useState } from 'react';
import { X, CheckCircle2, FileCheck } from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetDto } from '../types/asset';

interface DigitalHandoverModalProps {
  asset: AssetDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const DigitalHandoverModal: React.FC<DigitalHandoverModalProps> = ({ asset, onClose, onSuccess }) => {
  const [signatureName, setSignatureName] = useState(asset?.currentCustodianName || '');
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!asset) return null;

  const handleAcknowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureName.trim() || !agreed) {
      setError('Please type your legal name and accept the terms of custody.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Find assignment ID or acknowledge
      await assetApi.acknowledgeAssignment(asset.id, {
        digitalSignature: `${signatureName.trim()} [VERIFIED-ID]`,
        comments: 'Employee confirmed possession and operational condition.'
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Handover acknowledgement failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Digital Handover Acknowledgment
              </h3>
              <p className="text-xs text-slate-500">{asset.assetTag} - {asset.assetName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAcknowledge} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {error}
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="font-semibold text-slate-800 dark:text-slate-100">Hardware Custody Agreement</div>
            <p>
              By signing below, I acknowledge receipt of the assigned hardware device in <strong>{asset.condition}</strong> condition with all stated accessories.
            </p>
            <p>
              I agree to take reasonable care of the equipment, use it in accordance with company IT acceptable use policies, and return it promptly upon request or termination of employment.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Type Full Name (Digital Signature) *
            </label>
            <input
              type="text"
              required
              value={signatureName}
              onChange={e => setSignatureName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-serif"
            />
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5"
            />
            <span>I have inspected the physical hardware, verified serial number {asset.serialNumber}, and confirm receipt.</span>
          </label>

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
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {saving ? 'Signing...' : 'Sign & Acknowledge Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
