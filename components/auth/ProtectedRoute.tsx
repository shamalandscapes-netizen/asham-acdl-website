'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          // Redirect to login but save the current path to return here later
          const currentPath = window.location.pathname;
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }

        // Optional Role Check
        if (requiredRole) {
          const userRole = session.user.user_metadata?.role;
          if (userRole !== requiredRole && userRole !== 'admin') {
            router.push('/unauthorized'); // Create this page later
            return;
          }
        }

        setAuthorized(true);
      } catch (err) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router, supabase, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#06392F]" />
        <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}