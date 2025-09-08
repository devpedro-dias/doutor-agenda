export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-muted-foreground">
            Histórias reais de médicos que transformaram suas práticas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                DR
              </div>
              <div className="ml-3">
                <h4 className="font-semibold">Dr. Roberto Silva</h4>
                <p className="text-sm text-muted-foreground">Cardiologista</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              &ldquo;A Dr. Agenda revolucionou minha clínica. Reduzi faltas em 95% e agora tenho muito mais tempo para meus pacientes.&rdquo;
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                DM
              </div>
              <div className="ml-3">
                <h4 className="font-semibold">Dra. Maria Santos</h4>
                <p className="text-sm text-muted-foreground">Ginecologista</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              &ldquo;Sistema intuitivo e eficiente. Meus pacientes adoram poder agendar online a qualquer hora.&rdquo;
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                DC
              </div>
              <div className="ml-3">
                <h4 className="font-semibold">Dr. Carlos Mendes</h4>
                <p className="text-sm text-muted-foreground">Pediatra</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              &ldquo;Desde que implementei o Dr. Agenda, minha produtividade aumentou significativamente.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
