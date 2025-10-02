import { MessageCircle, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <MessageCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FalaZap</span>
            </div>
            <p className="text-muted-foreground mb-6 text-pretty">
              A IA que fala com você no zap. Automatize conversas no WhatsApp com inteligência artificial avançada.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                contato@falazap.com.br
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                (11) 99999-9999
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                São Paulo, Brasil
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-6">Produto</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Preços
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Integrações
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-6">Recursos</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Tutoriais
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Cases de Sucesso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Webinars
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Suporte
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-6">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4 text-pretty">
              Receba dicas sobre automação no WhatsApp e novidades do FalaZap.
            </p>
            <div className="flex space-x-2">
              <Input placeholder="Seu email" className="flex-1" />
              <Button size="sm">Assinar</Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2025 FalaZap. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacidade
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Termos
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              LGPD
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
