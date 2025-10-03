"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SignupFlow } from "@/components/signup-flow"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center">
              <Image src="/falazap-logo.png" alt="FalaZap Logo" width={32} height={32} className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold text-foreground">FalaZap</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#como-funciona"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Como Funciona
            </a>
            <a
              href="#recursos"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Recursos
            </a>
            <a
              href="#precos"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Preços
            </a>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
            <SignupFlow>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Começar Grátis
              </Button>
            </SignupFlow>
          </nav>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Como Funciona
              </a>
              <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Recursos
              </a>
              <a href="#precos" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Preços
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Entrar
                  </Button>
                </Link>
                <SignupFlow>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Começar Grátis
                  </Button>
                </SignupFlow>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
