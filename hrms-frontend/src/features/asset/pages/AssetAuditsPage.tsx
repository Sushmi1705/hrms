import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  QrCode, 
  Scan, 
  Search, 
  Plus, 
  Calendar,
  Building,
  Check,
  X
} from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetAuditDto, AssetAuditItemDto } from '../types/asset';

export const AssetAuditsPage: React.FC = () => {
  const [audits, setAudits] = useState<AssetAuditDto[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<AssetAuditDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifyingItemId, setVerifyingItemId] = useState<string | null>(null);
  const [scanQuery, setScanQuery] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'Verified' | 'Missing' | 'Discrepancy' | 'Damaged'>('Verified');
  const [discrepancyNotes, setDiscrepancyNotes] = useState('');

  const fetchAudits = () => {
    setLoading(true);
    assetApi.getAudits()
      .then(data => {
        setAudits(data);
        if (data.length > 0 && !selectedAudit) {
          setSelectedAudit(data[0]);
        } else if (selectedAudit) {
          const updated = data.find(a => a.id === selectedAudit.id);
          if (updated) setSelectedAudit(updated);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleVerifyItem = async (item: AssetAuditItemDto) => {
    try {
      await assetApi.verifyAuditItem(item.id, {
        status: verificationStatus,
        actualCondition: item.expectedCondition,
        discrepancyNotes: discrepancyNotes || undefined,
        scannedViaQr: true
      });
      setVerifyingItemId(null);
      setDiscrepancyNotes('');
      fetchAudits();
    } catch (err) {
      alert('Failed to verify audit item');
    }
  };

  // Quick scan simulation: when user enters Asset Tag or scans barcode
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAudit || !scanQuery.trim()) return;
    const found = selectedAudit.items.find(
      i => i.assetTag.toLowerCase() === scanQuery.trim().toLowerCase()
    );
    if (found) {
      setVerifyingItemId(found.id);
      setScanQuery('');
    } else {
      alert(`Asset Tag "${scanQuery}" was not found in this audit campaign scope.`);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Physical Asset Audits & QR Verification
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Periodic physical stocktaking, QR barcode scanning, and inventory discrepancy reconciliation
          </p>
        </div>
      </div>

      {/* Audits Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {audits.map(audit => {
          const isSelected = selectedAudit?.id === audit.id;
          const completionRate = audit.totalAssetsCount > 0
            ? Math.round((audit.verifiedCount / audit.totalAssetsCount) * 100)
            : 0;

          return (
            <div
              key={audit.id}
              onClick={() => setSelectedAudit(audit)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 dark:border-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {audit.auditCode}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  audit.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                }`}>
                  {audit.status}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2">
                {audit.name}
              </h4>
              
              <div className="text-xs text-slate-500 mt-1">
                {audit.locationName || 'HQ IT Depot'} • Auditor: {audit.assignedAuditorName || 'Lead Auditor'}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Verified: </span>
                  <span className="font-bold text-emerald-600">{audit.verifiedCount}</span> / {audit.totalAssetsCount}
                </div>
                <div className="font-bold text-indigo-600">{completionRate}% Done</div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Audit Execution Section */}
      {selectedAudit && (
        <div className="space-y-6">
          {/* Quick Scanner Simulator Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">QR / Barcode Audit Gun Scanner</h3>
                <p className="text-xs text-slate-400">Scan physical asset label or enter Asset Tag to verify live</p>
              </div>
            </div>

            <form onSubmit={handleScanSubmit} className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                value={scanQuery}
                onChange={e => setScanQuery(e.target.value)}
                placeholder="Scan or enter AST-2026-XXXXX..."
                className="px-3 py-1.5 text-xs font-mono rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
              />
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shrink-0"
              >
                Scan Tag
              </button>
            </form>
          </div>

          {/* Audit Verification Items Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Audit Reconciliation Register ({selectedAudit.items.length} Items)
                </h3>
                <p className="text-xs text-slate-500">
                  Physical stock check against expected system records
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> {selectedAudit.verifiedCount} Verified
                </span>
                <span className="flex items-center gap-1 text-rose-600 font-semibold">
                  <XCircle className="w-4 h-4" /> {selectedAudit.missingCount} Missing
                </span>
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <AlertTriangle className="w-4 h-4" /> {selectedAudit.discrepancyCount} Discrepant
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs uppercase text-slate-500">
                    <th className="p-4">Asset Tag</th>
                    <th className="p-4">Asset Name</th>
                    <th className="p-4">Expected Location</th>
                    <th className="p-4">Expected Custodian</th>
                    <th className="p-4">Condition</th>
                    <th className="p-4">Verification Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {selectedAudit.items.map(item => {
                    const isVerifying = verifyingItemId === item.id;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-4 font-mono font-semibold text-indigo-600">
                          {item.assetTag}
                        </td>
                        <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                          {item.assetName}
                        </td>
                        <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                          {item.expectedLocationName}
                        </td>
                        <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                          {item.expectedCustodianName || 'Unassigned (Depot)'}
                        </td>
                        <td className="p-4 text-xs">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                            {item.expectedCondition}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            item.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.status === 'Missing'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : item.status === 'Discrepancy'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {isVerifying ? (
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={verificationStatus}
                                onChange={e => setVerificationStatus(e.target.value as any)}
                                className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                              >
                                <option value="Verified">Verified OK</option>
                                <option value="Missing">Missing</option>
                                <option value="Discrepancy">Discrepancy</option>
                                <option value="Damaged">Damaged</option>
                              </select>
                              <button
                                onClick={() => handleVerifyItem(item)}
                                className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                title="Confirm Verification"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setVerifyingItemId(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setVerifyingItemId(item.id)}
                              className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                            >
                              Verify Scan
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
