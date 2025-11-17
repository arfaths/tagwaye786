"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Fragment, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Command,
  Layers,
  PlusCircle,
  Search,
  Wand2,
} from "lucide-react";
import { useCommandPalette } from "./CommandPaletteProvider";

type CommandGroup = {
  label: string;
  items: { id: string; icon: React.ReactNode; title: string; meta: string }[];
};

const baseGroups: CommandGroup[] = [
  {
    label: "Navigate",
    items: [
      {
        id: "nav-home",
        icon: <Layers className="h-4 w-4 text-emerald-400" />,
        title: "Portfolio Overview",
        meta: "press Enter",
      },
      {
        id: "nav-canvas",
        icon: <Layers className="h-4 w-4 text-sky-400" />,
        title: "Scene Canvas • LivingTwin",
        meta: "Cmd+Shift+S",
      },
      {
        id: "nav-flow",
        icon: <Layers className="h-4 w-4 text-fuchsia-400" />,
        title: "Flow Canvas • Automations",
        meta: "G then F",
      },
    ],
  },
  {
    label: "Create",
    items: [
      {
        id: "create-scenario",
        icon: <PlusCircle className="h-4 w-4 text-indigo-400" />,
        title: "Scenario Comparison",
        meta: "Scenario Lab",
      },
      {
        id: "create-workorder",
        icon: <PlusCircle className="h-4 w-4 text-orange-400" />,
        title: "New Work Order",
        meta: "Ops Center",
      },
    ],
  },
  {
    label: "Ask Sage",
    items: [
      {
        id: "sage-risk",
        icon: <Wand2 className="h-4 w-4 text-rose-400" />,
        title: "Where is my highest schedule risk?",
        meta: "AI Insight",
      },
    ],
  },
];

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) {
      return baseGroups;
    }

    const lower = query.toLowerCase();
    return baseGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.title.toLowerCase().includes(lower),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm transition-opacity data-[state=closed]:opacity-0" />
        <Dialog.Content className="fixed inset-x-0 top-24 z-[1001] mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#05060a]/90 p-4 shadow-2xl shadow-emerald-800/20 backdrop-blur-2xl">
          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-400/40">
            <Search className="h-4 w-4 text-white/60" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Jump to space, person, decision, or time…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
            />
            <kbd className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wide text-white/60">
              <Command className="h-3 w-3" />
              K
            </kbd>
          </div>

          <div className="mt-4 max-h-[360px] space-y-4 overflow-y-auto pr-2">
            {results.length === 0 && (
              <p className="text-sm text-white/40">
                No matches yet—try a different query or ask Sage.
              </p>
            )}
            {results.map((group) => (
              <Fragment key={group.label}>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  {group.label}
                </p>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="group flex w-full items-center gap-3 rounded-xl border border-transparent bg-white/5 px-3 py-2 text-left transition hover:border-white/10 hover:bg-white/10"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/30 text-white">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {item.title}
                        </p>
                        <p className="text-xs text-white/60">{item.meta}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-white/30 transition group-hover:text-white" />
                    </button>
                  ))}
                </div>
              </Fragment>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

