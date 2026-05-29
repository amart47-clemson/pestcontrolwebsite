import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { SESSION_COOKIE, verifySession } from "@/lib/auth"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const user = verifySession(token)

  return NextResponse.json({ user })
}
