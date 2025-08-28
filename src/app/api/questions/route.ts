import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { text, options, answer, quizId } = await req.json();
  if (!text || !Array.isArray(options) || !answer || !quizId) {
    return NextResponse.json({ error: "text, options[], answer, quizId required" }, { status: 400 });
  }
  const question = await prisma.question.create({
    data: { text, options, answer, quizId: Number(quizId) },
  });
  return NextResponse.json(question, { status: 201 });
}
