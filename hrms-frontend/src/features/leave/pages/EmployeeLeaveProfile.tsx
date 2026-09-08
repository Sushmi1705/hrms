import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { CalendarClock, AlertTriangle, FileText } from 'lucide-react';

export function EmployeeLeaveProfile({ employeeId }: { employeeId: string }) {
  
  const { data: balances, isLoading } = useQuery({
    queryKey: ['leave-balances', employeeId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/Leave/employee/${employeeId}/balances?year=2026`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  if (isLoading) return <div className="p-4 text-slate-500 animate-pulse">Loading leave profile...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Leave Balance Wallet (2026)</h3>
        <p className="text-sm text-slate-500">Current leave quotas and utilization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {balances?.map((balance: any) => {
          const percentUsed = (balance.used / (balance.openingBalance + balance.accrued)) * 100;
          return (
            <Card key={balance.id} className="shadow-sm border-slate-200">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: balance.leaveType.colorCode}}></div>
                    <span className="font-semibold text-slate-800">{balance.leaveType.name}</span>
                  </div>
                  <Badge variant="outline" className="bg-slate-50">{balance.remaining} Left</Badge>
                </div>
                
                <div className="space-y-3">
                  <Progress value={percentUsed} className="h-2" indicatorColor={balance.leaveType.colorCode} />
                  
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{balance.used} Used</span>
                    <span>{balance.openingBalance + balance.accrued} Total</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {(!balances || balances.length === 0) && (
          <div className="col-span-full p-8 text-center bg-slate-50 border border-dashed rounded-lg text-slate-500">
            No leave balances found for this year.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-indigo-500" />
              Leave History Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center text-slate-500 border border-dashed rounded-lg">
              Detailed leave history timeline will render here.
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Loss of Pay (LOP)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-rose-50 rounded-lg text-center">
              <span className="block text-3xl font-black text-rose-600 mb-1">0</span>
              <span className="text-sm font-medium text-rose-800">LOP Days this year</span>
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg flex items-center gap-3">
              <FileText className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-700">Attendance Impact</p>
                <p className="text-xs text-slate-500">98% compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
