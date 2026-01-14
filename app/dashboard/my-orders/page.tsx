'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// 1. Updated interface to allow null values from the database
interface Order {
  id: string
  order_number: string | null
  created_at: string | null
  total_amount: number
  status: string | null
}

export default function MyOrdersPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setLoading(false)

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          created_at,
          total_amount,
          status
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      // 2. Cast the data to Order[] to satisfy the state setter
      if (!error && data) {
        setOrders(data as Order[])
      }
      setLoading(false)
    }

    load()
  }, [supabase])

  if (loading) return <p className="p-6">Loading orders...</p>

  if (!orders.length) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-black">My Orders</h1>
        <p className="italic text-gray-400">No orders yet</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-black">My Orders</h1>

      <div className="overflow-hidden bg-white border shadow-sm rounded-xl">
        {orders.map(o => (
          <Link
            key={o.id}
            href={`/dashboard/my-orders/${o.id}`}
            className="flex items-center justify-between p-4 transition-colors border-b last:border-0 hover:bg-gray-50"
          >
            <div>
              <p className="font-mono font-bold text-blue-600">
                {/* 3. Safe fallback for UI display */}
                #{o.order_number ?? o.id.slice(0, 8)}
              </p>
              <p className="text-xs text-gray-400">
                {o.created_at ? new Date(o.created_at).toDateString() : 'Date unknown'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">KES {o.total_amount.toLocaleString()}</p>
              <p className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600 inline-block">
                {o.status ?? 'Pending'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}