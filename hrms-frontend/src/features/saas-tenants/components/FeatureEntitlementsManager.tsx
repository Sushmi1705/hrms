import React, { useState } from 'react';
import { Sliders, Shield, Sparkles, CheckCircle2, Lock, Unlock } from 'lucide-react';
import { SubscriptionPlanItem } from '../types/tenant';

interface Props {
  plans: SubscriptionPlanItem[];
}

export const FeatureEntitlementsManager: React.FC<Props> = ({ plans }) => {
  const modules = [
    { key: 'Employees', name: 'Core Employee Directory & Profiles' },
    { key: 'Attendance', name: 'Time & Attendance Tracking & Geo-Fencing' },
    { key: 'Leave', name: 'Leave & Absence Management Engine' },
    { key: 'Shift', name: 'Shift Roster & Schedule Optimization' },
    { key: 'Payroll', name: 'Automated Payroll, Tax & Salary Slips' },
    { key: 'Performance', name: 'Appraisals, OKRs & 360 Feedback' },
    { key: 'Recruitment', name: 'Applicant Tracking System (ATS)' },
    { key: 'Onboarding', name: 'New Hire Onboarding & Document Verification' },
    { key: 'Offboarding', name: 'Exit Clearance & Asset Handover' },
    { key: 'Learning', name: 'LMS Course Catalog & Certifications' },
    { key: 'Workflow', name: 'Multi-Level Workflow & Approval Engine' },
    { key: 'Notifications', name: 'Multi-Channel Alert Center (Email/SMS/Push)' },
    { key: 'Audit', name: 'Compliance & Forensic Audit Logging' },
    { key: 'AIAssistant', name: 'Generative AI HR Co-Pilot & Insights' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Module Feature Entitlements Matrix</h3>
            <p className="text-xs text-slate-500">Plan-level packaging matrix controlling functional module availability</p>
          </div>
        </div>
      </div>

      {/* Entitlement Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-4 min-w-[240px]">Functional Module</th>
              {plans.map(p => (
                <th key={p.code} className="px-4 py-4 text-center min-w-[120px]">
                  <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">${p.monthlyPrice}/mo</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {modules.map(m => (
              <tr key={m.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Key: {m.key}</div>
                </td>

                {plans.map(p => {
                  const hasFeature = p.features.includes(m.key);
                  return (
                    <td key={p.code} className="px-4 py-3.5 text-center">
                      {hasFeature ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Included
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-400 dark:bg-slate-800">
                          <Lock className="w-3 h-3 mr-1" /> Locked
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
