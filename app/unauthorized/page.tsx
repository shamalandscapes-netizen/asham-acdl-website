'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, MessageCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-50/50">
      <div className="w-full max-w-lg p-10 text-center bg-white border border-gray-100 shadow-2xl rounded-3xl">
        {/* Visual Warning */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-red-100 rounded-full opacity-25 animate-ping" />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-red-50">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900">
          Access Restricted
        </h1>
        
        <p className="mb-10 font-medium leading-relaxed text-gray-500">
          It looks like you don&apos;t have the necessary permissions to view the 
          <span className="font-bold text-gray-800"> Admin Portal</span>. 
          If you believe this is an error, please contact your construction account manager.
        </p>

        {/* Action Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          <Link href="/dashboard">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#06392F] text-white font-bold rounded-xl hover:opacity-90 transition-all">
              <Home size={18} />
              My Dashboard
            </button>
          </Link>
          <Link href="/contact">
            <button className="flex items-center justify-center w-full gap-2 px-6 py-3 font-bold text-gray-700 transition-all border-2 border-gray-100 rounded-xl hover:bg-gray-50">
              <MessageCircle size={18} />
              Get Support
            </button>
          </Link>
        </div>

        <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#C75B39] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Asham Home
        </Link>
      </div>
    </div>
  );
}