import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { WhoBenefitsSection } from "@/components/who-benefits-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { SocialProofSection } from "@/components/social-proof-section"
import { PricingSection } from "@/components/pricing-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { ChatWidget } from "@/components/chat-widget"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />

        <WhoBenefitsSection />

        <div className="container mx-auto px-4 py-16">
          {/* Seções organizadas em duas colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="space-y-8">
              <HowItWorksSection />
            </div>
            <div className="space-y-8">
              <SocialProofSection />
            </div>
          </div>

          {/* Seções que ocupam largura total */}
          <div className="space-y-16">
            <PricingSection />
            <FAQSection />
            <CTASection />
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
