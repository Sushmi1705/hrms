import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, Plus, Calendar, Clock, AlertCircle, 
  CheckCircle2, XCircle, Ban, Send, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { essApi } from '../api/essApi';
import { EssLeaveBalance, EssLeaveRequest } from '../types/ess';

export const EmployeeLeavePage: React.FC = () => {
  const [balances, setBalances] = useState<EssLeaveBalance[]>([]);
  const [requests, setRequests] = useState<EssLeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Apply Leave Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayType, setHalfDayType] = useState('FirstHalf');
  const [reason, setReason] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaveData = () => {
    setLoading(true);
    Promise.all([
      essApi.getLeaveBalances(),
      essApi.getLeaveRequests()
    ])
      .then(([balRes, reqRes]) => {
        setBalances(balRes || []);
        setRequests(reqRes || []);
        if (balRes?.length > 0 && !leaveTypeId) {
          setLeaveTypeId(balRes[0].leaveTypeId);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load leave records');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveTypeId || !fromDate || !toDate || !reason.trim()) {
      toast.error('Please fill in all mandatory leave details');
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      toast.error('Start date cannot be after end date');
      return;
    }

    setSubmitting(true);
    try {
      await essApi.applyLeave({
        leaveTypeId,
        fromDate,
        toDate,
        isHalfDay,
        halfDayType: isHalfDay ? halfDayType : undefined,
        reason,
        emergencyContact
      });
      toast.success('Leave application submitted for manager approval');
      setShowApplyModal(false);
      setReason('');
      setEmergencyContact('');
      fetchLeaveData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelLeave = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this pending leave request?')) return;
    try {
      await essApi.cancelLeave(id);
      toast.success('Leave application cancelled');
      fetchLeaveData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel leave');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-36 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* 1. TOP HEADER & APPLY BUTTON */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Leave Management & Balances
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track annual allowances, pending applications, and vacation schedules
          </p>
        </div>
        <Button 
          size="lg" 
          onClick={() => setShowApplyModal(true)}
          className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Apply For Leave
        </Button>
      </div>

      {/* 2. LEAVE BALANCE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {balances.map((b) => {
          const pct = b.totalAllocated > 0 ? Math.round((b.remaining / b.totalAllocated) * 100) : 0;
          return (
            <Card key={b.leaveTypeId} className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {b.leaveTypeName}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono border-slate-300">
                    {b.isPaid ? 'Paid' : 'Unpaid'}
                  </Badge>
                </div>

                <div>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {b.remaining} <span className="text-sm font-normal text-slate-400">days</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Remaining Balance</p>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${pct}%`, backgroundColor: b.colorCode || '#6366f1' }}
                  />
                </div>

                <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Used: <strong className="text-slate-700 dark:text-slate-300">{b.used}d</strong></span>
                  <span>Pending: <strong className="text-amber-600">{b.pending}d</strong></span>
                  <span>Quota: <strong className="text-slate-700 dark:text-slate-300">{b.totalAllocated}d</strong></span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. MY LEAVE REQUESTS HISTORY */}
      <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            My Leave Request History
          </CardTitle>
          <CardDescription className="text-xs">
            Review the status of your past and upcoming leave applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No leave applications found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <div 
                  key={r.id} 
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {r.leaveTypeName}
                      </span>
                      <Badge className={
                        r.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        r.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        r.status === 'Cancelled' ? 'bg-slate-100 text-slate-600' :
                        'bg-amber-100 text-amber-800'
                      }>
                        {r.status}
                      </Badge>
                      {r.isHalfDay && (
                        <Badge variant="outline" className="text-[10px]">Half Day</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {new Date(r.fromDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      {' → '}
                      {new Date(r.toDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      {' '}({r.totalDays} {r.totalDays === 1 ? 'day' : 'days'})
                    </p>
                    <p className="text-xs text-slate-400">Reason: {r.reason}</p>
                    {r.approvalComments && (
                      <p className="text-xs text-indigo-600 dark:text-indigo-400">Reviewer Note: {r.approvalComments}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs text-slate-400">
                      <p>Applied {new Date(r.createdAt).toLocaleDateString()}</p>
                      <p className="text-slate-500 font-medium">{r.approverName || 'Pending Manager Review'}</p>
                    </div>

                    {r.status === 'Pending' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCancelLeave(r.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
                      >
                        <Ban className="w-3.5 h-3.5 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL: APPLY FOR LEAVE */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Apply for Leave</h3>
            <p className="text-xs text-slate-500">
              Submit your time-off application. Balances and overlapping dates will be validated.
            </p>
            <form onSubmit={handleApplyLeave} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Leave Type *</label>
                <select 
                  value={leaveTypeId} 
                  onChange={e => setLeaveTypeId(e.target.value)}
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                >
                  {balances.map(b => (
                    <option key={b.leaveTypeId} value={b.leaveTypeId}>
                      {b.leaveTypeName} ({b.remaining} days remaining)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">From Date *</label>
                  <input 
                    type="date" 
                    value={fromDate} 
                    onChange={e => setFromDate(e.target.value)} 
                    required
                    className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">To Date *</label>
                  <input 
                    type="date" 
                    value={toDate} 
                    onChange={e => setToDate(e.target.value)} 
                    required
                    className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="halfDayCheck" 
                  checked={isHalfDay} 
                  onChange={e => setIsHalfDay(e.target.checked)} 
                  className="rounded text-indigo-600"
                />
                <label htmlFor="halfDayCheck" className="text-xs text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                  Half Day Application
                </label>
              </div>

              {isHalfDay && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Session</label>
                  <select 
                    value={halfDayType} 
                    onChange={e => setHalfDayType(e.target.value)}
                    className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  >
                    <option value="FirstHalf">First Half (Morning)</option>
                    <option value="SecondHalf">Second Half (Afternoon)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Emergency Phone Contact</label>
                <input 
                  type="tel" 
                  value={emergencyContact} 
                  onChange={e => setEmergencyContact(e.target.value)} 
                  placeholder="+1 (555) 000-0000"
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Reason / Details *</label>
                <textarea 
                  value={reason} 
                  onChange={e => setReason(e.target.value)} 
                  required
                  rows={3}
                  placeholder="Provide details of your leave request"
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowApplyModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-indigo-600 text-white">
                  <Send className="w-4 h-4 mr-1.5" />
                  Submit Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
