import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Eye, Download, Check, X, FileText, 
  Upload, ShieldCheck, User, Plus
} from 'lucide-react';

export interface DocumentRecord {
  id: number;
  empCode: string;
  name: string;
  role: string;
  dept: string;
  idProof: 'Verified' | 'Pending' | 'Rejected';
  addressProof: 'Verified' | 'Pending' | 'Rejected';
  taxForms: 'Verified' | 'Pending' | 'Rejected';
  educationCert: 'Verified' | 'Pending' | 'Rejected';
  status: 'Completed' | 'In Progress' | 'Pending';
  submissionDate: string;
  verifiedBy?: string;
  notes?: string;
}

const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 1,
    empCode: 'EMP-2026-901',
    name: 'Sarah Jenkins',
    role: 'Senior Developer',
    dept: 'Engineering',
    idProof: 'Verified',
    addressProof: 'Pending',
    taxForms: 'Verified',
    educationCert: 'Verified',
    status: 'In Progress',
    submissionDate: '28 Aug 2026',
    verifiedBy: 'HR Ops (Alice)',
    notes: 'Utility bill submitted for address proof was older than 3 months. Candidate re-upload requested.'
  },
  {
    id: 2,
    empCode: 'EMP-2026-902',
    name: 'Amanda Fox',
    role: 'Product Designer',
    dept: 'Design',
    idProof: 'Verified',
    addressProof: 'Verified',
    taxForms: 'Verified',
    educationCert: 'Verified',
    status: 'Completed',
    submissionDate: '25 Aug 2026',
    verifiedBy: 'HR Compliance Lead',
    notes: 'All federal KYC and tax withholding forms fully verified against state records.'
  },
  {
    id: 3,
    empCode: 'EMP-2026-903',
    name: 'Michael Chen',
    role: 'Product Manager',
    dept: 'Product',
    idProof: 'Verified',
    addressProof: 'Verified',
    taxForms: 'Verified',
    educationCert: 'Verified',
    status: 'Completed',
    submissionDate: '20 Aug 2026',
    verifiedBy: 'HR Ops (Alice)'
  },
  {
    id: 4,
    empCode: 'EMP-2026-904',
    name: 'David Wilson',
    role: 'Frontend Dev',
    dept: 'Engineering',
    idProof: 'Pending',
    addressProof: 'Pending',
    taxForms: 'Pending',
    educationCert: 'Pending',
    status: 'Pending',
    submissionDate: '01 Sep 2026'
  }
];

export function Documents() {
  const [documents, setDocuments] = useState<DocumentRecord[]>(INITIAL_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Menu
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Filtered
  const filteredDocs = useMemo(() => {
    return documents.filter(d => {
      const matchSearch = 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.empCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [documents, searchTerm, statusFilter]);

  // Actions
  const handleToggleDocItem = (docId: number, field: 'idProof' | 'addressProof' | 'taxForms' | 'educationCert') => {
    setDocuments(prev => prev.map(item => {
      if (item.id === docId) {
        const nextVal: 'Verified' | 'Pending' = item[field] === 'Verified' ? 'Pending' : 'Verified';
        const updated = { ...item, [field]: nextVal };
        const allVerified = 
          updated.idProof === 'Verified' && 
          updated.addressProof === 'Verified' && 
          updated.taxForms === 'Verified' && 
          updated.educationCert === 'Verified';
        updated.status = allVerified ? 'Completed' : 'In Progress';
        return updated;
      }
      return item;
    }));

    if (selectedDoc && selectedDoc.id === docId) {
      setSelectedDoc(prev => {
        if (!prev) return null;
        const nextVal: 'Verified' | 'Pending' = prev[field] === 'Verified' ? 'Pending' : 'Verified';
        const updated = { ...prev, [field]: nextVal };
        const allVerified = 
          updated.idProof === 'Verified' && 
          updated.addressProof === 'Verified' && 
          updated.taxForms === 'Verified' && 
          updated.educationCert === 'Verified';
        updated.status = allVerified ? 'Completed' : 'In Progress';
        return updated;
      });
    }

    showToast('Verification Updated', 'KYC document verification status updated.');
  };

  const handleApproveAll = (docId: number) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          idProof: 'Verified',
          addressProof: 'Verified',
          taxForms: 'Verified',
          educationCert: 'Verified',
          status: 'Completed',
          verifiedBy: 'Compliance Lead (You)'
        };
      }
      return d;
    }));

    if (selectedDoc && selectedDoc.id === docId) {
      setSelectedDoc(prev => prev ? {
        ...prev,
        idProof: 'Verified',
        addressProof: 'Verified',
        taxForms: 'Verified',
        educationCert: 'Verified',
        status: 'Completed',
        verifiedBy: 'Compliance Lead (You)'
      } : null);
    }

    setActiveMenuId(null);
    showToast('All Documents Approved', 'Employee KYC bundle verified successfully.');
  };

  const handleDownloadDocBundle = (d: DocumentRecord) => {
    const summary = `
================================================================================
                    KYC & COMPLIANCE VERIFICATION DOSSIER
                         ANRAONE ENTERPRISES INC.
================================================================================
Employee Code       : ${d.empCode}
Employee Name       : ${d.name}
Role / Designation  : ${d.role}
Department          : ${d.dept}
Submission Date     : ${d.submissionDate}
Verification Status : ${d.status.toUpperCase()}
Verified By         : ${d.verifiedBy || 'Audit Pending'}

--------------------------------------------------------------------------------
VERIFIED DOCUMENT CHECKLIST
--------------------------------------------------------------------------------
• Government Photo ID (Passport/DL)  : [${d.idProof.toUpperCase()}]
• Proof of Address (Utility/Lease)   : [${d.addressProof.toUpperCase()}]
• Federal & State Tax Forms (W-4)    : [${d.taxForms.toUpperCase()}]
• Degree & Academic Certifications   : [${d.educationCert.toUpperCase()}]

Notes: ${d.notes || 'All statutory documentation verified in accordance with corporate audit compliance.'}
`;

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KYC_Dossier_${d.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setActiveMenuId(null);
    showToast('Dossier Downloaded', `Document verification summary generated for ${d.name}`);
  };

  return (
    <div className="space-y-6 mt-6 relative pb-10">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{toastMessage.title}</p>
            <p className="text-xs text-emerald-100">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Document Verification
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                KYC & Tax Auditing
              </span>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">Review, audit, and approve submitted KYC documents and tax filings.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search employee..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 h-9 border-slate-200 text-xs bg-slate-50 focus-visible:ring-indigo-500" 
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2.5 h-9 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">ID Proof</th>
                  <th className="px-6 py-3.5">Address Proof</th>
                  <th className="px-6 py-3.5">Tax Forms</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                      No document records found
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                            {d.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-xs">{d.name}</p>
                            <p className="text-[11px] text-slate-400">{d.empCode} • {d.dept}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          d.idProof === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {d.idProof}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          d.addressProof === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {d.addressProof}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          d.taxForms === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {d.taxForms}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          d.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {d.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right relative">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            onClick={() => setSelectedDoc(d)}
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1 font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Audit</span>
                          </Button>

                          <div className="relative">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setActiveMenuId(activeMenuId === d.id ? null : d.id)}
                              className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 rounded-md"
                            >
                              <MoreHorizontal className="w-4 h-4 text-slate-600"/>
                            </Button>

                            {activeMenuId === d.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1.5 animate-in fade-in zoom-in-95 text-xs text-left">
                                <button
                                  onClick={() => {
                                    setSelectedDoc(d);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                                >
                                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Review KYC Files</span>
                                </button>

                                <button
                                  onClick={() => handleDownloadDocBundle(d)}
                                  className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                                >
                                  <Download className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Download Dossier</span>
                                </button>

                                {d.status !== 'Completed' && (
                                  <button
                                    onClick={() => handleApproveAll(d.id)}
                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-medium border-t border-slate-100"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Approve All KYC</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
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

      {/* MODAL: KYC Document Audit & Verification */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{selectedDoc.name} - KYC Verification</h3>
                  <p className="text-xs text-slate-400">{selectedDoc.empCode} • {selectedDoc.dept}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2.5">
                {[
                  { key: 'idProof', label: 'Government Photo ID (Passport/DL)', val: selectedDoc.idProof },
                  { key: 'addressProof', label: 'Proof of Address (Utility/Lease)', val: selectedDoc.addressProof },
                  { key: 'taxForms', label: 'Federal & State Tax Withholding (W-4)', val: selectedDoc.taxForms },
                  { key: 'educationCert', label: 'Academic & Degree Certificates', val: selectedDoc.educationCert }
                ].map(item => (
                  <div key={item.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{item.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Scanned color PDF uploaded</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleToggleDocItem(selectedDoc.id, item.key as any)}
                        size="sm"
                        variant={item.val === 'Verified' ? 'default' : 'outline'}
                        className={`h-7 px-2.5 text-[11px] font-semibold ${
                          item.val === 'Verified' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'border-slate-300 text-slate-600'
                        }`}
                      >
                        {item.val === 'Verified' ? '✓ Verified' : 'Mark Verified'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedDoc.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-900 block mb-0.5">Auditor Notes:</span>
                  <p className="text-slate-700 leading-relaxed">{selectedDoc.notes}</p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadDocBundle(selectedDoc)}
                className="text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Download Dossier
              </Button>

              <div className="flex gap-2">
                {selectedDoc.status !== 'Completed' && (
                  <Button
                    onClick={() => handleApproveAll(selectedDoc.id)}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    Approve All KYC
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDoc(null)}
                  className="text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
