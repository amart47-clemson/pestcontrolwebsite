"use client"

import { ArrowRight, Bug, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { GodRays, MeshGradient } from "@paper-design/shaders-react"
import { useQuote } from "@/contexts/quote-context"
import { SITE } from "@/lib/site-config"
export default function Hero() {
  const { isOpen, openQuote } = useQuote()

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-background px-4 sm:px-6 py-24 sm:py-28">
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <GodRays
          colorBack="#00000000"
          colors={["#a8a29e40", "#d6d3d140", "#78716c40", "#57534e40"]}
          colorBloom="#a8a29e"
          offsetX={0.85}
          offsetY={-1}
          intensity={0.5}
          spotty={0.45}
          midSize={10}
          midIntensity={0}
          density={0.38}
          bloom={0.3}
          speed={0.5}
          scale={1.6}
          frame={3332042.8159981333}
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-48 w-[min(120%,720px)] -translate-x-1/2 translate-y-1/3 opacity-25 blur-2xl"
          aria-hidden
        >
          <MeshGradient
            speed={0.4}
            colors={["#059669", "#0d9488", "#047857", "#134e4a"]}
            distortion={0.6}
            swirl={0.05}
            grainMixer={0.1}
            grainOverlay={0}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center rounded-full border border-border bg-card/60 px-3 py-1 text-sm font-medium text-foreground backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
          {SITE.licenseNote}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
        >
          {SITE.name}
          <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
            {" "}
            — pests gone for good
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl px-4 leading-relaxed"
        >
          {SITE.tagline} Ants, roaches, rodents, termites, and more — free
          estimates and fast response when you need it most.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-2"
        >
          <AnimatePresence initial={false}>
            {!isOpen && (
              <motion.div className="inline-block relative">
                <motion.div
                  style={{ borderRadius: "100px" }}
                  layout
                  layoutId="cta-card"
                  className="absolute inset-0 bg-emerald-600"
                />
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout={false}
                  type="button"
                  onClick={() => openQuote("hero")}
                  className="relative flex items-center gap-2 h-14 px-8 py-3 text-lg font-medium text-white tracking-wide hover:opacity-90 transition-opacity"
                >
                  <Bug className="w-5 h-5" />
                  Get free estimate
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <a
            href={SITE.phoneHref}
            className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base font-medium rounded-lg border border-border bg-background hover:bg-muted transition-colors"
          >
            <Phone className="w-5 h-5" />
            Call {SITE.phone}
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          {SITE.hours}
        </motion.p>
      </div>
    </section>
  )
}
