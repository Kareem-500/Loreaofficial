import React from 'react';
import {
  X,
  Edit2,
  Copy,
  Trash2,
  Archive,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useOverlayAccessibility } from '../../../hooks/useOverlayAccessibility';
import { formatPrice } from '../../../utils/currency';
import { calculateUnitEconomics } from '../../../utils/finance';

interface ProductDetailModalProps {
  product: any | null;
  onClose: () => void;
  onEdit: (product: any) => void;
  onDuplicate: (product: any) => void;
  onDelete: (product: any) => void;
  onStatusChange: (product: any, newStatus: 'active' | 'draft' | 'archived') => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
  onStatusChange,
}) => {
  useOverlayAccessibility({
    isOpen: Boolean(product),
    onClose,
  });

  if (!product) return null;

  const unitEconomics = calculateUnitEconomics(product.price_egp || product.priceEgp, product.cost_price_egp || product.costPriceEgp);
  const images = (product.images && product.images.length > 0)
    ? (typeof product.images[0] === 'string' ? product.images : product.images.map((i: any) => i.image_url))
    : [product.primary_image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85'];

  const variants = product.variants || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Product Commercial Profile"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#EAE5DE] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EAE5DE]">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#7C746B]">
              PRODUCT MASTER · {product.sku}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
              product.status === 'active'
                ? 'bg-emerald-100 text-emerald-800'
                : product.status === 'draft'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.status || 'active'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="px-3 py-1.5 bg-[#1D1D1B] hover:bg-[#BA945A] text-white text-xs font-medium uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(product)}
              className="p-1.5 text-[#7C746B] hover:text-[#1D1D1B] border border-[#D4CCC2] hover:border-[#1D1D1B] rounded-xs transition-colors cursor-pointer"
              title="Duplicate product"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(product)}
              className="p-1.5 text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 rounded-xs transition-colors cursor-pointer"
              title="Delete or archive"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#7C746B] hover:text-[#1D1D1B] ml-2 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Row: Gallery on Left, Details on Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Gallery Column (5 Cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-[3/4] bg-[#EAE5DE] border border-[#EAE5DE] overflow-hidden">
                <img
                  src={images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {images.length > 1 && (
                <div className="flex items-center space-x-2 overflow-x-auto py-1">
                  {images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      className="w-14 h-18 object-cover border border-[#EAE5DE] shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Information Column (7 Cols) */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="font-mono text-[10px] text-[#BA945A] uppercase tracking-[0.2em] block mb-1">
                  {product.category_name || product.category || 'Atelier'} · {product.collection || 'Essentials'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1D1D1B]">
                  {product.name}
                </h2>
                {product.name_ar && (
                  <p className="font-serif text-base text-[#7C746B] italic mt-0.5">
                    {product.name_ar}
                  </p>
                )}
                {product.subtitle && (
                  <p className="text-xs text-[#7C746B] font-light mt-1">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* Commercial Unit Economics Card */}
              <div className="p-4 bg-white border border-[#EAE5DE] space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#7C746B] font-semibold block">
                  COMMERCIAL UNIT ECONOMICS
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 bg-[#FAF8F5] border border-[#EAE5DE]">
                    <span className="text-[10px] text-[#7C746B] uppercase font-mono block">Retail Price</span>
                    <span className="font-serif text-lg font-normal text-[#1D1D1B]">
                      {formatPrice(product.price_egp || product.priceEgp, 'EGP')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F5] border border-[#EAE5DE]">
                    <span className="text-[10px] text-[#7C746B] uppercase font-mono block">Cost of Goods</span>
                    <span className="font-serif text-lg font-normal text-[#7C746B]">
                      {formatPrice(unitEconomics.cost, 'EGP')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase font-mono block">Est. Profit</span>
                    <span className="font-serif text-lg font-normal text-emerald-800">
                      {formatPrice(unitEconomics.estimatedProfit, 'EGP')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase font-mono block">Profit Margin</span>
                    <span className="font-serif text-lg font-normal text-emerald-800">
                      {unitEconomics.profitMarginPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-[#EAE5DE]">
                  <span className="text-[10px] uppercase font-mono text-[#7C746B] block">Fabrication</span>
                  <p className="text-[#1D1D1B] mt-0.5">{product.fabric || 'Egyptian Cotton & Silk'}</p>
                </div>
                <div className="p-3 bg-white border border-[#EAE5DE]">
                  <span className="text-[10px] uppercase font-mono text-[#7C746B] block">Silhouette & Fit</span>
                  <p className="text-[#1D1D1B] mt-0.5">{product.fit || 'Tailored architectural drape'}</p>
                </div>
                <div className="p-3 bg-white border border-[#EAE5DE]">
                  <span className="text-[10px] uppercase font-mono text-[#7C746B] block">Total Stock</span>
                  <p className="font-mono font-bold text-[#1D1D1B] mt-0.5">{product.total_stock || 45} units</p>
                </div>
                <div className="p-3 bg-white border border-[#EAE5DE]">
                  <span className="text-[10px] uppercase font-mono text-[#7C746B] block">Modest Edit</span>
                  <p className="text-[#1D1D1B] mt-0.5">{product.is_modest_edit ? 'Yes (Certified)' : 'Standard'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Variants Table */}
          {variants.length > 0 && (
            <div className="bg-white border border-[#EAE5DE] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#7C746B] font-semibold">
                  ACTIVE VARIANTS MATRIX ({variants.length})
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] font-mono text-[10px] text-[#7C746B] uppercase">
                    <tr>
                      <th className="py-2 px-3">Variant SKU</th>
                      <th className="py-2 px-3">Color</th>
                      <th className="py-2 px-3">Size</th>
                      <th className="py-2 px-3">Stock Level</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {variants.map((v: any) => (
                      <tr key={v.id || v.sku} className="hover:bg-[#FAF8F5]/50">
                        <td className="py-2.5 px-3 font-mono text-[#1D1D1B]">{v.sku}</td>
                        <td className="py-2.5 px-3 flex items-center space-x-1.5">
                          {v.color_hex && (
                            <span
                              className="w-3 h-3 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: v.color_hex }}
                            />
                          )}
                          <span>{v.color_name}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium">{v.size}</td>
                        <td className="py-2.5 px-3 font-mono">
                          <span className={v.stock <= 5 ? 'text-red-700 font-bold' : 'text-[#1D1D1B]'}>
                            {v.stock} units
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 text-[9px] font-mono uppercase ${
                            v.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {v.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
