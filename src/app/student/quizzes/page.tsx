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
  passMark: number
  createdAt: string
  updatedAt: string
  questions: { id: number }[]
  attempts: { id: number }[]
}

const categories = ["All", "Programming", "Database", "Security", "Backend", "AI/ML"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

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

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search quizzes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Category
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Difficulty
              </Button>
            </div>
          </div>

          {/* Filter Tabs (static for now) */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button key={category} variant={category === "All" ? "default" : "outline"} size="sm">
                {category}
              </Button>
            ))}
          </div>

          {/* Quiz Grid */}
          {loading ? (
            <p className="text-muted-foreground">Loading quizzes...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="default">General</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">N/A</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>— min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.questions.length} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.attempts.length} attempts</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Pass: </span>
                          <span className="font-medium">{quiz.passMark}%</span>
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <Badge variant="outline" className="text-xs">
                          Uncategorized
                        </Badge>
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
