import { Bug, Phone, Mail } from "lucide-react"
import { SITE, NAV_LINKS } from "@/lib/site-config"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 font-bold text-foreground mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Bug className="h-5 w-5" />
              </span>
              {SITE.shortName}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {SITE.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Quick links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-2 text-muted-foreground hover:text-emerald-600"
                >
                  <Phone className="h-4 w-4" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={SITE.emailHref}
                  className="flex items-center gap-2 text-muted-foreground hover:text-emerald-600"
                >
                  <Mail className="h-4 w-4" />
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p>{SITE.licenseNote}</p>
        </div>
      </div>
    </footer>
  )
}
