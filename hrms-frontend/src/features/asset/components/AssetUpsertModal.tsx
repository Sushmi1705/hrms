import React, { useState, useEffect } from 'react';
import { X, Package, Save } from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { AssetDto, AssetCategoryDto, AssetModelDto, AssetLocationDto, AssetVendorDto } from '../types/asset';

interface AssetUpsertModalProps {
  assetToEdit?: AssetDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssetUpsertModal: React.FC<AssetUpsertModalProps> = ({ assetToEdit, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<AssetCategoryDto[]>([]);
  const [models, setModels] = useState<AssetModelDto[]>([]);
  const [locations, setLocations] = useState<AssetLocationDto[]>([]);
  const [vendors, setVendors] = useState<AssetVendorDto[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    assetTag: '',
    assetName: '',
    categoryId: '',
    modelId: '',
    manufacturer: '',
    serialNumber: '',
    barcode: '',
    description: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: 1200,
    currency: 'USD',
    vendorId: '',
    invoiceNumber: '',
    poNumber: '',
    warrantyStartDate: new Date().toISOString().split('T')[0],
    warrantyEndDate: new Date(Date.now() + 365 * 24 * 3600 * 1000 * 3).toISOString().split('T')[0],
    status: 'Available',
    condition: 'New',
    locationId: '',
    departmentId: '',
    usefulLifeMonths: 36,
    depreciationMethod: 'StraightLine',
    salvageValue: 120,
    notes: ''
  });

  useEffect(() => {
    Promise.all([
      assetApi.getCategories(),
      assetApi.getModels(),
      assetApi.getLocations(),
      assetApi.getVendors()
    ]).then(([cats, mods, locs, vnds]) => {
      setCategories(cats);
      setModels(mods);
      setLocations(locs);
      setVendors(vnds);

      if (assetToEdit) {
        setFormData({
          assetTag: assetToEdit.assetTag,
          assetName: assetToEdit.assetName,
          categoryId: assetToEdit.categoryId,
          modelId: assetToEdit.modelId || '',
          manufacturer: assetToEdit.manufacturer,
          serialNumber: assetToEdit.serialNumber,
          barcode: assetToEdit.barcode,
          description: assetToEdit.description || '',
          purchaseDate: assetToEdit.purchaseDate?.split('T')[0] || '',
          purchasePrice: assetToEdit.purchasePrice,
          currency: assetToEdit.currency || 'USD',
          vendorId: assetToEdit.vendorId || '',
          invoiceNumber: assetToEdit.invoiceNumber || '',
          poNumber: assetToEdit.poNumber || '',
          warrantyStartDate: assetToEdit.warrantyStartDate?.split('T')[0] || '',
          warrantyEndDate: assetToEdit.warrantyEndDate?.split('T')[0] || '',
          status: assetToEdit.status,
          condition: assetToEdit.condition,
          locationId: assetToEdit.locationId || '',
          departmentId: assetToEdit.departmentId || '',
          usefulLifeMonths: assetToEdit.usefulLifeMonths,
          depreciationMethod: assetToEdit.depreciationMethod,
          salvageValue: assetToEdit.salvageValue,
          notes: assetToEdit.notes || ''
        });
      } else if (cats.length > 0) {
        setFormData(prev => ({
          ...prev,
          categoryId: cats[0].id,
          locationId: locs[0]?.id || '',
          vendorId: vnds[0]?.id || ''
        }));
      }
    });
  }, [assetToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.assetName || !formData.categoryId) {
      setError('Please provide an asset name and category.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (assetToEdit) {
        await assetApi.updateAsset(assetToEdit.id, formData);
      } else {
        await assetApi.createAsset(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save asset. Check inputs.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {assetToEdit ? 'Edit Asset Record' : 'Register New Enterprise Asset'}
              </h2>
              <p className="text-xs text-slate-500">Affix barcode and configure depreciation rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Asset Name *
              </label>
              <input
                type="text"
                required
                value={formData.assetName}
                onChange={e => setFormData({ ...formData, assetName: e.target.value })}
                placeholder="e.g. MacBook Pro 16 M3 Max"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Asset Tag (Leave blank for auto-generation)
              </label>
              <input
                type="text"
                value={formData.assetTag}
                onChange={e => setFormData({ ...formData, assetTag: e.target.value })}
                placeholder="AST-2026-XXXXX"
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Manufacturer / Brand
              </label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="Apple, Dell, Lenovo..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Serial Number
              </label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="e.g. C02G4120MD6R"
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location Depot
              </label>
              <select
                value={formData.locationId}
                onChange={e => setFormData({ ...formData, locationId: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="">Unassigned Location</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name} - {l.building}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Purchase Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.purchasePrice}
                onChange={e => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Purchase Date
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Useful Life (Months)
              </label>
              <input
                type="number"
                value={formData.usefulLifeMonths}
                onChange={e => setFormData({ ...formData, usefulLifeMonths: parseInt(e.target.value) || 36 })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Warranty Expiry Date
              </label>
              <input
                type="date"
                value={formData.warrantyEndDate}
                onChange={e => setFormData({ ...formData, warrantyEndDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vendor
              </label>
              <select
                value={formData.vendorId}
                onChange={e => setFormData({ ...formData, vendorId: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="">Direct Procurement</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.vendorName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={e => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description & Specifications
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Processor, memory, accessories, and security software configuration notes..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : assetToEdit ? 'Save Changes' : 'Register Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
