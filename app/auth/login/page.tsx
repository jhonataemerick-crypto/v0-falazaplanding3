"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Loader2, AlertCircle, UserPlus, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingTestUser, setIsCreatingTestUser] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateAndLoginTestUser = async () => {
    setIsCreatingTestUser(true)
    setError(null)

    try {
      console.log("[v0] Creating test user...")

      // Chamar API para criar usuário de teste
      const response = await fetch("/api/create-test-user", {
        method: "POST",
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erro ao criar usuário de teste")
      }

      console.log("[v0] Test user created/exists, logging in...")

      // Fazer login com as credenciais de teste
      const supabase = createClient()
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: result.credentials.email,
        password: result.credentials.password,
      })

      if (loginError) {
        throw loginError
      }

      console.log("[v0] Test user logged in successfully:", data.user?.email)

      // Redirecionar para a página de assinatura
      await new Promise((resolve) => setTimeout(resolve, 200))
      router.push("/assinatura")
      router.refresh()
    } catch (err: any) {
      console.error("[v0] Error creating/logging test user:", err)
      setError(err.message || "Erro ao criar usuário de teste")
    } finally {
      setIsCreatingTestUser(false)
    }
  }

  const handleTestLogin = () => {
    setEmail("teste@teste.com")
    setPassword("teste123")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      console.log("[v0] Attempting login with Supabase...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Login error:", error)
        if (error.message === "Invalid login credentials") {
          throw new Error("Email ou senha incorretos. Verifique suas credenciais ou crie uma conta.")
        }
        throw error
      }

      console.log("[v0] Login successful, user:", data.user?.email)

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
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-blue-700 mb-1">Teste Rápido</div>
                <div className="text-xs text-blue-600/80 mb-3">
                  Crie um usuário de teste automaticamente e experimente todas as funcionalidades
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleCreateAndLoginTestUser}
              disabled={isCreatingTestUser || isLoading}
            >
              {isCreatingTestUser ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando usuário de teste...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Criar e entrar com usuário de teste
                </>
              )}
            </Button>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou entre com sua conta</span>
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
                disabled={isLoading || isCreatingTestUser}
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
                disabled={isLoading || isCreatingTestUser}
                minLength={6}
              />
            </div>
            {error && (
              <div className="p-3 text-sm bg-destructive/10 border border-destructive/20 rounded-md space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-destructive text-sm">{error}</p>
                </div>
                {error.includes("incorretos") && (
                  <Link href="/auth/signup" className="block">
                    <Button type="button" variant="outline" size="sm" className="w-full bg-transparent">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Criar conta agora
                    </Button>
                  </Link>
                )}
              </div>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading || isCreatingTestUser}>
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
          <div className="w-full">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou</span>
              </div>
            </div>
          </div>
          <Link href="/auth/signup" className="w-full">
            <Button type="button" variant="outline" size="lg" className="w-full bg-transparent">
              <UserPlus className="w-4 h-4 mr-2" />
              Criar conta grátis
            </Button>
          </Link>
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
