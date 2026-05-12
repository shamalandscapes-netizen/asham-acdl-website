/**
 * Defines the main categories for the Asham ACDL online materials store.
 * These are used for filtering products on the shop page and for organization.
 */
export const PRODUCT_CATEGORIES = [
  {
    id: 'cement',
    name: 'Cement & Concrete',
    description: 'High-grade cement, ready-mix concrete, and additives.',
  },
  {
    id: 'steel',
    name: 'Steel & Metal Products',
    description: 'Rebars, beams, wire mesh, and structural steel.',
  },
  {
    id: 'roofing',
    name: 'Roofing & Cladding',
    description: 'Box profile, iron sheets, tiles, and waterproofing materials.',
  },
  {
    id: 'lumber',
    name: 'Timber & Lumber',
    description: 'Treated timber, plywood, and wooden construction materials.',
  },
  {
    id: 'finishing',
    name: 'Finishing Materials',
    description: 'Paints, tiles, sanitary ware, and electrical fittings.',
  },
  {
    id: 'digital',
    name: 'Architectural Plans',
    description: 'Digital downloads of house plans and construction documents.',
  },
  {
    id: 'tools',
    name: 'Tools & Equipment',
    description: 'Heavy machinery rentals and essential hand tools.',
  },
];

/**
 * Helper function to quickly get a category name by its ID.
 */
export const getCategoryName = (id: string) => {
    const category = PRODUCT_CATEGORIES.find(c => c.id === id);
    return category ? category.name : 'Uncategorized';
};

/**
 * Returns a list of category IDs.
 */
export const getCategoryIds = () => {
    return PRODUCT_CATEGORIES.map(c => c.id);
};