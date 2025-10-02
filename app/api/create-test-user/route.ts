import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Usar o service role key para ter permissões de admin
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const testEmail = "teste@teste.com"
    const testPassword = "teste123"

    // Verificar se o usuário já existe
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUsers?.users.some((user) => user.email === testEmail)

    if (userExists) {
      return NextResponse.json(
        {
          success: true,
          message: "Usuário de teste já existe",
          credentials: { email: testEmail, password: testPassword },
        },
        { status: 200 },
      )
    }

    // Criar o usuário de teste
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        name: "Usuário Teste",
      },
    })

    if (authError) {
      console.error("[v0] Error creating test user:", authError)
      throw authError
    }

    console.log("[v0] Test user created successfully:", authData.user.id)

    // Criar perfil para o usuário
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: authData.user.id,
      name: "Usuário Teste",
      email: testEmail,
    })

    if (profileError) {
      console.error("[v0] Error creating profile:", profileError)
    }

    // Criar assinatura de teste (Plano PRO)
    const { error: subscriptionError } = await supabaseAdmin.from("subscriptions").insert({
      user_id: authData.user.id,
      plan_name: "PRO",
      plan_price: 99.9,
      status: "active",
      trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
    })

    if (subscriptionError) {
      console.error("[v0] Error creating subscription:", subscriptionError)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Usuário de teste criado com sucesso",
        credentials: { email: testEmail, password: testPassword },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Error in create-test-user:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
