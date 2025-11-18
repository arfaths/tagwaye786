"use client";

import { useEffect, useRef } from "react";
import {
  Building2,
  FileText,
  LayoutDashboard,
  Workflow,
  X,
  ClipboardList,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { getSpringConfig } from "@/utils/animations";

export interface CreateOption {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  description: string;
  highlighted?: boolean;
}

export interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (optionId: string) => void;
  context?: "visualize" | "analyze" | "collaborate" | null;
}

const baseOptions: CreateOption[] = [
  {
    id: "project",
    icon: Building2,
    title: "New Project",
    description: "Create a new project workspace",
  },
  {
    id: "workflow",
    icon: Workflow,
    title: "New Workflow",
    description: "Design an automated workflow",
  },
  {
    id: "workorder",
    icon: ClipboardList,
    title: "New Work Order",
    description: "Create a maintenance task",
  },
  {
    id: "report",
    icon: FileText,
    title: "New Report",
    description: "Generate a data report",
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "New Dashboard",
    description: "Build a visualization",
  },
];

// Context-aware options that replace or highlight certain options
const contextOptions: Record<
  string,
  { replace?: string; highlight?: string }
> = {
  visualize: {
    replace: "dashboard",
    highlight: "dashboard",
  },
  analyze: {
    highlight: "dashboard",
  },
  collaborate: {
    highlight: "workflow",
  },
};

export function CreateModal({
  isOpen,
  onClose,
  onSelect,
  context,
}: CreateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus first button when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        firstButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Get options with context awareness
  const getOptions = (): CreateOption[] => {
    const options = [...baseOptions];
    const contextConfig = context ? contextOptions[context] : null;

    if (contextConfig) {
      // Highlight specific option
      if (contextConfig.highlight) {
        options.forEach((opt) => {
          if (opt.id === contextConfig.highlight) {
            opt.highlighted = true;
          }
        });
      }

      // Replace specific option (e.g., "New Dashboard" → "New Scene View" for Visualize)
      if (contextConfig.replace === "dashboard" && context === "visualize") {
        const dashboardIndex = options.findIndex((opt) => opt.id === "dashboard");
        if (dashboardIndex !== -1) {
          options[dashboardIndex] = {
            id: "scene-view",
            icon: LayoutDashboard,
            title: "New Scene View",
            description: "Create a 3D scene visualization",
            highlighted: true,
          };
        }
      }

      // Add context-specific option for Collaborate
      if (context === "collaborate") {
        options.push({
          id: "team-channel",
          icon: Workflow,
          title: "New Team Channel",
          description: "Create a collaboration channel",
          highlighted: true,
        });
      }
    }

    return options;
  };

  const options = getOptions();

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleOptionClick = (optionId: string) => {
    onSelect(optionId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[var(--z-index-modal)]"
            style={{
              background: "var(--overlay-dark-30)",
              backdropFilter: "blur(4px)",
            }}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
          {/* Modal */}
          <div
            className="fixed inset-0 z-[var(--z-index-modal)] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-modal-title"
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={getSpringConfig()}
              className="relative w-full max-w-[480px] max-h-[600px] overflow-hidden rounded-2xl border bg-[var(--color-surface)] shadow-xl"
              style={{
                borderRadius: "var(--radius-2xl)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-xl)",
                background: "var(--color-surface)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between border-b px-6 py-4"
                style={{
                  borderBottomColor: "var(--color-border)",
                }}
              >
                <h2
                  id="create-modal-title"
                  className="text-lg font-semibold"
                  style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Create New
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                  aria-label="Close modal"
                  style={{
                    color: "var(--color-text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-bg-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto" style={{ maxHeight: "520px" }}>
                <div className="px-6 py-2">
                  <p
                    className="mb-4"
                    style={{
                      fontSize: "var(--font-size-sm)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    What would you like to create?
                  </p>

                  <div className="space-y-1">
                    {options.map((option, index) => {
                      const Icon = option.icon;
                      const isHighlighted = option.highlighted;

                      return (
                        <button
                          key={option.id}
                          ref={index === 0 ? firstButtonRef : undefined}
                          type="button"
                          onClick={() => handleOptionClick(option.id)}
                          className={clsx(
                            "flex w-full items-start gap-4 rounded-lg px-4 py-3 text-left transition-colors",
                          )}
                          style={{
                            background: isHighlighted
                              ? "var(--color-accent-08)"
                              : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isHighlighted) {
                              e.currentTarget.style.background =
                                "var(--color-bg-secondary)";
                            } else {
                              e.currentTarget.style.background =
                                "var(--color-accent-12)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isHighlighted
                              ? "var(--color-accent-08)"
                              : "transparent";
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = "2px solid var(--color-accent)";
                            e.currentTarget.style.outlineOffset = "-2px";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.outline = "none";
                          }}
                        >
                          <Icon
                            className="mt-0.5 flex-shrink-0"
                            style={{
                              width: "20px",
                              height: "20px",
                              color: isHighlighted
                                ? "var(--color-accent)"
                                : "var(--color-text-secondary)",
                            }}
                            aria-hidden="true"
                          />
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-semibold"
                              style={{
                                fontSize: "var(--font-size-base)",
                                fontWeight: "var(--font-weight-semibold)",
                                color: isHighlighted
                                  ? "var(--color-accent)"
                                  : "var(--color-text-primary)",
                                marginBottom: "var(--space-xs)",
                              }}
                            >
                              {option.title}
                            </div>
                            <div
                              style={{
                                fontSize: "var(--font-size-sm)",
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              {option.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

