'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';

// 1. Move the logic into a separate component
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear the cart once the order is successfully placed
    clearCart();
  }, [clearCart]);

  return (
    <div className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl">
      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Order Confirmed!</h1>
      <p className="mb-6 text-gray-600">
        Thank you for your purchase. Your order <span className="font-mono font-bold text-blue-600">#{orderId?.slice(0, 8)}</span> has been placed successfully.
      </p>
      
      <div className="p-4 mb-8 text-sm text-blue-800 border border-blue-100 rounded-lg bg-blue-50">
        <p>A representative will contact you shortly regarding the delivery of your construction materials.</p>
      </div>

      <div className="flex flex-col gap-3">
        <Link 
          href="/dashboard" 
          className="w-full py-3 font-semibold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          View Order Status
        </Link>
        <Link 
          href="/shop" 
          className="w-full py-3 font-medium text-gray-600 transition hover:text-gray-900"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

// 2. The main page component wraps the content in Suspense
export default function SuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Confirming your order...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}