import React, { useState, useEffect } from 'react';
import { Smartphone, Laptop, LogOut, Search, AlertTriangle, CheckCircle2, RefreshCw, Globe, ShieldAlert } from 'lucide-react';
import { SessionSummary, PagedResult } from '../types/systemAdmin';
import { systemAdminApi } from '../api/systemAdminApi';

export const SessionManagement: React.FC = () => {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await systemAdminApi.getActiveSessions({
        search: search || undefined,
        page,
        pageSize: 15
      });
      setSessions(res.items);
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSessions();
  };

  const handleRevokeSession = async (session: SessionSummary) => {
    if (!window.confirm(`Terminate active session for ${session.fullName} (${session.ipAddress})?`)) return;

    setRevokingId(session.id);
    try {
      await systemAdminApi.revokeSession(session.id, 'Session terminated by security admin');
      setStatusMessage(`Terminated session on ${session.browser} (${session.ipAddress})`);
      setTimeout(() => setStatusMessage(null), 3500);
      fetchSessions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to revoke session');
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAll = async () => {
    const code = window.prompt('EMERGENCY ACTION: Type "REVOKE ALL" to force-terminate all active user sessions:');
    if (code !== 'REVOKE ALL') return;

    setRevokingAll(true);
    try {
      const res = await systemAdminApi.revokeAllSessions('Emergency security session purge');
      setStatusMessage(res.message);
      setTimeout(() => setStatusMessage(null), 4000);
      fetchSessions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to revoke all sessions');
    } finally {
      setRevokingAll(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search active sessions by user, IP address, device..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </form>

        <div className="flex items-center space-x-3">
          <div className="text-xs text-slate-500 font-medium">
            <span className="font-bold text-emerald-600">{totalCount}</span> Active Connected Sessions
          </div>

          <button
            onClick={handleRevokeAll}
            disabled={revokingAll}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            {revokingAll ? 'Revoking...' : 'Revoke All Sessions'}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {statusMessage}
        </div>
      )}

      {/* Sessions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3.5">User</th>
              <th className="px-4 py-3.5">Client & OS</th>
              <th className="px-4 py-3.5">IP Address</th>
              <th className="px-4 py-3.5">Location</th>
              <th className="px-4 py-3.5">Login Time</th>
              <th className="px-4 py-3.5">Last Activity</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading connected sessions...
                </td>
              </tr>
            ) : sessions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                  No active sessions found.
                </td>
              </tr>
            ) : (
              sessions.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {s.fullName}
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-[11px] text-slate-400">@{s.username}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-2">
                      {s.deviceType === 'Mobile' ? (
                        <Smartphone className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Laptop className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{s.browser}</div>
                        <div className="text-[10px] text-slate-400">{s.operatingSystem}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300">
                    {s.ipAddress}
                  </td>

                  <td className="px-4 py-3.5 text-slate-500">
                    {s.location || 'Local Network'}
                  </td>

                  <td className="px-4 py-3.5 text-slate-500">
                    {new Date(s.loginAt).toLocaleTimeString()}
                  </td>

                  <td className="px-4 py-3.5 text-slate-500">
                    {new Date(s.lastActivityAt).toLocaleTimeString()}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleRevokeSession(s)}
                      disabled={revokingId === s.id}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {revokingId === s.id ? 'Terminating...' : 'Force Logout'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
