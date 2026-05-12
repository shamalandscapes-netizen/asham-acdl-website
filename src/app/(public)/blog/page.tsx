import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import {
  ArrowRight,
  Clock,
  Calendar,
  Eye,
  TrendingUp,
  Building2,
  Leaf,
  HardHat,
  PenTool,
  ChevronRight,
} from 'lucide-react'

import NewsletterForm from '@/components/NewsletterForm'
import BlogSkeleton from '@/components/blog/BlogSkeleton'
import ErrorBoundary from '@/components/ErrorBoundary'
import { client } from '@/sanity/lib/client'

// ─── SEO METADATA ─────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'The Asham Journal | Architecture & Construction Insights | Nairobi, Kenya',
  description:
    'Expert perspectives on architectural design, sustainable construction, and building excellence from Asham Design & Construction — NEMA-licensed builders serving Nairobi and Kakamega since 2019.',
  keywords: [
    'construction blog Kenya',
    'Nairobi architects',
    'sustainable building Kenya',
    'Asham Construction',
    'residential construction Nairobi',
    'commercial construction Kenya',
    'NEMA licensed contractors',
    'building design East Africa',
  ],
  alternates: {
    canonical: 'https://ashamconstruction.co.ke/blog',
  },
  openGraph: {
    title: 'The Asham Journal | Architecture & Construction Insights',
    description:
      'Expert perspectives on architectural design and sustainable construction from Nairobi\'s trusted builders.',
    url: 'https://ashamconstruction.co.ke/blog',
    siteName: 'Asham Design & Construction',
    images: [
      {
        url: 'https://ashamconstruction.co.ke/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'The Asham Journal - Architecture and Construction Blog',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Asham Journal',
    description: 'Architecture and construction insights from Nairobi.',
    images: ['https://ashamconstruction.co.ke/og-blog.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// ─── TYPES ────────────────────────────────────────────────────
interface AuthorDetails {
  full_name: string | null
  role?: string | null
  avatar?: string | null
}

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  image_url: string | null
  category: string | null
  created_at: string
  author_details?: AuthorDetails | null
  views?: number
  tags?: string[] | null
  read_time?: number
  featured?: boolean
}

// ─── CONSTANTS ────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'All', slug: 'all', icon: TrendingUp },
  { name: 'Design Philosophy', slug: 'design-philosophy', icon: PenTool },
  { name: 'Sustainability', slug: 'sustainability', icon: Leaf },
  { name: 'Projects', slug: 'projects', icon: Building2 },
  { name: 'Industry Insights', slug: 'industry-insights', icon: HardHat },
]

// ─── HELPERS ──────────────────────────────────────────────────
const getReadTime = (content: string): number => {
  if (!content) return 1
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const categoryColors: Record<string, string> = {
  'Design Philosophy': 'bg-stone-100 text-stone-700 border-stone-200',
  'Sustainability': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Projects': 'bg-amber-50 text-amber-700 border-amber-200',
  'Industry Insights': 'bg-slate-100 text-slate-700 border-slate-200',
  'Studio Life': 'bg-rose-50 text-rose-700 border-rose-200',
}

// ─── STRUCTURED DATA ──────────────────────────────────────────
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'The Asham Journal',
  url: 'https://ashamconstruction.co.ke/blog',
  description:
    'Expert perspectives on architectural design, sustainable construction, and building excellence from Asham Design & Construction.',
  publisher: {
    '@type': 'Organization',
    name: 'Asham Design & Construction Ltd',
    logo: {
      '@type': 'ImageObject',
      url: 'https://ashamconstruction.co.ke/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://ashamconstruction.co.ke/blog',
  },
}

// ─── BREADCRUMB SCHEMA ────────────────────────────────────────
const breadcrumbData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://ashamconstruction.co.ke',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Journal',
      item: 'https://ashamconstruction.co.ke/blog',
    },
  ],
}

// ─── MAIN CONTENT COMPONENT ───────────────────────────────────
async function BlogContent() {
  const rawPosts = await client.fetch(`
    *[_type == "post"] | order(createdAt desc)[0...12]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "image_url": mainImage.asset->url,
      category,
      createdAt,
      content,
      tags,
      featured,
      "author_details": author->{
        full_name,
        role,
        "avatar": avatar.asset->url
      }
    }
  `)

  const safePosts: Post[] = (rawPosts || []).map((post: any) => ({
    id: post._id,
    ...post,
    created_at: post.createdAt,
    read_time: getReadTime(post.content),
  }))

  const featuredPost = safePosts.find((p) => p.featured) || safePosts[0]
  const remainingPosts = safePosts.filter((p) => p.id !== featuredPost?.id)

  return (
    <>
      {/* Structured Data */}
      <Script
        id="blog-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <main className="min-h-screen bg-white">
        {/* ─── HERO SECTION ───────────────────────────────────── */}
        <section className="relative bg-[#06392F] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C75B39] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 lg:py-32">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-white/60">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <ChevronRight size={14} />
                <li className="text-white/90">Journal</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <p className="text-sm font-medium tracking-widest uppercase text-[#C75B39] mb-4">
                Insights & Perspectives
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
                The Asham
                <br />
                <span className="text-white/90">Journal.</span>
              </h1>
              <p className="text-lg text-white/70 max-w-xl leading-relaxed">
                Curated perspectives on architectural philosophy, sustainable innovation, 
                and community-centered design from our Nairobi studio.
              </p>
            </div>
          </div>
        </section>

        {/* ─── CATEGORY FILTERS ───────────────────────────────── */}
        <section className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.slug}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:bg-gray-50 text-gray-600 hover:text-[#06392F]"
                  >
                    <Icon size={16} />
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-20 space-y-20">
          {/* ─── FEATURED POST ────────────────────────────────── */}
          {featuredPost && (
            <article className="group">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="block bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="grid lg:grid-cols-12 min-h-[500px] lg:min-h-[600px]">
                  {/* Image */}
                  <div className="lg:col-span-7 relative h-[300px] lg:h-auto overflow-hidden">
                    <Image
                      src={featuredPost.image_url || '/placeholder-blog.jpg'}
                      alt={featuredPost.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden" />
                    
                    {/* Category Badge */}
                    {featuredPost.category && (
                      <span className={`absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[featuredPost.category] || 'bg-white/90 text-gray-700'}`}>
                        {featuredPost.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-5 flex flex-col justify-center p-8 lg:p-12 space-y-6">
                    <div className="flex items-center gap-4 text-xs text-gray-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {formatDate(featuredPost.created_at)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {featuredPost.read_time} min read
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight group-hover:text-[#06392F] transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-gray-500 leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        {featuredPost.author_details?.avatar ? (
                          <Image
                            src={featuredPost.author_details.avatar}
                            alt={featuredPost.author_details.full_name || ''}
                            width={36}
                            height={36}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#06392F] flex items-center justify-center text-white text-xs font-bold">
                            {(featuredPost.author_details?.full_name?.[0] || 'A')}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {featuredPost.author_details?.full_name || 'Asham Studio'}
                          </p>
                          {featuredPost.author_details?.role && (
                            <p className="text-xs text-gray-400">{featuredPost.author_details.role}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Eye size={13} />
                        {featuredPost.views || 0}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-[#06392F] group-hover:gap-3 transition-all">
                      Read Article <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* ─── POSTS GRID ───────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-gray-900">Latest Stories</h2>
              <span className="text-sm text-gray-400">
                {remainingPosts.length} articles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingPosts.map((post, index) => (
                <article key={post.id} className="group flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="block">
                    {/* Thumbnail */}
                    <div className="aspect-[4/3] relative rounded-2xl overflow-hidden mb-5 bg-gray-100">
                      <Image
                        src={post.image_url || '/placeholder-blog.jpg'}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        loading={index < 3 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                      
                      {/* Category */}
                      {post.category && (
                        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${categoryColors[post.category] || 'bg-white/90 text-gray-700'}`}>
                          {post.category}
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(post.created_at)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.read_time} min
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#06392F] transition-colors leading-snug">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-2 mt-auto">
                      <div className="w-6 h-6 rounded-full bg-[#06392F] flex items-center justify-center text-white text-[10px] font-bold">
                        {(post.author_details?.full_name?.[0] || 'A')}
                      </div>
                      <span className="text-xs text-gray-400">
                        {post.author_details?.full_name || 'Asham Studio'}
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* ─── NEWSLETTER CTA ───────────────────────────────── */}
          <section className="relative bg-[#06392F] rounded-[2rem] lg:rounded-[3rem] overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C75B39] rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
            </div>
            
            <div className="relative px-8 py-16 lg:px-20 lg:py-24 text-center">
              <p className="text-sm font-medium tracking-widest uppercase text-[#C75B39] mb-4">
                Stay Informed
              </p>
              <h3 className="text-3xl lg:text-5xl font-black text-white mb-4">
                Build Knowledge.
                <br />
                <span className="text-white/80">Stay Connected.</span>
              </h3>
              <p className="text-white/60 max-w-md mx-auto mb-8">
                Join 500+ architects, developers, and homeowners receiving monthly insights on Kenyan construction and design.
              </p>
              <div className="max-w-sm mx-auto">
                <NewsletterForm />
              </div>
              <p className="text-xs text-white/30 mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

// ─── PAGE EXPORT ──────────────────────────────────────────────
export default async function BlogPage() {
  return (
    <ErrorBoundary fallback={<div className="p-20 text-center">Failed to load blog. Please refresh.</div>}>
      <Suspense fallback={<BlogSkeleton />}>
        <BlogContent />
      </Suspense>
    </ErrorBoundary>
  )
}