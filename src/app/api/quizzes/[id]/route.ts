import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

// GET /api/quizzes/[id] - Get a specific quiz
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = Number(params.id)
    if (Number.isNaN(quizId)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    // Check if user is authenticated
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

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        attempts: session.user.role === 'ADMIN' ? {
          include: { user: true }
        } : {
          where: { userId: session.user.id }
        },
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
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

    return NextResponse.json(quizWithParsedQuestions)
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/quizzes/[id] - Delete a specific quiz
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = Number(params.id)
    if (Number.isNaN(quizId)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    // Check if user is authenticated and is admin
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    })

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.quiz.delete({
      where: { id: quizId },
    })

    return NextResponse.json({ message: "Quiz deleted successfully" })
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    console.error("Error deleting quiz:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/quizzes/[id] - Update a specific quiz
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = Number(params.id)
    if (Number.isNaN(quizId)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    // Check if user is authenticated and is admin
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    })

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description || !body.questions || body.questions.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, and questions' },
        { status: 400 }
      )
    }

    // Validate questions
    for (const question of body.questions) {
      if (!question.text || !question.options || question.options.length === 0) {
        return NextResponse.json(
          { error: 'Each question must have text and options' },
          { status: 400 }
        )
      }

      if (question.correctAnswers.length === 0) {
        return NextResponse.json(
          { error: 'Each question must have at least one correct answer' },
          { status: 400 }
        )
      }
    }

    // Delete existing questions
    await prisma.question.deleteMany({
      where: { quizId },
    })

    // Update quiz and create new questions
    const quiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        title: body.title,
        description: body.description,
        passingCriteria: body.passingCriteria,
        questions: {
          create: body.questions.map((q: any) => ({
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

    return NextResponse.json(quizWithParsedQuestions)
  } catch (error) {
    console.error('Error updating quiz:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
