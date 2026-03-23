import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient as createClient } from '@/lib/supabase/server'
import { generateInvoice } from '@/lib/pdf'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // FIX: Params is now a Promise
) {
  // 1. Await the dynamic parameters
  const { id } = await params;
  
  const supabase = await createClient()

  // 2. Fetch order data with joined items
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (name)
      )
    `)
    .eq('id', id)
    .single()

  if (fetchError || !order) {
    return new NextResponse('Order not found', { status: 404 })
  }

  try {
    // 3. Generate Metadata
    const timestamp = Date.now();
    const invoiceNoStr = order.invoice_number || `INV-${timestamp}`;
    
    // 4. Generate PDF
    const pdfBuffer = await generateInvoice(order);
    
    /**
     * FIX: Convert Buffer to Uint8Array safely for NextResponse
     */
    const pdfUint8Array = new Uint8Array(pdfBuffer as unknown as ArrayBuffer);

    // 5. Update Database if invoice number doesn't exist
    if (!order.invoice_number) {
      await supabase
        .from('orders')
        .update({
          invoice_number: invoiceNoStr as any, 
          invoice_generated_at: new Date().toISOString()
        })
        .eq('id', order.id)
    }

    // 6. Return the PDF Response
    return new NextResponse(pdfUint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoiceNoStr}.pdf"`,
        'Cache-Control': 'no-store, max-age=0'
      },
    })
  } catch (error) {
    console.error('Invoice Route Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}