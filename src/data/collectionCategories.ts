export interface CollectionCategoryItem {
  name: string;
  slug: string;
  categoryTarget: string; // Target category name used in onSelectCategory
  subcategoryTarget?: string;
  description?: string;
}

export const COLLECTION_CATEGORIES: CollectionCategoryItem[] = [
  {
    name: 'Dresses',
    slug: 'dresses',
    categoryTarget: 'Dresses',
    description: 'Sculptural drapery and fluid maxi silhouettes'
  },
  {
    name: 'Tops',
    slug: 'tops',
    categoryTarget: 'Tops',
    description: 'Giza 45 cotton button-downs and silk blouses'
  },
  {
    name: 'Bottoms',
    slug: 'bottoms',
    categoryTarget: 'Bottoms',
    description: 'Pleated wide-leg trousers and bias silk skirts'
  },
  {
    name: 'Sets',
    slug: 'sets',
    categoryTarget: 'Sets',
    description: 'Harmonious two-piece and monochromatic pairs'
  },
  {
    name: 'Outerwear',
    slug: 'outerwear',
    categoryTarget: 'Outerwear',
    description: 'Architectural trenches and tailored jackets'
  },
  {
    name: 'Modest Wear',
    slug: 'modest',
    categoryTarget: 'Modest Edit',
    description: 'Elevated full-coverage luxury silhouettes'
  },
  {
    name: 'Loungewear & Sleepwear',
    slug: 'loungewear',
    categoryTarget: 'Loungewear & Sleepwear',
    description: 'Organic cotton jersey and pure mulberry silk robes'
  },
  {
    name: 'Scarves',
    slug: 'scarves',
    categoryTarget: 'Scarves',
    description: 'Egyptian Giza cotton voiles and pure modal hijabs'
  }
];
