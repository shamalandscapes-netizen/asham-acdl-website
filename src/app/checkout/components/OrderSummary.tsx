'use client'

import { useCart } from '@/hooks/useCart'

export default function OrderSummary() {
  const { cart, total } = useCart()

  return (
    <div className="p-6 space-y-4 bg-white border rounded-2xl">
      <h3 className="text-lg font-black">Order Summary</h3>

      {cart.map((item) => (
        <div key={item.id} className="flex justify-between text-sm">
          <span>
            {item.name} × {item.quantity}
          </span>
          <span>
            KES {(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      ))}

      <div className="flex justify-between pt-4 font-black border-t">
        <span>Total</span>
        <span>KES {total.toLocaleString()}</span>
      </div>
    </div>
  )
}
