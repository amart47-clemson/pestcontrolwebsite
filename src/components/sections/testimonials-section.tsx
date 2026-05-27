"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { TESTIMONIALS } from "@/lib/site-config"

export function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const t = TESTIMONIALS[index]

  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length)
  const prev = () =>
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)

  return (
    <section id="reviews" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600 mb-2">
            Customer reviews
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Neighbors recommend Pierce
          </h2>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-lg text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="text-lg sm:text-xl font-medium text-foreground leading-relaxed mb-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex flex-col items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-lg font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.location}</div>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-8">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to review ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-emerald-600" : "w-2 bg-border"
                }`}
              />
            ))}
            <button
              type="button"
              onClick={next}
              aria-label="Next review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
