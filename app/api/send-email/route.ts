import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message, service } = await request.json();

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create a Transporter (Using cPanel/SMTP details)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // Use true for port 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 2. Configure the Email
    const mailOptions = {
      from: `"Asham Website" <${process.env.SMTP_USER}>`, // Sender address (Must match auth user)
      to: "info@ashamconstruction.co.ke", // Where YOU receive the email
      replyTo: email, // So you can hit "Reply" and it goes to the customer
      subject: `New Quote Request from ${name} - ${service || 'General Inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; max-width: 600px;">
          <h2 style="color: #06392F; border-bottom: 2px solid #C75B39; padding-bottom: 10px;">New Project Inquiry</h2>
          
          <div style="margin-bottom: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Service Interest:</strong> ${service || 'Not Specified'}</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #06392F;">
            <p style="margin: 0; color: #555;"><strong>Message:</strong></p>
            <p style="margin-top: 5px;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            This email was sent from the contact form on the Asham Construction website.
          </p>
        </div>
      `,
    };

    // 3. Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
