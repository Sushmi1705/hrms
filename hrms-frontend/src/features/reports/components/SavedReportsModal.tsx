import React, { useState, useEffect } from 'react';
import { reportsApi, type SavedReportDto, type CreateSavedReportDto } from '../api/reportApi';
import { X, Bookmark, Plus, Trash2, Check, Play } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface SavedReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyReport: (config: any) => void;
  currentFilters: any;
}

export const SavedReportsModal: React.FC<SavedReportsModalProps> = ({
  isOpen,
  onClose,
  onApplyReport,
  currentFilters
}) => {
  const [reports, setReports] = useState<SavedReportDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await reportsApi.getSavedReports();
      setReports(data || []);
    } catch (e) {
      console.error('Failed to load saved reports:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadReports();
    }
  }, [isOpen]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await reportsApi.createSavedReport({
        name,
        description,
        dataSource: 'ExecutiveDashboard',
        configuration: JSON.stringify(currentFilters),
        visibility: 'Company'
      });
      setName('');
      setDescription('');
      setShowCreate(false);
      await loadReports();
    } catch (e) {
      console.error('Failed to save report:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await reportsApi.deleteSavedReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error('Failed to delete saved report:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Saved Reports Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Access pre-configured executive views or save current active filters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Create New Saved Report Section */}
          {showCreate ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Save Current Report Filters</h4>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Report Name</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly HR Executive Review"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Brief summary of this report view"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)} className="text-xs">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={!name.trim() || saving}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {saving ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Your Saved Views</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreate(true)}
                className="text-xs gap-1.5 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Save Current View</span>
              </Button>
            </div>
          )}

          {/* List of Saved Reports */}
          {loading ? (
            <div className="space-y-2 py-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <Bookmark className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No saved reports yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Save your frequently used filter configurations for one-click access.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-indigo-300 transition-colors flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{report.name}</h4>
                    {report.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {report.description}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium">
                      Source: {report.dataSource} • {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => {
                        try {
                          const parsed = JSON.parse(report.configuration);
                          onApplyReport(parsed);
                          onClose();
                        } catch (err) {
                          console.error('Invalid configuration json', err);
                        }
                      }}
                      className="text-xs gap-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
                    >
                      <Play className="h-3 w-3" />
                      <span>Load</span>
                    </Button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
