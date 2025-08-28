"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Search, Download, Filter, TrendingUp, Users, BookOpen, BarChart3 } from "lucide-react"

interface StudentAttempt {
  id: string
  studentName: string
  studentEmail: string
  quizTitle: string
  quizId: string
  score: number
  result: "pass" | "fail"
  date: string
  duration: number
  questionsCorrect: number
  totalQuestions: number
}

// Mock data - in a real app, this would come from an API
const mockAttempts: StudentAttempt[] = [
  {
    id: "1",
    studentName: "Sarah Johnson",
    studentEmail: "sarah.j@email.com",
    quizTitle: "JavaScript Basics",
    quizId: "1",
    score: 85,
    result: "pass",
    date: "2024-02-08",
    duration: 23,
    questionsCorrect: 13,
    totalQuestions: 15,
  },
  {
    id: "2",
    studentName: "Mike Chen",
    studentEmail: "mike.c@email.com",
    quizTitle: "React Components",
    quizId: "2",
    score: 92,
    result: "pass",
    date: "2024-02-08",
    duration: 18,
    questionsCorrect: 11,
    totalQuestions: 12,
  },
  {
    id: "3",
    studentName: "Emma Davis",
    studentEmail: "emma.d@email.com",
    quizTitle: "Advanced CSS",
    quizId: "3",
    score: 45,
    result: "fail",
    date: "2024-02-07",
    duration: 35,
    questionsCorrect: 9,
    totalQuestions: 20,
  },
  {
    id: "4",
    studentName: "Alex Johnson",
    studentEmail: "alex.j@email.com",
    quizTitle: "JavaScript Basics",
    quizId: "1",
    score: 78,
    result: "pass",
    date: "2024-02-07",
    duration: 28,
    questionsCorrect: 12,
    totalQuestions: 15,
  },
  {
    id: "5",
    studentName: "Lisa Wang",
    studentEmail: "lisa.w@email.com",
    quizTitle: "Node.js Fundamentals",
    quizId: "5",
    score: 88,
    result: "pass",
    date: "2024-02-06",
    duration: 32,
    questionsCorrect: 16,
    totalQuestions: 18,
  },
  {
    id: "6",
    studentName: "David Brown",
    studentEmail: "david.b@email.com",
    quizTitle: "React Components",
    quizId: "2",
    score: 67,
    result: "fail",
    date: "2024-02-06",
    duration: 25,
    questionsCorrect: 8,
    totalQuestions: 12,
  },
]

export default function AdminResults() {
  const [attempts, setAttempts] = useState<StudentAttempt[]>(mockAttempts)
  const [searchTerm, setSearchTerm] = useState("")
  const [quizFilter, setQuizFilter] = useState<string>("all")
  const [resultFilter, setResultFilter] = useState<string>("all")

  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch =
      attempt.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.quizTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesQuiz = quizFilter === "all" || attempt.quizId === quizFilter
    const matchesResult = resultFilter === "all" || attempt.result === resultFilter
    return matchesSearch && matchesQuiz && matchesResult
  })

  // Calculate analytics
  const totalAttempts = attempts.length
  const passRate = Math.round((attempts.filter((a) => a.result === "pass").length / totalAttempts) * 100)
  const averageScore = Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
  const uniqueStudents = new Set(attempts.map((a) => a.studentEmail)).size

  const getResultBadge = (result: "pass" | "fail") => {
    return result === "pass" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pass</Badge>
    ) : (
      <Badge variant="destructive">Fail</Badge>
    )
  }

  const exportResults = () => {
    // In a real app, this would generate and download a CSV/Excel file
    console.log("Exporting results:", filteredAttempts)
    alert("Results exported successfully!")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Results & Analytics</h1>
              <p className="text-muted-foreground">Track student performance and quiz analytics</p>
            </div>
            <Button onClick={exportResults} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <BarChart3 className="h-5 w-5 text-primary" />
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
                    <div className="text-2xl font-bold">{passRate}%</div>
                    <p className="text-sm text-muted-foreground">Pass Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <BookOpen className="h-5 w-5 text-blue-600" />
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
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{uniqueStudents}</div>
                    <p className="text-sm text-muted-foreground">Active Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search students or quizzes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={quizFilter} onValueChange={setQuizFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by quiz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Quizzes</SelectItem>
                    <SelectItem value="1">JavaScript Basics</SelectItem>
                    <SelectItem value="2">React Components</SelectItem>
                    <SelectItem value="3">Advanced CSS</SelectItem>
                    <SelectItem value="5">Node.js Fundamentals</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter by result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="pass">Pass</SelectItem>
                    <SelectItem value="fail">Fail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Attempts ({filteredAttempts.length})</CardTitle>
            <CardDescription>Detailed view of all quiz attempts and results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttempts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No attempts found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAttempts.map((attempt) => (
                      <TableRow key={attempt.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{attempt.studentName}</div>
                            <div className="text-sm text-muted-foreground">{attempt.studentEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{attempt.quizTitle}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">{attempt.score}%</div>
                        </TableCell>
                        <TableCell>{getResultBadge(attempt.result)}</TableCell>
                        <TableCell>
                          {attempt.questionsCorrect}/{attempt.totalQuestions}
                        </TableCell>
                        <TableCell>{attempt.duration} min</TableCell>
                        <TableCell>{new Date(attempt.date).toLocaleDateString()}</TableCell>
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
