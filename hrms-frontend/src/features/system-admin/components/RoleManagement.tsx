import React, { useState } from 'react';
import { Shield, Plus, Copy, Edit, Trash2, Users, KeyRound, Check, X, AlertTriangle } from 'lucide-react';
import { RoleData, PermissionData } from '../types/systemAdmin';
import { systemAdminApi } from '../api/systemAdminApi';

interface Props {
  roles: RoleData[];
  permissions: PermissionData[];
  onRefresh: () => void;
  onOpenMatrix: () => void;
}

export const RoleManagement: React.FC<Props> = ({ roles, permissions, onRefresh, onOpenMatrix }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [roleForm, setRoleForm] = useState<{ name: string; code: string; description: string; permissionIds: string[] }>({
    name: '',
    code: '',
    description: '',
    permissionIds: []
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingRole(null);
    setRoleForm({
      name: '',
      code: '',
      description: '',
      permissionIds: []
    });
    setError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (r: RoleData) => {
    setEditingRole(r);
    setRoleForm({
      name: r.name,
      code: r.code,
      description: r.description,
      permissionIds: r.permissions?.map(p => p.id) || []
    });
    setError(null);
    setShowModal(true);
  };

  const handleDuplicate = async (roleId: string) => {
    try {
      await systemAdminApi.duplicateRole(roleId);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to duplicate role');
    }
  };

  const handleDelete = async (r: RoleData) => {
    if (r.isSystem) {
      alert(`Role '${r.name}' is a protected System Role and cannot be deleted.`);
      return;
    }
    if (r.userCount > 0) {
      alert(`Cannot delete '${r.name}' because ${r.userCount} users are currently assigned to this role.`);
      return;
    }
    if (!window.confirm(`Permanently delete custom role '${r.name}'?`)) return;

    try {
      await systemAdminApi.deleteRole(r.id);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete role');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name.trim()) {
      setError('Role name is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingRole) {
        await systemAdminApi.updateRole(editingRole.id, {
          name: roleForm.name,
          description: roleForm.description,
          isActive: editingRole.isActive,
          permissionIds: roleForm.permissionIds
        });
      } else {
        await systemAdminApi.createRole({
          name: roleForm.name,
          code: roleForm.code || `ROLE_${roleForm.name.toUpperCase().replace(/\s+/g, '_')}`,
          description: roleForm.description,
          permissionIds: roleForm.permissionIds
        });
      }
      setShowModal(false);
      onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Role-Based Access Control (RBAC)</h3>
          <p className="text-xs text-slate-500">Manage standard system roles and create tailored custom roles</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMatrix}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-primary" />
            Visual Permission Matrix
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Role
          </button>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(r => (
          <div
            key={r.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    r.code === 'SUPER_ADMIN'
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/50'
                      : r.isSystem
                      ? 'bg-primary/10 text-primary'
                      : 'bg-purple-100 text-purple-600 dark:bg-purple-950/50'
                  }`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      {r.name}
                    </h4>
                    <span className="font-mono text-[10px] text-slate-400">{r.code}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  r.isSystem
                    ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                }`}>
                  {r.isSystem ? 'SYSTEM' : 'CUSTOM'}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 min-h-[32px]">
                {r.description || 'Enterprise role specification'}
              </p>

              <div className="flex items-center space-x-4 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{r.userCount}</span> Users
                </div>
                <div className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{r.permissionCount}</span> Permissions
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleDuplicate(r.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Duplicate Role"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOpenEdit(r)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit Role"
              >
                <Edit className="w-4 h-4" />
              </button>
              {!r.isSystem && (
                <button
                  onClick={() => handleDelete(r)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete Custom Role"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingRole ? `Edit Role: ${editingRole.name}` : 'Create Custom Role'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Role Name *</label>
                <input
                  type="text"
                  required
                  value={roleForm.name}
                  onChange={e => setRoleForm({ ...roleForm, name: e.target.value })}
                  placeholder="e.g. Lead Talent Scout"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {!editingRole && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Role Code</label>
                  <input
                    type="text"
                    value={roleForm.code}
                    onChange={e => setRoleForm({ ...roleForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. ROLE_TALENT_SCOUT"
                    className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono uppercase"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={roleForm.description}
                  onChange={e => setRoleForm({ ...roleForm, description: e.target.value })}
                  placeholder="Describe functional duties and authorization bounds..."
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingRole ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
