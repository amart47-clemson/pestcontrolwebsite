"use client"

import { Phone, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { SITE } from "@/lib/site-config"
import { useQuote } from "@/contexts/quote-context"

export function FloatingCta() {
  const { openQuote } = useQuote()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 sm:bottom-6 sm:right-6"
    >
      <a
        href={SITE.phoneHref}
        className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-colors"
      >
        <Phone className="h-5 w-5" />
        <span className="hidden sm:inline">Call now</span>
      </a>
      <button
        type="button"
        onClick={() => openQuote("floating")}
        className="flex items-center justify-center gap-2 rounded-full bg-background border border-border px-5 py-3.5 text-sm font-semibold text-foreground shadow-lg hover:bg-muted transition-colors"
      >
        <FileText className="h-5 w-5 text-emerald-600" />
        <span className="hidden sm:inline">Free estimate</span>
      </button>
    </motion.div>
  )
}
