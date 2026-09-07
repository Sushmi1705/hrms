import React, { useState, useEffect } from 'react';
import { Mail, Server, Shield, Send, CheckCircle2, AlertCircle, Save, KeyRound } from 'lucide-react';
import { EmailConfigurationData } from '../types/systemAdmin';
import { systemAdminApi } from '../api/systemAdminApi';

export const EmailSettings: React.FC = () => {
  const [config, setConfig] = useState<EmailConfigurationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmailModal, setTestEmailModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const data = await systemAdminApi.getEmailConfiguration();
      setConfig(data);
    } catch (err) {
      console.error('Failed to fetch email config', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setSaving(true);
    setStatusMessage(null);
    try {
      const updated = await systemAdminApi.updateEmailConfiguration(config);
      setConfig(updated);
      setStatusMessage({ text: 'SMTP server configuration saved.', type: 'success' });
    } catch (err: any) {
      setStatusMessage({ text: err.response?.data?.message || 'Failed to update config', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setStatusMessage(null);
    try {
      const res = await systemAdminApi.testEmailConnection();
      setStatusMessage({ text: res.message || 'SMTP Connection Verified Successfully!', type: 'success' });
      fetchConfig();
    } catch (err: any) {
      setStatusMessage({ text: 'SMTP Connection Failed. Check server credentials.', type: 'error' });
    } finally {
      setTesting(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;

    setSendingTest(true);
    try {
      const res = await systemAdminApi.sendTestEmail(recipientEmail);
      alert(res.message);
      setTestEmailModal(false);
      setRecipientEmail('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to dispatch test email');
    } finally {
      setSendingTest(false);
    }
  };

  if (loading || !config) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading email configuration...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Email Server (SMTP) Dispatcher</h3>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                config.status === 'Verified'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
              }`}>
                {config.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">Configure corporate email gateways for notifications and password recovery</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>

          <button
            type="button"
            onClick={() => setTestEmailModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Send Test Email
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
          statusMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {statusMessage.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SMTP Server Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-primary" /> Server Credentials
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">SMTP Host Server *</label>
              <input
                type="text"
                required
                value={config.smtpHost}
                onChange={e => setConfig({ ...config, smtpHost: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Port Number</label>
                <input
                  type="number"
                  value={config.smtpPort}
                  onChange={e => setConfig({ ...config, smtpPort: parseInt(e.target.value) || 587 })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Security Mode</label>
                <select
                  value={config.securityMode}
                  onChange={e => setConfig({ ...config, securityMode: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="TLS">TLS (Recommended)</option>
                  <option value="SSL">SSL</option>
                  <option value="None">None (Unsecured)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">SMTP Username *</label>
              <input
                type="text"
                value={config.username}
                onChange={e => setConfig({ ...config, username: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">SMTP Password</label>
              <input
                type="password"
                value={config.passwordEncrypted || '************'}
                onChange={e => setConfig({ ...config, passwordEncrypted: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* Sender Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-primary" /> Sender Identity & Header Info
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">From Sender Name</label>
              <input
                type="text"
                value={config.fromName}
                onChange={e => setConfig({ ...config, fromName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">From Email Address *</label>
              <input
                type="email"
                required
                value={config.fromEmail}
                onChange={e => setConfig({ ...config, fromEmail: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Reply-To Email Address</label>
              <input
                type="email"
                value={config.replyToEmail}
                onChange={e => setConfig({ ...config, replyToEmail: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Last Successful Ping</div>
              <div>{config.lastTestedAt ? new Date(config.lastTestedAt).toLocaleString() : 'Never verified'}</div>
            </div>
          </div>

        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-xl shadow-sm flex items-center gap-2 transition-colors"
          >
            {saving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save Configuration
          </button>
        </div>
      </form>

      {/* Test Email Modal */}
      {testEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-200">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-primary" /> Send Diagnostic SMTP Test
            </h3>
            <p className="text-xs text-slate-500">
              Enter an email address to dispatch an end-to-end SMTP deliverability test.
            </p>

            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Recipient Email *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@anraone.com"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTestEmailModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingTest}
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  {sendingTest ? 'Sending...' : 'Send Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
