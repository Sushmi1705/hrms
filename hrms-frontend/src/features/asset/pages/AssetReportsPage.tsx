import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Filter, 
  DollarSign, 
  Clock, 
  Wrench, 
  Layers,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetReportDto, AssetCategoryDto } from '../types/asset';

export const AssetReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('AssetDepreciation');
  const [categories, setCategories] = useState<AssetCategoryDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [report, setReport] = useState<AssetReportDto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = () => {
    setLoading(true);
    assetApi.getReport({
      reportType,
      categoryId: selectedCategory || undefined
    })
      .then(data => setReport(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    assetApi.getCategories().then(cats => setCategories(cats));
  }, []);

  useEffect(() => {
    fetchReport();
  }, [reportType, selectedCategory]);

  const handleExportCsv = () => {
    assetApi.exportReportCsv({
      reportType,
      categoryId: selectedCategory || undefined
    });
  };

  const reportTypes = [
    { id: 'AssetDepreciation', label: 'Depreciation & Amortization', icon: DollarSign },
    { id: 'DepartmentValuation', label: 'Valuation by Department', icon: Layers },
    { id: 'WarrantyExpiry', label: 'Warranty Expiry Watchlist', icon: Clock },
    { id: 'MaintenanceCost', label: 'Maintenance Cost Analysis', icon: Wrench },
    { id: 'AuditDiscrepancy', label: 'Audit Discrepancy Reconciliation', icon: FileSpreadsheet }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Financial & Compliance Asset Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time depreciation schedules, department allocation balance sheets, and audit exports
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Report (.CSV)
        </button>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {reportTypes.map(rt => {
          const Icon = rt.icon;
          const isSelected = reportType === rt.id;
          return (
            <button
              key={rt.id}
              onClick={() => setReportType(rt.id)}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all shadow-xs ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100 dark:shadow-none'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
              <div className="text-xs font-semibold leading-tight">{rt.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-500">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchReport}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          title="Refresh Report Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Report Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Total Records: <strong className="text-slate-800 dark:text-slate-200">{report?.totalRecords || 0}</strong> • Generated at {new Date(report?.generatedAt || Date.now()).toLocaleTimeString()}
          </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !report || report.rows.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No matching records found for this report scope.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 font-semibold uppercase text-slate-500">
                  {report.columns.map(col => (
                    <th key={col} className="p-3.5 whitespace-nowrap">
                      {col.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {report.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    {report.columns.map(col => {
                      const val = row[col];
                      const isNum = typeof val === 'number';
                      const isCurrency = col.toLowerCase().includes('price') || col.toLowerCase().includes('value') || col.toLowerCase().includes('cost');
                      
                      return (
                        <td key={col} className="p-3.5 whitespace-nowrap text-slate-800 dark:text-slate-200">
                          {isCurrency && isNum
                            ? `$${val.toLocaleString()}`
                            : val !== undefined && val !== null ? String(val) : '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
