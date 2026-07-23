import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { SiteFooter } from "./components/footer"
import { SiteHeader } from "./components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://11blog.rj11.io"),
  title: {
    default: "11blog — Notes for the quietly curious",
    template: "%s · 11blog",
  },
  description:
    "An independent journal about systems, useful objects, and the places we return to.",
  applicationName: "11blog",
  openGraph: {
    type: "website",
    siteName: "11blog",
    title: "11blog — Notes for the quietly curious",
    description:
      "An independent journal about systems, useful objects, and the places we return to.",
  },
  twitter: {
    card: "summary_large_image",
    title: "11blog — Notes for the quietly curious",
    description:
      "An independent journal about systems, useful objects, and the places we return to.",
  },
}

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
