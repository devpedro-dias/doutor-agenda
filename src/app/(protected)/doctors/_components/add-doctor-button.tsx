import { Button } from "@/src/_components/ui/button";
import { Dialog, DialogTrigger } from "@/src/_components/ui/dialog";
import UpsertDoctorForm from "./upsert-doctor-form";
import { PlusIcon } from "lucide-react";

const AddDoctorButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon /> Adicionar Medico
        </Button>
      </DialogTrigger>
      <UpsertDoctorForm />
    </Dialog>
  );
};

export default AddDoctorButton;
