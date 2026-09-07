import React from 'react';
import { 
  Package, 
  UserCheck, 
  CheckCircle2, 
  Wrench, 
  AlertTriangle, 
  DollarSign, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { AssetDashboardMetricsDto } from '../types/asset';

interface AssetStatsCardsProps {
  metrics: AssetDashboardMetricsDto | null;
  loading: boolean;
  onFilterStatus?: (status: string) => void;
}

export const AssetStatsCards: React.FC<AssetStatsCardsProps> = ({ metrics, loading, onFilterStatus }) => {
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xs border border-slate-100 dark:border-slate-700/60 animate-pulse" />
        ))}
      </div>
    );
  }

  const total = (metrics as any)?.totalAssets ?? (metrics as any)?.totalAssetsCount ?? 0;
  const assigned = (metrics as any)?.assignedAssets ?? (metrics as any)?.assignedAssetsCount ?? 0;
  const available = (metrics as any)?.availableAssets ?? (metrics as any)?.availableAssetsCount ?? 0;
  const maintenance = (metrics as any)?.assetsUnderMaintenance ?? (metrics as any)?.maintenanceAssetsCount ?? 0;
  const expiringCount = typeof (metrics as any)?.expiringWarranties === 'number' 
    ? (metrics as any).expiringWarranties 
    : (metrics as any)?.expiringWarrantiesCount30Days ?? 0;
  const totalVal = (metrics as any)?.totalAssetValue ?? (metrics as any)?.totalCurrentBookValue ?? 0;
  const catBreakdown = (metrics as any)?.assetsByCategory ?? (metrics as any)?.categoryBreakdown ?? [];

  const cards = [
    {
      id: 'total',
      title: 'Total Assets',
      value: total.toLocaleString(),
      subtitle: `${catBreakdown.length || 0} active categories`,
      icon: Package,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
      action: () => onFilterStatus?.('All')
    },
    {
      id: 'assigned',
      title: 'Allocated / In Use',
      value: assigned.toLocaleString(),
      subtitle: `${Math.round((assigned / (total || 1)) * 100)}% utilization rate`,
      icon: UserCheck,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50',
      action: () => onFilterStatus?.('Assigned')
    },
    {
      id: 'available',
      title: 'Available Stock',
      value: available.toLocaleString(),
      subtitle: 'Ready for deployment',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
      action: () => onFilterStatus?.('Available')
    },
    {
      id: 'maintenance',
      title: 'In Maintenance',
      value: maintenance.toLocaleString(),
      subtitle: 'Service & diagnostic center',
      icon: Wrench,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50',
      action: () => onFilterStatus?.('UnderMaintenance')
    },
    {
      id: 'warranties',
      title: 'Warranty Expiring',
      value: expiringCount.toString(),
      subtitle: 'Next 30 days renewal',
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/50',
      badge: expiringCount > 0 ? 'Action Required' : undefined,
      badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
    },
    {
      id: 'valuation',
      title: 'Net Book Value',
      value: `$${(totalVal / 1000).toFixed(1)}k`,
      subtitle: `Total Asset Pool Value`,
      icon: DollarSign,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900/50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            onClick={c.action}
            className={`rounded-xl p-4 bg-white dark:bg-slate-800 border ${c.bgColor} shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${c.action ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{c.title}</span>
              <div className={`p-2 rounded-lg ${c.color} bg-white/80 dark:bg-slate-700/80 shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{c.value}</span>
              {c.badge && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${c.badgeColor}`}>
                  {c.badge}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">{c.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
};
