import React from 'react';
import { CheckSquare, ArrowRightLeft, RefreshCw, X } from 'lucide-react';

interface AssetBulkToolbarProps {
  selectedCount: number;
  onClear: () => void;
  onBulkStatus: () => void;
  onBulkTransfer: () => void;
}

export const AssetBulkToolbar: React.FC<AssetBulkToolbarProps> = ({
  selectedCount,
  onClear,
  onBulkStatus,
  onBulkTransfer
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-6 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2">
        <CheckSquare className="w-5 h-5 text-indigo-400" />
        <span className="text-sm font-semibold">
          {selectedCount} asset{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="h-5 w-px bg-slate-700" />

      <div className="flex items-center gap-2">
        <button
          onClick={onBulkStatus}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          Update Status
        </button>

        <button
          onClick={onBulkTransfer}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
          Bulk Transfer
        </button>
      </div>

      <div className="h-5 w-px bg-slate-700" />

      <button
        onClick={onClear}
        className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        title="Clear Selection"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
