# Tagwaye Backend Roadmap

## 1. Service Topology
- **Gateway:** Next.js app proxies `/api` to `apps/api`. Utilizes Next middleware for auth headers.
- **Core API:** NestJS 11 monolith with modular domains:
  - `projects` (portfolios, spatial hierarchy, metadata)
  - `assets` (LivingTwin asset registry, telemetry streams)
  - `timelines` (lifecycle phases, milestones, scenarios)
  - `analytics` (KPI aggregations, chart data, ECharts payload builders)
  - `intelligence` (AI recommendations, explanations, approval logs)
- **Realtime Transport:** NestJS WebSocket gateway w/ Redis pub/sub (or Ably) for timeline scrub sync, presence, telemetry pulses.
- **Persistence:** PostgreSQL 16 w/ Prisma ORM. TimescaleDB extension for telemetry/time-series; S3/Blob for FRAG assets.
- **AI Services:** Sage agent accessible via internal HTTP client. Responses persisted via `intelligence` module.

## 2. Data Contracts (WIP)

### Project
```json
{
  "id": "proj_123",
  "name": "LivingTwin HQ",
  "status": "operate",
  "timezone": "America/Chicago",
  "createdAt": "2025-10-04T12:00:00Z"
}
```

### Asset
```json
{
  "id": "asset_ahu_07",
  "projectId": "proj_123",
  "discipline": "HVAC",
  "location": ["Building A", "Level 03", "North Wing"],
  "telemetryTopics": ["ahu_07/temperature", "ahu_07/energy"],
  "fragUri": "s3://tagwaye-frag/proj_123/ahu_07.frag"
}
```

### Timeline Snapshot
```json
{
  "projectId": "proj_123",
  "phase": "Operate",
  "cursor": "2031-06-05T08:00:00Z",
  "dimensions": {
    "time": { "plannedDays": 820, "actualDays": 815 },
    "cost": { "baseline": 2400000, "actual": 2320000 },
    "energy": { "baselineKwh": 120000, "actualKwh": 105000 },
    "assets": { "online": 486, "atRisk": 12 },
    "safety": { "incidents": 0 }
  }
}
```

## 3. API Surface

| Method | Route | Description | Notes |
| --- | --- | --- | --- |
| GET | `/projects` | Paginated projects, search, role filtering | Query params: `q`, `status`, `limit` |
| GET | `/projects/:id` | Project detail w/ breadcrumbs | Includes linked LivingTwin metadata |
| GET | `/projects/:id/timeline` | Lifecycle data, scenario overlays | Accepts `dimension`, `scenarioId` |
| POST | `/timelines/:id/scrub` | Persist scrub cursor & contextual selection | Powers continuity principle |
| GET | `/assets/:id` | Asset detail, FRAG pointer, telemetry config | Panel uses this payload |
| GET | `/assets/:id/telemetry` | Aggregated telemetry windows | `interval`, `dimension` params |
| POST | `/intelligence/recommendations` | Ask Sage requests | Body includes context, selection, user info |
| PATCH | `/intelligence/recommendations/:id` | Approve/dismiss AI suggestions | Audit log |
| WS | `/realtime` | Timeline scrub, presence, telemetry streaming | Topics: `cursor`, `selection`, `presence` |

## 4. Module Responsibilities

- **ProjectsModule:** Query builders, caching (Redis) for nav lists, ensures breadcrumb data for footer.
- **AssetsModule:** Manages FRAG manifests, handles `@thatopen/fragments` token issuance, ties to telemetry.
- **TimelinesModule:** Houses lifecycle math, scenario diffs, milestone snapping rules mirrored in frontend.
- **AnalyticsModule:** Builds KPI datasets consumed by ECharts; uses Timescale continuous aggregates.
- **IntelligenceModule:** Brokers requests to Sage, stores responses, enforces "AI suggests, user decides."
- **RealtimeGateway:** Authenticates WS clients via JWT, emits `cursor:update`, `presence:update`, `telemetry:tick`.

## 5. Delivery Plan
1. **Sprint 1:** Scaffold NestJS app, set up Prisma schemas for projects/assets/timelines, seed sample data.
2. **Sprint 2:** Implement read APIs for projects, assets, timeline snapshots + mock intelligence endpoints.
3. **Sprint 3:** Wire realtime gateway for timeline cursor + collaboration presence.
4. **Sprint 4:** Add telemetry aggregation endpoints, connect to actual sensor feeds or simulated publisher.
5. **Sprint 5:** Harden security (RBAC, audit logging), finalize AI approval flows, add observability dashboards.

## 6. Integration Notes
- Shared TypeScript types exported via `packages/contracts` (generated from Nest Swagger/OpenAPI).
- React Query clients auto-generated w/ `openapi-typescript` to reduce drift.
- Use `@tagwaye/event-bus` (Node EventEmitter wrapper) for cross-module events (e.g., when timeline cursor changes, broadcast to analytics + realtime channels).
- Observability: OpenTelemetry traces, structured logging, and SLOs (timeline snapshot <250 ms P95, telemetry endpoint <400 ms P95).

