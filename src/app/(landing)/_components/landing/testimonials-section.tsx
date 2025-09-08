export function TestimonialsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
            O que nossos clientes dizem
          </h2>
          <p className="text-muted-foreground text-xl">
            Histórias reais de médicos que transformaram suas práticas
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-card rounded-lg border p-6">
            <div className="mb-4 flex items-center">
              <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full font-bold">
                DR
              </div>
              <div className="ml-3">
                <h4 className="font-semibold">Dr. Roberto Silva</h4>
                <p className="text-muted-foreground text-sm">Cardiologista</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              &ldquo;A Dr. Agenda revolucionou minha clínica. Reduzi faltas em
              95% e agora tenho muito mais tempo para meus pacientes.&rdquo;
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="mb-4 flex items-center">
              <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full font-bold">
                DM
              </div>
              <div className="ml-3">
                <h4 className="font-semibold">Dra. Maria Santos</h4>
                <p className="text-muted-foreground text-sm">Ginecologista</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              &ldquo;Sistema intuitivo e eficiente. Meus pacientes adoram poder
              agendar online a qualquer hora.&rdquo;
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="mb-4 flex items-center">
              <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full font-bold">
                DC
              </div>
              <div className="ml-3">
                <h4 className="font-semibold">Dr. Carlos Mendes</h4>
                <p className="text-muted-foreground text-sm">Pediatra</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              &ldquo;Desde que implementei o Dr. Agenda, minha produtividade
              aumentou significativamente.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
