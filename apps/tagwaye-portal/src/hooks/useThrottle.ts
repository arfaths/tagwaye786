/**
 * Throttle hook for performance optimization
 * 
 * Limits the rate at which a function can fire.
 * Useful for resize events, scroll events, etc. that need to run at 60fps (16ms).
 */

import { useCallback, useRef } from 'react';

/**
 * Throttle a callback function
 * Returns a memoized throttled version of the callback
 * 
 * @param callback - Function to throttle
 * @param delay - Minimum time between calls (in milliseconds)
 * @returns Throttled callback
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  if (callbackRef.current !== callback) {
    callbackRef.current = callback;
  }

  const throttledCallback = useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRunRef.current;

      if (timeSinceLastRun >= delay) {
        // Enough time has passed, execute immediately
        lastRunRef.current = now;
        callbackRef.current(...args);
      } else {
        // Schedule execution for remaining time
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          callbackRef.current(...args);
        }, delay - timeSinceLastRun);
      }
    }) as T,
    [delay],
  );

  return throttledCallback;
}

