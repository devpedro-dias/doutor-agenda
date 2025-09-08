"use client";

import { Avatar, AvatarFallback } from "@/src/_components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/_components/ui/alert-dialog";
import { Badge } from "@/src/_components/ui/badge";
import { Button } from "@/src/_components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/_components/ui/card";
import { Dialog, DialogTrigger } from "@/src/_components/ui/dialog";
import { Separator } from "@/src/_components/ui/separator";
import { formatCurrencyInCents } from "@/src/_helpers/currency";
import { doctorsTable } from "@/src/db/schema";

type DoctorWithSpecialty = typeof doctorsTable.$inferSelect & {
  specialty: {
    id: string;
    name: string;
    description: string | null;
    clinicId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};
import {
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  TrashIcon,
} from "lucide-react";
import { getAvailability } from "../_helpers/availability";
import UpsertDoctorForm from "./upsert-doctor-form";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { deleteDoctor } from "@/src/_actions/delete-doctor";
import { toast } from "sonner";

interface DoctorCardProps {
  doctor: DoctorWithSpecialty;
  onSuccess?: () => void;
}
const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const [isUpsertDoctorDialogOpen, setIsUpsertDoctorDialogOpen] =
    useState(false);

  const doctorInitials = doctor.name
    .split(" ")
    .map((name) => name.charAt(0))
    .join("");

  const availability = getAvailability(doctor);

  const deleteDoctorAction = useAction(deleteDoctor, {
    onSuccess: () => {
      toast.success("Médico deletado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao deletadar médico!");
    },
  });

  const handleDeleteDoctorClick = () => {
    if (!doctor) return;
    deleteDoctorAction.execute({
      id: doctor?.id,
    });
  };
  return (
    <Card>
      <CardHeader className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>{doctorInitials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-medium">{doctor.name}</h3>
          <p className="text-muted-foreground text-sm">
            {doctor.specialty?.name || "Especialidade não definida"}
          </p>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2 capitalize">
        <Badge variant="outline" className="flex items-center justify-center">
          <CalendarIcon />
          {availability.from.format("dddd")}{" "}
          <span className="normal-case">à</span>{" "}
          {availability.to.format("dddd")}
        </Badge>
        <Badge variant="outline" className="flex items-center justify-center">
          <ClockIcon />
          {availability.from.format("HH:mm")}{" "}
          <span className="normal-case">às</span>{" "}
          {availability.to.format("HH:mm")}
        </Badge>
        <Badge variant="outline" className="flex items-center justify-center">
          <DollarSignIcon />
          {formatCurrencyInCents(doctor.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        <Dialog
          open={isUpsertDoctorDialogOpen}
          onOpenChange={setIsUpsertDoctorDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full">Ver Detalhes</Button>
          </DialogTrigger>
          <UpsertDoctorForm
            doctor={{
              ...doctor,
              availableFromTime: availability.from.format("HH:mm:ss"),
              availableToTime: availability.to.format("HH:mm:ss"),
            }}
            onSuccess={() => setIsUpsertDoctorDialogOpen(false)}
            isOpen={isUpsertDoctorDialogOpen}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <TrashIcon />
                Deletar médico
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja deletar esse médico?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação nao pode ser revertida. Isso irá deletar o médico e
                  todas as consultas agendadas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteDoctorClick}>
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
