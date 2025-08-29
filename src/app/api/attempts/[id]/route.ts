import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const attempts = await prisma.attempt.findMany({
    include: { user: true, quiz: true },
    orderBy: { id: "desc" }
  });
  return NextResponse.json(attempts);
}


export async function POST(req: Request) {
  const { userId, quizId, answers } = await req.json();

  if (!userId || !quizId || !answers || typeof answers !== "object") {
    return NextResponse.json({ error: "userId, quizId, answers{} required" }, { status: 400 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: Number(quizId) },
    include: { questions: true },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  let score = 0;
  quiz.questions.forEach((q) => {
    const userAns = answers[q.id];
    if (typeof userAns === "string" && userAns === q.answer) score++;
  });

  const passed = quiz.questions.length > 0
    ? (score / quiz.questions.length) * 100 >= quiz.passMark
    : false;

  const attempt = await prisma.attempt.create({
    data: { userId: Number(userId), quizId: Number(quizId), score, passed },
  });

  return NextResponse.json(attempt, { status: 201 });
}