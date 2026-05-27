"use client"

import { useState } from "react"
import { Menu, X, Phone, Bug } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SITE, NAV_LINKS } from "@/lib/site-config"
import { useQuote } from "@/contexts/quote-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openQuote } = useQuote()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2 font-bold text-foreground shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Bug className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline text-lg tracking-tight">{SITE.shortName}</span>
        </a>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={SITE.phoneHref}
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden xl:inline">{SITE.phone}</span>
            <span className="xl:hidden">Call</span>
          </a>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => openQuote("nav")}
          >
            Free estimate
          </Button>
          <button
            type="button"
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background"
          >
            <nav className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={SITE.phoneHref}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted flex items-center gap-2"
                )}
              >
                <Phone className="h-4 w-4" />
                {SITE.phone}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
