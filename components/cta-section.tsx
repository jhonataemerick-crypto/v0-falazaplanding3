import { Button } from "@/components/ui/button"
import { MessageCircle, ArrowRight } from "lucide-react"
import { SignupFlow } from "@/components/signup-flow"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance mb-6">
            Pronto para revolucionar seu atendimento no WhatsApp?
          </h2>
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 1.200 empresas que já automatizaram suas conversas e aumentaram suas vendas com o
            FalaZap.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <SignupFlow>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <MessageCircle className="mr-2 h-5 w-5" />
                Começar Grátis Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignupFlow>
            <Button variant="outline" size="lg">
              Agendar Demo
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2" />
              Teste grátis por 14 dias
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2" />
              Sem cartão de crédito
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2" />
              Cancele quando quiser
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
