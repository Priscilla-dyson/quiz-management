-- Drop existing tables if they exist (safe approach)
DROP TABLE IF EXISTS "Attempt" CASCADE;
DROP TABLE IF EXISTS "Question" CASCADE;
DROP TABLE IF EXISTS "Quiz" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS "Role";
DROP TYPE IF EXISTS "QuestionType";

-- Create Role enum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT');

-- Create QuestionType enum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE');

-- Create User table
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Session table
CREATE TABLE "Session" (
    "id" TEXT PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create Quiz table
CREATE TABLE "Quiz" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "passingCriteria" INTEGER NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("createdBy") REFERENCES "User"("id")
);

-- Create Question table
CREATE TABLE "Question" (
    "id" SERIAL PRIMARY KEY,
    "quizId" INTEGER NOT NULL,
    "type" "QuestionType" NOT NULL,
    "text" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctAnswers" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE
);

-- Create Attempt table
CREATE TABLE "Attempt" (
    "id" SERIAL PRIMARY KEY,
    "quizId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "answers" JSONB NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Quiz_createdBy_idx" ON "Quiz"("createdBy");
CREATE INDEX "Question_quizId_idx" ON "Question"("quizId");
CREATE INDEX "Attempt_quizId_idx" ON "Attempt"("quizId");
CREATE INDEX "Attempt_userId_idx" ON "Attempt"("userId");

-- Insert demo users
INSERT INTO "User" ("email", "name", "passwordHash", "role") VALUES
('admin@example.com', 'Admin User', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'ADMIN'),
('student@example.com', 'Student User', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'STUDENT');
