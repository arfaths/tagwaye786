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
import { SceneCanvas } from "./SceneCanvas";

export function UniversalCanvas() {
  const viewMode = useLayoutStore((state) => state.viewMode);
  const selectedProjectId = useLayoutStore(
    (state) => state.selectedProjectId,
  );
  const setSelectedAssetPath = useLayoutStore(
    (state) => state.setSelectedAssetPath,
  );
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
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Active Project
          </p>
          <h1 className="text-2xl font-semibold text-white">
            {data?.projectName ?? "Loading LivingTwin…"}
          </h1>
          <p className="text-sm text-white/60">{data?.location ?? "—"}</p>
        </div>
        <button
          type="button"
          onClick={() =>
            data?.primaryAssetPath && setSelectedAssetPath(data.primaryAssetPath)
          }
          className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-emerald-500/60"
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
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                {card.title}
              </p>
              {card.icon}
            </div>
            <p className="mt-3 text-3xl font-semibold">{card.metric}</p>
            <p className="text-sm text-white/60">{card.trend}</p>
          </div>
        ))}
      </div>

      <div
        className={clsx(
          "flex flex-1 gap-4",
          viewMode === "dual" ? "flex-col lg:flex-row" : "flex-col",
        )}
      >
        <div
          className={clsx(
            "flex-1 rounded-3xl border border-white/5 bg-black/30 p-5 text-white shadow-inner shadow-black/30",
            viewMode === "dual" ? "min-h-[260px]" : "min-h-[360px]",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Strategic Narrative
              </p>
              <h2 className="text-xl font-medium">Lifecycle storyline</h2>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/80"
            >
              View Model
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-6 space-y-4 text-sm text-white/70">
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

        <div
          className={clsx(
            "flex-1 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-5 text-white",
            "shadow-[0_30px_60px_rgba(16,185,129,0.25)]",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                Live Systems
              </p>
              <h2 className="text-xl font-semibold">Scene Canvas</h2>
            </div>
            <BadgeHelp className="h-5 w-5 text-emerald-200/80" />
          </div>
          <div className="mt-4 h-[260px] rounded-2xl border border-white/10 bg-black/30 p-2">
            <SceneCanvas />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-3xl border border-white/5 bg-white/5 px-4 py-3 text-center text-sm text-white/60">
          Syncing Tagwaye intelligence…
        </div>
      )}
    </section>
  );
}

