"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { SCHEDULE_TIME_FRAMES } from "@/lib/site-config"
import type { StoredQuote } from "@/lib/quote-storage"
import { cn } from "@/lib/utils"

type ApproveQuoteDialogProps = {
  quote: StoredQuote
  open: boolean
  onClose: () => void
}

export function ApproveQuoteDialog({
  quote,
  open,
  onClose,
}: ApproveQuoteDialogProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  )
  const [timeFrame, setTimeFrame] = useState<string>(
    SCHEDULE_TIME_FRAMES[0].label
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

  if (!open) return null

  async function handleApprove() {
    if (!selectedDate) {
      setError("Please choose a visit date.")
      return
    }

    setSubmitting(true)
    setError(null)
    setWarning(null)

    try {
      const response = await fetch(`/api/quotes/${quote.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledDate: format(selectedDate, "yyyy-MM-dd"),
          scheduledTimeFrame: timeFrame,
        }),
      })

      const result = (await response.json()) as {
        error?: string
        notifyErrors?: string[] | null
        emailSent?: boolean
        smsSent?: boolean
      }

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to approve request.")
      }

      if (result.notifyErrors?.length) {
        const sent =
          result.smsSent || result.emailSent
            ? ` Customer was ${[
                result.smsSent ? "texted" : null,
                result.emailSent ? "emailed" : null,
              ]
                .filter(Boolean)
                .join(" and ")}.`
            : ""
        setWarning(result.notifyErrors.join(" ") + sent)
        router.refresh()
        return
      }

      onClose()
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to approve request."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-labelledby="approve-dialog-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <h2
          id="approve-dialog-title"
          className="text-xl font-bold text-foreground mb-1"
        >
          Approve & schedule visit
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Confirm when you&apos;ll visit {quote.name}.
          {quote.email
            ? ` They'll get a confirmation email at ${quote.email}.`
            : " Add their email on future requests for automatic email confirmations."}{" "}
          Text messages can be turned on later with Twilio.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Visit date
            </label>
            <div className="rounded-xl border border-border p-2 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="time-frame"
              className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2"
            >
              Time window
            </label>
            <select
              id="time-frame"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {SCHEDULE_TIME_FRAMES.map((frame) => (
                <option key={frame.label} value={frame.label}>
                  {frame.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {warning && (
          <p
            className={cn(
              "mt-4 text-sm rounded-lg border border-amber-200 bg-amber-50 text-amber-900 p-3"
            )}
            role="status"
          >
            Approved and saved, but the customer was not emailed: {warning}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => void handleApprove()}
            disabled={submitting}
          >
            {submitting ? "Scheduling..." : "Approve & notify customer"}
          </Button>
        </div>
      </div>
    </div>
  )
}
