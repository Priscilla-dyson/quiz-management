import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hash("admin123", 10);
  const studentPassword = await hash("student123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { email: "admin@example.com", password: adminPassword, role: Role.ADMIN },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: { email: "student@example.com", password: studentPassword, role: Role.STUDENT },
  });

  // Sample Quiz + Questions
  const sampleQuiz = await prisma.quiz.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Sample JavaScript Basics",
      description: "Quick test on JS fundamentals",
      passMark: 60,
      creatorId: admin.id,
      questions: {
        create: [
          {
            text: "Which keyword declares a constant in JS?",
            options: ["var", "let", "const", "static"],
            answer: "const",
          },
          {
            text: "What is the result of typeof null?",
            options: ["'null'", "'object'", "'undefined'", "'number'"],
            answer: "'object'",
          },
          {
            text: "Which method converts JSON string to object?",
            options: ["JSON.toString()", "JSON.parse()", "parseJSON()", "Object.parse()"],
            answer: "JSON.parse()",
          },
        ],
      },
    },
  });

  console.log("Seeded users:", { admin, student });
  console.log("Seeded quiz:", sampleQuiz.title);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });