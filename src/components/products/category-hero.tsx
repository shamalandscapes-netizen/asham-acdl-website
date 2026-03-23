'use client';

import { cn } from '@/lib/utils';

type CategoryHeroProps = {
  title: string;
  description: string;
  accent?: string;
};

export function CategoryHero({
  title,
  description,
  accent = '#C75B39',
}: CategoryHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-200 mb-10">
      <div className="max-w-4xl p-8 md:p-14">
        <span
          className="inline-block text-[10px] font-black uppercase tracking-widest mb-4"
          style={{ color: accent }}
        >
          Professional Grade Materials
        </span>

        <h1 className="text-3xl md:text-5xl font-black text-[#06392F] leading-tight">
          {title}
        </h1>

        <p className="max-w-xl mt-4 text-sm text-gray-500">
          {description}
        </p>
      </div>

      {/* Decorative */}
      <div className="absolute -right-24 -bottom-24 w-72 h-72 bg-[#06392F]/5 rounded-full" />
    </section>
  );
}
