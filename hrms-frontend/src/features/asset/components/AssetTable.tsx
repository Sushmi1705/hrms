import React from 'react';
import { 
  QrCode, 
  MoreVertical, 
  UserCheck, 
  ArrowRightLeft, 
  Wrench, 
  AlertOctagon, 
  Trash2, 
  Eye, 
  Laptop, 
  Monitor, 
  Smartphone, 
  Server, 
  Armchair, 
  Network, 
  Package
} from 'lucide-react';
import { AssetDto } from '../types/asset';

interface AssetTableProps {
  assets: AssetDto[];
  loading: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (allSelected: boolean) => void;
  onViewDetails: (asset: AssetDto) => void;
  onAssign: (asset: AssetDto) => void;
  onTransfer: (asset: AssetDto) => void;
  onMaintenance: (asset: AssetDto) => void;
  onIncident: (asset: AssetDto) => void;
  onShowQr: (asset: AssetDto) => void;
  onDelete: (asset: AssetDto) => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  loading,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onViewDetails,
  onAssign,
  onTransfer,
  onMaintenance,
  onIncident,
  onShowQr,
  onDelete,
  sortBy,
  sortDirection,
  onSort
}) => {
  const allSelected = assets.length > 0 && selectedIds.length === assets.length;

  const getCategoryIcon = (code?: string, name?: string) => {
    const c = (code || name || '').toLowerCase();
    if (c.includes('lap')) return Laptop;
    if (c.includes('mon') || c.includes('dsk')) return Monitor;
    if (c.includes('mob')) return Smartphone;
    if (c.includes('srv')) return Server;
    if (c.includes('fur')) return Armchair;
    if (c.includes('net')) return Network;
    return Package;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800';
      case 'Assigned':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-800';
      case 'UnderMaintenance':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800';
      case 'Damaged':
      case 'Lost':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800';
      case 'Disposed':
      case 'Retired':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-emerald-500 text-white';
      case 'Good':
        return 'bg-blue-500 text-white';
      case 'Fair':
        return 'bg-amber-500 text-white';
      case 'Poor':
      case 'Damaged':
        return 'bg-rose-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
        <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No Assets Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          No assets match the current filter criteria. Adjust your search or add a new asset to register.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </th>
              <th 
                className="p-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                onClick={() => onSort?.('assettag')}
              >
                Asset Tag {sortBy === 'assettag' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="p-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                onClick={() => onSort?.('assetname')}
              >
                Asset Name & Model {sortBy === 'assetname' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4">Category</th>
              <th className="p-4">Custodian</th>
              <th className="p-4">Location</th>
              <th className="p-4">Status</th>
              <th className="p-4">Condition</th>
              <th 
                className="p-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                onClick={() => onSort?.('purchaseprice')}
              >
                Book Value {sortBy === 'purchaseprice' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
            {assets.map((asset) => {
              const isSelected = selectedIds.includes(asset.id);
              const CatIcon = getCategoryIcon(asset.categoryCode, asset.categoryName);

              return (
                <tr 
                  key={asset.id} 
                  className={`hover:bg-slate-50/75 dark:hover:bg-slate-800/50 transition-colors ${
                    isSelected ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(asset.id)}
                      className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                  </td>
                  <td className="p-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    <div className="flex items-center gap-1.5">
                      <span>{asset.assetTag}</span>
                      <button 
                        onClick={() => onShowQr(asset)}
                        title="View & Print QR Code"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                        <CatIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </div>
                      <div>
                        <div 
                          className="font-medium text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                          onClick={() => onViewDetails(asset)}
                        >
                          {asset.assetName}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {asset.manufacturer} {asset.modelName ? `• ${asset.modelName}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {asset.categoryName || 'General'}
                    </span>
                  </td>
                  <td className="p-4">
                    {asset.currentCustodianName ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center uppercase">
                          {asset.currentCustodianName.substring(0, 2)}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {asset.currentCustodianName}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[120px]">
                            {asset.departmentName || 'General'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Unassigned (Pool)</span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                    {asset.locationName || 'HQ Depot'}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(asset.status)}`}>
                      {asset.status === 'UnderMaintenance' ? 'Maintenance' : asset.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${getConditionBadge(asset.condition)}`} />
                      <span className="text-xs text-slate-700 dark:text-slate-300">{asset.condition}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                    <div>${asset.currentBookValue?.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-400">Orig: ${asset.purchasePrice?.toLocaleString()}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetails(asset)}
                        title="View Asset Details"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {asset.status === 'Available' && (
                        <button
                          onClick={() => onAssign(asset)}
                          title="Assign to Employee"
                          className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}

                      {asset.status === 'Assigned' && (
                        <button
                          onClick={() => onTransfer(asset)}
                          title="Transfer Asset"
                          className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onMaintenance(asset)}
                        title="Schedule Maintenance"
                        className="p-1.5 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                      >
                        <Wrench className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onIncident(asset)}
                        title="Report Incident (Damage/Loss)"
                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      >
                        <AlertOctagon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(asset)}
                        title="Delete Asset"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
