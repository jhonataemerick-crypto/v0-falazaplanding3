"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { startCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function StripeCheckout({ productId }: { productId: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const startCheckoutSessionForProduct = useCallback(async () => {
    try {
      console.log("[v0] Starting checkout session for product:", productId)
      const clientSecret = await startCheckoutSession(productId)
      console.log("[v0] Checkout session created successfully")
      return clientSecret
    } catch (err) {
      console.error("[v0] Error creating checkout session:", err)
      setError("Erro ao iniciar checkout. Por favor, tente novamente.")
      if (err instanceof Error && err.message.includes("not authenticated")) {
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      }
      throw err
    }
  }, [productId, router])

  useEffect(() => {
    const checkStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const sessionId = urlParams.get("session_id")

      if (sessionId) {
        console.log("[v0] Checkout completed, redirecting to dashboard")
        router.push("/dashboard?session_id=" + sessionId)
      }
    }

    checkStatus()
  }, [router])

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
        <p className="text-sm text-muted-foreground">Redirecionando para login...</p>
      </div>
    )
  }

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret: startCheckoutSessionForProduct,
          onComplete: () => {
            console.log("[v0] Checkout complete, redirecting to dashboard...")
            setTimeout(() => {
              router.push("/dashboard")
            }, 1000)
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
