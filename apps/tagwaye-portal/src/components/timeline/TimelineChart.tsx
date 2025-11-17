"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { DimensionKey } from "@/state/layout-store";
import type { TimelinePoint } from "@/data/mockProject";

type Props = {
  dimension: DimensionKey;
  data: TimelinePoint[];
};

const dimensionToField: Record<DimensionKey, keyof TimelinePoint> = {
  time: "progress",
  cost: "costDelta",
  energy: "energyDelta",
  assets: "assetHealth",
  safety: "safetyScore",
};

export function TimelineChart({ dimension, data }: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "canvas",
    });

    chart.setOption({
      grid: { left: 20, right: 10, top: 10, bottom: 20 },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((point) => point.isoDate),
        axisLabel: {
          color: "#94a3b8",
          formatter: (value: string) => value.slice(5),
        },
        axisLine: { lineStyle: { color: "#1f2937" } },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#94a3b8",
          formatter: (value: number) =>
            dimension === "time"
              ? `${Math.round(value * 100)}%`
              : dimension === "assets" || dimension === "safety"
                ? `${Math.round(value * 100)}%`
                : `${Math.round(value * 100) / 100}`,
        },
        splitLine: { lineStyle: { color: "#0f172a" } },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#020617",
        borderColor: "#22d3ee",
        textStyle: { color: "#f8fafc" },
      },
      series: [
        {
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            color: "#34d399",
            width: 3,
          },
          areaStyle: {
            color: "rgba(16, 185, 129, 0.15)",
          },
          itemStyle: {
            color: "#34d399",
            borderColor: "#ecfccb",
          },
          data: data.map((point) => point[dimensionToField[dimension]]),
        },
      ],
    });

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, [dimension, data]);

  return <div ref={chartRef} className="h-48 w-full" />;
}

