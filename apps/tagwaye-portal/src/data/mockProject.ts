export type TimelinePoint = {
  day: number;
  isoDate: string;
  lifecycle: string;
  progress: number;
  costDelta: number;
  energyDelta: number;
  assetHealth: number;
  safetyScore: number;
};

export const timelinePoints: TimelinePoint[] = [
  {
    day: 30,
    isoDate: "2025-02-15",
    lifecycle: "Plan",
    progress: 0.12,
    costDelta: -0.01,
    energyDelta: 0.02,
    assetHealth: 0.91,
    safetyScore: 0.98,
  },
  {
    day: 60,
    isoDate: "2025-03-17",
    lifecycle: "Program",
    progress: 0.24,
    costDelta: 0.0,
    energyDelta: 0.03,
    assetHealth: 0.88,
    safetyScore: 0.97,
  },
  {
    day: 90,
    isoDate: "2025-04-17",
    lifecycle: "Design",
    progress: 0.41,
    costDelta: 0.01,
    energyDelta: 0.0,
    assetHealth: 0.84,
    safetyScore: 0.96,
  },
  {
    day: 120,
    isoDate: "2025-05-17",
    lifecycle: "Build",
    progress: 0.57,
    costDelta: 0.03,
    energyDelta: -0.01,
    assetHealth: 0.78,
    safetyScore: 0.94,
  },
  {
    day: 156,
    isoDate: "2025-06-22",
    lifecycle: "Build",
    progress: 0.68,
    costDelta: 0.05,
    energyDelta: -0.04,
    assetHealth: 0.74,
    safetyScore: 0.92,
  },
  {
    day: 200,
    isoDate: "2025-08-05",
    lifecycle: "Commission",
    progress: 0.82,
    costDelta: 0.04,
    energyDelta: -0.05,
    assetHealth: 0.82,
    safetyScore: 0.95,
  },
  {
    day: 240,
    isoDate: "2025-09-14",
    lifecycle: "Operate",
    progress: 0.91,
    costDelta: 0.02,
    energyDelta: -0.08,
    assetHealth: 0.88,
    safetyScore: 0.97,
  },
];

export const lifecyclePhases = [
  { key: "Plan", startDay: 0, endDay: 45 },
  { key: "Program", startDay: 46, endDay: 75 },
  { key: "Design", startDay: 76, endDay: 120 },
  { key: "Build", startDay: 121, endDay: 190 },
  { key: "Commission", startDay: 191, endDay: 230 },
  { key: "Operate", startDay: 231, endDay: 365 },
  { key: "Renew", startDay: 366, endDay: 540 },
];

export type KpiSummary = {
  budget: string;
  scheduleVariance: string;
  energyVariance: string;
  safetyIncidents: string;
};

type DimensionKey = "time" | "cost" | "energy" | "assets" | "safety";

export const mockKpis: Record<DimensionKey, KpiSummary> = {
  time: {
    budget: "$2.4M",
    scheduleVariance: "-3 days",
    energyVariance: "-",
    safetyIncidents: "-",
  },
  cost: {
    budget: "$2.4M",
    scheduleVariance: "+$0.3M delta",
    energyVariance: "-",
    safetyIncidents: "-",
  },
  energy: {
    budget: "12% under",
    scheduleVariance: "Seasonal uptick",
    energyVariance: "-14% vs LY",
    safetyIncidents: "-",
  },
  assets: {
    budget: "84% health",
    scheduleVariance: "18 critical assets",
    energyVariance: "-",
    safetyIncidents: "-",
  },
  safety: {
    budget: "0 recordables",
    scheduleVariance: "4 audits due",
    energyVariance: "-",
    safetyIncidents: "0.98 compliance",
  },
};

export type ProjectSummary = {
  id: string;
  projectName: string;
  location: string;
  timezone: string;
  health: number;
  criticalRisks: string[];
  openWorkOrders: number;
  primaryAssetPath: string[];
};

export type TimelineSnapshot = {
  projectId: string;
  phases: typeof lifecyclePhases;
  points: TimelinePoint[];
  kpis: Record<DimensionKey, KpiSummary>;
};

export type SystemStatus = {
  projectId: string;
  connection: "live" | "offline" | "syncing";
  lastSyncIso: string;
  renderTimeMs: number;
  activeCollaborators: number;
};

const defaultProjectId = "proj_livingtwin_campus";

const projectSummaries: Record<string, ProjectSummary> = {
  [defaultProjectId]: {
    id: defaultProjectId,
    projectName: "Tagwaye LivingTwin Campus",
    location: "Lagos, Nigeria",
    timezone: "Africa/Lagos",
    health: 0.82,
    criticalRisks: [
      "HVAC North AHU-07 running 8% above plan",
      "Commissioning gate delayed awaiting permits",
    ],
    openWorkOrders: 27,
    primaryAssetPath: ["Building A", "Level 03", "HVAC North", "AHU-07"],
  },
};

const timelineSnapshots: Record<string, TimelineSnapshot> = {
  [defaultProjectId]: {
    projectId: defaultProjectId,
    phases: lifecyclePhases,
    points: timelinePoints,
    kpis: mockKpis,
  },
};

const systemStatusByProject: Record<string, SystemStatus> = {
  [defaultProjectId]: {
    projectId: defaultProjectId,
    connection: "live",
    lastSyncIso: new Date(Date.now() - 120_000).toISOString(),
    renderTimeMs: 47,
    activeCollaborators: 3,
  },
};

const simulateLatency = async <T,>(payload: T, delay = 320) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(payload), delay));

export async function fetchProjectSummary(
  projectId: string = defaultProjectId,
): Promise<ProjectSummary> {
  const summary = projectSummaries[projectId];
  if (!summary) {
    throw new Error(`Project ${projectId} not found`);
  }
  return simulateLatency(summary);
}

export async function fetchTimelineSnapshot(
  projectId: string = defaultProjectId,
): Promise<TimelineSnapshot> {
  const snapshot = timelineSnapshots[projectId];
  if (!snapshot) {
    throw new Error(`Timeline snapshot for ${projectId} not found`);
  }
  return simulateLatency(snapshot, 280);
}

export async function fetchSystemStatus(
  projectId: string = defaultProjectId,
): Promise<SystemStatus> {
  const status = systemStatusByProject[projectId];
  if (!status) {
    throw new Error(`System status for ${projectId} not found`);
  }
  const jitter = Math.round(Math.random() * 10);
  return simulateLatency(
    {
      ...status,
      renderTimeMs: status.renderTimeMs + jitter,
      lastSyncIso: new Date().toISOString(),
    },
    180,
  );
}

