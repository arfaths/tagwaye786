"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Clock10,
  Eye,
  Layout,
  Moon,
  Sun,
} from "lucide-react";
import clsx from "clsx";
import { fetchSystemStatus } from "@/data/mockProject";
import { useLayoutStore } from "@/state/layout-store";
import { Dropdown, type DropdownItem } from "@/components/footer/Dropdown";
import { Tooltip } from "@/components/footer/Tooltip";
import { useWebSocket } from "@/hooks/useWebSocket";

// Map current layout modes to spec layout modes
const layoutModeMap: Record<
  "balanced" | "focus" | "analysis" | "presentation",
  "normal" | "compact" | "expansive" | "custom"
> = {
  balanced: "normal",
  focus: "compact",
  analysis: "expansive",
  presentation: "expansive",
};

const reverseLayoutModeMap: Record<
  "normal" | "compact" | "expansive" | "custom",
  "balanced" | "focus" | "analysis" | "presentation"
> = {
  normal: "balanced",
  compact: "focus",
  expansive: "analysis",
  custom: "balanced", // Default fallback
};

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
  const sidebarPinned = useLayoutStore((state) => state.sidebarPinned);
  const panelWidth = useLayoutStore((state) => state.panelWidth);
  const setSelectedAssetPath = useLayoutStore(
    (state) => state.setSelectedAssetPath,
  );

  // Use WebSocket for real-time updates, fallback to React Query polling
  const {
    status: wsStatus,
    isConnected: wsConnected,
    error: wsError,
  } = useWebSocket({
    projectId: selectedProjectId,
    enabled: !!selectedProjectId,
  });

  // Fallback to React Query if WebSocket is not connected
  const { data: systemStatus } = useQuery({
    queryKey: ["system-status", selectedProjectId],
    queryFn: () => fetchSystemStatus(selectedProjectId),
    refetchInterval: wsConnected ? false : 20000, // Disable polling if WebSocket is connected
    enabled: !!selectedProjectId,
  });

  // Use WebSocket status if available, otherwise fall back to React Query
  const effectiveStatus = wsStatus || systemStatus;

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(interval);
  }, []);

  const lastSyncLabel = useMemo(() => {
    if (!effectiveStatus) return "Syncing…";
    const lastSync = new Date(effectiveStatus.lastSyncIso).getTime();
    const deltaMs = now - lastSync;
    if (deltaMs < 30_000) return "just now";
    if (deltaMs < 120_000) return "1m ago";
    const minutes = Math.round(deltaMs / 60_000);
    return `${minutes}m ago`;
  }, [now, effectiveStatus]);

  const lastSyncAbsolute = useMemo(() => {
    if (!effectiveStatus) return null;
    const date = new Date(effectiveStatus.lastSyncIso);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }, [effectiveStatus]);

  const connectionStatus = useMemo(() => {
    if (!effectiveStatus) return "syncing";
    return effectiveStatus.connection === "live" ? "live" : "syncing";
  }, [effectiveStatus]);

  const performanceColor = useMemo(() => {
    if (!effectiveStatus) return "var(--color-text-secondary)";
    const time = effectiveStatus.renderTimeMs;
    if (time < 50) return "var(--color-success)";
    if (time < 100) return "var(--color-warning)";
    return "var(--color-error)";
  }, [effectiveStatus]);

  // Detect custom layout mode
  const detectedLayoutMode = useMemo(() => {
    // Custom if:
    // - Sidebar is pinned (user modified default)
    // - Panel width is not standard (360px)
    if (sidebarPinned || panelWidth !== 360) {
      return "custom";
    }
    return layoutModeMap[layoutMode];
  }, [sidebarPinned, panelWidth, layoutMode]);

  const setSidebarPinned = useLayoutStore((state) => state.setSidebarPinned);
  const setPanelWidth = useLayoutStore((state) => state.setPanelWidth);

  const handleLayoutModeChange = (value: string) => {
    if (value === "custom") {
      // Keep current layout mode if custom
      return;
    }
    if (value === "reset") {
      // Reset to Normal: unpin sidebar, reset panel width
      setSidebarPinned(false);
      setPanelWidth(360);
      setLayoutMode("balanced"); // balanced maps to "normal"
      return;
    }
    const newMode = reverseLayoutModeMap[value as keyof typeof reverseLayoutModeMap];
    if (newMode) {
      setLayoutMode(newMode);
    }
  };

  const handleThemeCycle = () => {
    if (theme === "auto") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("auto");
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index < selectedAssetPath.length - 1) {
      setSelectedAssetPath(selectedAssetPath.slice(0, index + 1));
    }
  };

  useEffect(() => {
    if (theme === "auto") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  // View Mode dropdown items
  const viewModeItems: DropdownItem[] = [
    { value: "single", label: "Single" },
    { value: "dual", label: "Dual" },
  ];

  // Layout Mode dropdown items
  const layoutModeItems: DropdownItem[] = useMemo(() => {
    const baseItems: DropdownItem[] = [
      { value: "normal", label: "Normal", description: "Default layout" },
      { value: "compact", label: "Compact", description: "Minimal chrome" },
      { value: "expansive", label: "Expansive", description: "Maximum space" },
    ];

    if (detectedLayoutMode === "custom") {
      // When Custom is active, show "Reset to Normal" option instead
      return [
        { value: "reset", label: "Reset to Normal", description: "Restore default layout" },
        ...baseItems,
        { value: "custom", label: "Custom", description: "User-modified" },
      ];
    }

    return [
      ...baseItems,
      { value: "custom", label: "Custom", description: "User-modified" },
    ];
  }, [detectedLayoutMode]);

  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setSystemPrefersDark(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setSystemPrefersDark(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4" />;
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    // Auto: show icon based on system preference
    return systemPrefersDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  };

  return (
    <footer className="tagwaye-footer">
      <div className="footer-left">
        <Tooltip
          content={
            effectiveStatus
              ? `Last heartbeat: ${Math.round((now - new Date(effectiveStatus.lastSyncIso).getTime()) / 1000)} seconds ago${wsConnected ? " (WebSocket)" : " (Polling)"}`
              : "Connecting..."
          }
        >
          <div className="footer-status-item">
            <span
              className={clsx(
                "status-dot",
                connectionStatus === "live" && "status-dot-live",
                connectionStatus === "syncing" && "status-dot-syncing",
                connectionStatus === "offline" && "status-dot-offline",
              )}
            />
            <p>
              {connectionStatus === "live"
                ? "Live"
                : connectionStatus === "syncing"
                  ? "Syncing"
                  : "Offline"}
            </p>
          </div>
        </Tooltip>
        <span className="divider" />
        <Tooltip content={lastSyncAbsolute ? `Last synced: ${lastSyncAbsolute}${wsConnected ? " (WebSocket)" : ""}` : "Syncing..."}>
          <p>Synced {lastSyncLabel}</p>
        </Tooltip>
        <span className="divider" />
        <Tooltip
          content={
            effectiveStatus
              ? `Render: ${effectiveStatus.renderTimeMs}ms\nScene: ${Math.round(effectiveStatus.renderTimeMs * 0.66)}ms\nUI: ${Math.round(effectiveStatus.renderTimeMs * 0.25)}ms\nNetwork: ${Math.round(effectiveStatus.renderTimeMs * 0.09)}ms${wsConnected ? "\n(WebSocket)" : "\n(Polling)"}`
              : "No data"
          }
        >
          <p style={{ color: performanceColor, fontFamily: "var(--font-family-mono)" }}>
            {effectiveStatus ? `${effectiveStatus.renderTimeMs}ms` : "--"}
          </p>
        </Tooltip>
        <span className="divider" />
        <Tooltip
          content={
            effectiveStatus && effectiveStatus.activeCollaborators > 0
              ? `Active on ${selectedProjectId || "project"}:\n• ${effectiveStatus.activeCollaborators} user${effectiveStatus.activeCollaborators > 1 ? "s" : ""}${wsConnected ? "\n(WebSocket)" : "\n(Polling)"}`
              : "No active users"
          }
        >
          <p>
            {effectiveStatus && effectiveStatus.activeCollaborators > 0
              ? `${effectiveStatus.activeCollaborators} active`
              : "— active"}
          </p>
        </Tooltip>
      </div>

      <div className="footer-center">
        {selectedAssetPath.length > 0 ? (
          <div className="footer-breadcrumbs">
            {selectedAssetPath.map((segment, index) => (
              <span key={index} className="footer-breadcrumb-container">
                {index > 0 && (
                  <span className="footer-breadcrumb-separator">›</span>
                )}
                <button
                  type="button"
                  className={clsx(
                    "footer-breadcrumb-segment",
                    index === selectedAssetPath.length - 1 &&
                      "footer-breadcrumb-segment-current",
                  )}
                  onClick={() => handleBreadcrumbClick(index)}
                  disabled={index === selectedAssetPath.length - 1}
                  aria-label={`Navigate to ${segment}`}
                >
                  {segment}
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className="footer-breadcrumbs-empty">
            Select an asset to navigate
          </span>
        )}
      </div>

      <div className="footer-right">
        <button
          type="button"
          className={clsx(
            "footer-control-button",
            timelineVisible && "footer-control-button-active",
          )}
          onClick={() => setTimelineVisible(!timelineVisible)}
          aria-label="Toggle timeline"
        >
          <Clock10 className="h-4 w-4" />
          <span className="footer-control-label">Timeline</span>
        </button>
        <Dropdown
          items={viewModeItems}
          value={viewMode}
          onChange={setViewMode}
          icon={<Eye className="h-4 w-4" />}
          label={viewMode === "single" ? "Single" : "Dual"}
          aria-label="View mode"
        />
        <Dropdown
          items={layoutModeItems}
          value={detectedLayoutMode}
          onChange={handleLayoutModeChange}
          icon={<Layout className="h-4 w-4" />}
          label={
            detectedLayoutMode.charAt(0).toUpperCase() +
            detectedLayoutMode.slice(1)
          }
          aria-label="Layout mode"
        />
        <button
          type="button"
          className={clsx(
            "footer-theme-button",
            theme !== "auto" && "footer-theme-button-active",
          )}
          onClick={handleThemeCycle}
          aria-label={`Theme: ${theme}`}
          title={`Theme: ${theme === "auto" ? "Auto" : theme === "light" ? "Light" : "Dark"}`}
        >
          {getThemeIcon()}
        </button>
      </div>
    </footer>
  );
}

