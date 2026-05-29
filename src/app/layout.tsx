import type { Metadata } from "next"
import { Oxanium, Merriweather, Fira_Code } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
})

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
})

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Pierce Pest Control | Free Estimates & Same-Day Service",
  description:
    "Pierce Pest Control — licensed residential pest control. Free inspections for ants, roaches, rodents, termites, and more.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${oxanium.variable} ${merriweather.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
