# Submission Checklist & Final Instructions

## Assignment Details
- **Project**: Codeyoung Trial Class Appointment Booking System
- **Candidate Name**: Anannya Kamar
- **GitHub Repository**: `https://github.com/Anannyakamar/trial-class-Codeyoung.git`
- **Branch**: `main`

---

## 📋 Evaluation Checklist

- [x] **Clone-and-Run Ready**: Zero-configuration setup. Runs locally without installing PostgreSQL, Docker, or configuring a database server.
- [x] **Application Setup**: Clean npm monorepo workspaces (`frontend`, `backend`) with root orchestration scripts.
- [x] **Persistent Database & Migrations**: SQLite schema (`dev.db`), versioned Prisma migrations, and safe idempotent seed script with 10 fictional mentors.
- [x] **Automatic Startup Initialization**: Database schema and initial seed data automatically bootstrap when the server starts. Recruiter data persists across restarts.
- [x] **10 Active Mentors**: Seeded in `Asia/Kolkata` with standard weekly availability (09:00 - 21:00 IST).
- [x] **Mentor Daily Quota**: Strict database-level enforcement of max 2 trial classes per mentor per mentor-local calendar day in `Asia/Kolkata`.
- [x] **Concurrency & Race Conditions**: ACID transaction isolation prevents double-booking and mentor capacity overages during simultaneous requests.
- [x] **International Timezone Engine**: Powered by `@js-temporal/polyfill` with standard IANA identifiers and UTC instant persistence.
- [x] **Daylight Saving Time (DST)**: Nonexistent wall-clock gap detection and ambiguous hour disambiguation.
- [x] **React Booking Interface**: Responsive two-column booking workflow, confirmation receipt, and reference lookup/cancellation.
- [x] **Automated Tests**: 58 automated tests passing across 11 test suites (`vitest`).
- [x] **Repository Hygiene**: `.gitignore` configured; `.env` and `dev.db` ignored; `.env.example` committed; no personal credentials.
- [x] **Documentation**: Complete `README.md`, `docs/TECH_STACK.md`, and authentic `TRANSCRIPT.md`.

---

## 📧 Email Submission Instructions

Prepare and send your final submission email with the exact subject line:

```
Codeyoung Assignment Task - Anannya Kamar - <Institute Name (ABBR)>
```

### Email Body Template
```
Dear Codeyoung Team,

I have completed the full-stack engineer assignment for the Codeyoung Trial Class Booking System.

GitHub Repository: https://github.com/Anannyakamar/trial-class-Codeyoung.git
Branch: main

Key Highlights:
1. Zero-Configuration Clone-and-Run: Configured with a genuine persistent SQLite database (Prisma ORM). Evaluators can clone and run without Docker or PostgreSQL installed.
2. Automatic Database Initialization: Auto-generates schema and idempotently seeds 10 mentors on server start; booked appointments persist across restarts.
3. International Timezone Engine: Seamless conversions across US, UK, and India timezones with DST disambiguation powered by @js-temporal/polyfill.
4. Mentor Quota & Assignment: Strict enforcement of max 2 classes per mentor per mentor-local calendar day (Asia/Kolkata) with load-balanced deterministic assignment.
5. Concurrency Protection: ACID transactions preventing double-booking during simultaneous requests.
6. React Frontend: 14-day interactive date selector, dynamic 30-min slot grid, booking confirmation receipts, and appointment cancellation.
7. Automated Test Suite: 58 automated unit, integration, persistence, and regression tests passing.

Instructions to run the application locally are documented in README.md.

Best regards,
Anannya Kamar
```
