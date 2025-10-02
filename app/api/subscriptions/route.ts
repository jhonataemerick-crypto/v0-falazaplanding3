import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { planName, planPrice } = await request.json()

    if (!planName) {
      return NextResponse.json({ error: "Nome do plano é obrigatório" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
    }

    // Calculate trial end date (3 days from now)
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 3)

    // Create subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        plan_name: planName,
        plan_price: planPrice,
        status: "trial",
        trial_ends_at: trialEndsAt.toISOString(),
      })
      .select()
      .single()

    if (subscriptionError) {
      console.error("[v0] Error creating subscription:", subscriptionError)
      return NextResponse.json({ error: "Erro ao criar assinatura" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Assinatura criada com sucesso",
      subscription,
    })
  } catch (error) {
    console.error("[v0] Error in subscriptions:", error)
    return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 })
  }
}
