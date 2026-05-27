"use client"

import { X, Shield, Clock, Leaf } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MeshGradient } from "@paper-design/shaders-react"
import { useQuote } from "@/contexts/quote-context"
import { QuoteRequestForm } from "@/components/quote/quote-request-form"
import { SITE } from "@/lib/site-config"

export function QuoteModal() {
  const { isOpen, source, closeQuote } = useQuote()
  const useLayoutAnimation = source === "hero"

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          <motion.div
            {...(useLayoutAnimation
              ? { layoutId: "cta-card" }
              : {
                  initial: { opacity: 0, scale: 0.96 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.96 },
                })}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            style={{ borderRadius: useLayoutAnimation ? "24px" : "24px" }}
            layout={useLayoutAnimation}
            className="relative flex h-full w-full overflow-hidden bg-emerald-800 sm:rounded-[24px] shadow-2xl"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none"
            >
              <MeshGradient
                speed={0.6}
                colors={["#047857", "#065f46", "#064e3b", "#14532d"]}
                distortion={0.8}
                swirl={0.1}
                grainMixer={0.15}
                grainOverlay={0}
                style={{ height: "100%", width: "100%" }}
              />
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              type="button"
              onClick={closeQuote}
              aria-label="Close"
              className="absolute right-4 top-4 sm:right-8 sm:top-8 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="relative z-10 flex flex-col lg:flex-row h-full w-full max-w-7xl mx-auto overflow-y-auto lg:overflow-hidden"
            >
              <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-16 gap-8 text-white">
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                    Tell us about your pest problem
                  </h2>
                  <p className="text-emerald-100 text-lg max-w-md">
                    {SITE.name} will call or text you to schedule a free inspection.
                    Most requests are answered within one business hour.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Shield className="w-6 h-6 text-emerald-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Licensed & insured</h3>
                      <p className="text-emerald-100/80 text-sm leading-relaxed mt-1">
                        EPA-approved products applied by trained technicians.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Clock className="w-6 h-6 text-emerald-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Same-day availability</h3>
                      <p className="text-emerald-100/80 text-sm leading-relaxed mt-1">
                        Urgent infestations? Mention it in your description.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Leaf className="w-6 h-6 text-emerald-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Family-safe options</h3>
                      <p className="text-emerald-100/80 text-sm leading-relaxed mt-1">
                        We tailor treatments for homes with kids, pets, and sensitivities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/20 hidden lg:block">
                  <p className="text-emerald-100/90 text-sm">
                    Prefer to talk now?{" "}
                    <a href={SITE.phoneHref} className="font-semibold text-white underline-offset-2 hover:underline">
                      {SITE.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-4 sm:p-12 lg:p-16 bg-black/10 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none">
                <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
                  <QuoteRequestForm idPrefix="modal" variant="modal" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
