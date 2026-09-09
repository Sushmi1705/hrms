import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Award, Download, Check, ShieldCheck, 
  ExternalLink, Calendar, RefreshCw, X, UserCheck
} from 'lucide-react';

export interface CertificationRecord {
  id: number;
  certId: string;
  name: string;
  email: string;
  dept: string;
  cert: string;
  issuer: string;
  issue: string;
  exp: string;
  status: 'Certified' | 'Expiring Soon' | 'Expired';
  score?: string;
  verificationUrl: string;
}

const INITIAL_CERTIFICATIONS: CertificationRecord[] = [
  {
    id: 1,
    certId: 'AWS-PSA-882910',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@company.com',
    dept: 'Cloud Infrastructure',
    cert: 'AWS Certified Solutions Architect - Professional',
    issuer: 'Amazon Web Services (AWS)',
    issue: '2025-01-15',
    exp: '2028-01-15',
    status: 'Certified',
    score: '912 / 1000',
    verificationUrl: 'https://aws.amazon.com/verification/AWS-PSA-882910'
  },
  {
    id: 2,
    certId: 'CPR-FA-202305',
    name: 'David Lee',
    email: 'david.lee@company.com',
    dept: 'Facilities & Workplace',
    cert: 'First Aid & CPR / AED First Responder',
    issuer: 'American Red Cross',
    issue: '2023-05-10',
    exp: '2025-05-10',
    status: 'Expired',
    score: '100% Practical',
    verificationUrl: 'https://redcross.org/cert/CPR-FA-202305'
  },
  {
    id: 3,
    certId: 'CISSP-SEC-9931',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    dept: 'Cybersecurity & Trust',
    cert: 'CISSP - Certified Information Systems Security Pro',
    issuer: '(ISC)²',
    issue: '2023-11-20',
    exp: '2026-11-20',
    status: 'Expiring Soon',
    score: 'Passed',
    verificationUrl: 'https://isc2.org/member/CISSP-SEC-9931'
  },
  {
    id: 4,
    certId: 'SCRUM-CSM-4412',
    name: 'Jessica Taylor',
    email: 'jessica.taylor@company.com',
    dept: 'Product & Agile Operations',
    cert: 'Certified ScrumMaster (CSM)',
    issuer: 'Scrum Alliance',
    issue: '2024-04-12',
    exp: '2026-04-12',
    status: 'Expiring Soon',
    score: '96%',
    verificationUrl: 'https://scrumalliance.org/verify/SCRUM-CSM-4412'
  },
  {
    id: 5,
    certId: 'K8S-CKA-7718',
    name: 'Alex Rivera',
    email: 'alex.rivera@company.com',
    dept: 'DevOps & Reliability',
    cert: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Linux Foundation / CNCF',
    issue: '2025-06-18',
    exp: '2028-06-18',
    status: 'Certified',
    score: '88%',
    verificationUrl: 'https://cncf.io/cert/K8S-CKA-7718'
  }
];

export function Certifications() {
  const [certs, setCerts] = useState<CertificationRecord[]>(INITIAL_CERTIFICATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Certified' | 'Expiring Soon' | 'Expired'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificationRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredCerts = useMemo(() => {
    return certs.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cert.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.certId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [certs, searchTerm, statusFilter]);

  const handleRenewCert = (id: number) => {
    setCerts(prev => prev.map(c => {
      if (c.id !== id) return c;
      const today = new Date().toISOString().split('T')[0];
      const expiry = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return { ...c, status: 'Certified', issue: today, exp: expiry };
    }));
    setActiveDropdown(null);
    if (selectedCert && selectedCert.id === id) {
      setSelectedCert(prev => prev ? {
        ...prev,
        status: 'Certified',
        issue: new Date().toISOString().split('T')[0],
        exp: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      } : null);
    }
    showToast('Certificate successfully renewed & re-certified for 3 years!');
  };

  const handleDownloadCert = (rec: CertificationRecord) => {
    const content = `===============================================================
              OFFICIAL CERTIFICATE CREDENTIAL RECORD
===============================================================
Credential ID : ${rec.certId}
Employee Name : ${rec.name}
Email Address : ${rec.email}
Department    : ${rec.dept}

Certification : ${rec.cert}
Issuing Body  : ${rec.issuer}
Issued Date   : ${rec.issue}
Expiry Date   : ${rec.exp}
Current Status: ${rec.status.toUpperCase()}
Score/Grade   : ${rec.score || 'Passing'}
Verify URL    : ${rec.verificationUrl}

---------------------------------------------------------------
Security Seal : SHA256-AUTHENTICATED-HRMS-LMS-2026
Verified by   : Enterprise L&D Regulatory Governance Board
Timestamp     : ${new Date().toISOString()}
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificate-${rec.name.replace(/\s+/g, '_')}-${rec.certId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded credential certificate for ${rec.name}!`);
    setActiveDropdown(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Total Issued</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{certs.length}</h3>
              <p className="text-xs text-slate-500 mt-1">Active Credentials</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Award className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Fully Certified</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {certs.filter(c => c.status === 'Certified').length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Valid credentials</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-amber-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">Expiring Soon</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {certs.filter(c => c.status === 'Expiring Soon').length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Within 90 days</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-rose-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-rose-600 uppercase tracking-wider">Expired</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {certs.filter(c => c.status === 'Expired').length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Requires renewal</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Employee Certifications
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">Track issued professional credentials, verification URLs, and renewal deadlines</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search staff, cert, ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 w-64 h-9" 
              />
            </div>
            
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {(['All', 'Certified', 'Expiring Soon', 'Expired'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    statusFilter === filter 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const csvHeader = 'Employee Name,Email,Department,Certificate,Issuer,Issue Date,Expiry Date,Status\n';
                const csvRows = certs.map(c => `"${c.name}","${c.email}","${c.dept}","${c.cert}","${c.issuer}","${c.issue}","${c.exp}","${c.status}"`).join('\n');
                const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `HRMS-Certifications-Register-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                showToast('Exported certifications register to CSV!');
              }}
              className="flex items-center gap-2 text-slate-700 h-9"
            >
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[260px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Employee Name</th>
                  <th className="px-6 py-3">Certificate</th>
                  <th className="px-6 py-3">Issue Date</th>
                  <th className="px-6 py-3">Expiry Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Award className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-sm font-medium">No certifications match your search filter</p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                          className="text-indigo-600 mt-1"
                        >
                          Clear filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCerts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs shrink-0">
                            {item.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 leading-tight">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.dept}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-slate-800 truncate" title={item.cert}>{item.cert}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500">{item.issuer}</span>
                            <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-1 rounded">{item.certId}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {item.issue}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className={item.status === 'Expired' ? 'text-red-600 font-medium' : item.status === 'Expiring Soon' ? 'text-amber-600 font-medium' : ''}>
                            {item.exp}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.status === 'Certified' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1"/> Certified
                          </span>
                        ) : item.status === 'Expiring Soon' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 mr-1"/> Expiring Soon
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                            <AlertCircle className="w-3 h-3 mr-1"/> Expired
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 relative">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedCert(item)}
                            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 h-8 text-xs font-medium flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verify
                          </Button>

                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>

                          {/* Dropdown Menu */}
                          {activeDropdown === item.id && (
                            <div 
                              className="absolute right-0 top-9 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-30 text-left animate-in fade-in zoom-in-95 duration-150"
                              onMouseLeave={() => setActiveDropdown(null)}
                            >
                              <button
                                onClick={() => {
                                  setSelectedCert(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                                Inspect Credential
                              </button>

                              <button
                                onClick={() => handleDownloadCert(item)}
                                className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Certificate
                              </button>

                              <div className="border-t border-slate-100 my-1"></div>

                              <button
                                onClick={() => handleRenewCert(item.id)}
                                className="w-full px-4 py-2 text-xs text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 font-medium"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                                Re-certify / Renew
                              </button>
                            </div>
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
            <div>Showing {filteredCerts.length} of {certs.length} entries</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled={filteredCerts.length <= 5}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Verification Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-900 to-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-300">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Credential Verification</h3>
                  <p className="text-xs text-indigo-200">Official HRMS Verified Certification</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCert(null)}
                className="text-indigo-200 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-600">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">CREDENTIAL BADGE</span>
                  <h4 className="text-base font-bold text-slate-900">{selectedCert.cert}</h4>
                  <p className="text-xs text-indigo-600 font-medium mt-0.5">{selectedCert.issuer}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    selectedCert.status === 'Certified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedCert.status === 'Expiring Soon'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedCert.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block font-medium">Candidate</span>
                  <span className="text-slate-800 font-semibold text-sm">{selectedCert.name}</span>
                  <span className="text-slate-500 block">{selectedCert.dept}</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block font-medium">Credential ID</span>
                  <span className="text-indigo-700 font-mono font-semibold text-sm">{selectedCert.certId}</span>
                  <span className="text-slate-500 block">Grade: {selectedCert.score}</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block font-medium">Issue Date</span>
                  <span className="text-slate-800 font-semibold">{selectedCert.issue}</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block font-medium">Expiry Date</span>
                  <span className={`font-semibold ${selectedCert.status === 'Expired' ? 'text-rose-600' : 'text-slate-800'}`}>
                    {selectedCert.exp}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-indigo-900 font-medium">Public Verification Registry:</span>
                </div>
                <a 
                  href={selectedCert.verificationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 hover:underline font-mono inline-flex items-center gap-1"
                >
                  Verify Online <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadCert(selectedCert)}
                className="flex items-center gap-2 text-slate-700"
              >
                <Download className="w-4 h-4" /> Download Credential
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleRenewCert(selectedCert.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-certify for 3 Yrs
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedCert(null)}
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
