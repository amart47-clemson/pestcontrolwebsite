import type { StoredQuote } from "@/lib/quote-storage"
import { QuoteRequestCard } from "@/components/quote-request-card"

export function QuoteRequestsList({ quotes }: { quotes: StoredQuote[] }) {
  const pending = quotes.filter((q) => q.status !== "approved")
  const approved = quotes.filter((q) => q.status === "approved")

  if (quotes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No estimate requests yet. New submissions from the website will show
          up here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {pending.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wider">
            Needs approval ({pending.length})
          </h3>
          {pending.map((quote) => (
            <QuoteRequestCard key={quote.id} quote={quote} />
          ))}
        </section>
      )}

      {approved.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">
            Scheduled ({approved.length})
          </h3>
          {approved.map((quote) => (
            <QuoteRequestCard key={quote.id} quote={quote} />
          ))}
        </section>
      )}
    </div>
  )
}
