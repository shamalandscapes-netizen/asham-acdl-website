'use client';

import { useEffect, useState } from 'react';

export default function useActiveHeading() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll('h2, h3')
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.textContent || '');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, []);

  return active;
}