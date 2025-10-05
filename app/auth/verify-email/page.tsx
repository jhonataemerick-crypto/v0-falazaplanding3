"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendSuccess(false)
    setResendError(null)

    try {
      const supabase = createClient()

      // Get the current user's email from the session (if available)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user?.email) {
        setResendError("Não foi possível encontrar seu email. Por favor, tente criar a conta novamente.")
        return
      }

      // Resend confirmation email
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        throw error
      }

      setResendSuccess(true)
    } catch (err: any) {
      setResendError(err.message || "Erro ao reenviar email")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verifique seu email</CardTitle>
          <CardDescription>Enviamos um link de confirmação para o seu email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p>Clique no link de confirmação que enviamos para o seu email para ativar sua conta</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p>Após confirmar, você será redirecionado automaticamente para escolher seu plano</p>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p>Não encontrou o email? Verifique sua caixa de spam ou lixo eletrônico</p>
            </div>
          </div>

          {resendSuccess && (
            <div className="p-3 text-sm bg-green-500/10 border border-green-500/20 rounded-md text-green-600 dark:text-green-400">
              Email reenviado com sucesso! Verifique sua caixa de entrada.
            </div>
          )}

          {resendError && (
            <div className="p-3 text-sm bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
              {resendError}
            </div>
          )}

          <Button
            onClick={handleResendEmail}
            variant="outline"
            className="w-full bg-transparent"
            disabled={isResending || resendSuccess}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reenviando...
              </>
            ) : resendSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Email enviado
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Reenviar email de confirmação
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <div className="text-sm text-center text-muted-foreground">
            Já confirmou seu email?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Fazer login
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
