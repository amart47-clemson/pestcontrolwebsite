import { randomUUID } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import type { QuoteRequestPayload } from "@/lib/quote"

export type QuoteStatus = "pending" | "approved"

export type StoredQuote = QuoteRequestPayload & {
  id: string
  createdAt: string
  status: QuoteStatus
  scheduledDate?: string
  scheduledTimeFrame?: string
  approvedAt?: string
  customerNotifiedAt?: string
}

const QUOTES_FILE = path.join(process.cwd(), "data", "quotes.json")

function normalizeQuote(quote: StoredQuote): StoredQuote {
  return {
    ...quote,
    status: quote.status ?? "pending",
  }
}

async function readQuotes(): Promise<StoredQuote[]> {
  try {
    const raw = await readFile(QUOTES_FILE, "utf8")
    const parsed = JSON.parse(raw) as StoredQuote[]
    return Array.isArray(parsed) ? parsed.map(normalizeQuote) : []
  } catch {
    return []
  }
}

async function writeQuotes(quotes: StoredQuote[]): Promise<void> {
  await mkdir(path.dirname(QUOTES_FILE), { recursive: true })
  await writeFile(QUOTES_FILE, JSON.stringify(quotes, null, 2))
}

export async function saveQuote(
  payload: QuoteRequestPayload
): Promise<StoredQuote> {
  const quote: StoredQuote = {
    ...payload,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
  }

  const quotes = await readQuotes()
  quotes.unshift(quote)
  await writeQuotes(quotes)

  return quote
}

export async function getQuotes(): Promise<StoredQuote[]> {
  return readQuotes()
}

export async function getQuoteById(id: string): Promise<StoredQuote | null> {
  const quotes = await readQuotes()
  return quotes.find((quote) => quote.id === id) ?? null
}

export type ApproveQuoteInput = {
  scheduledDate: string
  scheduledTimeFrame: string
}

export async function approveQuote(
  id: string,
  input: ApproveQuoteInput
): Promise<StoredQuote | null> {
  const quotes = await readQuotes()
  const index = quotes.findIndex((quote) => quote.id === id)

  if (index === -1) return null

  const updated: StoredQuote = {
    ...quotes[index],
    status: "approved",
    scheduledDate: input.scheduledDate,
    scheduledTimeFrame: input.scheduledTimeFrame,
    approvedAt: new Date().toISOString(),
  }

  quotes[index] = updated
  await writeQuotes(quotes)

  return updated
}

export async function markCustomerNotified(id: string): Promise<void> {
  const quotes = await readQuotes()
  const index = quotes.findIndex((quote) => quote.id === id)
  if (index === -1) return

  quotes[index] = {
    ...quotes[index],
    customerNotifiedAt: new Date().toISOString(),
  }

  await writeQuotes(quotes)
}
