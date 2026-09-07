import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { getEmployees, EmployeeDto } from '../../employee/api/EmployeeApi';
import { AssetDto, AssetLocationDto } from '../types/asset';

interface AssetTransferModalProps {
  asset: AssetDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssetTransferModal: React.FC<AssetTransferModalProps> = ({ asset, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [locations, setLocations] = useState<AssetLocationDto[]>([]);
  const [targetEmployeeId, setTargetEmployeeId] = useState('');
  const [targetLocationId, setTargetLocationId] = useState('');
  const [reason, setReason] = useState('Department transfer / project reassignment');
  const [condition, setCondition] = useState('Good');
  const [comments, setComments] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getEmployees(),
      assetApi.getLocations()
    ]).then(([emps, locs]) => {
      setEmployees(emps);
      setLocations(locs);
      if (emps.length > 0) setTargetEmployeeId(emps[0].id);
      if (locs.length > 0) setTargetLocationId(locs[0].id);
    });
  }, []);

  if (!asset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await assetApi.transferAsset(asset.id, {
        toEmployeeId: targetEmployeeId || undefined,
        toLocationId: targetLocationId || undefined,
        reason,
        condition,
        comments
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Transfer failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Transfer Asset Custody
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

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Current Custodian: </span>
            {asset.currentCustodianName || 'Unassigned / Depot Pool'} ({asset.locationName})
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              New Custodian (Employee)
            </label>
            <select
              value={targetEmployeeId}
              onChange={e => setTargetEmployeeId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Keep / Return to Inventory Pool</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              New Physical Location
            </label>
            <select
              value={targetLocationId}
              onChange={e => setTargetLocationId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.building})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Transfer Reason *
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Inspection Condition
            </label>
            <select
              value={condition}
              onChange={e => setCondition(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Comments & Handover Notes
            </label>
            <textarea
              rows={2}
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Sanitized, wiped, accessories confirmed..."
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
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-50"
            >
              {saving ? 'Processing...' : 'Complete Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
