import React from 'react';
import { Breadcrumbs } from './common/Breadcrumbs';
import { Mail, Phone, MessageSquare, Truck, RotateCcw, HelpCircle, ArrowRight } from 'lucide-react';

interface CustomerCareViewProps {
  page: 'contact' | 'shipping' | 'returns' | 'faq';
  onNavigateHome: () => void;
  onNavigateStore: () => void;
}

export const CustomerCareView: React.FC<CustomerCareViewProps> = ({
  page,
  onNavigateHome,
  onNavigateStore
}) => {
  const titles = {
    contact: {
      title: 'Atelier Concierge & Contact',
      subtitle: 'Personalized styling assistance, custom garment sizing, and Cairo atelier appointments.'
    },
    shipping: {
      title: 'Shipping & White-Glove Delivery',
      subtitle: 'Complimentary shipping across Egypt and expedited courier delivery worldwide.'
    },
    returns: {
      title: 'Complimentary 14-Day Returns & Exchanges',
      subtitle: 'Hassle-free return pickups in Cairo, Giza, and Alexandria with full refunds.'
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know regarding fabrics, orders, care, and payments.'
    }
  };

  const current = titles[page] || titles.contact;

  return (
    <div className="bg-[#F7F4EF] min-h-screen pb-20">
      {/* Breadcrumb Strip */}
      <div className="bg-white border-b border-[#EAE5DE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5">
          <Breadcrumbs
            items={[
              { label: 'Home', onClick: onNavigateHome },
              { label: 'Customer Care' },
              { label: current.title }
            ]}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        <div className="bg-white border border-[#EAE5DE] p-8 sm:p-12 shadow-xs">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#BA945A] font-medium block mb-2 font-mono">
            LORÉA CLIENT SERVICES
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1D1B] font-light mb-3">
            {current.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#7C746B] font-light leading-relaxed mb-10 pb-6 border-b border-[#EAE5DE]">
            {current.subtitle}
          </p>

          {/* Page 1: Contact */}
          {page === 'contact' && (
            <div className="space-y-8 text-xs sm:text-sm text-[#1D1D1B]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-[#FAF8F5] border border-[#EAE5DE]">
                  <MessageSquare className="w-5 h-5 text-[#BA945A] mb-3" />
                  <h2 className="font-serif text-lg font-medium text-[#1D1D1B]">WhatsApp Concierge</h2>
                  <p className="text-xs text-[#7C746B] mt-1 mb-4 font-light">
                    Direct access to our Cairo styling atelier for quick questions, sizing advice, and tracking.
                  </p>
                  <a
                    href="https://wa.me/201000000000"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs uppercase font-semibold tracking-wider text-[#1D1D1B] hover:text-[#BA945A]"
                  >
                    <span>Message Concierge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-6 bg-[#FAF8F5] border border-[#EAE5DE]">
                  <Mail className="w-5 h-5 text-[#BA945A] mb-3" />
                  <h2 className="font-serif text-lg font-medium text-[#1D1D1B]">Email Concierge</h2>
                  <p className="text-xs text-[#7C746B] mt-1 mb-4 font-light">
                    Our client care advisors respond within 4 hours during atelier business days.
                  </p>
                  <a
                    href="mailto:concierge@lorea.eg"
                    className="inline-flex items-center space-x-1 text-xs uppercase font-semibold tracking-wider text-[#1D1D1B] hover:text-[#BA945A]"
                  >
                    <span>concierge@lorea.eg</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-6 border border-[#EAE5DE] rounded-xs bg-white">
                <h2 className="font-serif text-xl font-light text-[#1D1D1B] mb-2">Cairo Atelier Location</h2>
                <p className="text-xs text-[#7C746B] font-light leading-relaxed">
                  Zamalek, Cairo, Egypt · By appointment only for private fittings and bespoke silk tailoring.
                </p>
                <p className="text-xs text-[#7C746B] mt-2 font-mono">
                  Hours: Sunday – Thursday · 10:00 AM – 7:00 PM CLT
                </p>
              </div>
            </div>
          )}

          {/* Page 2: Shipping */}
          {page === 'shipping' && (
            <div className="space-y-6 text-xs sm:text-sm text-[#7C746B] font-light leading-relaxed">
              <div>
                <h2 className="font-serif text-xl font-medium text-[#1D1D1B] mb-2">Domestic Shipping (Egypt)</h2>
                <p>
                  • <strong>Cairo & Giza:</strong> Complimentary on all orders exceeding 2,500 EGP. Standard delivery is 24 to 48 hours. Same-day express dispatch available upon request via concierge.
                </p>
                <p className="mt-2">
                  • <strong>Alexandria & Delta:</strong> 2 to 3 business days. Flat rate of 95 EGP on orders below threshold.
                </p>
                <p className="mt-2">
                  • <strong>Red Sea & Upper Egypt:</strong> 3 to 5 business days via temperature-controlled courier.
                </p>
              </div>

              <div className="pt-6 border-t border-[#EAE5DE]">
                <h2 className="font-serif text-xl font-medium text-[#1D1D1B] mb-2">International Shipping (GCC & Worldwide)</h2>
                <p>
                  We dispatch via DHL Express Worldwide. Orders to UAE, Saudi Arabia, Kuwait, and Qatar arrive within 3 to 5 business days. European and North American deliveries take 4 to 6 business days.
                </p>
              </div>

              <div className="pt-6 border-t border-[#EAE5DE]">
                <h2 className="font-serif text-xl font-medium text-[#1D1D1B] mb-2">Signature Archive Packaging</h2>
                <p>
                  Every garment arrives encased in breathable acid-free cotton tissue, accompanied by a cedar sachet to preserve fiber integrity, housed in our bespoke linen-embossed keepsake box.
                </p>
              </div>
            </div>
          )}

          {/* Page 3: Returns */}
          {page === 'returns' && (
            <div className="space-y-6 text-xs sm:text-sm text-[#7C746B] font-light leading-relaxed">
              <div>
                <h2 className="font-serif text-xl font-medium text-[#1D1D1B] mb-2">14-Day Return Guarantee</h2>
                <p>
                  We invite you to try your LORÉA garments in the comfort of your home. If a silhouette or size is not entirely satisfactory, you may request a complimentary exchange or full refund within 14 calendar days of receipt.
                </p>
              </div>

              <div className="pt-6 border-t border-[#EAE5DE]">
                <h2 className="font-serif text-xl font-medium text-[#1D1D1B] mb-2">Return Conditions</h2>
                <p>
                  Items must be unworn, unwashed, with all original security tags and fabric tags intact. Garments showing makeup traces or fragrance will be returned to client.
                </p>
              </div>

              <div className="pt-6 border-t border-[#EAE5DE]">
                <h2 className="font-serif text-xl font-medium text-[#1D1D1B] mb-2">Initiate an Exchange or Pickup</h2>
                <p>
                  Contact our Concierge via WhatsApp or email with your order number. Our courier will arrive at your address to collect the garment at zero courier cost.
                </p>
              </div>
            </div>
          )}

          {/* Page 4: FAQ */}
          {page === 'faq' && (
            <div className="space-y-6 text-xs sm:text-sm">
              <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DE]">
                <h2 className="font-serif text-base font-medium text-[#1D1D1B] mb-1">
                  What makes Egyptian Giza 45 cotton unique?
                </h2>
                <p className="text-xs text-[#7C746B] font-light leading-relaxed">
                  Giza 45 represents the pinnacle 0.5% of Egyptian cotton harvest. Its extra-long staple fiber allows micro-spinning into gossamer yarns that feel softer than silk yet become stronger with each gentle wash.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DE]">
                <h2 className="font-serif text-base font-medium text-[#1D1D1B] mb-1">
                  What payment methods are supported?
                </h2>
                <p className="text-xs text-[#7C746B] font-light leading-relaxed">
                  We accept Cash on Delivery (COD) across Egypt, Visa, Mastercard, Meeza, Fawry, and Apple Pay.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DE]">
                <h2 className="font-serif text-base font-medium text-[#1D1D1B] mb-1">
                  How do I choose the correct size?
                </h2>
                <p className="text-xs text-[#7C746B] font-light leading-relaxed">
                  Each product includes an interactive size guide modal with centimetre measurements for bust, waist, and hips. When in doubt, our WhatsApp Concierge can provide bespoke sizing suggestions.
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-[#EAE5DE] flex justify-between items-center">
            <button
              onClick={onNavigateStore}
              className="px-6 py-2.5 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-wider font-medium hover:bg-[#BA945A] transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={onNavigateHome}
              className="text-xs uppercase tracking-wider text-[#7C746B] hover:text-[#1D1D1B]"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
