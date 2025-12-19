-- Step 1: Create the basic schema and User table
CREATE TYPE IF NOT EXISTS "Role" AS ENUM ('ADMIN', 'STUDENT');
CREATE TYPE IF NOT EXISTS "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE');

CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Insert demo users
INSERT INTO "User" ("email", "name", "passwordHash", "role") VALUES
('admin@example.com', 'Admin User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN'),
('student@example.com', 'Student User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STUDENT');
