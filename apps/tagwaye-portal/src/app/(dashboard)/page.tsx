import { lazy, Suspense } from "react";

// Lazy load heavy canvas component
const UniversalCanvas = lazy(() =>
  import("@/components/canvas/UniversalCanvas").then((mod) => ({
    default: mod.UniversalCanvas,
  })),
);

// Loading fallback
function CanvasLoadingFallback() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        minHeight: "100%",
        color: "var(--color-text-secondary)",
        fontSize: "var(--font-size-sm)",
      }}
    >
      <div className="loading-pulse">Loading canvas…</div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<CanvasLoadingFallback />}>
      <UniversalCanvas />
    </Suspense>
  );
}

