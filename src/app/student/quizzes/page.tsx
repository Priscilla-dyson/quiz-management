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
}

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/quizzes")
        if (!res.ok) throw new Error("Failed to fetch quizzes")
        const data = await res.json()
        setQuizzes(data)
      } catch (err) {
        console.error("Error fetching quizzes:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Available Quizzes</h1>
            <p className="text-muted-foreground">Explore and take quizzes to test your knowledge and skills</p>
          </div>

          {/* Search */}
          <div className="mb-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.questions?.length || 0} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.attempts?.length || 0} attempts</span>
                        </div>
                        <div className="text-sm col-span-2">
                          <span className="text-muted-foreground">Passing Score: </span>
                          <span className="font-medium">{quiz.passingCriteria}%</span>
                        </div>
                      </div>

                      {/* Start Button */}
                      <Button className="w-full" asChild>
                        <Link href={`/student/quiz/${quiz.id}`}>
                          <Play className="h-4 w-4 mr-2" />
                          Start Quiz
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
