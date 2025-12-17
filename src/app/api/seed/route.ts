import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function POST() {
  return await seedDatabase()
}

export async function GET() {
  return await seedDatabase()
}

async function seedDatabase() {
  let prisma: PrismaClient | undefined = undefined
  
  try {
    // Create new Prisma client instance
    prisma = new PrismaClient({
      log: ["error", "warn"],
    })

    // Test database connection
    await prisma.$connect()
    console.log('Database connected successfully')

    const adminPasswordHash = await bcrypt.hash('admin123', 10)
    const studentPasswordHash = await bcrypt.hash('student123', 10)

    console.log('Creating admin user...')
    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
      },
    })

    console.log('Creating student user...')
    await prisma.user.upsert({
      where: { email: 'student@example.com' },
      update: {},
      create: {
        email: 'student@example.com',
        name: 'Student User',
        passwordHash: studentPasswordHash,
        role: 'STUDENT',
      },
    })

    console.log('Database seeded successfully')
    return NextResponse.json({ 
      message: 'Database seeded successfully',
      users: [
        { email: 'admin@example.com', password: 'admin123', role: 'ADMIN' },
        { email: 'student@example.com', password: 'student123', role: 'STUDENT' }
      ]
    })
  } catch (error) {
    console.error('Seed error details:', error)
    return NextResponse.json({ 
      error: 'Failed to seed database', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}
