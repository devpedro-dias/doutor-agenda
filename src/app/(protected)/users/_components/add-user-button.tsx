"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/src/_components/ui/button";
import { Dialog, DialogTrigger } from "@/src/_components/ui/dialog";

import UpsertUserForm from "./upsert-user-form";

const AddUserButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar usuário
        </Button>
      </DialogTrigger>
      <UpsertUserForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} />
    </Dialog>
  );
};

export default AddUserButton;
