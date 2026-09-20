import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  currency?: Currency;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items = [],
  currency = 'EGP' as Currency,
  onClearCart
}) => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    governorate: 'Cairo (القاهرة)',
    city: 'New Cairo',
    street: '',
    apartment: '',
    deliveryMethod: 'express',
    paymentMethod: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const safeItems = (items || []).filter((item) => item && item.product);

  const subtotalEgp = safeItems.reduce(
    (sum, item) => sum + (item.product.priceEgp || 0) * (item.quantity || 1),
    0
  );

  // Free shipping above 2,500 EGP
  const shippingFeeEgp = subtotalEgp >= 2500 ? 0 : 85;
  const discountEgp = Math.round((subtotalEgp * discountPercent) / 100);
  const finalTotalEgp = subtotalEgp - discountEgp + shippingFeeEgp;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'LOREA10') {
      setDiscountPercent(10);
      setCouponError('');
    } else {
      setCouponError('Invalid promotion code. Try LOREA10 for 10% off.');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Build order items array
      const orderItemsPayload = safeItems.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        size: i.selectedSize,
        color: i.selectedColor.name,
        quantity: i.quantity,
        price: i.product.priceEgp,
        image: i.product.images?.[0] || '',
      }));

      // Call real backend orders API
      const result = await api.orders.create({
        items: orderItemsPayload,
        subtotalEgp,
        shippingFeeEgp,
        discountEgp,
        totalEgp: finalTotalEgp,
        currency,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          governorate: formData.governorate,
          city: formData.city,
          street: formData.street,
          apartment: formData.apartment,
        },
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        couponCode: discountPercent > 0 ? couponCode : undefined,
      });

      setOrderNumber(result?.order?.order_number || `LOR-${Math.floor(100000 + Math.random() * 900000)}`);
      setStep('success');
      onClearCart();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'We could not place your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const egyptianGovernorates = [
    'Cairo (القاهرة)',
    'Giza (الجيزة)',
    'Alexandria (الإسكندرية)',
    'Red Sea (الغردقة والجونة)',
    'South Sinai (شرم الشيخ ودهب)',
    'Mansoura & Dakahlia (المنصورة)',
    'Tanta & Gharbia (طنطا)',
    'Sharqia (الشرقية)',
    'Assiut (أسيوط)',
    'International Express (United States, UAE, UK, EU)'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex justify-center items-start p-2 sm:p-4 md:p-6 lg:p-10 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#F7F4EF] shadow-2xl border border-[#EAE5DE] my-auto overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#EAE5DE] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <span className="font-serif tracking-[0.24em] text-xl text-[#1D1D1B] font-light">
              LORÉA
            </span>
            <span className="text-xs text-[#7C746B]">· Secure Checkout</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#1D1D1B] hover:text-[#B88F88] transition-colors"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: Customer & Shipping Details (7 Cols) */}
              <div className="lg:col-span-7 space-y-8">
                {/* 1. Contact Information */}
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#1D1D1B] mb-4 pb-1 border-b border-[#EAE5DE]">
                    1. Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-[#7C746B] mb-1 font-light">First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="e.g. Layla"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D4CCC2] text-xs text-[#1D1D1B] focus:outline-hidden focus:border-[#1D1D1B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#7C746B] mb-1 font-light">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="e.g. Mansour"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D4CCC2] text-xs text-[#1D1D1B] focus:outline-hidden focus:border-[#1D1D1B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#7C746B] mb-1 font-light">Email for tracking *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="layla@example.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D4CCC2] text-xs text-[#1D1D1B] focus:outline-hidden focus:border-[#1D1D1B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#7C746B] mb-1 font-light">Mobile Number (Egypt) *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+20 10X XXX XXXX"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D4CCC2] text-xs text-[#1D1D1B] focus:outline-hidden focus:border-[#1D1D1B]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Address */}
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#1D1D1B] mb-4 pb-1 border-b border-[#EAE5DE]">
                    2. Delivery Address
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] text-[#7C746B] mb-1 font-light">Governorate / Region *</label>
                      <select
                        value={formData.governorate}
                        onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D4CCC2] text-xs text-[#1D1D1B] focus:outline-hidden"
                      >
                        {egyptianGovernorates.map((gov) => (
                          <option key={gov} value={gov}>
                            {gov}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-[#7C746B] mb-1 font-light">District / City *</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g. New Cairo / Zamalek / Maadi"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#D4CCC2] text-xs text-[#1D1D1B] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#7C746B] mb-1 font-light">Street & Building *</label>
                        <input
                          type="text"
                          required
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          placeholder="Street name, building #"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#D4CCC2] text-xs text-[#1D1D1B] focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#1D1D1B] mb-4 pb-1 border-b border-[#EAE5DE]">
                    3. Payment Method
                  </h3>
                  <div className="space-y-3">
                    {/* Cash on Delivery (COD) - Ideal for Egypt */}
                    <label
                      className={`flex items-start p-3.5 border cursor-pointer transition-all ${
                        formData.paymentMethod === 'cod'
                          ? 'border-[#1D1D1B] bg-white ring-1 ring-[#1D1D1B]'
                          : 'border-[#D4CCC2] bg-[#FAF8F5]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="mt-0.5 mr-3 accent-[#1D1D1B]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Banknote className="w-4 h-4 text-emerald-800" />
                          <span className="text-xs font-medium text-[#1D1D1B]">
                            Cash on Delivery (الدفع عند الاستلام)
                          </span>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-xs font-medium">
                            MOST POPULAR IN EGYPT
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7C746B] mt-1 font-light">
                          Inspect your garment in person before completing payment to the courier.
                        </p>
                      </div>
                    </label>

                    {/* Credit / Debit Card */}
                    <label
                      className={`flex items-start p-3.5 border cursor-pointer transition-all ${
                        formData.paymentMethod === 'card'
                          ? 'border-[#1D1D1B] bg-white ring-1 ring-[#1D1D1B]'
                          : 'border-[#D4CCC2] bg-[#FAF8F5]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        className="mt-0.5 mr-3 accent-[#1D1D1B]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-[#1D1D1B]" />
                          <span className="text-xs font-medium text-[#1D1D1B]">
                            Credit / Debit Card (Visa, MasterCard, Meeza)
                          </span>
                        </div>
                        {formData.paymentMethod === 'card' && (
                          <div className="mt-3 space-y-2 pt-2 border-t border-[#EAE5DE]">
                            <input
                              type="text"
                              placeholder="Card number (4000 1234 5678 9010)"
                              value={formData.cardNumber}
                              onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#D4CCC2] text-xs font-mono"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="MM / YY"
                                value={formData.cardExpiry}
                                onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                                className="px-3 py-2 bg-white border border-[#D4CCC2] text-xs font-mono"
                              />
                              <input
                                type="text"
                                placeholder="CVC"
                                value={formData.cardCvc}
                                onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                                className="px-3 py-2 bg-white border border-[#D4CCC2] text-xs font-mono"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary (5 Cols) */}
              <div className="lg:col-span-5 bg-[#FAF8F5] p-6 border border-[#EAE5DE] flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#1D1D1B] mb-4 pb-2 border-b border-[#EAE5DE]">
                    Order Summary ({safeItems.length} items)
                  </h3>

                  {/* Cart preview */}
                  <div className="space-y-3 max-h-56 overflow-y-auto mb-6 pr-1 divide-y divide-[#EAE5DE]">
                    {safeItems.map((item) => (
                      <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'}
                            alt={item.product?.name || 'Garment'}
                            className="w-10 h-12 object-cover bg-[#EAE5DE]"
                          />
                          <div>
                            <p className="font-medium text-[#1D1D1B] line-clamp-1">{item.product?.name}</p>
                            <p className="text-[10px] text-[#7C746B]">
                              Size {item.selectedSize} · {item.selectedColor?.name || 'Standard'} · Qty {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium text-[#1D1D1B]">
                          {formatPrice((item.product?.priceEgp || 0) * (item.quantity || 1), currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Input */}
                  <div className="mb-6 pt-2 border-t border-[#EAE5DE]">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon code (e.g. LOREA10)"
                        className="flex-1 px-3 py-2 bg-white border border-[#D4CCC2] text-xs uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-[#1D1D1B] text-[#F7F4EF] text-xs font-medium uppercase tracking-wider hover:bg-[#333]"
                      >
                        APPLY
                      </button>
                    </div>
                    {discountPercent > 0 && (
                      <p className="text-[11px] text-emerald-800 mt-1 font-medium">
                        ✓ 10% atelier voucher applied successfully!
                      </p>
                    )}
                    {couponError && (
                      <p className="text-[11px] text-rose-700 mt-1">{couponError}</p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 pt-2 border-t border-[#EAE5DE] text-xs text-[#7C746B]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-[#1D1D1B]">{formatPrice(subtotalEgp, currency)}</span>
                    </div>
                    {discountEgp > 0 && (
                      <div className="flex justify-between text-emerald-800 font-medium">
                        <span>Atelier Discount (10%)</span>
                        <span>-{formatPrice(discountEgp, currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping ({subtotalEgp >= 2500 ? 'Complimentary' : 'Standard'})</span>
                      <span className="text-[#1D1D1B]">
                        {shippingFeeEgp === 0 ? 'FREE' : formatPrice(shippingFeeEgp, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-[#1D1D1B] pt-3 border-t border-[#EAE5DE]">
                      <span>Final Total</span>
                      <span className="font-serif text-lg sm:text-xl">
                        {formatPrice(finalTotalEgp, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#1D1D1B] text-[#F7F4EF] hover:bg-[#2A2928] text-xs tracking-[0.24em] uppercase font-medium flex items-center justify-center space-x-2 shadow-lg disabled:opacity-75 transition-all"
                  >
                    {isSubmitting ? (
                      <span>PREPARING ATELIER DISPATCH...</span>
                    ) : (
                      <span>CONFIRM ORDER · {formatPrice(finalTotalEgp, currency)}</span>
                    )}
                  </button>

                  {submitError && (
                    <p role="alert" className="text-xs text-rose-800 bg-rose-50 border border-rose-200 px-3 py-2">
                      {submitError}
                    </p>
                  )}

                  <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#7C746B]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Free 14-day exchange across Cairo and Alexandria</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* Order Confirmation Screen */
          <div className="p-8 sm:p-12 text-center max-w-lg mx-auto py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 stroke-[2]" />
            </div>

            <span className="text-[11px] tracking-[0.3em] uppercase text-[#7C746B] font-medium block mb-2">
              ORDER CONFIRMED
            </span>

            <h2 className="font-serif text-3xl font-light text-[#1D1D1B] mb-2">
              Thank You, {formData.firstName || 'Client'}
            </h2>

            <p className="text-xs font-mono text-[#7C746B] bg-[#EFECE6] py-1 px-3 inline-block rounded-xs mb-4">
              Order #{orderNumber}
            </p>

            <p className="text-sm text-[#7C746B] font-light leading-relaxed mb-6">
              Your garments are being carefully hand-inspected in our Cairo atelier. A confirmation dispatch message has been sent to your email and WhatsApp.
            </p>

            <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DE] text-left text-xs text-[#7C746B] space-y-1 mb-8">
              <p><strong>Delivery To:</strong> {formData.street}, {formData.city}, {formData.governorate}</p>
              <p><strong>Payment Method:</strong> {formData.paymentMethod === 'cod' ? 'Cash on Delivery (عند الاستلام)' : 'Card Payment'}</p>
              <p><strong>Estimated Arrival:</strong> 24–48 hours across Egypt</p>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 bg-[#1D1D1B] text-[#F7F4EF] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333]"
            >
              RETURN TO LORÉA ATELIER
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
