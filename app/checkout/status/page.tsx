'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

type Status = 'PENDING' | 'PAID' | 'FAILED';

// 1. Move the logic into a separate component
function PaymentStatusContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId');

  const [status, setStatus] = useState<Status>('PENDING');

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (!res.ok) throw new Error('Failed to fetch status');
        const data = await res.json();
        
        setStatus(data.status);

        if (data.status !== 'PENDING') clearInterval(interval);
      } catch (error) {
        console.error("Status check error:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="p-12 space-y-6 text-center bg-white shadow-xl rounded-3xl">
      {status === 'PENDING' && (
        <>
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#C75B39]" />
          <p className="text-sm font-black tracking-widest uppercase">Waiting for MPesa Confirmation</p>
        </>
      )}

      {status === 'PAID' && (
        <>
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
          <p className="text-sm font-black tracking-widest uppercase">Payment Successful</p>
          <p className="text-xs text-gray-500">Your order #{orderId?.slice(0,8)} is being processed.</p>
        </>
      )}

      {status === 'FAILED' && (
        <>
          <XCircle className="w-10 h-10 mx-auto text-red-500" />
          <p className="text-sm font-black tracking-widest uppercase">Payment Failed</p>
          <p className="text-xs text-gray-500">Please try again or contact support.</p>
        </>
      )}
    </div>
  );
}

// 2. Export the main page with a Suspense Boundary
export default function PaymentStatusPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB]">
      <Suspense fallback={
        <div className="p-12 text-center bg-white shadow-xl rounded-3xl">
          <Loader2 className="w-10 h-10 mx-auto text-gray-300 animate-spin" />
          <p className="mt-4 text-gray-400 animate-pulse">Initializing...</p>
        </div>
      }>
        <PaymentStatusContent />
      </Suspense>
    </div>
  );
}