// components/NewsletterForm.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import { toast } from 'react-hot-toast';
import { Send, CheckCircle, AlertCircle, Mail, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers' as any)
        .insert([{ email, subscribed_at: new Date().toISOString() }] as any);

      if (error) {
        if ((error as any).code === '23505') {
          toast.error("You're already subscribed to our updates.");
          setEmail('');
        } else {
          throw error;
        }
      } else {
        setSuccess(true);
        toast.success("Welcome to the Asham Journal.");
        setEmail('');
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      toast.error(err.message || "Unable to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <motion.div 
        className="relative"
        animate={{ 
          scale: focused ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Input Container */}
        <div className={`
          relative flex items-center w-full 
          bg-white/5 backdrop-blur-md
          border-2 rounded-2xl
          transition-all duration-300
          ${focused 
            ? 'border-[#C75B39] bg-white/10 shadow-lg shadow-[#C75B39]/10' 
            : 'border-white/20 hover:border-white/40'
          }
          ${success ? 'border-green-500/50 bg-green-500/5' : ''}
        `}>
          
          {/* Mail Icon */}
          <div className={`
            pl-5 pr-3 transition-colors duration-300
            ${focused ? 'text-[#C75B39]' : 'text-white/40'}
            ${success ? 'text-green-500' : ''}
          `}>
            <Mail className="w-5 h-5" />
          </div>

          {/* Email Input */}
          <input
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={loading || success}
            className="flex-1 py-4 pr-4 text-sm font-medium text-white bg-transparent  placeholder:text-white/30 focus:outline-none disabled:cursor-not-allowed"
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || success || !email}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative mr-2 px-6 py-3 rounded-xl
              font-bold text-xs uppercase tracking-[0.2em]
              transition-all duration-300
              flex items-center gap-2
              ${success 
                ? 'bg-green-500 text-white cursor-default' 
                : 'bg-[#C75B39] text-white hover:bg-[#d96c4a] hover:shadow-lg hover:shadow-[#C75B39]/30'
              }
              ${loading ? 'opacity-80 cursor-wait' : ''}
              ${!email ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Subscribed</span>
                </motion.div>
              ) : loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                  <span>Joining</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Helper Text */}
        <motion.p 
          className="mt-3 text-[11px] font-medium text-white/40 text-center"
          animate={{ opacity: focused ? 1 : 0.6 }}
        >
          Join 2,000+ professionals receiving monthly insights on architecture and construction.
        </motion.p>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#C75B39]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#06392F]/10 rounded-full blur-3xl pointer-events-none" />
    </form>
  );
}