import React, { useState, useEffect } from 'react';
import { 
  GitPullRequest, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Search,
  Check,
  X,
  Package
} from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetRequestDto, AssetDto } from '../types/asset';

export const AssetRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<AssetRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Action Modal State
  const [actionReq, setActionReq] = useState<AssetRequestDto | null>(null);
  const [actionType, setActionType] = useState<'Approve' | 'Reject'>('Approve');
  const [comments, setComments] = useState('');
  const [availableAssets, setAvailableAssets] = useState<AssetDto[]>([]);
  const [allocatedAssetId, setAllocatedAssetId] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchRequests = () => {
    setLoading(true);
    assetApi.getAssetRequests({
      status: statusFilter !== 'All' ? statusFilter : undefined
    })
      .then(res => setRequests(res.items))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleOpenAction = (req: AssetRequestDto, type: 'Approve' | 'Reject') => {
    setActionReq(req);
    setActionType(type);
    setComments(type === 'Approve' ? 'Approved per department hardware requisition budget.' : 'Hardware request denied due to policy constraints.');
    
    if (type === 'Approve') {
      // Fetch available assets matching the category
      assetApi.getAssets({ categoryId: req.categoryId, status: 'Available' })
        .then(res => {
          setAvailableAssets(res.items);
          if (res.items.length > 0) setAllocatedAssetId(res.items[0].id);
        })
        .catch(err => console.error(err));
    }
  };

  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionReq) return;

    setProcessing(true);
    try {
      await assetApi.processAssetRequestAction(actionReq.id, {
        action: actionType,
        approverComments: comments,
        allocatedAssetId: actionType === 'Approve' && allocatedAssetId ? allocatedAssetId : undefined
      });
      setActionReq(null);
      fetchRequests();
    } catch (err) {
      alert('Failed to process asset request action.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Asset Requisition & Approval Workflows
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Employee equipment requests integrated with Enterprise Approval Engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="All">All Requests</option>
            <option value="PendingApproval">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Fulfilled">Fulfilled / Assigned</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs uppercase text-slate-500">
                <th className="p-4">Req #</th>
                <th className="p-4">Requester</th>
                <th className="p-4">Category Requested</th>
                <th className="p-4">Required Date</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Reason</th>
                <th className="p-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">Loading requests...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">No requisitions found.</td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-semibold text-indigo-600 text-xs">
                      {req.requestNumber}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                        {req.employeeName}
                      </div>
                      <div className="text-[11px] text-slate-400">{req.departmentName}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {req.categoryName}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                      {new Date(req.requiredDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        req.priority === 'Urgent' || req.priority === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        req.status === 'Approved' || req.status === 'Fulfilled'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.status === 'PendingApproval'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {req.reason}
                    </td>
                    <td className="p-4 text-right">
                      {req.status === 'PendingApproval' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAction(req, 'Approve')}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleOpenAction(req, 'Reject')}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval / Rejection Action Modal */}
      {actionReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {actionType === 'Approve' ? 'Approve Equipment Request' : 'Reject Equipment Request'}
              </h3>
              <button onClick={() => setActionReq(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAction} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1">
                <div>Requester: <strong>{actionReq.employeeName}</strong> ({actionReq.departmentName})</div>
                <div>Category: <strong>{actionReq.categoryName}</strong></div>
                <div>Reason: {actionReq.reason}</div>
              </div>

              {actionType === 'Approve' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Allocate Specific Available Asset (Optional)
                  </label>
                  <select
                    value={allocatedAssetId}
                    onChange={e => setAllocatedAssetId(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="">Allocate upon fulfillment</option>
                    {availableAssets.map(a => (
                      <option key={a.id} value={a.id}>{a.assetTag} - {a.assetName}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Approver Comments & Instructions
                </label>
                <textarea
                  rows={3}
                  required
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActionReq(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg text-white shadow-xs ${
                    actionType === 'Approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {processing ? 'Processing...' : `Confirm ${actionType}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
