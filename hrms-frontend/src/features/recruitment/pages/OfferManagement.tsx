import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  CheckCircle2, FileText, Send, Plus, Eye, Printer, 
  Download, Building2, User, Calendar, DollarSign, 
  Clock, X, Check, Search, Filter, ShieldCheck, Sparkles
} from 'lucide-react';

export interface OfferLetterRecord {
  id: string;
  candidate: string;
  email: string;
  role: string;
  department: string;
  packageAmount: number;
  baseSalary: number;
  bonus: number;
  equityShares: string;
  joiningDate: string;
  expiryDate: string;
  status: 'Draft' | 'Sent (Pending)' | 'Accepted' | 'Declined';
  sentDate?: string;
  reportingManager: string;
  workLocation: string;
}

const INITIAL_OFFERS: OfferLetterRecord[] = [
  { 
    id: 'OFR-2026-041', 
    candidate: 'David Wilson', 
    email: 'david.wilson@example.com',
    role: 'Frontend Dev', 
    department: 'Engineering',
    packageAmount: 130000, 
    baseSalary: 115000,
    bonus: 15000,
    equityShares: '2,500 ISO Stock Options (4-year vesting)',
    joiningDate: '2026-09-15', 
    expiryDate: '2026-09-10',
    status: 'Sent (Pending)',
    sentDate: '01 Sep 2026',
    reportingManager: 'Alice Cooper (VP Engineering)',
    workLocation: 'Austin, TX (Remote Eligible)'
  },
  { 
    id: 'OFR-2026-042', 
    candidate: 'Elena Rodriguez', 
    email: 'elena.r@example.com',
    role: 'Staff Data Scientist', 
    department: 'Data & AI',
    packageAmount: 155000, 
    baseSalary: 135000,
    bonus: 20000,
    equityShares: '4,000 ISO Stock Options (4-year vesting)',
    joiningDate: '2026-10-01', 
    expiryDate: '2026-09-20',
    status: 'Draft',
    reportingManager: 'Dr. Robert Vance (Head of AI)',
    workLocation: 'San Francisco, CA (Hybrid)'
  },
  { 
    id: 'OFR-2026-043', 
    candidate: 'Liam Neeson', 
    email: 'liam.n@example.com',
    role: 'Full Stack Engineer', 
    department: 'Engineering',
    packageAmount: 110000, 
    baseSalary: 100000,
    bonus: 10000,
    equityShares: '1,500 ISO Stock Options',
    joiningDate: '2026-09-22', 
    expiryDate: '2026-09-05',
    status: 'Accepted',
    sentDate: '25 Aug 2026',
    reportingManager: 'Michael Chen (Tech Lead)',
    workLocation: 'Remote'
  }
];

export function OfferManagement() {
  const [offers, setOffers] = useState<OfferLetterRecord[]>(INITIAL_OFFERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedOffer, setSelectedOffer] = useState<OfferLetterRecord | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Generate offer form
  const [newOffer, setNewOffer] = useState({
    candidate: '',
    email: '',
    role: 'Backend Engineer',
    department: 'Engineering',
    packageAmount: 125000,
    baseSalary: 110000,
    bonus: 15000,
    equityShares: '2,000 Stock Options',
    joiningDate: '2026-10-15',
    expiryDate: '2026-09-30',
    reportingManager: 'Alice Cooper',
    workLocation: 'Remote'
  });

  // Filtered offers
  const filteredOffers = useMemo(() => {
    return offers.filter(o => {
      const matchSearch = 
        o.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [offers, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = offers.length;
    const pending = offers.filter(o => o.status === 'Sent (Pending)').length;
    const accepted = offers.filter(o => o.status === 'Accepted').length;
    const drafts = offers.filter(o => o.status === 'Draft').length;
    return { total, pending, accepted, drafts };
  }, [offers]);

  // Send offer email
  const handleSendOffer = (id: string) => {
    setOffers(prev => prev.map(o => {
      if (o.id === id) {
        return {
          ...o,
          status: 'Sent (Pending)',
          sentDate: 'Today'
        };
      }
      return o;
    }));

    if (selectedOffer && selectedOffer.id === id) {
      setSelectedOffer(prev => prev ? { ...prev, status: 'Sent (Pending)', sentDate: 'Today' } : null);
    }

    showToast('Offer Dispatched', 'Formal offer letter emailed to candidate via DocuSign bridge.');
  };

  // Mark offer as accepted
  const handleMarkAccepted = (id: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: 'Accepted' } : o));
    if (selectedOffer && selectedOffer.id === id) {
      setSelectedOffer(prev => prev ? { ...prev, status: 'Accepted' } : null);
    }
    showToast('Offer Accepted', 'Candidate signed. Record transferred to Employee Onboarding queue.');
  };

  // Download Offer Letter Text
  const handleDownloadOffer = (o: OfferLetterRecord) => {
    const content = `
================================================================================
                    ANRAONE ENTERPRISES INC.
                    OFFICIAL EMPLOYMENT OFFER LETTER
================================================================================
Offer ID           : ${o.id}
Issue Date         : ${o.sentDate || '08 Sep 2026'}
Signing Deadline   : ${o.expiryDate}

Candidate Name     : ${o.candidate}
Email Address      : ${o.email}
Position Offered   : ${o.role}
Department         : ${o.department}
Reporting Manager  : ${o.reportingManager}
Work Location      : ${o.workLocation}
Expected Start Date: ${o.joiningDate}

--------------------------------------------------------------------------------
COMPENSATION & BENEFITS STRUCTURE
--------------------------------------------------------------------------------
1. Annual Base Salary       : $${o.baseSalary.toLocaleString()} / year
2. Performance Bonus Target : $${o.bonus.toLocaleString()} / year
3. Total Annual CTC Package : $${o.packageAmount.toLocaleString()} / year
4. Long-Term Equity Grant   : ${o.equityShares}

Benefits Included:
• 100% Comprehensive Health, Dental & Vision Insurance Coverage
• 401(k) Retirement Account with 5% Immediate Company Matching
• 24 Days Annual Paid Time Off (PTO) + 12 Federal Paid Holidays
• $1,500 Annual Continuous Learning & Home-Office Tech Stipend

--------------------------------------------------------------------------------
ACCEPTANCE TERMS
--------------------------------------------------------------------------------
This offer is contingent upon successful completion of background checks.
To accept, please sign and return this agreement on or before ${o.expiryDate}.

Authorized Signature:
People Operations & Talent Acquisition Division
ANRAONE ENTERPRISES INC.
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Offer_Letter_${o.candidate.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Offer Letter Downloaded', `Document generated for ${o.candidate}`);
  };

  // Submit new offer
  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.candidate) return;

    const offerRecord: OfferLetterRecord = {
      id: `OFR-2026-${Math.floor(100 + Math.random() * 900)}`,
      candidate: newOffer.candidate,
      email: newOffer.email || `${newOffer.candidate.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      role: newOffer.role,
      department: newOffer.department,
      packageAmount: Number(newOffer.packageAmount),
      baseSalary: Number(newOffer.baseSalary),
      bonus: Number(newOffer.bonus),
      equityShares: newOffer.equityShares,
      joiningDate: newOffer.joiningDate,
      expiryDate: newOffer.expiryDate,
      status: 'Draft',
      reportingManager: newOffer.reportingManager,
      workLocation: newOffer.workLocation
    };

    setOffers([offerRecord, ...offers]);
    setIsGenerateModalOpen(false);
    showToast('Offer Generated', `Draft created for ${offerRecord.candidate}`);
  };

  return (
    <div className="space-y-6 mt-6 relative pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{toastMessage.title}</p>
            <p className="text-xs text-emerald-100">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Offer Management & Handoff
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {stats.total} Total
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Generate formal employment letters, track digital signatures, and seamlessly initiate employee onboarding.
          </p>
        </div>

        <Button 
          onClick={() => setIsGenerateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 text-xs"
        >
          <FileText className="w-4 h-4" />
          Generate Offer Letter
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Extended</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
              <span className="text-xs text-slate-500">Offers created</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Signature</p>
              <h3 className="text-2xl font-bold text-amber-600">{stats.pending}</h3>
              <span className="text-xs text-amber-600/80 font-medium">Awaiting response</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Signed & Accepted</p>
              <h3 className="text-2xl font-bold text-emerald-600">{stats.accepted}</h3>
              <span className="text-xs text-emerald-600/80 font-medium">Handoff to Onboarding</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Draft Letters</p>
              <h3 className="text-2xl font-bold text-slate-700">{stats.drafts}</h3>
              <span className="text-xs text-slate-500">Under HR review</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by candidate name, role, or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 text-sm focus-visible:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Statuses</option>
                <option value="Sent (Pending)">Sent (Pending)</option>
                <option value="Draft">Draft</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offers Table */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-6">Candidate</th>
                <th className="py-3.5 px-4">Role & Dept</th>
                <th className="py-3.5 px-4 text-right">Annual Package</th>
                <th className="py-3.5 px-4">Target Joining</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No offer letters found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Generate an offer letter or adjust your search.</p>
                  </td>
                </tr>
              ) : (
                filteredOffers.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-xs">
                          {o.candidate.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-snug">{o.candidate}</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                            <span className="font-mono text-[11px] text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded">
                              {o.id}
                            </span>
                            <span>•</span>
                            <span>{o.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 text-xs block">{o.role}</span>
                      <span className="text-[11px] text-slate-400">{o.department}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-slate-900 text-xs block">
                        ${o.packageAmount.toLocaleString()} /yr
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Base: ${o.baseSalary.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-700 font-medium">
                      {o.joiningDate}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        o.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : o.status === 'Sent (Pending)'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {o.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => setSelectedOffer(o)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Letter
                        </Button>

                        {o.status === 'Draft' && (
                          <Button
                            onClick={() => handleSendOffer(o.id)}
                            size="sm"
                            className="h-8 px-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Send
                          </Button>
                        )}

                        {o.status === 'Sent (Pending)' && (
                          <Button
                            onClick={() => handleMarkAccepted(o.id)}
                            size="sm"
                            className="h-8 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Sign
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: Offer Letter Voucher Preview */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Formal Employment Offer Letter</h3>
                  <p className="text-xs text-slate-400">{selectedOffer.candidate} • {selectedOffer.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOffer(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Body */}
            <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto text-xs">
              {/* Corporate Letterhead */}
              <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-base">ANRAONE ENTERPRISES INC.</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">Global Talent Acquisition & People Operations</p>
                  <p className="text-slate-400 text-[11px]">100 Tech Boulevard, Suite 500, San Francisco, CA</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block text-xs font-bold px-3 py-0.5 rounded-full ${
                    selectedOffer.status === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedOffer.status === 'Sent (Pending)'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedOffer.status.toUpperCase()}
                  </span>
                  <p className="text-slate-400 text-[11px] mt-1">Expiry: {selectedOffer.expiryDate}</p>
                </div>
              </div>

              {/* Meta details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 block font-medium">Candidate Name</span>
                  <span className="font-bold text-slate-800 block text-xs mt-0.5">{selectedOffer.candidate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Position</span>
                  <span className="font-semibold text-slate-800 block text-xs mt-0.5">{selectedOffer.role}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Reporting To</span>
                  <span className="font-semibold text-slate-800 block text-xs mt-0.5">{selectedOffer.reportingManager}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Target Start Date</span>
                  <span className="font-semibold text-emerald-600 block text-xs mt-0.5">{selectedOffer.joiningDate}</span>
                </div>
              </div>

              {/* Itemized Compensation Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-700 flex justify-between">
                  <span>Compensation Component</span>
                  <span>Annual Value ($)</span>
                </div>
                <div className="p-4 space-y-2.5 text-slate-700">
                  <div className="flex justify-between">
                    <span>Base Annual Salary (Direct Deposit)</span>
                    <span className="font-semibold">${selectedOffer.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance Incentive Target Bonus</span>
                    <span className="font-semibold">${selectedOffer.bonus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900 text-sm">
                    <span>Total Target Annual Package (CTC)</span>
                    <span className="text-indigo-600">${selectedOffer.packageAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Equity & Benefits */}
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                <p className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Equity & Comprehensive Benefits Grant
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Stock Options:</strong> {selectedOffer.equityShares}.
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Includes full health, dental, vision insurance coverage, 401(k) retirement matching (5%), 24 PTO days, and $1,500 annual tech/learning stipend.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Letter
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleDownloadOffer(selectedOffer)}
                  variant="outline"
                  size="sm"
                  className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </Button>

                {selectedOffer.status === 'Draft' && (
                  <Button
                    onClick={() => handleSendOffer(selectedOffer.id)}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Offer Email
                  </Button>
                )}

                {selectedOffer.status === 'Sent (Pending)' && (
                  <Button
                    onClick={() => handleMarkAccepted(selectedOffer.id)}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark Accepted
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOffer(null)}
                  className="border-slate-200 text-slate-600 text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Generate Offer Letter */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5" />
                <h3 className="font-bold text-base">Generate Employment Offer Letter</h3>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Candidate Full Name *</label>
                  <Input
                    required
                    placeholder="e.g. Jordan Lee"
                    value={newOffer.candidate}
                    onChange={e => setNewOffer({ ...newOffer, candidate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="jordan@example.com"
                    value={newOffer.email}
                    onChange={e => setNewOffer({ ...newOffer, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Offered Role</label>
                  <Input
                    placeholder="e.g. Senior Backend Engineer"
                    value={newOffer.role}
                    onChange={e => setNewOffer({ ...newOffer, role: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Salary ($)</label>
                  <Input
                    type="number"
                    value={newOffer.baseSalary}
                    onChange={e => {
                      const base = parseFloat(e.target.value) || 0;
                      setNewOffer({ ...newOffer, baseSalary: base, packageAmount: base + newOffer.bonus });
                    }}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bonus ($)</label>
                  <Input
                    type="number"
                    value={newOffer.bonus}
                    onChange={e => {
                      const b = parseFloat(e.target.value) || 0;
                      setNewOffer({ ...newOffer, bonus: b, packageAmount: newOffer.baseSalary + b });
                    }}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Joining Date</label>
                  <Input
                    type="date"
                    value={newOffer.joiningDate}
                    onChange={e => setNewOffer({ ...newOffer, joiningDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Offer Expiry Date</label>
                  <Input
                    type="date"
                    value={newOffer.expiryDate}
                    onChange={e => setNewOffer({ ...newOffer, expiryDate: e.target.value })}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Equity Stock Options</label>
                  <Input
                    placeholder="e.g. 2,500 ISO Stock Options"
                    value={newOffer.equityShares}
                    onChange={e => setNewOffer({ ...newOffer, equityShares: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center font-bold text-slate-800">
                <span>Calculated Package (CTC):</span>
                <span className="text-indigo-600 text-sm">${newOffer.packageAmount.toLocaleString()} /yr</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsGenerateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Create Offer Draft
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
