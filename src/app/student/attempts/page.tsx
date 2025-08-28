"use client"

import { useState } from "react"
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
  id: string
  quizTitle: string
  quizId: string
  score: number
  result: "pass" | "fail"
  date: string
  duration: number
  questionsCorrect: number
  totalQuestions: number
  passingScore: number
}

// Mock data - in a real app, this would come from an API for the current student
const mockAttempts: StudentAttempt[] = [
  {
    id: "1",
    quizTitle: "JavaScript Basics",
    quizId: "1",
    score: 78,
    result: "pass",
    date: "2024-02-08",
    duration: 28,
    questionsCorrect: 12,
    totalQuestions: 15,
    passingScore: 70,
  },
  {
    id: "2",
    quizTitle: "React Components",
    quizId: "2",
    score: 82,
    result: "pass",
    date: "2024-02-05",
    duration: 23,
    questionsCorrect: 10,
    totalQuestions: 12,
    passingScore: 75,
  },
  {
    id: "3",
    quizTitle: "HTML & CSS Basics",
    quizId: "6",
    score: 95,
    result: "pass",
    date: "2024-02-01",
    duration: 18,
    questionsCorrect: 19,
    totalQuestions: 20,
    passingScore: 70,
  },
  {
    id: "4",
    quizTitle: "Database Concepts",
    quizId: "4",
    score: 65,
    result: "fail",
    date: "2024-01-28",
    duration: 35,
    questionsCorrect: 11,
    totalQuestions: 18,
    passingScore: 70,
  },
  {
    id: "5",
    quizTitle: "Advanced CSS",
    quizId: "3",
    score: 58,
    result: "fail",
    date: "2024-01-25",
    duration: 40,
    questionsCorrect: 12,
    totalQuestions: 20,
    passingScore: 70,
  },
]

export default function StudentAttempts() {
  const [attempts, setAttempts] = useState<StudentAttempt[]>(mockAttempts)
  const [searchTerm, setSearchTerm] = useState("")
  const [resultFilter, setResultFilter] = useState<string>("all")

  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch = attempt.quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesResult = resultFilter === "all" || attempt.result === resultFilter
    return matchesSearch && matchesResult
  })

  // Calculate student statistics
  const totalAttempts = attempts.length
  const passedAttempts = attempts.filter((a) => a.result === "pass").length
  const averageScore = Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
  const bestScore = Math.max(...attempts.map((a) => a.score))

  const getResultBadge = (result: "pass" | "fail") => {
    return result === "pass" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pass</Badge>
    ) : (
      <Badge variant="destructive">Fail</Badge>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Quiz Attempts</h1>
          <p className="text-muted-foreground">Review your quiz history and track your progress</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalAttempts}</div>
                  <p className="text-sm text-muted-foreground">Total Attempts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{passedAttempts}</div>
                  <p className="text-sm text-muted-foreground">Quizzes Passed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
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
                <div className="p-2 bg-purple-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{bestScore}%</div>
                  <p className="text-sm text-muted-foreground">Best Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search quiz attempts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
            </div>
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
                            <span className="font-semibold">{attempt.score}%</span>
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
