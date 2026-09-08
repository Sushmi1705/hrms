import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export function ShiftMaster() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch shifts from API
    fetch(`${API_BASE_URL}/api/v1/Shift/master`)
      .then(res => res.json())
      .then(data => {
        setShifts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching shifts', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Shift Configurations</h2>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add New Shift
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-100 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search shifts by name or code..." className="pl-9" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Shift Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Timing</th>
                  <th className="px-6 py-4">Working Hours</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading shifts...</td></tr>
                ) : shifts.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No shifts found</td></tr>
                ) : (
                  shifts.map((shift) => (
                    <tr key={shift.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: shift.colorCode || '#ccc' }}></div>
                          <div>
                            <div className="font-medium text-slate-900">{shift.shiftName}</div>
                            <div className="text-xs text-slate-500">{shift.shiftCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {shift.shiftType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900">{shift.startTime} - {shift.endTime}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{shift.workingHours} hrs</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${shift.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {shift.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600">
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
    </div>
  );
}
