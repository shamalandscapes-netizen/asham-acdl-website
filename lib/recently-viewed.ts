const KEY = 'asham_recently_viewed';

export function saveRecentlyViewed(product: any) {
  if (typeof window === 'undefined') return;

  const existing = JSON.parse(localStorage.getItem(KEY) || '[]');
  const filtered = existing.filter((p: any) => p.id !== product.id);

  const updated = [product, ...filtered].slice(0, 4);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getRecentlyViewed() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}
