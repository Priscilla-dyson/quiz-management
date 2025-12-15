// Database Types and Interfaces

export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'student'
  password: string // hashed password
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: number
  email: string
  name: string
  role: 'ADMIN' | 'STUDENT'
}

export interface Question {
  id: number
  quizId: number
  type: 'multiple-choice' | 'true-false'
  text: string
  options: string[]
  correctAnswers: number[]
  createdAt: string
  updatedAt: string
}

export interface Quiz {
  id: number
  title: string
  description: string
  passingCriteria: number // percentage
  createdBy: number // user id
  createdAt: string
  updatedAt: string
  questions?: Question[]
  attempts?: QuizAttempt[]
}

export interface QuizAttempt {
  id: number
  quizId: number
  userId: number
  score: number // number of correct answers
  passed: boolean
  answers: { [questionId: number]: string } // questionId -> selected answer
  duration?: number // in minutes
  createdAt: string
  updatedAt: string
}

// API Request/Response types
export interface CreateQuizRequest {
  title: string
  description: string
  passingCriteria: number
  questions: {
    type: 'multiple-choice' | 'true-false'
    text: string
    options: string[]
    correctAnswers: number[]
  }[]
}

export interface SubmitQuizRequest {
  quizId: number
  answers: { [questionId: number]: string }
  duration?: number
}

export interface QuizAttemptResponse {
  id: number
  quizId: number
  userId: number
  score: number
  passed: boolean
  answers: { [questionId: number]: string }
  duration?: number
  createdAt: string
  quiz: Quiz
}
