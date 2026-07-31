import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { SiteFooter } from "./components/footer"
import { SiteHeader } from "./components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

// Every page builds its Open Graph image from a post or publication cover, and
// those are root-relative once the bundler hashes them. Social networks need an
// absolute address, so the production origin has to be declared here. Without
// it, Next falls back to localhost and every link preview points at a machine
// that is not on the internet.
export const metadata: Metadata = {
  metadataBase: new URL("https://blog.rj11.io"),
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(
        "scroll-smooth antialiased motion-reduce:scroll-auto",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
