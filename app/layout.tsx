import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "FalaZap - IA que fala com você no zap",
  description:
    "Automatize conversas no WhatsApp com inteligência artificial avançada. Respostas instantâneas 24/7, integração nativa e setup em menos de 5 minutos.",
  keywords: "WhatsApp, chatbot, IA, automação, atendimento, Brasil",
  openGraph: {
    title: "FalaZap - IA que fala com você no zap",
    description: "Automatize conversas no WhatsApp com inteligência artificial avançada",
    type: "website",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
