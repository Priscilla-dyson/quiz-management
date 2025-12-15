"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, X, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { StudentSidebar } from "@/components/student-sidebar"

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

interface User {
  id: number
  name: string
  email: string
  role: string
}

export default function QuizAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({})
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptResult, setAttemptResult] = useState<any>(null)

  // Fetch user session and quiz
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

        // Fetch quiz
        const quizRes = await fetch(`/api/quizzes/${params.id}`)
        if (!quizRes.ok) {
          if (quizRes.status === 404) {
            setError("Quiz not found")
          } else {
            setError("Failed to load quiz")
          }
          return
        }

        const quizData = await quizRes.json()
        
        // Check if quiz has questions
        if (!quizData.questions || quizData.questions.length === 0) {
          setError("This quiz has no questions yet")
          return
        }

        setQuiz(quizData)
        setStartTime(new Date())
      } catch (err) {
        console.error("Error loading quiz:", err)
        setError("Failed to load quiz")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 }

    let correct = 0
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id]
      if (userAnswer) {
        const userIndex = question.options.indexOf(userAnswer)
        if (question.correctAnswers.includes(userIndex)) {
          correct++
        }
      }
    })

    const total = quiz.questions.length
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

    return { correct, total, percentage }
  }

  const handleSubmit = async () => {
    if (!quiz || !user || !startTime) return

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter(q => !answers[q.id])
    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const duration = Math.round((new Date().getTime() - startTime.getTime()) / 60000) // in minutes

      const response = await fetch('/api/attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: answers,
          duration: duration,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit quiz')
      }

      const result = await response.json()
      setAttemptResult(result)
      setIsSubmitted(true)
    } catch (err) {
      console.error('Error submitting quiz:', err)
      setError('Failed to submit quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <StudentSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="text-center py-12">
            <p>Loading quiz...</p>
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
            <p>Please log in to attempt quizzes.</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="flex min-h-screen bg-background">
        <StudentSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg mb-4">{error || "Quiz not found"}</p>
            <Button asChild>
              <Link href="/student/quizzes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Quizzes
              </Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  // ✅ Results Screen
  if (isSubmitted && attemptResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center pb-6">
            <div className={`mx-auto p-4 rounded-full w-fit mb-4 ${attemptResult.passed ? "bg-green-100" : "bg-red-100"}`}>
              {attemptResult.passed ? (
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              ) : (
                <X className="h-12 w-12 text-red-600" />
              )}
            </div>
            <CardTitle className="text-3xl mb-2">Quiz Completed!</CardTitle>
            <CardDescription className="text-lg">Here are your results</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <div className="text-6xl font-bold mb-2">{attemptResult.score}/{quiz.questions.length}</div>
              <div className={`text-2xl font-semibold ${attemptResult.passed ? "text-green-600" : "text-red-600"}`}>
                {attemptResult.passed ? "PASSED" : "FAILED"}
              </div>
              <p className="text-muted-foreground mt-2">
                You need {quiz.passingCriteria}% to pass this quiz
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/student/attempts">Back to My Attempts</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/student/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Quiz Taking Screen
  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button asChild variant="ghost">
              <Link href="/student/quizzes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Quizzes
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {startTime && Math.round((new Date().getTime() - startTime.getTime()) / 60000)}m
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-muted-foreground mb-4">{quiz.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </Badge>
              <Badge variant="outline">
                {Object.keys(answers).length} answered
              </Badge>
              <Badge variant="outline">
                Passing: {quiz.passingCriteria}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">{currentQuestion.text}</p>
            
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < quiz.questions.length || submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
