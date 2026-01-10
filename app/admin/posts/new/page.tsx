'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/lib/supabase/storage';
import { toast } from 'react-hot-toast';
import { Upload, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Dynamically import the editor to prevent SSR "useContext" errors
const TiptapEditor = dynamic(() => import('@/components/admin/TiptapEditor'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-50 animate-pulse rounded-b-[2.5rem]" />
});

export default function NewPostPage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState(''); 
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    setSlug(generatedSlug);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return toast.error("Please upload a featured image");
    if (!content || content === '<p></p>') return toast.error("Content cannot be empty");
    
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const image_url = await uploadImage(file, 'blog-images');

      const postData = {
        title: formData.get('title') as string,
        slug: slug || (formData.get('slug') as string),
        excerpt: formData.get('excerpt') as string,
        content: content, 
        category: formData.get('category') as string,
        image_url: image_url,
        status: 'published',
        created_at: new Date().toISOString()
      };

      // FIX: Cast supabase as any to bypass 'never' type restriction
      const { error } = await (supabase as any)
        .from('posts')
        .insert([postData]);

      if (error) throw error;

      toast.success("Article Published!");
      router.push('/admin/posts');
      router.refresh();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl pb-20 space-y-10 duration-500 animate-in fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Link href="/admin/posts" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#06392F] transition-colors">
            <ArrowLeft size={14} /> Journal Archive
          </Link>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#06392F]">Craft Content</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden">
            <input 
              name="title" 
              required 
              onChange={handleTitleChange}
              placeholder="Post Headline..."
              className="w-full px-8 py-10 text-3xl font-black italic uppercase tracking-tighter text-[#06392F] placeholder:text-gray-200 border-b border-gray-50 outline-none" 
            />
            <TiptapEditor onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-[2.5rem] space-y-8 sticky top-24">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#06392F]">Cover Image</label>
              <div className="relative flex items-center justify-center overflow-hidden transition-all border-2 border-gray-100 border-dashed aspect-video rounded-3xl bg-gray-50 hover:bg-gray-100 group">
                {preview ? (
                  <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 text-gray-300" size={24} />
                    <p className="text-[8px] font-black uppercase text-gray-400">Add Visual</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</label>
                <select name="category" className="w-full p-4 text-[11px] font-black uppercase bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#06392F]/5">
                  <option>Architecture</option>
                  <option>Sustainability</option>
                  <option>Design Trends</option>
                  <option>Nairobi Urban</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Slug</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} name="slug" className="w-full p-4 text-[11px] font-bold bg-gray-50 rounded-xl outline-none" placeholder="url-slug-here" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Excerpt</label>
                <textarea name="excerpt" rows={3} className="w-full p-4 text-[11px] font-medium bg-gray-50 rounded-xl outline-none leading-relaxed" placeholder="Summarize the story..." />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-5 bg-[#06392F] text-white rounded-2xl font-black uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-[#06392F]/20 hover:bg-[#C75B39] transition-all"
            >
              {loading ? <Loader2 className="mx-auto animate-spin" size={20} /> : "Publish to Journal"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}