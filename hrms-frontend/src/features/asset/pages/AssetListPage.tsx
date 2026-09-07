import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  QrCode, 
  ArrowUpDown,
  RefreshCw,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { assetApi } from '../api/assetApi';
import { 
  AssetDto, 
  AssetCategoryDto, 
  AssetLocationDto, 
  AssetFilterParams, 
  PagedResult 
} from '../types/asset';
import { AssetTable } from '../components/AssetTable';
import { AssetBulkToolbar } from '../components/AssetBulkToolbar';
import { AssetDetailModal } from '../components/AssetDetailModal';
import { AssetUpsertModal } from '../components/AssetUpsertModal';
import { AssetAssignModal } from '../components/AssetAssignModal';
import { AssetTransferModal } from '../components/AssetTransferModal';
import { AssetReturnModal } from '../components/AssetReturnModal';
import { AssetMaintenanceModal } from '../components/AssetMaintenanceModal';
import { AssetIncidentModal } from '../components/AssetIncidentModal';
import { AssetDisposalModal } from '../components/AssetDisposalModal';
import { AssetQrModal } from '../components/AssetQrModal';
import { AssetBulkStatusModal } from '../components/AssetBulkStatusModal';

export const AssetListPage: React.FC = () => {
  const [data, setData] = useState<PagedResult<AssetDto>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false
  });
  const [categories, setCategories] = useState<AssetCategoryDto[]>([]);
  const [locations, setLocations] = useState<AssetLocationDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('CreatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Multi-select State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals State
  const [activeAsset, setActiveAsset] = useState<AssetDto | null>(null);
  const [detailAssetId, setDetailAssetId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<
    'upsert' | 'assign' | 'transfer' | 'return' | 'maintenance' | 'incident' | 'dispose' | 'qr' | 'bulkStatus' | null
  >(null);

  const fetchAssets = () => {
    setLoading(true);
    const params: AssetFilterParams = {
      page,
      pageSize: 10,
      search: search.trim() || undefined,
      categoryId: selectedCategory !== 'All' ? selectedCategory : undefined,
      status: statusFilter !== 'All' ? statusFilter : undefined,
      condition: conditionFilter !== 'All' ? conditionFilter : undefined,
      locationId: locationFilter !== 'All' ? locationFilter : undefined,
      sortBy,
      sortDirection
    };

    assetApi.getAssets(params)
      .then(res => {
        setData(res);
      })
      .catch(err => console.error('Failed to load assets', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([
      assetApi.getCategories(),
      assetApi.getLocations()
    ]).then(([cats, locs]) => {
      setCategories(cats);
      setLocations(locs);
    });
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [page, selectedCategory, statusFilter, conditionFilter, locationFilter, sortBy, sortDirection]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAssets();
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data.items.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDelete = async (asset: AssetDto) => {
    if (window.confirm(`Are you sure you want to delete ${asset.assetTag} (${asset.assetName})?`)) {
      try {
        await assetApi.deleteAsset(asset.id);
        fetchAssets();
      } catch (err) {
        alert('Failed to delete asset');
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Asset Inventory Register
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Complete physical hardware database with real-time custody and audit trails
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setActiveAsset(null);
              setModalType('upsert');
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Asset
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => {
            setSelectedCategory('All');
            setPage(1);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'All'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          All Categories ({data.totalCount})
        </button>

        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.name} ({cat.code})
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by tag, name, serial, or custodian..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="UnderMaintenance">In Maintenance</option>
            <option value="Damaged">Damaged</option>
            <option value="Lost">Lost</option>
            <option value="Retired">Retired</option>
            <option value="Disposed">Disposed</option>
          </select>

          {/* Condition Filter */}
          <select
            value={conditionFilter}
            onChange={e => {
              setConditionFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="All">All Conditions</option>
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Damaged">Damaged</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={e => {
              setLocationFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="All">All Locations</option>
            {locations.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setStatusFilter('All');
              setConditionFilter('All');
              setLocationFilter('All');
              setPage(1);
            }}
            title="Reset Filters"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Asset Table */}
      <AssetTable
        assets={data.items}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onViewDetails={(a) => setDetailAssetId(a.id)}
        onAssign={(a) => {
          setActiveAsset(a);
          setModalType('assign');
        }}
        onTransfer={(a) => {
          setActiveAsset(a);
          setModalType('transfer');
        }}
        onMaintenance={(a) => {
          setActiveAsset(a);
          setModalType('maintenance');
        }}
        onIncident={(a) => {
          setActiveAsset(a);
          setModalType('incident');
        }}
        onShowQr={(a) => {
          setActiveAsset(a);
          setModalType('qr');
        }}
        onDelete={handleDelete}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold">{data.items.length}</span> of{' '}
          <span className="font-semibold">{data.totalCount}</span> registered assets
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={!data.hasPrevious}
            onClick={() => setPage(page - 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-semibold px-3 py-1 text-slate-700 dark:text-slate-300">
            Page {data.page} of {data.totalPages || 1}
          </span>

          <button
            disabled={!data.hasNext}
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk Toolbar */}
      <AssetBulkToolbar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onBulkStatus={() => setModalType('bulkStatus')}
        onBulkTransfer={() => {
          // For bulk transfer we can open modal or status
          setModalType('bulkStatus');
        }}
      />

      {/* Modals */}
      {detailAssetId && (
        <AssetDetailModal
          assetId={detailAssetId}
          onClose={() => setDetailAssetId(null)}
          onAssign={() => {
            const current = data.items.find(i => i.id === detailAssetId);
            if (current) {
              setActiveAsset(current);
              setDetailAssetId(null);
              setModalType('assign');
            }
          }}
          onTransfer={() => {
            const current = data.items.find(i => i.id === detailAssetId);
            if (current) {
              setActiveAsset(current);
              setDetailAssetId(null);
              setModalType('transfer');
            }
          }}
          onReturn={() => {
            const current = data.items.find(i => i.id === detailAssetId);
            if (current) {
              setActiveAsset(current);
              setDetailAssetId(null);
              setModalType('return');
            }
          }}
          onMaintenance={() => {
            const current = data.items.find(i => i.id === detailAssetId);
            if (current) {
              setActiveAsset(current);
              setDetailAssetId(null);
              setModalType('maintenance');
            }
          }}
          onIncident={() => {
            const current = data.items.find(i => i.id === detailAssetId);
            if (current) {
              setActiveAsset(current);
              setDetailAssetId(null);
              setModalType('incident');
            }
          }}
          onDispose={() => {
            const current = data.items.find(i => i.id === detailAssetId);
            if (current) {
              setActiveAsset(current);
              setDetailAssetId(null);
              setModalType('dispose');
            }
          }}
        />
      )}

      {modalType === 'upsert' && (
        <AssetUpsertModal
          assetToEdit={activeAsset}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            fetchAssets();
          }}
        />
      )}

      {modalType === 'assign' && activeAsset && (
        <AssetAssignModal
          asset={activeAsset}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            fetchAssets();
          }}
        />
      )}

      {modalType === 'transfer' && activeAsset && (
        <AssetTransferModal
          asset={activeAsset}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            fetchAssets();
          }}
        />
      )}

      {modalType === 'return' && activeAsset && (
        <AssetReturnModal
          asset={activeAsset}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            fetchAssets();
          }}
        />
      )}

      {modalType === 'maintenance' && activeAsset && (
        <AssetMaintenanceModal
          asset={activeAsset}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            fetchAssets();
          }}
        />
      )}

      {modalType === 'incident' && activeAsset && (
        <AssetIncidentModal
          asset={activeAsset}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            fetchAssets();
          }}
        />
      )}

      {modalType === 'dispose' && activeAsset && (
        <AssetDisposalModal
          asset={activeAsset}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            fetchAssets();
          }}
        />
      )}

      {modalType === 'qr' && activeAsset && (
        <AssetQrModal
          asset={activeAsset}
          onClose={() => setModalType(null)}
        />
      )}

      {modalType === 'bulkStatus' && (
        <AssetBulkStatusModal
          selectedAssetIds={selectedIds}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            setSelectedIds([]);
            fetchAssets();
          }}
        />
      )}
    </div>
  );
};
