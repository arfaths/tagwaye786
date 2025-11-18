"use client";

import {
  LuBox,
  LuLayout,
  LuWorkflow,
  LuFileText,
  LuSettings,
} from "lucide-react";
import type { PanelContextConfig } from "./types";

/**
 * Panel Context Configurations
 * 
 * Each context defines its panes, default state, and whether to show header.
 */

export const panelContextConfigs: Record<string, PanelContextConfig> = {
  "asset-manager": {
    id: "asset-manager",
    name: "Asset Manager",
    icon: LuBox,
    showHeader: false, // Asset Manager is default, no header needed
    panes: [
      { value: "browse", label: "Browse" },
      { value: "monitor", label: "Monitor" },
      { value: "analyze", label: "Analyze" },
    ],
    defaultPane: "browse",
    defaultDrawers: {
      browse: ["hierarchy"],
      monitor: ["live-data", "alerts"],
      analyze: ["trends", "intelligence"],
    },
  },
  "dashboard-builder": {
    id: "dashboard-builder",
    name: "Dashboard Builder",
    icon: LuLayout,
    showHeader: true, // Builder contexts show header
    panes: [
      { value: "visualizations", label: "Visualizations" },
      { value: "data", label: "Data" },
      { value: "format", label: "Format" },
      { value: "filters", label: "Filters" },
    ],
    defaultPane: "visualizations",
    defaultDrawers: {
      visualizations: ["widgets"],
      data: ["sources"],
      format: ["style"],
      filters: ["filters"],
    },
  },
  "workflow-editor": {
    id: "workflow-editor",
    name: "Workflow Editor",
    icon: LuWorkflow,
    showHeader: true,
    panes: [
      { value: "nodes", label: "Nodes" },
      { value: "properties", label: "Properties" },
      { value: "variables", label: "Variables" },
      { value: "runs", label: "Runs" },
    ],
    defaultPane: "nodes",
    defaultDrawers: {
      nodes: ["library"],
      properties: ["settings"],
      variables: ["variables"],
      runs: ["history"],
    },
  },
  "form-builder": {
    id: "form-builder",
    name: "Form Builder",
    icon: LuFileText,
    showHeader: true,
    panes: [
      { value: "fields", label: "Fields" },
      { value: "layout", label: "Layout" },
      { value: "validation", label: "Validation" },
      { value: "actions", label: "Actions" },
    ],
    defaultPane: "fields",
    defaultDrawers: {
      fields: ["library"],
      layout: ["grid"],
      validation: ["rules"],
      actions: ["triggers"],
    },
  },
  settings: {
    id: "settings",
    name: "Settings",
    icon: LuSettings,
    showHeader: true,
    panes: [
      { value: "profile", label: "Profile" },
      { value: "appearance", label: "Appearance" },
      { value: "notifications", label: "Notifications" },
      { value: "integrations", label: "Integrations" },
    ],
    defaultPane: "profile",
    defaultDrawers: {
      profile: ["account"],
      appearance: ["theme"],
      notifications: ["preferences"],
      integrations: ["connected"],
    },
  },
};

/**
 * Get context configuration
 */
export function getContextConfig(context: string): PanelContextConfig {
  return (
    panelContextConfigs[context] || panelContextConfigs["asset-manager"]
  );
}

/**
 * Detect context from route/workflow
 * 
 * In a real app, this would inspect the current route or workflow state.
 * For now, it defaults to asset-manager.
 */
export function detectContextFromRoute(): string {
  // TODO: Implement route-based detection
  // const pathname = window.location.pathname;
  // if (pathname.includes("/dashboard")) return "dashboard-builder";
  // if (pathname.includes("/workflow")) return "workflow-editor";
  // if (pathname.includes("/form")) return "form-builder";
  // if (pathname.includes("/settings")) return "settings";
  return "asset-manager";
}

