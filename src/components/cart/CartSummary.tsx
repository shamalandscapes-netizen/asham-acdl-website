'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Lock } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  className?: string;
}

export default function CartSummary({ subtotal, className = '' }: CartSummaryProps) {
  // 1. Calculate Tax (Standard 16% VAT in Kenya)
  const taxRate = 0.16; 
  const taxAmount = subtotal * taxRate;
  
  // 2. Calculate Total
  const total = subtotal + taxAmount;

  return (
    <div className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24 ${className}`}>
      <h3 className="mb-6 text-xl font-bold text-gray-800">Order Summary</h3>
      
      {/* Price Breakdown */}
      <div className="mb-6 space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">KES {subtotal.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            VAT (16%) 
            <span className="px-1 text-xs text-gray-500 bg-gray-100 rounded">Tax</span>
          </span>
          <span className="font-medium">KES {taxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Delivery</span>
          <span className="text-sm italic text-gray-400">Calculated at checkout</span>
        </div>
        
        <div className="my-4 border-t border-gray-100"></div>
        
        <div className="flex justify-between font-bold text-xl text-[#06392F]">
          <span>Total</span>
          <span>KES {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link 
        href="/checkout"
        className="w-full bg-[#06392F] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#0A4D40] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        Proceed to Checkout <ArrowRight size={20} />
      </Link>

      {/* Trust Signals */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 p-3 text-xs text-gray-500 border border-gray-100 rounded-lg bg-gray-50">
          <Lock className="text-green-600 shrink-0" size={16} />
          <span>Security is our priority. Your payments are processed securely via M-Pesa.</span>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck size={14} />
          <span>Asham Construction Guaranteed</span>
        </div>
      </div>

    </div>
  );
}