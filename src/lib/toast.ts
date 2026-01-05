'use client'

import { toast } from "@/components/ui/use-toast"

type ToastType = 'success' | 'error' | 'warning' | 'info'

export function useToast() {
  const showToast = ({
    title,
    description,
    type = 'info',
    duration = 3000,
  }: {
    title: string
    description?: string
    type?: ToastType
    duration?: number
  }) => {
    toast({
      title,
      description,
      variant: type === 'error' ? 'destructive' : 'default',
      duration,
      className: `toast-${type}`,
    })
  }

  return { showToast }
}

// Pre-configured toast functions
export const toastSuccess = (message: string, description?: string) =>
  toast({
    title: message,
    description,
    variant: 'default',
    className: 'bg-green-50 border-green-200 text-green-800',
  })

export const toastError = (message: string, description?: string) =>
  toast({
    title: message,
    description,
    variant: 'destructive',
  })

export const toastWarning = (message: string, description?: string) =>
  toast({
    title: message,
    description,
    variant: 'default',
    className: 'bg-amber-50 border-amber-200 text-amber-800',
  })

export const toastInfo = (message: string, description?: string) =>
  toast({
    title: message,
    description,
    variant: 'default',
    className: 'bg-blue-50 border-blue-200 text-blue-800',
  })
