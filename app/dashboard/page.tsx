"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  Smartphone,
  TrendingUp,
  MessageSquare,
  MessageCircle,
  Settings,
  Crown,
  RefreshCw,
  CheckCircle,
  X,
} from "lucide-react"
import { getUserProfile } from "@/lib/supabase/profiles-client"
import { getUserSubscription } from "@/lib/supabase/subscriptions-client"
import { WhatsAppConnectionModal } from "@/components/whatsapp-connection-modal"
import { getUserDevices } from "@/lib/supabase/devices-client"

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [userName, setUserName] = useState("")
  const [subscription, setSubscription] = useState<any>(null)
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false)
  const [devices, setDevices] = useState<any[]>([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Mock usage data - replace with real data from your backend
  const [usageMinutes, setUsageMinutes] = useState(0)
  const totalMinutes = subscription?.plan_name === "Starter" ? 60 : subscription?.plan_name === "Pro" ? 120 : 300

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (sessionId) {
      setShowSuccessMessage(true)
      // Remove session_id from URL without page reload
      const url = new URL(window.location.href)
      url.searchParams.delete("session_id")
      window.history.replaceState({}, "", url.toString())
    }

    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Load profile
      const profile = await getUserProfile(user.id)
      if (profile) {
        setUserName(profile.name || user.email?.split("@")[0] || "Usuário")
      }

      // Load subscription
      const sub = await getUserSubscription(user.id)
      setSubscription(sub)

      const userDevices = await getUserDevices()
      setDevices(userDevices)
    } catch (error) {
      console.error("Error loading dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setTimeout(() => setRefreshing(false), 500)
  }

  const usagePercentage = (usageMinutes / totalMinutes) * 100
  const remainingMinutes = totalMinutes - usageMinutes

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Olá, {userName}.</h1>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Assinatura ativada com sucesso!</p>
                <p className="text-sm text-green-700 mt-1">
                  Sua assinatura está ativa e você pode começar a usar todos os recursos do FalaZap.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
              onClick={() => setShowSuccessMessage(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {devices.length === 0 && (
          <Card className="mb-6 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Conecte seu WhatsApp</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Adicione seu primeiro dispositivo para começar a utilizar o FalaZap.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button onClick={() => setWhatsappModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                Adicionar WhatsApp +
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Consumo do mês</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold text-gray-900">{usageMinutes} min</span>
                  <span className="text-gray-500">/ {totalMinutes}</span>
                </div>
                <Progress value={usagePercentage} className="h-2 bg-gray-200" />
              </div>
              <p className="text-sm text-gray-600">Você ainda tem {remainingMinutes} minutos disponíveis</p>
              <Button
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50 bg-transparent"
                onClick={() => router.push("/assinatura")}
              >
                <Crown className="mr-2 h-4 w-4" />
                Fazer upgrade de plano
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Fale com o assistente virtual</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-sm font-medium">Suporte ao usuário</p>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-sm font-medium">Envie áudios para transcrição</p>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-sm font-medium">Envie sua sugestão, elogio ou reclamação</p>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <Settings className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-sm font-medium">Consulte saldo e gerencie configurações</p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Me chame no:</p>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="font-medium text-sm text-gray-900">+55 (83) 99111-9781</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {subscription && (
          <Card className="mt-6 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Assinatura Ativa</CardTitle>
              <CardDescription className="text-sm">Detalhes do seu plano atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg text-gray-900">{subscription.plan_name}</p>
                  <p className="text-sm text-gray-600">R$ {subscription.plan_price.toFixed(2)} / mês</p>
                </div>
                <Badge
                  variant={subscription.status === "active" ? "default" : "secondary"}
                  className={subscription.status === "active" ? "bg-green-600" : ""}
                >
                  {subscription.status === "active" ? "Ativo" : subscription.status}
                </Badge>
              </div>
              {subscription.trial_ends_at && new Date(subscription.trial_ends_at) > new Date() && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Período de teste até {new Date(subscription.trial_ends_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <WhatsAppConnectionModal open={whatsappModalOpen} onOpenChange={setWhatsappModalOpen} onSuccess={handleRefresh} />
    </div>
  )
}
