import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Settings, Sliders, ShieldCheck, Download, 
  Check, ToggleLeft, ToggleRight, Edit3, X, Save, RefreshCw
} from 'lucide-react';

export type SettingModule = 'Automation' | 'Assessments' | 'Certifications' | 'Notifications';

export interface SettingRecord {
  id: number;
  code: string;
  name: string;
  mod: SettingModule;
  val: string;
  date: string;
  status: 'Active' | 'Disabled';
  description: string;
  inputType: 'select' | 'text' | 'number';
  allowedValues?: string[];
}

const INITIAL_SETTINGS: SettingRecord[] = [
  {
    id: 1,
    code: 'SET-AUTO-COMP',
    name: 'Auto-Assign Compliance Training on Onboarding',
    mod: 'Automation',
    val: 'Enabled',
    date: '2026-01-15',
    status: 'Active',
    description: 'Automatically triggers mandatory cybersecurity, HIPAA, and anti-harassment course enrollment on Day 1 of employee hire.',
    inputType: 'select',
    allowedValues: ['Enabled', 'Disabled']
  },
  {
    id: 2,
    code: 'SET-RETAKE-MAX',
    name: 'Maximum Assessment Retakes Allowed',
    mod: 'Assessments',
    val: '3 Attempts',
    date: '2026-05-20',
    status: 'Active',
    description: 'The maximum allowable retakes for graded quizzes before manager approval is mandatory to unlock the exam.',
    inputType: 'select',
    allowedValues: ['1 Attempt', '3 Attempts', '5 Attempts', 'Unlimited']
  },
  {
    id: 3,
    code: 'SET-PASS-THRESH',
    name: 'Default Minimum Passing Score Threshold',
    mod: 'Assessments',
    val: '80%',
    date: '2026-03-10',
    status: 'Active',
    description: 'The baseline percentage grade required across all LMS courses to receive an issued certificate credential.',
    inputType: 'select',
    allowedValues: ['70%', '75%', '80%', '85%', '90%']
  },
  {
    id: 4,
    code: 'SET-CERT-WARN',
    name: 'Certificate Expiration Warning Lead Time',
    mod: 'Certifications',
    val: '90 Days',
    date: '2026-02-01',
    status: 'Active',
    description: 'Advance notice period in which both employee and line manager receive automated renewal nudges prior to credential expiry.',
    inputType: 'select',
    allowedValues: ['30 Days', '60 Days', '90 Days', '120 Days']
  },
  {
    id: 5,
    code: 'SET-NOTIF-MGR',
    name: 'Weekly Manager Learning Progress Digest',
    mod: 'Notifications',
    val: 'Enabled',
    date: '2026-04-18',
    status: 'Active',
    description: 'Dispatches automated Monday morning email digests summarizing direct report course progress and overdue training items.',
    inputType: 'select',
    allowedValues: ['Enabled', 'Disabled']
  }
];

export function LMSSettings() {
  const [settings, setSettings] = useState<SettingRecord[]>(INITIAL_SETTINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState<'All' | SettingModule>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<SettingRecord | null>(null);
  const [editVal, setEditVal] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Disabled'>('Active');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredSettings = useMemo(() => {
    return settings.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.val.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesModule = moduleFilter === 'All' || item.mod === moduleFilter;
      return matchesSearch && matchesModule;
    });
  }, [settings, searchTerm, moduleFilter]);

  const handleToggleStatus = (id: number) => {
    setSettings(prev => prev.map(s => {
      if (s.id !== id) return s;
      const nextStatus: 'Active' | 'Disabled' = s.status === 'Active' ? 'Disabled' : 'Active';
      return { 
        ...s, 
        status: nextStatus, 
        val: nextStatus === 'Disabled' && s.val === 'Enabled' ? 'Disabled' : nextStatus === 'Active' && s.val === 'Disabled' ? 'Enabled' : s.val,
        date: new Date().toISOString().split('T')[0] 
      };
    }));
    setActiveDropdown(null);
    showToast('Setting status updated successfully!');
  };

  const handleSaveSetting = () => {
    if (!selectedSetting) return;
    setSettings(prev => prev.map(s => {
      if (s.id !== selectedSetting.id) return s;
      return {
        ...s,
        val: editVal || s.val,
        status: editStatus,
        date: new Date().toISOString().split('T')[0]
      };
    }));
    showToast(`Saved configuration for ${selectedSetting.name}!`);
    setSelectedSetting(null);
  };

  const handleExportConfig = () => {
    const configData = {
      platform: 'HRMS Learning Management System',
      version: '2026.4.0',
      exportedAt: new Date().toISOString(),
      parameters: settings.map(s => ({
        code: s.code,
        name: s.name,
        module: s.mod,
        value: s.val,
        status: s.status,
        lastUpdated: s.date
      }))
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LMS-Configuration-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported LMS Configuration JSON!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">Parameters</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{settings.length}</h3>
              <p className="text-xs text-slate-500 mt-1">Platform Rules</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <Sliders className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Active Policies</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {settings.filter(s => s.status === 'Active').length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Enforced system-wide</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Automation</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {settings.filter(s => s.mod === 'Automation').length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Background triggers</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <RefreshCw className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-purple-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Security Rules</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {settings.filter(s => s.mod === 'Assessments').length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Grading & Retakes</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              LMS Configuration
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">Configure learning platform parameters, grading benchmarks, retake limits, and automated triggers</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search setting, module, value..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 w-64 h-9" 
              />
            </div>
            
            {/* Module Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {(['All', 'Automation', 'Assessments', 'Certifications', 'Notifications'] as const).map(mod => (
                <button
                  key={mod}
                  onClick={() => setModuleFilter(mod)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    moduleFilter === mod 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportConfig}
              className="flex items-center gap-2 text-slate-700 h-9"
            >
              <Download className="w-4 h-4" /> Export Config
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[260px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Configuration Setting</th>
                  <th className="px-6 py-3">Module</th>
                  <th className="px-6 py-3">Value</th>
                  <th className="px-6 py-3">Last Updated</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSettings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Settings className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-sm font-medium">No configuration settings match your search</p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => { setSearchTerm(''); setModuleFilter('All'); }}
                          className="text-indigo-600 mt-1"
                        >
                          Clear filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSettings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="font-medium text-slate-900 leading-tight">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{item.code}</span>
                            <span className="text-xs text-slate-400 line-clamp-1">{item.description}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {item.mod}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 bg-indigo-50/70 border border-indigo-100 px-2.5 py-1 rounded-md text-xs">
                          {item.val}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-xs">
                        {item.date}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.status === 'Active' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1"/> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            Disabled
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 relative">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedSetting(item);
                              setEditVal(item.val);
                              setEditStatus(item.status);
                            }}
                            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 h-8 text-xs font-medium flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Configure
                          </Button>

                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>

                          {/* Dropdown Menu */}
                          {activeDropdown === item.id && (
                            <div 
                              className="absolute right-0 top-9 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-30 text-left animate-in fade-in zoom-in-95 duration-150"
                              onMouseLeave={() => setActiveDropdown(null)}
                            >
                              <button
                                onClick={() => {
                                  setSelectedSetting(item);
                                  setEditVal(item.val);
                                  setEditStatus(item.status);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                Edit Parameters
                              </button>

                              <button
                                onClick={() => handleToggleStatus(item.id)}
                                className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                              >
                                {item.status === 'Active' ? (
                                  <>
                                    <ToggleRight className="w-3.5 h-3.5 text-emerald-600" />
                                    Disable Policy
                                  </>
                                ) : (
                                  <>
                                    <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
                                    Enable Policy
                                  </>
                                )}
                              </button>

                              <div className="border-t border-slate-100 my-1"></div>

                              <button
                                onClick={() => {
                                  const content = `[HRMS LMS PARAMETER]\nCode: ${item.code}\nName: ${item.name}\nModule: ${item.mod}\nValue: ${item.val}\nStatus: ${item.status}\nLastUpdated: ${item.date}\nDescription: ${item.description}\n`;
                                  const blob = new Blob([content], { type: 'text/plain' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `Setting-${item.code}.txt`;
                                  a.click();
                                  URL.revokeObjectURL(url);
                                  showToast(`Exported setting ${item.code}!`);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Export Parameter
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <div>Showing {filteredSettings.length} of {settings.length} entries</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled={filteredSettings.length <= 5}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Settings Configuration Modal */}
      {selectedSetting && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Configure Parameter</h3>
                  <p className="text-xs text-indigo-200">{selectedSetting.code} • {selectedSetting.mod}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSetting(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-600">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">POLICY NAME</span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">{selectedSetting.name}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedSetting.description}</p>
              </div>

              {/* Value selector/input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Configured Setting Value
                </label>
                {selectedSetting.allowedValues ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedSetting.allowedValues.map(valOption => (
                      <button
                        key={valOption}
                        type="button"
                        onClick={() => setEditVal(valOption)}
                        className={`p-2 text-xs font-medium rounded-lg border text-center transition-all ${
                          editVal === valOption
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-600/20 font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {valOption}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Input
                    type="text"
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    className="border-slate-200"
                  />
                )}
              </div>

              {/* Status toggle */}
              <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-800">Policy Enforcement State</span>
                  <p className="text-xs text-slate-500 mt-0.5">Determine if this rule actively governs LMS transactions</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditStatus(editStatus === 'Active' ? 'Disabled' : 'Active')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    editStatus === 'Active' ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      editStatus === 'Active' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Last updated: {selectedSetting.date}
              </span>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveSetting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Configuration
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedSetting(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
