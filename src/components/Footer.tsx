import React from 'react';
import { LogoLink } from './header/LogoLink';
import { Instagram, Facebook, ArrowUp, MessageCircle, Music2 } from 'lucide-react';
import { ROUTES, appPath, buildCategoryUrl } from '../config/routes';

interface FooterProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: string) => void;
  onOpenSizeGuide?: () => void;
  onOpenWishlist?: () => void;
  onOpenCart?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectCategory,
  onOpenSizeGuide,
  onOpenWishlist,
  onOpenCart
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (e: React.MouseEvent, path: string, view: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(view);
      window.history.pushState({}, '', appPath(path));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#151413] text-[#F7F4EF] pt-16 sm:pt-20 pb-12 border-t border-[#262422]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section with 5 Columns: Brand, Shop, Customer Care, LOREA, Account */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10 pb-14 border-b border-[#2A2826]">
          {/* Column 1 & 2: Brand Statement */}
          <div className="col-span-2">
            <div className="mb-4">
              <LogoLink onNavigate={onNavigate} variant="dark" ariaLabel="LORÉA Home" />
            </div>
            <p className="text-xs sm:text-sm text-[#B7ADA2] font-light leading-relaxed max-w-sm mb-6">
              LORÉA creates modern women’s fashion with a quiet point of view: fluid silhouettes, exceptional Egyptian cotton, and thoughtful craft. Designed in Cairo for everywhere.
            </p>
            {/* Socials Column */}
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.24em] uppercase text-[#BA945A] font-medium block">
                FOLLOW THE LORÉA EDIT
              </span>
              <div className="flex items-center space-x-3 text-[#B7ADA2]">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center hover:text-white hover:border-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5 stroke-[1.5]" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center hover:text-white hover:border-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5 stroke-[1.5]" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center hover:text-white hover:border-white transition-colors"
                  aria-label="TikTok"
                >
                  <Music2 className="w-3.5 h-3.5 stroke-[1.5]" />
                </a>
                <a
                  href="https://wa.me/201000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center hover:text-white hover:border-white transition-colors"
                  aria-label="WhatsApp Atelier Concierge"
                >
                  <MessageCircle className="w-3.5 h-3.5 stroke-[1.5]" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: SHOP (10 Links) */}
          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#F7F4EF] mb-4">
              SHOP
            </h4>
            <ul className="space-y-2 text-xs text-[#B7ADA2] font-light">
              <li>
                <a
                  href={appPath(ROUTES.STORE)}
                  onClick={(e) => navigateTo(e, ROUTES.STORE, 'store')}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  All Products
                </a>
              </li>
              <li>
                <a
                  href={appPath(ROUTES.NEW_IN)}
                  onClick={(e) => navigateTo(e, ROUTES.NEW_IN, 'new-in')}
                  className="hover:text-[#F7F4EF] transition-colors font-medium text-[#D4CCC2]"
                >
                  New In
                </a>
              </li>
              <li>
                <a
                  href={buildCategoryUrl('dresses')}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Dresses');
                  }}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Dresses
                </a>
              </li>
              <li>
                <a
                  href={buildCategoryUrl('tops')}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Tops');
                  }}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Tops
                </a>
              </li>
              <li>
                <a
                  href={buildCategoryUrl('bottoms')}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Bottoms');
                  }}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Bottoms
                </a>
              </li>
              <li>
                <a
                  href={buildCategoryUrl('sets')}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Sets');
                  }}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Sets
                </a>
              </li>
              <li>
                <a
                  href={buildCategoryUrl('outerwear')}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Outerwear');
                  }}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Outerwear
                </a>
              </li>
              <li>
                <a
                  href={buildCategoryUrl('modest')}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Modest Edit');
                  }}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Modest Wear
                </a>
              </li>
              <li>
                <a
                  href={buildCategoryUrl('loungewear')}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Loungewear & Sleepwear');
                  }}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Loungewear
                </a>
              </li>
              <li>
                <a
                  href={buildCategoryUrl('scarves')}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Scarves');
                  }}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Scarves
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: CUSTOMER CARE */}
          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#F7F4EF] mb-4">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-xs text-[#B7ADA2] font-light">
              <li>
                <a
                  href={appPath(ROUTES.CONTACT)}
                  onClick={(e) => navigateTo(e, ROUTES.CONTACT, 'contact')}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href={appPath(ROUTES.SHIPPING)}
                  onClick={(e) => navigateTo(e, ROUTES.SHIPPING, 'shipping')}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a
                  href={appPath(ROUTES.RETURNS)}
                  onClick={(e) => navigateTo(e, ROUTES.RETURNS, 'returns')}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a
                  href={appPath(ROUTES.FAQ)}
                  onClick={(e) => navigateTo(e, ROUTES.FAQ, 'faq')}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSizeGuide || (() => onNavigate('size-guide'))}
                  className="hover:text-[#F7F4EF] transition-colors text-left"
                >
                  Size Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: LOREA */}
          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#F7F4EF] mb-4">
              LORÉA
            </h4>
            <ul className="space-y-2 text-xs text-[#B7ADA2] font-light">
              <li>
                <a
                  href={appPath(ROUTES.ABOUT)}
                  onClick={(e) => navigateTo(e, ROUTES.ABOUT, 'about')}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  About LORÉA
                </a>
              </li>
              <li>
                <a
                  href={appPath('/story')}
                  onClick={(e) => navigateTo(e, '/story', 'about')}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href={appPath(ROUTES.COLLECTIONS)}
                  onClick={(e) => navigateTo(e, ROUTES.COLLECTIONS, 'collections')}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Collections
                </a>
              </li>
              <li>
                <a
                  href={appPath(ROUTES.JOURNAL)}
                  onClick={(e) => navigateTo(e, ROUTES.JOURNAL, 'journal')}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  The Journal
                </a>
              </li>
              <li>
                <a
                  href={appPath(ROUTES.CONTACT)}
                  onClick={(e) => navigateTo(e, ROUTES.CONTACT, 'contact')}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 6: ACCOUNT */}
          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#F7F4EF] mb-4">
              ACCOUNT
            </h4>
            <ul className="space-y-2 text-xs text-[#B7ADA2] font-light">
              <li>
                <a
                  href={appPath(ROUTES.ACCOUNT)}
                  onClick={(e) => navigateTo(e, ROUTES.ACCOUNT, 'account')}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  My Account
                </a>
              </li>
              <li>
                <a
                  href={appPath(ROUTES.WISHLIST)}
                  onClick={(e) => {
                    if (onOpenWishlist) {
                      e.preventDefault();
                      onOpenWishlist();
                    } else {
                      navigateTo(e, ROUTES.WISHLIST, 'wishlist');
                    }
                  }}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Wishlist
                </a>
              </li>
              <li>
                <a
                  href={appPath(ROUTES.ACCOUNT)}
                  onClick={(e) => navigateTo(e, ROUTES.ACCOUNT, 'account')}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Orders
                </a>
              </li>
              <li>
                <a
                  href={appPath(ROUTES.CART)}
                  onClick={(e) => {
                    if (onOpenCart) {
                      e.preventDefault();
                      onOpenCart();
                    } else {
                      navigateTo(e, ROUTES.CART, 'cart');
                    }
                  }}
                  className="hover:text-[#F7F4EF] transition-colors"
                >
                  Shopping Bag
                </a>
              </li>
              <li>
                <a
                  href={appPath(ROUTES.CHECKOUT)}
                  onClick={(e) => navigateTo(e, ROUTES.CHECKOUT, 'checkout')}
                  className="hover:text-[#F7F4EF] transition-colors text-[#BA945A]"
                >
                  Checkout
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Payment Icons, Region & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#B7ADA2] font-light">
          {/* Payment Trust Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] uppercase tracking-wider text-[#7C746B]">Payment:</span>
            <span className="px-2 py-0.5 bg-[#222] text-[10px] font-mono border border-[#333] text-[#D4CCC2]">VISA</span>
            <span className="px-2 py-0.5 bg-[#222] text-[10px] font-mono border border-[#333] text-[#D4CCC2]">MASTERCARD</span>
            <span className="px-2 py-0.5 bg-[#222] text-[10px] font-mono border border-[#333] text-[#D4CCC2]">APPLE PAY</span>
            <span className="px-2 py-0.5 bg-[#222] text-[10px] font-mono border border-[#333] text-[#D4CCC2]">CASH ON DELIVERY (COD)</span>
            <span className="px-2 py-0.5 bg-[#222] text-[10px] font-mono border border-[#333] text-[#D4CCC2]">MEEZA</span>
          </div>

          {/* Copyright & Scroll To Top */}
          <div className="flex items-center space-x-6">
            <span>© {new Date().getFullYear()} LORÉA. All rights reserved.</span>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <span className="tracking-wider uppercase text-[11px]">Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
