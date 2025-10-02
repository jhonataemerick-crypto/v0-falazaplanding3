import { createClient } from "@/lib/supabase/client"

export type Profile = {
  id: string
  name: string | null
  email: string
  created_at: string
  updated_at: string
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("[v0] Error fetching profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating profile:", error)
    throw error
  }

  return data
}
