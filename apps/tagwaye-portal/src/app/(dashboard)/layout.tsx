"use client";

import type { CSSProperties, ReactNode } from "react";
import { Header } from "@/components/chrome/Header";
import { Sidebar } from "@/components/chrome/Sidebar";
import { Panel } from "@/components/chrome/Panel";
import { Timeline } from "@/components/chrome/Timeline";
import { Footer } from "@/components/chrome/Footer";
import { KeyboardShortcutsHelp } from "@/components/shared/KeyboardShortcutsHelp";
import { useLayoutStore } from "@/state/layout-store";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const {
    sidebarPinned,
    sidebarExpanded,
    panelOpen,
    panelWidth,
    timelineVisible,
    timelineExpanded,
    timelineHeight: storeTimelineHeight,
  } = useLayoutStore();

  const sidebarWidth = sidebarPinned || sidebarExpanded ? 280 : 64;
  const resolvedPanelWidth = panelOpen ? panelWidth : 0;
  const timelineHeight = timelineVisible
    ? timelineExpanded
      ? storeTimelineHeight
      : 48
    : 0;

  const style = {
    "--sidebar-width": `${sidebarWidth}px`,
    "--panel-width": `${resolvedPanelWidth}px`,
    "--timeline-height": `${timelineHeight}px`,
  } as CSSProperties;

  return (
    <div className="tagwaye-shell" style={style}>
      <Header />
      <Sidebar />
      <main className="tagwaye-main">{children}</main>
      <Panel />
      <Timeline />
      <Footer />
      <KeyboardShortcutsHelp />
    </div>
  );
}

