import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

// GET /api/attempts/[id] - Get a specific attempt with quiz + user details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attemptId = Number(params.id)
    if (Number.isNaN(attemptId)) {
      return NextResponse.json({ error: "Invalid attempt ID" }, { status: 400 })
    }

    // Check authentication
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

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
        user: true,
      },
    })

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 })
    }

    // Check if user is authorized (owner or admin)
    if (session.user.role !== 'ADMIN' && attempt.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Parse JSON fields for questions
    const parsedAttempt = {
      ...attempt,
      quiz: {
        ...attempt.quiz,
        questions: attempt.quiz.questions.map((q: any) => ({
          ...q,
          options: JSON.parse(q.options as string),
          correctAnswers: JSON.parse(q.correctAnswers as string),
        })),
      },
    }

    return NextResponse.json(parsedAttempt)
  } catch (error) {
    console.error("Error fetching attempt:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
