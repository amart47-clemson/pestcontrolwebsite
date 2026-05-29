import { format, parseISO } from "date-fns"
import { sendEmail, isOutboundEmailConfigured } from "@/lib/email"
import { isTwilioConfigured, sendSms } from "@/lib/sms"
import { SITE } from "@/lib/site-config"
import type { StoredQuote } from "@/lib/quote-storage"

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function formatScheduledDate(date: string): string {
  try {
    return format(parseISO(date), "EEEE, MMMM d, yyyy")
  } catch {
    return date
  }
}

export function formatCustomerConfirmationText(
  quote: StoredQuote
): string {
  const dateLabel = quote.scheduledDate
    ? formatScheduledDate(quote.scheduledDate)
    : "your scheduled date"

  return [
    `Hi ${quote.name},`,
    "",
    `Good news — ${SITE.name} has confirmed your free estimate visit.`,
    "",
    `Date: ${dateLabel}`,
    `Time window: ${quote.scheduledTimeFrame}`,
    `Service address: ${quote.address}`,
    "",
    `If you need to reschedule, call us at ${SITE.phone}.`,
    "",
    `Thank you,`,
    SITE.name,
  ].join("\n")
}

export function formatCustomerConfirmationSms(quote: StoredQuote): string {
  const dateLabel = quote.scheduledDate
    ? formatScheduledDate(quote.scheduledDate)
    : "soon"

  return (
    `${SITE.name}: Your free estimate is confirmed for ${dateLabel}, ` +
    `${quote.scheduledTimeFrame}. We'll see you at ${quote.address}. ` +
    `Questions? Call ${SITE.phone}`
  )
}

export function formatCustomerConfirmationHtml(
  quote: StoredQuote
): string {
  const dateLabel = quote.scheduledDate
    ? formatScheduledDate(quote.scheduledDate)
    : "your scheduled date"

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;max-width:640px;line-height:1.5;">
      <h2 style="margin:0 0 16px;color:#059669;">Your estimate visit is confirmed</h2>
      <p style="margin:0 0 16px;">Hi ${escapeHtml(quote.name)},</p>
      <p style="margin:0 0 16px;">
        ${escapeHtml(SITE.name)} has approved your request and scheduled your free estimate.
      </p>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px;">
        <tr>
          <td style="padding:8px 12px;font-weight:600;">Date</td>
          <td style="padding:8px 12px;">${escapeHtml(dateLabel)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;font-weight:600;">Time window</td>
          <td style="padding:8px 12px;">${escapeHtml(quote.scheduledTimeFrame ?? "")}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;font-weight:600;">Address</td>
          <td style="padding:8px 12px;">${escapeHtml(quote.address)}</td>
        </tr>
      </table>
      <p style="margin:0 0 8px;">
        Questions or need to reschedule? Call
        <a href="${SITE.phoneHref}" style="color:#059669;">${escapeHtml(SITE.phone)}</a>.
      </p>
      <p style="margin:0;color:#6b7280;">— ${escapeHtml(SITE.name)}</p>
    </div>
  `.trim()
}

export type CustomerNotificationResult = {
  emailSent: boolean
  smsSent: boolean
  errors: string[]
}

export async function notifyCustomerOfSchedule(
  quote: StoredQuote
): Promise<CustomerNotificationResult> {
  const result: CustomerNotificationResult = {
    emailSent: false,
    smsSent: false,
    errors: [],
  }

  if (isTwilioConfigured() && quote.phone?.trim()) {
    try {
      await sendSms(quote.phone, formatCustomerConfirmationSms(quote))
      result.smsSent = true
    } catch (error) {
      result.errors.push(
        error instanceof Error
          ? `Text failed: ${error.message}`
          : "Text failed."
      )
    }
  }

  if (quote.email?.trim() && isOutboundEmailConfigured()) {
    try {
      await sendEmail({
        to: quote.email.trim(),
        subject: `${SITE.name} — Your estimate visit is confirmed`,
        text: formatCustomerConfirmationText(quote),
        html: formatCustomerConfirmationHtml(quote),
      })
      result.emailSent = true
    } catch (error) {
      result.errors.push(
        error instanceof Error
          ? `Email failed: ${error.message}`
          : "Email failed."
      )
    }
  }

  if (!result.emailSent && !result.smsSent) {
    if (!isTwilioConfigured() && !isOutboundEmailConfigured()) {
      result.errors.push(
        "Add RESEND_API_KEY for email and/or Twilio credentials for text messages."
      )
    } else if (!quote.email?.trim() && !isTwilioConfigured()) {
      result.errors.push(
        "Customer has no email. Add Twilio to text them at " + quote.phone
      )
    } else if (!quote.phone?.trim() && !quote.email?.trim()) {
      result.errors.push("Customer has no phone or email on file.")
    } else if (result.errors.length === 0) {
      result.errors.push(
        "Could not reach the customer. Check notification settings."
      )
    }
  }

  return result
}
