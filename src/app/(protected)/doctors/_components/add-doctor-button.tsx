"use client";

import { Button } from "@/src/_components/ui/button";
import { Dialog, DialogTrigger } from "@/src/_components/ui/dialog";
import UpsertDoctorForm from "./upsert-doctor-form";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

const AddDoctorButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon /> Adicionar Médico
        </Button>
      </DialogTrigger>
      <UpsertDoctorForm onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default AddDoctorButton;
