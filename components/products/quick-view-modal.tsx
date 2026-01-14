'use client';

import { useMemo, useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Shield, 
  ArrowRight, 
  Package, 
  Truck 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useUIStore } from '@/store/ui-store';
import { useCartStore } from '@/store/cart-store';
import { formatCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

/* -------------------------------------------------
   Types
-------------------------------------------------- */
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  image_url?: string;
  image_urls?: string[];
  is_digital?: boolean;
  category?: string;
};

/* -------------------------------------------------
   Component
-------------------------------------------------- */
export function QuickViewModal() {
  const { isQuickViewOpen, selectedProduct, closeQuickView } = useUIStore();
  const addItem = useCartStore((state) => state.addItem);

  /* ------------------ Images (typed) ------------------ */
  const images = useMemo<string[]>(() => {
    if (!selectedProduct) return [];
    if (selectedProduct.image_urls?.length) return selectedProduct.image_urls;
    if (selectedProduct.image_url) return [selectedProduct.image_url];
    return [];
  }, [selectedProduct]);

  const [activeImage, setActiveImage] = useState<number>(0);

  /* ------------------ Handlers ------------------ */
  const handleAddToCart = useCallback(() => {
    if (!selectedProduct) return;

    addItem({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image_url: images[0],
      is_digital: selectedProduct.is_digital || false,
      quantity: 1,
    });

    toast.success(`${selectedProduct.name} added to cart`);
    closeQuickView();
  }, [addItem, selectedProduct, images, closeQuickView]);

  /* ------------------ Guard AFTER hooks ------------------ */
  if (!isQuickViewOpen || !selectedProduct) return null;

  /* -------------------------------------------------
     Render
  -------------------------------------------------- */
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#06392F]/60 backdrop-blur-xl"
        onClick={closeQuickView}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-6xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">

        {/* Close */}
        <button
          onClick={closeQuickView}
          className="absolute z-20 top-6 right-6 bg-white p-3 rounded-full shadow hover:bg-[#C75B39] hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT — Image Gallery */}
        <div className="relative w-full lg:w-1/2 bg-[#F8F9F8] p-6 flex flex-col">
          <div className="relative flex-1 overflow-hidden bg-white rounded-3xl">
            {images.length ? (
              <Image
                src={images[activeImage]}
                alt={selectedProduct.name}
                fill
                priority
                className="object-contain transition-transform duration-700"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300">
                <Package size={80} />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex justify-center gap-3 mt-4">
              {images.map((img: string, index: number) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "relative w-20 h-20 rounded-xl overflow-hidden border transition",
                    activeImage === index
                      ? "border-[#C75B39]"
                      : "border-gray-200 opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img}
                    alt={`${selectedProduct.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Details */}
        <div className="w-full p-8 overflow-y-auto lg:w-1/2 lg:p-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#06392F] text-white px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
              {selectedProduct.category}
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-lg">
              <Shield className="w-3 h-3" /> Verified
            </span>
          </div>

          <h2 className="text-4xl font-black text-[#06392F] mb-4">
            {selectedProduct.name}
          </h2>

          <p className="text-3xl font-black text-[#C75B39] mb-6">
            {formatCurrency(selectedProduct.price)}
          </p>

          <p className="mb-10 leading-relaxed text-gray-500">
            {selectedProduct.description || 'Premium construction-grade material.'}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <InfoCard icon={<Truck size={14} />} label="Delivery" value="24–48 hrs" />
            <InfoCard icon={<Check size={14} />} label="Standards" value="ISO / NCA" />
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-5 bg-[#06392F] text-white font-black uppercase tracking-widest rounded-2xl hover:bg-[#C75B39] transition"
            >
              <ShoppingBag className="inline mr-2" />
              Add to Cart
            </button>

            <Link
              href={`/products/${selectedProduct.slug}`}
              onClick={closeQuickView}
              className="block w-full py-5 font-black tracking-widest text-center uppercase border border-gray-200 rounded-2xl hover:bg-gray-50"
            >
              Full Details <ArrowRight className="inline ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   Small Helper
-------------------------------------------------- */
function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 border rounded-2xl bg-gray-50">
      <div className="flex items-center gap-2 text-[#06392F] mb-1">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-xs font-bold text-gray-600">{value}</p>
    </div>
  );
}
