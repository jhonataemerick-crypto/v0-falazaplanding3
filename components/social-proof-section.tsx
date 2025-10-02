import { Star, TrendingUp, Users, MessageSquare } from "lucide-react"

const testimonials = [
  {
    name: "Maria Silva",
    role: "CEO, Loja da Maria",
    content:
      "O FalaZap revolucionou nosso atendimento! Agora respondemos 300% mais clientes e as vendas aumentaram 150%.",
    rating: 5,
  },
  {
    name: "João Santos",
    role: "Gerente, TechStart",
    content: "Setup super fácil e a IA entende perfeitamente o português brasileiro. Melhor que o ZipTalk disparado!",
    rating: 5,
  },
  {
    name: "Ana Costa",
    role: "Diretora, BeautyShop",
    content: "Economizamos 40 horas por semana em atendimento. A equipe agora foca no que realmente importa: vendas!",
    rating: 5,
  },
]

const stats = [
  {
    icon: MessageSquare,
    value: "2.5M+",
    label: "Mensagens processadas",
  },
  {
    icon: Users,
    value: "1.200+",
    label: "Empresas atendidas",
  },
  {
    icon: TrendingUp,
    value: "85%",
    label: "Aumento em conversões",
  },
]

const companies = ["TechStart", "BeautyShop", "Loja da Maria", "FastFood Express", "Consultoria Pro", "E-commerce Plus"]

export function SocialProofSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">O que nossos clientes dizem</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Empresas de todos os tamanhos confiam no FalaZap para automatizar seu WhatsApp
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 text-pretty">"{testimonial.content}"</p>
              <div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Company logos */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-8">Empresas que confiam no FalaZap:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company, index) => (
              <div key={index} className="text-lg font-semibold text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
