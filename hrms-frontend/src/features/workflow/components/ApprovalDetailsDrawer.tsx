import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  X,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Building2,
  Calendar,
  DollarSign,
  Send,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
  UserCheck,
  FileText,
  Layers,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { ApprovalDetails } from '../types/workflow';
import { workflowApi } from '../api/workflowApi';

interface ApprovalDetailsDrawerProps {
  requestId: string | null;
  onClose: () => void;
  onActionComplete: () => void;
}

export function ApprovalDetailsDrawer({ requestId, onClose, onActionComplete }: ApprovalDetailsDrawerProps) {
  const [details, setDetails] = useState<ApprovalDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionComments, setActionComments] = useState('');
  const [delegateUserId, setDelegateUserId] = useState('');
  const [delegateUserName, setDelegateUserName] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'history'>('details');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejectPrompt, setShowRejectPrompt] = useState(false);
  const [showDelegatePrompt, setShowDelegatePrompt] = useState(false);

  useEffect(() => {
    if (!requestId) return;
    setLoading(true);
    workflowApi
      .getApprovalDetails(requestId)
      .then((res) => {
        setDetails(res);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load details');
      })
      .finally(() => setLoading(false));
  }, [requestId]);

  if (!requestId) return null;

  const handleAction = async (action: 'Approved' | 'Rejected' | 'ChangesRequested' | 'Delegate') => {
    if (!details?.activeTask) return;

    if (action === 'Rejected' && !actionComments.trim()) {
      setError('Please provide a reason for rejection.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await workflowApi.processAction({
        taskId: details.activeTask.id,
        action,
        comments: actionComments,
        delegateToUserId: delegateUserId,
        delegateToUserName: delegateUserName
      });

      onActionComplete();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit action');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Approved</Badge>;
      case 'Pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'ChangesRequested':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Changes Requested</Badge>;
      case 'Escalated':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200">Escalated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return <Badge className="bg-red-600 text-white font-bold">Urgent</Badge>;
      case 'High':
        return <Badge className="bg-orange-500 text-white">High</Badge>;
      case 'Normal':
        return <Badge variant="outline" className="text-slate-600">Normal</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-400">Low</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-all">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {details?.requestNumber || 'Approval Details'}
              </h2>
              {details && getStatusBadge(details.status)}
              {details && getPriorityBadge(details.priority)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Workflow: <span className="font-medium text-slate-700 dark:text-slate-300">{details?.workflowName}</span> • Module: {details?.module}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5 text-slate-500" />
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-100 dark:border-slate-800 flex gap-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Request Overview
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'timeline'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Approval Pipeline & Timeline
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Audit Trail ({details?.history.length || 0})
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="font-bold">✕</button>
            </div>
          )}

          {loading ? (
            <div className="py-24 text-center text-slate-400">Loading request metadata...</div>
          ) : details ? (
            <>
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Requester Profile Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      {details.requesterName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate">{details.requesterName}</h4>
                      <p className="text-xs text-slate-500 truncate">{details.requesterEmail}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{details.department}</span>
                        <span>•</span>
                        <span>ID: {details.requesterId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Request Summary & Values */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Request Description</h3>
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-700 dark:text-slate-300">
                      {details.summary}
                    </div>
                  </div>

                  {details.amount !== null && details.amount !== undefined && (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex justify-between items-center">
                      <div>
                        <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                          Claimed Amount
                        </div>
                        <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                          ${details.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <DollarSign className="w-8 h-8 text-emerald-500 opacity-80" />
                    </div>
                  )}

                  {/* Request Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg border bg-slate-50/50">
                      <div className="text-slate-400">Submitted At</div>
                      <div className="font-semibold text-slate-800 mt-0.5">
                        {new Date(details.submittedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border bg-slate-50/50">
                      <div className="text-slate-400">SLA Due Date</div>
                      <div className="font-semibold text-slate-800 mt-0.5">
                        {details.dueDate ? new Date(details.dueDate).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Approval Progression</h3>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                    {details.timelineSteps.map((step, idx) => {
                      const isDone = step.status === 'Approved';
                      const isPending = step.status === 'Pending';
                      const isRejected = step.status === 'Rejected';

                      return (
                        <div key={idx} className="relative">
                          {/* Dot icon */}
                          <div
                            className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                              isDone
                                ? 'bg-emerald-500 ring-4 ring-emerald-50'
                                : isPending
                                ? 'bg-amber-500 ring-4 ring-amber-50 animate-pulse'
                                : isRejected
                                ? 'bg-red-500 ring-4 ring-red-50'
                                : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </div>

                          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1.5">
                            <div className="flex justify-between items-start">
                              <span className="font-semibold text-sm text-slate-900 dark:text-white">
                                {step.stepName}
                              </span>
                              {getStatusBadge(step.status)}
                            </div>
                            <p className="text-xs text-slate-500">
                              Assigned Reviewer: <span className="font-medium text-slate-700 dark:text-slate-300">{step.assignedToName}</span> ({step.approverType})
                            </p>
                            {step.actionDate && (
                              <p className="text-[11px] text-slate-400">
                                Completed: {new Date(step.actionDate).toLocaleString()}
                              </p>
                            )}
                            {step.comments && (
                              <div className="mt-2 text-xs italic p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                "{step.comments}"
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Immutable Audit Trail</h3>
                  <div className="divide-y border rounded-xl overflow-hidden text-xs">
                    {details.history.map((h, i) => (
                      <div key={i} className="p-3.5 bg-white dark:bg-slate-900 flex justify-between items-start gap-3">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="text-primary">{h.actorName}</span>
                            <span className="text-slate-400 font-normal">({h.actorRole})</span>
                            <span className="text-slate-400 font-normal">•</span>
                            <span>{h.action}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 mt-1">{h.comments || 'No comment provided'}</p>
                          <div className="text-[10px] text-slate-400 mt-1">Stage: {h.stepName}</div>
                        </div>
                        <div className="text-[11px] text-slate-400 whitespace-nowrap">
                          {new Date(h.actionDate).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Action Panel Footer (If task is pending) */}
        {details?.activeTask && details.activeTask.status === 'Pending' && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Action Required: {details.activeTask.stepName}
              </span>
              <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> SLA: {details.activeTask.slaStatus}
              </span>
            </div>

            <textarea
              value={actionComments}
              onChange={(e) => setActionComments(e.target.value)}
              placeholder="Add approval comments or mandatory rejection rationale..."
              rows={2}
              className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {showDelegatePrompt ? (
              <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border space-y-2 text-xs">
                <label className="font-semibold">Delegate To User ID / Name</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="User ID"
                    value={delegateUserId}
                    onChange={(e) => setDelegateUserId(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="User Name"
                    value={delegateUserName}
                    onChange={(e) => setDelegateUserName(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button size="sm" onClick={() => handleAction('Delegate')} disabled={submitting} className="h-8">
                    Confirm Delegate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <Button
                  onClick={() => handleAction('Approved')}
                  disabled={submitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </Button>

                <Button
                  onClick={() => handleAction('Rejected')}
                  disabled={submitting}
                  variant="destructive"
                  className="flex-1 flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </Button>

                <Button
                  onClick={() => handleAction('ChangesRequested')}
                  disabled={submitting}
                  variant="outline"
                  className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Request Changes
                </Button>

                <Button
                  onClick={() => setShowDelegatePrompt(true)}
                  disabled={submitting}
                  variant="outline"
                  className="text-xs"
                  title="Delegate task"
                >
                  <UserCheck className="w-4 h-4 text-slate-600" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
