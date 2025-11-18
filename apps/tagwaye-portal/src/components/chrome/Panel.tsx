"use client";

import * as Tabs from "@radix-ui/react-tabs";
import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import { useLayoutStore } from "@/state/layout-store";
import { BrowseDrawers } from "@/components/panel/BrowseDrawers";
import { MonitorDrawers } from "@/components/panel/MonitorDrawers";
import { AnalyzeDrawers } from "@/components/panel/AnalyzeDrawers";
import { PanelHeader } from "@/components/panel/PanelHeader";
import {
  getContextConfig,
  detectContextFromRoute,
} from "@/components/panel/contexts/configs";
import {
  getContextState,
  saveActivePane,
  saveOpenDrawers,
  saveScrollPosition,
  restoreScrollPosition,
} from "@/components/panel/contexts/store";
import type { PanelContext } from "@/components/panel/contexts/types";
import { getPanelSpringConfig } from "@/utils/animations";
import { useThrottledCallback } from "@/hooks/useThrottle";

export function Panel() {
  const {
    panelOpen,
    panelWidth,
    setPanelWidth,
    setPanelOpen,
    activePanelPane,
    setActivePanelPane,
  } = useLayoutStore();
  const dragRef = useRef<HTMLDivElement | null>(null);

  // Detect current context (defaults to asset-manager for now)
  const [currentContext, setCurrentContext] = useState<PanelContext>(
    () => detectContextFromRoute() as PanelContext,
  );

  // Get context configuration
  const contextConfig = useMemo(
    () => getContextConfig(currentContext),
    [currentContext],
  );

  // Restore context state on mount or context change
  useEffect(() => {
    const savedState = getContextState(currentContext);
    if (savedState?.activePane) {
      setActivePanelPane(savedState.activePane as typeof activePanelPane);
    } else {
      // Use default pane from config
      setActivePanelPane(contextConfig.defaultPane as typeof activePanelPane);
    }
  }, [currentContext, contextConfig.defaultPane, setActivePanelPane]);

  // Save active pane when it changes
  useEffect(() => {
    if (panelOpen && activePanelPane) {
      saveActivePane(currentContext, activePanelPane);
    }
  }, [currentContext, activePanelPane, panelOpen]);

  // Throttle resize handler to 16ms for 60fps
  const throttledSetWidth = useThrottledCallback(
    (newWidth: number) => {
      setPanelWidth(newWidth);
    },
    16, // 60fps = 16.67ms, using 16ms
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const startX = event.clientX;
      const startWidth = panelWidth;

      const handleMove = (moveEvent: PointerEvent) => {
        const delta = startX - moveEvent.clientX;
        const newWidth = Math.min(Math.max(startWidth + delta, 280), 600);
        throttledSetWidth(newWidth);
      };

      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [panelWidth, throttledSetWidth],
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "\\") {
        event.preventDefault();
        setPanelOpen(!panelOpen);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [panelOpen, setPanelOpen]);

  // Announce panel state changes to screen readers
  useEffect(() => {
    if (panelOpen) {
      // Panel opened - announcement handled by aria-hidden change
    }
  }, [panelOpen]);

  // Get default open drawers per pane (from context state or config defaults)
  const getDefaultDrawers = (pane: string) => {
    const savedState = getContextState(currentContext);
    if (savedState?.openDrawers?.[pane]) {
      return savedState.openDrawers[pane];
    }
    // Use default from config
    return contextConfig.defaultDrawers[pane] || [];
  };

  const handleDrawerChange = (pane: string, drawers: string[]) => {
    saveOpenDrawers(currentContext, pane, drawers);
  };

  // Handle scroll position restoration and saving
  const paneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handlePaneScroll = useCallback(
    (pane: string) => {
      const paneElement = paneRefs.current[pane];
      if (paneElement) {
        saveScrollPosition(currentContext, pane, paneElement.scrollTop);
      }
    },
    [currentContext],
  );

  // Restore scroll position when pane becomes active
  useEffect(() => {
    if (!panelOpen || !activePanelPane) return;

    const paneElement = paneRefs.current[activePanelPane];
    if (paneElement) {
      const savedPosition = restoreScrollPosition(
        currentContext,
        activePanelPane,
      );
      if (savedPosition !== null) {
        // Restore after a short delay to ensure DOM is ready
        setTimeout(() => {
          paneElement.scrollTop = savedPosition;
        }, 0);
      }
    }
  }, [currentContext, activePanelPane, panelOpen]);

  return (
    <motion.aside
      layout
      transition={getPanelSpringConfig()}
      className="tagwaye-panel"
      data-open={panelOpen}
      role="complementary"
      aria-label="Asset management panel"
      aria-hidden={!panelOpen}
      style={{ width: panelOpen ? panelWidth : 0 }}
    >
      {panelOpen && (
        <>
          {/* Panel Header (for Builder contexts) */}
          {contextConfig.showHeader && (
            <PanelHeader
              config={contextConfig}
              onClose={() => setPanelOpen(false)}
            />
          )}

          {/* Resize Handle */}
          <div
            ref={dragRef}
            className="absolute left-0 top-0 h-full cursor-ew-resize"
            style={{
              width: "4px",
              background: "transparent",
            }}
            onPointerDown={onPointerDown}
            onDoubleClick={() => setPanelWidth(360)}
            role="separator"
            aria-label="Resize panel width"
            aria-orientation="vertical"
            aria-valuemin={280}
            aria-valuemax={600}
            aria-valuenow={panelWidth}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                setPanelWidth(Math.max(panelWidth - 10, 280));
              } else if (e.key === "ArrowRight") {
                setPanelWidth(Math.min(panelWidth + 10, 600));
              } else if (e.key === "Home") {
                setPanelWidth(280);
              } else if (e.key === "End") {
                setPanelWidth(600);
              }
            }}
          />

          <Tabs.Root
            value={activePanelPane}
            onValueChange={(value) =>
              setActivePanelPane(value as typeof activePanelPane)
            }
            className="flex h-full flex-col"
            aria-label="Panel panes"
          >
            {/* Pane Tabs */}
            <Tabs.List
              className="flex items-center gap-1 border-b"
              style={{
                height: "44px",
                borderColor: "var(--color-border)",
                background: "var(--color-bg-secondary)",
                padding: "0 var(--space-md)",
              }}
              role="tablist"
              aria-label="Panel tabs"
            >
              {contextConfig.panes.map((pane) => {
                const isActive = activePanelPane === pane.value;
                return (
                  <Tabs.Trigger
                    key={pane.value}
                    value={pane.value}
                    className="relative rounded-md px-4 transition-colors button-hover"
                    style={{
                      height: "44px",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: isActive ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
                      color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                      background: "transparent",
                    }}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${pane.value}-content`}
                    id={`panel-${pane.value}-tab`}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "var(--color-bg-tertiary)";
                        e.currentTarget.style.color = "var(--color-text-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--color-text-secondary)";
                      }
                    }}
                  >
                    {pane.label}
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-0 right-0"
                        style={{
                          height: "2px",
                          background: "var(--color-accent)",
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>

            {/* Render panes based on context */}
            {/* Asset Manager panes (current default) */}
            {currentContext === "asset-manager" && (
              <>
                <Tabs.Content
                  value="browse"
                  className="flex-1 overflow-y-auto"
                  style={{ padding: "var(--space-md)" }}
                  role="tabpanel"
                  id="panel-browse-content"
                  aria-labelledby="panel-browse-tab"
                  ref={(el) => {
                    paneRefs.current["browse"] = el;
                  }}
                  onScroll={() => handlePaneScroll("browse")}
                >
                  <Accordion.Root
                    type="multiple"
                    defaultValue={getDefaultDrawers("browse")}
                    onValueChange={(value) =>
                      handleDrawerChange("browse", value)
                    }
                    className="space-y-2"
                  >
                    <BrowseDrawers />
                  </Accordion.Root>
                </Tabs.Content>

                <Tabs.Content
                  value="monitor"
                  className="flex-1 overflow-y-auto"
                  style={{ padding: "var(--space-md)" }}
                  role="tabpanel"
                  id="panel-monitor-content"
                  aria-labelledby="panel-monitor-tab"
                  ref={(el) => {
                    paneRefs.current["monitor"] = el;
                  }}
                  onScroll={() => handlePaneScroll("monitor")}
                >
                  <Accordion.Root
                    type="multiple"
                    defaultValue={getDefaultDrawers("monitor")}
                    onValueChange={(value) =>
                      handleDrawerChange("monitor", value)
                    }
                    className="space-y-2"
                  >
                    <MonitorDrawers />
                  </Accordion.Root>
                </Tabs.Content>

                <Tabs.Content
                  value="analyze"
                  className="flex-1 overflow-y-auto"
                  style={{ padding: "var(--space-md)" }}
                  role="tabpanel"
                  id="panel-analyze-content"
                  aria-labelledby="panel-analyze-tab"
                  ref={(el) => {
                    paneRefs.current["analyze"] = el;
                  }}
                  onScroll={() => handlePaneScroll("analyze")}
                >
                  <Accordion.Root
                    type="multiple"
                    defaultValue={getDefaultDrawers("analyze")}
                    onValueChange={(value) =>
                      handleDrawerChange("analyze", value)
                    }
                    className="space-y-2"
                  >
                    <AnalyzeDrawers />
                  </Accordion.Root>
                </Tabs.Content>
              </>
            )}

            {/* Other contexts would render their own pane content here */}
            {/* For now, we only implement Asset Manager context */}
          </Tabs.Root>
        </>
      )}
    </motion.aside>
  );
}
