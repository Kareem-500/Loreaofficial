import { Product, Category } from '../types';
import { slugify } from '../config/routes';

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

