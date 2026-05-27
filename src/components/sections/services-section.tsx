"use client"

import Image from "next/image"
import { useState } from "react"
import { Home, Rat, Shield, Leaf, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { SERVICES } from "@/lib/site-config"
import { useQuote } from "@/contexts/quote-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ICONS = {
  home: Home,
  rat: Rat,
  shield: Shield,
  leaf: Leaf,
} as const

function isContainImage(service: (typeof SERVICES)[number]) {
  return "imageFit" in service && service.imageFit === "contain"
}

export function ServicesSection() {
  const [active, setActive] = useState(0)
  const { openQuote } = useQuote()
  const service = SERVICES[active]
  const Icon = ICONS[service.icon]

  return (
    <section id="services" className="py-20 sm:py-28 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600 mb-2">
            Our services
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Protection for every property
          </h2>
          <p className="mt-4 text-muted-foreground">
            Click a service to see details — each option includes a free estimate
            tailored to your property.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
            {SERVICES.map((s, i) => {
              const SIcon = ICONS[s.icon]
              const isActive = active === i
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "group text-left rounded-xl border overflow-hidden transition-all",
                    isActive
                      ? "border-emerald-600 shadow-md ring-2 ring-emerald-600/25"
                      : "border-border bg-card hover:border-emerald-600/40 hover:shadow-sm"
                  )}
                >
                  <div
                    className={cn(
                      "relative aspect-[4/3] w-full overflow-hidden",
                      isContainImage(s) ? "bg-background" : "bg-muted"
                    )}
                  >
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      className={cn(
                        isContainImage(s)
                          ? "object-contain p-2"
                          : "object-cover transition-transform duration-300",
                        !isContainImage(s) &&
                          (isActive ? "scale-105" : "group-hover:scale-105")
                      )}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div
                      className={cn(
                        "absolute inset-0 transition-colors",
                        isContainImage(s)
                          ? isActive
                            ? "ring-inset ring-2 ring-emerald-600/30"
                            : ""
                          : isActive
                            ? "bg-emerald-900/25"
                            : "bg-black/10 group-hover:bg-black/20"
                      )}
                    />
                    <span
                      className={cn(
                        "absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-sm",
                        isActive
                          ? "bg-emerald-600 text-white"
                          : "bg-black/40 text-white"
                      )}
                    >
                      <SIcon className="h-4 w-4" />
                    </span>
                  </div>
                  <div
                    className={cn(
                      "p-3",
                      isActive ? "bg-emerald-600/10" : "bg-card"
                    )}
                  >
                    <span className="font-semibold text-sm text-foreground block leading-snug">
                      {s.title}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-xl lg:sticky lg:top-24"
          >
            <div
              className={cn(
                "relative aspect-[16/10] w-full min-h-[280px]",
                isContainImage(service) && "bg-background"
              )}
            >
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                priority
                className={cn(
                  isContainImage(service)
                    ? "object-contain p-6 sm:p-10"
                    : "object-cover"
                )}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                className={cn(
                  "absolute inset-0",
                  isContainImage(service)
                    ? "bg-gradient-to-t from-black/85 via-black/50 to-transparent"
                    : "bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                )}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/90 backdrop-blur-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                </div>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-4">
                  {service.description}
                </p>
                <Button
                  className="bg-white text-emerald-800 hover:bg-emerald-50 gap-2"
                  onClick={() => openQuote("section")}
                >
                  Get estimate for this service
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
