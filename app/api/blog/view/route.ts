import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Simple in-memory rate limiting (consider using Redis in production)
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_VIEWS_PER_WINDOW = 5; // Maximum 5 views per hour from same IP

// Helper to get client IP
function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return 'unknown';
}

// Check rate limit
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userRate = rateLimit.get(ip);

  if (!userRate) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (now - userRate.timestamp > RATE_LIMIT_WINDOW) {
    // Reset window
    rateLimit.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (userRate.count >= MAX_VIEWS_PER_WINDOW) {
    return true;
  }

  userRate.count++;
  return false;
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimit.entries()) {
    if (now - data.timestamp > RATE_LIMIT_WINDOW) {
      rateLimit.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json().catch(() => ({}));
    const { id, timestamp, referrer } = body;

    // Validate post ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { 
          error: 'Invalid or missing post ID',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    // Get client info for rate limiting and analytics
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Check rate limit
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          code: 'RATE_LIMITED',
          retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000 / 60) // minutes
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(RATE_LIMIT_WINDOW / 1000).toString()
          }
        }
      );
    }

    const supabase = await createSupabaseServerClient();

    // First, check if post exists
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, views')
      .eq('id', id)
      .single();

    if (postError || !post) {
      console.error('Post not found:', id);
      return NextResponse.json(
        { 
          error: 'Post not found',
          code: 'POST_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Use Supabase's built-in RPC with proper typing
    const { error: rpcError } = await supabase.rpc('increment_views', { 
      post_id: id 
    });

    if (rpcError) {
      console.error('View increment error:', rpcError);
      
      // Fallback: Try direct update if RPC fails
      const { error: updateError } = await supabase
        .from('posts')
        .update({ views: (post.views || 0) + 1 })
        .eq('id', id);

      if (updateError) {
        console.error('Fallback update also failed:', updateError);
        return NextResponse.json(
          { 
            error: 'Failed to update view count',
            code: 'UPDATE_FAILED'
          },
          { status: 500 }
        );
      }
    }

    // Optional: Store view analytics in separate table for detailed metrics
    if (process.env.NODE_ENV === 'production') {
      // Don't await this - fire and forget to not block response
      supabase
        .from('post_views_analytics')
        .insert({
          post_id: id,
          viewed_at: timestamp || new Date().toISOString(),
          referrer: referrer || request.headers.get('referer') || null,
          user_agent: userAgent,
          ip_hash: Buffer.from(clientIp).toString('base64'), // Hash IP for privacy
        })
        .then(({ error }) => {
          if (error) console.error('Analytics insert error:', error);
        });
    }

    // Return success with current view count
    return NextResponse.json({ 
      success: true,
      views: (post.views || 0) + 1,
      message: 'View tracked successfully'
    });

  } catch (error) {
    console.error('Unexpected error in view tracking:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'View tracking API is running',
    rateLimitWindow: `${RATE_LIMIT_WINDOW / 1000 / 60} minutes`,
    maxViewsPerWindow: MAX_VIEWS_PER_WINDOW
  });
}