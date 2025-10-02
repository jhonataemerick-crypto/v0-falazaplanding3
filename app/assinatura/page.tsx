"use client"

import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Headphones,
  Bot,
  FileText,
  Languages,
  Lock,
  Shield,
  Smartphone,
  ArrowRight,
  LogOut,
  AlertCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { StripeCheckout } from "@/components/stripe-checkout"

export default function AssinaturaPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isTestMode, setIsTestMode] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const testMode = document.cookie.includes("testMode=true")
      console.log("[v0] Subscription page - test mode:", testMode)
      setIsTestMode(testMode)

      if (testMode) {
        console.log("[v0] Test mode active on subscription page")
        setIsAuthenticated(true)
        setIsLoading(false)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 100))

      try {
        const supabase = createClient()
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        console.log("[v0] Auth check on subscription page:", {
          userId: user?.id,
          email: user?.email,
          error: authError?.message,
        })

        if (!user || authError) {
          console.log("[v0] User not authenticated, redirecting to login")
          await new Promise((resolve) => setTimeout(resolve, 500))
          router.push("/auth/login")
          return
        }

        console.log("[v0] User authenticated successfully")
        setIsAuthenticated(true)
      } catch (err) {
        console.error("[v0] Error checking authentication:", err)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const features = [
    { icon: Headphones, label: "Transcrições de áudio" },
    { icon: Bot, label: "Acesso a assistente virtual" },
    { icon: FileText, label: "Resumo para transcrições longas" },
    { icon: Languages, label: "Tradução de transcrições" },
    { icon: Lock, label: "Transcrições de forma privada" },
    { icon: Shield, label: "Filtro para mensagens ofensivas" },
    { icon: Smartphone, label: "Conexão ilimitada de números" },
    { icon: ArrowRight, label: "Encaminhamento automático" },
  ]

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 19.99,
      description: "Para quem recebe poucos áudios por semana e quer experimentar a praticidade da transcrição com IA.",
      recommended: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: 49.99,
      description: "Para usuários que precisam de mais capacidade e recursos avançados de transcrição.",
      recommended: false,
    },
    {
      id: "business",
      name: "Business",
      price: 99.99,
      description: "Solução completa para equipes e empresas com alto volume de áudios.",
      recommended: false,
    },
  ]

  const handleLogout = async () => {
    try {
      if (isTestMode) {
        console.log("[v0] Logging out from test mode")
        document.cookie = "testMode=; path=/; max-age=0"
        router.push("/")
        router.refresh()
        return
      }

      console.log("[v0] Logging out from Supabase")
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("[v0] Error logging out:", err)
    }
  }

  const handleOpenCheckout = async (planId: string) => {
    setError(null)

    if (isTestMode) {
      console.log("[v0] Test mode - redirecting to dashboard")
      router.push("/dashboard")
      return
    }

    try {
      const supabase = createClient()
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      console.log("[v0] Opening checkout for plan:", planId, "User:", user?.id)

      if (!user || authError) {
        console.log("[v0] User not authenticated, redirecting to login")
        setError("Sua sessão expirou. Por favor, faça login novamente.")
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
        return
      }

      setSelectedPlanId(planId)
      setCheckoutOpen(true)
    } catch (err) {
      console.error("[v0] Error verifying authentication:", err)
      setError("Erro ao verificar autenticação. Por favor, tente novamente.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2">Assinatura</h1>
              <p className="text-muted-foreground">Escolha o plano ideal para você</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>

          {isTestMode && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div className="text-sm text-yellow-700">
                  <strong>Modo de Teste Ativo:</strong> Você está usando uma conta de teste. As funcionalidades são
                  simuladas e nenhuma cobrança real será feita.
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <Card key={plan.id} className={plan.recommended ? "border-2 border-primary shadow-lg" : "border"}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    {plan.recommended && <Badge className="bg-primary text-primary-foreground">Recomendado</Badge>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">R$ {plan.price.toFixed(2)}</span>
                      <span className="text-muted-foreground">/ mês</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={() => handleOpenCheckout(plan.id)}
                  >
                    Começar grátis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    size="lg"
                    onClick={() => handleOpenCheckout(plan.id)}
                  >
                    Assinar plano
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Teste grátis por <strong>3 dias</strong>. Cancele quando quiser.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Funcionalidades</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-medium leading-tight">{feature.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Finalizar assinatura</DialogTitle>
            <DialogDescription>
              Complete o pagamento para ativar sua assinatura com 3 dias de teste grátis.
            </DialogDescription>
          </DialogHeader>
          {selectedPlanId && <StripeCheckout productId={selectedPlanId} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
