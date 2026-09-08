import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Bell, Search, Menu, User, ChevronRight, 
  Clock, FileText, Briefcase, HelpCircle, DollarSign, ShieldCheck, 
  Calendar, Users, Megaphone, Laptop, HeartPulse, X, ArrowLeft,
  Plane, Receipt, CreditCard, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarItem } from './AdminLayout';

export function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const getBreadcrumb = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'employee') return 'Dashboard';
    return path.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const navContent = (isMobile: boolean = false) => (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
      {/* 1. OVERVIEW */}
      <div>
        {(!collapsed || isMobile) && (
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Overview
          </div>
        )}
        <div className="space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/employee" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={User} label="My Profile" to="/employee/profile" collapsed={collapsed && !isMobile} />
        </div>
      </div>

      {/* 2. TIME & ATTENDANCE */}
      <div>
        {(!collapsed || isMobile) && (
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Time & Leave
          </div>
        )}
        <div className="space-y-1">
          <SidebarItem icon={Clock} label="Attendance & Punch" to="/employee/attendance" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={FileText} label="Leave Balances" to="/employee/leave" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={Calendar} label="Calendar & Schedule" to="/employee/calendar" collapsed={collapsed && !isMobile} />
        </div>
      </div>

      {/* 3. FINANCE & BENEFITS */}
      <div>
        {(!collapsed || isMobile) && (
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Compensation
          </div>
        )}
        <div className="space-y-1">
          <SidebarItem icon={DollarSign} label="Payroll & Payslips" to="/employee/payroll" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={DollarSign} label="Total Rewards" to="/employee/compensation" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={HeartPulse} label="Health & Benefits" to="/employee/benefits" collapsed={collapsed && !isMobile} />
        </div>
      </div>

      {/* 4. WORKPLACE ASSETS & DOCS */}
      <div>
        {(!collapsed || isMobile) && (
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workplace
          </div>
        )}
        <div className="space-y-1">
          <SidebarItem icon={Laptop} label="My Assets" to="/employee/assets" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={FileText} label="Documents & Policies" to="/employee/documents" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={HelpCircle} label="HR Helpdesk" to="/employee/requests" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={Users} label="Colleague Directory" to="/employee/directory" collapsed={collapsed && !isMobile} />
        </div>
      </div>

      {/* 5. ALERTS & ANNOUNCEMENTS */}
      <div>
        {(!collapsed || isMobile) && (
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Communications
          </div>
        )}
        <div className="space-y-1">
          <SidebarItem icon={Bell} label="Notifications" to="/employee/notifications" collapsed={collapsed && !isMobile} />
        </div>
      </div>

      {/* 6. TRAVEL & EXPENSE */}
      <div>
        {(!collapsed || isMobile) && (
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Travel & Expense
          </div>
        )}
        <div className="space-y-1">
          <SidebarItem icon={Plane} label="Travel Dashboard" to="/travel" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={MapPin} label="Travel Requests" to="/travel/requests" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={Briefcase} label="My Trips" to="/travel/trips" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={Receipt} label="My Expenses" to="/travel/expenses" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={FileText} label="Expense Reports" to="/travel/reports" collapsed={collapsed && !isMobile} />
          <SidebarItem icon={CreditCard} label="Advances" to="/travel/advances" collapsed={collapsed && !isMobile} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex-col z-20 ${collapsed ? 'w-20' : 'w-72'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {!collapsed && (
            <div className="flex items-center space-x-3 px-2">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                ESS
              </div>
              <div className="leading-none">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white block">Self-Service</span>
                <span className="text-[10px] text-slate-400 font-medium">Employee Portal</span>
              </div>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 mx-auto transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        {navContent(false)}

        {/* Sidebar Switch Portal Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
            title="Switch to Role Selection / Main Page"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-rose-500" />
            {!collapsed && <span>Switch Portal</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm flex">
          <div className="w-72 bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-r border-slate-200 dark:border-slate-800">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3 px-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  ESS
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-white">Self-Service</span>
              </div>
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {navContent(true)}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>Switch Portal</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 flex items-center px-4 md:px-6 justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <span 
                onClick={() => navigate('/employee')}
                className="hover:text-indigo-600 cursor-pointer font-medium transition-colors hidden sm:inline"
              >
                Employee Portal
              </span>
              <ChevronRight className="w-4 h-4 hidden sm:inline" />
              <span className="font-bold text-slate-900 dark:text-white">{getBreadcrumb()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs text-slate-700 dark:text-slate-200 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-1.5 h-9 px-3 border-slate-200 dark:border-slate-700"
              title="Return to Role Selection / Main Page"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline font-medium">Switch Portal</span>
            </Button>

            <button 
              onClick={() => navigate('/employee/notifications')}
              className="relative p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
            </button>

            <div 
              onClick={() => navigate('/employee/profile')}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm cursor-pointer border border-indigo-400/30 hover:scale-105 transition-all"
            >
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-950/50">
          {children}
        </main>
      </div>
    </div>
  );
}
