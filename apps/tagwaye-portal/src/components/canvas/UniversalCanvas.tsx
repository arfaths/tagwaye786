"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BadgeHelp,
  Building2,
  SplitSquareHorizontal,
} from "lucide-react";
import clsx from "clsx";
import { fetchProjectSummary } from "@/data/mockProject";
import { useLayoutStore } from "@/state/layout-store";
import { useEffect, useMemo, lazy, Suspense } from "react";
import { useCanvasLifecycle } from "@/hooks/useCanvasLifecycle";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

// Lazy load heavy components for code splitting
const SceneCanvas = lazy(() =>
  import("./SceneCanvas").then((mod) => ({
    default: mod.SceneCanvas,
  })),
);

const DualView = lazy(() =>
  import("./DualView").then((mod) => ({
    default: mod.DualView,
  })),
);

export function UniversalCanvas() {
  const viewMode = useLayoutStore((state) => state.viewMode);
  const selectedProjectId = useLayoutStore(
    (state) => state.selectedProjectId,
  );
  const setSelectedAssetPath = useLayoutStore(
    (state) => state.setSelectedAssetPath,
  );
  const dualViewPrimary = useLayoutStore((state) => state.dualViewPrimary);
  const dualViewSecondary = useLayoutStore((state) => state.dualViewSecondary);
  const dualViewActiveSide = useLayoutStore((state) => state.dualViewActiveSide);
  const setDualViewPrimary = useLayoutStore((state) => state.setDualViewPrimary);
  const setDualViewSecondary = useLayoutStore(
    (state) => state.setDualViewSecondary,
  );
  const setDualViewActiveSide = useLayoutStore(
    (state) => state.setDualViewActiveSide,
  );

  // Canvas lifecycle management
  const { isActive, isMounted } = useCanvasLifecycle({
    onMount: () => {
      // Initialize canvas content
      // Content components can use this to initialize libraries, fetch data
    },
    onActive: () => {
      // Resume real-time updates, animations
      // Content components can use this to start polling, resume animations
    },
    onInactive: () => {
      // Pause real-time updates, animations
      // Content components can use this to pause polling, pause animations
    },
    beforeUnmount: () => {
      // Auto-save state, cancel requests
      // Content components can use this to save state, cancel in-flight requests
    },
  });

  // Scroll restoration
  useScrollRestoration();

  // Initialize primary content when Dual View is enabled
  useEffect(() => {
    if (viewMode === "dual" && !dualViewPrimary) {
      // Current content becomes primary
      setDualViewPrimary({
        type: "dashboard",
        id: "current",
        label: "Dashboard A",
      });
    } else if (viewMode === "single") {
      // Clear dual view state when switching to single
      setDualViewPrimary(null);
      setDualViewSecondary(null);
      setDualViewActiveSide(null);
    }
  }, [
    viewMode,
    dualViewPrimary,
    setDualViewPrimary,
    setDualViewSecondary,
    setDualViewActiveSide,
  ]);
  const { data, isLoading } = useQuery({
    queryKey: ["project-summary", selectedProjectId],
    queryFn: () => fetchProjectSummary(selectedProjectId),
  });

  const cards = [
    {
      title: "Overall Health",
      metric: data ? `${Math.round(data.health * 100)}%` : "--",
      trend: "+4% vs last phase",
      icon: <Activity className="h-4 w-4 text-emerald-400" />,
    },
    {
      title: "Work Orders",
      metric: data ? data.openWorkOrders.toString() : "--",
      trend: "12 due this week",
      icon: <SplitSquareHorizontal className="h-4 w-4 text-sky-400" />,
    },
    {
      title: "Critical Risks",
      metric: data ? data.criticalRisks.length.toString() : "--",
      trend: data?.criticalRisks[0] ?? "Monitoring…",
      icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
    },
  ];

  return (
    <section className="flex h-full flex-col gap-4 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/5 bg-white/5 px-6 py-4 text-white/80 backdrop-blur-xl">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/60" style={{ fontSize: "var(--font-size-xs)", letterSpacing: "var(--letter-spacing-wide)" }}>
            Active Project
          </p>
          <h1 className="text-lg font-semibold text-white" style={{ fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-semibold)" }}>
            {data?.projectName ?? "Loading LivingTwin…"}
          </h1>
          <p className="text-sm text-white/60" style={{ fontSize: "var(--font-size-sm)" }}>{data?.location ?? "—"}</p>
        </div>
        <button
          type="button"
          onClick={() =>
            data?.primaryAssetPath && setSelectedAssetPath(data.primaryAssetPath)
          }
          className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-emerald-500/60"
          style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}
        >
          <Building2 className="h-4 w-4" />
          Focus Asset
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/8 to-transparent p-4 text-white backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-white/50" style={{ fontSize: "var(--font-size-xs)", letterSpacing: "var(--letter-spacing-wide)" }}>
                {card.title}
              </p>
              {card.icon}
            </div>
            <p className="mt-3 text-lg font-semibold" style={{ fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-semibold)" }}>{card.metric}</p>
            <p className="text-sm text-white/60" style={{ fontSize: "var(--font-size-sm)" }}>{card.trend}</p>
          </div>
        ))}
      </div>

      {/* Render based on view mode */}
      {viewMode === "dual" && dualViewPrimary ? (
        <Suspense fallback={<div className="loading-pulse">Loading dual view…</div>}>
          <DualView
          primary={dualViewPrimary}
          secondary={dualViewSecondary || undefined}
          onSecondaryChange={(content) => setDualViewSecondary(content)}
          renderContent={(content, side) => {
            // Mark active side
            const isActive = dualViewActiveSide === side;
            const handleClick = () => setDualViewActiveSide(side);

            if (content.type === "dashboard") {
              return (
                <div
                  className={clsx(
                    "flex-1 rounded-3xl border border-white/5 bg-black/30 p-5 text-white shadow-inner shadow-black/30 h-full overflow-auto",
                    !isActive && "opacity-90",
                  )}
                  onClick={handleClick}
                  role="button"
                  tabIndex={0}
                  onFocus={handleClick}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/50" style={{ fontSize: "var(--font-size-xs)", letterSpacing: "var(--letter-spacing-wide)" }}>
                        {side === "primary" ? "Primary" : "Secondary"}
                      </p>
                      <h2 className="text-lg font-medium" style={{ fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-medium)" }}>{content.label}</h2>
                    </div>
                    {isActive && (
                      <div className="h-2 w-2 rounded-full bg-accent" />
                    )}
                  </div>
                  <div className="space-y-4 text-sm text-white/70" style={{ fontSize: "var(--font-size-sm)" }}>
                    {(data?.criticalRisks ?? ["Dashboard content…"]).map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
                        >
                          {item}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              );
            }
            // Add other content type renderers as needed
            return (
              <div className="flex-1 rounded-3xl border border-white/5 bg-black/30 p-5 text-white h-full overflow-auto">
                <p>{content.label}</p>
              </div>
            );
          }}
        />
        </Suspense>
      ) : (
        <div className="flex flex-1 gap-4 flex-col">
          <div className="flex-1 rounded-3xl border border-white/5 bg-black/30 p-5 text-white shadow-inner shadow-black/30 min-h-[360px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/50" style={{ fontSize: "var(--font-size-xs)", letterSpacing: "var(--letter-spacing-wide)" }}>
                  Strategic Narrative
                </p>
                <h2 className="text-lg font-medium" style={{ fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-medium)" }}>Lifecycle storyline</h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/80"
                style={{ fontSize: "var(--font-size-xs)", letterSpacing: "var(--letter-spacing-wide)" }}
              >
                View Model
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-6 space-y-4 text-sm text-white/70" style={{ fontSize: "var(--font-size-sm)" }}>
              {(data?.criticalRisks ?? ["Loading signal intelligence…"]).map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="flex-1 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-5 text-white shadow-[0_30px_60px_rgba(16,185,129,0.25)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-200/70" style={{ fontSize: "var(--font-size-xs)", letterSpacing: "var(--letter-spacing-wide)" }}>
                  Live Systems
                </p>
                <h2 className="text-lg font-semibold" style={{ fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-semibold)" }}>Scene Canvas</h2>
              </div>
              <BadgeHelp className="h-5 w-5 text-emerald-200/80" />
            </div>
            <div className="mt-4 h-[260px] rounded-2xl border border-white/10 bg-black/30 p-2">
              <Suspense fallback={<div className="loading-pulse">Loading scene canvas…</div>}>
                <SceneCanvas />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="rounded-3xl border border-white/5 bg-white/5 px-4 py-3 text-center text-sm text-white/60" style={{ fontSize: "var(--font-size-sm)" }}>
          Syncing Tagwaye intelligence…
        </div>
      )}
    </section>
  );
}

