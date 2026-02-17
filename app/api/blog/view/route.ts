import { createSupabaseServerClient as createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // ✅ Use "as any" to bypass the missing RPC definition error.
    // This tells TypeScript to trust that 'increment_views' exists on the server.
    const { error } = await (supabase.rpc as any)('increment_views', { 
      post_id: id 
    });

    if (error) {
      console.error('View Increment Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
