import {
  Store,
  Scale,
  Calculator,
  Stethoscope,
  Brain,
  Newspaper,
  Users,
  Home,
  GraduationCap,
  ShoppingCart,
  Heart,
  MoreHorizontal,
} from "lucide-react"

const beneficiaries = [
  {
    icon: Store,
    title: "Empreendedores",
    description: "Automatize atendimento e vendas no WhatsApp para escalar seu negócio.",
  },
  {
    icon: Scale,
    title: "Advogados",
    description: "Agende consultas e responda dúvidas jurídicas básicas automaticamente.",
  },
  {
    icon: Calculator,
    title: "Contadores",
    description: "Organize documentos de clientes e automatize lembretes fiscais.",
  },
  {
    icon: Stethoscope,
    title: "Médicos",
    description: "Agende consultas e envie lembretes de medicamentos aos pacientes.",
  },
  {
    icon: Brain,
    title: "Psicólogos",
    description: "Gerencie agendamentos e ofereça suporte inicial aos pacientes.",
  },
  {
    icon: Newspaper,
    title: "Jornalistas",
    description: "Colete informações de fontes e organize entrevistas rapidamente.",
  },
  {
    icon: Users,
    title: "Consultores",
    description: "Qualifique leads e agende reuniões comerciais automaticamente.",
  },
  {
    icon: Home,
    title: "Corretores",
    description: "Envie informações de imóveis e agende visitas com clientes.",
  },
  {
    icon: GraduationCap,
    title: "Professores",
    description: "Comunique-se com alunos e pais, envie lembretes de aulas.",
  },
  {
    icon: ShoppingCart,
    title: "Vendedores",
    description: "Automatize follow-ups e acelere o processo de vendas.",
  },
  {
    icon: Heart,
    title: "Coaches",
    description: "Acompanhe clientes e envie motivações personalizadas diariamente.",
  },
  {
    icon: MoreHorizontal,
    title: "E muito mais",
    description: "Qualquer profissional que usa WhatsApp para se comunicar com clientes.",
  },
]

export function WhoBenefitsSection() {
  return (
    <section id="quem-se-beneficia" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">Quem pode se beneficiar do FalaZap</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Profissionais de diversas áreas já economizam horas por dia com a automação inteligente de conversas. Veja
            como o FalaZap pode transformar sua produtividade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {beneficiaries.map((beneficiary, index) => (
            <div key={index} className="group hover:scale-105 transition-transform duration-200">
              <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-muted/30 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <beneficiary.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-2 text-balance">{beneficiary.title}</h3>
                  <p className="text-muted-foreground text-sm text-pretty">{beneficiary.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/5 rounded-full">
            <span className="text-sm font-medium text-primary">Teste grátis por 7 dias</span>
          </div>
        </div>
      </div>
    </section>
  )
}
