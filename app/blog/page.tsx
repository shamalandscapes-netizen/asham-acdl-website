import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowRight, Clock, Zap, Target, Heart, Globe } from 'lucide-react';
import NewsletterForm from '@/components/NewsletterForm';

// 1. Define the Post interface to fix "Property does not exist on type never"
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  category: string;
  created_at: string;
  status: string;
}

export default async function BlogPage() {
  const supabase = await createClient();
  
  // Fetch only published posts
  // The 'as any' cast here bypasses the missing database types file until it is generated
  const { data: posts } = await (supabase
    .from('posts')
    .select('*')
    .eq('status', 'published') 
    .order('created_at', { ascending: false }) as any);

  const safePosts: Post[] = posts || [];
  const featuredPost = safePosts[0];
  const remainingPosts = safePosts.slice(1);

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const noOfWords = content ? content.split(/\s/g).length : 0;
    const minutes = Math.ceil(noOfWords / wordsPerMinute);
    return minutes < 1 ? 1 : minutes;
  };

  return (
    <main className="p-4 mx-auto mb-20 space-y-16 duration-700 lg:space-y-24 max-w-7xl lg:p-12 animate-in fade-in">
      
      {/* 1. REFINED HEADER */}
      <header className="flex flex-col items-start gap-6 pt-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-[#06392F] uppercase tracking-[0.4em]">
            <span className="w-8 h-[1px] bg-[#06392F]"></span>
            The Asham Journal
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-[#06392F] leading-[0.9]">
            Insights & <br /> <span className="text-[#C75B39]">Perspectives.</span>
          </h1>
        </div>
        <div className="max-w-xs pb-1">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase leading-relaxed">
            Curated updates on architectural philosophy and sustainable innovation from our Nairobi studio.
          </p>
        </div>
      </header>

      {/* 2. FEATURED HERO */}
      {featuredPost && (
        <section className="relative group">
          <Link href={`/blog/${featuredPost.slug}`} className="grid items-stretch grid-cols-1 overflow-hidden lg:grid-cols-12 bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] lg:rounded-[3.5rem]">
            <div className="lg:col-span-7 h-[300px] lg:h-[500px] overflow-hidden">
              <img 
                src={featuredPost.image_url || '/placeholder-blog.jpg'}
                alt={featuredPost.title} 
    
                className="object-cover w-full h-full transition-all transition-duration-[1500ms] ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 space-y-6 lg:col-span-5 lg:p-16">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C75B39]">Featured Story</span>
                <h2 className="text-3xl lg:text-5xl font-black leading-[1.1] tracking-tighter text-gray-900 group-hover:text-[#06392F] transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-sm font-medium leading-relaxed text-gray-500 lg:text-base line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>
              <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#06392F]">
                  <Clock size={14} /> {getReadTime(featuredPost.content)} min read
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-900 group-hover:translate-x-2 transition-transform">
                  Read More <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* 3. BENTO PILLARS */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { icon: <Target className="text-[#C75B39]" />, title: "Purpose", color: "bg-[#06392F] text-white", desc: "Transforming lives through honest craftsmanship." },
          { icon: <Heart className="text-[#06392F]" />, title: "Community", color: "bg-white border border-gray-100 text-gray-900", desc: "Building spaces that foster local connection." },
          { icon: <Globe className="text-white" />, title: "Innovation", color: "bg-[#C75B39] text-white", desc: "Pioneering climate-resilient architectural designs." }
        ].map((pillar, i) => (
          <div key={i} className={`p-8 rounded-[2rem] space-y-3 ${pillar.color}`}>
            {pillar.icon}
            <h4 className="text-lg font-black tracking-tighter uppercase">{pillar.title}</h4>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 leading-relaxed">{pillar.desc}</p>
          </div>
        ))}
      </section>

      {/* 4. THE ARCHIVE GRID */}
      <div className="space-y-12">
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 pb-4 border-b border-gray-100 flex items-center gap-2">
          <Zap size={14} className="text-[#C75B39]" /> The Archive
        </h3>

        {safePosts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gray-200 rounded-[2rem]">
            <p className="text-[10px] font-black tracking-[0.3em] text-gray-300 uppercase">Curating new content...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {remainingPosts.map((post: Post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block space-y-6 group">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                  <img 
                    src={post.image_url || '/placeholder-blog.jpg'} 
                    alt={post.title} 
                    className="object-cover w-full h-full transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-[8px] font-black uppercase tracking-widest text-[#06392F] rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="px-1 space-y-3">
                  <h2 className="text-2xl font-black leading-[1.2] tracking-tighter text-gray-900 group-hover:text-[#06392F] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gray-300 pt-2">
                     <span>{new Date(post.created_at).toLocaleDateString('en-GB')}</span>
                     <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                     <span>{getReadTime(post.content)} Min Read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 5. NEWSLETTER CTA */}
      <section className="bg-[#06392F] rounded-[3rem] p-10 lg:p-20 text-center text-white relative overflow-hidden shadow-xl shadow-[#06392F]/20">
        <div className="relative z-10 max-w-xl mx-auto space-y-8">
          <h3 className="text-4xl lg:text-6xl font-black leading-[1] tracking-tighter">
            Stay <br /> <span className="text-[#C75B39]">Connected.</span>
          </h3>
          <div className="max-w-sm mx-auto">
            <NewsletterForm />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">Quarterly Briefings • Respecting your inbox</p>
        </div>
      </section>
    </main>
  );
}
