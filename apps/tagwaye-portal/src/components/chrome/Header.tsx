"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bell,
  CalendarClock,
  Command,
  Search,
  Share2,
  SlidersHorizontal,
} from "lucide-react";
import { useCommandPalette } from "@/components/command-palette/CommandPaletteProvider";
import { fetchProjectSummary } from "@/data/mockProject";
import { useLayoutStore } from "@/state/layout-store";

export function Header() {
  const { setOpen } = useCommandPalette();
  const selectedProjectId = useLayoutStore(
    (state) => state.selectedProjectId,
  );
  const layoutMode = useLayoutStore((state) => state.layoutMode);
  const layoutModeLabel =
    layoutMode.charAt(0).toUpperCase() + layoutMode.slice(1);
  const { data: project } = useQuery({
    queryKey: ["project-summary", selectedProjectId],
    queryFn: () => fetchProjectSummary(selectedProjectId),
  });

  return (
    <motion.header
      layout
      transition={{ type: "spring", stiffness: 180, damping: 26 }}
      className="tagwaye-header"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold tracking-tight text-white">
          Tagwaye
        </span>
        <div className="relative hidden lg:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 min-w-[320px] items-center rounded-full border border-white/10 bg-white/5 pl-12 pr-4 text-left text-sm text-white/70"
          >
            Search spaces, assets, decisions, time…
            <span className="ml-auto flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-xs uppercase text-white/60">
              <Command className="h-3 w-3" />
              K
            </span>
          </button>
        </div>
      </div>

      <div className="hidden text-sm text-white/70 lg:flex lg:flex-col lg:items-center">
        <span className="uppercase tracking-[0.3em] text-white/40">
          Mode • {layoutModeLabel}
        </span>
        <p className="text-white">
          {project?.projectName ?? "Loading project…"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-white/70"
        >
          <CalendarClock className="h-4 w-4" />
          Today
        </button>
        <button
          type="button"
          className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:text-white"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:text-white"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:text-white"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </motion.header>
  );
}

