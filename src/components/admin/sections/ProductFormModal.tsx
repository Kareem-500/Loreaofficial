import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useOverlayAccessibility } from '../../../hooks/useOverlayAccessibility';
import { calculateUnitEconomics } from '../../../utils/finance';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => Promise<void>;
  productToEdit?: any | null;
  categories: any[];
  collections: any[];
  isSaving: boolean;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories = [],
  collections = [],
  isSaving,
}) => {
  useOverlayAccessibility({
    isOpen,
    onClose,
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'details' | 'images' | 'variants'>('basic');

  // Form state
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('cat_dresses');
  const [subcategory, setSubcategory] = useState('Occasion');
  const [collection, setCollection] = useState('New Collection');
  const [brand, setBrand] = useState('LORÉA');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [isModestEdit, setIsModestEdit] = useState(false);
  const [badge, setBadge] = useState<string>('NEW');

  // Pricing & Accounting
  const [priceEgp, setPriceEgp] = useState<number>(3500);
  const [costPriceEgp, setCostPriceEgp] = useState<number>(1200);
  const [originalPriceEgp, setOriginalPriceEgp] = useState<number | ''>('');
  const [priceUsd, setPriceUsd] = useState<number>(75);

  // Specifications
  const [fabric, setFabric] = useState('100% Certified Egyptian Long-Staple Cotton');
  const [fit, setFit] = useState('Tailored relaxed fit with clean lines');
  const [care, setCare] = useState('Specialist dry clean or delicate hand wash cold');
  const [shipping, setShipping] = useState('Complimentary delivery in Cairo & Giza within 24–48 hours');

  // Images
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants list
  const [variants, setVariants] = useState<Array<{
    size: string;
    colorName: string;
    colorHex: string;
    stock: number;
    sku?: string;
  }>>([
    { size: 'XS', colorName: 'Noir Black', colorHex: '#1D1D1B', stock: 10 },
    { size: 'S', colorName: 'Noir Black', colorHex: '#1D1D1B', stock: 15 },
    { size: 'M', colorName: 'Noir Black', colorHex: '#1D1D1B', stock: 18 },
    { size: 'L', colorName: 'Noir Black', colorHex: '#1D1D1B', stock: 12 },
    { size: 'XL', colorName: 'Noir Black', colorHex: '#1D1D1B', stock: 8 },
  ]);

  const [formError, setFormError] = useState<string | null>(null);

  // Sync state if editing an existing product
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setNameAr(productToEdit.name_ar || productToEdit.nameAr || '');
      setSubtitle(productToEdit.subtitle || '');
      setDescription(productToEdit.description || '');
      setSku(productToEdit.sku || '');
      setCategoryId(productToEdit.category_id || productToEdit.categoryId || 'cat_dresses');
      setSubcategory(productToEdit.subcategory || '');
      setCollection(productToEdit.collection || 'New Collection');
      setBrand(productToEdit.brand || 'LORÉA');
      setStatus(productToEdit.status || 'active');
      setIsModestEdit(Boolean(productToEdit.is_modest_edit || productToEdit.isModestEdit));
      setBadge(productToEdit.badge || '');
      setPriceEgp(productToEdit.price_egp || productToEdit.priceEgp || 3500);
      setCostPriceEgp(productToEdit.cost_price_egp || productToEdit.costPriceEgp || 1200);
      setOriginalPriceEgp(productToEdit.original_price_egp || productToEdit.originalPriceEgp || '');
      setPriceUsd(productToEdit.price_usd || productToEdit.priceUsd || 75);
      setFabric(productToEdit.fabric || '');
      setFit(productToEdit.fit || '');
      setCare(productToEdit.care || '');
      setShipping(productToEdit.shipping || '');

      if (productToEdit.images && Array.isArray(productToEdit.images) && productToEdit.images.length > 0) {
        setImages(typeof productToEdit.images[0] === 'string' ? productToEdit.images : productToEdit.images.map((i: any) => i.image_url));
      } else if (productToEdit.primary_image) {
        setImages([productToEdit.primary_image]);
      }

      if (productToEdit.variants && Array.isArray(productToEdit.variants) && productToEdit.variants.length > 0) {
        setVariants(productToEdit.variants.map((v: any) => ({
          size: v.size,
          colorName: v.color_name || v.colorName || 'Standard',
          colorHex: v.color_hex || v.colorHex || '#1D1D1B',
          stock: v.stock || 10,
          sku: v.sku,
        })));
      }
    } else {
      // Default new product values
      const timestamp = Date.now().toString().slice(-4);
      setSku(`LOR-CAT-${timestamp}`);
      setName('');
      setNameAr('');
      setSubtitle('');
      setDescription('');
      setPriceEgp(3500);
      setCostPriceEgp(1200);
      setOriginalPriceEgp('');
      setStatus('active');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const unitEconomics = calculateUnitEconomics(priceEgp, costPriceEgp);

  // Add image handler
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Add variant handler
  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: 'M', colorName: 'Desert Taupe', colorHex: '#C7BBAE', stock: 10 },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Product Name in English is required.');
      setActiveTab('basic');
      return;
    }

    if (!sku.trim()) {
      setFormError('Unique Product SKU is required.');
      setActiveTab('basic');
      return;
    }

    if (!priceEgp || priceEgp <= 0) {
      setFormError('Valid Retail Price in EGP is required.');
      setActiveTab('pricing');
      return;
    }

    if (images.length === 0) {
      setFormError('At least one product image is required.');
      setActiveTab('images');
      return;
    }

    const payload = {
      name: name.trim(),
      nameAr: nameAr.trim() || name.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      sku: sku.trim(),
      categoryId,
      subcategory,
      collection,
      brand,
      status,
      isModestEdit: isModestEdit ? 1 : 0,
      badge: badge || null,
      priceEgp: Number(priceEgp),
      costPriceEgp: Number(costPriceEgp),
      originalPriceEgp: originalPriceEgp ? Number(originalPriceEgp) : null,
      priceUsd: priceUsd ? Number(priceUsd) : Math.round(Number(priceEgp) / 48),
      fabric,
      fit,
      care,
      shipping,
      imageUrl: images[0],
      images,
      variants,
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={productToEdit ? 'Edit Product' : 'Add New Product'}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#EAE5DE] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EAE5DE]">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-light text-[#1D1D1B]">
              {productToEdit ? `Edit: ${productToEdit.name}` : 'Add Master Product'}
            </h2>
            <p className="text-xs text-[#7C746B] font-light mt-0.5">
              Configure product metadata, pricing economics, stock variants, and high-fashion imagery.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#7C746B] hover:text-[#1D1D1B] cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EAE5DE] bg-[#F7F4EF] px-6 text-xs overflow-x-auto no-scrollbar">
          {[
            { id: 'basic', label: '1. Basic Information' },
            { id: 'pricing', label: '2. Pricing & Economics' },
            { id: 'details', label: '3. Fabric & Details' },
            { id: 'images', label: `4. Imagery (${images.length})` },
            { id: 'variants', label: `5. Variants Matrix (${variants.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-mono uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#BA945A] text-[#1D1D1B] font-medium bg-white'
                  : 'border-transparent text-[#7C746B] hover:text-[#1D1D1B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="px-6 py-2.5 bg-red-50 border-b border-red-200 text-red-700 text-xs font-medium">
            {formError}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. The Cairo Structured Blazer"
                    className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Product Title (Arabic)
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: بليزر كلاسيكي مهيكل بقصة القاهرة"
                    dir="rtl"
                    className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Master SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    placeholder="e.g. LOR-OUT-003"
                    className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs font-mono uppercase text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.name_ar})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Collection *
                  </label>
                  <select
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                  >
                    <option value="New Collection">New Collection</option>
                    <option value="Essentials">Essentials</option>
                    <option value="Best Sellers">Best Sellers</option>
                    <option value="Limited Edition">Limited Edition</option>
                    <option value="Seasonal Resort">Seasonal Resort</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Publish Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden font-medium"
                  >
                    <option value="active">Active (Visible on Store)</option>
                    <option value="draft">Draft (Hidden in Admin)</option>
                    <option value="archived">Archived (Retired)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Badge / Tag
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                  >
                    <option value="">No Badge</option>
                    <option value="NEW">NEW</option>
                    <option value="BEST SELLER">BEST SELLER</option>
                    <option value="LIMITED">LIMITED</option>
                    <option value="SALE">SALE</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isModestEdit}
                      onChange={(e) => setIsModestEdit(e.target.checked)}
                      className="w-4 h-4 text-[#BA945A] rounded-xs border-[#D4CCC2]"
                    />
                    <span className="font-medium text-[#1D1D1B]">Part of Modest Luxury Edit</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                  Subtitle / Editorial One-Liner
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Sculpted Italian virgin wool with hand-finished mother-of-pearl buttons"
                  className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                  Full Atelier Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed garment story, silhouette construction, and styling narrative..."
                  className="w-full bg-white border border-[#D4CCC2] p-3.5 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & ECONOMICS */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Retail Price (EGP) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={priceEgp}
                    onChange={(e) => setPriceEgp(Number(e.target.value))}
                    className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs font-mono font-medium text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Cost Price (COGS) (EGP)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={costPriceEgp}
                    onChange={(e) => setCostPriceEgp(Number(e.target.value))}
                    className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs font-mono text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                  />
                  <span className="text-[10px] text-[#7C746B] font-light mt-0.5 block">
                    Fabric, tailoring & direct production cost
                  </span>
                </div>

                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Compare-At / Original Price (EGP)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={originalPriceEgp}
                    onChange={(e) => setOriginalPriceEgp(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Leave empty if not on sale"
                    className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs font-mono text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Real-time Commercial Economics Card */}
              <div className="p-4 bg-white border border-[#EAE5DE] space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#7C746B] font-semibold block">
                  REAL-TIME COMMERCIAL MARGIN ANALYSIS
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-[#FAF8F5] border border-[#EAE5DE]">
                    <span className="text-[10px] text-[#7C746B] uppercase font-mono block">Retail Price</span>
                    <span className="font-serif text-lg font-normal text-[#1D1D1B]">{priceEgp} EGP</span>
                  </div>
                  <div className="p-3 bg-[#FAF8F5] border border-[#EAE5DE]">
                    <span className="text-[10px] text-[#7C746B] uppercase font-mono block">Estimated Cost</span>
                    <span className="font-serif text-lg font-normal text-[#7C746B]">{costPriceEgp} EGP</span>
                  </div>
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase font-mono block">Gross Margin</span>
                    <span className="font-serif text-lg font-normal text-emerald-800">{unitEconomics.profitMarginPercent}%</span>
                  </div>
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase font-mono block">Markup Multiplier</span>
                    <span className="font-serif text-lg font-normal text-emerald-800">{unitEconomics.markupMultiplier}x</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DETAILS & CARE */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                  Fabrication & Raw Materials
                </label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. 100% Certified Egyptian Long-Staple Giza 45 Cotton"
                  className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                  Silhouette & Architectural Fit
                </label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  placeholder="e.g. Fluid tailored column drape with structured shoulder pads"
                  className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                  Care & Preservation Instructions
                </label>
                <input
                  type="text"
                  value={care}
                  onChange={(e) => setCare(e.target.value)}
                  placeholder="e.g. Specialist eco-friendly dry clean or delicate cold hand wash"
                  className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                  Delivery & Logistics Note
                </label>
                <input
                  type="text"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  placeholder="e.g. Complimentary white-glove courier delivery across Cairo & Alexandria"
                  className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 4: IMAGERY */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste high-res image URL (Unsplash or Cloudinary)..."
                  className="flex-1 bg-white border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B] focus:border-[#BA945A] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-[#1D1D1B] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#BA945A] cursor-pointer"
                >
                  Add Image
                </button>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-[3/4] bg-white border border-[#EAE5DE] group overflow-hidden">
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover object-top" />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-[#1D1D1B] text-white text-[9px] font-mono px-2 py-0.5">
                        PRIMARY
                      </span>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'up')}
                          title="Move Left/Up"
                          className="p-1.5 bg-white text-[#1D1D1B] hover:text-[#BA945A] cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'down')}
                          title="Move Right/Down"
                          className="p-1.5 bg-white text-[#1D1D1B] hover:text-[#BA945A] cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Delete image"
                        className="p-1.5 bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: VARIANTS MATRIX */}
          {activeTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DE]">
                <span className="text-xs text-[#7C746B]">
                  Manage individual stock for size and color variants.
                </span>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-3 py-1.5 bg-[#FAF8F5] border border-[#BA945A] text-[#1D1D1B] hover:bg-[#BA945A] hover:text-white text-[11px] font-medium uppercase tracking-wider flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variant</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] font-mono text-[10px] text-[#7C746B] uppercase">
                    <tr>
                      <th className="py-2 px-3">Size</th>
                      <th className="py-2 px-3">Color Name</th>
                      <th className="py-2 px-3">Color Hex</th>
                      <th className="py-2 px-3">Stock Units</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE] bg-white">
                    {variants.map((v, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3">
                          <select
                            value={v.size}
                            onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                            className="bg-transparent border border-[#EAE5DE] px-2 py-1 font-mono text-xs"
                          >
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="Standard">Standard</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={v.colorName}
                            onChange={(e) => handleVariantChange(idx, 'colorName', e.target.value)}
                            className="border border-[#EAE5DE] px-2 py-1 text-xs w-32"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="color"
                              value={v.colorHex}
                              onChange={(e) => handleVariantChange(idx, 'colorHex', e.target.value)}
                              className="w-6 h-6 p-0 border-0 cursor-pointer"
                            />
                            <span className="font-mono text-[11px] text-[#7C746B]">{v.colorHex}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min={0}
                            value={v.stock}
                            onChange={(e) => handleVariantChange(idx, 'stock', Number(e.target.value))}
                            className="border border-[#EAE5DE] px-2 py-1 text-xs font-mono w-20"
                          />
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Save / Cancel Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EAE5DE] bg-white -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 text-xs uppercase tracking-wider text-[#7C746B] hover:text-[#1D1D1B] font-medium cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#1D1D1B] hover:bg-[#BA945A] disabled:opacity-50 text-white text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 cursor-pointer shadow-md"
            >
              {isSaving ? 'Saving Master...' : productToEdit ? 'Save Changes' : 'Publish to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
