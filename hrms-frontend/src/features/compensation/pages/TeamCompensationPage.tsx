import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, Plus, ArrowUpRight } from 'lucide-react';
import { compensationApi } from '../api/compensationApi';
import { EmployeeCompensation } from '../types/compensation';
import { SalaryRevisionModal } from '../components/SalaryRevisionModal';

export const TeamCompensationPage: React.FC = () => {
  const [team, setTeam] = useState<EmployeeCompensation[]>([]);
  const [loading, setLoading] = useState(true);

  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [selectedEmployeeForRevision, setSelectedEmployeeForRevision] = useState<EmployeeCompensation | null>(null);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await compensationApi.getTeamCompensation();
      setTeam(data);
    } catch (err) {
      console.error('Failed to load team compensation', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenRevision = (emp: EmployeeCompensation) => {
    setSelectedEmployeeForRevision(emp);
    setIsRevisionModalOpen(true);
  };

  const handleCreateRevision = async (data: any) => {
    await compensationApi.createSalaryRevision(data);
    alert('Salary revision request submitted to compensation committee!');
    await fetchTeam();
  };

  const avgSalary =
    team.length > 0 ? Math.round(team.reduce((sum, e) => sum + e.baseSalary, 0) / team.length) : 0;
  const avgCompa =
    team.length > 0
      ? (team.reduce((sum, e) => sum + (e.compaRatio || 1.0), 0) / team.length).toFixed(2)
      : '1.00';

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Team Compensation Overview</h1>
        <p className="text-xs text-slate-400 mt-1">
          Direct report salary structures, market benchmark positioning, and merit increase nominations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-transparent bg-slate-900/80 border border-indigo-500/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Team Size</span>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">{team.length} Members</div>
          <p className="text-xs text-slate-400 mt-1">Direct reports in your organization</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent bg-slate-900/80 border border-emerald-500/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Base Salary</span>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">${avgSalary.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1">Annual base salary</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent bg-slate-900/80 border border-purple-500/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Average Compa-Ratio
          </span>
          <div className="text-3xl font-extrabold font-mono text-purple-400 mt-1">
            {avgCompa} ({((parseFloat(avgCompa) || 1) * 100).toFixed(0)}%)
          </div>
          <p className="text-xs text-slate-400 mt-1">Market midpoint reference</p>
        </div>
      </div>

      {/* Team Roster Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-800/40 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Pay Grade</th>
                <th className="py-3 px-4">Base Salary</th>
                <th className="py-3 px-4">Monthly Total</th>
                <th className="py-3 px-4">Compa-Ratio</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {team.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{emp.employeeName}</div>
                    <div className="text-[11px] text-slate-400">
                      {emp.employeeNumber} &bull; {emp.departmentName}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {emp.gradeCode || 'Standard'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white">${emp.baseSalary.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">
                    ${emp.monthlyTotalCompensation.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono font-bold text-[11px] ${
                        (emp.compaRatio || 1.0) < 0.9
                          ? 'bg-amber-500/10 text-amber-400'
                          : (emp.compaRatio || 1.0) > 1.15
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {emp.compaRatio || 1.0}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenRevision(emp)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      Propose Increase <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEmployeeForRevision && (
        <SalaryRevisionModal
          isOpen={isRevisionModalOpen}
          onClose={() => {
            setIsRevisionModalOpen(false);
            setSelectedEmployeeForRevision(null);
          }}
          onSubmit={handleCreateRevision}
          employees={team.map((t) => ({
            id: t.employeeId,
            name: t.employeeName,
            employeeNumber: t.employeeNumber,
            currentSalary: t.baseSalary
          }))}
          defaultEmployeeId={selectedEmployeeForRevision.employeeId}
          defaultCurrentSalary={selectedEmployeeForRevision.baseSalary}
        />
      )}
    </div>
  );
};
