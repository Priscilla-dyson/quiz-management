import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const attempt = await prisma.attempt.findUnique({
    where: { id },
    include: { user: true, quiz: true },
  });
  if (!attempt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(attempt);
}
