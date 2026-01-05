'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast'; // Replaced alert() with proper toast
import { 
  User, 
  Phone, 
  MapPin, 
  Save, 
  Loader2, 
  ArrowLeft,
  Mail
} from 'lucide-react';

export default function UserProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    id: '',
    full_name: '',
    email: '',
    phone: '',
    address: ''
  });

  // 1. Fetch User Data on Load
  useEffect(() => {
    let isMounted = true;

    async function getUser() {
      // Get auth user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Get profile data from public 'users' table
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (isMounted) {
        setFormData({
          id: user.id,
          // Fallback to Auth Metadata (Google/Apple name) if database profile is empty
          full_name: profile?.full_name || user.user_metadata?.full_name || '',
          email: user.email || '', // Always trust Auth email
          phone: profile?.phone || '',
          address: profile?.address || ''
        });
        setFetching(false);
      }
    }

    getUser();

    return () => { isMounted = false };
  }, [router, supabase]);

  // 2. Handle Update (Using UPSERT to handle both create and update)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .upsert({ // ✅ Changed from .update() to .upsert()
          id: formData.id,
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          email: formData.email, // Ensure email is synced to profile table
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;

      toast.success('Profile updated successfully!');
      router.refresh();
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#06392F]">
        <Loader2 className="w-8 h-8 mr-2 animate-spin" /> 
        <span className="font-medium">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl px-4 py-8 mx-auto">
      
      {/* Header & Back Button */}
      <div className="mb-6">
        <button 
          type="button" // Always specify type for buttons
          onClick={() => router.back()}
          className="flex items-center text-gray-500 hover:text-[#06392F] mb-4 transition-colors text-sm font-bold"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
        <p className="mt-1 text-gray-500">Manage your contact information and delivery address.</p>
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        
        {/* Banner */}
        <div className="bg-[#06392F] p-6 text-white flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold rounded-full bg-white/10 shrink-0">
            {formData.full_name?.charAt(0).toUpperCase() || <User />}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-lg font-bold truncate">
              {formData.full_name || 'Your Profile'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-green-100 truncate opacity-80">
               <Mail size={14} className="shrink-0" /> 
               <span className="truncate">{formData.email}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="p-6 space-y-6 md:p-8">
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="full_name" className="text-xs font-bold text-gray-500 uppercase">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute text-gray-400 -translate-y-1/2 pointer-events-none left-3 top-1/2" size={18} />
                <input 
                  id="full_name"
                  type="text" 
                  required
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06392F] focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute text-gray-400 -translate-y-1/2 pointer-events-none left-3 top-1/2" size={18} />
                <input 
                  id="phone"
                  type="tel" 
                  placeholder="0712 345 678"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06392F] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email (Read Only) */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase">
              Email Address (Read Only)
            </label>
            <div className="relative">
              <Mail className="absolute text-gray-400 -translate-y-1/2 pointer-events-none left-3 top-1/2" size={18} />
              <input 
                id="email"
                type="email" 
                disabled
                value={formData.email}
                className="w-full p-3 pl-10 text-gray-500 border border-gray-200 rounded-lg cursor-not-allowed bg-gray-50"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="address" className="text-xs font-bold text-gray-500 uppercase">
              Default Delivery Address
            </label>
            <div className="relative">
              <MapPin className="absolute text-gray-400 pointer-events-none left-3 top-3" size={18} />
              <textarea 
                id="address"
                rows={3}
                placeholder="e.g. Kakamega, near Masinde Muliro University..."
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06392F] focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
            <p className="text-xs text-gray-400">This address will be pre-filled during checkout.</p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#C75B39] text-white py-3 rounded-lg font-bold hover:bg-[#A64828] transition-all flex justify-center items-center gap-2 shadow-lg shadow-orange-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}