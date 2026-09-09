import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, CheckSquare, ListChecks, Download, Check, 
  Send, Users, Calendar, UserCheck, X, Briefcase
} from 'lucide-react';

export interface ChecklistTask {
  id: string;
  category: 'HR Orientation' | 'Manager Sync' | 'Team Intro' | 'Security & IT';
  title: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

export interface TaskChecklistRecord {
  id: number;
  empCode: string;
  name: string;
  role: string;
  dept: string;
  startDate: string;
  manager: string;
  buddy: string;
  hr: 'Done' | 'Scheduled' | 'Pending';
  mgr: 'Done' | 'Scheduled' | 'Pending';
  team: 'Done' | 'Scheduled' | 'Pending';
  status: 'Completed' | 'In Progress' | 'Pending';
  tasks: ChecklistTask[];
  notes?: string;
}

const INITIAL_CHECKLISTS: TaskChecklistRecord[] = [
  {
    id: 1,
    empCode: 'EMP-2026-901',
    name: 'Sarah Jenkins',
    role: 'Senior Developer',
    dept: 'Engineering',
    startDate: '01 Sep 2026',
    manager: 'Michael Chen (VP Eng)',
    buddy: 'Daniel Zhang (Staff Eng)',
    hr: 'Scheduled',
    mgr: 'Pending',
    team: 'Pending',
    status: 'Pending',
    tasks: [
      { id: '1', category: 'HR Orientation', title: 'Company Culture & Core Values Overview', assignee: 'HR Lead (Alice)', dueDate: 'Day 1 (10:00 AM)', completed: false },
      { id: '2', category: 'HR Orientation', title: 'Benefits, 401(k) & Health Insurance Enrollment', assignee: 'HR Benefits Specialist', dueDate: 'Day 2', completed: false },
      { id: '3', category: 'Manager Sync', title: '30-60-90 Day Goal Setting & Expectations', assignee: 'Michael Chen', dueDate: 'Day 1 (02:00 PM)', completed: false },
      { id: '4', category: 'Manager Sync', title: 'Architecture Review & Codebase Walkthrough', assignee: 'Michael Chen', dueDate: 'Day 3', completed: false },
      { id: '5', category: 'Team Intro', title: 'Team Welcome Lunch & Standup Introduction', assignee: 'Engineering Team', dueDate: 'Day 1 (12:30 PM)', completed: false },
      { id: '6', category: 'Team Intro', title: 'Coffee Chat with Assigned Onboarding Buddy', assignee: 'Daniel Zhang', dueDate: 'Day 2', completed: false },
      { id: '7', category: 'Security & IT', title: 'Mandatory SOC2 & GDPR Compliance Training', assignee: 'Candidate', dueDate: 'Day 5', completed: false },
    ],
    notes: 'Orientation packet dispatched. Manager 1-on-1 booked in Google Calendar.'
  },
  {
    id: 2,
    empCode: 'EMP-2026-902',
    name: 'Jane Smith',
    role: 'Staff Product Designer',
    dept: 'Design',
    startDate: '25 Aug 2026',
    manager: 'Chloe Bennett (Head of Design)',
    buddy: 'Sophie Laurent (Senior Designer)',
    hr: 'Done',
    mgr: 'Done',
    team: 'Done',
    status: 'Completed',
    tasks: [
      { id: '1', category: 'HR Orientation', title: 'Company Culture & Core Values Overview', assignee: 'HR Lead (Alice)', dueDate: 'Day 1', completed: true },
      { id: '2', category: 'HR Orientation', title: 'Benefits & Equity Grant Briefing', assignee: 'HR Benefits Specialist', dueDate: 'Day 2', completed: true },
      { id: '3', category: 'Manager Sync', title: 'Design System Roadmapping & Q4 Priorities', assignee: 'Chloe Bennett', dueDate: 'Day 1', completed: true },
      { id: '4', category: 'Manager Sync', title: 'Bi-weekly 1:1 Cadence & Review Alignment', assignee: 'Chloe Bennett', dueDate: 'Day 2', completed: true },
      { id: '5', category: 'Team Intro', title: 'Welcome Coffee with Product Design Squad', assignee: 'Design Team', dueDate: 'Day 1', completed: true },
      { id: '6', category: 'Team Intro', title: 'Figma Library & Component Library Walkthrough', assignee: 'Sophie Laurent', dueDate: 'Day 2', completed: true },
      { id: '7', category: 'Security & IT', title: 'Security & Privacy Compliance Certifications', assignee: 'Candidate', dueDate: 'Day 3', completed: true },
    ],
    notes: 'All week 1 onboarding sessions completed with exemplary engagement.'
  },
  {
    id: 3,
    empCode: 'EMP-2026-903',
    name: 'Alex Morgan',
    role: 'Growth Marketing Lead',
    dept: 'Marketing',
    startDate: '28 Aug 2026',
    manager: 'David Ross (CMO)',
    buddy: 'Rachel Adams (Content Lead)',
    hr: 'Done',
    mgr: 'Scheduled',
    team: 'Scheduled',
    status: 'In Progress',
    tasks: [
      { id: '1', category: 'HR Orientation', title: 'Company Culture & Core Values Overview', assignee: 'HR Lead (Alice)', dueDate: 'Day 1', completed: true },
      { id: '2', category: 'HR Orientation', title: 'Corporate Policies & Handbook Acknowledgment', assignee: 'HR Ops', dueDate: 'Day 2', completed: true },
      { id: '3', category: 'Manager Sync', title: 'Paid Ad Channel Budgeting & KPI Targets', assignee: 'David Ross', dueDate: 'Day 2', completed: false },
      { id: '4', category: 'Team Intro', title: 'Marketing Weekly Alignment & Squad Intro', assignee: 'Marketing Team', dueDate: 'Day 3', completed: false },
      { id: '5', category: 'Security & IT', title: 'Data Privacy & Customer CRM Security Briefing', assignee: 'Candidate', dueDate: 'Day 4', completed: true },
    ],
    notes: 'HR onboarding verified; manager strategy session scheduled for tomorrow morning.'
  },
  {
    id: 4,
    empCode: 'EMP-2026-904',
    name: 'Marcus Vance',
    role: 'Lead DevOps Engineer',
    dept: 'Infrastructure',
    startDate: '20 Aug 2026',
    manager: 'Nate Sterling (Director of Infra)',
    buddy: 'Vikram Patel (Principal SRE)',
    hr: 'Done',
    mgr: 'Done',
    team: 'Done',
    status: 'Completed',
    tasks: [
      { id: '1', category: 'HR Orientation', title: 'HR General Orientation & Workplace Policies', assignee: 'HR Ops', dueDate: 'Day 1', completed: true },
      { id: '2', category: 'Manager Sync', title: 'Kubernetes Cluster Topography & On-Call Cadence', assignee: 'Nate Sterling', dueDate: 'Day 2', completed: true },
      { id: '3', category: 'Team Intro', title: 'SRE Team Shadowing Session', assignee: 'Vikram Patel', dueDate: 'Day 3', completed: true },
      { id: '4', category: 'Security & IT', title: 'SOC2 Type II Bastion Access Protocols', assignee: 'SecOps Lead', dueDate: 'Day 1', completed: true },
    ],
    notes: 'Fully integrated into on-call rotation after shadowing sprint.'
  }
];

export function TaskChecklist() {
  const [checklists, setChecklists] = useState<TaskChecklistRecord[]>(INITIAL_CHECKLISTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'In Progress' | 'Pending'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<TaskChecklistRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredChecklists = useMemo(() => {
    return checklists.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.manager.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [checklists, searchTerm, statusFilter]);

  const handleToggleTask = (taskId: string) => {
    if (!selectedRecord) return;
    const updatedTasks = selectedRecord.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    const allCompleted = updatedTasks.every(t => t.completed);
    const someCompleted = updatedTasks.some(t => t.completed);
    
    // Recalculate HR / Mgr / Team pills
    const hrTasks = updatedTasks.filter(t => t.category === 'HR Orientation');
    const mgrTasks = updatedTasks.filter(t => t.category === 'Manager Sync');
    const teamTasks = updatedTasks.filter(t => t.category === 'Team Intro');

    const hrStatus: 'Done' | 'Scheduled' | 'Pending' = 
      hrTasks.every(t => t.completed) ? 'Done' : hrTasks.some(t => t.completed) ? 'Scheduled' : 'Pending';
    const mgrStatus: 'Done' | 'Scheduled' | 'Pending' = 
      mgrTasks.every(t => t.completed) ? 'Done' : mgrTasks.some(t => t.completed) ? 'Scheduled' : 'Pending';
    const teamStatus: 'Done' | 'Scheduled' | 'Pending' = 
      teamTasks.every(t => t.completed) ? 'Done' : teamTasks.some(t => t.completed) ? 'Scheduled' : 'Pending';

    const newStatus: 'Completed' | 'In Progress' | 'Pending' = 
      allCompleted ? 'Completed' : someCompleted ? 'In Progress' : 'Pending';

    const updatedRecord: TaskChecklistRecord = {
      ...selectedRecord,
      tasks: updatedTasks,
      hr: hrStatus,
      mgr: mgrStatus,
      team: teamStatus,
      status: newStatus
    };

    setSelectedRecord(updatedRecord);
    setChecklists(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    showToast('Task checklist item updated');
  };

  const handleMarkAllDone = (id: number) => {
    setChecklists(prev => prev.map(r => {
      if (r.id !== id) return r;
      return {
        ...r,
        hr: 'Done',
        mgr: 'Done',
        team: 'Done',
        status: 'Completed',
        tasks: r.tasks.map(t => ({ ...t, completed: true })),
        notes: (r.notes ? r.notes + ' | ' : '') + 'All onboarding tasks and milestone check-ins verified complete.'
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        hr: 'Done',
        mgr: 'Done',
        team: 'Done',
        status: 'Completed',
        tasks: prev.tasks.map(t => ({ ...t, completed: true }))
      } : null);
    }
    showToast('All onboarding tasks marked completed for employee!');
  };

  const handleSendReminder = (rec: TaskChecklistRecord) => {
    setActiveDropdown(null);
    showToast(`Reminders sent to Manager (${rec.manager}) and Buddy (${rec.buddy})`);
  };

  const handleDownloadReport = (rec: TaskChecklistRecord) => {
    const total = rec.tasks.length;
    const completedCount = rec.tasks.filter(t => t.completed).length;
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    const content = `===============================================================
           EMPLOYEE ONBOARDING TASK CHECKLIST REPORT
===============================================================
Employee Name     : ${rec.name}
Employee Code     : ${rec.empCode}
Department        : ${rec.dept}
Job Title         : ${rec.role}
Start Date        : ${rec.startDate}
Hiring Manager    : ${rec.manager}
Assigned Buddy    : ${rec.buddy}
Overall Progress  : ${pct}% Complete (${completedCount}/${total} Tasks)
Status            : ${rec.status.toUpperCase()}
Report Date       : ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
---------------------------------------------------------------
1. MILESTONE SUMMARY
---------------------------------------------------------------
• HR Orientation    : ${rec.hr.toUpperCase()}
• Manager Sync      : ${rec.mgr.toUpperCase()}
• Team Introduction : ${rec.team.toUpperCase()}

---------------------------------------------------------------
2. DETAILED ACTION ITEMS
---------------------------------------------------------------
${rec.tasks.map((t, idx) => `[${t.completed ? 'COMPLETED' : ' PENDING '}] ${idx + 1}. ${t.title}
   - Category : ${t.category}
   - Assignee : ${t.assignee}
   - Due Date : ${t.dueDate}`).join('\n\n')}

---------------------------------------------------------------
Notes & Feedback:
${rec.notes || 'None'}
===============================================================
Sign-off:
HR Representative: ____________________  Date: ________________
Hiring Manager   : ____________________  Date: ________________
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Onboarding_Checklist_${rec.empCode}_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Checklist summary report downloaded for ${rec.name}`);
    setActiveDropdown(null);
  };

  return (
    <Card className="shadow-sm border-slate-200">
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-sm flex items-center justify-between shadow-md transition-all">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4" />
            {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 bg-slate-50/70 border-b border-slate-200">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Checklists</span>
            <ListChecks className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{checklists.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Active new hires</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Fully Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {checklists.filter(i => i.status === 'Completed').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">100% tasks signed off</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {checklists.filter(i => i.status === 'In Progress').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Underway this week</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Scheduled / Pending</span>
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {checklists.filter(i => i.status === 'Pending').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Upcoming Day-1 arrivals</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Onboarding Checklists</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Departmental, manager, and HR onboarding task progress</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search employee, manager..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Completed', 'In Progress', 'Pending'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === f 
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold' 
                    : 'hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">HR Orientation</th>
                <th className="px-6 py-3.5">Manager Sync</th>
                <th className="px-6 py-3.5">Team Intro</th>
                <th className="px-6 py-3.5">Progress & Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChecklists.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No onboarding checklists match your search.
                  </td>
                </tr>
              ) : (
                filteredChecklists.map((item) => {
                  const completedCount = item.tasks.filter(t => t.completed).length;
                  const total = item.tasks.length;
                  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.empCode} • {item.dept}</div>
                        <div className="text-[11px] text-slate-400">Mgr: {item.manager}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.hr === 'Done' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Done
                          </span>
                        ) : item.hr === 'Scheduled' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Calendar className="w-3 h-3 mr-1 text-blue-600"/> Scheduled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.mgr === 'Done' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Done
                          </span>
                        ) : item.mgr === 'Scheduled' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Calendar className="w-3 h-3 mr-1 text-blue-600"/> Scheduled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.team === 'Done' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Done
                          </span>
                        ) : item.team === 'Scheduled' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Calendar className="w-3 h-3 mr-1 text-blue-600"/> Scheduled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                pct === 100 ? 'bg-emerald-500' : pct > 40 ? 'bg-indigo-500' : 'bg-amber-500'
                              }`} 
                              style={{ width: `${pct}%` }} 
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{pct}%</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {completedCount}/{total} tasks complete
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="relative inline-flex items-center justify-end gap-1.5">
                          {/* Direct Action Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRecord(item)}
                            className="h-8 px-2.5 text-xs text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/80 border-indigo-200 font-medium flex items-center gap-1.5"
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                            Checklist
                          </Button>

                          {/* Dropdown Menu Toggle */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                            onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                          >
                            <MoreHorizontal className="w-4 h-4"/>
                          </Button>

                          {/* Dropdown Menu */}
                          {activeDropdown === item.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setActiveDropdown(null)} 
                              />
                              <div className="absolute right-0 top-9 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                  Checklist Actions
                                </div>

                                <button
                                  onClick={() => {
                                    setSelectedRecord(item);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                                >
                                  <ListChecks className="w-3.5 h-3.5 text-indigo-600" />
                                  Review & Tick Off Tasks
                                </button>

                                <button
                                  onClick={() => handleMarkAllDone(item.id)}
                                  className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  Mark All Tasks Completed
                                </button>

                                <button
                                  onClick={() => handleSendReminder(item)}
                                  className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                                >
                                  <Send className="w-3.5 h-3.5 text-blue-600" />
                                  Ping Manager & Buddy
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                <button
                                  onClick={() => handleDownloadReport(item)}
                                  className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                                >
                                  <Download className="w-3.5 h-3.5 text-slate-500" />
                                  Export Checklist Report (.txt)
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing {filteredChecklists.length} of {checklists.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredChecklists.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Task Checklist Inspection & Interactive Toggle Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-semibold">Onboarding Task Execution Board</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.name} ({selectedRecord.empCode}) • {selectedRecord.role} • {selectedRecord.dept}
                </p>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
              {/* Progress Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Completion Status
                  </div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">
                    {selectedRecord.tasks.filter(t => t.completed).length} of {selectedRecord.tasks.length} Tasks Done
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Manager: {selectedRecord.manager} • Buddy: {selectedRecord.buddy}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-indigo-600">
                    {Math.round((selectedRecord.tasks.filter(t => t.completed).length / selectedRecord.tasks.length) * 100)}%
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkAllDone(selectedRecord.id)}
                    className="h-7 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 mt-1"
                  >
                    Mark All Done
                  </Button>
                </div>
              </div>

              {/* Categorized Tasks */}
              {(['HR Orientation', 'Manager Sync', 'Team Intro', 'Security & IT'] as const).map(category => {
                const tasksInCat = selectedRecord.tasks.filter(t => t.category === category);
                if (tasksInCat.length === 0) return null;

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
                      <span className="flex items-center gap-1.5">
                        {category === 'HR Orientation' && <UserCheck className="w-3.5 h-3.5 text-indigo-600" />}
                        {category === 'Manager Sync' && <Briefcase className="w-3.5 h-3.5 text-blue-600" />}
                        {category === 'Team Intro' && <Users className="w-3.5 h-3.5 text-amber-600" />}
                        {category === 'Security & IT' && <ListChecks className="w-3.5 h-3.5 text-purple-600" />}
                        {category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {tasksInCat.filter(t => t.completed).length}/{tasksInCat.length} done
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {tasksInCat.map(task => (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(task.id)}
                          className={`p-3 rounded-lg border flex items-center justify-between transition-colors cursor-pointer ${
                            task.completed 
                              ? 'bg-emerald-50/50 border-emerald-200/80 text-slate-900' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input 
                              type="checkbox" 
                              checked={task.completed} 
                              onChange={() => {}} // Handled by outer div
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <div className={`text-xs font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                                {task.title}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                                <span>Assignee: {task.assignee}</span>
                                <span>•</span>
                                <span>Due: {task.dueDate}</span>
                              </div>
                            </div>
                          </div>

                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${
                            task.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {task.completed ? 'Done' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Notes */}
              {selectedRecord.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">HR Coordination Log:</span> {selectedRecord.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export Checklist (.txt)
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleMarkAllDone(selectedRecord.id)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Complete Checklist
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
