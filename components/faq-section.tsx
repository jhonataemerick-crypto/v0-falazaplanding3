import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Como o FalaZap se compara ao ZipTalk?",
    answer:
      "O FalaZap foi desenvolvido especificamente para o mercado brasileiro, com IA treinada em português e gírias locais. Oferecemos preços mais acessíveis, setup mais rápido e suporte em português. Além disso, nossa integração com WhatsApp Business é nativa e mais estável.",
  },
  {
    question: "Preciso de conhecimento técnico para usar?",
    answer:
      "Não! O FalaZap foi criado para ser usado por qualquer pessoa. Nossa interface é intuitiva e o setup leva menos de 5 minutos. Oferecemos tutoriais em vídeo e suporte completo em português.",
  },
  {
    question: "A IA realmente entende português brasileiro?",
    answer:
      "Sim! Nossa IA foi treinada especificamente com dados em português brasileiro, incluindo gírias, expressões regionais e o jeito único de falar do brasileiro. Ela entende contexto e responde de forma natural.",
  },
  {
    question: "Posso integrar com meu CRM atual?",
    answer:
      "Sim! Temos integrações nativas com os principais CRMs do mercado: HubSpot, RD Station, Pipedrive, Salesforce e muitos outros. Também oferecemos API para integrações customizadas.",
  },
  {
    question: "E se eu ultrapassar o limite de mensagens?",
    answer:
      "Você receberá um aviso quando estiver próximo do limite. Pode fazer upgrade do plano a qualquer momento ou comprar pacotes adicionais de mensagens. Nunca interrompemos seu atendimento.",
  },
  {
    question: "Como funciona o teste grátis?",
    answer:
      "Todos os planos pagos incluem 14 dias de teste grátis com acesso completo aos recursos. Não cobramos cartão de crédito antecipadamente. Se não gostar, pode cancelar sem custo algum.",
  },
  {
    question: "Meus dados ficam seguros?",
    answer:
      "Absolutamente! Usamos criptografia de ponta a ponta, servidores no Brasil e seguimos a LGPD rigorosamente. Seus dados e conversas são 100% privados e seguros.",
  },
  {
    question: "Posso usar em múltiplos números de WhatsApp?",
    answer:
      "Sim! Dependendo do seu plano, você pode conectar múltiplos números. O plano Pro permite até 3 números e o Enterprise é ilimitado.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">Perguntas frequentes</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Tire suas dúvidas sobre o FalaZap
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-balance">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-pretty">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Não encontrou sua resposta?</p>
          <Button variant="outline">Falar com Suporte</Button>
        </div>
      </div>
    </section>
  )
}
