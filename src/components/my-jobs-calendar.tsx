"use client"

import { useMemo, useState } from "react"
import { format, isSameDay, parseISO } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import type { StoredQuote } from "@/lib/quote-storage"
import { cn } from "@/lib/utils"

export function MyJobsCalendar({ quotes }: { quotes: StoredQuote[] }) {
  const [selected, setSelected] = useState<Date | undefined>(new Date())

  const scheduledQuotes = useMemo(
    () =>
      quotes.filter(
        (q) => q.status === "approved" && q.scheduledDate
      ),
    [quotes]
  )

  const scheduledDates = useMemo(
    () =>
      scheduledQuotes.map((q) => parseISO(q.scheduledDate!)),
    [scheduledQuotes]
  )

  const jobsForSelectedDay = useMemo(() => {
    if (!selected) return []
    return scheduledQuotes.filter((q) =>
      isSameDay(parseISO(q.scheduledDate!), selected)
    )
  }, [scheduledQuotes, selected])

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          className="mx-auto"
          modifiers={{
            scheduled: scheduledDates,
          }}
          modifiersClassNames={{
            scheduled:
              "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-emerald-600",
          }}
        />
      </div>

      <div className="flex-1 rounded-2xl border border-border bg-card p-6 min-h-[280px] w-full">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          {selected
            ? format(selected, "EEEE, MMMM d, yyyy")
            : "Select a date"}
        </h2>

        {jobsForSelectedDay.length === 0 ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            No approved visits on this day. Approve a request below and pick a
            date to add it here.
          </p>
        ) : (
          <ul className="space-y-4">
            {jobsForSelectedDay.map((job) => (
              <li
                key={job.id}
                className={cn(
                  "rounded-xl border border-emerald-100 bg-emerald-50/50 p-4"
                )}
              >
                <p className="font-semibold text-foreground">{job.name}</p>
                <p className="text-sm text-emerald-800 mt-1">
                  {job.scheduledTimeFrame}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {job.address}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {job.phone}
                  {job.email ? ` · ${job.email}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
