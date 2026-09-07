import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, Plus, CheckCircle, XCircle, Clock, AlertTriangle,
  DollarSign, Calendar, ChevronRight, Send, Loader2, Filter
} from 'lucide-react';
import {
  getExpenseReports, createExpenseReport, submitExpenseReport,
  approveExpenseReport, getExpenses, getTrips
} from '../api/travelApi';
import type { CreateExpenseReportDto } from '../types/travel';
import { format } from 'date-fns';

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Draft: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    Submitted: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    ManagerReview: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    FinanceReview: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    Approved: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    ReimbursementPending: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    Reimbursed: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Closed: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
    Rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${map[status] ?? 'bg-slate-700/20 text-slate-400'}`}>{status}</span>;
};

const defaultForm: CreateExpenseReportDto = {
  title: '', periodStart: '', periodEnd: '',
  currency: 'USD', advanceApplied: 0, expenseIds: [], notes: '',
};

export function ExpenseReportsPage() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateExpenseReportDto>(defaultForm);
  const [statusFilter, setStatusFilter] = useState('');

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['expense-reports', statusFilter],
    queryFn: () => getExpenseReports(statusFilter || undefined),
    staleTime: 30000,
  });
  const { data: expenses = [] } = useQuery({ queryKey: ['expenses-draft'], queryFn: () => getExpenses(), staleTime: 30000 });
  const draftExpenses = expenses.filter(e => e.status === 'Draft');

  const createMut = useMutation({
    mutationFn: createExpenseReport,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['expense-reports'] }); setShowCreate(false); setForm(defaultForm); }
  });
  const submitMut = useMutation({
    mutationFn: submitExpenseReport,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expense-reports'] })
  });
  const approveMut = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) => approveExpenseReport(id, approved),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expense-reports'] })
  });

  const toggleExpense = (id: string) => {
    setForm(f => ({ ...f, expenseIds: f.expenseIds.includes(id) ? f.expenseIds.filter(x => x !== id) : [...f.expenseIds, id] }));
  };

  const selectedTotal = draftExpenses.filter(e => form.expenseIds.includes(e.id)).reduce((s, e) => s + e.convertedAmount, 0);

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-cyan-400 w-6 h-6" /> Expense Reports
          </h1>
          <p className="text-slate-400 text-sm mt-1">{reports.length} reports</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> New Report
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['', 'Draft', 'Submitted', 'ManagerReview', 'FinanceReview', 'Approved', 'Reimbursed', 'Rejected'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
              statusFilter === s
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:text-slate-200 hover:border-slate-600/50'
            }`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Create Report Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1528] border border-slate-700/50 rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" /> Create Expense Report
            </h2>
            <form onSubmit={e => { e.preventDefault(); createMut.mutate(form); }} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Report Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g., Q3 Business Trip - Singapore"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Period Start *</label>
                  <input type="date" value={form.periodStart} onChange={e => setForm(f => ({ ...f, periodStart: e.target.value }))} required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Period End *</label>
                  <input type="date" value={form.periodEnd} onChange={e => setForm(f => ({ ...f, periodEnd: e.target.value }))} required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Currency</label>
                  <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50">
                    {['USD', 'EUR', 'GBP', 'INR', 'AED'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Advance Applied</label>
                  <input type="number" min={0} step={0.01} value={form.advanceApplied} onChange={e => setForm(f => ({ ...f, advanceApplied: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>

              {/* Select Expenses */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Select Expenses ({form.expenseIds.length} selected · Total: ${selectedTotal.toLocaleString()})
                </label>
                {draftExpenses.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No draft expenses available</p>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-700/50 rounded-xl p-3 bg-slate-800/30">
                    {draftExpenses.map(exp => (
                      <label key={exp.id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${form.expenseIds.includes(exp.id) ? 'bg-cyan-500/10 border border-cyan-500/30' : 'hover:bg-slate-800/50 border border-transparent'}`}>
                        <input type="checkbox" checked={form.expenseIds.includes(exp.id)} onChange={() => toggleExpense(exp.id)}
                          className="w-4 h-4 rounded accent-cyan-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 text-sm font-medium">{exp.merchant}</p>
                          <p className="text-slate-400 text-xs">{exp.categoryName} · {format(new Date(exp.expenseDate), 'MMM d, yyyy')}</p>
                        </div>
                        <span className="text-slate-300 text-sm font-medium shrink-0">{exp.currency} {exp.amount.toLocaleString()}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Additional notes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreate(false); setForm(defaultForm); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-slate-200 text-sm font-medium transition-all">Cancel</button>
                <button type="submit" disabled={createMut.isPending || form.expenseIds.length === 0}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-all disabled:opacity-50">
                  {createMut.isPending ? 'Creating...' : 'Create Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reports List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500">
          <FileText className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium mb-1">No expense reports found</p>
          <p className="text-sm mb-4">Create a report to submit your expenses for reimbursement.</p>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm">New Report</button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="group bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 hover:border-cyan-500/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-slate-200 font-semibold">{report.title}</h3>
                      <StatusBadge status={report.status} />
                      <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full font-mono">{report.reportNumber}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span className="text-slate-400 text-sm">{report.employeeName} · {report.department}</span>
                      <span className="text-slate-400 text-sm flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {format(new Date(report.periodStart), 'MMM d')} – {format(new Date(report.periodEnd), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 mt-1">
                      <span className="text-slate-500 text-xs">{report.expenses?.length ?? 0} expenses</span>
                      {report.violationCount > 0 && (
                        <span className="text-red-400 text-xs flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{report.violationCount} violation{report.violationCount > 1 ? 's' : ''}</span>
                      )}
                      <span className="text-slate-500 text-xs">Advance: ${report.advanceApplied.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-slate-200 font-bold text-lg">${report.totalAmount.toLocaleString()}</p>
                    <p className="text-emerald-400 text-sm">Reimb: ${report.reimbursableAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {report.status === 'Draft' && (
                      <button onClick={() => submitMut.mutate(report.id)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/40 text-xs font-medium transition-all flex items-center gap-1">
                        <Send className="w-3 h-3" /> Submit
                      </button>
                    )}
                    {(report.status === 'Submitted' || report.status === 'ManagerReview' || report.status === 'FinanceReview') && (
                      <>
                        <button onClick={() => approveMut.mutate({ id: report.id, approved: true })}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/40 text-xs font-medium transition-all">
                          Approve
                        </button>
                        <button onClick={() => approveMut.mutate({ id: report.id, approved: false })}
                          className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/40 text-xs font-medium transition-all">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
