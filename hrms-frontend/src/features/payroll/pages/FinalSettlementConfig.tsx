import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CheckCircle } from 'lucide-react';

export function FinalSettlementConfig() {
  const [showToast, setShowToast] = useState(false);
  
  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div><p className="font-medium">Success</p><p className="text-emerald-100 text-sm">Final Settlement processed.</p></div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Final Settlement (Exit)</h2>
      </div>
      <Card className="shadow-sm">
        <CardContent className="p-8 text-center text-slate-500">
          <p>No pending final settlements for exiting employees.</p>
        </CardContent>
      </Card>
    </div>
  );
}
