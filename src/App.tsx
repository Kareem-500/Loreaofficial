import React, { useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES } from './data/products';
import { ARTICLES } from './data/journal';
import { Product, Article, CartItem, Currency, ProductColor } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedCategories } from './components/FeaturedCategories';
import { ProductGrid } from './components/ProductGrid';
import { EditorialCampaign } from './components/EditorialCampaign';
import { BrandStory } from './components/BrandStory';
import { CollectionSpotlight } from './components/CollectionSpotlight';
import { JournalSection } from './components/JournalSection';
import { InstagramGallery } from './components/InstagramGallery';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShopCatalogView } from './components/ShopCatalogView';
import { CheckoutModal } from './components/CheckoutModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { AccountModal } from './components/AccountModal';
import { CustomerAccountView } from './components/account/CustomerAccountView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

export default function App() {
  const { user, isAuthenticated } = useAuth();

  // Navigation & View State
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Sticky header scroll detection
  const [isScrolled, setIsScrolled] = useState(false);

  // Currency State (defaults to EGP for Egyptian market accessibility, with USD/EUR/AED)
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('lorea_currency');
    return (saved as Currency) || 'EGP';
  });

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lorea_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted in localStorage, defaults strictly to empty)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      // Check if user has explicitly saved clean wishlist
      const savedClean = localStorage.getItem('lorea_wishlist_clean');
      if (savedClean) {
        const parsed = JSON.parse(savedClean);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (id): id is string => typeof id === 'string' && PRODUCTS.some((p) => p.id === id)
          );
        }
      }

      // If they had the old key 'lorea_wishlist', clean and migrate or wipe legacy mock data
      const legacy = localStorage.getItem('lorea_wishlist');
      if (legacy) {
        localStorage.removeItem('lorea_wishlist');
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(
            (id): id is string => typeof id === 'string' && PRODUCTS.some((p) => p.id === id)
          );
          // If the array matches the old hardcoded default [lorea-01, lorea-04], reset to empty
          const isOldMockDefault =
            cleaned.length <= 2 &&
            cleaned.every((id) => id === 'lorea-01' || id === 'lorea-04');
          if (isOldMockDefault) {
            localStorage.setItem('lorea_wishlist_clean', JSON.stringify([]));
            return [];
          }
          localStorage.setItem('lorea_wishlist_clean', JSON.stringify(cleaned));
          return cleaned;
        }
      }

      localStorage.setItem('lorea_wishlist_clean', JSON.stringify([]));
      return [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [selectedArticleForModal, setSelectedArticleForModal] = useState<Article | null>(null);

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('lorea_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('lorea_wishlist_clean', JSON.stringify(wishlistIds));
    localStorage.removeItem('lorea_wishlist');
  }, [wishlistIds]);

  // Sync wishlist from backend database if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.wishlist
        .get()
        .then((res) => {
          if (res && Array.isArray(res.productIds)) {
            const serverProductIds = res.productIds.filter(
              (id): id is string => typeof id === 'string' && PRODUCTS.some((p) => p.id === id)
            );
            setWishlistIds(serverProductIds);
          }
        })
        .catch((err) => {
          console.error('Failed to sync wishlist from server:', err);
        });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('lorea_currency', currency);
  }, [currency]);

  // Scroll listener for sticky header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    color: ProductColor,
    size: 'XS' | 'S' | 'M' | 'L' | 'XL',
    qty = 1
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.name === color.name &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }

      return [
        ...prev,
        {
          id: `${product.id}-${color.name}-${size}-${Date.now()}`,
          product,
          selectedColor: color,
          selectedSize: size,
          quantity: qty
        }
      ];
    });

    setIsCartOpen(true);
  };

  const handleQuickAdd = (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL') => {
    handleAddToCart(product, product.colors[0], size, 1);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Handlers
  const handleToggleWishlist = async (productOrId: Product | string) => {
    const id = typeof productOrId === 'string' ? productOrId : productOrId?.id;
    if (!id || typeof id !== 'string') return;
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    if (isAuthenticated) {
      try {
        await api.wishlist.toggle(id);
      } catch (err) {
        console.error('Failed to sync toggle with server:', err);
      }
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    if (isAuthenticated) {
      try {
        await api.wishlist.remove(productId);
      } catch (err) {
        console.error('Failed to sync remove with server:', err);
      }
    }
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
    try {
      localStorage.setItem('lorea_wishlist_clean', JSON.stringify([]));
      localStorage.removeItem('lorea_wishlist');
    } catch {
      // ignore
    }
  };

  const handleMoveWishlistToCart = (product: Product) => {
    handleAddToCart(product, product.colors[0], product.sizes[0], 1);
    handleRemoveFromWishlist(product.id);
  };

  // Navigation Handlers
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (view === 'shop' || view === 'clothing') {
      setActiveCategoryFilter('All');
    } else if (view === 'new-in') {
      setActiveCategoryFilter('All');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryName: string) => {
    setActiveCategoryFilter(categoryName);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin View is active, render dedicated Admin Operations Control Panel
  if (currentView === 'admin') {
    return <AdminDashboardView onReturnToStore={() => handleNavigate('home')} />;
  }

  // Derived product slices for Homepage
  const newArrivals = PRODUCTS.filter((p) => p.badge === 'NEW').slice(0, 4);
  const bestSellers = PRODUCTS.filter((p) => p.badge === 'BEST SELLER' || p.rating >= 4.9).slice(0, 4);
  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const wishlistCount = wishlistedProducts.length;
  const recommendedForCart = PRODUCTS.filter((p) => !cartItems.some((c) => c.product.id === p.id)).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1D1D1B] flex flex-col font-sans selection:bg-[#B88F88]/30 selection:text-[#1D1D1B]">
      {/* 1. Global Header with sticky transform and mega menu */}
      <Header
        isScrolled={isScrolled}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => {
          if (isAuthenticated) {
            handleNavigate('account');
          } else {
            setIsAccountOpen(true);
          }
        }}
        onSelectCategory={handleSelectCategory}
        onNavigate={handleNavigate}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* 2. Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* 01 — Fullscreen Cinematic Hero */}
            <Hero
              onShopClick={() => handleNavigate('shop')}
              onDiscoverClick={() => {
                const el = document.getElementById('story-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 02 — New Collection Introduction Banner */}
            <section className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-[#EAE5DE] text-center px-4">
              <span className="text-[10px] sm:text-[11px] tracking-[0.36em] uppercase text-[#7C746B] font-medium block mb-3">
                SPRING / SUMMER 2026
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-[#1D1D1B] max-w-2xl mx-auto leading-tight">
                Quiet Luxury for Modern Femininity
              </h2>
              <p className="mt-4 text-xs sm:text-base text-[#7C746B] font-light max-w-xl mx-auto leading-relaxed">
                Sculpted from European flax linen and certified Egyptian Giza cotton. Minimalist silhouettes tailored for life between Cairo, the coast, and the world.
              </p>
            </section>

            {/* 03 — Featured Categories (Dresses, Tops, Sets, Outerwear, Bottoms, Modest Edit) */}
            <FeaturedCategories onSelectCategory={handleSelectCategory} />

            {/* 04 — New Arrivals Product Grid (4-cols desktop, with Quick Add) */}
            <ProductGrid
              categoryTag="JUST ARRIVED"
              title="New In Atelier"
              subtitle="The latest silhouettes woven from stone-washed linen and Giza 45 cotton poplin."
              products={newArrivals.length > 0 ? newArrivals : PRODUCTS.slice(0, 4)}
              currency={currency}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onQuickAdd={handleQuickAdd}
              onProductClick={(product) => setSelectedProductForModal(product)}
              onViewAll={() => handleNavigate('shop')}
            />

            {/* 05 — Editorial Campaign: "The Architecture of Ease" (Dark Soft Black Section) */}
            <EditorialCampaign
              onShopCampaign={() => handleNavigate('shop')}
              onReadStory={() => {
                setSelectedArticleForModal(ARTICLES[0]);
              }}
            />

            {/* 06 — Best Sellers Grid */}
            <ProductGrid
              categoryTag="ICONIC SILHOUETTES"
              title="Best Sellers"
              subtitle="The definitive wardrobe foundations cherished by our community season after season."
              products={bestSellers}
              currency={currency}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onQuickAdd={handleQuickAdd}
              onProductClick={(product) => setSelectedProductForModal(product)}
              onViewAll={() => handleNavigate('shop')}
            />

            {/* 07 — LORÉA Story (Generous Whitespace & Nile/Mediterranean Craftsmanship) */}
            <div id="story-section">
              <BrandStory />
            </div>

            {/* 08 — Collection Spotlight: The Giza 45 Cotton Series */}
            <CollectionSpotlight
              products={PRODUCTS.filter((p) => p.fabric.includes('Cotton') || p.tags.includes('Egyptian Cotton'))}
              currency={currency}
              onProductClick={(p) => setSelectedProductForModal(p)}
              onExploreCollection={() => handleNavigate('shop')}
            />

            {/* 09 — Style / Journal Editorial Articles */}
            <JournalSection
              onSelectArticle={(article) => setSelectedArticleForModal(article)}
              onViewAllArticles={() => handleNavigate('journal')}
            />

            {/* 10 — Instagram / Social Gallery (6-image visual grid) */}
            <InstagramGallery />

            {/* 11 — Newsletter Invitation */}
            <Newsletter />
          </>
        )}

        {/* SHOP / CATALOG VIEW (Filters, Categories, Sorting, Full Product discovery) */}
        {(currentView === 'shop' || currentView === 'clothing' || currentView === 'new-in' || currentView === 'sale') && (
          <ShopCatalogView
            products={currentView === 'sale' ? PRODUCTS.filter((p) => p.originalPriceEgp || p.badge === 'SALE') : PRODUCTS}
            initialCategory={activeCategoryFilter}
            currency={currency}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onProductClick={(p) => setSelectedProductForModal(p)}
          />
        )}

        {/* COLLECTIONS DEDICATED VIEW */}
        {currentView === 'collections' && (
          <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#7C746B] font-medium block mb-2">
                ATELIER EDITIONS
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#1D1D1B]">
                Curated Collections
              </h1>
              <p className="mt-3 text-sm text-[#7C746B] font-light">
                Explore our distinct thematic edits, from Egyptian cotton tailoring to architectural modest wear.
              </p>
            </div>

            <div className="space-y-16">
              {/* Collection 1: The Giza 45 Cotton Edit */}
              <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-6 sm:p-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                  <div>
                    <span className="text-[10px] tracking-[0.24em] uppercase text-[#B88F88] font-medium">HERITAGE CAPSULE</span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#1D1D1B] mt-1">The Giza 45 Cotton Series</h2>
                  </div>
                  <button onClick={() => handleNavigate('shop')} className="text-xs uppercase tracking-widest underline text-[#1D1D1B] mt-2 md:mt-0">
                    View full series →
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {PRODUCTS.filter((p) => p.fabric.includes('Cotton')).slice(0, 4).map((p) => (
                    <ProductGrid
                      key={p.id}
                      products={[p]}
                      currency={currency}
                      wishlistIds={wishlistIds}
                      onToggleWishlist={handleToggleWishlist}
                      onQuickAdd={handleQuickAdd}
                      onProductClick={(prod) => setSelectedProductForModal(prod)}
                    />
                  ))}
                </div>
              </div>

              {/* Collection 2: Modest Architectural Series */}
              <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-6 sm:p-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                  <div>
                    <span className="text-[10px] tracking-[0.24em] uppercase text-[#B88F88] font-medium">POPULAR EDIT</span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#1D1D1B] mt-1">The Modest Minimalist Edit</h2>
                  </div>
                  <button onClick={() => handleSelectCategory('Modest Edit')} className="text-xs uppercase tracking-widest underline text-[#1D1D1B] mt-2 md:mt-0">
                    View modest collection →
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {PRODUCTS.filter((p) => p.isModestEdit).slice(0, 4).map((p) => (
                    <ProductGrid
                      key={p.id}
                      products={[p]}
                      currency={currency}
                      wishlistIds={wishlistIds}
                      onToggleWishlist={handleToggleWishlist}
                      onQuickAdd={handleQuickAdd}
                      onProductClick={(prod) => setSelectedProductForModal(prod)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT / BRAND STORY DEDICATED VIEW */}
        {currentView === 'about' && (
          <div>
            <div className="py-20 sm:py-28 bg-[#151413] text-[#F7F4EF] text-center px-4">
              <span className="text-[11px] tracking-[0.38em] uppercase text-[#B88F88] font-medium block mb-3">
                LORÉA ATELIER · EST. CAIRO
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#F7F4EF] mb-4">
                The Heritage of Pure Form
              </h1>
              <p className="text-sm sm:text-base text-[#D4CCC2] font-light max-w-xl mx-auto">
                Bridging centuries of Egyptian fiber cultivation with quiet contemporary European minimalism.
              </p>
            </div>
            <BrandStory />
            <EditorialCampaign
              onShopCampaign={() => handleNavigate('shop')}
              onReadStory={() => setSelectedArticleForModal(ARTICLES[0])}
            />
          </div>
        )}

        {/* JOURNAL DEDICATED ARCHIVE VIEW */}
        {currentView === 'journal' && (
          <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#7C746B] font-medium block mb-2">
                EDITORIAL DESK
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#1D1D1B]">
                The LORÉA Journal
              </h1>
              <p className="mt-3 text-sm text-[#7C746B] font-light">
                Essays on Egyptian textile heritage, architectural dressing, and fabric studies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ARTICLES.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticleForModal(article)}
                  className="group cursor-pointer bg-white border border-[#EAE5DE] p-5 hover:shadow-md transition-all"
                >
                  <div className="aspect-16/10 overflow-hidden bg-[#EAE5DE] mb-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-[#B88F88] font-medium">
                    {article.category} · {article.readTime}
                  </span>
                  <h3 className="font-serif text-xl text-[#1D1D1B] group-hover:text-[#B88F88] transition-colors mt-1 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#7C746B] line-clamp-3 mb-4 font-light">
                    {article.excerpt}
                  </p>
                  <span className="text-xs uppercase tracking-wider font-medium text-[#1D1D1B] group-hover:underline">
                    Read Story →
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CUSTOMER ATELIER ACCOUNT DEDICATED VIEW */}
        {currentView === 'account' && (
          <CustomerAccountView
            currency={currency}
            onOpenWishlistDrawer={() => setIsWishlistOpen(true)}
            onNavigateToShop={() => handleNavigate('shop')}
            onSelectProductById={(productId) => {
              const p = PRODUCTS.find((item) => item.id === productId);
              if (p) setSelectedProductForModal(p);
            }}
          />
        )}
      </main>

      {/* 12. Footer with 4 columns, social, payment icons, and back to top */}
      <Footer onNavigate={handleNavigate} onSelectCategory={handleSelectCategory} />

      {/* GLOBAL MODALS & DRAWERS */}
      {/* 1. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        recommendedProducts={recommendedForCart}
        onAddRecommended={(prod) => handleAddToCart(prod, prod.colors[0], prod.sizes[0], 1)}
      />

      {/* 2. Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistedProducts}
        currency={currency}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onClearWishlist={handleClearWishlist}
        onSelectProduct={(prod) => {
          setIsWishlistOpen(false);
          setSelectedProductForModal(prod);
        }}
        onMoveToCart={handleMoveWishlistToCart}
      />

      {/* 3. Predictive Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        articles={ARTICLES}
        currency={currency}
        onSelectProduct={(prod) => setSelectedProductForModal(prod)}
        onSelectArticle={(art) => setSelectedArticleForModal(art)}
        onSelectCategory={handleSelectCategory}
      />

      {/* 4. Product Detail Page (PDP) Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        currency={currency}
        isWishlisted={selectedProductForModal ? wishlistIds.includes(selectedProductForModal.id) : false}
        onClose={() => setSelectedProductForModal(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* 5. Article Detail Modal */}
      <ArticleDetailModal
        article={selectedArticleForModal}
        onClose={() => setSelectedArticleForModal(null)}
      />

      {/* 6. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currency={currency}
        onClearCart={handleClearCart}
      />

      {/* 7. Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* 8. Client Account Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currency={currency}
        wishlistCount={wishlistCount}
        onOpenWishlist={() => {
          setIsAccountOpen(false);
          setIsWishlistOpen(true);
        }}
        onNavigateToFullAccount={() => {
          setIsAccountOpen(false);
          handleNavigate('account');
        }}
        onNavigateToAdmin={() => {
          setIsAccountOpen(false);
          handleNavigate('admin');
        }}
      />
    </div>
  );
}
