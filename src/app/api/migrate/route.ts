import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  let prisma: PrismaClient | undefined = undefined
  
  try {
    prisma = new PrismaClient()
    
    // Run database migration/creation
    await prisma.$connect()
    
    // Create User table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" SERIAL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'STUDENT',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // Create Session table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      )
    `
    
    // Create Quiz table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Quiz" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "passingCriteria" INTEGER NOT NULL,
        "createdBy" INTEGER NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("createdBy") REFERENCES "User"("id")
      )
    `
    
    // Create Question table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Question" (
        "id" SERIAL PRIMARY KEY,
        "quizId" INTEGER NOT NULL,
        "type" TEXT NOT NULL,
        "text" TEXT NOT NULL,
        "options" TEXT NOT NULL,
        "correctAnswers" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE
      )
    `
    
    // Create Attempt table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Attempt" (
        "id" SERIAL PRIMARY KEY,
        "quizId" INTEGER NOT NULL,
        "userId" INTEGER NOT NULL,
        "score" INTEGER NOT NULL,
        "passed" BOOLEAN NOT NULL,
        "answers" JSONB NOT NULL,
        "duration" INTEGER,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      )
    `
    
    return NextResponse.json({ 
      message: 'Database migration completed successfully',
      tables: ['User', 'Session', 'Quiz', 'Question', 'Attempt']
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}

export async function POST() {
  return await GET()
}
