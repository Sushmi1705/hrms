import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Target, Banknote, CalendarRange, LayoutDashboard, Building2, Briefcase, MapPin, Map, Bell, Search, Menu, User, ChevronRight, Users, GraduationCap, DollarSign, Network, Clock, Settings, FileText, BarChart, Shield, Package, Layers, UserCheck, ClipboardCheck, FileSpreadsheet, TrendingUp, Award, ShieldCheck, CheckCircle, Plane, Receipt, CreditCard } from 'lucide-react';
import { NotificationBell } from '../components/NotificationBell';

export function SidebarItem({ icon: Icon, label, to, collapsed }: { icon: any, label: string, to: string, collapsed: boolean }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to) && (to !== '/admin' || location.pathname === '/admin');
  return (
    <Link to={to} className={"flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 " + (isActive ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
      <Icon className="w-5 h-5 shrink-0" />
      {!collapsed && <span className="font-medium text-sm whitespace-nowrap">{label}</span>}
    </Link>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const getBreadcrumb = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'admin') return 'Dashboard';
    return path.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <aside className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-20 ${collapsed ? 'w-20' : 'w-72'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {!collapsed && (
            <div className="flex items-center space-x-2 px-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">H</div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">HR Admin</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 mx-auto">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
          <div>
            {!collapsed && <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Overview</div>}
            <div className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/admin" collapsed={collapsed} />
              <SidebarItem icon={BarChart} label="Reports & BI" to="/admin/reports/dashboard" collapsed={collapsed} />
            </div>
          </div>
          <div>
            {!collapsed && <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Talent Management</div>}
            <div className="space-y-1">
              <SidebarItem icon={Users} label="Employees" to="/admin/employees" collapsed={collapsed} />
              <SidebarItem icon={Clock} label="Attendance" to="/admin/attendance" collapsed={collapsed} />
              <SidebarItem icon={FileText} label="Leave" to="/admin/leave" collapsed={collapsed} />
              <SidebarItem icon={CalendarRange} label="Shift & Roster" to="/admin/shift" collapsed={collapsed} />
              <SidebarItem icon={BarChart} label="Performance" to="/admin/performance" collapsed={collapsed} />
              <SidebarItem icon={Banknote} label="Payroll" to="/admin/payroll" collapsed={collapsed} />
              <SidebarItem icon={Target} label="Recruitment" to="/admin/recruitment" collapsed={collapsed} />
              <SidebarItem icon={Target} label="Onboarding" to="/admin/onboarding" collapsed={collapsed} />
              <SidebarItem icon={Target} label="Offboarding" to="/admin/offboarding" collapsed={collapsed} />
              <SidebarItem icon={GraduationCap} label="Learning" to="/admin/learning" collapsed={collapsed} />
            </div>
          </div>
          <div>
            {!collapsed && <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Asset Management</div>}
            <div className="space-y-1">
              <SidebarItem icon={Package} label="Assets Dashboard" to="/admin/assets/dashboard" collapsed={collapsed} />
              <SidebarItem icon={Layers} label="Hardware Inventory" to="/admin/assets" collapsed={collapsed} />
              <SidebarItem icon={UserCheck} label="Lifecycle & Custody" to="/admin/assets/lifecycle" collapsed={collapsed} />
              <SidebarItem icon={ClipboardCheck} label="Physical Audits" to="/admin/assets/audits" collapsed={collapsed} />
              <SidebarItem icon={FileSpreadsheet} label="Depreciation & Reports" to="/admin/assets/reports" collapsed={collapsed} />
              <SidebarItem icon={FileText} label="Asset Requisitions" to="/admin/assets/requests" collapsed={collapsed} />
            </div>
          </div>
          <div>
            {!collapsed && <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Benefits & Compensation</div>}
            <div className="space-y-1">
              <SidebarItem icon={TrendingUp} label="Comp Dashboard" to="/admin/compensation/dashboard" collapsed={collapsed} />
              <SidebarItem icon={DollarSign} label="Employee Salaries" to="/admin/compensation/employees" collapsed={collapsed} />
              <SidebarItem icon={Layers} label="Salary Structures" to="/admin/compensation/structures" collapsed={collapsed} />
              <SidebarItem icon={Clock} label="Salary Revisions" to="/admin/compensation/revisions" collapsed={collapsed} />
              <SidebarItem icon={Award} label="Variable Bonuses" to="/admin/compensation/bonuses" collapsed={collapsed} />
              <SidebarItem icon={CheckCircle} label="Merit Review Cycles" to="/admin/compensation/reviews" collapsed={collapsed} />
              <SidebarItem icon={ShieldCheck} label="Benefit Plans" to="/admin/compensation/benefit-plans" collapsed={collapsed} />
              <SidebarItem icon={Users} label="Benefit Enrollments" to="/admin/compensation/benefit-enrollments" collapsed={collapsed} />
              <SidebarItem icon={FileSpreadsheet} label="Compensation Reports" to="/admin/compensation/reports" collapsed={collapsed} />
            </div>
          </div>
          <div>
            {!collapsed && <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Travel & Expense</div>}
            <div className="space-y-1">
              <SidebarItem icon={Plane} label="T&E Dashboard" to="/admin/travel" collapsed={collapsed} />
              <SidebarItem icon={MapPin} label="Travel Requests" to="/admin/travel/requests" collapsed={collapsed} />
              <SidebarItem icon={Briefcase} label="Trips" to="/admin/travel/trips" collapsed={collapsed} />
              <SidebarItem icon={Receipt} label="Expenses" to="/admin/travel/expenses" collapsed={collapsed} />
              <SidebarItem icon={FileText} label="Expense Reports" to="/admin/travel/reports" collapsed={collapsed} />
              <SidebarItem icon={CreditCard} label="Advances" to="/admin/travel/advances" collapsed={collapsed} />
            </div>
          </div>
          <div>
            {!collapsed && <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Organization Core</div>}
            <div className="space-y-1">
              <SidebarItem icon={Building2} label="Companies" to="/admin/companies" collapsed={collapsed} />
              <SidebarItem icon={Briefcase} label="Business Units" to="/admin/business-units" collapsed={collapsed} />
              <SidebarItem icon={MapPin} label="Branches" to="/admin/branches" collapsed={collapsed} />
              <SidebarItem icon={Map} label="Locations" to="/admin/locations" collapsed={collapsed} />
            </div>
          </div>
          <div>
            {!collapsed && <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Structure</div>}
            <div className="space-y-1">
              <SidebarItem icon={Network} label="Departments" to="/admin/departments" collapsed={collapsed} />
              <SidebarItem icon={Users} label="Designations" to="/admin/designations" collapsed={collapsed} />
              <SidebarItem icon={GraduationCap} label="Job Grades" to="/admin/job-grades" collapsed={collapsed} />
              <SidebarItem icon={DollarSign} label="Cost Centers" to="/admin/cost-centers" collapsed={collapsed} />
            </div>
          </div>
          <div>
            {!collapsed && <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Administration</div>}
            <div className="space-y-1">
              <SidebarItem icon={Settings} label="System Admin" to="/admin/system" collapsed={collapsed} />
              <SidebarItem icon={FileText} label="Workflow Engine" to="/admin/workflow" collapsed={collapsed} />
              <SidebarItem icon={Bell} label="Notification Center" to="/admin/notifications" collapsed={collapsed} />
              <SidebarItem icon={Shield} label="Audit Logs" to="/admin/audit" collapsed={collapsed} />
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 glass border-b sticky top-0 z-10 flex items-center px-6 justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Admin Portal</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-foreground">{getBreadcrumb()}</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search HR Admin..." className="w-64 h-9 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <NotificationBell />
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white shadow-md cursor-pointer border-2 border-white dark:border-slate-800 ring-2 ring-transparent hover:ring-primary/30 transition-all">
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}







