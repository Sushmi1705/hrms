import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Plus, Send, Clock, CheckCircle2, 
  MessageSquare, User, Filter, AlertCircle, ChevronRight, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { essApi } from '../api/essApi';
import { EssHRRequestItem, HRRequestCommentItem } from '../types/ess';

export const EmployeeRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<EssHRRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<EssHRRequestItem | null>(null);

  // New Request Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [category, setCategory] = useState('HR');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [submitting, setSubmitting] = useState(false);

  // Discussion Comment
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  const fetchRequests = () => {
    setLoading(true);
    essApi.getHRRequests(undefined, selectedCategory)
      .then(res => setRequests(res || []))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load HR requests');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedCategory]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error('Please fill in subject and description');
      return;
    }
    setSubmitting(true);
    try {
      await essApi.createHRRequest({
        category,
        subject,
        description,
        priority
      });
      toast.success('HR ticket submitted successfully');
      setShowCreateModal(false);
      setSubject('');
      setDescription('');
      fetchRequests();
    } catch (err: any) {
      toast.error('Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !commentText.trim()) return;
    setSendingComment(true);
    try {
      const newComment = await essApi.addHRRequestComment(selectedRequest.id, commentText);
      setSelectedRequest({
        ...selectedRequest,
        comments: [...selectedRequest.comments, newComment]
      });
      setCommentText('');
      toast.success('Message posted');
      fetchRequests();
    } catch (err: any) {
      toast.error('Failed to post message');
    } finally {
      setSendingComment(false);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Urgent': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'High': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Low': return 'bg-slate-100 text-slate-700 border-slate-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-32 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* 1. TOP HEADER & CREATE TICKET */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Employee Helpdesk & HR Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Central service desk for questions on Payroll, Benefits, Attendance, Hardware, or People Ops
          </p>
        </div>

        <Button 
          size="lg"
          onClick={() => setShowCreateModal(true)}
          className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          New HR Request
        </Button>
      </div>

      {/* 2. CATEGORY PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'HR', 'Payroll', 'Attendance', 'Leave', 'Benefits', 'Assets', 'Documents', 'IT_Support'].map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="rounded-xl text-xs font-semibold"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* 3. REQUESTS LIST */}
      <div className="grid grid-cols-1 gap-4">
        {requests.length === 0 ? (
          <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
            <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No service requests found in this category.</p>
          </Card>
        ) : (
          requests.map(req => (
            <Card 
              key={req.id} 
              onClick={() => setSelectedRequest(req)}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer"
            >
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {req.requestNumber}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {req.category}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] ${getPriorityColor(req.priority)}`}>
                      {req.priority}
                    </Badge>
                    <Badge className={
                      req.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'InProgress' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }>
                      {req.status}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {req.subject}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{req.description}</p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right text-xs text-slate-400">
                    <p>Submitted {new Date(req.createdAt).toLocaleDateString()}</p>
                    <p className="flex items-center justify-end gap-1 text-slate-500 mt-0.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {req.comments?.length || 0} messages
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* MODAL: NEW HR REQUEST */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit New HR Request</h3>
            <p className="text-xs text-slate-500">
              Your inquiry will be routed to the appropriate HR department specialist.
            </p>
            <form onSubmit={handleCreateRequest} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Category *</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  >
                    <option value="HR">General HR</option>
                    <option value="Payroll">Payroll & Taxes</option>
                    <option value="Attendance">Attendance & Timesheet</option>
                    <option value="Leave">Leave Policies</option>
                    <option value="Benefits">Benefits & Insurance</option>
                    <option value="Assets">Assets & Equipment</option>
                    <option value="Documents">Documentation</option>
                    <option value="IT_Support">IT Hardware & Access</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Priority *</label>
                  <select 
                    value={priority} 
                    onChange={e => setPriority(e.target.value)}
                    className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Subject / Title *</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)} 
                  required
                  placeholder="Brief summary of request"
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Description *</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  required
                  rows={4}
                  placeholder="Provide all relevant background, details, or dates"
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-indigo-600 text-white">
                  <Send className="w-4 h-4 mr-1.5" />
                  Submit Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER / MODAL: TICKET TIMELINE & COMMENTS */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl h-full shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-indigo-600">{selectedRequest.requestNumber}</span>
                    <Badge variant="outline">{selectedRequest.category}</Badge>
                    <Badge className={
                      selectedRequest.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedRequest.subject}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Assigned: {selectedRequest.assignedTo || 'People Ops Queue'} • Submitted {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Description */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedRequest.description}
              </div>

              {/* Discussion Thread */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Conversation & Updates ({selectedRequest.comments?.length || 0})
                </h4>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {selectedRequest.comments?.map(comment => (
                    <div key={comment.id} className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {comment.authorName} ({comment.authorRole})
                        </span>
                        <span className="text-slate-400">
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{comment.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comment Input Box */}
            <form onSubmit={handleSendComment} className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input 
                type="text" 
                value={commentText} 
                onChange={e => setCommentText(e.target.value)} 
                placeholder="Type a message or response..."
                className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              />
              <Button type="submit" disabled={sendingComment} size="sm" className="bg-indigo-600 text-white rounded-xl">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
