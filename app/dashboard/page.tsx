'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'
import type { Database } from '@/types/supabase'
import {
  Package,
  ShoppingBag,
  ArrowRight,
  Download,
  Loader2,
  MapPin,
  CreditCard,
  TrendingUp,
  HardHat,
  FileText,
} from 'lucide-react'

type Order = {
  id: string
  created_at: string
  total_amount: number
  order_status: string
}

type UserProfile = {
  full_name: string | null
  email: string | null
  phone: string | null
  address: string | null
}

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalSpent: 0,
    activeOrders: 0,
  })

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { data: auth } = await supabase.auth.getUser()
        if (!auth.user) return

        const userId = auth.user.id

        const [profileRes, ordersRes] = await Promise.all([
          supabase
            .from('profiles')
            .select('full_name, email, phone, address')
            .eq('id', userId)
            .single(),

          supabase
            .from('orders')
            .select('id, created_at, total_amount, order_status')
            .eq('customer_id', userId)
            .order('created_at', { ascending: false }),
        ])

        if (profileRes.data) {
          setProfile(profileRes.data)
        }

        if (ordersRes.data) {
          setOrders(ordersRes.data)

          const totalSpent = ordersRes.data.reduce(
            (sum, o) => sum + (o.total_amount || 0),
            0
          )

          const activeOrders = ordersRes.data.filter(
            (o) =>
              !['delivered', 'cancelled'].includes(
                o.order_status?.toLowerCase()
              )
          ).length

          setStats({ totalSpent, activeOrders })
        }
      } catch (err) {
        console.error('Dashboard load failed:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#06392F] mb-4" />
        <p className="font-medium text-gray-400">
          Loading your dashboard…
        </p>
      </div>
    )
  }

  return (
    <div className="pb-12 space-y-8">
      {/* HERO */}
      <div className="relative overflow-hidden bg-[#06392F] text-white rounded-3xl p-8 md:p-12 shadow-2xl">
        <h1 className="mb-4 text-4xl font-black md:text-5xl">
          Hello, {profile?.full_name?.split(' ')[0] || 'Welcome'}
        </h1>
        <p className="max-w-xl text-lg text-green-50/80">
          You have{' '}
          <span className="text-[#C75B39] font-bold">
            {stats.activeOrders}
          </span>{' '}
          active orders in progress.
        </p>

        <HardHat className="absolute -right-20 -bottom-20 w-80 h-80 opacity-5 rotate-[-12deg]" />
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <KPICard
          title="Total Investment"
          value={`KES ${stats.totalSpent.toLocaleString()}`}
          subtitle="Lifetime spend"
          icon={<TrendingUp className="text-emerald-500" />}
        />
        <KPICard
          title="Active Orders"
          value={stats.activeOrders.toString()}
          subtitle="In progress"
          icon={<Package className="text-[#C75B39]" />}
        />
        <KPICard
          title="Documents"
          value="—"
          subtitle="Invoices & blueprints"
          icon={<FileText className="text-blue-500" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ORDERS */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#06392F]">
              Recent Orders
            </h2>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1 font-bold text-[#C75B39]"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <OrdersTable orders={orders} onOpen={router.push} />
          )}
        </div>

        {/* PROFILE */}
        <div className="space-y-8">
          <ProfileCard profile={profile} />

          <div className="bg-gradient-to-br from-[#C75B39] to-[#A64828] text-white rounded-3xl p-8 shadow-xl">
            <h3 className="mb-2 text-2xl font-black">
              My Blueprints
            </h3>
            <p className="mb-6 text-orange-100/80">
              Access your purchased plans
            </p>
            <Link
              href="/dashboard/downloads"
              className="inline-flex items-center gap-2 bg-white text-[#C75B39] px-6 py-3 rounded-xl font-black text-sm"
            >
              Open Library <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- SUB COMPONENTS ---------- */

function KPICard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <div className="p-6 transition bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-xl">
      <div className="flex justify-between mb-4">
        <div className="p-3 bg-gray-50 rounded-2xl">{icon}</div>
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase">
        {title}
      </p>
      <h4 className="text-2xl font-black text-[#06392F]">
        {value}
      </h4>
      <p className="text-[10px] text-gray-400">{subtitle}</p>
    </div>
  )
}

function EmptyOrders() {
  return (
    <div className="p-16 text-center bg-white border-2 border-dashed rounded-3xl">
      <ShoppingBag className="mx-auto mb-4 text-gray-200" size={64} />
      <p className="mb-6 text-xl font-bold text-gray-400">
        No orders yet
      </p>
      <Link
        href="/products"
        className="bg-[#06392F] text-white px-8 py-3 rounded-xl font-bold"
      >
        Browse Materials
      </Link>
    </div>
  )
}

function OrdersTable({
  orders,
  onOpen,
}: {
  orders: Order[]
  onOpen: (url: string) => void
}) {
  return (
    <div className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
      <table className="w-full">
        <thead className="bg-gray-50 text-[11px] font-black uppercase text-gray-400">
          <tr>
            <th className="px-8 py-5">Order</th>
            <th className="px-8 py-5">Date</th>
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.slice(0, 5).map((o) => (
            <tr
              key={o.id}
              onClick={() => onOpen(`/dashboard/orders/${o.id}`)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <td className="px-8 py-6 font-mono font-bold">
                #{o.id.slice(0, 8)}
              </td>
              <td className="px-8 py-6 text-gray-500">
                {new Date(o.created_at).toLocaleDateString()}
              </td>
              <td className="px-8 py-6 text-xs font-bold uppercase">
                {o.order_status}
              </td>
              <td className="px-8 py-6 font-black text-right">
                KES {o.total_amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProfileCard({ profile }: { profile: UserProfile | null }) {
  return (
    <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl">
      <h3 className="text-xl font-black text-[#06392F] mb-6">
        My Profile
      </h3>

      <p className="text-lg font-black">{profile?.full_name}</p>
      <p className="mb-6 text-gray-400">{profile?.email}</p>

      <div className="space-y-4 text-sm font-bold text-gray-600">
        <div className="flex items-center gap-3">
          <MapPin size={18} />
          {profile?.address || 'Set delivery address'}
        </div>
        <div className="flex items-center gap-3">
          <CreditCard size={18} />
          {profile?.phone || 'Add phone number'}
        </div>
      </div>

      <Link
        href="/dashboard/user"
        className="block mt-8 text-center py-3 rounded-xl bg-gray-50 font-black text-[#06392F]"
      >
        Account Settings
      </Link>
    </div>
  )
}
