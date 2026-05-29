export type QuoteRequestPayload = {
  name: string
  phone: string
  email: string
  address: string
  pestType: string
  description: string
  preferredContact: string
}

export function validateQuoteRequest(body: unknown):
  | { data: QuoteRequestPayload }
  | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body." }
  }

  const record = body as Record<string, unknown>
  const name = stringField(record.name)
  const phone = stringField(record.phone)
  const address = stringField(record.address)
  const description = stringField(record.description)

  if (!name) return { error: "Name is required." }
  if (!phone) return { error: "Phone is required." }
  if (!address) return { error: "Service address is required." }
  if (!description) return { error: "Description is required." }

  return {
    data: {
      name,
      phone,
      email: stringField(record.email),
      address,
      pestType: stringField(record.pestType) || "Not sure / Multiple",
      description,
      preferredContact: stringField(record.preferredContact) || "Phone",
    },
  }
}

function stringField(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

export function formatQuoteSms(payload: QuoteRequestPayload): string {
  const lines = [
    "New Pierce Pest estimate request!",
    "",
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Address: ${payload.address}`,
    `Pest: ${payload.pestType}`,
    `Contact via: ${payload.preferredContact}`,
  ]

  if (payload.email) {
    lines.push(`Email: ${payload.email}`)
  }

  lines.push("", `Details: ${payload.description}`)

  return lines.join("\n")
}

export function formatQuoteEmailText(payload: QuoteRequestPayload): string {
  return formatQuoteSms(payload)
}

export function formatQuoteEmailHtml(payload: QuoteRequestPayload): string {
  const rows = [
    ["Name", payload.name],
    ["Phone", payload.phone],
    ["Address", payload.address],
    ["Pest type", payload.pestType],
    ["Preferred contact", payload.preferredContact],
  ]

  if (payload.email) {
    rows.push(["Email", payload.email])
  }

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;">${escapeHtml(value)}</td></tr>`
    )
    .join("")

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;max-width:640px;">
      <h2 style="margin:0 0 16px;color:#059669;">New estimate request</h2>
      <p style="margin:0 0 16px;">Someone submitted the Pierce Pest Control estimate form.</p>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px;">
        ${tableRows}
      </table>
      <h3 style="margin:0 0 8px;">Description</h3>
      <p style="margin:0;white-space:pre-wrap;">${escapeHtml(payload.description)}</p>
    </div>
  `.trim()
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
