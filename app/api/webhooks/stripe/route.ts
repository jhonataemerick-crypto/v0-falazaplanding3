import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import {
  updateSubscriptionByStripeId,
  createSubscription,
  getSubscriptionByStripeId,
} from "@/lib/supabase/subscriptions"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  console.log("[v0] ========== STRIPE WEBHOOK RECEIVED ==========")
  console.log("[v0] Timestamp:", new Date().toISOString())
  console.log("[v0] URL:", req.url)

  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  console.log("[v0] Request body length:", body.length)
  console.log("[v0] Signature present:", !!signature)
  console.log("[v0] Webhook secret configured:", !!webhookSecret)

  if (!signature) {
    console.error("[v0] ❌ No signature header found in request")
    return NextResponse.json({ error: "No signature header" }, { status: 400 })
  }

  if (!webhookSecret) {
    console.error("[v0] ❌ STRIPE_WEBHOOK_SECRET not configured in environment variables")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log("[v0] ✅ Webhook signature verified successfully")
  } catch (err: any) {
    console.error("[v0] ❌ Webhook signature verification failed:", err.message)
    console.error("[v0] Error type:", err.type)
    console.error("[v0] Error code:", err.code)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log("[v0] ========================================")
  console.log("[v0] Event Type:", event.type)
  console.log("[v0] Event ID:", event.id)
  console.log("[v0] ========================================")

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        console.log("[v0] 💳 CHECKOUT SESSION COMPLETED")
        console.log("[v0] Session ID:", session.id)
        console.log("[v0] Customer:", session.customer)
        console.log("[v0] Subscription:", session.subscription)
        console.log("[v0] Payment status:", session.payment_status)
        console.log("[v0] Metadata:", JSON.stringify(session.metadata, null, 2))

        if (session.subscription && session.customer) {
          let subscription: Stripe.Subscription
          try {
            subscription = await stripe.subscriptions.retrieve(session.subscription as string)
            console.log("[v0] ✅ Retrieved subscription from Stripe:", subscription.id)
            console.log("[v0] Subscription status:", subscription.status)
            console.log(
              "[v0] Trial end:",
              subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : "No trial",
            )
          } catch (stripeError: any) {
            console.error("[v0] ❌ Failed to retrieve subscription from Stripe:", stripeError.message)
            throw stripeError
          }

          const userId = session.metadata?.userId
          const planName = session.metadata?.planName
          const planPrice = session.metadata?.planPrice

          console.log("[v0] Extracted metadata:")
          console.log("[v0]   - User ID:", userId)
          console.log("[v0]   - Plan Name:", planName)
          console.log("[v0]   - Plan Price:", planPrice)

          if (userId && planName && planPrice) {
            try {
              const existingSubscription = await getSubscriptionByStripeId(subscription.id)

              if (existingSubscription) {
                console.log("[v0] ⚠️ Subscription already exists in database, skipping creation")
                break
              }

              const subscriptionData = {
                userId,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscription.id,
                planName,
                planPrice: Number.parseFloat(planPrice),
                status: subscription.status,
                trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              }

              console.log(
                "[v0] Creating subscription in database with data:",
                JSON.stringify(subscriptionData, null, 2),
              )

              await createSubscription(subscriptionData)

              console.log("[v0] ✅✅✅ SUBSCRIPTION CREATED SUCCESSFULLY ✅✅✅")
              console.log("[v0] User ID:", userId)
              console.log("[v0] Stripe Subscription ID:", subscription.id)
            } catch (dbError: any) {
              console.error("[v0] ❌❌❌ DATABASE ERROR ❌❌❌")
              console.error("[v0] Error message:", dbError.message)
              console.error("[v0] Error code:", dbError.code)
              console.error("[v0] Error details:", dbError.details)
              console.error("[v0] Full error:", JSON.stringify(dbError, null, 2))
              throw dbError
            }
          } else {
            console.error("[v0] ❌ Missing required metadata")
            console.error("[v0] userId:", userId || "MISSING")
            console.error("[v0] planName:", planName || "MISSING")
            console.error("[v0] planPrice:", planPrice || "MISSING")
          }
        } else {
          console.error("[v0] ❌ Missing subscription or customer in session")
          console.error("[v0] subscription:", session.subscription || "MISSING")
          console.error("[v0] customer:", session.customer || "MISSING")
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("[v0] Subscription updated:", subscription.id)
        console.log("[v0] New status:", subscription.status)

        try {
          await updateSubscriptionByStripeId(subscription.id, {
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          console.log("[v0] ✅ Subscription updated successfully in database")
        } catch (dbError: any) {
          console.error("[v0] ❌ Database error updating subscription:", dbError.message)
          throw dbError
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("[v0] Subscription deleted:", subscription.id)

        try {
          await updateSubscriptionByStripeId(subscription.id, {
            status: "canceled",
          })
          console.log("[v0] ✅ Subscription marked as canceled in database")
        } catch (dbError: any) {
          console.error("[v0] ❌ Database error canceling subscription:", dbError.message)
          throw dbError
        }
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        console.log("[v0] Payment succeeded for invoice:", invoice.id)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        console.log("[v0] Payment failed for invoice:", invoice.id)

        if (invoice.subscription) {
          try {
            await updateSubscriptionByStripeId(invoice.subscription as string, {
              status: "past_due",
            })
            console.log("[v0] ✅ Subscription marked as past_due in database")
          } catch (dbError: any) {
            console.error("[v0] ❌ Database error updating subscription status:", dbError.message)
            throw dbError
          }
        }
        break
      }

      default:
        console.log("[v0] ℹ️ Unhandled event type:", event.type)
    }

    console.log("[v0] ========== WEBHOOK PROCESSED SUCCESSFULLY ==========")
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("[v0] ========== WEBHOOK PROCESSING FAILED ==========")
    console.error("[v0] Error message:", error.message)
    console.error("[v0] Error stack:", error.stack)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
