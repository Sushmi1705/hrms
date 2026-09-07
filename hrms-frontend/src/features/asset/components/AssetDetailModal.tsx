import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Clock, 
  UserCheck, 
  Wrench, 
  AlertTriangle, 
  DollarSign, 
  QrCode, 
  ShieldCheck, 
  FileText,
  Calendar,
  Building,
  MapPin,
  Tag,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetDetailDto } from '../types/asset';

interface AssetDetailModalProps {
  assetId: string | null;
  onClose: () => void;
  onAssign?: () => void;
  onTransfer?: () => void;
  onMaintenance?: () => void;
  onReturn?: () => void;
  onIncident?: () => void;
  onDispose?: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  assetId,
  onClose,
  onAssign,
  onTransfer,
  onMaintenance,
  onReturn,
  onIncident,
  onDispose
}) => {
  const [asset, setAsset] = useState<AssetDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'maintenance' | 'incidents' | 'depreciation' | 'qr'>('overview');

  useEffect(() => {
    if (!assetId) return;
    setLoading(true);
    assetApi.getAssetById(assetId)
      .then(data => setAsset(data))
      .catch(err => console.error('Failed to fetch asset detail', err))
      .finally(() => setLoading(false));
  }, [assetId]);

  if (!assetId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {loading ? 'Loading Asset...' : asset?.assetName}
                </h2>
                {asset && (
                  <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {asset.assetTag}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {asset?.manufacturer} • {asset?.modelName || 'General Hardware'} • Category: {asset?.categoryName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex gap-4 overflow-x-auto text-sm font-medium bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Overview & Specs
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'assignments'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Assignments & Transfers ({asset?.assignments?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'maintenance'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Maintenance & Service ({asset?.maintenances?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'incidents'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Incidents ({asset?.incidents?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('depreciation')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'depreciation'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Financial & Depreciation
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'qr'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            QR & Barcode Tag
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4">
              <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              </div>
            </div>
          ) : !asset ? (
            <div className="text-center py-12 text-slate-500">Asset record not found.</div>
          ) : (
            <>
              {/* 1. OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Status & Custodian Banner */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                    <div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Status</span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{asset.status}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                          {asset.condition} Condition
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Custodian</span>
                      <div className="mt-1 font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {asset.currentCustodianName ? (
                          <div className="flex items-center gap-2">
                            <span>{asset.currentCustodianName}</span>
                            <span className="text-xs text-slate-400 font-normal">({asset.departmentName})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic font-normal">Unassigned</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Physical Location</span>
                      <div className="mt-1 font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {asset.locationName || 'HQ Depot'}
                      </div>
                    </div>
                  </div>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Identification</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Asset Tag</span>
                          <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">{asset.assetTag}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Serial Number</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">{asset.serialNumber || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Barcode</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">{asset.barcode || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Manufacturer</span>
                          <span className="text-slate-800 dark:text-slate-200">{asset.manufacturer}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Model Name / Number</span>
                          <span className="text-slate-800 dark:text-slate-200">{asset.modelName || 'Custom Spec'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Procurement & Financial</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Purchase Date</span>
                          <span className="text-slate-800 dark:text-slate-200">{new Date(asset.purchaseDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Purchase Price</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">${asset.purchasePrice?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Current Book Value</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">${asset.currentBookValue?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Vendor</span>
                          <span className="text-slate-800 dark:text-slate-200">{asset.vendorName || 'Direct Order'}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">PO / Invoice #</span>
                          <span className="font-mono text-xs text-slate-800 dark:text-slate-200">
                            {asset.poNumber || 'N/A'} / {asset.invoiceNumber || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description & Notes */}
                  {asset.description && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Description</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{asset.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 2. ASSIGNMENTS TAB */}
              {activeTab === 'assignments' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Assignment History</h4>
                    {asset.status === 'Available' && (
                      <button
                        onClick={onAssign}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Assign To Employee
                      </button>
                    )}
                  </div>

                  {asset.assignments?.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">No assignment history recorded.</div>
                  ) : (
                    <div className="space-y-3">
                      {asset.assignments?.map(asg => (
                        <div key={asg.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                                {asg.employeeName.substring(0, 2)}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{asg.employeeName}</div>
                                <div className="text-xs text-slate-500">{asg.departmentName} • Handover by {asg.assignedBy}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                asg.acknowledgementStatus === 'Acknowledged'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {asg.acknowledgementStatus}
                              </span>
                              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                asg.status === 'Active' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {asg.status}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <div>
                              <span className="text-slate-400 block">Assigned Date</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {new Date(asg.assignedDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Condition</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">{asg.conditionAtHandover}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Accessories</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {asg.accessories?.length || 0} items
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Digital Signature</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {asg.digitalSignature ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. MAINTENANCE TAB */}
              {activeTab === 'maintenance' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Maintenance & Service Log</h4>
                    <button
                      onClick={onMaintenance}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Schedule Maintenance
                    </button>
                  </div>

                  {asset.maintenances?.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">No maintenance records recorded.</div>
                  ) : (
                    <div className="space-y-3">
                      {asset.maintenances?.map(m => (
                        <div key={m.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-mono text-xs text-indigo-600 font-semibold">{m.maintenanceNumber}</div>
                              <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{m.issue}</h5>
                            </div>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              m.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {m.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{m.workPerformed || m.diagnosis || 'Diagnostic inspection in progress'}</p>
                          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <span>Provider: {m.serviceProvider} • Tech: {m.technicianName}</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              Cost: ${m.cost} {m.warrantyCovered && '(Warranty Covered)'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. INCIDENTS TAB */}
              {activeTab === 'incidents' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Reported Incidents</h4>
                    <button
                      onClick={onIncident}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
                    >
                      Report Incident
                    </button>
                  </div>

                  {asset.incidents?.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">No incidents or damage reported for this asset.</div>
                  ) : (
                    <div className="space-y-3">
                      {asset.incidents?.map(inc => (
                        <div key={inc.id} className="p-4 rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                              {inc.incidentType} - Severity: {inc.severity}
                            </div>
                            <span className="font-mono text-xs text-slate-500">{inc.incidentNumber}</span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{inc.description}</p>
                          {inc.resolution && (
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-medium">
                              Resolution: {inc.resolution}
                            </p>
                          )}
                          <div className="mt-2 text-xs text-slate-400">
                            Estimated Loss: ${inc.estimatedLoss} • Reported {new Date(inc.reportedDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. DEPRECIATION TAB */}
              {activeTab === 'depreciation' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                    <div>
                      <span className="text-xs text-slate-400">Purchase Price</span>
                      <div className="text-base font-bold text-slate-900 dark:text-slate-100">${asset.purchasePrice?.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Current Book Value</span>
                      <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">${asset.currentBookValue?.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Useful Life / Method</span>
                      <div className="text-base font-bold text-slate-900 dark:text-slate-100">{asset.usefulLifeMonths} Months • {asset.depreciationMethod}</div>
                    </div>
                  </div>

                  <h5 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Projected Depreciation Schedule</h5>
                  <div className="overflow-x-auto max-h-60 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold sticky top-0">
                        <tr>
                          <th className="p-2.5">Month</th>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">Beginning Value</th>
                          <th className="p-2.5">Depreciation</th>
                          <th className="p-2.5">Ending Book Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {asset.depreciationSchedule?.map(pt => (
                          <tr key={pt.periodMonth} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="p-2.5 font-medium">Month {pt.periodMonth}</td>
                            <td className="p-2.5 text-slate-500">{pt.periodDate}</td>
                            <td className="p-2.5">${pt.beginningBookValue?.toLocaleString()}</td>
                            <td className="p-2.5 text-rose-600">-${pt.depreciationAmount?.toLocaleString()}</td>
                            <td className="p-2.5 font-semibold text-emerald-600">${pt.endingBookValue?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 6. QR CODE & BARCODE TAB */}
              {activeTab === 'qr' && (
                <div className="space-y-6 text-center py-4">
                  <div className="p-6 max-w-sm mx-auto rounded-2xl bg-white border-2 border-dashed border-slate-300 dark:border-slate-700 shadow-sm space-y-4">
                    <div className="text-center font-bold text-slate-900 text-lg tracking-tight">
                      ENTERPRISE ASSET TAG
                    </div>
                    {/* SVG QR Code Simulation */}
                    <div className="w-48 h-48 mx-auto bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=http://localhost:5174/admin/assets?search=${asset.assetTag}`}
                        alt="Asset QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="font-mono text-xl font-black text-slate-900 tracking-wider">
                      {asset.assetTag}
                    </div>
                    <div className="text-xs text-slate-500">
                      {asset.assetName} • S/N: {asset.serialNumber}
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Print Physical Asset Label
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {asset?.status === 'Assigned' && (
              <button
                onClick={onReturn}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
              >
                Intake Return
              </button>
            )}
            {asset?.status === 'Assigned' && (
              <button
                onClick={onTransfer}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
              >
                Transfer Custody
              </button>
            )}
            {asset?.status !== 'Disposed' && (
              <button
                onClick={onDispose}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50"
              >
                Decommission / Dispose
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
