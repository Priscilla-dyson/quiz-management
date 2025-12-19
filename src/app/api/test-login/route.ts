import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, passwordHash: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Test password comparison
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    
    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      passwordMatch: isValidPassword,
      passwordHash: user.passwordHash.substring(0, 20) + '...' // Show partial hash for debugging
    })

  } catch (error) {
    console.error('Login test failed:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
