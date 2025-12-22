import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/students - Fetch all users with role=STUDENT and basic performance stats
export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        attempts: {
          include: {
            quiz: {
              include: {
                questions: true,
              },
            },
          },
        },
      },
    })

    const result = students.map((u: typeof students[number]) => {
      const totalQuizzes = u.attempts.length

      let averageScore = 0
      if (totalQuizzes > 0) {
        const totalPercentage = u.attempts.reduce((sum: number, attempt: typeof u.attempts[number]) => {
          const questionCount = attempt.quiz?.questions?.length ?? 0
          if (questionCount === 0) return sum
          const percentage = (attempt.score / questionCount) * 100
          return sum + percentage
        }, 0)
        averageScore = Math.round(totalPercentage / totalQuizzes)
      }

      const lastAttempt = u.attempts[0]
      const lastActivity = lastAttempt?.createdAt ?? u.createdAt

      return {
        id: String(u.id),
        name: u.name,
        email: u.email,
        phone: undefined,
        joinDate: u.createdAt,
        totalQuizzes,
        averageScore,
        status: totalQuizzes > 0 ? "Active" : "Inactive",
        lastActivity,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
