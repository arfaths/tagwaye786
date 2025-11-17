"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  Github,
  Home,
  LayoutDashboard,
  ListChecks,
  Menu,
  MessageSquare,
  Settings,
  Star,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useLayoutStore } from "@/state/layout-store";
import { useCommandPalette } from "@/components/command-palette/CommandPaletteProvider";
import { fetchProjectSummary } from "@/data/mockProject";

const navGroups = [
  {
    label: "Core",
    items: [
      { id: "home", label: "Home", icon: Home },
      { id: "projects", label: "Projects", icon: LayoutDashboard },
      { id: "sage", label: "Ask Sage", icon: Bot },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { id: "visualize", label: "Visualize", icon: Activity },
      { id: "analyze", label: "Analyze", icon: Users },
      { id: "optimize", label: "Optimize", icon: ListChecks },
    ],
  },
  {
    label: "Collaboration",
    items: [
      { id: "collaborate", label: "Collaborate", icon: MessageSquare },
      { id: "actions", label: "Actions", icon: Github },
    ],
  },
];

export function Sidebar() {
  const { setOpen } = useCommandPalette();
  const sidebarPinned = useLayoutStore((state) => state.sidebarPinned);
  const sidebarExpanded = useLayoutStore((state) => state.sidebarExpanded);
  const setSidebarPinned = useLayoutStore((state) => state.setSidebarPinned);
  const setSidebarExpanded = useLayoutStore(
    (state) => state.setSidebarExpanded,
  );
  const selectedProjectId = useLayoutStore(
    (state) => state.selectedProjectId,
  );
  const [hovered, setHovered] = useState(false);
  const isExpanded = sidebarPinned || hovered || sidebarExpanded;
  const { data: project } = useQuery({
    queryKey: ["project-summary", selectedProjectId],
    queryFn: () => fetchProjectSummary(selectedProjectId),
  });

  const activeRoute = useMemo(() => "home", []);

  useEffect(() => {
    if (sidebarPinned) {
      setSidebarExpanded(true);
      return;
    }
    if (!hovered) {
      setSidebarExpanded(false);
    }
  }, [hovered, sidebarPinned, setSidebarExpanded]);

  return (
    <motion.aside
      layout
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
      className={clsx(
        "tagwaye-sidebar",
        isExpanded ? "w-[280px]" : "w-[64px]",
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Project
          </p>
          {isExpanded ? (
            <p className="text-sm font-medium text-white">
              {project?.projectName ?? "Loading…"}
            </p>
          ) : (
            <Menu className="h-5 w-5 text-white/70" />
          )}
        </div>
        {isExpanded && (
          <button
            type="button"
            onClick={() => setSidebarPinned(!sidebarPinned)}
            className={clsx(
              "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]",
              sidebarPinned
                ? "border-emerald-400 text-emerald-200"
                : "border-white/20 text-white/50",
            )}
          >
            {sidebarPinned ? "Pinned" : "Pin"}
          </button>
        )}
      </div>

      <div className="space-y-8 px-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-left text-sm text-white/70"
          >
            <Bot className="h-4 w-4 text-emerald-300" />
            {isExpanded ? (
              <span>Ask Sage anything…</span>
            ) : (
              <span className="sr-only">Ask Sage</span>
            )}
          </button>
        </div>

        {navGroups.map((group) => (
          <div key={group.label} className="space-y-2">
            {isExpanded && (
              <p className="px-4 text-xs uppercase tracking-[0.32em] text-white/40">
                {group.label}
              </p>
            )}
            <nav className="space-y-1">
              {group.items.map(({ id, label, icon: Icon }) => {
                const active = activeRoute === id;
                return (
                  <button
                    key={id}
                    type="button"
                    className={clsx(
                      "flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-white/70 transition",
                      active
                        ? "bg-white/15 text-white"
                        : "hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {isExpanded ? label : <span className="sr-only">{label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-3 px-4 pb-4">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-left text-sm text-white/70"
        >
          <Star className="h-4 w-4 text-amber-300" />
          {isExpanded ? "Create" : <span className="sr-only">Create</span>}
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-left text-sm text-white/70"
        >
          <Settings className="h-4 w-4" />
          {isExpanded ? "Settings" : <span className="sr-only">Settings</span>}
        </button>
      </div>
    </motion.aside>
  );
}

