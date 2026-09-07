import React, { useState } from 'react';
import { Download, FileSpreadsheet, CheckCircle2, TrendingUp, ShieldCheck, History } from 'lucide-react';
import { compensationApi } from '../api/compensationApi';

export const CompensationReportsPage: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const reports = [
    {
      id: 'EmployeeCompensation',
      title: 'Employee Compensation Master Roster',
      description: 'Comprehensive export of all contracted base salaries, allowances, monthly totals, and compa-ratios.',
      icon: FileSpreadsheet,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      btnColor: 'bg-emerald-600 hover:bg-emerald-500'
    },
    {
      id: 'PayGradeDistribution',
      title: 'Pay Grade & Benchmark Distribution',
      description: 'Hierarchical pay grades with minimum, midpoint, and maximum benchmarks, spreads, and employee counts.',
      icon: TrendingUp,
      color: 'from-purple-500/20 to-indigo-500/10',
      border: 'border-purple-500/30',
      btnColor: 'bg-purple-600 hover:bg-purple-500'
    },
    {
      id: 'BenefitEnrollments',
      title: 'Benefit Elections & Premium Subsidies',
      description: 'Full active employee benefit enrollments, selected coverage tiers, employee deductions, and employer costs.',
      icon: ShieldCheck,
      color: 'from-teal-500/20 to-cyan-500/10',
      border: 'border-teal-500/30',
      btnColor: 'bg-teal-600 hover:bg-teal-500'
    },
    {
      id: 'SalaryRevisions',
      title: 'Salary Revision & Promotion Audit Trail',
      description: 'Complete chronological history of salary revisions, promotions, merit adjustments, and approver comments.',
      icon: History,
      color: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/30',
      btnColor: 'bg-amber-600 hover:bg-amber-500'
    }
  ];

  const handleDownload = async (reportId: string) => {
    try {
      setDownloading(reportId);
      await compensationApi.downloadReportCsv(reportId);
    } catch (err) {
      alert('Failed to generate report CSV. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Compensation & Benefits Reports</h1>
        <p className="text-xs text-slate-400 mt-1">
          Export statutory, financial, and executive audit datasets directly into CSV spreadsheets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((report) => {
          const Icon = report.icon;
          const isCurrent = downloading === report.id;

          return (
            <div
              key={report.id}
              className={`p-6 rounded-2xl bg-gradient-to-br ${report.color} bg-slate-900/80 backdrop-blur-xl border ${report.border} space-y-4 flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">CSV FORMAT</span>
                </div>

                <h3 className="text-base font-bold text-white">{report.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{report.description}</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleDownload(report.id)}
                  disabled={!!downloading}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-lg transition-all ${report.btnColor} disabled:opacity-50`}
                >
                  <Download className="w-4 h-4" />
                  {isCurrent ? 'Generating Export...' : 'Download CSV Report'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
