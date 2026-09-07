import React, { useState } from 'react';
import { Building2, X, Check, Shield, User, Globe, CreditCard, Sparkles } from 'lucide-react';
import { CreateTenantPayload, SubscriptionPlanItem } from '../types/tenant';
import { tenantApi } from '../api/tenantApi';

interface Props {
  plans: SubscriptionPlanItem[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTenantModal: React.FC<Props> = ({ plans, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTenantPayload>({
    organizationName: '',
    tenantCode: '',
    legalName: '',
    industry: 'Technology',
    country: 'United States',
    currency: 'USD',
    timeZone: 'America/New_York',
    language: 'en',
    contactName: '',
    contactEmail: '',
    contactPhone: '+1 (555) 019-2834',
    subscriptionPlanCode: 'Professional',
    billingCycle: 'Monthly',
    trialDays: 14,
    adminFullName: '',
    adminUsername: '',
    adminEmail: '',
    adminPassword: 'Admin@Password123!'
  });

  if (!isOpen) return null;

  const handleNameChange = (name: string) => {
    const code = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
    setFormData(prev => ({
      ...prev,
      organizationName: name,
      legalName: prev.legalName || `${name} Inc.`,
      tenantCode: prev.tenantCode || code
    }));
  };

  const handleAdminEmailChange = (email: string) => {
    const uname = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_.]/g, '');
    setFormData(prev => ({
      ...prev,
      adminEmail: email,
      adminUsername: prev.adminUsername || uname,
      contactEmail: prev.contactEmail || email
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await tenantApi.createTenant(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create tenant organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200 my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Provision New SaaS Tenant Account</h3>
              <p className="text-xs text-slate-500">Create dedicated enterprise workspace, subscription, and initial administrator</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Organization Profile */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary" /> 1. Organization Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lumina Health Systems"
                  value={formData.organizationName}
                  onChange={e => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tenant Code (Slug) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUMINA"
                  value={formData.tenantCode}
                  onChange={e => setFormData({ ...formData, tenantCode: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Legal Registered Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lumina Health Systems Inc."
                  value={formData.legalName}
                  onChange={e => setFormData({ ...formData, legalName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Industry Sector</label>
                <select
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                >
                  <option value="Technology">Technology & Software</option>
                  <option value="Healthcare">Healthcare & Life Sciences</option>
                  <option value="Finance">Finance & Banking</option>
                  <option value="Manufacturing">Manufacturing & Engineering</option>
                  <option value="Retail">Retail & E-Commerce</option>
                  <option value="Construction">Construction & Real Estate</option>
                  <option value="Logistics">Logistics & Supply Chain</option>
                  <option value="Consulting">Professional Consulting</option>
                  <option value="Education">Education & Academia</option>
                  <option value="Hospitality">Hospitality & Travel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
                <select
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="India">India</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Timezone</label>
                <select
                  value={formData.timeZone}
                  onChange={e => setFormData({ ...formData, timeZone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                >
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="America/Chicago">America/Chicago (CST)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Subscription Plan */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-primary" /> 2. Subscription Tier & Billing
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {plans.map(p => {
                const isSelected = formData.subscriptionPlanCode === p.code;
                return (
                  <div
                    key={p.code}
                    onClick={() => setFormData({ ...formData, subscriptionPlanCode: p.code })}
                    className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</span>
                        {p.isPopular && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-primary text-white">POPULAR</span>}
                      </div>
                      <div className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                        ${formData.billingCycle === 'Annual' ? p.annualPrice : p.monthlyPrice}
                        <span className="text-[10px] font-normal text-slate-400">/{formData.billingCycle === 'Annual' ? 'yr' : 'mo'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 space-y-0.5 font-mono">
                      <div>Up to {p.maxEmployees} Employees</div>
                      <div>{p.storageGb} GB Storage</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Billing Frequency</label>
                <select
                  value={formData.billingCycle}
                  onChange={e => setFormData({ ...formData, billingCycle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                >
                  <option value="Monthly">Monthly Billing</option>
                  <option value="Annual">Annual Billing (Save 20%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Complimentary Trial</label>
                <select
                  value={formData.trialDays}
                  onChange={e => setFormData({ ...formData, trialDays: parseInt(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                >
                  <option value={14}>14 Days Free Trial</option>
                  <option value={30}>30 Days Enterprise POC</option>
                  <option value={0}>Immediate Direct Activation</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Initial Tenant Admin Account */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" /> 3. Primary Administrator Account
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Williams"
                  value={formData.adminFullName}
                  onChange={e => setFormData(prev => ({ ...prev, adminFullName: e.target.value, contactName: prev.contactName || e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jessica.williams@luminahealth.com"
                  value={formData.adminEmail}
                  onChange={e => handleAdminEmailChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. jwilliams"
                  value={formData.adminUsername}
                  onChange={e => setFormData({ ...formData, adminUsername: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Temporary Password</label>
                <input
                  type="text"
                  value={formData.adminPassword}
                  onChange={e => setFormData({ ...formData, adminPassword: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-xl shadow-sm flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Provision Workspace
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
