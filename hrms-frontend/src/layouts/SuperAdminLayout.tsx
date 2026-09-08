import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bell, Search, Menu, User, ChevronRight, Settings, Server, CreditCard, Shield, LogOut } from 'lucide-react';
import { SidebarItem } from './AdminLayout';
import { Button } from '../components/ui/button';

export function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const getBreadcrumb = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'super-admin') return 'Dashboard';
    return path.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <aside className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-20 ${collapsed ? 'w-20' : 'w-72'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {!collapsed && (
            <div className="flex items-center space-x-2 px-2">
              <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center text-white dark:text-slate-900 font-bold text-xl">S</div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Super Admin</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 mx-auto">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
          <div>
            {!collapsed && <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">SaaS Platform</div>}
            <div className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label="SaaS Overview" to="/super-admin" collapsed={collapsed} />
              <SidebarItem icon={Server} label="Tenant Directory" to="/super-admin/tenants" collapsed={collapsed} />
            </div>
          </div>
          <div>
            {!collapsed && <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Enterprise Administration</div>}
            <div className="space-y-1">
              <SidebarItem icon={Settings} label="System Admin" to="/admin/system" collapsed={collapsed} />
              <SidebarItem icon={Shield} label="Forensic Audit" to="/admin/audit" collapsed={collapsed} />
              <SidebarItem icon={CreditCard} label="Workflow Engine" to="/admin/workflow" collapsed={collapsed} />
            </div>
          </div>
        </div>

        {/* Sidebar Switch Portal Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
            title="Switch to Role Selection / Main Page"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
            {!collapsed && <span>Switch Portal</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 glass border-b sticky top-0 z-10 flex items-center px-6 justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Super Admin Portal</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-foreground">{getBreadcrumb()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs h-9 px-3 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              title="Switch to Role Selection / Main Page"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline font-medium">Switch Portal</span>
            </Button>
            <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-md cursor-pointer border-2 border-white dark:border-slate-800 transition-all">
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
