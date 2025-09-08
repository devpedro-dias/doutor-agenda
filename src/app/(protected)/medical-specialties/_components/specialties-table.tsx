"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Heart,
  Stethoscope,
  Eye,
  Bone,
  Baby,
  Brain,
  Lungs,
  Syringe,
  TestTube,
  Microscope,
  Pill,
  Ambulance,
  Activity,
  Shield,
  Droplet,
  Zap,
  Flower,
  Bug,
  Thermometer,
  User,
  GraduationCap,
  Hospital,
  Scale,
  Apple,
  Footprints,
  Gavel,
  Waves,
  Snowflake,
  Sparkles,
  ChefHat,
  Users,
  Camera,
  Radiation,
  Hand,
  Flask,
  Home,
  Factory,
  Dumbbell,
  Microscope as MicroscopeIcon,
} from "lucide-react";

import { Badge } from "@/src/_components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/_components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/_components/ui/table";
import { Button } from "@/src/_components/ui/button";

interface MedicalSpecialty {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SpecialtiesTableProps {
  specialties: MedicalSpecialty[];
  isLoading: boolean;
  onSpecialtyUpdated: () => void;
  onRefresh: () => void;
}

// Função para obter ícone da especialidade
const getSpecialtyIcon = (name: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "Alergologia": Flower,
    "Anestesiologia": Syringe,
    "Angiologia": Heart,
    "Cancerologia": Shield,
    "Cardiologia": Heart,
    "Cirurgia Cardiovascular": Heart,
    "Cirurgia de Cabeça e Pescoço": User,
    "Cirurgia do Aparelho Digestivo": ChefHat,
    "Cirurgia Geral": Stethoscope,
    "Cirurgia Pediátrica": Baby,
    "Cirurgia Plástica": Sparkles,
    "Cirurgia Torácica": Lungs,
    "Cirurgia Vascular": Droplet,
    "Clínica Médica": Stethoscope,
    "Dermatologia": Hand,
    "Endocrinologia e Metabologia": Snowflake,
    "Endoscopia": TestTube,
    "Gastroenterologia": ChefHat,
    "Geriatria": User,
    "Ginecologia e Obstetrícia": Users,
    "Hematologia e Hemoterapia": Droplet,
    "Hepatologia": Flask,
    "Homeopatia": Flower,
    "Infectologia": Bug,
    "Mastologia": Shield,
    "Medicina de Emergência": Ambulance,
    "Medicina do Esporte": Dumbbell,
    "Medicina do Trabalho": Factory,
    "Medicina de Família e Comunidade": Home,
    "Medicina Física e Reabilitação": Footprints,
    "Medicina Intensiva": Hospital,
    "Medicina Legal e Perícia Médica": Gavel,
    "Nefrologia": Waves,
    "Neurocirurgia": Brain,
    "Neurologia": Brain,
    "Nutrologia": Apple,
    "Oftalmologia": Eye,
    "Oncologia Clínica": Shield,
    "Ortopedia e Traumatologia": Bone,
    "Otorrinolaringologia": Thermometer,
    "Patologia": Microscope,
    "Patologia Clínica/Medicina Laboratorial": TestTube,
    "Pediatria": Baby,
    "Pneumologia": Lungs,
    "Psiquiatria": Brain,
    "Radiologia e Diagnóstico por Imagem": Camera,
    "Radioterapia": Radiation,
    "Reumatologia": Hand,
    "Urologia": Stethoscope,
  };

  const IconComponent = iconMap[name];
  return IconComponent || Stethoscope;
};

const columns = (
  onEdit: (specialty: MedicalSpecialty) => void,
  onDelete: (specialty: MedicalSpecialty) => void,
): ColumnDef<MedicalSpecialty>[] => [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const IconComponent = getSpecialtyIcon(name);
      return (
        <div className="flex items-center gap-2 font-medium">
          <IconComponent className="h-4 w-4 text-muted-foreground" />
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;
      return (
        <div className="text-muted-foreground max-w-xs truncate text-sm">
          {description || "Sem descrição"}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Ativa" : "Inativa"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criada em",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return (
        <div className="text-muted-foreground text-sm">
          {format(createdAt, "dd/MM/yyyy", { locale: ptBR })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const specialty = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(specialty)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(specialty)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {specialty.isActive ? "Desativar" : "Excluir"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function SpecialtiesTable({
  specialties,
  isLoading,
  onSpecialtyUpdated,
  onRefresh,
}: SpecialtiesTableProps) {
  const handleEdit = (specialty: MedicalSpecialty) => {
    // TODO: Implementar edição
    console.log("Editar especialidade:", specialty);
  };

  const handleDelete = (specialty: MedicalSpecialty) => {
    // TODO: Implementar exclusão
    console.log("Excluir especialidade:", specialty);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 rounded-lg border p-4"
          >
            <div className="bg-muted h-10 w-10 animate-pulse rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="bg-muted h-4 animate-pulse rounded" />
              <div className="bg-muted h-3 w-1/2 animate-pulse rounded" />
            </div>
            <div className="bg-muted h-6 w-20 animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (specialties.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Nenhuma especialidade encontrada.
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          Clique em &quot;Nova Especialidade&quot; para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criada em</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specialties.map((specialty) => (
            <TableRow key={specialty.id}>
              <TableCell>
                <div className="flex items-center gap-2 font-medium">
                  {(() => {
                    const IconComponent = getSpecialtyIcon(specialty.name);
                    return <IconComponent className="h-4 w-4 text-muted-foreground" />;
                  })()}
                  <span>{specialty.name}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {specialty.description || "Sem descrição"}
              </TableCell>
              <TableCell>
                <Badge variant={specialty.isActive ? "default" : "secondary"}>
                  {specialty.isActive ? "Ativa" : "Inativa"}
                </Badge>
              </TableCell>
              <TableCell>
                {format(specialty.createdAt, "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(specialty)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(specialty)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {specialty.isActive ? "Desativar" : "Excluir"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
