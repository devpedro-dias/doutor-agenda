import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/_components/ui/dialog";
import ClinicForm from "./_componets/form";
import { auth } from "@/src/lib/auth";

const ClinicFormPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/authentication");
  }
  if (!session.user.plan) {
    redirect("/");
  }

  // Verificar se o usuário já tem clínicas
  const hasClinics = session.user.clinics && session.user.clinics.length > 0;

  return (
    <div>
      <Dialog open>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Clínica</DialogTitle>
            <DialogDescription>
              Adicione uma clínica ao seu perfil para continuar.
            </DialogDescription>
          </DialogHeader>
          <ClinicForm showCancelButton={hasClinics} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicFormPage;
