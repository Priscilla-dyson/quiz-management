'use client'

import { Toaster as Sonner } from "@/components/ui/sonner"

type ProvidersProps = {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <Sonner position="top-center" richColors />
    </>
  )
}
