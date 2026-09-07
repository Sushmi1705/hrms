import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { AssetDto } from '../types/asset';

interface AssetQrModalProps {
  asset: AssetDto | null;
  onClose: () => void;
}

export const AssetQrModal: React.FC<AssetQrModalProps> = ({ asset, onClose }) => {
  if (!asset) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=http://localhost:5174/admin/assets?search=${asset.assetTag}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Physical Asset Tag Label
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          <div className="border-2 border-slate-900 dark:border-slate-100 rounded-xl p-4 bg-white text-slate-900 space-y-2 print:border-black">
            <div className="text-[10px] font-black tracking-widest uppercase text-slate-500">
              PROPERTY OF ENTERPRISE CORP
            </div>
            
            <img
              src={qrUrl}
              alt="Asset Tag QR Code"
              className="w-44 h-44 mx-auto object-contain border border-slate-200 rounded-lg p-2"
            />

            <div className="font-mono text-xl font-black tracking-wider text-slate-900">
              {asset.assetTag}
            </div>

            <div className="text-xs font-bold text-slate-800 truncate">
              {asset.assetName}
            </div>

            <div className="text-[10px] text-slate-500 font-mono">
              S/N: {asset.serialNumber || 'N/A'} • {asset.categoryName}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
            >
              <Printer className="w-4 h-4" />
              Print Label
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
