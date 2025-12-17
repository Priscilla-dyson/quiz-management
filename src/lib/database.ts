// In-memory database implementation
// This can be easily replaced with a real database later

import { User, Quiz, Question, QuizAttempt, CreateQuizRequest, SubmitQuizRequest, AuthUser } from './types'
import bcrypt from 'bcryptjs'

class Database {
  private users: User[] = [
    {
      id: 1,
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJXxhLn3tFyGzUe', // "admin123"
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      email: 'student@example.com',
      name: 'Student User',
      role: 'STUDENT',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJXxhLn3tFyGzUe', // "student123"
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]

  private sessions: Map<string, { userId: number; expiresAt: Date }> = new Map()

  private quizzes: Quiz[] = [
    {
      id: 1,
      title: 'JavaScript Basics',
      description: 'Test your knowledge of JavaScript fundamentals',
      passingCriteria: 70,
      createdBy: 1,
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z'
    },
    {
      id: 2,
      title: 'React Fundamentals',
      description: 'Introduction to React components and hooks',
      passingCriteria: 75,
      createdBy: 1,
      createdAt: '2024-01-20T14:30:00.000Z',
      updatedAt: '2024-01-20T14:30:00.000Z'
    }
  ]

  private questions: Question[] = [
    // JavaScript Basics questions
    {
      id: 1,
      quizId: 1,
      type: 'multiple-choice',
      text: 'Which keyword declares a constant in JavaScript?',
      options: ['var', 'let', 'const', 'static'],
      correctAnswers: [2],
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z'
    },
    {
      id: 2,
      quizId: 1,
      type: 'multiple-choice',
      text: 'What is the result of typeof null?',
      options: ['\'null\'', '\'object\'', '\'undefined\'', '\'number\''],
      correctAnswers: [1],
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z'
    },
    {
      id: 3,
      quizId: 1,
      type: 'multiple-choice',
      text: 'Which method converts JSON string to object?',
      options: ['JSON.toString()', 'JSON.parse()', 'parseJSON()', 'Object.parse()'],
      correctAnswers: [1],
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z'
    },
    // React Fundamentals questions
    {
      id: 4,
      quizId: 2,
      type: 'multiple-choice',
      text: 'What is JSX?',
      options: ['A JavaScript framework', 'A syntax extension for JavaScript', 'A CSS preprocessor', 'A database query language'],
      correctAnswers: [1],
      createdAt: '2024-01-20T14:30:00.000Z',
      updatedAt: '2024-01-20T14:30:00.000Z'
    },
    {
      id: 5,
      quizId: 2,
      type: 'multiple-choice',
      text: 'Which hook is used for side effects in React?',
      options: ['useState', 'useEffect', 'useContext', 'useReducer'],
      correctAnswers: [1],
      createdAt: '2024-01-20T14:30:00.000Z',
      updatedAt: '2024-01-20T14:30:00.000Z'
    }
  ]

  private attempts: QuizAttempt[] = [
    {
      id: 1,
      quizId: 1,
      userId: 2,
      score: 2,
      passed: true,
      answers: { 1: 'const', 2: '\'object\'', 3: 'JSON.parse()' },
      duration: 15,
      createdAt: '2024-01-16T09:30:00.000Z',
      updatedAt: '2024-01-16T09:30:00.000Z'
    }
  ]

  // User methods
  getUsers(): User[] {
    return [...this.users]
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id)
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email)
  }

  async createUser(email: string, name: string, password: string, role: 'ADMIN' | 'STUDENT'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user: User = {
      id: Math.max(...this.users.map(u => u.id), 0) + 1,
      email,
      name,
      role,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.users.push(user)
    return user
  }

  // Authentication methods
  async authenticateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = this.getUserByEmail(email)
    if (!user) return null

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  }

  createSession(userId: number): string {
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    this.sessions.set(sessionId, { userId, expiresAt })
    return sessionId
  }

  getSession(sessionId: string): AuthUser | null {
    const session = this.sessions.get(sessionId)
    if (!session || session.expiresAt < new Date()) {
      if (session) this.sessions.delete(sessionId)
      return null
    }

    const user = this.getUserById(session.userId)
    if (!user) {
      this.sessions.delete(sessionId)
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  }

  destroySession(sessionId: string): void {
    this.sessions.delete(sessionId)
  }

  // Quiz methods
  getQuizzes(): Quiz[] {
    return this.quizzes.map(quiz => ({
      ...quiz,
      questions: this.questions.filter(q => q.quizId === quiz.id),
      attempts: this.attempts.filter(a => a.quizId === quiz.id)
    }))
  }

  getQuizById(id: number): Quiz | undefined {
    const quiz = this.quizzes.find(q => q.id === id)
    if (!quiz) return undefined

    return {
      ...quiz,
      questions: this.questions.filter(q => q.quizId === id),
      attempts: this.attempts.filter(a => a.quizId === id)
    }
  }

  createQuiz(data: CreateQuizRequest, createdBy: number): Quiz {
    const now = new Date().toISOString()
    const quizId = Math.max(...this.quizzes.map(q => q.id), 0) + 1

    const quiz: Quiz = {
      id: quizId,
      title: data.title,
      description: data.description,
      passingCriteria: data.passingCriteria,
      createdBy,
      createdAt: now,
      updatedAt: now
    }

    this.quizzes.push(quiz)

    // Add questions
    data.questions.forEach((q, index) => {
      const question: Question = {
        id: Math.max(...this.questions.map(q => q.id), 0) + 1 + index,
        quizId,
        type: q.type,
        text: q.text,
        options: q.options,
        correctAnswers: q.correctAnswers,
        createdAt: now,
        updatedAt: now
      }
      this.questions.push(question)
    })

    return this.getQuizById(quizId)!
  }

  deleteQuiz(id: number): boolean {
    const quizIndex = this.quizzes.findIndex(q => q.id === id)
    if (quizIndex === -1) return false

    this.quizzes.splice(quizIndex, 1)
    this.questions = this.questions.filter(q => q.quizId !== id)
    this.attempts = this.attempts.filter(a => a.quizId !== id)
    return true
  }

  // Attempt methods
  getAttempts(): QuizAttempt[] {
    return this.attempts.map(attempt => ({
      ...attempt,
      quiz: this.getQuizById(attempt.quizId)!
    }))
  }

  submitQuizAttempt(data: SubmitQuizRequest, userId: number): QuizAttempt {
    const quiz = this.getQuizById(data.quizId)
    if (!quiz || !quiz.questions) throw new Error('Quiz not found')

    const now = new Date().toISOString()
    let correctAnswers = 0

    // Calculate score
    quiz.questions.forEach(question => {
      const userAnswer = data.answers[question.id]
      if (userAnswer) {
        const userAnswerIndex = question.options.indexOf(userAnswer)
        if (question.correctAnswers.includes(userAnswerIndex)) {
          correctAnswers++
        }
      }
    })

    const totalQuestions = quiz.questions.length
    const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
    const passed = scorePercentage >= quiz.passingCriteria

    const attempt: QuizAttempt = {
      id: Math.max(...this.attempts.map(a => a.id), 0) + 1,
      quizId: data.quizId,
      userId,
      score: correctAnswers,
      passed,
      answers: data.answers,
      duration: data.duration,
      createdAt: now,
      updatedAt: now
    }

    this.attempts.push(attempt)
    return attempt
  }
}

// Export a singleton instance
export const db = new Database()
