'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import { toast } from 'react-hot-toast';
import { Send } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Added 'as any' to the .insert() call to bypass strict schema checking
      const { error } = await supabase
        .from('newsletter_subscribers' as any)
        .insert([{ email }] as any);

      if (error) {
        // Handle duplicate email error (Postgres error code 23505)
        if ((error as any).code === '23505') {
          toast.error("You're already on the list!");
        } else {
          throw error;
        }
      } else {
        toast.success("Welcome to the Journal!");
        setEmail('');
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm mx-auto group">
      <input
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="
          w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 
          text-[11px] font-bold tracking-widest focus:outline-none focus:border-white/50 
          transition-all placeholder:text-white/30 text-white backdrop-blur-sm
        "
      />
      <button
        type="submit"
        disabled={loading}
        className="
          absolute right-1.5 top-1.5 bottom-1.5 px-4 
          bg-[#C75B39] text-white rounded-lg transition-all 
          hover:bg-[#d96c4a] active:scale-95 disabled:opacity-50 
          flex items-center justify-center shadow-lg
        "
      >
        {loading ? (
          <div className="w-3 h-3 border-2 rounded-full border-white/30 border-t-white animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Join</span>
            <Send size={12} />
          </div>
        )}
      </button>
    </form>
  );
}