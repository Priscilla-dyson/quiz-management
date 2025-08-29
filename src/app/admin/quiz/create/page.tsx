"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Plus, Trash2, Save, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"

type QuestionType = "multiple-choice" | "true-false"

interface Question {
  id: string
  type: QuestionType
  question: string
  options: string[]
  correctAnswers: number[]
}

interface QuizData {
  title: string
  description: string
  passingCriteria: number
  questions: Question[]
}

export default function CreateQuiz() {
  const [quizData, setQuizData] = useState<QuizData>({
    title: "",
    description: "",
    passingCriteria: 70,
    questions: [],
  })
  const [loading, setLoading] = useState(false)

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswers: [],
    }
    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
  }

  const removeQuestion = (questionId: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
  }

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
    }))
  }

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)) } : q,
      ),
    }))
  }

  const toggleCorrectAnswer = (questionId: string, optionIndex: number) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q
        if (q.type === "multiple-choice") {
          const correctAnswers = q.correctAnswers.includes(optionIndex)
            ? q.correctAnswers.filter((idx) => idx !== optionIndex)
            : [...q.correctAnswers, optionIndex]
          return { ...q, correctAnswers }
        } else {
          return { ...q, correctAnswers: [optionIndex] }
        }
      }),
    }))
  }

  const handleQuestionTypeChange = (questionId: string, type: QuestionType) => {
    updateQuestion(questionId, {
      type,
      options: type === "true-false" ? ["True", "False"] : ["", "", "", ""],
      correctAnswers: [],
    })
  }

  // --- Save Draft (no API, just console) ---
  const handleSaveQuiz = () => {
    console.log("Draft quiz:", quizData)
    alert("Draft saved locally (not in DB)")
  }

  // --- Publish Quiz to backend ---
  const handlePublishQuiz = async () => {
    try {
      setLoading(true)

      // 1. Create Quiz
      const quizRes = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: quizData.title,
          description: quizData.description,
          passMark: quizData.passingCriteria,
          creatorId: 1, // TODO: replace with logged-in admin ID when auth is ready
        }),
      })

      if (!quizRes.ok) throw new Error("Failed to create quiz")
      const quiz = await quizRes.json()

      // 2. Create Questions for the quiz
      for (const q of quizData.questions) {
        await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: q.question,
            options: q.options,
            answer: q.correctAnswers.map((idx) => q.options[idx]).join(","), // save answers as string
            quizId: quiz.id,
          }),
        })
      }

      alert("Quiz published successfully!")
      setQuizData({ title: "", description: "", passingCriteria: 70, questions: [] })
    } catch (err) {
      console.error(err)
      alert("Error publishing quiz. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Quiz</h1>
          <p className="text-muted-foreground">Design and configure your quiz with multiple question types.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Quiz Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
              <CardDescription>Basic details about your quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-title">Quiz Title *</Label>
                <Input
                  id="quiz-title"
                  placeholder="Enter quiz title"
                  value={quizData.title}
                  onChange={(e) => setQuizData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quiz-description">Description</Label>
                <Textarea
                  id="quiz-description"
                  placeholder="Describe what this quiz covers"
                  value={quizData.description}
                  onChange={(e) => setQuizData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passing-criteria">Passing Criteria (%)</Label>
                <Input
                  id="passing-criteria"
                  type="number"
                  min="0"
                  max="100"
                  value={quizData.passingCriteria}
                  onChange={(e) =>
                    setQuizData((prev) => ({ ...prev, passingCriteria: Number.parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Questions</CardTitle>
                  <CardDescription>Add and configure quiz questions</CardDescription>
                </div>
                <Button onClick={addQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {quizData.questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{`No questions added yet. Click "Add Question" to get started.`}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {quizData.questions.map((question, index) => (
                    <Card key={question.id} className="border-2">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Type */}
                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <Select
                            value={question.type}
                            onValueChange={(value: QuestionType) => handleQuestionTypeChange(question.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                              <SelectItem value="true-false">True/False</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                          <Label>Question Text *</Label>
                          <Textarea
                            placeholder="Enter your question"
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                            rows={2}
                          />
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                          <Label>Answer Options</Label>
                          <div className="space-y-3">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-3">
                                <div className="flex items-center space-x-2">
                                  {question.type === "multiple-choice" ? (
                                    <Checkbox
                                      checked={question.correctAnswers.includes(optionIndex)}
                                      onCheckedChange={() => toggleCorrectAnswer(question.id, optionIndex)}
                                    />
                                  ) : (
                                    <RadioGroup
                                      value={question.correctAnswers[0]?.toString() || ""}
                                      onValueChange={(value) =>
                                        toggleCorrectAnswer(question.id, Number.parseInt(value))
                                      }
                                    >
                                      <RadioGroupItem value={optionIndex.toString()} />
                                    </RadioGroup>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <Input
                                    placeholder={
                                      question.type === "true-false"
                                        ? optionIndex === 0
                                          ? "True"
                                          : "False"
                                        : `Option ${String.fromCharCode(65 + optionIndex)}`
                                    }
                                    value={option}
                                    onChange={(e) => updateQuestionOption(question.id, optionIndex, e.target.value)}
                                    disabled={question.type === "true-false"}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {question.type === "multiple-choice"
                              ? "Check the box(es) for correct answer(s)"
                              : "Select the correct answer"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              {quizData.questions.length} question{quizData.questions.length !== 1 ? "s" : ""} added
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSaveQuiz} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button onClick={handlePublishQuiz} disabled={loading}>
                {loading ? "Publishing..." : "Publish Quiz"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
