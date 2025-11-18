"use client";

import { useMemo } from "react";
import {
  LuClock,
  LuDollarSign,
  LuZap,
  LuBox,
  LuShield,
  LuCheckCircle,
  LuAlertTriangle,
  LuTrendingUp,
  LuTrendingDown,
  LuPieChart,
  LuLeaf,
  LuSun,
  LuWrench,
  LuAlertCircle,
} from "lucide-react";
import type { DimensionKey } from "@/state/layout-store";
import type { KpiSummary } from "@/data/mockProject";
import clsx from "clsx";

type Props = {
  dimension: DimensionKey;
  kpis: KpiSummary;
  currentDay: number;
};

type KPIItem = {
  icon: typeof LuClock;
  label: string;
  value: string | number;
  unit?: string;
  trend?: "positive" | "negative" | "neutral";
  trendValue?: string;
  status?: "success" | "warning" | "error";
};

// Dimension-specific KPI configurations
const dimensionKPIs: Record<DimensionKey, (kpis: KpiSummary, day: number) => KPIItem[]> = {
  time: (kpis, day) => [
    {
      icon: LuClock,
      label: "Schedule",
      value: "-3",
      unit: "days",
      trend: "negative",
      trendValue: "2%",
      status: "warning",
    },
    {
      icon: LuCheckCircle,
      label: "Tasks Complete",
      value: "47/65",
      unit: "",
      trend: "positive",
      trendValue: "72%",
    },
    {
      icon: LuAlertTriangle,
      label: "Critical Path",
      value: "3",
      unit: "tasks",
      status: "error",
    },
  ],
  cost: (kpis, day) => [
    {
      icon: LuDollarSign,
      label: "Budget",
      value: "+$45K",
      unit: "",
      trend: "negative",
      trendValue: "2.1%",
      status: "warning",
    },
    {
      icon: LuTrendingUp,
      label: "Burn Rate",
      value: "$125K",
      unit: "/week",
      trend: "neutral",
    },
    {
      icon: LuPieChart,
      label: "Contingency",
      value: "$180K",
      unit: "remaining",
      trend: "positive",
    },
  ],
  energy: (kpis, day) => [
    {
      icon: LuZap,
      label: "Energy",
      value: "12%",
      unit: "under target",
      trend: "positive",
      status: "success",
    },
    {
      icon: LuLeaf,
      label: "Carbon",
      value: "245",
      unit: "tons CO₂",
      trend: "negative",
      trendValue: "5%",
    },
    {
      icon: LuSun,
      label: "Solar",
      value: "85%",
      unit: "generation",
      trend: "positive",
    },
  ],
  assets: (kpis, day) => [
    {
      icon: LuBox,
      label: "Uptime",
      value: "98.5%",
      unit: "",
      trend: "positive",
      status: "success",
    },
    {
      icon: LuWrench,
      label: "Work Orders",
      value: "12",
      unit: "open",
      trend: "neutral",
    },
    {
      icon: LuAlertCircle,
      label: "Critical Assets",
      value: "3",
      unit: "",
      status: "warning",
    },
  ],
  safety: (kpis, day) => [
    {
      icon: LuShield,
      label: "Incidents",
      value: "0",
      unit: "this month",
      trend: "positive",
      status: "success",
    },
    {
      icon: LuAlertTriangle,
      label: "Near Misses",
      value: "2",
      unit: "",
      trend: "negative",
    },
    {
      icon: LuCheckCircle,
      label: "Inspections",
      value: "15/15",
      unit: "complete",
      trend: "positive",
    },
  ],
};

export function KPIPanel({ dimension, kpis, currentDay }: Props) {
  const items = useMemo(
    () => dimensionKPIs[dimension](kpis, currentDay),
    [dimension, kpis, currentDay],
  );

  return (
    <div
      className="kpi-panel"
      role="region"
      aria-label={`${dimension} key performance indicators`}
    >
      {items.map((item, index) => (
        <KPIItem key={`${item.label}-${index}`} item={item} />
      ))}
    </div>
  );
}

function KPIItem({ item }: { item: KPIItem }) {
  const Icon = item.icon;

  return (
    <div
      className={clsx("kpi-item", item.status && `kpi-item--${item.status}`)}
      role="button"
      tabIndex={0}
      aria-label={`${item.label}: ${item.value} ${item.unit || ""}`}
    >
      <div className="kpi-icon">
        <Icon size={16} aria-hidden="true" />
      </div>
      <div className="kpi-content">
        <span className="kpi-label">{item.label}</span>
        <span className="kpi-value">
          {item.value} {item.unit && <span className="kpi-unit">{item.unit}</span>}
          {item.trend && item.trend !== "neutral" && (
            <span
              className={clsx(
                "kpi-trend",
                `kpi-trend--${item.trend}`,
              )}
            >
              {item.trend === "positive" ? (
                <LuTrendingUp size={12} aria-hidden="true" />
              ) : (
                <LuTrendingDown size={12} aria-hidden="true" />
              )}
              {item.trendValue && (
                <span className="kpi-trend-value">{item.trendValue}</span>
              )}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

