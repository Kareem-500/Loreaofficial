import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  MoreVertical,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Archive,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { formatPrice } from '../../../utils/currency';

interface ProductsSectionProps {
  products: any[];
  categories: any[];
  collections: any[];
  onOpenAddModal: () => void;
  onViewProduct: (product: any) => void;
  onEditProduct: (product: any) => void;
  onDuplicateProduct: (product: any) => void;
  onDeleteProduct: (product: any) => void;
  onStatusChange: (product: any, newStatus: 'active' | 'draft' | 'archived') => void;
  onBulkAction: (action: string, selectedIds: string[], payload?: any) => Promise<void>;
  isLoading: boolean;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products = [],
  categories = [],
  collections = [],
  onOpenAddModal,
  onViewProduct,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  onStatusChange,
  onBulkAction,
  isLoading,
}) => {
  // Local filters and sorting
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' | 'name-asc'>('newest');

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search filter
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesNameAr = (p.name_ar || '').includes(q);
        const matchesSku = (p.sku || '').toLowerCase().includes(q);
        const matchesCat = (p.category_name || p.category || '').toLowerCase().includes(q);
        const matchesCol = (p.collection || '').toLowerCase().includes(q);
        if (!matchesName && !matchesNameAr && !matchesSku && !matchesCat && !matchesCol) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        const catId = p.category_id || p.categoryId;
        if (catId !== selectedCategory) return false;
      }

      // 3. Collection filter
      if (selectedCollection !== 'all') {
        if (p.collection !== selectedCollection) return false;
      }

      // 4. Status filter
      if (selectedStatus !== 'all') {
        if ((p.status || 'active') !== selectedStatus) return false;
      }

      // 5. Stock Status filter
      if (selectedStockStatus !== 'all') {
        const stock = p.total_stock !== undefined ? p.total_stock : 10;
        if (selectedStockStatus === 'in_stock' && stock <= 5) return false;
        if (selectedStockStatus === 'low_stock' && (stock > 5 || stock === 0)) return false;
        if (selectedStockStatus === 'out_of_stock' && stock > 0) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return (new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      if (sortBy === 'oldest') return (new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
      if (sortBy === 'price-asc') return (a.price_egp || a.priceEgp || 0) - (b.price_egp || b.priceEgp || 0);
      if (sortBy === 'price-desc') return (b.price_egp || b.priceEgp || 0) - (a.price_egp || a.priceEgp || 0);
      if (sortBy === 'stock-asc') return (a.total_stock || 0) - (b.total_stock || 0);
      if (sortBy === 'stock-desc') return (b.total_stock || 0) - (a.total_stock || 0);
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });
  }, [products, search, selectedCategory, selectedCollection, selectedStatus, selectedStockStatus, sortBy]);

  // Bulk selection helpers
  const isAllSelected = filteredProducts.length > 0 && selectedIds.length === filteredProducts.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const executeBulk = async (action: string, payload?: any) => {
    if (selectedIds.length === 0) return;
    try {
      setIsBulkProcessing(true);
      await onBulkAction(action, selectedIds, payload);
      setSelectedIds([]);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1D1D1B]">
            Product Catalog Master
          </h2>
          <p className="text-xs text-[#7C746B] font-light mt-0.5">
            Total of {products.length} master pieces registered in the LORÉA Cairo atelier.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-5 py-2.5 bg-[#1D1D1B] hover:bg-[#BA945A] text-white text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer rounded-xs shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-[#EAE5DE] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-[#7C746B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product title, SKU, category..."
              className="w-full bg-[#FAF8F5] border border-[#D4CCC2] text-xs text-[#1D1D1B] pl-9 pr-3 py-2 focus:border-[#BA945A] focus:outline-hidden"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D4CCC2] text-xs text-[#1D1D1B] px-3 py-2 focus:border-[#BA945A] focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D4CCC2] text-xs text-[#1D1D1B] px-3 py-2 focus:border-[#BA945A] focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="draft">Drafts Only</option>
              <option value="archived">Archived Only</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#FAF8F5] border border-[#D4CCC2] text-xs text-[#1D1D1B] px-3 py-2 focus:border-[#BA945A] focus:outline-hidden font-medium"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-asc">Stock: Lowest First</option>
              <option value="stock-desc">Stock: Highest First</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating Bulk Actions Bar when items are selected */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-[#1D1D1B] text-white flex flex-wrap items-center justify-between gap-3 shadow-lg rounded-xs animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#BA945A] text-white rounded-xs">
              {selectedIds.length} Selected
            </span>
            <span className="text-xs text-[#D4CCC2] hidden sm:inline">
              Choose a bulk commercial action:
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={isBulkProcessing}
              onClick={() => executeBulk('publish')}
              className="px-3 py-1 bg-white/10 hover:bg-emerald-700 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer rounded-xs"
            >
              Publish
            </button>
            <button
              type="button"
              disabled={isBulkProcessing}
              onClick={() => executeBulk('unpublish')}
              className="px-3 py-1 bg-white/10 hover:bg-amber-700 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer rounded-xs"
            >
              Draft
            </button>
            <button
              type="button"
              disabled={isBulkProcessing}
              onClick={() => executeBulk('archive')}
              className="px-3 py-1 bg-white/10 hover:bg-gray-700 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer rounded-xs"
            >
              Archive
            </button>
            <button
              type="button"
              disabled={isBulkProcessing}
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete/archive these ${selectedIds.length} selected products?`)) {
                  executeBulk('delete');
                }
              }}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer rounded-xs"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-[#7C746B] hover:text-white px-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Products Table Container */}
      <div className="bg-white border border-[#EAE5DE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] text-[#7C746B] font-mono text-[10px] uppercase tracking-wider select-none">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 text-[#BA945A] rounded-xs border-[#D4CCC2] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Silhouette</th>
                <th className="py-3 px-4">Master SKU</th>
                <th className="py-3 px-4">Category & Collection</th>
                <th className="py-3 px-4">Retail Price</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE5DE]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#7C746B] font-light">
                    No matching products found. Try changing your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const img = p.primary_image || p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
                  const isSelected = selectedIds.includes(p.id);
                  const stock = p.total_stock !== undefined ? p.total_stock : 15;
                  const isMenuOpen = activeMenuId === p.id;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-[#FAF8F5]/80 transition-colors ${
                        isSelected ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(p.id)}
                          className="w-3.5 h-3.5 text-[#BA945A] rounded-xs border-[#D4CCC2] cursor-pointer"
                        />
                      </td>

                      {/* Product Thumbnail & Names */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={img}
                            alt=""
                            onClick={() => onViewProduct(p)}
                            className="w-10 h-14 object-cover bg-[#EAE5DE] shrink-0 border border-[#EAE5DE] cursor-pointer hover:opacity-90"
                          />
                          <div className="min-w-0">
                            <h4
                              onClick={() => onViewProduct(p)}
                              className="font-serif text-sm font-medium text-[#1D1D1B] truncate max-w-xs hover:text-[#BA945A] cursor-pointer"
                            >
                              {p.name}
                            </h4>
                            {p.name_ar && (
                              <p className="font-serif text-xs text-[#7C746B] truncate max-w-xs italic">
                                {p.name_ar}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Master SKU */}
                      <td className="py-3.5 px-4 font-mono font-medium text-[#1D1D1B]">
                        {p.sku}
                      </td>

                      {/* Category & Collection */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[10px] text-[#1D1D1B] block font-medium">
                          {p.category_name || p.category || 'Atelier'}
                        </span>
                        <span className="text-[10px] text-[#7C746B] block">
                          {p.collection || 'Essentials'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-serif text-sm font-medium text-[#1D1D1B]">
                          {formatPrice(p.price_egp || p.priceEgp, 'EGP')}
                        </span>
                        {(p.original_price_egp || p.originalPriceEgp) && (
                          <span className="text-[10px] text-[#7C746B] line-through block">
                            {formatPrice(p.original_price_egp || p.originalPriceEgp, 'EGP')}
                          </span>
                        )}
                      </td>

                      {/* Stock Level */}
                      <td className="py-3.5 px-4 font-mono">
                        {stock <= 0 ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] uppercase font-bold">
                            Out of Stock
                          </span>
                        ) : stock <= 5 ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] uppercase font-bold flex items-center space-x-1 w-fit">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Low: {stock} left</span>
                          </span>
                        ) : (
                          <span className="text-[#1D1D1B]">
                            {stock} units
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-mono uppercase ${
                          p.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {p.status || 'active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            type="button"
                            onClick={() => onViewProduct(p)}
                            title="View product specifications"
                            className="p-1.5 text-[#7C746B] hover:text-[#1D1D1B] hover:bg-[#FAF8F5] rounded-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditProduct(p)}
                            title="Edit product"
                            className="p-1.5 text-[#7C746B] hover:text-[#1D1D1B] hover:bg-[#FAF8F5] rounded-xs cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateProduct(p)}
                            title="Duplicate product"
                            className="p-1.5 text-[#7C746B] hover:text-[#1D1D1B] hover:bg-[#FAF8F5] rounded-xs cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(p)}
                            title="Delete or Archive product"
                            className="p-1.5 text-[#7C746B] hover:text-red-700 hover:bg-red-50 rounded-xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
