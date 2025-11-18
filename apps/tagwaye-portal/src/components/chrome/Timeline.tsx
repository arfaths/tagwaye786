"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import {
  lifecyclePhases,
  mockKpis,
  timelinePoints,
  fetchTimelineSnapshot,
} from "@/data/mockProject";
import { VisualizationCanvas } from "@/components/timeline/VisualizationCanvas";
import { KPIPanel } from "@/components/timeline/KPIPanel";
import { Scrubber } from "@/components/timeline/Scrubber";
import { useLayoutStore } from "@/state/layout-store";
import type { DimensionKey } from "@/state/layout-store";
import { useEffect, useMemo } from "react";
import {
  LuLightbulb,
  LuClipboardList,
  LuPenTool,
  LuHammer,
  LuCheckCircle,
  LuSettings,
  LuRefreshCw,
  LuClock,
  LuDollarSign,
  LuZap,
  LuBox,
  LuShield,
  LuTrendingUp,
  LuTrendingDown,
} from "lucide-react";
import { getDimensionColor } from "@/utils/design-tokens";

const lifecyclePhaseIcons = {
  Plan: LuLightbulb,
  Program: LuClipboardList,
  Design: LuPenTool,
  Build: LuHammer,
  Commission: LuCheckCircle,
  Operate: LuSettings,
  Renew: LuRefreshCw,
};

// Dimension pills with colors from design tokens
const getDimensionPills = (): {
  key: DimensionKey;
  label: string;
  icon: typeof LuClock;
  color: string;
  kpiPreview?: (kpis: typeof mockKpis[DimensionKey]) => string;
}[] => [
  {
    key: "time",
    label: "4D Time",
    icon: LuClock,
    color: getDimensionColor("time"),
    kpiPreview: (kpis) => kpis.scheduleVariance || "-3 days",
  },
  {
    key: "cost",
    label: "5D Cost",
    icon: LuDollarSign,
    color: getDimensionColor("cost"),
    kpiPreview: (kpis) => kpis.budget || "+$45K",
  },
  {
    key: "energy",
    label: "6D Energy",
    icon: LuZap,
    color: getDimensionColor("energy"),
    kpiPreview: (kpis) => kpis.energyVariance || "12% under",
  },
  {
    key: "assets",
    label: "7D Assets",
    icon: LuBox,
    color: getDimensionColor("assets"),
  },
  {
    key: "safety",
    label: "8D Safety",
    icon: LuShield,
    color: getDimensionColor("safety"),
    kpiPreview: (kpis) => kpis.safetyIncidents || "0 incidents",
  },
];

export function Timeline() {
  const timelineVisible = useLayoutStore((state) => state.timelineVisible);
  const timelineExpanded = useLayoutStore((state) => state.timelineExpanded);
  const timelineHeight = useLayoutStore((state) => state.timelineHeight);
  const setTimelineExpanded = useLayoutStore(
    (state) => state.setTimelineExpanded,
  );
  const setTimelineHeight = useLayoutStore(
    (state) => state.setTimelineHeight,
  );
  const activeDimension = useLayoutStore((state) => state.activeDimension);
  const setActiveDimension = useLayoutStore(
    (state) => state.setActiveDimension,
  );
  const timelineCursor = useLayoutStore((state) => state.timelineCursor);
  const timelineCurrentDay = useLayoutStore((state) => state.timelineCurrentDay);
  const setTimelineCurrentDay = useLayoutStore(
    (state) => state.setTimelineCurrentDay,
  );
  const setTimelineIsPlaying = useLayoutStore(
    (state) => state.setTimelineIsPlaying,
  );
  const lifecyclePhase = useLayoutStore((state) => state.lifecyclePhase);
  const setTimelineCursor = useLayoutStore(
    (state) => state.setTimelineCursor,
  );
  const setLifecyclePhase = useLayoutStore(
    (state) => state.setLifecyclePhase,
  );
  const selectedProjectId = useLayoutStore(
    (state) => state.selectedProjectId,
  );

  const { data: snapshot, isLoading } = useQuery({
    queryKey: ["timeline-snapshot", selectedProjectId],
    queryFn: () => fetchTimelineSnapshot(selectedProjectId),
  });

  const effectiveSnapshot =
    snapshot ??
    ({
      projectId: selectedProjectId,
      phases: lifecyclePhases,
      points: timelinePoints,
      kpis: mockKpis,
    } as const);

  // Calculate min and max days from points
  const minDay = useMemo(() => {
    if (effectiveSnapshot.points.length === 0) return 1;
    return Math.min(...effectiveSnapshot.points.map((p) => p.day));
  }, [effectiveSnapshot.points]);

  const maxDay = useMemo(() => {
    if (effectiveSnapshot.points.length === 0) return 365;
    return Math.max(...effectiveSnapshot.points.map((p) => p.day));
  }, [effectiveSnapshot.points]);

  // Update cursor when day changes
  const handleDayChange = (day: number) => {
    setTimelineCurrentDay(day);
    const point = effectiveSnapshot.points.find(
      (p) => p.day === day || Math.abs(p.day - day) < 5,
    );
    if (point) {
      const formatted = new Date(point.isoDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      setTimelineCursor({
        day: point.day,
        label: `${formatted} • ${point.lifecycle}`,
        isoDate: point.isoDate,
      });
      setLifecyclePhase(point.lifecycle);
    } else {
      // Fallback: calculate date from day
      const startDate = new Date("2025-01-01");
      const date = new Date(startDate);
      date.setDate(date.getDate() + day - 1);
      const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      setTimelineCursor({
        day,
        label: formatted,
        isoDate: date.toISOString().split("T")[0],
      });
    }
  };

  // Keyboard shortcut: Shift+Arrow Up/Down to adjust timeline height
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!timelineExpanded) return; // Only work when expanded
      
      if (event.shiftKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        event.preventDefault();
        const step = 20; // 20px increments
        const currentHeight = timelineHeight;
        
        if (event.key === "ArrowUp") {
          setTimelineHeight(Math.max(currentHeight - step, 200)); // Min 200px
        } else {
          setTimelineHeight(Math.min(currentHeight + step, 600)); // Max 600px
        }
      }
    };
    
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [timelineExpanded, timelineHeight, setTimelineHeight]);

  useEffect(() => {
    if (!snapshot?.points?.length) return;
    const currentPoint = snapshot.points[snapshot.points.length - 1];
    const formatted = new Date(currentPoint.isoDate).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric" },
    );
    const nextCursor = {
      day: currentPoint.day,
      label: `${formatted} • ${currentPoint.lifecycle}`,
      isoDate: currentPoint.isoDate,
    };
    if (timelineCursor.isoDate !== nextCursor.isoDate) {
      setTimelineCursor(nextCursor);
      setTimelineCurrentDay(currentPoint.day);
    }
    setLifecyclePhase(currentPoint.lifecycle);
  }, [
    snapshot,
    setLifecyclePhase,
    setTimelineCursor,
    setTimelineCurrentDay,
    timelineCursor.isoDate,
  ]);

  if (!timelineVisible) {
    return null;
  }

  const dimensionPills = useMemo(() => getDimensionPills(), []);
  
  const activeDimensionLabel =
    dimensionPills.find((pill) => pill.key === activeDimension)?.label ?? "";

  return (
    <motion.section
      layout
      transition={getTimelineSpringConfig()}
      className={clsx(
        "tagwaye-timeline",
        timelineExpanded ? "is-expanded" : "is-collapsed",
      )}
      style={
        timelineExpanded
          ? {
              height: `${timelineHeight}px`,
            }
          : undefined
      }
      role="region"
      aria-label="Timeline controls and visualization"
      aria-expanded={timelineExpanded}
    >
      {timelineExpanded ? (
        <>
          <div className="lifecycle-bar" role="navigation" aria-label="Project lifecycle phases">
            {effectiveSnapshot.phases.map((phase) => {
              const PhaseIcon =
                lifecyclePhaseIcons[
                  phase.key as keyof typeof lifecyclePhaseIcons
                ];
              const isActive = lifecyclePhase === phase.key;
              const isCurrent =
                timelineCurrentDay >= phase.startDay &&
                timelineCurrentDay <= phase.endDay;

              return (
                <button
                  key={phase.key}
                  type="button"
                  className={clsx("phase", isActive && "phase--active")}
                  onClick={() => {
                    // Jump to phase start, or end if clicking active phase
                    const targetDay = isActive ? phase.endDay : phase.startDay;
                    handleDayChange(targetDay);
                  }}
                  aria-label={`${phase.key} phase${isActive ? ", currently active" : ""}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {PhaseIcon && (
                    <PhaseIcon size={14} className="phase-icon" aria-hidden="true" />
                  )}
                  <span>{phase.key}</span>
                  {isCurrent && (
                    <span className="phase-indicator" aria-hidden="true">
                      ●
                    </span>
                  )}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setTimelineExpanded(false)}
              className="toggle"
              aria-label="Collapse timeline"
            >
              Collapse
            </button>
          </div>

          <div className="dimension-pills" role="tablist" aria-label="Timeline dimensions">
            {dimensionPills.map((pill) => {
              const isActive = pill.key === activeDimension;
              const Icon = pill.icon;
              const kpiValue = isActive && pill.kpiPreview
                ? pill.kpiPreview(effectiveSnapshot.kpis[pill.key])
                : null;
              // Determine trend from KPI value (simplified - in real app would come from data)
              const trend = kpiValue?.startsWith("-") || kpiValue?.startsWith("+")
                ? (kpiValue.startsWith("-") ? "positive" : "negative")
                : null;

              return (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => setActiveDimension(pill.key)}
                  className={clsx("dimension-pill", isActive && "dimension-pill--active")}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="timeline-visualization"
                  aria-label={`View ${pill.label} dimension${isActive ? ", currently selected" : ""}`}
                  style={
                    isActive
                      ? {
                          backgroundColor: pill.color,
                          borderColor: pill.color,
                        }
                      : undefined
                  }
                >
                  <Icon size={14} className="dimension-icon" aria-hidden="true" />
                  <span className="dimension-label">{pill.label}</span>
                  {isActive && kpiValue && (
                    <span className="dimension-kpi-preview">{kpiValue}</span>
                  )}
                  {isActive && trend && (
                    <span className="dimension-trend" aria-hidden="true">
                      {trend === "positive" ? (
                        <LuTrendingUp size={12} />
                      ) : (
                        <LuTrendingDown size={12} />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="scrubber">
            <Scrubber
              points={effectiveSnapshot.points}
              currentDay={timelineCurrentDay}
              onDayChange={handleDayChange}
              minDay={minDay}
              maxDay={maxDay}
            />
          </div>

          <div
            className="visualization"
            id="timeline-visualization"
            role="tabpanel"
            aria-labelledby={`dimension-${activeDimension}-tab`}
            aria-label={`${activeDimensionLabel} visualization`}
          >
            <VisualizationCanvas
              dimension={activeDimension}
              data={effectiveSnapshot.points}
              currentDay={timelineCurrentDay}
              minDay={minDay}
              maxDay={maxDay}
            />
            <KPIPanel
              dimension={activeDimension}
              kpis={effectiveSnapshot.kpis[activeDimension]}
              currentDay={timelineCurrentDay}
            />
          </div>
          {isLoading && (
            <div
              className="text-xs uppercase tracking-wide text-white/40 loading-pulse"
              style={{ fontSize: "var(--font-size-xs)", letterSpacing: "var(--letter-spacing-wide)" }}
              role="status"
              aria-live="polite"
            >
              Syncing timeline…
            </div>
          )}
        </>
      ) : (
        <div className="timeline-collapsed-row">
          <div className="collapsed-context">
            <div className="collapsed-phase">
              <span className="label">Phase</span>
              <span className="value">{lifecyclePhase}</span>
            </div>
            <div className="collapsed-phase">
              <span className="label">Cursor</span>
              <span className="value">
                Day {timelineCursor.day} • {timelineCursor.label}
              </span>
            </div>
            <div className="collapsed-phase">
              <span className="label">Dimension</span>
              <span className="value">{activeDimensionLabel}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTimelineExpanded(true)}
            className="collapsed-toggle"
            aria-label="Expand timeline to view full controls and visualization"
          >
            Expand timeline
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </motion.section>
  );
}
