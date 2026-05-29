"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { QuoteProvider } from "@/contexts/quote-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QuoteProvider>{children}</QuoteProvider>
    </AuthProvider>
  )
}
