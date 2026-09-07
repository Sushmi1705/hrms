import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Plane, Plus, Search, Filter, ChevronRight, Calendar,
  DollarSign, MapPin, Clock, CheckCircle, XCircle, RotateCcw
} from 'lucide-react';
import { getTravelRequests, submitTravelRequest, cancelTravelRequest, approveTravelRequest } from '../api/travelApi';
import { format } from 'date-fns';
import type { TravelFilterDto } from '../types/travel';
import { TRAVEL_STATUSES, TRAVEL_TYPES } from '../types/travel';

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { cls: string; icon: React.ElementType }> = {
    Draft: { cls: 'bg-slate-500/20 text-slate-300 border-slate-500/30', icon: Clock },
    Submitted: { cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: Clock },
    Approved: { cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: CheckCircle },
    Rejected: { cls: 'bg-red-500/20 text-red-300 border-red-500/30', icon: XCircle },
    Cancelled: { cls: 'bg-slate-600/20 text-slate-400 border-slate-600/30', icon: XCircle },
    Completed: { cls: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: CheckCircle },
  };
  const cfg = map[status] ?? { cls: 'bg-slate-700/20 text-slate-400', icon: Clock };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.cls}`}>
      <cfg.icon className="w-3 h-3" />{status}
    </span>
  );
};

export function TravelRequestsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<TravelFilterDto>({ page: 1, pageSize: 20 });
  const [search, setSearch] = useState('');

  const { data = [], isLoading } = useQuery({
    queryKey: ['travel-requests', filter],
    queryFn: () => getTravelRequests({ ...filter, search }),
    staleTime: 30000,
  });

  const submitMut = useMutation({ mutationFn: submitTravelRequest, onSuccess: () => qc.invalidateQueries({ queryKey: ['travel-requests'] }) });
  const cancelMut = useMutation({ mutationFn: cancelTravelRequest, onSuccess: () => qc.invalidateQueries({ queryKey: ['travel-requests'] }) });
  const approveMut = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) => approveTravelRequest(id, approved),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['travel-requests'] })
  });

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plane className="text-blue-400 w-6 h-6" /> Travel Requests
          </h1>
          <p className="text-slate-400 text-sm mt-1">{data.length} requests</p>
        </div>
        <Link to="/travel/requests/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> New Request
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && qc.invalidateQueries({ queryKey: ['travel-requests'] })}
            placeholder="Search destination, purpose..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/50" />
        </div>
        <select value={filter.status ?? ''} onChange={e => setFilter(f => ({ ...f, status: e.target.value || undefined }))}
          className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-blue-500/50">
          <option value="">All Status</option>
          {TRAVEL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filter.travelType ?? ''} onChange={e => setFilter(f => ({ ...f, travelType: e.target.value || undefined }))}
          className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-blue-500/50">
          <option value="">All Types</option>
          {TRAVEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={() => { setFilter({ page: 1, pageSize: 20 }); setSearch(''); }}
          className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1.5 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500">
          <Plane className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium mb-1">No travel requests found</p>
          <p className="text-sm mb-4">Create your first travel request to get started.</p>
          <Link to="/travel/requests/new" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm">
            New Travel Request
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((req) => (
            <div key={req.id} className="group bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 hover:border-blue-500/30 hover:bg-slate-900/80 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <Plane className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-slate-200 font-semibold truncate">{req.purpose || req.destination}</h3>
                      <StatusBadge status={req.status} />
                      <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full">{req.travelType}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span className="text-slate-400 text-sm flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {req.origin} → {req.destination}
                      </span>
                      <span className="text-slate-400 text-sm flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(req.departureDate), 'MMM d')} – {format(new Date(req.returnDate), 'MMM d, yyyy')}
                      </span>
                      <span className="text-slate-400 text-sm flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> {req.currency} {req.estimatedCost.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      {req.employeeName} · {req.department} · {format(new Date(req.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'Draft' && (
                    <button onClick={() => submitMut.mutate(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/40 text-xs font-medium transition-all">
                      Submit
                    </button>
                  )}
                  {req.status === 'Submitted' && (
                    <>
                      <button onClick={() => approveMut.mutate({ id: req.id, approved: true })}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/40 text-xs font-medium transition-all">
                        Approve
                      </button>
                      <button onClick={() => approveMut.mutate({ id: req.id, approved: false })}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/40 text-xs font-medium transition-all">
                        Reject
                      </button>
                    </>
                  )}
                  {(req.status === 'Draft' || req.status === 'Submitted') && (
                    <button onClick={() => cancelMut.mutate(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-700/30 text-slate-400 border border-slate-600/30 hover:bg-slate-700/60 text-xs font-medium transition-all">
                      Cancel
                    </button>
                  )}
                  <Link to={`/travel/requests/${req.id}`} className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
