"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PanelPane = "browse" | "monitor" | "analyze";
export type DimensionKey = "time" | "cost" | "energy" | "assets" | "safety";
export type ViewMode = "single" | "dual";
export type LayoutMode = "balanced" | "focus" | "analysis" | "presentation";
export type ThemePreference = "auto" | "light" | "dark";

type TimelineCursor = {
  day: number;
  label: string;
  isoDate: string;
};

interface LayoutState {
  sidebarPinned: boolean;
  sidebarExpanded: boolean;
  panelOpen: boolean;
  panelWidth: number;
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  theme: ThemePreference;
  activePanelPane: PanelPane;
  timelineVisible: boolean;
  timelineExpanded: boolean;
  activeDimension: DimensionKey;
  lifecyclePhase: string;
  timelineCursor: TimelineCursor;
  selectedProjectId: string;
  selectedAssetPath: string[];
  setSidebarPinned: (pinned: boolean) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setPanelOpen: (open: boolean) => void;
  setPanelWidth: (width: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setTheme: (theme: ThemePreference) => void;
  setActivePanelPane: (pane: PanelPane) => void;
  setTimelineVisible: (visible: boolean) => void;
  setTimelineExpanded: (expanded: boolean) => void;
  setActiveDimension: (dimension: DimensionKey) => void;
  setLifecyclePhase: (phase: string) => void;
  setTimelineCursor: (cursor: TimelineCursor) => void;
  setSelectedProjectId: (projectId: string) => void;
  setSelectedAssetPath: (path: string[]) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      sidebarPinned: false,
      sidebarExpanded: false,
      panelOpen: true,
      panelWidth: 360,
      viewMode: "dual",
      layoutMode: "balanced",
      theme: "auto",
      activePanelPane: "browse",
      timelineVisible: true,
      timelineExpanded: false,
      activeDimension: "time",
      lifecyclePhase: "Build",
      timelineCursor: {
        day: 156,
        label: "Week 24 • Critical Path",
        isoDate: "2025-06-05",
      },
      selectedProjectId: "proj_livingtwin_campus",
      selectedAssetPath: ["Building A", "Level 03", "HVAC North", "AHU-07"],
      setSidebarPinned: (sidebarPinned) => set({ sidebarPinned }),
      setSidebarExpanded: (sidebarExpanded) => set({ sidebarExpanded }),
      setPanelOpen: (panelOpen) => set({ panelOpen }),
      setPanelWidth: (panelWidth) =>
        set({
          panelWidth: Math.min(Math.max(panelWidth, 280), 600),
        }),
      setViewMode: (viewMode) => set({ viewMode }),
      setLayoutMode: (layoutMode) => set({ layoutMode }),
      setTheme: (theme) => set({ theme }),
      setActivePanelPane: (activePanelPane) => set({ activePanelPane }),
      setTimelineVisible: (timelineVisible) => set({ timelineVisible }),
      setTimelineExpanded: (timelineExpanded) => set({ timelineExpanded }),
      setActiveDimension: (activeDimension) => set({ activeDimension }),
      setLifecyclePhase: (lifecyclePhase) => set({ lifecyclePhase }),
      setTimelineCursor: (timelineCursor) => set({ timelineCursor }),
      setSelectedProjectId: (selectedProjectId) => set({ selectedProjectId }),
      setSelectedAssetPath: (selectedAssetPath) => set({ selectedAssetPath }),
    }),
    {
      name: "tagwaye-layout",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarPinned: state.sidebarPinned,
        panelWidth: state.panelWidth,
        viewMode: state.viewMode,
        layoutMode: state.layoutMode,
        theme: state.theme,
        activePanelPane: state.activePanelPane,
        timelineVisible: state.timelineVisible,
        timelineExpanded: state.timelineExpanded,
        selectedProjectId: state.selectedProjectId,
        selectedAssetPath: state.selectedAssetPath,
      }),
    },
  ),
);

