# Technology Stack & Architecture Specification

## 1. Approved Technology Stack & Installed Versions

| Layer | Selected Technology | Installed Version | Justification & Rationale |
|---|---|---|---|
| **Runtime** | Node.js | v24.19.0 (LTS >=20.x) | Active Node runtime with native ESM support. |
| **Frontend Framework** | React + TypeScript | React ^18.3.1, TS ^5.7.3 | Declarative UI with component-driven state model. Full static typing ensures API contract alignment. |
| **Build Tool** | Vite | ^5.4.21 | Instant HMR and fast production bundling. |
| **Styling** | Tailwind CSS | ^3.4.17 | Modern utility-first styling with responsive breakpoint system. |
| **Routing** | React Router DOM | ^6.28.1 | Declarative client-side routing. |
| **Form Management & Validation** | React Hook Form + Zod | `react-hook-form` ^7.54.2, `zod` ^3.24.2 | Uncontrolled components with high performance and shared Zod schemas. |
| **Icons** | Lucide React | ^0.475.0 | Lightweight modern SVG icons. |
| **Backend Framework** | Node.js + Express (TypeScript) | Express ^4.21.2, TS ^5.7.3 | Robust modular monolith architecture with transparent middleware control. |
| **Database & ORM** | SQLite + Prisma ORM | Prisma Client ^6.19.3 | Zero-configuration persistent relational database (`backend/prisma/dev.db`). No PostgreSQL or Docker setup required. Complete ACID compliance and automatic startup schema initialization. |
| **Timezone & Temporal Logic** | `@js-temporal/polyfill` + IANA Timezone DB | `@js-temporal/polyfill` ^0.4.4 | Exact ISO 8601 UTC representation (`Temporal.Instant`), wall-clock timezone translations, and DST disambiguation. |
| **Testing** | Vitest + Supertest | Vitest ^3.2.7, Supertest ^7.0.0 | Fast unified test runner for backend integration tests, persistence checks, regression checks, and timezone math unit tests. |

---

## 2. Invariants & Business Logic Specifications

1. **Duration**: Fixed 30-minute trial classes.
2. **Daily Mentor Capacity**: Maximum 2 confirmed trial classes per mentor per mentor-local calendar day in `Asia/Kolkata` (00:00:00 to 23:59:59 IST).
3. **Deterministic Fair Assignment**:
   - Filter mentors by weekly working availability (09:00 - 21:00 IST).
   - Exclude mentors with overlapping bookings or $\ge 2$ confirmed classes on that mentor date.
   - Rank: Least booked on date $\rightarrow$ Lowest overall bookings $\rightarrow$ Deterministic ID.
4. **Timezone Fidelity**: Strict UTC instant storage with dynamic wall-clock translations into parent (`America/New_York`, `Europe/London`, etc.) and mentor (`Asia/Kolkata`) zones.
5. **Concurrency & Safe Idempotency**: ACID transaction isolation prevents double-booking, while exact duplicate retries return confirmed bookings idempotently.
6. **Cancellation**: Transitions status `CONFIRMED` $\rightarrow$ `CANCELLED`, freeing mentor quota immediately.
7. **Zero-Config Database Bootstrap**: Database auto-initializes on startup with idempotent seeding; user data persists safely across restarts.
