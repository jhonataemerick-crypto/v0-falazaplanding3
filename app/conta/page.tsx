"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { getUserProfile, updateUserProfile } from "@/lib/supabase/profiles-client"

export default function ContaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const profile = await getUserProfile(user.id)
      if (profile) {
        setName(profile.name || "")
        setEmail(profile.email || user.email || "")
      }
    } catch (error) {
      console.error("[v0] Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuário não autenticado")
      }

      await updateUserProfile(user.id, { name })

      setMessage({ type: "success", text: "Alterações salvas com sucesso!" })

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error: any) {
      console.error("[v0] Error saving profile:", error)
      setMessage({ type: "error", text: error.message || "Erro ao salvar alterações" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Minha conta</h1>
            <p className="text-muted-foreground">Gerencia as configurações e preferências de sua conta</p>
          </div>

          <Tabs defaultValue="perfil" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="perfil" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do perfil</CardTitle>
                  <CardDescription>Atualize suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" value={email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
                  </div>

                  {message && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        message.type === "success"
                          ? "bg-green-500/10 text-green-600 border border-green-500/20"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar alterações"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seguranca" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Gerencie suas configurações de segurança</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Funcionalidades de segurança em breve.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
