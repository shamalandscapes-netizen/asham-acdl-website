'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { Lock, AlertCircle, ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      setSuccess(true);
      // Auto redirect to login after success
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gray-50/50 p-4">
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-2xl rounded-2xl">
        {success ? (
          <div className="text-center duration-300 animate-in fade-in zoom-in">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-green-50">
              <ShieldCheck className="w-10 h-10 text-[#06392F]" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Password Updated!</h2>
            <p className="mb-8 font-medium text-gray-600">
              Your security is updated. Redirecting you to login...
            </p>
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#06392F]" />
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900">Set New Password</h2>
            <p className="mb-8 text-sm font-medium text-gray-500">
              Please choose a strong password for your Asham ACDL account.
            </p>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
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

              <div>
                <label className="block mb-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#06392F] outline-none transition-all"
                    placeholder="••••••••"
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
                Update Password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
