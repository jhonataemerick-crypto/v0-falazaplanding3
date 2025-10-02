import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

export type Profile = {
  id: string
  email: string
  name: string | null
  phone: string | null
  company: string | null
  created_at: string
  updated_at: string
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("[v0] Error fetching profile:", error)
    return null
  }

  return data
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, "id" | "email" | "created_at" | "updated_at">>,
) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("[v0] Error updating profile:", error)
    throw error
  }

  return data
}

export async function createProfile(userId: string, email: string, name?: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      email,
      name: name || null,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating profile:", error)
    throw error
  }

  return data
}

// Client-side functions
export async function getProfileClient(userId: string): Promise<Profile | null> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("[v0] Error fetching profile:", error)
    return null
  }

  return data
}

export async function updateProfileClient(
  userId: string,
  updates: Partial<Omit<Profile, "id" | "email" | "created_at" | "updated_at">>,
) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("[v0] Error updating profile:", error)
    throw error
  }

  return data
}

export { getProfileClient as getUserProfile, updateProfileClient as updateUserProfile }
