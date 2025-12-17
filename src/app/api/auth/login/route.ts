import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      )
    }

    let userRecord = await prisma.user.findUnique({
      where: { email },
    })

    // Auto-create demo users if they don't exist
    if (!userRecord && (email === 'admin@example.com' || email === 'student@example.com')) {
      const role = email === 'admin@example.com' ? 'ADMIN' : 'STUDENT'
      const name = email === 'admin@example.com' ? 'Admin User' : 'Student User'
      
      // Only accept demo passwords
      if ((email === 'admin@example.com' && password === 'admin123') ||
          (email === 'student@example.com' && password === 'student123')) {
        const passwordHash = await bcrypt.hash(password, 10)
        
        userRecord = await prisma.user.create({
          data: {
            email,
            name,
            passwordHash,
            role,
          },
        })
      }
    }

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      )
    }

    const isValidPassword = await bcrypt.compare(
      password,
      userRecord.passwordHash,
    )

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      )
    }

    const user = {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role,
    }

    const sessionId =
      Math.random().toString(36).substring(2) +
      Date.now().toString(36)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        expiresAt,
      },
    })

    const cookieStore = await cookies()
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24,
    }

    cookieStore.set('session', sessionId, cookieOptions)
    cookieStore.set('role', user.role, cookieOptions)

    return NextResponse.json({
      user,
      message: 'Login successful',
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
