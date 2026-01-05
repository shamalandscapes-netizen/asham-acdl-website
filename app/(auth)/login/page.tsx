'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Loader2, AlertCircle, Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button'; 

// --- Google Icon SVG Component ---
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get('redirect');
   
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback?redirect=${requestedRedirect || '/dashboard'}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to Google.');
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (!data.user) throw new Error('No user found');

      // 2. Fetch the role from the public.users table
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const role = profile?.role || '';
      const isAdmin = ['super_admin', 'admin', 'accounts', 'staff', 'it'].includes(role);

      // 3. PRIORITY REDIRECT LOGIC
      // window.location.href is used for admin to ensure a full session refresh
      if (isAdmin) {
        window.location.href = '/admin';
      } else if (requestedRedirect) {
        router.push(requestedRedirect);
        router.refresh();
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid login credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 py-8 bg-white border border-gray-100 shadow-xl sm:rounded-xl sm:px-10">
      
      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-center justify-center h-12 w-12 bg-[#06392F] rounded-xl text-white font-bold text-2xl shadow-lg mb-4">
          A
        </Link>
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Don't have an account? <Link href="/register" className="font-bold text-[#C75B39] hover:underline">Create one</Link>
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        type="button"
        disabled={loading}
        className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-gray-700 transition-all bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
      >
        <GoogleIcon />
        <span className="ml-3">Continue with Google</span>
      </button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 font-medium text-gray-400 uppercase bg-white">Or email login</span>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleLogin}>
        <div>
          <label className="block mb-1 text-sm font-bold text-gray-700">Email Address</label>
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06392F]"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-bold text-gray-700">Password</label>
            <Link 
              href="/forgot-password" 
              className="text-xs font-bold text-[#06392F] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06392F]"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 border border-red-100 rounded-lg bg-red-50">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm font-bold text-red-800">{error}</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full py-3 shadow-lg" 
          isLoading={loading} 
          rightIcon={!loading && <ArrowRight size={18} />}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#06392F]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}