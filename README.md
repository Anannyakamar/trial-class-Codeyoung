# Codeyoung Trial Class Booking System

A production-grade, full-stack appointment booking application designed to schedule 1-on-1 trial coding classes between parents and mentors across international timezones (US, UK, and India). Engineered with strict mentor calendar-day capacity limits, automatic timezone conversions, deterministic mentor allocation, and transaction isolation.

> ⚡ **Clone-and-Run Ready**: Configured with a genuine persistent **SQLite** database via Prisma ORM. Recruiters and evaluators can clone the repository and run it locally **without installing PostgreSQL, Docker, or configuring a database server**.

---

## 📌 1. Project Overview & Problem Statement

Codeyoung connects students across the globe with mentors for live, interactive trial classes. Scheduling international trial appointments presents three core engineering challenges:

1. **Timezone Discrepancies & Daylight Saving Time (DST)**: Parents in New York, London, or Los Angeles must view and book slots in their local wall-clock times, while mentors operate in `Asia/Kolkata` (IST). Date boundaries shift across midnight UTC, and DST shifts create nonexistent and ambiguous hours.
2. **Strict Operational Constraints**: 10 mentors conduct 30-minute trial classes, and each mentor can conduct **at most 2 confirmed trial classes per mentor-local calendar day** (00:00:00 to 23:59:59 `Asia/Kolkata`).
3. **High Concurrency & Double-Booking Prevention**: Multiple parents requesting the same slot simultaneously must never cause double-bookings or quota overages.

This system solves all three challenges using `@js-temporal/polyfill` for native temporal logic and Prisma transaction isolation for race-condition prevention.

---

## 🛠️ 2. Technology Stack & Architecture

| Layer | Technology | Version | Purpose & Key Features |
|---|---|---|---|
| **Runtime** | Node.js | v20.x+ (Tested on v24.19.0 LTS) | JavaScript runtime with native ESM support. |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS | React 18.3.1, Vite 5.4.21, Tailwind 3.4.17 | Premium EdTech redesign: warm ivory background (`#FAF8F5`), rich coral CTA (`#FF6B4A`), soft lavender accents (`#8E7DBE`), Plus Jakarta Sans headings, Inter body text, dedicated vector course cover assets. |
| **Form Management** | React Hook Form + Zod | RHF 7.54.2, Zod 3.24.2 | Uncontrolled components with client-side boundary validation. |
| **Backend API** | Node.js, Express, TypeScript, Zod | Express 4.21.2, TS 5.7.3, Zod 3.24.2 | Modular monolith architecture with request validation and centralized error middleware. |
| **Database & ORM** | SQLite + Prisma ORM | Prisma Client 6.19.3 | **Zero-config persistent relational database** (`backend/prisma/dev.db`). No PostgreSQL or Docker setup required. |
| **Timezone Logic** | `@js-temporal/polyfill` + IANA DB | `@js-temporal/polyfill` 0.4.4 | Exact UTC instant persistence, wall-clock translations, DST gap/overlap disambiguation. |
| **Testing** | Vitest + Supertest | Vitest 3.2.7, Supertest 7.0.0 | **74 automated tests** covering timezone math, DST transitions, API contracts, persistence, concurrency, image integrity, and form validation. |

---

## 📂 3. Folder Structure

```
trial-class-Codeyoung/
├── docs/
│   ├── TECH_STACK.md              # Architectural invariants, timezone & concurrency specs
│   └── SUBMISSION_CHECKLIST.md    # Evaluator review checklist & email submission template
├── package.json                   # Root monorepo workspace orchestration
├── README.md                      # Complete project documentation
├── TRANSCRIPT.md                  # Verifiable AI session transcript
│
├── backend/                       # Express + Prisma Backend
│   ├── prisma/
│   │   ├── schema.prisma          # Mentor, Parent, MentorAvailability, Booking models (SQLite)
│   │   ├── migrations/            # Version-controlled SQLite migrations
│   │   ├── seed.ts                # Standalone CLI seed script
│   │   └── dev.db                 # Local persistent SQLite database (git-ignored)
│   ├── src/
│   │   ├── config/env.ts          # Zod-validated environment config with safe defaults
│   │   ├── controllers/           # mentors, availability, bookings controllers
│   │   ├── db/
│   │   │   ├── prisma.ts          # Singleton Prisma client
│   │   │   ├── seedData.ts        # Modular seed definitions (10 mentors, sample schedules)
│   │   │   └── init.ts            # Idempotent startup database bootstrapper
│   │   ├── middlewares/           # Centralized error handler
│   │   ├── routes/                # Express router definitions
│   │   ├── schemas/               # Zod validation schemas
│   │   ├── services/              # bookingService, slotService, mentorService
│   │   ├── utils/timezone.ts      # @js-temporal/polyfill timezone & DST engine
│   │   ├── app.ts                 # Express application factory
│   │   └── index.ts               # Server bootstrap entry point
│   ├── tests/                     # 44 backend unit, integration, and persistence tests
│   └── tsconfig.json
│
└── frontend/                      # React + Vite Frontend
    ├── public/
    │   └── courses/               # 6 dedicated course SVGs + educational hero illustration
    ├── src/
    │   ├── api/client.ts          # Typed HTTP API client & error classes
    │   ├── components/
    │   │   ├── catalog/           # CourseCard, CourseModal, ParentBookingForm
    │   │   ├── booking/           # TimezoneSelector, DatePicker, SlotGrid, BookingForm, BookingConfirmationView
    │   │   └── layout/            # Navbar, Footer, Layout shell
    │   ├── data/courses.ts        # Centralized course catalog, SVG covers, and transparent sample pricing
    │   ├── pages/                 # LandingPage, BookingPage, ConfirmationPage, NotFoundPage
    │   ├── utils/timezone.ts      # Reusable client timezone formatters
    │   ├── App.tsx                # Two-page React Router configuration
    │   ├── main.tsx               # Entry point
    │   └── index.css              # Warm tokens, card-hover lift styles, Plus Jakarta Sans typography
    ├── vite.config.ts
    └── tailwind.config.js         # Warm ivory, cream, coral, lavender, and charcoal palette tokens
```

---

## 🚀 4. Quick Start (Clone & Run)

### Prerequisites
- **Node.js**: `v20.x` or higher (LTS recommended)
- **npm**: `v10.x` or higher
- **No external database or Docker required.**

### 1. Clone the Repository
```bash
git clone https://github.com/Anannyakamar/trial-class-Codeyoung.git
cd trial-class-Codeyoung
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Both Applications
Run the single command below to start both the backend API and frontend UI concurrently:
```bash
npm run dev:all
```

*The backend server will automatically create `backend/prisma/dev.db`, apply all migrations, and seed the initial 10 mentors and schedules before opening port 5000.*

### 4. Access the Applications
- **Frontend UI**: [`http://localhost:5173`](http://localhost:5173)
- **Backend API**: [`http://localhost:5000`](http://localhost:5000)
- **Health Check**: [`http://localhost:5000/api/health`](http://localhost:5000/api/health)

---

## 🗄️ 5. Database Architecture & Persistence

### SQLite Local Database
- The database is stored at `backend/prisma/dev.db`.
- Prisma connects via `DATABASE_URL="file:./dev.db"`.
- Safe defaults are built into `env.ts`, so the app runs out-of-the-box even without manually creating a `.env` file.

### Automatic Idempotent Initialization
When the backend starts (`npm run dev:all` or `npm start`):
1. **Schema Check**: The server tests connectivity and schema existence.
2. **Auto-Migration**: If running on a fresh clone without `dev.db`, it runs `prisma migrate deploy` to create all tables and indexes.
3. **Safe Seeding**: It automatically seeds 10 mentors and standard weekly schedules if the database is unpopulated.
4. **Data Preservation**: On server restart, existing bookings and parent records are **never overwritten or erased**.

### Database Reset (Optional)
If you ever want to reset the database to a clean initial state:
```bash
npm run prisma:reset
```

---

## ⚙️ 6. Available Scripts

| Command | Action |
|---|---|
| `npm run dev:all` | Starts both Express API (:5000) and Vite frontend (:5173) concurrently. |
| `npm run dev:backend` | Starts only the Express API with hot-reloading (`tsx watch`). |
| `npm run dev:frontend` | Starts only the Vite frontend dev server. |
| `npm run build` | Compiles backend TypeScript (`tsc`) and builds frontend production bundle. |
| `npm test` | Runs all 74 unit, integration, persistence, and timezone test suites. |
| `npm run setup` | Generates Prisma client, deploys migrations, seeds initial data, and builds. |
| `npm run prisma:reset` | Resets the SQLite database and reseeds initial mentors. |

---

## 🌐 7. Timezone & Daylight Saving Time (DST) Strategy

1. **Authoritative UTC Timestamps**:
   - All booking intervals (`startAt`, `endAt`) are stored as UTC timestamps in the database.
2. **Supported IANA Timezones**:
   - `Asia/Kolkata` (IST, UTC+05:30 — Mentor operating timezone, no DST)
   - `Europe/London` (GMT in winter UTC+00:00, BST in summer UTC+01:00)
   - `America/New_York` (EST in winter UTC-05:00, EDT in summer UTC-04:00)
   - `America/Chicago`, `America/Denver`, `America/Los_Angeles`
   - `Asia/Dubai`, `Asia/Singapore`, `Australia/Sydney`, `UTC`
3. **DST Disambiguation**:
   - **Spring-Forward Gap (Nonexistent hour)**: When local clocks skip an hour (e.g. 02:00 $\rightarrow$ 03:00 EST to EDT), nonexistent wall-clock times are rejected with validation errors.
   - **Fall-Back Overlap (Repeated hour)**: Discrete slots with exact UTC ISO instants and active UTC offsets (`-04:00` vs `-05:00`) are provided so parents select unambiguous instants.
4. **Cross-Date Midnight Boundary**:
   - When a parent books a slot on Thursday evening in California (`America/Los_Angeles`), it corresponds to Friday early morning in `Asia/Kolkata`. The mentor's 2-class daily quota is strictly evaluated against the **mentor's local calendar day in `Asia/Kolkata` (18:30 UTC previous day to 18:30 UTC target day)**.

---

## ⚖️ 8. Mentor Assignment Algorithm & Concurrency Rules

When a booking request arrives for interval `[startAt, endAt]`:
1. **Operating Availability Check**: Verifies the slot falls within mentor weekly working hours (09:00 - 21:00 IST) on that weekday in `Asia/Kolkata`.
2. **Conflict Check**: Excludes any mentor with an overlapping confirmed booking (`startAt < existingEnd && endAt > existingStart`).
3. **Daily Quota Enforcement**: Excludes any mentor who already has $\ge 2$ confirmed classes on that mentor-local calendar day in `Asia/Kolkata`.
4. **Deterministic Ranking**:
   - **Criterion 1 (Load Balancing)**: Mentors with fewer confirmed classes on that date are prioritized.
   - **Criterion 2 (Team Fairness)**: Mentors with fewer total historical classes are prioritized.
   - **Criterion 3 (Deterministic Tie-Breaker)**: Sorted alphabetically by `mentor.id`.
5. **ACID Transaction Isolation**: Executed within `prisma.$transaction(...)`.
6. **Idempotent Retry Recovery**: If a client experiences network timeouts or retries an identical request (`parentEmail`, `startTime`), the backend returns the confirmed booking safely rather than duplicating.
7. **Alternative Slot Recommender**: When preferred times are unavailable, returns up to 5 alternative candidate slots within $\pm 2$ calendar days.

---

## 📡 9. API Endpoints Reference

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/health` | Server health check and service metadata | `200` |
| `GET` | `/api/mentors` | Lists active mentors with public profile fields | `200` |
| `GET` | `/api/availability?date=YYYY-MM-DD&timezone=IANA` | Computes available 30-min slots with UTC offsets | `200`, `400` |
| `POST` | `/api/bookings` | Atomically creates booking & assigns eligible mentor | `201`, `400`, `409` |
| `GET` | `/api/bookings/:id` | Retrieves booking details with parent & mentor local times | `200`, `400`, `404` |
| `POST` | `/api/bookings/:id/cancel` | Cancels confirmed booking and releases mentor capacity | `200`, `400`, `404` |

---

## 🧪 10. Automated Testing & Verification

Run the entire test suite across frontend and backend:
```bash
npm test
```

### Verified Test Results (**74 Tests Passed, 0 Failures**)

```
Backend Test Suites (44 passed):
✓ tests/unit/bookingLogic.test.ts (6 tests)
  - Load balancing (least booked today)
  - Historical fairness tie-breaking
  - Deterministic ID tie-breaking
  - Interval overlap detection & adjacent interval safety
✓ tests/unit/timezone.test.ts (14 tests)
  - India Standard Time constant offset (+05:30)
  - London winter (GMT) vs summer (BST) offsets
  - New York winter (EST) vs summer (EDT) offsets
  - US spring-forward nonexistent hour detection
  - US fall-back ambiguous repeated hour disambiguation
  - UK DST transitions (March & October)
  - Multi-timezone instant projections
  - Cross-timezone calendar date differences
  - IANA identifier validation
  - UTC instant round-trip integrity
  - Mentor-local daily capacity around UTC midnight
  - 30-minute slot duration consistency across DST shifts
✓ tests/integration/api.test.ts (6 tests)
  - Health check endpoint
  - Validation error routing & 404 handling
  - Optional studentName, phoneNumber, courseName schema support
✓ tests/integration/reliability.test.ts (7 tests)
  - Past-time booking prevention
  - Malformed email & invalid timezone validation
  - UUID boundary validation & duration limits
✓ tests/integration/fullWorkflow.test.ts (7 tests)
  - Full API lifecycle & multi-timezone projections
  - Error payload sanitization
✓ tests/integration/sqlitePersistence.test.ts (4 tests)
  - 10 seeded mentors verification in persistent SQLite
  - Slot availability query from SQLite database
  - Complete booking creation, persistence, retrieval, and cancellation
  - Idempotent schema startup verification (retaining existing data)

Frontend Test Suites (30 passed):
✓ src/utils/confirmationView.test.ts (5 tests)
  - Complete booking metadata and confirmation UUID format
  - Dual timezone schedule formatting (parent & mentor local times)
  - Parent, phone, student name & grade identification
  - Assigned mentor credentials & bio display
  - Genuine backend meeting link with simulation disclosures
✓ src/data/courses.test.ts (6 tests)
  - All 6 required courses presence (Mathematics, Science, Arithmetic, Cyber Security, Web Development, Python Programming)
  - Dedicated and unique vector cover images for all 6 courses
  - Educational metadata, outcomes, grade ranges, and prerequisites integrity
  - Transparent sample catalog pricing with placeholder disclaimers
  - getCourseById helper resolution
  - Supported international country codes list
✓ src/utils/parentBookingFormValidation.test.ts (4 tests)
  - Parent name, email, and phone validation rules
  - Country code dropdown and phone number formatting
  - Short name & invalid email format rejection
  - Mandatory course selection enforcement
✓ src/api/client.test.ts (1 test)
✓ src/api/clientIntegration.test.ts (1 test)
✓ src/api/errorHandling.test.ts (2 tests)
✓ src/utils/bookingValidation.test.ts (4 tests)
  - Zod form schema rules
  - 12-hour AM/PM formatting
  - Cross-date boundary calculations
✓ src/utils/timezone.test.ts (7 tests)
  - Supported timezones list
  - Browser detection
  - UTC offset formatting
```

### Production Build Verification
```bash
npm run build
```
- **Backend TypeScript (`tsc`)**: Compiled with **0 errors**.
- **Frontend Vite Bundle**: Production bundle built with **0 errors** (gzip: 7.29 kB CSS, 101.71 kB JS).

---

## 💻 11. Two-Page Workflow & User Interface Architecture

The public website consists of **two main pages**:

1. **Page 1: Course Landing Page (`/`)**:
   - **Header**: Codeyoung branding, navigation links (`Home`, `Courses`, `How It Works`, `Contact`), and a prominent `Book a Trial` button.
   - **Hero Section**: High-trust value proposition highlighting 1-on-1 personalized STEM, math, and coding learning for children ages 6–18.
   - **Two-Column Main Layout (Desktop)**:
     - **Left Side — Course Catalog**: Showcases 6 courses:
       1. *Mathematics*
       2. *Science*
       3. *Arithmetic*
       4. *Cyber Security*
       5. *Web Development*
       6. *Python Programming*
       Each course card displays course name, short description, suitable age/grade range, sample price with billing period and currency, a "View Details" button (opening an in-depth syllabus modal), and a "Book a Trial" button.
     - **Right Side — Parent Booking Form**: Dedicated "Book Your Free Trial Class" panel with parent full name, email address, phone number with country code selector, course dropdown (synced with catalog cards), optional child's name, and grade level. Features robust inline validation and loading states.
   - **How It Works & FAQ Sections**: Clear 3-step walkthrough and parent FAQs.
   - **Workflow Transition**: Validates parent information and passes state into Page 2.

2. **Page 2: Trial Booking Interface & Confirmation Screen (`/book-trial`)**:
   - **Step 1 Review**: Review selected course, parent details, phone, and child's information.
   - **Date & Slot Selection**: Interactive calendar, timezone selector (US, UK, India), and live 30-minute slot grid with active mentor availability counts.
   - **Booking Execution**: Submits to backend with ACID concurrency control and idempotent protection.
   - **Dedicated Confirmation Screen**: Upon successful booking creation, Page 2 immediately displays complete confirmation details:
     - **Booking Details**: Reference UUID, Course Name, Scheduled Date, Start and End Times, Timezone labels, and `CONFIRMED` status.
     - **Parent Details**: Parent Full Name, Email, Phone Number, Child's Name and Grade.
     - **Assigned Mentor Details**: Mentor Full Name, Mentor Timezone (`Asia/Kolkata (IST)`), Educator Bio / Credentials.
     - **Meeting Details**: Instant live video classroom URL, a prominent "Join Trial Class" button, a "Copy Meeting Link" action with visual feedback, and a demo classroom simulation disclosure.
     - **Return Action**: "← Book Another Trial Class" button returning to the Course Catalog (`/`).
   - Manage Booking links, buttons, and pages are completely removed from the public website.

---

## 🔧 12. Troubleshooting & FAQ

- **Windows PowerShell Script Execution Policy (`PSSecurityException`)**: If PowerShell blocks `npm.ps1`, you can either run `npm.cmd install` / `npm.cmd run dev:all`, or enable script execution for your user account:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```
- **Port Conflict on 5000 or 5173**: If port 5000 is occupied, you can specify `PORT=4000 npm run dev:backend` or update `backend/.env`.
- **Resetting the Database**: If you wish to delete all trial bookings and start fresh with original sample mentors, run `npm run prisma:reset`.
- **Database Location**: The SQLite database file resides at `backend/prisma/dev.db`.