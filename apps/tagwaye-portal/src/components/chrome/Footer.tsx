"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Clock10,
  LayoutGrid,
  Monitor,
  Moon,
  Sun,
  TvMinimal,
} from "lucide-react";
import clsx from "clsx";
import { fetchSystemStatus } from "@/data/mockProject";
import { useLayoutStore } from "@/state/layout-store";

const layoutModes = ["balanced", "focus", "analysis", "presentation"] as const;

export function Footer() {
  const timelineVisible = useLayoutStore((state) => state.timelineVisible);
  const setTimelineVisible = useLayoutStore(
    (state) => state.setTimelineVisible,
  );
  const viewMode = useLayoutStore((state) => state.viewMode);
  const setViewMode = useLayoutStore((state) => state.setViewMode);
  const layoutMode = useLayoutStore((state) => state.layoutMode);
  const setLayoutMode = useLayoutStore((state) => state.setLayoutMode);
  const theme = useLayoutStore((state) => state.theme);
  const setTheme = useLayoutStore((state) => state.setTheme);
  const selectedProjectId = useLayoutStore(
    (state) => state.selectedProjectId,
  );
  const selectedAssetPath = useLayoutStore(
    (state) => state.selectedAssetPath,
  );

  const { data: systemStatus } = useQuery({
    queryKey: ["system-status", selectedProjectId],
    queryFn: () => fetchSystemStatus(selectedProjectId),
    refetchInterval: 20000,
  });

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(interval);
  }, []);

  const lastSyncLabel = useMemo(() => {
    if (!systemStatus) return "Syncing…";
    const lastSync = new Date(systemStatus.lastSyncIso).getTime();
    const deltaMs = now - lastSync;
    if (deltaMs < 30_000) return "just now";
    if (deltaMs < 120_000) return "1m ago";
    const minutes = Math.round(deltaMs / 60_000);
    return `${minutes}m ago`;
  }, [now, systemStatus]);

  useEffect(() => {
    if (theme === "auto") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  return (
    <footer className="tagwaye-footer">
      <div className="footer-left">
        <span className="status-dot" />
        <p>{systemStatus?.connection === "live" ? "Live" : "Syncing"}</p>
        <span className="divider" />
        <p>Synced {lastSyncLabel}</p>
        <span className="divider" />
        <p>
          Render {systemStatus ? `${systemStatus.renderTimeMs}ms` : "--"}
        </p>
        <span className="divider" />
        <p>
          {systemStatus
            ? `${systemStatus.activeCollaborators} active`
            : "— active"}
        </p>
      </div>

      <div className="footer-center">
        {selectedAssetPath.length > 0
          ? selectedAssetPath.join(" \u203a ")
          : "Select an asset to navigate"}
      </div>

      <div className="footer-right">
        <button
          type="button"
          className={clsx("chip", timelineVisible && "chip-active")}
          onClick={() => setTimelineVisible(!timelineVisible)}
        >
          <Clock10 className="h-4 w-4" />
          Timeline
        </button>
        <button
          type="button"
          className={clsx("chip", viewMode === "single" && "chip-active")}
          onClick={() => setViewMode("single")}
        >
          <Monitor className="h-4 w-4" />
          Single
        </button>
        <button
          type="button"
          className={clsx("chip", viewMode === "dual" && "chip-active")}
          onClick={() => setViewMode("dual")}
        >
          <LayoutGrid className="h-4 w-4" />
          Dual
        </button>
        <select
          value={layoutMode}
          onChange={(event) =>
            setLayoutMode(event.target.value as (typeof layoutModes)[number])
          }
          className="chip select"
        >
          {layoutModes.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={clsx("chip", theme === "auto" && "chip-active")}
          onClick={() => setTheme("auto")}
        >
          <TvMinimal className="h-4 w-4" />
          Auto
        </button>
        <button
          type="button"
          className={clsx("chip", theme === "light" && "chip-active")}
          onClick={() => setTheme("light")}
        >
          <Sun className="h-4 w-4" />
          Light
        </button>
        <button
          type="button"
          className={clsx("chip", theme === "dark" && "chip-active")}
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-4 w-4" />
          Dark
        </button>
      </div>
    </footer>
  );
}

