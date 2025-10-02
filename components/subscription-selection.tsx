"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, Crown, Building } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para testar e pequenos negócios",
    icon: Zap,
    features: [
      "100 mensagens por mês",
      "1 número do WhatsApp",
      "IA básica em português",
      "Suporte por email",
      "Dashboard básico",
    ],
    recommended: false,
  },
  {
    name: "Pro",
    price: "R$ 97",
    period: "/mês",
    description: "Ideal para empresas em crescimento",
    icon: Crown,
    features: [
      "5.000 mensagens por mês",
      "3 números do WhatsApp",
      "IA avançada + treinamento personalizado",
      "Integração com CRM",
      "Analytics completo",
      "Suporte prioritário",
      "Automações avançadas",
    ],
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Para grandes empresas e agências",
    icon: Building,
    features: [
      "Mensagens ilimitadas",
      "Números ilimitados",
      "IA personalizada para sua marca",
      "Integrações customizadas",
      "Gerente de conta dedicado",
      "SLA garantido",
      "Treinamento da equipe",
    ],
    recommended: false,
  },
]

interface SubscriptionSelectionProps {
  onSelectPlan: (planName: string) => void
}

export function SubscriptionSelection({ onSelectPlan }: SubscriptionSelectionProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">Escolha seu plano</h2>
        <p className="text-muted-foreground">Selecione o plano ideal para começar sua jornada com o FalaZap</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative flex flex-col ${plan.recommended ? "border-primary shadow-lg" : "border-border"}`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">Recomendado</Badge>
              </div>
            )}

            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3 mx-auto">
                <plan.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm text-pretty">{plan.description}</CardDescription>
              <div className="mt-3">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-pretty">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => onSelectPlan(plan.name)}
                className={`w-full ${plan.recommended ? "bg-primary hover:bg-primary/90" : ""}`}
                variant={plan.recommended ? "default" : "outline"}
              >
                Começar Grátis
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Todos os planos incluem teste grátis de 14 dias • Cancele quando quiser
        </p>
      </div>
    </div>
  )
}
