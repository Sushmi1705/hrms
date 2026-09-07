import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CheckCircle, FileText } from 'lucide-react';

export function TaxManagementConfig() {
  const [showToast, setShowToast] = useState(false);
  
  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div><p className="font-medium">Success</p><p className="text-emerald-100 text-sm">Tax slabs updated successfully.</p></div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Tax Management Slabs</h2>
        <Button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
      </div>
      <Card className="shadow-sm">
        <CardContent className="p-8 text-center text-slate-500">
          <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p>Global Tax Engine is currently configured for 300 employees.</p>
        </CardContent>
      </Card>
    </div>
  );
}
