"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Search, Plus, Edit, Trash2, BarChart3, Eye, MoreHorizontal, Filter, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  id: string
  title: string
  description: string
  dateCreated: string
  status: "active" | "inactive" | "draft"
  questions: number
  attempts: number
  averageScore: number
}

// Mock data - in a real app, this would come from an API
const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "JavaScript Basics",
    description: "Fundamental concepts of JavaScript programming",
    dateCreated: "2024-01-15",
    status: "active",
    questions: 15,
    attempts: 45,
    averageScore: 78,
  },
  {
    id: "2",
    title: "React Components",
    description: "Understanding React component lifecycle and props",
    dateCreated: "2024-01-20",
    status: "active",
    questions: 12,
    attempts: 32,
    averageScore: 82,
  },
  {
    id: "3",
    title: "Advanced CSS",
    description: "CSS Grid, Flexbox, and modern layout techniques",
    dateCreated: "2024-01-25",
    status: "inactive",
    questions: 20,
    attempts: 18,
    averageScore: 65,
  },
  {
    id: "4",
    title: "Database Design",
    description: "Relational database concepts and normalization",
    dateCreated: "2024-02-01",
    status: "draft",
    questions: 8,
    attempts: 0,
    averageScore: 0,
  },
  {
    id: "5",
    title: "Node.js Fundamentals",
    description: "Server-side JavaScript with Node.js",
    dateCreated: "2024-02-05",
    status: "active",
    questions: 18,
    attempts: 28,
    averageScore: 74,
  },
]

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("dateCreated")

  const filteredQuizzes = quizzes
    .filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || quiz.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "dateCreated") {
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }
      if (sortBy === "attempts") {
        return b.attempts - a.attempts
      }
      return 0
    })

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId))
  }

  const toggleQuizStatus = (quizId: string) => {
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz.id === quizId ? { ...quiz, status: quiz.status === "active" ? "inactive" : "active" } : quiz,
      ),
    )
  }

  const getStatusBadge = (status: Quiz["status"]) => {
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

          {/* Filters and Search */}
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
                  {filteredQuizzes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No quizzes found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{quiz.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{quiz.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(quiz.status)}</TableCell>
                        <TableCell>{quiz.questions}</TableCell>
                        <TableCell>{quiz.attempts}</TableCell>
                        <TableCell>{quiz.attempts > 0 ? `${quiz.averageScore}%` : "N/A"}</TableCell>
                        <TableCell>{new Date(quiz.dateCreated).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/quiz/${quiz.id}/preview`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/quiz/${quiz.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/quiz/${quiz.id}/results`}>
                                  <BarChart3 className="mr-2 h-4 w-4" />
                                  View Results
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => toggleQuizStatus(quiz.id)}>
                                {quiz.status === "active" ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{quiz.title}"? This action cannot be undone. All
                                      quiz attempts and results will be permanently lost.
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
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
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
              <div className="text-2xl font-bold">{quizzes.filter((q) => q.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">Active Quizzes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{quizzes.reduce((sum, q) => sum + q.attempts, 0)}</div>
              <p className="text-xs text-muted-foreground">Total Attempts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {Math.round(
                  quizzes.filter((q) => q.attempts > 0).reduce((sum, q) => sum + q.averageScore, 0) /
                    quizzes.filter((q) => q.attempts > 0).length || 0,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">Overall Avg Score</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
