'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, GraduationCap, Shield } from "lucide-react"
import Link from "next/link"
import { useAuth } from '@/contexts/AuthContext'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/student/dashboard')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary rounded-xl">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Quiz Management System</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            A comprehensive platform for creating, managing, and taking quizzes. Sign in to get started.
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Admin Login */}
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <CardDescription className="text-base">
                Manage quizzes, view results, and oversee the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Access the admin dashboard to manage the platform
              </p>
              <Button asChild className="w-full h-11 text-base">
                <Link href="/login">Sign In as Admin</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Student Login */}
          <Card className="border-2 hover:border-secondary/20 transition-colors">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-3 bg-secondary/10 rounded-full w-fit mb-4">
                <GraduationCap className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Student Access</CardTitle>
              <CardDescription className="text-base">
                Take quizzes, view your results, and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Access your student dashboard and take quizzes
              </p>
              <Button asChild variant="secondary" className="w-full h-11 text-base">
                <Link href="/login">Sign In as Student</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Demo Credentials */}
        <div className="mt-12 max-w-md mx-auto">
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-center mb-4">Demo Credentials</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Admin:</span>
                  <span className="text-muted-foreground">admin@example.com / admin123</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Student:</span>
                  <span className="text-muted-foreground">student@example.com / student123</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Preview */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-8">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-full">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium text-foreground">Secure Authentication</h3>
              <p className="text-sm text-muted-foreground text-center">
                Role-based access control for admins and students
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-full">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium text-foreground">Quiz Management</h3>
              <p className="text-sm text-muted-foreground text-center">Create and manage quizzes with multiple question types</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-full">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium text-foreground">Results & Analytics</h3>
              <p className="text-sm text-muted-foreground text-center">Detailed insights and performance tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
