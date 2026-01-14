'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail(order: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Asham Construction <billing@yourdomain.com>',
      to: [order.profiles?.email || order.guest_email],
      subject: `Invoice ${order.order_number} - Asham Design Construction Ltd`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #333;">
          <h1 style="color: #06392F;">Order Confirmed</h1>
          <p>Hello ${order.profiles?.full_name},</p>
          <p>Thank you for your business with <b>Asham Design Construction Ltd</b>. Your payment for order <b>${order.order_number}</b> has been verified.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Summary</h3>
            <p>Total Amount: <b>KES ${order.total_amount.toLocaleString()}</b></p>
            <p>M-Pesa Receipt: <b>${order.mpesa_receipt}</b></p>
          </div>

          <p>You can view your full invoice and track delivery by logging into your account at <a href="https://ashamconstruction.co.ke">ashamconstruction.co.ke</a>.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            Asham Design Construction Ltd<br/>
            P.O.BOX 17 – 50103 KAKAMEGA
          </p>
        </div>
      `,
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
