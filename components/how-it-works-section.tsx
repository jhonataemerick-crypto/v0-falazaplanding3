import { ArrowRight, Plug, Settings, MessageSquare } from "lucide-react"

const steps = [
  {
    icon: Plug,
    title: "Conecte seu WhatsApp",
    description: "Vincule sua conta do WhatsApp Business em segundos com nossa integração oficial.",
  },
  {
    icon: Settings,
    title: "Configure sua IA",
    description: "Personalize as respostas, defina o tom de voz e treine sua IA com informações do seu negócio.",
  },
  {
    icon: MessageSquare,
    title: "Automatize conversas",
    description: "Sua IA está pronta! Ela vai responder clientes, qualificar leads e gerar vendas 24/7.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">Como funciona?</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            3 passos simples para revolucionar seu atendimento
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6">
                    <step.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-balance">{step.title}</h3>
                  <p className="text-muted-foreground text-pretty">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-4 z-10">
                    <ArrowRight className="w-8 h-8 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
