"use server";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/db";
import { medicalSpecialtiesTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

// Mapeamento de especialidades com descrições
const MEDICAL_SPECIALTIES_DATA = [
  {
    name: "Alergologia",
    description:
      "Especialidade médica que trata de alergias e doenças do sistema imunológico",
  },
  {
    name: "Anestesiologia",
    description:
      "Especialidade responsável pela anestesia e cuidados perioperatórios",
  },
  {
    name: "Angiologia",
    description:
      "Especialidade que trata das doenças dos vasos sanguíneos e linfáticos",
  },
  {
    name: "Cancerologia",
    description: "Especialidade médica dedicada ao tratamento do câncer",
  },
  {
    name: "Cardiologia",
    description:
      "Especialidade médica que trata das doenças do coração e aparelho circulatório",
  },
  {
    name: "Cirurgia Cardiovascular",
    description:
      "Especialidade cirúrgica dedicada ao coração e vasos sanguíneos",
  },
  {
    name: "Cirurgia de Cabeça e Pescoço",
    description: "Especialidade cirúrgica da região da cabeça e pescoço",
  },
  {
    name: "Cirurgia do Aparelho Digestivo",
    description: "Especialidade cirúrgica do sistema digestivo",
  },
  {
    name: "Cirurgia Geral",
    description: "Especialidade cirúrgica geral e procedimentos básicos",
  },
  {
    name: "Cirurgia Pediátrica",
    description: "Especialidade cirúrgica dedicada a crianças",
  },
  {
    name: "Cirurgia Plástica",
    description: "Especialidade cirúrgica de reconstrução e estética",
  },
  {
    name: "Cirurgia Torácica",
    description: "Especialidade cirúrgica do tórax e órgãos torácicos",
  },
  {
    name: "Cirurgia Vascular",
    description: "Especialidade cirúrgica dos vasos sanguíneos",
  },
  {
    name: "Clínica Médica",
    description: "Especialidade médica geral e cuidados primários",
  },
  {
    name: "Dermatologia",
    description: "Especialidade médica da pele, cabelos e unhas",
  },
  {
    name: "Endocrinologia e Metabologia",
    description: "Especialidade das glândulas endócrinas e metabolismo",
  },
  {
    name: "Endoscopia",
    description: "Especialidade de exames endoscópicos",
  },
  {
    name: "Gastroenterologia",
    description: "Especialidade médica do aparelho digestivo",
  },
  {
    name: "Geriatria",
    description: "Especialidade médica dedicada aos idosos",
  },
  {
    name: "Ginecologia e Obstetrícia",
    description: "Especialidade da saúde feminina e obstetrícia",
  },
  {
    name: "Hematologia e Hemoterapia",
    description: "Especialidade médica do sangue e seus distúrbios",
  },
  {
    name: "Hepatologia",
    description: "Especialidade médica do fígado",
  },
  {
    name: "Homeopatia",
    description:
      "Especialidade médica alternativa baseada em princípios homeopáticos",
  },
  {
    name: "Infectologia",
    description: "Especialidade médica das doenças infecciosas",
  },
  {
    name: "Mastologia",
    description: "Especialidade médica dedicada às mamas",
  },
  {
    name: "Medicina de Emergência",
    description: "Especialidade médica de emergência e urgência",
  },
  {
    name: "Medicina do Esporte",
    description:
      "Especialidade médica dedicada aos atletas e atividades físicas",
  },
  {
    name: "Medicina do Trabalho",
    description: "Especialidade médica da saúde ocupacional",
  },
  {
    name: "Medicina de Família e Comunidade",
    description: "Especialidade médica da atenção primária e comunitária",
  },
  {
    name: "Medicina Física e Reabilitação",
    description: "Especialidade médica de reabilitação física",
  },
  {
    name: "Medicina Intensiva",
    description: "Especialidade médica de cuidados intensivos",
  },
  {
    name: "Medicina Legal e Perícia Médica",
    description: "Especialidade médica legal e pericial",
  },
  {
    name: "Nefrologia",
    description: "Especialidade médica dos rins e sistema urinário",
  },
  {
    name: "Neurocirurgia",
    description: "Especialidade cirúrgica do sistema nervoso",
  },
  {
    name: "Neurologia",
    description: "Especialidade médica do sistema nervoso",
  },
  {
    name: "Nutrologia",
    description: "Especialidade médica da nutrição clínica",
  },
  {
    name: "Oftalmologia",
    description: "Especialidade médica dos olhos",
  },
  {
    name: "Oncologia Clínica",
    description: "Especialidade médica do tratamento clínico do câncer",
  },
  {
    name: "Ortopedia e Traumatologia",
    description: "Especialidade médica dos ossos e articulações",
  },
  {
    name: "Otorrinolaringologia",
    description: "Especialidade médica de ouvido, nariz e garganta",
  },
  {
    name: "Patologia",
    description: "Especialidade médica da anatomia patológica",
  },
  {
    name: "Patologia Clínica/Medicina Laboratorial",
    description: "Especialidade médica de análises clínicas",
  },
  {
    name: "Pediatria",
    description: "Especialidade médica dedicada a crianças",
  },
  {
    name: "Pneumologia",
    description: "Especialidade médica do aparelho respiratório",
  },
  {
    name: "Psiquiatria",
    description: "Especialidade médica da saúde mental",
  },
  {
    name: "Radiologia e Diagnóstico por Imagem",
    description: "Especialidade médica de diagnóstico por imagem",
  },
  {
    name: "Radioterapia",
    description: "Especialidade médica de tratamento por radiação",
  },
  {
    name: "Reumatologia",
    description: "Especialidade médica das doenças reumáticas",
  },
  {
    name: "Urologia",
    description:
      "Especialidade médica do aparelho urinário masculino e feminino",
  },
];

export const seedMedicalSpecialtiesAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.clinic) {
    throw new Error("No clinic selected");
  }

  // Verificar se o usuário é OWNER ou MANAGER
  const userRole = session.user.clinics?.find(
    (clinic) => clinic.id === session.user.clinic?.id,
  )?.role;

  if (userRole !== "OWNER" && userRole !== "MANAGER") {
    throw new Error("Only clinic owners and managers can seed specialties");
  }

  const clinicId = session.user.clinic.id;
  let createdCount = 0;

  try {
    // Inserir cada especialidade médica
    for (const specialtyData of MEDICAL_SPECIALTIES_DATA) {
      // Verificar se já existe
      const existing = await db
        .select({ id: medicalSpecialtiesTable.id })
        .from(medicalSpecialtiesTable)
        .where(eq(medicalSpecialtiesTable.name, specialtyData.name))
        .limit(1);

      if (existing.length === 0) {
        // Criar especialidade se não existir
        await db.insert(medicalSpecialtiesTable).values({
          name: specialtyData.name,
          description: specialtyData.description,
          clinicId: clinicId,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        createdCount++;
      }
    }

    return {
      success: true,
      message: `${createdCount} especialidades médicas criadas com sucesso`,
      createdCount,
    };
  } catch {
    throw new Error("Erro ao criar especialidades médicas");
  }
};
