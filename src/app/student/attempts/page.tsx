"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StudentSidebar } from "@/components/student-sidebar"
import { Search, Eye, RotateCcw, TrendingUp, Clock, CheckCircle, X } from "lucide-react"
import Link from "next/link"

interface StudentAttempt {
  id: number
  quizTitle: string
  quizId: number
  score: number
  result: "pass" | "fail"
  date: string
  duration: number
  questionsCorrect: number
  totalQuestions: number
  passingScore: number
}

export default function StudentAttempts() {
  const [attempts, setAttempts] = useState<StudentAttempt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [resultFilter, setResultFilter] = useState<string>("all")

  const studentId = 1 // TODO: replace with logged-in user id from auth/session

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await fetch("/api/attempts")
        if (!res.ok) throw new Error("Failed to fetch attempts")
        const data = await res.json()

        // map API -> frontend shape
        const mapped: StudentAttempt[] = data
          .filter((a: any) => a.userId === studentId) // only this student
          .map((a: any) => {
            const totalQuestions = a.quiz.questions.length
            return {
              id: a.id,
              quizTitle: a.quiz.title,
              quizId: a.quiz.id,
              score: a.score,
              result: a.passed ? "pass" : "fail",
              date: a.createdAt,
              duration: a.duration ?? 0, // if you plan to add duration tracking later
              questionsCorrect: a.score, // your API uses raw "score" (#correct answers)
              totalQuestions,
              passingScore: a.quiz.passMark,
            }
          })

        setAttempts(mapped)
      } catch (err) {
        console.error("Error loading attempts:", err)
      }
    }
    fetchAttempts()
  }, [])

  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch = attempt.quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesResult = resultFilter === "all" || attempt.result === resultFilter
    return matchesSearch && matchesResult
  })

  // Stats
  const totalAttempts = attempts.length
  const passedAttempts = attempts.filter((a) => a.result === "pass").length
  const averageScore = totalAttempts > 0 ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / totalAttempts) : 0
  const bestScore = totalAttempts > 0 ? Math.max(...attempts.map((a) => a.score)) : 0

  const getResultBadge = (result: "pass" | "fail") =>
    result === "pass" ? (
      <Badge className="bg-green-100 text-green-800">Pass</Badge>
    ) : (
      <Badge variant="destructive">Fail</Badge>
    )

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Quiz Attempts</h1>
          <p className="text-muted-foreground">Review your quiz history and track your progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalAttempts}</div>
                <p className="text-sm text-muted-foreground">Total Attempts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{passedAttempts}</div>
                <p className="text-sm text-muted-foreground">Quizzes Passed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{averageScore}%</div>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{bestScore}%</div>
                <p className="text-sm text-muted-foreground">Best Score</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search quiz attempts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="pass">Passed</SelectItem>
                <SelectItem value="fail">Failed</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Attempts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz History ({filteredAttempts.length})</CardTitle>
            <CardDescription>Your complete quiz attempt history with detailed results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz Title</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttempts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No quiz attempts found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAttempts.map((attempt) => (
                      <TableRow key={attempt.id}>
                        <TableCell>
                          <div className="font-medium">{attempt.quizTitle}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{attempt.score}/{attempt.totalQuestions}</span>
                            <span className="text-sm text-muted-foreground">(need {attempt.passingScore}%)</span>
                          </div>
                        </TableCell>
                        <TableCell>{getResultBadge(attempt.result)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {attempt.result === "pass" ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                            {attempt.questionsCorrect}/{attempt.totalQuestions}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {attempt.duration} min
                          </div>
                        </TableCell>
                        <TableCell>{new Date(attempt.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/student/quiz/${attempt.quizId}/results/${attempt.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/student/quiz/${attempt.quizId}`}>
                                <RotateCcw className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
