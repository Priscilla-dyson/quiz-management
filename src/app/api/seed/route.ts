import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  return await seedDatabase()
}

export async function GET() {
  return await seedDatabase()
}

async function seedDatabase() {
  try {
    const adminPasswordHash = await bcrypt.hash('admin123', 10)
    const studentPasswordHash = await bcrypt.hash('student123', 10)

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

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      users: [
        { email: 'admin@example.com', password: 'admin123', role: 'ADMIN' },
        { email: 'student@example.com', password: 'student123', role: 'STUDENT' }
      ]
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}
