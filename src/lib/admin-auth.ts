import { cookies } from "next/headers"
import { SESSION_COOKIE, verifySession } from "@/lib/auth"

export async function requireAdmin() {
  const cookieStore = await cookies()
  const user = verifySession(cookieStore.get(SESSION_COOKIE)?.value)

  if (!user || user.role !== "admin") {
    return null
  }

  return user
}
