"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, BarChart3, Plus, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { AdminSidebar } from "@/components/admin-sidebar"

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Quiz {
  id: number
  title: string
  description?: string
  passingCriteria: number
  createdAt: string
  questions: { id: number }[]
  attempts: { id: number; score: number; passed: boolean; userId: number }[]
}

interface Attempt {
  id: number
  score: number
  passed: boolean
  createdAt: string
  user: { email: string }
  quiz: { title: string }
}

interface Activity {
  type: 'quiz_created' | 'quiz_attempt'
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
  color: string
  badge?: string
  badgeVariant?: 'secondary' | 'destructive'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    quizzes: 0,
    activeQuizzes: 0,
    students: 0,
    attempts: 0,
  })
  const [recent, setRecent] = useState<Activity[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        // Get current user session
        const sessionRes = await fetch('/api/auth/session')
        const sessionData = await sessionRes.json()
        if (!sessionData.user || sessionData.user.role !== 'ADMIN') {
          router.push('/')
          return
        }
        setUser(sessionData.user)

        // Fetch quizzes
        const quizzesRes = await fetch('/api/quizzes')
        const quizzesData: Quiz[] = await quizzesRes.json()

        // Fetch attempts
        const attemptsRes = await fetch('/api/attempts')
        const attemptsData: Attempt[] = await attemptsRes.json()

        // Calculate stats
        const totalQuizzes = quizzesData.length
        const activeQuizzes = quizzesData.filter(q => q.questions.length > 0).length
        const totalAttempts = attemptsData.length
        const studentEmails = new Set(attemptsData.map(a => a.user.email))
        const totalStudents = studentEmails.size

        setStats({
          quizzes: totalQuizzes,
          activeQuizzes,
          students: totalStudents,
          attempts: totalAttempts,
        })

        // Create comprehensive recent activities
        const activities: any[] = []
        
        // Add recent quiz creations
        quizzesData
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
          .forEach(quiz => {
            activities.push({
              type: 'quiz_created',
              title: `Quiz "${quiz.title}" created`,
              description: `${quiz.questions.length} questions`,
              timestamp: quiz.createdAt,
              icon: <BookOpen className="h-4 w-4 text-blue-600" />,
              color: 'bg-blue-100'
            })
          })
        
        // Add recent attempts
        attemptsData
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .forEach(attempt => {
            activities.push({
              type: 'quiz_attempt',
              title: `${attempt.user?.email} ${attempt.passed ? 'passed' : 'failed'} "${attempt.quiz?.title}"`,
              description: `Score: ${attempt.score}%`,
              timestamp: attempt.createdAt,
              icon: attempt.passed ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />,
              color: attempt.passed ? 'bg-green-100' : 'bg-red-100',
              badge: attempt.passed ? 'Pass' : 'Fail',
              badgeVariant: attempt.passed ? 'secondary' : 'destructive'
            })
          })
        
        // Sort all activities by timestamp and take latest 5
        const recentActivities = activities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5)
        
        setRecent(recentActivities)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="text-center py-12">
            <p>Loading dashboard...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="text-center py-12">
            <p>Please log in as admin to view this dashboard.</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            {`Welcome back! Here's an overview of your quiz management system.`}
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
            <CardDescription>Latest activities in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recent.length > 0 ? (
                recent.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className={`p-2 rounded-full ${activity.color}`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description} • {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    {activity.badge && (
                      <Badge variant={activity.badgeVariant}>
                        {activity.badge}
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No recent activities.</p>
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
