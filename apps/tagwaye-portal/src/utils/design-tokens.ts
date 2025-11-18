/**
 * Design Token Utilities
 * 
 * Helper functions to read CSS custom properties (design tokens)
 * from the document root element.
 */

/**
 * Get a CSS custom property value from the document root
 */
export function getTokenValue(tokenName: string): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return getComputedStyle(document.documentElement)
    .getPropertyValue(tokenName)
    .trim();
}

/**
 * Get a dimension color token value
 */
export function getDimensionColor(dimension: 'time' | 'cost' | 'energy' | 'assets' | 'safety'): string {
  const tokenMap: Record<string, string> = {
    time: '--dimension-4d-color',
    cost: '--dimension-5d-color',
    energy: '--dimension-6d-color',
    assets: '--dimension-7d-color',
    safety: '--dimension-8d-color',
  };
  
  const value = getTokenValue(tokenMap[dimension]);
  return value || getFallbackColor(dimension);
}

/**
 * Fallback colors if tokens are not available
 */
function getFallbackColor(dimension: string): string {
  const fallbacks: Record<string, string> = {
    time: '#007aff',
    cost: '#34c759',
    energy: '#30d158',
    assets: '#ff9500',
    safety: '#ff453a',
  };
  return fallbacks[dimension] || '#007aff';
}

/**
 * Convert hex color to rgba with opacity
 */
export function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get a color token with opacity
 */
export function getColorWithOpacity(tokenName: string, opacity: number): string {
  const color = getTokenValue(tokenName);
  if (!color) return '';
  
  // If it's already rgba, extract rgb and apply new opacity
  if (color.startsWith('rgba')) {
    const rgb = color.slice(5, -1).split(',').slice(0, 3).join(',');
    return `rgba(${rgb}, ${opacity})`;
  }
  
  // If it's hex, convert to rgba
  if (color.startsWith('#')) {
    return hexToRgba(color, opacity);
  }
  
  return color;
}

