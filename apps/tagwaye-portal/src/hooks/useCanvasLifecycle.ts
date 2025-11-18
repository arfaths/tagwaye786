/**
 * Canvas Lifecycle Management Hook
 * 
 * Provides lifecycle state and callbacks for content components mounted in Universal Canvas.
 * Implements the full lifecycle: beforeMount → onMount → onActive → onInactive → beforeUnmount → onUnmount
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export interface CanvasLifecycleCallbacks {
  beforeMount?: () => void;
  onMount?: () => void;
  onActive?: () => void;
  onInactive?: () => void;
  beforeUnmount?: () => void;
  onUnmount?: () => void;
}

export interface CanvasLifecycleState {
  isMounted: boolean;
  isActive: boolean;
  isVisible: boolean;
}

/**
 * Hook for managing canvas content lifecycle
 */
export function useCanvasLifecycle(callbacks?: CanvasLifecycleCallbacks) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const callbacksRef = useRef(callbacks);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Lifecycle: beforeMount
  useEffect(() => {
    callbacksRef.current?.beforeMount?.();
  }, []);

  // Lifecycle: onMount
  useEffect(() => {
    setIsMounted(true);
    callbacksRef.current?.onMount?.();

    // Lifecycle: onUnmount cleanup
    return () => {
      callbacksRef.current?.beforeUnmount?.();
      cleanupRef.current?.();
      callbacksRef.current?.onUnmount?.();
      setIsMounted(false);
    };
  }, []);

  // Lifecycle: onActive / onInactive based on visibility and focus
  useEffect(() => {
    if (!isMounted) return;

    const handleFocus = () => {
      if (!isActive) {
        setIsActive(true);
        callbacksRef.current?.onActive?.();
      }
    };

    const handleBlur = () => {
      if (isActive) {
        setIsActive(false);
        callbacksRef.current?.onInactive?.();
      }
    };

    // Check if canvas content is visible
    const checkVisibility = () => {
      const canvasElement = document.querySelector('.tagwaye-main');
      if (canvasElement) {
        const rect = canvasElement.getBoundingClientRect();
        const visible = rect.width > 0 && rect.height > 0;
        setIsVisible(visible);
      }
    };

    // Initial visibility check
    checkVisibility();

    // Listen to focus/blur on window
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Listen to visibility changes
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting ?? false;
        setIsVisible(isVisible);
        if (isVisible && document.hasFocus()) {
          handleFocus();
        } else {
          handleBlur();
        }
      },
      { threshold: 0.1 }
    );

    const canvasElement = document.querySelector('.tagwaye-main');
    if (canvasElement) {
      visibilityObserver.observe(canvasElement);
    }

    // Set active if window has focus and content is visible
    if (document.hasFocus() && isVisible) {
      handleFocus();
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      visibilityObserver.disconnect();
    };
  }, [isMounted, isActive]);

  // Update active state when pathname changes (navigation)
  useEffect(() => {
    if (isMounted && document.hasFocus()) {
      // Small delay to ensure content is rendered
      const timer = setTimeout(() => {
        setIsActive(true);
        callbacksRef.current?.onActive?.();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, isMounted]);

  return {
    isMounted,
    isActive,
    isVisible,
  };
}

