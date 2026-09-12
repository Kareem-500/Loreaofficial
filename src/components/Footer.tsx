import React from 'react';
import { LoreaLogo } from './LoreaLogo';
import { Instagram, Facebook, Mail, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#151413] text-[#F7F4EF] pt-20 pb-12 border-t border-[#262422]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section with 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-[#2A2826]">
          {/* Column 1: Brand Statement (2 cols on large screen) */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <LoreaLogo variant="dark" subtext={true} className="items-start" />
            </div>
            <p className="text-sm text-[#B7ADA2] font-light leading-relaxed max-w-sm mb-6">
              Quiet luxury women’s fashion rooted in the rare craftsmanship of Egyptian extra-long staple cotton and natural flax linens. Designed in Cairo, made for effortless global elegance.
            </p>
            <div className="flex items-center space-x-4 text-[#B7ADA2]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center hover:text-white hover:border-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 stroke-[1.5]" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center hover:text-white hover:border-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 stroke-[1.5]" />
              </a>
              <a
                href="mailto:concierge@lorea-atelier.com"
                className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center hover:text-white hover:border-white transition-colors"
                aria-label="Email Atelier Concierge"
              >
                <Mail className="w-4 h-4 stroke-[1.5]" />
              </a>
            </div>
          </div>

          {/* Column 2: SHOP */}
          <div>
            <h4 className="text-[11px] tracking-[0.24em] uppercase font-medium text-[#F7F4EF] mb-5">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B7ADA2] font-light">
              <li>
                <button onClick={() => onNavigate('new-in')} className="hover:text-[#F7F4EF] transition-colors">
                  New In
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Dresses')} className="hover:text-[#F7F4EF] transition-colors">
                  Dresses
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Tops')} className="hover:text-[#F7F4EF] transition-colors">
                  Tops & Blouses
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Sets')} className="hover:text-[#F7F4EF] transition-colors">
                  Coordinated Sets
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Outerwear')} className="hover:text-[#F7F4EF] transition-colors">
                  Outerwear & Coats
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Pants')} className="hover:text-[#F7F4EF] transition-colors">
                  Trousers & Skirts
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Modest Edit')} className="hover:text-[#F7F4EF] transition-colors">
                  Modest Edit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sale')} className="text-[#C47E75] hover:text-[#D18E85] transition-colors">
                  Archive Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: HELP & CLIENT SERVICES */}
          <div>
            <h4 className="text-[11px] tracking-[0.24em] uppercase font-medium text-[#F7F4EF] mb-5">
              CLIENT SERVICES
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B7ADA2] font-light">
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#F7F4EF] transition-colors">
                  Atelier Concierge & WhatsApp
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shipping')} className="hover:text-[#F7F4EF] transition-colors">
                  Shipping & Delivery (Egypt & Int’l)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('returns')} className="hover:text-[#F7F4EF] transition-colors">
                  Complimentary 14-Day Returns
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('size-guide')} className="hover:text-[#F7F4EF] transition-colors">
                  Interactive Size Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#F7F4EF] transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('orders')} className="hover:text-[#F7F4EF] transition-colors">
                  Track Your Order
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: ABOUT LORÉA */}
          <div>
            <h4 className="text-[11px] tracking-[0.24em] uppercase font-medium text-[#F7F4EF] mb-5">
              ABOUT
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B7ADA2] font-light">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#F7F4EF] transition-colors">
                  Our Story & Heritage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('journal')} className="hover:text-[#F7F4EF] transition-colors">
                  The LORÉA Journal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('fabrics')} className="hover:text-[#F7F4EF] transition-colors">
                  Giza 45 Cotton Sourcing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sustainability')} className="hover:text-[#F7F4EF] transition-colors">
                  Ethical Atelier Practices
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('careers')} className="hover:text-[#F7F4EF] transition-colors">
                  Careers in Cairo
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Payment Icons, Region & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#B7ADA2] font-light">
          {/* Payment Trust Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-[#7C746B]">Secure Checkout:</span>
            <span className="px-2 py-1 bg-[#222] text-[10px] font-mono border border-[#333] text-[#D4CCC2]">VISA</span>
            <span className="px-2 py-1 bg-[#222] text-[10px] font-mono border border-[#333] text-[#D4CCC2]">MASTERCARD</span>
            <span className="px-2 py-1 bg-[#222] text-[10px] font-mono border border-[#333] text-[#D4CCC2]">APPLE PAY</span>
            <span className="px-2 py-1 bg-[#222] text-[10px] font-mono border border-[#333] text-[#D4CCC2]">CASH ON DELIVERY (COD)</span>
            <span className="px-2 py-1 bg-[#222] text-[10px] font-mono border border-[#333] text-[#D4CCC2]">MEEZA / FAWRY</span>
          </div>

          {/* Copyright & Scroll To Top */}
          <div className="flex items-center space-x-6">
            <span>© {new Date().getFullYear()} LORÉA Inc. All rights reserved.</span>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
