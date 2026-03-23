'use client';

import { SlidersHorizontal } from 'lucide-react';

type Props = {
  sort: string;
  setSort: (v: string) => void;
};

export function ProductToolbar({ sort, setSort }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <p className="text-xs font-medium text-gray-500">
        Showing verified materials
      </p>

      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} className="text-gray-400" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none"
        >
          <option value="latest">Newest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>
    </div>
  );
}
