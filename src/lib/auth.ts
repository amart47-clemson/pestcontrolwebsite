import { createHmac, timingSafeEqual } from "node:crypto"

export const SESSION_COOKIE = "pest_session"
export type UserRole = "admin"

export type AuthUser = {
  role: UserRole
}

function getAuthSecret(): string {
  return process.env.AUTH_SECRET ?? "dev-secret-change-me"
}

export function signSession(role: UserRole): string {
  return createHmac("sha256", getAuthSecret()).update(role).digest("hex")
}

export function verifySession(token: string | undefined): AuthUser | null {
  if (!token) return null

  const expected = signSession("admin")

  try {
    const tokenBuffer = Buffer.from(token)
    const expectedBuffer = Buffer.from(expected)

    if (
      tokenBuffer.length === expectedBuffer.length &&
      timingSafeEqual(tokenBuffer, expectedBuffer)
    ) {
      return { role: "admin" }
    }
  } catch {
    return null
  }

  return null
}

export function validateAdminCredentials(
  email: string,
  password: string
): boolean {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@piercepestcontrol.com"
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme"

  return email === adminEmail && password === adminPassword
}
