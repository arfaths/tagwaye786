"use client";

import { TrendingUp, GitCompare, FileText, Sparkles, Activity } from "lucide-react";
import { Drawer } from "./Drawer";

export function AnalyzeDrawers() {
  return (
    <div className="space-y-2">
      {/* Trends Drawer - Default open */}
      <Drawer
        id="trends"
        title="Trends"
        defaultOpen={true}
        icon={<TrendingUp style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-3">
          <select
            className="w-full rounded-md border px-3 py-2"
            style={{
              fontSize: "var(--font-size-sm)",
              borderColor: "var(--color-border)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text-primary)",
            }}
          >
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Custom range</option>
          </select>
          <div className="rounded-md border px-3 py-4" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-secondary)", minHeight: "120px" }}>
            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", textAlign: "center" }}>
              [Chart: Temperature over time]
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
            + Add Metric
          </button>
        </div>
      </Drawer>

      {/* Comparisons Drawer - Default collapsed */}
      <Drawer
        id="comparisons"
        title="Comparisons"
        defaultOpen={false}
        icon={<GitCompare style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-3">
          <div className="space-y-2">
            <label style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
              Compare: AHU-07 vs
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
              <option>Select Asset</option>
              <option>AHU-08</option>
              <option>AHU-09</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-md border px-3 py-4" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-secondary)" }}>
            <div>
              <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>AHU-07</p>
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>72°F</p>
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>1,245 CFM</p>
            </div>
            <div>
              <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>AHU-08</p>
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>68°F</p>
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>1,180 CFM</p>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Reports Drawer - Default collapsed */}
      <Drawer
        id="reports"
        title="Reports"
        defaultOpen={false}
        icon={<FileText style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-2">
          <button
            type="button"
            className="w-full rounded-md border px-3 py-2 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
            style={{
              fontSize: "var(--font-size-sm)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            • Energy Efficiency Report
          </button>
          <button
            type="button"
            className="w-full rounded-md border px-3 py-2 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
            style={{
              fontSize: "var(--font-size-sm)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            • Maintenance Summary
          </button>
          <button
            type="button"
            className="w-full rounded-md border px-3 py-2 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
            style={{
              fontSize: "var(--font-size-sm)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            • Performance Analysis
          </button>
          <button
            type="button"
            className="w-full rounded-md border px-3 py-2 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
            style={{
              fontSize: "var(--font-size-sm)",
              borderColor: "var(--color-border)",
              color: "var(--color-accent)",
            }}
          >
            Generate New Report →
          </button>
        </div>
      </Drawer>

      {/* Forecasting Drawer - Default collapsed */}
      <Drawer
        id="forecasting"
        title="Forecasting"
        defaultOpen={false}
        icon={<Sparkles style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-3">
          <div className="rounded-md border px-3 py-3" style={{ borderColor: "var(--color-accent)", background: "var(--color-accent-10)" }}>
            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", marginBottom: "8px" }}>
              🔮 Next 7 days:
            </p>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)", marginBottom: "4px" }}>
              Predicted failure risk: Low
            </p>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>
              Maintenance suggested: Day 5
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
            View Detailed Forecast →
          </button>
        </div>
      </Drawer>

      {/* AI Intelligence Drawer - Keep existing */}
      <Drawer
        id="intelligence"
        title="AI Intelligence"
        defaultOpen={true}
        icon={<Activity style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-2">
          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
            Recommendation: Slow HVAC ramp by 8% for cost parity.
          </p>
          <button
            type="button"
            className="rounded-full border px-3 py-1"
            style={{
              fontSize: "var(--font-size-xs)",
              borderColor: "var(--color-success)",
              color: "var(--color-success)",
            }}
          >
            View Rationale
          </button>
        </div>
      </Drawer>

      {/* Telemetry Drawer - Keep existing */}
      <Drawer
        id="telemetry"
        title="Telemetry Snapshots"
        defaultOpen={false}
        icon={<Activity style={{ width: "16px", height: "16px", color: "var(--color-text-secondary)" }} />}
      >
        <div className="space-y-2">
          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
            Flow: 18.2 m³/s • Duct pressure trending stable.
          </p>
          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
            Vibration signature within tolerance bands.
          </p>
        </div>
      </Drawer>
    </div>
  );
}

