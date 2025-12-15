"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StudentSidebar } from "@/components/student-sidebar"
import { ArrowLeft, CheckCircle, X, Clock, Award, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswers: number[]
}

interface Quiz {
  id: number
  title: string
  description?: string
  passingCriteria: number
  questions: Question[]
}

interface Attempt {
  id: number
  score: number
  passed: boolean
  answers: { [questionId: number]: string }
  createdAt: string
  duration?: number
  quiz: Quiz
}

export default function QuizAttemptResultsPage() {
  const params = useParams()
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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

        // Fetch attempt details
        const res = await fetch(`/api/attempts/${params.attemptId}`)
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Attempt not found")
          }
          throw new Error("Failed to fetch attempt")
        }
        const data = await res.json()
        
        // Verify this attempt belongs to the current user
        if (data.userId !== sessionData.user.id) {
          throw new Error("Unauthorized")
        }
        
        setAttempt(data)
      } catch (err) {
        console.error("Error loading attempt:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.attemptId])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <StudentSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="text-center py-12">
            <p>Loading results...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!attempt || !user) {
    return (
      <div className="flex min-h-screen bg-background">
        <StudentSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="text-center py-12">
            <p>Attempt not found or you don't have permission to view it.</p>
          </div>
        </main>
      </div>
    )
  }

  const scorePercentage = attempt.quiz.questions.length > 0 
    ? Math.round((attempt.score / attempt.quiz.questions.length) * 100) 
    : 0

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/student/attempts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Attempts
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">{attempt.quiz.title}</h1>
          <p className="text-muted-foreground">Quiz Results - {new Date(attempt.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Result Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {attempt.passed ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <X className="h-8 w-8 text-red-600" />
              )}
              {attempt.passed ? "Congratulations! You Passed!" : "Not Quite There Yet"}
            </CardTitle>
            <CardDescription>
              {attempt.passed 
                ? "You successfully completed the quiz and met the passing criteria."
                : "You didn't meet the passing criteria this time. Review the questions below and try again."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{scorePercentage}%</div>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{attempt.score}/{attempt.quiz.questions.length}</div>
                <p className="text-sm text-muted-foreground">Correct Answers</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{attempt.quiz.passingCriteria}%</div>
                <p className="text-sm text-muted-foreground">Passing Score</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{attempt.duration || 0}m</div>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{scorePercentage}%</span>
              </div>
              <Progress value={scorePercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
            <CardDescription>Review your answers and see the correct ones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {attempt.quiz.questions.map((question, index) => {
                const userAnswer = attempt.answers[question.id]
                const isCorrect = question.correctAnswers.includes(
                  question.options.indexOf(userAnswer)
                )
                
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Badge variant={isCorrect ? "default" : "destructive"}>
                        Question {index + 1}
                      </Badge>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                    </div>
                    
                    <h3 className="font-medium mb-3">{question.text}</h3>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = option === userAnswer
                        const isCorrectAnswer = question.correctAnswers.includes(optionIndex)
                        
                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded border ${
                              isCorrectAnswer
                                ? "bg-green-50 border-green-200"
                                : isUserAnswer
                                ? "bg-red-50 border-red-200"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {isUserAnswer && !isCorrectAnswer && <X className="h-4 w-4 text-red-600" />}
                              <span className={isCorrectAnswer ? "font-medium" : ""}>
                                {option}
                              </span>
                              {isCorrectAnswer && (
                                <Badge variant="outline" className="ml-auto text-green-600">
                                  Correct
                                </Badge>
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <Badge variant="outline" className="ml-auto text-red-600">
                                  Your Answer
                                </Badge>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Button asChild>
            <Link href={`/student/quiz/${attempt.quiz.id}`}>
              Retake Quiz
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/student/quizzes">
              Browse More Quizzes
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
