"use client"

import { QuoteModal } from "@/components/quote/quote-modal"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FloatingCta } from "@/components/floating-cta"
import Hero from "@/components/ui/hero-button-expendable"
import { ServicesSection } from "@/components/sections/services-section"
import { WhyUsSection } from "@/components/sections/why-us-section"
import { ProcessSection } from "@/components/sections/process-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { FaqSection } from "@/components/sections/faq-section"
import { ContactSection } from "@/components/sections/contact-section"

export function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ServicesSection />
        <WhyUsSection />
        <ProcessSection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <FloatingCta />
      <QuoteModal />
    </>
  )
}
