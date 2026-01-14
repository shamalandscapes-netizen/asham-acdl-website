import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateInvoice } from '@/lib/pdf'

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (name)
      )
    `)
    .eq('id', params.id)
    .single()

  if (fetchError || !order) {
    return new NextResponse('Order not found', { status: 404 })
  }

  try {
    // 1. Generate Metadata
    const timestamp = Date.now();
    const invoiceNoStr = order.invoice_number || `INV-${timestamp}`;
    
    // 2. Generate PDF (Crucial: Await the buffer)
    const pdfBuffer = await generateInvoice(order);
    
    /**
     * FIX: Convert Buffer to Uint8Array safely for NextResponse
     * We cast to 'unknown' then 'Uint8Array' to satisfy the Web API types
     */
    const pdfUint8Array = new Uint8Array(pdfBuffer as unknown as ArrayBuffer);

    // 3. Update Database if invoice number doesn't exist
    if (!order.invoice_number) {
      await supabase
        .from('orders')
        .update({
          // Casting to 'any' handles schema mismatches (string vs number)
          invoice_number: invoiceNoStr as any, 
          invoice_generated_at: new Date().toISOString()
        })
        .eq('id', order.id)
    }

    // 4. Return the Response
    return new NextResponse(pdfUint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoiceNoStr}.pdf"`,
        // Optional: Cache control to prevent re-downloading identical PDFs
        'Cache-Control': 'no-store, max-age=0'
      },
    })
  } catch (error) {
    console.error('Invoice Route Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}