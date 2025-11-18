"use client";

import { Activity, AlertTriangle, Bell, Clock, ThermometerSun, Gauge, Zap } from "lucide-react";
import { Drawer } from "./Drawer";
import { useLayoutStore } from "@/state/layout-store";

export function MonitorDrawers() {
  const selectedAssetPath = useLayoutStore((state) => state.selectedAssetPath);
  const hasSelectedAsset = selectedAssetPath.length > 0;

  return (
    <div className="space-y-2">
      {/* Live Data Drawer - Auto-expands on asset selection */}
      <Drawer
        id="live-data"
        title={`Live Data${hasSelectedAsset ? ` (${selectedAssetPath[selectedAssetPath.length - 1]})` : ""}`}
        defaultOpen={hasSelectedAsset}
        icon={<Activity style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ThermometerSun style={{ width: "16px", height: "16px", color: "var(--color-warning)" }} />
              <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>
                Temperature: 72.3°F
              </span>
            </div>
            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", paddingLeft: "24px" }}>
              ↑ 1.2° from avg
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Gauge style={{ width: "16px", height: "16px", color: "var(--color-success)" }} />
              <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>
                Airflow: 1,245 CFM
              </span>
            </div>
            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", paddingLeft: "24px" }}>
              ↓ 55 CFM from target
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap style={{ width: "16px", height: "16px", color: "var(--color-accent)" }} />
              <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>
                Power: 4.2 kW
              </span>
            </div>
            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", paddingLeft: "24px" }}>
              Normal range
            </p>
          </div>
          <button
            type="button"
            className="w-full rounded-md border px-3 py-2 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
            style={{
              fontSize: "var(--font-size-sm)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            View All Sensors →
          </button>
        </div>
      </Drawer>

      {/* Alerts Drawer - Default open if alerts present */}
      <Drawer
        id="alerts"
        title="Alerts"
        defaultOpen={true}
        icon={<AlertTriangle style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-3">
          <div className="rounded-md border px-3 py-2" style={{ borderColor: "var(--color-warning)", background: "var(--color-warning-10)" }}>
            <div className="flex items-start gap-2">
              <AlertTriangle style={{ width: "16px", height: "16px", color: "var(--color-warning)", marginTop: "2px" }} />
              <div className="flex-1">
                <p style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>
                  High Temperature
                </p>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                  Zone 3 exceeds threshold (75°F)
                </p>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                  2 hours ago
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-md border px-3 py-2" style={{ borderColor: "var(--color-accent)", background: "var(--color-accent-10)" }}>
            <div className="flex items-start gap-2">
              <Bell style={{ width: "16px", height: "16px", color: "var(--color-accent)", marginTop: "2px" }} />
              <div className="flex-1">
                <p style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>
                  Maintenance Due
                </p>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                  Scheduled maintenance in 5 days
                </p>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                  1 day ago
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="w-full rounded-md border px-3 py-2 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
            style={{
              fontSize: "var(--font-size-sm)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            View All Alerts →
          </button>
        </div>
      </Drawer>

      {/* Alarms Drawer - Default collapsed */}
      <Drawer
        id="alarms"
        title="Alarms"
        defaultOpen={false}
        icon={<Bell style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md border px-3 py-2" style={{ borderColor: "var(--color-error)", background: "var(--color-error-10)" }}>
            <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>
              🔴 Critical: 0
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md border px-3 py-2" style={{ borderColor: "var(--color-warning)", background: "var(--color-warning-10)" }}>
            <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>
              🟡 Warning: 2
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md border px-3 py-2" style={{ borderColor: "var(--color-accent)", background: "var(--color-accent-10)" }}>
            <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>
              🔵 Info: 5
            </span>
          </div>
          <button
            type="button"
            className="w-full rounded-md border px-3 py-2 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
            style={{
              fontSize: "var(--font-size-sm)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            View All →
          </button>
        </div>
      </Drawer>

      {/* History Drawer - Default collapsed */}
      <Drawer
        id="history"
        title="History"
        defaultOpen={false}
        icon={<Clock style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-3">
          <div className="space-y-2">
            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "var(--letter-spacing-wide)" }}>
              Timeline: Last 24 hours
            </p>
            <div className="space-y-2">
              <div className="rounded-md border px-3 py-2" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-secondary)" }}>
                <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>
                  • 2:30 PM: Temperature spike
                </p>
              </div>
              <div className="rounded-md border px-3 py-2" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-secondary)" }}>
                <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>
                  • 10:15 AM: Filter replaced
                </p>
              </div>
              <div className="rounded-md border px-3 py-2" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-secondary)" }}>
                <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>
                  • 9:00 AM: Routine check
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="w-full rounded-md border px-3 py-2 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
            style={{
              fontSize: "var(--font-size-sm)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            View Full History →
          </button>
        </div>
      </Drawer>
    </div>
  );
}

