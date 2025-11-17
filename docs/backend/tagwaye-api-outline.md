# Tagwaye Service & API Outline

**Revision:** 2025-11-17  
**Owner:** Platform Engineering  
**Scope:** Backend services that power the Tagwaye LivingTwin portal.

---

## 1. Architecture at a Glance
- **Gateway:** Fastify edge (NestJS `@nestjs/platform-fastify`) exposing REST + GraphQL endpoints under `api.tagwaye.local`. Handles auth (JWT + OIDC), caching, rate limiting.
- **Service Mesh:** Modular NestJS services communicating via NATS JetStream events.
- **Primary Services:**
  1. **Twin Catalog Service** — assets, spaces, hierarchy, metadata.
  2. **Telemetry Service** — time-series ingestion, KPI aggregations.
  3. **Scenario Engine** — stores simulation runs, deltas, AI recommendations.
  4. **Timeline Service** — lifecycle milestones, scenarios, scrubbing snapshots.
  5. **Collaboration Service** — presence, annotations, work orders.
- **Storage:** PostgreSQL 16 (catalog + transactional); TimescaleDB extension for telemetry; Redis for low-latency state (presence, layout preferences).
- **Streaming:** WebSocket gateway (Nest `@nestjs/websockets`) delivering timeline scrub updates, selection sync, AI assistant responses.

---

## 2. API Contract Highlights
### 2.1 REST Endpoints
| Method | Endpoint | Description | Notes |
| --- | --- | --- | --- |
| GET | `/v1/projects/:id` | Fetch project shell, KPIs, layout + persona config | Backed by Twin Catalog |
| GET | `/v1/projects/:id/assets/:assetId` | Asset tree payload for Panel Browse | Includes telemetry handles |
| GET | `/v1/projects/:id/timeline` | Lifecycle metadata + scenario markers | Powers timeline pills |
| POST | `/v1/projects/:id/scenarios` | Create scenario comparison run | Calls Scenario Engine |
| GET | `/v1/projects/:id/kpis` | Aggregated KPI rail data, dimension aware | caches (5s) |
| GET | `/v1/projects/:id/presence` | Live collaborator list + cursors | Proxy to Collaboration svc |
| POST | `/v1/ai/sage` | Forward prompt to Sage assistant | SSE/WebSocket stream |

### 2.2 GraphQL Schema (excerpt)
```graphql
type Query {
  project(id: ID!): Project!
  timeline(projectId: ID!, dimension: Dimension!): TimelinePayload!
  asset(id: ID!): Asset!
}

type TimelinePayload {
  phases: [LifecyclePhase!]!
  points: [TimelinePoint!]!
  kpis: [KpiEdge!]!
}
```
GraphQL primarily feeds the panel + timeline slices; REST remains for coarse caching.

### 2.3 Realtime Channels
- `ws://api.tagwaye.local/live/:projectId`
  - Events:
    - `timeline.scrub` — `{ projectId, cursorDay, isoDate }`
    - `selection.change` — `{ assetId, userId, context }`
    - `ai.recommendation` — streaming AI explanations to Panel Analyze pane.
  - Backed by Redis pub/sub fan-out.

---

## 3. Domain Models (TypeScript)
```ts
// shared/contracts/project.ts
export interface ProjectSummaryDto {
  id: string;
  name: string;
  location: string;
  healthScore: number;
  defaultViewMode: "single" | "dual";
  timelinePhase: string;
}

// shared/contracts/timeline.ts
export interface TimelinePointDto {
  day: number;
  isoDate: string;
  lifecycle: string;
  progress: number;
  costDelta: number;
  energyDelta: number;
  assetHealth: number;
  safetyScore: number;
}

export interface KpiDto {
  dimension: "time" | "cost" | "energy" | "assets" | "safety";
  label: string;
  value: string;
  delta?: string;
}
```
These DTOs back the frontend React Query hooks to keep type parity.

---

## 4. NestJS Project Layout
```
apps/
  api-gateway/
    src/main.ts
    src/app.module.ts
    src/modules/
      projects/
      timeline/
      telemetry/
      collaboration/
  timelines-service/
  telemetry-service/
packages/
  contracts/        // shared DTOs, OpenAPI schema
  event-bus/        // NATS wrappers, interceptors
```
Use `@nestjs/microservices` for JetStream transport; each bounded context registers OpenAPI + GraphQL schemas exported to `/contracts` for frontend consumption.

---

## 5. Security & Observability
- OAuth2/OIDC via Azure AD; tokens verified inside gateway guard.
- Attribute-level role enforcement: `@Roles("cxo", "bim-specialist")` + ABAC policy engine (Open Policy Agent sidecar).
- Logs: OpenTelemetry w/ OTLP exporter → Grafana Cloud.
- Metrics: Prometheus scraping Nest metrics endpoint; key SLIs (timeline publish latency < 150 ms).
- Traces connect frontend timeline scrub event to backend event bus for debugging.

---

## 6. Next Steps
1. Scaffold `apps/api-gateway` via Nest CLI with Fastify adapter and health check route.
2. Create `packages/contracts` and publish locally for the Next.js app to consume (generated via `nx g @nestjs/swagger`).
3. Prototype `timeline` module returning mock data from the same source as the frontend to validate contracts.
4. Stand up NATS JetStream locally (Docker Compose) and wire `timeline.scrub` event loop to the WebSocket gateway.

