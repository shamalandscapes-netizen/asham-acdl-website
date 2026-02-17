import { createClient } from '@/supabase/server';
import Link from 'next/link';
import { Edit, Plus, ExternalLink, Eye, EyeOff, BarChart3, Clock } from 'lucide-react';
import DeletePostButton from '@/components/admin/DeletePostButton';

// Helper to estimate reading time (standard 200 words per minute)
const getReadingTime = (content: string) => {
  const words = content?.split(/\s+/).length || 0;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

export default async function AdminPostsPage() {
  const supabase = await createClient();
  
  // ✅ Using 'as any' to bypass the missing table definition in TypeScript types
  const { data: posts } = await (supabase
    .from('posts' as any)
    .select('*')
    .order('created_at', { ascending: false }) as any);

  // Safely calculate total views
  const totalViews = posts?.reduce((acc: number, post: any) => acc + (post.views || 0), 0) || 0;

  return (
    <div className="space-y-8 duration-500 animate-in fade-in">
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[#06392F]">
            Journal Management
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Articles: {posts?.length || 0}
            </p>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Total Views: {totalViews.toLocaleString()}
            </p>
          </div>
        </header>
        <Link 
          href="/admin/posts/new" 
          className="flex items-center gap-2 bg-[#06392F] text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#C75B39] transition-all shadow-lg shadow-[#06392F]/20 active:scale-95"
        >
          <Plus size={14} /> New Entry
        </Link>
      </div>

      <div className="grid gap-4">
        {!posts || posts.length === 0 ? (
          <div className="py-20 text-center bg-white border border-dashed border-gray-200 rounded-[2rem]">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No posts found</p>
          </div>
        ) : (
          posts.map((post: any) => (
            <div 
              key={post.id} 
              className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border border-gray-100 shadow-sm rounded-3xl group hover:border-[#06392F]/20 hover:shadow-md transition-all gap-4"
            >
              <div className="flex items-center gap-6">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-20 h-20 overflow-hidden border border-gray-100 rounded-2xl bg-gray-50">
                  <img 
                    src={post.image_url || '/placeholder.jpg'} 
                    alt="" 
                    className="object-cover w-full h-full grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-sm font-black uppercase text-gray-900 group-hover:text-[#06392F] transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                      post.status === 'published' 
                        ? 'bg-green-50 text-green-600 border border-green-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {post.status === 'published' ? <Eye size={10} /> : <EyeOff size={10} />}
                      {post.status}
                    </span>
                  </div>
                  
                  {/* Stats Bar */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                      {post.category}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-[#06392F] uppercase tracking-widest">
                      <BarChart3 size={12} className="text-gray-400" />
                      {post.views || 0} <span className="font-bold text-gray-400">Views</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Clock size={12} />
                      {getReadingTime(post.content)}
                    </div>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                      {new Date(post.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center self-end gap-2 md:self-center">
                {post.status === 'published' && (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    target="_blank"
                    className="p-3 text-gray-400 transition-all bg-gray-50 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                    title="View Live"
                  >
                    <ExternalLink size={18} />
                  </Link>
                )}
                <Link 
                  href={`/admin/posts/edit/${post.id}`} 
                  className="p-3 text-gray-400 transition-all bg-gray-50 hover:text-[#06392F] hover:bg-[#06392F]/5 rounded-xl"
                  title="Edit Post"
                >
                  <Edit size={18} />
                </Link>
                <DeletePostButton postId={post.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}