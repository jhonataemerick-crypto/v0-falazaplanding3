import { createClient } from "./client"

export interface Device {
  id: string
  user_id: string
  phone_number: string
  country_code: string
  status: "pending" | "active" | "inactive" | "disconnected"
  last_sync: string | null
  created_at: string
  updated_at: string
}

export interface CreateDeviceInput {
  userId: string
  phoneNumber: string
  countryCode: string
}

export async function getUserDevices(): Promise<Device[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("devices").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching devices:", error)
    throw error
  }

  return data || []
}

export async function createDevice(input: CreateDeviceInput): Promise<Device> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("devices")
    .insert({
      user_id: input.userId,
      phone_number: input.phoneNumber,
      country_code: input.countryCode,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating device:", error)
    throw error
  }

  return data
}

export async function updateDeviceStatus(deviceId: string, status: Device["status"]): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("devices")
    .update({
      status,
      last_sync: status === "active" ? new Date().toISOString() : undefined,
    })
    .eq("id", deviceId)

  if (error) {
    console.error("[v0] Error updating device status:", error)
    throw error
  }
}

export async function deleteDevice(deviceId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("devices").delete().eq("id", deviceId)

  if (error) {
    console.error("[v0] Error deleting device:", error)
    throw error
  }
}
