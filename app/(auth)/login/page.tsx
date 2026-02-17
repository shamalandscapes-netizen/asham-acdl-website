'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/supabase/client';
import {
  Loader2,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Updated Auto-redirect: Checks role before deciding where to send a logged-in user
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'super_admin' || profile?.role === 'admin') {
          router.replace('/admin');
        } else {
          router.replace(redirect || '/');
        }
      }
    };
    checkUser();
  }, [router, redirect, supabase]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Fetch role immediately after login
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        toast.success('Signed in successfully');

        // FORCE hard refresh using window.location.href 
        // This ensures cookies are sent correctly to the middleware
        if (redirect) {
          window.location.href = redirect;
        } else if (profile?.role === 'super_admin' || profile?.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    if (redirect) callbackUrl.searchParams.set('redirect', redirect);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (oauthError) {
      setError('Google sign-in failed.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white border shadow-2xl rounded-3xl">
      <div className="mb-8 text-center">
        <Image
          src="/assets/images/logos/Asset 2.png"
          alt="Asham Construction"
          width={140}
          height={70}
          className="object-contain mx-auto mb-4"
          priority
        />
        <h1 className="text-xl font-black tracking-tight uppercase text-[#06392F]">
          Secure Access
        </h1>
        {redirect?.includes('admin') && (
          <p className="mt-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest">
            Administrator Portal
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center justify-center w-full py-3 mb-6 text-sm font-bold transition-colors border rounded-xl hover:bg-gray-50 disabled:opacity-50 font-montserrat"
      >
        <Image 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google" 
          width={18} 
          height={18} 
          className="mr-3"
        />
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-4 tracking-widest text-gray-400 bg-white font-montserrat">or email login</span>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-5">
        <div>
          <label className="block mb-1 text-[10px] font-black uppercase text-gray-400 font-montserrat">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute text-gray-300 left-3 top-3.5" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full py-3.5 pl-10 border outline-none rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06392F]/5 transition-all font-montserrat"
              placeholder="noel@ashamconstruction.co.ke"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-[10px] font-black uppercase text-gray-400 font-montserrat">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute text-gray-300 left-3 top-3.5" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full py-3.5 pl-10 pr-10 border outline-none rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06392F]/5 transition-all font-montserrat"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 right-3 top-3.5 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#06392F] text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-[#0a4d40] transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="mx-auto animate-spin" /> : 'Sign In'}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-3 p-4 mt-6 text-xs font-bold text-red-600 border border-red-100 bg-red-50 rounded-xl">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="flex flex-col items-center gap-2 mt-8 font-montserrat">
        <Link href="/forgot-password" className="text-[10px] uppercase font-bold text-gray-400 hover:text-[#06392F]">
          Forgot your password?
        </Link>
        <p className="text-[10px] text-gray-300 uppercase">
          &copy; {new Date().getFullYear()} Asham Construction Ltd
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-[#f8fafc]">
      <Suspense fallback={<Loader2 className="animate-spin text-[#06392F]" size={32} />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}