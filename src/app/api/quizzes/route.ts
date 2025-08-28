import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const quizzes = await prisma.quiz.findMany({
    include: { questions: true, attempts: true },
    orderBy: { id: "asc" }
  });
  return NextResponse.json(quizzes);
}

export async function POST(req: Request) {
  const { title, description, passMark, creatorId } = await req.json();
  if (!title || passMark === undefined || !creatorId) {
    return NextResponse.json({ error: "title, passMark, creatorId required" }, { status: 400 });
  }
  const quiz = await prisma.quiz.create({
    data: { title, description, passMark, creatorId },
  });
  return NextResponse.json(quiz, { status: 201 });
}
