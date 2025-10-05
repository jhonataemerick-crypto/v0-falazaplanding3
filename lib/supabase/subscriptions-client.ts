import { createClient } from "@/lib/supabase/client"

export type Subscription = {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan_name: string
  plan_price: number
  status: string
  trial_ends_at: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle()

  if (error) {
    console.error("[v0] Error fetching subscription:", error)
    return null
  }

  return data
}
