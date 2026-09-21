import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Mail, BookOpen, MessageCircle, Sparkles } from 'lucide-react';
import { COLLECTION_CATEGORIES, CollectionCategoryItem } from '../../data/collectionCategories';

export interface CategoryNavBarProps {
  currentView?: string;
  activeCategory?: string;
  onSelectCategory: (category: string, subcategory?: string) => void;
  onNavigate: (view: string) => void;
  onOpenTryOn?: () => void;
  className?: string;
}

export const CategoryNavBar: React.FC<CategoryNavBarProps> = ({
  currentView = 'home',
  activeCategory = 'All',
  onSelectCategory,
  onNavigate,
  onOpenTryOn,
  className = ''
}) => {
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  const collectionWrapperRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const collectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const storyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (collectionWrapperRef.current && !collectionWrapperRef.current.contains(target)) {
        setIsCollectionOpen(false);
      }
      if (storyRef.current && !storyRef.current.contains(target)) {
        setIsStoryOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCollectionOpen(false);
        setIsStoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (collectionTimeoutRef.current) clearTimeout(collectionTimeoutRef.current);
      if (storyTimeoutRef.current) clearTimeout(storyTimeoutRef.current);
    };
  }, []);

  const handleCollectionMouseEnter = () => {
    if (collectionTimeoutRef.current) clearTimeout(collectionTimeoutRef.current);
    setIsCollectionOpen(true);
    setIsStoryOpen(false);
  };

  const handleCollectionMouseLeave = () => {
    // 250ms buffer to guarantee seamless movement across the continuous area
    collectionTimeoutRef.current = setTimeout(() => {
      setIsCollectionOpen(false);
    }, 250);
  };

  const handleStoryMouseEnter = () => {
    if (storyTimeoutRef.current) clearTimeout(storyTimeoutRef.current);
    setIsStoryOpen(true);
    setIsCollectionOpen(false);
  };

  const handleStoryMouseLeave = () => {
    storyTimeoutRef.current = setTimeout(() => {
      setIsStoryOpen(false);
    }, 200);
  };

  const isShopActive = currentView === 'store' && activeCategory === 'All';
  const isNewInActive = currentView === 'new-in';
  const isSaleActive = currentView === 'sale';
  const isCollectionActive =
    (currentView === 'store' && activeCategory !== 'All') ||
    currentView === 'collections';
  const isStoryActive = currentView === 'about' || currentView === 'contact' || currentView === 'journal';

  const handleCategoryClick = (cat: CollectionCategoryItem) => {
    setIsCollectionOpen(false);
    onSelectCategory(cat.categoryTarget, cat.subcategoryTarget);
  };

  return (
    <div
      ref={collectionWrapperRef}
      className={`hidden md:block w-full bg-[#F7F4EF] relative transition-colors ${className}`}
      role="navigation"
      aria-label="Main Store Navigation"
      onMouseLeave={handleCollectionMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar Centered Horizontally with Balanced Spacing & Responsive Typography */}
        <nav className="flex items-center justify-center gap-7 md:gap-9 lg:gap-12 xl:gap-14 pt-1 sm:pt-1.5 md:pt-2 pb-3 sm:pb-3.5 md:pb-4 text-[10.5px] lg:text-[11.5px] tracking-[0.18em] lg:tracking-[0.22em] font-medium text-[#1D1D1B] select-none">
          {/* 1. SHOP */}
          <button
            id="nav-item-shop"
            onClick={() => {
              setIsCollectionOpen(false);
              setIsStoryOpen(false);
              onNavigate('store');
            }}
            className={`group relative uppercase py-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] ${
              isShopActive ? 'text-[#BA945A]' : 'text-[#1D1D1B] hover:text-[#BA945A]'
            }`}
          >
            <span>SHOP</span>
            <span
              className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-[#BA945A] transition-all duration-300 ${
                isShopActive ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
          </button>

          {/* 2. NEW IN */}
          <button
            id="nav-item-new-in"
            onClick={() => {
              setIsCollectionOpen(false);
              setIsStoryOpen(false);
              onNavigate('new-in');
            }}
            className={`group relative uppercase py-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] ${
              isNewInActive ? 'text-[#BA945A]' : 'text-[#1D1D1B] hover:text-[#BA945A]'
            }`}
          >
            <span>NEW IN</span>
            <span
              className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-[#BA945A] transition-all duration-300 ${
                isNewInActive ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
          </button>

          {/* 3. SALE */}
          <button
            id="nav-item-sale"
            onClick={() => {
              setIsCollectionOpen(false);
              setIsStoryOpen(false);
              onNavigate('sale');
            }}
            className={`group relative uppercase py-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] ${
              isSaleActive ? 'text-[#964036] font-semibold' : 'text-[#964036]/90 hover:text-[#964036]'
            }`}
          >
            <span>SALE</span>
            <span
              className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-[#964036] transition-all duration-300 ${
                isSaleActive ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
          </button>

          {/* 4. COLLECTION (Dropdown Menu Without Images) */}
          <div
            ref={collectionWrapperRef}
            className="relative"
            onMouseEnter={handleCollectionMouseEnter}
            onMouseLeave={handleCollectionMouseLeave}
          >
            <button
              id="nav-item-collection"
              onClick={() => setIsCollectionOpen(!isCollectionOpen)}
              onFocus={handleCollectionMouseEnter}
              aria-expanded={isCollectionOpen}
              aria-haspopup="true"
              aria-controls="collection-dropdown"
              className={`group relative uppercase py-1 inline-flex items-center space-x-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] ${
                isCollectionActive || isCollectionOpen ? 'text-[#BA945A]' : 'text-[#1D1D1B] hover:text-[#BA945A]'
              }`}
            >
              <span>COLLECTION</span>
              <ChevronDown
                className={`w-3 h-3 stroke-[1.5] transition-transform duration-300 ${
                  isCollectionOpen ? 'rotate-180 text-[#BA945A]' : 'opacity-70 group-hover:opacity-100'
                }`}
              />
              <span
                className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-[#BA945A] transition-all duration-300 ${
                  isCollectionActive ? 'w-full' : isCollectionOpen ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </button>

            {/* Clean, Refined Dropdown Menu Without Images */}
            {isCollectionOpen && (
              <div
                id="collection-dropdown"
                onMouseEnter={handleCollectionMouseEnter}
                onMouseLeave={handleCollectionMouseLeave}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#F7F4EF] border border-[#EAE5DE] shadow-xl py-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
              >
                {/* Invisible hover bridge to prevent cursor flickering */}
                <div className="absolute -top-2.5 left-0 w-full h-2.5" aria-hidden="true" />

                <div className="px-4 pt-1.5 pb-2 border-b border-[#EAE5DE]/80 mb-1 flex items-center justify-between">
                  <span className="text-[9px] tracking-[0.22em] uppercase font-semibold text-[#7C746B]">
                    Women&apos;s Categories
                  </span>
                  <span className="text-[9px] tracking-[0.16em] uppercase text-[#BA945A] font-medium">
                    Atelier
                  </span>
                </div>

                <div className="flex flex-col py-0.5">
                  {COLLECTION_CATEGORIES.map((category) => (
                    <button
                      key={category.slug}
                      id={`nav-collection-${category.slug}`}
                      onClick={() => handleCategoryClick(category)}
                      className="group flex items-center justify-between px-4 py-2 text-[11px] tracking-[0.16em] uppercase text-[#1D1D1B] hover:text-[#BA945A] hover:bg-[#F2EEE9] transition-colors text-left cursor-pointer"
                    >
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-1 pt-2 border-t border-[#EAE5DE]/80 px-4">
                  <button
                    onClick={() => {
                      setIsCollectionOpen(false);
                      onNavigate('collections');
                    }}
                    className="w-full text-left text-[10px] tracking-[0.18em] uppercase text-[#7C746B] hover:text-[#BA945A] transition-colors py-1 flex items-center justify-between cursor-pointer"
                  >
                    <span>View All Collections</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 5. STORY US (Dropdown Menu) */}
          <div
            ref={storyRef}
            className="relative"
            onMouseEnter={handleStoryMouseEnter}
            onMouseLeave={handleStoryMouseLeave}
          >
            <button
              id="nav-item-story-us"
              onClick={() => setIsStoryOpen(!isStoryOpen)}
              onFocus={handleStoryMouseEnter}
              aria-expanded={isStoryOpen}
              aria-haspopup="true"
              className={`group relative uppercase py-1 inline-flex items-center space-x-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A] ${
                isStoryActive || isStoryOpen ? 'text-[#BA945A]' : 'text-[#1D1D1B] hover:text-[#BA945A]'
              }`}
            >
              <span>STORY US</span>
              <ChevronDown
                className={`w-3 h-3 stroke-[1.5] transition-transform duration-300 ${
                  isStoryOpen ? 'rotate-180 text-[#BA945A]' : 'opacity-70 group-hover:opacity-100'
                }`}
              />
              <span
                className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-[#BA945A] transition-all duration-300 ${
                  isStoryActive ? 'w-full' : isStoryOpen ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </button>

            {/* STORY US Dropdown */}
            {isStoryOpen && (
              <div
                id="story-dropdown"
                onMouseEnter={handleStoryMouseEnter}
                onMouseLeave={handleStoryMouseLeave}
                className="absolute top-full right-1/2 translate-x-1/2 mt-2 w-56 bg-[#F7F4EF] border border-[#EAE5DE] shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
              >
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => {
                      setIsStoryOpen(false);
                      onNavigate('about');
                    }}
                    className="flex items-center space-x-2.5 px-4 py-2 text-[12px] tracking-[0.14em] uppercase text-[#1D1D1B] hover:text-[#BA945A] hover:bg-[#F2EEE9] transition-colors text-left cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#BA945A]" />
                    <span>Our Story</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsStoryOpen(false);
                      onNavigate('contact');
                    }}
                    className="flex items-center space-x-2.5 px-4 py-2 text-[12px] tracking-[0.14em] uppercase text-[#1D1D1B] hover:text-[#BA945A] hover:bg-[#F2EEE9] transition-colors text-left cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#BA945A]" />
                    <span>Contact Us</span>
                  </button>

                  <a
                    href="mailto:concierge@lorea.com"
                    onClick={() => setIsStoryOpen(false)}
                    className="flex items-center space-x-2.5 px-4 py-2 text-[12px] tracking-[0.14em] uppercase text-[#1D1D1B] hover:text-[#BA945A] hover:bg-[#F2EEE9] transition-colors text-left cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#BA945A]" />
                    <span>Client Emails</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 6. AI STYLE ASSISTANT */}
          <button
            id="nav-item-ai-style-assistant"
            onClick={() => {
              setIsCollectionOpen(false);
              setIsStoryOpen(false);
              if (onOpenTryOn) {
                onOpenTryOn();
              } else {
                onNavigate('store');
              }
            }}
            className="group relative uppercase py-1 transition-colors cursor-pointer text-[#BA945A] hover:text-[#1D1D1B] inline-flex items-center space-x-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA945A]"
            title="LORÉA AI Style Assistant · مستشار الأناقة الذكي"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#BA945A]" />
            <span>AI STYLIST</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA945A] animate-pulse" />
          </button>
        </nav>
      </div>
    </div>
  );
};



