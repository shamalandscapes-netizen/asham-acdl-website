'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { 
  User, Phone, MapPin, Save, Loader2, ArrowLeft, Mail, ShieldCheck, Camera 
} from 'lucide-react';

export default function UserProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    avatar_url: ''
  });

  useEffect(() => {
    let isMounted = true;
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Updated table name to user_profiles
      const { data: profile } = await supabase
        .from('user_profiles' as any)
        .select('*')
        .eq('id', user.id)
        .single();

      if (isMounted) {
        const p = profile as any;
        setFormData({
          id: user.id,
          full_name: p?.full_name || user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: p?.phone || '',
          address: p?.address || '',
          avatar_url: p?.avatar_url || user.user_metadata?.avatar_url || ''
        });
        setFetching(false);
      }
    }
    getUser();
    return () => { isMounted = false };
  }, [router, supabase]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${formData.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success('PHOTO UPLOADED');
    } catch (error: any) {
      toast.error('UPLOAD FAILED');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_profiles' as any) // Updated table name
        .upsert({
          id: formData.id,
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          email: formData.email,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('IDENTITY UPDATED');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'UPDATE FAILED');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="animate-spin text-[#06392F]" size={40} />
      <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Verifying Identity...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 duration-700 animate-in fade-in">
      <div className="flex flex-col items-start justify-between gap-6 pb-10 border-b border-gray-100 md:flex-row md:items-end">
        <div>
          <button 
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#C75B39] mb-4 transition-all"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-5xl font-black text-[#06392F] tracking-tighter uppercase leading-none">Profile Settings</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-4 flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#C75B39]" /> Secure Personal Repository
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[3.5rem] p-10 shadow-2xl shadow-gray-200/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#06392F]" />
        
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center justify-center mt-6 mb-10 space-y-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-gray-50 shadow-xl bg-gray-100 flex items-center justify-center">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <User size={48} className="text-gray-300" />
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2.5rem]">
                  <Loader2 className="text-white animate-spin" size={24} />
                </div>
              )}
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-3 bg-[#C75B39] text-white rounded-2xl shadow-lg hover:scale-110 transition-transform"
              aria-label="Change profile picture"
            >
              <Camera size={18} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="space-y-3">
              <label htmlFor="full_name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Legal Full Name</label>
              <input id="full_name" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-6 py-5 bg-gray-50 border-none rounded-3xl font-bold text-[#06392F] focus:ring-2 focus:ring-[#06392F] transition-all" />
            </div>

            <div className="space-y-3">
              <label htmlFor="phone" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Primary Contact</label>
              <input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-5 bg-gray-50 border-none rounded-3xl font-bold text-[#06392F] focus:ring-2 focus:ring-[#06392F] transition-all" />
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="address" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Verified Delivery Address</label>
            <textarea id="address" rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-6 py-5 bg-gray-50 border-none rounded-3xl font-bold text-[#06392F] focus:ring-2 focus:ring-[#06392F] transition-all resize-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-6 bg-[#06392F] text-white rounded-3xl font-black uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all flex justify-center items-center gap-3">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? 'Synchronizing...' : 'Sync Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}