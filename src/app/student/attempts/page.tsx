"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Clock, BookOpen, CheckCircle, X, Eye } from "lucide-react"
import Link from "next/link"

interface Attempt {
  id: number
  quiz: {
    id: number
    title: string
    description?: string
    passingCriteria: number
    questions: { id: number }[]
  }
  score: number
  passed: boolean
  createdAt: string
  duration?: number
}

interface User {
  id: number
  name: string
  email: string
  role: string
}

export default function StudentAttemptsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        // Get current user session
        const sessionRes = await fetch('/api/auth/session')
        const sessionData = await sessionRes.json()
        if (!sessionData.user) {
          router.push('/')
          return
        }
        setUser(sessionData.user)

        // Fetch attempts
        const attemptsRes = await fetch('/api/attempts')
        if (!attemptsRes.ok) throw new Error("Failed to fetch attempts")
        const attemptsData = await attemptsRes.json()
        setAttempts(attemptsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredAttempts = attempts.filter(attempt =>
    attempt.quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <StudentSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="text-center py-12">
            <p>Loading attempts...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-background">
        <StudentSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="text-center py-12">
            <p>Please log in to view your attempts.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Quiz Attempts</h1>
          <p className="text-muted-foreground">Review your quiz history and performance</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search attempts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Attempts List */}
        {filteredAttempts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {attempts.length === 0 ? "You haven't attempted any quizzes yet." : "No attempts found matching your search."}
                </p>
                <Button asChild className="mt-4">
                  <Link href="/student/quizzes">
                    Browse Quizzes
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAttempts.map((attempt) => (
              <Card key={attempt.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{attempt.quiz.title}</h3>
                        {attempt.passed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {attempt.quiz.description || "No description available"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {attempt.quiz.questions?.length || 0} questions
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {attempt.duration ? `${attempt.duration} min` : "N/A"}
                        </div>
                        <div>
                          Passing: {attempt.quiz.passingCriteria}%
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={attempt.passed ? "default" : "destructive"} className="text-sm">
                        {attempt.passed ? "PASSED" : "FAILED"}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{attempt.score}</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Attempted on {new Date(attempt.createdAt).toLocaleDateString()}
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/student/quiz/${attempt.quiz.id}/results/${attempt.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Results
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}