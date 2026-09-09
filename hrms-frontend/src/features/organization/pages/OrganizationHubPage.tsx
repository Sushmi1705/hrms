import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building2, Briefcase, MapPin, Network, Users, GraduationCap, 
  DollarSign, Plus, Search, Filter, Download, FileEdit, Trash2, 
  RefreshCw, Layers, CheckCircle2, ChevronRight, Eye, ShieldCheck,
  Building, Globe, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { organizationApi } from '../api/organizationApi';
import { 
  Company, BusinessUnit, Branch, Location, Department, 
  Designation, JobGrade, CostCenter, OrgEntityType 
} from '../types/organization';
import { OrganizationModal } from '../components/OrganizationModal';
import { OrgHierarchyTree } from '../components/OrgHierarchyTree';

interface OrganizationHubPageProps {
  initialTab?: 'hierarchy' | 'companies' | 'businessUnits' | 'branches' | 'departments' | 'designations' | 'costCenters';
}

export const OrganizationHubPage: React.FC<OrganizationHubPageProps> = ({ 
  initialTab = 'hierarchy' 
}) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Search and Cascading Filter States
  const [search, setSearch] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('');
  const [selectedBuFilter, setSelectedBuFilter] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<OrgEntityType>('company');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [preselectedParentId, setPreselectedParentId] = useState<string | undefined>(undefined);

  // Data Queries
  const { data: hierarchy, isLoading: loadingHierarchy, refetch: refetchHierarchy } = useQuery({
    queryKey: ['org-hierarchy'],
    queryFn: organizationApi.getHierarchy
  });

  const { data: companies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ['org-companies'],
    queryFn: organizationApi.getCompanies
  });

  const { data: businessUnits = [], isLoading: loadingBUs } = useQuery({
    queryKey: ['org-businessUnits'],
    queryFn: organizationApi.getBusinessUnits
  });

  const { data: branches = [], isLoading: loadingBranches } = useQuery({
    queryKey: ['org-branches'],
    queryFn: organizationApi.getBranches
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['org-locations'],
    queryFn: organizationApi.getLocations
  });

  const { data: departments = [], isLoading: loadingDepts } = useQuery({
    queryKey: ['org-departments'],
    queryFn: organizationApi.getDepartments
  });

  const { data: designations = [], isLoading: loadingDesignations } = useQuery({
    queryKey: ['org-designations'],
    queryFn: organizationApi.getDesignations
  });

  const { data: jobGrades = [] } = useQuery({
    queryKey: ['org-jobGrades'],
    queryFn: organizationApi.getJobGrades
  });

  const { data: costCenters = [] } = useQuery({
    queryKey: ['org-costCenters'],
    queryFn: organizationApi.getCostCenters
  });

  const handleRefreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['org-hierarchy'] });
    queryClient.invalidateQueries({ queryKey: ['org-companies'] });
    queryClient.invalidateQueries({ queryKey: ['org-businessUnits'] });
    queryClient.invalidateQueries({ queryKey: ['org-branches'] });
    queryClient.invalidateQueries({ queryKey: ['org-locations'] });
    queryClient.invalidateQueries({ queryKey: ['org-departments'] });
    queryClient.invalidateQueries({ queryKey: ['org-designations'] });
    queryClient.invalidateQueries({ queryKey: ['org-jobGrades'] });
    queryClient.invalidateQueries({ queryKey: ['org-costCenters'] });
    toast.success('Organization data refreshed');
  };

  const handleOpenAdd = (type: OrgEntityType, parentId?: string) => {
    setEditingItem(null);
    setModalType(type);
    setPreselectedParentId(parentId);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (type: OrgEntityType, item: any) => {
    setEditingItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleDelete = async (type: OrgEntityType, id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

    try {
      switch (type) {
        case 'company': await organizationApi.deleteCompany(id); break;
        case 'businessUnit': await organizationApi.deleteBusinessUnit(id); break;
        case 'branch': await organizationApi.deleteBranch(id); break;
        case 'location': await organizationApi.deleteLocation(id); break;
        case 'department': await organizationApi.deleteDepartment(id); break;
        case 'designation': await organizationApi.deleteDesignation(id); break;
        case 'jobGrade': await organizationApi.deleteJobGrade(id); break;
        case 'costCenter': await organizationApi.deleteCostCenter(id); break;
      }
      toast.success(`${name} deleted successfully.`);
      handleRefreshAll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete entity');
    }
  };

  // Export CSV
  const handleExport = (filename: string, rows: any[]) => {
    if (!rows || rows.length === 0) {
      toast.error('No records to export');
      return;
    }
    const headers = Object.keys(rows[0]).join(',');
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows.map(r => Object.values(r).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${filename}.csv exported successfully`);
  };

  // Filtered lists
  const filteredCompanies = useMemo(() => {
    const s = search.toLowerCase();
    return companies.filter(c => c.name.toLowerCase().includes(s) || c.code.toLowerCase().includes(s));
  }, [companies, search]);

  const filteredBUs = useMemo(() => {
    const s = search.toLowerCase();
    return businessUnits.filter(bu => {
      const matchSearch = bu.name.toLowerCase().includes(s) || bu.code.toLowerCase().includes(s);
      const matchComp = !selectedCompanyFilter || bu.companyId === selectedCompanyFilter;
      return matchSearch && matchComp;
    });
  }, [businessUnits, search, selectedCompanyFilter]);

  const filteredBranches = useMemo(() => {
    const s = search.toLowerCase();
    return branches.filter(b => {
      const matchSearch = b.name.toLowerCase().includes(s) || b.code.toLowerCase().includes(s);
      const matchBu = !selectedBuFilter || b.businessUnitId === selectedBuFilter;
      return matchSearch && matchBu;
    });
  }, [branches, search, selectedBuFilter]);

  const filteredDepartments = useMemo(() => {
    const s = search.toLowerCase();
    return departments.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(s) || d.code.toLowerCase().includes(s);
      const matchBranch = !selectedBranchFilter || d.branchId === selectedBranchFilter;
      return matchSearch && matchBranch;
    });
  }, [departments, search, selectedBranchFilter]);

  const filteredDesignations = useMemo(() => {
    const s = search.toLowerCase();
    return designations.filter(des => des.name.toLowerCase().includes(s) || des.code.toLowerCase().includes(s));
  }, [designations, search]);

  const filteredCostCenters = useMemo(() => {
    const s = search.toLowerCase();
    return costCenters.filter(cc => cc.name.toLowerCase().includes(s) || cc.code.toLowerCase().includes(s));
  }, [costCenters, search]);

  const summary = hierarchy?.summary || {
    totalCompanies: companies.length,
    totalBusinessUnits: businessUnits.length,
    totalBranches: branches.length,
    totalDepartments: departments.length,
    totalDesignations: designations.length,
    totalJobGrades: jobGrades.length,
    totalEmployees: 0
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* 1. TOP HERO HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">
              Organization Core
            </Badge>
            <span className="text-xs text-slate-400">• Interconnected Corporate Hierarchy</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Organization Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage legal companies, business divisions, branch locations, departments, and job titles
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleRefreshAll} className="rounded-xl text-xs h-9">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => handleOpenAdd('company')}
            className="rounded-xl text-xs font-semibold shadow-md h-9 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Entity
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY KPI STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div 
          onClick={() => setActiveTab('companies')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-indigo-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Companies</span>
            <Building2 className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.totalCompanies}</p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400">Legal Entities</p>
        </div>

        <div 
          onClick={() => setActiveTab('businessUnits')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-blue-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Business Units</span>
            <Briefcase className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.totalBusinessUnits}</p>
          <p className="text-[11px] text-blue-600 dark:text-blue-400">Operating Divisions</p>
        </div>

        <div 
          onClick={() => setActiveTab('branches')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Branches</span>
            <MapPin className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.totalBranches}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Regional Offices</p>
        </div>

        <div 
          onClick={() => setActiveTab('departments')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-purple-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Departments</span>
            <Network className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.totalDepartments}</p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400">Functional Teams</p>
        </div>

        <div 
          onClick={() => setActiveTab('designations')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-amber-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Designations</span>
            <Users className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.totalDesignations}</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400">Active Job Roles</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Employees</span>
            <GraduationCap className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.totalEmployees}</p>
          <p className="text-[11px] text-rose-600 dark:text-rose-400">Assigned Headcount</p>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'hierarchy'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          Org Structure Explorer
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'companies'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Companies ({companies.length})
        </button>

        <button
          onClick={() => setActiveTab('businessUnits')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'businessUnits'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Business Units ({businessUnits.length})
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'branches'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Branches & Locations ({branches.length})
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'departments'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Network className="w-4 h-4" />
          Departments ({departments.length})
        </button>

        <button
          onClick={() => setActiveTab('designations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'designations'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Designations & Grades ({designations.length})
        </button>

        <button
          onClick={() => setActiveTab('costCenters')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'costCenters'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Cost Centers ({costCenters.length})
        </button>
      </div>

      {/* 4. TAB CONTENTS */}
      {activeTab === 'hierarchy' && (
        <OrgHierarchyTree
          hierarchy={hierarchy || null}
          onAddEntity={(type, parentId) => handleOpenAdd(type, parentId)}
          onEditEntity={(type, item) => handleOpenEdit(type, item)}
        />
      )}

      {/* COMPANIES TAB */}
      {activeTab === 'companies' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('Companies', filteredCompanies)}
                className="rounded-xl text-xs h-9"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export
              </Button>
              <Button
                size="sm"
                onClick={() => handleOpenAdd('company')}
                className="rounded-xl text-xs font-semibold h-9 shadow-md"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Company
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Code</th>
                  <th className="px-6 py-3.5">Company Legal Name</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5">Business Units</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{c.code}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-500" />
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{c.description || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[10px] font-medium border-indigo-200 text-indigo-700 dark:text-indigo-400">
                        {c.businessUnitsCount || 0} Units
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit('company', c)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('company', c.id, c.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BUSINESS UNITS TAB */}
      {activeTab === 'businessUnits' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search business units..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl"
                />
              </div>
              <select
                value={selectedCompanyFilter}
                onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                className="h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="">All Companies</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('BusinessUnits', filteredBUs)}
                className="rounded-xl text-xs h-9"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export
              </Button>
              <Button
                size="sm"
                onClick={() => handleOpenAdd('businessUnit')}
                className="rounded-xl text-xs font-semibold h-9 shadow-md"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Business Unit
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Code</th>
                  <th className="px-6 py-3.5">Business Unit Name</th>
                  <th className="px-6 py-3.5">Parent Company</th>
                  <th className="px-6 py-3.5">Branches</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBUs.map((bu) => (
                  <tr key={bu.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{bu.code}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      {bu.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {bu.companyName || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[10px] font-medium border-blue-200 text-blue-700 dark:text-blue-400">
                        {bu.branchesCount || 0} Branches
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit('businessUnit', bu)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('businessUnit', bu.id, bu.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BRANCHES TAB */}
      {activeTab === 'branches' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search branch offices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl"
                />
              </div>
              <select
                value={selectedBuFilter}
                onChange={(e) => setSelectedBuFilter(e.target.value)}
                className="h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="">All Business Units</option>
                {businessUnits.map(bu => (
                  <option key={bu.id} value={bu.id}>{bu.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('Branches', filteredBranches)}
                className="rounded-xl text-xs h-9"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export
              </Button>
              <Button
                size="sm"
                onClick={() => handleOpenAdd('branch')}
                className="rounded-xl text-xs font-semibold h-9 shadow-md"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Branch Office
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Code</th>
                  <th className="px-6 py-3.5">Branch Name</th>
                  <th className="px-6 py-3.5">Parent Business Unit</th>
                  <th className="px-6 py-3.5">Parent Company</th>
                  <th className="px-6 py-3.5">Departments</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBranches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{b.code}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      {b.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{b.businessUnitName || '—'}</td>
                    <td className="px-6 py-4 text-slate-500">{b.companyName || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[10px] font-medium border-emerald-200 text-emerald-700 dark:text-emerald-400">
                        {b.departmentsCount || 0} Depts
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit('branch', b)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('branch', b.id, b.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DEPARTMENTS TAB */}
      {activeTab === 'departments' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search departments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl"
                />
              </div>
              <select
                value={selectedBranchFilter}
                onChange={(e) => setSelectedBranchFilter(e.target.value)}
                className="h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="">All Branch Offices</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('Departments', filteredDepartments)}
                className="rounded-xl text-xs h-9"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export
              </Button>
              <Button
                size="sm"
                onClick={() => handleOpenAdd('department')}
                className="rounded-xl text-xs font-semibold h-9 shadow-md"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Department
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Code</th>
                  <th className="px-6 py-3.5">Department Name</th>
                  <th className="px-6 py-3.5">Branch Office</th>
                  <th className="px-6 py-3.5">Business Unit / Company</th>
                  <th className="px-6 py-3.5">Designations</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDepartments.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{d.code}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Network className="w-4 h-4 text-purple-500" />
                      {d.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{d.branchName || '—'}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {d.businessUnitName ? `${d.businessUnitName} • ${d.companyName}` : d.companyName || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[10px] font-medium border-purple-200 text-purple-700 dark:text-purple-400">
                        {d.designationsCount || 0} Roles
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit('department', d)}
                          className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('department', d.id, d.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DESIGNATIONS & JOB GRADES TAB */}
      {activeTab === 'designations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Designations list (2 Cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden space-y-4">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search designations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl"
                />
              </div>
              <Button
                size="sm"
                onClick={() => handleOpenAdd('designation')}
                className="rounded-xl text-xs font-semibold h-9 shadow-md"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Designation
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Code</th>
                    <th className="px-6 py-3.5">Title / Role</th>
                    <th className="px-6 py-3.5">Department</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDesignations.map((des) => (
                    <tr key={des.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{des.code}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-500" />
                        {des.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                        {des.departmentName || '—'} {des.branchName ? `(${des.branchName})` : ''}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit('designation', des)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <FileEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('designation', des.id, des.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Job Grades Panel (1 Col) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-rose-500" />
                  Job Grades & Bands
                </h3>
                <p className="text-[11px] text-slate-400">Seniority ranking</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenAdd('jobGrade')}
                className="text-xs rounded-xl h-8"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Grade
              </Button>
            </div>

            <div className="space-y-2">
              {jobGrades.map((jg) => (
                <div
                  key={jg.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-mono text-[10px]">
                      L{jg.level}
                    </Badge>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{jg.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{jg.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit('jobGrade', jg)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete('jobGrade', jg.id, jg.name)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COST CENTERS TAB */}
      {activeTab === 'costCenters' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search cost centers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>
            <Button
              size="sm"
              onClick={() => handleOpenAdd('costCenter')}
              className="rounded-xl text-xs font-semibold h-9 shadow-md"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Cost Center
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">GL Code</th>
                  <th className="px-6 py-3.5">Cost Center Title</th>
                  <th className="px-6 py-3.5">Allocated Business Unit</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCostCenters.map((cc) => (
                  <tr key={cc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{cc.code}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-teal-500" />
                      {cc.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{cc.businessUnitName || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit('costCenter', cc)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('costCenter', cc.id, cc.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REUSABLE ADD / EDIT MODAL */}
      <OrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        entityType={modalType}
        initialData={editingItem}
        preselectedParentId={preselectedParentId}
        companies={companies}
        businessUnits={businessUnits}
        branches={branches}
        departments={departments}
        onSuccess={handleRefreshAll}
      />
    </div>
  );
};
