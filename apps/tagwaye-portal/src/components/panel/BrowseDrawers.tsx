"use client";

import { Search, Star, Filter, ChevronRight, Building2, Layers } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { Drawer } from "./Drawer";
import { useLayoutStore } from "@/state/layout-store";
import { useDebounce } from "@/hooks/useDebounce";

export function BrowseDrawers() {
  const selectedAssetPath = useLayoutStore((state) => state.selectedAssetPath);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Debounce search input (300ms per spec)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  return (
    <div className="space-y-2">
      {/* Hierarchy Drawer - Default Open */}
      <Drawer
        id="hierarchy"
        title="Hierarchy"
        defaultOpen={true}
        icon={<Building2 style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-1">
          {["Building A", "Level 03", "HVAC North", "AHU-07"].map(
            (item, index) => {
              const isSelected = selectedAssetPath.includes(item);
              const isLast = index === 3;
              return (
                <button
                  key={item}
                  type="button"
                  className={clsx(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors",
                    isSelected
                      ? "bg-[var(--color-accent)]/12 text-[var(--color-accent)]"
                      : "hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]",
                  )}
                  style={{
                    fontSize: "var(--font-size-sm)",
                    paddingLeft: `${12 + index * 16}px`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {index === 0 ? (
                      <Building2 style={{ width: "16px", height: "16px" }} />
                    ) : index < 3 ? (
                      <Layers style={{ width: "16px", height: "16px" }} />
                    ) : null}
                    <span>{item}</span>
                  </div>
                  {isLast ? (
                    <span
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--color-success)",
                      }}
                    >
                      Live
                    </span>
                  ) : (
                    <ChevronRight
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "var(--color-text-secondary)",
                      }}
                    />
                  )}
                </button>
              );
            },
          )}
        </div>
      </Drawer>

      {/* Search Drawer - Default Collapsed */}
      <Drawer
        id="search"
        title="Search"
        defaultOpen={false}
        icon={<Search style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Find asset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            style={{
              fontSize: "var(--font-size-sm)",
              borderColor: "var(--color-border)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text-primary)",
            }}
          />
          <div className="space-y-2">
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "var(--letter-spacing-wide)",
              }}
            >
              Filters
            </p>
            <select
              className="w-full rounded-md border px-3 py-2"
              style={{
                fontSize: "var(--font-size-sm)",
                borderColor: "var(--color-border)",
                background: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
              }}
            >
              <option>All Types</option>
              <option>HVAC</option>
              <option>Electrical</option>
              <option>Plumbing</option>
            </select>
          </div>
        </div>
      </Drawer>

      {/* Favorites Drawer - Default Collapsed */}
      <Drawer
        id="favorites"
        title="Favorites"
        defaultOpen={false}
        icon={<Star style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-2">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
            style={{
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-primary)",
            }}
          >
            <Star style={{ width: "16px", height: "16px", color: "var(--color-warning)" }} />
            <span>AHU-07</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md border border-dashed px-3 py-2 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
            style={{
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
              borderColor: "var(--color-border)",
            }}
          >
            <span>+ Add Current Asset</span>
          </button>
        </div>
      </Drawer>

      {/* Filters Drawer - Default Collapsed */}
      <Drawer
        id="filters"
        title="Filters"
        defaultOpen={false}
        icon={<Filter style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-3">
          <div className="space-y-2">
            <label
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "var(--letter-spacing-wide)",
              }}
            >
              System Type
            </label>
            <select
              className="w-full rounded-md border px-3 py-2"
              style={{
                fontSize: "var(--font-size-sm)",
                borderColor: "var(--color-border)",
                background: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
              }}
            >
              <option>All</option>
              <option>HVAC</option>
              <option>Electrical</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-md border px-3 py-2 transition-colors hover:bg-[var(--color-bg-secondary)]"
              style={{
                fontSize: "var(--font-size-sm)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            >
              Apply
            </button>
            <button
              type="button"
              className="flex-1 rounded-md border px-3 py-2 transition-colors hover:bg-[var(--color-bg-secondary)]"
              style={{
                fontSize: "var(--font-size-sm)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

