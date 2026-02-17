'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { Loader2, Lock } from 'lucide-react';

interface ProtectedContentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // What to show if access denied (optional)
  redirectToLogin?: boolean;  // Should we auto-redirect?
}

export default function ProtectedContent({ 
  children, 
  fallback, 
  redirectToLogin = false 
}: ProtectedContentProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        if (redirectToLogin) {
          router.push('/login');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [redirectToLogin, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="text-gray-400 animate-spin" size={24} />
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  // If not authenticated and not redirecting, show fallback
  return (
    <>
      {fallback || (
        <div className="flex flex-col items-center justify-center p-8 text-center border border-gray-200 bg-gray-50 rounded-xl">
          <div className="p-3 mb-3 bg-gray-200 rounded-full">
            <Lock className="text-gray-500" size={24} />
          </div>
          <h3 className="font-bold text-gray-800">Access Restricted</h3>
          <p className="mb-4 text-sm text-gray-500">
            Please log in to view this content.
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-[#06392F] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0A4D40]"
          >
            Log In
          </button>
        </div>
      )}
    </>
  );
}