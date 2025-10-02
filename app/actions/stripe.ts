"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"
import { createClient } from "@/lib/supabase/server"

export async function startCheckoutSession(productId: string) {
  console.log("[v0] Starting checkout session for product:", productId)

  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    console.error("[v0] Product not found:", productId)
    throw new Error(`Product with id "${productId}" not found`)
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  console.log("[v0] User check in checkout:", {
    userId: user?.id,
    email: user?.email,
    error: authError?.message,
  })

  if (!user || authError) {
    console.error("[v0] Authentication error in checkout:", authError)
    throw new Error("User not authenticated")
  }

  console.log("[v0] Creating checkout session for user:", user.id, "product:", productId)

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      redirect_on_completion: "if_required",
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 3,
      },
      metadata: {
        userId: user.id,
        planName: product.name,
        planPrice: (product.priceInCents / 100).toString(),
      },
      customer_email: user.email,
    })

    console.log("[v0] Checkout session created successfully:", session.id)

    return session.client_secret
  } catch (err) {
    console.error("[v0] Error creating Stripe checkout session:", err)
    throw new Error("Failed to create checkout session")
  }
}
