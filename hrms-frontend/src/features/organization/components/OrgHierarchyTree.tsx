import React, { useState } from 'react';
import { 
  Building2, Briefcase, MapPin, Network, Users, Plus, 
  ChevronRight, ChevronDown, Search, Maximize2, Minimize2,
  DollarSign, Map
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrganizationHierarchyData, OrgEntityType } from '../types/organization';

interface OrgHierarchyTreeProps {
  hierarchy: OrganizationHierarchyData | null;
  onAddEntity: (type: OrgEntityType, parentId?: string) => void;
  onEditEntity: (type: OrgEntityType, item: any) => void;
}

export const OrgHierarchyTree: React.FC<OrgHierarchyTreeProps> = ({
  hierarchy,
  onAddEntity,
  onEditEntity
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    if (!hierarchy) return;
    const all: Record<string, boolean> = {};
    hierarchy.tree.forEach(c => {
      all[c.id] = true;
      c.businessUnits.forEach(bu => {
        all[bu.id] = true;
        bu.branches.forEach(b => {
          all[b.id] = true;
          b.departments.forEach(d => {
            all[d.id] = true;
          });
        });
      });
    });
    setExpandedNodes(all);
  };

  const handleCollapseAll = () => {
    setExpandedNodes({});
  };

  if (!hierarchy || hierarchy.tree.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Organizational Structure Found</h3>
          <p className="text-xs text-slate-500 mt-1">Start by creating your first corporate entity.</p>
        </div>
        <Button onClick={() => onAddEntity('company')} className="rounded-xl text-xs font-semibold shadow-md">
          <Plus className="w-4 h-4 mr-1.5" />
          Create First Company
        </Button>
      </div>
    );
  }

  const s = searchTerm.toLowerCase().trim();

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hierarchy (Company, BU, Branch, Dept)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExpandAll} className="rounded-xl text-xs">
            <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={handleCollapseAll} className="rounded-xl text-xs">
            <Minimize2 className="w-3.5 h-3.5 mr-1.5" />
            Collapse All
          </Button>
          <Button size="sm" onClick={() => onAddEntity('company')} className="rounded-xl text-xs font-semibold shadow-md">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Company
          </Button>
        </div>
      </div>

      {/* Hierarchical Visual Tree */}
      <div className="space-y-4">
        {hierarchy.tree.map((company) => {
          const isCompExpanded = expandedNodes[company.id] ?? true;
          const matchComp = !s || company.name.toLowerCase().includes(s) || company.code.toLowerCase().includes(s);

          return (
            <div
              key={company.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
            >
              {/* LEVEL 0: Company Header */}
              <div className="p-5 bg-gradient-to-r from-indigo-50/70 via-white to-blue-50/40 dark:from-slate-900 dark:to-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleNode(company.id)}
                    className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                  >
                    {isCompExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {company.name}
                      </h3>
                      <Badge variant="outline" className="font-mono text-[10px] bg-white dark:bg-slate-800 border-indigo-200 text-indigo-700 dark:text-indigo-300">
                        {company.code}
                      </Badge>
                      <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-[10px]">
                        {company.businessUnits.length} Business Units
                      </Badge>
                    </div>
                    {company.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{company.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditEntity('company', company)}
                    className="text-xs rounded-xl h-8 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddEntity('businessUnit', company.id)}
                    className="text-xs rounded-xl h-8 border-indigo-200 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add BU
                  </Button>
                </div>
              </div>

              {/* LEVEL 1: Business Units Container */}
              {isCompExpanded && (
                <div className="p-5 pl-8 md:pl-12 space-y-4 bg-slate-50/40 dark:bg-slate-950/40">
                  {company.businessUnits.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">
                      No business units yet. Click "Add BU" to define operational divisions.
                    </p>
                  ) : (
                    company.businessUnits.map((bu) => {
                      const isBuExpanded = expandedNodes[bu.id] ?? true;

                      return (
                        <div
                          key={bu.id}
                          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                        >
                          {/* BU Header */}
                          <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleNode(bu.id)}
                                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                              >
                                {isBuExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                <Briefcase className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {bu.name}
                                  </h4>
                                  <Badge variant="outline" className="font-mono text-[10px] border-blue-200 text-blue-700 dark:text-blue-300">
                                    {bu.code}
                                  </Badge>
                                  <span className="text-[11px] text-slate-400">
                                    {bu.branches.length} Branches • {bu.costCenters.length} Cost Centers
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEditEntity('businessUnit', bu)}
                                className="text-xs rounded-xl h-7 text-slate-600 dark:text-slate-300"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAddEntity('branch', bu.id)}
                                className="text-xs rounded-xl h-7 border-blue-200 text-blue-600 dark:text-blue-400 hover:bg-blue-50"
                              >
                                <Plus className="w-3.5 h-3.5 mr-1" />
                                Add Branch
                              </Button>
                            </div>
                          </div>

                          {/* LEVEL 2: Branches */}
                          {isBuExpanded && (
                            <div className="p-4 pl-6 md:pl-10 space-y-3 bg-white dark:bg-slate-900">
                              {bu.branches.length === 0 ? (
                                <p className="text-xs text-slate-400 italic py-1">
                                  No branch offices in this business unit.
                                </p>
                              ) : (
                                bu.branches.map((branch) => {
                                  const isBranchExpanded = expandedNodes[branch.id] ?? true;

                                  return (
                                    <div
                                      key={branch.id}
                                      className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden"
                                    >
                                      {/* Branch Header */}
                                      <div className="p-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2.5">
                                          <button
                                            onClick={() => toggleNode(branch.id)}
                                            className="p-1 rounded text-slate-400 hover:text-slate-600"
                                          >
                                            {isBranchExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                          </button>
                                          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                                            <MapPin className="w-3.5 h-3.5" />
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                {branch.name}
                                              </span>
                                              <Badge variant="outline" className="text-[9px] font-mono border-emerald-200 text-emerald-700 dark:text-emerald-400">
                                                {branch.code}
                                              </Badge>
                                              <span className="text-[10px] text-slate-400">
                                                {branch.departments.length} Departments
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEditEntity('branch', branch)}
                                            className="text-[11px] rounded-lg h-6 px-2 text-slate-500"
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onAddEntity('department', branch.id)}
                                            className="text-[11px] rounded-lg h-6 px-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                          >
                                            <Plus className="w-3 h-3 mr-1" />
                                            Add Dept
                                          </Button>
                                        </div>
                                      </div>

                                      {/* LEVEL 3: Departments in Branch */}
                                      {isBranchExpanded && (
                                        <div className="p-3 pl-6 md:pl-10 space-y-2">
                                          {branch.departments.length === 0 ? (
                                            <p className="text-[11px] text-slate-400 italic">
                                              No departments assigned to this branch office.
                                            </p>
                                          ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                              {branch.departments.map((dept) => {
                                                const isDeptExpanded = expandedNodes[dept.id] ?? false;

                                                return (
                                                  <div
                                                    key={dept.id}
                                                    className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-2xs"
                                                  >
                                                    <div className="flex items-center justify-between">
                                                      <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                                                          <Network className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div>
                                                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                            {dept.name}
                                                          </p>
                                                          <span className="text-[10px] font-mono text-slate-400">
                                                            {dept.code}
                                                          </span>
                                                        </div>
                                                      </div>
                                                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px]">
                                                        {dept.employeeCount} Staff
                                                      </Badge>
                                                    </div>

                                                    {/* Designations list toggle */}
                                                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                                                      <button
                                                        onClick={() => toggleNode(dept.id)}
                                                        className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-medium"
                                                      >
                                                        {isDeptExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                                        {dept.designations.length} Job Designations
                                                      </button>

                                                      <div className="flex items-center gap-1">
                                                        <button
                                                          onClick={() => onEditEntity('department', dept)}
                                                          className="text-slate-400 hover:text-slate-600 text-[10px] px-1"
                                                        >
                                                          Edit
                                                        </button>
                                                        <button
                                                          onClick={() => onAddEntity('designation', dept.id)}
                                                          className="text-indigo-600 hover:underline text-[10px] font-semibold"
                                                        >
                                                          + Designation
                                                        </button>
                                                      </div>
                                                    </div>

                                                    {/* LEVEL 4: Nested Designations */}
                                                    {isDeptExpanded && (
                                                      <div className="pt-2 pl-2 space-y-1.5">
                                                        {dept.designations.map((des) => (
                                                          <div
                                                            key={des.id}
                                                            className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-[11px]"
                                                          >
                                                            <div className="flex items-center gap-1.5">
                                                              <Users className="w-3 h-3 text-amber-500" />
                                                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                                                {des.name}
                                                              </span>
                                                              <span className="text-[9px] font-mono text-slate-400">
                                                                ({des.code})
                                                              </span>
                                                            </div>
                                                            <button
                                                              onClick={() => onEditEntity('designation', des)}
                                                              className="text-slate-400 hover:text-slate-600 text-[9px]"
                                                            >
                                                              Edit
                                                            </button>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
