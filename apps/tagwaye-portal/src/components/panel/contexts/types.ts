/**
 * Panel Context System
 * 
 * Defines different Panel configurations based on user workflow/context.
 * Each context has its own set of panes and default state.
 */

export type PanelContext =
  | "asset-manager" // Scene Canvas - Hero context (current default)
  | "dashboard-builder"
  | "workflow-editor"
  | "form-builder"
  | "settings";

export type PanelPane = "browse" | "monitor" | "analyze" | string;

export interface PanelContextConfig {
  id: PanelContext;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  showHeader: boolean; // Show header for Builder contexts
  panes: Array<{
    value: string;
    label: string;
  }>;
  defaultPane: string;
  defaultDrawers: Record<string, string[]>; // pane -> drawer IDs
}

export interface PanelContextState {
  context: PanelContext;
  activePane: string;
  openDrawers: Record<string, string[]>; // pane -> drawer IDs
  scrollPositions: Record<string, number>; // pane -> scroll position
}

