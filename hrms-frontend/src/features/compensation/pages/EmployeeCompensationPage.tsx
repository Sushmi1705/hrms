import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Clock,
  ChevronRight,
  X,
  History,
  CheckCircle,
  Plus
} from 'lucide-react';
import { compensationApi } from '../api/compensationApi';
import {
  EmployeeCompensation,
  EmployeeCompensationDetail,
  PayGrade,
  SalaryBand,
  CompensationComponent
} from '../types/compensation';
import { EmployeeCompensationModal } from '../components/EmployeeCompensationModal';
import { SalaryRevisionModal } from '../components/SalaryRevisionModal';

export const EmployeeCompensationPage: React.FC = () => {
  const [compensations, setCompensations] = useState<EmployeeCompensation[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedCompaStatus, setSelectedCompaStatus] = useState('');
  const [page, setPage] = useState(1);

  // Detail Drawer
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [compDetail, setCompDetail] = useState<EmployeeCompensationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Metadata for modals
  const [payGrades, setPayGrades] = useState<PayGrade[]>([]);
  const [salaryBands, setSalaryBands] = useState<SalaryBand[]>([]);
  const [components, setComponents] = useState<CompensationComponent[]>([]);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);

  const fetchCompensations = async () => {
    try {
      setLoading(true);
      const res = await compensationApi.getEmployeeCompensations({
        search: search || undefined,
        payGradeId: selectedGrade || undefined,
        page,
        pageSize: 15
      });
      let items = res.items;
      if (selectedCompaStatus) {
        items = items.filter((c) => c.compaRatioStatus === selectedCompaStatus);
      }
      setCompensations(items);
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error('Failed to fetch employee compensations', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [g, b, c] = await Promise.all([
        compensationApi.getPayGrades(),
        compensationApi.getSalaryBands(),
        compensationApi.getComponents()
      ]);
      setPayGrades(g);
      setSalaryBands(b);
      setComponents(c);
    } catch (err) {
      console.error('Failed to load metadata', err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompensations();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedGrade, selectedCompaStatus, page]);

  const handleOpenDetail = async (comp: EmployeeCompensation) => {
    try {
      setSelectedCompId(comp.employeeId);
      setDetailLoading(true);
      const detail = await compensationApi.getEmployeeCompensationDetail(comp.employeeId);
      setCompDetail(detail);
    } catch (err) {
      console.error('Failed to fetch compensation detail', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSaveCompensation = async (data: any) => {
    await compensationApi.upsertEmployeeCompensation(data);
    await fetchCompensations();
    if (selectedCompId) {
      const updated = await compensationApi.getEmployeeCompensationDetail(selectedCompId);
      setCompDetail(updated);
    }
  };

  const handleCreateRevision = async (data: any) => {
    await compensationApi.createSalaryRevision(data);
    alert('Salary revision proposal submitted to workflow committee!');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Employee Compensation Roster</h1>
          <p className="text-xs text-slate-400 mt-1">
            Active salary structures, market compa-ratio alignment, and historical progression audit
          </p>
        </div>

        <button
          onClick={() => setIsAdjustModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Assign / Adjust Salary
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee name, ID, or grade..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <div className="w-44">
          <select
            value={selectedGrade}
            onChange={(e) => {
              setSelectedGrade(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="">All Pay Grades</option>
            {payGrades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.code} ({g.name})
              </option>
            ))}
          </select>
        </div>

        <div className="w-44">
          <select
            value={selectedCompaStatus}
            onChange={(e) => {
              setSelectedCompaStatus(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="">All Compa-Ratios</option>
            <option value="BelowRange">Below Range (&lt; 0.90)</option>
            <option value="WithinRange">Within Range (0.90 - 1.15)</option>
            <option value="AboveRange">Above Range (&gt; 1.15)</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
            Loading employee compensation records...
          </div>
        ) : compensations.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No employee compensation records found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-800/40 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Grade & Band</th>
                  <th className="py-3 px-4">Base Salary</th>
                  <th className="py-3 px-4">Monthly Total</th>
                  <th className="py-3 px-4">Annual Package</th>
                  <th className="py-3 px-4">Compa-Ratio</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {compensations.map((c) => {
                  const compaRatioNum = c.compaRatio || 1.0;
                  const compaPct = (compaRatioNum * 100).toFixed(0);

                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleOpenDetail(c)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{c.employeeName}</div>
                        <div className="text-[11px] text-slate-400">
                          {c.employeeNumber} &bull; {c.departmentName}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 mr-1.5">
                          {c.gradeCode || 'N/A'}
                        </span>
                        <span className="text-slate-400 text-[11px] truncate max-w-[120px] inline-block align-middle">
                          {c.bandName || 'Standard'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ${c.baseSalary.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400">
                        ${c.monthlyTotalCompensation.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-200">
                        ${c.annualTotalCompensation.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono font-bold text-[11px] ${
                              c.compaRatioStatus === 'BelowRange'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : c.compaRatioStatus === 'AboveRange'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {c.compaRatio} ({compaPct}%)
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1">
                          View Breakdown <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Slideover Drawer */}
      {selectedCompId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                  Employee Compensation Record
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {compDetail?.employeeName || 'Compensation Detail'}
                </h2>
                <p className="text-xs text-slate-400">
                  {compDetail?.employeeNumber} &bull; {compDetail?.departmentName} &bull; {compDetail?.designationTitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedCompId(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailLoading || !compDetail ? (
              <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Loading details...</div>
            ) : (
              <div className="space-y-6">
                {/* Benchmark Card */}
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">Grade & Market Positioning</span>
                    <span className="font-mono text-indigo-400 font-bold">
                      Compa-Ratio: {compDetail.compaRatio} ({((compDetail.compaRatio || 1) * 100).toFixed(0)}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-lg bg-slate-900">
                      <span className="text-[10px] text-slate-500 block">Min</span>
                      <span className="text-white">${compDetail.bandMin.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-indigo-500/30">
                      <span className="text-[10px] text-indigo-400 block">Midpoint (P50)</span>
                      <span className="text-indigo-300 font-bold">${compDetail.bandMidpoint.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900">
                      <span className="text-[10px] text-slate-500 block">Max</span>
                      <span className="text-white">${compDetail.bandMax.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Component Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Monthly Allowances & Deductions
                  </h3>
                  <div className="space-y-2">
                    {compDetail.assignments?.map((a, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/40 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-white">{a.componentName}</span>
                          <span className="ml-2 font-mono text-[10px] text-slate-400">({a.componentCode})</span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-white">
                            ${a.calculatedMonthlyAmount.toLocaleString()} / mo
                          </div>
                          <div className="text-[10px] text-slate-500">
                            ${a.calculatedAnnualAmount.toLocaleString()} / yr
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historical Salary Evolution */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-indigo-400" />
                      Salary Revision Audit Trail
                    </h3>
                  </div>

                  {compDetail.history?.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-800/20 text-center text-slate-500 text-xs">
                      No historical revisions recorded.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {compDetail.history?.map((h) => (
                        <div
                          key={h.id}
                          className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-indigo-300">{h.changeType}</span>
                            <span className="font-mono text-emerald-400 font-bold">
                              +${h.increaseAmount.toLocaleString()} (+{h.percentageIncrease}%)
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>From: ${h.previousSalary.toLocaleString()}</span>
                            <span>To: ${h.newSalary.toLocaleString()}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                            {h.reason} &bull; Approved by {h.approvedBy} on {new Date(h.effectiveDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Drawer Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsRevisionModalOpen(true);
                    }}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-colors"
                  >
                    Propose Salary Revision
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <EmployeeCompensationModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        onSubmit={handleSaveCompensation}
        employees={compensations.map((c) => ({
          id: c.employeeId,
          name: c.employeeName,
          employeeNumber: c.employeeNumber,
          departmentName: c.departmentName
        }))}
        payGrades={payGrades}
        salaryBands={salaryBands}
        components={components}
        initialEmployeeId={compDetail?.employeeId}
        initialBaseSalary={compDetail?.baseSalary}
      />

      <SalaryRevisionModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onSubmit={handleCreateRevision}
        employees={compensations.map((c) => ({
          id: c.employeeId,
          name: c.employeeName,
          employeeNumber: c.employeeNumber,
          currentSalary: c.baseSalary
        }))}
        defaultEmployeeId={compDetail?.employeeId}
        defaultCurrentSalary={compDetail?.baseSalary}
      />
    </div>
  );
};
