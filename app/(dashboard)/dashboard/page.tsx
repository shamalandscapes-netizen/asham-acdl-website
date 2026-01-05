'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  Package, 
  ShoppingBag, 
  User, 
  Clock, 
  ArrowRight, 
  Download, 
  Loader2,
  MapPin,
  CreditCard,
  ShieldCheck
} from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string; 
  mpesa_ref: string | null;
}

interface UserProfile {
  full_name: string | null;
  email: string | null;
  phone?: string | null;
  address?: string | null;
  role?: string | null;
}

export default function UserDashboard() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function getUserData() {
      try {
        // 1. Get Auth Session (Immediate data)
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        // 2. Fetch Profile from 'users' table
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('full_name, email, phone, address, role')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        } else {
          // 3. Fallback: Use Auth Metadata if DB profile is missing/restricted
          setProfile({
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            role: user.app_metadata?.role || 'customer'
          });
          console.warn("DB Profile not found, using Auth Metadata instead.");
        }

        // 4. Fetch Orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('id, created_at, total_amount, payment_status, mpesa_receipt')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (ordersData) {
          const mappedOrders: Order[] = ordersData.map((order: any) => ({
            id: order.id,
            created_at: order.created_at,
            total_amount: order.total_amount,
            status: order.payment_status || 'pending',
            mpesa_ref: order.mpesa_receipt || null,
          }));
          setOrders(mappedOrders);
        }
        
      } catch (error) {
        console.error('Dashboard Load Error:', error);
      } finally {
        setLoading(false);
      }
    }

    getUserData();
  }, []);

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'paid') return 'bg-blue-100 text-blue-700';
    if (s === 'delivered') return 'bg-green-100 text-green-700';
    if (s === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-[#06392F] mx-auto mb-4" />
          <p className="font-medium text-gray-500">Loading your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl p-4 mx-auto space-y-8 md:p-8">
      
      {/* --- WELCOME HEADER --- */}
      <div className="bg-[#06392F] text-white rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            {profile?.role === 'super_admin' && (
              <span className="bg-[#C75B39] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck size={12} /> SUPER ADMIN
              </span>
            )}
          </div>
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">
            Welcome, {profile?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-green-50/80">
            Manage your Asham Construction projects, track material orders, and access your architectural downloads.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
             <Link href="/products" className="bg-[#C75B39] hover:bg-[#A64828] text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-orange-950/20 active:scale-95">
               Visit Shop
             </Link>
             <Link href="/dashboard/projects" className="px-8 py-3 font-bold text-white transition-all rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm">
               My Projects
             </Link>
          </div>
        </div>
        <Package className="absolute w-64 h-64 text-white -bottom-10 -right-10 opacity-5 rotate-12" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* --- RECENT ORDERS --- */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <Clock className="text-[#C75B39]" size={20} /> Recent Orders
            </h2>
            <Link href="/dashboard/orders" className="text-sm font-bold text-[#06392F] hover:underline">View All</Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white border border-gray-100 rounded-xl">
              <ShoppingBag className="mx-auto mb-4 text-gray-200" size={48} />
              <p className="mb-4 text-gray-500">You haven't placed any orders yet.</p>
              <Link href="/products" className="text-[#C75B39] font-bold">Start Shopping &rarr;</Link>
            </div>
          ) : (
            <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="transition-colors cursor-pointer hover:bg-gray-50" onClick={() => window.location.href = `/dashboard/orders/${order.id}`}>
                        <td className="px-6 py-4 font-mono text-[#06392F]">#{order.id.slice(0, 8)}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-right text-gray-900">KES {order.total_amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* --- PROFILE & TOOLS --- */}
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h3 className="flex items-center gap-2 mb-6 font-bold text-gray-800">
              <User size={18} className="text-[#C75B39]" /> Profile Summary
            </h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#06392F] text-white rounded-full flex items-center justify-center font-bold text-xl">
                {profile?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-gray-900 truncate">{profile?.full_name}</p>
                <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
              </div>
            </div>

            <div className="pt-6 space-y-3 text-sm text-gray-600 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-400" />
                <span className="truncate">{profile?.address || 'No address set'}</span>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard size={16} className="text-gray-400" />
                <span>{profile?.phone || 'No phone added'}</span>
              </div>
            </div>

            <Link href="/user/profile" className="block w-full mt-8 py-2 text-center text-sm font-bold text-[#06392F] bg-gray-50 rounded-lg hover:bg-[#06392F] hover:text-white transition-all">
              Edit Account
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#C75B39] to-[#964228] text-white rounded-xl p-6 shadow-md group">
            <div className="flex items-start justify-between mb-4">
              <Download size={24} className="transition-transform opacity-80 group-hover:scale-110" />
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">PDF / Blueprints</span>
            </div>
            <h3 className="mb-1 text-lg font-bold">My Downloads</h3>
            <p className="mb-6 text-xs text-orange-100">Access your purchased architectural plans and site drawings.</p>
            <Link href="/dashboard/downloads" className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3">
              Go to Library <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}