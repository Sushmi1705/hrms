import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';
import { 
  ArrowLeft, Edit, ChevronDown, Mail, Phone, MapPin, 
  Building, Calendar, User, Briefcase, Clock, CalendarCheck, 
  DollarSign, FileText, HeartPulse, GraduationCap, Shield, History,
  Download, ExternalLink, University, CreditCard, Award,
  CheckCircle2, AlertCircle, Laptop, Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { EmployeeFormDrawer } from './EmployeeFormDrawer';

const TABS = [
  { name: 'Overview', icon: User },
  { name: 'Personal', icon: HeartPulse },
  { name: 'Employment', icon: Briefcase },
  { name: 'Attendance', icon: Clock },
  { name: 'Leave', icon: CalendarCheck },
  { name: 'Payroll', icon: DollarSign },
  { name: 'Education', icon: GraduationCap },
  { name: 'Bank Details', icon: CreditCard },
  { name: 'Documents', icon: FileText },
  { name: 'Assets', icon: Shield },
  { name: 'Audit', icon: History }
];

function getInitials(first: string, last: string) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase();
}

export function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState((location.state as any)?.tab || 'Overview');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: employee, isLoading, isError } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/v1/Employees`);
      const employees = res.data.data || res.data.value || res.data || [];
      const employee = employees.find((e: any) => e.id === id);
      if (!employee) throw new Error("Employee not found");
      return employee;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <Skeleton className="md:col-span-1 h-96 rounded-xl" />
          <Skeleton className="md:col-span-3 lg:col-span-4 h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Employee Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/employees')}>Back to Employees</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button onClick={() => navigate('/employees')} className="group flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center mr-3 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Directory
        </button>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 px-4 rounded-full shadow-sm" onClick={() => setDrawerOpen(true)}>
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
          <Button className="h-9 px-4 rounded-full shadow-sm">
            Actions <ChevronDown className="w-4 h-4 ml-2 opacity-70" />
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-sm overflow-hidden relative">
        {/* Banner with a vibrant premium gradient */}
        <div className="h-32 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        <div className="px-6 md:px-10 pb-6 relative">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start -mt-12">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="w-28 h-28 md:w-32 md:h-32 rounded-3xl border-4 border-white dark:border-slate-950 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl font-light">
                  {getInitials(employee.firstName, employee.lastName)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Name and Basic Info */}
            <div className="flex-1 pt-14 md:pt-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {employee.firstName} {employee.lastName}
                    </h1>
                    <Badge variant={employee.status === 'Active' ? 'success' : 'secondary'} className="rounded-full px-3 shadow-sm border-0 bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {employee.status}
                    </Badge>
                  </div>
                  <p className="text-base text-slate-500 font-medium">{employee.employeeNumber} &bull; Software Engineer</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Building className="w-4 h-4 text-blue-500" />
              Engineering
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-500" />
              London HQ
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-purple-500" />
              {employee.email}
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-amber-500" />
              Joined {new Date(employee.joiningDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Vertical Tabs Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-4 lg:pb-0 hide-scrollbar">
            {TABS.map(tab => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all text-left ${
                    isActive 
                      ? 'bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-200/60 dark:border-slate-700' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'opacity-70'}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card: Basic Info */}
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center">
                      <User className="w-4 h-4 mr-2" /> Basic Information
                    </h3>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">First Name</p>
                          <p className="font-medium text-slate-900 dark:text-white">{employee.firstName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Last Name</p>
                          <p className="font-medium text-slate-900 dark:text-white">{employee.lastName}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Employee ID</p>
                          <p className="font-mono text-sm font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded inline-block">{employee.employeeNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Status</p>
                          <p className="font-medium text-slate-900 dark:text-white flex items-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                            {employee.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card: Contact Info */}
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center">
                      <Phone className="w-4 h-4 mr-2" /> Contact Details
                    </h3>
                    <div className="space-y-5">
                      <div className="flex items-start gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-0.5">Primary Email</p>
                          <p className="font-medium text-slate-900 dark:text-white">{employee.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-0.5">Phone Number</p>
                          <p className="font-medium text-slate-900 dark:text-white">+1 (555) 123-4567</p>
                          <p className="text-xs text-slate-400 mt-0.5">Personal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Personal' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" /> Residential Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Street Address</p>
                      <p className="font-medium text-slate-900 dark:text-white">123 Innovation Drive, Suite 400</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">City / State</p>
                      <p className="font-medium text-slate-900 dark:text-white">San Francisco, CA</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Postal Code</p>
                      <p className="font-medium text-slate-900 dark:text-white">94105</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Country</p>
                      <p className="font-medium text-slate-900 dark:text-white">United States</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center">
                    <HeartPulse className="w-4 h-4 mr-2" /> Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Contact Name</p>
                      <p className="font-medium text-slate-900 dark:text-white">Jane Doe</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Relationship</p>
                      <p className="font-medium text-slate-900 dark:text-white">Spouse</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Phone Number</p>
                      <p className="font-medium text-slate-900 dark:text-white">+1 (555) 000-0000</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Employment' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" /> Job Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Designation</p>
                      <p className="font-medium text-slate-900 dark:text-white">Software Engineer</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Department</p>
                      <p className="font-medium text-slate-900 dark:text-white">Engineering</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Employment Type</p>
                      <p className="font-medium text-slate-900 dark:text-white">Full-Time</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Reporting Manager</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="w-6 h-6"><AvatarFallback className="text-[10px]">AM</AvatarFallback></Avatar>
                        <p className="font-medium text-slate-900 dark:text-white">Alex Manager</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Work Location</p>
                      <p className="font-medium text-slate-900 dark:text-white">London HQ (Hybrid)</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Probation End Date</p>
                      <p className="font-medium text-slate-900 dark:text-white">Nov 6, 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Education' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center">
                      <University className="w-4 h-4 mr-2" /> Academic History
                    </h3>
                  </div>
                  
                  <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 space-y-10 pb-4">
                    <div className="relative pl-8">
                      <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1 ring-4 ring-white dark:ring-slate-950"></div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">Master of Computer Science</h4>
                      <p className="text-slate-500 font-medium">Stanford University</p>
                      <p className="text-sm text-slate-400 mt-1">2022 - 2024 &bull; GPA: 3.8/4.0</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-full -left-[9px] top-1 ring-4 ring-white dark:ring-slate-950"></div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">Bachelor of Science in Engineering</h4>
                      <p className="text-slate-500 font-medium">University of California, Berkeley</p>
                      <p className="text-sm text-slate-400 mt-1">2018 - 2022</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Bank Details' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
                    <CreditCard className="w-64 h-64" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center relative z-10">
                    <CreditCard className="w-4 h-4 mr-2" /> Payroll Account
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Bank Name</p>
                      <p className="font-bold text-xl text-slate-900 dark:text-white">JPMorgan Chase</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Account Holder</p>
                      <p className="font-medium text-lg text-slate-900 dark:text-white">{employee.firstName} {employee.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Account Number</p>
                      <p className="font-mono font-medium text-lg text-slate-900 dark:text-white">•••• •••• 1234</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Routing Number / Sort Code</p>
                      <p className="font-mono font-medium text-lg text-slate-900 dark:text-white">012345678</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Documents' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Offer Letter', 'Passport Copy', 'Tax W-4 Form'].map((doc, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between h-40">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{doc}.pdf</h4>
                        <p className="text-xs text-slate-500 mt-1">Uploaded Aug 24, 2026 &bull; 2.4 MB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Attendance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
                    <h4 className="text-slate-500 text-sm font-medium mb-2">Avg. Working Hours</h4>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">8h 15m</p>
                    <p className="text-emerald-500 text-sm mt-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Above target</p>
                  </div>
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
                    <h4 className="text-slate-500 text-sm font-medium mb-2">On-Time Arrival</h4>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">96%</p>
                    <p className="text-slate-400 text-sm mt-2">Last 30 days</p>
                  </div>
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
                    <h4 className="text-slate-500 text-sm font-medium mb-2">Late Days</h4>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">1</p>
                    <p className="text-amber-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> Needs attention</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Recent Logs</h3>
                  <div className="space-y-4">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Aug {25 - i}, 2026</p>
                          <p className="text-sm text-slate-500">Regular Shift (9:00 AM - 5:00 PM)</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-slate-900 dark:text-white">08:5{i} AM - 05:1{i} PM</p>
                          <Badge variant="outline" className="mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">Present</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Leave' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
                    <h4 className="text-slate-500 text-sm font-medium mb-2">Annual Leave</h4>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">12<span className="text-lg text-slate-400 font-medium ml-1">/ 20</span></p>
                    <p className="text-slate-400 text-sm mt-2">Days available</p>
                  </div>
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
                    <h4 className="text-slate-500 text-sm font-medium mb-2">Sick Leave</h4>
                    <p className="text-3xl font-bold text-amber-500">4<span className="text-lg text-slate-400 font-medium ml-1">/ 10</span></p>
                    <p className="text-slate-400 text-sm mt-2">Days available</p>
                  </div>
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex items-center justify-center">
                    <Button variant="outline" className="w-full h-full rounded-2xl border-dashed border-2 text-slate-500 hover:text-primary hover:border-primary/50">
                      + Apply Leave
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Payroll' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" /> Recent Payslips
                  </h3>
                  <div className="space-y-4">
                    {['July 2026', 'June 2026', 'May 2026'].map((month, idx) => (
                      <div key={idx} className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Payslip for {month}</p>
                            <p className="text-sm text-slate-500">Processed on {month.split(' ')[0]} 28, 2026</p>
                          </div>
                        </div>
                        <Button variant="outline" className="rounded-full">Download PDF</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Assets' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
                      <Laptop className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">MacBook Pro 16"</h4>
                      <p className="text-sm text-slate-500 mt-1">Serial: C02CG12345</p>
                      <Badge variant="outline" className="mt-2 bg-slate-50">Assigned Aug 6, 2026</Badge>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
                      <Monitor className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Dell UltraSharp 27"</h4>
                      <p className="text-sm text-slate-500 mt-1">Serial: CN-0HG423</p>
                      <Badge variant="outline" className="mt-2 bg-slate-50">Assigned Aug 10, 2026</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Audit' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Activity Timeline</h3>
                  <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 space-y-8 pb-4">
                    <div className="relative pl-8">
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-slate-950"></div>
                      <p className="text-sm text-slate-400 font-medium mb-1">Today at 10:42 AM</p>
                      <h4 className="font-medium text-slate-900 dark:text-white">Profile updated</h4>
                      <p className="text-sm text-slate-500 mt-1">System Admin updated residential address.</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-slate-950"></div>
                      <p className="text-sm text-slate-400 font-medium mb-1">Aug 10, 2026</p>
                      <h4 className="font-medium text-slate-900 dark:text-white">Asset Assigned</h4>
                      <p className="text-sm text-slate-500 mt-1">IT Department assigned Dell UltraSharp 27".</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-slate-950"></div>
                      <p className="text-sm text-slate-400 font-medium mb-1">Aug 6, 2026</p>
                      <h4 className="font-medium text-slate-900 dark:text-white">Employee Onboarded</h4>
                      <p className="text-sm text-slate-500 mt-1">Profile created by HR Manager.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      <EmployeeFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} employeeToEdit={employee} />
    </div>
  );
}
