"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getUserProfile } from "@/lib/supabase/profiles-client"
import { getUserSubscription } from "@/lib/supabase/subscriptions-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Home, LogOut, Loader2 } from "lucide-react"

export function UserProfileDropdown() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userInitials, setUserInitials] = useState("")
  const [planName, setPlanName] = useState<string | null>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Load profile
      const profile = await getUserProfile(user.id)
      if (profile) {
        const name = profile.name || user.email?.split("@")[0] || "Usuário"
        setUserName(name)
        setUserEmail(profile.email || user.email || "")

        // Generate initials from name
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
        setUserInitials(initials)
      }

      // Load subscription
      const subscription = await getUserSubscription(user.id)
      if (subscription) {
        setPlanName(subscription.plan_name)
      }
    } catch (error) {
      console.error("[v0] Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt={userName} />
            <AvatarFallback className="bg-green-600 text-white text-sm font-semibold">{userInitials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-semibold leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
            {planName && <Badge className="w-fit bg-green-600 hover:bg-green-700 text-white">Plano {planName}</Badge>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/conta")} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Minha conta</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer">
          <Home className="mr-2 h-4 w-4" />
          <span>Início</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
