import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { compensationApi } from '../api/compensationApi';
import {
  CompensationDashboardMetrics,
  SalaryRevision,
  PayGrade,
  CompensationComponent
} from '../types/compensation';
import { CompensationStatsCards } from '../components/CompensationStatsCards';
import { SalaryRevisionModal } from '../components/SalaryRevisionModal';
import { SalaryRevisionActionModal } from '../components/SalaryRevisionActionModal';
import { BonusModal } from '../components/BonusModal';
import { PayGradeModal } from '../components/PayGradeModal';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#3b82f6'];

export const CompensationDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<CompensationDashboardMetrics | null>(null);
  const [revisions, setRevisions] = useState<SalaryRevision[]>([]);
  const [payGrades, setPayGrades] = useState<PayGrade[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedRevisionForAction, setSelectedRevisionForAction] = useState<SalaryRevision | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [m, revs, grades, empList] = await Promise.all([
        compensationApi.getDashboard(),
        compensationApi.getSalaryRevisions('Submitted', 1, 5),
        compensationApi.getPayGrades(),
        compensationApi.getEmployeeCompensations({ pageSize: 100 })
      ]);
      setMetrics(m);
      setRevisions(revs.items);
      setPayGrades(grades);
      setEmployees(
        empList.items.map((e) => ({
          id: e.employeeId,
          name: e.employeeName,
          employeeNumber: e.employeeNumber,
          currentSalary: e.baseSalary
        }))
      );
    } catch (err) {
      console.error('Failed to load compensation dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRevision = async (data: any) => {
    await compensationApi.createSalaryRevision(data);
    await fetchData();
  };

  const handleRevisionAction = async (action: 'Approve' | 'Reject', comments: string) => {
    if (!selectedRevisionForAction) return;
    await compensationApi.processSalaryRevisionAction(selectedRevisionForAction.id, action, comments);
    await fetchData();
  };

  const handleCreateBonus = async (data: any) => {
    await compensationApi.createBonus(data);
    await fetchData();
  };

  const handleCreateGrade = async (data: any) => {
    await compensationApi.createPayGrade(data);
    await fetchData();
  };

  const formatCurrency = (val: number) => `$${(val / 1000).toFixed(0)}k`;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              Benefits & Compensation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Enterprise Suite
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Executive oversight of salary structures, compa-ratio distribution, merit reviews, and total rewards
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsRevisionModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            Request Revision
          </button>
          <button
            onClick={() => setIsBonusModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/20 transition-all"
          >
            <Award className="w-4 h-4" />
            Award Bonus
          </button>
          <button
            onClick={() => setIsGradeModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            New Pay Grade
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <CompensationStatsCards metrics={metrics} loading={loading} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compa-Ratio Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Compa-Ratio Distribution</h3>
              <p className="text-xs text-slate-400">Position against pay grade midpoint (100% is market reference)</p>
            </div>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64 w-full">
            {metrics?.salaryDistribution || metrics?.compaRatioBands ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.salaryDistribution ? metrics.salaryDistribution.map(s => ({ band: s.rangeLabel, count: s.count })) : (metrics.compaRatioBands || [])}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="band" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">Loading chart...</div>
            )}
          </div>
        </div>

        {/* Spend by Department */}
        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Department Spend</h3>
              <p className="text-xs text-slate-400">Annual compensation cost allocation</p>
            </div>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64 w-full">
            {metrics?.departmentCostBreakdown || metrics?.departmentCompensation ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics?.departmentCostBreakdown ? metrics.departmentCostBreakdown.map(d => ({ departmentName: d.departmentName, totalSpend: d.totalCost })) : (metrics?.departmentCompensation || [])}
                    dataKey="totalSpend"
                    nameKey="departmentName"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {(metrics?.departmentCostBreakdown || metrics?.departmentCompensation || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Total Spend']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">Loading chart...</div>
            )}
          </div>
        </div>

        {/* Pay Grade Benchmark Averages */}
        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Pay Grade Benchmarks</h3>
              <p className="text-xs text-slate-400">Average base salary by hierarchical grade</p>
            </div>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Layers className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64 w-full">
            {metrics?.payGradeBreakdown || metrics?.gradeDistribution ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.payGradeBreakdown ? metrics.payGradeBreakdown.map(g => ({ gradeCode: g.gradeCode, averageBaseSalary: g.averageActualSalary })) : (metrics?.gradeDistribution || [])} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={formatCurrency} />
                  <YAxis dataKey="gradeCode" type="category" stroke="#94a3b8" fontSize={11} width={40} />
                  <Tooltip
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Avg Base Salary']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="averageBaseSalary" fill="#a855f7" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">Loading chart...</div>
            )}
          </div>
        </div>
      </div>

      {/* Pending Revisions Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Pending Salary Revision Approvals</h3>
            <p className="text-xs text-slate-400">Compensation change proposals awaiting committee decision</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 font-mono">
            {revisions.length} Awaiting Action
          </span>
        </div>

        {revisions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No salary revisions currently awaiting approval.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-800/40 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Current Salary</th>
                  <th className="py-3 px-4">Proposed Salary</th>
                  <th className="py-3 px-4">Increase %</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {revisions.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-300">{rev.revisionNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{rev.employeeName}</div>
                      <div className="text-[11px] text-slate-400">{rev.departmentName}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">${rev.currentSalary.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      ${rev.proposedSalary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        +{rev.percentageIncrease}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{rev.reason}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedRevisionForAction(rev)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-semibold border border-indigo-500/30 transition-colors"
                      >
                        Review Decision
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <SalaryRevisionModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onSubmit={handleCreateRevision}
        employees={employees}
      />

      <SalaryRevisionActionModal
        isOpen={!!selectedRevisionForAction}
        onClose={() => setSelectedRevisionForAction(null)}
        onConfirm={handleRevisionAction}
        revision={selectedRevisionForAction}
      />

      <BonusModal
        isOpen={isBonusModalOpen}
        onClose={() => setIsBonusModalOpen(false)}
        onSubmit={handleCreateBonus}
        employees={employees}
      />

      <PayGradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        onSubmit={handleCreateGrade}
      />
    </div>
  );
};
