/**
 * Accessibility Utilities
 * 
 * Helper functions for ARIA labels, keyboard navigation, and screen reader support
 */

/**
 * Announce a message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite",
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement is read
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Get keyboard shortcut description
 */
export function getKeyboardShortcut(
  key: string,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {},
) {
  const parts: string[] = [];
  if (modifiers.ctrl) parts.push("Ctrl");
  if (modifiers.shift) parts.push("Shift");
  if (modifiers.alt) parts.push("Alt");
  parts.push(key.toUpperCase());
  return parts.join(" + ");
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get accessible label for status
 */
export function getStatusLabel(
  status: "live" | "offline" | "syncing",
): string {
  switch (status) {
    case "live":
      return "Connection status: Live";
    case "offline":
      return "Connection status: Offline";
    case "syncing":
      return "Connection status: Syncing";
    default:
      return "Connection status: Unknown";
  }
}

/**
 * Format time for screen readers
 */
export function formatTimeForScreenReader(ms: number): string {
  if (ms < 1000) return `${ms} milliseconds`;
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
  return `${minutes} minute${minutes !== 1 ? "s" : ""} and ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
}

/**
 * Get accessible name for navigation item
 */
export function getNavigationItemLabel(
  label: string,
  isActive: boolean,
  isDisabled: boolean,
): string {
  let accessibleName = label;
  if (isActive) accessibleName += ", current page";
  if (isDisabled) accessibleName += ", disabled";
  return accessibleName;
}

