"use client";

import { useEffect, useRef, useMemo } from "react";
import type { DimensionKey } from "@/state/layout-store";
import type { TimelinePoint } from "@/data/mockProject";
import { getDimensionColor, getTokenValue, getColorWithOpacity } from "@/utils/design-tokens";

type Props = {
  dimension: DimensionKey;
  data: TimelinePoint[];
  currentDay: number;
  minDay: number;
  maxDay: number;
};

type VisualizationType = "gantt" | "stacked-area" | "line" | "heatmap" | "bar";

const dimensionToVisualization: Record<DimensionKey, VisualizationType> = {
  time: "gantt",
  cost: "stacked-area",
  energy: "line",
  assets: "heatmap",
  safety: "bar",
};

export function VisualizationCanvas({
  dimension,
  data,
  currentDay,
  minDay,
  maxDay,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const visualizationType = dimensionToVisualization[dimension];
  const dimensionColor = useMemo(() => getDimensionColor(dimension), [dimension]);

  // Setup high-DPI canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set actual size in memory (scaled for DPI)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale context for DPI
    ctx.scale(dpr, dpr);

    // Set display size (CSS pixels)
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }, []);

  // Render visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width * dpr, height * dpr);

    // Scale context for high-DPI
    ctx.save();
    ctx.scale(dpr, dpr);

    // Draw based on visualization type
    switch (visualizationType) {
      case "gantt":
        renderGanttChart(ctx, width, height, data, currentDay, minDay, maxDay);
        break;
      case "stacked-area":
        renderStackedAreaChart(
          ctx,
          width,
          height,
          data,
          currentDay,
          dimensionColor,
        );
        break;
      case "line":
        renderLineChart(ctx, width, height, data, currentDay, dimensionColor);
        break;
      case "heatmap":
        renderHeatmap(ctx, width, height, data, currentDay, dimensionColor);
        break;
      case "bar":
        renderBarChart(ctx, width, height, data, currentDay, dimensionColor);
        break;
    }

    // Draw current indicator
    drawCurrentIndicator(ctx, width, height, currentDay, minDay, maxDay);

    ctx.restore();
  }, [dimension, data, currentDay, minDay, maxDay, visualizationType, dimensionColor]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Trigger re-render
      canvas.dispatchEvent(new Event("resize"));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
      aria-label={`${dimension} visualization`}
    />
  );
}

// Gantt Chart (4D Time)
function renderGanttChart(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: TimelinePoint[],
  currentDay: number,
  minDay: number,
  maxDay: number,
) {
  const padding = { top: 20, right: 20, bottom: 40, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const rowHeight = 32;
  const taskPadding = 4;
  const totalDays = maxDay - minDay;

  // Example tasks (in real app, this would come from data)
  const tasks = [
    { name: "Foundation", startDay: 30, endDay: 60, status: "completed" },
    { name: "Structure", startDay: 60, endDay: 120, status: "active" },
    { name: "MEP", startDay: 120, endDay: 180, status: "upcoming" },
    { name: "Finishes", startDay: 180, endDay: 240, status: "upcoming" },
  ];

  // Draw tasks
  tasks.forEach((task, index) => {
    const y = padding.top + index * rowHeight + taskPadding;
    const x =
      padding.left + ((task.startDay - minDay) / totalDays) * chartWidth;
    const taskWidth =
      ((task.endDay - task.startDay) / totalDays) * chartWidth;
    const taskHeight = rowHeight - taskPadding * 2;

    const isComplete = currentDay >= task.endDay;
    const isActive = currentDay >= task.startDay && currentDay < task.endDay;

    // Task bar color - use design tokens
    if (isComplete) {
      ctx.fillStyle = getColorWithOpacity("--color-success", 0.8);
    } else if (isActive) {
      ctx.fillStyle = getColorWithOpacity("--dimension-4d-color", 0.8);
    } else {
      ctx.fillStyle = getColorWithOpacity("--color-text-tertiary", 0.3);
    }

    ctx.fillRect(x, y, taskWidth, taskHeight);

    // Task label
    ctx.fillStyle = getTokenValue("--color-text-primary") || getTokenValue("--color-bg-primary");
    ctx.font = "12px var(--font-family, system-ui)";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(task.name, padding.left + 4, y + taskHeight / 2);
  });

  // Draw grid
  drawGrid(ctx, width, height, padding, minDay, maxDay, totalDays);
}

// Stacked Area Chart (5D Cost)
function renderStackedAreaChart(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: TimelinePoint[],
  currentDay: number,
  color: string,
) {
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  if (data.length === 0) return;

  const values = data.map((d) => Math.abs(d.costDelta) * 100);
  const maxValue = Math.max(...values, 1);
  const xStep = chartWidth / (data.length - 1 || 1);

  // Create gradient
  const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  gradient.addColorStop(0, color + "80");
  gradient.addColorStop(1, color + "10");

  // Draw area
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(padding.left, height - padding.bottom);

  data.forEach((point, index) => {
    const x = padding.left + index * xStep;
    const y = height - padding.bottom - (values[index] / maxValue) * chartHeight;
    if (index === 0) {
      ctx.lineTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.lineTo(padding.left + (data.length - 1) * xStep, height - padding.bottom);
  ctx.closePath();
  ctx.fill();

  // Draw line
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.forEach((point, index) => {
    const x = padding.left + index * xStep;
    const y = height - padding.bottom - (values[index] / maxValue) * chartHeight;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw grid
  drawGrid(ctx, width, height, padding, data[0]?.day || 0, data[data.length - 1]?.day || 365, 365);
}

// Line Chart (6D Energy)
function renderLineChart(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: TimelinePoint[],
  currentDay: number,
  color: string,
) {
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  if (data.length === 0) return;

  const values = data.map((d) => Math.abs(d.energyDelta) * 100);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;
  const xStep = chartWidth / (data.length - 1 || 1);

  // Draw line
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.forEach((point, index) => {
    const x = padding.left + index * xStep;
    const y =
      height -
      padding.bottom -
      ((values[index] - minValue) / range) * chartHeight;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw points
  ctx.fillStyle = color;
  data.forEach((point, index) => {
    const x = padding.left + index * xStep;
    const y =
      height -
      padding.bottom -
      ((values[index] - minValue) / range) * chartHeight;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw grid
  drawGrid(ctx, width, height, padding, data[0]?.day || 0, data[data.length - 1]?.day || 365, 365);
}

// Heatmap (7D Assets)
function renderHeatmap(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: TimelinePoint[],
  currentDay: number,
  color: string,
) {
  const padding = { top: 20, right: 20, bottom: 40, left: 20 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  if (data.length === 0) return;

  const cellWidth = chartWidth / data.length;
  const cellHeight = chartHeight / 7; // 7 days per week

  data.forEach((point, index) => {
    const x = padding.left + index * cellWidth;
    const value = point.assetHealth;
    
    // Color intensity based on value
    const intensity = Math.round(value * 255);
    ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${value})`;
    
    for (let row = 0; row < 7; row++) {
      const y = padding.top + row * cellHeight;
      ctx.fillRect(x, y, cellWidth - 2, cellHeight - 2);
    }
  });
}

// Bar Chart (8D Safety)
function renderBarChart(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: TimelinePoint[],
  currentDay: number,
  color: string,
) {
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  if (data.length === 0) return;

  const values = data.map((d) => d.safetyScore * 100);
  const maxValue = Math.max(...values, 1);
  const barWidth = chartWidth / data.length - 4;

  data.forEach((point, index) => {
    const x = padding.left + index * (barWidth + 4);
    const barHeight = (values[index] / maxValue) * chartHeight;
    const y = height - padding.bottom - barHeight;

    // Past vs future color
    const isPast = point.day <= currentDay;
    ctx.fillStyle = isPast
      ? color
      : color.replace("ff", "40"); // Lighter for future

    ctx.fillRect(x, y, barWidth, barHeight);

    // Value label
    ctx.fillStyle = getTokenValue("--color-text-primary") || getTokenValue("--color-bg-primary");
    ctx.font = "11px var(--font-family, system-ui)";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(
      `${Math.round(values[index])}%`,
      x + barWidth / 2,
      y - 4,
    );
  });

  // Draw grid
  drawGrid(ctx, width, height, padding, data[0]?.day || 0, data[data.length - 1]?.day || 365, 365);
}

// Current indicator (vertical line)
function drawCurrentIndicator(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  currentDay: number,
  minDay: number,
  maxDay: number,
) {
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const totalDays = maxDay - minDay;

  const currentX =
    padding.left + ((currentDay - minDay) / totalDays) * chartWidth;

  ctx.strokeStyle = getColorWithOpacity("--dimension-4d-color", 0.8);
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(currentX, padding.top);
  ctx.lineTo(currentX, height - padding.bottom);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Grid helper
function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number },
  minDay: number,
  maxDay: number,
  totalDays: number,
) {
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.strokeStyle = getTokenValue("--color-border-subtle") || getColorWithOpacity("--color-text-primary", 0.1);
  ctx.lineWidth = 1;

  // Horizontal grid lines
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (i / gridLines) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  // Vertical grid lines (month markers)
  const months = Math.ceil(totalDays / 30);
  for (let i = 0; i <= months; i++) {
    const x =
      padding.left + (i / months) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, height - padding.bottom);
    ctx.stroke();
  }
}

