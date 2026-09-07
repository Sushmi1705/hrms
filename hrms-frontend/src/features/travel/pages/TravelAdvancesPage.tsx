import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Banknote, Plus, CheckCircle, XCircle, Clock, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import { getTravelAdvances, createTravelAdvance, approveTravelAdvance } from '../api/travelApi';
import type { CreateTravelAdvanceDto } from '../types/travel';
import { PAYMENT_METHODS } from '../types/travel';
import { format } from 'date-fns';

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { cls: string; icon: React.ElementType }> = {
    Draft: { cls: 'bg-slate-500/20 text-slate-300 border-slate-500/30', icon: Clock },
    Submitted: { cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: Clock },
    Approved: { cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: CheckCircle },
    Paid: { cls: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: CheckCircle },
    Settled: { cls: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: CheckCircle },
    Rejected: { cls: 'bg-red-500/20 text-red-300 border-red-500/30', icon: XCircle },
    Cancelled: { cls: 'bg-slate-600/20 text-slate-400 border-slate-600/30', icon: XCircle },
  };
  const cfg = map[status] ?? { cls: 'bg-slate-700/20 text-slate-400', icon: Clock };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.cls}`}>
      <cfg.icon className="w-3 h-3" />{status}
    </span>
  );
};

const defaultForm: CreateTravelAdvanceDto = {
  requestedAmount: 0, currency: 'USD', purpose: '',
  requiredDate: '', paymentMethod: 'Bank', notes: '',
};

export function TravelAdvancesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateTravelAdvanceDto>(defaultForm);

  const { data: advances = [], isLoading } = useQuery({ queryKey: ['travel-advances'], queryFn: getTravelAdvances, staleTime: 30000 });

  const createMut = useMutation({
    mutationFn: createTravelAdvance,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['travel-advances'] }); setShowForm(false); setForm(defaultForm); }
  });
  const approveMut = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) => approveTravelAdvance(id, approved),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['travel-advances'] })
  });

  const totalOutstanding = advances.filter(a => ['Approved', 'Paid', 'Submitted'].includes(a.status)).reduce((s, a) => s + a.balance, 0);

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Banknote className="text-amber-400 w-6 h-6" /> Travel Advances
          </h1>
          <p className="text-slate-400 text-sm mt-1">Outstanding: ${totalOutstanding.toLocaleString()}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> Request Advance
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Submitted', count: advances.filter(a => a.status === 'Submitted').length, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Approved', count: advances.filter(a => a.status === 'Approved').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Paid', count: advances.filter(a => a.status === 'Paid').length, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Settled', count: advances.filter(a => a.status === 'Settled').length, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        ].map(card => (
          <div key={card.label} className={`rounded-2xl border ${card.bg} p-4 flex items-center gap-3`}>
            <Banknote className={`w-8 h-8 ${card.color}`} />
            <div>
              <p className="text-2xl font-bold text-white">{card.count}</p>
              <p className="text-slate-400 text-xs">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1528] border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-amber-400" /> Request Travel Advance
            </h2>
            <form onSubmit={e => { e.preventDefault(); createMut.mutate(form); }} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Purpose *</label>
                <input value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} required placeholder="Purpose of advance..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Amount *</label>
                  <input type="number" min={0} step={0.01} value={form.requestedAmount} onChange={e => setForm(f => ({ ...f, requestedAmount: parseFloat(e.target.value) || 0 }))} required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-amber-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Currency</label>
                  <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-amber-500/50">
                    {['USD', 'EUR', 'GBP', 'INR', 'AED'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Required By *</label>
                  <input type="date" value={form.requiredDate} onChange={e => setForm(f => ({ ...f, requiredDate: e.target.value }))} required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-amber-500/50 [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Payment Method</label>
                  <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-amber-500/50">
                    {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Additional information..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-500/50 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setForm(defaultForm); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={createMut.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium disabled:opacity-50">
                  {createMut.isPending ? 'Submitting...' : 'Request Advance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advances List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
        </div>
      ) : advances.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500">
          <Banknote className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium mb-1">No travel advances</p>
          <p className="text-sm mb-4">Request an advance for your upcoming trip.</p>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm">Request Advance</button>
        </div>
      ) : (
        <div className="space-y-3">
          {advances.map((adv) => (
            <div key={adv.id} className="group bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 hover:border-amber-500/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                    <Banknote className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-slate-200 font-semibold">{adv.purpose}</h3>
                      <StatusBadge status={adv.status} />
                    </div>
                    <p className="text-slate-400 text-sm mt-0.5">{adv.employeeName}</p>
                    <div className="flex flex-wrap gap-x-4 mt-1">
                      {adv.travelDestination && (
                        <span className="text-slate-500 text-xs">→ {adv.travelDestination}</span>
                      )}
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Required by: {format(new Date(adv.requiredDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    {adv.settledAmount > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min((adv.settledAmount / adv.requestedAmount) * 100, 100)}%` }} />
                        </div>
                        <span className="text-xs text-slate-400">{Math.round((adv.settledAmount / adv.requestedAmount) * 100)}% settled</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-slate-200 font-bold text-lg">{adv.currency} {adv.requestedAmount.toLocaleString()}</p>
                    {adv.balance !== adv.requestedAmount && (
                      <p className="text-amber-400 text-sm">Balance: {adv.balance.toLocaleString()}</p>
                    )}
                  </div>
                  {adv.status === 'Submitted' && (
                    <div className="flex flex-col gap-1.5">
                      <button onClick={() => approveMut.mutate({ id: adv.id, approved: true })}
                        className="px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/40 text-xs font-medium transition-all">Approve</button>
                      <button onClick={() => approveMut.mutate({ id: adv.id, approved: false })}
                        className="px-3 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/40 text-xs font-medium transition-all">Reject</button>
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
