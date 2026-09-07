import React from 'react';
import { X, Server, Network, User, Shield, Info, Activity, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export function AuditDetailsDrawer({ log, onClose }: { log: any; onClose: () => void }) {
  if (!log) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 border-l border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Audit Log Details</h2>
          <p className="text-sm text-slate-500 font-mono mt-1">ID: {log.id}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5 text-slate-500" /></Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Core Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Timestamp</span>
            </div>
            <div className="font-medium text-slate-800">{new Date(log.createdAt).toLocaleString()}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Action & Module</span>
            </div>
            <div className="font-medium text-slate-800">{log.action} / {log.module}</div>
          </div>
        </div>

        {/* User Context */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b pb-2">
            <User className="w-4 h-4 text-indigo-500" />
            User Context
          </h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div><span className="text-slate-500 block text-xs">Name</span><span className="font-medium">{log.userName}</span></div>
            <div><span className="text-slate-500 block text-xs">Employee ID</span><span className="font-medium">{log.employeeId || 'System'}</span></div>
            <div><span className="text-slate-500 block text-xs">Role</span><span>{log.role}</span></div>
            <div><span className="text-slate-500 block text-xs">Organization</span><span>{log.company} / {log.department}</span></div>
          </div>
        </div>

        {/* Network Context */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b pb-2">
            <Network className="w-4 h-4 text-emerald-500" />
            Network & Device
          </h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div><span className="text-slate-500 block text-xs">IP Address</span><span className="font-mono">{log.ipAddress}</span></div>
            <div><span className="text-slate-500 block text-xs">Environment</span><span>{log.environment}</span></div>
            <div><span className="text-slate-500 block text-xs">Browser</span><span>{log.browser}</span></div>
            <div><span className="text-slate-500 block text-xs">OS / Device</span><span>{log.operatingSystem} ({log.device})</span></div>
          </div>
        </div>

        {/* API Trace */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b pb-2">
            <Server className="w-4 h-4 text-blue-500" />
            API Request Trace
          </h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
            <div><span className="text-slate-500 block text-xs">Endpoint</span><span className="font-mono text-xs bg-slate-100 p-1 rounded">{log.httpMethod} {log.endpoint}</span></div>
            <div><span className="text-slate-500 block text-xs">Status</span><span className="font-medium">{log.statusCode} ({log.status})</span></div>
            <div><span className="text-slate-500 block text-xs">Correlation ID</span><span className="font-mono text-xs">{log.correlationId}</span></div>
            <div><span className="text-slate-500 block text-xs">Execution Time</span><span className="font-mono text-xs">{log.executionTimeMs}ms</span></div>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="text-slate-500 block text-xs mb-1">Request Payload</span>
              <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                {log.requestPayload ? JSON.stringify(JSON.parse(log.requestPayload), null, 2) : 'No payload'}
              </pre>
            </div>
            <div>
              <span className="text-slate-500 block text-xs mb-1">Response Payload</span>
              <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                {log.responsePayload ? JSON.stringify(JSON.parse(log.responsePayload), null, 2) : 'No response'}
              </pre>
            </div>
          </div>
        </div>

      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
        <Button variant="outline">Download JSON</Button>
        <Button variant="outline">Download PDF</Button>
      </div>
    </div>
  );
}
