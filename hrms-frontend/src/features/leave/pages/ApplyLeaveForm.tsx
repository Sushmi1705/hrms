import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Checkbox } from '../../../components/ui/checkbox';
import { Calendar, Paperclip, AlertCircle, ArrowRight } from 'lucide-react';

export function ApplyLeaveForm() {
  const [step, setStep] = useState(1);

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-0 ring-1 ring-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-slate-800">Apply for Leave</CardTitle>
          <div className="flex gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}></span>
            <span className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></span>
            <span className={`w-2.5 h-2.5 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`}></span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select leave type...</option>
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type="date" className="pl-9" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type="date" className="pl-9" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <Checkbox id="half-day" />
              <label htmlFor="half-day" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                This is a half day request
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Leave</label>
              <Textarea placeholder="Please provide a clear reason for your leave request..." className="min-h-[120px]" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Delegate Employee (Optional)</label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select person taking over your tasks...</option>
                <option value="1">Jane Doe</option>
                <option value="2">John Smith</option>
              </select>
            </div>
            
            <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <Paperclip className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Click to upload medical certificate or attachment</p>
              <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 5MB</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="p-4 bg-amber-50 rounded-lg flex items-start gap-3 border border-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-800">Review your request</h4>
                <p className="text-sm text-amber-700 mt-1">
                  You are applying for <strong>3 days</strong> of Annual Leave from Oct 12 to Oct 14. 
                  This will deduct from your remaining balance of 14 days.
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
              <div className="p-4 flex justify-between">
                <span className="text-slate-500">Leave Type</span>
                <span className="font-medium text-slate-900">Annual Leave</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium text-slate-900">12 Oct 2026 - 14 Oct 2026</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-slate-500">Total Days</span>
                <span className="font-medium text-slate-900">3 Days</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-slate-500">Delegated To</span>
                <span className="font-medium text-slate-900">Jane Doe</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => step > 1 ? setStep(step - 1) : null}
          disabled={step === 1}
        >
          Back
        </Button>
        {step < 3 ? (
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setStep(step + 1)}>
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Submit Application
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
