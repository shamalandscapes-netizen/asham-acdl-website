import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
    }

    const supabase = await createClient();

    // FIX: Cast supabase as any to allow insertion into a table not in your TS schema
    const { error } = await (supabase as any)
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (error) {
      // Handle duplicate emails (Postgres error code for unique violation)
      if (error.code === '23505') {
        return NextResponse.json({ message: "You're already on the list!" }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json({ message: "Welcome to the journal!" }, { status: 200 });
  } catch (error: any) {
    console.error("Newsletter Error:", error.message);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
