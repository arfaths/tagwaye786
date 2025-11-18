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
  timelineHeight: number; // Custom height when expanded (default: 320px)
  activeDimension: DimensionKey;
  lifecyclePhase: string;
  timelineCursor: TimelineCursor;
  timelineCurrentDay: number;
  timelineIsPlaying: boolean;
  timelinePlaybackSpeed: number;
  timelineAutoPauseAtMilestones: boolean;
  selectedProjectId: string;
  selectedAssetPath: string[];
  dualViewPrimary: { type: string; id?: string; label: string } | null;
  dualViewSecondary: { type: string; id?: string; label: string } | null;
  dualViewActiveSide: "primary" | "secondary" | null;
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
  setTimelineHeight: (height: number) => void;
  setActiveDimension: (dimension: DimensionKey) => void;
  setLifecyclePhase: (phase: string) => void;
  setTimelineCursor: (cursor: TimelineCursor) => void;
  setTimelineCurrentDay: (day: number) => void;
  setTimelineIsPlaying: (playing: boolean) => void;
  setTimelinePlaybackSpeed: (speed: number) => void;
  setTimelineAutoPauseAtMilestones: (enabled: boolean) => void;
  setSelectedProjectId: (projectId: string) => void;
  setSelectedAssetPath: (path: string[]) => void;
  setDualViewPrimary: (content: { type: string; id?: string; label: string } | null) => void;
  setDualViewSecondary: (content: { type: string; id?: string; label: string } | null) => void;
  setDualViewActiveSide: (side: "primary" | "secondary" | null) => void;
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
      timelineHeight: 320, // Default expanded height (matches --timeline-height-expanded)
      activeDimension: "time",
      lifecyclePhase: "Build",
      timelineCursor: {
        day: 156,
        label: "Week 24 • Critical Path",
        isoDate: "2025-06-05",
      },
      timelineCurrentDay: 156,
      timelineIsPlaying: false,
      timelinePlaybackSpeed: 1,
      timelineAutoPauseAtMilestones: false,
      selectedProjectId: "proj_livingtwin_campus",
      selectedAssetPath: ["Building A", "Level 03", "HVAC North", "AHU-07"],
      dualViewPrimary: null,
      dualViewSecondary: null,
      dualViewActiveSide: null,
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
      setTimelineHeight: (timelineHeight) =>
        set({
          timelineHeight: Math.min(Math.max(timelineHeight, 200), 600), // Min 200px, max 600px
        }),
      setActiveDimension: (activeDimension) => set({ activeDimension }),
      setLifecyclePhase: (lifecyclePhase) => set({ lifecyclePhase }),
      setTimelineCursor: (timelineCursor) => set({ timelineCursor }),
      setTimelineCurrentDay: (timelineCurrentDay) => set({ timelineCurrentDay }),
      setTimelineIsPlaying: (timelineIsPlaying) => set({ timelineIsPlaying }),
      setTimelinePlaybackSpeed: (timelinePlaybackSpeed) => set({ timelinePlaybackSpeed }),
      setTimelineAutoPauseAtMilestones: (timelineAutoPauseAtMilestones) => set({ timelineAutoPauseAtMilestones }),
      setSelectedProjectId: (selectedProjectId) => set({ selectedProjectId }),
      setSelectedAssetPath: (selectedAssetPath) => set({ selectedAssetPath }),
      setDualViewPrimary: (dualViewPrimary) => set({ dualViewPrimary }),
      setDualViewSecondary: (dualViewSecondary) => set({ dualViewSecondary }),
      setDualViewActiveSide: (dualViewActiveSide) => set({ dualViewActiveSide }),
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
        timelineHeight: state.timelineHeight,
        selectedProjectId: state.selectedProjectId,
        selectedAssetPath: state.selectedAssetPath,
        dualViewPrimary: state.dualViewPrimary,
        dualViewSecondary: state.dualViewSecondary,
        dualViewActiveSide: state.dualViewActiveSide,
      }),
    },
  ),
);

