import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Save, ShieldAlert, Clock, Database, Server } from 'lucide-react';

export function AuditSettings() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Audit settings saved successfully.');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Data Retention Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">System Audit Logs Retention</label>
              <select className="w-full p-2 border rounded-md bg-white">
                <option>30 Days</option>
                <option>90 Days</option>
                <option>180 Days</option>
                <option>1 Year</option>
                <option>Indefinite</option>
              </select>
              <p className="text-xs text-slate-500">How long standard API and system events are kept.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Security Events Retention</label>
              <select className="w-full p-2 border rounded-md bg-white">
                <option>90 Days</option>
                <option>1 Year</option>
                <option>3 Years</option>
                <option selected>Indefinite (Recommended)</option>
              </select>
              <p className="text-xs text-slate-500">Compliance requirement for unauthorized access attempts.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Data Change Diff Retention</label>
              <select className="w-full p-2 border rounded-md bg-white">
                <option>30 Days</option>
                <option>90 Days</option>
                <option>1 Year</option>
              </select>
              <p className="text-xs text-slate-500">Storage-heavy property tracking (Before/After DB changes).</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-500" />
            Storage Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <p className="font-medium text-slate-900">Current DB Size: 4.2 GB</p>
              <p className="text-sm text-slate-500">Audit tables consume approx 1.8 GB</p>
            </div>
            <div className="space-x-3">
              <Button variant="outline" className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50">
                Purge Logs Now
              </Button>
              <Button variant="outline">
                Export Archive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
