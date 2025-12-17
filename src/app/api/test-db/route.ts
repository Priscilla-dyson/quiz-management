import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  let prisma: PrismaClient | undefined = undefined
  
  try {
    prisma = new PrismaClient()
    
    // Test database connection
    await prisma.$connect()
    
    // Test if we can query users
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      message: 'Database connected successfully',
      userCount: userCount,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    }, { status: 500 })
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}
