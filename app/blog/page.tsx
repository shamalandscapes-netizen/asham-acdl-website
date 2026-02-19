// app/blog/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { 
  ArrowRight, 
  Clock, 
  Zap, 
  Target, 
  Heart, 
  Globe, 
  Compass, 
  Ruler, 
  Droplets, 
  Sun,
  Leaf,
  Home,
  HardHat,
  Trees,
  Calendar,
  Eye
} from 'lucide-react'
import NewsletterForm from '@/components/NewsletterForm'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import BlogSkeleton from '@/components/blog/BlogSkeleton'
import ErrorBoundary from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'The Asham Journal | Architectural Insights from Nairobi',
  description: 'Curated perspectives on architectural philosophy, sustainable innovation, and community-centered design from our Nairobi studio. Featuring the Samuel Waswa Maisonette project in Mlolongo.',
  openGraph: {
    title: 'The Asham Journal',
    description: 'Exploring the intersection of tradition and innovation in East African architecture',
    images: ['/og-blog.jpg'],
  },
  keywords: ['architecture', 'sustainable design', 'Nairobi', 'Kenyan architecture', 'climate-resilient design', 'Mlolongo', 'Samuel Waswa'],
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
  { name: 'Projects', icon: Home },
  { name: 'Landscape', icon: Trees }
]

const getReadTime = (content: string): number => {
  const wordsPerMinute = 200
  const wordCount = content?.split(/\s+/).length || 0
  return Math.ceil(wordCount / wordsPerMinute) || 1
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
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
          "url": "https://ashamconstruction.co.ke/blog",
          "blogPost": safePosts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "datePublished": post.created_at,
            "author": { "@type": "Person", "name": post.author_details?.full_name || "Asham Studio" }
          }))
        })}
      </Script>

      <main className="p-4 mx-auto mb-20 space-y-16 duration-700 lg:space-y-24 max-w-7xl lg:p-12 animate-in fade-in">
        {/* Header with Samuel Waswa mention */}
        <header className="flex flex-col items-start gap-6 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-[#06392F] uppercase tracking-[0.4em]">
              <span className="w-8 h-[1px] bg-[#06392F] animate-pulse" />
              <span>The Asham Journal</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-[#06392F] leading-[0.9]">
              Insights & <br /> <span className="text-[#C75B39]">Perspectives.</span>
            </h1>
            <p className="max-w-xl text-sm text-gray-500">
              Featuring the <span className="font-black text-[#06392F]">Samuel Waswa Maisonette</span> — a meticulously designed residence in Mlolongo with comprehensive architectural documentation and integrated landscape design.
            </p>
          </div>
          <div className="max-w-xs">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Curated updates from our Nairobi & Kakamega studios.</p>
          </div>
        </header>

        {/* Featured Post - Could be Samuel Waswa article */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="group block bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden hover:shadow-3xl transition-shadow">
            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-7 h-[300px] lg:h-[500px] relative overflow-hidden">
                <Image 
                  src={featuredPost.image_url || '/placeholder-blog.jpg'} 
                  alt={featuredPost.title} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                <div className="absolute top-4 left-4 bg-[#C75B39]/90 text-white px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-sm">
                  Featured Story
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 space-y-6 lg:col-span-5 lg:p-16">
                <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Calendar size={12} /> {formatDate(featuredPost.created_at)}
                </div>
                <h2 className="text-3xl lg:text-5xl font-black tracking-tighter text-gray-900 group-hover:text-[#06392F] transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-3">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#06392F]">
                    <Clock size={14} /> {getReadTime(featuredPost.content)} min read
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <Eye size={14} /> {featuredPost.views || 0} views
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Philosophy Pillars */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div key={i} className={`p-8 rounded-[2rem] space-y-3 ${p.color} transition-all hover:scale-[1.02] hover:shadow-xl cursor-default group`}>
              <div className="transition-transform duration-300 transform group-hover:rotate-12">
                <p.icon size={24} />
              </div>
              <h4 className="text-lg font-black tracking-tighter uppercase">{p.title}</h4>
              <p className="text-[10px] font-bold uppercase opacity-70">{p.desc}</p>
              <p className="text-[8px] opacity-50 italic mt-2">{p.detail}</p>
            </div>
          ))}
        </section>

        {/* Categories */}
        <nav className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ name, icon: Icon }) => (
            <Link
              key={name}
              href={`/blog/category/${name.toLowerCase().replace(' ', '-')}`}
              className="group flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase border border-gray-200 rounded-full hover:border-[#C75B39] hover:text-[#C75B39] transition-all"
            >
              <Icon size={12} className="opacity-50 group-hover:opacity-100" />
              {name}
            </Link>
          ))}
        </nav>

        {/* Blog Posts Grid */}
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 pb-4 border-b border-gray-100 flex items-center gap-2">
              <Zap size={14} className="text-[#C75B39]" /> The Archive
            </h3>
            <span className="text-[10px] font-black text-gray-300">{safePosts.length} articles</span>
          </div>

          {remainingPosts.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-gray-200 rounded-[2rem]">
              <p className="text-[10px] font-black tracking-[0.3em] text-gray-300 uppercase">Curating new content...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {remainingPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block space-y-4 group">
                  <div className="aspect-[4/5] relative rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                    <Image 
                      src={post.image_url || '/placeholder-blog.jpg'} 
                      alt="" 
                      fill 
                      className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105" 
                    />
                    {post.category && (
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <div className="px-1 space-y-2">
                    <h2 className="text-xl font-black tracking-tighter group-hover:text-[#06392F] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-widest text-gray-300 pt-2">
                      <span>{post.author_details?.full_name || 'Asham Studio'}</span>
                      <span className="w-1 h-1 bg-gray-200 rounded-full" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        <section className="relative bg-[#06392F] rounded-[3rem] p-10 lg:p-20 text-center text-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C75B39]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C75B39]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-xl mx-auto space-y-8">
            <h3 className="text-4xl lg:text-6xl font-black leading-[1] tracking-tighter">
              Stay <br /><span className="text-[#C75B39] relative">
                Connected.
                <svg className="absolute left-0 w-full -bottom-2" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
                  <path d="M0,2 Q25,0 50,2 T100,2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </span>
            </h3>
            
            <div className="max-w-sm mx-auto">
              <NewsletterForm />
            </div>
            
            <div className="flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">
              <span>Quarterly Briefings</span>
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
              <span>Respecting your inbox</span>
            </div>
          </div>
        </section>

        {/* Back to top */}
        <div className="flex justify-center">
          <a 
            href="#main-content"
            className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-[#06392F] transition-colors"
          >
            <span className="w-4 h-[1px] bg-current"></span>
            Back to top
            <span className="w-4 h-[1px] bg-current"></span>
          </a>
        </div>
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
        <div className="space-y-4">
          <Compass size={48} className="mx-auto text-[#C75B39]/30" />
          <p className="text-[10px] font-black tracking-[0.3em] text-[#C75B39] uppercase">Unable to load articles</p>
          <p className="text-xs text-gray-500">Our journal is temporarily offline.</p>
          <Link 
            href="/blog"
            className="inline-block mt-4 px-6 py-3 bg-[#06392F] text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#0a4a3d] transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </main>
  )
}