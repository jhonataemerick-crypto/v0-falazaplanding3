"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft, ExternalLink, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const COOLDOWN_SECONDS = 60
const COOLDOWN_KEY = "password_reset_cooldown"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  useEffect(() => {
    const checkCooldown = () => {
      const cooldownEnd = localStorage.getItem(COOLDOWN_KEY)
      if (cooldownEnd) {
        const remaining = Math.max(0, Math.floor((Number.parseInt(cooldownEnd) - Date.now()) / 1000))
        setCooldownRemaining(remaining)

        if (remaining > 0) {
          const timer = setInterval(() => {
            const newRemaining = Math.max(0, Math.floor((Number.parseInt(cooldownEnd) - Date.now()) / 1000))
            setCooldownRemaining(newRemaining)

            if (newRemaining === 0) {
              localStorage.removeItem(COOLDOWN_KEY)
              clearInterval(timer)
            }
          }, 1000)

          return () => clearInterval(timer)
        } else {
          localStorage.removeItem(COOLDOWN_KEY)
        }
      }
    }

    checkCooldown()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()

      console.log("[v0] Sending password reset email to:", email)

      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`
        : process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
          ? `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL}/auth/update-password`
          : `${window.location.origin}/auth/update-password`

      console.log("[v0] Redirect URL:", redirectUrl)

      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      console.log("[v0] Reset password response:", { data, error: resetError })

      if (resetError) {
        console.error("[v0] Password reset error:", resetError.message)
        console.error("[v0] Error code:", resetError.code)
        console.error("[v0] Error status:", resetError.status)

        if (resetError.status === 429 || resetError.code === "over_email_send_rate_limit") {
          const cooldownEnd = Date.now() + COOLDOWN_SECONDS * 1000
          localStorage.setItem(COOLDOWN_KEY, cooldownEnd.toString())
          setCooldownRemaining(COOLDOWN_SECONDS)
          throw new Error("RATE_LIMIT")
        } else if (resetError.status === 500 || resetError.code === "unexpected_failure") {
          throw new Error("SMTP_NOT_CONFIGURED")
        } else if (resetError.message.includes("Invalid email")) {
          throw new Error("Email inválido. Por favor, verifique o endereço de email.")
        } else {
          throw new Error(resetError.message)
        }
      }

      console.log("[v0] Password reset email sent successfully")
      setSuccess(true)
      setEmail("")
    } catch (err: any) {
      console.error("[v0] Error in password reset:", err)
      setError(err.message || "Erro ao enviar email de recuperação")
    } finally {
      setIsLoading(false)
    }
  }

  const isButtonDisabled = isLoading || cooldownRemaining > 0

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Esqueci minha senha</CardTitle>
          <CardDescription className="text-center">
            Digite seu email e enviaremos um link para redefinir sua senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Email enviado com sucesso!</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Verifique sua caixa de entrada e clique no link para redefinir sua senha.
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      Não encontrou o email? Verifique sua caixa de spam ou lixo eletrônico.
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para o login
                </Button>
              </Link>
            </div>
          ) : (
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
                  disabled={isButtonDisabled}
                />
              </div>

              {cooldownRemaining > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Aguarde {cooldownRemaining} segundo{cooldownRemaining !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Por segurança, há um intervalo entre tentativas de recuperação de senha.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      {error === "RATE_LIMIT" ? (
                        <>
                          <p className="text-sm font-medium text-destructive">Muitas tentativas</p>
                          <p className="text-xs text-muted-foreground">
                            Por segurança, há um limite de tentativas de recuperação de senha. Por favor, aguarde{" "}
                            {COOLDOWN_SECONDS} segundos antes de tentar novamente.
                          </p>
                        </>
                      ) : error === "SMTP_NOT_CONFIGURED" ? (
                        <>
                          <p className="text-sm font-medium text-destructive">Serviço de email não configurado</p>
                          <p className="text-xs text-muted-foreground">
                            O SMTP precisa ser configurado no Supabase para enviar emails de recuperação de senha.
                          </p>
                          <div className="mt-3 p-3 bg-background rounded border space-y-2">
                            <p className="text-xs font-medium">Como configurar:</p>
                            <ol className="text-xs space-y-1 list-decimal list-inside text-muted-foreground">
                              <li>Acesse o Supabase Dashboard</li>
                              <li>Vá em Authentication → Email Templates</li>
                              <li>Configure um provedor SMTP customizado</li>
                              <li>Teste o envio de emails</li>
                            </ol>
                            <a
                              href="https://supabase.com/docs/guides/auth/auth-smtp"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                            >
                              Ver documentação completa
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-destructive">{error}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={isButtonDisabled}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : cooldownRemaining > 0 ? (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Aguarde {cooldownRemaining}s
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar link de recuperação
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        {!success && (
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
            <Link href="/auth/login" className="w-full">
              <Button type="button" variant="outline" size="lg" className="w-full bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o login
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
