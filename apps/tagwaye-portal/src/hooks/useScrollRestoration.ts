/**
 * Scroll Restoration Hook
 * 
 * Remembers and restores scroll position per route.
 * Implements smooth scroll restoration for canvas content.
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const scrollCache = new Map<string, number>();

/**
 * Hook for restoring scroll position per route
 */
export function useScrollRestoration(containerSelector = '.tagwaye-main') {
  const pathname = usePathname();
  const isRestoringRef = useRef(false);

  useEffect(() => {
    const container = document.querySelector(containerSelector) as HTMLElement;
    if (!container) return;

    const key = pathname;
    const cachedScroll = scrollCache.get(key);

    // Restore scroll position
    if (cachedScroll !== undefined && !isRestoringRef.current) {
      isRestoringRef.current = true;
      
      // Wait for content to render, then restore scroll
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.scrollTo({
            top: cachedScroll,
            behavior: 'auto', // Instant restore, not smooth
          });
          isRestoringRef.current = false;
        });
      });
    }

    // Save scroll position on navigation away
    return () => {
      if (!isRestoringRef.current) {
        const currentScroll = container.scrollTop || 0;
        scrollCache.set(key, currentScroll);
      }
    };
  }, [pathname, containerSelector]);

  // Save scroll on scroll events (debounced)
  useEffect(() => {
    const container = document.querySelector(containerSelector) as HTMLElement;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isRestoringRef.current) {
          const key = pathname;
          scrollCache.set(key, container.scrollTop);
        }
      }, 150); // Debounce scroll saves
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [pathname, containerSelector]);
}

