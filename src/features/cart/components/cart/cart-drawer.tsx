'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  /* ----------------------------------
   * STORE (SAFE GUARDED)
   * ---------------------------------- */
  const { items, getTotalPrice, removeItem, updateQuantity } = useCartStore()

  /* fallback protection (CRITICAL FIX) */
  const safeCart = Array.isArray(items) ? items : []

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const increment = useCallback(
    (id: string, qty: number) => {
      updateQuantity(id, qty + 1)
    },
    [updateQuantity]
  )

  const decrement = useCallback(
    (id: string, qty: number) => {
      if (qty > 1) updateQuantity(id, qty - 1)
    },
    [updateQuantity]
  )

  /* ----------------------------------
   * SAFE RETURN AFTER HOOKS
   * ---------------------------------- */
  if (!mounted) return null

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-lg font-black uppercase">Your Cart</h2>

            {/* SAFE LENGTH */}
            {safeCart.length > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#C75B39] rounded-full">
                {safeCart.length}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {safeCart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300" />
              <p className="font-bold">Your cart is empty</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#06392F] text-white rounded-lg font-bold"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            safeCart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border bg-gray-50 rounded-xl"
              >
                {/* Image */}
                <div className="relative w-20 h-20 overflow-hidden bg-white rounded-lg">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-1">
                  <div className="flex justify-between gap-2">
                    <h3 className="text-sm font-bold">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-[#C75B39]">
                    KES {item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => decrement(item.id, item.quantity)}
                        disabled={item.quantity <= 1}
                        className="p-2 disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="w-8 text-sm font-bold text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increment(item.id, item.quantity)}
                        className="p-2"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span className="font-bold">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {safeCart.length > 0 && (
          <footer className="p-6 space-y-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-xl font-black">
                KES {getTotalPrice().toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#06392F] text-white font-black rounded-xl hover:bg-black transition"
            >
              Checkout
              <ArrowRight size={16} />
            </Link>
          </footer>
        )}
      </aside>
    </>
  )
}