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
  id: string
  type: "multiple-choice" | "true-false"
  question: string
  options: string[]
  correctAnswers: number[]
}

interface Quiz {
  id: string
  title: string
  description: string
  duration: number
  passingScore: number
  questions: Question[]
}

interface QuizAttempt {
  answers: { [questionId: string]: number[] }
  startTime: number
  endTime?: number
}

// Mock quiz data - in a real app, this would come from an API
const mockQuiz: Quiz = {
  id: "1",
  title: "JavaScript Basics",
  description:
    "Test your knowledge of fundamental JavaScript concepts including variables, functions, and control structures.",
  duration: 30,
  passingScore: 70,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "Which of the following is the correct way to declare a variable in JavaScript?",
      options: ["var myVar = 5;", "variable myVar = 5;", "v myVar = 5;", "declare myVar = 5;"],
      correctAnswers: [0],
    },
    {
      id: "q2",
      type: "true-false",
      question: "JavaScript is a statically typed language.",
      options: ["True", "False"],
      correctAnswers: [1],
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Which method is used to add an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctAnswers: [0],
    },
    {
      id: "q4",
      type: "multiple-choice",
      question: "What will console.log(typeof null) output?",
      options: ["'null'", "'undefined'", "'object'", "'boolean'"],
      correctAnswers: [2],
    },
    {
      id: "q5",
      type: "true-false",
      question: "The '===' operator checks for both value and type equality.",
      options: ["True", "False"],
      correctAnswers: [0],
    },
  ],
}

export default function QuizAttempt() {
  const params = useParams()
  const router = useRouter()
  const [quiz] = useState<Quiz>(mockQuiz) // In real app, fetch based on params.id
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [attempt, setAttempt] = useState<QuizAttempt>({
    answers: {},
    startTime: Date.now(),
  })
  const [timeRemaining, setTimeRemaining] = useState(quiz.duration * 60) // Convert minutes to seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Timer effect
  useEffect(() => {
    if (isSubmitted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    const question = quiz.questions.find((q) => q.id === questionId)
    if (!question) return

    setAttempt((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: question.type === "multiple-choice" ? [answerIndex] : [answerIndex],
      },
    }))
  }

  const handleSubmitQuiz = () => {
    setAttempt((prev) => ({
      ...prev,
      endTime: Date.now(),
    }))
    setIsSubmitted(true)
  }

  const calculateScore = () => {
    let correctAnswers = 0
    quiz.questions.forEach((question) => {
      const userAnswer = attempt.answers[question.id] || []
      const correctAnswer = question.correctAnswers
      if (userAnswer.length === correctAnswer.length && userAnswer.every((answer) => correctAnswer.includes(answer))) {
        correctAnswers++
      }
    })
    return Math.round((correctAnswers / quiz.questions.length) * 100)
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  const score = isSubmitted ? calculateScore() : 0
  const passed = score >= quiz.passingScore

  if (isSubmitted && !showResults) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center pb-6">
            <div className={`mx-auto p-4 rounded-full w-fit mb-4 ${passed ? "bg-green-100" : "bg-red-100"}`}>
              {passed ? (
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
              <div className="text-6xl font-bold mb-2">{score}%</div>
              <div className={`text-2xl font-semibold ${passed ? "text-green-600" : "text-red-600"}`}>
                {passed ? "PASSED" : "FAILED"}
              </div>
              <p className="text-muted-foreground mt-2">You need {quiz.passingScore}% to pass this quiz</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y">
              <div>
                <div className="text-2xl font-bold">
                  {
                    quiz.questions.filter(
                      (q) =>
                        attempt.answers[q.id]?.length > 0 &&
                        quiz.questions
                          .find((question) => question.id === q.id)
                          ?.correctAnswers.every((answer) => attempt.answers[q.id]?.includes(answer)),
                    ).length
                  }
                </div>
                <p className="text-sm text-muted-foreground">Correct Answers</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{Math.floor((attempt.endTime! - attempt.startTime) / 60000)}</div>
                <p className="text-sm text-muted-foreground">Minutes Taken</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => setShowResults(true)} variant="outline">
                View Detailed Results
              </Button>
              <Button asChild>
                <Link href="/student/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button asChild variant="outline" className="mb-4 bg-transparent">
              <Link href="/student/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-2">Detailed Results</h1>
            <p className="text-muted-foreground">Review your answers and see the correct solutions</p>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = attempt.answers[question.id] || []
              const isCorrect =
                question.correctAnswers.every((answer) => userAnswer.includes(answer)) &&
                userAnswer.every((answer) => question.correctAnswers.includes(answer))

              return (
                <Card key={question.id} className={`border-2 ${isCorrect ? "border-green-200" : "border-red-200"}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <Badge
                        variant={isCorrect ? "default" : "destructive"}
                        className={isCorrect ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-medium">{question.question}</p>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer.includes(optionIndex)
                        const isCorrectAnswer = question.correctAnswers.includes(optionIndex)

                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border-2 ${
                              isCorrectAnswer
                                ? "border-green-200 bg-green-50"
                                : isUserAnswer
                                  ? "border-red-200 bg-red-50"
                                  : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                              {isUserAnswer && !isCorrectAnswer && <X className="h-4 w-4 text-red-600" />}
                              <span>{option}</span>
                              {isUserAnswer && (
                                <Badge variant="outline" className="ml-auto">
                                  Your Answer
                                </Badge>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={timeRemaining < 300 ? "text-red-600 font-semibold" : ""}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </Badge>
            </div>
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
            <p className="text-lg font-medium leading-relaxed">{currentQuestion.question}</p>

            <div className="space-y-3">
              {currentQuestion.type === "multiple-choice" ? (
                <RadioGroup
                  value={attempt.answers[currentQuestion.id]?.[0]?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, Number.parseInt(value))}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <RadioGroup
                  value={attempt.answers[currentQuestion.id]?.[0]?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, Number.parseInt(value))}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
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
            {Object.keys(attempt.answers).length} of {quiz.questions.length} answered
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
