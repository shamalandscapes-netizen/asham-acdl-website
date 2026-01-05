'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Loader2, MapPin, Phone, ShieldCheck, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useCartStore } from '@/store/cart-store';
import { formatCurrency } from '@/lib/utils/formatters';
import { formatMpesaPhone } from '@/lib/utils/payments';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    county: 'Kakamega', // Default
  });

  // Check if order requires shipping (if it has physical items)
  const hasPhysicalItems = items.some(item => !item.is_digital);

  useEffect(() => {
    setMounted(true);
    // If cart is empty, redirect back to shop
    if (items.length === 0) {
      router.push('/shop');
    }
  }, [items, router]);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Validate Phone
      const mpesaPhone = formatMpesaPhone(formData.phone);

      // 2. Prepare Payload (This is what we will send to the API later)
      const orderPayload = {
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: mpesaPhone,
        },
        shipping: hasPhysicalItems ? {
          address: formData.address,
          city: formData.city,
          county: formData.county,
        } : null,
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: totalPrice,
      };

      console.log('Submitting Order:', orderPayload);

      // TODO: Call API endpoint here
      // await axios.post('/api/orders', orderPayload);

      // Simulate API delay for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Order placed successfully! Please check your phone for the M-Pesa prompt.');
      
      // Clear cart and redirect to success page (we will build this later)
      // clearCart(); 
      // router.push('/checkout/success?orderId=123');

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Something went wrong. Please check your details.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/shop" className="text-gray-500 transition-colors hover:text-black">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          
          {/* LEFT COLUMN: Customer Details Form */}
          <div className="space-y-6">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Contact Info */}
              <div className="p-6 bg-white border shadow-sm rounded-xl">
                <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="fullName" className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                      id="fullName" // ✅ Added ID
                      required
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                      id="email" // ✅ Added ID
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">M-Pesa Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input 
                        id="phone" // ✅ Added ID
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="0712 345 678"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">We'll send an M-Pesa prompt to this number.</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address (Conditional) */}
              {hasPhysicalItems ? (
                <div className="p-6 bg-white border shadow-sm rounded-xl">
                  <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">Street Address / Landmark</label>
                      <input 
                        id="address" // ✅ Added ID
                        required
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Near Kakamega Primary School"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700">Town / City</label>
                        <input 
                          id="city" // ✅ Added ID
                          required
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Kakamega"
                        />
                      </div>
                      <div>
                        <label htmlFor="county" className="block mb-1 text-sm font-medium text-gray-700">County</label>
                        <select 
                          id="county" // ✅ Added ID to fix the specific error
                          name="county"
                          value={formData.county}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          aria-label="Select your county" // ✅ Added aria-label as backup
                        >
                          <option value="Kakamega">Kakamega</option>
                          <option value="Nairobi">Nairobi</option>
                          <option value="Kisumu">Kisumu</option>
                          <option value="Mombasa">Mombasa</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 text-sm text-blue-800 border border-blue-100 rounded-lg bg-blue-50">
                  <ShieldCheck className="flex-shrink-0 w-5 h-5" />
                  <p>Your order contains only digital items. No shipping address is required. You will receive download links via email immediately after payment.</p>
                </div>
              )}

            </form>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="space-y-6">
            <div className="sticky p-6 bg-white border shadow-lg rounded-xl top-8">
              <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold">
                <ShoppingBag className="w-5 h-5" />
                Order Summary
              </h2>

              {/* Items List */}
              <div className="pr-2 mb-6 space-y-4 overflow-y-auto max-h-60 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="relative flex-shrink-0 w-12 h-12 overflow-hidden bg-gray-100 rounded-md">
                      {item.image_url && (
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-4 mb-6 space-y-2 border-t">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                {hasPhysicalItems && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded">Calculated later</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 mt-2 text-lg font-bold text-gray-900 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* Payment Method Display */}
              <div className="flex items-center gap-3 p-3 mb-6 border border-green-100 rounded-lg bg-green-50">
                <div className="bg-green-600 text-white p-1.5 rounded">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-900">M-Pesa</p>
                  <p className="text-xs text-green-700">Fast & Secure Mobile Money</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className={cn(
                  "w-full py-4 px-6 rounded-lg font-bold text-white shadow-md transition-all",
                  isProcessing 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                )}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay ${formatCurrency(totalPrice)}`
                )}
              </button>
              
              <p className="mt-4 text-xs text-center text-gray-500">
                By clicking "Pay", you agree to our Terms & Conditions.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}