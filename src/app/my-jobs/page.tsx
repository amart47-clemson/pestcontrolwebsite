import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MyJobsCalendar } from "@/components/my-jobs-calendar"
import { QuoteModal } from "@/components/quote/quote-modal"
import { FloatingCta } from "@/components/floating-cta"
import { SESSION_COOKIE, verifySession } from "@/lib/auth"
import { getQuotes } from "@/lib/quote-storage"
import { QuoteRequestsList } from "@/components/quote-requests-list"

export default async function MyJobsPage() {
  const cookieStore = await cookies()
  const user = verifySession(cookieStore.get(SESSION_COOKIE)?.value)

  if (!user || user.role !== "admin") {
    redirect("/login?next=/my-jobs")
  }

  const quotes = await getQuotes()

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-8rem)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
          <div className="mb-8">
            <p className="text-sm font-medium text-emerald-600 mb-2">Admin</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              My Jobs
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              View your schedule at a glance. Tap a date on the calendar to see
              jobs for that day.
            </p>
          </div>

          <MyJobsCalendar quotes={quotes} />

          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              New estimate requests
            </h2>
            <QuoteRequestsList quotes={quotes} />
          </section>

          <p className="mt-10 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              Return to public site
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
      <FloatingCta />
      <QuoteModal />
    </>
  )
}
