import { Resend } from "resend"
import nodemailer from "nodemailer"

export function isOutboundEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() ||
      (process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS)
  )
}

type SendEmailOptions = {
  to: string
  subject: string
  text: string
  html: string
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<void> {
  if (process.env.RESEND_API_KEY?.trim()) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const from =
      process.env.RESEND_FROM_EMAIL?.trim() ||
      "Pierce Pest Control <onboarding@resend.dev>"

    const { error } = await resend.emails.send({ from, to, subject, text, html })
    if (error) throw new Error(error.message)
    return
  }

  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
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
      to,
      subject,
      text,
      html,
    })
    return
  }

  throw new Error(
    "Outbound email is not configured. Add RESEND_API_KEY or Gmail SMTP settings."
  )
}
