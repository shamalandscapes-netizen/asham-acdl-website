'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/supabase/client'; // Fix path
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Pointing to your callback handler first is safer for mobile deep-linking
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Identity verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-[#FBFBFB]">
      <div className="w-full max-w-[420px]">
        <div className="px-4 py-10 bg-white border border-gray-100 shadow-2xl sm:rounded-3xl sm:px-10">
          
          {/* HEADER */}
          <div className="mb-8 text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-12 mb-4">
              <Image 
                src="/assets/images/logos/Asset 2.png" 
                alt="Asham Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-xl font-black tracking-tighter text-gray-900 uppercase">Identity Recovery</h2>
            <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
              Security Override Protocol
            </p>
          </div>

          {!submitted ? (
            <>
              <p className="mb-8 text-sm font-medium leading-relaxed text-center text-gray-500">
                Enter your registered email to receive a secure recovery token.
              </p>

              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute w-5 h-5 text-gray-300 -translate-y-1/2 left-4 top-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#06392F] focus:bg-white outline-none transition-all font-medium text-sm"
                      placeholder="architect@asham.com"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 border border-red-50 rounded-2xl bg-red-50/50 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold leading-tight text-red-800">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full py-4 bg-[#06392F] text-white rounded-xl shadow-xl font-black uppercase text-xs tracking-widest active:scale-95 transition-transform flex items-center justify-center gap-2" 
                  isLoading={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Recovery'}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center animate-in fade-in zoom-in-95">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-50">
                <CheckCircle2 className="w-8 h-8 text-[#06392F]" />
              </div>
              <h2 className="mb-2 text-lg font-black tracking-tight text-gray-900 uppercase">Check Your Inbox</h2>
              <p className="mb-8 text-sm font-medium text-gray-500">
                A recovery token has been dispatched to <br />
                <span className="font-bold text-gray-900">{email}</span>
              </p>
            </div>
          )}

          <div className="pt-6 mt-8 border-t border-gray-50">
            <Link href="/login" className="flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#06392F] transition-colors">
              <ArrowLeft className="w-3 h-3 mr-2" />
              Return to Terminal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}