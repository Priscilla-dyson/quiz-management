"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, CheckCircle, Play, Trophy, TrendingUp } from "lucide-react"
import Link from "next/link"
import { StudentSidebar } from "@/components/student-sidebar"

interface Quiz {
  id: number
  title: string
  description?: string
  passMark: number
  questions: { id: number }[]
  attempts: { score: number; passed: boolean; userId: number }[]
}

interface Attempt {
  id: number
  quiz: { title: string }
  score: number
  passed: boolean
  createdAt: string
  duration?: number
}

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const studentId = 1 // TODO: replace with logged-in user ID from auth/session
  const studentName = "Student" // TODO: replace with real user info

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, attemptRes] = await Promise.all([
          fetch("/api/quizzes"),
          fetch("/api/attempts"),
        ])

        if (!quizRes.ok || !attemptRes.ok) throw new Error("Failed to fetch data")

        const quizData: Quiz[] = await quizRes.json()
        const attemptData: Attempt[] = await attemptRes.json()

        setQuizzes(quizData)
        // filter attempts for current student
        setAttempts(attemptData.filter(a => a.quiz && a.score !== undefined && a.id && a))
      } catch (err) {
        console.error("Error loading dashboard:", err)
      }
    }
    fetchData()
  }, [])

  const studentAttempts = attempts.filter(a => a) // if filtering by userId, add here
  const completedQuizIds = new Set(studentAttempts.map(a => a.quiz.title))
  const completedQuizzes = quizzes.filter(q =>
    q.attempts.some(a => a.userId === studentId)
  ).length

  const averageScore =
    studentAttempts.length > 0
      ? Math.round(studentAttempts.reduce((sum, a) => sum + a.score, 0) / studentAttempts.length)
      : 0

  const getDifficultyBadge = (count: number) => {
    if (count <= 10) return <Badge className="bg-green-100 text-green-800">Beginner</Badge>
    if (count <= 15) return <Badge className="bg-yellow-100 text-yellow-800">Intermediate</Badge>
    return <Badge className="bg-red-100 text-red-800">Advanced</Badge>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {studentName}!</h1>
            <p className="text-muted-foreground">
              Ready to continue your learning journey? Check out the available quizzes below.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{completedQuizzes}</div>
                    <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-full">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{averageScore}%</div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-full">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {quizzes.length - completedQuizzes}
                    </div>
                    <p className="text-sm text-muted-foreground">Available Quizzes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Quizzes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Quizzes</CardTitle>
                <CardDescription>Start a new quiz to test your knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizzes.map((quiz) => {
                    const hasAttempt = quiz.attempts.some(a => a.userId === studentId)
                    const lastAttempt = quiz.attempts.findLast(a => a.userId === studentId)

                    return (
                      <Card key={quiz.id} className="border-2 hover:border-primary/20 transition-colors">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{quiz.title}</h3>
                                {hasAttempt && <CheckCircle className="h-5 w-5 text-green-600" />}
                              </div>
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{quiz.description}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  {quiz.questions.length} questions
                                </div>
                                <div>Passing: {quiz.passMark}%</div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getDifficultyBadge(quiz.questions.length)}
                              {lastAttempt && (
                                <Badge variant="outline" className="text-green-600">
                                  Score: {lastAttempt.score}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              {hasAttempt ? (
                                <div className="text-sm text-muted-foreground">Completed • You can retake</div>
                              ) : (
                                <div className="text-sm text-muted-foreground">Not started</div>
                              )}
                            </div>
                            <Button asChild size="sm">
                              <Link href={`/student/quiz/${quiz.id}`}>
                                <Play className="mr-2 h-4 w-4" />
                                {hasAttempt ? "Retake Quiz" : "Start Quiz"}
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Attempts & Progress */}
          <div className="space-y-6">
            {/* Recent Attempts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Attempts</CardTitle>
                <CardDescription>Your latest quiz results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentAttempts.slice(0, 3).map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{attempt.quiz.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(attempt.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{attempt.score}</div>
                        <Badge variant={attempt.passed ? "default" : "destructive"} className="text-xs">
                          {attempt.passed ? "Pass" : "Fail"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
                  <Link href="/student/attempts">View All Attempts</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Track your overall performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Quiz Completion</span>
                    <span>
                      {completedQuizzes}/{quizzes.length}
                    </span>
                  </div>
                  <Progress value={(completedQuizzes / (quizzes.length || 1)) * 100} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{averageScore}%</div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {studentAttempts.filter((a) => a.passed).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Passed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      {studentAttempts.filter((a) => !a.passed).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
