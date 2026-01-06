'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Download, FileText, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface DownloadItem {
  id: string; // product id
  name: string;
  order_date: string;
  order_id: string;
}

export default function LibraryPage() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDownloads() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Get Paid Orders AND their Items
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id, 
            created_at, 
            payment_status,
            order_items ( product_id )
          `)
          .eq('user_id', user.id)
          .in('payment_status', ['paid', 'shipped', 'delivered']);

        if (ordersError || !orders || orders.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Map Product IDs
        const purchasedProductIds: string[] = [];
        const orderMap = new Map(); 

        orders.forEach((order: any) => {
          order.order_items?.forEach((item: any) => {
            if (item.product_id) {
              purchasedProductIds.push(item.product_id);
              orderMap.set(item.product_id, { date: order.created_at, orderId: order.id });
            }
          });
        });

        if (purchasedProductIds.length === 0) {
          setLoading(false);
          return;
        }

        // 3. Fetch Product Details (Filtering for 'digital' type)
        const { data: products } = await supabase
          .from('products')
          .select('id, name, type') 
          .in('id', purchasedProductIds)
          .eq('type', 'digital');

        if (products) {
          const downloads = products.map((p: any) => ({
            id: p.id,
            name: p.name,
            order_date: orderMap.get(p.id)?.date,
            order_id: orderMap.get(p.id)?.orderId,
          }));
          setItems(downloads);
        }
      } catch (err) {
        console.error('Error fetching downloads:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDownloads();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-[#06392F] mb-4" size={32} />
        <p className="font-medium text-gray-500">Loading your digital plans...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl py-4 mx-auto space-y-6 md:py-8">
      <div>
        <h1 className="text-2xl font-bold text-[#06392F] flex items-center gap-2">
          <Download className="text-[#C75B39]" /> My Digital Library
        </h1>
        <p className="text-gray-500">
          Access your purchased architectural plans and digital assets.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="p-12 text-center bg-white border-2 border-gray-200 border-dashed rounded-xl">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-700">No downloads found</h3>
          <p className="max-w-md mx-auto mt-2 mb-6 text-sm text-gray-500">
            Digital blueprints appear here once your payment is confirmed.
          </p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-[#06392F] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#0A4D40] transition-colors">
            <ShoppingBag size={18} /> Browse Plans
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.order_id}`} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:border-[#C75B39] transition-all">
              <div className="flex items-start w-full gap-4 md:w-auto">
                <div className="p-4 text-blue-600 bg-blue-50 rounded-xl hidden md:block">
                  <FileText size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                  <div className="mt-1 text-xs text-gray-500">
                    Purchased: {new Date(item.order_date).toLocaleDateString()} | Order #{item.order_id.slice(0,8).toUpperCase()}
                  </div>
                </div>
              </div>
              <a 
                href={`/api/digital-products/download/${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto px-6 py-3 bg-[#06392F] text-white rounded-lg font-bold hover:bg-[#0A4D40] flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Download size={18} /> Download PDF
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-3 p-4 text-sm text-blue-800 border border-blue-100 rounded-lg bg-blue-50">
        <AlertCircle className="shrink-0 mt-0.5 text-blue-600" size={18} />
        <p><strong>Note:</strong> Download links are secure. If a link expires, refresh the page to generate a new secure session.</p>
      </div>
    </div>
  );
}