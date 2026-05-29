"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { CalendarCheck, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApproveQuoteDialog } from "@/components/approve-quote-dialog"
import type { StoredQuote } from "@/lib/quote-storage"
import { cn } from "@/lib/utils"

export function QuoteRequestCard({ quote }: { quote: StoredQuote }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const isApproved = quote.status === "approved"

  return (
    <>
      <article
        className={cn(
          "rounded-2xl border bg-card p-5 shadow-sm",
          isApproved ? "border-emerald-200" : "border-border"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-semibold text-foreground">{quote.name}</h3>
            <p className="text-sm text-muted-foreground">
              Submitted {format(new Date(quote.createdAt), "MMM d, yyyy · h:mm a")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
              {quote.pestType}
            </span>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                isApproved
                  ? "bg-emerald-600 text-white"
                  : "bg-amber-100 text-amber-900"
              )}
            >
              {isApproved ? "Approved" : "Pending"}
            </span>
          </div>
        </div>

        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="font-medium text-foreground">
              <a href={`tel:${quote.phone.replace(/\D/g, "")}`}>{quote.phone}</a>
            </dd>
          </div>
          {quote.email && (
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium text-foreground">
                <a href={`mailto:${quote.email}`}>{quote.email}</a>
              </dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Address</dt>
            <dd className="font-medium text-foreground">{quote.address}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Preferred contact</dt>
            <dd className="font-medium text-foreground">
              {quote.preferredContact}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
          {quote.description}
        </p>

        {isApproved && quote.scheduledDate && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-900">
            <CalendarCheck className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Scheduled visit</p>
              <p>
                {format(parseISO(quote.scheduledDate), "EEEE, MMMM d, yyyy")} ·{" "}
                {quote.scheduledTimeFrame}
              </p>
              {quote.customerNotifiedAt && (
                <p className="text-emerald-700/80 text-xs mt-1 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Customer notified (text and/or email)
                </p>
              )}
            </div>
          </div>
        )}

        {!isApproved && (
          <Button
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setDialogOpen(true)}
          >
            Approve & schedule visit
          </Button>
        )}
      </article>

      <ApproveQuoteDialog
        quote={quote}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  )
}
