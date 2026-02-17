import { createClient } from '@/supabase/server';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function BlogPreview() {
  const supabase = await createClient();
  
  // ✅ Using 'as any' to bypass the missing 'posts' table type error
  const { data: latestPosts } = await (supabase
    .from('posts' as any)
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3) as any);

  if (!latestPosts || latestPosts.length === 0) return null;

  return (
    <section className="px-6 py-24 bg-white lg:px-12">
      <div className="mx-auto space-y-12 max-w-7xl">
        
        <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-[#06392F] uppercase tracking-[0.4em]">
              <span className="w-8 h-[1px] bg-[#06392F]"></span>
              The Journal
            </div>
            <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase text-[#06392F] leading-none">
              Insights & <br /> Innovations
            </h2>
          </div>
          <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-[#06392F] pb-1 hover:opacity-60 transition-opacity">
            View All Articles
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {latestPosts.map((post: any) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="space-y-6 group">
              <div className="aspect-[16/10] rounded-[2rem] overflow-hidden bg-gray-100 relative shadow-sm border border-gray-50">
                <img 
                  src={post.image_url || '/placeholder-blog.jpg'} 
                  alt={post.title || 'Journal entry'}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 transition-opacity opacity-0 bg-black/20 group-hover:opacity-100" />
              </div>
              <div className="px-2 space-y-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {post.category} • {new Date(post.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </span>
                <h3 className="text-xl font-black uppercase italic tracking-tighter leading-tight group-hover:text-[#06392F] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#06392F] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Read More <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}