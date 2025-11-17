"use client";

import * as Tabs from "@radix-ui/react-tabs";
import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  ChevronRight,
  Cpu,
  Gauge,
  ThermometerSun,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useLayoutStore } from "@/state/layout-store";

const panes = [
  { value: "browse" as const, label: "Browse" },
  { value: "monitor" as const, label: "Monitor" },
  { value: "analyze" as const, label: "Analyze" },
];

const monitors = [
  {
    label: "Air Quality",
    value: "42 µg/m³ PM2.5",
    trend: "-12% vs yesterday",
    icon: ThermometerSun,
  },
  {
    label: "Demand Load",
    value: "3.7 MW",
    trend: "+4% vs plan",
    icon: Gauge,
  },
  {
    label: "Telemetry",
    value: "18 sensors in alert",
    trend: "See anomalies",
    icon: Cpu,
  },
];

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

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const startX = event.clientX;
      const startWidth = panelWidth;

      const handleMove = (moveEvent: PointerEvent) => {
        const delta = startX - moveEvent.clientX;
        setPanelWidth(startWidth + delta);
      };

      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [panelWidth, setPanelWidth],
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

  return (
    <motion.aside
      layout
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      className="tagwaye-panel"
      data-open={panelOpen}
      aria-hidden={!panelOpen}
      style={{ width: panelOpen ? panelWidth : 0 }}
    >
      {panelOpen && (
        <>
          <div
            ref={dragRef}
            className="absolute left-0 top-0 h-full w-1 cursor-ew-resize bg-transparent"
            onPointerDown={onPointerDown}
          />
          <Tabs.Root
            value={activePanelPane}
            onValueChange={(value) =>
              setActivePanelPane(value as typeof activePanelPane)
            }
            className="flex h-full flex-col"
          >
            <Tabs.List className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              {panes.map((pane) => (
                <Tabs.Trigger
                  key={pane.value}
                  value={pane.value}
                  className="rounded-full border border-transparent px-3 py-1.5 text-xs uppercase tracking-[0.25em] text-white/60 data-[state=active]:border-white/20 data-[state=active]:text-white"
                >
                  {pane.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content
              value="browse"
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm text-white"
            >
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Asset Hierarchy
                </p>
                {["Building A", "Level 03", "HVAC North", "AHU-07"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-xl border border-white/5 px-3 py-2"
                    >
                      <span>{item}</span>
                      {index === 3 ? (
                        <span className="text-xs text-emerald-300">Live</span>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-white/40" />
                      )}
                    </div>
                  ),
                )}
              </div>
            </Tabs.Content>

            <Tabs.Content
              value="monitor"
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {monitors.map((monitor) => (
                <div
                  key={monitor.label}
                  className="rounded-2xl border border-white/5 bg-white/5 p-4 text-white"
                >
                  <div className="flex items-center gap-3">
                    <monitor.icon className="h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                        {monitor.label}
                      </p>
                      <p className="text-xl font-semibold">{monitor.value}</p>
                      <p className="text-xs text-white/60">{monitor.trend}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Tabs.Content>

            <Tabs.Content
              value="analyze"
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              <Accordion.Root
                type="multiple"
                className="space-y-2 text-white"
                defaultValue={["intelligence"]}
              >
                <Accordion.Item
                  value="intelligence"
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold">
                    AI Intelligence
                    <Activity className="h-4 w-4 text-emerald-300" />
                  </Accordion.Trigger>
                  <Accordion.Content className="space-y-2 px-4 pb-4 text-sm text-white/70">
                    <p>Recommendation: Slow HVAC ramp by 8% for cost parity.</p>
                    <button
                      type="button"
                      className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs text-emerald-200"
                    >
                      View Rationale
                    </button>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item
                  value="telemetry"
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold">
                    Telemetry Snapshots
                    <BarChart3 className="h-4 w-4 text-sky-300" />
                  </Accordion.Trigger>
                  <Accordion.Content className="space-y-2 px-4 pb-4 text-sm text-white/70">
                    <p>Flow: 18.2 m³/s • Duct pressure trending stable.</p>
                    <p>Vibration signature within tolerance bands.</p>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </Tabs.Content>
          </Tabs.Root>
        </>
      )}
    </motion.aside>
  );
}

