import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Eye, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import ViewTracker from '@/components/blog/ViewTracker';
import ShareButton from '@/components/blog/ShareButton';

// Helper to calculate reading time based on word count
const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const noHtml = content.replace(/<[^>]*>?/gm, ''); 
  const words = noHtml.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export default async function PostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  
  // 1. FETCH CURRENT POST
  const { data: post } = await (supabase
    .from('posts' as any)
    .select('*')
    .eq('slug', params.slug)
    .single() as any);

  if (!post || post.status === 'draft') notFound();

  // 2. FETCH RELATED POSTS (Same category, excluding current)
  const { data: relatedPosts } = await (supabase
    .from('posts' as any)
    .select('id, title, slug, image_url, category, created_at')
    .eq('category', post.category)
    .neq('id', post.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3) as any);

  const readingTime = calculateReadingTime(post.content || '');
  const waMessage = encodeURIComponent(
    `Hi Asham ACDL, I just read your article "${post.title}" and I'd like to discuss a project.`
  );

  return (
    <article className="relative min-h-screen bg-white">
      <ViewTracker postId={post.id} />

      {/* STICKY NAVIGATION */}
      <nav className="sticky top-0 z-50 w-full px-6 py-4 border-b bg-white/90 backdrop-blur-md border-gray-50">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <Link 
            href="/blog" 
            className="group flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-[#06392F]"
          >
            <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" /> 
            Back to Journal
          </Link>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                <Eye size={12} /> {post.views || 0} Reads
             </div>
             <ShareButton title={post.title} />
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative w-full bg-[#06392F] pt-12 lg:pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid items-center grid-cols-1 gap-12 mx-auto max-w-7xl lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <span className="bg-[#C75B39] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                 {post.category}
               </span>
               <span className="text-white/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                 <Clock size={12} /> {readingTime} Min Read
               </span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl italic font-black leading-[0.95] tracking-tighter uppercase text-white animate-in slide-in-from-bottom-4 duration-700">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 py-6 border-t border-white/10">
              <div className="flex items-center justify-center w-10 h-10 text-xs font-black text-white uppercase border rounded-full bg-white/10 border-white/20">
                {post.author?.substring(0, 2) || 'AC'}
              </div>
              <div>
                <p className="text-white font-black text-[10px] uppercase tracking-widest">{post.author || 'Asham ACDL'}</p>
                <p className="text-white/40 font-bold text-[9px] uppercase tracking-widest">
                  Published {new Date(post.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl">
             <img 
               src={post.image_url || '/placeholder-blog.jpg'} 
               alt={post.title}
               className="w-full h-full object-cover transition-transform duration-[3000] hover:scale-105"
             />
          </div>
        </div>
      </header>

      {/* CONTENT & SIDEBAR */}
      <section className="relative z-20 px-6 pb-24 mx-auto -mt-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 lg:gap-20">
          
          {/* Main Article Body */}
          <div className="bg-white p-8 lg:p-16 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50">
            <div 
              className="prose prose-stone lg:prose-xl max-w-none
                prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-[#06392F]
                prose-headings:mt-12 prose-headings:mb-6
                prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:text-lg prose-p:mb-8
                prose-blockquote:border-l-8 prose-blockquote:border-[#C75B39] prose-blockquote:bg-gray-50 prose-blockquote:py-6 prose-blockquote:px-10 prose-blockquote:rounded-r-3xl prose-blockquote:not-italic
                prose-ul:list-disc prose-ol:list-decimal
                prose-img:rounded-[2rem] prose-img:shadow-2xl prose-img:my-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Sticky Sidebar */}
          <aside className="space-y-6">
            <div className="sticky space-y-6 top-28">
              <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#06392F]">Engagement</h4>
                <p className="text-[11px] font-bold text-gray-400 uppercase leading-relaxed tracking-tight">
                  Inspired by this piece? Start a conversation with our architects today.
                </p>
                <a 
                  href={`https://wa.me/2547XXXXXXXX?text=${waMessage}`}
                  target="_blank"
                  className="flex items-center justify-center w-full gap-3 p-5 text-[10px] font-black uppercase tracking-widest bg-[#25D366] text-white rounded-2xl hover:scale-[1.02] transition-all shadow-lg shadow-green-100"
                >
                  <MessageCircle size={18} /> WhatsApp Inquiry
                </a>
              </div>

              <div className="p-8 bg-[#06392F] rounded-[2.5rem] text-white space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C75B39]">ACDL Standard</h4>
                 <div className="space-y-3">
                    {['Tailored Blueprints', 'Material Transparency', 'Project Oversight'].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-80">
                        <CheckCircle2 size={14} className="text-[#C75B39]" /> {item}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* RELATED POSTS SECTION */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="px-6 py-24 mx-auto border-t max-w-7xl border-gray-50">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39]">Related</h4>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#06392F]">Further Reading</h3>
            </div>
            <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#06392F] transition-colors">
              View All Archive →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {relatedPosts.map((related: any) => (
              <Link key={related.id} href={`/blog/${related.slug}`} className="space-y-4 group">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-gray-100">
                  <img 
                    src={related.image_url || '/placeholder-blog.jpg'} 
                    alt={related.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-[#06392F] text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {related.category}
                    </span>
                  </div>
                </div>
                <div className="px-2 space-y-2">
                  <h4 className="text-xl font-black italic uppercase tracking-tighter text-[#06392F] leading-tight group-hover:text-[#C75B39] transition-colors">
                    {related.title}
                  </h4>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(related.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER CALL TO ACTION */}
      <footer className="px-6 pb-20">
        <div className="max-w-7xl mx-auto p-12 lg:p-24 bg-[#F8F9FA] rounded-[4rem] text-center space-y-8 border border-gray-100 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h4 className="text-4xl italic font-black tracking-tighter uppercase lg:text-6xl text-[#06392F]">
              Build Your <span className="text-[#C75B39]">Greatness.</span>
            </h4>
            <p className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase max-w-lg mx-auto leading-loose">
              Transform your vision into a structural legacy with our modern design approach.
            </p>
            <div className="pt-4">
              <Link 
                href="/products" 
                className="inline-block px-12 py-6 bg-[#06392F] text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#C75B39] transition-all shadow-2xl"
              >
                Explore The Catalog
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}