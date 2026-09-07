import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, XCircle, Clock, Plus, Filter } from 'lucide-react';
import { compensationApi } from '../api/compensationApi';
import { SalaryRevision } from '../types/compensation';
import { SalaryRevisionModal } from '../components/SalaryRevisionModal';
import { SalaryRevisionActionModal } from '../components/SalaryRevisionActionModal';

export const SalaryRevisionsPage: React.FC = () => {
  const [revisions, setRevisions] = useState<SalaryRevision[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);

  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [selectedRevisionForAction, setSelectedRevisionForAction] = useState<SalaryRevision | null>(null);

  const fetchRevisions = async () => {
    try {
      setLoading(true);
      const res = await compensationApi.getSalaryRevisions(statusFilter || undefined, 1, 50);
      setRevisions(res.items);
    } catch (err) {
      console.error('Failed to fetch salary revisions', err);
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
          employeeNumber: e.employeeNumber,
          currentSalary: e.baseSalary
        }))
      );
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, [statusFilter]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateRevision = async (data: any) => {
    await compensationApi.createSalaryRevision(data);
    await fetchRevisions();
  };

  const handleRevisionAction = async (action: 'Approve' | 'Reject', comments: string) => {
    if (!selectedRevisionForAction) return;
    await compensationApi.processSalaryRevisionAction(selectedRevisionForAction.id, action, comments);
    await fetchRevisions();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Salary Revisions & Approvals</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise workflow requests for promotions, merit adjustments, and compensation corrections
          </p>
        </div>

        <button
          onClick={() => setIsRevisionModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Request Revision
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        {[
          { label: 'All Requests', val: '' },
          { label: 'Pending Approval', val: 'Submitted' },
          { label: 'Approved', val: 'Approved' },
          { label: 'Rejected', val: 'Rejected' }
        ].map((t) => (
          <button
            key={t.val}
            onClick={() => setStatusFilter(t.val)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
              statusFilter === t.val
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Revisions Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm animate-pulse">Loading revision records...</div>
        ) : revisions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No salary revisions found for this status.
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
                  <th className="py-3 px-4">Effective Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {revisions.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">{rev.revisionNumber}</td>
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
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {new Date(rev.effectiveDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 w-fit ${
                          rev.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : rev.status === 'Rejected'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {rev.status === 'Approved' && <CheckCircle className="w-3.5 h-3.5" />}
                        {rev.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                        {rev.status === 'Submitted' && <Clock className="w-3.5 h-3.5" />}
                        {rev.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {rev.status === 'Submitted' ? (
                        <button
                          onClick={() => setSelectedRevisionForAction(rev)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                        >
                          Review Decision
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">Completed</span>
                      )}
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
    </div>
  );
};
