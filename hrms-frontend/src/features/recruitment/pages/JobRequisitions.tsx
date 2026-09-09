import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  CheckCircle2, Search, Filter, Plus, Eye, Check, X, 
  Building2, User, Calendar, DollarSign, Briefcase, 
  FileText, Clock, AlertCircle, ArrowUpRight, Share2, 
  Sparkles, Trash2, Send
} from 'lucide-react';

export interface JobRequisition {
  id: string;
  title: string;
  dept: string;
  hiringManager: string;
  hiringManagerRole: string;
  budget: number;
  openingsCount: number;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  employmentType: 'Full-time' | 'Contract' | 'Remote' | 'Hybrid';
  justification: string;
  requiredSkills: string[];
  targetHireDate: string;
  createdAt: string;
  status: 'Approved' | 'Pending Approval' | 'Draft' | 'Rejected';
  approvedBy?: string;
  approvedDate?: string;
}

const INITIAL_REQUISITIONS: JobRequisition[] = [
  {
    id: 'REQ-2026-081',
    title: 'Senior Backend Engineer',
    dept: 'Engineering',
    hiringManager: 'Alice Cooper',
    hiringManagerRole: 'VP of Engineering',
    budget: 120000,
    openingsCount: 2,
    priority: 'High',
    employmentType: 'Full-time',
    justification: 'Expansion of real-time microservices architecture team to support Q3 enterprise payment integration.',
    requiredSkills: ['Go', 'Kubernetes', 'PostgreSQL', 'Distributed Systems'],
    targetHireDate: '30 Sep 2026',
    createdAt: '12 Aug 2026',
    status: 'Approved',
    approvedBy: 'Marcus Vance (CTO)',
    approvedDate: '15 Aug 2026'
  },
  {
    id: 'REQ-2026-082',
    title: 'HR Specialist',
    dept: 'HR & Admin',
    hiringManager: 'Bob Smith',
    hiringManagerRole: 'Director of People Operations',
    budget: 65000,
    openingsCount: 1,
    priority: 'Medium',
    employmentType: 'Full-time',
    justification: 'Backfill role due to team restructuring; needed to manage technical onboarding pipeline.',
    requiredSkills: ['Talent Sourcing', 'Workday', 'SHRM-CP', 'Employee Relations'],
    targetHireDate: '15 Oct 2026',
    createdAt: '22 Aug 2026',
    status: 'Pending Approval'
  },
  {
    id: 'REQ-2026-083',
    title: 'Lead Product Designer',
    dept: 'Design',
    hiringManager: 'Sophia Patel',
    hiringManagerRole: 'Head of Design',
    budget: 135000,
    openingsCount: 1,
    priority: 'Urgent',
    employmentType: 'Hybrid',
    justification: 'Lead design systems revamp and enterprise multi-tenant analytics dashboard UX.',
    requiredSkills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
    targetHireDate: '25 Sep 2026',
    createdAt: '01 Sep 2026',
    status: 'Pending Approval'
  },
  {
    id: 'REQ-2026-084',
    title: 'Cloud DevOps Architect',
    dept: 'Infrastructure',
    hiringManager: 'Alice Cooper',
    hiringManagerRole: 'VP of Engineering',
    budget: 150000,
    openingsCount: 1,
    priority: 'High',
    employmentType: 'Remote',
    justification: 'Multi-region AWS Kubernetes cluster orchestration and SOC2 compliance monitoring.',
    requiredSkills: ['Terraform', 'AWS', 'Kubernetes', 'CI/CD', 'Security'],
    targetHireDate: '30 Oct 2026',
    createdAt: '05 Sep 2026',
    status: 'Approved',
    approvedBy: 'Marcus Vance (CTO)',
    approvedDate: '07 Sep 2026'
  },
  {
    id: 'REQ-2026-085',
    title: 'Performance Marketing Lead',
    dept: 'Marketing',
    hiringManager: 'Eleanor Davis',
    hiringManagerRole: 'Marketing Director',
    budget: 95000,
    openingsCount: 1,
    priority: 'Low',
    employmentType: 'Full-time',
    justification: 'Scaling paid acquisition channels across Google, LinkedIn, and developer publications.',
    requiredSkills: ['Growth Marketing', 'SEO/SEM', 'Attribution Modeling', 'Google Ads'],
    targetHireDate: '15 Nov 2026',
    createdAt: '02 Sep 2026',
    status: 'Draft'
  }
];

export function JobRequisitions() {
  const [requisitions, setRequisitions] = useState<JobRequisition[]>(INITIAL_REQUISITIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Modals
  const [selectedReq, setSelectedReq] = useState<JobRequisition | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'success' | 'info' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // New Requisition Form State
  const [newForm, setNewForm] = useState({
    title: '',
    dept: 'Engineering',
    hiringManager: '',
    hiringManagerRole: 'Engineering Lead',
    budget: 110000,
    openingsCount: 1,
    priority: 'Medium' as JobRequisition['priority'],
    employmentType: 'Full-time' as JobRequisition['employmentType'],
    justification: '',
    requiredSkills: 'Go, React, Cloud',
    targetHireDate: '2026-10-31'
  });

  // Filtered Requisitions
  const filteredRequisitions = useMemo(() => {
    return requisitions.filter(r => {
      const matchSearch = 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.hiringManager.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchDept = deptFilter === 'All' || r.dept === deptFilter;

      return matchSearch && matchStatus && matchDept;
    });
  }, [requisitions, searchTerm, statusFilter, deptFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = requisitions.length;
    const pending = requisitions.filter(r => r.status === 'Pending Approval').length;
    const approved = requisitions.filter(r => r.status === 'Approved').length;
    const totalBudget = requisitions.reduce((sum, r) => sum + r.budget * r.openingsCount, 0);
    return { total, pending, approved, totalBudget };
  }, [requisitions]);

  // Approve Requisition
  const handleApprove = (id: string) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Approved',
          approvedBy: 'Admin (You)',
          approvedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return r;
    }));

    if (selectedReq && selectedReq.id === id) {
      setSelectedReq(prev => prev ? {
        ...prev,
        status: 'Approved',
        approvedBy: 'Admin (You)',
        approvedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      } : null);
    }

    showToast('Requisition Approved', `Headcount requisition ${id} has been signed off.`);
  };

  // Reject Requisition
  const handleReject = (id: string) => {
    setRequisitions(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    if (selectedReq && selectedReq.id === id) {
      setSelectedReq(prev => prev ? { ...prev, status: 'Rejected' } : null);
    }
    showToast('Requisition Rejected', `Requisition ${id} marked as rejected.`, 'info');
  };

  // Submit New Requisition
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.title || !newForm.hiringManager) {
      showToast('Validation Error', 'Please complete the required fields.', 'info');
      return;
    }

    const newReq: JobRequisition = {
      id: `REQ-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      title: newForm.title,
      dept: newForm.dept,
      hiringManager: newForm.hiringManager,
      hiringManagerRole: newForm.hiringManagerRole,
      budget: Number(newForm.budget),
      openingsCount: Number(newForm.openingsCount),
      priority: newForm.priority,
      employmentType: newForm.employmentType,
      justification: newForm.justification || 'Headcount request for project delivery.',
      requiredSkills: newForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      targetHireDate: newForm.targetHireDate,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending Approval'
    };

    setRequisitions([newReq, ...requisitions]);
    setIsNewModalOpen(false);
    showToast('Requisition Submitted', `Requisition ${newReq.id} submitted for approval.`);
  };

  return (
    <div className="space-y-6 mt-6 relative pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 ${toastMessage.type === 'info' ? 'bg-blue-600' : 'bg-emerald-600'} text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{toastMessage.title}</p>
            <p className="text-xs text-white/90">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Header & New Requisition Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Job Requisitions
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Headcount Control
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review, authorize, and approve departmental headcount requests, hiring budgets, and role justifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsNewModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Requisition
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Requisitions</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
              <span className="text-xs text-slate-500">Across all departments</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Signoff</p>
              <h3 className="text-2xl font-bold text-amber-600">{stats.pending}</h3>
              <span className="text-xs text-amber-600/80 font-medium">Awaiting VP approval</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Approved Requisitions</p>
              <h3 className="text-2xl font-bold text-emerald-600">{stats.approved}</h3>
              <span className="text-xs text-emerald-600/80 font-medium">Ready for job posting</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Allocated Budget</p>
              <h3 className="text-2xl font-bold text-slate-900">${(stats.totalBudget / 1000).toFixed(0)}k</h3>
              <span className="text-xs text-slate-500">Authorized payroll run</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters Bar */}
      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by title, req code, manager..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 text-sm focus-visible:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Draft">Draft</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Department:</span>
                <select
                  value={deptFilter}
                  onChange={e => setDeptFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR & Admin">HR & Admin</option>
                  <option value="Design">Design</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requisitions Table */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-6">Job Title & Code</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Hiring Manager</th>
                <th className="py-3.5 px-4 text-center">Openings</th>
                <th className="py-3.5 px-4 text-right">Budget (Per Hire)</th>
                <th className="py-3.5 px-4 text-center">Priority</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRequisitions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No requisitions match your criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try searching with a different term or clear filters.</p>
                  </td>
                </tr>
              ) : (
                filteredRequisitions.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6">
                      <div>
                        <span className="font-semibold text-slate-900 block leading-snug">{req.title}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="font-mono text-[11px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                            {req.id}
                          </span>
                          <span>•</span>
                          <span>{req.employmentType}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">
                      {req.dept}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs">
                        <span className="font-medium text-slate-800 block">{req.hiringManager}</span>
                        <span className="text-slate-400 text-[11px]">{req.hiringManagerRole}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                      {req.openingsCount}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                      ${req.budget.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        req.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : req.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {req.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : req.status === 'Pending Approval'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : req.status === 'Draft'
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => setSelectedReq(req)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Button>

                        {req.status === 'Pending Approval' && (
                          <Button
                            onClick={() => handleApprove(req.id)}
                            size="sm"
                            className="h-8 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 font-medium"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: Requisition Details & Approval */}
      {selectedReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {selectedReq.title}
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {selectedReq.id}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{selectedReq.dept} • Requested by {selectedReq.hiringManager}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto text-xs">
              {/* Status and Meta Bar */}
              <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Requisition Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedReq.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedReq.status === 'Pending Approval'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedReq.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Target Hire Date: </span>
                  <span className="font-bold text-slate-800">{selectedReq.targetHireDate}</span>
                </div>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Department</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedReq.dept}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Headcount Openings</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedReq.openingsCount} Vacancies</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Approved Budget</span>
                  <span className="font-bold text-emerald-600 text-sm mt-0.5 block">${selectedReq.budget.toLocaleString()} /yr</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Employment Type</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedReq.employmentType}</span>
                </div>
              </div>

              {/* Hiring Manager & Approval Tracking */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-600" />
                  Request & Sign-off Tracking
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-slate-400 text-[11px]">Requested By</p>
                    <p className="font-bold text-slate-800 text-xs mt-0.5">{selectedReq.hiringManager}</p>
                    <p className="text-slate-500 text-[11px]">{selectedReq.hiringManagerRole} • {selectedReq.createdAt}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-slate-400 text-[11px]">Executive Approval</p>
                    {selectedReq.approvedBy ? (
                      <div>
                        <p className="font-bold text-emerald-700 text-xs mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved by {selectedReq.approvedBy}
                        </p>
                        <p className="text-slate-500 text-[11px]">{selectedReq.approvedDate}</p>
                      </div>
                    ) : (
                      <p className="font-medium text-amber-600 text-xs mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending Executive Authorization
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Justification */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Business Justification
                </label>
                <p className="text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedReq.justification}
                </p>
              </div>

              {/* Required Competencies */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Target Competencies & Tech Stack
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedReq.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                {selectedReq.status === 'Pending Approval' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(selectedReq.id)}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
                  >
                    Reject Requisition
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedReq.status === 'Pending Approval' ? (
                  <Button
                    size="sm"
                    onClick={() => handleApprove(selectedReq.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5 font-medium"
                  >
                    <Check className="w-4 h-4" />
                    Approve Headcount
                  </Button>
                ) : selectedReq.status === 'Approved' ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      showToast('Posting Created', `Live job post created from ${selectedReq.id}`);
                      setSelectedReq(null);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5 font-medium"
                  >
                    <Share2 className="w-4 h-4" />
                    Publish to Job Openings
                  </Button>
                ) : null}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedReq(null)}
                  className="border-slate-200 text-slate-600 text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create New Requisition */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5" />
                <h3 className="text-lg font-bold">Create Headcount Requisition</h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
                <Input
                  required
                  placeholder="e.g. Senior Security Architect"
                  value={newForm.title}
                  onChange={e => setNewForm({ ...newForm, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newForm.dept}
                    onChange={e => setNewForm({ ...newForm, dept: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="HR & Admin">HR & Admin</option>
                    <option value="Design">Design</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={newForm.employmentType}
                    onChange={e => setNewForm({ ...newForm, employmentType: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hiring Manager *</label>
                  <Input
                    required
                    placeholder="e.g. Alice Cooper"
                    value={newForm.hiringManager}
                    onChange={e => setNewForm({ ...newForm, hiringManager: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manager Role</label>
                  <Input
                    placeholder="e.g. VP of Engineering"
                    value={newForm.hiringManagerRole}
                    onChange={e => setNewForm({ ...newForm, hiringManagerRole: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Budget ($ /yr)</label>
                  <Input
                    type="number"
                    value={newForm.budget}
                    onChange={e => setNewForm({ ...newForm, budget: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vacancies</label>
                  <Input
                    type="number"
                    min="1"
                    value={newForm.openingsCount}
                    onChange={e => setNewForm({ ...newForm, openingsCount: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newForm.priority}
                    onChange={e => setNewForm({ ...newForm, priority: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Justification</label>
                <textarea
                  className="w-full h-20 p-2.5 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Explain the business need and expected ROI for this hire..."
                  value={newForm.justification}
                  onChange={e => setNewForm({ ...newForm, justification: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Required Skills (comma separated)</label>
                <Input
                  placeholder="e.g. AWS, React, Python, SOC2"
                  value={newForm.requiredSkills}
                  onChange={e => setNewForm({ ...newForm, requiredSkills: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Submit for Approval
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
