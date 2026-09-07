import React, { useState, useEffect } from 'react';
import { X, UserCheck, Check, AlertCircle } from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { getEmployees, EmployeeDto } from '../../employee/api/EmployeeApi';
import { AssetDto } from '../types/asset';

interface AssetAssignModalProps {
  asset: AssetDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssetAssignModal: React.FC<AssetAssignModalProps> = ({ asset, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [condition, setCondition] = useState('Good');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [handoverNotes, setHandoverNotes] = useState('Issued for standard workstation duties.');
  const [accessories, setAccessories] = useState<string[]>([
    'Power Adapter & Cable',
    'Laptop Protective Sleeve'
  ]);
  const [newAccessory, setNewAccessory] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEmployees()
      .then(data => {
        setEmployees(data);
        if (data.length > 0) setSelectedEmployeeId(data[0].id);
      })
      .catch(err => console.error(err));
  }, []);

  if (!asset) return null;

  const handleAddAccessory = () => {
    if (newAccessory.trim() && !accessories.includes(newAccessory.trim())) {
      setAccessories([...accessories, newAccessory.trim()]);
      setNewAccessory('');
    }
  };

  const handleRemoveAccessory = (item: string) => {
    setAccessories(accessories.filter(a => a !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      setError('Please select an employee.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await assetApi.assignAsset(asset.id, {
        employeeId: selectedEmployeeId,
        conditionAtHandover: condition,
        expectedReturnDate: expectedReturnDate || undefined,
        accessories,
        handoverNotes
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Assignment failed. Check if asset is already allocated.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Assign Asset: {asset.assetTag}
              </h3>
              <p className="text-xs text-slate-500">{asset.assetName}</p>
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Employee (Custodian) *
            </label>
            <select
              required
              value={selectedEmployeeId}
              onChange={e => setSelectedEmployeeId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.email}) - {emp.employeeNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Condition at Handover
              </label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="New">New (Factory Sealed)</option>
                <option value="Good">Good (Pristine)</option>
                <option value="Fair">Fair (Minor cosmetic wear)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expected Return Date (Optional)
              </label>
              <input
                type="date"
                value={expectedReturnDate}
                onChange={e => setExpectedReturnDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Accessories Checklist
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAccessory}
                onChange={e => setNewAccessory(e.target.value)}
                placeholder="e.g. USB-C Dongle, Wireless Mouse"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleAddAccessory}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {accessories.map(acc => (
                <span key={acc} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Check className="w-3 h-3 text-emerald-600" />
                  {acc}
                  <button type="button" onClick={() => handleRemoveAccessory(acc)} className="text-slate-400 hover:text-slate-600 ml-1">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Handover Notes
            </label>
            <textarea
              rows={2}
              value={handoverNotes}
              onChange={e => setHandoverNotes(e.target.value)}
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
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs disabled:opacity-50"
            >
              {saving ? 'Assigning...' : 'Confirm Handover & Notify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
