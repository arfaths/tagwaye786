/**
 * Animation utilities using design tokens
 * 
 * Provides consistent spring physics and transition configurations
 * that respect design tokens and reduced motion preferences.
 */

/**
 * Get spring physics configuration from design tokens
 * For use with Framer Motion's spring transitions
 */
export function getSpringConfig() {
  // Read CSS custom properties from computed styles
  if (typeof window === 'undefined') {
    // SSR fallback - use default values
    return {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    };
  }

  const root = document.documentElement;
  const stiffness = parseInt(
    getComputedStyle(root).getPropertyValue('--spring-stiffness').trim() || '300',
    10,
  );
  const damping = parseInt(
    getComputedStyle(root).getPropertyValue('--spring-damping').trim() || '30',
    10,
  );

  return {
    type: 'spring' as const,
    stiffness,
    damping,
  };
}

/**
 * Get spring config optimized for sidebar expand/collapse (250ms target)
 */
export function getSidebarSpringConfig() {
  return {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  };
}

/**
 * Get spring config optimized for panel slide in/out (250ms target)
 */
export function getPanelSpringConfig() {
  return {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  };
}

/**
 * Get spring config optimized for timeline expand/collapse (350ms target)
 */
export function getTimelineSpringConfig() {
  return {
    type: 'spring' as const,
    stiffness: 220,
    damping: 28,
  };
}

/**
 * Get spring config optimized for drawer toggle (200ms target)
 */
export function getDrawerSpringConfig() {
  return {
    type: 'spring' as const,
    stiffness: 400,
    damping: 35,
  };
}

/**
 * Get transition duration from design tokens
 */
export function getTransitionDuration(type: 'fast' | 'normal' | 'slow' | 'slower'): number {
  if (typeof window === 'undefined') {
    const defaults = { fast: 150, normal: 250, slow: 350, slower: 500 };
    return defaults[type];
  }

  const root = document.documentElement;
  const value = getComputedStyle(root)
    .getPropertyValue(`--duration-${type}`)
    .trim();
  
  // Parse "150ms" -> 150
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 250;
}

/**
 * Get easing curve from design tokens
 */
export function getEasingCurve(type: 'standard' | 'decelerate' | 'accelerate' | 'sharp'): string {
  if (typeof window === 'undefined') {
    return 'cubic-bezier(0.4, 0.0, 0.2, 1)';
  }

  const root = document.documentElement;
  return (
    getComputedStyle(root).getPropertyValue(`--easing-${type}`).trim() ||
    'cubic-bezier(0.4, 0.0, 0.2, 1)'
  );
}

