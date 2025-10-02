import { createClient } from "@/lib/supabase/server"

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

export async function createSubscription(data: {
  userId: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  planName: string
  planPrice: number
  status?: string
  trialEndsAt?: Date
  currentPeriodStart?: Date
  currentPeriodEnd?: Date
}) {
  const supabase = await createClient()

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: data.userId,
      stripe_customer_id: data.stripeCustomerId || null,
      stripe_subscription_id: data.stripeSubscriptionId || null,
      plan_name: data.planName,
      plan_price: data.planPrice,
      status: data.status || "active",
      trial_ends_at: data.trialEndsAt?.toISOString() || null,
      current_period_start: data.currentPeriodStart?.toISOString() || null,
      current_period_end: data.currentPeriodEnd?.toISOString() || null,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating subscription:", error)
    throw error
  }

  return subscription
}

export async function updateSubscription(subscriptionId: string, updates: Partial<Subscription>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("id", subscriptionId)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating subscription:", error)
    throw error
  }

  return data
}

export async function updateSubscriptionByStripeId(stripeSubscriptionId: string, updates: Partial<Subscription>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating subscription by Stripe ID:", error)
    throw error
  }

  return data
}

export async function getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("[v0] Error fetching subscription:", error)
    return null
  }

  return data
}

export async function getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .single()

  if (error) {
    console.error("[v0] Error fetching subscription by Stripe ID:", error)
    return null
  }

  return data
}

export { getSubscriptionByUserId as getUserSubscription }
