import React, { useState, useEffect } from 'react';
import {
  Search, Building2, Globe, Users, Shield, MoreVertical,
  KeyRound, Pause, Play, Trash2, Edit3, ChevronRight,
  ChevronLeft, ArrowUpDown, Filter, Download
} from 'lucide-react';
import { TenantSummary, PagedResult } from '../types/tenant';
import { tenantApi } from '../api/tenantApi';

interface Props {
  onSelectTenant: (tenantId: string) => void;
  onImpersonate: (tenantId: string) => void;
}

export const TenantList: React.FC<Props> = ({ onSelectTenant, onImpersonate }) => {
  const [tenants, setTenants] = useState<TenantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await tenantApi.getTenants({
        search: search || undefined,
        status: statusFilter,
        country: countryFilter,
        page,
        pageSize: 10
      });
      setTenants(res.items);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to fetch tenants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [page, statusFilter, countryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTenants();
  };

  const handleSuspend = async (tenant: TenantSummary) => {
    const reason = window.prompt(`Suspend tenant '${tenant.name}'? Enter reason:`, 'Overdue invoice billing threshold');
    if (!reason) return;
    try {
      await tenantApi.suspendTenant(tenant.id, reason);
      fetchTenants();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to suspend tenant');
    }
  };

  const handleReactivate = async (tenant: TenantSummary) => {
    try {
      await tenantApi.reactivateTenant(tenant.id);
      fetchTenants();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reactivate tenant');
    }
  };

  const handleDelete = async (tenant: TenantSummary) => {
    const confirm = window.confirm(`Request soft deletion for tenant '${tenant.name}'? A 30-day grace period will be initiated before permanent purge.`);
    if (!confirm) return;
    try {
      await tenantApi.requestDeletion(tenant.id, 'Requested by platform administrator');
      fetchTenants();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to request deletion');
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by organization name, code, contact email, industry..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </select>

          <select
            value={countryFilter}
            onChange={e => { setCountryFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
          >
            <option value="All">All Countries</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Germany">Germany</option>
            <option value="Canada">Canada</option>
            <option value="France">France</option>
            <option value="Singapore">Singapore</option>
            <option value="Australia">Australia</option>
          </select>

          <a
            href={tenantApi.getExportUrl()}
            download
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </a>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3.5">Organization</th>
              <th className="px-4 py-3.5">Industry & Region</th>
              <th className="px-4 py-3.5">Subscription Plan</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">User Capacity</th>
              <th className="px-4 py-3.5">Storage</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading SaaS tenant directory...
                </td>
              </tr>
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                  No tenants matching filter criteria.
                </td>
              </tr>
            ) : (
              tenants.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* Organization & Code */}
                  <td className="px-5 py-3.5 cursor-pointer" onClick={() => onSelectTenant(t.id)}>
                    <div className="font-bold text-slate-900 dark:text-white hover:text-primary transition-colors flex items-center gap-1.5">
                      {t.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                      <span>Code: {t.code}</span>
                      <span>•</span>
                      <span>{t.contactEmail}</span>
                    </div>
                  </td>

                  {/* Industry & Country */}
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{t.industry}</div>
                    <div className="text-[11px] text-slate-400">{t.country}</div>
                  </td>

                  {/* Subscription Plan */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{t.planName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      ${t.planPrice}/{t.billingCycle === 'Annual' ? 'yr' : 'mo'}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                      t.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : t.status === 'Trial'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                        : t.status === 'Suspended'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                    }`}>
                      {t.status}
                    </span>
                  </td>

                  {/* User Capacity */}
                  <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300">
                    <div>{t.currentUsersCount} / {t.maxUsers} Users</div>
                    <div className="text-[10px] text-slate-400">{t.currentEmployeesCount} Employees</div>
                  </td>

                  {/* Storage */}
                  <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300">
                    <div>{(t.storageUsedMb / 1024).toFixed(1)} GB</div>
                    <div className="text-[10px] text-slate-400">{t.storageQuotaGb} GB Quota</div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right relative">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onSelectTenant(t.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Full Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onImpersonate(t.id)}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                        title="Impersonate Tenant"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>

                      {t.status === 'Active' ? (
                        <button
                          onClick={() => handleSuspend(t)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Suspend Tenant"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(t)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                          title="Reactivate Tenant"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(t)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Soft Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{tenants.length}</span> of <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> Tenants
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs px-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
