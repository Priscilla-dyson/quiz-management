import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Test if users exist
    const users = await prisma.user.findMany({
      select: { email: true, name: true, role: true }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      users: users
    })
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
