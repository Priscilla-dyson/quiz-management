import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SubmitQuizRequest } from '@/lib/types'
import { cookies } from 'next/headers'

// GET /api/attempts - Get all quiz attempts (with quiz + user)
export async function GET() {
  try {
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

    const user = session.user

    const where =
      user.role === 'ADMIN'
        ? {}
        : { userId: user.id }

    const attempts = await prisma.attempt.findMany({
      where,
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Parse JSON fields for questions
    const parsedAttempts = attempts.map((attempt: any) => ({
      ...attempt,
      quiz: {
        ...attempt.quiz,
        questions: attempt.quiz.questions.map((q: any) => ({
          ...q,
          options: JSON.parse(q.options as string),
          correctAnswers: JSON.parse(q.correctAnswers as string),
        })),
      },
    }))

    return NextResponse.json(parsedAttempts)
  } catch (error) {
    console.error('Error fetching attempts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitQuizRequest = await request.json()

    if (!body.quizId || !body.answers) {
      return NextResponse.json(
        { error: 'Missing required fields: quizId and answers' },
        { status: 400 },
      )
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

    const userId = session.user.id

    const quiz = await prisma.quiz.findUnique({
      where: { id: body.quizId },
      include: { questions: true },
    })

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Parse JSON fields for questions
    const quizWithParsedQuestions = {
      ...quiz,
      questions: quiz.questions.map((q: any) => ({
        ...q,
        options: JSON.parse(q.options),
        correctAnswers: JSON.parse(q.correctAnswers),
      })),
    }

    for (const question of quizWithParsedQuestions.questions) {
      if (!body.answers[question.id]) {
        return NextResponse.json(
          { error: `Missing answer for question: ${question.text}` },
          { status: 400 },
        )
      }
    }

    let correct = 0
    quizWithParsedQuestions.questions.forEach((q: any) => {
      const userAnswer = body.answers[q.id]
      if (!userAnswer) return
      const userIndex = q.options.indexOf(userAnswer)
      if (q.correctAnswers.includes(userIndex)) {
        correct++
      }
    })

    const totalQuestions = quizWithParsedQuestions.questions.length
    const scorePercentage =
      totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0
    const passed = scorePercentage >= quiz.passingCriteria

    const attempt = await prisma.attempt.create({
      data: {
        quizId: quiz.id,
        userId,
        score: correct,
        passed,
        answers: body.answers,
        duration: body.duration ?? 0,
      },
      include: {
        quiz: true,
      },
    })

    return NextResponse.json(attempt, { status: 201 })
  } catch (error) {
    console.error('Error submitting attempt:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
