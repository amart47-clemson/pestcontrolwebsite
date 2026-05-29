import { NextResponse } from "next/server"
import { validateQuoteRequest } from "@/lib/quote"
import { saveQuote } from "@/lib/quote-storage"
import {
  isNotificationConfigured,
  sendQuoteNotification,
} from "@/lib/send-quote-notification"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const validation = validateQuoteRequest(body)
  if ("error" in validation) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  let savedQuote
  try {
    savedQuote = await saveQuote(validation.data)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save your request."

    return NextResponse.json({ error: message }, { status: 500 })
  }

  let pushSent = false
  let emailSent = false

  if (isNotificationConfigured()) {
    try {
      const result = await sendQuoteNotification(validation.data)
      pushSent = result.pushSent
      emailSent = result.emailSent
    } catch {
      // Saved successfully — notification failure should not block the customer.
    }
  }

  return NextResponse.json({
    ok: true,
    saved: true,
    id: savedQuote.id,
    pushSent,
    emailSent,
  })
}
