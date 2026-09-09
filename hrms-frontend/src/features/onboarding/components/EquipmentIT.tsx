import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Laptop, Mail, Key, Download, Check, 
  Send, Truck, Box, Shield, RefreshCw, X, HardDrive
} from 'lucide-react';

export interface LicenseItem {
  id: string;
  name: string;
  category: string;
  granted: boolean;
}

export interface EquipmentRecord {
  id: number;
  empCode: string;
  name: string;
  dept: string;
  role: string;
  hw: string;
  serialNo: string;
  trackingNo: string;
  hwStatus: 'Delivered' | 'Shipped' | 'Configuring' | 'Pending Assignment';
  email: 'Active' | 'Created' | 'Pending';
  emailAddress: string;
  sw: 'Assigned' | 'Partial' | 'Pending';
  licenses: LicenseItem[];
  status: 'Completed' | 'In Progress' | 'Pending IT';
  shipDate: string;
  itAdmin: string;
  deliveryAddress: string;
  notes?: string;
}

const INITIAL_EQUIPMENT: EquipmentRecord[] = [
  {
    id: 1,
    empCode: 'EMP-2026-901',
    name: 'Sarah Jenkins',
    dept: 'Engineering',
    role: 'Senior Developer',
    hw: 'MacBook Pro 16" M3 Max (36GB/1TB)',
    serialNo: 'C02G89X0MD6R',
    trackingNo: 'FDX-8829-1920-US',
    hwStatus: 'Shipped',
    email: 'Created',
    emailAddress: 'sarah.jenkins@company.com',
    sw: 'Partial',
    licenses: [
      { id: '1', name: 'Google Workspace Enterprise', category: 'Productivity', granted: true },
      { id: '2', name: 'Slack Enterprise Grid', category: 'Communication', granted: true },
      { id: '3', name: 'GitHub Enterprise (Dev Team)', category: 'Engineering', granted: true },
      { id: '4', name: 'AWS Production Read-Only', category: 'Cloud Infrastructure', granted: false },
      { id: '5', name: '1Password Business Vault', category: 'Security', granted: false },
    ],
    status: 'In Progress',
    shipDate: '29 Aug 2026',
    itAdmin: 'Alex Rivers (IT Ops)',
    deliveryAddress: '742 Evergreen Terrace, Austin, TX 78701',
    notes: 'Laptop pre-configured with MDM profile and FileVault encryption. En route via FedEx Overnight.'
  },
  {
    id: 2,
    empCode: 'EMP-2026-902',
    name: 'John Doe',
    dept: 'Product Management',
    role: 'Technical Product Lead',
    hw: 'ThinkPad X1 Carbon Gen 12 (32GB/1TB)',
    serialNo: 'PF-398Y81-2026',
    trackingNo: 'UPS-1Z99999999999',
    hwStatus: 'Delivered',
    email: 'Active',
    emailAddress: 'john.doe@company.com',
    sw: 'Assigned',
    licenses: [
      { id: '1', name: 'Google Workspace Enterprise', category: 'Productivity', granted: true },
      { id: '2', name: 'Slack Enterprise Grid', category: 'Communication', granted: true },
      { id: '3', name: 'Jira Software & Confluence', category: 'Project Management', granted: true },
      { id: '4', name: 'Figma Organization Seat', category: 'Design', granted: true },
      { id: '5', name: '1Password Business Vault', category: 'Security', granted: true },
    ],
    status: 'Completed',
    shipDate: '24 Aug 2026',
    itAdmin: 'Marcus Vance (Senior IT)',
    deliveryAddress: '1240 Bay St, Suite 400, San Francisco, CA 94123',
    notes: 'Employee completed hardware unboxing & enrolled in Okta FastPass.'
  },
  {
    id: 3,
    empCode: 'EMP-2026-903',
    name: 'David Lee',
    dept: 'Sales & BD',
    role: 'Enterprise AE',
    hw: 'MacBook Air 15" M3 (16GB/512GB)',
    serialNo: 'C02K9878LL11',
    trackingNo: 'PENDING-IT-STOCK',
    hwStatus: 'Configuring',
    email: 'Created',
    emailAddress: 'david.lee@company.com',
    sw: 'Pending',
    licenses: [
      { id: '1', name: 'Google Workspace Enterprise', category: 'Productivity', granted: true },
      { id: '2', name: 'Slack Enterprise Grid', category: 'Communication', granted: false },
      { id: '3', name: 'Salesforce CRM Enterprise', category: 'Sales', granted: false },
      { id: '4', name: 'Zoom Phone Enterprise', category: 'Communication', granted: false },
      { id: '5', name: '1Password Business Vault', category: 'Security', granted: false },
    ],
    status: 'In Progress',
    shipDate: 'Est. 02 Sep 2026',
    itAdmin: 'Alex Rivers (IT Ops)',
    deliveryAddress: '55 Wall Street, Apt 12B, New York, NY 10005',
    notes: 'Awaiting Salesforce Enterprise license allocation from Global Sales Ops.'
  },
  {
    id: 4,
    empCode: 'EMP-2026-904',
    name: 'Elena Rostova',
    dept: 'Data Engineering',
    role: 'Lead Data Architect',
    hw: 'Dell Precision 5690 Workstation (64GB/2TB)',
    serialNo: 'DL-882190-2026',
    trackingNo: 'DHL-EXPRESS-9921',
    hwStatus: 'Delivered',
    email: 'Active',
    emailAddress: 'elena.rostova@company.com',
    sw: 'Assigned',
    licenses: [
      { id: '1', name: 'Google Workspace Enterprise', category: 'Productivity', granted: true },
      { id: '2', name: 'Slack Enterprise Grid', category: 'Communication', granted: true },
      { id: '3', name: 'Snowflake Analytics Admin', category: 'Data', granted: true },
      { id: '4', name: 'Databricks Workspace VIP', category: 'Data', granted: true },
      { id: '5', name: '1Password Business Vault', category: 'Security', granted: true },
    ],
    status: 'Completed',
    shipDate: '20 Aug 2026',
    itAdmin: 'Marcus Vance (Senior IT)',
    deliveryAddress: '300 Pine Street, Seattle, WA 98101',
    notes: 'Hardware delivered and tested. Full access to Snowflake dev clusters provisioned.'
  }
];

export function EquipmentIT() {
  const [items, setItems] = useState<EquipmentRecord[]>(INITIAL_EQUIPMENT);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'In Progress' | 'Pending IT'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<EquipmentRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hw.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, statusFilter]);

  const handleMarkAllProvisioned = (id: number) => {
    setItems(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return {
        ...rec,
        hwStatus: 'Delivered',
        email: 'Active',
        sw: 'Assigned',
        status: 'Completed',
        licenses: rec.licenses.map(l => ({ ...l, granted: true })),
        notes: (rec.notes ? rec.notes + ' | ' : '') + 'All IT provisioning marked completed and hardware receipt acknowledged.'
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        hwStatus: 'Delivered',
        email: 'Active',
        sw: 'Assigned',
        status: 'Completed',
        licenses: prev.licenses.map(l => ({ ...l, granted: true }))
      } : null);
    }
    showToast('IT Equipment & Software permissions fully provisioned for employee!');
  };

  const handleToggleLicense = (licenseId: string) => {
    if (!selectedRecord) return;
    const updatedLicenses = selectedRecord.licenses.map(l => 
      l.id === licenseId ? { ...l, granted: !l.granted } : l
    );
    const allGranted = updatedLicenses.every(l => l.granted);
    const someGranted = updatedLicenses.some(l => l.granted);
    const newSwStatus: 'Assigned' | 'Partial' | 'Pending' = allGranted ? 'Assigned' : someGranted ? 'Partial' : 'Pending';
    const isCompleted = selectedRecord.hwStatus === 'Delivered' && selectedRecord.email === 'Active' && allGranted;

    const updatedRec: EquipmentRecord = {
      ...selectedRecord,
      licenses: updatedLicenses,
      sw: newSwStatus,
      status: isCompleted ? 'Completed' : 'In Progress'
    };

    setSelectedRecord(updatedRec);
    setItems(prev => prev.map(r => r.id === updatedRec.id ? updatedRec : r));
    showToast('License access state updated');
  };

  const handleUpdateHwStatus = (newHwStatus: 'Delivered' | 'Shipped' | 'Configuring' | 'Pending Assignment') => {
    if (!selectedRecord) return;
    const allLicenses = selectedRecord.licenses.every(l => l.granted);
    const isCompleted = newHwStatus === 'Delivered' && selectedRecord.email === 'Active' && allLicenses;

    const updatedRec: EquipmentRecord = {
      ...selectedRecord,
      hwStatus: newHwStatus,
      status: isCompleted ? 'Completed' : 'In Progress'
    };

    setSelectedRecord(updatedRec);
    setItems(prev => prev.map(r => r.id === updatedRec.id ? updatedRec : r));
    showToast(`Hardware logistics updated to: ${newHwStatus}`);
  };

  const handleUpdateEmailStatus = (newStatus: 'Active' | 'Created' | 'Pending') => {
    if (!selectedRecord) return;
    const allLicenses = selectedRecord.licenses.every(l => l.granted);
    const isCompleted = selectedRecord.hwStatus === 'Delivered' && newStatus === 'Active' && allLicenses;

    const updatedRec: EquipmentRecord = {
      ...selectedRecord,
      email: newStatus,
      status: isCompleted ? 'Completed' : 'In Progress'
    };

    setSelectedRecord(updatedRec);
    setItems(prev => prev.map(r => r.id === updatedRec.id ? updatedRec : r));
    showToast(`Corporate email account updated to: ${newStatus}`);
  };

  const handleDownloadReceipt = (rec: EquipmentRecord) => {
    const content = `===============================================================
             CORPORATE IT ASSET & PROVISIONING RECEIPT
===============================================================
Employee Name     : ${rec.name}
Employee Code     : ${rec.empCode}
Department        : ${rec.dept}
Role              : ${rec.role}
Date Issued       : ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
IT Administrator  : ${rec.itAdmin}
---------------------------------------------------------------
1. HARDWARE SPECIFICATION
---------------------------------------------------------------
Device Model      : ${rec.hw}
Serial Number     : ${rec.serialNo}
Tracking Number   : ${rec.trackingNo}
Logistics Status  : ${rec.hwStatus}
Delivery Address  : ${rec.deliveryAddress}

---------------------------------------------------------------
2. CORPORATE IDENTITY & EMAIL ACCESS
---------------------------------------------------------------
Corporate Email   : ${rec.emailAddress}
Account Status    : ${rec.email}
SSO Protocol      : SAML 2.0 / Okta FastPass Enabled
MFA Method        : FIDO2 Hardware Key / Mobile Authenticator

---------------------------------------------------------------
3. SOFTWARE LICENSES & ROLES
---------------------------------------------------------------
${rec.licenses.map((l, i) => `${i + 1}. [${l.granted ? 'GRANTED' : 'PENDING'}] ${l.name} (${l.category})`).join('\n')}

Overall Status    : ${rec.status.toUpperCase()}
Notes             : ${rec.notes || 'None'}
===============================================================
Employee Acceptance:
"I acknowledge receipt and custody of the IT assets specified above. 
I agree to uphold the Corporate Information Security Policy, 
protect company confidential data, and return all equipment upon 
separation of employment."

Signature: ______________________      Date: __________________
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IT_Asset_Receipt_${rec.empCode}_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`IT Asset Receipt generated for ${rec.name}`);
    setActiveDropdown(null);
  };

  const handleSendCredentials = (rec: EquipmentRecord) => {
    setActiveDropdown(null);
    showToast(`Encrypted temporary credentials dispatched to personal email for ${rec.name}`);
  };

  return (
    <Card className="shadow-sm border-slate-200">
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-sm flex items-center justify-between shadow-md transition-all">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4" />
            {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 bg-slate-50/70 border-b border-slate-200">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Assigned</span>
            <Laptop className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{items.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Laptops & workstations</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Delivered & Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {items.filter(i => i.hwStatus === 'Delivered').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Ready for work</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>In Transit / Prep</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {items.filter(i => i.hwStatus === 'Shipped' || i.hwStatus === 'Configuring').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">FedEx / IT staging</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Software Granted</span>
            <Shield className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {items.filter(i => i.sw === 'Assigned').length} / {items.length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Complete SSO bundles</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Equipment & IT Provisioning</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Assign laptops, corporate email, software licenses, and access rights</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search hardware, employee, SN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Completed', 'In Progress', 'Pending IT'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === f 
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold' 
                    : 'hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Hardware & Serial</th>
                <th className="px-6 py-3.5">Email Account</th>
                <th className="px-6 py-3.5">Software Licenses</th>
                <th className="px-6 py-3.5">Overall Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No equipment or IT records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.empCode} • {item.dept}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-slate-500" />
                        {item.hw}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-600">
                          SN: {item.serialNo}
                        </span>
                        <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium ${
                          item.hwStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          item.hwStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.hwStatus}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-mono text-slate-700">{item.emailAddress}</div>
                      <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium ${
                        item.email === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.email === 'Created' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <Mail className="w-3 h-3 mr-1" />
                        {item.email}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.sw === 'Assigned' ? 'bg-emerald-100 text-emerald-800' :
                          item.sw === 'Partial' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          <Key className="w-3 h-3 mr-1" />
                          {item.sw} ({item.licenses.filter(l => l.granted).length}/{item.licenses.length})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {item.licenses.filter(l => l.granted).map(l => l.name.split(' ')[0]).join(', ')}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Provisioned
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> {item.status}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Provision / Manage Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/80 border-indigo-200 font-medium flex items-center gap-1.5"
                        >
                          <Laptop className="w-3.5 h-3.5" />
                          Provision
                        </Button>

                        {/* Dropdown Toggle */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        >
                          <MoreHorizontal className="w-4 h-4"/>
                        </Button>

                        {/* Dropdown Menu */}
                        {activeDropdown === item.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setActiveDropdown(null)} 
                            />
                            <div className="absolute right-0 top-9 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                IT Ops Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                                Inspect & Configure IT Setup
                              </button>

                              <button
                                onClick={() => handleMarkAllProvisioned(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Mark All Provisioned & Ready
                              </button>

                              <button
                                onClick={() => handleSendCredentials(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Send className="w-3.5 h-3.5 text-blue-600" />
                                Send Welcome IT Credentials
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadReceipt(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download IT Asset Receipt
                              </button>
                            </div>
                          </>
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
          <div>Showing {filteredItems.length} of {items.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredItems.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Provision & Hardware Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-semibold">IT Asset Provisioning Dossier</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.name} ({selectedRecord.empCode}) • {selectedRecord.role} • {selectedRecord.dept}
                </p>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
              {/* Hardware Details Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-3">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                    <Box className="w-4 h-4 text-indigo-600" />
                    1. Hardware Logistics & Tracking
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['Configuring', 'Shipped', 'Delivered'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateHwStatus(st)}
                        className={`px-2 py-1 text-xs rounded font-medium border transition-colors ${
                          selectedRecord.hwStatus === st 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Assigned Laptop:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedRecord.hw}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Serial Number:</span>
                    <p className="font-mono font-semibold text-slate-800 mt-0.5">{selectedRecord.serialNo}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Tracking Number:</span>
                    <p className="font-mono text-indigo-600 font-semibold mt-0.5">{selectedRecord.trackingNo}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Shipping / Dispatch Date:</span>
                    <p className="text-slate-700 mt-0.5">{selectedRecord.shipDate}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 font-medium">Delivery Destination:</span>
                    <p className="text-slate-700 mt-0.5">{selectedRecord.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Corporate Email Account */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-3">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                    <Mail className="w-4 h-4 text-blue-600" />
                    2. Corporate Email & Google Workspace
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['Pending', 'Created', 'Active'] as const).map(em => (
                      <button
                        key={em}
                        onClick={() => handleUpdateEmailStatus(em)}
                        className={`px-2 py-1 text-xs rounded font-medium border transition-colors ${
                          selectedRecord.email === em 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-400">Primary Enterprise Account:</span>
                    <div className="font-mono font-semibold text-slate-800">{selectedRecord.emailAddress}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendCredentials(selectedRecord)}
                    className="h-7 text-xs text-blue-600 hover:text-blue-700 border-blue-200 bg-blue-50/50"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Dispatch Access Email
                  </Button>
                </div>
              </div>

              {/* Software Licenses Checklist */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-3">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                    <Key className="w-4 h-4 text-purple-600" />
                    3. Software Licenses & Access Matrix
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedRecord.licenses.filter(l => l.granted).length} of {selectedRecord.licenses.length} Granted
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedRecord.licenses.map(lic => (
                    <div 
                      key={lic.id}
                      onClick={() => handleToggleLicense(lic.id)}
                      className="flex items-center justify-between p-2.5 bg-white rounded border border-slate-200 hover:border-indigo-200 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={lic.granted}
                          onChange={() => {}} // Handled by div click
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{lic.name}</div>
                          <div className="text-[11px] text-slate-400">{lic.category}</div>
                        </div>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        lic.granted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {lic.granted ? 'Granted' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedRecord.notes && (
                <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">IT Ops Remarks:</span> {selectedRecord.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReceipt(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export Receipt (.txt)
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleMarkAllProvisioned(selectedRecord.id)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark All Provisioned
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
