'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function OrderDetail({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', params.id)
        .eq('customer_id', user.id)
        .single()

      setOrder(data)
    }

    load()
  }, [params.id, supabase])

  if (!order) return <p>Loading…</p>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">
        Order #{order.order_number ?? order.id.slice(0, 8)}
      </h1>

      <p>Status: {order.status}</p>

      <ul className="border rounded-lg">
        {order.order_items.map((i: any) => (
          <li key={i.id} className="p-4 border-b">
            {i.product_name} × {i.quantity}
          </li>
        ))}
      </ul>

      <div className="flex gap-4">
        <a
          href={`/api/orders/${order.id}/receipt`}
          className="btn"
        >
          Download Receipt
        </a>

        <a
          href={`/api/orders/${order.id}/invoice`}
          className="btn"
        >
          Download Invoice
        </a>
      </div>
    </div>
  )
}
