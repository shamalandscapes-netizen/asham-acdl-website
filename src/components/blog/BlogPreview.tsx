// components/blog/BlogPreview.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Calendar,
  TrendingUp,
  Bookmark,
  Heart,
} from 'lucide-react'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt?: string
  image_url?: string
  category?: string
  createdAt: string
  readTime?: number
  likes?: number
  views?: number
}

interface BlogPreviewProps {
  posts?: Post[]
  title?: string
  subtitle?: string
  showMeta?: boolean
  columns?: 2 | 3 | 4
  variant?: 'grid' | 'featured' | 'minimal'
}

// ─── STAGGERED GRID VARIANT ───────────────────────────────────

function GridCard({ post, index }: { post: Post; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-gray-100 mb-6 shadow-sm">
          <Image
            src={post.image_url || '/placeholder-blog.jpg'}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-[#06392F]/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Hover Content */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.div
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: isHovered ? 1 : 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <ArrowUpRight size={24} className="text-[#06392F]" />
            </motion.div>
          </motion.div>

          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-5 left-5">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.2em] text-[#06392F] rounded-full">
                {post.category}
              </span>
            </div>
          )}

          {/* Bookmark */}
          <motion.div
            className="absolute top-5 right-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={(e) => e.preventDefault()}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-[#06392F] transition-colors"
            >
              <Bookmark size={16} />
            </button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-2 space-y-3">
          {/* Meta */}
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(post.createdAt).toLocaleDateString('en-KE', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {post.readTime && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {post.readTime} min
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-black uppercase italic tracking-tighter leading-[1.1] text-gray-900 group-hover:text-[#06392F] transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between pt-2">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#06392F] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
              Read Article <ArrowRight size={12} />
            </span>

            {post.likes !== undefined && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <Heart size={11} className="text-red-400 fill-red-400" />
                {post.likes}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

// ─── FEATURED VARIANT (1 large + 2 small) ─────────────────────

function FeaturedLayout({ posts }: { posts: Post[] }) {
  const [featured, ...rest] = posts
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Featured Post */}
      <motion.div
        className="lg:col-span-7"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <Link
          href={`/blog/${featured.slug}`}
          className="group block"
          onMouseEnter={() => setHoveredId(featured._id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="relative aspect-[4/3] lg:aspect-[16/12] rounded-[2.5rem] overflow-hidden bg-gray-100 mb-6">
            <Image
              src={featured.image_url || '/placeholder-blog.jpg'}
              alt={featured.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div
              className={`absolute inset-0 bg-[#06392F]/40 transition-opacity duration-500 ${
                hoveredId === featured._id ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 bg-[#06392F]/90 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-[#C75B39] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                  Featured
                </span>
                {featured.category && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                    {featured.category}
                  </span>
                )}
              </div>
              <h3 className="text-2xl lg:text-4xl font-black uppercase italic tracking-tighter leading-[1.05] text-white mb-3">
                {featured.title}
              </h3>
              <p className="text-sm text-white/70 line-clamp-2 max-w-xl">
                {featured.excerpt}
              </p>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Side Posts */}
      <div className="lg:col-span-5 space-y-6">
        {rest.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group flex gap-5"
              onMouseEnter={() => setHoveredId(post._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={post.image_url || '/placeholder-blog.jpg'}
                  alt={post.title}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col justify-center py-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C75B39] mb-2">
                  {post.category}
                </span>
                <h4 className="text-lg font-black uppercase italic tracking-tighter leading-[1.1] text-gray-900 group-hover:text-[#06392F] transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h4>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  {new Date(post.createdAt).toLocaleDateString('en-KE', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── MINIMAL VARIANT (text-only list) ─────────────────────────

function MinimalList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-0 divide-y divide-gray-100">
      {posts.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="group flex items-center justify-between py-6 hover:px-4 transition-all duration-300 rounded-xl hover:bg-gray-50"
          >
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] w-8">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C75B39] mb-1 block">
                  {post.category}
                </span>
                <h4 className="text-lg font-black uppercase italic tracking-tighter text-gray-900 group-hover:text-[#06392F] transition-colors">
                  {post.title}
                </h4>
              </div>
            </div>
            <ArrowUpRight
              size={20}
              className="text-gray-300 group-hover:text-[#06392F] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
            />
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────

export default function BlogPreview({
  posts,
  title = 'Insights & Innovations',
  subtitle = 'The Journal',
  showMeta = true,
  columns = 3,
  variant = 'grid',
}: BlogPreviewProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // If no posts provided, this would need a data fetch hook
  // For now, assume posts are passed as props
  if (!posts || posts.length === 0) return null

  return (
    <section ref={ref} className="px-6 py-24 lg:py-32 bg-white lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.header
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <motion.div
              className="flex items-center gap-3 text-[10px] font-black text-[#06392F] uppercase tracking-[0.4em]"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="w-12 h-[2px] bg-[#06392F]" />
              {subtitle}
            </motion.div>
            <h2 className="text-4xl lg:text-6xl xl:text-7xl font-black italic tracking-tighter uppercase text-[#06392F] leading-[0.9]">
              {title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-[#C75B39]">
                {title.split(' ').slice(-1)}
              </span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/blog"
              className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#06392F] hover:text-[#C75B39] transition-colors"
            >
              <span className="border-b-2 border-current pb-1">
                View All Articles
              </span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </motion.header>

        {/* Content */}
        {variant === 'featured' && posts.length >= 3 ? (
          <FeaturedLayout posts={posts} />
        ) : variant === 'minimal' ? (
          <MinimalList posts={posts} />
        ) : (
          <div
            className={`grid grid-cols-1 gap-8 ${
              columns === 2
                ? 'md:grid-cols-2'
                : columns === 4
                ? 'md:grid-cols-2 lg:grid-cols-4'
                : 'md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {posts.map((post, index) => (
              <GridCard key={post._id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}