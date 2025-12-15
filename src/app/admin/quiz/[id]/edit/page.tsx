"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ArrowLeft, Plus, Trash2, Save, Eye } from "lucide-react"
import Link from "next/link"

interface Question {
  id?: number
  type: 'multiple-choice' | 'true-false'
  text: string
  options: string[]
  correctAnswers: number[]
}

interface Quiz {
  id: number
  title: string
  description: string
  passingCriteria: number
  questions: Question[]
}

export default function EditQuizPage() {
  const params = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`/api/quizzes/${params.id}`)
        if (!res.ok) throw new Error("Failed to fetch quiz")
        const data = await res.json()
        setQuiz(data)
      } catch (err) {
        console.error("Error loading quiz:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [params.id])

  const addQuestion = () => {
    if (!quiz) return
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          type: 'multiple-choice',
          text: '',
          options: ['', '', '', ''],
          correctAnswers: []
        }
      ]
    })
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    if (!quiz) return
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    setQuiz({ ...quiz, questions: updatedQuestions })
  }

  const removeQuestion = (index: number) => {
    if (!quiz) return
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index)
    })
  }

  const handleSave = async () => {
    if (!quiz) return
    setSaving(true)
    try {
      const res = await fetch(`/api/quizzes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz)
      })
      if (!res.ok) throw new Error("Failed to save quiz")
      router.push('/admin/quizzes')
    } catch (err) {
      console.error("Error saving quiz:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="text-center py-12">
            <p>Loading quiz...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="text-center py-12">
            <p>Quiz not found.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="ghost">
              <Link href="/admin/quizzes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Quizzes
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/admin/quiz/${quiz.id}/preview`}>
                <Eye className="mr-2 h-4 w-4" />
                Preview Quiz
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Edit Quiz</h1>
          <p className="text-muted-foreground">Modify quiz details and questions</p>
        </div>

        {/* Quiz Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
            <CardDescription>Basic information about the quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                placeholder="Enter quiz title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                placeholder="Enter quiz description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="passingCriteria">Passing Criteria (%)</Label>
              <Input
                id="passingCriteria"
                type="number"
                min="0"
                max="100"
                value={quiz.passingCriteria}
                onChange={(e) => setQuiz({ ...quiz, passingCriteria: parseInt(e.target.value) || 0 })}
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
                <CardDescription>Add and edit quiz questions</CardDescription>
              </div>
              <Button onClick={addQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Question {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Question Type</Label>
                      <Select
                        value={question.type}
                        onValueChange={(value: 'multiple-choice' | 'true-false') =>
                          updateQuestion(index, 'type', value)
                        }
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

                    <div>
                      <Label>Question Text</Label>
                      <Textarea
                        value={question.text}
                        onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                        placeholder="Enter your question"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Options</Label>
                      {question.type === 'true-false' ? (
                        <div className="grid grid-cols-2 gap-2">
                          {['True', 'False'].map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${index}`}
                                checked={question.correctAnswers.includes(optionIndex)}
                                onChange={() => updateQuestion(index, 'correctAnswers', [optionIndex])}
                              />
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={question.correctAnswers.includes(optionIndex)}
                                onChange={(e) => {
                                  const newCorrectAnswers = e.target.checked
                                    ? [...question.correctAnswers, optionIndex]
                                    : question.correctAnswers.filter(i => i !== optionIndex)
                                  updateQuestion(index, 'correctAnswers', newCorrectAnswers)
                                }}
                              />
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options]
                                  newOptions[optionIndex] = e.target.value
                                  updateQuestion(index, 'options', newOptions)
                                }}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              {question.correctAnswers.includes(optionIndex) && (
                                <Badge variant="default">Correct</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {quiz.questions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No questions yet. Click "Add Question" to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Quiz'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/quizzes">Cancel</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
