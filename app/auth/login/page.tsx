"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Loader2, AlertCircle, UserPlus } from "lucide-react"
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
      const supabase = createClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message === "Invalid login credentials") {
          throw new Error("Email ou senha incorretos. Verifique suas credenciais ou crie uma conta.")
        }
        if (error.message.includes("Email not confirmed")) {
          throw new Error(
            "Email não confirmado. Verifique sua caixa de entrada e confirme seu email antes de fazer login.",
          )
        }
        throw new Error(error.message)
      }

      console.log("[v0] User logged in successfully:", data.user?.id)

      await new Promise((resolve) => setTimeout(resolve, 200))

      router.push("/assinatura")
      router.refresh()
    } catch (err: any) {
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
                {error.includes("não confirmado") && (
                  <Link href="/auth/verify-email" className="block">
                    <Button type="button" variant="outline" size="sm" className="w-full bg-transparent">
                      <Mail className="w-4 h-4 mr-2" />
                      Reenviar email de confirmação
                    </Button>
                  </Link>
                )}
              </div>
            )}
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
