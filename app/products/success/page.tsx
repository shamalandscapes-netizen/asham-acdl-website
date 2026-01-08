'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Home } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

// 1. Create a sub-component for the content that uses SearchParams
function SuccessContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const handleDownload = () => {
    if (productId) {
      // Directs the user to the secure download API we built
      window.location.href = `/api/digital-products/download/${productId}`;
    } else {
      alert("Product ID not found. Please check your email for the download link.");
    }
  };

  return (
    <div className="p-12 bg-white shadow-xl rounded-[3rem] max-w-md w-full border border-gray-100">
      <div className="flex justify-center mb-6">
        <div className="p-4 text-green-600 bg-green-100 rounded-full">
          <CheckCircle size={48} />
        </div>
      </div>
      
      <h1 className="mb-2 text-3xl italic font-black tracking-tighter uppercase">Payment Received</h1>
      <p className="mb-8 text-xs font-bold tracking-widest text-gray-500 uppercase">Your digital plan is ready</p>

      <div className="space-y-4">
        <button 
          onClick={handleDownload}
          className="w-full py-5 bg-[#06392F] text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all"
        >
          <Download size={18} />
          Download PDF Plan
        </button>
        
        <Link href="/" className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors pt-4">
          <Home size={14} /> Back to Home
        </Link>
      </div>
    </div>
  );
}

// 2. The main page exports the content wrapped in Suspense
export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
      <Suspense fallback={
        <div className="p-12 bg-white shadow-xl rounded-[3rem] max-w-md w-full animate-pulse">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Validating Session...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}