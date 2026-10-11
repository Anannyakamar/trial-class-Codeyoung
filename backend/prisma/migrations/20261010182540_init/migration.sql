-- CreateTable
CREATE TABLE "mentors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "mentor_availabilities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mentorId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "mentor_availabilities_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "classLink" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bookings_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "mentors_email_key" ON "mentors"("email");

-- CreateIndex
CREATE INDEX "mentors_isActive_idx" ON "mentors"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "parents_email_key" ON "parents"("email");

-- CreateIndex
CREATE INDEX "mentor_availabilities_mentorId_weekday_idx" ON "mentor_availabilities"("mentorId", "weekday");

-- CreateIndex
CREATE INDEX "bookings_mentorId_startAt_idx" ON "bookings"("mentorId", "startAt");

-- CreateIndex
CREATE INDEX "bookings_mentorId_status_idx" ON "bookings"("mentorId", "status");

-- CreateIndex
CREATE INDEX "bookings_startAt_endAt_idx" ON "bookings"("startAt", "endAt");
