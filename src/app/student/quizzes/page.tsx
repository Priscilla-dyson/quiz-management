import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, BookOpen, Users, Star, Filter, Play } from "lucide-react"

// Mock quiz data
const quizzes = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
    difficulty: "Beginner",
    duration: 30,
    questions: 15,
    attempts: 1247,
    rating: 4.8,
    category: "Programming",
    status: "Available",
    passingScore: 70,
  },
  {
    id: 2,
    title: "React Components & Hooks",
    description: "Advanced React concepts including custom hooks, context API, and component lifecycle.",
    difficulty: "Intermediate",
    duration: 45,
    questions: 20,
    attempts: 892,
    rating: 4.6,
    category: "Programming",
    status: "Available",
    passingScore: 75,
  },
  {
    id: 3,
    title: "Database Design Principles",
    description: "Learn about normalization, relationships, and SQL query optimization techniques.",
    difficulty: "Advanced",
    duration: 60,
    questions: 25,
    attempts: 634,
    rating: 4.9,
    category: "Database",
    status: "Available",
    passingScore: 80,
  },
  {
    id: 4,
    title: "Web Security Fundamentals",
    description: "Understanding common security vulnerabilities and how to prevent them in web applications.",
    difficulty: "Intermediate",
    duration: 40,
    questions: 18,
    attempts: 756,
    rating: 4.7,
    category: "Security",
    status: "Available",
    passingScore: 75,
  },
  {
    id: 5,
    title: "API Design & REST Principles",
    description: "Best practices for designing RESTful APIs and understanding HTTP methods and status codes.",
    difficulty: "Intermediate",
    duration: 35,
    questions: 16,
    attempts: 543,
    rating: 4.5,
    category: "Backend",
    status: "Available",
    passingScore: 70,
  },
  {
    id: 6,
    title: "Machine Learning Basics",
    description: "Introduction to machine learning concepts, algorithms, and practical applications.",
    difficulty: "Advanced",
    duration: 90,
    questions: 30,
    attempts: 289,
    rating: 4.8,
    category: "AI/ML",
    status: "Coming Soon",
    passingScore: 85,
  },
]

const categories = ["All", "Programming", "Database", "Security", "Backend", "AI/ML"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

export default function StudentQuizzesPage() {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Available Quizzes</h1>
            <p className="text-muted-foreground">Explore and take quizzes to test your knowledge and skills</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search quizzes..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Category
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Difficulty
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button key={category} variant={category === "All" ? "default" : "outline"} size="sm">
                {category}
              </Button>
            ))}
          </div>

          {/* Quiz Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant={
                        quiz.difficulty === "Beginner"
                          ? "secondary"
                          : quiz.difficulty === "Intermediate"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {quiz.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{quiz.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Quiz Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.questions} questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.attempts.toLocaleString()} attempts</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Pass: </span>
                        <span className="font-medium">{quiz.passingScore}%</span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {quiz.category}
                      </Badge>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full"
                      disabled={quiz.status === "Coming Soon"}
                      asChild={quiz.status === "Available"}
                    >
                      {quiz.status === "Available" ? (
                        <a href={`/student/quiz/${quiz.id}`}>
                          <Play className="h-4 w-4 mr-2" />
                          Start Quiz
                        </a>
                      ) : (
                        <>Coming Soon</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-8">
            <Button variant="outline">Load More Quizzes</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
