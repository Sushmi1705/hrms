import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Eye, Mail, Laptop, UserCheck, Plus, 
  X, Calendar, Building2, User, Phone, ShieldCheck, 
  Send, Sparkles, ChevronRight, Check
} from 'lucide-react';

export interface JoiningEmployee {
  id: number;
  empCode: string;
  name: string;
  role: string;
  dept: string;
  date: string;
  email: string;
  phone: string;
  reportingManager: string;
  assignedBuddy: string;
  location: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  progressPercent: number;
  documentsVerified: boolean;
  bgvCleared: boolean;
  laptopShipped: boolean;
  orientationScheduled: boolean;
  probationDuration: string;
}

const INITIAL_JOINING_DATA: JoiningEmployee[] = [
  {
    id: 1,
    empCode: 'EMP-2026-901',
    name: 'Sarah Jenkins',
    role: 'Senior Developer',
    dept: 'Engineering',
    date: '2026-09-01',
    email: 'sarah.jenkins@anraone.com',
    phone: '+1 (555) 234-5678',
    reportingManager: 'Alice Cooper (VP Engineering)',
    assignedBuddy: 'Michael Brown (Staff Dev)',
    location: 'San Francisco, CA (Hybrid)',
    status: 'Pending',
    progressPercent: 65,
    documentsVerified: true,
    bgvCleared: true,
    laptopShipped: false,
    orientationScheduled: true,
    probationDuration: '90 Days'
  },
  {
    id: 2,
    empCode: 'EMP-2026-902',
    name: 'Michael Chen',
    role: 'Product Manager',
    dept: 'Product',
    date: '2026-09-05',
    email: 'michael.chen@anraone.com',
    phone: '+1 (555) 345-6789',
    reportingManager: 'Sophia Patel (Head of Product)',
    assignedBuddy: 'David Wilson (Senior PM)',
    location: 'New York, NY (Hybrid)',
    status: 'Completed',
    progressPercent: 100,
    documentsVerified: true,
    bgvCleared: true,
    laptopShipped: true,
    orientationScheduled: true,
    probationDuration: '90 Days'
  },
  {
    id: 3,
    empCode: 'EMP-2026-903',
    name: 'Elena Rodriguez',
    role: 'Staff Data Scientist',
    dept: 'Data & AI',
    date: '2026-09-15',
    email: 'elena.r@anraone.com',
    phone: '+1 (555) 456-7890',
    reportingManager: 'Dr. Robert Vance (AI Director)',
    assignedBuddy: 'Marcus Vance (ML Lead)',
    location: 'Remote',
    status: 'In Progress',
    progressPercent: 45,
    documentsVerified: true,
    bgvCleared: false,
    laptopShipped: true,
    orientationScheduled: false,
    probationDuration: '180 Days'
  },
  {
    id: 4,
    empCode: 'EMP-2026-904',
    name: 'David Wilson',
    role: 'Frontend Dev',
    dept: 'Engineering',
    date: '2026-09-20',
    email: 'david.wilson@anraone.com',
    phone: '+1 (555) 567-8901',
    reportingManager: 'Alice Cooper (VP Engineering)',
    assignedBuddy: 'Sarah Jenkins (Senior Dev)',
    location: 'Austin, TX (Remote)',
    status: 'Pending',
    progressPercent: 30,
    documentsVerified: false,
    bgvCleared: false,
    laptopShipped: false,
    orientationScheduled: false,
    probationDuration: '90 Days'
  }
];

export function JoiningEmployeesList() {
  const [employees, setEmployees] = useState<JoiningEmployee[]>(INITIAL_JOINING_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Modals & Menu
  const [selectedEmployee, setSelectedEmployee] = useState<JoiningEmployee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // New employee form state
  const [newHire, setNewHire] = useState({
    name: '',
    role: 'Senior Developer',
    dept: 'Engineering',
    date: '2026-09-25',
    email: '',
    phone: '+1 (555) 000-0000',
    reportingManager: 'Alice Cooper',
    assignedBuddy: 'Michael Brown',
    location: 'Remote'
  });

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(item => {
      const matchSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchDept = deptFilter === 'All' || item.dept === deptFilter;

      return matchSearch && matchStatus && matchDept;
    });
  }, [employees, searchTerm, statusFilter, deptFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = employees.length;
    const pending = employees.filter(e => e.status === 'Pending').length;
    const inProgress = employees.filter(e => e.status === 'In Progress').length;
    const completed = employees.filter(e => e.status === 'Completed').length;
    return { total, pending, inProgress, completed };
  }, [employees]);

  // Actions
  const handleMarkComplete = (id: number) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status: 'Completed',
          progressPercent: 100,
          documentsVerified: true,
          bgvCleared: true,
          laptopShipped: true,
          orientationScheduled: true
        };
      }
      return e;
    }));

    if (selectedEmployee && selectedEmployee.id === id) {
      setSelectedEmployee(prev => prev ? {
        ...prev,
        status: 'Completed',
        progressPercent: 100,
        documentsVerified: true,
        bgvCleared: true,
        laptopShipped: true,
        orientationScheduled: true
      } : null);
    }

    setActiveMenuId(null);
    showToast('Onboarding Completed', 'Employee successfully marked as fully onboarded.');
  };

  const handleSendWelcomeEmail = (emp: JoiningEmployee) => {
    setActiveMenuId(null);
    showToast('Welcome Email Sent', `Onboarding credentials and orientation guide sent to ${emp.email}`);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHire.name) return;

    const record: JoiningEmployee = {
      id: Date.now(),
      empCode: `EMP-2026-${Math.floor(900 + Math.random() * 99)}`,
      name: newHire.name,
      role: newHire.role,
      dept: newHire.dept,
      date: newHire.date,
      email: newHire.email || `${newHire.name.toLowerCase().replace(/\s+/g, '.')}@anraone.com`,
      phone: newHire.phone,
      reportingManager: newHire.reportingManager,
      assignedBuddy: newHire.assignedBuddy,
      location: newHire.location,
      status: 'Pending',
      progressPercent: 25,
      documentsVerified: false,
      bgvCleared: false,
      laptopShipped: false,
      orientationScheduled: false,
      probationDuration: '90 Days'
    };

    setEmployees([record, ...employees]);
    setIsAddModalOpen(false);
    showToast('New Hire Registered', `${record.name} added to upcoming joining schedule.`);
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
              <p className="text-xs text-slate-500 font-medium uppercase">Total Joining</p>
              <h4 className="text-xl font-bold text-slate-900">{stats.total} Hires</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Pending Action</p>
              <h4 className="text-xl font-bold text-amber-600">{stats.pending} Hires</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">In Progress</p>
              <h4 className="text-xl font-bold text-blue-600">{stats.inProgress} Hires</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Fully Integrated</p>
              <h4 className="text-xl font-bold text-emerald-600">{stats.completed} Hires</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Joining Employees
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Active Cohort
              </span>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Track new hire verification, IT hardware dispatch, orientation schedules, and probation periods.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search by name, role, dept..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 h-9 border-slate-200 text-xs bg-slate-50 focus-visible:ring-indigo-500" 
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2.5 h-9 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2.5 h-9 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Depts</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Data & AI">Data & AI</option>
            </select>

            <Button 
              onClick={() => setIsAddModalOpen(true)}
              size="sm"
              className="h-9 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Hire
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Employee Name</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Joining Date</th>
                  <th className="px-6 py-3.5">Milestone Progress</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-medium text-slate-700 text-sm">No joining employees found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Try changing your search or filter options.</p>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-xs">
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-xs leading-snug">{emp.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{emp.empCode}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-700 font-medium">
                        {emp.role}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                        {emp.dept}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{emp.date}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                            <div 
                              className={`h-full rounded-full ${
                                emp.progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${emp.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-600">{emp.progressPercent}%</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {emp.status === 'Completed' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 mr-1"/> {emp.status}
                          </span>
                        ) : emp.status === 'In Progress' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                            <Clock className="w-3 h-3 mr-1"/> {emp.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 mr-1"/> {emp.status}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right relative">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick View Button */}
                          <Button
                            onClick={() => setSelectedEmployee(emp)}
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1 font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Button>

                          {/* Action Menu Toggle Button */}
                          <div className="relative">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setActiveMenuId(activeMenuId === emp.id ? null : emp.id)}
                              className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 rounded-md"
                            >
                              <MoreHorizontal className="w-4 h-4 text-slate-600"/>
                            </Button>

                            {/* Dropdown Action Menu */}
                            {activeMenuId === emp.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1.5 animate-in fade-in zoom-in-95 text-xs text-left">
                                <button
                                  onClick={() => {
                                    setSelectedEmployee(emp);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                                >
                                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>View Dossier</span>
                                </button>

                                <button
                                  onClick={() => handleSendWelcomeEmail(emp)}
                                  className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                                >
                                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Send Welcome Email</span>
                                </button>

                                {emp.status !== 'Completed' && (
                                  <button
                                    onClick={() => handleMarkComplete(emp.id)}
                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-medium border-t border-slate-100"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Mark Onboarding Done</span>
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
            <div>Showing {filteredEmployees.length} of {employees.length} joining employees</div>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" disabled className="h-8 text-xs">Previous</Button>
              <Button variant="outline" size="sm" disabled className="h-8 text-xs">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODAL: Employee Onboarding Dossier & Milestones */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-bold flex items-center justify-center text-base">
                  {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {selectedEmployee.name}
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {selectedEmployee.empCode}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{selectedEmployee.role} • {selectedEmployee.dept}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto text-xs">
              {/* Progress Banner */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-800">Overall Onboarding Readiness</span>
                  <span className="font-extrabold text-indigo-600 text-sm">{selectedEmployee.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedEmployee.progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${selectedEmployee.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 block font-medium">Work Email</span>
                  <span className="font-semibold text-slate-800 truncate block mt-0.5">{selectedEmployee.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Official Joining Date</span>
                  <span className="font-semibold text-indigo-600 block mt-0.5">{selectedEmployee.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Work Location</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedEmployee.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Reporting Manager</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedEmployee.reportingManager}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Assigned Onboarding Buddy</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedEmployee.assignedBuddy}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Probation Period</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedEmployee.probationDuration}</span>
                </div>
              </div>

              {/* Checklists & Verification Items */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Integration Milestone Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">Pre-Boarding Documents</p>
                      <p className="text-[11px] text-slate-400">Tax forms, W-4, ID Verification</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedEmployee.documentsVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedEmployee.documentsVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">Background Verification</p>
                      <p className="text-[11px] text-slate-400">Criminal & Employment check</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedEmployee.bgvCleared ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedEmployee.bgvCleared ? 'Cleared' : 'In Progress'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">IT Equipment & Laptop</p>
                      <p className="text-[11px] text-slate-400">Hardware provisioning & dispatch</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedEmployee.laptopShipped ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedEmployee.laptopShipped ? 'Delivered' : 'Pending IT'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">First-Day Orientation</p>
                      <p className="text-[11px] text-slate-400">Calendar meet & culture intro</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedEmployee.orientationScheduled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedEmployee.orientationScheduled ? 'Booked' : 'Not Set'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendWelcomeEmail(selectedEmployee)}
                className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                Resend Welcome Email
              </Button>

              <div className="flex items-center gap-2">
                {selectedEmployee.status !== 'Completed' ? (
                  <Button
                    size="sm"
                    onClick={() => handleMarkComplete(selectedEmployee.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5 font-medium"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Complete Onboarding
                  </Button>
                ) : (
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active Full Employee
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEmployee(null)}
                  className="border-slate-200 text-slate-600 text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Register New Joining Employee */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5" />
                <h3 className="text-base font-bold">Register Upcoming New Hire</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Employee Full Name *</label>
                  <Input
                    required
                    placeholder="e.g. Rachel Green"
                    value={newHire.name}
                    onChange={e => setNewHire({ ...newHire, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <Input
                    placeholder="e.g. Senior Developer"
                    value={newHire.role}
                    onChange={e => setNewHire({ ...newHire, role: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newHire.dept}
                    onChange={e => setNewHire({ ...newHire, dept: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Joining Date</label>
                  <Input
                    type="date"
                    value={newHire.date}
                    onChange={e => setNewHire({ ...newHire, date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Work Location</label>
                  <Input
                    placeholder="e.g. San Francisco (Hybrid)"
                    value={newHire.location}
                    onChange={e => setNewHire({ ...newHire, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reporting Manager</label>
                  <Input
                    placeholder="e.g. Alice Cooper"
                    value={newHire.reportingManager}
                    onChange={e => setNewHire({ ...newHire, reportingManager: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Buddy</label>
                  <Input
                    placeholder="e.g. Michael Brown"
                    value={newHire.assignedBuddy}
                    onChange={e => setNewHire({ ...newHire, assignedBuddy: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Save New Hire
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
