import twilio from "twilio"

export function isTwilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
      process.env.TWILIO_AUTH_TOKEN?.trim() &&
      process.env.TWILIO_FROM_NUMBER?.trim()
  )
}

export function formatPhoneE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, "")

  if (digits.length === 10) {
    return `+1${digits}`
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`
  }

  if (phone.trim().startsWith("+") && digits.length >= 10) {
    return `+${digits}`
  }

  return null
}

export async function sendSms(to: string, body: string): Promise<void> {
  const formatted = formatPhoneE164(to)

  if (!formatted) {
    throw new Error("Invalid phone number format.")
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  await client.messages.create({
    body,
    from: process.env.TWILIO_FROM_NUMBER,
    to: formatted,
  })
}
