"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

type QuoteSource = "hero" | "nav" | "floating" | "section" | null

type QuoteContextValue = {
  isOpen: boolean
  source: QuoteSource
  openQuote: (source?: Exclude<QuoteSource, null>) => void
  closeQuote: () => void
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [source, setSource] = useState<QuoteSource>(null)

  const openQuote = useCallback((from: Exclude<QuoteSource, null> = "nav") => {
    setSource(from)
    setIsOpen(true)
  }, [])

  const closeQuote = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => setSource(null), 500)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <QuoteContext.Provider value={{ isOpen, source, openQuote, closeQuote }}>
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) {
    throw new Error("useQuote must be used within QuoteProvider")
  }
  return ctx
}
