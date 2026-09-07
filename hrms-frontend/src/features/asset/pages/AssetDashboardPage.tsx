import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Download, 
  Clock, 
  ShieldAlert, 
  Wrench, 
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Layers,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { assetApi } from '../api/assetApi';
import { AssetDashboardMetricsDto, AssetDto } from '../types/asset';
import { AssetStatsCards } from '../components/AssetStatsCards';
import { AssetUpsertModal } from '../components/AssetUpsertModal';
import { AssetDetailModal } from '../components/AssetDetailModal';

const STATUS_COLORS: Record<string, string> = {
  Assigned: '#3b82f6',
  Available: '#10b981',
  UnderMaintenance: '#f59e0b',
  Damaged: '#ef4444',
  Lost: '#f43f5e',
  Retired: '#64748b',
  Disposed: '#71717a'
};

export const AssetDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [warranties, setWarranties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const fetchDashboard = () => {
    setLoading(true);
    Promise.all([
      assetApi.getDashboard(),
      assetApi.getWarranties(30)
    ])
      .then(([dash, wars]) => {
        setMetrics(dash);
        setWarranties(wars || []);
      })
      .catch(err => console.error('Failed to load asset dashboard metrics', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleExportCsv = () => {
    assetApi.exportReportCsv({ reportType: 'AssetDepreciation' });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Enterprise Asset Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Hardware lifecycle orchestration, custody tracking, warranties, and financial depreciation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboard}
            title="Refresh Metrics"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Valuation CSV
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Register Asset
          </button>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <AssetStatsCards
        metrics={metrics}
        loading={loading}
      />

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Status & Allocation</h3>
              <p className="text-xs text-slate-500">Asset pool breakdown</p>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Live In-Memory
            </span>
          </div>

          <div className="h-64 w-full">
            {metrics ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={(metrics?.assetsByStatus || metrics?.statusDistribution || []).map((s: any) => ({
                      status: s.name || s.status,
                      count: s.value || s.count,
                      color: s.color || STATUS_COLORS[s.name || s.status] || '#6366f1'
                    }))}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {(metrics?.assetsByStatus || metrics?.statusDistribution || []).map((entry: any) => (
                      <Cell 
                        key={entry.name || entry.status} 
                        fill={entry.color || STATUS_COLORS[entry.name || entry.status] || '#6366f1'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value} assets`, name]}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle"
                    formatter={(val) => <span className="text-xs text-slate-600 dark:text-slate-400">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No status data available
              </div>
            )}
          </div>
        </div>

        {/* Category Volume & Value Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Category Volume & Valuation</h3>
              <p className="text-xs text-slate-500">Inventory count across hardware categories</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" /> Count
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            {metrics ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={(metrics?.assetsByCategory || metrics?.categoryBreakdown || []).map((c: any) => ({
                    categoryName: c.name || c.categoryName,
                    count: c.value || c.count
                  }))} 
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <XAxis 
                    dataKey="categoryName" 
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      name === 'count' ? `${value} Units` : `$${value.toLocaleString()}`,
                      name === 'count' ? 'Quantity' : 'Total Value'
                    ]}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No category data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Section: Warranty Expiry Watchlist & Recent Audit / Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Warranty Expiry Watchlist */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Warranty Expiry Watchlist (30 Days)
                </h3>
                <p className="text-xs text-slate-500">Critical devices requiring contract extension</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300">
              {metrics?.expiringWarranties?.length || 0} Alerts
            </span>
          </div>

          <div className="space-y-3">
            {warranties && warranties.length > 0 ? (
              warranties.slice(0, 5).map((war: any) => (
                <div 
                  key={war.id} 
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {war.assetTag}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {war.assetName}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Provider: {war.warrantyProvider} • Contract: {war.contractNumber}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      war.daysRemaining <= 7 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {war.daysRemaining < 0 ? 'Expired' : `${war.daysRemaining} days left`}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Ends: {new Date(war.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No warranties expiring in the next 30 days. All systems covered.
              </div>
            )}
          </div>
        </div>

        {/* Recent Lifecycle Activity Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Recent Asset Lifecycle Events
                </h3>
                <p className="text-xs text-slate-500">Real-time audit log & assignment activity</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {metrics?.recentActivities && metrics.recentActivities.length > 0 ? (
              metrics.recentActivities.slice(0, 5).map((act: any) => (
                <div 
                  key={act.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {act.activityType}: {act.assetTag}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(act.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {act.description}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Actor: {act.actor}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No recent activity logged.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AssetUpsertModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchDashboard();
          }}
        />
      )}

      {selectedAssetId && (
        <AssetDetailModal
          assetId={selectedAssetId}
          onClose={() => setSelectedAssetId(null)}
        />
      )}
    </div>
  );
};
