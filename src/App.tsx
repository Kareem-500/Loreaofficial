import React, { useState, useEffect, useCallback } from 'react';
import { PRODUCTS, CATEGORIES, getProductBySlug } from './data/products';
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
import { CollectionsView } from './components/CollectionsView';
import { ProductPageView } from './components/ProductPageView';
import { CustomerCareView } from './components/CustomerCareView';
import { NotFoundView } from './components/NotFoundView';
import { CheckoutModal } from './components/CheckoutModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { AccountModal } from './components/AccountModal';
import { AIVirtualTryOnModal } from './components/AIVirtualTryOnModal';
import { CustomerAccountView } from './components/account/CustomerAccountView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { useAuth } from './context/AuthContext';
import { api, isApiConfigured } from './services/api';
import { ROUTES, appPath, parseCurrentRoute, buildProductUrl, buildCategoryUrl } from './config/routes';
import { WOMEN_CATEGORIES } from './config/categories';

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;
  return Boolean(
    item.id &&
      item.product &&
      typeof item.product.id === 'string' &&
      PRODUCTS.some((product) => product.id === item.product?.id) &&
      item.selectedColor &&
      typeof item.selectedColor.name === 'string' &&
      item.selectedSize &&
      item.product.sizes.includes(item.selectedSize) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
  );
};

export default function App() {
  const { user, isAuthenticated } = useAuth();

  // Active Routing State
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [activeSubcategoryFilter, setActiveSubcategoryFilter] = useState<string>('All');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

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
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted in localStorage, clean array)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const savedClean = localStorage.getItem('lorea_wishlist_clean');
      if (savedClean) {
        const parsed = JSON.parse(savedClean);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (id): id is string => typeof id === 'string' && PRODUCTS.some((p) => p.id === id)
          );
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
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);

  const handleOpenTryOn = useCallback((prod?: Product) => {
    setTryOnProduct(prod || selectedProductForModal || currentProduct || PRODUCTS[0]);
    setIsTryOnOpen(true);
  }, [selectedProductForModal, currentProduct]);

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('lorea_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('lorea_wishlist_clean', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Sync wishlist from backend database if authenticated
  useEffect(() => {
    if (isAuthenticated && isApiConfigured) {
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
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // URL Routing Sync Logic
  const syncRouteFromLocation = useCallback(() => {
    const parsed = parseCurrentRoute(window.location.pathname, window.location.search);

    if (parsed.is404) {
      setCurrentView('404');
      return;
    }

    if (parsed.view === 'product' && parsed.productSlug) {
      const prod = getProductBySlug(parsed.productSlug);
      setCurrentProduct(prod || null);
      setCurrentView('product');
      return;
    }

    setCurrentProduct(null);

    if (parsed.view === 'store' || parsed.view === 'new-in') {
      if (parsed.view === 'new-in') {
        setActiveCategoryFilter('All');
      } else if (parsed.categoryParam) {
        const found = WOMEN_CATEGORIES.find(
          (c) => c.slug.toLowerCase() === parsed.categoryParam?.toLowerCase() || c.id === parsed.categoryParam
        );
        setActiveCategoryFilter(found ? found.name : parsed.categoryParam === 'modest' ? 'Modest Edit' : parsed.categoryParam);
      } else {
        setActiveCategoryFilter('All');
      }
      setActiveSubcategoryFilter(parsed.subcategoryParam || 'All');
    }

    if (parsed.view === 'store' && parsed.categoryParam?.toLowerCase() === 'sale') {
      setActiveCategoryFilter('All');
      setActiveSubcategoryFilter('All');
      setCurrentView('sale');
      return;
    }

    if (parsed.view === 'cart') {
      setIsCartOpen(true);
      setCurrentView('home');
      return;
    }

    if (parsed.view === 'wishlist') {
      setIsWishlistOpen(true);
      setCurrentView('home');
      return;
    }

    if (parsed.view === 'checkout') {
      setIsCheckoutOpen(true);
      setCurrentView('home');
      return;
    }

    if (parsed.view === 'search') {
      setIsSearchOpen(true);
      setCurrentView('home');
      return;
    }

    setCurrentView(parsed.view);
  }, []);

  // Listen to browser forward/back buttons
  useEffect(() => {
    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => window.removeEventListener('popstate', syncRouteFromLocation);
  }, [syncRouteFromLocation]);

  useEffect(() => {
    const pageTitle = currentProduct
      ? `${currentProduct.name} | LORÉA`
      : currentView === 'store'
        ? 'Shop Women\'s Fashion | LORÉA'
        : currentView === 'new-in'
          ? 'New In | LORÉA Women\'s Fashion'
          : currentView === 'collections'
            ? 'Collections | LORÉA'
            : currentView === 'journal'
              ? 'The LORÉA Journal'
              : currentView === 'about'
                ? 'Our Story | LORÉA'
                : 'LORÉA | Luxury Women\'s Fashion';
    const description = currentProduct?.description ||
      'Discover refined women\'s fashion by LORÉA, designed in Cairo with Egyptian cotton, European linen, and effortless modern silhouettes.';
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;

    document.title = pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
  }, [currentProduct, currentView]);

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
    const color = product.colors?.[0];
    if (!color || !product.sizes?.includes(size)) return;
    handleAddToCart(product, color, size, 1);
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

    if (isAuthenticated && isApiConfigured) {
      try {
        await api.wishlist.toggle(id);
      } catch (err) {
        console.error('Failed to sync toggle with server:', err);
      }
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    if (isAuthenticated && isApiConfigured) {
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
    } catch {
      // ignore
    }
  };

  const handleMoveWishlistToCart = (product: Product) => {
    const color = product.colors?.[0];
    const size = product.sizes?.[0];
    if (!color || !size) return;
    handleAddToCart(product, color, size, 1);
    handleRemoveFromWishlist(product.id);
  };

  // Unified Central Navigation Handlers
  const handleNavigate = (view: string) => {
    let targetPath: string = ROUTES.HOME;

    if (view === 'home') {
      targetPath = ROUTES.HOME;
    } else if (view === 'store' || view === 'shop' || view === 'clothing') {
      targetPath = ROUTES.STORE;
    } else if (view === 'new-in') {
      targetPath = ROUTES.NEW_IN;
    } else if (view === 'collections') {
      targetPath = ROUTES.COLLECTIONS;
    } else if (view === 'about') {
      targetPath = ROUTES.ABOUT;
    } else if (view === 'journal') {
      targetPath = ROUTES.JOURNAL;
    } else if (view === 'account') {
      targetPath = ROUTES.ACCOUNT;
    } else if (view === 'contact') {
      targetPath = ROUTES.CONTACT;
    } else if (view === 'shipping') {
      targetPath = ROUTES.SHIPPING;
    } else if (view === 'returns') {
      targetPath = ROUTES.RETURNS;
    } else if (view === 'faq') {
      targetPath = ROUTES.FAQ;
    } else if (view === 'admin') {
      targetPath = ROUTES.ADMIN;
    } else if (view === 'sale') {
      targetPath = `${ROUTES.STORE}?category=sale`;
    } else if (view === 'cart') {
      setIsCartOpen(true);
      return;
    } else if (view === 'wishlist') {
      setIsWishlistOpen(true);
      return;
    } else if (view === 'checkout') {
      setIsCheckoutOpen(true);
      return;
    } else if (view === 'search') {
      setIsSearchOpen(true);
      return;
    } else if (view === 'size-guide') {
      setIsSizeGuideOpen(true);
      return;
    }

    const targetUrl = appPath(targetPath);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }

    const resolvedView = view === 'shop' || view === 'clothing' ? 'store' : view;
    if (resolvedView !== 'product') {
      setCurrentProduct(null);
    }
    setCurrentView(resolvedView);

    if (resolvedView === 'store') {
      setActiveCategoryFilter('All');
      setActiveSubcategoryFilter('All');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryName: string, subcategoryName?: string) => {
    setActiveCategoryFilter(categoryName);
    setActiveSubcategoryFilter(subcategoryName || 'All');

    const targetUrl = buildCategoryUrl(categoryName, subcategoryName);
    window.history.pushState({}, '', targetUrl);
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    const url = buildProductUrl(product);
    window.history.pushState({}, '', url);
    setCurrentProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin View is active, render dedicated Admin Operations Control Panel
  if (currentView === 'admin') {
    return <AdminDashboardView onReturnToStore={() => handleNavigate('home')} />;
  }

  // Derived product slices for Homepage
  const newArrivals = PRODUCTS.filter((p) => p.badge === 'NEW' || p.isNew).slice(0, 4);
  const bestSellers = PRODUCTS.filter((p) => p.badge === 'BEST SELLER' || p.rating >= 4.9).slice(0, 4);
  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const wishlistCount = wishlistedProducts.length;
  const recommendedForCart = PRODUCTS.filter((p) => !cartItems.some((c) => c.product.id === p.id)).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1D1D1B] flex flex-col font-sans selection:bg-[#BA945A]/20 selection:text-[#1D1D1B]">
      {/* 1. Global Header with sticky transform, Logo -> /, and Category Subnav */}
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
        currentView={currentView}
        activeCategoryFilter={activeCategoryFilter}
        onOpenTryOn={() => handleOpenTryOn()}
      />

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-1">
        {/* HOMEPAGE (/) */}
        {currentView === 'home' && (
          <>
            {/* 01 — Hero Visual */}
            <Hero
              onShopClick={() => handleNavigate('store')}
              onDiscoverClick={() => handleNavigate('about')}
            />

            {/* 02 — Editorial Marquee Banner */}
            <div className="py-3 bg-[#151413] text-[#FAF8F5] overflow-hidden whitespace-nowrap border-y border-[#262422]">
              <div className="inline-flex animate-marquee space-x-12 text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em]">
                <span>MODERN WOMEN'S READY-TO-WEAR</span>
                <span className="text-[#BA945A]">✦</span>
                <span>EGYPTIAN GIZA 45 COTTON</span>
                <span className="text-[#BA945A]">✦</span>
                <span>DESIGNED IN CAIRO</span>
                <span className="text-[#BA945A]">✦</span>
                <span>FRENCH PURE FLAX LINEN</span>
                <span className="text-[#BA945A]">✦</span>
                <span>SMALL-BATCH ATELIER CRAFT</span>
                <span className="text-[#BA945A]">✦</span>
                <span>WORLDWIDE DELIVERY</span>
                <span className="text-[#BA945A]">✦</span>
              </div>
            </div>

            {/* 03 — Featured Categories (Visual Curated Pillars) */}
            <FeaturedCategories
              categories={CATEGORIES}
              onSelectCategory={handleSelectCategory}
            />

            {/* 04 — New Arrivals Showcase (Summer 2026 Capsule) */}
            <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EAE5DE]">
                <div>
                  <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#BA945A] font-medium block mb-1">
                    THE LATEST EDIT
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#1D1D1B] tracking-tight">
                    New In: The Cairo Edit
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigate('new-in')}
                  className="text-xs uppercase tracking-[0.2em] font-medium text-[#1D1D1B] hover:text-[#BA945A] transition-colors mt-3 sm:mt-0 underline underline-offset-4 cursor-pointer"
                >
                  Explore New In →
                </button>
              </div>
              <ProductGrid
                noWrapper
                products={newArrivals}
                currency={currency}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onQuickAdd={handleQuickAdd}
                onProductClick={handleSelectProduct}
              />
            </section>

            {/* 05 — Editorial Narrative Campaign */}
            <EditorialCampaign
              onShopCampaign={() => handleNavigate('store')}
              onReadStory={() => handleNavigate('journal')}
            />

            {/* 06 — Best Sellers / Core Essentials */}
            <section className="py-16 sm:py-24 bg-[#EFECE6]/50 border-y border-[#EAE5DE]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#D4CCC2]">
                  <div>
                    <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#7C746B] font-medium block mb-1">
                      LORÉA SIGNATURES
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#1D1D1B] tracking-tight">
                      Pieces Made to Stay
                    </h2>
                  </div>
                  <button
                    onClick={() => handleNavigate('store')}
                    className="text-xs uppercase tracking-[0.2em] font-medium text-[#1D1D1B] hover:text-[#BA945A] transition-colors mt-3 sm:mt-0 underline underline-offset-4 cursor-pointer"
                  >
                    Shop the Essentials →
                  </button>
                </div>
                <ProductGrid
                  noWrapper
                  products={bestSellers}
                  currency={currency}
                  wishlistIds={wishlistIds}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickAdd={handleQuickAdd}
                  onProductClick={handleSelectProduct}
                />
              </div>
            </section>

            {/* 07 — Brand Heritage Story */}
            <BrandStory />

            {/* 08 — Thematic Collection Spotlight */}
            <CollectionSpotlight
              products={PRODUCTS}
              currency={currency}
              onProductClick={handleSelectProduct}
              onExploreCollection={() => handleNavigate('collections')}
            />

            {/* 09 — Style / Journal Editorial Articles */}
            <JournalSection
              onSelectArticle={(article) => setSelectedArticleForModal(article)}
              onViewAllArticles={() => handleNavigate('journal')}
            />

            {/* 10 — Instagram / Social Gallery */}
            <InstagramGallery />

            {/* 11 — Newsletter Invitation */}
            <Newsletter />
          </>
        )}

        {/* STORE / CATALOG VIEW (/store, /store/new-in, /store?category=...) */}
        {(currentView === 'store' || currentView === 'new-in' || currentView === 'sale') && (
          <ShopCatalogView
            products={currentView === 'sale' ? PRODUCTS.filter((p) => p.originalPriceEgp || p.badge === 'SALE') : PRODUCTS}
            initialCategory={activeCategoryFilter}
            initialSubcategory={activeSubcategoryFilter}
            isNewInOnly={currentView === 'new-in'}
            currency={currency}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onProductClick={handleSelectProduct}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateCollections={() => handleNavigate('collections')}
            onSelectCategory={handleSelectCategory}
            onOpenTryOn={handleOpenTryOn}
          />
        )}

        {/* COLLECTIONS VIEW (/collections) */}
        {currentView === 'collections' && (
          <CollectionsView
            products={PRODUCTS}
            currency={currency}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onProductClick={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateStore={() => handleNavigate('store')}
          />
        )}

        {/* PRODUCT DETAIL PAGE VIEW (/product/[product-slug]) */}
        {currentView === 'product' && (
          <ProductPageView
            product={currentProduct}
            allProducts={PRODUCTS}
            currency={currency}
            isWishlisted={currentProduct ? wishlistIds.includes(currentProduct.id) : false}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateStore={() => handleNavigate('store')}
            onSelectCategory={handleSelectCategory}
            onSelectRelatedProduct={handleSelectProduct}
            onOpenTryOn={handleOpenTryOn}
          />
        )}

        {/* CUSTOMER CARE DEDICATED VIEWS (/contact, /shipping, /returns, /faq) */}
        {(currentView === 'contact' || currentView === 'shipping' || currentView === 'returns' || currentView === 'faq') && (
          <CustomerCareView
            page={currentView as 'contact' | 'shipping' | 'returns' | 'faq'}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateStore={() => handleNavigate('store')}
          />
        )}

        {/* ABOUT / BRAND STORY VIEW (/about) */}
        {currentView === 'about' && (
          <div>
            <div className="py-20 sm:py-28 bg-[#151413] text-[#F7F4EF] text-center px-4">
              <span className="text-[11px] tracking-[0.38em] uppercase text-[#BA945A] font-medium block mb-3 font-mono">
                LORÉA ATELIER · EST. 2026
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
              onShopCampaign={() => handleNavigate('store')}
              onReadStory={() => handleNavigate('journal')}
            />
          </div>
        )}

        {/* JOURNAL VIEW (/journal) */}
        {currentView === 'journal' && (
          <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#BA945A] font-medium block mb-2 font-mono">
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
                  <span className="text-[9px] uppercase tracking-widest text-[#BA945A] font-medium">
                    {article.category} · {article.readTime}
                  </span>
                  <h3 className="font-serif text-xl text-[#1D1D1B] group-hover:text-[#BA945A] transition-colors mt-1 mb-2">
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

        {/* CUSTOMER ACCOUNT VIEW (/account) */}
        {currentView === 'account' && (
          <CustomerAccountView
            currency={currency}
            onOpenWishlistDrawer={() => setIsWishlistOpen(true)}
            onNavigateToShop={() => handleNavigate('store')}
            onSelectProductById={(productId) => {
              const p = PRODUCTS.find((item) => item.id === productId);
              if (p) handleSelectProduct(p);
            }}
          />
        )}

        {/* NOT FOUND VIEW (404) */}
        {currentView === '404' && (
          <NotFoundView
            onNavigateHome={() => handleNavigate('home')}
            onNavigateStore={() => handleNavigate('store')}
            onNavigateCollections={() => handleNavigate('collections')}
            onNavigateNewIn={() => handleNavigate('new-in')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* GLOBAL DRAWERS & MODALS */}
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
        onAddRecommended={(prod) => {
          const color = prod.colors?.[0];
          const size = prod.sizes?.[0];
          if (color && size) handleAddToCart(prod, color, size, 1);
        }}
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
          handleSelectProduct(prod);
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
        onSelectProduct={(prod) => {
          setIsSearchOpen(false);
          handleSelectProduct(prod);
        }}
        onSelectArticle={(art) => {
          setIsSearchOpen(false);
          setSelectedArticleForModal(art);
        }}
        onSelectCategory={(cat) => {
          setIsSearchOpen(false);
          handleSelectCategory(cat);
        }}
      />

      {/* 4. Product Detail Page Modal (fallback quick view if needed) */}
      <ProductDetailModal
        product={selectedProductForModal}
        currency={currency}
        isWishlisted={selectedProductForModal ? wishlistIds.includes(selectedProductForModal.id) : false}
        onClose={() => setSelectedProductForModal(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenTryOn={handleOpenTryOn}
      />

      {/* 5. AI Virtual Try-On Modal */}
      <AIVirtualTryOnModal
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        product={tryOnProduct}
        allProducts={PRODUCTS}
        currency={currency}
        onAddToCart={(prod, size, col) => {
          handleAddToCart(
            prod,
            col || prod.colors?.[0] || { name: 'Standard', hex: '#1D1D1B' },
            size,
            1
          );
        }}
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
