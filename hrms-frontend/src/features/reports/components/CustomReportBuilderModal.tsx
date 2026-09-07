import React, { useState } from 'react';
import { reportsApi, type CustomReportRequestDto, type CustomReportResultDto } from '../api/reportApi';
import { X, FileSpreadsheet, Play, Download, Check, BarChart3, Table as TableIcon } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface CustomReportBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DATA_SOURCES = [
  { id: 'Workforce', name: 'Employees & Workforce', fields: ['EmployeeNumber', 'FullName', 'Department', 'Designation', 'Status', 'JoiningDate'] },
  { id: 'Attendance', name: 'Attendance & Time Logs', fields: ['Date', 'Employee', 'Department', 'Status', 'IsLate', 'IsEarlyOut', 'TotalWorkingHours'] },
  { id: 'Leave', name: 'Leave & Absences', fields: ['Employee', 'LeaveType', 'FromDate', 'ToDate', 'Days', 'Status'] },
  { id: 'Payroll', name: 'Payroll Runs & Salaries', fields: ['Month', 'Year', 'Status', 'TotalEmployees', 'TotalGrossSalary', 'TotalNetSalary', 'ProcessDate'] },
  { id: 'Assets', name: 'Asset Management', fields: ['AssetTag', 'AssetName', 'Category', 'Department', 'Status', 'PurchasePrice', 'CurrentBookValue'] },
  { id: 'Expenses', name: 'Travel & Expenses', fields: ['Merchant', 'Category', 'Employee', 'Amount', 'Currency', 'Status', 'ExpenseDate'] }
];

export const CustomReportBuilderModal: React.FC<CustomReportBuilderModalProps> = ({ isOpen, onClose }) => {
  const [dataSource, setDataSource] = useState('Workforce');
  const [selectedFields, setSelectedFields] = useState<string[]>(['EmployeeNumber', 'FullName', 'Department', 'Status']);
  const [aggregationType, setAggregationType] = useState('None');
  const [aggregationField, setAggregationField] = useState('');
  const [visualizationType, setVisualizationType] = useState<'table' | 'kpi'>('table');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CustomReportResultDto | null>(null);

  const currentSource = DATA_SOURCES.find((d) => d.id === dataSource) || DATA_SOURCES[0];

  const handleSourceChange = (srcId: string) => {
    setDataSource(srcId);
    const src = DATA_SOURCES.find((d) => d.id === srcId);
    if (src) {
      setSelectedFields(src.fields.slice(0, 4));
      setAggregationField('');
    }
    setResult(null);
  };

  const toggleField = (f: string) => {
    if (selectedFields.includes(f)) {
      if (selectedFields.length > 1) {
        setSelectedFields(selectedFields.filter((item) => item !== f));
      }
    } else {
      setSelectedFields([...selectedFields, f]);
    }
  };

  const handleExecute = async () => {
    setLoading(true);
    try {
      const res = await reportsApi.executeCustomReport({
        dataSource,
        fields: selectedFields,
        aggregationType: aggregationType === 'None' ? undefined : aggregationType,
        aggregationField: aggregationField || undefined,
        visualizationType,
        page: 1,
        pageSize: 25
      });
      setResult(res);
    } catch (e) {
      console.error('Failed to execute custom report:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (!result || !result.rows.length) return;
    const header = result.columns.join(',');
    const rows = result.rows.map((row) =>
      result.columns.map((col) => `"${String(row[col] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Custom_Report_${dataSource}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Custom Enterprise Report Builder</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Design ad-hoc queries, aggregate metrics, and visualize results across HR modules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Configuration Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* Step 1: Select Data Source */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
              1. Choose HR Module Data Source
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DATA_SOURCES.map((src) => (
                <button
                  key={src.id}
                  onClick={() => handleSourceChange(src.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    dataSource === src.id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {src.name}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Fields */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
              2. Select Columns / Output Fields
            </label>
            <div className="flex flex-wrap gap-2">
              {currentSource.fields.map((f) => {
                const active = selectedFields.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() => toggleField(f)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      active
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {active && <Check className="h-3 w-3" />}
                    <span>{f}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Aggregation & Visualization */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Aggregation Function</label>
              <select
                value={aggregationType}
                onChange={(e) => setAggregationType(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none text-slate-800 dark:text-slate-200"
              >
                <option value="None">None (Detailed Rows)</option>
                <option value="Count">Count</option>
                <option value="Sum">Sum</option>
                <option value="Average">Average</option>
                <option value="Min">Minimum</option>
                <option value="Max">Maximum</option>
              </select>
            </div>

            {aggregationType !== 'None' && aggregationType !== 'Count' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Aggregation Target Field</label>
                <select
                  value={aggregationField}
                  onChange={(e) => setAggregationField(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none text-slate-800 dark:text-slate-200"
                >
                  <option value="">Select Field</option>
                  {currentSource.fields.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Visualization Format</label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setVisualizationType('table')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold ${
                    visualizationType === 'table'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs border border-slate-200 dark:border-slate-600'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <TableIcon className="h-3.5 w-3.5" /> Table
                </button>
                <button
                  onClick={() => setVisualizationType('kpi')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold ${
                    visualizationType === 'kpi'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs border border-slate-200 dark:border-slate-600'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" /> Summary KPI
                </button>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handleExecute}
              disabled={loading}
              className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{loading ? 'Executing Query...' : 'Execute Custom Report'}</span>
            </Button>

            {result && result.rows.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1 text-xs">
                <Download className="h-3.5 w-3.5 text-emerald-600" />
                <span>Export Query Result</span>
              </Button>
            )}
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Execution Results ({result.totalCount} records matched)
                </h4>
                {result.aggregationResult !== undefined && (
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md">
                    {aggregationType} Result: {result.aggregationResult.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto max-h-64">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                    <tr>
                      {result.columns.map((col) => (
                        <th key={col} className="p-2.5 font-semibold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {result.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        {result.columns.map((col) => (
                          <td key={col} className="p-2.5 truncate max-w-[200px]">
                            {String(row[col] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close Builder
          </Button>
        </div>
      </div>
    </div>
  );
};
