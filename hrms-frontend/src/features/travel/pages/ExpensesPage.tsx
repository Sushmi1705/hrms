import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Receipt, Plus, Search, Filter, Trash2, Edit2, AlertTriangle,
  CheckCircle, Clock, DollarSign, Tag, Calendar, RotateCcw, AlertCircle
} from 'lucide-react';
import {
  getExpenses, deleteExpense, getExpenseCategories,
  createExpense, updateExpense, checkExpensePolicy
} from '../api/travelApi';
import type { CreateExpenseDto, ExpenseDto } from '../types/travel';
import { PAYMENT_METHODS } from '../types/travel';
import { format } from 'date-fns';

const PolicyBadge = ({ status }: { status: string }) => {
  if (status === 'Compliant') return <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" />Compliant</span>;
  if (status === 'Warning') return <span className="text-amber-400 text-xs flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Warning</span>;
  return <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />Violation</span>;
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Draft: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    Submitted: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Approved: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] ?? 'bg-slate-700/20 text-slate-400'}`}>{status}</span>;
};

const defaultForm: CreateExpenseDto = {
  categoryId: '', expenseDate: '', merchant: '', description: '',
  amount: 0, currency: 'USD', exchangeRate: 1, paymentMethod: 'Personal', notes: '',
};

export function ExpensesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ExpenseDto | null>(null);
  const [form, setForm] = useState<CreateExpenseDto>(defaultForm);
  const [search, setSearch] = useState('');
  const [policyResult, setPolicyResult] = useState<{ status: string; message: string } | null>(null);

  const { data: expenses = [], isLoading } = useQuery({ queryKey: ['expenses'], queryFn: () => getExpenses(), staleTime: 30000 });
  const { data: categories = [] } = useQuery({ queryKey: ['expense-categories'], queryFn: getExpenseCategories, staleTime: 300000 });

  const createMut = useMutation({
    mutationFn: createExpense,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['expenses'] }); setShowForm(false); setForm(defaultForm); setPolicyResult(null); }
  });
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CreateExpenseDto }) => updateExpense(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['expenses'] }); setEditItem(null); setShowForm(false); setForm(defaultForm); setPolicyResult(null); }
  });
  const deleteMut = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] })
  });

  const handleAmountChange = async (val: number) => {
    setForm(f => ({ ...f, amount: val }));
    if (form.categoryId && val > 0) {
      try {
        const result = await checkExpensePolicy(form.categoryId, val, form.currency);
        setPolicyResult(result);
      } catch { setPolicyResult(null); }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) updateMut.mutate({ id: editItem.id, dto: form });
    else createMut.mutate(form);
  };

  const openEdit = (exp: ExpenseDto) => {
    setEditItem(exp);
    setForm({ categoryId: exp.categoryId, expenseDate: exp.expenseDate.slice(0, 10), merchant: exp.merchant, description: exp.description, amount: exp.amount, currency: exp.currency, exchangeRate: exp.exchangeRate, paymentMethod: exp.paymentMethod, receiptDocumentId: exp.receiptDocumentId, notes: exp.notes });
    setShowForm(true);
  };

  const filtered = expenses.filter(e =>
    !search || e.merchant.toLowerCase().includes(search.toLowerCase()) ||
    e.categoryName.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = filtered.reduce((sum, e) => sum + e.convertedAmount, 0);

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Receipt className="text-purple-400 w-6 h-6" /> My Expenses
          </h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} expenses · Total: ${totalAmount.toLocaleString()}</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditItem(null); setForm(defaultForm); setPolicyResult(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> Log Expense
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search merchant, category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-purple-500/50" />
        </div>
        {search && (
          <button onClick={() => setSearch('')} className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1.5 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Expense Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1528] border border-slate-700/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-purple-400" />
              {editItem ? 'Edit Expense' : 'Log New Expense'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Category *</label>
                  <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Date *</label>
                  <input type="date" value={form.expenseDate} onChange={e => setForm(f => ({ ...f, expenseDate: e.target.value }))} required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50 [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Amount *</label>
                  <input type="number" min={0} step={0.01} value={form.amount}
                    onChange={e => handleAmountChange(parseFloat(e.target.value) || 0)} required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Currency</label>
                  <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50">
                    {['USD', 'EUR', 'GBP', 'INR', 'AED', 'SGD', 'AUD', 'CAD'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Policy Check Result */}
              {policyResult && (
                <div className={`p-3 rounded-xl border text-sm flex items-center gap-2 ${
                  policyResult.status === 'Compliant' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
                  policyResult.status === 'Warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                  'bg-red-500/10 border-red-500/30 text-red-300'
                }`}>
                  {policyResult.status === 'Compliant' ? <CheckCircle className="w-4 h-4 shrink-0" /> :
                   policyResult.status === 'Warning' ? <AlertTriangle className="w-4 h-4 shrink-0" /> :
                   <AlertCircle className="w-4 h-4 shrink-0" />}
                  {policyResult.message}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Merchant *</label>
                <input value={form.merchant} onChange={e => setForm(f => ({ ...f, merchant: e.target.value }))} required placeholder="Vendor/merchant name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Payment Method</label>
                <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50">
                  {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Additional notes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditItem(null); setPolicyResult(null); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-slate-200 text-sm font-medium transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={createMut.isPending || updateMut.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all disabled:opacity-50">
                  {(createMut.isPending || updateMut.isPending) ? 'Saving...' : editItem ? 'Update' : 'Log Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expenses List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500">
          <Receipt className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium mb-1">No expenses found</p>
          <p className="text-sm mb-4">Start logging your business expenses.</p>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm">Log Expense</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((exp) => (
            <div key={exp.id} className="group bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 hover:border-purple-500/30 hover:bg-slate-900/80 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                    <Receipt className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-slate-200 font-semibold">{exp.merchant}</h3>
                      <StatusBadge status={exp.status} />
                      <PolicyBadge status={exp.policyStatus} />
                    </div>
                    <p className="text-slate-400 text-sm mt-0.5">{exp.description || exp.categoryName}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {exp.categoryName}
                      </span>
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {format(new Date(exp.expenseDate), 'MMM d, yyyy')}
                      </span>
                      <span className="text-slate-500 text-xs">{exp.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-slate-200 font-semibold">{exp.currency} {exp.amount.toLocaleString()}</p>
                    {exp.exchangeRate !== 1 && (
                      <p className="text-slate-500 text-xs">≈ ${exp.convertedAmount.toLocaleString()}</p>
                    )}
                  </div>
                  {exp.status === 'Draft' && (
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(exp)} className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteMut.mutate(exp.id)} className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
