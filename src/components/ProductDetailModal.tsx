import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  Share2,
  ChevronRight,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  Ruler,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Product, ProductColor, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { useOverlayAccessibility } from '../hooks/useOverlayAccessibility';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (
    product: Product,
    color: ProductColor,
    size: 'XS' | 'S' | 'M' | 'L' | 'XL',
    qty: number
  ) => void;
  onOpenSizeGuide: () => void;
  onOpenTryOn?: (product: Product) => void;
  onViewFullDetails?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
  onOpenSizeGuide,
  onOpenTryOn,
  onViewFullDetails
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('S');
  const [quantity, setQuantity] = useState(1);
  const [addedEffect, setAddedEffect] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

  // Handle ESC and body scroll lock
  useOverlayAccessibility({
    isOpen: Boolean(product),
    onClose
  });

  // Reset variant selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedColor(product.colors?.[0] || { name: 'Standard', hex: '#1D1D1B' });
      setSelectedSize((product.sizes?.[0] as 'XS' | 'S' | 'M' | 'L' | 'XL') || 'S');
      setQuantity(1);
      setAddedEffect(false);
    }
  }, [product]);

  if (!product) return null;

  const images = (product.images && product.images.length > 0)
    ? product.images
    : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'];

  const colors = (product.colors && product.colors.length > 0)
    ? product.colors
    : [{ name: 'Standard', hex: '#1D1D1B' }];

  const sizes = (product.sizes && product.sizes.length > 0)
    ? product.sizes
    : (['XS', 'S', 'M', 'L', 'XL'] as ('XS' | 'S' | 'M' | 'L' | 'XL')[]);

  const currentColor = selectedColor || colors[0];

  const handleAddToCart = () => {
    onAddToCart(product, currentColor, selectedSize, quantity);
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1400);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick View: ${product.name}`}
    >
      {/* 1. Subtle, Elegant Backdrop (Click Outside to Close) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Interactive Product Container (Clicks inside do not close) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#FAF8F5] sm:border border-[#EAE5DE] shadow-2xl flex flex-col max-h-[100dvh] sm:max-h-[92vh] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#EAE5DE] bg-white">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-mono">
              QUICK VIEW · {product.category}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onViewFullDetails && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewFullDetails(product);
                }}
                className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-[#7C746B] hover:text-[#BA945A] font-medium tracking-wider uppercase mr-3 transition-colors cursor-pointer"
              >
                <span>Full Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center text-[#1D1D1B] hover:text-[#BA945A] hover:bg-[#FAF8F5] rounded-xs transition-colors cursor-pointer active:scale-95"
              aria-label="Close product preview (ESC)"
              title="Close (ESC)"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            
            {/* LEFT: Product Image Gallery (7 Columns on Desktop) */}
            <div className="lg:col-span-7 bg-[#F0EDE8] p-4 sm:p-6 lg:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EAE5DE]">
              {/* Main Stage Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EAE5DE] shadow-xs group">
                <img
                  src={images[selectedImageIndex] || images[0]}
                  alt={`${product.name} - View ${selectedImageIndex + 1}`}
                  loading="eager"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Badge if present */}
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-[#1D1D1B] text-white text-[10px] tracking-[0.2em] font-mono uppercase px-2.5 py-1 shadow-xs">
                    {product.badge}
                  </div>
                )}

                {/* Floating Wishlist Heart */}
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
                    isWishlisted
                      ? 'bg-[#1D1D1B] text-white'
                      : 'bg-white/90 text-[#1D1D1B] hover:bg-white hover:text-[#BA945A]'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 stroke-[1.5] ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails Row (if multiple images) */}
              {images.length > 1 && (
                <div className="flex items-center space-x-3 mt-4 overflow-x-auto no-scrollbar py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-20 shrink-0 overflow-hidden border transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-[#BA945A] ring-1 ring-[#BA945A]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View thumbnail ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Details & Controls (5 Columns on Desktop) */}
            <div className="lg:col-span-5 p-5 sm:p-7 lg:p-8 flex flex-col justify-between bg-white">
              <div>
                {/* Category & Title */}
                <div className="mb-4">
                  <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-[#7C746B] block mb-1">
                    {product.category} · {product.collection || 'ESSENTIALS'}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1D1D1B] leading-snug">
                    {product.name}
                  </h2>
                  {product.subtitle && (
                    <p className="font-sans text-xs text-[#7C746B] font-light mt-1">
                      {product.subtitle}
                    </p>
                  )}
                </div>

                {/* Price Display */}
                <div className="flex items-baseline space-x-3 mb-6 pb-4 border-b border-[#EAE5DE]">
                  <span className="font-serif text-2xl text-[#1D1D1B]">
                    {formatPrice(product.priceEgp, currency)}
                  </span>
                  {product.originalPriceEgp && product.originalPriceEgp > product.priceEgp && (
                    <span className="text-sm text-[#7C746B] line-through font-light">
                      {formatPrice(product.originalPriceEgp, currency)}
                    </span>
                  )}
                  {product.badge === 'SALE' && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#964036] bg-[#964036]/10 px-2 py-0.5 font-medium">
                      Special Offer
                    </span>
                  )}
                </div>

                {/* Color Selection */}
                {colors.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-wider text-[#1D1D1B] font-medium">
                        Color: <span className="font-normal text-[#7C746B]">{currentColor.name}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      {colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`w-7 h-7 rounded-full border p-0.5 transition-all cursor-pointer ${
                            currentColor.name === c.name
                              ? 'border-[#BA945A] ring-1 ring-[#BA945A]'
                              : 'border-[#D4CCC2] hover:border-[#1D1D1B]'
                          }`}
                          title={c.name}
                        >
                          <span
                            className="w-full h-full rounded-full block border border-black/10"
                            style={{ backgroundColor: c.hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-[#1D1D1B] font-medium">
                      Size: <span className="font-normal text-[#7C746B]">{selectedSize}</span>
                    </span>
                    <button
                      type="button"
                      onClick={onOpenSizeGuide}
                      className="inline-flex items-center space-x-1 text-[11px] text-[#7C746B] hover:text-[#BA945A] transition-colors cursor-pointer underline underline-offset-2"
                    >
                      <Ruler className="w-3 h-3 mr-0.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s as 'XS' | 'S' | 'M' | 'L' | 'XL')}
                        className={`py-2 text-xs font-mono text-center border transition-all cursor-pointer ${
                          selectedSize === s
                            ? 'border-[#1D1D1B] bg-[#1D1D1B] text-white font-medium'
                            : 'border-[#D4CCC2] text-[#1D1D1B] hover:border-[#1D1D1B] bg-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Add to Cart Controls */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#D4CCC2] bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-11 flex items-center justify-center text-[#1D1D1B] hover:bg-[#FAF8F5] disabled:opacity-30 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-9 text-center font-mono text-xs font-medium">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                        className="w-10 h-11 flex items-center justify-center text-[#1D1D1B] hover:bg-[#FAF8F5] cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Bag Button */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex-1 h-11 px-6 flex items-center justify-center space-x-2 text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 cursor-pointer shadow-xs active:scale-[0.98] ${
                        addedEffect
                          ? 'bg-emerald-800 text-white'
                          : 'bg-[#1D1D1B] text-white hover:bg-[#BA945A]'
                      }`}
                    >
                      {addedEffect ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>ADDED TO BAG</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                          <span>ADD TO BAG · {formatPrice(product.priceEgp * quantity, currency)}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Style Assistant Shortcut */}
                  {onOpenTryOn && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenTryOn(product);
                      }}
                      className="w-full py-2.5 px-4 bg-[#FAF8F5] border border-[#BA945A] text-[#1D1D1B] hover:bg-[#BA945A] hover:text-white transition-all text-[11px] tracking-[0.2em] uppercase font-medium flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#BA945A] group-hover:text-white" />
                      <span>STYLE THIS SILHOUETTE WITH AI</span>
                    </button>
                  )}
                </div>

                {/* Accordion Tabs for Product Details, Care, Shipping */}
                <div className="border-t border-[#EAE5DE] pt-4 space-y-2">
                  <div className="flex border-b border-[#EAE5DE] text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab('details')}
                      className={`pb-2 px-3 tracking-wider uppercase font-medium transition-colors cursor-pointer border-b-2 ${
                        activeTab === 'details'
                          ? 'border-[#1D1D1B] text-[#1D1D1B]'
                          : 'border-transparent text-[#7C746B] hover:text-[#1D1D1B]'
                      }`}
                    >
                      Description
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('care')}
                      className={`pb-2 px-3 tracking-wider uppercase font-medium transition-colors cursor-pointer border-b-2 ${
                        activeTab === 'care'
                          ? 'border-[#1D1D1B] text-[#1D1D1B]'
                          : 'border-transparent text-[#7C746B] hover:text-[#1D1D1B]'
                      }`}
                    >
                      Fabric & Care
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('shipping')}
                      className={`pb-2 px-3 tracking-wider uppercase font-medium transition-colors cursor-pointer border-b-2 ${
                        activeTab === 'shipping'
                          ? 'border-[#1D1D1B] text-[#1D1D1B]'
                          : 'border-transparent text-[#7C746B] hover:text-[#1D1D1B]'
                      }`}
                    >
                      Delivery
                    </button>
                  </div>

                  <div className="py-2 text-xs text-[#55504A] font-light leading-relaxed min-h-[60px]">
                    {activeTab === 'details' && (
                      <p>{product.description || 'Crafted with intentional tailoring and effortless silhouette.'}</p>
                    )}
                    {activeTab === 'care' && (
                      <p>
                        {product.fabric || '100% Premium Egyptian Long-Staple Cotton.'}
                        <br />
                        Dry clean or delicate cold hand wash. Dry flat in shade.
                      </p>
                    )}
                    {activeTab === 'shipping' && (
                      <p>
                        Complimentary delivery on orders over 2,500 EGP. 24–48hr express delivery across Cairo & Alexandria. Complimentary returns within 14 days.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Navigation Link: View Full Details */}
              {onViewFullDetails && (
                <div className="pt-4 border-t border-[#EAE5DE] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewFullDetails(product);
                    }}
                    className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-[0.2em] font-medium text-[#1D1D1B] hover:text-[#BA945A] transition-colors cursor-pointer group"
                  >
                    <span>VIEW FULL PRODUCT DETAILS</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="text-[#7C746B] hover:text-[#1D1D1B] text-xs flex items-center space-x-1 cursor-pointer"
                    title="Share link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
