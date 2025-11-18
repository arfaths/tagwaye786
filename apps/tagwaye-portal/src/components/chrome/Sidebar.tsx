"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Building2,
  ChartScatter,
  Check,
  ChevronDown,
  HelpCircle,
  Home,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sparkle,
  Sparkles,
  Workflow,
  Box,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutStore } from "@/state/layout-store";
import { useCommandPalette } from "@/components/command-palette/CommandPaletteProvider";
import {
  fetchProjectSummary,
  fetchRecentProjects,
  fetchSystemStatus,
  type RecentProject,
} from "@/data/mockProject";
import { Tooltip } from "@/components/shared/Tooltip";
import { getSidebarSpringConfig } from "@/utils/animations";
import { CreateModal } from "@/components/sidebar/CreateModal";

// Navigation items in correct order per specification
const navigationItems = [
  // Core group (16px spacing gap after)
  { id: "home", label: "Home", icon: Home, alwaysEnabled: true },
  { id: "projects", label: "Projects", icon: Building2, alwaysEnabled: true },
  { id: "sage", label: "Ask Sage", icon: Sparkles, alwaysEnabled: true },
  // Analysis group (16px spacing gap after)
  { id: "visualize", label: "Visualize", icon: Box, alwaysEnabled: false },
  { id: "analyze", label: "Analyze", icon: ChartScatter, alwaysEnabled: false },
  { id: "optimize", label: "Optimize", icon: Sparkle, alwaysEnabled: false },
  // Collaboration group
  { id: "collaborate", label: "Collaborate", icon: MessageSquare, alwaysEnabled: false },
  { id: "actions", label: "Actions", icon: Workflow, alwaysEnabled: false, expandable: true },
];

// Actions sub-items (only shown when Actions is active)
const actionsSubItems = [
  { id: "create", label: "Create" },
  { id: "manage", label: "Manage" },
];

export function Sidebar() {
  const { setOpen } = useCommandPalette();
  const pathname = usePathname();
  const router = useRouter();
  const sidebarPinned = useLayoutStore((state) => state.sidebarPinned);
  const sidebarExpanded = useLayoutStore((state) => state.sidebarExpanded);
  const setSidebarPinned = useLayoutStore((state) => state.setSidebarPinned);
  const setSidebarExpanded = useLayoutStore(
    (state) => state.setSidebarExpanded,
  );
  const selectedProjectId = useLayoutStore(
    (state) => state.selectedProjectId,
  );
  const setSelectedProjectId = useLayoutStore(
    (state) => state.setSelectedProjectId,
  );
  const [hovered, setHovered] = useState(false);
  const [projectSwitcherOpen, setProjectSwitcherOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const projectSwitcherRef = useRef<HTMLDivElement>(null);
  const isExpanded = sidebarPinned || hovered || sidebarExpanded;
  const { data: project } = useQuery({
    queryKey: ["project-summary", selectedProjectId],
    queryFn: () => fetchProjectSummary(selectedProjectId),
  });
  const { data: recentProjects } = useQuery<RecentProject[]>({
    queryKey: ["recent-projects"],
    queryFn: fetchRecentProjects,
  });
  const { data: systemStatus } = useQuery({
    queryKey: ["system-status", selectedProjectId],
    queryFn: () => fetchSystemStatus(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  // Get active route from pathname
  const activeRoute = useMemo(() => {
    if (!pathname) return "home";
    // Extract route from pathname (e.g., "/dashboard/home" -> "home")
    const segments = pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] || "home";
  }, [pathname]);
  const isActionsActive = activeRoute === "actions";

  // Determine context for Create modal (based on active route)
  const createModalContext = useMemo(() => {
    if (activeRoute === "visualize") return "visualize" as const;
    if (activeRoute === "analyze") return "analyze" as const;
    if (activeRoute === "collaborate") return "collaborate" as const;
    return null;
  }, [activeRoute]);

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const handleCreateSelect = (optionId: string) => {
    // Navigate to appropriate page or open form based on option
    if (optionId === "dashboard") {
      router.push("/dashboard/create");
    } else if (optionId === "workflow") {
      router.push("/workflow/create");
    } else if (optionId === "report") {
      router.push("/reports/create");
    } else if (optionId === "form") {
      router.push("/forms/create");
    }
    // For other options, could open modals or navigate as needed
    setCreateModalOpen(false);
  };

  const hasActiveProject = !!selectedProjectId;

  useEffect(() => {
    if (sidebarPinned) {
      setSidebarExpanded(true);
      return;
    }
    if (!hovered) {
      setSidebarExpanded(false);
    }
  }, [hovered, sidebarPinned, setSidebarExpanded]);

  // Handle Cmd+K to open command palette
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      // Cmd+Shift+S to toggle pin
      if (
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "s"
      ) {
        event.preventDefault();
        setSidebarPinned(!sidebarPinned);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen, sidebarPinned, setSidebarPinned]);

  // Handle click outside project switcher
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        projectSwitcherRef.current &&
        !projectSwitcherRef.current.contains(event.target as Node)
      ) {
        setProjectSwitcherOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProjectSwitcherOpen(false);
      }
    }

    if (projectSwitcherOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [projectSwitcherOpen]);

  const handleProjectClick = () => {
    setProjectSwitcherOpen(!projectSwitcherOpen);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setProjectSwitcherOpen(false);
  };

  const handleAllProjects = () => {
    router.push("/projects");
    setProjectSwitcherOpen(false);
  };

  // Get project status
  const projectStatus = systemStatus?.connection || "offline";

  // Get status indicator component
  const getStatusIndicator = () => {
    switch (projectStatus) {
      case "live":
        return (
          <span
            className="inline-block"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--color-status-live)",
              marginLeft: "var(--space-sm)",
            }}
            aria-label="Live"
          />
        );
      case "syncing":
        return (
          <span
            className="inline-block"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--color-status-syncing)",
              marginLeft: "var(--space-sm)",
            }}
            aria-label="Syncing"
          />
        );
      default:
        return (
          <span
            className="inline-block"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--color-status-offline)",
              marginLeft: "var(--space-sm)",
            }}
            aria-label="Offline"
          />
        );
    }
  };

  const handleToggleClick = () => {
    setSidebarPinned(!sidebarPinned);
  };

  const handleCommandPaletteClick = () => {
    setOpen(true);
  };

  return (
    <motion.aside
      layout
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={getSidebarSpringConfig()}
      className={clsx(
        "tagwaye-sidebar flex flex-col",
        isExpanded ? "w-[280px]" : "w-[64px]",
      )}
      style={{
        width: isExpanded ? "280px" : "64px",
      }}
      role="complementary"
      aria-label="Main navigation"
    >
      {/* TOP ZONE: Active Project Header + Command Palette */}
      <div className="flex flex-col border-b border-[var(--color-border)]">
        {/* Active Project Header */}
        <div
          ref={projectSwitcherRef}
          className="relative"
          style={{ height: "40px" }}
        >
          {isExpanded ? (
            <div className="flex items-center justify-between px-3 py-2.5">
              <button
                type="button"
                onClick={handleProjectClick}
                className="flex-1 text-left flex items-center"
                style={{
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--color-text-primary)",
                  cursor: "pointer",
                }}
                aria-label={`Active project: ${project?.projectName || "No project selected"}. Click to switch project`}
                aria-expanded={projectSwitcherOpen}
                aria-haspopup="true"
                title={project?.projectName || "Select Project..."}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {project?.projectName || (
                    <span
                      style={{
                        fontStyle: "italic",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      Select Project...
                    </span>
                  )}
                  {project && getStatusIndicator()}
                </span>
                <ChevronDown
                  className={clsx(
                    "transition-icon",
                    projectSwitcherOpen && "rotate-180"
                  )}
                  style={{
                    width: "16px",
                    height: "16px",
                    color: "var(--color-text-secondary)",
                    marginLeft: "var(--space-xs)",
                  }}
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={handleToggleClick}
                className="flex h-8 w-8 items-center justify-center rounded"
                style={{
                  marginRight: "var(--space-md)",
                }}
                aria-label={sidebarPinned ? "Unpin sidebar" : "Pin sidebar"}
                aria-keyshortcuts="Meta+Shift+S Ctrl+Shift+S"
                title={sidebarPinned ? "Unpin sidebar (Cmd+Shift+S)" : "Pin sidebar (Cmd+Shift+S)"}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-bg-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {sidebarPinned ? (
                  <PanelLeftClose 
                    className="transition-icon"
                    style={{ 
                      width: "20px",
                      height: "20px",
                      color: "var(--color-text-secondary)",
                    }} 
                  />
                ) : (
                  <PanelLeftOpen 
                    className="transition-icon"
                    style={{ 
                      width: "20px",
                      height: "20px",
                      color: "var(--color-text-secondary)",
                    }} 
                  />
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleToggleClick}
              className="flex h-full w-full items-center justify-center"
              aria-label="Expand sidebar to view project name and navigation"
            >
              <PanelLeftOpen className="h-5 w-5 transition-icon" style={{ color: "var(--color-text-secondary)" }} />
            </button>
          )}

          {/* Project Switcher Dropdown */}
          {projectSwitcherOpen && isExpanded && (
            <div
              className="absolute left-3 right-3 top-full mt-1 z-50 rounded-lg border shadow-lg"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-lg)",
                maxHeight: "400px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
              role="menu"
            >
              <div
                className="flex items-center justify-between px-3 py-2 border-b"
                style={{
                  borderBottomColor: "var(--color-border)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--font-size-sm)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Switch Project
                </span>
                <button
                  type="button"
                  onClick={() => setProjectSwitcherOpen(false)}
                  className="flex h-6 w-6 items-center justify-center rounded"
                  aria-label="Close project switcher"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-bg-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <X
                    className="h-4 w-4"
                    style={{ color: "var(--color-text-secondary)" }}
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "320px" }}
              >
                {currentProject && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleProjectSelect(selectedProjectId)}
                    className="flex items-center justify-between w-full px-3 py-2 text-left"
                    style={{
                      fontSize: "var(--font-size-sm)",
                      color: "var(--color-text-primary)",
                      background: "var(--color-accent-08)",
                    }}
                    aria-label={`${currentProject.projectName}, current project`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--color-accent-12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--color-accent-08)";
                    }}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <span
                        className="inline-block mr-2"
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background:
                            projectStatus === "live"
                              ? "var(--color-status-live)"
                              : projectStatus === "syncing"
                                ? "var(--color-status-syncing)"
                                : "var(--color-status-offline)",
                          flexShrink: 0,
                        }}
                        aria-label={projectStatus}
                      />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {currentProject.projectName}
                      </span>
                    </div>
                    <Check
                      className="h-4 w-4 flex-shrink-0 ml-2"
                      style={{ color: "var(--color-accent)" }}
                      aria-hidden="true"
                    />
                  </button>
                )}
                {recentProjects
                  ?.filter((p) => p.id !== selectedProjectId)
                  .slice(0, 5)
                  .map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      role="menuitem"
                      onClick={() => handleProjectSelect(project.id)}
                      className="flex items-center w-full px-3 py-2 text-left transition-colors"
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--color-text-primary)",
                      }}
                      aria-label={`Switch to ${project.name}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--color-bg-secondary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span
                        className="inline-block mr-2"
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background:
                            project.status === "live"
                              ? "var(--color-status-live)"
                              : project.status === "syncing"
                                ? "var(--color-status-syncing)"
                                : "var(--color-status-offline)",
                          flexShrink: 0,
                        }}
                        aria-label={project.status}
                      />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {project.name}
                      </span>
                    </button>
                  ))}
                <div
                  className="border-t"
                  style={{
                    borderTopColor: "var(--color-border)",
                    margin: "var(--space-xs) 0",
                  }}
                />
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleAllProjects}
                  className="flex items-center justify-between w-full px-3 py-2 text-left transition-colors"
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: "var(--color-text-primary)",
                  }}
                  aria-label="View all projects"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-bg-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span>All Projects</span>
                  <ChevronDown
                    className="h-4 w-4 rotate-[-90deg]"
                    style={{ color: "var(--color-text-secondary)" }}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "var(--color-border)",
            opacity: 0.5,
            margin: `0 ${isExpanded ? "var(--space-md)" : "var(--space-sm)"}`,
            marginTop: "var(--space-md)",
            marginBottom: "var(--space-md)",
          }}
        />

        {/* Command Palette Input Field */}
        {isExpanded ? (
          <div className="px-3 pb-3">
            <button
              type="button"
              onClick={handleCommandPaletteClick}
              className="relative flex w-full items-center rounded-lg border"
              style={{
                height: "44px",
                paddingLeft: "40px",
                paddingRight: "var(--space-md)",
                background: "var(--color-bg-secondary)",
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-lg)",
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
              }}
              aria-label="Open command palette. Type a command or search. Press Command K or Control K"
              aria-keyshortcuts="Meta+K Ctrl+K"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-bg-tertiary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-bg-secondary)";
              }}
            >
              <Search
                className="absolute left-3"
                style={{ 
                  color: "var(--color-text-secondary)",
                  width: "18px",
                  height: "18px",
                }}
              />
              <span>Type a command...</span>
            </button>
          </div>
        ) : (
          <div className="flex h-11 items-center justify-center pb-3">
            <button
              type="button"
              onClick={handleCommandPaletteClick}
              className="flex h-8 w-8 items-center justify-center"
              aria-label="Open command palette. Press Command K or Control K"
              aria-keyshortcuts="Meta+K Ctrl+K"
            >
              <Search 
                style={{ 
                  color: "var(--color-text-secondary)",
                  width: "18px",
                  height: "18px",
                }} 
              />
            </button>
          </div>
        )}
      </div>

      {/* MAIN ZONE: Navigation Items */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <nav className="space-y-4" role="navigation" aria-label="Main navigation">
          {navigationItems.map((item, index) => {
            const isActive = activeRoute === item.id;
            const isDisabled = !item.alwaysEnabled && !hasActiveProject;
            const showSpacingGap = index === 2 || index === 5; // After Core and Analysis groups

            return (
              <div key={item.id}>
                {showSpacingGap && <div style={{ height: "var(--space-lg)" }} />}
                <div>
                  {!isExpanded ? (
                    <Tooltip
                      content={isDisabled ? "Select a project to enable" : item.label}
                      position="right"
                    >
                      <button
                        type="button"
                        disabled={isDisabled}
                        className={clsx(
                          "flex w-full items-center justify-center rounded-md transition-colors button-hover",
                          isActive && "font-semibold",
                          isDisabled && "opacity-40 cursor-not-allowed pointer-events-none",
                        )}
                        style={{
                          height: "48px",
                          paddingLeft: "var(--space-md)",
                          paddingRight: "var(--space-sm)",
                          margin: "0 var(--space-sm)",
                          fontSize: "var(--font-size-sm)",
                          color: isActive
                            ? "var(--color-accent)"
                            : "var(--color-text-secondary)",
                          background: isActive
                            ? "var(--color-accent-12)"
                            : "transparent",
                          borderLeft: isActive
                            ? "4px solid var(--color-accent)"
                            : "4px solid transparent",
                        }}
                        role="menuitem"
                        aria-label={`${item.label}${isActive ? ", current page" : ""}${isDisabled ? ", disabled - select a project first" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                        aria-disabled={isDisabled}
                        onMouseEnter={(e) => {
                          if (!isActive && !isDisabled) {
                            e.currentTarget.style.background = "var(--color-bg-secondary)";
                            e.currentTarget.style.color = "var(--color-text-primary)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive && !isDisabled) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--color-text-secondary)";
                          }
                        }}
                      >
                        <item.icon 
                          className="transition-icon"
                          style={{ 
                            width: "20px",
                            height: "20px",
                          }}
                          aria-hidden="true"
                        />
                        <span className="sr-only">{item.label}</span>
                      </button>
                    </Tooltip>
                  ) : (
                    <button
                      type="button"
                      disabled={isDisabled}
                      className={clsx(
                        "flex w-full items-center rounded-md transition-colors button-hover",
                        isActive && "font-semibold",
                        isDisabled && "opacity-40 cursor-not-allowed pointer-events-none",
                      )}
                      style={{
                        height: "48px",
                        paddingLeft: "var(--space-md)",
                        paddingRight: "var(--space-sm)",
                        margin: "0 var(--space-sm)",
                        fontSize: "var(--font-size-sm)",
                        color: isActive
                          ? "var(--color-accent)"
                          : "var(--color-text-secondary)",
                        background: isActive
                          ? "var(--color-accent-12)"
                          : "transparent",
                        borderLeft: isActive
                          ? "4px solid var(--color-accent)"
                          : "4px solid transparent",
                      }}
                      role="menuitem"
                      aria-label={`${item.label}${isActive ? ", current page" : ""}${isDisabled ? ", disabled - select a project first" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      aria-disabled={isDisabled}
                      onMouseEnter={(e) => {
                        if (!isActive && !isDisabled) {
                          e.currentTarget.style.background = "var(--color-bg-secondary)";
                          e.currentTarget.style.color = "var(--color-text-primary)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive && !isDisabled) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "var(--color-text-secondary)";
                        }
                      }}
                    >
                      <item.icon 
                        className="transition-icon"
                        style={{ 
                          width: "20px",
                          height: "20px",
                          marginRight: "var(--space-md)",
                        }}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </button>
                  )}

                  {/* Actions Sub-items (only when Actions is active) */}
                  {item.expandable && isActionsActive && isExpanded && (
                    <div className="mt-1 space-y-1">
                      {actionsSubItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          type="button"
                          className="flex w-full items-center rounded-md transition-colors button-hover"
                          style={{
                            height: "40px",
                            paddingLeft: "36px",
                            paddingRight: "var(--space-sm)",
                            margin: "0 var(--space-sm)",
                            fontSize: "var(--font-size-sm)",
                            color: "var(--color-text-primary)",
                            background: "transparent",
                          }}
                          role="menuitem"
                          aria-label={`${subItem.label}, sub-item of Actions`}
                          onClick={
                            subItem.id === "create" ? handleCreateClick : undefined
                          }
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--color-accent-06)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM ZONE: Help and Settings */}
      <div className="border-t border-[var(--color-border)] px-2 py-4">
        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "var(--color-border)",
            opacity: 0.5,
            margin: `0 var(--space-sm) var(--space-lg)`,
          }}
        />

        <div className="space-y-1">
          {/* Help */}
          {!isExpanded ? (
            <Tooltip content="Help and documentation" position="right">
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-md transition-colors button-hover"
                style={{
                  height: "48px",
                  paddingLeft: "var(--space-md)",
                  paddingRight: "var(--space-sm)",
                  margin: "0 var(--space-sm)",
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-secondary)",
                }}
                role="menuitem"
                aria-label="Help and documentation"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-bg-secondary)";
                  e.currentTarget.style.color = "var(--color-text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
              >
                <HelpCircle 
                  className="transition-icon"
                  style={{ 
                    width: "20px",
                    height: "20px",
                  }}
                  aria-hidden="true"
                />
                <span className="sr-only">Help</span>
              </button>
            </Tooltip>
          ) : (
            <button
              type="button"
              className="flex w-full items-center rounded-md transition-colors button-hover"
              style={{
                height: "48px",
                paddingLeft: "var(--space-md)",
                paddingRight: "var(--space-sm)",
                margin: "0 var(--space-sm)",
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-secondary)",
              }}
              role="menuitem"
              aria-label="Help and documentation"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-bg-secondary)";
                e.currentTarget.style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
            >
              <HelpCircle 
                className="transition-icon"
                style={{ 
                  width: "20px",
                  height: "20px",
                  marginRight: "var(--space-md)",
                }}
                aria-hidden="true"
              />
              <span>Help</span>
            </button>
          )}

          {/* Settings */}
          {!isExpanded ? (
            <Tooltip content="Application settings" position="right">
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-md transition-colors button-hover"
                style={{
                  height: "48px",
                  paddingLeft: "var(--space-md)",
                  paddingRight: "var(--space-sm)",
                  margin: "0 var(--space-sm)",
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-secondary)",
                }}
                role="menuitem"
                aria-label="Application settings"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-bg-secondary)";
                  e.currentTarget.style.color = "var(--color-text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
              >
                <Settings 
                  className="transition-icon"
                  style={{ 
                    width: "20px",
                    height: "20px",
                  }}
                  aria-hidden="true"
                />
                <span className="sr-only">Settings</span>
              </button>
            </Tooltip>
          ) : (
            <button
              type="button"
              className="flex w-full items-center rounded-md transition-colors button-hover"
              style={{
                height: "48px",
                paddingLeft: "var(--space-md)",
                paddingRight: "var(--space-sm)",
                margin: "0 var(--space-sm)",
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-secondary)",
              }}
              role="menuitem"
              aria-label="Application settings"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-bg-secondary)";
                e.currentTarget.style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
            >
              <Settings 
                className="transition-icon"
                style={{ 
                  width: "20px",
                  height: "20px",
                  marginRight: "var(--space-md)",
                }}
                aria-hidden="true"
              />
              <span>Settings</span>
            </button>
          )}
        </div>

        {/* Pin Indicator (only when pinned) */}
        {sidebarPinned && (
          <div
            className="absolute"
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--color-text-secondary)",
              opacity: 0.3,
              bottom: "var(--space-lg)",
              right: isExpanded ? "136px" : "28px",
            }}
            aria-label="Sidebar is pinned"
            role="status"
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1.0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.3";
            }}
          />
        )}
      </div>

      {/* Create Modal */}
      <CreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSelect={handleCreateSelect}
        context={createModalContext}
      />
    </motion.aside>
  );
}
