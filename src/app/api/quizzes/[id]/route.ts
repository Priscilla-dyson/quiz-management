import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params
  const quizId = Number(id)

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  })

  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(quiz)
}

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params
  const quizId = Number(id)

  const { title, description, passMark } = await req.json()
  const quiz = await prisma.quiz.update({
    where: { id: quizId },
    data: { title, description, passMark },
  })
  return NextResponse.json(quiz)
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params
  const quizId = Number(id)

  await prisma.quiz.delete({ where: { id: quizId } })
  return NextResponse.json({ message: "Quiz deleted" })
}