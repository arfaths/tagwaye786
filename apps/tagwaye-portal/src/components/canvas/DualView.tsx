"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useLayoutStore } from "@/state/layout-store";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

type ContentType = "dashboard" | "scene" | "form" | "table" | "builder";

interface DualViewContent {
  type: ContentType;
  id?: string;
  label: string;
}

type Props = {
  primary: DualViewContent;
  secondary?: DualViewContent;
  onSecondaryChange?: (content: DualViewContent) => void;
  renderContent: (content: DualViewContent, side: "primary" | "secondary") => React.ReactNode;
};

export function DualView({
  primary,
  secondary,
  onSecondaryChange,
  renderContent,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [splitRatio, setSplitRatio] = useState(() => {
    // Load from localStorage or default to 60/40 (per spec)
    try {
      const saved = localStorage.getItem("dual-view-split");
      if (saved) {
        const ratio = parseFloat(saved);
        if (!isNaN(ratio) && ratio >= 0.2 && ratio <= 0.8) {
          return ratio;
        }
      }
    } catch {
      // Ignore
    }
    return 0.6; // 60% primary, 40% secondary (per spec default)
  });

  const [isDragging, setIsDragging] = useState(false);
  const [showSecondaryDropdown, setShowSecondaryDropdown] = useState(false);

  // Save split ratio to localStorage
  useEffect(() => {
    localStorage.setItem("dual-view-split", splitRatio.toString());
  }, [splitRatio]);

  // Handle divider drag
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!containerRef.current || !dividerRef.current) return;
      e.preventDefault();
      setIsDragging(true);
      dividerRef.current.setPointerCapture(e.pointerId);

      const startX = e.clientX;
      const containerWidth = containerRef.current.offsetWidth;
      const startRatio = splitRatio;

      const handleMove = (moveEvent: PointerEvent) => {
        if (!containerRef.current) return;
        const deltaX = moveEvent.clientX - startX;
        const newRatio = Math.max(
          0.2, // 20% minimum
          Math.min(0.8, startRatio + deltaX / containerWidth), // 80% maximum
        );
        setSplitRatio(newRatio);
      };

      const handleUp = () => {
        setIsDragging(false);
        dividerRef.current?.releasePointerCapture(e.pointerId);
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [splitRatio],
  );

  // Reset split to 60/40 (spec default) on double-click
  const handleDividerDoubleClick = useCallback(() => {
    setSplitRatio(0.6);
  }, []);

  // Example secondary content options (in real app, this would come from state/router)
  const secondaryOptions: DualViewContent[] = [
    { type: "dashboard", id: "dash-2", label: "Dashboard B" },
    { type: "dashboard", id: "dash-3", label: "Dashboard C" },
    { type: "table", id: "table-1", label: "Work Orders" },
    { type: "form", id: "form-1", label: "New Report" },
  ];

  // Validate content combinations
  const canShowSecondary = (content: DualViewContent): boolean => {
    // No Scene Canvas in Dual View
    if (content.type === "scene") return false;
    // No two builders open
    if (primary.type === "builder" && content.type === "builder") return false;
    // Scene Canvas cannot be primary in Dual View
    if (primary.type === "scene") return false;
    return true;
  };

  // If no secondary content selected, prompt user
  if (!secondary) {
    return (
      <div className="dual-view-container" ref={containerRef}>
        <div
          className="dual-view-primary"
          style={{ width: "100%" }}
        >
          {renderContent(primary, "primary")}
        </div>
        <div className="dual-view-secondary-prompt">
          <div className="dual-view-prompt-content">
            <p className="dual-view-prompt-label">Select secondary content</p>
            <div className="dual-view-prompt-dropdown">
              <button
                type="button"
                onClick={() => setShowSecondaryDropdown(!showSecondaryDropdown)}
                className="dual-view-dropdown-button"
                aria-expanded={showSecondaryDropdown}
                aria-haspopup="listbox"
              >
                What would you like to compare?
                <ChevronDown
                  size={16}
                  className={clsx(
                    "dual-view-dropdown-icon",
                    showSecondaryDropdown && "dual-view-dropdown-icon--open",
                  )}
                />
              </button>
              {showSecondaryDropdown && (
                <div className="dual-view-dropdown-menu" role="listbox">
                  {secondaryOptions
                    .filter((opt) => canShowSecondary(opt))
                    .map((option) => (
                      <button
                        key={option.id || option.label}
                        type="button"
                        role="option"
                        onClick={() => {
                          onSecondaryChange?.(option);
                          setShowSecondaryDropdown(false);
                        }}
                        className="dual-view-dropdown-item"
                      >
                        {option.label}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dual-view-container" ref={containerRef}>
      {/* Primary (Left) */}
      <div
        className="dual-view-primary"
        style={{ width: `${splitRatio * 100}%` }}
      >
        {renderContent(primary, "primary")}
      </div>

      {/* Resizable Divider */}
      <div
        ref={dividerRef}
        className={clsx(
          "dual-view-divider",
          isDragging && "dual-view-divider--dragging",
        )}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDividerDoubleClick}
        role="separator"
        aria-label="Resize dual view divider"
        aria-orientation="vertical"
        aria-valuemin={20}
        aria-valuemax={80}
        aria-valuenow={splitRatio * 100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            setSplitRatio(Math.max(0.2, splitRatio - 0.05));
          } else if (e.key === "ArrowRight") {
            setSplitRatio(Math.min(0.8, splitRatio + 0.05));
          } else if (e.key === "Home") {
            setSplitRatio(0.2);
          } else if (e.key === "End") {
            setSplitRatio(0.8);
          }
        }}
      >
        <div className="dual-view-divider-handle" />
      </div>

      {/* Secondary (Right) */}
      <div
        className="dual-view-secondary"
        style={{ width: `${(1 - splitRatio) * 100}%` }}
      >
        {renderContent(secondary, "secondary")}
      </div>
    </div>
  );
}

