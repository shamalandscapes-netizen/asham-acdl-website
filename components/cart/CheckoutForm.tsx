'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  Phone, 
  MapPin, 
  User, 
  Mail, 
  CreditCard, 
  ShieldCheck, 
  Smartphone,
  AlertCircle, // <--- Imported directly now
  Lock 
} from 'lucide-react';

export default function CheckoutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', 
    address: '',
    city: '',
    county: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create the Order
      const orderRes = await fetch('/api/orders', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress: formData }) 
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const { orderId, total } = orderData;

      // 2. Trigger M-Pesa STK Push
      const paymentRes = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: total,
          phoneNumber: formData.phone
        })
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(paymentData.error || 'Payment initiation failed');
      }

      // 3. Redirect to Success Page
      router.push(`/checkout/success?orderId=${orderId}&checkoutId=${paymentData.checkoutRequestID}`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border border-gray-200 shadow-sm md:p-8 rounded-2xl">
      
      {/* 1. Contact Information */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#06392F] mb-4 flex items-center gap-2">
          <User size={20} /> Contact Information
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input 
              type="text" 
              name="firstName" 
              required
              placeholder="First Name"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06392F]"
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input 
              type="text" 
              name="lastName" 
              required
              placeholder="Last Name"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06392F]"
              onChange={handleChange}
            />
          </div>
          <div className="relative md:col-span-2">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input 
              type="email" 
              name="email" 
              required
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06392F]"
              onChange={handleChange}
            />
          </div>
          <div className="relative md:col-span-2">
            <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input 
              type="tel" 
              name="phone" 
              required
              placeholder="M-Pesa Phone Number (e.g., 0712...)"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06392F]"
              onChange={handleChange}
            />
            <p className="text-xs text-[#C75B39] mt-1 ml-1">
              * This number will receive the M-Pesa prompt.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Shipping Address */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#06392F] mb-4 flex items-center gap-2">
          <MapPin size={20} /> Shipping Details
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <input 
            type="text" 
            name="address" 
            required
            placeholder="Street Address / Location"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06392F]"
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              name="city" 
              required
              placeholder="City / Town"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06392F]"
              onChange={handleChange}
            />
            <input 
              type="text" 
              name="county" 
              required
              placeholder="County"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06392F]"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 3. Payment Method */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#06392F] mb-4 flex items-center gap-2">
          <CreditCard size={20} /> Payment Method
        </h3>
        <div className="border-2 border-[#06392F] bg-green-50 p-4 rounded-xl flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
               <Smartphone className="text-green-600" />
            </div>
            <div>
              <p className="font-bold text-gray-800">M-Pesa Express</p>
              <p className="text-xs text-gray-500">Fast & Secure mobile payment</p>
            </div>
          </div>
          <div className="h-5 w-5 rounded-full border-2 border-[#06392F] flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-[#06392F]"></div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 mb-6 text-sm text-red-600 border border-red-100 rounded-lg bg-red-50">
           <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#06392F] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0A4D40] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            Pay Now <ShieldCheck size={20} />
          </>
        )}
      </button>
      
      <p className="flex items-center justify-center gap-1 mt-4 text-xs text-center text-gray-400">
        <Lock size={12} /> Encrypted Payment by Safaricom
      </p>

    </form>
  );
}