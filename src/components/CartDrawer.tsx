import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, ArrowLeft } from 'lucide-react';
import { CartItem, Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { useOverlayAccessibility } from '../hooks/useOverlayAccessibility';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: () => void;
  recommendedProducts?: Product[];
  onAddRecommended?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onContinueShopping?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items = [],
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  recommendedProducts = [],
  onAddRecommended,
  onSelectProduct,
  onContinueShopping
}) => {
  // ESC key and body scroll lock
  useOverlayAccessibility({
    isOpen,
    onClose
  });

  if (!isOpen) return null;

  const safeItems = (items || []).filter((item) => item && item.product);

  const subtotalEgp = safeItems.reduce(
    (sum, item) => sum + (item.product.priceEgp || 0) * (item.quantity || 1),
    0
  );

  const totalItemsCount = safeItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

  // Free shipping threshold: 2,500 EGP
  const freeShippingThreshold = 2500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotalEgp);
  const progressPercent = Math.min(100, (subtotalEgp / freeShippingThreshold) * 100);

  const handleContinue = () => {
    onClose();
    if (onContinueShopping) {
      onContinueShopping();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* 1. Backdrop (Click outside closes the drawer) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-out Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-[360px] min-[400px]:max-w-[400px] sm:max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col h-full z-10 border-l border-[#EAE5DE] animate-in slide-in-from-right duration-300 ease-out"
        >
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-[#EAE5DE] flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-[#1D1D1B] stroke-[1.4]" />
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1D1D1B]">
                Shopping Bag
              </h3>
              {totalItemsCount > 0 && (
                <span className="text-[10px] bg-[#1D1D1B] text-white px-2 py-0.5 rounded-full font-mono">
                  {totalItemsCount}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center p-1.5 text-[#1D1D1B] hover:text-[#BA945A] hover:bg-[#FAF8F5] rounded-xs transition-colors cursor-pointer active:scale-95"
              aria-label="Close Shopping Bag (ESC)"
              title="Close (ESC)"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3 bg-[#F0EDE8] border-b border-[#EAE5DE]">
            {remainingForFreeShipping === 0 ? (
              <p className="text-xs text-[#1D1D1B] font-medium flex items-center">
                <span className="text-emerald-700 mr-1.5 font-bold">✓</span>
                Complimentary delivery unlocked for your order!
              </p>
            ) : (
              <p className="text-[11px] sm:text-xs text-[#7C746B] font-light">
                Add <strong className="text-[#1D1D1B] font-medium">{formatPrice(remainingForFreeShipping, currency)}</strong> more for complimentary delivery.
              </p>
            )}
            <div className="w-full bg-[#D4CCC2] h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#BA945A] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-[#EAE5DE]">
            {safeItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-[#EFECE6] flex items-center justify-center mb-4 text-[#7C746B]">
                  <ShoppingBag className="w-7 h-7 stroke-[1]" />
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-light text-[#1D1D1B] mb-2">
                  Your bag is currently empty
                </h4>
                <p className="text-xs text-[#7C746B] font-light max-w-xs mb-6 leading-relaxed">
                  Discover refined silhouettes, tailored suits, and fluid evening gowns curated for effortless poise.
                </p>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="px-8 py-3 bg-[#1D1D1B] text-[#FAF8F5] hover:bg-[#BA945A] text-xs uppercase tracking-[0.22em] font-medium transition-colors cursor-pointer shadow-xs active:scale-98"
                >
                  EXPLORE THE COLLECTION
                </button>
              </div>
            ) : (
              safeItems.map((item) => {
                const itemImg = item.product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop';
                const itemPrice = item.product.priceEgp || 0;

                return (
                  <div key={item.id} className="py-4 flex gap-3.5 sm:gap-4">
                    {/* Thumbnail */}
                    <div
                      onClick={() => onSelectProduct?.(item.product)}
                      className="w-20 h-26 bg-[#EAE5DE] overflow-hidden shrink-0 cursor-pointer border border-[#EAE5DE] group"
                    >
                      <img
                        src={itemImg}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Information & Controls */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            onClick={() => onSelectProduct?.(item.product)}
                            className="font-serif text-base sm:text-lg text-[#1D1D1B] font-normal leading-snug line-clamp-1 cursor-pointer hover:text-[#BA945A] transition-colors"
                          >
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-[#7C746B] hover:text-[#964036] transition-colors cursor-pointer"
                            aria-label={`Remove ${item.product.name} from bag`}
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Variant Chips */}
                        <div className="flex items-center space-x-2 text-[11px] text-[#7C746B] font-mono mt-1">
                          {item.selectedSize && (
                            <span className="bg-white px-1.5 py-0.5 border border-[#EAE5DE]">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor?.name && (
                            <span className="bg-white px-1.5 py-0.5 border border-[#EAE5DE] flex items-center space-x-1">
                              <span
                                className="w-2 h-2 rounded-full inline-block border border-black/10"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <span>{item.selectedColor.name}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Row: Quantity Stepper & Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#D4CCC2] bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center text-[#1D1D1B] hover:bg-[#FAF8F5] disabled:opacity-30 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#1D1D1B] hover:bg-[#FAF8F5] cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-serif text-sm sm:text-base font-normal text-[#1D1D1B]">
                          {formatPrice(itemPrice * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {safeItems.length > 0 && (
            <div className="p-5 bg-white border-t border-[#EAE5DE] space-y-3">
              {/* Subtotal */}
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#7C746B]">
                  Subtotal
                </span>
                <span className="font-serif text-2xl font-light text-[#1D1D1B]">
                  {formatPrice(subtotalEgp, currency)}
                </span>
              </div>

              <p className="text-[11px] text-[#7C746B] font-light">
                Shipping, duties, and taxes calculated at checkout.
              </p>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3.5 bg-[#1D1D1B] text-[#FAF8F5] hover:bg-[#BA945A] text-xs uppercase tracking-[0.24em] font-medium transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-md active:scale-[0.98]"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Continue Shopping Link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="text-xs tracking-wider uppercase text-[#7C746B] hover:text-[#1D1D1B] underline underline-offset-4 cursor-pointer font-light"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
