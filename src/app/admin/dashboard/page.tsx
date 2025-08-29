"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, BarChart3, Plus, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    quizzes: 0,
    activeQuizzes: 0,
    students: 0,
    attempts: 0,
  })
  const [recent, setRecent] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const quizzesRes = await fetch("/api/quizzes")
        const quizzes = await quizzesRes.json()

        const usersRes = await fetch("/api/users")
        const users = await usersRes.json()

        const attemptsRes = await fetch("/api/attempts")
        const attempts = await attemptsRes.json()

        setStats({
          quizzes: quizzes.length,
          activeQuizzes: quizzes.filter((q: any) => q.questions.length > 0).length,
          students: users.filter((u: any) => u.role === "STUDENT").length,
          attempts: attempts.length,
        })

        // latest 5 attempts
        setRecent(attempts.slice(-5).reverse())
      } catch (err) {
        console.error("Error loading dashboard:", err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            {Welcome back! Here's an overview of your quiz management system.}
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Quizzes" value={stats.quizzes} icon={<BookOpen className="h-4 w-4" />} />
          <StatCard title="Active Quizzes" value={stats.activeQuizzes} icon={<CheckCircle className="h-4 w-4" />} />
          <StatCard title="Total Students" value={stats.students} icon={<Users className="h-4 w-4" />} />
          <StatCard title="Quiz Attempts" value={stats.attempts} icon={<TrendingUp className="h-4 w-4" />} />
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/quiz/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Quiz
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/admin/quizzes">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Quizzes
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/admin/results">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Results
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/admin/students">
                <Users className="mr-2 h-4 w-4" />
                Manage Students
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recent.length > 0 ? (
                recent.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className={p-2 rounded-full ${a.passed ? "bg-green-100" : "bg-red-100"}}>
                      {a.passed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {a.user?.email} {a.passed ? "passed" : "failed"} "{a.quiz?.title}"
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Score: {a.score}
                      </p>
                    </div>
                    <Badge variant={a.passed ? "secondary" : "destructive"}>
                      {a.passed ? "Pass" : "Fail"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No attempts yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}