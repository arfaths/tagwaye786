"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Pause, Play, Rewind, FastForward, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import {
  lifecyclePhases,
  mockKpis,
  timelinePoints,
  fetchTimelineSnapshot,
} from "@/data/mockProject";
import { TimelineChart } from "@/components/timeline/TimelineChart";
import { useLayoutStore } from "@/state/layout-store";
import type { DimensionKey } from "@/state/layout-store";
import { useEffect } from "react";

const dimensionPills: { key: DimensionKey; label: string }[] = [
  { key: "time", label: "4D Time" },
  { key: "cost", label: "5D Cost" },
  { key: "energy", label: "6D Energy" },
  { key: "assets", label: "7D Assets" },
  { key: "safety", label: "8D Safety" },
];

export function Timeline() {
  const timelineVisible = useLayoutStore((state) => state.timelineVisible);
  const timelineExpanded = useLayoutStore((state) => state.timelineExpanded);
  const setTimelineExpanded = useLayoutStore(
    (state) => state.setTimelineExpanded,
  );
  const activeDimension = useLayoutStore((state) => state.activeDimension);
  const setActiveDimension = useLayoutStore(
    (state) => state.setActiveDimension,
  );
  const timelineCursor = useLayoutStore((state) => state.timelineCursor);
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
    }
    setLifecyclePhase(currentPoint.lifecycle);
  }, [
    snapshot,
    setLifecyclePhase,
    setTimelineCursor,
    timelineCursor.isoDate,
  ]);

  if (!timelineVisible) {
    return null;
  }

  const activeDimensionLabel =
    dimensionPills.find((pill) => pill.key === activeDimension)?.label ?? "";

  return (
    <motion.section
      layout
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      className={clsx(
        "tagwaye-timeline",
        timelineExpanded ? "is-expanded" : "is-collapsed",
      )}
    >
      {timelineExpanded ? (
        <>
          <div className="lifecycle-bar">
            {effectiveSnapshot.phases.map((phase) => (
              <div key={phase.key} className="phase">
                <span>{phase.key}</span>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setTimelineExpanded(false)}
              className="toggle"
            >
              Collapse
            </button>
          </div>

          <div className="dimension-pills">
            {dimensionPills.map((pill) => (
              <button
                key={pill.key}
                type="button"
                onClick={() => setActiveDimension(pill.key)}
                className={pill.key === activeDimension ? "active" : ""}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <div className="scrubber">
            <div className="controls">
              <button type="button" aria-label="Previous milestone">
                <Rewind className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Play timeline">
                <Play className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Pause timeline">
                <Pause className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Next milestone">
                <FastForward className="h-4 w-4" />
              </button>
            </div>
            <div className="scrubber-track" aria-label="Timeline scrubber">
              <div className="thumb" style={{ width: "68%" }}>
                Day {timelineCursor.day} • {timelineCursor.label}
              </div>
            </div>
          </div>

          <div className="visualization">
            <TimelineChart
              dimension={activeDimension}
              data={effectiveSnapshot.points}
            />
          </div>

          <div className="kpi-rail">
            {Object.entries(effectiveSnapshot.kpis[activeDimension]).map(
              ([key, value]) => (
                <div key={key} className="kpi-card">
                  <p>{key}</p>
                  <span>{value}</span>
                </div>
              ),
            )}
          </div>
          {isLoading && (
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">
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
          >
            Expand timeline
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.section>
  );
}

