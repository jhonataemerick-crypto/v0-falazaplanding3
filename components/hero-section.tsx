"use client"

import { Button } from "@/components/ui/button"
import { Play, MessageCircle, Zap } from "lucide-react"
import { useState } from "react"
import { SignupFlow } from "@/components/signup-flow"

export function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-6">
              <Zap className="mr-2 h-4 w-4 text-primary" />
              Novo: Integração com WhatsApp Business API
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
              <span className="text-foreground">IA que fala com você</span>
              <br />
              <span className="text-primary">no zap</span>
            </h1>

            <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl">
              Automatize conversas no WhatsApp com inteligência artificial avançada. Respostas instantâneas 24/7,
              integração nativa e setup em menos de 5 minutos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <SignupFlow>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse-green"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Começar Grátis
                </Button>
              </SignupFlow>
              <Button variant="outline" size="lg" onClick={() => setIsVideoPlaying(true)}>
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                Setup em 5 minutos
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                Suporte em português
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {!isVideoPlaying ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl" />
                  <div className="relative bg-card border rounded-3xl p-6 shadow-2xl animate-float">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-semibold">FalaZap IA</div>
                        <div className="text-sm text-muted-foreground">Online agora</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-muted rounded-2xl rounded-bl-md p-3 max-w-xs">
                        <p className="text-sm">Olá! Como posso ajudar você hoje?</p>
                        <span className="text-xs text-muted-foreground">14:32</span>
                      </div>

                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md p-3 max-w-xs ml-auto">
                        <p className="text-sm">Quero saber sobre os planos</p>
                        <span className="text-xs text-primary-foreground/70">14:33</span>
                      </div>

                      <div className="bg-muted rounded-2xl rounded-bl-md p-3 max-w-xs">
                        <p className="text-sm">
                          Perfeito! Temos 3 planos: Gratuito (100 msgs), Pro (R$ 97/mês) e Enterprise. Qual se encaixa
                          melhor no seu negócio?
                        </p>
                        <span className="text-xs text-muted-foreground">14:33</span>
                      </div>
                    </div>

                    <div className="flex items-center mt-4 text-xs text-muted-foreground">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                      <span className="ml-2">IA digitando...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                      <p className="text-lg">Demo do FalaZap em ação</p>
                      <p className="text-sm opacity-70">Vídeo em breve</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
