"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { PEST_TYPES } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-emerald-950/40 border border-emerald-300/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"

function labelClass(variant: "modal" | "inline") {
  return variant === "modal"
    ? "block text-xs font-medium text-emerald-200 mb-1.5 uppercase tracking-wider"
    : "block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider"
}

type QuoteRequestFormProps = {
  idPrefix?: string
  variant?: "modal" | "inline"
  onSuccess?: () => void
}

async function sendWeb3FormsEmail(payload: Record<string, string>) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim()
  if (!accessKey) return

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `New estimate request from ${payload.name}`,
      name: payload.name,
      email: payload.email || "noreply@piercepestcontrol.com",
      phone: payload.phone,
      address: payload.address,
      pest_type: payload.pestType,
      preferred_contact: payload.preferredContact,
      message: payload.description,
    }),
  })

  const data = (await response.json()) as { success?: boolean; message?: string }

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? "Email notification failed.")
  }
}

export function QuoteRequestForm({
  idPrefix = "quote",
  variant = "modal",
  onSuccess,
}: QuoteRequestFormProps) {
  const [step, setStep] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStep("submitting")
    setErrorMessage(null)

    const data = new FormData(e.currentTarget)
    const payload = Object.fromEntries(data.entries()) as Record<string, string>

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to submit your request.")
      }

      await sendWeb3FormsEmail(payload)

      setStep("success")
      onSuccess?.()
    } catch (error) {
      setStep("error")
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit your request. Please call us instead."
      )
    }
  }

  if (step === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "flex flex-col items-center justify-center text-center space-y-6",
          variant === "modal" ? "min-h-[420px]" : "py-12"
        )}
      >
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
          <Check className="w-10 h-10 text-white" />
        </div>
        <div>
          <h3
            className={cn(
              "text-2xl font-bold mb-2",
              variant === "modal" ? "text-white" : "text-foreground"
            )}
          >
            Request received!
          </h3>
          <p
            className={cn(
              "max-w-sm",
              variant === "modal" ? "text-emerald-100" : "text-muted-foreground"
            )}
          >
            Pierce will review your details and reach out shortly to schedule your
            free inspection.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <h3
          className={cn(
            "text-xl font-semibold",
            variant === "modal" ? "text-white" : "text-foreground"
          )}
        >
          Request a free estimate
        </h3>
        <p
          className={cn(
            "text-sm",
            variant === "modal" ? "text-emerald-200" : "text-muted-foreground"
          )}
        >
          Name, address, and a short description — we&apos;ll take it from here.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor={`${idPrefix}-name`} className={labelClass(variant)}>
            Full name *
          </label>
          <input
            required
            name="name"
            type="text"
            id={`${idPrefix}-name`}
            placeholder="John Pierce"
            className={
              variant === "modal"
                ? inputClass
                : "w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            }
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${idPrefix}-phone`} className={labelClass(variant)}>
              Phone *
            </label>
            <input
              required
              name="phone"
              type="tel"
              id={`${idPrefix}-phone`}
              placeholder="(555) 123-4567"
              className={
                variant === "modal"
                  ? inputClass
                  : "w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              }
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-email`} className={labelClass(variant)}>
              Email
            </label>
            <input
              name="email"
              type="email"
              id={`${idPrefix}-email`}
              placeholder="you@email.com"
              className={
                variant === "modal"
                  ? inputClass
                  : "w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              }
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${idPrefix}-address`} className={labelClass(variant)}>
            Service address *
          </label>
          <input
            required
            name="address"
            type="text"
            id={`${idPrefix}-address`}
            placeholder="123 Main St, City, ST 12345"
            className={
              variant === "modal"
                ? inputClass
                : "w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            }
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-pest`} className={labelClass(variant)}>
            Pest type
          </label>
          <select
            name="pestType"
            id={`${idPrefix}-pest`}
            defaultValue="Not sure / Multiple"
            className={
              variant === "modal"
                ? `${inputClass} appearance-none cursor-pointer`
                : "w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm cursor-pointer"
            }
          >
            {PEST_TYPES.map((pest) => (
              <option
                key={pest}
                value={pest}
                className={variant === "modal" ? "bg-emerald-900" : undefined}
              >
                {pest}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${idPrefix}-description`} className={labelClass(variant)}>
            What&apos;s going on? *
          </label>
          <textarea
            required
            name="description"
            id={`${idPrefix}-description`}
            rows={4}
            placeholder="Where are you seeing pests? How long has it been happening? Any bites, droppings, or damage?"
            className={
              variant === "modal"
                ? `${inputClass} resize-none`
                : "w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
            }
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-preferred`} className={labelClass(variant)}>
            Preferred contact
          </label>
          <select
            name="preferredContact"
            id={`${idPrefix}-preferred`}
            defaultValue="Phone"
            className={
              variant === "modal"
                ? `${inputClass} appearance-none cursor-pointer`
                : "w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm cursor-pointer"
            }
          >
            <option value="Phone">Phone call</option>
            <option value="Text">Text message</option>
            <option value="Email">Email</option>
          </select>
        </div>
      </div>

      <button
        disabled={step === "submitting"}
        type="submit"
        className={cn(
          "w-full flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed",
          variant === "modal"
            ? "bg-white text-emerald-800 hover:bg-emerald-50 focus:ring-4 focus:ring-emerald-500/30"
            : "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-4 focus:ring-ring/30"
        )}
      >
        {step === "submitting" ? (
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "h-4 w-4 border-2 border-t-transparent rounded-full animate-spin",
                variant === "modal" ? "border-emerald-600" : "border-primary"
              )}
            />
            Sending...
          </span>
        ) : step === "error" ? (
          "Try again"
        ) : (
          "Submit free estimate request"
        )}
      </button>

      {errorMessage && (
        <p
          className={cn(
            "text-sm text-center",
            variant === "modal" ? "text-red-200" : "text-destructive"
          )}
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <p
        className={cn(
          "text-xs text-center",
          variant === "modal" ? "text-emerald-200/60" : "text-muted-foreground"
        )}
      >
        By submitting, you agree to be contacted about your pest control request.
      </p>
    </form>
  )
}
