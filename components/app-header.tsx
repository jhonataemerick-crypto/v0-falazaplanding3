"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"

export function AppHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center">
                <Image src="/falazap-logo.png" alt="FalaZap Logo" width={32} height={32} className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold text-foreground">FalaZap</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dispositivos"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dispositivos
              </Link>
              <Link
                href="/assinatura"
                className="text-sm font-medium text-foreground transition-colors border-b-2 border-primary"
              >
                Assinatura
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-primary/10">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
