import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Eye, Mail, Key, ShieldCheck, Plus, X, 
  Send, FileText, Check, Sparkles, User, Calendar, ExternalLink
} from 'lucide-react';

export interface PreBoardingRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  dept: string;
  joiningDate: string;
  welcomeEmailStatus: 'Sent' | 'Scheduled' | 'Pending';
  formsSubmittedCount: number;
  totalFormsCount: number;
  portalAccess: 'Active' | 'Invited' | 'Pending';
  status: 'In Progress' | 'Completed' | 'Pending';
  lastActivity: string;
  formsList: Array<{ id: string; name: string; submitted: boolean; date?: string }>;
}

const INITIAL_PREBOARDING_DATA: PreBoardingRecord[] = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    role: 'Senior Developer',
    dept: 'Engineering',
    joiningDate: '2026-09-01',
    welcomeEmailStatus: 'Sent',
    formsSubmittedCount: 3,
    totalFormsCount: 5,
    portalAccess: 'Active',
    status: 'In Progress',
    lastActivity: 'Yesterday at 4:15 PM',
    formsList: [
      { id: 'f1', name: 'Emergency Contact & Medical Info', submitted: true, date: '28 Aug' },
      { id: 'f2', name: 'Direct Deposit & Banking Authorization', submitted: true, date: '29 Aug' },
      { id: 'f3', name: 'Proprietary Info & IP Agreement', submitted: true, date: '30 Aug' },
      { id: 'f4', name: 'W-4 Federal & State Withholding', submitted: false },
      { id: 'f5', name: 'Hardware & Ergonomic Preferences', submitted: false }
    ]
  },
  {
    id: 2,
    name: 'David Lee',
    email: 'david.lee@example.com',
    role: 'Product Designer',
    dept: 'Design',
    joiningDate: '2026-09-05',
    welcomeEmailStatus: 'Sent',
    formsSubmittedCount: 5,
    totalFormsCount: 5,
    portalAccess: 'Active',
    status: 'Completed',
    lastActivity: 'Today at 10:30 AM',
    formsList: [
      { id: 'f1', name: 'Emergency Contact & Medical Info', submitted: true, date: '25 Aug' },
      { id: 'f2', name: 'Direct Deposit & Banking Authorization', submitted: true, date: '26 Aug' },
      { id: 'f3', name: 'Proprietary Info & IP Agreement', submitted: true, date: '26 Aug' },
      { id: 'f4', name: 'W-4 Federal & State Withholding', submitted: true, date: '27 Aug' },
      { id: 'f5', name: 'Hardware & Ergonomic Preferences', submitted: true, date: '28 Aug' }
    ]
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    email: 'elena.r@example.com',
    role: 'Staff Data Scientist',
    dept: 'Data & AI',
    joiningDate: '2026-09-15',
    welcomeEmailStatus: 'Sent',
    formsSubmittedCount: 2,
    totalFormsCount: 5,
    portalAccess: 'Active',
    status: 'In Progress',
    lastActivity: '2 days ago',
    formsList: [
      { id: 'f1', name: 'Emergency Contact & Medical Info', submitted: true, date: '01 Sep' },
      { id: 'f2', name: 'Direct Deposit & Banking Authorization', submitted: true, date: '02 Sep' },
      { id: 'f3', name: 'Proprietary Info & IP Agreement', submitted: false },
      { id: 'f4', name: 'W-4 Federal & State Withholding', submitted: false },
      { id: 'f5', name: 'Hardware & Ergonomic Preferences', submitted: false }
    ]
  },
  {
    id: 4,
    name: 'Liam Neeson',
    email: 'liam.n@example.com',
    role: 'Full Stack Engineer',
    dept: 'Engineering',
    joiningDate: '2026-09-22',
    welcomeEmailStatus: 'Pending',
    formsSubmittedCount: 0,
    totalFormsCount: 5,
    portalAccess: 'Invited',
    status: 'Pending',
    lastActivity: 'Never',
    formsList: [
      { id: 'f1', name: 'Emergency Contact & Medical Info', submitted: false },
      { id: 'f2', name: 'Direct Deposit & Banking Authorization', submitted: false },
      { id: 'f3', name: 'Proprietary Info & IP Agreement', submitted: false },
      { id: 'f4', name: 'W-4 Federal & State Withholding', submitted: false },
      { id: 'f5', name: 'Hardware & Ergonomic Preferences', submitted: false }
    ]
  }
];

export function PreBoarding() {
  const [records, setRecords] = useState<PreBoardingRecord[]>(INITIAL_PREBOARDING_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [portalFilter, setPortalFilter] = useState('All');

  // Modals & Menu
  const [selectedRecord, setSelectedRecord] = useState<PreBoardingRecord | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // New Invite form
  const [newInvite, setNewInvite] = useState({
    name: '',
    email: '',
    role: 'Software Engineer',
    dept: 'Engineering',
    joiningDate: '2026-10-01'
  });

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.dept.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchPortal = portalFilter === 'All' || r.portalAccess === portalFilter;

      return matchSearch && matchStatus && matchPortal;
    });
  }, [records, searchTerm, statusFilter, portalFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = records.length;
    const completed = records.filter(r => r.status === 'Completed').length;
    const inProgress = records.filter(r => r.status === 'In Progress').length;
    const pending = records.filter(r => r.status === 'Pending').length;
    return { total, completed, inProgress, pending };
  }, [records]);

  // Actions
  const handleToggleFormStatus = (recordId: number, formId: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        const updatedList = rec.formsList.map(f => {
          if (f.id === formId) {
            return { ...f, submitted: !f.submitted, date: !f.submitted ? 'Today' : undefined };
          }
          return f;
        });
        const submittedCount = updatedList.filter(f => f.submitted).length;
        const status = submittedCount === rec.totalFormsCount ? 'Completed' : 'In Progress';
        return {
          ...rec,
          formsList: updatedList,
          formsSubmittedCount: submittedCount,
          status
        };
      }
      return rec;
    }));

    if (selectedRecord && selectedRecord.id === recordId) {
      setSelectedRecord(prev => {
        if (!prev) return null;
        const updatedList = prev.formsList.map(f => {
          if (f.id === formId) {
            return { ...f, submitted: !f.submitted, date: !f.submitted ? 'Today' : undefined };
          }
          return f;
        });
        const submittedCount = updatedList.filter(f => f.submitted).length;
        const status = submittedCount === prev.totalFormsCount ? 'Completed' : 'In Progress';
        return { ...prev, formsList: updatedList, formsSubmittedCount: submittedCount, status };
      });
    }

    showToast('Form Status Updated', 'Candidate pre-boarding document status updated.');
  };

  const handleSendReminder = (record: PreBoardingRecord) => {
    setActiveMenuId(null);
    showToast('Reminder Sent', `Automated reminder email sent to ${record.email} for pending forms.`);
  };

  const handleResetPasscode = (record: PreBoardingRecord) => {
    setActiveMenuId(null);
    showToast('Credentials Dispatched', `One-time access magic link generated and emailed to ${record.email}`);
  };

  const handleApproveAll = (recordId: number) => {
    setRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          formsSubmittedCount: r.totalFormsCount,
          status: 'Completed',
          portalAccess: 'Active',
          formsList: r.formsList.map(f => ({ ...f, submitted: true, date: 'Approved' }))
        };
      }
      return r;
    }));

    if (selectedRecord && selectedRecord.id === recordId) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        formsSubmittedCount: prev.totalFormsCount,
        status: 'Completed',
        portalAccess: 'Active',
        formsList: prev.formsList.map(f => ({ ...f, submitted: true, date: 'Approved' }))
      } : null);
    }

    setActiveMenuId(null);
    showToast('All Forms Approved', 'Candidate cleared all pre-boarding compliance requirements.');
  };

  const handleCreateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvite.name || !newInvite.email) return;

    const newRecord: PreBoardingRecord = {
      id: Date.now(),
      name: newInvite.name,
      email: newInvite.email,
      role: newInvite.role,
      dept: newInvite.dept,
      joiningDate: newInvite.joiningDate,
      welcomeEmailStatus: 'Sent',
      formsSubmittedCount: 0,
      totalFormsCount: 5,
      portalAccess: 'Active',
      status: 'In Progress',
      lastActivity: 'Just now',
      formsList: [
        { id: 'f1', name: 'Emergency Contact & Medical Info', submitted: false },
        { id: 'f2', name: 'Direct Deposit & Banking Authorization', submitted: false },
        { id: 'f3', name: 'Proprietary Info & IP Agreement', submitted: false },
        { id: 'f4', name: 'W-4 Federal & State Withholding', submitted: false },
        { id: 'f5', name: 'Hardware & Ergonomic Preferences', submitted: false }
      ]
    };

    setRecords([newRecord, ...records]);
    setIsInviteModalOpen(false);
    showToast('Candidate Invited', `Pre-boarding portal link emailed to ${newRecord.email}`);
  };

  return (
    <div className="space-y-6 mt-6 relative pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{toastMessage.title}</p>
            <p className="text-xs text-emerald-100">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Active In Pre-Boarding</p>
              <h4 className="text-xl font-bold text-slate-900">{stats.total} Candidates</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Forms In Progress</p>
              <h4 className="text-xl font-bold text-blue-600">{stats.inProgress} Candidates</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">All Forms Completed</p>
              <h4 className="text-xl font-bold text-emerald-600">{stats.completed} Candidates</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Pending Action</p>
              <h4 className="text-xl font-bold text-amber-600">{stats.pending} Candidates</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Pre-Boarding Portal
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Self-Service Engagement
              </span>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Track pre-boarding paperwork, portal login status, and candidate compliance before Day 1.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search candidate or role..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 h-9 border-slate-200 text-xs bg-slate-50 focus-visible:ring-indigo-500" 
              />
            </div>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2.5 h-9 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>

            {/* Filter by Portal */}
            <select
              value={portalFilter}
              onChange={e => setPortalFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2.5 h-9 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Portal States</option>
              <option value="Active">Active</option>
              <option value="Invited">Invited</option>
            </select>

            <Button 
              onClick={() => setIsInviteModalOpen(true)}
              size="sm"
              className="h-9 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Invite Candidate
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Candidate</th>
                  <th className="px-6 py-3.5">Welcome Email</th>
                  <th className="px-6 py-3.5">Forms Submitted</th>
                  <th className="px-6 py-3.5">Portal Access</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-medium text-slate-700 text-sm">No pre-boarding records found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Try searching with a different keyword or invite a new hire.</p>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-xs">
                            {r.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-xs leading-snug">{r.name}</p>
                            <p className="text-[11px] text-slate-400">{r.role} • {r.dept}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          r.welcomeEmailStatus === 'Sent'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <Mail className="w-3 h-3 mr-1" />
                          {r.welcomeEmailStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                            <div 
                              className={`h-full rounded-full ${
                                r.formsSubmittedCount === r.totalFormsCount ? 'bg-emerald-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${(r.formsSubmittedCount / r.totalFormsCount) * 100}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700">
                            {r.formsSubmittedCount}/{r.totalFormsCount}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          r.portalAccess === 'Active'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          <Key className="w-3 h-3 mr-1" />
                          {r.portalAccess}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {r.status === 'Completed' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 mr-1"/> {r.status}
                          </span>
                        ) : r.status === 'In Progress' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                            <Clock className="w-3 h-3 mr-1"/> {r.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 mr-1"/> {r.status}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right relative">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick View Button */}
                          <Button
                            onClick={() => setSelectedRecord(r)}
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1 font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Checklist</span>
                          </Button>

                          {/* Action Menu Toggle Button */}
                          <div className="relative">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setActiveMenuId(activeMenuId === r.id ? null : r.id)}
                              className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 rounded-md"
                            >
                              <MoreHorizontal className="w-4 h-4 text-slate-600"/>
                            </Button>

                            {/* Dropdown Action Menu */}
                            {activeMenuId === r.id && (
                              <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1.5 animate-in fade-in zoom-in-95 text-xs text-left">
                                <button
                                  onClick={() => {
                                    setSelectedRecord(r);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                                >
                                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>View Checklist Forms</span>
                                </button>

                                <button
                                  onClick={() => handleSendReminder(r)}
                                  className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                                >
                                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Send Form Reminder</span>
                                </button>

                                <button
                                  onClick={() => handleResetPasscode(r)}
                                  className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                                >
                                  <Key className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Send Portal Magic Link</span>
                                </button>

                                {r.status !== 'Completed' && (
                                  <button
                                    onClick={() => handleApproveAll(r.id)}
                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-medium border-t border-slate-100"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Approve All Forms</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>Showing {filteredRecords.length} of {records.length} entries</div>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" disabled className="h-8 text-xs">Previous</Button>
              <Button variant="outline" size="sm" disabled className="h-8 text-xs">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODAL: Pre-Boarding Forms Checklist & Status */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-bold flex items-center justify-center text-base">
                  {selectedRecord.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {selectedRecord.name}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-900/80 text-indigo-200 border border-indigo-700">
                      {selectedRecord.role}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Joining: {selectedRecord.joiningDate} • Last active {selectedRecord.lastActivity}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto text-xs">
              {/* Progress Tracker */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-800">Pre-Boarding Paperwork Completion</span>
                  <span className="font-bold text-indigo-600 text-sm">
                    {selectedRecord.formsSubmittedCount} of {selectedRecord.totalFormsCount} Forms ({Math.round((selectedRecord.formsSubmittedCount / selectedRecord.totalFormsCount) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedRecord.formsSubmittedCount === selectedRecord.totalFormsCount ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${(selectedRecord.formsSubmittedCount / selectedRecord.totalFormsCount) * 100}%` }}
                  />
                </div>
              </div>

              {/* Interactive Forms Checklist */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Mandatory Pre-Boarding Documents
                </h4>
                <div className="space-y-2">
                  {selectedRecord.formsList.map(form => (
                    <div 
                      key={form.id} 
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        form.submitted ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleFormStatus(selectedRecord.id, form.id)}
                          className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${
                            form.submitted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <p className={`font-semibold text-xs ${form.submitted ? 'text-slate-800' : 'text-slate-600'}`}>
                            {form.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {form.submitted ? `Verified on ${form.date || 'Recent'}` : 'Awaiting candidate submission'}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        form.submitted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {form.submitted ? 'Complete' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendReminder(selectedRecord)}
                className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                Email Form Reminder
              </Button>

              <div className="flex items-center gap-2">
                {selectedRecord.status !== 'Completed' && (
                  <Button
                    size="sm"
                    onClick={() => handleApproveAll(selectedRecord.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve All Forms
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                  className="border-slate-200 text-slate-600 text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Invite Candidate to Pre-Boarding */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5" />
                <h3 className="text-base font-bold">Invite Candidate to Pre-Boarding</h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvite} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Candidate Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Liam Neeson"
                  value={newInvite.name}
                  onChange={e => setNewInvite({ ...newInvite, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Personal Email *</label>
                <Input
                  required
                  type="email"
                  placeholder="liam.n@example.com"
                  value={newInvite.email}
                  onChange={e => setNewInvite({ ...newInvite, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <Input
                    placeholder="e.g. Full Stack Engineer"
                    value={newInvite.role}
                    onChange={e => setNewInvite({ ...newInvite, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newInvite.dept}
                    onChange={e => setNewInvite({ ...newInvite, dept: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Data & AI">Data & AI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expected Day 1 Date</label>
                <Input
                  type="date"
                  value={newInvite.joiningDate}
                  onChange={e => setNewInvite({ ...newInvite, joiningDate: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInviteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
