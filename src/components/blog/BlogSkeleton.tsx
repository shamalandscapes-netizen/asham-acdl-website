// components/blog/BlogSkeleton.tsx
'use client'

import { motion } from 'framer-motion'

function SkeletonPulse({ className }: { className: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      />
    </div>
  )
}

export default function BlogSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      {/* ─── HERO SKELETON ─────────────────────────────────── */}
      <section className="relative bg-[#06392F] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-40 lg:pt-32 lg:pb-56">
          {/* Breadcrumb */}
          <SkeletonPulse className="w-40 h-4 rounded-full mb-8" />

          {/* Category Badge */}
          <SkeletonPulse className="w-32 h-7 rounded-full mb-6" />

          {/* Title */}
          <div className="space-y-3 mb-6">
            <SkeletonPulse className="w-full max-w-2xl h-12 sm:h-14 lg:h-16 rounded-xl" />
            <SkeletonPulse className="w-3/4 max-w-xl h-12 sm:h-14 lg:h-16 rounded-xl" />
          </div>

          {/* Excerpt */}
          <SkeletonPulse className="w-full max-w-xl h-5 rounded-lg mb-8" />

          {/* Meta */}
          <div className="flex items-center gap-6">
            <SkeletonPulse className="w-28 h-4 rounded-full" />
            <SkeletonPulse className="w-24 h-4 rounded-full" />
            <SkeletonPulse className="w-20 h-4 rounded-full" />
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mb-20 lg:-mb-32">
          <SkeletonPulse className="aspect-[16/9] lg:aspect-[21/9] rounded-2xl lg:rounded-3xl shadow-2xl" />
        </div>
      </section>

      {/* ─── CONTENT AREA SKELETON ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-32 lg:pt-48 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="sticky top-24 space-y-8">
              <SkeletonPulse className="w-28 h-5 rounded-lg" />
              
              {/* TOC */}
              <div className="space-y-3">
                <SkeletonPulse className="w-full h-4 rounded-lg" />
                <SkeletonPulse className="w-4/5 h-4 rounded-lg" />
                <SkeletonPulse className="w-5/6 h-4 rounded-lg" />
                <SkeletonPulse className="w-3/4 h-4 rounded-lg" />
                <SkeletonPulse className="w-full h-4 rounded-lg" />
              </div>

              {/* Author Card */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                <div className="flex items-center gap-4">
                  <SkeletonPulse className="w-14 h-14 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <SkeletonPulse className="w-32 h-5 rounded-lg" />
                    <SkeletonPulse className="w-20 h-3 rounded-lg" />
                  </div>
                </div>
                <SkeletonPulse className="w-full h-16 rounded-lg" />
                <div className="flex gap-2">
                  <SkeletonPulse className="w-9 h-9 rounded-full" />
                  <SkeletonPulse className="w-9 h-9 rounded-full" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-6 space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-4">
                {i % 3 === 0 && (
                  <SkeletonPulse className="w-3/4 h-8 rounded-lg" />
                )}
                <SkeletonPulse className="w-full h-5 rounded-lg" />
                <SkeletonPulse className="w-full h-5 rounded-lg" />
                <SkeletonPulse className="w-5/6 h-5 rounded-lg" />
                {i === 2 && (
                  <SkeletonPulse className="aspect-video rounded-2xl my-8" />
                )}
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-[#06392F] rounded-2xl p-6 space-y-4">
                <SkeletonPulse className="w-3/4 h-6 rounded-lg bg-white/10" />
                <SkeletonPulse className="w-full h-4 rounded-lg bg-white/10" />
                <SkeletonPulse className="w-full h-12 rounded-xl bg-white/10" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}