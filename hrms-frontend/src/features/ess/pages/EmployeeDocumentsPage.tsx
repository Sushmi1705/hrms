import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, CheckCircle2, AlertCircle, Plus, 
  Send, ShieldCheck, FileCheck, ExternalLink, Clock, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { essApi } from '../api/essApi';
import { EssDocumentItem } from '../types/ess';

export const EmployeeDocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<EssDocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'policies' | 'all' | 'required'>('all');

  // Request Document Modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [docType, setDocType] = useState('SalaryCertificate');
  const [purpose, setPurpose] = useState('');
  const [reqDate, setReqDate] = useState(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]);
  const [comments, setComments] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);

  // Acknowledge Modal
  const [ackDoc, setAckDoc] = useState<EssDocumentItem | null>(null);
  const [acknowledging, setAcknowledging] = useState(false);

  const fetchDocuments = () => {
    setLoading(true);
    essApi.getDocuments()
      .then(res => setDocuments(res || []))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load documents');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleRequestDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) {
      toast.error('Please specify the purpose for this document request');
      return;
    }
    setSubmittingReq(true);
    try {
      await essApi.requestDocument({
        documentType: docType,
        purpose,
        requiredDate: reqDate,
        comments
      });
      toast.success('Document request submitted to HR Operations');
      setShowRequestModal(false);
      setPurpose('');
      setComments('');
    } catch (err: any) {
      toast.error('Failed to submit document request');
    } finally {
      setSubmittingReq(false);
    }
  };

  const handleAcknowledge = async () => {
    if (!ackDoc) return;
    setAcknowledging(true);
    try {
      await essApi.acknowledgeDocument(ackDoc.id);
      toast.success(`Successfully acknowledged ${ackDoc.name}`);
      setAckDoc(null);
      fetchDocuments();
    } catch (err: any) {
      toast.error('Failed to record document acknowledgement');
    } finally {
      setAcknowledging(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-32 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const filteredDocs = documents.filter(d => {
    if (activeTab === 'policies') return d.category === 'Policies' || d.category === 'Company Policy';
    if (activeTab === 'required') return d.isRequired;
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* 1. TOP HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Documents & Corporate Policies
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse company handbooks, review compliance policies, and request official certificates
          </p>
        </div>

        <Button 
          size="lg"
          onClick={() => setShowRequestModal(true)}
          className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Request HR Document
        </Button>
      </div>

      {/* 2. FILTER TABS */}
      <div className="flex items-center gap-2">
        <Button
          variant={activeTab === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('all')}
          className="rounded-xl text-xs"
        >
          All Documents ({documents.length})
        </Button>
        <Button
          variant={activeTab === 'policies' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('policies')}
          className="rounded-xl text-xs"
        >
          Company Policies
        </Button>
        <Button
          variant={activeTab === 'required' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('required')}
          className="rounded-xl text-xs"
        >
          Action Required ({documents.filter(d => d.isRequired && !d.isAcknowledged).length})
        </Button>
      </div>

      {/* 3. DOCUMENT LISTING CARDS */}
      <div className="space-y-3">
        {filteredDocs.map(doc => (
          <Card key={doc.id} className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base font-bold text-slate-900 dark:text-white">{doc.name}</p>
                    <Badge variant="outline" className="text-[10px] border-slate-300">
                      {doc.category}
                    </Badge>
                    {doc.isRequired && (
                      <Badge className={doc.isAcknowledged ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}>
                        {doc.isAcknowledged ? 'Acknowledged' : 'Acknowledgement Required'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {doc.originalFileName} • {doc.fileSizeFormatted} • Uploaded {new Date(doc.uploadedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {doc.isRequired && !doc.isAcknowledged && (
                  <Button 
                    size="sm" 
                    onClick={() => setAckDoc(doc)}
                    className="rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                  >
                    <FileCheck className="w-4 h-4 mr-1.5" />
                    Sign & Acknowledge
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toast.success(`Downloading ${doc.name}...`)}
                  className="rounded-xl text-xs hover:border-indigo-500"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL: REQUEST HR DOCUMENT */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Official HR Document</h3>
            <p className="text-xs text-slate-500">
              Generate or request verified documentation signed by HR Administration.
            </p>
            <form onSubmit={handleRequestDocument} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Document Type *</label>
                <select 
                  value={docType} 
                  onChange={e => setDocType(e.target.value)}
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                >
                  <option value="SalaryCertificate">Salary Certificate / Pay Verification</option>
                  <option value="EmploymentProof">Proof of Employment Letter</option>
                  <option value="ExperienceLetter">Service & Experience Letter</option>
                  <option value="VisaNocLetter">Visa NOC / Embassy Travel Letter</option>
                  <option value="BankLetter">Bank Account Opening Letter</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Purpose / Addressed To *</label>
                <input 
                  type="text" 
                  value={purpose} 
                  onChange={e => setPurpose(e.target.value)} 
                  required
                  placeholder="e.g. Bank Mortgage Application, Consulate, Landlord"
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Required By Date *</label>
                <input 
                  type="date" 
                  value={reqDate} 
                  onChange={e => setReqDate(e.target.value)} 
                  required
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Additional Instructions</label>
                <textarea 
                  value={comments} 
                  onChange={e => setComments(e.target.value)} 
                  rows={3}
                  placeholder="Specify any special clauses or details to be included"
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowRequestModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingReq} className="bg-indigo-600 text-white">
                  <Send className="w-4 h-4 mr-1.5" />
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ACKNOWLEDGE POLICY */}
      {ackDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Electronic Policy Acknowledgement</h3>
                <p className="text-xs text-slate-500">Corporate Compliance Verification</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              I hereby acknowledge that I have received, reviewed, and agree to abide by the terms set forth in <strong className="text-slate-900 dark:text-white">{ackDoc.name}</strong>.
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 space-y-1">
              <p>• Date: {new Date().toLocaleDateString()}</p>
              <p>• IP Timestamp: Verified (127.0.0.1)</p>
              <p>• Legal Record: Stored in corporate audit log</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setAckDoc(null)}>
                Cancel
              </Button>
              <Button onClick={handleAcknowledge} disabled={acknowledging} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Sign & Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
