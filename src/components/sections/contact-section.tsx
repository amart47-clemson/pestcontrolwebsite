"use client"

import Image from "next/image"
import { Mail, MapPin, Phone, Clock } from "lucide-react"
import { SITE } from "@/lib/site-config"
import { QuoteRequestForm } from "@/components/quote/quote-request-form"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600 mb-2">
              Contact
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Request service or ask a question
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Fill out the form with your name, address, and a description of what
              you&apos;re seeing. We&apos;ll reach out to schedule your free inspection.
            </p>

            <ul className="space-y-4 mb-8">
              <li>
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-3 text-foreground hover:text-emerald-600 transition-colors group"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-muted-foreground">Call or text</span>
                    <span className="font-semibold">{SITE.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={SITE.emailHref}
                  className="flex items-center gap-3 text-foreground hover:text-emerald-600 transition-colors group"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-muted-foreground">Email</span>
                    <span className="font-semibold">{SITE.email}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 shrink-0">
                  <MapPin className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs text-muted-foreground">Service area</span>
                  <span className="text-sm text-foreground">{SITE.serviceArea}</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 shrink-0">
                  <Clock className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs text-muted-foreground">Hours</span>
                  <span className="text-sm text-foreground">{SITE.hours}</span>
                </span>
              </li>
            </ul>

            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-muted">
              <Image
                src="/images/technician.png"
                alt="Pest control technician spraying treatment in a backyard"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-lg">
            <QuoteRequestForm idPrefix="contact" variant="inline" />
          </div>
        </div>
      </div>
    </section>
  )
}
