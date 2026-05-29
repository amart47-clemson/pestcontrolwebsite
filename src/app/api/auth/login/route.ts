import { NextResponse } from "next/server"
import {
  SESSION_COOKIE,
  signSession,
  validateAdminCredentials,
} from "@/lib/auth"

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string
    password?: string
  }

  const email = body.email?.trim() ?? ""
  const password = body.password ?? ""

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    )
  }

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ user: { role: "admin" as const } })
  response.cookies.set(SESSION_COOKIE, signSession("admin"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
