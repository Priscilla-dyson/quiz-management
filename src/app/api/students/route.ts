import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/students
export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        attempts: {
          include: {
            quiz: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const formatted = students.map((s) => {
      const totalQuizzes = s.attempts.length
      const averageScore =
        totalQuizzes > 0
          ? Math.round(s.attempts.reduce((sum, a) => sum + a.score, 0) / totalQuizzes)
          : 0

      return {
        id: s.id,
        name: s.email.split("@")[0], // no name column in schema, so fallback to email prefix
        email: s.email,
        joinDate: s.createdAt,
        totalQuizzes,
        averageScore,
        status: s.attempts.length > 0 ? "Active" : "Inactive",
        lastActivity: s.updatedAt,
      }
    })

    return NextResponse.json(formatted)
  } catch (err) {
    console.error("Error fetching students:", err)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
