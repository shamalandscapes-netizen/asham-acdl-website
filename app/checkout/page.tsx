'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useCart } from '@/hooks/useCart'

import CheckoutSteps from './components/CheckoutSteps'
import CustomerForm from './components/CustomerForm'
import DeliveryForm from './components/DeliveryForm'
import MpesaPayment from './components/MpesaPayment'
import OrderSummary from './components/OrderSummary'

import type { CustomerData } from './components/CustomerForm'
import type { DeliveryData } from './components/DeliveryForm'

type CheckoutStep = 'customer' | 'delivery' | 'payment'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart } = useCart()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('customer')
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [deliveryData, setDeliveryData] = useState<DeliveryData | null>(null)

  // 🔐 LOCK CHECKOUT IF CART EMPTY
  useEffect(() => {
    if (!cart || cart.length === 0) {
      router.replace('/products')
    }
  }, [cart, router])

  if (!cart || cart.length === 0) return null

  return (
    <div className="min-h-screen bg-[#FBFBFB] px-6 py-16">
      <div className="grid grid-cols-1 gap-16 mx-auto max-w-7xl lg:grid-cols-12">

        {/* LEFT: FORMS */}
        <div className="lg:col-span-7 space-y-14">
          <CheckoutSteps currentStep={currentStep} />

          {currentStep === 'customer' && (
            <CustomerForm
              initialData={customerData ?? undefined}
              onNext={(data) => {
                setCustomerData(data)
                setCurrentStep('delivery')
              }}
            />
          )}

          {currentStep === 'delivery' && customerData && (
            <DeliveryForm
              initialData={deliveryData ?? undefined}
              onBack={() => setCurrentStep('customer')}
              onNext={(data) => {
                setDeliveryData(data)
                setCurrentStep('payment')
              }}
            />
          )}

          {currentStep === 'payment' && customerData && deliveryData && (
            <MpesaPayment
              customer={customerData}
              delivery={deliveryData}
              onSuccess={(orderId) => {
                router.push(`/checkout/success?order=${orderId}`)
              }}
            />
          )}
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="lg:col-span-5">
          <OrderSummary />
        </div>

      </div>
    </div>
  )
}
