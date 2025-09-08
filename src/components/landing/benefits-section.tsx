export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Por que escolher Dr. Agenda?
          </h2>
          <p className="text-xl text-muted-foreground">
            Benefícios comprovados que transformam sua prática médica
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">✓</div>
              <div>
                <h3 className="font-semibold text-lg">Aumento de Produtividade</h3>
                <p className="text-muted-foreground">Reduza tarefas administrativas e foque no que realmente importa: seus pacientes.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">✓</div>
              <div>
                <h3 className="font-semibold text-lg">Redução de Faltas</h3>
                <p className="text-muted-foreground">Lembretes automáticos reduzem faltas em até 98%.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">✓</div>
              <div>
                <h3 className="font-semibold text-lg">Melhor Experiência</h3>
                <p className="text-muted-foreground">Pacientes satisfeitos retornam e indicam sua clínica.</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+150%</div>
              <p className="text-muted-foreground mb-6">Aumento na satisfação dos pacientes</p>
              <div className="text-4xl font-bold text-primary mb-2">-80%</div>
              <p className="text-muted-foreground">Redução no tempo administrativo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
