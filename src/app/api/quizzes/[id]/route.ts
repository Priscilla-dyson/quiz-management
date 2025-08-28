import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { questions: true },
  });
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(quiz);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { title, description, passMark } = await req.json();
  const quiz = await prisma.quiz.update({
    where: { id },
    data: { title, description, passMark },
  });
  return NextResponse.json(quiz);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.quiz.delete({ where: { id } });
  return NextResponse.json({ message: "Quiz deleted" });
}
