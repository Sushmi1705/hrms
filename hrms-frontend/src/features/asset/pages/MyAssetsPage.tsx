import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  AlertOctagon, 
  Plus, 
  QrCode,
  ShieldCheck,
  PackageCheck,
  ChevronRight,
  Package
} from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetDto, AssetCategoryDto } from '../types/asset';
import { DigitalHandoverModal } from '../components/DigitalHandoverModal';
import { AssetIncidentModal } from '../components/AssetIncidentModal';
import { AssetQrModal } from '../components/AssetQrModal';

export const MyAssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<AssetDto[]>([]);
  const [categories, setCategories] = useState<AssetCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [acknowledgingAsset, setAcknowledgingAsset] = useState<AssetDto | null>(null);
  const [incidentAsset, setIncidentAsset] = useState<AssetDto | null>(null);
  const [qrAsset, setQrAsset] = useState<AssetDto | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // New Request Form
  const [reqCategoryId, setReqCategoryId] = useState('');
  const [reqReason, setReqReason] = useState('');
  const [reqPriority, setReqPriority] = useState('Normal');
  const [reqDate, setReqDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [requesting, setRequesting] = useState(false);

  const fetchMyAssets = () => {
    setLoading(true);
    assetApi.getMyAssets()
      .then(data => setAssets(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyAssets();
    assetApi.getCategories().then(cats => {
      setCategories(cats);
      if (cats.length > 0) setReqCategoryId(cats[0].id);
    });
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqCategoryId || !reqReason.trim()) return;

    setRequesting(true);
    try {
      await assetApi.createAssetRequest({
        categoryId: reqCategoryId,
        quantity: 1,
        reason: reqReason,
        requiredDate: reqDate,
        priority: reqPriority
      });
      setShowRequestModal(false);
      setReqReason('');
      alert('Hardware requisition submitted for manager approval!');
    } catch (err) {
      alert('Failed to submit hardware request.');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            My Assigned Hardware & Assets
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Self-service equipment register, digital handovers, and requisition requests
          </p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Request New Equipment
        </button>
      </div>

      {/* Asset Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Hardware Assigned</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            You currently have no physical devices or hardware assigned under your employee profile.
          </p>
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          >
            Request Workstation Kit
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {assets.map(asset => (
            <div 
              key={asset.id} 
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center shrink-0">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {asset.assetName}
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                      {asset.assetTag}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold border border-emerald-200">
                      {asset.condition} Condition
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    {asset.manufacturer} • {asset.modelName} • S/N: {asset.serialNumber}
                  </div>

                  <div className="mt-2 text-xs text-slate-400">
                    Location: {asset.locationName} • Registered: {new Date(asset.purchaseDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setAcknowledgingAsset(asset)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  Sign Handover
                </button>

                <button
                  onClick={() => setIncidentAsset(asset)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 transition-colors"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Report Issue
                </button>

                <button
                  onClick={() => setQrAsset(asset)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                  title="View QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Equipment Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Request Workstation Hardware
              </h3>
              <button onClick={() => setShowRequestModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                ×
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Equipment Category *
                </label>
                <select
                  value={reqCategoryId}
                  onChange={e => setReqCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={reqPriority}
                    onChange={e => setReqPriority(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Required By
                  </label>
                  <input
                    type="date"
                    value={reqDate}
                    onChange={e => setReqDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Business Justification *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reqReason}
                  onChange={e => setReqReason(e.target.value)}
                  placeholder="e.g. Current laptop thermal throttling during compilation; requesting upgrade per project requirements."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requesting}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-50"
                >
                  {requesting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      {acknowledgingAsset && (
        <DigitalHandoverModal
          asset={acknowledgingAsset}
          onClose={() => setAcknowledgingAsset(null)}
          onSuccess={() => {
            setAcknowledgingAsset(null);
            fetchMyAssets();
            alert('Hardware handover acknowledged successfully!');
          }}
        />
      )}

      {incidentAsset && (
        <AssetIncidentModal
          asset={incidentAsset}
          onClose={() => setIncidentAsset(null)}
          onSuccess={() => {
            setIncidentAsset(null);
            fetchMyAssets();
            alert('Incident report submitted to IT Operations.');
          }}
        />
      )}

      {qrAsset && (
        <AssetQrModal
          asset={qrAsset}
          onClose={() => setQrAsset(null)}
        />
      )}
    </div>
  );
};
