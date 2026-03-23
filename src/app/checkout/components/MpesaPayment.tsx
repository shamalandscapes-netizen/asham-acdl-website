'use client'

import { useState } from 'react'
import type { CustomerData } from './CustomerForm'
import type { DeliveryData } from './DeliveryForm'

export default function MpesaPayment({
  customer,
  delivery,
  onSuccess,
}: {
  customer: CustomerData
  delivery: DeliveryData
  onSuccess: (orderId: string) => void
}) {
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    setLoading(true)

    // TODO: call API route to initiate Mpesa STK
    setTimeout(() => {
      onSuccess('ORDER_' + Date.now())
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black">Mpesa Payment</h2>

      <div className="p-4 text-sm border rounded-xl">
        <p><b>Name:</b> {customer.fullName}</p>
        <p><b>Phone:</b> {customer.phone}</p>
        <p><b>Address:</b> {delivery.address}</p>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full py-4 bg-[#0f7e40] text-white font-black rounded-xl"
      >
        {loading ? 'Processing...' : 'Pay with Mpesa'}
      </button>
    </div>
  )
}
