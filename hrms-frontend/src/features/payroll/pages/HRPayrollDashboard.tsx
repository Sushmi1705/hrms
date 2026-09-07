import React, { useState } from 'react';
import { PayrollProcessing } from './PayrollProcessing';
import { SalaryStructureConfig } from './SalaryStructureConfig';
import { PayslipsList } from './PayslipsList';
import { EmployeeSalaryList } from './EmployeeSalaryList';
import { AllowancesConfig } from './AllowancesConfig';
import { DeductionsConfig } from './DeductionsConfig';
import { LoansConfig } from './LoansConfig';
import { ReimbursementsConfig } from './ReimbursementsConfig';
import { TaxManagementConfig } from './TaxManagementConfig';
import { FinalSettlementConfig } from './FinalSettlementConfig';
import { PayrollReports } from './PayrollReports';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  Banknote, AlertTriangle, TrendingUp, Download, CheckCircle, 
  BarChart2, Users, FileText, ClipboardList, Settings, CreditCard, Receipt
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

export function HRPayrollDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showGlobalToast, setShowGlobalToast] = useState(false);
  const [globalToastMsg, setGlobalToastMsg] = useState('');
  
  const handleGlobalAction = (msg: string) => {
    setGlobalToastMsg(msg);
    setShowGlobalToast(true);
    setTimeout(() => setShowGlobalToast(false), 3000);
  };

  const [analytics, setAnalytics] = useState<any>({
    activeLoans: 25,
    pendingPayroll: 2,
    averageNetSalary: 85400,
    totalPayrollCost: 2854000,
    totalTaxDeducted: 420500,
    totalOvertimeCost: 85000,
    activeRunMonth: 'August 2026'
  });

  const payrollTrendData = [
    { month: 'Jan', cost: 2600000 },
    { month: 'Feb', cost: 2650000 },
    { month: 'Mar', cost: 2680000 },
    { month: 'Apr', cost: 2750000 },
    { month: 'May', cost: 2720000 },
    { month: 'Jun', cost: 2800000 },
    { month: 'Jul', cost: 2820000 },
    { month: 'Aug', cost: 2854000 },
  ];

  const departmentCostData = [
    { name: 'Engineering', cost: 1200000 },
    { name: 'Sales', cost: 600000 },
    { name: 'Marketing', cost: 400000 },
    { name: 'HR & Admin', cost: 350000 },
    { name: 'Finance', cost: 304000 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50 min-h-screen pb-10">
      <div className="p-8 max-w-[1600px] mx-auto space-y-6">
        {showGlobalToast && (
          <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
            <CheckCircle className="w-5 h-5" />
            <div><p className="font-medium">Success</p><p className="text-emerald-100 text-sm">{globalToastMsg}</p></div>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Payroll Management</h1>
            <p className="text-slate-500 mt-1">Active Processing Month: {analytics.activeRunMonth}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => handleGlobalAction("Bank transfer CSV file generated successfully.")} variant="outline" className="bg-white"><Download className="w-4 h-4 mr-2"/> Download Bank File</Button>
            <Button onClick={() => handleGlobalAction("Payroll cycle for August 2026 has been approved and locked.")} className="bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle className="w-4 h-4 mr-2"/> Approve Payroll</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="bg-white border border-slate-200 p-1 rounded-lg h-auto inline-flex gap-1 shadow-sm w-max min-w-full">
              <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Dashboard</TabsTrigger>
              <TabsTrigger value="processing" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Processing</TabsTrigger>
              <TabsTrigger value="structure" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Salary Structure</TabsTrigger>
              <TabsTrigger value="employees" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Employee Salary</TabsTrigger>
              <TabsTrigger value="allowances" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Allowances & Bonuses</TabsTrigger>
              <TabsTrigger value="deductions" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Deductions</TabsTrigger>
              <TabsTrigger value="loans" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Loans & Advances</TabsTrigger>
              <TabsTrigger value="reimbursements" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Reimbursements</TabsTrigger>
              <TabsTrigger value="tax" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Tax Management</TabsTrigger>
              <TabsTrigger value="payslips" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Payslips</TabsTrigger>
              <TabsTrigger value="settlement" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Final Settlement</TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Reports</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <Card className="shadow-sm border-l-4 border-l-indigo-500 xl:col-span-2">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Banknote className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Total Payroll Cost (Gross)</p><h3 className="text-2xl font-bold text-slate-800">{formatCurrency(analytics.totalPayrollCost)}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-emerald-500 xl:col-span-2">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Average Net Salary</p><h3 className="text-2xl font-bold text-slate-800">{formatCurrency(analytics.averageNetSalary)}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-rose-500 xl:col-span-2">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><Receipt className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Total Tax Deducted</p><h3 className="text-2xl font-bold text-slate-800">{formatCurrency(analytics.totalTaxDeducted)}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-amber-500 xl:col-span-2">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Active Loans/Advances</p><h3 className="text-2xl font-bold text-slate-800">{analytics.activeLoans}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-sky-500 xl:col-span-2">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-lg"><ClipboardList className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Total Overtime Payout</p><h3 className="text-2xl font-bold text-slate-800">{formatCurrency(analytics.totalOvertimeCost)}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-slate-500 xl:col-span-2">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-slate-50 text-slate-600 rounded-lg"><FileText className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Pending Payroll Runs</p><h3 className="text-2xl font-bold text-slate-800">{analytics.pendingPayroll}</h3></div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Monthly Payroll Cost Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={payrollTrendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                        <RechartsTooltip cursor={{fill: '#f8fafc'}} formatter={(value: any) => formatCurrency(Number(value) || 0)} />
                        <Area type="monotone" dataKey="cost" stroke="#10b981" fill="#d1fae5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Department Salary Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentCostData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                        <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} />
                        <RechartsTooltip cursor={{fill: '#f8fafc'}} formatter={(value: any) => formatCurrency(Number(value) || 0)} />
                        <Bar dataKey="cost" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="processing"><PayrollProcessing /></TabsContent>
          <TabsContent value="structure"><SalaryStructureConfig /></TabsContent>
          <TabsContent value="employees"><EmployeeSalaryList /></TabsContent>
          <TabsContent value="allowances"><AllowancesConfig /></TabsContent>
          <TabsContent value="deductions"><DeductionsConfig /></TabsContent>
          <TabsContent value="loans"><LoansConfig /></TabsContent>
          <TabsContent value="reimbursements"><ReimbursementsConfig /></TabsContent>
          <TabsContent value="tax"><TaxManagementConfig /></TabsContent>
          <TabsContent value="payslips"><PayslipsList /></TabsContent>
          <TabsContent value="settlement"><FinalSettlementConfig /></TabsContent>
          <TabsContent value="reports"><PayrollReports /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}




