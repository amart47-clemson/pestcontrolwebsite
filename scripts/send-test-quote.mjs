#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

function loadEnvFile(path) {
  if (!existsSync(path)) return

  const contents = readFileSync(path, "utf8")
  for (const line of contents.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const separator = trimmed.indexOf("=")
    if (separator === -1) continue
    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"))
loadEnvFile(resolve(process.cwd(), ".env"))

const baseUrl = process.argv[2] ?? "http://localhost:3000"

const payload = {
  name: "Test Customer",
  phone: "(555) 123-4567",
  email: "test@example.com",
  address: "123 Main St, Charleston, SC 29401",
  pestType: "Ants",
  description:
    "Test estimate request from Pierce Pest Control notification script.",
  preferredContact: "Phone",
}

const response = await fetch(`${baseUrl}/api/quote`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
})

const body = await response.json()
console.log(response.status, body)

if (!response.ok) {
  process.exit(1)
}
