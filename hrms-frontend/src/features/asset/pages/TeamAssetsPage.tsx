import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetDto } from '../types/asset';

export const TeamAssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<AssetDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    assetApi.getAssets({ pageSize: 50, status: 'Assigned' })
      .then(res => setAssets(res.items))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Department & Team Hardware Allocations
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Review employee equipment assignments, custody health, and pending return schedules for your direct reports
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Team Assigned Devices ({assets.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs uppercase text-slate-500">
                <th className="p-4">Team Member</th>
                <th className="p-4">Device Name</th>
                <th className="p-4">Asset Tag</th>
                <th className="p-4">Category</th>
                <th className="p-4">Condition</th>
                <th className="p-4">Assigned Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {assets.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      {a.currentCustodianName || 'Team Member'}
                    </div>
                    <div className="text-[11px] text-slate-400">{a.departmentName}</div>
                  </td>
                  <td className="p-4 font-medium text-xs text-slate-800 dark:text-slate-200">
                    {a.assetName}
                  </td>
                  <td className="p-4 font-mono font-semibold text-xs text-indigo-600">
                    {a.assetTag}
                  </td>
                  <td className="p-4 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                      {a.categoryName}
                    </span>
                  </td>
                  <td className="p-4 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                      {a.condition}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    {new Date(a.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
