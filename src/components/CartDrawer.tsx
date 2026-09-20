import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { CartItem, Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: () => void;
  recommendedProducts?: Product[];
  onAddRecommended: (product: Product) => void;
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
  onAddRecommended
}) => {
  if (!isOpen) return null;

  const safeItems = (items || []).filter((item) => item && item.product);

  const subtotalEgp = safeItems.reduce(
    (sum, item) => sum + (item.product.priceEgp || 0) * (item.quantity || 1),
    0
  );

  // Free shipping threshold: 2,500 EGP
  const freeShippingThreshold = 2500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotalEgp);
  const progressPercent = Math.min(100, (subtotalEgp / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F4EF] shadow-2xl flex flex-col h-full z-10 border-l border-[#EAE5DE]">
          {/* Header */}
          <div className="p-6 border-b border-[#EAE5DE] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#1D1D1B] stroke-[1.5]" />
              <h3 className="font-serif text-2xl font-light text-[#1D1D1B]">
                Shopping Bag
              </h3>
              <span className="text-xs text-[#7C746B] font-light">
                ({safeItems.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#1D1D1B] hover:text-[#B88F88] transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-3.5 bg-[#EFECE6] border-b border-[#EAE5DE]">
            {remainingForFreeShipping === 0 ? (
              <p className="text-xs text-[#1D1D1B] font-medium flex items-center">
                <span className="text-emerald-700 mr-1.5 font-bold">✓</span>
                Complimentary delivery unlocked for your order!
              </p>
            ) : (
              <p className="text-xs text-[#7C746B] font-light">
                Add <strong className="text-[#1D1D1B] font-medium">{formatPrice(remainingForFreeShipping, currency)}</strong> more for complimentary delivery across Egypt.
              </p>
            )}
            <div className="w-full bg-[#D4CCC2] h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#1D1D1B] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EAE5DE]">
            {safeItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#EFECE6] flex items-center justify-center mb-4 text-[#7C746B]">
                  <ShoppingBag className="w-7 h-7 stroke-[1]" />
                </div>
                <h4 className="font-serif text-xl font-light text-[#1D1D1B] mb-2">
                  Your bag is currently empty
                </h4>
                <p className="text-xs text-[#7C746B] font-light max-w-xs mb-6">
                  Discover our architectural silhouettes in pure French linen and Giza 45 cotton.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#1D1D1B] text-[#F7F4EF] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors"
                >
                  START BROWSING
                </button>
              </div>
            ) : (
              safeItems.map((item) => (
                <div key={item.id} className="py-5 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'}
                    alt={item.product?.name || 'Garment'}
                    className="w-20 h-26 object-cover bg-[#EAE5DE] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-sans text-sm font-normal text-[#1D1D1B] line-clamp-1 pr-2">
                          {item.product?.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#A0988E] hover:text-[#964036] transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#7C746B] space-x-2 mt-1 font-light">
                        <span>Color: {item.selectedColor?.name || 'Standard'}</span>
                        <span>·</span>
                        <span>Size: {item.selectedSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#D4CCC2]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#EAE5DE] text-[#1D1D1B] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#EAE5DE] text-[#1D1D1B] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <span className="text-sm font-medium text-[#1D1D1B]">
                        {formatPrice(item.product.priceEgp * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Recommended Companion Products */}
            {items.length > 0 && (recommendedProducts || []).length > 0 && (
              <div className="pt-6 pb-2">
                <p className="text-[10px] uppercase tracking-[0.24em] font-medium text-[#7C746B] mb-3">
                  COMPLETE THE LOOK
                </p>
                <div className="space-y-3">
                  {(recommendedProducts || []).slice(0, 2).map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-2.5 bg-[#EFECE6]/60 border border-[#EAE5DE]"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={rec.images[0]}
                          alt={rec.name}
                          className="w-12 h-14 object-cover bg-[#EAE5DE]"
                        />
                        <div>
                          <p className="text-xs font-medium text-[#1D1D1B] line-clamp-1">{rec.name}</p>
                          <p className="text-[11px] text-[#7C746B]">{formatPrice(rec.priceEgp, currency)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onAddRecommended(rec)}
                        className="text-[10px] tracking-[0.16em] uppercase font-medium px-2.5 py-1.5 bg-[#1D1D1B] text-[#F7F4EF] hover:bg-[#333]"
                      >
                        + ADD
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Subtotal & Checkout */}
          {safeItems.length > 0 && (
            <div className="p-6 border-t border-[#EAE5DE] bg-[#F7F4EF] space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-[0.18em] text-[#7C746B]">
                  Estimated Subtotal
                </span>
                <span className="font-serif text-xl sm:text-2xl font-normal text-[#1D1D1B]">
                  {formatPrice(subtotalEgp, currency)}
                </span>
              </div>

              <p className="text-[11px] text-[#7C746B] font-light">
                Taxes calculated at checkout. Free returns within 14 days.
              </p>

              <button
                id="cart-checkout-btn"
                onClick={onCheckout}
                className="w-full py-4 bg-[#1D1D1B] text-[#F7F4EF] hover:bg-[#2A2928] text-xs tracking-[0.24em] uppercase font-medium flex items-center justify-center space-x-2 transition-all shadow-md active:scale-99"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-[#7C746B] font-light">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Encrypted 256-bit SSL · Cash on Delivery available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
