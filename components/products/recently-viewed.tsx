'use client';

import { useEffect, useState } from 'react';
import { getRecentlyViewed } from '@/lib/recently-viewed';
import { ProductCard } from './product-card';

export function RecentlyViewed() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  if (!items.length) return null;

  return (
    <section className="mt-20">
      <h2 className="text-xl font-black text-[#06392F] mb-6">
        Recently Viewed
      </h2>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
