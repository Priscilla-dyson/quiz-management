import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Users, GraduationCap, Shield } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
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
            A comprehensive platform for creating, managing, and taking quizzes. Choose your role to get started.
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
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription className="text-base">
                Manage quizzes, view results, and oversee the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" placeholder="admin@example.com" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input id="admin-password" type="password" placeholder="Enter your password" className="h-11" />
              </div>
              <Button asChild className="w-full h-11 text-base">
                <Link href="/admin/dashboard">Sign In as Admin</Link>
              </Button>
              <div className="text-center">
                <Link
                  href="/admin/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Student Login */}
          <Card className="border-2 hover:border-secondary/20 transition-colors">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-3 bg-secondary/10 rounded-full w-fit mb-4">
                <GraduationCap className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Student Login</CardTitle>
              <CardDescription className="text-base">
                Take quizzes, view your results, and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-email">Email or Username</Label>
                <Input id="student-email" type="text" placeholder="student@example.com" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password">Password</Label>
                <Input id="student-password" type="password" placeholder="Enter your password" className="h-11" />
              </div>
              <Button asChild variant="secondary" className="w-full h-11 text-base">
                <Link href="/student/dashboard">Sign In as Student</Link>
              </Button>
              <div className="text-center">
                <Link
                  href="/student/forgot-password"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors"
                >
                  Forgot password?
                </Link>
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
              <h3 className="font-medium text-foreground">Quiz Creation</h3>
              <p className="text-sm text-muted-foreground text-center">
                Create engaging quizzes with multiple question types
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-full">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium text-foreground">User Management</h3>
              <p className="text-sm text-muted-foreground text-center">Manage students and track their progress</p>
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
