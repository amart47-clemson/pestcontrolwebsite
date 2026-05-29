import { Suspense } from "react"
import { Bug } from "lucide-react"
import { SITE } from "@/lib/site-config"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-muted/20">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Bug className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold text-foreground">{SITE.shortName}</p>
            <p className="text-xs text-muted-foreground">Team login</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Sign in
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Access your scheduled jobs and calendar.
        </p>

        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
