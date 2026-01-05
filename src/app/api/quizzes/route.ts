import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateQuizRequest } from '@/lib/types'
import { cookies } from 'next/headers'

// GET /api/quizzes - Get all quizzes (with questions + attempts)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    })

    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const isAdmin = session.user.role === 'ADMIN'
    const currentUserId = session.user.id

    // Get all quizzes with questions
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: true,
        attempts: isAdmin ? {
          include: { user: true }
        } : false,
        _count: {
          select: {
            attempts: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    // For each quiz, get the current user's attempts if userId is provided
    const quizzesWithUserAttempts = await Promise.all(
      quizzes.map(async (quiz) => {
        let userAttempts: any[] = []
        
        if (userId) {
          userAttempts = await prisma.attempt.findMany({
            where: {
              quizId: quiz.id,
              userId: currentUserId
            },
            select: { id: true }
          })
        }

        return {
          ...quiz,
          userAttempts,
          attempts: quiz.attempts || [],
          _count: undefined // Remove the _count field as we'll use the arrays directly
        }
      })
    )

    // Parse JSON fields for questions
    const quizzesWithParsedQuestions = quizzesWithUserAttempts.map((quiz: any) => ({
      ...quiz,
      questions: quiz.questions.map((q: any) => ({
        ...q,
        options: JSON.parse(q.options),
        correctAnswers: JSON.parse(q.correctAnswers),
      })),
    }))

    return NextResponse.json(quizzesWithParsedQuestions)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

// POST /api/quizzes - Create a new quiz
export async function POST(request: NextRequest) {
  try {
    const body: CreateQuizRequest = await request.json()

    if (!body.title || !body.description || !body.questions || body.questions.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, and questions' },
        { status: 400 },
      )
    }

    for (const question of body.questions) {
      if (!question.text || !question.options || question.options.length === 0) {
        return NextResponse.json(
          { error: 'Each question must have text and options' },
          { status: 400 },
        )
      }

      if (question.correctAnswers.length === 0) {
        return NextResponse.json(
          { error: 'Each question must have at least one correct answer' },
          { status: 400 },
        )
      }
    }

    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    })

    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const createdBy = session.user.id

    const quiz = await prisma.quiz.create({
      data: {
        title: body.title,
        description: body.description,
        passingCriteria: body.passingCriteria,
        createdBy,
        questions: {
          create: body.questions.map((q) => ({
            type: q.type === 'multiple-choice' ? 'MULTIPLE_CHOICE' : 'TRUE_FALSE',
            text: q.text,
            options: JSON.stringify(q.options),
            correctAnswers: JSON.stringify(q.correctAnswers),
          })),
        },
      },
      include: {
        questions: true,
        attempts: true,
      },
    })

    // Parse JSON fields for response
    const quizWithParsedQuestions = {
      ...quiz,
      questions: quiz.questions.map((q: any) => ({
        ...q,
        options: JSON.parse(q.options),
        correctAnswers: JSON.parse(q.correctAnswers),
      })),
    }

    return NextResponse.json(quizWithParsedQuestions, { status: 201 })
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
