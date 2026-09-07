import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  UserCheck,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Search,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { Delegation } from '../types/workflow';
import { workflowApi } from '../api/workflowApi';

export function DelegationManagement() {
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    delegatorId: 'mgr-01',
    delegatorName: 'David Ross (Direct Manager)',
    delegateeId: 'emp-22',
    delegateeName: 'Eleanor Vance (VP Operations)',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    reason: 'Annual Vacation Leave - Temporary Delegated Authority',
    modules: 'All'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await workflowApi.getDelegations();
      setDelegations(res);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load delegations' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await workflowApi.createDelegation(form);
      setMessage({ type: 'success', text: 'Approval delegation established successfully.' });
      setShowModal(false);
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create delegation' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke this delegation immediately?')) return;
    try {
      await workflowApi.revokeDelegation(id);
      setMessage({ type: 'success', text: 'Delegation authority revoked.' });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to revoke delegation' });
    }
  };

  const filtered = delegations.filter(
    (d) =>
      d.delegatorName.toLowerCase().includes(search.toLowerCase()) ||
      d.delegateeName.toLowerCase().includes(search.toLowerCase()) ||
      d.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex justify-between items-center ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Create Delegation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" /> Setup Approval Delegation
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Delegator (Originating Approver)</label>
                <Input
                  value={form.delegatorName}
                  onChange={(e) => setForm((p) => ({ ...p, delegatorName: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Delegatee (Designated Proxy Approver)</label>
                <Input
                  value={form.delegateeName}
                  onChange={(e) => setForm((p) => ({ ...p, delegateeName: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Effective Start Date</label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Effective End Date</label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Applicable Modules</label>
                <select
                  value={form.modules}
                  onChange={(e) => setForm((p) => ({ ...p, modules: e.target.value }))}
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-slate-900 text-xs"
                >
                  <option value="All">All Modules (Universal Delegation)</option>
                  <option value="Leave">Leave Approvals Only</option>
                  <option value="Attendance">Attendance Regularization Only</option>
                  <option value="Payroll">Payroll & Expenses Only</option>
                  <option value="Recruitment">Recruitment Approvals Only</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Delegation Reason / Business Justification</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                  rows={2}
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-slate-900 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-primary text-white">
                  {submitting ? 'Creating...' : 'Establish Delegation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Approval Delegation & Proxy Management
            </CardTitle>
            <CardDescription className="mt-1">
              Temporarily transfer authorization authority during annual leaves or out-of-office periods.
            </CardDescription>
          </div>

          <Button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 bg-primary text-white">
            <Plus className="w-4 h-4" /> New Delegation Rule
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="p-4 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by delegator, proxy or reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-full border rounded-lg text-xs bg-white dark:bg-slate-900"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={loadData}>
              <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold border-b text-xs">
                <tr>
                  <th className="px-6 py-3.5">Delegation Flow</th>
                  <th className="px-4 py-3.5">Date Duration</th>
                  <th className="px-4 py-3.5">Modules</th>
                  <th className="px-4 py-3.5">Reason</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      Loading delegations...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No active delegations found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => {
                    const now = new Date();
                    const start = new Date(d.startDate);
                    const end = new Date(d.endDate);
                    const isCurrentlyActive = d.isActive && now >= start && now <= end;

                    return (
                      <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                            <span>{d.delegatorName}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-primary" />
                            <span className="text-primary font-bold">{d.delegateeName}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {start.toLocaleDateString()} - {end.toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 font-medium text-[11px]">
                            {d.modules}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                          {d.reason}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {isCurrentlyActive ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Currently Active</Badge>
                          ) : d.isActive && now < start ? (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">Scheduled</Badge>
                          ) : (
                            <Badge variant="outline" className="text-slate-400">Expired / Revoked</Badge>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {d.isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevoke(d.id)}
                              className="text-xs text-red-600 hover:bg-red-50 h-7"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" /> Revoke
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
