export function BenefitsSection() {
  return (
    <section id="beneficios" className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
            Por que escolher Dr. Agenda?
          </h2>
          <p className="text-muted-foreground text-xl">
            Benefícios comprovados que transformam sua prática médica
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Aumento de Produtividade
                </h3>
                <p className="text-muted-foreground">
                  Reduza tarefas administrativas e foque no que realmente
                  importa: seus pacientes.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-semibold">Redução de Faltas</h3>
                <p className="text-muted-foreground">
                  Lembretes automáticos reduzem faltas em até 98%.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-semibold">Melhor Experiência</h3>
                <p className="text-muted-foreground">
                  Pacientes satisfeitos retornam e indicam sua clínica.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8">
            <div className="text-center">
              <div className="text-primary mb-2 text-4xl font-bold">+150%</div>
              <p className="text-muted-foreground mb-6">
                Aumento na satisfação dos pacientes
              </p>
              <div className="text-primary mb-2 text-4xl font-bold">-80%</div>
              <p className="text-muted-foreground">
                Redução no tempo administrativo
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
