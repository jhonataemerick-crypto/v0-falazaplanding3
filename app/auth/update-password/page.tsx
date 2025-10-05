"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      console.log("[v0] Checking session for password update:", session?.user?.id)

      if (!session) {
        console.error("[v0] No valid session found for password update")
        setError("Link inválido ou expirado. Por favor, solicite um novo link de recuperação.")
      } else {
        setIsValidSession(true)
      }
    }

    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    // Validações
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      console.log("[v0] Updating password...")

      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        console.error("[v0] Password update error:", error)
        throw new Error(error.message)
      }

      console.log("[v0] Password updated successfully")
      setSuccess(true)

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err: any) {
      console.error("[v0] Error updating password:", err)
      setError(err.message || "Erro ao atualizar senha")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidSession && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Link Inválido</CardTitle>
            <CardDescription className="text-center">
              O link de recuperação de senha expirou ou é inválido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/auth/forgot-password" className="w-full">
              <Button className="w-full">Solicitar novo link</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Redefinir senha</CardTitle>
          <CardDescription className="text-center">Digite sua nova senha abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Senha atualizada com sucesso!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Você será redirecionado para a página de login...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Nova senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirmar nova senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Atualizar senha
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        {!success && (
          <CardFooter>
            <Link href="/auth/login" className="w-full">
              <Button type="button" variant="outline" size="lg" className="w-full bg-transparent">
                Cancelar
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
