import React, { useState, useEffect } from 'react';
import { Award, DollarSign, Calendar, Plus, CheckCircle, Clock } from 'lucide-react';
import { compensationApi } from '../api/compensationApi';
import { EmployeeBonus } from '../types/compensation';
import { BonusModal } from '../components/BonusModal';

export const BonusesPage: React.FC = () => {
  const [bonuses, setBonuses] = useState<EmployeeBonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);

  const fetchBonuses = async () => {
    try {
      setLoading(true);
      const data = await compensationApi.getBonuses();
      setBonuses(data);
    } catch (err) {
      console.error('Failed to fetch bonuses', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await compensationApi.getEmployeeCompensations({ pageSize: 100 });
      setEmployees(
        res.items.map((e) => ({
          id: e.employeeId,
          name: e.employeeName,
          employeeNumber: e.employeeNumber
        }))
      );
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  useEffect(() => {
    fetchBonuses();
    fetchEmployees();
  }, []);

  const handleCreateBonus = async (data: any) => {
    await compensationApi.createBonus(data);
    await fetchBonuses();
  };

  const totalDisbursed = bonuses.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Bonuses & Variable Incentives</h1>
          <p className="text-xs text-slate-400 mt-1">
            Spot awards, quarterly performance achievements, retention milestones, and profit-sharing
          </p>
        </div>

        <button
          onClick={() => setIsBonusModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Award Variable Pay
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent bg-slate-900/80 border border-amber-500/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total YTD Bonuses</span>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">
            ${totalDisbursed.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Across {bonuses.length} approved employee awards</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-transparent bg-slate-900/80 border border-indigo-500/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Bonus Amount</span>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">
            ${bonuses.length > 0 ? Math.round(totalDisbursed / bonuses.length).toLocaleString() : '0'}
          </div>
          <p className="text-xs text-slate-400 mt-1">Target achievement rate: ~105%</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent bg-slate-900/80 border border-emerald-500/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Payroll Integration</span>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">Ready</div>
          <p className="text-xs text-slate-400 mt-1">Directly feeds into monthly payroll run</p>
        </div>
      </div>

      {/* Bonus Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm animate-pulse">Loading bonuses...</div>
        ) : bonuses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No bonus awards found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-800/40 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Incentive Category</th>
                  <th className="py-3 px-4">Awarded Amount</th>
                  <th className="py-3 px-4">Achievement %</th>
                  <th className="py-3 px-4">Payout Date</th>
                  <th className="py-3 px-4">Milestone Reason</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {bonuses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{b.employeeName}</div>
                      <div className="text-[11px] text-slate-400">{b.departmentName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {b.bonusType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                      ${b.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {b.achievementPercentage ? `${b.achievementPercentage.toFixed(0)}%` : '100%'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {b.paymentDate ? new Date(b.paymentDate).toLocaleDateString() : 'Next Cycle'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{b.reason}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BonusModal
        isOpen={isBonusModalOpen}
        onClose={() => setIsBonusModalOpen(false)}
        onSubmit={handleCreateBonus}
        employees={employees}
      />
    </div>
  );
};
