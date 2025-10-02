import { Clock, Smartphone, Globe, Zap } from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "Respostas instantâneas 24/7",
    description: "Sua IA nunca dorme. Atenda clientes a qualquer hora, todos os dias da semana.",
  },
  {
    icon: Smartphone,
    title: "Integração nativa com WhatsApp Business",
    description: "Conecte diretamente com a API oficial do WhatsApp. Sem complicações, sem intermediários.",
  },
  {
    icon: Globe,
    title: "IA treinada em português brasileiro",
    description: "Entende gírias, expressões e o jeito brasileiro de falar. Conversas naturais e fluidas.",
  },
  {
    icon: Zap,
    title: "Setup em menos de 5 minutos",
    description: "Configure sua IA em poucos cliques. Sem código, sem dor de cabeça, só resultados.",
  },
]

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">Por que escolher o FalaZap?</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            A solução mais completa para automatizar seu atendimento no WhatsApp
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-balance">{benefit.title}</h3>
              <p className="text-muted-foreground text-pretty">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
