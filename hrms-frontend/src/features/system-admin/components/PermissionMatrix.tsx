import React, { useState, useEffect } from 'react';
import {
  KeyRound, Shield, Search, Check, CheckSquare, Square,
  Save, RefreshCw, Layers, CheckCircle2, AlertCircle
} from 'lucide-react';
import { RoleData, FullPermissionMatrixResponse, PermissionMatrixModule } from '../types/systemAdmin';
import { systemAdminApi } from '../api/systemAdminApi';

interface Props {
  roles: RoleData[];
}

export const PermissionMatrix: React.FC<Props> = ({ roles }) => {
  const [matrixData, setMatrixData] = useState<FullPermissionMatrixResponse | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || '');
  const [grantedSet, setGrantedSet] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchMatrix = async () => {
    setLoading(true);
    try {
      const data = await systemAdminApi.getPermissionMatrix();
      setMatrixData(data);
      if (selectedRoleId) {
        const roleMatch = data.roles.find(r => r.roleId === selectedRoleId);
        if (roleMatch) {
          setGrantedSet(new Set(roleMatch.grantedPermissionIds));
        }
      } else if (data.roles.length > 0) {
        setSelectedRoleId(data.roles[0].roleId);
        setGrantedSet(new Set(data.roles[0].grantedPermissionIds));
      }
    } catch (err) {
      console.error('Failed to fetch permission matrix', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);
    setSuccessMessage(null);
    if (matrixData) {
      const match = matrixData.roles.find(r => r.roleId === roleId);
      if (match) {
        setGrantedSet(new Set(match.grantedPermissionIds));
      }
    }
  };

  const togglePermission = (permissionId: string) => {
    setGrantedSet(prev => {
      const next = new Set(prev);
      if (next.has(permissionId)) next.delete(permissionId);
      else next.add(permissionId);
      return next;
    });
  };

  const toggleModulePermissions = (module: PermissionMatrixModule) => {
    const modPermIds = module.permissions.map(p => p.id);
    const allSelected = modPermIds.every(id => grantedSet.has(id));

    setGrantedSet(prev => {
      const next = new Set(prev);
      if (allSelected) {
        modPermIds.forEach(id => next.delete(id));
      } else {
        modPermIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (!matrixData) return;
    const allIds = matrixData.modules.flatMap(m => m.permissions.map(p => p.id));
    setGrantedSet(new Set(allIds));
  };

  const handleClearAll = () => {
    setGrantedSet(new Set());
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    setSaving(true);
    setSuccessMessage(null);
    try {
      await systemAdminApi.updateRolePermissions(selectedRoleId, Array.from(grantedSet));
      setSuccessMessage('Role permission matrix updated and audited successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  const filteredModules = matrixData?.modules.map(mod => {
    if (!searchTerm) return mod;
    const matches = mod.permissions.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.action.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...mod, permissions: matches };
  }).filter(m => m.permissions.length > 0) || [];

  return (
    <div className="space-y-4">
      
      {/* Matrix Controls Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              Granular Permission Matrix
              {selectedRole?.isSystem && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  SYSTEM PROTECTED
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">Configure feature action grants for specific roles</p>
          </div>
        </div>

        {/* Role Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-500">Select Role:</span>
            <select
              value={selectedRoleId}
              onChange={e => handleRoleChange(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
            >
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.isSystem ? 'System' : 'Custom'})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Clear All
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Matrix
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter permissions by module name, action or code..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
        />
      </div>

      {/* Modules Permission Accordion/Grid */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading permission catalog...
        </div>
      ) : (
        <div className="space-y-4">
          {filteredModules.map(mod => {
            const allModSelected = mod.permissions.every(p => grantedSet.has(p.id));
            const someModSelected = mod.permissions.some(p => grantedSet.has(p.id));

            return (
              <div
                key={mod.module}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Module Header */}
                <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => toggleModulePermissions(mod)}
                      className="p-1 rounded text-primary hover:bg-primary/10 transition-colors"
                    >
                      {allModSelected ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : someModSelected ? (
                        <div className="w-4 h-4 border-2 border-primary bg-primary/20 rounded flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-xs" />
                        </div>
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                        {mod.module} Module
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {mod.permissions.filter(p => grantedSet.has(p.id)).length} of {mod.permissions.length} granted
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleModulePermissions(mod)}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    {allModSelected ? 'Unselect All' : 'Select All In Module'}
                  </button>
                </div>

                {/* Permissions Grid */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {mod.permissions.map(p => {
                    const isChecked = grantedSet.has(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => togglePermission(p.id)}
                        className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex items-start space-x-3 ${
                          isChecked
                            ? 'border-primary/60 bg-primary/5 dark:bg-primary/10 text-slate-900 dark:text-white'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-primary border-primary text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs truncate">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{p.code}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
