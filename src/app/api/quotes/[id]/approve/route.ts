import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { notifyCustomerOfSchedule } from "@/lib/customer-notification"
import {
  approveQuote,
  getQuoteById,
  markCustomerNotified,
} from "@/lib/quote-storage"
import { SCHEDULE_TIME_FRAMES } from "@/lib/site-config"

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: Request, context: RouteContext) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const { id } = await context.params
  const quote = await getQuoteById(id)

  if (!quote) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 })
  }

  if (quote.status === "approved") {
    return NextResponse.json(
      { error: "This request is already approved." },
      { status: 400 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const record = body as Record<string, unknown>
  const scheduledDate =
    typeof record.scheduledDate === "string" ? record.scheduledDate.trim() : ""
  const scheduledTimeFrame =
    typeof record.scheduledTimeFrame === "string"
      ? record.scheduledTimeFrame.trim()
      : ""

  if (!scheduledDate) {
    return NextResponse.json(
      { error: "Please choose a visit date." },
      { status: 400 }
    )
  }

  if (!scheduledTimeFrame) {
    return NextResponse.json(
      { error: "Please choose a time window." },
      { status: 400 }
    )
  }

  const validTimeFrame = SCHEDULE_TIME_FRAMES.some(
    (frame) => frame.label === scheduledTimeFrame
  )

  if (!validTimeFrame) {
    return NextResponse.json(
      { error: "Invalid time window." },
      { status: 400 }
    )
  }

  const updated = await approveQuote(id, {
    scheduledDate,
    scheduledTimeFrame,
  })

  if (!updated) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 })
  }

  const notification = await notifyCustomerOfSchedule(updated)

  if (notification.emailSent || notification.smsSent) {
    await markCustomerNotified(id)
  }

  return NextResponse.json({
    ok: true,
    quote: updated,
    emailSent: notification.emailSent,
    smsSent: notification.smsSent,
    notifyErrors:
      notification.errors.length > 0 ? notification.errors : null,
  })
}
