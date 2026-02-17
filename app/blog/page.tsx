// app/blog/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { ArrowRight, Clock, Zap, Target, Heart, Globe, Compass, Ruler, Droplets, Sun } from 'lucide-react'
import NewsletterForm from '@/components/NewsletterForm'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import BlogSkeleton from '@/components/blog/BlogSkeleton'
import ErrorBoundary from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'The Asham Journal | Architectural Insights from Nairobi',
  description: 'Curated perspectives on architectural philosophy, sustainable innovation, and community-centered design from our Nairobi studio.',
  openGraph: {
    title: 'The Asham Journal',
    description: 'Exploring the intersection of tradition and innovation in East African architecture',
    images: ['/og-blog.jpg'],
  },
  keywords: ['architecture', 'sustainable design', 'Nairobi', 'Kenyan architecture', 'climate-resilient design'],
}

interface AuthorDetails {
  full_name: string | null
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
  status: 'published' | 'draft' | 'archived'
  author_id?: string | null
  author_details?: AuthorDetails | null
  views?: number
  read_time?: number
  tags?: string[] | null
}

const PILLARS = [
  { 
    icon: Target, 
    title: 'Purpose', 
    color: 'bg-[#06392F] text-white', 
    desc: 'Transforming lives through honest craftsmanship.',
    detail: 'Every structure tells a story of intentional design.'
  },
  { 
    icon: Heart, 
    title: 'Community', 
    color: 'bg-white border border-gray-100 text-gray-900', 
    desc: 'Building spaces that foster local connection.',
    detail: 'Architecture as a catalyst for human interaction.'
  },
  { 
    icon: Globe, 
    title: 'Innovation', 
    color: 'bg-[#C75B39] text-white', 
    desc: 'Pioneering climate-resilient architectural designs.',
    detail: 'Where tradition meets tomorrow\'s technology.'
  },
] as const

const CATEGORIES = [
  { name: 'All', icon: Compass },
  { name: 'Design Philosophy', icon: Ruler },
  { name: 'Sustainability', icon: Droplets },
  { name: 'Studio Life', icon: Sun },
]

const getReadTime = (content: string): number => {
  const wordsPerMinute = 200
  const wordCount = content?.split(/\s+/).length || 0
  return Math.ceil(wordCount / wordsPerMinute) || 1
}

async function BlogContent() {
  const supabase = await createSupabaseServerClient()

  const { data: rawPosts, error } = await supabase
    .from('posts')
    .select(`
      id, title, slug, excerpt, image_url, category, created_at, content, tags, status,
      author_details:profiles!posts_author_id_fkey ( full_name )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(12)

  if (error) throw new Error('Failed to fetch blog posts')

  const safePosts: Post[] = (rawPosts || []).map((post: any) => ({
    ...post,
    author_details: Array.isArray(post.author_details) ? post.author_details[0] : post.author_details
  }))

  const featuredPost = safePosts[0]
  const remainingPosts = safePosts.slice(1)

  return (
    <>
      <Script id="blog-structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "The Asham Journal",
          "url": "https://asham-architecture.com/blog",
          "blogPost": safePosts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "datePublished": post.created_at,
            "author": { "@type": "Person", "name": post.author_details?.full_name || "Asham Studio" }
          }))
        })}
      </Script>

      <main className="p-4 mx-auto mb-20 space-y-16 duration-700 lg:space-y-24 max-w-7xl lg:p-12 animate-in fade-in">
        <header className="flex flex-col items-start gap-6 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-[#06392F] uppercase tracking-[0.4em]">
              <span className="w-8 h-[1px] bg-[#06392F] animate-pulse" />
              <span>The Asham Journal</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-[#06392F] leading-[0.9]">
              Insights & <br /> <span className="text-[#C75B39]">Perspectives.</span>
            </h1>
          </div>
          <div className="max-w-xs"><p className="text-[10px] font-bold text-gray-400 uppercase">Curated updates from our Nairobi studio.</p></div>
        </header>

        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="group block bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden">
            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-7 h-[300px] lg:h-[500px] relative overflow-hidden">
                <Image src={featuredPost.image_url || '/placeholder-blog.jpg'} alt={featuredPost.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center p-8 space-y-6 lg:col-span-5 lg:p-16">
                <h2 className="text-3xl lg:text-5xl font-black tracking-tighter text-gray-900 group-hover:text-[#06392F]">{featuredPost.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-3">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-6 pt-6 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest text-[#06392F]">
                  <Clock size={14} /> {getReadTime(featuredPost.content)} min read
                </div>
              </div>
            </div>
          </Link>
        )}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div key={i} className={`p-8 rounded-[2rem] space-y-3 ${p.color} transition-all hover:scale-[1.02]`}>
              <p.icon size={24} />
              <h4 className="text-lg font-black tracking-tighter uppercase">{p.title}</h4>
              <p className="text-[10px] font-bold uppercase opacity-70">{p.desc}</p>
            </div>
          ))}
        </section>

        <nav className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ name, icon: Icon }) => (
            <div key={name} className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase border border-gray-200 rounded-full hover:border-[#C75B39] transition-all">
              <Icon size={12} /> {name}
            </div>
          ))}
        </nav>

        <div className="space-y-12">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 pb-4 border-b border-gray-100 flex items-center gap-2">
            <Zap size={14} className="text-[#C75B39]" /> The Archive
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {remainingPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block space-y-6 group">
                <div className="aspect-[4/5] relative rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100">
                  <Image src={post.image_url || '/placeholder-blog.jpg'} alt="" fill className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0" />
                </div>
                <h2 className="text-2xl font-black tracking-tighter group-hover:text-[#06392F]">{post.title}</h2>
              </Link>
            ))}
          </div>
        </div>

        <section className="bg-[#06392F] rounded-[3rem] p-10 lg:p-20 text-center text-white">
          <div className="max-w-xl mx-auto space-y-8">
            <h3 className="text-4xl lg:text-6xl font-black leading-[1] tracking-tighter">Stay <span className="text-[#C75B39]">Connected.</span></h3>
            <div className="max-w-sm mx-auto"><NewsletterForm /></div>
          </div>
        </section>
      </main>
    </>
  )
}

export default async function BlogPage() {
  return (
    <ErrorBoundary fallback={<BlogErrorFallback />}>
      <Suspense fallback={<BlogSkeleton />}>
        <BlogContent />
      </Suspense>
    </ErrorBoundary>
  )
}

function BlogErrorFallback() {
  return (
    <main className="p-4 mx-auto mb-20 max-w-7xl lg:p-12 min-h-[60vh] flex items-center justify-center">
      <div className="py-20 text-center border border-dashed border-[#C75B39]/20 rounded-[2rem] bg-white max-w-lg mx-auto">
        <p className="text-[10px] font-black tracking-[0.3em] text-[#C75B39] uppercase">Unable to load articles</p>
        <Link 
          href="/blog"
          className="inline-block mt-6 px-6 py-3 bg-[#06392F] text-white text-[10px] font-black uppercase tracking-widest rounded-full"
        >
          Try Again
        </Link>
      </div>
    </main>
  )
}