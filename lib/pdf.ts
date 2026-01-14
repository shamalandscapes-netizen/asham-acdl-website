import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'

/* ============================================================
    TYPES & INTERFACES
============================================================ */
// Use the PDFKit namespace for the type definition
type PDFDoc = PDFKit.PDFDocument;

interface BaseItem {
  name?: string;
  product_name?: string;
  quantity: number;
  price: number;
}

type OrderPDFOptions = {
  type?: 'receipt' | 'manifest' | 'invoice'
}

/* ============================================================
    FONT SETUP
============================================================ */
const FONT_REGULAR = path.join(process.cwd(), 'assets/fonts/Inter-Regular.ttf')
const FONT_BOLD = path.join(process.cwd(), 'assets/fonts/Inter-Bold.ttf')

/* ============================================================
    INTERNAL HELPERS
============================================================ */
function createDocument(): PDFDoc {
  // We cast the constructor to any to avoid the 'value vs type' conflict
  const doc = new (PDFDocument as any)({ size: 'A4', margin: 50 }) as PDFDoc;

  if (fs.existsSync(FONT_REGULAR) && fs.existsSync(FONT_BOLD)) {
    doc.registerFont('regular', FONT_REGULAR)
    doc.registerFont('bold', FONT_BOLD)
    doc.font('regular')
  } else {
    doc.font('Helvetica')
  }
  
  return doc
}

function collectBuffer(doc: PDFDoc): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = []
    doc.on('data', (chunk) => buffers.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)
  })
}

/* ============================================================
    MAIN GENERATOR
============================================================ */
export async function generateOrderPDF(
  order: {
    id: string
    order_number?: string
    invoice_number?: string
    customer_name: string
    customer_phone?: string
    delivery_address?: string
    status: string
    payment_method?: string
    mpesa_reference?: string
    items?: BaseItem[]
    order_items?: any[]
    total_amount: number
    created_at: string
  },
  options: OrderPDFOptions = { type: 'receipt' }
): Promise<Buffer> {
  const doc = createDocument()
  const isBoldAvailable = fs.existsSync(FONT_BOLD)

  /* ---------------- LOGO ---------------- */
  const logoPath = path.join(process.cwd(), 'public/assets/images/logos/Asset 2.png')
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 120 })
  }

  /* ---------------- HEADER ---------------- */
  doc.font(isBoldAvailable ? 'bold' : 'Helvetica-Bold').fontSize(18)
     .text('Asham Design Construction Ltd', 200, 50)

  doc.font(isBoldAvailable ? 'regular' : 'Helvetica').fontSize(9)
     .text('Building Materials & Construction Solutions', 200, 75)
     .text('Email: sales@ashamconstruction.co.ke', 200, 88)
     .text('Phone: +254 712 575 077', 200, 101)

  doc.moveDown(3)

  /* ---------------- WATERMARK ---------------- */
  doc.save()
     .rotate(-45, { origin: [300, 400] })
     .fontSize(70)
     .fillColor('gray')
     .opacity(0.1)
     .text((order.status || 'PENDING').toUpperCase(), 100, 350, { align: 'center' })
     .restore()
     .opacity(1)
     .fillColor('black')

  /* ---------------- TITLE ---------------- */
  const title = options.type === 'manifest' ? 'DELIVERY MANIFEST' : 
                options.type === 'invoice' ? 'OFFICIAL INVOICE' : 'OFFICIAL RECEIPT'
  
  doc.font(isBoldAvailable ? 'bold' : 'Helvetica-Bold').fontSize(16)
     .text(title, { align: 'center' })

  doc.moveDown()

  /* ---------------- META ---------------- */
  doc.font(isBoldAvailable ? 'regular' : 'Helvetica').fontSize(10)
  doc.text(`Doc Ref: ${order.invoice_number || order.order_number || order.id.slice(0, 8)}`)
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-KE')}`)
  doc.text(`Customer: ${order.customer_name}`)
  if (order.customer_phone) doc.text(`Phone: ${order.customer_phone}`)
  if (order.delivery_address) doc.text(`Address: ${order.delivery_address}`)
  if (order.mpesa_reference) doc.text(`M-Pesa Ref: ${order.mpesa_reference}`)

  doc.moveDown()

  /* ---------------- TABLE HEADER ---------------- */
  const tableTop = doc.y
  doc.font(isBoldAvailable ? 'bold' : 'Helvetica-Bold').fontSize(10)
  doc.text('Item Description', 50, tableTop)
  doc.text('Qty', 300, tableTop)
  doc.text('Unit Price', 380, tableTop)
  doc.text('Total', 480, tableTop)

  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).lineWidth(1).stroke()
  doc.font(isBoldAvailable ? 'regular' : 'Helvetica').moveDown(1)

  /* ---------------- ITEMS ---------------- */
  const itemsToProcess: BaseItem[] = order.items || order.order_items?.map(i => ({
    name: i.products?.name || 'Product',
    quantity: i.quantity,
    price: i.unit_price
  })) || []

  itemsToProcess.forEach((item) => {
    const currentY = doc.y
    const lineTotal = item.price * item.quantity
    const displayName = item.name || item.product_name || 'Item'
    
    doc.text(displayName, 50, currentY, { width: 240 })
    doc.text(String(item.quantity), 300, currentY)
    doc.text(`KES ${item.price.toLocaleString()}`, 380, currentY)
    doc.text(`KES ${lineTotal.toLocaleString()}`, 480, currentY)
    doc.moveDown(0.8)
  })

  /* ---------------- TOTALS ---------------- */
  doc.moveDown()
  const subtotal = order.total_amount / 1.16
  const vat = order.total_amount - subtotal
  const grandTotal = order.total_amount

  const totalsY = doc.y + 20
  doc.moveTo(350, totalsY).lineTo(550, totalsY).stroke()
  
  doc.font(isBoldAvailable ? 'regular' : 'Helvetica').fontSize(10)
  doc.text('Subtotal (Excl. VAT):', 350, totalsY + 10)
  doc.text(`KES ${subtotal.toLocaleString()}`, 480, totalsY + 10)

  doc.text('VAT (16%):', 350, totalsY + 25)
  doc.text(`KES ${vat.toLocaleString()}`, 480, totalsY + 25)

  doc.font(isBoldAvailable ? 'bold' : 'Helvetica-Bold').fontSize(12)
  doc.text('TOTAL:', 350, totalsY + 45)
  doc.text(`KES ${grandTotal.toLocaleString()}`, 480, totalsY + 45)

  /* ---------------- FOOTER ---------------- */
  doc.font(isBoldAvailable ? 'regular' : 'Helvetica').fontSize(8)
     .fillColor('gray')
     .text('Asham Design Construction Ltd is a registered entity in Kenya.', 50, 750, { align: 'center' })
     .text('This is a system-generated document. No signature required.', { align: 'center' })

  doc.end()
  return collectBuffer(doc)
}

/* ============================================================
    COMPAT EXPORTS
============================================================ */
export const generateInvoice = (order: any) => generateOrderPDF(order, { type: 'invoice' });
export const generateReceipt = (order: any) => generateOrderPDF(order, { type: 'receipt' });
