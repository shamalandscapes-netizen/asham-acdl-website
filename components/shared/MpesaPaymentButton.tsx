'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Smartphone, ShieldCheck, AlertCircle } from 'lucide-react';

interface MpesaPaymentButtonProps {
  orderId: string;
  amount: number;
  phoneNumber: string; // Format: 2547...
  onSuccess?: (checkoutRequestID: string) => void;
  className?: string;
}

export default function MpesaPaymentButton({ 
  orderId, 
  amount, 
  phoneNumber,
  onSuccess,
  className = '' 
}: MpesaPaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount,
          phoneNumber
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      // Success Logic
      if (onSuccess) {
        onSuccess(data.checkoutRequestID);
      } else {
        // Default behavior: Redirect to status page
        router.push(`/checkout/success?orderId=${orderId}&checkoutId=${data.checkoutRequestID}`);
      }

    } catch (err: any) {
      console.error('Payment Error:', err);
      setError(err.message || 'Failed to send M-Pesa prompt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Error Message Display */}
      {error && (
        <div className="flex items-center w-full gap-2 p-3 mb-3 text-xs text-red-600 border border-red-100 rounded-lg bg-red-50">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`
          flex items-center justify-center gap-2 w-full py-3 rounded-lg font-bold text-white transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
          bg-green-600 hover:bg-green-700
          ${className}
        `}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>Sending Prompt...</span>
          </>
        ) : (
          <>
            <Smartphone size={18} />
            <span>Pay KES {amount.toLocaleString()} with M-Pesa</span>
          </>
        )}
      </button>
      
      <p className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
        <ShieldCheck size={10} className="text-green-600" />
        Secure payment by Safaricom
      </p>
    </div>
  );
}