import { Product, Category } from '../types';
import { slugify } from '../config/routes';
import violetteDressImg from '../assets/images/dress_violette_mermaid_1790546911621.jpg';
import celestineDressImg from '../assets/images/dress_celestine_mermaid_1790546921019.jpg';
import azurelleDressImg from '../assets/images/dress_azurelle_highneck_1790546930763.jpg';
import coraliaDressImg from '../assets/images/dress_coralia_feather_1790546941004.jpg';
import emeraldDressImg from '../assets/images/dress_emerald_oneshoulder_1790620905060.jpg';
import whiteRuffledDressImg from '../assets/images/dress_crystal_white_ruffled_1790621016298.jpg';
import catDressesImg from '../assets/images/cat_dresses_editorial_1790620925859.jpg';
import catTopsImg from '../assets/images/cat_tops_blouse_1790620941579.jpg';
import catBottomsImg from '../assets/images/cat_bottoms_trousers_1790620960075.jpg';
import catSetsImg from '../assets/images/cat_sets_tailored_1790620974010.jpg';
import catScarvesImg from '../assets/images/cat_scarves_silk_1790620987905.jpg';
import catModestImg from '../assets/images/cat_modest_abaya_1790621001019.jpg';

export const CATEGORIES: Category[] = [
  {
    id: 'dresses',
    name: 'Dresses',
    nameAr: 'فساتين',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop',
    description: 'Sculptural silhouettes and fluid natural drapes designed for quiet presence.',
    itemCount: 14
  },
  {
    id: 'tops',
    name: 'Tops & Shirts',
    nameAr: 'قمصان وبلوزات',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
    description: 'Tailored Giza cotton button-downs and gossamer silk blouses.',
    itemCount: 18
  },
  {
    id: 'sets',
    name: 'Coordinated Sets',
    nameAr: 'أطقم منسقة',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    description: 'Effortless monochromatic pairings in textured linen and fine knits.',
    itemCount: 9
  },
  {
    id: 'outerwear',
    name: 'Outerwear',
    nameAr: 'معاطف وسترات',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop',
    description: 'Architectural trenches, double-faced wool coats, and relaxed car coats.',
    itemCount: 11
  },
  {
    id: 'pants',
    name: 'Trousers & Skirts',
    nameAr: 'بناطيل وتنانير',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    description: 'High-waisted wide leg trousers and bias-cut liquid silk skirts.',
    itemCount: 12
  },
  {
    id: 'modest-edit',
    name: 'Modest Edit',
    nameAr: 'المجموعة المحتشمة',
    image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1200&auto=format&fit=crop',
    description: 'Elevated long-line silhouettes, breathable opacities, and modern modesty.',
    itemCount: 16
  }
];

const RAW_PRODUCTS: Product[] = [
  {
    id: 'lorea-dress-violette',
    name: 'SHEER BALLOON SLEEVE EMBELLISHED MERMAID MAXI DRESS',
    nameAr: 'فستان ماكسي ميرميد بنفسجي بأكمام بالون وتطريز راقٍ',
    subtitle: 'Violet mermaid silhouette with delicate sheer organza sleeves',
    category: 'Dresses',
    subcategory: 'Occasion & Evening',
    collection: 'Best Sellers',
    priceEgp: 23378,
    originalPriceEgp: 27253,
    priceUsd: 475,
    originalPriceUsd: 550,
    badge: 'BEST SELLER',
    isTrending: true,
    colors: [
      { name: 'Violette', hex: '#4A154B' },
      { name: 'Midnight', hex: '#1D1D1B' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      violetteDressImg,
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'A striking couture evening piece crafted with a sculpted mermaid contour, sheer statement balloon sleeves, and delicate handcrafted crystal beadwork along the cuffs.',
    fabric: 'Crepe Silk & Italian Sheer Organza',
    fit: 'Fitted mermaid silhouette with dramatic floor sweep.',
    care: 'Specialist dry clean only.',
    shipping: 'Same-day VIP dispatch in Cairo & Giza. 48-hour delivery across Alexandria and Delta.',
    sku: 'LOR-DR-VIO-01',
    rating: 5.0,
    reviewsCount: 42,
    isModestEdit: true,
    tags: ['Trending', 'Mermaid Dress', 'Evening Wear', 'Occasion', 'Couture', 'Violette'],
    reviews: []
  },
  {
    id: 'lorea-dress-celestine',
    name: 'CRYSTAL EMBELLISHED LONG SLEEVE MERMAID MAXI DRESS - CELESTINE',
    nameAr: 'فستان ماكسي سماوي مطرز بالكريستال بأكمام طويلة',
    subtitle: 'Pastel celestial blue gown with hand-sewn crystal drops',
    category: 'Dresses',
    subcategory: 'Occasion & Evening',
    collection: 'Best Sellers',
    priceEgp: 22894,
    originalPriceEgp: 25818,
    priceUsd: 465,
    originalPriceUsd: 525,
    badge: 'BEST SELLER',
    isTrending: true,
    colors: [
      { name: 'Pure Ivory', hex: '#FFFFFF' },
      { name: 'Celestine Blue', hex: '#9BB8CD' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      whiteRuffledDressImg,
      celestineDressImg
    ],
    description: 'Ethereal designer mini dress and gown with off-shoulder layered ruffles and delicate crystal drops cascading across the bodice.',
    fabric: 'Heavy Silk Crepe & Shimmer Chiffon',
    fit: 'Precision tailored cut designed to accentuate fluid movement.',
    care: 'Specialist dry clean only.',
    shipping: 'Same-day VIP dispatch in Cairo & Giza. 48-hour delivery across Alexandria and Delta.',
    sku: 'LOR-DR-CEL-02',
    rating: 4.9,
    reviewsCount: 36,
    isModestEdit: true,
    tags: ['Trending', 'Couture', 'Evening', 'Crystal Embellished', 'Celestine'],
    reviews: []
  },
  {
    id: 'lorea-dress-azurelle',
    name: 'EMBELLISHED HIGH NECK FLARED SLEEVE MAXI DRESS - AZURELLE',
    nameAr: 'فستان ماكسي أزرق ملكي برقبة عالية وأكمام واسعة',
    subtitle: 'Royal sapphire blue gown with flared sleeves and neck jewels',
    category: 'Dresses',
    subcategory: 'Occasion & Evening',
    collection: 'Best Sellers',
    priceEgp: 23665,
    originalPriceEgp: 27253,
    priceUsd: 480,
    originalPriceUsd: 550,
    badge: 'BEST SELLER',
    isTrending: true,
    colors: [
      { name: 'Azurelle Royal', hex: '#1E3A8A' },
      { name: 'Nightshade', hex: '#0B132B' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      azurelleDressImg,
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Statuesque high-neck maxi dress with elongated bell sleeves and opulent jeweled beadwork adorning the collar.',
    fabric: 'Fine Wool-Silk Blend with Micro Beading',
    fit: 'Statuesque column-to-A-line silhouette with graceful drape.',
    care: 'Specialist dry clean only.',
    shipping: 'Same-day VIP dispatch in Cairo & Giza. 48-hour delivery across Alexandria and Delta.',
    sku: 'LOR-DR-AZU-03',
    rating: 5.0,
    reviewsCount: 29,
    isModestEdit: true,
    tags: ['Trending', 'High Neck', 'Flared Sleeve', 'Royal Blue', 'Azurelle'],
    reviews: []
  },
  {
    id: 'lorea-dress-coralia',
    name: 'FEATHER CUFF EMBELLISHED LONG SLEEVE MAXI DRESS - CORALIA',
    nameAr: 'فستان ماكسي مرجاني بأساور ريش وتطريز أنيق',
    subtitle: 'Vibrant coral gown with ostrich feather trimmed cuffs',
    category: 'Dresses',
    subcategory: 'Occasion & Evening',
    collection: 'Best Sellers',
    priceEgp: 29549,
    originalPriceEgp: 34429,
    priceUsd: 595,
    originalPriceUsd: 690,
    badge: 'BEST SELLER',
    isTrending: true,
    colors: [
      { name: 'Coralia', hex: '#FA7070' },
      { name: 'Blush Gold', hex: '#F6C90E' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      coraliaDressImg,
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'An iconic runway design featuring soft feather trimmed sleeves, golden micro-thread neckline embroidery, and a tailored sheath structure.',
    fabric: 'Sculptural Double-Faced Satin & Ethical Feather Trimming',
    fit: 'Structured elegant sheath falling straight to the ankle.',
    care: 'Specialist dry clean only.',
    shipping: 'Same-day VIP dispatch in Cairo & Giza. 48-hour delivery across Alexandria and Delta.',
    sku: 'LOR-DR-COR-04',
    rating: 4.9,
    reviewsCount: 31,
    isModestEdit: true,
    tags: ['Trending', 'Feather Cuff', 'Coral', 'Occasion', 'Coralia'],
    reviews: []
  },
  {
    id: 'lorea-dress-emerald',
    name: 'ONE SHOULDER DRAPED MAXI DRESS - EMERALD',
    nameAr: 'فستان ماكسي درابيه كتف واحد بلون الزمرد الملكي',
    subtitle: 'Royal emerald green gown with fluid one-shoulder drape',
    category: 'Dresses',
    subcategory: 'Occasion & Evening',
    collection: 'Best Sellers',
    priceEgp: 20765,
    originalPriceEgp: 24199,
    priceUsd: 420,
    originalPriceUsd: 490,
    badge: 'BEST SELLER',
    isTrending: true,
    colors: [
      { name: 'Emerald Green', hex: '#004B23' },
      { name: 'Forest Noir', hex: '#1B4332' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      emeraldDressImg,
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'A masterpiece of Grecian draping, this one-shoulder emerald evening gown cascades effortlessly to the floor with liquid silk jersey movement.',
    fabric: 'Liquid Silk Georgette & Crepe de Chine',
    fit: 'Fluid one-shoulder draped silhouette with floor-skimming length.',
    care: 'Specialist dry clean only.',
    shipping: 'Same-day VIP dispatch in Cairo & Giza. 48-hour delivery across Alexandria and Delta.',
    sku: 'LOR-DR-EME-05',
    rating: 5.0,
    reviewsCount: 48,
    isModestEdit: true,
    tags: ['Trending', 'One Shoulder', 'Emerald', 'Gown', 'Occasion'],
    reviews: []
  },
  {
    id: 'lorea-dress-ivory-pleat',
    name: 'PLEATED V-NECK BALLOON SLEEVE MAXI GOWN',
    nameAr: 'فستان سهرة ماكسي بليسيه بفتحة رقبة V وأكمام بالون',
    subtitle: 'Flowing ivory georgette with micro-accordion pleats',
    category: 'Dresses',
    subcategory: 'Occasion & Evening',
    collection: 'Best Sellers',
    priceEgp: 24500,
    originalPriceEgp: 28000,
    priceUsd: 495,
    originalPriceUsd: 565,
    badge: 'NEW',
    isTrending: true,
    colors: [
      { name: 'Pure Ivory', hex: '#FAF9F6' },
      { name: 'Champagne Gold', hex: '#E5D3B3' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      catDressesImg,
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'A diaphanous vision of fluid movement, cut in airy pleated georgette with romantic sheer bishop sleeves and a flattering fitted waistband.',
    fabric: 'Fine Silk Georgette & French Tulle',
    fit: 'Fitted bodice with flowy sunburst pleated maxi skirt.',
    care: 'Specialist dry clean only.',
    shipping: 'VIP delivery within 24 hours in Cairo & Giza.',
    sku: 'LOR-DR-PLEAT-06',
    rating: 5.0,
    reviewsCount: 32,
    isModestEdit: true,
    tags: ['Dresses', 'Pleated', 'Ivory', 'Evening', 'Occasion'],
    reviews: []
  },
  {
    id: 'lorea-top-atelier-blouse',
    name: 'ROMANTIC BALLOON SLEEVE COTTON ATELIER BLOUSE',
    nameAr: 'بلوزة قطن فاخرة بأكمام بالون رومانسية وتصميم فرنسي',
    subtitle: 'Crisp Giza 45 cotton poplin with artisanal mother-of-pearl buttons',
    category: 'Tops',
    subcategory: 'Blouses',
    collection: 'Best Sellers',
    priceEgp: 4850,
    originalPriceEgp: 5500,
    priceUsd: 98,
    originalPriceUsd: 110,
    badge: 'BEST SELLER',
    isTrending: true,
    colors: [
      { name: 'Optic White', hex: '#FFFFFF' },
      { name: 'Noir Black', hex: '#1D1D1B' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      catTopsImg,
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Crafted from Egypt’s finest Giza 45 cotton poplin, this shirt features sculptural gathered bishop sleeves and a structured pointed spread collar.',
    fabric: '100% Giza 45 Long-Staple Cotton Poplin',
    fit: 'Fluid relaxed fit designed for effortless tucking.',
    care: 'Machine wash gentle or dry clean.',
    shipping: 'Same-day dispatch in Cairo & Giza.',
    sku: 'LOR-TP-BLOUSE-01',
    rating: 4.9,
    reviewsCount: 41,
    isModestEdit: true,
    tags: ['Tops', 'Blouse', 'Giza Cotton', 'Atelier', 'Trending'],
    reviews: []
  },
  {
    id: 'lorea-bottom-pleated-trousers',
    name: 'HIGH-WAISTED TAILORED WIDE-LEG PALAZZO TROUSERS',
    nameAr: 'بنطال بالازو عالي الخصر بقصة رسمية مريحة بلون الرمال',
    subtitle: 'Architectural front pleats with weighted luxury drape',
    category: 'Bottoms',
    subcategory: 'Trousers',
    collection: 'Best Sellers',
    priceEgp: 5200,
    originalPriceEgp: 6000,
    priceUsd: 105,
    originalPriceUsd: 120,
    badge: 'BEST SELLER',
    isTrending: true,
    colors: [
      { name: 'Sand Dune', hex: '#E0D7C6' },
      { name: 'Onyx Noir', hex: '#1A1A1A' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      catBottomsImg,
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Precision-tailored in heavyweight wool-viscose twill with double deep pleats that open into an elongated, sweeping wide leg silhouette.',
    fabric: 'Fine Wool & Viscose Twill Blend',
    fit: 'High rise with floor-length wide leg break.',
    care: 'Eco dry clean only.',
    shipping: 'Express delivery across Egypt.',
    sku: 'LOR-BT-PALAZZO-01',
    rating: 5.0,
    reviewsCount: 28,
    isModestEdit: true,
    tags: ['Bottoms', 'Trousers', 'Wide Leg', 'Tailored', 'Trending'],
    reviews: []
  },
  {
    id: 'lorea-set-three-piece-linen',
    name: 'MONOCHROMATIC THREE-PIECE TAILORED LINEN SUIT',
    nameAr: 'بدلة كتان كاملة 3 قطع باللون العاجي بتفصيل راقٍ',
    subtitle: 'Structured blazer, tailored waistcoat, and fluid wide-leg trouser',
    category: 'Sets',
    subcategory: 'Tailored Sets',
    collection: 'Best Sellers',
    priceEgp: 14500,
    originalPriceEgp: 17200,
    priceUsd: 295,
    originalPriceUsd: 350,
    badge: 'LIMITED',
    isTrending: true,
    colors: [
      { name: 'Cream Ivory', hex: '#F4EFE6' },
      { name: 'Sahara Sand', hex: '#D2C4B2' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      catSetsImg,
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'An immaculate three-piece ensemble comprising a soft-shouldered single-button blazer, fitted V-neck vest, and pleated high-rise palazzo trousers.',
    fabric: '100% Belgian Flax Heavyweight Linen & Mulberry Silk Lining',
    fit: 'Tailored architectural fit with flowing movement.',
    care: 'Specialist dry clean only.',
    shipping: 'Signature archive suit bag included.',
    sku: 'LOR-ST-SUIT-03',
    rating: 5.0,
    reviewsCount: 39,
    isModestEdit: true,
    tags: ['Sets', 'Suit', 'Linen', 'Three Piece', 'Luxury'],
    reviews: []
  },
  {
    id: 'lorea-scarf-jacquard-silk',
    name: 'HERITAGE JACQUARD MULBERRY SILK SCARF & WRAP',
    nameAr: 'طرحة وشال حرير مولبيري جاكار بنقوش دقيقة فاخرة',
    subtitle: 'Lustrous 18-momme pure silk with subtle geometric jacquard weave',
    category: 'Scarves',
    subcategory: 'Silk Scarves',
    collection: 'Essentials',
    priceEgp: 2650,
    originalPriceEgp: 3100,
    priceUsd: 55,
    originalPriceUsd: 65,
    badge: 'BEST SELLER',
    isTrending: true,
    colors: [
      { name: 'Opal Champagne', hex: '#EBE5D8' },
      { name: 'Rose Taupe', hex: '#C7B198' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      catScarvesImg,
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Spun from pure grade 6A mulberry silk with an artisanal jacquard weave that catches light gracefully. Hand-rolled hems and non-slip drape.',
    fabric: '100% Grade 6A Pure Mulberry Silk (18 momme)',
    fit: 'Generous 100cm x 100cm square silhouette.',
    care: 'Gentle hand wash with silk wash or dry clean.',
    shipping: 'Packaged in signature LORÉA gold embossed box.',
    sku: 'LOR-SC-JACQUARD-01',
    rating: 5.0,
    reviewsCount: 57,
    isModestEdit: true,
    tags: ['Scarves', 'Silk', 'Hijab', 'Jacquard', 'Trending'],
    reviews: []
  },
  {
    id: 'lorea-abaya-crepe-couture',
    name: 'ARCHITECTURAL SILK CREPE COUTURE ABAYA',
    nameAr: 'عباية كوتور حرير كريب بتصميم معماري انسيابي أسود',
    subtitle: 'Deep obsidian black with clean concealed placket and weighted drape',
    category: 'Modest Edit',
    subcategory: 'Abayas',
    collection: 'Best Sellers',
    priceEgp: 8900,
    originalPriceEgp: 10500,
    priceUsd: 180,
    originalPriceUsd: 215,
    badge: 'BEST SELLER',
    isTrending: true,
    colors: [
      { name: 'Obsidian Noir', hex: '#111111' },
      { name: 'Midnight Charcoal', hex: '#1F1E1D' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      catModestImg,
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'An architectural expression of modern modest elegance. Tailored from weighted Japanese silk crepe that falls in uninterrupted vertical lines.',
    fabric: 'Heavy Japanese Silk Crepe de Chine',
    fit: 'Fluid floor-skimming loose silhouette with raglan sleeves.',
    care: 'Specialist eco dry clean only.',
    shipping: 'Same-day VIP courier in Cairo.',
    sku: 'LOR-AB-COUTURE-01',
    rating: 5.0,
    reviewsCount: 63,
    isModestEdit: true,
    tags: ['Modest', 'Abaya', 'Crepe', 'Couture', 'Black Tie'],
    reviews: []
  },
  {
    id: 'lorea-01',
    name: 'Architectural Linen Column Dress',
    nameAr: 'فستان كتان عمودي بتصميم هندسي',
    subtitle: 'Pure French-washed flax linen with refined split hem',
    category: 'Dresses',
    subcategory: 'Maxi Dresses',
    collection: 'New Collection',
    priceEgp: 3850,
    priceUsd: 78,
    badge: 'NEW',
    colors: [
      { name: 'Warm Ivory', hex: '#F7F4EF' },
      { name: 'Desert Taupe', hex: '#B7ADA2' },
      { name: 'Espresso Black', hex: '#1D1D1B' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'A timeless column dress crafted from European flax linen softened with a heritage stone wash. Designed with intentional negative space, an elongated boatneck, and delicate French seams that celebrate the body without clinging.',
    fabric: '100% Pre-washed European Flax Linen (185 gsm)',
    fit: 'Relaxed column silhouette. Skims gently over bust and hips. Falls to lower calf.',
    care: 'Gentle hand wash in cold water or eco dry clean. Air dry flat away from direct sunlight.',
    shipping: 'Complimentary shipping across Egypt (2–3 business days). Express international courier available (3–5 days).',
    sku: 'LOR-DR-0891-IV',
    rating: 4.9,
    reviewsCount: 38,
    isModestEdit: true,
    tags: ['Linen', 'Summer', 'Editorial', 'Column Dress', 'Modest', 'Natural Fabric'],
    reviews: [
      {
        id: 'r1',
        author: 'Nour El-Din H.',
        rating: 5,
        date: '2 weeks ago',
        title: 'The fabric weight is perfection',
        comment: 'Breathable yet completely opaque. The way it moves in Cairo heat while feeling so elevated is unmatched. Wore it to an art opening and received so many compliments.',
        verified: true
      },
      {
        id: 'r2',
        author: 'Yasmin K.',
        rating: 5,
        date: '1 month ago',
        title: 'Quiet luxury done right',
        comment: 'The French seam construction and subtle neckline remind me of The Row or Jil Sander, but cut with an understanding of our region. Truly exquisite.',
        verified: true
      }
    ]
  },
  {
    id: 'lorea-02',
    name: 'Giza 45 Cotton Oversized Shirt',
    nameAr: 'قميص قطن جيزة 45 كلاسيكي أوفرسايز',
    subtitle: 'Spun from world-renowned Egyptian extra-long staple cotton',
    category: 'Tops',
    subcategory: 'Button-Downs',
    collection: 'Best Sellers',
    priceEgp: 2950,
    priceUsd: 60,
    badge: 'BEST SELLER',
    colors: [
      { name: 'Chalk White', hex: '#FFFFFF' },
      { name: 'Sky Stripe', hex: '#D1DCE5' },
      { name: 'Soft Charcoal', hex: '#2A2928' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'The foundation of modern effortless dressing. Crafted from Egypt’s finest Giza 45 extra-long staple cotton, offering an extraordinary silky hand-feel and crisp, non-wrinkle longevity. Featuring natural mother-of-pearl buttons and drop shoulders.',
    fabric: '100% Giza 45 Egyptian Cotton Poplin (120/2 yarn count)',
    fit: 'Deliberate boyfriend oversized cut. Designed to be worn loose or tucked into high-rise trousers.',
    care: 'Machine wash delicate at 30°C. Medium iron with steam while slightly damp.',
    shipping: 'Same-day dispatch in Cairo & Giza. 48-hour delivery across Alexandria and Delta.',
    sku: 'LOR-TP-4502-WH',
    rating: 5.0,
    reviewsCount: 64,
    isModestEdit: true,
    tags: ['Giza Cotton', 'Boyfriend Shirt', 'Egyptian Heritage', 'Essentials', 'Office', 'Weekend'],
    reviews: [
      {
        id: 'r3',
        author: 'Dina M.',
        rating: 5,
        date: '3 days ago',
        title: 'Proud to wear Egyptian cotton this refined',
        comment: 'The collar stays crisp without feeling stiff. You can instantly feel the pedigree of Giza 45. It elevates denim or tailored trousers effortlessly.',
        verified: true
      }
    ]
  },
  {
    id: 'lorea-03',
    name: 'Tailored Silk-Wool Sand Trench',
    nameAr: 'معطف ترنش صوف وحرير بلون الرمال',
    subtitle: 'Double-breasted storm flap coat with weighted drape belt',
    category: 'Outerwear',
    subcategory: 'Trench Coats',
    collection: 'Limited Edition',
    priceEgp: 6900,
    priceUsd: 140,
    originalPriceEgp: 7800,
    originalPriceUsd: 160,
    badge: 'LIMITED',
    colors: [
      { name: 'Desert Sand', hex: '#D8CEBE' },
      { name: 'Nocturne Black', hex: '#151413' }
    ],
    sizes: ['S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'An architectural outerwear masterpiece inspired by desert shadows and urban clean lines. Woven from a lustrous silk-wool blend that provides warmth without bulk, finished with horn buttons and a dramatic storm flap.',
    fabric: '65% Virgin Wool, 35% Mulberry Silk. Cupro satin interior lining.',
    fit: 'Tailored architectural fit with soft raglan shoulders and sweeping calf-length hemline.',
    care: 'Specialist dry clean only. Store on wide wooden coat hanger.',
    shipping: 'Delivered in LORÉA signature garment bag with bespoke cedar hanger.',
    sku: 'LOR-OW-9912-SD',
    rating: 4.8,
    reviewsCount: 19,
    isModestEdit: true,
    tags: ['Trench', 'Silk Wool', 'Outerwear', 'Investment Piece', 'Winter Luxury'],
    reviews: [
      {
        id: 'r4',
        author: 'Laila S.',
        rating: 5,
        date: '1 week ago',
        title: 'A true investment piece',
        comment: 'The weight and drape when you walk is like cinema. The silk blend catches the golden hour light so subtly.',
        verified: true
      }
    ]
  },
  {
    id: 'lorea-04',
    name: 'Liquid Silk Charmeuse Bias Skirt',
    nameAr: 'تنورة حرير شارموز بقصة مائلة',
    subtitle: '22 momme heavyweight mulberry silk with elasticized waistband',
    category: 'Pants',
    subcategory: 'Midi Skirts',
    collection: 'Essentials',
    priceEgp: 3200,
    priceUsd: 65,
    badge: 'BEST SELLER',
    colors: [
      { name: 'Warm Taupe', hex: '#B7ADA2' },
      { name: 'Espresso', hex: '#262220' },
      { name: 'Dusty Rose', hex: '#B88F88' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Cut on the true bias to follow the natural curves of the female silhouette with liquid fluidity. Made from ultra-dense 22-momme silk that resists static cling and drapes effortlessly from dawn to dinner.',
    fabric: '100% Grade 6A Mulberry Silk Charmeuse (22 momme)',
    fit: 'Bias-cut drape. Fits true to size through waist, skimming softly over hips.',
    care: 'Hand wash cold with silk detergent or dry clean. Low iron inside out.',
    shipping: 'Complimentary luxury gift boxing with all silk orders.',
    sku: 'LOR-SK-3301-TP',
    rating: 4.9,
    reviewsCount: 42,
    isModestEdit: true,
    tags: ['Silk', 'Bias Skirt', 'Quiet Luxury', 'Midi', 'Evening', 'Wardrobe Essential'],
    reviews: [
      {
        id: 'r5',
        author: 'Farida A.',
        rating: 5,
        date: '3 weeks ago',
        title: 'Unbelievable drape',
        comment: 'So many silk skirts are too sheer or cling unflatteringly. This 22 momme fabric is heavy and luxurious.',
        verified: true
      }
    ]
  },
  {
    id: 'lorea-05',
    name: 'The Nile Flow Tiered Maxi Dress',
    nameAr: 'فستان ماكسي طبقات انسيابي',
    subtitle: 'Breathable organic cotton voile with micro-pintuck detailing',
    category: 'Dresses',
    subcategory: 'Maxi Dresses',
    collection: 'Seasonal',
    priceEgp: 4200,
    priceUsd: 85,
    badge: 'NEW',
    colors: [
      { name: 'Oatmeal Natural', hex: '#EDE8DF' },
      { name: 'Olive Umber', hex: '#585449' },
      { name: 'Soft Terracotta', hex: '#B88F88' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Inspired by gentle river breezes and morning light across Aswan. Detailed with artisan micro-pintucks along the bodice, hidden seam pockets, and generous tiered flounces that float as you walk.',
    fabric: '100% Certified Organic Egyptian Cotton Voile with self-cotton lining',
    fit: 'Voluminous tiered silhouette with adjustable tassel waist tie.',
    care: 'Machine wash delicate in mesh bag. Hang dry in shade.',
    shipping: 'Available for immediate dispatch.',
    sku: 'LOR-DR-7721-OAT',
    rating: 4.7,
    reviewsCount: 27,
    isModestEdit: true,
    tags: ['Modest Edit', 'Cotton Voile', 'Tiered Dress', 'Summer Evenings', 'Resort'],
    reviews: [
      {
        id: 'r6',
        author: 'Rana G.',
        rating: 5,
        date: '2 weeks ago',
        title: 'Modest elegance achieved',
        comment: 'Finding pieces that are simultaneously modest, modern, and made of 100% natural cotton is rare. LORÉA nailed this.',
        verified: true
      }
    ]
  },
  {
    id: 'lorea-06',
    name: 'Relaxed Tailored Linen Trouser',
    nameAr: 'بنطال كتان رسمي بقصة مريحة',
    subtitle: 'Double front pleats with concealed tab waistband',
    category: 'Pants',
    subcategory: 'Trousers',
    collection: 'Essentials',
    priceEgp: 3100,
    priceUsd: 62,
    badge: null,
    colors: [
      { name: 'Sand Taupe', hex: '#C2B8AA' },
      { name: 'Chalk White', hex: '#F9F8F5' },
      { name: 'Deep Espresso', hex: '#1D1D1B' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'A masterclass in tailored ease. Built with generous front pleats that expand gracefully when seated and drape straight down to pool subtly over sandals or loafers.',
    fabric: '100% Belgian Flax Heavyweight Linen (230 gsm)',
    fit: 'High-rise waist, wide leg profile with clean floor-length break.',
    care: 'Dry clean recommended or gentle hand wash.',
    shipping: 'Standard and express shipping options available at checkout.',
    sku: 'LOR-PN-1140-ST',
    rating: 4.9,
    reviewsCount: 31,
    isModestEdit: true,
    tags: ['Linen Trouser', 'Wide Leg', 'High Rise', 'Pleated Pants', 'Workwear'],
    reviews: []
  },
  {
    id: 'lorea-07',
    name: 'Textured Bouclé Cocoon Cardigan',
    nameAr: 'كارديجان بوكليه محبوك بتصميم شرنقة',
    subtitle: 'Spun from brushed alpaca wool and organic Egyptian cotton',
    category: 'Outerwear',
    subcategory: 'Cardigans',
    collection: 'New Collection',
    priceEgp: 3600,
    priceUsd: 72,
    badge: 'NEW',
    colors: [
      { name: 'Ivory Cream', hex: '#F5F2EC' },
      { name: 'Camel Warm', hex: '#B89774' }
    ],
    sizes: ['S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Enveloping softness with tactile depth. Knit in a chunky bouclé stitch that traps warmth while remaining featherlight on the shoulders. Features ribbed sleeve cuffs and an open drape collar.',
    fabric: '50% Baby Alpaca, 35% Egyptian Long-Staple Cotton, 15% Recycled Polyamide',
    fit: 'Slouchy cocoon fit. Dropped shoulders with deep patch pockets.',
    care: 'Dry clean or hand wash cold with wool wash. Dry flat.',
    shipping: 'Dispatches within 24 hours.',
    sku: 'LOR-KN-5520-CR',
    rating: 4.8,
    reviewsCount: 15,
    isModestEdit: true,
    tags: ['Knitwear', 'Boucle', 'Alpaca', 'Cardigan', 'Cozy Luxury'],
    reviews: []
  },
  {
    id: 'lorea-08',
    name: 'Monochrome Linen Shirt & Short Set',
    nameAr: 'طقم كتان أحادي اللون قميص وشورت',
    subtitle: 'Coordinated resort pairing in stone-washed European linen',
    category: 'Sets',
    subcategory: 'Resort Sets',
    collection: 'Seasonal',
    priceEgp: 4600,
    priceUsd: 92,
    badge: 'BEST SELLER',
    colors: [
      { name: 'Natural Oatmeal', hex: '#E6E0D5' },
      { name: 'Charcoal Black', hex: '#232221' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'The definitive warm-weather uniform. Comprises a boxy cuban collar shirt paired with tailored drawstring shorts, designed to be worn together or styled effortlessly as separates.',
    fabric: '100% Stonewashed European Flax Linen',
    fit: 'Boxy relaxed shirt and relaxed elastic-waist short with 4-inch inseam.',
    care: 'Machine wash delicate at 30°C. Do not tumble dry.',
    shipping: 'Next day delivery in Cairo.',
    sku: 'LOR-ST-8819-NO',
    rating: 4.9,
    reviewsCount: 22,
    isModestEdit: false,
    tags: ['Resort Set', 'Linen Set', 'Summer Uniform', 'Vacation Wear'],
    reviews: []
  },
  {
    id: 'lorea-09',
    name: 'Structured Poplin Wrap Blouse',
    nameAr: 'بلوزة بوبلين قطن بتصميم لف',
    subtitle: 'Sculpted crossover waist with asymmetric architectural ties',
    category: 'Tops',
    subcategory: 'Blouses',
    collection: 'New Collection',
    priceEgp: 2750,
    priceUsd: 55,
    badge: 'NEW',
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Muted Rose', hex: '#B88F88' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Modern tailoring meets feminine grace. Constructed from crisp Egyptian poplin with a crossover wrap bodice that accentuates the natural waistline before flaring gently over the hips.',
    fabric: '100% Giza Cotton Poplin',
    fit: 'Tailored wrap with customizable waist cinch. Fits true to size.',
    care: 'Machine wash cold. Warm iron.',
    shipping: 'Complimentary returns within 14 days.',
    sku: 'LOR-TP-2291-PW',
    rating: 4.8,
    reviewsCount: 18,
    isModestEdit: true,
    tags: ['Wrap Top', 'Giza Cotton', 'Workwear', 'Feminine Tailoring'],
    reviews: []
  },
  {
    id: 'lorea-10',
    name: 'Minimalist Sand Silk Tunic & Trouser Set',
    nameAr: 'طقم تونيك وبنطال حرير بلون الرمال (المجموعة المحتشمة)',
    subtitle: 'Elongated side-slit tunic paired with fluid straight-leg trousers',
    category: 'Sets',
    subcategory: 'Modest Sets',
    collection: 'Limited Edition',
    priceEgp: 5800,
    priceUsd: 118,
    originalPriceEgp: 6500,
    originalPriceUsd: 130,
    badge: 'LIMITED',
    colors: [
      { name: 'Dune Sand', hex: '#DFD8CC' },
      { name: 'Basalt Charcoal', hex: '#1D1D1B' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'The pinnacle of contemporary modest evening wear. An elongated mid-calf tunic with discreet side slits layered over high-rise wide leg trousers. Made from a weighted silk-viscose crepe that cascades without static.',
    fabric: '70% Silk Charmeuse, 30% Eco-Vero Viscose',
    fit: 'Longline silhouette with generous coverage and architectural drape.',
    care: 'Dry clean only.',
    shipping: 'Delivered in LORÉA archive garment box.',
    sku: 'LOR-ST-9944-DN',
    rating: 5.0,
    reviewsCount: 29,
    isModestEdit: true,
    tags: ['Modest Edit', 'Silk Set', 'Tunic', 'Luxury Modest', 'Evening Elegance'],
    reviews: [
      {
        id: 'r7',
        author: 'Heba T.',
        rating: 5,
        date: '5 days ago',
        title: 'Outstanding modest fashion',
        comment: 'Finally a brand that treats modest silhouettes with high-fashion gravitas. The silk drape is majestic.',
        verified: true
      }
    ]
  },
  {
    id: 'lorea-11',
    name: 'Sleeveless Drape Cowl Neck Gown',
    nameAr: 'فستان سهرة كول انسدالي بدون أكمام',
    subtitle: 'Floor-sweeping liquid jersey with low back drape',
    category: 'Dresses',
    subcategory: 'Evening Gowns',
    collection: 'New Collection',
    priceEgp: 4900,
    priceUsd: 98,
    badge: 'NEW',
    colors: [
      { name: 'Espresso Bronze', hex: '#2E2723' },
      { name: 'Ivory Pearl', hex: '#F6F3ED' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Sculptural sensuality rooted in minimalism. A softly falling cowl neckline frames the collarbones, while the body contours effortlessly without restrictive boning, pooling into a subtle sweep train.',
    fabric: '95% Micro-Modal Silk Jersey, 5% Elastane',
    fit: 'Column silhouette that hugs the form and drapes dramatically to floor length.',
    care: 'Dry clean recommended.',
    shipping: 'Complimentary shipping across Egypt and GCC.',
    sku: 'LOR-DR-4402-BR',
    rating: 4.9,
    reviewsCount: 14,
    isModestEdit: false,
    tags: ['Evening', 'Cowl Neck', 'Gown', 'Minimalist Black Tie'],
    reviews: []
  },
  {
    id: 'lorea-12',
    name: 'The Everyday Pima Rib Tank',
    nameAr: 'توب تانك مضلع قطن بيما اليومي',
    subtitle: 'Ultra-fine compact rib knit with bound micro-collar',
    category: 'Tops',
    subcategory: 'T-Shirts & Tanks',
    collection: 'Essentials',
    priceEgp: 1450,
    priceUsd: 30,
    badge: 'BEST SELLER',
    colors: [
      { name: 'Soft Cream', hex: '#FAF7F0' },
      { name: 'Taupe Nude', hex: '#B7ADA2' },
      { name: 'Deep Black', hex: '#151413' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'The foundation layer perfected. Knit from double-mercerized Egyptian cotton with fine elastane recovery so it retains its sculpted shape wash after wash. Seamless body construction.',
    fabric: '92% Mercerized Egyptian Pima Cotton, 8% Lycra',
    fit: 'Fitted second-skin feel with bra-friendly shoulder straps.',
    care: 'Machine wash warm with like colors.',
    shipping: 'Ships in 24 hours.',
    sku: 'LOR-TP-1010-CR',
    rating: 5.0,
    reviewsCount: 51,
    isModestEdit: false,
    tags: ['Ribbed Tank', 'Layering', 'Wardrobe Foundation', 'Egyptian Cotton'],
    reviews: []
  },
  {
    id: 'lorea-13',
    slug: 'pure-mulberry-silk-kimono-robe',
    name: 'Pure Mulberry Silk Kimono Robe',
    nameAr: 'روب كيمونو حرير مولبيري فاخر',
    subtitle: 'Floor-length sanctuary robe with sweeping wide sleeves and sash',
    category: 'Loungewear & Sleepwear',
    subcategory: 'Robes',
    collection: 'Essentials',
    priceEgp: 5400,
    priceUsd: 110,
    badge: 'NEW',
    isNew: true,
    colors: [
      { name: 'Champagne Silk', hex: '#EBE2D4' },
      { name: 'Midnight Charcoal', hex: '#1C1B1A' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'An elevated home retreat silhouette. Crafted from 22-momme pure mulberry silk that glides weightlessly over skin, with interior ties for secure closure and dramatic floor-skimming length.',
    fabric: '100% Grade 6A Pure Mulberry Silk (22 momme)',
    fit: 'Relaxed kimono silhouette with adjustable matching silk belt.',
    care: 'Hand wash cold or gentle dry clean.',
    shipping: 'Complimentary luxury gift boxing.',
    sku: 'LOR-LW-6610-CP',
    rating: 4.9,
    reviewsCount: 19,
    isModestEdit: true,
    tags: ['Silk Robe', 'Loungewear', 'Sleepwear', 'Sanctuary', 'Mulberry Silk'],
    reviews: []
  },
  {
    id: 'lorea-14',
    slug: 'featherweight-giza-cotton-modal-hijab',
    name: 'Featherweight Giza Cotton Modal Hijab',
    nameAr: 'طرحة قطن جيزة ومودال خفيفة الوزن',
    subtitle: 'Non-slip breathable drape with hand-rolled artisan edges',
    category: 'Scarves',
    subcategory: 'Hijabs',
    collection: 'Essentials',
    priceEgp: 950,
    priceUsd: 20,
    badge: 'BEST SELLER',
    isNew: false,
    colors: [
      { name: 'Sand Nude', hex: '#DFD8CC' },
      { name: 'Pecan Brown', hex: '#7A6252' },
      { name: 'Basalt Black', hex: '#1D1D1B' }
    ],
    sizes: ['M'],
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'The definitive daily luxury scarf. Blended from extra-long staple Egyptian Giza cotton and Austrian modal for a buttery touch that stays impeccably in place without pins or slippage.',
    fabric: '60% Egyptian Giza Cotton, 40% Modal Voile',
    fit: 'Generous 85cm x 200cm drape with hand-finished artisan hems.',
    care: 'Hand wash cool with mild detergent. Line dry in shade.',
    shipping: 'Ships in 24 hours.',
    sku: 'LOR-SC-3310-SN',
    rating: 5.0,
    reviewsCount: 64,
    isModestEdit: true,
    tags: ['Hijab', 'Scarves', 'Giza Cotton', 'Modal Scarf', 'Modest Wear'],
    reviews: []
  }
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p): Product => ({
  ...p,
  slug: p.slug || slugify(p.name),
  isNew: p.isNew ?? (p.badge === 'NEW')
}));

/**
 * Lookup product by slug or id
 */
export function getProductBySlug(slugOrId: string): Product | undefined {
  if (!slugOrId) return undefined;
  const clean = slugify(slugOrId);
  return PRODUCTS.find((p) => p.slug === clean || p.id === slugOrId || slugify(p.name) === clean);
}

