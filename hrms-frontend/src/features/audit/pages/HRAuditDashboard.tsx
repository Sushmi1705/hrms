import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Shield, Activity, List, Users, ShieldAlert, GitCompare, Settings } from 'lucide-react';
import { AuditOverview } from '../components/AuditOverview';
import { SystemAuditLogs } from '../components/SystemAuditLogs';
import { LoginHistory } from '../components/LoginHistory';
import { SecurityEvents } from '../components/SecurityEvents';
import { DataComparison } from '../components/DataComparison';
import { AuditSettings } from '../components/AuditSettings';

export function HRAuditDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'logs', label: 'Audit Logs', icon: List },
    { id: 'logins', label: 'Login History', icon: Users },
    { id: 'security', label: 'Security Events', icon: ShieldAlert },
    { id: 'comparison', label: 'Data Comparison', icon: GitCompare },
    { id: 'settings', label: 'Audit Settings', icon: Settings }
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            Enterprise Audit Logs & Activity
          </h1>
          <p className="text-slate-500 mt-1">Immutable tracking of all system activities and data changes</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-max overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && <AuditOverview />}
        {activeTab === 'logs' && <SystemAuditLogs />}
        {activeTab === 'logins' && <LoginHistory />}
        {activeTab === 'security' && <SecurityEvents />}
        {activeTab === 'comparison' && <DataComparison />}
        {activeTab === 'settings' && <AuditSettings />}
      </div>
    </div>
  );
}

