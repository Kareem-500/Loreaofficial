import React, { useState } from 'react';
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
  Star,
  Check,
  Ruler
} from 'lucide-react';
import { Product, ProductColor, Currency } from '../types';
import { formatPrice } from '../utils/currency';

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
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
  onOpenSizeGuide,
  onOpenTryOn
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('S');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'fabric' | 'fit' | 'care' | 'shipping' | 'reviews'>('fabric');
  const [addedEffect, setAddedEffect] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const reviews = product.reviews || [];

  const currentColor = selectedColor || colors[0];

  const handleAddToCart = () => {
    onAddToCart(product, currentColor, selectedSize, quantity);
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1200);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex justify-center items-start p-2 sm:p-4 md:p-6 lg:p-10 animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#F7F4EF] shadow-2xl border border-[#EAE5DE] my-auto overflow-hidden">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 bg-[#F7F4EF]/80 backdrop-blur-xs rounded-full text-[#1D1D1B] hover:text-[#B88F88] transition-colors shadow-xs"
          aria-label="Close product view"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
          {/* LEFT: Large Product Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 bg-[#EFECE6] p-4 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EAE5DE]">
            {/* Main Stage Image with Zoom on Hover */}
            <div className="relative aspect-3/4 w-full overflow-hidden bg-[#EAE5DE] shadow-xs group">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={`${product.name} view ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
              />

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase font-medium bg-[#1D1D1B] text-[#F7F4EF] px-3 py-1">
                  {product.badge}
                </span>
              )}

              {product.isModestEdit && (
                <span className="absolute bottom-4 left-4 text-[9px] tracking-[0.22em] uppercase bg-[#1D1D1B]/80 text-[#F7F4EF] px-2.5 py-1 backdrop-blur-xs">
                  MODEST EDIT APPROVED
                </span>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex items-center space-x-3 mt-4 overflow-x-auto no-scrollbar py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-22 shrink-0 overflow-hidden border transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#1D1D1B] ring-1 ring-[#1D1D1B]'
                        : 'border-[#D4CCC2] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Information & Purchasing Controls (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
            <div>
              {/* Category Breadcrumbs */}
              <div className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.2em] text-[#7C746B] mb-2 font-light">
                <span>LORÉA</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
                <span>{product.category}</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
                <span>{product.collection}</span>
              </div>

              {/* Title & SKU */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1D1D1B] leading-tight mb-1">
                {product.name}
              </h1>
              <p className="text-xs text-[#7C746B] font-serif italic mb-3">
                {product.nameAr} · SKU: {product.sku}
              </p>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6 pb-4 border-b border-[#EAE5DE]">
                <span className="text-xl sm:text-2xl font-normal text-[#1D1D1B]">
                  {formatPrice(product.priceEgp, currency)}
                </span>
                {product.originalPriceEgp && (
                  <span className="text-sm text-[#7C746B] line-through font-light">
                    {formatPrice(product.originalPriceEgp, currency)}
                  </span>
                )}
                <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs font-medium">
                  In Stock · Cairo Atelier
                </span>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="uppercase tracking-[0.16em] text-[#7C746B] font-medium">
                    Color: <strong className="text-[#1D1D1B] font-normal">{currentColor.name}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        currentColor.name === c.name
                          ? 'ring-2 ring-[#1D1D1B] ring-offset-2 border-[#1D1D1B]'
                          : 'border-[#B7ADA2] hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={`Select color ${c.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector + Size Guide Link */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="uppercase tracking-[0.16em] text-[#7C746B] font-medium">
                    Size: <strong className="text-[#1D1D1B] font-normal">{selectedSize}</strong>
                  </span>
                  <button
                    onClick={onOpenSizeGuide}
                    className="text-[#7C746B] hover:text-[#1D1D1B] underline text-[11px] flex items-center space-x-1"
                  >
                    <Ruler className="w-3 h-3 mr-0.5" />
                    <span>Size Guide & Measurements</span>
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2.5 text-xs font-mono font-medium transition-all ${
                        selectedSize === s
                          ? 'bg-[#1D1D1B] text-[#F7F4EF]'
                          : 'bg-[#EFECE6] text-[#1D1D1B] hover:bg-[#EAE5DE]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-xs uppercase tracking-[0.16em] text-[#7C746B] font-medium">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#D4CCC2]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-[#EAE5DE] text-[#1D1D1B] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-mono font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 hover:bg-[#EAE5DE] text-[#1D1D1B] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary CTAs: ADD TO BAG & WISHLIST */}
              <div className="space-y-3 mb-8">
                <button
                  id="pdp-add-to-bag-btn"
                  onClick={handleAddToCart}
                  className={`w-full py-4 text-xs tracking-[0.24em] uppercase font-medium flex items-center justify-center space-x-2 transition-all shadow-md active:scale-99 ${
                    addedEffect
                      ? 'bg-emerald-800 text-white'
                      : 'bg-[#1D1D1B] text-[#F7F4EF] hover:bg-[#2A2928]'
                  }`}
                >
                  {addedEffect ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO BAG · {formatPrice(product.priceEgp * quantity, currency)}</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`py-3 border text-xs tracking-[0.16em] uppercase font-medium flex items-center justify-center space-x-1.5 transition-colors ${
                      isWishlisted
                        ? 'border-[#B88F88] bg-[#B88F88]/10 text-[#964036]'
                        : 'border-[#D4CCC2] text-[#1D1D1B] hover:border-[#1D1D1B]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                    <span>{isWishlisted ? 'SAVED IN WISHLIST' : 'ADD TO WISHLIST'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="py-3 border border-[#D4CCC2] text-[#1D1D1B] hover:border-[#1D1D1B] text-xs tracking-[0.16em] uppercase font-medium flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'LINK COPIED' : 'SHARE'}</span>
                  </button>
                </div>

                {/* AI Style Assistant CTA */}
                {onOpenTryOn && (
                  <button
                    onClick={() => onOpenTryOn(product)}
                    className="w-full py-3 bg-[#FAF8F5] text-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-[#F7F4EF] border border-[#BA945A] text-xs tracking-[0.2em] uppercase font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer group shadow-xs"
                  >
                    <Sparkles className="w-4 h-4 text-[#BA945A] group-hover:text-white transition-colors" />
                    <span>AI Style Assistant · نسّق الإطلالة مع مستشار لوريا</span>
                  </button>
                )}
              </div>

              {/* Egyptian Atelier Trust Badges */}
              <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#EAE5DE] text-center text-[10px] text-[#7C746B] font-light mb-6">
                <div className="flex flex-col items-center">
                  <Sparkles className="w-4 h-4 text-[#B88F88] mb-1" />
                  <span>100% Giza/Flax</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-[#1D1D1B] mb-1" />
                  <span>Same-Day Cairo</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-[#1D1D1B] mb-1" />
                  <span>14-Day Returns</span>
                </div>
              </div>

              {/* Accordion Tabs for Fabric, Fit, Care, Shipping, Reviews */}
              <div className="space-y-3 pt-2">
                <div className="flex border-b border-[#EAE5DE] text-[11px] uppercase tracking-wider overflow-x-auto no-scrollbar">
                  {[
                    { id: 'fabric', label: 'Fabric' },
                    { id: 'fit', label: 'Fit & Model' },
                    { id: 'care', label: 'Care' },
                    { id: 'shipping', label: 'Shipping' },
                    { id: 'reviews', label: `Reviews (${product.reviewsCount})` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-2.5 px-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-[#1D1D1B] text-[#1D1D1B]'
                          : 'border-transparent text-[#7C746B] hover:text-[#1D1D1B]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="py-2 text-xs text-[#7C746B] leading-relaxed">
                  {activeTab === 'fabric' && (
                    <div>
                      <p className="font-medium text-[#1D1D1B] mb-1">{product.fabric}</p>
                      <p>{product.description}</p>
                    </div>
                  )}
                  {activeTab === 'fit' && (
                    <div>
                      <p className="font-medium text-[#1D1D1B] mb-1">Fit Guide:</p>
                      <p>{product.fit}</p>
                      <p className="mt-2 text-[#A0988E]">
                        Model in photo is 178 cm (5&apos;10&quot;) wearing size Small.
                      </p>
                    </div>
                  )}
                  {activeTab === 'care' && (
                    <div>
                      <p className="font-medium text-[#1D1D1B] mb-1">Garment Care:</p>
                      <p>{product.care}</p>
                    </div>
                  )}
                  {activeTab === 'shipping' && (
                    <div>
                      <p className="font-medium text-[#1D1D1B] mb-1">Delivery in Egypt & Worldwide:</p>
                      <p>{product.shipping}</p>
                      <p className="mt-1 text-[#A0988E]">
                        Cash on Delivery available across all Egyptian governorates.
                      </p>
                    </div>
                  )}
                  {activeTab === 'reviews' && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex text-amber-600">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium text-[#1D1D1B] text-xs">
                          {product.rating} / 5.0 Rating
                        </span>
                      </div>
                      {reviews.length > 0 ? (
                        reviews.map((r) => (
                          <div key={r.id} className="p-2.5 bg-[#EFECE6] border border-[#EAE5DE]">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-[#1D1D1B]">{r.author}</span>
                              <span className="text-[10px] text-[#A0988E]">{r.date}</span>
                            </div>
                            <p className="font-medium text-[11px] text-[#1D1D1B] mb-0.5">{r.title}</p>
                            <p className="text-[11px] text-[#7C746B]">{r.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-[#7C746B]">
                          Be the first to review this silhouette. All verified purchasers receive a 10% atelier credit.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
