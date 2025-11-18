"use client";

import { useState, useEffect, useRef } from "react";
import { Building2, ChevronDown, Check, X } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProjectSummary,
  fetchRecentProjects,
  fetchSystemStatus,
  type RecentProject,
} from "@/data/mockProject";
import { useLayoutStore } from "@/state/layout-store";


export function ProjectPill() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedProjectId = useLayoutStore((state) => state.selectedProjectId);
  const setSelectedProjectId = useLayoutStore(
    (state) => state.setSelectedProjectId,
  );

  const { data: currentProject } = useQuery({
    queryKey: ["project-summary", selectedProjectId],
    queryFn: () => fetchProjectSummary(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  const { data: recentProjects } = useQuery<RecentProject[]>({
    queryKey: ["recent-projects"],
    queryFn: fetchRecentProjects,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsOpen(false);
  };

  const handleAllProjects = () => {
    router.push("/projects");
    setIsOpen(false);
  };

  // Get project status from system status
  const { data: systemStatus } = useQuery({
    queryKey: ["system-status", selectedProjectId],
    queryFn: () => fetchSystemStatus(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  const projectStatus = systemStatus?.connection || "offline";
  const projectName = currentProject?.projectName || "Select Project...";
  const displayName =
    projectName.length > 20 ? `${projectName.slice(0, 20)}...` : projectName;

  const getStatusIndicator = () => {
    switch (projectStatus) {
      case "live":
        return (
          <span
            className="header-status-dot header-status-dot-live"
            aria-label="Live"
          />
        );
      case "syncing":
        return (
          <span
            className="header-status-dot header-status-dot-syncing"
            aria-label="Syncing"
          />
        );
      default:
        return (
          <span
            className="header-status-dot header-status-dot-offline"
            aria-label="Offline"
          />
        );
    }
  };

  return (
    <div ref={containerRef} className="header-project-pill-container">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "header-project-pill",
          !selectedProjectId && "header-project-pill-empty",
        )}
        aria-label={`Active project: ${projectName}. Click to switch project`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Building2 className="header-project-pill-icon" aria-hidden="true" />
        <span className="header-project-pill-label">{displayName}</span>
        {getStatusIndicator()}
        <ChevronDown
          className={clsx(
            "header-project-pill-chevron",
            isOpen && "header-project-pill-chevron-open",
          )}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="header-project-pill-dropdown" role="menu">
          <div className="header-project-pill-dropdown-header">
            <span>Switch Project</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="header-project-pill-dropdown-close"
              aria-label="Close project switcher"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="header-project-pill-dropdown-list">
            {currentProject && (
              <button
                type="button"
                role="menuitem"
                onClick={() => handleProjectSelect(selectedProjectId)}
                className="header-project-pill-dropdown-item header-project-pill-dropdown-item-current"
                aria-label={`${currentProject.projectName}, current project`}
              >
                <span className="header-project-pill-dropdown-status">
                  {getStatusIndicator()}
                </span>
                <span className="header-project-pill-dropdown-name">
                  {currentProject.projectName}
                </span>
                <Check className="header-project-pill-dropdown-check" aria-hidden="true" />
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
                  className="header-project-pill-dropdown-item"
                  aria-label={`Switch to ${project.name}`}
                >
                  <span className="header-project-pill-dropdown-status">
                    <span
                      className={clsx(
                        "header-status-dot",
                        project.status === "live" && "header-status-dot-live",
                        project.status === "syncing" &&
                          "header-status-dot-syncing",
                        project.status === "offline" &&
                          "header-status-dot-offline",
                      )}
                      aria-label={project.status}
                    />
                  </span>
                  <span className="header-project-pill-dropdown-name">
                    {project.name}
                  </span>
                </button>
              ))}
            <div className="header-project-pill-dropdown-divider" />
            <button
              type="button"
              role="menuitem"
              onClick={handleAllProjects}
              className="header-project-pill-dropdown-item header-project-pill-dropdown-item-all"
              aria-label="View all projects"
            >
              <span className="header-project-pill-dropdown-name">
                All Projects
              </span>
              <ChevronDown
                className="header-project-pill-dropdown-arrow"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

