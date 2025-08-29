"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, X } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

interface Question {
  id: number
  text: string
  options: string[]
  answer: string // correct answer stored in DB (we won’t show it here)
}

interface Quiz {
  id: number
  title: string
  description: string
  passMark: number
  questions: Question[]
}

export default function QuizAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptResult, setAttemptResult] = useState<any>(null)

  const studentId = 1 // TODO: replace with real auth user id

  // fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quizzes/${params.id}`)
        if (!res.ok) throw new Error("Failed to load quiz")
        const data = await res.json()
        setQuiz(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [params.id])

  const handleAnswerChange = (questionId: number, selectedOption: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }))
  }

  const handleSubmitQuiz = async () => {
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: studentId,
          quizId: quiz?.id,
          answers,
        }),
      })
      if (!res.ok) throw new Error("Failed to submit attempt")
      const data = await res.json()
      setAttemptResult(data)
      setIsSubmitted(true)
    } catch (err) {
      console.error("Submit error:", err)
    }
  }

  if (loading) return <div className="p-6">Loading quiz...</div>
  if (!quiz) return <div className="p-6 text-red-600">Quiz not found</div>

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
                You need {quiz.passMark}% to pass this quiz
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

  // ✅ Quiz Taking Screen
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button asChild variant="outline">
              <Link href="/student/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Exit Quiz
              </Link>
            </Button>
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </Badge>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Question {currentQuestionIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg font-medium leading-relaxed">{currentQuestion.text}</p>

            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {Object.keys(answers).length} of {quiz.questions.length} answered
          </div>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(Math.min(quiz.questions.length - 1, currentQuestionIndex + 1))}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
