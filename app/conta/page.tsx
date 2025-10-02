"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { getUserProfile, updateUserProfile } from "@/lib/supabase/profiles-client"

export default function ContaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
    } catch (error: any) {
      console.error("[v0] Error saving profile:", error)
      setMessage({ type: "error", text: error.message || "Erro ao salvar alterações" })
    } finally {
      setSaving(false)
    }
  }

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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Minha conta</h1>
            <p className="text-gray-600">Gerencia as configurações e preferências de sua conta</p>
          </div>

          <Tabs defaultValue="perfil" className="w-full">
            <TabsList className="bg-white border-b border-gray-200 rounded-none h-auto p-0 w-full justify-start">
              <TabsTrigger
                value="perfil"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-gray-50 px-6 py-3"
              >
                Perfil
              </TabsTrigger>
              <TabsTrigger
                value="seguranca"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-gray-50 px-6 py-3"
              >
                Segurança
              </TabsTrigger>
            </TabsList>

            <TabsContent value="perfil" className="mt-6">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-900 font-medium">
                      Nome
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-900 font-medium">
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-gray-100 border-gray-300 text-gray-600"
                    />
                  </div>

                  {message && (
                    <div
                      className={`p-4 rounded-lg text-sm flex items-start gap-3 ${
                        message.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {message.type === "success" ? (
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      )}
                      <span>{message.text}</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar alterações"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seguranca" className="mt-6">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="pt-6">
                  <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Solicite a exclusão de sua conta</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
                    </p>
                    <Button
                      variant="destructive"
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Excluir conta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
