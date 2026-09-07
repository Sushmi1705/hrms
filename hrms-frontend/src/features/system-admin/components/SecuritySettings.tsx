import React, { useState, useEffect } from 'react';
import { Shield, Lock, Clock, KeyRound, CheckCircle2, AlertTriangle, Save } from 'lucide-react';
import { SecurityPolicyData } from '../types/systemAdmin';
import { systemAdminApi } from '../api/systemAdminApi';

export const SecuritySettings: React.FC = () => {
  const [policy, setPolicy] = useState<SecurityPolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchPolicy = async () => {
    setLoading(true);
    try {
      const data = await systemAdminApi.getSecurityPolicy();
      setPolicy(data);
    } catch (err) {
      console.error('Failed to fetch security policy', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policy) return;

    setSaving(true);
    setSuccessMessage(null);
    try {
      const updated = await systemAdminApi.updateSecurityPolicy(policy);
      setPolicy(updated);
      setSuccessMessage('Enterprise Security Policy updated and enforced!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update security policy');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !policy) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading security policies...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Enterprise IAM & Security Baseline</h3>
            <p className="text-xs text-slate-500">Configure password complexity, MFA enforcement, and account lockout thresholds</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
        >
          {saving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Enforce Policies
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* Grid of Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Password Complexity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-primary" /> Password Complexity Requirements
          </h4>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-300">Minimum Password Length</span>
              <span className="font-bold text-primary">{policy.passwordMinLength} characters</span>
            </div>
            <input
              type="range"
              min="8"
              max="24"
              value={policy.passwordMinLength}
              onChange={e => setPolicy({ ...policy, passwordMinLength: parseInt(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center space-x-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={policy.requireUppercase}
                onChange={e => setPolicy({ ...policy, requireUppercase: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Require at least one uppercase letter (A-Z)</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={policy.requireLowercase}
                onChange={e => setPolicy({ ...policy, requireLowercase: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Require at least one lowercase letter (a-z)</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={policy.requireNumbers}
                onChange={e => setPolicy({ ...policy, requireNumbers: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Require at least one numeric digit (0-9)</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={policy.requireSpecialChars}
                onChange={e => setPolicy({ ...policy, requireSpecialChars: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Require at least one special symbol (!@#$%^&*)</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Expiration (Days)</label>
              <input
                type="number"
                value={policy.passwordExpirationDays}
                onChange={e => setPolicy({ ...policy, passwordExpirationDays: parseInt(e.target.value) || 90 })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Remember History Count</label>
              <input
                type="number"
                value={policy.passwordHistoryCount}
                onChange={e => setPolicy({ ...policy, passwordHistoryCount: parseInt(e.target.value) || 5 })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Account Lockout & MFA */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-500" /> Account Lockout & MFA Policies
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Max Failed Attempts</label>
              <input
                type="number"
                value={policy.maxFailedLoginAttempts}
                onChange={e => setPolicy({ ...policy, maxFailedLoginAttempts: parseInt(e.target.value) || 5 })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Lock Duration (Minutes)</label>
              <input
                type="number"
                value={policy.accountLockDurationMinutes}
                onChange={e => setPolicy({ ...policy, accountLockDurationMinutes: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">MFA Enforcement Scope</label>
            <select
              value={policy.mfaRequirement}
              onChange={e => setPolicy({ ...policy, mfaRequirement: e.target.value as any })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium"
            >
              <option value="None">None (Optional for all)</option>
              <option value="Optional">Optional (User opt-in)</option>
              <option value="AdminsOnly">Enforced for Admin & HR Roles Only</option>
              <option value="AllUsers">Mandatory for All Enterprise Accounts</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Session Expiry (Minutes)</label>
              <input
                type="number"
                value={policy.sessionTimeoutMinutes}
                onChange={e => setPolicy({ ...policy, sessionTimeoutMinutes: parseInt(e.target.value) || 60 })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Idle Lock (Minutes)</label>
              <input
                type="number"
                value={policy.idleTimeoutMinutes}
                onChange={e => setPolicy({ ...policy, idleTimeoutMinutes: parseInt(e.target.value) || 15 })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">IP Whitelist (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 192.168.1.0/24, 10.0.0.1"
              value={policy.ipWhitelist}
              onChange={e => setPolicy({ ...policy, ipWhitelist: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
            />
          </div>
        </div>

      </div>
    </form>
  );
};
