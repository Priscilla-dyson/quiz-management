"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Search, Plus, Edit, Trash2, BarChart3, Eye, MoreHorizontal, Filter, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Quiz {
  id: number
  title: string
  description: string
  createdAt: string
  questions: { id: number }[]
  attempts: { id: number; score: number; passed: boolean }[]
}

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("dateCreated")
  const { toast } = useToast()

  // Fetch quizzes from API
  useEffect(() => {
    async function fetchQuizzes() {
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

  // Status is derived from quiz content
  const getStatus = (quiz: Quiz): "active" | "draft" | "inactive" => {
    if (!quiz.questions.length) return "draft"
    if (!quiz.attempts.length) return "inactive"
    return "active"
  }

  // Filters + Sorting
  const filteredQuizzes = quizzes
    .filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || getStatus(quiz) === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "dateCreated") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "attempts") return b.attempts.length - a.attempts.length
      return 0
    })

  // Delete quiz (API call)
  const handleDeleteQuiz = async (quizId: number) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Failed to delete quiz")
      }
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId))
      toast({
        title: "Quiz Deleted",
        description: "Quiz has been successfully deleted.",
      })
    } catch (err) {
      console.error("Failed to delete quiz:", err)
      toast({
        title: "Deletion Failed",
        description: "Failed to delete quiz. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: "active" | "inactive" | "draft") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Manage Quizzes</h1>
              <p className="text-muted-foreground">View and manage all your quizzes</p>
            </div>
            <Button asChild>
              <Link href="/admin/quiz/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Quiz
              </Link>
            </Button>
          </div>

          {/* Filters + Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search quizzes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateCreated">Date Created</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="attempts">Attempts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quizzes Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Quizzes ({filteredQuizzes.length})</CardTitle>
            <CardDescription>Manage your quiz collection and track performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading quizzes...
                      </TableCell>
                    </TableRow>
                  ) : filteredQuizzes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No quizzes found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuizzes.map((quiz) => {
                      const status = getStatus(quiz)
                      const avgScore =
                        quiz.attempts.length > 0
                          ? Math.round(quiz.attempts.reduce((s, a) => s + a.score, 0) / quiz.attempts.length)
                          : 0
                      return (
                        <TableRow key={quiz.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{quiz.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">{quiz.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(status)}</TableCell>
                          <TableCell>{quiz.questions.length}</TableCell>
                          <TableCell>{quiz.attempts.length}</TableCell>
                          <TableCell>{quiz.attempts.length > 0 ? `${avgScore}%` : "N/A"}</TableCell>
                          <TableCell>{new Date(quiz.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/quiz/${quiz.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {`Are you sure you want to delete "${quiz.title}"? This action cannot be undone.`}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteQuiz(quiz.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete Quiz
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{quizzes.length}</div>
              <p className="text-xs text-muted-foreground">Total Quizzes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {quizzes.filter((q) => getStatus(q) === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Active Quizzes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {quizzes.reduce((sum, q) => sum + q.attempts.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total Attempts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {Math.round(
                  quizzes.filter((q) => q.attempts.length > 0).reduce((sum, q) => sum + (q.attempts.reduce((s, a) => s + a.score, 0) / q.attempts.length), 0) /
                    (quizzes.filter((q) => q.attempts.length > 0).length || 1)
                )}%
              </div>
              <p className="text-xs text-muted-foreground">Overall Avg Score</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
