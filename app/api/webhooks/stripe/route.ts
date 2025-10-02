import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { updateSubscriptionByStripeId, createSubscription } from "@/lib/supabase/subscriptions"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("[v0] Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log("[v0] Received Stripe webhook event:", event.type)

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        console.log("[v0] Checkout session completed:", session.id)

        // Get subscription details
        if (session.subscription && session.customer) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

          // Extract metadata from session
          const userId = session.metadata?.userId
          const planName = session.metadata?.planName
          const planPrice = session.metadata?.planPrice

          if (userId && planName && planPrice) {
            await createSubscription({
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subscription.id,
              planName,
              planPrice: Number.parseFloat(planPrice),
              status: subscription.status,
              trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            })

            console.log("[v0] Subscription created in database for user:", userId)
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("[v0] Subscription updated:", subscription.id)

        await updateSubscriptionByStripeId(subscription.id, {
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        })
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("[v0] Subscription deleted:", subscription.id)

        await updateSubscriptionByStripeId(subscription.id, {
          status: "canceled",
        })
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
          await updateSubscriptionByStripeId(invoice.subscription as string, {
            status: "past_due",
          })
        }
        break
      }

      default:
        console.log("[v0] Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("[v0] Error processing webhook:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
