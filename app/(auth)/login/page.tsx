'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  Loader2, 
  AlertCircle, 
  Mail, 
  Lock, 
  Phone, 
  MessageSquare, 
  Eye, 
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import Button from '@/components/ui/Button'; 
import toast from 'react-hot-toast'; // Ensure this is installed

interface UserProfile {
  is_active: boolean;
}

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
  const errorParam = searchParams.get('error');
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  /**
   * 1. IMPROVED: Personalized Role-based Redirection
   */
  const handleRoleRedirect = async (user: any) => {
    const rawRole = user?.app_metadata?.role || user?.user_metadata?.role || 'customer';
    const fullName = user?.user_metadata?.full_name || 'Team Member';
    const firstName = fullName.split(' ')[0];
    const userRole = String(rawRole).toLowerCase();
    
    const adminRoles = ['super_admin', 'admin', 'it_admin', 'accounts', 'employee'];
    const isElevated = adminRoles.includes(userRole);
    
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_active')
        .eq('id', user.id)
        .single<UserProfile>();

      if (profile && profile.is_active === false) {
        await supabase.auth.signOut();
        setError("Your account has been deactivated.");
        setLoading(false);
        return;
      }

      let destination = '';
      let welcomeMsg = '';

      if (isElevated) {
        if (userRole === 'super_admin') {
          destination = '/admin';
          welcomeMsg = `Welcome, Chief ${firstName}. Command Center Active.`;
        } else {
          destination = '/admin/payments';
          welcomeMsg = `Hello ${firstName}, Revenue Ledger access granted.`;
        }
      } else {
        destination = requestedRedirect || '/dashboard';
        welcomeMsg = `Welcome back, ${firstName}!`;
      }

      // Trigger Professional Greeting Toast
      toast.success(welcomeMsg, {
        duration: 4000,
        icon: isElevated ? '???' : '??',
        style: {
          background: '#06392F',
          color: '#fff',
          borderRadius: '1rem',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }
      });
      
      router.push(destination);
      setTimeout(() => router.refresh(), 150);
      
    } catch (err) {
      router.push(isElevated ? '/admin/payments' : '/dashboard');
    }
  };

  useEffect(() => {
    if (errorParam === 'auth-callback-failed') {
      setError('The security link has expired or is invalid.');
    } else if (errorParam === 'verification-failed') {
      setError('Could not verify identity. Please sign in again.');
    }
  }, [errorParam]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback?next=${requestedRedirect || '/dashboard'}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to Google.');
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (data.user) await handleRoleRedirect(data.user);
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isOtpSent) {
        const { error } = await supabase.auth.signInWithOtp({ phone: phoneNumber });
        if (error) throw error;
        setIsOtpSent(true);
        toast.success("Verification code sent to your phone.");
      } else {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: phoneNumber,
          token: otpCode,
          type: 'sms',
        });
        if (error) throw error;
        if (data.user) await handleRoleRedirect(data.user);
      }
    } catch (err: any) {
      setError(err?.message || 'Phone authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 py-8 bg-white border border-gray-100 shadow-2xl sm:rounded-2xl sm:px-10">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center justify-center h-14 w-14 bg-[#06392F] rounded-2xl text-white font-bold text-3xl shadow-xl mb-4 hover:scale-105 transition-transform">
          A
        </Link>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Access Portal</h2>
        <p className="mt-2 text-sm text-gray-500">
          New to Asham? <Link href="/register" className="font-bold text-[#C75B39] hover:underline">Create Account</Link>
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-gray-700 transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 disabled:opacity-50"
      >
        <GoogleIcon />
        <span className="ml-3">Continue with Google</span>
      </button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 font-bold tracking-widest text-gray-400 uppercase bg-white">Secure Options</span>
        </div>
      </div>

      <div className="flex p-1 mb-8 bg-gray-50 rounded-xl">
        <button
          type="button"
          onClick={() => { setAuthMethod('email'); setError(null); }}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === 'email' ? 'bg-white text-[#06392F] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => { setAuthMethod('phone'); setError(null); }}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === 'phone' ? 'bg-white text-[#06392F] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Phone SMS
        </button>
      </div>

      {authMethod === 'email' ? (
        <form className="space-y-5" onSubmit={handleEmailLogin}>
          <div>
            <label className="block mb-1.5 text-xs font-bold text-gray-700 uppercase">Email Address</label>
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase">Password</label>
              <Link href="/forgot-password" className={`text-xs font-bold text-[#06392F] hover:underline ${loading ? 'opacity-50 pointer-events-none' : ''}`}>Reset?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#06392F] outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full py-4 text-lg bg-[#06392F] text-white rounded-xl shadow-lg" isLoading={loading}>
            Sign In
          </Button>
        </form>
      ) : (
        <form className="space-y-5" onSubmit={handlePhoneLogin}>
          {!isOtpSent ? (
            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-700 uppercase">Phone Number</label>
              <div className="relative">
                <Phone className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#06392F] outline-none transition-all font-medium"
                  placeholder="+254 711 70XXXX"
                />
              </div>
            </div>
          ) : (
            <div className="duration-300 animate-in fade-in zoom-in">
              <div className="flex flex-col items-center mb-4">
                <div className="p-3 mb-2 rounded-full bg-green-50">
                  <CheckCircle2 className="w-6 h-6 text-[#06392F]" />
                </div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Enter 6-Digit Code</label>
              </div>
              <div className="relative">
                <MessageSquare className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 text-center tracking-[0.5em] text-2xl font-black border-2 border-gray-200 rounded-xl focus:border-[#06392F] outline-none"
                  placeholder="000000"
                />
              </div>
            </div>
          )}
          <Button type="submit" className="w-full py-4 text-lg bg-[#06392F] text-white rounded-xl shadow-lg" isLoading={loading}>
            {isOtpSent ? 'Verify & Continue' : 'Send SMS Code'}
          </Button>
        </form>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 mt-6 border border-red-50 rounded-xl bg-red-50/50">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-bold leading-tight text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-gray-50/30">
      <div className="w-full max-w-md">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-12 bg-white shadow-xl rounded-2xl">
            <Loader2 className="h-10 w-10 animate-spin text-[#06392F] mb-4" />
            <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Authenticating...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
