'use client';

import { useEffect } from 'react';

export default function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    // Only track in production to avoid inflating numbers during dev
    if (process.env.NODE_ENV === 'development') return;

    fetch('/api/blog/view', {
      method: 'POST',
      body: JSON.stringify({ id: postId }),
    });
  }, [postId]);

  return null; // This component doesn't render anything
}