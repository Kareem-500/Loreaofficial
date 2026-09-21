import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  ArrowRight,
  Compass,
  Layers,
  Ruler,
  Feather,
  Check,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { Product, Currency } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { buildProductUrl } from '../config/routes';

export interface LoreaAIStyleAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
  currency: Currency;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onNavigateProduct?: (product: Product) => void;
  onNavigateCollection?: (categorySlug: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  textAr?: string;
  recommendedProducts?: Product[];
  stylingTips?: string[];
  outfitBreakdown?: {
    mainPiece?: string;
    layering?: string;
    footwear?: string;
    accessories?: string;
    palette?: string;
  };
  timestamp: string;
}

// Curated Atelier Fashion Knowledge Base
const ATELIER_OCCASIONS = [
  {
    id: 'evening',
    labelEn: 'Cairo Evening & Gala',
    labelAr: 'سهرة ومناسبات مسائية',
    palette: 'Noir, Warm Gold & Alabaster',
    description: 'Statuesque liquid silhouettes with understated jewelry and structured mules.'
  },
  {
    id: 'resort',
    labelEn: 'Sahel & Red Sea Resort',
    labelAr: 'إطلالات الساحل والمنتجعات',
    palette: 'Desert Sand, Raw Linen & Terracotta',
    description: 'Breathable French Normandy linen, fluid column cuts, and effortless coastal drape.'
  },
  {
    id: 'modest',
    labelEn: 'Contemporary Modest Chic',
    labelAr: 'أناقة محتشمة عصرية',
    palette: 'Warm Taupe, Olive Dusk & Stone',
    description: 'Sculptural long-line layers, opaque breathable cottons, and tonal silk scarves.'
  },
  {
    id: 'executive',
    labelEn: 'Atelier Workwear & Meetings',
    labelAr: 'إطلالات العمل والاجتماعات',
    palette: 'Tailored Noir, Charcoal & Crisp White',
    description: 'Giza 45 cotton button-downs, pleated wide-leg trousers, and relaxed tailored trenches.'
  },
  {
    id: 'weekend',
    labelEn: 'Effortless Quiet Luxury',
    labelAr: 'إطلالة يومية راقية',
    palette: 'Oatmeal, Cream & Brushed Gold',
    description: 'Monochromatic coordinate sets in ribbed fine-gauge knits and washed linen.'
  }
];

export const LoreaAIStyleAssistant: React.FC<LoreaAIStyleAssistantProps> = ({
  isOpen,
  onClose,
  initialProduct,
  currency,
  onAddToCart,
  onNavigateProduct,
  onNavigateCollection
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct || null);
  const [activeTab, setActiveTab] = useState<'chat' | 'outfits' | 'fabrics' | 'sizing'>('chat');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Initialize messages with welcome advice
  const [messages, setMessages] = useState<Message[]>(() => {
    return [
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: `Welcome to the LORÉA Atelier Styling Suite. I am your personal fashion advisor, dedicated to curating quiet-luxury silhouettes, pairing bespoke pieces, and guiding you through fabrics, sizing, and color harmonies from our Cairo atelier.`,
        textAr: `أهلاً بكِ في دار لوريا للأزياء. أنا مستشاركِ الذكي للأناقة، أساعدكِ في تنسيق إطلالات متناغمة، اختيار المقاسات والخامات الفاخرة، والإجابة عن كافة تفاصيل مجموعاتنا.`,
        recommendedProducts: PRODUCTS.slice(0, 3),
        stylingTips: [
          'Pair structured outerwear over fluid column silhouettes',
          'Opt for tone-on-tone neutrals (Desert Sand, Ivory, Warm Black)',
          'Highlight natural drape with minimal sculptural gold accents'
        ],
        timestamp: 'Just now'
      }
    ];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync initialProduct if passed when modal opens
  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
      // Prepend an introductory advice message about this piece
      const pieceAdvice: Message = {
        id: `focus-${initialProduct.id}-${Date.now()}`,
        sender: 'assistant',
        text: `You are currently viewing "${initialProduct.name}". Crafted from ${initialProduct.fabric || 'refined Egyptian textiles'}, this piece is cut for effortless poise. Would you like me to curate a coordinating outfit, recommend pairing accessories, or advise on size and care?`,
        recommendedProducts: findComplementaryProducts(initialProduct),
        stylingTips: [
          `Fabric: ${initialProduct.fabric}`,
          `Silhouette: ${initialProduct.subtitle || 'Fluid luxury tailoring'}`,
          `Care: Dry clean or cold hand wash, dry flat in shade`
        ],
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, pieceAdvice]);
    }
  }, [initialProduct]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Complementary products lookup
  function findComplementaryProducts(target: Product): Product[] {
    const targetCategory = (target.category || '').toLowerCase();
    let preferredCategories: string[] = [];

    if (targetCategory.includes('dress')) {
      preferredCategories = ['outerwear', 'accessories', 'sets'];
    } else if (targetCategory.includes('top') || targetCategory.includes('shirt')) {
      preferredCategories = ['pants', 'outerwear', 'accessories'];
    } else if (targetCategory.includes('pant') || targetCategory.includes('trouser')) {
      preferredCategories = ['tops', 'outerwear', 'sets'];
    } else if (targetCategory.includes('outerwear')) {
      preferredCategories = ['dresses', 'tops', 'pants'];
    } else {
      preferredCategories = ['dresses', 'outerwear', 'tops'];
    }

    const matches = PRODUCTS.filter(
      (p) => p.id !== target.id && preferredCategories.some((cat) => (p.category || '').toLowerCase().includes(cat))
    );

    return matches.slice(0, 3);
  }

  // Client-Side Fashion Intelligence Engine (Ensures 100% offline & GitHub Pages reliability)
  const generateAtelierResponse = (query: string, currentProd: Product | null): Message => {
    const q = query.toLowerCase();

    // 1. Outfit Curation Request
    if (q.includes('outfit') || q.includes('تنسيق') || q.includes('إطلالة') || q.includes('look') || q.includes('style')) {
      const mainPiece = currentProd || PRODUCTS.find((p) => p.badge === 'BEST SELLER') || PRODUCTS[0];
      const complementaries = findComplementaryProducts(mainPiece);

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Here is our signature atelier formula for "${mainPiece.name}": balance the fluid, linear drape of the body with architectural layering and warm metallic hardware.`,
        textAr: `إليكِ معادلة التنسيق المعتمدة لإطلالة "${mainPiece.name}": تحقيق التوازن بين الانسيابية والقصّات الهندسية مع درجات محايدة دافئة.`,
        recommendedProducts: [mainPiece, ...complementaries.slice(0, 2)],
        outfitBreakdown: {
          mainPiece: mainPiece.name,
          layering: complementaries[0]?.name || 'Giza Cotton Tailored Duster',
          footwear: 'Square-toe minimalist leather mule or sleek slingback',
          accessories: 'Sculptural brushed gold cuff & tonal silk twill scarf',
          palette: 'Alabaster, Desert Sand & Burnished Gold'
        },
        stylingTips: [
          'Keep lines clean and unencumbered to let the premium fabric speak.',
          'Roll cuffs gently for an intentional, relaxed nonchalance.',
          'Complement with subtle earth-tone lip color and sleek pulled-back hair.'
        ],
        timestamp: 'Just now'
      };
    }

    // 2. Size & Fit Guidance
    if (q.includes('size') || q.includes('fit') || q.includes('مقاس') || q.includes('قياس') || q.includes('طول')) {
      const prodName = currentProd ? currentProd.name : 'LORÉA garments';
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Regarding sizing for ${prodName}: LORÉA silhouettes are designed with a relaxed, modern European cut that celebrates effortless drape rather than constrictive cling.`,
        textAr: `بخصوص المقاسات: تعتمد تصاميم لوريا على القصّات الانسيابية المريحة التي تمنح حضوراً أنيقاً وحرية في الحركة.`,
        stylingTips: [
          'If you prefer a statuesque, relaxed editorial look, choose your standard size.',
          'For a closer, defined silhouette at the waist or shoulders, take one size down.',
          'All hems can be subtly altered at our Cairo atelier or by any high-end tailor.',
          'Available sizes: XS (UK 6-8), S (UK 8-10), M (UK 10-12), L (UK 12-14), XL (UK 14-16).'
        ],
        timestamp: 'Just now'
      };
    }

    // 3. Fabrics & Care Advice
    if (q.includes('fabric') || q.includes('cotton') || q.includes('linen') || q.includes('silk') || q.includes('خام') || q.includes('قماش') || q.includes('غسيل') || q.includes('عناية') || q.includes('care')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `LORÉA works exclusively with heirloom-grade natural fibers: 100% Egyptian Giza 45 extra-long staple cotton, French Normandy flax linen, and mulberry silk crepe. Here are our atelier preservation rules:`,
        textAr: `تلتزم لوريا باستخدام أجود الخامات الطبيعية: قطن جيزة 45 فائق النعومة، الكتان الفرنسي الفاخر، والحرير النقي.`,
        stylingTips: [
          'Egyptian Giza Cotton: Cold gentle wash or dry clean. Low steam inside-out.',
          'Normandy Linen: Machine wash cold on delicate cycle with mild detergent; dry flat in shade to preserve crisp breathability.',
          'Mulberry Silk & Crepe: Specialist green dry clean recommended; avoid spraying perfume directly onto silk.',
          'Steaming: Always use a vertical garment steamer rather than a harsh direct iron to keep natural luster intact.'
        ],
        timestamp: 'Just now'
      };
    }

    // 4. Modest & Saheli / Summer styling
    if (q.includes('modest') || q.includes('حجاب') || q.includes('محتشم') || q.includes('sahel') || q.includes('ساحل') || q.includes('صيف') || q.includes('summer')) {
      const modestProds = PRODUCTS.filter(
        (p) => (p.category || '').toLowerCase().includes('modest') || (p.tags || []).some((t) => t.toLowerCase().includes('modest') || t.toLowerCase().includes('linen'))
      ).slice(0, 3);

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `For refined modest elegance and warm-climate poise, we curate full-coverage pieces cut from breathable high-thread-count fabrics that stay refreshingly cool while maintaining full opacity.`,
        textAr: `لأناقة محتشمة تجمع بين الوقار والعصرية في المناخ الدافئ، نوصي بالأقمشة الطبيعية عالية الكثافة مع القصّات الطويلة الانسيابية.`,
        recommendedProducts: modestProds.length > 0 ? modestProds : PRODUCTS.slice(0, 3),
        stylingTips: [
          'Layer lightweight linen dusters over monochromatic tonal basics.',
          'Pair with our breathable woven modal and silk scarves for effortless draping.',
          'Select Desert Sand and Alabaster tones to deflect sun heat with quiet poise.'
        ],
        timestamp: 'Just now'
      };
    }

    // 5. Default bespoke fashion advice
    const recommended = currentProd ? findComplementaryProducts(currentProd) : PRODUCTS.slice(0, 3);
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Based on LORÉA's quiet luxury philosophy: every piece is designed to be timeless and modular. Whether transitioning from morning appointments to an intimate dinner, harmonize textures like crisp cotton with fluid silk.`,
      textAr: `فلسفة لوريا ترتكز على الفخامة الهادئة: قطع متكاملة ومستدامة ترافقكِ بكل ثقة من اجتماعات الصباح إلى أرقى المناسبات المسائية.`,
      recommendedProducts: recommended,
      stylingTips: [
        'Focus on silhouette balance: Pair wide-leg trousers with structured tailored tops.',
        'Embrace tonal layering for an elongated, statuesque appearance.',
        'Choose timeless investment pieces that transcend seasonal trends.'
      ],
      timestamp: 'Just now'
    };
  };

  // Submit query handler
  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);
    setStatusNotice(null);

    // Try server API first if available, with immediate graceful fallback
    let responseHandled = false;
    try {
      const response = await fetch('/api/ai/style-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          selectedGarment: selectedProduct
            ? {
                id: selectedProduct.id,
                name: selectedProduct.name,
                category: selectedProduct.category,
                fabric: selectedProduct.fabric
              }
            : null
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.text) {
          const apiMsg: Message = {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: data.text,
            textAr: data.textAr,
            stylingTips: data.stylingTips,
            recommendedProducts:
              Array.isArray(data.recommendedProductIds) && data.recommendedProductIds.length > 0
                ? PRODUCTS.filter((p) => data.recommendedProductIds.includes(p.id))
                : findComplementaryProducts(selectedProduct || PRODUCTS[0]),
            outfitBreakdown: data.outfitBreakdown,
            timestamp: 'Just now'
          };
          setMessages((prev) => [...prev, apiMsg]);
          responseHandled = true;
        }
      }
    } catch {
      // Server unreachable, offline, or static GitHub Pages hosting
    }

    if (!responseHandled) {
      // Activate built-in Atelier Stylist Intelligence instantly
      const fallbackMsg = generateAtelierResponse(textToSend, selectedProduct);
      setMessages((prev) => [...prev, fallbackMsg]);
      setStatusNotice('Operating in Atelier Curated Stylist mode.');
    }

    setIsLoading(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const handleSelectOccasion = (occ: (typeof ATELIER_OCCASIONS)[0]) => {
    handleSend(`Curate an outfit for ${occ.labelEn}`);
  };

  const handleAddProduct = (product: Product) => {
    const size = product.sizes?.[0] || 'M';
    const color = product.colors?.[0]?.name || 'Standard';
    onAddToCart(product, size, color);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="lorea-ai-style-assistant-overlay"
      className="fixed inset-0 z-50 overflow-hidden bg-[#1D1D1B]/40 backdrop-blur-xs flex justify-end transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="lorea-ai-style-assistant-panel"
        role="dialog"
        aria-modal="true"
        aria-label="LORÉA AI Style Assistant"
        className="w-full max-w-xl sm:max-w-2xl bg-[#F7F4EF] text-[#1D1D1B] h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out border-l border-[#EAE5DE]"
      >
        {/* TOP HEADER */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-[#EAE5DE] flex items-center justify-between bg-[#F7F4EF]/95 backdrop-blur-xs sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#1D1D1B] text-[#BA945A] flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-lg sm:text-xl font-medium tracking-wide text-[#1D1D1B]">
                  LORÉA AI STYLE ASSISTANT
                </h2>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-[#BA945A]/15 text-[#BA945A] font-semibold">
                  Atelier
                </span>
              </div>
              <p className="text-xs text-[#1D1D1B]/60 font-sans tracking-normal mt-0.5">
                Bespoke silhouettes, outfit curation, and fabric counsel
              </p>
            </div>
          </div>

          <button
            id="close-ai-assistant-btn"
            onClick={onClose}
            className="p-2 text-[#1D1D1B]/60 hover:text-[#1D1D1B] hover:bg-[#EAE5DE]/60 rounded-full transition-colors cursor-pointer"
            aria-label="Close Style Assistant"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* ACTIVE GARMENT BANNER (IF OPENED FROM PRODUCT PAGE OR CARD) */}
        {selectedProduct && (
          <div className="px-5 py-2.5 sm:px-6 bg-[#EFECE6] border-b border-[#EAE5DE] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3 overflow-hidden">
              <img
                src={selectedProduct.images?.[0] || ''}
                alt={selectedProduct.name}
                className="w-8 h-10 object-cover rounded-xs border border-[#EAE5DE]"
              />
              <div className="truncate">
                <span className="text-[#1D1D1B]/50 block text-[10px] uppercase tracking-wider">
                  Styling Focus
                </span>
                <span className="font-medium text-[#1D1D1B] truncate block">
                  {selectedProduct.name}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-[11px] text-[#BA945A] hover:underline cursor-pointer ml-3 shrink-0"
            >
              Clear focus
            </button>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="px-5 sm:px-6 border-b border-[#EAE5DE] flex space-x-6 text-xs uppercase tracking-wider font-medium text-[#1D1D1B]/60">
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 relative cursor-pointer transition-colors ${
              activeTab === 'chat' ? 'text-[#1D1D1B] font-semibold' : 'hover:text-[#1D1D1B]'
            }`}
          >
            <span>Stylist Consultation</span>
            {activeTab === 'chat' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BA945A]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('outfits')}
            className={`py-3 relative cursor-pointer transition-colors ${
              activeTab === 'outfits' ? 'text-[#1D1D1B] font-semibold' : 'hover:text-[#1D1D1B]'
            }`}
          >
            <span>Occasions & Looks</span>
            {activeTab === 'outfits' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BA945A]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('fabrics')}
            className={`py-3 relative cursor-pointer transition-colors ${
              activeTab === 'fabrics' ? 'text-[#1D1D1B] font-semibold' : 'hover:text-[#1D1D1B]'
            }`}
          >
            <span>Fabrics & Care</span>
            {activeTab === 'fabrics' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BA945A]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('sizing')}
            className={`py-3 relative cursor-pointer transition-colors ${
              activeTab === 'sizing' ? 'text-[#1D1D1B] font-semibold' : 'hover:text-[#1D1D1B]'
            }`}
          >
            <span>Fit & Silhouette</span>
            {activeTab === 'sizing' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BA945A]" />
            )}
          </button>
        </div>

        {/* STATUS NOTICE IF IN OFFLINE / CURATED MODE */}
        {statusNotice && (
          <div className="px-5 py-2 bg-[#F3EFE8] text-[#1D1D1B]/70 text-[11px] flex items-center justify-between border-b border-[#EAE5DE]">
            <div className="flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-[#BA945A]" />
              <span>{statusNotice}</span>
            </div>
            <button
              onClick={() => setStatusNotice(null)}
              className="text-[#1D1D1B]/40 hover:text-[#1D1D1B] cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* TAB 1: CHAT & CONSULTATION */}
        {activeTab === 'chat' && (
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 space-y-6">
            {/* Quick Inspiration Chips */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#1D1D1B]/50 block">
                Recommended Consultations
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickPrompt('Curate a complete outfit for a Cairo evening event')}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#EAE5DE] hover:border-[#BA945A] hover:bg-[#FDFBF7] text-[#1D1D1B] transition-colors cursor-pointer text-left"
                >
                  ✨ Cairo Evening Look
                </button>
                <button
                  onClick={() => handleQuickPrompt('How should I style the Architectural Linen Column Dress?')}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#EAE5DE] hover:border-[#BA945A] hover:bg-[#FDFBF7] text-[#1D1D1B] transition-colors cursor-pointer text-left"
                >
                  👗 Style Linen Column Dress
                </button>
                <button
                  onClick={() => handleQuickPrompt('What are the best lightweight pieces for Modest Wear?')}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#EAE5DE] hover:border-[#BA945A] hover:bg-[#FDFBF7] text-[#1D1D1B] transition-colors cursor-pointer text-left"
                >
                  🌿 Modest Summer Edit
                </button>
                <button
                  onClick={() => handleQuickPrompt('How do I wash and steam Egyptian Giza cotton?')}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#EAE5DE] hover:border-[#BA945A] hover:bg-[#FDFBF7] text-[#1D1D1B] transition-colors cursor-pointer text-left"
                >
                  🧼 Fabric & Care Guide
                </button>
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-6 pt-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-sm p-4 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#1D1D1B] text-[#F7F4EF] text-sm'
                        : 'bg-white border border-[#EAE5DE] text-[#1D1D1B] text-sm shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {msg.textAr && (
                      <p className="text-xs text-[#1D1D1B]/70 mt-2 pt-2 border-t border-[#EAE5DE] font-sans">
                        {msg.textAr}
                      </p>
                    )}

                    {/* Outfit Breakdown if present */}
                    {msg.outfitBreakdown && (
                      <div className="mt-4 pt-3 border-t border-[#EAE5DE] bg-[#F7F4EF]/60 p-3 rounded-xs space-y-1.5 text-xs">
                        <div className="font-serif font-medium text-sm text-[#BA945A]">
                          Curated Outfit Formula
                        </div>
                        {msg.outfitBreakdown.mainPiece && (
                          <div className="flex items-start justify-between">
                            <span className="text-[#1D1D1B]/60">Hero Piece:</span>
                            <span className="font-medium text-right text-[#1D1D1B]">
                              {msg.outfitBreakdown.mainPiece}
                            </span>
                          </div>
                        )}
                        {msg.outfitBreakdown.layering && (
                          <div className="flex items-start justify-between">
                            <span className="text-[#1D1D1B]/60">Outer Layer:</span>
                            <span className="font-medium text-right text-[#1D1D1B]">
                              {msg.outfitBreakdown.layering}
                            </span>
                          </div>
                        )}
                        {msg.outfitBreakdown.footwear && (
                          <div className="flex items-start justify-between">
                            <span className="text-[#1D1D1B]/60">Footwear:</span>
                            <span className="font-medium text-right text-[#1D1D1B]">
                              {msg.outfitBreakdown.footwear}
                            </span>
                          </div>
                        )}
                        {msg.outfitBreakdown.accessories && (
                          <div className="flex items-start justify-between">
                            <span className="text-[#1D1D1B]/60">Accents:</span>
                            <span className="font-medium text-right text-[#1D1D1B]">
                              {msg.outfitBreakdown.accessories}
                            </span>
                          </div>
                        )}
                        {msg.outfitBreakdown.palette && (
                          <div className="flex items-start justify-between">
                            <span className="text-[#1D1D1B]/60">Palette:</span>
                            <span className="font-medium text-right text-[#BA945A]">
                              {msg.outfitBreakdown.palette}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Styling Tips bullet points */}
                    {msg.stylingTips && msg.stylingTips.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#EAE5DE] space-y-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#BA945A] block font-semibold">
                          Atelier Advice
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-xs text-[#1D1D1B]/80">
                          {msg.stylingTips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Interactive Recommended Catalog Products */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#EAE5DE] space-y-2">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#1D1D1B]/50 block">
                          Coordinating Atelier Pieces
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {msg.recommendedProducts.map((prod) => (
                            <div
                              key={prod.id}
                              className="flex items-center space-x-3 p-2 rounded-xs border border-[#EAE5DE] bg-[#FDFBF7] hover:border-[#BA945A] transition-colors"
                            >
                              <img
                                src={prod.images?.[0] || ''}
                                alt={prod.name}
                                className="w-12 h-16 object-cover rounded-xs border border-[#EAE5DE]"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-medium text-[#1D1D1B] truncate">
                                  {prod.name}
                                </h4>
                                <p className="text-[11px] text-[#BA945A] font-serif mt-0.5">
                                  {currency === 'USD' ? `$${prod.priceUsd}` : `${prod.priceEgp} EGP`}
                                </p>
                                <div className="flex items-center space-x-2 mt-1.5">
                                  <button
                                    onClick={() => {
                                      if (onNavigateProduct) {
                                        onNavigateProduct(prod);
                                      }
                                      onClose();
                                    }}
                                    className="text-[10px] uppercase tracking-wider text-[#1D1D1B]/80 hover:text-[#BA945A] font-medium cursor-pointer inline-flex items-center"
                                  >
                                    <span>View</span>
                                    <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                                  </button>
                                  <span className="text-[#EAE5DE]">|</span>
                                  <button
                                    onClick={() => handleAddProduct(prod)}
                                    className="text-[10px] uppercase tracking-wider text-[#BA945A] hover:underline font-medium cursor-pointer inline-flex items-center"
                                  >
                                    {addedProductId === prod.id ? (
                                      <>
                                        <Check className="w-2.5 h-2.5 mr-0.5 text-emerald-600" />
                                        <span>Added</span>
                                      </>
                                    ) : (
                                      <span>Add Bag</span>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-xs text-[#1D1D1B]/60 p-3 bg-white border border-[#EAE5DE] rounded-sm max-w-xs animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#BA945A]" />
                  <span>Consulting LORÉA Couturier Stylist...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        {/* TAB 2: OCCASIONS & OUTFITS */}
        {activeTab === 'outfits' && (
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 space-y-5">
            <div>
              <h3 className="font-serif text-lg font-medium text-[#1D1D1B]">
                Curated Occasions & Styling Formulas
              </h3>
              <p className="text-xs text-[#1D1D1B]/60 mt-1">
                Select an occasion to generate an ensemble aligned with quiet luxury principles.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {ATELIER_OCCASIONS.map((occ) => (
                <div
                  key={occ.id}
                  onClick={() => {
                    setActiveTab('chat');
                    handleSelectOccasion(occ);
                  }}
                  className="p-4 rounded-sm border border-[#EAE5DE] bg-white hover:border-[#BA945A] hover:bg-[#FDFBF7] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif font-medium text-base text-[#1D1D1B] group-hover:text-[#BA945A] transition-colors">
                        {occ.labelEn}
                      </h4>
                      <p className="text-xs text-[#1D1D1B]/50 font-sans mt-0.5">{occ.labelAr}</p>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#EAE5DE]/50 text-[#1D1D1B]/70">
                      Curate Look
                    </span>
                  </div>
                  <p className="text-xs text-[#1D1D1B]/80 mt-2 leading-relaxed">
                    {occ.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-[#EAE5DE]/50 flex items-center justify-between text-[11px] text-[#BA945A]">
                    <span>Palette: {occ.palette}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FABRICS & CARE */}
        {activeTab === 'fabrics' && (
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 space-y-5">
            <div>
              <h3 className="font-serif text-lg font-medium text-[#1D1D1B]">
                Atelier Textiles & Preservation Guide
              </h3>
              <p className="text-xs text-[#1D1D1B]/60 mt-1">
                Master craftsmanship demands enduring care. Learn how to maintain your LORÉA garments for decades.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-sm border border-[#EAE5DE] bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-medium text-sm text-[#1D1D1B]">
                    Egyptian Giza 45 Long-Staple Cotton
                  </h4>
                  <span className="text-[10px] uppercase font-mono text-[#BA945A]">Cairo Atelier</span>
                </div>
                <p className="text-xs text-[#1D1D1B]/70 leading-relaxed">
                  Known globally as the "Queen of Cottons," Giza 45 possesses extraordinarily long and fine fibers that provide exceptional silkiness, high tensile strength, and lasting breathability.
                </p>
                <div className="pt-2 border-t border-[#EAE5DE] text-xs text-[#1D1D1B]/80 space-y-1">
                  <div>• Cold machine wash on gentle cycle with neutral pH detergent.</div>
                  <div>• Hang on padded wooden hangers in shaded breezeway.</div>
                  <div>• Vertical steam to release wrinkles without flattening the weave.</div>
                </div>
              </div>

              <div className="p-4 rounded-sm border border-[#EAE5DE] bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-medium text-sm text-[#1D1D1B]">
                    French Normandy Flax Linen
                  </h4>
                  <span className="text-[10px] uppercase font-mono text-[#BA945A]">Normandy Harvest</span>
                </div>
                <p className="text-xs text-[#1D1D1B]/70 leading-relaxed">
                  Washed linen softens with every wear and wash. Its natural moisture-wicking and thermo-regulating properties make it the quintessential summer luxury fabric.
                </p>
                <div className="pt-2 border-t border-[#EAE5DE] text-xs text-[#1D1D1B]/80 space-y-1">
                  <div>• Wash inside-out in cold water. Never use chlorine bleach.</div>
                  <div>• Lay flat or line dry; embrace the subtle organic crinkle of natural flax.</div>
                </div>
              </div>

              <div className="p-4 rounded-sm border border-[#EAE5DE] bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-medium text-sm text-[#1D1D1B]">
                    Mulberry Silk & Fluid Silk Crepe
                  </h4>
                  <span className="text-[10px] uppercase font-mono text-[#BA945A]">Haute Couture</span>
                </div>
                <p className="text-xs text-[#1D1D1B]/70 leading-relaxed">
                  Liquid drape and subtle natural luster that moves like second skin. Requires delicate handling to protect delicate filament yarns.
                </p>
                <div className="pt-2 border-t border-[#EAE5DE] text-xs text-[#1D1D1B]/80 space-y-1">
                  <div>• Professional ecological dry clean strongly advised.</div>
                  <div>• Store away from direct sunlight in breathable cotton garment bags.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SIZING & SILHOUETTE */}
        {activeTab === 'sizing' && (
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 space-y-5">
            <div>
              <h3 className="font-serif text-lg font-medium text-[#1D1D1B]">
                Silhouette & Measurement Guide
              </h3>
              <p className="text-xs text-[#1D1D1B]/60 mt-1">
                How to determine your ideal size across LORÉA European and Egyptian tailoring.
              </p>
            </div>

            <div className="overflow-x-auto border border-[#EAE5DE] rounded-sm bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#EFECE6] text-[#1D1D1B] uppercase tracking-wider font-mono text-[10px] border-b border-[#EAE5DE]">
                  <tr>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">UK / EG</th>
                    <th className="py-2.5 px-3">Bust (cm)</th>
                    <th className="py-2.5 px-3">Waist (cm)</th>
                    <th className="py-2.5 px-3">Hips (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DE] text-[#1D1D1B]/80">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#1D1D1B]">XS</td>
                    <td className="py-2.5 px-3">UK 6-8 (34-36)</td>
                    <td className="py-2.5 px-3">80 - 84</td>
                    <td className="py-2.5 px-3">62 - 66</td>
                    <td className="py-2.5 px-3">88 - 92</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#1D1D1B]">S</td>
                    <td className="py-2.5 px-3">UK 8-10 (36-38)</td>
                    <td className="py-2.5 px-3">84 - 88</td>
                    <td className="py-2.5 px-3">66 - 70</td>
                    <td className="py-2.5 px-3">92 - 96</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#1D1D1B]">M</td>
                    <td className="py-2.5 px-3">UK 10-12 (38-40)</td>
                    <td className="py-2.5 px-3">88 - 94</td>
                    <td className="py-2.5 px-3">70 - 76</td>
                    <td className="py-2.5 px-3">96 - 102</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#1D1D1B]">L</td>
                    <td className="py-2.5 px-3">UK 12-14 (40-42)</td>
                    <td className="py-2.5 px-3">94 - 100</td>
                    <td className="py-2.5 px-3">76 - 82</td>
                    <td className="py-2.5 px-3">102 - 108</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#1D1D1B]">XL</td>
                    <td className="py-2.5 px-3">UK 14-16 (42-44)</td>
                    <td className="py-2.5 px-3">100 - 106</td>
                    <td className="py-2.5 px-3">82 - 88</td>
                    <td className="py-2.5 px-3">108 - 114</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-sm border border-[#EAE5DE] bg-white space-y-2 text-xs text-[#1D1D1B]/80">
              <span className="font-serif font-medium text-sm text-[#1D1D1B] block">
                Atelier Fit Note
              </span>
              <p>
                Our column dresses and duster coats feature a relaxed ease of +4 to +6 cm over body measurements to ensure flowing elegance and complete comfort throughout the day.
              </p>
              <button
                onClick={() => {
                  setActiveTab('chat');
                  handleQuickPrompt('Help me choose my size for a relaxed vs tailored fit');
                }}
                className="text-[#BA945A] hover:underline font-medium pt-1 inline-flex items-center cursor-pointer"
              >
                <span>Ask Stylist for custom sizing advice</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* INPUT FORM (STICKY AT BOTTOM FOR CHAT) */}
        {activeTab === 'chat' && (
          <div className="p-4 sm:p-5 border-t border-[#EAE5DE] bg-[#F7F4EF] sticky bottom-0 z-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                id="ai-style-assistant-input"
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about outfit curation, piece pairings, sizes, or fabrics..."
                disabled={isLoading}
                className="flex-1 bg-white border border-[#EAE5DE] focus:border-[#BA945A] focus:outline-none px-4 py-2.5 text-xs sm:text-sm rounded-sm text-[#1D1D1B] placeholder-[#1D1D1B]/40 transition-colors"
              />
              <button
                id="ai-style-assistant-send-btn"
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="bg-[#1D1D1B] text-[#BA945A] hover:bg-[#BA945A] hover:text-[#1D1D1B] disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-sm transition-colors cursor-pointer shrink-0"
                aria-label="Send message to style assistant"
              >
                <Send className="w-4 h-4 stroke-[1.8]" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 text-[10px] text-[#1D1D1B]/40 font-mono tracking-tight">
              <span>LORÉA Atelier AI · Haute Prêt-à-Porter</span>
              <span>Available in English & Arabic</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
