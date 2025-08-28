import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, CheckCircle, Play, Trophy, TrendingUp } from "lucide-react"
import Link from "next/link"
import { StudentSidebar } from "@/components/student-sidebar"

// Mock data - in a real app, this would come from an API
const availableQuizzes = [
  {
    id: "1",
    title: "JavaScript Basics",
    description:
      "Fundamental concepts of JavaScript programming including variables, functions, and control structures.",
    questions: 15,
    duration: 30,
    difficulty: "Beginner",
    passingScore: 70,
    isCompleted: false,
  },
  {
    id: "2",
    title: "React Components",
    description: "Understanding React component lifecycle, props, and state management.",
    questions: 12,
    duration: 25,
    difficulty: "Intermediate",
    passingScore: 75,
    isCompleted: true,
    lastScore: 82,
  },
  {
    id: "3",
    title: "Advanced CSS",
    description: "CSS Grid, Flexbox, animations, and modern layout techniques.",
    questions: 20,
    duration: 40,
    difficulty: "Advanced",
    passingScore: 70,
    isCompleted: false,
  },
  {
    id: "5",
    title: "Node.js Fundamentals",
    description: "Server-side JavaScript with Node.js, Express, and basic API development.",
    questions: 18,
    duration: 35,
    difficulty: "Intermediate",
    passingScore: 70,
    isCompleted: false,
  },
]

const recentAttempts = [
  {
    id: "1",
    quizTitle: "React Components",
    score: 82,
    result: "pass",
    date: "2024-02-08",
    duration: 23,
  },
  {
    id: "2",
    quizTitle: "HTML & CSS Basics",
    score: 95,
    result: "pass",
    date: "2024-02-05",
    duration: 18,
  },
  {
    id: "3",
    quizTitle: "Database Concepts",
    score: 65,
    result: "fail",
    date: "2024-02-01",
    duration: 28,
  },
]

export default function StudentDashboard() {
  const studentName = "Alex Johnson" // In a real app, this would come from authentication
  const completedQuizzes = availableQuizzes.filter((quiz) => quiz.isCompleted).length
  const averageScore = Math.round(
    recentAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / recentAttempts.length,
  )

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Beginner</Badge>
      case "Intermediate":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Intermediate</Badge>
      case "Advanced":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Advanced</Badge>
      default:
        return <Badge variant="secondary">{difficulty}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {studentName}!</h1>
            <p className="text-muted-foreground">
              Ready to continue your learning journey? Check out the available quizzes below.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{completedQuizzes}</div>
                    <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-full">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{averageScore}%</div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-full">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{availableQuizzes.length - completedQuizzes}</div>
                    <p className="text-sm text-muted-foreground">Available Quizzes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Quizzes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Quizzes</CardTitle>
                <CardDescription>Start a new quiz to test your knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="border-2 hover:border-primary/20 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{quiz.title}</h3>
                              {quiz.isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
                            </div>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{quiz.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {quiz.questions} questions
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {quiz.duration} min
                              </div>
                              <div>Passing: {quiz.passingScore}%</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getDifficultyBadge(quiz.difficulty)}
                            {quiz.isCompleted && quiz.lastScore && (
                              <Badge variant="outline" className="text-green-600">
                                Score: {quiz.lastScore}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            {quiz.isCompleted ? (
                              <div className="text-sm text-muted-foreground">Completed • You can retake this quiz</div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Not started</div>
                            )}
                          </div>
                          <Button asChild size="sm">
                            <Link href={`/student/quiz/${quiz.id}`}>
                              <Play className="mr-2 h-4 w-4" />
                              {quiz.isCompleted ? "Retake Quiz" : "Start Quiz"}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Attempts & Progress */}
          <div className="space-y-6">
            {/* Recent Attempts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Attempts</CardTitle>
                <CardDescription>Your latest quiz results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAttempts.slice(0, 3).map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{attempt.quizTitle}</p>
                        <p className="text-xs text-muted-foreground">{new Date(attempt.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{attempt.score}%</div>
                        <Badge variant={attempt.result === "pass" ? "default" : "destructive"} className="text-xs">
                          {attempt.result === "pass" ? "Pass" : "Fail"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
                  <Link href="/student/attempts">View All Attempts</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Track your overall performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Quiz Completion</span>
                    <span>
                      {completedQuizzes}/{availableQuizzes.length}
                    </span>
                  </div>
                  <Progress value={(completedQuizzes / availableQuizzes.length) * 100} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{averageScore}%</div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {recentAttempts.filter((a) => a.result === "pass").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Passed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      {recentAttempts.filter((a) => a.result === "fail").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
