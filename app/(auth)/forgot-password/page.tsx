'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
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
        // This MUST match your Supabase Redirect URL and folder path
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md p-8 text-center bg-white border border-gray-100 shadow-2xl rounded-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-50">
            <CheckCircle className="w-8 h-8 text-[#06392F]" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Check your email</h2>
          <p className="mb-8 text-gray-600">
            We've sent a password reset link to <br /><span className="font-bold text-gray-900">{email}</span>
          </p>
          <Link href="/login" className="text-sm font-bold text-[#06392F] hover:underline">
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-2xl rounded-2xl">
        <Link href="/login" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#06392F] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>
        
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900">Forgot Password?</h2>
        <p className="mb-8 text-sm font-medium text-gray-500">
          Enter your email and we'll send a link to reset your password.
        </p>

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block mb-2 text-xs font-bold tracking-wider text-gray-700 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#06392F] outline-none transition-all"
                placeholder="architect@asham.com"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 border border-red-50 rounded-xl bg-red-50/50">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm font-bold leading-tight text-red-800">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full py-4 bg-[#06392F] text-white rounded-xl shadow-lg" isLoading={loading}>
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
}