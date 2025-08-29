import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Explicit context type for Next.js dynamic route
type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params
  const questionId = Number(id)

  const question = await prisma.question.findUnique({ where: { id: questionId } })
  if (!question) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(question)
}

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params
  const questionId = Number(id)

  const { text, options, answer } = await req.json()
  const question = await prisma.question.update({
    where: { id: questionId },
    data: { text, options, answer },
  })
  return NextResponse.json(question)
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params
  const questionId = Number(id)

  await prisma.question.delete({ where: { id: questionId } })
  return NextResponse.json({ message: "Question deleted" })
}