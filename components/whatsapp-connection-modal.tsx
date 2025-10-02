"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { createDevice } from "@/lib/supabase/devices-client"
import { createClient } from "@/lib/supabase/client"

interface WhatsAppConnectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function WhatsAppConnectionModal({ open, onOpenChange, onSuccess }: WhatsAppConnectionModalProps) {
  const [countryCode, setCountryCode] = useState("+55")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleContinue = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuário não autenticado")
      }

      // Remove formatting from phone number
      const cleanPhone = phoneNumber.replace(/\D/g, "")

      if (cleanPhone.length < 10) {
        throw new Error("Número de telefone inválido")
      }

      await createDevice({
        userId: user.id,
        phoneNumber: cleanPhone,
        countryCode,
      })

      console.log("[v0] Device created successfully")

      // Reset form
      setPhoneNumber("")
      setCountryCode("+55")

      // Close modal and trigger success callback
      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error("[v0] Error creating device:", err)
      setError(err.message || "Erro ao conectar dispositivo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sincronizar WhatsApp</DialogTitle>
          <DialogDescription>Sincronize seu dispositivo para usar as funcionalidades do FalaZap</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Número do WhatsApp</Label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+55">🇧🇷 +55</SelectItem>
                  <SelectItem value="+1">🇺🇸 +1</SelectItem>
                  <SelectItem value="+351">🇵🇹 +351</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                placeholder="(99) 9 9999-9999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm bg-destructive/10 text-destructive border border-destructive/20">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleContinue} disabled={loading || !phoneNumber}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : (
              "Continuar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
