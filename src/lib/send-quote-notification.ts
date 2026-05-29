import { Resend } from "resend"
import nodemailer from "nodemailer"
import {
  formatQuoteEmailHtml,
  formatQuoteEmailText,
  formatQuoteSms,
  type QuoteRequestPayload,
} from "@/lib/quote"

export type NotificationResult = {
  emailSent: boolean
  pushSent: boolean
  errors: string[]
}

function getAdminEmail(): string | null {
  const email =
    process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim()
  return email || null
}

function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && getAdminEmail())
}

function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      getAdminEmail()
  )
}

function isTelegramConfigured(): boolean {
  return Boolean(
    process.env.TELEGRAM_BOT_TOKEN?.trim() &&
      process.env.TELEGRAM_CHAT_ID?.trim()
  )
}

function isNtfyConfigured(): boolean {
  return Boolean(process.env.NTFY_TOPIC?.trim())
}

export function isNotificationConfigured(): boolean {
  return (
    isResendConfigured() ||
    isSmtpConfigured() ||
    isTelegramConfigured() ||
    isNtfyConfigured()
  )
}

async function sendPushViaTelegram(payload: QuoteRequestPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()

  if (!token || !chatId) {
    throw new Error("Telegram is not configured.")
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatQuoteSms(payload),
      }),
    }
  )

  const data = (await response.json()) as { ok?: boolean; description?: string }

  if (!response.ok || !data.ok) {
    throw new Error(data.description ?? "Telegram notification failed.")
  }
}

async function sendPushViaNtfy(payload: QuoteRequestPayload): Promise<void> {
  const topic = process.env.NTFY_TOPIC?.trim()
  if (!topic) {
    throw new Error("NTFY_TOPIC is not configured.")
  }

  const server = process.env.NTFY_SERVER?.trim() || "https://ntfy.sh"
  const response = await fetch(`${server}/${topic}`, {
    method: "POST",
    headers: {
      Title: `New estimate: ${payload.name}`,
      Priority: "high",
      Tags: "bee",
    },
    body: formatQuoteSms(payload),
  })

  if (!response.ok) {
    throw new Error("ntfy push notification failed.")
  }
}

async function sendPush(payload: QuoteRequestPayload): Promise<void> {
  if (isTelegramConfigured()) {
    await sendPushViaTelegram(payload)
    return
  }

  if (isNtfyConfigured()) {
    await sendPushViaNtfy(payload)
    return
  }

  throw new Error("Push notifications are not configured.")
}

async function sendEmailViaResend(payload: QuoteRequestPayload): Promise<void> {
  const adminEmail = getAdminEmail()
  if (!adminEmail) {
    throw new Error("ADMIN_NOTIFICATION_EMAIL is not configured.")
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Pierce Pest Control <onboarding@resend.dev>"

  const { error } = await resend.emails.send({
    from,
    to: adminEmail,
    subject: `New estimate request from ${payload.name}`,
    text: formatQuoteEmailText(payload),
    html: formatQuoteEmailHtml(payload),
  })

  if (error) {
    throw new Error(error.message)
  }
}

async function sendEmailViaSmtp(payload: QuoteRequestPayload): Promise<void> {
  const adminEmail = getAdminEmail()
  if (!adminEmail) {
    throw new Error("ADMIN_NOTIFICATION_EMAIL is not configured.")
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from:
      process.env.SMTP_FROM?.trim() ||
      `Pierce Pest Control <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New estimate request from ${payload.name}`,
    text: formatQuoteEmailText(payload),
    html: formatQuoteEmailHtml(payload),
  })
}

async function sendEmail(payload: QuoteRequestPayload): Promise<void> {
  if (isResendConfigured()) {
    await sendEmailViaResend(payload)
    return
  }

  if (isSmtpConfigured()) {
    await sendEmailViaSmtp(payload)
    return
  }

  throw new Error("Email is not configured.")
}

export async function sendQuoteNotification(
  payload: QuoteRequestPayload
): Promise<NotificationResult> {
  const result: NotificationResult = {
    emailSent: false,
    pushSent: false,
    errors: [],
  }

  if (isTelegramConfigured() || isNtfyConfigured()) {
    try {
      await sendPush(payload)
      result.pushSent = true
    } catch (error) {
      result.errors.push(
        error instanceof Error ? error.message : "Failed to send push alert."
      )
    }
  }

  if (isResendConfigured() || isSmtpConfigured()) {
    try {
      await sendEmail(payload)
      result.emailSent = true
    } catch (error) {
      result.errors.push(
        error instanceof Error ? error.message : "Failed to send email."
      )
    }
  }

  if (!result.pushSent && !result.emailSent) {
    if (!isNotificationConfigured()) {
      throw new Error(
        "Notifications are not configured. Add Telegram, ntfy, Resend, or SMTP credentials."
      )
    }

    throw new Error(result.errors.join(" ") || "Unable to send notification.")
  }

  return result
}
