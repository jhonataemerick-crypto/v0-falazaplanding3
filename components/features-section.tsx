import { Bot, Users, BarChart3, Globe, Headphones, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Bot,
    title: "Atendimento automatizado",
    description: "IA responde perguntas frequentes, agenda compromissos e resolve problemas básicos automaticamente.",
  },
  {
    icon: Users,
    title: "Qualificação de leads",
    description: "Identifica leads quentes, coleta informações importantes e direciona para o time de vendas.",
  },
  {
    icon: BarChart3,
    title: "Integração com CRM",
    description: "Sincroniza conversas e dados com seu CRM favorito. Hubspot, RD Station, Pipedrive e mais.",
  },
  {
    icon: Globe,
    title: "Analytics em tempo real",
    description: "Dashboard completo com métricas de conversas, taxa de conversão e performance da IA.",
  },
  {
    icon: Headphones,
    title: "Suporte multilíngua",
    description: "Atende em português, inglês, espanhol e outros idiomas. Perfeito para negócios internacionais.",
  },
  {
    icon: Zap,
    title: "Automações avançadas",
    description: "Crie fluxos personalizados, envie campanhas e integre com ferramentas de marketing.",
  },
]

export function FeaturesSection() {
  return (
    <section id="recursos" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">Recursos que fazem a diferença</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Tudo que você precisa para automatizar e escalar seu atendimento no WhatsApp
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg text-balance">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pretty">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
