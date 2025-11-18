"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command, X } from "lucide-react";
import { useState, useEffect } from "react";

type ShortcutGroup = {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
};

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["⌘", "K"], description: "Open command palette" },
      { keys: ["⌘", "Shift", "S"], description: "Pin/unpin sidebar" },
      { keys: ["⌘", "\\"], description: "Toggle panel" },
      { keys: ["?"], description: "Show keyboard shortcuts" },
    ],
  },
  {
    title: "Timeline",
    shortcuts: [
      { keys: ["Space"], description: "Play/pause timeline" },
      { keys: ["←"], description: "Step back one day" },
      { keys: ["→"], description: "Step forward one day" },
      { keys: ["[", "]"], description: "Decrease/increase playback speed" },
      { keys: ["Shift", "↑"], description: "Increase timeline height" },
      { keys: ["Shift", "↓"], description: "Decrease timeline height" },
    ],
  },
  {
    title: "Panel",
    shortcuts: [
      { keys: ["⌘", "\\"], description: "Toggle panel open/closed" },
      { keys: ["←", "→"], description: "Resize panel (when dragging)" },
    ],
  },
  {
    title: "General",
    shortcuts: [
      { keys: ["Esc"], description: "Close dialogs and dropdowns" },
      { keys: ["Tab"], description: "Navigate between elements" },
      { keys: ["Enter"], description: "Activate selected item" },
    ],
  },
];

function formatKey(key: string): string {
  const keyMap: Record<string, string> = {
    "⌘": "⌘",
    "Shift": "⇧",
    "Ctrl": "⌃",
    "Alt": "⌥",
    "Space": "Space",
    "←": "←",
    "→": "→",
    "↑": "↑",
    "↓": "↓",
    "[": "[",
    "]": "]",
    "\\": "\\",
    "?": "?",
    "K": "K",
    "S": "S",
    "Esc": "Esc",
    "Tab": "Tab",
    "Enter": "Enter",
  };
  return keyMap[key] || key;
}

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);

  // Listen for ? key to open shortcuts help
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Only open if not typing in an input/textarea
      if (
        event.key === "?" &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm transition-opacity data-[state=closed]:opacity-0" />
        <Dialog.Content className="fixed inset-x-0 top-24 z-[1001] mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#05060a]/90 p-6 shadow-2xl shadow-emerald-800/20 backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-lg font-semibold text-white"
                style={{
                  fontSize: "var(--font-size-lg)",
                  fontWeight: "var(--font-weight-semibold)",
                }}
              >
                Keyboard Shortcuts
              </h2>
              <p
                className="text-sm text-white/60 mt-1"
                style={{ fontSize: "var(--font-size-sm)" }}
              >
                Press <kbd className="px-1.5 py-0.5 rounded border border-white/10 text-xs">?</kbd> to open this help
              </p>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors button-hover hover:text-white"
                aria-label="Close keyboard shortcuts help"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {shortcutGroups.map((group) => (
              <div key={group.title}>
                <h3
                  className="text-xs uppercase tracking-wide text-white/50 mb-3"
                  style={{
                    fontSize: "var(--font-size-xs)",
                    letterSpacing: "var(--letter-spacing-wide)",
                  }}
                >
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                    >
                      <span
                        className="text-sm text-white/80"
                        style={{ fontSize: "var(--font-size-sm)" }}
                      >
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <span key={keyIndex}>
                            <kbd
                              className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded border border-white/10 bg-white/5 text-xs font-medium text-white/70"
                              style={{ fontSize: "var(--font-size-xs)" }}
                            >
                              {formatKey(key)}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="mx-1 text-white/30">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <p
              className="text-xs text-white/40 text-center"
              style={{ fontSize: "var(--font-size-xs)" }}
            >
              Tip: Most shortcuts work when the timeline is expanded
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

