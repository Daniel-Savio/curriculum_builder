import { z } from "zod";

// Cada schema representa os campos de UMA etapa.
// Isso permite validar só a etapa atual (não o form inteiro) ao clicar em "Próximo".

const currentYear = new Date().getFullYear();

function isFourDigitYear(value: string) {
  return /^\d{4}$/.test(value);
}

export const personalInfoSchema = z.object({
  fullName: z.string().min(3, "Qual o seu nome completo?"),
  city: z.string().min(3, "Qual a cidade em que você mora autalmente?"),
  birthDate: z.string().min(10, "Qual a data de nascimento?"),
  role: z.string().min(2, "Qual o cargo desejado ou seu objetivo?"),
});

export const contactSchema = z.object({
  email: z.string().email("E-mail inválido").optional(),
  phone: z
    .string()
    .regex(/^\(\d{2}\)9\d{4}-\d{4}$/, "Telefone inválido. Use o formato (11)91234-5678"),
});

// Uma entrada individual de experiência.
// O .refine garante: OU tem data de término, OU está marcada como emprego atual.
export const experienceEntrySchema = z
  .object({
    company: z.string().min(2, "Qual a empresa?"),
    company_city: z.string().optional(),
    position: z.string().min(2, "Qual o cargo?"),
    description: z.string().optional(),
    startDate: z
      .string()
      .min(1, "Qual a data de início dessa experiência?")
      .refine(isFourDigitYear, "Informe um ano válido (ex: 2022)")
      .refine((year) => Number(year) <= currentYear, {
        message: `O ano não pode ser maior que ${currentYear}`,
      }),
    endDate: z
      .string()
      .optional()
      .refine((year) => !year || isFourDigitYear(year), {
        message: "Informe um ano válido (ex: 2022)",
      })
      .refine((year) => !year || Number(year) <= currentYear, {
        message: `O ano não pode ser maior que ${currentYear}`,
      }),
    isCurrent: z.boolean(),
    isSelfJob: z.boolean(),
  })
  .refine((entry) => entry.isCurrent || !!entry.endDate, {
    message: "Qual a data que parou de atuar nessa experiência ou marque como sendo o emprego atual?",
    path: ["endDate"],
  })
  .refine(
    (entry) =>
      !!entry.isSelfJob ||
      !!entry.company_city,
    { message: "Por favor, em qual cidade você trabalhava?", path: ["company_city"] },
  )

export const experienceSchema = z.object({
  experiences: z
    .array(experienceEntrySchema)
    .min(1, "Adicione ao menos uma experiência"),
});

export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;

// Modelo em branco usado ao clicar em "Adicionar experiência".
export function createEmptyExperience(): ExperienceEntry {
  return {
    company: "",
    company_city: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    isSelfJob: false,
  };
}

// Opções do select de tipo de formação.
export const COURSE_TYPES = [
  "Ensino Fundamental",
  "Ensino Médio",
  "Ensino Superior",
  "Pós-Graduação",
  "Mestrado",
  "Doutorado",
  "Curso",
] as const;

// Nesses dois tipos, não faz sentido pedir "área ou curso"
export const COURSE_TYPES_WITHOUT_AREA = ["Ensino Fundamental", "Ensino Médio"] as const;
// Regra especial: quando courseType é "Curso", o período (início/término) vira carga horária — os dois formatos nunca coexistem na mesma entrada.
export const educationEntrySchema = z
  .object({
    institution: z.string().min(2, "Qual a instituição de ensino?"),
    institution_city: z.string().min(2, "Qual a cidade?").optional(),
    courseType: z.string().min(1, "Selecione o tipo de formação"),
    area: z.string().optional(),
    description: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isCurrent: z.boolean(),
    courseHours: z.string().optional(),
  })
  // Curso avulso precisa de carga horária.
  .refine((entry) => entry.courseType !== "Curso" || !!entry.courseHours, {
    message: "Quantas horas tem esse curso?",
    path: ["courseHours"],
  })
  // "Área ou curso" só é obrigatório fora do Fundamental/Médio.
  .refine(
    (entry) =>
      (COURSE_TYPES_WITHOUT_AREA as readonly string[]).includes(entry.courseType) ||
      !!entry.area,
    { message: "Qual a área ou curso?", path: ["area"] },
  )
  // Qualquer formação que NÃO seja "Curso" precisa de ano de início...
  .refine((entry) => entry.courseType === "Curso" || !!entry.startDate, {
    message: "Qual o ano de início?",
    path: ["startDate"],
  })
  // ...ano de início válido (4 dígitos)...
  .refine(
    (entry) =>
      entry.courseType === "Curso" ||
      !entry.startDate ||
      isFourDigitYear(entry.startDate),
    { message: "Informe um ano válido (ex: 2022)", path: ["startDate"] },
  )
  // ...e não maior que o ano atual.
  .refine(
    (entry) =>
      entry.courseType === "Curso" ||
      !entry.startDate ||
      Number(entry.startDate) <= currentYear,
    {
      message: `O ano não pode ser maior que ${currentYear}`,
      path: ["startDate"],
    },
  )
  // Fim: OU tem data de término, OU está em andamento (mesma regra da experiência).
  .refine(
    (entry) =>
      entry.courseType === "Curso" || entry.isCurrent || !!entry.endDate,
    {
      message: "Qual o ano de término ou marque como em andamento?",
      path: ["endDate"],
    },
  )
  .refine(
    (entry) =>
      entry.courseType === "Curso" ||
      !entry.endDate ||
      isFourDigitYear(entry.endDate),
    { message: "Informe um ano válido (ex: 2022)", path: ["endDate"] },
  )
  .refine(
    (entry) =>
      entry.courseType === "Curso" ||
      !entry.endDate ||
      Number(entry.endDate) <= currentYear,
    {
      message: `O ano não pode ser maior que ${currentYear}`,
      path: ["endDate"],
    },
  )
  .optional();

export const educationSchema = z.object({
  educations: z
    .array(educationEntrySchema)
    .min(1, "Adicione ao menos uma formação"),
});

export type EducationEntry = z.infer<typeof educationEntrySchema>;

// Modelo em branco usado ao clicar em "Adicionar formação".
export function createEmptyEducation(): EducationEntry {
  return {
    institution: "",
    institution_city: "",
    courseType: "", // vazio de propósito — força o usuário a escolher
    area: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    courseHours: "",
  };
}

// Schema completo, usado pelo resolver do useForm.
export const resumeSchema = personalInfoSchema
  .merge(contactSchema)
  .merge(experienceSchema)
  .merge(educationSchema);

export type ResumeFormData = z.infer<typeof resumeSchema>;
