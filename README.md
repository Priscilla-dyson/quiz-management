This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Quiz Management System

This is a full-stack web application built with Next.js (App Router), Prisma ORM, PostgreSQL, TailwindCSS, and shadcn/ui, deployed on Vercel.

The system provides two main roles:

Admin: can create and manage quizzes, add questions, and view student attempts.

Student: can browse quizzes, attempt them with a timer, and see results and progress over time.

How to Use the System

Open the deployed application in your browser.

Log in using one of the provided accounts (see below).

If you log in as Admin, you will have access to the Admin Dashboard where you can:

Add new quizzes with titles, descriptions, and pass marks

Add and manage questions under each quiz

View all student attempts and their results

If you log in as Student, you will have access to the Student Dashboard where you can:

See all available quizzes, search or filter them by category or difficulty

Start a quiz, answer questions within the time limit, and submit

View your results immediately and track your past attempts in the history section

Test Accounts

Since user registration was not required for this assessment, two accounts are pre-seeded:

Admin account

Email: admin@example.com

Password: admin123

Student account

Email: student@example.com

Password: student123

Technology Stack

The application is built with:

Next.js (React framework)

Prisma ORM

PostgreSQL database (can be hosted on Supabase, Railway, Render, etc.)

TailwindCSS and shadcn/ui for styling

Hosted on Vercel

Project Layout

Admin pages: manage quizzes and student attempts

Student pages: available quizzes, attempt quizzes, view results

API routes: handle quizzes, attempts, and user data

Prisma schema: defines database models (users, quizzes, questions, attempts)

Seed script: pre-loads the two test accounts and some sample data