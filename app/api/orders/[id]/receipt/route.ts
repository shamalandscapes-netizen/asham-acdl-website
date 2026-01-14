import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateReceipt } from '@/lib/pdf'

export const runtime = 'nodejs' // REQUIRED for pdfkit

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  /* -----------------------------------------
   * 1️⃣ Fetch order (match real schema)
   * ----------------------------------------- */
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      total_amount,
      status,
      payment_method,
      shipping_address,
      created_at
    `)
    .eq('id', params.id)
    .single()

  if (orderError || !order) {
    return new NextResponse('Order not found', { status: 404 })
  }

  /* -----------------------------------------
   * 2️⃣ Fetch order items (USE REAL COLUMNS)
   * ----------------------------------------- */
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      product_name,
      quantity,
      unit_price
    `)
    .eq('order_id', params.id)

  if (itemsError) {
    return new NextResponse('Failed to load order items', { status: 500 })
  }

  /* -----------------------------------------
   * 3️⃣ Normalize items for PDF
   * ----------------------------------------- */
  const normalizedItems =
    items?.map((item) => ({
      product_name: item.product_name ?? 'Item',
      quantity: Number(item.quantity),
      price: Number(item.unit_price),
    })) ?? []

  /* -----------------------------------------
   * 4️⃣ Generate PDF (FIX: Added 'await')
   * ----------------------------------------- */
  // We await the promise returned by generateReceipt
  const pdfBuffer = await generateReceipt({
    id: order.id,
    order_number: order.order_number ?? undefined,
    customer_name: 'Customer', // 🔒 safe fallback
    customer_phone: undefined,
    delivery_address: order.shipping_address
      ? typeof order.shipping_address === 'string' 
        ? order.shipping_address 
        : JSON.stringify(order.shipping_address)
      : undefined,
    // Cast status to any to match the restricted union type in generateOrderPDF
    status: (order.status as any) || 'pending',
    payment_method: order.payment_method ?? undefined,
    total_amount: Number(order.total_amount),
    created_at: order.created_at ?? new Date().toISOString(),
    items: normalizedItems,
  })

  /* -----------------------------------------
   * 5️⃣ Return PDF (FIX: Safe Uint8Array casting)
   * ----------------------------------------- */
  // pdfBuffer is a Node.js Buffer, which is cast to unknown then ArrayBuffer for the Web API
  const pdfUint8Array = new Uint8Array(pdfBuffer as unknown as ArrayBuffer);

  return new NextResponse(pdfUint8Array, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="receipt-${order.order_number ?? order.id}.pdf"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}