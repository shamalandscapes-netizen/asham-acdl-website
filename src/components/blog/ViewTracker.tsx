'use client';

import { useEffect, useRef } from 'react';

interface ViewTrackerProps {
  postId: string;
  /**
   * Time in milliseconds the user needs to stay on page before counting a view
   * @default 5000
   */
  timeThreshold?: number;
  /**
   * Whether to track in development mode (for testing)
   * @default false
   */
  trackInDev?: boolean;
}

export default function ViewTracker({ 
  postId, 
  timeThreshold = 5000,
  trackInDev = false 
}: ViewTrackerProps) {
  const trackedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Skip in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !trackInDev) {
      return;
    }

    // Prevent double-tracking
    if (trackedRef.current) return;

    // Track when user has scrolled and stayed
    const handleUserActivity = () => {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Start a new timer
      timerRef.current = setTimeout(async () => {
        // Check if user has scrolled at least 50% down the page
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPercentage = (scrollPosition + windowHeight) / documentHeight;

        if (scrollPercentage > 0.5) {
          await trackView();
        } else {
          // Reset timer if they haven't scrolled enough
          timerRef.current = null;
        }
      }, timeThreshold);
    };

    const trackView = async () => {
      if (trackedRef.current) return;
      
      try {
        trackedRef.current = true;

        const response = await fetch('/api/blog/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            id: postId,
            timestamp: new Date().toISOString(),
            timeOnPage: Math.floor(performance.now() / 1000),
            referrer: document.referrer || null,
          }),
        });

        if (!response.ok) {
          console.error('Failed to track view:', await response.text());
          trackedRef.current = false; // Allow retry on failure
        }
      } catch (error) {
        console.error('Error tracking view:', error);
        trackedRef.current = false;
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleUserActivity, { passive: true });
    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });

    // Check if page is already in view on mount
    handleUserActivity();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [postId, timeThreshold, trackInDev]);

  return null;
}