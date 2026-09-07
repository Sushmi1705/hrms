import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  CornerDownLeft, 
  Wrench, 
  UserCheck, 
  RefreshCw,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetDto } from '../types/asset';

export const AssetLifecyclePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'transfers' | 'returns' | 'maintenance'>('assignments');
  const [assets, setAssets] = useState<AssetDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    assetApi.getAssets({ pageSize: 50 })
      .then(res => setAssets(res.items))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const assignedAssets = assets.filter(a => a.status === 'Assigned');
  const maintenanceAssets = assets.filter(a => a.status === 'UnderMaintenance');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Hardware Lifecycle & Custody Workflows
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          End-to-end tracking of device allocation, custody transfers, maintenance work orders, and return intake
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'assignments'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Active Custody Assignments ({assignedAssets.length})
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'maintenance'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Wrench className="w-4 h-4" />
          In Maintenance / Diagnostics ({maintenanceAssets.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {activeTab === 'assignments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs uppercase text-slate-500">
                  <th className="p-4">Asset Tag</th>
                  <th className="p-4">Hardware Device</th>
                  <th className="p-4">Custodian</th>
                  <th className="p-4">Department & Location</th>
                  <th className="p-4">Condition</th>
                  <th className="p-4">Assignment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {assignedAssets.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-semibold text-xs text-indigo-600">
                      {a.assetTag}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">{a.assetName}</div>
                      <div className="text-[11px] text-slate-400">{a.manufacturer} • {a.categoryName}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">{a.currentCustodianName}</div>
                      <div className="text-[11px] text-slate-400">{a.currentCustodianEmail}</div>
                    </td>
                    <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                      {a.departmentName || 'General'} • {a.locationName}
                    </td>
                    <td className="p-4 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                        {a.condition}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active Custody
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs uppercase text-slate-500">
                  <th className="p-4">Asset Tag</th>
                  <th className="p-4">Hardware Device</th>
                  <th className="p-4">Serial Number</th>
                  <th className="p-4">Location Depot</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {maintenanceAssets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">No assets currently under maintenance.</td>
                  </tr>
                ) : (
                  maintenanceAssets.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-4 font-mono font-semibold text-xs text-amber-600">
                        {a.assetTag}
                      </td>
                      <td className="p-4 font-semibold text-xs text-slate-900 dark:text-slate-100">
                        {a.assetName}
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-500">
                        {a.serialNumber}
                      </td>
                      <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                        {a.locationName}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                          <Wrench className="w-3.5 h-3.5" /> In Repair / Diagnostic
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
