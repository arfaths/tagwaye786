/**
 * Panel Context State Management
 * 
 * Handles persistence and restoration of Panel state per context.
 */

import type { PanelContext, PanelContextState } from "./types";

const STORAGE_KEY_PREFIX = "panel-context-state-";

/**
 * Get state from localStorage for a specific context
 */
export function getContextState(context: PanelContext): Partial<PanelContextState> | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}${context}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load Panel context state:", error);
  }
  return null;
}

/**
 * Save state to localStorage for a specific context
 */
export function saveContextState(state: Partial<PanelContextState>): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}${state.context}`;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to save Panel context state:", error);
  }
}

/**
 * Save active pane for context
 */
export function saveActivePane(context: PanelContext, pane: string): void {
  const currentState = getContextState(context) || {};
  saveContextState({
    ...currentState,
    context,
    activePane: pane,
  });
}

/**
 * Save open drawers for context and pane
 */
export function saveOpenDrawers(
  context: PanelContext,
  pane: string,
  drawers: string[],
): void {
  const currentState = getContextState(context) || {};
  const openDrawers = currentState.openDrawers || {};
  saveContextState({
    ...currentState,
    context,
    openDrawers: {
      ...openDrawers,
      [pane]: drawers,
    },
  });
}

/**
 * Save scroll position for context and pane
 */
export function saveScrollPosition(
  context: PanelContext,
  pane: string,
  position: number,
): void {
  const currentState = getContextState(context) || {};
  const scrollPositions = currentState.scrollPositions || {};
  saveContextState({
    ...currentState,
    context,
    scrollPositions: {
      ...scrollPositions,
      [pane]: position,
    },
  });
}

/**
 * Restore scroll position for context and pane
 */
export function restoreScrollPosition(
  context: PanelContext,
  pane: string,
): number | null {
  const state = getContextState(context);
  if (state?.scrollPositions?.[pane] !== undefined) {
    return state.scrollPositions[pane];
  }
  return null;
}

