import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { PlayCircle, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export function PayrollProcessing() {
  const [showToast, setShowToast] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleProcess = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Success</p>
            <p className="text-emerald-100 text-sm">Payroll calculated successfully for 312 employees.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Run Payroll - August 2026</h2>
        <Button onClick={handleProcess} disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {processing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <PlayCircle className="w-4 h-4 mr-2" />}
          {processing ? 'Calculating...' : 'Calculate Salary'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-t-4 border-t-emerald-500">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500"/> Attendance Sync</h3>
            <p className="text-sm text-slate-500">Attendance and Leave data synchronized.</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-t-4 border-t-amber-500">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500"/> Tax Deductions</h3>
            <p className="text-sm text-slate-500">Pending final calculation trigger.</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-t-4 border-t-slate-500">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2 text-slate-400">Final Verification</h3>
            <p className="text-sm text-slate-400">Locked until calculation completes.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
