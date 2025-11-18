"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  PauseCircle,
} from "lucide-react";
import { useLayoutStore } from "@/state/layout-store";
import type { TimelinePoint } from "@/data/mockProject";
import { Tooltip } from "@/components/shared/Tooltip";

interface ScrubberProps {
  points: TimelinePoint[];
  currentDay: number;
  onDayChange: (day: number) => void;
  minDay?: number;
  maxDay?: number;
}

const playbackSpeeds = [0.25, 0.5, 1, 2, 5, 10] as const;
type PlaybackSpeed = typeof playbackSpeeds[number];

interface Milestone {
  day: number;
  label: string;
  status: "upcoming" | "current" | "completed" | "missed";
}

export function Scrubber({
  points,
  currentDay,
  onDayChange,
  minDay = 1,
  maxDay = 365,
}: ScrubberProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const timelineIsPlaying = useLayoutStore((state) => state.timelineIsPlaying);
  const timelinePlaybackSpeed = useLayoutStore((state) => state.timelinePlaybackSpeed);
  const timelineAutoPauseAtMilestones = useLayoutStore(
    (state) => state.timelineAutoPauseAtMilestones,
  );
  const setTimelineIsPlaying = useLayoutStore((state) => state.setTimelineIsPlaying);
  const setTimelinePlaybackSpeed = useLayoutStore((state) => state.setTimelinePlaybackSpeed);
  const setTimelineAutoPauseAtMilestones = useLayoutStore(
    (state) => state.setTimelineAutoPauseAtMilestones,
  );
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  
  // Sync playback speed to store
  const playbackSpeed = playbackSpeeds.includes(timelinePlaybackSpeed as PlaybackSpeed)
    ? (timelinePlaybackSpeed as PlaybackSpeed)
    : 1;

  // Calculate milestones from points
  const milestones: Milestone[] = points.map((point, index) => {
    let status: Milestone["status"] = "upcoming";
    if (point.day === currentDay) {
      status = "current";
    } else if (point.day < currentDay) {
      status = "completed";
    } else if (point.day > currentDay + 5) {
      status = "missed";
    }
    return {
      day: point.day,
      label: point.lifecycle,
      status,
    };
  });

  // Find nearest milestone within threshold
  const findNearestMilestone = useCallback(
    (day: number, threshold: number = 5): Milestone | null => {
      let nearest: Milestone | null = null;
      let minDistance = threshold;

      for (const milestone of milestones) {
        const distance = Math.abs(milestone.day - day);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = milestone;
        }
      }

      return nearest;
    },
    [milestones],
  );

  // Snap to milestone if within threshold
  const snapToMilestone = useCallback(
    (day: number): number => {
      const nearest = findNearestMilestone(day, 5);
      return nearest ? nearest.day : day;
    },
    [findNearestMilestone],
  );

  // Convert day to percentage
  const dayToPercentage = useCallback(
    (day: number): number => {
      return ((day - minDay) / (maxDay - minDay)) * 100;
    },
    [minDay, maxDay],
  );

  // Convert percentage to day
  const percentageToDay = useCallback(
    (percentage: number): number => {
      return Math.round(minDay + (percentage / 100) * (maxDay - minDay));
    },
    [minDay, maxDay],
  );

  // Handle track click
  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current || isDragging) return;

      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const newDay = percentageToDay(percentage);
      const snappedDay = snapToMilestone(newDay);
      onDayChange(snappedDay);
    },
    [isDragging, percentageToDay, snapToMilestone, onDayChange],
  );

  // Handle thumb drag start
  const handleThumbMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        const x = moveEvent.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        const newDay = percentageToDay(percentage);
        onDayChange(newDay);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        // Snap on release
        const snappedDay = snapToMilestone(currentDay);
        if (snappedDay !== currentDay) {
          onDayChange(snappedDay);
        }
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [percentageToDay, snapToMilestone, currentDay, onDayChange],
  );

  // Handle track hover for tooltip
  const handleTrackMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current || isDragging) return;

      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setHoverPosition(percentageToDay(percentage));
    },
    [isDragging, percentageToDay],
  );

  const handleTrackMouseLeave = useCallback(() => {
    setHoverPosition(null);
  }, []);

  // Playback animation
  useEffect(() => {
    if (!timelineIsPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTimestampRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = timestamp - lastTimestampRef.current;
      const baseSpeed = 10; // Days per second at 1x
      const increment = (baseSpeed * playbackSpeed * deltaTime) / 1000;

      const newDay = Math.min(maxDay, currentDay + increment);
      onDayChange(newDay);

      // Check for auto-pause at milestones
      if (timelineAutoPauseAtMilestones) {
        const nearestMilestone = findNearestMilestone(newDay, 0.5); // 0.5 day threshold for auto-pause
        if (nearestMilestone && nearestMilestone.status === "current") {
          // Pause at milestone
          setTimelineIsPlaying(false);
          return;
        }
      }

      if (newDay >= maxDay) {
        setTimelineIsPlaying(false);
      } else {
        lastTimestampRef.current = timestamp;
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    timelineIsPlaying,
    playbackSpeed,
    currentDay,
    maxDay,
    onDayChange,
    setTimelineIsPlaying,
    timelineAutoPauseAtMilestones,
    findNearestMilestone,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space: Play/Pause
      if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        setTimelineIsPlaying(!timelineIsPlaying);
      }
      // Arrow keys: Step
      if (e.key === "ArrowLeft" && !e.shiftKey) {
        e.preventDefault();
        onDayChange(Math.max(minDay, currentDay - 1));
      }
      if (e.key === "ArrowRight" && !e.shiftKey) {
        e.preventDefault();
        onDayChange(Math.min(maxDay, currentDay + 1));
      }
      // Shift+Arrow: Jump 10 days
      if (e.key === "ArrowLeft" && e.shiftKey) {
        e.preventDefault();
        onDayChange(Math.max(minDay, currentDay - 10));
      }
      if (e.key === "ArrowRight" && e.shiftKey) {
        e.preventDefault();
        onDayChange(Math.min(maxDay, currentDay + 10));
      }
      // [ and ]: Speed control
      if (e.key === "[" || e.key === "]") {
        e.preventDefault();
        const currentIndex = playbackSpeeds.indexOf(playbackSpeed);
        if (e.key === "[") {
          const newIndex = Math.max(0, currentIndex - 1);
          setTimelinePlaybackSpeed(playbackSpeeds[newIndex]);
        } else {
          const newIndex = Math.min(
            playbackSpeeds.length - 1,
            currentIndex + 1,
          );
          setTimelinePlaybackSpeed(playbackSpeeds[newIndex]);
        }
      }
      // Home: Jump to day 1
      if (e.key === "Home") {
        e.preventDefault();
        onDayChange(minDay);
      }
      // End: Jump to max day
      if (e.key === "End") {
        e.preventDefault();
        onDayChange(maxDay);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [timelineIsPlaying, playbackSpeed, currentDay, minDay, maxDay, onDayChange, setTimelineIsPlaying, setTimelinePlaybackSpeed]);

  const currentPercentage = dayToPercentage(currentDay);
  const hoverPercentage = hoverPosition ? dayToPercentage(hoverPosition) : null;

  // Format date for tooltip
  const formatDate = (day: number): string => {
    const point = points.find((p) => p.day === day);
    if (point) {
      return new Date(point.isoDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    // Fallback: calculate date from day
    const startDate = new Date("2025-01-01");
    const date = new Date(startDate);
    date.setDate(date.getDate() + day - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const currentDate = formatDate(currentDay);
  const hoverDate = hoverPosition ? formatDate(hoverPosition) : null;

  return (
    <div
      className="scrubber flex items-center gap-4"
      style={{ height: "44px" }}
    >
      {/* Controls */}
      <div className="controls flex items-center gap-1">
        <Tooltip content="Step back one day" position="top">
          <button
            type="button"
            onClick={() => onDayChange(Math.max(minDay, currentDay - 1))}
            disabled={currentDay <= minDay}
            className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderColor: "var(--color-border)",
              background: "transparent",
              color: "var(--color-text-primary)",
            }}
            onMouseEnter={(e) => {
              if (currentDay > minDay) {
                e.currentTarget.style.background = "var(--color-bg-secondary)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            aria-label="Step back"
          >
            <ChevronLeft style={{ width: "16px", height: "16px" }} />
          </button>
        </Tooltip>

        <Tooltip content={timelineIsPlaying ? "Pause playback" : "Play timeline"} position="top">
          <button
            type="button"
            onClick={() => setTimelineIsPlaying(!timelineIsPlaying)}
            className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
            style={{
              borderColor: "var(--color-border)",
              background: timelineIsPlaying
                ? "var(--color-accent)"
                : "transparent",
              color: timelineIsPlaying ? "white" : "var(--color-text-primary)",
            }}
            onMouseEnter={(e) => {
              if (!timelineIsPlaying) {
                e.currentTarget.style.background = "var(--color-bg-secondary)";
              }
            }}
            onMouseLeave={(e) => {
              if (!timelineIsPlaying) {
                e.currentTarget.style.background = "transparent";
              }
            }}
            aria-label={timelineIsPlaying ? "Pause" : "Play"}
          >
            {timelineIsPlaying ? (
              <Pause style={{ width: "16px", height: "16px" }} />
            ) : (
              <Play style={{ width: "16px", height: "16px" }} />
            )}
          </button>
        </Tooltip>

        <Tooltip content="Step forward one day" position="top">
          <button
            type="button"
            onClick={() => onDayChange(Math.min(maxDay, currentDay + 1))}
            disabled={currentDay >= maxDay}
            className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderColor: "var(--color-border)",
              background: "transparent",
              color: "var(--color-text-primary)",
            }}
            onMouseEnter={(e) => {
              if (currentDay < maxDay) {
                e.currentTarget.style.background = "var(--color-bg-secondary)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            aria-label="Step forward"
          >
            <ChevronRight style={{ width: "16px", height: "16px" }} />
          </button>
        </Tooltip>

        <Tooltip content={`Playback speed: ${playbackSpeed}x (click to cycle)`} position="top">
          <button
            type="button"
            onClick={() => {
              const currentIndex = playbackSpeeds.indexOf(playbackSpeed);
              const nextIndex = (currentIndex + 1) % playbackSpeeds.length;
              setTimelinePlaybackSpeed(playbackSpeeds[nextIndex]);
            }}
            className="rounded-md border px-2 py-1 transition-colors"
            style={{
              fontSize: "var(--font-size-xs)",
              borderColor: "var(--color-border)",
              background: "transparent",
              color: "var(--color-text-primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-bg-secondary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            aria-label={`Playback speed: ${playbackSpeed}x`}
          >
            {playbackSpeed}x
          </button>
        </Tooltip>

        <Tooltip
          content={
            timelineAutoPauseAtMilestones
              ? "Auto-pause at milestones: ON (click to disable)"
              : "Auto-pause at milestones: OFF (click to enable)"
          }
          position="top"
        >
          <button
            type="button"
            onClick={() =>
              setTimelineAutoPauseAtMilestones(!timelineAutoPauseAtMilestones)
            }
            className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
            style={{
              borderColor: "var(--color-border)",
              background: timelineAutoPauseAtMilestones
                ? "var(--color-accent-12)"
                : "transparent",
              color: timelineAutoPauseAtMilestones
                ? "var(--color-accent)"
                : "var(--color-text-secondary)",
            }}
            onMouseEnter={(e) => {
              if (!timelineAutoPauseAtMilestones) {
                e.currentTarget.style.background = "var(--color-bg-secondary)";
              }
            }}
            onMouseLeave={(e) => {
              if (!timelineAutoPauseAtMilestones) {
                e.currentTarget.style.background = "transparent";
              }
            }}
            aria-label={
              timelineAutoPauseAtMilestones
                ? "Auto-pause at milestones enabled"
                : "Auto-pause at milestones disabled"
            }
          >
            <PauseCircle
              style={{
                width: "16px",
                height: "16px",
              }}
            />
          </button>
        </Tooltip>
      </div>

      {/* Scrubber Track */}
      <div
        ref={trackRef}
        className="scrubber-track relative flex-1 cursor-pointer"
        style={{
          height: "6px",
          background: "var(--color-bg-tertiary)",
          borderRadius: "var(--radius-full)",
          position: "relative",
        }}
        onClick={handleTrackClick}
        onMouseMove={handleTrackMouseMove}
        onMouseLeave={handleTrackMouseLeave}
        aria-label="Timeline scrubber"
      >
        {/* Progress fill */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${currentPercentage}%`,
            background: "var(--color-accent)",
            borderRadius: "var(--radius-full)",
            transition: isDragging ? "none" : "width 100ms linear",
          }}
        />

        {/* Milestone markers */}
        {milestones.map((milestone) => {
          const milestonePercentage = dayToPercentage(milestone.day);
          let markerColor = "var(--color-border)";
          let markerStyle: React.CSSProperties = { opacity: 0.4 };

          if (milestone.status === "current") {
            markerColor = "var(--color-accent)";
            markerStyle = {
              boxShadow: "0 0 0 4px var(--color-accent-20)",
              animation: "pulse 2s infinite",
            };
          } else if (milestone.status === "completed") {
            markerColor = "var(--color-success)";
            markerStyle = { opacity: 0.8 };
          } else if (milestone.status === "missed") {
            markerColor = "var(--color-error)";
            markerStyle = { opacity: 0.8 };
          }

          return (
            <div
              key={milestone.day}
              style={{
                position: "absolute",
                left: `${milestonePercentage}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: markerColor,
                ...markerStyle,
                pointerEvents: "none",
              }}
              title={`${milestone.label} - Day ${milestone.day}`}
            />
          );
        })}

        {/* Thumb */}
        <div
          ref={thumbRef}
          style={{
            position: "absolute",
            left: `${currentPercentage}%`,
            top: "50%",
            transform: isDragging
              ? "translate(-50%, -50%) scale(1.2)"
              : "translate(-50%, -50%)",
            width: "20px",
            height: "20px",
            background: "white",
            border: "2px solid var(--color-accent)",
            borderRadius: "50%",
            boxShadow: isDragging
              ? "var(--shadow-xl)"
              : "var(--shadow-md)",
            cursor: isDragging ? "grabbing" : "grab",
            transition: isDragging ? "none" : "transform 100ms var(--easing-standard)",
            zIndex: 10,
          }}
          onMouseDown={handleThumbMouseDown}
          onMouseEnter={(e) => {
            if (!isDragging) {
              e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)";
              e.currentTarget.style.boxShadow = "var(--shadow-lg)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragging) {
              e.currentTarget.style.transform = "translate(-50%, -50%)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }
          }}
        />

        {/* Tooltip on hover */}
        {hoverPosition !== null && hoverPercentage !== null && (
          <div
            style={{
              position: "absolute",
              left: `${hoverPercentage}%`,
              bottom: "100%",
              marginBottom: "8px",
              transform: "translateX(-50%)",
              padding: "4px 8px",
              background: "var(--overlay-dark-90)",
              color: "white",
              fontSize: "var(--font-size-xs)",
              borderRadius: "var(--radius-sm)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 20,
            }}
          >
            Day {hoverPosition} • {hoverDate}
          </div>
        )}
      </div>

      {/* Current Label */}
      <div
        style={{
          fontSize: "var(--font-size-sm)",
          color: "var(--color-text-primary)",
          whiteSpace: "nowrap",
          minWidth: "140px",
        }}
      >
        Day {currentDay} • {currentDate}
      </div>
    </div>
  );
}

