"use client"

import { useEffect, useState } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, BookOpen, Users, Star, Filter, Play } from "lucide-react"
import Link from "next/link"

interface Quiz {
  id: number
  title: string
  description: string | null
  passingCriteria: number
  createdAt: string
  updatedAt: string
  questions: { id: number; text: string }[]
  attempts?: { id: number }[]
  userAttempts?: { id: number }[]
}

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data to get userId
        const userRes = await fetch('/api/auth/session')
        if (!userRes.ok) throw new Error("Failed to fetch user data")
        const userData = await userRes.json()
        setUserId(userData.user?.id || null)

        // Fetch quizzes with user's attempts
        const quizRes = await fetch(`/api/quizzes?userId=${userData.user?.id || ''}`)
        if (!quizRes.ok) throw new Error("Failed to fetch quizzes")
        const quizData = await quizRes.json()
        setQuizzes(quizData)
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-1">Quiz Dashboard</h1>
            <p className="text-muted-foreground">Select a quiz to begin or continue your learning journey</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search quizzes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Quiz Grid */}
          {loading ? (
            <p className="text-muted-foreground">Loading quizzes...</p>
          ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No quizzes found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {quiz.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center p-2 bg-muted/20 rounded-md">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span>{quiz.questions?.length || 0} Questions</span>
                          </div>
                          <div className="h-4 w-px bg-border mx-2"></div>
                          <div className="text-primary font-medium">
                            Pass: {quiz.passingCriteria}%
                          </div>
                        </div>
                        
                        {userId && (
                          <div className="flex items-center justify-between p-2 bg-muted/10 rounded-md">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-amber-500" />
                              <span>Your Attempts:</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-amber-600">
                                {quiz.userAttempts?.length || 0}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                / {quiz.attempts?.length || 0} total
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Start Button */}
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all" 
                        size="lg"
                        asChild
                      >
                        <Link href={`/student/quiz/${quiz.id}`}>
                          <Play className="h-4 w-4 mr-2" />
                          {quiz.userAttempts?.length ? 'Retake Quiz' : 'Start Quiz'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
