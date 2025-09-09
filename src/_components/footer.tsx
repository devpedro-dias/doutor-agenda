import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer id="contato" className="bg-card border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <div className="bg-primary rounded-lg p-2">
                <Stethoscope className="text-primary-foreground h-6 w-6" />
              </div>
              <span className="text-foreground text-xl font-bold">
                Dr. Agenda
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Revolucionando a gestão de clínicas médicas com tecnologia de
              ponta e atendimento excepcional aos pacientes.
            </p>
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>contato@dragenda.com.br</span>
              </div>
              <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-foreground mb-4 font-semibold">Produto</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <a
                  href="#recursos"
                  className="hover:text-foreground transition-colors"
                >
                  Recursos
                </a>
              </li>
              <li>
                <a
                  href="#planos"
                  className="hover:text-foreground transition-colors"
                >
                  Planos
                </a>
              </li>
              <li>
                <a
                  href="#beneficios"
                  className="hover:text-foreground transition-colors"
                >
                  Benefícios
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Integrações
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground mb-4 font-semibold">Suporte</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Status
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2025 Dr. Agenda. Todos os direitos reservados.
          </p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Termos de Uso
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Política de Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
