import React, { useState, useEffect } from 'react';
import {
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
  Ruler,
  ArrowLeft
} from 'lucide-react';
import { Product, ProductColor, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { Breadcrumbs } from './common/Breadcrumbs';
import { buildCategoryUrl, buildProductUrl } from '../config/routes';
import { ProductCard } from './ProductCard';

interface ProductPageViewProps {
  product: Product | null;
  allProducts?: Product[];
  currency?: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (
    product: Product,
    color: ProductColor,
    size: 'XS' | 'S' | 'M' | 'L' | 'XL',
    qty: number
  ) => void;
  onOpenSizeGuide: () => void;
  onNavigateHome: () => void;
  onNavigateStore: () => void;
  onSelectCategory: (category: string) => void;
  onSelectRelatedProduct: (product: Product) => void;
  onOpenTryOn?: (product: Product) => void;
}

export const ProductPageView: React.FC<ProductPageViewProps> = ({
  product,
  allProducts = [],
  currency = 'EGP' as Currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenSizeGuide,
  onNavigateHome,
  onNavigateStore,
  onSelectCategory,
  onSelectRelatedProduct,
  onOpenTryOn
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('S');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'fabric' | 'fit' | 'care' | 'shipping' | 'reviews'>('fabric');
  const [addedEffect, setAddedEffect] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset image and selections when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // If product not found -> Error & Fallback 404 State
  if (!product) {
    return (
      <div className="bg-[#F7F4EF] min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md text-center bg-white border border-[#EAE5DE] p-8 sm:p-12 shadow-sm">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#7C746B] block mb-2 font-medium">
            404 · ARCHIVE INQUIRY
          </span>
          <h1 className="font-serif text-3xl font-light text-[#1D1D1B] mb-3">
            Silhouette Not Found
          </h1>
          <p className="text-xs text-[#7C746B] font-light leading-relaxed mb-6">
            The garment you are seeking is either archived or unavailable under this specific URL. Explore our active atelier collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onNavigateStore}
              className="px-6 py-2.5 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-wider font-medium hover:bg-[#BA945A] transition-colors"
            >
              Browse All Products
            </button>
            <button
              onClick={onNavigateHome}
              className="px-6 py-2.5 border border-[#1D1D1B] text-[#1D1D1B] text-xs uppercase tracking-wider font-medium hover:bg-[#FAF8F5] transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const safeImages = (product.images && product.images.length > 0)
    ? product.images
    : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'];

  const safeColors = (product.colors && product.colors.length > 0)
    ? product.colors
    : [{ name: 'Standard', hex: '#1D1D1B' }];

  const safeSizes = (product.sizes && product.sizes.length > 0)
    ? product.sizes
    : (['XS', 'S', 'M', 'L', 'XL'] as ('XS' | 'S' | 'M' | 'L' | 'XL')[]);

  const currentColor = selectedColor || safeColors[0];

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

  // Related products from same category or collection
  const safeAllProducts = allProducts || [];
  const relatedProducts = safeAllProducts
    .filter((p) => p && p.id !== product.id && (p.category === product.category || p.collection === product.collection))
    .slice(0, 4);

  return (
    <div className="bg-[#F7F4EF] min-h-screen">
      {/* Top Breadcrumbs Strip */}
      <div className="bg-white border-b border-[#EAE5DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { label: 'Home', onClick: onNavigateHome },
              { label: 'Shop', onClick: onNavigateStore },
              { label: product.category, onClick: () => onSelectCategory(product.category) },
              { label: product.name }
            ]}
          />

          <button
            onClick={onNavigateStore}
            className="hidden sm:inline-flex items-center space-x-1 text-xs text-[#7C746B] hover:text-[#1D1D1B] uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* LEFT: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Primary Main Image */}
            <div className="relative aspect-3/4 w-full overflow-hidden bg-[#EAE5DE] shadow-xs">
              <img
                src={safeImages[selectedImageIndex] || safeImages[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`text-[10px] tracking-[0.2em] uppercase font-semibold px-3 py-1 ${
                      product.badge === 'SALE'
                        ? 'bg-[#964036] text-white'
                        : product.badge === 'NEW'
                        ? 'bg-[#1D1D1B] text-[#F7F4EF]'
                        : 'bg-[#B88F88] text-white'
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Modest Edit Tag */}
              {product.isModestEdit && (
                <span className="absolute bottom-4 left-4 text-[9px] tracking-[0.2em] uppercase bg-[#1D1D1B]/85 text-[#F7F4EF] px-2.5 py-1 backdrop-blur-xs font-mono">
                  MODEST EDIT VERIFIED
                </span>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {safeImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {safeImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 sm:w-24 aspect-3/4 shrink-0 overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#BA945A] opacity-100'
                        : 'border-transparent opacity-65 hover:opacity-90'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details & Purchase Actions (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & Collection Tag */}
              <div className="flex items-center justify-between text-xs text-[#7C746B] mb-2 font-mono uppercase tracking-widest">
                <span>
                  {product.collection} · {product.category}
                </span>
                <span>SKU: {product.sku}</span>
              </div>

              {/* Title & Arabic */}
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1D1B] font-light tracking-tight">
                {product.name}
              </h1>
              <p className="font-cairo text-sm text-[#7C746B] mt-1 mb-3">
                {product.nameAr}
              </p>

              {/* Price */}
              <div className="flex items-baseline space-x-3 py-3 border-y border-[#EAE5DE] mb-6">
                <span className="font-serif text-2xl sm:text-3xl text-[#1D1D1B] font-medium">
                  {formatPrice(product.priceEgp, currency)}
                </span>
                {product.originalPriceEgp && (
                  <span className="line-through text-[#7C746B] text-base font-light">
                    {formatPrice(product.originalPriceEgp, currency)}
                  </span>
                )}
                {product.originalPriceEgp && (
                  <span className="text-xs text-[#964036] font-semibold uppercase tracking-wider">
                    Save {Math.round((1 - product.priceEgp / product.originalPriceEgp) * 100)}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#7C746B] font-light leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs tracking-wider uppercase mb-2">
                  <span className="font-medium text-[#1D1D1B]">Color:</span>
                  <span className="text-[#7C746B]">{currentColor.name}</span>
                </div>
                <div className="flex space-x-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-9 h-9 rounded-full border-2 transition-all p-0.5 cursor-pointer ${
                        currentColor.name === c.name
                          ? 'border-[#BA945A] scale-110'
                          : 'border-[#EAE5DE] hover:border-[#7C746B]'
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

              {/* Size Selection with Interactive Size Guide */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs tracking-wider uppercase mb-2">
                  <span className="font-medium text-[#1D1D1B]">Select Size:</span>
                  <button
                    onClick={onOpenSizeGuide}
                    className="inline-flex items-center space-x-1 text-[#BA945A] hover:underline font-medium"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 text-xs font-mono uppercase tracking-wider transition-all border cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#1D1D1B] text-[#F7F4EF] border-[#1D1D1B]'
                          : 'bg-white text-[#1D1D1B] border-[#EAE5DE] hover:border-[#1D1D1B]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart & Wishlist */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#EAE5DE] bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2.5 text-xs hover:bg-[#FAF8F5] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-2.5 text-xs font-mono font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2.5 text-xs hover:bg-[#FAF8F5] transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      addedEffect
                        ? 'bg-emerald-800 text-white'
                        : 'bg-[#1D1D1B] text-[#F7F4EF] hover:bg-[#BA945A]'
                    }`}
                  >
                    {addedEffect ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Shopping Bag</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-3 border transition-colors cursor-pointer ${
                      isWishlisted
                        ? 'bg-[#B88F88] text-white border-[#B88F88]'
                        : 'bg-white border-[#EAE5DE] text-[#1D1D1B] hover:text-[#BA945A] hover:border-[#BA945A]'
                    }`}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* AI Style Assistant Button */}
                {onOpenTryOn && (
                  <button
                    onClick={() => onOpenTryOn(product)}
                    className="w-full py-3.5 bg-[#FAF8F5] border border-[#BA945A] text-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-[#F7F4EF] text-xs uppercase tracking-[0.22em] font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer group shadow-xs"
                  >
                    <Sparkles className="w-4 h-4 text-[#BA945A] group-hover:text-white transition-colors" />
                    <span>AI Style Assistant · نسّق الإطلالة مع مستشار لوريا</span>
                  </button>
                )}

                {/* Share Link */}
                <button
                  onClick={handleShare}
                  className="w-full py-2 text-[11px] uppercase tracking-wider text-[#7C746B] hover:text-[#1D1D1B] inline-flex items-center justify-center space-x-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied to Clipboard' : 'Share This Silhouette'}</span>
                </button>
              </div>

              {/* Stock status indicator */}
              <div className="bg-white border border-[#EAE5DE] p-4 rounded-xs mb-8 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="font-medium text-[#1D1D1B]">In Stock — Atelier Ready</span>
                </div>
                <span className="text-[#7C746B]">Same-day Cairo Dispatch</span>
              </div>

              {/* Tabs: Fabric / Fit / Care / Shipping */}
              <div className="border-t border-[#EAE5DE] pt-4">
                <div className="flex space-x-6 border-b border-[#EAE5DE] pb-2 text-xs uppercase tracking-wider">
                  <button
                    onClick={() => setActiveTab('fabric')}
                    className={`pb-2 transition-colors cursor-pointer ${
                      activeTab === 'fabric'
                        ? 'text-[#1D1D1B] font-semibold border-b-2 border-[#BA945A]'
                        : 'text-[#7C746B] hover:text-[#1D1D1B]'
                    }`}
                  >
                    Fabric & Craft
                  </button>
                  <button
                    onClick={() => setActiveTab('fit')}
                    className={`pb-2 transition-colors cursor-pointer ${
                      activeTab === 'fit'
                        ? 'text-[#1D1D1B] font-semibold border-b-2 border-[#BA945A]'
                        : 'text-[#7C746B] hover:text-[#1D1D1B]'
                    }`}
                  >
                    Fit Details
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`pb-2 transition-colors cursor-pointer ${
                      activeTab === 'care'
                        ? 'text-[#1D1D1B] font-semibold border-b-2 border-[#BA945A]'
                        : 'text-[#7C746B] hover:text-[#1D1D1B]'
                    }`}
                  >
                    Atelier Care
                  </button>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`pb-2 transition-colors cursor-pointer ${
                      activeTab === 'shipping'
                        ? 'text-[#1D1D1B] font-semibold border-b-2 border-[#BA945A]'
                        : 'text-[#7C746B] hover:text-[#1D1D1B]'
                    }`}
                  >
                    Delivery
                  </button>
                </div>

                <div className="py-4 text-xs text-[#7C746B] font-light leading-relaxed">
                  {activeTab === 'fabric' && <p>{product.fabric}</p>}
                  {activeTab === 'fit' && <p>{product.fit}</p>}
                  {activeTab === 'care' && <p>{product.care}</p>}
                  {activeTab === 'shipping' && <p>{product.shipping}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#EAE5DE]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] tracking-[0.24em] uppercase text-[#7C746B] font-medium">
                  COMPLETE THE LOOK
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1D1D1B] mt-1">
                  Complementary Atelier Silhouettes
                </h2>
              </div>
              <button
                onClick={onNavigateStore}
                className="text-xs uppercase tracking-widest text-[#1D1D1B] hover:text-[#BA945A] underline"
              >
                View full catalog →
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  currency={currency}
                  isWishlisted={false}
                  onToggleWishlist={onToggleWishlist}
                  onQuickAdd={(item, sz) =>
                    onAddToCart(
                      item,
                      (item.colors && item.colors[0]) || { name: 'Standard', hex: '#1D1D1B' },
                      sz,
                      1
                    )
                  }
                  onClick={onSelectRelatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
