import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, Crown, Building } from "lucide-react"
import { SignupFlow } from "@/components/signup-flow"

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
    cta: "Começar Grátis",
    popular: false,
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
    cta: "Começar Teste Grátis",
    popular: true,
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
    cta: "Falar com Vendas",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="precos" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">Planos que cabem no seu bolso</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Comece grátis e escale conforme seu negócio cresce. Sem pegadinhas, sem taxas ocultas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : "border-border"}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-pretty">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-pretty">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.name === "Enterprise" ? (
                  <Button className="w-full bg-transparent" variant="outline">
                    {plan.cta}
                  </Button>
                ) : (
                  <SignupFlow>
                    <Button
                      className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </SignupFlow>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Todos os planos incluem teste grátis de 14 dias • Cancele quando quiser
          </p>
          <p className="text-sm text-muted-foreground">
            Precisa de mais mensagens?{" "}
            <a href="#" className="text-primary hover:underline">
              Fale conosco
            </a>{" "}
            para um plano customizado.
          </p>
        </div>
      </div>
    </section>
  )
}
