"use client"

import { motion } from "framer-motion"
import { PROCESS_STEPS, SITE } from "@/lib/site-config"
import { useQuote } from "@/contexts/quote-context"
import { Button } from "@/components/ui/button"

export function ProcessSection() {
  const { openQuote } = useQuote()

  return (
    <section id="process" className="py-20 sm:py-28 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600 mb-2">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              From first call to pest-free
            </h2>
            <p className="mt-4 text-muted-foreground">
              Simple, transparent process — no surprise fees after the inspection.
            </p>
          </div>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
            onClick={() => openQuote("section")}
          >
            Start with a free estimate
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <span className="text-5xl font-bold text-emerald-600/15 absolute -top-2 right-4">
                {step.step}
              </span>
              <div className="rounded-2xl border border-border bg-card p-6 h-full pt-10">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Step {step.step}
                </span>
                <h3 className="font-semibold text-lg mt-2 mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              {i < PROCESS_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Questions before booking? Call{" "}
          <a href={SITE.phoneHref} className="font-medium text-emerald-600 hover:underline">
            {SITE.phone}
          </a>
        </p>
      </div>
    </section>
  )
}
