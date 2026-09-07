import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Plane, Receipt, DollarSign, Clock, CheckCircle, AlertTriangle,
  TrendingUp, MapPin, BarChart3, FileText, ArrowRight, Banknote, AlertCircle
} from 'lucide-react';
import { getTravelDashboard } from '../api/travelApi';
import { format } from 'date-fns';

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    Draft: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    Submitted: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Approved: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
    InProgress: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Completed: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Cancelled: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] || 'bg-slate-700/20 text-slate-400'}`}>
      {status}
    </span>
  );
};

export function TravelDashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['travel-dashboard'], queryFn: getTravelDashboard, staleTime: 60000 });

  const statCards = [
    { label: 'Total Requests', value: data?.totalTravelRequests ?? 0, icon: Plane, color: 'from-blue-500/20 to-blue-600/20', iconColor: 'text-blue-400', border: 'border-blue-500/20' },
    { label: 'Pending Approvals', value: data?.pendingApprovals ?? 0, icon: Clock, color: 'from-amber-500/20 to-amber-600/20', iconColor: 'text-amber-400', border: 'border-amber-500/20' },
    { label: 'Active Trips', value: data?.activeTrips ?? 0, icon: MapPin, color: 'from-purple-500/20 to-purple-600/20', iconColor: 'text-purple-400', border: 'border-purple-500/20' },
    { label: 'Total Spend', value: `$${(data?.totalTravelSpend ?? 0).toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500/20 to-emerald-600/20', iconColor: 'text-emerald-400', border: 'border-emerald-500/20' },
    { label: 'Pending Reports', value: data?.pendingExpenseReports ?? 0, icon: FileText, color: 'from-cyan-500/20 to-cyan-600/20', iconColor: 'text-cyan-400', border: 'border-cyan-500/20' },
    { label: 'Finance Review', value: data?.pendingFinanceReview ?? 0, icon: BarChart3, color: 'from-indigo-500/20 to-indigo-600/20', iconColor: 'text-indigo-400', border: 'border-indigo-500/20' },
    { label: 'Outstanding Advances', value: `$${(data?.outstandingAdvances ?? 0).toLocaleString()}`, icon: Banknote, color: 'from-orange-500/20 to-orange-600/20', iconColor: 'text-orange-400', border: 'border-orange-500/20' },
    { label: 'Policy Violations', value: data?.policyViolations ?? 0, icon: AlertTriangle, color: 'from-red-500/20 to-red-600/20', iconColor: 'text-red-400', border: 'border-red-500/20' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          <p className="text-slate-400">Loading travel dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
            <Plane className="text-blue-400 w-8 h-8" />
            Travel & Expense
          </h1>
          <p className="text-slate-400 mt-1">Enterprise travel management and expense tracking</p>
        </div>
        <div className="flex gap-3">
          <Link to="/travel/requests/new" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all flex items-center gap-2">
            <Plane className="w-4 h-4" /> New Travel Request
          </Link>
          <Link to="/travel/expenses/new" className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium transition-all flex items-center gap-2">
            <Receipt className="w-4 h-4" /> Log Expense
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} p-5 group hover:scale-[1.02] transition-all duration-200`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center ${card.iconColor}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Spend by Month */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-slate-200 font-semibold flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-400" /> Monthly Travel Spend
          </h3>
          {data?.spendByMonth.length ? (
            <div className="space-y-2">
              {data.spendByMonth.slice(-6).map((m) => {
                const maxVal = Math.max(...(data?.spendByMonth.map(x => x.amount) ?? [1]));
                const pct = (m.amount / maxVal) * 100;
                return (
                  <div key={m.month} className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs w-16 shrink-0">{m.month}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-slate-300 text-xs w-20 text-right">${m.amount.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">No spend data available</div>
          )}
        </div>

        {/* Spend by Category */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-slate-200 font-semibold flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Spend by Category
          </h3>
          {data?.spendByCategory.length ? (
            <div className="space-y-2">
              {data.spendByCategory.slice(0, 6).map((c, i) => {
                const colors = ['from-blue-500 to-blue-600', 'from-purple-500 to-pink-500', 'from-emerald-500 to-cyan-500', 'from-amber-500 to-orange-500', 'from-red-500 to-rose-500', 'from-indigo-500 to-violet-500'];
                const maxVal = Math.max(...(data?.spendByCategory.map(x => x.amount) ?? [1]));
                const pct = (c.amount / maxVal) * 100;
                return (
                  <div key={c.category} className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs w-24 truncate shrink-0">{c.category}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2">
                      <div className={`bg-gradient-to-r ${colors[i % colors.length]} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-slate-300 text-xs w-20 text-right">${c.amount.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">No category data available</div>
          )}
        </div>
      </div>

      {/* Recent Requests + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Travel Requests */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-200 font-semibold flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-400" /> Recent Travel Requests
            </h3>
            <Link to="/travel/requests" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.recentRequests.length ? data.recentRequests.map((req) => (
              <Link key={req.id} to={`/travel/requests/${req.id}`}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:bg-slate-800/80 hover:border-blue-500/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Plane className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-200 text-sm font-medium">{req.destination}</p>
                    <p className="text-slate-400 text-xs">{req.employeeName} · {req.travelType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-slate-300 text-xs">${req.estimatedCost.toLocaleString()}</p>
                    <p className="text-slate-500 text-xs">{format(new Date(req.departureDate), 'MMM d')}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              </Link>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Plane className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">No travel requests yet</p>
                <Link to="/travel/requests/new" className="mt-2 text-blue-400 hover:text-blue-300 text-xs">Create your first request →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-slate-200 font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { to: '/travel/requests/new', icon: Plane, label: 'New Travel Request', color: 'text-blue-400', bg: 'bg-blue-500/10 hover:bg-blue-500/20', desc: 'Plan a business trip' },
              { to: '/travel/expenses/new', icon: Receipt, label: 'Log Expense', color: 'text-purple-400', bg: 'bg-purple-500/10 hover:bg-purple-500/20', desc: 'Record an expense' },
              { to: '/travel/reports/new', icon: FileText, label: 'Create Report', color: 'text-cyan-400', bg: 'bg-cyan-500/10 hover:bg-cyan-500/20', desc: 'Submit expense report' },
              { to: '/travel/advances', icon: Banknote, label: 'Request Advance', color: 'text-amber-400', bg: 'bg-amber-500/10 hover:bg-amber-500/20', desc: 'Get travel advance' },
              { to: '/travel/requests?status=Submitted', icon: CheckCircle, label: 'Pending Approvals', color: 'text-emerald-400', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20', desc: `${data?.pendingApprovals ?? 0} waiting` },
              { to: '/travel/policy', icon: AlertCircle, label: 'Policy Violations', color: 'text-red-400', bg: 'bg-red-500/10 hover:bg-red-500/20', desc: `${data?.policyViolations ?? 0} violations` },
            ].map((action) => (
              <Link key={action.to} to={action.to}
                className={`flex items-center gap-3 p-3 rounded-xl ${action.bg} border border-transparent hover:border-slate-600/30 transition-all group`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${action.color} bg-slate-800/50`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-medium">{action.label}</p>
                  <p className="text-slate-500 text-xs">{action.desc}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
