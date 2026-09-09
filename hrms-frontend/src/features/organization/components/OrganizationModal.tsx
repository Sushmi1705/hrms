import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, MapPin, Network, Users, GraduationCap, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { organizationApi } from '../api/organizationApi';
import { OrgEntityType, Company, BusinessUnit, Branch, Department } from '../types/organization';

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: OrgEntityType;
  initialData?: any;
  onSuccess: () => void;
  preselectedParentId?: string;
  companies?: Company[];
  businessUnits?: BusinessUnit[];
  branches?: Branch[];
  departments?: Department[];
}

export const OrganizationModal: React.FC<OrganizationModalProps> = ({
  isOpen,
  onClose,
  entityType,
  initialData,
  onSuccess,
  preselectedParentId,
  companies = [],
  businessUnits = [],
  branches = [],
  departments = []
}) => {
  const isEditing = !!initialData?.id;

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [level, setLevel] = useState(1);

  // Relational parent IDs
  const [companyId, setCompanyId] = useState('');
  const [businessUnitId, setBusinessUnitId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code || '');
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setAddress(initialData.address || '');
      setLevel(initialData.level || 1);
      setCompanyId(initialData.companyId || '');
      setBusinessUnitId(initialData.businessUnitId || '');
      setBranchId(initialData.branchId || '');
      setDepartmentId(initialData.departmentId || '');
    } else {
      setCode('');
      setName('');
      setDescription('');
      setAddress('');
      setLevel(1);
      setCompanyId(companies[0]?.id || '');
      setBusinessUnitId(preselectedParentId || businessUnits[0]?.id || '');
      setBranchId(preselectedParentId || branches[0]?.id || '');
      setDepartmentId(preselectedParentId || departments[0]?.id || '');
    }
  }, [initialData, isOpen, preselectedParentId, companies, businessUnits, branches, departments]);

  if (!isOpen) return null;

  const getEntityTitle = () => {
    switch (entityType) {
      case 'company': return 'Company';
      case 'businessUnit': return 'Business Unit';
      case 'branch': return 'Branch';
      case 'location': return 'Location';
      case 'department': return 'Department';
      case 'designation': return 'Designation';
      case 'jobGrade': return 'Job Grade';
      case 'costCenter': return 'Cost Center';
      default: return 'Entity';
    }
  };

  const getEntityIcon = () => {
    switch (entityType) {
      case 'company': return <Building2 className="w-5 h-5 text-indigo-500" />;
      case 'businessUnit': return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'branch':
      case 'location': return <MapPin className="w-5 h-5 text-emerald-500" />;
      case 'department': return <Network className="w-5 h-5 text-purple-500" />;
      case 'designation': return <Users className="w-5 h-5 text-amber-500" />;
      case 'jobGrade': return <GraduationCap className="w-5 h-5 text-rose-500" />;
      case 'costCenter': return <DollarSign className="w-5 h-5 text-teal-500" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      toast.error('Code and Name are required.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        switch (entityType) {
          case 'company':
            await organizationApi.updateCompany(initialData.id, { code, name, description });
            break;
          case 'businessUnit':
            await organizationApi.updateBusinessUnit(initialData.id, { code, name, companyId });
            break;
          case 'branch':
            await organizationApi.updateBranch(initialData.id, { code, name, businessUnitId });
            break;
          case 'location':
            await organizationApi.updateLocation(initialData.id, { code, name, branchId, address });
            break;
          case 'department':
            await organizationApi.updateDepartment(initialData.id, { code, name, branchId });
            break;
          case 'designation':
            await organizationApi.updateDesignation(initialData.id, { code, name, departmentId });
            break;
          case 'jobGrade':
            await organizationApi.updateJobGrade(initialData.id, { code, name, level: Number(level) });
            break;
          case 'costCenter':
            await organizationApi.updateCostCenter(initialData.id, { code, name, businessUnitId });
            break;
        }
        toast.success(`${getEntityTitle()} updated successfully!`);
      } else {
        switch (entityType) {
          case 'company':
            await organizationApi.createCompany({ code, name, description });
            break;
          case 'businessUnit':
            await organizationApi.createBusinessUnit({ code, name, companyId });
            break;
          case 'branch':
            await organizationApi.createBranch({ code, name, businessUnitId });
            break;
          case 'location':
            await organizationApi.createLocation({ code, name, branchId, address });
            break;
          case 'department':
            await organizationApi.createDepartment({ code, name, branchId });
            break;
          case 'designation':
            await organizationApi.createDesignation({ code, name, departmentId });
            break;
          case 'jobGrade':
            await organizationApi.createJobGrade({ code, name, level: Number(level) });
            break;
          case 'costCenter':
            await organizationApi.createCostCenter({ code, name, businessUnitId });
            break;
        }
        toast.success(`New ${getEntityTitle()} created successfully!`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || `Failed to save ${getEntityTitle()}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800">
              {getEntityIcon()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? `Edit ${getEntityTitle()}` : `Add New ${getEntityTitle()}`}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? 'Update existing organizational attributes' : 'Register a new unit into the organizational hierarchy'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Relational Parent Selectors */}
          {entityType === 'businessUnit' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Parent Company *
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Parent Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {(entityType === 'branch' || entityType === 'costCenter') && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Parent Business Unit *
              </label>
              <select
                value={businessUnitId}
                onChange={(e) => setBusinessUnitId(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Parent Business Unit</option>
                {businessUnits.map((bu) => (
                  <option key={bu.id} value={bu.id}>
                    {bu.name} ({bu.code}) {bu.companyName ? `• ${bu.companyName}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(entityType === 'department' || entityType === 'location') && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Parent Branch Office *
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Parent Branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code}) {b.businessUnitName ? `• ${b.businessUnitName}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {entityType === 'designation' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Parent Department *
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Parent Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code}) {d.branchName ? `• ${d.branchName}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Standard Code & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Code *
              </label>
              <Input
                placeholder="e.g. ENG-01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="rounded-xl uppercase font-mono text-sm"
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Name / Title *
              </label>
              <Input
                placeholder={`e.g. ${entityType === 'department' ? 'Engineering & Product' : entityType === 'designation' ? 'Lead Fullstack Architect' : 'North America Division'}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Optional entity-specific fields */}
          {entityType === 'company' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Company Description / Legal Entity Scope
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the legal corporate entity..."
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              />
            </div>
          )}

          {entityType === 'location' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Physical Street Address / Building Suite
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 500 Silicon Way, Suite 400, Austin, TX 78701"
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              />
            </div>
          )}

          {entityType === 'jobGrade' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Seniority Level (1 = Entry, 5 = Executive) *
              </label>
              <Input
                type="number"
                min={1}
                max={20}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                required
                className="rounded-xl text-sm"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                `Create ${getEntityTitle()}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
