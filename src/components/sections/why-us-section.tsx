"use client"

import { Search, BadgeCheck, Zap, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { WHY_US } from "@/lib/site-config"

const ICONS = {
  search: Search,
  badge: BadgeCheck,
  zap: Zap,
  refresh: RefreshCw,
} as const

export function WhyUsSection() {
  return (
    <section id="why-us" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600 mb-2">
            Why Pierce Pest Control
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Local experts you can trust
          </h2>
          <p className="mt-4 text-muted-foreground">
            We combine modern treatment methods with old-fashioned accountability — so
            you always know who is coming to your door and why.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map((item, i) => {
            const Icon = ICONS[item.icon]
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-emerald-600/30 transition-all"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
