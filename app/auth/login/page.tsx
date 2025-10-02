"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (email === "teste@teste.com" && password === "teste123") {
        console.log("[v0] Test mode login - setting cookie and redirecting")
        document.cookie = "testMode=true; path=/; max-age=86400; SameSite=Lax"

        // Aguarda um pouco para garantir que o cookie foi salvo
        await new Promise((resolve) => setTimeout(resolve, 100))

        router.push("/assinatura")
        router.refresh()
        return
      }

      const supabase = createClient()

      console.log("[v0] Attempting login with Supabase...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Login error:", error)
        throw error
      }

      console.log("[v0] Login successful, user:", data.user?.email)

      document.cookie = "testMode=; path=/; max-age=0"

      await new Promise((resolve) => setTimeout(resolve, 200))

      console.log("[v0] Redirecting to /assinatura")
      router.push("/assinatura")
      router.refresh()
    } catch (err: any) {
      console.error("[v0] Login failed:", err)
      setError(err.message || "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Entrar no FalaZap</CardTitle>
          <CardDescription className="text-center">Entre com seu email e senha para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-700">
                <strong>Modo de Teste:</strong> Use{" "}
                <code className="bg-yellow-500/20 px-1 rounded">teste@teste.com</code> /{" "}
                <code className="bg-yellow-500/20 px-1 rounded">teste123</code> para entrar sem autenticação
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="w-4 h-4 inline mr-2" />
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                <Lock className="w-4 h-4 inline mr-2" />
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              Criar conta
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link href="/" className="text-muted-foreground hover:text-foreground hover:underline">
              Voltar para o início
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
