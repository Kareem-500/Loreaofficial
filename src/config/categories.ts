/**
 * Complete LORÉA Women's Fashion Category & Subcategory Architecture
 * Follows exact specifications:
 * 1. DRESSES
 * 2. TOPS
 * 3. BOTTOMS
 * 4. SETS
 * 5. OUTERWEAR
 * 6. MODEST WEAR
 * 7. LOUNGEWEAR & SLEEPWEAR
 * 8. SCARVES
 */

export interface SubcategoryItem {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
}

export interface CollectionCategory {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  subtitle: string;
  description: string;
  image: string;
  subcategories: SubcategoryItem[];
}

export const WOMEN_CATEGORIES: CollectionCategory[] = [
  {
    id: 'dresses',
    name: 'Dresses',
    nameAr: 'فساتين',
    slug: 'dresses',
    subtitle: 'Sculptural drapery & effortless silhouettes',
    description: 'Timeless maxi, midi, and column dresses cut from stone-washed European flax linen, fine Egyptian cotton, and pure liquid silk.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { id: 'maxi-dresses', name: 'Maxi Dresses', nameAr: 'فساتين ماكسي', slug: 'maxi-dresses' },
      { id: 'midi-dresses', name: 'Midi Dresses', nameAr: 'فساتين ميدي', slug: 'midi-dresses' },
      { id: 'mini-dresses', name: 'Mini Dresses', nameAr: 'فساتين قصيرة', slug: 'mini-dresses' },
      { id: 'evening-dresses', name: 'Evening Dresses', nameAr: 'فساتين سهرة', slug: 'evening-dresses' },
      { id: 'casual-dresses', name: 'Casual Dresses', nameAr: 'فساتين كاجوال', slug: 'casual-dresses' },
      { id: 'shirt-dresses', name: 'Shirt Dresses', nameAr: 'فساتين قميص', slug: 'shirt-dresses' },
      { id: 'knit-dresses', name: 'Knit Dresses', nameAr: 'فساتين تريكو', slug: 'knit-dresses' },
      { id: 'party-dresses', name: 'Party Dresses', nameAr: 'فساتين مناسبات', slug: 'party-dresses' }
    ]
  },
  {
    id: 'tops',
    name: 'Tops',
    nameAr: 'بلايز وقمصان',
    slug: 'tops',
    subtitle: 'Giza cotton tailoring & gossamer blouses',
    description: 'Crisp oversized button-downs, gossamer silk blouses, and foundational tees spun from certified Egyptian Giza 45 extra-long staple cotton.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { id: 't-shirts', name: 'T-Shirts', nameAr: 'تيشيرتات', slug: 't-shirts' },
      { id: 'blouses', name: 'Blouses', nameAr: 'بلوزات', slug: 'blouses' },
      { id: 'shirts', name: 'Shirts', nameAr: 'قمصان', slug: 'shirts' },
      { id: 'long-shirts', name: 'Long Shirts', nameAr: 'قمصان طويلة', slug: 'long-shirts' },
      { id: 'tunics', name: 'Tunics', nameAr: 'تونيكات', slug: 'tunics' },
      { id: 'crop-tops', name: 'Crop Tops', nameAr: 'كروب توب', slug: 'crop-tops' },
      { id: 'knit-tops', name: 'Knit Tops', nameAr: 'بلايز صوف وتريكو', slug: 'knit-tops' },
      { id: 'bodysuits', name: 'Bodysuits', nameAr: 'بودي سوت', slug: 'bodysuits' },
      { id: 'tank-tops', name: 'Tank Tops', nameAr: 'تانك توب', slug: 'tank-tops' }
    ]
  },
  {
    id: 'bottoms',
    name: 'Bottoms',
    nameAr: 'بناطيل وتنانير',
    slug: 'bottoms',
    subtitle: 'High-waisted trousers & fluid bias skirts',
    description: 'Architectural pleated trousers, wide-leg linen culottes, and sweeping silk charmeuse bias skirts designed for effortless motion.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { id: 'trousers', name: 'Trousers', nameAr: 'بناطيل رسمية', slug: 'trousers' },
      { id: 'wide-leg-pants', name: 'Wide-Leg Pants', nameAr: 'بناطيل واسعة', slug: 'wide-leg-pants' },
      { id: 'straight-leg-pants', name: 'Straight-Leg Pants', nameAr: 'بناطيل بقصة مستقيمة', slug: 'straight-leg-pants' },
      { id: 'jeans', name: 'Jeans', nameAr: 'جينز', slug: 'jeans' },
      { id: 'leggings', name: 'Leggings', nameAr: 'ليجنز', slug: 'leggings' },
      { id: 'culottes', name: 'Culottes', nameAr: 'كولوت واسع', slug: 'culottes' },
      { id: 'skirts', name: 'Skirts', nameAr: 'تنانير', slug: 'skirts' },
      { id: 'maxi-skirts', name: 'Maxi Skirts', nameAr: 'تنانير ماكسي', slug: 'maxi-skirts' },
      { id: 'mini-skirts', name: 'Mini Skirts', nameAr: 'تنانير قصيرة', slug: 'mini-skirts' },
      { id: 'shorts', name: 'Shorts', nameAr: 'شورتات', slug: 'shorts' }
    ]
  },
  {
    id: 'sets',
    name: 'Sets',
    nameAr: 'أطقم منسقة',
    slug: 'sets',
    subtitle: 'Monochromatic pairs & co-ords',
    description: 'Harmonious two-piece and three-piece sets in textured woven linen, silk knitwear, and matching palette combinations.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { id: 'two-piece-sets', name: 'Two-Piece Sets', nameAr: 'أطقم قطعتين', slug: 'two-piece-sets' },
      { id: 'three-piece-sets', name: 'Three-Piece Sets', nameAr: 'أطقم ثلاث قطع', slug: 'three-piece-sets' },
      { id: 'casual-sets', name: 'Casual Sets', nameAr: 'أطقم كاجوال', slug: 'casual-sets' },
      { id: 'elegant-sets', name: 'Elegant Sets', nameAr: 'أطقم أنيقة', slug: 'elegant-sets' },
      { id: 'lounge-sets', name: 'Lounge Sets', nameAr: 'أطقم مريحة', slug: 'lounge-sets' },
      { id: 'knit-sets', name: 'Knit Sets', nameAr: 'أطقم تريكو', slug: 'knit-sets' },
      { id: 'matching-sets', name: 'Matching Sets', nameAr: 'أطقم متطابقة', slug: 'matching-sets' }
    ]
  },
  {
    id: 'outerwear',
    name: 'Outerwear',
    nameAr: 'معاطف وجواكيت',
    slug: 'outerwear',
    subtitle: 'Architectural trenches & fine tailoring',
    description: 'Double-faced virgin wool coats, structured blazers, draped trenches, and lightweight Egyptian cotton capes.',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { id: 'blazers', name: 'Blazers', nameAr: 'بليزرات', slug: 'blazers' },
      { id: 'jackets', name: 'Jackets', nameAr: 'جواكيت', slug: 'jackets' },
      { id: 'coats', name: 'Coats', nameAr: 'معاطف', slug: 'coats' },
      { id: 'cardigans', name: 'Cardigans', nameAr: 'كارديجان', slug: 'cardigans' },
      { id: 'trench-coats', name: 'Trench Coats', nameAr: 'معاطف ترنش', slug: 'trench-coats' },
      { id: 'vests', name: 'Vests', nameAr: 'فيستات', slug: 'vests' },
      { id: 'kimonos', name: 'Kimonos', nameAr: 'كيمونو', slug: 'kimonos' },
      { id: 'capes', name: 'Capes', nameAr: 'كاب ومعاطف درابيه', slug: 'capes' }
    ]
  },
  {
    id: 'modest',
    name: 'Modest Wear',
    nameAr: 'المجموعة المحتشمة',
    slug: 'modest',
    subtitle: 'Breathable opacities & elevated coverage',
    description: 'Full-coverage luxury silhouettes crafted with graceful movement, higher necklines, elongated sleeves, and non-sheer Egyptian natural weaves.',
    image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { id: 'modest-dresses', name: 'Modest Dresses', nameAr: 'فساتين محتشمة', slug: 'modest-dresses' },
      { id: 'long-shirts', name: 'Long Shirts', nameAr: 'قمصان طويلة', slug: 'long-shirts' },
      { id: 'tunics', name: 'Tunics', nameAr: 'تونيكات', slug: 'tunics' },
      { id: 'wide-leg-pants', name: 'Wide-Leg Pants', nameAr: 'بناطيل واسعة محتشمة', slug: 'wide-leg-pants' },
      { id: 'maxi-skirts', name: 'Maxi Skirts', nameAr: 'تنانير ماكسي', slug: 'maxi-skirts' },
      { id: 'modest-sets', name: 'Modest Sets', nameAr: 'أطقم محتشمة', slug: 'modest-sets' },
      { id: 'abayas', name: 'Abayas', nameAr: 'عبايات مودرن', slug: 'abayas' },
      { id: 'modest-outerwear', name: 'Modest Outerwear', nameAr: 'معاطف محتشمة', slug: 'modest-outerwear' }
    ]
  },
  {
    id: 'loungewear',
    name: 'Loungewear & Sleepwear',
    nameAr: 'ملابس المنزل والراحة',
    slug: 'loungewear',
    subtitle: 'Organic cotton jersey & Mulberry silk robes',
    description: 'Ultra-soft relaxed homewear, featherweight silk robes, and breathable cotton pajama sets for refined sanctuary living.',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { id: 'pajamas', name: 'Pajamas', nameAr: 'بيجامات', slug: 'pajamas' },
      { id: 'homewear', name: 'Homewear', nameAr: 'ملابس منزلية', slug: 'homewear' },
      { id: 'lounge-sets', name: 'Lounge Sets', nameAr: 'أطقم راحة منزلية', slug: 'lounge-sets' },
      { id: 'robes', name: 'Robes', nameAr: 'أرواب فاخرة', slug: 'robes' },
      { id: 'nightwear', name: 'Nightwear', nameAr: 'قمصان نوم ناعمة', slug: 'nightwear' }
    ]
  },
  {
    id: 'scarves',
    name: 'Scarves',
    nameAr: 'أوشحة وطرح',
    slug: 'scarves',
    subtitle: 'Modal silk, linen gauze & pure cashmere',
    description: 'Weightless Egyptian cotton voiles, pure modal hijabs, gossamer summer shawls, and brushed winter cashmere scarves.',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { id: 'hijabs', name: 'Hijabs', nameAr: 'طرح وحجابات', slug: 'hijabs' },
      { id: 'scarves-sub', name: 'Scarves', nameAr: 'أوشحة قطن وحرير', slug: 'scarves' },
      { id: 'shawls', name: 'Shawls', nameAr: 'شيلان صوف وكتان', slug: 'shawls' },
      { id: 'plain-scarves', name: 'Plain Scarves', nameAr: 'أوشحة سادة', slug: 'plain-scarves' },
      { id: 'printed-scarves', name: 'Printed Scarves', nameAr: 'أوشحة منقوشة', slug: 'printed-scarves' },
      { id: 'lightweight-scarves', name: 'Lightweight Scarves', nameAr: 'أوشحة صيفية خفيفة', slug: 'lightweight-scarves' },
      { id: 'winter-scarves', name: 'Winter Scarves', nameAr: 'أوشحة شتوية دافئة', slug: 'winter-scarves' }
    ]
  }
];

/**
 * Finds category by slug or name (case-insensitive)
 */
export function findCategory(slugOrName: string): CollectionCategory | undefined {
  const query = slugOrName.toLowerCase().trim();
  return WOMEN_CATEGORIES.find(
    (c) => c.slug === query || c.name.toLowerCase() === query || c.id === query
  );
}

/**
 * Finds subcategory within a category
 */
export function findSubcategory(categorySlug: string, subSlug: string): SubcategoryItem | undefined {
  const cat = findCategory(categorySlug);
  if (!cat) return undefined;
  const query = subSlug.toLowerCase().trim();
  return cat.subcategories.find(
    (s) => s.slug === query || s.name.toLowerCase() === query || s.id === query
  );
}
