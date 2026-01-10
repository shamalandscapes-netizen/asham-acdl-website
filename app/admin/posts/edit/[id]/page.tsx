'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/lib/supabase/storage';
import { toast } from 'react-hot-toast';
import { Upload, Loader2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

// Dynamically import the editor
const Editor = dynamic(() => import('@/components/admin/Editor'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-50 animate-pulse rounded-b-[2.5rem]" />
});

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');

  const router = useRouter();
  const supabase = createClient();

  // 1. Fetch existing post data
  useEffect(() => {
    async function fetchPost() {
      // FIX: Cast supabase as any to avoid 'never' type result
      const { data, error } = await (supabase as any)
        .from('posts')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        toast.error("Could not find that article");
        router.push('/admin/posts');
        return;
      }

      if (data) {
        setPost(data);
        setContent(data.content);
        setSlug(data.slug);
        setPreview(data.image_url);
      }
      setLoading(false);
    }
    fetchPost();
  }, [params.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Saving changes...');

    try {
      const formData = new FormData(e.currentTarget);
      let image_url = post.image_url;

      if (file) {
        image_url = await uploadImage(file, 'blog-images');
      }

      const updateData = {
        title: formData.get('title') as string,
        slug: slug,
        excerpt: formData.get('excerpt') as string,
        content: content,
        category: formData.get('category') as string,
        image_url: image_url,
        updated_at: new Date().toISOString()
      };

      // FIX: Cast supabase as any for the update operation
      const { error } = await (supabase as any)
        .from('posts')
        .update(updateData)
        .eq('id', params.id);

      if (error) throw error;

      toast.success("Article Updated!", { id: toastId });
      router.refresh();
      router.push('/admin/posts');
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
      <Loader2 className="mb-4 animate-spin" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest">Retrieving Blueprint...</p>
    </div>
  );

  return (
    // FIXED: Using explicit CSS property syntax to clear Tailwind build warnings
    <div className="max-w-6xl pb-20 space-y-10 [transition-duration:500ms] animate-in fade-in">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Link href="/admin/posts" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#06392F]">
            <ArrowLeft size={14} /> Back to Archive
          </Link>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#06392F]">Edit Story</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="bg-white border border-gray-100 shadow-xl rounded-[2.5rem] overflow-hidden">
            <input 
              name="title" 
              required 
              defaultValue={post.title}
              onChange={(e) => {
                const generatedSlug = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
                setSlug(generatedSlug);
              }}
              className="w-full px-8 py-10 text-3xl font-black italic uppercase tracking-tighter text-[#06392F] outline-none border-b border-gray-50" 
            />
            
            <Editor onChange={setContent} initialContent={post.content} />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-[2.5rem] space-y-8 sticky top-24">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#06392F]">Cover Image</label>
              <div className="relative overflow-hidden border-2 border-gray-100 border-dashed aspect-video rounded-3xl bg-gray-50 group">
                {preview && <img src={preview} alt="Preview" className="object-cover w-full h-full" />}
                <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/40 group-hover:opacity-100">
                  <Upload className="text-white" size={24} />
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</label>
                <select name="category" defaultValue={post.category} className="w-full p-4 text-[11px] font-black uppercase bg-gray-50 rounded-xl outline-none">
                  <option>Architecture</option>
                  <option>Sustainability</option>
                  <option>Design Trends</option>
                  <option>Nairobi Urban</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Slug</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} name="slug" className="w-full p-4 text-[11px] font-bold bg-gray-50 rounded-xl outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Excerpt</label>
                <textarea name="excerpt" defaultValue={post.excerpt} rows={3} className="w-full p-4 text-[11px] font-medium bg-gray-50 rounded-xl outline-none leading-relaxed" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving} 
              className="w-full py-5 bg-[#06392F] text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#C75B39] transition-all"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Update Journal</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}