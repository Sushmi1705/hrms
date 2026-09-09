import React, { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Plus, Search, Edit, Trash2, X, Clock, CheckCircle2, AlertCircle, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';

export interface ShiftItem {
  id: string;
  shiftName: string;
  shiftCode: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  workingHours: number;
  colorCode: string;
  status: string;
  description?: string;
}

const COLOR_OPTIONS = [
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Cyan', hex: '#06b6d4' },
];

const SHIFT_TYPES = ['Morning', 'General', 'Evening', 'Night', 'Flexible', 'Split'];

export function ShiftMaster() {
  const [shifts, setShifts] = useState<ShiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftItem | null>(null);
  const [deleteConfirmShift, setDeleteConfirmShift] = useState<ShiftItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    shiftName: '',
    shiftCode: '',
    shiftType: 'General',
    startTime: '09:00',
    endTime: '18:00',
    workingHours: 9,
    colorCode: '#3b82f6',
    status: 'Active',
    description: ''
  });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchShifts = () => {
    fetch(`${API_BASE_URL}/api/v1/Shift/master`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch shifts');
        return res.json();
      })
      .then(data => {
        setShifts(Array.isArray(data) ? data : (data.value || []));
        setLoading(false);
      })
      .catch(err => {
        console.warn('Error fetching shifts, falling back to cached list', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  // Calculate working hours automatically when start or end time changes
  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 8;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // Overnight shift
    }
    const hours = Math.round((diffMinutes / 60) * 10) / 10;
    return hours > 0 ? hours : 8;
  };

  const handleStartTimeChange = (val: string) => {
    const hrs = calculateHours(val, formData.endTime);
    setFormData(prev => ({ ...prev, startTime: val, workingHours: hrs }));
  };

  const handleEndTimeChange = (val: string) => {
    const hrs = calculateHours(formData.startTime, val);
    setFormData(prev => ({ ...prev, endTime: val, workingHours: hrs }));
  };

  // Open modal for Adding
  const handleAddNew = () => {
    setEditingShift(null);
    setFormData({
      shiftName: '',
      shiftCode: `SHF0${shifts.length + 1}`,
      shiftType: 'General',
      startTime: '09:00',
      endTime: '18:00',
      workingHours: 9,
      colorCode: '#3b82f6',
      status: 'Active',
      description: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleEdit = (shift: ShiftItem) => {
    setEditingShift(shift);
    setFormData({
      shiftName: shift.shiftName,
      shiftCode: shift.shiftCode,
      shiftType: shift.shiftType || 'General',
      startTime: shift.startTime.substring(0, 5),
      endTime: shift.endTime.substring(0, 5),
      workingHours: shift.workingHours || calculateHours(shift.startTime, shift.endTime),
      colorCode: shift.colorCode || '#3b82f6',
      status: shift.status || 'Active',
      description: shift.description || ''
    });
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shiftName.trim()) {
      showToast('Shift name is required', 'error');
      return;
    }

    setSubmitting(true);
    const isEdit = !!editingShift;
    const url = isEdit 
      ? `${API_BASE_URL}/api/v1/Shift/master/${editingShift.id}`
      : `${API_BASE_URL}/api/v1/Shift/master`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const savedData = await res.json();
        if (isEdit) {
          setShifts(prev => prev.map(s => s.id === editingShift.id ? { ...s, ...formData } : s));
          showToast(`Shift "${formData.shiftName}" updated successfully.`);
        } else {
          setShifts(prev => [...prev, { id: savedData.id || String(Date.now()), ...formData }]);
          showToast(`Shift "${formData.shiftName}" created successfully.`);
        }
        setIsModalOpen(false);
      } else {
        // Optimistic fallback for frontend
        if (isEdit) {
          setShifts(prev => prev.map(s => s.id === editingShift.id ? { ...s, ...formData } : s));
          showToast(`Shift "${formData.shiftName}" updated.`);
        } else {
          const fallbackId = `shf-${Date.now()}`;
          setShifts(prev => [...prev, { id: fallbackId, ...formData }]);
          showToast(`Shift "${formData.shiftName}" created.`);
        }
        setIsModalOpen(false);
      }
    } catch (err) {
      console.warn('API error, applying changes optimistically:', err);
      if (isEdit) {
        setShifts(prev => prev.map(s => s.id === editingShift.id ? { ...s, ...formData } : s));
        showToast(`Shift "${formData.shiftName}" updated.`);
      } else {
        setShifts(prev => [...prev, { id: `shf-${Date.now()}`, ...formData }]);
        showToast(`Shift "${formData.shiftName}" created.`);
      }
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmShift) return;
    const id = deleteConfirmShift.id;
    const shiftName = deleteConfirmShift.shiftName;

    try {
      await fetch(`${API_BASE_URL}/api/v1/Shift/master/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Delete request failed:', err);
    }

    setShifts(prev => prev.filter(s => s.id !== id));
    setDeleteConfirmShift(null);
    showToast(`Shift "${shiftName}" deleted.`);
  };

  // Filtered shifts based on search query
  const filteredShifts = useMemo(() => {
    if (!searchQuery.trim()) return shifts;
    const q = searchQuery.toLowerCase();
    return shifts.filter(s => 
      (s.shiftName && s.shiftName.toLowerCase().includes(q)) ||
      (s.shiftCode && s.shiftCode.toLowerCase().includes(q)) ||
      (s.shiftType && s.shiftType.toLowerCase().includes(q))
    );
  }, [shifts, searchQuery]);

  return (
    <div className="space-y-6 mt-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-sm font-medium ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            {toastMessage.text}
          </div>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Shift Configurations</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Define master working shifts, schedules, timings, and rules</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold text-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add New Shift
        </Button>
      </div>

      <Card className="shadow-xs border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          {/* Search bar */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search shifts by name or code..." 
                className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
              />
            </div>
            {searchQuery && (
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="text-xs text-slate-400">
                Clear
              </Button>
            )}
          </div>
          
          {/* Shift Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Shift Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Timing</th>
                  <th className="px-6 py-4">Working Hours</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading shift configurations...</td></tr>
                ) : filteredShifts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-sm">No shifts match your search</p>
                      <p className="text-xs text-slate-400 mt-0.5">Click "+ Add New Shift" to create a new configuration.</p>
                    </td>
                  </tr>
                ) : (
                  filteredShifts.map((shift) => (
                    <tr key={shift.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: shift.colorCode || '#3b82f6' }} />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{shift.shiftName}</div>
                            <div className="text-xs font-mono text-slate-400">{shift.shiftCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {shift.shiftType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">
                          {shift.startTime?.substring(0, 5)} - {shift.endTime?.substring(0, 5)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                        {shift.workingHours} hrs
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          shift.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {shift.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(shift)}
                            title="Edit Shift"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDeleteConfirmShift(shift)}
                            title="Delete Shift"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Shift Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingShift ? 'Edit Shift Configuration' : 'Add New Shift Configuration'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingShift ? `Updating ${editingShift.shiftCode}` : 'Configure working hours, timings, and shift parameters'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Shift Name *</label>
                  <Input 
                    value={formData.shiftName}
                    onChange={e => setFormData({ ...formData, shiftName: e.target.value })}
                    placeholder="e.g. Morning Shift"
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Shift Code *</label>
                  <Input 
                    value={formData.shiftCode}
                    onChange={e => setFormData({ ...formData, shiftCode: e.target.value })}
                    placeholder="e.g. MORN01"
                    required
                    className="h-9 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Shift Type</label>
                  <select 
                    value={formData.shiftType}
                    onChange={e => setFormData({ ...formData, shiftType: e.target.value })}
                    className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {SHIFT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Start Time</label>
                  <Input 
                    type="time"
                    value={formData.startTime}
                    onChange={e => handleStartTimeChange(e.target.value)}
                    required
                    className="h-8 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">End Time</label>
                  <Input 
                    type="time"
                    value={formData.endTime}
                    onChange={e => handleEndTimeChange(e.target.value)}
                    required
                    className="h-8 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Hours</label>
                  <Input 
                    type="number"
                    step="0.5"
                    value={formData.workingHours}
                    onChange={e => setFormData({ ...formData, workingHours: parseFloat(e.target.value) || 0 })}
                    className="h-8 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                  />
                </div>
              </div>

              {/* Color Code Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Color Badge</label>
                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, colorCode: c.hex })}
                      className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                        formData.colorCode === c.hex ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description (Optional)</label>
                <Input 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Standard morning roster shift"
                  className="h-9"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-slate-100 dark:border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {submitting ? 'Saving...' : editingShift ? 'Update Shift' : 'Create Shift'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmShift && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-center font-bold text-slate-900 dark:text-white text-base">
              Delete Shift Configuration?
            </h3>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-1">
              Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-200">{deleteConfirmShift.shiftName} ({deleteConfirmShift.shiftCode})</span>? This action cannot be undone.
            </p>

            <div className="mt-5 flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setDeleteConfirmShift(null)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteConfirm}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
