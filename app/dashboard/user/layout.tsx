'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { 
  Lock, Bell, ShieldCheck, ShieldAlert, Loader2, 
  Smartphone, Monitor, LogOut, Mail, Trash2, Key
} from 'lucide-react';

export default function EnhancedSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState({ milestones: true, marketing: false });

  useEffect(() => {
    async function getSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setEmail(user.email);
    }
    getSession();
  }, [supabase]);

  const handlePasswordReset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/user/settings`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`ENCRYPTED LINK DISPATCHED TO ${email.substring(0, 3)}***@***.com`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Institutional Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#06392F] rounded-2xl">
            <ShieldCheck className="text-[#C75B39]" size={24} />
          </div>
          <h1 className="text-5xl font-black text-[#06392F] tracking-tighter uppercase leading-none">Security Core</h1>
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Secure Access Management & Encryption Protocols</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Account Protection */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Credential Card */}
          <section className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-2xl shadow-gray-200/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Key size={80} className="text-[#06392F]" />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-black text-[#06392F] uppercase tracking-widest">Authentication Factor</h3>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[8px] font-black uppercase tracking-tighter border border-green-100">Active Session</span>
              </div>

              <div className="p-6 bg-gray-50 rounded-3xl flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Registered Email</p>
                    <p className="text-sm font-bold text-[#06392F]">{email || 'Retrieving...'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                  <ShieldAlert className="text-[#C75B39] shrink-0" size={18} />
                  <p className="text-[10px] text-orange-800 font-medium leading-relaxed">
                    Initiating a password reset will invalidate temporary tokens. Ensure your email access is secured with 2FA.
                  </p>
                </div>

                <button 
                  onClick={handlePasswordReset}
                  disabled={loading}
                  className="w-full py-6 bg-[#06392F] text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-50"
                  aria-label="Authorize password reset protocol"
                  title="Authorize password reset protocol"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                  Authorize Reset Protocol
                </button>
              </div>
            </div>
          </section>

          {/* Activity Log (UX/Security best practice) */}
          <section className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-xl shadow-gray-200/20 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-black text-[#06392F] uppercase tracking-widest">Access Nodes</h3>
               <Smartphone className="text-gray-300" size={18} />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                   <Monitor className="text-[#06392F]" size={18} />
                   <div>
                     <p className="text-[10px] font-black text-[#06392F] uppercase">Current Device</p>
                     <p className="text-[9px] text-gray-400 uppercase tracking-widest">Chrome on Windows • Kenya</p>
                   </div>
                </div>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Preferences & Danger Zone */}
        <div className="space-y-8">
          {/* Preferences */}
          <section className="bg-white border border-gray-100 rounded-[3rem] p-8 shadow-xl space-y-8">
             <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                <Bell className="text-[#C75B39]" size={18} />
                <h3 className="text-xs font-black text-[#06392F] uppercase tracking-widest">Alerts</h3>
             </div>

             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <p className="text-[9px] font-black text-[#06392F] uppercase tracking-wider">Milestone Pings</p>
                 <button 
                  onClick={() => setNotifications({...notifications, milestones: !notifications.milestones})}
                  className={`w-10 h-5 rounded-full transition-all flex items-center px-1 ${notifications.milestones ? 'bg-[#06392F]' : 'bg-gray-200'}`}
                  aria-label={`Milestone notifications ${notifications.milestones ? 'enabled' : 'disabled'}`}
                  title={`Toggle milestone notifications`}
                 >
                   <div className={`w-3 h-3 bg-white rounded-full transition-transform ${notifications.milestones ? 'translate-x-5' : 'translate-x-0'}`} />
                 </button>
               </div>
             </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-50/30 border border-red-100 rounded-[3rem] p-8 space-y-6">
             <div className="flex items-center gap-4">
                <Trash2 className="text-red-600" size={18} />
                <h3 className="text-xs font-black text-red-900 uppercase tracking-widest">Danger Zone</h3>
             </div>
             <p className="text-[9px] text-red-700 font-bold uppercase tracking-tight leading-normal">
               Permanently purge your identity and asset records from the Asham repository.
             </p>
             <button 
               className="w-full py-4 border-2 border-red-200 text-red-600 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
               aria-label="Deactivate account permanently"
               title="Deactivate account permanently"
             >
               Deactivate Account
             </button>
          </section>
        </div>
      </div>
    </div>
  );
}