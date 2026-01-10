'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft, 
  Loader2, 
  ShoppingCart, 
  CheckCircle2,
  Lock,
  X,
  CreditCard
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProductDisplayPage({ 
  params 
}: { 
  params: { slug: string; id: string } 
}) {
  const router = useRouter();
  const productId = params.id;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        // FIX: Added (supabase as any) to prevent build-time schema errors
        const { data, error } = await (supabase as any)
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;
        
        if (data) {
          setProduct(data);
          setActiveImage(data.image_url ?? '');
        }
      } catch (err: any) {
        console.error(err.message);
        toast.error("Plan not found");
      } finally {
        setLoading(false);
      }
    }
    if (productId) fetchProduct();
  }, [productId, supabase]);

  const handlePaymentInit = async () => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address to receive your plan.");
      return;
    }

    setPaymentLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: product.price,
          productName: product.name,
          productId: product.id,
          email: email,
        }),
      });

      const result = await response.json();

      if (response.ok && result.url) {
        window.location.href = result.url;
      } else {
        const errorMsg = result.details?.message || result.error || "Initialization failed";
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error("Payment Error:", err);
      toast.error(err.message || "Payment gateway busy. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <Loader2 className="animate-spin text-[#06392F]" size={40} />
    </div>
  );

  if (!product) return <div className="p-20 font-bold tracking-widest text-center text-gray-400 uppercase">Plan not found.</div>;

  const galleryItems = [product.image_url, ...(product.gallery || [])].filter(Boolean);

  return (
    <main className="relative p-6 mx-auto space-y-12 max-w-7xl lg:p-12">
      <nav aria-label="Breadcrumb">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-black font-bold text-[10px] uppercase tracking-widest transition-all"
        >
          <ArrowLeft size={14} className="mr-2" /> Back to Plans
        </button>
      </nav>

      <div className="grid items-start grid-cols-1 gap-16 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm group">
            <img 
              src={activeImage || '/placeholder.jpg'} 
              alt={product.name} 
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          {galleryItems.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {galleryItems.map((url, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(url)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === url ? 'border-[#06392F] scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-8 lg:sticky lg:top-12">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-[#06392F] uppercase tracking-[0.3em]">
              {product.category || 'Digital Plan'}
            </span>
            <h1 className="text-4xl italic font-black leading-none tracking-tighter text-gray-900 uppercase lg:text-5xl">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-gray-400">KES {Number(product.price).toLocaleString()}</p>
          </div>

          <p className="max-w-md text-lg leading-relaxed text-gray-600">{product.description}</p>

          <div className="space-y-3">
            {Array.isArray(product.features) && product.features.map((feat: string, i: number) => (
              <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                <CheckCircle2 size={18} className="text-[#06392F]" />
                {feat}
              </div>
            ))}
          </div>

          <div className="pt-8 space-y-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-4 border border-gray-100 bg-gray-50 rounded-2xl">
              <Lock size={18} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Instant STK Push / Card Payment
              </span>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-6 bg-[#06392F] text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-[#06392F]/20 hover:bg-[#084d40] transition-all flex items-center justify-center gap-3"
            >
              <ShoppingCart size={18} />
              Checkout Now
            </button>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col w-full max-w-md p-8 bg-white shadow-2xl rounded-[3rem] animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Secure Checkout</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
            </div>

            <div className="flex items-center gap-4 p-4 mb-6 border border-gray-100 bg-gray-50 rounded-2xl">
              <div className="flex-shrink-0 w-12 h-12 overflow-hidden bg-white rounded-lg">
                <img src={product.image_url} alt="" className="object-cover w-full h-full" />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase">{product.name}</h3>
                <p className="text-[#06392F] font-bold text-xs">KES {Number(product.price).toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-6 space-y-3">
               <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest block ml-1">
                 Email for Delivery
               </label>
               <input 
                 type="email"
                 placeholder="name@example.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#06392F] outline-none transition-all"
               />
            </div>

            {/* INTASEND TRUST BADGE SECTION */}
            <div className="flex flex-col items-center mb-8">
              <a href="https://intasend.com/security" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://intasend-prod-static.s3.amazonaws.com/img/trust-badges/intasend-trust-badge-with-mpesa-hr-light.png" 
                  style={{ width: '300px' }} 
                  alt="IntaSend Secure Payments"
                  className="transition-opacity opacity-90 hover:opacity-100"
                />
              </a>
              <a 
                style={{ display: 'block', color: '#454545', textDecoration: 'none', fontSize: '0.7em', marginTop: '0.6em' }} 
                href="https://intasend.com/security" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold tracking-widest uppercase"
              >
                Secured by IntaSend Payments
              </a>
            </div>

            <div className="space-y-4">
               <button 
                disabled={paymentLoading}
                onClick={handlePaymentInit}
                className="w-full py-6 bg-[#06392F] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] hover:bg-[#084d40] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {paymentLoading ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                {paymentLoading ? 'Connecting...' : 'Pay with M-Pesa / Card'}
              </button>
              
              <p className="text-[8px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                Upon successful payment, the download link will be sent to your email.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}