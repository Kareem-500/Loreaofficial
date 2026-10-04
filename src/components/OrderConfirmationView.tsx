import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { api, Order } from '../services/api';
import { LoreaLogo } from './LoreaLogo';
import { SITE_CONFIG } from '../config/site';

interface OrderConfirmationViewProps {
  orderNumber?: string;
  currency: Currency;
  onNavigateToShop: () => void;
  onNavigateToAccount: () => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  orderNumber: propOrderNumber,
  currency,
  onNavigateToShop,
  onNavigateToAccount,
}) => {
  const [orderNumber, setOrderNumber] = useState<string>(() => {
    if (propOrderNumber) return propOrderNumber;
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('order') || params.get('orderNumber') || localStorage.getItem('lorea_last_order_num') || 'LOR-2026-001';
    } catch {
      return 'LOR-2026-001';
    }
  });

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      try {
        localStorage.setItem('lorea_last_order_num', orderNumber);
      } catch {}

      setIsLoading(true);
      api.account.getOrderDetails(orderNumber)
        .then((res) => {
          if (res?.order) {
            setOrder(res.order);
          }
        })
        .catch((err) => {
          console.warn('Could not fetch remote order snapshot, using stored summary:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [orderNumber]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1D1D1B] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header confirmation card */}
        <div className="bg-[#151413] text-[#FAF8F5] p-8 sm:p-12 border border-[#2A2826] shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#BA945A]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#BA945A]/20 border border-[#BA945A]/40 mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#BA945A]" />
          </div>

          <p className="text-[11px] uppercase tracking-[0.3em] font-mono text-[#BA945A] mb-2 font-semibold">
            ACQUISITION CONFIRMED
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-wide mb-3">
            Thank You for Your Order
          </h1>
          <p className="text-sm text-[#B7ADA2] max-w-md mx-auto font-light leading-relaxed">
            Your couture selection has been received by our Cairo atelier. We are preparing your garment with meticulous hand-tailoring.
          </p>

          <div className="mt-8 pt-6 border-t border-[#2A2826] inline-flex flex-wrap items-center justify-center gap-6 text-xs font-mono">
            <div>
              <span className="text-[#7C746B] block text-[10px] uppercase tracking-wider mb-0.5">Order Number</span>
              <span className="text-white font-medium text-sm">{orderNumber}</span>
            </div>
            <div className="w-px h-8 bg-[#333] hidden sm:block" />
            <div>
              <span className="text-[#7C746B] block text-[10px] uppercase tracking-wider mb-0.5">Estimated Delivery</span>
              <span className="text-[#BA945A] font-medium">2–3 Business Days (Cairo/Giza)</span>
            </div>
            <div className="w-px h-8 bg-[#333] hidden sm:block" />
            <div>
              <span className="text-[#7C746B] block text-[10px] uppercase tracking-wider mb-0.5">Payment Method</span>
              <span className="text-white font-medium">{order?.payment_method || 'Cash on Delivery (Egypt)'}</span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="mt-8 bg-white border border-[#EBE7DF] p-6 sm:p-10 shadow-xs space-y-8">
          {/* Order items if available */}
          {order?.items && order.items.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-mono text-[#7C746B] mb-4 font-semibold">
                Garments Reserved
              </h2>
              <div className="divide-y divide-[#F0EDE6]">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name_snapshot}
                          className="w-16 h-20 object-cover bg-[#F7F4EF] border border-[#EBE7DF] shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-[#F7F4EF] border border-[#EBE7DF] flex items-center justify-center text-[#7C746B] shrink-0">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-serif text-base text-[#1D1D1B] font-normal">
                          {item.product_name_snapshot}
                        </h3>
                        <p className="text-xs text-[#7C746B] font-mono mt-0.5">
                          {item.color_name} · Size {item.size} · Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm text-[#1D1D1B] font-medium">
                        {formatPrice(item.total, currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery & Timeline Steps */}
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-mono text-[#7C746B] mb-4 font-semibold">
              Delivery Trajectory
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF8F5] p-5 border border-[#EBE7DF]">
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-full bg-[#1D1D1B] text-white flex items-center justify-center text-xs font-mono shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1D1D1B]">Atelier Preparation</h4>
                  <p className="text-[11px] text-[#7C746B] mt-0.5 leading-tight">Steaming, inspection, and bespoke wrapping.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-full bg-[#BA945A] text-white flex items-center justify-center text-xs font-mono shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1D1D1B]">Express Dispatch</h4>
                  <p className="text-[11px] text-[#7C746B] mt-0.5 leading-tight">Courier assignment via Bosta Express.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-xs font-mono shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1D1D1B]">Doorstep Presentation</h4>
                  <p className="text-[11px] text-[#7C746B] mt-0.5 leading-tight">Contactless delivery across Cairo & Governorates.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Concierge & Support Box */}
          <div className="border-t border-[#EBE7DF] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7C746B]">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#BA945A]" />
              <span>Complimentary 14-day atelier exchange policy</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href={`mailto:${SITE_CONFIG.contact.email}`} className="hover:text-[#1D1D1B] flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Concierge Desk</span>
              </a>
              <span>·</span>
              <a href={`tel:${SITE_CONFIG.contact.phone}`} className="hover:text-[#1D1D1B] flex items-center space-x-1 font-mono">
                <Phone className="w-3.5 h-3.5" />
                <span>{SITE_CONFIG.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onNavigateToShop}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#151413] hover:bg-[#BA945A] text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Exploring Collection</span>
          </button>
          <button
            onClick={onNavigateToAccount}
            className="w-full sm:w-auto px-8 py-3.5 border border-[#1D1D1B] text-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>View Order in Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
