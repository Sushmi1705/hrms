import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Laptop, CreditCard, KeyRound, Download, Check, 
  Send, PackageCheck, Truck, ShieldCheck, X, HardDrive
} from 'lucide-react';

export interface AssetItem {
  id: string;
  category: 'Laptop/Device' | 'Access Card' | 'Corporate Card' | 'Peripherals';
  name: string;
  serialNo: string;
  condition: 'Good / Functional' | 'Minor Wear' | 'Damaged' | 'Pending Inspection';
  returned: boolean;
  returnDate?: string;
}

export interface AssetRecoveryRecord {
  id: number;
  empCode: string;
  name: string;
  dept: string;
  role: string;
  lwd: string;
  laptop: 'Returned' | 'Pending' | 'Damaged';
  card: 'Returned' | 'Pending' | 'N/A';
  corp: 'Returned' | 'Pending' | 'N/A';
  status: 'Completed' | 'In Progress' | 'Overdue';
  custodian: string;
  assets: AssetItem[];
  notes?: string;
}

const INITIAL_ASSETS: AssetRecoveryRecord[] = [
  {
    id: 1,
    empCode: 'EMP-1042',
    name: 'Alex Turner',
    dept: 'Sales',
    role: 'Senior Enterprise AE',
    lwd: '2026-09-15',
    laptop: 'Returned',
    card: 'Pending',
    corp: 'N/A',
    status: 'In Progress',
    custodian: 'Alex Rivers (IT Asset Lead)',
    assets: [
      { id: '1', category: 'Laptop/Device', name: 'MacBook Pro 16" M2 Pro (32GB/512GB)', serialNo: 'C02H89201MD8', condition: 'Good / Functional', returned: true, returnDate: '2026-09-02' },
      { id: '2', category: 'Peripherals', name: 'USB-C Dual 4K Docking Station + 140W Charger', serialNo: 'DK-99210-US', condition: 'Good / Functional', returned: true, returnDate: '2026-09-02' },
      { id: '3', category: 'Access Card', name: 'HQ Smart RFID Access Badge #8849', serialNo: 'RFID-8849', condition: 'Pending Inspection', returned: false },
    ],
    notes: 'Laptop returned and factory reset. Awaiting building access badge handover on last working day.'
  },
  {
    id: 2,
    empCode: 'EMP-1066',
    name: 'Zendaya Coleman',
    dept: 'Product',
    role: 'Principal PM',
    lwd: '2026-09-20',
    laptop: 'Returned',
    card: 'Returned',
    corp: 'Returned',
    status: 'Completed',
    custodian: 'Marcus Vance (Senior IT)',
    assets: [
      { id: '1', category: 'Laptop/Device', name: 'MacBook Air 15" M3 (16GB/512GB)', serialNo: 'C02KM192801', condition: 'Good / Functional', returned: true, returnDate: '2026-09-04' },
      { id: '2', category: 'Access Card', name: 'San Francisco Hub Keycard #1209', serialNo: 'RFID-1209', condition: 'Good / Functional', returned: true, returnDate: '2026-09-04' },
      { id: '3', category: 'Corporate Card', name: 'Corporate American Express Commercial Card', serialNo: 'AMEX-****-4019', condition: 'Good / Functional', returned: true, returnDate: '2026-09-04' },
    ],
    notes: 'All corporate physical property returned in pristine condition. IT sign-off completed.'
  },
  {
    id: 3,
    empCode: 'EMP-1102',
    name: 'Julian Casablancas',
    dept: 'Engineering',
    role: 'Staff DevOps Engineer',
    lwd: '2026-10-28',
    laptop: 'Pending',
    card: 'Pending',
    corp: 'Pending',
    status: 'In Progress',
    custodian: 'Alex Rivers (IT Asset Lead)',
    assets: [
      { id: '1', category: 'Laptop/Device', name: 'ThinkPad P1 Gen 6 Workstation (64GB/2TB)', serialNo: 'PF-2026-9912', condition: 'Pending Inspection', returned: false },
      { id: '2', category: 'Peripherals', name: 'YubiKey 5C NFC Security Key (2 units)', serialNo: 'YK-5C-8812', condition: 'Pending Inspection', returned: false },
      { id: '3', category: 'Access Card', name: 'Austin Technology Center Badge #9011', serialNo: 'RFID-9011', condition: 'Pending Inspection', returned: false },
    ],
    notes: 'Employee serving 60-day notice. Hardware return scheduled for week of October 25.'
  },
  {
    id: 4,
    empCode: 'EMP-1088',
    name: 'Lily Collins',
    dept: 'Marketing',
    role: 'Lead Brand Strategist',
    lwd: '2026-09-25',
    laptop: 'Pending',
    card: 'Pending',
    corp: 'Pending',
    status: 'In Progress',
    custodian: 'Marcus Vance (Senior IT)',
    assets: [
      { id: '1', category: 'Laptop/Device', name: 'MacBook Pro 14" M3 Pro (18GB/1TB)', serialNo: 'C02JK881920', condition: 'Pending Inspection', returned: false },
      { id: '2', category: 'Access Card', name: 'HQ Smart RFID Badge #4412', serialNo: 'RFID-4412', condition: 'Pending Inspection', returned: false },
      { id: '3', category: 'Corporate Card', name: 'Corporate Purchase Card (Mastercard)', serialNo: 'MC-****-9102', condition: 'Pending Inspection', returned: false },
    ],
    notes: 'Pre-paid return shipping box requested for remote return.'
  }
];

export function AssetRecovery() {
  const [assets, setAssets] = useState<AssetRecoveryRecord[]>(INITIAL_ASSETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'In Progress'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AssetRecoveryRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assets, searchTerm, statusFilter]);

  const handleToggleAssetReturn = (assetId: string) => {
    if (!selectedRecord) return;
    const today = new Date().toISOString().split('T')[0];
    const updatedAssets = selectedRecord.assets.map(a => {
      if (a.id !== assetId) return a;
      const willReturn = !a.returned;
      return {
        ...a,
        returned: willReturn,
        returnDate: willReturn ? today : undefined,
        condition: (willReturn ? 'Good / Functional' : 'Pending Inspection') as AssetItem['condition']
      };
    });

    const laptopItems = updatedAssets.filter(a => a.category === 'Laptop/Device');
    const cardItems = updatedAssets.filter(a => a.category === 'Access Card');
    const corpItems = updatedAssets.filter(a => a.category === 'Corporate Card');

    const laptopStatus: 'Returned' | 'Pending' | 'Damaged' = 
      laptopItems.length === 0 ? 'Returned' : laptopItems.every(a => a.returned) ? 'Returned' : 'Pending';
    const cardStatus: 'Returned' | 'Pending' | 'N/A' = 
      cardItems.length === 0 ? 'N/A' : cardItems.every(a => a.returned) ? 'Returned' : 'Pending';
    const corpStatus: 'Returned' | 'Pending' | 'N/A' = 
      corpItems.length === 0 ? 'N/A' : corpItems.every(a => a.returned) ? 'Returned' : 'Pending';

    const allReturned = updatedAssets.every(a => a.returned);

    const updatedRecord: AssetRecoveryRecord = {
      ...selectedRecord,
      assets: updatedAssets,
      laptop: laptopStatus,
      card: cardStatus,
      corp: corpStatus,
      status: allReturned ? 'Completed' : 'In Progress'
    };

    setSelectedRecord(updatedRecord);
    setAssets(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    showToast('Asset return status updated');
  };

  const handleMarkAllReturned = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setAssets(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return {
        ...rec,
        laptop: 'Returned',
        card: rec.card === 'N/A' ? 'N/A' : 'Returned',
        corp: rec.corp === 'N/A' ? 'N/A' : 'Returned',
        status: 'Completed',
        assets: rec.assets.map(a => ({
          ...a,
          returned: true,
          returnDate: a.returnDate || today,
          condition: a.condition === 'Pending Inspection' ? 'Good / Functional' : a.condition
        })),
        notes: (rec.notes ? rec.notes + ' | ' : '') + 'All assets surrendered and inspected in good condition.'
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        laptop: 'Returned',
        card: prev.card === 'N/A' ? 'N/A' : 'Returned',
        corp: prev.corp === 'N/A' ? 'N/A' : 'Returned',
        status: 'Completed',
        assets: prev.assets.map(a => ({
          ...a,
          returned: true,
          returnDate: a.returnDate || today,
          condition: a.condition === 'Pending Inspection' ? 'Good / Functional' : a.condition
        }))
      } : null);
    }
    showToast('All company assets marked recovered and returned!');
  };

  const handleSendShippingBox = (rec: AssetRecoveryRecord) => {
    setActiveDropdown(null);
    showToast(`Pre-paid insured shipping box & UPS label dispatched for ${rec.name}`);
  };

  const handleDownloadHandoverReceipt = (rec: AssetRecoveryRecord) => {
    const total = rec.assets.length;
    const returned = rec.assets.filter(a => a.returned).length;
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    const content = `===============================================================
            COMPANY ASSET RECOVERY & CUSTODY RECEIPT
===============================================================
Receipt Date    : ${todayStr}
Employee Name   : ${rec.name}
Employee ID     : ${rec.empCode}
Department      : ${rec.dept}
Job Title       : ${rec.role}
Last Working Day: ${rec.lwd}
IT Asset Officer: ${rec.custodian}
Surrender Status: ${returned}/${total} Items Received (${rec.status.toUpperCase()})
---------------------------------------------------------------
1. PHYSICAL ASSET AUDIT LOG
---------------------------------------------------------------
${rec.assets.map((a, i) => `[${a.returned ? 'RECEIVED' : 'OUTSTANDING'}] Item ${i + 1}: ${a.name}
   - Category  : ${a.category}
   - Serial No : ${a.serialNo}
   - Condition : ${a.condition}
   - Date Recd : ${a.returnDate || 'Pending'}`).join('\n\n')}

---------------------------------------------------------------
2. DEPARTMENTAL CUSTODIAN SIGN-OFF
---------------------------------------------------------------
"The employee has returned all company-issued hardware, access cards, 
and proprietary devices indicated above. Device storage has been 
securely wiped and enrolled in corporate IT inventory."

IT Asset Custodian Signature: __________________   Date: ________
Employee Acknowledgment     : __________________   Date: ________
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Asset_Handover_${rec.empCode}_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Asset Handover Receipt downloaded for ${rec.name}`);
    setActiveDropdown(null);
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
            <span>Asset Holders</span>
            <Laptop className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{assets.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Offboarding personnel</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Fully Recovered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {assets.filter(i => i.status === 'Completed').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">100% assets in vault</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Laptops Returned</span>
            <PackageCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">
            {assets.filter(i => i.laptop === 'Returned').length} / {assets.length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Hardware collected</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Pending Recovery</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {assets.filter(i => i.status === 'In Progress').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">In possession until LWD</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Asset Recovery</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Track and verify the return of laptops, devices, smart badges, and corporate credit cards</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search employee, hardware..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Completed', 'In Progress'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === f 
                    ? 'bg-white text-rose-700 shadow-xs font-semibold' 
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
                <th className="px-6 py-3.5">Laptops / Devices</th>
                <th className="px-6 py-3.5">Access Cards</th>
                <th className="px-6 py-3.5">Corporate Card</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No asset recovery records match your filter.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.empCode} • {item.dept}</div>
                      <div className="text-[11px] text-rose-600">LWD: {item.lwd}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.laptop === 'Returned' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Returned
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                        </span>
                      )}
                      <div className="text-[11px] text-slate-400 mt-1">
                        {item.assets.filter(a => a.category === 'Laptop/Device').map(a => a.name.split(' ')[0]).join(', ')}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.card === 'Returned' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Returned
                        </span>
                      ) : item.card === 'N/A' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          N/A
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.corp === 'Returned' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Returned
                        </span>
                      ) : item.corp === 'N/A' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          N/A
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> In Progress
                        </span>
                      )}
                      <div className="text-[11px] text-slate-500 mt-1">
                        {item.assets.filter(a => a.returned).length}/{item.assets.length} surrendered
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Recover Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 border-rose-200 font-medium flex items-center gap-1.5"
                        >
                          <PackageCheck className="w-3.5 h-3.5" />
                          Recover
                        </Button>

                        {/* Dropdown Menu Toggle */}
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
                                Asset Custody Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <HardDrive className="w-3.5 h-3.5 text-rose-600" />
                                Inspect Physical Assets
                              </button>

                              <button
                                onClick={() => handleMarkAllReturned(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Mark All Assets Surrendered
                              </button>

                              <button
                                onClick={() => handleSendShippingBox(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Truck className="w-3.5 h-3.5 text-blue-600" />
                                Ship Return Courier Box
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadHandoverReceipt(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Handover Receipt (.txt)
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
          <div>Showing {filteredAssets.length} of {assets.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredAssets.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Asset Recovery Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-semibold">Corporate Asset Recovery & Vault Custody</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.name} ({selectedRecord.empCode}) • {selectedRecord.dept} • LWD: {selectedRecord.lwd}
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
              {/* Asset Custodian Overview */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Vault Return Progress
                  </div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">
                    {selectedRecord.assets.filter(a => a.returned).length} of {selectedRecord.assets.length} Assets Surrendered
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    IT Custodian: {selectedRecord.custodian}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-rose-600">
                    {Math.round((selectedRecord.assets.filter(a => a.returned).length / selectedRecord.assets.length) * 100)}%
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkAllReturned(selectedRecord.id)}
                    className="h-7 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 mt-1"
                  >
                    Surrender All
                  </Button>
                </div>
              </div>

              {/* Itemized Assets */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 px-1 uppercase tracking-wider">
                  Assigned Hardware & Property List
                </div>

                <div className="space-y-2">
                  {selectedRecord.assets.map(asset => (
                    <div
                      key={asset.id}
                      onClick={() => handleToggleAssetReturn(asset.id)}
                      className={`p-3.5 rounded-lg border flex items-center justify-between transition-colors cursor-pointer ${
                        asset.returned 
                          ? 'bg-emerald-50/50 border-emerald-200/80' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          checked={asset.returned} 
                          onChange={() => {}} // Handled by div
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-0.5"
                        />
                        <div>
                          <div className={`text-xs font-semibold ${asset.returned ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                            {asset.name}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="font-mono bg-slate-100 px-1 py-0.2 rounded text-slate-700">SN: {asset.serialNo}</span>
                            <span>•</span>
                            <span>Condition: {asset.condition}</span>
                          </div>
                          {asset.returned && asset.returnDate && (
                            <div className="text-[11px] text-emerald-700 mt-0.5">
                              Surrendered to vault on {asset.returnDate}
                            </div>
                          )}
                        </div>
                      </div>

                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${
                        asset.returned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {asset.returned ? 'Surrendered' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedRecord.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">IT Asset Log:</span> {selectedRecord.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadHandoverReceipt(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Handover Receipt (.txt)
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
                  onClick={() => handleMarkAllReturned(selectedRecord.id)}
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark All Surrendered
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
