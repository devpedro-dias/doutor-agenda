"use client";

import { useState } from "react";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  Gem,
  LayoutDashboard,
  LogOut,
  Plus,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import { switchClinic } from "@/src/_actions/switch-clinic";
import { Avatar, AvatarFallback } from "@/src/_components/ui/avatar";
import { Button } from "@/src/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/_components/ui/dropdown-menu";
import { Sidebar } from "@/src/_components/ui/sidebar";
import { Skeleton } from "@/src/_components/ui/skeleton";
import { authClient } from "@/src/lib/auth-client";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Agendamentos",
    url: "/appointments",
    icon: CalendarDays,
  },
  {
    title: "Médicos",
    url: "/doctors",
    icon: Stethoscope,
  },
  {
    title: "Pacientes",
    url: "/patients",
    icon: UsersRound,
  },
  {
    title: "Usuários",
    url: "/users",
    icon: UsersRound,
    ownerOnly: true,
  },
  {
    title: "Especialidades",
    url: "/medical-specialties",
    icon: Stethoscope,
    ownerOnly: true,
  },
];

export const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const session = authClient.useSession();
  const [isSwitchingClinic, setIsSwitchingClinic] = useState(false);

  // Verificar se o usuário é OWNER ou MANAGER em alguma clínica
  const isOwnerOrManager =
    session.data?.user.clinics?.some(
      (clinic) => clinic.role === "OWNER" || clinic.role === "MANAGER",
    ) || false;
  const userClinics = session.data?.user.clinics || [];

  // Verificar se está carregando (sem sessão ou sem clínica)
  const isLoading = !session.data?.user.clinic || isSwitchingClinic;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/authentication");
        },
      },
    });
  };

  const handleNewClinic = () => {
    router.push("/clinic-form");
  };

  const handleClinicChange = async (clinicId: string) => {
    try {
      setIsSwitchingClinic(true);
      const result = await switchClinic(clinicId);

      if (result.success) {
        // Forçar recarga completa da página para atualizar a sessão
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao trocar de clínica:", error);
      toast.error("Erro ao trocar de clínica");
      setIsSwitchingClinic(false);
    }
  };

  return (
    <Sidebar className="border-sidebar-border flex h-screen w-64 flex-col border-r">
      {/* Logo */}
      <div className="border-sidebar-border flex items-center justify-center border-b p-4">
        <Image src="/logo.svg" alt="Doutor Agenda" width={136} height={28} />
      </div>

      {/* Company Header - Clínica Atual */}
      <div className="border-sidebar-border flex items-center gap-3 border-b p-4">
        {isOwnerOrManager ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex h-auto w-full cursor-pointer items-center gap-3 rounded-md p-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col items-start">
                  {isLoading ? (
                    <>
                      <Skeleton className="mb-1 h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </>
                  ) : (
                    <>
                      <span className="truncate text-sm font-semibold">
                        {session.data?.user.clinic?.name ||
                          "Selecionar Clínica"}
                      </span>
                      <span className="text-sidebar-foreground/60 text-xs">
                        {userClinics.find(
                          (c) => c.id === session.data?.user.clinic?.id,
                        )?.role || "Clínica"}
                      </span>
                    </>
                  )}
                </div>
                <ChevronDown className="text-sidebar-foreground/60 ml-auto h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-popper-anchor-width] min-w-full"
              align="start"
            >
              {userClinics.map((clinic) => (
                <DropdownMenuItem
                  key={clinic.id}
                  onClick={() => handleClinicChange(clinic.id)}
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  <span>{clinic.name}</span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    ({clinic.role})
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={handleNewClinic}
                className="mt-1 flex items-center gap-2 border-t pt-2"
              >
                <Plus className="mx-auto h-4 w-4 text-blue-600" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex h-auto w-full items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col items-start">
              {isLoading ? (
                <>
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </>
              ) : (
                <>
                  <span className="text-sidebar-foreground truncate text-sm font-semibold">
                    {session.data?.user.clinic?.name || "Selecionar Clínica"}
                  </span>
                  <span className="text-sidebar-foreground/60 text-xs">
                    {userClinics.find(
                      (c) => c.id === session.data?.user.clinic?.id,
                    )?.role || "Clínica"}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Menu Principal */}
        <div className="mb-6">
          <h3 className="text-sidebar-foreground/60 mb-2 px-2 text-xs font-medium tracking-wider uppercase">
            Menu Principal
          </h3>
          <div className="space-y-1">
            {items
              .filter((item) => !item.ownerOnly || isOwnerOrManager)
              .map((item) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  className={cn(
                    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9 w-full justify-start gap-3 px-2",
                    pathname === item.url &&
                      "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                  asChild
                >
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                  </Link>
                </Button>
              ))}
          </div>
        </div>

        {/* Outros */}
        <div>
          <h3 className="text-sidebar-foreground/60 mb-2 px-2 text-xs font-medium tracking-wider uppercase">
            Outros
          </h3>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={cn(
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9 w-full justify-start gap-3 px-2",
                pathname === "/subscription" &&
                  "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
              asChild
            >
              <Link href="/subscription">
                <Gem className="h-4 w-4" />
                <span className="flex-1 text-left">Assinatura</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-sidebar-border border-t p-4">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col">
              <Skeleton className="mb-1 h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                {session.data?.user.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-sidebar-foreground truncate text-sm font-medium">
                {session.data?.user.name || "Usuário"}
              </span>
              <span className="text-sidebar-foreground/60 truncate text-xs">
                {session.data?.user.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8 p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Sidebar>
  );
};
